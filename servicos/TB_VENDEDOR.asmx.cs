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
    /// Summary description for TB_VENDEDOR
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_VENDEDOR : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Vendedores(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from st in ctx.TB_VENDEDOREs
                                orderby st.NOME_VENDEDOR
                                where st.NOME_VENDEDOR.Contains(dados["pesquisa"].ToString())
                                select st;

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorID(decimal ID_VENDEDOR, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from transp in ctx.TB_VENDEDOREs
                                 where transp.ID_VENDEDOR == ID_VENDEDOR

                                 select new
                                 {
                                     transp.ID_VENDEDOR,
                                     transp.NOME_VENDEDOR,
                                     transp.CELULAR_VENDEDOR,
                                     transp.EMAIL_VENDEDOR,
                                     transp.SKYPE_VENDEDOR,
                                     transp.PERC_COMISSAO_VENDEDOR,
                                     transp.CODIGO_EMITENTE,
                                     transp.OBS_VENDEDOR,
                                     transp.SUPERVISOR_LIDER,
                                     transp.VENDEDOR_ATIVO
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Vendedor n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_VENDEDOR", item.ID_VENDEDOR);
                        dados.Add("NOME_VENDEDOR", item.NOME_VENDEDOR.Trim());
                        dados.Add("CELULAR_VENDEDOR", item.CELULAR_VENDEDOR.ToString().Trim());
                        dados.Add("EMAIL_VENDEDOR", item.EMAIL_VENDEDOR.ToString().Trim());
                        dados.Add("SKYPE_VENDEDOR", item.SKYPE_VENDEDOR.ToString().Trim());
                        dados.Add("PERC_COMISSAO_VENDEDOR", item.PERC_COMISSAO_VENDEDOR);
                        dados.Add("CODIGO_EMITENTE_VENDEDOR", item.CODIGO_EMITENTE);
                        dados.Add("OBS_VENDEDOR", item.OBS_VENDEDOR.Trim());
                        dados.Add("SUPERVISOR_LIDER", item.SUPERVISOR_LIDER);
                        dados.Add("VENDEDOR_ATIVO", item.VENDEDOR_ATIVO);
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
        public void GravaNovoVendedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<TB_VENDEDORE> Entidade = ctx.GetTable<TB_VENDEDORE>();

                    TB_VENDEDORE novo = new TB_VENDEDORE();

                    novo.NOME_VENDEDOR = dados["NOME_VENDEDOR"].ToString();
                    novo.CELULAR_VENDEDOR = dados["CELULAR_VENDEDOR"].ToString();
                    novo.EMAIL_VENDEDOR = dados["EMAIL_VENDEDOR"].ToString();
                    novo.SKYPE_VENDEDOR = dados["SKYPE_VENDEDOR"].ToString();
                    novo.PERC_COMISSAO_VENDEDOR = Convert.ToDecimal(dados["PERC_COMISSAO_VENDEDOR"]);
                    novo.CODIGO_EMITENTE = Convert.ToDecimal(dados["CODIGO_EMITENTE"]);
                    novo.OBS_VENDEDOR = dados["OBS_VENDEDOR"].ToString();
                    novo.SUPERVISOR_LIDER = Convert.ToDecimal(dados["SUPERVISOR_LIDER"]);
                    novo.VENDEDOR_ATIVO = Convert.ToDecimal(dados["VENDEDOR_ATIVO"]);

                    novo.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

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
        public void AtualizaVendedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_VENDEDOREs
                                 where item.ID_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o Vendedor com o ID ["
                            + dados["ID_VENDEDOR"].ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.NOME_VENDEDOR = dados["NOME_VENDEDOR"].ToString();
                        uf.CELULAR_VENDEDOR = dados["CELULAR_VENDEDOR"].ToString();
                        uf.EMAIL_VENDEDOR = dados["EMAIL_VENDEDOR"].ToString();
                        uf.SKYPE_VENDEDOR = dados["SKYPE_VENDEDOR"].ToString();
                        uf.PERC_COMISSAO_VENDEDOR = Convert.ToDecimal(dados["PERC_COMISSAO_VENDEDOR"]);
                        uf.CODIGO_EMITENTE = Convert.ToDecimal(dados["CODIGO_EMITENTE"]);
                        uf.OBS_VENDEDOR = dados["OBS_VENDEDOR"].ToString();
                        uf.SUPERVISOR_LIDER = Convert.ToDecimal(dados["SUPERVISOR_LIDER"]);
                        uf.VENDEDOR_ATIVO = Convert.ToDecimal(dados["VENDEDOR_ATIVO"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_VENDEDOREs.GetModifiedMembers(uf),
                            "TB_VENDEDORES", Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaVendedor(decimal ID_VENDEDOR, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_VENDEDOREs
                                 where item.ID_VENDEDOR == ID_VENDEDOR
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_VENDEDOREs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_VENDEDOREs.ToString(), ID_USUARIO);
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
        public string CarregaVendedores(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from vendedor in ctx.TB_VENDEDOREs
                                orderby vendedor.VENDEDOR_ATIVO
                                where vendedor.VENDEDOR_ATIVO == 1
                                select new
                                {
                                    vendedor.ID_VENDEDOR,
                                    vendedor.NOME_VENDEDOR
                                };

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