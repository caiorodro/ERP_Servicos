using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Data;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CUSTO_VENDA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CUSTO_VENDA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Custo_Venda(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from st in ctx.TB_CUSTO_VENDAs
                                    select st).Count();

                    var query1 = (from st in ctx.TB_CUSTO_VENDAs
                                  orderby st.DESCRICAO_CUSTO_VENDA
                                  select st).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

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
        public string Lista_Custo_Venda(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from st in ctx.TB_CUSTO_VENDAs
                                 orderby st.DESCRICAO_CUSTO_VENDA
                                 select st;

                    DataTable dt = ApoioXML.ToDataTable(ctx, query1);

                    foreach (DataRow dr in dt.Rows)
                    {
                        dr["DESCRICAO_CUSTO_VENDA"] = string.Concat(dr[1].ToString().Trim(), " -  ", dr[0].ToString());
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    dt.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoCusto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_CUSTO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CUSTO_VENDA>();

                    Doran_Servicos_ORM.TB_CUSTO_VENDA novo = new Doran_Servicos_ORM.TB_CUSTO_VENDA();

                    novo.DESCRICAO_CUSTO_VENDA = dados["DESCRICAO_CUSTO_VENDA"].ToString();
                    novo.CUSTO_PERMANENTE = Convert.ToDecimal(dados["CUSTO_PERMANENTE"]);
                    novo.PERCENTUAL_CUSTO_PERMANENTE = Convert.ToDecimal(dados["PERCENTUAL_CUSTO_PERMANENTE"]);

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
        public void AtualizaCusto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CUSTO_VENDAs
                                 where item.ID_CUSTO_VENDA == Convert.ToDecimal(dados["ID_CUSTO_VENDA"])
                                 select item).ToList();

                    foreach (var uf in query)
                    {
                        uf.DESCRICAO_CUSTO_VENDA = dados["DESCRICAO_CUSTO_VENDA"].ToString();
                        uf.CUSTO_PERMANENTE = Convert.ToDecimal(dados["CUSTO_PERMANENTE"]);
                        uf.PERCENTUAL_CUSTO_PERMANENTE = Convert.ToDecimal(dados["PERCENTUAL_CUSTO_PERMANENTE"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CUSTO_VENDAs.GetModifiedMembers(uf),
                            ctx.TB_CUSTO_VENDAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaCusto(decimal ID_CUSTO_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CUSTO_VENDAs
                                 where item.ID_CUSTO_VENDA == ID_CUSTO_VENDA
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_CUSTO_VENDAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CUSTO_VENDAs.ToString(), ID_USUARIO);
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
        public string Lista_Fornecedores(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_FORNECEDORs
                                where item.NOME_FANTASIA_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString())
                                || item.NOME_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString())
                                select new
                                {
                                    item.CODIGO_FORNECEDOR,
                                    item.NOME_FORNECEDOR,
                                    item.NOME_FANTASIA_FORNECEDOR,
                                    MUNICIPIO = item.TB_MUNICIPIO.NOME_MUNICIPIO,
                                    UF = item.TB_MUNICIPIO.TB_UF.SIGLA_UF,
                                    item.TELEFONE1_FORNECEDOR
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
        public string Lista_COMBO_Fornecedores(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FORNECEDORs
                                orderby linha.NOME_FANTASIA_FORNECEDOR

                                select new
                                {
                                    linha.CODIGO_FORNECEDOR,
                                    linha.NOME_FANTASIA_FORNECEDOR
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
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