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
    /// Summary description for TB_TIPO_COBRANCA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_TIPO_COBRANCA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Tipo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from st in ctx.TB_TIPO_COBRANCAs
                                select new
                                {
                                    st.COD_TIPO_COBRANCA,
                                    st.DESCRICAO_TIPO_COBRANCA,
                                    st.NUMERO_BANCO,
                                    st.TB_BANCO.NOME_BANCO
                                };

                    if (dados["DESCRICAO_TIPO_COBRANCA"].ToString().Trim().Length > 0)
                        query = query.Where(r => r.DESCRICAO_TIPO_COBRANCA.Contains(dados["DESCRICAO_TIPO_COBRANCA"].ToString()));

                    if (dados.Keys.Contains("NUMERO_BANCO"))
                        if (Convert.ToDecimal(dados["NUMERO_BANCO"]) > 0)
                            query = query.Where(r => r.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"]));

                    var rowCount = query.Count();

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
        public string Carrega_Tipos(decimal NUMERO_BANCO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from st in ctx.TB_TIPO_COBRANCAs
                                where st.NUMERO_BANCO == NUMERO_BANCO
                                select new
                                {
                                    st.COD_TIPO_COBRANCA,
                                    st.DESCRICAO_TIPO_COBRANCA
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

        [WebMethod()]
        public Dictionary<string, object> Busca_Tipo(decimal COD_TIPO_COBRANCA, decimal NUMERO_BANCO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from st in ctx.TB_TIPO_COBRANCAs
                                 where st.COD_TIPO_COBRANCA == COD_TIPO_COBRANCA
                                 && st.NUMERO_BANCO == NUMERO_BANCO
                                 select st).ToList();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        retorno.Add("DESCRICAO_TIPO_COBRANCA", item.DESCRICAO_TIPO_COBRANCA.Trim());
                    }

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
        public void GravaNovoTipoCobranca(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_TIPO_COBRANCA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_TIPO_COBRANCA>();

                    Doran_Servicos_ORM.TB_TIPO_COBRANCA novo = new Doran_Servicos_ORM.TB_TIPO_COBRANCA();

                    novo.COD_TIPO_COBRANCA = Convert.ToDecimal(dados["COD_TIPO_COBRANCA"]);
                    novo.NUMERO_BANCO = Convert.ToDecimal(dados["NUMERO_BANCO"]);
                    novo.DESCRICAO_TIPO_COBRANCA = dados["DESCRICAO_TIPO_COBRANCA"].ToString();

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
        public void AtualizaTipoCobranca(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_TIPO_COBRANCAs
                                 where item.COD_TIPO_COBRANCA == Convert.ToDecimal(dados["COD_TIPO_COBRANCA"])
                                 && item.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"])
                                 select item).ToList();

                    foreach (var uf in query)
                    {
                        uf.DESCRICAO_TIPO_COBRANCA = dados["DESCRICAO_TIPO_COBRANCA"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_TIPO_COBRANCAs.GetModifiedMembers(uf),
                            ctx.TB_TIPO_COBRANCAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaTipoCobranca(decimal COD_TIPO_COBRANCA, decimal NUMERO_BANCO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_TIPO_COBRANCAs
                                 where item.COD_TIPO_COBRANCA == COD_TIPO_COBRANCA
                                 && item.NUMERO_BANCO == NUMERO_BANCO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_TIPO_COBRANCAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_TIPO_COBRANCAs.ToString(), ID_USUARIO);
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
