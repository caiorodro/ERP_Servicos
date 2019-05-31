function Consulta_Estoque_X_Pedido(pNUMERO_PEDIDO_VENDA) {

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    CarregaGrid();
                }
            }
        }
    });

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'DATA_HORA_SOLICITACAO', 'ID_PRODUTO_SOLICITACAO', 'CODIGO_PRODUTO',
            'QTDE_SOLICITACAO', 'CUSTO_ESTOQUE', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'CUSTO_VENDAS',
             'OUTROS_PEDIDOS', 'QTDE_ESTOQUE', 'FORNECEDOR'])
    });

    var grid_PEDIDO_VENDA = new Ext.grid.GridPanel({
        store: PEDIDO_VENDA_Store,
        columns: [
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;.Produto Pedido", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO' },

            { id: 'DATA_HORA_SOLICITACAO', header: "Data Hora Solicita&ccedil;&atilde;o", width: 130, sortable: true, dataIndex: 'DATA_HORA_SOLICITACAO', renderer: XMLParseDateTime },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;d.Produto Solicitado", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'FORNECEDOR', header: "Fornecedor", width: 160, sortable: true, dataIndex: 'FORNECEDOR' },
            { id: 'CUSTO_ESTOQUE', header: "Custo Estoque", width: 105, sortable: true, dataIndex: 'CUSTO_ESTOQUE', renderer: FormataValor_4, align: 'center' },
            { id: 'CUSTO_VENDAS', header: "Custo (Vendas)", width: 105, sortable: true, dataIndex: 'CUSTO_VENDAS', renderer: FormataValor_4, align: 'center' },

            { id: 'QTDE_ESTOQUE', header: "Qtde. Estoque", width: 120, sortable: true, dataIndex: 'QTDE_ESTOQUE', renderer: FormataQtde, align: 'center' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde. Pedido", width: 120, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', renderer: FormataQtde, align: 'center' },
            { id: 'QTDE_SOLICITACAO', header: "Qtde. Solicitada", width: 120, sortable: true, dataIndex: 'QTDE_SOLICITACAO', renderer: FormataQtde, align: 'center' },
            { id: 'OUTROS_PEDIDOS', header: "Qtde. Outros Pedidos", width: 130, sortable: true, dataIndex: 'OUTROS_PEDIDOS', renderer: FormataQtde, align: 'center' }
            ],
        stripeRows: true,
        height: 600,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function CarregaGrid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Consulta_Solicitacoes_do_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            PEDIDO_VENDA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    if (pNUMERO_PEDIDO_VENDA) {
        TXT_NUMERO_PEDIDO.setValue(pNUMERO_PEDIDO_VENDA);
        CarregaGrid();
    }

    var formPEDIDO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        items: [{
            layout: 'form',
            items: [TXT_NUMERO_PEDIDO]
}]
        });

        var panel1 = new Ext.Panel({
            autoHeight: true,
            border: false,
            bodyStyle: 'padding:0px 0px 0',
            width: '100%',
            anchor: '100%',
            title: 'Consulta de Estoque X Pedido de Venda',
            items: [formPEDIDO, grid_PEDIDO_VENDA]
        });

        grid_PEDIDO_VENDA.setHeight(AlturaDoPainelDeConteudo(116));

        return panel1;
    }
