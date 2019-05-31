function Consulta_RNC() {

    var editor_rnc1 = new MONTA_EDITOR_RNC();

    var TXT_NUMERO_ORDEM_RNC = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; da Ordem de RNC',
        width: 90,
        decimalPrecision: 0,
        minValue: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        value: 0,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_RNC_CARREGA_GRID_RNC();
                }
            }
        }
    });

    var TXT_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_RNC_CARREGA_GRID_RNC();
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_VENDA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; Ped.Venda',
        width: 90,
        decimalPrecision: 0,
        minValue: 1,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_RNC_CARREGA_GRID_RNC();
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; Ped.Compra',
        width: 90,
        decimalPrecision: 0,
        minValue: 1,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_RNC_CARREGA_GRID_RNC();
                }
            }
        }
    });

    TB_STATUS_RNC_CARREGA_COMBO();

    var CB_STATUS_RNC = new Ext.form.ComboBox({
        store: combo_TB_STATUS_RNC,
        fieldLabel: 'Fase da RNC',
        valueField: 'ID_STATUS_RNC',
        displayField: 'DESCRICAO_STATUS',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 200,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_RNC_CARREGA_GRID_RNC();
                }
            }
        }
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function() {
            TB_RNC_CARREGA_GRID_RNC();
        }
    });

    //////////////////////

    var TB_OCORRENCIA_RNC_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['NUMERO_RNC', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'CODIGO_PRODUTO_PEDIDO',
         'NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'CODIGO_PRODUTO_COMPRA', 'CODIGO_FORNECEDOR',
         'NOME_FANTASIA_FORNECEDOR', 'NOME_FORNECEDOR', 'ID_RNC', 'DESCRICAO_RNC', 'DATA_RNC',
         'DESCRICAO', 'SEPARADOR', 'DATA_SEPARACAO', 'INSPECIONADOR', 'DATA_INSPECAO',
         'NUMERO_NF_FORNECEDOR', 'NUMERO_ORDEM_RNC', 'PDF', 'HTML', 'DATA_ENCERRAMENTO',
         'ID_STATUS_RNC', 'DESCRICAO_STATUS', 'COR_FUNDO', 'COR_LETRA', 'ACOES_CORRETIVAS']
        )
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<br /><b>Descri&ccedil;&atilde;o:</b> {DESCRICAO}")
    });

    var gridOcorrenciaRNC = new Ext.grid.GridPanel({
        store: TB_OCORRENCIA_RNC_Store,
        enableColumnMove: false,
        columns: [
                        IO_expander,
                    { id: 'HTML', header: "Matriz", width: 70, sortable: true, dataIndex: 'HTML', align: 'center' },
                    { id: 'PDF', header: "PDF", width: 60, sortable: true, dataIndex: 'PDF', align: 'center' },
                    { id: 'NUMERO_ORDEM_RNC', header: "Ordem de RNC", width: 120, sortable: true, dataIndex: 'NUMERO_ORDEM_RNC', align: 'center' },
                    { id: 'DESCRICAO_STATUS', header: "Fase RNC", width: 160, sortable: true, dataIndex: 'DESCRICAO_STATUS', renderer: statusRnc },
                    { id: 'ACOES_CORRETIVAS', header: "A&ccedil;&otilde;es corretivas", width: 110, sortable: true, dataIndex: 'ACOES_CORRETIVAS', align: 'center' },
                    { id: 'DATA_RNC', header: "Data", width: 120, sortable: true, dataIndex: 'DATA_RNC', renderer: XMLParseDateTime },
                    { id: 'DATA_ENCERRAMENTO', header: "Encerramento", width: 120, sortable: true, dataIndex: 'DATA_ENCERRAMENTO', renderer: Parse_Encerramento_RNC },
                    { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 175, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                    { id: 'DESCRICAO_RNC', header: "Item de RNC", width: 300, sortable: true, dataIndex: 'DESCRICAO_RNC' },
                    { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;d. Produto (Venda)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                    { id: 'NUMERO_PEDIDO_COMPRA', header: "Pedido de Compra", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;d. Produto (Compra)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
                    { id: 'INSPECIONADOR', header: "Inspetor", width: 150, sortable: true, dataIndex: 'INSPECIONADOR' },
                    { id: 'DATA_INSPECAO', header: "Data Inspe&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_INSPECAO', renderer: XMLParseDate },
                    { id: 'SEPARADOR', header: "Separador", width: 150, sortable: true, dataIndex: 'SEPARADOR' },
                    { id: 'DATA_SEPARACAO', header: "Data Separa&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_SEPARACAO', renderer: XMLParseDate },
                    { id: 'NUMERO_NF_FORNECEDOR', header: "N&ordm; NF Fornecedor", width: 120, sortable: true, dataIndex: 'NUMERO_NF_FORNECEDOR', align: 'center' }
                    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(144),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        plugins: IO_expander,
        listeners: {
            cellclick: function(grid, rowIndex, columnIndex, e) {
                if (columnIndex == 1) {
                    var record = grid.getStore().getAt(rowIndex);

                    if (record.data.HTML.trim().length > 0) {
                        Edita_Matriz(record.data.NUMERO_RNC, record.data.NUMERO_ORDEM_RNC);
                    }
                }
            }
        }
    });

    function RetornaRNC_Fornecedor_JsonData() {
        var _NUMERO_RNC = TXT_NUMERO_ORDEM_RNC.getValue() == '' ? 0 : TXT_NUMERO_ORDEM_RNC.getValue();

        var CLAS_FISCAL_JsonData = {
            NUMERO_ORDEM_RNC: _NUMERO_RNC,
            FORNECEDOR: TXT_FORNECEDOR.getValue(),
            NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO_VENDA.getValue() == '' ? 0 : TXT_NUMERO_PEDIDO_VENDA.getValue(),
            NUMERO_PEDIDO_COMPRA: TXT_NUMERO_PEDIDO_COMPRA.getValue() == '' ? 0 : TXT_NUMERO_PEDIDO_COMPRA.getValue(),
            ID_STATUS_RNC: CB_STATUS_RNC.getValue() == '' ? 0 : CB_STATUS_RNC.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var OCORRENCIA_RNC_PagingToolbar = new Th2_PagingToolbar();
    OCORRENCIA_RNC_PagingToolbar.setStore(TB_OCORRENCIA_RNC_Store);

    function TB_RNC_CARREGA_GRID_RNC() {
        if (!TXT_NUMERO_ORDEM_RNC.isValid()) {
            return;
        }

        OCORRENCIA_RNC_PagingToolbar.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Carrega_Ocorrencias_por_Numero_RNC');
        OCORRENCIA_RNC_PagingToolbar.setParamsJsonData(RetornaRNC_Fornecedor_JsonData());
        OCORRENCIA_RNC_PagingToolbar.doRequest();
    }

    ////////////////

    function Edita_Matriz(NUMERO_RNC, NUMERO_ORDEM_RNC) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Busca_Conteudo_RNC');
        _ajax.setJsonData({ NUMERO_RNC: NUMERO_RNC, ID_USUARIO: _ID_USUARIO });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;

            editor_rnc1.NUMERO_RNC(NUMERO_RNC);
            editor_rnc1.NUMERO_ORDEM_RNC(NUMERO_ORDEM_RNC);
            
            if (result.length > 0) {
                editor_rnc1.setConteudo(result);
            }
            else {
                editor_rnc1.carregaFormulario();
            }

            editor_rnc1.storeRNC(TB_OCORRENCIA_RNC_Store);
            editor_rnc1.acao_Corretiva(_acaoCorretivaRNC);
            editor_rnc1.tabPanel(tabPanelRNC);

            tabPanelRNC.setActiveTab(1);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var panel1 = new Ext.Panel({
        width: '100%',
        height: 200,
        autoHeight: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_NUMERO_ORDEM_RNC]
            }, {
                columnWidth: .21,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_FORNECEDOR]
            }, {
                columnWidth: .14,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_NUMERO_PEDIDO_VENDA]
            }, {
                columnWidth: .14,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_NUMERO_PEDIDO_COMPRA]
            }, {
                columnWidth: .22,
                layout: 'form',
                labelAlign: 'top',
                items: [CB_STATUS_RNC]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [BTN_PESQUISA]
}]
            }, gridOcorrenciaRNC, OCORRENCIA_RNC_PagingToolbar.PagingToolbar()]
        });

        var _acaoCorretivaRNC = new MontaCadastro_AcaoCorretivaRNC();

        var tabPanelRNC = new Ext.TabPanel({
            deferredRender: false,
            activeTab: 0,
            defaults: { hideMode: 'offsets' },
            items: [{
                title: "Lista de RNC's",
                closable: false,
                autoScroll: false,
                iconCls: 'icone_TB_CLIENTE_DADOS_GERAIS',
                items: [panel1]
            }, {
                title: "Formul&aacute;rio da RNC",
                closable: false,
                autoScroll: false,
                iconCls: 'icone_Formulario_RNC',
                items: [editor_rnc1.Panel()]
            }, {
                title: "A&ccedil;&atilde;o corretiva",
                closable: false,
                autoScroll: false,
                iconCls: 'icone_ACAO_CORRETIVA',
                items: [_acaoCorretivaRNC.Panel()]
}],
                listeners: {
                    tabchange: function(tabPanel, panel) {
                        if (panel.title == 'Formul&aacute;rio da RNC') {
                            if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                dialog.MensagemDeErro('Selecione uma  ordem de RNC no grid para consultar o formul&aacute;rio da RNC', gridOcorrenciaRNC.getId());
                                tabPanel.setActiveTab(0);
                            }
                            else {
                                var record = gridOcorrenciaRNC.getSelectionModel().selections.items[0];
                                Edita_Matriz(record.data.NUMERO_RNC, record.data.NUMERO_ORDEM_RNC);
                            }
                        }

                        if (panel.title == 'A&ccedil;&atilde;o corretiva') {
                            if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                dialog.MensagemDeErro('Selecione uma  ordem de RNC no grid para consultar a(s) a&ccedil;&otilde;es corretiva(s)', gridOcorrenciaRNC.getId());
                                tabPanel.setActiveTab(0);
                            }
                            else {
                                var record = gridOcorrenciaRNC.getSelectionModel().selections.items[0];

                                _acaoCorretivaRNC.NUMERO_RNC(record.data.NUMERO_RNC);
                                _acaoCorretivaRNC.carregaGrid();
                                _acaoCorretivaRNC.resetaFormulario();
                                _acaoCorretivaRNC.carregaFormulario();
                            }
                        }
                    }
                }
            });

            var _NUMERO_PEDIDO_VENDA;

            this.NUMERO_PEDIDO_VENDA = function(pValue) {
                _NUMERO_PEDIDO_VENDA = pValue;
                TXT_NUMERO_PEDIDO_VENDA.setValue(pValue);
            };

            var _NUMERO_PEDIDO_COMPRA;

            this.NUMERO_PEDIDO_COMPRA = function(pValue) {
                _NUMERO_PEDIDO_COMPRA = pValue;
                TXT_NUMERO_PEDIDO_COMPRA.setValue(pValue);
            };

            this.carregaGrid = function() {
                TB_RNC_CARREGA_GRID_RNC();
            };

            this.Panel = function() {
                return tabPanelRNC;
            };
        }