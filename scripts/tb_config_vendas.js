function MontaTelaConfigVendas() {

    var CB_ANALISAR_PRIMEIRA_COMPRA = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando for a primeira compra do cliente',
        name: 'ANALISAR_PRIMEIRA_COMPRA',
        id: 'ANALISAR_PRIMEIRA_COMPRA'
    });

    var TXT_DIAS_INATIVIDADE = new Ext.form.NumberField({
        fieldLabel: 'Dias de Inatividade de Compra',
        width: 50,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_INATIVIDADE',
        id: 'DIAS_INATIVIDADE',
        allowBlank: false,
        value: 0
    });

    var CB_ANALISAR_INATIVIDADE = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando o cliente estiver com X dias sem compras',
        name: 'ANALISAR_INATIVIDADE',
        id: 'ANALISAR_INATIVIDADE'
    });

    var CB_ANALISAR_COND_PAGTO = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando a condi&ccedil;&atilde;o de pagamento for diferente da cond. cadastrada no cliente',
        name: 'ANALISAR_COND_PAGTO',
        id: 'ANALISAR_COND_PAGTO'
    });

    var CB_ANALISAR_MARGEM_VENDA = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando a margem do produto for menor do que o limite cadastrado no produto',
        name: 'ANALISAR_MARGEM_VENDA',
        id: 'ANALISAR_MARGEM_VENDA'
    });

    var CB_ANALISAR_LIMITE_CREDITO = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando o limite de crédito for Excedido (Pedidos Aprovados + Contas a Receber em Aberto)',
        name: 'ANALISAR_LIMITE_CREDITO',
        id: 'ANALISAR_LIMITE_CREDITO'
    });

    var CB_ANALISAR_INADIMPLENCIA = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando houver pagamento em atraso',
        name: 'ANALISAR_INADIMPLENCIA',
        id: 'ANALISAR_INADIMPLENCIA'
    });

    var CB_TRABALHAR_COM_MARGEM_GROS = new Ext.form.Checkbox({
        boxLabel: 'Trabalhar com calculo de margem GROS',
        name: 'TRABALHAR_COM_MARGEM_GROS',
        id: 'TRABALHAR_COM_MARGEM_GROS'
    });

    var TXT_LOGOTIPO_ORCAMENTO_VENDAS = new Ext.form.TextField({
        fieldLabel: 'Logotipo',
        width: 230,
        name: 'LOGOTIPO_ORCAMENTO_VENDAS',
        id: 'LOGOTIPO_ORCAMENTO_VENDAS',
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false
    });

    var CB_ANALISAR_FATURAMENTO_MINIMO = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando n&atilde;o atingir o valor de faturamento m&iacute;nimo',
        name: 'ANALISAR_FATURAMENTO_MINIMO',
        id: 'ANALISAR_FATURAMENTO_MINIMO'
    });

    var CB_ANALISAR_IMPOSTO = new Ext.form.Checkbox({
        boxLabel: 'Bloquear o pedido quando as al&iacute;quotas de icms e ipi estiverem difetente do cadastro do produto',
        name: 'ANALISAR_IMPOSTO',
        id: 'ANALISAR_IMPOSTO'
    });

    var CB_NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO = new Ext.form.Checkbox({
        boxLabel: 'N&atilde;o gerar o pedido quando houver qualquer restrição acima selecionada',
        name: 'NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO',
        id: 'NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO'
    });

    var TXT_VALOR_FATURAMENTO_MINIMO = new Ext.form.NumberField({
        fieldLabel: 'Valor de Faturamento M&iacute;nimo',
        width: 70,
        decimalPrecision: 2,
        minValue: 0,
        name: 'VALOR_FATURAMENTO_MINIMO',
        id: 'VALOR_FATURAMENTO_MINIMO',
        allowBlank: false,
        value: 100
    });

    var TXT_PRAZO_DIAS_ORCAMENTO = new Ext.form.NumberField({
        fieldLabel: 'Prazo de validade para Or&ccedil;amentos (dias)',
        width: 70,
        minValue: 1,
        name: 'PRAZO_DIAS_ORCAMENTO',
        id: 'PRAZO_DIAS_ORCAMENTO',
        allowBlank: false,
        value: 100
    });

    var formCONFIG_VENDAS = new Ext.FormPanel({
        id: 'formCONFIG_VENDAS',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '90%',
        height: 400,
        layout: 'form',
        labelAlign: 'top',
        autoScroll: true,
        items: [{
            layout: 'form',
            items: [CB_ANALISAR_PRIMEIRA_COMPRA]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .45,
                items: [CB_ANALISAR_INATIVIDADE]
            }, {
                layout: 'form',
                columnWidth: .20,
                items: [TXT_DIAS_INATIVIDADE]
}]
            }, {
                layout: 'form',
                items: [CB_ANALISAR_COND_PAGTO]
            }, {
                layout: 'form',
                items: [CB_ANALISAR_MARGEM_VENDA]
            }, {
                layout: 'form',
                items: [CB_ANALISAR_LIMITE_CREDITO]
            }, {
                layout: 'form',
                items: [CB_ANALISAR_INADIMPLENCIA]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .45,
                    layout: 'form',
                    items: [CB_ANALISAR_FATURAMENTO_MINIMO]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [TXT_VALOR_FATURAMENTO_MINIMO]
}]
                }, {
                    layout: 'form',
                    items: [CB_ANALISAR_IMPOSTO]
                }, {
                    layout: 'form',
                    items: [TXT_LOGOTIPO_ORCAMENTO_VENDAS]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .27,
                        layout: 'form',
                        items: [TXT_PRAZO_DIAS_ORCAMENTO]
                    }, {
                        columnWidth: .40,
                        layout: 'form',
                        items: [CB_NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [CB_TRABALHAR_COM_MARGEM_GROS]
}]
}]
                    });

                    var buttonGroup_TB_CONFIG_VENDAS = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar Configura&ccedil;&otilde;es',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                SalvarTB_CONFIG_VENDAS();
                            }
}]
                        });

                        var toolbar_TB_CONFIG_VENDAS = new Ext.Toolbar({
                            style: 'text-align: right;',
                            items: [buttonGroup_TB_CONFIG_VENDAS]
                        });

                        var panelCadastroConfigVendas = new Ext.Panel({
                            width: '100%',
                            border: true,
                            title: 'Configura&ccedil;&otilde;es de Vendas',
                            items: [formCONFIG_VENDAS, toolbar_TB_CONFIG_VENDAS]
                        });

                        function SalvarTB_CONFIG_VENDAS() {

                            if (!formCONFIG_VENDAS.getForm().isValid()) {
                                return;
                            }

                            var dados = {
                                ANALISAR_PRIMEIRA_COMPRA: Ext.getCmp('ANALISAR_PRIMEIRA_COMPRA').checked ? 1 : 0,
                                ANALISAR_INATIVIDADE: Ext.getCmp('ANALISAR_INATIVIDADE').checked ? 1 : 0,
                                ANALISAR_COND_PAGTO: Ext.getCmp('ANALISAR_COND_PAGTO').checked ? 1 : 0,
                                ANALISAR_MARGEM_VENDA: Ext.getCmp('ANALISAR_MARGEM_VENDA').checked ? 1 : 0,
                                ANALISAR_LIMITE_CREDITO: Ext.getCmp('ANALISAR_LIMITE_CREDITO').checked ? 1 : 0,
                                ANALISAR_INADIMPLENCIA: Ext.getCmp('ANALISAR_INADIMPLENCIA').checked ? 1 : 0,
                                DIAS_INATIVIDADE: Ext.getCmp('DIAS_INATIVIDADE').getValue(),
                                LOGOTIPO_ORCAMENTO_VENDAS: Ext.getCmp('LOGOTIPO_ORCAMENTO_VENDAS').getValue(),
                                ANALISAR_FATURAMENTO_MINIMO: Ext.getCmp('ANALISAR_FATURAMENTO_MINIMO').getValue(),
                                ANALISAR_IMPOSTO: Ext.getCmp('ANALISAR_IMPOSTO').getValue(),
                                VALOR_FATURAMENTO_MINIMO: Ext.getCmp('VALOR_FATURAMENTO_MINIMO').getValue(),
                                PRAZO_DIAS_ORCAMENTO: Ext.getCmp('PRAZO_DIAS_ORCAMENTO').getValue(),
                                NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO: Ext.getCmp('NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO').getValue(),
                                TRABALHAR_COM_MARGEM_GROS: CB_TRABALHAR_COM_MARGEM_GROS.checked ? 1 : 0,
                                ID_USUARIO: _ID_USUARIO
                            };

                            var Url = 'servicos/TB_CONFIG_VENDAS.asmx/AtualizaConfig';

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl(Url);
                            _ajax.setJsonData({ dados: dados });

                            var _sucess = function(response, options) {

                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }

                        function BuscaCONFIG_VENDAS() {
                            var Url = 'servicos/TB_CONFIG_VENDAS.asmx/BuscaConfig';

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl(Url);
                            _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

                            var _sucess = function(response, options) {
                                var result = Ext.decode(response.responseText).d;

                                result.ANALISAR_PRIMEIRA_COMPRA == 1 ? Ext.getCmp('ANALISAR_PRIMEIRA_COMPRA').setValue(true) :
                        Ext.getCmp('ANALISAR_PRIMEIRA_COMPRA').setValue(false);

                                result.ANALISAR_INATIVIDADE == 1 ? Ext.getCmp('ANALISAR_INATIVIDADE').setValue(true) :
                        Ext.getCmp('ANALISAR_INATIVIDADE').setValue(false);

                                result.ANALISAR_COND_PAGTO == 1 ? Ext.getCmp('ANALISAR_COND_PAGTO').setValue(true) :
                        Ext.getCmp('ANALISAR_COND_PAGTO').setValue(false);

                                result.ANALISAR_MARGEM_VENDA == 1 ? Ext.getCmp('ANALISAR_MARGEM_VENDA').setValue(true) :
                        Ext.getCmp('ANALISAR_MARGEM_VENDA').setValue(false);

                                result.ANALISAR_LIMITE_CREDITO == 1 ? Ext.getCmp('ANALISAR_LIMITE_CREDITO').setValue(true) :
                        Ext.getCmp('ANALISAR_LIMITE_CREDITO').setValue(false);

                                result.ANALISAR_INADIMPLENCIA == 1 ? Ext.getCmp('ANALISAR_INADIMPLENCIA').setValue(true) :
                        Ext.getCmp('ANALISAR_INADIMPLENCIA').setValue(false);

                                Ext.getCmp('DIAS_INATIVIDADE').setValue(result.DIAS_INATIVIDADE);
                                Ext.getCmp('LOGOTIPO_ORCAMENTO_VENDAS').setValue(result.LOGOTIPO_ORCAMENTO_VENDAS);

                                Ext.getCmp('ANALISAR_INATIVIDADE').boxLabel =
                            Ext.getCmp('ANALISAR_INATIVIDADE').boxLabel.replace('X', result.DIAS_INATIVIDADE);

                                result.ANALISAR_FATURAMENTO_MINIMO == 1 ? Ext.getCmp('ANALISAR_FATURAMENTO_MINIMO').setValue(true) :
                            Ext.getCmp('ANALISAR_FATURAMENTO_MINIMO').setValue(false);

                                result.ANALISAR_IMPOSTO == 1 ? Ext.getCmp('ANALISAR_IMPOSTO').setValue(true) :
                            Ext.getCmp('ANALISAR_IMPOSTO').setValue(false);

                                Ext.getCmp('VALOR_FATURAMENTO_MINIMO').setValue(result.VALOR_FATURAMENTO_MINIMO);

                                Ext.getCmp('PRAZO_DIAS_ORCAMENTO').setValue(result.PRAZO_DIAS_ORCAMENTO);

                                result.NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO == 1 ? Ext.getCmp('NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO').setValue(true) :
                                    Ext.getCmp('NAO_GERAR_PEDIDO_HAVENDO_RESTRICAO').setValue(false);

                                result.TRABALHAR_COM_MARGEM_GROS == 1 ? CB_TRABALHAR_COM_MARGEM_GROS.setValue(true) :
                                    CB_TRABALHAR_COM_MARGEM_GROS.setValue(false);

                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }

                        formCONFIG_VENDAS.setHeight(AlturaDoPainelDeConteudo(0) - 98);

                        BuscaCONFIG_VENDAS();

                        return panelCadastroConfigVendas;
                    }