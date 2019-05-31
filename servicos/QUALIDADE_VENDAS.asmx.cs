using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for QUALIDADE_VENDAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class QUALIDADE_VENDAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public List<string> Carrega_Estatisticas_Qualidade(string DATA_INICIAL, string DATA_FINAL, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(DATA_INICIAL);
                DateTime dt2 = Convert.ToDateTime(DATA_FINAL);

                dt2 = dt2.AddDays(1);

                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Total_Vendas_Qualidade(dt1, dt2, ID_EMPRESA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Calcula_Curva_ABC_Clientes(Dictionary<string, object> dados)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Calcula_Curva_ABC_Clientes(dt1, dt2,
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
        public string Entregas_Atrasadas(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Entregas_Atrasadas(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Quantidades_Menores(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.Quantidades_Menores(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string MargemAbaixo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Estatisticas_Qualidade qualidade = new Doran_Estatisticas_Qualidade())
                {
                    return qualidade.MargemAbaixo(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Inadimplencia(Dictionary<string, object> dados)
        {
            try
            {
                dados.Add("pesquisa", "");

                using (Doran_Limite_Credito_Cliente limite = new Doran_Limite_Credito_Cliente(Convert.ToDecimal(dados["ID_EMPRESA"])))
                {
                    return limite.ListaClientesComLimiteExcedido(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }            
        }

        [WebMethod()]
        public string Relatorio_Faturamento_Atrasado(decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Faturamento_Atrasado a = new Doran_Faturamento_Atrasado())
                {
                    return a.Lista_Relatorio(ID_EMPRESA);
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