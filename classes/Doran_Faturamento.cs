using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Faturamento
    {
        private decimal ID_EMPRESA { get; set; }

        public Doran_Faturamento(decimal _ID_EMPRESA)
        {
            ID_EMPRESA = _ID_EMPRESA;
        }

        public string Faturamento_Inadimplencia(DateTime dt1, DateTime dt2,decimal _ID_EMPRESA)
        {
            ID_EMPRESA = _ID_EMPRESA;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                int monthsApart = 12 * (dt1.Year - dt2.Year) + dt1.Month - dt2.Month;
                monthsApart = Math.Abs(monthsApart);

                dt2 = dt2.AddDays(1);
                dt2 = dt2.AddMonths(-monthsApart);

                List<decimal?> TotalFaturamento = new List<decimal?>();
                List<decimal?> TotalVencido = new List<decimal?>();
                List<string> Periodo = new List<string>();
                decimal? _totalVencido = 0;

                for (int i = 0; i <= monthsApart; i++)
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                where (linha.DATA_VENCIMENTO >= dt1 &&
                                linha.DATA_VENCIMENTO < dt2)
                                && linha.CREDITO_DEBITO == 0
                                && linha.CODIGO_EMITENTE == ID_EMPRESA
                                select linha;

                    decimal? _total = query.Sum(tf => tf.VALOR_TOTAL);

                    if (!_total.HasValue)
                        TotalFaturamento.Add(0);
                    else
                        TotalFaturamento.Add(_total);

                    DateTime _vencido = dt1.Month == DateTime.Now.Month ?
                        Doran_TitulosVencidos.DataLimiteParaVencimento() :
                        dt2;

                    var query1 = from linha in ctx.TB_FINANCEIROs
                                 where (linha.DATA_VENCIMENTO >= dt1
                                 && linha.DATA_VENCIMENTO < _vencido)
                                 && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                 && linha.CREDITO_DEBITO == 0
                                 && linha.CODIGO_EMITENTE == ID_EMPRESA
                                 select linha;

                    decimal tv = 0;

                    foreach (var item in query1)
                    {
                        DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (_vencimento < DateTime.Now)
                            tv += (decimal)item.VALOR_TOTAL;
                    }

                    DataTable dt = ApoioXML.ToDataTable(ctx, query1);

                    foreach (DataRow dr in dt.Rows)
                    {
                        tv -= Doran_TitulosVencidos.PagoParcialmente(Convert.ToDecimal(dr["NUMERO_FINANCEIRO"]));
                    }

                    _totalVencido += tv;

                    TotalVencido.Add(_totalVencido);

                    Periodo.Add(dt1.Month.ToString().PadLeft(2, '0') + "/" + dt1.Year.ToString());

                    dt1 = dt1.AddMonths(1);
                    dt2 = dt1;
                    dt2 = dt2.AddMonths(1);
                    dt2 = dt2.AddSeconds(-1);
                }

                string retorno = "[";

                for (int i = 0; i < TotalFaturamento.Count; i++)
                {
                    string _totalFaturamento = TotalFaturamento[i].ToString();
                    _totalFaturamento = _totalFaturamento.Replace(",", ".");

                    string totalVencido = TotalVencido[i].ToString();
                    totalVencido = totalVencido.Replace(",", ".");

                    retorno += "{ periodo: '" + Periodo[i] + "', total_faturamento: " + _totalFaturamento + ", total_vencido: " + totalVencido + " },";
                }

                retorno = retorno.Substring(0, retorno.Length - 1) + "]";

                return retorno;
            }
        }

        public string Financeiro_Realizado(DateTime dt1, DateTime dt2)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                int monthsApart = 12 * (dt1.Year - dt2.Year) + dt1.Month - dt2.Month;
                monthsApart = Math.Abs(monthsApart);

                dt2 = dt2.AddDays(1);
                dt2 = dt2.AddMonths(-monthsApart);

                List<decimal?> TotalCredito = new List<decimal?>();
                List<decimal?> TotalDebito = new List<decimal?>();
                List<string> Periodo = new List<string>();

                for (int i = 0; i <= monthsApart; i++)
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO >= dt1 &&
                                linha.DATA_PAGAMENTO < dt2
                                && linha.CREDITO_DEBITO == 0
                                && linha.CODIGO_EMITENTE == ID_EMPRESA
                                select linha;

                    decimal? _totalCredito = query.Sum(tf => tf.VALOR_TOTAL);

                    var query2 = (from linha in ctx.TB_PAGTO_PARCIALs
                                 where linha.DATA_PAGTO >= dt1 &&
                                 linha.DATA_PAGTO < dt2 &&
                                 linha.TB_FINANCEIRO.CREDITO_DEBITO == 0
                                 select linha).Sum(tf => tf.VALOR_PAGTO);

                    _totalCredito += query2.HasValue ? query2 : 0;

                    if (!_totalCredito.HasValue)
                        TotalCredito.Add(0);
                    else
                        TotalCredito.Add(_totalCredito);

                    var query1 = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO >= dt1 &&
                                linha.DATA_PAGAMENTO < dt2
                                && linha.CREDITO_DEBITO == 1
                                && linha.CODIGO_EMITENTE == ID_EMPRESA
                                select linha;

                    decimal? _totalDebito = query1.Sum(tf => tf.VALOR_TOTAL);

                    var query3 = (from linha in ctx.TB_PAGTO_PARCIALs
                                  where linha.DATA_PAGTO >= dt1 &&
                                  linha.DATA_PAGTO < dt2 &&
                                  linha.TB_FINANCEIRO.CREDITO_DEBITO == 1
                                  select linha).Sum(tf => tf.VALOR_PAGTO);

                    _totalDebito += query3.HasValue ? query3 : 0;

                    if (!_totalDebito.HasValue)
                        TotalDebito.Add(0);
                    else
                        TotalDebito.Add(_totalDebito);

                    Periodo.Add(dt1.Month.ToString().PadLeft(2, '0') + "/" + dt1.Year.ToString());

                    dt1 = dt1.AddMonths(1);
                    dt2 = dt1;
                    dt2 = dt2.AddMonths(1);
                }

                string retorno = "[";

                for (int i = 0; i < TotalDebito.Count; i++)
                {
                    string _totalCredito = TotalCredito[i].ToString();
                    _totalCredito = _totalCredito.Replace(",", ".");

                    string _totalDebito = TotalDebito[i].ToString();
                    _totalDebito = _totalDebito.Replace(",", ".");

                    retorno += "{ periodo: '" + Periodo[i] + "', total_credito: " + _totalCredito + ", total_debito: " + _totalDebito + " },";
                }

                retorno = retorno.Substring(0, retorno.Length - 1) + "]";

                return retorno;
            }
        }

        public string GraficoFaturadoRecebido(decimal CODIGO_CLIENTE, List<DateTime> dt1, List<DateTime> dt2)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                List<decimal?> TotalFaturado = new List<decimal?>();
                List<decimal?> TotalRecebido = new List<decimal?>();
                List<string> Periodo = new List<string>();

                for (int i = 0; i < dt1.Count; i++)
                {
                    var query = (from linha in ctx.TB_NOTA_SAIDAs

                                 orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF

                                 where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                 && (linha.DATA_EMISSAO_NF >= dt1[i] &&
                                 linha.DATA_EMISSAO_NF < dt2[i])
                                 && (linha.STATUS_NF == 2 || linha.STATUS_NF == 4)
                                 select linha).ToList();

                    decimal? _totalFaturado = query.Sum(tf => tf.TOTAL_NF);

                    if (!_totalFaturado.HasValue)
                        TotalFaturado.Add(0);
                    else
                        TotalFaturado.Add(_totalFaturado);

                    var query1 = (from linha in ctx.TB_FINANCEIROs
                                  where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                  && (linha.DATA_PAGAMENTO >= dt1[i] &&
                                  linha.DATA_PAGAMENTO < dt2[i])
                                  && linha.CREDITO_DEBITO == 0
                                  select linha).ToList();

                    decimal? _totalRecebido = query1.Sum(tf => tf.VALOR_TOTAL);

                    var query3 = (from linha in ctx.TB_PAGTO_PARCIALs
                                  where linha.DATA_PAGTO >= dt1[i] &&
                                  linha.DATA_PAGTO < dt2[i] &&
                                  linha.TB_FINANCEIRO.CREDITO_DEBITO == 0 &&
                                  linha.TB_FINANCEIRO.CODIGO_CLIENTE == CODIGO_CLIENTE
                                  select linha).Sum(tf => tf.VALOR_PAGTO);

                    _totalRecebido += query3.HasValue ? query3 : 0;

                    if (!_totalRecebido.HasValue)
                        TotalRecebido.Add(0);
                    else
                        TotalRecebido.Add(_totalRecebido);

                    Periodo.Add(dt1[i].Month.ToString().PadLeft(2, '0') + "/" + dt1[i].Year.ToString());
                }

                string retorno = "[";

                for (int i = 0; i < TotalRecebido.Count; i++)
                {
                    string _totalFaturado = TotalFaturado[i].ToString();
                    _totalFaturado = _totalFaturado.Replace(",", ".");

                    string _totalRecebido = TotalRecebido[i].ToString();
                    _totalRecebido = _totalRecebido.Replace(",", ".");

                    retorno += "{ periodo: '" + Periodo[i] + "', total_faturado: " + _totalFaturado + ", total_recebido: " + _totalRecebido + " },";
                }

                retorno = retorno.Substring(0, retorno.Length - 1) + "]";

                return retorno;
            }
        }

        public List<string> GraficoCreditoCliente(decimal CODIGO_CLIENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime amanha = DateTime.Today;
                amanha = amanha.AddDays(1);

                var aReceber = (from linha in ctx.TB_FINANCEIROs
                                where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                && linha.DATA_VENCIMENTO >= amanha
                                && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.CREDITO_DEBITO == 0

                                select linha).Sum(ar => ar.VALOR_TOTAL);

                if (!aReceber.HasValue)
                    aReceber = 0;

                decimal Inadimplente = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, CODIGO_CLIENTE, ID_EMPRESA);

                var limiteCliente = (from linha in ctx.TB_CLIENTEs
                                     where linha.ID_CLIENTE == CODIGO_CLIENTE
                                     select new
                                     {
                                         linha.TB_LIMITE.VALOR_LIMITE
                                     }).ToList();

                decimal _limiteCliente = 0;

                foreach (var item in limiteCliente)
                    _limiteCliente = (decimal)item.VALOR_LIMITE;

                var EmAberto = (from linha in ctx.TB_FINANCEIROs
                                where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.CREDITO_DEBITO == 0

                                select linha).Sum(ab => ab.VALOR_TOTAL);

                EmAberto += Doran_Limite_Credito_Cliente.Limite_Excedido_Cliente(CODIGO_CLIENTE);

                if (EmAberto > _limiteCliente)
                    EmAberto = EmAberto - _limiteCliente;
                else
                    EmAberto = 0;

                var Abatimentos = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                                   orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                                   where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                   && linha.SALDO_RESTANTE > (decimal)0.00

                                   select linha).Sum(a => a.SALDO_RESTANTE);

                string _aReceber = aReceber.ToString();
                _aReceber = _aReceber.Replace(",", ".");

                string _Inadimplente = Inadimplente.ToString();
                _Inadimplente = _Inadimplente.Replace(",", ".");

                string _emAberto = EmAberto.ToString();
                _emAberto = _emAberto.Replace(",", ".");

                string _Abatimentos = Abatimentos.HasValue ? Abatimentos.ToString() : "";
                _Abatimentos = _Abatimentos.Replace(",", ".");

                List<string> retorno = new List<string>();

                retorno.Add("['Total a Receber', " + _aReceber + "]");
                retorno.Add("['Total Inadimplente', " + _Inadimplente + "]");
                retorno.Add("['Limite de Crédito Excedido', " + _emAberto + " ]");
                retorno.Add("['Abatimento(s)', " + _Abatimentos + " ]");

                return retorno;
            }
        }
    }
}
