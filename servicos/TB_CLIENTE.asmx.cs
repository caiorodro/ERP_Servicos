using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Data;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;
using Doran_ERP_Servicos.classes;

namespace Doran_ERP_Servicos.servicos
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class TB_CLIENTE : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Lista_TB_CLIENTE(Dictionary<string, string> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var rowCount = (from cliente in ctx.TB_CLIENTEs
                                    where cliente.NOME_CLIENTE.Contains(dados["pesquisa"]) ||
                                    cliente.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"])
                                    select cliente).Count();

                    var query1 = (from cliente in ctx.TB_CLIENTEs
                                  where cliente.NOME_CLIENTE.Contains(dados["pesquisa"]) ||
                                  cliente.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"])
                                  select cliente).Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);
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
        public Dictionary<string, object> BuscaPorID(int ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from cliente in ctx.TB_CLIENTEs
                                 join ufs in ctx.TB_UFs on cliente.ESTADO_FATURA equals ufs.ID_UF
                                 where cliente.ID_CLIENTE == ID_CLIENTE

                                 select new
                                 {
                                     cliente.ID_CLIENTE,
                                     cliente.NOME_CLIENTE,
                                     cliente.NOMEFANTASIA_CLIENTE,
                                     cliente.CNPJ_CLIENTE,
                                     cliente.IE_CLIENTE,
                                     cliente.IE_SUFRAMA,
                                     cliente.ENDERECO_FATURA,
                                     cliente.NUMERO_END_FATURA,
                                     cliente.COMP_END_FATURA,
                                     cliente.CEP_FATURA,
                                     cliente.BAIRRO_FATURA,
                                     cliente.CIDADE_FATURA,
                                     DESCRICAO_CIDADE_FATURA = cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     cliente.ESTADO_FATURA,
                                     DESCRICAO_ESTADO_FATURA = ufs.DESCRICAO_UF,
                                     cliente.TELEFONE_FATURA,

                                     cliente.ENDERECO_ENTREGA,
                                     cliente.NUMERO_END_ENTREGA,
                                     cliente.COMP_END_ENTREGA,
                                     cliente.CEP_ENTREGA,
                                     cliente.BAIRRO_ENTREGA,
                                     cliente.CIDADE_ENTREGA,
                                     DESCRICAO_CIDADE_ENTREGA = cliente.TB_MUNICIPIO1.NOME_MUNICIPIO,
                                     cliente.ESTADO_ENTREGA,
                                     cliente.TELEFONE_ENTREGA,

                                     cliente.ENDERECO_COBRANCA,
                                     cliente.CEP_COBRANCA,
                                     cliente.BAIRRO_COBRANCA,
                                     cliente.CIDADE_COBRANCA,
                                     DESCRICAO_CIDADE_COBRANCA = cliente.TB_MUNICIPIO2.NOME_MUNICIPIO,
                                     cliente.ESTADO_COBRANCA,
                                     cliente.TELEFONE_COBRANCA,
                                     cliente.CODIGO_CP_CLIENTE,
                                     cliente.ID_LIMITE,
                                     cliente.CODIGO_VENDEDOR_CLIENTE,
                                     cliente.OBS_CLIENTE,
                                     cliente.EMAIL_CLIENTE,
                                     cliente.ENVIO_NFE_CLIENTE,
                                     cliente.PESSOA,
                                     cliente.CLIENTE_BLOQUEADO,
                                     cliente.FORNECEDOR,

                                     cliente.CONTATOS,
                                     cliente.DATA_CADASTRO,
                                     cliente.CODIGO_REGIAO,
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Cliente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_CLIENTE", item.ID_CLIENTE);
                        dados.Add("NOME_CLIENTE", item.NOME_CLIENTE.Trim());
                        dados.Add("NOMEFANTASIA_CLIENTE", item.NOMEFANTASIA_CLIENTE.ToString().Trim());
                        dados.Add("CNPJ_CLIENTE", item.CNPJ_CLIENTE.ToString().Trim());
                        dados.Add("IE_CLIENTE", item.IE_CLIENTE.ToString().Trim());
                        dados.Add("IE_SUFRAMA", item.IE_SUFRAMA.ToString().Trim());
                        dados.Add("ENDERECO_FATURA", item.ENDERECO_FATURA.ToString().Trim());

                        dados.Add("NUMERO_END_FATURA", item.NUMERO_END_FATURA.ToString().Trim());
                        dados.Add("COMP_END_FATURA", item.COMP_END_FATURA.ToString().Trim());

                        dados.Add("CEP_FATURA", item.CEP_FATURA.ToString().Trim());
                        dados.Add("BAIRRO_FATURA", item.BAIRRO_FATURA.ToString().Trim());
                        dados.Add("CIDADE_FATURA", item.CIDADE_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_FATURA", item.DESCRICAO_CIDADE_FATURA.Trim());

                        dados.Add("ESTADO_FATURA", item.ESTADO_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_FATURA", item.DESCRICAO_ESTADO_FATURA.ToString().Trim());

                        dados.Add("TELEFONE_FATURA", item.TELEFONE_FATURA.ToString().Trim());

                        dados.Add("ENDERECO_ENTREGA", item.ENDERECO_ENTREGA.ToString().Trim());
                        dados.Add("NUMERO_END_ENTREGA", item.NUMERO_END_ENTREGA.ToString().Trim());
                        dados.Add("COMP_END_ENTREGA", item.COMP_END_ENTREGA.ToString().Trim());
                        dados.Add("CEP_ENTREGA", item.CEP_ENTREGA.ToString().Trim());
                        dados.Add("BAIRRO_ENTREGA", item.BAIRRO_ENTREGA.ToString().Trim());
                        dados.Add("CIDADE_ENTREGA", item.CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_ENTREGA", item.DESCRICAO_CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("ESTADO_ENTREGA", item.ESTADO_ENTREGA.ToString().Trim());
                        dados.Add("TELEFONE_ENTREGA", item.TELEFONE_ENTREGA.ToString().Trim());

                        dados.Add("ENDERECO_COBRANCA", item.ENDERECO_COBRANCA.ToString().Trim());
                        dados.Add("CEP_COBRANCA", item.CEP_COBRANCA.ToString().Trim());
                        dados.Add("BAIRRO_COBRANCA", item.BAIRRO_COBRANCA.ToString().Trim());
                        dados.Add("CIDADE_COBRANCA", item.CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_COBRANCA", item.DESCRICAO_CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("ESTADO_COBRANCA", item.ESTADO_COBRANCA.ToString().Trim());
                        dados.Add("TELEFONE_COBRANCA", item.TELEFONE_COBRANCA.ToString().Trim());

                        dados.Add("CODIGO_CP_CLIENTE", item.CODIGO_CP_CLIENTE.ToString().Trim());
                        dados.Add("ID_LIMITE_CLIENTE", item.ID_LIMITE.ToString().Trim());

                        dados.Add("CODIGO_VENDEDOR_CLIENTE", item.CODIGO_VENDEDOR_CLIENTE);
                        dados.Add("OBS_CLIENTE", item.OBS_CLIENTE.Trim());

                        dados.Add("ENVIO_NFE_CLIENTE", item.ENVIO_NFE_CLIENTE);

                        dados.Add("EMAIL_CLIENTE", item.EMAIL_CLIENTE.Trim());
                        dados.Add("PESSOA", item.PESSOA);

                        dados.Add("CLIENTE_BLOQUEADO", item.CLIENTE_BLOQUEADO);
                        dados.Add("FORNECEDOR", item.FORNECEDOR);

                        dados.Add("DATA_CADASTRO", ApoioXML.TrataData2(item.DATA_CADASTRO));
                        dados.Add("CODIGO_REGIAO", item.CODIGO_REGIAO);
                    }

                    return dados;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorNomeFantasia(string NOMEFANTASIA_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from cliente in ctx.TB_CLIENTEs
                                 join ufs in ctx.TB_UFs on cliente.ESTADO_FATURA equals ufs.ID_UF
                                 where cliente.NOMEFANTASIA_CLIENTE == NOMEFANTASIA_CLIENTE

                                 select new
                                 {
                                     cliente.ID_CLIENTE,
                                     cliente.NOME_CLIENTE,
                                     cliente.NOMEFANTASIA_CLIENTE,
                                     cliente.CNPJ_CLIENTE,
                                     cliente.IE_CLIENTE,
                                     cliente.IE_SUFRAMA,
                                     cliente.ENDERECO_FATURA,
                                     cliente.NUMERO_END_FATURA,
                                     cliente.COMP_END_FATURA,
                                     cliente.CEP_FATURA,
                                     cliente.BAIRRO_FATURA,
                                     cliente.CIDADE_FATURA,
                                     DESCRICAO_CIDADE_FATURA = cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     cliente.ESTADO_FATURA,
                                     DESCRICAO_ESTADO_FATURA = ufs.DESCRICAO_UF,
                                     cliente.TELEFONE_FATURA,

                                     cliente.ENDERECO_ENTREGA,
                                     cliente.NUMERO_END_ENTREGA,
                                     cliente.COMP_END_ENTREGA,
                                     cliente.CEP_ENTREGA,
                                     cliente.BAIRRO_ENTREGA,
                                     cliente.CIDADE_ENTREGA,
                                     DESCRICAO_CIDADE_ENTREGA = cliente.TB_MUNICIPIO1.NOME_MUNICIPIO,
                                     cliente.ESTADO_ENTREGA,
                                     cliente.TELEFONE_ENTREGA,

                                     cliente.ENDERECO_COBRANCA,
                                     cliente.CEP_COBRANCA,
                                     cliente.BAIRRO_COBRANCA,
                                     cliente.CIDADE_COBRANCA,
                                     DESCRICAO_CIDADE_COBRANCA = cliente.TB_MUNICIPIO2.NOME_MUNICIPIO,
                                     
                                     cliente.ESTADO_COBRANCA,
                                     cliente.TELEFONE_COBRANCA,
                                     cliente.CODIGO_CP_CLIENTE,
                                     cliente.ID_LIMITE,

                                     cliente.CODIGO_VENDEDOR_CLIENTE,
                                     cliente.OBS_CLIENTE,
                                     cliente.EMAIL_CLIENTE,
                                     cliente.ENVIO_NFE_CLIENTE,
                                     cliente.PESSOA,
                                     cliente.CLIENTE_BLOQUEADO,
                                     cliente.FORNECEDOR,

                                     cliente.CONTATOS,
                                     cliente.DATA_CADASTRO,
                                     cliente.CODIGO_REGIAO
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Cliente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_CLIENTE", item.ID_CLIENTE);
                        dados.Add("NOME_CLIENTE", item.NOME_CLIENTE.Trim());
                        dados.Add("NOMEFANTASIA_CLIENTE", item.NOMEFANTASIA_CLIENTE.ToString().Trim());
                        dados.Add("CNPJ_CLIENTE", item.CNPJ_CLIENTE.ToString().Trim());
                        dados.Add("IE_CLIENTE", item.IE_CLIENTE.ToString().Trim());
                        dados.Add("IE_SUFRAMA", item.IE_SUFRAMA.ToString().Trim());
                        dados.Add("ENDERECO_FATURA", item.ENDERECO_FATURA.ToString().Trim());

                        dados.Add("NUMERO_END_FATURA", item.NUMERO_END_FATURA.ToString().Trim());
                        dados.Add("COMP_END_FATURA", item.COMP_END_FATURA.ToString().Trim());

                        dados.Add("CEP_FATURA", item.CEP_FATURA.ToString().Trim());
                        dados.Add("BAIRRO_FATURA", item.BAIRRO_FATURA.ToString().Trim());
                        dados.Add("CIDADE_FATURA", item.CIDADE_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_FATURA", item.DESCRICAO_CIDADE_FATURA.Trim());

                        dados.Add("ESTADO_FATURA", item.ESTADO_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_FATURA", item.DESCRICAO_ESTADO_FATURA.ToString().Trim());

                        dados.Add("TELEFONE_FATURA", item.TELEFONE_FATURA.ToString().Trim());

                        dados.Add("ENDERECO_ENTREGA", item.ENDERECO_ENTREGA.ToString().Trim());
                        dados.Add("NUMERO_END_ENTREGA", item.NUMERO_END_ENTREGA.ToString().Trim());
                        dados.Add("COMP_END_ENTREGA", item.COMP_END_ENTREGA.ToString().Trim());
                        dados.Add("CEP_ENTREGA", item.CEP_ENTREGA.ToString().Trim());
                        dados.Add("BAIRRO_ENTREGA", item.BAIRRO_ENTREGA.ToString().Trim());
                        dados.Add("CIDADE_ENTREGA", item.CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_ENTREGA", item.DESCRICAO_CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("ESTADO_ENTREGA", item.ESTADO_ENTREGA.ToString().Trim());
                        dados.Add("TELEFONE_ENTREGA", item.TELEFONE_ENTREGA.ToString().Trim());

                        dados.Add("ENDERECO_COBRANCA", item.ENDERECO_COBRANCA.ToString().Trim());
                        dados.Add("CEP_COBRANCA", item.CEP_COBRANCA.ToString().Trim());
                        dados.Add("BAIRRO_COBRANCA", item.BAIRRO_COBRANCA.ToString().Trim());
                        dados.Add("CIDADE_COBRANCA", item.CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_COBRANCA", item.DESCRICAO_CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("ESTADO_COBRANCA", item.ESTADO_COBRANCA.ToString().Trim());
                        dados.Add("TELEFONE_COBRANCA", item.TELEFONE_COBRANCA.ToString().Trim());

                        dados.Add("CODIGO_CP_CLIENTE", item.CODIGO_CP_CLIENTE.ToString().Trim());
                        dados.Add("ID_LIMITE_CLIENTE", item.ID_LIMITE.ToString().Trim());

                        dados.Add("CODIGO_VENDEDOR_CLIENTE", item.CODIGO_VENDEDOR_CLIENTE);
                        dados.Add("OBS_CLIENTE", item.OBS_CLIENTE.Trim());

                        dados.Add("EMAIL_CLIENTE", item.EMAIL_CLIENTE.Trim());
                        dados.Add("ENVIO_NFE_CLIENTE", item.ENVIO_NFE_CLIENTE);

                        dados.Add("PESSOA", item.PESSOA);

                        dados.Add("CLIENTE_BLOQUEADO", item.CLIENTE_BLOQUEADO);

                        dados.Add("FORNECEDOR", item.FORNECEDOR);

                        dados.Add("DATA_CADASTRO", ApoioXML.TrataData2(item.DATA_CADASTRO));
                        dados.Add("CODIGO_REGIAO", item.CODIGO_REGIAO);
                    }

                    return dados;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaPorCNPJ(string CNPJ_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from cliente in ctx.TB_CLIENTEs
                                 join ufs in ctx.TB_UFs on cliente.ESTADO_FATURA equals ufs.ID_UF
                                 where cliente.CNPJ_CLIENTE == CNPJ_CLIENTE

                                 select new
                                 {
                                     cliente.ID_CLIENTE,
                                     cliente.NOME_CLIENTE,
                                     cliente.NOMEFANTASIA_CLIENTE,
                                     cliente.CNPJ_CLIENTE,
                                     cliente.IE_CLIENTE,
                                     cliente.IE_SUFRAMA,
                                     cliente.ENDERECO_FATURA,
                                     cliente.NUMERO_END_FATURA,
                                     cliente.COMP_END_FATURA,
                                     cliente.CEP_FATURA,
                                     cliente.BAIRRO_FATURA,
                                     cliente.CIDADE_FATURA,
                                     DESCRICAO_CIDADE_FATURA = cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                     cliente.ESTADO_FATURA,
                                     DESCRICAO_ESTADO_FATURA = ufs.DESCRICAO_UF,
                                     cliente.TELEFONE_FATURA,

                                     cliente.ENDERECO_ENTREGA,
                                     cliente.NUMERO_END_ENTREGA,
                                     cliente.COMP_END_ENTREGA,
                                     cliente.CEP_ENTREGA,
                                     cliente.BAIRRO_ENTREGA,
                                     cliente.CIDADE_ENTREGA,
                                     DESCRICAO_CIDADE_ENTREGA = cliente.TB_MUNICIPIO1.NOME_MUNICIPIO,
                                     cliente.ESTADO_ENTREGA,
                                     cliente.TELEFONE_ENTREGA,

                                     cliente.ENDERECO_COBRANCA,
                                     cliente.CEP_COBRANCA,
                                     cliente.BAIRRO_COBRANCA,
                                     cliente.CIDADE_COBRANCA,
                                     DESCRICAO_CIDADE_COBRANCA = cliente.TB_MUNICIPIO2.NOME_MUNICIPIO,
                                     cliente.ESTADO_COBRANCA,
                                     cliente.TELEFONE_COBRANCA,
                                     cliente.CODIGO_CP_CLIENTE,
                                     cliente.ID_LIMITE,
                                     cliente.CODIGO_VENDEDOR_CLIENTE,
                                     cliente.OBS_CLIENTE,
                                     cliente.EMAIL_CLIENTE,
                                     cliente.ENVIO_NFE_CLIENTE,
                                     cliente.PESSOA,

                                     cliente.CONTATOS,
                                     cliente.CLIENTE_BLOQUEADO,
                                     cliente.FORNECEDOR,

                                     cliente.DATA_CADASTRO,
                                     cliente.CODIGO_REGIAO
                                 }).ToList();

                    if (query.Count() == 0)
                        throw new Exception("Cliente n&atilde;o encontrado");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    foreach (var item in query)
                    {
                        dados.Add("ID_CLIENTE", item.ID_CLIENTE);
                        dados.Add("NOME_CLIENTE", item.NOME_CLIENTE.Trim());
                        dados.Add("NOMEFANTASIA_CLIENTE", item.NOMEFANTASIA_CLIENTE.ToString().Trim());
                        dados.Add("CNPJ_CLIENTE", item.CNPJ_CLIENTE.ToString().Trim());
                        dados.Add("IE_CLIENTE", item.IE_CLIENTE.ToString().Trim());
                        dados.Add("IE_SUFRAMA", item.IE_SUFRAMA.ToString().Trim());
                        dados.Add("ENDERECO_FATURA", item.ENDERECO_FATURA.ToString().Trim());

                        dados.Add("NUMERO_END_FATURA", item.NUMERO_END_FATURA.ToString().Trim());
                        dados.Add("COMP_END_FATURA", item.COMP_END_FATURA.ToString().Trim());

                        dados.Add("CEP_FATURA", item.CEP_FATURA.ToString().Trim());
                        dados.Add("BAIRRO_FATURA", item.BAIRRO_FATURA.ToString().Trim());
                        dados.Add("CIDADE_FATURA", item.CIDADE_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_FATURA", item.DESCRICAO_CIDADE_FATURA.Trim());

                        dados.Add("ESTADO_FATURA", item.ESTADO_FATURA.ToString().Trim());
                        dados.Add("DESCRICAO_ESTADO_FATURA", item.DESCRICAO_ESTADO_FATURA.ToString().Trim());

                        dados.Add("TELEFONE_FATURA", item.TELEFONE_FATURA.ToString().Trim());

                        dados.Add("ENDERECO_ENTREGA", item.ENDERECO_ENTREGA.ToString().Trim());
                        dados.Add("NUMERO_END_ENTREGA", item.NUMERO_END_ENTREGA.ToString().Trim());
                        dados.Add("COMP_END_ENTREGA", item.COMP_END_ENTREGA.ToString().Trim());

                        dados.Add("CEP_ENTREGA", item.CEP_ENTREGA.ToString().Trim());
                        dados.Add("BAIRRO_ENTREGA", item.BAIRRO_ENTREGA.ToString().Trim());
                        dados.Add("CIDADE_ENTREGA", item.CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_ENTREGA", item.DESCRICAO_CIDADE_ENTREGA.ToString().Trim());
                        dados.Add("ESTADO_ENTREGA", item.ESTADO_ENTREGA.ToString().Trim());
                        dados.Add("TELEFONE_ENTREGA", item.TELEFONE_ENTREGA.ToString().Trim());

                        dados.Add("ENDERECO_COBRANCA", item.ENDERECO_COBRANCA.ToString().Trim());
                        dados.Add("CEP_COBRANCA", item.CEP_COBRANCA.ToString().Trim());
                        dados.Add("BAIRRO_COBRANCA", item.BAIRRO_COBRANCA.ToString().Trim());
                        dados.Add("CIDADE_COBRANCA", item.CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("DESCRICAO_CIDADE_COBRANCA", item.DESCRICAO_CIDADE_COBRANCA.ToString().Trim());
                        dados.Add("ESTADO_COBRANCA", item.ESTADO_COBRANCA.ToString().Trim());
                        dados.Add("TELEFONE_COBRANCA", item.TELEFONE_COBRANCA.ToString().Trim());

                        dados.Add("CODIGO_CP_CLIENTE", item.CODIGO_CP_CLIENTE.ToString().Trim());
                        dados.Add("ID_LIMITE_CLIENTE", item.ID_LIMITE.ToString().Trim());

                        dados.Add("CODIGO_VENDEDOR_CLIENTE", item.CODIGO_VENDEDOR_CLIENTE);
                        dados.Add("OBS_CLIENTE", item.OBS_CLIENTE.Trim());

                        dados.Add("EMAIL_CLIENTE", item.EMAIL_CLIENTE.Trim());
                        dados.Add("ENVIO_NFE_CLIENTE", item.ENVIO_NFE_CLIENTE);
                        dados.Add("PESSOA", item.PESSOA);

                        dados.Add("CLIENTE_BLOQUEADO", item.CLIENTE_BLOQUEADO);

                        dados.Add("FORNECEDOR", item.FORNECEDOR);
                        dados.Add("DATA_CADASTRO", ApoioXML.TrataData2(item.DATA_CADASTRO));
                        dados.Add("CODIGO_REGIAO", item.CODIGO_REGIAO);
                    }

                    return dados;
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoCliente(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Cliente_Fornecedor cliente = new Doran_Cliente_Fornecedor())
                {
                    cliente.Grava_Dados_Cliente_e_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void AtualizaCliente(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_Cliente_Fornecedor cliente = new Doran_Cliente_Fornecedor())
                {
                    cliente.Atualiza_Cliente_e_Fornecedor(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaCliente(int ID_CLIENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = (from item in ctx.TB_CLIENTEs
                                 where item.ID_CLIENTE == ID_CLIENTE
                                 select item).ToList();

                    foreach (var linha in query)
                    {
                        ctx.TB_CLIENTEs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_CLIENTEs.ToString(), ID_USUARIO);
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
        public string ListaClientes(Dictionary<string, string> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cliente in ctx.TB_CLIENTEs
                                join ufs in ctx.TB_UFs on cliente.ESTADO_FATURA equals ufs.ID_UF

                                where cliente.NOMEFANTASIA_CLIENTE.StartsWith(dados["nomeFantasia"].ToString()) &&
                                cliente.NOME_CLIENTE.Contains(dados["nome"].ToString())

                                orderby cliente.NOMEFANTASIA_CLIENTE

                                select new
                                {
                                    cliente.ID_CLIENTE,
                                    cliente.NOME_CLIENTE,
                                    cliente.NOMEFANTASIA_CLIENTE,
                                    cliente.CNPJ_CLIENTE,
                                    cliente.IE_CLIENTE,
                                    cliente.IE_SUFRAMA,
                                    cliente.ENDERECO_FATURA,
                                    cliente.NUMERO_END_FATURA,
                                    cliente.COMP_END_FATURA,
                                    cliente.CEP_FATURA,
                                    cliente.BAIRRO_FATURA,
                                    cliente.CIDADE_FATURA,
                                    DESCRICAO_CIDADE_FATURA = cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                    cliente.ESTADO_FATURA,
                                    DESCRICAO_ESTADO_FATURA = ufs.DESCRICAO_UF,
                                    cliente.TELEFONE_FATURA,

                                    cliente.ENDERECO_ENTREGA,
                                    cliente.CEP_ENTREGA,
                                    cliente.BAIRRO_ENTREGA,
                                    cliente.CIDADE_ENTREGA,
                                    cliente.ESTADO_ENTREGA,
                                    cliente.TELEFONE_ENTREGA,

                                    cliente.ENDERECO_COBRANCA,
                                    cliente.CEP_COBRANCA,
                                    cliente.BAIRRO_COBRANCA,
                                    cliente.CIDADE_COBRANCA,
                                    cliente.ESTADO_COBRANCA,
                                    cliente.TELEFONE_COBRANCA,

                                    cliente.CODIGO_CP_CLIENTE,

                                    cliente.CONTATOS,

                                    cliente.FORNECEDOR,
                                    cliente.CODIGO_VENDEDOR_CLIENTE
                                };

                    int rowCount = query.Count();

                    var query2 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return objQueryToXML(ctx, query2, rowCount, Convert.ToDecimal(dados["ID_USUARIO"]));
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string ListaClientes_OperacaoTriangular(Dictionary<string, string> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from cliente in ctx.TB_CLIENTEs
                                join ufs in ctx.TB_UFs on cliente.ESTADO_FATURA equals ufs.ID_UF

                                where cliente.NOMEFANTASIA_CLIENTE.StartsWith(dados["nomeFantasia"].ToString()) &&
                                cliente.NOME_CLIENTE.Contains(dados["nome"].ToString())

                                orderby cliente.NOMEFANTASIA_CLIENTE

                                select new
                                {
                                    cliente.ID_CLIENTE,
                                    cliente.NOME_CLIENTE,
                                    cliente.NOMEFANTASIA_CLIENTE,
                                    cliente.CNPJ_CLIENTE,
                                    cliente.IE_CLIENTE,
                                    cliente.CIDADE_FATURA,
                                    DESCRICAO_CIDADE_FATURA = cliente.TB_MUNICIPIO.NOME_MUNICIPIO,
                                    cliente.ESTADO_FATURA,
                                    DESCRICAO_ESTADO_FATURA = ufs.DESCRICAO_UF,
                                    cliente.TELEFONE_FATURA
                                };

                    int rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query1, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        private string ContatosDoCliente(decimal ID_CLIENTE, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from contatos in ctx.TB_CLIENTE_CONTATOs
                             where contatos.ID_CLIENTE == ID_CLIENTE
                             select new
                             {
                                 contatos.NOME_CONTATO_CLIENTE,
                                 contatos.TELEFONE_CONTATO_CLIENTE,
                                 contatos.EMAIL_CONTATO_CLIENTE,
                                 contatos.FAX_CONTATO_CLIENTE
                             }).ToList();

                string retorno = string.Format("<div><br /><b>Contatos</b><br /><hr /><table style='width: 85%;'><tr><td><b>{0}</b></td><td><b>{1}</b></td><td><b>{2}</b></td><td><b>{3}</b></td></tr>",
                                    "Nome", "Telefone", "e-mail", "fax");

                foreach (var item in query)
                {
                    retorno += string.Format("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>",
                        item.NOME_CONTATO_CLIENTE,
                        item.TELEFONE_CONTATO_CLIENTE,
                        item.EMAIL_CONTATO_CLIENTE,
                        item.FAX_CONTATO_CLIENTE);
                }

                retorno += "</table><br /></div>";

                return retorno;
            }
        }

        private string objQueryToXML(System.Data.Linq.DataContext ctx, object query, int rowCount, decimal ID_USUARIO)
        {
            DataTable dt = ApoioXML.ToDataTable(ctx, query);
            dt.Columns["CONTATOS"].MaxLength = 50000;

            foreach (DataRow dr in dt.Rows)
            {
                dr["CONTATOS"] = ContatosDoCliente(Convert.ToDecimal(dr["ID_CLIENTE"]), ID_USUARIO);
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

        [WebMethod()]
        public string ListaContatos(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_CLIENTE_CONTATOs
                                where (linha.NOME_CONTATO_CLIENTE.Contains(dados["pesquisa"].ToString())
                                || linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString())
                                || linha.TB_CLIENTE.NOME_CLIENTE.Contains(dados["pesquisa"].ToString()))

                                select new
                                {
                                    linha.ID_CLIENTE,
                                    linha.ID_CONTATO,
                                    linha.NOME_CONTATO_CLIENTE,
                                    linha.TELEFONE_CONTATO_CLIENTE,
                                    linha.EMAIL_CONTATO_CLIENTE,
                                    linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.TB_CLIENTE.CODIGO_CP_CLIENTE,
                                    linha.TB_CLIENTE.ESTADO_FATURA
                                };

                    var rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    string retorno = ApoioXML.objQueryToXML(ctx, query1, rowCount);

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
        public string ListaContatos_Vendas(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from linha in ctx.TB_CLIENTE_CONTATOs
                                where (linha.NOME_CONTATO_CLIENTE.Contains(dados["pesquisa"].ToString())
                                || linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString())
                                || linha.TB_CLIENTE.NOME_CLIENTE.Contains(dados["pesquisa"].ToString()))

                                select new
                                {
                                    linha.ID_CLIENTE,
                                    linha.ID_CONTATO,
                                    linha.NOME_CONTATO_CLIENTE,
                                    linha.TELEFONE_CONTATO_CLIENTE,
                                    linha.EMAIL_CONTATO_CLIENTE,
                                    linha.TB_CLIENTE.NOME_CLIENTE,
                                    linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                    linha.TB_CLIENTE.CODIGO_CP_CLIENTE,
                                    linha.TB_CLIENTE.ESTADO_FATURA,
                                    linha.TB_CLIENTE.CODIGO_VENDEDOR_CLIENTE,
                                    linha.TB_CLIENTE.CNPJ_CLIENTE,
                                    ENDERECO = linha.TB_CLIENTE.ENDERECO_FATURA,
                                    NUMERO = linha.TB_CLIENTE.NUMERO_END_FATURA,
                                    COMPLEMENTO = linha.TB_CLIENTE.COMP_END_FATURA,
                                    CEP = linha.TB_CLIENTE.CEP_FATURA,
                                    CIDADE = linha.TB_CLIENTE.TB_MUNICIPIO.NOME_MUNICIPIO,
                                    ESTADO = linha.TB_CLIENTE.TB_MUNICIPIO.TB_UF.SIGLA_UF,
                                    linha.TB_CLIENTE.OBS_CLIENTE,
                                };

                    var rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    return ApoioXML.objQueryToXML(ctx, query1, rowCount);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }
    }
}