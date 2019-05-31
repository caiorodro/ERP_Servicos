using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Relatorio_Centro_Custo : IDisposable
    {
        public DateTime data1 { get; set; }
        public DateTime data2 { get; set; }
        public string ID_PLANO { get; set; }
        public bool somenteTotais { get; set; }

        public Doran_Relatorio_Centro_Custo()
        {
        }

        public string Lista_Relatorio(decimal ID_EMPRESA)
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Relat&oacute;rio de contas pagas / recebidas por plano de contas", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_PLANO_CONTAs
                                 where linha.ID_PLANO == ID_PLANO || string.IsNullOrEmpty(ID_PLANO)
                                 select linha).ToList();

                    StringBuilder _conteudo = new StringBuilder();

                    _conteudo.Append("<table style='width: 75%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>C&oacute;digo</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Plano</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Hist&oacute;rico</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Data Pagto</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Valor Pago</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Valor Recebido</td>
                                  </tr>");

                    foreach (var item in query)
                    {
                        var contas = (from linha in ctx.TB_FINANCEIROs
                                      orderby linha.ID_PLANO, linha.DATA_PAGAMENTO
                                      where linha.ID_PLANO == item.ID_PLANO

                                      && (linha.DATA_PAGAMENTO >= data1
                                      && linha.DATA_PAGAMENTO < data2.AddDays(1))

                                      select linha).ToList();

                        decimal total_pago = 0;
                        decimal total_recebido = 0;

                        foreach (var item1 in contas)
                        {
                            if (!somenteTotais)
                            {
                                _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0; text-align: center;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: center;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: right;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: right;'>{5}</td>
                                      </tr>", item1.ID_PLANO.ToString(),
                                                    item1.TB_PLANO_CONTA.DESCRICAO_PLANO.Trim(),
                                                    item1.HISTORICO,
                                                    ApoioXML.TrataData2(item1.DATA_PAGAMENTO),
                                                    item1.CREDITO_DEBITO == 0 ? 0.ToString("c") : item1.VALOR_TOTAL.Value.ToString("c"),
                                                    item1.CREDITO_DEBITO == 0 ? item1.VALOR_TOTAL.Value.ToString("c") : 0.ToString("c")));
                            }

                            total_pago += item1.CREDITO_DEBITO == 0 ? 0 : item1.VALOR_TOTAL.Value;
                            total_recebido += item1.CREDITO_DEBITO == 0 ? item1.VALOR_TOTAL.Value : 0;
                        }

                        if (total_pago > (decimal)0.00 || total_recebido > (decimal)0.00)
                        {
                            _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'colspan=4><b>Total plano:</b> {0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: right; font-weight: bold;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: right; font-weight: bold;'>{2}</td>
                                      </tr>",
                                            item.ID_PLANO.Trim() + " - " + item.DESCRICAO_PLANO.Trim(),
                                            total_pago.ToString("c"),
                                            total_recebido.ToString("c")));
                        }
                    }

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());

                    retorno = r.SalvaDocumento("Doran_Lista_Centro_Custo");
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
