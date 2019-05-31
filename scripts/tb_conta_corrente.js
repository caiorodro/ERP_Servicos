
function MontaCadastroContaCorrente() {

    function BuscaContaCorrente(NUMERO_AGENCIA, NUMERO_CONTA) {
        var Url = 'servicos/TB_CONTA_CORRENTE.asmx/Busca_Conta_Corrente';

        var dados = {
            NUMERO_AGENCIA: NUMERO_AGENCIA,
            NUMERO_CONTA: NUMERO_CONTA,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('CB_CONTA_NUMERO_BANCO').setValue(result.NUMERO_BANCO);
            Ext.getCmp('ULTIMA_REMESSA').setValue(result.ULTIMA_REMESSA);

            panelCadastroCONTA_CORRENTE.setTitle('Alterar dados da Conta Corrente');

            buttonGroup_TB_CONTA_CORRENTE.items.items[32].enable();
            formCONTA_CORRENTE.getForm().items.items[0].disable();
            formCONTA_CORRENTE.getForm().items.items[1].disable();

            Ext.getCmp('CB_CONTA_NUMERO_BANCO').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TXT_NUMERO_AGENCIA = new Ext.form.TextField({
        fieldLabel: 'Numero da Ag&ecirc;ncia',
        width: 80,
        name: 'NUMERO_AGENCIA',
        id: 'NUMERO_AGENCIA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 8,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '8' }
    });

    var TXT_NUMERO_CONTA = new Ext.form.TextField({
        fieldLabel: 'Numero da Conta',
        width: 120,
        name: 'NUMERO_CONTA',
        id: 'NUMERO_CONTA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    BuscaContaCorrente(Ext.getCmp('NUMERO_AGENCIA').getValue(), f.getValue());
            }
        }
    });

    CARREGA_COMBO_BANCO();

    var combo_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        id: 'CB_CONTA_NUMERO_BANCO',
        name: 'CB_CONTA_NUMERO_BANCO',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 300,
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_ULTIMA_REMESSA = new Ext.form.NumberField({
        fieldLabel: 'Ultima Remessa',
        width: 90,
        name: 'ULTIMA_REMESSA',
        id: 'ULTIMA_REMESSA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        minValue: 0
    });

    var TXT_CONTROLE_NOSSO_NUMERO = new Ext.form.TextField({
        fieldLabel: 'Controle (Nosso Numero CNAB)',
        width: 120,
        name: 'CONTROLE_NOSSO_NUMERO',
        id: 'CONTROLE_NOSSO_NUMERO',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_CONTA_CORRENTE();
                }
            }
        }
    });

    var formCONTA_CORRENTE = new Ext.FormPanel({
        id: 'formCONTA_CORRENTE',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 205,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Conta Corrente',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.17,
                    layout: 'form',
                    items: [TXT_NUMERO_AGENCIA]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [TXT_NUMERO_CONTA]
                }]
            }, {
                layout: 'form',
                items: [combo_NUMERO_BANCO]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_ULTIMA_REMESSA]

                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_CONTROLE_NOSSO_NUMERO]
                }]
            }, {
            }]
        }]
    });

    function PopulaFormulario_TB_CONTA_CORRENTE(record) {
        formCONTA_CORRENTE.getForm().loadRecord(record);

        Ext.getCmp('CB_CONTA_NUMERO_BANCO').setValue(record.data.NUMERO_BANCO);

        panelCadastroCONTA_CORRENTE.setTitle('Alterar dados da Conta Corrente');

        buttonGroup_TB_CONTA_CORRENTE.items.items[32].enable();
        formCONTA_CORRENTE.getForm().items.items[0].disable();
        formCONTA_CORRENTE.getForm().items.items[1].disable();

        formCONTA_CORRENTE.getForm().findField('CB_CONTA_NUMERO_BANCO').focus();
    }

    var TB_CONTA_CORRENTE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['NUMERO_AGENCIA', 'NUMERO_CONTA', 'NUMERO_BANCO', 'NOME_BANCO', 'ULTIMA_REMESSA', 'CONTROLE_NOSSO_NUMERO'])
    });

    var gridCONTA_CORRENTE = new Ext.grid.GridPanel({
        id: 'gridCONTA_CORRENTE',
        store: TB_CONTA_CORRENTE_Store,
        columns: [
                    { id: 'NUMERO_AGENCIA', header: "Ag&ecirc;ncia", width: 80, sortable: true, dataIndex: 'NUMERO_AGENCIA' },
                    { id: 'NUMERO_CONTA', header: "Conta Corrente", width: 110, sortable: true, dataIndex: 'NUMERO_CONTA' },
                    { id: 'NOME_BANCO', header: "Banco", width: 400, sortable: true, dataIndex: 'NOME_BANCO' },
                    { id: 'ULTIMA_REMESSA', header: "Ultima Remessa", width: 90, sortable: true, dataIndex: 'ULTIMA_REMESSA' },
                    { id: 'CONTROLE_NOSSO_NUMERO', header: "Controle (Nosso Numero CNAB)", width: 250, sortable: true, dataIndex: 'CONTROLE_NOSSO_NUMERO' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridCONTA_CORRENTE.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_CONTA_CORRENTE(record);
    });

    gridCONTA_CORRENTE.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridCONTA_CORRENTE.getSelectionModel().getSelections().length > 0) {
                var record = gridCONTA_CORRENTE.getSelectionModel().getSelected();
                PopulaFormulario_TB_CONTA_CORRENTE(record);
            }
        }
    });

    function Apoio_PopulaGridConta_Corrente(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_CONTA_CORRENTE_CARREGA_GRID();
        }
    }

    function RetornaCONTA_CORRENTE_JsonData() {
        var agencia = Ext.getCmp('TXT_FILTRO_AGENCIA') ? Ext.getCmp('TXT_FILTRO_AGENCIA').getValue() : '';
        var conta = Ext.getCmp('TXT_FILTRO_CONTA') ? Ext.getCmp('TXT_FILTRO_CONTA').getValue() : '';
        var banco = Ext.getCmp('combo_FILTRO_NUMERO_BANCO_CONTA') ? Ext.getCmp('combo_FILTRO_NUMERO_BANCO_CONTA').getValue() : 0;

        if (agencia == undefined) agencia = '';
        if (conta == undefined) conta = '';
        if (banco == '') banco = 0;

        var LOCAL_JsonData = {
            NUMERO_AGENCIA: agencia,
            NUMERO_CONTA: conta,
            NUMERO_BANCO: banco,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return LOCAL_JsonData;
    }

    var CONTA_CORRENTE_PagingToolbar = new Th2_PagingToolbar();
    CONTA_CORRENTE_PagingToolbar.setUrl('servicos/TB_CONTA_CORRENTE.asmx/Carrega_Conta_Corrente');
    CONTA_CORRENTE_PagingToolbar.setParamsJsonData(RetornaCONTA_CORRENTE_JsonData());
    CONTA_CORRENTE_PagingToolbar.setStore(TB_CONTA_CORRENTE_Store);

    function TB_CONTA_CORRENTE_CARREGA_GRID() {
        CONTA_CORRENTE_PagingToolbar.setParamsJsonData(RetornaCONTA_CORRENTE_JsonData());
        CONTA_CORRENTE_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_CONTA_CORRENTE = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_CONTA_CORRENTE();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Conta Corrente',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_CONTA_CORRENTE.items.items[32].disable();

                                    formCONTA_CORRENTE.getForm().items.items[0].enable();
                                    formCONTA_CORRENTE.getForm().items.items[1].enable();

                                    formCONTA_CORRENTE.getForm().findField('NUMERO_AGENCIA').focus();
                                    formCONTA_CORRENTE.getForm().reset();
                                    panelCadastroCONTA_CORRENTE.setTitle('Nova Conta Corrente');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_CONTA_CORRENTE',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_CONTA_CORRENTE();
                                 }
                             }]
    });

    var toolbar_TB_CONTA_CORRENTE = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_CONTA_CORRENTE]
    });

    var TXT_FILTRO_AGENCIA = new Ext.form.TextField({
        fieldLabel: 'Ag&ecirc;ncia',
        name: 'TXT_FILTRO_AGENCIA',
        id: 'TXT_FILTRO_AGENCIA',
        width: 75,
        maxLenght: 8,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '8' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    TB_CONTA_CORRENTE_CARREGA_GRID();
            }
        }
    });

    var TXT_FILTRO_CONTA = new Ext.form.TextField({
        fieldLabel: 'Conta',
        name: 'TXT_FILTRO_CONTA',
        id: 'TXT_FILTRO_CONTA',
        width: 120,
        maxLenght: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    TB_CONTA_CORRENTE_CARREGA_GRID();
            }
        }
    });

    var combo_FILTRO_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        id: 'combo_FILTRO_NUMERO_BANCO_CONTA',
        name: 'combo_FILTRO_NUMERO_BANCO_CONTA',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    TB_CONTA_CORRENTE_CARREGA_GRID();
            }
        }
    });

    var BTN_FILTRO_REMESSA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_CONTA_CORRENTE_CARREGA_GRID()
        }
    });

    var panelCadastroCONTA_CORRENTE = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Nova Conta Corrente',
        items: [formCONTA_CORRENTE, toolbar_TB_CONTA_CORRENTE, gridCONTA_CORRENTE, CONTA_CORRENTE_PagingToolbar.PagingToolbar(),
                {
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: '100%',
                    items: [{
                        layout: 'column',
                        items: [{
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 52,
                            columnWidth: .15,
                            items: [TXT_FILTRO_AGENCIA]
                        }, {
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 40,
                            columnWidth: .20,
                            items: [TXT_FILTRO_CONTA]
                        }, {
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 35,
                            columnWidth: .32,
                            items: [combo_FILTRO_NUMERO_BANCO]
                        }, {
                            columnWidth: .10,
                            items: [BTN_FILTRO_REMESSA]
                        }]
                    }]
                }]
    });

    function GravaDados_TB_CONTA_CORRENTE() {
        if (!formCONTA_CORRENTE.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_AGENCIA: Ext.getCmp('NUMERO_AGENCIA').getValue(),
            NUMERO_CONTA: Ext.getCmp('NUMERO_CONTA').getValue(),
            NUMERO_BANCO: Ext.getCmp('CB_CONTA_NUMERO_BANCO').getValue(),
            ULTIMA_REMESSA: Ext.getCmp('ULTIMA_REMESSA').getValue(),
            CONTROLE_NOSSO_NUMERO: Ext.getCmp('CONTROLE_NOSSO_NUMERO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroCONTA_CORRENTE.title == "Nova Conta Corrente" ?
                        'servicos/TB_CONTA_CORRENTE.asmx/GravaNovaConta' :
                        'servicos/TB_CONTA_CORRENTE.asmx/AtualizaConta';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCONTA_CORRENTE.title == "Nova Conta Corrente") {
                Ext.getCmp('NUMERO_AGENCIA').focus();
                formCONTA_CORRENTE.getForm().reset();
            }
            else
                Ext.getCmp('CB_CONTA_NUMERO_BANCO').focus();

            TB_CONTA_CORRENTE_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_CONTA_CORRENTE() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Conta [' +
                        formCONTA_CORRENTE.getForm().findField('NUMERO_CONTA').getValue() + ']?', 'formCONTA_CORRENTE', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CONTA_CORRENTE.asmx/DeletaConta');
                _ajax.setJsonData({ 
                    NUMERO_AGENCIA: Ext.getCmp('NUMERO_AGENCIA').getValue(),
                    NUMERO_CONTA: Ext.getCmp('NUMERO_CONTA').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroCONTA_CORRENTE.setTitle("Nova Conta Corrente");

                    formCONTA_CORRENTE.getForm().reset();

                    formCONTA_CORRENTE.getForm().items.items[0].enable();
                    formCONTA_CORRENTE.getForm().items.items[1].enable();
                    Ext.getCmp('NUMERO_AGENCIA').focus();

                    buttonGroup_TB_CONTA_CORRENTE.items.items[32].disable();

                    TB_CONTA_CORRENTE_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridCONTA_CORRENTE.setHeight(AlturaDoPainelDeConteudo(formCONTA_CORRENTE.height) - 170);

    TB_CONTA_CORRENTE_CARREGA_GRID();

    return panelCadastroCONTA_CORRENTE;
}