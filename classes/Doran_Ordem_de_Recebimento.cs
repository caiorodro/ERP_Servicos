using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Ordem_de_Recebimento : IDisposable
    {
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }
        private DateTime dataFinal { get; set; }
        private decimal ID_EMPRESA { get; set; }

        public Doran_Ordem_de_Recebimento(decimal _ID_EMPRESA, DateTime _dataFinal)
        {
            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

            dataFinal = _dataFinal;
            ID_EMPRESA = _ID_EMPRESA;
        }

        #region Recebimentos associados a vendas

        public List<RECEBIMENTOS_ASSOCIADOS_A_VENDA> Recebimentos_com_venda_associada()
        {
            List<decimal> STATUS = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                    where (linha.STATUS_ESPECIFICO_ITEM_COMPRA == 2
                                    || linha.STATUS_ESPECIFICO_ITEM_COMPRA == 3
                                    || linha.STATUS_ESPECIFICO_ITEM_COMPRA == 6)
                                    select linha.CODIGO_STATUS_COMPRA).ToList();

            var itens_compra = (from linha in ctx.TB_PEDIDO_COMPRAs
                                where STATUS.Contains(linha.STATUS_ITEM_COMPRA.Value)

                                && ((from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                     where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                     && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                     select linha1.QTDE_RECEBIDA).Sum() < linha.QTDE_ITEM_COMPRA

                                     ||

                                    !(from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                      where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                      && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                      select linha1).Any())

                                   && (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                       where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                       && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                       && linha1.TB_PEDIDO_VENDA.ENTREGA_PEDIDO < dataFinal.AddDays(1)
                                       select linha1).Any()

                                select new
                                {
                                    linha.NUMERO_PEDIDO_COMPRA,
                                    linha.NUMERO_ITEM_COMPRA
                                }).ToList();

            List<decimal> NUMEROS_PEDIDO_COMPRA = new List<decimal>();
            List<decimal> NUMEROS_ITENS_COMPRA = new List<decimal>();

            foreach (var item in itens_compra)
            {
                NUMEROS_PEDIDO_COMPRA.Add(item.NUMERO_PEDIDO_COMPRA);
                NUMEROS_ITENS_COMPRA.Add(item.NUMERO_ITEM_COMPRA);
            }

            List<decimal?> STATUS_NF = new List<decimal?>();
            STATUS_NF.Add(2);
            STATUS_NF.Add(3);

            var query = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                         where NUMEROS_PEDIDO_COMPRA.Contains(linha.NUMERO_PEDIDO_COMPRA)
                         && NUMEROS_ITENS_COMPRA.Contains(linha.NUMERO_ITEM_COMPRA)

                         select new RECEBIMENTOS_ASSOCIADOS_A_VENDA()
                         {
                             NUMERO_PEDIDO_COMPRA = linha.NUMERO_PEDIDO_COMPRA,
                             NUMERO_ITEM_COMPRA = linha.NUMERO_ITEM_COMPRA,
                             NUMERO_PEDIDO_VENDA = linha.NUMERO_PEDIDO_VENDA,
                             NUMERO_ITEM_VENDA = linha.NUMERO_ITEM_VENDA,
                             ID_CLIENTE = linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO,

                             VALOR_PEDIDO_VENDA = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                   && linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4

                                                   select linha1.VALOR_TOTAL_ITEM_PEDIDO).Sum(),

                             CLIENTE_INADIMPLENTE = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER,
                                linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO.Value,
                                ctx, ID_EMPRESA),

                             FREQUENCIA_DE_COMPRA = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                     where linha1.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO
                                                     && (linha1.ENTREGA_PEDIDO >= DateTime.Today.AddMonths(-6) && linha1.ENTREGA_PEDIDO < DateTime.Today)
                                                     && STATUS_NF.Contains(linha1.TB_STATUS_PEDIDO.STATUS_ESPECIFICO)
                                                     select linha1.NUMERO_PEDIDO).Distinct().Count(),

                             VALOR_6_MESES = (from linha1 in ctx.TB_NOTA_SAIDAs
                                              where linha1.CODIGO_CLIENTE_NF == linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO
                                              && (linha1.DATA_EMISSAO_NF >= DateTime.Today.AddMonths(-6) && linha1.DATA_EMISSAO_NF < DateTime.Today)
                                              && STATUS_NF.Contains(linha1.STATUS_NF)
                                              select linha1.TOTAL_SERVICOS_NF).Sum(),

                             CLIENTE = linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim(),

                             FORNECEDOR = linha.TB_PEDIDO_COMPRA.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim(),

                             CODIGO_PRODUTO = linha.TB_PEDIDO_VENDA.CODIGO_PRODUTO_PEDIDO.Trim(),

                             DATA_ENTREGA = linha.TB_PEDIDO_VENDA.ENTREGA_PEDIDO

                         }).Where(v => v.VALOR_PEDIDO_VENDA > (decimal)0.00).ToList();

            foreach (var item in query)
            {
                item.PESO_DE_IMPORTANCIA = item.VALOR_PEDIDO_VENDA.HasValue ?
                    item.VALOR_PEDIDO_VENDA.Value : 0;

                item.PESO_DE_IMPORTANCIA += item.VALOR_6_MESES.HasValue ?
                    item.VALOR_6_MESES.Value : 0;

                item.PESO_DE_IMPORTANCIA += item.MARGEM_MEDIA.HasValue ?
                    item.MARGEM_MEDIA.Value : 0;

                item.PESO_DE_IMPORTANCIA += item.FREQUENCIA_DE_COMPRA.HasValue ?
                    item.FREQUENCIA_DE_COMPRA.Value : 0;
            }

            var retorno = (from linha in query
                           orderby linha.DATA_ENTREGA, linha.CLIENTE_INADIMPLENTE, linha.PESO_DE_IMPORTANCIA descending
                           select linha).ToList();

            return retorno;
        }

        #endregion

        #region Relatorio

        public string listaRelatorio()
        {
            List<RECEBIMENTOS_ASSOCIADOS_A_VENDA> lista = Recebimentos_com_venda_associada();

            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape))
            {
                r.DefineCabecalho("Ordem de recebimento e confer&ecirc;ncia de produtos", 60);

                StringBuilder _conteudo = new StringBuilder();

                _conteudo.Append("<table style='width: 95%; font-family: tahoma; font-size: 8pt;'>");

                _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>N&ordm; Pedido Compra</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>C&oacute;digo Produto</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Fornecedor</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>Entrega para o cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>Margem m&eacute;dia</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>Frequ&ecirc;ncia de compra</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Inadimpl&ecirc;ncia</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>Ordem</td>
                                  </tr>");

                foreach (var item in lista)
                {
                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0; text-align: center;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{5}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{6}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{7}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; width: 60px;'>{8}</td>
                                      </tr>", item.NUMERO_PEDIDO_COMPRA.ToString(),
                                        item.CODIGO_PRODUTO,
                                        item.FORNECEDOR,
                                        item.CLIENTE,

                                        ApoioXML.TrataData2(item.DATA_ENTREGA),

                                            item.MARGEM_MEDIA.Value.ToString("p"),

                                        Convert.ToInt32(item.FREQUENCIA_DE_COMPRA).ToString(),
                                        item.CLIENTE_INADIMPLENTE.Value.ToString("c"),"&nbsp;"));
                }

                _conteudo.Append("</table>");

                r.InsereConteudo(_conteudo.ToString());

                retorno = r.SalvaDocumento("Doran_Lista_Ordem_Recebimento");
            }

            return retorno;
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

    public class RECEBIMENTOS_ASSOCIADOS_A_VENDA
    {
        public RECEBIMENTOS_ASSOCIADOS_A_VENDA() { }

        public decimal NUMERO_PEDIDO_COMPRA { get; set; }
        public decimal NUMERO_ITEM_COMPRA { get; set; }
        public decimal NUMERO_PEDIDO_VENDA { get; set; }
        public decimal NUMERO_ITEM_VENDA { get; set; }
        public decimal? ID_CLIENTE { get; set; }
        public decimal? VALOR_PEDIDO_VENDA { get; set; }
        public decimal? VALOR_6_MESES { get; set; }
        public decimal? MARGEM_MEDIA { get; set; }
        public decimal? CLIENTE_INADIMPLENTE { get; set; }
        public decimal? FREQUENCIA_DE_COMPRA { get; set; }
        public decimal PESO_DE_IMPORTANCIA { get; set; }
        public string CLIENTE { get; set; }
        public string FORNECEDOR { get; set; }
        public string CODIGO_PRODUTO { get; set; }
        public DateTime? DATA_ENTREGA { get; set; }
    }
}