var combo_TB_STATUS_PEDIDO_COMPRA = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_FONTE_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
        direction: 'ASC'
    }
});

function TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_PEDIDO_COMPRA.asmx/Lista_TB_STATUS_PEDIDO');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_PEDIDO_COMPRA.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_STATUS_PEDIDO_COMPRA_INDEFINIDO = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_FONTE_STATUS_PEDIDO_COMPRA']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
        direction: 'ASC'
    }
});

function TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO_INDEFINIDO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_PEDIDO_COMPRA.asmx/Lista_TB_STATUS_PEDIDO_INDEFINIDO');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_PEDIDO_COMPRA_INDEFINIDO.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroStatus_Compra() {

    var TXT_CODIGO_STATUS_COMPRA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'CODIGO_STATUS_COMPRA',
        id: 'CODIGO_STATUS_COMPRA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_STATUS_PEDIDO_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
        id: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
        allowBlank: false,
        msgTarget: 'side',
        width: 350,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 40 }
    });

    var TXT_COR_STATUS_PEDIDO_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Cor de Fundo',
        width: 70,
        name: 'COR_STATUS_PEDIDO_COMPRA',
        id: 'COR_STATUS_PEDIDO_COMPRA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false
    });

    var TXT_COR_FONTE_STATUS_PEDIDO_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Cor da Letra',
        width: 70,
        name: 'COR_FONTE_STATUS_PEDIDO_COMPRA',
        id: 'COR_FONTE_STATUS_PEDIDO_COMPRA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false
    });

    var COR1 = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                Ext.getCmp('COR_STATUS_PEDIDO_COMPRA').setValue("#" + color);

                var corFonte = Ext.getCmp('COR_FONTE_STATUS_PEDIDO_COMPRA').getValue();

                if (corFonte.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: #" + color + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS_PEDIDO_COMPRA').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var COR2 = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                Ext.getCmp('COR_FONTE_STATUS_PEDIDO_COMPRA').setValue("#" + color);

                var corFundo = Ext.getCmp('COR_STATUS_PEDIDO_COMPRA').getValue();

                if (corFundo.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: #" + color + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS_PEDIDO_COMPRA').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var LBL_EXEMPLO = new Ext.form.Label();

    var CB_NAO_CANCELAR_PEDIDO_COMPRA = new Ext.form.Checkbox({
        boxLabel: 'N&atilde;o permitir o cancelamento do pedido neste status',
        name: 'NAO_CANCELAR_PEDIDO_COMPRA',
        id: 'NAO_CANCELAR_PEDIDO_COMPRA'
    });

    var CB_STATUS_ESPECIFICO_ITEM_COMPRA = new Ext.form.ComboBox({
        fieldLabel: 'Status Espec&iacute;fico',
        id: 'STATUS_ESPECIFICO_ITEM_COMPRA',
        name: 'STATUS_ESPECIFICO_ITEM_COMPRA',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'INDEFINIDO'], [1, 'COTAÇÃO'], [2, 'PEDIDO DE COMPRA'], [3, 'ENTREGUE PARCIAL'],
            [4, 'ENTREGUE TOTAL'], [5, 'CANCELADO'], [6, 'PEDIDO CONFIRMADO'], [7, 'PEDIDO EM ANÁLISE']]
        })
    });

    var TXT_SENHA_STATUS_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Senha colocar o pedido neste status',
        name: 'SENHA_STATUS_ITEM_COMPRA',
        id: 'SENHA_STATUS_ITEM_COMPRA',
        width: 120,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: 10 }
    });

    var formSTATUS_PEDIDO_COMPRA = new Ext.FormPanel({
        id: 'formSTATUS_PEDIDO_COMPRA',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 340,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_CODIGO_STATUS_COMPRA]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_DESCRICAO_STATUS_PEDIDO_COMPRA]
            }]
        }, {
            columnWidth: 0.37,
            layout: 'form',
            items: [CB_NAO_CANCELAR_PEDIDO_COMPRA]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .37,
                layout: 'form',
                items: [CB_STATUS_ESPECIFICO_ITEM_COMPRA]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_SENHA_STATUS_ITEM_COMPRA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .25,
                layout: 'form',
                items: [TXT_COR_STATUS_PEDIDO_COMPRA]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [TXT_COR_FONTE_STATUS_PEDIDO_COMPRA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .25,
                layout: 'form',
                items: [COR1]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [COR2]
            }]
        }, {
            items: [LBL_EXEMPLO]
        }]
    });

    function PopulaFormulario_TB_STATUS_PEDIDO(record) {
        formSTATUS_PEDIDO_COMPRA.getForm().loadRecord(record);
        Ext.getCmp('SENHA_STATUS_ITEM_COMPRA').reset();

        Ext.getCmp('NAO_CANCELAR_PEDIDO_COMPRA').setValue(record.data.NAO_CANCELAR_PEDIDO_COMPRA == 1 ? true : false);
        Ext.getCmp('STATUS_ESPECIFICO_ITEM_COMPRA').setValue(record.data.STATUS_ESPECIFICO_ITEM_COMPRA);

        panelCadastroSTATUS.setTitle('Alterar dados do Status');

        buttonGroup_TB_STATUS_PEDIDO.items.items[32].enable();
        formSTATUS_PEDIDO_COMPRA.getForm().items.items[0].disable();

        formSTATUS_PEDIDO_COMPRA.getForm().findField('DESCRICAO_STATUS_PEDIDO_COMPRA').focus();

        var corFundo = record.data.COR_STATUS_PEDIDO_COMPRA;
        var corFonte = record.data.COR_FONTE_STATUS_PEDIDO_COMPRA;

        var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                                Ext.getCmp('DESCRICAO_STATUS_PEDIDO_COMPRA').getValue() + "</div>";

        LBL_EXEMPLO.setText(exemplo, false);

        Ext.getCmp('BTN_RESETAR_SENHA_STATUS_COMPRA').enable();
    }

    var TB_STATUS_PEDIDO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['CODIGO_STATUS_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA', 'COR_FONTE_STATUS_PEDIDO_COMPRA',
                    'NAO_IMPRIMIR_PEDIDO', 'NAO_CANCELAR_PEDIDO_COMPRA', 'SENHA_STATUS_ITEM_COMPRA', 'STATUS_ESPECIFICO_ITEM_COMPRA']
                    )
    });

    function STATUS_ESPECIFICO_ITEM_COMPRA(val) {
        if (val == 0) {
            return "INDEFINIDO";
        }
        else if (val == 1) {
            return "COTAÇÃO";
        }
        else if (val == 2) {
            return "PEDIDO DE COMPRA";
        }
        else if (val == 3) {
            return "ENTREGUE PARCIAL";
        }
        else if (val == 4) {
            return "ENTREGUE TOTAL";
        }
        else if (val == 5) {
            return "CANCELADO";
        }
        else if (val == 6) {
            return "PEDIDO CONFIRMADO";
        }
        else if (val == 7) {
            return "PEDIDO EM ANÁLISE";
        }
    }

    var gridSTATUS_COMPRA = new Ext.grid.GridPanel({
        id: 'gridSTATUS_COMPRA',
        store: TB_STATUS_PEDIDO_Store,
        columns: [
                    { id: 'CODIGO_STATUS_COMPRA', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'CODIGO_STATUS_COMPRA' },
                    { id: 'DESCRICAO_STATUS_PEDIDO_COMPRA', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO_COMPRA', renderer: status_pedido_compra },
                    { id: 'COR_STATUS_PEDIDO_COMPRA', header: "Cor de Fundo", width: 90, sortable: true, dataIndex: 'COR_STATUS_PEDIDO_COMPRA' },
                    { id: 'COR_FONTE_STATUS_PEDIDO_COMPRA', header: "Cor da Fonte", width: 90, sortable: true, dataIndex: 'COR_FONTE_STATUS_PEDIDO_COMPRA' },
                    { id: 'NAO_CANCELAR_PEDIDO_COMPRA', header: "Cancelamento Bloqueado", width: 140, sortable: true, dataIndex: 'NAO_CANCELAR_PEDIDO_COMPRA', renderer: TrataCombo01 },
                    { id: 'STATUS_ESPECIFICO_ITEM_COMPRA', header: "Status Espec&iacute;fico", width: 160, sortable: true, dataIndex: 'STATUS_ESPECIFICO_ITEM_COMPRA', renderer: STATUS_ESPECIFICO_ITEM_COMPRA }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridSTATUS_COMPRA.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_STATUS_PEDIDO(record);
    });

    gridSTATUS_COMPRA.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridSTATUS_COMPRA.getSelectionModel().getSelections().length > 0) {
                var record = gridSTATUS_COMPRA.getSelectionModel().getSelected();
                PopulaFormulario_TB_STATUS_PEDIDO(record);
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

    var STATUS_PagingToolbar = new Th2_PagingToolbar();
    STATUS_PagingToolbar.setUrl('servicos/TB_STATUS_PEDIDO_COMPRA.asmx/Carrega_STATUS');
    STATUS_PagingToolbar.setStore(TB_STATUS_PEDIDO_Store);

    function TB_STATUS_CARREGA_GRID() {
        STATUS_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        STATUS_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_STATUS_PEDIDO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_STATUS_PEDIDO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Status de Pedido',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_STATUS_PEDIDO.items.items[32].disable();

                                    formSTATUS_PEDIDO_COMPRA.getForm().items.items[0].enable();

                                    formSTATUS_PEDIDO_COMPRA.getForm().findField('DESCRICAO_STATUS_PEDIDO_COMPRA').focus();
                                    formSTATUS_PEDIDO_COMPRA.getForm().reset();
                                    panelCadastroSTATUS.setTitle('Novo Status de Pedido');

                                    LBL_EXEMPLO.setText("");

                                    Ext.getCmp('BTN_RESETAR_SENHA_STATUS_COMPRA').disable();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_STATUS_COMPRA',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_CUSTO();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_RESETAR_SENHA_STATUS_COMPRA',
                                 text: 'Resetar Senha',
                                 icon: 'imagens/icones/unlock_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     var _ajax = new Th2_Ajax();
                                     _ajax.setUrl('servicos/TB_STATUS_PEDIDO_COMPRA.asmx/ResetaSenha');
                                     _ajax.setJsonData({ 
                                        CODIGO_STATUS_COMPRA: Ext.getCmp('CODIGO_STATUS_COMPRA').getValue(),
                                        ID_USUARIO: _ID_USUARIO
                                    });

                                     var _sucess = function (response, options) {
                                         dialog.MensagemDeAlerta('A senha para este status de pedido foi resetada com sucesso');
                                     };

                                     _ajax.setSucesso(_sucess);
                                     _ajax.Request();

                                 }
                             }]
    });

    var toolbar_TB_STATUS = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_STATUS_PEDIDO]
    });

    var panelCadastroSTATUS = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Status de Pedido',
        items: [formSTATUS_PEDIDO_COMPRA, toolbar_TB_STATUS, gridSTATUS_COMPRA, STATUS_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_STATUS_PEDIDO() {
        if (!formSTATUS_PEDIDO_COMPRA.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_STATUS_COMPRA: formSTATUS_PEDIDO_COMPRA.getForm().findField('CODIGO_STATUS_COMPRA').getValue(),
            DESCRICAO_STATUS_PEDIDO_COMPRA: formSTATUS_PEDIDO_COMPRA.getForm().findField('DESCRICAO_STATUS_PEDIDO_COMPRA').getValue(),
            COR_STATUS_PEDIDO_COMPRA: Ext.getCmp('COR_STATUS_PEDIDO_COMPRA').getValue(),
            COR_FONTE_STATUS_PEDIDO_COMPRA: Ext.getCmp('COR_FONTE_STATUS_PEDIDO_COMPRA').getValue(),
            NAO_CANCELAR_PEDIDO_COMPRA: Ext.getCmp('NAO_CANCELAR_PEDIDO_COMPRA').checked ? 1 : 0,
            SENHA_STATUS_ITEM_COMPRA: Ext.getCmp('SENHA_STATUS_ITEM_COMPRA').getValue(),
            STATUS_ESPECIFICO_ITEM_COMPRA: Ext.getCmp('STATUS_ESPECIFICO_ITEM_COMPRA').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroSTATUS.title == "Novo Status de Pedido" ?
                                'servicos/TB_STATUS_PEDIDO_COMPRA.asmx/GravaNovoStatus' :
                                'servicos/TB_STATUS_PEDIDO_COMPRA.asmx/AtualizaStatus';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroSTATUS.title == "Novo Status de Pedido") {
                formSTATUS_PEDIDO_COMPRA.getForm().reset();
                LBL_EXEMPLO.setText("");
            }

            formSTATUS_PEDIDO_COMPRA.getForm().findField('DESCRICAO_STATUS_PEDIDO_COMPRA').focus();

            TB_STATUS_CARREGA_GRID();
            TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_CUSTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Status de Pedido?', 'formSTATUS_PEDIDO_COMPRA', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_STATUS_PEDIDO_COMPRA.asmx/DeletaStatus');
                _ajax.setJsonData({ 
                    CODIGO_STATUS_COMPRA: Ext.getCmp('CODIGO_STATUS_COMPRA').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroSTATUS.setTitle("Novo Status de Pedido");
                    Ext.getCmp('DESCRICAO_STATUS_PEDIDO_COMPRA').focus();
                    formSTATUS_PEDIDO_COMPRA.getForm().reset();
                    LBL_EXEMPLO.setText("");

                    buttonGroup_TB_STATUS_PEDIDO.items.items[32].disable();
                    formSTATUS_PEDIDO_COMPRA.getForm().items.items[0].enable();

                    Ext.getCmp('BTN_RESETAR_SENHA_STATUS_COMPRA').disable();

                    TB_STATUS_CARREGA_GRID();
                    TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    // TabPanel
    var _alcada = new MontaAlcada();

    var tabPanel1 = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,

        items: [{
            title: 'Posi&ccedil;&atilde;o pedido de compra',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_STATUS_COMPRA',
            items: [panelCadastroSTATUS]
        }, {
            title: 'Al&ccedil;ada de aprova&ccedil;&atilde;o',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_USUARIO'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {

                if (panel.title == 'Al&ccedil;ada de aprova&ccedil;&atilde;o') {

                    if (TXT_CODIGO_STATUS_COMPRA.getValue() == '') {
                        dialog.MensagemDeAlerta('Selecione um status de pedido para consultar / alterar a al&ccedil;ada de aprova&ccedil;&atilde;o',
                            TXT_CODIGO_STATUS_COMPRA.getId());

                        tabPanel.setActiveTab(0);
                        return;
                    }

                    if (panel.items.length == 0) {
                        panel.add(_alcada.panel());
                        panel.doLayout();
                    }

                    _alcada.CODIGO_STATUS_COMPRA(TXT_CODIGO_STATUS_COMPRA.getValue());
                    _alcada.carregaGrid();
                }
            }
        }
    });

    ///

    gridSTATUS_COMPRA.setHeight(AlturaDoPainelDeConteudo(493));

    TB_STATUS_CARREGA_GRID();

    return tabPanel1;
}

