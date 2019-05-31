using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base;
using System.Text;
using System.Data.Linq.SqlClient;
using System.Data;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Calculo_de_Entrega_de_Produtos : IDisposable
    {
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }
        private decimal NUMERO_ORCAMENTO_VENDA { get; set; }
        private decimal NUMERO_ITEM_ORCAMENTO { get; set; }
        private decimal CODIGO_EMITENTE { get; set; }
        public decimal ID_USUARIO { get; set; }
        private decimal ID_PRODUTO { get; set; }

        private TB_STATUS_PEDIDO STATUS_ANALISE { get; set; }
        private TB_STATUS_PEDIDO STATUS_ANALISE_ESTOQUE { get; set; }
        private TB_STATUS_PEDIDO STATUS_COMPRAS { get; set; }
        private TB_STATUS_PEDIDO STATUS_PROCESSO_COMPRAS { get; set; }
        private TB_STATUS_PEDIDO STATUS_BENEFICIAMENTO { get; set; }
        private TB_STATUS_PEDIDO STATUS_SEPARACAO { get; set; }
        private TB_STATUS_PEDIDO STATUS_FATURAMENTO { get; set; }
        private decimal? QTDE_PEDIDO { get; set; }

        private double? tempo_medio_analise { get; set; }
        private double? tempo_medio_analise_estoque { get; set; }
        private double? tempo_medio_compras { get; set; }
        private double? tempo_medio_processo_compras { get; set; }
        private double? tempo_medio_beneficiamento { get; set; }
        private double? tempo_medio_separacao { get; set; }
        private double? tempo_medio_faturamento { get; set; }

        private List<DateTime> FERIADOS { get; set; }
        private int _MINUTOS { get; set; }

        public Doran_Calculo_de_Entrega_de_Produtos(decimal _NUMERO_ORCAMENTO_VENDA, decimal _NUMERO_ITEM_ORCAMENTO, decimal _CODIGO_EMITENTE)
        {
            Inicia_Base();

            NUMERO_ORCAMENTO_VENDA = _NUMERO_ORCAMENTO_VENDA;
            NUMERO_ITEM_ORCAMENTO = _NUMERO_ITEM_ORCAMENTO;
            CODIGO_EMITENTE = _CODIGO_EMITENTE;
        }

        public Doran_Calculo_de_Entrega_de_Produtos(decimal _NUMERO_ORCAMENTO_VENDA, decimal _CODIGO_EMITENTE)
        {
            Inicia_Base();

            NUMERO_ORCAMENTO_VENDA = _NUMERO_ORCAMENTO_VENDA;
            CODIGO_EMITENTE = _CODIGO_EMITENTE;
        }

        public Doran_Calculo_de_Entrega_de_Produtos(decimal? _CODIGO_EMITENTE, decimal? _ID_USUARIO)
        {
            Inicia_Base();

            CODIGO_EMITENTE = _CODIGO_EMITENTE.Value;
            ID_USUARIO = _ID_USUARIO.Value;
        }

        public string Calcula_Entregas_do_Orcamento()
        {
            string retorno = string.Empty;

            var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                         where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO_VENDA

                         select new ITEMS_COM_ENTREGAS_PROGRAMADAS_ORCAMENTO()
                         {
                             NUMERO_ORCAMENTO = linha.NUMERO_ORCAMENTO,
                             NUMERO_ITEM = linha.NUMERO_ITEM,
                             ID_PRODUTO = linha.ID_PRODUTO,
                             CODIGO_PRODUTO = linha.CODIGO_PRODUTO,
                             DESCRICAO_PRODUTO_ITEM_ORCAMENTO = linha.DESCRICAO_PRODUTO_ITEM_ORCAMENTO,
                             QTDE_PRODUTO = linha.QTDE_PRODUTO,
                             UNIDADE_PRODUTO = linha.UNIDADE_PRODUTO,
                             DATA_ENTREGA = linha.DATA_ENTREGA,
                             NUMERO_PEDIDO_VENDA = linha.NUMERO_PEDIDO_VENDA,
                             ATRASADA = linha.DATA_ENTREGA < DateTime.Today ? "1" : "0",
                             PROGRAMACAO = "",
                             NAO_GERAR_PEDIDO = linha.NAO_GERAR_PEDIDO,
                             DATA_CALCULADA = DateTime.Today
                         }).ToList();

            foreach (var item in query)
            {
                _MINUTOS = 0;

                NUMERO_ITEM_ORCAMENTO = item.NUMERO_ITEM;
                ID_PRODUTO = item.ID_PRODUTO.Value;
                QTDE_PEDIDO = item.QTDE_PRODUTO;

                Adiciona_Feriados_Fim_de_semana_horas_descanso();

                item.DATA_CALCULADA = DateTime.Now.AddMinutes(_MINUTOS);
            }

            DataTable dt = ApoioXML.ToTable<ITEMS_COM_ENTREGAS_PROGRAMADAS_ORCAMENTO>(query);

            System.IO.StringWriter tr = new System.IO.StringWriter();
            dt.WriteXml(tr);

            retorno = tr.ToString();

            return retorno;
        }

        #region ANALISE DAS FASES DO PEDIDO

        private TEMPO_MEDIO_DA_FASE Calcula_Tempo_Medio(decimal ID_STATUS)
        {
            var por_produto = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                               where linha.ID_PRODUTO == ID_PRODUTO
                               && linha.ID_STATUS_ANTERIOR == ID_STATUS
                               && linha.DATA_MUDANCA < DateTime.Today.AddMinutes(-1)

                               select new TEMPO_DE_FASES()
                               {
                                   DATA_STATUS_ANTERIOR = linha.DATA_STATUS_ANTERIOR,
                                   DATA_MUDANCA = linha.DATA_MUDANCA,
                                   MINUTOS = SqlMethods.DateDiffMinute(linha.DATA_STATUS_ANTERIOR, linha.DATA_MUDANCA.Value),
                                   QTDE = linha.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO
                               }).Take(5).ToList();

            List<TEMPO_DE_FASES> tempo = Desconta_Minutos_Feriado_Fim_de_Semana_fora_do_Expediente(por_produto);

            double? minutos = tempo.Average(d => d.MINUTOS);
            decimal? QTDE_TOTAL = tempo.Sum(s => s.QTDE);

            if (!minutos.HasValue || minutos < 0.00)
            {
                var media = (from linha in ctx.TB_MUDANCA_STATUS_PEDIDOs
                             where linha.ID_STATUS_ANTERIOR == ID_STATUS
                             && linha.DATA_MUDANCA < DateTime.Today.AddMinutes(-1)

                             select new TEMPO_DE_FASES()
                             {
                                 DATA_STATUS_ANTERIOR = linha.DATA_STATUS_ANTERIOR,
                                 DATA_MUDANCA = linha.DATA_MUDANCA,
                                 MINUTOS = SqlMethods.DateDiffMinute(linha.DATA_STATUS_ANTERIOR, linha.DATA_MUDANCA.Value),
                                 QTDE = linha.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO
                             }).Take(5).ToList();

                tempo = Desconta_Minutos_Feriado_Fim_de_Semana_fora_do_Expediente(media);

                minutos = tempo.Average(d => d.MINUTOS);
                QTDE_TOTAL = tempo.Sum(s => s.QTDE);
            }

            var STATUS_INICIO = (from linha in ctx.TB_STATUS_PEDIDOs
                                 where linha.CODIGO_STATUS_PEDIDO == ID_STATUS
                                 select linha.INICIO_FIM_DE_FASE).First();

            if (STATUS_INICIO == 4) // início de separação
            {
                if (QTDE_TOTAL.HasValue && minutos.HasValue)
                {
                    if (QTDE_TOTAL > (decimal)0.00 && minutos > (double)0.00)
                    {
                        decimal tempo_de_separacao_da_unidade = Convert.ToDecimal(minutos) / QTDE_TOTAL.Value;
                        minutos = (Convert.ToDouble(tempo_de_separacao_da_unidade) * Convert.ToDouble(QTDE_PEDIDO));
                    }
                }
            }

            TEMPO_MEDIO_DA_FASE retorno = new TEMPO_MEDIO_DA_FASE();

            retorno.MINUTOS = Convert.ToInt32(minutos);
            _MINUTOS += Convert.ToInt32(minutos);

            retorno = Acerta_Tempo_da_Fase(retorno);

            preenche_tempo_fase(ID_STATUS, minutos);

            return retorno;
        }

        private void preenche_tempo_fase(decimal ID_STATUS, double? minutos)
        {
            if (ID_STATUS == STATUS_ANALISE.CODIGO_STATUS_PEDIDO)
                tempo_medio_analise = minutos;

            if (ID_STATUS == STATUS_ANALISE_ESTOQUE.CODIGO_STATUS_PEDIDO)
                tempo_medio_analise_estoque = minutos;

            if (ID_STATUS == STATUS_COMPRAS.CODIGO_STATUS_PEDIDO)
                tempo_medio_compras = minutos;

            if (ID_STATUS == STATUS_PROCESSO_COMPRAS.CODIGO_STATUS_PEDIDO)
                tempo_medio_processo_compras = minutos;

            if (ID_STATUS == STATUS_BENEFICIAMENTO.CODIGO_STATUS_PEDIDO)
                tempo_medio_beneficiamento = minutos;

            if (ID_STATUS == STATUS_SEPARACAO.CODIGO_STATUS_PEDIDO)
                tempo_medio_separacao = minutos;

            if (ID_STATUS == STATUS_FATURAMENTO.CODIGO_STATUS_PEDIDO)
                tempo_medio_faturamento = minutos;
        }

        private List<TEMPO_DE_FASES> Desconta_Minutos_Feriado_Fim_de_Semana_fora_do_Expediente(List<TEMPO_DE_FASES> tempo)
        {
            List<TEMPO_DE_FASES> retorno = tempo;

            foreach (var item in retorno)
            {
                if (item.DATA_MUDANCA.Value.Day != item.DATA_STATUS_ANTERIOR.Value.Day)
                {
                    DateTime dt = item.DATA_STATUS_ANTERIOR.Value;
                    DateTime data = new DateTime(dt.Year, dt.Month, dt.Day);

                    while (dt < item.DATA_MUDANCA)
                    {
                        if (dt.DayOfWeek != DayOfWeek.Saturday && dt.DayOfWeek != DayOfWeek.Sunday && !FERIADOS.Contains(data))
                        {
                            if (dt.Hour < 8 || dt.Hour >= 18 || dt.Hour == 12)
                                item.MINUTOS--;
                        }
                        else
                        {
                            item.MINUTOS--;
                        }

                        dt = dt.AddMinutes(1);
                    }
                }
            }

            return retorno;
        }

        #endregion

        private TEMPO_MEDIO_DA_FASE Acerta_Tempo_da_Fase(TEMPO_MEDIO_DA_FASE tempo)
        {
            TEMPO_MEDIO_DA_FASE retorno = tempo;

            if (retorno.MINUTOS > 60)
            {
                double horas = retorno.MINUTOS.Value / 60;
                double dias = 0;

                if (horas > 24)
                {
                    dias = horas / 24;
                    horas = (dias - Convert.ToInt32(dias)) * 24;
                }

                retorno.DIAS = Convert.ToInt32(dias);
                retorno.HORAS = Convert.ToInt32(horas);
                retorno.MINUTOS = Convert.ToInt32((horas - Convert.ToInt32(horas)) * 60);
            }
            else
            {
                retorno.DIAS = 0;
                retorno.HORAS = 0;
            }

            return retorno;
        }

        private bool Fornecedor_de_mercadorias(decimal CODIGO_FORNECEDOR)
        {
            var CNPJ_EMITENTE = (from linha in ctx.TB_EMITENTEs
                                 where linha.CODIGO_EMITENTE == CODIGO_EMITENTE
                                 select linha.CNPJ_EMITENTE).First();

            var existe = (from linha in ctx.TB_FORNECEDORs
                          where linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                          && linha.CNPJ_FORNECEDOR == CNPJ_EMITENTE
                          select linha).Any();

            return existe ? false : true;
        }

        private void Inicia_Base()
        {
            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

            FERIADOS = (from linha in ctx.TB_FERIADOs
                        where linha.DATA_FERIADO >= DateTime.Today
                        select linha.DATA_FERIADO).ToList();

            // Fases

            var PEDIDO_ANALISE = (from linha in ctx.TB_STATUS_PEDIDOs
                                  where linha.STATUS_ESPECIFICO == 1
                                  select linha).ToList();

            if (!PEDIDO_ANALISE.Any())
                throw new Exception("N&atilde;o h&aacute; fase [PEDIDO EM AN&Aacute;LISE] cadastrada");

            STATUS_ANALISE = PEDIDO_ANALISE.First();

            //

            var INICIO_DE_ANALISE = (from linha in ctx.TB_STATUS_PEDIDOs
                                     where linha.INICIO_FIM_DE_FASE == 2 // início de análise de estoque
                                     select linha).ToList();

            if (!INICIO_DE_ANALISE.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de an&aacute;lise de estoque cadastrada");

            STATUS_ANALISE_ESTOQUE = INICIO_DE_ANALISE.First();

            //

            var INICIO_DE_COMPRAS = (from linha in ctx.TB_STATUS_PEDIDOs
                                     where linha.INICIO_FIM_DE_FASE == 1 // início de compras
                                     select linha).ToList();

            if (!INICIO_DE_COMPRAS.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de compras cadastrada");

            STATUS_COMPRAS = INICIO_DE_COMPRAS.First();

            //

            var PROCESSO_DE_COMPRAS = (from linha in ctx.TB_STATUS_PEDIDOs
                                       where linha.INICIO_FIM_DE_FASE == 6 // entrega do fornecedor
                                       select linha).ToList();

            if (!PROCESSO_DE_COMPRAS.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de compras cadastrada");

            STATUS_PROCESSO_COMPRAS = PROCESSO_DE_COMPRAS.First();

            //

            var INICIO_DE_BENEFICIAMENTO = (from linha in ctx.TB_STATUS_PEDIDOs
                                            where linha.INICIO_FIM_DE_FASE == 3 // início de beneficiamento
                                            select linha).ToList();

            if (!INICIO_DE_BENEFICIAMENTO.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de beneficiamento cadastrada");

            STATUS_BENEFICIAMENTO = INICIO_DE_BENEFICIAMENTO.First();

            //

            var INICIO_DE_SEPARACAO = (from linha in ctx.TB_STATUS_PEDIDOs
                                       where linha.INICIO_FIM_DE_FASE == 4 // início de Separação
                                       select linha).ToList();

            if (!INICIO_DE_SEPARACAO.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de separa&ccedil;&atilde;o cadastrada");

            STATUS_SEPARACAO = INICIO_DE_SEPARACAO.First();

            //

            var INICIO_DE_FATURAMENTO = (from linha in ctx.TB_STATUS_PEDIDOs
                                         where linha.INICIO_FIM_DE_FASE == 5 // início de Faturamento
                                         select linha).ToList();

            if (!INICIO_DE_FATURAMENTO.Any())
                throw new Exception("N&atilde;o h&aacute; a fase de in&iacute;cio de faturamento cadastrada");

            STATUS_FATURAMENTO = INICIO_DE_FATURAMENTO.First();

            //

            tempo_medio_analise = -1;
            tempo_medio_analise_estoque = -1;
            tempo_medio_compras = -1;
            tempo_medio_processo_compras = -1;
            tempo_medio_beneficiamento = -1;
            tempo_medio_separacao = -1;
            tempo_medio_faturamento = -1;
        }

        private string Monta_string_tempo(double? dias, double? horas, double? minutos)
        {
            string tempo = string.Empty;

            if (dias > 0)
                tempo += string.Concat(dias.ToString(), dias == 1 ? " Dia, " : " Dias, ");

            if (horas > 0)
                tempo += string.Concat(horas.ToString(), horas == 1 ? " Hora, " : " Horas, ");

            if (minutos > 0)
                tempo += string.Concat(minutos.ToString(), minutos == 1 ? " Minuto, " : " Minutos, ");

            if (tempo.Length > 1)
                tempo = tempo.Substring(0, tempo.Length - 2);
            else
                tempo = "N&atilde;o h&aacute; hist&oacute;rico";

            return tempo;
        }

        private void Adiciona_Feriados_Fim_de_semana_horas_descanso()
        {
            DateTime agora = DateTime.Now;
            DateTime data_programada = agora.AddMinutes(_MINUTOS);

            while (agora < data_programada)
            {
                if (agora.DayOfWeek != DayOfWeek.Saturday && agora.DayOfWeek != DayOfWeek.Sunday && !FERIADOS.Contains(agora))
                {
                    if (agora.Hour < 8 || agora.Hour >= 18 || agora.Hour == 12)
                        _MINUTOS++;
                }
                else
                {
                    _MINUTOS++;
                }

                agora = agora.AddMinutes(1);
            }
        }

        public static void Grava_Nova_Data_de_Entrega_Itens_Orcamento(decimal NUMERO_ORCAMENTO, List<decimal> NUMEROS_ITEM_ORCAMENTO,
            List<string> DATAS_ENTREGAS, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx1.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             && NUMEROS_ITEM_ORCAMENTO.Contains(linha.NUMERO_ITEM)
                             select linha).ToList();

                for (int i = 0; i < query.Count; i++)
                {
                    foreach (var item in query.Where(n => n.NUMERO_ITEM == NUMEROS_ITEM_ORCAMENTO[i]))
                    {
                        DateTime x = new DateTime();

                        if (DateTime.TryParse(DATAS_ENTREGAS[i], out x))
                            x = Convert.ToDateTime(DATAS_ENTREGAS[i]);
                        else
                            throw new Exception("A data de entrega do item <b>" + item.CODIGO_PRODUTO.Trim() + "</b> &eacute; inv&aacute;lida");

                        item.DATA_ENTREGA = x;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx1, ctx1.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx1.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }
                }

                ctx1.SubmitChanges();
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
            ctx.Dispose();
        }

        #endregion
    }

    class TEMPO_MEDIO_DA_FASE
    {
        public TEMPO_MEDIO_DA_FASE() { }

        public double? DIAS { get; set; }
        public double? HORAS { get; set; }
        public double? MINUTOS { get; set; }
    }

    class ITEMS_COM_ENTREGAS_PROGRAMADAS_ORCAMENTO
    {
        public ITEMS_COM_ENTREGAS_PROGRAMADAS_ORCAMENTO() { }

        public decimal NUMERO_ORCAMENTO { get; set; }
        public decimal NUMERO_ITEM { get; set; }
        public decimal? ID_PRODUTO { get; set; }
        public string CODIGO_PRODUTO { get; set; }
        public string DESCRICAO_PRODUTO_ITEM_ORCAMENTO { get; set; }
        public decimal? QTDE_PRODUTO { get; set; }
        public string UNIDADE_PRODUTO { get; set; }
        public DateTime? DATA_ENTREGA { get; set; }
        public decimal? NUMERO_PEDIDO_VENDA { get; set; }
        public string ATRASADA { get; set; }
        public string PROGRAMACAO { get; set; }
        public decimal? NAO_GERAR_PEDIDO { get; set; }
        public DateTime? DATA_CALCULADA { get; set; }
    }

    class TEMPO_DE_FASES
    {
        public TEMPO_DE_FASES() { }

        public DateTime? DATA_STATUS_ANTERIOR { get; set; }
        public DateTime? DATA_MUDANCA { get; set; }
        public int? MINUTOS { get; set; }
        public decimal? QTDE { get; set; }
    }

    class DEMANDA_ATUAL
    {
        public DEMANDA_ATUAL() { }

        public decimal NUMERO_PEDIDO { get; set; }
        public decimal NUMERO_ITEM { get; set; }
        public decimal? ID_PRODUTO_PEDIDO { get; set; }
        public decimal? QTDE_A_FATURAR { get; set; }

        public bool EM_FATURAMENTO { get; set; }
        public bool EM_SEPARACAO { get; set; }
        public bool EM_BENEFICIAMENTO { get; set; }
        public bool EM_PROCESSO_COMPRAS { get; set; }
        public bool EM_COMPRAS { get; set; }
        public bool EM_ANALISE_ESTOQUE { get; set; }
        public bool EM_ANALISE { get; set; }
        public bool FORNECEDOR { get; set; }
        public bool BENEFICIAMENTO { get; set; }
    }

    class MEDIA_DE_TEMPO_DO_PRODUTO
    {
        public MEDIA_DE_TEMPO_DO_PRODUTO() { }

        public DateTime? ULTIMA_DATA { get; set; }
        public DateTime? PRIMEIRA_DATA { get; set; }
        public decimal? QTDE_PEDIDA { get; set; }
    }
}