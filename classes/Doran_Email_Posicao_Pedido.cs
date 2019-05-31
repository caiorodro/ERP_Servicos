using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Threading;
using Doran_Servicos_ORM;
using System.Data;
using Doran_Base;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Email_Posicao_Pedido : IDisposable
    {
        public decimal NUMERO_PEDIDO { get; set; }
        public string CLIENTE { get; set; }
        public string CODIGO_PRODUTO { get; set; }
        public string HISTORICO { get; set; }
        public List<string> DESTINATARIOS { get; set; }
        public decimal ID_CONTA_EMAIL { get; set; }
        public string FROM_ADDRESS { get; set; }
        public decimal _ID_USUARIO { get; set; }

        public delegate void AsyncMethodCaller();

        public Doran_Email_Posicao_Pedido(decimal ID_USUARIO)
        {
            DESTINATARIOS = new List<string>();

            _ID_USUARIO = ID_USUARIO;
        }

        public void Envia_Email_Posicao_Pedido()
        {
            AsyncMethodCaller caller = new AsyncMethodCaller(Envia_Email);

            IAsyncResult result = caller.BeginInvoke(null, null);
        }

        private void Envia_Email()
        {
            using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(_ID_USUARIO, ID_CONTA_EMAIL))
            {
                Dictionary<string, object> dados = new Dictionary<string, object>();

                dados.Add("ID_MESSAGE", 0);
                dados.Add("ID_CONTA_EMAIL", ID_CONTA_EMAIL);
                dados.Add("FROM_ADDRESS", FROM_ADDRESS);
                dados.Add("PRIORITY", 1);
                dados.Add("SUBJECT", CODIGO_PRODUTO.Trim().Length > 0 ?
                    string.Concat("Nova Posição do Pedido ", NUMERO_PEDIDO.ToString(), " - Cliente: ", CLIENTE, " - Produto: ", CODIGO_PRODUTO) :
                    string.Concat("Nova Posição do Pedido ", NUMERO_PEDIDO.ToString(), " - Cliente: ", CLIENTE));

                dados.Add("BODY", HISTORICO);
                dados.Add("RAW_BODY", HISTORICO);
                dados.Add("NUMERO_CRM", 0);

                List<string> TOs = new List<string>();
                TOs.Add(DESTINATARIOS[0]);

                List<string> CCs = new List<string>();

                for (int i = 1; i < DESTINATARIOS.Count; i++)
                {
                    CCs.Add(DESTINATARIOS[i]);
                }

                List<string> BCCs = new List<string>();
                List<string> Attachments = new List<string>();

                decimal ID_MESSAGE = mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);

                mail.Envia_Email_que_estava_gravado_como_rascunho(ID_MESSAGE);
            }
        }

        public string Busca_Usuarios_Pedido(decimal NUMERO_PEDIDO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var _USUARIOS = from linha in ctx.TB_USUARIOs
                                where linha.USUARIO_ATIVO == 1
                                orderby linha.LOGIN_USUARIO
                                select new
                                {
                                    NOME_VENDEDOR = linha.NOME_USUARIO,
                                    EMAIL_VENDEDOR = linha.EMAIL_USUARIO
                                };

                return ApoioXML.objQueryToXML(ctx, _USUARIOS);
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }

    public class EMAILS_POSICAO_PEDIDO
    {
        public EMAILS_POSICAO_PEDIDO()
        {

        }

        public string NOME_VENDEDOR { get; set; }
        public string EMAIL_VENDEDOR { get; set; }
        public decimal SUPERVISOR_LIDER { get; set; }
    }
}
