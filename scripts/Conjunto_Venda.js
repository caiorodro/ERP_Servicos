function Conjunto_Venda() {
    var NUMERO_ORCAMENTO;
    var NUMERO_ITEM_ORCAMENTO;
    var TITULO;
    var record_item_orcamento;
    var _DESCRICAO_CONJUNTO;

    this.SETA_NUMERO_ORCAMENTO = function (pNUMERO_ORCAMENTO) {
        NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;
    };

    this.SETA_NUMERO_ITEM_ORCAMENTO = function (pNUMERO_ITEM_ORCAMENTO) {
        NUMERO_ITEM_ORCAMENTO = pNUMERO_ITEM_ORCAMENTO;
    };

    this.SETA_TITULO = function (pTITULO) {
        TITULO = pTITULO;
    };

    this.SETA_RECORD_ITEM_ORCAMENTO = function (record) {
        record_item_orcamento = record;
    };

    this.DESCRICAO_CONJUNTO = function (pDESCRICAO_CONJUNTO) {
        TXT_DESCRICAO_CONJUNTO.setValue(pDESCRICAO_CONJUNTO);
    };

    var buttonGroup_CONJUNTO_ITEM_ORCAMENTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                if (!TXT_DESCRICAO_CONJUNTO.isValid()) {
                    return;
                }

                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                Store_CONJUNTO_ITEM_ORCAMENTO.each(Salva_Store);

                function Salva_Store(record) {

                    if (record.data.CODIGO_PRODUTO.length > 0 && record.data.QTDE_CONJUNTO > 0.01) {

                        var _ID_PRODUTO = record.data.CODIGO_PRODUTO;

                        _ID_PRODUTO = _ID_PRODUTO.substr(_ID_PRODUTO.lastIndexOf(' - ') + 3);

                        array1[i] = {
                            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
                            NUMERO_ITEM_ORCAMENTO: record.data.NUMERO_ITEM_ORCAMENTO,
                            ID_PRODUTO: _ID_PRODUTO,
                            QTDE_CONJUNTO: record.data.QTDE_CONJUNTO,
                            CUSTO_CONJUNTO: record.data.CUSTO_CONJUNTO,
                            CUSTO_BENEFICIAMENTO: record.data.CUSTO_BENEFICIAMENTO,
                            CUSTO_MAO_DE_OBRA: record.data.CUSTO_MAO_DE_OBRA,
                            OBS_CONJUNTO: record.data.OBS_CONJUNTO,
                            CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                            ID_USUARIO: _ID_USUARIO
                        };

                        arr_Record[i] = record;
                        i++;
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CONJUNTO_ITEM_ORCAMENTO.asmx/Salva_Conjunto');
                _ajax.setJsonData({
                    LINHAS: array1,
                    DESCRICAO_CONJUNTO: TXT_DESCRICAO_CONJUNTO.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var n = 0; n < arr_Record.length; n++) {
                        arr_Record[n].commit();
                    }

                    var result = Ext.decode(response.responseText).d;

                    record_item_orcamento.beginEdit();
                    record_item_orcamento.set('CUSTO_TOTAL_PRODUTO', result[0]);
                    record_item_orcamento.set('MARGEM_VENDA_PRODUTO', result[1]);
                    record_item_orcamento.set('DATA_ENTREGA', result[2]);
                    record_item_orcamento.set('DESCRICAO_PRODUTO_ITEM_ORCAMENTO', TXT_DESCRICAO_CONJUNTO.getValue());

                    record_item_orcamento.endEdit();

                    record_item_orcamento.commit();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Deletar Item',
                icon: 'imagens/icones/database_delete_24.gif',
                scale: 'medium',
                handler: function () {
                    Deleta_Conjunto();
                }
            }]
    });

    var toolbar_CONJUNTO_ITEM_ORCAMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_CONJUNTO_ITEM_ORCAMENTO]
    });

    var Store_CONJUNTO_ITEM_ORCAMENTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_ORCAMENTO', 'NUMERO_ITEM_ORCAMENTO', 'CODIGO_PRODUTO', 'QTDE_CONJUNTO', 'CUSTO_CONJUNTO', 'OBS_CONJUNTO',
         'CUSTO_BENEFICIAMENTO', 'CUSTO_MAO_DE_OBRA', 'CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR'])
    });

    var Store_PRODUTO_CONJUNTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO'])
    });

    function Carrega_Produtos(INICIO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CONJUNTO_ITEM_ORCAMENTO.asmx/Carrega_Produtos');
        _ajax.setJsonData({ INICIO: INICIO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_PRODUTO_CONJUNTO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TXT_DESCRICAO_CONJUNTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do Conjunto',
        width: 380,
        maxLegth: 55,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '55' },
        allowBlank: false
    });

    var CB_ID_PRODUTO = new Ext.form.ComboBox({
        store: Store_PRODUTO_CONJUNTO,
        mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        width: '100%',
        valueField: 'CODIGO_PRODUTO',
        displayField: 'CODIGO_PRODUTO',
        forceSelection: true,
        emptyText: 'Selecione aqui...',
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                var _produto = record.data.ID_PRODUTO;

                for (var i = 0; i < Store_CONJUNTO_ITEM_ORCAMENTO.getCount() - 1; i++) {
                    if (_produto == Store_CONJUNTO_ITEM_ORCAMENTO.getAt(i).data.ID_PRODUTO) {
                        combo.setValue('');
                    }
                }
            }
        }
    });

    var TXT_PESQUISA_CODIGO = new Ext.form.TextField({
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    Carrega_Produtos(f.getValue());
                }
            }
        }
    });

    var TXT_QTDE_CONJUNTO = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: .01,
        value: 0,
        allowBlank: false
    });

    var TXT_CUSTO_CONJUNTO = new Ext.form.NumberField({
        allowBlank: false,
        decimalPrecision: 4,
        decimalSeparator: ','
    });

    var TXT_CUSTO_BENEFICIAMENTO = new Ext.form.NumberField({
        allowBlank: false,
        decimalPrecision: 4,
        decimalSeparator: ','
    });

    var TXT_CUSTO_MAO_DE_OBRA = new Ext.form.NumberField({
        allowBlank: false,
        decimalPrecision: 4,
        decimalSeparator: ','
    });

    var TXT_OBS_CONJUNTO = new Ext.form.TextField({
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var COMBO_FORNECEDOR_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR']
       )
    });

    function CARREGA_COMBO_FORNECEDOR() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Lista_COMBO_Fornecedores');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            COMBO_FORNECEDOR_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    CARREGA_COMBO_FORNECEDOR();

    var CB_CODIGO_FORNECEDOR = new Ext.form.ComboBox({
        store: COMBO_FORNECEDOR_STORE,
        mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        width: '100%',
        valueField: 'CODIGO_FORNECEDOR',
        displayField: 'NOME_FANTASIA_FORNECEDOR',
        forceSelection: true,
        emptyText: 'Selecione aqui...',
        listeners: {
            select: function (combo, record, index) {
            }
        }
    });

    function Codigo_Produto(val, metadata, record) {
        return val.substr(0, val.lastIndexOf(' - '));
    }

    function _fornecedor(val, data, record) {
        return record.data.NOME_FANTASIA_FORNECEDOR;
    }

    var GRID_CONJUNTO_ITEM_ORCAMENTO = new Ext.grid.EditorGridPanel({
        store: Store_CONJUNTO_ITEM_ORCAMENTO,
        columns: [
                { id: 'PESQUISA', header: "Pesquisa", width: 85, sortable: true, dataIndex: 'PESQUISA',
                    editor: TXT_PESQUISA_CODIGO
                },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;d. Produto", width: 350, sortable: true, dataIndex: 'CODIGO_PRODUTO',
                    editor: CB_ID_PRODUTO, renderer: Codigo_Produto
                },
                { id: 'QTDE_CONJUNTO', header: "Qtde", width: 75, sortable: true, dataIndex: 'QTDE_CONJUNTO',
                    align: 'right', renderer: FormataQtde, editor: TXT_QTDE_CONJUNTO, align: 'center'
                },
                { id: 'CUSTO_CONJUNTO', header: "Custo Fornecedor", width: 115, sortable: true, dataIndex: 'CUSTO_CONJUNTO',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_CONJUNTO
                },
                { id: 'CUSTO_BENEFICIAMENTO', header: "Custo (Ben.)", width: 95, sortable: true, dataIndex: 'CUSTO_BENEFICIAMENTO',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_BENEFICIAMENTO
                },
                { id: 'CUSTO_MAO_DE_OBRA', header: "Custo M.Obra", width: 100, sortable: true, dataIndex: 'CUSTO_MAO_DE_OBRA',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_MAO_DE_OBRA
                },
                { id: 'CODIGO_FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'CODIGO_FORNECEDOR', align: 'center',
                    editor: CB_CODIGO_FORNECEDOR, renderer: _fornecedor
                },
                { id: 'OBS_CONJUNTO', header: "Obs.", width: 160, sortable: true, dataIndex: 'OBS_CONJUNTO',
                    editor: TXT_OBS_CONJUNTO
                }
            ],
        stripeRows: true,
        width: '100%',
        height: 220,
        clicksToEdit: 1,
        listeners: {
            afterEdit: function (e) {
                e.record.beginEdit();
                e.record.set('NOME_FANTASIA_FORNECEDOR', CB_CODIGO_FORNECEDOR.getRawValue());
                e.record.endEdit();
            }
        },
        viewConfig: {
            listeners: {
                rowupdated: function (view, firstRow, record) {

                    if (record.data.CODIGO_PRODUTO.length > 0 &&
                        record.data.QTDE_CONJUNTO > 0.00) {
                        Adiciona_Registro();
                    }
                }
            }
        }
    });

    var wConjunto_Item = new Ext.Window({
        title: 'Conjunto',
        width: 1050,
        iconCls: 'icone_TB_CFOP_SIT_TRIB',
        autoHeight: true,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        items: [{
            frame: true,
            labelAlign: 'top',
            layout: 'form',
            items: [TXT_DESCRICAO_CONJUNTO]
        }, GRID_CONJUNTO_ITEM_ORCAMENTO, toolbar_CONJUNTO_ITEM_ORCAMENTO],
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Deleta_Conjunto() {
        if (GRID_CONJUNTO_ITEM_ORCAMENTO.getSelectionModel().hasSelection()) {
            dialog.MensagemDeConfirmacao('Deseja deletar este item do conjunto?', '', Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {
                    var record = GRID_CONJUNTO_ITEM_ORCAMENTO.getSelectionModel().selection.record;
                    var _ID_PRODUTO = record.data.CODIGO_PRODUTO;

                    _ID_PRODUTO = _ID_PRODUTO.substr(_ID_PRODUTO.lastIndexOf(' - ') + 3);

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_CONJUNTO_ITEM_ORCAMENTO.asmx/DeletaConjunto');
                    _ajax.setJsonData({
                        NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
                        NUMERO_ITEM_ORCAMENTO: NUMERO_ITEM_ORCAMENTO,
                        ID_PRODUTO: _ID_PRODUTO,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        Store_CONJUNTO_ITEM_ORCAMENTO.remove(record);
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
        else {
            dialog.MensagemDeErro('Selecione um item para deletar');
        }
    }

    function CARREGA_GRID_CONJUNTO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CONJUNTO_ITEM_ORCAMENTO.asmx/Conjunto_do_Item');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
            NUMERO_ITEM_ORCAMENTO: NUMERO_ITEM_ORCAMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            Store_CONJUNTO_ITEM_ORCAMENTO.removeAll();

            var result = Ext.decode(response.responseText).d;
            Store_CONJUNTO_ITEM_ORCAMENTO.loadData(criaObjetoXML(result), false);

            if (Store_CONJUNTO_ITEM_ORCAMENTO.getCount() == 0) {
                TXT_DESCRICAO_CONJUNTO.reset();
            }

            Adiciona_Registro();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Adiciona_Registro() {
        if (Store_CONJUNTO_ITEM_ORCAMENTO.getCount() > 0) {
            var record = Store_CONJUNTO_ITEM_ORCAMENTO.getAt(Store_CONJUNTO_ITEM_ORCAMENTO.getCount() - 1);

            if (record.data.CODIGO_PRODUTO.length > 0 && record.data.QTDE_CONJUNTO > 0.00) {
                nova_linha();
            }
        }
        else {
            nova_linha();
        }

        function nova_linha() {
            var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_ORCAMENTO' },
                        { name: 'NUMERO_ITEM_ORCAMENTO' },
                        { name: 'PESQUISA' },
                        { name: 'CODIGO_PRODUTO' },
                        { name: 'QTDE_CONJUNTO' },
                        { name: 'CUSTO_CONJUNTO' },
                        { name: 'CUSTO_BENEFICIAMENTO' },
                        { name: 'CUSTO_MAO_DE_OBRA' },
                        { name: 'OBS_CONJUNTO' },
                        { name: 'CODIGO_FORNECEDOR' }
                    ]);

            var novo = new new_record({
                NUMERO_ORCAMENTO: NUMERO_ORCAMENTO,
                NUMERO_ITEM_ORCAMENTO: NUMERO_ITEM_ORCAMENTO,
                PESQUISA: '',
                CODIGO_PRODUTO: '',
                QTDE_CONJUNTO: 0.00,
                CUSTO_CONJUNTO: 0.00,
                CUSTO_BENEFICIAMENTO: 0.00,
                CUSTO_MAO_DE_OBRA: 0.00,
                OBS_CONJUNTO: '',
                CODIGO_FORNECEDOR: 0
            });

            Store_CONJUNTO_ITEM_ORCAMENTO.insert(Store_CONJUNTO_ITEM_ORCAMENTO.getCount(), novo);
        }
    }

    this.show = function (elm) {
        Store_CONJUNTO_ITEM_ORCAMENTO.sort('NUMERO_CUSTO_VENDA', 'DESC');
        CARREGA_GRID_CONJUNTO();
        wConjunto_Item.setTitle("Conjunto do item - " + TITULO);
        wConjunto_Item.show(elm);
    };
}