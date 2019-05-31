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
    /// Summary description for TB_PRODUTO_DOCUMENTO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_PRODUTO_DOCUMENTO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string CARREGA_DOCUMENTOS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from template in ctx.TB_PRODUTO_DOCUMENTOs

                                where template.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])

                                && template.NOME_DOCUMENTO.Contains(dados["pesquisa"].ToString())

                                && template.DOCUMENTO_LIBERADO == 1

                                select new
                                {
                                    template.ID_PRODUTO,
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
        public string Baixa_Documento(decimal ID_DOCUMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_PRODUTO_DOCUMENTOs
                                 where item.ID_DOCUMENTO == ID_DOCUMENTO
                                 select item).ToList();

                    string ARQUIVO = ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Produto"].EndsWith(@"\") ?
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Produto"] :
                        ConfigurationManager.AppSettings["Pasta_Fisica_Documento_Produto"] + @"\";

                    string retorno = ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Produto"].EndsWith("/") ?
                        ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Produto"] :
                        ConfigurationManager.AppSettings["Pasta_Virtual_Documento_Produto"] + "/";

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
    }
}
