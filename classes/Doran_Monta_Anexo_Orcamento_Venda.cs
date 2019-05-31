using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Servicos_ORM;
using System.IO;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Monta_Anexo_Orcamento_Venda : IDisposable
    {
        private decimal _NUMERO_ORCAMENTO { get; set; }
        private decimal _ID_CONTA_EMAIL { get; set; }

        public Doran_Monta_Anexo_Orcamento_Venda(decimal NUMERO_ORCAMENTO, decimal ID_CONTA_EMAIL)
        {
            _NUMERO_ORCAMENTO = NUMERO_ORCAMENTO;
            _ID_CONTA_EMAIL = ID_CONTA_EMAIL;
        }

        public Dictionary<string, object> Monta_Anexo_Cliente_Cadastrado(decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var anexo_arquivo = (from linha in ctx.TB_EMAIL_CONTAs
                                     where linha.ID_CONTA_EMAIL == _ID_CONTA_EMAIL
                                     select linha.PASTA_ANEXOS).ToList().First();

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_Impressao_Orcamento orcamento = new Doran_Impressao_Orcamento(_NUMERO_ORCAMENTO, ID_EMPRESA, ID_USUARIO))
                {
                    orcamento.Imprime_Orcamento();

                    anexo_arquivo = anexo_arquivo.EndsWith("\\") ?
                        string.Concat(anexo_arquivo, orcamento.arquivo_final.Substring(orcamento.arquivo_final.LastIndexOf("\\"))) :
                         string.Concat(anexo_arquivo, "\\", orcamento.arquivo_final.Substring(orcamento.arquivo_final.LastIndexOf("\\")));

                    retorno.Add("pdf", orcamento.arquivo_final);
                    retorno.Add("anexo", anexo_arquivo);

                    File.Copy(orcamento.arquivo_final, anexo_arquivo, true);
                }

                return retorno;
            }
        }

        public Dictionary<string, object> Monta_Anexo_Cliente_nao_Cadastrado(decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                var anexo_arquivo = (from linha in ctx.TB_EMAIL_CONTAs
                                     where linha.ID_CONTA_EMAIL == _ID_CONTA_EMAIL
                                     select linha.PASTA_ANEXOS).ToList().First();

                Dictionary<string, object> retorno = new Dictionary<string, object>();

                using (Doran_Impressao_Orcamento_Cliente_Novo orcamento = new Doran_Impressao_Orcamento_Cliente_Novo(_NUMERO_ORCAMENTO, ID_EMPRESA, ID_USUARIO))
                {
                    orcamento.Imprime_Orcamento();

                    anexo_arquivo = anexo_arquivo.EndsWith("\\") ?
                        string.Concat(anexo_arquivo, orcamento.arquivo_final.Substring(orcamento.arquivo_final.LastIndexOf("\\"))) :
                         string.Concat(anexo_arquivo, "\\", orcamento.arquivo_final.Substring(orcamento.arquivo_final.LastIndexOf("\\")));

                    retorno.Add("pdf", orcamento.arquivo_final);
                    retorno.Add("anexo", anexo_arquivo);

                    File.Copy(orcamento.arquivo_final, anexo_arquivo, true);
                }

                return retorno;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {

        }

        #endregion
    }
}
