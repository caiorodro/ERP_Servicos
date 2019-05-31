function janela_Local_Material_Expedido() {
    var _NUMERO_PEDIDO_VENDA;

    this.NUMERO_PEDIDO_VENDA = function (pValue) {
        _NUMERO_PEDIDO_VENDA = pValue;
    };

    var _NUMERO_ITEM_VENDA;

    this.NUMERO_ITEM_VENDA = function (pValue) {
        _NUMERO_ITEM_VENDA = pValue;
    };

    var Store_LOCAL_SEPARACAO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'NUMERO_ETIQUETA', 'QTDE_ETIQUETA', 'PESO_ETIQUETA', 'NOME_SEPARADOR', 'DESCRICAO_LOCAL', 
          'UNIDADE', 'CODIGO_PRODUTO_PEDIDO'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: Store_LOCAL_SEPARACAO,
        columns: [
                { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                { id: 'QTDE_ETIQUETA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ETIQUETA', align: 'center' },
                { id: 'UNIDADE', header: "Un.", width: 45, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
                { id: 'DESCRICAO_LOCAL', header: "Local do material expedido", width: 180, sortable: true, dataIndex: 'DESCRICAO_LOCAL' },
                { id: 'NOME_SEPARADOR', header: "Separador", width: 110, sortable: true, dataIndex: 'NOME_SEPARADOR' }
            ],
        stripeRows: true,
        width: '100%',
        height: 220
    });

    function carrega_Grid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Lista_Local_Material_Separado');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO_VENDA,
            NUMERO_ITEM: _NUMERO_ITEM_VENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_LOCAL_SEPARACAO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wJANELA = new Ext.Window({
        layout: 'form',
        iconCls: 'icone_TB_TRANSPORTADORA',
        width: 680,
        title: 'Locais do material expedido',
        height: 'auto',
        closable: false,
        draggable: false,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
                _shown = false;
            }
        },
        items: [grid1]
    });

    this.show = function (elm) {
        wJANELA.setPosition(elm.getPosition()[0] - 220, elm.getPosition()[1] + elm.getHeight());
        wJANELA.toFront();
        wJANELA.show(elm.getId());
        
        _shown = true;

        carrega_Grid();
    };

    this.carregaGrid = function () {
        carrega_Grid();
    };

    var _shown = false;

    this.shown = function () {
        return _shown;
    };
}