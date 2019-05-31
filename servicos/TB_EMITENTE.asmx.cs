using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_EMITENTE
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_EMITENTE : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_EMITENTE(Dictionary<string, string> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from transp in ctx.TB_EMITENTEs
                                    where transp.NOME_EMITENTE.Contains(dados["pesquisa"]) ||
                                    transp.NOME_FANTASIA_EMITENTE.Contains(dados["pesquisa"])
                                    select transp).Count();

                    var query1 = (from transp in ctx.TB_EMITENTEs
                                  where transp.NOME_EMITENTE.Contains(dados["pesquisa"]) ||
                                  transp.NOME_FANTASIA_EMITENTE.Contains(dados["pesquisa"])

                                  select new
                                  {
                                      transp.CODIGO_EMITENTE,
                                      transp.NOME_EMITENTE,
                                      transp.NOME_FANTASIA_EMITENTE,
                                      transp.CNPJ_EMITENTE,
                                      transp.IE_EMITENTE,
                                      transp.ENDERECO_EMITENTE,
                                      transp.NUMERO_END_EMITENTE,
                                      transp.COMPLEMENTO_END_EMITENTE,
                                      transp.CEP_EMITENTE,
                                      transp.BAIRRO_EMITENTE,
                                      transp.CODIGO_MUNICIPIO_EMITENTE,
                                      DESCRICAO_CIDADE_EMITENTE = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                      transp.ID_UF_EMITENTE,
                                      DESCRICAO_ESTADO_EMITENTE = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                      transp.ENDERECO_RETIRADA_EMITENTE,
                                      transp.NUMERO_END_RETIRADA_EMITENTE,
                                      transp.COMPL_RETIRADA_EMITENTE,
                                      transp.CEP_RETIRADA_EMITENTE,
                                      transp.BAIRRO_RETIRADA_EMITENTE,
                                      transp.COD_MUNICIPIO_RETIRADA_EMITENTE,
                                      DESCRICAO_CIDADE_RETIRADA = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                      transp.ID_UF_RETIRADA_EMITENTE,
                                      DESCRICAO_ESTADO_RETIRADA = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                      transp.TELEFONE_EMITENTE,
                                      transp.FAX_EMITENTE,
                                      transp.OBS_EMITENTE,
                                      transp.EMAIL_EMITENTE,
                                      transp.NUMERO_NF_EMITENTE,
                                      transp.SERIE_NF_EMITENTE,
                                      transp.SITE_EMITENTE,
                                      transp.CRT_EMITENTE
                                  }).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorID(int CODIGO_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from transp in ctx.TB_EMITENTEs
                                 where transp.CODIGO_EMITENTE == CODIGO_EMITENTE

                                 select new
                                 {
                                     transp.CODIGO_EMITENTE,
                                     transp.NOME_EMITENTE,
                                     transp.NOME_FANTASIA_EMITENTE,
                                     transp.CNPJ_EMITENTE,
                                     transp.IE_EMITENTE,
                                     transp.ENDERECO_EMITENTE,
                                     transp.NUMERO_END_EMITENTE,
                                     transp.COMPLEMENTO_END_EMITENTE,
                                     transp.CEP_EMITENTE,
                                     transp.BAIRRO_EMITENTE,
                                     transp.CODIGO_MUNICIPIO_EMITENTE,
                                     DESCRICAO_CIDADE_EMITENTE = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_EMITENTE,
                                     DESCRICAO_ESTADO_EMITENTE = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.ENDERECO_RETIRADA_EMITENTE,
                                     transp.NUMERO_END_RETIRADA_EMITENTE,
                                     transp.COMPL_RETIRADA_EMITENTE,
                                     transp.CEP_RETIRADA_EMITENTE,
                                     transp.BAIRRO_RETIRADA_EMITENTE,
                                     transp.COD_MUNICIPIO_RETIRADA_EMITENTE,
                                     DESCRICAO_CIDADE_RETIRADA = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_RETIRADA_EMITENTE,
                                     DESCRICAO_ESTADO_RETIRADA = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.TELEFONE_EMITENTE,
                                     transp.FAX_EMITENTE,
                                     transp.OBS_EMITENTE,
                                     transp.EMAIL_EMITENTE,
                                     transp.NUMERO_NF_EMITENTE,
                                     transp.SERIE_NF_EMITENTE,
                                     transp.SITE_EMITENTE,
                                     transp.CRT_EMITENTE,
                                     transp.NUMERO_LOTE
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Emitente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("CODIGO_EMITENTE", item.CODIGO_EMITENTE);
                        dados.Add("NOME_EMITENTE", item.NOME_EMITENTE.Trim());
                        dados.Add("NOME_FANTASIA_EMITENTE", item.NOME_FANTASIA_EMITENTE.ToString().Trim());
                        dados.Add("CNPJ_EMITENTE", item.CNPJ_EMITENTE.ToString().Trim());
                        dados.Add("IE_EMITENTE", item.IE_EMITENTE.ToString().Trim());
                        dados.Add("ENDERECO_EMITENTE", item.ENDERECO_EMITENTE.ToString().Trim());

                        dados.Add("NUMERO_END_EMITENTE", item.NUMERO_END_EMITENTE.ToString().Trim());
                        dados.Add("COMPLEMENTO_END_EMITENTE", item.COMPLEMENTO_END_EMITENTE.ToString().Trim());

                        dados.Add("CEP_EMITENTE", item.CEP_EMITENTE.ToString().Trim());
                        dados.Add("BAIRRO_EMITENTE", item.BAIRRO_EMITENTE.ToString().Trim());
                        dados.Add("CODIGO_MUNICIPIO_EMITENTE", item.CODIGO_MUNICIPIO_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_EMITENTE", item.DESCRICAO_CIDADE_EMITENTE.Trim());

                        dados.Add("ID_UF_EMITENTE", item.ID_UF_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_EMITENTE", item.DESCRICAO_ESTADO_EMITENTE.ToString().Trim());

                        dados.Add("ENDERECO_RETIRADA_EMITENTE", item.ENDERECO_RETIRADA_EMITENTE.Trim());
                        dados.Add("NUMERO_END_RETIRADA_EMITENTE", item.NUMERO_END_RETIRADA_EMITENTE.Trim());
                        dados.Add("COMPL_RETIRADA_EMITENTE", item.COMPL_RETIRADA_EMITENTE.Trim());
                        dados.Add("CEP_RETIRADA_EMITENTE", item.CEP_RETIRADA_EMITENTE.Trim());
                        dados.Add("BAIRRO_RETIRADA_EMITENTE", item.BAIRRO_RETIRADA_EMITENTE.Trim());
                        dados.Add("COD_MUNICIPIO_RETIRADA_EMITENTE", item.COD_MUNICIPIO_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_CIDADE_RETIRADA", item.DESCRICAO_CIDADE_RETIRADA.Trim());
                        dados.Add("ID_UF_RETIRADA_EMITENTE", item.ID_UF_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_ESTADO_RETIRADA", item.DESCRICAO_ESTADO_RETIRADA.Trim());

                        dados.Add("TELEFONE_EMITENTE", item.TELEFONE_EMITENTE.ToString().Trim());

                        dados.Add("FAX_EMITENTE", item.FAX_EMITENTE.ToString().Trim());
                        dados.Add("OBS_EMITENTE", item.OBS_EMITENTE.ToString().Trim());

                        dados.Add("EMAIL_EMITENTE", item.EMAIL_EMITENTE.ToString().Trim());

                        dados.Add("NUMERO_NF_EMITENTE", item.NUMERO_NF_EMITENTE);
                        dados.Add("SERIE_NF_EMITENTE", item.SERIE_NF_EMITENTE.Trim());

                        dados.Add("NUMERO_LOTE", item.NUMERO_LOTE);

                        dados.Add("SITE_EMITENTE", item.SITE_EMITENTE.Trim());
                        dados.Add("CRT_EMITENTE", item.CRT_EMITENTE);
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
        public Dictionary<string, object> BuscaPorNomeFantasia(string NOME_FANTASIA_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from transp in ctx.TB_EMITENTEs
                                 where transp.NOME_FANTASIA_EMITENTE == NOME_FANTASIA_EMITENTE

                                 select new
                                 {
                                     transp.CODIGO_EMITENTE,
                                     transp.NOME_EMITENTE,
                                     transp.NOME_FANTASIA_EMITENTE,
                                     transp.CNPJ_EMITENTE,
                                     transp.IE_EMITENTE,
                                     transp.ENDERECO_EMITENTE,
                                     transp.NUMERO_END_EMITENTE,
                                     transp.COMPLEMENTO_END_EMITENTE,
                                     transp.CEP_EMITENTE,
                                     transp.BAIRRO_EMITENTE,
                                     transp.CODIGO_MUNICIPIO_EMITENTE,
                                     DESCRICAO_CIDADE_EMITENTE = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_EMITENTE,
                                     DESCRICAO_ESTADO_EMITENTE = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.ENDERECO_RETIRADA_EMITENTE,
                                     transp.NUMERO_END_RETIRADA_EMITENTE,
                                     transp.COMPL_RETIRADA_EMITENTE,
                                     transp.CEP_RETIRADA_EMITENTE,
                                     transp.BAIRRO_RETIRADA_EMITENTE,
                                     transp.COD_MUNICIPIO_RETIRADA_EMITENTE,
                                     DESCRICAO_CIDADE_RETIRADA = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_RETIRADA_EMITENTE,
                                     DESCRICAO_ESTADO_RETIRADA = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.TELEFONE_EMITENTE,
                                     transp.FAX_EMITENTE,
                                     transp.OBS_EMITENTE,
                                     transp.EMAIL_EMITENTE,
                                     transp.NUMERO_NF_EMITENTE,
                                     transp.SERIE_NF_EMITENTE,
                                     transp.SITE_EMITENTE,
                                     transp.CRT_EMITENTE,
                                     transp.NUMERO_LOTE
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Emitente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("CODIGO_EMITENTE", item.CODIGO_EMITENTE);
                        dados.Add("NOME_EMITENTE", item.NOME_EMITENTE.Trim());
                        dados.Add("NOME_FANTASIA_EMITENTE", item.NOME_FANTASIA_EMITENTE.ToString().Trim());
                        dados.Add("CNPJ_EMITENTE", item.CNPJ_EMITENTE.ToString().Trim());
                        dados.Add("IE_EMITENTE", item.IE_EMITENTE.ToString().Trim());
                        dados.Add("ENDERECO_EMITENTE", item.ENDERECO_EMITENTE.ToString().Trim());

                        dados.Add("NUMERO_END_EMITENTE", item.NUMERO_END_EMITENTE.ToString().Trim());
                        dados.Add("COMPLEMENTO_END_EMITENTE", item.COMPLEMENTO_END_EMITENTE.ToString().Trim());

                        dados.Add("CEP_EMITENTE", item.CEP_EMITENTE.ToString().Trim());
                        dados.Add("BAIRRO_EMITENTE", item.BAIRRO_EMITENTE.ToString().Trim());
                        dados.Add("CODIGO_MUNICIPIO_EMITENTE", item.CODIGO_MUNICIPIO_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_EMITENTE", item.DESCRICAO_CIDADE_EMITENTE.Trim());

                        dados.Add("ID_UF_EMITENTE", item.ID_UF_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_EMITENTE", item.DESCRICAO_ESTADO_EMITENTE.ToString().Trim());

                        dados.Add("ENDERECO_RETIRADA_EMITENTE", item.ENDERECO_RETIRADA_EMITENTE.Trim());
                        dados.Add("NUMERO_END_RETIRADA_EMITENTE", item.NUMERO_END_RETIRADA_EMITENTE.Trim());
                        dados.Add("COMPL_RETIRADA_EMITENTE", item.COMPL_RETIRADA_EMITENTE.Trim());
                        dados.Add("CEP_RETIRADA_EMITENTE", item.CEP_RETIRADA_EMITENTE.Trim());
                        dados.Add("BAIRRO_RETIRADA_EMITENTE", item.BAIRRO_RETIRADA_EMITENTE.Trim());
                        dados.Add("COD_MUNICIPIO_RETIRADA_EMITENTE", item.COD_MUNICIPIO_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_CIDADE_RETIRADA", item.DESCRICAO_CIDADE_RETIRADA.Trim());
                        dados.Add("ID_UF_RETIRADA_EMITENTE", item.ID_UF_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_ESTADO_RETIRADA", item.DESCRICAO_ESTADO_RETIRADA.Trim());

                        dados.Add("TELEFONE_EMITENTE", item.TELEFONE_EMITENTE.ToString().Trim());

                        dados.Add("FAX_EMITENTE", item.FAX_EMITENTE.ToString().Trim());
                        dados.Add("OBS_EMITENTE", item.OBS_EMITENTE.ToString().Trim());

                        dados.Add("EMAIL_EMITENTE", item.EMAIL_EMITENTE.ToString().Trim());

                        dados.Add("NUMERO_NF_EMITENTE", item.NUMERO_NF_EMITENTE);
                        dados.Add("SERIE_NF_EMITENTE", item.SERIE_NF_EMITENTE.Trim());

                        dados.Add("NUMERO_LOTE", item.NUMERO_LOTE);

                        dados.Add("SITE_EMITENTE", item.SITE_EMITENTE.Trim());
                        dados.Add("CRT_EMITENTE", item.CRT_EMITENTE);
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
        public Dictionary<string, object> BuscaPorCNPJ(string CNPJ_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from transp in ctx.TB_EMITENTEs
                                 where transp.CNPJ_EMITENTE == CNPJ_EMITENTE

                                 select new
                                 {
                                     transp.CODIGO_EMITENTE,
                                     transp.NOME_EMITENTE,
                                     transp.NOME_FANTASIA_EMITENTE,
                                     transp.CNPJ_EMITENTE,
                                     transp.IE_EMITENTE,
                                     transp.ENDERECO_EMITENTE,
                                     transp.NUMERO_END_EMITENTE,
                                     transp.COMPLEMENTO_END_EMITENTE,
                                     transp.CEP_EMITENTE,
                                     transp.BAIRRO_EMITENTE,
                                     transp.CODIGO_MUNICIPIO_EMITENTE,
                                     DESCRICAO_CIDADE_EMITENTE = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_EMITENTE,
                                     DESCRICAO_ESTADO_EMITENTE = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.ENDERECO_RETIRADA_EMITENTE,
                                     transp.NUMERO_END_RETIRADA_EMITENTE,
                                     transp.COMPL_RETIRADA_EMITENTE,
                                     transp.CEP_RETIRADA_EMITENTE,
                                     transp.BAIRRO_RETIRADA_EMITENTE,
                                     transp.COD_MUNICIPIO_RETIRADA_EMITENTE,
                                     DESCRICAO_CIDADE_RETIRADA = transp.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     transp.ID_UF_RETIRADA_EMITENTE,
                                     DESCRICAO_ESTADO_RETIRADA = transp.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,

                                     transp.TELEFONE_EMITENTE,
                                     transp.FAX_EMITENTE,
                                     transp.OBS_EMITENTE,
                                     transp.EMAIL_EMITENTE,
                                     transp.NUMERO_NF_EMITENTE,
                                     transp.SERIE_NF_EMITENTE,
                                     transp.SITE_EMITENTE,
                                     transp.CRT_EMITENTE,
                                     transp.NUMERO_LOTE
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Emitente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("CODIGO_EMITENTE", item.CODIGO_EMITENTE);
                        dados.Add("NOME_EMITENTE", item.NOME_EMITENTE.Trim());
                        dados.Add("NOME_FANTASIA_EMITENTE", item.NOME_FANTASIA_EMITENTE.ToString().Trim());
                        dados.Add("CNPJ_EMITENTE", item.CNPJ_EMITENTE.ToString().Trim());
                        dados.Add("IE_EMITENTE", item.IE_EMITENTE.ToString().Trim());
                        dados.Add("ENDERECO_EMITENTE", item.ENDERECO_EMITENTE.ToString().Trim());

                        dados.Add("NUMERO_END_EMITENTE", item.NUMERO_END_EMITENTE.ToString().Trim());
                        dados.Add("COMPLEMENTO_END_EMITENTE", item.COMPLEMENTO_END_EMITENTE.ToString().Trim());

                        dados.Add("CEP_EMITENTE", item.CEP_EMITENTE.ToString().Trim());
                        dados.Add("BAIRRO_EMITENTE", item.BAIRRO_EMITENTE.ToString().Trim());
                        dados.Add("CODIGO_MUNICIPIO_EMITENTE", item.CODIGO_MUNICIPIO_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_EMITENTE", item.DESCRICAO_CIDADE_EMITENTE.Trim());

                        dados.Add("ID_UF_EMITENTE", item.ID_UF_EMITENTE.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_EMITENTE", item.DESCRICAO_ESTADO_EMITENTE.ToString().Trim());

                        dados.Add("ENDERECO_RETIRADA_EMITENTE", item.ENDERECO_RETIRADA_EMITENTE.Trim());
                        dados.Add("NUMERO_END_RETIRADA_EMITENTE", item.NUMERO_END_RETIRADA_EMITENTE.Trim());
                        dados.Add("COMPL_RETIRADA_EMITENTE", item.COMPL_RETIRADA_EMITENTE.Trim());
                        dados.Add("CEP_RETIRADA_EMITENTE", item.CEP_RETIRADA_EMITENTE.Trim());
                        dados.Add("BAIRRO_RETIRADA_EMITENTE", item.BAIRRO_RETIRADA_EMITENTE.Trim());
                        dados.Add("COD_MUNICIPIO_RETIRADA_EMITENTE", item.COD_MUNICIPIO_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_CIDADE_RETIRADA", item.DESCRICAO_CIDADE_RETIRADA.Trim());
                        dados.Add("ID_UF_RETIRADA_EMITENTE", item.ID_UF_RETIRADA_EMITENTE.ToString());
                        dados.Add("DESCRICAO_ESTADO_RETIRADA", item.DESCRICAO_ESTADO_RETIRADA.Trim());

                        dados.Add("TELEFONE_EMITENTE", item.TELEFONE_EMITENTE.ToString().Trim());

                        dados.Add("FAX_EMITENTE", item.FAX_EMITENTE.ToString().Trim());
                        dados.Add("OBS_EMITENTE", item.OBS_EMITENTE.ToString().Trim());

                        dados.Add("EMAIL_EMITENTE", item.EMAIL_EMITENTE.ToString().Trim());
                        dados.Add("NUMERO_NF_EMITENTE", item.NUMERO_NF_EMITENTE);
                        dados.Add("SERIE_NF_EMITENTE", item.SERIE_NF_EMITENTE.Trim());

                        dados.Add("NUMERO_LOTE", item.NUMERO_LOTE);

                        dados.Add("SITE_EMITENTE", item.SITE_EMITENTE.Trim());
                        dados.Add("CRT_EMITENTE", item.CRT_EMITENTE);
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
        public void GravaNovoEmitente(Dictionary<string, object> dados)
        {
            try
            {
                decimal ID_MUNICIPIO_RETIRADA = decimal.TryParse(dados["COD_MUNICIPIO_RETIRADA_EMITENTE"].ToString(), out ID_MUNICIPIO_RETIRADA) ?
                    Convert.ToDecimal(dados["COD_MUNICIPIO_RETIRADA_EMITENTE"]) : 0;

                decimal ID_UF_RETIRADA = decimal.TryParse(dados["ID_UF_RETIRADA_EMITENTE"].ToString(), out ID_UF_RETIRADA) ?
                    Convert.ToDecimal(dados["ID_UF_RETIRADA_EMITENTE"]) : 0;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_EMITENTE> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_EMITENTE>();

                    Doran_Servicos_ORM.TB_EMITENTE novo = new Doran_Servicos_ORM.TB_EMITENTE();

                    novo.NOME_EMITENTE = dados["NOME_EMITENTE"].ToString();
                    novo.NOME_FANTASIA_EMITENTE = dados["NOME_FANTASIA_EMITENTE"].ToString();
                    novo.CNPJ_EMITENTE = dados["CNPJ_EMITENTE"].ToString();
                    novo.IE_EMITENTE = dados["IE_EMITENTE"].ToString();

                    novo.ENDERECO_EMITENTE = dados["ENDERECO_EMITENTE"].ToString();
                    novo.NUMERO_END_EMITENTE = dados["NUMERO_END_EMITENTE"].ToString();
                    novo.COMPLEMENTO_END_EMITENTE = dados["COMPLEMENTO_END_EMITENTE"].ToString();

                    novo.CEP_EMITENTE = dados["CEP_EMITENTE"].ToString();
                    novo.BAIRRO_EMITENTE = dados["BAIRRO_EMITENTE"].ToString();
                    novo.CODIGO_MUNICIPIO_EMITENTE = Convert.ToDecimal(dados["CODIGO_MUNICIPIO_EMITENTE"]);
                    novo.ID_UF_EMITENTE = Convert.ToDecimal(dados["ID_UF_EMITENTE"]);

                    novo.ENDERECO_RETIRADA_EMITENTE = dados["ENDERECO_RETIRADA_EMITENTE"].ToString();
                    novo.NUMERO_END_RETIRADA_EMITENTE = dados["NUMERO_END_RETIRADA_EMITENTE"].ToString();
                    novo.COMPL_RETIRADA_EMITENTE = dados["COMPL_RETIRADA_EMITENTE"].ToString();
                    novo.CEP_RETIRADA_EMITENTE = dados["CEP_RETIRADA_EMITENTE"].ToString();
                    novo.BAIRRO_RETIRADA_EMITENTE = dados["BAIRRO_RETIRADA_EMITENTE"].ToString();
                    novo.COD_MUNICIPIO_RETIRADA_EMITENTE = ID_MUNICIPIO_RETIRADA;
                    novo.ID_UF_RETIRADA_EMITENTE = ID_UF_RETIRADA;

                    novo.TELEFONE_EMITENTE = dados["TELEFONE_EMITENTE"].ToString();

                    novo.FAX_EMITENTE = dados["FAX_EMITENTE"].ToString();
                    novo.OBS_EMITENTE = dados["OBS_EMITENTE"].ToString();

                    novo.EMAIL_EMITENTE = dados["EMAIL_EMITENTE"].ToString();

                    novo.NUMERO_NF_EMITENTE = Convert.ToDecimal(dados["NUMERO_NF_EMITENTE"]);
                    novo.SERIE_NF_EMITENTE = dados["SERIE_NF_EMITENTE"].ToString();

                    novo.SITE_EMITENTE = dados["SITE_EMITENTE"].ToString();
                    novo.CRT_EMITENTE = Convert.ToDecimal(dados["CRT_EMITENTE"]);

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
        public void AtualizaEmitente(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_EMITENTEs
                                 where item.CODIGO_EMITENTE == Convert.ToDecimal(dados["CODIGO_EMITENTE"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o Emitente com o ID [" + dados["CODIGO_EMITENTE"].ToString() + "]");

                    decimal ID_MUNICIPIO_RETIRADA = decimal.TryParse(dados["COD_MUNICIPIO_RETIRADA_EMITENTE"].ToString(), out ID_MUNICIPIO_RETIRADA) ?
                        Convert.ToDecimal(dados["COD_MUNICIPIO_RETIRADA_EMITENTE"]) : 0;

                    decimal ID_UF_RETIRADA = decimal.TryParse(dados["ID_UF_RETIRADA_EMITENTE"].ToString(), out ID_UF_RETIRADA) ?
                        Convert.ToDecimal(dados["ID_UF_RETIRADA_EMITENTE"]) : 0;

                    foreach (var novo in query)
                    {
                        novo.NOME_EMITENTE = dados["NOME_EMITENTE"].ToString();
                        novo.NOME_FANTASIA_EMITENTE = dados["NOME_FANTASIA_EMITENTE"].ToString();
                        novo.CNPJ_EMITENTE = dados["CNPJ_EMITENTE"].ToString();
                        novo.IE_EMITENTE = dados["IE_EMITENTE"].ToString();

                        novo.ENDERECO_EMITENTE = dados["ENDERECO_EMITENTE"].ToString();
                        novo.NUMERO_END_EMITENTE = dados["NUMERO_END_EMITENTE"].ToString();
                        novo.COMPLEMENTO_END_EMITENTE = dados["COMPLEMENTO_END_EMITENTE"].ToString();

                        novo.CEP_EMITENTE = dados["CEP_EMITENTE"].ToString();
                        novo.BAIRRO_EMITENTE = dados["BAIRRO_EMITENTE"].ToString();
                        novo.CODIGO_MUNICIPIO_EMITENTE = Convert.ToDecimal(dados["CODIGO_MUNICIPIO_EMITENTE"]);
                        novo.ID_UF_EMITENTE = Convert.ToDecimal(dados["ID_UF_EMITENTE"]);

                        novo.ENDERECO_RETIRADA_EMITENTE = dados["ENDERECO_RETIRADA_EMITENTE"].ToString();
                        novo.NUMERO_END_RETIRADA_EMITENTE = dados["NUMERO_END_RETIRADA_EMITENTE"].ToString();
                        novo.COMPL_RETIRADA_EMITENTE = dados["COMPL_RETIRADA_EMITENTE"].ToString();
                        novo.CEP_RETIRADA_EMITENTE = dados["CEP_RETIRADA_EMITENTE"].ToString();
                        novo.BAIRRO_RETIRADA_EMITENTE = dados["BAIRRO_RETIRADA_EMITENTE"].ToString();
                        novo.COD_MUNICIPIO_RETIRADA_EMITENTE = ID_MUNICIPIO_RETIRADA;
                        novo.ID_UF_RETIRADA_EMITENTE = ID_UF_RETIRADA;

                        novo.TELEFONE_EMITENTE = dados["TELEFONE_EMITENTE"].ToString();

                        novo.FAX_EMITENTE = dados["FAX_EMITENTE"].ToString();
                        novo.OBS_EMITENTE = dados["OBS_EMITENTE"].ToString();

                        novo.EMAIL_EMITENTE = dados["EMAIL_EMITENTE"].ToString();

                        novo.NUMERO_NF_EMITENTE = Convert.ToDecimal(dados["NUMERO_NF_EMITENTE"]);
                        novo.SERIE_NF_EMITENTE = dados["SERIE_NF_EMITENTE"].ToString();

                        novo.SITE_EMITENTE = dados["SITE_EMITENTE"].ToString();
                        novo.CRT_EMITENTE = Convert.ToDecimal(dados["CRT_EMITENTE"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_EMITENTEs.GetModifiedMembers(novo),
                            "TB_EMITENTE", Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaEmitente(int CODIGO_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_EMITENTEs
                                 where item.CODIGO_EMITENTE == CODIGO_EMITENTE
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_EMITENTEs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, "TB_EMITENTE", ID_USUARIO);
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
        public string CarregaComboEmitente(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from transp in ctx.TB_EMITENTEs
                                 select new
                                 {
                                     transp.CODIGO_EMITENTE,
                                     transp.NOME_FANTASIA_EMITENTE
                                 };

                    string retorno = ApoioXML.objQueryToXML(ctx, query1);
                    return retorno;
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