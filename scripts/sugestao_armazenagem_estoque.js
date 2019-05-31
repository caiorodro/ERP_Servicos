var combo_TB_LOCAL_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_LOCAL', 'DESCRICAO_LOCAL'])
});

function CARREGA_COMBO_LOCAL() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ESTOQUE.asmx/Lista_Local');
    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_LOCAL_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_LOCAL_STORE2 = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_LOCAL', 'DESCRICAO_LOCAL'])
});

function CARREGA_COMBO_LOCAL_POR_TIPO(_TIPO_DE_LOCAL) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ESTOQUE.asmx/Lista_Local_por_Tipo');
    _ajax.setJsonData({
        TIPO_DE_LOCAL: _TIPO_DE_LOCAL,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_LOCAL_STORE2.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function sugestao_armazenagem_estoque() {

    var combo_TB_LOCAL_STORE3 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_LOCAL', 'DESCRICAO_LOCAL'])
    });

    function CARREGA_LOCAL_POR_TIPO(_TIPO_DE_LOCAL) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/Lista_Local_por_Tipo');
        _ajax.setJsonData({
            TIPO_DE_LOCAL: _TIPO_DE_LOCAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            combo_TB_LOCAL_STORE3.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var IDs_ESTOQUE_IMPRESSAO;

    var RECEBIMENTO_SEM_LOCAL = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'NUMERO_RECEBIMENTO', 'ID_PRODUTO', 'CODIGO_PRODUTO',
            'DESCRICAO_PRODUTO', 'QTDE_RECEBIDA', 'PESO_RECEBIDO', 'FORNECEDOR', 'UNIDADE', 'LOTE',
            'ID_ESTOQUE'])
    });

    var checkBox1 = new Ext.grid.CheckboxSelectionModel();

    var gridRecebimentoSemLocal = new Ext.grid.GridPanel({
        title: 'Recebimento de produtos que est&atilde;o sem local',
        frame: true,
        store: RECEBIMENTO_SEM_LOCAL,
        columns: [
            checkBox1,
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Pedido compra", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA' },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'QTDE_RECEBIDA', header: "Qtde recebida", width: 90, sortable: true, dataIndex: 'QTDE_RECEBIDA', renderer: FormataQtde, align: 'center' },
            { id: 'UNIDADE', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE' },
            { id: 'PESO_RECEBIDO', header: "Peso recebido", width: 90, sortable: true, dataIndex: 'PESO_RECEBIDO', renderer: FormataPeso, align: 'center' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'FORNECEDOR', header: "Fornecedor", width: 180, sortable: true, dataIndex: 'FORNECEDOR' },
            { id: 'LOTE', header: "Lote", width: 150, sortable: true, dataIndex: 'LOTE' }
        ],

        stripeRows: true,
        height: 220,
        width: '100%',

        sm: checkBox1,

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        carregaSaldoProdutosRecebidos();
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                carregaSaldoProdutosRecebidos();
            }
        },
        tbar: [{
            xtype: 'label',
            text: 'Nº do Lote:'
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                xtype: 'textfield',
                id: 'TXT_NR_LOTE_ARMAZEM',
                fieldLabel: 'N&ordm; do Lote',
                width: 120,
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            carregaGridRecebimento();
                        }
                    }
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Buscar',
            icon: 'imagens/icones/database_search_24.gif',
            scale: 'large',
            handler: function () {
                carregaGridRecebimento();
            }
        }, '-', {
            text: 'Limpar itens selecionados',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'large',
            handler: function (btn) {
                var records = new Array();

                for (var i = 0; i < gridRecebimentoSemLocal.getSelectionModel().selections.length; i++) {
                    records[i] = gridRecebimentoSemLocal.getSelectionModel().selections.items[i];
                }

                for (var i = 0; i < records.length; i++) {
                    RECEBIMENTO_SEM_LOCAL.remove(records[i]);
                }
            }
        }]
    });

    function carregaGridRecebimento() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/calcula_Recebimentos_Sem_Local');
        _ajax.setJsonData({
            NUMERO_LOTE: Ext.getCmp('TXT_NR_LOTE_ARMAZEM').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            RECEBIMENTO_SEM_LOCAL.loadData(criaObjetoXML(result), false);

            SUGESTAO_ARMAZENAGEM_Store.removeAll();
            Ext.getCmp('BTN_GRAVAR_SUGESTAO_LOCAIS').enable();

            delete _ajax;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    // Saldo dos produtos Recebidos

    var SALDO_PRODUTOS_RECEBIDOS = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'ID_LOCAL', 'DESCRICAO_LOCAL', 'SALDO_ESTOQUE', 'PESO_SALDO', 'DESCRICAO_PRODUTO']
           )
    });

    var gridSaldoProdutosRecebidos = new Ext.grid.GridPanel({
        title: 'Saldo dos produtos recebidos em locais definidos',
        frame: true,
        store: SALDO_PRODUTOS_RECEBIDOS,
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'SALDO_ESTOQUE', header: "Saldo (Qtde)", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE', renderer: FormataQtde, align: 'center' },
            { id: 'PESO_SALDO', header: "Saldo (Peso)", width: 100, sortable: true, dataIndex: 'PESO_SALDO', renderer: FormataPeso, align: 'center' },
            { id: 'DESCRICAO_LOCAL', header: "Local", width: 160, sortable: true, dataIndex: 'DESCRICAO_LOCAL' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],

        stripeRows: true,
        height: 220,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();

                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

            }
        },
        tbar: [{
            text: 'Listar saldo dos produtos selecionados',
            icon: 'imagens/icones/database_refresh_24.gif',
            scale: 'large',
            handler: function () {
                carregaSaldoProdutosRecebidos();
            }
        }, '-', {
            text: 'Maximizar',
            icon: 'imagens/icones/windows_window_star_24.gif',
            scale: 'large',
            handler: function () {
                _gridSaldoProdutosRecebidos.reConfigure(gridSaldoProdutosRecebidos.getStore(), gridSaldoProdutosRecebidos.getColumnModel());
                _gridSaldoProdutosRecebidos.show(gridSaldoProdutosRecebidos.getId());
            }
        }]
    });

    function carregaSaldoProdutosRecebidos() {

        if (gridRecebimentoSemLocal.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais produtos recebidos para calcular o saldo dos produtos recebidos', gridRecebimentoSemLocal.getId());
            return;
        }

        var produtos = new Array();
        var lotes = new Array();

        for (var i = 0; i < gridRecebimentoSemLocal.getSelectionModel().selections.length; i++) {
            produtos[i] = gridRecebimentoSemLocal.getSelectionModel().selections.items[i].data.ID_PRODUTO;
            lotes[i] = gridRecebimentoSemLocal.getSelectionModel().selections.items[i].data.LOTE;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/calcula_Saldo_Dos_Produtos_Por_Local');
        _ajax.setJsonData({
            ID_PRODUTOS: produtos,
            NUMEROS_LOTE: lotes,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            SALDO_PRODUTOS_RECEBIDOS.loadData(criaObjetoXML(result), false);

            delete _ajax;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }


    // Locais disponíveis

    var LOCAIS_DISPONIVEIS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_LOCAL', 'DESCRICAO_LOCAL', 'PESO_DISPONIVEL', 'FACILIDADE_ACESSO', 'CAPACIDADE_PESO', 'ACESSO', 'HA_O_PRODUTO_RECEBIDO']
           )
    });

    function haProduto(val) {
        return val == 0 ? "<span style='color: green;'>Sim</span>" : "<span style='color: red;'>N&atilde;o</span>";
    }

    var gridLocaisDisponiveis = new Ext.grid.GridPanel({
        title: 'Locais dispon&iacute;veis',
        frame: true,
        store: LOCAIS_DISPONIVEIS_Store,
        columns: [
            { id: 'DESCRICAO_LOCAL', header: "Local", width: 180, sortable: true, dataIndex: 'DESCRICAO_LOCAL' },
            { id: 'ACESSO', header: "Facilidade de acesso", width: 120, sortable: true, dataIndex: 'ACESSO', align: 'center' },
            { id: 'CAPACIDADE_PESO', header: "Capacidade", width: 100, sortable: true, dataIndex: 'CAPACIDADE_PESO', renderer: FormataPeso, align: 'center' },
            { id: 'PESO_DISPONIVEL', header: "Peso dispon&iacute;vel", width: 100, sortable: true, dataIndex: 'PESO_DISPONIVEL', renderer: FormataPeso, align: 'center' },
            { id: 'HA_O_PRODUTO_RECEBIDO', header: "Consta saldo", width: 110, sortable: true, dataIndex: 'HA_O_PRODUTO_RECEBIDO', renderer: haProduto, align: 'center' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(288),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();

                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

            }
        },
        tbar: [{
            xtype: 'label',
            text: 'Descrição:'
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'TXT_FILTRO_DESCRICAO_LOCAL',
                xtype: 'textfield',
                width: 200,
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            carregaGridLocaisDisponiveis();
                        }
                    }
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
             {
                 text: 'Listar locais<br />dispon&iacute;veis',
                 icon: 'imagens/icones/database_refresh_24.gif',
                 scale: 'large',
                 handler: function () {
                     carregaGridLocaisDisponiveis();
                 }
             }, '-', {
                 text: 'Maximizar',
                 icon: 'imagens/icones/windows_window_star_24.gif',
                 scale: 'large',
                 handler: function () {
                     _gridLocaisDisponiveis.reConfigure(gridLocaisDisponiveis.getStore(), gridLocaisDisponiveis.getColumnModel());
                     _gridLocaisDisponiveis.show(gridLocaisDisponiveis.getId());
                 }
             }]
    });

    var PagingToolbar1 = new Th2_PagingToolbar();
    PagingToolbar1.setUrl('servicos/TB_ESTOQUE.asmx/calcula_Saldo_Disponivel_Por_Local');
    PagingToolbar1.setStore(LOCAIS_DISPONIVEIS_Store);

    function carregaGridLocaisDisponiveis() {
        PagingToolbar1.setParamsJsonData({
            ID_PRODUTO: gridRecebimentoSemLocal.getSelectionModel().getSelections().length > 0 ?
                gridRecebimentoSemLocal.getSelectionModel().selections.items[0].data.ID_PRODUTO : 0,
            ID_USUARIO: _ID_USUARIO,
            DESCRICAO: Ext.getCmp('TXT_FILTRO_DESCRICAO_LOCAL').getValue(),
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        });

        PagingToolbar1.doRequest();
    }

    // Sugestao de armazenagem

    var SUGESTAO_ARMAZENAGEM_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'ID_LOCAL', 'DESCRICAO_LOCAL', 'QTDE', 'PESO', 'ID_ESTOQUE',
            'GIRO', 'ACESSO', 'UNIDADE', 'CAIXAS']
           )
    });

    CARREGA_LOCAL_POR_TIPO(1);

    var CB_ID_LOCAL = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE3,
        fieldLabel: 'Local',
        valueField: 'ID_LOCAL',
        displayField: 'DESCRICAO_LOCAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        allowBlank: false
    });

    var TXT_QTDE = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0.01
    });

    function descricaoLocal(val, metadata, record) {
        return record.data.DESCRICAO_LOCAL;
    }

    var checkBox2 = new Ext.grid.CheckboxSelectionModel();

    var gridSugestaoArmazenagem = new Ext.grid.EditorGridPanel({
        title: 'Sugest&atilde;o de armazenagem',
        frame: true,
        store: SUGESTAO_ARMAZENAGEM_Store,
        clicksToEdit: 1,

        columns: [
            checkBox2,
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'QTDE', header: "Qtde", width: 90, sortable: true, dataIndex: 'QTDE', renderer: FormataQtde, align: 'center',
                editor: TXT_QTDE
            },
            { id: 'UNIDADE', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
            { id: 'ID_LOCAL', header: "Local", width: 180, sortable: true, dataIndex: 'ID_LOCAL', renderer: descricaoLocal,
                editor: CB_ID_LOCAL
            },
            { id: 'PESO', header: "Peso", width: 90, sortable: true, dataIndex: 'PESO', renderer: FormataPeso, align: 'center' },
            { id: 'GIRO', header: "Giro do produto", width: 110, sortable: true, dataIndex: 'GIRO', align: 'center' },
            { id: 'ACESSO', header: "Acesso", width: 110, sortable: true, dataIndex: 'ACESSO', align: 'center' },
            { id: 'CAIXAS', header: "N&ordm; Etiquetas", width: 110, sortable: true, dataIndex: 'CAIXAS', align: 'center' },

            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(261),
        width: '100%',

        sm: checkBox2,

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.DELETE) {
                    deletaSugestao();
                }
            },
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }

                e.record.beginEdit();
                e.record.set('DESCRICAO_LOCAL', CB_ID_LOCAL.getRawValue());
                e.record.endEdit();
            }
        },
        tbar: [{
            xtype: 'label',
            text: 'Local de impressão:'
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'CB_GALPAO_ESTOQUE1',
                xtype: 'combo',
                valueField: 'Opc',
                displayField: 'Opcao',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                emptyText: 'Selecione',
                selectOnFocus: true,
                width: 120,
                allowBlank: false,
                value: readCookie("galpao") ? readCookie("galpao") : 0,
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['Opc', 'Opcao'],
                    data: [[0, 'Rua dos Alpes'], [1, 'Rua Ana Nery']]
                }),
                listeners: {
                    select: function (combo, record, index) {
                        eraseCookie("galpao");
                        createCookie("galpao", record.data.Opc, 180);
                    }
                }
            }, '-', {
                id: 'BTN_IMPRIMIR_SUGESTAO_ARMAZENAGEM',
                text: 'Imprimir etiqueta(s)',
                icon: 'imagens/icones/printer_16.gif',
                scale: 'small',
                handler: function () {

                    if (gridSugestaoArmazenagem.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um ou mais itens de sugest&atilde;o para imprimir a(s) etiquetas', gridSugestaoArmazenagem.getId());
                        return;
                    }

                    if (!Ext.getCmp('CB_GALPAO_ESTOQUE1').isValid()) {
                        dialog.MensagemDeErro('Selecione um galp&atilde;o para imprimir a(s) etiqueta(s)', gridSugestaoArmazenagem.getId());
                        return;
                    }

                    var IDS_ESTOQUE = new Array();
                    var NUMERO_DE_ETIQUETAS = new Array();

                    for (var i = 0; i < IDs_ESTOQUE_IMPRESSAO.length; i++) {
                        IDS_ESTOQUE[i] = IDs_ESTOQUE_IMPRESSAO[i];

                        NUMERO_DE_ETIQUETAS[i] = (gridSugestaoArmazenagem.getSelectionModel().selections.items[i] != null) ?
                            gridSugestaoArmazenagem.getSelectionModel().selections.items[i].data.CAIXAS : 1;
                    }

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_ESTOQUE.asmx/imprime_Etiqueta_de_Estoque');
                    _ajax.setJsonData({
                        IDS_ESTOQUE: IDS_ESTOQUE,
                        NUMERO_DE_ETIQUETAS: NUMERO_DE_ETIQUETAS,
                        GALPAO: Ext.getCmp('CB_GALPAO_ESTOQUE1').getValue(),
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        carregaSaldoProdutosRecebidos();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }, '-', {
                text: 'Deletar linhas',
                icon: 'imagens/icones/database_delete_16.gif',
                scale: 'small',
                handler: function () {
                    deletaSugestao();
                }
            }],
        bbar: [{
            text: 'Calcular sugest&atilde;o<br />de armazenagem',
            icon: 'imagens/icones/database_write_24.gif',
            scale: 'large',
            handler: function () {
                carregaGridSugestao();
            }
        }, '-', {
            id: 'BTN_GRAVAR_SUGESTAO_LOCAIS',
            text: 'Gravar sugest&atilde;o<br />de locais',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            handler: function () {
                grava_Produtos_em_Locais();
            }
        }, '-', {
            text: 'Maximizar',
            icon: 'imagens/icones/windows_window_star_24.gif',
            scale: 'large',
            handler: function () {
                _gridRecebimentoSemLocal.reConfigure(gridSugestaoArmazenagem.getStore(), gridSugestaoArmazenagem.getColumnModel());
                _gridRecebimentoSemLocal.show(gridSugestaoArmazenagem.getId());
            }
        }]
    });

    function deletaSugestao() {
        var arr1 = new Array();

        for (var i = 0; i < gridSugestaoArmazenagem.getSelectionModel().selections.length; i++) {
            arr1[i] = gridSugestaoArmazenagem.getSelectionModel().selections.items[i];
        }

        for (var i = 0; i < arr1.length; i++) {
            SUGESTAO_ARMAZENAGEM_Store.remove(arr1[i]);
        }
    }
    
    function grava_Produtos_em_Locais() {
        var IDS_ESTOQUE = new Array();
        var QTDES = new Array();
        var IDS_LOCAL = new Array();

        for (var i = 0; i < SUGESTAO_ARMAZENAGEM_Store.getCount(); i++) {
            IDS_ESTOQUE[i] = SUGESTAO_ARMAZENAGEM_Store.getAt(i).data.ID_ESTOQUE;
            QTDES[i] = SUGESTAO_ARMAZENAGEM_Store.getAt(i).data.QTDE;
            IDS_LOCAL[i] = SUGESTAO_ARMAZENAGEM_Store.getAt(i).data.ID_LOCAL;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/grava_Produtos_em_Locais');
        _ajax.setJsonData({
            IDS_ESTOQUE: IDS_ESTOQUE,
            QTDES: QTDES,
            IDS_LOCAL: IDS_LOCAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            IDs_ESTOQUE_IMPRESSAO = result;

            carregaSaldoProdutosRecebidos();
            Ext.getCmp('BTN_IMPRIMIR_SUGESTAO_ARMAZENAGEM').enable();
            Ext.getCmp('BTN_GRAVAR_SUGESTAO_LOCAIS').disable();

            RECEBIMENTO_SEM_LOCAL.removeAll();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function carregaGridSugestao() {

        if (gridRecebimentoSemLocal.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais produtos recebidos para calcular a sugest&atilde;o de armazenagem', gridRecebimentoSemLocal.getId());
            return;
        }

        var ids_estoque = new Array();
        var lotes = new Array();

        for (var i = 0; i < gridRecebimentoSemLocal.getSelectionModel().selections.length; i++) {
            ids_estoque[i] = gridRecebimentoSemLocal.getSelectionModel().selections.items[i].data.ID_ESTOQUE;
            lotes[i] = gridRecebimentoSemLocal.getSelectionModel().selections.items[i].data.LOTE;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ESTOQUE.asmx/montaSugestaoArmazenagem');
        _ajax.setJsonData({
            NUMEROS_LOTE: lotes,
            ID_PRODUTO: gridRecebimentoSemLocal.getSelectionModel().selections.items[0].data.ID_PRODUTO,
            IDS_ESTOQUE: ids_estoque,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            SUGESTAO_ARMAZENAGEM_Store.loadData(criaObjetoXML(result), true);

            Ext.getCmp('BTN_IMPRIMIR_SUGESTAO_ARMAZENAGEM').disable();

            delete _ajax;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //

    var panel1 = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [gridRecebimentoSemLocal]
            }, {
                columnWidth: .50,
                items: [gridSaldoProdutosRecebidos]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [gridLocaisDisponiveis, PagingToolbar1.PagingToolbar()]
            }, {
                columnWidth: .50,
                items: [gridSugestaoArmazenagem]
            }]
        }]
    });

    function janela(_grid) {

        this.reConfigure = function (store, colModel) {
            grid1.reconfigure(store, colModel);
        };

        var store1 = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['COLUNA1'])
        });

        var grid1 = new Ext.grid.EditorGridPanel({
            clicksToEdit: 1,

            store: store1,
            columns: [{ id: 'COLUNA1', header: "Coluna 1", width: 100, sortable: true, dataIndex: 'COLUNA1'}],

            stripeRows: true,
            height: 547,
            width: '100%',

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        var wJanela = new Ext.Window({
            title: _grid.title,
            layout: 'form',
            width: 1050,
            height: 578,
            closable: false,
            draggable: true,
            collapsible: false,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            items: [grid1],

            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            }
        });

        this.show = function (objAnm) {
            wJanela.show(objAnm);
        };
    }

    var _gridRecebimentoSemLocal = new janela(gridSugestaoArmazenagem);
    var _gridSaldoProdutosRecebidos = new janela(gridSaldoProdutosRecebidos);
    var _gridLocaisDisponiveis = new janela(gridLocaisDisponiveis);

    return panel1;
}