using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for PROGRAMACAO_EMAIL
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class PROGRAMACAO_EMAIL : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_Programacao(Dictionary<string, object> dados)
        {
            try
            {
                DateTime dt1 = new DateTime();

                if (!DateTime.TryParse(dados["DATA_REF"].ToString(), out dt1))
                    throw new Exception("Digite a data no formato DD/MM/AAAA");

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_EMAIL_PROGRAMACAOs
                                orderby linha.ID_USUARIO, linha.ENVIO_PENDENTE, linha.DATA_ENVIO

                                where (linha.ID_USUARIO == Convert.ToDecimal(dados["ID_USUARIO"])
                                && linha.ENVIO_PENDENTE == Convert.ToDecimal(dados["PENDENTE"])
                                && linha.DATA_PROGRAMACAO_ENVIO >= dt1)

                                select new
                                {
                                    linha.ID_PROGRAMACAO_EMAIL,
                                    linha.ID_MESSAGE,
                                    linha.TB_EMAIL.SUBJECT,
                                    linha.DATA_PROGRAMACAO_ENVIO,
                                    linha.DATA_ENVIO,
                                    linha.TB_USUARIO.LOGIN_USUARIO,
                                    linha.TB_USUARIO.NOME_USUARIO
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_RESPONSAVEL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Periodo_Programacao(string DATA_INICIAL, string DATA_FINAL, decimal PERIODO, decimal ID_MESSAGE,
            decimal ID_USUARIO, decimal ID_CONTA_EMAIL)
        {
            try
            {
                List<string> DATAS = new List<string>();

                DateTime dt1 = Convert.ToDateTime(DATA_INICIAL);
                DateTime dt2 = Convert.ToDateTime(DATA_FINAL);

                while (dt1 <= dt2)
                {
                    DATAS.Add(dt1.ToShortDateString());

                    if (PERIODO == 1)
                    {
                        dt1 = dt1.AddDays(1);
                    }
                    else if (PERIODO == 2)
                    {
                        dt1 = dt1.AddDays(7);
                    }
                    else if (PERIODO == 3)
                    {
                        dt1 = dt1.AddDays(15);
                    }
                    else if (PERIODO == 4)
                    {
                        dt1 = dt1.AddMonths(1);
                    }
                }

                using (Doran_ERP_Servicos_Email.Doran_Email_Programa_Email mail = new Doran_ERP_Servicos_Email.Doran_Email_Programa_Email(ID_MESSAGE, DATAS, ID_USUARIO, ID_CONTA_EMAIL))
                {
                    mail.Grava_Emails_Programacao();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Programacao_da_Mensagem(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_EMAIL_PROGRAMACAOs
                                where linha.ID_MESSAGE == Convert.ToDecimal(dados["ID_MESSAGE"])
                                select new
                                {
                                    linha.ID_PROGRAMACAO_EMAIL,
                                    linha.DATA_PROGRAMACAO_ENVIO,
                                    linha.ENVIO_PENDENTE,
                                    linha.DATA_ENVIO
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
        public void Grava_Programacao_Unica_Data(string DATA_UNICA, decimal ID_MESSAGE, decimal ID_USUARIO, decimal ID_CONTA_EMAIL)
        {
            try
            {
                List<string> DATAS = new List<string>();

                DateTime dt1 = Convert.ToDateTime(DATA_UNICA);

                DATAS.Add(dt1.ToShortDateString());

                using (Doran_ERP_Servicos_Email.Doran_Email_Programa_Email mail = new Doran_ERP_Servicos_Email.Doran_Email_Programa_Email(ID_MESSAGE, DATAS, ID_USUARIO, ID_CONTA_EMAIL))
                {
                    mail.Grava_Emails_Programacao();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Deletar_Programacao(decimal ID_PROGRAMACAO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_EMAIL_PROGRAMACAOs
                                 where linha.ID_PROGRAMACAO_EMAIL == ID_PROGRAMACAO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        ctx.TB_EMAIL_PROGRAMACAOs.DeleteOnSubmit(item);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_EMAIL_PROGRAMACAOs.ToString(),
                            ID_USUARIO);
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
