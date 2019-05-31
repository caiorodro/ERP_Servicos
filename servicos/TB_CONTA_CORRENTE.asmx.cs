using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CONTA_CORRENTE
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CONTA_CORRENTE : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Conta_Corrente(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_CONTA_CORRENTEs
                                select new
                                {
                                    item.NUMERO_AGENCIA,
                                    item.NUMERO_CONTA,
                                    item.NUMERO_BANCO,
                                    item.TB_BANCO.NOME_BANCO,
                                    item.ULTIMA_REMESSA,
                                    item.CONTROLE_NOSSO_NUMERO
                                };

                    if (Convert.ToDecimal(dados["NUMERO_BANCO"]) > 0)
                        query = query.Where(B => B.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"]));

                    if (dados["NUMERO_AGENCIA"].ToString().Trim().Length > 0)
                        query = query.Where(B => B.NUMERO_AGENCIA == dados["NUMERO_AGENCIA"].ToString());

                    if (dados["NUMERO_CONTA"].ToString().Trim().Length > 0)
                        query = query.Where(B => B.NUMERO_CONTA == dados["NUMERO_CONTA"].ToString());

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
        public Dictionary<string, object> Busca_Conta_Corrente(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CONTA_CORRENTEs
                                where item.NUMERO_AGENCIA == dados["NUMERO_AGENCIA"].ToString()
                                && item.NUMERO_CONTA == dados["NUMERO_CONTA"].ToString()
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Conta corrente n&atilde;o encontrada");

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var linha in query)
                    {
                        retorno.Add("NUMERO_BANCO", linha.NUMERO_BANCO);
                        retorno.Add("ULTIMA_REMESSA", linha.ULTIMA_REMESSA);
                    }

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
        public void GravaNovaConta(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_CONTA_CORRENTE> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CONTA_CORRENTE>();

                    Doran_Servicos_ORM.TB_CONTA_CORRENTE novo = new Doran_Servicos_ORM.TB_CONTA_CORRENTE();

                    novo.NUMERO_AGENCIA = dados["NUMERO_AGENCIA"].ToString();
                    novo.NUMERO_CONTA = dados["NUMERO_CONTA"].ToString();
                    novo.NUMERO_BANCO = Convert.ToDecimal(dados["NUMERO_BANCO"]);
                    novo.ULTIMA_REMESSA = Convert.ToDecimal(dados["ULTIMA_REMESSA"]);
                    novo.CONTROLE_NOSSO_NUMERO = dados["CONTROLE_NOSSO_NUMERO"].ToString();
                    
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
        public void AtualizaConta(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CONTA_CORRENTEs
                                 where item.NUMERO_AGENCIA == dados["NUMERO_AGENCIA"].ToString()
                                 && item.NUMERO_CONTA == dados["NUMERO_CONTA"].ToString()
                                 select item).ToList();

                    foreach (var uf in query)
                    {
                        uf.NUMERO_BANCO = Convert.ToDecimal(dados["NUMERO_BANCO"]);
                        uf.ULTIMA_REMESSA = Convert.ToDecimal(dados["ULTIMA_REMESSA"]);
                        uf.CONTROLE_NOSSO_NUMERO = dados["CONTROLE_NOSSO_NUMERO"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CONTA_CORRENTEs.GetModifiedMembers(uf),
                            ctx.TB_CONTA_CORRENTEs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaConta(string NUMERO_AGENCIA, string NUMERO_CONTA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CONTA_CORRENTEs
                                 where item.NUMERO_AGENCIA == NUMERO_AGENCIA
                                 && item.NUMERO_CONTA == NUMERO_CONTA
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_CONTA_CORRENTEs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CONTA_CORRENTEs.ToString(), ID_USUARIO);
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
        public string Lista_Agencia(decimal NUMERO_BANCO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_CONTA_CORRENTEs
                                where item.NUMERO_BANCO == NUMERO_BANCO
                                select new
                                {
                                    item.NUMERO_AGENCIA,
                                    item.NUMERO_CONTA,
                                    AGENCIA_CONTA = string.Concat(item.NUMERO_AGENCIA.Trim(), " - ", item.NUMERO_CONTA.Trim()),
                                    item.NUMERO_BANCO
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
        public string Lista_Instrucao_Remessa(decimal NUMERO_BANCO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {

                    var query = from item in ctx.TB_OCORRENCIA_BANCARIA_REMESSAs
                                where item.NUMERO_BANCO == NUMERO_BANCO
                                select new
                                {
                                    item.NUMERO_BANCO,
                                    item.COD_OCORRENCIA,
                                    item.DESCRICAO_OCORRENCIA
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