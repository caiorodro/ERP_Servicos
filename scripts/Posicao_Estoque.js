function MontaSaldoEmEstoque() {
    var _Store_SALDO_ESTOQUE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'SALDO_ESTOQUE', 'NUMERO_PECAS_CAIXA_PEQUENA', 'NUMERO_PECAS_CAIXA_GRANDE'])
    });

    var _gridSaldoEstoque = new Ext.grid.GridPanel({
        store: _Store_SALDO_ESTOQUE,
        title: 'Produtos',
        columns: [
            { id: 'CODIGO_PRODUTO', header: "Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 330, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'SALDO_ESTOQUE', header: "Estoque", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE', renderer: FormataQtde, align: 'center' },
            { id: 'NUMERO_PECAS_CAIXA_PEQUENA', header: "Embalagem (pequena)", width: 120, sortable: true, dataIndex: 'NUMERO_PECAS_CAIXA_PEQUENA', renderer: FormataQtde, align: 'center' },
            { id: 'NUMERO_PECAS_CAIXA_GRANDE', header: "Embalagem (grande)", width: 120, sortable: true, dataIndex: 'NUMERO_PECAS_CAIXA_GRANDE', renderer: FormataQtde, align: 'center'}],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(158),
        width: '100%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,

            listeners: {
                rowselect: function (_sm, rowIndex, record) {
                    if (rowIndex > -1) {
                        CarregaSaldoLocal(record.data.ID_PRODUTO);
                        CarregaProgramacao(record.data.ID_PRODUTO);
                    }
                }
            }
        })
    });

    /////////////////////////////

    var TXT_FILTRO_SALDO_ESTOQUE = new Ext.form.TextField({
        id: 'TXT_FILTRO_SALDO_ESTOQUE',
        name: 'TXT_FILTRO_SALDO_ESTOQUE',
        layout: 'form',
        fieldLabel: 'C&oacute;digo / Descri&ccedil;&atilde;o do Produto',
        width: 280,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_SALDO_ESTOQUE();
                }
            }
        }
    });

    var BTN_SALDO_ESTOQUE = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            Carrega_SALDO_ESTOQUE();
        }
    });

    var formSaldoEstoque = new Ext.FormPanel({
        id: 'formSaldoEstoque',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        width: '100%',
        height: 70,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .25,
                layout: 'form',
                items: [TXT_FILTRO_SALDO_ESTOQUE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [BTN_SALDO_ESTOQUE]
            }]
        }]
    });

    var SALDO_ESTOQUE_PagingToolbar = new Th2_PagingToolbar();

    SALDO_ESTOQUE_PagingToolbar.setUrl('servicos/TB_ESTOQUE.asmx/SaldoPorLocal');

    function RetornaFiltros_SALDO_ESTOQUE_JsonData() {
        var _pesquisa = Ext.getCmp('TXT_FILTRO_SALDO_ESTOQUE') ? Ext.getCmp('TXT_FILTRO_SALDO_ESTOQUE').getValue() : '';

        var SALDO_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            Pesquisa: _pesquisa,
            start: 0,
            limit: 25
        };

        return SALDO_JsonData;
    }

    function Carrega_SALDO_ESTOQUE() {
        SALDO_ESTOQUE_PagingToolbar.setStore(_Store_SALDO_ESTOQUE);
        SALDO_ESTOQUE_PagingToolbar.setParamsJsonData(RetornaFiltros_SALDO_ESTOQUE_JsonData());
        SALDO_ESTOQUE_PagingToolbar.doRequest();

        Store_SALDO_LOCAL.removeAll();
        Store_programacao.removeAll();
    }

    var Store_SALDO_LOCAL = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
             ['DESCRICAO_LOCAL', 'SALDO'])
    });

    var GRID_SALDO_LOCAL = new Ext.grid.GridPanel({
        store: Store_SALDO_LOCAL,
        title: 'Saldo de estoque por local',
        columns: [
                { id: 'DESCRICAO_LOCAL', header: "Local", width: 190, sortable: true, dataIndex: 'DESCRICAO_LOCAL' },
                { id: 'SALDO', header: "Saldo", width: 100, sortable: true, dataIndex: 'SALDO', renderer: FormataQtde, align: 'center' }
            ],
        stripeRows: true,
        width: '100%',
        height: AlturaDoPainelDeConteudo(440),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function CarregaSaldoLocal(_ID_PRODUTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/Saldo_por_Local');
        _ajax.setJsonData({
            ID_PRODUTO: _ID_PRODUTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucesso = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_SALDO_LOCAL.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    var Store_programacao = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
             ['NOME_VENDEDOR', 'NOME_FANTASIA_FORNECEDOR', 'QTDE', 'PREVISAO_CHEGADA'])
    });

    var GRID_PROGRAMACAO = new Ext.grid.GridPanel({
        store: Store_programacao,
        title: 'Carteira de fornecedores',
        columns: [
                { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 110, sortable: true, dataIndex: 'NOME_VENDEDOR' },
                { id: 'QTDE', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE', renderer: FormataQtde, align: 'center' },
                { id: 'PREVISAO_CHEGADA', header: "Previs&atilde;o", width: 80, sortable: true, dataIndex: 'PREVISAO_CHEGADA', renderer: XMLParseDate },
                { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 130, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' }
            ],
        stripeRows: true,
        width: '100%',
        height: 309,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function CarregaProgramacao(_ID_PRODUTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PROGRAMACAO_COMPRA_VENDEDOR.asmx/Carrega_Programacao_do_Produto');
        _ajax.setJsonData({
            ID_PRODUTO: _ID_PRODUTO,
            ID_VENDEDOR: _ID_VENDEDOR,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucesso = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Store_programacao.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    var panelSaldo = new Ext.Panel({
        id: 'panelSaldo',
        width: '100%',
        title: 'Saldo de Produtos em Estoques',
        autoHeight: true,
        border: true,
        items: [formSaldoEstoque, {
            layout: 'column',
            items: [{
                columnWidth: .70,
                items: [_gridSaldoEstoque, SALDO_ESTOQUE_PagingToolbar.PagingToolbar()]
            }, {
                columnWidth: .30,
                items: [GRID_SALDO_LOCAL, GRID_PROGRAMACAO]
            }]
        }]
    });

    var panelEstoque = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        items: [panelSaldo]
    });

    return panelEstoque;

    /////////////////////

    function GridSaldoEmEstoques() {
        var PRODUTO = '';

        function RetornaFiltros_SALDO_ESTOQUE_JsonData() {
            var _pesquisa = PRODUTO ? PRODUTO : '';

            var SALDO_JsonData = {
                ID_USUARIO: _ID_USUARIO,
                pesquisa: _pesquisa,
                start: 0,
                limit: 18
            };

            return SALDO_JsonData;
        }

        var SALDO_ESTOQUE_PagingToolbar = new Th2_PagingToolbar();

        SALDO_ESTOQUE_PagingToolbar.setUrl('servicos/TB_ESTOQUE.asmx/SaldoPorLocal');
        SALDO_ESTOQUE_PagingToolbar.setParamsJsonData(RetornaFiltros_SALDO_ESTOQUE_JsonData());

        //////////////////////

        this.GridPanel = function () {
            return _gridSaldoEstoque;
        };

        this.PagingToolbar = function () {
            return SALDO_ESTOQUE_PagingToolbar.PagingToolbar();
        };

        this.CarregaGrid = function (_PRODUTO) {
            PRODUTO = _PRODUTO;

            SALDO_ESTOQUE_PagingToolbar.setStore(_Store_SALDO_ESTOQUE);
            SALDO_ESTOQUE_PagingToolbar.setParamsJsonData(RetornaFiltros_SALDO_ESTOQUE_JsonData());
            SALDO_ESTOQUE_PagingToolbar.doRequest();
        };
    }
}