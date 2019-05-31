using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Copia_Orcamento : IDisposable
    {
        private decimal NUMERO_ORCAMENTO { get; set; }
        private string CHAVE_ORCAMENTO { get; set; }
        private decimal NOVO_NUMERO_ORCAMENTO { get; set; }

        public Doran_Copia_Orcamento(decimal pNUMERO_ORCAMENTO)
        {
            NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;
        }

        public Dictionary<string, object> Copia_Orcamento(decimal ID_USUARIO, double DIAS_PRAZO_ORCAMENTO)
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();
            
            DateTime entrega = DateTime.Today;

            while (Doran_TitulosVencidos.Feriado_FimDeSemana(entrega))
                entrega = entrega.AddDays(1);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).ToList();

                foreach (var item in query)
                {
                    System.Data.Linq.Table<TB_ORCAMENTO_VENDA> Entidade = ctx.GetTable<TB_ORCAMENTO_VENDA>();

                    TB_ORCAMENTO_VENDA novo = new TB_ORCAMENTO_VENDA();

                    using (Doran_Comercial_Orcamentos oc = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                    {
                        CHAVE_ORCAMENTO = oc.CRIA_CHAVE_ORCAMENTO();
                    }

                    if (CHAVE_ORCAMENTO.Length > 100)
                        CHAVE_ORCAMENTO = CHAVE_ORCAMENTO.Substring(0, 100);

                    novo.DATA_ORCAMENTO = DateTime.Now;
                    novo.CODIGO_COND_PAGTO = item.CODIGO_COND_PAGTO;
                    novo.CODIGO_CLIENTE_ORCAMENTO = item.CODIGO_CLIENTE_ORCAMENTO;
                    novo.CODIGO_VENDEDOR = item.CODIGO_VENDEDOR;
                    novo.CONTATO_ORCAMENTO = item.CONTATO_ORCAMENTO;
                    novo.EMAIL_CONTATO = item.EMAIL_CONTATO;
                    novo.NUMERO_REVISAO = 1;
                    novo.TELEFONE_CONTATO = item.TELEFONE_CONTATO;
                    novo.TEXTO_PROPOSTA = item.TEXTO_PROPOSTA;
                    novo.CHAVE_ORCAMENTO = CHAVE_ORCAMENTO;
                    novo.ID_UF_ORCAMENTO = item.ID_UF_ORCAMENTO;
                    novo.OBS_ORCAMENTO = item.OBS_ORCAMENTO;
                    novo.VALIDADE_ORCAMENTO = DateTime.Today.AddDays(DIAS_PRAZO_ORCAMENTO);
                    novo.NUMERO_REVISAO = 0;
                    novo.OBS_NF_ORCAMENTO = item.OBS_NF_ORCAMENTO;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                    retorno.Add("DATA_ORCAMENTO", ApoioXML.TrataData2(DateTime.Today));
                    retorno.Add("NOMEFANTASIA_CLIENTE", item.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim());
                    retorno.Add("CONTATO_ORCAMENTO", item.CONTATO_ORCAMENTO.Trim());
                    retorno.Add("TELEFONE_CONTATO", item.TELEFONE_CONTATO.Trim());
                    retorno.Add("EMAIL_CONTATO", item.EMAIL_CONTATO.Trim());
                    retorno.Add("VALIDADE_ORCAMENTO", ApoioXML.TrataData2(DateTime.Today.AddDays(DIAS_PRAZO_ORCAMENTO)));
                    retorno.Add("CODIGO_CLIENTE_ORCAMENTO", item.CODIGO_CLIENTE_ORCAMENTO);
                    retorno.Add("STATUS", "<span style='background-color: #FF3300; color: #FFFFFF;'>Pendente</span>");
                    retorno.Add("ID_STATUS", "3");
                    retorno.Add("OBS_NF_ORCAMENTO", item.OBS_NF_ORCAMENTO);
                    retorno.Add("NOME_VENDEDOR", item.TB_VENDEDORE.NOME_VENDEDOR.Trim());

                    ctx.SubmitChanges();
                }
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var _NUMERO_ORCAMENTO = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                         orderby linha.CHAVE_ORCAMENTO
                                         where linha.CHAVE_ORCAMENTO == CHAVE_ORCAMENTO
                                         select linha.NUMERO_ORCAMENTO).First();

                NOVO_NUMERO_ORCAMENTO = _NUMERO_ORCAMENTO;

                retorno.Add("NUMERO_ORCAMENTO", NOVO_NUMERO_ORCAMENTO);

                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select linha).ToList();

                int i = 0;

                foreach (var item in query)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        System.Data.Linq.Table<TB_ITEM_ORCAMENTO_VENDA> Entidade = ctx1.GetTable<TB_ITEM_ORCAMENTO_VENDA>();

                        TB_ITEM_ORCAMENTO_VENDA novo = new TB_ITEM_ORCAMENTO_VENDA();

                        novo.NUMERO_ORCAMENTO = NOVO_NUMERO_ORCAMENTO;
                        novo.ID_PRODUTO = item.ID_PRODUTO;
                        novo.CODIGO_PRODUTO = item.CODIGO_PRODUTO;
                        novo.QTDE_PRODUTO = item.QTDE_PRODUTO;
                        novo.PRECO_PRODUTO = item.PRECO_PRODUTO;
                        novo.UNIDADE_PRODUTO = item.UNIDADE_PRODUTO;
                        novo.VALOR_TOTAL = item.VALOR_TOTAL;
                        novo.TIPO_DESCONTO = item.TIPO_DESCONTO;
                        novo.VALOR_DESCONTO = item.VALOR_DESCONTO;
                        novo.ALIQ_ISS = item.ALIQ_ISS;
                        novo.DATA_ENTREGA = entrega;
                        novo.OBS_ITEM_ORCAMENTO = item.OBS_ITEM_ORCAMENTO;
                        novo.NUMERO_PEDIDO_VENDA = 0;
                        novo.NAO_GERAR_PEDIDO = 0;
                        novo.PROGRAMACAO_ITEM_ORCAMENTO = 0;
                        novo.DESCRICAO_PRODUTO_ITEM_ORCAMENTO = item.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim();
                        novo.ITEM_APROVADO = item.ITEM_APROVADO;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx1, novo, Entidade.ToString(), ID_USUARIO);

                        ctx1.SubmitChanges();

                        GravaCustos(i, item.NUMERO_ITEM, entrega, ID_USUARIO);

                        i++;
                    }
                }
            }

            retorno.Add("TOTAL_ORCAMENTO", Doran_Comercial_Orcamentos.Calcula_Total_Orcamento(NOVO_NUMERO_ORCAMENTO));

            return retorno;
        }

        private void GravaCustos(decimal SEQUENCIA_ITEM, decimal NUMERO_ITEM_ORCAMENTO, DateTime entrega, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var item = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                            orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM
                            where linha.NUMERO_ORCAMENTO == NOVO_NUMERO_ORCAMENTO
                            select linha).ToList().Skip((int)SEQUENCIA_ITEM).First();

                var query = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                             orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM_ORCAMENTO
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             && linha.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM_ORCAMENTO
                             select linha).ToList();

                foreach (var item1 in query)
                {
                    System.Data.Linq.Table<TB_CUSTO_ITEM_ORCAMENTO_VENDA> Entidade = ctx.GetTable<TB_CUSTO_ITEM_ORCAMENTO_VENDA>();

                    TB_CUSTO_ITEM_ORCAMENTO_VENDA novo = new TB_CUSTO_ITEM_ORCAMENTO_VENDA();

                    novo.NUMERO_ORCAMENTO = NOVO_NUMERO_ORCAMENTO;
                    novo.NUMERO_ITEM_ORCAMENTO = item.NUMERO_ITEM;
                    novo.NUMERO_CUSTO_VENDA = item1.NUMERO_CUSTO_VENDA;
                    novo.CUSTO_ITEM_ORCAMENTO = item1.CUSTO_ITEM_ORCAMENTO;
                    novo.PREVISAO_ENTREGA = entrega;
                    novo.OBS_CUSTO_VENDA = item1.OBS_CUSTO_VENDA;

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);
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