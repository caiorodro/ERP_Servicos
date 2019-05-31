using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CLIENTE_CONTATO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class TB_CLIENTE_CONTATO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_CLIENTE_CONTATO(decimal ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from contato in ctx.TB_CLIENTE_CONTATOs
                                where contato.ID_CLIENTE == ID_CLIENTE
                                select contato;

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
        public Dictionary<string, object> BuscaPorID(int ID_CONTATO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from contato in ctx.TB_CLIENTE_CONTATOs
                                 where contato.ID_CONTATO == ID_CONTATO
                                 select contato).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Contato de cliente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_CLIENTE", item.ID_CLIENTE);
                        dados.Add("ID_CONTATO", item.ID_CONTATO);
                        dados.Add("NOME_CONTATO_CLIENTE", item.NOME_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("TELEFONE_CONTATO_CLIENTE", item.TELEFONE_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("FAX_CONTATO_CLIENTE", item.FAX_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("EMAIL_CONTATO_CLIENTE", item.EMAIL_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("OBS_CONTATO_CLIENTE", item.OBS_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("RECEBE_COPIA_NOTA_ELETRONICA", item.RECEBE_COPIA_NOTA_ELETRONICA);
                        dados.Add("SENHA_PORTAL", !string.IsNullOrEmpty(item.SENHA_PORTAL) ? item.SENHA_PORTAL.Trim() : string.Empty);
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
        public Dictionary<string, object> BuscaPorNome(string NOME, decimal ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from contato in ctx.TB_CLIENTE_CONTATOs
                                 where contato.NOME_CONTATO_CLIENTE == NOME &&
                                 contato.ID_CLIENTE == ID_CLIENTE
                                 select contato).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Contato de cliente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_CLIENTE", item.ID_CLIENTE);
                        dados.Add("ID_CONTATO", item.ID_CONTATO);
                        dados.Add("NOME_CONTATO_CLIENTE", item.NOME_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("TELEFONE_CONTATO_CLIENTE", item.TELEFONE_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("FAX_CONTATO_CLIENTE", item.FAX_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("EMAIL_CONTATO_CLIENTE", item.EMAIL_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("OBS_CONTATO_CLIENTE", item.OBS_CONTATO_CLIENTE.ToString().Trim());
                        dados.Add("RECEBE_COPIA_NOTA_ELETRONICA", item.RECEBE_COPIA_NOTA_ELETRONICA);
                        dados.Add("SENHA_PORTAL", !string.IsNullOrEmpty(item.SENHA_PORTAL) ? item.SENHA_PORTAL.Trim() : string.Empty);
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
        public void GravaNovoContato(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_CLIENTE_CONTATO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE_CONTATO>();

                    Doran_Servicos_ORM.TB_CLIENTE_CONTATO novo = new Doran_Servicos_ORM.TB_CLIENTE_CONTATO();

                    novo.ID_CLIENTE = Convert.ToDecimal(dados["ID_CLIENTE"]);
                    novo.NOME_CONTATO_CLIENTE = dados["NOME_CONTATO_CLIENTE"].ToString();
                    novo.TELEFONE_CONTATO_CLIENTE = dados["TELEFONE_CONTATO_CLIENTE"].ToString();
                    novo.FAX_CONTATO_CLIENTE = dados["FAX_CONTATO_CLIENTE"].ToString();
                    novo.EMAIL_CONTATO_CLIENTE = dados["EMAIL_CONTATO_CLIENTE"].ToString();
                    novo.OBS_CONTATO_CLIENTE = dados["OBS_CONTATO_CLIENTE"].ToString();
                    novo.RECEBE_COPIA_NOTA_ELETRONICA = Convert.ToDecimal(dados["RECEBE_COPIA_NOTA_ELETRONICA"]);
                    novo.SENHA_PORTAL = dados["SENHA_PORTAL"].ToString();

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
        public void AtualizaContato(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CLIENTE_CONTATOs
                                 where item.ID_CONTATO == Convert.ToDecimal(dados["ID_CONTATO"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o contato com o ID [" + dados["ID_CONTATO"].ToString() + "]");

                    foreach (var contato in query)
                    {
                        contato.NOME_CONTATO_CLIENTE = dados["NOME_CONTATO_CLIENTE"].ToString();
                        contato.TELEFONE_CONTATO_CLIENTE = dados["TELEFONE_CONTATO_CLIENTE"].ToString();
                        contato.FAX_CONTATO_CLIENTE = dados["FAX_CONTATO_CLIENTE"].ToString();
                        contato.EMAIL_CONTATO_CLIENTE = dados["EMAIL_CONTATO_CLIENTE"].ToString();
                        contato.OBS_CONTATO_CLIENTE = dados["OBS_CONTATO_CLIENTE"].ToString();
                        contato.RECEBE_COPIA_NOTA_ELETRONICA = Convert.ToDecimal(dados["RECEBE_COPIA_NOTA_ELETRONICA"]);
                        contato.SENHA_PORTAL = dados["SENHA_PORTAL"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CLIENTE_CONTATOs.GetModifiedMembers(contato),
                            ctx.TB_CLIENTE_CONTATOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaContato(int ID_CONTATO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_CLIENTE_CONTATOs
                                where item.ID_CONTATO == ID_CONTATO
                                select item;

                    foreach (var linha in query)
                    {
                        ctx.TB_CLIENTE_CONTATOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CLIENTE_CONTATOs.ToString(), ID_USUARIO);
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