function MontaAlcada() {

    var _CODIGO_STATUS_COMPRA;

    this.CODIGO_STATUS_COMPRA = function (pValue) {
        _CODIGO_STATUS_COMPRA = pValue;
    };

    var combo_USUARIOS = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Usu&aacute;rio',
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 120
    });

    TH2_CARREGA_USUARIOS();

    var TXT_VALOR_MAXIMO_APROVACAO = new Ext.form.NumberField({
        fieldLabel: 'Valor m&aacute;ximo de aprova&ccedil;&atilde;o',
        width: 110,
        decimalPrecision: 2,
        minValue: 0.00,
        allowBlank: false
    });

    var form1 = new Ext.FormPanel({
        id: 'form1',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        autoHeight: true,
        height: 210,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                items: [combo_USUARIOS]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_VALOR_MAXIMO_APROVACAO]
            }]
        }]
    });

    function resetaFormulario() {
        combo_USUARIOS.reset();
        TXT_VALOR_MAXIMO_APROVACAO.reset();
    }

    function PopulaFormulario(record) {
        combo_USUARIOS.setValue(record.data.ID_USUARIO);
        TXT_VALOR_MAXIMO_APROVACAO.setValue(record.data.VALOR_MAXIMO_APROVACAO);

        panelCadastro.setTitle('Alterar dados da Al&cedil;ada');

        buttonGroup1.items.items[32].enable();
        combo_USUARIOS.disable();

        TXT_VALOR_MAXIMO_APROVACAO.focus();
    }

    var Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['CODIGO_STATUS_COMPRA', 'ID_USUARIO', 'LOGIN_USUARIO', 'VALOR_MAXIMO_APROVACAO']
        )
    });

    var grid1 = new Ext.grid.GridPanel({
        store: Store1,
        columns: [
        { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' },
        { id: 'VALOR_MAXIMO_APROVACAO', header: "Valor m&aacute;ximo", width: 130, sortable: true, dataIndex: 'VALOR_MAXIMO_APROVACAO',
            renderer: FormataValor, align: 'right'
        }],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    grid1.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario(record);
    });

    grid1.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (grid1.getSelectionModel().getSelections().length > 0) {
                var record = grid1.getSelectionModel().getSelected();
                PopulaFormulario(record);
            }
        }
    });

    var BTN_TB_VENDEDOR_COMISSAO_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_ALCADA_CARREGA_GRID();
        }
    });

    function RetornaCOMISSAO_JsonData() {
        var VEICULO_JsonData = {
            CODIGO_STATUS_COMPRA: _CODIGO_STATUS_COMPRA,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao,
            ID_USUARIO: _ID_USUARIO
        };

        return VEICULO_JsonData;
    }

    var PagingToolbar1 = new Th2_PagingToolbar();
    PagingToolbar1.setUrl('servicos/TB_ALCADA.asmx/Carrega_Alcada');
    PagingToolbar1.setStore(Store1);

    function TB_ALCADA_CARREGA_GRID() {
        PagingToolbar1.setParamsJsonData(RetornaCOMISSAO_JsonData());
        PagingToolbar1.doRequest();
    }

    ///////////////////////////
    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova al&ccedil;ada',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup1.items.items[32].disable();

                                    form1.getForm().items.items[1].enable();

                                    resetaFormulario();
                                    panelCadastro.setTitle('Nova al&ccedil;ada');

                                    combo_USUARIOS.enable();
                                    combo_USUARIOS.focus();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_ALCADA();
                                 }
                             }]
    });

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastro = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Nova al&ccedil;ada',
        items: [form1, toolbar1, grid1, PagingToolbar1.PagingToolbar()]
    });

    function GravaDados() {
        if (!form1.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_STATUS_COMPRA: _CODIGO_STATUS_COMPRA,
            ID_USUARIO: combo_USUARIOS.getValue(),
            VALOR_MAXIMO_APROVACAO: TXT_VALOR_MAXIMO_APROVACAO.getValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        };

        var Url = panelCadastro.title == "Nova al&ccedil;ada" ?
                        'servicos/TB_ALCADA.asmx/GravaNovaAlcada' :
                        'servicos/TB_ALCADA.asmx/AtualizaAlcada';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastro.title == "Nova al&ccedil;ada") {
                resetaFormulario();
                combo_USUARIOS
                TB_ALCADA_CARREGA_GRID();
            }
            else {
                TB_ALCADA_CARREGA_GRID();
                TXT_VALOR_MAXIMO_APROVACAO.focus();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_ALCADA() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta al&ccedil;ada?', form1.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var dados = {
                    CODIGO_STATUS_COMPRA: _CODIGO_STATUS_COMPRA,
                    ID_USUARIO: combo_USUARIOS.getValue(),
                    ID_USUARIO_ORIGINAL: _ID_USUARIO
                };

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ALCADA.asmx/DeletaAlcada');
                _ajax.setJsonData(dados);

                var _sucess = function (response, options) {
                    panelCadastro.setTitle("Nova al&ccedil;ada");

                    resetaFormulario();

                    buttonGroup1.items.items[32].disable();
                    combo_USUARIOS.focus();

                    TB_ALCADA_CARREGA_GRID();

                    combo_USUARIOS.focus();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    grid1.setHeight(AlturaDoPainelDeConteudo(219));

    this.panel = function () {
        return panelCadastro;
    };

    this.carregaGrid = function () {
        TB_ALCADA_CARREGA_GRID();
    };
}