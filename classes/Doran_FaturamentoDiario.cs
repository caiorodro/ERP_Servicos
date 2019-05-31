using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_FaturamentoDiario : IDisposable
    {
        public string cliente_fornecedor
        {
            get;
            set;
        }

        public DateTime dt1
        {
            get;
            set;
        }

        public DateTime dt2
        {
            get;
            set;
        }
        public decimal Filial
        {
            get;
            set;
        }

        private string _CODIGO_CFOP { get; set; }

        public decimal ID_EMPRESA { get; set; }

        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }

        public Doran_FaturamentoDiario(string _clientefornecedor, DateTime _data1, DateTime _data2, string CODIGO_CFOP, decimal _Filial,
            decimal _ID_EMPRESA)
        {
            cliente_fornecedor = _clientefornecedor;
            dt1 = _data1;
            dt2 = _data2;
            dt2 = dt2.AddDays(1);
            _CODIGO_CFOP = CODIGO_CFOP;

            Filial = _Filial;
            ID_EMPRESA = _ID_EMPRESA;

            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");
        }

        public string MontaRelatorioFaturamentoDiario()
        {
            string retorno = "";
            string Emitente = BuscaNomeFilial();

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                DateTime data2 = dt2.AddSeconds(-1);

                r.DefineCabecalho(string.Format("Faturamento Di&aacute;rio<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />Empresa / Filial: " + Emitente + "</span>",
                    ApoioXML.TrataData2(dt1), ApoioXML.TrataData2(data2)), 60);

                var query = from linha in ctx.TB_NOTA_SAIDAs

                            orderby linha.DATA_EMISSAO_NF

                            where (linha.DATA_EMISSAO_NF >= dt1
                            && linha.DATA_EMISSAO_NF < dt2)

                            && (linha.STATUS_NF == 2 || linha.STATUS_NF == 4)

                            && (linha.TB_CLIENTE.NOME_CLIENTE.Contains(cliente_fornecedor)
                            || linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(cliente_fornecedor))
                            && linha.CODIGO_EMITENTE_NF == Filial

                            select new
                            {
                                linha.NUMERO_NF,
                                linha.DATA_EMISSAO_NF,
                                linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.TOTAL_NF,
                                linha.TOTAL_SERVICOS_NF
                            };

                var query1 = query.OrderBy(n => n.NUMERO_NF);

                StringBuilder _conteudo = new StringBuilder();

                _conteudo.Append("<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>");

                _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Nr. NF</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Emiss&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>Total Produtos</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>ICMS</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>ICMS ST</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>IPI</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>Total NF</td>
                                  </tr>");

                decimal Produtos = 0;
                decimal ICMS = 0;
                decimal ICMSSubs = 0;
                decimal IPI = 0;
                decimal Total = 0;

                foreach (var item in query1)
                {
                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='text-align: right; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='text-align: right; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='text-align: right; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{5}</td>
                                        <td style='text-align: right; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{6}</td>
                                        <td style='text-align: right; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{7}</td>
                                      </tr>", item.NUMERO_NF.ToString(),
                                        ApoioXML.Data((DateTime)item.DATA_EMISSAO_NF),
                                        item.NOMEFANTASIA_CLIENTE.Trim(),
                                        ApoioXML.Valor2((decimal)item.TOTAL_SERVICOS_NF),
                                        ApoioXML.Valor2((decimal)item.TOTAL_NF)));

                    Produtos += (decimal)item.TOTAL_SERVICOS_NF;
                    Total += (decimal)item.TOTAL_NF;
                }

                _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'></td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'></td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>Totais.:</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>{0}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>{1}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>{2}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>{3}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right;'>{4}</td>
                                      </tr></table>", ApoioXML.Valor2(Produtos),
                                                ApoioXML.Valor2(ICMS),
                                                ApoioXML.Valor2(ICMSSubs),
                                                ApoioXML.Valor2(IPI),
                                                ApoioXML.Valor2(Total)));

                r.InsereConteudo(_conteudo.ToString());

                retorno = r.SalvaDocumento("Doran_FaturamentoDiario");

                return retorno;
            }
        }

        private string BuscaNomeFilial()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_EMITENTEs
                             where linha.CODIGO_EMITENTE == Filial
                             select new
                             {
                                 linha.NOME_EMITENTE
                             }).ToList();

                string retorno = "";

                foreach (var item in query)
                {
                    retorno = item.NOME_EMITENTE.Trim();
                }

                return retorno;
            }
        }

        private void Atualiza_Ultima_Fatura()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var clientes = (from linha in ctx.TB_CLIENTEs
                                select linha).ToList();

                foreach (var item in clientes)
                {
                    var notas = (from linha in ctx.TB_NOTA_SAIDAs
                                 orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF descending
                                 where linha.CODIGO_CLIENTE_NF == item.ID_CLIENTE
                                 && linha.STATUS_NF == 4
                                 select linha).Take(1).ToList();

                    foreach (var item1 in notas)
                    {
                        item.DATA_ULTIMA_FATURA = item1.DATA_EMISSAO_NF;
                        item.VALOR_ULTIMA_FATURA = item1.TOTAL_NF;
                    }
                }

                ctx.SubmitChanges();
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
        }

        #endregion
    }
}
