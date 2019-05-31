using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_ERP_Servicos.classes;
using System.Data;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_ITEM_NOTA_SAIDA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_ITEM_NOTA_SAIDA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_ItensNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from nota in ctx.TB_ITEM_NOTA_SAIDAs
                                 orderby nota.NUMERO_ITEM_NF, nota.SEQUENCIA_ITEM_NF
                                 where nota.NUMERO_ITEM_NF == Convert.ToDecimal(dados["NUMERO_ITEM_NF"])
                                 select new
                                 {
                                     nota.NUMERO_ITEM_NF,
                                     nota.ID_PRODUTO_ITEM_NF,
                                     nota.ALIQ_ISS_ITEM_NF,
                                     nota.BASE_ISS_ITEM_NF,
                                     VALOR_ISS_ITEM_NF = Math.Round(nota.VALOR_TOTAL_ITEM_NF.Value * (nota.ALIQ_ISS_ITEM_NF.Value / 100), 2, MidpointRounding.ToEven),
                                     nota.CODIGO_PRODUTO_ITEM_NF,
                                     nota.DESCRICAO_PRODUTO_ITEM_NF,
                                     nota.NUMERO_ITEM_PEDIDO_VENDA,
                                     nota.NUMERO_PEDIDO_VENDA,
                                     nota.QTDE_ITEM_NF,
                                     nota.SEQUENCIA_ITEM_NF,
                                     nota.UNIDADE_MEDIDA_ITEM_NF,
                                     nota.VALOR_DESCONTO_ITEM_NF,
                                     nota.VALOR_TOTAL_ITEM_NF,
                                     nota.VALOR_UNITARIO_ITEM_NF
                                 };

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
        public Dictionary<string, object> GravaItemNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                decimal NUMERO_SEQ = Convert.ToDecimal(dados["NUMERO_ITEM_NF"]);

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_Calculo_Nota_Saida item = new Doran_Calculo_Nota_Saida(NUMERO_SEQ, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    retorno = item.Calcula_e_Grava_Item_Nota_Saida(dados);
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
        public Dictionary<string, object> AtualizaItemNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                decimal NUMERO_SEQ = Convert.ToDecimal(dados["NUMERO_ITEM_NF"]);

                using (Doran_Calculo_Nota_Saida calc = new Doran_Calculo_Nota_Saida(NUMERO_SEQ, Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    retorno = calc.Calcula_e_Atualiza_Item_Nota_Saida(dados);
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
        public Dictionary<string, object> DeletaItemNotaSaida(decimal NUMERO_ITEM_NF, decimal SEQUENCIA_ITEM_NF, bool Moeda, decimal ID_USUARIO)
        {
            try
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_Calculo_Nota_Saida calc = new Doran_Calculo_Nota_Saida(NUMERO_ITEM_NF, ID_USUARIO))
                {
                    retorno = calc.Deleta_Item_NF_e_Calcula_Totais(NUMERO_ITEM_NF, SEQUENCIA_ITEM_NF, Moeda);
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
        public string ListaProdutos_GridPesquisa(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from produto in ctx.TB_PRODUTOs
                                 orderby produto.CODIGO_PRODUTO
                                 where produto.CODIGO_PRODUTO.Contains(dados["pesquisa"].ToString()) ||
                                 produto.DESCRICAO_PRODUTO.Contains(dados["pesquisa"].ToString())

                                 select new
                                 {
                                     produto.ID_PRODUTO,
                                     produto.CODIGO_PRODUTO,
                                     produto.DESCRICAO_PRODUTO,
                                     produto.UNIDADE_MEDIDA_VENDA,
                                     produto.PRECO_PRODUTO,
                                     produto.ALIQ_ISS
                                 };

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
        public Dictionary<string, object> Busca_Dados_Produto(string CODIGO_PRODUTO, decimal ID_CLIENTE, decimal ID_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                decimal ID_PRODUTO = 0;

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                retorno.Add("ID_PRODUTO", "");
                retorno.Add("CODIGO_PRODUTO", "");
                retorno.Add("DESCRICAO_PRODUTO", "");
                retorno.Add("DESCRICAO_PRODUTO_NF", "");
                retorno.Add("UNIDADE_MEDIDA_VENDA", "");
                retorno.Add("PRECO_PRODUTO", 0);
                retorno.Add("ALIQ_ISS", 0);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from produto in ctx.TB_PRODUTOs
                                 where produto.CODIGO_PRODUTO == CODIGO_PRODUTO

                                 select new
                                 {
                                     produto.ID_PRODUTO,
                                     produto.CODIGO_PRODUTO,
                                     produto.DESCRICAO_PRODUTO,
                                     produto.UNIDADE_MEDIDA_VENDA,
                                     produto.PRECO_PRODUTO,
                                     produto.ALIQ_ISS
                                 }).ToList();

                    foreach (var item in query)
                    {
                        ID_PRODUTO = item.ID_PRODUTO;

                        retorno["ID_PRODUTO"] = item.ID_PRODUTO;
                        retorno["CODIGO_PRODUTO"] = item.CODIGO_PRODUTO.Trim();
                        retorno["DESCRICAO_PRODUTO"] = item.DESCRICAO_PRODUTO.Trim();
                        retorno["UNIDADE_MEDIDA_VENDA"] = item.UNIDADE_MEDIDA_VENDA.Trim();
                        retorno["PRECO_PRODUTO"] = item.PRECO_PRODUTO;
                        retorno["ALIQ_ISS"] = item.ALIQ_ISS;
                    }
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
        public Dictionary<string, object> Busca_Dados_Produto_Estoque(string CODIGO_PRODUTO, decimal ID_USUARIO)
        {


            try
            {
                decimal ID_PRODUTO = 0;

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                retorno.Add("ID_PRODUTO", "");
                retorno.Add("CODIGO_PRODUTO", "");
                retorno.Add("DESCRICAO_PRODUTO", "");
                retorno.Add("UNIDADE_MEDIDA_VENDA", "");
                retorno.Add("PRECO_PRODUTO", 0);
                retorno.Add("ALIQ_ISS", 0);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from produto in ctx.TB_PRODUTOs
                                where produto.CODIGO_PRODUTO == CODIGO_PRODUTO

                                select new
                                {
                                    produto.ID_PRODUTO,
                                    produto.CODIGO_PRODUTO,
                                    produto.DESCRICAO_PRODUTO,
                                    produto.UNIDADE_MEDIDA_VENDA,
                                    produto.PRECO_PRODUTO,
                                    produto.ALIQ_ISS
                                };

                    foreach (var item in query)
                    {
                        ID_PRODUTO = item.ID_PRODUTO;

                        retorno["ID_PRODUTO"] = item.ID_PRODUTO;
                        retorno["CODIGO_PRODUTO"] = item.CODIGO_PRODUTO.Trim();
                        retorno["DESCRICAO_PRODUTO"] = item.DESCRICAO_PRODUTO.Trim();
                        retorno["UNIDADE_MEDIDA_VENDA"] = item.UNIDADE_MEDIDA_VENDA.Trim();
                        retorno["PRECO_PRODUTO"] = item.PRECO_PRODUTO;

                        retorno["ALIQ_ISS"] = item.ALIQ_ISS;
                    }
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod(EnableSession = true)]
        public string BuscaUltimoPreco(Dictionary<string, object> dados)
        {
            try
            {
                string retorno = "";

                if (dados["CLIENTE_FORNECEDOR"].ToString() == "C")
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query = from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                    where linha.CODIGO_PRODUTO_ITEM_NF == dados["CODIGO_PRODUTO"].ToString()
                                    && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= Convert.ToDateTime(dados["DATA_EMISSAO"])
                                    && linha.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF.Contains(dados["NOME_CLIENTE"].ToString())
                                    orderby linha.CODIGO_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending
                                    select new
                                    {
                                        linha.NUMERO_ITEM_NF,
                                        linha.CODIGO_PRODUTO_ITEM_NF,
                                        linha.DESCRICAO_PRODUTO_ITEM_NF,
                                        linha.UNIDADE_MEDIDA_ITEM_NF,
                                        linha.QTDE_ITEM_NF,
                                        linha.VALOR_UNITARIO_ITEM_NF,
                                        linha.VALOR_TOTAL_ITEM_NF,
                                        DATA_EMISSAO = linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF,
                                        NOME_CLIENTE = linha.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF
                                    };

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                }
                else
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query = from linha in ctx.TB_ITEM_NOTA_ENTRADAs
                                    where linha.CODIGO_PRODUTO_ITEM_NFE == dados["CODIGO_PRODUTO"].ToString()
                                    && linha.TB_NOTA_ENTRADA.DATA_EMISSAO_NFE >= Convert.ToDateTime(dados["DATA_EMISSAO"])
                                    && linha.TB_NOTA_ENTRADA.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Contains(dados["NOME_CLIENTE"].ToString())
                                    orderby linha.CODIGO_PRODUTO_ITEM_NFE, linha.TB_NOTA_ENTRADA.DATA_EMISSAO_NFE descending
                                    select new
                                    {
                                        NUMERO_ITEM_NF = linha.NUMERO_SEQ_ITEM_NFE,
                                        CODIGO_PRODUTO_ITEM_NF = linha.CODIGO_PRODUTO_ITEM_NFE,
                                        DESCRICAO_PRODUTO_ITEM_NF = linha.DESCRICAO_PRODUTO_ITEM_NFE,
                                        CODIGO_CFOP_ITEM_NF = linha.CODIGO_CFOP_ITEM_NFE,
                                        QTDE_ITEM_NF = linha.QTDE_ITEM_NFE,
                                        VALOR_UNITARIO_ITEM_NF = linha.VALOR_UNITARIO_ITEM_NFE,
                                        VALOR_TOTAL_ITEM_NF = linha.VALOR_TOTAL_ITEM_NFE,
                                        CODIGO_ITEM_CLIENTE = "",
                                        DATA_EMISSAO = linha.TB_NOTA_ENTRADA.DATA_EMISSAO_NFE,
                                        NOME_CLIENTE = linha.TB_NOTA_ENTRADA.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                        NUMERO_LOTE_ITEM_NF = linha.NUMERO_LOTE_ITEM_NFE
                                    };

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }
    }
}
