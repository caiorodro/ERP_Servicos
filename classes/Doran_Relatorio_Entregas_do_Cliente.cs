using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Text;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Relatorio_Entregas_do_Cliente : IDisposable
    {
        public string cliente_fornecedor
        {
            get;
            set;
        }

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

        public Doran_Relatorio_Entregas_do_Cliente(string _clientefornecedor, DateTime _data1, DateTime _data2, decimal _ID_EMPRESA)
        {
            cliente_fornecedor = _clientefornecedor;
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

            using (Th2_Report r = new Th2_Report(ExpertPdf.HtmlToPdf.PdfPageSize.A4, ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape))
            {
                r.ID_EMPRESA = ID_EMPRESA;

                DateTime data2 = dt2.AddSeconds(-1);

                r.DefineCabecalho(string.Format("Relat&oacute;rio de entregas do cliente<br /><span style='font-family: Tahoma; font-size: 8pt;'>Per&iacute;odo de {0} at&eacute; {1}<br />Empresa / Filial: " + Emitente + "</span>",
                    ApoioXML.TrataData2(dt1), ApoioXML.TrataData2(data2)), 60);

                if (!(from linha in ctx.TB_STATUS_PEDIDOs
                      where linha.STATUS_ESPECIFICO == 3
                      select linha).Any())
                {
                    throw new Exception("A fase de serviço faturado n&atilde;o est&aacute; cadastrada");
                }

                var query = from linha in ctx.TB_PEDIDO_VENDAs

                            where (linha.DATA_PEDIDO >= dt1
                            && linha.DATA_PEDIDO < dt2)

                            && linha.STATUS_ITEM_PEDIDO == (from linha1 in ctx.TB_STATUS_PEDIDOs
                                                            where linha1.STATUS_ESPECIFICO == 3
                                                            select linha1.CODIGO_STATUS_PEDIDO).First()

                            && linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(cliente_fornecedor)

                            select new
                            {
                                linha.NUMERO_PEDIDO,
                                linha.ENTREGA_PEDIDO,
                                linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.TB_CLIENTE.NOMEFANTASIA_CLIENTE,

                                ENDERECO_BUSCA = string.Concat(linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_INICIAL_ITEM_ORCAMENTO.Trim(), " ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_INICIAL_ITEM_ORCAMENTO.Trim(), " - CEP: ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.CEP_INICIAL_ITEM_ORCAMENTO.Trim(), " ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_INICIAL_ITEM_ORCAMENTO.Trim(), " - ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_INICIAL_ITEM_ORCAMENTO),

                                ENDERECO_ENTREGA = string.Concat(linha.TB_ITEM_ORCAMENTO_VENDA.ENDERECO_FINAL_ITEM_ORCAMENTO.Trim(), " ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.NUMERO_FINAL_ITEM_ORCAMENTO.Trim(), " - CEP: ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.CEP_FINAL_ITEM_ORCAMENTO.Trim(), " ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.CIDADE_FINAL_ITEM_ORCAMENTO.Trim(), " - ",
                                                               linha.TB_ITEM_ORCAMENTO_VENDA.ESTADO_FINAL_ITEM_ORCAMENTO),

                                VALOR_SERVICO = linha.VALOR_TOTAL_ITEM_PEDIDO,

                                OBS = linha.TB_ITEM_ORCAMENTO_VENDA.OBS_ITEM_ORCAMENTO
                            };

                StringBuilder _conteudo = new StringBuilder();

                _conteudo.Append("<table style='width: 98%; font-family: tahoma; font-size: 8pt;'>");

                _conteudo.Append(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Nr. OS</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Cliente</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Busca</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>Entrega</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>Valor servi&ccedil;o</td>
                                  </tr>");

                decimal Total = 0;

                foreach (var item in query)
                {
                    _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{0}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{1}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{2}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{3}</td>
                                    <td style='BORDER-BOTTOM: 1px solid;'>{4}</td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>{5}</td>
                                    </tr>", item.NUMERO_PEDIDO.ToString(),
                                        ApoioXML.Data((DateTime)item.ENTREGA_PEDIDO),
                                        item.NOMEFANTASIA_CLIENTE.Trim(),
                                        item.ENDERECO_BUSCA,
                                        item.ENDERECO_ENTREGA,
                                        ((decimal)item.VALOR_SERVICO).ToString("c")));

                    _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;' colspan='5'>{0}</td>
                                    </tr>", item.OBS));

                    Total += (decimal)item.VALOR_SERVICO;
                }

                _conteudo.Append(string.Format(@"<tr>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid;'></td>
                                    <td style='BORDER-BOTTOM: 1px solid; text-align: right;'>{0}</td>
                                    </tr>", ((decimal)Total).ToString("c")));

                r.InsereConteudo(_conteudo.ToString());

                retorno = r.SalvaDocumento("Doran_Entregas_do_cliente");

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