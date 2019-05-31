var combo_TB_BANCO_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['NUMERO_BANCO', 'NOME_BANCO'])
});

function CARREGA_COMBO_BANCO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_BANCO.asmx/Lista_Banco');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_BANCO_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroBanco() {

    function BuscaBanco(NUMERO_BANCO) {
        var Url = 'servicos/TB_BANCO.asmx/Busca_Banco';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({
            NUMERO_BANCO: NUMERO_BANCO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('NOME_BANCO').setValue(result);

            panelCadastroBANCO.setTitle('Alterar dados do Banco');

            buttonGroup_TB_BANCO.items.items[32].enable();
            formBANCO.getForm().items.items[0].disable();

            formBANCO.getForm().findField('NOME_BANCO').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TXT_NUMERO_BANCO = new Ext.form.NumberField({
        fieldLabel: 'Numero do Banco',
        width: 100,
        name: 'NUMERO_BANCO',
        id: 'NUMERO_BANCO',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    BuscaBanco(f.getValue());
            }
        }
    });

    var TXT_NOME_BANCO = new Ext.form.TextField({
        fieldLabel: 'Nome do Banco',
        name: 'NOME_BANCO',
        id: 'NOME_BANCO',
        width: 380,
        allowBlank: false,
        msgTarget: 'side',
        maxLenght: 45,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '45' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_BANCO();
                }
            }
        }
    });

    var formBANCO = new Ext.FormPanel({
        id: 'formBANCO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 180,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Bancos',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_NUMERO_BANCO]
            }, {
                layout: 'form',
                items: [TXT_NOME_BANCO]
            }]
        }]
    });

    function PopulaFormulario_TB_BANCO(record) {
        formBANCO.getForm().loadRecord(record);
        panelCadastroBANCO.setTitle('Alterar dados do Banco');

        buttonGroup_TB_BANCO.items.items[32].enable();
        formBANCO.getForm().items.items[0].disable();

        formBANCO.getForm().findField('NOME_BANCO').focus();
    }

    var TB_BANCO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['NUMERO_BANCO', 'NOME_BANCO']
                    )
    });

    var gridBANCO = new Ext.grid.GridPanel({
        id: 'gridBANCO',
        store: TB_BANCO_Store,
        columns: [
                    { id: 'NUMERO_BANCO', header: "C&oacute;digo", width: 80, sortable: true, dataIndex: 'NUMERO_BANCO' },
                    { id: 'NOME_BANCO', header: "Banco", width: 600, sortable: true, dataIndex: 'NOME_BANCO' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridBANCO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_BANCO(record);
    });

    gridBANCO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridBANCO.getSelectionModel().getSelections().length > 0) {
                var record = gridBANCO.getSelectionModel().getSelected();
                PopulaFormulario_TB_BANCO(record);
            }
        }
    });

    function Apoio_PopulaGrNUMERO_BANCO(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_BANCO_CARREGA_GRID();
        }
    }

    function RetornaBANCO_JsonData() {
        var LOCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return LOCAL_JsonData;
    }

    var BANCO_PagingToolbar = new Th2_PagingToolbar();
    BANCO_PagingToolbar.setUrl('servicos/TB_BANCO.asmx/Carrega_Banco');
    BANCO_PagingToolbar.setStore(TB_BANCO_Store);

    function TB_BANCO_CARREGA_GRID() {
        BANCO_PagingToolbar.setParamsJsonData(RetornaBANCO_JsonData());
        BANCO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_BANCO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_BANCO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Banco',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_BANCO.items.items[32].disable();

                                    formBANCO.getForm().items.items[0].enable();

                                    formBANCO.getForm().findField('NUMERO_BANCO').focus();
                                    formBANCO.getForm().reset();
                                    panelCadastroBANCO.setTitle('Novo Banco');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_BANCO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_BANCO();
                                 }
                             }]
    });

    var toolbar_TB_BANCO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_BANCO]
    });

    var panelCadastroBANCO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Banco',
        items: [formBANCO, toolbar_TB_BANCO, gridBANCO, BANCO_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_BANCO() {
        if (!formBANCO.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_BANCO: formBANCO.getForm().findField('NUMERO_BANCO').getValue(),
            NOME_BANCO: formBANCO.getForm().findField('NOME_BANCO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroBANCO.title == "Novo Banco" ?
                        'servicos/TB_BANCO.asmx/GravaNovoBanco' :
                        'servicos/TB_BANCO.asmx/AtualizaBanco';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroBANCO.title == "Novo Banco") {
                Ext.getCmp('NUMERO_BANCO').focus();
                formBANCO.getForm().reset();
            }
            else
                Ext.getCmp('NOME_BANCO').focus();

            TB_BANCO_CARREGA_GRID();
            CARREGA_COMBO_BANCO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_BANCO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Banco [' +
                        formBANCO.getForm().findField('NOME_BANCO').getValue() + ']?', 'formBANCO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_BANCO.asmx/DeletaBanco');
                _ajax.setJsonData({ 
                    NUMERO_BANCO: formBANCO.getForm().findField('NUMERO_BANCO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroBANCO.setTitle("Novo Banco");

                    formBANCO.getForm().reset();

                    formBANCO.getForm().items.items[0].enable();
                    Ext.getCmp('NUMERO_BANCO').focus();

                    buttonGroup_TB_BANCO.items.items[32].disable();

                    TB_BANCO_CARREGA_GRID();
                    CARREGA_COMBO_BANCO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridBANCO.setHeight(AlturaDoPainelDeConteudo(formBANCO.height) - 125);

    TB_BANCO_CARREGA_GRID();

    return panelCadastroBANCO;
}