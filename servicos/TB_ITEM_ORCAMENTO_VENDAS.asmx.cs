using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_ITEM_ORCAMENTO_VENDAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_ITEM_ORCAMENTO_VENDAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_ITEM_ORCAMENTO_VENDA(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                where linha.NUMERO_ORCAMENTO == Convert.ToDecimal(dados["NUMERO_ORCAMENTO"])
                                select new
                                {
                                    linha.NUMERO_ORCAMENTO,
                                    linha.NUMERO_ITEM,
                                    linha.ID_PRODUTO,
                                    linha.CODIGO_PRODUTO,
                                    linha.DESCRICAO_PRODUTO_ITEM_ORCAMENTO,
                                    linha.QTDE_PRODUTO,
                                    linha.PRECO_PRODUTO,
                                    linha.VALOR_TOTAL,
                                    linha.UNIDADE_PRODUTO,
                                    linha.VALOR_DESCONTO,
                                    linha.TIPO_DESCONTO,
                                    linha.ALIQ_ISS,
                                    VALOR_ISS = Math.Round(linha.VALOR_TOTAL.Value * (linha.ALIQ_ISS.Value / 100), 2, MidpointRounding.ToEven),
                                    linha.DATA_ENTREGA,
                                    linha.NUMERO_PEDIDO_VENDA,
                                    linha.OBS_ITEM_ORCAMENTO,
                                    linha.PROGRAMACAO_ITEM_ORCAMENTO,
                                    linha.NAO_GERAR_PEDIDO,
                                    linha.CEP_FINAL_ITEM_ORCAMENTO,
                                    linha.CEP_INICIAL_ITEM_ORCAMENTO,
                                    linha.CIDADE_FINAL_ITEM_ORCAMENTO,
                                    linha.CIDADE_INICIAL_ITEM_ORCAMENTO,
                                    linha.COMPL_FINAL_ITEM_ORCAMENTO,
                                    linha.COMPL_INICIAL_ITEM_ORCAMENTO,
                                    linha.ENDERECO_FINAL_ITEM_ORCAMENTO,
                                    linha.ENDERECO_INICIAL_ITEM_ORCAMENTO,
                                    linha.ESTADO_FINAL_ITEM_ORCAMENTO,
                                    linha.ESTADO_INICIAL_ITEM_ORCAMENTO,
                                    linha.NUMERO_FINAL_ITEM_ORCAMENTO,
                                    linha.NUMERO_INICIAL_ITEM_ORCAMENTO,
                                    linha.DISTANCIA_EM_METROS
                                };

                    string retorno = "";

                    if (dados.ContainsKey("start"))
                    {
                        var rowCount = query.Count();

                        query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                        retorno = ApoioXML.objQueryToXML(ctx, query, rowCount);
                    }
                    else
                    {
                        retorno = ApoioXML.objQueryToXML(ctx, query);
                    }

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Totais_Orcamento(decimal NUMERO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Orcamentos com = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    return com.Calcula_Totais_Orcamento();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Grava_Novo_Item_Orcamento(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Comercial_Orcamentos com = new Doran_Comercial_Orcamentos(Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]), Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return com.Grava_Novo_Item_Orcamento(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Atualiza_Orcamento(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Comercial_Orcamentos com = new Doran_Comercial_Orcamentos(Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]),
                   Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return com.Atualiza_Item_Orcamento(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Deleta_Orcamento(decimal NUMERO_ORCAMENTO, decimal NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Orcamentos com = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    return com.Deleta_Item_Orcamento(NUMERO_ITEM);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_CFOP_UF(decimal ID_UF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_UF_CFOPs
                                where linha.ID_UF == ID_UF &&
                                (linha.CODIGO_CFOP_UF.StartsWith("5") ||
                                linha.CODIGO_CFOP_UF.StartsWith("6") ||
                                linha.CODIGO_CFOP_UF.StartsWith("7"))

                                select new
                                {
                                    CODIGO_CFOP = linha.CODIGO_CFOP_UF
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Recalcula_Items_Orcamento(decimal NUMERO_ORCAMENTO, bool CALCULO_IVA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    return orc.Recalcula_Items_Orcamento(CALCULO_IVA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Grava_Contato_Orcamento(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]),
                    Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return orc.Grava_Contato_Orcamento(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Cond_Pagto_Cliente_Novo(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_COND_PAGTOs
                                where linha.CONDICAO_CLIENTE_NOVO == 1
                                select new
                                {
                                    linha.CODIGO_CP,
                                    linha.DESCRICAO_CP,
                                    linha.CUSTO_FINANCEIRO
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Custos_do_Item(decimal NUMERO_ORCAMENTO, decimal NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                && linha.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM
                                select new
                                {
                                    linha.NUMERO_ORCAMENTO,
                                    NUMERO_ITEM = linha.NUMERO_ITEM_ORCAMENTO,
                                    NUMERO_CUSTO_VENDA = string.Concat(linha.TB_CUSTO_VENDA.DESCRICAO_CUSTO_VENDA.Trim(),
                                    " -  ", linha.NUMERO_CUSTO_VENDA.ToString()),
                                    linha.CUSTO_ITEM_ORCAMENTO,
                                    linha.PREVISAO_ENTREGA,
                                    linha.OBS_CUSTO_VENDA,
                                    linha.CODIGO_FORNECEDOR,
                                    linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<object> Salva_Custos(List<Dictionary<string, object>> LINHAS)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal NUMERO_ORCAMENTO = 0;
                    decimal NUMERO_ITEM_ORCAMENTO = 0;

                    foreach (Dictionary<string, object> CUSTO in LINHAS)
                    {
                        NUMERO_ORCAMENTO = Convert.ToDecimal(CUSTO["NUMERO_ORCAMENTO"]);
                        NUMERO_ITEM_ORCAMENTO = Convert.ToDecimal(CUSTO["NUMERO_ITEM_ORCAMENTO"]);

                        var query = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                     where linha.NUMERO_ORCAMENTO == Convert.ToDecimal(CUSTO["NUMERO_ORCAMENTO"])
                                     && linha.NUMERO_ITEM_ORCAMENTO == Convert.ToDecimal(CUSTO["NUMERO_ITEM_ORCAMENTO"])
                                     && linha.NUMERO_CUSTO_VENDA == Convert.ToDecimal(CUSTO["NUMERO_CUSTO_VENDA"])
                                     select linha).ToList();

                        if (query.Count() > 0)
                        {
                            foreach (var item in query)
                            {
                                string VALOR_CUSTO = CUSTO["CUSTO_ITEM_ORCAMENTO"].ToString().Replace(".", ",");

                                item.CUSTO_ITEM_ORCAMENTO = Convert.ToDecimal(VALOR_CUSTO);
                                item.PREVISAO_ENTREGA = Convert.ToDateTime(CUSTO["PREVISAO_ENTREGA"]);
                                item.OBS_CUSTO_VENDA = string.IsNullOrEmpty(CUSTO["OBS_CUSTO_VENDA"].ToString()) ? "" :
                                    CUSTO["OBS_CUSTO_VENDA"].ToString();

                                if (string.IsNullOrEmpty(CUSTO["CODIGO_FORNECEDOR"].ToString()))
                                {
                                    CUSTO["CODIGO_FORNECEDOR"] = null;
                                }

                                item.CODIGO_FORNECEDOR = Convert.ToDecimal(CUSTO["CODIGO_FORNECEDOR"]);

                                item.CODIGO_FORNECEDOR = item.CODIGO_FORNECEDOR.HasValue ? item.CODIGO_FORNECEDOR : null;

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                    ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.ToString(), Convert.ToDecimal(CUSTO["ID_USUARIO"]));
                            }
                        }
                        else
                        {
                            System.Data.Linq.Table<TB_CUSTO_ITEM_ORCAMENTO_VENDA> Entidade = ctx.GetTable<TB_CUSTO_ITEM_ORCAMENTO_VENDA>();

                            TB_CUSTO_ITEM_ORCAMENTO_VENDA novo = new TB_CUSTO_ITEM_ORCAMENTO_VENDA();

                            string VALOR_CUSTO = CUSTO["CUSTO_ITEM_ORCAMENTO"].ToString().Replace(".", ",");

                            novo.NUMERO_ORCAMENTO = Convert.ToDecimal(CUSTO["NUMERO_ORCAMENTO"]);
                            novo.NUMERO_ITEM_ORCAMENTO = Convert.ToDecimal(CUSTO["NUMERO_ITEM_ORCAMENTO"]);
                            novo.NUMERO_CUSTO_VENDA = Convert.ToDecimal(CUSTO["NUMERO_CUSTO_VENDA"]);
                            novo.CUSTO_ITEM_ORCAMENTO = Convert.ToDecimal(VALOR_CUSTO);
                            novo.PREVISAO_ENTREGA = Convert.ToDateTime(CUSTO["PREVISAO_ENTREGA"]);
                            novo.OBS_CUSTO_VENDA = string.IsNullOrEmpty(CUSTO["OBS_CUSTO_VENDA"].ToString()) ? "" :
                                CUSTO["OBS_CUSTO_VENDA"].ToString();

                            if (string.IsNullOrEmpty(CUSTO["CODIGO_FORNECEDOR"].ToString()))
                            {
                                CUSTO["CODIGO_FORNECEDOR"] = null;
                            }

                            novo.CODIGO_FORNECEDOR = Convert.ToDecimal(CUSTO["CODIGO_FORNECEDOR"]);

                            novo.CODIGO_FORNECEDOR = novo.CODIGO_FORNECEDOR.HasValue ? novo.CODIGO_FORNECEDOR : null;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(CUSTO["ID_USUARIO"]));
                        }
                    }

                    ctx.SubmitChanges();

                    List<object> retorno = new List<object>();

                    using (Doran_Comercial_Orcamentos item = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, Convert.ToDecimal(LINHAS[0]["ID_USUARIO"])))
                    {
                        retorno = item.Recalcula_Custos(NUMERO_ITEM_ORCAMENTO);
                    }

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(LINHAS[0]["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public List<object> Deleta_Custo(decimal NUMERO_ORCAMENTO, decimal NUMERO_ITEM_ORCAMENTO, decimal NUMERO_CUSTO_VENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                && linha.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM_ORCAMENTO
                                && linha.NUMERO_CUSTO_VENDA == NUMERO_CUSTO_VENDA
                                select linha;

                    foreach (var item in query)
                    {
                        ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }

                List<object> retorno = new List<object>();

                using (Doran_Comercial_Orcamentos item = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    retorno = item.Recalcula_Custos(NUMERO_ITEM_ORCAMENTO);
                }

                return retorno;
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Desmarca_Programacao(decimal NUMERO_ORCAMENTO, List<decimal> NUMERO_ITEM, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        if (NUMERO_ITEM.Contains(item.NUMERO_ITEM))
                        {
                            item.PROGRAMACAO_ITEM_ORCAMENTO = item.PROGRAMACAO_ITEM_ORCAMENTO == 0 ? 1 : 0;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public decimal Ultimo_Preco_Cliente(decimal CODIGO_CLIENTE, decimal ID_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 orderby linha.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO, linha.TB_ORCAMENTO_VENDA.DATA_ORCAMENTO descending

                                 where linha.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == CODIGO_CLIENTE
                                    && linha.ID_PRODUTO == ID_PRODUTO
                                    && linha.NUMERO_PEDIDO_VENDA > 0

                                 select linha).Take(1).ToList();

                    decimal ULTIMO_PRECO = 0;

                    foreach (var item in query)
                        ULTIMO_PRECO = (decimal)item.PRECO_PRODUTO;

                    return ULTIMO_PRECO;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_TB_PRODUTO(Dictionary<string, object> dados)
        {
            try
            {
                return Doran_Produtos.Lista_TB_PRODUTO(dados);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Produto_por_Codigo(string CODIGO_PRODUTO, decimal ID_UF, decimal CODIGO_CLIENTE,
            decimal ID_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var EMITENTE = from linha in ctx.TB_EMITENTEs
                                   where linha.CODIGO_EMITENTE == ID_EMITENTE
                                   select linha.ID_UF_EMITENTE;

                    if (!EMITENTE.Any())
                        throw new Exception("N&atilde;o h&aacute; emitente cadastrado");

                    decimal? ID_UF_EMITENTE = EMITENTE.First();


                    var query = (from linha in ctx.TB_PRODUTOs
                                 orderby linha.CODIGO_PRODUTO
                                 where linha.CODIGO_PRODUTO == CODIGO_PRODUTO
                                 select new
                                 {
                                     ID_PRODUTO_ITEM_ORCAMENTO = linha.ID_PRODUTO,
                                     linha.CODIGO_PRODUTO,
                                     DESCRICAO_PRODUTO_ITEM_ORCAMENTO = linha.DESCRICAO_PRODUTO,
                                     ALIQ_ISS = linha.ALIQ_ISS,
                                     UNIDADE_PRODUTO = linha.UNIDADE_MEDIDA_VENDA,
                                     linha.PRECO_PRODUTO
                                 }).ToList();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        retorno.Add("ID_PRODUTO_ITEM_ORCAMENTO", item.ID_PRODUTO_ITEM_ORCAMENTO);
                        retorno.Add("CODIGO_PRODUTO", item.CODIGO_PRODUTO.Trim());
                        retorno.Add("DESCRICAO_PRODUTO_ITEM_ORCAMENTO", item.DESCRICAO_PRODUTO_ITEM_ORCAMENTO.Trim());
                        retorno.Add("PRECO_PRODUTO", item.PRECO_PRODUTO);
                        retorno.Add("ALIQ_ISS", item.ALIQ_ISS);
                        retorno.Add("UNIDADE_PRODUTO", item.UNIDADE_PRODUTO.Trim());
                        retorno.Add("CODIGO_PRODUTO_CLIENTE", "");
                    }

                    return retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Busca_Fornecedores_com_Tabela(decimal ID_PRODUTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_FORNECEDOR_PRODUTOs
                                orderby linha.ID_PRODUTO

                                where linha.ID_PRODUTO == ID_PRODUTO

                                select new
                                {
                                    linha.CODIGO_FORNECEDOR,
                                    linha.TB_FORNECEDOR.NOME_FANTASIA_FORNECEDOR,
                                    linha.TB_PRODUTO.CODIGO_PRODUTO,
                                    linha.PRECO_FORNECEDOR,
                                    linha.DESCONTO1,
                                    linha.DESCONTO2,
                                    linha.DESCONTO3
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Libera_Item_Margem_Inferior(decimal NUMERO_ORCAMENTO, decimal GERENTE_VENDAS, decimal ID_USUARIO)
        {
            try
            {
                if (GERENTE_VENDAS == 0)
                    throw new Exception("Acesso negado. Para liberar a impressão contacte o seu gerente comercial");

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        if (item.ITEM_APROVADO == 1)
                        {
                            item.ITEM_APROVADO = 0;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                                ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Adiciona_Percentual_Representante(decimal NUMERO_ORCAMENTO, decimal PERCENTUAL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    orc.Adiciona_Percentual_Representante(PERCENTUAL);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Data_Entrega_Todos_os_Itens(decimal NUMERO_ORCAMENTO, string DATA_ENTREGA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    DateTime _DATA_ENTREGA = Convert.ToDateTime(DATA_ENTREGA);

                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.DATA_ENTREGA = _DATA_ENTREGA;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Nova_Data_de_Entrega_Itens_Orcamento(decimal NUMERO_ORCAMENTO, List<decimal> NUMEROS_ITEM_ORCAMENTO,
            List<string> DATAS_ENTREGAS, decimal ID_USUARIO)
        {
            try
            {
                Doran_Calculo_de_Entrega_de_Produtos.Grava_Nova_Data_de_Entrega_Itens_Orcamento(NUMERO_ORCAMENTO, NUMEROS_ITEM_ORCAMENTO, DATAS_ENTREGAS,
                    ID_USUARIO);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}