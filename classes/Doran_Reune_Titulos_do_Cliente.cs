using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.Globalization;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Reune_Titulos_do_Cliente : IDisposable
    {
        private decimal ID_USUARIO { get; set; }
        private decimal ID_EMPRESA { get; set; }
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }

        public Doran_Reune_Titulos_do_Cliente(decimal _ID_USUARIO, decimal _ID_EMPRESA)
        {
            ID_USUARIO = _ID_USUARIO;
            ID_EMPRESA = _ID_EMPRESA;

            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");
        }


        public void Une_Titulos_Selecionados(DateTime DATA_DE_VENCIMENTO)
        {
            var query = (from linha in ctx.TB_FINANCEIROs
                         where linha.ID_USUARIO_MARCA_UNIAO == ID_USUARIO
                         && linha.TITULO_MARCADO_UNIAO == 1
                         select linha).ToList();

            if (!query.Any())
                throw new Exception("N&atilde;o h&aacute; t&iacute;tulos marcados para unir");

            if (query.Any(_ => _.CREDITO_DEBITO == 1))
                throw new Exception("H&aacute; t&iacute;tulo(s) de d&eacute;bito marcado(s). Marque somente t&iacute;tulos de cr&eacute;dito e do mesmo cliente");

            if (query.Any(_ => _.DATA_PAGAMENTO > new DateTime(1901, 01, 01)))
                throw new Exception("H&aacute; t&iacute;tulo(s) pago(s) marcado(s). Marque somente t&iacute;tulos a vencer");

            if (query.GroupBy(_ => _.CODIGO_CLIENTE).Count() > 1)
                throw new Exception("Marque somente t&iacute;tulos do mesmo cliente");

            if (query.Count == 1)
                throw new Exception("S&oacute; h&aacute; 1 t&iacute;tulo marcado. Marque pelo menos 2 t&iacute;tulos");

            try
            {
                ctx.Transaction = ctx.Connection.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                List<TB_FINANCEIRO> query1 = new List<TB_FINANCEIRO>();

                string CLIENTE = query.First().TB_NOTA_SAIDA == null ?
                    query.First().TB_CLIENTE == null ?
                    "" : query.First().TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim() :
                    query.First().TB_NOTA_SAIDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim();

                decimal? CODIGO_CLIENTE = query.First().CODIGO_CLIENTE;
                string CNPJ_CLIENTE = query.First().CNPJ_CLIENTE;

                string ID_PLANO = query.First().ID_PLANO;

                foreach (var item in query)
                    query1.Add(item);

                foreach (var item in query)
                {
                    ctx.TB_FINANCEIROs.DeleteOnSubmit(item);
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_FINANCEIROs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();

                string historico = string.Concat("CLIENTE: ", CLIENTE, " - COBRANÇA DE SERVIÇO(S) REFERENTE NFs ",
                    string.Join(" - ", query1.Select(_ => _.NUMERO_NF_SAIDA.ToString()).ToArray()),
                    " SOMANDO OS VALORES DE ",
                    string.Join(" + ", query1.Select(_ => _.VALOR_TOTAL.Value.ToString("c")).ToArray()));

                System.Data.Linq.Table<Doran_Servicos_ORM.TB_FINANCEIRO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FINANCEIRO>();

                Doran_Servicos_ORM.TB_FINANCEIRO novo = new Doran_Servicos_ORM.TB_FINANCEIRO();

                DateTime _vencimento = DATA_DE_VENCIMENTO;
                _vencimento = _vencimento.AddDays(1);
                _vencimento = _vencimento.AddSeconds(-1);

                novo.DATA_LANCAMENTO = DateTime.Now;
                novo.DATA_VENCIMENTO = _vencimento;
                novo.DATA_PAGAMENTO = new DateTime(1901, 01, 01);
                novo.VALOR = query1.Sum(_ => _.VALOR);
                novo.VALOR_DESCONTO = query1.Sum(_ => _.VALOR_DESCONTO);
                novo.VALOR_ACRESCIMO = query1.Sum(_ => _.VALOR_ACRESCIMO);
                novo.VALOR_TOTAL = query1.Sum(_ => _.VALOR_TOTAL);
                novo.HISTORICO = historico;
                novo.CREDITO_DEBITO = 0;

                novo.NUMERO_SEQ_NF_SAIDA = 0;
                novo.NUMERO_SEQ_NF_ENTRADA = 0;
                novo.NUMERO_NF_SAIDA = 0;
                novo.NUMERO_NF_ENTRADA = 0;

                novo.CODIGO_CLIENTE = CODIGO_CLIENTE;
                novo.CNPJ_CLIENTE = CNPJ_CLIENTE;

                novo.VALOR_MULTA = query1.Sum(_ => _.VALOR_MULTA);
                novo.PERC_JUROS_DIA = 0;

                novo.CODIGO_EMITENTE = ID_EMPRESA;
                novo.ID_PLANO = ID_PLANO;
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

                ctx.Transaction.Commit();
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                ctx.Transaction.Rollback();
                throw ex;
            }
        }

        public void Dispose()
        {
            ctx.Connection.Close();
        }
    }
}