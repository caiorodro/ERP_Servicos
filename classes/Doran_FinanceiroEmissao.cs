using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_FinanceiroEmissao : IDisposable
    {
        public DateTime DataInicial
        {
            get;
            set;
        }

        public DateTime DataFinal
        {
            get;
            set;
        }
        
        private decimal ID_EMPRESA { get; set; }

        public decimal Banco { get; set; }

        public Doran_FinanceiroEmissao(DateTime dt1, DateTime dt2, decimal _ID_EMPRESA)
        {
            DataInicial = dt1;
            DataFinal = dt2;

            DataFinal = DataFinal.AddDays(1);

            Banco = 0;

            ID_EMPRESA = _ID_EMPRESA;
        }

        public string MontaRelatorioEmissao()
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                DateTime df = DataFinal.AddSeconds(-1);

                string nome_banco = "";

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    if (Banco > 0)
                    {
                        nome_banco = (from linha in ctx.TB_BANCOs
                                      where linha.NUMERO_BANCO == Banco
                                      select linha.NOME_BANCO.Trim()).ToList().First().Trim();
                    }
                }

                string cabecalho = string.Format("Relat&oacute;rio T&iacute;tulos a Receber por Emiss&atilde;o<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />{2}</span>",
                    ApoioXML.TrataData2(DataInicial), ApoioXML.TrataData2(df), Banco > 0 ? "Banco: " + nome_banco : "");

                r.DefineCabecalho(cabecalho, 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    DateTime _dt = DataInicial;

                    StringBuilder _conteudo = new StringBuilder();
                    
                    _conteudo.Append("<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>NF / Duplicata</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Emiss&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Vencimento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Pagamento</td>

                                    <td style='BORDER-BOTTOM: 1px solid; width: 280px; border-color:#C0C0C0;'>Hist&oacute;rico</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor do T&iacute;tulo</td>
                                  </tr>");

                    var query = from linha in ctx.TB_FINANCEIROs
                                orderby linha.DATA_LANCAMENTO
                                where (linha.DATA_LANCAMENTO >= DataInicial
                                && linha.DATA_LANCAMENTO < DataFinal)
                                && linha.CODIGO_EMITENTE == ID_EMPRESA

                                && linha.CREDITO_DEBITO == 0

                                && (linha.NUMERO_BANCO == Banco || Banco == 0)

                                select new
                                {
                                    linha.NUMERO_FINANCEIRO,
                                    linha.NUMERO_SEQ_NF_SAIDA,
                                    linha.NUMERO_NF_SAIDA,
                                    linha.DATA_LANCAMENTO,
                                    linha.DATA_VENCIMENTO,
                                    linha.DATA_PAGAMENTO,
                                    linha.HISTORICO,
                                    linha.VALOR_TOTAL
                                };

                    decimal TOTAL_PERIODO = 0;

                    foreach (var item in query)
                    {
                        string pagamento = ApoioXML.Data((DateTime)item.DATA_PAGAMENTO) == "01/01/1901" ? "" : ApoioXML.Data((DateTime)item.DATA_PAGAMENTO);

                        _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{5}</td>
                                      </tr>", item.NUMERO_NF_SAIDA.ToString() + "/" + ApoioXML.LetrasDuplicatas_ERP_Servicos(item.NUMERO_SEQ_NF_SAIDA, 0, item.DATA_VENCIMENTO),
                                            ApoioXML.Data((DateTime)item.DATA_LANCAMENTO),
                                            ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                            pagamento,
                                            item.HISTORICO.Trim(),
                                            ApoioXML.Valor2((decimal)item.VALOR_TOTAL)));

                        TOTAL_PERIODO += (decimal)item.VALOR_TOTAL;
                    }

                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='font-size: 7pt; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>Total:</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                      </tr>", ApoioXML.Valor2(TOTAL_PERIODO)));

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());
                    retorno = r.SalvaDocumento("Doran_Titulos_Receber_Emissao");
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
