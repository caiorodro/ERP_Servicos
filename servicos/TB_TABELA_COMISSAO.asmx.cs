using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_TABELA_COMISSAO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_TABELA_COMISSAO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_TABELA(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from st in ctx.TB_TABELA_COMISSAOs
                                    where st.ID_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"])
                                    select st).Count();

                    var query1 = (from st in ctx.TB_TABELA_COMISSAOs
                                  where st.ID_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"])
                                  select st).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

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
        public void GravaNovaTabela(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_TABELA_COMISSAO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_TABELA_COMISSAO>();

                    Doran_Servicos_ORM.TB_TABELA_COMISSAO novo = new Doran_Servicos_ORM.TB_TABELA_COMISSAO();

                    novo.ID_VENDEDOR = Convert.ToDecimal(dados["ID_VENDEDOR"]);
                    novo.MARGEM_INICIAL = Convert.ToDecimal(dados["MARGEM_INICIAL"]);
                    novo.MARGEM_FINAL = Convert.ToDecimal(dados["MARGEM_FINAL"]);
                    novo.PERCENTUAL_COMISSAO = Convert.ToDecimal(dados["PERCENTUAL_COMISSAO"]);

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
        public void AtualizaTabela(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_TABELA_COMISSAOs
                                 where item.ID_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"])
                                 && item.MARGEM_INICIAL == Convert.ToDecimal(dados["MARGEM_INICIAL"])
                                 && item.MARGEM_FINAL == Convert.ToDecimal(dados["MARGEM_FINAL"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o Vendedor com o ID ["
                            + dados["ID_VENDEDOR"].ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.PERCENTUAL_COMISSAO = Convert.ToDecimal(dados["PERCENTUAL_COMISSAO"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_TABELA_COMISSAOs.GetModifiedMembers(uf),
                            ctx.TB_TABELA_COMISSAOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaTabela(decimal ID_VENDEDOR, decimal MARGEM_INICIAL, decimal MARGEM_FINAL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_TABELA_COMISSAOs
                                 where item.ID_VENDEDOR == ID_VENDEDOR
                                 && item.MARGEM_INICIAL == MARGEM_INICIAL
                                 && item.MARGEM_FINAL == MARGEM_FINAL
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_TABELA_COMISSAOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_TABELA_COMISSAOs.ToString(), ID_USUARIO);
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