var combo_EMAIL_CONTA_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_CONTA_EMAIL', 'CONTA_EMAIL', 'SERVIDOR_HOST', 'SENHA', 'ID_USUARIO', 'PORTA', 'SSL', 'PASTA_ANEXOS', 'ASSINATURA', 'ENVIO_CONFIRMACAO_ENTREGA']
       ),
    sortInfo: {
        field: 'CONTA_EMAIL',
        direction: 'ASC'
    }
});

function CARREGA_EMAIL_CONTA(ID_USUARIO) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Lista_Conta_Email');
    _ajax.setJsonData({
        ID_USUARIO: ID_USUARIO ? ID_USUARIO : 0,
        ID_USUARIO_ORIGINAL: ID_USUARIO ? ID_USUARIO : 0
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        combo_EMAIL_CONTA_Store.loadData(criaObjetoXML(result), false);

        if (combo_EMAIL_CONTA_Store.getCount() > 0) {
            Ext.getCmp('CB_EMAIL_CONTA').setValue(combo_EMAIL_CONTA_Store.getAt(0).data.ID_CONTA_EMAIL);
            Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
            _record_conta_email = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', Ext.getCmp('CB_EMAIL_CONTA').getValue()));

        }
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function janelaEmailConta() {

    var TXT_ID_CONTA_EMAIL = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_CONTA_EMAIL',
        id: 'ID_CONTA_EMAIL',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15', disabled: true }
    });

    var TXT_CONTA_EMAIL = new Ext.form.TextField({
        fieldLabel: 'Conta de e-mail',
        name: 'CONTA_EMAIL',
        id: 'CONTA_EMAIL',
        allowBlank: false,
        width: 250,
        maxLength: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 100 },
        vtype: 'email'
    });

    Carrega_Combo_Usuarios();

    var combo_USUARIO = new Ext.form.ComboBox({
        store: combo_TB_USUARIO_Store,
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        fieldLabel: 'Usu&aacute;rio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 150,
        allowBlank: false
    });

    var TXT_SERVIDOR_HOST = new Ext.form.TextField({
        fieldLabel: 'Servidor POP3',
        width: 220,
        name: 'SERVIDOR_HOST',
        id: 'SERVIDOR_HOST',
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_EMAIL_CONTA();
                }
            }
        }
    });

    var TXT_SENHA = new Ext.form.TextField({
        fieldLabel: 'Senha',
        name: 'SENHA',
        id: 'SENHA',
        inputType: 'password',
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35' },
        width: 150
    });

    var TXT_PORTA = new Ext.form.NumberField({
        fieldLabel: 'Porta',
        width: 50,
        name: 'PORTA',
        id: 'PORTA',
        maxLength: 6,
        minValue: 0,
        decimalPrecision: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '6' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_EMAIL_CONTA();
                }
            }
        }
    });

    var CB_SSL = new Ext.form.Checkbox({
        boxLabel: 'SSL'
    });

    var TXT_COTA_BYTES = new Ext.form.NumberField({
        fieldLabel: 'Espa&ccedil;o em disco (Megabytes)',
        width: 90,
        name: 'COTA_BYTES',
        id: 'COTA_BYTES',
        maxLength: 18,
        minValue: 0.001,
        decimalPrecision: 3,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_EMAIL_CONTA();
                }
            }
        }
    });

    var TXT_PASTA_ANEXOS = new Ext.form.TextField({
        fieldLabel: 'Pasta onde serão gravados os anexos',
        name: 'PASTA_ANEXOS',
        id: 'PASTA_ANEXOS',
        maxLength: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '200' },
        width: 300
    });

    var CB_ENVIO_LEITURA = new Ext.form.Checkbox({
        boxLabel: 'Envia notificação de leitura'
    });

    var CB_ENTREGA = new Ext.form.Checkbox({
        boxLabel: 'Recebe confirma&ccedil;&atilde;o de entrega'
    });

    var TXT_ASSINATURA = new Ext.form.HtmlEditor({
        fieldLabel: 'Assinatura',
        width: 800,
        height: 170,
        allowBlank: false
    });

    TXT_ASSINATURA.on('render', function (h) {
        h.setValue('<div></div>');
        h.focus(false);
    });

    var formEMAIL_CONTA = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 350,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_ID_CONTA_EMAIL]
            }, {
                columnWidth: .30,
                layout: 'form',
                items: [TXT_CONTA_EMAIL]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_SENHA]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [combo_USUARIO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .28,
                layout: 'form',
                items: [TXT_SERVIDOR_HOST]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [TXT_PORTA]
            }, {
                columnWidth: .08,
                layout: 'form',
                items: [CB_SSL]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_COTA_BYTES]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .40,
                items: [TXT_PASTA_ANEXOS]
            }, {
                layout: 'form',
                columnWidth: .30,
                items: [CB_ENVIO_LEITURA]
            }, {
                layout: 'form',
                columnWidth: .30,
                items: [CB_ENTREGA]
            }]
        }, {
            layout: 'form',
            items: [TXT_ASSINATURA]
        }]
    });

    function PopulaFormulario_TB_EMAIL_CONTA(record) {
        formEMAIL_CONTA.getForm().loadRecord(record);

        combo_USUARIO.setValue(record.data.ID_USUARIO);
        CB_SSL.setValue(record.data.SSL == 1 ? true : false);
        CB_ENVIO_LEITURA.setValue(record.data.ENVIO_CONFIRMACAO_RECEBIMENTO_LEITURA == 1 ? true : false);
        CB_ENTREGA.setValue(record.data.ENVIO_CONFIRMACAO_ENTREGA == 1 ? true : false);

        TXT_ASSINATURA.setValue(record.data.ASSINATURA);
        wEMAIL_CONTA.setTitle('Alterar dados da conta de e-mail');

        buttonGroup1.items.items[32].enable();
        formEMAIL_CONTA.getForm().items.items[0].disable();

        TXT_CONTA_EMAIL.focus();
    }

    var TB_EMAIL_CONTA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
    ['ID_CONTA_EMAIL', 'CONTA_EMAIL', 'SENHA', 'SERVIDOR_HOST',
    'ID_USUARIO', 'LOGIN_USUARIO', 'PORTA', 'SSL', 'COTA_BYTES', 'PASTA_ANEXOS', 'ENVIO_CONFIRMACAO_RECEBIMENTO_LEITURA',
    'ASSINATURA', 'ENVIO_CONFIRMACAO_ENTREGA']
    )
    });

    var gridEMAIL_CONTA = new Ext.grid.GridPanel({
        store: TB_EMAIL_CONTA_Store,
        columns: [
                    { id: 'ID_CONTA_EMAIL', header: "C&oacute;digo", width: 80, sortable: true, dataIndex: 'ID_CONTA_EMAIL' },
                    { id: 'CONTA_EMAIL', header: "Conta de e-mail", width: 240, sortable: true, dataIndex: 'CONTA_EMAIL' },
                    { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 130, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                    { id: 'SERVIDOR_HOST', header: "Servidor POP3", width: 250, sortable: true, dataIndex: 'SERVIDOR_HOST' },
                    { id: 'PORTA', header: "Porta", width: 60, sortable: true, dataIndex: 'PORTA' },
                    { id: 'COTA_BYTES', header: "Espa&ccedil;o MB", width: 110, sortable: true, dataIndex: 'COTA_BYTES' },
                    { id: 'SSL', header: "SSL", width: 50, sortable: true, dataIndex: 'SSL', renderer: TrataCombo01 },
                    { id: 'PASTA_ANEXOS', header: "Pasta onde s&atilde;o gravados os anexos", width: 250, sortable: true, dataIndex: 'PASTA_ANEXOS' }
                    ],
        stripeRows: true,
        height: 120,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridEMAIL_CONTA.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_EMAIL_CONTA(record);
    });

    gridEMAIL_CONTA.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridEMAIL_CONTA.getSelectionModel().getSelections().length > 0) {
                var record = gridEMAIL_CONTA.getSelectionModel().getSelected();
                PopulaFormulario_TB_EMAIL_CONTA(record);
            }
        }
    });

    var combo_FILTRO_USUARIO = new Ext.form.ComboBox({
        store: combo_TB_USUARIO_Store,
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        fieldLabel: 'Filtrar por Usu&aacute;rio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 150,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_EMAIL_CONTA_CARREGA_GRID();
                }
            },
            render: function (c) {
                c.setValue(_ID_USUARIO);
                TB_EMAIL_CONTA_CARREGA_GRID();
            }
        }
    });

    var BTN_FILTRO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_EMAIL_CONTA_CARREGA_GRID();
        }
    });

    function TB_EMAIL_CONTA_CARREGA_GRID() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Carrega_Conta_Email');
        _ajax.setJsonData({
            ID_USUARIO: combo_FILTRO_USUARIO.getValue() == '' ? 0 : combo_FILTRO_USUARIO.getValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO ?  _ID_USUARIO : 1
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TB_EMAIL_CONTA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ///////////////////////////
    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_EMAIL_CONTA();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Conta de e-mail',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup1.items.items[32].disable();

                                    formEMAIL_CONTA.getForm().items.items[0].enable();

                                    TXT_CONTA_EMAIL.focus();

                                    Reseta_Formulario();

                                    wEMAIL_CONTA.setTitle('Nova Conta de e-mail');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_EMAIL_CONTA',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_EMAIL_CONTA();
                                 }
                             }]
    });

    var toolbar_TB_EMAIL_CONTA = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var form1 = new Ext.FormPanel({
        labelAlign: 'left',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 120,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [combo_FILTRO_USUARIO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [BTN_FILTRO]
            }]
        }]
    });

    var panelCadastro = new Ext.Panel({
        width: '100%',
        border: true,
        frame: true,
        items: [formEMAIL_CONTA, toolbar_TB_EMAIL_CONTA, gridEMAIL_CONTA, form1]
    });

    function GravaDados_TB_EMAIL_CONTA() {
        if (!formEMAIL_CONTA.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_CONTA_EMAIL: TXT_ID_CONTA_EMAIL.getValue(),
            CONTA_EMAIL: TXT_CONTA_EMAIL.getValue(),
            SENHA: TXT_SENHA.getValue(),
            ID_USUARIO: combo_USUARIO.getValue(),
            SERVIDOR_HOST: TXT_SERVIDOR_HOST.getValue(),
            PORTA: TXT_PORTA.getValue(),
            SSL: CB_SSL.checked ? 1 : 0,
            COTA_BYTES: TXT_COTA_BYTES.getValue(),
            PASTA_ANEXOS: TXT_PASTA_ANEXOS.getValue(),
            ENVIO_CONFIRMACAO_RECEBIMENTO_LEITURA: CB_ENVIO_LEITURA.checked ? 1 : 0,
            ENVIO_CONFIRMACAO_ENTREGA: CB_ENTREGA.checked ? 1 : 0,
            ASSINATURA: TXT_ASSINATURA.getValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        };

        var Url = wEMAIL_CONTA.title == "Nova Conta de e-mail" ?
                        'servicos/TB_EMAIL.asmx/Grava_Nota_Conta_Email' :
                        'servicos/TB_EMAIL.asmx/Atualiza_Conta_Email';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (wEMAIL_CONTA.title == "Nova Conta de e-mail") {
                Reseta_Formulario();
            }

            TXT_CONTA_EMAIL.focus();

            CARREGA_EMAIL_CONTA(_ID_USUARIO);
            TB_EMAIL_CONTA_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Reseta_Formulario() {
        TXT_ID_CONTA_EMAIL.reset();
        TXT_CONTA_EMAIL.reset();
        TXT_SENHA.reset();
        combo_USUARIO.reset();
        TXT_ASSINATURA.reset();
    }

    function Deleta_TB_EMAIL_CONTA() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta conta de e-mail?', formEMAIL_CONTA.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_EMAIL.asmx/Deleta_Conta_Email');
                _ajax.setJsonData({ 
                    ID_CONTA_EMAIL: TXT_ID_CONTA_EMAIL.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    wEMAIL_CONTA.setTitle("Nova Conta de e-mail");
                    TXT_CONTA_EMAIL.focus();
                    Reseta_Formulario();

                    buttonGroup1.items.items[32].disable();
                    formEMAIL_CONTA.getForm().items.items[0].enable();

                    CARREGA_EMAIL_CONTA(_ID_USUARIO);
                    TB_EMAIL_CONTA_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var wEMAIL_CONTA = new Ext.Window({
        layout: 'form',
        iconCls: 'icone_TB_USUARIO',
        title: 'Nova Conta de e-mail',
        width: 1000,
        height: 601,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [panelCadastro]
    });

    this.show = function (elm) {
        wEMAIL_CONTA.show(elm);
    };
}