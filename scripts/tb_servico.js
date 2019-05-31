function MontaCadastroServicos() {

    var TXT_ID_PRODUTO = new Ext.form.NumberField({
        fieldLabel: 'ID do servi&ccedil;o',
        width: 90,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        decimalPrecision: 0,
        minValue: 0,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_PRODUTO_Busca(this);
                }
            }
        }
    });

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do servi&ccedil;o',
        width: 170,
        maxLength: 25,
        allowBlank: false,
        msgTarget: 'side',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_PRODUTO_Busca(this);
                }
            }
        }
    });

    var TXT_DESCRICAO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do servi&ccedil;o',
        name: 'DESCRICAO_PRODUTO',
        id: 'DESCRICAO_PRODUTO',
        allowBlank: false,
        msgTarget: 'side',
        width: 600,
        maxLength: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 250 }
    });

    var combo_UNIDADE_MEDIDA_VENDA = new Ext.form.ComboBox({
        fieldLabel: 'Unidade de Medida (Venda)',
        id: 'UNIDADE_MEDIDA_VENDA',
        name: 'UNIDADE_MEDIDA_VENDA',
        valueField: 'UN_ID',
        displayField: 'UNIDADE',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 130,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'UN_ID',
            'UNIDADE'
        ],
            data: [['HR', 'Horas'], ['KM', 'Kilometragem']]
        })
    });

    var TXT_PRECO_PRODUTO = new Ext.form.NumberField({
        fieldLabel: 'Pre&ccedil;o de Venda',
        width: 100,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0,
        name: 'PRECO_PRODUTO1',
        id: 'PRECO_PRODUTO1',
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_ALIQ_ISS_SERVICO = new Ext.form.NumberField({
        fieldLabel: '% de ISS',
        width: 90,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0,
        allowBlank: false,
        msgTarget: 'side'
    });

    var formProduto = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        autoHeight: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_ID_PRODUTO]
            }, {
                columnWidth: 0.20,
                layout: 'form',
                labelWidth: 120,
                items: [TXT_CODIGO_PRODUTO]
            }, {
                columnWidth: 0.68,
                layout: 'form',
                labelWidth: 120,
                items: [TXT_DESCRICAO_PRODUTO]
            }]
        }, {
            xtype: 'fieldset',
            checkboxToggle: false,
            collapsible: true,
            title: 'Informa&ccedil;&otilde;es fiscais / Par&acirc;metros de venda',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.15,
                    layout: 'form',
                    items: [TXT_ALIQ_ISS_SERVICO]
                }, {
                    columnWidth: 0.18,
                    layout: 'form',
                    items: [combo_UNIDADE_MEDIDA_VENDA]
                }, {
                    columnWidth: 0.18,
                    layout: 'form',
                    items: [TXT_PRECO_PRODUTO]
                }]
            }]
        }]
    });

    function TB_PRODUTO_Busca(fld) {
        var Url = fld.id == 'ID_PRODUTO' ? 'servicos/TB_PRODUTO.asmx/BuscaPorID' : 'servicos/TB_PRODUTO.asmx/BuscaPorCodigo';

        var _jsonData = fld.id == 'ID_PRODUTO' ?
        {
            ID_PRODUTO: formProduto.getForm().findField('ID_PRODUTO').getValue(),
            ID_USUARIO: _ID_USUARIO
        } :
                {
                    CODIGO_PRODUTO: formProduto.getForm().findField('CODIGO_PRODUTO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData(_jsonData);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TXT_ID_PRODUTO.setValue(result.ID_PRODUTO);
            TXT_CODIGO_PRODUTO.setValue(result.CODIGO_PRODUTO);
            TXT_DESCRICAO_PRODUTO.setValue(result.DESCRICAO_PRODUTO);
            combo_UNIDADE_MEDIDA_VENDA.setValue(result.UNIDADE_MEDIDA_VENDA);
            TXT_PRECO_PRODUTO.setValue(result.PRECO_PRODUTO);

            TXT_ALIQ_ISS_SERVICO.setValue(result.ALIQ_ISS);

            panelCadastroProduto.setTitle('Alterar dados do servi&ccedil;o');
            formProduto.getForm().items.items[0].disable();
            buttonGroup_TB_PRODUTO.items.items[32].enable();

            TB_PRODUTO_TABPANEL.items.items[1].enable();

            TXT_DESCRICAO_PRODUTO.focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function PopulaFormulario_TB_PRODUTO(record) {
        TXT_ID_PRODUTO.setValue(record.data.ID_PRODUTO);
        TXT_CODIGO_PRODUTO.setValue(record.data.CODIGO_PRODUTO);
        TXT_DESCRICAO_PRODUTO.setValue(record.data.DESCRICAO_PRODUTO);
        TXT_PRECO_PRODUTO.setValue(record.data.PRECO_PRODUTO);
        TXT_ALIQ_ISS_SERVICO.setValue(record.data.ALIQ_ISS);
        combo_UNIDADE_MEDIDA_VENDA.setValue(record.data.UNIDADE_MEDIDA_VENDA);

        panelCadastroProduto.setTitle('Alterar dados Produto');

        buttonGroup_TB_PRODUTO.items.items[32].enable();
        formProduto.getForm().items.items[0].disable();

        TXT_DESCRICAO_PRODUTO.focus();
    }

    ///////////////////////// Area do grid /////////////////////////
    var TB_PRODUTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'UNIDADE_MEDIDA_VENDA', 'PRECO_PRODUTO',
                'ALIQ_ISS'])
    });

    var gridPRODUTO = new Ext.grid.GridPanel({
        store: TB_PRODUTO_Store,
        columns: [
        { id: 'ID_PRODUTO', header: "ID do servi&ccedil;o", width: 80, sortable: true, dataIndex: 'ID_PRODUTO' },
        { id: 'CODIGO_PRODUTO', header: "C&oacute;digo", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
        { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do servi&ccedil;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
        { id: 'UNIDADE_MEDIDA_VENDA', header: "Un. (Venda)", width: 70, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' },
        { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o de venda", width: 100, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4, align: 'right' },
        { id: 'ALIQ_ISS', header: "% de ISS", width: 80, sortable: true, dataIndex: 'ALIQ_ISS', renderer: FormataPercentual, align: 'center' }
    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(291),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var TB_PRODUTO_TXT_PESQUISA = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'C&oacute;digo / Descri&ccedil;&atilde;o do Produto',
        width: 290,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_PRODUTO_Executa_Pesquisa(gridPRODUTO);
                }
            }
        }
    });

    var TB_PRODUTO_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_PRODUTO_Executa_Pesquisa();
        }
    });

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_PRODUTO.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setLinhasPorPagina(25);
    TB_PRODUTO_PagingToolbar.setStore(TB_PRODUTO_Store);

    function RetornaFiltros_TB_PRODUTO_JsonData() {
        var TB_PRODUTO_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function TB_PRODUTO_Executa_Pesquisa() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    gridPRODUTO.on('rowdblclick', function (grid, rowIndex, e) {
        var store = grid.getStore();
        var record = store.getAt(rowIndex);

        PopulaFormulario_TB_PRODUTO(record);
    });

    gridPRODUTO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridPRODUTO.getSelectionModel().getSelections().length > 0) {
                var record = gridPRODUTO.getSelectionModel().getSelected();
                PopulaFormulario_TB_PRODUTO(record);
            }
        }
    });

    var buttonGroup_TB_PRODUTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_PRODUTO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Novo servi&ccedil;o',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function () {
                            formProduto.getForm().reset();
                            buttonGroup_TB_PRODUTO.items.items[32].disable();
                            formProduto.getForm().items.items[0].enable();
                            TXT_CODIGO_PRODUTO.focus();
                            panelCadastroProduto.setTitle('Novo servi&ccedil;o');
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                     {
                         id: 'BTN_DELETAR_TB_PRODUTO',
                         text: 'Deletar',
                         icon: 'imagens/icones/database_delete_24.gif',
                         scale: 'medium',
                         disabled: true,
                         handler: function () {
                             Deleta_TB_PRODUTO();
                         }
                     }]
    });

    var toolbar_TB_PRODUTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_PRODUTO]
    });

    var panelCadastroProduto = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo servi&ccedil;o',
        items: [formProduto, toolbar_TB_PRODUTO, gridPRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar()]
    });

    ///

    function ResetaFormulario() {
        TXT_ID_PRODUTO.reset();
        TXT_CODIGO_PRODUTO.reset();
        TXT_DESCRICAO_PRODUTO.reset();

        TXT_PRECO_PRODUTO.reset();
    }

    function GravaDados_TB_PRODUTO() {
        if (!formProduto.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_PRODUTO: TXT_ID_PRODUTO.getValue(),
            CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            DESCRICAO_PRODUTO: TXT_DESCRICAO_PRODUTO.getValue(),
            UNIDADE_MEDIDA_VENDA: combo_UNIDADE_MEDIDA_VENDA.getValue(),
            PRECO_PRODUTO: TXT_PRECO_PRODUTO.getValue(),
            ALIQ_ISS_SERVICO: TXT_ALIQ_ISS_SERVICO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroProduto.title == "Novo servi&ccedil;o" ?
                            'servicos/TB_PRODUTO.asmx/GravaNovoProduto' :
                            'servicos/TB_PRODUTO.asmx/AtualizaProduto';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroProduto.title == "Novo servi&ccedil;o") {
                ResetaFormulario();
                TXT_ID_PRODUTO.focus();
            }
            else {
                TXT_DESCRICAO_PRODUTO.focus();
            }

            TB_PRODUTO_Executa_Pesquisa();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_PRODUTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este servi&ccedil;o [' +
                        TXT_CODIGO_PRODUTO.getValue() + ']?', formProduto.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PRODUTO.asmx/DeletaProduto');
                _ajax.setJsonData({
                    ID_PRODUTO: TXT_ID_PRODUTO.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    ResetaFormulario();
                    buttonGroup_TB_PRODUTO.items.items[32].disable();
                    formProduto.getForm().items.items[0].enable();
                    TXT_CODIGO_PRODUTO.focus();
                    panelCadastroProduto.setTitle('Novo servi&ccedil;o');

                    TB_PRODUTO_Executa_Pesquisa();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    TB_PRODUTO_Executa_Pesquisa();

    return panelCadastroProduto;
}