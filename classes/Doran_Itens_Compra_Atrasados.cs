using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Itens_Compra_Atrasados : IDisposable
    {

        public DateTime dataLimite { get; set; }
        public string FORNECEDOR { get; set; }

        public Doran_Itens_Compra_Atrasados()
        {
       }

        public string Lista_Relatorio(decimal ID_EMPRESA)
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Itens de compra com entrega atrasada", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA descending

                                 where linha.PREVISAO_ENTREGA_ITEM_COMPRA < dataLimite &&
                                 (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                                  linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3 ||
                                  linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 6)

                                  && (linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Contains(FORNECEDOR) ||
                                  linha.TB_FORNECEDOR.NOME_FORNECEDOR.Contains(FORNECEDOR))

                                 select new
                                 {
                                     linha.NUMERO_PEDIDO_COMPRA,
                                     linha.DATA_ITEM_COMPRA,
                                     linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                     linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                     linha.CODIGO_PRODUTO_COMPRA,
                                     linha.QTDE_ITEM_COMPRA,
                                     linha.UNIDADE_ITEM_COMPRA,

                                     QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                                      orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                      where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                      && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                      select linha1.QTDE_RECEBIDA).Any() ?

                                                      (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                                       orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                       where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                       && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                       select linha1.QTDE_RECEBIDA).Sum() : 0

                                 }).ToList();

                    string _conteudo = "<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>";

                    _conteudo += @"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>N&ordm; do Pedido</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Fornecedor</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Produto</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Un.</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Qtde. pedida</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Qtde. faltante</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Dias de atraso</td>
                                  </tr>";

                    foreach (var item in query)
                    {
                        TimeSpan ts = DateTime.Today.Subtract(item.PREVISAO_ENTREGA_ITEM_COMPRA.Value);

                        int dias = ts.Days;

                        _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0; text-align: center;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{5}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{6}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{7}</td>
                                      </tr>", item.NUMERO_PEDIDO_COMPRA.ToString(),
                                            item.NOME_FANTASIA_FORNECEDOR.Trim(),
                                            item.CODIGO_PRODUTO_COMPRA.Trim(),
                                            item.UNIDADE_ITEM_COMPRA,
                                            ((decimal)item.QTDE_ITEM_COMPRA).ToString("n"),
                                            ((decimal)(item.QTDE_ITEM_COMPRA - item.QTDE_RECEBIDA)).ToString("n"),
                                            ApoioXML.TrataData2(item.PREVISAO_ENTREGA_ITEM_COMPRA),
                                            ts.Days.ToString());
                    }

                    _conteudo += "</table>";

                    r.InsereConteudo(_conteudo);

                    retorno = r.SalvaDocumento("Doran_Itens_Compra_Nao_Entregues");
                }

                return retorno;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}
