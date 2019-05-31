using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Configuration;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_STATUS_PEDIDO_COMPRA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_STATUS_PEDIDO_COMPRA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_STATUS_PEDIDO(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDO_COMPRAs
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
        public string Lista_TB_STATUS_PEDIDO_INDEFINIDO(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDO_COMPRAs
                                where uf.STATUS_ESPECIFICO_ITEM_COMPRA == 0 ||
                                (uf.STATUS_ESPECIFICO_ITEM_COMPRA == 2 || uf.STATUS_ESPECIFICO_ITEM_COMPRA == 6)
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
        public Dictionary<string, object> BuscaPorID(decimal CODIGO_STATUS_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from uf in ctx.TB_STATUS_PEDIDO_COMPRAs
                                 where uf.CODIGO_STATUS_COMPRA == CODIGO_STATUS_COMPRA
                                 select uf).ToList();

                    if (query.Count() == 0)
                        throw new Exception("C&oacute;digo de Status n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("CODIGO_STATUS_COMPRA", item.CODIGO_STATUS_COMPRA);
                        dados.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("COR_STATUS_PEDIDO_COMPRA", item.COR_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        dados.Add("NAO_CANCELAR_PEDIDO_COMPRA", item.NAO_CANCELAR_PEDIDO_COMPRA);
                        dados.Add("SENHA_STATUS_ITEM_COMPRA", item.SENHA_STATUS_ITEM_COMPRA.Trim());
                        dados.Add("STATUS_ESPECIFICO_ITEM_COMPRA", item.STATUS_ESPECIFICO_ITEM_COMPRA);
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
        public void GravaNovoStatus(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_STATUS_PEDIDO_COMPRA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_STATUS_PEDIDO_COMPRA>();

                    Doran_Servicos_ORM.TB_STATUS_PEDIDO_COMPRA novo = new Doran_Servicos_ORM.TB_STATUS_PEDIDO_COMPRA();

                    novo.DESCRICAO_STATUS_PEDIDO_COMPRA = dados["DESCRICAO_STATUS_PEDIDO_COMPRA"].ToString();
                    novo.COR_STATUS_PEDIDO_COMPRA = dados["COR_STATUS_PEDIDO_COMPRA"].ToString();
                    novo.COR_FONTE_STATUS_PEDIDO_COMPRA = dados["COR_FONTE_STATUS_PEDIDO_COMPRA"].ToString();
                    novo.NAO_CANCELAR_PEDIDO_COMPRA = Convert.ToDecimal(dados["NAO_CANCELAR_PEDIDO_COMPRA"]);
                    novo.STATUS_ESPECIFICO_ITEM_COMPRA = Convert.ToDecimal(dados["STATUS_ESPECIFICO_ITEM_COMPRA"]);

                    if (dados["SENHA_STATUS_ITEM_COMPRA"].ToString().Trim().Length > 0)
                    {
                        Th2_Seguranca.Principal sen = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
                            ConfigurationManager.AppSettings["ID_Sistema"]);

                        sen.CriptografaDados(dados["SENHA_STATUS_ITEM_COMPRA"].ToString().Trim());

                        novo.SENHA_STATUS_ITEM_COMPRA = sen.SenhaEncriptada_;
                    }
                    else
                        novo.SENHA_STATUS_ITEM_COMPRA = "";

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
        public void AtualizaStatus(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDO_COMPRAs
                                 where item.CODIGO_STATUS_COMPRA == Convert.ToDecimal(dados["CODIGO_STATUS_COMPRA"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o status com o ID [" + dados["CODIGO_STATUS_COMPRA"].ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.DESCRICAO_STATUS_PEDIDO_COMPRA = dados["DESCRICAO_STATUS_PEDIDO_COMPRA"].ToString();
                        uf.COR_STATUS_PEDIDO_COMPRA = dados["COR_STATUS_PEDIDO_COMPRA"].ToString();
                        uf.COR_FONTE_STATUS_PEDIDO_COMPRA = dados["COR_FONTE_STATUS_PEDIDO_COMPRA"].ToString();

                        uf.NAO_CANCELAR_PEDIDO_COMPRA = Convert.ToDecimal(dados["NAO_CANCELAR_PEDIDO_COMPRA"]);
                        uf.STATUS_ESPECIFICO_ITEM_COMPRA = Convert.ToDecimal(dados["STATUS_ESPECIFICO_ITEM_COMPRA"]);

                        if (dados["SENHA_STATUS_ITEM_COMPRA"].ToString().Trim() != uf.SENHA_STATUS_ITEM_COMPRA.Trim())
                        {
                            Th2_Seguranca.Principal sen = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
                                ConfigurationManager.AppSettings["ID_Sistema"]);

                            sen.CriptografaDados(dados["SENHA_STATUS_ITEM_COMPRA"].ToString().Trim());

                            uf.SENHA_STATUS_ITEM_COMPRA = sen.SenhaEncriptada_;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_STATUS_PEDIDO_COMPRAs.GetModifiedMembers(uf),
                            ctx.TB_STATUS_PEDIDO_COMPRAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaStatus(decimal CODIGO_STATUS_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDO_COMPRAs
                                 where item.CODIGO_STATUS_COMPRA == CODIGO_STATUS_COMPRA
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_STATUS_PEDIDO_COMPRAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_STATUS_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
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
        public string Carrega_STATUS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDO_COMPRAs
                                orderby uf.CODIGO_STATUS_COMPRA
                                select uf;
                                
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
        public void ResetaSenha(decimal CODIGO_STATUS_COMPRA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDO_COMPRAs
                                 where item.CODIGO_STATUS_COMPRA == CODIGO_STATUS_COMPRA
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o status com o ID [" + CODIGO_STATUS_COMPRA.ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.SENHA_STATUS_ITEM_COMPRA = "";

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_STATUS_PEDIDO_COMPRAs.GetModifiedMembers(uf),
                            ctx.TB_STATUS_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }
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