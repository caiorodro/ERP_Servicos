function Estoque_Ordem_Compra() {
    var _NUMERO_PEDIDO;
    var _expand = false;
    var _store;
    
    this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.store_pedido = function(pStore) {
        _store = pStore;
    };

    var Estoque_Compras_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'NUMERO_ITEM', 'ID_PRODUTO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'CODIGO_PRODUTO_PEDIDO',
            'DESCRICAO_PRODUTO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'STATUS_ESPECIFICO',
                    'UNIDADE_ITEM_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'SALDO', 'MATERIAS_PRIMAS', 'ESTOQUE_MINIMO',
                    'SUGESTAO_COMPRA', 'PEDIDOS_A_ENTREGAR'])
                    ,
        listeners: {
            load: function(store, records, options) {
                for (var i = 0; i < store.getCount(); i++) {
                    //EC_expander.expandRow(i);
                }
            }
        }
    });

    var EC_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("{MATERIAS_PRIMAS}")
    });

    var grid_Estoque_Compras = new Ext.grid.GridPanel({
        tbar: [{
            text: 'Expandir / Recolher',
            icon: 'imagens/icones/window_ok_16.gif',
            scale: 'small',
            handler: function() {
                for (var i = 0; i < Estoque_Compras_Store.getCount(); i++) {
                    !_expand ? EC_expander.expandRow(i) : EC_expander.collapseRow(i);
                }
                _expand = _expand ? false : true;
            }
}],
            collapsible: true,
            store: Estoque_Compras_Store,
            columns: [
                EC_expander,
                { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o do Pedido", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
                { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', hidden: true },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 325, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 85, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },
                { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 45, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },
                { id: 'SALDO', header: "Saldo em Estoque", width: 120, sortable: true, dataIndex: 'SALDO', align: 'center', renderer: FormataQtde },
                { id: 'ESTOQUE_MINIMO', header: "Estoque M&iacute;inimo", width: 110, sortable: true, dataIndex: 'ESTOQUE_MINIMO', align: 'center', renderer: FormataQtde },
                { id: 'PEDIDOS_A_ENTREGAR', header: "A Entregar", width: 110, sortable: true, dataIndex: 'PEDIDOS_A_ENTREGAR', align: 'center', renderer: FormataQtde },
                { id: 'SUGESTAO_COMPRA', header: "Sugest&atilde;o de Compras", width: 120, sortable: true, dataIndex: 'SUGESTAO_COMPRA', align: 'center', renderer: FormataQtde }

        ],
            stripeRows: true,
            height: 300,
            width: '100%',

            plugins: EC_expander
        });

        var ESTOQUE_COMPRAS_PagingToolbar = new Th2_PagingToolbar();

        ESTOQUE_COMPRAS_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Estoque_Ordem_Compra');
        ESTOQUE_COMPRAS_PagingToolbar.setStore(Estoque_Compras_Store);

        function RetornaFiltros_PEDIDOS_JsonData() {
            var TB_TRANSP_JsonData = {
                NUMERO_PEDIDO: _NUMERO_PEDIDO,
                start: 0,
                limit: ESTOQUE_COMPRAS_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSP_JsonData;
        }

        function Carrega_ITENS() {
            ESTOQUE_COMPRAS_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
            ESTOQUE_COMPRAS_PagingToolbar.doRequest();
        }

        var panel1 = new Ext.Panel({
            collapsible: true,
            width: '100%',
            title: 'An&aacute;lise de Estoque',
            items: [grid_Estoque_Compras, ESTOQUE_COMPRAS_PagingToolbar.PagingToolbar()],
            listeners: {
                expand: function(p) {
                    grid_Ordem_Compra.setHeight(264);
                },
                collapse: function(p) {
                    grid_Ordem_Compra.setHeight(592);
                }
            }
        });

        ////////////////////////////////

        // Gerar ordem de Compra

        var Ordem_Compra_Store = new Ext.data.GroupingStore({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['NUMERO_PEDIDO', 'NUMERO_ITEM', 'ID_PRODUTO_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'DESCRICAO_PRODUTO', 'UNIDADE_ITEM_PEDIDO',
                'QTDE_PRODUTO_ITEM_PEDIDO', 'SALDO', 'ESTOQUE_MINIMO', 'SUGESTAO_COMPRA', 'PEDIDOS_A_ENTREGAR']),

            groupField: 'CODIGO_PRODUTO_PEDIDO',
            sortInfo: { field: 'CODIGO_PRODUTO_PEDIDO', direction: 'ASC' }
        });

        var TXT_QTDE_COMPRAR = new Ext.form.NumberField({
            minValue: 0.001,
            decimalPrecision: 3,
            decimalSeparator: ','
        });

        var SC_GridView = new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "itens" : "item"]})',
            groupByText: 'Agrupar por esta coluna',
            showGroupsText: 'Exibir de forma agrupada'
        });

        var grid_Ordem_Compra = new Ext.grid.EditorGridPanel({
            title: 'Sugest&atilde;o de Compra',
            collapsible: true,
            store: Ordem_Compra_Store,
            tbar: [{
                text: 'Gerar Ordem de Compra',
                icon: 'imagens/icones/shoppingcart_16.gif',
                scale: 'small',
                handler: function() {
                    Gera_Ordem_Compra();
                }
}],
                columns: [
                { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 325, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 100, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },
                { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },
                { id: 'SALDO', header: "Saldo em Estoque", width: 120, sortable: true, dataIndex: 'SALDO', align: 'center', renderer: FormataQtde },
                { id: 'ESTOQUE_MINIMO', header: "Estoque M&iacute;inimo", width: 120, sortable: true, dataIndex: 'ESTOQUE_MINIMO', align: 'center', renderer: FormataQtde },
                { id: 'PEDIDOS_A_ENTREGAR', header: "A Entregar", width: 120, sortable: true, dataIndex: 'PEDIDOS_A_ENTREGAR', align: 'center', renderer: FormataQtde },
                { id: 'SUGESTAO_COMPRA', header: "Sugest&atilde;o de Compras", width: 130, sortable: true, dataIndex: 'SUGESTAO_COMPRA', align: 'center', renderer: FormataQtde,
                    editor: TXT_QTDE_COMPRAR
                }
        ],
                stripeRows: true,
                height: 264,
                width: '100%',
                columnLines: true,

                view: SC_GridView,

                listeners: {
                    expand: function(p) {
                        grid_Estoque_Compras.setHeight(300);
                    },
                    collapse: function(p) {
                        grid_Estoque_Compras.setHeight(538);
                    }
                }
            });

            function Busca_Sugestao_Compra() {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Monta_Sugestao_Compras');
                _ajax.setJsonData({ NUMERO_PEDIDO: _NUMERO_PEDIDO });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;
                    Ordem_Compra_Store.loadData(criaObjetoXML(result), false);
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }


            function Gera_Ordem_Compra() {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                Ordem_Compra_Store.each(Salva_Store);

                function Salva_Store(record) {
                    if (record.data.SUGESTAO_COMPRA > 0.0001) {
                        array1[i] = {
                            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                            NUMERO_ITEM: record.data.NUMERO_ITEM,
                            ID_PRODUTO_PEDIDO: record.data.ID_PRODUTO_PEDIDO,
                            CODIGO_PRODUTO_PEDIDO: record.data.CODIGO_PRODUTO_PEDIDO,
                            UNIDADE: record.data.UNIDADE_ITEM_PEDIDO,
                            QTDE_COMPRA: record.data.SUGESTAO_COMPRA
                        };

                        arr_Record[i] = record;
                        i++;
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Gera_Ordem_Compra_Sugestao');
                _ajax.setJsonData({ 
                    LINHAS: array1,
                    ID_UF_EMITENTE: _UF_EMITENTE,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function(response, options) {
                    for (var n = 0; n < arr_Record.length; n++) {
                        arr_Record[n].commit();
                    }

                    Carrega_ITENS();
                    Busca_Sugestao_Compra();

                    // Atualiza Record de Pedidos
                    var result = Ext.decode(response.responseText).d;

                    _store.each(Atualiza_Registro);

                    function Atualiza_Registro(record) {
                        for (var i = 0; i < result.length; i++) {
                            if (record.data.NUMERO_PEDIDO == result[i].NUMERO_PEDIDO &&
                            record.data.NUMERO_ITEM == result[i].NUMERO_ITEM) {

                                record.beginEdit();
                                record.set('STATUS_ITEM_PEDIDO', result[i].STATUS_ITEM_PEDIDO);
                                record.set('DESCRICAO_STATUS_PEDIDO', result[i].DESCRICAO_STATUS_PEDIDO);
                                record.set('COR_STATUS', result[i].COR_STATUS);
                                record.set('COR_FONTE_STATUS', result[i].COR_FONTE_STATUS);
                                record.set('ITEM_A_COMPRAR', 0);

                                record.set('NUMERO_PEDIDO_COMPRA', result[i].NUMERO_PEDIDO_COMPRA);
                                record.set('STATUS_COMPRA', result[i].STATUS_COMPRA);
                                record.set('COR_STATUS_PEDIDO_COMPRA', result[i].COR_STATUS_PEDIDO_COMPRA);
                                record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result[i].COR_FONTE_STATUS_PEDIDO_COMPRA);
                                record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result[i].DESCRICAO_STATUS_PEDIDO_COMPRA);

                                record.endEdit();
                                record.commit();
                            }
                        }
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            /////////////////////

            var wEstoque_Compras = new Ext.Window({
                layout: 'form',
                iconCls: 'ESTOQUE_ORDEM_COMPRA',
                width: 1150,
                height: 650,
                closable: false,
                draggable: true,
                resizable: false,
                minimizable: true,
                renderTo: Ext.getBody(),
                modal: true,
                items: [panel1, grid_Ordem_Compra],
                listeners: {
                    minimize: function(w) {
                        w.hide();
                    }
                }
            });

            this.show = function(elm) {
                wEstoque_Compras.show(elm);
                Carrega_ITENS();
                Busca_Sugestao_Compra();
            };
        }