using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BoletoNet;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Net.Mail;
using System.Configuration;
using System.IO;
using System.Text;
using System.Drawing;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Boleto_Itau : IDisposable
    {
        private List<decimal> NUMEROS_FINANCEIRO { get; set; }
        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }
        private TB_EMITENTE emitente { get; set; }
        private decimal ID_EMPRESA { get; set; }
        private decimal ID_USUARIO { get; set; }
        private decimal ID_CONTA_EMAIL { get; set; }
        private decimal NUMERO_BANCO { get; set; }
        private string AGENCIA { get; set; }
        private string CONTA_CORRENTE { get; set; }
        private string CARTEIRA { get; set; }
        private string relatorio_De_Servicos_Do_Cliente { get; set; }

        public Doran_Boleto_Itau(List<decimal> _NUMEROS_FINANCEIRO, decimal _ID_EMPRESA, decimal _ID_USUARIO, decimal _ID_CONTA_EMAIL,
            decimal _NUMERO_BANCO, string _AGENCIA, string _CONTA_CORRENTE, string _CARTEIRA)
        {
            NUMEROS_FINANCEIRO = _NUMEROS_FINANCEIRO;
            ID_EMPRESA = _ID_EMPRESA;
            ID_USUARIO = _ID_USUARIO;
            ID_CONTA_EMAIL = _ID_CONTA_EMAIL;

            NUMERO_BANCO = _NUMERO_BANCO;
            AGENCIA = _AGENCIA;
            CONTA_CORRENTE = _CONTA_CORRENTE;
            CARTEIRA = "109";// _CARTEIRA; // 175

            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");

            preencheEmitente();
        }

        public void Gera_Boleto_PDF(DateTime dt1, DateTime dt2)
        {
            dt2 = dt2.AddDays(1);

            List<BOLETOS_CLIENTE> IDS_CLIENTE = new List<BOLETOS_CLIENTE>();

            var query = (from linha in ctx.TB_FINANCEIROs
                         where NUMEROS_FINANCEIRO.Contains(linha.NUMERO_FINANCEIRO)
                         select linha).ToList();

            foreach (var item in query.OrderBy(_ => _.CODIGO_CLIENTE))
            {
                if (!IDS_CLIENTE.Where(_ => _.ID_CLIENTE == item.CODIGO_CLIENTE).Any())
                {
                    if (item.TB_CLIENTE == null)
                        throw new Exception("T&iacute;tulo n&ordm; [" + item.NUMERO_FINANCEIRO.ToString() +
                            "] est&aacute; sem cliente definido");

                    IDS_CLIENTE.Add(new BOLETOS_CLIENTE()
                    {
                        ID_CLIENTE = item.CODIGO_CLIENTE.Value,
                        NOME_FANTASIA_CLIENTE = string.IsNullOrEmpty(item.TB_CLIENTE.NOMEFANTASIA_CLIENTE) ? "" : item.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Trim(),
                        NOTAS_FISCAIS = new List<string>(),
                        LINKS_BOLETO = new List<string>(),
                        VENCIMENTOS = new List<DateTime>()
                    });
                }

                string vencimento = ApoioXML.TrataData2(item.DATA_VENCIMENTO);
                string valorBoleto = item.VALOR_TOTAL.Value.ToString();
                string numeroDocumento = item.NUMERO_NF_SAIDA.ToString(); //"B20005446";

                item.NOSSO_NUMERO_BANCARIO = buscaNossoNumeroBancario();

                //cedente
                String cedente_codigo = CONTA_CORRENTE.Replace("-", "");
                String cedente_nossoNumeroBoleto = item.NOSSO_NUMERO_BANCARIO.Trim();
                String cedente_cpfCnpj = emitente.CNPJ_EMITENTE.Trim();
                String cedente_nome = emitente.NOME_EMITENTE.Trim();
                String cedente_agencia = AGENCIA;
                String cedente_conta = CONTA_CORRENTE.LastIndexOf("-") > -1 ? CONTA_CORRENTE.Substring(0, CONTA_CORRENTE.LastIndexOf("-")) :
                    CONTA_CORRENTE;
                String cedente_digitoConta = CONTA_CORRENTE.LastIndexOf("-") > -1 ? CONTA_CORRENTE.Substring(CONTA_CORRENTE.LastIndexOf("-") + 1) :
                    "";

                if (item.TB_CLIENTE == null)
                    throw new Exception("O t&iacute;tulo de numero [" + item.NUMERO_FINANCEIRO.ToString() + "] est&aacute; sem cliente definido");

                //sacado
                String sacado_cpfCnpj = item.TB_CLIENTE.CNPJ_CLIENTE.Trim();
                String sacado_nome = item.TB_CLIENTE.NOME_CLIENTE.Trim();
                String sacado_endereco = item.TB_CLIENTE.ENDERECO_FATURA.Trim();
                String sacado_bairro = item.TB_CLIENTE.BAIRRO_FATURA.Trim();
                String sacado_cidade = item.TB_CLIENTE.TB_MUNICIPIO.NOME_MUNICIPIO.Trim();
                String sacado_cep = item.TB_CLIENTE.CEP_FATURA.Trim();
                String sacado_uf = item.TB_CLIENTE.TB_MUNICIPIO.TB_UF.SIGLA_UF;

                Cedente cedente = new Cedente(cedente_cpfCnpj,
                cedente_nome,
                cedente_agencia,
                cedente_conta,
                cedente_digitoConta);

                cedente.Codigo = Convert.ToInt32(cedente_codigo);
                //cedente.Nome = emitente.NOME_EMITENTE.Trim();
                //cedente.CPFCNPJ = emitente.CNPJ_EMITENTE.Trim();

                //cedente.Endereco = new Endereco();

                //cedente.Endereco.End = string.Concat(emitente.ENDERECO_EMITENTE.Trim(), " ",
                //     emitente.NUMERO_END_EMITENTE.Trim(), " ",
                //     string.IsNullOrEmpty(emitente.COMPLEMENTO_END_EMITENTE) ? "" : emitente.COMPLEMENTO_END_EMITENTE.Trim()).Trim();

                //cedente.Endereco.Bairro = emitente.BAIRRO_EMITENTE.Trim();
                //cedente.Endereco.CEP = emitente.CEP_EMITENTE.Trim();
                //cedente.Endereco.Cidade = emitente.TB_MUNICIPIO.NOME_MUNICIPIO.Trim();
                //cedente.Endereco.UF = emitente.TB_MUNICIPIO.TB_UF.SIGLA_UF;

                Boleto boleto = new Boleto(item.DATA_VENCIMENTO.Value,
                    item.VALOR_TOTAL.Value,
                    CARTEIRA,
                    cedente_nossoNumeroBoleto,
                    cedente);

                boleto.NumeroDocumento = numeroDocumento;

                Sacado sacado = new Sacado(sacado_cpfCnpj, sacado_nome);
                boleto.Sacado = sacado;
                boleto.Sacado.Endereco.End = sacado_endereco;
                boleto.Sacado.Endereco.Bairro = sacado_bairro;
                boleto.Sacado.Endereco.Cidade = sacado_cidade;
                boleto.Sacado.Endereco.CEP = sacado_cep;
                boleto.Sacado.Endereco.UF = sacado_uf;

                Instrucao_Itau instrucao = new Instrucao_Itau();
                instrucao.Descricao = "APOS O VENCIMENTO COBRAR MULTA DE R$ 2,00";

                boleto.Instrucoes.Add(instrucao);
                EspecieDocumento_Itau especie = new EspecieDocumento_Itau("1");
                boleto.EspecieDocumento = especie;
                boleto.DataProcessamento = DateTime.Today;
                boleto.DataDocumento = DateTime.Today;
                boleto.ValorBoleto = item.VALOR_TOTAL.Value;
                boleto.NumeroDocumento = item.NUMERO_NF_SAIDA.ToString().PadLeft(10, '0');

                BoletoBancario boleto_bancario = new BoletoBancario();
                boleto_bancario.CodigoBanco = (short)NUMERO_BANCO;
                boleto_bancario.Boleto = boleto;
                boleto_bancario.MostrarCodigoCarteira = true;

                // AG. 0189
                // CC 47562-7
                // WILLIAM DA SILVA CARDOZO
                // CPF 286.248.538-18

                boleto_bancario.Boleto.Valida();
                
                boleto_bancario.MostrarComprovanteEntrega = true;
                
                Image codigoBarras = boleto_bancario.GeraImagemCodigoBarras(boleto);

                codigoBarras.Save(Path.Combine(ConfigurationManager.AppSettings["PASTA_BOLETO_ITAU"],
                    "codigoBarras" + item.NUMERO_FINANCEIRO.ToString() + ".jpg"), System.Drawing.Imaging.ImageFormat.Jpeg);

                string url = string.Concat(ApoioXML.urlBase(), "/Boletos/Itau/");
                
                string arquivo_Boleto = Path.Combine(ConfigurationManager.AppSettings["PASTA_BOLETO_ITAU"],
                    "boleto_" + item.NUMERO_FINANCEIRO.ToString() + ".htm");

                string htmlBoleto = boleto_bancario.MontaHtml(arquivo_Boleto);
                htmlBoleto = htmlBoleto.Replace(ConfigurationManager.AppSettings["PASTA_BOLETO_ITAU"], "");

                string htmlCodigoBarras = htmlBoleto.Substring(htmlBoleto.IndexOf(@"<td class=""EcdBar Al pL10"">"));
                htmlCodigoBarras = htmlCodigoBarras.Substring(0, htmlCodigoBarras.IndexOf("</td>"));
                htmlCodigoBarras = htmlCodigoBarras.Substring(htmlCodigoBarras.IndexOf("<img src=") + 1);
                htmlCodigoBarras = htmlCodigoBarras.Substring(0, htmlCodigoBarras.LastIndexOf(" ") - 1);

                htmlBoleto = htmlBoleto.Replace(htmlCodigoBarras,
                    string.Concat(@"img src=""", Path.Combine(ApoioXML.urlBase() + "/Boletos/Itau/",
                    "codigoBarras" + item.NUMERO_FINANCEIRO.ToString() + ".jpg"), @""" alt='Código de Barras'"));

                using (TextWriter tw = new StreamWriter(arquivo_Boleto, false, Encoding.UTF8))
                {
                    tw.Write(htmlBoleto);
                    tw.Close();
                }

                IDS_CLIENTE[IDS_CLIENTE.Count - 1].NOTAS_FISCAIS.Add(item.NUMERO_NF_SAIDA.Value.ToString());
                IDS_CLIENTE[IDS_CLIENTE.Count - 1].LINKS_BOLETO.Add(url + "boleto_" + item.NUMERO_FINANCEIRO.ToString() + ".htm");
                IDS_CLIENTE[IDS_CLIENTE.Count - 1].VENCIMENTOS.Add(item.DATA_VENCIMENTO.Value);
            }

            ctx.SubmitChanges();

            for (int i = 0; i < IDS_CLIENTE.Count(); i++)
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                {
                    string FROM_ADDRESS = (from linha in ctx.TB_EMAIL_CONTAs
                                           where linha.ID_CONTA_EMAIL == ID_CONTA_EMAIL
                                           select linha.CONTA_EMAIL).First().Trim();

                    var NOME_CONTATO = from linha in ctx.TB_CLIENTE_CONTATOs
                                       where linha.ID_CLIENTE == IDS_CLIENTE[i].ID_CLIENTE
                                       select linha.NOME_CONTATO_CLIENTE;

                    var EMAIL_CLIENTE = from linha in ctx.TB_CLIENTE_CONTATOs
                                        where linha.ID_CLIENTE == IDS_CLIENTE[i].ID_CLIENTE
                                        select linha.EMAIL_CONTATO_CLIENTE;

                    var ASSINATURA = (from linha in ctx.TB_EMAIL_CONTAs
                                      where linha.ID_CONTA_EMAIL == ID_CONTA_EMAIL
                                      select linha.ASSINATURA).First().Trim();

                    if (!NOME_CONTATO.Any())
                        throw new Exception("N&atilde;o h&aacute; contato cadastrado para este cliente");

                    Dictionary<string, object> dados = new Dictionary<string, object>();

                    dados.Add("ID_MESSAGE", 0);
                    dados.Add("ID_CONTA_EMAIL", ID_CONTA_EMAIL);
                    dados.Add("FROM_ADDRESS", FROM_ADDRESS);
                    dados.Add("PRIORITY", 1);
                    dados.Add("SUBJECT", string.Concat("Boleto de cobrança - ", emitente.NOME_FANTASIA_EMITENTE.Trim()));

                    string mensagem = string.Concat(DateTime.Now.Hour >= 0 && DateTime.Now.Hour < 12 ?
                        "<span style='font-family: tahoma; font-size: 9pt;'>Bom dia " :
                        DateTime.Now.Hour >= 12 && DateTime.Now.Hour < 19 ?
                        "<span style='font-family: tahoma; font-size: 9pt;'>Boa tarde " :
                        "<span style='font-family: tahoma; font-size: 9pt;'>Boa noite ", NOME_CONTATO.First().Trim(), "<br /><br />",
                        "Segue abaixo o(s) link(s) para voc&ecirc; acessar os boletos de cobrança referente a(s) nota(s) fiscal(is) ",
                        "<b>[", string.Join(", ", IDS_CLIENTE[i].NOTAS_FISCAIS.ToArray()), "]</b><br /><br />");

                    for (int n = 0; n < IDS_CLIENTE[i].LINKS_BOLETO.Count; n++)
                    {
                        mensagem += string.Concat("<a href='", IDS_CLIENTE[i].LINKS_BOLETO[n], "' target='_blank'>Boleto com vencimento para ",
                            ApoioXML.TrataData2(IDS_CLIENTE[i].VENCIMENTOS[n]), "</a><br />");
                    }

                    using (Doran_Relatorio_Entregas_do_Cliente ec = new classes.Doran_Relatorio_Entregas_do_Cliente(IDS_CLIENTE[i].NOME_FANTASIA_CLIENTE, dt1, dt2, ID_EMPRESA))
                    {
                        relatorio_De_Servicos_Do_Cliente = ec.MontaRelatorio();
                    }

                    mensagem += "<br /><br />Segue tamb&eacute;m, o relat&oacute;rio dos seus servi&ccedil;os referente a esta cobran&ccedil;a<br /><br />";

                    mensagem += "<a href='" + relatorio_De_Servicos_Do_Cliente + "'>Relat&oacute;rio dos servi&ccedil;os</a><br />";

                    mensagem += "<br />Obrigado, <br /></span>" + ASSINATURA;

                    dados.Add("BODY", mensagem);
                    dados.Add("RAW_BODY", mensagem);
                    dados.Add("NUMERO_CRM", 0);

                    List<string> TOs = new List<string>();
                    TOs.Add(EMAIL_CLIENTE.First().Trim());

                    List<string> CCs = new List<string>();
                    List<string> BCCs = new List<string>();
                    List<string> Attachments = new List<string>();

                    mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);
                }
            }
        }

        private void preencheEmitente()
        {
            emitente = (from linha in ctx.TB_EMITENTEs
                        where linha.CODIGO_EMITENTE == ID_EMPRESA
                        select linha).ToList().First();
        }

        public string buscaNossoNumeroBancario()
        {
            var query = (from linha in ctx.TB_FINANCEIROs
                         select linha.NOSSO_NUMERO_BANCARIO).Max();

            decimal ultimoNumero = 0;

            if (query == null)
                ultimoNumero = 1;
            else
                if (decimal.TryParse(query, out ultimoNumero))
                    ultimoNumero++;
                else
                    ultimoNumero = query.Any() ?
                        !string.IsNullOrEmpty(query.First().ToString()) ?
                        Convert.ToDecimal(query.First().ToString()) + 1 : 1 : 1;

            return ultimoNumero.ToString().PadLeft(8, '0');
        }

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
        }

        #endregion
    }

    class BOLETOS_CLIENTE
    {
        public BOLETOS_CLIENTE() { }

        public decimal ID_CLIENTE { get; set; }
        public string NOME_FANTASIA_CLIENTE { get; set; }
        public List<DateTime> VENCIMENTOS { get; set; }
        public List<string> NOTAS_FISCAIS { get; set; }
        public List<string> LINKS_BOLETO { get; set; }
    }
}