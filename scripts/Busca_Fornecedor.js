function BUSCA_FORNECEDOR() {
    var _ACAO_POPULAR;

    this.ACAO_POPULAR = function(pACAO) {
        _ACAO_POPULAR = pACAO;
    };

    var FORNECEDOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_FORNECEDOR', 'NOME_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR', 'CNPJ_FORNECEDOR', 'IE_FORNECEDOR', 'ENDERECO_FORNECEDOR',
            'NUMERO_END_FORNECEDOR', 'COMPL_END_FORNECEDOR', 'CEP_FORNECEDOR', 'BAIRRO_FORNECEDOR', 'NOME_MUNICIPIO', 'SIGLA_UF',
            'TELEFONE1_FORNECEDOR', 'TELEFONE2_FORNECEDOR', 'CONTATO_FORNECEDOR']
           )
    });

    var gridFornecedor = new Ext.grid.GridPanel({
        store: FORNECEDOR_Store,
        columns: [
            { id: 'CODIGO_FORNECEDOR', header: "C&oacute;digo", width: 55, sortable: true, dataIndex: 'CODIGO_FORNECEDOR' },
            { id: 'NOME_FORNECEDOR', header: "Razão Social", width: 240, sortable: true, dataIndex: 'NOME_FORNECEDOR' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Nome Fantasia", width: 195, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'CNPJ_FORNECEDOR', header: "CNPJ", width: 130, sortable: true, dataIndex: 'CNPJ_FORNECEDOR', hidden: true },
            { id: 'IE_FORNECEDOR', header: "Inscri&ccedil;&atilde;o Estadual", width: 120, sortable: true, dataIndex: 'IE_FORNECEDOR', hidden: true },
            { id: 'ENDERECO_FORNECEDOR', header: "Endere&ccedil;o", width: 300, sortable: true, dataIndex: 'ENDERECO_FORNECEDOR', hidden: true },
            { id: 'NUMERO_END_FORNECEDOR', header: "Numero", width: 70, sortable: true, dataIndex: 'NUMERO_END_FORNECEDOR', hidden: true },
            { id: 'COMPL_END_FORNECEDOR', header: "Complemento", width: 100, sortable: true, dataIndex: 'COMPL_END_FORNECEDOR', hidden: true },
            { id: 'CEP_FORNECEDOR', header: "CEP", width: 80, sortable: true, dataIndex: 'CEP_FORNECEDOR', hidden: true },
            { id: 'BAIRRO_FORNECEDOR', header: "Bairro", width: 170, sortable: true, dataIndex: 'BAIRRO_FORNECEDOR', hidden: true },
            { id: 'NOME_MUNICIPIO', header: "Munic&iacute;pio", width: 220, sortable: true, dataIndex: 'NOME_MUNICIPIO', hidden: true },
            { id: 'SIGLA_UF', header: "UF", width: 100, sortable: true, dataIndex: 'SIGLA_UF' },
            { id: 'TELEFONE1_FORNECEDOR', header: "Telefone 1", width: 140, sortable: true, dataIndex: 'TELEFONE1_FORNECEDOR' },
            { id: 'TELEFONE2_FORNECEDOR', header: "Telefone 2", width: 140, sortable: true, dataIndex: 'TELEFONE2_FORNECEDOR', hidden: true },
            { id: 'CONTATO_FORNECEDOR', header: "Contato", width: 180, sortable: true, dataIndex: 'CONTATO_FORNECEDOR', hidden: true }
        ],

        stripeRows: true,
        height: 300,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function(e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        _ACAO_POPULAR(record);
                    }
                }
            },
            rowdblclick: function(grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                _ACAO_POPULAR(record);
            }
        }
    });

    var FORNECEDOR_PagingToolbar = new Th2_PagingToolbar();

    FORNECEDOR_PagingToolbar.setUrl('servicos/TB_BENEFICIAMENTO.asmx/ListaFornecedores');
    FORNECEDOR_PagingToolbar.setStore(FORNECEDOR_Store);

    function FORNECEDOR_JsonData() {
        var _pesquisa = TXT_PESQUISA.getValue();

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: FORNECEDOR_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    ////////////////////

    var TXT_PESQUISA = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Nome / Nome Fantasia',
        width: 200,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    FORNECEDOR_CARREGA_GRID();
                }
            }
        }
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function() {
            FORNECEDOR_CARREGA_GRID();
        }
    });

    var FORNECEDOR_PagingToolbar = new Th2_PagingToolbar();

    FORNECEDOR_PagingToolbar.setUrl('servicos/TB_BENEFICIAMENTO.asmx/ListaFornecedores');
    FORNECEDOR_PagingToolbar.setStore(FORNECEDOR_Store);

    function FORNECEDOR_CARREGA_GRID() {
        FORNECEDOR_PagingToolbar.setParamsJsonData(FORNECEDOR_JsonData());
        FORNECEDOR_PagingToolbar.doRequest();
    }

    var wBUSCA_FORNECEDOR = new Ext.Window({
        layout: 'form',
        title: 'Busca',
        iconCls: 'icone_TB_FORNECEDOR',
        width: 1010,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridFornecedor, FORNECEDOR_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .38,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 140,
                items: [TXT_PESQUISA]
            }, {
                columnWidth: .20,
                items: [BTN_PESQUISA]
}]
}],

                listeners: {
                    minimize: function(w) {
                        w.hide();
                    }
                }
            });

            this.show = function(objAnm) {
                wBUSCA_FORNECEDOR.show(objAnm);
            };

            this.hide = function() {
                wBUSCA_FORNECEDOR.hide();
            };

        }