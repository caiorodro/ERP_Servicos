using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using iTextSharp.text.pdf;
using System.Configuration;
using Doran_Servicos_ORM;
using System.IO;
using iTextSharp.text;
using Doran_Base;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Impressao_Pedido_Compra_Novo : IDisposable
    {
        private StringBuilder htmlPEDIDO { get; set; }
        private string _Arquivo;

        private decimal NUMERO_PEDIDO_COMPRA { get; set; }
        private decimal CODIGO_FORNECEDOR { get; set; }
        private List<decimal> _ITENS { get; set; }

        private string NOME_FORNECEDOR { get; set; }
        private string arquivo_final { get; set; }

        List<PdfReader> documentos;

        private string LOGOTIPO { get; set; }


        public Doran_Impressao_Pedido_Compra_Novo(decimal _NUMERO_PEDIDO_COMPRA, decimal _CODIGO_FORENCEDOR, List<decimal> ITENS_COMPRA)
        {
            NUMERO_PEDIDO_COMPRA = _NUMERO_PEDIDO_COMPRA;
            CODIGO_FORNECEDOR = _CODIGO_FORENCEDOR;
            _ITENS = ITENS_COMPRA;

            htmlPEDIDO = new StringBuilder();
            _Arquivo = "";

            documentos = new List<PdfReader>();
        }

        public List<object> Imprime_Pedido_Fornecedor(decimal ID_CONTA_EMAIL, string CNPJ_EMITENTE, decimal ID_USUARIO, string LOGIN_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx1.TB_CONFIG_VENDAs
                             where linha.ID_CONFIGURACAO_VENDAS == 1
                             select linha.LOGOTIPO_ORCAMENTO_VENDAS).ToList();

                foreach (var item in query)
                {
                    LOGOTIPO = ConfigurationManager.AppSettings["PastaVirtual"] + item.Trim();
                }
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var STATUS_CONFIRMADO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                         where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 6
                                         select linha.CODIGO_STATUS_COMPRA).ToList().First();

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.NUMERO_ITEM_COMPRA == _ITENS[0]
                             && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR

                             select linha).ToList();

                foreach (var item in query)
                {
                    TB_EMITENTE EMITENTE = new TB_EMITENTE();

                    Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext();

                    EMITENTE = (from linha in ctx1.TB_EMITENTEs
                                orderby linha.CNPJ_EMITENTE
                                where linha.CNPJ_EMITENTE == CNPJ_EMITENTE

                                select linha).ToList().First();

                    htmlPEDIDO.Append(@"<table border=""0"" width=""770""><tbody>
<tr>
<td>&nbsp; </td>
<td align=""right""><b>Cota&ccedil;&atilde;o de Compra N&ordm;</b>" + item.NUMERO_PEDIDO_COMPRA.ToString() + @" </td>
<td align=""right"">" + ApoioXML.TrataData2(item.DATA_ITEM_COMPRA) + @"</td>
<td align=""right""></td></tr></tbody></table>
<hr align=""left"" width=""770"">
<table border=""0"" width=""770"">
<tbody>
<tr>
<td><img src='" + LOGOTIPO + @"'></td>
<td></td></tr>
<tr>
<td valign=""top"">" + EMITENTE.NOME_EMITENTE.Trim() + @"<br>" + EMITENTE.ENDERECO_EMITENTE.Trim() + " " + EMITENTE.NUMERO_END_EMITENTE.Trim() + " " + EMITENTE.COMPLEMENTO_END_EMITENTE.Trim() + "<br />" + EMITENTE.TB_MUNICIPIO.NOME_MUNICIPIO.Trim() + @" - " + EMITENTE.TB_MUNICIPIO.TB_UF.SIGLA_UF + @" - BRASIL<br><b>Tel.:</b>" + EMITENTE.TELEFONE_EMITENTE.Trim() + " - <b>Fax:</b>" + EMITENTE.FAX_EMITENTE.Trim() + "<br><b>CNPJ:</b>" + EMITENTE.CNPJ_EMITENTE.Trim() + "<br><br><b>Contato(a):</b>" + LOGIN_USUARIO.Trim() + "<br><b>e-mail:</b> " + EMITENTE.EMAIL_EMITENTE.Trim() + @" - <b>site:</b>http://www.indufix.com.br<br></td>
<td style=""BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-TOP: 1px solid; BORDER-RIGHT: 1px solid"" valign=""top""><b>Fornecedor:</b><br>" + item.CODIGO_FORNECEDOR.ToString() + @" - " + item.TB_FORNECEDOR.NOME_FORNECEDOR.Trim() + "<br>" + item.TB_FORNECEDOR.ENDERECO_FORNECEDOR.Trim() + " " + item.TB_FORNECEDOR.NUMERO_END_FORNECEDOR.Trim() + " " + item.TB_FORNECEDOR.COMPL_END_FORNECEDOR.Trim() + "<br>" + item.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO.Trim() + " - " + item.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF + " - " + item.TB_FORNECEDOR.CEP_FORNECEDOR.Trim() + "<br><b>CNPJ:</b>" + item.TB_FORNECEDOR.CNPJ_FORNECEDOR.Trim() + " - <b>I.E.:</b>" + item.TB_FORNECEDOR.IE_FORNECEDOR.Trim() + "<br><b>Contato: </b>" + item.TB_FORNECEDOR.CONTATO_FORNECEDOR.Trim() + "<br><b>Telefone:</b>" + item.TB_FORNECEDOR.TELEFONE1_FORNECEDOR.Trim() + " <br><strong>e-mail:</strong> " + item.TB_FORNECEDOR.EMAIL_FORNECEDOR.Trim() + @"</td></tr></tbody></table><br>
<table style=""BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-TOP: 1px solid; BORDER-RIGHT: 1px solid"" width=""770"">
<tbody>
<tr>
<td><b>Condições de Fornecimento</b><br><br><b>Pagamento:</b>" + item.TB_COND_PAGTO.DESCRICAO_CP.Trim() + @"</td>
<td><br></td></tr></tbody></table>
<div style=""TEXT-ALIGN: center; WIDTH: 770px; HEIGHT: 40px""></div>
<table style=""BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-TOP: 1px solid; BORDER-RIGHT: 1px solid"" width=""770"">
<tbody>
<tr>
<td style=""BORDER-BOTTOM: 1px solid""><b>Produto</b> </td>
<td style=""BORDER-BOTTOM: 1px solid""><b>C&oacute;digo</b> </td>
<td style=""BORDER-BOTTOM: 1px solid"" align=""middle""><b>UN</b> </td>
<td style=""BORDER-BOTTOM: 1px solid"" align=""right""><b>Qtde.</b> </td>
<td style=""BORDER-BOTTOM: 1px solid"" align=""right""><b>Pre&ccedil;o</b> </td>
<td style=""BORDER-BOTTOM: 1px solid"" align=""right""><b>Total Item</b> </td>
<td style=""BORDER-BOTTOM: 1px solid"" align=""middle""><b>Entrega</b> </td></tr>
");

                    NOME_FORNECEDOR = item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim();
                    NOME_FORNECEDOR = NOME_FORNECEDOR.Replace(" ", "_");
                    NOME_FORNECEDOR = ApoioXML.TrataSinais(NOME_FORNECEDOR);

                    ctx1.Dispose();
                }

                // Produtos

                decimal TOTAL_PRODUTOS = 0;
                decimal TOTAL_ICMS = 0;
                decimal TOTAL_ICMS_ST = 0;
                decimal TOTAL_IPI = 0;
                decimal TOTAL_PEDIDO = 0;

                var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs

                              where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && _ITENS.Contains(linha.NUMERO_ITEM_COMPRA)
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR

                              select linha).ToList();

                foreach (var item in query1)
                {
                    decimal PRECO_FINAL = 0;

                    if (item.TIPO_DESCONTO_ITEM_COMPRA == 1)
                        PRECO_FINAL = (decimal)item.PRECO_FINAL_FORNECEDOR - (decimal)item.VALOR_DESCONTO_ITEM_COMPRA;
                    else
                        PRECO_FINAL = Math.Round((decimal)item.PRECO_FINAL_FORNECEDOR * (1 - ((decimal)item.VALOR_DESCONTO_ITEM_COMPRA / 100)), 4);


                    string VENDEDOR = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                       where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                       && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                       select linha).Any() ?

                                       (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                        where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                       && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                        select linha.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR).First().Trim() :

                                       string.Empty;

                    VENDEDOR = VENDEDOR.Length > 0 ?
                        "<br />Vendedor(a): " + VENDEDOR : "";

                    htmlPEDIDO.Append(@"<tr style=""border-bottom: solid 1px;"">
<td style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim() + VENDEDOR + @"
</td>
<td style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + item.CODIGO_PRODUTO_COMPRA.Trim() + @"
</td>
<td style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + item.UNIDADE_ITEM_COMPRA + @"
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + ((decimal)item.QTDE_ITEM_COMPRA).ToString("n") + @"
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + PRECO_FINAL.ToString().Valor_Moeda(4) + @"
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + ((decimal)item.VALOR_TOTAL_ITEM_COMPRA).ToString("c") + @"
</td>
<td align=""center"" style=""border-left-width: 1px; border-left-style: solid; font-size: 9pt;"" valign=""top"">
" + ApoioXML.TrataData2(item.PREVISAO_ENTREGA_ITEM_COMPRA) + @"
</td>
</tr>
");

                    if (item.OBS_ITEM_COMPRA.Length > 0)
                    {
                        htmlPEDIDO.Append(@"<tr>
<td style=""BORDER-BOTTOM: 1px solid"" colspan=7>" + item.OBS_ITEM_COMPRA + @"</td>
</tr>");
                    }

                    TOTAL_PRODUTOS += (decimal)item.VALOR_TOTAL_ITEM_COMPRA;
                    TOTAL_ICMS += (decimal)item.VALOR_ICMS_ITEM_COMPRA;
                    TOTAL_ICMS_ST += (decimal)item.VALOR_ICMS_ST_ITEM_COMPRA;
                    TOTAL_IPI += (decimal)item.VALOR_IPI_ITEM_COMPRA;
                    TOTAL_PEDIDO += (decimal)item.VALOR_TOTAL_ITEM_COMPRA +
                        (decimal)item.VALOR_IPI_ITEM_COMPRA +
                        (decimal)item.VALOR_ICMS_ST_ITEM_COMPRA;

                    if (StatusEspecifico(item.STATUS_ITEM_COMPRA) == 2)
                    {
                        item.STATUS_ITEM_COMPRA = STATUS_CONFIRMADO; // Pedido Confirmado

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                htmlPEDIDO.Append(@"</tbody></table>
<hr align=""left"" width=""770"">

<table width=""770"">
<tbody>
<tr>
<td style=""WIDTH: 50%""></td>
<td>
<table width=""100%"">
<tbody>
<tr>
<td align=""right""><b>Sub Total:</b> </td>
<td align=""right"">" + TOTAL_PRODUTOS.ToString("c") + @"</td></tr>
<tr>
<td align=""right""><b>Total de IPI:</b> </td>
<td align=""right"">" + TOTAL_IPI.ToString("c") + @"</td></tr>
<tr>
<td align=""right""><b>Total de ICMS:</b> </td>
<td align=""right"">" + TOTAL_ICMS.ToString("c") + @"</td></tr>
<tr>
<td align=""right""><b>Total de ICMS ST:</b> </td>
<td align=""right"">" + TOTAL_ICMS_ST.ToString("c") + @"</td></tr>
<tr>
<td align=""right""><b>Total do Pedido:</b> </td>
<td align=""right"">" + TOTAL_PEDIDO.ToString("c") + " </td></tr></tbody></table></td></tr></tbody></table>");

                ctx.SubmitChanges();
            }

            Grava_PDF_Pedido(htmlPEDIDO);

            Merge(_Arquivo);

            List<object> retorno = new List<object>();

            retorno.Add(ConfigurationManager.AppSettings["PastaVirtualPDF"] + "PEDIDO_COTACAO_COMPRA_" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + ".pdf");

            using (Doran_ERP_Servicos_DadosDataContext ctx2 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query1 = (from linha in ctx2.TB_PEDIDO_COMPRAs
                              orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                              where linha.NUMERO_ITEM_COMPRA == _ITENS[0]
                              && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR

                              select linha).ToList();

                retorno.Add(query1.First().STATUS_ITEM_COMPRA);
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA);

                if (ID_CONTA_EMAIL > 0)
                {
                    string pdf = ConfigurationManager.AppSettings["PastaFisicaPDF"] + "PEDIDO_COTACAO_COMPRA_" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + ".pdf";

                    var pasta_anexos = (from linha in ctx2.GetTable<TB_EMAIL_CONTA>()
                                        where linha.ID_CONTA_EMAIL == ID_CONTA_EMAIL
                                        select linha.PASTA_ANEXOS).ToList().First();

                    arquivo_final = pasta_anexos.EndsWith("\\") ?
                        pasta_anexos + "PEDIDO_COTACAO_COMPRA_" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + ".pdf" :
                        pasta_anexos + "\\PEDIDO_COTACAO_COMPRA_" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + ".pdf";

                    File.Copy(pdf, arquivo_final, true);

                    retorno.Add(arquivo_final);
                }
            }

            return retorno;
        }

        private decimal? StatusEspecifico(decimal? ID_STATUS)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var retorno = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                               where linha.CODIGO_STATUS_COMPRA == ID_STATUS
                               select linha.STATUS_ESPECIFICO_ITEM_COMPRA).ToList().First();

                return retorno;
            }
        }

        private void Grava_PDF_Pedido(StringBuilder html)
        {
            _Arquivo = ConfigurationManager.AppSettings["PastaFisicaPDF"] + "PEDIDO_COTACAO_COMPRA_" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + ".pdf";

            string LicensaHtmlToPDF = Doran_Ambiente.LicensaHtmlToPDF();

            ExpertPdf.HtmlToPdf.PdfConverter objPDF = new ExpertPdf.HtmlToPdf.PdfConverter();
            objPDF.LicenseKey = LicensaHtmlToPDF;

            int fieldMargemSuperior = 0;
            int fieldMargemInferior = 0;
            int fieldMargemEsquerda = 0;
            int fieldMargemDireita = 0;

            objPDF.PdfDocumentOptions.PdfPageSize = ExpertPdf.HtmlToPdf.PdfPageSize.A4;
            objPDF.PdfDocumentOptions.PdfPageOrientation = ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait;

            objPDF.PdfDocumentOptions.FitWidth = false;
            objPDF.PdfDocumentOptions.TopMargin = fieldMargemSuperior;
            objPDF.PdfDocumentOptions.BottomMargin = fieldMargemInferior;
            objPDF.PdfDocumentOptions.LeftMargin = fieldMargemEsquerda;
            objPDF.PdfDocumentOptions.RightMargin = fieldMargemDireita;
            objPDF.PdfDocumentOptions.ShowFooter = false;
            objPDF.PdfDocumentOptions.ShowHeader = false;
            objPDF.AvoidImageBreak = true;
            objPDF.AvoidTextBreak = true;

            byte[] bytesPDF = objPDF.GetPdfBytesFromHtmlString(html.ToString());
            AdicionaParteDocumento(bytesPDF);

            objPDF = null;
        }

        public void AdicionaParteDocumento(string filename)
        {
            documentos.Add(new PdfReader(filename));
        }

        public void AdicionaParteDocumento(Stream pdfStream)
        {
            documentos.Add(new PdfReader(pdfStream));
        }

        public void AdicionaParteDocumento(byte[] pdfContents)
        {
            documentos.Add(new PdfReader(pdfContents));
        }

        public void AdicionaParteDocumento(PdfReader pdfDocument)
        {
            documentos.Add(pdfDocument);
        }

        public void Merge(string outputFilename)
        {
            Merge(new FileStream(outputFilename, FileMode.Create));
        }

        public void Merge(Stream outputStream)
        {
            Document newDocument = null;

            try
            {
                if (outputStream == null || !outputStream.CanWrite)
                    throw new Exception("Stream de bytes está nulo ou protegido.");

                newDocument = new Document();
                PdfWriter pdfWriter = PdfWriter.GetInstance(newDocument, outputStream);

                newDocument.Open();

                PdfContentByte pdfContentByte = pdfWriter.DirectContent;

                foreach (PdfReader pdfReader in documentos)
                {
                    for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                    {
                        newDocument.NewPage();
                        PdfImportedPage importedPage = pdfWriter.GetImportedPage(pdfReader, page);
                        pdfContentByte.AddTemplate(importedPage, 0, 0);
                    }
                }
            }
            finally
            {
                outputStream.Flush();

                if (newDocument != null)
                    newDocument.Close();

                outputStream.Close();
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}