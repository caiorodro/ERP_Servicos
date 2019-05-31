function Monta_Recebimento_Mercadoria() {
    var TITULO;
    var record_item_compra;
    var desabilita = false;
    var comboLocalCarregada = false;

    this.SETA_RECORD_ITEM_COMPRA = function (record) {
        record_item_compra = record;
    };

    this.DesabilitaGrid = function (pDetabilita) {
        desabilita = pDetabilita;
    };

    this.CARREGA_GRID = function () {
        CARREGA_GRID_RECEBIMENTO();
    };

    var CB_ID_LOCAL = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE,
        fieldLabel: 'Local',
        valueField: 'ID_LOCAL',
        displayField: 'DESCRICAO_LOCAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true
    });

    function renderLocal(val) {
        var i = combo_TB_LOCAL_STORE.find('ID_LOCAL', val);

        return i > -1 ? combo_TB_LOCAL_STORE.getAt(i).data.DESCRICAO_LOCAL : '';
    }

    var buttonGroup_RECEBIMENTO = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_RECEBIMENTO_SALVAR',
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                for (var j = 0; j < Store_Recebimento.getCount(); j++) {
                    var record = Store_Recebimento.getAt(j);

                    if (record.dirty) {
                        var data = record.data.DATA_RECEBIMENTO + "";
                        var _nf = (record.data.NUMERO_NF + "").length > 0 ?
                        record.data.NUMERO_NF : 0;

                        if (record.data.QTDE_RECEBIDA > 0.00 && data.length > 0) {
                            array1[i] = {
                                NUMERO_RECEBIMENTO: record.data.NUMERO_RECEBIMENTO,
                                NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                                NUMERO_ITEM_COMPRA: record.data.NUMERO_ITEM_COMPRA,
                                QTDE_RECEBIDA: record.data.QTDE_RECEBIDA,
                                PESO_RECEBIDO: record.data.PESO_RECEBIDO,
                                DATA_RECEBIMENTO: formatDate(record.data.DATA_RECEBIMENTO),
                                NUMERO_NF: _nf,
                                NUMERO_LOTE_RECEBIMENTO: record.data.NUMERO_LOTE_RECEBIMENTO == undefined ? '' :
                                    record.data.NUMERO_LOTE_RECEBIMENTO,
                                ID_LOCAL: record.data.ID_LOCAL == '' ? 0 : record.data.ID_LOCAL,
                                CODIGO_FORNECEDOR: record_item_compra[0].data.CODIGO_FORNECEDOR,
                                ID_PRODUTO: record_item_compra[0].data.ID_PRODUTO_COMPRA
                            };

                            arr_Record[i] = record;
                            i++;
                        }
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Salva_Recebimento');
                _ajax.setJsonData({ LINHAS: array1, ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    for (var n = 0; n < arr_Record.length; n++) {
                        arr_Record[n].commit();
                    }

                    var result = Ext.decode(response.responseText).d;

                    for (var i = 0; i < result.length; i++) {
                        var result1 = result[i];

                        record_item_compra[i].beginEdit();
                        record_item_compra[i].set('STATUS_ITEM_COMPRA', result1[0]);
                        record_item_compra[i].set('DESCRICAO_STATUS_PEDIDO_COMPRA', result1[1]);
                        record_item_compra[i].set('COR_STATUS_PEDIDO_COMPRA', result1[2]);
                        record_item_compra[i].set('COR_FONTE_STATUS_PEDIDO_COMPRA', result1[3]);
                        record_item_compra[i].set('STATUS_ESPECIFICO_ITEM_COMPRA', result1[4]);
                        record_item_compra[i].set('QTDE_RECEBIDA', result1[5]);

                        record_item_compra[i].endEdit();
                        record_item_compra[i].commit();
                    }

                    CARREGA_GRID_RECEBIMENTO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_RECEBIMENTO_DELETAR',
                text: 'Deletar Recebimento',
                icon: 'imagens/icones/database_delete_24.gif',
                scale: 'medium',
                handler: function () {
                    Deleta_Recebimento();
                }
            }]
    });

    var buttonGroup_RECEBIMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_RECEBIMENTO]
    });

    var Store_Recebimento = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_RECEBIMENTO', 'NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'DATA_RECEBIMENTO',
         'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'NUMERO_NF', 'QTDE_RECEBIDA', 'PESO_RECEBIDO', 'QTDE_ITEM_COMPRA',
         'NUMERO_LOTE_RECEBIMENTO', 'ID_LOCAL', 'DESCRICAO_LOCAL'])
    });

    var TXT_QTDE_RECEBIDA = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: .0001,
        value: 0,
        allowBlank: false
    });

    var TXT_PESO_RECEBIDO = new Ext.form.NumberField({
        decimalPrecision: 3,
        decimalSeparator: ',',
        minValue: .000,
        value: 0
    });

    var TXT_NUMERO_NF = new Ext.form.NumberField({
        decimalPrecision: 0,
        minValue: 0,
        value: 0
    });

    var dt1 = new Date();

    var TXT_DATA_RECEBIMENTO = new Ext.form.DateField({
        fieldLabel: 'Data',
        allowBlank: false,
        width: 92
    });

    var TXT_NUMERO_LOTE_RECEBIMENTO = new Ext.form.TextField({
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' }
    });

    var Recebimento_Expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<hr><b>Descri&ccedil;&atilde;o do Produto:</b> {DESCRICAO_PRODUTO}")
    });

    var GRID_RECEBIMENTO = new Ext.grid.EditorGridPanel({
        id: 'GRID_RECEBIMENTO',
        store: Store_Recebimento,
        columns: [
                Recebimento_Expander,
                { id: 'NUMERO_RECEBIMENTO', header: "Recebimento", width: 80, sortable: true, dataIndex: 'NUMERO_RECEBIMENTO', hidden: true, align: 'center' },
                { id: 'NUMERO_PEDIDO_COMPRA', header: "Pedido de Compra", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
                { id: 'NUMERO_ITEM_COMPRA', header: "Item", width: 70, sortable: true, dataIndex: 'NUMERO_ITEM_COMPRA' },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;d. Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'QTDE_ITEM_COMPRA', header: "Qtde. Pedida", width: 90, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde, align: 'center' },

                { id: 'QTDE_RECEBIDA', header: "Qtde Recebida", width: 100, sortable: true, dataIndex: 'QTDE_RECEBIDA',
                    renderer: FormataQtde, align: 'center', editor: TXT_QTDE_RECEBIDA
                },
                { id: 'PESO_RECEBIDO', header: "Peso Recebido", width: 100, sortable: true, dataIndex: 'PESO_RECEBIDO', align: 'center',
                    editor: TXT_PESO_RECEBIDO
                },
                { id: 'NUMERO_LOTE_RECEBIMENTO', header: "Nr. de Lote", width: 180, sortable: true, dataIndex: 'NUMERO_LOTE_RECEBIMENTO',
                    editor: TXT_NUMERO_LOTE_RECEBIMENTO
                },
                { id: 'DATA_RECEBIMENTO', header: "Recebida em", width: 95, sortable: true, dataIndex: 'DATA_RECEBIMENTO',
                    renderer: formatDate, editor: TXT_DATA_RECEBIMENTO
                },
                { id: 'NUMERO_NF', header: "Numero NF", width: 100, sortable: true, dataIndex: 'NUMERO_NF', align: 'right',
                    editor: TXT_NUMERO_NF
                },
                { id: 'ID_LOCAL', header: "Armazenar em", width: 220, sortable: true, dataIndex: 'ID_LOCAL',
                    align: 'center', editor: CB_ID_LOCAL, renderer: renderLocal
                }
            ],
        stripeRows: true,
        width: '100%',
        height: 380,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        plugins: Recebimento_Expander,

        listeners: {
            beforeEdit: function (e) {
                if (e.record.data.NUMERO_RECEBIMENTO > 0) {
                    e.cancel = true;
                }
            },
            afterEdit: function (e) {
                if (e.field == "DATA_RECEBIMENTO") {
                    for (var i = 0; i < Store_Recebimento.getCount(); i++) {
                        var record = Store_Recebimento.getAt(i);

                        if (record.data.DATA_RECEBIMENTO == '') {
                            record.beginEdit();
                            record.set('DATA_RECEBIMENTO', e.record.data.DATA_RECEBIMENTO);
                            record.endEdit();
                        }
                    }
                }

                if (e.field == "NUMERO_NF") {
                    for (var i = 0; i < Store_Recebimento.getCount(); i++) {
                        var record = Store_Recebimento.getAt(i);

                        if (record.data.NUMERO_NF == '') {
                            record.beginEdit();
                            record.set('NUMERO_NF', e.record.data.NUMERO_NF);
                            record.endEdit();
                        }
                    }
                }

                if (e.field == "ID_LOCAL") {
                    if (e.record.data.NUMERO_RECEBIMENTO > 0) {
                        Grava_Local_do_Lote(e.record);
                    }

                    for (var i = 0; i < Store_Recebimento.getCount(); i++) {
                        var record = Store_Recebimento.getAt(i);

                        if (record.data.ID_LOCAL == '') {
                            record.beginEdit();
                            record.set('ID_LOCAL', e.record.data.ID_LOCAL);
                            record.set('DESCRICAO_LOCAL', e.record.data.DESCRICAO_LOCAL);
                            record.endEdit();
                        }
                    }
                }
            }
        }
    });

    function Grava_Local_do_Lote(record) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Grava_Local_do_Lote');
        _ajax.setJsonData({
            NUMERO_RECEBIMENTO: record.data.NUMERO_RECEBIMENTO,
            ID_LOCAL: record.data.ID_LOCAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            record.commit();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wRecebimento = new Ext.Window({
        title: 'Recebimento de Mercadorias',
        width: 1060,
        iconCls: 'icone_TB_RECEBIMENTO',
        autoHeight: true,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        items: [GRID_RECEBIMENTO, buttonGroup_RECEBIMENTO],
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Deleta_Recebimento() {
        if (GRID_RECEBIMENTO.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um item de recebimento para deletar', 'BTN_RECEBIMENTO_DELETAR');
            return;
        }

        if (GRID_RECEBIMENTO.getSelectionModel().hasSelection()) {
            dialog.MensagemDeConfirmacao('Deseja deletar este recebimento?', 'BTN_RECEBIMENTO_DELETAR', Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {
                    var record = GRID_RECEBIMENTO.getSelectionModel().selections.items[0];
                    var _NUMERO_RECEBIMENTO = record.data.NUMERO_RECEBIMENTO;

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Deleta_Recebimento');
                    _ajax.setJsonData({
                        NUMERO_RECEBIMENTO: _NUMERO_RECEBIMENTO,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        Store_Recebimento.remove(record);

                        var result = Ext.decode(response.responseText).d;

                        for (var i = 0; i < result.length; i++) {
                            var result1 = result[i];

                            record_item_compra[i].beginEdit();
                            record_item_compra[i].set('STATUS_ITEM_COMPRA', result1[0]);
                            record_item_compra[i].set('DESCRICAO_STATUS_PEDIDO_COMPRA', result1[1]);
                            record_item_compra[i].set('COR_STATUS_PEDIDO_COMPRA', result1[2]);
                            record_item_compra[i].set('COR_FONTE_STATUS_PEDIDO_COMPRA', result1[3]);
                            record_item_compra[i].set('STATUS_ESPECIFICO_ITEM_COMPRA', result1[4]);
                            record_item_compra[i].set('QTDE_RECEBIDA', result1[5]);

                            record_item_compra[i].endEdit();
                            record_item_compra[i].commit();
                        }

                        if (Store_Recebimento.getCount() == 0) {
                            Adiciona_Registro();
                        }
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
        else {
            dialog.MensagemDeErro('Selecione um recebimento para deletar');
        }
    }

    function CARREGA_GRID_RECEBIMENTO() {

        var _NUMERO_PEDIDO = new Array();
        var _NUMERO_ITEM = new Array();

        for (var i = 0; i < record_item_compra.length; i++) {
            _NUMERO_PEDIDO[i] = record_item_compra[i].data.NUMERO_PEDIDO_COMPRA;
            _NUMERO_ITEM[i] = record_item_compra[i].data.NUMERO_ITEM_COMPRA;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Recebimentos');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_Recebimento.loadData(criaObjetoXML(result), false);

            Adiciona_Registro();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Adiciona_Registro() {

        for (var i = 0; i < record_item_compra.length; i++) {
            nova_linha(
                    record_item_compra[i].data.NUMERO_PEDIDO_COMPRA,
                    record_item_compra[i].data.NUMERO_ITEM_COMPRA,
                    record_item_compra[i].data.CODIGO_PRODUTO_COMPRA,
                    record_item_compra[i].data.DESCRICAO_PRODUTO,
                    record_item_compra[i].data.QTDE_ITEM_COMPRA);
        }

        function nova_linha(NUMERO_PEDIDO_COMPRA, NUMERO_ITEM_COMPRA, CODIGO_PRODUTO, DESCRICAO_PRODUTO, QTDE_PEDIDA) {
            var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_RECEBIMENTO' },
                        { name: 'NUMERO_PEDIDO_COMPRA' },
                        { name: 'NUMERO_ITEM_COMPRA' },
                        { name: 'CODIGO_PRODUTO' },
                        { name: 'DESCRICAO_PRODUTO' },
                        { name: 'QTDE_ITEM_COMPRA' },
                        { name: 'DATA_RECEBIMENTO' },
                        { name: 'QTDE_RECEBIDA' },
                        { name: 'PESO_RECEBIDO' },
                        { name: 'ID_LOCAL' },
                        { name: 'NUMERO_NF' }
                    ]);

            var novo = new new_record({
                NUMERO_RECEBIMENTO: 0,
                NUMERO_PEDIDO_COMPRA: NUMERO_PEDIDO_COMPRA,
                NUMERO_ITEM_COMPRA: NUMERO_ITEM_COMPRA,
                CODIGO_PRODUTO: CODIGO_PRODUTO,
                DESCRICAO_PRODUTO: DESCRICAO_PRODUTO,
                QTDE_ITEM_COMPRA: QTDE_PEDIDA,
                DATA_RECEBIMENTO: '',
                PESO_RECEBIDO: 0.000,
                ID_LOCAL: 0,
                NUMERO_NF: ''
            });

            Store_Recebimento.insert(Store_Recebimento.getCount(), novo);
        }
    }

    this.show = function (elm) {
        Store_Recebimento.removeAll();
        Store_Recebimento.sort('DATA_RECEBIMENTO', 'DESC');
        CARREGA_GRID_RECEBIMENTO();

        if (!comboLocalCarregada) {
            CARREGA_COMBO_LOCAL();
            comboLocalCarregada = true;
        }

        wRecebimento.setTitle("Recebimento de Compra");
        wRecebimento.show(elm);

        if (desabilita) {
            Ext.getCmp('BTN_RECEBIMENTO_SALVAR').disable();
            Ext.getCmp('BTN_RECEBIMENTO_DELETAR').disable();
        }
        else {
            Ext.getCmp('BTN_RECEBIMENTO_SALVAR').enable();
            Ext.getCmp('BTN_RECEBIMENTO_DELETAR').enable();
        }
    };
}