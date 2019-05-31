using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base.Auditoria;
using System.Collections;
using Doran_Servicos_ORM;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_FOLLOW_UP_ITEM_PEDIDO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_FOLLOW_UP_ITEM_PEDIDO : System.Web.Services.WebService
    {
        [WebMethod()]
        public void GravaNovo(Dictionary<string, object> dados, List<string> DESTINATARIOS, decimal ID_USUARIO, string LOGIN_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    object[] items = (object[])dados["NUMERO_ITENS"];
                    string CLIENTE = "";
                    string CODIGO_PRODUTO = "";

                    for (int i = 0; i < items.Count(); i++)
                    {
                        var query1 = (from linha in ctx.TB_PEDIDO_VENDAs
                                      where linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                      && linha.NUMERO_ITEM == Convert.ToDecimal(items.GetValue(i))
                                      select new
                                      {
                                          linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                          linha.CODIGO_PRODUTO_PEDIDO
                                      }).ToList();

                        foreach (var item in query1)
                        {
                            CLIENTE = item.NOMEFANTASIA_CLIENTE.Trim();
                            CODIGO_PRODUTO += string.Concat("[", item.CODIGO_PRODUTO_PEDIDO.Trim(), "]");
                        }

                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO>();

                        Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO novo = new Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO();

                        novo.NUMERO_PEDIDO = Convert.ToDecimal(dados["NUMERO_PEDIDO"]);
                        novo.NUMERO_ITEM = Convert.ToDecimal(items.GetValue(i));
                        novo.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                        novo.DATA_HORA_FOLLOW_UP = DateTime.Now;
                        novo.TEXTO_FOLLOW_UP = dados["TEXTO_FOLLOW_UP"].ToString();

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(),
                            Convert.ToDecimal(dados["NUMERO_PEDIDO"]), ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    if (DESTINATARIOS.Count > 0)
                    {
                        using (Doran_Email_Posicao_Pedido email = new Doran_Email_Posicao_Pedido(ID_USUARIO))
                        {
                            string _OBS = string.Concat(LOGIN_USUARIO.ToUpper(), " salvou uma nova mensagem de Follow Up no item do pedido ", dados["NUMERO_PEDIDO"].ToString(),
                                "<br /><br />", dados["TEXTO_FOLLOW_UP"].ToString(), "<br /><br />",
                                dados["ASSINATURA"].ToString());

                            email.NUMERO_PEDIDO = Convert.ToDecimal(dados["NUMERO_PEDIDO"]);
                            email.CLIENTE = CLIENTE;
                            email.CODIGO_PRODUTO = CODIGO_PRODUTO;
                            email.HISTORICO = _OBS;
                            email.DESTINATARIOS = DESTINATARIOS;
                            email.ID_CONTA_EMAIL = Convert.ToDecimal(dados["ID_CONTA_EMAIL"]);
                            email.FROM_ADDRESS = dados["FROM_ADDRESS"].ToString();

                            email.Envia_Email_Posicao_Pedido();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaFOLLOW_UP(Dictionary<string, object> dados, List<string> DESTINATARIOS, decimal ID_USUARIO, string LOGIN_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    object[] items = (object[])dados["NUMERO_ITENS"];

                    string CLIENTE = "";
                    string CODIGO_PRODUTO = "";

                    for (int i = 0; i < items.Count(); i++)
                    {
                        var query1 = (from linha in ctx.TB_PEDIDO_VENDAs
                                      where linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                      && linha.NUMERO_ITEM == Convert.ToDecimal(items.GetValue(i))
                                      select new
                                      {
                                          linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                          linha.CODIGO_PRODUTO_PEDIDO
                                      }).ToList();

                        foreach (var item in query1)
                        {
                            CLIENTE = item.NOMEFANTASIA_CLIENTE.Trim();
                            CODIGO_PRODUTO += string.Concat("[", item.CODIGO_PRODUTO_PEDIDO.Trim(), "]");
                        }

                        var query = (from item in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs
                                     where item.NUMERO_FOLLOW_UP == Convert.ToDecimal(dados["NUMERO_FOLLOW_UP"])
                                     && item.NUMERO_ITEM == Convert.ToDecimal(items.GetValue(i))
                                     select item).ToList();

                        foreach (var uf in query)
                        {
                            uf.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                            uf.DATA_HORA_FOLLOW_UP = DateTime.Now;
                            uf.TEXTO_FOLLOW_UP = dados["TEXTO_FOLLOW_UP"].ToString();

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_FOLLOW_UP_ITEM_PEDIDOs.GetModifiedMembers(uf),
                                ctx.TB_FOLLOW_UP_ITEM_PEDIDOs.ToString(), uf.NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();
                        }
                    }

                    if (DESTINATARIOS.Count > 0)
                    {
                        using (Doran_Email_Posicao_Pedido email = new Doran_Email_Posicao_Pedido(ID_USUARIO))
                        {
                            string _OBS = string.Concat(LOGIN_USUARIO.ToUpper(), " salvou uma nova mensagem de Follow Up no item do pedido ", dados["NUMERO_PEDIDO"].ToString(),
                                "<br /><br />", dados["TEXTO_FOLLOW_UP"].ToString(), "<br /><br />",
                                dados["ASSINATURA"].ToString());

                            email.NUMERO_PEDIDO = Convert.ToDecimal(dados["NUMERO_PEDIDO"]);
                            email.CLIENTE = CLIENTE;
                            email.CODIGO_PRODUTO = CODIGO_PRODUTO;
                            email.HISTORICO = _OBS;
                            email.DESTINATARIOS = DESTINATARIOS;
                            email.ID_CONTA_EMAIL = Convert.ToDecimal(dados["ID_CONTA_EMAIL"]);
                            email.FROM_ADDRESS = dados["FROM_ADDRESS"].ToString();

                            email.Envia_Email_Posicao_Pedido();
                        }
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