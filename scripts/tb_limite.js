var combo_TB_LIMITE_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_LIMITE', 'VALOR_LIMITE']
       )
});

function TB_LIMITE_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_LIMITE.asmx/Lista_Limite');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_LIMITE_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroLimite() {

    var TXT_ID_LIMITE = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_LIMITE',
        id: 'ID_LIMITE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_VALOR_LIMITE = new Ext.form.NumberField({
        fieldLabel: 'Valor do Limite',
        name: 'VALOR_LIMITE',
        id: 'VALOR_LIMITE',
        allowBlank: false,
        msgTarget: 'side',
        width: 110,
        minValue: 1,
        decimalPrecision: 2,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var formLIMITE = new Ext.FormPanel({
        id: 'formLIMITE',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 170,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Limite de Cr&eacute;dito para clientes - Total em Aberto + T&iacute;tulos Vencidos',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_ID_LIMITE]
            }, {
                layout: 'form',
                items: [TXT_VALOR_LIMITE]
            }]
        }]
    });

    function PopulaFormulario_TB_LIMITE(record) {
        formLIMITE.getForm().loadRecord(record);
        panelCadastroLIMITE.setTitle('Alterar dados do Limite');

        buttonGroup_TB_LIMITE.items.items[32].enable();
        formLIMITE.getForm().items.items[0].disable();

        formLIMITE.getForm().findField('VALOR_LIMITE').focus();
    }

    var TB_LIMITE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_LIMITE', 'VALOR_LIMITE']
                    )
    });

    var gridLIMITE = new Ext.grid.GridPanel({
        id: 'gridLIMITE',
        store: TB_LIMITE_Store,
        columns: [
                    { id: 'ID_LIMITE', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_LIMITE' },
                    { id: 'VALOR_LIMITE', header: "Valor do Limite", width: 150, sortable: true, dataIndex: 'VALOR_LIMITE', renderer: FormataValor }
                    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(296),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridLIMITE.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_LIMITE(record);
    });

    gridLIMITE.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridLIMITE.getSelectionModel().getSelections().length > 0) {
                var record = gridLIMITE.getSelectionModel().getSelected();
                PopulaFormulario_TB_LIMITE(record);
            }
        }
    });

    function RetornaLIMITE_JsonData() {
        var CLAS_FISCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var LIMITE_PagingToolbar = new Th2_PagingToolbar();
    LIMITE_PagingToolbar.setUrl('servicos/TB_LIMITE.asmx/Carrega_Limite');
    LIMITE_PagingToolbar.setParamsJsonData(RetornaLIMITE_JsonData());
    LIMITE_PagingToolbar.setStore(TB_LIMITE_Store);

    function TB_LIMITE_CARREGA_GRID() {
        LIMITE_PagingToolbar.setParamsJsonData(RetornaLIMITE_JsonData());
        LIMITE_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_LIMITE = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_LIMITE();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Limite',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_LIMITE.items.items[32].disable();

                                    formLIMITE.getForm().items.items[0].enable();

                                    formLIMITE.getForm().findField('VALOR_LIMITE').focus();
                                    formLIMITE.getForm().reset();
                                    panelCadastroLIMITE.setTitle('Novo Limite');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_LIMITE',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_LIMITE();
                                 }
                             }]
    });

    var toolbar_TB_LIMITE = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_LIMITE]
    });

    var panelCadastroLIMITE = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Limite',
        items: [formLIMITE, toolbar_TB_LIMITE, gridLIMITE, LIMITE_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_LIMITE() {
        if (!formLIMITE.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_LIMITE: formLIMITE.getForm().findField('ID_LIMITE').getValue(),
            VALOR_LIMITE: formLIMITE.getForm().findField('VALOR_LIMITE').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroLIMITE.title == "Novo Limite" ?
                        'servicos/TB_LIMITE.asmx/GravaNovoLimite' :
                        'servicos/TB_LIMITE.asmx/AtualizaLimite';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroLIMITE.title == "Novo Limite") {
                formLIMITE.getForm().reset();
            }

            formLIMITE.getForm().findField('VALOR_LIMITE').focus();

            TB_LIMITE_CARREGA_GRID();
            TB_LIMITE_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_LIMITE() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Limite [' +
                        formLIMITE.getForm().findField('ID_LIMITE').getValue() + ']?', 'formLIMITE', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_LIMITE.asmx/DeletaLimite');
                _ajax.setJsonData({
                    ID_LIMITE: formLIMITE.getForm().findField('ID_LIMITE').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroLIMITE.setTitle("Novo Limite");
                    Ext.getCmp('VALOR_LIMITE').focus();
                    formLIMITE.getForm().reset();

                    buttonGroup_TB_LIMITE.items.items[32].disable();
                    formLIMITE.getForm().items.items[0].enable();

                    TB_LIMITE_CARREGA_GRID();
                    TB_LIMITE_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    TB_LIMITE_CARREGA_GRID();

    return panelCadastroLIMITE;
}
