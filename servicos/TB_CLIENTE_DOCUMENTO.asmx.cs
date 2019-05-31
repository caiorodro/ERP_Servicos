using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Configuration;
using System.IO;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CLIENTE_DOCUMENTO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CLIENTE_DOCUMENTO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string CARREGA_DOCUMENTOS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from template in ctx.TB_CLIENTE_DOCUMENTOs

                                where template.ID_CLIENTE == Convert.ToDecimal(dados["ID_CLIENTE"])

                                && template.NOME_DOCUMENTO.Contains(dados["pesquisa"].ToString())

                                select new
                                {
                                    template.ID_CLIENTE,
                                    template.ID_DOCUMENTO,
                                    template.NOME_DOCUMENTO,
                                    template.DATA_DOCUMENTO
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Th2_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoDocumento(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_CLIENTE_DOCUMENTO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE_DOCUMENTO>();

                    Doran_Servicos_ORM.TB_CLIENTE_DOCUMENTO novo = new Doran_Servicos_ORM.TB_CLIENTE_DOCUMENTO();

                    string arquivo = ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"].EndsWith("\\") ?
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"] + dados["ARQUIVO"].ToString() :
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"] + "\\" + dados["ARQUIVO"].ToString();

                    byte[] Conteudo_do_Anexo = Doran_Base.ApoioXML.ReadFile(arquivo);

                    novo.ID_CLIENTE = Convert.ToDecimal(dados["ID_CLIENTE"]);
                    novo.NOME_DOCUMENTO = dados["ARQUIVO"].ToString();
                    novo.CONTEUDO = Conteudo_do_Anexo;
                    novo.DATA_DOCUMENTO = DateTime.Now;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();

                    try { File.Delete(arquivo); }
                    catch { }
                }
            }
            catch (Exception ex)
            {
                Th2_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaDocumento(decimal ID_DOCUMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CLIENTE_DOCUMENTOs
                                 where item.ID_DOCUMENTO == ID_DOCUMENTO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_CLIENTE_DOCUMENTOs.DeleteOnSubmit(linha);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CLIENTE_DOCUMENTOs.ToString(),
                            ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Baixa_Documento(decimal ID_DOCUMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CLIENTE_DOCUMENTOs
                                 where item.ID_DOCUMENTO == ID_DOCUMENTO
                                 select item).ToList();

                    string ARQUIVO = ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"].EndsWith(@"\") ?
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"] :
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Cliente"] + @"\";

                    string retorno = ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Cliente"].EndsWith("/") ?
                        ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Cliente"] :
                        ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Cliente"] + "/";

                    foreach (var item in query)
                    {
                        string ITEM = item.NOME_DOCUMENTO.LastIndexOf(@"\") > -1 ?
                            item.NOME_DOCUMENTO.Substring(item.NOME_DOCUMENTO.LastIndexOf(@"\") + 1) :
                            item.NOME_DOCUMENTO;

                        ITEM = item.NOME_DOCUMENTO.LastIndexOf("/") > -1 ?
                            item.NOME_DOCUMENTO.Substring(item.NOME_DOCUMENTO.LastIndexOf("/") + 1) :
                            item.NOME_DOCUMENTO;

                        ITEM = ApoioXML.RemoveCaracteresEspeciais(ITEM);

                        ARQUIVO += ITEM;

                        File.WriteAllBytes(ARQUIVO, item.CONTEUDO.ToArray());

                        retorno += ITEM;
                    }

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Nome_Documento(decimal ID_DOCUMENTO, string NOME_DOCUMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_CLIENTE_DOCUMENTOs
                                 where linha.ID_DOCUMENTO == ID_DOCUMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.NOME_DOCUMENTO = NOME_DOCUMENTO;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CLIENTE_DOCUMENTOs.GetModifiedMembers(item),
                            ctx.TB_CLIENTE_DOCUMENTOs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}