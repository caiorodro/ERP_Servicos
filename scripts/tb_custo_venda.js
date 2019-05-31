var combo_TB_CUSTO_VENDA = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_CUSTO_VENDA', 'DESCRICAO_CUSTO_VENDA', 'CUSTO_PERMANENTE']
       )
});

function TB_CUSTO_VENDA_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Lista_Custo_Venda');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_CUSTO_VENDA.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroCusto() {

    var TXT_ID_CUSTO_VENDA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_CUSTO_VENDA',
        id: 'ID_CUSTO_VENDA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_CUSTO_VENDA = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_CUSTO_VENDA',
        id: 'DESCRICAO_CUSTO_VENDA',
        allowBlank: false,
        msgTarget: 'side',
        width: 350,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 40 }
    });

    var CB_CUSTO_PERMANENTE = new Ext.form.ComboBox({
        fieldLabel: 'Custo Permanente',
        id: 'CUSTO_PERMANENTE',
        name: 'CUSTO_PERMANENTE',
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
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[1, 'Sim'], [0, 'Não']]
        })
    });

    var TXT_PERCENTUAL_CUSTO_PERMANENTE = new Ext.form.NumberField({
        fieldLabel: '% Custo Permanente',
        width: 70,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        value: 0.00,
        allowBlank: false,
        msgTarget: 'side',
        name: 'PERCENTUAL_CUSTO_PERMANENTE',
        id: 'PERCENTUAL_CUSTO_PERMANENTE',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_CUSTO();
                }
            }
        }
    });

    var formCUSTO_VENDA = new Ext.FormPanel({
        id: 'formCUSTO_VENDA',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 210,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Custos de Venda',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_ID_CUSTO_VENDA]
            }, {
                layout: 'form',
                items: [TXT_DESCRICAO_CUSTO_VENDA]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .15,
                    layout: 'form',
                    items: [CB_CUSTO_PERMANENTE]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_PERCENTUAL_CUSTO_PERMANENTE]
                }]

            }]
        }]
    });

    function PopulaFormulario_TB_CUSTO_VENDA(record) {
        formCUSTO_VENDA.getForm().loadRecord(record);
        panelCadastroCUSTO.setTitle('Alterar dados do Custo');

        buttonGroup_TB_CUSTO_VENDA.items.items[32].enable();
        formCUSTO_VENDA.getForm().items.items[0].disable();

        formCUSTO_VENDA.getForm().findField('DESCRICAO_CUSTO_VENDA').focus();
    }

    var TB_CUSTO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ID_CUSTO_VENDA', 'DESCRICAO_CUSTO_VENDA', 'CUSTO_PERMANENTE', 'PERCENTUAL_CUSTO_PERMANENTE']
        )
    });

    var gridCUSTO = new Ext.grid.GridPanel({
        id: 'gridCUSTO',
        store: TB_CUSTO_VENDA_Store,
        columns: [
            { id: 'ID_CUSTO_VENDA', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_CUSTO_VENDA' },
            { id: 'DESCRICAO_CUSTO_VENDA', header: "Descri&ccedil;&atilde;o", width: 350, sortable: true, dataIndex: 'DESCRICAO_CUSTO_VENDA' },
            { id: 'CUSTO_PERMANENTE', header: "Custo Permanente", width: 110, sortable: true, dataIndex: 'CUSTO_PERMANENTE', renderer: TrataCombo01 },
            { id: 'PERCENTUAL_CUSTO_PERMANENTE', header: "% Custo Permanente", width: 120, sortable: true, dataIndex: 'PERCENTUAL_CUSTO_PERMANENTE', renderer: FormataPercentual }
                    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(336),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridCUSTO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_CUSTO_VENDA(record);
    });

    gridCUSTO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridCUSTO.getSelectionModel().getSelections().length > 0) {
                var record = gridCUSTO.getSelectionModel().getSelected();
                PopulaFormulario_TB_CUSTO_VENDA(record);
            }
        }
    });

    function RetornaVENDA_JsonData() {
        var CLAS_FISCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var LIMITE_PagingToolbar = new Th2_PagingToolbar();
    LIMITE_PagingToolbar.setUrl('servicos/TB_CUSTO_VENDA.asmx/Carrega_Custo_Venda');
    LIMITE_PagingToolbar.setStore(TB_CUSTO_VENDA_Store);

    function TB_CUSTO_CARREGA_GRID() {
        LIMITE_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        LIMITE_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_CUSTO_VENDA = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_CUSTO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Custo de Venda',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_CUSTO_VENDA.items.items[32].disable();

                                    formCUSTO_VENDA.getForm().items.items[0].enable();

                                    formCUSTO_VENDA.getForm().findField('DESCRICAO_CUSTO_VENDA').focus();
                                    formCUSTO_VENDA.getForm().reset();
                                    panelCadastroCUSTO.setTitle('Novo Custo de Venda');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_CUSTO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_CUSTO();
                                 }
                             }]
    });

    var toolbar_TB_LIMITE = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_CUSTO_VENDA]
    });

    var panelCadastroCUSTO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Custo de Venda',
        items: [formCUSTO_VENDA, toolbar_TB_LIMITE, gridCUSTO, LIMITE_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_CUSTO() {
        if (!formCUSTO_VENDA.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_CUSTO_VENDA: formCUSTO_VENDA.getForm().findField('ID_CUSTO_VENDA').getValue(),
            DESCRICAO_CUSTO_VENDA: formCUSTO_VENDA.getForm().findField('DESCRICAO_CUSTO_VENDA').getValue(),
            CUSTO_PERMANENTE: Ext.getCmp('CUSTO_PERMANENTE').getValue(),
            PERCENTUAL_CUSTO_PERMANENTE: Ext.getCmp('PERCENTUAL_CUSTO_PERMANENTE').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroCUSTO.title == "Novo Custo de Venda" ?
                        'servicos/TB_CUSTO_VENDA.asmx/GravaNovoCusto' :
                        'servicos/TB_CUSTO_VENDA.asmx/AtualizaCusto';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCUSTO.title == "Novo Custo de Venda") {
                formCUSTO_VENDA.getForm().reset();
            }

            formCUSTO_VENDA.getForm().findField('DESCRICAO_CUSTO_VENDA').focus();

            TB_CUSTO_CARREGA_GRID();
            TB_CUSTO_VENDA_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_CUSTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Custo de Venda?', 'formCUSTO_VENDA', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/DeletaCusto');
                _ajax.setJsonData({ ID_CUSTO_VENDA: formCUSTO_VENDA.getForm().findField('ID_CUSTO_VENDA').getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    panelCadastroCUSTO.setTitle("Novo Custo de Venda");
                    Ext.getCmp('DESCRICAO_CUSTO_VENDA').focus();
                    formCUSTO_VENDA.getForm().reset();

                    buttonGroup_TB_CUSTO_VENDA.items.items[32].disable();
                    formCUSTO_VENDA.getForm().items.items[0].enable();

                    TB_CUSTO_CARREGA_GRID();
                    TB_CUSTO_VENDA_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    TB_CUSTO_CARREGA_GRID();

    return panelCadastroCUSTO;
}
