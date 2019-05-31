using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Data.Linq;
using System.Data.Common;
using System.Data;
using System.Globalization;
using System.Text;
using Doran_Base.Auditoria;
using System.IO;
using System.Configuration;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Sugestao_Compra : IDisposable
    {
        public decimal ID_FAMILIA { get; set; }
        public decimal ID_PRODUTO { get; set; }
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }
        
        private List<decimal?> status_compra { get; set; }
        private List<decimal?> status_nf;

        public Doran_Sugestao_Compra()
        {
            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

            status_compra = new List<decimal?>();
            status_compra.Add(3);
            status_compra.Add(4);

            status_nf = new List<decimal?>();
            status_nf.Add(2);
            status_nf.Add(4);
        }

        #region Calcula sugestão de compra

        public string Calcula_Sugestao_Compra(Dictionary<string, object> dados)
        {
            IQueryable<DECISAO_COMPRA> query = query_Sugestao_Compra(dados);

            var rowCount = query.Count();

            var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

            return ApoioXML.objQueryToXML(ctx, query1, rowCount);
        }

        private IQueryable<DECISAO_COMPRA> query_Sugestao_Compra(Dictionary<string, object> dados)
        {
            DateTime data1 = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 01).AddMonths(-Convert.ToInt32(dados["MESES"]));
            DateTime data2 = data1.AddMonths(Convert.ToInt32(dados["MESES"]));

            var query = from linha in ctx.TB_PRODUTOs
                        select new DECISAO_COMPRA()
                        {
                            ID_PRODUTO = linha.ID_PRODUTO,
                            CODIGO_PRODUTO = linha.CODIGO_PRODUTO,
                            DESCRICAO_PRODUTO = linha.DESCRICAO_PRODUTO,

                            MEDIA_COMPRA = 0,

                            MEDIA_VENDA = 0,

                            MAIOR_PEDIDO = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                            where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                            && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                            && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                                            select linha1).Any() ?

                                                   (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                    where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                                    && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                                    && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                                                    select linha1.QTDE_ITEM_COMPRA).Max() : 0,

                            MENOR_PEDIDO = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                            where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                            && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                            && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                                            select linha1).Any() ?

                                                   (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                    where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                                    && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                                    && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                                                    select linha1.QTDE_ITEM_COMPRA).Min() : 0,

                            NUMERO_FORNECEDORES_VENDERAM = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                                            where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                                                            && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                                            && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                                                            select linha1).Any() ?

                           (from linha1 in ctx.TB_PEDIDO_COMPRAs
                            where linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO
                            && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                            && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)
                            select linha1.CODIGO_FORNECEDOR).Distinct().Count() : 0,

                            NUMERO_CLIENTES_COMPRARAM = (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                                         where linha1.ID_PRODUTO_ITEM_NF == linha.ID_PRODUTO
                                                         && status_nf.Contains(linha1.TB_NOTA_SAIDA.STATUS_NF)
                                                         && (linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)
                                                         select linha1).Any() ?

                           (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                            where linha1.ID_PRODUTO_ITEM_NF == linha.ID_PRODUTO
                            && status_nf.Contains(linha1.TB_NOTA_SAIDA.STATUS_NF)
                            && (linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)
                            select linha1.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF).Distinct().Count() : 0,
                        };

            if (Convert.ToDecimal(dados["ID_PRODUTO"]) > 0)
            {
                query = query.Where(p => p.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"]) &&
                    p.ITEM_DE_ESTOQUE == 1);
            }
            else
            {
                query = query.Where(p => p.ITEM_DE_ESTOQUE == 1 && p.CODIGO_PRODUTO.Contains(dados["CODIGO_PRODUTO"].ToString()));
                query = query.OrderBy(p => p.ITEM_DE_ESTOQUE).ThenBy(p => p.CODIGO_PRODUTO);
            }

            if (Convert.ToDecimal(dados["ID_FAMILIA"]) > 0)
                query = query.Where(p => p.ID_FAMILIA == Convert.ToDecimal(dados["ID_FAMILIA"]));


            return query;
        }

        public string Calcula_Sugestao_Compra_Excel(Dictionary<string, object> dados)
        {
            int MESES = Convert.ToInt32(dados["MESES"]);

            IQueryable<DECISAO_COMPRA> query = query_Sugestao_Compra(dados);

            StringBuilder _conteudo = new StringBuilder();

            _conteudo.Append("<table style='width: 100%; font-family: tahoma; font-size: 8pt;'>");

            _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>C&oacute;digo do produto</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Descri&ccedil;&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center; font-weight: bold;'>Unidade</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center; font-weight: bold;'>Compra m&eacute;dia</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center; font-weight: bold;'>Venda m&eacute;dia</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center; font-weight: bold;'>Qtde em estoque</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Hist&oacute;rico</td>
                                    </tr>");

            foreach (var item in query)
            {
                List<decimal> IDs_PRODUTO = new List<decimal>();
                IDs_PRODUTO.Add(item.ID_PRODUTO);

                List<Dictionary<string, object>> media = calcula_Compra_Venda_Mes_a_Mes(IDs_PRODUTO, MESES);

                decimal? MEDIA_COMPRA = ((decimal?)media[0]["MEDIA_COMPRA"]).HasValue ?
                    Convert.ToDecimal(media[0]["MEDIA_COMPRA"]) : 0;

                decimal? MEDIA_VENDA = ((decimal?)media[0]["MEDIA_VENDA"]).HasValue ?
                    Convert.ToDecimal(media[0]["MEDIA_VENDA"]) : 0;

                decimal? QTDE_EM_ESTOQUE = ((decimal?)media[0]["QTDE_EM_ESTOQUE"]).HasValue ?
                    Convert.ToDecimal(media[0]["QTDE_EM_ESTOQUE"]) : 0;

                string MES_A_MES = media[0]["MES_A_MES"].ToString();

                _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{1}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>{2}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>{3}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>{4}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>{5}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{6}</td>
                                    </tr>",
                                          item.CODIGO_PRODUTO.Trim(),
                                          item.DESCRICAO_PRODUTO.Trim(),
                                          item.UNIDADE.Trim(),
                                          MEDIA_COMPRA.Value.ToString("n"),
                                          MEDIA_VENDA.Value.ToString("n"),
                                          QTDE_EM_ESTOQUE.Value.ToString("n"),
                                          MES_A_MES));
            }

            string arquivo = ConfigurationManager.AppSettings["PastaFisica_Queries"] + "relatorio_sugestao_compra_" + Convert.ToDecimal(dados["ID_USUARIO"]).ToString() + ".x";

            return ApoioXML.urlCsv(_conteudo, arquivo, Convert.ToDecimal(dados["ID_USUARIO"]));
        }

        public List<Dictionary<string, object>> calcula_Compra_Venda_Mes_a_Mes(List<decimal> IDS_PRODUTO, decimal MESES)
        {
            List<Dictionary<string, object>> retorno = new List<Dictionary<string, object>>();

            DateTime hoje = DateTime.Today.AddMonths(1);

            for (int o = 0; o < IDS_PRODUTO.Count; o++)
            {
                DateTime data1 = new DateTime(hoje.Year, hoje.Month, 01).AddMonths(-(int)MESES);
                DateTime data2 = data1.AddMonths((int)MESES);

                DateTime dataI = data1;
                DateTime dataF = dataI.AddMonths(1);

                List<decimal?> compras = new List<decimal?>();
                List<decimal?> vendas = new List<decimal?>();
                List<string> lista = new List<string>();

                StringBuilder str = new StringBuilder();

                str.Append("<table><tr>");

                for (int i = 0; i < MESES; i++)
                {
                    var compra = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                                  where linha1.ID_PRODUTO_COMPRA == IDS_PRODUTO[o]

                                  && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                  && (linha1.DATA_ITEM_COMPRA >= dataI && linha1.DATA_ITEM_COMPRA < dataF)
                                  select linha1.QTDE_ITEM_COMPRA).Sum();

                    var venda = (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                                 where linha1.ID_PRODUTO_ITEM_NF == IDS_PRODUTO[o]
                                 && status_nf.Contains(linha1.TB_NOTA_SAIDA.STATUS_NF)
                                 && (linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= dataI && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < dataF)
                                 select linha1.QTDE_ITEM_NF).Sum();

                    venda = venda.HasValue ? venda : 0;
                    compra = compra.HasValue ? compra : 0;

                    compras.Add(compra);
                    vendas.Add(venda);
                    lista.Add(CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dataI.Month).ToUpper() + "-" + dataI.Year.ToString());

                    dataI = dataI.AddMonths(1);
                    dataF = dataF.AddMonths(1);
                }

                for (int n = 0; n < compras.Count; n++)
                {
                    if (n == 0)
                        str.Append(string.Concat("<td></td>"));

                    str.Append(string.Concat("<td style='width: 100px; text-align: center;'><b>", lista[n], "</b></td>"));
                }

                str.Append("<tr/><tr>");

                for (int n = 0; n < compras.Count; n++)
                {
                    if (n == 0)
                        str.Append(string.Concat("<td style='width: 70px; text-align: center;'><b>Compra:</b></td>"));

                    str.Append(string.Concat("<td style='text-align: center;'>", ApoioXML.ValorN(compras[n].Value, 2), "</td>"));
                }

                str.Append("<tr/><tr>");

                for (int n = 0; n < compras.Count; n++)
                {
                    if (n == 0)
                        str.Append(string.Concat("<td style='width: 70px; text-align: center;'><b>Venda:</b></td>"));

                    str.Append(string.Concat("<td style='text-align: center;'>", ApoioXML.ValorN(vendas[n].Value, 2), "</td>"));
                }

                str.Append("<tr/></table>");

                Dictionary<string, object> item = new Dictionary<string, object>();

                item.Add("MES_A_MES", str.ToString());
                item.Add("MEDIA_COMPRA", compras.Average());
                item.Add("MEDIA_VENDA", vendas.Average());

                retorno.Add(item);
            }

            return retorno;
        }

        #endregion

        #region Clientes e Fornecedores

        public string Clientes_que_compraram(Dictionary<string, object> dados)
        {
            DateTime hoje = DateTime.Today.AddMonths(1);

            DateTime data1 = new DateTime(hoje.Year, hoje.Month, 01).AddMonths(-Convert.ToInt32(dados["MESES"]));
            DateTime data2 = data1.AddMonths(Convert.ToInt32(dados["MESES"]));

            var query = (from linha1 in ctx.TB_ITEM_NOTA_SAIDAs
                         where linha1.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                         && status_nf.Contains(linha1.TB_NOTA_SAIDA.STATUS_NF)
                         && (linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha1.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)
                         select new
                         {
                             linha1.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                             linha1.TB_NOTA_SAIDA.NOME_CLIENTE_NF,
                             linha1.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF,
                             linha1.TB_NOTA_SAIDA.MUNICIPIO_NF,
                             linha1.TB_NOTA_SAIDA.TB_CLIENTE.TB_MUNICIPIO.TB_UF.SIGLA_UF,

                             PRECO_MEDIO = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                            where linha.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                                            && status_nf.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                            && (linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)

                                            && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == linha1.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF

                                            select linha.VALOR_UNITARIO_ITEM_NF).Average(),

                             PRECO_GERAL = ((from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                             where linha.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_nf.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                             && (linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)

                                             select linha.QTDE_ITEM_NF).Sum().HasValue &&

                                            (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                             where linha.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_nf.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                             && (linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)

                                             select linha.VALOR_TOTAL_ITEM_NF).Sum().HasValue) ?

                                            (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                             where linha.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_nf.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                             && (linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)

                                             select linha.VALOR_TOTAL_ITEM_NF).Sum() /

                                             (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                              where linha.ID_PRODUTO_ITEM_NF == Convert.ToDecimal(dados["ID_PRODUTO"])
                                              && status_nf.Contains(linha.TB_NOTA_SAIDA.STATUS_NF)
                                              && (linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= data1 && linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF < data2)

                                              select linha.QTDE_ITEM_NF).Sum() : 0

                         }).Distinct();

            var rowCount = query.Count();

            query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

            return ApoioXML.objQueryToXML(ctx, query, rowCount);
        }

        public string Fornecedores_que_venderam(Dictionary<string, object> dados)
        {
            DateTime hoje = DateTime.Today.AddMonths(1);

            DateTime data1 = new DateTime(hoje.Year, hoje.Month, 01).AddMonths(-Convert.ToInt32(dados["MESES"]));
            DateTime data2 = data1.AddMonths(Convert.ToInt32(dados["MESES"]));

            var query = (from linha1 in ctx.TB_PEDIDO_COMPRAs
                         where linha1.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                         && status_compra.Contains(linha1.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                         && (linha1.DATA_ITEM_COMPRA >= data1 && linha1.DATA_ITEM_COMPRA < data2)

                         select new
                         {
                             linha1.CODIGO_FORNECEDOR,
                             linha1.TB_FORNECEDOR.NOME_FORNECEDOR,
                             linha1.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                             linha1.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO,
                             linha1.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF,

                             PRECO_MEDIO = (from linha in ctx.TB_PEDIDO_COMPRAs
                                            where linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                                            && status_compra.Contains(linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                            && (linha.DATA_ITEM_COMPRA >= data1 && linha.DATA_ITEM_COMPRA < data2)

                                            && linha.CODIGO_FORNECEDOR == linha1.CODIGO_FORNECEDOR

                                            select linha.VALOR_TOTAL_ITEM_COMPRA / linha.QTDE_ITEM_COMPRA).Average(),

                             PRECO_GERAL = ((from linha in ctx.TB_PEDIDO_COMPRAs
                                             where linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_compra.Contains(linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                             && (linha.DATA_ITEM_COMPRA >= data1 && linha.DATA_ITEM_COMPRA < data2)

                                             select linha.QTDE_ITEM_COMPRA).Sum().HasValue &&

                                            (from linha in ctx.TB_PEDIDO_COMPRAs
                                             where linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_compra.Contains(linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                             && (linha.DATA_ITEM_COMPRA >= data1 && linha.DATA_ITEM_COMPRA < data2)

                                             select linha.VALOR_TOTAL_ITEM_COMPRA).Sum().HasValue) ?

                                            (from linha in ctx.TB_PEDIDO_COMPRAs
                                             where linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_compra.Contains(linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                             && (linha.DATA_ITEM_COMPRA >= data1 && linha.DATA_ITEM_COMPRA < data2)

                                             select linha.VALOR_TOTAL_ITEM_COMPRA).Sum() /

                                            (from linha in ctx.TB_PEDIDO_COMPRAs
                                             where linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                                             && status_compra.Contains(linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA)
                                             && (linha.DATA_ITEM_COMPRA >= data1 && linha.DATA_ITEM_COMPRA < data2)

                                             select linha.QTDE_ITEM_COMPRA).Sum() : 0

                         }).Distinct();

            var rowCount = query.Count();

            query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

            return ApoioXML.objQueryToXML(ctx, query, rowCount);
        }

        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
            ctx.Dispose();
        }

        #endregion
    }

    public class DECISAO_COMPRA
    {
        public DECISAO_COMPRA() { }

        public decimal ID_PRODUTO { get; set; }
        public string CODIGO_PRODUTO { get; set; }
        public string DESCRICAO_PRODUTO { get; set; }
        public decimal? MEDIA_COMPRA { get; set; }
        public decimal? MEDIA_VENDA { get; set; }
        public decimal? MAIOR_PEDIDO { get; set; }
        public decimal? MENOR_PEDIDO { get; set; }
        public int NUMERO_CLIENTES_COMPRARAM { get; set; }
        public int NUMERO_FORNECEDORES_VENDERAM { get; set; }
        public decimal QTDE_EM_ESTOQUE { get; set; }
        public string UNIDADE { get; set; }
        public decimal? QTDE_A_COMPRAR { get; set; }
        public decimal? ITEM_DE_ESTOQUE { get; set; }
        public decimal? ID_FAMILIA { get; set; }
    }
}