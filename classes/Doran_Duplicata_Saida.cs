using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using iTextSharp.text.pdf;
using System.IO;
using iTextSharp.text;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Configuration;
using System.Collections;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Duplicata_Saida : IDisposable
    {
        private List<decimal> NUMERO_SEQ { get; set; }
        public List<decimal> NUMERO_FINANCEIROS { get; set; }
        private StringBuilder conteudo { get; set; }
        private List<string> Duplicatas { get; set; }
        private string Arquivo { get; set; }
        private decimal NUMERO_NF { get; set; }

        public Doran_Duplicata_Saida(List<decimal> pNUMERO_SEQ)
        {
            NUMERO_SEQ = pNUMERO_SEQ;
            conteudo = new StringBuilder();
            Arquivo = "";

            DuplicatasLetras();
        }

        public Doran_Duplicata_Saida()
        {
            conteudo = new StringBuilder();
            Arquivo = "";

            DuplicatasLetras();
        }

        public string MontaDuplicatas()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                using (Th2_Report re = new Th2_Report())
                {
                    re.NumeroDasPaginas = false;
                    re.ExibeCabecalho = false;
                    re.ExibeRodape = false;

                    int i = 0;

                    for (int n = 0; n < NUMERO_SEQ.Count; n++)
                    {
                        var query = (from linha in ctx.TB_FINANCEIROs
                                     orderby linha.NUMERO_SEQ_NF_SAIDA
                                     where linha.NUMERO_SEQ_NF_SAIDA == NUMERO_SEQ[n]
                                     select linha).ToList();

                        int d = 0;

                        foreach (var item in query)
                        {
                            if (i > 0 && (i % 2) == 0)
                            {
                                re.AdicionaNovaPagina();
                            }

                            NUMERO_NF = (decimal)item.NUMERO_NF_SAIDA;

                            NumeroPorExtenso ext = new NumeroPorExtenso((decimal)item.VALOR_TOTAL);

                            string VALOR_EXTENSO = ext.ToString().ToUpper();

                            string ENDERECO_COBRANCA = string.Empty;

                            if (item.TB_CLIENTE != null)
                            {
                                ENDERECO_COBRANCA = item.TB_CLIENTE.ENDERECO_COBRANCA.ToString().Trim().Length > 0 ?
                                    string.Concat(item.TB_CLIENTE.ENDERECO_COBRANCA.ToString().Trim(),
                                                   " - CEP:" + item.TB_CLIENTE.CEP_COBRANCA.ToString().Trim(),
                                                   " - ", item.TB_CLIENTE.BAIRRO_COBRANCA.ToString().Trim(),
                                                   " - ", item.TB_CLIENTE.TB_MUNICIPIO2.NOME_MUNICIPIO.ToString().Trim(),
                                                   " - ", item.TB_CLIENTE.TB_MUNICIPIO2.TB_UF.SIGLA_UF)
                                   :

                                    string.Concat(item.TB_NOTA_SAIDA.ENDERECO_FATURA_NF.ToString().Trim(),
                                                    ", ", item.TB_NOTA_SAIDA.NUMERO_END_FATURA_NF.ToString().Trim(), " ",
                                                    item.TB_NOTA_SAIDA.COMP_END_FATURA_NF.ToString().Trim(),
                                                   " - CEP:" + item.TB_NOTA_SAIDA.CEP_FATURA_NF.ToString().Trim(),
                                                   " - ", item.TB_NOTA_SAIDA.BAIRRO_FATURA_NF.ToString().Trim(),
                                                   " - ", item.TB_NOTA_SAIDA.MUNICIPIO_NF.ToString().Trim(),
                                                   " - ", item.TB_NOTA_SAIDA.UF_NF);
                            }
                            else
                            {
                                ENDERECO_COBRANCA = string.Concat(item.TB_NOTA_SAIDA.ENDERECO_FATURA_NF.ToString().Trim(),
                                        ", ", item.TB_NOTA_SAIDA.NUMERO_END_FATURA_NF.ToString().Trim(), " ",
                                        item.TB_NOTA_SAIDA.COMP_END_FATURA_NF.ToString().Trim(),
                                       " - CEP:" + item.TB_NOTA_SAIDA.CEP_FATURA_NF.ToString().Trim(),
                                       " - ", item.TB_NOTA_SAIDA.BAIRRO_FATURA_NF.ToString().Trim(),
                                       " - ", item.TB_NOTA_SAIDA.MUNICIPIO_NF.ToString().Trim(),
                                       " - ", item.TB_NOTA_SAIDA.UF_NF);
                            }

                            conteudo.Remove(0, conteudo.Length);

                            string _conteudo = "";

                            string l = Busca_Letra_Duplicata(ctx, item.NUMERO_NF_SAIDA, item.DATA_VENCIMENTO);

                            if ((i % 2) == 0)
                            {
                                _conteudo = @"<br /><br /><br /><table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td>
                                <b>Natureza da Opera&ccedil;&atilde;o</b><br />
                                " + "Presta&ccedil;&atilde;o de Servi&ccedil;os" + @"
                                <br />&nbsp;</td>
                                <td>
                                <b>CFOP</b><br />
                                " + @"
                                </td>
                                </tr>
                                </table>

                                <table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td colspan=""2""><b>Cliente</b><br />" + item.TB_NOTA_SAIDA.NOME_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CNPJ</b><br />" + item.TB_NOTA_SAIDA.CNPJ_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Emiss&atilde;o</b><br />" + ApoioXML.TrataData2(item.DATA_LANCAMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""2""><b>Endere&ccedil;o de Faturamento</b><br />" + string.Concat(item.TB_NOTA_SAIDA.ENDERECO_FATURA_NF.Trim(),
                                                                                                            ", ", item.TB_NOTA_SAIDA.NUMERO_END_FATURA_NF.Trim(),
                                                                                                            " ", item.TB_NOTA_SAIDA.COMP_END_FATURA_NF.Trim()) + @"<br />&nbsp;</td>
                                <td><b>Bairro</b><br />" + item.TB_NOTA_SAIDA.BAIRRO_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CEP</b><br />" + item.TB_NOTA_SAIDA.CEP_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>Cidade</b><br />" + item.TB_NOTA_SAIDA.MUNICIPIO_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Telefone</b><br />" + item.TB_NOTA_SAIDA.TELEFONE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Estado</b><br />" + item.TB_NOTA_SAIDA.UF_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>I.E.</b><br />" + item.TB_NOTA_SAIDA.IE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>N&ordm; NF</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + @"<br />&nbsp;</td>
                                <td><b>Valor Duplicata</b><br />" + item.VALOR_TOTAL.ToString().Valor_Moeda(2) + @"<br />&nbsp;</td>
                                <td><b>Duplicata</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + "/" + l + @"<br />&nbsp;</td>
                                <td><b>Vencimento</b><br />" + ApoioXML.TrataData2(item.DATA_VENCIMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Valor por Extenso</b><br />" + VALOR_EXTENSO + " *****" + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Endere&ccedil;o de Cobran&ccedil;a</b><br />" + ENDERECO_COBRANCA + @"<br /><br /><br />&nbsp;</td>
                                </tr>

                                </table>
                                <br /><br /><hr />";
                            }
                            else
                            {
                                _conteudo = @"<br /><br /><br /><table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td>
                                <b>Natureza da Opera&ccedil;&atilde;o</b><br />
                                " + "Presta&ccedil;&atilde;o de Servi&ccedil;os" + @"
                                <br />&nbsp;</td>
                                <td>
                                <b>CFOP</b><br />
                                " + @"
                                </td>
                                </tr>
                                </table>

                                <table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td colspan=""2""><b>Cliente</b><br />" + item.TB_NOTA_SAIDA.NOME_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CNPJ</b><br />" + item.TB_NOTA_SAIDA.CNPJ_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Emiss&atilde;o</b><br />" + ApoioXML.TrataData2(item.DATA_LANCAMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""2""><b>Endere&ccedil;o de Faturamento</b><br />" + string.Concat(item.TB_NOTA_SAIDA.ENDERECO_FATURA_NF.Trim(),
                                                                                                            ", ", item.TB_NOTA_SAIDA.NUMERO_END_FATURA_NF.Trim(),
                                                                                                            " ", item.TB_NOTA_SAIDA.COMP_END_FATURA_NF.Trim()) + @"<br />&nbsp;</td>
                                <td><b>Bairro</b><br />" + item.TB_NOTA_SAIDA.BAIRRO_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CEP</b><br />" + item.TB_NOTA_SAIDA.CEP_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>Cidade</b><br />" + item.TB_NOTA_SAIDA.MUNICIPIO_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Telefone</b><br />" + item.TB_NOTA_SAIDA.TELEFONE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Estado</b><br />" + item.TB_NOTA_SAIDA.UF_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>I.E.</b><br />" + item.TB_NOTA_SAIDA.IE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>N&ordm; NF</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + @"<br />&nbsp;</td>
                                <td><b>Valor Duplicata</b><br />" + item.VALOR_TOTAL.ToString().Valor_Moeda(2) + @"<br />&nbsp;</td>
                                <td><b>Duplicata</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + "/" + l + @"<br />&nbsp;</td>
                                <td><b>Vencimento</b><br />" + ApoioXML.TrataData2(item.DATA_VENCIMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Valor por Extenso</b><br />" + VALOR_EXTENSO + " *****" + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Endere&ccedil;o de Cobran&ccedil;a</b><br />" + ENDERECO_COBRANCA + @"<br /><br /><br />&nbsp;</td>
                                </tr>

                                </table>";
                            }

                            conteudo.Append(_conteudo);

                            re.InsereConteudo(conteudo.ToString());

                            i++;
                            d++;
                        }
                    }

                    re.FinalizaImpressao();

                    Arquivo = re.SalvaDocumento("DUPLICATAS_NF" + NUMERO_NF.ToString());
                }

                return Arquivo;
            }
        }

        public string ImprimeDuplicataAvulsa()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                using (Th2_Report re = new Th2_Report())
                {
                    re.NumeroDasPaginas = false;
                    re.ExibeCabecalho = false;
                    re.ExibeRodape = false;

                    int i = 0;

                    for (int n = 0; n < NUMERO_FINANCEIROS.Count; n++)
                    {
                        var query = (from linha in ctx.TB_FINANCEIROs
                                     join nota in ctx.TB_NOTA_SAIDAs on linha.NUMERO_NF_SAIDA equals nota.NUMERO_NF
                                     orderby linha.NUMERO_FINANCEIRO
                                     where linha.NUMERO_FINANCEIRO == NUMERO_FINANCEIROS[n]
                                     && linha.NUMERO_NF_SAIDA > 0
                                     && linha.CREDITO_DEBITO == 0

                                     select new
                                     {
                                         linha.NUMERO_NF_SAIDA,
                                         linha.DATA_LANCAMENTO,
                                         linha.DATA_VENCIMENTO,
                                         linha.VALOR_TOTAL,

                                         linha.TB_CLIENTE.ENDERECO_COBRANCA,
                                         linha.TB_CLIENTE.CEP_COBRANCA,
                                         linha.TB_CLIENTE.BAIRRO_COBRANCA,
                                         linha.TB_CLIENTE.TB_MUNICIPIO2.NOME_MUNICIPIO,
                                         linha.TB_CLIENTE.TB_MUNICIPIO2.TB_UF.SIGLA_UF,

                                         nota.ENDERECO_FATURA_NF,
                                         nota.NUMERO_END_FATURA_NF,
                                         nota.COMP_END_FATURA_NF,
                                         nota.CEP_FATURA_NF,
                                         nota.BAIRRO_FATURA_NF,
                                         nota.MUNICIPIO_NF,
                                         nota.UF_NF,

                                         nota.NOME_CLIENTE_NF,
                                         nota.CNPJ_CLIENTE_NF,
                                         nota.TELEFONE_CLIENTE_NF,
                                         nota.IE_CLIENTE_NF

                                     }).ToList();

                        if (!query.Any())
                            throw new Exception("Selecione 1 ou mais t&iacute;tulos que sejam de cobran&ccedil;a de uma nota fiscal de venda");


                        int d = 0;

                        foreach (var item in query)
                        {
                            if (i > 0 && (i % 2) == 0)
                            {
                                re.AdicionaNovaPagina();
                            }

                            NUMERO_NF = (decimal)item.NUMERO_NF_SAIDA;

                            NumeroPorExtenso ext = new NumeroPorExtenso((decimal)item.VALOR_TOTAL);

                            string VALOR_EXTENSO = ext.ToString().ToUpper();

                            string ENDERECO_COBRANCA = !string.IsNullOrEmpty(item.ENDERECO_COBRANCA) ?
                                string.Concat(item.ENDERECO_COBRANCA.Trim(),
                                               " - CEP:" + item.CEP_COBRANCA.Trim(),
                                               " - ", item.BAIRRO_COBRANCA.Trim(),
                                               " - ", item.NOME_MUNICIPIO.Trim(),
                                               " - ", item.SIGLA_UF)
                               :

                                string.Concat(item.ENDERECO_FATURA_NF.Trim(),
                                                ", ", item.NUMERO_END_FATURA_NF.Trim(), " ",
                                                item.COMP_END_FATURA_NF.Trim(),
                                               " - CEP:" + item.CEP_FATURA_NF.Trim(),
                                               " - ", item.BAIRRO_FATURA_NF.Trim(),
                                               " - ", item.MUNICIPIO_NF.Trim(),
                                               " - ", item.UF_NF.Trim());

                            conteudo.Remove(0, conteudo.Length);

                            string _conteudo = "";

                            string l = Busca_Letra_Duplicata(ctx, item.NUMERO_NF_SAIDA, item.DATA_VENCIMENTO);

                            if ((i % 2) == 0)
                            {
                                _conteudo = @"<br /><br /><br /><table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td>
                                <b>Natureza da Opera&ccedil;&atilde;o</b><br />
                                " + "Presta&ccedil;&atilde;o de Servi&ccedil;os" + @"
                                <br />&nbsp;</td>
                                <td>
                                <b>CFOP</b><br />
                                " + @"
                                </td>
                                </tr>
                                </table>

                                <table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td colspan=""2""><b>Cliente</b><br />" + item.NOME_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CNPJ</b><br />" + item.CNPJ_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Emiss&atilde;o</b><br />" + ApoioXML.TrataData2(item.DATA_LANCAMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""2""><b>Endere&ccedil;o de Faturamento</b><br />" + string.Concat(item.ENDERECO_FATURA_NF.Trim(),
                                                                                                            ", ", item.NUMERO_END_FATURA_NF.Trim(),
                                                                                                            " ", item.COMP_END_FATURA_NF.Trim()) + @"<br />&nbsp;</td>
                                <td><b>Bairro</b><br />" + item.BAIRRO_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CEP</b><br />" + item.CEP_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>Cidade</b><br />" + item.MUNICIPIO_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Telefone</b><br />" + item.TELEFONE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Estado</b><br />" + item.UF_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>I.E.</b><br />" + item.IE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>N&ordm; NF</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + @"<br />&nbsp;</td>
                                <td><b>Valor Duplicata</b><br />" + item.VALOR_TOTAL.Value.ToString("c") + @"<br />&nbsp;</td>
                                <td><b>Duplicata</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + "/" + l + @"<br />&nbsp;</td>
                                <td><b>Vencimento</b><br />" + ApoioXML.TrataData2(item.DATA_VENCIMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Valor por Extenso</b><br />" + VALOR_EXTENSO + " *****" + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Endere&ccedil;o de Cobran&ccedil;a</b><br />" + ENDERECO_COBRANCA + @"<br /><br /><br />&nbsp;</td>
                                </tr>

                                </table>
                                <br /><br /><hr />";
                            }
                            else
                            {
                                _conteudo = @"<br /><br /><br /><table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td>
                                <b>Natureza da Opera&ccedil;&atilde;o</b><br />
                                " + "Presta&ccedil;&atilde;o de Servi&ccedil;os" + @"
                                <br />&nbsp;</td>
                                <td>
                                <b>CFOP</b><br />
                                " +  @"
                                </td>
                                </tr>
                                </table>

                                <table style=""width: 770px; font-family: Courier New;"">
                                <tr>
                                <td colspan=""2""><b>Cliente</b><br />" + item.NOME_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CNPJ</b><br />" + item.CNPJ_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Emiss&atilde;o</b><br />" + ApoioXML.TrataData2(item.DATA_LANCAMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""2""><b>Endere&ccedil;o de Faturamento</b><br />" + string.Concat(item.ENDERECO_FATURA_NF.Trim(),
                                                                                                            ", ", item.NUMERO_END_FATURA_NF.Trim(),
                                                                                                            " ", item.COMP_END_FATURA_NF.Trim()) + @"<br />&nbsp;</td>
                                <td><b>Bairro</b><br />" + item.BAIRRO_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>CEP</b><br />" + item.CEP_FATURA_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>Cidade</b><br />" + item.MUNICIPIO_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Telefone</b><br />" + item.TELEFONE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>Estado</b><br />" + item.UF_NF.Trim() + @"<br />&nbsp;</td>
                                <td><b>I.E.</b><br />" + item.IE_CLIENTE_NF.Trim() + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td><b>N&ordm; NF</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + @"<br />&nbsp;</td>
                                <td><b>Valor Duplicata</b><br />" + item.VALOR_TOTAL.ToString().Valor_Moeda(2) + @"<br />&nbsp;</td>
                                <td><b>Duplicata</b><br />" + item.NUMERO_NF_SAIDA.ToString().PadLeft(8, '0') + "/" + l + @"<br />&nbsp;</td>
                                <td><b>Vencimento</b><br />" + ApoioXML.TrataData2(item.DATA_VENCIMENTO) + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Valor por Extenso</b><br />" + VALOR_EXTENSO + " *****" + @"<br />&nbsp;</td>
                                </tr>

                                <tr>
                                <td colspan=""4""><b>Endere&ccedil;o de Cobran&ccedil;a</b><br />" + ENDERECO_COBRANCA + @"<br /><br /><br />&nbsp;</td>
                                </tr>

                                </table>";
                            }

                            conteudo.Append(_conteudo);

                            re.InsereConteudo(conteudo.ToString());

                            i++;
                            d++;
                        }
                    }

                    re.FinalizaImpressao();

                    Arquivo = re.SalvaDocumento("DUPLICATAS_NF" + NUMERO_NF.ToString());
                }

                return Arquivo;
            }
        }

        private string Busca_Letra_Duplicata(DataContext ctx, decimal? NUMERO_NF, DateTime? DATA_VENCIMENTO)
        {
            var query = (from linha in ctx.GetTable<TB_FINANCEIRO>()
                         orderby linha.NUMERO_NF_SAIDA
                         where linha.NUMERO_NF_SAIDA == NUMERO_NF
                         && linha.CREDITO_DEBITO == 0
                         select linha).ToList();

            var query1 = query.OrderBy(v => v.DATA_VENCIMENTO).ToList();

            string retorno = "";

            for (int i = 0; i < query1.Count(); i++)
            {
                var item = query1[i];

                if (item.DATA_VENCIMENTO == DATA_VENCIMENTO)
                    retorno = Duplicatas[i];
            }

            return retorno;
        }

        private void DuplicatasLetras()
        {
            Duplicatas = new List<string>();

            Duplicatas.Add("A");
            Duplicatas.Add("B");
            Duplicatas.Add("C");
            Duplicatas.Add("D");
            Duplicatas.Add("E");
            Duplicatas.Add("F");
            Duplicatas.Add("G");
            Duplicatas.Add("H");
            Duplicatas.Add("I");
            Duplicatas.Add("J");
            Duplicatas.Add("K");
            Duplicatas.Add("L");
            Duplicatas.Add("M");
            Duplicatas.Add("N");
            Duplicatas.Add("O");
            Duplicatas.Add("P");
            Duplicatas.Add("Q");
            Duplicatas.Add("R");
            Duplicatas.Add("S");
            Duplicatas.Add("T");
            Duplicatas.Add("U");
            Duplicatas.Add("V");
            Duplicatas.Add("X");
            Duplicatas.Add("Y");
            Duplicatas.Add("Z");

        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}