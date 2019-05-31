function MontaSugestaoCompra() {

    var hID_PRODUTO = new Ext.form.Hidden({
        value: 0
    });

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 180,
        maxLegth: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue().trim().length == 0) {
                        fsPesquisaProduto.expand();
                        TB_PRODUTO_TXT_PESQUISA.focus();
                    }
                }
            }
        }
    });

    function Busca_por_Codigo_Produto(CODIGO_PRODUTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/BuscaPorCODIGO_PRODUTO');
        _ajax.setJsonData({ CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue() });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            hID_PRODUTO.setValue(result);

            if (parseInt(result) > 0) {
                TB_STATUS_CARREGA_GRID();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var OLD_ID_FAMILIA;

    var TXT_ID_FAMILIA = new Ext.form.NumberField({
        fieldLabel: 'ID da Fam&iacute;lia',
        width: 90,
        decimalPrecision: 0,
        minValue: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            focus: function (field) {
                OLD_ID_FAMILIA = field.getValue();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB || e.getKey() == e.ENTER) {
                    if (OLD_ID_FAMILIA != this.getValue()) {
                        TXT_ID_FAMILIA.reset();
                        var vField = String(this.getValue());

                        if (vField.length > 0) {
                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/BuscaPorID');
                            _ajax.setJsonData({ ID_FAMILIA: TXT_ID_FAMILIA.getValue() });

                            var _sucess = function (response, options) {
                                var result = Ext.decode(response.responseText).d;

                                TXT_DESCRICAO_FAMILIA.setValue(result.DESCRICAO_FAMILIA);
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }
            }
        }
    });

    var TXT_DESCRICAO_FAMILIA = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o da Fam&iacute;lia',
        width: 300,
        readOnly: true
    });

    var TXT_NUMERO_MESES = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; de meses',
        minValue: 1,
        value: 6,
        width: 70,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_STATUS_CARREGA_GRID();
                }
            }
        }
    });

    //////////
    var TB_PRODUTO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO']
           )
    });

    var gridProduto = new Ext.grid.GridPanel({
        store: TB_PRODUTO_STORE,
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],

        stripeRows: true,
        height: 120,
        width: 530,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaCamposProduto(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposProduto(record);
            }
        }
    });

    function PopulaCamposProduto(record) {
        hID_PRODUTO.setValue(record.data.ID_PRODUTO);
        TXT_CODIGO_PRODUTO.setValue(record.data.CODIGO_PRODUTO);

        fsPesquisaProduto.collapse();
        fsPesquisaFamilia.collapse();

        TXT_ID_FAMILIA.reset();
        TXT_DESCRICAO_FAMILIA.reset();
    }

    var TB_PRODUTO_TXT_PESQUISA = new Ext.form.TextField({
        labelWidth: 120,
        fieldLabel: 'Código do Produto',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_PRODUTO();
                }
            }
        }
    });

    var TB_PRODUTO_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_PRODUTO();
        }
    });

    var PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    PRODUTO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_TB_PRODUTO');
    PRODUTO_PagingToolbar.setStore(TB_PRODUTO_STORE);

    function RetornaFiltros_PRODUTO_JsonData() {
        var TB_PRODUTO_JsonData = {
            Pesquisa: TB_PRODUTO_TXT_PESQUISA.getValue(),
            start: 0,
            limit: PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function Carrega_Busca_PRODUTO() {
        PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_PRODUTO_JsonData());
        PRODUTO_PagingToolbar.doRequest();
    }

    var fsPesquisaProduto = new Ext.form.FieldSet({
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        title: 'Pesquisa de Produto',
        autoHeight: true,
        bodyStyle: 'padding:2px 2px 2px',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .22,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Código do Produto:'
            }, {
                columnWidth: .30,
                items: [TB_PRODUTO_TXT_PESQUISA]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_PRODUTO_BTN_PESQUISA]
            }]
        }, gridProduto, PRODUTO_PagingToolbar.PagingToolbar()],
        listeners: {
            expand: function (f) {
                TB_PRODUTO_TXT_PESQUISA_FAMILIA.focus();
            },
            collapse: function (f) {
                fsPesquisaFamilia.collapse();
            }
        }
    });

    //////////

    var TB_PRODUTO_BUSCA_FAMILIA_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_FAMILIA', 'DESCRICAO_FAMILIA', 'PAI_FAMILIA']
           )
    });

    var gridFamiliaProduto = new Ext.grid.GridPanel({
        store: TB_PRODUTO_BUSCA_FAMILIA_STORE,
        columns: [
            { id: 'ID_FAMILIA', header: "ID da Fam&iacute;lia", width: 80, sortable: true, dataIndex: 'ID_FAMILIA' },
            { id: 'DESCRICAO_FAMILIA', header: "Fam&iacute;lia", width: 320, sortable: true, dataIndex: 'DESCRICAO_FAMILIA' }
        ],

        stripeRows: true,
        height: 120,
        width: 530,

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
        TXT_ID_FAMILIA.setValue(record.data.ID_FAMILIA);
        TXT_DESCRICAO_FAMILIA.setValue(record.data.DESCRICAO_FAMILIA);

        fsPesquisaFamilia.collapse();
        fsPesquisaProduto.collapse();

        TXT_CODIGO_PRODUTO.reset();
        hID_PRODUTO.setValue(0);
    }

    var TB_PRODUTO_TXT_PESQUISA_FAMILIA = new Ext.form.TextField({
        labelWidth: 120,
        fieldLabel: 'Descri&ccedil;&atilde;o da Fam&iacute;lia',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Familias_TB_PRODUTO();
                }
            }
        }
    });

    var TB_PRODUTO_BTN_PESQUISA_FAMILIA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Familias_TB_PRODUTO();
        }
    });

    var FAMILIA_PagingToolbar = new Th2_PagingToolbar();

    FAMILIA_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_TB_FAMILIA_PRODUTO');
    FAMILIA_PagingToolbar.setStore(TB_PRODUTO_BUSCA_FAMILIA_STORE);

    function RetornaFiltros_FAMILIA_JsonData() {
        var TB_PRODUTO_JsonData = {
            Pesquisa: TB_PRODUTO_TXT_PESQUISA_FAMILIA.getValue(),
            start: 0,
            limit: FAMILIA_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function Carrega_Busca_Familias_TB_PRODUTO() {
        FAMILIA_PagingToolbar.setParamsJsonData(RetornaFiltros_FAMILIA_JsonData());
        FAMILIA_PagingToolbar.doRequest();
    }

    /////////

    var fsPesquisaFamilia = new Ext.form.FieldSet({
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        title: 'Pesquisa de Fam&iacute;lia de Produto',
        autoHeight: true,
        bodyStyle: 'padding:2px 2px 2px',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .22,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Descrição da Família:'
            }, {
                columnWidth: .30,
                items: [TB_PRODUTO_TXT_PESQUISA_FAMILIA]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_PRODUTO_BTN_PESQUISA_FAMILIA]
            }]
        }, gridFamiliaProduto, FAMILIA_PagingToolbar.PagingToolbar()],
        listeners: {
            expand: function (f) {
                TB_PRODUTO_TXT_PESQUISA_FAMILIA.focus();
            },
            collapse: function (f) {
                fsPesquisaProduto.collapse();
            }
        }
    });

    var BTN_CONFIRMAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {
            TB_STATUS_CARREGA_GRID();
        }
    });

    var BTN_EXPORTAR_EXCEL = new Ext.Button({
        text: 'Exportar p/<br />Excel',
        icon: 'imagens/icones/export_db_24.gif',
        scale: 'large',
        handler: function () {
            Exporta_Excel();
        }
    });

    function Exporta_Excel() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Exporta_CSV');
        _ajax.setJsonData({ dados: RetornaVENDA_JsonData() });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    // Grid da sugestão da compra

    function calcula_Compra_Venda_Mes_a_Mes(records) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/calcula_Compra_Venda_Mes_a_Mes');

        var produtos = new Array();

        for (var i = 0; i < records.length; i++) {
            produtos[i] = records[i].data.ID_PRODUTO;
        }

        _ajax.setJsonData({
            IDS_PRODUTO: produtos,
            MESES: TXT_NUMERO_MESES.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < result.length; i++) {
                records[i].beginEdit();
                records[i].set('MES_A_MES', result[i].MES_A_MES);
                records[i].set('MEDIA_COMPRA', result[i].MEDIA_COMPRA);
                records[i].set('MEDIA_VENDA', result[i].MEDIA_VENDA);
                records[i].set('QTDE_EM_ESTOQUE', result[i].QTDE_EM_ESTOQUE);
                records[i].endEdit();
                records[i].commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var SC_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'MEDIA_COMPRA', 'MAIOR_PEDIDO', 'MENOR_PEDIDO',
        'NUMERO_CLIENTES_COMPRARAM', 'NUMERO_FORNECEDORES_VENDERAM', 'MES_A_MES', 'QTDE_EM_ESTOQUE', 'UNIDADE', 'QTDE_A_COMPRAR',
        'MEDIA_VENDA'])
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

    var TXT_QTDE = new Ext.form.NumberField({
        decimalPrecision: 2,
        minValue: 0.00,
        decimalSeparator: ','
    });

    var gridSC = new Ext.grid.EditorGridPanel({
        store: SC_Store,

        tbar: [{
            text: 'Gerar cota&ccedil;&atilde;o de compra',
            icon: 'imagens/icones/copy_reload_16.gif',
            scale: 'large',
            handler: function (btn) {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Gera_Cotacao_Compra');
                _ajax.setJsonData({
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    dialog.MensagemDeErro(result, btn.getId());

                    for (var i = 0; i < SC_Store.getCount(); i++) {
                        var record = SC_Store.getAt(i);

                        record.beginEdit();
                        record.set('QTDE_A_COMPRAR', 0);
                        record.endEdit();
                        record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            text: 'Calcular compra e venda m&ecirc;s a m&ecirc;s',
            icon: 'imagens/icones/data_transport_reload_16.gif',
            scale: 'large',
            handler: function (btn) {
                if (gridSC.getSelectionModel().selections.items.length == 0) {
                    dialog.MensagemDeErro('Selecione um item de produto para calcular a compra e venda', btn.getId());
                    return;
                }

                var records = new Array();

                for (var i = 0; i < gridSC.getSelectionModel().selections.length; i++) {
                    records[i] = gridSC.getSelectionModel().selections.items[i];
                }

                calcula_Compra_Venda_Mes_a_Mes(records);
            }
        }],
        columns: [
            checkBoxSM_,
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 240, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'UNIDADE', header: "Un.", width: 35, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
            { id: 'QTDE_EM_ESTOQUE', header: "Qtde em Estoque", width: 110, sortable: true, dataIndex: 'QTDE_EM_ESTOQUE', align: 'center', renderer: FormataQtde },
            { id: 'MEDIA_COMPRA', header: "M&eacute;dia<br />Compra", width: 90, sortable: true, dataIndex: 'MEDIA_COMPRA', align: 'center', renderer: FormataQtde },
            { id: 'MEDIA_VENDA', header: "M&eacute;dia<br />Venda", width: 90, sortable: true, dataIndex: 'MEDIA_VENDA', align: 'center', renderer: FormataQtde },
            { id: 'MAIOR_PEDIDO', header: "Maior pedido", width: 95, sortable: true, dataIndex: 'MAIOR_PEDIDO', align: 'center', renderer: FormataQtde },
            { id: 'MENOR_PEDIDO', header: "Menor pedido", width: 95, sortable: true, dataIndex: 'MENOR_PEDIDO', align: 'center', renderer: FormataQtde },
            { id: 'NUMERO_CLIENTES_COMPRARAM', header: "N&ordm; de clientes<br />que compraram", width: 115, sortable: true, dataIndex: 'NUMERO_CLIENTES_COMPRARAM', align: 'center' },
            { id: 'NUMERO_FORNECEDORES_VENDERAM', header: "N&ordm; de fornecedores<br />que venderam", width: 115, sortable: true, dataIndex: 'NUMERO_FORNECEDORES_VENDERAM', align: 'center' },
            { id: 'QTDE_A_COMPRAR', header: "Qtde a comprar", width: 100, sortable: true, dataIndex: 'QTDE_A_COMPRAR', align: 'center', editor: TXT_QTDE, renderer: FormataQtde },
            { id: 'MES_A_MES', header: "M&ecirc;s a M&ecirc;s", width: 1200, sortable: true, dataIndex: 'MES_A_MES' }
            ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(228),
        width: '100%',

        sm: checkBoxSM_,

        clicksToEdit: 1,

        listeners: {
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                } else {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/marcaDesmarcaItemCotacao');
                    _ajax.ExibeDivProcessamento(false);
                    _ajax.setJsonData({
                        ID_PRODUTO: e.record.data.ID_PRODUTO,
                        QTDE: e.value,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        var result = Ext.decode(response.responseText).d;

                        e.record.commit();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            },

            rowdblclick: function (grid, rowIndex, e) {

                var records = new Array();
                records[0] = grid.getStore().getAt(rowIndex);
                calcula_Compra_Venda_Mes_a_Mes(records);
            },

            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridSC.getSelectionModel().getSelections().length > 0) {
                        var records = new Array();
                        records[i] = gridSC.getSelectionModel().getSelected();
                        calcula_Compra_Venda_Mes_a_Mes(records);
                    }
                }
            }
        }
    });

    function RetornaVENDA_JsonData() {
        var CLAS_FISCAL_JsonData = {
            ID_FAMILIA: TXT_ID_FAMILIA.getValue() == '' ? 0 : TXT_ID_FAMILIA.getValue(),
            ID_PRODUTO: hID_PRODUTO.getValue(),
            CODIGO_PRODUTO: hID_PRODUTO.getValue() == '' || hID_PRODUTO.getValue() == 0 ? TXT_CODIGO_PRODUTO.getValue() : '',
            MESES: TXT_NUMERO_MESES.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var SC_PagingToolbar = new Th2_PagingToolbar();
    SC_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Sugestao_Compra');
    SC_PagingToolbar.setStore(SC_Store);

    function TB_STATUS_CARREGA_GRID() {
        if (!TXT_NUMERO_MESES.isValid())
            return;

        SC_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        SC_PagingToolbar.doRequest();
    }

    var panelSC = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        frame: true,
        title: 'Sugest&atilde;o de Compra',
        items: [{
            layout: 'column',
            items: [{
                labelWidth: 70,
                columnWidth: .25,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO]
            }, {
                columnWidth: .18,
                labelWidth: 80,
                layout: 'form',
                items: [TXT_ID_FAMILIA]
            }, {
                columnWidth: .36,
                labelWidth: 118,
                layout: 'form',
                items: [TXT_DESCRICAO_FAMILIA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                labelWidth: 80,
                items: [TXT_NUMERO_MESES]
            }, {
                columnWidth: .08,
                items: [BTN_CONFIRMAR]
            }, {
                columnWidth: .08,
                items: [BTN_EXPORTAR_EXCEL]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .48,
                items: [fsPesquisaProduto]
            }, {
                columnWidth: .48,
                items: [fsPesquisaFamilia]
            }]
        },
            gridSC, SC_PagingToolbar.PagingToolbar()]
    });

    var panel_clientes_fornecedores = new Clientes_que_compraram_Fornecedores_que_venderam();

    var tabPanel1 = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,

        items: [{
            title: 'Sugest&atilde;o de compra',
            closable: false,
            autoScroll: false,
            iconCls: 'ESTOQUE_ORDEM_COMPRA',
            items: [panelSC]
        }, {
            title: 'Clientes que compraram / Fornecedores que venderam',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE'
        }, ],
        listeners: {
            tabchange: function (tabPanel, panel) {

                if (panel.title == 'Clientes que compraram / Fornecedores que venderam') {

                    if (panel.items.length == 0) {
                        panel.add(panel_clientes_fornecedores.panel());
                        panel.doLayout();
                    }

                    if (gridSC.getSelectionModel().getSelections().length == 0) {
                        tabPanel.setActiveTab(0);
                        dialog.MensagemDeErro('Selecione um produto antes de consultar os fornecedores / clientes', gridSC.getId());
                        return;
                    }

                    var record = gridSC.getSelectionModel().selections.items[0];

                    panel_clientes_fornecedores.ID_PRODUTO(record.data.ID_PRODUTO);
                    panel_clientes_fornecedores.PRODUTO(record.data.DESCRICAO_PRODUTO);

                    panel_clientes_fornecedores.MESES(TXT_NUMERO_MESES.getValue());
                    panel_clientes_fornecedores.carregaGrids();
                }
            }
        }
    });

    return tabPanel1;
}

