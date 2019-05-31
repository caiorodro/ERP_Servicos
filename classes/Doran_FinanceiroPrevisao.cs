using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_FinanceiroPrevisao : IDisposable
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

        public string ResumidoDetalhado
        {
            get;
            set;
        }

        public decimal Banco { get; set; }

        public string CLIENTE { get; set; }

        public decimal ID_EMPRESA { get; set; }
        

        public Doran_FinanceiroPrevisao(DateTime dt1, DateTime dt2, string _ResumidoDetalhado, decimal _ID_EMPRESA)
        {
            DataInicial = dt1;
            DataFinal = dt2;

            DataFinal = DataFinal.AddDays(1);

            ResumidoDetalhado = _ResumidoDetalhado;

            ID_EMPRESA = _ID_EMPRESA;
            Banco = 0;
            CLIENTE = "";
        }

        public string MontaRelatorioPrevisao(string RECEBER_PAGAR)
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                DateTime df = DataFinal.AddSeconds(-1);

                string nome_banco = "";

                if (Banco > 0)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        nome_banco = (from linha in ctx.TB_BANCOs
                                      where linha.NUMERO_BANCO == Banco
                                      select linha.NOME_BANCO).ToList().First().Trim();
                    }
                }

                string cabecalho = string.Format("Relat&oacute;rio do Fluxo de Caixa (Previs&atilde;o)<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />{2}</span>",
                    ApoioXML.TrataData2(DataInicial), ApoioXML.TrataData2(df), Banco > 0 ? "Banco: " + nome_banco : "");

                r.DefineCabecalho(cabecalho, 60);

                decimal CREDITO_DEBITO = RECEBER_PAGAR == "R" ? 0 : 1;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    DateTime _dt = DataInicial;

                    StringBuilder _conteudo = new StringBuilder();

                    _conteudo.Append("<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>NF / Duplicata</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Vencimento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Pagamento</td>

                                    <td style='BORDER-BOTTOM: 1px solid; width: 280px; border-color:#C0C0C0;'>Hist&oacute;rico</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Cr&eacute;dito</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>D&eacute;bito</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Saldo</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor Aproximado?</td>
                                  </tr>");

                    decimal Saldo = 0;
                    decimal saldoAnterior = SaldoAnterior();

                                            decimal CreditoTotal = 0;
                        decimal DebitoTotal = 0;

                    while (_dt < DataFinal)
                    {
                        var query = from linha in ctx.TB_FINANCEIROs
                                    where linha.DATA_VENCIMENTO >= _dt
                                    && linha.DATA_VENCIMENTO < _dt.AddDays(1)
                                    && linha.CODIGO_EMITENTE == ID_EMPRESA

                                    && linha.HISTORICO.Contains(CLIENTE)

                                    && linha.CREDITO_DEBITO == CREDITO_DEBITO

                                    && (linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01) || linha.DATA_PAGAMENTO == null)

                                    select new
                                    {
                                        linha.NUMERO_FINANCEIRO,
                                        linha.NUMERO_SEQ_NF_SAIDA,
                                        linha.NUMERO_NF_SAIDA,
                                        linha.NUMERO_SEQ_NF_ENTRADA,
                                        linha.NUMERO_NF_ENTRADA,
                                        linha.DATA_VENCIMENTO,
                                        linha.DATA_PAGAMENTO,
                                        linha.HISTORICO,
                                        VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO,
                                        linha.CREDITO_DEBITO,
                                        linha.VALOR_APROXIMADO
                                    };

                        decimal CreditoDia = 0;
                        decimal DebitoDia = 0;

                        foreach (var item in query)
                        {
                            if (item.CREDITO_DEBITO == 0)
                            {
                                if (ResumidoDetalhado == "D")
                                {
                                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='font-size: 7pt; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='text-align: right; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td>{5}</td>
                                        <td>{6}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'>{7}</td>
                                      </tr>", item.NUMERO_NF_SAIDA.ToString() + "/" + ApoioXML.LetrasDuplicatas_ERP_Servicos(item.NUMERO_SEQ_NF_SAIDA, item.NUMERO_SEQ_NF_ENTRADA, item.DATA_VENCIMENTO),
                                                        ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                                        ApoioXML.Data((DateTime)item.DATA_PAGAMENTO),
                                                        item.HISTORICO.Trim(),
                                                        ApoioXML.Valor_Moeda(((decimal)item.VALOR_TOTAL).ToString(), 2), "", "",
                                                        item.VALOR_APROXIMADO == 1 ? "S" : ""));
                                }

                                CreditoDia += (decimal)item.VALOR_TOTAL;
                                CreditoTotal += (decimal)item.VALOR_TOTAL;
                            }
                            else
                            {
                                if (ResumidoDetalhado == "D")
                                {
                                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='font-size: 7pt; BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'>{5}</td>
                                        <td >{6}</td>
                                        <td style='BORDER-BOTTOM: 1px solid; BORDER-TOP: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'>{7}</td>
                                      </tr>", item.NUMERO_NF_ENTRADA.ToString() + "/" + ApoioXML.LetrasDuplicatas_ERP_Servicos(item.NUMERO_SEQ_NF_SAIDA, item.NUMERO_SEQ_NF_ENTRADA, item.DATA_VENCIMENTO),
                                                        ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                                        ApoioXML.Data((DateTime)item.DATA_PAGAMENTO),
                                                        item.HISTORICO.Trim(),
                                                        "",
                                                        ApoioXML.Valor2((decimal)item.VALOR_TOTAL),
                                                        "", item.VALOR_APROXIMADO == 1 ? "S" : ""));
                                }

                                DebitoDia += (decimal)item.VALOR_TOTAL;
                                DebitoTotal += (decimal)item.VALOR_TOTAL;
                            }
                        }

                        if (DebitoDia > (decimal)0.00 || CreditoDia > (decimal)0.00)
                        {
                            Saldo = (saldoAnterior + CreditoDia) - DebitoDia;

                            _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; text-align: right;' colspan='3'>Saldo Anterior {0}</td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; text-align: right;'>Total do dia {1}</td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'><b>{2}</b></td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'><b>{3}</b></td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'><b>{4}</b></td>
                                      </tr>", ApoioXML.Valor2(saldoAnterior), ApoioXML.TrataData2(_dt), ApoioXML.Valor2(CreditoDia)
                                            , ApoioXML.Valor2(DebitoDia), ApoioXML.Valor2(Saldo)));

                            saldoAnterior = Saldo;

                            CreditoDia = 0;
                            DebitoDia = 0;
                        }

                        _dt = _dt.AddDays(1);
                    }

                    _conteudo.Append(string.Format(@"<tr>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; text-align: right;' colspan='3'></td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; text-align: right;'>Total no Per&iacute;odo</td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'><b>{0}</b></td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'><b>{1}</b></td>
                                        <td style='BORDER-TOP: 1px solid; BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; text-align: right; border-color:#C0C0C0;'></td>
                                      </tr>", ApoioXML.Valor2(CreditoTotal)
                                            , ApoioXML.Valor2(DebitoTotal)));

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());
                    retorno = r.SalvaDocumento("FaTh2_Fluxo_Realizado");
                }

                return retorno;
            }
        }

        private decimal SaldoAnterior()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_FINANCEIROs
                             where linha.DATA_PAGAMENTO < DataInicial
                             && linha.CREDITO_DEBITO == 0
                             && linha.CODIGO_EMITENTE == ID_EMPRESA
                             select linha).Sum(cr => cr.VALOR_TOTAL);

                decimal Creditos = query.HasValue ? (decimal)query : 0;


                var query1 = (from linha in ctx.TB_FINANCEIROs
                              where linha.DATA_PAGAMENTO < DataInicial
                              && linha.CREDITO_DEBITO == 1
                              && linha.CODIGO_EMITENTE == ID_EMPRESA
                              select linha).Sum(cr => cr.VALOR_TOTAL);

                decimal Debitos = query1.HasValue ? (decimal)query1 : 0;

                // Pagamentos Parciais
                var query2 = (from linha in ctx.TB_PAGTO_PARCIALs
                              where linha.DATA_PAGTO < DataInicial
                              && linha.TB_FINANCEIRO.CREDITO_DEBITO == 0
                              && linha.TB_FINANCEIRO.CODIGO_EMITENTE == ID_EMPRESA
                              select linha).Sum(cr => cr.VALOR_PAGTO);

                Creditos += query2.HasValue ? (decimal)query2 : 0;

                var query3 = (from linha in ctx.TB_PAGTO_PARCIALs
                              where linha.DATA_PAGTO < DataInicial
                              && linha.TB_FINANCEIRO.CREDITO_DEBITO == 1
                              && linha.TB_FINANCEIRO.CODIGO_EMITENTE == ID_EMPRESA
                              select linha).Sum(cr => cr.VALOR_PAGTO);

                Debitos += query3.HasValue ? (decimal)query3 : 0;

                decimal saldo = Creditos - Debitos;

                return saldo;
            }
        }

        //private decimal SaldoAnterior()
        //{
        //    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
        //    {
        //        var query = from linha in ctx.TB_FINANCEIROs
        //                    where linha.DATA_VENCIMENTO < DataInicial
        //                    && linha.CREDITO_DEBITO == 0
        //                    && linha.CODIGO_EMITENTE == ID_EMPRESA
        //                    select linha;

        //        decimal Creditos = (decimal)query.Sum(cr => cr.VALOR_TOTAL);


        //        var query1 = from linha in ctx.TB_FINANCEIROs
        //                    where linha.DATA_VENCIMENTO < DataInicial
        //                    && linha.CREDITO_DEBITO == 1
        //                    && linha.CODIGO_EMITENTE == ID_EMPRESA
        //                    select linha;

        //        decimal Debitos = (decimal)query1.Sum(cr => cr.VALOR_TOTAL);

        //        decimal saldo = Creditos - Debitos;

        //        return saldo;
        //    }
        //}

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}
