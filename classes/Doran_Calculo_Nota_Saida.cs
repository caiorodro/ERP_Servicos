using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Data.Linq;
using System.Data.SqlClient;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;
using System.Configuration;
using System.Data;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Calculo_Nota_Saida : IDisposable
    {
        private decimal _NUMERO_SEQ;
        private string DADOS_ADICIONAIS;
        private string _CODIGO_PRODUTO;
        private bool delete;

        private decimal ID_USUARIO { get; set; }

        public Doran_Calculo_Nota_Saida(decimal NUMERO_SEQ, decimal _ID_USUARIO)
        {
            _NUMERO_SEQ = NUMERO_SEQ;
            ID_USUARIO = _ID_USUARIO;

            delete = false;
        }

        /// <summary>
        /// Calcula os impostos do item da nota fiscal (ICMS, Base ICMS, ICMS de Substituição, ICMS de Substituição e Total IPI, 
        /// e grava na tabela TB_ITEM_NOTA_SAIDA
        /// </summary>
        /// <param name="dados">Objeto JSON com as informações das colunas da tabela</param>
        /// <returns>Retorna os totais da nota</returns>
        public Dictionary<string, object> Calcula_e_Grava_Item_Nota_Saida(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal CODIGO_CLIENTE = dados.ContainsKey("ID_CLIENTE") ?
                        decimal.TryParse(dados["ID_CLIENTE"].ToString(), out CODIGO_CLIENTE) ?
                                Convert.ToDecimal(dados["ID_CLIENTE"]) : 0
                                : 0;

                    if (!dados.ContainsKey("ID_PRODUTO"))
                    {
                        dados.Add("ID_PRODUTO", Busca_ID_PRODUTO(dados["CODIGO_PRODUTO_ITEM_NF"].ToString()));
                    }

                    decimal ALIQ_ISS = dados.ContainsKey("ALIQ_ISS_ITEM_NF") ? decimal.TryParse(dados["ALIQ_ISS_ITEM_NF"].ToString(), out ALIQ_ISS) ?
                        Convert.ToDecimal(dados["ALIQ_ISS_ITEM_NF"]) : 0 :
                        decimal.TryParse(dados["ALIQ_ISS"].ToString(), out ALIQ_ISS) ?
                        Convert.ToDecimal(dados["ALIQ_ISS"]) : 0;

                    decimal VALOR_TOTAL_ITEM_NF = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NF"]);

                    decimal VALOR_ISS_ITEM_NF = ALIQ_ISS > Convert.ToDecimal(0.00) ?
                        Math.Round(VALOR_TOTAL_ITEM_NF * (ALIQ_ISS / 100), 2, MidpointRounding.ToEven) : 0;

                    decimal BASE_ISS_ITEM_NF = VALOR_TOTAL_ITEM_NF;

                    System.Data.Linq.Table<TB_ITEM_NOTA_SAIDA> Entidade = ctx.GetTable<TB_ITEM_NOTA_SAIDA>();

                    TB_ITEM_NOTA_SAIDA novo = new TB_ITEM_NOTA_SAIDA();

                    novo.NUMERO_ITEM_NF = _NUMERO_SEQ;
                    novo.ID_PRODUTO_ITEM_NF = Convert.ToDecimal(dados["ID_PRODUTO"]);
                    novo.CODIGO_PRODUTO_ITEM_NF = dados["CODIGO_PRODUTO_ITEM_NF"].ToString();
                    novo.DESCRICAO_PRODUTO_ITEM_NF = dados["DESCRICAO_PRODUTO_ITEM_NF"].ToString();

                    novo.UNIDADE_MEDIDA_ITEM_NF = dados["UNIDADE_MEDIDA_ITEM_NF"].ToString();
                    novo.QTDE_ITEM_NF = Convert.ToDecimal(dados["QTDE_ITEM_NF"]);
                    novo.VALOR_UNITARIO_ITEM_NF = Convert.ToDecimal(dados["VALOR_UNITARIO_ITEM_NF"]);

                    novo.VALOR_DESCONTO_ITEM_NF = dados.ContainsKey("VALOR_DESCONTO_ITEM_NF") ?
                        Convert.ToDecimal(dados["VALOR_DESCONTO_ITEM_NF"]) : 0;

                    novo.VALOR_TOTAL_ITEM_NF = VALOR_TOTAL_ITEM_NF;
                    novo.VALOR_ISS_ITEM_NF = VALOR_ISS_ITEM_NF;
                    novo.ALIQ_ISS_ITEM_NF = ALIQ_ISS;
                    novo.BASE_ISS_ITEM_NF = BASE_ISS_ITEM_NF;

                    novo.NUMERO_PEDIDO_VENDA = dados.ContainsKey("NUMERO_PEDIDO_VENDA") ?
                        Convert.ToDecimal(dados["NUMERO_PEDIDO_VENDA"]) : 0;

                    novo.NUMERO_ITEM_PEDIDO_VENDA = dados.ContainsKey("NUMERO_ITEM_PEDIDO_VENDA") ?
                        Convert.ToDecimal(dados["NUMERO_ITEM_PEDIDO_VENDA"]) : 0;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                    ctx.SubmitChanges();

                    Dictionary<string, decimal> linha1 = new Dictionary<string, decimal>();

                    linha1.Add("TOTAL_SERVICOS_NF", VALOR_TOTAL_ITEM_NF);
                    linha1.Add("TOTAL_ISS_NF", VALOR_ISS_ITEM_NF);
                    linha1.Add("BASE_ISS_NF", BASE_ISS_ITEM_NF);

                    ctx.Transaction.Commit();

                    return Calcula_e_Grava_Totais_Nota_Saida(linha1, true);
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }
        }

        public Dictionary<string, object> Calcula_e_Atualiza_Item_Nota_Saida(Dictionary<string, object> dados)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal CODIGO_CLIENTE = decimal.TryParse(dados["ID_CLIENTE"].ToString(), out CODIGO_CLIENTE) ?
                                Convert.ToDecimal(dados["ID_CLIENTE"]) : 0;

                    decimal ALIQ_ISS = decimal.TryParse(dados["ALIQ_ISS_ITEM_NF"].ToString(), out ALIQ_ISS) ?
                        Convert.ToDecimal(dados["ALIQ_ISS_ITEM_NF"]) : 0;

                    decimal VALOR_TOTAL_ITEM_NF = Convert.ToDecimal(dados["VALOR_TOTAL_ITEM_NF"]);

                    decimal VALOR_ISS_ITEM_NF = ALIQ_ISS > Convert.ToDecimal(0.00) ?
                        Math.Round(VALOR_TOTAL_ITEM_NF * (ALIQ_ISS / 100), 2, MidpointRounding.ToEven) : 0;

                    decimal BASE_ISS_ITEM_NF = VALOR_TOTAL_ITEM_NF;

                    ///////////////////

                    decimal ID_PRODUTO = 0;

                    if (!dados.ContainsKey("ID_PRODUTO"))
                    {
                        var query1 = (from linha1 in ctx.TB_PRODUTOs
                                      where linha1.CODIGO_PRODUTO == dados["CODIGO_PRODUTO_ITEM_NF"].ToString()
                                      select new
                                      {
                                          linha1.ID_PRODUTO
                                      }).ToList();

                        foreach (var item in query1)
                        {
                            ID_PRODUTO = item.ID_PRODUTO;
                        }
                    }
                    else
                    {
                        ID_PRODUTO = Convert.ToDecimal(dados["ID_PRODUTO"]);
                    }

                    var query5 = from item in ctx.TB_ITEM_NOTA_SAIDAs
                                 where item.NUMERO_ITEM_NF == _NUMERO_SEQ &&
                                 item.SEQUENCIA_ITEM_NF == Convert.ToDecimal(dados["SEQ"])
                                 select item;

                    if (query5.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o item de NF com o ID [" + dados["CODIGO_PRODUTO_ITEM_NF"].ToString() + "]");

                    Dictionary<string, decimal> linha2 = new Dictionary<string, decimal>();

                    foreach (var nota in query5)
                    {
                        decimal ATOTAL_PRODUTOS_NF = (decimal)nota.VALOR_TOTAL_ITEM_NF;

                        nota.ID_PRODUTO_ITEM_NF = ID_PRODUTO;
                        nota.CODIGO_PRODUTO_ITEM_NF = dados["CODIGO_PRODUTO_ITEM_NF"].ToString();
                        nota.DESCRICAO_PRODUTO_ITEM_NF = dados["DESCRICAO_PRODUTO_ITEM_NF"].ToString();
                        nota.UNIDADE_MEDIDA_ITEM_NF = dados["UNIDADE_MEDIDA_ITEM_NF"].ToString();
                        nota.QTDE_ITEM_NF = Convert.ToDecimal(dados["QTDE_ITEM_NF"]);

                        nota.VALOR_UNITARIO_ITEM_NF = Convert.ToDecimal(dados["VALOR_UNITARIO_ITEM_NF"]);
                        nota.VALOR_DESCONTO_ITEM_NF = 0;
                        nota.VALOR_TOTAL_ITEM_NF = VALOR_TOTAL_ITEM_NF;

                        nota.VALOR_ISS_ITEM_NF = VALOR_ISS_ITEM_NF;
                        nota.ALIQ_ISS_ITEM_NF = ALIQ_ISS;
                        nota.BASE_ISS_ITEM_NF = BASE_ISS_ITEM_NF;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_NOTA_SAIDAs.GetModifiedMembers(nota),
                            ctx.TB_ITEM_NOTA_SAIDAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();

                        linha2.Add("TOTAL_PRODUTOS_NF", (-ATOTAL_PRODUTOS_NF + VALOR_TOTAL_ITEM_NF));
                    }

                    _CODIGO_PRODUTO = dados["CODIGO_PRODUTO_ITEM_NF"].ToString();

                    ctx.Transaction.Commit();

                    return Calcula_e_Grava_Totais_Nota_Saida(linha2, true);
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }
        }

        public Dictionary<string, object> Deleta_Item_NF_e_Calcula_Totais(decimal NUMERO_ITEM_NF, decimal SEQUENCIA_ITEM_NF, bool Moeda)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query1 = (from item in ctx.TB_NOTA_SAIDAs
                              where item.NUMERO_SEQ == NUMERO_ITEM_NF
                              select item).ToList();

                foreach (var linha in query1)
                {
                    if (linha.EMITIDA_NF == 1 || linha.CANCELADA_NF == 1)
                        throw new Exception("Este item n&atilde;o pode ser deletado. A nota já foi emitida ou cancelada.");
                }

                var query = (from item in ctx.TB_ITEM_NOTA_SAIDAs
                             where item.NUMERO_ITEM_NF == NUMERO_ITEM_NF &&
                             item.SEQUENCIA_ITEM_NF == SEQUENCIA_ITEM_NF
                             select item).ToList();

                Dictionary<string, decimal> linha1 = new Dictionary<string, decimal>();

                foreach (var linha in query)
                {
                    _CODIGO_PRODUTO = linha.CODIGO_PRODUTO_ITEM_NF;

                    linha1.Add("TOTAL_SERVICOS_NF", (decimal)linha.VALOR_TOTAL_ITEM_NF);
                    linha1.Add("BASE_ISS_NF", (decimal)linha.VALOR_TOTAL_ITEM_NF);
                    linha1.Add("VALOR_ISS_NF", Math.Round(linha.VALOR_TOTAL_ITEM_NF.Value * (linha.ALIQ_ISS_ITEM_NF.Value / 100), 2, MidpointRounding.ToEven));

                    ctx.TB_ITEM_NOTA_SAIDAs.DeleteOnSubmit(linha);
                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_ITEM_NOTA_SAIDAs.ToString(), ID_USUARIO);

                    ctx.SubmitChanges();
                }

                linha1["TOTAL_SERVICOS_NF"] = linha1["TOTAL_SERVICOS_NF"] * (-1);
                linha1["BASE_ISS_NF"] = linha1["BASE_ISS_NF"] * (-1);
                linha1["VALOR_ISS_NF"] = linha1["VALOR_ISS_NF"] * (-1);

                delete = true;
                return Calcula_e_Grava_Totais_Nota_Saida(linha1, Moeda);
            }
        }

        public Dictionary<string, object> Calcula_e_Grava_Totais_Nota_Saida(Dictionary<string, decimal> linha, bool Moeda)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                var queryItens = (from itens in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                                  where itens.NUMERO_ITEM_NF == _NUMERO_SEQ
                                  select itens).ToList();


                decimal TOTAL_SERVICOS_NF = decimal.TryParse(queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NF).ToString(), out TOTAL_SERVICOS_NF) ?
                    (decimal)queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NF) : 0;

                decimal TOTAL_ISS_NF = decimal.TryParse(queryItens.Sum(c => c.VALOR_ISS_ITEM_NF).ToString(), out TOTAL_ISS_NF) ?
                    (decimal)queryItens.Sum(c => c.VALOR_ISS_ITEM_NF) : 0;

                decimal BASE_ISS_NF = decimal.TryParse(queryItens.Sum(c => c.BASE_ISS_ITEM_NF).ToString(), out BASE_ISS_NF) ?
                    (decimal)queryItens.Sum(c => c.BASE_ISS_ITEM_NF) : 0;

                decimal TOTAL_NF = TOTAL_SERVICOS_NF;

                Completa_DADOS_ADICIONAIS_NF();

                var query = (from linha1 in ctx.TB_NOTA_SAIDAs
                             where linha1.NUMERO_SEQ == _NUMERO_SEQ
                             select linha1).ToList();

                foreach (var nota in query)
                {
                    nota.BASE_ISS_NF = BASE_ISS_NF;
                    nota.VALOR_ISS_NF = TOTAL_ISS_NF;
                    nota.TOTAL_SERVICOS_NF = TOTAL_SERVICOS_NF;
                    nota.TOTAL_NF = TOTAL_SERVICOS_NF;

                    TOTAL_NF = nota.TOTAL_NF.Value;

                    nota.DADOS_ADICIONAIS_NF = DADOS_ADICIONAIS;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_NOTA_SAIDA>().GetModifiedMembers(nota),
                        ctx.GetTable<TB_NOTA_SAIDA>().ToString(), ID_USUARIO);

                    ctx.SubmitChanges();
                }

                if (Moeda)
                {
                    retorno.Add("BASE_ISS_NF", BASE_ISS_NF.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VALOR_ISS_NF", TOTAL_ISS_NF.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_SERVICOS_NF", TOTAL_SERVICOS_NF.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_NF", TOTAL_NF.ToString("c", CultureInfo.CurrentCulture));
                }
                else
                {
                    retorno.Add("BASE_ISS_NF", BASE_ISS_NF.ToString());
                    retorno.Add("VALOR_ISS_NF", TOTAL_ISS_NF.ToString());
                    retorno.Add("TOTAL_SERVICOS_NF", TOTAL_SERVICOS_NF.ToString());
                    retorno.Add("TOTAL_NF", TOTAL_NF.ToString());
                }

                retorno.Add("DADOS_ADICIONAIS_NF", DADOS_ADICIONAIS);

                return retorno;
            }
        }

        public Dictionary<string, object> Calcula_Totais_Nota_Saida()
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.GetTable<TB_NOTA_SAIDA>()
                             where item.NUMERO_SEQ == _NUMERO_SEQ
                             select item).ToList();

                foreach (var nota in query)
                {
                    retorno.Add("BASE_ISS_NF", nota.BASE_ISS_NF.Value.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("VALOR_ISS_NF", nota.VALOR_ISS_NF.Value.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_SERVICOS_NF", nota.TOTAL_SERVICOS_NF.Value.ToString("c", CultureInfo.CurrentCulture));
                    retorno.Add("TOTAL_NF", nota.TOTAL_NF.Value.ToString("c", CultureInfo.CurrentCulture));
                }
            }

            return retorno;
        }

        public Dictionary<string, object> Recalcula_Totais_Nota_Saida(DataContext ctx, TB_NOTA_SAIDA nota)
        {
            var queryItens = (from itens in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                              where itens.NUMERO_ITEM_NF == _NUMERO_SEQ
                              select itens).ToList();

            decimal TOTAL_SERVICOS_NF = decimal.TryParse(queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NF).ToString(), out TOTAL_SERVICOS_NF) ?
                (decimal)queryItens.Sum(c => c.VALOR_TOTAL_ITEM_NF) : 0;

            decimal TOTAL_ISS_NF = decimal.TryParse(queryItens.Sum(c => c.VALOR_ISS_ITEM_NF).ToString(), out TOTAL_ISS_NF) ?
                (decimal)queryItens.Sum(c => c.VALOR_ISS_ITEM_NF) : 0;

            decimal BASE_ISS_NF = decimal.TryParse(queryItens.Sum(c => c.BASE_ISS_ITEM_NF).ToString(), out BASE_ISS_NF) ?
                (decimal)queryItens.Sum(c => c.BASE_ISS_ITEM_NF) : 0;

            decimal TOTAL_NF = TOTAL_SERVICOS_NF;

            TOTAL_NF = Math.Round(TOTAL_NF, 2);

            Completa_DADOS_ADICIONAIS_NF();

            Dictionary<string, object> retorno = new Dictionary<string, object>();

            retorno.Add("BASE_ISS_NF", BASE_ISS_NF.ToString("c", CultureInfo.CurrentCulture));
            retorno.Add("VALOR_ISS_NF", TOTAL_ISS_NF.ToString("c", CultureInfo.CurrentCulture));
            retorno.Add("TOTAL_SERVICOS_NF", TOTAL_SERVICOS_NF.ToString("c", CultureInfo.CurrentCulture));
            retorno.Add("TOTAL_NF", TOTAL_NF.ToString("c", CultureInfo.CurrentCulture));
            retorno.Add("DADOS_ADICIONAIS_NF", DADOS_ADICIONAIS);

            return retorno;
        }

        private decimal Busca_ID_PRODUTO(string CODIGO_PRODUTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                decimal retorno = 0;

                var query = (from linha in ctx.TB_PRODUTOs
                             orderby linha.CODIGO_PRODUTO

                             where linha.CODIGO_PRODUTO == CODIGO_PRODUTO

                             select linha.ID_PRODUTO).ToList();

                foreach (var item in query)
                {
                    retorno = item;
                }

                return retorno;
            }
        }

        private void Completa_DADOS_ADICIONAIS_NF()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                             where linha.NUMERO_ITEM_NF == _NUMERO_SEQ
                             select new
                             {
                                 linha.CODIGO_PRODUTO_ITEM_NF
                             }).Distinct();

                List<string> retorno = new List<string>();

                if (delete)
                {
                    query = query.Where(i => i.CODIGO_PRODUTO_ITEM_NF != _CODIGO_PRODUTO);
                }
                else
                {
                    var query1 = (from linha in ctx.TB_PRODUTOs
                                  where linha.CODIGO_PRODUTO == _CODIGO_PRODUTO
                                  select linha).ToList();

                    //foreach (var item in query1)
                    //    retorno.Add(item.TB_SIT_TRIB.ST_MENSAGEM.Trim() + "<br />");
                }

                retorno.Add(DADOS_ADICIONAIS);

                DADOS_ADICIONAIS = "";

                for (int i = 0; i < retorno.Count; i++)
                    DADOS_ADICIONAIS += retorno[i];

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