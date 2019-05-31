using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_MUNICIPIOS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_MUNICIPIOS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Municipios(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from mun in ctx.TB_MUNICIPIOs
                                    orderby mun.ID_UF, mun.NOME_MUNICIPIO
                                    where mun.ID_UF == Convert.ToDecimal(dados["ID_UF"]) && mun.NOME_MUNICIPIO.Contains(dados["NOME_MUNICIPIO"].ToString())
                                    select mun).Count();

                    var query1 = (from mun in ctx.TB_MUNICIPIOs
                                orderby mun.ID_UF, mun.NOME_MUNICIPIO
                                  where mun.ID_UF == Convert.ToDecimal(dados["ID_UF"]) && mun.NOME_MUNICIPIO.Contains(dados["NOME_MUNICIPIO"].ToString())
                                select mun).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorID(decimal ID_UF, decimal ID_MUNICIPIO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal _mun = decimal.TryParse(ID_MUNICIPIO.ToString(), out _mun) ?
                    ID_MUNICIPIO : 0;

                    var query1 = (from mun in ctx.TB_MUNICIPIOs
                                  orderby mun.ID_UF, mun.ID_MUNICIPIO
                                  where mun.ID_UF == ID_UF && mun.ID_MUNICIPIO == _mun
                                  select mun).ToList();

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query1)
                    {
                        dados.Add("NOME_MUNICIPIO", item.NOME_MUNICIPIO.Trim());
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
    }
}
