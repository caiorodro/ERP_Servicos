using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using Doran_Servicos_ORM;
using Doran_Base.Auditoria;
using System.Data.Linq;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Gera_Pedido_Venda : IDisposable
    {
        private decimal NUMERO_ORCAMENTO { get; set; }
        private decimal NUMERO_PEDIDO { get; set; }
        private DataTable dtAnalise { get; set; }
        private bool AplicarRestricao { get; set; }
        private decimal ID_EMPRESA { get; set; }
        private decimal ID_USUARIO { get; set; }
        private string NOME_FANTASIA_EMITENTE { get; set; }
        private decimal GERENTE_COMERCIAL {get;set;}
        
        public Doran_Gera_Pedido_Venda(decimal _NUMERO_ORCAMENTO, string _NOME_FANTASIA_EMITENTE, decimal _ID_EMPRESA, decimal _ID_USUARIO, 
            decimal _GERENTE_COMERCIAL)
        {
            NUMERO_ORCAMENTO = _NUMERO_ORCAMENTO;
            ID_EMPRESA = _ID_EMPRESA;
            ID_USUARIO = _ID_USUARIO;
            NOME_FANTASIA_EMITENTE = _NOME_FANTASIA_EMITENTE;
            GERENTE_COMERCIAL = _GERENTE_COMERCIAL;

            Analisa_Configuracoes(ID_EMPRESA);
        }

        public List<object> Gera_Pedido(decimal JA_FATURAR, List<decimal> CICLISTAS)
        {
            string str_conn = ConfigurationManager.ConnectionStrings["Doran_Servicos_ORM.Properties.Settings.Doran_ERP_ServicosConnectionString"].ConnectionString;

            decimal NUMERO_SERVICO = 0;

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                try
                {
                    ctx.Connection.Open();
                    ctx.Transaction = ctx.Connection.BeginTransaction(IsolationLevel.ReadUncommitted);

                    NUMERO_PEDIDO = Busca_Numero_Pedido_Venda(str_conn);

                    var _query = from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                 where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                 && linha.NAO_GERAR_PEDIDO == 0
                                 && linha.NUMERO_PEDIDO_VENDA == 0
                                 select linha;

                    if (!_query.Any())
                        throw new Exception("Selecione um or&ccedil;amento para gerar o servi&ccedil;o");

                    if (_query.Count(m => m.PRECO_PRODUTO <= (decimal)0.0000) > 0)
                        throw new Exception("H&aacute; itens com pre&ccedil;o de venda zerado. Acerte os pre&ccedil;os de venda e gere o servi&ccedil;o novamente");

                    if (_query.First().TB_ORCAMENTO_VENDA.TB_CLIENTE == null)
                        throw new Exception("O or&ccedil;amento est&aacute;sem cliente definido");

                    if (!(from linha in ctx.TB_CLIENTEs
                          where linha.ID_CLIENTE == _query.First().TB_ORCAMENTO_VENDA.CODIGO_CLIENTE_ORCAMENTO
                          select linha).Any())
                    {
                        throw new Exception("O cliente definido neste or&ccedil;amento n&atilde;o foi encontrado no cadastro de clientes");
                    }

                    // Condição de Pagamento 

                    if (GERENTE_COMERCIAL == 0)
                    {
                        var CONDICAO_PAGAMENTO = from linha in ctx.TB_COND_PAGTOs
                                                 where linha.CODIGO_CP == _query.First().TB_ORCAMENTO_VENDA.CODIGO_COND_PAGTO
                                                 select linha;

                        int MEDIA_DIAS = 0;
                        int NUMERO_PARCELAS = 0;

                        foreach (var item in CONDICAO_PAGAMENTO)
                        {
                            NUMERO_PARCELAS = (int)item.QTDE_PARCELAS_CP;

                            MEDIA_DIAS = ((int)item.DIAS_PARCELA1_CP +
                                (int)item.DIAS_PARCELA2_CP +
                                (int)item.DIAS_PARCELA3_CP +
                                (int)item.DIAS_PARCELA4_CP +
                                (int)item.DIAS_PARCELA5_CP +
                                (int)item.DIAS_PARCELA6_CP +
                                (int)item.DIAS_PARCELA7_CP +
                                (int)item.DIAS_PARCELA8_CP +
                                (int)item.DIAS_PARCELA9_CP +
                                (int)item.DIAS_PARCELA10_CP) / (int)item.QTDE_PARCELAS_CP;
                        }

                        if (_query.Sum(m => m.VALOR_TOTAL) < 300)
                        {
                            throw new Exception("Faturamento m&iacute;nimo n&atilde;o foi atingido.<br />Pe&ccedil;a para o seu gerente liberar o pedido");
                        }

                        if (_query.Sum(m => m.VALOR_TOTAL) >= 300 && _query.Sum(m => m.VALOR_TOTAL) < 2000 && MEDIA_DIAS > 45)
                        {
                            throw new Exception("Faturamento m&iacute;nimo n&atilde;o foi atingido nesta cond. de pagamento.<br />Pe&ccedil;a para o seu gerente liberar o pedido");
                        }
                    }

                    int i = 0;

                    foreach (var item in _query)
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_PEDIDO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_PEDIDO_VENDA>();

                        Doran_Servicos_ORM.TB_PEDIDO_VENDA novo = new Doran_Servicos_ORM.TB_PEDIDO_VENDA();

                        NUMERO_SERVICO = NUMERO_PEDIDO;

                        novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                        novo.NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
                        novo.NUMERO_ITEM_ORCAMENTO = item.NUMERO_ITEM;
                        novo.ID_PRODUTO_PEDIDO = item.ID_PRODUTO;
                        novo.DATA_PEDIDO = DateTime.Now;
                        novo.ENTREGA_PEDIDO = item.DATA_ENTREGA < DateTime.Today ? DateTime.Today : item.DATA_ENTREGA;
                        novo.CODIGO_PRODUTO_PEDIDO = item.CODIGO_PRODUTO;
                        novo.QTDE_PRODUTO_ITEM_PEDIDO = item.QTDE_PRODUTO;
                        novo.QTDE_A_FATURAR = item.QTDE_PRODUTO;

                        if (item.TIPO_DESCONTO == 0)
                        {
                            novo.PRECO_ITEM_PEDIDO = item.PRECO_PRODUTO * (1 - (item.VALOR_DESCONTO / 100));
                        }
                        else
                        {
                            novo.PRECO_ITEM_PEDIDO = item.PRECO_PRODUTO - item.VALOR_DESCONTO;
                        }

                        novo.UNIDADE_ITEM_PEDIDO = item.UNIDADE_PRODUTO;
                        novo.VALOR_TOTAL_ITEM_PEDIDO = item.VALOR_TOTAL;
                        novo.ALIQ_ISS_ITEM_PEDIDO = item.ALIQ_ISS;
                        novo.TIPO_DESCONTO_ITEM_PEDIDO = item.TIPO_DESCONTO;
                        novo.VALOR_DESCONTO_ITEM_PEDIDO = 0;

                        if (item.PROGRAMACAO_ITEM_ORCAMENTO == 1)
                            novo.STATUS_ITEM_PEDIDO = Busca_Status_Programacao(); // Pedido em Análise
                        else
                            novo.STATUS_ITEM_PEDIDO = JA_FATURAR == 1 ? 
                                Busca_Status_Liberado_Faturar() :
                                Busca_Status_em_Analise();

                        novo.ITEM_A_FATURAR = 0; // Nao
                        novo.PROGRAMACAO_ITEM_PEDIDO = item.PROGRAMACAO_ITEM_ORCAMENTO;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO,
                            ID_USUARIO);

                        ctx.SubmitChanges();

                        ///

                        item.NUMERO_PEDIDO_VENDA = NUMERO_PEDIDO;

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                            ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);

                        GravaCustos(i, item.NUMERO_ITEM, ctx);

                        ctx.SubmitChanges();

                        i++;
                    }

                    ////////////

                    var query2 = (from linha in ctx.TB_PEDIDO_VENDAs
                                  where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                  select new { linha.NUMERO_ITEM }).ToList().First();

                    var query1 = (from linha in ctx.TB_ORCAMENTO_VENDAs
                                  where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                  select new
                                  {
                                      linha.OBS_NF_ORCAMENTO
                                  }).ToList();

                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO> Entidade1 = ctx.GetTable<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO>();

                    Doran_Servicos_ORM.TB_DADOS_FATURAMENTO novo1 = new Doran_Servicos_ORM.TB_DADOS_FATURAMENTO();

                    novo1.NUMERO_PEDIDO = NUMERO_PEDIDO;
                    novo1.NUMERO_ITEM_PEDIDO = query2.NUMERO_ITEM;
                    novo1.NUMERACAO = "";
                    novo1.ESPECIE = "";
                    novo1.MARCA = NOME_FANTASIA_EMITENTE;
                    novo1.QTDE_NF = 0;
                    novo1.NUMERO_PEDIDO_CLIENTE = "";
                    novo1.OBS_NF = query1.First().OBS_NF_ORCAMENTO;

                    Entidade1.InsertOnSubmit(novo1);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo1, Entidade1.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                    ctx.SubmitChanges();

                    Doran_Analise_Pedido_Venda analise = new Doran_Analise_Pedido_Venda(NUMERO_PEDIDO, ID_EMPRESA, ctx);

                    DataTable dt = analise.Aplica_Analise(ctx, ID_EMPRESA);

                    foreach (DataRow item in dt.Rows)
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO>();

                        Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO novo = new TB_FOLLOW_UP_PEDIDO();

                        novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                        novo.DATA_HORA_FOLLOW_UP = DateTime.Now;
                        novo.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                        novo.TEXTO_FOLLOW_UP = string.Concat("[", item["CRITERIO"].ToString(), "] - ",
                            item["MOTIVO"].ToString());

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                    }

                    ctx.SubmitChanges();

                    var query3 = (from linha in ctx.TB_PEDIDO_VENDAs
                                  where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                                  select new
                                  {
                                      linha.NUMERO_PEDIDO,
                                      linha.NUMERO_ITEM
                                  }).ToList();

                    for (int N = 0; N < CICLISTAS.Count; N++)
                    {
                        foreach (var item1 in query3)
                        {
                            System.Data.Linq.Table<Doran_Servicos_ORM.TB_SERVICO_CICLISTA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_SERVICO_CICLISTA>();

                            Doran_Servicos_ORM.TB_SERVICO_CICLISTA novo = new Doran_Servicos_ORM.TB_SERVICO_CICLISTA();

                            novo.NUMERO_PEDIDO_VENDA = item1.NUMERO_PEDIDO;
                            novo.NUMERO_ITEM_VENDA = item1.NUMERO_ITEM;
                            novo.ID_CICLISTA = CICLISTAS[N];

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, "TB_SERVICO_CICLISTA", ID_USUARIO);
                        }

                        ctx.SubmitChanges();
                    }

                    ctx.Transaction.Commit();
                }
                catch
                {
                    ctx.Transaction.Rollback();
                    throw;
                }
            }

            return Status_Orcamento();
        }

        private void GravaCustos(int i, decimal NUMERO_ITEM_ORCAMENTO, DataContext ctx)
        {
            var item = (from linha in ctx.GetTable<TB_PEDIDO_VENDA>()
                        orderby linha.NUMERO_PEDIDO, linha.NUMERO_ITEM
                        where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                        select linha).ToList().Skip(i).First();

            var query = (from linha in ctx.GetTable<TB_CUSTO_ITEM_ORCAMENTO_VENDA>()
                         orderby linha.NUMERO_ORCAMENTO, linha.NUMERO_ITEM_ORCAMENTO
                         where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                         && linha.NUMERO_ITEM_ORCAMENTO == NUMERO_ITEM_ORCAMENTO
                         select linha).ToList();

            foreach (var item1 in query)
            {
                System.Data.Linq.Table<Doran_Servicos_ORM.TB_CUSTO_ITEM_PEDIDO_VENDA> Entidade = ctx.GetTable<Doran_Servicos_ORM.TB_CUSTO_ITEM_PEDIDO_VENDA>();

                Doran_Servicos_ORM.TB_CUSTO_ITEM_PEDIDO_VENDA novo = new Doran_Servicos_ORM.TB_CUSTO_ITEM_PEDIDO_VENDA();

                novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                novo.NUMERO_ITEM_PEDIDO = item.NUMERO_ITEM;
                novo.NUMERO_CUSTO_VENDA = item1.NUMERO_CUSTO_VENDA;
                novo.CUSTO_ITEM_PEDIDO = item1.CUSTO_ITEM_ORCAMENTO;
                novo.PREVISAO_ENTREGA = item1.PREVISAO_ENTREGA;
                novo.OBS_CUSTO_VENDA = string.IsNullOrEmpty(item1.OBS_CUSTO_VENDA) ? "" : item1.OBS_CUSTO_VENDA;
                novo.CODIGO_FORNECEDOR = item1.CODIGO_FORNECEDOR;

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);
            }

            ctx.SubmitChanges();
        }

        private decimal Busca_Numero_Pedido_Venda(string StringDeConexao)
        {
            using (SqlConnection cnn = new SqlConnection(StringDeConexao))
            {
                decimal retorno = 0;

                cnn.Open();

                SqlTransaction tr = cnn.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                try
                {
                    string cmd = "SELECT COUNT(*) FROM TB_SERIAL_PEDIDO_VENDA";

                    SqlCommand command = new SqlCommand(cmd, cnn);
                    command.Transaction = tr;

                    if ((int)command.ExecuteScalar() == 0)
                    {
                        cmd = "INSERT INTO TB_SERIAL_PEDIDO_VENDA VALUES(1, 1)";
                        command.CommandText = cmd;
                        command.ExecuteNonQuery();

                        tr.Commit();

                        retorno = 1;
                    }
                    else
                    {
                        cmd = "UPDATE TB_SERIAL_PEDIDO_VENDA SET ULTIMO_PEDIDO_VENDA = (ULTIMO_PEDIDO_VENDA + 1) WHERE SERIAL_PEDIDO_VENDA = 1";
                        command.CommandText = cmd;
                        command.ExecuteNonQuery();

                        cmd = "SELECT * FROM TB_SERIAL_PEDIDO_VENDA WHERE SERIAL_PEDIDO_VENDA = 1";
                        command.CommandText = cmd;

                        SqlDataAdapter adapter = new SqlDataAdapter();
                        adapter.SelectCommand = command;

                        DataTable dt = new DataTable();
                        adapter.Fill(dt);

                        retorno = (decimal)dt.Rows[0]["ULTIMO_PEDIDO_VENDA"];

                        tr.Commit();
                    }
                }
                catch (Exception ex)
                {
                    tr.Rollback();
                    throw ex;
                }

                return retorno;
            }
        }

        private decimal Busca_Status_Programacao()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var status = (from linha in ctx.TB_STATUS_PEDIDOs
                              where linha.STATUS_ESPECIFICO == 6
                              select linha.CODIGO_STATUS_PEDIDO).ToList();

                decimal retorno = 1;

                foreach (var item in status)
                {
                    retorno = item;
                }

                return retorno;
            }
        }

        private decimal Busca_Status_em_Analise()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var status = (from linha in ctx.TB_STATUS_PEDIDOs
                              where linha.STATUS_ESPECIFICO == 1
                              select linha.CODIGO_STATUS_PEDIDO).ToList();

                decimal retorno = 1;

                foreach (var item in status)
                {
                    retorno = item;
                }

                return retorno;
            }
        }

        private decimal Busca_Status_Liberado_Faturar()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var status = (from linha in ctx.TB_STATUS_PEDIDOs
                              where linha.STATUS_ESPECIFICO == 5
                              select linha.CODIGO_STATUS_PEDIDO).ToList();

                decimal retorno = 1;

                foreach (var item in status)
                {
                    retorno = item;
                }

                return retorno;
            }
        }

        private List<object> Status_Orcamento()
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             && linha.NUMERO_PEDIDO_VENDA == 0
                             select linha).Count();

                var TOTAL_PENDENTE = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                                      where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                                      && linha.NUMERO_PEDIDO_VENDA == 0
                                      select linha).Sum(p => p.VALOR_TOTAL);

                if (!TOTAL_PENDENTE.HasValue)
                    TOTAL_PENDENTE = 0;

                List<object> retorno = new List<object>();

                if (query > 0)
                {
                    retorno.Add("<span style='background-color: #6600FF; font-size: 10pt; color: #FFFFFF;'>Servi&ccedil;o Fechado<br />(Parcial)</span>");
                }
                else
                {
                    retorno.Add("<span style='background-color: #0000FF; font-size: 10pt; color: #FFFFFF;'>Servi&ccedil;o Fechado<br />(Total)</span>");
                }

                retorno.Add(TOTAL_PENDENTE);

                return retorno;
            }
        }

        private void Analisa_Configuracoes(decimal ID_EMPRESA)
        {
            if (GERENTE_COMERCIAL == 0)
                throw new Exception("N&atilde;o &eacute; poss&iacute;vel gerar o pedido. Pe&ccedil;a para o seu supervisor gerar o pedido");

            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var nao_gerar_pedido = (from linha in ctx.TB_CONFIG_VENDAs
                                        where linha.ID_CONFIGURACAO_VENDAS == 1
                                        select linha).ToList().First().NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO;

                if (!nao_gerar_pedido.HasValue)
                    nao_gerar_pedido = 0;

                using (Doran_Analise_Orcamento analise = new Doran_Analise_Orcamento(NUMERO_ORCAMENTO, ID_EMPRESA))
                {
                    analise.Aplica_Analise(ID_EMPRESA);
                    dtAnalise = analise.dtAnalise;

                    if (dtAnalise.Select("CRITERIO = 'Limite Excedido'").Count() > 0)
                        throw new Exception("O limite de cr&eacute;dito do cliente excedido. N&atilde;o &eacute; poss&iacute;vel gerar o pedido");
                }

                if (nao_gerar_pedido == 0)
                    AplicarRestricao = false;
                else
                {
                    decimal ADMINISTRADOR = 0;

                    var query = (from linha in ctx.TB_USUARIOs
                                 where linha.ID_USUARIO == ID_USUARIO
                                 select linha).ToList();

                    foreach (var item in query)
                    {
                        ADMINISTRADOR = (decimal)item.ADMIN_USUARIO;
                    }

                    if (ADMINISTRADOR == 0 && GERENTE_COMERCIAL == 0) // O usuário é vendedor
                    {
                        if (dtAnalise.Rows.Count > 0)
                            throw new Exception("N&atilde;o &eacute; poss&iacute;vel gerar o pedido. H&aacute; restri&ccedil;&otilde;es no or&ccedil;amento");
                    }
                }
            }
        }

        public List<object> Gera_Pedido_Antigo(decimal ID_EMPRESA)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                NUMERO_PEDIDO = Busca_Numero_Pedido_Venda(ctx.Connection.ConnectionString);

                var query = (from linha in ctx.TB_ITEM_ORCAMENTO_VENDAs
                             where linha.NUMERO_ORCAMENTO == NUMERO_ORCAMENTO
                             && linha.NAO_GERAR_PEDIDO == 0
                             && linha.NUMERO_PEDIDO_VENDA == 0
                             select linha).ToList();

                var entrega_atrasada = query.Where(s => s.DATA_ENTREGA < DateTime.Today);

                if (entrega_atrasada.Count() > 0)
                    throw new Exception("H&aacute; itens com data de entrega atrasada. Acerte as datas de entrega e gere o pedido novamente");

                int itens_com_margem_abaixo = query.Count(m => m.ITEM_APROVADO == 1);

                if (itens_com_margem_abaixo > 0)
                    throw new Exception("H&aacute; itens com margem de venda abaixo do permitido. <br />N&atilde;o &eacute; poss&iacute;vel imprimir o o&ccedil;amento");

                int i = 0;

                foreach (var item in query)
                {
                    using (Doran_ERP_Servicos_DadosDataContext ctx1 = new Doran_ERP_Servicos_DadosDataContext())
                    {
                        System.Data.Linq.Table<Doran_Servicos_ORM.TB_PEDIDO_VENDA> Entidade = ctx1.GetTable<Doran_Servicos_ORM.TB_PEDIDO_VENDA>();

                        Doran_Servicos_ORM.TB_PEDIDO_VENDA novo = new Doran_Servicos_ORM.TB_PEDIDO_VENDA();

                        novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                        novo.NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
                        novo.NUMERO_ITEM_ORCAMENTO = item.NUMERO_ITEM;
                        novo.ID_PRODUTO_PEDIDO = item.ID_PRODUTO;
                        novo.DATA_PEDIDO = DateTime.Today;
                        novo.ENTREGA_PEDIDO = item.DATA_ENTREGA;
                        novo.CODIGO_PRODUTO_PEDIDO = item.CODIGO_PRODUTO;
                        novo.QTDE_PRODUTO_ITEM_PEDIDO = item.QTDE_PRODUTO;
                        novo.QTDE_A_FATURAR = item.QTDE_PRODUTO;
                        novo.PRECO_ITEM_PEDIDO = item.PRECO_PRODUTO;
                        novo.UNIDADE_ITEM_PEDIDO = item.UNIDADE_PRODUTO;
                        novo.VALOR_TOTAL_ITEM_PEDIDO = item.VALOR_TOTAL;
                        novo.TIPO_DESCONTO_ITEM_PEDIDO = item.TIPO_DESCONTO;
                        novo.VALOR_DESCONTO_ITEM_PEDIDO = item.VALOR_DESCONTO;

                        novo.OBS_ITEM_PEDIDO = item.OBS_ITEM_ORCAMENTO;

                        if (item.PROGRAMACAO_ITEM_ORCAMENTO == 1)
                            novo.STATUS_ITEM_PEDIDO = Busca_Status_Programacao(); // Pedido em Análise
                        else
                            novo.STATUS_ITEM_PEDIDO = 4;

                        novo.ITEM_A_FATURAR = 0; // Nao
                        novo.PROGRAMACAO_ITEM_PEDIDO = item.PROGRAMACAO_ITEM_ORCAMENTO;

                        Entidade.InsertOnSubmit(novo);

                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx1, novo, Entidade.ToString(), NUMERO_PEDIDO,
                            ID_USUARIO);

                        ctx1.SubmitChanges();
                    }

                    item.NUMERO_PEDIDO_VENDA = NUMERO_PEDIDO;

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Update(ctx, ctx.TB_ITEM_ORCAMENTO_VENDAs.GetModifiedMembers(item),
                        ctx.TB_ITEM_ORCAMENTO_VENDAs.ToString(), ID_USUARIO);

                    //GravaCustos(i, item.NUMERO_ITEM);

                    i++;
                }

                ctx.SubmitChanges();
            }

            using (Doran_ERP_Servicos_DadosDataContext ctx3 = new Doran_ERP_Servicos_DadosDataContext())
            {
                var query = (from linha in ctx3.TB_PEDIDO_VENDAs
                             where linha.NUMERO_PEDIDO == NUMERO_PEDIDO
                             select new { linha.NUMERO_ITEM }).ToList().First();

                string PLACA = "";

                System.Data.Linq.Table<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO> Entidade1 = ctx3.GetTable<Doran_Servicos_ORM.TB_DADOS_FATURAMENTO>();

                Doran_Servicos_ORM.TB_DADOS_FATURAMENTO novo1 = new Doran_Servicos_ORM.TB_DADOS_FATURAMENTO();

                novo1.NUMERO_PEDIDO = NUMERO_PEDIDO;
                novo1.NUMERO_ITEM_PEDIDO = query.NUMERO_ITEM;
                novo1.PLACA_VEICULO = PLACA;
                novo1.NUMERACAO = "";
                novo1.ESPECIE = "CAIXAS";
                novo1.MARCA = NOME_FANTASIA_EMITENTE;
                novo1.QTDE_NF = 0;
                novo1.NUMERO_PEDIDO_CLIENTE = "";
                novo1.OBS_NF = "";

                Entidade1.InsertOnSubmit(novo1);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx3, novo1, Entidade1.ToString(), NUMERO_PEDIDO, ID_USUARIO);

                ctx3.SubmitChanges();
            }

            Doran_Analise_Pedido_Venda analise = new Doran_Analise_Pedido_Venda(NUMERO_PEDIDO, ID_EMPRESA);

            DataTable dt = analise.Aplica_Analise(ID_EMPRESA);

            analise.Dispose();

            using (Doran_ERP_Servicos_DadosDataContext ctx2 = new Doran_ERP_Servicos_DadosDataContext())
            {
                foreach (DataRow item in dt.Rows)
                {
                    System.Data.Linq.Table<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO> Entidade = ctx2.GetTable<Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO>();

                    Doran_Servicos_ORM.TB_FOLLOW_UP_PEDIDO novo = new TB_FOLLOW_UP_PEDIDO();

                    novo.NUMERO_PEDIDO = NUMERO_PEDIDO;
                    novo.DATA_HORA_FOLLOW_UP = DateTime.Now;
                    novo.ID_USUARIO_FOLLOW_UP = ID_USUARIO;
                    novo.TEXTO_FOLLOW_UP = string.Concat("[", item["CRITERIO"].ToString(), "] - ",
                        item["MOTIVO"].ToString());

                    Entidade.InsertOnSubmit(novo);

                    Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert_PEDIDO_VENDA(ctx2, novo, Entidade.ToString(), NUMERO_PEDIDO, ID_USUARIO);
                }

                ctx2.SubmitChanges();
            }

            return Status_Orcamento();
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}