function Janela_Notas_Pedido_Compra() {

    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    ///////////////////////
    var TB_NOTA_ENTRADA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_SEQ_NFE', 'NUMERO_NFE', 'SERIE_NFE', 'CODIGO_CFOP_NFE', 'DESCRICAO_CFOP', 'CODIGO_FORNECEDOR', 'NOME_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR',
        'CNPJ_FORNECEDOR', 'DATA_EMISSAO_NFE', 'DATA_CHEGADA_NFE', 'TOTAL_NFE', 'BASE_ICMS_NFE', 'VALOR_ICMS_NFE', 'BASE_ICMS_SUBS_NFE', 'VALOR_ICMS_SUBS_NFE',
        'TOTAL_PRODUTOS_NFE', 'VALOR_FRETE_NFE', 'VALOR_SEGURO_NFE', 'OUTRAS_DESP_NFE', 'TOTAL_IPI_NFE', 'CANCELADA_NFE', 'STATUS_NFE']
       )
    });

    function Cancelada_nfe(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    function Status_NFE(val) {
        if (val == 1)
            return "<span style='width: 100%; height: 100%; background-color: #000066; color: #FFFFFF;'>NF Cadastrada</span>";
        else if (val == 2)
            return "<span style='width: 100%; height: 100%; background-color: #339966; color: #FFFFFF;'>NF Confirmada</span>";
        else if (val == 3)
            return "<span style='width: 100%; height: 100%; background-color: #990000; color: #FFFFFF;'>NF Cancelada</span>";
        else if (val == 4)
            return "<span style='width: 100%; height: 100%; background-color: #FF3300; color: #FFFFFF;'>NF Importada</span>";
    }

    var gridNotaEntrada = new Ext.grid.GridPanel({
        id: 'gridNotaEntrada',
        store: TB_NOTA_ENTRADA_Store,
        columns: [
        { id: 'STATUS_NFE', header: "Status", width: 100, sortable: true, dataIndex: 'STATUS_NFE', renderer: Status_NFE },
        { id: 'NUMERO_SEQ_NFE', header: "Sequencia", width: 80, sortable: true, dataIndex: 'NUMERO_SEQ_NFE', hidden: true },
        { id: 'NUMERO_NFE', header: "Numero NF", width: 90, sortable: true, dataIndex: 'NUMERO_NFE' },
        { id: 'SERIE_NFE', header: "S&eacute;rie", width: 70, sortable: true, dataIndex: 'SERIE_NFE' },
        { id: 'CODIGO_CFOP_NFE', header: "Nat. Opera&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'CODIGO_CFOP_NFE' },
        { id: 'DESCRICAO_CFOP', header: "Descri&ccedil;&atilde;o da Nat. Opera&ccedil;&atilde;o", width: 260, sortable: true, dataIndex: 'DESCRICAO_CFOP', hidden: true },
        { id: 'DATA_EMISSAO_NFE', header: "Data de Emiss&atilde;o", width: 130, sortable: true, dataIndex: 'DATA_EMISSAO_NFE', renderer: XMLParseDateTime },
        { id: 'DATA_CHEGADA_NFE', header: "Data de Chegada", width: 130, sortable: true, dataIndex: 'DATA_CHEGADA_NFE', renderer: XMLParseDateTime },
        { id: 'CODIGO_FORNECEDOR', header: "C&oacute;digo do Fornecedor", width: 120, sortable: true, dataIndex: 'CODIGO_FORNECEDOR', hidden: true },
        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Nome Fantasia", width: 170, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR', hidden: true },
        { id: 'NOME_FORNECEDOR', header: "Raz&atilde;o Social do Fornecedor", width: 250, sortable: true, dataIndex: 'NOME_FORNECEDOR' },
        { id: 'TOTAL_PRODUTOS_NFE', header: "Total dos Produtos", width: 120, sortable: true, dataIndex: 'TOTAL_PRODUTOS_NFE', renderer: FormataValor },

        { id: 'TOTAL_NFE', header: "Total da Nota Fiscal", width: 130, sortable: true, dataIndex: 'TOTAL_NFE', renderer: FormataValor },
        { id: 'TOTAL_IPI_NFE', header: "Total de IPI", width: 130, sortable: true, dataIndex: 'TOTAL_IPI_NFE', hidden: true, renderer: FormataValor },
        { id: 'BASE_ICMS_NFE', header: "Base de ICMS", width: 130, sortable: true, dataIndex: 'BASE_ICMS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_ICMS_NFE', header: "Total de ICMS", width: 130, sortable: true, dataIndex: 'VALOR_ICMS_NFE', hidden: true, renderer: FormataValor },
        { id: 'BASE_ICMS_SUBS_NFE', header: "Base de ICMS ST", width: 130, sortable: true, dataIndex: 'BASE_ICMS_SUBS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_ICMS_SUBS_NFE', header: "Total de ICMS ST", width: 130, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_FRETE_NFE', header: "Valor do Frete", width: 130, sortable: true, dataIndex: 'VALOR_FRETE_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_SEGURO_NFE', header: "Valor do Serguro", width: 130, sortable: true, dataIndex: 'VALOR_SEGURO_NFE', hidden: true, renderer: FormataValor },
        { id: 'OUTRAS_DESP_NFE', header: "Outras Despesas", width: 130, sortable: true, dataIndex: 'OUTRAS_DESP_NFE', hidden: true, renderer: FormataValor },
        { id: 'CANCELADA_NFE', header: "Cancelada", width: 90, sortable: true, dataIndex: 'CANCELADA_NFE', hidden: true, renderer: Cancelada_nfe }
    ],
        stripeRows: true,
        height: 230,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(s, Index, record) {
                    Ext.getCmp('gridItemNotaEntrada').getStore().removeAll();
                    NotaItemEntradaPagingToolbar.Desabilita();
                }
            }
        }),

        listeners: {
            rowdblclick: function(grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                CARREGA_GRID_ITENS_NOTAS_FISCAIS_ENTRADA(record);
            },
            rowclick: function(grid, rowIndex, e) {
                Ext.getCmp('gridItemNotaEntrada').getStore().removeAll();
                NotaItemEntradaPagingToolbar.Desabilita();

                var record = grid.getStore().getAt(rowIndex);
            },
            keydown: function(e) {
                if (e.getKey() == e.ENTER) {
                    var record = this.getSelectionModel().getSelected();
                    CARREGA_GRID_ITENS_NOTAS_FISCAIS_ENTRADA(record);
                }
            }
        }
    });

    function RetornaNotaEntradaJsonData() {
        var _JsonData = {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaEntradaPagingToolbar = new Th2_PagingToolbar();
    NotaEntradaPagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Notas_do_Pedido');
    NotaEntradaPagingToolbar.setStore(TB_NOTA_ENTRADA_Store);

    function CARREGA_GRID_NOTAS_FISCAIS_ENTRADA() {
        gridItemNotaEntrada.getStore().removeAll();

        NotaEntradaPagingToolbar.setParamsJsonData(RetornaNotaEntradaJsonData());

        var _instrucoes = function() {
            gridItemNotaEntrada.getStore().removeAll();
            NotaItemEntradaPagingToolbar.Desabilita();
        };

        NotaEntradaPagingToolbar.onPageChange(_instrucoes);
        NotaEntradaPagingToolbar.doRequest();
    }

    var pNotasFiscais = new Ext.Panel({
        title: 'Notas Fiscais',
        width: '100%',
        autoScroll: true,
        items: [gridNotaEntrada, NotaEntradaPagingToolbar.PagingToolbar()]
    });

    /////////////////////////////////
    var TB_ITEM_NOTA_ENTRADA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_SEQ_NFE', 'NUMERO_SEQ_ITEM_NFE', 'CODIGO_PRODUTO_ITEM_NFE', 'DESCRICAO_PRODUTO_ITEM_NFE', 'CODIGO_CF_ITEM_NFE',
        'CODIGO_ST_ITEM_NFE', 'QTDE_ITEM_NFE', 'VALOR_UNITARIO_ITEM_NFE',
        'VALOR_TOTAL_ITEM_NFE', 'ALIQ_ICMS_ITEM_NFE', 'BASE_ICMS_ITEM_NFE', 'VALOR_ICMS_ITEM_NFE', 'ALIQ_IPI_ITEM_NFE',
        'VALOR_IPI_ITEM_NFE', 'BASE_ICMS_SUBS_ITEM_NFE', 'VALOR_ICMS_SUBS_ITEM_NFE', 'NUMERO_LOTE_ITEM_NFE']
       )
    });

    var gridItemNotaEntrada = new Ext.grid.GridPanel({
        id: 'gridItemNotaEntrada',
        store: TB_ITEM_NOTA_ENTRADA_Store,
        columns: [
        { id: 'NUMERO_SEQ_NFE', header: "Seq.", width: 90, sortable: true, dataIndex: 'NUMERO_SEQ_NFE', hidden: true },
        { id: 'NUMERO_SEQ_ITEM_NFE', header: "Item", width: 90, sortable: true, dataIndex: 'NUMERO_SEQ_ITEM_NFE', hidden: true },
        { id: 'CODIGO_PRODUTO_ITEM_NFE', header: "C&oacute;digo de Produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_ITEM_NFE' },
        { id: 'DESCRICAO_PRODUTO_ITEM_NFE', header: "Descri&ccedil;&atilde;o do Produto", width: 330, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_NFE', hidden: true },
        { id: 'CODIGO_CF_ITEM_NFE', header: "Clas. Fiscal", width: 105, sortable: true, dataIndex: 'CODIGO_CF_ITEM_NFE' },
        { id: 'CODIGO_ST_ITEM_NFE', header: "Sit. Tribut&aacute;ria", width: 85, sortable: true, dataIndex: 'CODIGO_ST_ITEM_NFE' },
        { id: 'QTDE_ITEM_NFE', header: "Qtde", width: 90, sortable: true, dataIndex: 'QTDE_ITEM_NFE', renderer: FormataQtde },
        { id: 'VALOR_UNITARIO_ITEM_NFE', header: "Valor Unit&aacute;rio", width: 120, sortable: true, dataIndex: 'VALOR_UNITARIO_ITEM_NFE', renderer: FormataValor_4 },
        { id: 'VALOR_TOTAL_ITEM_NFE', header: "Total do Item", width: 130, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_NFE', renderer: FormataValor },
        { id: 'ALIQ_ICMS_ITEM_NFE', header: "Aliq. ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_NFE', renderer: FormataPercentual },
        { id: 'BASE_ICMS_ITEM_NFE', header: "Base ICMS", width: 120, sortable: true, dataIndex: 'BASE_ICMS_ITEM_NFE', renderer: FormataValor, hidden: true },
        { id: 'VALOR_ICMS_ITEM_NFE', header: "Valor ICMS", width: 120, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_NFE', renderer: FormataValor },
        { id: 'ALIQ_IPI_ITEM_NFE', header: "Aliq. IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_NFE', renderer: FormataPercentual },
        { id: 'VALOR_IPI_ITEM_NFE', header: "Valor IPI", width: 120, sortable: true, dataIndex: 'VALOR_IPI_ITEM_NFE', renderer: FormataValor },
        { id: 'BASE_ICMS_SUBS_ITEM_NFE', header: "Base ICMS ST", width: 120, sortable: true, dataIndex: 'BASE_ICMS_SUBS_ITEM_NFE', renderer: FormataValor },
        { id: 'VALOR_ICMS_SUBS_ITEM_NFE', header: "Valor ICMS ST", width: 120, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_NFE', renderer: FormataValor },
        { id: 'NUMERO_LOTE_ITEM_NFE', header: "Nr. do Lote", width: 180, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_NFE' }
    ],
        stripeRows: true,
        height: 230,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaItemNotaSaidaJsonData(record) {
        var _numero = record ? record.data.NUMERO_SEQ_NFE : 0;

        var _JsonData = {
            NUMERO_SEQ_NFE: _numero,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaItemEntradaPagingToolbar = new Th2_PagingToolbar();
    NotaItemEntradaPagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_ItensNotaEntrada');
    NotaItemEntradaPagingToolbar.setStore(TB_ITEM_NOTA_ENTRADA_Store);

    function CARREGA_GRID_ITENS_NOTAS_FISCAIS_ENTRADA(record) {
        NotaItemEntradaPagingToolbar.setParamsJsonData(RetornaItemNotaSaidaJsonData(record));
        NotaItemEntradaPagingToolbar.doRequest();
    }
    
    var pItensNotasFiscais = new Ext.Panel({
        title: 'Itens de Notas Fiscais',
        width: '100%',
        layout: 'anchor',
        autoScroll: true,
        items: [gridItemNotaEntrada, NotaItemEntradaPagingToolbar.PagingToolbar()]
    });

    //////////////////

    var wNOTAS_PEDIDO = new Ext.Window({
        layout: 'form',
        title: 'Notas Fiscais do Pedido',
        iconCls: 'icone_TB_NOTA_ENTRADA',
        width: 1100,
        height: 600,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        renderTo: Ext.getBody(),
        modal: true,
        items: [pNotasFiscais, pItensNotasFiscais],
        listeners: {
            minimize: function(w) {
                w.hide();
            }
        }
    });

    this.show = function(elm) {
        CARREGA_GRID_NOTAS_FISCAIS_ENTRADA();
        TB_ITEM_NOTA_ENTRADA_Store.removeAll();

        wNOTAS_PEDIDO.show(elm);
    };
}