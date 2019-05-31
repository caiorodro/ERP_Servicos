using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_LIMITE
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_LIMITE : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Limite(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from st in ctx.TB_LIMITEs
                                    select st).Count();

                    var query1 = (from st in ctx.TB_LIMITEs
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
        public string Lista_Limite(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from st in ctx.TB_LIMITEs
                                 orderby st.VALOR_LIMITE
                                 select st;

                    return ApoioXML.objQueryToXML(ctx, query1);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoLimite(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_LIMITE> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_LIMITE>();

                    Doran_Servicos_ORM.TB_LIMITE novo = new Doran_Servicos_ORM.TB_LIMITE();

                    novo.VALOR_LIMITE = Convert.ToDecimal(dados["VALOR_LIMITE"]);

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
        public void AtualizaLimite(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_LIMITEs
                                 where item.ID_LIMITE == Convert.ToDecimal(dados["ID_LIMITE"])
                                 select item).ToList();

                    foreach (var uf in query)
                    {
                        uf.VALOR_LIMITE = Convert.ToDecimal(dados["VALOR_LIMITE"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_LIMITEs.GetModifiedMembers(uf),
                            ctx.TB_LIMITEs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaLimite(decimal ID_LIMITE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_LIMITEs
                                 where item.ID_LIMITE == ID_LIMITE
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_LIMITEs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_LIMITEs.ToString(), ID_USUARIO);
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
