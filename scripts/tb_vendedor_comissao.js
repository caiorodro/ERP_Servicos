function MontaCadastroComissao() {

    var TXT_ID_VENDEDOR_COMISSAO = new Ext.form.TextField({
        fieldLabel: 'ID do Vendedor',
        width: 70,
        name: 'ID_VENDEDOR_COMISSAO',
        id: 'ID_VENDEDOR_COMISSAO',
        maxLength: 100,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        readOnly: true
    });

    var TXT_ID_FAMILIA_VENDEDOR_COMISSAO = new Ext.form.NumberField({
        fieldLabel: 'ID da Fam&iacute;lia',
        width: 90,
        decimalPrecision: 0,
        minValue: 0,
        name: 'ID_FAMILIA_VENDEDOR_COMISSAO',
        id: 'ID_FAMILIA_VENDEDOR_COMISSAO',
        allowBlank: false,
        msgTarget: 'side',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            focus: function (field) {
                OLD_ID_FAMILIA_VENDEDOR_COMISSAO = field.getValue();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    if (OLD_ID_FAMILIA_VENDEDOR_COMISSAO != this.getValue()) {
                        formComissao.getForm().findField('DESCRICAO_FAMILIA_COMISSAO_VENDEDOR').reset();
                        var vField = String(this.getValue());

                        if (vField.length > 0) {
                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_FAMILIA_PRODUTOS.asmx/BuscaPorID');
                            _ajax.setJsonData({ ID_FAMILIA: formComissao.getForm().findField('ID_FAMILIA_VENDEDOR_COMISSAO').getValue() });

                            var _sucess = function (response, options) {
                                var result = Ext.decode(response.responseText).d;

                                Ext.getCmp('DESCRICAO_FAMILIA_COMISSAO_VENDEDOR').setValue(result.DESCRICAO_FAMILIA);
                                Ext.getCmp('PERC_COMISSAO_VENDEDOR').focus();
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }
            }
        }
    });

    var TXT_DESCRICAO_FAMILIA_COMISSAO_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o da Fam&iacute;lia',
        name: 'DESCRICAO_FAMILIA_COMISSAO_VENDEDOR',
        id: 'DESCRICAO_FAMILIA_COMISSAO_VENDEDOR',
        width: 300,
        disabled: true
    });

    /////////////////
    var fsPesquisaFamilia = new Ext.form.FieldSet({
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        title: 'Pesquisa de Fam&iacute;lia',
        autoHeight: true,
        bodyStyle: 'padding:2px 2px 2px',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA').focus();
            }
        }
    });

    var TB_VENDEDOR_COMISSAO_BUSCA_FAMILIA_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_FAMILIA', 'DESCRICAO_FAMILIA', 'PAI_FAMILIA']
           )
    });

    var gridFamiliaProduto1 = new Ext.grid.GridPanel({
        id: 'gridFamiliaProduto1',
        store: TB_VENDEDOR_COMISSAO_BUSCA_FAMILIA_STORE,
        columns: [
            { id: 'ID_FAMILIA', header: "ID da Fam&iacute;lia", width: 80, sortable: true, dataIndex: 'ID_FAMILIA' },
            { id: 'DESCRICAO_FAMILIA', header: "Fam&iacute;lia", width: 280, sortable: true, dataIndex: 'DESCRICAO_FAMILIA' },
            { id: 'PAI_FAMILIA', header: "Pertencente &agrave;", width: 100, sortable: true, dataIndex: 'PAI_FAMILIA' }
        ],

        stripeRows: true,
        height: 120,
        width: '98%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaCamposFamilia(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposFamilia(record);
            }
        }
    });

    function PopulaCamposFamilia(record) {
        Ext.getCmp('ID_FAMILIA_VENDEDOR_COMISSAO').setValue(record.data.ID_FAMILIA);
        Ext.getCmp('DESCRICAO_FAMILIA_COMISSAO_VENDEDOR').setValue(record.data.DESCRICAO_FAMILIA);

        fsPesquisaFamilia.collapse();

        Ext.getCmp('PERC_VENDEDOR_COMISSAO').focus();
    }

    function Carrega_Busca_Familias_TB_VENDEDOR_COMISSAO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FAMILIA_PRODUTOS.asmx/Lista_TB_FAMILIA_PRODUTO');
        _ajax.setJsonData({ Pesquisa: Ext.getCmp('TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA').getValue() });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TB_VENDEDOR_COMISSAO_BUSCA_FAMILIA_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA = new Ext.form.TextField(
    {
        id: 'TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA',
        name: 'TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA',
        labelWidth: 120,
        fieldLabel: 'Descri&ccedil;&atilde;o da Fam&iacute;lia',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Familias_TB_VENDEDOR_COMISSAO();
                }
            }
        }
    });

    var TB_VENDEDOR_COMISSAO_BTN_PESQUISA_FAMILIA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Familias_TB_VENDEDOR_COMISSAO();
        }
    });

    fsPesquisaFamilia.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '95%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .26,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Descrição da Família:'
            }, {
                columnWidth: .38,
                items: [TB_VENDEDOR_COMISSAO_TXT_PESQUISA_FAMILIA]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_VENDEDOR_COMISSAO_BTN_PESQUISA_FAMILIA]
            }]
        }, gridFamiliaProduto1]
    });

    /////////////////////
    var TXT_PERC_VENDEDOR_COMISSAO = new Ext.form.NumberField({
        fieldLabel: '% de Comiss&atilde;o',
        width: 80,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        name: 'PERC_VENDEDOR_COMISSAO',
        id: 'PERC_VENDEDOR_COMISSAO',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    GravaDados_TB_VENDEDOR_COMISSAO();
            }
        }
    });

    var formComissao = new Ext.FormPanel({
        id: 'formComissao',
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
                layout: 'form',
                items: [TXT_ID_VENDEDOR_COMISSAO]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.11,
                    layout: 'form',
                    labelWidth: 120,
                    items: [TXT_ID_FAMILIA_VENDEDOR_COMISSAO]
                }, {
                    columnWidth: 0.30,
                    layout: 'form',
                    items: [TXT_DESCRICAO_FAMILIA_COMISSAO_VENDEDOR]
                }, {
                    columnWidth: 0.59,
                    layout: 'form',
                    items: [fsPesquisaFamilia]
                }]
            }, {
                layout: 'form',
                items: [TXT_PERC_VENDEDOR_COMISSAO]
            }]
        }]
    });

    function resetaFormularioComissao() {
        Ext.getCmp('ID_FAMILIA_VENDEDOR_COMISSAO').reset();
        Ext.getCmp('DESCRICAO_FAMILIA_COMISSAO_VENDEDOR').reset();
        Ext.getCmp('PERC_VENDEDOR_COMISSAO').reset();
    }

    function PopulaFormulario_TB_VENDEDOR_COMISSAO(record) {
        formComissao.getForm().loadRecord(record);
        panelCadastroComissao.setTitle('Alterar dados da Comiss&atilde;o');

        buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].enable();
        formComissao.getForm().items.items[1].disable();

        formComissao.getForm().findField('PERC_VENDEDOR_COMISSAO').focus();
    }

    var TB_VENDEDOR_COMISSAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                            ['ID_VENDEDOR_COMISSAO', 'ID_FAMILIA_VENDEDOR_COMISSAO', 'DESCRICAO_FAMILIA', 'PERC_VENDEDOR_COMISSAO']
                            )
    });

    var gridComissao = new Ext.grid.GridPanel({
        id: 'gridComissao',
        store: TB_VENDEDOR_COMISSAO_Store,
        columns: [
                    { id: 'ID_VENDEDOR_COMISSAO', header: "Vendedor", width: 80, sortable: true, dataIndex: 'ID_VENDEDOR_COMISSAO', hidden: true },
                    { id: 'ID_FAMILIA_VENDEDOR_COMISSAO', header: "ID da Fam&iacute;lia", width: 120, sortable: true, dataIndex: 'ID_FAMILIA_VENDEDOR_COMISSAO' },
                    { id: 'DESCRICAO_FAMILIA', header: "Fam&iacute;lia", width: 300, sortable: true, dataIndex: 'DESCRICAO_FAMILIA' },
                    { id: 'PERC_VENDEDOR_COMISSAO', header: "% de Comiss&atilde;o", width: 120, sortable: true, dataIndex: 'PERC_VENDEDOR_COMISSAO' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridComissao.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_VENDEDOR_COMISSAO(record);
        Ext.getCmp('DESCRICAO_FAMILIA_COMISSAO_VENDEDOR').setValue(record.data.DESCRICAO_FAMILIA);
    });

    gridComissao.on('keydown', function (e) {
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
        handler: function () {
            TB_VENDEDOR_COMISSAO_CARREGA_GRID();
        }
    });

    function RetornaCOMISSAO_JsonData() {
        var VEICULO_JsonData = {
            ID_VENDEDOR_COMISSAO: Ext.getCmp('ID_VENDEDOR_COMISSAO').getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return VEICULO_JsonData;
    }

    var COMISSAO_PagingToolbar = new Th2_PagingToolbar();
    COMISSAO_PagingToolbar.setUrl('servicos/TB_VENDEDOR_COMISSAO.asmx/LISTA_TB_VENDEDOR_COMISSAO');
    COMISSAO_PagingToolbar.setParamsJsonData(RetornaCOMISSAO_JsonData());
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
            handler: function () {
                GravaDados_TB_VENDEDOR_COMISSAO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Comiss&atilde;o',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].disable();

                                    formComissao.getForm().items.items[1].enable();

                                    resetaFormularioComissao();
                                    panelCadastroComissao.setTitle('Nova Comiss&atilde;o');

                                    formComissao.getForm().findField('ID_FAMILIA_VENDEDOR_COMISSAO').focus();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
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
            ID_VENDEDOR_COMISSAO: formComissao.getForm().findField('ID_VENDEDOR_COMISSAO').getValue(),
            ID_FAMILIA_VENDEDOR_COMISSAO: formComissao.getForm().findField('ID_FAMILIA_VENDEDOR_COMISSAO').getValue(),
            PERC_VENDEDOR_COMISSAO: formComissao.getForm().findField('PERC_VENDEDOR_COMISSAO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroComissao.title == "Nova Comiss&atilde;o" ?
                        'servicos/TB_VENDEDOR_COMISSAO.asmx/GravaNovaComissao' :
                        'servicos/TB_VENDEDOR_COMISSAO.asmx/AtualizaComissao';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroComissao.title == "Nova Comiss&atilde;o") {
                resetaFormularioComissao();

                if (Ext.getCmp('ID_FAMILIA_VENDEDOR_COMISSAO').getValue() == '' &&
                                        Ext.getCmp('PERC_VENDEDOR_COMISSAO').getValue() == '') {

                    formComissao.getForm().findField('ID_FAMILIA_VENDEDOR_COMISSAO').focus();
                    TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                }
            }
            else {
                TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                formComissao.getForm().findField('PERC_VENDEDOR_COMISSAO').focus();
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
                    ID_VENDEDOR_COMISSAO: formComissao.getForm().findField('ID_VENDEDOR_COMISSAO').getValue(),
                    ID_FAMILIA_VENDEDOR_COMISSAO: formComissao.getForm().findField('ID_FAMILIA_VENDEDOR_COMISSAO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                };

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_VENDEDOR_COMISSAO.asmx/DeletaComissao');
                _ajax.setJsonData(dados);

                var _sucess = function (response, options) {
                    panelCadastroComissao.setTitle("Nova Comiss&atilde;o");
                    Ext.getCmp('ID_FAMILIA_VENDEDOR_COMISSAO').focus();

                    resetaFormularioComissao();

                    buttonGroup_TB_VENDEDOR_COMISSAO.items.items[32].disable();
                    formComissao.getForm().items.items[1].enable();

                    TB_VENDEDOR_COMISSAO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridComissao.setHeight(AlturaDoPainelDeConteudo(formComissao.height) - 225);

    this.CARREGA_COMISSOES = function (ID_VENDEDOR_COMISSAO) {
        formComissao.getForm().findField('ID_VENDEDOR_COMISSAO').setValue(ID_VENDEDOR_COMISSAO);
        TB_VENDEDOR_COMISSAO_CARREGA_GRID();
    };

    this.PanelComissao = function () {
        return panelCadastroComissao;
    };
}