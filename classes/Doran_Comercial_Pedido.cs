using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Data;
using System.Collections;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Comercial_Pedido : IDisposable
    {
        private DataTable dtFinal;

        public Doran_Comercial_Pedido()
        {
            dtFinal = new DataTable();
        }

        public DataTable Calcula_Totais_Pedido(DataTable pItens)
        {
            dtFinal = pItens.Copy();

            var query = (from linha in pItens.AsEnumerable()
                         select linha["NUMERO_PEDIDO"]).Distinct();

            dtFinal.Columns.Add("VALOR_TOTAL");
            dtFinal.Columns.Add("VALOR_IPI");
            dtFinal.Columns.Add("VALOR_ICMS");
            dtFinal.Columns.Add("VALOR_ICMS_SUBS");
            dtFinal.Columns.Add("TOTAL_PEDIDO");
            dtFinal.Columns.Add("VALOR_FRETE");
            dtFinal.Columns.Add("MARGEM");
            dtFinal.Columns.Add("TOTAL_CUSTO");
            dtFinal.Columns.Add("CUSTO_FINANCEIRO");
            dtFinal.Columns.Add("ADICIONAL_REPRESENTANTE");

            foreach (var pedido in query)
            {
                Dictionary<string, object> totais = Calcula_Totais_Pedido(Convert.ToDecimal(pedido));

                foreach (DataRow dr in dtFinal.Rows)
                {
                    if (Convert.ToDecimal(dr["NUMERO_PEDIDO"]) == Convert.ToDecimal(pedido))
                    {
                        dr["VALOR_TOTAL"] = totais["VALOR_TOTAL"];
                        dr["VALOR_IPI"] = totais["VALOR_IPI"];
                        dr["VALOR_ICMS"] = totais["VALOR_ICMS"];
                        dr["VALOR_ICMS_SUBS"] = totais["VALOR_ICMS_SUBS"];
                        dr["TOTAL_PEDIDO"] = totais["TOTAL_PEDIDO"];
                        dr["VALOR_FRETE"] = totais["VALOR_FRETE"];
                        dr["MARGEM"] = totais["MARGEM"];
                        dr["TOTAL_CUSTO"] = totais["TOTAL_CUSTO"];
                        dr["CUSTO_FINANCEIRO"] = totais["CUSTO_FINANCEIRO"];
                        dr["ADICIONAL_REPRESENTANTE"] = totais["ADICIONAL_REPRESENTANTE"];
                    }
                }
            }

            return dtFinal;
        }

        private Dictionary<string, object> Calcula_Totais_Pedido(decimal NUMERO_PEDIDO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_PEDIDO_VENDAs
                             where item.NUMERO_PEDIDO == NUMERO_PEDIDO
                             select new
                             {
                                 item.NUMERO_PEDIDO,
                                 item.NUMERO_ITEM,
                                 item.QTDE_PRODUTO_ITEM_PEDIDO,
                                 item.VALOR_TOTAL_ITEM_PEDIDO,

                                 CUSTO_FINANCEIRO = ((from linha1 in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                                      orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM_PEDIDO

                                                      where linha1.NUMERO_PEDIDO == item.NUMERO_PEDIDO
                                                      && linha1.NUMERO_ITEM_PEDIDO == item.NUMERO_ITEM

                                                      select linha1).Sum(c => c.CUSTO_ITEM_PEDIDO) *

                                                     (item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.CUSTO_FINANCEIRO / 100))
                                                     * item.QTDE_PRODUTO_ITEM_PEDIDO
                             }).ToList();

                decimal _total_pedido = 0;
                decimal _valor_total = 0;
                decimal _valor_ipi = 0;
                decimal _valor_icms = 0;
                decimal _valor_icms_subs = 0;
                decimal itens = 0;
                decimal margem = 0;
                decimal total_custo = 0;
                decimal custo_financeiro = 0;
                decimal? adicional_representante = 0;
                decimal _produtos = 0;

                foreach (var item_orcamento in query)
                {
                    _total_pedido += (decimal)item_orcamento.VALOR_TOTAL_ITEM_PEDIDO;
                    _valor_total += (decimal)item_orcamento.VALOR_TOTAL_ITEM_PEDIDO;

                    if (item_orcamento.CUSTO_FINANCEIRO.HasValue)
                        custo_financeiro += (decimal)item_orcamento.CUSTO_FINANCEIRO;

                    // Adicional Representante

                    var query1 = (from linha1 in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                  orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM_PEDIDO

                                  where (linha1.NUMERO_PEDIDO == item_orcamento.NUMERO_PEDIDO
                                  && linha1.NUMERO_ITEM_PEDIDO == item_orcamento.NUMERO_ITEM)

                                  && linha1.NUMERO_CUSTO_VENDA == 26

                                  select linha1).Sum(ar => ar.CUSTO_ITEM_PEDIDO * item_orcamento.QTDE_PRODUTO_ITEM_PEDIDO);

                    adicional_representante += query1.HasValue ? query1 : 0;

                    _produtos += (decimal)item_orcamento.VALOR_TOTAL_ITEM_PEDIDO;

                    itens++;
                }

                margem = total_custo > 0 ? _produtos / total_custo : 0;

                // margem = Math.Round(margem, 2);

                Dictionary<string, object> dados = new Dictionary<string, object>();

                dados.Add("NUMERO_PEDIDO", NUMERO_PEDIDO);
                dados.Add("VALOR_TOTAL", ((decimal)_valor_total).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_IPI", ((decimal)_valor_ipi).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS", ((decimal)_valor_icms).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS_SUBS", ((decimal)_valor_icms_subs).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("TOTAL_PEDIDO", ((decimal)_total_pedido).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("MARGEM", margem.ToString("p", CultureInfo.CurrentCulture));
                dados.Add("TOTAL_CUSTO", total_custo.ToString("c", CultureInfo.CurrentCulture));
                dados.Add("CUSTO_FINANCEIRO", custo_financeiro.ToString("c", CultureInfo.CurrentCulture));
                dados.Add("ADICIONAL_REPRESENTANTE", adicional_representante.HasValue ?
                    ((decimal)adicional_representante).ToString("c", CultureInfo.CurrentUICulture) :
                    0.ToString("c"));

                return dados;
            }
        }

        public static List<object> Recalcula_Custos_Pedido(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var custo_financeiro = (from linha in ctx.TB_PEDIDO_VENDAs
                                        where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                        select linha).First().TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_COND_PAGTO.CUSTO_FINANCEIRO;

                if (!custo_financeiro.HasValue)
                    custo_financeiro = 0;

                var items = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && (linha.NUMERO_ITEM == NUMERO_ITEM || NUMERO_ITEM == 0)
                             select linha).ToList();

                decimal CUSTO_TOTAL = 0;
                decimal MARGEM = 0;

                decimal? VALOR_TOTAL_PRODUTOS = (from linha in ctx.TB_PEDIDO_VENDAs
                                                 where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                                 && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4
                                                 select linha).Sum(s => s.VALOR_TOTAL_ITEM_PEDIDO);

                VALOR_TOTAL_PRODUTOS = VALOR_TOTAL_PRODUTOS.HasValue ? VALOR_TOTAL_PRODUTOS : 0;

                List<object> retorno = new List<object>();

                // Custos de cada item
                foreach (var item in items)
                {
                    CUSTO_TOTAL = 0;

                    var custos = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                  where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                  && linha.NUMERO_ITEM_PEDIDO == item.NUMERO_ITEM
                                  select linha).Sum(s => s.CUSTO_ITEM_PEDIDO);

                    var MaiorData = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                     where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                     && linha.NUMERO_ITEM_PEDIDO == item.NUMERO_ITEM
                                     select linha.PREVISAO_ENTREGA).Max();

                    CUSTO_TOTAL += custos.HasValue ? custos.Value : 0;

                    CUSTO_TOTAL = Math.Round(CUSTO_TOTAL * (1 + ((decimal)custo_financeiro / 100)), 4);

                    MARGEM = Math.Round(((decimal)item.PRECO_ITEM_PEDIDO / CUSTO_TOTAL) * 100, 2);

                    if (item.NUMERO_ITEM == NUMERO_ITEM)
                    {
                        string DATA_ENTREGA = ApoioXML.TrataDataXML(item.ENTREGA_PEDIDO);

                        retorno.Add(CUSTO_TOTAL);
                        retorno.Add(MARGEM);
                        retorno.Add(DATA_ENTREGA);

                        var PERCENTUAL_COMISSAO = (from linha in ctx.TB_TABELA_COMISSAOs
                                                   where linha.ID_VENDEDOR == item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR
                                                   && linha.MARGEM_INICIAL <= Convert.ToDecimal(retorno[1])
                                                   && linha.MARGEM_FINAL >= Convert.ToDecimal(retorno[1])
                                                   select linha).Any() ?

                                       (from linha in ctx.TB_TABELA_COMISSAOs
                                        where linha.ID_VENDEDOR == item.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_VENDEDOR
                                        && linha.MARGEM_INICIAL <= Convert.ToDecimal(retorno[1])
                                        && linha.MARGEM_FINAL >= Convert.ToDecimal(retorno[1])
                                        select linha.PERCENTUAL_COMISSAO).First() : 0;

                        retorno.Add(PERCENTUAL_COMISSAO);
                        retorno.Add(Math.Round(item.VALOR_TOTAL_ITEM_PEDIDO.Value * (PERCENTUAL_COMISSAO.Value / 100), 2));
                    }

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                    if (NUMERO_ITEM == 0)
                        CUSTO_TOTAL = 0;
                }

                ctx.SubmitChanges();

                return retorno;
            }
        }

        public void Altera_Preco_de_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal PRECO, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && linha.NUMERO_ITEM == NUMERO_ITEM
                             select linha).ToList();

                foreach (var item in query)
                {
                    item.PRECO_ITEM_PEDIDO = PRECO;
                    item.VALOR_TOTAL_ITEM_PEDIDO = Math.Round(PRECO * item.QTDE_PRODUTO_ITEM_PEDIDO.Value, 2);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                }

                ctx.SubmitChanges();
            }
        }

        public void Altera_Roteiro_Item_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal QTDE, Dictionary<string, string> dados,
            decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && linha.NUMERO_ITEM == NUMERO_ITEM
                             select linha).ToList();

                foreach (var item in query)
                {
                    if (QTDE > (decimal)0.00)
                    {
                        item.QTDE_PRODUTO_ITEM_PEDIDO = Math.Round(QTDE, 2, MidpointRounding.ToEven);
                        item.QTDE_A_FATURAR = Math.Round(QTDE, 2, MidpointRounding.ToEven);
                        item.VALOR_TOTAL_ITEM_PEDIDO = Math.Round(item.PRECO_ITEM_PEDIDO.Value * item.QTDE_PRODUTO_ITEM_PEDIDO.Value, 2);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                    }

                    var orcamento = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                     where linha.NUMERO_ORCAMENTO == item.NUMERO_ORCAMENTO
                                     && linha.NUMERO_ITEM == item.NUMERO_ITEM_ORCAMENTO
                                     select linha).ToList();

                    foreach (var item1 in orcamento)
                    {
                        item1.ENDERECO_INICIAL_ITEM_ORCAMENTO = dados["ENDERECO_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.ENDERECO_FINAL_ITEM_ORCAMENTO = dados["ENDERECO_FINAL_ITEM_ORCAMENTO"].ToString();
                        item1.NUMERO_INICIAL_ITEM_ORCAMENTO = dados["NUMERO_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.NUMERO_FINAL_ITEM_ORCAMENTO = dados["NUMERO_FINAL_ITEM_ORCAMENTO"].ToString();
                        item1.COMPL_INICIAL_ITEM_ORCAMENTO = dados["COMPL_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.COMPL_FINAL_ITEM_ORCAMENTO = dados["COMPL_FINAL_ITEM_ORCAMENTO"].ToString();
                        item1.CEP_INICIAL_ITEM_ORCAMENTO = dados["CEP_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.CEP_FINAL_ITEM_ORCAMENTO = dados["CEP_FINAL_ITEM_ORCAMENTO"].ToString();
                        item1.CIDADE_INICIAL_ITEM_ORCAMENTO = dados["CIDADE_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.CIDADE_FINAL_ITEM_ORCAMENTO = dados["CIDADE_FINAL_ITEM_ORCAMENTO"].ToString();
                        item1.ESTADO_INICIAL_ITEM_ORCAMENTO = dados["ESTADO_INICIAL_ITEM_ORCAMENTO"].ToString();
                        item1.ESTADO_FINAL_ITEM_ORCAMENTO = dados["ESTADO_FINAL_ITEM_ORCAMENTO"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item1),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public void Altera_Qtde_Item_Venda(decimal NUMERO_PEDIDO, decimal NUMERO_ITEM, decimal QTDE, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             && linha.NUMERO_ITEM == NUMERO_ITEM
                             select linha).ToList();

                foreach (var item in query)
                {
                    if (QTDE > (decimal)0.00)
                    {
                        item.QTDE_PRODUTO_ITEM_PEDIDO = Math.Round(QTDE, 2, MidpointRounding.ToEven);
                        item.QTDE_A_FATURAR = Math.Round(QTDE, 2, MidpointRounding.ToEven);
                        item.VALOR_TOTAL_ITEM_PEDIDO = Math.Round(item.PRECO_ITEM_PEDIDO.Value * item.QTDE_PRODUTO_ITEM_PEDIDO.Value, 2);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_VENDAs.ToString(), NUMERO_PEDIDO, ID_USUARIO);
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