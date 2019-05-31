using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for RELATORIOS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class RELATORIOS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Titulos_Receber_Vencidos(string CLIENTE, decimal VENDEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_TitulosVencidos ve = new Doran_TitulosVencidos(CLIENTE, ID_EMPRESA))
                {
                    ve.VENDEDOR = VENDEDOR;
                    return ve.MontaRelatorioAReceber();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Titulos_Pagar_Vencidos(string FORNECEDOR, decimal VENDEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_TitulosVencidos ve = new Doran_TitulosVencidos(FORNECEDOR, ID_EMPRESA))
                {
                    ve.VENDEDOR = VENDEDOR;
                    return ve.MontaRelatorioAPagar();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string FluxoRealizado(string dt1, string dt2, string ResumidoDetalhado, decimal Banco, decimal ID_EMPRESA, decimal ID_USUARIO)
        {


            try
            {
                DateTime _dt1 = Convert.ToDateTime(dt1);
                DateTime _dt2 = Convert.ToDateTime(dt2);

                using (Doran_FinanceiroRealizado rz = new Doran_FinanceiroRealizado(_dt1, _dt2, ResumidoDetalhado, ID_EMPRESA))
                {
                    rz.Banco = Banco;
                    return rz.MontaRelatorioRealizado();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string FluxoPrevisao(string dt1, string dt2, string CLIENTE, string ResumidoDetalhado, decimal Banco, string RECEBER_PAGAR,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime _dt1 = Convert.ToDateTime(dt1);
                DateTime _dt2 = Convert.ToDateTime(dt2);

                using (Doran_FinanceiroPrevisao rz = new Doran_FinanceiroPrevisao(_dt1, _dt2, ResumidoDetalhado, ID_EMPRESA))
                {
                    rz.CLIENTE = CLIENTE;
                    rz.Banco = Banco;
                    return rz.MontaRelatorioPrevisao(RECEBER_PAGAR);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }


        [WebMethod()]
        public string FaturamentoDiario(string dt1, string dt2, string Cliente, string CODIGO_CFOP, decimal Filial,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {


            try
            {
                DateTime _dt1 = Convert.ToDateTime(dt1);
                DateTime _dt2 = Convert.ToDateTime(dt2);

                using (Doran_FaturamentoDiario rz = new Doran_FaturamentoDiario(Cliente, _dt1, _dt2, CODIGO_CFOP, Filial, ID_EMPRESA))
                {
                    return rz.MontaRelatorioFaturamentoDiario();
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
