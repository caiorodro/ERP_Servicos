using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.IO;
using System.Configuration;
using Doran_Base.Auditoria;
using Doran_Base;
using System.Data.Linq;
using Doran_Servicos_ORM;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_PEDIDO_COMPRA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_PEDIDO_COMPRA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Itens_Compra(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Carrega_Itens_Cotacao(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Itens_Pre_Cotacao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Carrega_Itens_Pre_Cotacao(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Itens_Cotacao_Chave(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Carrega_Itens_Chave(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Fornecedores_Cotacao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Lista_Fornecedores_Cotacao(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Cotacao_Fornecedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Lista_Cotacao_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Cotacoes_Fornecedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Carrega_Cotacoes_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Cotacoes_Fornecedor_Por_Numero_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compra.Carrega_Cotacoes_Fornecedor_Por_Numero_Pedido(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public decimal GravaNovoItem(Dictionary<string, object> dados)
        {
            try
            {
                decimal STATUS_ITEM = 0;
                decimal? CODIGO_FORNECEDOR = 0;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                 where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 1
                                 select linha.CODIGO_STATUS_COMPRA).ToList();

                    foreach (var item in query)
                        STATUS_ITEM = item;
                }

                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    dados.Add("STATUS_ITEM_COMPRA", STATUS_ITEM);
                    dados.Add("OBS_FORNECEDOR", "");
                    dados["CODIGO_FORNECEDOR"] = CODIGO_FORNECEDOR;

                    return compra.GravaNovoItemCompra(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaItem(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    compra.AtualizaItemCompra(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaItemCotacaoFornecedor(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    compra.DeletaItemCotacaoFornecedor(NUMERO_ITEM_COMPRA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaItem(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    compra.DeletaItemCompra(NUMERO_ITEM_COMPRA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaCotacaoFornecedor(decimal NUMERO_PEDIDO_COMPRA, List<decimal> Itens, List<decimal> FORNECEDORES, decimal ID_USUARIO)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    // faz a query do numero do pedido + o numero do primeiro fornecedor

                    for (int n = 0; n < Itens.Count; n++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                     orderby linha.NUMERO_ITEM_COMPRA

                                     where linha.NUMERO_ITEM_COMPRA == Itens[n]

                                     select linha).ToList();

                        for (int i = 0; i < FORNECEDORES.Count; i++)
                        {
                            var fornecedor_atual = (from linha in ctx.TB_FORNECEDORs
                                                    where linha.CODIGO_FORNECEDOR == FORNECEDORES[i]
                                                    select linha).ToList().First();

                            int CHAVE = Doran_Compras.CRIA_CHAVE_COTACAO(NUMERO_PEDIDO_COMPRA, FORNECEDORES[i]);

                            foreach (var item in query)
                            {
                                if (!ItemJaFormado(ctx, item.NUMERO_PEDIDO_COMPRA, FORNECEDORES[i], item.ID_PRODUTO_COMPRA, item.QTDE_ITEM_COMPRA, item.PREVISAO_ENTREGA_ITEM_COMPRA))
                                {
                                    var ultimo_preco = (from linha in ctx.TB_PEDIDO_COMPRAs
                                                        orderby linha.CODIGO_FORNECEDOR, linha.DATA_ITEM_COMPRA descending
                                                        where linha.CODIGO_FORNECEDOR == FORNECEDORES[i]
                                                        && linha.ID_PRODUTO_COMPRA == item.ID_PRODUTO_COMPRA
                                                        select linha).Take(1).ToList();

                                    decimal _ultimo_preco = ultimo_preco.Any() ? (decimal)ultimo_preco[0].PRECO_ITEM_COMPRA : 0;

                                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_PEDIDO_COMPRA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PEDIDO_COMPRA>();

                                    Doran_Servicos_ORM.TB_PEDIDO_COMPRA novo = new Doran_Servicos_ORM.TB_PEDIDO_COMPRA();

                                    novo.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;

                                    novo.ID_PRODUTO_COMPRA = item.ID_PRODUTO_COMPRA;
                                    novo.CODIGO_PRODUTO_COMPRA = item.CODIGO_PRODUTO_COMPRA.Trim();
                                    novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = item.CODIGO_COMPLEMENTO_PRODUTO_COMPRA;
                                    novo.UNIDADE_ITEM_COMPRA = item.UNIDADE_ITEM_COMPRA.Trim();
                                    novo.QTDE_ITEM_COMPRA = item.QTDE_ITEM_COMPRA;
                                    novo.QTDE_FORNECEDOR = item.QTDE_FORNECEDOR;
                                    novo.TIPO_DESCONTO_ITEM_COMPRA = item.TIPO_DESCONTO_ITEM_COMPRA;
                                    novo.VALOR_DESCONTO_ITEM_COMPRA = item.VALOR_DESCONTO_ITEM_COMPRA;
                                    novo.PRECO_ITEM_COMPRA = _ultimo_preco;
                                    novo.PRECO_FINAL_FORNECEDOR = _ultimo_preco;
                                    novo.VALOR_TOTAL_ITEM_COMPRA = item.VALOR_TOTAL_ITEM_COMPRA;
                                    novo.ALIQ_ICMS_ITEM_COMPRA = item.ALIQ_ICMS_ITEM_COMPRA;
                                    novo.BASE_ICMS_ITEM_COMPRA = item.BASE_ICMS_ITEM_COMPRA;
                                    novo.VALOR_ICMS_ITEM_COMPRA = item.VALOR_ICMS_ITEM_COMPRA;
                                    novo.BASE_ICMS_ST_ITEM_COMPRA = item.BASE_ICMS_ST_ITEM_COMPRA;
                                    novo.VALOR_ICMS_ST_ITEM_COMPRA = item.VALOR_ICMS_ST_ITEM_COMPRA;
                                    novo.ALIQ_IPI_ITEM_COMPRA = item.ALIQ_IPI_ITEM_COMPRA;
                                    novo.VALOR_IPI_ITEM_COMPRA = item.VALOR_IPI_ITEM_COMPRA;
                                    novo.CODIGO_CFOP_ITEM_COMPRA = item.CODIGO_CFOP_ITEM_COMPRA.Trim();
                                    novo.CODIGO_FORNECEDOR_ITEM_COMPRA = item.CODIGO_FORNECEDOR_ITEM_COMPRA.Trim();
                                    novo.NUMERO_LOTE_ITEM_COMPRA = item.NUMERO_LOTE_ITEM_COMPRA.Trim();
                                    novo.OBS_ITEM_COMPRA = item.OBS_ITEM_COMPRA.Trim();
                                    novo.STATUS_ITEM_COMPRA = item.STATUS_ITEM_COMPRA;
                                    novo.DATA_ITEM_COMPRA = DateTime.Now;
                                    novo.PREVISAO_ENTREGA_ITEM_COMPRA = item.PREVISAO_ENTREGA_ITEM_COMPRA;
                                    novo.ENTREGA_EFETIVA_ITEM_COMPRA = item.ENTREGA_EFETIVA_ITEM_COMPRA;
                                    novo.CODIGO_COND_PAGTO = item.CODIGO_COND_PAGTO;
                                    novo.QTDE_NF_ITEM_COMPRA = 0;
                                    novo.CODIGO_FORNECEDOR = FORNECEDORES[i];

                                    novo.CONTATO_COTACAO_FORNECEDOR = fornecedor_atual.CONTATO_FORNECEDOR.Trim();
                                    novo.EMAIL_COTACAO_FORNECEDOR = fornecedor_atual.EMAIL_FORNECEDOR.Trim();
                                    novo.TELEFONE_COTACAO_FORNECEDOR = fornecedor_atual.TELEFONE1_FORNECEDOR.Trim();
                                    novo.FRETE_COTACAO_FORNECEDOR = item.FRETE_COTACAO_FORNECEDOR;
                                    novo.VALOR_FRETE_COTACAO_FORNECEDOR = item.VALOR_FRETE_COTACAO_FORNECEDOR;
                                    novo.ID_UF_COTACAO_FORNECEDOR = fornecedor_atual.ID_UF_FORNECEDOR;
                                    novo.CODIGO_CP_COTACAO_FORNECEDOR = item.CODIGO_CP_COTACAO_FORNECEDOR;
                                    novo.DATA_PEDIDO_COTACAO = DateTime.Now;
                                    novo.DATA_RESPOSTA = new DateTime(1901, 01, 01);
                                    novo.CHAVE_COTACAO = Doran_Compras.CRIA_CHAVE_COTACAO(NUMERO_PEDIDO_COMPRA, FORNECEDORES[i]);

                                    novo.COTACAO_ENVIADA = 0;
                                    novo.COTACAO_RESPONDIDA = 0;
                                    novo.OBS_FORNECEDOR = item.OBS_FORNECEDOR.Trim();
                                    novo.DATA_VALIDADE_COTACAO = DateTime.Today.AddDays(15);
                                    novo.MARCA_PEDIDO = 0;
                                    novo.COTACAO_VENCEDORA = 0;
                                    novo.NUMERO_ITEM_COMPRA = 0;
                                    novo.NUMERO_ITEM_COTACAO_ORIGINAL = item.NUMERO_ITEM_COMPRA;
                                    novo.PRECO_RESERVA = 0;

                                    Entidade.InsertOnSubmit(novo);

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                                    ctx.SubmitChanges();

                                    var query1 = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                  orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                                  where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                                  && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                                  select linha).ToList();

                                    if (query1.Any())
                                    {
                                        System.Data.Linq.Table<TB_ASSOCIACAO_COMPRA_VENDA> Entidade1 = ctx.GetTable<TB_ASSOCIACAO_COMPRA_VENDA>();

                                        TB_ASSOCIACAO_COMPRA_VENDA novo1 = new TB_ASSOCIACAO_COMPRA_VENDA();

                                        novo1.NUMERO_PEDIDO_VENDA = query1.First().NUMERO_PEDIDO_VENDA;
                                        novo1.NUMERO_ITEM_VENDA = query1.First().NUMERO_ITEM_VENDA;
                                        novo1.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;
                                        novo1.NUMERO_ITEM_COMPRA = novo.NUMERO_ITEM_COMPRA;

                                        Entidade1.InsertOnSubmit(novo1);

                                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), ID_USUARIO);

                                        ctx.SubmitChanges();
                                    }
                                }
                            }
                        }
                    }

                    ctx.Transaction.Commit();
                }
                catch (Exception ex)
                {
                    ctx.Transaction.Rollback();
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                    throw ex;
                }
            }
        }

        [WebMethod()]
        public void Envia_Cotacao_Fornecedor(decimal NUMERO_PEDIDO_COMPRA, string Mensagem, decimal ID_CONTA_EMAIL, string FROM_ADDRESS,
            string NOME_FANTASIA_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    compras.Envia_Cotacao_Fornecedor(Mensagem, ID_CONTA_EMAIL, FROM_ADDRESS, NOME_FANTASIA_EMITENTE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string BuscaUltimoPreco(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return compras.BuscaUltimoPreco(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Itens_Fornecedor(List<Dictionary<string, object>> LINHAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, ID_USUARIO))
                {
                    compras.Salva_Itens_Fornecedor(LINHAS);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Responder_Cotacao(List<decimal> LINHAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, ID_USUARIO))
                {
                    compras.Responder_Cotacao(LINHAS);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Itens_Fechar(List<Decimal> itens, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, ID_USUARIO))
                {
                    compras.Marca_Itens_Fechar(itens);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Fecha_Pedido(string Mensagem, bool NAO_ENVIAR_EMAIL, decimal ID_CONTA_EMAIL, string FROM_ADDRESS, string NOME_FANTASIA_EMITENTE,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, ID_USUARIO))
                {
                    compras.Fecha_Pedido(Mensagem, NAO_ENVIAR_EMAIL, ID_CONTA_EMAIL, FROM_ADDRESS, NOME_FANTASIA_EMITENTE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Busca_Fornecedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FORNECEDORs
                                where (linha.NOME_FANTASIA_FORNECEDOR.Contains(dados["pesquisa"].ToString()) ||
                                linha.NOME_FORNECEDOR.Contains(dados["pesquisa"].ToString()) ||
                                linha.CONTATO_FORNECEDOR.Contains(dados["pesquisa"].ToString()))

                                select new
                                {
                                    linha.CODIGO_FORNECEDOR,
                                    linha.NOME_FANTASIA_FORNECEDOR,
                                    linha.CONTATO_FORNECEDOR,
                                    linha.TELEFONE1_FORNECEDOR,
                                    linha.TELEFONE2_FORNECEDOR,
                                    linha.EMAIL_FORNECEDOR,
                                    linha.ID_UF_FORNECEDOR,
                                    linha.CODIGO_CP_FORNECEDOR
                                };

                    var rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query1, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Grava_Pedido_Compra(Dictionary<string, object> dados)
        {
            try
            {
                decimal NUMERO_PEDIDO_COMPRA = 0;

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    dados.Add("STATUS_ITEM_COMPRA", 11); // Pedido em digitação
                    dados.Add("OBS_FORNECEDOR", "");

                    NUMERO_PEDIDO_COMPRA = compra.GravaNovoItemCompra(dados);

                    dados["NUMERO_ITEM_COMPRA"] = compra.NUMERO_ITEM_COMPRA;

                    retorno = compra.Calcula_Totais_Pedido();
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Atualiza_Pedido_Compra(Dictionary<string, object> dados)
        {
            try
            {
                Doran_Compras.ConsistenciaItem(dados);

                string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    try
                    {
                        ctx.Connection.ConnectionString = str_conn;
                        ctx.Connection.Open();
                        ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                        string CODIGO_PRRODUTO = Doran_Compras.Codigo_Produto(Convert.ToDecimal(dados["ID_PRODUTO"]));

                        // dados = Doran_Compras.Calculo_IVA(dados, CODIGO_PRRODUTO);

                        var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                      where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])
                                      && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(dados["NUMERO_ITEM_COMPRA"])
                                      select linha).ToList();

                        decimal STATUS_ITEM_COMPRA = 0;

                        foreach (var novo in query1)
                        {
                            STATUS_ITEM_COMPRA = novo.STATUS_ITEM_COMPRA.Value;

                            novo.ID_PRODUTO_COMPRA = Convert.ToDecimal(dados["ID_PRODUTO"]);
                            novo.CODIGO_PRODUTO_COMPRA = CODIGO_PRRODUTO;
                            novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = Convert.ToDecimal(dados["CODIGO_COMPLEMENTO_PRODUTO_COMPRA"]);
                            novo.UNIDADE_ITEM_COMPRA = dados["UNIDADE_ITEM_COMPRA"].ToString();
                            novo.QTDE_ITEM_COMPRA = Convert.ToDecimal(dados["QTDE_ITEM_COMPRA"]);
                            novo.TIPO_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["TIPO_DESCONTO_ITEM_COMPRA"]);
                            novo.VALOR_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_DESCONTO_ITEM_COMPRA"]);
                            novo.PRECO_ITEM_COMPRA = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                            novo.VALOR_TOTAL_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_COMPRA"]);
                            novo.ALIQ_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_COMPRA"]);
                            novo.BASE_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ITEM_COMPRA"]);
                            novo.VALOR_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ITEM_COMPRA"]);
                            novo.BASE_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ST_ITEM_COMPRA"]);
                            novo.VALOR_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ST_ITEM_COMPRA"]);
                            novo.ALIQ_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_IPI_ITEM_COMPRA"]);
                            novo.VALOR_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_IPI_ITEM_COMPRA"]);
                            novo.CODIGO_CFOP_ITEM_COMPRA = dados["CODIGO_CFOP_ITEM_COMPRA"].ToString();
                            novo.CODIGO_FORNECEDOR_ITEM_COMPRA = dados["CODIGO_FORNECEDOR_ITEM_COMPRA"].ToString();
                            novo.NUMERO_LOTE_ITEM_COMPRA = dados["NUMERO_LOTE_ITEM_COMPRA"].ToString();
                            novo.OBS_ITEM_COMPRA = dados["OBS_ITEM_COMPRA"].ToString();
                            novo.PREVISAO_ENTREGA_ITEM_COMPRA = Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"]);
                            novo.ENTREGA_EFETIVA_ITEM_COMPRA = Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"]);
                            novo.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);

                            novo.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);
                            novo.QTDE_FORNECEDOR = Convert.ToDecimal(dados["QTDE_FORNECEDOR"]);
                            novo.CODIGO_CP_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);

                            novo.CONTATO_COTACAO_FORNECEDOR = dados["CONTATO_COTACAO_FORNECEDOR"].ToString();
                            novo.EMAIL_COTACAO_FORNECEDOR = dados["EMAIL_COTACAO_FORNECEDOR"].ToString();
                            novo.TELEFONE_COTACAO_FORNECEDOR = dados["TELEFONE_COTACAO_FORNECEDOR"].ToString();
                            novo.FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["FRETE_COTACAO_FORNECEDOR"]);
                            novo.VALOR_FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["VALOR_FRETE_COTACAO_FORNECEDOR"]);
                            novo.ID_UF_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"]);
                            novo.IVA_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["IVA_COTACAO_FORNECEDOR"]);

                            novo.PRECO_FINAL_FORNECEDOR = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                            novo.PREVISAO_ENTREGA_ITEM_COMPRA = Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"]);
                            novo.DATA_RESPOSTA = DateTime.Now;
                            novo.OBS_FORNECEDOR = "";
                            novo.DATA_VALIDADE_COTACAO = DateTime.Now.AddDays(15);
                            novo.MARCA_PEDIDO = 0;
                            novo.ID_USUARIO_COTACAO_VENCEDORA = Convert.ToDecimal(dados["ID_USUARIO"]);

                            decimal reserva = decimal.TryParse(dados["PRECO_RESERVA"].ToString(), out reserva) ?
                                Convert.ToDecimal(dados["PRECO_RESERVA"]) : 0;

                            novo.PRECO_RESERVA = reserva;

                            if (dados.ContainsKey("NUMERO_PEDIDO_VENDA"))
                            {
                                novo.NUMERO_PEDIDO_VENDA = Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"]);
                            }

                            if (dados.ContainsKey("NUMERO_ITEM_VENDA"))
                            {
                                novo.NUMERO_ITEM_VENDA = Convert.ToDecimal(dados["NUMERO_ITEM_VENDA"]);
                            }

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(novo),
                                ctx.TB_PEDIDO_COMPRAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                        }

                        ctx.SubmitChanges();

                        Doran_Compras.Atualiza_Status_Pedido_Conforme_Alcada(ctx, Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]),
                            Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]), STATUS_ITEM_COMPRA,
                            Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.Transaction.Commit();
                    }
                    catch
                    {
                        ctx.Transaction.Rollback();
                        throw;
                    }
                }

                using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    compra.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);

                    return compra.Calcula_Totais_Pedido();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Grava_Dados_Compra(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA

                                 where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])
                                 && linha.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"])

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);
                        item.CODIGO_CP_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);
                        item.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);

                        item.CONTATO_COTACAO_FORNECEDOR = dados["CONTATO_COTACAO_FORNECEDOR"].ToString();
                        item.EMAIL_COTACAO_FORNECEDOR = dados["EMAIL_COTACAO_FORNECEDOR"].ToString();
                        item.TELEFONE_COTACAO_FORNECEDOR = dados["TELEFONE_COTACAO_FORNECEDOR"].ToString();
                        item.FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["FRETE_COTACAO_FORNECEDOR"]);
                        item.VALOR_FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["VALOR_FRETE_COTACAO_FORNECEDOR"]);
                        item.ID_UF_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"]);
                        item.IVA_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["IVA_COTACAO_FORNECEDOR"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                    }

                    ctx.SubmitChanges();

                    using (Doran_Compras compra = new Doran_Compras(Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                    {
                        return compra.Calcula_Totais_Pedido();
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Itens_Pedido_Compra(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Compras ctx = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return ctx.Carrega_Itens_Pedido_Compra(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Recalcula_Totais_Pedido(decimal NUMERO_PEDIDO_COMPRA, bool CALCULO_IVA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras ctx = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    return ctx.Calcula_Totais_Pedido();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Deleta_Item_Pedido_Compra(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal _CODIGO_FORNECEDOR = 0;
                    decimal STATUS_ITEM_COMPRA = 0;

                    var recebimento = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                       where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                       && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                       select linha).Any();

                    if (recebimento)
                        throw new Exception("N&atilde;o &eacute; poss&iacute;vel deletar este item de compra<br />Existe um ou mais recebimentos para este item");

                    var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                  orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                  where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                  && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                  select linha).ToList();

                    foreach (var item in query1)
                    {
                        STATUS_ITEM_COMPRA = item.STATUS_ITEM_COMPRA.Value;

                        /// Desassocia a compra com a venda
                        var items = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                     where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                     && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                     select linha).ToList();

                        foreach (var item1 in items)
                        {
                            ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item1);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        _CODIGO_FORNECEDOR = (decimal)item.CODIGO_FORNECEDOR;

                        ctx.TB_PEDIDO_COMPRAs.DeleteOnSubmit(item);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    Doran_Compras.Atualiza_Status_Pedido_Conforme_Alcada(ctx, NUMERO_PEDIDO_COMPRA, _CODIGO_FORNECEDOR, STATUS_ITEM_COMPRA, ID_USUARIO);

                    ctx.Transaction.Commit();

                    using (Doran_Compras compra = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                    {
                        compra.CODIGO_FORNECEDOR = _CODIGO_FORNECEDOR;

                        return compra.Calcula_Totais_Pedido();
                    }
                }
                catch (Exception ex)
                {
                    ctx.Transaction.Rollback();

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                    throw ex;
                }
            }
        }

        [WebMethod()]
        public string Lista_Itens_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                object[] _status = (object[])dados["STATUS_ITEM_COMPRA"];

                List<decimal?> decStatus = new List<decimal?>();

                for (int i = 0; i < _status.Length; i++)
                    decStatus.Add(Convert.ToDecimal(_status[i]));


                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    if (!Convert.ToBoolean(dados["QTDE_NF"]))
                    {
                        if (Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"]) > 0)
                        {
                            var query = from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                        orderby linha.NUMERO_PEDIDO_VENDA, linha.NUMERO_ITEM_VENDA
                                        where linha.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"])

                                        && linha.TB_PEDIDO_COMPRA.COTACAO_VENCEDORA == 1

                                        && decStatus.Contains(linha.TB_PEDIDO_COMPRA.STATUS_ITEM_COMPRA)

                                        select new
                                        {
                                            linha.NUMERO_PEDIDO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.STATUS_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                            linha.NUMERO_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.ID_PRODUTO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.DATA_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.PREVISAO_ENTREGA_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.CODIGO_PRODUTO_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.QTDE_ITEM_COMPRA,

                                            QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                             where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                             && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                             select linha1.QTDE_RECEBIDA).Sum(),

                                            linha.TB_PEDIDO_COMPRA.QTDE_NF_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.UNIDADE_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.PRECO_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TIPO_DESCONTO_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.VALOR_DESCONTO_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.PRECO_FINAL_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.VALOR_TOTAL_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.ALIQ_ICMS_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.VALOR_ICMS_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.VALOR_ICMS_ST_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.ALIQ_IPI_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.VALOR_IPI_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.CODIGO_CFOP_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                            linha.TB_PEDIDO_COMPRA.NUMERO_LOTE_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.OBS_ITEM_COMPRA,
                                            linha.TB_PEDIDO_COMPRA.CONTATO_COTACAO_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.TELEFONE_COTACAO_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.TB_COND_PAGTO.DESCRICAO_CP,
                                            linha.TB_PEDIDO_COMPRA.OBS_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.EMAIL_COTACAO_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.FRETE_COTACAO_FORNECEDOR,
                                            ATRASADA = linha.TB_PEDIDO_COMPRA.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,
                                            linha.TB_PEDIDO_COMPRA.COTACAO_ENVIADA,
                                            linha.TB_PEDIDO_COMPRA.COTACAO_RESPONDIDA,
                                            linha.TB_PEDIDO_COMPRA.COTACAO_VENCEDORA,
                                            linha.TB_PEDIDO_COMPRA.CODIGO_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.NUMERO_PEDIDO_VENDA,
                                            linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                            linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,

                                            ENDERECO_FORNECEDOR = string.Concat(linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.ENDERECO_FORNECEDOR.Trim(),
                                                " ", linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.NUMERO_END_FORNECEDOR.Trim(),
                                                " ", linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.COMPL_END_FORNECEDOR.Trim(),
                                                " - ", linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO.Trim(),
                                                " - ", linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF.Trim()),

                                            ITENS_ASSOCIADOS = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                                orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                                where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                                && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                                select linha).Any() ? 2 : 0,

                                            TOTAL_PRODUTOS = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                              where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                              && linha1.CODIGO_FORNECEDOR == linha.TB_PEDIDO_COMPRA.CODIGO_FORNECEDOR
                                                              select linha1.VALOR_TOTAL_ITEM_COMPRA).Sum()
                                        };

                            var rowCount = query.Count();

                            query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                            return ApoioXML.objQueryToXML(ctx, query, rowCount);
                        }
                        else
                        {
                            decimal RECEBIDO = 1;

                            if (dados.ContainsKey("RECEBIDO"))
                            {
                                if (Convert.ToBoolean(dados["RECEBIDO"]) == true)
                                {
                                    RECEBIDO = 0;
                                }
                            }

                            var query = from linha in ctx.TB_PEDIDO_COMPRAs
                                        orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA
                                        where linha.PREVISAO_ENTREGA_ITEM_COMPRA >= Convert.ToDateTime(dados["PREVISAO_ENTREGA"])

                                        && (linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])
                                        || Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]) == 0)

                                        && (linha.TB_FORNECEDOR.NOME_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString())
                                        || linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()))

                                        && linha.CODIGO_PRODUTO_COMPRA.Contains(dados["CODIGO_PRODUTO"].ToString())

                                        && linha.COTACAO_VENCEDORA == 1

                                        && (linha.TB_RECEBIMENTO_PEDIDO_COMPRAs.Count > RECEBIDO || RECEBIDO == 1)

                                        && decStatus.Contains(linha.STATUS_ITEM_COMPRA)

                                        select new
                                        {
                                            linha.NUMERO_PEDIDO_COMPRA,
                                            linha.STATUS_ITEM_COMPRA,
                                            linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                            linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                            linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                            linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                            linha.NUMERO_ITEM_COMPRA,
                                            linha.DATA_ITEM_COMPRA,
                                            linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                            linha.ID_PRODUTO_COMPRA,
                                            linha.CODIGO_PRODUTO_COMPRA,
                                            linha.QTDE_ITEM_COMPRA,

                                            QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                             where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                             && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                             select linha1.QTDE_RECEBIDA).Sum(),

                                            linha.QTDE_NF_ITEM_COMPRA,
                                            linha.UNIDADE_ITEM_COMPRA,
                                            linha.PRECO_ITEM_COMPRA,
                                            linha.TIPO_DESCONTO_ITEM_COMPRA,
                                            linha.VALOR_DESCONTO_ITEM_COMPRA,
                                            linha.PRECO_FINAL_FORNECEDOR,
                                            linha.VALOR_TOTAL_ITEM_COMPRA,
                                            linha.ALIQ_ICMS_ITEM_COMPRA,
                                            linha.VALOR_ICMS_ITEM_COMPRA,
                                            linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                            linha.ALIQ_IPI_ITEM_COMPRA,
                                            linha.VALOR_IPI_ITEM_COMPRA,
                                            linha.CODIGO_CFOP_ITEM_COMPRA,
                                            linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                            linha.NUMERO_LOTE_ITEM_COMPRA,
                                            linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                            linha.OBS_ITEM_COMPRA,
                                            linha.CONTATO_COTACAO_FORNECEDOR,
                                            linha.TELEFONE_COTACAO_FORNECEDOR,
                                            linha.TB_COND_PAGTO.DESCRICAO_CP,
                                            linha.OBS_FORNECEDOR,
                                            linha.EMAIL_COTACAO_FORNECEDOR,
                                            linha.FRETE_COTACAO_FORNECEDOR,
                                            ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,
                                            linha.COTACAO_ENVIADA,
                                            linha.COTACAO_RESPONDIDA,
                                            linha.COTACAO_VENCEDORA,
                                            linha.CODIGO_FORNECEDOR,
                                            linha.NUMERO_PEDIDO_VENDA,
                                            linha.NUMERO_ITEM_VENDA,
                                            linha.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                            linha.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,

                                            ENDERECO_FORNECEDOR = string.Concat(linha.TB_FORNECEDOR.ENDERECO_FORNECEDOR.Trim(),
                                                " ", linha.TB_FORNECEDOR.NUMERO_END_FORNECEDOR.Trim(),
                                                " ", linha.TB_FORNECEDOR.COMPL_END_FORNECEDOR.Trim(),
                                                " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO.Trim(),
                                                " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF.Trim()),

                                            ITENS_ASSOCIADOS = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                                orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                                where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                                && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                                select linha).Any() ? 2 : 0,

                                            TOTAL_PRODUTOS = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                              where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                              && linha1.CODIGO_FORNECEDOR == linha.CODIGO_FORNECEDOR
                                                              select linha1.VALOR_TOTAL_ITEM_COMPRA).Sum()
                                        };

                            var rowCount = query.Count();

                            query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                            return ApoioXML.objQueryToXML(ctx, query, rowCount);
                        }
                    }
                    else
                    {
                        var query = from linha in ctx.TB_PEDIDO_COMPRAs
                                    orderby linha.ID_USUARIO_QTDE_NF, linha.QTDE_NF_ITEM_COMPRA

                                    where linha.ID_USUARIO_QTDE_NF == Convert.ToDecimal(dados["ID_USUARIO"])
                                    && linha.QTDE_NF_ITEM_COMPRA > (decimal)0.000

                                    select new
                                    {
                                        linha.NUMERO_PEDIDO_COMPRA,
                                        linha.STATUS_ITEM_COMPRA,
                                        linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                        linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                        linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                        linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                        linha.NUMERO_ITEM_COMPRA,
                                        linha.DATA_ITEM_COMPRA,
                                        linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                        linha.CODIGO_PRODUTO_COMPRA,
                                        linha.QTDE_ITEM_COMPRA,

                                        QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                         where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                         && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                         select linha1.QTDE_RECEBIDA).Sum(),

                                        linha.QTDE_NF_ITEM_COMPRA,
                                        linha.UNIDADE_ITEM_COMPRA,
                                        linha.PRECO_ITEM_COMPRA,
                                        linha.TIPO_DESCONTO_ITEM_COMPRA,
                                        linha.VALOR_DESCONTO_ITEM_COMPRA,
                                        linha.PRECO_FINAL_FORNECEDOR,
                                        linha.VALOR_TOTAL_ITEM_COMPRA,
                                        linha.ALIQ_ICMS_ITEM_COMPRA,
                                        linha.VALOR_ICMS_ITEM_COMPRA,
                                        linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                        linha.ALIQ_IPI_ITEM_COMPRA,
                                        linha.VALOR_IPI_ITEM_COMPRA,
                                        linha.CODIGO_CFOP_ITEM_COMPRA,
                                        linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                        linha.NUMERO_LOTE_ITEM_COMPRA,
                                        linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                        linha.OBS_ITEM_COMPRA,
                                        linha.CONTATO_COTACAO_FORNECEDOR,
                                        linha.TELEFONE_COTACAO_FORNECEDOR,
                                        linha.TB_COND_PAGTO.DESCRICAO_CP,
                                        linha.OBS_FORNECEDOR,
                                        linha.EMAIL_COTACAO_FORNECEDOR,
                                        linha.FRETE_COTACAO_FORNECEDOR,
                                        ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,
                                        linha.COTACAO_ENVIADA,
                                        linha.COTACAO_RESPONDIDA,
                                        linha.COTACAO_VENCEDORA,
                                        linha.CODIGO_FORNECEDOR,
                                        linha.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                        linha.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,

                                        ENDERECO_FORNECEDOR = string.Concat(linha.TB_FORNECEDOR.ENDERECO_FORNECEDOR.Trim(),
                                            " ", linha.TB_FORNECEDOR.NUMERO_END_FORNECEDOR.Trim(),
                                            " ", linha.TB_FORNECEDOR.COMPL_END_FORNECEDOR.Trim(),
                                            " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO.Trim(),
                                            " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF.Trim()),

                                        ITENS_ASSOCIADOS = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                            orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                            where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                            && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                            select linha).Any() ? 2 : 0,

                                        TOTAL_PRODUTOS = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                          where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                          && linha1.CODIGO_FORNECEDOR == linha.CODIGO_FORNECEDOR
                                                          select linha1.VALOR_TOTAL_ITEM_COMPRA).Sum()
                                    };

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        return ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Itens_por_Numero_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_COMPRAs
                                where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])

                                && linha.COTACAO_VENCEDORA == 1

                                select new
                                {
                                    linha.NUMERO_PEDIDO_COMPRA,
                                    linha.STATUS_ITEM_COMPRA,
                                    linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                    linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                    linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                    linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                    linha.NUMERO_ITEM_COMPRA,
                                    linha.DATA_ITEM_COMPRA,
                                    linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                    linha.ID_PRODUTO_COMPRA,
                                    linha.CODIGO_PRODUTO_COMPRA,
                                    linha.QTDE_ITEM_COMPRA,

                                    QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                     where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                     && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                     select linha1.QTDE_RECEBIDA).Sum(),

                                    linha.QTDE_NF_ITEM_COMPRA,
                                    linha.UNIDADE_ITEM_COMPRA,
                                    linha.PRECO_ITEM_COMPRA,
                                    linha.TIPO_DESCONTO_ITEM_COMPRA,
                                    linha.VALOR_DESCONTO_ITEM_COMPRA,
                                    linha.PRECO_FINAL_FORNECEDOR,
                                    linha.VALOR_TOTAL_ITEM_COMPRA,
                                    linha.ALIQ_ICMS_ITEM_COMPRA,
                                    linha.VALOR_ICMS_ITEM_COMPRA,
                                    linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                    linha.ALIQ_IPI_ITEM_COMPRA,
                                    linha.VALOR_IPI_ITEM_COMPRA,
                                    linha.CODIGO_CFOP_ITEM_COMPRA,
                                    linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.NUMERO_LOTE_ITEM_COMPRA,
                                    linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                    linha.OBS_ITEM_COMPRA,
                                    linha.CONTATO_COTACAO_FORNECEDOR,
                                    linha.TELEFONE_COTACAO_FORNECEDOR,
                                    linha.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.OBS_FORNECEDOR,
                                    linha.EMAIL_COTACAO_FORNECEDOR,
                                    linha.FRETE_COTACAO_FORNECEDOR,
                                    ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,
                                    linha.COTACAO_ENVIADA,
                                    linha.COTACAO_RESPONDIDA,
                                    linha.COTACAO_VENCEDORA,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.NUMERO_PEDIDO_VENDA,
                                    linha.NUMERO_ITEM_VENDA,
                                    linha.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                    linha.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,

                                    ENDERECO_FORNECEDOR = string.Concat(linha.TB_FORNECEDOR.ENDERECO_FORNECEDOR.Trim(),
                                        " ", linha.TB_FORNECEDOR.NUMERO_END_FORNECEDOR.Trim(),
                                        " ", linha.TB_FORNECEDOR.COMPL_END_FORNECEDOR.Trim(),
                                        " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO.Trim(),
                                        " - ", linha.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF.Trim()),

                                    ITENS_ASSOCIADOS = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                        orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                        where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                        && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                        select linha).Any() ? 2 : 0,

                                    TOTAL_PRODUTOS = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                      where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                      && linha1.CODIGO_FORNECEDOR == linha.CODIGO_FORNECEDOR
                                                      select linha1.VALOR_TOTAL_ITEM_COMPRA).Sum()
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Dados_Pedido(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    return compra.Busca_Dados_Pedido(CODIGO_FORNECEDOR);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<List<object>> Salva_Recebimento(List<Dictionary<string, object>> LINHAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Recebimento_Compra rec = new Doran_Recebimento_Compra(ID_USUARIO))
                {
                    return rec.Salva_Recebimento(LINHAS);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Local_do_Lote(decimal NUMERO_RECEBIMENTO, decimal ID_LOCAL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Recebimento_Compra rec = new Doran_Recebimento_Compra(ID_USUARIO))
                {
                    rec.Grava_Local_do_Lote(NUMERO_RECEBIMENTO, ID_LOCAL);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<List<object>> Deleta_Recebimento(decimal NUMERO_RECEBIMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Recebimento_Compra rec = new Doran_Recebimento_Compra(ID_USUARIO))
                {
                    return rec.Deleta_Recebimento(NUMERO_RECEBIMENTO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Recebimentos(List<decimal> NUMERO_PEDIDO_COMPRA, List<decimal> NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Recebimento_Compra rec = new Doran_Recebimento_Compra(ID_USUARIO))
                {
                    return rec.Recebimentos(NUMERO_PEDIDO_COMPRA, NUMERO_ITEM_COMPRA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<object> Imprime_Pedido(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, List<decimal> ITENS_COMPRA,
            string LOGIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Impressao_Pedido_Compra compra = new Doran_Impressao_Pedido_Compra(NUMERO_PEDIDO_COMPRA,
                    CODIGO_FORNECEDOR, ITENS_COMPRA, LOGIN_USUARIO, ID_USUARIO))
                {
                    return compra.Imprime_Pedido();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Transforma_Cotacao_Pedido(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compra = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    compra.CODIGO_FORNECEDOR = CODIGO_FORNECEDOR;

                    return compra.Transforma_Cotacao_Pedido();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Qtde_NF(List<decimal> NUMEROS_ITEM_COMPRA, List<decimal> QTDE_NF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Recebimento_Compra rec = new Doran_Recebimento_Compra(ID_USUARIO))
                {
                    rec.Grava_Qtde_NF(NUMEROS_ITEM_COMPRA, QTDE_NF);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<string> Gera_Nota_Entrada(decimal NUMERO_NFE, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Gera_Nota_Entrada nf = new Doran_Gera_Nota_Entrada(ID_USUARIO))
                {
                    return nf.Gera_Nota_Entrada(NUMERO_NFE, ID_EMPRESA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Notas_do_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from nota in ctx.TB_ITEM_NOTA_ENTRADAs
                                 orderby nota.NUMERO_PEDIDO_COMPRA
                                 where nota.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO"])

                                 select new
                                 {
                                     nota.TB_NOTA_ENTRADA.NUMERO_SEQ_NFE,
                                     nota.TB_NOTA_ENTRADA.NUMERO_NFE,
                                     nota.TB_NOTA_ENTRADA.SERIE_NFE,
                                     nota.TB_NOTA_ENTRADA.CODIGO_CFOP_NFE,
                                     nota.TB_NOTA_ENTRADA.TB_CFOP.DESCRICAO_CFOP,
                                     nota.TB_NOTA_ENTRADA.CODIGO_FORNECEDOR,
                                     nota.TB_NOTA_ENTRADA.TB_FORNECEDOR.NOME_FORNECEDOR,
                                     nota.TB_NOTA_ENTRADA.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                     nota.TB_NOTA_ENTRADA.TB_FORNECEDOR.CNPJ_FORNECEDOR,
                                     nota.TB_NOTA_ENTRADA.DATA_EMISSAO_NFE,
                                     nota.TB_NOTA_ENTRADA.DATA_CHEGADA_NFE,
                                     nota.TB_NOTA_ENTRADA.TOTAL_NFE,
                                     nota.TB_NOTA_ENTRADA.BASE_ICMS_NFE,
                                     nota.TB_NOTA_ENTRADA.VALOR_ICMS_NFE,
                                     nota.TB_NOTA_ENTRADA.BASE_ICMS_SUBS_NFE,
                                     nota.TB_NOTA_ENTRADA.VALOR_ICMS_SUBS_NFE,
                                     nota.TB_NOTA_ENTRADA.TOTAL_PRODUTOS_NFE,
                                     nota.TB_NOTA_ENTRADA.VALOR_FRETE_NFE,
                                     nota.TB_NOTA_ENTRADA.VALOR_SEGURO_NFE,
                                     nota.TB_NOTA_ENTRADA.OUTRAS_DESP_NFE,
                                     nota.TB_NOTA_ENTRADA.TOTAL_IPI_NFE,
                                     nota.TB_NOTA_ENTRADA.STATUS_NFE,
                                     nota.TB_NOTA_ENTRADA.CANCELADA_NFE,
                                     nota.TB_NOTA_ENTRADA.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                     nota.NUMERO_PEDIDO_COMPRA
                                 }).Distinct();

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string x = ApoioXML.objQueryToXML(ctx, query, rowCount);
                    return x;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_ItensNotaEntrada(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from nota in ctx.TB_ITEM_NOTA_ENTRADAs
                                 orderby nota.NUMERO_SEQ_NFE, nota.NUMERO_SEQ_ITEM_NFE
                                 where nota.NUMERO_SEQ_NFE == Convert.ToDecimal(dados["NUMERO_SEQ_NFE"])
                                 select nota;

                    var rowCount = query1.Count();

                    query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query1, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Cancela_Pedido_Compra(decimal NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(0, ID_USUARIO))
                {
                    compras.NUMERO_ITEM_COMPRA = NUMERO_ITEM_COMPRA;

                    return compras.Cancela_Pedido_Compra();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private string Executa_Query_Itens_Pedidos(DataTable dt1, Dictionary<string, object> dados, int rowCount)
        {
            DataTable dt = new DataTable("Tabela");

            using (Doran_Compras totais = new Doran_Compras(0, Convert.ToDecimal(dados["ID_USUARIO"])))
            {
                dt = totais.Calcula_Totais_Pedido(dt1);
            }

            dt.Columns.Add("NUMEROS_NF");

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                foreach (DataRow dr in dt.Rows)
                {
                    var NUMEROS_NF = (from linha2 in ctx.TB_ITEM_NOTA_ENTRADAs
                                      orderby linha2.NUMERO_PEDIDO_COMPRA, linha2.NUMERO_ITEM_COMPRA
                                      where linha2.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dr["NUMERO_PEDIDO_COMPRA"])
                                      && linha2.NUMERO_ITEM_COMPRA == Convert.ToDecimal(dr["NUMERO_ITEM_COMPRA"])
                                      select linha2).ToList();

                    string _notas = "";
                    List<decimal> Notas = new List<decimal>();

                    foreach (var item in NUMEROS_NF)
                    {
                        if (!Notas.Contains(item.TB_NOTA_ENTRADA.NUMERO_NFE))
                        {
                            Notas.Add(item.TB_NOTA_ENTRADA.NUMERO_NFE);

                            if (item.NUMERO_PEDIDO_COMPRA > 0)
                                _notas += item.TB_NOTA_ENTRADA.NUMERO_NFE.ToString() + " / ";
                        }
                    }

                    if (_notas.Length > 0)
                        _notas = _notas.Substring(0, _notas.Length - 3);

                    dr["NUMEROS_NF"] = _notas;
                }
            }

            DataSet ds = new DataSet("Query");
            ds.Tables.Add(dt);

            DataTable totalCount = new DataTable("Totais");

            totalCount.Columns.Add("totalCount");

            DataRow nova = totalCount.NewRow();
            nova[0] = rowCount;
            totalCount.Rows.Add(nova);

            ds.Tables.Add(totalCount);

            System.IO.StringWriter tr = new System.IO.StringWriter();
            ds.WriteXml(tr);

            return tr.ToString();
        }

        [WebMethod()]
        public void Salva_Matriz_Primeira_Pagina(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_COMPRA"]))
                {
                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Matriz_Proximas_Paginas(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_COMPRA_ProximaPagina"]))
                {
                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Matriz_Primeira_Pagina(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Pedido = ConfigurationManager.AppSettings["Modelo_COMPRA"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Pedido))
                {
                    retorno = tr.ReadToEnd();
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Matriz_Proximas_Paginas(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Pedido = ConfigurationManager.AppSettings["Modelo_COMPRA_ProximaPagina"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Pedido))
                {
                    retorno = tr.ReadToEnd();
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private bool ItemJaFormado(DataContext ctx, decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, decimal? ID_PRODUTO_COMPRA,
            decimal? QTDE_ITEM_COMPRA, DateTime? PREVISAO_ENTREGA_ITEM_COMPRA)
        {
            var existe = (from linha in ctx.GetTable<Doran_Servicos_ORM.TB_PEDIDO_COMPRA>()

                          where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                          && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                          && linha.ID_PRODUTO_COMPRA == ID_PRODUTO_COMPRA
                          && linha.QTDE_ITEM_COMPRA == QTDE_ITEM_COMPRA
                          && linha.PREVISAO_ENTREGA_ITEM_COMPRA == PREVISAO_ENTREGA_ITEM_COMPRA
                          select linha).Count();

            return existe > 0 ? true : false;
        }

        [WebMethod()]
        public string Carrega_Itens_Venda_Para_Associar_no_Item_Venda(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.DATA_PEDIDO
                                where linha.DATA_PEDIDO >= Convert.ToDateTime(dados["DATA_PEDIDO"])

                                && (linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                || Convert.ToDecimal(dados["NUMERO_PEDIDO"]) == 0)

                                && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Contains(dados["CLIENTE"].ToString())
                                || linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["CLIENTE"].ToString()))

                                && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 1 && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.PRECO_ITEM_PEDIDO,
                                    linha.VALOR_TOTAL_ITEM_PEDIDO,
                                    linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Itens_Venda_Para_Associar_no_Item_Venda_por_Numero_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.NUMERO_PEDIDO
                                where linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])

                                && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.PRECO_ITEM_PEDIDO,
                                    linha.VALOR_TOTAL_ITEM_PEDIDO,
                                    linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Associa_Item_Compra_com_Itens_Venda(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA,
            List<decimal> NUMERO_PEDIDOS_VENDA, List<decimal> NUMERO_ITEMS_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    var STATUS_PEDIDO = (from linha in ctx.TB_STATUS_PEDIDOs
                                         where linha.STATUS_ESPECIFICO == 7
                                         select linha).ToList();

                    if (!STATUS_PEDIDO.Any())
                        throw new Exception("N&atilde;o h&aacute; status de ordem de compra cadastrado");

                    for (int i = 0; i < NUMERO_ITEMS_VENDA.Count; i++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     orderby linha.NUMERO_ITEM

                                     where linha.NUMERO_ITEM == NUMERO_ITEMS_VENDA[i]

                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            // Tabela de Associação entre compra e venda

                            var existe = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                          where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                          && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                          && linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                          && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                          select linha).ToList();

                            if (!existe.Any())
                            {
                                System.Data.Linq.Table<TB_ASSOCIACAO_COMPRA_VENDA> Entidade = ctx.GetTable<TB_ASSOCIACAO_COMPRA_VENDA>();

                                TB_ASSOCIACAO_COMPRA_VENDA novo = new TB_ASSOCIACAO_COMPRA_VENDA();

                                novo.NUMERO_PEDIDO_VENDA = NUMERO_PEDIDOS_VENDA[i];
                                novo.NUMERO_ITEM_VENDA = NUMERO_ITEMS_VENDA[i];
                                novo.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;
                                novo.NUMERO_ITEM_COMPRA = NUMERO_ITEM_COMPRA;

                                Entidade.InsertOnSubmit(novo);

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
                            }

                            ////////
                            retorno.Add("STATUS_ITEM_PEDIDO", STATUS_PEDIDO.First().CODIGO_STATUS_PEDIDO);
                            retorno.Add("COR_STATUS", STATUS_PEDIDO.First().COR_STATUS);
                            retorno.Add("COR_FONTE_STATUS", STATUS_PEDIDO.First().COR_FONTE_STATUS);
                            retorno.Add("DESCRICAO_STATUS_PEDIDO", STATUS_PEDIDO.First().DESCRICAO_STATUS_PEDIDO);
                            retorno.Add("ITENS_ASSOCIADOS", 2);

                            item.STATUS_ITEM_PEDIDO = STATUS_PEDIDO.First().CODIGO_STATUS_PEDIDO;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                "TB_PEDIDO_VENDA", item.NUMERO_PEDIDO, ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Desvincula_Item_Compra_com_Itens_Venda(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA,
            List<decimal> NUMERO_PEDIDOS_VENDA, List<decimal> NUMERO_ITEMS_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    for (int i = 0; i < NUMERO_ITEMS_VENDA.Count; i++)
                    {
                        var query1 = (from linha in ctx.TB_PEDIDO_VENDAs
                                      orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM

                                      where (linha.NUMERO_PEDIDO == NUMERO_PEDIDOS_VENDA[i] &&
                                            linha.NUMERO_ITEM == NUMERO_ITEMS_VENDA[i])

                                      select linha).ToList();

                        foreach (var item in query1)
                        {
                            var items = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                         where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDOS_VENDA[i]
                                         && linha.NUMERO_ITEM_VENDA == NUMERO_ITEMS_VENDA[i]
                                         && linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                         && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                         select linha).ToList();

                            foreach (var item1 in items)
                            {
                                ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item1);

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                            }
                        }
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Itens_do_Item_Venda(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                orderby linha.NUMERO_PEDIDO_VENDA, linha.NUMERO_ITEM_VENDA

                                where linha.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"])
                                && linha.NUMERO_ITEM_VENDA == Convert.ToDecimal(dados["NUMERO_ITEM_VENDA"])

                                select new
                                {
                                    linha.NUMERO_PEDIDO_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.STATUS_ITEM_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                    linha.NUMERO_ITEM_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.PREVISAO_ENTREGA_ITEM_COMPRA,

                                    ENTREGA_EFETIVA_ITEM_COMPRA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                                   orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                                   where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                                   && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                                   select linha1.DATA_RECEBIMENTO).Max(),

                                    linha.TB_PEDIDO_COMPRA.CODIGO_PRODUTO_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.QTDE_ITEM_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.UNIDADE_ITEM_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.DATA_ITEM_COMPRA,
                                    linha.TB_PEDIDO_COMPRA.COTACAO_VENCEDORA,

                                    QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                                     orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                     where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                     && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                     select linha1.QTDE_RECEBIDA).Sum()
                                };

                    if (query.Any(v => v.COTACAO_VENCEDORA == 1))
                        query = query.Where(v => v.COTACAO_VENCEDORA == 1);

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Itens_Venda_do_Item_de_Compra(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs

                                orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])
                                && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(dados["NUMERO_ITEM_COMPRA"])

                                select new
                                 {
                                     linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.STATUS_ITEM_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.COR_STATUS,
                                     linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                     linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                     linha.TB_PEDIDO_VENDA.NUMERO_ITEM,
                                     linha.TB_PEDIDO_VENDA.DATA_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.ENTREGA_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.CODIGO_PRODUTO_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.UNIDADE_ITEM_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.PRECO_ITEM_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.VALOR_TOTAL_ITEM_PEDIDO,
                                     linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                     linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                     linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                     ATRASADA = linha.TB_PEDIDO_VENDA.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                                 };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Preco_Final_Fornecedor(List<Dictionary<string, object>> ITENS, decimal ADMIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                Doran_Compras.Salva_Preco_Final_Fornecedor(ITENS, ADMIN_USUARIO, ID_USUARIO);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_de_Cotacao_Fornecedor(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR,
              decimal ID_EMPRESA, string NOME_FANTASIA_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Lista_Cotacao_Compra lista = new Doran_Lista_Cotacao_Compra(NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR))
                {
                    return lista.Lista_Cotacao(ID_EMPRESA, NOME_FANTASIA_EMITENTE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Furo_Estoque(List<decimal> PEDIDOS, List<decimal> ITENS, bool VOLTAR_PROCESSO, decimal ID_USUARIO)
        {
            try
            {
                Doran_Compras.Furo_Estoque(PEDIDOS, ITENS, VOLTAR_PROCESSO, ID_USUARIO);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<object> Imprime_Pedido_Fornecedor(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, List<decimal> ITENS,
            decimal ID_CONTA_EMAIL, string CNPJ_EMITENTE, string LOGIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Impressao_Pedido_Compra_Novo imp = new Doran_Impressao_Pedido_Compra_Novo(NUMERO_PEDIDO_COMPRA,
                    CODIGO_FORNECEDOR, ITENS))
                {
                    return imp.Imprime_Pedido_Fornecedor(ID_CONTA_EMAIL, CNPJ_EMITENTE, ID_USUARIO, LOGIN_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Itens_Cotados_Nao_Fechados(Dictionary<string, object> dados)
        {
            try
            {
                return Doran_Compras.Lista_Itens_Cotados_Nao_Fechados(dados);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Atualiza_Qtde_Embalagem_Fornecedor(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA, decimal QTDE_NA_EMBALAGEM_FORNECEDOR,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                 where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA)

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.QTDE_NA_EMBALAGEM_FORNECEDOR = QTDE_NA_EMBALAGEM_FORNECEDOR;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Fornecedor_do_Pedido(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, decimal CODIGO_FORNCEDOR_ANTIGO,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Compras compras = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                {
                    compras.Altera_Fornecedor_do_Pedido(CODIGO_FORNECEDOR, CODIGO_FORNCEDOR_ANTIGO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_TB_PRODUTO(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from familia in ctx.GetTable<Doran_Servicos_ORM.TB_PRODUTO>()
                                orderby familia.CODIGO_PRODUTO
                                where familia.CODIGO_PRODUTO.Contains(dados["Pesquisa"].ToString())
                                || familia.DESCRICAO_PRODUTO.Contains(dados["Pesquisa"].ToString())

                                select new
                                {
                                    familia.ID_PRODUTO,
                                    familia.CODIGO_PRODUTO,
                                    familia.DESCRICAO_PRODUTO
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public decimal BuscaPorCODIGO_PRODUTO(string CODIGO_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PRODUTOs
                                 orderby linha.CODIGO_PRODUTO
                                 where linha.CODIGO_PRODUTO == CODIGO_PRODUTO
                                 select linha.ID_PRODUTO).ToList();

                    if (!query.Any())
                        throw new Exception("C&oacute;digo de produto n&atilde;o cadastrado");

                    return query.First();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Exporta_CSV(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Sugestao_Compra sc = new Doran_Sugestao_Compra())
                {
                    return sc.Calcula_Sugestao_Compra_Excel(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Th2_Itens_Compra_Atrasados(string FORNECEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Itens_Compra_Atrasados sc = new Doran_Itens_Compra_Atrasados())
                {
                    sc.dataLimite = DateTime.Today;
                    sc.FORNECEDOR = FORNECEDOR;

                    return sc.Lista_Relatorio(ID_EMPRESA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Doran_Ordem_de_Recebimento(string dataFinal, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime _dataFinal = new DateTime();

                if (!DateTime.TryParse(dataFinal, out _dataFinal))
                    throw new Exception("Digite a data no formato DD/MM/YYYY");


                using (Doran_Ordem_de_Recebimento ordem = new Doran_Ordem_de_Recebimento(ID_EMPRESA, _dataFinal))
                {
                    return ordem.listaRelatorio();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Sugestao_Compra(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Sugestao_Compra su = new Doran_Sugestao_Compra())
                {
                    return su.Calcula_Sugestao_Compra(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public List<Dictionary<string, object>> calcula_Compra_Venda_Mes_a_Mes(List<decimal> IDS_PRODUTO, decimal MESES, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Sugestao_Compra su = new Doran_Sugestao_Compra())
                {
                    return su.calcula_Compra_Venda_Mes_a_Mes(IDS_PRODUTO, MESES);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Clientes_que_compraram(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Sugestao_Compra su = new Doran_Sugestao_Compra())
                {
                    return su.Clientes_que_compraram(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Fornecedores_que_venderam(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Sugestao_Compra su = new Doran_Sugestao_Compra())
                {
                    return su.Fornecedores_que_venderam(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Liquida_Saldo_Recebimento(List<decimal> NUMERO_PEDIDO_COMPRA, List<decimal> NUMERO_ITEM_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var STATUS_ENTREGUE = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                           where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 4
                                           select linha).ToList();

                    if (!STATUS_ENTREGUE.Any())
                        throw new Exception("N&atilde;o h&aacute; status de pedido entregue total cadastrado");

                    for (int i = 0; i < NUMERO_PEDIDO_COMPRA.Count; i++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                     where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                     && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.STATUS_ITEM_COMPRA = STATUS_ENTREGUE.First().CODIGO_STATUS_COMPRA;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                        }
                    }

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    dados.Add("CODIGO_STATUS_COMPRA", STATUS_ENTREGUE.First().CODIGO_STATUS_COMPRA);
                    dados.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", STATUS_ENTREGUE.First().DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                    dados.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", STATUS_ENTREGUE.First().COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                    dados.Add("COR_STATUS_PEDIDO_COMPRA", STATUS_ENTREGUE.First().COR_STATUS_PEDIDO_COMPRA.Trim());
                    dados.Add("STATUS_ESPECIFICO_ITEM_COMPRA", STATUS_ENTREGUE.First().STATUS_ESPECIFICO_ITEM_COMPRA);

                    ctx.SubmitChanges();

                    return dados;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Altera_Status_Item_Pedido(List<decimal> NUMEROS_ITEM, decimal ID_STATUS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    var status = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                  where linha.CODIGO_STATUS_COMPRA == ID_STATUS
                                  select linha).ToList();

                    foreach (var item in status)
                    {
                        dados.Add("CODIGO_STATUS_COMPRA", item.CODIGO_STATUS_COMPRA);
                        dados.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("COR_STATUS_PEDIDO_COMPRA", item.COR_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("STATUS_ESPECIFICO_ITEM_COMPRA", item.STATUS_ESPECIFICO_ITEM_COMPRA);
                    }

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where NUMEROS_ITEM.Contains(linha.NUMERO_ITEM_COMPRA)

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.STATUS_ITEM_COMPRA = ID_STATUS;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    return dados;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, List<decimal>> Retorna_preco_tabela_dos_fornecedores(decimal ID_PRODUTO, List<decimal> IDs_FORNECEDORES, decimal ID_USUARIO)
        {
            try
            {
                return Doran_Compras.Retorna_preco_tabela_dos_fornecedores(ID_PRODUTO, IDs_FORNECEDORES);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }

        }
    }
}