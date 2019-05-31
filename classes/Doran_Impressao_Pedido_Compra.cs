using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Globalization;
using iTextSharp.text.pdf;
using System.Configuration;
using Doran_Servicos_ORM;
using System.IO;
using System.Data;
using iTextSharp.text;

using Doran_Base;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Impressao_Pedido_Compra : IDisposable
    {
        private decimal NUMERO_PEDIDO_COMPRA;
        private decimal _PAGINAS;
        private StringBuilder _htmlPEDIDO;
        private decimal PAGINA;
        private string _Arquivo;
        private decimal _NUMERO_ITENS_PRIMEIRA_PAGINA;
        private decimal _NUMERO_ITENS_PROXIMA_PAGINA;
        private string LOGOTIPO;
        private decimal CODIGO_FORNECEDOR;

        private string NOME_FORNECEDOR { get; set; }

        private List<decimal> ITENS_COMPRA;

        List<PdfReader> documentos;

        private CultureInfo info;

        private decimal ID_USUARIO { get; set; }
        private string LOGIN_USUARIO { get; set; }

        public Doran_Impressao_Pedido_Compra(decimal _NUMERO_PEDIDO_COMPRA, decimal _CODIGO_FORNECEDOR, List<decimal> _ITENS_COMPRA, 
            string _LOGIN_USUARIO, decimal _ID_USUARIO)
        {
            NUMERO_PEDIDO_COMPRA = _NUMERO_PEDIDO_COMPRA;
            CODIGO_FORNECEDOR = _CODIGO_FORNECEDOR;
            ITENS_COMPRA = _ITENS_COMPRA;
            LOGIN_USUARIO = _LOGIN_USUARIO;

            _PAGINAS = 0;
            PAGINA = 0;
            _htmlPEDIDO = new StringBuilder();
            _Arquivo = "";
            ID_USUARIO = _ID_USUARIO;

            documentos = new List<PdfReader>();

            info = CultureInfo.CurrentCulture;

            LOGOTIPO = "";
        }

        public List<object> Imprime_Pedido()
        {
            List<object> retorno = new List<object>();

            string str1 = "";

            string modeloORCAMENTO = ConfigurationManager.AppSettings["Modelo_COMPRA"];
            string modeloPEDIDO_ProximaPagina = ConfigurationManager.AppSettings["Modelo_COMPRA_ProximaPagina"];

            _NUMERO_ITENS_PRIMEIRA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PRIMEIRA_PAGINA_PEDIDO_COMPRA"]);
            _NUMERO_ITENS_PROXIMA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PROXIMA_PAGINA_PEDIDO_COMPRA"]);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var STATUS_CONFIRMADO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                         where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 6
                                         select linha.CODIGO_STATUS_COMPRA).ToList().First();

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                             where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR)
                             && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA < 7

                             select linha).ToList();

                int nItens = 0;

                foreach (var item in query)
                {
                    if (ITENS_COMPRA.Contains(item.NUMERO_ITEM_COMPRA))
                        nItens++;
                }

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
                    _htmlPEDIDO.Append(tr.ReadToEnd());
                }

                StringBuilder htmlPEDIDO = _htmlPEDIDO;
                htmlPEDIDO = SetaVariaveisPedido(htmlPEDIDO, true);

                StringBuilder linhaProduto = new StringBuilder();

                linhaProduto.Append(@"<tr>
<td style=""WIDTH: 362px"">#PRODUTO#</td>
<td style=""WIDTH: 80px"" align=""middle"">#QTDE#</td>
<td style=""WIDTH: 30px"" align=""middle"">#UN#</td>
<td style=""WIDTH: 80px"" align=""right"">#PRECO#</td>
<td style=""WIDTH: 30px"" align=""middle"">#DESCONTO#</td>
<td style=""WIDTH: 80px"" align=""right"">#PRECO_FINAL#</td>
<td style=""WIDTH: 98px"" align=""right"">#TOTAL#</td>
<td style=""WIDTH: 70px"" align=""right"">#IPI#</td>
<td style=""WIDTH: 70px"" align=""right"">#ICMS#</td>
<td style=""WIDTH: 70px"" align=""right"">#ICMS_ST#</td></tr></tbody></table>
<table style=""WIDTH: 1100px; font-family: Tahoma; font-size: 10pt;"">
<tbody>
<tr>
<td><b>Código do Fornecedor:</b>#CODIGO_ITEM_FORNECEDOR#</td>
<td><b>Peso:</b></td>
<td>#PESO_ITEM# Kgs</td>
<td><b>P.Venda:</b></td>
<td>#PEDIDO_VENDA#</td>
<td align=""right""><b>Entrega:</b></td>
<td>#ENTREGA#</td></tr>
<tr>
<td style=""BORDER-BOTTOM: #808080 1px solid"" colspan=""6""><b>Obs.:</b> #OBS_ITEM#</td></tr></tbody>");

                StringBuilder itemPEDIDO = new StringBuilder();
                int itens = 1;

                int _CONFIG_NUMERO_ITENS_NF = Convert.ToInt32(_NUMERO_ITENS_PRIMEIRA_PAGINA);

                foreach (var item in query)
                {
                    if (ITENS_COMPRA.Contains(item.NUMERO_ITEM_COMPRA))
                    {
                        if (itens > _CONFIG_NUMERO_ITENS_NF)
                        {
                            htmlPEDIDO = htmlPEDIDO.Replace(linhaProduto.ToString(), itemPEDIDO.ToString());

                            GravaPaginaPEDIDO(htmlPEDIDO);

                            _CONFIG_NUMERO_ITENS_NF = Convert.ToInt32(_NUMERO_ITENS_PROXIMA_PAGINA);
                            _htmlPEDIDO.Remove(0, _htmlPEDIDO.Length);

                            using (TextReader tr = new StreamReader(modeloPEDIDO_ProximaPagina))
                            {
                                _htmlPEDIDO.Append(tr.ReadToEnd());
                            }

                            htmlPEDIDO = SetaVariaveisPedido(_htmlPEDIDO, false);
                            itemPEDIDO.Remove(0, itemPEDIDO.Length);

                            itens = 1;
                        }

                        itemPEDIDO.Append(linhaProduto);

                        decimal PRECO_FINAL = 0;

                        if (item.TIPO_DESCONTO_ITEM_COMPRA == 1)
                            PRECO_FINAL = (decimal)item.PRECO_FINAL_FORNECEDOR - (decimal)item.VALOR_DESCONTO_ITEM_COMPRA;
                        else
                            PRECO_FINAL = Math.Round((decimal)item.PRECO_FINAL_FORNECEDOR * (1 - ((decimal)item.VALOR_DESCONTO_ITEM_COMPRA / 100)), 4);

                        string DESCRICAO_PRODUTO = string.Concat(item.CODIGO_PRODUTO_COMPRA.Trim(), " - ", item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim());

                        var xPEDIDOS = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                        orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA
                                        where linha1.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                        && linha1.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                        select linha1).ToList();

                        string PEDIDOS_VENDA = "";
                        string OBS_VENDAS = "";

                        foreach (var item1 in xPEDIDOS)
                        {
                            PEDIDOS_VENDA += string.Concat("<div style='align: center;'><b>P.V.</b>", item1.NUMERO_PEDIDO_VENDA.ToString(), "<br />",
                                                "<b>Qtde</b>", ApoioXML.Valor2_2((decimal)item1.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO),
                                                "&nbsp;", item1.TB_PEDIDO_VENDA.UNIDADE_ITEM_PEDIDO.Trim(), "</div>");

                            if (item1.TB_PEDIDO_VENDA.OBS_ITEM_PEDIDO.Trim().Length > 0)
                                OBS_VENDAS += string.Concat("[", item1.TB_PEDIDO_VENDA.OBS_ITEM_PEDIDO.Trim(), "]");
                        }

                        if (PEDIDOS_VENDA.Length > 0)
                            PEDIDOS_VENDA = PEDIDOS_VENDA.Substring(0, PEDIDOS_VENDA.Length - 3);

                        itemPEDIDO = itemPEDIDO.Replace("#PRODUTO#", string.Concat("<span style='font-size: 9pt;'>", DESCRICAO_PRODUTO, "</span>"));
                        itemPEDIDO = itemPEDIDO.Replace("#UN#", string.Concat("<span style='font-size: 9pt;'>", item.UNIDADE_ITEM_COMPRA.Trim(), "</span>"));
                        itemPEDIDO = itemPEDIDO.Replace("#QTDE#", string.Concat("<span style='font-size: 9pt;'>", ApoioXML.Valor2_2((decimal)item.QTDE_ITEM_COMPRA), "</span>"));

                        itemPEDIDO = itemPEDIDO.Replace("#PRECO#", ApoioXML.formata_Valor_Impressao((decimal)item.PRECO_FINAL_FORNECEDOR, 4));

                        itemPEDIDO = itemPEDIDO.Replace("#DESCONTO#", string.Concat("<span style='font-size: 9pt; text-align: center;'>", item.TIPO_DESCONTO_ITEM_COMPRA == 1 ?
                            ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_DESCONTO_ITEM_COMPRA, 2) :
                            ((decimal)item.VALOR_DESCONTO_ITEM_COMPRA / 100).ToString("p"), "</span>"));

                        itemPEDIDO = itemPEDIDO.Replace("#PRECO_FINAL#", ApoioXML.formata_Valor_Impressao(PRECO_FINAL, 4));

                        itemPEDIDO = itemPEDIDO.Replace("#TOTAL#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_TOTAL_ITEM_COMPRA, 2));

                        itemPEDIDO = itemPEDIDO.Replace("#ICMS#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_ICMS_ITEM_COMPRA, 2));
                        itemPEDIDO = itemPEDIDO.Replace("#ICMS_ST#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_ICMS_ST_ITEM_COMPRA, 2));
                        itemPEDIDO = itemPEDIDO.Replace("#IPI#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_IPI_ITEM_COMPRA, 2));

                        itemPEDIDO = itemPEDIDO.Replace("#CODIGO_ITEM_FORNECEDOR#", string.Concat("<span style='font-size: 9pt;'>", item.CODIGO_FORNECEDOR_ITEM_COMPRA.Trim(), "</span>"));

                        itemPEDIDO = itemPEDIDO.Replace("#OBS_ITEM#", string.Concat("<span style='font-size: 9pt;'>", item.OBS_ITEM_COMPRA.Trim(), OBS_VENDAS, "</span>"));
                        itemPEDIDO = itemPEDIDO.Replace("#ENTREGA#", string.Concat("<span style='font-size: 9pt;'>", ApoioXML.TrataData2(item.PREVISAO_ENTREGA_ITEM_COMPRA), "</span>"));

                        itemPEDIDO = itemPEDIDO.Replace("#PEDIDO_VENDA#", string.Concat("<span style='font-size: 9pt;'>", PEDIDOS_VENDA, "</span>"));

                        if (StatusEspecifico(item.STATUS_ITEM_COMPRA) == 2)
                        {
                            item.STATUS_ITEM_COMPRA = STATUS_CONFIRMADO; // Pedido Confirmado

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                        }

                        itens++;
                    }
                }

                ctx.SubmitChanges();

                htmlPEDIDO = htmlPEDIDO.Replace(linhaProduto.ToString(), itemPEDIDO.ToString());

                GravaPaginaPEDIDO(htmlPEDIDO);

                htmlPEDIDO = _htmlPEDIDO;

                Merge(_Arquivo);

                str1 = ConfigurationManager.AppSettings["PastaVirtualPDF"] + _Arquivo.Substring(_Arquivo.LastIndexOf("\\") + 1);

                retorno.Add(str1);
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query1 = (from linha in ctx1.TB_PEDIDO_COMPRAs
                              orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                              where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                              && linha.NUMERO_ITEM_COMPRA == ITENS_COMPRA[0]

                              select linha).ToList();

                retorno.Add(query1.First().STATUS_ITEM_COMPRA);
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add(query1.First().TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA);
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

        private StringBuilder SetaVariaveisPedido(StringBuilder html, bool PRIMEIRA_PAGINA)
        {
            html = html.Replace("#NUMERO_PEDIDO#", NUMERO_PEDIDO_COMPRA.ToString());
            html = html.Replace("#PAGINA#", (PAGINA + 1).ToString() + "/" + _PAGINAS.ToString());
            html = html.Replace("#DATA_EMISSAO#", ApoioXML.TrataData2(DateTime.Today));

            if (LOGOTIPO.Length > 0)
                html = html.Replace("#LOGOTIPO#", LOGOTIPO);

            html = html.Replace("#DATA_HORA#", ApoioXML.TrataDataHora2(DateTime.Now));

            if (PRIMEIRA_PAGINA)
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx1.TB_CONFIG_VENDAs
                                 where linha.ID_CONFIGURACAO_VENDAS == 1
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        html = html.Replace("#LOGOTIPO#",
                            "<img src='" + ConfigurationManager.AppSettings["PastaVirtual"] + item.LOGOTIPO_ORCAMENTO_VENDAS.Trim() + "' width=100>");

                        LOGOTIPO = "<img src='" + ConfigurationManager.AppSettings["PastaVirtual"] + item.LOGOTIPO_ORCAMENTO_VENDAS.Trim() + "' width=100>";
                    }
                }

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var item = (from linha in ctx.TB_PEDIDO_COMPRAs
                                orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                                where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR)

                                && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA < 7

                                select linha).ToList().First();

                    var _entrega = (from linha in ctx.TB_PEDIDO_COMPRAs
                                    orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                                    where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                    && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR)

                                    && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA < 7

                                    select linha.PREVISAO_ENTREGA_ITEM_COMPRA).Max();

                    var _fornecedor = (from linha in ctx.TB_PEDIDO_COMPRAs
                                       orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                                       where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                       && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR)

                                       && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA < 7

                                       select linha.TB_FORNECEDOR.NOME_FORNECEDOR).ToList().First();

                    html = html.Replace("#DATA_ENTREGA#", ApoioXML.TrataData2(_entrega));

                    html = html.Replace("#NOME_FORNECEDOR#", _fornecedor.Trim());
                    html = html.Replace("#USUARIO_IMPRESSAO#", LOGIN_USUARIO.ToUpper());

                    html = html.Replace("#COND_PAGTO#", item.TB_COND_PAGTO.DESCRICAO_CP.Trim());
                    html = html.Replace("#CONTATO#", item.CONTATO_COTACAO_FORNECEDOR.Trim());

                    html = html.Replace("#FRETE#", item.FRETE_COTACAO_FORNECEDOR == 0 ? "FOB" : "CIF");
                    html = html.Replace("#ULTIMA_COMPRA#", Ultima_Compra((decimal)item.CODIGO_FORNECEDOR));

                    //html = html.Replace("#OBS_PEDIDO#", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO.Trim());

                    NOME_FORNECEDOR = item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim();
                    NOME_FORNECEDOR = NOME_FORNECEDOR.Replace(" ", "_");
                    NOME_FORNECEDOR = ApoioXML.TrataSinais(NOME_FORNECEDOR);

                    using (Doran_Compras orc = new Doran_Compras(NUMERO_PEDIDO_COMPRA, ID_USUARIO))
                    {
                        DataTable dt = new DataTable();
                        dt.Columns.Add("NUMERO_PEDIDO_COMPRA");

                        DataRow nova = dt.NewRow();
                        nova[0] = NUMERO_PEDIDO_COMPRA;
                        dt.Rows.Add(nova);

                        var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                     orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                                     where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                     && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR)
                                     && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA < 7

                                     select linha).ToList();

                        decimal TOTAL_PRODUTOS = 0;
                        decimal TOTAL_IPI = 0;
                        decimal TOTAL_ICMS = 0;
                        decimal TOTAL_ICMS_ST = 0;
                        decimal TOTAL_FRETE = 0;
                        decimal TOTAL_PEDIDO = 0;

                        foreach (var item1 in query)
                        {
                            if (ITENS_COMPRA.Contains(item1.NUMERO_ITEM_COMPRA))
                            {
                                TOTAL_PRODUTOS += (decimal)item1.VALOR_TOTAL_ITEM_COMPRA;
                                TOTAL_IPI += (decimal)item1.VALOR_IPI_ITEM_COMPRA;
                                TOTAL_ICMS += (decimal)item1.VALOR_ICMS_ITEM_COMPRA;
                                TOTAL_ICMS_ST += (decimal)item1.VALOR_ICMS_ST_ITEM_COMPRA;
                                TOTAL_FRETE += (decimal)item1.VALOR_FRETE_COTACAO_FORNECEDOR;
                                TOTAL_PEDIDO += (decimal)item1.VALOR_TOTAL_ITEM_COMPRA +
                                    (decimal)item1.VALOR_ICMS_ST_ITEM_COMPRA + (decimal)item1.VALOR_IPI_ITEM_COMPRA;
                            }
                        }

                        html = html.Replace("#TOTAL_PRODUTOS#", TOTAL_PRODUTOS.ToString("c", CultureInfo.CurrentCulture));
                        html = html.Replace("#TOTAL_IPI#", TOTAL_IPI.ToString("c", CultureInfo.CurrentCulture));
                        html = html.Replace("#TOTAL_ICMS#", TOTAL_ICMS.ToString("c", CultureInfo.CurrentCulture));
                        html = html.Replace("#TOTAL_ICMS_ST#", TOTAL_ICMS_ST.ToString("c", CultureInfo.CurrentCulture));
                        html = html.Replace("#TOTAL_FRETE#", TOTAL_FRETE.ToString("c", CultureInfo.CurrentCulture));
                        html = html.Replace("#TOTAL_PEDIDO#", TOTAL_PEDIDO.ToString("c", CultureInfo.CurrentCulture));

                        // DataTable totais = orc.Calcula_Totais_Pedido(dt);
                    }
                }
            }

            return html;
        }

        private void GravaPaginaPEDIDO(StringBuilder html)
        {
            PAGINA++;

            _Arquivo = ConfigurationManager.AppSettings["PastaFisicaPDF"] + "PEDIDO_COMPRA" + NUMERO_PEDIDO_COMPRA.ToString() + "_" + NOME_FORNECEDOR + "_" + PAGINA.ToString() + ".pdf";
            string LicensaHtmlToPDF = Doran_Ambiente.LicensaHtmlToPDF();

            ExpertPdf.HtmlToPdf.PdfConverter objPDF = new ExpertPdf.HtmlToPdf.PdfConverter();
            objPDF.LicenseKey = LicensaHtmlToPDF;

            int fieldMargemSuperior = 0;
            int fieldMargemInferior = 0;
            int fieldMargemEsquerda = 0;
            int fieldMargemDireita = 0;

            objPDF.PdfDocumentOptions.PdfPageSize = ExpertPdf.HtmlToPdf.PdfPageSize.A4;
            objPDF.PdfDocumentOptions.PdfPageOrientation = ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape;
            objPDF.PageWidth = 1100;

            objPDF.PdfDocumentOptions.FitWidth = true;
            objPDF.PdfDocumentOptions.TopMargin = fieldMargemSuperior;
            objPDF.PdfDocumentOptions.BottomMargin = fieldMargemInferior;
            objPDF.PdfDocumentOptions.LeftMargin = fieldMargemEsquerda;
            objPDF.PdfDocumentOptions.RightMargin = fieldMargemDireita;
            objPDF.PdfDocumentOptions.ShowFooter = false;
            objPDF.PdfFooterOptions.ShowPageNumber = false;
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

                Rectangle a4 = PageSize.A4;
                Rectangle a4Landscape = a4.Rotate();

                newDocument = new Document(a4Landscape);
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

        private string Ultima_Compra(decimal CODIGO_FORNECEDOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_ENTRADAs
                             orderby linha.CODIGO_FORNECEDOR, linha.DATA_EMISSAO_NFE descending
                             where linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                             select linha.DATA_EMISSAO_NFE).ToList().Take(1);

                string retorno = "";

                foreach (var item in query)
                    retorno = ApoioXML.TrataData2(item);

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
