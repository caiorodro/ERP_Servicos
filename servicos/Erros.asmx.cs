using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;
using Doran_Base;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for Erros
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Erros : System.Web.Services.WebService
    {
        [WebMethod()]
        public string CarregaErros(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal usuario = !decimal.TryParse(dados["Usuario"].ToString(), out usuario) ?
                        usuario = 0 :
                        Convert.ToDecimal(dados["Usuario"]);

                    DateTime datafinal = ApoioXML.ConfiguraDataFinal(Convert.ToDateTime(dados["DataFinal"]));

                    var query = from erros in ctx.TB_ERROs
                                where erros.DATA_ERRO >= Convert.ToDateTime(dados["DataInicial"].ToString()) &&
                                erros.DATA_ERRO < datafinal &&
                                (erros.ID_USUARIO == usuario || usuario == 0)

                                orderby erros.DATA_ERRO descending

                                select new
                                {
                                    erros.ID_ERRO,
                                    erros.DATA_ERRO,
                                    erros.TB_USUARIO.LOGIN_USUARIO,
                                    erros.DESCRICAO_ERRO,
                                    erros.TRACE
                                };

                    int rowCount = query.Count();

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
    }
}
