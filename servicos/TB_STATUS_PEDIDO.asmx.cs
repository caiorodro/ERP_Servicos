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
    /// Summary description for TB_STATUS_PEDIDO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_STATUS_PEDIDO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_STATUS_PEDIDO(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDOs
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
        public Dictionary<string, object> BuscaPorID(decimal CODIGO_STATUS_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from uf in ctx.TB_STATUS_PEDIDOs
                                 where uf.CODIGO_STATUS_PEDIDO == CODIGO_STATUS_PEDIDO
                                 select uf).ToList();

                    if (query.Count() == 0)
                        throw new Exception("C&oacute;digo de Status n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("CODIGO_STATUS_PEDIDO", item.CODIGO_STATUS_PEDIDO);
                        dados.Add("DESCRICAO_STATUS_PEDIDO", item.DESCRICAO_STATUS_PEDIDO.Trim());
                        dados.Add("COR_STATUS", item.COR_STATUS.Trim());
                        dados.Add("COR_FONTE_STATUS", item.COR_FONTE_STATUS.Trim());
                        dados.Add("NAO_IMPRIMIR_PEDIDO", item.NAO_IMPRIMIR_PEDIDO);
                        dados.Add("NAO_CANCELAR_PEDIDO", item.NAO_CANCELAR_PEDIDO);
                        dados.Add("SENHA_STATUS_PEDIDO", item.SENHA_STATUS_PEDIDO.Trim());
                        dados.Add("STATUS_ESPECIFICO", item.STATUS_ESPECIFICO);
                        dados.Add("APARECE_NO_PORTAL_DE_CLIENTE", item.APARECE_NO_PORTAL_DE_CLIENTE);
                        dados.Add("INICIO_FIM_DE_FASE", item.INICIO_FIM_DE_FASE);
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
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_STATUS_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_STATUS_PEDIDO>();

                    Doran_Servicos_ORM.TB_STATUS_PEDIDO novo = new Doran_Servicos_ORM.TB_STATUS_PEDIDO();

                    novo.DESCRICAO_STATUS_PEDIDO = dados["DESCRICAO_STATUS_PEDIDO"].ToString();
                    novo.COR_STATUS = dados["COR_STATUS"].ToString();
                    novo.COR_FONTE_STATUS = dados["COR_FONTE_STATUS"].ToString();
                    novo.NAO_IMPRIMIR_PEDIDO = Convert.ToDecimal(dados["NAO_IMPRIMIR_PEDIDO"]);
                    novo.NAO_CANCELAR_PEDIDO = Convert.ToDecimal(dados["NAO_CANCELAR_PEDIDO"]);
                    novo.STATUS_ESPECIFICO = Convert.ToDecimal(dados["STATUS_ESPECIFICO"]);
                    novo.APARECE_NO_PORTAL_DE_CLIENTE = Convert.ToDecimal(dados["APARECE_NO_PORTAL_DE_CLIENTE"]);
                    novo.INICIO_FIM_DE_FASE = Convert.ToDecimal(dados["INICIO_FIM_DE_FASE"]);

                    if (dados["SENHA_STATUS_PEDIDO"].ToString().Trim().Length > 0)
                    {
                        Th2_Seguranca.Principal sen = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
                            ConfigurationManager.AppSettings["ID_Sistema"]);

                        sen.CriptografaDados(dados["SENHA_STATUS_PEDIDO"].ToString().Trim());

                        novo.SENHA_STATUS_PEDIDO = sen.SenhaEncriptada_;
                    }
                    else
                        novo.SENHA_STATUS_PEDIDO = "";

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
                    var query = (from item in ctx.TB_STATUS_PEDIDOs
                                 where item.CODIGO_STATUS_PEDIDO == Convert.ToDecimal(dados["CODIGO_STATUS_PEDIDO"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o status com o ID [" + dados["CODIGO_STATUS_PEDIDO"].ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.DESCRICAO_STATUS_PEDIDO = dados["DESCRICAO_STATUS_PEDIDO"].ToString();
                        uf.COR_STATUS = dados["COR_STATUS"].ToString();
                        uf.COR_FONTE_STATUS = dados["COR_FONTE_STATUS"].ToString();

                        uf.NAO_IMPRIMIR_PEDIDO = Convert.ToDecimal(dados["NAO_IMPRIMIR_PEDIDO"]);
                        uf.NAO_CANCELAR_PEDIDO = Convert.ToDecimal(dados["NAO_CANCELAR_PEDIDO"]);
                        uf.STATUS_ESPECIFICO = Convert.ToDecimal(dados["STATUS_ESPECIFICO"]);
                        uf.APARECE_NO_PORTAL_DE_CLIENTE = Convert.ToDecimal(dados["APARECE_NO_PORTAL_DE_CLIENTE"]);
                        uf.INICIO_FIM_DE_FASE = Convert.ToDecimal(dados["INICIO_FIM_DE_FASE"]);

                        if (dados["SENHA_STATUS_PEDIDO"].ToString().Trim() != uf.SENHA_STATUS_PEDIDO.Trim())
                        {
                            Th2_Seguranca.Principal sen = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
                                ConfigurationManager.AppSettings["ID_Sistema"]);

                            sen.CriptografaDados(dados["SENHA_STATUS_PEDIDO"].ToString().Trim());

                            uf.SENHA_STATUS_PEDIDO = sen.SenhaEncriptada_;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_STATUS_PEDIDOs.GetModifiedMembers(uf),
                            ctx.TB_STATUS_PEDIDOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaStatus(decimal CODIGO_STATUS_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDOs
                                 where item.CODIGO_STATUS_PEDIDO == CODIGO_STATUS_PEDIDO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_STATUS_PEDIDOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_STATUS_PEDIDOs.ToString(), ID_USUARIO);
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
                    var query = from uf in ctx.TB_STATUS_PEDIDOs
                                orderby uf.CODIGO_STATUS_PEDIDO
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
        public void ResetaSenha(decimal CODIGO_STATUS_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDOs
                                 where item.CODIGO_STATUS_PEDIDO == CODIGO_STATUS_PEDIDO
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o status com o ID [" + CODIGO_STATUS_PEDIDO.ToString() + "]");

                    foreach (var uf in query)
                    {
                        uf.SENHA_STATUS_PEDIDO = "";

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_STATUS_PEDIDOs.GetModifiedMembers(uf),
                            ctx.TB_STATUS_PEDIDOs.ToString(), ID_USUARIO);

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