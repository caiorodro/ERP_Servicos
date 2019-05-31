using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using Doran_Servicos_ORM;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Lista_Clientes_Inativos : IDisposable
    {
        public DateTime _dataRef { get; set; }

        public decimal CODIGO_VENDEDOR { get; set; }
        public string CLIENTE { get; set; }

        private decimal ID_EMPRESA { get; set; }
        private string NOME_VENDEDOR { get; set; }

        public Doran_Lista_Clientes_Inativos(decimal _ID_EMPRESA)
        {
            CLIENTE = "";
            NOME_VENDEDOR = "";
            CODIGO_VENDEDOR = 0;
            ID_EMPRESA = _ID_EMPRESA;
        }

        public string Lista_Relatorio()
        {
            string retorno = "";

            Preenche_Vendedor();

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Relat&oacute;rio de Clientes Inativos<br /><span style='font-size: 8pt;'>" + NOME_VENDEDOR + "</span>", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_CLIENTEs

                                orderby linha.DATA_ULTIMA_FATURA descending, linha.VALOR_ULTIMA_FATURA descending

                                where linha.DATA_ULTIMA_FATURA < _dataRef

                                && linha.CLIENTE_BLOQUEADO != 1

                                && (linha.NOME_CLIENTE.Contains(CLIENTE)
                                || linha.NOMEFANTASIA_CLIENTE.Contains(CLIENTE))

                                select new
                                {
                                    linha.ID_CLIENTE,
                                    linha.NOMEFANTASIA_CLIENTE,
                                    linha.CODIGO_VENDEDOR_CLIENTE,
                                    linha.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.DATA_ULTIMA_FATURA,
                                    linha.VALOR_ULTIMA_FATURA,
                                    linha.TB_MUNICIPIO.TB_UF.SIGLA_UF,

                                    NOME_CONTATO_CLIENTE = (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                            where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                            select linha1).Any() ?

                                                            (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                             where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                             select linha1.NOME_CONTATO_CLIENTE).First()
                                                             : "",

                                    EMAIL_CONTATO_CLIENTE = (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                             where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                             select linha1).Any() ?

                                                            (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                             where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                             select linha1.EMAIL_CONTATO_CLIENTE).First()
                                                             : "",

                                    TELEFONE_CONTATO_CLIENTE = (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                                where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                                select linha1).Any() ?

                                                            (from linha1 in ctx.GetTable<TB_CLIENTE_CONTATO>()
                                                             where linha1.ID_CLIENTE == linha.ID_CLIENTE
                                                             select linha1.TELEFONE_CONTATO_CLIENTE).First()
                                                             : ""
                                };

                    if (CODIGO_VENDEDOR > 0)
                    {
                        query = query.Where(v => v.CODIGO_VENDEDOR_CLIENTE == CODIGO_VENDEDOR);
                    }

                    var query1 = query.ToList();

                    StringBuilder _conteudo = new StringBuilder();

                    _conteudo.Append("<table style='width: 75%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Contato</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Vendedor(a):</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Telefone</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>UF</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Ultima Compra</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: right;'>Valor Ultima Compra</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: right;'>Total Vencido</td>
                                  </tr>");

                    foreach (var item in query1)
                    {
                        decimal vencido = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER,
                            item.ID_CLIENTE, ID_EMPRESA);

                        _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + item.NOMEFANTASIA_CLIENTE.Trim() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + item.NOME_CONTATO_CLIENTE.Trim() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + item.NOME_VENDEDOR.Trim() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + item.TELEFONE_CONTATO_CLIENTE.Trim() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + item.SIGLA_UF + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + ApoioXML.TrataData2(item.DATA_ULTIMA_FATURA) + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>" + ((decimal)item.VALOR_ULTIMA_FATURA).ToString("c") + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: right;'>" + ((decimal)vencido).ToString("c") + @"</td>
                                  </tr>");
                    }

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());

                    retorno = r.SalvaDocumento("Clientes_Inativos");
                }

                return retorno;
            }
        }

        private void Preenche_Vendedor()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                NOME_VENDEDOR = "";

                var query = (from linha in ctx.TB_VENDEDOREs
                             where linha.ID_VENDEDOR == CODIGO_VENDEDOR
                             select new { linha.NOME_VENDEDOR }).ToList();

                foreach (var item in query)
                {
                    NOME_VENDEDOR = "<b>Vendedor(a)</b>: " + item.NOME_VENDEDOR.Trim();
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
