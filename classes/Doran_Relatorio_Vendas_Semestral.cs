using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Relatorio_Vendas_Semestral : IDisposable
    {
        public DateTime _dataRef { get; set; }

        private DateTime dt1 { get; set; }
        private DateTime dt2 { get; set; }

        private DateTime dt3 { get; set; }

        public decimal CODIGO_VENDEDOR { get; set; }
        public string CODIGO_REGIAO { get; set; }
        public string CLIENTE { get; set; }

        private string NOME_VENDEDOR { get; set; }
        private string NOME_REGIAO { get; set; }

        public decimal ID_UF { get; set; }
        public decimal ID_MUNICIPIO { get; set; }

        public Doran_Relatorio_Vendas_Semestral(DateTime dataRef)
        {
            _dataRef = dataRef;

            dt1 = new DateTime(_dataRef.Year, _dataRef.Month, 01);
            dt2 = dt1.AddMonths(1);

            dt3 = dt1.AddMonths(-12);
        }

        public string Lista_Relatorio(decimal ID_EMPRESA)
        {
            string retorno = "";

            Preenche_Vendedor_Regiao();

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                r.DefineCabecalho("Relat&oacute;rio de Vendas (Anual) por Cliente<br /><span style='font-size: 8pt;'>" + NOME_VENDEDOR + " - " + NOME_REGIAO + "</span>", 60);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var clientes_faturamento = (from linha in ctx.TB_NOTA_SAIDAs
                                                orderby linha.DATA_EMISSAO_NF
                                                where (linha.DATA_EMISSAO_NF >= dt3 && linha.DATA_EMISSAO_NF < dt2)

                                                && (linha.STATUS_NF == 4 || linha.STATUS_NF == 2)

                                                && (linha.TB_CLIENTE.CODIGO_VENDEDOR_CLIENTE == CODIGO_VENDEDOR || CODIGO_VENDEDOR == 0)
                                                && (linha.TB_CLIENTE.CODIGO_REGIAO == CODIGO_REGIAO || CODIGO_REGIAO == "")

                                                && (linha.NOME_FANTASIA_CLIENTE_NF.Contains(CLIENTE))

                                                && (linha.ID_UF_NF == ID_UF || ID_UF == 0)

                                                && (linha.ID_MUNICIPIO_NF == ID_MUNICIPIO || ID_MUNICIPIO == 0)

                                                select new LISTA_CLIENTES()
                                                {
                                                    CODIGO_CLIENTE_NF = linha.CODIGO_CLIENTE_NF,
                                                    NOME_FANTASIA_CLIENTE_NF = linha.NOME_FANTASIA_CLIENTE_NF
                                                }).Distinct().ToList();

                    var clientes_venda = (from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                                          orderby linha.DATA_PEDIDO

                                          where (linha.DATA_PEDIDO >= dt1 && linha.DATA_PEDIDO < dt2)

                                          && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 1
                                          && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.CODIGO_VENDEDOR_CLIENTE == CODIGO_VENDEDOR || CODIGO_VENDEDOR == 0)
                                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.CODIGO_REGIAO == CODIGO_REGIAO || CODIGO_REGIAO == "")

                                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(CLIENTE))

                                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.ESTADO_FATURA == ID_UF || ID_UF == 0)

                                            && (linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.CIDADE_FATURA == ID_MUNICIPIO || ID_MUNICIPIO == 0)

                                          select new LISTA_CLIENTES()
                                          {
                                              CODIGO_CLIENTE_NF = linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO,
                                              NOME_FANTASIA_CLIENTE_NF = linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE
                                          }).Distinct().ToList();

                    List<LISTA_CLIENTES> clientes_final = new List<LISTA_CLIENTES>();

                    foreach (var item in clientes_faturamento)
                        clientes_final.Add(item);

                    foreach (var item in clientes_venda)
                    {
                        var jaExiste = clientes_final.Where(j => j.CODIGO_CLIENTE_NF == item.CODIGO_CLIENTE_NF).Any();

                        if (!jaExiste)
                            clientes_final.Add(item);
                    }

                    StringBuilder _conteudo = new StringBuilder();

                    _conteudo.Append("<table style='width: 100%; font-family: tahoma; font-size: 8pt;'>");

                    _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.Month.ToString().PadLeft(2, '0') + "/" + dt3.Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(1).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(1).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(2).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(2).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(3).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(3).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(4).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(4).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(5).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(5).Year.ToString() + @"</td>

                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(6).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(6).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(7).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(7).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(8).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(8).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(9).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(9).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(10).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(10).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>" + dt3.AddMonths(11).Month.ToString().PadLeft(2, '0') + "/" + dt3.AddMonths(11).Year.ToString() + @"</td>
                                    <td style='BORDER-BOTTOM: 1px solid; font-weight: bold; text-align: center;'>Total</td>
                                  </tr>");

                    decimal total1 = 0;
                    decimal total2 = 0;
                    decimal total3 = 0;
                    decimal total4 = 0;
                    decimal total5 = 0;
                    decimal total6 = 0;
                    decimal total7 = 0;
                    decimal total8 = 0;
                    decimal total9 = 0;
                    decimal total10 = 0;
                    decimal total11 = 0;
                    decimal total12 = 0;
                    decimal total13 = 0;

                    decimal total_1 = 0;
                    decimal total_2 = 0;
                    decimal total_3 = 0;
                    decimal total_4 = 0;
                    decimal total_5 = 0;
                    decimal total_6 = 0;
                    decimal total_7 = 0;
                    decimal total_8 = 0;
                    decimal total_9 = 0;
                    decimal total_10 = 0;
                    decimal total_11 = 0;
                    decimal total_12 = 0;
                    decimal total_13 = 0;

                    var clientes_ordenado = clientes_final.OrderBy(n => n.NOME_FANTASIA_CLIENTE_NF);

                    List<decimal> totais = new List<decimal>();
                    List<decimal> totais1 = new List<decimal>();

                    foreach (var item in clientes_ordenado)
                    {
                        totais = Calcula_Vendas_Semestral_do_cliente(item.CODIGO_CLIENTE_NF);
                        totais1 = Calcula_Faturado_Semestral_do_cliente(item.CODIGO_CLIENTE_NF);

                        _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{1}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{2}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{3}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{4}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{5}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{6}</td>

                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{7}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{8}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{9}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{10}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{11}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{12}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; text-align: right;'>{13}</td>
                                  </tr>",
                                        item.NOME_FANTASIA_CLIENTE_NF.Trim(),
                                        totais[11].ToString("c") + "<br />" + totais1[11].ToString("c"),
                                        totais[10].ToString("c") + "<br />" + totais1[10].ToString("c"),
                                        totais[9].ToString("c") + "<br />" + totais1[9].ToString("c"),
                                        totais[8].ToString("c") + "<br />" + totais1[8].ToString("c"),
                                        totais[7].ToString("c") + "<br />" + totais1[7].ToString("c"),
                                        totais[6].ToString("c") + "<br />" + totais1[6].ToString("c"),

                                        totais[5].ToString("c") + "<br />" + totais1[5].ToString("c"),
                                        totais[4].ToString("c") + "<br />" + totais1[4].ToString("c"),
                                        totais[3].ToString("c") + "<br />" + totais1[3].ToString("c"),
                                        totais[2].ToString("c") + "<br />" + totais1[2].ToString("c"),
                                        totais[1].ToString("c") + "<br />" + totais1[1].ToString("c"),
                                        totais[0].ToString("c") + "<br />" + totais1[0].ToString("c"),

                                        totais.Sum().ToString("c") + "<br />" + totais1.Sum().ToString("c")
                                        ));

                        total1 += totais[11];
                        total2 += totais[10];
                        total3 += totais[9];
                        total4 += totais[8];
                        total5 += totais[7];
                        total6 += totais[6];
                        total7 += totais[5];
                        total8 += totais[4];
                        total9 += totais[3];
                        total10 += totais[2];
                        total11 += totais[1];
                        total12 += totais[0];
                        total13 += totais.Sum();

                        total_1 += totais1[11];
                        total_2 += totais1[10];
                        total_3 += totais1[9];
                        total_4 += totais1[8];
                        total_5 += totais1[7];
                        total_6 += totais1[6];

                        total_7 += totais1[5];
                        total_8 += totais1[4];
                        total_9 += totais1[3];
                        total_10 += totais1[2];
                        total_11 += totais1[1];
                        total_12 += totais1[0];
                        total_13 += totais1.Sum();
                    }

                    _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold;'>Totais</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{1}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{2}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{3}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{4}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{5}</td>

                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{6}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{7}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{8}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{9}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{10}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{11}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; BORDER-RIGHT: 1px solid; font-weight: bold; text-align: right;'>{12}</td>
                                  </tr>",
                total1.ToString("c") + "<br />" + total_1.ToString("c"),
                total2.ToString("c") + "<br />" + total_2.ToString("c"),
                total3.ToString("c") + "<br />" + total_3.ToString("c"),
                total4.ToString("c") + "<br />" + total_4.ToString("c"),
                total5.ToString("c") + "<br />" + total_5.ToString("c"),
                total6.ToString("c") + "<br />" + total_6.ToString("c"),
                total7.ToString("c") + "<br />" + total_7.ToString("c"),
                total8.ToString("c") + "<br />" + total_8.ToString("c"),
                total9.ToString("c") + "<br />" + total_9.ToString("c"),
                total10.ToString("c") + "<br />" + total_10.ToString("c"),
                total11.ToString("c") + "<br />" + total_11.ToString("c"),
                total12.ToString("c") + "<br />" + total_12.ToString("c"),
                total13.ToString("c") + "<br />" + total_13.ToString("c")
                ));

                    _conteudo.Append("</table>");

                    r.InsereConteudo(_conteudo.ToString());

                    retorno = r.SalvaDocumento("Vendas_Anual_Cliente");
                }

                return retorno;
            }
        }

        private List<decimal> Calcula_Faturado_Semestral_do_cliente(decimal? CODIGO_CLIENTE)
        {
            List<decimal> retorno = new List<decimal>();
            
            DateTime _dt1 = dt1;
            DateTime _dt2 = dt2;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < 12; i++)
                {
                    var soma = (from linha in ctx.TB_NOTA_SAIDAs
                                orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF

                                where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                && (linha.DATA_EMISSAO_NF >= _dt1 && linha.DATA_EMISSAO_NF < _dt2)

                                && (linha.STATUS_NF == 4 || linha.STATUS_NF == 2)

                                select linha).Sum(s => s.TOTAL_SERVICOS_NF);

                    retorno.Add(soma.HasValue ? soma.Value : 0);

                    _dt1 = _dt1.AddMonths(-1);
                    _dt2 = _dt2.AddMonths(-1);
                }
            }

            return retorno;
        }

        private List<decimal> Calcula_Vendas_Semestral_do_cliente(decimal? CODIGO_CLIENTE)
        {
            List<decimal> retorno = new List<decimal>();

            DateTime _dt1 = dt1;
            DateTime _dt2 = dt2;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                for (int i = 0; i < 12; i++)
                {
                    var soma = (from linha in ctx.TB_PEDIDO_VENDAs
                                orderby linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO, linha.DATA_PEDIDO

                                where linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == CODIGO_CLIENTE
                                && (linha.DATA_PEDIDO >= _dt1 && linha.DATA_PEDIDO < _dt2)

                                && (linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 1
                                && linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4)

                                select linha).Sum(s => s.VALOR_TOTAL_ITEM_PEDIDO);

                    retorno.Add(soma.HasValue ? soma.Value : 0);

                    _dt1 = _dt1.AddMonths(-1);
                    _dt2 = _dt2.AddMonths(-1);
                }
            }

            return retorno;
        }

        public void Preenche_Vendedor_Regiao()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                NOME_VENDEDOR = "";

                var query = (from linha in ctx.TB_VENDEDOREs
                             where linha.ID_VENDEDOR == CODIGO_VENDEDOR
                             select new { linha.NOME_VENDEDOR }).ToList();

                foreach (var item in query)
                {
                    NOME_VENDEDOR = "<b>Vendedor(a)</b>: " + item.NOME_VENDEDOR.Trim();
                }

                //var query1 = (from linha in ctx.TB_REGIAO_VENDAs
                //              where linha.CODIGO_REGIAO == CODIGO_REGIAO
                //              select new { linha.NOME_REGIAO }).ToList();

                //foreach (var item in query1)
                //{
                //    NOME_REGIAO = "<b>Regi&atilde;o</b>: " + item.NOME_REGIAO.Trim();
                //}
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion

        public class LISTA_CLIENTES
        {
            public LISTA_CLIENTES() { }

            public decimal? CODIGO_CLIENTE_NF { get; set; }
            public string NOME_FANTASIA_CLIENTE_NF { get; set; }
        }
    }
}
