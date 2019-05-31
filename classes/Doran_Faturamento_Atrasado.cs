using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Faturamento_Atrasado : IDisposable
    {
        public Doran_Faturamento_Atrasado()
        {
        }

        public string Lista_Relatorio(decimal ID_EMPRESA)
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;
                r.DefineCabecalho("Itens com faturamento atrasado", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    Array arr1 = new decimal[2] { 3, 4 };
                    List<decimal?> status = new List<decimal?>();

                    for (int i = 0; i < arr1.Length; i++)
                    {
                        status.Add((decimal)arr1.GetValue(i));
                    }

                    var query = (from linha in ctx.TB_PEDIDO_VENDAs

                                 where linha.ENTREGA_PEDIDO < DateTime.Today 
                                 && status.Contains(linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO)

                                 select new
                                 {
                                     linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                     linha.NUMERO_PEDIDO,
                                     linha.DATA_PEDIDO,
                                     linha.ENTREGA_PEDIDO,
                                     linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                     linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR,
                                     linha.CODIGO_PRODUTO_PEDIDO,
                                     linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                     linha.QTDE_A_FATURAR,
                                     linha.UNIDADE_ITEM_PEDIDO,
                                 }).ToList();

                    StringBuilder _conteudo = new StringBuilder();
                    
                    _conteudo.Append("<table style='width: 76%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Posição do Pedido</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>Nº Pedido</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Vendedor(a)</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Produto</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>Qtde. pedida</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>Qtde. faltante</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Un.</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: center;'>Dias de atraso</td>
                                  </tr>");

                    foreach (var item in query)
                    {
                        TimeSpan ts = DateTime.Today.Subtract(item.ENTREGA_PEDIDO.Value);

                        int dias = ts.Days;

                        _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{5}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{6}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{7}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{8}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{9}</td>
                                      </tr>", item.DESCRICAO_STATUS_PEDIDO.Trim(),
                                            item.NUMERO_PEDIDO.ToString(),
                                            item.NOMEFANTASIA_CLIENTE.Trim(),
                                            item.NOME_VENDEDOR.Trim(),
                                            item.CODIGO_PRODUTO_PEDIDO.Trim(),
                                            ((decimal)item.QTDE_PRODUTO_ITEM_PEDIDO).ToString("n"),
                                            ((decimal)(item.QTDE_PRODUTO_ITEM_PEDIDO - item.QTDE_A_FATURAR)).ToString("n"),
                                            item.UNIDADE_ITEM_PEDIDO.Trim(),
                                            ApoioXML.TrataData2(item.ENTREGA_PEDIDO),
                                            ts.Days.ToString()));
                    }

                    _conteudo.Append("<table>");

                    r.InsereConteudo(_conteudo.ToString());

                    retorno = r.SalvaDocumento("Doran_Faturamento_Atrasado");
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
