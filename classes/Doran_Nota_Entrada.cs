using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Doran_Base.Auditoria;
using Doran_Servicos_ORM;

namespace Doran_ERP_Servicos.classes
{
    public class Doran_Nota_Entrada : IDisposable
    {
        public decimal ID_USUARIO { get; set; }
        public decimal ID_EMPRESA { get; set; }

        public Doran_Nota_Entrada(decimal _ID_EMPRESA, decimal _ID_USUARIO)
        {
            ID_USUARIO = _ID_USUARIO;
            ID_EMPRESA = _ID_EMPRESA;
        }

        public decimal Grava_Nota_Entrada(Dictionary<string, object> dados)
        {
            using (Doran_ERP_Servicos_DadosDataContext ctx = new Doran_ERP_Servicos_DadosDataContext())
            {
                System.Data.Linq.Table<TB_NOTA_ENTRADA> Entidade = ctx.GetTable<TB_NOTA_ENTRADA>();

                TB_NOTA_ENTRADA novo = new TB_NOTA_ENTRADA();

                novo.NUMERO_NFE = Convert.ToDecimal(dados["NUMERO_NFE"]);
                novo.SERIE_NFE = dados["SERIE_NFE"].ToString();

                novo.DATA_EMISSAO_NFE = Convert.ToDateTime(dados["DATA_EMISSAO_NFE"]);
                novo.DATA_CHEGADA_NFE = Convert.ToDateTime(dados["DATA_CHEGADA_NFE"]);

                novo.CODIGO_FORNECEDOR = Convert.ToDecimal(dados["CODIGO_FORNECEDOR"]);
                novo.CODIGO_CP_NFE = Convert.ToDecimal(dados["CODIGO_CP_NFE"]);
                novo.GERA_COBRANCA_NFE = Convert.ToDecimal(dados["GERA_COBRANCA_NFE"]);
                novo.CODIGO_CFOP_NFE = dados["CODIGO_CFOP_NFE"].ToString();

                novo.BASE_ICMS_NFE = Convert.ToDecimal(dados["BASE_ICMS_NFE"]);
                novo.VALOR_ICMS_NFE = Convert.ToDecimal(dados["VALOR_ICMS_NFE"]);
                novo.BASE_ICMS_SUBS_NFE = Convert.ToDecimal(dados["BASE_ICMS_SUBS_NFE"]);
                novo.VALOR_ICMS_SUBS_NFE = Convert.ToDecimal(dados["VALOR_ICMS_SUBS_NFE"]);
                novo.TOTAL_PRODUTOS_NFE = Convert.ToDecimal(dados["TOTAL_PRODUTOS_NFE"]);
                novo.VALOR_FRETE_NFE = Convert.ToDecimal(dados["VALOR_FRETE_NFE"]);
                novo.VALOR_SEGURO_NFE = Convert.ToDecimal(dados["VALOR_SEGURO_NFE"]);
                novo.OUTRAS_DESP_NFE = Convert.ToDecimal(dados["OUTRAS_DESP_NFE"]);
                novo.TOTAL_IPI_NFE = Convert.ToDecimal(dados["TOTAL_IPI_NFE"]);
                novo.TOTAL_NFE = Convert.ToDecimal(dados["TOTAL_NFE"]);
                novo.OBS_NFE = dados["OBS_NFE"].ToString();
                novo.CANCELADA_NFE = 0;
                novo.FRETE_NFE = Convert.ToDecimal(dados["FRETE_NFE"]);
                novo.STATUS_NFE = 1;

                novo.PESO_LIQUIDO_NFE = Convert.ToDecimal(dados["PESO_LIQUIDO_NFE"]);
                novo.PESO_BRUTO_NFE = Convert.ToDecimal(dados["PESO_BRUTO_NFE"]);

                novo.CODIGO_EMITENTE_NFE = ID_EMPRESA;

                Entidade.InsertOnSubmit(novo);

                Doran_Base.Auditoria_ERP_Servicos.Doran_Auditoria.Audita_Insert(ctx, novo, Entidade.ToString(), ID_USUARIO);

                ctx.SubmitChanges();

                return novo.NUMERO_SEQ_NFE;
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            
        }

        #endregion
    }
}
