using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Doran_Servicos_ORM;
using System.Configuration;
using System.IO;
using System.Net.Mail;
using Doran_ERP_Servicos_Email;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_EMAIL
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_EMAIL : System.Web.Services.WebService
    {
        [WebMethod()]
        public void Grava_Nota_Conta_Email(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Conta c = new Doran_ERP_Servicos_Email.Th2_Email_Conta(Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"])))
                {
                    c.Grava_Nota_Conta_Email(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Atualiza_Conta_Email(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Conta c = new Doran_ERP_Servicos_Email.Th2_Email_Conta(Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"])))
                {
                    c.Atualiza_Conta_Email(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_Conta_Email(decimal ID_CONTA_EMAIL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Conta c = new Doran_ERP_Servicos_Email.Th2_Email_Conta(ID_USUARIO))
                {
                    c.Deleta_Conta_Email(ID_CONTA_EMAIL);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Conta_Email(decimal ID_USUARIO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Conta c = new Doran_ERP_Servicos_Email.Th2_Email_Conta(ID_USUARIO))
                {
                    return c.Lista_Conta_Email();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Conta_Email(decimal ID_USUARIO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Conta c = new Doran_ERP_Servicos_Email.Th2_Email_Conta(ID_USUARIO))
                {
                    return c.Carrega_Conta_Email();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Recebe_Mensagens(decimal ID_USUARIO, string EMAIL, string SENHA,
            string SERVIDOR_POP, int PORTA, decimal SSL, int NUMERO_MENSAGEM)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail._ID_USUARIO = ID_USUARIO;
                    mail._HOST = SERVIDOR_POP;
                    mail._EMAIL = EMAIL;
                    mail._SENHA = SENHA;
                    mail._PORTA = PORTA;
                    mail._SSL = SSL == 1 ? true : false;

                    return mail.Recebe_e_Grava_Email(NUMERO_MENSAGEM);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public int VerificaNovasMensagens(decimal ID_USUARIO, string EMAIL, string SENHA,
            string SERVIDOR_POP, int PORTA, decimal SSL)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail._ID_USUARIO = ID_USUARIO;
                    mail._HOST = SERVIDOR_POP;
                    mail._EMAIL = EMAIL;
                    mail._SENHA = SENHA;
                    mail._PORTA = PORTA;
                    mail._SSL = SSL == 1 ? true : false;

                    return mail.VerificaNovasMensagens();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Emails(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_Emails(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Emails_por_Destinatarios(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_Emails_por_Destinatarios(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Emails_por_Destinatarios_Copia(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_Emails_por_Destinatarios_Copia(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Emails_por_Destinatarios_Copia_Oculta(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_Emails_por_Destinatarios_Copia_Oculta(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_email_lido_nao_lido(decimal ID_MESSAGE, decimal ID_CONTA_EMAIL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                {
                    mail.Marca_email_lido_nao_lido(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Desmarca_email_Favorito(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Marca_Desmarca_email_Favorito(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Pasta_Usuario(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Lista_Pasta_Usuario();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Pasta_Usuario_Mover(decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Lista_Pasta_Usuario_Mover();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_PASTAS(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Carrega_PASTAS(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_PASTAS_NIVEL_SUPERIOR(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Carrega_PASTAS_NIVEL_SUPERIOR();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<Doran_ERP_Servicos_Email.SUB_PASTAS> Busca_Sub_Pastas(decimal ID_PASTA, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Sub_Pastas(ID_PASTA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Move_emails_para_outra_pasta(decimal ID_PASTA, List<decimal> ID_MESSAGES, decimal PASTA_DEFINITIVA, 
            decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Move_emails_para_outra_pasta(ID_PASTA, ID_MESSAGES, PASTA_DEFINITIVA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Sugestao_Contatos(decimal ID_USUARIO, string DIGITOS)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Sugestao_Contatos(DIGITOS);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public List<string> Busca_Emails_do_Grupo(string NOME_GRUPO_EMAIL, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Emails_do_Grupo(NOME_GRUPO_EMAIL);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public decimal Salva_Mensagem_como_Rascunho(Dictionary<string, object> dados, List<string> TOs, List<string> CCs, List<string> BCCs, 
            List<string> Attachments, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    TOs.Remove(string.Empty);
                    CCs.Remove(string.Empty);
                    BCCs.Remove(string.Empty);

                    return mail.Salva_Mensagem_como_Rascunho(dados, TOs, CCs, BCCs, Attachments);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Envia_Email_que_estava_gravado_como_rascunho(decimal ID_MESSAGE, decimal ID_CONTA_EMAIL,
            decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO, ID_CONTA_EMAIL))
                {
                    return mail.Envia_Email_que_estava_gravado_como_rascunho(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Busca_Corpo_Mensagem(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Corpo_Mensagem(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Mensagem(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Mensagem(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Mensagem_para_Responder(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Mensagem_para_Responder(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Mensagem_para_Responder_a_Todos(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Mensagem_para_Responder_a_Todos(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public Dictionary<string, object> Busca_Mensagem_para_Encaminhar(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Mensagem_para_Encaminhar(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Busca_Detalhes_da_Mensagem(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Detalhes_da_Mensagem(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Marca_Desmarca_SPAM(decimal ID_MESSAGE, string EMAIL_SPAM, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Marca_Desmarca_SPAM(ID_MESSAGE, EMAIL_SPAM, null);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Desmarca_SPAM(string EMAIL_SPAM, decimal SPAM, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Marca_Desmarca_SPAM(0, EMAIL_SPAM, SPAM);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_SPAM(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_SPAM(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }

        }

        [WebMethod()]
        public string Baixa_Anexo(decimal ID_MESSAGE, decimal ID_ATTACHMENT, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Baixa_Anexo(ID_MESSAGE, ID_ATTACHMENT);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Busca_Anexos(decimal ID_MESSAGE, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    return mail.Busca_Anexos(ID_MESSAGE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Nova_Pasta(Dictionary<string, object> dados)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    mail.Grava_Nova_Pasta(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Pasta(Dictionary<string, object> dados)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    mail.Altera_Pasta(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_Pasta(decimal ID_PASTA, decimal ID_USUARIO)
        {
            try
            {
                

                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Deleta_Pasta(ID_PASTA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Imprime_Email(decimal ID_MESSAGE, int RB, decimal MODO, string NOME_EMITENTE, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Impressao_Email email = new Doran_ERP_Servicos_Email.Th2_Impressao_Email(ID_MESSAGE, (BODY_RAW_BODY)RB))
                {
                    ExpertPdf.HtmlToPdf.PDFPageOrientation pMODO = MODO == 1 ? ExpertPdf.HtmlToPdf.PDFPageOrientation.Portrait :
                        ExpertPdf.HtmlToPdf.PDFPageOrientation.Landscape;

                    return email.Imprime_Email(pMODO, NOME_EMITENTE);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Move_Arquivo_para_pasta_anexo_do_usuario(string ANEXO, decimal ID_USUARIO)
        {
            try
            {
                if (ConfigurationManager.AppSettings["PastaVirtual_Externa"].Equals(ConfigurationManager.AppSettings["PastaVirtual"]))
                {
                    ANEXO = ANEXO.Replace("d:", "c:");
                }

                string anexo = ConfigurationManager.AppSettings["PastaFisicaAnexos"].EndsWith(@"\") ?
                    ConfigurationManager.AppSettings["PastaFisicaAnexos"] + ANEXO.Substring(ANEXO.LastIndexOf(@"\") + 1) :
                    ConfigurationManager.AppSettings["PastaFisicaAnexos"] + @"\" + ANEXO.Substring(ANEXO.LastIndexOf(@"\") + 1);

                if (ANEXO.ToLower().Trim() != anexo.ToLower().Trim())
                {
                    try
                    {
                        if (File.Exists(ANEXO))
                            File.Delete(ANEXO);

                        File.Move(anexo, ANEXO);
                    }
                    catch { }
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Emails_de_uma_Pasta(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    return mail.Lista_Emails_de_uma_Pasta(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Nome_Anexo(decimal ID_ATTACHMENT, string NAME, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Altera_Nome_Anexo(ID_ATTACHMENT, NAME);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_emails(List<decimal> ID_MESSAGES, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.PopMail mail = new Doran_ERP_Servicos_Email.PopMail(ID_USUARIO))
                {
                    mail.Deleta_emails(ID_MESSAGES);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Todos_os_Contatos_do_Usuario(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato contatos = new Th2_Email_Contato(ID_USUARIO))
                {
                    return contatos.Carrega_Todos_os_Contatos_do_Usuario();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria.Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Todos_os_Grupos_de_email(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato contatos = new Th2_Email_Contato(ID_USUARIO))
                {
                    return contatos.Carrega_Todos_os_Grupos_de_email();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria.Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Todos_os_Emails_de_Grupo(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato contatos = new Th2_Email_Contato(ID_USUARIO))
                {
                    return contatos.Carrega_Todos_os_Emails_de_Grupo();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria.Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string carrega_Emails_Contidos_no_Grupo(string GRUPO, decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_Email.Th2_Email_Contato contatos = new Th2_Email_Contato(ID_USUARIO))
                {
                    return contatos.carrega_Emails_Contidos_no_Grupo(GRUPO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria.Th2_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}