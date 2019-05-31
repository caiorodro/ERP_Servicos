using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Configuration;
using System.Data;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Fatura_Pedido : IDisposable
    {
        public string STATUS_NF { get; set; }
        private decimal ID_USUARIO { get; set; }
        private decimal ID_EMPRESA { get; set; }
        private string SERIE { get; set; }

        public Doran_Fatura_Pedido(decimal _ID_EMPRESA, decimal _ID_USUARIO, string _SERIE)
        {
            ID_USUARIO = _ID_USUARIO;
            ID_EMPRESA = _ID_EMPRESA;
            SERIE = _SERIE;

            STATUS_NF = "[";
        }

        public string Fatura_Pedidos()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var clientes = (from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.ID_USUARIO_ITEM_A_FATURAR, linha.ITEM_A_FATURAR, linha.NUMERO_PEDIDO

                                where (linha.ID_USUARIO_ITEM_A_FATURAR == ID_USUARIO
                                && linha.ITEM_A_FATURAR == 1)

                                select linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO).Distinct().ToList();

                if (clientes.Count == 0)
                    throw new Exception("N&atilde;o h&aacute; itens marcados para faturar.<br />Marque os itens antes de faturar o(s) servi&ccedil;o(s)");

                for (int i = 0; i < clientes.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                 orderby linha.ID_USUARIO_ITEM_A_FATURAR, linha.ITEM_A_FATURAR, linha.NUMERO_PEDIDO

                                 where (linha.ID_USUARIO_ITEM_A_FATURAR == ID_USUARIO
                                 && linha.ITEM_A_FATURAR == 1)

                                 && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == clientes[i]
                                 select linha).ToList();

                    decimal NUMERO_NOTA_FISCAL = 0;

                    decimal SUFRAMA = 0;
                    List<string> DADOS_ADICIONAIS_CFOP = new List<string>();

                    using (Doran_Nota_Saida nota1 = new Doran_Nota_Saida(ID_EMPRESA, ID_USUARIO))
                    {
                        Dictionary<string, object> dados = new Dictionary<string, object>();

                        dados.Add("IE_SUBST_TRIB_NF", "");
                        dados.Add("CODIGO_CLIENTE_NF", query.First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO);

                        dados.Add("DATA_EMISSAO_NF", ApoioXML.TrataData2(DateTime.Today));

                        dados.Add("CODIGO_CP_NF", query.First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO);

                        dados.Add("BASE_ISS_NF", 0);
                        dados.Add("VALOR_ICMS_NF", 0);
                        dados.Add("BASE_ICMS_SUBS_NF", 0);
                        dados.Add("VALOR_ICMS_SUBS_NF", 0);
                        dados.Add("TOTAL_PRODUTOS_NF", 0);
                        dados.Add("VALOR_SEGURO_NF", 0);
                        dados.Add("OUTRAS_DESP_NF", 0);
                        dados.Add("TOTAL_IPI_NF", 0);
                        dados.Add("TOTAL_NF", 0);

                        var _dados_fatura = (from linha in ctx.TB_DADOS_FATURAMENTOs
                                             where linha.NUMERO_PEDIDO == query.First().NUMERO_PEDIDO
                                             select linha).ToList();

                        if (!_dados_fatura.Any())
                            throw new Exception("Os dados de faturamento não foram confirmados");

                        var dados_fatura = _dados_fatura.First();

                        dados.Add("PLACA_VEICULO_NF", string.Empty);

                        dados.Add("QTDE_NF", dados_fatura.QTDE_NF.ToString());
                        dados.Add("ESPECIE_NF", dados_fatura.ESPECIE.Trim());
                        dados.Add("MARCA_NF", dados_fatura.MARCA.Trim());
                        dados.Add("NUMERO_QTDE_NF", dados_fatura.NUMERACAO.Trim());

                        dados.Add("DADOS_ADICIONAIS_NF", dados_fatura.OBS_NF.Trim());
                        dados.Add("CODIGO_VENDEDOR_NF", query.First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR);

                        dados.Add("NUMERO_PEDIDO_NF", dados_fatura.NUMERO_PEDIDO_CLIENTE.Trim());
                        dados.Add("CHAVE_ACESSO_NF", "");
                        dados.Add("PROTOCOLO_AUTORIZACAO_NF", "");
                        dados.Add("SERIE", SERIE);

                        NUMERO_NOTA_FISCAL = nota1.Nova_Nota_Saida(dados);
                    }

                    int nItem = 0;

                    foreach (var item in query)
                    {
                        using (Doran_Calculo_Nota_Saida nota2 = new Doran_Calculo_Nota_Saida(NUMERO_NOTA_FISCAL, ID_USUARIO))
                        {
                            Dictionary<string, object> dados = new Dictionary<string, object>();

                            dados.Add("CODIGO_PRODUTO_ITEM_NF", item.CODIGO_PRODUTO_PEDIDO.Trim());
                            dados.Add("QTDE_ITEM_NF", item.QTDE_A_FATURAR);

                            dados.Add("DESCRICAO_PRODUTO_ITEM_NF", item.TB_ITEM_ORCAMENTO_VENDA.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim().Length > 0 ?
                                item.TB_ITEM_ORCAMENTO_VENDA.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim() :
                                item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim());

                            dados.Add("UNIDADE_MEDIDA_ITEM_NF", item.UNIDADE_ITEM_PEDIDO.Trim());

                            dados.Add("VALOR_UNITARIO_ITEM_NF", item.PRECO_ITEM_PEDIDO);

                            dados.Add("VALOR_DESCONTO_ITEM_NF", item.VALOR_DESCONTO_ITEM_PEDIDO);

                            dados.Add("ALIQ_ISS", item.ALIQ_ISS_ITEM_PEDIDO);
                            dados.Add("VALOR_TOTAL_ITEM_NF", item.VALOR_TOTAL_ITEM_PEDIDO);

                            dados.Add("NUMERO_PEDIDO_VENDA", item.NUMERO_PEDIDO);
                            dados.Add("NUMERO_ITEM_PEDIDO_VENDA", item.NUMERO_ITEM);

                            dados.Add("ID_PRODUTO", item.ID_PRODUTO_PEDIDO);
                            dados.Add("ID_CLIENTE", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO);

                            dados.Add("SUFRAMA_CFOP", SUFRAMA);

                            string x = "";

                            for (var y = 0; y < DADOS_ADICIONAIS_CFOP.Count; y++)
                                x += string.Concat(DADOS_ADICIONAIS_CFOP[y], " - ");

                            dados.Add("DADOS_ADICIONAIS_CFOP", x);

                            Dictionary<string, object> retorno = nota2.Calcula_e_Grava_Item_Nota_Saida(dados);

                            STATUS_NF += AtualizaStatusPedido(item.NUMERO_PEDIDO, item.NUMERO_ITEM, item.QTDE_A_FATURAR, item.QTDE_PRODUTO_ITEM_PEDIDO);

                            nItem++;
                        }
                    }
                }

                STATUS_NF = STATUS_NF.Substring(0, STATUS_NF.Length - 1) + "]";

                return STATUS_NF;
            }
        }

        public string Verifica_Todos_Itens_Marcados()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                string retorno = "0";

                List<decimal> NUMEROS_PEDIDO = (from linha in ctx.TB_PEDIDO_VENDAs

                                                orderby linha.ITEM_A_FATURAR, linha.NUMERO_PEDIDO
                                                where linha.ITEM_A_FATURAR == 1

                                                select linha.NUMERO_PEDIDO).Distinct().ToList();

                foreach (decimal PEDIDO in NUMEROS_PEDIDO)
                {
                    var itens_nao_marcados = (from linha in ctx.TB_PEDIDO_VENDAs
                                              orderby linha.NUMERO_PEDIDO
                                              where linha.NUMERO_PEDIDO == PEDIDO
                                              select linha).Count(n => n.ITEM_A_FATURAR == 0 && n.QTDE_A_FATURAR > (decimal)0.00);

                    if (itens_nao_marcados > 0)
                        retorno = "1";
                }

                return retorno;
            }
        }

        private string AtualizaStatusPedido(decimal? NUMERO_PEDIDO, decimal? NUMERO_ITEM, decimal? QTDE_A_FATURAR, decimal? QTDE_PEDIDO)
        {
            string retorno = "";

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var totalQtde = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                     where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO &&
                                     linha.NUMERO_ITEM_PEDIDO_VENDA == NUMERO_ITEM
                                     && new List<decimal?>() { 1, 2 }.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                     select linha.QTDE_ITEM_NF).Sum();

                    decimal status = 0;
                    decimal codigo_status = 0;

                    if (totalQtde < QTDE_PEDIDO)
                        status = 2;

                    if (totalQtde >= QTDE_PEDIDO)
                        status = 3;

                    ////////////////////////
                    var numerosInternos = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                           where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO &&
                                           linha.NUMERO_ITEM_PEDIDO_VENDA == NUMERO_ITEM
                                           && new List<decimal?>() { 1, 2 }.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                           select linha.NUMERO_ITEM_NF).ToList().Distinct();

                    string cNumerosInternos = "";

                    foreach (var item in numerosInternos)
                        cNumerosInternos += string.Concat(item.ToString(), "/");

                    if (cNumerosInternos.Length > 0)
                        cNumerosInternos = cNumerosInternos.Substring(0, cNumerosInternos.Length - 1);

                    var numerosNF = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                     where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO &&
                                     linha.NUMERO_ITEM_PEDIDO_VENDA == NUMERO_ITEM
                                     && new List<decimal?>() { 1, 2 }.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                     select linha.TB_NOTA_SAIDA.NUMERO_NF).ToList().Distinct();

                    string cNumerosNF = "";

                    foreach (var item in numerosNF)
                        cNumerosNF += string.Concat(item.ToString(), "/");

                    if (cNumerosNF.Length > 0)
                        cNumerosNF = cNumerosNF.Substring(0, cNumerosNF.Length - 1);

                    var query = (from linha in ctx.TB_STATUS_PEDIDOs
                                 where linha.STATUS_ESPECIFICO == status
                                 select new
                                 {
                                     linha.DESCRICAO_STATUS_PEDIDO,
                                     linha.COR_STATUS,
                                     linha.COR_FONTE_STATUS,
                                     linha.CODIGO_STATUS_PEDIDO
                                 }).ToList();

                    string qtdeC_Faturada = totalQtde.HasValue ? totalQtde.ToString() : "0";
                    qtdeC_Faturada = qtdeC_Faturada.Replace(",", ".");

                    string qtdeC_Faturar = "0";

                    if (totalQtde.HasValue)
                        qtdeC_Faturar = status == 2 ? (QTDE_PEDIDO - totalQtde).ToString() : "0";

                    qtdeC_Faturar = qtdeC_Faturar.Replace(",", ".");

                    foreach (var item in query)
                    {
                        retorno = string.Concat("[{NUMERO_PEDIDO: ", NUMERO_PEDIDO.ToString(),
                                ", NUMERO_ITEM: ", NUMERO_ITEM.ToString(), ", COR_STATUS: '", item.COR_STATUS.Trim(),
                                "', COR_FONTE_STATUS: '", item.COR_FONTE_STATUS.Trim(), "', DESCRICAO_STATUS_PEDIDO: '",
                                item.DESCRICAO_STATUS_PEDIDO.Trim(), "', CODIGO_STATUS_PEDIDO: ", item.CODIGO_STATUS_PEDIDO,
                                ", QTDE_A_FATURAR: ", qtdeC_Faturar, ", QTDE_FATURADA: ", qtdeC_Faturada,
                                ", NUMEROS_INTERNOS: '", cNumerosInternos, "', NUMEROS_NF: '", cNumerosNF, "'}],");

                        codigo_status = item.CODIGO_STATUS_PEDIDO;
                    }

                    var pedido = (from linha in ctx.TB_PEDIDO_VENDAs
                                  where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                  && linha.NUMERO_ITEM == NUMERO_ITEM
                                  select linha).ToList();

                    DateTime _hoje = DateTime.Now;

                    foreach (var item in pedido)
                    {
                        var DATA_STATUS_ANTERIOR = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                                    where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                                    && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                                    select linha).Any() ?

                            (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                             where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                             && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                             select linha.DATA_MUDANCA).Max() : item.DATA_PEDIDO;

                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_MUDANCA_STATUS_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_MUDANCA_STATUS_PEDIDO>();

                        Doran_Servicos_ORM.TB_MUDANCA_STATUS_PEDIDO novo = new Doran_Servicos_ORM.TB_MUDANCA_STATUS_PEDIDO();

                        novo.NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO;
                        novo.NUMERO_ITEM_VENDA = item.NUMERO_ITEM;
                        novo.DATA_MUDANCA = _hoje;
                        novo.ID_USUARIO = ID_USUARIO;
                        novo.ID_STATUS_ANTERIOR = item.STATUS_ITEM_PEDIDO;
                        novo.ID_STATUS_NOVO = codigo_status;
                        novo.DATA_STATUS_ANTERIOR = DATA_STATUS_ANTERIOR;
                        novo.ID_PRODUTO = item.ID_PRODUTO_PEDIDO;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), item.NUMERO_PEDIDO, ID_USUARIO);

                        ctx.SubmitChanges();

                        item.QTDE_A_FATURAR = status == 2 ? QTDE_PEDIDO - totalQtde : 0;
                        item.ID_USUARIO_ITEM_A_FATURAR = 0;
                        item.ITEM_A_FATURAR = 0;
                        item.STATUS_ITEM_PEDIDO = codigo_status;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_VENDAs.ToString(), (decimal)NUMERO_PEDIDO, ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }

                return retorno;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}