function JANELA_ITENS_COMPRA_NAO_FECHADOS() {

    var ITENS_NAO_FECHADOS = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA','DATA_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'QTDE_ITEM_COMPRA', 'PRECO_ITEM_COMPRA',
           'PRECO_FINAL_FORNECEDOR', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'CODIGO_PRODUTO_COMPRA']
           )
    });

    var grid_ITENS_NAO_FECHADOS = new Ext.grid.GridPanel({
        store: ITENS_NAO_FECHADOS,
        columns: [
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Cota&ccedil;&atilde;o", width: 105, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA' },
            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;d. Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'DATA_ITEM_COMPRA', header: "Data Pedido", width: 90, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate },
            { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Previs&atilde;o Entrega", width: 100, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 220, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde },
            { id: 'PRECO_ITEM_COMPRA', header: "Pre&ccedil;o Item", width: 80, sortable: true, dataIndex: 'PRECO_ITEM_COMPRA', renderer: FormataValor_4 },
            { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o Fornecedor", width: 110, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: FormataValor_4 }
        ],

        stripeRows: true,
        height: 520,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var ITENS_NAO_FECHADOS_PagingToolbar = new Th2_PagingToolbar();

    ITENS_NAO_FECHADOS_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Itens_Cotados_Nao_Fechados');
    ITENS_NAO_FECHADOS_PagingToolbar.setParamsJsonData(RetornaFiltros_ORCAMENTOS_JsonData());
    ITENS_NAO_FECHADOS_PagingToolbar.setStore(ITENS_NAO_FECHADOS);

    function RetornaFiltros_ORCAMENTOS_JsonData() {

        var TB_TRANSP_JsonData = {
            start: 0,
            limit: ITENS_NAO_FECHADOS_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_NAO_FECHADOS(numero_orcamento) {
        ITENS_NAO_FECHADOS_PagingToolbar.setParamsJsonData(RetornaFiltros_ORCAMENTOS_JsonData(numero_orcamento));
        ITENS_NAO_FECHADOS_PagingToolbar.doRequest();
    }

    var wITENS_NAO_FECHADOS = new Ext.Window({
        layout: 'form',
        title: 'Itens de Compra n&atilde;o fechados',
        iconCls: 'icone_PEDIDO_COMPRA',
        width: 980,
        height: 580,
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [grid_ITENS_NAO_FECHADOS, ITENS_NAO_FECHADOS_PagingToolbar.PagingToolbar()],
        listeners: {
            minimize: function(w) {
                w.hide();
            }
        }
    });

    this.show = function(objAnm) {
        Carrega_ITENS_NAO_FECHADOS();
        wITENS_NAO_FECHADOS.show(objAnm);
    };
}
