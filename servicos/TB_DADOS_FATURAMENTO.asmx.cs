using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using System.Data;
using Doran_Base.Auditoria;
using Doran_Base;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_DADOS_FATURAMENTO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_DADOS_FATURAMENTO : System.Web.Services.WebService
    {
        [WebMethod()]
        public Dictionary<string, object> BUSCA_DADOS_FATURAMENTO(decimal NUMERO_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_DADOS_FATURAMENTOs
                                 where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                 select linha).ToList();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        retorno.Add("NUMERACAO", item.NUMERACAO.Trim());
                        retorno.Add("ESPECIE", item.ESPECIE.Trim());
                        retorno.Add("MARCA", item.MARCA.Trim());
                        retorno.Add("QTDE_NF", item.QTDE_NF);
                        retorno.Add("NUMERO_PEDIDO_CLIENTE", item.NUMERO_PEDIDO_CLIENTE.Trim());
                        retorno.Add("OBS_NF", item.OBS_NF.Trim());
                        retorno.Add("CODIGO_COND_PAGTO", item.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO);
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
        public void Grava_Dados_Faturamento(Dictionary<string, object> dados)
        {
            try
            {
                decimal NUMERO_PEDIDO_VENDA = 0;
                
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_DADOS_FATURAMENTOs
                                 where item.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                 select item).ToList();

                    if (!query.Any())
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO>();

                        Doran_Servicos_ORM.TB_DADOS_FATURAMENTO novo = new Doran_Servicos_ORM.TB_DADOS_FATURAMENTO();

                        novo.NUMERO_PEDIDO = Convert.ToDecimal(dados["NUMERO_PEDIDO"]);
                        novo.NUMERACAO = dados["NUMERACAO"].ToString();
                        novo.ESPECIE = dados["ESPECIE"].ToString();
                        novo.MARCA = dados["MARCA"].ToString();
                        novo.QTDE_NF = Convert.ToDecimal(dados["QTDE_NF"]);
                        novo.NUMERO_PEDIDO_CLIENTE = dados["NUMERO_PEDIDO_CLIENTE"].ToString();
                        novo.OBS_NF = dados["OBS_NF"].ToString();

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                    }
                    else
                    {
                        foreach (var item in query)
                        {
                            item.NUMERACAO = dados["NUMERACAO"].ToString();
                            item.ESPECIE = dados["ESPECIE"].ToString();
                            item.MARCA = dados["MARCA"].ToString();
                            item.QTDE_NF = Convert.ToDecimal(dados["QTDE_NF"]);
                            item.NUMERO_PEDIDO_CLIENTE = dados["NUMERO_PEDIDO_CLIENTE"].ToString();
                            item.OBS_NF = dados["OBS_NF"].ToString();

                            if (Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]) != item.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO)
                            {
                                Atualiza_Condicao_Pagamento(Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]),
                                    item.TB_PEDIDO_VENDA.NUMERO_ORCAMENTO, ctx, Convert.ToDecimal(dados["ID_USUARIO"]));

                                NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO.Value;
                            }

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_DADOS_FATURAMENTOs.GetModifiedMembers(item),
                                ctx.TB_DADOS_FATURAMENTOs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                        }
                    }

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
        public string Lista_CFOP_UF(decimal ID_UF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_UF_CFOPs
                                where linha.ID_UF == ID_UF &&
                                (linha.CODIGO_CFOP_UF.StartsWith("5") ||
                                linha.CODIGO_CFOP_UF.StartsWith("6") ||
                                linha.CODIGO_CFOP_UF.StartsWith("7"))

                                select new
                                {
                                    CODIGO_CFOP = linha.CODIGO_CFOP_UF,
                                    linha.TB_CFOP.DESCRICAO_CFOP
                                };

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

                    foreach (DataRow dr in dt.Rows)
                    {
                        dr["DESCRICAO_CFOP"] = string.Concat(dr["CODIGO_CFOP"].ToString().Trim(), " - ",
                            dr["DESCRICAO_CFOP"].ToString().Trim());
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    dt.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private void Atualiza_Condicao_Pagamento(decimal CODIGO_COND_PAGTO, decimal? NUMERO_ORCAMENTO, Doran_ERP_Servicos_DadosDataContext ctx,
            decimal ID_USUARIO)
        {
            var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                         where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                         select linha).ToList();

            foreach (var item in query)
            {
                item.CODIGO_COND_PAGTO = CODIGO_COND_PAGTO;

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                    ctx.TB_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
            }
        }
    }
}
