using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Lista_Cotacao_Compra : IDisposable
    {
        public decimal NUMERO_PEDIDO_COMPRA { get; set; }
        public decimal CODIGO_FORNECEDOR { get; set; }

        public Doran_Lista_Cotacao_Compra(decimal _NUMERO_PEDIDO_COMPRA, decimal _CODIGO_FORNECEDOR)
        {
            NUMERO_PEDIDO_COMPRA = _NUMERO_PEDIDO_COMPRA;
            CODIGO_FORNECEDOR = _CODIGO_FORNECEDOR;
        }

        public string Lista_Cotacao(decimal ID_EMPRESA, string NOME_FANTASIA_EMITENTE)
        {
            string retorno = "";

            string FORNECEDOR = "";

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var _FORNECEDOR = (from linha in ctx.TB_FORNECEDORs
                              where linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                              select linha.NOME_FANTASIA_FORNECEDOR).ToList();

                foreach (var item in _FORNECEDOR)
                {
                    FORNECEDOR = item.Trim();
                }
            }

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho(NOME_FANTASIA_EMITENTE.Trim() + " - COTA&Ccedil;&Atilde;O N&ordm; " + NUMERO_PEDIDO_COMPRA.ToString() + "<br />" + FORNECEDOR, 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA

                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR

                                 && linha.COTACAO_RESPONDIDA == 0

                                 select linha).ToList();

                    string _conteudo = "<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>";

                    _conteudo += @"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Produto</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Descri&ccedil;&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Un.</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Qtde.</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Pre&ccedil;o</td>
                                  </tr>";

                    foreach (var item in query)
                    {
                        _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'></td>
                                      </tr>", item.CODIGO_PRODUTO_COMPRA.ToString(),
                                            item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim(),
                                            item.UNIDADE_ITEM_COMPRA,
                                            ApoioXML.ValorN((decimal)item.QTDE_ITEM_COMPRA,2),
                                            string.Concat(item.PREVISAO_ENTREGA_ITEM_COMPRA.Value.Day.ToString().PadLeft(2, '0'),
                                            "/", item.PREVISAO_ENTREGA_ITEM_COMPRA.Value.Month.ToString().PadLeft(2, '0'),
                                            "/", item.PREVISAO_ENTREGA_ITEM_COMPRA.Value.Year.ToString()));
                    }

                    r.InsereConteudo(_conteudo);

                    retorno = r.SalvaDocumento("Doran_Lista_Cotacao");
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