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
    /// Summary description for TB_PAGTO_PARCIAL
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_PAGTO_PARCIAL : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_PAGTOS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from st in ctx.TB_PAGTO_PARCIALs
                                    where st.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])
                                    select st).Count();

                    var query1 = (from st in ctx.TB_PAGTO_PARCIALs
                                  where st.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])
                                  select st).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"])); ;

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
        public string GravaNovoPAGTO(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_PAGTO_PARCIAL> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PAGTO_PARCIAL>();

                    Doran_Servicos_ORM.TB_PAGTO_PARCIAL novo = new Doran_Servicos_ORM.TB_PAGTO_PARCIAL();

                    DateTime dt = Convert.ToDateTime(dados["DATA_PAGTO"].ToString() + " " + DateTime.Now.Hour.ToString().PadLeft(2, '0') +
                        ":" + DateTime.Now.Minute.ToString().PadLeft(2, '0') + ":" + DateTime.Now.Second.ToString().PadLeft(2, '0'));
                     
                    novo.NUMERO_FINANCEIRO = Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]);
                    novo.DATA_PAGTO = dt;
                    novo.VALOR_PAGTO = Convert.ToDecimal(dados["VALOR_PAGTO"]);

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria.Th2_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();

                    string soma = SomaPagtoParcial(Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])).ToString();

                    return soma;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string AtualizaPAGTO(Dictionary<string, object> dados)
        {
            

            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_PAGTO_PARCIALs
                                 where item.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])
                                 && item.DATA_PAGTO == Convert.ToDateTime(dados["DATA_PAGTO"])
                                 select item).ToList();

                    foreach (var uf in query)
                    {
                        uf.VALOR_PAGTO = Convert.ToDecimal(dados["VALOR_PAGTO"]);

                        Doran_Base.Auditoria.Th2_Auditoria.Audita_Update(ctx, ctx.TB_PAGTO_PARCIALs.GetModifiedMembers(uf),
                            ctx.TB_PAGTO_PARCIALs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.SubmitChanges();
                    }

                    string soma = SomaPagtoParcial(Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])).ToString();

                    return soma;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }


        [WebMethod()]
        public Dictionary<string, object> DeletaPAGTO(decimal NUMERO_FINANCEIRO, string DATA_PAGTO, decimal ID_USUARIO)
        {
            try
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    DateTime _DATA_PAGTO = Convert.ToDateTime(DATA_PAGTO);

                    var query = (from item in ctx.TB_PAGTO_PARCIALs
                                 where item.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO &&
                                 item.DATA_PAGTO == _DATA_PAGTO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_PAGTO_PARCIALs.DeleteOnSubmit(linha);
                        Th2_Auditoria.Audita_Delete(ctx, linha, ctx.TB_PAGTO_PARCIALs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    var query1 = (from linha in ctx.TB_PAGTO_PARCIALs
                                  where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                                  select linha).Count();

                    retorno.Add("PAGTO_PARCIAL", query1 > 0 ? 1 : 0);

                    string soma = SomaPagtoParcial(NUMERO_FINANCEIRO).ToString();

                    retorno.Add("VALOR_PAGO_PARCIAL", soma);

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private decimal SomaPagtoParcial(decimal NUMERO_FINANCEIRO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var soma = (from linha in ctx.TB_PAGTO_PARCIALs
                            where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                            select linha).Sum(s => s.VALOR_PAGTO);

                return soma.HasValue ? Math.Round((decimal)soma, 2) : 0;
            }
        }
    }
}
