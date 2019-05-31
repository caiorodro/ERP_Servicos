function Monta_Custo_Item_Orcamento() {
    var NUMERO_ORCAMENTO;
    var NUMERO_ITEM_ORCAMENTO;
    var TITULO;
    var record_item_orcamento;
    var desabilita = false;
    var _ID_PRODUTO;

    this.SETA_NUMERO_ORCAMENTO = function (pNUMERO_ORCAMENTO) {
        NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;
    };

    this.SETA_NUMERO_ITEM_ORCAMENTO = function (pNUMERO_ITEM_ORCAMENTO) {
        NUMERO_ITEM_ORCAMENTO = pNUMERO_ITEM_ORCAMENTO;
    };

    this.SETA_TITULO = function (pTITULO) {
        TITULO = pTITULO;
    };

    this.SETA_RECORD_ITEM_ORCAMENTO = function (record) {
        record_item_orcamento = record;
    };

    this.DesabilitaGrid = function (pDetabilita) {
        desabilita = pDetabilita;
    };

    this.SETA_ID_PRODUTO = function (pID_PRODUTO) {
        _ID_PRODUTO = pID_PRODUTO;
        buscaPesoDoProduto();
    };

    var _PESO_PRODUTO = 0;

    function buscaPesoDoProduto() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Busca_Peso_do_Produto');
        _ajax.setJsonData({
            ID_PRODUTO: _ID_PRODUTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            _PESO_PRODUTO = result;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var buttonGroup_CUSTO_ITEM_ORCAMENTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                Store_CUSTO_ITEM_ORCAMENTO.each(Salva_Store);

                function Salva_Store(record) {
                    var data = record.data.PREVISAO_ENTREGA + "";

                    if (record.data.NUMERO_CUSTO_VENDA.length > 0 && data.length > 0) {

                        var _NUMERO_CUSTO_VENDA = record.data.NUMERO_CUSTO_VENDA;
                        _NUMERO_CUSTO_VENDA = _NUMERO_CUSTO_VENDA.substr(_NUMERO_CUSTO_VENDA.indexOf(' -  ', 0) + 4);

                        array1[i] = {
                            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
                            NUMERO_ITEM_ORCAMENTO: record.data.NUMERO_ITEM,
                            NUMERO_CUSTO_VENDA: _NUMERO_CUSTO_VENDA,
                            CUSTO_ITEM_ORCAMENTO: record.data.CUSTO_ITEM_ORCAMENTO,
                            PREVISAO_ENTREGA: formatDate(record.data.PREVISAO_ENTREGA),
                            OBS_CUSTO_VENDA: record.data.OBS_CUSTO_VENDA,
                            CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                            ID_USUARIO: _ID_USUARIO
                        };

                        arr_Record[i] = record;
                        i++;
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Salva_Custos');
                _ajax.setJsonData({ LINHAS: array1 });

                var _sucess = function (response, options) {
                    for (var n = 0; n < arr_Record.length; n++) {
                        arr_Record[n].commit();
                    }

                    var result = Ext.decode(response.responseText).d;

                    record_item_orcamento.beginEdit();
                    record_item_orcamento.set('CUSTO_TOTAL_PRODUTO', result[0]);
                    record_item_orcamento.set('MARGEM_VENDA_PRODUTO', result[1]);
                    record_item_orcamento.set('DATA_ENTREGA', result[2]);
                    record_item_orcamento.set('PRECO_PRODUTO', result[3]);

                    record_item_orcamento.endEdit();
                    record_item_orcamento.commit();

                    wCusto_Item.hide();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Deletar Custo',
                icon: 'imagens/icones/database_delete_24.gif',
                scale: 'medium',
                handler: function () {
                    Deleta_Custo();
                }
            }]
    });

    var toolbar_CUSTO_ITEM_ORCAMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_CUSTO_ITEM_ORCAMENTO]
    });

    var Store_CUSTO_ITEM_ORCAMENTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'NUMERO_CUSTO_VENDA', 'CUSTO_ITEM_ORCAMENTO', 'PREVISAO_ENTREGA', 'OBS_CUSTO_VENDA',
         'CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR'])
    });

    TB_CUSTO_VENDA_CARREGA_COMBO();

    var CB_CUSTO_VENDA = new Ext.form.ComboBox({
        store: combo_TB_CUSTO_VENDA,
        mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        width: '100%',
        valueField: 'DESCRICAO_CUSTO_VENDA',
        displayField: 'DESCRICAO_CUSTO_VENDA',
        forceSelection: true,
        emptyText: 'Selecione aqui...',
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                var _custo = record.data.DESCRICAO_CUSTO_VENDA;

                for (var i = 0; i < Store_CUSTO_ITEM_ORCAMENTO.getCount() - 1; i++) {
                    if (_custo == Store_CUSTO_ITEM_ORCAMENTO.getAt(i).data.NUMERO_CUSTO_VENDA) {
                        combo.setValue('');
                    }
                }

                if (combo.getValue().length > 0) {
                    var custo = (_PESO_PRODUTO * parseFloat(record.data.CUSTO_TRATAMENTO_KGS)).toFixed(4);

                    var _record = GRID_CUSTO_ITEM_ORCAMENTO.getSelectionModel().getSelected();

                    _record.beginEdit();
                    _record.set('CUSTO_ITEM_ORCAMENTO', custo);
                    _record.endEdit();
                }
            }
        }
    });

    var COMBO_FORNECEDOR_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR']
       )
    });

    function CARREGA_COMBO_FORNECEDOR() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Lista_COMBO_Fornecedores');
        _ajax.setJsonData({
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            COMBO_FORNECEDOR_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    CARREGA_COMBO_FORNECEDOR();

    var CB_CODIGO_FORNECEDOR = new Ext.form.ComboBox({
        store: COMBO_FORNECEDOR_STORE,
        mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        width: '100%',
        valueField: 'CODIGO_FORNECEDOR',
        displayField: 'NOME_FANTASIA_FORNECEDOR',
        forceSelection: true,
        emptyText: 'Selecione aqui...',
        listeners: {
            select: function (combo, record, index) {
            }
        }
    });

    // Fornecedores com Tabela

    var Store_FORNECEDOR_TABELA = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR', 'PRECO_FORNECEDOR', 'DESCONTO1',
         'DESCONTO2', 'DESCONTO3', 'PRECO_FINAL', 'CODIGO_PRODUTO']),

        sortInfo: {
            field: 'PRECO_FINAL',
            direction: 'ASC'
        }
    });

    function BUSCA_FORNECEDORES_COM_TABELA() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Busca_Fornecedores_com_Tabela');
        _ajax.setJsonData({ ID_PRODUTO: _ID_PRODUTO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_FORNECEDOR_TABELA.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function precoFinalFornecedor(val, metadata, record) {
        var precoBruto = parseFloat(record.data.PRECO_FORNECEDOR);
        var desconto1 = parseFloat(record.data.DESCONTO1);
        var desconto2 = parseFloat(record.data.DESCONTO2);
        var desconto3 = parseFloat(record.data.DESCONTO3);

        var precoFinal = desconto1 > 0.00 ? (precoBruto * (1 - (desconto1 / 100))) : precoBruto;
        precoFinal = desconto2 > 0.00 ? (precoFinal * (1 - (desconto2 / 100))) : precoFinal;
        precoFinal = desconto3 > 0.00 ? (precoFinal * (1 - (desconto3 / 100))) : precoFinal;

        return FormataValor_4(precoFinal);
    }

    var GRID_TABELA_FORNECEDOR = new Ext.grid.GridPanel({
        title: 'Tabela de Fornecedores',
        store: Store_FORNECEDOR_TABELA,
        columns: [
                { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 140, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'PRECO_FORNECEDOR', header: "Pre&ccedil;o Bruto", width: 100, sortable: true, dataIndex: 'PRECO_FORNECEDOR', renderer: FormataValor_4, align: 'right' },
                { id: 'DESCONTO1', header: "% Desconto 1", width: 90, sortable: true, dataIndex: 'DESCONTO1', renderer: FormataPercentual, align: 'center' },
                { id: 'DESCONTO2', header: "% Desconto 2", width: 90, sortable: true, dataIndex: 'DESCONTO2', renderer: FormataPercentual, align: 'center' },
                { id: 'DESCONTO3', header: "% Desconto 3", width: 90, sortable: true, dataIndex: 'DESCONTO3', renderer: FormataPercentual, align: 'center' },
                { id: 'PRECO_FINAL', header: "Pre&ccedil;o Final", width: 100, sortable: true, dataIndex: 'PRECO_FINAL', renderer: precoFinalFornecedor, align: 'right' }
            ],
        stripeRows: true,
        width: '100%',
        height: 180,

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                for (var i = 0; i < Store_CUSTO_ITEM_ORCAMENTO.getCount(); i++) {
                    var _NUMERO_CUSTO_VENDA = Store_CUSTO_ITEM_ORCAMENTO.getAt(i).data.NUMERO_CUSTO_VENDA;
                    _NUMERO_CUSTO_VENDA = _NUMERO_CUSTO_VENDA.substr(_NUMERO_CUSTO_VENDA.indexOf(' -  ', 0) + 4);

                    if (parseInt(_NUMERO_CUSTO_VENDA) == 9) {

                        var precoBruto = parseFloat(record.data.PRECO_FORNECEDOR);
                        var desconto1 = parseFloat(record.data.DESCONTO1);
                        var desconto2 = parseFloat(record.data.DESCONTO2);
                        var desconto3 = parseFloat(record.data.DESCONTO3);

                        var precoFinal = desconto1 > 0.00 ? (precoBruto * (1 - (desconto1 / 100))) : precoBruto;
                        precoFinal = desconto2 > 0.00 ? (precoFinal * (1 - (desconto2 / 100))) : precoFinal;
                        precoFinal = desconto3 > 0.00 ? (precoFinal * (1 - (desconto3 / 100))) : precoFinal;

                        Store_CUSTO_ITEM_ORCAMENTO.getAt(i).beginEdit();
                        Store_CUSTO_ITEM_ORCAMENTO.getAt(i).set('CODIGO_FORNECEDOR', record.data.CODIGO_FORNECEDOR);
                        Store_CUSTO_ITEM_ORCAMENTO.getAt(i).set('NOME_FANTASIA_FORNECEDOR', record.data.NOME_FANTASIA_FORNECEDOR);
                        Store_CUSTO_ITEM_ORCAMENTO.getAt(i).set('CUSTO_ITEM_ORCAMENTO', precoFinal);
                        Store_CUSTO_ITEM_ORCAMENTO.getAt(i).endEdit();
                    }
                }
            }
        }
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_PRODUTO();
        }
    });

    //////////////

    /// Pesquisa de Produtos

    var Store_PESQUISA_PRODUTO1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO'])
    });

    var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
        store: Store_PESQUISA_PRODUTO1,
        tbar: [{
            xtype: 'label',
            text: 'Digite a descrição do produto:'
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'TXT_PESQUISA_PRODUTO',
            xtype: 'textfield',
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
            width: '100%',
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        Carrega_Busca_PRODUTO();
                    }
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            icon: 'imagens/icones/database_search_16.gif',
            text: 'Buscar',
            handler: function () {
                Carrega_Busca_PRODUTO();
            }
        }],
        columns: [
                { id: 'CODIGO_PRODUTO', header: "Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 500, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            ],
        stripeRows: true,
        width: '100%',
        height: 180,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                if (rowIndex > -1) {
                    var record = Store_PESQUISA_PRODUTO1.getAt(rowIndex);
                    _ID_PRODUTO = record.data.ID_PRODUTO;

                    BUSCA_FORNECEDORES_COM_TABELA();
                }
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (grid_ITEM_ORCAMENTO.getSelectionModel().getSelections().length > 0) {

                        var record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();

                        _ID_PRODUTO = record.data.ID_PRODUTO;

                        BUSCA_FORNECEDORES_COM_TABELA();
                    }
                }
            }
        }
    });

    function RetornaFiltros_JsonData() {
        var _pesquisa = Ext.getCmp('TXT_PESQUISA_PRODUTO').getValue();

        var TB_PRODUTO_JsonData = {
            CODIGO_CLIENTE: 0,
            Pesquisa: _pesquisa,
            SOMENTE_PRODUTO_ACABADO: true,
            start: 0,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina(),
            ID_USUARIO: _ID_USUARIO
        };

        return TB_PRODUTO_JsonData;
    }

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO1);

    function Carrega_Busca_PRODUTO() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    /////////////

    var TXT_CUSTO_ITEM_ORCAMENTO = new Ext.form.NumberField({
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: .0000,
        allowBlank: false
    });

    var custo_dt1 = new Date();

    var TXT_PREVISAO_ENTREGA = new Ext.form.DateField({
        id: 'PREVISAO_ENTREGA',
        name: 'PREVISAO_ENTREGA',
        layout: 'form',
        fieldLabel: 'Entrega',
        allowBlank: false,
        value: custo_dt1
    });

    var TXT_OBS_CUSTO_VENDA = new Ext.form.TextField();

    function _fornecedor(val, data, record) {
        return record.data.NOME_FANTASIA_FORNECEDOR;
    }

    var GRID_CUSTO_ITEM_ORCAMENTO = new Ext.grid.EditorGridPanel({
        store: Store_CUSTO_ITEM_ORCAMENTO,
        columns: [
                { id: 'NUMERO_CUSTO_VENDA', header: "Custo de Venda", width: 270, sortable: true, dataIndex: 'NUMERO_CUSTO_VENDA',
                    editor: CB_CUSTO_VENDA
                }, { id: 'CODIGO_FORNECEDOR', header: 'Fornecedor', width: 150, sortable: true, dataIndex: 'CODIGO_FORNECEDOR',
                    editor: CB_CODIGO_FORNECEDOR, align: 'center', renderer: _fornecedor
                }, { id: 'CUSTO_ITEM_ORCAMENTO', header: "Custo Final", width: 90, sortable: true, dataIndex: 'CUSTO_ITEM_ORCAMENTO',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_ITEM_ORCAMENTO
                }, { id: 'PREVISAO_ENTREGA', header: "Entrega", width: 100, sortable: true, dataIndex: 'PREVISAO_ENTREGA', align: 'center',
                    renderer: formatDate, editor: TXT_PREVISAO_ENTREGA
                }, { id: 'OBS_CUSTO_VENDA', header: "Obs.", width: 280, sortable: true, dataIndex: 'OBS_CUSTO_VENDA',
                    editor: TXT_OBS_CUSTO_VENDA
                }
            ],
        stripeRows: true,
        width: '100%',
        height: 180,
        clicksToEdit: 1,
        listeners: {
            afterEdit: function (e) {
                if (e.field == 'CODIGO_FORNECEDOR') {
                    e.record.beginEdit();
                    e.record.set('NOME_FANTASIA_FORNECEDOR', CB_CODIGO_FORNECEDOR.getRawValue());
                    e.record.endEdit();
                }
            }
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            listeners: {
                rowupdated: function (view, firstRow, record) {
                    var data = record.data.PREVISAO_ENTREGA + "";
                    if (record.data.NUMERO_CUSTO_VENDA.length > 0 &&
                            data.length > 0) {
                        Adiciona_Registro();
                    }
                }
            }
        }
    });

    var wCusto_Item = new Ext.Window({
        title: 'Custos de Venda',
        width: 970,
        iconCls: 'icone_TB_CUSTO_VENDA',
        height: 642,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        items: [GRID_CUSTO_ITEM_ORCAMENTO, toolbar_CUSTO_ITEM_ORCAMENTO,
            GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar(), GRID_TABELA_FORNECEDOR],
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Deleta_Custo() {
        if (GRID_CUSTO_ITEM_ORCAMENTO.getSelectionModel().hasSelection()) {
            dialog.MensagemDeConfirmacao('Deseja deletar este custo?', '', Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {
                    var record = GRID_CUSTO_ITEM_ORCAMENTO.getSelectionModel().getSelected();
                    var _NUMERO_CUSTO_VENDA = record.data.NUMERO_CUSTO_VENDA;
                    _NUMERO_CUSTO_VENDA = _NUMERO_CUSTO_VENDA.substr(_NUMERO_CUSTO_VENDA.indexOf(' -  ', 0) + 4);

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Deleta_Custo');
                    _ajax.setJsonData({
                        NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
                        NUMERO_ITEM_ORCAMENTO: NUMERO_ITEM_ORCAMENTO,
                        NUMERO_CUSTO_VENDA: _NUMERO_CUSTO_VENDA,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        Store_CUSTO_ITEM_ORCAMENTO.remove(record);

                        var result = Ext.decode(response.responseText).d;

                        record_item_orcamento.beginEdit();
                        record_item_orcamento.set('CUSTO_TOTAL_PRODUTO', result[0]);
                        record_item_orcamento.set('MARGEM_VENDA_PRODUTO', result[1]);
                        record_item_orcamento.set('DATA_ENTREGA', result[2]);
                        record_item_orcamento.set('PRECO_PRODUTO', result[3]);

                        record_item_orcamento.endEdit();
                        record_item_orcamento.commit();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
        else {
            dialog.MensagemDeErro('Selecione um custo para deletar');
        }
    }

    function CARREGA_GRID_CUSTO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Custos_do_Item');
        _ajax.setJsonData({ 
            NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
            NUMERO_ITEM: NUMERO_ITEM_ORCAMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_CUSTO_ITEM_ORCAMENTO.loadData(criaObjetoXML(result), false);

            Adiciona_Registro();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Adiciona_Registro() {
        if (Store_CUSTO_ITEM_ORCAMENTO.getCount() > 0) {
            var record = Store_CUSTO_ITEM_ORCAMENTO.getAt(Store_CUSTO_ITEM_ORCAMENTO.getCount() - 1);

            if (record.data.NUMERO_CUSTO_VENDA.length > 0) {
                nova_linha();
            }
        }
        else {
            nova_linha();
        }

        function nova_linha() {
            var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_ORCAMENTO' },
                        { name: 'NUMERO_ITEM' },
                        { name: 'NUMERO_CUSTO_VENDA' },
                        { name: 'CUSTO_ITEM_ORCAMENTO' },
                        { name: 'PREVISAO_ENTREGA' },
                        { name: 'OBS_CUSTO_VENDA' },
                        { name: 'CODIGO_FORNECEDOR' }
                    ]);

            var novo = new new_record({
                NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
                NUMERO_ITEM: NUMERO_ITEM_ORCAMENTO,
                NUMERO_CUSTO_VENDA: '',
                CUSTO_ITEM_ORCAMENTO: 0.0000,
                PREVISAO_ENTREGA: '',
                OBS_CUSTO_VENDA: '',
                CODIGO_FORNECEDOR: 0
            });

            Store_CUSTO_ITEM_ORCAMENTO.insert(Store_CUSTO_ITEM_ORCAMENTO.getCount(), novo);
        }
    }

    this.show = function (elm) {
        Store_CUSTO_ITEM_ORCAMENTO.sort('PREVISAO_ENTREGA', 'ASC');
        CARREGA_GRID_CUSTO();
        BUSCA_FORNECEDORES_COM_TABELA();
        CB_CODIGO_FORNECEDOR.reset();

        wCusto_Item.setTitle("Custo de Venda - " + TITULO);
        wCusto_Item.show(elm);

        if (desabilita) {
            toolbar_CUSTO_ITEM_ORCAMENTO.items.items[0].items.items[0].disable();
            toolbar_CUSTO_ITEM_ORCAMENTO.items.items[0].items.items[11].disable();
        }
        else {
            toolbar_CUSTO_ITEM_ORCAMENTO.items.items[0].items.items[0].enable();
            toolbar_CUSTO_ITEM_ORCAMENTO.items.items[0].items.items[11].enable();
        }
    };
}