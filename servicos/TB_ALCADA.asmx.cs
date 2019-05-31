using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Text;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_ALCADA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_ALCADA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Alcada(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                 where cs.CODIGO_STATUS_COMPRA == Convert.ToDecimal(dados["CODIGO_STATUS_COMPRA"])
                                 select new
                                 {
                                     cs.CODIGO_STATUS_COMPRA,
                                     cs.ID_USUARIO,
                                     cs.TB_USUARIO.LOGIN_USUARIO,
                                     cs.VALOR_MAXIMO_APROVACAO
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
        public void GravaNovaAlcada(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var existe = (from linha in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                  where linha.CODIGO_STATUS_COMPRA == Convert.ToDecimal(dados["CODIGO_STATUS_COMPRA"])
                                  && linha.ID_USUARIO == Convert.ToDecimal(dados["ID_USUARIO"])
                                  select linha).Any();

                    if (existe)
                        throw new Exception("J&aacute; existe uma al&ccedil;ada cadastrada com essa fase e usu&aacute;rio");

                    System.Data.Linq.Table<TB_ALCADA_APROVACAO_PEDIDO> Entidade = ctx.GetTable<TB_ALCADA_APROVACAO_PEDIDO>();

                    TB_ALCADA_APROVACAO_PEDIDO novo = new TB_ALCADA_APROVACAO_PEDIDO();

                    novo.CODIGO_STATUS_COMPRA = Convert.ToDecimal(dados["CODIGO_STATUS_COMPRA"]);
                    novo.ID_USUARIO = Convert.ToDecimal(dados["ID_USUARIO"]);
                    novo.VALOR_MAXIMO_APROVACAO = Convert.ToDecimal(dados["VALOR_MAXIMO_APROVACAO"]);

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, "TB_ALCADA_APROVACAO_PEDIDO", Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));

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
        public void AtualizaAlcada(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                 where item.CODIGO_STATUS_COMPRA == Convert.ToDecimal(dados["CODIGO_STATUS_COMPRA"])
                                 && item.ID_USUARIO == Convert.ToDecimal(dados["ID_USUARIO"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a Cond. de Pagamento com o ID [" + dados["CODIGO_CP"].ToString() + "]");

                    foreach (var cond in query)
                    {
                        cond.VALOR_MAXIMO_APROVACAO = Convert.ToDecimal(dados["VALOR_MAXIMO_APROVACAO"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ALCADA_APROVACAO_PEDIDOs.GetModifiedMembers(cond),
                            "TB_ALCADA_APROVACAO_PEDIDO", Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));

                        ctx.SubmitChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaAlcada(decimal CODIGO_STATUS_COMPRA, decimal ID_USUARIO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                 where item.CODIGO_STATUS_COMPRA == CODIGO_STATUS_COMPRA
                                 && item.ID_USUARIO == ID_USUARIO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_ALCADA_APROVACAO_PEDIDOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, "TB_ALCADA_APROVACAO_PEDIDO", ID_USUARIO_ORIGINAL);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public decimal Valor_Maximo_Aprovacao(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                 where linha.ID_USUARIO == ID_USUARIO
                                 select linha.VALOR_MAXIMO_APROVACAO).ToList();

                    return query.Any() ? query.First().Value : 0;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Libera_Pedido(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var STATUS_EM_ANDAMENTO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                               where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 2
                                               select linha).ToList();

                    if (!STATUS_EM_ANDAMENTO.Any())
                        throw new Exception("N&atilde; h&aacute; status de pedido em andamento cadastrado");

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.STATUS_ITEM_COMPRA = STATUS_EM_ANDAMENTO.First().CODIGO_STATUS_COMPRA;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            "TB_PEDIDO_COMPRA", ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in STATUS_EM_ANDAMENTO)
                    {
                        retorno.Add("STATUS_ITEM_COMPRA", item.CODIGO_STATUS_COMPRA);
                        retorno.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                        retorno.Add("COR_STATUS_PEDIDO_COMPRA", item.COR_STATUS_PEDIDO_COMPRA.Trim());
                        retorno.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        retorno.Add("STATUS_ESPECIFICO_ITEM_COMPRA", item.STATUS_ESPECIFICO_ITEM_COMPRA);
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
        public string Lista_Alcada_do_Pedido(decimal TOTAL_PRODUTOS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                where linha.VALOR_MAXIMO_APROVACAO >= TOTAL_PRODUTOS
                                select new
                                {
                                    linha.ID_USUARIO,
                                    linha.TB_USUARIO.LOGIN_USUARIO,
                                    linha.TB_USUARIO.NOME_USUARIO,
                                    linha.VALOR_MAXIMO_APROVACAO
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
        public void Solicita_Liberacao(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR, decimal ID_USUARIO,
            decimal ID_CONTA_EMAIL, string FROM_ADDRESS, List<decimal> IDs_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                 select new
                                 {
                                     linha.NUMERO_PEDIDO_COMPRA,
                                     linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR
                                 }).First();

                    var TOTAL_PRODUTOS = (from linha in ctx.TB_PEDIDO_COMPRAs
                                          where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                          && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                          select linha.VALOR_TOTAL_ITEM_COMPRA).Sum();

                    var EMAILS_CONTA = (from linha in ctx.TB_EMAIL_CONTAs
                                        where IDs_USUARIO.Contains(linha.ID_USUARIO.Value)
                                        select new
                                        {
                                            linha.CONTA_EMAIL,
                                            linha.TB_USUARIO.LOGIN_USUARIO
                                        }).ToList();

                    foreach (var item in EMAILS_CONTA)
                    {
                        using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                        {
                            Dictionary<string, object> dados = new Dictionary<string, object>();

                            dados.Add("ID_MESSAGE", 0);
                            dados.Add("ID_CONTA_EMAIL", ID_CONTA_EMAIL);
                            dados.Add("FROM_ADDRESS", FROM_ADDRESS);
                            dados.Add("PRIORITY", 1);
                            dados.Add("SUBJECT", string.Concat("Doran ERP - Solicitação de liberação de pedido de compra - [", query.NOME_FANTASIA_FORNECEDOR.Trim(), "]"));

                            StringBuilder _mensagem = new StringBuilder();

                            _mensagem.Append("O usu&aacute;rio [<b>" + item.LOGIN_USUARIO.Trim() + @"</b>] est&aacute; solicitando a sua aprova&ccedil;&atilde;o 
no pedido de compra n&ordm; [<b>" + NUMERO_PEDIDO_COMPRA.ToString() + @"</b>]<br /><br />Valor do pedido: <b>" + TOTAL_PRODUTOS.Value.ToString("c") + "</b>");

                            dados.Add("BODY", _mensagem.ToString());
                            dados.Add("RAW_BODY", _mensagem.ToString());
                            dados.Add("NUMERO_CRM", 0);

                            List<string> TOs = new List<string>();
                            TOs.Add(item.CONTA_EMAIL.Trim());

                            List<string> CCs = new List<string>();
                            List<string> BCCs = new List<string>();
                            List<string> Attachments = new List<string>();

                            decimal ID_MESSAGE = mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);

                            mail.Envia_Email_que_estava_gravado_como_rascunho(ID_MESSAGE);
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
