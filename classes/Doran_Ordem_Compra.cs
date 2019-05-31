using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using System.Configuration;
using System.Data;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Ordem_Compra : IDisposable
    {
        private decimal NUMERO_PEDIDO_COMPRA { get; set; }

        public Doran_Ordem_Compra()
        {
        }

        public Dictionary<string, object> Gera_Ordem_Compra(decimal ID_UF_EMITENTE, decimal ID_USUARIO)
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();

            TB_FORNECEDOR _fornecedor = Dados_Fornecedor();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var _query = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                  where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 1
                                  select linha).ToList();

                    decimal STATUS_COTACAO = 0;

                    foreach (var item in _query)
                    {
                        STATUS_COTACAO = item.CODIGO_STATUS_COMPRA;
                    }

                    var query1 = (from linha in ctx.TB_STATUS_PEDIDOs
                                  where linha.STATUS_ESPECIFICO == 7
                                  select linha).ToList();

                    if (!query1.Any())
                        throw new Exception("O status [ORDEM DE COMPRA] n&atilde;o est&aacute; cadastradado");

                    foreach (var item in query1)
                    {
                        retorno.Add("CODIGO_STATUS_PEDIDO", item.CODIGO_STATUS_PEDIDO);

                        retorno.Add("STATUS_ITEM_PEDIDO", item.CODIGO_STATUS_PEDIDO);
                        retorno.Add("DESCRICAO_STATUS_PEDIDO", item.DESCRICAO_STATUS_PEDIDO.Trim());
                        retorno.Add("COR_STATUS", item.COR_STATUS.Trim());
                        retorno.Add("COR_FONTE_STATUS", item.COR_FONTE_STATUS.Trim());
                    }

                    var CODIGO_CP = (from linha in ctx.TB_COND_PAGTOs
                                     select linha.CODIGO_CP).ToList().First();

                    NUMERO_PEDIDO_COMPRA = Doran_Compras.Obtem_Novo_Numero_Pedido();
                    //decimal NUMERO_ITEM_COMPRA = 0;

                    DateTime _hoje = DateTime.Now;

                    //foreach (var item in query)
                    //{
                    //    System.Data.Linq.Table<TB_PEDIDO_COMPRA> Entidade = ctx.GetTable<TB_PEDIDO_COMPRA>();

                    //    TB_PEDIDO_COMPRA novo = new TB_PEDIDO_COMPRA();

                    //    novo.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;

                    //    novo.ID_PRODUTO_COMPRA = item.ID_PRODUTO_PEDIDO;
                    //    novo.CODIGO_PRODUTO_COMPRA = item.TB_PRODUTO.CODIGO_PRODUTO.Trim();
                    //    novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = item.CODIGO_COMPLEMENTO_PEDIDO;
                    //    novo.UNIDADE_ITEM_COMPRA = item.UNIDADE_ITEM_PEDIDO;
                    //    novo.TIPO_DESCONTO_ITEM_COMPRA = 0;
                    //    novo.VALOR_DESCONTO_ITEM_COMPRA = 0;
                    //    novo.PRECO_ITEM_COMPRA = 0;
                    //    novo.VALOR_TOTAL_ITEM_COMPRA = 0;
                    //    novo.ALIQ_ICMS_ITEM_COMPRA = 0;
                    //    novo.BASE_ICMS_ITEM_COMPRA = 0;
                    //    novo.VALOR_ICMS_ITEM_COMPRA = 0;
                    //    novo.BASE_ICMS_ST_ITEM_COMPRA = 0;
                    //    novo.VALOR_ICMS_ST_ITEM_COMPRA = 0;
                    //    novo.ALIQ_IPI_ITEM_COMPRA = 0;
                    //    novo.VALOR_IPI_ITEM_COMPRA = 0;
                    //    novo.CODIGO_FORNECEDOR_ITEM_COMPRA = string.Empty;
                    //    novo.OBS_ITEM_COMPRA = string.Empty;
                    //    novo.STATUS_ITEM_COMPRA = STATUS_COTACAO;
                    //    novo.DATA_ITEM_COMPRA = DateTime.Now;

                    //    novo.PREVISAO_ENTREGA_ITEM_COMPRA = ((DateTime)item.ENTREGA_PEDIDO).AddDays(-5) < DateTime.Today ?
                    //        DateTime.Today.AddDays(1) : ((DateTime)item.ENTREGA_PEDIDO).AddDays(-5);

                    //    novo.ENTREGA_EFETIVA_ITEM_COMPRA = new DateTime(1901, 01, 01);
                    //    novo.CODIGO_COND_PAGTO = CODIGO_CP;
                    //    novo.QTDE_NF_ITEM_COMPRA = 0;
                    //    novo.CODIGO_FORNECEDOR = _fornecedor.CODIGO_FORNECEDOR;

                    //    novo.CONTATO_COTACAO_FORNECEDOR = _fornecedor.CONTATO_FORNECEDOR.Trim();
                    //    novo.EMAIL_COTACAO_FORNECEDOR = _fornecedor.EMAIL_FORNECEDOR.Trim();
                    //    novo.TELEFONE_COTACAO_FORNECEDOR = _fornecedor.TELEFONE1_FORNECEDOR.Trim();
                    //    novo.FRETE_COTACAO_FORNECEDOR = 0;
                    //    novo.VALOR_FRETE_COTACAO_FORNECEDOR = 0;
                    //    novo.ID_UF_COTACAO_FORNECEDOR = ID_UF_EMITENTE;
                    //    novo.CODIGO_CP_COTACAO_FORNECEDOR = _fornecedor.CODIGO_CP_FORNECEDOR;

                    //    novo.DATA_PEDIDO_COTACAO = DateTime.Now;
                    //    novo.DATA_RESPOSTA = new DateTime(1901, 01, 01);
                    //    novo.CHAVE_COTACAO = -1;
                    //    novo.COTACAO_ENVIADA = 0;
                    //    novo.COTACAO_RESPONDIDA = 0;
                    //    novo.OBS_FORNECEDOR = string.Empty;
                    //    novo.DATA_VALIDADE_COTACAO = DateTime.Today.AddDays(15);
                    //    novo.MARCA_PEDIDO = 0;
                    //    novo.COTACAO_VENCEDORA = 0;
                    //    novo.PRECO_RESERVA = 0;
                    //    novo.NUMERO_PEDIDO_VENDA = 0;
                    //    novo.NUMERO_ITEM_VENDA = 0;

                    //    Entidade.InsertOnSubmit(novo);

                    //    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                    //    ctx.SubmitChanges();

                    //    NUMERO_ITEM_COMPRA = novo.NUMERO_ITEM_COMPRA;

                    //    /////////////////////

                    //    var DATA_STATUS_ANTERIOR = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                    //                                where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                    //                                && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                    //                                select linha).Any() ?

                    //                                (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                    //                                 where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                    //                                 && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                    //                                 select linha.DATA_MUDANCA).Max() : item.DATA_PEDIDO;

                    //    System.Data.Linq.Table<TB_MUDANCA_STATUS_PEDIDO> Entidade3 = ctx.GetTable<TB_MUDANCA_STATUS_PEDIDO>();

                    //    TB_MUDANCA_STATUS_PEDIDO novo3 = new TB_MUDANCA_STATUS_PEDIDO();

                    //    novo3.NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO;
                    //    novo3.NUMERO_ITEM_VENDA = item.NUMERO_ITEM;
                    //    novo3.DATA_MUDANCA = _hoje;
                    //    novo3.ID_USUARIO = ID_USUARIO;
                    //    novo3.ID_STATUS_ANTERIOR = item.STATUS_ITEM_PEDIDO;
                    //    novo3.ID_STATUS_NOVO = Convert.ToDecimal(retorno["CODIGO_STATUS_PEDIDO"]);
                    //    novo3.DATA_STATUS_ANTERIOR = DATA_STATUS_ANTERIOR;
                    //    novo3.ID_PRODUTO = item.ID_PRODUTO_PEDIDO;

                    //    Entidade3.InsertOnSubmit(novo3);

                    //    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo3, Entidade3.ToString(), item.NUMERO_PEDIDO, ID_USUARIO);

                    //    ctx.SubmitChanges();

                    //    ////

                    //    item.STATUS_ITEM_PEDIDO = Convert.ToDecimal(retorno["CODIGO_STATUS_PEDIDO"]);
                    //    item.ITEM_A_COMPRAR = 0;
                    //    item.ID_USUARIO_ITEM_A_COMPRAR = 0;

                    //    if (!retorno.ContainsKey("NUMERO_PEDIDO_COMPRA"))
                    //        retorno.Add("NUMERO_PEDIDO_COMPRA", NUMERO_PEDIDO_COMPRA);

                    //    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                    //        "TB_PEDIDO_VENDA", item.NUMERO_PEDIDO, ID_USUARIO);

                    //    ctx.SubmitChanges();

                    //    System.Data.Linq.Table<TB_ASSOCIACAO_COMPRA_VENDA> Entidade2 = ctx.GetTable<TB_ASSOCIACAO_COMPRA_VENDA>();

                    //    TB_ASSOCIACAO_COMPRA_VENDA novo2 = new TB_ASSOCIACAO_COMPRA_VENDA();

                    //    novo2.NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO;
                    //    novo2.NUMERO_ITEM_VENDA = item.NUMERO_ITEM;
                    //    novo2.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;
                    //    novo2.NUMERO_ITEM_COMPRA = NUMERO_ITEM_COMPRA;

                    //    Entidade2.InsertOnSubmit(novo2);

                    //    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo2, Entidade2.ToString(), ID_USUARIO);

                    //    ctx.SubmitChanges();
                    //}

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

        public static TB_FORNECEDOR Dados_Fornecedor()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var fornecedor = (from linha in ctx.TB_FORNECEDORs
                                  select linha).ToList();

                if (fornecedor.Count == 0)
                    throw new Exception("N&atilde;o h&aacute; nenhum fornecedor definido para ordem de compra");

                var _fornecedor = fornecedor.First();

                return _fornecedor;
            }
        }

        public List<Dictionary<string, object>> Gera_Ordem_Compra_Sugestao(List<Dictionary<string, object>> LINHAS, decimal ID_UF_EMITENTE,
            decimal ID_USUARIO)
        {
            List<Dictionary<string, object>> retorno = new List<Dictionary<string, object>>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var _query = (from _linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                              where _linha.STATUS_ESPECIFICO_ITEM_COMPRA == 1
                              select _linha).ToList();

                decimal STATUS_COTACAO = _query.First().CODIGO_STATUS_COMPRA;

                var query1 = (from _linha in ctx.TB_STATUS_PEDIDOs
                              where _linha.STATUS_ESPECIFICO == 7
                              select _linha).ToList();

                if (query1.Count == 0)
                    throw new Exception("O status [ORDEM DE COMPRA] n&atilde;o est&aacute; cadastradado");

                var CODIGO_CP = (from _linha in ctx.TB_COND_PAGTOs
                                 where _linha.CONDICAO_CLIENTE_NOVO == 1
                                 select _linha.CODIGO_CP).ToList().First();

                TB_FORNECEDOR _fornecedor = Dados_Fornecedor();

                NUMERO_PEDIDO_COMPRA = Doran_Compras.Obtem_Novo_Numero_Pedido();
                decimal NUMERO_ITEM_COMPRA = 0;

                foreach (Dictionary<string, object> linha in LINHAS)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        System.Data.Linq.Table<TB_PEDIDO_COMPRA> Entidade = ctx1.GetTable<TB_PEDIDO_COMPRA>();

                        TB_PEDIDO_COMPRA novo = new TB_PEDIDO_COMPRA();

                        novo.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;

                        string qtde = linha["QTDE_COMPRA"].ToString();
                        qtde = qtde.Replace(".", ",");

                        novo.ID_PRODUTO_COMPRA = Convert.ToDecimal(linha["ID_PRODUTO_PEDIDO"]);
                        novo.CODIGO_PRODUTO_COMPRA = linha["CODIGO_PRODUTO_PEDIDO"].ToString();
                        novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = 0;
                        novo.UNIDADE_ITEM_COMPRA = linha["UNIDADE"].ToString();
                        novo.QTDE_ITEM_COMPRA = Convert.ToDecimal(qtde);
                        novo.TIPO_DESCONTO_ITEM_COMPRA = 0;
                        novo.VALOR_DESCONTO_ITEM_COMPRA = 0;
                        novo.PRECO_ITEM_COMPRA = 0;
                        novo.VALOR_TOTAL_ITEM_COMPRA = 0;
                        novo.ALIQ_ICMS_ITEM_COMPRA = 0;
                        novo.BASE_ICMS_ITEM_COMPRA = 0;
                        novo.VALOR_ICMS_ITEM_COMPRA = 0;
                        novo.BASE_ICMS_ST_ITEM_COMPRA = 0;
                        novo.VALOR_ICMS_ST_ITEM_COMPRA = 0;
                        novo.ALIQ_IPI_ITEM_COMPRA = 0;
                        novo.VALOR_IPI_ITEM_COMPRA = 0;
                        novo.CODIGO_FORNECEDOR_ITEM_COMPRA = string.Empty;
                        novo.NUMERO_LOTE_ITEM_COMPRA = string.Empty;
                        novo.OBS_ITEM_COMPRA = string.Empty;
                        novo.STATUS_ITEM_COMPRA = STATUS_COTACAO;
                        novo.DATA_ITEM_COMPRA = DateTime.Now;
                        novo.PREVISAO_ENTREGA_ITEM_COMPRA = DateTime.Today.AddDays(1);
                        novo.ENTREGA_EFETIVA_ITEM_COMPRA = new DateTime(1901, 01, 01);
                        novo.CODIGO_COND_PAGTO = CODIGO_CP;
                        novo.QTDE_NF_ITEM_COMPRA = 0;
                        novo.CODIGO_FORNECEDOR = _fornecedor.CODIGO_FORNECEDOR;

                        novo.CONTATO_COTACAO_FORNECEDOR = _fornecedor.CONTATO_FORNECEDOR.Trim();
                        novo.EMAIL_COTACAO_FORNECEDOR = _fornecedor.EMAIL_FORNECEDOR.Trim();
                        novo.TELEFONE_COTACAO_FORNECEDOR = _fornecedor.TELEFONE1_FORNECEDOR.Trim();
                        novo.FRETE_COTACAO_FORNECEDOR = 0;
                        novo.VALOR_FRETE_COTACAO_FORNECEDOR = 0;
                        novo.ID_UF_COTACAO_FORNECEDOR = ID_UF_EMITENTE;
                        novo.CODIGO_CP_COTACAO_FORNECEDOR = _fornecedor.CODIGO_CP_FORNECEDOR;

                        novo.DATA_PEDIDO_COTACAO = DateTime.Now;
                        novo.DATA_RESPOSTA = new DateTime(1901, 01, 01);
                        novo.CHAVE_COTACAO = -1;
                        novo.COTACAO_ENVIADA = 1;
                        novo.COTACAO_RESPONDIDA = 2;
                        novo.OBS_FORNECEDOR = string.Empty;
                        novo.DATA_VALIDADE_COTACAO = DateTime.Today.AddDays(15);
                        novo.MARCA_PEDIDO = 0;
                        novo.COTACAO_VENCEDORA = 1;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx1, novo, Entidade.ToString(), ID_USUARIO);

                        ctx1.SubmitChanges();

                        NUMERO_ITEM_COMPRA = novo.NUMERO_ITEM_COMPRA;
                    }

                    var query = (from _linha in ctx.TB_PEDIDO_VENDAs
                                 where _linha.NUMERO_PEDIDO == Convert.ToDecimal(linha["NUMERO_PEDIDO"])
                                 && _linha.NUMERO_ITEM == Convert.ToDecimal(linha["NUMERO_ITEM"])
                                 select _linha).ToList();

                    Dictionary<string, object> linhaRetorno = new Dictionary<string, object>();

                    linhaRetorno.Add("NUMERO_PEDIDO", Convert.ToDecimal(linha["NUMERO_PEDIDO"]));
                    linhaRetorno.Add("NUMERO_ITEM", Convert.ToDecimal(linha["NUMERO_ITEM"]));

                    foreach (var item in query)
                    {
                        item.STATUS_ITEM_PEDIDO = query1.First().CODIGO_STATUS_PEDIDO;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            "TB_PEDIDO_VENDA", item.NUMERO_PEDIDO, ID_USUARIO);

                        linhaRetorno.Add("STATUS_ITEM_PEDIDO", query1.First().CODIGO_STATUS_PEDIDO);
                        linhaRetorno.Add("DESCRICAO_STATUS_PEDIDO", query1.First().DESCRICAO_STATUS_PEDIDO.Trim());
                        linhaRetorno.Add("COR_STATUS", query1.First().COR_STATUS.Trim());
                        linhaRetorno.Add("COR_FONTE_STATUS", query1.First().COR_FONTE_STATUS.Trim());

                        linhaRetorno.Add("NUMERO_PEDIDO_COMPRA", NUMERO_PEDIDO_COMPRA);
                        linhaRetorno.Add("STATUS_COMPRA", STATUS_COTACAO);
                        linhaRetorno.Add("COR_STATUS_PEDIDO_COMPRA", _query.First().COR_STATUS_PEDIDO_COMPRA.Trim());
                        linhaRetorno.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", _query.First().COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        linhaRetorno.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", _query.First().DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                    }

                    retorno.Add(linhaRetorno);
                }

                ctx.SubmitChanges();
            }

            return retorno;
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}