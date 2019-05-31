using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Nota_Saida : IDisposable
    {
        public decimal ID_USUARIO { get; set; }
        public decimal ID_EMPRESA { get; set; }

        public Doran_Nota_Saida(decimal _ID_EMPRESA, decimal _ID_USUARIO)
        {
            ID_EMPRESA = _ID_EMPRESA;
            ID_USUARIO = _ID_USUARIO;
        }

        public decimal Nova_Nota_Saida(Dictionary<string, object> dados)
        {
            dados = Busca_Dados_Redundantes(dados);

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                System.Data.Linq.Table<TB_NOTA_SAIDA> Entidade = ctx.GetTable<TB_NOTA_SAIDA>();

                TB_NOTA_SAIDA novo = new TB_NOTA_SAIDA();

                novo.NUMERO_NF = 0;
                novo.SERIE_NF = dados["SERIE"].ToString();
                novo.IE_SUBST_TRIB_NF = dados["IE_SUBST_TRIB_NF"].ToString();
                novo.CODIGO_CLIENTE_NF = Convert.ToDecimal(dados["CODIGO_CLIENTE_NF"].ToString());
                novo.NOME_CLIENTE_NF = dados["NOME_CLIENTE_NF"].ToString().Trim();
                novo.NOME_FANTASIA_CLIENTE_NF = dados["NOME_FANTASIA_CLIENTE_NF"].ToString().Trim();
                novo.CNPJ_CLIENTE_NF = dados["CNPJ_CLIENTE_NF"].ToString().Trim();
                novo.IE_CLIENTE_NF = dados["IE_CLIENTE_NF"].ToString().Trim();
                novo.ENDERECO_FATURA_NF = dados["ENDERECO_FATURA_NF"].ToString().Trim();
                novo.NUMERO_END_FATURA_NF = dados["NUMERO_END_FATURA_NF"].ToString().Trim();
                novo.COMP_END_FATURA_NF = dados["COMP_END_FATURA_NF"].ToString().Trim();
                novo.CEP_FATURA_NF = dados["CEP_FATURA_NF"].ToString().Trim();
                novo.BAIRRO_FATURA_NF = dados["BAIRRO_FATURA_NF"].ToString().Trim();
                novo.ID_MUNICIPIO_NF = Convert.ToDecimal(dados["ID_MUNICIPIO_NF"]);
                novo.MUNICIPIO_NF = dados["MUNICIPIO_NF"].ToString().Trim();
                novo.ID_UF_NF = Convert.ToDecimal(dados["ID_UF_NF"]);
                novo.UF_NF = dados["SIGLA_UF"].ToString();
                novo.TELEFONE_CLIENTE_NF = dados["TELEFONE_CLIENTE_NF"].ToString().Trim();

                novo.DATA_EMISSAO_NF = Convert.ToDateTime(dados["DATA_EMISSAO_NF"]);

                novo.CODIGO_CP_NF = Convert.ToDecimal(dados["CODIGO_CP_NF"]);
                novo.DESCRICAO_CP_NF = dados["DESCRICAO_CP_NF"].ToString().Trim();
                novo.BASE_ISS_NF = 0;
                novo.TOTAL_SERVICOS_NF = 0;
                novo.VALOR_ISS_NF = 0;
                novo.TOTAL_NF = Convert.ToDecimal(dados["TOTAL_NF"]);

                novo.QTDE_NF = string.Empty;
                novo.ESPECIE_NF = string.Empty;
                novo.MARCA_NF = string.Empty;
                novo.NUMERO_QTDE_NF = string.Empty;
                novo.PESO_BRUTO_NF = 0;
                novo.PESO_LIQUIDO_NF = 0;

                novo.OBS_NF = dados["DADOS_ADICIONAIS_NF"].ToString().Trim();
                novo.DADOS_ADICIONAIS_NF = "";
                novo.CODIGO_VENDEDOR_NF = Convert.ToDecimal(dados["CODIGO_VENDEDOR_NF"]);
                novo.NOME_VENDEDOR_NF = dados["NOME_VENDEDOR_NF"].ToString().Trim();
                novo.NUMERO_PEDIDO_NF = dados["NUMERO_PEDIDO_NF"].ToString().Trim();
                novo.CHAVE_ACESSO_NF = dados["CHAVE_ACESSO_NF"].ToString().Trim();
                novo.PROTOCOLO_AUTORIZACAO_NF = dados["PROTOCOLO_AUTORIZACAO_NF"].ToString().Trim();
                novo.DATA_PROTOCOLO_NF = new DateTime(1901, 01, 01);
                novo.EMITIDA_NF = 0;
                novo.CANCELADA_NF = 0;
                novo.STATUS_NF = 1;
                novo.NUMERO_LOTE_NF = 0;
                novo.DANFE_NFE = "";
                novo.EMAIL_ENVIADO_NF = 0;

                novo.CODIGO_EMITENTE_NF = ID_EMPRESA;
                novo.NF_ORIGEM = 0;

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                ctx.SubmitChanges();

                return novo.NUMERO_SEQ;
            }
        }

        private Dictionary<string, object> Busca_Dados_Redundantes(Dictionary<string, object> dados)
        {
            Dictionary<string, object> retorno = dados;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var queryCLIENTE = (from cliente in ctx.TB_CLIENTEs
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
                                    }).ToList();

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

                var queryCP = (from cp in ctx.TB_COND_PAGTOs
                               where cp.CODIGO_CP == Convert.ToDecimal(dados["CODIGO_CP_NF"])
                               select cp).ToList();

                foreach (var item in queryCP)
                {
                    dados.Add("DESCRICAO_CP_NF", item.DESCRICAO_CP);
                }

                var queryVendedor = (from v in ctx.TB_VENDEDOREs
                                     where v.ID_VENDEDOR == Convert.ToDecimal(dados["CODIGO_VENDEDOR_NF"])
                                     select v).ToList();

                foreach (var item in queryVendedor)
                {
                    dados.Add("NOME_VENDEDOR_NF", item.NOME_VENDEDOR);
                }
            }

            return retorno;
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}