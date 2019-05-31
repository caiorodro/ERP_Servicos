function Monta_Custo_e_Venda() {

    var lista = new Monta_Custo_Item_Pedido();

    ///// grid
    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'CODIGO_PRODUTO', 'QTDE_ITEM_PEDIDO',
                        'UNIDADE_ITEM_PEDIDO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'MARGEM_VENDA_ITEM_PEDIDO',
                        'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO',
                        'MARGEM_LIQUIDA', 'FORNECEDOR', 'CUSTOS_INDIRETOS']),

        listeners: {
            load: function(_store, _records, options) {
                for (var i = 0; i < _store.getCount(); i++) {
                    IO_expander.expandRow(i);
                }
            }
        }
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("{CUSTOS_INDIRETOS}")
    });

    var grid_CUSTO_VENDA = new Ext.grid.GridPanel({
        store: PEDIDO_VENDA_Store,
        title: 'Custos do pedido de venda',
        collapsible: true,
        tbar: [{
            xtype: 'label',
            text: 'Digite o numero do pedido de venda:'
        },
        { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }
        , {
            xtype: 'numberfield',
            id: 'TXT_NR_PEDIDO',
            width: 80,
            minValue: 1,
            listeners: {
                specialkey: function(f, e) {
                    if (e.getKey() == e.ENTER) {
                        Abrange_Custo_Pedido_Venda();
                    }
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function() {
                Abrange_Custo_Pedido_Venda();
            }
}],
            columns: [
                    IO_expander,
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO', renderer: Verifca_Beneficiamento },

            { id: 'QTDE_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_PEDIDO', align: 'center', renderer: FormataQtdeCusto },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'FORNECEDOR' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem Bruta", width: 110, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataMargemCusto, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' }
        ],
            stripeRows: true,
            height: 400,
            width: '100%',

            clicksToEdit: 1,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            plugins: IO_expander,
            listeners: {
                collapse: function(e) {
                    grid_CUSTO_VENDA_ORCAMENTO.setHeight((AlturaDoPainelDeConteudo(0) / 2) + 232);
                },
                expand: function(e) {
                    grid_CUSTO_VENDA_ORCAMENTO.setHeight((AlturaDoPainelDeConteudo(0) / 2) - 27);
                }
            }
        });

        // Orçamento
        var ORCAMENTO_VENDA_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['NUMERO_ORCAMENTO', 'NOMEFANTASIA_CLIENTE', 'CODIGO_PRODUTO', 'QTDE_ITEM_ORCAMENTO',
                        'UNIDADE_ITEM_ORCAMENTO', 'CUSTO_TOTAL_ITEM_ORCAMENTO', 'MARGEM_VENDA_ITEM_ORCAMENTO',
                        'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_ORCAMENTO', 'VALOR_TOTAL_ITEM_ORCAMENTO',
                         'MARGEM_LIQUIDA', 'FORNECEDOR', 'CUSTOS_INDIRETOS']),

            listeners: {
                load: function(_store, _records, options) {
                    for (var i = 0; i < _store.getCount(); i++) {
                        IO_expander1.expandRow(i);
                    }
                }
            }
        });

        var IO_expander1 = new Ext.ux.grid.RowExpander({
            expandOnEnter: false,
            expandOnDblClick: false,

            tpl: new Ext.Template("{CUSTOS_INDIRETOS}")
        });

        function FormataQtdeCusto(val) {
            return "<span style='color: navy; font-weight: bold;'>" + FormataQtde(val) + "</span>";
        }

        function FormataMargemCusto(val, metadata, record) {
            return "<span style='color: darkgreen; font-weight: bold;'>" + FormataPercentualMargem(val, metadata, record) + "</span>";
        }

        var grid_CUSTO_VENDA_ORCAMENTO = new Ext.grid.GridPanel({
            store: ORCAMENTO_VENDA_Store,
            title: 'Custos do or&ccedil;amento de venda',
            collapsible: true,
            tbar: [{
                xtype: 'label',
                text: 'Digite o numero do orçamento de venda:'
            },
        { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }
        , {
            id: 'TXT_NR_ORCAMENTO',
            xtype: 'numberfield',
            width: 80,
            minValue: 1,
            listeners: {
                specialkey: function(f, e) {
                    if (e.getKey() == e.ENTER) {
                        Abrange_Custo_Orcamento();
                    }
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function() {
                Abrange_Custo_Orcamento();
            }
}],
            columns: [
                    IO_expander1,
            { id: 'NUMERO_ORCAMENTO', header: "Nr. Or&ccedil;amento", width: 90, sortable: true, dataIndex: 'NUMERO_ORCAMENTO', align: 'center' },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },

            { id: 'QTDE_ITEM_ORCAMENTO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_ORCAMENTO', align: 'center', renderer: FormataQtdeCusto },

            { id: 'UNIDADE_ITEM_ORCAMENTO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_ORCAMENTO', align: 'center' },

            { id: 'FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'FORNECEDOR' },

            { id: 'CUSTO_TOTAL_ITEM_ORCAMENTO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_ORCAMENTO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_ORCAMENTO', header: "Margem Bruta", width: 100, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_ORCAMENTO', renderer: FormataMargemCusto, align: 'center' },
            { id: 'PRECO_ITEM_ORCAMENTO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_ORCAMENTO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_ORCAMENTO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_ORCAMENTO', renderer: FormataValor, align: 'right' }
        ],
            stripeRows: true,
            height: 400,
            width: '100%',

            clicksToEdit: 1,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            plugins: IO_expander1,
            listeners: {
                collapse: function(e) {
                    grid_CUSTO_VENDA.setHeight((AlturaDoPainelDeConteudo(0) / 2) + 232);
                },
                expand: function(e) {
                    grid_CUSTO_VENDA.setHeight((AlturaDoPainelDeConteudo(0) / 2) - 26);
                }
            }
        });

        function Abrange_Custo_Orcamento() {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Abrange_Custo_Orcamento');
            _ajax.setJsonData({
                NUMERO_ORCAMENTO: Ext.getCmp('TXT_NR_ORCAMENTO').getValue(),
                ID_UF_EMITENTE: _UF_EMITENTE,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function(response, options) {
                var result = Ext.decode(response.responseText).d;
                ORCAMENTO_VENDA_Store.loadData(criaObjetoXML(result), false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        function Abrange_Custo_Pedido_Venda() {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Abrange_Custo_Pedido_Venda');
            _ajax.setJsonData({ 
                NUMERO_PEDIDO: Ext.getCmp('TXT_NR_PEDIDO').getValue(),
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function(response, options) {
                var result = Ext.decode(response.responseText).d;
                PEDIDO_VENDA_Store.loadData(criaObjetoXML(result), false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var panel1 = new Ext.Panel({
            autoHeight: true,
            border: false,
            bodyStyle: 'padding:0px 0px 0',
            width: '100%',
            anchor: '100%',
            title: 'Custo e Venda (Margem de Lucro)',
            items: [grid_CUSTO_VENDA, grid_CUSTO_VENDA_ORCAMENTO]
        });

        grid_CUSTO_VENDA.setHeight((AlturaDoPainelDeConteudo(0) / 2) - 26);
        grid_CUSTO_VENDA_ORCAMENTO.setHeight((AlturaDoPainelDeConteudo(0) / 2) - 27);

        return panel1;
    }