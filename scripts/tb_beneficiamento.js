var POSICAO_BENEFICIAMENTO_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO']
       )
});

function CARREGA_STATUS_BENEFICIAMENTO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Carrega_Status_Beneficiamento');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        POSICAO_BENEFICIAMENTO_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

////////////////////

var TIPO_BENEFICIAMENTO_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_CUSTO_VENDA', 'DESCRICAO_CUSTO_VENDA']
       ),
    sortInfo: {
        field: 'DESCRICAO_CUSTO_VENDA',
        direction: 'ASC'
    }
});

function CARREGA_TIPO_BENEFICIAMENTO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Carrega_Tipo_Beneficiamento');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        TIPO_BENEFICIAMENTO_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaBeneficiamento() {

    var _NUMERO_PEDIDO_VENDA;
    var _NUMERO_ITEM_VENDA;

    this.NUMERO_PEDIDO_VENDA = function (pNUMERO_PEDIDO_VENDA) {
        _NUMERO_PEDIDO_VENDA = pNUMERO_PEDIDO_VENDA;
    };

    this.NUMERO_ITEM_VENDA = function (pNUMERO_ITEM_VENDA) {
        _NUMERO_ITEM_VENDA = pNUMERO_ITEM_VENDA;
    };

    CARREGA_STATUS_BENEFICIAMENTO();
    CARREGA_TIPO_BENEFICIAMENTO();

    var _pesquisa = new Pesquisa_Beneficiamento();

    ////////////////////// ENVIO

    var TXT_ANO_LOTE = new Ext.form.NumberField({
        visible: false
    });

    var TXT_NUMERO_LOTE1 = new Ext.form.NumberField({
        visible: false
    });

    var TXT_ID_BENEFICIAMENTO = new Ext.form.NumberField({
        value: 0,
        visible: false
    });

    var TXT_ID_PRODUTO_ENVIO = new Ext.form.NumberField({
        visible: false
    });

    var TXT_CODIGO_PRODUTO_ENVIO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;d. Produto (Envio)',
        width: 170,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue().length == 0) {
                        Pesquisa_Envio.fieldSet().expand();
                    }
                }
            }
        }
    });

    var TXT_PESO_PRODUTO_ENVIO = new Ext.form.NumberField({
        visible: false
    });

    var TXT_QTDE_ENVIO = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        width: 110,
        minValue: 0.01,
        allowBlank: false,
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                Calcula_Peso();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB && TXT_PESO_ENVIO.getValue() == 0) {
                    Calcula_Peso();
                }
            }
        }
    });

    var TXT_QTDE_VOLUMES_ENVIO = new Ext.form.NumberField({
        fieldLabel: 'Volumes',
        width: 110,
        minValue: 0,
        allowBlank: false,
        decimalPrecision: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var TXT_PESO_ENVIO = new Ext.form.NumberField({
        fieldLabel: 'Peso',
        width: 110,
        minValue: 0.000,
        allowBlank: false,
        decimalPrecision: 3,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    function Calcula_Peso() {
        var peso = (TXT_QTDE_ENVIO.getValue() * TXT_PESO_PRODUTO_ENVIO.getValue()).toFixed(3);

        TXT_PESO_ENVIO.setValue(peso);
    }

    var TXT_DATA_ENVIO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data de envio',
        width: 94,
        allowBlank: false
    });

    var Pesquisa_Envio = new Pesquisa_de_Produtos();

    Pesquisa_Envio.TITULO_BUSCA('Busca do Produto de Envio');

    Pesquisa_Envio.ACAO_POPULAR_PRODUTO(function (record) {
        TXT_ID_PRODUTO_ENVIO.setValue(record.data.ID_PRODUTO);
        TXT_CODIGO_PRODUTO_ENVIO.setValue(record.data.CODIGO_PRODUTO);
        TXT_PESO_PRODUTO_ENVIO.setValue(record.data.PESO_PRODUTO);

        Pesquisa_Envio.fieldSet().collapse();

        TXT_QTDE_ENVIO.focus();
    });

    //////////////////// RETORNO

    var TXT_ID_PRODUTO_RETORNO = new Ext.form.NumberField({
        visible: false
    });

    var TXT_CODIGO_PRODUTO_RETORNO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;d. Produto (Retorno)',
        width: 170,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue().length == 0)
                        Pesquisa_Retorno.fieldSet().expand();
                }
            }
        }
    });

    var TXT_PESO_PRODUTO_RETORNO = new Ext.form.NumberField({
        visible: false
    });

    var TXT_QTDE_RETORNO = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        width: 110,
        minValue: 0.00,
        allowBlank: false,
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var TXT_PESO_RETORNO = new Ext.form.NumberField({
        fieldLabel: 'Peso',
        width: 110,
        value: 0,
        minValue: 0.000,
        allowBlank: false,
        decimalPrecision: 3,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var TXT_DATA_RETORNO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data de retorno',
        width: 94
    });

    var TXT_DATA_PREVISAO_RETORNO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Previs&atilde;o de retorno',
        width: 94,
        allowBlank: false
    });

    var Pesquisa_Retorno = new Pesquisa_de_Produtos();

    Pesquisa_Retorno.TITULO_BUSCA('Busca do Produto de Retorno');
    Pesquisa_Retorno.FORMULARIO(formBENEFICIAMENTO);

    Pesquisa_Retorno.ACAO_POPULAR_PRODUTO(function (record) {
        TXT_ID_PRODUTO_RETORNO.setValue(record.data.ID_PRODUTO);
        TXT_CODIGO_PRODUTO_RETORNO.setValue(record.data.CODIGO_PRODUTO);

        Pesquisa_Retorno.fieldSet().collapse();

        TXT_QTDE_RETORNO.focus();
    });

    ////////////////////

    function Busca_Nome_Fornecedor(CODIGO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/BuscaNomeFornecedor');
        _ajax.setJsonData({ CODIGO_FORNECEDOR: CODIGO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            LBL_DADOS_FORNECEDOR.setText(result, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var busca_fornecedor = new BUSCA_FORNECEDOR();

    var TXT_CODIGO_FORNECEDOR = new Ext.form.NumberField({
        fieldLabel: 'Fornecedor &lt;F8&gt;',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.isValid())
                        Busca_Nome_Fornecedor(f.getValue());
                }
            },
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {

                    busca_fornecedor.ACAO_POPULAR(function (record) {
                        TXT_CODIGO_FORNECEDOR.setValue(record.data.CODIGO_FORNECEDOR);
                        LBL_DADOS_FORNECEDOR.setText(record.data.NOME_FORNECEDOR + ' - ' + record.data.NOME_FANTASIA_FORNECEDOR);
                        busca_fornecedor.hide();

                        TXT_CUSTO_UNITARIO.focus();
                    });

                    busca_fornecedor.show(TXT_CODIGO_FORNECEDOR.getId());
                }
            }
        }
    });

    var LBL_DADOS_FORNECEDOR = new Ext.form.Label({
        html: '&nbsp;'
    });

    var TXT_CUSTO_UNITARIO = new Ext.form.NumberField({
        fieldLabel: 'Pre&ccedil;o Unit&aacute;rio',
        width: 80,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0.0001,
        allowBlank: false
    });

    var CB_STATUS_BENEFICIAMENTO = new Ext.form.ComboBox({
        store: POSICAO_BENEFICIAMENTO_Store,
        fieldLabel: 'Posi&ccedil;&atilde;o do Beneficiamento',
        valueField: 'CODIGO_STATUS_PEDIDO',
        displayField: 'DESCRICAO_STATUS_PEDIDO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 280,
        allowBlank: false
    });

    var CB_MATERIAL_MISTURADO = new Ext.form.ComboBox({
        fieldLabel: 'Material misturado',
        id: 'MATERIAL_MISTURADO',
        name: 'MATERIAL_MISTURADO',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 100,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[1, 'Sim'], [0, 'Não']]
        })
    });

    var CB_ID_LOCAL_RETORNO = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE,
        fieldLabel: 'Local de retorno',
        valueField: 'ID_LOCAL',
        displayField: 'DESCRICAO_LOCAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 280
    });

    CARREGA_COMBO_LOCAL_POR_TIPO(2);

    var CB_CUSTO_VENDA = new Ext.form.ComboBox({
        store: TIPO_BENEFICIAMENTO_Store,
        fieldLabel: 'Tipo de Beneficiamento',
        valueField: 'ID_CUSTO_VENDA',
        displayField: 'DESCRICAO_CUSTO_VENDA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 200,
        allowBlank: false
    });

    // o numero do lote é gerado sequencial para cada ano

    var TXT_NUMERO_LOTE = new Ext.form.TextField({
        fieldLabel: 'Nr. do Lote',
        width: 184,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' },
        allowBlank: false
    });

    var TXT_OBS = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 38,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var formBENEFICIAMENTO = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 299,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO_ENVIO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_QTDE_ENVIO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_PESO_ENVIO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_QTDE_VOLUMES_ENVIO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_DATA_ENVIO]
            }]
        }, {
            items: [Pesquisa_Envio.fieldSet()]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO_RETORNO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_QTDE_RETORNO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_PESO_RETORNO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_DATA_PREVISAO_RETORNO]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_DATA_RETORNO]
            }]
        }, {
            items: [Pesquisa_Retorno.fieldSet()]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .10,
                layout: 'form',
                items: [TXT_CODIGO_FORNECEDOR]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [LBL_DADOS_FORNECEDOR]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [TXT_CUSTO_UNITARIO]
            }, {
                columnWidth: .16,
                layout: 'form',
                items: [TXT_NUMERO_LOTE]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [CB_CUSTO_VENDA]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [CB_STATUS_BENEFICIAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                items: [CB_MATERIAL_MISTURADO]
            }, {
                columnWidth: .30,
                layout: 'form',
                items: [CB_ID_LOCAL_RETORNO]
            }, {
                columnWidth: .55,
                layout: 'form',
                items: [TXT_OBS]
            }]
        }]
    });

    Pesquisa_Envio.FORMULARIO(formBENEFICIAMENTO);
    Pesquisa_Retorno.FORMULARIO(formBENEFICIAMENTO);

    function PopulaFormulario_TB_BENEFICIAMENTO(record) {
        panelCadastroBENEFICIAMENTO.setTitle('Alterar dados do Beneficiamento');

        _NUMERO_PEDIDO_VENDA = record.data.NUMERO_PEDIDO_VENDA;
        _NUMERO_ITEM_VENDA = record.data.NUMERO_ITEM_VENDA;

        TXT_ID_BENEFICIAMENTO.setValue(record.data.ID_BENEFICIAMENTO);
        TXT_ID_PRODUTO_ENVIO.setValue(record.data.ID_PRODUTO_ENVIO);
        TXT_CODIGO_PRODUTO_ENVIO.setValue(record.data.CODIGO_PRODUTO_ENVIO);
        TXT_QTDE_ENVIO.setValue(record.data.QTDE_ENVIO);
        TXT_PESO_ENVIO.setValue(record.data.PESO_ENVIO);
        TXT_QTDE_VOLUMES_ENVIO.setValue(record.data.QTDE_VOLUMES_ENVIO);
        TXT_DATA_ENVIO.setRawValue(XMLParseDate(record.data.DATA_ENVIO));

        TXT_ID_PRODUTO_RETORNO.setValue(record.data.ID_PRODUTO_RETORNO);
        TXT_CODIGO_PRODUTO_RETORNO.setValue(record.data.CODIGO_PRODUTO_RETORNO);
        TXT_QTDE_RETORNO.setValue(record.data.QTDE_RETORNO);
        TXT_PESO_RETORNO.setValue(record.data.PESO_RETORNO);
        TXT_DATA_RETORNO.setRawValue(XMLParseDate(record.data.DATA_RETORNO));
        TXT_DATA_PREVISAO_RETORNO.setRawValue(XMLParseDate(record.data.DATA_PREVISAO_RETORNO));

        TXT_CODIGO_FORNECEDOR.setValue(record.data.ID_FORNECEDOR);
        LBL_DADOS_FORNECEDOR.setText(record.data.NOME_FORNECEDOR + ' - ' + record.data.NOME_FANTASIA_FORNECEDOR, false);
        TXT_CUSTO_UNITARIO.setValue(record.data.CUSTO_UNITARIO);
        CB_STATUS_BENEFICIAMENTO.setValue(record.data.ID_STATUS);
        CB_CUSTO_VENDA.setValue(record.data.ID_CUSTO_VENDA);

        TXT_NUMERO_LOTE1.setValue(record.data.NUMERO_LOTE);
        TXT_ANO_LOTE.setValue(record.data.ANO_LOTE);

        TXT_NUMERO_LOTE.setValue(record.data.ANO_LOTE + '/' + record.data.NUMERO_LOTE);

        TXT_OBS.setValue(record.data.OBS);

        CB_MATERIAL_MISTURADO.setValue(record.data.MATERIAL_MISTURADO);
        CB_ID_LOCAL_RETORNO.setValue(record.data.ID_LOCAL_RETORNO);

        TXT_CODIGO_PRODUTO_ENVIO.disable();
        TXT_CODIGO_PRODUTO_RETORNO.disable();

        buttonGroup_TB_BENEFICIAMENTO.items.items[32].enable();

        TXT_CODIGO_PRODUTO_ENVIO.focus();
    }

    var TB_BENEFICIAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
    ['ID_BENEFICIAMENTO', 'ID_PRODUTO_ENVIO', 'CODIGO_PRODUTO_ENVIO', 'DESCRICAO_PRODUTO',
    'QTDE_ENVIO', 'PESO_ENVIO', 'DATA_ENVIO', 'COR_FONTE_STATUS', 'COR_STATUS',
    'ID_PRODUTO_RETORNO', 'CODIGO_PRODUTO_RETORNO', 'DESCRICAO_PRODUTO_RETORNO',
    'QTDE_RETORNO', 'PESO_RETORNO', 'DATA_PREVISAO_RETORNO', 'DATA_RETORNO',
    'CUSTO_UNITARIO', 'ID_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR',
    'ID_STATUS', 'DESCRICAO_STATUS_PEDIDO', 'STATUS_ESPECIFICO', 'NUMERO_LOTE', 'ANO_LOTE',
    'ID_CUSTO_VENDA', 'DESCRICAO_CUSTO_VENDA', 'OBS', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA',
    'NOME_FANTASIA_FORNECEDOR', 'NOME_FORNECEDOR', 'GERAR_NOTA', 'NUMERO_SEQ_NF', 'MATERIAL_MISTURADO', 
    'ID_LOCAL_RETORNO', 'QTDE_VOLUMES_ENVIO'])
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Habilita_Botoes(s);
            },
            rowdeselect: function (s, Index, record) {
                Habilita_Botoes(s);
            }
        }
    });

    function Habilita_Botoes(s) {
        Ext.getCmp('BTN_MARCAR_NOTA_REMESSA').enable();
        Ext.getCmp('BTN_GERAR_NOTA_REMESSA').enable();

        for (var i = 0; i < s.selections.items.length; i++) {
            if (s.selections.items[i].data.NUMERO_SEQ_NF > 0) {
                Ext.getCmp('BTN_MARCAR_NOTA_REMESSA').disable();
                Ext.getCmp('BTN_GERAR_NOTA_REMESSA').disable();
            }
        }
    }

    function GERAR_NOTA(val, metadata, record) {
        if (record.data.GERAR_NOTA == 1 && record.data.NUMERO_SEQ_NF == 0) {
            return "<span style='width: 100%; background-color: #D7D7D7; color: red;' title='Item marcado para ser gerado na nota de remessa'>" + val + "</span>";
        }
        else if (record.data.NUMERO_SEQ_NF > 0) {
            return "<span style='width: 100%; background-color: #D7D7D7; color: green;' title='Nota fiscal de simples remessa de sa&iacute;da gerada'>" + val + "</span>";
        }
        else
            return val;
    }

    var gridBENEFICIAMENTO = new Ext.grid.GridPanel({
        store: TB_BENEFICIAMENTO_Store,
        columns: [
                        checkBoxSM_,
                        { id: 'DESCRICAO_STATUS_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 175, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO', renderer: status_pedido },
                        { id: 'CODIGO_PRODUTO_ENVIO', header: "C&oacute;d.Produto Envio", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO_ENVIO', renderer: GERAR_NOTA },
                        { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },
                        { id: 'QTDE_ENVIO', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ENVIO', renderer: FormataQtde },
                        { id: 'QTDE_VOLUMES_ENVIO', header: "Volumes", width: 80, sortable: true, dataIndex: 'QTDE_VOLUMES_ENVIO' },
                        { id: 'PESO_ENVIO', header: "Peso", width: 80, sortable: true, dataIndex: 'PESO_ENVIO', renderer: FormataPeso },
                        { id: 'DATA_ENVIO', header: "Data Envio", width: 100, sortable: true, dataIndex: 'DATA_ENVIO', renderer: XMLParseDate, align: 'center' },
                        { id: 'CODIGO_PRODUTO_RETORNO', header: "C&oacute;d.Produto Retorno", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO_RETORNO' },
                        { id: 'DESCRICAO_PRODUTO_RETORNO', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_RETORNO', hidden: true },
                        { id: 'QTDE_RETORNO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_RETORNO', renderer: FormataQtde },
                        { id: 'PESO_RETORNO', header: "Peso", width: 80, sortable: true, dataIndex: 'PESO_RETORNO', renderer: FormataPeso },
                        { id: 'DATA_PREVISAO_RETORNO', header: "Previs&atilde;o de Retorno", width: 110, sortable: true, dataIndex: 'DATA_PREVISAO_RETORNO', renderer: XMLParseDate, align: 'center' },
                        { id: 'DATA_RETORNO', header: "Data de Retorno", width: 110, sortable: true, dataIndex: 'DATA_RETORNO', renderer: XMLParseDate, align: 'center' },
                        { id: 'CUSTO_UNITARIO', header: "Custo Unit&aacute;rio", width: 95, sortable: true, dataIndex: 'CUSTO_UNITARIO', renderer: FormataValor_4 },
                        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 220, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                        { id: 'NUMERO_LOTE', header: "Nr. do Lote", width: 140, sortable: true, dataIndex: 'NUMERO_LOTE' },
                        { id: 'DESCRICAO_CUSTO_VENDA', header: "Tipo do Beneficiamento", width: 180, sortable: true, dataIndex: 'DESCRICAO_CUSTO_VENDA' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: checkBoxSM_

    });

    gridBENEFICIAMENTO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_BENEFICIAMENTO(record);
    });

    gridBENEFICIAMENTO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridBENEFICIAMENTO.getSelectionModel().getSelections().length > 0) {
                var record = gridBENEFICIAMENTO.getSelectionModel().getSelected();
                PopulaFormulario_TB_BENEFICIAMENTO(record);
            }
        }
    });

    function Marca_Itens_Nota_Remessa() {

        var array1 = new Array();
        var array2 = new Array();
        var arr_Record = new Array();

        for (var i = 0; i < gridBENEFICIAMENTO.getSelectionModel().selections.length; i++) {
            var record = gridBENEFICIAMENTO.getSelectionModel().selections.items[i];

            array1[array1.length] = record.data.ID_BENEFICIAMENTO;

            arr_Record[arr_Record.length] = record;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Marca_Desmarca_Item_Nota_Remessa');
        _ajax.setJsonData({ ID_BENEFICIAMENTO: array1, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {

            var result = Ext.decode(response.responseText).d;

            for (var n = 0; n < arr_Record.length; n++) {
                arr_Record[n].beginEdit();
                arr_Record[n].set('GERAR_NOTA', arr_Record[n].data.GERAR_NOTA == 1 ? 0 : 1);
                arr_Record[n].endEdit();
                arr_Record[n].commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function RetornaLIMITE_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
            NUMERO_ITEM_VENDA: _NUMERO_ITEM_VENDA,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var BENEFICIAMENTO_PagingToolbar = new Th2_PagingToolbar();
    BENEFICIAMENTO_PagingToolbar.setStore(TB_BENEFICIAMENTO_Store);

    function TB_BENEFICIAMENTO_CARREGA_GRID() {
        BENEFICIAMENTO_PagingToolbar.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Lista_Beneficiamentos_do_Pedido');
        BENEFICIAMENTO_PagingToolbar.setParamsJsonData(RetornaLIMITE_JsonData());
        BENEFICIAMENTO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_BENEFICIAMENTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_BENEFICIAMENTO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Beneficiamento',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    Novo_Beneficiamento();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_BENEFICIAMENTO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_BENEFICIAMENTO();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_PESQUISA_BENEFICIAMENTO',
                                 text: 'Buscar',
                                 icon: 'imagens/icones/database_search_24.gif',
                                 scale: 'medium',
                                 handler: function (b, e) {
                                     _pesquisa.Grid(BENEFICIAMENTO_PagingToolbar);

                                     _pesquisa.ACAO_FORMULARIO(function () {
                                         Novo_Beneficiamento();
                                     });

                                     _pesquisa.show(b.getId());
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_MARCAR_NOTA_REMESSA',
                                 text: 'Marcar / Desmarcar para nota de remessa',
                                 icon: 'imagens/icones/ok_24.gif',
                                 scale: 'medium',
                                 handler: function (b, e) {
                                     Marca_Itens_Nota_Remessa();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_GERAR_NOTA_REMESSA',
                                 text: 'Gerar Nota de Remessa de Sa&iacute;da',
                                 icon: 'imagens/icones/document_fav_24.gif',
                                 scale: 'medium',
                                 handler: function (b, e) {
                                     GERA_NOTA_REMESSA();
                                 }
                             }]
    });

    function GERA_NOTA_REMESSA() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Gera_Nota_Saida_Remessa');
        _ajax.setJsonData({
            NOME_FANTASIA_EMITENTE: _EMITENTE,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < TB_BENEFICIAMENTO_Store.getCount(); i++) {
                var record = TB_BENEFICIAMENTO_Store.getAt(i);

                if (record.data.GERAR_NOTA == 1) {
                    record.beginEdit();
                    record.set('NUMERO_SEQ_NF', result);
                    record.set('GERAR_NOTA', 0);
                    record.endEdit();

                    record.commit();
                }
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_TB_BENEFICIAMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_BENEFICIAMENTO]
    });

    var panelCadastroBENEFICIAMENTO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Beneficiamento',
        items: [formBENEFICIAMENTO, toolbar_TB_BENEFICIAMENTO, gridBENEFICIAMENTO, BENEFICIAMENTO_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_BENEFICIAMENTO() {
        if (!formBENEFICIAMENTO.getForm().isValid()) {
            return;
        }

        var ano = TXT_NUMERO_LOTE.getValue().substr(0, TXT_NUMERO_LOTE.getValue().indexOf('/'));
        var lote = TXT_NUMERO_LOTE.getValue().substr(TXT_NUMERO_LOTE.getValue().indexOf('/') + 1);

        TXT_ANO_LOTE.setValue(ano);
        TXT_NUMERO_LOTE1.setValue(lote);

        var dados = {
            ID_BENEFICIAMENTO: TXT_ID_BENEFICIAMENTO.getValue(),
            ID_PRODUTO_ENVIO: TXT_ID_PRODUTO_ENVIO.getValue(),
            QTDE_ENVIO: TXT_QTDE_ENVIO.getValue(),
            PESO_ENVIO: TXT_PESO_ENVIO.getValue(),
            DATA_ENVIO: TXT_DATA_ENVIO.getRawValue(),
            QTDE_VOLUMES_ENVIO: TXT_QTDE_VOLUMES_ENVIO.getValue() == '' ? 0 : TXT_QTDE_VOLUMES_ENVIO.getValue(),

            ID_PRODUTO_RETORNO: TXT_ID_PRODUTO_RETORNO.getValue(),
            QTDE_RETORNO: TXT_QTDE_RETORNO.getValue(),
            PESO_RETORNO: TXT_PESO_RETORNO.getValue(),

            DATA_RETORNO: TXT_DATA_RETORNO.getRawValue().trim().length == 0 ?
                                '01/01/1900' :
                                TXT_DATA_RETORNO.getRawValue(),

            DATA_PREVISAO_RETORNO: TXT_DATA_PREVISAO_RETORNO.getRawValue(),

            ID_FORNECEDOR: TXT_CODIGO_FORNECEDOR.getValue(),
            CUSTO_UNITARIO: TXT_CUSTO_UNITARIO.getValue(),
            ID_STATUS: CB_STATUS_BENEFICIAMENTO.getValue(),
            ID_CUSTO_VENDA: CB_CUSTO_VENDA.getValue(),
            ANO_LOTE: TXT_ANO_LOTE.getValue(),
            NUMERO_LOTE: TXT_NUMERO_LOTE1.getValue(),
            OBS: TXT_OBS.getValue(),
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
            NUMERO_ITEM_VENDA: _NUMERO_ITEM_VENDA,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            MATERIAL_MISTURADO: CB_MATERIAL_MISTURADO.getValue(),
            ID_LOCAL_RETORNO: CB_ID_LOCAL_RETORNO.getValue() == '' ? 0 : CB_ID_LOCAL_RETORNO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroBENEFICIAMENTO.title == "Novo Beneficiamento" ?
                            'servicos/TB_BENEFICIAMENTO.asmx/Grava_Novo_Beneficiamento' :
                            'servicos/TB_BENEFICIAMENTO.asmx/Atualiza_Beneficiamento';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroBENEFICIAMENTO.title == "Novo Beneficiamento") {
                Novo_Beneficiamento();
            }

            TB_BENEFICIAMENTO_CARREGA_GRID();
            TXT_CODIGO_PRODUTO_ENVIO.focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_BENEFICIAMENTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este registro?', formBENEFICIAMENTO.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Deleta_Beneficiamento');
                _ajax.setJsonData({
                    ID_BENEFICIAMENTO: TXT_ID_BENEFICIAMENTO.getValue(),
                    ID_EMPRESA: _ID_EMPRESA,
                    SERIE: _SERIE,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroBENEFICIAMENTO.setTitle("Novo Beneficiamento");
                    TXT_CODIGO_PRODUTO_ENVIO.focus();
                    Novo_Beneficiamento();

                    buttonGroup_TB_BENEFICIAMENTO.items.items[32].disable();

                    TB_BENEFICIAMENTO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridBENEFICIAMENTO.setHeight(AlturaDoPainelDeConteudo(formBENEFICIAMENTO.height) - 153);

    function Novo_Beneficiamento() {
        buttonGroup_TB_BENEFICIAMENTO.items.items[32].disable();

        TXT_CODIGO_PRODUTO_ENVIO.enable();
        TXT_CODIGO_PRODUTO_RETORNO.enable();

        TXT_CODIGO_PRODUTO_ENVIO.focus();

        TXT_CODIGO_PRODUTO_ENVIO.reset();
        TXT_PESO_PRODUTO_ENVIO.reset();
        TXT_DATA_ENVIO.reset();

        panelCadastroBENEFICIAMENTO.setTitle('Novo Beneficiamento');
    }

    this.Panel = function () {
        return panelCadastroBENEFICIAMENTO;
    };

    this.CarregaGrid = function () {
        TB_BENEFICIAMENTO_CARREGA_GRID();
    };

    this.resetaFormulario = function () {
        Novo_Beneficiamento();
    };

    this.seta_PRODUTO_RETORNO = function (pID_PRODUTO, pCODIGO) {
        TXT_ID_PRODUTO_RETORNO.setValue(pID_PRODUTO);
        TXT_CODIGO_PRODUTO_RETORNO.setValue(pCODIGO);
    };

    this.seta_QTDE_RETORNO = function (pQTDE) {
        TXT_QTDE_RETORNO.setValue(pQTDE);
    };
}

function Pesquisa_de_Produtos() {
    var _ACAO_POPULAR_PRODUTO;
    var _record;
    var _formulario;

    this.ACAO_POPULAR_PRODUTO = function (pACAO) {
        _ACAO_POPULAR_PRODUTO = pACAO;
    };

    this.FORMULARIO = function (pFORMULARIO) {
        _formulario = pFORMULARIO;
    };

    var TXT_PESQUISA_DESCRICAO_PRODUTO = new Ext.form.TextField({
        width: 320,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '50', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialKey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_TB_PRODUTO();
                }
            }
        }
    });

    var BTN_PESQUISA_PRODUTO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () { Carrega_Busca_TB_PRODUTO(); }
    });

    this.TITULO_BUSCA = function (pTITULO) {
        fsBuscaProduto.setTitle(pTITULO);
    };

    var fsBuscaProduto = new Ext.form.FieldSet({
        title: '',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                TXT_PESQUISA_DESCRICAO_PRODUTO.focus();
                _formulario.setHeight(375);
            },
            collapse: function (f) {
                _formulario.setHeight(299);
            }
        }
    });

    var Store_PESQUISA_PRODUTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'PRECO_PRODUTO', 'ALIQ_IPI_PRODUTO', 'UNIDADE_MEDIDA_VENDA',
         'MARKUP_PRODUTO', 'MARGEM_MINIMA_PRODUTO', 'CLAS_FISCAL_PRODUTO', 'SIT_TRIB_PRODUTO', 'ICMS_DIF_PRODUTO',
         'SALDO_ESTOQUE', 'SAIDA_ESTOQUE', 'ENTRADA_ESTOQUE', 'PESO_PRODUTO'])
    });

    var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
        store: Store_PESQUISA_PRODUTO,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;ão", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'SALDO_ESTOQUE', header: "Estoque", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE', renderer: Saldo_Estoque, align: 'center' },
                { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o de Venda", width: 100, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4 },
                { id: 'MARKUP_PRODUTO', header: "% Markup", width: 90, sortable: true, dataIndex: 'MARKUP_PRODUTO', renderer: FormataPercentual },
                { id: 'MARGEM_MINIMA_PRODUTO', header: "Margem M&iacute;nima", width: 90, sortable: true, dataIndex: 'MARGEM_MINIMA_PRODUTO', renderer: FormataPercentual },
                { id: 'CLAS_FISCAL_PRODUTO', header: "Clas.Fiscal", width: 90, sortable: true, dataIndex: 'CLAS_FISCAL_PRODUTO' },
                { id: 'SIT_TRIB_PRODUTO', header: "Sit.Trib.", width: 70, sortable: true, dataIndex: 'SIT_TRIB_PRODUTO' },
                { id: 'ICMS_DIF_PRODUTO', header: "% ICMS Dif.", width: 80, sortable: true, dataIndex: 'ICMS_DIF_PRODUTO' },
                { id: 'ALIQ_IPI_PRODUTO', header: "Al&iacute;q. IPI", width: 70, sortable: true, dataIndex: 'ALIQ_IPI_PRODUTO', renderer: FormataPercentual },
                { id: 'UNIDADE_MEDIDA_VENDA', header: "Unidade", width: 60, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' }
            ],
        stripeRows: true,
        width: '100%',
        height: 130,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (GRID_PESQUISA_PRODUTO.getSelectionModel().getSelections().length > 0) {
                        _record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();
                        var x = _ACAO_POPULAR_PRODUTO(_record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                _record = grid.getStore().getAt(rowIndex);
                var x = _ACAO_POPULAR_PRODUTO(_record);
            }
        }
    });

    function RetornaFiltros_TB_PRODUTO_JsonData() {
        var _pesquisa = TXT_PESQUISA_DESCRICAO_PRODUTO ?
                            TXT_PESQUISA_DESCRICAO_PRODUTO.getValue() : '';

        var TB_PRODUTO_JsonData = {
            Pesquisa: _pesquisa,
            SOMENTE_PRODUTO_ACABADO: true,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_PRODUTO.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO);

    function Carrega_Busca_TB_PRODUTO() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    fsBuscaProduto.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Descrição do Produto:'
            }, {
                columnWidth: .31,
                items: [TXT_PESQUISA_DESCRICAO_PRODUTO]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [BTN_PESQUISA_PRODUTO]
            }]
        }, GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar()]
    });

    this.fieldSet = function () {
        return fsBuscaProduto;
    };
}

