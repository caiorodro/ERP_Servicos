using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.Data.Linq;

using Doran_Base.Auditoria;
using Doran_Base;
using System.Data;
using System.Configuration;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Recebimento_Compra : IDisposable
    {
        private decimal ID_USUARIO { get; set; }

        public Doran_Recebimento_Compra(decimal _ID_USUARIO)
        {
            ID_USUARIO = _ID_USUARIO;
        }

        public List<List<object>> Salva_Recebimento(List<Dictionary<string, object>> LINHAS)
        {
            List<decimal> NUMERO_PEDIDO_COMPRA = new List<decimal>();
            List<decimal> NUMERO_ITEM_COMPRA = new List<decimal>();
            List<decimal> NUMERO_RECEBIMENTO = new List<decimal>();

            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    foreach (Dictionary<string, object> CUSTO in LINHAS)
                    {
                        if (Convert.ToDecimal(CUSTO["ID_LOCAL"]) == 0)
                            throw new Exception("Um ou mais itens recebidos est&atilde; sem local definido<br />Selecione um local para armazenar a mercadoria");

                        NUMERO_PEDIDO_COMPRA.Add(Convert.ToDecimal(CUSTO["NUMERO_PEDIDO_COMPRA"]));
                        NUMERO_ITEM_COMPRA.Add(Convert.ToDecimal(CUSTO["NUMERO_ITEM_COMPRA"]));

                        if (Convert.ToDecimal(CUSTO["NUMERO_RECEBIMENTO"]) > 0)
                            NUMERO_RECEBIMENTO.Add(Convert.ToDecimal(CUSTO["NUMERO_RECEBIMENTO"]));

                        var recebimento = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                           orderby linha.NUMERO_RECEBIMENTO

                                           where linha.NUMERO_RECEBIMENTO == Convert.ToDecimal(CUSTO["NUMERO_RECEBIMENTO"])

                                           select linha).ToList();

                        ////////////////////

                        foreach (var item in recebimento)
                        {
                            /////////////////////////
                            decimal _peso = 0;

                            string QTDE_RECEBIDA = CUSTO["QTDE_RECEBIDA"].ToString().Replace(".", ",");

                            string peso = decimal.TryParse(CUSTO["PESO_RECEBIDO"].ToString(), out _peso) ?
                                CUSTO["PESO_RECEBIDO"].ToString() : _peso.ToString();

                            item.QTDE_RECEBIDA = Convert.ToDecimal(QTDE_RECEBIDA);
                            item.DATA_RECEBIMENTO = Convert.ToDateTime(CUSTO["DATA_RECEBIMENTO"]);
                            item.NUMERO_NF = Convert.ToDecimal(CUSTO["NUMERO_NF"]);
                            item.NUMERO_LOTE_RECEBIMENTO = CUSTO["NUMERO_LOTE_RECEBIMENTO"].ToString();

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_NUMERO_LOTE(ctx, ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.GetModifiedMembers(item),
                                ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.ToString(), CUSTO["NUMERO_LOTE_RECEBIMENTO"].ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        if (!recebimento.Any())
                        {
                            // Grava Estoque

                            decimal _NUMERO_RECEBIMENTO = 0;

                            decimal NUMERO_LOTE = BuscaUltimoLote(ctx);

                            string _NUMERO_LOTE = string.Concat(NUMERO_LOTE.ToString(), "/", DateTime.Today.Month.ToString().PadLeft(2, '0'),
                                    DateTime.Today.Year.ToString());

                            string QTDE_RECEBIDA = CUSTO["QTDE_RECEBIDA"].ToString().Replace(".", ",");

                            var PRECO_FINAL_CUSTO = (from linha in ctx.TB_PEDIDO_COMPRAs
                                                     orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                                     where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(CUSTO["NUMERO_PEDIDO_COMPRA"])
                                                     && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(CUSTO["NUMERO_ITEM_COMPRA"])
                                                     select linha.PRECO_FINAL_FORNECEDOR).ToList().First();

                            // Grava Recebimento de Compra

                            System.Data.Linq.Table<Doran_Servicos_ORM.TB_RECEBIMENTO_PEDIDO_COMPRA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_RECEBIMENTO_PEDIDO_COMPRA>();

                            Doran_Servicos_ORM.TB_RECEBIMENTO_PEDIDO_COMPRA novo = new Doran_Servicos_ORM.TB_RECEBIMENTO_PEDIDO_COMPRA();

                            decimal _peso = 0;

                            string peso = decimal.TryParse(CUSTO["PESO_RECEBIDO"].ToString(), out _peso) ?
                                CUSTO["PESO_RECEBIDO"].ToString() : _peso.ToString();

                            novo.NUMERO_PEDIDO_COMPRA = Convert.ToDecimal(CUSTO["NUMERO_PEDIDO_COMPRA"]);
                            novo.NUMERO_ITEM_COMPRA = Convert.ToDecimal(CUSTO["NUMERO_ITEM_COMPRA"]);
                            novo.QTDE_RECEBIDA = Convert.ToDecimal(QTDE_RECEBIDA);
                            novo.DATA_RECEBIMENTO = Convert.ToDateTime(CUSTO["DATA_RECEBIMENTO"]);
                            novo.NUMERO_NF = Convert.ToDecimal(CUSTO["NUMERO_NF"]);
                            novo.NUMERO_LOTE_RECEBIMENTO = _NUMERO_LOTE;

                            if (Convert.ToDecimal(CUSTO["ID_LOCAL"]) == 0)
                                novo.ID_LOCAL = null;
                            else
                                novo.ID_LOCAL = Convert.ToDecimal(CUSTO["ID_LOCAL"]);

                            novo.NUMERO_LOTE = NUMERO_LOTE;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_NUMERO_LOTE(ctx, novo, Entidade.ToString(), _NUMERO_LOTE, ID_USUARIO);

                            ctx.SubmitChanges();

                            // Atualiza Numero Lote

                            _NUMERO_RECEBIMENTO = novo.NUMERO_RECEBIMENTO;

                            NUMERO_RECEBIMENTO.Add(_NUMERO_RECEBIMENTO);
                        }
                    }

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }

            return AtualizaStatusPedido(NUMERO_PEDIDO_COMPRA, NUMERO_ITEM_COMPRA, NUMERO_RECEBIMENTO);
        }

        public void Grava_Local_do_Lote(decimal NUMERO_RECEBIMENTO, decimal ID_LOCAL)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                             where linha.NUMERO_RECEBIMENTO == NUMERO_RECEBIMENTO
                             select linha).ToList();

                foreach (var item in query)
                {
                    if (ID_LOCAL == 0)
                        item.ID_LOCAL = null;
                    else
                        item.ID_LOCAL = ID_LOCAL;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.GetModifiedMembers(item),
                       ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();
            }
        }

        public List<List<object>> Deleta_Recebimento(decimal NUMERO_RECEBIMENTO)
        {
            List<decimal> NUMERO_PEDIDO_COMPRA = new List<decimal>();
            List<decimal> NUMERO_ITEM_COMPRA = new List<decimal>();
            List<decimal> _NUMERO_RECEBIMENTO = new List<decimal>();

            _NUMERO_RECEBIMENTO.Add(NUMERO_RECEBIMENTO);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                // Fazer a abertura do banco na construção da classe
                string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var query = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                 where linha.NUMERO_RECEBIMENTO == NUMERO_RECEBIMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        NUMERO_PEDIDO_COMPRA.Add((decimal)item.NUMERO_PEDIDO_COMPRA);
                        NUMERO_ITEM_COMPRA.Add((decimal)item.NUMERO_ITEM_COMPRA);

                        ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete_NUMERO_LOTE(ctx, item, ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs.ToString(),
                            item.NUMERO_LOTE_RECEBIMENTO.Trim(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }

            return AtualizaStatusPedido(NUMERO_PEDIDO_COMPRA, NUMERO_ITEM_COMPRA);
        }

        public string Recebimentos(List<decimal> NUMERO_PEDIDO_COMPRA, List<decimal> NUMERO_ITEM_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DataTable dtFinal = new DataTable("Tabela");

                for (int i = 0; i < NUMERO_PEDIDO_COMPRA.Count; i++)
                {
                    var query = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA, linha.DATA_RECEBIMENTO descending
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                 && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]

                                 select new
                                 {
                                     linha.NUMERO_RECEBIMENTO,
                                     linha.NUMERO_PEDIDO_COMPRA,
                                     linha.NUMERO_ITEM_COMPRA,
                                     linha.TB_PEDIDO_COMPRA.TB_PRODUTO.CODIGO_PRODUTO,
                                     linha.TB_PEDIDO_COMPRA.TB_PRODUTO.DESCRICAO_PRODUTO,
                                     linha.TB_PEDIDO_COMPRA.QTDE_ITEM_COMPRA,
                                     linha.DATA_RECEBIMENTO,
                                     linha.NUMERO_NF,
                                     linha.QTDE_RECEBIDA,
                                     linha.PESO_RECEBIDO,
                                     linha.NUMERO_LOTE_RECEBIMENTO,
                                     linha.ID_LOCAL
                                 });

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

                    if (dtFinal.Columns.Count == 0)
                        dtFinal = dt.Copy();
                    else
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            dtFinal.ImportRow(dr);
                        }
                    }
                }

                System.IO.StringWriter tr = new System.IO.StringWriter();
                dtFinal.WriteXml(tr);

                return tr.ToString();
            }
        }

        private decimal BuscaUltimoLote(DataContext ctx)
        {
            var ULTIMO_LOTE = (from linha in ctx.GetTable<TB_RECEBIMENTO_PEDIDO_COMPRA>()
                               orderby linha.NUMERO_LOTE descending

                               where linha.NUMERO_LOTE > 0

                               select linha.NUMERO_LOTE).Take(1).ToList();

            return ULTIMO_LOTE.Any() ? (decimal)ULTIMO_LOTE.First() + 1 : 1;
        }

        private bool Verifica_Associacao_Venda(decimal NUMERO_ITEM_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                bool retorno = false;
                decimal NUMERO_PEDIDO_COMPRA = 0;

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_ITEM_COMPRA

                             where linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA

                             select new
                             {
                                 linha.NUMERO_PEDIDO_COMPRA,
                                 linha.NUMERO_PEDIDO_VENDA,
                                 linha.NUMERO_ITEM_VENDA
                             }).ToList();

                foreach (var item in query)
                {
                    NUMERO_PEDIDO_COMPRA = item.NUMERO_PEDIDO_COMPRA;

                    if (item.NUMERO_PEDIDO_VENDA > 0)
                        retorno = true;
                }

                return retorno;
            }
        }

        private string BuscaNovoLote()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal NUMERO_LOTE = 0;

                int i = 0;

                while (true)
                {
                    i++;

                    var query = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_LOTE_RECEBIMENTO descending

                                 select linha.NUMERO_LOTE_RECEBIMENTO).Take(i).ToList();

                    if (!query.Any()) break;

                    if (i > query.Count) break;

                    if (decimal.TryParse(query.Last().Trim(), out NUMERO_LOTE))
                    {
                        NUMERO_LOTE = Convert.ToDecimal(query.Last().Trim());
                        NUMERO_LOTE++;
                        break;
                    }
                }

                if (NUMERO_LOTE == 0)
                    NUMERO_LOTE = 1;

                return NUMERO_LOTE.ToString();
            }
        }

        private List<List<object>> AtualizaStatusPedido(List<decimal> NUMERO_PEDIDO_COMPRA, List<decimal> NUMERO_ITEM_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                List<List<object>> retorno = new List<List<object>>();

                for (int i = 0; i < NUMERO_PEDIDO_COMPRA.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                 && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                 select linha.QTDE_ITEM_COMPRA).ToList();

                    decimal QTDE_ITEM_COMPRA = 0;

                    foreach (var item in query)
                        QTDE_ITEM_COMPRA = (decimal)item;

                    var TotalRecebido = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                         orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                         where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                         && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                         select linha.QTDE_RECEBIDA).Sum();

                    decimal _status = TotalRecebido < QTDE_ITEM_COMPRA ? 3 : 4;

                    if (!TotalRecebido.HasValue)
                        _status = 2;

                    var query2 = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                  where linha.STATUS_ESPECIFICO_ITEM_COMPRA == _status
                                  select linha).ToList();

                    List<object> retorno1 = new List<object>();

                    foreach (var item in query2)
                    {
                        retorno1.Add(item.CODIGO_STATUS_COMPRA);
                        retorno1.Add(item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.COR_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.STATUS_ESPECIFICO_ITEM_COMPRA);
                    }

                    retorno1.Add(TotalRecebido.HasValue ? TotalRecebido : 0);

                    retorno1.Add(TotalRecebido.HasValue ? 1 : 0);

                    var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                  orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                  where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                  && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                  select linha).ToList();

                    foreach (var item in query1)
                    {
                        item.STATUS_ITEM_COMPRA = (decimal)retorno1[0];

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                           ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    retorno.Add(retorno1);
                }

                ctx.SubmitChanges();

                return retorno;
            }
        }

        private List<List<object>> AtualizaStatusPedido(List<decimal> NUMERO_PEDIDO_COMPRA, List<decimal> NUMERO_ITEM_COMPRA,
            List<decimal> NUMERO_RECEBIMENTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                List<decimal> ITEM_COMPRA = NUMERO_ITEM_COMPRA.Distinct().ToList();

                for (int i = 0; i < ITEM_COMPRA.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_ITEM_COMPRA == ITEM_COMPRA[i]
                                 select new
                                 {
                                     linha.NUMERO_PEDIDO_COMPRA,
                                     linha.NUMERO_ITEM_COMPRA,
                                     linha.ID_PRODUTO_COMPRA,
                                     linha.QTDE_ITEM_COMPRA
                                 }).ToList();

                    foreach (var item in query)
                    {
                        var QTDE_RECEBIDA = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                             where linha.NUMERO_RECEBIMENTO == NUMERO_RECEBIMENTO[i]
                                             select linha.QTDE_RECEBIDA).Sum();

                        var TOTAL_QTDE_RECEBIDA = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                   where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                                   && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                                   select linha.QTDE_RECEBIDA).Sum();

                        decimal? ID_LOCAL_RECEBIMENTO = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                         where linha.NUMERO_RECEBIMENTO == NUMERO_RECEBIMENTO[i]
                                                         select linha).Any() ?

                                                        (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                         where linha.NUMERO_RECEBIMENTO == NUMERO_RECEBIMENTO[i]
                                                         select linha.ID_LOCAL).First() : null;

                        var ORCAMENTO = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs

                                         where (linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                        && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA)

                                         select new
                                         {
                                             linha.TB_PEDIDO_VENDA.NUMERO_ORCAMENTO,
                                             linha.TB_PEDIDO_VENDA.NUMERO_ITEM_ORCAMENTO
                                         }).ToList();

                        var QTDE_ASSOCIADA_VENDA = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs

                                                    where (linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                                    && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA)

                                                    select linha.TB_PEDIDO_VENDA.QTDE_PRODUTO_ITEM_PEDIDO).Sum();

                        QTDE_ASSOCIADA_VENDA = QTDE_ASSOCIADA_VENDA.HasValue ? QTDE_ASSOCIADA_VENDA : 0;

                        if (QTDE_ASSOCIADA_VENDA > 0)
                        {
                            decimal QTDE_ASSOCIADA_VENDA_ORIGINAL = QTDE_ASSOCIADA_VENDA.Value;

                            if (QTDE_ASSOCIADA_VENDA > QTDE_RECEBIDA)
                                QTDE_ASSOCIADA_VENDA = QTDE_RECEBIDA;

                            var NUMERO_LOTE = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                               orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                               where (linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                               && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA)
                                               select new { linha.NUMERO_LOTE_RECEBIMENTO }).ToList();

                            var NR_DE_RECEBIMENTOS = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                      where (linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                                        && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA)
                                                      select linha).Count();

                            if (TOTAL_QTDE_RECEBIDA > QTDE_ASSOCIADA_VENDA_ORIGINAL)
                            {
                                if (TOTAL_QTDE_RECEBIDA < item.QTDE_ITEM_COMPRA || TOTAL_QTDE_RECEBIDA > item.QTDE_ITEM_COMPRA)
                                {
                                    QTDE_ASSOCIADA_VENDA -= (TOTAL_QTDE_RECEBIDA -= QTDE_ASSOCIADA_VENDA_ORIGINAL);

                                    if (NR_DE_RECEBIMENTOS == 1 && QTDE_ASSOCIADA_VENDA_ORIGINAL > QTDE_RECEBIDA)
                                        QTDE_ASSOCIADA_VENDA = QTDE_ASSOCIADA_VENDA_ORIGINAL;
                                }
                                else
                                    QTDE_ASSOCIADA_VENDA = QTDE_RECEBIDA - (TOTAL_QTDE_RECEBIDA - QTDE_ASSOCIADA_VENDA_ORIGINAL);
                            }

                            if ((TOTAL_QTDE_RECEBIDA - QTDE_RECEBIDA) == QTDE_ASSOCIADA_VENDA_ORIGINAL)
                                QTDE_ASSOCIADA_VENDA = 0;

                            var STATUS_RECEBIDO = (from linha in ctx.TB_STATUS_PEDIDOs
                                                   where linha.STATUS_ESPECIFICO == 10
                                                   select linha.CODIGO_STATUS_PEDIDO).Any() ?

                                                   (from linha in ctx.TB_STATUS_PEDIDOs
                                                    where linha.STATUS_ESPECIFICO == 10
                                                    select linha.CODIGO_STATUS_PEDIDO).First() : 0;

                        }
                    }
                }

                List<List<object>> retorno = new List<List<object>>();

                for (int i = 0; i < NUMERO_PEDIDO_COMPRA.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                 && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                 select linha.QTDE_ITEM_COMPRA).ToList();

                    decimal QTDE_ITEM_COMPRA = 0;

                    foreach (var item in query)
                        QTDE_ITEM_COMPRA = (decimal)item;

                    var TotalRecebido = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                         orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                         where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                         && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                         select linha.QTDE_RECEBIDA).Sum();

                    decimal _status = TotalRecebido < QTDE_ITEM_COMPRA ? 3 : 4;

                    if (!TotalRecebido.HasValue)
                        _status = 2;

                    var query2 = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                  where linha.STATUS_ESPECIFICO_ITEM_COMPRA == _status
                                  select linha).ToList();

                    List<object> retorno1 = new List<object>();

                    decimal CODIGO_STATUS_COMPRA = 0;

                    foreach (var item in query2)
                    {
                        CODIGO_STATUS_COMPRA = item.CODIGO_STATUS_COMPRA;

                        retorno1.Add(item.CODIGO_STATUS_COMPRA);
                        retorno1.Add(item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.COR_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                        retorno1.Add(item.STATUS_ESPECIFICO_ITEM_COMPRA);
                    }

                    retorno1.Add(TotalRecebido.HasValue ? TotalRecebido : 0);

                    retorno1.Add(TotalRecebido.HasValue ? 1 : 0);

                    var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                  where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA[i]
                                  && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA[i]
                                  select linha).ToList();

                    foreach (var item in query1)
                    {
                        item.STATUS_ITEM_COMPRA = CODIGO_STATUS_COMPRA;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                           ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    retorno.Add(retorno1);
                }

                ctx.SubmitChanges();

                return retorno;
            }
        }

        public void Grava_Qtde_NF(List<decimal> NUMEROS_ITEM_COMPRA, List<decimal> QTDE_NF)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal _fornecedor = 0;

                for (int i = 0; i < NUMEROS_ITEM_COMPRA.Count; i++)
                {
                    var fornecedor = (from linha in ctx.TB_PEDIDO_COMPRAs
                                      where linha.NUMERO_ITEM_COMPRA == NUMEROS_ITEM_COMPRA[i]
                                      select linha.CODIGO_FORNECEDOR).ToList().First();

                    if (_fornecedor == 0)
                        _fornecedor = (decimal)fornecedor;

                    if (_fornecedor != fornecedor)
                        throw new Exception("Selecione itens do mesmo fornecedor para gravar a(s) Qtde(s) da NF");

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_ITEM_COMPRA == NUMEROS_ITEM_COMPRA[i]
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.ID_USUARIO_QTDE_NF = ID_USUARIO;
                        item.QTDE_NF_ITEM_COMPRA = QTDE_NF[i];

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}