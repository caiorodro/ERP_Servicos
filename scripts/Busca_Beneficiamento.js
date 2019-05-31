function BUSCA_BENEFICIAMENTO() {
    var _NUMERO_PEDIDO;
    var _NUMERO_ITEM;

    this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.NUMERO_ITEM = function(pNUMERO_ITEM) {
        _NUMERO_ITEM = pNUMERO_ITEM;
    };

    var TB_BENEFICIAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_BENEFICIAMENTO', 'ID_PRODUTO_ENVIO', 'CODIGO_PRODUTO_ENVIO', 'DESCRICAO_PRODUTO',
                    'QTDE_ENVIO', 'PESO_ENVIO', 'DATA_ENVIO', 'COR_FONTE_STATUS', 'COR_STATUS',
                    'ID_PRODUTO_RETORNO', 'CODIGO_PRODUTO_RETORNO', 'DESCRICAO_PRODUTO_RETORNO',
                    'QTDE_RETORNO', 'PESO_RETORNO', 'DATA_PREVISAO_RETORNO', 'DATA_RETORNO',
                    'CUSTO_UNITARIO', 'ID_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR',
                    'ID_STATUS', 'DESCRICAO_STATUS_PEDIDO', 'STATUS_ESPECIFICO', 'NUMERO_LOTE',
                    'ID_CUSTO_VENDA', 'DESCRICAO_CUSTO_VENDA', 'OBS', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA']
                    )
    });

    var gridBENEFICIAMENTO = new Ext.grid.GridPanel({
        store: TB_BENEFICIAMENTO_Store,
        columns: [
                        { id: 'DESCRICAO_STATUS_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 175, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO', renderer: status_pedido },
                        { id: 'CODIGO_PRODUTO_ENVIO', header: "C&oacute;d.Produto Envio", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO_ENVIO' },
                        { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },
                        { id: 'QTDE_ENVIO', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ENVIO', renderer: FormataQtde },
                        { id: 'PESO_ENVIO', header: "Peso", width: 80, sortable: true, dataIndex: 'PESO_ENVIO', renderer: FormataPeso },
                        { id: 'DATA_ENVIO', header: "Data Envio", width: 100, sortable: true, dataIndex: 'DATA_ENVIO', renderer: XMLParseDate, align: 'center' },
                        { id: 'CODIGO_PRODUTO_RETORNO', header: "C&oacute;d.Produto Retorno", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO_RETORNO' },
                        { id: 'DESCRICAO_PRODUTO_RETORNO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_RETORNO', hidden: true },
                        { id: 'QTDE_RETORNO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_RETORNO', renderer: FormataQtde },
                        { id: 'PESO_RETORNO', header: "Peso", width: 80, sortable: true, dataIndex: 'PESO_RETORNO', renderer: FormataPeso },
                        { id: 'DATA_PREVISAO_RETORNO', header: "Previs&atilde;o de Retorno", width: 110, sortable: true, dataIndex: 'DATA_PREVISAO_RETORNO', renderer: XMLParseDate, align: 'center' },
                        { id: 'DATA_RETORNO', header: "Data de Retorno", width: 110, sortable: true, dataIndex: 'DATA_RETORNO', renderer: XMLParseDate, align: 'center' },
                        { id: 'CUSTO_UNITARIO', header: "Custo Unit&aacute;rio", width: 95, sortable: true, dataIndex: 'CUSTO_UNITARIO', renderer: FormataValor_4 },
                        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 220, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                        { id: 'NUMERO_LOTE', header: "Nr. do Lote", width: 140, sortable: true, dataIndex: 'NUMERO_LOTE' },
                        { id: 'DESCRICAO_CUSTO_VENDA', header: "Tipo do Beneficiamento", width: 180, sortable: true, dataIndex: 'DESCRICAO_CUSTO_VENDA' }
                    ],
        stripeRows: true,
        height: 300,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var BEN_PagingToolbar = new Th2_PagingToolbar();

    BEN_PagingToolbar.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Lista_Beneficiamentos_do_Pedido');
    BEN_PagingToolbar.setStore(TB_BENEFICIAMENTO_Store);

    function FORNECEDOR_JsonData() {

        var TB_TRANSP_JsonData = {
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO,
            NUMERO_ITEM_VENDA: _NUMERO_ITEM,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: BEN_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function BEN_CARREGA_GRID() {
        BEN_PagingToolbar.setParamsJsonData(FORNECEDOR_JsonData());
        BEN_PagingToolbar.doRequest();
    }

    var wBUSCA_BEN = new Ext.Window({
        layout: 'form',
        title: 'Beneficiamento(s) do Pedido',
        iconCls: 'icone_BENEFICIAMENTO',
        width: 1000,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridBENEFICIAMENTO, BEN_PagingToolbar.PagingToolbar()],

        listeners: {
            minimize: function(w) {
                w.hide();
            }
        }
    });

    this.show = function(objAnm) {
        wBUSCA_BEN.show(objAnm);
        BEN_CARREGA_GRID();
    };
}