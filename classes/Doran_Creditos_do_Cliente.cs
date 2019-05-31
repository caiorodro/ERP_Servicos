using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.Globalization;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Creditos_do_Cliente
    {
        public static Dictionary<string, string> Creditos_do_Cliente(decimal CODIGO_CLIENTE, string DataInicial, string DataFinal, decimal ID_EMPRESA)
        {
            DateTime dt1 = Convert.ToDateTime(DataInicial);
            DateTime dt2 = Convert.ToDateTime(DataFinal);

            dt2 = dt2.AddDays(1);

            Dictionary<string, string> retorno = new Dictionary<string, string>();

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var faturamento = (from linha in ctx.TB_NOTA_SAIDAs
                                   where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                   && (linha.DATA_EMISSAO_NF >= dt1
                                   && linha.DATA_EMISSAO_NF < dt2)
                                   && (linha.STATUS_NF == 2 || linha.STATUS_NF == 4)

                                   select linha).Sum(fat => fat.TOTAL_NF);

                if (faturamento.HasValue)
                    retorno.Add("Faturamento", ((decimal)faturamento).ToString("c", CultureInfo.CurrentCulture));
                else
                    retorno.Add("Faturamento", 0.ToString("c", CultureInfo.CurrentCulture));

                DateTime amanha = DateTime.Today;
                amanha = amanha.AddDays(1);

                var aReceber = (from linha in ctx.TB_FINANCEIROs
                                where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                && linha.DATA_VENCIMENTO >= amanha
                                && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.CREDITO_DEBITO == 0

                                select linha).Sum(ar => ar.VALOR_TOTAL);

                if (aReceber.HasValue)
                    retorno.Add("aReceber", ((decimal)aReceber).ToString("c", CultureInfo.CurrentCulture));
                else
                    retorno.Add("aReceber", 0.ToString("c", CultureInfo.CurrentCulture));


                var Recebido = (from linha in ctx.TB_FINANCEIROs
                                where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                && (linha.DATA_PAGAMENTO >= dt1
                                && linha.DATA_PAGAMENTO < dt2)
                                && linha.CREDITO_DEBITO == 0

                                select linha).Sum(pa => pa.VALOR_TOTAL);

                if (Recebido.HasValue)
                    retorno.Add("Recebido", ((decimal)Recebido).ToString("c", CultureInfo.CurrentCulture));
                else
                    retorno.Add("Recebido", 0.ToString("c", CultureInfo.CurrentCulture));

                decimal Inadimplente = Doran_TitulosVencidos.TotalVencidos(Vencidos.RECEBER, CODIGO_CLIENTE, ID_EMPRESA);

                if (Inadimplente > (decimal)0.00)
                    retorno.Add("Inadimplente", "<span style='color: red;'>" + Inadimplente.ToString("c", CultureInfo.CurrentCulture) + "</span>");
                else
                    retorno.Add("Inadimplente", "<span>" + Inadimplente.ToString("c", CultureInfo.CurrentCulture) + "</span>");

                var limiteCliente = (from linha in ctx.TB_CLIENTEs
                                     where linha.ID_CLIENTE == CODIGO_CLIENTE
                                     select new
                                     {
                                         linha.TB_LIMITE.VALOR_LIMITE
                                     }).ToList();

                decimal _limiteCliente = 0;

                foreach (var item in limiteCliente)
                    _limiteCliente = (decimal)item.VALOR_LIMITE;

                var EmAberto = (from linha in ctx.TB_FINANCEIROs
                                where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                && linha.DATA_PAGAMENTO == new DateTime(1901, 01, 01)
                                && linha.CREDITO_DEBITO == 0

                                select linha).Sum(ab => ab.VALOR_TOTAL);

                if (EmAberto > _limiteCliente)
                    EmAberto = EmAberto - _limiteCliente;
                else
                    EmAberto = 0;

                EmAberto += Doran_Limite_Credito_Cliente.Limite_Excedido_Cliente(CODIGO_CLIENTE);

                if (EmAberto > (decimal)0.00)
                    retorno.Add("Excedido", "<span style='color: red;'>" + ((decimal)EmAberto).ToString("c", CultureInfo.CurrentCulture) + "</span>");
                else
                    retorno.Add("Excedido", ((decimal)EmAberto).ToString("c", CultureInfo.CurrentCulture));

                var Abatimentos = (from linha in ctx.GetTable<TB_SALDO_CLIENTE_FORNECEDOR>()
                                   orderby linha.CODIGO_CLIENTE, linha.SALDO_RESTANTE

                                   where linha.CODIGO_CLIENTE == CODIGO_CLIENTE
                                   && linha.SALDO_RESTANTE > (decimal)0.00

                                   select linha).Sum(a => a.SALDO_RESTANTE);

                if (Abatimentos.HasValue)
                    retorno.Add("Abatimentos", "<span style='color: navy;'>" + ((decimal)Abatimentos).ToString("c", CultureInfo.CurrentCulture) + "</span>");
                else
                    retorno.Add("Abatimentos", ((decimal)0.00).ToString("c", CultureInfo.CurrentCulture));

                // Data e Valor da Ultima Compra

                var ultimaCompra = (from linha in ctx.TB_NOTA_SAIDAs
                                    orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF descending
                                    where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                    && linha.STATUS_NF == 4
                                    select new { linha.DATA_EMISSAO_NF, linha.TOTAL_SERVICOS_NF }).Take(1).ToList();

                if (ultimaCompra.Any())
                {
                    foreach (var item in ultimaCompra)
                    {
                        retorno.Add("data_ultima_compra", ApoioXML.TrataData2(item.DATA_EMISSAO_NF));
                        retorno.Add("valor_ultima_compra", ((decimal)item.TOTAL_SERVICOS_NF).ToString("c"));
                    }
                }
                else
                {
                    retorno.Add("data_ultima_compra", "");
                    retorno.Add("valor_ultima_compra", ((decimal)0.00).ToString("c"));
                }

                // Maior compra

                var maiorCompra = (from linha in ctx.TB_NOTA_SAIDAs
                                   orderby linha.CODIGO_CLIENTE_NF, linha.DATA_EMISSAO_NF
                                   where linha.CODIGO_CLIENTE_NF == CODIGO_CLIENTE
                                   && linha.STATUS_NF == 4
                                   select linha).Max(m => m.TOTAL_SERVICOS_NF);

                retorno.Add("maior_compra", maiorCompra.HasValue ? ((decimal)maiorCompra).ToString("c") : ((decimal)0.00).ToString("c"));

                return retorno;
            }
        }
    }
}