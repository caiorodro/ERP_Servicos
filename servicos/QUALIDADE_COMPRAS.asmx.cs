using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for QUALIDADE_COMPRAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class QUALIDADE_COMPRAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public List<string> Carrega_Estatisticas_Qualidade(string DATA_INICIAL, string DATA_FINAL, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(DATA_INICIAL);
                DateTime dt2 = Convert.ToDateTime(DATA_FINAL);

                dt2 = dt2.AddDays(1);

                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Total_Compras_Qualidade(dt1, dt2);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Calcula_Curva_ABC_Fornecedores(Dictionary<string, object> dados)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Calcula_Curva_ABC_Fornecedores(dt1, dt2,
                        Convert.ToInt32(dados["start"]), Convert.ToInt32(dados["limit"]));
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Entregas_Atrasadas_Compras(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Entregas_Atrasadas_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Quantidades_Menores_Compras(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Quantidades_Menores_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Notas_Devolucao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Notas_Devolucao(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Premiacao_Compras(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Premiacao_Compras(dados);
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
