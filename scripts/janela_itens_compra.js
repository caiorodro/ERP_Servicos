function JANELA_ITENS_COMPRA() {
    var _NUMERO_PEDIDO;
    var _NUMERO_ITEM;

    this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.NUMERO_ITEM = function(pNUMERO_ITEM) {
        _NUMERO_ITEM = pNUMERO_ITEM;
    };

    var ITENS_COMPRA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['NUMERO_PEDIDO_COMPRA', 'STATUS_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
        'COR_FONTE_STATUS_PEDIDO_COMPRA', 'STATUS_ESPECIFICO_ITEM_COMPRA', 'NUMERO_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA',
        'CODIGO_PRODUTO_COMPRA', 'QTDE_ITEM_COMPRA', 'QTDE_RECEBIDA', 'DATA_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 
        'ENTREGA_EFETIVA_ITEM_COMPRA', 'STATUS_RNC'])
    });

    var gridItensCompra = new Ext.grid.GridPanel({
        store: ITENS_COMPRA_Store,
        columns: [
            { id: 'STATUS_ITEM_COMPRA', header: "Posi&ccedil;&atilde;o do Pedido", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_COMPRA', renderer: status_pedido_compra },
            { id: 'STATUS_RNC', header: "Posi&ccedil;&atilde;o da RNC", width: 110, sortable: true, dataIndex: 'STATUS_RNC' },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
            { id: 'DATA_ITEM_COMPRA', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
            { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Previs&atilde;o Entrega", width: 100, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: EntregaAtrasadaCompra, align: 'center' },
            { id: 'ENTREGA_EFETIVA_ITEM_COMPRA', header: "Entrega Efetiva", width: 100, sortable: true, dataIndex: 'ENTREGA_EFETIVA_ITEM_COMPRA', renderer: EntregaAtrasadaCompra1, align: 'center' },

            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', align: 'right', renderer: FormataQtde },
            { id: 'QTDE_RECEBIDA', header: "Qtde. Recebida", width: 100, sortable: true, dataIndex: 'QTDE_RECEBIDA', align: 'center', renderer: QtdeRecebida },
            { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' }
                    ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function CARREGA_GRID() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Itens_do_Item_Venda');
        _ajax.setJsonData({ dados: {
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO,
            NUMERO_ITEM_VENDA: _NUMERO_ITEM
}
        });

        var _sucess = function(response, options) {
            result = Ext.decode(response.responseText).d;
            ITENS_COMPRA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wITENS_COMPRA = new Ext.Window({
        layout: 'form',
        title: 'Compra(s) do item de venda',
        iconCls: 'icone_PEDIDO_COMPRA',
        width: 1050,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridItensCompra],

        listeners: {
            minimize: function(w) {
                w.hide();
            }
        }
    });

    this.show = function(objAnm) {
        wITENS_COMPRA.show(objAnm);
        CARREGA_GRID();
    };
}