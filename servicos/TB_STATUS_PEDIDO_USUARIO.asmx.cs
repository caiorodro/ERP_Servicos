using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_ERP_Servicos.classes;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_STATUS_PEDIDO_USUARIO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_STATUS_PEDIDO_USUARIO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_STATUS_PEDIDO(decimal GERENTE_COMERCIAL, decimal ADMIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDO_USUARIOs
                                select uf;

                    if (GERENTE_COMERCIAL == 0 && ADMIN_USUARIO == 0)
                        query = query.Where(id => id.ID_USUARIO_STATUS == ID_USUARIO);

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
        public void CadastraStatusParaUmUsuario(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_STATUS_PEDIDOs
                                 orderby linha.CODIGO_STATUS_PEDIDO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        var existe = (from linha in ctx.TB_STATUS_PEDIDO_USUARIOs
                                      where linha.CODIGO_STATUS_PEDIDO == item.CODIGO_STATUS_PEDIDO
                                      && linha.ID_USUARIO_STATUS == ID_USUARIO
                                      select linha).Count();

                        if (existe == 0)
                        {
                            System.Data.Linq.Table<Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO>();

                            Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO novo = new Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO();

                            novo.CODIGO_STATUS_PEDIDO = item.CODIGO_STATUS_PEDIDO;
                            novo.ID_USUARIO_STATUS = ID_USUARIO;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
                        }
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
        public void GravaNovoStatusUsuario(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO>();

                    Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO novo = new Doran_Servicos_ORM.TB_STATUS_PEDIDO_USUARIO();

                    novo.CODIGO_STATUS_PEDIDO = Convert.ToDecimal(dados["CODIGO_STATUS_PEDIDO"]);
                    novo.ID_USUARIO_STATUS = Convert.ToDecimal(dados["ID_USUARIO_STATUS"]);

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
        public void DeletaStatusUsuario(decimal CODIGO_STATUS_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_STATUS_PEDIDO_USUARIOs
                                 where item.CODIGO_STATUS_PEDIDO == CODIGO_STATUS_PEDIDO
                                 && item.ID_USUARIO_STATUS == ID_USUARIO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_STATUS_PEDIDO_USUARIOs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_STATUS_PEDIDO_USUARIOs.ToString(), ID_USUARIO);
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
        public string Carrega_STATUS_USUARIO(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from uf in ctx.TB_STATUS_PEDIDO_USUARIOs
                                where uf.ID_USUARIO_STATUS == Convert.ToDecimal(dados["ID_USUARIO"])
                                || Convert.ToDecimal(dados["ID_USUARIO"]) == 0
                                orderby uf.ID_USUARIO_STATUS
                                select new
                                {
                                    uf.ID_USUARIO_STATUS,
                                    uf.TB_USUARIO.LOGIN_USUARIO,
                                    uf.TB_USUARIO.NOME_USUARIO,
                                    uf.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    uf.CODIGO_STATUS_PEDIDO
                                };

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
        public string Carrega_Status(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_STATUS_PEDIDOs
                                 orderby linha.CODIGO_STATUS_PEDIDO
                                 select linha;

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