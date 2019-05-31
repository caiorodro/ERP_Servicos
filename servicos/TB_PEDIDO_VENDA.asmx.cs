using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Collections;
using System.Data.Linq;
using Doran_Servicos_ORM;
using System.Configuration;
using System.IO;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_ERP_Servicos.classes;
using System.Data.SqlClient;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_PEDIDO_VENDA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_PEDIDO_VENDA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_Itens_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    DateTime _data = new DateTime();

                    if (!DateTime.TryParse(dados["DATA_PEDIDO"].ToString(), out _data))
                        throw new Exception("Filtro da data de emiss&atilde;o do servi&ccedil;o inv&aacute;lido. <br />Digite a data no formato DD/MM/YYYY");

                    if (Convert.ToDecimal(dados["NUMERO_NF"]) > 0)
                    {
                        var query = from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                    orderby linha.TB_NOTA_SAIDA.NUMERO_NF
                                    where linha.TB_NOTA_SAIDA.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF"])

                                    select new
                                   {
                                       linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.STATUS_ITEM_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.COR_STATUS,
                                       linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                       linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                       linha.TB_PEDIDO_VENDA.ITEM_A_FATURAR,
                                       linha.TB_PEDIDO_VENDA.ID_USUARIO_ITEM_A_FATURAR,
                                       linha.TB_PEDIDO_VENDA.NUMERO_ITEM,
                                       linha.TB_PEDIDO_VENDA.DATA_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.ENTREGA_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.CODIGO_PRODUTO_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.QTDE_A_FATURAR,
                                       linha.TB_PEDIDO_VENDA.UNIDADE_ITEM_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.PRECO_ITEM_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.VALOR_TOTAL_ITEM_PEDIDO,
                                       VALOR_ISS_ITEM_PEDIDO = Math.Round(linha.TB_PEDIDO_VENDA.VALOR_TOTAL_ITEM_PEDIDO.Value * (linha.TB_PEDIDO_VENDA.ALIQ_ISS_ITEM_PEDIDO.Value / 100), 2, MidpointRounding.ToEven),

                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                       linha.TB_PEDIDO_VENDA.OBS_ITEM_PEDIDO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.OBS_ITEM_ORCAMENTO,

                                       ATRASADA = linha.TB_PEDIDO_VENDA.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,

                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.CEP_INICIAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.CIDADE_INICIAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.ESTADO_INICIAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_INICIAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.NUMERO_INICIAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.COMPL_INICIAL_ITEM_ORCAMENTO,

                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.CEP_FINAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.CIDADE_FINAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.ESTADO_FINAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_FINAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.NUMERO_FINAL_ITEM_ORCAMENTO,
                                       linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.COMPL_FINAL_ITEM_ORCAMENTO,

                                       DATA_FATURAMENTO = linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF,

                                       VALOR_TOTAL = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                      where linha1.NUMERO_PEDIDO == linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO
                                                      && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                      select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                       VALOR_ISS = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                    where linha1.NUMERO_PEDIDO == linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO
                                                    && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                    select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO * (t.ALIQ_ISS_ITEM_PEDIDO / 100)),

                                       TOTAL_PEDIDO = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                       where linha1.NUMERO_PEDIDO == linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO
                                                       && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                       select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                       FOLLOW_UP_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_PEDIDOs
                                                           orderby linha1.NUMERO_PEDIDO
                                                           where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                           && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                           select linha1).Count(),

                                       FOLLOW_UP_ITEM_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs
                                                                orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM
                                                                where (linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                                && linha1.NUMERO_ITEM == linha.NUMERO_ITEM_PEDIDO_VENDA)
                                                                && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                                select linha1).Count(),

                                       CICLISTA = (from linha1 in ctx.TB_SERVICO_CICLISTAs
                                                   where linha1.NUMERO_PEDIDO_VENDA == linha.TB_PEDIDO_VENDA.NUMERO_PEDIDO
                                                   && linha1.NUMERO_ITEM_VENDA == linha.TB_PEDIDO_VENDA.NUMERO_ITEM
                                                   select linha1).Any() ? 1 : 0
                                   };

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        return ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                    else
                    {
                        List<decimal?> status = new List<decimal?>();

                        if (dados.ContainsKey("STATUS"))
                        {
                            var s = dados["STATUS"];

                            if (s.GetType() == typeof(object[]))
                            {
                                for (int i = 0; i < ((object[])dados["STATUS"]).Length; i++)
                                {
                                    decimal x = 0;

                                    if (decimal.TryParse(((object[])dados["STATUS"])[i].ToString(), out x))
                                    {
                                        status.Add(Convert.ToDecimal(((object[])dados["STATUS"])[i]));
                                    }
                                }
                            }
                        }

                        var query = from linha in ctx.TB_PEDIDO_VENDAs
                                    orderby linha.DATA_PEDIDO, linha.NUMERO_PEDIDO

                                    where linha.DATA_PEDIDO >= Convert.ToDateTime(dados["DATA_PEDIDO"])

                                    && (linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                    || Convert.ToDecimal(dados["NUMERO_PEDIDO"]) == 0)

                                    && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Contains(dados["CLIENTE"].ToString())
                                    || linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["CLIENTE"].ToString()))

                                    && linha.CODIGO_PRODUTO_PEDIDO.Contains(dados["CODIGO_PRODUTO"].ToString())

                                    && (status.Contains(linha.STATUS_ITEM_PEDIDO) || status.Count == 0)

                                    select new
                                    {
                                        linha.NUMERO_PEDIDO,
                                        linha.STATUS_ITEM_PEDIDO,
                                        linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                        linha.TB_STATUS_PEDIDO.COR_STATUS,
                                        linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                        linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                        linha.ITEM_A_FATURAR,
                                        linha.ID_USUARIO_ITEM_A_FATURAR,
                                        linha.NUMERO_ITEM,
                                        linha.DATA_PEDIDO,
                                        linha.ENTREGA_PEDIDO,
                                        linha.CODIGO_PRODUTO_PEDIDO,
                                        linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                        linha.QTDE_A_FATURAR,
                                        linha.UNIDADE_ITEM_PEDIDO,
                                        linha.PRECO_ITEM_PEDIDO,
                                        linha.ALIQ_ISS_ITEM_PEDIDO,
                                        linha.VALOR_TOTAL_ITEM_PEDIDO,
                                        VALOR_ISS_ITEM_PEDIDO = Math.Round(linha.VALOR_TOTAL_ITEM_PEDIDO.Value * (linha.ALIQ_ISS_ITEM_PEDIDO.Value / 100), 2, MidpointRounding.ToEven),

                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                        linha.OBS_ITEM_PEDIDO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                        ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,

                                        linha.TB_ITEM_ORCAMENTO_VENDA.OBS_ITEM_ORCAMENTO,

                                        linha.TB_ITEM_ORCAMENTO_VENDA.CEP_INICIAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_INICIAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_INICIAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_INICIAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_INICIAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.COMPL_INICIAL_ITEM_ORCAMENTO,

                                        linha.TB_ITEM_ORCAMENTO_VENDA.CEP_FINAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_FINAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_FINAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_FINAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_FINAL_ITEM_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.COMPL_FINAL_ITEM_ORCAMENTO,

                                        DATA_FATURAMENTO = (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                                            where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                            && linha1.NUMERO_ITEM_PEDIDO_VENDA == linha.NUMERO_ITEM
                                                            select linha1).Any() ?

                                        (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                         where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                         && linha1.NUMERO_ITEM_PEDIDO_VENDA == linha.NUMERO_ITEM
                                         select linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF).First() :
                                         null,


                                        VALOR_TOTAL = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                       where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                       && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                       select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                        VALOR_ISS = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                     where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                     && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                     select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO * (t.ALIQ_ISS_ITEM_PEDIDO / 100)),

                                        FOLLOW_UP_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_PEDIDOs
                                                            where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                            && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                            select linha1).Count(),

                                        FOLLOW_UP_ITEM_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs
                                                                 orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM
                                                                 where (linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                                 && linha1.NUMERO_ITEM == linha.NUMERO_ITEM)
                                                                 && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                                 select linha1).Count(),

                                        CICLISTA = (from linha1 in ctx.TB_SERVICO_CICLISTAs
                                                    where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                    && linha1.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                    select linha1).Any() ? 1 : 0
                                    };

                        if (Convert.ToDecimal(dados["VENDEDOR"]) == 1)
                            query = query.Where(v => v.CODIGO_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"]));

                        if (Convert.ToDecimal(dados["GERENTE_COMERCIAL"]) == 1)
                        {
                            if (Convert.ToDecimal(dados["CODIGO_VENDEDOR"]) > 0)
                                query = query.Where(v => v.CODIGO_VENDEDOR == Convert.ToDecimal(dados["CODIGO_VENDEDOR"]));
                        }

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        return ApoioXML.objQueryToXML(ctx, query, rowCount);
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
        public string Lista_Itens_Por_Numero_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.NUMERO_PEDIDO
                                where linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.ID_PRODUTO_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.QTDE_A_FATURAR,
                                    linha.ITEM_A_FATURAR,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.PRECO_ITEM_PEDIDO,
                                    linha.VALOR_TOTAL_ITEM_PEDIDO,
                                    VALOR_ISS_ITEM_PEDIDO = Math.Round(linha.VALOR_TOTAL_ITEM_PEDIDO.Value * (linha.ALIQ_ISS_ITEM_PEDIDO.Value / 100), 2, MidpointRounding.ToEven),
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,
                                    linha.ID_USUARIO_ITEM_A_FATURAR,

                                    linha.TB_ITEM_ORCAMENTO_VENDA.OBS_ITEM_ORCAMENTO,

                                    linha.TB_ITEM_ORCAMENTO_VENDA.CEP_INICIAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_INICIAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_INICIAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_INICIAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_INICIAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.COMPL_INICIAL_ITEM_ORCAMENTO,

                                    linha.TB_ITEM_ORCAMENTO_VENDA.CEP_FINAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_FINAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_FINAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_FINAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_FINAL_ITEM_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.COMPL_FINAL_ITEM_ORCAMENTO,

                                    DATA_FATURAMENTO = (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                                        where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                        && linha1.NUMERO_ITEM_PEDIDO_VENDA == linha.NUMERO_ITEM
                                                        select linha1).Any() ?

                                                (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                                 where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                 && linha1.NUMERO_ITEM_PEDIDO_VENDA == linha.NUMERO_ITEM
                                                 select linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF).First().Value.ToShortDateString() : null,

                                    VALOR_TOTAL = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                   && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                   select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                    VALOR_ISS = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                 where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                 && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                 select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO * (t.ALIQ_ISS_ITEM_PEDIDO / 100)),

                                    FOLLOW_UP_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_PEDIDOs
                                                        where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                        && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                        select linha1).Count(),

                                    FOLLOW_UP_ITEM_PEDIDO = (from linha1 in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs
                                                             orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM
                                                             where (linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                             && linha1.NUMERO_ITEM == linha.NUMERO_ITEM)
                                                             && linha1.TEXTO_FOLLOW_UP.Length > 0
                                                             select linha1).Count(),

                                    CICLISTA = (from linha1 in ctx.TB_SERVICO_CICLISTAs
                                                where linha1.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                && linha1.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                select linha1).Any() ? 1 : 0
                                };

                    if (!dados.ContainsKey("BENEFICIAMENTO"))
                    {
                        if (Convert.ToDecimal(dados["VENDEDOR"]) == 1)
                        {
                            query = query.Where(v => v.CODIGO_VENDEDOR == Convert.ToDecimal(dados["ID_VENDEDOR"]));
                        }
                    }

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);

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
        public string Lista_Itens_Pedido_Beneficiamento(Dictionary<string, object> dados)
        {
            try
            {
                string retorno = string.Empty;

                DateTime _data = new DateTime();

                if (!DateTime.TryParse(dados["DATA_PEDIDO"].ToString(), out _data))
                    throw new Exception("Filtro da data de emiss&atilde;o do pedido inv&aacute;lido. <br />Digite a data no formato DD/MM/YYYY");

                bool agrupada = false;

                if (dados.ContainsKey("EXIBIR_AGRUPADA"))
                {
                    if (Convert.ToDecimal(dados["EXIBIR_AGRUPADA"]) == 1)
                    {
                        retorno = Lista_Pedidos_de_Forma_Agrupada(dados);
                        agrupada = true;
                    }
                }

                if (!agrupada)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        List<decimal?> status = new List<decimal?>();

                        if (dados.ContainsKey("STATUS"))
                        {
                            var s = dados["STATUS"];

                            if (s.GetType() == typeof(object[]))
                            {
                                for (int i = 0; i < ((object[])dados["STATUS"]).Length; i++)
                                {
                                    decimal x = 0;

                                    if (decimal.TryParse(((object[])dados["STATUS"])[i].ToString(), out x))
                                    {
                                        status.Add(Convert.ToDecimal(((object[])dados["STATUS"])[i]));
                                    }
                                }
                            }
                        }

                        var query = from linha in ctx.TB_PEDIDO_VENDAs
                                    orderby linha.DATA_PEDIDO
                                    where linha.DATA_PEDIDO >= Convert.ToDateTime(dados["DATA_PEDIDO"])

                                    && (linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                    || Convert.ToDecimal(dados["NUMERO_PEDIDO"]) == 0)

                                    && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Contains(dados["CLIENTE"].ToString())
                                    || linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["CLIENTE"].ToString()))

                                    && linha.CODIGO_PRODUTO_PEDIDO.Contains(dados["CODIGO_PRODUTO"].ToString())

                                    && (status.Contains(linha.STATUS_ITEM_PEDIDO) || status.Count == 0)

                                    select new
                                    {
                                        linha.NUMERO_PEDIDO,
                                        linha.STATUS_ITEM_PEDIDO,
                                        linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                        linha.TB_STATUS_PEDIDO.COR_STATUS,
                                        linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                        linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                        linha.NUMERO_ITEM,
                                        linha.DATA_PEDIDO,
                                        linha.ENTREGA_PEDIDO,
                                        linha.ID_PRODUTO_PEDIDO,
                                        linha.CODIGO_PRODUTO_PEDIDO,
                                        linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                        linha.QTDE_A_FATURAR,
                                        linha.UNIDADE_ITEM_PEDIDO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                        linha.OBS_ITEM_PEDIDO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                        linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                        ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,

                                        ITENS_COMPRA_ASSOCIADOS = (from compra in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                                   orderby compra.NUMERO_PEDIDO_VENDA, compra.NUMERO_ITEM_VENDA
                                                                   where compra.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                                   && compra.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                                   select linha).Any() ? 2 : 0
                                    };

                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Itens_Pedido_Agrupado(decimal NUMERO_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                where linha.NUMERO_PEDIDO == NUMERO_PEDIDO

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.ID_PRODUTO_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.QTDE_A_FATURAR,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,

                                    ITENS_COMPRA_ASSOCIADOS = (from compra in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                               orderby compra.NUMERO_PEDIDO_VENDA, compra.NUMERO_ITEM_VENDA
                                                               where compra.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                               && compra.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                               select linha).Any() ? 2 : 0
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

        private string Lista_Pedidos_de_Forma_Agrupada(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                List<decimal?> status = new List<decimal?>();

                if (dados.ContainsKey("STATUS"))
                {
                    var s = dados["STATUS"];

                    if (s.GetType() == typeof(object[]))
                    {
                        for (int i = 0; i < ((object[])dados["STATUS"]).Length; i++)
                        {
                            decimal x = 0;

                            if (decimal.TryParse(((object[])dados["STATUS"])[i].ToString(), out x))
                            {
                                status.Add(Convert.ToDecimal(((object[])dados["STATUS"])[i]));
                            }
                        }
                    }
                }

                var query = from linha in ctx.TB_PEDIDO_VENDAs
                            orderby linha.DATA_PEDIDO
                            where linha.DATA_PEDIDO >= Convert.ToDateTime(dados["DATA_PEDIDO"])

                            && (linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                            || Convert.ToDecimal(dados["NUMERO_PEDIDO"]) == 0)

                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Contains(dados["CLIENTE"].ToString())
                            || linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["CLIENTE"].ToString()))

                            && linha.CODIGO_PRODUTO_PEDIDO.Contains(dados["CODIGO_PRODUTO"].ToString())

                            && (status.Contains(linha.STATUS_ITEM_PEDIDO) || status.Count == 0)

                            group linha by new
                            {
                                linha.NUMERO_PEDIDO,
                                linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.STATUS_ITEM_PEDIDO,
                                linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                linha.TB_STATUS_PEDIDO.COR_STATUS,
                                linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                DATA_PEDIDO = string.Concat(linha.DATA_PEDIDO.Value.Day.ToString().PadLeft(2, '0'), "/",
                                    linha.DATA_PEDIDO.Value.Month.ToString().PadLeft(2, '0'), "/",
                                    linha.DATA_PEDIDO.Value.Year.ToString()),

                                linha.ENTREGA_PEDIDO
                            } into agrupamento

                            select new
                            {
                                agrupamento.Key.NUMERO_PEDIDO,
                                agrupamento.Key.NOMEFANTASIA_CLIENTE,

                                agrupamento.Key.STATUS_ITEM_PEDIDO,
                                agrupamento.Key.DESCRICAO_STATUS_PEDIDO,
                                agrupamento.Key.COR_FONTE_STATUS,
                                agrupamento.Key.COR_STATUS,
                                agrupamento.Key.STATUS_ESPECIFICO,
                                agrupamento.Key.DATA_PEDIDO,

                                agrupamento.Key.ENTREGA_PEDIDO,

                                TOTAL = agrupamento.Count(),

                                TOTAL_PEDIDO = agrupamento.Where(_ => _.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4).Sum(_ => _.VALOR_TOTAL_ITEM_PEDIDO)
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        private string Executa_Query_Itens_Pedidos(DataTable dt1, Dictionary<string, object> dados, int rowCount)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                dt1.Columns.Add("FOLLOW_UP");

                foreach (DataRow dr in dt1.Rows)
                {
                    var query1 = (from linha in ctx.TB_FOLLOW_UP_PEDIDOs

                                  orderby linha.NUMERO_PEDIDO

                                  where linha.NUMERO_PEDIDO == Convert.ToDecimal(dr["NUMERO_PEDIDO"])

                                  group linha by new
                                  {
                                      linha.TB_USUARIO.LOGIN_USUARIO
                                  }
                                      into agrupamento

                                      select new
                                      {
                                          agrupamento.Key.LOGIN_USUARIO,
                                          TOTAL = agrupamento.Count(f => f.TEXTO_FOLLOW_UP.Length > 0)
                                      }).ToList();

                    string APONTAMENTOS = "";

                    foreach (var item in query1)
                    {
                        if (item.TOTAL > 0)
                        {
                            APONTAMENTOS += APONTAMENTOS.Length > 0 ?
                                string.Concat(Environment.NewLine, item.LOGIN_USUARIO.Trim(), ": ", item.TOTAL.ToString().PadLeft(2, '0'), " Apontamento(s)") :
                                string.Concat("Pedido" + Environment.NewLine, item.LOGIN_USUARIO.Trim(), ": ", item.TOTAL.ToString().PadLeft(2, '0'), " Apontamento(s)");
                        }
                    }

                    //////////////////////////
                    var query2 = (from linha in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs

                                  orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM

                                  where linha.NUMERO_PEDIDO == Convert.ToDecimal(dr["NUMERO_PEDIDO"])
                                  && linha.NUMERO_ITEM == Convert.ToDecimal(dr["NUMERO_ITEM"])

                                  group linha by new
                                  {
                                      linha.TB_USUARIO.LOGIN_USUARIO
                                  }
                                      into agrupamento

                                      select new
                                      {
                                          agrupamento.Key.LOGIN_USUARIO,
                                          TOTAL = agrupamento.Count(f => f.TEXTO_FOLLOW_UP.Length > 0)
                                      }).ToList();
                    int it = 0;

                    foreach (var item in query2)
                    {
                        if (item.TOTAL > 0)
                        {
                            if (it == 0 && APONTAMENTOS.Length > 0)
                                APONTAMENTOS += string.Concat(Environment.NewLine, "--------------", Environment.NewLine, "Item do Pedido");

                            APONTAMENTOS += APONTAMENTOS.Length > 0 ?
                                string.Concat(Environment.NewLine, item.LOGIN_USUARIO.Trim(), ": ", item.TOTAL.ToString().PadLeft(2, '0'), " Apontamento(s)") :
                                string.Concat("----------", Environment.NewLine, "Item do Pedido", Environment.NewLine, item.LOGIN_USUARIO.Trim(), ": ", item.TOTAL.ToString().PadLeft(2, '0'), " Apontamento(s)");

                            it++;
                        }
                    }

                    dr["FOLLOW_UP"] = APONTAMENTOS;
                }
            }

            DataTable dt = new DataTable("Tabela");

            using (Doran_Comercial_Pedido totais = new Doran_Comercial_Pedido())
            {
                dt = totais.Calcula_Totais_Pedido(dt1);
            }

            dt = SomaQtdeFaturada_NumerosDeNota(dt);

            DataSet ds = new DataSet("Query");
            ds.Tables.Add(dt);

            DataTable totalCount = new DataTable("Totais");

            totalCount.Columns.Add("totalCount");

            DataRow nova = totalCount.NewRow();
            nova[0] = rowCount;
            totalCount.Rows.Add(nova);

            ds.Tables.Add(totalCount);

            System.IO.StringWriter tr = new System.IO.StringWriter();
            ds.WriteXml(tr);

            return tr.ToString();
        }

        [WebMethod()]
        public string Lista_Itens_a_Faturar(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal STATUS_PEDIDO = Convert.ToDecimal(dados["STATUS_PEDIDO"]);

                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.ENTREGA_PEDIDO
                                where linha.ENTREGA_PEDIDO >= Convert.ToDateTime(dados["DATA_PEDIDO"])

                                && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO == 5
                                || Convert.ToDecimal(dados["A_FATURAR"]) == 0)

                                && (linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                || Convert.ToDecimal(dados["NUMERO_PEDIDO"]) == 0)

                                && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Contains(dados["CLIENTE"].ToString())
                                || linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["CLIENTE"].ToString()))

                                && (linha.STATUS_ITEM_PEDIDO == STATUS_PEDIDO || STATUS_PEDIDO == 0)

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.QTDE_A_FATURAR,
                                    linha.ITEM_A_FATURAR,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.PRECO_ITEM_PEDIDO,
                                    linha.VALOR_TOTAL_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,
                                    linha.ID_USUARIO_ITEM_A_FATURAR,

                                    ITENS_COMPRA_ASSOCIADOS = (from compra in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                               orderby compra.NUMERO_PEDIDO_VENDA, compra.NUMERO_ITEM_VENDA
                                                               where compra.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                               && compra.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                               select linha).Any() ? 2 : 0,

                                    VALOR_TOTAL = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   orderby linha1.NUMERO_PEDIDO
                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                   select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                    VALOR_ISS = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                 orderby linha1.NUMERO_PEDIDO
                                                 where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                 select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO * (t.ALIQ_ISS_ITEM_PEDIDO / 100)),

                                    TOTAL_PEDIDO = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                    orderby linha1.NUMERO_PEDIDO
                                                    where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                    select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO)
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
        public string Lista_Itens_Marcados_a_Faturar(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.ID_USUARIO_ITEM_A_FATURAR, linha.ITEM_A_FATURAR, linha.NUMERO_PEDIDO

                                where (linha.ID_USUARIO_ITEM_A_FATURAR == Convert.ToDecimal(dados["ID_USUARIO"])
                                && linha.ITEM_A_FATURAR == 1)

                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    linha.STATUS_ITEM_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.COR_STATUS,
                                    linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                    linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                    linha.NUMERO_ITEM,
                                    linha.DATA_PEDIDO,
                                    linha.ENTREGA_PEDIDO,
                                    linha.CODIGO_PRODUTO_PEDIDO,
                                    linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                    linha.QTDE_A_FATURAR,
                                    linha.ITEM_A_FATURAR,
                                    linha.UNIDADE_ITEM_PEDIDO,
                                    linha.PRECO_ITEM_PEDIDO,
                                    linha.VALOR_TOTAL_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.OBS_ITEM_PEDIDO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO,
                                    linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                    ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0,
                                    linha.ID_USUARIO_ITEM_A_FATURAR,

                                    ITENS_COMPRA_ASSOCIADOS = (from compra in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                               orderby compra.NUMERO_PEDIDO_VENDA, compra.NUMERO_ITEM_VENDA
                                                               where compra.NUMERO_PEDIDO_VENDA == linha.NUMERO_PEDIDO
                                                               && compra.NUMERO_ITEM_VENDA == linha.NUMERO_ITEM
                                                               select linha).Any() ? 2 : 0,

                                    VALOR_TOTAL = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   orderby linha1.NUMERO_PEDIDO
                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                   select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO),

                                    VALOR_ISS = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                 orderby linha1.NUMERO_PEDIDO
                                                 where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                 select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO * (t.ALIQ_ISS_ITEM_PEDIDO / 100)),

                                    TOTAL_PEDIDO = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                    orderby linha1.NUMERO_PEDIDO
                                                    where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO
                                                    select linha1).Sum(t => t.VALOR_TOTAL_ITEM_PEDIDO)
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
        public string Carrega_Status(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_STATUS_PEDIDO_USUARIOs
                                where linha.ID_USUARIO_STATUS == ID_USUARIO
                                && new List<decimal?>() {0, 8, 4, 6, 7, 9, 5}.Contains(linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO)

                                select new
                                {
                                    linha.CODIGO_STATUS_PEDIDO,
                                    linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                    SENHA = linha.TB_STATUS_PEDIDO.SENHA_STATUS_PEDIDO.Trim().Length > 0 ? 1 : 0
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
        public string Carrega_Status_Cancelamento(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_STATUS_PEDIDOs
                                where linha.STATUS_ESPECIFICO == 4

                                select new
                                {
                                    linha.CODIGO_STATUS_PEDIDO,
                                    linha.DESCRICAO_STATUS_PEDIDO
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
        public string CarregaVendedores(decimal GERENTE_COMERCIAL, decimal ID_VENDEDOR, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_VENDEDOREs
                                orderby linha.VENDEDOR_ATIVO
                                where linha.VENDEDOR_ATIVO == 1
                                select linha;

                    if (GERENTE_COMERCIAL == 0)
                    {
                        query = query.Where(v => v.ID_VENDEDOR == ID_VENDEDOR);
                        query = query.OrderBy(n => n.NOME_VENDEDOR);
                    }

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
        public List<object> Salva_Custos(List<Dictionary<string, object>> LINHAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal NUMERO_PEDIDO = 0;
                    decimal NUMERO_ITEM = 0;

                    foreach (Dictionary<string, object> CUSTO in LINHAS)
                    {
                        NUMERO_PEDIDO = Convert.ToDecimal(CUSTO["NUMERO_PEDIDO"]);
                        NUMERO_ITEM = Convert.ToDecimal(CUSTO["NUMERO_ITEM"]);

                        var query = from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                    where linha.NUMERO_PEDIDO == Convert.ToDecimal(CUSTO["NUMERO_PEDIDO"])
                                    && linha.NUMERO_ITEM_PEDIDO == Convert.ToDecimal(CUSTO["NUMERO_ITEM"])
                                    && linha.NUMERO_CUSTO_VENDA == Convert.ToDecimal(CUSTO["NUMERO_CUSTO_VENDA"])
                                    select linha;

                        if (query.Count() > 0)
                        {
                            foreach (var item in query)
                            {
                                string VALOR_CUSTO = CUSTO["CUSTO_ITEM_PEDIDO"].ToString().Replace(".", ",");

                                item.CUSTO_ITEM_PEDIDO = Convert.ToDecimal(VALOR_CUSTO);
                                item.PREVISAO_ENTREGA = Convert.ToDateTime(CUSTO["PREVISAO_ENTREGA1"]);
                                item.OBS_CUSTO_VENDA = CUSTO["OBS_CUSTO_VENDA"].ToString();

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs.GetModifiedMembers(item),
                                    ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                            }
                        }
                        else
                        {
                            System.Data.Linq.Table<TB_CUSTO_ITEM_PEDIDO_VENDA> Entidade = ctx.GetTable<TB_CUSTO_ITEM_PEDIDO_VENDA>();

                            TB_CUSTO_ITEM_PEDIDO_VENDA novo = new TB_CUSTO_ITEM_PEDIDO_VENDA();

                            string VALOR_CUSTO = CUSTO["CUSTO_ITEM_PEDIDO"].ToString().Replace(".", ",");

                            novo.NUMERO_PEDIDO = Convert.ToDecimal(CUSTO["NUMERO_PEDIDO"]);
                            novo.NUMERO_ITEM_PEDIDO = Convert.ToDecimal(CUSTO["NUMERO_ITEM"]);
                            novo.NUMERO_CUSTO_VENDA = Convert.ToDecimal(CUSTO["NUMERO_CUSTO_VENDA"]);
                            novo.CUSTO_ITEM_PEDIDO = Convert.ToDecimal(VALOR_CUSTO);
                            novo.PREVISAO_ENTREGA = Convert.ToDateTime(CUSTO["PREVISAO_ENTREGA1"]);
                            novo.OBS_CUSTO_VENDA = CUSTO["OBS_CUSTO_VENDA"].ToString();

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();

                    List<object> retorno =
                        Doran_Comercial_Pedido.Recalcula_Custos_Pedido(NUMERO_PEDIDO, NUMERO_ITEM, ID_USUARIO);

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
        public List<object> Deleta_Custo(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal NUMERO_CUSTO_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                 where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                 && linha.NUMERO_ITEM_PEDIDO == NUMERO_ITEM
                                 && linha.NUMERO_CUSTO_VENDA == NUMERO_CUSTO_VENDA
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete_PEDIDO_VENDA(ctx, item, ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }

                List<object> retorno = new List<object>();

                retorno = Doran_Comercial_Pedido.Recalcula_Custos_Pedido(NUMERO_PEDIDO, NUMERO_ITEM, ID_USUARIO);

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Custos_do_Item(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                && linha.NUMERO_ITEM_PEDIDO == NUMERO_ITEM
                                select new
                                {
                                    linha.NUMERO_PEDIDO,
                                    NUMERO_ITEM = linha.NUMERO_ITEM_PEDIDO,
                                    NUMERO_CUSTO_VENDA = string.Concat(linha.TB_CUSTO_VENDA.DESCRICAO_CUSTO_VENDA.Trim(), " -  ",
                                        linha.NUMERO_CUSTO_VENDA.ToString()),
                                    linha.CUSTO_ITEM_PEDIDO,
                                    PREVISAO_ENTREGA1 = linha.PREVISAO_ENTREGA,
                                    linha.OBS_CUSTO_VENDA
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
        public string Analise_Pedido_Venda(decimal NUMERO_PEDIDO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Analise_Pedido_Venda analise = new Doran_Analise_Pedido_Venda(NUMERO_PEDIDO, ID_EMPRESA))
                {
                    DataTable dt = analise.Aplica_Analise(ID_EMPRESA);

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

        [WebMethod()]
        public string Follow_UP_Pedido(decimal NUMERO_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FOLLOW_UP_PEDIDOs
                                orderby linha.NUMERO_PEDIDO

                                where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                && (linha.TEXTO_FOLLOW_UP.Length > 0)

                                select new
                                {
                                    linha.NUMERO_FOLLOW_UP,
                                    linha.DATA_HORA_FOLLOW_UP,
                                    linha.NUMERO_PEDIDO,
                                    linha.ID_USUARIO_FOLLOW_UP,
                                    linha.TB_USUARIO.LOGIN_USUARIO,
                                    linha.TEXTO_FOLLOW_UP
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
        public string Follow_UP_ITEM_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FOLLOW_UP_ITEM_PEDIDOs
                                orderby linha.NUMERO_PEDIDO

                                where linha.NUMERO_PEDIDO == Convert.ToDecimal(dados["NUMERO_PEDIDO"])

                                && (linha.TEXTO_FOLLOW_UP.Length > 0)

                                select new
                                {
                                    linha.NUMERO_FOLLOW_UP,
                                    linha.DATA_HORA_FOLLOW_UP,
                                    linha.NUMERO_PEDIDO,
                                    linha.NUMERO_ITEM,
                                    linha.ID_USUARIO_FOLLOW_UP,
                                    linha.TB_USUARIO.LOGIN_USUARIO,
                                    linha.TEXTO_FOLLOW_UP,
                                    linha.TB_PEDIDO_VENDA.CODIGO_PRODUTO_PEDIDO,
                                    linha.TB_PEDIDO_VENDA.TB_PRODUTO.DESCRICAO_PRODUTO
                                };

                    if (dados.ContainsKey("NUMERO_ITEM"))
                        query = query.Where(p => p.NUMERO_ITEM == Convert.ToDecimal(dados["NUMERO_ITEM"]));

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string x = ApoioXML.objQueryToXML(ctx, query, rowCount);

                    return x;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Imprime_Pedido(decimal NUMERO_PEDIDO, string LOGIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Impressao_Pedido_Venda pedido = new Doran_Impressao_Pedido_Venda(NUMERO_PEDIDO, ID_USUARIO))
                {
                    return pedido.Imprime_Pedido(LOGIN_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Grava_Posicao_Pedido(decimal NUMERO_PEDIDO, List<decimal> ITENS, string OBS, decimal STATUS, decimal TODOS,
            bool CANCELAR, bool LIBERAR_FATURAR, decimal SENHA, string SENHA_DIGITADA, List<string> DESTINATARIOS,
            decimal ID_CONTA_EMAIL, string FROM_ADDRESS, string ASSINATURA, decimal ID_USUARIO, string LOGIN_USUARIO)
        {
            string retorno = "";

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal _STATUS = STATUS;
                    _STATUS = LIBERAR_FATURAR ? BuscaStatus_PedidoLiberar() : _STATUS;

                    string CLIENTE = "";
                    string CODIGO_PRODUTO = "";

                    string STATUS_ANTIGO = "";
                    string STATUS_NOVO = "";

                    List<Doran_Servicos_ORM.TB_PEDIDO_VENDA> _PEDIDO_VENDA = new List<Doran_Servicos_ORM.TB_PEDIDO_VENDA>();

                    if (SENHA == 1)
                    {
                        var _senha = (from linha in ctx.TB_STATUS_PEDIDOs
                                      where linha.CODIGO_STATUS_PEDIDO == STATUS
                                      select linha.SENHA_STATUS_PEDIDO).ToList().First().Trim();

                        Th2_Seguranca.Principal seg = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
                            ConfigurationManager.AppSettings["ID_Sistema"]);

                        seg.CriptografaDados(SENHA_DIGITADA);

                        if (_senha != seg.SenhaEncriptada_)
                            throw new Exception("Senha inv&aacute;lida");

                    }

                    if (TODOS == 0 || CANCELAR)
                    {
                        if (OBS.Length > 0)
                        {
                            System.Data.Linq.Table<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO>();

                            Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO novo = new Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO();

                            novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                            novo.DATA_HORA_FOLLOW_UP = DateTime.Now;
                            novo.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                            novo.TEXTO_FOLLOW_UP = OBS;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();
                        }

                        ///////////////

                        STATUS_ANTIGO = (from linha in ctx.TB_PEDIDO_VENDAs
                                         where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                         select linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO.Trim()).ToList().First();

                        _PEDIDO_VENDA = (from linha in ctx.TB_PEDIDO_VENDAs
                                         where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                         && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                         select linha).ToList();

                        DateTime _hoje = DateTime.Now;

                        foreach (var item in _PEDIDO_VENDA)
                        {
                            // Registra mudança da fase

                            var DATA_STATUS_ANTERIOR = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                                        where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                                        && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                                        select linha.DATA_MUDANCA).Any() ?

                                                        (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                                         where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                                         && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                                         select linha.DATA_MUDANCA).Max() : item.DATA_PEDIDO;

                            System.Data.Linq.Table<TB_MUDANCA_STATUS_PEDIDO> Entidade = ctx.GetTable<TB_MUDANCA_STATUS_PEDIDO>();

                            TB_MUDANCA_STATUS_PEDIDO novo = new TB_MUDANCA_STATUS_PEDIDO();

                            novo.NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO;
                            novo.NUMERO_ITEM_VENDA = item.NUMERO_ITEM;
                            novo.DATA_MUDANCA = _hoje;
                            novo.ID_USUARIO = ID_USUARIO;
                            novo.ID_STATUS_ANTERIOR = item.STATUS_ITEM_PEDIDO;
                            novo.ID_STATUS_NOVO = _STATUS;
                            novo.DATA_STATUS_ANTERIOR = DATA_STATUS_ANTERIOR;
                            novo.ID_PRODUTO = item.ID_PRODUTO_PEDIDO;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();

                            //

                            item.STATUS_ITEM_PEDIDO = _STATUS;

                            CLIENTE = item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim();

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();
                        }

                        if (CANCELAR)
                        {
                            var item_orcamento = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                  where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO
                                                  select linha).ToList();

                            foreach (var item in item_orcamento)
                            {
                                item.NUMERO_PEDIDO_VENDA = 0;

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                    ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                            }

                            ctx.SubmitChanges();

                            var queryOrcamento = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                  orderby linha.NUMERO_PEDIDO_VENDA
                                                  where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO
                                                  select linha).ToList();

                            foreach (var item in queryOrcamento)
                            {
                                item.NUMERO_PEDIDO_VENDA = 0;

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                    ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                            }

                            ctx.SubmitChanges();
                        }
                    }
                    else
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                     && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                     select new
                                     {
                                         linha.NUMERO_ITEM,
                                         linha.NUMERO_ORCAMENTO,
                                         linha.NUMERO_ITEM_ORCAMENTO,
                                         linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                         linha.CODIGO_PRODUTO_PEDIDO,
                                         linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO
                                     }).ToList();

                        List<decimal?> n_itens = new List<decimal?>();

                        foreach (var item in query)
                        {
                            if (ITENS.Contains((decimal)item.NUMERO_ITEM))
                            {
                                STATUS_ANTIGO = item.DESCRICAO_STATUS_PEDIDO.Trim();

                                CLIENTE = item.NOMEFANTASIA_CLIENTE.Trim();
                                CODIGO_PRODUTO = item.CODIGO_PRODUTO_PEDIDO.Trim();

                                n_itens.Add(item.NUMERO_ITEM_ORCAMENTO);

                                if (OBS.Length > 0)
                                {
                                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO>();

                                    Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO novo = new Doran_Servicos_ORM.TB_FOLLOW_UP_ITEM_PEDIDO();

                                    novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                                    novo.NUMERO_ITEM = item.NUMERO_ITEM;
                                    novo.DATA_HORA_FOLLOW_UP = DateTime.Now;
                                    novo.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                                    novo.TEXTO_FOLLOW_UP = OBS;

                                    Entidade.InsertOnSubmit(novo);

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                                    ctx.SubmitChanges();
                                }
                            }
                        }

                        _PEDIDO_VENDA = (from linha in ctx.TB_PEDIDO_VENDAs
                                         where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                         && ITENS.Contains(linha.NUMERO_ITEM)
                                         select linha).ToList();

                        DateTime _hoje = DateTime.Now;

                        foreach (var item in _PEDIDO_VENDA)
                        {
                            // registra mudança de fase

                            var DATA_STATUS_ANTERIOR = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                                        where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                                        && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                                        select linha.DATA_MUDANCA).Any() ?

                                                        (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                                                         where linha.NUMERO_PEDIDO_VENDA == item.NUMERO_PEDIDO
                                                         && linha.NUMERO_ITEM_VENDA == item.NUMERO_ITEM
                                                         select linha.DATA_MUDANCA).Max() : item.DATA_PEDIDO;

                            System.Data.Linq.Table<TB_MUDANCA_STATUS_PEDIDO> Entidade = ctx.GetTable<TB_MUDANCA_STATUS_PEDIDO>();

                            TB_MUDANCA_STATUS_PEDIDO novo = new TB_MUDANCA_STATUS_PEDIDO();

                            novo.NUMERO_PEDIDO_VENDA = item.NUMERO_PEDIDO;
                            novo.NUMERO_ITEM_VENDA = item.NUMERO_ITEM;
                            novo.DATA_MUDANCA = _hoje;
                            novo.ID_USUARIO = ID_USUARIO;
                            novo.ID_STATUS_ANTERIOR = item.STATUS_ITEM_PEDIDO;
                            novo.ID_STATUS_NOVO = _STATUS;
                            novo.DATA_STATUS_ANTERIOR = DATA_STATUS_ANTERIOR;
                            novo.ID_PRODUTO = item.ID_PRODUTO_PEDIDO;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();

                            decimal? STATUS_ESPECIFICO = (from linha in ctx.TB_STATUS_PEDIDOs
                                                          where linha.CODIGO_STATUS_PEDIDO == _STATUS
                                                          select linha.STATUS_ESPECIFICO).ToList().First();

                            if (STATUS_ESPECIFICO == 4)
                            {
                                var queryOrcamento = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                      orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM
                                                      where linha.NUMERO_ORCAMENTO == item.NUMERO_ORCAMENTO
                                                      && linha.NUMERO_ITEM == item.NUMERO_ITEM_ORCAMENTO
                                                      select linha).ToList();

                                foreach (var item1 in queryOrcamento)
                                {
                                    item1.NUMERO_PEDIDO_VENDA = 0;

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item1),
                                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                                }

                                ctx.SubmitChanges();
                            }

                            item.STATUS_ITEM_PEDIDO = _STATUS;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();
                        }

                        if (CANCELAR)
                        {
                            var item_orcamento = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                  where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO
                                                  select linha).ToList();

                            foreach (var item in item_orcamento)
                            {
                                if (n_itens.Contains(item.NUMERO_ITEM))
                                {
                                    item.NUMERO_PEDIDO_VENDA = 0;

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                                }
                            }

                            ctx.SubmitChanges();
                        }
                    }

                    ctx.SubmitChanges();

                    // Enviar e-mails sobre a mudança da fase do pedido / item(s)

                    var statusPedido = (from linha in ctx.TB_STATUS_PEDIDOs
                                        where linha.CODIGO_STATUS_PEDIDO == _STATUS
                                        select new
                                        {
                                            linha.DESCRICAO_STATUS_PEDIDO,
                                            linha.COR_STATUS,
                                            linha.COR_FONTE_STATUS,
                                            linha.STATUS_ESPECIFICO
                                        }).ToList();

                    foreach (var item in statusPedido)
                    {
                        STATUS_NOVO = item.DESCRICAO_STATUS_PEDIDO.Trim();

                        retorno += string.Concat("['", item.DESCRICAO_STATUS_PEDIDO.Trim(), "', '", item.COR_STATUS.Trim(),
                            "', '", item.COR_FONTE_STATUS.Trim(), "', " + item.STATUS_ESPECIFICO + "]");
                    }

                    ctx.Transaction.Commit();

                    if (DESTINATARIOS.Count > 0)
                    {
                        using (Doran_Email_Posicao_Pedido email = new Doran_Email_Posicao_Pedido(ID_USUARIO))
                        {
                            string _OBS = string.Concat(LOGIN_USUARIO.ToUpper(), " salvou uma nova posição do pedido ", NUMERO_PEDIDO.ToString(),
                                " de <b>", STATUS_ANTIGO, "</b> para <b>", STATUS_NOVO, "</b><br /><br />", OBS, "<br /><br />",
                                ASSINATURA);


                            email.NUMERO_PEDIDO = NUMERO_PEDIDO;
                            email.CLIENTE = CLIENTE;
                            email.CODIGO_PRODUTO = CODIGO_PRODUTO;
                            email.HISTORICO = _OBS;
                            email.DESTINATARIOS = DESTINATARIOS;
                            email.ID_CONTA_EMAIL = ID_CONTA_EMAIL;
                            email.FROM_ADDRESS = FROM_ADDRESS;

                            email.Envia_Email_Posicao_Pedido();
                        }
                    }
                }
                catch (Exception ex)
                {
                    ctx.Transaction.Rollback();
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                    throw ex;
                }
            }

            return retorno;
        }

        [WebMethod()]
        public string Busca_Usuarios_Pedido(decimal NUMERO_PEDIDO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Email_Posicao_Pedido email = new Doran_Email_Posicao_Pedido(ID_USUARIO))
                {
                    return email.Busca_Usuarios_Pedido(NUMERO_PEDIDO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Entrega_Item_Pedido(List<Dictionary<string, object>> Entregas, decimal ID_USUARIO)
        {
            try
            {
                List<MaiorDataEntrega> TABELA = new List<MaiorDataEntrega>();

                for (int i = 0; i < Entregas.Count; i++)
                {
                    MaiorDataEntrega item = new MaiorDataEntrega();
                    item.NUMERO_PEDIDO = Convert.ToDecimal(Entregas[i]["NUMERO_PEDIDO"]);
                    item.ENTREGA_PEDIDO = Convert.ToDateTime(Entregas[i]["ENTREGA_PEDIDO"]);

                    TABELA.Add(item);
                }

                var PEDIDOS_FINAIS = (from linha in TABELA

                                      group linha by new
                                      {
                                          linha.NUMERO_PEDIDO,
                                      }
                                          into agrupamento

                                          select new
                                          {
                                              agrupamento.Key.NUMERO_PEDIDO,
                                              ENTREGA_PEDIDO = agrupamento.Max(e => e.ENTREGA_PEDIDO)

                                          }).ToList();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    for (int i = 0; i < PEDIDOS_FINAIS.Count; i++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     orderby linha.NUMERO_PEDIDO
                                     where linha.NUMERO_PEDIDO == PEDIDOS_FINAIS[i].NUMERO_PEDIDO
                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.ENTREGA_PEDIDO = PEDIDOS_FINAIS[i].ENTREGA_PEDIDO;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), item.NUMERO_PEDIDO, ID_USUARIO);
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
        public void Salva_Qtdes_a_Faturar(List<Dictionary<string, object>> lista, decimal ID_USUARIO)
        {
            try
            {
                for (int i = 0; i < lista.Count; i++)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     where linha.NUMERO_PEDIDO == Convert.ToDecimal(lista[i]["NUMERO_PEDIDO"])
                                     && linha.NUMERO_ITEM == Convert.ToDecimal(lista[i]["NUMERO_ITEM"])
                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.QTDE_A_FATURAR = Convert.ToDecimal(lista[i]["QTDE_A_FATURAR"]);

                            if (item.QTDE_A_FATURAR < (decimal)0.001)
                                item.ITEM_A_FATURAR = 0;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), Convert.ToDecimal(lista[i]["NUMERO_PEDIDO"]), ID_USUARIO);
                        }

                        ctx.SubmitChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private decimal BuscaStatus_PedidoCancelado()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_STATUS_PEDIDOs
                             where linha.STATUS_ESPECIFICO == 4
                             select new { linha.CODIGO_STATUS_PEDIDO }).ToList();

                decimal retorno = 0;

                foreach (var item in query)
                    retorno = item.CODIGO_STATUS_PEDIDO;

                return retorno;
            }
        }

        [WebMethod()]
        public decimal Gera_NotaFiscal(decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Nota_Saida nota = new Doran_Nota_Saida(ID_EMPRESA, ID_USUARIO))
                {
                    return nota.Nova_Nota_Saida(null);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<decimal> STATUS_LIBERADO_FATURAR(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_STATUS_PEDIDOs
                                 where linha.STATUS_ESPECIFICO == 5
                                 || linha.STATUS_ESPECIFICO == 2
                                 select linha.CODIGO_STATUS_PEDIDO).ToList();

                    List<decimal> retorno = new List<decimal>();

                    retorno.Add(query[0]);
                    retorno.Add(query[1]);

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
        public void Marca_Itens_Faturar(List<Dictionary<string, object>> itens, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    List<decimal> NUMEROS_PEDIDO = new List<decimal>();
                    List<decimal> NUMEROS_ITEM = new List<decimal>();

                    for (int i = 0; i < itens.Count; i++)
                    {
                        if (!NUMEROS_PEDIDO.Contains(Convert.ToDecimal(itens[i]["NUMERO_PEDIDO"])))
                            NUMEROS_PEDIDO.Add(Convert.ToDecimal(itens[i]["NUMERO_PEDIDO"]));

                        if (!NUMEROS_ITEM.Contains(Convert.ToDecimal(itens[i]["NUMERO_ITEM"])))
                            NUMEROS_ITEM.Add(Convert.ToDecimal(itens[i]["NUMERO_ITEM"]));
                    }

                    var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                 where NUMEROS_PEDIDO.Contains(linha.NUMERO_PEDIDO)
                                 && NUMEROS_ITEM.Contains(linha.NUMERO_ITEM)

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.ID_USUARIO_ITEM_A_FATURAR = ID_USUARIO;
                        item.ITEM_A_FATURAR = 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_VENDAs.ToString(), item.NUMERO_PEDIDO, ID_USUARIO);
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
        public void Desmarca_Itens_Faturar(List<Dictionary<string, object>> itens, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    for (int i = 0; i < itens.Count; i++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     where linha.NUMERO_PEDIDO == Convert.ToDecimal(itens[i]["NUMERO_PEDIDO"])
                                     && linha.NUMERO_ITEM == Convert.ToDecimal(itens[i]["NUMERO_ITEM"])
                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.ID_USUARIO_ITEM_A_FATURAR = 0;
                            item.ITEM_A_FATURAR = 0;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), Convert.ToDecimal(itens[i]["NUMERO_PEDIDO"]), ID_USUARIO);
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
        public string Gera_Nota_Fiscal(decimal GERAR_CONFIRMADO, decimal ID_EMPRESA, string SERIE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Fatura_Pedido fatura = new Doran_Fatura_Pedido(ID_EMPRESA, ID_USUARIO, SERIE))
                {
                    string retorno = "";

                    if (GERAR_CONFIRMADO == 0)
                    {
                        retorno = fatura.Verifica_Todos_Itens_Marcados();
                    }
                    else
                    {
                        retorno = fatura.Fatura_Pedidos();
                        Zera_Marca_de_Faturamento(ID_USUARIO);
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

        private decimal BuscaStatus_PedidoLiberar()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_STATUS_PEDIDOs
                             where linha.STATUS_ESPECIFICO == 5
                             select new { linha.CODIGO_STATUS_PEDIDO }).ToList();

                decimal retorno = 0;

                foreach (var item in query)
                    retorno = item.CODIGO_STATUS_PEDIDO;

                return retorno;
            }
        }

        private DataTable SomaQtdeFaturada_NumerosDeNota(DataTable dt)
        {
            dt.Columns.Add("QTDE_FATURADA");
            dt.Columns.Add("NUMEROS_INTERNOS");
            dt.Columns.Add("NUMEROS_NF");

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                foreach (DataRow dr in dt.Rows)
                {
                    var total = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                 orderby linha.NUMERO_PEDIDO_VENDA, linha.NUMERO_ITEM_PEDIDO_VENDA
                                 where linha.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dr["NUMERO_PEDIDO"]) &&
                                 linha.NUMERO_ITEM_PEDIDO_VENDA == Convert.ToDecimal(dr["NUMERO_ITEM"])
                                 select new
                                 {
                                     linha.NUMERO_ITEM_NF,
                                     linha.TB_NOTA_SAIDA.NUMERO_NF,
                                     linha.QTDE_ITEM_NF
                                 }).ToList();

                    List<decimal> totalQtde = new List<decimal>();
                    List<string> NumeroInternos = new List<string>();
                    List<string> NumeroNotas = new List<string>();

                    foreach (var item in total)
                    {
                        if (!NumeroInternos.Contains(item.NUMERO_ITEM_NF.ToString()))
                            NumeroInternos.Add(item.NUMERO_ITEM_NF.ToString());

                        if (!NumeroNotas.Contains(item.NUMERO_NF.ToString()))
                            NumeroNotas.Add(item.NUMERO_NF.ToString());

                        totalQtde.Add((decimal)item.QTDE_ITEM_NF);
                    }

                    string[] s1 = NumeroInternos.ToArray();
                    string[] s2 = NumeroNotas.ToArray();

                    dr["QTDE_FATURADA"] = totalQtde.Sum();
                    dr["NUMEROS_INTERNOS"] = string.Join(" / ", s1);
                    dr["NUMEROS_NF"] = string.Join(" / ", s2);
                }
            }

            return dt;
        }

        [WebMethod()]
        public string Matriz_Primeira_Pagina(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Pedido = ConfigurationManager.AppSettings["Modelo_PEDIDO"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Pedido))
                {
                    retorno = tr.ReadToEnd();
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Matriz_Proximas_Paginas(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Pedido = ConfigurationManager.AppSettings["Modelo_PEDIDO_ProximaPagina"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Pedido))
                {
                    retorno = tr.ReadToEnd();
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Matriz_Primeira_Pagina(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_PEDIDO"]))
                {
                    string linhaProduto = @"<tr>
<td style=""width: 362px;"">#PRODUTO#</td>
<td align=""center"" style=""width: 80px;"">#QTDE#</td>
<td align=""center"" style=""width: 30px;"">#UN#</td>
<td align=""right"" style=""width: 80px; "">#CUSTO#</td>
<td align=""center"" style=""width: 60px; "">#MARGEM#</td>
<td align=""right"" style=""width: 80px; "">#PRECO#</td>
<td align=""right"" style=""width: 98px;"">#TOTAL#</td>
<td align=""right"" style=""width: 70px; "">#IPI#</td>
<td align=""right"" style=""width: 70px; "">#ICMS#</td>
<td align=""right"" style=""width: 70px; "">#ICMS_ST#</td>
</tr>
</table>

<table style=""width: 1100px;"">
<tr>
<td><b>Nr. Pedido do Cliente:</b> #NUMERO_ITEM_PEDIDO_CLIENTE#</td>
<td colspan=""2""><b>C&oacute;digo do Cliente:</b></td>
<td colspan=""2"">#CODIGO_ITEM_CLIENTE#</td>
<td colspan=""5""><b>Ordem Compra:</b> #ORDEM_COMPRA#</td>
</tr>

<tr>
<td colspan=""5""><b>Obs.:</b> #OBS_ITEM#</td>
<td align=""right""><b>Posi&ccedil;&atilde;o:</b></td>
<td>#STATUS_PEDIDO#</td>
<td align=""right""><b>Entrega:</b></td>
<td>#ENTREGA#</td>
</tr>";

                    string linhaMatriz = @"<TR>
<TD style=""WIDTH: 362px"">#PRODUTO#</TD>
<TD style=""WIDTH: 80px"" align=middle>#QTDE#</TD>
<TD style=""WIDTH: 30px"" align=middle>#UN#</TD>
<TD style=""WIDTH: 80px"" align=right>#CUSTO#</TD>
<TD style=""WIDTH: 60px"" align=middle>#MARGEM#</TD>
<TD style=""WIDTH: 80px"" align=right>#PRECO#</TD>
<TD style=""WIDTH: 98px"" align=right>#TOTAL#</TD>
<TD style=""WIDTH: 70px"" align=right>#IPI#</TD>
<TD style=""WIDTH: 70px"" align=right>#ICMS#</TD>
<TD style=""WIDTH: 70px"" align=right>#ICMS_ST#</TD></TR></TBODY></TABLE>
<TABLE style=""WIDTH: 1100px"">
<TBODY>
<TR>
<TD><B>Nr. Pedido do Cliente:</B> #NUMERO_ITEM_PEDIDO_CLIENTE#</TD>
<TD colSpan=2><B>Código do Cliente:</B></TD>
<TD colSpan=2>#CODIGO_ITEM_CLIENTE#</TD>
<TD colSpan=5><B>Ordem Compra:</B> #ORDEM_COMPRA#</TD></TR>
<TR>
<TD colSpan=5><B>Obs.:</B> #OBS_ITEM#</TD>
<TD align=right><B>Posição:</B></TD>
<TD>#STATUS_PEDIDO#</TD>
<TD align=right><B>Entrega:</B></TD>
<TD>#ENTREGA#</TD></TR></TBODY>";
                    HTML = HTML.Replace(linhaProduto, linhaMatriz);

                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Matriz_Proximas_Paginas(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_PEDIDO_ProximaPagina"]))
                {
                    string linhaProduto = @"<tr>
<td style=""width: 362px;"">#PRODUTO#</td>
<td align=""center"" style=""width: 80px;"">#QTDE#</td>
<td align=""center"" style=""width: 30px;"">#UN#</td>
<td align=""right"" style=""width: 80px; "">#CUSTO#</td>
<td align=""center"" style=""width: 60px; "">#MARGEM#</td>
<td align=""right"" style=""width: 80px; "">#PRECO#</td>
<td align=""right"" style=""width: 98px;"">#TOTAL#</td>
<td align=""right"" style=""width: 70px; "">#IPI#</td>
<td align=""right"" style=""width: 70px; "">#ICMS#</td>
<td align=""right"" style=""width: 70px; "">#ICMS_ST#</td>
</tr>
</table>

<table style=""width: 1100px;"">
<tr>
<td><b>Nr. Pedido do Cliente:</b> #NUMERO_ITEM_PEDIDO_CLIENTE#</td>
<td colspan=""2""><b>C&oacute;digo do Cliente:</b></td>
<td colspan=""2"">#CODIGO_ITEM_CLIENTE#</td>
<td colspan=""5""><b>Ordem Compra:</b> #ORDEM_COMPRA#</td>
</tr>

<tr>
<td colspan=""5""><b>Obs.:</b> #OBS_ITEM#</td>
<td align=""right""><b>Posi&ccedil;&atilde;o:</b></td>
<td>#STATUS_PEDIDO#</td>
<td align=""right""><b>Entrega:</b></td>
<td>#ENTREGA#</td>
</tr>";

                    string linhaMatriz = @"<TR>
<TD style=""WIDTH: 362px"">#PRODUTO#</TD>
<TD style=""WIDTH: 80px"" align=middle>#QTDE#</TD>
<TD style=""WIDTH: 30px"" align=middle>#UN#</TD>
<TD style=""WIDTH: 80px"" align=right>#CUSTO#</TD>
<TD style=""WIDTH: 60px"" align=middle>#MARGEM#</TD>
<TD style=""WIDTH: 80px"" align=right>#PRECO#</TD>
<TD style=""WIDTH: 98px"" align=right>#TOTAL#</TD>
<TD style=""WIDTH: 70px"" align=right>#IPI#</TD>
<TD style=""WIDTH: 70px"" align=right>#ICMS#</TD>
<TD style=""WIDTH: 70px"" align=right>#ICMS_ST#</TD></TR></TBODY></TABLE>
<TABLE style=""WIDTH: 1100px"">
<TBODY>
<TR>
<TD><B>Nr. Pedido do Cliente:</B> #NUMERO_ITEM_PEDIDO_CLIENTE#</TD>
<TD colSpan=2><B>Código do Cliente:</B></TD>
<TD colSpan=2>#CODIGO_ITEM_CLIENTE#</TD>
<TD colSpan=5><B>Ordem Compra:</B> #ORDEM_COMPRA#</TD></TR>
<TR>
<TD colSpan=5><B>Obs.:</B> #OBS_ITEM#</TD>
<TD align=right><B>Posição:</B></TD>
<TD>#STATUS_PEDIDO#</TD>
<TD align=right><B>Entrega:</B></TD>
<TD>#ENTREGA#</TD></TR></TBODY>";
                    HTML = HTML.Replace(linhaProduto, linhaMatriz);

                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Notas_do_Pedido(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from nota in ctx.TB_ITEM_NOTA_SAIDAs
                                 orderby nota.NUMERO_PEDIDO_VENDA
                                 where nota.NUMERO_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_PEDIDO"])
                                 && nota.NUMERO_ITEM_PEDIDO_VENDA == Convert.ToDecimal(dados["NUMERO_ITEM"])

                                 select new
                                 {
                                     nota.TB_NOTA_SAIDA.NUMERO_SEQ,
                                     nota.TB_NOTA_SAIDA.NUMERO_NF,
                                     nota.TB_NOTA_SAIDA.SERIE_NF,
                                     nota.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.NOME_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.CNPJ_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.DATA_EMISSAO_NF,
                                     nota.TB_NOTA_SAIDA.TOTAL_NF,
                                     nota.TB_NOTA_SAIDA.NUMERO_PEDIDO_NF,
                                     nota.TB_NOTA_SAIDA.STATUS_NF,
                                     nota.TB_NOTA_SAIDA.EMITIDA_NF,
                                     nota.TB_NOTA_SAIDA.CANCELADA_NF,
                                     nota.TB_NOTA_SAIDA.TELEFONE_CLIENTE_NF,
                                     nota.NUMERO_ITEM_PEDIDO_VENDA,
                                     COND_PAGTO = nota.TB_NOTA_SAIDA.TB_COND_PAGTO.DESCRICAO_CP,
                                     nota.TB_NOTA_SAIDA.TOTAL_SERVICOS_NF,
                                     nota.TB_NOTA_SAIDA.VALOR_ISS_NF,
                                     BASE_ISS_NF = nota.TB_NOTA_SAIDA.BASE_ISS_NF
                                 }).Distinct();

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
        public string Notas_do_Vendedor(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from nota in ctx.TB_NOTA_SAIDAs

                                select new
                                {
                                    nota.CODIGO_VENDEDOR_NF,
                                    nota.NUMERO_SEQ,
                                    nota.NUMERO_NF,
                                    nota.SERIE_NF,
                                    nota.CODIGO_CLIENTE_NF,
                                    nota.NOME_CLIENTE_NF,
                                    nota.NOME_FANTASIA_CLIENTE_NF,
                                    nota.CNPJ_CLIENTE_NF,
                                    nota.DATA_EMISSAO_NF,
                                    nota.TOTAL_NF,
                                    nota.TOTAL_SERVICOS_NF,
                                    nota.VALOR_ISS_NF,
                                    BASE_ISS_NF = nota.BASE_ISS_NF,
                                    nota.NUMERO_PEDIDO_NF,
                                    nota.STATUS_NF,
                                    nota.EMITIDA_NF,
                                    nota.CANCELADA_NF,
                                    nota.TELEFONE_CLIENTE_NF,
                                    COND_PAGTO = nota.TB_COND_PAGTO.DESCRICAO_CP
                                };

                    string retorno = "";

                    if (Convert.ToDecimal(dados["GERENTE_COMERCIAL"]) == 1)
                    {
                        query = query.OrderBy(nota => nota.DATA_EMISSAO_NF);

                        var query1 = query.Where(nota => nota.DATA_EMISSAO_NF >= Convert.ToDateTime(dados["EMISSAO1"])
                            && nota.DATA_EMISSAO_NF < Convert.ToDateTime(dados["EMISSAO2"]).AddDays(1));

                        query1 = query1.Where(nota => nota.NOME_CLIENTE_NF.Contains(dados["CLIENTE"].ToString()) ||
                            nota.NOME_FANTASIA_CLIENTE_NF.Contains(dados["CLIENTE"].ToString()));

                        var rowCount = query1.Count();

                        query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
                    }
                    else
                    {
                        query = query.OrderBy(nota => nota.CODIGO_VENDEDOR_NF).ThenBy(nota => nota.DATA_EMISSAO_NF);

                        var query1 = query.Where(nota => nota.CODIGO_VENDEDOR_NF == Convert.ToDecimal(dados["ID_VENDEDOR"])
                            && (nota.DATA_EMISSAO_NF >= Convert.ToDateTime(dados["EMISSAO1"])
                            && nota.DATA_EMISSAO_NF < Convert.ToDateTime(dados["EMISSAO2"]).AddDays(1)));

                        query1 = query1.Where(nota => nota.NOME_CLIENTE_NF.Contains(dados["CLIENTE"].ToString()) ||
                            nota.NOME_FANTASIA_CLIENTE_NF.Contains(dados["CLIENTE"].ToString()));

                        var rowCount = query1.Count();

                        query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
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
        public string Carrega_ItensNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from nota in ctx.TB_ITEM_NOTA_SAIDAs
                                 orderby nota.NUMERO_ITEM_NF, nota.SEQUENCIA_ITEM_NF
                                 where nota.NUMERO_ITEM_NF == Convert.ToDecimal(dados["NUMERO_ITEM_NF"])
                                 select nota;

                    var rowCount = query1.Count();

                    query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

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
        public Dictionary<string, object> Gera_Ordem_Compra(decimal ID_UF_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Ordem_Compra ordem = new Doran_Ordem_Compra())
                {
                    return ordem.Gera_Ordem_Compra(ID_UF_EMITENTE, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<Dictionary<string, object>> Gera_Ordem_Compra_Sugestao(List<Dictionary<string, object>> LINHAS, decimal ID_UF_EMITENTE,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Ordem_Compra ordem = new Doran_Ordem_Compra())
                {
                    return ordem.Gera_Ordem_Compra_Sugestao(LINHAS, ID_UF_EMITENTE, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Salva_Nova_Data_Entrega(List<decimal> NUMERO_ITEM, string DATA_ENTREGA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                 where NUMERO_ITEM.Contains(linha.NUMERO_ITEM)
                                 select linha).ToList();

                    DateTime dt1 = Convert.ToDateTime(DATA_ENTREGA);

                    foreach (var item in query)
                    {
                        item.ENTREGA_PEDIDO = dt1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_VENDAs.ToString(), item.NUMERO_PEDIDO, ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    retorno.Add("DATA_ENTREGA", ApoioXML.TrataDataXML(dt1));
                    retorno.Add("ATRASADA", dt1 < DateTime.Now ? 1 : 0);

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
        public Dictionary<string, object> Liquida_saldo_faturamento(List<decimal> NUMERO_PEDIDO, List<decimal> NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    var query1 = (from linha in ctx.TB_STATUS_PEDIDOs
                                  where linha.STATUS_ESPECIFICO == 3
                                  select linha).Take(1).ToList();

                    decimal STATUS = 0;

                    foreach (var item in query1)
                    {
                        retorno.Add("CODIGO_STATUS_PEDIDO", item.CODIGO_STATUS_PEDIDO);
                        retorno.Add("DESCRICAO_STATUS_PEDIDO", item.DESCRICAO_STATUS_PEDIDO.Trim());
                        retorno.Add("COR_FONTE_STATUS", item.COR_FONTE_STATUS.Trim());
                        retorno.Add("COR_STATUS", item.COR_STATUS.Trim());

                        STATUS = item.CODIGO_STATUS_PEDIDO;
                    }

                    for (int i = 0; i < NUMERO_PEDIDO.Count; i++)
                    {
                        var query = (from linha in ctx.TB_PEDIDO_VENDAs
                                     orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM

                                     where (linha.NUMERO_PEDIDO == NUMERO_PEDIDO[i]
                                     && linha.NUMERO_ITEM == NUMERO_ITEM[i])

                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.QTDE_A_FATURAR = 0;
                            item.STATUS_ITEM_PEDIDO = STATUS;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO[i], ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();

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
        public string Relatorio_Vendas_Semestral(string dataRef, decimal CODIGO_VENDEDOR, string CODIGO_REGIAO, string CLIENTE,
            decimal ID_UF, decimal ID_MUNICIPIO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(dataRef);

                using (Doran_Relatorio_Vendas_Semestral sem = new Doran_Relatorio_Vendas_Semestral(dt1))
                {
                    sem.CODIGO_VENDEDOR = CODIGO_VENDEDOR;
                    sem.CODIGO_REGIAO = CODIGO_REGIAO;
                    sem.CLIENTE = CLIENTE;
                    sem.ID_UF = ID_UF;
                    sem.ID_MUNICIPIO = ID_MUNICIPIO;

                    return sem.Lista_Relatorio(ID_EMPRESA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Preco_de_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal PRECO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Pedido pedido = new Doran_Comercial_Pedido())
                {
                    pedido.Altera_Preco_de_Venda(NUMERO_PEDIDO, NUMERO_ITEM, PRECO, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Roteiro_Item_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal QTDE, Dictionary<string, string> dados,
                    decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Pedido pedido = new Doran_Comercial_Pedido())
                {
                    pedido.Altera_Roteiro_Item_Venda(NUMERO_PEDIDO, NUMERO_ITEM, QTDE, dados, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Qtde_Item_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal QTDE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Pedido pedido = new Doran_Comercial_Pedido())
                {
                    pedido.Altera_Qtde_Item_Venda(NUMERO_PEDIDO, NUMERO_ITEM, QTDE, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Ciclista_Servico(List<decimal> NUMEROS_PEDIDO, List<decimal> NUMEROS_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_CICLISTAs
                                 orderby cs.NOME_CICLISTA
                                 where cs.CICLISTA_ATIVO == 1

                                 select new
                                  {
                                      cs.ID_CICLISTA,
                                      cs.NOME_CICLISTA,
                                      SERVICO = (from linha in ctx.TB_SERVICO_CICLISTAs
                                                 where NUMEROS_PEDIDO.Contains(linha.NUMERO_PEDIDO_VENDA)
                                                 && NUMEROS_ITEM.Contains(linha.NUMERO_ITEM_VENDA)
                                                 && linha.ID_CICLISTA == cs.ID_CICLISTA
                                                 select linha).Any() ? 1 : 0
                                  };

                    return ApoioXML.objQueryToXML(ctx, query1);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Ciclista_Servico2(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cs in ctx.TB_CICLISTAs
                                 orderby cs.NOME_CICLISTA
                                 where cs.CICLISTA_ATIVO == 1

                                 select new
                                 {
                                     cs.ID_CICLISTA,
                                     cs.NOME_CICLISTA
                                 };

                    return ApoioXML.objQueryToXML(ctx, query1);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Zera_Marca_de_Faturamento(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    using (SqlConnection cnn = new SqlConnection(ctx.Connection.ConnectionString))
                    {
                        cnn.Open();

                        SqlCommand command = new SqlCommand("UPDATE TB_PEDIDO_VENDA SET ITEM_A_FATURAR = NULL, ID_USUARIO_ITEM_A_FATURAR = NULL WHERE ITEM_A_FATURAR IS NOT NULL AND ID_USUARIO_ITEM_A_FATURAR = @ID_USUARIO", cnn);
                        
                        command.Parameters.Add("@ID_USUARIO", SqlDbType.Decimal).Value = ID_USUARIO;
                        
                        command.ExecuteNonQuery();
                        command.Dispose();
                        cnn.Close();
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
        public string Relatorio_Entregas(string DATA1, string DATA2, string CLIENTE, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(DATA1);
                DateTime dt2 = Convert.ToDateTime(DATA2);

                using (Doran_Relatorio_Entregas_do_Cliente ec = new Doran_Relatorio_Entregas_do_Cliente(CLIENTE, dt1, dt2, ID_EMPRESA))
                {
                    return ec.MontaRelatorio();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Enderecos(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var ITEM_ORCAMENTO = (from linha in ctx.TB_PEDIDO_VENDAs
                                          where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                          && linha.NUMERO_ITEM == NUMERO_ITEM
                                          select linha).Any() ?

                                          (from linha in ctx.TB_PEDIDO_VENDAs
                                           where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                           && linha.NUMERO_ITEM == NUMERO_ITEM
                                           select linha.NUMERO_ITEM_ORCAMENTO).First() : 0;

                    if (ITEM_ORCAMENTO == 0)
                        throw new Exception("Item de servi&ccedil;o n&atilde;o encontrado");

                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO
                                 && linha.NUMERO_ITEM == ITEM_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        string CEP_FINAL = item.CEP_FINAL_ITEM_ORCAMENTO.Trim();
                        string CIDADE_FINAL = item.CIDADE_FINAL_ITEM_ORCAMENTO.Trim();
                        string COMPL_FINAL = item.COMPL_FINAL_ITEM_ORCAMENTO.Trim();
                        string ENDERECO_FINAL = item.ENDERECO_FINAL_ITEM_ORCAMENTO.Trim();
                        string ESTADO_FINAL = item.ESTADO_FINAL_ITEM_ORCAMENTO.Trim();
                        string NUMERO_FINAL = item.NUMERO_FINAL_ITEM_ORCAMENTO.Trim();


                        item.CEP_FINAL_ITEM_ORCAMENTO = item.CEP_INICIAL_ITEM_ORCAMENTO.Trim();
                        item.CIDADE_FINAL_ITEM_ORCAMENTO = item.CIDADE_INICIAL_ITEM_ORCAMENTO.Trim();
                        item.COMPL_FINAL_ITEM_ORCAMENTO = item.COMPL_INICIAL_ITEM_ORCAMENTO.Trim();
                        item.ENDERECO_FINAL_ITEM_ORCAMENTO = item.ENDERECO_INICIAL_ITEM_ORCAMENTO.Trim();
                        item.ESTADO_FINAL_ITEM_ORCAMENTO = item.ESTADO_INICIAL_ITEM_ORCAMENTO.Trim();
                        item.NUMERO_FINAL_ITEM_ORCAMENTO = item.NUMERO_INICIAL_ITEM_ORCAMENTO.Trim();

                        item.CEP_INICIAL_ITEM_ORCAMENTO = CEP_FINAL;
                        item.CIDADE_INICIAL_ITEM_ORCAMENTO = CIDADE_FINAL;
                        item.COMPL_INICIAL_ITEM_ORCAMENTO = COMPL_FINAL;
                        item.ENDERECO_INICIAL_ITEM_ORCAMENTO = ENDERECO_FINAL;
                        item.ESTADO_INICIAL_ITEM_ORCAMENTO = ESTADO_FINAL;
                        item.NUMERO_INICIAL_ITEM_ORCAMENTO = NUMERO_FINAL;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
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

    public class MaiorDataEntrega
    {
        public decimal NUMERO_PEDIDO { get; set; }
        public DateTime ENTREGA_PEDIDO { get; set; }

        public MaiorDataEntrega()
        {

        }
    }
}