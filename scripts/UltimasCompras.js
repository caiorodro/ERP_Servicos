function MontaUltimasCompras() {

    var TXT_UP_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 170,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_PAINEL_ULTIMAS_VENDAS();
                }
            }
        }
    });

    var TXT_UP_NOME_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Cliente / Fornecedor',
        width: 260,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_PAINEL_ULTIMAS_VENDAS();
                }
            }
        }
    });

    var TXT_UPDATA = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Emiss&atilde;o',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_PAINEL_ULTIMAS_VENDAS();
                }
            }
        }
    });

    var _dt1 = new Date();
    TXT_UPDATA.setValue(_dt1);

    var CB_CLIENTE_FORNECEDOR = new Ext.form.RadioGroup({
        fieldLabel: 'Origem',
        columns: 1,
        items: [{
            boxLabel: 'Cliente',
            name: 'rCliFor',
            checked: true
        }, {
            boxLabel: 'Fornecedor',
            name: 'rCliFor',
            checked: false
        }]
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            CARREGA_GRID_PAINEL_ULTIMAS_VENDAS();
        }
    });

    ///////////////////// Busca de Produtos
    var TB_UP_BUSCA_PRODUTO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'UNIDADE_MEDIDA_VENDA', 'PRECO_PRODUTO', 'CLAS_FISCAL_PRODUTO'
        , 'SIT_TRIB_PRODUTO', 'ALIQ_IPI_PRODUTO', 'Saldo']
           )
    });

    function Saldo_Estoque(val) {
        if (val > 0) {
            return '<span style="color:darkblue; text-align: center; width: 100%;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red; text-align: center; width: 100%;">' + val + '</span>';
        }
        return val;
    }

    var gridUP_Produto = new Ext.grid.GridPanel({
        store: TB_UP_BUSCA_PRODUTO_STORE,
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'Saldo', header: "Estoque", width: 80, sortable: true, dataIndex: 'Saldo', renderer: Saldo_Estoque },
            { id: 'UNIDADE_MEDIDA_VENDA', header: "Un", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' },
            { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o de Venda", width: 140, sortable: true, dataIndex: 'PRECO_PRODUTO' },
            { id: 'CLAS_FISCAL_PRODUTO', header: "Clas. Fiscal", width: 100, sortable: true, dataIndex: 'CLAS_FISCAL_PRODUTO' },
            { id: 'SIT_TRIB_PRODUTO', header: "Sit. Tribut&aacute;ria", width: 100, sortable: true, dataIndex: 'SIT_TRIB_PRODUTO' },
            { id: 'ALIQ_IPI_PRODUTO', header: "Al&iacute;q. IPI", width: 100, sortable: true, dataIndex: 'ALIQ_IPI_PRODUTO' }
        ],

        stripeRows: true,
        height: 150,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaCamposProduto(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposProduto(record);
            }
        }
    });

    function PopulaCamposProduto(record) {
        TXT_UP_CODIGO_PRODUTO.setValue(record.data.CODIGO_PRODUTO);
        fsBuscaProduto_UP.collapse();
        TXT_UP_NOME_CLIENTE.focus();
    }

    var TB_UP_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_UP_PRODUTO_PagingToolbar.setUrl('servicos/TB_PRODUTO.asmx/Lista_TB_PRODUTO');
    TB_UP_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_UP_PRODUTO_JsonData());
    TB_UP_PRODUTO_PagingToolbar.setStore(TB_UP_BUSCA_PRODUTO_STORE);

    function RetornaFiltros_TB_UP_PRODUTO_JsonData() {
        var _pesquisa = TB_UP_TXT_PESQUISA_PRODUTO ?
                            TB_UP_TXT_PESQUISA_PRODUTO.getValue() : '';

        var TB_TRANSP_JsonData = {
            Pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_UP_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Produto_UP() {
        TB_UP_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_UP_PRODUTO_JsonData());
        TB_UP_PRODUTO_PagingToolbar.doRequest();
    }

    var TB_UP_TXT_PESQUISA_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Produto',
        labelAlign: 'left',
        layout: 'form',
        labelWidth: 110,
        width: 220,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Produto_UP();
                }
            }
        }
    });

    var UP_BTN_PESQUISA_PRODUTO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Produto_UP();
        }
    });

    var fsBuscaProduto_UP = new Ext.form.FieldSet({
        title: 'Busca de Produto',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                TB_UP_TXT_PESQUISA_PRODUTO.focus();
                formFiltrosPainelUltimosPrecosSaida.setHeight(350);
            },
            collapse: function (f) {
                formFiltrosPainelUltimosPrecosSaida.setHeight(115);
            }
        }
    });

    fsBuscaProduto_UP.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .07,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Produto:'
            }, {
                columnWidth: .28,
                items: [TB_UP_TXT_PESQUISA_PRODUTO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [UP_BTN_PESQUISA_PRODUTO]
            }]
        }, gridUP_Produto, TB_UP_PRODUTO_PagingToolbar.PagingToolbar()]
    });

    ///////////////////////

    var formFiltrosPainelUltimosPrecosSaida = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        height: 115,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_UP_CODIGO_PRODUTO]
            }, {
                columnWidth: .11,
                items: [CB_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [TXT_UP_NOME_CLIENTE]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_UPDATA]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [BTN_PESQUISA]
            }]
        }, {
            layout: 'form',
            items: [fsBuscaProduto_UP]
        }]
    });

    // Grid

    var ULTIMO_PRECO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ITEM_NF', 'SEQUENCIA_ITEM_NF', 'CODIGO_PRODUTO_ITEM_NF', 'DESCRICAO_PRODUTO_ITEM_NF', 'CODIGO_CFOP_ITEM_NF',
                'UNIDADE_MEDIDA_ITEM_NF', 'QTDE_ITEM_NF', 'VALOR_UNITARIO_ITEM_NF', 'VALOR_TOTAL_ITEM_NF',
                'DATA_EMISSAO', 'NOME_CLIENTE', 'CODIGO_ITEM_CLIENTE', 'NUMERO_PEDIDO_ITEM_NF', 'NUMERO_LOTE_ITEM_NF']
       )
    });

    ULTIMO_PRECO_Store.sort('DATA_EMISSAO', 'desc');

    function RetornaUltimoPrecoJsonData() {
        var cliFor;
        if (CB_CLIENTE_FORNECEDOR.items.items)
            cliFor = CB_CLIENTE_FORNECEDOR.items.items[0].checked ? 'C' : 'F';
        else
            cliFor = CB_CLIENTE_FORNECEDOR.items[0].checked ? 'C' : 'F';

        var _JsonData = {
            CODIGO_PRODUTO: TXT_UP_CODIGO_PRODUTO.getValue(),
            DATA_EMISSAO: TXT_UPDATA.getRawValue(),
            CLIENTE_FORNECEDOR: cliFor,
            NOME_CLIENTE: TXT_UP_NOME_CLIENTE.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var PainelUltimoPrecoPagingToolbar = new Th2_PagingToolbar();
    PainelUltimoPrecoPagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/BuscaUltimoPreco');
    PainelUltimoPrecoPagingToolbar.setStore(ULTIMO_PRECO_Store);

    function CARREGA_GRID_PAINEL_ULTIMAS_VENDAS() {
        if (!formFiltrosPainelUltimosPrecosSaida.getForm().isValid()) {
            fsBuscaProduto_UP.expand();
        }
        else {
            PainelUltimoPrecoPagingToolbar.setParamsJsonData(RetornaUltimoPrecoJsonData());
            PainelUltimoPrecoPagingToolbar.doRequest();
        }
    }

    var gridPainelUltimoPreco = new Ext.grid.GridPanel({
        store: ULTIMO_PRECO_Store,
        columns: [
        { id: 'NUMERO_ITEM_NF', header: "NF / Pedido", width: 70, sortable: true, dataIndex: 'NUMERO_ITEM_NF', align: 'center' },
        { id: 'DATA_EMISSAO', header: "Emiss&atilde;o", width: 80, sortable: true, dataIndex: 'DATA_EMISSAO', renderer: XMLParseDate },
        { id: 'NOME_CLIENTE', header: "Cliente/Fornecedor", width: 140, sortable: true, dataIndex: 'NOME_CLIENTE' },
        { id: 'CODIGO_PRODUTO_ITEM_NF', header: "C&oacute;d. Produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO_ITEM_NF' },
        { id: 'DESCRICAO_PRODUTO_ITEM_NF', header: "Descri&ccedil;&atilde;o do Produto", width: 340, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_NF' },
        { id: 'CODIGO_CFOP_ITEM_NF', header: "CFOP", width: 65, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_NF', hidden: true },
        { id: 'UNIDADE_MEDIDA_ITEM_NF', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_ITEM_NF' },
        { id: 'QTDE_ITEM_NF', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_NF', renderer: FormataQtde, align: 'center' },
        { id: 'VALOR_UNITARIO_ITEM_NF', header: "Valor Unit&aacute;rio", width: 100, sortable: true, dataIndex: 'VALOR_UNITARIO_ITEM_NF', renderer: FormataValor_4, align: 'right' },
        { id: 'VALOR_TOTAL_ITEM_NF', header: "Total do Item", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_NF', renderer: FormataValor, align: 'right' },
        { id: 'CODIGO_ITEM_CLIENTE', header: "C&oacute;d. Cliente", width: 130, sortable: true, dataIndex: 'CODIGO_ITEM_CLIENTE' },
        { id: 'NUMERO_PEDIDO_ITEM_NF', header: "Nr. do Pedido ", width: 130, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_NF' },
        { id: 'NUMERO_LOTE_ITEM_NF', header: "Nr. Lote", width: 180, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_NF' }
    ],
        stripeRows: true,
        height: 424,
        width: '100%'

    });

    var panelUltimoPreco = new Ext.Panel({
        width: '100%',
        border: true,
        title: '',
        items: [formFiltrosPainelUltimosPrecosSaida, gridPainelUltimoPreco, PainelUltimoPrecoPagingToolbar.PagingToolbar()]
    });

    this.isWindow = function (pWindow) {
        if (!pWindow)
            gridPainelUltimoPreco.setHeight(AlturaDoPainelDeConteudo(172));
    };

    this.painel_Ultimas_Compras = function () {
        return panelUltimoPreco;
    };

    this.Cliente_Fornecedor = function (pCliente_Fornecedor) {
        if (pCliente_Fornecedor == 0) {
            CB_CLIENTE_FORNECEDOR.items[0].checked = true;
            CB_CLIENTE_FORNECEDOR.items[1].checked = false;
        }
        else {
            CB_CLIENTE_FORNECEDOR.items[1].checked = true;
            CB_CLIENTE_FORNECEDOR.items[0].checked = false;
        }
    };

    this.setCodigoProduto = function (pCODIGO_PRODUTO) {
        TXT_UP_CODIGO_PRODUTO.setValue(pCODIGO_PRODUTO);
    };

    this.setClienteFornecedor = function (pCLIENTE_FORNECEDOR) {
        TXT_UP_NOME_CLIENTE.setValue(pCLIENTE_FORNECEDOR);
    };

    this.CarregaGrid = function () {
        CARREGA_GRID_PAINEL_ULTIMAS_VENDAS();
    };
}