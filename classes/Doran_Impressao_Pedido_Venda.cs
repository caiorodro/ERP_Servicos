using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Configuration;
using System.IO;
using iTextSharp.text.pdf;
using System.Globalization;
using iTextSharp.text;
using System.Data;
using Doran_Servicos_ORM;

using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Impressao_Pedido_Venda : IDisposable
    {
        private decimal NUMERO_PEDIDO;
        private decimal _PAGINAS;
        private StringBuilder _htmlPEDIDO;
        private decimal PAGINA;
        private string _Arquivo;
        private decimal _NUMERO_ITENS_PRIMEIRA_PAGINA;
        private decimal _NUMERO_ITENS_PROXIMA_PAGINA;
        private string LOGOTIPO;
        private decimal LIDER { get; set; }
        private decimal ID_USUARIO { get; set; }

        List<PdfReader> documentos;

        private CultureInfo info;

        public Doran_Impressao_Pedido_Venda(decimal _NUMERO_PEDIDO, decimal _ID_USUARIO)
        {

            NUMERO_PEDIDO = _NUMERO_PEDIDO;
            Verifca_Permissao_Impressao();
            _PAGINAS = 0;
            PAGINA = 0;
            _htmlPEDIDO = new StringBuilder();
            _Arquivo = "";

            documentos = new List<PdfReader>();

            info = CultureInfo.CurrentCulture;

            LOGOTIPO = "";
            ID_USUARIO = _ID_USUARIO;
        }

        public string Imprime_Pedido(string LOGIN_USUARIO)
        {
            string str1 = "";

            string modeloORCAMENTO = ConfigurationManager.AppSettings["Modelo_PEDIDO"];
            string modeloPEDIDO_ProximaPagina = ConfigurationManager.AppSettings["Modelo_PEDIDO_ProximaPagina"];

            _NUMERO_ITENS_PRIMEIRA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PRIMEIRA_PAGINA_PEDIDO"]);
            _NUMERO_ITENS_PROXIMA_PAGINA = Convert.ToDecimal(ConfigurationManager.AppSettings["NUMERO_ITENS_PROXIMA_PAGINA_PEDIDO"]);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var GERENTE_COMERCIAL = (from linha in ctx.TB_USUARIOs
                                         where linha.ID_USUARIO == ID_USUARIO
                                         select linha).Any() ?

                                         (from linha in ctx.TB_USUARIOs
                                          where linha.ID_USUARIO == ID_USUARIO
                                          select linha.GERENTE_COMERCIAL).First() : 0;

                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                             select linha).ToList();

                int nItens = query.Count();

                decimal ITENS_RESTANTES = nItens > _NUMERO_ITENS_PRIMEIRA_PAGINA ?
                    nItens - _NUMERO_ITENS_PRIMEIRA_PAGINA :
                    0;

                if (ITENS_RESTANTES == 0)
                    _PAGINAS = 1;
                else
                {
                    decimal NR_PAGINAS_RESTANTES = Convert.ToInt32(ITENS_RESTANTES / _NUMERO_ITENS_PROXIMA_PAGINA);
                    _PAGINAS = NR_PAGINAS_RESTANTES + 1;
                }

                using (TextReader tr = new StreamReader(modeloORCAMENTO))
                {
                    _htmlPEDIDO.Append(tr.ReadToEnd());
                }

                StringBuilder htmlPEDIDO = _htmlPEDIDO;
                htmlPEDIDO = SetaVariaveisPedido(htmlPEDIDO, true, LOGIN_USUARIO);

                StringBuilder linhaProduto = new StringBuilder();

                linhaProduto.Append(@"<tr>
<td style=""WIDTH: 362px"">#PRODUTO#</td>
<td style=""WIDTH: 80px"" align=""middle"">#QTDE#</td>
<td style=""WIDTH: 30px"" align=""middle"">#UN#</td>
<td style=""WIDTH: 80px"" align=""right"">#CUSTO#</td>
<td style=""WIDTH: 60px"" align=""middle"">#MARGEM#</td>
<td style=""WIDTH: 80px"" align=""right"">#PRECO#</td>
<td style=""WIDTH: 98px"" align=""right"">#TOTAL#</td>
<td style=""WIDTH: 70px"" align=""right"">#IPI#</td>
<td style=""WIDTH: 70px"" align=""right"">#ICMS#</td>
<td style=""WIDTH: 70px"" align=""right"">#ICMS_ST#</td></tr></tbody></table>
<table style=""WIDTH: 1100px"">
<tbody>
<tr>
<td><b>Nr. Pedido do Cliente:</b> #NUMERO_ITEM_PEDIDO_CLIENTE#</td>
<td colspan=""2""><b>Código do Cliente:</b></td>
<td colspan=""2"">#CODIGO_ITEM_CLIENTE#</td>
<td colspan=""5""><b>Ordem Compra:</b> #ORDEM_COMPRA#</td></tr>
<tr>
<td style=""border-bottom-style: solid; border-bottom-width: 1px; border-color: #000000;"" colspan=""5""><b>Obs.:</b> #OBS_ITEM#</td>
<td style=""border-bottom-style: solid; border-bottom-width: 1px; border-color: #000000;"" align=""right""><b>Posição:</b></td>
<td style=""border-bottom-style: solid; border-bottom-width: 1px; border-color: #000000;"">#STATUS_PEDIDO#</td>
<td style=""border-bottom-style: solid; border-bottom-width: 1px; border-color: #000000;"" align=""right""><b>Entrega:</b></td>
<td style=""border-bottom-style: solid; border-bottom-width: 1px; border-color: #000000;"">#ENTREGA#</td></tr></tbody></table>
<div style=""TEXT-ALIGN: right"">
<table style=""WIDTH: 1100px"">
<tbody>");

                StringBuilder itemPEDIDO = new StringBuilder();
                int itens = 1;

                int _CONFIG_NUMERO_ITENS_NF = Convert.ToInt32(_NUMERO_ITENS_PRIMEIRA_PAGINA);

                foreach (var item in query)
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

                        htmlPEDIDO = SetaVariaveisPedido(_htmlPEDIDO, false, LOGIN_USUARIO);
                        itemPEDIDO.Remove(0, itemPEDIDO.Length);

                        itens = 1;
                    }

                    itemPEDIDO.Append(linhaProduto);

                    string Sugestao_Fornecedor = "";

                    var query1 = (from linha1 in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                  orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM_PEDIDO
                                  where (linha1.NUMERO_PEDIDO == item.NUMERO_PEDIDO
                                  && linha1.NUMERO_ITEM_PEDIDO == item.NUMERO_ITEM)
                                  && linha1.NUMERO_CUSTO_VENDA == 9
                                  select linha1).ToList();

                    if (query1.Any())
                    {
                        Sugestao_Fornecedor = string.Concat(" - <b>Fornecedor (Vendas):</b> ", query1.First().CODIGO_FORNECEDOR.HasValue &&
                            query1.First().CODIGO_FORNECEDOR.Value > 0 ?
                            "[" + query1.First().TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim() + "] [" + query1.First().OBS_CUSTO_VENDA.Trim() + "]" :
                            "[" + query1.First().OBS_CUSTO_VENDA.Trim() + "]");
                    }

                    string DESCRICAO_PRODUTO = item.TB_ITEM_ORCAMENTO_VENDA.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim().Length > 0 ?
                        item.TB_ITEM_ORCAMENTO_VENDA.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim() :
                        item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim();

                    string NUMERO_ORDEM_COMPRA = Busca_Ordens_Compra(item.NUMERO_PEDIDO, item.NUMERO_ITEM);

                    itemPEDIDO = itemPEDIDO.Replace("#PRODUTO#", string.Concat("<span style='font-size: 9pt;'>", DESCRICAO_PRODUTO, "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#UN#", string.Concat("<span style='font-size: 9pt;'>", item.UNIDADE_ITEM_PEDIDO.Trim(), "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#QTDE#", string.Concat("<span style='font-size: 9pt;'>", ApoioXML.Valor2_2((decimal)item.QTDE_PRODUTO_ITEM_PEDIDO), "</span>"));

                    itemPEDIDO = itemPEDIDO.Replace("#PRECO#", ApoioXML.formata_Valor_Impressao((decimal)item.PRECO_ITEM_PEDIDO, 4));
                    itemPEDIDO = itemPEDIDO.Replace("#TOTAL#", ApoioXML.formata_Valor_Impressao((decimal)item.VALOR_TOTAL_ITEM_PEDIDO, 2));

                    itemPEDIDO = itemPEDIDO.Replace("#ORDEM_COMPRA#", string.Concat("<span style='font-size: 9pt;'>", NUMERO_ORDEM_COMPRA, "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#OBS_ITEM#", string.Concat("<span style='font-size: 9pt;'>", item.OBS_ITEM_PEDIDO.Trim(), "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#ENTREGA#", string.Concat("<span style='font-size: 9pt;'>", ApoioXML.TrataData2(item.ENTREGA_PEDIDO), "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#STATUS_PEDIDO#", string.Concat("<span style='font-size: 9pt;'>", item.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO.Trim(), "</span>"));
                    itemPEDIDO = itemPEDIDO.Replace("#LIDER#", BuscaLider(item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.SUPERVISOR_LIDER));

                    itens++;
                }

                htmlPEDIDO = htmlPEDIDO.Replace(linhaProduto.ToString(), itemPEDIDO.ToString());

                GravaPaginaPEDIDO(htmlPEDIDO);

                htmlPEDIDO = _htmlPEDIDO;

                Merge(_Arquivo);

                str1 = ConfigurationManager.AppSettings["PastaVirtualPDF"] + _Arquivo.Substring(_Arquivo.LastIndexOf("\\") + 1);
            }

            return str1;
        }

        private string Busca_Ordens_Compra(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                             orderby linha.NUMERO_PEDIDO_VENDA, linha.NUMERO_ITEM_VENDA

                             where linha.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO
                             && linha.NUMERO_ITEM_VENDA == NUMERO_ITEM

                             select new
                             {
                                 linha.NUMERO_PEDIDO_COMPRA
                             }).ToList();

                string retorno = "";

                foreach (var item in query)
                {
                    retorno += string.Concat("[", item.NUMERO_PEDIDO_COMPRA, "]");
                }

                return retorno;
            }
        }

        private string Busca_Fornecedor(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal? NUMERO_PEDIDO_COMPRA, decimal? NUMERO_ITEM_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            select linha;

                if (NUMERO_PEDIDO_COMPRA > 0)
                {
                    query = query.OrderBy(v => v.NUMERO_PEDIDO_COMPRA).ThenBy(v => v.NUMERO_ITEM_COMPRA);

                    query = query.Where(v => v.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA &&
                        v.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA);
                }
                else
                {
                    query = query.OrderBy(v => v.NUMERO_PEDIDO_VENDA).ThenBy(v => v.NUMERO_ITEM_VENDA);

                    query = query.Where(v => v.NUMERO_PEDIDO_VENDA == NUMERO_PEDIDO &&
                        v.NUMERO_ITEM_VENDA == NUMERO_ITEM);
                }

                var lista = query.ToList();

                string retorno = "";

                foreach (var item in lista)
                    retorno = string.Concat(" - <b>Fornecedor (Compras):</b>", item.CODIGO_FORNECEDOR.ToString(), " - ", item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim());

                return retorno;
            }
        }

        private StringBuilder SetaVariaveisPedido(StringBuilder html, bool PRIMEIRA_PAGINA, string LOGIN_USUARIO)
        {
            html = html.Replace("#NUMERO_PEDIDO#", NUMERO_PEDIDO.ToString());
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
                    var item = (from linha in ctx.TB_PEDIDO_VENDAs
                                where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                select linha).ToList().First();

                    html = html.Replace("#DATA_ENTREGA#", ApoioXML.TrataData2(item.ENTREGA_PEDIDO));
                    html = html.Replace("#ULTIMA_COMPRA#", Busca_Ultima_Compra_Cliente(item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO));

                    html = html.Replace("#NOME_CLIENTE#", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO.ToString() + " - " +
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOME_CLIENTE.Trim() +
                        " - " + item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim());

                    html = html.Replace("#USUARIO_IMPRESSAO#", LOGIN_USUARIO.ToUpper());

                    html = html.Replace("#FATURAMENTO#", Previsao_Faturamento());
                    html = html.Replace("#COND_PAGTO#", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.DESCRICAO_CP.Trim());
                    html = html.Replace("#VENDEDORES#", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR.Trim());
                    html = html.Replace("#LIDER#", BuscaLider(item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.SUPERVISOR_LIDER));

                    LIDER = (decimal)item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.SUPERVISOR_LIDER;

                    string ENDERECO_ENTREGA = item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.ENDERECO_ENTREGA.Trim().Length > 0 ?
                        string.Concat(item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.ENDERECO_ENTREGA.Trim(), " ",
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NUMERO_END_ENTREGA.Trim(), " ",
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.COMP_END_ENTREGA.Trim(), " - ",
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.BAIRRO_ENTREGA.Trim(), " - ",
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.CIDADE_ENTREGA, " ",
                        item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.TB_MUNICIPIO.TB_UF.SIGLA_UF) :
                        "";

                    html = html.Replace("#ENDERECO_ENTREGA#", ENDERECO_ENTREGA);
                    html = html.Replace("#OBS_PEDIDO#", item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.OBS_ORCAMENTO.Trim());

                    using (Doran_Comercial_Pedido orc = new Doran_Comercial_Pedido())
                    {
                        DataTable dt = new DataTable();
                        dt.Columns.Add("NUMERO_PEDIDO");

                        DataRow nova = dt.NewRow();
                        nova[0] = NUMERO_PEDIDO;
                        dt.Rows.Add(nova);

                        DataTable totais = orc.Calcula_Totais_Pedido(dt);

                        html = html.Replace("#TOTAL_PRODUTOS#", totais.Rows[0]["VALOR_TOTAL"].ToString());
                        html = html.Replace("#TOTAL_IPI#", totais.Rows[0]["VALOR_IPI"].ToString());
                        html = html.Replace("#TOTAL_ICMS#", totais.Rows[0]["VALOR_ICMS"].ToString());
                        html = html.Replace("#TOTAL_ICMS_ST#", totais.Rows[0]["VALOR_ICMS_SUBS"].ToString());
                        html = html.Replace("#TOTAL_FRETE#", totais.Rows[0]["VALOR_FRETE"].ToString());
                        html = html.Replace("#TOTAL_PEDIDO#", totais.Rows[0]["TOTAL_PEDIDO"].ToString());
                        html = html.Replace("#MARGEM_MEDIA#", totais.Rows[0]["MARGEM"].ToString());
                        html = html.Replace("#TOTAL_CUSTO#", totais.Rows[0]["TOTAL_CUSTO"].ToString());
                        html = html.Replace("#CUSTO_FINANCEIRO#", totais.Rows[0]["CUSTO_FINANCEIRO"].ToString());
                        html = html.Replace("#ADICIONAL_REPRESENTANTE#", totais.Rows[0]["ADICIONAL_REPRESENTANTE"].ToString());
                    }
                }
            }
            else
            {
                html = html.Replace("#LIDER#", BuscaLider(LIDER));
            }

            return html;
        }

        private string Busca_Ultima_Compra_Cliente(decimal? CODIGO_CLIENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_SAIDAs
                             orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF descending

                             where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                             && linha.STATUS_NF == 4

                             select linha.DATA_EMISSAO_NF).Take(1).ToList();

                return query.Any() ? ApoioXML.TrataData2(query.First()) : "";
            }
        }

        private void GravaPaginaPEDIDO(StringBuilder html)
        {
            PAGINA++;

            _Arquivo = ConfigurationManager.AppSettings["PastaFisicaPDF"] + "PEDIDO_" + NUMERO_PEDIDO.ToString() + "_" + PAGINA.ToString() + ".pdf";
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

        private string Previsao_Faturamento()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var maiorDataCustos = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                       where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                       select linha.PREVISAO_ENTREGA).Max();

                var maiorDataItens = (from linha in ctx.TB_PEDIDO_VENDAs
                                      where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                      select linha.ENTREGA_PEDIDO).Max();

                string retorno = ApoioXML.TrataData2(maiorDataItens);

                if (maiorDataCustos.HasValue)
                {
                    if (maiorDataCustos > maiorDataItens)
                        retorno = ApoioXML.TrataData2(maiorDataCustos);
                }

                return retorno;
            }
        }

        private string BuscaLider(decimal? ID_LIDER)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var lider = (from linha in ctx.TB_VENDEDOREs
                             where linha.ID_VENDEDOR == ID_LIDER
                             select linha.NOME_VENDEDOR).ToList();

                string retorno = "";

                foreach (var item in lider)
                {
                    retorno = item;
                }

                return retorno;
            }
        }

        private void Verifca_Permissao_Impressao()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && linha.TB_STATUS_PEDIDO.NAO_IMPRIMIR_PEDIDO == 1
                             select new
                             {
                                 linha.CODIGO_PRODUTO_PEDIDO
                             }).ToList();

                string imp = "";

                foreach (var item in query)
                    imp += string.Concat("[", item.CODIGO_PRODUTO_PEDIDO.Trim(), "] ");

                if (imp.Length > 0)
                {
                    throw new Exception(@"N&atilde;o &eacute; poss&iacute;vel imprimir o pedido. <br />
                        O(s) item(s) " + imp + " n&atilde;o tem permiss&atilde;o de impress&atilde;o na posi&ccedil;&atilde;o atual");
                }
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}