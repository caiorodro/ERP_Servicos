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
    /// Summary description for Auditoria
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Auditoria : System.Web.Services.WebService
    {
        [WebMethod()]
        public string CarregaAuditoria(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal usuario = !decimal.TryParse(dados["Usuario"].ToString(), out usuario) ?
                        usuario = 0 :
                        Convert.ToDecimal(dados["Usuario"]);

                    DateTime datafinal = ApoioXML.ConfiguraDataFinal(Convert.ToDateTime(dados["DataFinal"]));

                    var query = from audit in ctx.TB_RASTROs

                                select new
                                {
                                    audit.ID_RASTRO,
                                    audit.DATA_RASTRO,
                                    audit.TB_USUARIO.LOGIN_USUARIO,
                                    audit.TIPO_RASTRO,
                                    audit.TABELA_RASTRO,
                                    audit.NOTA_SAIDA_RASTRO,
                                    audit.NOTA_ENTRADA_RASTRO,
                                    audit.HISTORICO_RASTRO,
                                    audit.NUMERO_LOTE,
                                    audit.ID_USUARIO
                                };

                    if (dados["NUMERO_LOTE"].ToString().Length > 0){
                        query = query.Where(p => p.NUMERO_LOTE == dados["NUMERO_LOTE"].ToString());
                    }
                    else {

                        query = query.Where(audit => audit.DATA_RASTRO >= Convert.ToDateTime(dados["DataInicial"].ToString()) &&
                                audit.DATA_RASTRO < datafinal &&
                                (audit.ID_USUARIO == usuario || usuario == 0) &&
                                (audit.TABELA_RASTRO == dados["Tabela"].ToString() || dados["Tabela"].ToString().Length == 0) &&
                                (audit.TIPO_RASTRO.Equals(dados["Acao"].ToString()) || dados["Acao"].ToString().Length == 0) &&
                                audit.HISTORICO_RASTRO.Contains(dados["HISTORICO"].ToString()));
                    }

                    if (Convert.ToDecimal(dados["NFSaida"]) > 0)
                        query = query.Where(nf => nf.NOTA_SAIDA_RASTRO == Convert.ToDecimal(dados["NFSaida"]));

                    if (Convert.ToDecimal(dados["NFEntrada"]) > 0)
                        query = query.Where(nf => nf.NOTA_ENTRADA_RASTRO == Convert.ToDecimal(dados["NFEntrada"]));

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

        [WebMethod()]
        public string CarregaAuditoria_Pedido_Venda(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal usuario = !decimal.TryParse(dados["Usuario"].ToString(), out usuario) ?
                        usuario = 0 :
                        Convert.ToDecimal(dados["Usuario"]);

                    var query = from audit in ctx.TB_RASTROs
                                orderby audit.NUMERO_PEDIDO_VENDA
                                where audit.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_PEDIDO"]) &&
                                (audit.ID_USUARIO == usuario || usuario == 0) &&
                                (audit.TABELA_RASTRO == dados["Tabela"].ToString() || dados["Tabela"].ToString().Length == 0) &&
                                (audit.TIPO_RASTRO.Equals(dados["Acao"].ToString()) || dados["Acao"].ToString().Length == 0) &&
                                audit.HISTORICO_RASTRO.Contains(dados["CAMPO"].ToString())

                                select new
                                {
                                    audit.ID_RASTRO,
                                    audit.DATA_RASTRO,
                                    audit.TB_USUARIO.LOGIN_USUARIO,
                                    audit.TIPO_RASTRO,
                                    audit.TABELA_RASTRO,
                                    audit.NOTA_SAIDA_RASTRO,
                                    audit.NOTA_ENTRADA_RASTRO,
                                    audit.HISTORICO_RASTRO,
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
