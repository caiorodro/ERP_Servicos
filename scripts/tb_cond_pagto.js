var combo_TB_COND_PAGTO_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_CP', 'DESCRICAO_CP']
       )
});

function TB_COND_PAGTO_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_COND_PAGTOS.asmx/Lista_COND_PAGTO');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });
    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_COND_PAGTO_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_COND_ATIVA_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_CP', 'DESCRICAO_CP']
       )
});

function TB_COND_ATIVA_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_COND_PAGTOS.asmx/Lista_COND_ATIVAS');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_COND_ATIVA_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var TB_COND_PAGTO_CN_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_CP', 'DESCRICAO_CP', 'CUSTO_FINANCEIRO']
       )
});

function TB_COND_PAGTO_CN_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_Cond_Pagto_Cliente_Novo');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        TB_COND_PAGTO_CN_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroCondPagto() {

    var TXT_CODIGO_CP = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo da Cond. de Pagamento',
        width: 90,
        name: 'CODIGO_CP',
        id: 'CODIGO_CP',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        readOnly: true
    });

    var TXT_DESCRICAO_CP = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        width: 510,
        name: 'DESCRICAO_CP',
        id: 'DESCRICAO_CP',
        maxLength: 70,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '70' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var CB_CONDICAO_CLIENTE_NOVO = new Ext.form.ComboBox({
        fieldLabel: 'Condição de Pagamento para Cliente Novo',
        id: 'CONDICAO_CLIENTE_NOVO',
        name: 'CONDICAO_CLIENTE_NOVO',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 70,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var TXT_QTDE_PARCELAS_CP = new Ext.form.NumberField({
        fieldLabel: 'Qtde. de Parcelas',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'QTDE_PARCELAS_CP',
        id: 'QTDE_PARCELAS_CP',
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            blur: function (f) {

            }
        }
    });

    var TXT_DIAS_PARCELA1_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 1',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA1_CP',
        id: 'DIAS_PARCELA1_CP',
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_DIAS_PARCELA2_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 2',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA2_CP',
        id: 'DIAS_PARCELA2_CP'
    });

    var TXT_CUSTO_FINANCEIRO = new Ext.form.NumberField({
        fieldLabel: '% Custo Financeiro',
        width: 60,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        value: 0,
        name: 'CUSTO_FINANCEIRO',
        id: 'CUSTO_FINANCEIRO'
    });

    var TXT_DIAS_PARCELA3_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 3',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA3_CP',
        id: 'DIAS_PARCELA3_CP'
    });

    var TXT_DIAS_PARCELA4_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 4',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA4_CP',
        id: 'DIAS_PARCELA4_CP'
    });

    var TXT_DIAS_PARCELA5_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 5',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA5_CP',
        id: 'DIAS_PARCELA5_CP'
    });

    var TXT_DIAS_PARCELA6_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 6',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA6_CP',
        id: 'DIAS_PARCELA6_CP'
    });

    var TXT_DIAS_PARCELA7_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 7',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA7_CP',
        id: 'DIAS_PARCELA7_CP'
    });

    var TXT_DIAS_PARCELA8_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 8',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA8_CP',
        id: 'DIAS_PARCELA8_CP'
    });

    var TXT_DIAS_PARCELA9_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 9',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA9_CP',
        id: 'DIAS_PARCELA9_CP'
    });

    var TXT_DIAS_PARCELA10_CP = new Ext.form.NumberField({
        fieldLabel: 'Dias Parcela 10',
        width: 70,
        decimalPrecision: 0,
        minValue: 0,
        name: 'DIAS_PARCELA10_CP',
        id: 'DIAS_PARCELA10_CP'
    });

    var CB_CONDICAO_ATIVA = new Ext.form.Checkbox({
        boxLabel: 'Cond. Pagto. ativa'
    });

    var formCP = new Ext.FormPanel({
        id: 'formCP',
        labelAlign: 'left',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 245,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Condi&ccedil;&atilde;o de Pagamento',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.30,
                    layout: 'form',
                    labelWidth: 180,
                    items: [TXT_CODIGO_CP]
                }, {
                    columnWidth: 0.60,
                    layout: 'form',
                    labelWidth: 60,
                    items: [TXT_DESCRICAO_CP]
                }]
            }, {
                layout: 'column',
                labelAlign: 'top',
                items: [{
                    columnWidth: 0.12,
                    layout: 'form',
                    items: [TXT_QTDE_PARCELAS_CP]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    items: [CB_CONDICAO_CLIENTE_NOVO]
                }, {
                    columnWidth: 0.16,
                    layout: 'form',
                    items: [TXT_CUSTO_FINANCEIRO]
                }, {
                    columnWidth: 0.14,
                    layout: 'form',
                    items: [CB_CONDICAO_ATIVA]
                }]
            }]
        }, {
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Dias para calculo de vencimentos das parcelas',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA1_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA2_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA3_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA4_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA5_CP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA6_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA7_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA8_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA9_CP]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_DIAS_PARCELA10_CP]
                }]
            }]
        }
            ]
    });

    function PopulaFormulario_TB_COND_PAGTO(record) {
        formCP.getForm().loadRecord(record);

        CB_CONDICAO_ATIVA.setValue(record.data.CONDICAO_ATIVA == 1 ? true : false);

        panelCadastroCP.setTitle('Alterar dados da Condi&ccedil;&atilde;o de Pagamento');

        buttonGroup_TB_COND_PAGTO.items.items[32].enable();
        formCP.getForm().items.items[0].disable();

        Ext.getDom('DESCRICAO_CP').focus();
    }

    function TrataCombo01(val) {
        return val == 0 ? "N&atilde;o" : "Sim";
    }

    var TB_CP_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                ['CODIGO_CP', 'DESCRICAO_CP', 'QTDE_PARCELAS_CP', 'DIAS_PARCELA1_CP', 'DIAS_PARCELA2_CP',
                'DIAS_PARCELA3_CP', 'DIAS_PARCELA4_CP', 'DIAS_PARCELA5_CP', 'DIAS_PARCELA6_CP', 'DIAS_PARCELA7_CP', 'DIAS_PARCELA8_CP',
                'DIAS_PARCELA9_CP', 'DIAS_PARCELA10_CP', 'CONDICAO_CLIENTE_NOVO', 'CUSTO_FINANCEIRO', 'CONDICAO_ATIVA']
                ),
        sortInfo: {
            field: 'DESCRICAO_CP',
            direction: 'ASC'
        }
    });

    var gridCP = new Th2_Grid();
    gridCP.setId('gridCP');
    gridCP.setStore(TB_CP_Store);

    gridCP.setHeight(AlturaDoPainelDeConteudo(415));
    gridCP.setWidth('100%');

    var _sm = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    gridCP.setSelectionModel(_sm);

    var _cols = [
                    { id: 'CODIGO_CP', header: "C&oacute;digo da Cond. Pagto.", width: 160, sortable: true, dataIndex: 'CODIGO_CP' },
                    { id: 'DESCRICAO_CP', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_CP' },
                    { id: 'QTDE_PARCELAS_CP', header: "Qtde de Parcelas", width: 100, sortable: true, dataIndex: 'QTDE_PARCELAS_CP' },
                    { id: 'DIAS_PARCELA1_CP', header: "Dias Parcela 1", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA1_CP' },
                    { id: 'DIAS_PARCELA2_CP', header: "Dias Parcela 2", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA2_CP' },
                    { id: 'DIAS_PARCELA3_CP', header: "Dias Parcela 3", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA3_CP' },
                    { id: 'DIAS_PARCELA4_CP', header: "Dias Parcela 4", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA4_CP' },
                    { id: 'DIAS_PARCELA5_CP', header: "Dias Parcela 5", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA5_CP' },
                    { id: 'DIAS_PARCELA6_CP', header: "Dias Parcela 6", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA6_CP' },
                    { id: 'DIAS_PARCELA7_CP', header: "Dias Parcela 7", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA7_CP' },
                    { id: 'DIAS_PARCELA8_CP', header: "Dias Parcela 8", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA8_CP' },
                    { id: 'DIAS_PARCELA9_CP', header: "Dias Parcela 9", width: 80, sortable: true, dataIndex: 'DIAS_PARCELA9_CP' },
                    { id: 'DIAS_PARCELA10_CP', header: "Dias Parcela 10", width: 95, sortable: true, dataIndex: 'DIAS_PARCELA10_CP' },
                    { id: 'CONDICAO_CLIENTE_NOVO', header: "Cond. Cliente Novo", width: 110, sortable: true, dataIndex: 'CONDICAO_CLIENTE_NOVO', renderer: TrataCombo01 },
                    { id: 'CUSTO_FINANCEIRO', header: "% Custo Financeiro", width: 120, sortable: true, dataIndex: 'CUSTO_FINANCEIRO', renderer: FormataPercentual }
                    ];

    gridCP.setColumns(_cols);

    var _listeners = {
        rowdblclick: function (grid, rowIndex, e) {
            var record = grid.getStore().getAt(rowIndex);

            PopulaFormulario_TB_COND_PAGTO(record);
        },

        keydown: function (e) {
            if (e.getKey() == e.ENTER) {
                if (gridCP.grid().getSelectionModel().getSelections().length > 0) {
                    var record = gridCP.grid().getSelectionModel().getSelected();
                    PopulaFormulario_TB_COND_PAGTO(record);
                }
            }
        }
    };

    gridCP.setListeners(_listeners);

    function Apoio_PopulaGrid_CFOP(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_COND_PAGTO_CARREGA_GRID();
        }
    }

    var TXT_FILTRO_DESCRICAO_CP = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o da Cond. de Pagto.',
        width: 325,
        name: 'FILTRO_DESCRICAO_CP',
        id: 'FILTRO_DESCRICAO_CP',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_COND_PAGTO_CARREGA_GRID();
                }
            }
        }
    });

    var BTN_TB_CP_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_COND_PAGTO_CARREGA_GRID();
        }
    });

    function RetornaCP_JsonData() {
        var _descricao = TXT_FILTRO_DESCRICAO_CP.getValue();

        _descricao = TXT_FILTRO_DESCRICAO_CP.getValue() ? _descricao : '';

        var CP_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            DESCRICAO_CP: _descricao,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        CP_JsonData = gridCP.setDadosFiltro(CP_JsonData);

        return CP_JsonData;
    }

    var CP_PagingToolbar = new Th2_PagingToolbar();
    CP_PagingToolbar.setUrl('servicos/TB_COND_PAGTOS.asmx/Carrega_CondPagto');
    CP_PagingToolbar.setStore(TB_CP_Store);

    var TB_COND_PAGTO_CARREGA_GRID = function () {
        CP_PagingToolbar.setParamsJsonData(RetornaCP_JsonData());
        CP_PagingToolbar.doRequest();
    }

    gridCP.setMetodoCargaGrid(TB_COND_PAGTO_CARREGA_GRID);

    gridCP.constroiGrid();

    ///////////////////////////
    var buttonGroup_TB_COND_PAGTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_COND_PAGTO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                {
                    text: 'Nova Condi&ccedil;&atilde;o de Pagamento',
                    icon: 'imagens/icones/database_fav_24.gif',
                    scale: 'medium',
                    handler: function () {
                        buttonGroup_TB_COND_PAGTO.items.items[32].disable();

                        formCP.getForm().items.items[0].enable();

                        Ext.getDom('DESCRICAO_CP').focus();
                        formCP.getForm().reset();
                        panelCadastroCP.setTitle('Nova Condi&ccedil;&atilde;o de Pagamento');
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
                         Deleta_TB_COND_PAGTO();
                     }
                 }]
    });

    var toolbar_TB_COND_PAGTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_COND_PAGTO]
    });

    var panelCadastroCP = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Nova Condi&ccedil;&atilde;o de Pagamento',
        items: [formCP, toolbar_TB_COND_PAGTO, gridCP.grid(), CP_PagingToolbar.PagingToolbar(),
                    {
                        frame: true,
                        bodyStyle: 'padding:5px 5px 0',
                        width: '100%',
                        labelAlign: 'left',
                        items: [{
                            layout: 'column',
                            items: [{
                                layout: 'form',
                                columnWidth: 0.49,
                                labelWidth: 170,
                                items: [TXT_FILTRO_DESCRICAO_CP]
                            }, {
                                layout: 'form',
                                columnWidth: 0.15,
                                items: [BTN_TB_CP_PESQUISA]
                            }]
                        }]
                    }]
    });

    function GravaDados_TB_COND_PAGTO() {
        if (!formCP.getForm().isValid()) {
            return;
        }

        var p2 = formCP.getForm().findField('DIAS_PARCELA2_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA2_CP').getValue();
        var p3 = formCP.getForm().findField('DIAS_PARCELA3_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA3_CP').getValue();
        var p4 = formCP.getForm().findField('DIAS_PARCELA4_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA4_CP').getValue();
        var p5 = formCP.getForm().findField('DIAS_PARCELA5_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA5_CP').getValue();
        var p6 = formCP.getForm().findField('DIAS_PARCELA6_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA6_CP').getValue();
        var p7 = formCP.getForm().findField('DIAS_PARCELA7_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA7_CP').getValue();
        var p8 = formCP.getForm().findField('DIAS_PARCELA8_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA8_CP').getValue();
        var p9 = formCP.getForm().findField('DIAS_PARCELA9_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA9_CP').getValue();
        var p10 = formCP.getForm().findField('DIAS_PARCELA10_CP').getValue() == '' ? 0 : formCP.getForm().findField('DIAS_PARCELA10_CP').getValue();
        var p11 = formCP.getForm().findField('CONDICAO_CLIENTE_NOVO').getValue() == '' ? 0 : formCP.getForm().findField('CONDICAO_CLIENTE_NOVO').getValue();
        var p12 = formCP.getForm().findField('CUSTO_FINANCEIRO').getValue() == '' ? 0 : formCP.getForm().findField('CUSTO_FINANCEIRO').getValue();

        var dados =
                {
                    CODIGO_CP: formCP.getForm().findField('CODIGO_CP').getValue(),
                    DESCRICAO_CP: formCP.getForm().findField('DESCRICAO_CP').getValue(),
                    QTDE_PARCELAS_CP: formCP.getForm().findField('QTDE_PARCELAS_CP').getValue(),
                    DIAS_PARCELA1_CP: formCP.getForm().findField('DIAS_PARCELA1_CP').getValue(),
                    DIAS_PARCELA2_CP: p2,
                    DIAS_PARCELA3_CP: p3,
                    DIAS_PARCELA4_CP: p4,
                    DIAS_PARCELA5_CP: p5,
                    DIAS_PARCELA6_CP: p6,
                    DIAS_PARCELA7_CP: p7,
                    DIAS_PARCELA8_CP: p8,
                    DIAS_PARCELA9_CP: p9,
                    DIAS_PARCELA10_CP: p10,
                    CONDICAO_CLIENTE_NOVO: p11,
                    CUSTO_FINANCEIRO: p12,
                    CONDICAO_ATIVA: CB_CONDICAO_ATIVA.checked ? 1 : 0,
                    ID_USUARIO: _ID_USUARIO
                };

        var Url = panelCadastroCP.title == "Nova Condi&ccedil;&atilde;o de Pagamento" ?
                        'servicos/TB_COND_PAGTOS.asmx/GravaNovaCondPagto' :
                        'servicos/TB_COND_PAGTOS.asmx/AtualizaCondPagto';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCP.title == "Nova Condi&ccedil;&atilde;o de Pagamento") {
                formCP.getForm().reset();
            }

            Ext.getDom('DESCRICAO_CP').focus();

            TB_COND_PAGTO_CARREGA_GRID();
            TB_COND_PAGTO_CARREGA_COMBO();
            TB_COND_PAGTO_CN_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_COND_PAGTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Condi&ccedil;&atilde;o de Pagamento [' +
                        formCP.getForm().findField('DESCRICAO_CP').getValue() + ']?', 'formCP', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_COND_PAGTOS.asmx/DeletaCondPagto');
                _ajax.setJsonData({
                    CODIGO_CP: formCP.getForm().findField('CODIGO_CP').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroCP.setTitle("Nova Condi&ccedil;&atilde;o de Pagamento");
                    Ext.getCmp('DESCRICAO_CP').focus();
                    formCP.getForm().reset();

                    buttonGroup_TB_COND_PAGTO.items.items[32].disable();
                    formCP.getForm().items.items[0].enable();

                    TB_COND_PAGTO_CARREGA_GRID();
                    TB_COND_PAGTO_CARREGA_COMBO();
                    TB_COND_PAGTO_CN_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    TB_COND_PAGTO_CARREGA_GRID();

    return panelCadastroCP;
}