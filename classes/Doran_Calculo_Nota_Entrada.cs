using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Data.Linq;
using System.Data.SqlClient;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;
using System.Data.Common;
using System.Configuration;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Calculo_Nota_Entrada : IDisposable
    {
        private decimal _NUMERO_SEQ;
        private string DADOS_ADICIONAIS { get; set; }
        private bool delete { get; set; }

        private decimal ID_USUARIO { get; set; }

        public Doran_Calculo_Nota_Entrada(decimal NUMERO_SEQ, decimal _ID_USUARIO)
        {
            _NUMERO_SEQ = NUMERO_SEQ;
            ID_USUARIO = _ID_USUARIO;

            delete = false;
        }

        public Dictionary<string, object> Calcula_e_Grava_Item_Nota_Entrada(Dictionary<string, object> dados)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                string CODIGO_CFOP = dados["CODIGO_CFOP_ITEM_NFE"].ToString();
                string CLAS_FISCAL_NF = dados["CODIGO_CF_ITEM_NFE"].ToString();


                decimal VALOR_TOTAL_ITEM_NFE = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NFE"]);
                decimal VALOR_IPI_ITEM_NFE = Math.Round(VALOR_TOTAL_ITEM_NFE * (Convert.ToDecimal(dados["ALIQ_IPI_ITEM_NFE"]) / 100), 2);

                decimal ALIQ_ICMS_ITEM_NFE = Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_NFE"]);
                decimal BASE_ICMS_ITEM_NFE = dados.ContainsKey("BASE_ICMS_ITEM_NFE") ?
                    Convert.ToDecimal(dados["BASE_ICMS_ITEM_NFE"]) :
                    Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NFE"]);

                decimal VALOR_ICMS_ITEM_NFE = Math.Round(BASE_ICMS_ITEM_NFE * (ALIQ_ICMS_ITEM_NFE / 100), 2);

                decimal BASE_ICMS_SUBS_ITEM_NFE = Convert.ToDecimal(dados["BASE_ICMS_SUBS_ITEM_NFE"]);
                decimal VALOR_ICMS_SUBS_ITEM_NFE = Convert.ToDecimal(dados["VALOR_ICMS_SUBS_ITEM_NFE"]);

                try
                {
                    ctx1.Connection.ConnectionString = str_conn;
                    ctx1.Connection.Open();
                    ctx1.Transaction = ctx1.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal ID_PRODUTO = 0;

                    if (!dados.ContainsKey("ID_PRODUTO"))
                    {
                        var query = (from linha1 in ctx1.TB_PRODUTOs
                                     where linha1.CODIGO_PRODUTO == dados["CODIGO_PRODUTO_ITEM_NFE"].ToString()
                                     select new
                                     {
                                         linha1.ID_PRODUTO
                                     }).ToList();

                        foreach (var item in query)
                            ID_PRODUTO = item.ID_PRODUTO;
                    }
                    else
                    {
                        if (!decimal.TryParse(dados["ID_PRODUTO"].ToString(), out ID_PRODUTO))
                            throw new Exception("ID de produto inv&aacute;lido");

                        ID_PRODUTO = Convert.ToDecimal(dados["ID_PRODUTO"]);
                    }

                    var existeProduto = (from linha1 in ctx1.TB_PRODUTOs
                                         where linha1.ID_PRODUTO == ID_PRODUTO
                                         select linha1).Any();

                    if (!existeProduto)
                    {
                        throw new Exception("C&oacute;digo de produto n&atilde;o cadastrado");
                    }

                    System.Data.Linq.Table<TB_ITEM_NOTA_ENTRADA> Entidade = ctx1.GetTable<TB_ITEM_NOTA_ENTRADA>();

                    TB_ITEM_NOTA_ENTRADA novo = new TB_ITEM_NOTA_ENTRADA();

                    novo.NUMERO_SEQ_NFE = _NUMERO_SEQ;
                    novo.ID_PRODUTO_ITEM_NFE = ID_PRODUTO;
                    novo.CODIGO_PRODUTO_ITEM_NFE = dados["CODIGO_PRODUTO_ITEM_NFE"].ToString().Trim();
                    novo.DESCRICAO_PRODUTO_ITEM_NFE = dados["DESCRICAO_PRODUTO_ITEM_NFE"].ToString().Trim();
                    novo.CODIGO_CF_ITEM_NFE = dados["CODIGO_CF_ITEM_NFE"].ToString();
                    novo.CODIGO_ST_ITEM_NFE = dados["CODIGO_ST_ITEM_NFE"].ToString();
                    novo.CODIGO_CFOP_ITEM_NFE = dados["CODIGO_CFOP_ITEM_NFE"].ToString();
                    novo.QTDE_ITEM_NFE = Convert.ToDecimal(dados["QTDE_ITEM_NFE"]);
                    novo.VALOR_UNITARIO_ITEM_NFE = Convert.ToDecimal(dados["VALOR_UNITARIO_ITEM_NFE"]);
                    novo.VALOR_TOTAL_ITEM_NFE = VALOR_TOTAL_ITEM_NFE;
                    novo.ALIQ_ICMS_ITEM_NFE = ALIQ_ICMS_ITEM_NFE;
                    novo.VALOR_ICMS_ITEM_NFE = VALOR_ICMS_ITEM_NFE;
                    novo.BASE_ICMS_ITEM_NFE = BASE_ICMS_ITEM_NFE;
                    novo.ALIQ_IPI_ITEM_NFE = Convert.ToDecimal(dados["ALIQ_IPI_ITEM_NFE"]);
                    novo.VALOR_IPI_ITEM_NFE = VALOR_IPI_ITEM_NFE;
                    novo.BASE_ICMS_SUBS_ITEM_NFE = BASE_ICMS_SUBS_ITEM_NFE;
                    novo.VALOR_ICMS_SUBS_ITEM_NFE = VALOR_ICMS_SUBS_ITEM_NFE;
                    novo.PERC_IVA_ITEM_NFE = Convert.ToDecimal(dados["PERC_IVA_ITEM_NFE"]);
                    novo.DATA_CHEGADA_ITEM_NFE = DateTime.Now;
                    novo.NUMERO_LOTE_ITEM_NFE = dados["NUMERO_LOTE_ITEM_NFE"].ToString();

                    novo.NUMERO_PEDIDO_COMPRA = dados.ContainsKey("NUMERO_PEDIDO_COMPRA") ? Convert.ToDecimal(dados["NUMERO_PEDIDO_COMPRA"]) : 0;
                    novo.NUMERO_ITEM_COMPRA = dados.ContainsKey("NUMERO_ITEM_COMPRA") ? Convert.ToDecimal(dados["NUMERO_ITEM_COMPRA"]) : 0;
                    novo.SALDO_ITEM_NFE = Convert.ToDecimal(dados["QTDE_ITEM_NFE"]);
                    novo.ABATIMENTO_CONCEDIDO = dados.ContainsKey("ABATIMENTO_CONCEDIDO") ? Convert.ToDecimal(dados["ABATIMENTO_CONCEDIDO"]) : 0;
                    novo.ALIQ_ICMS_SAIDA_ICMS_ST = dados.ContainsKey("ALIQ_ICMS_SAIDA_ICMS_ST") ? Convert.ToDecimal(dados["ALIQ_ICMS_SAIDA_ICMS_ST"]) : 0;
                    novo.PERCENTUAL_IPI_A_RECUPERAR = dados.ContainsKey("PERCENTUAL_IPI_A_RECUPERAR") ? Convert.ToDecimal(dados["PERCENTUAL_IPI_A_RECUPERAR"]) : 0;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx1, novo, Entidade.ToString(), ID_USUARIO);

                    ctx1.SubmitChanges();

                    var CFOP_DEVOLUCAO = (from linha1 in ctx1.TB_CFOPs
                                          where linha1.CODIGO_CFOP == novo.CODIGO_CFOP_ITEM_NFE
                                          select linha1.OPERACAO_DEVOLUCAO).ToList().First();

                    if (novo.ABATIMENTO_CONCEDIDO == 1 && CFOP_DEVOLUCAO == 1)
                    {
                        using (Doran_Saldo_Cliente_Fornecedor abatimento_cliente = new Doran_Saldo_Cliente_Fornecedor(Convert.ToDecimal(dados["ID_USUARIO"])))
                        {
                            abatimento_cliente.NUMERO_SEQ_NF_ENTRADA = novo.NUMERO_SEQ_NFE;
                            abatimento_cliente.NUMERO_ITEM_NF_ENTRADA = novo.NUMERO_SEQ_ITEM_NFE;
                            abatimento_cliente.Grava_Futuro_Abatimento_Cliente(novo.VALOR_TOTAL_ITEM_NFE, ctx1);
                        }
                    }

                    Dictionary<string, decimal> linha = new Dictionary<string, decimal>();

                    linha.Add("TOTAL_PRODUTOS_NFE", VALOR_TOTAL_ITEM_NFE);
                    linha.Add("TOTAL_IPI_NFE", VALOR_IPI_ITEM_NFE);
                    linha.Add("BASE_ICMS_NFE", BASE_ICMS_ITEM_NFE);
                    linha.Add("VALOR_ICMS_NFE", VALOR_ICMS_ITEM_NFE);
                    linha.Add("BASE_ICMS_SUBS_NFE", BASE_ICMS_SUBS_ITEM_NFE);
                    linha.Add("VALOR_ICMS_SUBS_NFE", VALOR_ICMS_SUBS_ITEM_NFE);

                    Dictionary<string, object> retorno = Calcula_e_Grava_Totais_Nota_Entrada(ctx1, linha, true);

                    ctx1.Transaction.Commit();

                    return retorno;
                }
                catch
                {
                    ctx1.Transaction.Rollback();
                    throw;
                }
            }
        }

        public Dictionary<string, object> Calcula_e_Atualiza_Item_Nota_Entrada(Dictionary<string, object> dados)
        {
            decimal VALOR_TOTAL_ITEM_NFE = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NFE"]);
            decimal VALOR_IPI_ITEM_NFE = Math.Round(VALOR_TOTAL_ITEM_NFE * (Convert.ToDecimal(dados["ALIQ_IPI_ITEM_NFE"]) / 100), 2);
            decimal ALIQ_ICMS_ITEM_NFE = Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_NFE"]);
            decimal BASE_ICMS_ITEM_NFE = dados.ContainsKey("BASE_ICMS_ITEM_NFE") ?
                Convert.ToDecimal(dados["BASE_ICMS_ITEM_NFE"]) :
                Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NFE"]);

            decimal VALOR_ICMS_ITEM_NFE = Math.Round(BASE_ICMS_ITEM_NFE * (Convert.ToDecimal(dados["ALIQ_ICMS_ITEM_NFE"]) / 100), 2);

            decimal BASE_ICMS_SUBS_ITEM_NFE = Convert.ToDecimal(dados["BASE_ICMS_SUBS_ITEM_NFE"]);
            decimal VALOR_ICMS_SUBS_ITEM_NFE = Convert.ToDecimal(dados["VALOR_ICMS_SUBS_ITEM_NFE"]);

            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx1.TB_ITEM_NOTA_ENTRADAs

                             where item.NUMERO_SEQ_NFE == _NUMERO_SEQ &&
                             item.NUMERO_SEQ_ITEM_NFE == Convert.ToDecimal(dados["NUMERO_SEQ_ITEM_NFE"])

                             select item).ToList();

                if (query.Count() == 0)
                    throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o item de NF com o ID [" + dados["CODIGO_PRODUTO_ITEM_NFE"].ToString() + "]");

                var query1 = (from linha1 in ctx1.TB_PRODUTOs
                              where linha1.CODIGO_PRODUTO == dados["CODIGO_PRODUTO_ITEM_NFE"].ToString()
                              select new
                              {
                                  linha1.ID_PRODUTO
                              }).ToList();

                if (!query1.Any())
                {
                    throw new Exception("C&oacute;digo de produto n&atilde;o cadastrado");
                }

                decimal ID_PRODUTO = 0;

                foreach (var item in query1)
                {
                    ID_PRODUTO = item.ID_PRODUTO;
                }

                Dictionary<string, decimal> linha = new Dictionary<string, decimal>();

                foreach (var nota in query)
                {
                    decimal ATOTAL_PRODUTOS_NFE = (decimal)nota.VALOR_TOTAL_ITEM_NFE;
                    decimal ATOTAL_IPI_NFE = (decimal)nota.VALOR_IPI_ITEM_NFE;
                    decimal ABASE_ICMS_NFE = (decimal)nota.BASE_ICMS_ITEM_NFE;
                    decimal AVALOR_ICMS_NFE = (decimal)nota.VALOR_ICMS_ITEM_NFE;
                    decimal ABASE_ICMS_SUBS_NFE = (decimal)nota.BASE_ICMS_SUBS_ITEM_NFE;
                    decimal AVALOR_ICMS_SUBS_NFE = (decimal)nota.VALOR_ICMS_SUBS_ITEM_NFE;

                    nota.ID_PRODUTO_ITEM_NFE = ID_PRODUTO;
                    nota.CODIGO_PRODUTO_ITEM_NFE = dados["CODIGO_PRODUTO_ITEM_NFE"].ToString();
                    nota.DESCRICAO_PRODUTO_ITEM_NFE = dados["DESCRICAO_PRODUTO_ITEM_NFE"].ToString();
                    nota.CODIGO_CF_ITEM_NFE = dados["CODIGO_CF_ITEM_NFE"].ToString();
                    nota.CODIGO_ST_ITEM_NFE = dados["CODIGO_ST_ITEM_NFE"].ToString();
                    nota.CODIGO_CFOP_ITEM_NFE = dados["CODIGO_CFOP_ITEM_NFE"].ToString();
                    nota.QTDE_ITEM_NFE = Convert.ToDecimal(dados["QTDE_ITEM_NFE"]);
                    nota.VALOR_UNITARIO_ITEM_NFE = Convert.ToDecimal(dados["VALOR_UNITARIO_ITEM_NFE"]);
                    nota.ALIQ_ICMS_ITEM_NFE = ALIQ_ICMS_ITEM_NFE;
                    nota.VALOR_ICMS_ITEM_NFE = VALOR_ICMS_ITEM_NFE;
                    nota.BASE_ICMS_ITEM_NFE = BASE_ICMS_ITEM_NFE;
                    nota.ALIQ_IPI_ITEM_NFE = Convert.ToDecimal(dados["ALIQ_IPI_ITEM_NFE"]);
                    nota.VALOR_IPI_ITEM_NFE = VALOR_IPI_ITEM_NFE;
                    nota.BASE_ICMS_SUBS_ITEM_NFE = BASE_ICMS_SUBS_ITEM_NFE;
                    nota.VALOR_ICMS_SUBS_ITEM_NFE = VALOR_ICMS_SUBS_ITEM_NFE;
                    nota.VALOR_TOTAL_ITEM_NFE = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NFE"]);
                    nota.PERC_IVA_ITEM_NFE = Convert.ToDecimal(dados["PERC_IVA_ITEM_NFE"]);
                    nota.DATA_CHEGADA_ITEM_NFE = DateTime.Now;
                    nota.NUMERO_LOTE_ITEM_NFE = dados["NUMERO_LOTE_ITEM_NFE"].ToString();
                    nota.ABATIMENTO_CONCEDIDO = dados.ContainsKey("ABATIMENTO_CONCEDIDO") ?
                        Convert.ToDecimal(dados["ABATIMENTO_CONCEDIDO"]) :
                        nota.ABATIMENTO_CONCEDIDO;

                    nota.ALIQ_ICMS_SAIDA_ICMS_ST = dados.ContainsKey("ALIQ_ICMS_SAIDA_ICMS_ST") ? Convert.ToDecimal(dados["ALIQ_ICMS_SAIDA_ICMS_ST"]) : 0;
                    nota.PERCENTUAL_IPI_A_RECUPERAR = dados.ContainsKey("PERCENTUAL_IPI_A_RECUPERAR") ? Convert.ToDecimal(dados["PERCENTUAL_IPI_A_RECUPERAR"]) : 0;

                    var CFOP_DEVOLUCAO = (from linha1 in ctx1.TB_CFOPs
                                          where linha1.CODIGO_CFOP == nota.CODIGO_CFOP_ITEM_NFE
                                          select linha1.OPERACAO_DEVOLUCAO).ToList().First();

                    if (nota.ABATIMENTO_CONCEDIDO == 1 && CFOP_DEVOLUCAO == 1)
                    {
                        //if (nota.VALOR_TOTAL_ITEM_NFE != VALOR_TOTAL_ITEM_NFE)
                        //{
                        using (Doran_Saldo_Cliente_Fornecedor abatimento_cliente = new Doran_Saldo_Cliente_Fornecedor(Convert.ToDecimal(dados["ID_USUARIO"])))
                        {
                            abatimento_cliente.NUMERO_SEQ_NF_ENTRADA = nota.NUMERO_SEQ_NFE;
                            abatimento_cliente.NUMERO_ITEM_NF_ENTRADA = nota.NUMERO_SEQ_ITEM_NFE;

                            abatimento_cliente.Cancela_Abatimento_Cliente(ctx1);

                            nota.VALOR_TOTAL_ITEM_NFE = VALOR_TOTAL_ITEM_NFE;

                            abatimento_cliente.Grava_Futuro_Abatimento_Cliente(nota.VALOR_TOTAL_ITEM_NFE, ctx1);
                        }
                        //}
                    }

                    if (nota.ABATIMENTO_CONCEDIDO != 1)
                    {
                        using (Doran_Saldo_Cliente_Fornecedor abatimento_cliente = new Doran_Saldo_Cliente_Fornecedor(ID_USUARIO))
                        {
                            abatimento_cliente.NUMERO_SEQ_NF_ENTRADA = nota.NUMERO_SEQ_NFE;
                            abatimento_cliente.NUMERO_ITEM_NF_ENTRADA = nota.NUMERO_SEQ_ITEM_NFE;

                            abatimento_cliente.Cancela_Abatimento_Cliente(ctx1);
                        }
                    }

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx1, ctx1.TB_ITEM_NOTA_ENTRADAs.GetModifiedMembers(nota),
                        ctx1.TB_ITEM_NOTA_ENTRADAs.ToString(), ID_USUARIO);

                    linha.Add("TOTAL_PRODUTOS_NFE", (-ATOTAL_PRODUTOS_NFE + VALOR_TOTAL_ITEM_NFE));
                    linha.Add("TOTAL_IPI_NFE", (-ATOTAL_IPI_NFE + VALOR_IPI_ITEM_NFE));
                    linha.Add("BASE_ICMS_NFE", (-ABASE_ICMS_NFE + BASE_ICMS_ITEM_NFE));
                    linha.Add("VALOR_ICMS_NFE", (-AVALOR_ICMS_NFE + VALOR_ICMS_ITEM_NFE));
                    linha.Add("BASE_ICMS_SUBS_NFE", (-ABASE_ICMS_SUBS_NFE + BASE_ICMS_SUBS_ITEM_NFE));
                    linha.Add("VALOR_ICMS_SUBS_NFE", (-AVALOR_ICMS_SUBS_NFE + VALOR_ICMS_SUBS_ITEM_NFE));
                }

                return Calcula_e_Grava_Totais_Nota_Entrada(ctx1, linha, true);
            }
        }

        public Dictionary<string, object> Deleta_Item_NF_e_Calcula_Totais(decimal NUMERO_SEQ_NFE, decimal NUMERO_SEQ_ITEM_NFE, bool Moeda)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_ITEM_NOTA_ENTRADAs
                             where item.NUMERO_SEQ_NFE == NUMERO_SEQ_NFE &&
                             item.NUMERO_SEQ_ITEM_NFE == NUMERO_SEQ_ITEM_NFE
                             select item).ToList();

                Dictionary<string, decimal> linha1 = new Dictionary<string, decimal>();

                foreach (var linha in query)
                {
                    linha1.Add("TOTAL_PRODUTOS_NFE", (decimal)linha.VALOR_TOTAL_ITEM_NFE);
                    linha1.Add("TOTAL_IPI_NFE", (decimal)linha.VALOR_IPI_ITEM_NFE);
                    linha1.Add("BASE_ICMS_NFE", (decimal)linha.BASE_ICMS_ITEM_NFE);
                    linha1.Add("VALOR_ICMS_NFE", (decimal)linha.VALOR_ICMS_ITEM_NFE);
                    linha1.Add("BASE_ICMS_SUBS_NFE", (decimal)linha.BASE_ICMS_SUBS_ITEM_NFE);
                    linha1.Add("VALOR_ICMS_SUBS_NFE", (decimal)linha.VALOR_ICMS_SUBS_ITEM_NFE);

                    using (Doran_Saldo_Cliente_Fornecedor abatimento_cliente = new Doran_Saldo_Cliente_Fornecedor(ID_USUARIO))
                    {
                        abatimento_cliente.NUMERO_SEQ_NF_ENTRADA = linha.NUMERO_SEQ_NFE;
                        abatimento_cliente.NUMERO_ITEM_NF_ENTRADA = linha.NUMERO_SEQ_ITEM_NFE;

                        abatimento_cliente.Cancela_Abatimento_Cliente(ctx);
                    }

                    ctx.TB_ITEM_NOTA_ENTRADAs.DeleteOnSubmit(linha);
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_ITEM_NOTA_ENTRADAs.ToString(), ID_USUARIO);
                }

                linha1["TOTAL_PRODUTOS_NFE"] = linha1["TOTAL_PRODUTOS_NFE"] * (-1);
                linha1["TOTAL_IPI_NFE"] = linha1["TOTAL_IPI_NFE"] * (-1);
                linha1["BASE_ICMS_NFE"] = linha1["BASE_ICMS_NFE"] * (-1);
                linha1["VALOR_ICMS_NFE"] = linha1["VALOR_ICMS_NFE"] * (-1);
                linha1["BASE_ICMS_SUBS_NFE"] = linha1["BASE_ICMS_SUBS_NFE"] * (-1);
                linha1["VALOR_ICMS_SUBS_NFE"] = linha1["VALOR_ICMS_SUBS_NFE"] * (-1);

                delete = true;
                return Calcula_e_Grava_Totais_Nota_Entrada(ctx, linha1, Moeda);
            }
        }

        public Dictionary<string, object> Calcula_e_Grava_Totais_Nota_Entrada(DataContext ctx, Dictionary<string, decimal> linha, bool Moeda)
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();

            var queryItens = (from itens in ctx.GetTable<TB_ITEM_NOTA_ENTRADA>()
                              where itens.NUMERO_SEQ_NFE == _NUMERO_SEQ
                              select itens).ToList();

            decimal TOTAL_PRODUTOS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NFE).ToString(), out TOTAL_PRODUTOS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NFE) : 0;

            decimal TOTAL_IPI_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_IPI_ITEM_NFE).ToString(), out TOTAL_IPI_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_IPI_ITEM_NFE) : 0;

            decimal BASE_ICMS_NFE = decimal.TryParse(queryItens.Sum(c => c.BASE_ICMS_ITEM_NFE).ToString(), out BASE_ICMS_NFE) ?
                (decimal)queryItens.Sum(c => c.BASE_ICMS_ITEM_NFE) : 0;

            decimal VALOR_ICMS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_ICMS_ITEM_NFE).ToString(), out VALOR_ICMS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_ICMS_ITEM_NFE) : 0;

            decimal BASE_ICMS_SUBS_NFE = decimal.TryParse(queryItens.Sum(c => c.BASE_ICMS_SUBS_ITEM_NFE).ToString(), out BASE_ICMS_SUBS_NFE) ?
                (decimal)queryItens.Sum(c => c.BASE_ICMS_SUBS_ITEM_NFE) : 0;

            decimal VALOR_ICMS_SUBS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_ICMS_SUBS_ITEM_NFE).ToString(), out VALOR_ICMS_SUBS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_ICMS_SUBS_ITEM_NFE) : 0;

            decimal VALOR_FRETE_NFE = 0;
            decimal OUTRAS_DESP_NFE = 0;
            decimal VALOR_SEGURO_NFE = 0;

            var query = (from item in ctx.GetTable<TB_NOTA_ENTRADA>()
                         where item.NUMERO_SEQ_NFE == _NUMERO_SEQ
                         select item).ToList();

            foreach (var nota in query)
            {
                VALOR_FRETE_NFE = (decimal)nota.VALOR_FRETE_NFE;
                VALOR_SEGURO_NFE = (decimal)nota.VALOR_SEGURO_NFE;
                OUTRAS_DESP_NFE = (decimal)nota.OUTRAS_DESP_NFE;
            }

            decimal TOTAL_NFE = query.First().SOMAR_O_FRETE_NO_TOTAL_DA_NF == 1 ?
                TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE + VALOR_ICMS_SUBS_NFE + VALOR_FRETE_NFE :
                TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE + VALOR_ICMS_SUBS_NFE;

            if (query.First().NAO_SOMAR_ICMS_ST_NO_TOTAL_NF == 1)
            {
                TOTAL_NFE = query.First().SOMAR_O_FRETE_NO_TOTAL_DA_NF == 1 ?
                    TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE + VALOR_FRETE_NFE :
                    TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE;
            }

            foreach (var nota in query)
            {
                nota.BASE_ICMS_NFE = BASE_ICMS_NFE;
                nota.VALOR_ICMS_NFE = VALOR_ICMS_NFE;
                nota.BASE_ICMS_SUBS_NFE = BASE_ICMS_SUBS_NFE;
                nota.VALOR_ICMS_SUBS_NFE = VALOR_ICMS_SUBS_NFE;
                nota.TOTAL_PRODUTOS_NFE = TOTAL_PRODUTOS_NFE;
                nota.TOTAL_IPI_NFE = TOTAL_IPI_NFE;
                nota.TOTAL_NFE = TOTAL_NFE;

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_NOTA_ENTRADA>().GetModifiedMembers(nota),
                    ctx.GetTable<TB_NOTA_ENTRADA>().ToString(), ID_USUARIO);

                ctx.SubmitChanges();
            }

            if (Moeda)
            {
                retorno.Add("BASE_ICMS_NFE", BASE_ICMS_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("VALOR_ICMS_NFE", VALOR_ICMS_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("BASE_ICMS_SUBS_NFE", BASE_ICMS_SUBS_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("VALOR_ICMS_SUBS_NFE", VALOR_ICMS_SUBS_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("TOTAL_PRODUTOS_NFE", TOTAL_PRODUTOS_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("TOTAL_IPI_NFE", TOTAL_IPI_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("TOTAL_NFE", TOTAL_NFE.ToString("c", CultureInfo.CurrentCulture));

                retorno.Add("VALOR_FRETE_NFE", VALOR_FRETE_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("VALOR_SEGURO_NFE", VALOR_SEGURO_NFE.ToString("c", CultureInfo.CurrentCulture));
                retorno.Add("OUTRAS_DESP_NFE", OUTRAS_DESP_NFE.ToString("c", CultureInfo.CurrentCulture));
            }
            else
            {
                retorno.Add("BASE_ICMS_NFE", BASE_ICMS_NFE.ToString());
                retorno.Add("VALOR_ICMS_NFE", VALOR_ICMS_NFE.ToString());
                retorno.Add("BASE_ICMS_SUBS_NFE", BASE_ICMS_SUBS_NFE.ToString());
                retorno.Add("VALOR_ICMS_SUBS_NFE", VALOR_ICMS_SUBS_NFE.ToString());
                retorno.Add("TOTAL_PRODUTOS_NFE", TOTAL_PRODUTOS_NFE.ToString());
                retorno.Add("TOTAL_IPI_NFE", TOTAL_IPI_NFE.ToString());
                retorno.Add("TOTAL_NFE", TOTAL_NFE.ToString());

                retorno.Add("VALOR_FRETE_NFE", VALOR_FRETE_NFE.ToString());
                retorno.Add("VALOR_SEGURO_NFE", VALOR_SEGURO_NFE.ToString());
                retorno.Add("OUTRAS_DESP_NFE", OUTRAS_DESP_NFE.ToString());
            }

            retorno.Add("DADOS_ADICIONAIS_NF", DADOS_ADICIONAIS);

            return retorno;
        }

        public Dictionary<string, object> Calcula_Totais_Nota_Entrada()
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.GetTable<TB_NOTA_ENTRADA>()
                             where item.NUMERO_SEQ_NFE == _NUMERO_SEQ
                             select item).ToList();

                foreach (var nota in query)
                {
                    retorno.Add("BASE_ICMS_NFE", ((decimal)nota.BASE_ICMS_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VALOR_ICMS_NFE", ((decimal)nota.VALOR_ICMS_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("BASE_ICMS_SUBS_NFE", ((decimal)nota.BASE_ICMS_SUBS_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VALOR_ICMS_SUBS_NFE", ((decimal)nota.VALOR_ICMS_SUBS_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_PRODUTOS_NFE", ((decimal)nota.TOTAL_PRODUTOS_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_IPI_NFE", ((decimal)nota.TOTAL_IPI_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_NFE", ((decimal)nota.TOTAL_NFE).ToString("c", CultureInfo.CurrentCulture));

                    retorno.Add("VALOR_FRETE_NFE", ((decimal)nota.VALOR_FRETE_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VALOR_SEGURO_NFE", ((decimal)nota.VALOR_SEGURO_NFE).ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("OUTRAS_DESP_NFE", ((decimal)nota.OUTRAS_DESP_NFE).ToString("c", CultureInfo.CurrentCulture));
                }
            }

            return retorno;
        }

        public Dictionary<string, object> ReCalcula_Totais_Nota_Entrada(DataContext ctx, TB_NOTA_ENTRADA nota)
        {
            var queryItens = (from itens in ctx.GetTable<TB_ITEM_NOTA_ENTRADA>()
                              where itens.NUMERO_SEQ_NFE == _NUMERO_SEQ
                              select itens).ToList();

            decimal TOTAL_PRODUTOS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NFE).ToString(), out TOTAL_PRODUTOS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NFE) : 0;

            decimal TOTAL_IPI_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_IPI_ITEM_NFE).ToString(), out TOTAL_IPI_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_IPI_ITEM_NFE) : 0;

            decimal BASE_ICMS_NFE = decimal.TryParse(queryItens.Sum(c => c.BASE_ICMS_ITEM_NFE).ToString(), out BASE_ICMS_NFE) ?
                (decimal)queryItens.Sum(c => c.BASE_ICMS_ITEM_NFE) : 0;

            decimal VALOR_ICMS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_ICMS_ITEM_NFE).ToString(), out VALOR_ICMS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_ICMS_ITEM_NFE) : 0;

            decimal BASE_ICMS_SUBS_NFE = decimal.TryParse(queryItens.Sum(c => c.BASE_ICMS_SUBS_ITEM_NFE).ToString(), out BASE_ICMS_SUBS_NFE) ?
                (decimal)queryItens.Sum(c => c.BASE_ICMS_SUBS_ITEM_NFE) : 0;

            decimal VALOR_ICMS_SUBS_NFE = decimal.TryParse(queryItens.Sum(c => c.VALOR_ICMS_SUBS_ITEM_NFE).ToString(), out VALOR_ICMS_SUBS_NFE) ?
                (decimal)queryItens.Sum(c => c.VALOR_ICMS_SUBS_ITEM_NFE) : 0;

            decimal VALOR_FRETE_NFE = 0;
            decimal OUTRAS_DESP_NFE = 0;
            decimal VALOR_SEGURO_NFE = 0;

            VALOR_FRETE_NFE = (decimal)nota.VALOR_FRETE_NFE;
            VALOR_SEGURO_NFE = (decimal)nota.VALOR_SEGURO_NFE;
            OUTRAS_DESP_NFE = (decimal)nota.OUTRAS_DESP_NFE;

            decimal TOTAL_NFE = queryItens.First().TB_NOTA_ENTRADA.NAO_SOMAR_ICMS_ST_NO_TOTAL_NF == 1 ?
                (TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE + VALOR_FRETE_NFE) :
                (TOTAL_PRODUTOS_NFE + TOTAL_IPI_NFE + VALOR_ICMS_SUBS_NFE + VALOR_FRETE_NFE);

            Dictionary<string, object> retorno = new Dictionary<string, object>();

            retorno.Add("BASE_ICMS_NFE", BASE_ICMS_NFE);
            retorno.Add("VALOR_ICMS_NFE", VALOR_ICMS_NFE);
            retorno.Add("BASE_ICMS_SUBS_NFE", BASE_ICMS_SUBS_NFE);
            retorno.Add("VALOR_ICMS_SUBS_NFE", VALOR_ICMS_SUBS_NFE);
            retorno.Add("TOTAL_PRODUTOS_NFE", TOTAL_PRODUTOS_NFE);
            retorno.Add("TOTAL_IPI_NFE", TOTAL_IPI_NFE);
            retorno.Add("TOTAL_NFE", TOTAL_NFE);

            return retorno;
        }

        public Dictionary<string, object> Atualiza_Forma_Calculo_Total_NF(decimal NAO_SOMAR_ICMS_ST_NO_TOTAL_NF)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_ENTRADAs
                             where linha.NUMERO_SEQ_NFE == _NUMERO_SEQ
                             select linha).ToList();

                foreach (var item in query)
                {
                    item.NAO_SOMAR_ICMS_ST_NO_TOTAL_NF = NAO_SOMAR_ICMS_ST_NO_TOTAL_NF;

                    if (item.NAO_SOMAR_ICMS_ST_NO_TOTAL_NF == 1)
                        item.TOTAL_NFE = item.TOTAL_PRODUTOS_NFE+ item.TOTAL_IPI_NFE;
                    else 
                        item.TOTAL_NFE = item.TOTAL_PRODUTOS_NFE + item.TOTAL_IPI_NFE + item.VALOR_ICMS_SUBS_NFE;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_ENTRADAs.GetModifiedMembers(item),
                        ctx.TB_ITEM_NOTA_ENTRADAs.ToString(), ID_USUARIO);
                }

                ctx.SubmitChanges();
            }

            Dictionary<string, object> retorno = Calcula_Totais_Nota_Entrada();

            return retorno;
        }

        public string Monta_Vencimentos_NFE()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query2 = (from linha in ctx.TB_NOTA_ENTRADAs
                              where linha.NUMERO_SEQ_NFE == _NUMERO_SEQ
                              select new
                              {
                                  linha.TB_CFOP.COBRANCA_ISENTA_CFOP
                              }).ToList();

                decimal? COBRANCA_ISENTA = 0;

                foreach (var item in query2)
                    COBRANCA_ISENTA = item.COBRANCA_ISENTA_CFOP;

                _NUMERO_SEQ = COBRANCA_ISENTA == 1 ? -1 : _NUMERO_SEQ;

                CultureInfo cultura = CultureInfo.CurrentCulture;
                string[] dias = cultura.DateTimeFormat.DayNames;

                var query1 = from linha in ctx.TB_FINANCEIROs
                             where linha.NUMERO_SEQ_NF_ENTRADA == _NUMERO_SEQ
                             select new
                             {
                                 VENCIMENTO = linha.DATA_VENCIMENTO,
                                 VALOR = linha.VALOR_TOTAL
                             };

                string retorno = "";
                DataTable dt1 = ApoioXML.ToDataTable(ctx, query1);

                dt1.Columns.Add("DIA");

                foreach (DataRow linha in dt1.Rows)
                    linha["DIA"] = dias[(int)((DateTime)linha["VENCIMENTO"]).DayOfWeek].ToUpper();

                if (dt1.Rows.Count > 0)
                {
                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    dt1.WriteXml(tr);

                    retorno = tr.ToString();
                }
                else
                {
                    decimal TOTAL_NF = 0;
                    decimal TOTAL_IPI = 0;
                    decimal CODIGO_CP = 0;
                    decimal VALOR_ICMS_ST = 0;
                    decimal TOTAL_PRODUTOS = 0;
                    decimal VALOR_FRETE = 0;
                    decimal FRETE = 0;

                    var query = (from nota in ctx.GetTable<TB_NOTA_ENTRADA>()
                                 where nota.NUMERO_SEQ_NFE == _NUMERO_SEQ
                                 select new
                                 {
                                     nota.CODIGO_CP_NFE,
                                     nota.TOTAL_NFE,
                                     nota.TOTAL_IPI_NFE,
                                     nota.VALOR_ICMS_SUBS_NFE,
                                     nota.TOTAL_PRODUTOS_NFE,
                                     nota.VALOR_FRETE_NFE,
                                     nota.FRETE_NFE
                                 }).ToList();

                    foreach (var item in query)
                    {
                        TOTAL_NF = (decimal)item.TOTAL_NFE;
                        TOTAL_IPI = (decimal)item.TOTAL_IPI_NFE;
                        CODIGO_CP = (decimal)item.CODIGO_CP_NFE;

                        TOTAL_PRODUTOS = (decimal)item.TOTAL_PRODUTOS_NFE;
                        VALOR_FRETE = (decimal)item.VALOR_FRETE_NFE;
                        VALOR_ICMS_ST = (decimal)item.VALOR_ICMS_SUBS_NFE;
                        FRETE = (decimal)item.FRETE_NFE;
                    }

                    Dictionary<DateTime, decimal> Parcelas = Calcula_Vencimentos_e_Valores(TOTAL_PRODUTOS, TOTAL_NF, TOTAL_IPI, VALOR_FRETE,
                        CODIGO_CP, VALOR_ICMS_ST, FRETE);

                    if (COBRANCA_ISENTA == 1)
                        Parcelas.Clear();

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
        }

        public static Dictionary<DateTime, decimal> Calcula_Vencimentos_e_Valores(decimal TOTAL_PRODUTOS, decimal TOTAL_NF, decimal TOTAL_IPI,
             decimal VALOR_FRETE, decimal CODIGO_CP, decimal VALOR_ICMS_ST, decimal FRETE)
        {
            string IPI_PRIMEIRA_PARCELA = "";
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
                VALOR_PARCELA = Math.Round(TOTAL_PRODUTOS / QTDE_PARCELAS, 2);

            decimal VALOR_PRIMEIRA_PARCELA = FRETE == 1 ?
                VALOR_PARCELA + VALOR_FRETE + VALOR_ICMS_ST :
                VALOR_PARCELA + VALOR_ICMS_ST;

            if (IPI_PRIMEIRA_PARCELA == "S")
                VALOR_PRIMEIRA_PARCELA += TOTAL_IPI;

            if (QTDE_PARCELAS > 1)
            {
                decimal VALOR_PARCELAS = VALOR_PARCELA * (QTDE_PARCELAS - 1);

                decimal DIFERENCA = TOTAL_NF - (VALOR_PRIMEIRA_PARCELA + VALOR_PARCELAS);

                VALOR_PRIMEIRA_PARCELA += (DIFERENCA);
            }

            DateTime venc1 = DateTime.Today.AddDays(1).AddSeconds(-1); ;
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

            parcelas.Add(venc1, VALOR_PRIMEIRA_PARCELA);

            if (QTDE_PARCELAS == 2)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 3)
            {
                parcelas.Add(venc2.AddDays(1).AddSeconds(-1), VALOR_PARCELA);
                parcelas.Add(venc3.AddDays(1).AddSeconds(-1), VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 4)
            {
                parcelas.Add(venc2.AddDays(1).AddSeconds(-1), VALOR_PARCELA);
                parcelas.Add(venc3.AddDays(1).AddSeconds(-1), VALOR_PARCELA);
                parcelas.Add(venc4.AddDays(1).AddSeconds(-1), VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 5)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 6)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 7)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, VALOR_PARCELA);
            }
            else if (QTDE_PARCELAS == 8)
            {
                parcelas.Add(venc2, VALOR_PARCELA);
                parcelas.Add(venc3, VALOR_PARCELA);
                parcelas.Add(venc4, VALOR_PARCELA);
                parcelas.Add(venc5, VALOR_PARCELA);
                parcelas.Add(venc6, VALOR_PARCELA);
                parcelas.Add(venc7, VALOR_PARCELA);
                parcelas.Add(venc8, VALOR_PARCELA);
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
                parcelas.Add(venc9, VALOR_PARCELA);
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
                parcelas.Add(venc10, VALOR_PARCELA);
            }

            return parcelas;
        }


        #region IDisposable Members

        public void Dispose()
        {
            _NUMERO_SEQ = 0;
        }

        #endregion
    }
}