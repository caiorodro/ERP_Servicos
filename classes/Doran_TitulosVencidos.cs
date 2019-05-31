using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public enum Vencidos
    {
        PAGAR,
        RECEBER
    };

    public class Doran_TitulosVencidos : IDisposable
    {
        public string cliente_fornecedor
        {
            get;
            set;
        }

        public decimal VENDEDOR { get; set; }
        private decimal ID_EMPRESA { get; set; }

        public Doran_TitulosVencidos(string _clientefornecedor, decimal _ID_EMPRESA)
        {
            cliente_fornecedor = _clientefornecedor;
            VENDEDOR = 0;
            ID_EMPRESA = _ID_EMPRESA;
        }

        public string MontaRelatorioAReceber()
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Relat&oacute;rio de T&iacute;tulos a Receber Vencidos", 60);

                DateTime dataLimite = Doran_TitulosVencidos.DataLimiteParaVencimento();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.DATA_VENCIMENTO < dataLimite
                                && linha.CREDITO_DEBITO == 0
                                // && linha.CODIGO_CLIENTE > 0
                                && linha.HISTORICO.Contains(cliente_fornecedor)
                                && linha.CODIGO_EMITENTE == ID_EMPRESA

                                select new
                                {
                                    linha.NUMERO_FINANCEIRO,
                                    linha.NUMERO_SEQ_NF_SAIDA,
                                    linha.NUMERO_NF_SAIDA,
                                    linha.NUMERO_SEQ_NF_ENTRADA,
                                    linha.HISTORICO,
                                    linha.DATA_LANCAMENTO,
                                    linha.DATA_VENCIMENTO,
                                    CLIENTE = linha.TB_NOTA_SAIDA == null ? "" : linha.TB_NOTA_SAIDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    VENDEDOR = linha.TB_NOTA_SAIDA == null ? "" : linha.TB_NOTA_SAIDA.NOME_VENDEDOR_NF,
                                    CODIGO_VENDEDOR = linha.TB_NOTA_SAIDA == null ? 0 : linha.TB_NOTA_SAIDA.CODIGO_VENDEDOR_NF,
                                    VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO,
                                    linha.VALOR_APROXIMADO
                                };

                    if (VENDEDOR > 0)
                        query = query.Where(_ => _.CODIGO_VENDEDOR == VENDEDOR);

                    string _conteudo = "<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>";

                    _conteudo += @"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>NF / Duplicata</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Lan&ccedil;amento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Vencimento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid;  border-color:#C0C0C0;'>Vendedor</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor Aproximado?</td>
                                  </tr>";

                    decimal Total = 0;

                    foreach (var item in query)
                    {
                        DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                        while (Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        DateTime _limite = DateTime.Now;

                        if (_limite.DayOfWeek == DayOfWeek.Saturday)
                            _limite = _limite.AddDays(-2);

                        if (_limite.DayOfWeek == DayOfWeek.Sunday)
                            _limite = _limite.AddDays(-3);

                        decimal valor = (decimal)item.VALOR_TOTAL - Doran_TitulosVencidos.PagoParcialmente(item.NUMERO_FINANCEIRO);

                        if (_vencimento < _limite)
                        {
                            _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0; text-align: right;'>{5}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{6}</td>
                                      </tr>", item.NUMERO_NF_SAIDA.ToString() + "/" + ApoioXML.LetrasDuplicatas_ERP_Servicos(item.NUMERO_SEQ_NF_SAIDA, item.NUMERO_SEQ_NF_ENTRADA, item.DATA_VENCIMENTO),
                                                ApoioXML.Data((DateTime)item.DATA_LANCAMENTO),
                                                ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                                string.IsNullOrEmpty(item.CLIENTE) ? item.HISTORICO : item.CLIENTE.Trim(),
                                                string.IsNullOrEmpty(item.VENDEDOR) ? "" : item.VENDEDOR.Trim(),
                                                ((decimal)valor).ToString("c"),
                                                item.VALOR_APROXIMADO == 1 ? "S" : "");

                            Total += valor;
                        }
                    }

                    _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                      </tr></table>", "Total..:", ((decimal)Total).ToString("c"));

                    r.InsereConteudo(_conteudo);

                    retorno = r.SalvaDocumento("Doran_Titulos_Receber_Vencidos");
                }

                return retorno;
            }
        }

        public string MontaRelatorioAPagar()
        {
            string retorno = "";

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Relat&oacute;rio de T&iacute;tulos a Pagar Vencidos", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.DATA_VENCIMENTO < DateTime.Now
                                && linha.CREDITO_DEBITO == 1
                                && linha.HISTORICO.Contains(cliente_fornecedor)
                                && linha.CODIGO_EMITENTE == ID_EMPRESA

                                && (linha.TB_NOTA_SAIDA.CODIGO_VENDEDOR_NF == VENDEDOR || VENDEDOR == 0)

                                select new
                                {
                                    linha.NUMERO_FINANCEIRO,
                                    linha.NUMERO_SEQ_NF_ENTRADA,
                                    linha.NUMERO_NF_ENTRADA,
                                    linha.NUMERO_SEQ_NF_SAIDA,
                                    linha.NUMERO_NF_SAIDA,
                                    linha.DATA_LANCAMENTO,
                                    linha.DATA_VENCIMENTO,
                                    linha.HISTORICO,
                                    VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO,
                                    linha.VALOR_APROXIMADO
                                };

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

                    string _conteudo = "<table style='width: 70%; font-family: tahoma; font-size: 8pt;'>";

                    _conteudo += @"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>NF / Duplicata</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Lan&ccedil;amento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Vencimento</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0;'>Hist&oacute;rico</td>
                                    <td style='BORDER-BOTTOM: 1px solid; border-color:#C0C0C0; text-align: right;'>Valor</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right; border-color:#C0C0C0;'>Valor Aproximado?</td>
                                  </tr>";

                    decimal Total = 0;

                    int i = 0;

                    foreach (var item in query)
                    {
                        DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                        while (Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        DateTime _limite = DateTime.Now;

                        if (_limite.DayOfWeek == DayOfWeek.Saturday)
                            _limite = _limite.AddDays(-2);

                        if (_limite.DayOfWeek == DayOfWeek.Sunday)
                            _limite = _limite.AddDays(-3);

                        if (_vencimento < _limite)
                        {
                            string dupliacata = ApoioXML.LetrasDuplicatas_ERP_Servicos(item.NUMERO_SEQ_NF_SAIDA, item.NUMERO_SEQ_NF_ENTRADA,
                                item.DATA_VENCIMENTO);

                            decimal valor = (decimal)item.VALOR_TOTAL - Doran_TitulosVencidos.PagoParcialmente(item.NUMERO_FINANCEIRO);

                            _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-LEFT: 1px solid; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-LEFT: 1px solid; border-color:#C0C0C0;'>{2}</td>
                                        <td style='BORDER-LEFT: 1px solid; border-color:#C0C0C0;'>{3}</td>
                                        <td style='BORDER-LEFT: 1px solid; border-color:#C0C0C0; text-align: right;'>{4}</td>
                                        <td style='BORDER-RIGHT: 1px solid; border-color:#C0C0C0;'>{5}</td>
                                      </tr>", dupliacata == "" ? "" : item.NUMERO_NF_ENTRADA.ToString() + "/" + dupliacata,
                                                ApoioXML.Data((DateTime)item.DATA_LANCAMENTO),
                                                ApoioXML.Data((DateTime)item.DATA_VENCIMENTO),
                                                item.HISTORICO.Trim(),
                                                ((decimal)valor).ToString("c"),
                                                item.VALOR_APROXIMADO == 1 ? "S" : "");

                            Total += valor;
                            i++;
                        }
                    }

                    _conteudo += string.Format(@"<tr>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>{0}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>{1}</td>
                                        <td style='BORDER-TOP: 1px solid; text-align: right; border-color:#C0C0C0;'>&nbsp;</td>
                                      </tr></table>", "Total..:", ((decimal)Total).ToString("c"));

                    r.InsereConteudo(_conteudo);

                    retorno = r.SalvaDocumento("Doran_Titulos_Receber_Vencidos");
                }

                return retorno;
            }
        }

        public static DateTime DataLimiteParaVencimento()
        {
            DateTime retorno = new DateTime();
            DateTime hoje = DateTime.Today;
            hoje = hoje.AddDays(1);
            hoje = hoje.AddSeconds(-1);

            if (hoje.DayOfWeek == DayOfWeek.Saturday)
                retorno = hoje.AddDays(2);

            else if (hoje.DayOfWeek == DayOfWeek.Sunday)
                retorno = hoje.AddDays(1);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                ctx.Connection.Open();
                ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                while (true)
                {
                    var query = from linha in ctx.TB_FERIADOs
                                where linha.DATA_FERIADO == hoje
                                select linha;

                    if (query.Count() > 0)
                        hoje = hoje.AddDays(1);
                    else
                        break;
                }

                hoje = hoje.AddDays(1);
                hoje = hoje.AddHours(-hoje.Hour);
                hoje = hoje.AddMinutes(-hoje.Minute);
                hoje = hoje.AddSeconds(-hoje.Second);

                return hoje;
            }
        }

        public static DateTime DataLimiteParaVencimento(DataContext ctx)
        {
            DateTime retorno = new DateTime();
            DateTime hoje = DateTime.Today;
            hoje = hoje.AddDays(1);
            hoje = hoje.AddSeconds(-1);

            if (hoje.DayOfWeek == DayOfWeek.Saturday)
                retorno = hoje.AddDays(2);

            else if (hoje.DayOfWeek == DayOfWeek.Sunday)
                retorno = hoje.AddDays(1);

            while (true)
            {
                var query = (from linha in ctx.GetTable<TB_FERIADO>()
                             where linha.DATA_FERIADO == hoje
                             select linha).ToList();

                if (query.Count() > 0)
                    hoje = hoje.AddDays(1);
                else
                    break;
            }

            hoje = hoje.AddDays(1);
            hoje = hoje.AddHours(-hoje.Hour);
            hoje = hoje.AddMinutes(-hoje.Minute);
            hoje = hoje.AddSeconds(-hoje.Second);

            return hoje;
        }

        public static bool Feriado_FimDeSemana(DateTime _data)
        {
            bool retorno = false;

            //retorno = _data.DayOfWeek == DayOfWeek.Saturday || _data.DayOfWeek == DayOfWeek.Sunday || _data.DayOfWeek == DayOfWeek.Friday ?
            //    true : false;

            if (!retorno)
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var existe = (from linha in ctx.TB_FERIADOs
                                  where linha.DATA_FERIADO == _data
                                  select linha).Count();


                    retorno = existe > 0 ? true : false;
                }
            }

            return retorno;
        }

        public static bool Feriado_FimDeSemana(DateTime _data, DataContext ctx)
        {
            bool retorno = false;

            //retorno = _data.DayOfWeek == DayOfWeek.Saturday || _data.DayOfWeek == DayOfWeek.Sunday || _data.DayOfWeek == DayOfWeek.Friday ?
            //    true : false;

            if (!retorno)
            {
                var existe = (from linha in ctx.GetTable<TB_FERIADO>()
                              where linha.DATA_FERIADO == _data
                              select linha).Count();


                retorno = existe > 0 ? true : false;
            }

            return retorno;
        }

        public static decimal TotalVencidos(Vencidos recepberPagar, decimal CODIGO_CLIENTE_FORNECEDOR, decimal ID_EMPRESA)
        {
            DateTime dataLimite = Doran_TitulosVencidos.DataLimiteParaVencimento();
            decimal? retorno = 0;

            if (recepberPagar == Vencidos.RECEBER)
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.DATA_VENCIMENTO < dataLimite
                                && linha.CREDITO_DEBITO == 0
                                && linha.CODIGO_EMITENTE == ID_EMPRESA

                                select linha;

                    if (CODIGO_CLIENTE_FORNECEDOR > 0)
                        query = query.Where(c => c.CODIGO_CLIENTE == CODIGO_CLIENTE_FORNECEDOR);
                    else
                        query = query.Where(c => c.CODIGO_CLIENTE > 0);

                    foreach (var item in query)
                    {
                        DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (_vencimento < DateTime.Now)
                            retorno += (item.VALOR + item.VALOR_ACRESCIMO + item.VALOR_MULTA) - item.VALOR_DESCONTO;
                    }

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

                    foreach (DataRow dr in dt.Rows)
                    {
                        retorno -= Doran_TitulosVencidos.PagoParcialmente(Convert.ToDecimal(dr["NUMERO_FINANCEIRO"]));

                        if (retorno < (decimal)0.00)
                            retorno = 0;
                    }
                }
            }
            else
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.DATA_VENCIMENTO < dataLimite
                                && linha.CREDITO_DEBITO == 1
                                && linha.CODIGO_EMITENTE == ID_EMPRESA

                                && (linha.CODIGO_FORNECEDOR == CODIGO_CLIENTE_FORNECEDOR || CODIGO_CLIENTE_FORNECEDOR == 0)
                                select linha;

                    foreach (var item in query)
                    {
                        DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (_vencimento < DateTime.Now)
                            retorno += (item.VALOR + item.VALOR_ACRESCIMO + item.VALOR_MULTA) - item.VALOR_DESCONTO;
                    }

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

                    foreach (DataRow dr in dt.Rows)
                    {
                        retorno -= Doran_TitulosVencidos.PagoParcialmente(Convert.ToDecimal(dr["NUMERO_FINANCEIRO"]));
                    }
                }
            }

            return retorno.HasValue ? (decimal)retorno : 0;
        }

        public static decimal TotalVencidos(Vencidos recepberPagar, decimal CODIGO_CLIENTE_FORNECEDOR, DataContext ctx, decimal ID_EMPRESA)
        {
            DateTime dataLimite = Doran_TitulosVencidos.DataLimiteParaVencimento(ctx);
            
            decimal? retorno = 0;

            if (recepberPagar == Vencidos.RECEBER)
            {
                var query = from linha in ctx.GetTable<TB_FINANCEIRO>()
                            where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                            && linha.DATA_VENCIMENTO < dataLimite
                            && linha.CREDITO_DEBITO == 0
                            && linha.CODIGO_EMITENTE == ID_EMPRESA

                            && (linha.CODIGO_CLIENTE == CODIGO_CLIENTE_FORNECEDOR || CODIGO_CLIENTE_FORNECEDOR == 0)

                            select new TABELA_DATA_VENCIMENTO()
                            {
                                NUMERO_FINANCEIRO = linha.NUMERO_FINANCEIRO,
                                DATA_VENCIMENTO = linha.DATA_VENCIMENTO,
                                VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO
                            };

                foreach (var item in query)
                {
                    DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                    while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento, ctx))
                        _vencimento = _vencimento.AddDays(1);

                    if (_vencimento < DateTime.Now)
                        retorno += item.VALOR_TOTAL;
                }

                DataTable dt = ApoioXML.ToTable<TABELA_DATA_VENCIMENTO>(query);

                foreach (DataRow dr in dt.Rows)
                {
                    retorno -= Doran_TitulosVencidos.PagoParcialmente(Convert.ToDecimal(dr["NUMERO_FINANCEIRO"]), ctx);

                    if (retorno < (decimal)0.00)
                        retorno = 0;
                }
            }
            else
            {
                var query = (from linha in ctx.GetTable<TB_FINANCEIRO>()
                             where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                             && linha.DATA_VENCIMENTO < dataLimite
                             && linha.CREDITO_DEBITO == 1
                             && linha.CODIGO_EMITENTE == ID_EMPRESA

                             && (linha.CODIGO_FORNECEDOR == CODIGO_CLIENTE_FORNECEDOR || CODIGO_CLIENTE_FORNECEDOR == 0)

                             select new TABELA_DATA_VENCIMENTO()
                             {
                                 NUMERO_FINANCEIRO = linha.NUMERO_FINANCEIRO,
                                 DATA_VENCIMENTO = linha.DATA_VENCIMENTO,
                                 VALOR_TOTAL = (linha.VALOR + linha.VALOR_ACRESCIMO + linha.VALOR_MULTA) - linha.VALOR_DESCONTO
                             }).ToList();

                foreach (var item in query)
                {
                    DateTime _vencimento = Convert.ToDateTime(item.DATA_VENCIMENTO);

                    while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento, ctx))
                        _vencimento = _vencimento.AddDays(1);

                    if (_vencimento < DateTime.Now)
                        retorno += (decimal)item.VALOR_TOTAL;
                }

                DataTable dt = ApoioXML.ToTable<TABELA_DATA_VENCIMENTO>(query);

                foreach (DataRow dr in dt.Rows)
                {
                    retorno -= Doran_TitulosVencidos.PagoParcialmente(Convert.ToDecimal(dr["NUMERO_FINANCEIRO"]), ctx);
                }
            }

            return retorno.HasValue ? (decimal)retorno : 0;
        }

        public static decimal PagoParcialmente(decimal NUMERO_FINANCEIRO)
        {
            decimal retorno = 0;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var soma = (from linha in ctx.TB_PAGTO_PARCIALs
                            where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                            select linha).Sum(valor => valor.VALOR_PAGTO);

                if (soma.HasValue)
                    retorno = (decimal)soma;
            }

            return retorno;
        }

        public static decimal PagoParcialmente(decimal NUMERO_FINANCEIRO, DataContext ctx)
        {
            decimal retorno = 0;

            var soma = (from linha in ctx.GetTable<TB_PAGTO_PARCIAL>()
                        where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                        select linha).Sum(valor => valor.VALOR_PAGTO);

            if (soma.HasValue)
                retorno = (decimal)soma;

            return retorno;
        }

        public static DateTime ProximoDiaUtil(DataContext ctx)
        {
            List<DayOfWeek> dias_uteis = new List<DayOfWeek>();

            dias_uteis.Add(DayOfWeek.Monday);
            dias_uteis.Add(DayOfWeek.Tuesday);
            dias_uteis.Add(DayOfWeek.Wednesday);
            dias_uteis.Add(DayOfWeek.Thursday);
            dias_uteis.Add(DayOfWeek.Friday);

            DateTime dt1 = DateTime.Today.AddDays(1);
            
            while (!dias_uteis.Contains(dt1.DayOfWeek))
                dt1 = dt1.AddDays(1);

            while ((from linha in ctx.GetTable<TB_FERIADO>()
                       where linha.DATA_FERIADO == dt1
                       select linha).Any())
            {
                dt1 = dt1.AddDays(1);
            }

            return dt1;
        }

        class TABELA_DATA_VENCIMENTO
        {
            public TABELA_DATA_VENCIMENTO()
            {

            }

            public decimal NUMERO_FINANCEIRO { get; set; }
            public DateTime? DATA_VENCIMENTO { get; set; }
            public decimal? VALOR_TOTAL { get; set; }
        }

        #region IDisposable Members

        public void Dispose()
        {
            cliente_fornecedor = null;
        }

        #endregion
    }
}