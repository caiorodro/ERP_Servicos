using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.Text;
using Doran_Base;
using System.Configuration;
using System.IO;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_RPS_Nota_Servico : IDisposable
    {
        private enum ISSRetido
        {
            ISS_RETIDO_PELO_TOMADOR = 1,
            SEM_ISS_RETIDO = 2,
            ISS_RETIDO_PELO_INTERMEDIARIO = 3
        };

        private decimal ID_USUARIO { get; set; }
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }
        private StringBuilder conteudo { get; set; }
        private decimal ID_EMPRESA { get; set; }
        private TB_EMITENTE emitente { get; set; }
        private int MES_PERIODO { get; set; }
        private int ANO_PERIODO { get; set; }

        private int NUMERO_RPS { get; set; }
        private decimal TOTAL_SERVICOS { get; set; }
        private decimal TOTAL_DEDUCOES { get; set; }

        public Doran_RPS_Nota_Servico(decimal _ID_EMPRESA, decimal _ID_USUARIO)
        {
            ID_USUARIO = _ID_USUARIO;
            ID_EMPRESA = _ID_EMPRESA;

            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

            conteudo = new StringBuilder();

            preenche_Dados_Emitente();
        }

        public string Gera_Arquivo_RPS_Lote()
        {
            geraCabecalho();
            geraDetalhe();
            geraRodape();

            string ARQUIVO = string.Concat("RPS", DateTime.Today.Year.ToString().Substring(2, 2), DateTime.Today.Month.ToString().PadLeft(2, '0'),
                DateTime.Today.Day.ToString().PadLeft(2, '0'), ".RPS");

            using (TextWriter tw = new StreamWriter(Path.Combine(ConfigurationManager.AppSettings["PASTA_RPS"], ARQUIVO)))
            {
                tw.Write(conteudo.ToString());
                tw.Close();
            }

            string absUrl = HttpContext.Current.Request.Url.AbsoluteUri;
            string host = HttpContext.Current.Request.Url.Host;
            string porta = HttpContext.Current.Request.Url.Port.ToString();
            string protocolo = absUrl.Substring(0, absUrl.IndexOf("://"));

            return string.Concat(protocolo, "://", host, ":", porta, "/RPS/", ARQUIVO);
        }

        private void geraCabecalho()
        {
            string versao_layout = "001";

            var query = (from linha in ctx.TB_NOTA_SAIDAs
                        where linha.USUARIO_REMESSA_RPS == ID_USUARIO
                       && linha.MARCA_REMSSA_RPS == 1
                        select linha.DATA_EMISSAO_NF).ToList();

            //DateTime periodo_inicial = query.Min().Value;
            //DateTime periodo_final = query.Max().Value;

            DateTime periodo_inicial = DateTime.Today;
            DateTime periodo_final = DateTime.Today;

            conteudo.Append("1");
            conteudo.Append(versao_layout);
            conteudo.Append("46054707"); // 46054707
            conteudo.Append(ApoioXML.TrataDataRPS(periodo_inicial));
            conteudo.Append(ApoioXML.TrataDataRPS(periodo_final));
            conteudo.Append(Environment.NewLine);
        }

        private void geraDetalhe()
        {
            NUMERO_RPS = 1;

            string SERIE_RPS = ApoioXML.Space(5);

            string codigoServicoPrestado = "02461";
            ISSRetido issRetido = ISSRetido.SEM_ISS_RETIDO;

            var query = from linha in ctx.TB_NOTA_SAIDAs
                        where linha.USUARIO_REMESSA_RPS == ID_USUARIO
                        && linha.MARCA_REMSSA_RPS == 1
                        select linha;

            foreach (var item in query)
            {
                //if (item.DATA_EMISSAO_NF.Value.Month != MES_PERIODO || item.DATA_EMISSAO_NF.Value.Year != ANO_PERIODO)
                //    throw new Exception("A nota fiscal [" + item.NUMERO_NF.ToString() + "] est&aacute; fora do per&iacute;odo selecionado.");

                conteudo.Append("2");
                conteudo.Append("RPS  ");
                conteudo.Append(SERIE_RPS);
                conteudo.Append(NUMERO_RPS.ToString().PadLeft(12, '0'));
                conteudo.Append(ApoioXML.TrataDataRPS(DateTime.Today));
                conteudo.Append("T");

                conteudo.Append(ApoioXML.TrataValorRPS(item.TOTAL_SERVICOS_NF, 15));
                conteudo.Append(ApoioXML.TrataValorRPS(item.TOTAL_DEDUCOES, 15));
                conteudo.Append(codigoServicoPrestado);

                decimal ALIQ_ISS = (from linha in ctx.TB_ITEM_NOTA_SAIDAs
                                    where linha.NUMERO_ITEM_NF == item.NUMERO_SEQ
                                    select linha.ALIQ_ISS_ITEM_NF).First().Value;

                conteudo.Append(ApoioXML.TrataValorRPS(ALIQ_ISS, 4));
                conteudo.Append(Convert.ToInt32(issRetido).ToString());

                conteudo.Append(item.TB_CLIENTE.PESSOA == 0 ? "2" : "1");

                conteudo.Append(ApoioXML.TrataSinais4(item.CNPJ_CLIENTE_NF).PadRight(14, ' '));

                string IE_CLIENTE = item.IE_CLIENTE_NF.Trim().ToUpper().StartsWith("ISENT") ?
                    ApoioXML.Space(12) : ApoioXML.TrataSinais4(item.IE_CLIENTE_NF).PadRight(12, ' ');

                conteudo.Append(ApoioXML.Space(8));
                conteudo.Append(IE_CLIENTE);

                conteudo.Append(ApoioXML.TrataSinais(item.NOME_CLIENTE_NF).PadRight(75, ' '));

                string tipoLogradouro = item.ENDERECO_FATURA_NF.Substring(0,
                    item.ENDERECO_FATURA_NF.IndexOf(" ") > -1 ?
                    item.ENDERECO_FATURA_NF.IndexOf(" ") :
                    3);

                tipoLogradouro = tipoLogradouro.Replace(".", "");
                tipoLogradouro = tipoLogradouro.Length > 3 ? tipoLogradouro.Substring(0, 3) : tipoLogradouro;

                conteudo.Append(tipoLogradouro.PadRight(3, ' '));

                string Logradouro = item.ENDERECO_FATURA_NF.IndexOf(" ") > -1 ?
                    item.ENDERECO_FATURA_NF.Substring(item.ENDERECO_FATURA_NF.IndexOf(" ") + 1).Trim() :
                    item.ENDERECO_FATURA_NF.Trim();

                conteudo.Append(ApoioXML.TrataSinais(Logradouro).Length > 50 ?
                    ApoioXML.TrataSinais(Logradouro).Substring(0, 50) :
                    ApoioXML.TrataSinais(Logradouro).PadRight(50, ' '));

                conteudo.Append(item.NUMERO_END_FATURA_NF.Trim().Length > 10 ?
                    item.NUMERO_END_FATURA_NF.Substring(0, 10) :
                    item.NUMERO_END_FATURA_NF.Trim().PadRight(10, ' '));

                conteudo.Append(ApoioXML.TrataSinais(item.COMP_END_FATURA_NF).Length > 30 ?
                    ApoioXML.TrataSinais(item.COMP_END_FATURA_NF).Substring(0, 30) :
                    ApoioXML.TrataSinais(item.COMP_END_FATURA_NF).PadRight(30, ' '));

                conteudo.Append(ApoioXML.TrataSinais(item.BAIRRO_FATURA_NF).Length > 30 ?
                    ApoioXML.TrataSinais(item.BAIRRO_FATURA_NF).Substring(0, 30) :
                    ApoioXML.TrataSinais(item.BAIRRO_FATURA_NF).PadRight(30, ' '));

                conteudo.Append(ApoioXML.TrataSinais(item.MUNICIPIO_NF).Length > 50 ?
                    ApoioXML.TrataSinais(item.MUNICIPIO_NF).Substring(0, 50) :
                    ApoioXML.TrataSinais(item.MUNICIPIO_NF).PadRight(50, ' '));

                conteudo.Append(item.UF_NF.Trim());

                conteudo.Append(ApoioXML.TrataSinais(item.CEP_FATURA_NF).Length > 8 ?
                    ApoioXML.TrataSinais(item.CEP_FATURA_NF).Substring(0, 8) :
                    ApoioXML.TrataSinais(item.CEP_FATURA_NF).PadRight(8, ' '));

                conteudo.Append(item.TB_CLIENTE.EMAIL_CLIENTE.Trim().PadRight(75, ' '));

                StringBuilder servicos = new StringBuilder();

                var query1 = from linha in ctx.TB_ITEM_NOTA_SAIDAs
                             where linha.NUMERO_ITEM_NF == item.NUMERO_SEQ
                             select linha;

                foreach (var item1 in query1)
                {
                    if (servicos.ToString().Length == 0)
                    {
                        servicos.Append(ApoioXML.TrataSinais(item1.DESCRICAO_PRODUTO_ITEM_NF.Trim()));
                    }
                    else
                    {
                        servicos.Append("|" + ApoioXML.TrataSinais(item1.DESCRICAO_PRODUTO_ITEM_NF.Trim()));
                    }
                }

                conteudo.Append(servicos.ToString());
                conteudo.Append(Environment.NewLine);

                TOTAL_SERVICOS += item.TOTAL_SERVICOS_NF.Value;
                TOTAL_DEDUCOES += item.TOTAL_DEDUCOES.HasValue ? item.TOTAL_DEDUCOES.Value : 0;
                NUMERO_RPS++;

                item.MARCA_REMSSA_RPS = 2;
                item.USUARIO_REMESSA_RPS = 0;

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_NOTA_SAIDAs.GetModifiedMembers(item),
                    ctx.TB_NOTA_SAIDAs.ToString(), ID_USUARIO);
            }

            ctx.SubmitChanges();
        }

        private void geraRodape()
        {
            conteudo.Append("9");
            conteudo.Append((NUMERO_RPS - 1).ToString().PadLeft(7, '0'));
            conteudo.Append(ApoioXML.TrataValorRPS(TOTAL_SERVICOS, 15));
            conteudo.Append(ApoioXML.TrataValorRPS(TOTAL_DEDUCOES, 15));
            conteudo.Append(Environment.NewLine);
        }

        private void preenche_Dados_Emitente()
        {
            if (!(from linha in ctx.TB_EMITENTEs
                  where linha.CODIGO_EMITENTE == ID_EMPRESA
                  select linha).Any())
            {
                throw new Exception("Emitente n&atilde;o encontrado");
            }

            emitente = (from linha in ctx.TB_EMITENTEs
                        where linha.CODIGO_EMITENTE == ID_EMPRESA
                        select linha).First();

            var EMISSAO = (from linha in ctx.TB_NOTA_SAIDAs
                           where linha.USUARIO_REMESSA_RPS == ID_USUARIO
                           && linha.MARCA_REMSSA_RPS == 1
                           select linha.DATA_EMISSAO_NF).First();

            MES_PERIODO = EMISSAO.Value.Month;
            ANO_PERIODO = EMISSAO.Value.Year;
        }

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
            ctx.Dispose();
        }

        #endregion
    }
}