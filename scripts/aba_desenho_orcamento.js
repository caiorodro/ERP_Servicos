
function aba_desenho_orcamento() {

    var _ID_ORCAMENTO;

    this.ID_ORCAMENTO = function(pValue) {
        _ID_ORCAMENTO = pValue;
    };

    var TB_ITEM_ORCAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
            ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'ID_PRODUTO', 'CODIGO_PRODUTO', 'PRECO_PRODUTO', 'UNIDADE_PRODUTO',
            'QTDE_PRODUTO', 'VALOR_DESCONTO', 'VALOR_TOTAL', 'ALIQ_ICMS', 'BASE_ICMS', 'BASE_ICMS_SUBS',
            'VALOR_ICMS', 'ALIQ_IPI', 'VALOR_IPI', 'VALOR_ICMS_SUBS', 'TIPO_DESCONTO', 'CODIGO_CFOP_ITEM_ORCAMENTO',
            'CUSTO_TOTAL_PRODUTO', 'MARGEM_VENDA_PRODUTO', 'DATA_ENTREGA', 'CODIGO_CLIENTE_ITEM_ORCAMENTO',
            'NUMERO_PEDIDO_ITEM_ORCAMENTO', 'OBS_ITEM_ORCAMENTO', 'NUMERO_ITEM_PEDIDO_CLIENTE',
            'MARGEM_CADASTRADA_PRODUTO', 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', 'PRODUTO_ESPECIAL', 'ITEM_REQUER_CERTIFICADO',
            'ITEM_PARA_CONSUMO'])
    });

    function TrataTipoDesconto(val) {
        if (val == 0)
            return "%";
        else
            return "Valor";
    }

    var grid_ITEM_ORCAMENTO = new Ext.grid.GridPanel({
        store: TB_ITEM_ORCAMENTO_Store,
        columns: [
            { id: 'CODIGO_CFOP_ITEM_ORCAMENTO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_ORCAMENTO' },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'CUSTO_TOTAL_PRODUTO', header: "Custo Total", width: 90, sortable: true, dataIndex: 'CUSTO_TOTAL_PRODUTO', align: 'center', renderer: FormataValor_4 },
            { id: 'MARGEM_VENDA_PRODUTO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_PRODUTO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4 },
            { id: 'UNIDADE_PRODUTO', header: "Un", width: 30, sortable: true, dataIndex: 'UNIDADE_PRODUTO' },
            { id: 'QTDE_PRODUTO', header: "Qtde", width: 50, sortable: true, dataIndex: 'QTDE_PRODUTO', renderer: FormataQtde },
            { id: 'TIPO_DESCONTO', header: "Tipo Desconto", width: 50, sortable: true, dataIndex: 'TIPO_DESCONTO', renderer: TrataTipoDesconto },
            { id: 'VALOR_DESCONTO', header: "Desconto", width: 90, sortable: true, dataIndex: 'VALOR_DESCONTO', renderer: FormataDesconto },
            { id: 'VALOR_TOTAL', header: "Valor Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL', renderer: FormataValor },
            { id: 'DATA_ENTREGA', header: "Entrega", width: 90, sortable: true, dataIndex: 'DATA_ENTREGA', renderer: formatDate },
            { id: 'ITEM_REQUER_CERTIFICADO', header: "Certificado", width: 70, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01 },
            { id: 'ITEM_PARA_CONSUMO', header: "Consumo", width: 60, sortable: true, dataIndex: 'ITEM_PARA_CONSUMO', renderer: TrataCombo_01 },
            { id: 'NUMERO_PEDIDO_ITEM_ORCAMENTO', header: "Nr. Pedido", width: 130, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_ORCAMENTO' },

            { id: 'NUMERO_ITEM_PEDIDO_CLIENTE', header: "Nr. Item Cliente", width: 110, sortable: true, dataIndex: 'NUMERO_ITEM_PEDIDO_CLIENTE' },

            { id: 'ALIQ_ICMS', header: "Al&iacute;q ICMS", width: 80, sortable: true, dataIndex: 'ALIQ_ICMS', renderer: FormataPercentual },
            { id: 'VALOR_ICMS', header: "Valor ICMS", width: 80, sortable: true, dataIndex: 'VALOR_ICMS', renderer: FormataValor },
            { id: 'ALIQ_IPI', header: "Al&iacute;q IPI", width: 80, sortable: true, dataIndex: 'ALIQ_IPI', renderer: FormataPercentual },
            { id: 'VALOR_IPI', header: "Valor IPI", width: 120, sortable: true, dataIndex: 'VALOR_IPI', renderer: FormataValor },
            { id: 'BASE_ICMS_SUBS', header: "Base ICMS ST", width: 100, sortable: true, dataIndex: 'BASE_ICMS_SUBS', renderer: FormataValor },
            { id: 'VALOR_ICMS_SUBS', header: "Valor ICMS ST", width: 100, sortable: true, dataIndex: 'VALOR_ICMS_SUBS', renderer: FormataValor },
            { id: 'NUMERO_ITEM', header: "Item", width: 60, sortable: true, dataIndex: 'NUMERO_ITEM' }

                ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(232),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(r, rowIndex, record) {
                    carregaDocumentos(record.data.ID_PRODUTO);
                }
            }
        })
    });

    function carregaItensOrcamento() {
        if (parseInt(_ID_ORCAMENTO) > 0) {

            var _dados = { NUMERO_ORCAMENTO: _ID_ORCAMENTO };

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_TB_ITEM_ORCAMENTO_VENDA');
            _ajax.setJsonData({ dados: _dados });

            var _sucess = function(response, options) {
                var result = Ext.decode(response.responseText).d;
                TB_ITEM_ORCAMENTO_Store.loadData(criaObjetoXML(result), false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();

        }
    }

    // Documentos do produto
    var TB_PRODUTO_DOCUMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'ID_DOCUMENTO', 'NOME_DOCUMENTO', 'DATA_DOCUMENTO']),
        sortInfo: {
            field: 'DATA_DOCUMENTO',
            direction: 'DESC'
        }
    });

    function Baixa_Documento(ID_DOCUMENTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PRODUTO_DOCUMENTO.asmx/Baixa_Documento');

        _ajax.setJsonData({
            ID_DOCUMENTO: ID_DOCUMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function abrir_documento(val) {
        return "<span style='cursor: pointer;'><img src='imagens/icones/file_next_16.gif' title='Clique para baixar o documento' /></span>";
    }

    var gridProdutoDocumento = new Ext.grid.GridPanel({
        store: TB_PRODUTO_DOCUMENTO_Store,
        title: 'Documentos do produto cadastrados',

        columns: [
        { id: 'NOME_DOCUMENTO', header: "Lista de documentos", width: 720, sortable: true, dataIndex: 'NOME_DOCUMENTO' },
        { id: 'DATA_DOCUMENTO', header: "Data do documento", width: 140, sortable: true, dataIndex: 'DATA_DOCUMENTO', renderer: XMLParseDateTime },
        { id: 'ABRIR', header: "", width: 50, sortable: true, dataIndex: 'ABRIR', renderer: abrir_documento}],
        stripeRows: true,
        height: 120,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            cellclick: function(grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'ABRIR') {
                    Baixa_Documento(record.data.ID_DOCUMENTO);
                }
            }
        }
    });

    function RETORNAFILTROS_JsonData(ID_PRODUTO) {

        var TB_TRANSPORTADORA_JsonData = {
            ID_PRODUTO: ID_PRODUTO,
            ID_USUARIO: _ID_USUARIO,
            pesquisa: '',
            start: 0,
            limit: DOCUMENTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSPORTADORA_JsonData;
    }

    var DOCUMENTO_PagingToolbar = new Th2_PagingToolbar();

    DOCUMENTO_PagingToolbar.setUrl('servicos/TB_PRODUTO_DOCUMENTO.asmx/CARREGA_DOCUMENTOS');
    DOCUMENTO_PagingToolbar.setStore(TB_PRODUTO_DOCUMENTO_Store);

    function carregaDocumentos(ID_PRODUTO) {
        DOCUMENTO_PagingToolbar.setParamsJsonData(RETORNAFILTROS_JsonData(ID_PRODUTO));
        DOCUMENTO_PagingToolbar.doRequest();
    }

    var panel1 = new Ext.Panel({
        width: '100%',
        border: true,
        items: [grid_ITEM_ORCAMENTO, gridProdutoDocumento, DOCUMENTO_PagingToolbar.PagingToolbar()]
    });

    this.Panel = function() {
        return panel1;
    };

    this.carregaGrid = function() {
        carregaItensOrcamento();
    };
}
