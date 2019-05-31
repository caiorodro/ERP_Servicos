using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using iTextSharp.text.pdf;
using System.Configuration;
using System.IO;
using System.Globalization;
using iTextSharp.text;
using Doran_Servicos_ORM;

using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Impressao_Orcamento_Cliente_Novo : IDisposable
    {
        private decimal _NUMERO_ORCAMENTO;
        private decimal _PAGINAS;
        private StringBuilder _htmlORCAMENTO;
        private decimal PAGINA;
        private string _Arquivo;
        private decimal _NUMERO_ITENS_PRIMEIRA_PAGINA;
        private decimal _NUMERO_ITENS_PROXIMA_PAGINA;
        private decimal ID_EMPRESA { get; set; }
        private decimal ID_USUARIO { get; set; }

        List<PdfReader> documentos;

        public string arquivo_final { get; set; }

        public Doran_Impressao_Orcamento_Cliente_Novo(decimal NUMERO_ORCAMENTO, decimal _ID_EMPRESA, decimal _ID_USUARIO)
        {
            _NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
            _PAGINAS = 0;
            PAGINA = 0;
            _htmlORCAMENTO = new StringBuilder();
            _Arquivo = "";

            ID_EMPRESA = _ID_EMPRESA;
            ID_USUARIO = _ID_USUARIO;

            documentos = new List<PdfReader>();
        }

        public string Imprime_Orcamento()
        {
            string str1 = "";

            string modeloORCAMENTO = ConfigurationManager.AppSettings["Modelo_ORCAMENTO"];
            string modeloORCAMENTO_ProximaPagina = ConfigurationManager.AppSettings["Modelo_ORCAMENTO_ProximaPagina"];

            _NUMERO_ITENS_PRIMEIRA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PRIMEIRA_PAGINA"]);
            _NUMERO_ITENS_PROXIMA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PROXIMA_PAGINA"]);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == _NUMERO_ORCAMENTO
                             select linha).ToList();

                int nItens = query.Count();

                int itens_com_margem_abaixo = query.Count(m => m.ITEM_APROVADO == 1);

                if (itens_com_margem_abaixo > 0)
                    throw new Exception("H&aacute; itens com margem de venda abaixo do permitido. <br />N&atilde;o &eacute; poss&iacute;vel imprimir o o&ccedil;amento");

                if (nItens < (_NUMERO_ITENS_PRIMEIRA_PAGINA + 1))
                {
                    _PAGINAS = 1;
                }
                else
                {
                    if (Convert.ToInt32((nItens - _NUMERO_ITENS_PRIMEIRA_PAGINA) % _NUMERO_ITENS_PROXIMA_PAGINA) > 0.00)
                        _PAGINAS = Convert.ToInt32((nItens - _NUMERO_ITENS_PRIMEIRA_PAGINA) / _NUMERO_ITENS_PROXIMA_PAGINA) + 2;
                    else
                        _PAGINAS = ((nItens - _NUMERO_ITENS_PRIMEIRA_PAGINA) / _NUMERO_ITENS_PROXIMA_PAGINA) + 1;
                }

                using (TextReader tr = new StreamReader(modeloORCAMENTO))
                {
                    _htmlORCAMENTO.Append(tr.ReadToEnd());
                }

                StringBuilder htmlORCAMENTO = _htmlORCAMENTO;
                htmlORCAMENTO = SetaVariaveisOrcamento(htmlORCAMENTO, true);

                StringBuilder linhaProduto = new StringBuilder();

                linhaProduto.Append(@"<tr style=""border-bottom: solid 1px;"">
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#DESCRICAO_PRODUTO#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#UNIDADE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#QTDE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#PRECO#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#TOTAL_ITEM#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#VALOR_ISS#
</td>
</tr>
<tr style=""border-bottom: solid 1px;"">
<td colspan=""9"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#OBS_ITEM#
</td>
</tr>");

                StringBuilder itemORCAMENTO = new StringBuilder();
                int itens = 1;

                int _CONFIG_NUMERO_ITENS_NF = Convert.ToInt32(_NUMERO_ITENS_PRIMEIRA_PAGINA);

                foreach (var item in query)
                {
                    if (itens > _CONFIG_NUMERO_ITENS_NF)
                    {
                        htmlORCAMENTO = htmlORCAMENTO.Replace(linhaProduto.ToString(), itemORCAMENTO.ToString());

                        GravaPaginaORCAMENTO(htmlORCAMENTO);

                        _CONFIG_NUMERO_ITENS_NF = Convert.ToInt32(_NUMERO_ITENS_PROXIMA_PAGINA);
                        _htmlORCAMENTO.Remove(0, _htmlORCAMENTO.Length);

                        using (TextReader tr = new StreamReader(modeloORCAMENTO_ProximaPagina))
                        {
                            _htmlORCAMENTO.Append(tr.ReadToEnd());
                        }

                        htmlORCAMENTO = SetaVariaveisOrcamento(_htmlORCAMENTO, false);
                        itemORCAMENTO.Remove(0, itemORCAMENTO.Length);

                        itens = 1;
                    }

                    itemORCAMENTO.Append(linhaProduto);

                    CultureInfo info = CultureInfo.CurrentCulture;

                    string DESCRICAO_PRODUTO = item.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim();

                    decimal PRECO_FINAL = item.TIPO_DESCONTO.Value == 0 ?
                        Math.Round(item.PRECO_PRODUTO.Value * (1 - (item.VALOR_DESCONTO.Value / 100)), 4) :
                        Math.Round(item.PRECO_PRODUTO.Value - item.VALOR_DESCONTO.Value, 4);

                    string dados_Entrega = string.Concat(@"<table style=""border-width: 1px; border-style: solid; font-name: tahoma; font-size: 9pt;""><tr><td><b>Origem</b><br />
            <b>Endere&ccedil;o:</b> ", item.ENDERECO_INICIAL_ITEM_ORCAMENTO.Trim(), " ", item.NUMERO_INICIAL_ITEM_ORCAMENTO.Trim(), " ", item.COMPL_INICIAL_ITEM_ORCAMENTO.Trim(), @"<br />
            <b>CEP:</b> ", item.CEP_INICIAL_ITEM_ORCAMENTO.Trim(), " - <b>Cidade:</b> ", item.CIDADE_INICIAL_ITEM_ORCAMENTO.Trim(), " - <b>Estado:</b> ", item.ESTADO_INICIAL_ITEM_ORCAMENTO.Trim(), @"</td>
            <td><td><b>Destino</b><br />
            <b>Endere&ccedil;o:</b> ", item.ENDERECO_FINAL_ITEM_ORCAMENTO.Trim(), " ", item.NUMERO_FINAL_ITEM_ORCAMENTO.Trim(), " ", item.COMPL_FINAL_ITEM_ORCAMENTO.Trim(), @"<br />
            <b>CEP:</b> ", item.CEP_FINAL_ITEM_ORCAMENTO.Trim(), " - <b>Cidade:</b> ", item.CIDADE_FINAL_ITEM_ORCAMENTO.Trim(), " - <b>Estado:</b> ", item.ESTADO_FINAL_ITEM_ORCAMENTO.Trim(), @"</td>
            </tr></table>");

                    itemORCAMENTO = itemORCAMENTO.Replace("#DESCRICAO_PRODUTO#", string.Concat("<span style='font-size: 9pt;'>", DESCRICAO_PRODUTO, "</span>"));
                    itemORCAMENTO = itemORCAMENTO.Replace("#UNIDADE#", string.Concat("<span style='font-size: 9pt;'>", item.UNIDADE_PRODUTO.Trim(), "</span>"));
                    itemORCAMENTO = itemORCAMENTO.Replace("#QTDE#", string.Concat("<span style='font-size: 9pt;'>", ApoioXML.Valor2((decimal)item.QTDE_PRODUTO), "</span>"));
                    itemORCAMENTO = itemORCAMENTO.Replace("#PRECO#", ApoioXML.formata_Valor_Impressao(PRECO_FINAL, 4));
                    itemORCAMENTO = itemORCAMENTO.Replace("#TOTAL_ITEM#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_TOTAL, 2));
                    itemORCAMENTO = itemORCAMENTO.Replace("#VALOR_ISS#", Math.Round(item.VALOR_TOTAL.Value * (item.ALIQ_ISS.Value / 100), 2, MidpointRounding.ToEven).ToString("c"));
                    itemORCAMENTO = itemORCAMENTO.Replace("#OBS_ITEM#", string.Concat(dados_Entrega, item.OBS_ITEM_ORCAMENTO.Trim().Length == 0 ?
                        "&nbsp;" : item.OBS_ITEM_ORCAMENTO.Trim(), "<br /><br />"));

                    itens += 1;
                }

                htmlORCAMENTO = htmlORCAMENTO.Replace(linhaProduto.ToString(), itemORCAMENTO.ToString());

                //////////////
                if (_PAGINAS == 1 && (query.Count - 7) > 16)
                {
                    htmlORCAMENTO.Append("<div style='page-break-after: always;'></div>");
                }

                if (_PAGINAS > 1)
                {
                    int ITENS_PROXIMAS_PAGINAS = query.Count - (int)_NUMERO_ITENS_PRIMEIRA_PAGINA;

                    int ITENS_ULTIMA_PAGINA = 0;

                    if (ITENS_PROXIMAS_PAGINAS > _NUMERO_ITENS_PROXIMA_PAGINA)
                    {
                        for (int i = 0; i < ITENS_PROXIMAS_PAGINAS; i += (int)_NUMERO_ITENS_PROXIMA_PAGINA)
                        {
                            ITENS_ULTIMA_PAGINA = i;
                        }

                        ITENS_ULTIMA_PAGINA = ITENS_PROXIMAS_PAGINAS - ITENS_ULTIMA_PAGINA;
                    }
                    else
                    {
                        ITENS_ULTIMA_PAGINA = ITENS_PROXIMAS_PAGINAS;
                    }

                    if ((ITENS_ULTIMA_PAGINA - 7) > 30)
                        htmlORCAMENTO.Append("<div style='page-break-after: always;'></div>");
                }

                string strTotais = @"<hr align=""left"" width=""770"">

<table width=""770"" style=""font-name: tahoma; font-size: 9pt;"">
<tbody>
<tr>
<td style=""WIDTH: 50%""></td>
<td>
<table width=""100%"">
<tbody>
<tr>
<td align=""right""><b>Sub Total:</b> </td>
<td align=""right"">#TOTAL_SERVICOS# </td></tr>
<tr>
<td align=""right""><b>Total de ISS:</b> </td>
<td align=""right"">#TOTAL_ISS# </td></tr>
<tr>
<td align=""right""><b>Total do Orçamento:</b> </td>
<td align=""right"">#TOTAL_ORCAMENTO# </td></tr></tbody></table></td></tr></tbody></table>";

                using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(_NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    Dictionary<string, object> totais = orc.Calcula_Totais_Orcamento();

                    strTotais = strTotais.Replace("#TOTAL_SERVICOS#", totais["VALOR_TOTAL"].ToString());
                    strTotais = strTotais.Replace("#TOTAL_ISS#", totais["VALOR_ISS"].ToString());
                    strTotais = strTotais.Replace("#TOTAL_ORCAMENTO#", totais["TOTAL_ORCAMENTO"].ToString());
                }

                htmlORCAMENTO.Append(strTotais);
                //////////////
                GravaPaginaORCAMENTO(htmlORCAMENTO);

                htmlORCAMENTO = _htmlORCAMENTO;

                Merge(_Arquivo);

                str1 = ConfigurationManager.AppSettings["PastaVirtualPDF"] + _Arquivo.Substring(_Arquivo.LastIndexOf("\\") + 1);

                arquivo_final = ConfigurationManager.AppSettings["PastaFisicaPDF"] + _Arquivo.Substring(_Arquivo.LastIndexOf("\\") + 1);
            }

            return str1;
        }

        private StringBuilder SetaVariaveisOrcamento(StringBuilder html, bool PRIMEIRA_PAGINA)
        {
            html = html.Replace("#NUMERO_ORCAMENTO#", _NUMERO_ORCAMENTO.ToString());
            html = html.Replace("#PAGINA#", (PAGINA + 1).ToString() + "/" + _PAGINAS.ToString());
            html = html.Replace("#DATA_EMISSAO#", string.Concat(DateTime.Today.Day.ToString().PadLeft(2, '0'), "/",
                DateTime.Today.Month.ToString().PadLeft(2, '0'), "/", DateTime.Today.Year.ToString()));

            if (PRIMEIRA_PAGINA)
            {
                decimal FATURAMENTO_MINIMO = 0;

                using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx1.TB_CONFIG_VENDAs
                                 where linha.ID_CONFIGURACAO_VENDAS == 1
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        html = html.Replace("#LOGOTIPO#",
                            "<img src='" + ConfigurationManager.AppSettings["PastaVirtual"] + item.LOGOTIPO_ORCAMENTO_VENDAS.Trim() + "'>");
                        FATURAMENTO_MINIMO = (decimal)item.VALOR_FATURAMENTO_MINIMO;
                    }
                }

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = (from linha1 in ctx.TB_EMITENTEs
                                  where linha1.CODIGO_EMITENTE == ID_EMPRESA
                                  select linha1).ToList();

                    foreach (var item in query1)
                    {
                        html = html.Replace("#RAZAO_SOCIAL_EMITENTE#", item.NOME_EMITENTE.Trim());
                        html = html.Replace("#CNPJ_EMITENTE#", item.CNPJ_EMITENTE.Trim());
                        html = html.Replace("#IE_EMITENTE#", item.IE_EMITENTE.Trim());

                        html = html.Replace("#ENDERECO_EMITENTE#",
                            string.Format("{0}, {1} {2}", item.ENDERECO_EMITENTE.Trim(), item.NUMERO_END_EMITENTE.Trim(),
                            item.COMPLEMENTO_END_EMITENTE.Trim()));

                        html = html.Replace("#CIDADE_EMITENTE#", item.TB_MUNICIPIO.NOME_MUNICIPIO.Trim());
                        html = html.Replace("#ESTADO_EMITENTE#", item.TB_MUNICIPIO.TB_UF.SIGLA_UF);
                        html = html.Replace("#PAIS_EMITENTE#", "BRASIL");

                        html = html.Replace("#CEP_EMITENTE#", item.CEP_EMITENTE.Trim());
                        html = html.Replace("#TELEFONE_EMITENTE#", item.TELEFONE_EMITENTE.Trim());
                        html = html.Replace("#FAX_EMITENTE#", item.FAX_EMITENTE.Trim());
                        html = html.Replace("#SITE#", item.SITE_EMITENTE.Trim());
                    }

                    var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == _NUMERO_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        html = html.Replace("#VENDEDOR#", string.Concat(item.TB_VENDEDORE.NOME_VENDEDOR.Trim(), " - <b>Tel.:</b>", item.TB_VENDEDORE.CELULAR_VENDEDOR.Trim()));
                        html = html.Replace("#EMAIL_VENDEDOR#", item.TB_VENDEDORE.EMAIL_VENDEDOR.Trim().ToLower());

                        html = html.Replace("#CODIGO_CLIENTE#", "0");
                        html = html.Replace("#NOME_CLIENTE#", item.CONTATO_ORCAMENTO.Trim());
                        html = html.Replace("#ENDERECO_CLIENTE#", "");

                        html = html.Replace("#CIDADE_CLIENTE#", "");
                        html = html.Replace("#ESTADO_CLIENTE#", item.TB_UF.SIGLA_UF.Trim());
                        html = html.Replace("#CEP_CLIENTE#", "");
                        html = html.Replace("#CNPJ_CLIENTE#", "");
                        html = html.Replace("#IE_CLIENTE#", "");
                        html = html.Replace("#CONTATO_CLIENTE#", item.CONTATO_ORCAMENTO.Trim());
                        html = html.Replace("#TELEFONE_CLIENTE#", item.TELEFONE_CONTATO.Trim());
                        html = html.Replace("#EMAIL_CLIENTE#", item.EMAIL_CONTATO.ToLower().Trim());

                        html = html.Replace("#CONDICAO_PAGAMENTO#", item.TB_COND_PAGTO.DESCRICAO_CP.Trim());
                        html = html.Replace("#VALIDADE_ORCAMENTO#", ApoioXML.TrataData2(item.VALIDADE_ORCAMENTO));
                        html = html.Replace("#FATURAMENTO_MINIMO#", FATURAMENTO_MINIMO.ToString("c"));
                        html = html.Replace("#OBS#", item.OBS_ORCAMENTO.Trim());
                    }
                }
            }

            return html;
        }

        private void GravaPaginaORCAMENTO(StringBuilder html)
        {
            PAGINA++;

            _Arquivo = ConfigurationManager.AppSettings["PastaFisicaPDF"] + "ORCAMENTO_" + _NUMERO_ORCAMENTO.ToString() + "_" + PAGINA.ToString() + ".pdf";
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