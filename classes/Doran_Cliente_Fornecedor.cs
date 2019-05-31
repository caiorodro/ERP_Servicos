using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;
using System.Data.Linq;
using System.Configuration;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Cliente_Fornecedor : IDisposable
    {
        public Doran_Cliente_Fornecedor()
        {
        }

        public void Grava_Dados_Cliente_e_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var existe_cnpj = (from linha in ctx.GetTable<TB_CLIENTE>()

                                   orderby linha.CNPJ_CLIENTE

                                   where linha.CNPJ_CLIENTE == dados["CNPJ_CLIENTE"].ToString()

                                   select linha).Any();

                if (existe_cnpj)
                    throw new Exception("J&aacute; existe um cliente cadastrado com este CNPJ [" + dados["CNPJ_CLIENTE"].ToString() + "]");

                var existe_nome_fantasia = (from linha in ctx.GetTable<TB_CLIENTE>()

                                            orderby linha.NOMEFANTASIA_CLIENTE

                                            where linha.NOMEFANTASIA_CLIENTE == dados["NOMEFANTASIA_CLIENTE"].ToString()

                                            select linha).Any();

                if (existe_nome_fantasia)
                    throw new Exception("J&aacute; existe um cliente cadastrado com este nome fantasia [" + dados["NOMEFANTASIA_CLIENTE"].ToString() + "]");

                decimal id_uf = decimal.TryParse(dados["ESTADO_ENTREGA"].ToString(), out id_uf) ?
                    Convert.ToDecimal(dados["ESTADO_ENTREGA"]) : 0;

                decimal cidade = decimal.TryParse(dados["CIDADE_ENTREGA"].ToString(), out cidade) ?
                    Convert.ToDecimal(dados["CIDADE_ENTREGA"]) : 0;

                decimal id_uf1 = decimal.TryParse(dados["ESTADO_COBRANCA"].ToString(), out id_uf1) ?
                    Convert.ToDecimal(dados["ESTADO_COBRANCA"]) : 0;

                decimal cidade1 = decimal.TryParse(dados["CIDADE_COBRANCA"].ToString(), out cidade1) ?
                    Convert.ToDecimal(dados["CIDADE_COBRANCA"]) : 0;

                System.Data.Linq.Table<Doran_Servicos_ORM.TB_CLIENTE> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CLIENTE>();

                Doran_Servicos_ORM.TB_CLIENTE novo = new Doran_Servicos_ORM.TB_CLIENTE();

                novo.NOME_CLIENTE = dados["NOME_CLIENTE"].ToString();
                novo.NOMEFANTASIA_CLIENTE = dados["NOMEFANTASIA_CLIENTE"].ToString();
                novo.CNPJ_CLIENTE = dados["CNPJ_CLIENTE"].ToString();
                novo.IE_CLIENTE = dados["IE_CLIENTE"].ToString();
                novo.IE_SUFRAMA = dados["IE_SUFRAMA"].ToString();

                novo.ENDERECO_FATURA = dados["ENDERECO_FATURA"].ToString();
                novo.NUMERO_END_FATURA = dados["NUMERO_END_FATURA"].ToString();
                novo.COMP_END_FATURA = dados["COMP_END_FATURA"].ToString();

                novo.CEP_FATURA = dados["CEP_FATURA"].ToString();
                novo.BAIRRO_FATURA = dados["BAIRRO_FATURA"].ToString();
                novo.CIDADE_FATURA = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                novo.ESTADO_FATURA = Convert.ToDecimal(dados["ESTADO_FATURA"]);
                novo.TELEFONE_FATURA = dados["TELEFONE_FATURA"].ToString();

                novo.ENDERECO_ENTREGA = dados["ENDERECO_ENTREGA"].ToString();
                novo.NUMERO_END_ENTREGA = dados["NUMERO_END_ENTREGA"].ToString();
                novo.COMP_END_ENTREGA = dados["COMP_END_ENTREGA"].ToString();

                novo.CEP_ENTREGA = dados["CEP_ENTREGA"].ToString();
                novo.BAIRRO_ENTREGA = dados["BAIRRO_ENTREGA"].ToString();
                novo.CIDADE_ENTREGA = cidade;
                novo.ESTADO_ENTREGA = id_uf;
                novo.TELEFONE_ENTREGA = dados["TELEFONE_ENTREGA"].ToString();

                novo.ENDERECO_COBRANCA = dados["ENDERECO_COBRANCA"].ToString();
                novo.CEP_COBRANCA = dados["CEP_COBRANCA"].ToString();
                novo.BAIRRO_COBRANCA = dados["BAIRRO_COBRANCA"].ToString();
                novo.CIDADE_COBRANCA = cidade1;
                novo.ESTADO_COBRANCA = id_uf1;
                novo.TELEFONE_COBRANCA = dados["TELEFONE_COBRANCA"].ToString();

                novo.CODIGO_CP_CLIENTE = Convert.ToDecimal(dados["CODIGO_CP_CLIENTE"]);
                novo.ID_LIMITE = Convert.ToDecimal(dados["ID_LIMITE_CLIENTE"]);

                novo.CODIGO_VENDEDOR_CLIENTE = Convert.ToDecimal(dados["CODIGO_VENDEDOR_CLIENTE"]);
                novo.OBS_CLIENTE = dados["OBS_CLIENTE"].ToString();
                novo.PESSOA = Convert.ToDecimal(dados["PESSOA"]);

                novo.EMAIL_CLIENTE = dados["EMAIL_CLIENTE"].ToString();
                novo.ENVIO_NFE_CLIENTE = Convert.ToDecimal(dados["ENVIO_NFE_CLIENTE"]);

                novo.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                novo.CLIENTE_BLOQUEADO = Convert.ToDecimal(dados["CLIENTE_BLOQUEADO"]);

                novo.FORNECEDOR = Convert.ToDecimal(dados["FORNECEDOR"]);
                novo.DATA_ULTIMA_FATURA = new DateTime(1901, 01, 01);
                novo.VALOR_ULTIMA_FATURA = 0;
                novo.DATA_CADASTRO = DateTime.Now;

                novo.CODIGO_REGIAO = dados["CODIGO_REGIAO"].ToString();

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                if (novo.FORNECEDOR == 1)
                {
                    // Grava Fornecedor

                    var fornecedor_cnpj = (from linha in ctx.GetTable<TB_FORNECEDOR>()

                                           orderby linha.CNPJ_FORNECEDOR

                                           where linha.CNPJ_FORNECEDOR == dados["CNPJ_CLIENTE"].ToString()

                                           select linha).ToList();

                    var fornecedor_nome_fantasia = (from linha in ctx.GetTable<TB_FORNECEDOR>()

                                                    orderby linha.NOME_FANTASIA_FORNECEDOR

                                                    where linha.NOME_FANTASIA_FORNECEDOR == dados["NOMEFANTASIA_CLIENTE"].ToString()

                                                    select linha).ToList();

                    if (!fornecedor_cnpj.Any() && !fornecedor_nome_fantasia.Any())
                    {
                        Table<TB_FORNECEDOR> Entidade1 = ctx.GetTable<TB_FORNECEDOR>();

                        TB_FORNECEDOR novo1 = new TB_FORNECEDOR();

                        novo1.NOME_FORNECEDOR = dados["NOME_CLIENTE"].ToString();
                        novo1.NOME_FANTASIA_FORNECEDOR = dados["NOMEFANTASIA_CLIENTE"].ToString();
                        novo1.CNPJ_FORNECEDOR = dados["CNPJ_CLIENTE"].ToString();
                        novo1.IE_FORNECEDOR = dados["IE_CLIENTE"].ToString();

                        novo1.ENDERECO_FORNECEDOR = dados["ENDERECO_FATURA"].ToString();
                        novo1.NUMERO_END_FORNECEDOR = dados["NUMERO_END_ENTREGA"].ToString();
                        novo1.COMPL_END_FORNECEDOR = dados["COMP_END_FATURA"].ToString();
                        novo1.CEP_FORNECEDOR = dados["CEP_FATURA"].ToString();
                        novo1.BAIRRO_FORNECEDOR = dados["BAIRRO_FATURA"].ToString();

                        novo1.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                        novo1.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ESTADO_FATURA"]);

                        novo1.TELEFONE1_FORNECEDOR = dados["TELEFONE_FATURA"].ToString();
                        novo1.TELEFONE2_FORNECEDOR = string.Empty;

                        novo1.FAX_FORNECEDOR = string.Empty;
                        novo1.OBS_FORNECEDOR = string.Empty;

                        novo1.EMAIL_FORNECEDOR = dados["EMAIL_CLIENTE"].ToString();

                        novo1.CONTATO_FORNECEDOR = string.Empty;

                        novo1.CLIENTE = 1;

                        novo1.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                        Entidade1.InsertOnSubmit(novo1);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                    }
                    else
                    {
                        foreach (var item in fornecedor_nome_fantasia)
                        {
                            item.NOME_FORNECEDOR = dados["NOME_CLIENTE"].ToString();
                            item.NOME_FANTASIA_FORNECEDOR = dados["NOMEFANTASIA_CLIENTE"].ToString();
                            item.CNPJ_FORNECEDOR = dados["CNPJ_CLIENTE"].ToString();
                            item.IE_FORNECEDOR = dados["IE_CLIENTE"].ToString();

                            item.ENDERECO_FORNECEDOR = dados["ENDERECO_FATURA"].ToString();
                            item.NUMERO_END_FORNECEDOR = dados["NUMERO_END_ENTREGA"].ToString();
                            item.COMPL_END_FORNECEDOR = dados["COMP_END_FATURA"].ToString();
                            item.CEP_FORNECEDOR = dados["CEP_FATURA"].ToString();
                            item.BAIRRO_FORNECEDOR = dados["BAIRRO_FATURA"].ToString();

                            item.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                            item.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ESTADO_FATURA"]);

                            item.TELEFONE1_FORNECEDOR = dados["TELEFONE_FATURA"].ToString();
                            item.TELEFONE2_FORNECEDOR = string.Empty;

                            item.FAX_FORNECEDOR = string.Empty;
                            item.OBS_FORNECEDOR = string.Empty;

                            item.EMAIL_FORNECEDOR = dados["EMAIL_CLIENTE"].ToString();

                            item.CLIENTE = 1;

                            item.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_FORNECEDOR>().GetModifiedMembers(item),
                                "TB_FORNECEDOR", Convert.ToDecimal(dados["ID_USUARIO"]));
                        }
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public void Atualiza_Cliente_e_Fornecedor(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.GetTable<TB_CLIENTE>()
                             where item.ID_CLIENTE == Convert.ToDecimal(dados["ID_CLIENTE"])
                             select item).ToList();

                if (query.Count() == 0)
                    throw new Exception("N&atilde;o foi poss&iacute;vel encontrar o cliente com o ID [" + dados["ID_CLIENTE"].ToString() + "]");

                decimal id_uf = decimal.TryParse(dados["ESTADO_ENTREGA"].ToString(), out id_uf) ?
                    Convert.ToDecimal(dados["ESTADO_ENTREGA"]) : 0;

                decimal cidade = decimal.TryParse(dados["CIDADE_ENTREGA"].ToString(), out cidade) ?
                    Convert.ToDecimal(dados["CIDADE_ENTREGA"]) : 0;

                decimal id_uf1 = decimal.TryParse(dados["ESTADO_COBRANCA"].ToString(), out id_uf1) ?
                    Convert.ToDecimal(dados["ESTADO_COBRANCA"]) : 0;

                decimal cidade1 = decimal.TryParse(dados["CIDADE_COBRANCA"].ToString(), out cidade1) ?
                    Convert.ToDecimal(dados["CIDADE_COBRANCA"]) : 0;

                string CNPJ = "";

                foreach (var cliente in query)
                {
                    CNPJ = dados["CNPJ_CLIENTE"].ToString();

                    cliente.NOME_CLIENTE = dados["NOME_CLIENTE"].ToString();
                    cliente.NOMEFANTASIA_CLIENTE = dados["NOMEFANTASIA_CLIENTE"].ToString();
                    cliente.CNPJ_CLIENTE = dados["CNPJ_CLIENTE"].ToString();
                    cliente.IE_CLIENTE = dados["IE_CLIENTE"].ToString();
                    cliente.IE_SUFRAMA = dados["IE_SUFRAMA"].ToString();

                    cliente.ENDERECO_FATURA = dados["ENDERECO_FATURA"].ToString();
                    cliente.NUMERO_END_FATURA = dados["NUMERO_END_FATURA"].ToString();
                    cliente.COMP_END_FATURA = dados["COMP_END_FATURA"].ToString();

                    cliente.CEP_FATURA = dados["CEP_FATURA"].ToString();
                    cliente.BAIRRO_FATURA = dados["BAIRRO_FATURA"].ToString();
                    cliente.CIDADE_FATURA = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                    cliente.ESTADO_FATURA = Convert.ToDecimal(dados["ESTADO_FATURA"]);
                    cliente.TELEFONE_FATURA = dados["TELEFONE_FATURA"].ToString();

                    cliente.ENDERECO_ENTREGA = dados["ENDERECO_ENTREGA"].ToString();
                    cliente.NUMERO_END_ENTREGA = dados["NUMERO_END_ENTREGA"].ToString();
                    cliente.COMP_END_ENTREGA = dados["COMP_END_ENTREGA"].ToString();
                    cliente.CEP_ENTREGA = dados["CEP_ENTREGA"].ToString();
                    cliente.BAIRRO_ENTREGA = dados["BAIRRO_ENTREGA"].ToString();
                    cliente.CIDADE_ENTREGA = cidade;
                    cliente.ESTADO_ENTREGA = id_uf;
                    cliente.TELEFONE_ENTREGA = dados["TELEFONE_ENTREGA"].ToString();

                    cliente.ENDERECO_COBRANCA = dados["ENDERECO_COBRANCA"].ToString();
                    cliente.CEP_COBRANCA = dados["CEP_COBRANCA"].ToString();
                    cliente.BAIRRO_COBRANCA = dados["BAIRRO_COBRANCA"].ToString();
                    cliente.CIDADE_COBRANCA = cidade1;
                    cliente.ESTADO_COBRANCA = id_uf1;
                    cliente.TELEFONE_COBRANCA = dados["TELEFONE_COBRANCA"].ToString();

                    cliente.CODIGO_CP_CLIENTE = Convert.ToDecimal(dados["CODIGO_CP_CLIENTE"]);
                    cliente.ID_LIMITE = Convert.ToDecimal(dados["ID_LIMITE_CLIENTE"]);

                    cliente.CODIGO_VENDEDOR_CLIENTE = Convert.ToDecimal(dados["CODIGO_VENDEDOR_CLIENTE"]);
                    cliente.OBS_CLIENTE = dados["OBS_CLIENTE"].ToString();

                    cliente.EMAIL_CLIENTE = dados["EMAIL_CLIENTE"].ToString();
                    cliente.ENVIO_NFE_CLIENTE = Convert.ToDecimal(dados["ENVIO_NFE_CLIENTE"]);
                    cliente.PESSOA = Convert.ToDecimal(dados["PESSOA"]);

                    cliente.CLIENTE_BLOQUEADO = Convert.ToDecimal(dados["CLIENTE_BLOQUEADO"]);

                    cliente.FORNECEDOR = Convert.ToDecimal(dados["FORNECEDOR"]);

                    cliente.CODIGO_REGIAO = dados["CODIGO_REGIAO"].ToString();

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_CLIENTE>().GetModifiedMembers(cliente),
                        "TB_CLIENTE", Convert.ToDecimal(dados["ID_USUARIO"]));
                }

                // Atualiza Fornecedor

                var query1 = (from item in ctx.TB_FORNECEDORs
                              orderby item.CNPJ_FORNECEDOR
                              where item.CNPJ_FORNECEDOR == dados["CNPJ_CLIENTE"].ToString()
                              select item).ToList();

                var query2 = (from item in ctx.TB_FORNECEDORs
                              orderby item.NOME_FANTASIA_FORNECEDOR
                              where item.NOME_FANTASIA_FORNECEDOR == dados["NOMEFANTASIA_CLIENTE"].ToString()
                              select item).ToList();

                if (query1.Any() || query2.Any())
                {
                    var query3 = query1.Any() ? query1 : query2;

                    foreach (var novo1 in query3)
                    {
                        novo1.NOME_FORNECEDOR = dados["NOME_CLIENTE"].ToString();
                        novo1.NOME_FANTASIA_FORNECEDOR = dados["NOMEFANTASIA_CLIENTE"].ToString();
                        novo1.IE_FORNECEDOR = dados["IE_CLIENTE"].ToString();

                        novo1.ENDERECO_FORNECEDOR = dados["ENDERECO_FATURA"].ToString();
                        novo1.NUMERO_END_FORNECEDOR = dados["NUMERO_END_ENTREGA"].ToString();
                        novo1.COMPL_END_FORNECEDOR = dados["COMP_END_FATURA"].ToString();
                        novo1.CEP_FORNECEDOR = dados["CEP_FATURA"].ToString();
                        novo1.BAIRRO_FORNECEDOR = dados["BAIRRO_FATURA"].ToString();

                        novo1.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                        novo1.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ESTADO_FATURA"]);

                        novo1.TELEFONE1_FORNECEDOR = dados["TELEFONE_FATURA"].ToString();

                        novo1.EMAIL_FORNECEDOR = dados["EMAIL_CLIENTE"].ToString();

                        novo1.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FORNECEDORs.GetModifiedMembers(novo1),
                            ctx.TB_FORNECEDORs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                    }
                }
                else
                {
                    Table<TB_FORNECEDOR> Entidade1 = ctx.GetTable<TB_FORNECEDOR>();

                    TB_FORNECEDOR novo1 = new TB_FORNECEDOR();

                    novo1.NOME_FORNECEDOR = dados["NOME_CLIENTE"].ToString();
                    novo1.NOME_FANTASIA_FORNECEDOR = dados["NOMEFANTASIA_CLIENTE"].ToString();
                    novo1.CNPJ_FORNECEDOR = dados["CNPJ_CLIENTE"].ToString();
                    novo1.IE_FORNECEDOR = dados["IE_CLIENTE"].ToString();

                    novo1.ENDERECO_FORNECEDOR = dados["ENDERECO_FATURA"].ToString();
                    novo1.NUMERO_END_FORNECEDOR = dados["NUMERO_END_ENTREGA"].ToString();
                    novo1.COMPL_END_FORNECEDOR = dados["COMP_END_FATURA"].ToString();
                    novo1.CEP_FORNECEDOR = dados["CEP_FATURA"].ToString();
                    novo1.BAIRRO_FORNECEDOR = dados["BAIRRO_FATURA"].ToString();

                    novo1.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["CIDADE_FATURA"]);
                    novo1.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ESTADO_FATURA"]);

                    novo1.TELEFONE1_FORNECEDOR = dados["TELEFONE_FATURA"].ToString();
                    novo1.TELEFONE2_FORNECEDOR = string.Empty;

                    novo1.FAX_FORNECEDOR = string.Empty;
                    novo1.OBS_FORNECEDOR = string.Empty;

                    novo1.EMAIL_FORNECEDOR = dados["EMAIL_CLIENTE"].ToString();

                    novo1.CONTATO_FORNECEDOR = string.Empty;

                    novo1.CLIENTE = 1;

                    novo1.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                    Entidade1.InsertOnSubmit(novo1);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                }

                ctx.SubmitChanges();
            }
        }

        public void Grava_Dados_Fornecedor_e_Cliente(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                Table<TB_FORNECEDOR> Entidade = ctx.GetTable<TB_FORNECEDOR>();

                TB_FORNECEDOR novo = new TB_FORNECEDOR();

                novo.NOME_FORNECEDOR = dados["NOME_FORNECEDOR"].ToString();
                novo.NOME_FANTASIA_FORNECEDOR = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                novo.CNPJ_FORNECEDOR = dados["CNPJ_FORNECEDOR"].ToString();
                novo.IE_FORNECEDOR = dados["IE_FORNECEDOR"].ToString();

                novo.ENDERECO_FORNECEDOR = dados["ENDERECO_FORNECEDOR"].ToString();
                novo.NUMERO_END_FORNECEDOR = dados["NUMERO_END_FORNECEDOR"].ToString();
                novo.COMPL_END_FORNECEDOR = dados["COMPL_END_FORNECEDOR"].ToString();
                novo.CEP_FORNECEDOR = dados["CEP_FORNECEDOR"].ToString();
                novo.BAIRRO_FORNECEDOR = dados["BAIRRO_FORNECEDOR"].ToString();

                novo.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                novo.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);

                novo.TELEFONE1_FORNECEDOR = dados["TELEFONE1_FORNECEDOR"].ToString();
                novo.TELEFONE2_FORNECEDOR = dados["TELEFONE2_FORNECEDOR"].ToString();

                novo.FAX_FORNECEDOR = dados["FAX_FORNECEDOR"].ToString();
                novo.OBS_FORNECEDOR = dados["OBS_FORNECEDOR"].ToString();

                novo.EMAIL_FORNECEDOR = dados["EMAIL_FORNECEDOR"].ToString();

                novo.CONTATO_FORNECEDOR = dados["CONTATO_FORNECEDOR"].ToString();

                novo.CODIGO_CP_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_FORNECEDOR"]);

                novo.CLIENTE = dados.ContainsKey("CLIENTE") ? Convert.ToDecimal(dados["CLIENTE"]) : 0;

                novo.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                if (novo.CLIENTE == 1)
                {
                    var query = (from linha in ctx.GetTable<TB_CLIENTE>()
                                 orderby linha.CNPJ_CLIENTE
                                 where linha.CNPJ_CLIENTE == dados["CNPJ_FORNECEDOR"].ToString()

                                 select linha).ToList();

                    var query2 = (from linha in ctx.GetTable<TB_CLIENTE>()
                                  orderby linha.NOMEFANTASIA_CLIENTE

                                  where linha.NOMEFANTASIA_CLIENTE == dados["NOME_FANTASIA_FORNECEDOR"].ToString()

                                  select linha).ToList();

                    if (query.Any() || query2.Any())
                    {
                        var query3 = query.Any() ? query : query2;

                        foreach (var item in query3)
                        {
                            item.NOME_CLIENTE = dados["NOME_FORNECEDOR"].ToString();
                            item.NOMEFANTASIA_CLIENTE = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                            item.CNPJ_CLIENTE = dados["CNPJ_CLIENTE"].ToString();
                            item.IE_CLIENTE = dados["IE_FORNECEDOR"].ToString();
                            item.IE_SUFRAMA = dados["IE_SUFRAMA"].ToString();

                            item.ENDERECO_FATURA = dados["ENDERECO_FORNECEDOR"].ToString();
                            item.NUMERO_END_FATURA = dados["NUMERO_END_FORNECEDOR"].ToString();
                            item.COMP_END_FATURA = dados["COMPL_END_FORNECEDOR"].ToString();

                            item.CEP_FATURA = dados["CEP_FORNECEDOR"].ToString();
                            item.BAIRRO_FATURA = dados["BAIRRO_FORNECEDOR"].ToString();
                            item.CIDADE_FATURA = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                            item.ESTADO_FATURA = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);
                            item.TELEFONE_FATURA = dados["TELEFONE1_FORNECEDOR"].ToString();

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_CLIENTE>().GetModifiedMembers(item),
                                "TB_CLIENTE", Convert.ToDecimal(dados["ID_USUARIO"]));
                        }
                    }
                    else
                    {
                        Table<TB_CLIENTE> Entidade1 = ctx.GetTable<TB_CLIENTE>();

                        TB_CLIENTE novo1 = new TB_CLIENTE();

                        novo1.NOME_CLIENTE = dados["NOME_FORNECEDOR"].ToString();
                        novo1.NOMEFANTASIA_CLIENTE = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                        novo1.CNPJ_CLIENTE = dados["CNPJ_FORNECEDOR"].ToString();
                        novo1.IE_CLIENTE = dados["IE_FORNECEDOR"].ToString();
                        novo1.IE_SUFRAMA = string.Empty;

                        novo1.ENDERECO_FATURA = dados["ENDERECO_FORNECEDOR"].ToString();
                        novo1.NUMERO_END_FATURA = dados["NUMERO_END_FORNECEDOR"].ToString();
                        novo1.COMP_END_FATURA = dados["COMPL_END_FORNECEDOR"].ToString();

                        novo1.CEP_FATURA = dados["CEP_FORNECEDOR"].ToString();
                        novo1.BAIRRO_FATURA = dados["BAIRRO_FORNECEDOR"].ToString();
                        novo1.CIDADE_FATURA = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                        novo1.ESTADO_FATURA = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);
                        novo1.TELEFONE_FATURA = dados["TELEFONE1_FORNECEDOR"].ToString();

                        novo1.ENDERECO_ENTREGA = string.Empty;
                        novo1.NUMERO_END_ENTREGA = string.Empty;
                        novo1.COMP_END_ENTREGA = string.Empty;

                        novo1.CEP_ENTREGA = string.Empty;
                        novo1.BAIRRO_ENTREGA = string.Empty;
                        novo1.CIDADE_ENTREGA = 0;
                        novo1.ESTADO_ENTREGA = 0;
                        novo1.TELEFONE_ENTREGA = string.Empty;

                        novo1.ENDERECO_COBRANCA = string.Empty;
                        novo1.CEP_COBRANCA = string.Empty;
                        novo1.BAIRRO_COBRANCA = string.Empty;
                        novo1.CIDADE_COBRANCA = 0;
                        novo1.ESTADO_COBRANCA = 0;
                        novo1.TELEFONE_COBRANCA = string.Empty;

                        novo1.CODIGO_CP_CLIENTE = Convert.ToDecimal(dados["CODIGO_CP_FORNECEDOR"]);
                        novo1.ID_LIMITE = 1;

                        novo1.CODIGO_VENDEDOR_CLIENTE = 1;
                        novo1.OBS_CLIENTE = "";
                        novo1.PESSOA = 0;

                        novo1.EMAIL_CLIENTE = dados["EMAIL_FORNECEDOR"].ToString();
                        novo1.ENVIO_NFE_CLIENTE = 2;

                        novo1.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);
                        novo1.CLIENTE_BLOQUEADO = 0;

                        novo1.FORNECEDOR = 1;

                        novo1.DATA_ULTIMA_FATURA = new DateTime(1901, 01, 01);
                        novo1.VALOR_ULTIMA_FATURA = 0;
                        novo1.DATA_CADASTRO = DateTime.Now;

                        Entidade1.InsertOnSubmit(novo1);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                    }
                }

                ctx.SubmitChanges();
            }
        }

        public void Atualiza_Fornecedor_e_Cliente(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from item in ctx.TB_FORNECEDORs
                             where item.CODIGO_FORNECEDOR == Convert.ToDecimal(dados["CODIGO_FORNECEDOR"])
                             select item).ToList();

                foreach (var novo in query)
                {
                    novo.NOME_FORNECEDOR = dados["NOME_FORNECEDOR"].ToString();
                    novo.NOME_FANTASIA_FORNECEDOR = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                    novo.CNPJ_FORNECEDOR = dados["CNPJ_FORNECEDOR"].ToString();
                    novo.IE_FORNECEDOR = dados["IE_FORNECEDOR"].ToString();

                    novo.ENDERECO_FORNECEDOR = dados["ENDERECO_FORNECEDOR"].ToString();
                    novo.NUMERO_END_FORNECEDOR = dados["NUMERO_END_FORNECEDOR"].ToString();
                    novo.COMPL_END_FORNECEDOR = dados["COMPL_END_FORNECEDOR"].ToString();
                    novo.CEP_FORNECEDOR = dados["CEP_FORNECEDOR"].ToString();
                    novo.BAIRRO_FORNECEDOR = dados["BAIRRO_FORNECEDOR"].ToString();

                    novo.ID_MUNICIPIO_FORNECEDOR = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                    novo.ID_UF_FORNECEDOR = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);

                    novo.TELEFONE1_FORNECEDOR = dados["TELEFONE1_FORNECEDOR"].ToString();
                    novo.TELEFONE2_FORNECEDOR = dados["TELEFONE2_FORNECEDOR"].ToString();

                    novo.FAX_FORNECEDOR = dados["FAX_FORNECEDOR"].ToString();
                    novo.OBS_FORNECEDOR = dados["OBS_FORNECEDOR"].ToString();

                    novo.EMAIL_FORNECEDOR = dados["EMAIL_FORNECEDOR"].ToString();

                    novo.CONTATO_FORNECEDOR = dados["CONTATO_FORNECEDOR"].ToString();

                    novo.CODIGO_CP_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_CP_FORNECEDOR"]);

                    novo.CLIENTE = Convert.ToDecimal(dados["CLIENTE"]);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_FORNECEDORs.GetModifiedMembers(novo),
                        ctx.TB_FORNECEDORs.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));

                    if (novo.CLIENTE == 1)
                    {
                        var query1 = (from linha in ctx.GetTable<TB_CLIENTE>()
                                      orderby linha.CNPJ_CLIENTE

                                      where linha.CNPJ_CLIENTE == dados["CNPJ_FORNECEDOR"].ToString()

                                      select linha).ToList();

                        var query2 = (from linha in ctx.GetTable<TB_CLIENTE>()
                                      orderby linha.NOMEFANTASIA_CLIENTE

                                      where linha.NOMEFANTASIA_CLIENTE == dados["NOME_FANTASIA_FORNECEDOR"].ToString()

                                      select linha).ToList();

                        if (query1.Any() || query2.Any())
                        {
                            var query3 = query1.Any() ? query1 : query2;

                            foreach (var item in query3)
                            {
                                item.NOME_CLIENTE = dados["NOME_FORNECEDOR"].ToString();
                                item.NOMEFANTASIA_CLIENTE = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                                item.CNPJ_CLIENTE = dados["CNPJ_FORNECEDOR"].ToString();
                                item.IE_CLIENTE = dados["IE_FORNECEDOR"].ToString();

                                item.ENDERECO_FATURA = dados["ENDERECO_FORNECEDOR"].ToString();
                                item.NUMERO_END_FATURA = dados["NUMERO_END_FORNECEDOR"].ToString();
                                item.COMP_END_FATURA = dados["COMPL_END_FORNECEDOR"].ToString();

                                item.CEP_FATURA = dados["CEP_FORNECEDOR"].ToString();
                                item.BAIRRO_FATURA = dados["BAIRRO_FORNECEDOR"].ToString();
                                item.CIDADE_FATURA = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                                item.ESTADO_FATURA = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);
                                item.TELEFONE_FATURA = dados["TELEFONE1_FORNECEDOR"].ToString();

                                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.GetTable<TB_CLIENTE>().GetModifiedMembers(item),
                                    "TB_CLIENTE", Convert.ToDecimal(dados["ID_USUARIO"]));
                            }
                        }
                        else
                        {
                            Table<TB_CLIENTE> Entidade1 = ctx.GetTable<TB_CLIENTE>();

                            TB_CLIENTE novo1 = new TB_CLIENTE();

                            novo1.NOME_CLIENTE = dados["NOME_FORNECEDOR"].ToString();
                            novo1.NOMEFANTASIA_CLIENTE = dados["NOME_FANTASIA_FORNECEDOR"].ToString();
                            novo1.CNPJ_CLIENTE = dados["CNPJ_FORNECEDOR"].ToString();
                            novo1.IE_CLIENTE = dados["IE_FORNECEDOR"].ToString();
                            novo1.IE_SUFRAMA = string.Empty;

                            novo1.ENDERECO_FATURA = dados["ENDERECO_FORNECEDOR"].ToString();
                            novo1.NUMERO_END_FATURA = dados["NUMERO_END_FORNECEDOR"].ToString();
                            novo1.COMP_END_FATURA = dados["COMPL_END_FORNECEDOR"].ToString();

                            novo1.CEP_FATURA = dados["CEP_FORNECEDOR"].ToString();
                            novo1.BAIRRO_FATURA = dados["BAIRRO_FORNECEDOR"].ToString();
                            novo1.CIDADE_FATURA = Convert.ToDecimal(dados["ID_MUNICIPIO_FORNECEDOR"]);
                            novo1.ESTADO_FATURA = Convert.ToDecimal(dados["ID_UF_FORNECEDOR"]);
                            novo1.TELEFONE_FATURA = dados["TELEFONE1_FORNECEDOR"].ToString();

                            novo1.ENDERECO_ENTREGA = string.Empty;
                            novo1.NUMERO_END_ENTREGA = string.Empty;
                            novo1.COMP_END_ENTREGA = string.Empty;

                            novo1.CEP_ENTREGA = string.Empty;
                            novo1.BAIRRO_ENTREGA = string.Empty;
                            novo1.CIDADE_ENTREGA = 0;
                            novo1.ESTADO_ENTREGA = 0;
                            novo1.TELEFONE_ENTREGA = string.Empty;

                            novo1.ENDERECO_COBRANCA = string.Empty;
                            novo1.CEP_COBRANCA = string.Empty;
                            novo1.BAIRRO_COBRANCA = string.Empty;
                            novo1.CIDADE_COBRANCA = 0;
                            novo1.ESTADO_COBRANCA = 0;
                            novo1.TELEFONE_COBRANCA = string.Empty;

                            novo1.CODIGO_CP_CLIENTE = Convert.ToDecimal(dados["CODIGO_CP_FORNECEDOR"]);
                            novo1.ID_LIMITE = 1;

                            novo1.CODIGO_VENDEDOR_CLIENTE = 1;
                            novo1.OBS_CLIENTE = "";
                            novo1.PESSOA = 0;

                            novo1.EMAIL_CLIENTE = dados["EMAIL_FORNECEDOR"].ToString();
                            novo1.ENVIO_NFE_CLIENTE = 2;

                            novo1.CODIGO_EMITENTE = Convert.ToDecimal(dados["ID_EMPRESA"]);
                            novo1.CLIENTE_BLOQUEADO = 0;

                            novo1.FORNECEDOR = 1;

                            novo1.DATA_ULTIMA_FATURA = new DateTime(1901, 01, 01);
                            novo1.VALOR_ULTIMA_FATURA = 0;
                            novo1.DATA_CADASTRO = DateTime.Now;

                            Entidade1.InsertOnSubmit(novo1);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo1, Entidade1.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                        }
                    }
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