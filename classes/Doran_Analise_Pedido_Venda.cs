using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Analise_Pedido_Venda : IDisposable
    {
        private decimal NUMERO_PEDIDO;
        private DataTable RESULTADO;
        private decimal CODIGO_CLIENTE;
        private decimal CODIGO_COND_PAGAMENTO;
        private decimal DIAS_INATIVIDADE;
        private decimal ID_EMITENTE { get; set; }

        public Doran_Analise_Pedido_Venda(decimal pNUMERO_PEDIDO, decimal pID_EMITENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var CLIENTE = (from linha in ctx.TB_PEDIDO_VENDAs
                               where linha.NUMERO_PEDIDO == pNUMERO_PEDIDO
                               select linha).First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO;

                CODIGO_CLIENTE = (decimal)CLIENTE;
            }

            Confirma_Cliente(CODIGO_CLIENTE);

            NUMERO_PEDIDO = pNUMERO_PEDIDO;
            ID_EMITENTE = pID_EMITENTE;

            RESULTADO = new DataTable("Tabela");

            RESULTADO.Columns.Add("CRITERIO");
            RESULTADO.Columns.Add("MOTIVO");
        }

        public Doran_Analise_Pedido_Venda(decimal pNUMERO_PEDIDO, decimal pID_EMITENTE, DataContext ctx)
        {
            var CLIENTE = (from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                           where linha.NUMERO_PEDIDO == pNUMERO_PEDIDO
                           select linha).First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO;

            CODIGO_CLIENTE = (decimal)CLIENTE;

            Confirma_Cliente(CODIGO_CLIENTE);

            NUMERO_PEDIDO = pNUMERO_PEDIDO;
            ID_EMITENTE = pID_EMITENTE;

            RESULTADO = new DataTable("Tabela");

            RESULTADO.Columns.Add("CRITERIO");
            RESULTADO.Columns.Add("MOTIVO");
        }

        public DataTable Aplica_Analise(decimal ID_EMPRESA)
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

                    Analisa_Abatimento_Futuro();

                    Registra_Limite_Cliente();

                    // Analisa_Disponibilidade_Estoque();
                }
            }

            return RESULTADO;
        }

        public DataTable Aplica_Analise(DataContext ctx, decimal ID_EMPRESA)
        {
            var query = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_CONFIG_VENDA>()
                         where linha.ID_CONFIGURACAO_VENDAS == 1
                         select linha).ToList();

            foreach (var item in query)
            {
                if (item.ANALISAR_PRIMEIRA_COMPRA == 1)
                    Cliente_Primeira_Compra(ctx);

                if (item.ANALISAR_INATIVIDADE == 1)
                {
                    DIAS_INATIVIDADE = (decimal)item.DIAS_INATIVIDADE;
                    Inatividade(ctx);
                }

                if (item.ANALISAR_COND_PAGTO == 1)
                    Condicao_Pagamento(ctx);

                if (item.ANALISAR_LIMITE_CREDITO == 1)
                    Limite_Excedido(ctx);

                if (item.ANALISAR_INADIMPLENCIA == 1)
                    Inadimplencia(ctx, ID_EMPRESA);

                if (item.ANALISAR_FATURAMENTO_MINIMO == 1)
                    Faturamento_Minimo(item.VALOR_FATURAMENTO_MINIMO, ctx);

                Analisa_Cliente_Bloqueado(ctx);

                Analisa_Abatimento_Futuro(ctx);

                // Analisa_Disponibilidade_Estoque();
            }

            return RESULTADO;
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

        private void Analisa_Cliente_Bloqueado(DataContext ctx)
        {
            var bl = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE>()
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

        private void Cliente_Primeira_Compra()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_SAIDAs
                             where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                             && linha.STATUS_NF == 4
                             select linha).Count();

                if (query == 0)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Primeira_Compra, "Cliente Novo / Primeira Compra");

            }
        }

        private void Cliente_Primeira_Compra(DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_NOTA_SAIDA>()
                         where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                         && linha.STATUS_NF == 4
                         select linha).Count();

            if (query == 0)
                AdicionaRestricao(CRITERIOS_DE_ANALISE.Primeira_Compra, "Cliente Novo / Primeira Compra");

        }

        private void Inatividade()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var nota = (from linha in ctx.TB_NOTA_SAIDAs
                            where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                            && linha.STATUS_NF == 4
                            orderby linha.DATA_EMISSAO_NF descending
                            select linha).Take(1);

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

        private void Inatividade(DataContext ctx)
        {
            var nota = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_NOTA_SAIDA>()
                        where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                        && linha.STATUS_NF == 4
                        orderby linha.DATA_EMISSAO_NF descending
                        select linha).Take(1);

            foreach (var item in nota)
            {
                TimeSpan ts1 = new TimeSpan((int)DIAS_INATIVIDADE, 0, 0, 0);

                DateTime limite = DateTime.Today.Subtract(ts1);

                if (item.DATA_EMISSAO_NF < limite)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Inatividade, string.Concat(@"Cliente n&atilde;o compra a mais de ", DIAS_INATIVIDADE.ToString(), @" dias.<br />
                        Ultima compra feita em ", item.DATA_EMISSAO_NF.Value.ToShortDateString(), " - NF ", item.NUMERO_NF.ToString()));
            }
        }

        private void Condicao_Pagamento()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                {
                    CODIGO_COND_PAGAMENTO = (decimal)(from linha in ctx1.TB_PEDIDO_VENDAs
                                                      where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                                      select linha).First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO;
                }

                var condicao = (from linha in ctx.TB_COND_PAGTOs
                                where linha.CODIGO_CP == CODIGO_COND_PAGAMENTO
                                select linha).ToList().First().DESCRICAO_CP.Trim();

                var query = (from linha in ctx.TB_CLIENTEs
                             where linha.ID_CLIENTE == CODIGO_CLIENTE
                             select linha).ToList();

                foreach (var item in query)
                    if (item.CODIGO_CP_CLIENTE != CODIGO_COND_PAGAMENTO)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Condicao_Pagamento, string.Concat(@"Condi&ccedil;&atilde;o de Pagamento Divergente.<br /> Cliente cadastrado com [", item.TB_COND_PAGTO.DESCRICAO_CP.Trim(), "]<br /> Venda feita em [", condicao, "]"));
            }
        }

        private void Condicao_Pagamento(DataContext ctx)
        {
            CODIGO_COND_PAGAMENTO = (decimal)(from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                                              where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                              select linha).First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO;

            var condicao = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_COND_PAGTO>()
                            where linha.CODIGO_CP == CODIGO_COND_PAGAMENTO
                            select linha).ToList().First().DESCRICAO_CP.Trim();

            var query = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE>()
                         where linha.ID_CLIENTE == CODIGO_CLIENTE
                         select new
                         {
                             linha.CODIGO_CP_CLIENTE,
                             linha.TB_COND_PAGTO.DESCRICAO_CP
                         }).ToList();

            foreach (var item in query)
                if (item.CODIGO_CP_CLIENTE != CODIGO_COND_PAGAMENTO)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Condicao_Pagamento, string.Concat(@"Condi&ccedil;&atilde;o de Pagamento Divergente.<br /> Cliente cadastrado com [", item.DESCRICAO_CP.Trim(), "]<br /> Venda feita em [", condicao, "]"));

        }

        private void Limite_Excedido()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var emAberto = (from linha in ctx.TB_FINANCEIROs
                                where linha.CREDITO_DEBITO == 0
                               && linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                               && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                select linha).Sum(ab => ab.VALOR_TOTAL);

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
                                      select linha).First().TB_LIMITE.VALOR_LIMITE;

                        if ((emAberto - limite) > limite)
                            AdicionaRestricao(CRITERIOS_DE_ANALISE.Limite_Excedido, string.Concat(@"Limite de Cr&eacute;dito excedido para este cliente. <br /> Limite de Cr&eacute;dito cadastrado = ", ((double)limite).ToString("c"), "<br />",
                                "Valor em aberto deste cliente = <span style='color: red;'>", ((double)(emAberto - limite)).ToString("c"), "</span>"));

                    }
                }
            }
        }

        private void Limite_Excedido(DataContext ctx)
        {
            var emAberto = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_FINANCEIRO>()
                            where linha.CREDITO_DEBITO == 0
                           && linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                           && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                            select linha).Sum(ab => ab.VALOR_TOTAL);

            if (!emAberto.HasValue)
                emAberto = 0;

            if (emAberto > 0)
            {
                var pagoParcial = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_PAGTO_PARCIAL>()
                                   where linha.TB_FINANCEIRO.CREDITO_DEBITO == 0
                                  && linha.TB_FINANCEIRO.CODIGO_CLIENTE == CODIGO_CLIENTE
                                  && linha.TB_FINANCEIRO.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                   select linha).Sum(pp => pp.VALOR_PAGTO);

                if (pagoParcial.HasValue)
                    emAberto -= pagoParcial;
            }

            if (emAberto < (decimal)0.00) emAberto = 0;

            emAberto += Doran_Limite_Credito_Cliente.Limite_Excedido_Cliente(CODIGO_CLIENTE, ctx);

            if (emAberto > (decimal)0.00)
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var limite = (from linha in ctx1.TB_CLIENTEs
                                  where linha.ID_CLIENTE == CODIGO_CLIENTE
                                  select linha).First().TB_LIMITE.VALOR_LIMITE;

                    if ((emAberto - limite) > limite)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Limite_Excedido, string.Concat(@"Limite de Cr&eacute;dito excedido para este cliente. <br /> Limite de Cr&eacute;dito cadastrado = ", ((double)limite).ToString("c"), "<br />",
                            "Valor em aberto deste cliente = <span style='color: red;'>", ((double)(emAberto - limite)).ToString("c"), "</span>"));

                }
            }
        }

        private void Inadimplencia(decimal ID_EMPRESA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal totalVencidos = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, CODIGO_CLIENTE,
                    ID_EMPRESA);

                if (totalVencidos > (decimal)0.00)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Inadimplencia, string.Concat("Existem t&iacute;tulos vencidos deste cliente. <br />Total Vencido = ",
                        "<span style='color: red;'>", totalVencidos.ToString("c"), "</span>"));
            }
        }

        private void Inadimplencia(DataContext ctx, decimal ID_EMPRESA)
        {
            decimal totalVencidos = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER,
                CODIGO_CLIENTE, ctx, ID_EMPRESA);

            if (totalVencidos > (decimal)0.00)
                AdicionaRestricao(CRITERIOS_DE_ANALISE.Inadimplencia, string.Concat("Existem t&iacute;tulos vencidos deste cliente. <br />Total Vencido = ",
                    "<span style='color: red;'>", totalVencidos.ToString("c"), "</span>"));
        }

        private void Faturamento_Minimo(decimal? VALOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var total = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             select linha).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO);

                if (total.HasValue)
                {
                    if (total < VALOR)
                        AdicionaRestricao(CRITERIOS_DE_ANALISE.Faturamento_Minimo, string.Concat("O total do Pedido n&atilde;o atingiu o faturamento m&iacute;nimo<br />",
                            "Valor M&iacute;nimo permitido = ", ((decimal)VALOR).ToString("c"), "<br />",
                            "Valor dos Produtos = <span style='color: red;'>", ((decimal)total).ToString("c"), "</span>"));
                }
            }
        }

        private void Faturamento_Minimo(decimal? VALOR, DataContext ctx)
        {
            var total = (from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                         where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                         select linha).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO);

            if (total.HasValue)
            {
                if (total < VALOR)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Faturamento_Minimo, string.Concat("O total do Pedido n&atilde;o atingiu o faturamento m&iacute;nimo<br />",
                        "Valor M&iacute;nimo permitido = ", ((decimal)VALOR).ToString("c"), "<br />",
                        "Valor dos Produtos = <span style='color: red;'>", ((decimal)total).ToString("c"), "</span>"));
            }
        }

        private void Analisa_Abatimento_Futuro()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs

                             orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                             where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                             && linha.SALDO_RESTANTE > (decimal)0.00

                             select linha).Sum(a => a.SALDO_RESTANTE);

                if (query.HasValue)
                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Abatimento_Futuro, string.Concat("Existem abatimento(s) por devolu&ccedil;&atilde;o de venda pendente(s) para este cliente.<br />",
                        "<span style='color: red;'>", ((decimal)query).ToString("c"), "</span>"));
            }
        }

        private void Analisa_Abatimento_Futuro(DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()

                         orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                         where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                         && linha.SALDO_RESTANTE > (decimal)0.00

                         select linha).Sum(a => a.SALDO_RESTANTE);

            if (query.HasValue)
                AdicionaRestricao(CRITERIOS_DE_ANALISE.Abatimento_Futuro, string.Concat("Existem abatimento(s) por devolu&ccedil;&atilde;o de venda pendente(s) para este cliente.<br />",
                    "<span style='color: red;'>", ((decimal)query).ToString("c"), "</span>"));
        }

        private void Registra_Limite_Cliente()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_CLIENTEs
                            where linha.ID_CLIENTE == CODIGO_CLIENTE
                            select new
                            {
                                linha.TB_LIMITE.VALOR_LIMITE,
                                linha.DATA_CADASTRO
                            };

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

        private void Confirma_Cliente(decimal _CODIGO_CLIENTE, DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE>()
                         where linha.ID_CLIENTE == _CODIGO_CLIENTE
                         select linha).ToList();

            if (query.Count() == 0)
            {
                throw new Exception("Cliente n&atilde;o cadastrado.");
            }
        }

        private void Analisa_Disponibilidade_Estoque()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_VENDAs

                            orderby linha.NUMERO_PEDIDO

                            where linha.NUMERO_PEDIDO == NUMERO_PEDIDO

                            select new
                            {
                                linha.ID_PRODUTO_PEDIDO,
                                linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                linha.TB_STATUS_PEDIDO.COR_STATUS,
                                linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS
                            };

                List<decimal?> STATUS_PEDIDO_EM_ANDAMENTO = new List<decimal?>();

                STATUS_PEDIDO_EM_ANDAMENTO.Add(2);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(3);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(4);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(9);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(10);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(11);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(12);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(13);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(14);
                STATUS_PEDIDO_EM_ANDAMENTO.Add(15);

                string linhaHTML = "";

                foreach (var item in query)
                {
                    var query1 = from linha in ctx.TB_PEDIDO_VENDAs

                                 where (linha.ID_PRODUTO_PEDIDO == item.ID_PRODUTO_PEDIDO
                                 && STATUS_PEDIDO_EM_ANDAMENTO.Contains(linha.STATUS_ITEM_PEDIDO))

                                 && linha.NUMERO_PEDIDO != NUMERO_PEDIDO

                                 select new
                                 {
                                     linha.NUMERO_PEDIDO,
                                     linha.CODIGO_PRODUTO_PEDIDO,
                                     linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                     linha.UNIDADE_ITEM_PEDIDO,
                                     linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                     linha.TB_STATUS_PEDIDO.COR_STATUS,
                                     linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                     linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR
                                 };

                    decimal? SOMA = query1.Sum(s => s.QTDE_PRODUTO_ITEM_PEDIDO);

                    if (SOMA.HasValue)
                    {
                        foreach (var item1 in query1)
                        {
                            linhaHTML += string.Concat("<tr><td style='font-family: tahoma; text-align: center;'>", item1.NUMERO_PEDIDO.ToString(), "</td><td style='font-family: tahoma; background-color: ", item1.COR_STATUS.Trim(), "; color: ", item1.COR_FONTE_STATUS.Trim(), ";'>",
                                item1.DESCRICAO_STATUS_PEDIDO.Trim(), "</td><td style='font-family: tahoma;'>", item1.CODIGO_PRODUTO_PEDIDO.Trim(), "</td><td style='font-family: tahoma; text-align: center;'>",
                                ApoioXML.Valor2((decimal)item1.QTDE_PRODUTO_ITEM_PEDIDO), "</td><td style='font-family: tahoma; text-align: center;'>", item1.UNIDADE_ITEM_PEDIDO.Trim(), "</td>",
                                "<td style='font-family: tahoma;'>",
                                string.IsNullOrEmpty(item1.NOME_VENDEDOR) ? "" : item1.NOME_VENDEDOR.Trim(), "</td></tr>");
                        }
                    }
                }

                if (linhaHTML.Length > 0)
                {
                    string tabelaHTML = string.Concat("<table style='width: 100%;'>",
                        "<tr><td style='font-family: tahoma; font-weight: bold; width: 80px; text-align: center;' >Pedido</td>",
                        "<td style='font-family: tahoma; font-weight: bold; width: 170px;'>Posi&ccedil;&atilde;o do Item</td>",
                        "<td style='font-family: tahoma; font-weight: bold;'>Produto</td>",
                        "<td style='font-family: tahoma; font-weight: bold; width: 70px; text-align: center;'>Qtde.</td>",
                        "<td style='font-family: tahoma; font-weight: bold; width: 35px; text-align: center;'>Un.</td>",
                        "<td style='font-family: tahoma; font-weight: bold;'>Vendedor(a)</td></tr>",
                    linhaHTML, "</table>");

                    AdicionaRestricao(CRITERIOS_DE_ANALISE.Analise_Estoque, tabelaHTML);
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