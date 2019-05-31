using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Collections;
using Doran_Base;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_ACESSO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_ACESSO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Carrega_Acessos(Dictionary<string, object> dados)
        {
            try
            {
                decimal ID_USUARIO = Convert.ToDecimal(dados["ID_USUARIO"]);

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from st in ctx.TB_ACESSO_COMERCIALs
                                select new
                                {
                                    st.ID_USUARIO,
                                    st.TB_USUARIO.LOGIN_USUARIO,
                                    st.TB_USUARIO.NOME_USUARIO,
                                    st.MENU
                                };

                    if (ID_USUARIO > 0)
                        query = query.Where(au => au.ID_USUARIO == ID_USUARIO);

                    var rowCount = query.Count();

                    var query1 = query.Skip(Convert.ToInt32(dados["start"])).Take(Convert.ToInt32(dados["limit"]));

                    DataSet ds = ApoioXML.ToDataSet(ctx, query1, rowCount);

                    ds.Tables[0].Columns.Add("ICONE");

                    TB_USUARIO _usuario = new TB_USUARIO();

                    foreach (DataRow dr in ds.Tables[0].Rows)
                        dr["ICONE"] = getIconeMenu(dr["MENU"].ToString());

                    foreach (DataRow dr in ds.Tables[1].Rows)
                        dr["totalCount"] = rowCount;

                    System.IO.StringWriter tr = new System.IO.StringWriter();
                    ds.WriteXml(tr);

                    return tr.ToString();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public string Lista_Acessos(decimal ID_USUARIO)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from st in ctx.TB_ACESSO_COMERCIALs
                                where st.ID_USUARIO == ID_USUARIO
                                select new
                                {
                                    st.MENU
                                };

                    return ApoioXML.objQueryToXML(ctx, query);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovoAcesso(Dictionary<string, object> dados)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    object[] MENU = (object[])dados["MENU"];

                    for (int i = 0; i < MENU.Length; i++)
                    {
                        var existe = (from linha in ctx.TB_ACESSO_COMERCIALs
                                      where (linha.ID_USUARIO == Convert.ToDecimal(dados["ID_USUARIO"])
                                      && linha.MENU == MENU[i].ToString())
                                      select linha).Any();

                        if (!existe)
                        {
                            System.Data.Linq.Table<TB_ACESSO_COMERCIAL> Entidade = ctx.GetTable<TB_ACESSO_COMERCIAL>();

                            TB_ACESSO_COMERCIAL novo = new TB_ACESSO_COMERCIAL();

                            novo.ID_USUARIO = Convert.ToDecimal(dados["ID_USUARIO"]);
                            novo.MENU = MENU[i].ToString();

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), Convert.ToDecimal(dados["ID_USUARIO"]));
                        }
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void DeletaAcesso(decimal ID_USUARIO, string MENU, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    var query = from item in ctx.TB_ACESSO_COMERCIALs
                                where item.ID_USUARIO == ID_USUARIO
                                && item.MENU == MENU
                                select item;

                    foreach (var linha in query)
                    {
                        ctx.TB_ACESSO_COMERCIALs.DeleteOnSubmit(linha);
                        Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Delete(ctx, linha, ctx.TB_ACESSO_COMERCIALs.ToString(), ID_USUARIO_ORIGINAL);
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public void CadastraDireitosParaUmUsuario(decimal ID_USUARIO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                TB_USUARIO _usuario = new TB_USUARIO();

                ArrayList arr1 = arrayMenu;

                using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
                {
                    for (int i = 0; i < arr1.Count; i++)
                    {
                        var query = from linha in ctx.TB_ACESSO_COMERCIALs
                                    where linha.ID_USUARIO == ID_USUARIO
                                    && linha.MENU == arr1[i].ToString()
                                    select linha;

                        if (query.Count() == 0)
                        {
                            System.Data.Linq.Table<TB_ACESSO_COMERCIAL> Entidade = ctx.GetTable<TB_ACESSO_COMERCIAL>();

                            TB_ACESSO_COMERCIAL novo = new TB_ACESSO_COMERCIAL();

                            novo.ID_USUARIO = ID_USUARIO;
                            novo.MENU = arr1[i].ToString();

                            Entidade.InsertOnSubmit(novo);

                            Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO_ORIGINAL);
                        }
                    }

                    ctx.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public string CarregaItensDeMenu(decimal ID_USUARIO)
        {
            try
            {
                return Menu();
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        private string Menu()
        {
            DataTable dt = dtMenu();

            System.IO.StringWriter tr = new System.IO.StringWriter();
            dt.WriteXml(tr);

            return tr.ToString();
        }

        private DataTable dtMenu()
        {
            DataTable dt = new DataTable("Tabela");
            dt.Columns.Add("MENU");
            dt.Columns.Add("ICONE");

            for (int i = 0; i < arrayMenu.Count; i++)
            {
                DataRow nova = dt.NewRow();
                nova[0] = arrayMenu[i].ToString();
                nova[1] = arrayIconeMenu[i].ToString();

                dt.Rows.Add(nova);
            }

            return dt;
        }

        public int IconeValido(string menu)
        {
            int _index = -1;

            for (int i = 0; i < arrayMenu.Count; i++)
            {
                if (arrayMenu[i].ToString() == menu)
                {
                    _index = i;
                    break;
                }
            }

            return _index;
        }

        public string getIconeMenu(string menu)
        {
            int _index = -1;

            for (int i = 0; i < arrayMenu.Count; i++)
            {
                if (arrayMenu[i].ToString() == menu)
                {
                    _index = i;
                    break;
                }
            }

            return _index > -1 ?
                arrayIconeMenu[_index].ToString() :
                string.Empty;
        }

        public ArrayList arrayMenu
        {
            get
            {
                ArrayList arr1 = new ArrayList();

                arr1.Add("Ciclistas");
                arr1.Add("Clientes");
                arr1.Add("Condi&ccedil;&atilde;o de Pagamento");
                arr1.Add("Custos de Venda");
                arr1.Add("Empresa / Filial");
                arr1.Add("Limite de Cr&eacute;dito");
                arr1.Add("Regi&atilde;o de Vendas");
                arr1.Add("Servi&ccedil;os");
                arr1.Add("Status de Servi&ccedil;o");
                arr1.Add("Status de Servi&ccedil;o X Usu&aacute;rio");
                arr1.Add("Vendedores");
                arr1.Add("Calend&aacute;rio");

                arr1.Add("Or&ccedil;amento de Vendas");
                arr1.Add("Matriz de Or&ccedil;amentos");
                arr1.Add("Estat&iacute;sticas");

                arr1.Add("Servi&ccedil;os de Vendas");
                arr1.Add("Estat&iacute;sticas / Qualidade");
                arr1.Add("Auditoria de Servi&ccedil;os");
                arr1.Add("Matriz de Servi&ccedil;os");
                arr1.Add("Relat&oacute;rio de Vendas");
                arr1.Add("Notas fiscais");

                arr1.Add("Contas a Pagar / Receber");
                arr1.Add("Plano de Contas");
                arr1.Add("Banco");
                arr1.Add("Conta Corrente");

                arr1.Add("Status de Pedido de Compra");
                arr1.Add("Cota&ccedil;&otilde;es");
                arr1.Add("Pedido de Compra");
                arr1.Add("Ultimas Vendas/Compras");
                arr1.Add("Estat&iacute;sticas de Compras");
                arr1.Add("Matriz (Pedido de Compra)");

                arr1.Add("Direitos por Usu&aacute;rio");
                arr1.Add("Configura&ccedil;&otilde;es de Vendas");

                arr1.Add("Auditoria de Uso");
                arr1.Add("Log de Erros");

                return arr1;
            }
        }

        private ArrayList arrayIconeMenu
        {
            get
            {
                ArrayList arr2 = new ArrayList();

                arr2.Add("imagens/icones/data_transport_config_16.gif");
                arr2.Add("imagens/icones/admin_16.gif");
                arr2.Add("imagens/icones/insert_row_16.gif");
                arr2.Add("imagens/icones/calculator_add_16.gif");
                arr2.Add("imagens/icones/oracle_info_16.gif");
                arr2.Add("imagens/icones/caution_16.gif");
                arr2.Add("imagens/icones/atom_fav_16.gif");
                arr2.Add("imagens/icones/info_16.gif");
                arr2.Add("imagens/icones/entity_relation_16.gif");
                arr2.Add("imagens/icones/entity_relation_lock_16.gif");
                arr2.Add("imagens/icones/user_config_16.gif");
                arr2.Add("imagens/icones/calendar_fav_16.gif");

                arr2.Add("imagens/icones/write_16.gif");
                arr2.Add("imagens/icones/notepad_star_16.gif");
                arr2.Add("imagens/icones/stadistics_16.gif");

                arr2.Add("imagens/icones/copy_level_16.gif");
                arr2.Add("imagens/icones/statistic_config_16.gif");
                arr2.Add("imagens/icones/insert_table_save_16.gif");
                arr2.Add("imagens/icones/notepad_star_16.gif");
                arr2.Add("imagens/icones/system_reload_16.gif");
                arr2.Add("imagens/icones/write_16.gif");

                arr2.Add("imagens/icones/calculator_ok_16.gif");
                arr2.Add("imagens/icones/attach_config_16.gif");
                arr2.Add("imagens/icones/e_commerce_16.gif");
                arr2.Add("imagens/icones/mssql_16.gif");

                arr2.Add("imagens/icones/entity_relation_next_16.gif");
                arr2.Add("imagens/icones/paste_16.gif");
                arr2.Add("imagens/icones/copy_reload_16.gif");
                arr2.Add("imagens/icones/dollar_16.png");
                arr2.Add("imagens/icones/statistic_config_16.gif");
                arr2.Add("imagens/icones/notepad_star_16.gif");

                arr2.Add("imagens/icones/group_ok_16.gif");
                arr2.Add("imagens/icones/tool_config_16.gif");

                arr2.Add("imagens/icones/insert_table_save_16.gif");
                arr2.Add("imagens/icones/database_delete_16.gif");

                return arr2;
            }
        }
    }
}