using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CONFIG_VENDAS
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CONFIG_VENDAS : System.Web.Services.WebService
    {
        [WebMethod()]
        public Dictionary<string, object> BuscaConfig(decimal ID_USUARIO)
        {
            Dictionary<string, object> retorno = new Dictionary<string, object>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from cs in ctx.TB_CONFIG_VENDAs
                             where cs.ID_CONFIGURACAO_VENDAS == 1
                             select new
                             {
                                 cs.ANALISAR_PRIMEIRA_COMPRA,
                                 cs.ANALISAR_INATIVIDADE,
                                 cs.ANALISAR_COND_PAGTO,
                                 cs.ANALISAR_MARGEM_VENDA,
                                 cs.ANALISAR_LIMITE_CREDITO,
                                 cs.ANALISAR_INADIMPLENCIA,
                                 cs.DIAS_INATIVIDADE,
                                 cs.LOGOTIPO_ORCAMENTO_VENDAS,
                                 cs.ANALISAR_FATURAMENTO_MINIMO,
                                 cs.VALOR_FATURAMENTO_MINIMO,
                                 cs.ANALISAR_IMPOSTO,
                                 cs.PRAZO_DIAS_ORCAMENTO,
                                 cs.NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO,
                                 cs.TRABALHAR_COM_MARGEM_GROS
                             }).ToList();

                retorno.Add("ANALISAR_PRIMEIRA_COMPRA", "");
                retorno.Add("ANALISAR_INATIVIDADE", "");
                retorno.Add("ANALISAR_COND_PAGTO", "");
                retorno.Add("ANALISAR_MARGEM_VENDA", "");
                retorno.Add("ANALISAR_LIMITE_CREDITO", "");
                retorno.Add("ANALISAR_INADIMPLENCIA", "");
                retorno.Add("DIAS_INATIVIDADE", "");
                retorno.Add("LOGOTIPO_ORCAMENTO_VENDAS", "");
                retorno.Add("ANALISAR_FATURAMENTO_MINIMO", "");
                retorno.Add("VALOR_FATURAMENTO_MINIMO", "");
                retorno.Add("ANALISAR_IMPOSTO", "");
                retorno.Add("PRAZO_DIAS_ORCAMENTO", "");
                retorno.Add("NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO", "");
                retorno.Add("TRABALHAR_COM_MARGEM_GROS", "");

                foreach (var item in query)
                {
                    retorno["ANALISAR_PRIMEIRA_COMPRA"] = item.ANALISAR_PRIMEIRA_COMPRA;
                    retorno["ANALISAR_INATIVIDADE"] = item.ANALISAR_INATIVIDADE;
                    retorno["ANALISAR_COND_PAGTO"] = item.ANALISAR_COND_PAGTO;
                    retorno["ANALISAR_MARGEM_VENDA"] = item.ANALISAR_MARGEM_VENDA;
                    retorno["ANALISAR_LIMITE_CREDITO"] = item.ANALISAR_LIMITE_CREDITO;
                    retorno["ANALISAR_INADIMPLENCIA"] = item.ANALISAR_INADIMPLENCIA;
                    retorno["DIAS_INATIVIDADE"] = item.DIAS_INATIVIDADE;
                    retorno["LOGOTIPO_ORCAMENTO_VENDAS"] = item.LOGOTIPO_ORCAMENTO_VENDAS.Trim();
                    retorno["ANALISAR_FATURAMENTO_MINIMO"] = item.ANALISAR_FATURAMENTO_MINIMO;
                    retorno["VALOR_FATURAMENTO_MINIMO"] = item.VALOR_FATURAMENTO_MINIMO;
                    retorno["ANALISAR_IMPOSTO"] = item.ANALISAR_IMPOSTO;
                    retorno["PRAZO_DIAS_ORCAMENTO"] = item.PRAZO_DIAS_ORCAMENTO;
                    retorno["NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO"] = item.NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO;
                    retorno["TRABALHAR_COM_MARGEM_GROS"] = item.TRABALHAR_COM_MARGEM_GROS;
                }
            }

            return retorno;
        }

        [WebMethod()]
        public void GravaNovoConfig(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    System.Data.Linq.Table<TB_CONFIG_VENDA> Entidade = ctx.GetTable<TB_CONFIG_VENDA>();

                    TB_CONFIG_VENDA novo = new TB_CONFIG_VENDA();

                    novo.ID_CONFIGURACAO_VENDAS = 1;
                    novo.ANALISAR_PRIMEIRA_COMPRA = Convert.ToDecimal(dados["ANALISAR_PRIMEIRA_COMPRA"]);
                    novo.ANALISAR_INATIVIDADE = Convert.ToDecimal(dados["ANALISAR_INATIVIDADE"]);
                    novo.ANALISAR_COND_PAGTO = Convert.ToDecimal(dados["ANALISAR_COND_PAGTO"]);
                    novo.ANALISAR_MARGEM_VENDA = Convert.ToDecimal(dados["ANALISAR_MARGEM_VENDA"]);
                    novo.ANALISAR_LIMITE_CREDITO = Convert.ToDecimal(dados["ANALISAR_LIMITE_CREDITO"]);
                    novo.ANALISAR_INADIMPLENCIA = Convert.ToDecimal(dados["ANALISAR_INADIMPLENCIA"]);
                    novo.DIAS_INATIVIDADE = Convert.ToDecimal(dados["DIAS_INATIVIDADE"]);
                    novo.LOGOTIPO_ORCAMENTO_VENDAS = dados["LOGOTIPO_ORCAMENTO_VENDAS"].ToString();
                    novo.ANALISAR_FATURAMENTO_MINIMO = Convert.ToDecimal(dados["ANALISAR_FATURAMENTO_MINIMO"]);
                    novo.VALOR_FATURAMENTO_MINIMO = Convert.ToDecimal(dados["VALOR_FATURAMENTO_MINIMO"]);
                    novo.ANALISAR_IMPOSTO = Convert.ToDecimal(dados["ANALISAR_IMPOSTO"]);
                    novo.PRAZO_DIAS_ORCAMENTO = Convert.ToDecimal(dados["PRAZO_DIAS_ORCAMENTO"]);
                    novo.NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO = Convert.ToDecimal(dados["NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO"]);
                    novo.TRABALHAR_COM_MARGEM_GROS = Convert.ToDecimal(dados["TRABALHAR_COM_MARGEM_GROS"]);


                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaConfig(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CONFIG_VENDAs
                                 where item.ID_CONFIGURACAO_VENDAS == 1
                                 select item).ToList();

                    if (query.Count() == 0)
                        GravaNovoConfig(dados);
                    else
                    {
                        foreach (var uf in query)
                        {
                            uf.ANALISAR_PRIMEIRA_COMPRA = Convert.ToDecimal(dados["ANALISAR_PRIMEIRA_COMPRA"]);
                            uf.ANALISAR_INATIVIDADE = Convert.ToDecimal(dados["ANALISAR_INATIVIDADE"]);
                            uf.ANALISAR_COND_PAGTO = Convert.ToDecimal(dados["ANALISAR_COND_PAGTO"]);
                            uf.ANALISAR_MARGEM_VENDA = Convert.ToDecimal(dados["ANALISAR_MARGEM_VENDA"]);
                            uf.ANALISAR_LIMITE_CREDITO = Convert.ToDecimal(dados["ANALISAR_LIMITE_CREDITO"]);
                            uf.ANALISAR_INADIMPLENCIA = Convert.ToDecimal(dados["ANALISAR_INADIMPLENCIA"]);
                            uf.DIAS_INATIVIDADE = Convert.ToDecimal(dados["DIAS_INATIVIDADE"]);
                            uf.LOGOTIPO_ORCAMENTO_VENDAS = dados["LOGOTIPO_ORCAMENTO_VENDAS"].ToString();
                            uf.ANALISAR_FATURAMENTO_MINIMO = Convert.ToDecimal(dados["ANALISAR_FATURAMENTO_MINIMO"]);
                            uf.VALOR_FATURAMENTO_MINIMO = Convert.ToDecimal(dados["VALOR_FATURAMENTO_MINIMO"]);
                            uf.ANALISAR_IMPOSTO = Convert.ToDecimal(dados["ANALISAR_IMPOSTO"]);
                            uf.PRAZO_DIAS_ORCAMENTO = Convert.ToDecimal(dados["PRAZO_DIAS_ORCAMENTO"]);
                            uf.NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO = Convert.ToDecimal(dados["NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO"]);
                            uf.TRABALHAR_COM_MARGEM_GROS = Convert.ToDecimal(dados["TRABALHAR_COM_MARGEM_GROS"]);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_CONFIG_VENDAs.GetModifiedMembers(uf),
                                ctx.TB_CONFIG_VENDAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                            ctx.SubmitChanges();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public decimal Busca_Prazo(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var retorno = (from linha in ctx.TB_CONFIG_VENDAs
                                   where linha.ID_CONFIGURACAO_VENDAS == 1
                                   select linha).ToList().First().PRAZO_DIAS_ORCAMENTO;

                    return (decimal)retorno;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}
