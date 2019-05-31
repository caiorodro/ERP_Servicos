var combo_TB_STATUS_PEDIDO = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_FONTE_STATUS', 'COR_STATUS']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS_PEDIDO',
        direction: 'ASC'
    }
});

function TB_STATUS_PEDIDO_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_PEDIDO.asmx/Lista_TB_STATUS_PEDIDO');
    _ajax.setJsonData({
        GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
        ADMIN_USUARIO: _ADMIN_USUARIO,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_PEDIDO.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_STATUS_PEDIDO2 = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_FONTE_STATUS', 'COR_STATUS']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS_PEDIDO',
        direction: 'ASC'
    }
});

function TB_STATUS_PEDIDO_CARREGA_COMBO2() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_PEDIDO.asmx/Lista_TB_STATUS_PEDIDO');
    _ajax.setJsonData({
        GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
        ADMIN_USUARIO: _ADMIN_USUARIO,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_PEDIDO2.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroStatus() {

    var TXT_CODIGO_STATUS_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'CODIGO_STATUS_PEDIDO',
        id: 'CODIGO_STATUS_PEDIDO',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_STATUS_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_STATUS_PEDIDO',
        id: 'DESCRICAO_STATUS_PEDIDO',
        allowBlank: false,
        msgTarget: 'side',
        width: 350,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 40 }
    });

    var TXT_COR_STATUS = new Ext.form.TextField({
        fieldLabel: 'Cor de Fundo',
        width: 70,
        name: 'COR_STATUS',
        id: 'COR_STATUS',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_COR_FONTE_STATUS = new Ext.form.TextField({
        fieldLabel: 'Cor da Letra',
        width: 70,
        name: 'COR_FONTE_STATUS',
        id: 'COR_FONTE_STATUS',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var COR1 = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                Ext.getCmp('COR_STATUS').setValue("#" + color);

                var corFonte = Ext.getCmp('COR_FONTE_STATUS').getValue();

                if (corFonte.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: #" + color + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS_PEDIDO').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var COR2 = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                Ext.getCmp('COR_FONTE_STATUS').setValue("#" + color);

                var corFundo = Ext.getCmp('COR_STATUS').getValue();

                if (corFundo.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: #" + color + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS_PEDIDO').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var LBL_EXEMPLO = new Ext.form.Label();

    var CB_NAO_IMPRIMIR_PEDIDO = new Ext.form.Checkbox({
        boxLabel: 'N&atilde;o permitir impress&atilde;o do pedido neste status',
        name: 'NAO_IMPRIMIR_PEDIDO',
        id: 'NAO_IMPRIMIR_PEDIDO'
    });

    var CB_NAO_CANCELAR_PEDIDO = new Ext.form.Checkbox({
        boxLabel: 'N&atilde;o permitir o cancelamento do pedido neste status',
        name: 'NAO_CANCELAR_PEDIDO',
        id: 'NAO_CANCELAR_PEDIDO'
    });

    var CB_STATUS_ESPECIFICO = new Ext.form.ComboBox({
        fieldLabel: 'Status Espec&iacute;fico',
        id: 'STATUS_ESPECIFICO',
        name: 'STATUS_ESPECIFICO',
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
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'INDEFINIDO'], [1, 'PEDIDO EM ANALISE'], [2, 'PARCIALMENTE FATURADO'], [3, 'TOTALMENTE FATURADO'],
            [4, 'PEDIDO CANCELADO'], [5, 'LIBERADO P/ FATURAR'], [6, 'PROGRAMAÇÃO'], [7, 'ORDEM DE COMPRA'], [8, 'BENEFICIAMENTO'],
            [9, 'PRE-FATURAMENTO'], [10, 'MERCADORIA RECEBIDA']]
        })
    });

    var CB_INICIO_FIM_DE_FASE = new Ext.form.ComboBox({
        fieldLabel: 'In&iacute;cio / fim de fase',
        id: 'INICIO_FIM_DE_FASE',
        name: 'INICIO_FIM_DE_FASE',
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
            data: [[0, 'FASE INTERMEDIÁRIA'], [1, 'INÍCIO DE COMPRAS'], [2, 'INÍCIO DE ANÁLISE DE ESTOQUE'],
                    [3, 'INÍCIO DE BENEFICIAMENTO'], [4, 'INÍCIO DE SEPARAÇÃO'],
                    [5, 'INÍCIO DE FATURAMENTO'], [6, 'PROCESSO DE COMPRAS']]
        })
    });

    var CB_APARECE_NO_PORTAL_DE_CLIENTE = new Ext.form.ComboBox({
        fieldLabel: 'Deve aparecer no portal de cliente',
        id: 'APARECE_NO_PORTAL_DE_CLIENTE',
        name: 'APARECE_NO_PORTAL_DE_CLIENTE',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 90,
        allowBlank: false,
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var TXT_SENHA_STATUS_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'Definir senha para mudar o pedido neste status',
        name: 'SENHA_STATUS_PEDIDO',
        id: 'SENHA_STATUS_PEDIDO',
        width: 120,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: 10 }
    });

    var formSTATUS_PEDIDO = new Ext.FormPanel({
        id: 'formSTATUS_PEDIDO',
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
                items: [TXT_CODIGO_STATUS_PEDIDO]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_DESCRICAO_STATUS_PEDIDO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.37,
                layout: 'form',
                items: [CB_NAO_IMPRIMIR_PEDIDO]
            }, {
                columnWidth: 0.40,
                layout: 'form',
                items: [CB_NAO_CANCELAR_PEDIDO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .37,
                layout: 'form',
                items: [CB_STATUS_ESPECIFICO]
            }, {
                columnWidth: .37,
                layout: 'form',
                items: [TXT_SENHA_STATUS_PEDIDO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                items: [TXT_COR_STATUS]
            }, {
                columnWidth: .19,
                layout: 'form',
                items: [TXT_COR_FONTE_STATUS]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [CB_APARECE_NO_PORTAL_DE_CLIENTE]
            }, {
                columnWidth: .22,
                layout: 'form',
                items: [CB_INICIO_FIM_DE_FASE]
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
        formSTATUS_PEDIDO.getForm().loadRecord(record);
        Ext.getCmp('SENHA_STATUS_PEDIDO').reset();

        Ext.getCmp('NAO_IMPRIMIR_PEDIDO').setValue(record.data.NAO_IMPRIMIR_PEDIDO == 1 ? true : false);
        Ext.getCmp('NAO_CANCELAR_PEDIDO').setValue(record.data.NAO_CANCELAR_PEDIDO == 1 ? true : false);
        Ext.getCmp('STATUS_ESPECIFICO').setValue(record.data.STATUS_ESPECIFICO);

        panelCadastroSTATUS.setTitle('Alterar dados do Status');

        buttonGroup_TB_STATUS_PEDIDO.items.items[32].enable();
        formSTATUS_PEDIDO.getForm().items.items[0].disable();

        formSTATUS_PEDIDO.getForm().findField('DESCRICAO_STATUS_PEDIDO').focus();

        var corFundo = record.data.COR_STATUS;
        var corFonte = record.data.COR_FONTE_STATUS;

        var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS_PEDIDO').getValue() + "</div>";

        LBL_EXEMPLO.setText(exemplo, false);

        Ext.getCmp('BTN_RESETAR_SENHA_STATUS').enable();
    }

    var TB_STATUS_PEDIDO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS',
                    'NAO_IMPRIMIR_PEDIDO', 'NAO_CANCELAR_PEDIDO', 'SENHA_STATUS_PEDIDO', 'STATUS_ESPECIFICO', 
                    'APARECE_NO_PORTAL_DE_CLIENTE', 'INICIO_FIM_DE_FASE']
                    )
    });

    function Status_Especifico(val) {
        if (val == 0) {
            return "INDEFINIDO";
        }
        else if (val == 1) {
            return "PEDIDO EM AN&Aacute;LISE";
        }
        else if (val == 2) {
            return "PARCIALMENTE FATURADO";
        }
        else if (val == 3) {
            return "TOTALMENTE FATURADO";
        }
        else if (val == 4) {
            return "PEDIDO CANCELADO";
        }
        else if (val == 5) {
            return "LIBERADO P/ FATURAR";
        }
        else if (val == 6) {
            return "PROGRAMA&Ccedil;&Atilde;O";
        }
        else if (val == 7) {
            return "ORDEM DE COMPRA";
        }
        else if (val == 8) {
            return "ORDEM DE COMPRA";
        }
        else if (val == 9) {
            return "PRE-FATURAMENTO";
        }
    }

    var gridSTATUS = new Ext.grid.GridPanel({
        id: 'gridSTATUS',
        store: TB_STATUS_PEDIDO_Store,
        columns: [
                    { id: 'CODIGO_STATUS_PEDIDO', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'CODIGO_STATUS_PEDIDO' },
                    { id: 'DESCRICAO_STATUS_PEDIDO', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO', renderer: status_pedido },
                    { id: 'COR_STATUS', header: "Cor de Fundo", width: 90, sortable: true, dataIndex: 'COR_STATUS' },
                    { id: 'COR_FONTE_STATUS', header: "Cor da Fonte", width: 90, sortable: true, dataIndex: 'COR_FONTE_STATUS' },
                    { id: 'NAO_IMPRIMIR_PEDIDO', header: "Impress&atilde;o Bloqueada", width: 140, sortable: true, dataIndex: 'NAO_IMPRIMIR_PEDIDO', renderer: TrataCombo01 },
                    { id: 'NAO_CANCELAR_PEDIDO', header: "Cancelamento Bloqueado", width: 140, sortable: true, dataIndex: 'NAO_CANCELAR_PEDIDO', renderer: TrataCombo01 },
                    { id: 'STATUS_ESPECIFICO', header: "Status Espec&iacute;fico", width: 160, sortable: true, dataIndex: 'STATUS_ESPECIFICO', renderer: Status_Especifico }
                    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(466),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridSTATUS.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_STATUS_PEDIDO(record);
    });

    gridSTATUS.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridSTATUS.getSelectionModel().getSelections().length > 0) {
                var record = gridSTATUS.getSelectionModel().getSelected();
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
    STATUS_PagingToolbar.setUrl('servicos/TB_STATUS_PEDIDO.asmx/Carrega_STATUS');
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

                                    formSTATUS_PEDIDO.getForm().items.items[0].enable();

                                    formSTATUS_PEDIDO.getForm().findField('DESCRICAO_STATUS_PEDIDO').focus();
                                    formSTATUS_PEDIDO.getForm().reset();
                                    panelCadastroSTATUS.setTitle('Novo Status de Pedido');

                                    LBL_EXEMPLO.setText("");

                                    Ext.getCmp('BTN_RESETAR_SENHA_STATUS').disable();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_STATUS',
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
                                 id: 'BTN_RESETAR_SENHA_STATUS',
                                 text: 'Resetar Senha',
                                 icon: 'imagens/icones/unlock_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     var _ajax = new Th2_Ajax();
                                     _ajax.setUrl('servicos/TB_STATUS_PEDIDO.asmx/ResetaSenha');
                                     _ajax.setJsonData({ 
                                        CODIGO_STATUS_PEDIDO: Ext.getCmp('CODIGO_STATUS_PEDIDO').getValue(),
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
        items: [formSTATUS_PEDIDO, toolbar_TB_STATUS, gridSTATUS, STATUS_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_STATUS_PEDIDO() {
        if (!formSTATUS_PEDIDO.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_STATUS_PEDIDO: formSTATUS_PEDIDO.getForm().findField('CODIGO_STATUS_PEDIDO').getValue(),
            DESCRICAO_STATUS_PEDIDO: formSTATUS_PEDIDO.getForm().findField('DESCRICAO_STATUS_PEDIDO').getValue(),
            COR_STATUS: Ext.getCmp('COR_STATUS').getValue(),
            COR_FONTE_STATUS: Ext.getCmp('COR_FONTE_STATUS').getValue(),
            NAO_IMPRIMIR_PEDIDO: Ext.getCmp('NAO_IMPRIMIR_PEDIDO').checked ? 1 : 0,
            NAO_CANCELAR_PEDIDO: Ext.getCmp('NAO_CANCELAR_PEDIDO').checked ? 1 : 0,
            SENHA_STATUS_PEDIDO: Ext.getCmp('SENHA_STATUS_PEDIDO').getValue(),
            STATUS_ESPECIFICO: Ext.getCmp('STATUS_ESPECIFICO').getValue(),
            APARECE_NO_PORTAL_DE_CLIENTE: CB_APARECE_NO_PORTAL_DE_CLIENTE.getValue() == '' ?
                0 :
                CB_APARECE_NO_PORTAL_DE_CLIENTE.getValue(),

            INICIO_FIM_DE_FASE: CB_INICIO_FIM_DE_FASE.getValue() == '' ?
                0 :
                CB_INICIO_FIM_DE_FASE.getValue(),

            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroSTATUS.title == "Novo Status de Pedido" ?
                        'servicos/TB_STATUS_PEDIDO.asmx/GravaNovoStatus' :
                        'servicos/TB_STATUS_PEDIDO.asmx/AtualizaStatus';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroSTATUS.title == "Novo Status de Pedido") {
                formSTATUS_PEDIDO.getForm().reset();
                LBL_EXEMPLO.setText("");
            }

            formSTATUS_PEDIDO.getForm().findField('DESCRICAO_STATUS_PEDIDO').focus();

            TB_STATUS_CARREGA_GRID();
            TB_STATUS_PEDIDO_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_CUSTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Status de Pedido?', 'formSTATUS_PEDIDO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_STATUS_PEDIDO.asmx/DeletaStatus');
                _ajax.setJsonData({ 
                    CODIGO_STATUS_PEDIDO: Ext.getCmp('CODIGO_STATUS_PEDIDO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroSTATUS.setTitle("Novo Status de Pedido");
                    Ext.getCmp('DESCRICAO_STATUS_PEDIDO').focus();
                    formSTATUS_PEDIDO.getForm().reset();
                    LBL_EXEMPLO.setText("");

                    buttonGroup_TB_STATUS_PEDIDO.items.items[32].disable();
                    formSTATUS_PEDIDO.getForm().items.items[0].enable();

                    Ext.getCmp('BTN_RESETAR_SENHA_STATUS').disable();

                    TB_STATUS_CARREGA_GRID();
                    TB_STATUS_PEDIDO_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    TB_STATUS_CARREGA_GRID();

    return panelCadastroSTATUS;
}
