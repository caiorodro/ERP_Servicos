function Monta_Custo_Item_Pedido() {
    var NUMERO_PEDIDO;
    var NUMERO_ITEM;
    var TITULO;
    var record_item_pedido;
    var desabilitaGrid = false;

    this.SETA_NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.SETA_NUMERO_ITEM = function (pNUMERO_ITEM) {
        NUMERO_ITEM = pNUMERO_ITEM;
    };

    this.SETA_TITULO = function (pTITULO) {
        TITULO = pTITULO;
    };

    this.SETA_RECORD_ITEM_PEDIDO = function (record) {
        record_item_pedido = record;
    };

    this.DesabilitaGrid = function (pDesabilta) {
        desabilitaGrid = pDesabilta;
    };

    TB_CUSTO_VENDA_CARREGA_COMBO();

    var CB_CUSTO_VENDA = new Ext.form.ComboBox({
        store: combo_TB_CUSTO_VENDA,
        mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        width: '100%',
        valueField: 'DESCRICAO_CUSTO_VENDA',
        displayField: 'DESCRICAO_CUSTO_VENDA',
        forceSelection: true,
        emptyText: 'Selecione aqui...',
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                var _custo = record.data.DESCRICAO_CUSTO_VENDA;

                for (var i = 0; i < Store_CUSTO_ITEM_PEDIDO.getCount() - 1; i++) {
                    if (_custo == Store_CUSTO_ITEM_PEDIDO.getAt(i).data.NUMERO_CUSTO_VENDA) {
                        combo.setValue('');
                    }
                }
            }
        }
    });

    var TXT_CUSTO_ITEM_PEDIDO = new Ext.form.NumberField({
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: .0000,
        value: 0,
        allowBlank: false
    });

    var dt1 = new Date();

    var TXT_PREVISAO_ENTREGA1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Entrega',
        allowBlank: false,
        value: dt1,
        width: 92
    });

    var TXT_OBS_CUSTO_VENDA = new Ext.form.TextField();

    var Store_CUSTO_ITEM_PEDIDO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_PEDIDO', 'NUMERO_ITEM', 'NUMERO_CUSTO_VENDA', 'CUSTO_ITEM_PEDIDO', 'PREVISAO_ENTREGA1', 'OBS_CUSTO_VENDA'])
    });

    var GRID_CUSTO_ITEM_PEDIDO = new Ext.grid.EditorGridPanel({
        title: 'Custos de Item',
        store: Store_CUSTO_ITEM_PEDIDO,
        columns: [
                { id: 'NUMERO_CUSTO_VENDA', header: "Custo de Venda", width: 300, sortable: true, dataIndex: 'NUMERO_CUSTO_VENDA',
                    editor: CB_CUSTO_VENDA
                },
                { id: 'CUSTO_ITEM_PEDIDO', header: "Valor", width: 110, sortable: true, dataIndex: 'CUSTO_ITEM_PEDIDO', align: 'right', renderer: FormataValor_4,
                    editor: TXT_CUSTO_ITEM_PEDIDO
                },
                { id: 'PREVISAO_ENTREGA1', header: "Entrega", width: 100, sortable: true, dataIndex: 'PREVISAO_ENTREGA1', renderer: formatDate,
                    editor: TXT_PREVISAO_ENTREGA1
                },
                { id: 'OBS_CUSTO_VENDA', header: "Obs", width: 320, sortable: true, dataIndex: 'OBS_CUSTO_VENDA',
                    editor: TXT_OBS_CUSTO_VENDA
                }
            ],
        stripeRows: true,
        width: '100%',
        height: 220,
        clicksToEdit: 2,
        viewConfig: {
            listeners: {
                rowupdated: function (view, firstRow, record) {
                    var data = record.data.PREVISAO_ENTREGA1 + "";
                    if (record.data.NUMERO_CUSTO_VENDA.length > 0 &&
                        data.length > 0) {
                        Adiciona_Registro();
                    }
                }
            }
        }
    });

    ////////////////

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

    var Store_CONJUNTO_ITEM_ORCAMENTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'QTDE_CONJUNTO', 'CUSTO_CONJUNTO', 'OBS_CONJUNTO', 'ID_PRODUTO',
            'CUSTO_BENEFICIAMENTO', 'CUSTO_MAO_DE_OBRA'])
    });

    var GRID_CONJUNTO_ITEM_ORCAMENTO = new Ext.grid.EditorGridPanel({
        title: 'Itens do Conjunto',
        store: Store_CONJUNTO_ITEM_ORCAMENTO,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "C&oacute;d. Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 355, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'QTDE_CONJUNTO', header: "Qtde", width: 100, sortable: true, dataIndex: 'QTDE_CONJUNTO', align: 'right', renderer: FormataQtde },
                { id: 'CUSTO_CONJUNTO', header: "Custo Fornecedor", width: 120, sortable: true, dataIndex: 'CUSTO_CONJUNTO',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_CONJUNTO
                },
                { id: 'CUSTO_BENEFICIAMENTO', header: "Custo (Ben.)", width: 110, sortable: true, dataIndex: 'CUSTO_BENEFICIAMENTO',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_BENEFICIAMENTO
                },
                { id: 'CUSTO_MAO_DE_OBRA', header: "Custo M.Obra", width: 110, sortable: true, dataIndex: 'CUSTO_MAO_DE_OBRA',
                    align: 'right', renderer: FormataValor_4, editor: TXT_CUSTO_MAO_DE_OBRA
                },
                { id: 'OBS_CONJUNTO', header: "Obs.", width: 170, sortable: true, dataIndex: 'OBS_CONJUNTO' }
            ],
        stripeRows: true,
        width: '100%',
        height: 190,
        clicksToEdit: 1,
        listeners: {
            beforeEdit: function (e) {
                if (_USUARIO_ADMIN_COMPRAS != 1) {
                    e.cancel = true;
                }
            }
        }
    });

    ////
    var buttonGroup_CUSTO_ITEM_PEDIDO = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_SALVAR_CUSTO_ITEM_PEDIDO_VENDA',
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                Store_CUSTO_ITEM_PEDIDO.each(Salva_Store);

                function Salva_Store(record) {
                    var data = record.data.PREVISAO_ENTREGA1 + "";

                    if (record.dirty && record.data.NUMERO_CUSTO_VENDA.length > 0 && data.length > 0) {

                        var _NUMERO_CUSTO_VENDA = record.data.NUMERO_CUSTO_VENDA;
                        _NUMERO_CUSTO_VENDA = _NUMERO_CUSTO_VENDA.substr(_NUMERO_CUSTO_VENDA.indexOf(' -  ', 0) + 4);

                        array1[i] = {
                            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                            NUMERO_ITEM: record.data.NUMERO_ITEM,
                            NUMERO_CUSTO_VENDA: _NUMERO_CUSTO_VENDA,
                            CUSTO_ITEM_PEDIDO: record.data.CUSTO_ITEM_PEDIDO,
                            PREVISAO_ENTREGA1: formatDate(record.data.PREVISAO_ENTREGA1),
                            OBS_CUSTO_VENDA: record.data.OBS_CUSTO_VENDA
                        };

                        arr_Record[i] = record;
                        i++;
                    }
                }

                if (arr_Record.length > 0) {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Salva_Custos');
                    _ajax.setJsonData({ LINHAS: array1, ID_USUARIO: _ID_USUARIO });

                    var _sucess = function (response, options) {
                        for (var n = 0; n < arr_Record.length; n++) {
                            arr_Record[n].commit();
                        }

                        var result = Ext.decode(response.responseText).d;

                        record_item_pedido.beginEdit();
                        record_item_pedido.set('CUSTO_TOTAL_ITEM_PEDIDO', result[0]);
                        record_item_pedido.set('MARGEM_VENDA_ITEM_PEDIDO', result[1]);
                        record_item_pedido.set('ENTREGA_PEDIDO', result[2]);
                        record_item_pedido.set('PERCENTUAL_COMISSAO', result[3]);
                        record_item_pedido.set('VALOR_COMISSAO', result[4]);

                        record_item_pedido.endEdit();
                        record_item_pedido.commit();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_DELETAR_CUSTO_ITEM_PEDIDO_VENDA',
                text: 'Deletar Custo',
                icon: 'imagens/icones/database_delete_24.gif',
                scale: 'medium',
                handler: function () {
                    Deleta_Custo();
                }
            }]
    });

    var toolBar_CUSTO_ITEM_PEDIDO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_CUSTO_ITEM_PEDIDO]
    });

    var buttonGroup_CONJUNTO_VENDA = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                for (var i = 0; i < Store_CONJUNTO_ITEM_ORCAMENTO.getCount(); i++) {
                    var record = Store_CONJUNTO_ITEM_ORCAMENTO.getAt(i);

                    if (record.dirty) {
                        array1[i] = {
                            ID_PRODUTO: record.data.ID_PRODUTO,
                            CUSTO_CONJUNTO: record.data.CUSTO_CONJUNTO,
                            CUSTO_BENEFICIAMENTO: record.data.CUSTO_BENEFICIAMENTO,
                            CUSTO_MAO_DE_OBRA: record.data.CUSTO_MAO_DE_OBRA
                        };

                        arr_Record[i] = record;
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/AtualizaConjunto');
                _ajax.setJsonData({
                    NUMERO_PEDIDO: NUMERO_PEDIDO,
                    NUMERO_ITEM: NUMERO_ITEM,
                    CUSTO: array1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < Store_CONJUNTO_ITEM_ORCAMENTO.getCount(); i++) {
                        var record = Store_CONJUNTO_ITEM_ORCAMENTO.getAt(i);

                        if (record.dirty) {
                            record.commit();
                        }
                    }

                    var result = Ext.decode(response.responseText).d;

                    record_item_pedido.beginEdit();
                    record_item_pedido.set('CUSTO_TOTAL_ITEM_PEDIDO', result[0]);
                    record_item_pedido.set('MARGEM_VENDA_ITEM_PEDIDO', result[1]);

                    record_item_pedido.endEdit();
                    record_item_pedido.commit();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }]
    });

    var toolBar_CONJUNTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_CONJUNTO_VENDA]
    });

    var wCusto_Item = new Ext.Window({
        title: 'Custos de Venda',
        width: 1020,
        iconCls: 'icone_TB_CUSTO_VENDA',
        autoHeight: true,
        closable: false,
        minimizable: true,
        draggable: true,
        resizable: false,
        items: [GRID_CUSTO_ITEM_PEDIDO, toolBar_CUSTO_ITEM_PEDIDO, GRID_CONJUNTO_ITEM_ORCAMENTO, toolBar_CONJUNTO],
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Deleta_Custo() {
        if (GRID_CUSTO_ITEM_PEDIDO.getSelectionModel().hasSelection()) {
            dialog.MensagemDeConfirmacao('Deseja deletar este custo?', '', Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {
                    var record = GRID_CUSTO_ITEM_PEDIDO.getSelectionModel().selection.record;
                    var _NUMERO_CUSTO_VENDA = record.data.NUMERO_CUSTO_VENDA;
                    _NUMERO_CUSTO_VENDA = _NUMERO_CUSTO_VENDA.substr(_NUMERO_CUSTO_VENDA.indexOf(' -  ', 0) + 4);

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Deleta_Custo');
                    _ajax.setJsonData({
                        NUMERO_PEDIDO: NUMERO_PEDIDO,
                        NUMERO_ITEM: NUMERO_ITEM,
                        NUMERO_CUSTO_VENDA: _NUMERO_CUSTO_VENDA,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        Store_CUSTO_ITEM_PEDIDO.remove(record);

                        var result = Ext.decode(response.responseText).d;

                        record_item_pedido.beginEdit();
                        record_item_pedido.set('CUSTO_TOTAL_PRODUTO', result[0]);
                        record_item_pedido.set('MARGEM_VENDA_PRODUTO', result[1]);
                        record_item_pedido.set('ENTREGA_PEDIDO', result[2]);

                        record_item_pedido.endEdit();
                        record_item_pedido.commit();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
        else {
            dialog.MensagemDeErro('Selecione um custo para deletar');
        }
    }

    function CARREGA_GRID_CUSTO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Custos_do_Item');
        _ajax.setJsonData({ NUMERO_PEDIDO: NUMERO_PEDIDO, NUMERO_ITEM: NUMERO_ITEM, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_CUSTO_ITEM_PEDIDO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function CARREGA_GRID_CONJUNTO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Conjunto');
        _ajax.setJsonData({ NUMERO_PEDIDO: NUMERO_PEDIDO, NUMERO_ITEM: NUMERO_ITEM, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_CONJUNTO_ITEM_ORCAMENTO.loadData(criaObjetoXML(result), false);

            Adiciona_Registro();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Adiciona_Registro() {
        if (Store_CUSTO_ITEM_PEDIDO.getCount() > 0) {
            var record = Store_CUSTO_ITEM_PEDIDO.getAt(Store_CUSTO_ITEM_PEDIDO.getCount() - 1);

            if (record.data.NUMERO_CUSTO_VENDA.length > 0) {
                nova_linha();
            }
        }
        else {
            nova_linha();
        }

        function nova_linha() {
            var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_PEDIDO' },
                        { name: 'NUMERO_ITEM' },
                        { name: 'NUMERO_CUSTO_VENDA' },
                        { name: 'CUSTO_ITEM_PEDIDO' },
                        { name: 'PREVISAO_ENTREGA1' },
                        { name: 'OBS_CUSTO_VENDA' }
                    ]);

            var novo = new new_record({
                NUMERO_PEDIDO: NUMERO_PEDIDO,
                NUMERO_ITEM: NUMERO_ITEM,
                NUMERO_CUSTO_VENDA: '',
                CUSTO_ITEM_PEDIDO: 0.0000,
                PREVISAO_ENTREGA1: '',
                OBS_CUSTO_VENDA: ''
            });

            Store_CUSTO_ITEM_PEDIDO.insert(Store_CUSTO_ITEM_PEDIDO.getCount(), novo);
        }
    }

    this.show = function (elm) {
        Store_CUSTO_ITEM_PEDIDO.sort('PREVISAO_ENTREGA', 'ASC');
        CARREGA_GRID_CUSTO();
        CARREGA_GRID_CONJUNTO();
        wCusto_Item.setTitle("Custo de Venda - " + TITULO);
        wCusto_Item.show(elm);

        if (_GERENTE_COMERCIAL != 1) {
            Ext.getCmp('BTN_SALVAR_CUSTO_ITEM_PEDIDO_VENDA').disable();
            Ext.getCmp('BTN_DELETAR_CUSTO_ITEM_PEDIDO_VENDA').disable();
        }
        else {
            Ext.getCmp('BTN_SALVAR_CUSTO_ITEM_PEDIDO_VENDA').enable();
            Ext.getCmp('BTN_DELETAR_CUSTO_ITEM_PEDIDO_VENDA').enable();
        }
    };
}