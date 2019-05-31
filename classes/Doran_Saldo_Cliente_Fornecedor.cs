using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Saldo_Cliente_Fornecedor : IDisposable
    {
        public decimal? NUMERO_SEQ_NF_SAIDA { get; set; }
        public decimal? NUMERO_ITEM_NF_SAIDA { get; set; }

        public decimal? NUMERO_SEQ_NF_ENTRADA { get; set; }
        public decimal? NUMERO_ITEM_NF_ENTRADA { get; set; }

        public decimal? CODIGO_CLIENTE { get; set; }
        public decimal? CODIGO_FORNECEDOR { get; set; }
        private decimal ID_USUARIO { get; set; }

        public Doran_Saldo_Cliente_Fornecedor(decimal _ID_USUARIO)
        {
            CODIGO_CLIENTE = 0;
            CODIGO_FORNECEDOR = 0;

            ID_USUARIO = _ID_USUARIO;
        }

        #region Abatimento Cliente

        public void Grava_Futuro_Abatimento_Cliente(decimal? VALOR, DataContext ctx)
        {
            System.Data.Linq.Table<TB_SALDO_CLIENTE_FORNECEDOR> Entidade = ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>();

            TB_SALDO_CLIENTE_FORNECEDOR novo = new TB_SALDO_CLIENTE_FORNECEDOR();

            if (CODIGO_CLIENTE == 0)
            {
                CODIGO_CLIENTE = BuscaCodigoCliente();
            }

            novo.CODIGO_CLIENTE = CODIGO_CLIENTE;
            novo.CODIGO_FORNECEDOR = 0;
            novo.NUMERO_SEQ_NF_SAIDA = 0;
            novo.NUMERO_ITEM_NFS = 0;
            novo.NUMERO_SEQ_NF_ENTRADA = NUMERO_SEQ_NF_ENTRADA;
            novo.NUMERO_ITEM_NFE = NUMERO_ITEM_NF_ENTRADA;
            novo.DATA_LANCAMENTO = DateTime.Now;
            novo.VALOR_LANCAMENTO = VALOR;
            novo.SALDO_RESTANTE = VALOR;

            Entidade.InsertOnSubmit(novo);

            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
        }

        public void Cancela_Abatimento_Cliente(DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                         orderby linha.NUMERO_SEQ_NF_ENTRADA, linha.NUMERO_ITEM_NFE

                         where (linha.NUMERO_SEQ_NF_ENTRADA == NUMERO_SEQ_NF_ENTRADA
                         && linha.NUMERO_ITEM_NFE == NUMERO_ITEM_NF_ENTRADA)

                         select linha).ToList();

            foreach (var item in query)
            {
                ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().DeleteOnSubmit(item);
                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().ToString(), ID_USUARIO);
            }
        }

        public void Debita_Saldo_Abatimento_Cliente(decimal? VALOR_ABATIMENTO, DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                         orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                         where (linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                         && linha.SALDO_RESTANTE > (decimal)0.00)

                         select linha).ToList();

            foreach (var item in query)
            {
                if (VALOR_ABATIMENTO == (decimal)0.00)
                    break;

                if (item.SALDO_RESTANTE < VALOR_ABATIMENTO)
                {
                    VALOR_ABATIMENTO -= item.SALDO_RESTANTE;
                    item.SALDO_RESTANTE = 0;
                }
                else
                {
                    item.SALDO_RESTANTE -= VALOR_ABATIMENTO;
                    VALOR_ABATIMENTO = 0;
                }

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().GetModifiedMembers(item),
                    "TB_SALDO_CLIENTE_FORNECEDOR", ID_USUARIO);
            }
        }

        public Dictionary<string, object> Lista_Abatimentos_Pendentes_Cliente()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                var query = (from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs
                             orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                             where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                             && linha.SALDO_RESTANTE > (decimal)0.00

                             group linha by new
                             {
                                 linha.CODIGO_CLIENTE
                             }
                                 into agrupamento

                                 select new
                                 {
                                     agrupamento.Key.CODIGO_CLIENTE,
                                     SALDO_RESTANTE = agrupamento.Sum(d => d.SALDO_RESTANTE)
                                 }).ToList();

                retorno.Add("TOTAL_SALDO", query.Any() ? query.First().SALDO_RESTANTE : 0);

                // Abatimentos detalhados

                var query1 = from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs
                             orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                             where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                             && linha.SALDO_RESTANTE > (decimal)0.00

                             select new
                             {
                                 linha.ID_LANCAMENTO,
                                 linha.DATA_LANCAMENTO,
                                 linha.TB_ITEM_NOTA_ENTRADA.TB_NOTA_ENTRADA.NUMERO_NFE,
                                 linha.TB_ITEM_NOTA_ENTRADA.CODIGO_PRODUTO_ITEM_NFE,
                                 linha.TB_ITEM_NOTA_ENTRADA.TB_NOTA_ENTRADA.DATA_EMISSAO_NFE,
                                 linha.TB_ITEM_NOTA_ENTRADA.TB_NOTA_ENTRADA.CODIGO_CFOP_NFE,
                                 CLIENTE = linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                 linha.VALOR_LANCAMENTO
                             };

                string X = Doran_Base.ApoioXML.objQueryToXML(ctx, query1);

                retorno.Add("LANCAMENTOS", X);

                return retorno;
            }
        }

        public void Salva_Abatimentos(List<Dictionary<string, object>> dados, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < dados.Count; i++)
                {
                    var query = (from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs
                                 orderby linha.ID_LANCAMENTO

                                 where linha.ID_LANCAMENTO == Convert.ToDecimal(dados[i]["ID_LANCAMENTO"])

                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        string VALOR_LANCAMENTO = dados[i]["VALOR_LANCAMENTO"].ToString();
                        VALOR_LANCAMENTO = VALOR_LANCAMENTO.Replace(".", ",");
                        item.VALOR_LANCAMENTO = Convert.ToDecimal(VALOR_LANCAMENTO);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_SALDO_CLIENTE_FORNECEDORs.GetModifiedMembers(item),
                            "TB_SALDO_CLIENTE_FORNECEDOR", ID_USUARIO);
                    }
                }

                ctx.SubmitChanges();
            }
        }

        #endregion

        #region Abatimento Fornecedor

        public void Grava_Futuro_Abatimento_Fornecedor(decimal? VALOR, DataContext ctx)
        {
            System.Data.Linq.Table<TB_SALDO_CLIENTE_FORNECEDOR> Entidade = ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>();

            TB_SALDO_CLIENTE_FORNECEDOR novo = new TB_SALDO_CLIENTE_FORNECEDOR();

            if (CODIGO_FORNECEDOR == 0)
                CODIGO_FORNECEDOR = BuscaCodigoFornecedor();

            novo.CODIGO_CLIENTE = 0;
            novo.CODIGO_FORNECEDOR = CODIGO_FORNECEDOR;
            novo.NUMERO_SEQ_NF_SAIDA = NUMERO_SEQ_NF_SAIDA;
            novo.NUMERO_ITEM_NFS = NUMERO_ITEM_NF_SAIDA;
            novo.NUMERO_SEQ_NF_ENTRADA = 0;
            novo.NUMERO_ITEM_NFE = 0;
            novo.DATA_LANCAMENTO = DateTime.Now;
            novo.VALOR_LANCAMENTO = VALOR;
            novo.SALDO_RESTANTE = VALOR;

            Entidade.InsertOnSubmit(novo);

            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
        }

        public void Cancela_Abatimento_Fornecedor(DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                         orderby linha.NUMERO_SEQ_NF_SAIDA, linha.NUMERO_SEQ_NF_SAIDA

                         where (linha.NUMERO_SEQ_NF_SAIDA == NUMERO_SEQ_NF_SAIDA
                         && linha.NUMERO_ITEM_NFS == NUMERO_ITEM_NF_SAIDA)

                         select linha).ToList();

            foreach (var item in query)
            {
                ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().DeleteOnSubmit(item);
                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().ToString(), ID_USUARIO);
            }
        }

        public void Debita_Saldo_Abatimento_Fornecedor(decimal? VALOR_ABATIMENTO, DataContext ctx)
        {
            var query = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                         orderby linha.CODIGO_FORNECEDOR, linha.SALDO_RESTANTE

                         where (linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                         && linha.SALDO_RESTANTE > (decimal)0.00)

                         select linha).ToList();

            foreach (var item in query)
            {
                if (VALOR_ABATIMENTO == (decimal)0.00)
                    break;

                if (item.SALDO_RESTANTE < VALOR_ABATIMENTO)
                {
                    VALOR_ABATIMENTO -= item.SALDO_RESTANTE;
                    item.SALDO_RESTANTE = 0;
                }
                else
                {
                    item.SALDO_RESTANTE -= VALOR_ABATIMENTO;
                    VALOR_ABATIMENTO = 0;
                }

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>().GetModifiedMembers(item),
                    "TB_SALDO_CLIENTE_FORNECEDOR", ID_USUARIO);
            }
        }

        public Dictionary<string, object> Lista_Abatimentos_Pendentes_Fornecedor()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                var query = (from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs
                             orderby linha.CODIGO_FORNECEDOR, linha.SALDO_RESTANTE

                             where linha.CODIGO_FORNECEDOR == CODIGO_FORNECEDOR
                             && linha.SALDO_RESTANTE > (decimal)0.00

                             group linha by new
                             {
                                 linha.CODIGO_FORNECEDOR
                             }
                                 into agrupamento

                                 select new
                                 {
                                     agrupamento.Key.CODIGO_FORNECEDOR,
                                     SALDO_RESTANTE = agrupamento.Sum(d => d.SALDO_RESTANTE)
                                 }).ToList();

                retorno.Add("TOTAL_SALDO", query.Any() ? query.First().SALDO_RESTANTE : 0);

                // Abatimentos detalhados

                var query1 = from linha in ctx.TB_SALDO_CLIENTE_FORNECEDORs
                             orderby linha.CODIGO_FORNECEDOR, linha.SALDO_RESTANTE

                             where linha.CODIGO_FORNECEDOR == CODIGO_CLIENTE
                             && linha.SALDO_RESTANTE > (decimal)0.00

                             select new
                             {
                                 linha.DATA_LANCAMENTO,
                                 linha.TB_ITEM_NOTA_SAIDA.TB_NOTA_SAIDA.NUMERO_NF,
                                 linha.TB_ITEM_NOTA_SAIDA.TB_NOTA_SAIDA.DATA_EMISSAO_NF,
                                 linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                 linha.VALOR_LANCAMENTO
                             };

                string X = Doran_Base.ApoioXML.objQueryToXML(ctx, query1);

                retorno.Add("LANCAMENTOS", X);

                return retorno;
            }
        }

        #endregion

        public static DateTime? Ultima_Compra_do_Cliente_no_Produto(DataContext ctx, decimal CODIGO_CLIENTE, decimal ID_PRODUTO)
        {
            var query = (from linha in ctx.GetTable<TB_ITEM_NOTA_SAIDA>()
                         orderby linha.ID_PRODUTO_ITEM_NF, linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF, linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF descending

                         where linha.ID_PRODUTO_ITEM_NF == ID_PRODUTO
                            && linha.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                            && linha.TB_NOTA_SAIDA.STATUS_NF == 4

                         select linha.TB_NOTA_SAIDA.DATA_EMISSAO_NF).Take(1).ToList();

            return query.Any() ? query.First() : new DateTime(1901, 01, 01);
        }

        private decimal BuscaCodigoCliente()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_ENTRADAs
                             orderby linha.NUMERO_SEQ_NFE
                             where linha.NUMERO_SEQ_NFE == NUMERO_SEQ_NF_ENTRADA

                             select linha.TB_FORNECEDOR.CNPJ_FORNECEDOR).ToList();

                decimal retorno = 0;

                foreach (var item in query)
                {
                    var CODIGO_CLIENTE = (from linha in ctx.TB_CLIENTEs
                                          orderby linha.CNPJ_CLIENTE
                                          where linha.CNPJ_CLIENTE == item
                                          select linha.ID_CLIENTE).ToList();

                    if (!CODIGO_CLIENTE.Any())
                        throw new Exception("N&atilde;o foi encontrado nenhum cliente cadastrado com o CNPJ desta nota");

                    retorno = CODIGO_CLIENTE.First();
                }

                return retorno;
            }
        }

        private decimal BuscaCodigoFornecedor()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_NOTA_SAIDAs
                             orderby linha.NUMERO_SEQ
                             where linha.NUMERO_SEQ == NUMERO_SEQ_NF_SAIDA

                             select linha.TB_CLIENTE.CNPJ_CLIENTE).ToList();

                decimal retorno = 0;

                foreach (var item in query)
                {
                    var CODIGO_FORNECEDOR = (from linha in ctx.TB_FORNECEDORs
                                             orderby linha.CNPJ_FORNECEDOR
                                             where linha.CNPJ_FORNECEDOR == item
                                             select linha.CODIGO_FORNECEDOR).ToList();

                    if (!CODIGO_FORNECEDOR.Any())
                        throw new Exception("N&atilde;o foi encontrado nenhum fornecedor cadastrado com o CNPJ desta nota");

                    retorno = CODIGO_FORNECEDOR.First();
                }

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
