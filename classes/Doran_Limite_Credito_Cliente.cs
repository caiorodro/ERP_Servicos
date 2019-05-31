using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Limite_Credito_Cliente : IDisposable
    {
        private decimal ID_EMPRESA { get; set; }

        public Doran_Limite_Credito_Cliente(decimal _ID_EMPRESA)
        {
            ID_EMPRESA = _ID_EMPRESA;
        }

        public string ListaClientesComLimiteExcedido(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = from linha in ctx.TB_FINANCEIROs

                            where linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                            && linha.CREDITO_DEBITO == 0 && linha.CODIGO_CLIENTE > 0
                            && (linha.TB_CLIENTE.NOME_CLIENTE.Contains(dados["pesquisa"].ToString())
                            || linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE.Contains(dados["pesquisa"].ToString()))

                            group linha by new
                            {
                                linha.CODIGO_CLIENTE,
                                linha.TB_CLIENTE.NOMEFANTASIA_CLIENTE,
                                linha.TB_CLIENTE.TB_MUNICIPIO.NOME_MUNICIPIO,
                                linha.TB_CLIENTE.TB_MUNICIPIO1.TB_UF.SIGLA_UF,
                                linha.TB_CLIENTE.TELEFONE_FATURA,
                                linha.TB_CLIENTE.TB_LIMITE.VALOR_LIMITE
                            }
                                into grupo

                                select new
                                {
                                    CODIGO_CLIENTE = grupo.Key.CODIGO_CLIENTE,
                                    NOMEFANTASIA_CLIENTE = grupo.Key.NOMEFANTASIA_CLIENTE,
                                    CIDADE = grupo.Key.NOME_MUNICIPIO,
                                    UF = grupo.Key.SIGLA_UF,
                                    TELEFONE = grupo.Key.TELEFONE_FATURA,
                                    VALOR_LIMITE = grupo.Key.VALOR_LIMITE,

                                    VALOR_EM_ABERTO = grupo.Sum(linha => linha.VALOR_TOTAL)
                                };

                query = query.Where(m => m.VALOR_EM_ABERTO > 0);

                int rowCount = query.Count();

                query = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                DataTable dt = ApoioXML.ToDataTable(ctx, query);

                dt.Columns["VALOR_EM_ABERTO"].ReadOnly = false;

                foreach (DataRow dr in dt.Rows)
                {
                    decimal valorEmAberto = Convert.ToDecimal(dr["VALOR_EM_ABERTO"]);

                    valorEmAberto += Doran_Limite_Credito_Cliente.Limite_Excedido_Cliente(Convert.ToDecimal(dr["CODIGO_CLIENTE"]));

                    valorEmAberto -= Convert.ToDecimal(dr["VALOR_LIMITE"]);

                    if (valorEmAberto < (decimal)0.00)
                        valorEmAberto = 0;

                    dr["VALOR_EM_ABERTO"] = valorEmAberto;
                }

                return ClientesInadimplentes(dt, rowCount, ID_EMPRESA);
            }
        }

        public static decimal Limite_Excedido_Cliente(decimal CODIGO_CLIENTE)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var pedidosEmAberto = (from linha in ctx.TB_PEDIDO_VENDAs

                                       where linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == CODIGO_CLIENTE
                                       && !new List<decimal?>() { 2, 3, 4 }.Contains(linha.TB_STATUS_PEDIDO.STATUS_ESPECIFICO)

                                       select linha.VALOR_TOTAL_ITEM_PEDIDO).Sum();

                var X = pedidosEmAberto;

                decimal valorEmAberto = 0;

                if (pedidosEmAberto.HasValue)
                {
                    valorEmAberto += pedidosEmAberto.Value;
                }

                return valorEmAberto;
            }
        }

        public static decimal Limite_Excedido_Cliente(decimal CODIGO_CLIENTE, DataContext ctx)
        {
            var pedidosEmAberto = (from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                                   orderby linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO
                                   where linha.TB_ITEM_ORCAMENTO_VENDA.TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO == CODIGO_CLIENTE
                                   && linha.STATUS_ITEM_PEDIDO != 4
                                   select linha.VALOR_TOTAL_ITEM_PEDIDO).Sum();

            decimal valorEmAberto = 0;

            if (pedidosEmAberto.HasValue)
            {
                valorEmAberto += (decimal)pedidosEmAberto;
            }

            return valorEmAberto;
        }

        private string ClientesInadimplentes(DataTable dt, int rowCount, decimal ID_EMPRESA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                dt.Columns.Add("TOTAL_VENCIDO", typeof(decimal));
                dt.Columns.Add("CONTATOS", typeof(string));

                foreach (DataRow dr in dt.Rows)
                {
                    dr["TOTAL_VENCIDO"] = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, Convert.ToDecimal(dr["CODIGO_CLIENTE"]), ID_EMPRESA);
                }
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
            {
                foreach (DataRow dr in dt.Rows)
                {
                    var query = from linha in ctx1.TB_CLIENTE_CONTATOs
                                where linha.ID_CLIENTE == Convert.ToDecimal(dr["CODIGO_CLIENTE"])
                                select linha;

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

                    dr["CONTATOS"] = retorno;
                }
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

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}
