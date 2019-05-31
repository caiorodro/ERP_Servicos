using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_COND_PAGTOS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class TB_COND_PAGTOS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_CondPagto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_COND_PAGTOs
                                 where cs.DESCRICAO_CP.Contains(dados["DESCRICAO_CP"].ToString())
                                 select cs;

                    var rowCount = query1.Count();

                    if (dados.ContainsKey("sortField"))
                        query1 = query1.OrderBy(dados["sortField"].ToString() + " " + dados["sortDirection"].ToString());

                    query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

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
        public string Lista_COND_PAGTO(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cp in ctx.TB_COND_PAGTOs
                                orderby cp.DESCRICAO_CP
                                select cp;

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_COND_ATIVAS(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cp in ctx.TB_COND_PAGTOs
                                orderby cp.DESCRICAO_CP
                                where cp.CONDICAO_ATIVA == 1
                                select cp;

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovaCondPagto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<TB_COND_PAGTO> Entidade = ctx.GetTable<TB_COND_PAGTO>();

                    TB_COND_PAGTO novo = new TB_COND_PAGTO();

                    novo.DESCRICAO_CP = dados["DESCRICAO_CP"].ToString();
                    novo.QTDE_PARCELAS_CP = Convert.ToDecimal(dados["QTDE_PARCELAS_CP"]);
                    novo.DIAS_PARCELA1_CP = Convert.ToDecimal(dados["DIAS_PARCELA1_CP"]);
                    novo.DIAS_PARCELA2_CP = Convert.ToDecimal(dados["DIAS_PARCELA2_CP"]);
                    novo.DIAS_PARCELA3_CP = Convert.ToDecimal(dados["DIAS_PARCELA3_CP"]);
                    novo.DIAS_PARCELA4_CP = Convert.ToDecimal(dados["DIAS_PARCELA4_CP"]);
                    novo.DIAS_PARCELA5_CP = Convert.ToDecimal(dados["DIAS_PARCELA5_CP"]);
                    novo.DIAS_PARCELA6_CP = Convert.ToDecimal(dados["DIAS_PARCELA6_CP"]);
                    novo.DIAS_PARCELA7_CP = Convert.ToDecimal(dados["DIAS_PARCELA7_CP"]);
                    novo.DIAS_PARCELA8_CP = Convert.ToDecimal(dados["DIAS_PARCELA8_CP"]);
                    novo.DIAS_PARCELA9_CP = Convert.ToDecimal(dados["DIAS_PARCELA9_CP"]);
                    novo.DIAS_PARCELA10_CP = Convert.ToDecimal(dados["DIAS_PARCELA10_CP"]);
                    novo.CONDICAO_CLIENTE_NOVO = Convert.ToDecimal(dados["CONDICAO_CLIENTE_NOVO"]);
                    novo.CUSTO_FINANCEIRO = Convert.ToDecimal(dados["CUSTO_FINANCEIRO"]);
                    novo.CONDICAO_ATIVA = Convert.ToDecimal(dados["CONDICAO_ATIVA"]);

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaCondPagto(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_COND_PAGTOs
                                 where item.CODIGO_CP == Convert.ToDecimal(dados["CODIGO_CP"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a Cond. de Pagamento com o ID [" + dados["CODIGO_CP"].ToString() + "]");

                    foreach (var cond in query)
                    {
                        cond.DESCRICAO_CP = dados["DESCRICAO_CP"].ToString();
                        cond.QTDE_PARCELAS_CP = Convert.ToDecimal(dados["QTDE_PARCELAS_CP"]);
                        cond.DIAS_PARCELA1_CP = Convert.ToDecimal(dados["DIAS_PARCELA1_CP"]);
                        cond.DIAS_PARCELA2_CP = Convert.ToDecimal(dados["DIAS_PARCELA2_CP"]);
                        cond.DIAS_PARCELA3_CP = Convert.ToDecimal(dados["DIAS_PARCELA3_CP"]);
                        cond.DIAS_PARCELA4_CP = Convert.ToDecimal(dados["DIAS_PARCELA4_CP"]);
                        cond.DIAS_PARCELA5_CP = Convert.ToDecimal(dados["DIAS_PARCELA5_CP"]);
                        cond.DIAS_PARCELA6_CP = Convert.ToDecimal(dados["DIAS_PARCELA6_CP"]);
                        cond.DIAS_PARCELA7_CP = Convert.ToDecimal(dados["DIAS_PARCELA7_CP"]);
                        cond.DIAS_PARCELA8_CP = Convert.ToDecimal(dados["DIAS_PARCELA8_CP"]);
                        cond.DIAS_PARCELA9_CP = Convert.ToDecimal(dados["DIAS_PARCELA9_CP"]);
                        cond.DIAS_PARCELA10_CP = Convert.ToDecimal(dados["DIAS_PARCELA10_CP"]);
                        cond.CONDICAO_CLIENTE_NOVO = Convert.ToDecimal(dados["CONDICAO_CLIENTE_NOVO"]);
                        cond.CUSTO_FINANCEIRO = Convert.ToDecimal(dados["CUSTO_FINANCEIRO"]);
                        cond.CONDICAO_ATIVA = Convert.ToDecimal(dados["CONDICAO_ATIVA"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_COND_PAGTOs.GetModifiedMembers(cond),
                            ctx.TB_COND_PAGTOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.SubmitChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaCondPagto(decimal CODIGO_CP, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_COND_PAGTOs
                                 where item.CODIGO_CP == CODIGO_CP
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_COND_PAGTOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_COND_PAGTOs.ToString(), ID_USUARIO);
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