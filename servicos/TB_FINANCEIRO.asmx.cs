using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Globalization;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_ERP_Servicos.classes;
using System.Data;
using Doran_Base.Auditoria;
using System.Data.Linq;
using Doran_Base.CNAB;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_FINANCEIRO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_FINANCEIRO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_Financeiro(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs

                                select new
                                {
                                    NUMERO_FINANCEIRO = linha.NUMERO_FINANCEIRO,
                                    DATA_LANCAMENTO = linha.DATA_LANCAMENTO,
                                    DATA_VENCIMENTO = linha.DATA_VENCIMENTO,
                                    DATA_PAGAMENTO = linha.DATA_PAGAMENTO,
                                    NUMERO_NF_SAIDA = linha.NUMERO_NF_SAIDA,
                                    NUMERO_NF_ENTRADA = linha.NUMERO_NF_ENTRADA,
                                    HISTORICO = linha.HISTORICO,
                                    VALOR = linha.VALOR,
                                    VALOR_DESCONTO = linha.VALOR_DESCONTO,
                                    VALOR_ACRESCIMO = linha.VALOR_ACRESCIMO,
                                    VALOR_MULTA = linha.VALOR_MULTA,
                                    PERC_JUROS_DIA = linha.PERC_JUROS_DIA,
                                    VALOR_TOTAL = linha.VALOR_TOTAL,
                                    CREDITO_DEBITO = linha.CREDITO_DEBITO,
                                    linha.CODIGO_CLIENTE,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.ID_PLANO,
                                    linha.TB_PLANO_CONTA.DESCRICAO_PLANO,
                                    linha.VALOR_APROXIMADO,
                                    linha.MARCA_REMESSA,
                                    linha.REMESSA,
                                    linha.RETORNO,
                                    linha.NUMERO_BANCO,
                                    linha.TB_BANCO.NOME_BANCO,
                                    linha.INSTRUCAO_REMESSA,
                                    linha.TB_OCORRENCIA_BANCARIA_REMESSA.DESCRICAO_OCORRENCIA,
                                    REMESSA_BANCO = linha.TB_OCORRENCIA_BANCARIA_REMESSA.TB_BANCO.NOME_BANCO,
                                    PAGO_PARCIAL = linha.TB_PAGTO_PARCIALs.Count,
                                    AVISTA = linha.DATA_LANCAMENTO.Value.AddDays(1),
                                    linha.NOSSO_NUMERO_BANCARIO,
                                    linha.TITULO_MARCADO_UNIAO,
                                    linha.ID_USUARIO_MARCA_UNIAO
                                };

                    if (dados["OPCOES"].ToString() == "T" || dados["OPCOES"].ToString() == "A")
                    {
                        DateTime df = Convert.ToDateTime(dados["EMISSAO_FINAL"]);
                        df = df.AddDays(1);

                        query = query.Where(v => v.DATA_LANCAMENTO >= Convert.ToDateTime(dados["EMISSAO"])
                            && v.DATA_LANCAMENTO < df);
                    }

                    if (dados["OPCOES"].ToString() == "A")
                    {
                        query = query.OrderBy(e => e.DATA_PAGAMENTO);

                        query = query.Where(a => a.DATA_PAGAMENTO == new DateTime(1901, 01, 01));
                    }

                    bool ordem_lancamento = false;

                    if (dados.ContainsKey("sortField"))
                    {
                        if (dados["sortField"].ToString() == "DATA_LANCAMENTO")
                        {
                            ordem_lancamento = true;

                            query = query.OrderBy(e => e.DATA_LANCAMENTO);

                            DateTime df = Convert.ToDateTime(dados["EMISSAO_FINAL"]);
                            df = df.AddDays(1);

                            query = query.Where(v => v.DATA_LANCAMENTO >= Convert.ToDateTime(dados["EMISSAO"])
                                && v.DATA_LANCAMENTO < df);
                        }
                    }

                    if (!ordem_lancamento)
                    {
                        if (dados["OPCOES"].ToString() == "V")
                        {
                            query = query.OrderBy(e => e.DATA_PAGAMENTO);

                            query = query.Where(ve => ve.DATA_PAGAMENTO == new DateTime(1901, 01, 01));

                            DateTime _vencimento = DateTime.Today;

                            _vencimento = _vencimento.AddHours(-_vencimento.Hour);
                            _vencimento = _vencimento.AddMinutes(-_vencimento.Minute);
                            _vencimento = _vencimento.AddSeconds(-_vencimento.Second);

                            _vencimento = _vencimento.AddDays(1);
                            _vencimento = _vencimento.AddSeconds(-1);

                            while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                                _vencimento = _vencimento.AddDays(1);

                            query = query.Where(ve => ve.DATA_VENCIMENTO < _vencimento);
                        }
                    }

                    if (dados["OPCOES"].ToString() == "R")
                    {
                        query = query.Where(ve => ve.MARCA_REMESSA == 1 && ve.CREDITO_DEBITO == 0);
                    }

                    if (dados["OPCOES"].ToString() == "G") // Remessa Gerada
                    {
                        query = query.Where(g => g.REMESSA == 1);
                    }

                    if (dados["OPCOES"].ToString() == "D") // Retorno do Banco
                    {
                        query = query.Where(g => g.RETORNO == 1);
                    }

                    if (dados["OPCOES"].ToString() == "P") // Pagos Parcialmente
                    {
                        query = query.Where(g => g.PAGO_PARCIAL > 0);
                    }

                    if (dados["OPCOES"].ToString() == "X") // Títulos com Valor Aproximado
                    {
                        query = query.Where(g => g.VALOR_APROXIMADO == 1);
                    }

                    if (Convert.ToDecimal(dados["VALOR"]) > 0)
                        query = query.Where(va => va.VALOR == Convert.ToDecimal(dados["VALOR"]));

                    if (dados["PAGAR_RECEBER"].ToString() == "R")
                        query = query.Where(pr => pr.CREDITO_DEBITO == 0);

                    if (dados["PAGAR_RECEBER"].ToString() == "P")
                        query = query.Where(pr => pr.CREDITO_DEBITO == 1);

                    if (dados["NUMERO_NF_SAIDA"].ToString().Length > 0)
                        query = query.Where(nf => nf.NUMERO_NF_SAIDA == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]));

                    if (dados["NUMERO_NF_ENTRADA"].ToString().Length > 0)
                        query = query.Where(nf => nf.NUMERO_NF_ENTRADA == Convert.ToDecimal(dados["NUMERO_NF_ENTRADA"]));

                    if (dados["NUMERO_FINANCEIRO"].ToString().Length > 0)
                        query = query.Where(nf => nf.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]));

                    if (dados.ContainsKey("NUMERO_BANCO"))
                        if (Convert.ToDecimal(dados["NUMERO_BANCO"]) > 0)
                            query = query.Where(nf => nf.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"]));

                    query = query.Where(nf => nf.HISTORICO.Contains(dados["CLIENTE_FORNECEDOR"].ToString()));

                    if (dados["OPCOES"].ToString() == "R")
                        query = query.OrderBy(f => f.MARCA_REMESSA);
                    else
                    {
                        if (ordem_lancamento)
                            query = query.OrderBy(f => f.DATA_LANCAMENTO);
                        else
                            query = query.OrderBy(f => f.DATA_VENCIMENTO);
                    }

                    //// Titulos a vista
                    if (dados["OPCOES"].ToString() == "S")
                        query = query.Where(a => a.DATA_LANCAMENTO <= a.AVISTA);

                    if (dados["OPCOES"].ToString() == "Z")
                        query = query.Where(a => a.DATA_LANCAMENTO > a.AVISTA);

                    int rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataSet ds = ApoioXML.ToDataSet(ctx, query1, rowCount);

                    ds.Tables[0].Columns.Add("STATUS");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DateTime _vencimento = Convert.ToDateTime(dr["DATA_VENCIMENTO"]);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (Convert.ToDateTime(dr["DATA_PAGAMENTO"]) == new DateTime(1901, 01, 01))
                            dr["STATUS"] = _vencimento < DateTime.Now ?
                                "<span style='background-Color: red; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Vencido</span>" :
                                "<span style='background-Color: #993399; color: #ffffff; font-size: 10pt;'>T&iacute;tulo a Vencer</span>";
                        else
                            dr["STATUS"] = "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>";
                    }

                    ds.Tables[0].Columns.Add("PAGTO_PARCIAL");
                    ds.Tables[0].Columns.Add("VALOR_PAGO_PARCIAL");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        var pp = from linha in ctx.TB_PAGTO_PARCIALs
                                 where linha.NUMERO_FINANCEIRO == Convert.ToDecimal(dr["NUMERO_FINANCEIRO"])
                                 select linha;

                        decimal? soma = pp.Sum(p => p.VALOR_PAGTO);

                        if (soma.HasValue)
                        {
                            dr["PAGTO_PARCIAL"] = 1;
                            dr["VALOR_PAGO_PARCIAL"] = soma;
                        }
                        else
                        {
                            dr["PAGTO_PARCIAL"] = 0;
                            dr["VALOR_PAGO_PARCIAL"] = 0;
                        }
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Financeiro_Nota_Saida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                orderby linha.NUMERO_NF_SAIDA

                                where linha.NUMERO_NF_SAIDA == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"])
                                && linha.NUMERO_NF_SAIDA > 0

                                select new
                                {
                                    NUMERO_FINANCEIRO = linha.NUMERO_FINANCEIRO,
                                    DATA_LANCAMENTO = linha.DATA_LANCAMENTO,
                                    DATA_VENCIMENTO = linha.DATA_VENCIMENTO,
                                    DATA_PAGAMENTO = linha.DATA_PAGAMENTO,
                                    NUMERO_NF_SAIDA = linha.NUMERO_NF_SAIDA,
                                    NUMERO_NF_ENTRADA = linha.NUMERO_NF_ENTRADA,
                                    HISTORICO = linha.HISTORICO,
                                    VALOR = linha.VALOR,
                                    VALOR_DESCONTO = linha.VALOR_DESCONTO,
                                    VALOR_ACRESCIMO = linha.VALOR_ACRESCIMO,
                                    VALOR_MULTA = linha.VALOR_MULTA,
                                    PERC_JUROS_DIA = linha.PERC_JUROS_DIA,
                                    VALOR_TOTAL = linha.VALOR_TOTAL,
                                    CREDITO_DEBITO = linha.CREDITO_DEBITO,
                                    linha.CODIGO_CLIENTE,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.ID_PLANO,
                                    linha.TB_PLANO_CONTA.DESCRICAO_PLANO,
                                    linha.VALOR_APROXIMADO,
                                    linha.MARCA_REMESSA,
                                    linha.REMESSA,
                                    linha.RETORNO,
                                    linha.NUMERO_BANCO,
                                    linha.TB_BANCO.NOME_BANCO,
                                    linha.INSTRUCAO_REMESSA,
                                    linha.TB_OCORRENCIA_BANCARIA_REMESSA.DESCRICAO_OCORRENCIA,
                                    REMESSA_BANCO = linha.TB_OCORRENCIA_BANCARIA_REMESSA.TB_BANCO.NOME_BANCO,
                                    PAGO_PARCIAL = linha.TB_PAGTO_PARCIALs.Count,
                                    AVISTA = linha.DATA_LANCAMENTO.Value.AddDays(1),
                                    linha.NOSSO_NUMERO_BANCARIO,
                                    linha.TITULO_MARCADO_UNIAO,
                                    linha.ID_USUARIO_MARCA_UNIAO
                                };

                    int rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataSet ds = ApoioXML.ToDataSet(ctx, query1, rowCount);

                    ds.Tables[0].Columns.Add("STATUS");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DateTime _vencimento = Convert.ToDateTime(dr["DATA_VENCIMENTO"]);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (Convert.ToDateTime(dr["DATA_PAGAMENTO"]) == new DateTime(1901, 01, 01))
                            dr["STATUS"] = _vencimento < DateTime.Now ?
                                "<span style='background-Color: red; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Vencido</span>" :
                                "<span style='background-Color: #993399; color: #ffffff; font-size: 10pt;'>T&iacute;tulo a Vencer</span>";
                        else
                            dr["STATUS"] = "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>";
                    }

                    ds.Tables[0].Columns.Add("PAGTO_PARCIAL");
                    ds.Tables[0].Columns.Add("VALOR_PAGO_PARCIAL");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        var pp = from linha in ctx.TB_PAGTO_PARCIALs
                                 where linha.NUMERO_FINANCEIRO == Convert.ToDecimal(dr["NUMERO_FINANCEIRO"])
                                 select linha;

                        decimal? soma = pp.Sum(p => p.VALOR_PAGTO);

                        if (soma.HasValue)
                        {
                            dr["PAGTO_PARCIAL"] = 1;
                            dr["VALOR_PAGO_PARCIAL"] = soma;
                        }
                        else
                        {
                            dr["PAGTO_PARCIAL"] = 0;
                            dr["VALOR_PAGO_PARCIAL"] = 0;
                        }
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Financeiro_Nota_Entrada(Dictionary<string, object> dados)
        {


            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                orderby linha.NUMERO_NF_ENTRADA

                                where linha.NUMERO_NF_ENTRADA == Convert.ToDecimal(dados["NUMERO_NF_ENTRADA"])
                                && linha.NUMERO_NF_ENTRADA > 0

                                select new
                                {
                                    NUMERO_FINANCEIRO = linha.NUMERO_FINANCEIRO,
                                    DATA_LANCAMENTO = linha.DATA_LANCAMENTO,
                                    DATA_VENCIMENTO = linha.DATA_VENCIMENTO,
                                    DATA_PAGAMENTO = linha.DATA_PAGAMENTO,
                                    NUMERO_NF_SAIDA = linha.NUMERO_NF_SAIDA,
                                    NUMERO_NF_ENTRADA = linha.NUMERO_NF_ENTRADA,
                                    HISTORICO = linha.HISTORICO,
                                    VALOR = linha.VALOR,
                                    VALOR_DESCONTO = linha.VALOR_DESCONTO,
                                    VALOR_ACRESCIMO = linha.VALOR_ACRESCIMO,
                                    VALOR_MULTA = linha.VALOR_MULTA,
                                    PERC_JUROS_DIA = linha.PERC_JUROS_DIA,
                                    VALOR_TOTAL = linha.VALOR_TOTAL,
                                    CREDITO_DEBITO = linha.CREDITO_DEBITO,
                                    linha.CODIGO_CLIENTE,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.ID_PLANO,
                                    linha.TB_PLANO_CONTA.DESCRICAO_PLANO,
                                    linha.VALOR_APROXIMADO,
                                    linha.MARCA_REMESSA,
                                    linha.REMESSA,
                                    linha.RETORNO,
                                    linha.NUMERO_BANCO,
                                    linha.TB_BANCO.NOME_BANCO,
                                    linha.INSTRUCAO_REMESSA,
                                    linha.TB_OCORRENCIA_BANCARIA_REMESSA.DESCRICAO_OCORRENCIA,
                                    REMESSA_BANCO = linha.TB_OCORRENCIA_BANCARIA_REMESSA.TB_BANCO.NOME_BANCO,
                                    PAGO_PARCIAL = linha.TB_PAGTO_PARCIALs.Count,
                                    AVISTA = linha.DATA_LANCAMENTO.Value.AddDays(1),
                                    linha.TITULO_MARCADO_UNIAO,
                                    linha.ID_USUARIO_MARCA_UNIAO
                                };
                    int rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataSet ds = ApoioXML.ToDataSet(ctx, query1, rowCount);

                    ds.Tables[0].Columns.Add("STATUS");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DateTime _vencimento = Convert.ToDateTime(dr["DATA_VENCIMENTO"]);

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (Convert.ToDateTime(dr["DATA_PAGAMENTO"]) == new DateTime(1901, 01, 01))
                            dr["STATUS"] = _vencimento < DateTime.Now ?
                                "<span style='background-Color: red; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Vencido</span>" :
                                "<span style='background-Color: #993399; color: #ffffff; font-size: 10pt;'>T&iacute;tulo a Vencer</span>";
                        else
                            dr["STATUS"] = "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>";
                    }

                    ds.Tables[0].Columns.Add("PAGTO_PARCIAL");
                    ds.Tables[0].Columns.Add("VALOR_PAGO_PARCIAL");

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        var pp = from linha in ctx.TB_PAGTO_PARCIALs
                                 where linha.NUMERO_FINANCEIRO == Convert.ToDecimal(dr["NUMERO_FINANCEIRO"])
                                 select linha;

                        decimal? soma = pp.Sum(p => p.VALOR_PAGTO);

                        if (soma.HasValue)
                        {
                            dr["PAGTO_PARCIAL"] = 1;
                            dr["VALOR_PAGO_PARCIAL"] = soma;
                        }
                        else
                        {
                            dr["PAGTO_PARCIAL"] = 0;
                            dr["VALOR_PAGO_PARCIAL"] = 0;
                        }
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaTotais(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    DateTime dataLimite = Doran_TitulosVencidos.DataLimiteParaVencimento();

                    decimal vencidosPagar = Doran_TitulosVencidos.TotalVencidos(Vencidos.PAGAR, 0, Convert.ToDecimal(dados["ID_EMPRESA"]));

                    decimal vencidosReceber = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, 0, Convert.ToDecimal(dados["ID_EMPRESA"]));

                    var query2 = (from linha in ctx.TB_FINANCEIROs
                                  where linha.DATA_PAGAMENTO > new DateTime(1901, 01, 01)
                                  && linha.CREDITO_DEBITO == 1
                                  && linha.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    decimal TotalPago = query2.Count() > 0 ? (decimal)query2.Sum(p => p.VALOR_TOTAL) : 0;

                    var query3 = (from linha in ctx.TB_FINANCEIROs
                                  where linha.DATA_PAGAMENTO > new DateTime(1901, 01, 01)
                                  && linha.CREDITO_DEBITO == 0
                                  && linha.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    decimal TotalRecebido = query3.Count() > 0 ? (decimal)query3.Sum(r => r.VALOR_TOTAL) : 0;

                    // Pagamentos Parciais
                    var query4 = (from linha in ctx.TB_PAGTO_PARCIALs
                                  where linha.DATA_PAGTO > new DateTime(1901, 01, 01)
                                  && linha.TB_FINANCEIRO.CREDITO_DEBITO == 1
                                  && linha.TB_FINANCEIRO.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    TotalPago += query4.Count() > 0 ? (decimal)query4.Sum(p => p.VALOR_PAGTO) : 0;

                    var query5 = (from linha in ctx.TB_PAGTO_PARCIALs
                                  where linha.DATA_PAGTO > new DateTime(1901, 01, 01)
                                  && linha.TB_FINANCEIRO.CREDITO_DEBITO == 0
                                  && linha.TB_FINANCEIRO.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    TotalRecebido += query5.Count() > 0 ? (decimal)query5.Sum(r => r.VALOR_PAGTO) : 0;

                    decimal SaldoAnterior = TotalRecebido - TotalPago;

                    DateTime datainicial = Convert.ToDateTime(dados["DATA_INICIAL"]);
                    DateTime datafinal = Convert.ToDateTime(dados["DATA_FINAL"]);

                    datafinal = datafinal.AddDays(1);

                    var query6 = (from linha in ctx.TB_FINANCEIROs
                                  where linha.DATA_VENCIMENTO >= datainicial && linha.DATA_VENCIMENTO < datafinal
                                  && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                  && linha.CREDITO_DEBITO == 1
                                  && linha.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    decimal TotalAPagar = query6.Count() > 0 ? (decimal)query6.Sum(r => r.VALOR_TOTAL) : 0;

                    var query7 = (from linha in ctx.TB_FINANCEIROs
                                  where linha.DATA_VENCIMENTO >= datainicial && linha.DATA_VENCIMENTO < datafinal
                                  && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                  && linha.CREDITO_DEBITO == 0
                                  && linha.CODIGO_EMITENTE == Convert.ToDecimal(dados["ID_EMPRESA"])
                                  select linha).ToList();

                    decimal TotalAReceber = query7.Count() > 0 ? (decimal)query7.Sum(r => r.VALOR_TOTAL) : 0;

                    decimal SaldoPrevisao = (SaldoAnterior + TotalAReceber) - TotalAPagar;

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    retorno.Add("VENCIDOS_A_PAGAR", vencidosPagar.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VENCIDOS_A_RECEBER", vencidosReceber.ToString("c", CultureInfo.CurrentCulture));

                    retorno.Add("SALDO_ANTERIOR", SaldoAnterior.ToString("c", CultureInfo.CurrentCulture));

                    retorno.Add("A_PAGAR", TotalAPagar.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("A_RECEBER", TotalAReceber.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("SALDO_PREVISAO", SaldoPrevisao.ToString("c", CultureInfo.CurrentCulture));

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoFinanceiro(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_FINANCEIRO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FINANCEIRO>();

                    Doran_Servicos_ORM.TB_FINANCEIRO novo = new Doran_Servicos_ORM.TB_FINANCEIRO();

                    DateTime dt = dados["DATA_PAGAMENTO"].ToString() == "" ? new DateTime(1901, 01, 01) : Convert.ToDateTime(dados["DATA_PAGAMENTO"]);

                    DateTime _vencimento = Convert.ToDateTime(dados["DATA_VENCIMENTO"]);
                    _vencimento = _vencimento.AddDays(1);
                    _vencimento = _vencimento.AddSeconds(-1);

                    novo.DATA_LANCAMENTO = DateTime.Now;
                    novo.DATA_VENCIMENTO = _vencimento;
                    novo.DATA_PAGAMENTO = dt;
                    novo.VALOR = Convert.ToDecimal(dados["VALOR"]);
                    novo.VALOR_DESCONTO = Convert.ToDecimal(dados["VALOR_DESCONTO"]);
                    novo.VALOR_ACRESCIMO = Convert.ToDecimal(dados["VALOR_ACRESCIMO"]);
                    novo.VALOR_TOTAL = Convert.ToDecimal(dados["VALOR_TOTAL"]);
                    novo.HISTORICO = dados["HISTORICO"].ToString();
                    novo.CREDITO_DEBITO = Convert.ToDecimal(dados["CREDITO_DEBITO"]);

                    novo.NUMERO_SEQ_NF_SAIDA = 0;
                    novo.NUMERO_SEQ_NF_ENTRADA = 0;

                    decimal NF = decimal.TryParse(dados["NUMERO_NF_SAIDA"].ToString(), out NF) ?
                        Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) : 0;

                    novo.NUMERO_NF_SAIDA = NF;

                    NF = decimal.TryParse(dados["NUMERO_NF_ENTRADA"].ToString(), out NF) ?
                        Convert.ToDecimal(dados["NUMERO_NF_ENTRADA"]) : 0;

                    novo.NUMERO_NF_ENTRADA = NF;

                    if (novo.CREDITO_DEBITO == 0)
                    {
                        novo.CODIGO_CLIENTE = Convert.ToDecimal(dados["CODIGO_CLIENTE_FORNECEDOR"]);
                        novo.CODIGO_FORNECEDOR = 0;
                    }
                    else
                    {
                        novo.CODIGO_CLIENTE = 0;
                        novo.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CLIENTE_FORNECEDOR"]);
                    }

                    if (novo.CODIGO_CLIENTE > 0 && Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) > 0)
                    {
                        var CONSISTENCIA_CLIENTE = (from linha in ctx.TB_NOTA_SAIDAs
                                                    where linha.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"])
                                                    && linha.CODIGO_CLIENTE_NF == Convert.ToDecimal(dados["CODIGO_CLIENTE_FORNECEDOR"])
                                                    select linha).Any();

                        if (!CONSISTENCIA_CLIENTE)
                            throw new Exception("O cliente da nota fiscal &eacute; diferente do cliente inserido nesse t&iacute;tulo");
                    }

                    novo.VALOR_MULTA = Convert.ToDecimal(dados["VALOR_MULTA"]);
                    novo.PERC_JUROS_DIA = Convert.ToDecimal(dados["PERC_JUROS_DIA"]);


                    novo.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);
                    novo.ID_PLANO = dados["ID_PLANO_FINANCEIRO"].ToString();
                    novo.VALOR_APROXIMADO = Convert.ToDecimal(dados["VALOR_APROXIMADO"]);

                    novo.MARCA_REMESSA = 0;
                    novo.REMESSA = 0;
                    novo.RETORNO = 0;

                    decimal NUMERO_BANCO = decimal.TryParse(dados["NUMERO_BANCO"].ToString(), out NUMERO_BANCO) ?
                        Convert.ToDecimal(dados["NUMERO_BANCO"]) : 0;

                    novo.NUMERO_BANCO = NUMERO_BANCO;

                    novo.INSTRUCAO_REMESSA = 0;
                    novo.NOSSO_NUMERO_BANCARIO = string.Empty;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();

                    if (dados.ContainsKey("GERAR_SALDO"))
                    {
                        if (dados["GERAR_SALDO"].ToString() == "S")
                        {
                            //GeraSaldo(novo.NUMERO_FINANCEIRO);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string AtualizaFinanceiro(Dictionary<string, object> dados)
        {
            try
            {
                string retorno = "";

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_FINANCEIROs
                                 where item.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"])
                                 select item).ToList();

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o lan&ccedil;mento com o ID ["
                            + dados["NUMERO_FINANCEIRO"].ToString() + "]");

                    DateTime _vencimento = Convert.ToDateTime(dados["DATA_VENCIMENTO"]);
                    _vencimento = _vencimento.AddDays(1);
                    _vencimento = _vencimento.AddSeconds(-1);

                    DateTime _pagamento = dados["DATA_PAGAMENTO"].ToString().Trim() == "" ? new DateTime(1901, 01, 01) :
                        Convert.ToDateTime(dados["DATA_PAGAMENTO"]);

                    foreach (var novo in query)
                    {
                        novo.DATA_VENCIMENTO = _vencimento;

                        if (dados["GERAR_SALDO"].ToString() == "N")
                            novo.DATA_PAGAMENTO = _pagamento;

                        novo.VALOR = Convert.ToDecimal(dados["VALOR"]);
                        novo.VALOR_DESCONTO = Convert.ToDecimal(dados["VALOR_DESCONTO"]);
                        novo.VALOR_ACRESCIMO = Convert.ToDecimal(dados["VALOR_ACRESCIMO"]);

                        if (dados["GERAR_SALDO"].ToString() == "N")
                            novo.VALOR_TOTAL = Convert.ToDecimal(dados["VALOR_TOTAL"]);

                        novo.HISTORICO = dados["HISTORICO"].ToString();
                        novo.CREDITO_DEBITO = Convert.ToDecimal(dados["CREDITO_DEBITO"]);

                        novo.VALOR_MULTA = Convert.ToDecimal(dados["VALOR_MULTA"]);
                        novo.PERC_JUROS_DIA = Convert.ToDecimal(dados["PERC_JUROS_DIA"]);

                        novo.NUMERO_NF_SAIDA = Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]);
                        novo.NUMERO_NF_ENTRADA = Convert.ToDecimal(dados["NUMERO_NF_ENTRADA"]);

                        decimal CODIGO_CLIENTE_FORNECEDOR = 0;

                        if (decimal.TryParse(dados["CODIGO_CLIENTE_FORNECEDOR"].ToString(), out CODIGO_CLIENTE_FORNECEDOR))
                        {
                            CODIGO_CLIENTE_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CLIENTE_FORNECEDOR"]);
                        }
                        else
                        {
                            string str1 = dados["CODIGO_CLIENTE_FORNECEDOR"].ToString();

                            if (str1.IndexOf("<") > -1 && str1.IndexOf(">") > -1)
                            {
                                str1 = str1.Substring(str1.IndexOf(">") + 1,
                                    str1.LastIndexOf("<") - str1.IndexOf(">") - 1);

                                CODIGO_CLIENTE_FORNECEDOR = Convert.ToDecimal(str1);
                            }
                        }

                        if (novo.CREDITO_DEBITO == 0)
                        {
                            novo.CODIGO_CLIENTE = CODIGO_CLIENTE_FORNECEDOR;
                            novo.CODIGO_FORNECEDOR = 0;
                        }
                        else
                        {
                            novo.CODIGO_CLIENTE = 0;
                            novo.CODIGO_FORNECEDOR = CODIGO_CLIENTE_FORNECEDOR;
                        }

                        if (novo.CODIGO_CLIENTE > 0 && Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) > 0)
                        {
                            var CONSISTENCIA_CLIENTE = (from linha in ctx.TB_NOTA_SAIDAs
                                                        where linha.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"])
                                                        && linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE_FORNECEDOR
                                                        select linha).Any();

                            if (!CONSISTENCIA_CLIENTE)
                                throw new Exception("O cliente da nota fiscal &eacute; diferente do cliente inserido nesse t&iacute;tulo");
                        }

                        if (novo.CODIGO_CLIENTE == 0 && Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) > 0)
                        {
                            var _CODIGO_CLIENTE_NF = (from linha in ctx.TB_NOTA_SAIDAs
                                                      where linha.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"])
                                                      select linha.CODIGO_CLIENTE_NF).ToList();

                            if (_CODIGO_CLIENTE_NF.Any())
                                novo.CODIGO_CLIENTE = _CODIGO_CLIENTE_NF.First();
                        }

                        novo.ID_PLANO = dados["ID_PLANO_FINANCEIRO"].ToString();
                        novo.VALOR_APROXIMADO = Convert.ToDecimal(dados["VALOR_APROXIMADO"]);

                        novo.MARCA_REMESSA = Convert.ToDecimal(dados["MARCA_REMESSA"]);

                        decimal NUMERO_BANCO = decimal.TryParse(dados["NUMERO_BANCO"].ToString(), out NUMERO_BANCO) ?
                            Convert.ToDecimal(dados["NUMERO_BANCO"]) : 0;

                        novo.NUMERO_BANCO = NUMERO_BANCO;

                        if (dados["GERAR_SALDO"].ToString() == "S")
                            GeraPagtoParcial(Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]), ctx, Convert.ToDecimal(dados["VALOR_TOTAL"]),
                                Convert.ToDecimal(dados["ID_USUARIO"]));

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(novo),
                            ctx.TB_FINANCEIROs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.SubmitChanges();

                        _vencimento = (DateTime)novo.DATA_VENCIMENTO;

                        while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
                            _vencimento = _vencimento.AddDays(1);

                        if (novo.DATA_PAGAMENTO == new DateTime(1901, 01, 01))
                            retorno = _vencimento < DateTime.Now ?
                                "<span style='background-Color: red; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Vencido</span>" :
                                "<span style='background-Color: #993399; color: #ffffff; font-size: 10pt;'>T&iacute;tulo a Vencer</span>";
                        else
                            retorno = "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>";
                    }

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaFinanceiro(decimal NUMERO_FINANCEIRO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var CNAB = (from linha in ctx.TB_HISTORICO_CNABs
                                orderby linha.NUMERO_FINANCEIRO
                                where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                                select linha).Any();

                    if (CNAB)
                        throw new Exception("N&atilde;o &eacute; poss&iacute;vel deletar, existe hist&oacute;rico de registro banc&aacute;rio com este t&iacute;tulo");

                    var query = (from item in ctx.TB_FINANCEIROs
                                 where item.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_FINANCEIROs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Desmarca_Remessa(List<decimal> NUMERO_FINANCEIRO, decimal ID_USUARIO)
        {
            try
            {
                for (int i = 0; i < NUMERO_FINANCEIRO.Count; i++)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query = from linha in ctx.TB_FINANCEIROs
                                    where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO[i]
                                    select linha;

                        foreach (var item in query)
                        {
                            if (item.CREDITO_DEBITO == 1)
                                throw new Exception("Este t&iacute;tulo é um d&eacute;bito. N&atilde;o &eacute; poss&iacute;vel marcar para Remessa");

                            DateTime vencimento = (DateTime)item.DATA_VENCIMENTO;
                            DateTime lancamento = (DateTime)item.DATA_LANCAMENTO;

                            vencimento = vencimento.AddSeconds(-vencimento.Second);
                            vencimento = vencimento.AddMinutes(-vencimento.Minute);
                            vencimento = vencimento.AddHours(-vencimento.Hour);

                            lancamento = lancamento.AddSeconds(-lancamento.Second);
                            lancamento = lancamento.AddMinutes(-lancamento.Minute);
                            lancamento = lancamento.AddHours(-lancamento.Hour);

                            lancamento = lancamento.AddDays(1);

                            if (vencimento <= lancamento)
                                throw new Exception("Este T&iacute;tulo &eacute; a vista. N&atilde;o pode ser marcado para remessa");

                            item.MARCA_REMESSA = item.MARCA_REMESSA == 0 ? 1 : 0;
                            item.REMESSA = 0;
                            item.RETORNO = 0;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(item),
                                ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);

                            ctx.SubmitChanges();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Cliente_Limite_Credito(Dictionary<string, object> dados)
        {
            try
            {
                Doran_Limite_Credito_Cliente credito = new Doran_Limite_Credito_Cliente(Convert.ToDecimal(dados["ID_EMPRESA"]));
                return credito.ListaClientesComLimiteExcedido(dados);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Faturamento_Inadimplencia(string data1, string data2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(data1);
                DateTime dt2 = Convert.ToDateTime(data2);

                Doran_Faturamento fa = new Doran_Faturamento(ID_EMPRESA);

                return fa.Faturamento_Inadimplencia(dt1, dt2, ID_EMPRESA);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Financeiro_Realizado(string data1, string data2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(data1);
                DateTime dt2 = Convert.ToDateTime(data2);

                Doran_Faturamento fa = new Doran_Faturamento(ID_EMPRESA);

                return fa.Financeiro_Realizado(dt1, dt2);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Financeiro_Titulos_Emissao(string data1, string data2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {


            try
            {
                DateTime dt1 = Convert.ToDateTime(data1);
                DateTime dt2 = Convert.ToDateTime(data2);

                using (Doran_FinanceiroEmissao fa = new Doran_FinanceiroEmissao(dt1, dt2, ID_EMPRESA))
                {
                    return fa.MontaRelatorioEmissao();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string GraficoFaturadoRecebido(decimal CODIGO_CLIENTE, string DataInicial, string DataFinal, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                Doran_Faturamento fa = new Doran_Faturamento(ID_EMPRESA);

                DateTime dt1 = Convert.ToDateTime(DataInicial);
                DateTime dt2 = Convert.ToDateTime(DataFinal);

                dt2 = dt2.AddDays(1);

                List<DateTime> _data1 = new List<DateTime>();
                List<DateTime> _data2 = new List<DateTime>();

                int meses = dt2.Month - dt1.Month;

                if (meses < 0)
                    meses = 12 - (meses * (-1));

                for (int i = 0; i < meses; i++)
                {
                    _data1.Add(dt1);

                    dt1 = dt1.AddMonths(1);

                    _data2.Add(dt1);
                }

                return fa.GraficoFaturadoRecebido(CODIGO_CLIENTE, _data1, _data2);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<Dictionary<string, object>> BaixaFinanceiro(List<decimal> NUMERO_FINANCEIRO, decimal ID_USUARIO)
        {
            try
            {
                List<Dictionary<string, object>> retorno =
                    new List<Dictionary<string, object>>();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    for (var i = 0; i < NUMERO_FINANCEIRO.Count; i++)
                    {
                        Dictionary<string, object> titulo = new Dictionary<string, object>();

                        var query = from item in ctx.TB_FINANCEIROs
                                    where item.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO[i]
                                    select item;

                        if (query.Count() == 0)
                            throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o lan&ccedil;mento com o ID ["
                                + NUMERO_FINANCEIRO[i].ToString() + "]");

                        foreach (var novo in query)
                        {
                            novo.DATA_PAGAMENTO = DateTime.Now;

                            TimeSpan ts = new TimeSpan(DateTime.Now.Ticks - Convert.ToDateTime(novo.DATA_VENCIMENTO).Ticks);

                            double dias = ts.TotalDays > 0 ? ts.TotalDays : 0;

                            decimal pp = SomaPagoParcial(NUMERO_FINANCEIRO[i], ID_USUARIO);

                            decimal? _valor_total = (novo.VALOR_TOTAL - novo.VALOR_DESCONTO
                            + novo.VALOR_ACRESCIMO + novo.VALOR_MULTA) - pp;

                            for (int n = 0; n < dias; n++)
                                _valor_total += _valor_total * (novo.PERC_JUROS_DIA / 100);

                            novo.VALOR_TOTAL = _valor_total;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(novo),
                                ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);

                            string vt = Math.Round((decimal)_valor_total, 2).ToString();

                            titulo.Add("VALOR_PAGO", vt.ToString().Replace(",", "."));
                        }

                        titulo.Add("DATA_PAGTO", string.Format("{0}/{1}/{2}", DateTime.Now.Day.ToString().PadLeft(2, '0'),
                                        DateTime.Now.Month.ToString().PadLeft(2, '0'),
                                        DateTime.Now.Year.ToString().PadLeft(4, '0')));

                        retorno.Add(titulo);
                    }

                    ctx.SubmitChanges();

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaCampos(decimal NUMERO_FINANCEIRO, string CAMPO, object VALOR, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_FINANCEIROs
                                where item.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                                select item;

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o lan&ccedil;mento com o ID ["
                            + NUMERO_FINANCEIRO.ToString() + "]");

                    foreach (var novo in query)
                    {
                        if (CAMPO == "DATA_VENCIMENTO")
                            novo.DATA_VENCIMENTO = Convert.ToDateTime(VALOR);

                        if (CAMPO == "DATA_PAGAMENTO")
                        {
                            if (VALOR.ToString() == "")
                                novo.DATA_PAGAMENTO = new DateTime(1901, 01, 01);
                            else
                                novo.DATA_PAGAMENTO = Convert.ToDateTime(VALOR);
                        }

                        if (CAMPO == "VALOR")
                        {
                            novo.VALOR = Convert.ToDecimal(VALOR);

                            decimal? _valor_total = (novo.VALOR_TOTAL - novo.VALOR_DESCONTO)
                                + (novo.VALOR_ACRESCIMO + novo.VALOR_MULTA);

                            novo.VALOR_TOTAL = _valor_total;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(novo),
                            ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private decimal SomaPagoParcial(decimal NUMERO_FINANCEIRO, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PAGTO_PARCIALs
                            where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIRO
                            select linha;

                var soma = query.Sum(v => v.VALOR_PAGTO);

                return soma.HasValue ? (decimal)soma : 0;
            }
        }

        [WebMethod()]
        public string ListaFornecedores_Clientes_GridPesquisa(Dictionary<string, object> dados)
        {
            try
            {
                string retorno = "";

                if (dados["credito_debito"].ToString() == "0")
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query1 = from cliente in ctx.TB_CLIENTEs
                                     where cliente.NOME_CLIENTE.Contains(dados["pesquisa"].ToString()) ||
                                     cliente.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString())

                                     select new
                                     {
                                         CODIGO = cliente.ID_CLIENTE,
                                         NOME = cliente.NOME_CLIENTE,
                                         NOME_FANTASIA = cliente.NOMEFANTASIA_CLIENTE
                                     };

                        var rowCount = query1.Count();

                        query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
                    }
                }
                else
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query1 = from cliente in ctx.TB_FORNECEDORs
                                     where cliente.NOME_FORNECEDOR.Contains(dados["pesquisa"].ToString()) ||
                                     cliente.NOME_FANTASIA_FORNECEDOR.Contains(dados["pesquisa"].ToString())

                                     select new
                                     {
                                         CODIGO = cliente.CODIGO_FORNECEDOR,
                                         NOME = cliente.NOME_FORNECEDOR,
                                         NOME_FANTASIA = cliente.NOME_FANTASIA_FORNECEDOR
                                     };

                        var rowCount = query1.Count();

                        query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
                    }
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string BuscaDadosClienteFornecedor(decimal CODIGO, decimal CREDITO_DEBITO, decimal ID_USUARIO)
        {
            try
            {
                string retorno = "";

                if (CREDITO_DEBITO.ToString() == "0")
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query1 = from cliente in ctx.TB_CLIENTEs
                                     where cliente.ID_CLIENTE == CODIGO

                                     select new
                                     {
                                         NOME = cliente.NOME_CLIENTE,
                                         NOME_FANTASIA = cliente.NOMEFANTASIA_CLIENTE
                                     };

                        foreach (var item in query1)
                            retorno = item.NOME.Trim() + "<br />" + item.NOME_FANTASIA.Trim();
                    }
                }
                else
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query1 = from cliente in ctx.TB_FORNECEDORs
                                     where cliente.CODIGO_FORNECEDOR == CODIGO

                                     select new
                                     {
                                         NOME = cliente.NOME_FORNECEDOR,
                                         NOME_FANTASIA = cliente.NOME_FANTASIA_FORNECEDOR
                                     };

                        foreach (var item in query1)
                            retorno = item.NOME.Trim() + "<br />" + item.NOME_FANTASIA.Trim();
                    }
                }

                return retorno;

            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, string> Creditos_do_Cliente(decimal CODIGO_CLIENTE, string DataInicial, string DataFinal,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {


                DateTime dt1 = Convert.ToDateTime(DataInicial);
                DateTime dt2 = Convert.ToDateTime(DataFinal);

                dt2 = dt2.AddDays(1);

                Dictionary<string, string> retorno = new Dictionary<string, string>();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var faturamento = (from linha in ctx.TB_NOTA_SAIDAs
                                       where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                       && (linha.DATA_EMISSAO_NF >= dt1
                                       && linha.DATA_EMISSAO_NF < dt2)
                                       && linha.STATUS_NF == 2

                                       select linha).Sum(fat => fat.TOTAL_NF);

                    if (faturamento.HasValue)
                        retorno.Add("Faturamento", ((decimal)faturamento).ToString("c", CultureInfo.CurrentCulture));
                    else
                        retorno.Add("Faturamento", 0.ToString("c", CultureInfo.CurrentCulture));

                    DateTime amanha = DateTime.Today;
                    amanha = amanha.AddDays(1);

                    var aReceber = (from linha in ctx.TB_FINANCEIROs
                                    where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                    && linha.DATA_VENCIMENTO >= amanha
                                    && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                    && linha.CREDITO_DEBITO == 0

                                    select linha).Sum(ar => ar.VALOR_TOTAL);

                    if (aReceber.HasValue)
                        retorno.Add("aReceber", ((decimal)aReceber).ToString("c", CultureInfo.CurrentCulture));
                    else
                        retorno.Add("aReceber", 0.ToString("c", CultureInfo.CurrentCulture));


                    var Recebido = (from linha in ctx.TB_FINANCEIROs
                                    where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                    && (linha.DATA_PAGAMENTO >= dt1
                                    && linha.DATA_PAGAMENTO < dt2)
                                    && linha.CREDITO_DEBITO == 0

                                    select linha).Sum(pa => pa.VALOR_TOTAL);

                    if (Recebido.HasValue)
                        retorno.Add("Recebido", ((decimal)Recebido).ToString("c", CultureInfo.CurrentCulture));
                    else
                        retorno.Add("Recebido", 0.ToString("c", CultureInfo.CurrentCulture));

                    decimal Inadimplente = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, CODIGO_CLIENTE, ID_EMPRESA);

                    if (Inadimplente > (decimal)0.00)
                        retorno.Add("Inadimplente", "<span style='color: red;'>" + Inadimplente.ToString("c", CultureInfo.CurrentCulture) + "</span>");
                    else
                        retorno.Add("Inadimplente", "<span>" + Inadimplente.ToString("c", CultureInfo.CurrentCulture) + "</span>");

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

                    if (EmAberto > (decimal)0.00)
                        retorno.Add("Excedido", "<span style='color: red;'>" + ((decimal)EmAberto).ToString("c", CultureInfo.CurrentCulture) + "</span>");
                    else
                        retorno.Add("Excedido", ((decimal)EmAberto).ToString("c", CultureInfo.CurrentCulture));

                    var Abatimentos = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                                       orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                                       where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                       && linha.SALDO_RESTANTE > (decimal)0.00

                                       select linha).Sum(a => a.SALDO_RESTANTE);

                    if (Abatimentos.HasValue)
                        retorno.Add("Abatimentos", "<span style='color: navy;'>" + ((decimal)Abatimentos).ToString("c", CultureInfo.CurrentCulture) + "</span>");
                    else
                        retorno.Add("Abatimentos", ((decimal)0.00).ToString("c", CultureInfo.CurrentCulture));

                    // Data e Valor da Ultima Compra

                    var ultimaCompra = (from linha in ctx.TB_NOTA_SAIDAs
                                        orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF descending
                                        where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                        && linha.STATUS_NF == 4
                                        select new { linha.DATA_EMISSAO_NF, linha.TOTAL_SERVICOS_NF }).Take(1).ToList();

                    if (ultimaCompra.Any())
                    {
                        foreach (var item in ultimaCompra)
                        {
                            retorno.Add("data_ultima_compra", ApoioXML.TrataData2(item.DATA_EMISSAO_NF));
                            retorno.Add("valor_ultima_compra", ((decimal)item.TOTAL_SERVICOS_NF).ToString("c"));
                        }
                    }
                    else
                    {
                        retorno.Add("data_ultima_compra", "");
                        retorno.Add("valor_ultima_compra", ((decimal)0.00).ToString("c"));
                    }

                    // Maior compra

                    var maiorCompra = (from linha in ctx.TB_NOTA_SAIDAs
                                       orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF
                                       where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                       && linha.STATUS_NF == 4
                                       select linha).Max(m => m.TOTAL_SERVICOS_NF);

                    retorno.Add("maior_compra", maiorCompra.HasValue ? ((decimal)maiorCompra).ToString("c") : ((decimal)0.00).ToString("c"));

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }

        }

        [WebMethod()]
        public List<string> GraficoCreditoCliente(decimal CODIGO_CLIENTE, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                Doran_Faturamento fa = new Doran_Faturamento(ID_EMPRESA);

                return fa.GraficoCreditoCliente(CODIGO_CLIENTE);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void CadastraContasFuturas(Dictionary<string, object> dados)
        {


            int mes = Convert.ToInt32(dados["MES"]);
            int ano = Convert.ToInt32(dados["ANO"]);

            DateTime _vencimento = Convert.ToDateTime(dados["DATA_VENCIMENTO"]);

            int dia = _vencimento.Day;

            DateTime _vencimento_final = Convert.ToDateTime(dia.ToString() + "/" + mes.ToString() + "/" + ano.ToString());

            while (_vencimento <= _vencimento_final)
            {
                dados["DATA_VENCIMENTO"] = _vencimento;

                GravaNovoFinanceiro(dados);

                _vencimento = _vencimento.AddMonths(1);
            }
        }

        [WebMethod()]
        public void GravaInstrucao(decimal NUMERO_BANCO, decimal COD_INSTRUCAO, List<decimal> NUMEROS, decimal ID_USUARIO)
        {


            try
            {
                if (NUMEROS.Count == 0) // Gravar Todos
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        var query = from linha in ctx.TB_FINANCEIROs
                                    where linha.MARCA_REMESSA == 1
                                    && linha.CREDITO_DEBITO == 0
                                    orderby linha.MARCA_REMESSA
                                    select linha;

                        foreach (var item in query)
                        {
                            item.NUMERO_BANCO = NUMERO_BANCO;
                            item.INSTRUCAO_REMESSA = COD_INSTRUCAO;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(item),
                                ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();
                    }
                }
                else
                {
                    for (int i = 0; i < NUMEROS.Count; i++)
                    {
                        using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                        {
                            var query = from linha in ctx.TB_FINANCEIROs
                                        where linha.NUMERO_FINANCEIRO == NUMEROS[i]
                                        select linha;

                            foreach (var item in query)
                            {
                                item.NUMERO_BANCO = NUMERO_BANCO;
                                item.INSTRUCAO_REMESSA = COD_INSTRUCAO;

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(item),
                                    ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);

                                ctx.SubmitChanges();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string TotaisPorInstrucao(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.MARCA_REMESSA == 1
                                && linha.CREDITO_DEBITO == 0
                                group linha by linha.TB_OCORRENCIA_BANCARIA_REMESSA.DESCRICAO_OCORRENCIA into instrucao
                                orderby instrucao.Key
                                select new
                                {
                                    INSTRUCAO_REMESSA = instrucao.Key,
                                    TOTAL = instrucao.Sum(t => t.VALOR)
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public decimal BuscaTotalRemessa(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                where linha.MARCA_REMESSA == 1
                                && linha.CREDITO_DEBITO == 0
                                select linha;

                    decimal? total = query.Sum(s => s.VALOR_TOTAL);

                    if (!total.HasValue)
                        total = 0;

                    return (decimal)total;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string TotaisPorOcorrenciaRemessa(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_HISTORICO_CNABs
                                where linha.REMESSA_RETORNO == 0
                                && linha.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"])
                                && linha.NUMERO_AGENCIA == dados["NUMERO_AGENCIA"].ToString()
                                && linha.NUMERO_CONTA == dados["NUMERO_CONTA"].ToString()
                                select new
                                {
                                    linha.DATA_HISTORICO,
                                    linha.NUMERO_HISTORICO,
                                    linha.NUMERO_FINANCEIRO,
                                    linha.NUMERO_BANCO,
                                    linha.TB_CONTA_CORRENTE.TB_BANCO.NOME_BANCO,
                                    linha.NUMERO_AGENCIA,
                                    linha.NUMERO_CONTA,
                                    linha.INSTRUCAO,
                                    linha.REMESSA_RETORNO,
                                    linha.TIPO_COBRANCA,
                                    linha.TB_FINANCEIRO.NUMERO_NF_SAIDA,
                                    linha.TB_FINANCEIRO.HISTORICO,
                                    linha.TB_FINANCEIRO.VALOR,
                                    linha.TB_FINANCEIRO.VALOR_TOTAL,
                                    linha.TB_FINANCEIRO.DATA_VENCIMENTO,
                                    linha.TB_TIPO_COBRANCA.DESCRICAO_TIPO_COBRANCA,
                                    linha.TB_USUARIO.LOGIN_USUARIO
                                };

                    if (Convert.ToDecimal(dados["REMESSA_RETORNO"]) > -1)
                        query = query.Where(q => q.REMESSA_RETORNO == Convert.ToDecimal(dados["REMESSA_RETORNO"]));

                    if (Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]) > 0)
                        query = query.Where(q => q.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]));

                    if (Convert.ToDecimal(dados["OCORRENCIA_REMESSA"]) > 0)
                        query = query.Where(q => q.INSTRUCAO == Convert.ToDecimal(dados["OCORRENCIA_REMESSA"])
                            && q.REMESSA_RETORNO == 0);

                    if (Convert.ToDecimal(dados["OCORRENCIA_RETORNO"]) > 0)
                        query = query.Where(q => q.INSTRUCAO == Convert.ToDecimal(dados["OCORRENCIA_RETORNO"])
                            && q.REMESSA_RETORNO == 1);

                    if (Convert.ToDecimal(dados["TIPO_COBRANCA"]) > 0)
                        query = query.Where(q => q.TIPO_COBRANCA == Convert.ToDecimal(dados["TIPO_COBRANCA"]));

                    if (Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) > 0)
                        query = query.Where(q => q.NUMERO_NF_SAIDA == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]));

                    if (dados["CLIENTE"].ToString().Length > 0)
                        query = query.Where(q => q.HISTORICO.Contains(dados["CLIENTE"].ToString()));

                    if (Convert.ToDecimal(dados["VALOR"]) > 0)
                        query = query.Where(q => q.VALOR == Convert.ToDecimal(dados["VALOR"]));

                    if (dados["DATA1"].ToString().Length > 0)
                    {
                        DateTime dt1 = Convert.ToDateTime(dados["DATA1"]);
                        DateTime dt2 = Convert.ToDateTime(dados["DATA2"]);

                        dt2 = dt2.AddDays(1);

                        query = query.Where(v => v.DATA_HISTORICO >= dt1 && v.DATA_HISTORICO < dt2);
                    }

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    var query1 = query.GroupBy(ra => ra.INSTRUCAO)
                      .Select(emp => new
                      {
                          CODIGO = emp.Key,
                          TOTAL = emp.Sum(t => t.VALOR_TOTAL)
                      });

                    DataTable dt = ApoioXML.ToDataTable(ctx, query1);
                    dt.Columns.Add("OCORRENCIA");

                    foreach (DataRow dr in dt.Rows)
                    {
                        var query2 = from linha in ctx.TB_OCORRENCIA_BANCARIA_REMESSAs
                                     where linha.COD_OCORRENCIA == Convert.ToDecimal(dr["CODIGO"])
                                     select new
                                     {
                                         linha.DESCRICAO_OCORRENCIA
                                     };

                        foreach (var item in query2)
                            dr["OCORRENCIA"] = item.DESCRICAO_OCORRENCIA.Trim();
                    }

                    dt.Columns.Remove("CODIGO");

                    var rowCount = dt.Rows.Count;

                    dt.AcceptChanges();

                    DataSet ds = new DataSet("Query");
                    ds.Tables.Add(dt);

                    DataTable totalCount = new DataTable("Totais");

                    totalCount.Columns.Add("totalCount");

                    DataRow nova = totalCount.NewRow();
                    nova[0] = rowCount;
                    totalCount.Rows.Add(nova);

                    ds.Tables.Add(totalCount);

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string TotaisPorOcorrenciaRetorno(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_HISTORICO_CNABs
                                where linha.REMESSA_RETORNO == 1
                                && linha.NUMERO_BANCO == Convert.ToDecimal(dados["NUMERO_BANCO"])
                                && linha.NUMERO_AGENCIA == dados["NUMERO_AGENCIA"].ToString()
                                && linha.NUMERO_CONTA == dados["NUMERO_CONTA"].ToString()
                                select new
                                {
                                    linha.DATA_HISTORICO,
                                    linha.NUMERO_HISTORICO,
                                    linha.NUMERO_FINANCEIRO,
                                    linha.NUMERO_BANCO,
                                    linha.TB_CONTA_CORRENTE.TB_BANCO.NOME_BANCO,
                                    linha.NUMERO_AGENCIA,
                                    linha.NUMERO_CONTA,
                                    linha.INSTRUCAO,
                                    linha.REMESSA_RETORNO,
                                    linha.TIPO_COBRANCA,
                                    linha.TB_FINANCEIRO.NUMERO_NF_SAIDA,
                                    linha.TB_FINANCEIRO.HISTORICO,
                                    linha.TB_FINANCEIRO.VALOR,
                                    linha.TB_FINANCEIRO.VALOR_TOTAL,
                                    linha.TB_FINANCEIRO.DATA_VENCIMENTO,
                                    linha.TB_TIPO_COBRANCA.DESCRICAO_TIPO_COBRANCA,
                                    linha.TB_USUARIO.LOGIN_USUARIO
                                };

                    if (Convert.ToDecimal(dados["REMESSA_RETORNO"]) > -1)
                        query = query.Where(q => q.REMESSA_RETORNO == Convert.ToDecimal(dados["REMESSA_RETORNO"]));

                    if (Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]) > 0)
                        query = query.Where(q => q.NUMERO_FINANCEIRO == Convert.ToDecimal(dados["NUMERO_FINANCEIRO"]));

                    if (Convert.ToDecimal(dados["OCORRENCIA_REMESSA"]) > 0)
                        query = query.Where(q => q.INSTRUCAO == Convert.ToDecimal(dados["OCORRENCIA_REMESSA"])
                            && q.REMESSA_RETORNO == 0);

                    if (Convert.ToDecimal(dados["OCORRENCIA_RETORNO"]) > 0)
                        query = query.Where(q => q.INSTRUCAO == Convert.ToDecimal(dados["OCORRENCIA_RETORNO"])
                            && q.REMESSA_RETORNO == 1);

                    if (Convert.ToDecimal(dados["TIPO_COBRANCA"]) > 0)
                        query = query.Where(q => q.TIPO_COBRANCA == Convert.ToDecimal(dados["TIPO_COBRANCA"]));

                    if (Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]) > 0)
                        query = query.Where(q => q.NUMERO_NF_SAIDA == Convert.ToDecimal(dados["NUMERO_NF_SAIDA"]));

                    if (dados["CLIENTE"].ToString().Length > 0)
                        query = query.Where(q => q.HISTORICO.Contains(dados["CLIENTE"].ToString()));

                    if (Convert.ToDecimal(dados["VALOR"]) > 0)
                        query = query.Where(q => q.VALOR == Convert.ToDecimal(dados["VALOR"]));

                    if (dados["DATA1"].ToString().Length > 0)
                    {
                        DateTime dt1 = Convert.ToDateTime(dados["DATA1"]);
                        DateTime dt2 = Convert.ToDateTime(dados["DATA2"]);

                        dt2 = dt2.AddDays(1);

                        query = query.Where(v => v.DATA_HISTORICO >= dt1 && v.DATA_HISTORICO < dt2);
                    }

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    var query1 = query.GroupBy(ra => ra.INSTRUCAO)
                      .Select(emp => new
                      {
                          CODIGO = emp.Key,
                          TOTAL = emp.Sum(t => t.VALOR_TOTAL)
                      });

                    DataTable dt = ApoioXML.ToDataTable(ctx, query1);
                    dt.Columns.Add("OCORRENCIA");

                    foreach (DataRow dr in dt.Rows)
                    {
                        var query2 = (from linha in ctx.TB_OCORRENCIA_BANCARIA_RETORNOs
                                      where linha.COD_OCORRENCIA == Convert.ToDecimal(dr["CODIGO"])
                                      select new
                                      {
                                          linha.DESCRICAO_OCORRENCIA
                                      }).ToList();

                        foreach (var item in query2)
                            dr["OCORRENCIA"] = item.DESCRICAO_OCORRENCIA.Trim();
                    }

                    dt.Columns.Remove("CODIGO");

                    var rowCount = dt.Rows.Count;

                    dt.AcceptChanges();

                    DataSet ds = new DataSet("Query");
                    ds.Tables.Add(dt);

                    DataTable totalCount = new DataTable("Totais");

                    totalCount.Columns.Add("totalCount");

                    DataRow nova = totalCount.NewRow();
                    nova[0] = rowCount;
                    totalCount.Rows.Add(nova);

                    ds.Tables.Add(totalCount);

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string GeraRemessa(decimal NUMERO_BANCO, string NUMERO_AGENCIA, string NUMERO_CONTA, decimal TIPO_COBRANCA,
            string NOME_EMITENTE, string CNPJ_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                string caminho = "";

                if (NUMERO_BANCO == 237)
                {
                    using (FaTh2_Remessa_Bradesco remessa = new FaTh2_Remessa_Bradesco(NUMERO_BANCO, NUMERO_AGENCIA, NUMERO_CONTA, TIPO_COBRANCA))
                    {
                        remessa.ID_USUARIO = ID_USUARIO;
                        remessa.NOME_EMITENTE = NOME_EMITENTE;

                        remessa.CODIGO_EMPRESA = "00000000000000183088";

                        remessa.DESCONTO_BONIFICACAO_POR_DIA = ApoioXML.TrataSinais("0.00");
                        remessa.EMISSAO_PROCESSAMENTO_REGISTROS = QUEM_EMITE_OS_REGISTROS.O_BANCO_EMITE_E_PROCESSA_O_REGISTRO;
                        remessa.INSTRUCOES = "PROTESTAR APOS O VENCTO. APOS VENCTO. CONSULTAR AG. CEDENTE.";

                        remessa.Gera_Remessa();

                        caminho = remessa.Caminho_Virtual();
                    }
                }

                if (NUMERO_BANCO == 1)
                {
                    using (FaTh2_Remessa_Brasil remessa = new FaTh2_Remessa_Brasil(NUMERO_BANCO, NUMERO_AGENCIA, NUMERO_CONTA, TIPO_COBRANCA,
                        CNPJ_EMITENTE))
                    {
                        remessa.ID_USUARIO = ID_USUARIO;
                        remessa.NOME_EMITENTE = NOME_EMITENTE;

                        if (remessa.TIPO_DE_COBRANCA == 7)
                            remessa.CODIGO_EMPRESA = "00000000000000271949";
                        else
                            remessa.CODIGO_EMPRESA = "00000000000004000134";

                        remessa.DESCONTO_BONIFICACAO_POR_DIA = ApoioXML.TrataSinais("0.00");
                        remessa.EMISSAO_PROCESSAMENTO_REGISTROS = QUEM_EMITE_OS_REGISTROS.O_BANCO_EMITE_E_PROCESSA_O_REGISTRO;
                        remessa.INSTRUCOES = "MULTA DE 2% APOS O VENCIMENTO           ";

                        remessa.Gera_Remessa();

                        caminho = remessa.Caminho_Virtual();
                    }
                }

                return caminho;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Decisoes_Cobranca(int INTERVALO_DIAS, string NOME_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Base.Cobranca.Th2_Decisao_Cobranca dc = new Doran_Base.Cobranca.Th2_Decisao_Cobranca())
                {
                    return dc.Lista_Totais_Cobranca(INTERVALO_DIAS, NOME_EMITENTE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Titulos_por_Intervalo(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Base.Cobranca.Th2_Decisao_Cobranca dc = new Doran_Base.Cobranca.Th2_Decisao_Cobranca())
                {
                    return dc.Lista_Titulos_por_Intervalo(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string MontaRelatorioRemessa(decimal NUMERO_BANCO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Relatorio_Remessa remessa = new Doran_Relatorio_Remessa(ID_EMPRESA))
                {
                    DateTime dt1 = DateTime.Today;
                    DateTime dt2 = DateTime.Today.AddDays(1);

                    remessa.DATA_INICIAL = dt1;
                    remessa.DATA_FINAL = dt2;
                    remessa.NUMERO_BANCO = NUMERO_BANCO;

                    return remessa.MontaRelatorioRemessa();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string RelatorioRemessa(decimal NUMERO_BANCO, string DATA1, string DATA2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Relatorio_Remessa remessa = new Doran_Relatorio_Remessa(ID_EMPRESA))
                {
                    DateTime dt1 = Convert.ToDateTime(DATA1);
                    DateTime dt2 = Convert.ToDateTime(DATA2);

                    remessa.DATA_INICIAL = dt1;
                    remessa.DATA_FINAL = dt2;
                    remessa.NUMERO_BANCO = NUMERO_BANCO;

                    return remessa.MontaRelatorioRemessa();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string RelatorioRetorno(decimal NUMERO_BANCO, string DATA1, string DATA2, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Relatorio_Retorno remessa = new Doran_Relatorio_Retorno(ID_EMPRESA))
                {
                    DateTime dt1 = Convert.ToDateTime(DATA1);
                    DateTime dt2 = Convert.ToDateTime(DATA2);

                    remessa.DATA_INICIAL = dt1;
                    remessa.DATA_FINAL = dt2;
                    remessa.NUMERO_BANCO = NUMERO_BANCO;

                    return remessa.MontaRelatorioRetorno();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string ImprimeDuplicataAvulsa(List<decimal> NUMEROS_FINANCEIRO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Duplicata_Saida dup = new Doran_Duplicata_Saida())
                {
                    dup.NUMERO_FINANCEIROS = NUMEROS_FINANCEIRO;

                    return dup.ImprimeDuplicataAvulsa();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Titulos_Receber_Vencidos(string CLIENTE, decimal VENDEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_TitulosVencidos ve = new Doran_TitulosVencidos(CLIENTE, ID_EMPRESA))
                {
                    ve.VENDEDOR = VENDEDOR;
                    return ve.MontaRelatorioAReceber();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Titulos_Pagar_Vencidos(string FORNECEDOR, decimal VENDEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_TitulosVencidos ve = new Doran_TitulosVencidos(FORNECEDOR, ID_EMPRESA))
                {
                    ve.VENDEDOR = VENDEDOR;
                    return ve.MontaRelatorioAPagar();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string FluxoRealizado(string dt1, string dt2, string ResumidoDetalhado, decimal Banco, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime _dt1 = Convert.ToDateTime(dt1);
                DateTime _dt2 = Convert.ToDateTime(dt2);

                using (Doran_FinanceiroRealizado rz = new Doran_FinanceiroRealizado(_dt1, _dt2, ResumidoDetalhado, ID_EMPRESA))
                {
                    rz.Banco = Banco;
                    return rz.MontaRelatorioRealizado();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string FluxoPrevisao(string dt1, string dt2, string CLIENTE, string ResumidoDetalhado, decimal Banco, string RECEBER_PAGAR,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime _dt1 = Convert.ToDateTime(dt1);
                DateTime _dt2 = Convert.ToDateTime(dt2);

                using (Doran_FinanceiroPrevisao rz = new Doran_FinanceiroPrevisao(_dt1, _dt2, ResumidoDetalhado, ID_EMPRESA))
                {
                    rz.CLIENTE = CLIENTE;
                    rz.Banco = Banco;
                    return rz.MontaRelatorioPrevisao(RECEBER_PAGAR);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private void GeraPagtoParcial(decimal NUMERO, DataContext ctx, decimal VALOR, decimal ID_USUARIO)
        {
            System.Data.Linq.Table<Doran_Servicos_ORM.TB_PAGTO_PARCIAL> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PAGTO_PARCIAL>();

            Doran_Servicos_ORM.TB_PAGTO_PARCIAL novo = new Doran_Servicos_ORM.TB_PAGTO_PARCIAL();

            novo.NUMERO_FINANCEIRO = NUMERO;
            novo.DATA_PAGTO = DateTime.Now;
            novo.VALOR_PAGTO = VALOR;

            Entidade.InsertOnSubmit(novo);

            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
        }

        [WebMethod()]
        public void geraBoleto_Itau(List<decimal> NUMEROS_FINANCEIRO, decimal ID_EMPRESA, decimal ID_CONTA_EMAIL, 
            decimal NUMERO_BANCO, string AGENCIA, string CONTA_CORRENTE, string CARTEIRA, string DATA1, string DATA2,
            decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(DATA1);
                DateTime dt2 = Convert.ToDateTime(DATA2);


                using (Doran_Boleto_Itau boleto = new Doran_Boleto_Itau(NUMEROS_FINANCEIRO, ID_EMPRESA, ID_USUARIO, ID_CONTA_EMAIL,
                    NUMERO_BANCO, AGENCIA, CONTA_CORRENTE, CARTEIRA))
                {
                    boleto.Gera_Boleto_PDF(dt1, dt2);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_desmarca_titulos_para_uniao(List<decimal> NUMEROS_FINANCEIRO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FINANCEIROs
                                where NUMEROS_FINANCEIRO.Contains(linha.NUMERO_FINANCEIRO)
                                select linha;

                    foreach (var item in query)
                    {
                        item.TITULO_MARCADO_UNIAO = item.TITULO_MARCADO_UNIAO != 1 ? 1 : 0;
                        item.ID_USUARIO_MARCA_UNIAO = item.TITULO_MARCADO_UNIAO != 1 ? 0 : ID_USUARIO;
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Reune_Titulos_do_Cliente(string DATA_VENCIMENTO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1 = Convert.ToDateTime(DATA_VENCIMENTO);

                using (Doran_Reune_Titulos_do_Cliente r = new classes.Doran_Reune_Titulos_do_Cliente(ID_USUARIO, ID_EMPRESA))
                {
                    r.Une_Titulos_Selecionados(dt1);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}