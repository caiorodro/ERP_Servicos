using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Relatorio_desempenho_ciclista : IDisposable
    {
        public DateTime dt1
        {
            get;
            set;
        }

        public DateTime dt2
        {
            get;
            set;
        }

        private Doran_ERP_Servicos_DadosDataContext ctx { get; set; }

        private decimal ID_EMPRESA { get; set; }

        public Doran_Relatorio_desempenho_ciclista(DateTime _data1, DateTime _data2, decimal _ID_EMPRESA)
        {
            dt1 = _data1;
            dt2 = _data2;
            dt2 = dt2.AddDays(1);

            ID_EMPRESA = _ID_EMPRESA;

            ctx = new Doran_ERP_Servicos_DadosDataContext();
            ctx.Connection.Open();
            ctx.ExecuteCommand("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;");
        }

        public string MontaRelatorio()
        {
            string retorno = "";
            string Emitente = BuscaNomeFilial();

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                DateTime data2 = dt2.AddSeconds(-1);

                r.DefineCabecalho(string.Format("Relat&oacute;rio de desempenho por ciclista<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />Empresa / Filial: " + Emitente + "</span>",
                    ApoioXML.TrataData2(dt1), ApoioXML.TrataData2(data2)), 60);

                var query = (from linha in ctx.TB_SERVICO_CICLISTAs
                             where linha.TB_PEDIDO_VENDA.DATA_PEDIDO >= dt1
                             && linha.TB_PEDIDO_VENDA.DATA_PEDIDO < dt2
                             && linha.TB_PEDIDO_VENDA.TB_STATUS_PEDIDO.STATUS_ESPECIFICO != 4

                             group linha by new
                             {
                                 linha.ID_CICLISTA,
                                 linha.TB_CICLISTA.NOME_CICLISTA
                             } into agrupamento

                             select new
                             {
                                 CICLISTA = agrupamento.First().TB_CICLISTA.NOME_CICLISTA,
                                 TOTAL_KM = agrupamento.Sum(_ => _.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.DISTANCIA_EM_METROS).HasValue ?
                                     agrupamento.Sum(_ => _.TB_PEDIDO_VENDA.TB_ITEM_ORCAMENTO_VENDA.DISTANCIA_EM_METROS) : 0,
                                 NUMERO_ENTREGAS = agrupamento.Count()
                             }).ToList();

                StringBuilder _conteudo = new StringBuilder();

                _conteudo.Append("<table style='width: 80%; font-family: tahoma; font-size: 8pt;'>");

                _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Ciclista</td>
                                    <td style='BORDER-BOTTOM: 1px solid;  text-align: right;'>Total Km no per&iacute;odo</td>
                                    <td style='BORDER-BOTTOM: 1px solid;  text-align: center;'>Nr. de entregas</td>
                                  </tr>");

                decimal Total = 0;
                int Entregas = 0;

                foreach (var item in query.OrderByDescending(_ => _.TOTAL_KM))
                {
                    _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>{1}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;  text-align: center;'>{2}</td>
                                    </tr>", item.CICLISTA.ToString(),
                                        (item.TOTAL_KM.HasValue ?
                                        item.TOTAL_KM.Value / 1000 : 0).ToString("n") + " Km",
                                        item.NUMERO_ENTREGAS.ToString()));

                    Total += item.TOTAL_KM.HasValue ? item.TOTAL_KM.Value / 1000 : 0;
                    Entregas += item.NUMERO_ENTREGAS;
                }

                _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;  text-align: center;'>{1}</td>
                                    </tr>", ((decimal)Total).ToString("n") + " Km",
                                          Entregas.ToString()));

                r.InsereConteudo(_conteudo.ToString());

                retorno = r.SalvaDocumento("Doran_Desempenho_Ciclista");

                return retorno;
            }
        }

        private string BuscaNomeFilial()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_EMITENTEs
                             where linha.CODIGO_EMITENTE == ID_EMPRESA
                             select new
                             {
                                 linha.NOME_EMITENTE
                             }).ToList();

                string retorno = "";

                foreach (var item in query)
                {
                    retorno = item.NOME_EMITENTE.Trim();
                }

                return retorno;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            ctx.Connection.Close();
        }

        #endregion
    }
}