using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using Doran_Servicos_ORM;
using Doran_Base;
using Doran_Servicos_Login;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for WSLogin
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class WSLogin : System.Web.Services.WebService
    {
        [WebMethod()]
        public Dictionary<string, object> validaLogin(Dictionary<string, string> dados)
        {
            return Login.validaLogin(dados);
        }

        [WebMethod()]
        public Dictionary<string, object> validaChave(Dictionary<string, object> dados)
        {
            return Login.validaChave(dados);
        }

        [WebMethod()]
        public bool alteraSenha(Dictionary<string, string> dados)
        {
            return Login.alteraSenha(dados);
        }

        [WebMethod()]
        public string TabelasDoSistema()
        {
            return Login.TabelasDoSistema();
        }

        private List<string> Nome_Tabelas()
        {
            return Login.Nome_Tabelas();
        }

        [WebMethod()]
        public string CarregaComboUsuarios()
        {
            return Login.CarregaComboUsuarios();
        }

        [WebMethod()]
        public string CarregaComboUF()
        {
            return Login.CarregaComboUF();
        }

        [WebMethod()]
        public string Logoff()
        {
            return Login.Logoff();
        }

        [WebMethod()]
        public Dictionary<string, object> BuscaEmpresaUsuario(string LOGIN_USUARIO)
        {
            return Login.BuscaEmpresaUsuario(LOGIN_USUARIO);
        }

        [WebMethod()]
        public decimal CasasDecimaisQtde()
        {
            return Login.CasasDecimaisQtde();
        }
    }
}