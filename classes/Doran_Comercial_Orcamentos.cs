using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Configuration;
using System.Globalization;
using Doran_Servicos_ORM;

using Doran_Base.Auditoria;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Comercial_Orcamentos : IDisposable
    {
        private decimal NUMERO_ORCAMENTO;
        private string CHAVE_ORCAMENTO;
        private decimal ID_USUARIO { get; set; }

        public Doran_Comercial_Orcamentos(decimal _NUMERO_ORCAMENTO, decimal _ID_USUARIO)
        {
            NUMERO_ORCAMENTO = _NUMERO_ORCAMENTO;
            CHAVE_ORCAMENTO = "";
            ID_USUARIO = _ID_USUARIO;
        }

        public Dictionary<string, object> Grava_Novo_Item_Orcamento(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal CODIGO_CLIENTE = decimal.TryParse(dados["CODIGO_CLIENTE"].ToString(), out CODIGO_CLIENTE) ?
                                Convert.ToDecimal(dados["CODIGO_CLIENTE"]) : 0;

                    if (CODIGO_CLIENTE > 0)
                    {
                        decimal CLIENTE_BLOQUEADO = (from linha in ctx.TB_CLIENTEs
                                                     where linha.ID_CLIENTE == CODIGO_CLIENTE
                                                     select linha).Any() ?

                                                     (from linha in ctx.TB_CLIENTEs
                                                      where linha.ID_CLIENTE == CODIGO_CLIENTE
                                                      select linha.CLIENTE_BLOQUEADO).First().HasValue ?

                                                     (from linha in ctx.TB_CLIENTEs
                                                      where linha.ID_CLIENTE == CODIGO_CLIENTE
                                                      select linha.CLIENTE_BLOQUEADO).First().Value : 0 : 0;

                        if (CLIENTE_BLOQUEADO == 1)
                            throw new Exception("Cliente bloqueado");
                    }

                    if (Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]) == 0)
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_ORCAMENTO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_ORCAMENTO_VENDA>();

                        Doran_Servicos_ORM.TB_ORCAMENTO_VENDA novo = new Doran_Servicos_ORM.TB_ORCAMENTO_VENDA();

                        string CHAVE = CRIA_CHAVE_ORCAMENTO();

                        if (CHAVE.Length > 100)
                            CHAVE = CHAVE.Substring(0, 100);

                        CHAVE_ORCAMENTO = CHAVE;

                        novo.DATA_ORCAMENTO = DateTime.Now;
                        novo.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);
                        novo.CODIGO_VENDEDOR = Convert.ToDecimal(dados["CODIGO_VENDEDOR"]);
                        novo.CONTATO_ORCAMENTO = dados["CONTATO_ORCAMENTO"].ToString();
                        novo.EMAIL_CONTATO = dados["EMAIL_CONTATO"].ToString();
                        novo.NUMERO_REVISAO = 1;
                        novo.TELEFONE_CONTATO = dados["TELEFONE_CONTATO"].ToString();
                        novo.TEXTO_PROPOSTA = "";
                        novo.CHAVE_ORCAMENTO = CHAVE;
                        novo.ID_UF_ORCAMENTO = Convert.ToDecimal(dados["ID_UF_ORCAMENTO"]);
                        novo.OBS_ORCAMENTO = "";
                        novo.VALIDADE_ORCAMENTO = Convert.ToDateTime(dados["VALIDADE_ORCAMENTO"]);
                        novo.OBS_NF_ORCAMENTO = "";

                        if (CODIGO_CLIENTE > 0)
                            novo.CODIGO_CLIENTE_ORCAMENTO = CODIGO_CLIENTE;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    /////////////////

                    if (Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]) == 0)
                    {
                        var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                     where linha.CHAVE_ORCAMENTO == CHAVE_ORCAMENTO
                                     select new
                                     {
                                         linha.NUMERO_ORCAMENTO
                                     }).ToList();

                        foreach (var item in query)
                            NUMERO_ORCAMENTO = item.NUMERO_ORCAMENTO;
                    }

                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_ITEM_ORCAMENTO_VENDA> Entidade1 = ctx.GetTable<Doran_Servicos_ORM.TB_ITEM_ORCAMENTO_VENDA>();

                    Doran_Servicos_ORM.TB_ITEM_ORCAMENTO_VENDA novo1 = new Doran_Servicos_ORM.TB_ITEM_ORCAMENTO_VENDA();

                    var _CODIGO_PRODUTO = (from linha in ctx.TB_PRODUTOs
                                           orderby linha.ID_PRODUTO

                                           where linha.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])

                                           select linha.CODIGO_PRODUTO).ToList().First();

                    novo1.NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
                    novo1.ID_PRODUTO = Convert.ToDecimal(dados["ID_PRODUTO"]);
                    novo1.CODIGO_PRODUTO = _CODIGO_PRODUTO;
                    novo1.QTDE_PRODUTO = Convert.ToDecimal(dados["QTDE_PRODUTO"]);
                    novo1.PRECO_PRODUTO = Convert.ToDecimal(dados["PRECO_PRODUTO"]);
                    novo1.UNIDADE_PRODUTO = dados["UNIDADE_PRODUTO"].ToString();
                    novo1.VALOR_TOTAL = Convert.ToDecimal(dados["VALOR_TOTAL"]);
                    novo1.ALIQ_ISS = Convert.ToDecimal(dados["ALIQ_ISS"]);
                    novo1.TIPO_DESCONTO = Convert.ToDecimal(dados["TIPO_DESCONTO"]);
                    novo1.VALOR_DESCONTO = Convert.ToDecimal(dados["VALOR_DESCONTO"]);
                    novo1.DATA_ENTREGA = Convert.ToDateTime(dados["DATA_ENTREGA"]);
                    novo1.OBS_ITEM_ORCAMENTO = dados["OBS_ITEM_ORCAMENTO"].ToString();
                    novo1.NUMERO_PEDIDO_VENDA = 0;
                    novo1.NAO_GERAR_PEDIDO = 0;
                    novo1.PROGRAMACAO_ITEM_ORCAMENTO = 0;
                    novo1.DESCRICAO_PRODUTO_ITEM_ORCAMENTO = dados["DESCRICAO_PRODUTO_ITEM_ORCAMENTO"].ToString();
                    novo1.ITEM_APROVADO = 0;

                    novo1.ENDERECO_INICIAL_ITEM_ORCAMENTO = dados["ENDERECO_INICIAL_ITEM_ORCAMENTO"].ToString();
                    novo1.NUMERO_INICIAL_ITEM_ORCAMENTO = dados["NUMERO_INICIAL_ITEM_ORCAMENTO"].ToString();
                    novo1.COMPL_INICIAL_ITEM_ORCAMENTO = dados["COMPL_INICIAL_ITEM_ORCAMENTO"].ToString();
                    novo1.CEP_INICIAL_ITEM_ORCAMENTO = dados["CEP_INICIAL_ITEM_ORCAMENTO"].ToString();
                    novo1.CIDADE_INICIAL_ITEM_ORCAMENTO = dados["CIDADE_INICIAL_ITEM_ORCAMENTO"].ToString();
                    novo1.ESTADO_INICIAL_ITEM_ORCAMENTO = dados["ESTADO_INICIAL_ITEM_ORCAMENTO"].ToString();

                    novo1.ENDERECO_FINAL_ITEM_ORCAMENTO = dados["ENDERECO_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.NUMERO_FINAL_ITEM_ORCAMENTO = dados["NUMERO_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.COMPL_FINAL_ITEM_ORCAMENTO = dados["COMPL_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.CEP_FINAL_ITEM_ORCAMENTO = dados["CEP_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.CIDADE_FINAL_ITEM_ORCAMENTO = dados["CIDADE_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.ESTADO_FINAL_ITEM_ORCAMENTO = dados["ESTADO_FINAL_ITEM_ORCAMENTO"].ToString();
                    novo1.DISTANCIA_EM_METROS = Convert.ToDecimal(dados["DISTANCIA_EM_METROS"]);

                    Entidade1.InsertOnSubmit(novo1);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), ID_USUARIO);

                    ctx.SubmitChanges();

                    // Custo Financeiro
                    var query8 = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                  orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM descending
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                  select linha).ToList().First();

                    decimal PERCENTUAL_FINANCEIRO = (decimal)query8.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.CUSTO_FINANCEIRO;

                    decimal NUMERO_ITEM = query8.NUMERO_ITEM;

                    var query7 = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                  && linha.NUMERO_ITEM == NUMERO_ITEM
                                  select linha).ToList();

                    foreach (var item in query7)
                    {
                        item.ITEM_APROVADO = 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }

                    var query5 = (from linha in ctx.TB_CUSTO_VENDAs
                                  where linha.CUSTO_PERMANENTE == 1
                                  select linha).ToList();

                    var lista = query5.ToList();

                    decimal CUSTO_FINANCEIRO = 0;

                    foreach (TB_CUSTO_VENDA tabela in lista)
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA>();

                        Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA novo = new Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA();

                        novo.NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
                        novo.NUMERO_ITEM_ORCAMENTO = NUMERO_ITEM;
                        novo.NUMERO_CUSTO_VENDA = tabela.ID_CUSTO_VENDA;
                        novo.CUSTO_ITEM_ORCAMENTO = 0;

                        CUSTO_FINANCEIRO += (decimal)novo.CUSTO_ITEM_ORCAMENTO * (PERCENTUAL_FINANCEIRO / 100);

                        novo.PREVISAO_ENTREGA = DateTime.Today.AddDays(1);

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
                    }

                    var query6 = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO

                                  select linha).ToList();

                    decimal? VALOR_TOTAL_PRODUTOS = query6.Sum(s => s.VALOR_TOTAL);

                    VALOR_TOTAL_PRODUTOS = VALOR_TOTAL_PRODUTOS.HasValue ? VALOR_TOTAL_PRODUTOS : 0;

                    foreach (var item in query6)
                    {
                        decimal? PRECO_FINAL = item.TIPO_DESCONTO == 0 ? item.PRECO_PRODUTO * (1 - (item.VALOR_DESCONTO / 100)) :
                            item.PRECO_PRODUTO - item.VALOR_DESCONTO;
                        item.ITEM_APROVADO = 0;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
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

            return Calcula_Totais_Orcamento();
        }

        public Dictionary<string, object> Atualiza_Item_Orcamento(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal CODIGO_CLIENTE = decimal.TryParse(dados["CODIGO_CLIENTE"].ToString(), out CODIGO_CLIENTE) ?
                    Convert.ToDecimal(dados["CODIGO_CLIENTE"]) : 0;

                /////////////////

                var query4 = (from item in ctx.TB_ITEM_ORCAMENTO_VENDAs
                              where item.NUMERO_ORCAMENTO == Convert.ToDecimal(dados["NUMERO_ORCAMENTO"])
                              && item.NUMERO_ITEM == Convert.ToDecimal(dados["NUMERO_ITEM"])
                              select item).ToList();

                if (query4.Count() == 0)
                    throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o item de or&ccedil;amento com o numero do or&ccedil;amento [" + dados["NUMERO_ORCAMENTO"].ToString() + "]");

                bool recalcula = false;

                DateTime entrega = new DateTime();

                if (!DateTime.TryParse(dados["DATA_ENTREGA"].ToString(), out entrega))
                {
                    throw new Exception("Data de entrega inv&aacute;lida");
                }

                foreach (var item_orcamento in query4)
                {
                    if (item_orcamento.PRECO_PRODUTO != Convert.ToDecimal(dados["PRECO_PRODUTO"]))
                        recalcula = true;

                    item_orcamento.NUMERO_ORCAMENTO = Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]);
                    item_orcamento.ID_PRODUTO = Convert.ToDecimal(dados["ID_PRODUTO"]);
                    item_orcamento.CODIGO_PRODUTO = dados["CODIGO_PRODUTO"].ToString();
                    item_orcamento.QTDE_PRODUTO = Convert.ToDecimal(dados["QTDE_PRODUTO"]);
                    item_orcamento.PRECO_PRODUTO = Convert.ToDecimal(dados["PRECO_PRODUTO"]);
                    item_orcamento.UNIDADE_PRODUTO = dados["UNIDADE_PRODUTO"].ToString();
                    item_orcamento.VALOR_TOTAL = Convert.ToDecimal(dados["VALOR_TOTAL"]);
                    item_orcamento.TIPO_DESCONTO = Convert.ToDecimal(dados["TIPO_DESCONTO"]);
                    item_orcamento.VALOR_DESCONTO = Convert.ToDecimal(dados["VALOR_DESCONTO"]);

                    item_orcamento.DATA_ENTREGA = Convert.ToDateTime(dados["DATA_ENTREGA"]);
                    item_orcamento.OBS_ITEM_ORCAMENTO = dados["OBS_ITEM_ORCAMENTO"].ToString();

                    item_orcamento.DESCRICAO_PRODUTO_ITEM_ORCAMENTO = dados["DESCRICAO_PRODUTO_ITEM_ORCAMENTO"].ToString();
                    item_orcamento.DISTANCIA_EM_METROS = Convert.ToDecimal(dados["DISTANCIA_EM_METROS"]);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item_orcamento),
                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);

                    var query1 = (from item in ctx.TB_ORCAMENTO_VENDAs
                                  where item.NUMERO_ORCAMENTO == Convert.ToDecimal(dados["NUMERO_ORCAMENTO"])
                                  select item).ToList();

                    foreach (var item in query1)
                    {
                        item.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);
                        item.CONTATO_ORCAMENTO = dados["CONTATO_ORCAMENTO"].ToString();
                        item.EMAIL_CONTATO = dados["EMAIL_CONTATO"].ToString();
                        item.TELEFONE_CONTATO = dados["TELEFONE_CONTATO"].ToString();
                        item.ID_UF_ORCAMENTO = Convert.ToDecimal(dados["ID_UF_ORCAMENTO"]);

                        if (dados.ContainsKey("CODIGO_CLIENTE"))
                        {
                            decimal CODIGO = decimal.TryParse(dados["CODIGO_CLIENTE"].ToString(), out CODIGO) ?
                                Convert.ToDecimal(dados["CODIGO_CLIENTE"]) : 0;

                            item.CODIGO_CLIENTE_ORCAMENTO = CODIGO;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();

                if (recalcula)
                    Recalcula_Custos(0);
            }

            return Calcula_Totais_Orcamento();
        }

        public Dictionary<string, object> Deleta_Item_Orcamento(decimal NUMERO_ITEM)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var pedido_gerado = (from linha in ctx.TB_PEDIDO_VENDAs
                                     where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                     && linha.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM
                                     select linha).Any();

                if (pedido_gerado)
                    throw new Exception("N&atilde;o &eacute; poss&iacute;vel deletar esse item.<br />J&aacute; foi gerado um item de pedido de venda para este item de or&ccedil;amento" +
                        "<br />Insira um novo item para substitu&iacute;-lo e gere o pedido somente com o item correto");

                var query1 = (from item in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                              where item.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO &&
                              item.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM
                              select item).ToList();

                foreach (var linha in query1)
                {
                    ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.DeleteOnSubmit(linha);
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                }

                var query = (from item in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where item.NUMERO_ITEM == NUMERO_ITEM
                             select item).ToList();

                foreach (var linha in query)
                {
                    ctx.TB_ITEM_ORCAMENTO_VENDAs.DeleteOnSubmit(linha);
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();

                Recalcula_Custos(0);
            }

            return Calcula_Totais_Orcamento();
        }

        public Dictionary<string, object> Calcula_Totais_Orcamento()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where item.NUMERO_ORCAMENTO == this.NUMERO_ORCAMENTO
                             select new
                             {
                                 item.NUMERO_ORCAMENTO,
                                 item.VALOR_TOTAL,
                                 item.ALIQ_ISS
                             }).ToList();

                decimal _total_orcamento = 0;
                decimal _valor_total = 0;
                decimal _valor_iss = 0;

                foreach (var item_orcamento in query)
                {
                    _total_orcamento += (decimal)item_orcamento.VALOR_TOTAL;
                    _valor_total += (decimal)item_orcamento.VALOR_TOTAL;
                    _valor_iss += Math.Round(item_orcamento.VALOR_TOTAL.Value * (item_orcamento.ALIQ_ISS.Value / 100), 2);
                }

                Dictionary<string, object> dados = new Dictionary<string, object>();
                dados.Add("NUMERO_ORCAMENTO", this.NUMERO_ORCAMENTO);
                dados.Add("VALOR_TOTAL", ((decimal)_valor_total).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ISS", ((decimal)_valor_iss).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("TOTAL_ORCAMENTO", ((decimal)_total_orcamento).ToString("c", CultureInfo.CurrentCulture));

                return dados;
            }
        }

        public Dictionary<string, object> Recalcula_Items_Orcamento(bool CALCULO_IVA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).ToList();

                foreach (var item in query)
                {
                    if (CALCULO_IVA)
                    {
                        using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                        {
                            decimal VALOR_TOTAL_ITEM_ORCAMENTO = (decimal)item.VALOR_TOTAL;
                            decimal VALOR_ISS = VALOR_TOTAL_ITEM_ORCAMENTO * (1 + (item.ALIQ_ISS.Value / 100));
                        }
                    }

                    /////////////////

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();
            }

            return Calcula_Totais_Orcamento();
        }

        public Dictionary<string, object> Grava_Contato_Orcamento(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).ToList();

                decimal COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);

                bool recalcula_custos = false;

                foreach (var item in query)
                {
                    if (clienteBloqueado(item.CODIGO_CLIENTE_ORCAMENTO))
                        throw new Exception("Cliente bloqueado");

                    item.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);

                    item.CONTATO_ORCAMENTO = dados["CONTATO_ORCAMENTO"].ToString().Trim().Length > 60 ?
                    dados["CONTATO_ORCAMENTO"].ToString().Trim().Substring(0, 60) : dados["CONTATO_ORCAMENTO"].ToString();

                    item.EMAIL_CONTATO = dados["EMAIL_CONTATO"].ToString();
                    item.TELEFONE_CONTATO = dados["TELEFONE_CONTATO"].ToString();
                    item.ID_UF_ORCAMENTO = Convert.ToDecimal(dados["ID_UF_ORCAMENTO"]);
                    item.CODIGO_VENDEDOR = Convert.ToDecimal(dados["CODIGO_VENDEDOR"]);

                    if (dados.ContainsKey("CODIGO_CLIENTE"))
                    {
                        decimal CODIGO = decimal.TryParse(dados["CODIGO_CLIENTE"].ToString(), out CODIGO) ?
                            Convert.ToDecimal(dados["CODIGO_CLIENTE"]) : 0;

                        item.CODIGO_CLIENTE_ORCAMENTO = CODIGO;
                    }

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);

                    ctx.SubmitChanges();
                }

                if (recalcula_custos)
                    Recalcula_Custos(0);
            }

            return Recalcula_Items_Orcamento(false);
        }

        public bool clienteBloqueado(decimal? CODIGO_CLIENTE)
        {
            bool retorno = false;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var cliente = (from linha in ctx.TB_CLIENTEs
                               where linha.ID_CLIENTE == CODIGO_CLIENTE
                               select linha).Any() ?

                               (from linha in ctx.TB_CLIENTEs
                                where linha.ID_CLIENTE == CODIGO_CLIENTE
                                select linha.CLIENTE_BLOQUEADO).First() : 0;

                if (cliente.HasValue)
                    if (cliente == 1)
                        retorno = true;
            }

            return retorno;
        }

        public List<object> Recalcula_Custos(decimal NUMERO_ITEM)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                // custo financeiro
                var PERCENTUAL_FINANCEIRO = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                             select linha).Any() ?

                                                 (from linha in ctx.TB_ORCAMENTO_VENDAs
                                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                                  select linha).First().TB_COND_PAGTO.CUSTO_FINANCEIRO :
                                             0;

                if (!PERCENTUAL_FINANCEIRO.HasValue)
                    PERCENTUAL_FINANCEIRO = 0;

                var items = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO

                             select linha).ToList();

                decimal CUSTO_TOTAL = 0;
                decimal MARGEM = 0;
                DateTime MAIOR_ENTREGA = new DateTime();

                decimal? CUSTO_FRETE = 0;
                decimal? VALOR_TOTAL_PRODUTOS = items.Sum(s => s.VALOR_TOTAL);

                VALOR_TOTAL_PRODUTOS = VALOR_TOTAL_PRODUTOS.HasValue ? VALOR_TOTAL_PRODUTOS : 0;

                List<object> retorno = new List<object>();
                
                // Custos de cada item
                foreach (var item in items)
                {
                    CUSTO_TOTAL = 0;

                    /////////////

                    MAIOR_ENTREGA = (DateTime)item.DATA_ENTREGA;

                    var custos = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                  && linha.NUMERO_ITEM_ORCAMENTO == item.NUMERO_ITEM
                                  select linha).Any() ?

                                  (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                   where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                   && linha.NUMERO_ITEM_ORCAMENTO == item.NUMERO_ITEM
                                   select linha.CUSTO_ITEM_ORCAMENTO).Sum() : 0;

                    var MaiorData = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                     where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                     && linha.NUMERO_ITEM_ORCAMENTO == item.NUMERO_ITEM
                                     select linha.PREVISAO_ENTREGA).Max();

                    if (MaiorData > MAIOR_ENTREGA)
                        MAIOR_ENTREGA = (DateTime)MaiorData;

                    CUSTO_TOTAL += custos.HasValue ? (decimal)custos : 0;

                    CUSTO_TOTAL = Math.Round(CUSTO_TOTAL * (1 + ((decimal)PERCENTUAL_FINANCEIRO / 100)), 4);

                    CUSTO_TOTAL += (decimal)CUSTO_FRETE;

                    decimal? PRECO_FINAL = item.TIPO_DESCONTO == 0 ? item.PRECO_PRODUTO * (1 - (item.VALOR_DESCONTO / 100)) :
                        item.PRECO_PRODUTO - item.VALOR_DESCONTO;

                    item.DATA_ENTREGA = MAIOR_ENTREGA;

                    item.ITEM_APROVADO = 0;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);

                    if (NUMERO_ITEM == 0)
                        CUSTO_TOTAL = 0;

                    if (item.PRECO_PRODUTO > (decimal)0.00)
                        MARGEM = CUSTO_TOTAL == 0 ? 0 : Math.Round(((decimal)item.PRECO_PRODUTO / CUSTO_TOTAL) * 100, 2);
                    else
                        MARGEM = 0;

                    if (item.NUMERO_ITEM == NUMERO_ITEM)
                    {
                        string DATA_ENTREGA = ApoioXML.TrataDataXML(MAIOR_ENTREGA);

                        retorno.Add(CUSTO_TOTAL);
                        retorno.Add(MARGEM);
                        retorno.Add(DATA_ENTREGA);
                        retorno.Add(item.PRECO_PRODUTO);
                    }
                }

                ctx.SubmitChanges();

                return retorno;
            }
        }

        public string CRIA_CHAVE_ORCAMENTO()
        {
            Th2_Seguranca.Principal seg = new Th2_Seguranca.Principal(Th2_Seguranca.classes.EncryptionAlgorithm.Des,
            ConfigurationManager.AppSettings["ID_Sistema"]);

            seg.CriptografaDados(string.Concat(ID_USUARIO.ToString(), DateTime.Now.ToString()));

            return seg.SenhaEncriptada_;
        }

        public static string Calcula_Total_Orcamento(decimal NUMERO_ORCAMENTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where item.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select new
                             {
                                 item.NUMERO_ORCAMENTO,
                                 item.VALOR_TOTAL
                             }).ToList();

                decimal _total_orcamento = 0;
                decimal _valor_total = 0;

                foreach (var item_orcamento in query)
                {
                    _total_orcamento += (decimal)item_orcamento.VALOR_TOTAL;
                    _valor_total += (decimal)item_orcamento.VALOR_TOTAL;
                }

                string retorno = _total_orcamento.ToString();
                retorno = retorno.Replace(",", ".");

                return retorno;
            }
        }

        public static void Calcula_Estatisticas_Vendedor(DateTime dt1, DateTime dt2, decimal ID_VENDEDOR,
            out decimal? pendentes, out decimal? pedidos, out decimal? vencidos)
        {
            pendentes = pedidos = vencidos = 0;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                pendentes = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO >= dt1
                             && linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO < dt2

                             && (linha.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == ID_VENDEDOR ||
                             ID_VENDEDOR == 0)

                             && linha.NUMERO_PEDIDO_VENDA == 0
                             && linha.TB_ORCAMENTO_VENDA.VALIDADE_ORCAMENTO >= DateTime.Now

                             select linha).Sum(p => p.VALOR_TOTAL);

                if (!pendentes.HasValue)
                    pendentes = 0;

                // Pedido Fechado
                pedidos = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                           where linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO >= dt1
                           && linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO < dt2

                           && (linha.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == ID_VENDEDOR ||
                           ID_VENDEDOR == 0)

                           && linha.NUMERO_PEDIDO_VENDA > 0

                           select linha).Sum(p => p.VALOR_TOTAL);

                if (!pedidos.HasValue)
                    pedidos = 0;


                // Orçamentos Vencidos
                vencidos = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                            where linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO >= dt1
                            && linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO < dt2

                             && (linha.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == ID_VENDEDOR ||
                             ID_VENDEDOR == 0)

                            && linha.NUMERO_PEDIDO_VENDA == 0
                            && linha.TB_ORCAMENTO_VENDA.VALIDADE_ORCAMENTO < DateTime.Now

                            select linha).Sum(p => p.VALOR_TOTAL);

                if (!vencidos.HasValue)
                    vencidos = 0;
            }
        }

        public static string Calcula_Estatisticas_Orcamentos(decimal GERENTE_COMERCIAL, decimal SUPERVISOR_VENDAS, decimal ID_VENDEDOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = DateTime.Today.AddDays(-(DateTime.Today.Day - 1));
                DateTime dt2 = dt1.AddMonths(1);

                dt1 = dt1.AddMonths(-3);
                dt2 = dt2.AddMonths(-3);

                List<string> mes = new List<string>();
                List<decimal> total_pendente = new List<decimal>();
                List<decimal> total_pedido = new List<decimal>();
                List<decimal> total_vencido = new List<decimal>();

                for (int i = 0; i < 4; i++)
                {
                    if (SUPERVISOR_VENDAS == 1)
                    {
                        var lideres = (from linha in ctx.TB_VENDEDOREs
                                       where linha.SUPERVISOR_LIDER == ID_VENDEDOR
                                       select new
                                       {
                                           linha.ID_VENDEDOR,
                                           linha.NOME_VENDEDOR
                                       }).ToList();

                        List<string> Lider = new List<string>();
                        decimal soma_pedentes = 0;
                        decimal soma_pedidos = 0;
                        decimal soma_vencidos = 0;

                        foreach (var lider in lideres)
                        {
                            decimal? pendentes;
                            decimal? pedidos;
                            decimal? vencidos;

                            Calcula_Estatisticas_Vendedor(dt1, dt2, (decimal)lider.ID_VENDEDOR, out pendentes, out pedidos, out vencidos);

                            soma_pedentes += (decimal)pendentes;
                            soma_pedidos += (decimal)pedidos;
                            soma_vencidos += (decimal)vencidos;
                        }

                        mes.Add(string.Concat(dt1.Month.ToString().PadLeft(2, '0'), "/", dt1.Year.ToString()));

                        total_pendente.Add(soma_pedentes);
                        total_pedido.Add(soma_pedidos);
                        total_vencido.Add(soma_vencidos);

                        dt1 = dt1.AddMonths(1);
                        dt2 = dt2.AddMonths(1);
                    }
                    else
                    {
                        decimal? pendentes;
                        decimal? pedidos;
                        decimal? vencidos;

                        Calcula_Estatisticas_Vendedor(dt1, dt2, GERENTE_COMERCIAL == 1 ? 0 : ID_VENDEDOR, out pendentes, out pedidos, out vencidos);

                        mes.Add(string.Concat(dt1.Month.ToString().PadLeft(2, '0'), "/", dt1.Year.ToString()));

                        total_pendente.Add((decimal)pendentes);
                        total_pedido.Add((decimal)pedidos);
                        total_vencido.Add((decimal)vencidos);

                        dt1 = dt1.AddMonths(1);
                        dt2 = dt2.AddMonths(1);
                    }
                }

                string retorno = "[";

                for (int i = 0; i < mes.Count; i++)
                {
                    string _pendentes = total_pendente[i].ToString();
                    _pendentes = _pendentes.Replace(",", ".");

                    string _pedidos = total_pedido[i].ToString();
                    _pedidos = _pedidos.Replace(",", ".");

                    string _vencidos = total_vencido[i].ToString();
                    _vencidos = _vencidos.Replace(",", ".");

                    retorno += "{ mes_ano: '" + mes[i] + "', pendentes: " + _pendentes + ", pedidos: " + _pedidos + ", vencidos: " + _vencidos + " },";
                }

                retorno = retorno.Substring(0, retorno.Length - 1) + "]";

                return retorno;
            }
        }

        public static string Calcula_Orcamentos_Fechados(DateTime dt1, DateTime dt2, decimal LIDER, decimal CODIGO_CLIENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var vendedores = (from linha in ctx.TB_VENDEDOREs
                                  where linha.SUPERVISOR_LIDER == LIDER
                                  select new
                                  {
                                      linha.ID_VENDEDOR
                                  }).ToList();

                decimal TOTAL = 0;

                foreach (var item in vendedores)
                {
                    var total = (from linha in ctx.TB_PEDIDO_VENDAs
                                 orderby linha.DATA_PEDIDO
                                 where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2)
                                 && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == item.ID_VENDEDOR
                                 && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 1 && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                 select linha).Sum(f => f.VALOR_TOTAL_ITEM_PEDIDO);

                    if (total.HasValue) { TOTAL += (decimal)total; }
                }

                string retorno = TOTAL.ToString();

                retorno = retorno.Replace(",", ".");

                return retorno;
            }
        }

        public string Monta_Vencimentos_ORCAMENTO()
        {
            string retorno = "";

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                CultureInfo cultura = CultureInfo.CurrentCulture;
                string[] dias = cultura.DateTimeFormat.DayNames;

                decimal TOTAL_NF = 0;
                decimal CODIGO_CP = 0;
                decimal TOTAL_PRODUTOS = 0;

                var query = (from nota in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where nota.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select new
                             {
                                 nota.TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO,
                                 nota.VALOR_TOTAL
                             }).ToList();


                TOTAL_PRODUTOS = query.Sum(s => s.VALOR_TOTAL).HasValue ?
                    (decimal)query.Sum(s => s.VALOR_TOTAL) : 0;

                TOTAL_NF = TOTAL_PRODUTOS;

                CODIGO_CP = (decimal)query.First().CODIGO_COND_PAGTO;

                Dictionary<DateTime, decimal> Parcelas = Doran_Emite_Nota_Saida.Calcula_Vencimentos_e_Valores(TOTAL_PRODUTOS, TOTAL_NF, CODIGO_CP);

                DataTable dt = new DataTable("Tabela");

                dt.Columns.Add("VENCIMENTO", typeof(DateTime));
                dt.Columns.Add("DIA", typeof(string));
                dt.Columns.Add("VALOR", typeof(decimal));

                foreach (DateTime key in Parcelas.Keys)
                {
                    DataRow nova = dt.NewRow();
                    nova[0] = key;
                    nova[1] = dias[(int)((DateTime)key).DayOfWeek].ToUpper();
                    nova[2] = Parcelas[key];
                    dt.Rows.Add(nova);
                }

                System.IO.StringWriter tr = new System.IO.StringWriter();
                dt.WriteXml(tr);

                retorno = tr.ToString();
            }

            return retorno;
        }

        public void Adiciona_Percentual_Representante(decimal PERCENTUAL)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             orderby linha.NUMERO_ORCAMENTO
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).ToList();

                var TOTAL_PRODUTOS = query.Sum(d => d.VALOR_TOTAL);

                decimal TOTAL_REPRESENTANTE = TOTAL_PRODUTOS.HasValue ? Math.Round((decimal)TOTAL_PRODUTOS * (PERCENTUAL / 100), 2) : 0;

                foreach (var item in query)
                {
                    decimal ADICIONAL_ITEM = Math.Round((decimal)item.VALOR_TOTAL * (PERCENTUAL / 100), 2);

                    ADICIONAL_ITEM = ADICIONAL_ITEM / (decimal)item.QTDE_PRODUTO;

                    var CUSTO_REPRESENTANTE = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                               orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM_ORCAMENTO

                                               where (linha.NUMERO_ORCAMENTO == item.NUMERO_ORCAMENTO
                                               && linha.NUMERO_ITEM_ORCAMENTO == item.NUMERO_ITEM)

                                               && linha.NUMERO_CUSTO_VENDA == 26

                                               select linha).ToList();

                    if (CUSTO_REPRESENTANTE.Any())
                    {
                        foreach (var item1 in CUSTO_REPRESENTANTE)
                        {
                            item1.CUSTO_ITEM_ORCAMENTO = ADICIONAL_ITEM;
                            item1.CODIGO_FORNECEDOR = 486;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item1),
                                ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                        }
                    }
                    else
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA>();

                        Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA novo = new Doran_Servicos_ORM.TB_CUSTO_ITEM_ORCAMENTO_VENDA();

                        novo.NUMERO_ORCAMENTO = item.NUMERO_ORCAMENTO;
                        novo.NUMERO_ITEM_ORCAMENTO = item.NUMERO_ITEM;
                        novo.NUMERO_CUSTO_VENDA = 26;
                        novo.CUSTO_ITEM_ORCAMENTO = ADICIONAL_ITEM;
                        novo.PREVISAO_ENTREGA = item.DATA_ENTREGA;
                        novo.OBS_CUSTO_VENDA = "";
                        novo.CODIGO_FORNECEDOR = 486;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }

            Recalcula_Custos(0);
        }

        public static decimal Calcula_Adicional_Representante(decimal _NUMERO_ORCAMENTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             orderby linha.NUMERO_ORCAMENTO
                             where linha.NUMERO_ORCAMENTO == _NUMERO_ORCAMENTO

                             select new
                             {
                                 linha.NUMERO_ORCAMENTO,
                                 linha.NUMERO_ITEM,
                                 linha.QTDE_PRODUTO
                             }).ToList();

                decimal ADICIONAL_REPRESENTANTE = 0;

                foreach (var item in query)
                {
                    var query1 = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                  orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM_ORCAMENTO

                                  where (linha.NUMERO_ORCAMENTO == item.NUMERO_ORCAMENTO
                                  && linha.NUMERO_ITEM_ORCAMENTO == item.NUMERO_ITEM)

                                  && linha.NUMERO_CUSTO_VENDA == 26

                                  select linha).Sum(ar => ar.CUSTO_ITEM_ORCAMENTO * item.QTDE_PRODUTO);

                    ADICIONAL_REPRESENTANTE += query1.HasValue ? (decimal)query1 : 0;
                }

                return ADICIONAL_REPRESENTANTE;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}