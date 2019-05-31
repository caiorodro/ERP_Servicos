using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;

using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Gera_Nota_Entrada : IDisposable
    {
        private decimal ID_USUARIO { get; set; }

        public Doran_Gera_Nota_Entrada(decimal _ID_USUARIO)
        {
            ID_USUARIO = _ID_USUARIO;
        }

        public List<string> Gera_Nota_Entrada(decimal NUMERO_NFE, decimal ID_EMPRESA)
        {
            List<string> retorno = new List<string>();
            List<decimal> items_compra = new List<decimal>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var fornecedores = (from linha in ctx.TB_PEDIDO_COMPRAs
                                    orderby linha.ID_USUARIO_QTDE_NF, linha.QTDE_NF_ITEM_COMPRA

                                    where linha.ID_USUARIO_QTDE_NF == ID_USUARIO
                                    && linha.QTDE_NF_ITEM_COMPRA > (decimal)0.000

                                    select linha.CODIGO_FORNECEDOR).ToList();

                if (fornecedores.Distinct().Count() > 1)
                {
                    throw new Exception("H&aacute; fornecedores diferentes na sele&ccedil;&atilde;o de itens para gerar a nota.");
                }

                var pedido = (from linha in ctx.TB_PEDIDO_COMPRAs
                              orderby linha.ID_USUARIO_QTDE_NF, linha.QTDE_NF_ITEM_COMPRA
                              where linha.ID_USUARIO_QTDE_NF == ID_USUARIO
                              && linha.QTDE_NF_ITEM_COMPRA > (decimal)0.000
                              select linha).ToList().First();

                decimal NUMERO_SEQ = 0;

                using (Doran_Nota_Entrada nota = new Doran_Nota_Entrada(ID_EMPRESA ,ID_USUARIO))
                {
                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    dados.Add("NUMERO_NFE", NUMERO_NFE);
                    dados.Add("SERIE_NFE", "");

                    dados.Add("DATA_EMISSAO_NFE", DateTime.Today.ToShortDateString());
                    dados.Add("DATA_CHEGADA_NFE", DateTime.Today.ToShortDateString());

                    dados.Add("CODIGO_FORNECEDOR", pedido.CODIGO_FORNECEDOR);
                    dados.Add("CODIGO_CP_NFE", pedido.CODIGO_CP_COTACAO_FORNECEDOR);
                    dados.Add("GERA_COBRANCA_NFE", 1);
                    dados.Add("CODIGO_CFOP_NFE", pedido.CODIGO_CFOP_ITEM_COMPRA.Trim());

                    dados.Add("BASE_ICMS_NFE", 0);
                    dados.Add("VALOR_ICMS_NFE", 0);
                    dados.Add("BASE_ICMS_SUBS_NFE", 0);
                    dados.Add("VALOR_ICMS_SUBS_NFE", 0);
                    dados.Add("TOTAL_PRODUTOS_NFE", 0);
                    dados.Add("VALOR_FRETE_NFE", 0);
                    dados.Add("VALOR_SEGURO_NFE", 0);
                    dados.Add("OUTRAS_DESP_NFE", 0);
                    dados.Add("TOTAL_IPI_NFE", 0);
                    dados.Add("TOTAL_NFE", 0);
                    dados.Add("OBS_NFE", "");

                    dados.Add("FRETE_NFE", pedido.FRETE_COTACAO_FORNECEDOR);

                    dados.Add("PESO_LIQUIDO_NFE", 0);
                    dados.Add("PESO_BRUTO_NFE", 0);

                    NUMERO_SEQ = nota.Grava_Nota_Entrada(dados);
                }

                var query = (from linha in ctx.TB_PEDIDO_COMPRAs
                             orderby linha.ID_USUARIO_QTDE_NF, linha.QTDE_NF_ITEM_COMPRA
                             where linha.ID_USUARIO_QTDE_NF == ID_USUARIO
                             && linha.QTDE_NF_ITEM_COMPRA > (decimal)0.000
                             select linha).ToList();

                foreach (var item in query)
                {
                    using (Doran_Calculo_Nota_Entrada items = new Doran_Calculo_Nota_Entrada(NUMERO_SEQ, ID_USUARIO))
                    {
                        Dictionary<string, object> dados = new Dictionary<string, object>();

                        decimal? PRECO_FINAL = item.TIPO_DESCONTO_ITEM_COMPRA == 0 ?
                            item.PRECO_ITEM_COMPRA * (1 - (item.VALOR_DESCONTO_ITEM_COMPRA / 100)) :
                            item.PRECO_ITEM_COMPRA - item.VALOR_DESCONTO_ITEM_COMPRA;

                        decimal VALOR_IPI = Math.Round(((decimal)PRECO_FINAL * (decimal)item.QTDE_NF_ITEM_COMPRA) * ((decimal)item.ALIQ_IPI_ITEM_COMPRA / 100), 2);

                        dados.Add("CODIGO_CFOP_ITEM_NFE", item.CODIGO_CFOP_ITEM_COMPRA.Trim());

                        dados.Add("VALOR_TOTAL_ITEM_NFE", Math.Round((decimal)item.QTDE_NF_ITEM_COMPRA * (decimal)PRECO_FINAL, 2));

                        dados.Add("ALIQ_IPI_ITEM_NFE", item.ALIQ_IPI_ITEM_COMPRA);
                        dados.Add("ALIQ_ICMS_ITEM_NFE", item.ALIQ_ICMS_ITEM_COMPRA);

                        dados.Add("BASE_ICMS_SUBS_ITEM_NFE", item.BASE_ICMS_ST_ITEM_COMPRA);
                        dados.Add("VALOR_ICMS_SUBS_ITEM_NFE", item.VALOR_ICMS_ST_ITEM_COMPRA);

                        dados.Add("ID_PRODUTO", item.ID_PRODUTO_COMPRA);
                        dados.Add("CODIGO_PRODUTO_ITEM_NFE", item.CODIGO_PRODUTO_COMPRA.Trim());
                        dados.Add("DESCRICAO_PRODUTO_ITEM_NFE", item.TB_PRODUTO.DESCRICAO_PRODUTO.Trim());
                        dados.Add("QTDE_ITEM_NFE", item.QTDE_NF_ITEM_COMPRA);

                        dados.Add("VALOR_UNITARIO_ITEM_NFE", PRECO_FINAL);

                        dados.Add("PERC_IVA_ITEM_NFE", 0);

                        dados.Add("NUMERO_LOTE_ITEM_NFE", Busca_Lote_Recebimento(item.NUMERO_PEDIDO_COMPRA, item.NUMERO_ITEM_COMPRA, NUMERO_NFE,
                            item.CODIGO_PRODUTO_COMPRA.Trim()));

                        dados.Add("NUMERO_PEDIDO_COMPRA", item.NUMERO_PEDIDO_COMPRA);
                        dados.Add("NUMERO_ITEM_COMPRA", item.NUMERO_ITEM_COMPRA);

                        items.Calcula_e_Grava_Item_Nota_Entrada(dados);

                        item.QTDE_NF_ITEM_COMPRA = 0;
                        item.ID_USUARIO_QTDE_NF = 0;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_PEDIDO_COMPRAs.GetModifiedMembers(item),
                            ctx.TB_PEDIDO_COMPRAs.ToString(), ID_USUARIO);

                        items_compra.Add(item.NUMERO_ITEM_COMPRA);
                    }
                }

                ctx.SubmitChanges();
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                foreach (var item in items_compra)
                {
                    Dictionary<string, string> _item = new Dictionary<string, string>();

                    var notas = (from linha in ctx.TB_ITEM_NOTA_ENTRADAs
                                 orderby linha.NUMERO_ITEM_COMPRA

                                 where linha.NUMERO_ITEM_COMPRA == item

                                 select linha).ToList();

                    string _notas = "";

                    foreach (var item1 in notas)
                        _notas += item1.TB_NOTA_ENTRADA.NUMERO_NFE.ToString() + " / ";

                    _notas = _notas.Substring(0, _notas.Length - 3);

                    retorno.Add(item.ToString() + " - " + _notas);
                }
            }

            return retorno;
        }

        private string Busca_Lote_Recebimento(decimal NUMERO_PEDIDO_COMPRA, decimal NUMERO_ITEM_COMPRA, decimal NUMERO_NFE,
            string CODIGO_PRODUTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_RECEBIMENTO_PEDIDO_COMPRAs

                             where (linha.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA
                             && linha.NUMERO_ITEM_COMPRA == NUMERO_ITEM_COMPRA)
                             && linha.NUMERO_NF == NUMERO_NFE

                             select linha).ToList();

                string LOTE = "";

                foreach (var item in query)
                    LOTE = item.NUMERO_LOTE_RECEBIMENTO.Trim();


                return LOTE;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}