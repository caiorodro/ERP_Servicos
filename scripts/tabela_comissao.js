function MontaTabelaComissao() {

    var TXT_ID_VENDEDOR_COMISSAO = new Ext.form.TextField({
        fieldLabel: 'ID do Vendedor',
        width: 70,
        name: 'ID_VENDEDOR_1',
        id: 'ID_VENDEDOR_1',
        maxLength: 100,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        readOnly: true
    });

    var TXT_NOME_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'Nome',
        name: 'NOME_VENDEDOR1',
        id: 'NOME_VENDEDOR1',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        readOnly: true
    });

    var TXT_MARGEM_INICIAL = new Ext.form.NumberField({
        fieldLabel: '% de Margem Inicial',
        width: 80,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        name: 'MARGEM_INICIAL',
        id: 'MARGEM_INICIAL'
    });

    var TXT_MARGEM_FINAL = new Ext.form.NumberField({
        fieldLabel: '% de Margem Final',
        width: 80,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        name: 'MARGEM_FINAL',
        id: 'MARGEM_FINAL'
    });

    var TXT_PERCENTUAL_COMISSAO = new Ext.form.NumberField({
        fieldLabel: '% de Comiss&atilde;o',
        width: 80,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        name: 'PERCENTUAL_COMISSAO',
        id: 'PERCENTUAL_COMISSAO',
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER)
                    GravaDados_TB_VENDEDOR_COMISSAO();
            }
        }
    });

    var formComissao = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        autoHeight: true,
        height: 210,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Comiss&atilde;o por Fam&iacute;lia de Produtos',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'column',
                items: [{ 
                    layout: 'form',
                    columnWidth: 0.15,
                    items: [TXT_ID_VENDEDOR_COMISSAO]
                }, {
                    columnWidth: 0.40,
                    layout: 'form',
                    items: [TXT_NOME_VENDEDOR]
}]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: 0.15,
                        layout: 'form',
                        items: [TXT_MARGEM_INICIAL]
                    }, {
                        columnWidth: 0.15,
                        layout: 'form',
                        items: [TXT_MARGEM_FINAL]
                    }, {
                        columnWidth: 0.15,
                        layout: 'form',
                        items: [TXT_PERCENTUAL_COMISSAO]
}]
}]
}]
                    });

                    function resetaFormularioComissao() {
                        TXT_MARGEM_INICIAL.reset();
                        TXT_MARGEM_FINAL.reset();
                        TXT_PERCENTUAL_COMISSAO.reset();
                    }

                    function PopulaFormulario_TB_VENDEDOR_COMISSAO(record) {
                        formComissao.getForm().loadRecord(record);
                        panelCadastroComissao.setTitle('Alterar dados da Comiss&atilde;o');

                        buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].enable();
                        TXT_MARGEM_INICIAL.disable();
                        TXT_MARGEM_FINAL.disable();
                        TXT_PERCENTUAL_COMISSAO.focus();
                    }

                    var TB_VENDEDOR_COMISSAO_Store = new Ext.data.Store({
                        reader: new Ext.data.XmlReader({
                            record: 'Tabela'
                        },
                            ['ID_VENDEDOR', 'MARGEM_INICIAL', 'MARGEM_FINAL', 'PERCENTUAL_COMISSAO']
                            )
                    });

                    var gridComissao = new Ext.grid.GridPanel({
                        store: TB_VENDEDOR_COMISSAO_Store,
                        columns: [
                    { id: 'ID_VENDEDOR', header: "Vendedor(a)", width: 80, sortable: true, dataIndex: 'ID_VENDEDOR', hidden: true },
                    { id: 'MARGEM_INICIAL', header: "% Margem Inicial", width: 120, sortable: true, dataIndex: 'MARGEM_INICIAL', renderer: FormataPercentual, align: 'center' },
                    { id: 'MARGEM_FINAL', header: "% Margem Final", width: 120, sortable: true, dataIndex: 'MARGEM_FINAL', renderer: FormataPercentual, align: 'center' },
                    { id: 'PERCENTUAL_COMISSAO', header: "% de Comiss&atilde;o", width: 120, sortable: true, dataIndex: 'PERCENTUAL_COMISSAO', renderer: FormataPercentual, align: 'center' }
                    ],
                        stripeRows: true,
                        height: 221,
                        width: '100%',

                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: true
                        })
                    });

                    gridComissao.on('rowdblclick', function(grid, rowIndex, e) {
                        var record = grid.getStore().getAt(rowIndex);
                        PopulaFormulario_TB_VENDEDOR_COMISSAO(record);
                    });

                    gridComissao.on('keydown', function(e) {
                        if (e.getKey() == e.ENTER) {
                            if (gridComissao.getSelectionModel().getSelections().length > 0) {
                                var record = gridComissao.getSelectionModel().getSelected();
                                PopulaFormulario_TB_VENDEDOR_COMISSAO(record);
                            }
                        }
                    });

                    function Apoio_PopulaGrid_VEICULO(f, e) {
                        if (e.getKey() == e.ENTER) {
                            TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                        }
                    }

                    var BTN_TB_VENDEDOR_COMISSAO_PESQUISA = new Ext.Button({
                        text: 'Buscar',
                        icon: 'imagens/icones/database_search_16.gif',
                        scale: 'small',
                        handler: function() {
                            TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                        }
                    });

                    function RetornaCOMISSAO_JsonData() {
                        var VEICULO_JsonData = {
                            ID_VENDEDOR: TXT_ID_VENDEDOR_COMISSAO.getValue(),
                            ID_USUARIO: _ID_USUARIO,
                            start: 0,
                            limit: Th2_LimiteDeLinhasPaginacao
                        };

                        return VEICULO_JsonData;
                    }

                    var COMISSAO_PagingToolbar = new Th2_PagingToolbar();
                    COMISSAO_PagingToolbar.setUrl('servicos/TB_TABELA_COMISSAO.asmx/Carrega_TABELA');
                    COMISSAO_PagingToolbar.setStore(TB_VENDEDOR_COMISSAO_Store);

                    function TB_VENDEDOR_COMISSAO_CARREGA_GRID() {
                        COMISSAO_PagingToolbar.setParamsJsonData(RetornaCOMISSAO_JsonData());
                        COMISSAO_PagingToolbar.doRequest();
                    }

                    ///////////////////////////
                    var buttonGroup_TB_VENDEDOR_COMISSAO = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                GravaDados_TB_VENDEDOR_COMISSAO();
                            }
                        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Comiss&atilde;o',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].disable();

                                    TXT_MARGEM_INICIAL.enable();
                                    TXT_MARGEM_FINAL.enable();

                                    resetaFormularioComissao();
                                    panelCadastroComissao.setTitle('Nova Comiss&atilde;o');

                                    TXT_MARGEM_INICIAL.focus();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_VENDEDOR_COMISSAO();
                                 }
}]
                    });

                    var toolbar_TB_VEICULO = new Ext.Toolbar({
                        style: 'text-align: right;',
                        items: [buttonGroup_TB_VENDEDOR_COMISSAO]
                    });

                    var panelCadastroComissao = new Ext.Panel({
                        width: '100%',
                        border: true,
                        title: 'Nova Comiss&atilde;o',
                        items: [formComissao, toolbar_TB_VEICULO, gridComissao, COMISSAO_PagingToolbar.PagingToolbar(),
                            {
                                frame: true,
                                bodyStyle: 'padding:5px 5px 0',
                                width: '100%',
                                items: [{
                                    columnWidth: 0.09,
                                    items: [BTN_TB_VENDEDOR_COMISSAO_PESQUISA]
}]
}]
                    });

                    function GravaDados_TB_VENDEDOR_COMISSAO() {
                        if (!formComissao.getForm().isValid()) {
                            return;
                        }

                        var dados = {
                            ID_VENDEDOR: TXT_ID_VENDEDOR_COMISSAO.getValue(),
                            MARGEM_INICIAL: TXT_MARGEM_INICIAL.getValue(),
                            MARGEM_FINAL: TXT_MARGEM_FINAL.getValue(),
                            PERCENTUAL_COMISSAO: TXT_PERCENTUAL_COMISSAO.getValue(),
                            ID_USUARIO: _ID_USUARIO
                        };

                        var Url = panelCadastroComissao.title == "Nova Comiss&atilde;o" ?
                        'servicos/TB_TABELA_COMISSAO.asmx/GravaNovaTabela' :
                        'servicos/TB_TABELA_COMISSAO.asmx/AtualizaTabela';

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl(Url);
                        _ajax.setJsonData({ dados: dados });

                        var _sucess = function(response, options) {
                            if (panelCadastroComissao.title == "Nova Comiss&atilde;o") {
                                resetaFormularioComissao();

                                TXT_MARGEM_INICIAL.focus();
                                TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                            }
                            else {
                                TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                                TXT_PERCENTUAL_COMISSAO.focus();
                            }
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }

                    function Deleta_TB_VENDEDOR_COMISSAO() {
                        dialog.MensagemDeConfirmacao('Deseja deletar esta Comiss&atilde;o?', 'formComissao', Deleta);

                        function Deleta(btn) {
                            if (btn == 'yes') {

                                var dados = {
                                    ID_VENDEDOR: TXT_ID_VENDEDOR_COMISSAO.getValue(),
                                    MARGEM_INICIAL: TXT_MARGEM_INICIAL.getValue(),
                                    MARGEM_FINAL: TXT_MARGEM_FINAL.getValue(),
                                    ID_USUARIO: _ID_USUARIO
                                };

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_TABELA_COMISSAO.asmx/DeletaTabela');
                                _ajax.setJsonData(dados);

                                var _sucess = function(response, options) {
                                    panelCadastroComissao.setTitle("Nova Comiss&atilde;o");

                                    resetaFormularioComissao();

                                    buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].disable();
                                    TXT_MARGEM_INICIAL.enable();
                                    TXT_MARGEM_FINAL.enable();

                                    TB_VENDEDOR_COMISSAO_CARREGA_GRID();

                                    TXT_MARGEM_INICIAL.focus();
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }
                        }
                    }

                    gridComissao.setHeight(AlturaDoPainelDeConteudo(formComissao.height) - 176);

                    this.CARREGA_COMISSOES = function(ID_VENDEDOR_COMISSAO, NOME_VENDEDOR) {
                        TXT_ID_VENDEDOR_COMISSAO.setValue(ID_VENDEDOR_COMISSAO);
                        TXT_NOME_VENDEDOR.setValue(NOME_VENDEDOR);
                        TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                    };

                    this.PanelComissao = function() {
                        return panelCadastroComissao;
                    };
                }