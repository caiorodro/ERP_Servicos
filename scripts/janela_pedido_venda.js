function JANELA_PEDIDO_VENDA() {
    var _NUMERO_PEDIDO_COMPRA;
    var _NUMERO_ITEM_COMPRA;

    var _record_ITEM_COMPRA;

    this.NUMERO_PEDIDO_COMPRA = function (pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO_COMPRA = pNUMERO_PEDIDO;
    };

    this.NUMERO_ITEM_COMPRA = function (pNUMERO_ITEM) {
        _NUMERO_ITEM_COMPRA = pNUMERO_ITEM;
    };

    this.record_ITEM_COMPRA = function (pRecord) {
        _record_ITEM_COMPRA = pRecord;
    };

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Nr. do Pedido de Venda',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Carrega_ITENS_PEDIDO_POR_PEDIDO();
                    }
                    else {
                        Carrega_ITENS_PEDIDO();
                    }
                }
            }
        }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    var TXT_DATA_PEDIDO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Emiss&atilde;o',
        width: 94,
        value: dt1,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Cliente',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var BTN_BUSCAR = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_ITENS_PEDIDO();
        }
    });

    function Associa_Pedidos() {
        if (_NUMERO_PEDIDO_COMPRA == 0) {
            dialog.MensagemDeErro('Selecione um item de compra na tela anterior antes de associar com o(s) item(ns) de venda');
            return;
        }

        if (grid_PEDIDO_VENDA.getSelectionModel().selections.length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens para associar ao pedido de compra');
            return;
        }

        var arrPedidos = new Array();
        var arrItens = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            arrPedidos[i] = record.data.NUMERO_PEDIDO;
            arrItens[i] = record.data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Associa_Item_Compra_com_Itens_Venda');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM_COMPRA,
            NUMERO_PEDIDOS_VENDA: arrPedidos,
            NUMERO_ITEMS_VENDA: arrItens,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

                if (record.data.NUMERO_PEDIDO_COMPRA == 0) {
                    record.beginEdit();

                    record.set('NUMERO_PEDIDO_COMPRA', _NUMERO_PEDIDO_COMPRA);
                    record.set('NUMERO_ITEM_COMPRA', _NUMERO_ITEM_COMPRA);
                    record.set('STATUS_COMPRA', result.STATUS_COMPRA);
                    record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                    record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                    record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);

                    record.set('STATUS_ITEM_PEDIDO', result.STATUS_ITEM_PEDIDO);
                    record.set('COR_STATUS', result.COR_STATUS);
                    record.set('COR_FONTE_STATUS', result.COR_FONTE_STATUS);
                    record.set('DESCRICAO_STATUS_PEDIDO', result.DESCRICAO_STATUS_PEDIDO);

                    record.endEdit();
                    record.commit();
                }
            }

            if (result.ITENS_ASSOCIADOS == 2) {
                _record_ITEM_COMPRA.beginEdit();
                _record_ITEM_COMPRA.set('NUMERO_PEDIDO_VENDA', 0);
                _record_ITEM_COMPRA.set('NUMERO_ITEM_VENDA', 0);
                _record_ITEM_COMPRA.set('ITENS_ASSOCIADOS', 1);
                _record_ITEM_COMPRA.endEdit();
                _record_ITEM_COMPRA.commit();
            }
            else {
                _record_ITEM_COMPRA.beginEdit();
                _record_ITEM_COMPRA.set('NUMERO_PEDIDO_VENDA', grid_PEDIDO_VENDA.getSelectionModel().selections.items[0].data.NUMERO_PEDIDO);
                _record_ITEM_COMPRA.set('NUMERO_ITEM_VENDA', grid_PEDIDO_VENDA.getSelectionModel().selections.items[0].data.NUMERO_ITEM);
                _record_ITEM_COMPRA.endEdit();
                _record_ITEM_COMPRA.commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

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
                '] n&atilde;o est&aacute; associado com nenhum pedido de compra. Desmarque a sele&ccedil;&atilde;o do item');

                return;
            }

            arrPedidos[i] = record.data.NUMERO_PEDIDO;
            arrItens[i] = record.data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Desvincula_Item_Compra_com_Itens_Venda');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM_COMPRA,
            NUMERO_PEDIDOS_VENDA: arrPedidos,
            NUMERO_ITEMS_VENDA: arrItens,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO',
            'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'MARGEM_VENDA_ITEM_PEDIDO', 'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO',
            'DESCRICAO_PRODUTO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'DESCRICAO_CP', 'NOME_VENDEDOR',
            'STATUS_ESPECIFICO', 'ATRASADA', 'ITEM_A_COMPRAR',
            'CERTIFICADO', 'NUMERO_LOTE_ITEM_PEDIDO', 'ITEM_REQUER_BENEFICIAMENTO'])
    });

    var checkBoxSM_Vincular = new Ext.grid.CheckboxSelectionModel();

    var grid_PEDIDO_VENDA = new Ext.grid.GridPanel({
        tbar: [{
            text: 'Associar item(ns) selecionados com o item de compra',
            icon: 'imagens/icones/copy_level2_16.gif',
            scale: 'small',
            handler: function () {
                Associa_Pedidos();
            }
        }, {
            text: 'Desvincular item(ns) selecionados com o item de compra',
            icon: 'imagens/icones/copy_remove2_16.gif',
            scale: 'small',
            handler: function () {
                Desvincula_Pedidos();
            }
        }],
        store: PEDIDO_VENDA_Store,
        columns: [
        checkBoxSM_Vincular,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido, locked: true },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Compras },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 390, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },

            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ITEM_REQUER_CERTIFICADO', header: "Requer Certificado", width: 110, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01, align: 'center' },

            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 120, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' }

        ],
        stripeRows: true,
        height: 490,
        width: '100%',

        sm: checkBoxSM_Vincular
    });

    var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();
    ITENS_PEDIDO_PagingToolbar.setStore(PEDIDO_VENDA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var _NUMERO_PEDIDO = TXT_NUMERO_PEDIDO.getValue();

        if (_NUMERO_PEDIDO.length == 0)
            _NUMERO_PEDIDO = 0;

        var TB_TRANSP_JsonData = {
            DATA_PEDIDO: TXT_DATA_PEDIDO.getRawValue(),
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            CLIENTE: TXT_CLIENTE.getValue(),
            start: 0,
            limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Venda_Para_Associar_no_Item_Venda');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Carrega_ITENS_PEDIDO_POR_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Venda_Para_Associar_no_Item_Venda_por_Numero_Pedido');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    var wPedido_Venda = new Ext.Window({
        layout: 'form',
        title: 'Itens de Venda',
        iconCls: 'icone_PEDIDO_VENDA',
        width: 1000,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [{
            frame: true,
            border: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .18,
                    layout: 'form',
                    labelWidth: 50,
                    items: [TXT_DATA_PEDIDO]
                }, {
                    columnWidth: .27,
                    layout: 'form',
                    labelWidth: 140,
                    items: [TXT_NUMERO_PEDIDO]
                }, {
                    columnWidth: .36,
                    layout: 'form',
                    labelWidth: 50,
                    items: [TXT_CLIENTE]
                }, {
                    columnWidth: .12,
                    items: [BTN_BUSCAR]
                }]
            }]
        },
        grid_PEDIDO_VENDA, ITENS_PEDIDO_PagingToolbar.PagingToolbar()],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (objAnm) {
        wPedido_Venda.show(objAnm);
        TXT_DATA_PEDIDO.focus();
    };
}