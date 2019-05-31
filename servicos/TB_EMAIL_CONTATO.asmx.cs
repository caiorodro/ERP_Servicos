using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_EMAIL_CONTATO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_EMAIL_CONTATO : System.Web.Services.WebService
    {
        [WebMethod()]
        public void Grava_Novo_Contato(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato c = new Doran_ERP_Servicos_Email.Th2_Email_Contato(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    c.Grava_Novo_Contato(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Atualiza_Contato(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato c = new Doran_ERP_Servicos_Email.Th2_Email_Contato(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    c.Atualiza_Contato(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_Contato(string EMAIL_CONTATO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato c = new Doran_ERP_Servicos_Email.Th2_Email_Contato(ID_USUARIO))
                {
                    c.Deleta_Contato(EMAIL_CONTATO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Contato(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato c = new Doran_ERP_Servicos_Email.Th2_Email_Contato(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return c.Carrega_Contato(dados);
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