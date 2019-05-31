function Busca_de_Produtos() {

    var _acaoPopular;
    var _CODIGO_CLIENTE;

    this.acaoPopular = function(pAcao) {
        _acaoPopular = pAcao;
    };

    this.CODIGO_CLIENTE = function(pCODIGO) {
        _CODIGO_CLIENTE = pCODIGO;
    };

    var TXT_COD_PRODUTO_FILTRO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 180,
        maxLegth: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_TB_PRODUTO();
                }
            }
        }
    });

    var TXT_DESCRICAO_PRODUTO = new Ext.form.TextField({
        width: 250,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '50', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialKey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_TB_PRODUTO();
                }
            }
        }
    });

    var BTN_PESQUISA_PRODUTO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function() { Carrega_Busca_TB_PRODUTO(); }
    });

    var Store_PESQUISA_PRODUTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'PRECO_PRODUTO', 'ALIQ_IPI_PRODUTO', 'UNIDADE_MEDIDA_VENDA',
         'MARKUP_PRODUTO', 'MARGEM_MINIMA_PRODUTO', 'ICMS_DIF_PRODUTO', 'ULTIMA_COMPRA',
         'SALDO_ESTOQUE', 'PRODUTO_ESPECIAL', 'ULTIMO_PRECO', 'PEDIDOS_EM_ANDAMENTO'])
    });

    var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
        store: Store_PESQUISA_PRODUTO,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;ão", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'SALDO_ESTOQUE', header: "Estoque", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE', renderer: FormataQtde, align: 'center' },
                { id: 'PEDIDOS_EM_ANDAMENTO', header: "Pedidos em Andamento", width: 140, sortable: true, dataIndex: 'PEDIDOS_EM_ANDAMENTO', renderer: FormataQtde, align: 'center' },
                { id: 'ULTIMO_PRECO', header: "Ult. Pr&ccedil; / Pr&ccedil; Venda", width: 120, sortable: true, dataIndex: 'ULTIMO_PRECO', renderer: FormataValor_4, align: 'center' },
                { id: 'ULTIMA_COMPRA', header: "Ultima Compra", width: 115, sortable: true, dataIndex: 'ULTIMA_COMPRA', renderer: Ultima_Compra_Cliente },
                { id: 'MARGEM_MINIMA_PRODUTO', header: "Margem M&iacute;nima", width: 90, sortable: true, dataIndex: 'MARGEM_MINIMA_PRODUTO', renderer: FormataPercentual },
                { id: 'ICMS_DIF_PRODUTO', header: "% ICMS Dif.", width: 80, sortable: true, dataIndex: 'ICMS_DIF_PRODUTO' },
                { id: 'ALIQ_IPI_PRODUTO', header: "Al&iacute;q. IPI", width: 70, sortable: true, dataIndex: 'ALIQ_IPI_PRODUTO', renderer: FormataPercentual },
                { id: 'UNIDADE_MEDIDA_VENDA', header: "Unidade", width: 60, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' }
            ],
        stripeRows: true,
        width: '100%',
        height: 450,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            rowdblclick: function(grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                _acaoPopular(record);
                wBUSCA_PRODUTO.hide();
            },
            keydown: function(e) {
                if (e.getKey() == e.ENTER) {
                    if (GRID_PESQUISA_PRODUTO.getSelectionModel().getSelections().length > 0) {
                        var record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();
                        _acaoPopular(record);

                        wBUSCA_PRODUTO.hide();
                    }
                }
            }
        }
    });

    function RetornaFiltros_TB_PRODUTO_JsonData() {
        var TB_PRODUTO_JsonData = {
            Pesquisa: TXT_DESCRICAO_PRODUTO.getValue(),
            CODIGO_CLIENTE: _CODIGO_CLIENTE ? _CODIGO_CLIENTE : 0,
            CODIGO_PRODUTO: TXT_COD_PRODUTO_FILTRO.getValue(),
            SOMENTE_PRODUTO_ACABADO: true,
            start: 0,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO);

    function Carrega_Busca_TB_PRODUTO() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    var wBUSCA_PRODUTO = new Ext.Window({
        layout: 'form',
        title: 'Busca de Produto(s)',
        iconCls: 'icone_TB_PRODUTO',
        width: 1000,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function(w) {
                w.hide();
            }
        },
        items: [GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar(),
            {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .07,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Código:'
                }, {
                    columnWidth: .25,
                    items: [TXT_COD_PRODUTO_FILTRO]
                }, {
                    columnWidth: .15,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Descrição do Produto:'
                }, {
                    columnWidth: .30,
                    items: [TXT_DESCRICAO_PRODUTO]
                }, {
                    columnWidth: .12,
                    layout: 'form',
                    items: [BTN_PESQUISA_PRODUTO]
}]
}]
    });

    this.show = function(elm) {
        wBUSCA_PRODUTO.show(elm);
        TXT_DESCRICAO_PRODUTO.focus();
    };
}