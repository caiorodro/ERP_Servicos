var combo_TB_RNC_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_RNC', 'DESCRICAO_RNC', 'ENTREGA_ANTECIPADA', 'ENTREGA_ATRASADA', 'NUMERO_DIAS_ENTREGA_ANTECIPADA',
        'NUMERO_DIAS_ENTREGA_ATRASADA', 'PONTUACAO_ENTREGA']
       )
});

function TB_RNC_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_RNC.asmx/Lista_RNC');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_RNC_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroRNC() {

    var TXT_ID_RNC = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_RNC',
        id: 'ID_RNC',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_RNC = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        width: 370,
        name: 'DESCRICAO_RNC',
        id: 'DESCRICAO_RNC',
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false
    });

    var TXT_NUMERO_DIAS_ENTREGA_ANTECIPADA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; dias (Entrega Antecipada)',
        minValue: 0,
        width: 100,
        allowBlank: false
    });

    var TXT_NUMERO_DIAS_ENTREGA_ATRASADA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; dias (Entrega Atrasada)',
        minValue: 0,
        width: 100,
        allowBlank: false
    });

    var TXT_PONTUACAO_ENTREGA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Pontua&ccedil;&atilde;o da Entrega',
        minValue: 0,
        width: 100,
        allowBlank: false
    });

    var formRNC = new Ext.FormPanel({
        id: 'formRNC',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 170,
        items: [{
            layout: 'form',
            items: [TXT_ID_RNC]
        }, {
            layout: 'form',
            items: [TXT_DESCRICAO_RNC]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_NUMERO_DIAS_ENTREGA_ANTECIPADA]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_NUMERO_DIAS_ENTREGA_ATRASADA]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_PONTUACAO_ENTREGA]
            }]
        }]
    });

    function PopulaFormulario_TB_RNC(record) {
        formRNC.getForm().loadRecord(record);

        TXT_NUMERO_DIAS_ENTREGA_ANTECIPADA.setValue(record.data.NUMERO_DIAS_ENTREGA_ANTECIPADA);
        TXT_NUMERO_DIAS_ENTREGA_ATRASADA.setValue(record.data.NUMERO_DIAS_ENTREGA_ATRASADA);
        TXT_PONTUACAO_ENTREGA.setValue(record.data.PONTUACAO_ENTREGA);

        panelCadastroRNC.setTitle('Alterar dados do RNC');

        buttonGroup_TB_RNC.items.items[32].enable();
        formRNC.getForm().items.items[0].disable();

        TXT_DESCRICAO_RNC.focus();
    }

    var TB_RNC_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ID_RNC', 'DESCRICAO_RNC', 'NUMERO_DIAS_ENTREGA_ANTECIPADA',
         'NUMERO_DIAS_ENTREGA_ATRASADA', 'PONTUACAO_ENTREGA'])
    });

    var gridRNC = new Ext.grid.GridPanel({
        id: 'gridRNC',
        store: TB_RNC_Store,
        columns: [
                { id: 'ID_RNC', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_RNC' },
                { id: 'DESCRICAO_RNC', header: "Descri&ccedil;&atilde;o", width: 380, sortable: true, dataIndex: 'DESCRICAO_RNC' },
                { id: 'NUMERO_DIAS_ENTREGA_ANTECIPADA', header: "Dias (Entrega Antecipada)", width: 135, sortable: true, dataIndex: 'NUMERO_DIAS_ENTREGA_ANTECIPADA', align: 'center' },
                { id: 'NUMERO_DIAS_ENTREGA_ATRASADA', header: "Dias (Entrega Atrasada)", width: 135, sortable: true, dataIndex: 'NUMERO_DIAS_ENTREGA_ANTECIPADA', align: 'center' },
                { id: 'PONTUACAO_ENTREGA', header: "Pontua&ccedil;&atilde;o da entrega", width: 125, sortable: true, dataIndex: 'PONTUACAO_ENTREGA', align: 'center' }
                ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridRNC.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_RNC(record);
    });

    gridRNC.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridRNC.getSelectionModel().getSelections().length > 0) {
                var record = gridRNC.getSelectionModel().getSelected();
                PopulaFormulario_TB_RNC(record);
            }
        }
    });

    function RetornaRNC_JsonData() {
        var CLAS_FISCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var RNC_PagingToolbar = new Th2_PagingToolbar();
    RNC_PagingToolbar.setUrl('servicos/TB_RNC.asmx/Carrega_RNC');
    RNC_PagingToolbar.setStore(TB_RNC_Store);

    function TB_RNC_CARREGA_GRID() {
        RNC_PagingToolbar.setParamsJsonData(RetornaRNC_JsonData());
        RNC_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_RNC = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_RNC();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Item de RNC',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_RNC.items.items[32].disable();

                                    formRNC.getForm().items.items[0].enable();

                                    TXT_DESCRICAO_RNC.focus();
                                    formRNC.getForm().reset();
                                    panelCadastroRNC.setTitle('Novo RNC');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_RNC',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_RNC();
                                 }
                             }]
    });

    var toolbar_TB_RNC = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_RNC]
    });

    var panelCadastroRNC = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo RNC',
        items: [formRNC, toolbar_TB_RNC, gridRNC, RNC_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_RNC() {
        if (!formRNC.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_RNC: formRNC.getForm().findField('ID_RNC').getValue(),
            DESCRICAO_RNC: TXT_DESCRICAO_RNC.getValue(),
            ENTREGA_ANTECIPADA: TXT_NUMERO_DIAS_ENTREGA_ANTECIPADA.getValue() > 0 ? 1 : 0,
            ENTREGA_ATRASADA: TXT_NUMERO_DIAS_ENTREGA_ATRASADA.getValue() > 0 ? 1 : 0,
            NUMERO_DIAS_ENTREGA_ANTECIPADA: TXT_NUMERO_DIAS_ENTREGA_ANTECIPADA.getValue(),
            NUMERO_DIAS_ENTREGA_ATRASADA: TXT_NUMERO_DIAS_ENTREGA_ATRASADA.getValue(),
            PONTUACAO_ENTREGA: TXT_PONTUACAO_ENTREGA.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroRNC.title == "Novo RNC" ?
                        'servicos/TB_RNC.asmx/GravaNovoRNC' :
                        'servicos/TB_RNC.asmx/AtualizaRNC';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroRNC.title == "Novo RNC") {
                formRNC.getForm().reset();
            }

            TXT_DESCRICAO_RNC.focus();

            TB_RNC_CARREGA_GRID();
            TB_RNC_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_RNC() {
        dialog.MensagemDeConfirmacao('Deseja deletar este registro?', formRNC.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_RNC.asmx/DeletaRNC');
                _ajax.setJsonData({ ID_RNC: TXT_ID_RNC.getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    panelCadastroRNC.setTitle("Novo RNC");
                    TXT_DESCRICAO_RNC.focus();
                    formRNC.getForm().reset();

                    buttonGroup_TB_RNC.items.items[32].disable();
                    formRNC.getForm().items.items[0].enable();

                    TB_RNC_CARREGA_GRID();
                    TB_RNC_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridRNC.setHeight(AlturaDoPainelDeConteudo(formRNC.height) - 125);

    TB_RNC_CARREGA_GRID();

    return panelCadastroRNC;
}
