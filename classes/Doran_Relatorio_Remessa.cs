using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Relatorio_Remessa : IDisposable
    {
        public decimal NUMERO_BANCO { get; set; }
        public DateTime DATA_INICIAL { get; set; }
        public DateTime DATA_FINAL { get; set; }
        private decimal ID_EMPRESA { get; set; }
        
        public Doran_Relatorio_Remessa(decimal _ID_EMPRESA)
        {
            ID_EMPRESA = _ID_EMPRESA;
        }

        public string MontaRelatorioRemessa()
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                string nome_banco = "";

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    if (NUMERO_BANCO > 0)
                    {
                        nome_banco = (from linha in ctx.TB_BANCOs
                                      where linha.NUMERO_BANCO == NUMERO_BANCO
                                      select linha.NOME_BANCO.Trim()).ToList().First().Trim();
                    }

                    string cabecalho = string.Format("Relat&oacute;rio Remessa Banc&aacute;ria por Emiss&atilde;o<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />{2}</span>",
                        ApoioXML.TrataData2(DATA_INICIAL), ApoioXML.TrataData2(DATA_FINAL.AddDays(-1)), NUMERO_BANCO > 0 ? "Banco: " + nome_banco : "");

                    r.DefineCabecalho(cabecalho, 60);

                    DateTime _dt = DATA_INICIAL;

                    StringBuilder _conteudo = new StringBuilder();

                    _conteudo.Append("<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>NF / Duplicata</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Emiss&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Vencimento</td>

                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor do T&iacute;tulo</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Instru&ccedil;&atilde;o de Remessa</td>
                                  </tr>");

                    var query = from linha in ctx.TB_HISTORICO_CNABs

                                where linha.NUMERO_BANCO == NUMERO_BANCO
                                && (linha.DATA_HISTORICO >= DATA_INICIAL
                                && linha.DATA_HISTORICO < DATA_FINAL)

                                && linha.REMESSA_RETORNO == 0
                                && linha.TB_FINANCEIRO.CODIGO_CLIENTE > 0
                                && linha.TB_FINANCEIRO.CODIGO_EMITENTE == ID_EMPRESA

                                && linha.TB_FINANCEIRO.CREDITO_DEBITO == 0

                                select new
                                {
                                    linha.NUMERO_FINANCEIRO,
                                    linha.TB_FINANCEIRO.NUMERO_SEQ_NF_SAIDA,
                                    linha.TB_FINANCEIRO.NUMERO_NF_SAIDA,
                                    linha.TB_FINANCEIRO.DATA_LANCAMENTO,
                                    linha.TB_FINANCEIRO.DATA_VENCIMENTO,
                                    linha.TB_FINANCEIRO.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.TB_FINANCEIRO.VALOR_TOTAL,
                                    linha.TB_FINANCEIRO.TB_OCORRENCIA_BANCARIA_REMESSA.DESCRICAO_OCORRENCIA
                                };

                    decimal TOTAL_PERIODO = 0;

                    foreach (var item in query)
                    {
                        string duplicata = "";

                        if (NUMERO_BANCO == 237)
                        {
                            duplicata = Doran_Base.CNAB.FaTh2_Remessa_Bradesco.Duplicata(ctx, item.NUMERO_NF_SAIDA, item.DATA_VENCIMENTO);
                        }

                        if (NUMERO_BANCO == 1)
                        {
                            duplicata = Doran_Base.CNAB.FaTh2_Remessa_Brasil.Duplicata(ctx, item.NUMERO_NF_SAIDA, item.DATA_VENCIMENTO);
                        }

                        _conteudo.Append(string.Format(@"<tr>
                                        <td style='text-align: center; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='text-align: center; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='text-align: center; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{5}</td>
                                          </tr>", duplicata,
                                ApoioXML.Data((DateTime)item.DATA_LANCAMENTO),
                                ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                item.NOMEFANTASIA_CLIENTE.Trim(),
                                ((decimal)item.VALOR_TOTAL).ToString("c"),
                                item.DESCRICAO_OCORRENCIA.Trim()));


                        TOTAL_PERIODO += (decimal)item.VALOR_TOTAL;
                    }

                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>Total</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'></td>
                                      </tr>",
                                        ((decimal)TOTAL_PERIODO).ToString("c")));

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());
                    retorno = r.SalvaDocumento("Doran_Remessa_Bancaria");
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
