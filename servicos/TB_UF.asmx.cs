using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_UF
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_UF : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_UF(string Pesquisa, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_UFs
                                orderby uf.DESCRICAO_UF
                                where uf.DESCRICAO_UF.Contains(Pesquisa) && uf.ID_UF > 0
                                select uf;

                    string retorno = ApoioXML.objQueryToXML(ctx, query);
                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorUF(decimal ID_UF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_UFs
                                where uf.ID_UF == ID_UF
                                select uf;

                    if (query.Count() == 0)
                        throw new Exception("Unidade Federativa n&atilde;o encontrada");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_UF", item.ID_UF);
                        dados.Add("DESCRICAO_UF", item.DESCRICAO_UF.Trim());
                        dados.Add("ALIQ_INTERNA_ICMS", item.ALIQ_INTERNA_ICMS.ToString());
                        dados.Add("ALIQ_ICMS_UF", item.ALIQ_ICMS_UF.ToString());
                        dados.Add("SIGLA_UF", item.SIGLA_UF);
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

        [WebMethod()]
        public void GravaNovaUF(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_UF> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_UF>();

                    Doran_Servicos_ORM.TB_UF novo = new Doran_Servicos_ORM.TB_UF();

                    novo.ID_UF = Convert.ToDecimal(dados["ID_UF"]);
                    novo.DESCRICAO_UF = dados["DESCRICAO_UF"].ToString();
                    novo.ALIQ_INTERNA_ICMS = Convert.ToDecimal(dados["ALIQ_INTERNA_ICMS"]);
                    novo.ALIQ_ICMS_UF = Convert.ToDecimal(dados["ALIQ_ICMS_UF"]);
                    novo.SIGLA_UF = dados["SIGLA_UF"].ToString();

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
        public void AtualizaUF(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_UFs
                                 where item.ID_UF == Convert.ToDecimal(dados["ID_UF"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a unidade federativa com o ID [" + dados["ID_UF"].ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.DESCRICAO_UF = dados["DESCRICAO_UF"].ToString().Trim();
                        uf.ALIQ_INTERNA_ICMS = Convert.ToDecimal(dados["ALIQ_INTERNA_ICMS"]);
                        uf.ALIQ_ICMS_UF = Convert.ToDecimal(dados["ALIQ_ICMS_UF"]);
                        uf.SIGLA_UF = dados["SIGLA_UF"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_UFs.GetModifiedMembers(uf),
                            ctx.TB_UFs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaUF(decimal ID_UF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_UFs
                                 where item.ID_UF == ID_UF
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_UFs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_UFs.ToString(), ID_USUARIO);
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
        public string Lista_UF(string start, string limit, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var totalCount = (from uf in ctx.TB_UFs
                                      select uf).Where(i => i.DESCRICAO_UF.Contains("")).Count();

                    var query = (from uf in ctx.TB_UFs
                                 select new
                                 {
                                     uf.ID_UF,
                                     uf.DESCRICAO_UF,
                                     uf.ALIQ_INTERNA_ICMS,
                                     uf.ALIQ_ICMS_UF,
                                     uf.SIGLA_UF
                                 }).Skip(Convert.ToInt32(start)).Take(Convert.ToInt32(limit));


                    string retorno = ApoioXML.objQueryToXML(ctx, query, totalCount);
                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_UF(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_UFs
                                where uf.ID_UF > 0
                                orderby uf.DESCRICAO_UF
                                select uf;

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

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
        public Dictionary<string, object> Carrega_UF_ORCAMENTO(decimal ID_USUARIO, decimal ID_UF_EMITENTE)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_UFs
                                where uf.ID_UF > 0
                                orderby uf.DESCRICAO_UF
                                select uf;

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    retorno.Add("Query", ApoioXML.objQueryToXML(ctx, query));
                    retorno.Add("ID_UF_EMITENTE", ID_UF_EMITENTE);

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_MUNICIPIO(decimal ID_UF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_MUNICIPIOs
                                orderby uf.ID_UF, uf.NOME_MUNICIPIO
                                where uf.ID_UF == ID_UF
                                select new { uf.ID_MUNICIPIO, uf.NOME_MUNICIPIO };

                    return ApoioXML.objQueryToXML(ctx, query);
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