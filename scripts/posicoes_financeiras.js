function MontaTitulosVencidos() {

    var TXT_TV_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Cliente / Fornecedor',
        name: 'TV_CLIENTE_FORNECEDOR',
        id: 'TV_CLIENTE_FORNECEDOR',
        width: 350,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' }
    });

    var CB_RECEBER_PAGAR = new Ext.form.ComboBox({
        fieldLabel: 'A Receber / Pagar',
        id: 'RECEBER_PAGAR',
        name: 'RECEBER_PAGAR',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 100,
        allowBlank: false,
        value: 'R',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['R', 'Receber'], ['P', 'Pagar']]
        })
    });

    TB_USUARIO_CARREGA_VENDEDORES();

    var combo_CODIGO_VENDEDOR = new Ext.form.ComboBox({
        store: combo_TB_VENDEDORES_Store,
        fieldLabel: 'Vendedor(a)',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 230
    });

    var BTN_TV_CONFIRMAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            if (!Ext.getCmp('formTV').getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();

            var vendedor = combo_CODIGO_VENDEDOR.getValue() == '' ? 0 : combo_CODIGO_VENDEDOR.getValue();

            if (Ext.getCmp('RECEBER_PAGAR').getValue() == 'R') {
                _ajax.setUrl('servicos/RELATORIOS.asmx/Titulos_Receber_Vencidos');
                _ajax.setJsonData({
                    CLIENTE: Ext.getCmp('TV_CLIENTE_FORNECEDOR').getValue(),
                    VENDEDOR: vendedor,
                    ID_EMPRESA: _ID_EMPRESA,
                    ID_USUARIO: _ID_USUARIO
                });
            }
            else {
                _ajax.setUrl('servicos/RELATORIOS.asmx/Titulos_Pagar_Vencidos');
                _ajax.setJsonData({
                    FORNECEDOR: Ext.getCmp('TV_CLIENTE_FORNECEDOR').getValue(),
                    VENDEDOR: vendedor,
                    ID_EMPRESA: _ID_EMPRESA,
                    ID_USUARIO: _ID_USUARIO
                });
            }

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsTV = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'T&iacute;tulos Vencidos',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.40,
                layout: 'form',
                items: [TXT_TV_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [CB_RECEBER_PAGAR]
            }, {
                columnWidth: 0.25,
                layout: 'form',
                items: [combo_CODIGO_VENDEDOR]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [BTN_TV_CONFIRMAR]
            }]
        }]
    });

    // Fluxo de Caixa Realizado

    var TXT_DATAR1 = new Ext.form.DateField({
        id: 'TXT_DATAR1',
        name: 'TXT_DATAR1',
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAR2 = new Ext.form.DateField({
        id: 'TXT_DATAR2',
        name: 'TXT_DATAR2',
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var rdt1 = new Date();

    Ext.getCmp('TXT_DATAR1').setValue(rdt1.getFirstDateOfMonth());
    Ext.getCmp('TXT_DATAR2').setValue(rdt1.getLastDateOfMonth());

    var cb_ResumidoDetalhado = new Ext.form.ComboBox({
        fieldLabel: 'Detalhado/Resumido',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        width: 120,
        emptyText: 'Selecione aqui...',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['D', 'Detalhado'], ['R', 'Resumido']]
        }),
        value: 'D'
    });

    CARREGA_COMBO_BANCO();

    var CB_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250
    });

    var BTN_TV_CONFIRMAR_REALIZADO = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            if (!Ext.getCmp('formTV').getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            var banco = CB_NUMERO_BANCO.getValue() == '' ? 0 : CB_NUMERO_BANCO.getValue();

            _ajax.setUrl('servicos/RELATORIOS.asmx/FluxoRealizado');
            _ajax.setJsonData({
                dt1: Ext.getCmp('TXT_DATAR1').getRawValue(),
                dt2: Ext.getCmp('TXT_DATAR2').getRawValue(),
                ResumidoDetalhado: cb_ResumidoDetalhado.getValue(),
                Banco: banco,
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsR = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Fluxo de Caixa Realizado',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAR1]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_DATAR2]
            }, {
                columnWidth: 0.18,
                layout: 'form',
                items: [cb_ResumidoDetalhado]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [CB_NUMERO_BANCO]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [BTN_TV_CONFIRMAR_REALIZADO]
            }]
        }]
    });


    //// Fluxo Previsão

    var TXT_DATAP1 = new Ext.form.DateField({
        id: 'TXT_DATAP1',
        name: 'TXT_DATAP1',
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAP2 = new Ext.form.DateField({
        id: 'TXT_DATAP2',
        name: 'TXT_DATAP2',
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var previsao = rdt1;
    previsao.setDate(rdt1.getDate() + 1);

    Ext.getCmp('TXT_DATAP1').setValue(previsao);
    Ext.getCmp('TXT_DATAP2').setValue(rdt1.getLastDateOfMonth());

    var cb_ResumidoDetalhado2 = new Ext.form.ComboBox({
        fieldLabel: 'Detalhado/Resumido',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        width: 120,
        emptyText: 'Selecione aqui...',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['D', 'Detalhado'], ['R', 'Resumido']]
        }),
        value: 'D'
    });

    var CB_NUMERO_BANCO1 = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250
    });

    var TXT_PREV_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Cliente / Fornecedor',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var CB_RECEBER_PAGAR1 = new Ext.form.ComboBox({
        fieldLabel: 'A Receber / Pagar',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 100,
        allowBlank: false,
        value: 'R',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['R', 'Receber'], ['P', 'Pagar']]
        })
    });

    var BTN_TV_CONFIRMAR_PREVISAO = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            var banco = CB_NUMERO_BANCO1.getValue() == '' ? 0 : CB_NUMERO_BANCO1.getValue();

            var _ajax = new Th2_Ajax();

            _ajax.setUrl('servicos/RELATORIOS.asmx/FluxoPrevisao');
            _ajax.setJsonData({
                dt1: Ext.getCmp('TXT_DATAP1').getRawValue(),
                dt2: Ext.getCmp('TXT_DATAP2').getRawValue(),
                CLIENTE: TXT_PREV_CLIENTE_FORNECEDOR.getValue(),
                ResumidoDetalhado: cb_ResumidoDetalhado2.getValue(),
                Banco: banco,
                RECEBER_PAGAR: CB_RECEBER_PAGAR1.getValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsP = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Fluxo de Caixa Previs&atilde;o',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAP1]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_DATAP2]
            }, {
                columnWidth: 0.18,
                layout: 'form',
                items: [cb_ResumidoDetalhado2]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [CB_RECEBER_PAGAR1]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [CB_NUMERO_BANCO1]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.30,
                layout: 'form',
                items: [TXT_PREV_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [BTN_TV_CONFIRMAR_PREVISAO]
            }]
        }]
    });


    // Contas a Receber por emissão

    var TXT_DATAE1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAE2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var previsao = rdt1;
    previsao.setDate(rdt1.getDate() + 1);

    TXT_DATAE1.setValue(rdt1.getFirstDateOfMonth());
    TXT_DATAE2.setValue(rdt1.getLastDateOfMonth());

    var CB_NUMERO_BANCO2 = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250
    });

    var BTN_TV_CONFIRMAR_EMISSAO = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            var _ajax = new Th2_Ajax();

            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Financeiro_Titulos_Emissao');
            _ajax.setJsonData({
                data1: TXT_DATAE1.getRawValue(),
                data2: TXT_DATAE2.getRawValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsE = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Contas a Receber por Emiss&atilde;o',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAE1]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_DATAE2]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [BTN_TV_CONFIRMAR_EMISSAO]
            }]
        }]
    });

    ////////////////////////////

    var formTV = new Ext.FormPanel({
        id: 'formTV',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 500,
        items: [fsTV, fsR, fsP, fsE]
    });

    var panelTV = new Ext.Panel({
        width: '100%',
        height: '100%',
        border: true,
        title: 'Relat&oacute;rios de Posi&ccedil;&atilde;o Financeira',
        items: [formTV]
    });

    formTV.setHeight(AlturaDoPainelDeConteudo(0) - 56);

    return panelTV;
}