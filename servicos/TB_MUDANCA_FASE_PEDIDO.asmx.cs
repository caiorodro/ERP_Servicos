using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_MUDANCA_FASE_PEDIDO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_MUDANCA_FASE_PEDIDO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_Mudanca_de_Fases_do_Pedido(decimal NUMERO_PEDIDO_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO_VENDA
                                select new
                                {
                                    linha.NUMERO_PEDIDO_VENDA,
                                    linha.NUMERO_ITEM_VENDA,
                                    linha.DATA_MUDANCA,
                                    linha.ID_USUARIO,
                                    linha.TB_USUARIO.LOGIN_USUARIO,
                                    linha.ID_STATUS_ANTERIOR,
                                    DESCRICAO_ANTERIOR = linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    COR_FUNDO_ANTERIOR = linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    COR_LETRA_ANTERIOR = linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,

                                    linha.ID_STATUS_NOVO,
                                    DESCRICAO_NOVO = linha.TB_STATUS_PEDIDO1.DESCRICAO_STATUS_PEDIDO,
                                    COR_FUNDO_NOVO = linha.TB_STATUS_PEDIDO1.COR_STATUS,
                                    COR_LETRA_NOVO = linha.TB_STATUS_PEDIDO1.COR_FONTE_STATUS,

                                    CODIGO_PRODUTO = linha.TB_PEDIDO_VENDA.CODIGO_PRODUTO_PEDIDO
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
