using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.Data;
using Doran_Base;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public static class Doran_Produtos
    {
        public static string Lista_TB_PRODUTO(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                if (!dados.ContainsKey("CODIGO_PRODUTO"))
                {
                    dados.Add("CODIGO_PRODUTO", dados["Pesquisa"].ToString());
                    dados["Pesquisa"] = string.Empty;
                }

                if (!dados.ContainsKey("CODIGO_CLIENTE"))
                    dados.Add("CODIGO_CLIENTE", 0);

                decimal codigo_cliente = decimal.TryParse(dados["CODIGO_CLIENTE"].ToString(), out codigo_cliente) ?
                    Convert.ToDecimal(dados["CODIGO_CLIENTE"]) : 0;

                dados["CODIGO_CLIENTE"] = codigo_cliente;

                if (!dados.ContainsKey("Pesquisa"))
                    dados.Add("Pesquisa", string.Empty);

                var query1 = from produto in ctx.TB_PRODUTOs
                             where produto.CODIGO_PRODUTO.Substring(0, dados["CODIGO_PRODUTO"].ToString().Length) == dados["CODIGO_PRODUTO"].ToString() &&
                             produto.DESCRICAO_PRODUTO.Contains(dados["Pesquisa"].ToString())

                             select new
                             {
                                 produto.ID_PRODUTO,
                                 produto.CODIGO_PRODUTO,
                                 produto.DESCRICAO_PRODUTO,
                                 produto.UNIDADE_MEDIDA_VENDA,
                                 PRECO_PRODUTO = produto.PRECO_PRODUTO * (decimal)1.02,
                                 produto.ALIQ_ISS,

                                 ULTIMO_PRECO = (from linha in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                                 orderby linha.ID_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                                                 linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending

                                                 where linha.ID_PRODUTO_ITEM_NF == produto.ID_PRODUTO
                                                    && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == Convert.ToDecimal(dados["CODIGO_CLIENTE"])
                                                    && linha.TB_NOTA_SAIDA.STATUS_NF == 4

                                                 select linha).Any() ?

                                                 (from linha in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                                  orderby linha.ID_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                                                  linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending

                                                  where linha.ID_PRODUTO_ITEM_NF == produto.ID_PRODUTO
                                                     && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == Convert.ToDecimal(dados["CODIGO_CLIENTE"])
                                                     && linha.TB_NOTA_SAIDA.STATUS_NF == 4

                                                  select linha.VALOR_UNITARIO_ITEM_NF).First() : produto.PRECO_PRODUTO,

                                 ULTIMA_COMPRA = (from linha in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                                  orderby linha.ID_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF, linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending

                                                  where linha.ID_PRODUTO_ITEM_NF == produto.ID_PRODUTO
                                                    && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == Convert.ToDecimal(dados["CODIGO_CLIENTE"])
                                                    && linha.TB_NOTA_SAIDA.STATUS_NF == 4

                                                  select linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF).Any() ?

                                                 (from linha in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                                  orderby linha.ID_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF, linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending

                                                  where linha.ID_PRODUTO_ITEM_NF == produto.ID_PRODUTO
                                                    && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == Convert.ToDecimal(dados["CODIGO_CLIENTE"])
                                                    && linha.TB_NOTA_SAIDA.STATUS_NF == 4

                                                  select linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF) : null
                             };

                var rowCount = query1.Count();

                var query = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public static IQueryable<SUGESTAO_COMPRA> Query_SUGESTAO_COMPRA(decimal ID_PRODUTO, decimal ID_FAMILIA, Doran_ERP_Servicos_DadosDataContext ctx)
        {
            IQueryable<SUGESTAO_COMPRA> query = from linha in ctx.TB_PRODUTOs

                                                select new SUGESTAO_COMPRA()
                                                {
                                                    ID_PRODUTO = linha.ID_PRODUTO,
                                                    CODIGO_PRODUTO = linha.CODIGO_PRODUTO,
                                                    DESCRICAO_PRODUTO = linha.DESCRICAO_PRODUTO,

                                                    CONSUMO_ULTIMOS_QUATRO_MESES = (from linha1 in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()

                                                                                    where linha1.ID_PRODUTO_ITEM_NF == linha.ID_PRODUTO
                                                                                    && (linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= DateTime.Today.AddMonths(-4)
                                                                                    && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < DateTime.Today)

                                                                                    && linha1.TB_NOTA_SAIDA.STATUS_NF == 4
                                                                                    select linha1).Sum(q => q.QTDE_ITEM_NF).HasValue ?

                                                                                    (from linha1 in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                                                                     orderby linha1.ID_PRODUTO_ITEM_NF, linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF

                                                                                     where (linha1.ID_PRODUTO_ITEM_NF == linha.ID_PRODUTO
                                                                                     && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= DateTime.Today.AddMonths(-4)
                                                                                     && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < DateTime.Today)

                                                                                     && linha1.TB_NOTA_SAIDA.STATUS_NF == 4
                                                                                     select linha1).Sum(q => q.QTDE_ITEM_NF) : 0,

                                                    COMPRAS_NAO_ENTREGUES = (from linha1 in ctx.GetTable<TB_PEDIDO_COMPRA>()
                                                                             orderby linha1.ID_PRODUTO_COMPRA
                                                                             where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                                                             && (linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                                                                             linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 6)
                                                                             select linha1).Sum(c => c.QTDE_ITEM_COMPRA).HasValue ?

                                                                             (from linha1 in ctx.GetTable<TB_PEDIDO_COMPRA>()
                                                                              orderby linha1.ID_PRODUTO_COMPRA
                                                                              where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                                                              && (linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                                                                              linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 6)
                                                                              select linha1).Sum(c => c.QTDE_ITEM_COMPRA) : 0
                                                };

            if (ID_FAMILIA == 0)
            {
                query = query.Where(p => p.ID_PRODUTO == ID_PRODUTO);
            }
            else
            {
                query = query.Where(p => p.ID_FAMILIA == ID_FAMILIA);
            }

            return query;
        }
    }

    public class SUGESTAO_COMPRA
    {
        public SUGESTAO_COMPRA() { }

        public decimal ID_PRODUTO { get; set; }
        public string CODIGO_PRODUTO { get; set; }
        public string DESCRICAO_PRODUTO { get; set; }
        public decimal? ID_FAMILIA { get; set; }
        public decimal? QTDE_EM_ESTOQUE { get; set; }
        public decimal? CONSUMO_ULTIMOS_QUATRO_MESES { get; set; }
        public decimal? COMPRAS_NAO_ENTREGUES { get; set; }
    }
}
