using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using Doran_ERP_Servicos.classes;
using Doran_Base;
using Doran_ERP_Servicos_Calendario;

namespace Doran_ERP_Servicos.servicos
{
    /// <summary>
    /// Summary description for TB_CALENDARIO
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class TB_CALENDARIO : System.Web.Services.WebService
    {
        [WebMethod()]
        public string Monta_Calendario(decimal ID_USUARIO, string DATA_REFERENCIA, int MODULO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario())
                {
                    MODULO_CALENDARIO _modulo = (MODULO_CALENDARIO)Enum.ToObject(typeof(MODULO_CALENDARIO), MODULO);

                    return cal.Monta_Calendario_Usuario(ID_USUARIO, DATA_REFERENCIA, _modulo);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Tarefas_do_Dia(decimal ID_USUARIO, string DATA_CALENDARIO, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Carrega_Tarefas_do_Dia(DATA_CALENDARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Tarefas_no_Periodo(decimal ID_USUARIO, string data1, string data2, decimal ID_USUARIO_ORIGINAL)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Carrega_Tarefas_no_Periodo(ID_USUARIO, data1, data2);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO_ORIGINAL);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Usuarios(decimal ADMIN_USUARIO, decimal ID_USUARIO)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Carrega_Usuarios(ADMIN_USUARIO, 1, 0, 0);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Usuarios_Tarefa(decimal ID_USUARIO, decimal ADMIN_USUARIO)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Carrega_Usuarios_Tarefa(ADMIN_USUARIO);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Carrega_Usuarios_Email(decimal ID_USUARIO)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Carrega_Usuarios_Email();
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void GravaNovaAgenda(Dictionary<string, object> dados)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    cal.GravaNovaAgenda(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Agenda(Dictionary<string, object> dados)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    cal.Altera_Agenda(dados);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Altera_Agenda_para_Varios_Usuarios(Dictionary<string, object> dados, List<decimal> usuarios)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(Convert.ToDecimal(dados["ID_USUARIO"])))
                {
                    cal.Altera_Agenda_para_Varios_Usuarios(dados, usuarios);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public void Deleta_Agenda(decimal NUMERO_AGENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    cal.Deleta_Agenda(NUMERO_AGENDA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public void Grava_Nova_Agenda_para_Varios_Usuarios(Dictionary<string, object> dados, List<decimal> usuarios)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"])))
                {
                    cal.Grava_Nova_Agenda_para_Varios_Usuarios(dados, usuarios);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, Convert.ToDecimal(dados["ID_USUARIO_ORIGINAL"]));
                throw ex;
            }
        }

        [WebMethod()]
        public List<decimal?> Busca_Usuarios_Associados_na_Tarefa(decimal NUMERO_AGENDA, decimal ID_USUARIO)
        {
            try
            {
                using (Agenda_Calendario cal = new Agenda_Calendario(ID_USUARIO))
                {
                    return cal.Busca_Usuarios_Associados_na_Tarefa(NUMERO_AGENDA);
                }
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }

        [WebMethod()]
        public string Preenche_Calendario_de_Compras_ou_Vendas(string DATA_REFERENCIA, decimal MODO, decimal SUPERVISOR, decimal VENDEDOR,
            decimal ID_VENDEDOR, decimal ID_EMPRESA, decimal ID_USUARIO)
        {
            try
            {
                DateTime dt1;

                if (!DateTime.TryParse(DATA_REFERENCIA, out dt1))
                    throw new Exception("Data inv&aacute;lida");

                DateTime dataRef = Convert.ToDateTime(DATA_REFERENCIA);

                dt1 = Convert.ToDateTime("01/" + dataRef.Month.ToString().PadLeft(2, '0') + "/" + dataRef.Year.ToString());
                DateTime dt2 = dt1.AddMonths(1);
                dt2 = dt2.AddDays(-1);

                DataTable dt = new DataTable("Tabela");

                dt.Columns.Add("DOMINGO");
                dt.Columns.Add("SEGUNDA");
                dt.Columns.Add("TERCA");
                dt.Columns.Add("QUARTA");
                dt.Columns.Add("QUINTA");
                dt.Columns.Add("SEXTA");
                dt.Columns.Add("SABADO");

                DateTime dia = dt1.AddDays(-(int)dt1.DayOfWeek);

                int dia_semana = (int)dia.DayOfWeek + 1;
                DataRow nova = dt.NewRow();

                dt2 = dt2.AddDays(7 - (int)dt2.DayOfWeek);

                while (dia <= dt2)
                {
                    nova[dia_semana - 1] = dia.ToShortDateString();

                    if (dia_semana == 7)
                    {
                        dt.Rows.Add(nova);
                        nova = dt.NewRow();
                        dia_semana = 1;
                    }
                    else
                        dia_semana++;

                    dia = dia.AddDays(1);
                }

                foreach (DataRow dr in dt.Rows)
                {
                    foreach (DataColumn dc in dt.Columns)
                    {
                        string x = "<div style='overflow: auto; height: 90px; width:155px; font-size: 9pt; background-image: url(imagens/bg-cinza2.jpg);'>";

                        if (Convert.ToDateTime(dr[dc]) == DateTime.Today)
                            x = "<div style='overflow: auto; height: 90px; width:155px; font-size: 9pt; background-color: #FFFF99;'>";

                        if (Convert.ToDateTime(dr[dc]).Month < dataRef.Month && Convert.ToDateTime(dr[dc]) != DateTime.Today)
                            x = "<div style='overflow: auto; height: 90px; width:155px; font-size: 9pt; background-color: #CCFFCC;'>";

                        if (Convert.ToDateTime(dr[dc]).Month > dataRef.Month && Convert.ToDateTime(dr[dc]) != DateTime.Today)
                            x = "<div style='overflow: auto; height: 90px; width:155px; font-size: 9pt; background-color: #FFB997;'>";

                        x += string.Concat("<div style='text-align: right; width: 100%; '>", Convert.ToDateTime(dr[dc]) == DateTime.Today ?
                            "<span style='color: #00004F;'><b>(Hoje)</b></span> " : "",
                            "[", "<span style='cursor: pointer;'><b>",
                            ApoioXML.TrataData5(Convert.ToDateTime(dr[dc])), "</b></span>]", "&nbsp;</div>");

                        using (Doran_Estatisticas_Qualidade cal = new Doran_Estatisticas_Qualidade())
                        {
                            DateTime dataInicial = Convert.ToDateTime(dr[dc]);
                            DateTime dataFinal = Convert.ToDateTime(dr[dc]);

                            dataFinal = dataFinal.AddDays(1);

                            string _strTotais = MODO == 1 ? string.Join("",
                                cal.Calcula_Totais_Venda_para_Calendario(dataInicial, dataFinal, ID_EMPRESA, SUPERVISOR, VENDEDOR, ID_VENDEDOR).ToArray()) :
                                string.Join("", cal.Calcula_Totais_Compra_para_Calendario(dataInicial, dataFinal).ToArray());

                            dr[dc] = x + string.Concat(_strTotais, "</div>");
                        }
                    }
                }

                System.IO.StringWriter tr = new System.IO.StringWriter();
                dt.WriteXml(tr);

                return tr.ToString();
            }
            catch (Exception ex)
            {
                Doran_Base.Auditoria_ERP_Servicos.Doran_Exception.GravaErro(ex, ID_USUARIO);
                throw ex;
            }
        }
    }
}
