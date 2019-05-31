function JANELA_ITENS_VENDA() {
    var _NUMERO_PEDIDO;
    var _NUMERO_ITEM;
    var _record_ITEM_COMPRA;

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.NUMERO_ITEM = function (pNUMERO_ITEM) {
        _NUMERO_ITEM = pNUMERO_ITEM;
    };

    this.record_ITEM_COMPRA = function (pRecord) {
        _record_ITEM_COMPRA = pRecord;
    };

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO',
                'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'MARGEM_VENDA_ITEM_PEDIDO', 'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO', 'ALIQ_ICMS_ITEM_PEDIDO',
                'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO', 'NOME_VENDEDOR', 'TOTAL_PEDIDO', 'VALOR_FRETE', 'MARGEM',
                'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA', 'SEPARADOR'])
    });

    var checkBoxSM_Desvincular = new Ext.grid.CheckboxSelectionModel();

    var grid_PEDIDO_VENDA = new Ext.grid.EditorGridPanel({
        store: PEDIDO_VENDA_Store,
        tbar: [{
            text: 'Desvincular item(ns) selecionados com o item de compra',
            icon: 'imagens/icones/copy_remove2_16.gif',
            scale: 'small',
            handler: function () {
                Desvincula_Pedidos();
            }
        }],
        columns: [
            checkBoxSM_Desvincular,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido, locked: true },
            { id: 'SEPARADOR', header: "Separador(a)", width: 110, sortable: true, dataIndex: 'SEPARADOR' },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Compras },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },
            { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 130, sortable: true, dataIndex: 'NOME_VENDEDOR' },
            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 155, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' }
        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: checkBoxSM_Desvincular
    });

    var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Itens_Venda_do_Item_de_Compra');
    ITENS_PEDIDO_PagingToolbar.setStore(PEDIDO_VENDA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var TB_TRANSP_JsonData = {
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM,
            start: 0,
            limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    var wITENS_VENDA = new Ext.Window({
        layout: 'form',
        title: 'Itens de Venda associados',
        iconCls: 'icone_PEDIDO_VENDA',
        width: 870,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [grid_PEDIDO_VENDA, ITENS_PEDIDO_PagingToolbar.PagingToolbar()],

        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Desvincula_Pedidos() {

        if (grid_PEDIDO_VENDA.getSelectionModel().selections.length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens para desvincular do pedido de compra');
            return;
        }

        var arrPedidos = new Array();
        var arrItens = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            if (record.data.NUMERO_PEDIDO_COMPRA == 0) {
                dialog.MensagemDeErro('O item [' + record.data.CODIGO_PRODUTO_PEDIDO + '] do Pedido [' + record.data.NUMERO_PEDIDO +
                '] não est&aacute; associado com nenhum pedido de compra. Desmarque a sele&ccedil;&atilde;o do item');

                return;
            }

            arrPedidos[i] = record.data.NUMERO_PEDIDO;
            arrItens[i] = record.data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Desvincula_Item_Compra_com_Itens_Venda');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM,
            NUMERO_PEDIDOS_VENDA: arrPedidos,
            NUMERO_ITEMS_VENDA: arrItens,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            _record_ITEM_COMPRA.beginEdit();
            _record_ITEM_COMPRA.set('NUMERO_PEDIDO_VENDA', 0);
            _record_ITEM_COMPRA.set('NUMERO_ITEM_VENDA', 0);
            _record_ITEM_COMPRA.endEdit();
            _record_ITEM_COMPRA.commit();

            Carrega_ITENS_PEDIDO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.show = function (objAnm) {
        wITENS_VENDA.show(objAnm);
        Carrega_ITENS_PEDIDO();
    };
}