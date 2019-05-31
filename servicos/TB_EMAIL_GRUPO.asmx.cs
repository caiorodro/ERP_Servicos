using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_EMAIL_GRUPO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_EMAIL_GRUPO : System.Web.Services.WebService
    {
        [WebMethod()]
        public void Grava_Novo_Grupo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Grupo c = new Doran_ERP_Servicos_Email.Th2_Email_Grupo(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    c.Grava_Novo_Grupo_Email(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Atualiza_Grupo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Grupo c = new Doran_ERP_Servicos_Email.Th2_Email_Grupo(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    c.Atualiza_Grupo_Email(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_Grupo(decimal ID_GRUPO_EMAIL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Grupo c = new Doran_ERP_Servicos_Email.Th2_Email_Grupo(ID_USUARIO))
                {
                    c.Deleta_Grupo_Email(ID_GRUPO_EMAIL);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Grupo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Grupo c = new Doran_ERP_Servicos_Email.Th2_Email_Grupo(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return c.Carrega_Grupo_Email(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }
    }
}
