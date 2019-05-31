function Monta_Rastreabilidade_Produto() {

    ////////////////

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo / Descri&ccedil;&atilde;o do produto',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    ITEM_COTACAO_CARREGA_GRID();
                }
            }
        }
    });

    var btn_listar_itens = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            ITEM_COTACAO_CARREGA_GRID();
        }
    });

    var btn_consultar_lotes = new Ext.Button({
        text: 'Consultar lotes',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function (btn) {
            Busca_Lotes(btn);
        }
    });

    function Busca_Lotes(btn) {
        if (grid_PRODUTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais produtos antes de consultar os lotes', btn.getId());
            return;
        }

        var items = new Array();

        for (var i = 0; i < grid_PRODUTOS.getSelectionModel().selections.length; i++) {
            items[i] = grid_PRODUTOS.getSelectionModel().selections.items[i].data.ID_PRODUTO;
        }

        LOTE_PagingToolbar.setParamsJsonData({
            ID_PRODUTO: items,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        });

        LOTE_PagingToolbar.doRequest();
    }

    var PRODUTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
        ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'QTDE_ESTOQUE'])
    });

    var checkBoxSM_IO = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {

            }
        }
    });

    var grid_PRODUTOS = new Ext.grid.GridPanel({
        store: PRODUTO_Store,
        columns: [
                checkBoxSM_IO,
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'QTDE_ESTOQUE', header: "Estoque", width: 90, sortable: true, dataIndex: 'QTDE_ESTOQUE', renderer: FormataQtde, align: 'center' }
                ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: checkBoxSM_IO,

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                Busca_Lotes(btn_consultar_lotes);
            }
        }
    });

    var PRODUTOS_PagingToolbar = new Th2_PagingToolbar();
    PRODUTOS_PagingToolbar.setUrl('servicos/TB_ESTOQUE.asmx/Lista_produtos');
    PRODUTOS_PagingToolbar.setStore(PRODUTO_Store);

    function ITEM_COTACAO_CARREGA_GRID() {

        PRODUTOS_PagingToolbar.setParamsJsonData({
            PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        });

        PRODUTOS_PagingToolbar.doRequest();
    }

    var panelItems = new Ext.Panel({
        width: '100%',
        bodyStyle: 'padding:0px 0px 0',
        frame: true,
        border: false,
        title: 'Lista de produtos',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .65,
                labelAlign: 'left',
                layout: 'form',
                labelWidth: 175,
                items: [TXT_CODIGO_PRODUTO]
            }, {
                columnWidth: .13,
                items: [btn_listar_itens]
            }, {
                columnWidth: .18,
                items: [btn_consultar_lotes]
            }]
        }, grid_PRODUTOS, PRODUTOS_PagingToolbar.PagingToolbar()]
    });

    // Fornecedores

    var TXT_NOME_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FORNECEDOR_CARREGA_GRID();
                }
            }
        }
    });

    var LOTE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
            ['CODIGO_PRODUTO_COMPRA', 'NUMERO_LOTE_RECEBIMENTO', 'NOME_FANTASIA_FORNECEDOR']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var checkBoxSM_IO1 = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {

            }
        }
    });

    var grid_LOTES = new Ext.grid.GridPanel({
        tbar: [{
            id: 'BTN_CONSULTAR_HISTORICO_LOTE',
            text: 'Consultar hist&oacute;rico do produto',
            icon: 'imagens/icones/relation_lock_16.gif',
            scale: 'small',
            handler: function (btn) {
                busca_Historico(btn);
            }
        }, '-'],
        store: LOTE_Store,
        columns: [
            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 220, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'NUMERO_LOTE_RECEBIMENTO', header: "N&ordm; do lote", width: 160, sortable: true, dataIndex: 'NUMERO_LOTE_RECEBIMENTO'}],
        stripeRows: true,
        height: 226,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                busca_Historico(Ext.getCmp('BTN_CONSULTAR_HISTORICO_LOTE'));
            }
        }
    });

    function busca_Historico(btn) {
        if (grid_LOTES.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um lote para consultar o hist&oacute;rico do produto', btn.getId());
            return;
        }

        var record = grid_LOTES.getSelectionModel().selections.items[0];

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/Busca_historico_do_produto_por_lote');
        _ajax.setJsonData({
            NUMERO_LOTE: record.data.NUMERO_LOTE_RECEBIMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            RASTRO_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var LOTE_PagingToolbar = new Th2_PagingToolbar();
    LOTE_PagingToolbar.setUrl('servicos/TB_ESTOQUE.asmx/Lista_Lotes_de_um_Produto');
    LOTE_PagingToolbar.setStore(LOTE_Store);

    var pLotes = new Ext.Panel({
        width: '100%',
        bodyStyle: 'padding:0px 0px 0',
        title: 'Lotes',
        frame: true,
        border: false,
        items: [grid_LOTES, LOTE_PagingToolbar.PagingToolbar()]
    });

    ///////////////
    var RASTRO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' }, ['RASTRO']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var grid_Rastro = new Ext.grid.EditorGridPanel({
        title: 'Hist&oacute;rico do lote de produto',
        store: RASTRO_Store,
        columns: [
                { id: 'RASTRO', header: "Hist&oacute;rico", width: 750, sortable: true, dataIndex: 'RASTRO' }
                ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var pRastro = new Ext.Panel({
        width: '100%',
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.50,
                items: [panelItems]
            }, {
                columnWidth: 0.50,
                items: [pLotes]
            }]
        }, {
            items: [grid_Rastro]
        }]
    });

    grid_Rastro.setHeight(AlturaDoPainelDeConteudo(323));

    return pRastro;
}