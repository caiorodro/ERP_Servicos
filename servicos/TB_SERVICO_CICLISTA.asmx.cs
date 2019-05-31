using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;

// 400.422.668-66

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_SERVICO_CICLISTA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_SERVICO_CICLISTA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Ciclista_Servico(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_SERVICO_CICLISTAs
                                 where cs.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"])
                                 && cs.NUMERO_ITEM_VENDA == Convert.ToDecimal(dados["NUMERO_ITEM_VENDA"])

                                 select new
                                 {
                                     cs.ID_CICLISTA,
                                     cs.NUMERO_PEDIDO_VENDA,
                                     cs.NUMERO_ITEM_VENDA,
                                     cs.TB_CICLISTA.NOME_CICLISTA
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
        public void GravaNovoServico(List<decimal> NUMEROS_PEDIDO, List<decimal> NUMEROS_ITEM, List<decimal> IDS_CICLISTAS, decimal ID_USUARIO)
        {
            try
            {
                for (int i = 0; i < IDS_CICLISTAS.Count; i++)
                {
                    for (int n = 0; n < NUMEROS_PEDIDO.Count; n++)
                    {
                        using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                        {
                            if (!(from linha in ctx.TB_SERVICO_CICLISTAs
                                  where linha.NUMERO_PEDIDO_VENDA == NUMEROS_PEDIDO[n]
                                  && linha.NUMERO_ITEM_VENDA == NUMEROS_ITEM[n]
                                  && linha.ID_CICLISTA == IDS_CICLISTAS[i]
                                  select linha).Any())
                            {
                                System.Data.Linq.Table<Doran_Servicos_ORM.TB_SERVICO_CICLISTA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_SERVICO_CICLISTA>();

                                Doran_Servicos_ORM.TB_SERVICO_CICLISTA novo = new Doran_Servicos_ORM.TB_SERVICO_CICLISTA();

                                novo.NUMERO_PEDIDO_VENDA = NUMEROS_PEDIDO[n];
                                novo.NUMERO_ITEM_VENDA = NUMEROS_ITEM[n];
                                novo.ID_CICLISTA = IDS_CICLISTAS[i];

                                Entidade.InsertOnSubmit(novo);

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, "TB_SERVICO_CICLISTA", ID_USUARIO);
                            }

                            ctx.SubmitChanges();
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
        public void DeletaServicoCiclista(List<decimal> NUMEROS_PEDIDO, List<decimal> NUMEROS_ITEM, List<decimal> IDS_CICLISTAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_SERVICO_CICLISTAs
                                 where NUMEROS_PEDIDO.Contains(item.NUMERO_PEDIDO_VENDA)
                                 && NUMEROS_ITEM.Contains(item.NUMERO_ITEM_VENDA)
                                 && IDS_CICLISTAS.Contains(item.ID_CICLISTA)
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_SERVICO_CICLISTAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_SERVICO_CICLISTAs.ToString(), ID_USUARIO);
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