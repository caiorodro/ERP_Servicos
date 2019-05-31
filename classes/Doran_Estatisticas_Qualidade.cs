using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Estatisticas_Qualidade : IDisposable
    {
        public Doran_Estatisticas_Qualidade()
        {
        }

        #region Estatísticas de Vendas
        public List<string> Total_Vendas_Qualidade(DateTime dt1, DateTime dt2, decimal ID_EMPRESA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var _query = Total_Itens_de_Venda(ctx, dt1, dt2);

                decimal? totalPedidos = _query.Sum(soma => soma.VALOR_TOTAL_ITEM_PEDIDO);

                decimal numeroPedidos = (from linha in ctx.TB_PEDIDO_VENDAs
                                         orderby linha.DATA_PEDIDO

                                         where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2) &&
                                         linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4

                                         select linha).Count();

                List<string> retorno = new List<string>();

                string _total = totalPedidos.HasValue ?
                    ((decimal)totalPedidos).ToString("c") :
                    ((decimal)0.00).ToString("c");

                decimal totalVendas = totalPedidos.HasValue ?
                    (decimal)totalPedidos : 0;

                retorno.Add(string.Concat("['Vendas (", _total, ")', ", totalVendas.ToString(), "]"));

                // Entrega atrasada

                DateTime dtLimite = DateTime.Today;

                var totalPedidos_EntregaAtrasada = (from linha in ctx.TB_PEDIDO_VENDAs
                                                    orderby linha.ENTREGA_PEDIDO descending

                                                    where linha.ENTREGA_PEDIDO < dtLimite &&
                                                    (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 3 &&
                                                     linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                                    select linha.VALOR_TOTAL_ITEM_PEDIDO).Sum();

                string entregaAtrasada = totalPedidos_EntregaAtrasada.HasValue ?
                    ((decimal)totalPedidos_EntregaAtrasada).ToString("c") :
                    ((decimal)0.00).ToString("c");

                retorno.Add(string.Concat("['Entrega Atrasada (", entregaAtrasada, ")', ",
                    totalPedidos_EntregaAtrasada.ToString(), "]"));

                // Quantidades entregues menores que o pedido

                var totalPedidos_QtdeMenor = (from linha in ctx.TB_PEDIDO_VENDAs
                                              orderby linha.ENTREGA_PEDIDO descending

                                              where (linha.ENTREGA_PEDIDO >= dt1 && linha.ENTREGA_PEDIDO < dt2) &&
                                              linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO == 2

                                              select linha.VALOR_TOTAL_ITEM_PEDIDO).Count();

                retorno.Add(string.Concat("['Entrega Qtdes. Menores (", totalPedidos_QtdeMenor.ToString(), ")', ",
                    totalPedidos_QtdeMenor.ToString(), "]"));

                // Inadimplência
                decimal totalInadimplente = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, 0, ID_EMPRESA);

                retorno.Add(string.Concat("['Inadimplência (", totalInadimplente.ToString("c"), ")', ",
                    totalInadimplente.ToString(), "]"));

                return retorno;
            }
        }

        public string Calcula_Curva_ABC_Clientes(DateTime dt1, DateTime dt2, int start, int limit)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var NUMERO_DE_CLIENTES = (from linha in ctx.TB_PEDIDO_VENDAs
                                          orderby linha.DATA_PEDIDO

                                          where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2) &&
                                          linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                          && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO > 0

                                          group linha by new
                                          {
                                              linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO,
                                              linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR
                                          }
                                              into agrupamento

                                              select new
                                              {
                                                  agrupamento.Key.CODIGO_CLIENTE_ORCAMENTO,
                                              }).Count();

                var query1 = (from linha in ctx.TB_PEDIDO_VENDAs
                              orderby linha.DATA_PEDIDO

                              where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2) &&
                              linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                              && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO > 0

                              group linha by new
                              {
                                  linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO,
                                  linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                  linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_VENDEDORE.NOME_VENDEDOR
                              }
                                  into agrupamento

                                  select new
                                  {
                                      agrupamento.Key.CODIGO_CLIENTE_ORCAMENTO,
                                      NOME_CLIENTE = agrupamento.Key.NOMEFANTASIA_CLIENTE,
                                      NOME_VENDEDOR = agrupamento.Key.NOME_VENDEDOR,
                                      TOTAL = agrupamento.Sum(s => s.VALOR_TOTAL_ITEM_PEDIDO)
                                  }).OrderByDescending(o => o.TOTAL).Skip(start).Take(limit);

                DataTable dt = ApoioXML.ToDataTable(ctx, query1);

                decimal? totalGeral = (from linha in ctx.TB_PEDIDO_VENDAs
                                       orderby linha.DATA_PEDIDO

                                       where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2) &&
                                          linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                          && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO > 0

                                       select linha.VALOR_TOTAL_ITEM_PEDIDO).Sum();

                decimal _totalGeral = totalGeral.HasValue ? (decimal)totalGeral : 0;

                dt.Columns.Add("REPRESENTACAO");

                foreach (DataRow dr in dt.Rows)
                {
                    dr["REPRESENTACAO"] = Math.Round((Convert.ToDecimal(dr["TOTAL"]) / _totalGeral) * 100, 2);
                }

                var TabelaFinal = (from linha in dt.AsEnumerable()
                                   orderby linha["TOTAL"] descending
                                   select linha);

                DataTable dtFinal = TabelaFinal.AsDataView().Table.Clone();

                foreach (var item in TabelaFinal)
                {
                    dtFinal.ImportRow(item);
                }

                dtFinal.Columns.Add("POSICAO");
                dtFinal.Columns.Add("PARTICIPACAO");

                decimal Porcentagem = 0;

                decimal PRIMEIRA_POSICAO = limit - (limit - start) + 1;

                for (int i = 0; i < dtFinal.Rows.Count; i++)
                {
                    dtFinal.Rows[i]["POSICAO"] = PRIMEIRA_POSICAO;

                    Porcentagem += Convert.ToDecimal(dtFinal.Rows[i]["REPRESENTACAO"]);
                    dtFinal.Rows[i]["PARTICIPACAO"] = Porcentagem;

                    PRIMEIRA_POSICAO++;
                }

                var enumPaginado = (from linha in dtFinal.AsEnumerable()
                                    select linha);

                DataTable dtPaginado = dtFinal.Clone();

                foreach (var item in enumPaginado)
                {
                    dtPaginado.ImportRow(item);
                }

                DataSet ds = new DataSet("Query");
                ds.Tables.Add(dtPaginado);

                DataTable totalCount = new DataTable("Totais");

                totalCount.Columns.Add("totalCount");

                DataRow nova1 = totalCount.NewRow();
                nova1[0] = NUMERO_DE_CLIENTES;
                totalCount.Rows.Add(nova1);

                ds.Tables.Add(totalCount);

                System.IO.StringWriter tr = new System.IO.StringWriter();
                ds.WriteXml(tr);

                return tr.ToString();
            }
        }

        public string Entregas_Atrasadas(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dtLimite = DateTime.Today;

                var query = from linha in ctx.TB_PEDIDO_VENDAs
                            orderby linha.ENTREGA_PEDIDO descending

                            where linha.ENTREGA_PEDIDO < dtLimite &&
                            (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 3 &&
                             linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                            select new
                            {
                                linha.STATUS_ITEM_PEDIDO,
                                linha.TB_STATUS_PEDIDO.COR_STATUS,
                                linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                linha.NUMERO_PEDIDO,
                                linha.DATA_PEDIDO,
                                linha.ENTREGA_PEDIDO,
                                linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.CODIGO_PRODUTO_PEDIDO,
                                linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                linha.UNIDADE_ITEM_PEDIDO,
                                linha.PRECO_ITEM_PEDIDO,
                                linha.VALOR_TOTAL_ITEM_PEDIDO,
                                ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string Quantidades_Menores(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                var query = from linha in ctx.TB_PEDIDO_VENDAs
                            orderby linha.ENTREGA_PEDIDO descending

                            where (linha.ENTREGA_PEDIDO >= dt1 && linha.ENTREGA_PEDIDO < dt2) &&
                            linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO == 2

                            select new
                            {
                                linha.STATUS_ITEM_PEDIDO,
                                linha.TB_STATUS_PEDIDO.COR_STATUS,
                                linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                linha.NUMERO_PEDIDO,
                                linha.DATA_PEDIDO,
                                linha.ENTREGA_PEDIDO,
                                linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.CODIGO_PRODUTO_PEDIDO,
                                linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                linha.UNIDADE_ITEM_PEDIDO,
                                linha.PRECO_ITEM_PEDIDO,
                                linha.VALOR_TOTAL_ITEM_PEDIDO,
                                ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string MargemAbaixo(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                var query = from linha in ctx.TB_PEDIDO_VENDAs
                            orderby linha.DATA_PEDIDO descending

                            where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2)

                            && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4

                            select new
                            {
                                linha.STATUS_ITEM_PEDIDO,
                                linha.TB_STATUS_PEDIDO.COR_STATUS,
                                linha.TB_STATUS_PEDIDO.COR_FONTE_STATUS,
                                linha.TB_STATUS_PEDIDO.DESCRICAO_STATUS_PEDIDO,
                                linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO,
                                linha.NUMERO_PEDIDO,
                                linha.DATA_PEDIDO,
                                linha.ENTREGA_PEDIDO,
                                linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.CODIGO_PRODUTO_PEDIDO,
                                linha.QTDE_PRODUTO_ITEM_PEDIDO,
                                linha.UNIDADE_ITEM_PEDIDO,
                                linha.PRECO_ITEM_PEDIDO,
                                linha.VALOR_TOTAL_ITEM_PEDIDO,
                                ATRASADA = linha.ENTREGA_PEDIDO < DateTime.Today ? 1 : 0
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        private IQueryable<TB_PEDIDO_VENDA> Total_Itens_de_Venda(Doran_ERP_Servicos_DadosDataContext ctx, DateTime dt1, DateTime dt2)
        {
            var query = from linha in ctx.TB_PEDIDO_VENDAs

                        where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2) &&
                        linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4

                        select linha;

            return query;
        }

        #endregion Estatísticas de Vendas

        #region Estatísticas de Compras

        private IQueryable<TB_PEDIDO_COMPRA> Total_Itens_de_Compra(Doran_ERP_Servicos_DadosDataContext ctx, DateTime dt1, DateTime dt2)
        {
            var query = from linha in ctx.TB_PEDIDO_COMPRAs
                        orderby linha.DATA_ITEM_COMPRA

                        where (linha.DATA_ITEM_COMPRA >= dt1 && linha.DATA_ITEM_COMPRA < dt2) &&
                        (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 1 &&
                        linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 5)

                        select linha;

            return query;
        }

        public List<string> Total_Compras_Qualidade(DateTime dt1, DateTime dt2)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = Total_Itens_de_Compra(ctx, dt1, dt2);

                decimal? totalPedidos = query.Sum(soma => soma.VALOR_TOTAL_ITEM_COMPRA);

                List<string> retorno = new List<string>();

                string _total = totalPedidos.HasValue ?
                    ((decimal)totalPedidos).ToString("c") :
                    ((decimal)0.00).ToString("c");

                decimal totalVendas = totalPedidos.HasValue ?
                    (decimal)totalPedidos : 0;

                retorno.Add(string.Concat("['Compras (", _total.ToString(), ")', ", totalVendas.ToString(), "]"));

                // Entrega atrasada

                DateTime dtLimite = DateTime.Today;

                var totalPedidos_EntregaAtrasada = (from linha in ctx.TB_PEDIDO_COMPRAs
                                                    orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA descending

                                                    where linha.PREVISAO_ENTREGA_ITEM_COMPRA < dtLimite &&
                                                    (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                                                     linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 6 ||
                                                     linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 0 ||
                                                     linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3)

                                                    select new
                                                    {
                                                        linha.STATUS_ITEM_COMPRA,
                                                        linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                                        linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                                        linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                                        linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                                        linha.NUMERO_PEDIDO_COMPRA,
                                                        linha.DATA_ITEM_COMPRA,
                                                        linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                                        linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                                        linha.CODIGO_PRODUTO_COMPRA,
                                                        linha.QTDE_ITEM_COMPRA,
                                                        linha.UNIDADE_ITEM_COMPRA,
                                                        linha.PRECO_ITEM_COMPRA,
                                                        linha.VALOR_TOTAL_ITEM_COMPRA,
                                                        linha.ALIQ_ICMS_ITEM_COMPRA,
                                                        linha.VALOR_ICMS_ITEM_COMPRA,
                                                        linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                                        linha.ALIQ_IPI_ITEM_COMPRA,
                                                        linha.VALOR_IPI_ITEM_COMPRA,
                                                        linha.CODIGO_CFOP_ITEM_COMPRA,
                                                        ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0
                                                    }).Sum(t => t.VALOR_TOTAL_ITEM_COMPRA);

                string _atrasada = totalPedidos_EntregaAtrasada.HasValue ?
                    ((decimal)totalPedidos_EntregaAtrasada).ToString("c") :
                    0.00.ToString("c");

                retorno.Add(string.Concat("['Entrega Atrasada (", _atrasada, ")', ",
                    totalPedidos_EntregaAtrasada.HasValue ? totalPedidos_EntregaAtrasada.ToString() : "0.00", "]"));

                // Quantidades entregues menores que o pedido

                var totalPedidos_QtdeMenor = (from linha in ctx.TB_PEDIDO_COMPRAs
                                              orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA descending

                                              where (linha.PREVISAO_ENTREGA_ITEM_COMPRA >= dt1 &&
                                              linha.PREVISAO_ENTREGA_ITEM_COMPRA < dt2) &&
                                              linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3

                                              select new
                                              {
                                                  linha.STATUS_ITEM_COMPRA,
                                                  linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                                  linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                                  linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                                  linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                                  linha.NUMERO_PEDIDO_COMPRA,
                                                  linha.DATA_ITEM_COMPRA,
                                                  linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                                  linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                                  linha.CODIGO_PRODUTO_COMPRA,
                                                  linha.QTDE_ITEM_COMPRA,
                                                  linha.UNIDADE_ITEM_COMPRA,
                                                  linha.PRECO_ITEM_COMPRA,
                                                  linha.VALOR_TOTAL_ITEM_COMPRA,
                                                  linha.ALIQ_ICMS_ITEM_COMPRA,
                                                  linha.VALOR_ICMS_ITEM_COMPRA,
                                                  linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                                  linha.ALIQ_IPI_ITEM_COMPRA,
                                                  linha.VALOR_IPI_ITEM_COMPRA,
                                                  linha.CODIGO_CFOP_ITEM_COMPRA,
                                                  ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0
                                              }).Sum(t => t.VALOR_TOTAL_ITEM_COMPRA);

                string _menores = totalPedidos_QtdeMenor.HasValue ?
                    ((decimal)totalPedidos_QtdeMenor).ToString("c") :
                    0.00.ToString("c");

                retorno.Add(string.Concat("['Entrega Qtdes. Menores (", _menores, " item(s))', ",
                    totalPedidos_QtdeMenor.HasValue ? totalPedidos_QtdeMenor.ToString() : "0.00", "]"));

                ///////////////// Devoluções

                var devolucoes = (from nota in ctx.TB_NOTA_ENTRADAs
                                  orderby nota.DATA_EMISSAO_NFE
                                  where (nota.DATA_EMISSAO_NFE >= dt1 && nota.DATA_EMISSAO_NFE < dt2)
                                  && nota.TB_CFOP.OPERACAO_DEVOLUCAO == 1

                                  select nota.TOTAL_NFE).ToList();

                string _devolucoes = devolucoes.Sum().HasValue ?
                    ((decimal)devolucoes.Sum()).ToString("c") :
                    ((decimal)0.00).ToString("c");

                decimal _numeroDevolucoes = devolucoes.Count();

                retorno.Add(string.Concat("['Devoluções (", _numeroDevolucoes.ToString(), " nota(s)) (", _devolucoes, ")', ",
                    devolucoes.Sum().HasValue ? devolucoes.Sum().ToString() : "0.00", "]"));


                /// Premiação de Compras

                var premiacao_compras = (from linha in ctx.TB_PEDIDO_COMPRAs
                                         orderby linha.DATA_ITEM_COMPRA

                                         where (linha.DATA_ITEM_COMPRA >= dt1
                                          && linha.DATA_ITEM_COMPRA < dt2)

                                          && (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 0
                                          && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 1
                                          && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 5)

                                          && linha.COTACAO_VENCEDORA == 1

                                          && linha.VALOR_DESCONTO_ITEM_COMPRA > (decimal)0.00

                                         select linha).ToList();

                decimal? total_desconto = premiacao_compras.Sum(d => d.TIPO_DESCONTO_ITEM_COMPRA == 1 ?
                                (d.VALOR_DESCONTO_ITEM_COMPRA * d.QTDE_ITEM_COMPRA) :
                                ((d.PRECO_FINAL_FORNECEDOR * (d.VALOR_DESCONTO_ITEM_COMPRA / 100)) * d.QTDE_ITEM_COMPRA));

                string _premiacao = total_desconto.HasValue ?
                    ((decimal)total_desconto).ToString("c") :
                    ((decimal)0.00).ToString("c");

                retorno.Add(string.Concat("['Total de desconto (", premiacao_compras.Count.ToString(), " items(s) (", _premiacao, ")', ",
                    total_desconto.HasValue ? total_desconto.ToString() : "0.00", "]"));

                return retorno;
            }
        }

        public List<string> Calcula_Totais_Compra_para_Calendario(DateTime dt1, DateTime dt2)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = Total_Itens_de_Compra(ctx, dt1, dt2);

                decimal? totalPedidos = query.Sum(soma => soma.VALOR_TOTAL_ITEM_COMPRA);

                string _total = totalPedidos.HasValue ?
                    ((decimal)totalPedidos).ToString("c") :
                    ((decimal)0.00).ToString("c");

                decimal totalVendas = totalPedidos.HasValue ?
                    (decimal)totalPedidos : 0;

                List<string> retorno = new List<string>();

                retorno.Add(string.Concat("<table style='width: 100%;'><tr><td colspan=2 style='background-color: #3399FF; color: whitesmoke; text-align: center;'>COMPRAS</td></tr>",
                    "<tr><td style='text-align: right;'>Compras: </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Compras do dia'>",
                    _total, "</span></td></tr>"));

                // Total recebido (Qtde)

                var valores_recebidas_conferidas = (from linha in ctx.TB_PEDIDO_COMPRAs
                                                          where (linha.ENTREGA_EFETIVA_ITEM_COMPRA >= dt1 && linha.ENTREGA_EFETIVA_ITEM_COMPRA < dt2) &&
                                                              (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3 ||
                                                               linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 4)

                                                          select linha.VALOR_TOTAL_ITEM_COMPRA).Sum();

                retorno.Add(string.Concat("<tr><td style='text-align: right;'>Conferidos (R$): </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Valores de mercadores conferidas'>",
                    valores_recebidas_conferidas.HasValue ? valores_recebidas_conferidas.Value.ToString("c") : 0.ToString("c"), "</span></td></tr>"));

                // Total recebido (Qtde)

                var qtdes_recebidas_conferidas = (from linha in ctx.TB_PEDIDO_COMPRAs
                                                  where (linha.ENTREGA_EFETIVA_ITEM_COMPRA >= dt1 && linha.ENTREGA_EFETIVA_ITEM_COMPRA < dt2) &&
                                                      (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3 ||
                                                       linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 4)

                                                  select new
                                                  {
                                                      TOTAL_RECEBIDO = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs
                                                                        where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                                        && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                                        select linha1.QTDE_RECEBIDA).Sum()
                                                  }).Sum(r => r.TOTAL_RECEBIDO);

                retorno.Add(string.Concat("<tr><td style='text-align: right;'>Conferidos: </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Qtdes conferidas'>",
                    qtdes_recebidas_conferidas.HasValue ? qtdes_recebidas_conferidas.Value.ToString("n") : 0.ToString("n"), "</span></td></tr></table>"));

                return retorno;
            }
        }

        public List<string> Calcula_Totais_Venda_para_Calendario(DateTime dt1, DateTime dt2, decimal ID_EMPRESA, decimal SUPERVISOR, decimal VENDEDOR,
            decimal ID_VENDEDOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = Total_Itens_de_Venda(ctx, dt1, dt2);

                List<decimal> vendedores = new List<decimal>();

                if (SUPERVISOR == 1)
                {
                    vendedores = (from linha in ctx.TB_VENDEDOREs
                                  where linha.SUPERVISOR_LIDER == ID_VENDEDOR
                                  select linha.ID_VENDEDOR).ToList();

                    query = query.Where(e => vendedores.Contains(e.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR.Value));
                }

                if (VENDEDOR == 1)
                {
                    query = query.Where(e => e.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == ID_VENDEDOR);
                }

                decimal? totalPedidos = query.Sum(soma => soma.VALOR_TOTAL_ITEM_PEDIDO);

                string _total = totalPedidos.HasValue ?
                    ((decimal)totalPedidos).ToString("c") :
                    ((decimal)0.00).ToString("c");

                decimal totalVendas = totalPedidos.HasValue ?
                    (decimal)totalPedidos : 0;

                List<string> retorno = new List<string>();

                retorno.Add(string.Concat("<table style='width: 100%;'><tr><td colspan=2 style='background-color: #993333; color: whitesmoke; text-align: center;'>VENDAS</td></tr>",
                    "<tr><td style='text-align: right;'>Vendas: </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Pedidos de venda do dia'>",
                    _total, "</span></td></tr>"));

                // Total recebido (Qtde)

                var query2 = from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.ENTREGA_PEDIDO < DateTime.Today &&
                             (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 3 &&
                              linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                             select linha;

                if (SUPERVISOR == 1)
                {
                    query2 = query2.Where(e => vendedores.Contains(e.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR.Value));
                }

                if (VENDEDOR == 1)
                {
                    query2 = query2.Where(e => e.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR == ID_VENDEDOR);
                }

                var total_em_atraso = query2.Sum(e => e.VALOR_TOTAL_ITEM_PEDIDO);

                retorno.Add(string.Concat("<tr><td style='text-align: right;'>Atrasados: </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Total de pedidos com entregas atrasadas'>",
                    total_em_atraso.HasValue ? total_em_atraso.Value.ToString("c") : 0.ToString("c"), "</span></td></tr>"));

                // Total recebido (Qtde)

                var query3 = from linha in ctx.TB_NOTA_SAIDAs
                             where (linha.DATA_EMISSAO_NF >= dt1 && linha.DATA_EMISSAO_NF < dt2)

                           && (linha.STATUS_NF == 2 || linha.STATUS_NF == 4)

                           && linha.CODIGO_EMITENTE_NF == ID_EMPRESA

                             select linha;

                if (SUPERVISOR == 1)
                {
                    query3 = query3.Where(e => vendedores.Contains(e.CODIGO_VENDEDOR_NF.Value));
                }

                if (VENDEDOR == 1)
                {
                    query3 = query3.Where(e => e.CODIGO_VENDEDOR_NF == ID_VENDEDOR);
                }

                var Faturamento = query3.Sum(e => e.TOTAL_SERVICOS_NF);

                retorno.Add(string.Concat("<tr><td style='text-align: right;'>Faturamento: </td><td style='text-align: right;'><span style='font-family: tahoma; color: navy;' title='Total faturado no dia'>",
                    Faturamento.HasValue ? Faturamento.Value.ToString("c") : 0.ToString("c"), "</span></td></tr></table>"));

                return retorno;
            }
        }

        public string Calcula_Curva_ABC_Fornecedores(DateTime dt1, DateTime dt2, int start, int limit)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.DATA_ITEM_COMPRA

                             where (linha.DATA_ITEM_COMPRA >= dt1 && linha.DATA_ITEM_COMPRA < dt2) &&
                             (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 1 &&
                             linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 5)

                             select new
                             {
                                 linha.CODIGO_FORNECEDOR,
                                 linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR
                             }).Distinct().ToList();

                DataTable dt = new DataTable("Tabela");
                dt.Columns.Add("NOME_FORNECEDOR");
                dt.Columns.Add("TOTAL", typeof(decimal));

                foreach (var item in query)
                {
                    var totalCliente = (from linha in ctx.TB_PEDIDO_COMPRAs
                                        orderby linha.CODIGO_FORNECEDOR, linha.DATA_ITEM_COMPRA

                                        where linha.CODIGO_FORNECEDOR == item.CODIGO_FORNECEDOR
                                        && (linha.DATA_ITEM_COMPRA >= dt1 && linha.DATA_ITEM_COMPRA < dt2) &&
                                        (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 1 &&
                                         linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 5)

                                        select linha.VALOR_TOTAL_ITEM_COMPRA).Sum();

                    DataRow nova = dt.NewRow();

                    nova[0] = !string.IsNullOrEmpty(item.NOME_FANTASIA_FORNECEDOR) ?
                        item.NOME_FANTASIA_FORNECEDOR.Trim() : "";

                    nova[1] = totalCliente;

                    dt.Rows.Add(nova);
                }

                decimal totalGeral = dt.AsEnumerable().Sum(soma => Convert.ToDecimal(soma["TOTAL"]));

                dt.Columns.Add("REPRESENTACAO");

                foreach (DataRow dr in dt.Rows)
                    dr["REPRESENTACAO"] = Math.Round(Convert.ToDecimal(dr["TOTAL"]) / totalGeral, 2) * 100;

                var TabelaFinal = (from linha in dt.AsEnumerable()
                                   orderby linha["TOTAL"] descending
                                   select linha);

                DataTable dtFinal = TabelaFinal.AsDataView().Table.Clone();

                foreach (var item in TabelaFinal)
                {
                    dtFinal.ImportRow(item);
                }

                dtFinal.Columns.Add("POSICAO");
                dtFinal.Columns.Add("PARTICIPACAO");

                decimal Porcentagem = 0;

                for (int i = 0; i < dtFinal.Rows.Count; i++)
                {
                    dtFinal.Rows[i]["POSICAO"] = (i + 1);

                    Porcentagem += Math.Round(Convert.ToDecimal(dtFinal.Rows[i]["REPRESENTACAO"]), 2);
                    dtFinal.Rows[i]["PARTICIPACAO"] = Porcentagem;
                }

                var enumPaginado = (from linha in dtFinal.AsEnumerable()
                                    select linha).Skip(start).Take(limit);

                DataTable dtPaginado = dtFinal.Clone();

                foreach (var item in enumPaginado)
                {
                    dtPaginado.ImportRow(item);
                }

                DataSet ds = new DataSet("Query");
                ds.Tables.Add(dtPaginado);

                DataTable totalCount = new DataTable("Totais");

                totalCount.Columns.Add("totalCount");

                DataRow nova1 = totalCount.NewRow();
                nova1[0] = dtFinal.Rows.Count;
                totalCount.Rows.Add(nova1);

                ds.Tables.Add(totalCount);

                System.IO.StringWriter tr = new System.IO.StringWriter();
                ds.WriteXml(tr);

                return tr.ToString();
            }
        }

        public string Entregas_Atrasadas_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dtLimite = DateTime.Today;

                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA descending

                            where linha.PREVISAO_ENTREGA_ITEM_COMPRA < dtLimite &&
                            (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                             linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3 ||
                             linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 6)

                            select new
                            {
                                linha.STATUS_ITEM_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.DATA_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.CODIGO_PRODUTO_COMPRA,
                                linha.QTDE_ITEM_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PRECO_ITEM_COMPRA,
                                linha.VALOR_TOTAL_ITEM_COMPRA,
                                linha.ALIQ_ICMS_ITEM_COMPRA,
                                linha.VALOR_ICMS_ITEM_COMPRA,
                                linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                linha.ALIQ_IPI_ITEM_COMPRA,
                                linha.VALOR_IPI_ITEM_COMPRA,
                                linha.CODIGO_CFOP_ITEM_COMPRA,
                                ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,

                                QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                                 orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                 where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                 && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                 select linha1.QTDE_RECEBIDA).Sum()

                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string Quantidades_Menores_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA descending

                            where (linha.PREVISAO_ENTREGA_ITEM_COMPRA >= dt1 &&
                            linha.PREVISAO_ENTREGA_ITEM_COMPRA < dt2) &&
                            linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 3

                            select new
                            {
                                linha.STATUS_ITEM_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.DATA_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.CODIGO_PRODUTO_COMPRA,
                                linha.QTDE_ITEM_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PRECO_ITEM_COMPRA,
                                linha.VALOR_TOTAL_ITEM_COMPRA,
                                linha.ALIQ_ICMS_ITEM_COMPRA,
                                linha.VALOR_ICMS_ITEM_COMPRA,
                                linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                linha.ALIQ_IPI_ITEM_COMPRA,
                                linha.VALOR_IPI_ITEM_COMPRA,
                                linha.CODIGO_CFOP_ITEM_COMPRA,
                                ATRASADA = linha.PREVISAO_ENTREGA_ITEM_COMPRA < DateTime.Today ? 1 : 0,

                                QTDE_RECEBIDA = (from linha1 in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                                 orderby linha1.NUMERO_PEDIDO_COMPRA, linha1.NUMERO_ITEM_COMPRA

                                                 where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                 && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA

                                                 select linha1.QTDE_RECEBIDA).Sum()
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string Notas_Devolucao(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);

                dt2 = dt2.AddDays(1);

                var query = from nota in ctx.TB_NOTA_ENTRADAs
                            orderby nota.DATA_EMISSAO_NFE
                            where (nota.DATA_EMISSAO_NFE >= dt1 && nota.DATA_EMISSAO_NFE < dt2)
                            && nota.TB_CFOP.OPERACAO_DEVOLUCAO == 1

                            select new
                            {
                                nota.NUMERO_SEQ_NFE,
                                nota.NUMERO_NFE,
                                nota.SERIE_NFE,
                                nota.DATA_EMISSAO_NFE,
                                nota.DATA_CHEGADA_NFE,
                                nota.CODIGO_FORNECEDOR,
                                nota.TB_FORNECEDOR.NOME_FORNECEDOR,
                                nota.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                nota.CODIGO_CFOP_NFE,
                                nota.TB_FORNECEDOR.CNPJ_FORNECEDOR,
                                nota.TOTAL_NFE,
                                nota.BASE_ICMS_NFE,
                                nota.VALOR_ICMS_NFE,
                                nota.BASE_ICMS_SUBS_NFE,
                                nota.VALOR_ICMS_SUBS_NFE,
                                nota.TOTAL_PRODUTOS_NFE,
                                nota.VALOR_FRETE_NFE,
                                nota.VALOR_SEGURO_NFE,
                                nota.OUTRAS_DESP_NFE,
                                nota.TOTAL_IPI_NFE,
                                nota.CANCELADA_NFE,
                                nota.STATUS_NFE
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string Premiacao_Compras(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                DateTime dt1 = Convert.ToDateTime(dados["DATA_INICIAL"]);
                DateTime dt2 = Convert.ToDateTime(dados["DATA_FINAL"]);
                dt2 = dt2.AddDays(1);

                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.DATA_ITEM_COMPRA

                            where (linha.DATA_ITEM_COMPRA >= dt1
                             && linha.DATA_ITEM_COMPRA < dt2)

                             && (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 0
                             && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 1
                             && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA != 0)

                             && linha.VALOR_DESCONTO_ITEM_COMPRA > (decimal)0.00

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.DATA_ITEM_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.ID_PRODUTO_COMPRA,
                                linha.CODIGO_PRODUTO_COMPRA,
                                linha.QTDE_ITEM_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.TIPO_DESCONTO_ITEM_COMPRA,
                                linha.VALOR_DESCONTO_ITEM_COMPRA,
                                linha.VALOR_TOTAL_ITEM_COMPRA,
                                linha.STATUS_ITEM_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        #endregion Estatísticas de Compras

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }

    public class PRECO_MAIOR
    {
        public decimal NUMERO_PEDIDO_COMPRA { get; set; }
        public decimal? STATUS_ITEM_COMPRA { get; set; }
        public string DESCRICAO_STATUS_PEDIDO_COMPRA { get; set; }
        public string COR_STATUS_PEDIDO_COMPRA { get; set; }
        public string COR_FONTE_STATUS_PEDIDO_COMPRA { get; set; }
        public decimal? NUMERO_ITEM_COMPRA { get; set; }
        public string CODIGO_PRODUTO_COMPRA { get; set; }
        public decimal? QTDE_ITEM_COMPRA { get; set; }
        public DateTime? PREVISAO_ENTREGA_ITEM_COMPRA { get; set; }
        public decimal? QTDE_RECEBIDA { get; set; }
        public DateTime? DATA_ITEM_COMPRA { get; set; }
        public string UNIDADE_ITEM_COMPRA { get; set; }
        public decimal? PRECO_ITEM_COMPRA { get; set; }
        public decimal? VALOR_TOTAL_ITEM_COMPRA { get; set; }
        public decimal? ALIQ_ICMS_ITEM_COMPRA { get; set; }
        public decimal? VALOR_ICMS_ITEM_COMPRA { get; set; }
        public decimal? VALOR_ICMS_ST_ITEM_COMPRA { get; set; }
        public decimal? ALIQ_IPI_ITEM_COMPRA { get; set; }
        public decimal? VALOR_IPI_ITEM_COMPRA { get; set; }
        public string CODIGO_CFOP_ITEM_COMPRA { get; set; }
        public string CODIGO_FORNECEDOR_ITEM_COMPRA { get; set; }
        public string DESCRICAO_PRODUTO { get; set; }
        public string NUMERO_LOTE_ITEM_COMPRA { get; set; }
        public string NOME_FANTASIA_FORNECEDOR { get; set; }
        public string OBS_ITEM_COMPRA { get; set; }
        public string CONTATO_COTACAO_FORNECEDOR { get; set; }
        public string TELEFONE_COTACAO_FORNECEDOR { get; set; }
        public string DESCRICAO_CP { get; set; }
        public string OBS_FORNECEDOR { get; set; }
        public string EMAIL_COTACAO_FORNECEDOR { get; set; }
        public decimal? FRETE_COTACAO_FORNECEDOR { get; set; }
        public decimal? ORDEM_COMPRA_FORNECEDOR { get; set; }
        public decimal? QTDE_NF_ITEM_COMPRA { get; set; }

        public PRECO_MAIOR()
        {

        }
    }
}