function Pesquisa_Beneficiamento() {
    var _Grid;

    this.Grid = function (pGrid) {
        _Grid = pGrid;
    };

    var _ACAO;

    this.ACAO_FORMULARIO = function (pACAO) {
        _ACAO = pACAO;
    };

    function Retorna_JsonData() {
        var CLAS_FISCAL_JsonData = {
            ANO_LOTE: TXT_ANO_LOTE.getValue(),
            NUMERO_LOTE: TXT_NUMERO_LOTE.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    function BuscaPorLote() {
        _Grid.setUrl('servicos/TB_BENEFICIAMENTO.asmx/BuscaPorLote');
        _Grid.setParamsJsonData(Retorna_JsonData());
        _Grid.doRequest();

        _ACAO();
    }

    var TXT_ANO_LOTE = new Ext.form.NumberField({
        fieldLabel: 'Ano',
        decimalPrecision: 0,
        width: 40,
        maxLength: 4,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '4' }
    });

    var TXT_NUMERO_LOTE = new Ext.form.NumberField({
        fieldLabel: 'Nr. do Lote',
        decimalPrecision: 0,
        width: 150,
        maxLength: 18,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18' }
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function () {
            BuscaPorLote();
        }
    });

    var formPESQUISA = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 70,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ANO_LOTE]
            }, {
                columnWidth: .50,
                layout: 'form',
                items: [TXT_NUMERO_LOTE]
            }, {
                columnWidth: .30,
                layout: 'form',
                items: [BTN_PESQUISA]
            }]
        }]
    });

    var wBUSCA_FORNECEDOR = new Ext.Window({
        layout: 'form',
        title: 'Busca por Nr. de Lote',
        iconCls: 'icone_BENEFICIAMENTO',
        width: 360,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [formPESQUISA],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        wBUSCA_FORNECEDOR.show(elm);
        TXT_NUMERO_LOTE.focus();
    };
}