using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_REGIAO_VENDAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_REGIAO_VENDAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Regiao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_REGIAO_VENDAs
                                 orderby cs.NOME_REGIAO
                                 select cs;

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
        public string Lista_REGIAO(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cp in ctx.TB_REGIAO_VENDAs
                                orderby cp.NOME_REGIAO
                                select cp;

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovaRegiao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_REGIAO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_REGIAO_VENDA>();

                    Doran_Servicos_ORM.TB_REGIAO_VENDA novo = new Doran_Servicos_ORM.TB_REGIAO_VENDA();

                    novo.CODIGO_REGIAO = dados["CODIGO_REGIAO"].ToString();
                    novo.NOME_REGIAO = dados["NOME_REGIAO"].ToString();

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
        public void AtualizaRegiao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_REGIAO_VENDAs
                                 where item.CODIGO_REGIAO == dados["CODIGO_REGIAO"].ToString()
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a regi&aatilde;o de vendas com o ID [" + dados["CODIGO_REGIAO"].ToString() + "]");

                    foreach (var cond in query)
                    {
                        cond.NOME_REGIAO = dados["NOME_REGIAO"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_REGIAO_VENDAs.GetModifiedMembers(cond),
                            ctx.TB_REGIAO_VENDAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaRegiao(string CODIGO_REGIAO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_REGIAO_VENDAs
                                 where item.CODIGO_REGIAO == CODIGO_REGIAO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_REGIAO_VENDAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_REGIAO_VENDAs.ToString(), ID_USUARIO);
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