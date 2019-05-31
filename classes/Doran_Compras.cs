using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using Doran_Servicos_ORM;
using System.Data;
using System.Globalization;
using System.Data.Linq;
using Doran_Base;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Compras : IDisposable
    {
        public decimal NUMERO_PEDIDO_COMPRA { get; set; }
        public decimal NUMERO_ITEM_COMPRA { get; set; }
        public string CHAVE_COTACAO { get; set; }
        public decimal CODIGO_FORNECEDOR { get; set; }
        public decimal ID_USUARIO { get; set; }

        private DataTable dtFinal;

        public Doran_Compras(decimal pNUMERO_PEDIDO_COMPRA, decimal _ID_USUARIO)
        {
            NUMERO_PEDIDO_COMPRA = pNUMERO_PEDIDO_COMPRA;
            ID_USUARIO = _ID_USUARIO;

            dtFinal = new DataTable();
        }

        public string Carrega_Itens_Cotacao(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                            && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 1
                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.ID_PRODUTO_COMPRA,
                                linha.TB_PRODUTO.CODIGO_PRODUTO,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.QTDE_ITEM_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.CODIGO_COND_PAGTO,
                                linha.OBS_ITEM_COMPRA,
                                linha.COTACAO_ENVIADA,

                                ENTREGA_CLIENTE = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM

                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                   && linha1.NUMERO_ITEM == linha.NUMERO_ITEM_VENDA

                                                   select linha1.ENTREGA_PEDIDO).Any() ?

                                                   (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                    orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM

                                                    where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                    && linha1.NUMERO_ITEM == linha.NUMERO_ITEM_VENDA

                                                    select linha1.ENTREGA_PEDIDO).First() : null

                            };

                var rowCount = query.Count();

                if (rowCount == 0)
                    throw new Exception("Numero de cota&ccedil;&atilde;o inv&atilde;lido.<br />N&atilde;o h&aacute; itens de cota&ccedil;&atilde;o");

                var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query1, rowCount);
            }
        }

        public string Carrega_Itens_Pre_Cotacao(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var STATUS_COTACAO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                      where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 1
                                      select linha.CODIGO_STATUS_COMPRA).ToList();

                if (!STATUS_COTACAO.Any())
                    throw new Exception("N&atilde;o h&atilde; status de cota&ccedil;&atilde;o definido no cadastro");

                var query = from linha in ctx.TB_PEDIDO_COMPRAs

                            orderby linha.STATUS_ITEM_COMPRA

                            where linha.STATUS_ITEM_COMPRA == STATUS_COTACAO.First()
                            && (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA || NUMERO_PEDIDO_COMPRA == 0)
                            && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 1

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.ID_PRODUTO_COMPRA,
                                linha.TB_PRODUTO.CODIGO_PRODUTO,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.QTDE_ITEM_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.CODIGO_COND_PAGTO,
                                linha.OBS_ITEM_COMPRA,

                                ITEM_JA_COTADO = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                  where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                  && linha1.TB_PEDIDO_COMPRA.ID_PRODUTO_COMPRA == linha.ID_PRODUTO_COMPRA
                                                  select linha.CODIGO_FORNECEDOR).Distinct().Count(),

                                ITEM_JA_COTADO1 = (from linha1 in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                                   where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                   && linha1.NUMERO_ITEM_COMPRA == linha.NUMERO_ITEM_COMPRA
                                                   select linha1.NUMERO_PEDIDO_COMPRA).Distinct().Count(),

                                ENTREGA_CLIENTE = (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                   orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM

                                                   where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                   && linha1.NUMERO_ITEM == linha.NUMERO_ITEM_VENDA

                                                   select linha1.ENTREGA_PEDIDO).Any() ?

                                                   (from linha1 in ctx.TB_PEDIDO_VENDAs
                                                    orderby linha1.NUMERO_PEDIDO, linha1.NUMERO_ITEM

                                                    where linha1.NUMERO_PEDIDO == linha.NUMERO_PEDIDO_VENDA
                                                    && linha1.NUMERO_ITEM == linha.NUMERO_ITEM_VENDA

                                                    select linha1.ENTREGA_PEDIDO).First() : null
                            };

                if (dados["SOMENTE_NAO_COTADO"].ToString() == "1")
                    query = query.Where(f => f.ITEM_JA_COTADO == 0 || f.ITEM_JA_COTADO1 == 0);

                var rowCount = query.Count();

                var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query1, rowCount);
            }
        }

        public string Carrega_Itens_Chave(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.CHAVE_COTACAO, linha.PREVISAO_ENTREGA_ITEM_COMPRA
                            where linha.CHAVE_COTACAO == Convert.ToDecimal(dados["CHAVE_COTACAO"])
                            && linha.COTACAO_ENVIADA == 1
                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                CODIGO_PRODUTO = linha.CODIGO_PRODUTO_COMPRA,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.QTDE_ITEM_COMPRA,
                                linha.QTDE_FORNECEDOR,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.ENTREGA_EFETIVA_ITEM_COMPRA,
                                linha.CODIGO_COND_PAGTO,
                                linha.TB_COND_PAGTO.DESCRICAO_CP,
                                linha.OBS_ITEM_COMPRA,
                                linha.OBS_FORNECEDOR,
                                linha.COTACAO_RESPONDIDA,
                                linha.DATA_VALIDADE_COTACAO
                            };

                var rowCount = query.Count();

                var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query1, rowCount);
            }
        }

        public string Carrega_Cotacoes_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.PREVISAO_ENTREGA_ITEM_COMPRA
                            where linha.PREVISAO_ENTREGA_ITEM_COMPRA >= Convert.ToDateTime(dados["PREVISAO_ENTREGA"])

                            && (linha.TB_FORNECEDOR.NOME_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()) ||
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()) ||
                                linha.TB_FORNECEDOR.CONTATO_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()))

                            && (linha.TB_PRODUTO.DESCRICAO_PRODUTO.Contains(dados["PRODUTO"].ToString()) ||
                                linha.CODIGO_PRODUTO_COMPRA.Contains(dados["PRODUTO"].ToString()))

                            && (linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]) ||
                                Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]) == 0)

                            && (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 1 ||
                                !Convert.ToBoolean(dados["SOMENTE_COTACAO"]))

                            && (linha.COTACAO_VENCEDORA == 0)

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.TB_FORNECEDOR.NOME_FORNECEDOR,
                                linha.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO,
                                linha.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF,
                                linha.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                linha.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,
                                linha.TB_FORNECEDOR.EMAIL_FORNECEDOR,
                                linha.TB_PRODUTO.CODIGO_PRODUTO,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.QTDE_ITEM_COMPRA,
                                linha.QTDE_FORNECEDOR,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.ENTREGA_EFETIVA_ITEM_COMPRA,
                                linha.CODIGO_COND_PAGTO,
                                linha.TB_COND_PAGTO.DESCRICAO_CP,
                                linha.OBS_ITEM_COMPRA,
                                linha.OBS_FORNECEDOR,
                                linha.COTACAO_ENVIADA,
                                linha.COTACAO_RESPONDIDA,
                                linha.COTACAO_VENCEDORA,
                                linha.DATA_VALIDADE_COTACAO,
                                linha.MARCA_PEDIDO,
                                linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                linha.QTDE_NA_EMBALAGEM_FORNECEDOR
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                DataTable dt = ApoioXML.ToDataTable(ctx, query);

                dt.Columns.Add("CUSTO_VENDEDOR");

                foreach (DataRow dr in dt.Rows)
                {
                    dr["CUSTO_VENDEDOR"] = BuscaPrecoVendedor(Convert.ToDecimal(dr["NUMERO_PEDIDO_COMPRA"]),
                        Convert.ToDecimal(dr["NUMERO_ITEM_COMPRA"]));
                }

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

        public string Carrega_Cotacoes_Fornecedor_Por_Numero_Pedido(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.NUMERO_PEDIDO_COMPRA
                            where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])

                            && (linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 1 ||
                                !Convert.ToBoolean(dados["SOMENTE_COTACAO"]))

                            && (linha.COTACAO_VENCEDORA == 0)

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.TB_FORNECEDOR.NOME_FORNECEDOR,
                                linha.TB_FORNECEDOR.TB_MUNICIPIO.NOME_MUNICIPIO,
                                linha.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.SIGLA_UF,
                                linha.TB_FORNECEDOR.TELEFONE1_FORNECEDOR,
                                linha.TB_FORNECEDOR.TELEFONE2_FORNECEDOR,
                                linha.TB_FORNECEDOR.EMAIL_FORNECEDOR,
                                linha.TB_PRODUTO.CODIGO_PRODUTO,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.QTDE_ITEM_COMPRA,
                                linha.QTDE_FORNECEDOR,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.ENTREGA_EFETIVA_ITEM_COMPRA,
                                linha.CODIGO_COND_PAGTO,
                                linha.TB_COND_PAGTO.DESCRICAO_CP,
                                linha.OBS_ITEM_COMPRA,
                                linha.OBS_FORNECEDOR,
                                linha.COTACAO_ENVIADA,
                                linha.COTACAO_RESPONDIDA,
                                linha.COTACAO_VENCEDORA,
                                linha.DATA_VALIDADE_COTACAO,
                                linha.MARCA_PEDIDO,
                                linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.DESCRICAO_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_STATUS_PEDIDO_COMPRA,
                                linha.TB_STATUS_PEDIDO_COMPRA.COR_FONTE_STATUS_PEDIDO_COMPRA,
                                linha.QTDE_NA_EMBALAGEM_FORNECEDOR
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                DataTable dt = ApoioXML.ToDataTable(ctx, query);

                dt.Columns.Add("CUSTO_VENDEDOR");

                foreach (DataRow dr in dt.Rows)
                {
                    dr["CUSTO_VENDEDOR"] = BuscaPrecoVendedor(Convert.ToDecimal(dr["NUMERO_PEDIDO_COMPRA"]),
                        Convert.ToDecimal(dr["NUMERO_ITEM_COMPRA"]));
                }

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

        private string BuscaPrecoVendedor(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var COMPRA_VENDA = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                    orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA
                                    where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                    && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                    select linha).ToList();

                string retorno = "";

                foreach (var item in COMPRA_VENDA)
                {
                    var query2 = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                  orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM_PEDIDO

                                  where (linha.NUMERO_PEDIDO == item.NUMERO_PEDIDO_VENDA
                                  && linha.NUMERO_ITEM_PEDIDO == item.NUMERO_ITEM_VENDA)

                                  && linha.NUMERO_CUSTO_VENDA == 9 // Custo do Vendedor

                                  select linha).ToList();

                    foreach (var item1 in query2)
                    {
                        retorno += ((decimal)item1.CUSTO_ITEM_PEDIDO).ToString("c") + "<br />";
                    }
                }

                if (retorno.Length >= 6)
                    retorno = retorno.Substring(0, retorno.Length - 6);

                return retorno;
            }
        }

        public decimal GravaNovoItemCompra(Dictionary<string, object> dados)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                string CODIGO_PRODUTO = Codigo_Produto(Convert.ToDecimal(dados["ID_PRODUTO"]));

                //dados = Calculo_IVA(dados, CODIGO_PRODUTO);

                System.Data.Linq.Table<Doran_Servicos_ORM.TB_PEDIDO_COMPRA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PEDIDO_COMPRA>();

                Doran_Servicos_ORM.TB_PEDIDO_COMPRA novo = new Doran_Servicos_ORM.TB_PEDIDO_COMPRA();

                NUMERO_PEDIDO_COMPRA = Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]) == 0 ?
                    Doran_Compras.Obtem_Novo_Numero_Pedido() : Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]);

                novo.NUMERO_PEDIDO_COMPRA = NUMERO_PEDIDO_COMPRA;

                decimal TIPO_DESCONTO = 0;

                if (decimal.TryParse(dados["TIPO_DESCONTO_ITEM_COMPRA"].ToString(), out TIPO_DESCONTO))
                    TIPO_DESCONTO = Convert.ToDecimal(dados["TIPO_DESCONTO_ITEM_COMPRA"]);

                novo.ID_PRODUTO_COMPRA = Convert.ToDecimal(dados["ID_PRODUTO"]);
                novo.CODIGO_PRODUTO_COMPRA = CODIGO_PRODUTO;
                novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = Convert.ToDecimal(dados["CODIGO_COMPLEMENTO_PRODUTO_COMPRA"]);
                novo.UNIDADE_ITEM_COMPRA = dados["UNIDADE_ITEM_COMPRA"].ToString();
                novo.QTDE_ITEM_COMPRA = Convert.ToDecimal(dados["QTDE_ITEM_COMPRA"]);
                novo.QTDE_FORNECEDOR = Convert.ToDecimal(dados["QTDE_ITEM_COMPRA"]);
                novo.TIPO_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["TIPO_DESCONTO_ITEM_COMPRA"]);
                novo.VALOR_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_DESCONTO_ITEM_COMPRA"]);
                novo.PRECO_ITEM_COMPRA = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                novo.PRECO_FINAL_FORNECEDOR = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                novo.VALOR_TOTAL_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_COMPRA"]);
                novo.ALIQ_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_COMPRA"]);
                novo.BASE_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ITEM_COMPRA"]);
                novo.VALOR_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ITEM_COMPRA"]);
                novo.BASE_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ST_ITEM_COMPRA"]);
                novo.VALOR_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ST_ITEM_COMPRA"]);
                novo.ALIQ_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_IPI_ITEM_COMPRA"]);
                novo.VALOR_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_IPI_ITEM_COMPRA"]);
                novo.CODIGO_CFOP_ITEM_COMPRA = dados["CODIGO_CFOP_ITEM_COMPRA"].ToString();
                novo.CODIGO_FORNECEDOR_ITEM_COMPRA = dados["CODIGO_FORNECEDOR_ITEM_COMPRA"].ToString();
                novo.NUMERO_LOTE_ITEM_COMPRA = dados["NUMERO_LOTE_ITEM_COMPRA"].ToString();
                novo.OBS_ITEM_COMPRA = dados["OBS_ITEM_COMPRA"].ToString();
                novo.STATUS_ITEM_COMPRA = Convert.ToDecimal(dados["STATUS_ITEM_COMPRA"]);
                novo.DATA_ITEM_COMPRA = DateTime.Now;
                novo.PREVISAO_ENTREGA_ITEM_COMPRA = Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"]);
                novo.ENTREGA_EFETIVA_ITEM_COMPRA = Convert.ToDateTime(dados["ENTREGA_EFETIVA_ITEM_COMPRA"]);
                novo.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);
                novo.QTDE_NF_ITEM_COMPRA = 0;
                novo.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);

                novo.CONTATO_COTACAO_FORNECEDOR = dados["CONTATO_COTACAO_FORNECEDOR"].ToString();
                novo.EMAIL_COTACAO_FORNECEDOR = dados["EMAIL_COTACAO_FORNECEDOR"].ToString();
                novo.TELEFONE_COTACAO_FORNECEDOR = dados["TELEFONE_COTACAO_FORNECEDOR"].ToString();
                novo.FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["FRETE_COTACAO_FORNECEDOR"]);
                novo.VALOR_FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["VALOR_FRETE_COTACAO_FORNECEDOR"]);
                novo.ID_UF_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"]);
                novo.CODIGO_CP_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);
                novo.DATA_PEDIDO_COTACAO = DateTime.Now;
                novo.DATA_RESPOSTA = new DateTime(1901, 01, 01);
                novo.CHAVE_COTACAO = CRIA_CHAVE_COTACAO(NUMERO_PEDIDO_COMPRA, Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]));

                novo.COTACAO_ENVIADA = dados.ContainsKey("COTACAO_ENVIADA") ? Convert.ToDecimal(dados["COTACAO_ENVIADA"]) : 1;
                novo.COTACAO_RESPONDIDA = dados.ContainsKey("COTACAO_RESPONDIDA") ? Convert.ToDecimal(dados["COTACAO_RESPONDIDA"]) : 2;
                novo.OBS_FORNECEDOR = dados["OBS_FORNECEDOR"].ToString();
                novo.DATA_VALIDADE_COTACAO = DateTime.Today.AddDays(15);
                novo.MARCA_PEDIDO = 0;
                novo.IVA_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["IVA_COTACAO_FORNECEDOR"]);
                novo.COTACAO_VENCEDORA = dados.ContainsKey("COTACAO_VENCEDORA") ? Convert.ToDecimal(dados["COTACAO_VENCEDORA"]) : 1;
                novo.PRECO_RESERVA = Convert.ToDecimal(dados["PRECO_RESERVA"]);

                novo.NUMERO_PEDIDO_VENDA = dados.ContainsKey("NUMERO_PEDIDO_VENDA") ?
                    Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"]) : 0;

                novo.NUMERO_ITEM_VENDA = dados.ContainsKey("NUMERO_ITEM_VENDA") ?
                    Convert.ToDecimal(dados["NUMERO_ITEM_VENDA"]) : 0;

                novo.ID_USUARIO_COTACAO_VENCEDORA = ID_USUARIO;

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                // Grava Novo código na tabela do fornecedor

                if (dados["CODIGO_FORNECEDOR_ITEM_COMPRA"].ToString().Trim().Length > 0)
                {
                    var query = (from linha in ctx.TB_FORNECEDOR_PRODUTOs

                                 where linha.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"])
                                 && linha.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])

                                 select linha).ToList();

                    if (!query.Any())
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_FORNECEDOR_PRODUTO> Entidade1 = ctx.GetTable<Doran_Servicos_ORM.TB_FORNECEDOR_PRODUTO>();

                        Doran_Servicos_ORM.TB_FORNECEDOR_PRODUTO novo1 = new Doran_Servicos_ORM.TB_FORNECEDOR_PRODUTO();

                        novo1.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);
                        novo1.ID_PRODUTO = Convert.ToDecimal(dados["ID_PRODUTO"]);
                        novo1.CODIGO_PRODUTO_FORNECEDOR = dados["CODIGO_FORNECEDOR_ITEM_COMPRA"].ToString();
                        novo1.PRECO_FORNECEDOR = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                        novo1.DESCONTO1 = 0;
                        novo1.DESCONTO2 = 0;
                        novo1.DESCONTO3 = 0;

                        Entidade1.InsertOnSubmit(novo1);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), ID_USUARIO);
                    }
                }

                CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);

                Atualiza_Status_Pedido_Conforme_Alcada(ctx, NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR, Convert.ToDecimal(dados["STATUS_ITEM_COMPRA"]),
                    ID_USUARIO);

                ctx.SubmitChanges();

                NUMERO_ITEM_COMPRA = novo.NUMERO_ITEM_COMPRA;

                return NUMERO_PEDIDO_COMPRA;
            }
        }

        public void AtualizaItemCompra(Dictionary<string, object> dados)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    string CODIGO_PRODUTO = Codigo_Produto(Convert.ToDecimal(dados["ID_PRODUTO_COMPRA"]));

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(dados["NUMERO_ITEM_COMPRA"])
                                 select linha).ToList();

                    foreach (var novo in query)
                    {
                        novo.ID_PRODUTO_COMPRA = Convert.ToDecimal(dados["ID_PRODUTO_COMPRA"]);
                        novo.CODIGO_PRODUTO_COMPRA = CODIGO_PRODUTO;
                        novo.CODIGO_COMPLEMENTO_PRODUTO_COMPRA = Convert.ToDecimal(dados["CODIGO_COMPLEMENTO_PRODUTO"]);
                        novo.UNIDADE_ITEM_COMPRA = dados["UNIDADE_ITEM_COMPRA"].ToString();
                        novo.QTDE_ITEM_COMPRA = Convert.ToDecimal(dados["QTDE_ITEM_COMPRA"]);
                        novo.TIPO_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["TIPO_DESCONTO_ITEM_COMPRA"]);
                        novo.VALOR_DESCONTO_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_DESCONTO_ITEM_COMPRA"]);
                        novo.PRECO_ITEM_COMPRA = Convert.ToDecimal(dados["PRECO_ITEM_COMPRA"]);
                        novo.VALOR_TOTAL_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_COMPRA"]);
                        novo.ALIQ_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_COMPRA"]);
                        novo.BASE_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ITEM_COMPRA"]);
                        novo.VALOR_ICMS_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ITEM_COMPRA"]);
                        novo.BASE_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["BASE_ICMS_ST_ITEM_COMPRA"]);
                        novo.VALOR_ICMS_ST_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_ICMS_ST_ITEM_COMPRA"]);
                        novo.ALIQ_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["ALIQ_IPI_ITEM_COMPRA"]);
                        novo.VALOR_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_IPI_ITEM_COMPRA"]);
                        novo.CODIGO_CFOP_ITEM_COMPRA = dados["CODIGO_CFOP_ITEM_COMPRA"].ToString();
                        novo.CODIGO_FORNECEDOR_ITEM_COMPRA = dados["CODIGO_FORNECEDOR_ITEM_COMPRA"].ToString();
                        novo.NUMERO_LOTE_ITEM_COMPRA = dados["NUMERO_LOTE_ITEM_COMPRA"].ToString();
                        novo.OBS_ITEM_COMPRA = dados["OBS_ITEM_COMPRA"].ToString();
                        novo.PREVISAO_ENTREGA_ITEM_COMPRA = Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"]);
                        novo.ENTREGA_EFETIVA_ITEM_COMPRA = new DateTime(1901, 01, 01);
                        novo.CODIGO_COND_PAGTO = Convert.ToDecimal(dados["CODIGO_COND_PAGTO"]);

                        novo.CONTATO_COTACAO_FORNECEDOR = dados["CONTATO_COTACAO_FORNECEDOR"].ToString();
                        novo.EMAIL_COTACAO_FORNECEDOR = dados["EMAIL_COTACAO_FORNECEDOR"].ToString();
                        novo.TELEFONE_COTACAO_FORNECEDOR = dados["TELEFONE_COTACAO_FORNECEDOR"].ToString();
                        novo.FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["FRETE_COTACAO_FORNECEDOR"]);
                        novo.VALOR_FRETE_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["VALOR_FRETE_COTACAO_FORNECEDOR"]);
                        novo.ID_UF_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"]);
                        novo.CODIGO_CP_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_COTACAO_FORNECEDOR"]);
                        novo.DATA_PEDIDO_COTACAO = DateTime.Now;
                        novo.DATA_RESPOSTA = new DateTime(1901, 01, 01);

                        if (dados.ContainsKey("OBS_FORNECEDOR"))
                            novo.OBS_FORNECEDOR = dados["OBS_FORNECEDOR"].ToString();

                        novo.DATA_VALIDADE_COTACAO = DateTime.Today.AddDays(15);
                        novo.IVA_COTACAO_FORNECEDOR = Convert.ToDecimal(dados["IVA_COTACAO_FORNECEDOR"]);
                        novo.PRECO_RESERVA = Convert.ToDecimal(dados["PRECO_RESERVA"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(novo),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

                        CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);
                    }

                    ctx.SubmitChanges();

                    if (dados.ContainsKey("STATUS_ITEM_COMPRA"))
                        Atualiza_Status_Pedido_Conforme_Alcada(ctx, NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR, Convert.ToDecimal(dados["STATUS_ITEM_COMPRA"]),
                            ID_USUARIO);

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }
        }

        public void DeletaItemCotacaoFornecedor(decimal NUMERO_ITEM_COMPRA)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal STATUS_ITEM_COMPRA = 0;

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        STATUS_ITEM_COMPRA = item.STATUS_ITEM_COMPRA.Value;
                        CODIGO_FORNECEDOR = item.CODIGO_FORNECEDOR.Value;

                        /// Desassocia a compra com a venda
                        var items = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                     where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                     && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                     select linha).ToList();

                        foreach (var item1 in items)
                        {
                            ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item1);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        ctx.TB_PEDIDO_COMPRAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

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
        }

        public void DeletaItemCompra(decimal NUMERO_ITEM_COMPRA)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    var ja_com_fornecedor = (from linha in ctx.TB_PEDIDO_COMPRAs
                                             orderby linha.NUMERO_PEDIDO_COMPRA
                                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                             select linha).Count();

                    if (ja_com_fornecedor > 0)
                        throw new Exception("N&atilde;o &eacute; poss&iacute;vel deletar. Este item est&aacute; associado com um item de venda");

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                                 select linha).ToList();

                    decimal NUMERO_PEDIDO_VENDA = 0;
                    decimal NUMERO_ITEM_VENDA = 0;
                    decimal STATUS_ITEM_COMPRA = 0;

                    foreach (var item in query)
                    {
                        STATUS_ITEM_COMPRA = item.STATUS_ITEM_COMPRA.Value;

                        /// Desassocia a compra com a venda
                        var items = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                     where linha.NUMERO_PEDIDO_COMPRA == item.NUMERO_PEDIDO_COMPRA
                                     && linha.NUMERO_ITEM_COMPRA == item.NUMERO_ITEM_COMPRA
                                     select linha).ToList();

                        foreach (var item1 in items)
                        {
                            ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item1);
                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        ////

                        CODIGO_FORNECEDOR = (decimal)item.CODIGO_FORNECEDOR;

                        NUMERO_PEDIDO_VENDA = (decimal)item.NUMERO_PEDIDO_VENDA;
                        NUMERO_ITEM_VENDA = (decimal)item.NUMERO_ITEM_VENDA;

                        ctx.TB_PEDIDO_COMPRAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    Atualiza_Status_Pedido_Conforme_Alcada(ctx, NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR, STATUS_ITEM_COMPRA, ID_USUARIO);

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }
        }

        public static void Atualiza_Status_Pedido_Conforme_Alcada(Doran_ERP_Servicos_DadosDataContext ctx, decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR,
            decimal STATUS_PEDIDO, decimal ID_USUARIO)
        {
            var TOTAL_PEDIDO = (from linha in ctx.TB_PEDIDO_COMPRAs
                                where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                select linha.VALOR_TOTAL_ITEM_COMPRA).Sum();

            TOTAL_PEDIDO = TOTAL_PEDIDO.HasValue ? TOTAL_PEDIDO : 0;

            if (TOTAL_PEDIDO > (decimal)0.00)
            {
                var REQUER_APROVACAO = (from linha in ctx.TB_ALCADA_APROVACAO_PEDIDOs
                                        where linha.ID_USUARIO == ID_USUARIO
                                        && linha.VALOR_MAXIMO_APROVACAO < TOTAL_PEDIDO
                                        select linha).Any();

                if (REQUER_APROVACAO)
                {
                    var STATUS_EM_ANALISE = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                             where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 7
                                             select linha.CODIGO_STATUS_COMPRA).ToList();

                    if (!STATUS_EM_ANALISE.Any())
                        throw new Exception("N&atilde;o h&aacute; fase [PEDIDO EM AN&Aacute;LISE] cadastrada");

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                 select linha).ToList();

                    List<decimal?> _codigos = new List<decimal?>();

                    _codigos.Add(2);
                    _codigos.Add(7);

                    foreach (var item in query)
                    {
                        var STATUS_ESPECIFICO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                                 where _codigos.Contains(linha.STATUS_ESPECIFICO_ITEM_COMPRA)
                                                 select linha.CODIGO_STATUS_COMPRA).ToList();

                        if (STATUS_ESPECIFICO.Contains(item.STATUS_ITEM_COMPRA.Value))
                            item.STATUS_ITEM_COMPRA = STATUS_EM_ANALISE.First();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
                else
                {
                    var STATUS_EM_ANDAMENTO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                               where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 2
                                               select linha.CODIGO_STATUS_COMPRA).ToList();

                    if (!STATUS_EM_ANDAMENTO.Any())
                        throw new Exception("N&atilde;o h&aacute; fase [PEDIDO DE COMPRA] cadastrada");

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                 select linha).ToList();

                    List<decimal?> _codigos = new List<decimal?>();

                    _codigos.Add(2);
                    _codigos.Add(7);

                    foreach (var item in query)
                    {
                        var STATUS_ESPECIFICO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                                 where _codigos.Contains(linha.STATUS_ESPECIFICO_ITEM_COMPRA)
                                                 select linha.CODIGO_STATUS_COMPRA).ToList();

                        if (STATUS_ESPECIFICO.Contains(item.STATUS_ITEM_COMPRA.Value))
                            item.STATUS_ITEM_COMPRA = STATUS_EM_ANDAMENTO.First();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
        }

        public void Salva_Itens_Fornecedor(List<Dictionary<string, object>> LINHAS)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.CHAVE_COTACAO
                             where linha.CHAVE_COTACAO == Convert.ToDecimal(LINHAS[0]["CHAVE_COTACAO"])
                             select linha).ToList();

                for (int i = 0; i < LINHAS.Count; i++)
                {
                    foreach (var item in query)
                    {
                        if (item.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(LINHAS[i]["NUMERO_PEDIDO_COMPRA"])
                            && item.NUMERO_ITEM_COMPRA == Convert.ToDecimal(LINHAS[i]["NUMERO_ITEM_COMPRA"]))
                        {
                            item.QTDE_FORNECEDOR = Convert.ToDecimal(LINHAS[i]["QTDE_FORNECEDOR"]);
                            item.PRECO_FINAL_FORNECEDOR = Convert.ToDecimal(LINHAS[i]["PRECO_FINAL_FORNECEDOR"]);
                            item.ENTREGA_EFETIVA_ITEM_COMPRA = Convert.ToDateTime(LINHAS[i]["PREVISAO_ENTREGA"]);
                            item.OBS_FORNECEDOR = LINHAS[i]["OBS_FORNECEDOR"].ToString();

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                                ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                        }
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public void Responder_Cotacao(List<decimal> LINHAS)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < LINHAS.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_ITEM_COMPRA == LINHAS[i]

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.COTACAO_RESPONDIDA = 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public static int CRIA_CHAVE_COTACAO(decimal NUMERO_PEDIDO_COMPRA, decimal CODIGO_FORNECEDOR)
        {
            int retorno = string.Concat(NUMERO_PEDIDO_COMPRA.ToString(), CODIGO_FORNECEDOR.ToString()).GetHashCode();

            return retorno < 0 ? retorno * (-1) : retorno;
        }

        public static string BuscaCodigoProdutoFornecedor(decimal CODIGO_FORNECEDOR, decimal ID_PRODUTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                string retorno = "";

                var query = (from linha in ctx.TB_FORNECEDOR_PRODUTOs
                             where linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                             && linha.ID_PRODUTO == ID_PRODUTO
                             select linha).ToList();

                foreach (var item in query)
                    retorno = item.CODIGO_PRODUTO_FORNECEDOR.Trim();

                return retorno;
            }
        }

        public string Lista_Fornecedores_Cotacao(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_FORNECEDORs
                            where (linha.NOME_FANTASIA_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()) ||
                            linha.NOME_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()) ||
                            linha.CONTATO_FORNECEDOR.Contains(dados["FORNECEDOR"].ToString()))

                            select new
                            {
                                linha.CODIGO_FORNECEDOR,
                                linha.NOME_FANTASIA_FORNECEDOR,
                                linha.TELEFONE1_FORNECEDOR,
                                linha.TELEFONE2_FORNECEDOR,
                                linha.CONTATO_FORNECEDOR,
                                linha.EMAIL_FORNECEDOR,
                                MUNICIPIO = linha.TB_MUNICIPIO.NOME_MUNICIPIO,
                                UF = linha.TB_MUNICIPIO.TB_UF.SIGLA_UF,

                                PRECO_FINAL = (from linha1 in ctx.TB_FORNECEDOR_PRODUTOs
                                               where linha1.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])
                                               && linha1.CODIGO_FORNECEDOR == linha.CODIGO_FORNECEDOR
                                               select linha1).Any() ?

                                               (from linha1 in ctx.TB_FORNECEDOR_PRODUTOs
                                                where linha1.ID_PRODUTO == Convert.ToDecimal(dados["ID_PRODUTO"])
                                                && linha1.CODIGO_FORNECEDOR == linha.CODIGO_FORNECEDOR
                                                select new
                                                {
                                                    PRECO_TABELA = linha1.PRECO_FORNECEDOR * (linha1.DESCONTO1.HasValue ? (1 - (linha1.DESCONTO1 / 100)) : 1) *
                                                        (linha1.DESCONTO2.HasValue ? (1 - (linha1.DESCONTO2 / 100)) : 1) *
                                                        (linha1.DESCONTO3.HasValue ? (1 - (linha1.DESCONTO3 / 100)) : 1)
                                                }).First().PRECO_TABELA : 0
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public string Lista_Cotacao_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA || NUMERO_PEDIDO_COMPRA == 0)
                            && linha.CODIGO_FORNECEDOR > 0
                            && linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA == 1

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.TB_PRODUTO.CODIGO_PRODUTO,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.TB_FORNECEDOR.EMAIL_FORNECEDOR,
                                linha.QTDE_FORNECEDOR,
                                linha.TB_COND_PAGTO.DESCRICAO_CP,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                STATUS = "",
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.COTACAO_ENVIADA,
                                linha.COTACAO_RESPONDIDA,
                                linha.CHAVE_COTACAO,
                                linha.DATA_VALIDADE_COTACAO,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.CODIGO_FORNECEDOR,
                                linha.QTDE_NA_EMBALAGEM_FORNECEDOR
                            };

                var rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                DataTable dt = ApoioXML.ToDataTable(ctx, query);

                dt.Columns.Add("CUSTO_VENDEDOR");

                foreach (DataRow dr in dt.Rows)
                {
                    dr["CUSTO_VENDEDOR"] = BuscaPrecoVendedor(Convert.ToDecimal(dr["NUMERO_PEDIDO_COMPRA"]),
                        Convert.ToDecimal(dr["NUMERO_ITEM_COMPRA"]));
                }

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

        public void Envia_Cotacao_Fornecedor(string Mensagem, decimal ID_CONTA_EMAIL, string FROM_ADDRESS, string NOME_FANTASIA_EMITENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.CODIGO_FORNECEDOR > 0
                             && linha.COTACAO_ENVIADA == 0
                             && linha.COTACAO_RESPONDIDA == 0
                             select linha).ToList();

                if (query.Count() == 0)
                    throw new Exception("N&atilde;o h&aacute; itens de cota&ccedil;&atilde;o para enviar");

                List<string> emails = new List<string>();
                List<decimal> fornecedores = new List<decimal>();
                List<decimal> contatos = new List<decimal>();
                List<string> senhas = new List<string>();

                foreach (var item in query)
                {
                    if (!emails.Contains(item.TB_FORNECEDOR.EMAIL_FORNECEDOR.Trim().ToLower()))
                    {
                        var senha_portal = from linha in ctx.TB_FORNECEDOR_CONTATOs
                                           where linha.ID_FORNECEDOR == item.CODIGO_FORNECEDOR
                                           select linha;

                        if (!senha_portal.Any())
                            throw new Exception("N&atilde;o &haacute; contato cadastrado para este fornecedor");

                        fornecedores.Add((decimal)item.CODIGO_FORNECEDOR);
                        emails.Add(senha_portal.First().EMAIL_CONTATO_FORNECEDOR.Trim().ToLower());
                        contatos.Add(senha_portal.First().ID_CONTATO);
                        senhas.Add(senha_portal.First().SENHA_PORTAL);
                    }
                }

                for (int i = 0; i < emails.Count; i++)
                {
                    if (senhas[i] == null)
                        senhas[i] = Cria_Altera_Senha_Fornecedor(fornecedores[i], contatos[i], ctx);

                    else if (senhas[i].Trim().Length == 0)
                        senhas[i] = Cria_Altera_Senha_Fornecedor(fornecedores[i], contatos[i], ctx);

                    else
                        senhas[i] = senhas[i].Trim();

                    string _mensagem = Mensagem;
                    _mensagem = _mensagem.Replace("#EMAIL_FORNECEDOR#", emails[i].ToString());
                    _mensagem = _mensagem.Replace("#SENHA#", senhas[i].ToString());

                    var CHAVE = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                 && linha.COTACAO_ENVIADA == 0
                                 && linha.CODIGO_FORNECEDOR == fornecedores[i]
                                 select linha.CHAVE_COTACAO).Distinct().ToList();

                    if (!CHAVE.Any())
                        throw new Exception("N&atilde;o h&aacute; cota&ccedil;&otilde;es para enviar");

                    using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                    {
                        Dictionary<string, object> dados = new Dictionary<string, object>();

                        dados.Add("ID_MESSAGE", 0);
                        dados.Add("ID_CONTA_EMAIL", ID_CONTA_EMAIL);
                        dados.Add("FROM_ADDRESS", FROM_ADDRESS);
                        dados.Add("PRIORITY", 1);
                        dados.Add("SUBJECT", string.Concat("Cotação para Compra de Produtos - ", NOME_FANTASIA_EMITENTE));

                        dados.Add("BODY", _mensagem);
                        dados.Add("RAW_BODY", _mensagem);
                        dados.Add("NUMERO_CRM", 0);

                        List<string> TOs = new List<string>();
                        TOs.Add(emails[i]);

                        List<string> CCs = new List<string>();
                        List<string> BCCs = new List<string>();
                        List<string> Attachments = new List<string>();

                        decimal ID_MESSAGE = mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);

                        mail.Envia_Email_que_estava_gravado_como_rascunho(ID_MESSAGE);
                    }

                    var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                  where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                                  && linha.COTACAO_ENVIADA == 0
                                  && linha.CODIGO_FORNECEDOR == fornecedores[i]
                                  select linha).ToList();

                    foreach (var item in query1)
                    {
                        item.COTACAO_ENVIADA = 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        private string Cria_Altera_Senha_Fornecedor(decimal CODIGO_FORNECEDOR, decimal ID_CONTATO, Doran_ERP_Servicos_DadosDataContext ctx)
        {
            string retorno = "";

            var query = (from linha in ctx.TB_FORNECEDOR_CONTATOs
                         where linha.ID_FORNECEDOR == CODIGO_FORNECEDOR
                         && linha.ID_CONTATO == ID_CONTATO
                         select linha).ToList();

            foreach (var item in query)
            {
                if (item.SENHA_PORTAL == null)
                    item.SENHA_PORTAL = item.TB_FORNECEDOR.CNPJ_FORNECEDOR.Trim().GetHashCode().ToString();

                else if (item.SENHA_PORTAL.Trim().Length == 0)
                    item.SENHA_PORTAL = item.TB_FORNECEDOR.CNPJ_FORNECEDOR.Trim().GetHashCode().ToString();

                retorno = item.SENHA_PORTAL.Trim();

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FORNECEDOR_CONTATOs.GetModifiedMembers(item),
                    ctx.TB_FORNECEDOR_CONTATOs.ToString(), ID_USUARIO);
            }

            return retorno;
        }

        public string BuscaUltimoPreco(Dictionary<string, object> dados)
        {
            string retorno = "";

            if (dados["CLIENTE_FORNECEDOR"].ToString() == "C")
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                select new
                                {
                                    linha.NUMERO_ITEM_NF,
                                    linha.CODIGO_PRODUTO_ITEM_NF,
                                    linha.DESCRICAO_PRODUTO_ITEM_NF,
                                    linha.UNIDADE_MEDIDA_ITEM_NF,
                                    linha.QTDE_ITEM_NF,
                                    linha.VALOR_UNITARIO_ITEM_NF,
                                    linha.VALOR_TOTAL_ITEM_NF,
                                    DATA_EMISSAO = linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF,
                                    NOME_CLIENTE = linha.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF,
                                    linha.TB_NOTA_SAIDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                                };

                    DateTime DT = Convert.ToDateTime(dados["DATA_EMISSAO"]);
                    DT = DT.AddDays(1);

                    if (dados["CODIGO_PRODUTO"].ToString().Trim().Length > 0)
                    {
                        query = query.Where(p => p.CODIGO_PRODUTO_ITEM_NF == dados["CODIGO_PRODUTO"].ToString()
                                && p.DATA_EMISSAO < DT
                                && p.NOMEFANTASIA_CLIENTE.Contains(dados["NOME_CLIENTE"].ToString()));

                        query = query.OrderBy(o => o.CODIGO_PRODUTO_ITEM_NF).ThenByDescending(o => o.DATA_EMISSAO);
                    }
                    else
                    {
                        var CLIENTE = (from linha in ctx.TB_CLIENTEs
                                       where (linha.NOMEFANTASIA_CLIENTE.Contains(dados["NOME_CLIENTE"].ToString())
                                       || linha.NOME_CLIENTE.Contains(dados["NOME_CLIENTE"].ToString()))
                                       select linha.ID_CLIENTE).Take(1).ToList();

                        decimal CODIGO_CLIENTE = CLIENTE.Any() ? CLIENTE.First() : 0;

                        query = query.Where(p => p.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                && p.DATA_EMISSAO < DT);

                        query = query.OrderBy(o => o.CODIGO_CLIENTE_NF).ThenByDescending(o => o.DATA_EMISSAO);
                    }

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }
            else
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_PEDIDO_COMPRAs
                                select new
                                {
                                    NUMERO_ITEM_NF = linha.NUMERO_PEDIDO_COMPRA,
                                    CODIGO_PRODUTO_ITEM_NF = linha.CODIGO_PRODUTO_COMPRA,
                                    DESCRICAO_PRODUTO_ITEM_NF = linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                    CODIGO_CFOP_ITEM_NF = linha.CODIGO_CFOP_ITEM_COMPRA,
                                    QTDE_ITEM_NF = linha.QTDE_ITEM_COMPRA,
                                    VALOR_UNITARIO_ITEM_NF = linha.PRECO_FINAL_FORNECEDOR,
                                    VALOR_TOTAL_ITEM_NF = linha.VALOR_TOTAL_ITEM_COMPRA,
                                    CODIGO_ITEM_CLIENTE = "",
                                    DATA_EMISSAO = linha.DATA_ITEM_COMPRA,
                                    NOME_CLIENTE = linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                    NUMERO_LOTE_ITEM_NF = linha.NUMERO_LOTE_ITEM_COMPRA,
                                    linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.TB_STATUS_PEDIDO_COMPRA.STATUS_ESPECIFICO_ITEM_COMPRA
                                };

                    DateTime DT = Convert.ToDateTime(dados["DATA_EMISSAO"]);
                    DT = DT.AddDays(1);

                    if (dados["CODIGO_PRODUTO"].ToString().Trim().Length > 0)
                    {
                        query = query.Where(p => p.CODIGO_PRODUTO_ITEM_NF == dados["CODIGO_PRODUTO"].ToString()
                                && p.DATA_EMISSAO < DT
                                && p.NOME_FANTASIA_FORNECEDOR.Contains(dados["NOME_CLIENTE"].ToString())

                                && (p.STATUS_ESPECIFICO_ITEM_COMPRA == 3 || p.STATUS_ESPECIFICO_ITEM_COMPRA == 4));

                        query = query.OrderBy(o => o.CODIGO_PRODUTO_ITEM_NF).ThenByDescending(o => o.DATA_EMISSAO);
                    }
                    else
                    {
                        var FORNECEDOR = (from linha in ctx.TB_FORNECEDORs
                                          where (linha.NOME_FANTASIA_FORNECEDOR.Contains(dados["NOME_CLIENTE"].ToString())
                                          || linha.NOME_FORNECEDOR.Contains(dados["NOME_CLIENTE"].ToString()))
                                          select linha.CODIGO_FORNECEDOR).Take(1).ToList();

                        decimal CODIGO_FORNECEDOR = FORNECEDOR.Any() ? FORNECEDOR.First() : 0;

                        query = query.Where(p => p.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                                && p.DATA_EMISSAO < DT

                                && (p.STATUS_ESPECIFICO_ITEM_COMPRA == 3 || p.STATUS_ESPECIFICO_ITEM_COMPRA == 4));

                        query = query.OrderBy(o => o.CODIGO_FORNECEDOR).ThenByDescending(o => o.DATA_EMISSAO);
                    }

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
            }

            return retorno;
        }

        public void Marca_Itens_Fechar(List<Decimal> itens)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < itens.Count; i++)
                {
                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 where linha.NUMERO_ITEM_COMPRA == itens[i]
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.MARCA_PEDIDO = item.MARCA_PEDIDO == 1 ? 0 : 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public void Fecha_Pedido(string Mensagem, bool NAO_ENVIAR_EMAIL, decimal ID_CONTA_EMAIL, string FROM_ADDRESS, string NOME_FANTASIA_EMITENTE)
        {
            List<decimal> IDs_PRODUTO = new List<decimal>();
            List<decimal> NUMEROs_PEDIDO_COMPRA = new List<decimal>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.MARCA_PEDIDO
                             where linha.MARCA_PEDIDO == 1
                             && linha.QTDE_FORNECEDOR > (decimal)0.00
                             select linha).ToList();

                if (query.Count == 0)
                    throw new Exception("N&atilde;o h&aacute; itens marcados ou as quantidades do fornecedor não foram preenchidas para fechar um pedido");

                List<string> NOMES_FORNECEDOR = new List<string>();
                List<string> EMAILS_FORNECEDOR = new List<string>();
                List<decimal> CODIGOS_FORNECEDOR = new List<decimal>();
                List<decimal> CONTATOS = new List<decimal>();
                List<string> SENHAS = new List<string>();

                foreach (var item in query)
                {
                    var QTDE_JA_FECHADA = (from linha in ctx.TB_PEDIDO_COMPRAs
                                           orderby linha.NUMERO_ITEM_COTACAO_ORIGINAL

                                           where linha.NUMERO_ITEM_COTACAO_ORIGINAL == item.NUMERO_ITEM_COTACAO_ORIGINAL
                                           && linha.COTACAO_VENCEDORA == 1

                                           select linha).Sum(q => q.QTDE_FORNECEDOR);

                    decimal? _QTDE_EMBALAGEM = item.QTDE_NA_EMBALAGEM_FORNECEDOR.HasValue ? item.QTDE_NA_EMBALAGEM_FORNECEDOR : 0;

                    decimal? _QTDE_MAX = (_QTDE_EMBALAGEM > item.QTDE_ITEM_COMPRA) ?
                        item.QTDE_NA_EMBALAGEM_FORNECEDOR : item.QTDE_ITEM_COMPRA;

                    if (QTDE_JA_FECHADA > _QTDE_MAX)
                    {
                        string x = string.Concat("Para este item j&aacute; foi fechada a quantidade de ",
                            ((decimal)QTDE_JA_FECHADA).ToString("n"), " (", item.UNIDADE_ITEM_COMPRA.Trim(),
                            ")<br /><br />Verifique se h&aacute; duplicidade de pedido.");

                        throw new Exception(x);
                    }

                    if (!NUMEROs_PEDIDO_COMPRA.Contains((decimal)item.NUMERO_PEDIDO_COMPRA))
                    {
                        var senha_portal = from linha in ctx.TB_FORNECEDOR_CONTATOs
                                           where linha.ID_FORNECEDOR == item.CODIGO_FORNECEDOR
                                           select linha;

                        if (!senha_portal.Any())
                            throw new Exception("N&atilde;o h&aacute; contatos cadastrados para o fornecedor [" + item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim() + "]");

                        NOMES_FORNECEDOR.Add(item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim());
                        EMAILS_FORNECEDOR.Add(senha_portal.First().EMAIL_CONTATO_FORNECEDOR.ToLower().Trim());
                        CONTATOS.Add(senha_portal.First().ID_CONTATO);
                        SENHAS.Add(senha_portal.First().SENHA_PORTAL == null ? "" : senha_portal.First().SENHA_PORTAL.Trim());
                        CODIGOS_FORNECEDOR.Add((decimal)item.CODIGO_FORNECEDOR);
                        NUMEROs_PEDIDO_COMPRA.Add(item.NUMERO_PEDIDO_COMPRA);
                    }
                }

                for (int i = 0; i < NOMES_FORNECEDOR.Count; i++)
                {
                    var CHAVE = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.MARCA_PEDIDO
                                 where linha.MARCA_PEDIDO == 1
                                 && linha.CODIGO_FORNECEDOR == CODIGOS_FORNECEDOR[i]
                                 select linha.CHAVE_COTACAO).Distinct().First();

                    if (!NAO_ENVIAR_EMAIL)
                    {
                        string _mensagem = Mensagem;
                        _mensagem = _mensagem.Replace("#EMAIL_FORNECEDOR#", EMAILS_FORNECEDOR[i].ToString());
                        _mensagem = _mensagem.Replace("#SENHA#", SENHAS[i].ToString());
                        _mensagem = _mensagem.Replace("#NUMERO_PEDIDO_COMPRA#", NUMEROs_PEDIDO_COMPRA[i].ToString());

                        using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                        {
                            Dictionary<string, object> dados = new Dictionary<string, object>();

                            dados.Add("ID_MESSAGE", 0);
                            dados.Add("ID_CONTA_EMAIL", ID_CONTA_EMAIL);
                            dados.Add("FROM_ADDRESS", FROM_ADDRESS);
                            dados.Add("PRIORITY", 1);
                            dados.Add("SUBJECT", string.Concat("Fechamento de pedido para compra de produtos - ", NOME_FANTASIA_EMITENTE));

                            dados.Add("BODY", _mensagem);
                            dados.Add("RAW_BODY", _mensagem);
                            dados.Add("NUMERO_CRM", 0);

                            List<string> TOs = new List<string>();
                            TOs.Add(EMAILS_FORNECEDOR[i]);

                            List<string> CCs = new List<string>();
                            List<string> BCCs = new List<string>();
                            List<string> Attachments = new List<string>();

                            decimal ID_MESSAGE = mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);

                            mail.Envia_Email_que_estava_gravado_como_rascunho(ID_MESSAGE);
                        }
                    }
                }

                List<decimal> PEDIDOS = new List<decimal>();
                List<decimal> ITENS = new List<decimal>();
                List<decimal> NUMERO_ITEM_COTACAO_ORIGINAL = new List<decimal>();
                List<decimal> NUMERO_PEDIDO_VENDA_ORIGINAL = new List<decimal>();
                List<decimal> NUMERO_ITEM_VENDA_ORIGINAL = new List<decimal>();

                foreach (var item in query)
                {
                    if (item.QTDE_FORNECEDOR > (decimal)0.00)
                    {
                        if (!PEDIDOS.Contains(item.NUMERO_PEDIDO_COMPRA))
                            PEDIDOS.Add(item.NUMERO_PEDIDO_COMPRA);

                        if (!ITENS.Contains(item.NUMERO_ITEM_COMPRA))
                            ITENS.Add(item.NUMERO_ITEM_COMPRA);

                        item.COTACAO_ENVIADA = 1;
                        item.COTACAO_RESPONDIDA = 2;
                        item.ID_USUARIO_COTACAO_VENCEDORA = ID_USUARIO;

                        item.MARCA_PEDIDO = 0;
                        item.CONTATO_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.CONTATO_FORNECEDOR.Trim();
                        item.EMAIL_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.EMAIL_FORNECEDOR.Trim();
                        item.TELEFONE_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.TELEFONE1_FORNECEDOR.Trim();
                        item.ID_UF_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.ID_UF_FORNECEDOR;
                        item.FRETE_COTACAO_FORNECEDOR = 0;
                        item.VALOR_FRETE_COTACAO_FORNECEDOR = 0;
                        item.COTACAO_VENCEDORA = 1;

                        item.QTDE_ITEM_COMPRA = item.QTDE_FORNECEDOR;
                        item.PRECO_ITEM_COMPRA = item.PRECO_FINAL_FORNECEDOR;

                        decimal VALOR_TOTAL = Math.Round((decimal)item.QTDE_FORNECEDOR * (decimal)item.PRECO_FINAL_FORNECEDOR, 2);

                        item.VALOR_TOTAL_ITEM_COMPRA = VALOR_TOTAL;

                        decimal? ALIQ_ICMS = item.TB_FORNECEDOR.TB_MUNICIPIO.TB_UF.ALIQ_ICMS_UF;

                        item.ALIQ_ICMS_ITEM_COMPRA = ALIQ_ICMS;
                        item.VALOR_ICMS_ITEM_COMPRA = Math.Round(VALOR_TOTAL * ((decimal)ALIQ_ICMS / 100), 2);

                        NUMERO_ITEM_COTACAO_ORIGINAL.Add((decimal)item.NUMERO_ITEM_COTACAO_ORIGINAL);

                        decimal _NUMERO_PEDIDO_VENDA = 0;
                        decimal _NUMERO_ITEM_VENDA = 0;

                        Busca_Item_Venda((decimal)item.NUMERO_ITEM_COTACAO_ORIGINAL, out _NUMERO_PEDIDO_VENDA, out _NUMERO_ITEM_VENDA);

                        item.NUMERO_PEDIDO_VENDA = _NUMERO_PEDIDO_VENDA;
                        item.NUMERO_ITEM_VENDA = _NUMERO_ITEM_VENDA;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                for (int i = 0; i < ITENS.Count; i++)
                {
                    var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                  where linha.NUMERO_ITEM_COMPRA == ITENS[i]
                                  select linha).ToList();

                    var status_pedido = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                         where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 2
                                         select linha.CODIGO_STATUS_COMPRA).ToList().First();

                    foreach (var item in query1)
                    {
                        item.STATUS_ITEM_COMPRA = status_pedido;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                for (int i = 0; i < NUMERO_ITEM_COTACAO_ORIGINAL.Count; i++)
                {
                    var PEDIDOS_ASSOCIADOS = (from linha in ctx.TB_PEDIDO_COMPRAs

                                              orderby linha.NUMERO_ITEM_COMPRA
                                              where linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COTACAO_ORIGINAL[i]

                                              select linha).ToList();

                    foreach (var item in PEDIDOS_ASSOCIADOS)
                    {
                        item.NUMERO_PEDIDO_VENDA = 0;
                        item.NUMERO_ITEM_VENDA = 0;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            "TB_PEDIDO_COMPRA", ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        private void Busca_Item_Venda(decimal NUMERO_ITEM_COMPRA, out decimal _NUMERO_PEDIDO_VENDA, out decimal _NUMERO_ITEM_VENDA)
        {
            _NUMERO_PEDIDO_VENDA = 0;
            _NUMERO_ITEM_VENDA = 0;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_ITEM_COMPRA

                             where linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA

                             select new
                             {
                                 linha.NUMERO_PEDIDO_VENDA,
                                 linha.NUMERO_ITEM_VENDA
                             }).ToList();

                foreach (var item in query)
                {
                    _NUMERO_PEDIDO_VENDA = (decimal)item.NUMERO_PEDIDO_VENDA;
                    _NUMERO_ITEM_VENDA = (decimal)item.NUMERO_ITEM_VENDA;
                }
            }
        }

        public Dictionary<string, object> Calcula_Totais_Pedido()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_PEDIDO_COMPRAs

                             orderby item.NUMERO_PEDIDO_COMPRA, item.CODIGO_FORNECEDOR

                             where item.NUMERO_PEDIDO_COMPRA == this.NUMERO_PEDIDO_COMPRA
                             && item.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                             && item.COTACAO_VENCEDORA == 1

                             select new
                             {
                                 item.NUMERO_PEDIDO_COMPRA,
                                 item.VALOR_TOTAL_ITEM_COMPRA,
                                 item.VALOR_IPI_ITEM_COMPRA,
                                 item.VALOR_ICMS_ITEM_COMPRA,
                                 item.VALOR_ICMS_ST_ITEM_COMPRA,
                                 item.VALOR_FRETE_COTACAO_FORNECEDOR,
                                 item.FRETE_COTACAO_FORNECEDOR
                             }).ToList();

                decimal _total_pedido = 0;
                decimal _valor_total = 0;
                decimal _valor_ipi = 0;
                decimal _valor_icms = 0;
                decimal _valor_icms_subs = 0;
                decimal _valor_frete = 0;
                decimal _frete_por_conta = 0;

                foreach (var item_orcamento in query)
                {
                    _frete_por_conta = (decimal)item_orcamento.FRETE_COTACAO_FORNECEDOR;
                    _valor_frete = (decimal)item_orcamento.VALOR_FRETE_COTACAO_FORNECEDOR;

                    _total_pedido += (decimal)item_orcamento.VALOR_TOTAL_ITEM_COMPRA +
                        (decimal)item_orcamento.VALOR_IPI_ITEM_COMPRA +
                        (decimal)item_orcamento.VALOR_ICMS_ST_ITEM_COMPRA;

                    _valor_total += (decimal)item_orcamento.VALOR_TOTAL_ITEM_COMPRA;
                    _valor_ipi += (decimal)item_orcamento.VALOR_IPI_ITEM_COMPRA;
                    _valor_icms += (decimal)item_orcamento.VALOR_ICMS_ITEM_COMPRA;
                    _valor_icms_subs += (decimal)item_orcamento.VALOR_ICMS_ST_ITEM_COMPRA;
                }

                if (_frete_por_conta == 1)
                    _total_pedido += _valor_frete;

                Dictionary<string, object> dados = new Dictionary<string, object>();

                dados.Add("NUMERO_PEDIDO", this.NUMERO_PEDIDO_COMPRA);
                dados.Add("VALOR_TOTAL", ((decimal)_valor_total).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_IPI", ((decimal)_valor_ipi).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS", ((decimal)_valor_icms).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS_SUBS", ((decimal)_valor_icms_subs).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("TOTAL_PEDIDO", ((decimal)_total_pedido).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_FRETE", _valor_frete.ToString("c", CultureInfo.CurrentCulture));

                return dados;
            }
        }

        public string Carrega_Itens_Pedido_Compra(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.NUMERO_PEDIDO_COMPRA
                            where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])

                            && (linha.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]))
                            && linha.COTACAO_VENCEDORA == 1

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.NUMERO_ITEM_COMPRA,
                                linha.ID_PRODUTO_COMPRA,
                                linha.CODIGO_PRODUTO_COMPRA,
                                linha.TB_PRODUTO.DESCRICAO_PRODUTO,
                                linha.CODIGO_COMPLEMENTO_PRODUTO_COMPRA,
                                linha.UNIDADE_ITEM_COMPRA,
                                linha.CODIGO_CFOP_ITEM_COMPRA,
                                linha.QTDE_ITEM_COMPRA,
                                linha.PRECO_ITEM_COMPRA,
                                linha.VALOR_TOTAL_ITEM_COMPRA,
                                linha.ALIQ_ICMS_ITEM_COMPRA,
                                linha.VALOR_ICMS_ITEM_COMPRA,
                                linha.ALIQ_IPI_ITEM_COMPRA,
                                linha.VALOR_IPI_ITEM_COMPRA,
                                linha.BASE_ICMS_ITEM_COMPRA,
                                linha.BASE_ICMS_ST_ITEM_COMPRA,
                                linha.VALOR_ICMS_ST_ITEM_COMPRA,
                                linha.CODIGO_FORNECEDOR_ITEM_COMPRA,
                                linha.NUMERO_LOTE_ITEM_COMPRA,
                                linha.OBS_ITEM_COMPRA,
                                linha.TIPO_DESCONTO_ITEM_COMPRA,
                                linha.VALOR_DESCONTO_ITEM_COMPRA,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,
                                linha.ENTREGA_EFETIVA_ITEM_COMPRA,
                                linha.PRECO_RESERVA,
                                linha.NUMERO_PEDIDO_VENDA,
                                linha.NUMERO_ITEM_VENDA
                            };

                string retorno = "";

                if (dados.ContainsKey("start"))
                {
                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                }
                else
                    retorno = ApoioXML.objQueryToXML(ctx, query);

                return retorno;
            }
        }

        public DataTable Calcula_Totais_Pedido(DataTable pItens)
        {
            dtFinal = pItens.Copy();

            var query = (from linha in pItens.AsEnumerable()
                         select linha["NUMERO_PEDIDO_COMPRA"]).Distinct();

            dtFinal.Columns.Add("VALOR_TOTAL");
            dtFinal.Columns.Add("VALOR_IPI");
            dtFinal.Columns.Add("VALOR_ICMS");
            dtFinal.Columns.Add("VALOR_ICMS_ST");
            dtFinal.Columns.Add("TOTAL_PEDIDO");
            dtFinal.Columns.Add("VALOR_FRETE");

            foreach (var pedido in query)
            {
                Dictionary<string, object> totais = Calcula_Totais_Pedido(Convert.ToDecimal(pedido));

                foreach (DataRow dr in dtFinal.Rows)
                {
                    if (Convert.ToDecimal(dr["NUMERO_PEDIDO_COMPRA"]) == Convert.ToDecimal(pedido))
                    {
                        dr["VALOR_TOTAL"] = totais["VALOR_TOTAL"];
                        dr["VALOR_IPI"] = totais["VALOR_IPI"];
                        dr["VALOR_ICMS"] = totais["VALOR_ICMS"];
                        dr["VALOR_ICMS_ST"] = totais["VALOR_ICMS_ST"];
                        dr["TOTAL_PEDIDO"] = totais["TOTAL_PEDIDO"];
                        dr["VALOR_FRETE"] = totais["VALOR_FRETE"];
                    }
                }
            }

            return dtFinal;
        }

        public Dictionary<string, object> Busca_Dados_Pedido(decimal _CODIGO_FORNECEDOR)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR
                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.CODIGO_FORNECEDOR == _CODIGO_FORNECEDOR

                             select new
                             {
                                 linha.CODIGO_FORNECEDOR,
                                 linha.CONTATO_COTACAO_FORNECEDOR,
                                 linha.ID_UF_COTACAO_FORNECEDOR,
                                 linha.TELEFONE_COTACAO_FORNECEDOR,
                                 linha.EMAIL_COTACAO_FORNECEDOR,
                                 linha.IVA_COTACAO_FORNECEDOR,
                                 linha.FRETE_COTACAO_FORNECEDOR,
                                 linha.VALOR_FRETE_COTACAO_FORNECEDOR,
                                 linha.CODIGO_CP_COTACAO_FORNECEDOR
                             }).ToList().First();

                CODIGO_FORNECEDOR = _CODIGO_FORNECEDOR;

                Dictionary<string, object> retorno = Calcula_Totais_Pedido();

                retorno.Add("CODIGO_FORNECEDOR", query.CODIGO_FORNECEDOR);
                retorno.Add("CONTATO_COTACAO_FORNECEDOR", query.CONTATO_COTACAO_FORNECEDOR.Trim());
                retorno.Add("ID_UF_COTACAO_FORNECEDOR", query.ID_UF_COTACAO_FORNECEDOR);
                retorno.Add("TELEFONE_COTACAO_FORNECEDOR", query.TELEFONE_COTACAO_FORNECEDOR.Trim());
                retorno.Add("EMAIL_COTACAO_FORNECEDOR", query.EMAIL_COTACAO_FORNECEDOR.Trim());
                retorno.Add("IVA_COTACAO_FORNECEDOR", query.IVA_COTACAO_FORNECEDOR);
                retorno.Add("FRETE_COTACAO_FORNECEDOR", query.FRETE_COTACAO_FORNECEDOR);
                retorno.Add("VALOR_FRETE_COTACAO_FORNECEDOR", query.VALOR_FRETE_COTACAO_FORNECEDOR);
                retorno.Add("CODIGO_CP_COTACAO_FORNECEDOR", query.CODIGO_CP_COTACAO_FORNECEDOR);

                return retorno;
            }
        }

        private Dictionary<string, object> Calcula_Totais_Pedido(decimal NUMERO_PEDIDO_COMPRA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_PEDIDO_COMPRAs
                             orderby item.NUMERO_PEDIDO_COMPRA
                             where item.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             select new
                             {
                                 item.NUMERO_PEDIDO_COMPRA,
                                 item.VALOR_TOTAL_ITEM_COMPRA,
                                 item.VALOR_IPI_ITEM_COMPRA,
                                 item.VALOR_ICMS_ITEM_COMPRA,
                                 item.VALOR_ICMS_ST_ITEM_COMPRA,
                                 item.VALOR_FRETE_COTACAO_FORNECEDOR,
                                 item.FRETE_COTACAO_FORNECEDOR
                             }).ToList();

                decimal _total_pedido = 0;
                decimal _valor_total = 0;
                decimal _valor_ipi = 0;
                decimal _valor_icms = 0;
                decimal _valor_icms_subs = 0;
                decimal _valor_frete = 0;
                decimal _frete_por_conta = 0;

                decimal itens = 0;
                decimal margem = 0;

                foreach (var item_orcamento in query)
                {
                    _frete_por_conta = (decimal)item_orcamento.FRETE_COTACAO_FORNECEDOR;
                    _valor_frete = (decimal)item_orcamento.VALOR_FRETE_COTACAO_FORNECEDOR;

                    _total_pedido += (decimal)item_orcamento.VALOR_TOTAL_ITEM_COMPRA +
                        (decimal)item_orcamento.VALOR_IPI_ITEM_COMPRA +
                        (decimal)item_orcamento.VALOR_ICMS_ST_ITEM_COMPRA;

                    _valor_total += (decimal)item_orcamento.VALOR_TOTAL_ITEM_COMPRA;
                    _valor_ipi += (decimal)item_orcamento.VALOR_IPI_ITEM_COMPRA;
                    _valor_icms += (decimal)item_orcamento.VALOR_ICMS_ITEM_COMPRA;
                    _valor_icms_subs += (decimal)item_orcamento.VALOR_ICMS_ST_ITEM_COMPRA;

                    itens++;
                }

                margem = Math.Round(margem / itens, 2) / 100;

                if (_frete_por_conta == 1)
                    _total_pedido += _valor_frete;

                Dictionary<string, object> dados = new Dictionary<string, object>();
                dados.Add("NUMERO_PEDIDO_COMPRA", NUMERO_PEDIDO_COMPRA);
                dados.Add("VALOR_TOTAL", ((decimal)_valor_total).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_IPI", ((decimal)_valor_ipi).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS", ((decimal)_valor_icms).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_ICMS_ST", ((decimal)_valor_icms_subs).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("TOTAL_PEDIDO", ((decimal)_total_pedido).ToString("c", CultureInfo.CurrentCulture));
                dados.Add("VALOR_FRETE", _valor_frete.ToString("c", CultureInfo.CurrentCulture));

                return dados;
            }
        }

        public Dictionary<string, object> Transforma_Cotacao_Pedido()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var STATUS_PEDIDO = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                                     where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 2
                                     select linha).ToList();

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                foreach (var item in STATUS_PEDIDO)
                {
                    retorno.Add("CODIGO_STATUS_COMPRA", item.CODIGO_STATUS_COMPRA);
                    retorno.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", item.DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                    retorno.Add("COR_STATUS_PEDIDO_COMPRA", item.COR_STATUS_PEDIDO_COMPRA.Trim());
                    retorno.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", item.COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                    retorno.Add("STATUS_ESPECIFICO_ITEM_COMPRA", item.STATUS_ESPECIFICO_ITEM_COMPRA);
                }

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.NUMERO_PEDIDO_COMPRA, linha.CODIGO_FORNECEDOR

                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR

                             select linha).ToList();

                foreach (var item in query)
                {
                    if (item.PRECO_ITEM_COMPRA == (decimal)0.000)
                    {
                        throw new Exception(string.Concat("O produto [",
                            item.CODIGO_PRODUTO_COMPRA.Trim(), "] do pedido [", item.NUMERO_PEDIDO_COMPRA.ToString(), "] est&aacute; com pre&ccedil;o zerado.<br />",
                            "N&atilde;o &eacute; poss&iacute;vel transformar em pedido."));
                    }

                    item.STATUS_ITEM_COMPRA = Convert.ToDecimal(retorno["CODIGO_STATUS_COMPRA"]);
                    item.COTACAO_VENCEDORA = 1;
                    item.COTACAO_ENVIADA = 1;
                    item.COTACAO_RESPONDIDA = 2;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                        ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();

                return retorno;
            }
        }

        public void Altera_Fornecedor_do_Pedido(decimal CODIGO_FORNECEDOR, decimal CODIGO_FORNCEDOR_ANTIGO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             where linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.CODIGO_FORNECEDOR == CODIGO_FORNCEDOR_ANTIGO
                             select linha).ToList();

                foreach (var item in query)
                {
                    item.CODIGO_FORNECEDOR = CODIGO_FORNECEDOR;
                    item.CONTATO_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR.Trim();
                    item.ID_UF_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.ID_UF_FORNECEDOR;
                    item.EMAIL_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.EMAIL_FORNECEDOR.Trim();
                    item.TELEFONE_COTACAO_FORNECEDOR = item.TB_FORNECEDOR.TELEFONE1_FORNECEDOR.Trim();

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                        ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();
            }
        }

        public static decimal Obtem_Novo_Numero_Pedido()
        {
            decimal retorno = 0;

            using (SqlConnection cnn = new SqlConnection(
                ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString))
            {
                cnn.Open();

                SqlTransaction tr = cnn.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                try
                {
                    SqlCommand command = new SqlCommand();
                    command.CommandText = "SELECT count(*) FROM TB_NUMERO_PEDIDO_COMPRA (NOLOCK)";
                    command.Connection = cnn;
                    command.Transaction = tr;

                    int existe = (int)command.ExecuteScalar();

                    if (existe == 0)
                        command.CommandText = "INSERT INTO TB_NUMERO_PEDIDO_COMPRA VALUES(1)";
                    else
                        command.CommandText = "UPDATE TB_NUMERO_PEDIDO_COMPRA SET ULTIMO_NUMERO_PEDIDO_COMPRA = ULTIMO_NUMERO_PEDIDO_COMPRA + 1";

                    command.ExecuteNonQuery();

                    command.CommandText = "SELECT TOP 1 * FROM TB_NUMERO_PEDIDO_COMPRA (NOLOCK)";

                    SqlDataAdapter adapter = new SqlDataAdapter(command);

                    DataTable dt = new DataTable();
                    adapter.Fill(dt);

                    foreach (DataRow item in dt.Rows)
                        retorno = Convert.ToDecimal(item[0]);

                    tr.Commit();
                }
                catch (Exception ex)
                {
                    tr.Rollback();
                    throw ex;
                }
            }

            return retorno;
        }

        public static string Codigo_Produto(decimal ID_PRODUTO)
        {
            using (Doran_Servicos_ORM.Doran_ERP_Servicos_DadosDataContext ctx = new Doran_Servicos_ORM.Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PRODUTOs
                             where linha.ID_PRODUTO == ID_PRODUTO
                             select linha.CODIGO_PRODUTO).ToList().First();

                return query.Trim();
            }
        }

        public static void ConsistenciaItem(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                if ((from linha in ctx.TB_CFOPs
                     where linha.CODIGO_CFOP == dados["CODIGO_CFOP_ITEM_COMPRA"].ToString().Trim()
                     select linha).Count() == 0)
                {
                    throw new Exception("Falta preencher o c&oacute;digo da natureza de opera&ccedil;&atilde;o (CFOP do item) com um c&oacute;digo v&aacute;lido");
                }

                var existe = (from linha in ctx.TB_PEDIDO_COMPRAs
                              where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"])
                              && linha.NUMERO_ITEM_COMPRA != Convert.ToDecimal(dados["NUMERO_ITEM_COMPRA"])
                              && linha.ID_PRODUTO_COMPRA == Convert.ToDecimal(dados["ID_PRODUTO"])
                              && linha.QTDE_ITEM_COMPRA == Convert.ToDecimal(dados["QTDE_ITEM_COMPRA"])
                              && linha.PREVISAO_ENTREGA_ITEM_COMPRA == Convert.ToDateTime(dados["PREVISAO_ENTREGA_ITEM_COMPRA"])
                              && linha.CODIGO_FORNECEDOR > 0
                              //&& linha.COTACAO_VENCEDORA == 1
                              select linha).Count();

                if (existe > 0)
                    throw new Exception("Este item j&aacute; existe nesta cota&ccedil;&atilde;o com a mesma quantidade e data de entrega");
            }
        }

        //public static Dictionary<string, object> Calculo_IVA(Dictionary<string, object> dados, string CODIGO_PRODUTO)
        //{
        //    decimal BASE_ICMS_SUBS = 0;
        //    decimal VALOR_ICMS_SUBS = 0;

        //    if (dados.ContainsKey("IVA_COTACAO_FORNECEDOR"))
        //    {
        //        if (Convert.ToDecimal(dados["IVA_COTACAO_FORNECEDOR"]) == 1)
        //        {
        //            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
        //            {
        //                decimal VALOR_TOTAL_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_COMPRA"]);
        //                decimal VALOR_IPI_ITEM_COMPRA = Convert.ToDecimal(dados["VALOR_IPI_ITEM_COMPRA"]);
        //                decimal PERC_IVA;

        //                var query2 = (from linha in ctx1.TB_UFs
        //                              where linha.ID_UF == Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"])
        //                              select linha).ToList().First();

        //                decimal ALIQ_ICMS = (decimal)query2.ALIQ_ICMS_UF;
        //                decimal ALIQ_INTERNA_ICMS = (decimal)query2.ALIQ_INTERNA_ICMS;

        //                string CLAS_FISCAL_PRODUTO = "";
        //                string SITUACAO_TRIBUTARIA = "";

        //                var query1 = (from linha in ctx1.TB_PRODUTOs
        //                              where linha.CODIGO_PRODUTO == CODIGO_PRODUTO
        //                              select new
        //                              {
        //                                  linha.CLAS_FISCAL_PRODUTO,
        //                                  linha.SIT_TRIB_PRODUTO
        //                              }).ToList();

        //                foreach (var item in query1)
        //                {
        //                    CLAS_FISCAL_PRODUTO = item.CLAS_FISCAL_PRODUTO.Trim();
        //                    SITUACAO_TRIBUTARIA = item.SIT_TRIB_PRODUTO.Trim();
        //                }

        //                var query = (from cls in ctx1.TB_CFOP_CLAS_FISCALs
        //                             where cls.CODIGO_CFOP == dados["CODIGO_CFOP_ITEM_COMPRA"].ToString() &&
        //                             cls.ID_UF == Convert.ToDecimal(dados["ID_UF_COTACAO_FORNECEDOR"]) &&
        //                             cls.CODIGO_CLAS_FISCAL == CLAS_FISCAL_PRODUTO
        //                             select cls).ToList();

        //                foreach (var item in query)
        //                {
        //                    PERC_IVA = (decimal)item.PERCENTUAL_IVA_AJUS;

        //                    BASE_ICMS_SUBS = (VALOR_TOTAL_ITEM_COMPRA + VALOR_IPI_ITEM_COMPRA) * (1 + (decimal)item.PERCENTUAL_IVA_AJUS / 100);
        //                    BASE_ICMS_SUBS = Math.Round(BASE_ICMS_SUBS, 2);

        //                    var ID_UF_FORNECEDOR = (from linha in ctx1.TB_FORNECEDORs
        //                                            where linha.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"])
        //                                            select linha).Any() ?

        //                                            (from linha in ctx1.TB_FORNECEDORs
        //                                             where linha.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"])
        //                                             select linha.ID_UF_FORNECEDOR).First() : 0;

        //                    if (ID_UF_FORNECEDOR > 0 && (ID_UF_FORNECEDOR != Convert.ToDecimal(dados["ID_UF_EMITENTE"])))
        //                    {
        //                        var ALIQ_ICMS_PRODUTOS_IMPORTADOS = (from linha in ctx1.TB_CLAS_FISCAL_SIT_TRIBs
        //                                                             where linha.CODIGO_CLAS_FISCAL == CLAS_FISCAL_PRODUTO
        //                                                             && linha.CODIGO_SITUACAO_TRIBUTARIA == SITUACAO_TRIBUTARIA
        //                                                             select linha).Any() ?

        //                                                             (from linha in ctx1.TB_CLAS_FISCAL_SIT_TRIBs
        //                                                              where linha.CODIGO_CLAS_FISCAL == CLAS_FISCAL_PRODUTO
        //                                                              && linha.CODIGO_SITUACAO_TRIBUTARIA == SITUACAO_TRIBUTARIA
        //                                                              select linha.ALIQ_ICMS_DIFERENCIADA).First() : 0;

        //                        VALOR_ICMS_SUBS = (BASE_ICMS_SUBS * (ALIQ_ICMS_PRODUTOS_IMPORTADOS.Value / 100)) - (VALOR_TOTAL_ITEM_COMPRA * ((decimal)ALIQ_ICMS / 100));
        //                    }
        //                    else
        //                    {
        //                        VALOR_ICMS_SUBS = (BASE_ICMS_SUBS * (ALIQ_INTERNA_ICMS / 100)) - (VALOR_TOTAL_ITEM_COMPRA * ((decimal)ALIQ_ICMS / 100));
        //                    }

        //                    VALOR_ICMS_SUBS = Math.Round(VALOR_ICMS_SUBS, 2);

        //                    dados["BASE_ICMS_ST_ITEM_COMPRA"] = BASE_ICMS_SUBS;
        //                    dados["VALOR_ICMS_ST_ITEM_COMPRA"] = VALOR_ICMS_SUBS;
        //                }
        //            }
        //        }
        //    }

        //    return dados;
        //}

        public Dictionary<string, object> Cancela_Pedido_Compra()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var status = (from linha in ctx.TB_STATUS_PEDIDO_COMPRAs
                              where linha.STATUS_ESPECIFICO_ITEM_COMPRA == 5
                              select linha).ToList();

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             where linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA
                             select linha).ToList();

                foreach (var item in query)
                {
                    item.STATUS_ITEM_COMPRA = status.First().CODIGO_STATUS_COMPRA;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                        ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                retorno.Add("CODIGO_STATUS_COMPRA", status.First().CODIGO_STATUS_COMPRA);
                retorno.Add("DESCRICAO_STATUS_PEDIDO_COMPRA", status.First().DESCRICAO_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add("COR_STATUS_PEDIDO_COMPRA", status.First().COR_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add("COR_FONTE_STATUS_PEDIDO_COMPRA", status.First().COR_FONTE_STATUS_PEDIDO_COMPRA.Trim());
                retorno.Add("STATUS_ESPECIFICO_ITEM_COMPRA", status.First().STATUS_ESPECIFICO_ITEM_COMPRA);

                return retorno;
            }
        }

        public static string Lista_Itens_Cotados_Nao_Fechados(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_PEDIDO_COMPRAs
                            orderby linha.COTACAO_VENCEDORA

                            where linha.COTACAO_VENCEDORA == 0

                            select new
                            {
                                linha.NUMERO_PEDIDO_COMPRA,
                                linha.DATA_ITEM_COMPRA,
                                linha.CODIGO_PRODUTO_COMPRA,
                                linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                linha.QTDE_ITEM_COMPRA,
                                linha.PRECO_ITEM_COMPRA,
                                linha.PRECO_FINAL_FORNECEDOR,
                                linha.PREVISAO_ENTREGA_ITEM_COMPRA,

                                ITEM_JA_FECHADO = (from linha1 in ctx.TB_PEDIDO_COMPRAs

                                                   orderby linha1.NUMERO_PEDIDO_COMPRA

                                                   where linha1.NUMERO_PEDIDO_COMPRA == linha.NUMERO_PEDIDO_COMPRA
                                                   && linha1.ID_PRODUTO_COMPRA == linha.ID_PRODUTO_COMPRA
                                                   && linha1.COTACAO_VENCEDORA == 1

                                                   select linha1).Count()
                            };

                var rowCount = query.Count(f => f.ITEM_JA_FECHADO == 0);

                query = query.Where(f => f.ITEM_JA_FECHADO == 0);

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                return ApoioXML.objQueryToXML(ctx, query, rowCount);
            }
        }

        public static void Salva_Preco_Final_Fornecedor(List<Dictionary<string, object>> ITENS, decimal ADMIN_USUARIO, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < ITENS.Count; i++)
                {
                    Dictionary<string, object> item = ITENS[i];

                    Doran_Compras.Verifica_Preco_Maior_Sugestao_Vendas(item, ADMIN_USUARIO);

                    var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                                 orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                 where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(item["NUMERO_PEDIDO_COMPRA"])
                                 && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(item["NUMERO_ITEM_COMPRA"])

                                 select linha).ToList();

                    foreach (var item1 in query)
                    {
                        string PRECO_FINAL = item["PRECO_FINAL_FORNECEDOR"].ToString();

                        PRECO_FINAL = PRECO_FINAL.Replace(".", ",");

                        item1.PRECO_FINAL_FORNECEDOR = Convert.ToDecimal(PRECO_FINAL);

                        string QTDE1 = item["QTDE_FORNECEDOR"].ToString();
                        QTDE1 = QTDE1.Replace(".", ",");

                        decimal _QTDE_EMABALAGEM = 0;

                        string QTDE2 = item["QTDE_NA_EMBALAGEM_FORNECEDOR"].ToString();
                        QTDE2 = QTDE2.Replace(".", ",");

                        item1.QTDE_FORNECEDOR = decimal.TryParse(QTDE1, out _QTDE_EMABALAGEM) ?
                            Convert.ToDecimal(QTDE1) : 0;

                        item1.QTDE_NA_EMBALAGEM_FORNECEDOR = decimal.TryParse(QTDE2, out _QTDE_EMABALAGEM) ?
                            Convert.ToDecimal(QTDE2) : 0;

                        if (item1.PRECO_FINAL_FORNECEDOR > (decimal)0.00)
                        {
                            item1.COTACAO_ENVIADA = 1;
                            item1.COTACAO_RESPONDIDA = 1;
                        }
                        else
                        {
                            item1.COTACAO_ENVIADA = 0;
                            item1.COTACAO_RESPONDIDA = 0;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item1),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public static void Verifica_Preco_Maior_Sugestao_Vendas(Dictionary<string, object> item, decimal ADMIN_COMPRAS)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query1 = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                              orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                              where linha.NUMERO_PEDIDO_COMPRA == Convert.ToDecimal(item["NUMERO_PEDIDO_COMPRA"])
                              && linha.NUMERO_ITEM_COMPRA == Convert.ToDecimal(item["NUMERO_ITEM_COMPRA"])

                              select linha).ToList();

                foreach (var item1 in query1)
                {
                    var query = (from linha in ctx.TB_CUSTO_ITEM_PEDIDO_VENDAs
                                 orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM_PEDIDO

                                 where (linha.NUMERO_PEDIDO == item1.NUMERO_PEDIDO_VENDA
                                 && linha.NUMERO_ITEM_PEDIDO == item1.NUMERO_ITEM_VENDA)
                                 && linha.NUMERO_CUSTO_VENDA == 9

                                 select linha.CUSTO_ITEM_PEDIDO).ToList();

                    string PRECO_FINAL = item["PRECO_FINAL_FORNECEDOR"].ToString();

                    PRECO_FINAL = PRECO_FINAL.Replace(".", ",");

                    if ((Convert.ToDecimal(PRECO_FINAL) > query.First())
                        && ADMIN_COMPRAS != 1)
                    {
                        throw new Exception("O pre&ccedil;o de custo do fornecedor que o vendedor cadastrou est&aacute; menor que o pre&ccedil;o fechado pelo fornecedor<br /><br /> Pe&ccedil;a para algum administrador do sistema salvar este pre&ccedil;o.");
                    }
                }
            }
        }

        public static void Furo_Estoque(List<decimal> PEDIDOS, List<decimal> ITENS, bool VOLTAR_PROCESSO, decimal ID_USUARIO)
        {
            for (int i = 0; i < PEDIDOS.Count; i++)
            {
                string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    try
                    {
                        ctx.Connection.ConnectionString = str_conn;
                        ctx.Connection.Open();
                        ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                        var RECEBIMENTOS = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                                            orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                            where linha.NUMERO_PEDIDO_COMPRA == PEDIDOS[i]
                                                && linha.NUMERO_ITEM_COMPRA == ITENS[i]

                                            select new
                                            {
                                                linha.TB_PEDIDO_COMPRA.CODIGO_PRODUTO_COMPRA
                                            }).ToList();

                        if (RECEBIMENTOS.Count > 0)
                            throw new Exception("J&aacute; existem 1 ou mais recebimentos associados com o item [" + RECEBIMENTOS.First().CODIGO_PRODUTO_COMPRA.Trim() + "]");

                        // Deleta qualquer associação com o item de compra e o item de venda

                        var query = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                     orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                     where linha.NUMERO_PEDIDO_COMPRA == PEDIDOS[i]
                                     && linha.NUMERO_ITEM_COMPRA == ITENS[i]

                                     select linha).ToList();

                        decimal NUMERO_PEDIDO_VENDA = 0;
                        decimal NUMERO_ITEM_VENDA = 0;
                        decimal NUMERO_ITEM_COTACAO_ORIGINAL = 0;
                        decimal ID_PRODUTO = 0;

                        foreach (var item in query)
                        {
                            NUMERO_PEDIDO_VENDA = (decimal)item.NUMERO_PEDIDO_VENDA;
                            NUMERO_ITEM_VENDA = (decimal)item.NUMERO_ITEM_VENDA;

                            NUMERO_ITEM_COTACAO_ORIGINAL = item.TB_PEDIDO_COMPRA.NUMERO_ITEM_COTACAO_ORIGINAL.HasValue ?
                                (decimal)item.TB_PEDIDO_COMPRA.NUMERO_ITEM_COTACAO_ORIGINAL : 0;

                            ID_PRODUTO = (decimal)item.TB_PEDIDO_COMPRA.ID_PRODUTO_COMPRA;

                            ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item);
                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        // deleta o item de compra

                        var item_compra = (from linha in ctx.TB_PEDIDO_COMPRAs
                                           orderby linha.NUMERO_PEDIDO_COMPRA, linha.NUMERO_ITEM_COMPRA

                                           where linha.NUMERO_PEDIDO_COMPRA == PEDIDOS[i]
                                           && linha.NUMERO_ITEM_COMPRA == ITENS[i]

                                           select linha).ToList();

                        foreach (var item2 in item_compra)
                        {
                            ctx.TB_PEDIDO_COMPRAs.DeleteOnSubmit(item2);
                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item2, ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                        }

                        ctx.SubmitChanges();

                        if (VOLTAR_PROCESSO)
                        {
                            if (NUMERO_ITEM_COTACAO_ORIGINAL > 0)
                            {
                                var items = (from linha in ctx.TB_ASSOCIACAO_COMPRA_VENDAs
                                             orderby linha.NUMERO_ITEM_COMPRA
                                             where linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COTACAO_ORIGINAL
                                             select linha).ToList();

                                foreach (var item1 in items)
                                {
                                    ctx.TB_ASSOCIACAO_COMPRA_VENDAs.DeleteOnSubmit(item1);
                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_ASSOCIACAO_COMPRA_VENDAs.ToString(), ID_USUARIO);
                                }

                                ctx.SubmitChanges();

                                //

                                var query1 = (from linha in ctx.TB_PEDIDO_COMPRAs
                                              orderby linha.NUMERO_ITEM_COTACAO_ORIGINAL

                                              where linha.NUMERO_ITEM_COTACAO_ORIGINAL == NUMERO_ITEM_COTACAO_ORIGINAL
                                              && linha.ID_PRODUTO_COMPRA == ID_PRODUTO

                                              select linha).ToList();

                                foreach (var item1 in query1)
                                {
                                    ctx.TB_PEDIDO_COMPRAs.DeleteOnSubmit(item1);
                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item1, ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);
                                }

                                ctx.SubmitChanges();

                                // Volta o pedido de venda para aviso de compra

                                var query2 = (from linha in ctx.TB_PEDIDO_VENDAs
                                              orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM
                                              where linha.NUMERO_PEDIDO == NUMERO_PEDIDO_VENDA
                                              && linha.NUMERO_ITEM == NUMERO_ITEM_VENDA

                                              select linha).ToList();

                                foreach (var item in query2)
                                {
                                    item.STATUS_ITEM_PEDIDO = 16;

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item),
                                        "TB_PEDIDO_VENDA", item.NUMERO_PEDIDO, ID_USUARIO);
                                }

                                ctx.SubmitChanges();
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
            }
        }

        public static void Consistencia_ID_e_CODIGO_PRODUTO(decimal ID_PRODUTO, string CODIGO_PRODUTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_PRODUTOs
                             orderby linha.ID_PRODUTO

                             where linha.ID_PRODUTO == ID_PRODUTO
                             select linha.CODIGO_PRODUTO).ToList();

                foreach (var item in query)
                {
                    if (!item.Trim().Equals(CODIGO_PRODUTO))
                        throw new Exception("O c&oacute;digo do produto n&atilde;o &eacute; compat&iacute;vel com o ID");
                }
            }
        }

        public static Dictionary<string, List<decimal>> Retorna_preco_tabela_dos_fornecedores(decimal ID_PRODUTO, List<decimal> IDs_FORNECEDORES)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                ctx.Connection.Open();
                ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                var query = from linha in ctx.TB_FORNECEDOR_PRODUTOs
                            where linha.ID_PRODUTO == ID_PRODUTO
                            && IDs_FORNECEDORES.Contains(linha.CODIGO_FORNECEDOR)
                            select new
                            {
                                linha.CODIGO_FORNECEDOR,
                                linha.PRECO_FORNECEDOR,
                                linha.DESCONTO1,
                                linha.DESCONTO2,
                                linha.DESCONTO3
                            };

                Dictionary<string, List<decimal>> retorno = new Dictionary<string, List<decimal>>();
                List<decimal> fornecedores = new List<decimal>();
                List<decimal> precos = new List<decimal>();

                foreach (var item in query)
                {
                    decimal PRECO_FINAL = item.PRECO_FORNECEDOR.HasValue ? item.PRECO_FORNECEDOR.Value : 0;

                    if (PRECO_FINAL > (decimal)0.00)
                    {
                        PRECO_FINAL = item.DESCONTO1.HasValue ? PRECO_FINAL * (1 - (item.DESCONTO1.Value / 100)) : PRECO_FINAL;
                        PRECO_FINAL = item.DESCONTO2.HasValue ? PRECO_FINAL * (1 - (item.DESCONTO2.Value / 100)) : PRECO_FINAL;
                        PRECO_FINAL = item.DESCONTO3.HasValue ? PRECO_FINAL * (1 - (item.DESCONTO3.Value / 100)) : PRECO_FINAL;
                    }

                    fornecedores.Add(item.CODIGO_FORNECEDOR);
                    precos.Add(PRECO_FINAL);
                }

                retorno.Add("fornecedores", fornecedores);
                retorno.Add("precos", precos);

                return retorno;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}