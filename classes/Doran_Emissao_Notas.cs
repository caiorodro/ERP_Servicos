using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using System.Data.Linq.SqlClient;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Emissao_Notas : IDisposable
    {
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

        public decimal A_VISTA { get; set; }

        public Doran_Emissao_Notas(DateTime _data1, DateTime _data2, decimal _Filial, decimal _A_VISTA)
        {
            dt1 = _data1;
            dt2 = _data2;
            A_VISTA = _A_VISTA;

            Filial = _Filial;
        }

        public string MontaRelatorio()
        {
            string retorno = "";
            string Emitente = BuscaNomeFilial();

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape))
            {
                r.ID_EMPRESA = Filial;

                DateTime data2 = dt2.AddSeconds(-1);

                r.DefineCabecalho(string.Format("Relação de Notas Fiscais<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />Empresa / Filial: " + Emitente + "</span>",
                    ApoioXML.TrataData2(dt1), ApoioXML.TrataData2(data2)), 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_FINANCEIROs

                                where (linha.DATA_LANCAMENTO >= dt1
                                && linha.DATA_LANCAMENTO < dt2)

                                && linha.CREDITO_DEBITO == 0
                               && linha.CODIGO_EMITENTE == Filial

                               && linha.NUMERO_SEQ_NF_SAIDA > 0

                                select new
                                {
                                    linha.NUMERO_SEQ_NF_SAIDA,
                                    linha.NUMERO_NF_SAIDA,
                                    linha.DATA_LANCAMENTO,
                                    linha.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF,
                                    VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO,
                                    linha.DATA_VENCIMENTO,

                                    NOME_VENDEDOR_NF = linha.TB_NOTA_SAIDA == null ?
                                     string.Empty : linha.TB_NOTA_SAIDA.NOME_VENDEDOR_NF,

                                    OBS_NF = linha.TB_NOTA_SAIDA == null ?
                                    string.Empty : linha.TB_NOTA_SAIDA.OBS_INTERNA_NF,

                                    CODIGO_VENDEDOR_NF = linha.TB_NOTA_SAIDA == null ?
                                       0 : linha.TB_NOTA_SAIDA.CODIGO_VENDEDOR_NF

                                };

                    if (A_VISTA == 1)
                        query = query.Where(l => SqlMethods.DateDiffDay(l.DATA_LANCAMENTO.Value, l.DATA_VENCIMENTO.Value) < 2);

                    string _conteudo = "<table style='width: 100%; font-family: tahoma; font-size: 8pt;'>";

                    _conteudo += @"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Data Emiss&atilde;o</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>N&ordm; NF</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: right;'>Total NF</td>                                    
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Vencimento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>N&ordm; do Pedido</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Data do Pedido</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Data de Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Vendedor(a)</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Observa&ccedil;&atilde;o</td>
                                    
                                  </tr>";

                    decimal Total = 0;

                    foreach (var item in query)
                    {
                        var query1 = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                      where linha.NUMERO_ITEM_NF == item.NUMERO_SEQ_NF_SAIDA
                                      select linha).Any() ?

                                    (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                     where linha.NUMERO_ITEM_NF == item.NUMERO_SEQ_NF_SAIDA
                                     select linha).ToList().First() :

                                  (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                   where linha.TB_NOTA_SAIDA.NUMERO_NF == item.NUMERO_NF_SAIDA
                                   select linha).Any() ?

                                     (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                      where linha.TB_NOTA_SAIDA.NUMERO_NF == item.NUMERO_NF_SAIDA
                                      select linha).ToList().First() :

                                      new TB_ITEM_NOTA_SAIDA();

                        var pedido = (from linha in ctx.TB_PEDIDO_VENDAs
                                      where linha.NUMERO_PEDIDO == query1.NUMERO_PEDIDO_VENDA
                                      select new
                                      {
                                          linha.NUMERO_PEDIDO,
                                          linha.DATA_PEDIDO,
                                          linha.ENTREGA_PEDIDO
                                      }).Take(1).ToList();

                        var codigo_lider = (from linha in ctx.TB_VENDEDOREs
                                            where linha.ID_VENDEDOR == item.CODIGO_VENDEDOR_NF
                                            select linha.SUPERVISOR_LIDER).ToList();

                        if (string.IsNullOrEmpty(item.NOME_FANTASIA_CLIENTE_NF))
                            throw new Exception(string.Concat("O t&iacute;tulo da NF ", item.NUMERO_NF_SAIDA.ToString(), ", no valor de " + item.VALOR_TOTAL.Value.ToString("c"),
                                " est&aacute; com o cliente em branco. Acerte este erro no financeiro e tente emitir o relat&aacute;rio novamente"));

                        _conteudo += "<tr>";
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid;'>" + ApoioXML.Data((DateTime)item.DATA_LANCAMENTO) + "</td>";
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid;'>" + item.NUMERO_NF_SAIDA.ToString() + "</td>";
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid;'>" + item.NOME_FANTASIA_CLIENTE_NF.Trim() + "</td>";
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid; text-align: right;'>" + ((decimal)item.VALOR_TOTAL).ToString("c") + "</td>";
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid;'>" + ApoioXML.Data((DateTime)item.DATA_VENCIMENTO) + "</td>";
                        _conteudo += string.Concat("<td style='BORDER-BOTTOM: 1px solid;'>", pedido.Any() ? pedido.First().NUMERO_PEDIDO.ToString() : "", "</td>");
                        _conteudo += string.Concat("<td style='BORDER-BOTTOM: 1px solid;'>", pedido.Any() ? ApoioXML.Data((DateTime)pedido.First().DATA_PEDIDO) : "", "</td>");
                        _conteudo += string.Concat("<td style='BORDER-BOTTOM: 1px solid;'>", pedido.Any() ? ApoioXML.Data((DateTime)pedido.First().ENTREGA_PEDIDO) : "", "</td>");
                        _conteudo += string.Concat("<td style='BORDER-BOTTOM: 1px solid;'>", string.IsNullOrEmpty(item.NOME_VENDEDOR_NF) ? "" : item.NOME_VENDEDOR_NF.Trim(), "</td>");
                        _conteudo += "<td style='BORDER-BOTTOM: 1px solid;'>" + item.OBS_NF + "</td></tr>";

                        Total += (decimal)item.VALOR_TOTAL;
                    }

                    _conteudo += string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>{0}</td>                                    
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                      </tr></table>", Total.ToString("c"));

                    r.InsereConteudo(_conteudo);

                    retorno = r.SalvaDocumento("FaTh2_Emissao_Notas_Fiscais");
                }

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

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}