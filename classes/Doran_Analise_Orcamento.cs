using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public enum CRITERIOS_DE_ANALISE
    {
        Primeira_Compra,
        Inatividade,
        Condicao_Pagamento,
        Limite_Excedido,
        Inadimplencia,
        Faturamento_Minimo,
        Cliente_Bloqueado,
        Analise_Estoque,
        Parcela_Menor,
        Abatimento_Futuro,
        Obs_Cadastro,
        Limite_Cadastrado_no_Cliente
    };

    public class Doran_Analise_Orcamento : IDisposable
    {
        private decimal NUMERO_ORCAMENTO;
        private DataTable RESULTADO;
        private decimal CODIGO_CLIENTE;
        private decimal CODIGO_COND_PAGAMENTO;
        private decimal DIAS_INATIVIDADE;
        public DataTable dtAnalise { get; set; }
        private decimal ID_EMITENTE { get; set; }

        public Doran_Analise_Orcamento(decimal pNUMERO_ORCAMENTO, decimal pID_EMITENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var cliente = (from linha in ctx.TB_ORCAMENTO_VENDAs
                               where linha.NUMERO_ORCAMENTO == pNUMERO_ORCAMENTO
                               select linha).First().CODIGO_CLIENTE_ORCAMENTO;

                if (!cliente.HasValue)
                    throw new Exception("&Eacute; necess&aacute;rio salvar o or&ccedil;amento antes de fazer a an&aacute;lise");

                CODIGO_CLIENTE = (decimal)cliente;
            }

            Confirma_Cliente(CODIGO_CLIENTE);

            NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;

            RESULTADO = new DataTable("Tabela");

            RESULTADO.Columns.Add("CRITERIO");
            RESULTADO.Columns.Add("MOTIVO");

            ID_EMITENTE = pID_EMITENTE;
        }

        public string Aplica_Analise(decimal ID_EMPRESA)
        {
            ID_EMITENTE = ID_EMPRESA;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_CONFIG_VENDAs
                             where linha.ID_CONFIGURACAO_VENDAS == 1
                             select linha).ToList();

                foreach (var item in query)
                {
                    if (item.ANALISAR_PRIMEIRA_COMPRA == 1)
                        Cliente_Primeira_Compra();

                    if (item.ANALISAR_INATIVIDADE == 1)
                    {
                        DIAS_INATIVIDADE = (decimal)item.DIAS_INATIVIDADE;
                        Inatividade();
                    }

                    if (item.ANALISAR_COND_PAGTO == 1)
                        Condicao_Pagamento();

                    if (item.ANALISAR_LIMITE_CREDITO == 1)
                        Limite_Excedido();

                    if (item.ANALISAR_INADIMPLENCIA == 1)
                        Inadimplencia(ID_EMPRESA);

                    if (item.ANALISAR_FATURAMENTO_MINIMO == 1)
                        Faturamento_Minimo(item.VALOR_FATURAMENTO_MINIMO);

                    Analisa_Cliente_Bloqueado();

                    Analisa_Parcelas();

                    Registra_Limite_Cliente();
                }
            }

            dtAnalise = RESULTADO;

            System.IO.StringWriter tr = new System.IO.StringWriter();
            RESULTADO.WriteXml(tr);

            return tr.ToString();
        }

        private void Analisa_Cliente_Bloqueado()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var bl = (from linha in ctx.TB_CLIENTEs
                          where linha.ID_CLIENTE == CODIGO_CLIENTE
                          select linha).First();

                string x = "";

                if (bl.CLIENTE_BLOQUEADO.HasValue)
                {
                    if (bl.CLIENTE_BLOQUEADO == 1)
                    {
                        x = "<b>Cliente Bloqueado no Cadastro</b>";

                        if (bl.OBS_CLIENTE.Length > 0)
                            x += string.Concat("<br /><br /><b>Obs. Cadastro: </b>", bl.OBS_CLIENTE);

                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Cliente_Bloqueado, x);
                    }
                    else
                    {
                        if (bl.OBS_CLIENTE.Length > 0)
                        {
                            x += string.Concat("<b>Obs. Cadastro: </b>", bl.OBS_CLIENTE);
                            AdicionaRestricao(CRITERIOS_DE_ANALISE.Obs_Cadastro, x);
                        }
                    }
                }
                else
                {
                    if (bl.OBS_CLIENTE.Length > 0)
                    {
                        x += string.Concat("<b>Obs. Cadastro: </b>", bl.OBS_CLIENTE);
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Obs_Cadastro, x);
                    }
                }
            }
        }

        private void Cliente_Primeira_Compra()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_SAIDAs
                             where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                             && linha.STATUS_NF == 4
                             select linha).ToList().Count();

                if (query == 0)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Primeira_Compra, "Cliente Novo / Primeira Compra");

            }
        }

        private void Inatividade()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var nota = (from linha in ctx.TB_NOTA_SAIDAs
                            where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                            && linha.STATUS_NF == 4
                            orderby linha.DATA_EMISSAO_NF descending
                            select linha).ToList().Take(1);

                foreach (var item in nota)
                {
                    TimeSpan ts1 = new TimeSpan((int)DIAS_INATIVIDADE, 0, 0, 0);

                    DateTime limite = DateTime.Today.Subtract(ts1);

                    if (item.DATA_EMISSAO_NF < limite)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Inatividade, string.Concat(@"Cliente n&atilde;o compra a mais de ", DIAS_INATIVIDADE.ToString(), @" dias.<br />
                        Ultima compra feita em ", item.DATA_EMISSAO_NF.Value.ToShortDateString(), " - NF ", item.NUMERO_NF.ToString()));
                }
            }
        }

        private void Condicao_Pagamento()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                {
                    CODIGO_COND_PAGAMENTO = (decimal)(from linha in ctx1.TB_ORCAMENTO_VENDAs
                                                      where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                                      select linha).First().CODIGO_COND_PAGTO;
                }

                var condicao = (from linha in ctx.TB_COND_PAGTOs
                                where linha.CODIGO_CP == CODIGO_COND_PAGAMENTO
                                select linha).ToList().First().DESCRICAO_CP.Trim();

                var query = (from linha in ctx.TB_CLIENTEs
                             where linha.ID_CLIENTE == CODIGO_CLIENTE
                             select linha).ToList();

                foreach (var item in query)
                    if (item.CODIGO_CP_CLIENTE != CODIGO_COND_PAGAMENTO)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Condicao_Pagamento, string.Concat(@"Condi&ccedil;&atilde;o de Pagamento Divergente.<br />
                            Cliente cadastrado com [", item.TB_COND_PAGTO.DESCRICAO_CP.Trim(), "]<br /> Venda feita em [", condicao, "]"));
            }
        }

        private void Limite_Excedido()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var emAberto = (from linha in ctx.TB_FINANCEIROs
                                where linha.CREDITO_DEBITO == 0
                               && linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                               && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                select linha.VALOR_TOTAL).Sum();

                if (!emAberto.HasValue)
                    emAberto = 0;

                if (emAberto > 0)
                {
                    var pagoParcial = (from linha in ctx.TB_PAGTO_PARCIALs
                                       where linha.TB_FINANCEIRO.CREDITO_DEBITO == 0
                                      && linha.TB_FINANCEIRO.CODIGO_CLIENTE == CODIGO_CLIENTE
                                      && linha.TB_FINANCEIRO.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                       select linha).Sum(pp => pp.VALOR_PAGTO);

                    if (pagoParcial.HasValue)
                        emAberto -= pagoParcial;
                }

                if (emAberto < (decimal)0.00) emAberto = 0;

                emAberto += Doran_Limite_Credito_Cliente.Limite_Excedido_Cliente(CODIGO_CLIENTE);

                if (emAberto > (decimal)0.00)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var limite = (from linha in ctx1.TB_CLIENTEs
                                      where linha.ID_CLIENTE == CODIGO_CLIENTE
                                      select linha).ToList().First().TB_LIMITE.VALOR_LIMITE;

                        if ((emAberto - limite) > limite)
                            AdicionaRestricao(CRITERIOS_DE_ANALISE.Limite_Excedido, string.Concat(@"Limite de Cr&eacute;dito excedido para este cliente. <br />
                                Limite de Cr&eacute;dito cadastrado = ", ((double)limite).ToString("c"), "<br />",
                                "Valor em aberto deste cliente = <span style='color: red;'>", ((double)(emAberto - limite)).ToString("c"), "</span>"));

                    }
                }
                // falta adicionar os pedidos já aprovados e ainda não faturados.
            }
        }

        private void Inadimplencia(decimal ID_EMPRESA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal totalVencidos = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, CODIGO_CLIENTE, ID_EMPRESA);

                if (totalVencidos > (decimal)0.00)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Inadimplencia, string.Concat("Existem t&iacute;tulos vencidos deste cliente. <br />Total Vencido = ",
                        "<span style='color: red;'>", totalVencidos.ToString("c"), "</span>"));
            }
        }

        private void Faturamento_Minimo(decimal? VALOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var total = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).Sum(t => t.VALOR_TOTAL);

                if (total.HasValue)
                {
                    if (total < VALOR)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Faturamento_Minimo, string.Concat("O total do or&ccedil;amento n&atilde;o atingiu o faturamento m&iacute;nimo<br />",
                            "Valor M&iacute;nimo permitido = ", ((decimal)VALOR).ToString("c"), "<br />",
                            "Valor dos Produtos = <span style='color: red;'>", ((decimal)total).ToString("c"), "</span>"));
                }
            }
        }

        private void Analisa_Parcelas()
        {
            // até 30 dias, mínimo de 300 reais por parcela

            // acima de 30 dias parcela mínima 
        }

        private void Registra_Limite_Cliente()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_CLIENTEs
                             where linha.ID_CLIENTE == CODIGO_CLIENTE
                             select new
                             {
                                 linha.TB_LIMITE.VALOR_LIMITE,
                                 linha.DATA_CADASTRO
                             }).ToList();

                AdicionaRestricao(CRITERIOS_DE_ANALISE.Limite_Cadastrado_no_Cliente, string.Concat("Data do cadastro [", query.Any() ? ApoioXML.TrataData2(query.First().DATA_CADASTRO) : string.Empty, "]<br /> Limite de crédito cadastrado no cliente [",
                    query.Any() ? ((decimal)query.First().VALOR_LIMITE).ToString("c") : 0.ToString("c"), "]"));
            }
        }

        private void AdicionaRestricao(CRITERIOS_DE_ANALISE criterio, string Motivo)
        {
            DataRow nova = RESULTADO.NewRow();
            string _criterio = criterio.ToString();
            _criterio = _criterio.Replace("_", " ");

            nova[0] = _criterio;
            nova[1] = Motivo;

            RESULTADO.Rows.Add(nova);
        }

        private void Confirma_Cliente(decimal _CODIGO_CLIENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_CLIENTEs
                            where linha.ID_CLIENTE == _CODIGO_CLIENTE
                            select linha;

                if (query.Count() == 0)
                {
                    throw new Exception("Cliente n&atilde;o cadastrado.");
                }
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}