function Clientes_que_compraram_Fornecedores_que_venderam() {
    var _ID_PRODUTO;

    this.ID_PRODUTO = function (pValue) {
        _ID_PRODUTO = pValue;
    };

    var _MESES;

    this.MESES = function (pValue) {
        _MESES = pValue;
    };

    var _PRODUTO;

    this.PRODUTO = function (pValue) {
        gridClientes.setTitle('Clientes que comparam - [' + pValue + ']');
        gridFornecedores.setTitle('Fornecedores que venderam - [' + pValue + ']');

        _PRODUTO = pValue;
    };

    var FORNECEDOR_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_FORNECEDOR', 'NOME_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR', 'NOME_MUNICIPIO', 'SIGLA_UF', 'PRECO_MEDIO', 'PRECO_GERAL']
           )
    });

    var gridFornecedores = new Ext.grid.GridPanel({
        store: FORNECEDOR_STORE,
        title: 'Fornecedores que venderam - [' + _PRODUTO + ']',
        columns: [
            { id: 'CODIGO_FORNECEDOR', header: "C&oacute;digo do Fornecedor", width: 120, sortable: true, dataIndex: 'CODIGO_FORNECEDOR' },
            { id: 'NOME_FORNECEDOR', header: "Raz&atilde;o social", width: 320, sortable: true, dataIndex: 'NOME_FORNECEDOR' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Nome fantasia", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'NOME_MUNICIPIO', header: "Cidade", width: 200, sortable: true, dataIndex: 'NOME_MUNICIPIO' },
            { id: 'SIGLA_UF', header: "UF", width: 40, sortable: true, dataIndex: 'SIGLA_UF', align: 'center' },
            { id: 'PRECO_MEDIO', header: "Pre&ccedil;o m&eacute;dio", width: 115, sortable: true, dataIndex: 'PRECO_MEDIO', align: 'center', renderer: FormataValor_4 },
            { id: 'PRECO_GERAL', header: "Pre&ccedil;o m&eacute;dio (Geral)", width: 125, sortable: true, dataIndex: 'PRECO_GERAL', align: 'center', renderer: FormataValor_4 }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(368),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var PagingToolbar1 = new Th2_PagingToolbar();

    PagingToolbar1.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Fornecedores_que_venderam');
    PagingToolbar1.setStore(FORNECEDOR_STORE);

    function RetornaFiltros_PRODUTO_JsonData() {
        var TB_PRODUTO_JsonData = {
            MESES: _MESES,
            ID_PRODUTO: _ID_PRODUTO,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: PagingToolbar1.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function Carrega_fornecedores() {
        PagingToolbar1.setParamsJsonData(RetornaFiltros_PRODUTO_JsonData());
        PagingToolbar1.doRequest();
    }

    //// Clientes

    var CLIENTE_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_CLIENTE_NF', 'NOME_CLIENTE_NF', 'NOME_FANTASIA_CLIENTE_NF', 'MUNICIPIO_NF', 'SIGLA_UF', 'PRECO_MEDIO', 'PRECO_GERAL']
           )
    });

    var gridClientes = new Ext.grid.GridPanel({
        title: 'Clientes que Compraram - [' + _PRODUTO + ']',
        store: CLIENTE_STORE,
        columns: [
            { id: 'CODIGO_CLIENTE_NF', header: "C&oacute;digo do Cliente", width: 120, sortable: true, dataIndex: 'CODIGO_CLIENTE_NF' },
            { id: 'NOME_CLIENTE_NF', header: "Raz&atilde;o social", width: 320, sortable: true, dataIndex: 'NOME_CLIENTE_NF' },
            { id: 'NOME_FANTASIA_CLIENTE_NF', header: "Nome fantasia", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_CLIENTE_NF' },
            { id: 'MUNICIPIO_NF', header: "Cidade", width: 200, sortable: true, dataIndex: 'MUNICIPIO_NF' },
            { id: 'SIGLA_UF', header: "UF", width: 40, sortable: true, dataIndex: 'SIGLA_UF', align: 'center' },
            { id: 'PRECO_MEDIO', header: "Pre&ccedil;o m&eacute;dio", width: 115, sortable: true, dataIndex: 'PRECO_MEDIO', align: 'center', renderer: FormataValor_4 },
            { id: 'PRECO_GERAL', header: "Pre&ccedil;o m&eacute;dio (Geral)", width: 125, sortable: true, dataIndex: 'PRECO_GERAL', align: 'center', renderer: FormataValor_4 }
        ],

        stripeRows: true,
        height: 245,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var PagingToolbar2 = new Th2_PagingToolbar();

    PagingToolbar2.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Clientes_que_compraram');
    PagingToolbar2.setStore(CLIENTE_STORE);

    function RetornaFiltros_JsonData() {
        var TB_PRODUTO_JsonData = {
            MESES: _MESES,
            ID_PRODUTO: _ID_PRODUTO,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: PagingToolbar2.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function Carrega_Clientes() {
        PagingToolbar2.setParamsJsonData(RetornaFiltros_JsonData());
        PagingToolbar2.doRequest();
    }

    //

    var panel1 = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        frame: true,
        items: [gridFornecedores, PagingToolbar1.PagingToolbar(), gridClientes, PagingToolbar2.PagingToolbar()]
    });

    this.panel = function () {
        return panel1;
    };

    this.carregaGrids = function () {
        Carrega_fornecedores();
        Carrega_Clientes();
    };
}