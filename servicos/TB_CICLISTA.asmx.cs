using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CICLISTA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CICLISTA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Ciclistas(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_CICLISTAs
                                 orderby cs.NOME_CICLISTA
                                 where cs.NOME_CICLISTA.Contains(dados["NOME_CICLISTA"].ToString())
                                 select new
                                 {
                                     cs.ID_CICLISTA,
                                     cs.NOME_CICLISTA,
                                     cs.CICLISTA_ATIVO
                                 };

                    var rowCount = query1.Count();

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
        public string Lista_Ciclistas(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_CICLISTAs
                                 orderby cs.NOME_CICLISTA
                                 where cs.CICLISTA_ATIVO == 1
                                 select new
                                 {
                                     cs.ID_CICLISTA,
                                     cs.NOME_CICLISTA,
                                     cs.CICLISTA_ATIVO
                                 };

                    return ApoioXML.objQueryToXML(ctx, query1);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoCiclista(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_CICLISTA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CICLISTA>();

                    Doran_Servicos_ORM.TB_CICLISTA novo = new Doran_Servicos_ORM.TB_CICLISTA();

                    novo.NOME_CICLISTA = dados["NOME_CICLISTA"].ToString();
                    novo.CICLISTA_ATIVO = Convert.ToDecimal(dados["CICLISTA_ATIVO"]);

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, "TB_CICLISTA", Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaCiclista(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CICLISTAs
                                 where item.ID_CICLISTA == Convert.ToDecimal(dados["ID_CICLISTA"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o ciclista com o ID [" + dados["ID_CICLISTA"].ToString() + "]");

                    foreach (var cond in query)
                    {
                        cond.NOME_CICLISTA = dados["NOME_CICLISTA"].ToString();
                        cond.CICLISTA_ATIVO = Convert.ToDecimal(dados["CICLISTA_ATIVO"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CICLISTAs.GetModifiedMembers(cond),
                            ctx.TB_CICLISTAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaCiclista(decimal ID_CICLISTA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CICLISTAs
                                 where item.ID_CICLISTA == ID_CICLISTA
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o ciclista com o ID [" + ID_CICLISTA.ToString() + "]");

                    foreach (var linha in query)
                    {
                        ctx.TB_CICLISTAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CICLISTAs.ToString(), ID_USUARIO);
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

        [WebMethod()]
        public string Doran_Relatorio_desempenho_ciclista(string data1, string data2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(data1);
                DateTime dt2 = Convert.ToDateTime(data2);

                using (Doran_ERP_Servicos.classes.Doran_Relatorio_desempenho_ciclista r = new classes.Doran_Relatorio_desempenho_ciclista(dt1, dt2, ID_EMPRESA))
                {
                    return r.MontaRelatorio();
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
