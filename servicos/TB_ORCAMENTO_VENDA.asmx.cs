using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.IO;
using System.Configuration;
using Doran_Base;
using Doran_Base.Auditoria;
using System.Globalization;
using Doran_Servicos_ORM;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_ORCAMENTO_VENDA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_ORCAMENTO_VENDA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string ListaClientes_GridPesquisa(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    decimal CODIGO_VENDEDOR = Convert.ToDecimal(dados["ID_VENDEDOR"]);
                    decimal GERENTE_COMERCIAL = Convert.ToDecimal(dados["GERENTE_COMERCIAL"]);

                    var query1 = from cliente in ctx.TB_CLIENTEs
                                 where (cliente.NOME_CLIENTE.Contains(dados["pesquisa"].ToString()) ||
                                 cliente.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString())
                                 && (cliente.CODIGO_VENDEDOR_CLIENTE == CODIGO_VENDEDOR
                                 || GERENTE_COMERCIAL == 1))

                                 && cliente.FORNECEDOR != 1

                                 && cliente.ESTADO_FATURA == Convert.ToDecimal(dados["uf"])

                                 select new
                                 {
                                     cliente.ID_CLIENTE,
                                     cliente.NOME_CLIENTE,
                                     cliente.NOMEFANTASIA_CLIENTE,
                                     cliente.CNPJ_CLIENTE,
                                     cliente.IE_CLIENTE,
                                     cliente.ENDERECO_FATURA,
                                     cliente.NUMERO_END_FATURA,
                                     cliente.COMP_END_FATURA,
                                     cliente.CEP_FATURA,
                                     cliente.BAIRRO_FATURA,
                                     cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     cliente.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,
                                     cliente.TELEFONE_FATURA,
                                     cliente.CODIGO_CP_CLIENTE,
                                     cliente.TB_COND_PAGTO.DESCRICAO_CP,
                                     cliente.CODIGO_VENDEDOR_CLIENTE,
                                     cliente.TB_VENDEDORE.NOME_VENDEDOR
                                 };

                    var rowCount = query1.Count();

                    query1 = query1.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query1, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Dados_do_Cliente(decimal ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from cliente in ctx.TB_CLIENTEs
                                 where cliente.ID_CLIENTE == ID_CLIENTE

                                 select new
                                 {
                                     cliente.NOME_CLIENTE,
                                     cliente.NOMEFANTASIA_CLIENTE,
                                     cliente.CNPJ_CLIENTE,
                                     cliente.IE_CLIENTE,
                                     cliente.ENDERECO_FATURA,
                                     cliente.NUMERO_END_FATURA,
                                     cliente.COMP_END_FATURA,
                                     cliente.CEP_FATURA,
                                     cliente.BAIRRO_FATURA,
                                     cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     cliente.TB_MUNICIPIO.TB_UF.DESCRICAO_UF,
                                     cliente.TB_MUNICIPIO.TB_UF.ALIQ_ICMS_UF,
                                     cliente.TB_MUNICIPIO.TB_UF.ALIQ_INTERNA_ICMS,
                                     cliente.TB_MUNICIPIO.TB_UF.SIGLA_UF,
                                     cliente.TELEFONE_FATURA,
                                     cliente.CODIGO_CP_CLIENTE,
                                     cliente.TB_COND_PAGTO.DESCRICAO_CP,
                                     cliente.CODIGO_VENDEDOR_CLIENTE
                                 }).ToList();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();
                    string dadosCliente = "";

                    retorno.Add("DadosCliente", "");

                    foreach (var item in query)
                    {
                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOME_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOMEFANTASIA_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>CNPJ:&nbsp;&nbsp;{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>I.E.:&nbsp;&nbsp;{1}</td></tr></table>", item.CNPJ_CLIENTE, item.IE_CLIENTE);

                        dadosCliente += item.COMP_END_FATURA.Trim().Length > 0 ?
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1} - {2}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA, item.COMP_END_FATURA) :
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{1}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{2}&nbsp;-&nbsp;</td><td>{3}</td></tr></table>", item.CEP_FATURA, item.BAIRRO_FATURA, item.NOME_MUNICIPIO, item.SIGLA_UF);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.TELEFONE_FATURA);

                        retorno["DadosCliente"] = dadosCliente;
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
        public void Salva_Orcamento(decimal NUMERO_ORCAMENTO, decimal CODIGO_CLIENTE_ORCAMENTO,
            string OBS_ORCAMENTO, string VALIDADE_ORCAMENTO, string OBS_NF_ORCAMENTO,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select linha).ToList();

                    decimal CLIENTE_BLOQUEADO = (from linha in ctx.TB_CLIENTEs
                                                 where linha.ID_CLIENTE == CODIGO_CLIENTE_ORCAMENTO
                                                 select linha).Any() ?

                             (from linha in ctx.TB_CLIENTEs
                              where linha.ID_CLIENTE == CODIGO_CLIENTE_ORCAMENTO
                              select linha.CLIENTE_BLOQUEADO).First().HasValue ?

                             (from linha in ctx.TB_CLIENTEs
                              where linha.ID_CLIENTE == CODIGO_CLIENTE_ORCAMENTO
                              select linha.CLIENTE_BLOQUEADO).First().Value : 0 : 0;

                    if (CLIENTE_BLOQUEADO == 1)
                        throw new Exception("Cliente bloqueado");

                    foreach (var item in query)
                    {
                        item.CODIGO_CLIENTE_ORCAMENTO = CODIGO_CLIENTE_ORCAMENTO;
                        item.OBS_ORCAMENTO = OBS_ORCAMENTO;
                        item.VALIDADE_ORCAMENTO = Convert.ToDateTime(VALIDADE_ORCAMENTO);
                        item.OBS_NF_ORCAMENTO = OBS_NF_ORCAMENTO;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
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
        public string Aplica_Analise_Orcamento(decimal NUMERO_ORCAMENTO, decimal CODIGO_CLIENTE, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Analise_Orcamento analise = new Doran_Analise_Orcamento(NUMERO_ORCAMENTO, ID_EMPRESA))
                {
                    return analise.Aplica_Analise(ID_EMPRESA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Imprime_Orcamento(decimal NUMERO_ORCAMENTO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var cliente = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                   where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                   select linha).First().CODIGO_CLIENTE_ORCAMENTO;

                    if (!cliente.HasValue || cliente == 0)
                    {
                        using (Doran_Impressao_Orcamento_Cliente_Novo imp = new Doran_Impressao_Orcamento_Cliente_Novo(NUMERO_ORCAMENTO, ID_EMPRESA, ID_USUARIO))
                        {
                            return imp.Imprime_Orcamento();
                        }
                    }
                    else
                    {
                        using (Doran_Impressao_Orcamento imp = new Doran_Impressao_Orcamento(NUMERO_ORCAMENTO, ID_EMPRESA, ID_USUARIO))
                        {
                            return imp.Imprime_Orcamento();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Orcamentos(Dictionary<string, object> dados)
        {
            try
            {
                decimal CODIGO_VENDEDOR = Convert.ToDecimal(dados["ID_VENDEDOR"]);
                decimal GERENTE = Convert.ToDecimal(dados["GERENTE_COMERCIAL"]);

                DateTime emissao = DateTime.TryParse(dados["EMISSAO"].ToString(), out emissao) ?
                    Convert.ToDateTime(dados["EMISSAO"]) : DateTime.Today;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_ORCAMENTO_VENDAs
                                orderby linha.DATA_ORCAMENTO

                                where linha.DATA_ORCAMENTO >= emissao

                                && (linha.NUMERO_ORCAMENTO == Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]) ||
                                    Convert.ToDecimal(dados["NUMERO_ORCAMENTO"]) == 0)

                                && (linha.CONTATO_ORCAMENTO.Contains(dados["EMPRESA_CONTATO"].ToString()) ||
                                    linha.TB_CLIENTE.NOME_CLIENTE.Contains(dados["EMPRESA_CONTATO"].ToString()) ||
                                    linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["EMPRESA_CONTATO"].ToString()))

                                select new
                                {
                                    linha.NUMERO_ORCAMENTO,
                                    linha.DATA_ORCAMENTO,
                                    linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.CONTATO_ORCAMENTO,
                                    linha.TELEFONE_CONTATO,
                                    linha.EMAIL_CONTATO,
                                    linha.VALIDADE_ORCAMENTO,
                                    linha.CODIGO_CLIENTE_ORCAMENTO,
                                    linha.CODIGO_VENDEDOR,
                                    linha.TB_VENDEDORE.NOME_VENDEDOR,
                                    linha.OBS_NF_ORCAMENTO,

                                    COND_PAGTO = linha.TB_COND_PAGTO.DESCRICAO_CP,

                                    TOTAL_ORCAMENTO = (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                       orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                       where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                       select linha1).Sum(p => p.VALOR_TOTAL).HasValue ?

                                                      (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                       orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                       where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                       select linha1).Sum(p => p.VALOR_TOTAL) : 0,

                                    TOTAL_ISS = (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                 orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                 where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                 select linha1).Sum(p => p.VALOR_TOTAL * (p.ALIQ_ISS / 100)).HasValue ?

                                                       (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                        orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                        where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                        select linha1).Sum(p => p.VALOR_TOTAL * (p.ALIQ_ISS / 100)) : 0,

                                    TOTAL_PENDENTE = (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                      orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                      where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                      && linha1.NUMERO_PEDIDO_VENDA == 0
                                                      select linha1).Sum(p => p.VALOR_TOTAL).HasValue ?

                                                      (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                       orderby linha1.NUMERO_ORCAMENTO, linha1.NUMERO_ITEM
                                                       where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                       && linha1.NUMERO_PEDIDO_VENDA == 0
                                                       select linha1).Sum(p => p.VALOR_TOTAL) : 0,
                                };

                    var rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataTable dt = ApoioXML.ToDataTable(ctx, query1);

                    dt.Columns.Add("STATUS");
                    dt.Columns.Add("ID_STATUS");

                    foreach (DataRow dr in dt.Rows)
                    {
                        List<string> status = Status_Orcamento(Convert.ToDecimal(dr["NUMERO_ORCAMENTO"]));

                        if (status.Count == 0)
                        {
                            dr["STATUS"] = "Or&ccedil;amento sem itens";
                            dr["ID_STATUS"] = 0;
                        }
                        else
                        {
                            dr["ID_STATUS"] = status[0];
                            dr["STATUS"] = status[1];
                        }
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
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Itens_Orcamento(Dictionary<string, object> dados)
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
                                    linha.CODIGO_PRODUTO,
                                    linha.DESCRICAO_PRODUTO_ITEM_ORCAMENTO,
                                    linha.QTDE_PRODUTO,
                                    linha.TIPO_DESCONTO,
                                    linha.VALOR_DESCONTO,
                                    linha.PRECO_PRODUTO,
                                    linha.VALOR_TOTAL,
                                    linha.OBS_ITEM_ORCAMENTO,
                                    linha.NAO_GERAR_PEDIDO,
                                    linha.NUMERO_PEDIDO_VENDA,
                                    linha.PROGRAMACAO_ITEM_ORCAMENTO,
                                    linha.DATA_ENTREGA,
                                    ATRASADA = linha.DATA_ENTREGA < DateTime.Now ? 1 : 0,
                                    linha.ALIQ_ISS,
                                    VALOR_ISS = Math.Round(linha.VALOR_TOTAL.Value * (linha.ALIQ_ISS.Value / 100), 2, MidpointRounding.ToEven),
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
                                    linha.NUMERO_INICIAL_ITEM_ORCAMENTO
                                };

                    var rowCount = query.Count();

                    query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataTable dt = ApoioXML.ToDataTable(ctx, query);

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
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Dados_Orcamento(decimal NUMERO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select new
                                 {
                                     linha.CONTATO_ORCAMENTO,
                                     linha.TELEFONE_CONTATO,
                                     linha.ID_UF_ORCAMENTO,
                                     linha.EMAIL_CONTATO,
                                     linha.CODIGO_COND_PAGTO,
                                     linha.CODIGO_CLIENTE_ORCAMENTO,
                                     linha.OBS_ORCAMENTO,
                                     linha.VALIDADE_ORCAMENTO,
                                     linha.CODIGO_VENDEDOR,
                                     linha.OBS_NF_ORCAMENTO
                                 }).ToList();

                    foreach (var item in query)
                    {
                        retorno.Add("CODIGO_VENDEDOR", item.CODIGO_VENDEDOR);
                        retorno.Add("CONTATO_ORCAMENTO", item.CONTATO_ORCAMENTO.Trim());
                        retorno.Add("TELEFONE_CONTATO", item.TELEFONE_CONTATO.Trim());
                        retorno.Add("EMAIL_CONTATO", item.EMAIL_CONTATO.ToLower().Trim());
                        retorno.Add("ID_UF_ORCAMENTO", item.ID_UF_ORCAMENTO);
                        retorno.Add("CODIGO_COND_PAGTO", item.CODIGO_COND_PAGTO);

                        retorno.Add("CODIGO_CLIENTE_ORCAMENTO", item.CODIGO_CLIENTE_ORCAMENTO.HasValue ?
                            item.CODIGO_CLIENTE_ORCAMENTO : 0);

                        retorno.Add("OBS_ORCAMENTO", item.OBS_ORCAMENTO.Trim());
                        retorno.Add("OBS_NF_ORCAMENTO", item.OBS_NF_ORCAMENTO);

                        retorno.Add("VALIDADE_ORCAMENTO", string.Concat(((DateTime)item.VALIDADE_ORCAMENTO).Day.ToString().PadLeft(2, '0'),
                            "/", ((DateTime)item.VALIDADE_ORCAMENTO).Month.ToString().PadLeft(2, '0'), "/",
                            ((DateTime)item.VALIDADE_ORCAMENTO).Year.ToString()));

                        retorno.Add("DADOS_CLIENTE_ORCAMENTO", "");

                        if (item.CODIGO_CLIENTE_ORCAMENTO.HasValue)
                        {
                            Dictionary<string, object> Cliente_Transportadora = Busca_Dados_do_Cliente((decimal)item.CODIGO_CLIENTE_ORCAMENTO, ID_USUARIO);

                            retorno["DADOS_CLIENTE_ORCAMENTO"] = Cliente_Transportadora["DadosCliente"].ToString();
                        }

                        using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                        {
                            retorno.Add("TOTAIS", orc.Calcula_Totais_Orcamento());
                        }
                    }
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
        public void Deleta_Orcamento(decimal NUMERO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var pedidos = (from linha in ctx.TB_PEDIDO_VENDAs
                                   where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                   select linha).Any();

                    if (pedidos)
                        throw new Exception("N&atilde;o &eacute; poss&iacute;vel deletar este or&ccedil;amento.<br /><br />H&aacute; pedido(s) de venda associado(s) com este or&ccedil;amento");

                    var custos = (from linha in ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                  select linha).ToList();

                    foreach (var item in custos)
                    {
                        ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_CUSTO_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }

                    var items = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select linha).ToList();

                    foreach (var item in items)
                    {
                        ctx.TB_ITEM_ORCAMENTO_VENDAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
                    }

                    var orcamento = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                     where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                     select linha).ToList();

                    foreach (var item in orcamento)
                    {
                        ctx.TB_ORCAMENTO_VENDAs.DeleteOnSubmit(item);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, item, ctx.TB_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);
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
        public Dictionary<string, object> Copia_Orcamento(decimal NUMERO_ORCAMENTO, double DIAZ_PRAZO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Copia_Orcamento copia = new Doran_Copia_Orcamento(NUMERO_ORCAMENTO))
                {
                    return copia.Copia_Orcamento(ID_USUARIO, DIAZ_PRAZO_ORCAMENTO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private List<string> Status_Orcamento(decimal NUMERO_ORCAMENTO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             select new
                             {
                                 linha.NUMERO_PEDIDO_VENDA,
                                 linha.TB_ORCAMENTO_VENDA.VALIDADE_ORCAMENTO,
                                 linha.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO
                             }).ToList();

                List<string> status = new List<string>();

                DateTime validade = new DateTime();

                bool pendente = false;
                bool parcial = false;
                bool total = false;
                bool cliente_indefinido = false;
                bool cancelado = false;

                var _total = query.Count(s => s.NUMERO_PEDIDO_VENDA > 0);

                var _parcial = query.Count(s => s.NUMERO_PEDIDO_VENDA == 0);

                if (_total > 0 && _parcial == 0)
                    total = true;

                if (_total > 0 && _parcial > 0)
                    parcial = true;

                if (_total == 0 && _parcial > 0)
                    pendente = true;

                foreach (var item in query)
                {
                    if (!item.CODIGO_CLIENTE_ORCAMENTO.HasValue || item.CODIGO_CLIENTE_ORCAMENTO == 0)
                        cliente_indefinido = true;

                    validade = (DateTime)item.VALIDADE_ORCAMENTO;

                    if (item.NUMERO_PEDIDO_VENDA > 0)
                    {
                        if (Verifica_Status_Cancelado(item.NUMERO_PEDIDO_VENDA))
                            cancelado = true;
                    }
                }

                if (cliente_indefinido)
                {
                    status.Add("1");
                    status.Add("<span style='background-color: #C0C0C0; font-size: 10pt; color: #0000FF;'>Cliente a Definir</span>");
                }
                else
                {
                    if (parcial)
                    {
                        status.Add("2");
                        status.Add("<span style='background-color: #6600FF; font-size: 10pt; color: #FFFFFF;'>Servi&ccedil;o Fechado<br />(Parcial)</span>");
                    }
                    else if (pendente || cancelado)
                    {
                        status.Add("3");
                        status.Add(validade >= DateTime.Today ?
                            "<span style='background-color: #FF3300; font-size: 10pt; color: #FFFFFF;'>Pendente</span>" :
                            "<span style='background-color: #990000; font-size: 10pt; color: #FFFFFF;'>Pendente<br />(Vencido)</span>");
                    }
                    else if (total)
                    {
                        status.Add("4");
                        status.Add("<span style='background-color: #0000FF; font-size: 10pt; color: #FFFFFF;'>Servi&ccedil;o Fechado<br />(Total)</span>");
                    }
                }

                return status;
            }
        }

        [WebMethod()]
        public string Matriz_Primeira_Pagina(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Orcamento = ConfigurationManager.AppSettings["Modelo_ORCAMENTO"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Orcamento))
                {
                    retorno = tr.ReadToEnd();
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
        public string Matriz_Proximas_Paginas(decimal ID_USUARIO)
        {
            try
            {
                string modelo_Orcamento = ConfigurationManager.AppSettings["Modelo_ORCAMENTO_ProximaPagina"];
                string retorno = "";

                using (TextReader tr = new StreamReader(modelo_Orcamento))
                {
                    retorno = tr.ReadToEnd();
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
        public void Salva_Matriz_Primeira_Pagina(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_ORCAMENTO"]))
                {
                    string linhaProduto = @"<TR style=""BORDER-BOTTOM: 1px solid"">
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#DESCRICAO_PRODUTO# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#NORMA# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#CODIGO_ITEM_CLIENTE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#UNIDADE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#QTDE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#PRECO# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#TOTAL_ITEM# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=middle>#ENTREGA# </TD></TR>";

                    string linhaMatriz = @"<tr style=""border-bottom: solid 1px;"">
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#DESCRICAO_PRODUTO#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#NORMA#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#CODIGO_ITEM_CLIENTE#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#UNIDADE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#QTDE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#PRECO#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#TOTAL_ITEM#
</td>
<td align=""center"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#ENTREGA#
</td>
</tr>";
                    HTML = HTML.Replace(linhaProduto, linhaMatriz);

                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Salva_Matriz_Proximas_Paginas(string HTML, decimal ID_USUARIO)
        {
            try
            {
                using (TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["Modelo_ORCAMENTO_ProximaPagina"]))
                {
                    string linhaProduto = @"<TR style=""BORDER-BOTTOM: 1px solid"">
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#DESCRICAO_PRODUTO# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#NORMA# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#CODIGO_ITEM_CLIENTE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top>#UNIDADE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#QTDE# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#PRECO# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=right>#TOTAL_ITEM# </TD>
<TD style=""BORDER-LEFT: 1px solid"" vAlign=top align=middle>#ENTREGA# </TD></TR>";

                    string linhaMatriz = @"<tr style=""border-bottom: solid 1px;"">
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#DESCRICAO_PRODUTO#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#NORMA#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#CODIGO_ITEM_CLIENTE#
</td>
<td style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#UNIDADE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#QTDE#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#PRECO#
</td>
<td align=""right"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#TOTAL_ITEM#
</td>
<td align=""center"" style=""border-left-width: 1px; border-left-style: solid;"" valign=""top"">
#ENTREGA#
</td>
</tr>";
                    HTML = HTML.Replace(linhaProduto, linhaMatriz);

                    tw.Write(HTML);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Calcula_Estatisticas_Orcamentos(decimal GERENTE_COMERCIAL, decimal SUPERVISOR_VENDAS, decimal ID_VENDEDOR, decimal ID_USUARIO)
        {
            try
            {
                return Doran_Comercial_Orcamentos.Calcula_Estatisticas_Orcamentos(GERENTE_COMERCIAL, SUPERVISOR_VENDAS, ID_VENDEDOR);
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Orcamento(decimal NUMERO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 orderby linha.NUMERO_ORCAMENTO
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 select new
                                 {
                                     linha.TB_ORCAMENTO_VENDA.CONTATO_ORCAMENTO,
                                     linha.TB_ORCAMENTO_VENDA.TELEFONE_CONTATO,
                                     linha.TB_ORCAMENTO_VENDA.EMAIL_CONTATO,
                                     linha.TB_ORCAMENTO_VENDA.VALIDADE_ORCAMENTO,

                                     TOTAL_ORCAMENTO = (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                        orderby linha1.NUMERO_ORCAMENTO
                                                        where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                        select linha1).Sum(t => t.VALOR_TOTAL),

                                     TOTAL_PENDENTE = (from linha1 in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                                       orderby linha1.NUMERO_ORCAMENTO
                                                       where linha1.NUMERO_ORCAMENTO == linha.NUMERO_ORCAMENTO
                                                       && linha1.NUMERO_PEDIDO_VENDA == 0
                                                       select linha1).Sum(t => t.VALOR_TOTAL)
                                 }).Distinct().ToList();

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        retorno.Add("CONTATO_ORCAMENTO", item.CONTATO_ORCAMENTO.Trim());
                        retorno.Add("TELEFONE_CONTATO", item.TELEFONE_CONTATO.Trim());
                        retorno.Add("EMAIL_CONTATO", item.EMAIL_CONTATO.Trim());
                        retorno.Add("VALIDADE_ORCAMENTO", ApoioXML.TrataData2(item.VALIDADE_ORCAMENTO));
                        retorno.Add("TOTAL_ORCAMENTO", item.TOTAL_ORCAMENTO);
                        retorno.Add("TOTAL_PENDENTE", item.TOTAL_PENDENTE);
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
        public List<object> Gera_Pedido(decimal NUMERO_ORCAMENTO, string NOME_FANTASIA_EMITENTE, decimal ID_EMPRESA, 
            decimal GERENTE_COMERCIAL, decimal JA_FATURAR, List<decimal> CICLISTAS, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Gera_Pedido_Venda pedido = new Doran_Gera_Pedido_Venda(NUMERO_ORCAMENTO, NOME_FANTASIA_EMITENTE, ID_EMPRESA, ID_USUARIO,
                    GERENTE_COMERCIAL))
                {
                    return pedido.Gera_Pedido(JA_FATURAR, CICLISTAS);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Sim_Nao_Gerar_Pedido(decimal NUMERO_ORCAMENTO, List<decimal> NUMERO_ITEM, decimal ID_USUARIO)
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
                            item.NAO_GERAR_PEDIDO = item.NAO_GERAR_PEDIDO == 0 ? 1 : 0;

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
        public string Monta_Vencimentos_ORCAMENTO(decimal NUMERO_ORCAMENTO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Comercial_Orcamentos orc = new Doran_Comercial_Orcamentos(NUMERO_ORCAMENTO, ID_USUARIO))
                {
                    return orc.Monta_Vencimentos_ORCAMENTO();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Monta_Anexo_Cliente_Cadastrado(decimal NUMERO_ORCAMENTO, decimal ID_CONTA_EMAIL, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Monta_Anexo_Orcamento_Venda a = new Doran_Monta_Anexo_Orcamento_Venda(NUMERO_ORCAMENTO, ID_CONTA_EMAIL))
                {
                    return a.Monta_Anexo_Cliente_Cadastrado(ID_EMPRESA, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Monta_Anexo_Cliente_Nao_Cadastrado(decimal NUMERO_ORCAMENTO, decimal ID_CONTA_EMAIL, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Monta_Anexo_Orcamento_Venda a = new Doran_Monta_Anexo_Orcamento_Venda(NUMERO_ORCAMENTO, ID_CONTA_EMAIL))
                {
                    return a.Monta_Anexo_Cliente_nao_Cadastrado(ID_EMPRESA, ID_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string listaEnderecoInicial(string RUA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.ENDERECO_INICIAL_ITEM_ORCAMENTO.Contains(RUA)
                                 select new
                                 {
                                     linha.ENDERECO_INICIAL_ITEM_ORCAMENTO,
                                     linha.NUMERO_INICIAL_ITEM_ORCAMENTO,
                                     linha.COMPL_INICIAL_ITEM_ORCAMENTO,
                                     linha.CIDADE_INICIAL_ITEM_ORCAMENTO,
                                     linha.CEP_INICIAL_ITEM_ORCAMENTO,
                                     linha.ESTADO_INICIAL_ITEM_ORCAMENTO
                                 }).Distinct().Take(30);

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
        public string listaEnderecoFinal(string RUA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.ENDERECO_FINAL_ITEM_ORCAMENTO.Contains(RUA)
                                 select new
                                 {
                                     ENDERECO_INICIAL_ITEM_ORCAMENTO = linha.ENDERECO_FINAL_ITEM_ORCAMENTO,
                                     NUMERO_INICIAL_ITEM_ORCAMENTO = linha.NUMERO_FINAL_ITEM_ORCAMENTO,
                                     COMPL_INICIAL_ITEM_ORCAMENTO = linha.COMPL_FINAL_ITEM_ORCAMENTO,
                                     CIDADE_INICIAL_ITEM_ORCAMENTO = linha.CIDADE_FINAL_ITEM_ORCAMENTO,
                                     CEP_INICIAL_ITEM_ORCAMENTO = linha.CEP_FINAL_ITEM_ORCAMENTO,
                                     ESTADO_INICIAL_ITEM_ORCAMENTO = linha.ESTADO_FINAL_ITEM_ORCAMENTO
                                 }).Distinct().Take(30);

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private bool Verifica_Status_Cancelado(decimal? NUMERO_PEDIDO_VENDA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var status_cancelado = (from linha in ctx.TB_STATUS_PEDIDOs
                                        where linha.STATUS_ESPECIFICO == 4
                                        select linha.CODIGO_STATUS_PEDIDO).ToList().First();

                var query = (from linha in ctx.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO_VENDA
                             && linha.STATUS_ITEM_PEDIDO == status_cancelado
                             select linha).Count();

                return query > 0 ? true : false;
            }
        }
    }
}