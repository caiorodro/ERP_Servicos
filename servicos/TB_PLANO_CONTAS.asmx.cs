using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_PLANO_CONTAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_PLANO_CONTAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_PLANO_CONTAS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from familia in ctx.TB_PLANO_CONTAs
                                where familia.DESCRICAO_PLANO.Contains(dados["pesquisa"].ToString())
                                select new
                                {
                                    familia.ID_PLANO,
                                    familia.DESCRICAO_PLANO,
                                    familia.PAI_PLANO
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoPlano(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    string pai = dados["PAI_PLANO"].ToString();

                    if (pai.Trim().Length > 0)
                        if (!ExisteID(pai))
                            throw new Exception("O Campo [Pertencente ao plano] deve ser um ID de plano previamente cadastrado");

                    System.Data.Linq.Table<TB_PLANO_CONTA> Entidade = ctx.GetTable<TB_PLANO_CONTA>();

                    TB_PLANO_CONTA novo = new TB_PLANO_CONTA();

                    novo.ID_PLANO = dados["ID_PLANO"].ToString();
                    novo.DESCRICAO_PLANO = dados["DESCRICAO_PLANO"].ToString();
                    novo.PAI_PLANO = pai;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria.Th2_Auditoria.Audita_Insert(ctx, novo, "TB_PLANO_CONTAS", Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void AtualizaPlano(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    string pai = dados["PAI_PLANO"].ToString();

                    if (pai.Trim().Length > 0)
                        if (!ExisteID(pai))
                            throw new Exception("O Campo [Pertencente ao plano] deve ser um ID de plano previamente cadastrado");

                    var query = (from item in ctx.TB_PLANO_CONTAs
                                 where item.ID_PLANO == dados["ID_PLANO"].ToString()
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o plano com o ID [" + dados["ID_PLANO"].ToString() + "]");

                    foreach (var familia in query)
                    {
                        familia.DESCRICAO_PLANO = dados["DESCRICAO_PLANO"].ToString();
                        familia.PAI_PLANO = pai;

                        Doran_Base.Auditoria.Th2_Auditoria.Audita_Update(ctx, ctx.TB_PLANO_CONTAs.GetModifiedMembers(familia),
                            "TB_PLANO_CONTAS", Convert.ToDecimal(dados["ID_USUARIO"]));

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
        public void DeletaPlano(string ID_PLANO, decimal ID_USUARIO)
        {
            try
            {
                if (PlanoComFilhos(ID_PLANO))
                    throw new Exception("Este plano cont&eacute;m planos associados. N&atilde;o &eacute; poss&iacute;vel deletar"); 

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_PLANO_CONTAs
                                 where item.ID_PLANO == ID_PLANO
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o plano com o ID [" + ID_PLANO + "]");

                    foreach (var linha in query)
                    {
                        ctx.TB_PLANO_CONTAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria.Th2_Auditoria.Audita_Delete(ctx, linha, "TB_PLANO_CONTAS", ID_USUARIO);
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
        public Dictionary<string, object> BuscaPorID(string ID_PLANO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from familia in ctx.TB_PLANO_CONTAs
                                 where familia.ID_PLANO == ID_PLANO
                                 select familia).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Plano n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_PLANO", item.ID_PLANO);
                        dados.Add("DESCRICAO_PLANO", item.DESCRICAO_PLANO.Trim());
                        dados.Add("PAI_PLANO", item.PAI_PLANO);
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
        public List<Dictionary<string, object>> BuscaPlanosPorParente(string PAI_PLANO, decimal ID_USUARIO)
        {
            List<Dictionary<string, object>> retorno = new List<Dictionary<string, object>>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from familia in ctx.TB_PLANO_CONTAs
                             where familia.PAI_PLANO == PAI_PLANO
                             orderby familia.PAI_PLANO
                             select familia).ToList();

                foreach (var item in query)
                {
                    Dictionary<string, object> nova = new Dictionary<string, object>();

                    nova.Add("ID_PLANO", item.ID_PLANO);
                    nova.Add("DESCRICAO_PLANO", item.DESCRICAO_PLANO.Trim());

                    retorno.Add(nova);
                }
            }

            return retorno;
        }

        private bool ExisteID(string ID)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var existe = (from familia in ctx.TB_PLANO_CONTAs
                              where familia.ID_PLANO == ID
                              select familia).Count();

                return existe > 0 ? true : false;
            }
        }

        private bool PlanoComFilhos(string PAI_PLANO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PLANO_CONTAs
                             where linha.PAI_PLANO == PAI_PLANO
                             select linha).Count();

                return query > 0 ? true : false;
            }
        }
    }
}