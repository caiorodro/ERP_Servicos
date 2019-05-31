using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_ERP_Servicos.classes;
using System.Configuration;
using System.Data;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_NOTA_SAIDA
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_NOTA_SAIDA : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_NotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from nota in ctx.TB_ITEM_NOTA_SAIDAs
                                 orderby nota.NUMERO_ITEM_NF
                                 where nota.TB_NOTA_SAIDA.DATA_EMISSAO_NF >= Convert.ToDateTime(dados["DATA_EMISSAO_NF"]) &&
                                 nota.TB_NOTA_SAIDA.NOME_CLIENTE_NF.Contains(dados["NOME_CLIENTE_NF"].ToString())

                                 select new
                                 {
                                     nota.TB_NOTA_SAIDA.NUMERO_SEQ,
                                     nota.TB_NOTA_SAIDA.NUMERO_NF,
                                     nota.TB_NOTA_SAIDA.SERIE_NF,
                                     nota.TB_NOTA_SAIDA.CODIGO_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.NOME_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.NOME_FANTASIA_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.CNPJ_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.DATA_EMISSAO_NF,
                                     nota.TB_NOTA_SAIDA.TOTAL_SERVICOS_NF,
                                     nota.TB_NOTA_SAIDA.TOTAL_NF,
                                     nota.TB_NOTA_SAIDA.BASE_ISS_NF,
                                     nota.TB_NOTA_SAIDA.VALOR_ISS_NF,
                                     nota.TB_NOTA_SAIDA.NUMERO_PEDIDO_NF,
                                     nota.TB_NOTA_SAIDA.STATUS_NF,
                                     nota.TB_NOTA_SAIDA.EMITIDA_NF,
                                     nota.TB_NOTA_SAIDA.CANCELADA_NF,
                                     nota.TB_NOTA_SAIDA.TELEFONE_CLIENTE_NF,
                                     nota.TB_NOTA_SAIDA.PESO_LIQUIDO_NF,
                                     nota.TB_NOTA_SAIDA.PESO_BRUTO_NF,
                                     nota.TB_NOTA_SAIDA.ENDERECO_FATURA_NF,
                                     nota.TB_NOTA_SAIDA.NUMERO_END_FATURA_NF,
                                     nota.TB_NOTA_SAIDA.COMP_END_FATURA_NF,
                                     nota.TB_NOTA_SAIDA.CEP_FATURA_NF,
                                     nota.TB_NOTA_SAIDA.BAIRRO_FATURA_NF,
                                     nota.TB_NOTA_SAIDA.MUNICIPIO_NF,
                                     nota.TB_NOTA_SAIDA.UF_NF,
                                     nota.TB_NOTA_SAIDA.TB_COND_PAGTO.DESCRICAO_CP,
                                     nota.TB_NOTA_SAIDA.TB_CLIENTE.OBS_CLIENTE,
                                     nota.TB_NOTA_SAIDA.DADOS_ADICIONAIS_NF,
                                     nota.TB_NOTA_SAIDA.OBS_NF,
                                     nota.TB_NOTA_SAIDA.DATA_SAIDA_CANHOTO,
                                     nota.TB_NOTA_SAIDA.RESPONSAVEL_CANHOTO,
                                     nota.TB_NOTA_SAIDA.OBS_INTERNA_NF,
                                     nota.TB_NOTA_SAIDA.MARCA_REMSSA_RPS
                                 }).Distinct();

                    var query1 = dados["NUMERO_NF"].ToString().Trim().Length > 0 ?
                        query = query.Where(n => n.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF"])) :
                        query;

                    if (dados.ContainsKey("NUMERO_PEDIDO_NF"))
                    {
                        query1 = dados["NUMERO_PEDIDO_NF"].ToString().Trim().Length > 0 ?
                        query1 = query1.Where(n => n.NUMERO_PEDIDO_NF == dados["NUMERO_PEDIDO_NF"].ToString()) :
                        query1;
                    }

                    if (dados["STATUS_NF"].ToString() != "0")
                        query1 = query1.Where(n => n.STATUS_NF == Convert.ToDecimal(dados["STATUS_NF"]));

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
        public string Carrega_Painel_NotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from nota in ctx.TB_NOTA_SAIDAs
                                orderby nota.DATA_EMISSAO_NF
                                where nota.DATA_EMISSAO_NF >= Convert.ToDateTime(dados["DATA_EMISSAO_NF"]) &&
                                nota.NOME_CLIENTE_NF.Contains(dados["NOME_CLIENTE_NF"].ToString())
                                select new
                                {
                                    nota.NUMERO_NF,
                                    nota.NUMERO_SEQ,
                                    nota.SERIE_NF,
                                    nota.DATA_EMISSAO_NF,
                                    nota.NOME_FANTASIA_CLIENTE_NF,
                                    nota.EMAIL_ENVIADO_NF,
                                    nota.TOTAL_NF,
                                    nota.TB_CLIENTE.ENVIO_NFE_CLIENTE,
                                    nota.STATUS_NF
                                };

                    var query1 = dados["NUMERO_NF"].ToString().Trim().Length > 0 ?
                        query = query.Where(n => n.NUMERO_NF == Convert.ToDecimal(dados["NUMERO_NF"])) :
                        query;

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
        public Dictionary<string, object> BuscaPorNumeroSequencial(decimal NUMERO_SEQ, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = (from nota in ctx.TB_NOTA_SAIDAs
                                  join uf in ctx.TB_UFs on nota.ID_UF_NF equals uf.ID_UF
                                  join cliente in ctx.TB_CLIENTEs on nota.CODIGO_CLIENTE_NF equals cliente.ID_CLIENTE
                                  where nota.NUMERO_SEQ == NUMERO_SEQ

                                  select new
                                  {
                                      nota.NUMERO_NF,
                                      nota.NUMERO_SEQ,
                                      nota.DATA_EMISSAO_NF,
                                      nota.NUMERO_PEDIDO_NF,
                                      nota.CODIGO_CLIENTE_NF,

                                      nota.CODIGO_CP_NF,
                                      nota.CODIGO_VENDEDOR_NF,
                                      nota.QTDE_NF,
                                      nota.ESPECIE_NF,
                                      nota.MARCA_NF,
                                      nota.NUMERO_QTDE_NF,
                                      nota.DADOS_ADICIONAIS_NF,
                                      nota.ID_UF_NF,
                                      uf.ALIQ_ICMS_UF,
                                      uf.ALIQ_INTERNA_ICMS,

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
                                      uf.DESCRICAO_UF,
                                      cliente.TELEFONE_FATURA,

                                      nota.OBS_NF,

                                      nota.PESO_LIQUIDO_NF,
                                      nota.PESO_BRUTO_NF,
                                  }).ToList();

                    if (query1.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a Nota de Saída com o ID [" + NUMERO_SEQ.ToString() + "]");

                    Dictionary<string, object> retorno = new Dictionary<string, object>();

                    foreach (var item in query1)
                    {
                        DateTime _emissao = (DateTime)item.DATA_EMISSAO_NF;
                        string _cEmissao = string.Format("{0}/{1}/{2}", _emissao.Day.ToString().PadLeft(2, '0'),
                            _emissao.Month.ToString().PadLeft(2, '0'), _emissao.Year.ToString().PadLeft(4, '0'));

                        retorno.Add("NUMERO_SEQ", item.NUMERO_SEQ);
                        retorno.Add("NUMERO_NF", item.NUMERO_NF);
                        retorno.Add("DATA_EMISSAO_NF", _cEmissao);
                        retorno.Add("NUMERO_PEDIDO_NF", item.NUMERO_PEDIDO_NF.Trim());
                        retorno.Add("CODIGO_CLIENTE_NF", item.CODIGO_CLIENTE_NF);

                        retorno.Add("CODIGO_CP_NF", item.CODIGO_CP_NF);

                        retorno.Add("CODIGO_VENDEDOR_NF", item.CODIGO_VENDEDOR_NF);
                        retorno.Add("QTDE_NF", item.QTDE_NF.Trim());
                        retorno.Add("ESPECIE_NF", item.ESPECIE_NF.Trim());
                        retorno.Add("MARCA_NF", item.MARCA_NF.Trim());
                        retorno.Add("NUMERO_QTDE_NF", item.NUMERO_QTDE_NF.Trim());
                        retorno.Add("DADOS_ADICIONAIS_NF", item.OBS_NF.Trim());

                        retorno.Add("ID_UF_NF", item.ID_UF_NF);
                        retorno.Add("ALIQ_ICMS_UF", item.ALIQ_ICMS_UF);
                        retorno.Add("ALIQ_INTERNA_ICMS", item.ALIQ_INTERNA_ICMS);

                        retorno.Add("PESO_LIQUIDO", item.PESO_LIQUIDO_NF);
                        retorno.Add("PESO_BRUTO", item.PESO_BRUTO_NF);

                        string dadosCliente = string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOME_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOMEFANTASIA_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>CNPJ:&nbsp;&nbsp;{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>I.E.:&nbsp;&nbsp;{1}</td></tr></table>", item.CNPJ_CLIENTE, item.IE_CLIENTE);

                        dadosCliente += item.COMP_END_FATURA.Trim().Length > 0 ?
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1} - {2}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA, item.COMP_END_FATURA) :
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{1}</td></tr></table>", item.CEP_FATURA, item.BAIRRO_FATURA);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{1}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{2}</td></tr></table>", item.NOME_MUNICIPIO, item.DESCRICAO_UF, item.TELEFONE_FATURA);

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
        public decimal GravaNovaNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Nota_Saida nota = new Doran_Nota_Saida(Convert.ToDecimal(dados["ID_EMPRESA"]),
                    Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return nota.Nova_Nota_Saida(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string AtualizaNotaSaida(Dictionary<string, object> dados)
        {
            try
            {
                string retorno = "";

                dados = Busca_Dados_Redundantes(dados);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_NOTA_SAIDAs
                                 where item.NUMERO_SEQ == Convert.ToDecimal(dados["NUMERO_SEQ"])
                                 select item).ToList();

                    foreach (var item in query)
                    {
                        if (dados.ContainsKey("NUMERO_NF"))
                        {
                            decimal NUMERO_NF = decimal.TryParse(dados["NUMERO_NF"].ToString(), out NUMERO_NF) ?
                                Convert.ToDecimal(dados["NUMERO_NF"]) : 0;

                            if (NUMERO_NF > 0)
                            {
                                var PARCELAS = (from linha in ctx.TB_FINANCEIROs
                                                orderby linha.NUMERO_SEQ_NF_SAIDA

                                                where linha.NUMERO_SEQ_NF_SAIDA == Convert.ToDecimal(dados["NUMERO_SEQ"])
                                                select linha).ToList();

                                foreach (var item1 in PARCELAS)
                                {
                                    item1.NUMERO_NF_SAIDA = NUMERO_NF;

                                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FINANCEIROs.GetModifiedMembers(item1),
                                        ctx.TB_FINANCEIROs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                                }
                            }
                        }
                    }

                    if (query.Count() == 0)
                        throw new Exception("N&atilde;o foi poss&iacute;vel encontrar a Nota de Saída com o ID [" + dados["NUMERO_SEQ"].ToString() + "]");

                    foreach (var nota in query)
                    {
                        nota.SERIE_NF = dados["SERIE_NF"].ToString();

                        if (dados.ContainsKey("NUMERO_NF"))
                            nota.NUMERO_NF = Convert.ToDecimal(dados["NUMERO_NF"]);

                        nota.IE_SUBST_TRIB_NF = dados["IE_SUBST_TRIB_NF"].ToString();

                        nota.NOME_CLIENTE_NF = dados["NOME_CLIENTE_NF"].ToString();
                        nota.NOME_FANTASIA_CLIENTE_NF = dados["NOME_FANTASIA_CLIENTE_NF"].ToString();
                        nota.CNPJ_CLIENTE_NF = dados["CNPJ_CLIENTE_NF"].ToString();
                        nota.IE_CLIENTE_NF = dados["IE_CLIENTE_NF"].ToString();
                        nota.ENDERECO_FATURA_NF = dados["ENDERECO_FATURA_NF"].ToString();
                        nota.NUMERO_END_FATURA_NF = dados["NUMERO_END_FATURA_NF"].ToString();
                        nota.COMP_END_FATURA_NF = dados["COMP_END_FATURA_NF"].ToString();
                        nota.CEP_FATURA_NF = dados["CEP_FATURA_NF"].ToString();
                        nota.BAIRRO_FATURA_NF = dados["BAIRRO_FATURA_NF"].ToString();
                        nota.ID_MUNICIPIO_NF = Convert.ToDecimal(dados["ID_MUNICIPIO_NF"]);
                        nota.MUNICIPIO_NF = dados["MUNICIPIO_NF"].ToString();
                        nota.ID_UF_NF = Convert.ToDecimal(dados["ID_UF_NF"]);
                        nota.UF_NF = dados["SIGLA_UF"].ToString();
                        nota.TELEFONE_CLIENTE_NF = dados["TELEFONE_CLIENTE_NF"].ToString();

                        nota.DATA_EMISSAO_NF = Convert.ToDateTime(dados["DATA_EMISSAO_NF"]);
                        nota.CODIGO_CP_NF = Convert.ToDecimal(dados["CODIGO_CP_NF"]);
                        nota.DESCRICAO_CP_NF = dados["DESCRICAO_CP_NF"].ToString();

                        nota.QTDE_NF = string.Empty;
                        nota.ESPECIE_NF = string.Empty;
                        nota.MARCA_NF = string.Empty;
                        nota.NUMERO_QTDE_NF = string.Empty;
                        nota.PESO_BRUTO_NF = 0;
                        nota.PESO_LIQUIDO_NF = 0;

                        nota.OBS_NF = dados["DADOS_ADICIONAIS_NF"].ToString();
                        nota.CODIGO_VENDEDOR_NF = Convert.ToDecimal(dados["CODIGO_VENDEDOR_NF"]);
                        nota.NOME_VENDEDOR_NF = dados["NOME_VENDEDOR_NF"].ToString();
                        nota.NUMERO_PEDIDO_NF = dados["NUMERO_PEDIDO_NF"].ToString();
                        nota.CHAVE_ACESSO_NF = dados["CHAVE_ACESSO_NF"].ToString();
                        nota.PROTOCOLO_AUTORIZACAO_NF = dados["PROTOCOLO_AUTORIZACAO_NF"].ToString();
                        nota.DATA_PROTOCOLO_NF = new DateTime(1901, 01, 01);

                        nota.EMITIDA_NF = 0;
                        nota.CANCELADA_NF = 0;
                        nota.NUMERO_LOTE_NF = 0;
                        nota.DANFE_NFE = "";
                        nota.EMAIL_ENVIADO_NF = 0;

                        nota.DADOS_ADICIONAIS_NF = dados["DADOS_ADICIONAIS_NF"].ToString();

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(nota),
                            ctx.TB_NOTA_SAIDAs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                        ctx.SubmitChanges();

                        retorno = nota.OBS_NF.Trim();
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
        public void DeletaNotaSaida(decimal NUMERO_SEQ, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

                    ctx.Connection.ConnectionString = str_conn;
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    decimal STATUS_LIBERADO_FATURAR = (from linha in ctx.TB_STATUS_PEDIDOs
                                                       where linha.STATUS_ESPECIFICO == 5
                                                       select linha.CODIGO_STATUS_PEDIDO).Any() ?

                                                       (from linha in ctx.TB_STATUS_PEDIDOs
                                                        where linha.STATUS_ESPECIFICO == 5
                                                        select linha.CODIGO_STATUS_PEDIDO).First() : 0;

                    if (STATUS_LIBERADO_FATURAR == 0) throw new Exception("O status de pedido [LIBERADO P/ FATURAR] n&atilde;o est&aacute; cadastrado");

                    var query = (from item in ctx.TB_NOTA_SAIDAs
                                 where item.NUMERO_SEQ == NUMERO_SEQ
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        if (linha.CANCELADA_NF == 1 || linha.EMITIDA_NF == 1)
                            throw new Exception("Esta nota n&atilde;o pode ser deletada. J&aacute; foi emitida ou cancelada.");
                    }

                    var queryItens = (from item in ctx.TB_ITEM_NOTA_SAIDAs
                                      where item.NUMERO_ITEM_NF == NUMERO_SEQ
                                      select item).ToList();

                    // Volta o pedido de Venda para faturar de novo

                    DateTime _hoje = DateTime.Now;

                    foreach (var item in queryItens)
                    {
                        var pedido = (from linha in ctx.TB_PEDIDO_VENDAs
                                      orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM

                                      where linha.NUMERO_PEDIDO == item.NUMERO_PEDIDO_VENDA
                                      && linha.NUMERO_ITEM == item.NUMERO_ITEM_PEDIDO_VENDA

                                      select linha).ToList();

                        foreach (var item1 in pedido)
                        {
                            System.Data.Linq.Table<TB_MUDANCA_STATUS_PEDIDO> Entidade = ctx.GetTable<TB_MUDANCA_STATUS_PEDIDO>();

                            TB_MUDANCA_STATUS_PEDIDO novo = new TB_MUDANCA_STATUS_PEDIDO();

                            novo.NUMERO_PEDIDO_VENDA = item1.NUMERO_PEDIDO;
                            novo.NUMERO_ITEM_VENDA = item1.NUMERO_ITEM;
                            novo.DATA_MUDANCA = _hoje;
                            novo.ID_USUARIO = ID_USUARIO;
                            novo.ID_STATUS_ANTERIOR = item1.STATUS_ITEM_PEDIDO;
                            novo.ID_STATUS_NOVO = STATUS_LIBERADO_FATURAR;

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), item1.NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();

                            item1.STATUS_ITEM_PEDIDO = STATUS_LIBERADO_FATURAR;
                            item1.QTDE_A_FATURAR += item.QTDE_ITEM_NF;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_PEDIDO_VENDA(ctx, ctx.TB_PEDIDO_VENDAs.GetModifiedMembers(item1),
                                "TB_PEDIDO_VENDA", item1.NUMERO_PEDIDO, ID_USUARIO);

                            ctx.SubmitChanges();
                        }
                    }

                    // Deleta os itens de nota de saída

                    foreach (var linha in queryItens)
                    {
                        ctx.TB_ITEM_NOTA_SAIDAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_ITEM_NOTA_SAIDAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    // Deleta a nota de saída

                    foreach (var linha in query)
                    {
                        ctx.TB_NOTA_SAIDAs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_NOTA_SAIDAs.ToString(), ID_USUARIO);

                        ctx.SubmitChanges();
                    }

                    ctx.Transaction.Commit();
                }
                catch (Exception ex)
                {
                    ctx.Transaction.Rollback();

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                    throw ex;
                }
            }
        }

        [WebMethod()]
        public List<Dictionary<string, object>> EmiteNotaSaida(List<decimal> NUMERO_SEQ, string SERIE,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                List<Dictionary<string, object>> retorno = new List<Dictionary<string, object>>();

                for (int i = 0; i < NUMERO_SEQ.Count; i++)
                {
                    using (Doran_Emite_Nota_Saida nota = new Doran_Emite_Nota_Saida(NUMERO_SEQ[i], SERIE, ID_USUARIO, ID_EMPRESA))
                    {
                        Dictionary<string, object> retorno1 = new Dictionary<string, object>();

                        decimal nf = nota.Emite_Nota_Saida();

                        retorno1.Add("NUMERO_NF", nf);
                        retorno1.Add("SERIE_NF", SERIE);

                        retorno.Add(retorno1);
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
        public List<decimal> EmiteNotaEletronica(List<decimal> Arr_NUMERO_SEQ, List<decimal> Arr_NUMERO_NF, List<string> Arr_SERIE_NF,
            decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                List<decimal> retorno = new List<decimal>();

                for (int i = 0; i < Arr_NUMERO_SEQ.Count; i++)
                {
                    using (Doran_Base.Faturamento.NFe nfe = new Doran_Base.Faturamento.NFe(Arr_NUMERO_SEQ[i], Arr_NUMERO_NF[i], Arr_SERIE_NF[i], ID_EMPRESA))
                    {
                        nfe.ID_USUARIO = Convert.ToDecimal(Session["ID_USUARIO"]);
                        //nfe.CHAVE_NFE_UTIL = ConfigurationManager.AppSettings["NOVA_CHAVE_NFe_Util"];

                        nfe.GeraNFe();
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
        public void CancelaNotaSaida(decimal NUMERO_SEQ, string MOTIVO, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            //try
            //{
            //    using (Doran_Cancelamento_Nota_Saida cancela = new Doran_Cancelamento_Nota_Saida(NUMERO_SEQ, Session["SERIE_NF"].ToString(), MOTIVO,
            //        ID_EMPRESA, ID_USUARIO))
            //    {
            //        cancela.Cancela_Nota_Fiscal();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
            //    throw ex;
            //}
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Dados_do_Cliente(decimal ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cliente in ctx.TB_CLIENTEs
                                join uf in ctx.TB_UFs on cliente.ESTADO_FATURA equals uf.ID_UF
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
                                    uf.DESCRICAO_UF,
                                    uf.ALIQ_ICMS_UF,
                                    uf.ALIQ_INTERNA_ICMS,
                                    cliente.TELEFONE_FATURA,
                                    cliente.CODIGO_CP_CLIENTE,
                                    cliente.TB_COND_PAGTO.DESCRICAO_CP,
                                    cliente.CODIGO_VENDEDOR_CLIENTE,
                                    cliente.ESTADO_FATURA
                                };

                    Dictionary<string, object> retorno = new Dictionary<string, object>();
                    string dadosCliente = "";

                    retorno.Add("DadosCliente", "");
                    retorno.Add("NOME_CLIENTE", "");
                    retorno.Add("CODIGO_CFOP_NF", "");
                    retorno.Add("DESCRICAO_CFOP", "");
                    retorno.Add("CODIGO_CP_NF", "");
                    retorno.Add("CODIGO_TRANSP_NF", "");
                    retorno.Add("CODIGO_VENDEDOR_NF", "");
                    retorno.Add("ALIQ_ICMS_UF", 0);
                    retorno.Add("ALIQ_INTERNA_ICMS", 0);

                    retorno.Add("CALCULO_IVA", "");
                    retorno.Add("CONSUMIDOR_FINAL", "");
                    retorno.Add("ID_UF_NF", 0);
                    retorno.Add("FRETE_CLIENTE", 0);

                    retorno.Add("ICMS_ISENTO", 0);
                    retorno.Add("IPI_ISENTO", 0);
                    retorno.Add("SUFRAMA_CFOP", 0);
                    retorno.Add("DADOS_ADICIONAIS_CFOP", 0);

                    retorno.Add("DadosTransportadora", "");

                    retorno.Add("CALCULO_ICMS_SOBRE_TOTAL_NF", 0);

                    foreach (var item in query)
                    {
                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOME_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}</td></tr></table>", item.NOMEFANTASIA_CLIENTE);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>CNPJ:&nbsp;&nbsp;{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>I.E.:&nbsp;&nbsp;{1}</td></tr></table>", item.CNPJ_CLIENTE, item.IE_CLIENTE);

                        dadosCliente += item.COMP_END_FATURA.Trim().Length > 0 ?
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1} - {2}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA, item.COMP_END_FATURA) :
                            string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}, {1}</td></tr></table>", item.ENDERECO_FATURA, item.NUMERO_END_FATURA);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{1}</td></tr></table>", item.CEP_FATURA, item.BAIRRO_FATURA);

                        dadosCliente += string.Format("<table style='font-family: tahoma; font-size: 10pt;'><tr><td>{0}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{1}&nbsp;&nbsp;-&nbsp;&nbsp;</td><td>{2}</td></tr></table>", item.NOME_MUNICIPIO, item.DESCRICAO_UF, item.TELEFONE_FATURA);

                        retorno["DadosCliente"] = dadosCliente;
                        retorno["NOME_CLIENTE"] = item.NOME_CLIENTE.Trim();
                        retorno["CODIGO_CP_NF"] = item.CODIGO_CP_CLIENTE;
                        retorno["CODIGO_VENDEDOR_NF"] = item.CODIGO_VENDEDOR_CLIENTE;
                        retorno["ALIQ_ICMS_UF"] = item.ALIQ_ICMS_UF;
                        retorno["ALIQ_INTERNA_ICMS"] = item.ALIQ_INTERNA_ICMS;
                        retorno["ID_UF_NF"] = item.ESTADO_FATURA;
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
        public string ListaClientes_GridPesquisa(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query1 = from cliente in ctx.TB_CLIENTEs
                                 join uf in ctx.TB_UFs on cliente.ESTADO_FATURA equals uf.ID_UF
                                 where cliente.NOME_CLIENTE.Contains(dados["pesquisa"].ToString()) ||
                                 cliente.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString())

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
                                     uf.DESCRICAO_UF,
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
        public Dictionary<string, object> Busca_Totais_NF(decimal NUMERO_SEQ, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Calculo_Nota_Saida calc = new Doran_Calculo_Nota_Saida(NUMERO_SEQ, ID_USUARIO))
                {
                    return calc.Calcula_Totais_Nota_Saida();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private Dictionary<string, object> Busca_Dados_Redundantes(Dictionary<string, object> dados)
        {
            Dictionary<string, object> retorno = dados;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var queryCLIENTE = from cliente in ctx.TB_CLIENTEs
                                   join uf in ctx.TB_UFs on cliente.ESTADO_FATURA equals uf.ID_UF
                                   where cliente.ID_CLIENTE == Convert.ToDecimal(dados["CODIGO_CLIENTE_NF"])
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
                                       cliente.CIDADE_FATURA,
                                       cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                       cliente.ESTADO_FATURA,
                                       uf.SIGLA_UF,
                                       uf.DESCRICAO_UF,
                                       cliente.TELEFONE_FATURA,
                                   };

                foreach (var item in queryCLIENTE)
                {
                    retorno.Add("NOME_CLIENTE_NF", item.NOME_CLIENTE);
                    retorno.Add("NOME_FANTASIA_CLIENTE_NF", item.NOMEFANTASIA_CLIENTE);
                    retorno.Add("CNPJ_CLIENTE_NF", item.CNPJ_CLIENTE);
                    retorno.Add("IE_CLIENTE_NF", item.IE_CLIENTE);
                    retorno.Add("ENDERECO_FATURA_NF", item.ENDERECO_FATURA);
                    retorno.Add("NUMERO_END_FATURA_NF", item.NUMERO_END_FATURA);
                    retorno.Add("COMP_END_FATURA_NF", item.COMP_END_FATURA);
                    retorno.Add("CEP_FATURA_NF", item.CEP_FATURA);
                    retorno.Add("BAIRRO_FATURA_NF", item.BAIRRO_FATURA);
                    retorno.Add("ID_MUNICIPIO_NF", item.CIDADE_FATURA);
                    retorno.Add("MUNICIPIO_NF", item.NOME_MUNICIPIO);
                    retorno.Add("ID_UF_NF", item.ESTADO_FATURA);
                    retorno.Add("UF_NF", item.DESCRICAO_UF);
                    retorno.Add("TELEFONE_CLIENTE_NF", item.TELEFONE_FATURA);
                    retorno.Add("SIGLA_UF", item.SIGLA_UF);
                }

                var queryCP = from cp in ctx.TB_COND_PAGTOs
                              where cp.CODIGO_CP == Convert.ToDecimal(dados["CODIGO_CP_NF"])
                              select cp;

                foreach (var item in queryCP)
                {
                    dados.Add("DESCRICAO_CP_NF", item.DESCRICAO_CP);
                }

                var queryVendedor = from v in ctx.TB_VENDEDOREs
                                    where v.ID_VENDEDOR == Convert.ToDecimal(dados["CODIGO_VENDEDOR_NF"])
                                    select v;

                foreach (var item in queryVendedor)
                {
                    dados.Add("NOME_VENDEDOR_NF", item.NOME_VENDEDOR);
                }
            }

            return retorno;
        }

        [WebMethod()]
        public string Monta_Vencimentos_NF(decimal NUMERO_SEQ, string SERIE, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            using (Doran_Emite_Nota_Saida nota = new Doran_Emite_Nota_Saida(NUMERO_SEQ, SERIE, ID_USUARIO, ID_EMPRESA))
            {
                return nota.Monta_Vencimentos_NF();
            }
        }

        [WebMethod()]
        public string Duplicatas_NF(List<decimal> NUMERO_SEQ, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_Duplicata_Saida dup = new Doran_Duplicata_Saida(NUMERO_SEQ))
                {
                    return dup.MontaDuplicatas();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Salva_Canhoto(List<decimal> NUMERO_SEQ, string DATA_SAIDA_CANHOTO, string HORA_SAIDA, string RESPONSAVEL_CANHOTO,
            string SERIE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    DateTime dt = Convert.ToDateTime(DATA_SAIDA_CANHOTO + " " + HORA_SAIDA);

                    string retorno = string.Concat(dt.Year.ToString(), "-", dt.Month.ToString().PadLeft(2, '0'),
                        "-", dt.Day.ToString().PadLeft(2, '0'), "T", dt.Hour.ToString().PadLeft(2, '0'), ":",
                        dt.Minute.ToString().PadLeft(2, '0'), ":", dt.Second.ToString().PadLeft(2, '0'), "-03:00");

                    for (int i = 0; i < NUMERO_SEQ.Count; i++)
                    {
                        var query = (from linha in ctx.TB_NOTA_SAIDAs
                                     where linha.NUMERO_SEQ == NUMERO_SEQ[i]
                                     select linha).ToList();

                        foreach (var item in query)
                        {
                            item.DATA_SAIDA_CANHOTO = dt;
                            item.RESPONSAVEL_CANHOTO = RESPONSAVEL_CANHOTO;

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update_NOTA_SAIDA(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(item),
                                ctx.TB_NOTA_SAIDAs.ToString(), (decimal)item.NUMERO_NF, SERIE, ID_USUARIO);
                        }
                    }

                    ctx.SubmitChanges();

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
        public string Relacao_Emissao_Notas(string dt1, string dt2, decimal filial, decimal A_VISTA, decimal ID_USUARIO)
        {
            try
            {
                DateTime data1 = Convert.ToDateTime(dt1);
                DateTime data2 = Convert.ToDateTime(dt2);
                data2 = data2.AddDays(1);

                using (Doran_Emissao_Notas notas = new Doran_Emissao_Notas(data1, data2, filial, A_VISTA))
                {
                    return notas.MontaRelatorio();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Obs_Interna_NF(decimal NUMERO_SEQ, string OBS_INTERNA_NF, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_NOTA_SAIDAs
                                 where linha.NUMERO_SEQ == NUMERO_SEQ
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.OBS_INTERNA_NF = OBS_INTERNA_NF;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(item),
                            ctx.TB_NOTA_SAIDAs.ToString(), ID_USUARIO);
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
        public string Le_Arquivos_XML(Dictionary<string, object> dados)
        {
            //try
            //{
            //    string pasta_xml_autorizado = string.Empty;

            //    using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            //    {
            //        var recebimento = (from linha in ctx.TB_CONFIG_NFEs
            //                           where linha.ID_CONFIG == 1
            //                           select new { linha.PASTA_RECEBIMENTO }).ToList();

            //        if (!recebimento.Any())
            //            throw new Exception("As configura&ccedil;&otilde;es de faturamento n&atilde;o estão definidas");

            //        pasta_xml_autorizado = recebimento.First().PASTA_RECEBIMENTO.Trim();
            //    }

            //    DateTime data1 = new DateTime();

            //    if (!DateTime.TryParse(dados["Data"].ToString(), out data1))
            //        data1 = new DateTime(1901, 01, 01);

            //    DataTable dt = new DataTable("Tabela");
            //    dt.Columns.Add("Arquivo");
            //    dt.Columns.Add("Data", System.Type.GetType("System.DateTime"));

            //    DirectoryInfo di = new DirectoryInfo(pasta_xml_autorizado);
            //    FileInfo[] fi = di.GetFiles("*.xml", SearchOption.AllDirectories);

            //    foreach (FileInfo file in fi)
            //    {
            //        DataRow nova = dt.NewRow();
            //        nova[0] = file.FullName;
            //        nova[1] = file.LastWriteTime;
            //        dt.Rows.Add(nova);
            //    }

            //    var query = from linha in dt.AsEnumerable()
            //                where Convert.ToDateTime(linha["Data"]) >= data1 &&
            //                linha["Arquivo"].ToString().Contains(dados["Arquivo"].ToString())
            //                orderby linha["Data"] descending
            //                select linha;

            //    var rowCount = query.Count();

            //    var query1 = (from linha in dt.AsEnumerable()
            //                  where Convert.ToDateTime(linha["Data"]) >= data1 &&
            //                  linha["Arquivo"].ToString().Contains(dados["Arquivo"].ToString())
            //                  orderby linha["Data"] descending
            //                  select linha).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

            //    DataTable dt1 = dt.Clone();

            //    foreach (var item in query1)
            //    {
            //        DataRow nova = dt1.NewRow();
            //        nova[0] = item["Arquivo"];
            //        nova[1] = item["Data"];
            //        dt1.Rows.Add(nova);
            //    }

            //    DataSet ds = new DataSet("Query");
            //    ds.Tables.Add(dt1);

            //    DataTable totalCount = new DataTable("Totais");

            //    totalCount.Columns.Add("totalCount");

            //    DataRow nova1 = totalCount.NewRow();
            //    nova1[0] = rowCount;
            //    totalCount.Rows.Add(nova1);

            //    ds.Tables.Add(totalCount);

            //    System.IO.StringWriter tr = new System.IO.StringWriter();
            //    ds.WriteXml(tr);

            //    return tr.ToString();
            //}
            //catch (Exception ex)
            //{
            //    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
            //    throw ex;
            //}

            return "";
        }

        [WebMethod()]
        public Dictionary<string, object> Importa_Arquivos_XML(List<string> arquivos, decimal ID_USUARIO)
        {
            //try
            //{
            //    using (Doran_Importa_XML_Autorizado imp = new Doran_Importa_XML_Autorizado(ID_USUARIO))
            //    {
            //        return imp.Importa_Arquivos(arquivos);
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
            //    throw ex;
            //}

            return null;
        }

        [WebMethod()]
        public void Cancela_Nota_Internamente(decimal NUMERO_SEQ, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from linha in ctx.TB_NOTA_SAIDAs
                                 where linha.NUMERO_SEQ == NUMERO_SEQ
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        item.STATUS_NF = 3;
                        item.CANCELADA_NF = 1;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(item),
                            ctx.TB_NOTA_SAIDAs.ToString(), ID_USUARIO);
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
        public string Gera_RPS_Lote(decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_RPS_Nota_Servico rps = new Doran_RPS_Nota_Servico(ID_EMPRESA, ID_USUARIO))
                {
                    return rps.Gera_Arquivo_RPS_Lote();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_desmarca_Remessa_RPS(List<decimal> NUMEROS_SEQ, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    ctx.Connection.Open();
                    ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

                    var query = from linha in ctx.TB_NOTA_SAIDAs
                                where NUMEROS_SEQ.Contains(linha.NUMERO_SEQ)
                                && linha.STATUS_NF == 2
                                select linha;

                    foreach (var item in query)
                    {
                        if (item.MARCA_REMSSA_RPS != 1)
                        {
                            item.MARCA_REMSSA_RPS = 1;
                            item.USUARIO_REMESSA_RPS = ID_USUARIO;
                        }
                        else
                        {
                            item.MARCA_REMSSA_RPS = 0;
                            item.USUARIO_REMESSA_RPS = 0;
                        }

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(item),
                            ctx.TB_NOTA_SAIDAs.ToString(), ID_USUARIO);
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
    }
}
