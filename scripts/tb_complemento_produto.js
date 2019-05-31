var combo_TB_COMPLEMENTO_PRODUTO = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_COMPLEMENTO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO']
       )
});

function TB_COMPLEMENTO_PRODUTO_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_COMPLEMENTO_PRODUTO.asmx/Lista_Complemento_Produto');
    _ajax.setJsonData({ 
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_COMPLEMENTO_PRODUTO.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroComplemento() {

    var TXT_CODIGO_COMPLEMENTO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'CODIGO_COMPLEMENTO_PRODUTO',
        id: 'CODIGO_COMPLEMENTO_PRODUTO',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_COMPLEMENTO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_COMPLEMENTO_PRODUTO',
        id: 'DESCRICAO_COMPLEMENTO_PRODUTO',
        allowBlank: false,
        msgTarget: 'side',
        width: 220,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 25 },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_COMPLEMENTO();
                }
            }
        }
    });

    var formCOMPLEMENTO_PRODUTO = new Ext.FormPanel({
        id: 'formCOMPLEMENTO_PRODUTO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 210,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Complemento de Produto',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_CODIGO_COMPLEMENTO_PRODUTO]
            }, {
                layout: 'form',
                items: [TXT_DESCRICAO_COMPLEMENTO_PRODUTO]

}]
}]
            });

            function PopulaFormulario_TB_COMPLEMENTO_PRODUTO(record) {
                formCOMPLEMENTO_PRODUTO.getForm().loadRecord(record);
                panelCadastroCOMPLEMENTO.setTitle('Alterar dados do Complemento');

                buttonGroup_TB_COMPLEMENTO_PRODUTO.items.items[32].enable();
                formCOMPLEMENTO_PRODUTO.getForm().items.items[0].disable();

                formCOMPLEMENTO_PRODUTO.getForm().findField('DESCRICAO_COMPLEMENTO_PRODUTO').focus();
            }

                var TB_COMPLEMENTO_Store = new Ext.data.Store({
                    reader: new Ext.data.XmlReader({
                        record: 'Tabela'
                    },
                    ['CODIGO_COMPLEMENTO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO']
                    )
                });

                var gridCOMPLEMENTO = new Ext.grid.GridPanel({
                    id: 'gridCOMPLEMENTO',
                    store: TB_COMPLEMENTO_Store,
                    columns: [
                    { id: 'CODIGO_COMPLEMENTO_PRODUTO', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'CODIGO_COMPLEMENTO_PRODUTO' },
                    { id: 'DESCRICAO_COMPLEMENTO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_COMPLEMENTO_PRODUTO' }
                    ],
                    stripeRows: true,
                    height: 221,
                    width: '100%',

                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    })
                });

                gridCOMPLEMENTO.on('rowdblclick', function(grid, rowIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    PopulaFormulario_TB_COMPLEMENTO_PRODUTO(record);
                });

                gridCOMPLEMENTO.on('keydown', function(e) {
                    if (e.getKey() == e.ENTER) {
                        if (gridCOMPLEMENTO.getSelectionModel().getSelections().length > 0) {
                            var record = gridCOMPLEMENTO.getSelectionModel().getSelected();
                            PopulaFormulario_TB_COMPLEMENTO_PRODUTO(record);
                        }
                    }
                });

                function RetornaVENDA_JsonData() {
                    var CLAS_FISCAL_JsonData = {
                        ID_USUARIO: _ID_USUARIO,
                        start: 0,
                        limit: Th2_LimiteDeLinhasPaginacao
                    };

                    return CLAS_FISCAL_JsonData;
                }

                var LIMITE_PagingToolbar = new Th2_PagingToolbar();
                LIMITE_PagingToolbar.setUrl('servicos/TB_COMPLEMENTO_PRODUTO.asmx/Carrega_Complemento_Produto');
                LIMITE_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
                LIMITE_PagingToolbar.setStore(TB_COMPLEMENTO_Store);

                function TB_COMPLEMENTO_CARREGA_GRID() {
                    LIMITE_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
                    LIMITE_PagingToolbar.doRequest();
                }

                ///////////////////////////
                var buttonGroup_TB_COMPLEMENTO_PRODUTO = new Ext.ButtonGroup({
                    items: [{
                        text: 'Salvar',
                        icon: 'imagens/icones/database_save_24.gif',
                        scale: 'medium',
                        handler: function() {
                            GravaDados_TB_COMPLEMENTO();
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Complemento de Produto',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_COMPLEMENTO_PRODUTO.items.items[32].disable();

                                    formCOMPLEMENTO_PRODUTO.getForm().items.items[0].enable();

                                    formCOMPLEMENTO_PRODUTO.getForm().findField('DESCRICAO_COMPLEMENTO_PRODUTO').focus();
                                    formCOMPLEMENTO_PRODUTO.getForm().reset();
                                    panelCadastroCOMPLEMENTO.setTitle('Novo Complemento de Produto');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_COMPLEMENTO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_COMPLEMENTO();
                                 }
}]
                });

                var toolbar_TB_LIMITE = new Ext.Toolbar({
                    style: 'text-align: right;',
                    items: [buttonGroup_TB_COMPLEMENTO_PRODUTO]
                });

                var panelCadastroCOMPLEMENTO = new Ext.Panel({
                    width: '100%',
                    border: true,
                    title: 'Novo Complemento de Produto',
                    items: [formCOMPLEMENTO_PRODUTO, toolbar_TB_LIMITE, gridCOMPLEMENTO, LIMITE_PagingToolbar.PagingToolbar()]
                });

                function GravaDados_TB_COMPLEMENTO() {
                    if (!formCOMPLEMENTO_PRODUTO.getForm().isValid()) {
                        return;
                    }

                    var dados = {
                        CODIGO_COMPLEMENTO_PRODUTO: formCOMPLEMENTO_PRODUTO.getForm().findField('CODIGO_COMPLEMENTO_PRODUTO').getValue(),
                        DESCRICAO_COMPLEMENTO_PRODUTO: formCOMPLEMENTO_PRODUTO.getForm().findField('DESCRICAO_COMPLEMENTO_PRODUTO').getValue(),
                        ID_USUARIO: _ID_USUARIO
                    };

                    var Url = panelCadastroCOMPLEMENTO.title == "Novo Complemento de Produto" ?
                        'servicos/TB_COMPLEMENTO_PRODUTO.asmx/GravaNovoComplemento' :
                        'servicos/TB_COMPLEMENTO_PRODUTO.asmx/AtualizaComplemento';

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl(Url);
                    _ajax.setJsonData({ dados: dados });

                    var _sucess = function(response, options) {
                        if (panelCadastroCOMPLEMENTO.title == "Novo Complemento de Produto") {
                            formCOMPLEMENTO_PRODUTO.getForm().reset();
                        }

                        formCOMPLEMENTO_PRODUTO.getForm().findField('DESCRICAO_COMPLEMENTO_PRODUTO').focus();

                        TB_COMPLEMENTO_CARREGA_GRID();
                        TB_COMPLEMENTO_PRODUTO_CARREGA_COMBO();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }

                function Deleta_TB_COMPLEMENTO() {
                    dialog.MensagemDeConfirmacao('Deseja deletar este Complemento?', 'formCOMPLEMENTO_PRODUTO', Deleta);

                    function Deleta(btn) {
                        if (btn == 'yes') {

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_COMPLEMENTO_PRODUTO.asmx/DeletaComplemento');
                            _ajax.setJsonData({ 
                                CODIGO_COMPLEMENTO_PRODUTO: formCOMPLEMENTO_PRODUTO.getForm().findField('CODIGO_COMPLEMENTO_PRODUTO').getValue(),
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function(response, options) {
                                panelCadastroCOMPLEMENTO.setTitle("Novo Complemento de Produto");
                                Ext.getCmp('DESCRICAO_COMPLEMENTO_PRODUTO').focus();
                                formCOMPLEMENTO_PRODUTO.getForm().reset();

                                buttonGroup_TB_COMPLEMENTO_PRODUTO.items.items[32].disable();
                                formCOMPLEMENTO_PRODUTO.getForm().items.items[0].enable();

                                TB_COMPLEMENTO_CARREGA_GRID();
                                TB_COMPLEMENTO_PRODUTO_CARREGA_COMBO();
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }

                gridCOMPLEMENTO.setHeight(AlturaDoPainelDeConteudo(formCOMPLEMENTO_PRODUTO.height) - 125);

                TB_COMPLEMENTO_CARREGA_GRID();

                return panelCadastroCOMPLEMENTO;
            }