using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Data;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_PRODUTOS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class TB_PRODUTO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_PRODUTO(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from produto in ctx.TB_PRODUTOs
                                 orderby produto.CODIGO_PRODUTO

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

                    var query = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

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
        public Dictionary<string, object> BuscaPorID(decimal ID_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from produto in ctx.TB_PRODUTOs
                                 where produto.ID_PRODUTO == ID_PRODUTO
                                 select produto).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Produto n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_PRODUTO", item.ID_PRODUTO);
                        dados.Add("CODIGO_PRODUTO", item.CODIGO_PRODUTO.Trim());
                        dados.Add("DESCRICAO_PRODUTO", item.DESCRICAO_PRODUTO.Trim());
                        dados.Add("UNIDADE_MEDIDA_VENDA", item.UNIDADE_MEDIDA_VENDA.ToString().Trim());
                        dados.Add("PRECO_PRODUTO", item.PRECO_PRODUTO);
                        dados.Add("ALIQ_ISS", item.ALIQ_ISS);
                    }

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
        public Dictionary<string, object> BuscaPorCodigo(string CODIGO_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from produto in ctx.TB_PRODUTOs
                                 where produto.CODIGO_PRODUTO == CODIGO_PRODUTO
                                 orderby produto.CODIGO_PRODUTO
                                 select produto).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Produto n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_PRODUTO", item.ID_PRODUTO);
                        dados.Add("CODIGO_PRODUTO", item.CODIGO_PRODUTO.Trim());
                        dados.Add("DESCRICAO_PRODUTO", item.DESCRICAO_PRODUTO.Trim());
                        dados.Add("UNIDADE_MEDIDA_VENDA", item.UNIDADE_MEDIDA_VENDA.ToString().Trim());
                        dados.Add("PRECO_PRODUTO", item.PRECO_PRODUTO);
                        dados.Add("ALIQ_ISS", item.ALIQ_ISS);
                    }

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
        public void GravaNovoProduto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_PRODUTO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PRODUTO>();

                    Doran_Servicos_ORM.TB_PRODUTO novo = new Doran_Servicos_ORM.TB_PRODUTO();

                    novo.CODIGO_PRODUTO = dados["CODIGO_PRODUTO"].ToString();
                    novo.DESCRICAO_PRODUTO = dados["DESCRICAO_PRODUTO"].ToString();
                    novo.UNIDADE_MEDIDA_VENDA = dados["UNIDADE_MEDIDA_VENDA"].ToString();
                    novo.PRECO_PRODUTO = Convert.ToDecimal(dados["PRECO_PRODUTO"]);
                    novo.ALIQ_ISS = Convert.ToDecimal(dados["ALIQ_ISS_SERVICO"]);

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaProduto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_PRODUTOs
                                 where item.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o produto com o ID [" + dados["ID_PRODUTO"].ToString() + "]");

                    foreach (var produto in query)
                    {
                        produto.CODIGO_PRODUTO = dados["CODIGO_PRODUTO"].ToString();
                        produto.DESCRICAO_PRODUTO = dados["DESCRICAO_PRODUTO"].ToString();
                        produto.UNIDADE_MEDIDA_VENDA = dados["UNIDADE_MEDIDA_VENDA"].ToString();
                        produto.PRECO_PRODUTO = Convert.ToDecimal(dados["PRECO_PRODUTO"]);
                        produto.ALIQ_ISS = Convert.ToDecimal(dados["ALIQ_ISS_SERVICO"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PRODUTOs.GetModifiedMembers(produto),
                            ctx.TB_PRODUTOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.SubmitChanges();
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
        public void DeletaProduto(decimal ID_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_PRODUTOs
                                 where item.ID_PRODUTO == ID_PRODUTO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_PRODUTOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_PRODUTOs.ToString(), ID_USUARIO);
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
    }
}
