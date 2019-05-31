using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Xml;
using System.Globalization;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Emite_Nota_Saida : IDisposable
    {
        private decimal _NUMERO_SEQ;
        private string _SERIE_NF;
        private string _CLIENTE;
        private decimal _NUMERO_NF;
        private string _VENDEDOR;
        private string _OPERACAO;
        private decimal _NUMERO_LOTE;
        private bool _PERMITE_ESTOQUE_ZERADO_NEGATIVO;

        private decimal ID_USUARIO { get; set; }
        private decimal ID_EMPRESA { get; set; }

        public Doran_Emite_Nota_Saida(decimal NUMERO_SEQ, string SERIE_NF, decimal _ID_USUARIO, decimal _ID_EMPRESA)
        {
            _NUMERO_SEQ = NUMERO_SEQ;
            _SERIE_NF = SERIE_NF;
            _NUMERO_LOTE = 0;
            _PERMITE_ESTOQUE_ZERADO_NEGATIVO = false;
            ID_EMPRESA = _ID_EMPRESA;
            ID_USUARIO = _ID_USUARIO;

            ParametrosDeEstoque();
        }

        public decimal Emite_Nota_Saida()
        {
            decimal _numero = 0;
             
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var query = from item in ctx.TB_NOTA_SAIDAs
                                where item.NUMERO_SEQ == _NUMERO_SEQ
                                select item;

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a Nota de Saída com o ID [" + _NUMERO_SEQ.ToString() + "]");

                    foreach (var nota in query)
                    {
                        if (nota.STATUS_NF > 1)
                            throw new Exception("Esta nota já foi emitida. Clique em atualizar p&aacute;gina");

                        _numero = BUSCA_ULTIMO_NUMERO_NOTA_SAIDA(ctx);

                        _NUMERO_NF = _numero;
                        _CLIENTE = nota.NOME_FANTASIA_CLIENTE_NF;
                        _VENDEDOR = nota.NOME_VENDEDOR_NF;

                        Gerar_Contas_a_Receber(ctx);

                        nota.DATA_EMISSAO_NF = DateTime.Now;
                        nota.EMITIDA_NF = 1;
                        nota.STATUS_NF = 2;
                        nota.NUMERO_NF = _NUMERO_NF;
                        nota.NUMERO_LOTE_NF = _NUMERO_LOTE;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_NOTA_SAIDA(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(nota),
                            ctx.TB_NOTA_SAIDAs.ToString(), (decimal)nota.NUMERO_NF, _SERIE_NF, ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }

            return _numero;
        }

        private decimal BUSCA_ULTIMO_NUMERO_NOTA_SAIDA(DataContext ctx)
        {
            decimal retorno = 0;

            var query = from linha in ctx.GetTable<TB_EMITENTE>()
                        where linha.CODIGO_EMITENTE == Convert.ToDecimal(ID_EMPRESA)
                        && linha.SERIE_NF_EMITENTE == _SERIE_NF
                        select linha;

            foreach (var n in query)
            {
                n.NUMERO_NF_EMITENTE += 1;
                n.NUMERO_LOTE += 1;

                _NUMERO_LOTE = (decimal)n.NUMERO_LOTE;

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_EMITENTE>().GetModifiedMembers(n),
                    "TB_EMITENTE", ID_USUARIO);

                retorno = (decimal)n.NUMERO_NF_EMITENTE;
            }

            return retorno;
        }

        private void Gerar_Contas_a_Receber(Doran_ERP_Servicos_DadosDataContext ctx)
        {
            var query1 = (from item in ctx.TB_FINANCEIROs
                          where item.NUMERO_SEQ_NF_SAIDA == _NUMERO_SEQ
                          select item).ToList();

            foreach (var linha in query1)
            {
                ctx.TB_FINANCEIROs.DeleteOnSubmit(linha);
                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);
            }

            ctx.SubmitChanges();

            var query = (from nota in ctx.TB_NOTA_SAIDAs
                         where nota.NUMERO_SEQ == _NUMERO_SEQ
                         select new
                         {
                             nota.CODIGO_CLIENTE_NF,
                             nota.TOTAL_NF,
                             nota.TOTAL_SERVICOS_NF,
                             nota.TB_COND_PAGTO.CODIGO_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA1_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA2_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA3_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA4_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA5_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA6_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA7_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA8_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA9_CP,
                             nota.TB_COND_PAGTO.DIAS_PARCELA10_CP,
                             nota.TB_COND_PAGTO.QTDE_PARCELAS_CP
                         }).ToList();

            foreach (var item in query)
            {
                if (item.QTDE_PARCELAS_CP == 1)
                {
                    Table<TB_FINANCEIRO> Entidade = ctx.GetTable<TB_FINANCEIRO>();

                    TB_FINANCEIRO novo = new TB_FINANCEIRO();
                    DateTime VENCTO = DateTime.Today;
                    VENCTO = VENCTO.AddDays(1);
                    VENCTO = VENCTO.AddSeconds(-1);
                    VENCTO = VENCTO.AddDays((double)item.DIAS_PARCELA1_CP);

                    novo.DATA_LANCAMENTO = DateTime.Now;
                    novo.DATA_VENCIMENTO = VENCTO;
                    novo.DATA_PAGAMENTO = new DateTime(1901, 1, 1);
                    novo.NUMERO_SEQ_NF_ENTRADA = 0;
                    novo.NUMERO_SEQ_NF_SAIDA = _NUMERO_SEQ;
                    novo.CODIGO_CLIENTE = item.CODIGO_CLIENTE_NF;
                    novo.CODIGO_FORNECEDOR = 0;
                    novo.HISTORICO = string.Format("NOTA FISCAL: {0} - CLIENTE: {1} - VENDEDOR: {2}", _NUMERO_NF, _CLIENTE.Trim(), _VENDEDOR.Trim());
                    novo.VALOR = item.TOTAL_NF;
                    novo.VALOR_DESCONTO = 0;
                    novo.VALOR_ACRESCIMO = 0;
                    novo.VALOR_TOTAL = item.TOTAL_NF;
                    novo.CREDITO_DEBITO = 0;
                    novo.NUMERO_NF_SAIDA = _NUMERO_NF;
                    novo.NUMERO_NF_ENTRADA = 0;
                    novo.VALOR_MULTA = 0;
                    novo.PERC_JUROS_DIA = 0;
                    novo.CODIGO_EMITENTE = ID_EMPRESA;
                    novo.ID_PLANO = "5.1.1.001";
                    novo.VALOR_APROXIMADO = 0;

                    novo.MARCA_REMESSA = 0;
                    novo.REMESSA = 0;
                    novo.RETORNO = 0;
                    novo.NUMERO_BANCO = 0;
                    novo.INSTRUCAO_REMESSA = 0;
                    novo.NOSSO_NUMERO_BANCARIO = string.Empty;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                    ctx.SubmitChanges();
                }
                else
                {
                    Dictionary<DateTime, decimal> Parcelas =
                        Calcula_Vencimentos_e_Valores(item.TOTAL_SERVICOS_NF.Value, item.TOTAL_NF.Value, item.CODIGO_CP);

                    foreach (DateTime key in Parcelas.Keys)
                    {
                        Table<TB_FINANCEIRO> Entidade = ctx.GetTable<TB_FINANCEIRO>();

                        TB_FINANCEIRO novo = new TB_FINANCEIRO();

                        novo.DATA_LANCAMENTO = DateTime.Now;
                        novo.DATA_VENCIMENTO = key;
                        novo.DATA_PAGAMENTO = new DateTime(1901, 1, 1);
                        novo.NUMERO_SEQ_NF_ENTRADA = 0;
                        novo.NUMERO_SEQ_NF_SAIDA = _NUMERO_SEQ;
                        novo.CODIGO_CLIENTE = item.CODIGO_CLIENTE_NF;
                        novo.CODIGO_FORNECEDOR = 0;
                        novo.HISTORICO = string.Format("NOTA FISCAL: {0} - CLIENTE: {1} - VENDEDOR: {2}", _NUMERO_NF, _CLIENTE.Trim(), _VENDEDOR.Trim());
                        novo.VALOR = Parcelas[key];
                        novo.VALOR_DESCONTO = 0;
                        novo.VALOR_ACRESCIMO = 0;
                        novo.VALOR_TOTAL = Parcelas[key];
                        novo.CREDITO_DEBITO = 0;
                        novo.NUMERO_NF_SAIDA = _NUMERO_NF;
                        novo.NUMERO_NF_ENTRADA = 0;
                        novo.VALOR_MULTA = 0;
                        novo.PERC_JUROS_DIA = 0;
                        novo.CODIGO_EMITENTE = ID_EMPRESA;
                        novo.ID_PLANO = "5.1.1.001";

                        novo.VALOR_APROXIMADO = 0;
                        novo.MARCA_REMESSA = 0;
                        novo.REMESSA = 0;
                        novo.RETORNO = 0;
                        novo.NUMERO_BANCO = 0;
                        novo.INSTRUCAO_REMESSA = 0;
                        novo.NOSSO_NUMERO_BANCARIO = string.Empty;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }
                }
            }
        }

        public string Monta_Vencimentos_NF()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal? COBRANCA_ISENTA = 0;

                _NUMERO_SEQ = COBRANCA_ISENTA == 1 ? -1 : _NUMERO_SEQ;

                CultureInfo cultura = CultureInfo.CurrentCulture;
                string[] dias = cultura.DateTimeFormat.DayNames;

                var query1 = from linha in ctx.TB_FINANCEIROs
                             where linha.NUMERO_SEQ_NF_SAIDA == _NUMERO_SEQ

                             select new
                             {
                                 VENCIMENTO = linha.DATA_VENCIMENTO,
                                 VALOR = linha.VALOR_TOTAL
                             };

                DataTable dt1 = ApoioXML.ToDataTable(ctx, query1);

                dt1.Columns.Add("DIA");

                foreach (DataRow linha in dt1.Rows)
                    linha["DIA"] = dias[(int)((DateTime)linha["VENCIMENTO"]).DayOfWeek].ToUpper();

                string retorno = "";

                if (dt1.Rows.Count > 0)
                {
                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    dt1.WriteXml(tr);

                    retorno = tr.ToString();
                }
                else
                {
                    decimal TOTAL_NF = 0;
                    decimal CODIGO_CP = 0;
                    decimal TOTAL_PRODUTOS = 0;

                    var query = (from nota in ctx.GetTable<TB_NOTA_SAIDA>()
                                 where nota.NUMERO_SEQ == _NUMERO_SEQ
                                 select new
                                 {
                                     nota.CODIGO_CP_NF,
                                     nota.TOTAL_NF,
                                     nota.TOTAL_SERVICOS_NF
                                 }).ToList();

                    foreach (var item in query)
                    {
                        TOTAL_PRODUTOS = item.TOTAL_SERVICOS_NF.Value;
                        TOTAL_NF = item.TOTAL_NF.Value;
                        CODIGO_CP = item.CODIGO_CP_NF.Value;
                    }

                    Dictionary<DateTime, decimal> Parcelas = Calcula_Vencimentos_e_Valores(TOTAL_PRODUTOS, TOTAL_NF, CODIGO_CP);

                    if (COBRANCA_ISENTA == 1)
                        Parcelas.Clear();

                    DataTable dt = new DataTable("Tabela");

                    dt.Columns.Add("VENCIMENTO", typeof(DateTime));
                    dt.Columns.Add("DIA", typeof(string));
                    dt.Columns.Add("VALOR", typeof(decimal));

                    foreach (DateTime key in Parcelas.Keys)
                    {
                        if (query.First().TOTAL_NF > (decimal)0.00)
                        {
                            DataRow nova = dt.NewRow();
                            nova[0] = key;
                            nova[1] = dias[(int)((DateTime)key).DayOfWeek].ToUpper();
                            nova[2] = Parcelas[key];
                            dt.Rows.Add(nova);
                        }
                    }

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    dt.WriteXml(tr);

                    retorno = tr.ToString();
                }

                return retorno;
            }
        }

        public void Emite_Nota_Fiscal_Eletronica(decimal NUMERO_NF)
        {
            using (Doran_Base.Faturamento.NFe nfe = new Doran_Base.Faturamento.NFe(_NUMERO_SEQ, NUMERO_NF, _SERIE_NF, ID_EMPRESA))
            {
                nfe.ID_USUARIO = ID_USUARIO;
                //nfe.CHAVE_NFE_UTIL = ConfigurationManager.AppSettings["NOVA_CHAVE_NFe_Util"];

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_NOTA_SAIDAs
                                 where linha.NUMERO_SEQ == _NUMERO_SEQ
                                 select new
                                 {
                                     linha.NUMERO_LOTE_NF
                                 }).ToList();

                    foreach (var item in query)
                    {
                        nfe._NUMERO_LOTE = (decimal)item.NUMERO_LOTE_NF;
                    }
                }

                nfe.GeraNFe();
            }
        }

        public static Dictionary<DateTime, decimal> Calcula_Vencimentos_e_Valores(decimal TOTAL_SERVICOS, decimal TOTAL_NF, decimal CODIGO_CP)
        {
            decimal QTDE_PARCELAS = 0;
            decimal DIAS_PARCELA1_CP = 0;
            decimal DIAS_PARCELA2_CP = 0;
            decimal DIAS_PARCELA3_CP = 0;
            decimal DIAS_PARCELA4_CP = 0;
            decimal DIAS_PARCELA5_CP = 0;
            decimal DIAS_PARCELA6_CP = 0;
            decimal DIAS_PARCELA7_CP = 0;
            decimal DIAS_PARCELA8_CP = 0;
            decimal DIAS_PARCELA9_CP = 0;
            decimal DIAS_PARCELA10_CP = 0;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_COND_PAGTOs
                             where linha.CODIGO_CP == CODIGO_CP
                             select linha).ToList();

                foreach (var item in query)
                {
                    QTDE_PARCELAS = (decimal)item.QTDE_PARCELAS_CP;

                    DIAS_PARCELA1_CP = (decimal)item.DIAS_PARCELA1_CP;
                    DIAS_PARCELA2_CP = (decimal)item.DIAS_PARCELA2_CP;
                    DIAS_PARCELA3_CP = (decimal)item.DIAS_PARCELA3_CP;
                    DIAS_PARCELA4_CP = (decimal)item.DIAS_PARCELA4_CP;
                    DIAS_PARCELA5_CP = (decimal)item.DIAS_PARCELA5_CP;
                    DIAS_PARCELA6_CP = (decimal)item.DIAS_PARCELA6_CP;
                    DIAS_PARCELA7_CP = (decimal)item.DIAS_PARCELA7_CP;
                    DIAS_PARCELA8_CP = (decimal)item.DIAS_PARCELA8_CP;
                    DIAS_PARCELA9_CP = (decimal)item.DIAS_PARCELA9_CP;
                    DIAS_PARCELA10_CP = (decimal)item.DIAS_PARCELA10_CP;
                }
            }

            Dictionary<DateTime, decimal> parcelas = new Dictionary<DateTime, decimal>();

            decimal VALOR_PARCELA = 0;

            if (QTDE_PARCELAS > 0)
                VALOR_PARCELA = TOTAL_SERVICOS / QTDE_PARCELAS;

            DateTime venc1 = DateTime.Today.AddDays(1).AddSeconds(-1);
            venc1 = venc1.AddDays((double)DIAS_PARCELA1_CP);

            DateTime vencimento = DateTime.Today;

            DateTime venc2 = DIAS_PARCELA2_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA2_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc3 = DIAS_PARCELA3_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA3_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc4 = DIAS_PARCELA4_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA4_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc5 = DIAS_PARCELA5_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA5_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc6 = DIAS_PARCELA6_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA6_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc7 = DIAS_PARCELA7_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA7_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc8 = DIAS_PARCELA8_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA8_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc9 = DIAS_PARCELA9_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA9_CP + 1).AddSeconds(-1) : vencimento;
            DateTime venc10 = DIAS_PARCELA10_CP > 0 ? vencimento.AddDays((double)DIAS_PARCELA10_CP + 1).AddSeconds(-1) : vencimento;

            parcelas.Add(venc1, VALOR_PARCELA);

            if (QTDE_PARCELAS == 2)
            {
                parcelas.Add(venc2, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 3)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 4)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 5)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 6)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 7)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 8)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, VALOR_PARCELA);
                parcelas.Add(venc8, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 9)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, VALOR_PARCELA);
                parcelas.Add(venc8, VALOR_PARCELA);
                parcelas.Add(venc9, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }
            else if (QTDE_PARCELAS == 10)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, VALOR_PARCELA);
                parcelas.Add(venc8, VALOR_PARCELA);
                parcelas.Add(venc9, VALOR_PARCELA);
                parcelas.Add(venc10, Diferenca_Parcela(QTDE_PARCELAS, VALOR_PARCELA, TOTAL_NF));
            }

            return parcelas;
        }

        private static decimal Diferenca_Parcela(decimal QTDE_PARCELAS, decimal VALOR_PARCELA, decimal TOTAL_NF)
        {
            VALOR_PARCELA = Math.Round(VALOR_PARCELA, 2, MidpointRounding.ToEven);

            decimal VALOR_PARCELAS = VALOR_PARCELA * (QTDE_PARCELAS - 1);

            decimal DIFERENCA = TOTAL_NF - VALOR_PARCELAS;

            if (DIFERENCA > (decimal)0.00)
                VALOR_PARCELA += DIFERENCA;

            if (DIFERENCA < (decimal)0.00)
                VALOR_PARCELA -= (DIFERENCA * -1);

            return VALOR_PARCELA;
        }

        public static decimal Dia_Util(decimal DIAS)
        {
            DateTime _vencimento = DateTime.Today.AddDays((double)DIAS);
            decimal retorno = DIAS;

            while (Doran_TitulosVencidos.Feriado_FimDeSemana(_vencimento))
            {
                _vencimento = _vencimento.AddDays(1);
                retorno += 1;
            }

            return retorno;
        }

        private string DigitoVerificador(string chave)
        {
            int[] intPesos = { 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4 };
            string strText = chave;

            int intSoma = 0;
            int intIdx = 0;

            for (int intPos = strText.Length - 1; intPos >= 0; intPos--)
            {
                intSoma += Convert.ToInt32(strText[intPos].ToString()) * intPesos[intIdx];
                intIdx++;
            }

            int intResto = (intSoma * 10) % 11;
            int intDigito = intResto;

            if (intDigito > 9)
                intDigito = 0;

            return chave + intDigito.ToString();
        }

        private string NumeroAleatorio()
        {
            Random random = new Random();
            return random.Next(1, 99999999).ToString().PadLeft(8, '0');
        }

        private void ParametrosDeEstoque()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_CONFIG_FATH2s
                            where linha.ID_CONFIG == 1
                            select new
                            {
                                linha.BAIXAR_ESTOQUE_CONF_NF,
                                linha.VENDA_ESTOQUE_ZERADO
                            };

                foreach (var item in query)
                {
                    if (item.VENDA_ESTOQUE_ZERADO == 1)
                        _PERMITE_ESTOQUE_ZERADO_NEGATIVO = true;
                }
            }
        }

        public static void Atualiza_Ultima_Fatura_Cliente(DataContext ctx, decimal? CODIGO_CLIENTE, decimal ID_USUARIO)
        {
            var query = (from linha in ctx.GetTable<TB_NOTA_SAIDA>()
                         orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF descending

                         where (linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                         && linha.STATUS_NF == 4)

                         group linha by new
                         {
                             linha.CODIGO_CLIENTE_NF
                         } into grupo

                         select new
                         {
                             grupo.Key.CODIGO_CLIENTE_NF,
                             DATA_ULTIMA_FATURA = grupo.Max(d => d.DATA_EMISSAO_NF),
                             VALOR_ULTIMA_FATURA = grupo.Max(v => v.TOTAL_SERVICOS_NF)
                         }).ToList();

            foreach (var item in query)
            {
                var query1 = (from linha in ctx.GetTable<TB_CLIENTE>()
                              where linha.ID_CLIENTE == CODIGO_CLIENTE
                              select linha).ToList();

                foreach (var item1 in query1)
                {
                    item1.DATA_ULTIMA_FATURA = item.DATA_ULTIMA_FATURA;
                    item1.VALOR_ULTIMA_FATURA = item.VALOR_ULTIMA_FATURA;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_CLIENTE>().GetModifiedMembers(item1),
                        "TB_CLIENTE", ID_USUARIO);
                }
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            _NUMERO_SEQ = 0;
        }

        #endregion
    }
}