var combo_TB_STATUS_RNC = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_STATUS_RNC', 'DESCRICAO_STATUS']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS',
        direction: 'ASC'
    }
});

function TB_STATUS_RNC_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_RNC.asmx/Lista_TB_STATUS_RNC');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_RNC.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroStatus_RNC() {

    var TXT_ID_STATUS_RNC = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_STATUS_RNC',
        id: 'ID_STATUS_RNC',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_STATUS = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_STATUS',
        id: 'DESCRICAO_STATUS',
        allowBlank: false,
        msgTarget: 'side',
        width: 350,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 40 }
    });

    var TXT_COR_FUNDO = new Ext.form.TextField({
        fieldLabel: 'Cor de Fundo',
        width: 70,
        name: 'COR_FUNDO',
        id: 'COR_FUNDO',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false
    });

    var TXT_COR_LETRA = new Ext.form.TextField({
        fieldLabel: 'Cor da Letra',
        width: 70,
        name: 'COR_LETRA',
        id: 'COR_LETRA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false
    });

    var COR1 = new Ext.ColorPalette({
        listeners: {
            select: function(p, color) {
                Ext.getCmp('COR_FUNDO').setValue("#" + color);

                var corFonte = Ext.getCmp('COR_LETRA').getValue();

                if (corFonte.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: #" + color + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var COR2 = new Ext.ColorPalette({
        listeners: {
            select: function(p, color) {
                Ext.getCmp('COR_LETRA').setValue("#" + color);

                var corFundo = Ext.getCmp('COR_FUNDO').getValue();

                if (corFundo.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: #" + color + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_STATUS').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var LBL_EXEMPLO = new Ext.form.Label();

    var CB_ENCERRA_RNC = new Ext.form.ComboBox({
        fieldLabel: 'Esta fase encerra a RNC',
        id: 'ENCERRA_RNC',
        name: 'ENCERRA_RNC',
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
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var formSTATUS_RNC = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 288,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_ID_STATUS_RNC]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_DESCRICAO_STATUS]
}]
            }, {
                columnWidth: 0.37,
                layout: 'form',
                items: [CB_ENCERRA_RNC]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .25,
                    layout: 'form',
                    items: [TXT_COR_FUNDO]
                }, {
                    columnWidth: .25,
                    layout: 'form',
                    items: [TXT_COR_LETRA]
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

                    function PopulaFormulario_TB_STATUS_RNC(record) {
                        formSTATUS_RNC.getForm().loadRecord(record);

                        Ext.getCmp('ENCERRA_RNC').setValue(record.data.ENCERRA_RNC);

                        panelCadastroSTATUS.setTitle('Alterar dados do Status');

                        buttonGroup_TB_STATUS_RNC.items.items[32].enable();
                        formSTATUS_RNC.getForm().items.items[0].disable();

                        TXT_DESCRICAO_STATUS.focus();

                        var corFundo = record.data.COR_FUNDO;
                        var corFonte = record.data.COR_LETRA;

                        var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                                Ext.getCmp('DESCRICAO_STATUS').getValue() + "</div>";

                        LBL_EXEMPLO.setText(exemplo, false);
                    }

                    var TB_STATUS_RNC_Store = new Ext.data.Store({
                        reader: new Ext.data.XmlReader({
                            record: 'Tabela'
                        },
                        ['ID_STATUS_RNC', 'DESCRICAO_STATUS', 'COR_FUNDO', 'COR_LETRA', 'ENCERRA_RNC'])
                    });

                    var gridSTATUS_RNC = new Ext.grid.GridPanel({
                        store: TB_STATUS_RNC_Store,
                        columns: [
                    { id: 'ID_STATUS_RNC', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_STATUS_RNC' },
                    { id: 'DESCRICAO_STATUS', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_STATUS', renderer: status_rnc },
                    { id: 'COR_FUNDO', header: "Cor de Fundo", width: 90, sortable: true, dataIndex: 'COR_FUNDO' },
                    { id: 'COR_LETRA', header: "Cor da Fonte", width: 90, sortable: true, dataIndex: 'COR_LETRA' },
                    { id: 'ENCERRA_RNC', header: "Encerra RNC", width: 160, sortable: true, dataIndex: 'ENCERRA_RNC', renderer: TrataCombo01 }
                    ],
                        stripeRows: true,
                        height: AlturaDoPainelDeConteudo(413),
                        width: '100%',

                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: true
                        })
                    });

                    gridSTATUS_RNC.on('rowdblclick', function(grid, rowIndex, e) {
                        var record = grid.getStore().getAt(rowIndex);
                        PopulaFormulario_TB_STATUS_RNC(record);
                    });

                    gridSTATUS_RNC.on('keydown', function(e) {
                        if (e.getKey() == e.ENTER) {
                            if (gridSTATUS_RNC.getSelectionModel().getSelections().length > 0) {
                                var record = gridSTATUS_RNC.getSelectionModel().getSelected();
                                PopulaFormulario_TB_STATUS_RNC(record);
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
                    STATUS_PagingToolbar.setUrl('servicos/TB_STATUS_RNC.asmx/Carrega_STATUS');
                    STATUS_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
                    STATUS_PagingToolbar.setStore(TB_STATUS_RNC_Store);

                    function TB_STATUS_CARREGA_GRID() {
                        STATUS_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
                        STATUS_PagingToolbar.doRequest();
                    }

                    ///////////////////////////
                    var buttonGroup_TB_STATUS_RNC = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                GravaDados_TB_STATUS_RNC();
                            }
                        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Status de RNC',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_STATUS_RNC.items.items[32].disable();

                                    formSTATUS_RNC.getForm().items.items[0].enable();

                                    formSTATUS_RNC.getForm().findField('DESCRICAO_STATUS').focus();
                                    formSTATUS_RNC.getForm().reset();
                                    panelCadastroSTATUS.setTitle('Novo Status de RNC');

                                    LBL_EXEMPLO.setText("");
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_STATUS_RNC',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_CUSTO();
                                 }
}]
                    });

                    var toolbar_TB_STATUS = new Ext.Toolbar({
                        style: 'text-align: right;',
                        items: [buttonGroup_TB_STATUS_RNC]
                    });

                    var panelCadastroSTATUS = new Ext.Panel({
                        width: '100%',
                        border: true,
                        title: 'Novo Status de RNC',
                        items: [formSTATUS_RNC, toolbar_TB_STATUS, gridSTATUS_RNC, STATUS_PagingToolbar.PagingToolbar()]
                    });

                    function GravaDados_TB_STATUS_RNC() {
                        if (!formSTATUS_RNC.getForm().isValid()) {
                            return;
                        }

                        var dados = {
                            ID_STATUS_RNC: TXT_ID_STATUS_RNC.getValue(),
                            DESCRICAO_STATUS: TXT_DESCRICAO_STATUS.getValue(),
                            COR_FUNDO: TXT_COR_FUNDO.getValue(),
                            COR_LETRA: TXT_COR_LETRA.getValue(),
                            ENCERRA_RNC: CB_ENCERRA_RNC.getValue(),
                            ID_USUARIO: _ID_USUARIO
                        };

                        var Url = panelCadastroSTATUS.title == "Novo Status de RNC" ?
                                'servicos/TB_STATUS_RNC.asmx/GravaNovoStatus' :
                                'servicos/TB_STATUS_RNC.asmx/AtualizaStatus';

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl(Url);
                        _ajax.setJsonData({ dados: dados });

                        var _sucess = function(response, options) {
                            if (panelCadastroSTATUS.title == "Novo Status de RNC") {
                                formSTATUS_RNC.getForm().reset();
                                LBL_EXEMPLO.setText("");
                            }

                            formSTATUS_RNC.getForm().findField('DESCRICAO_STATUS').focus();

                            TB_STATUS_CARREGA_GRID();
                            TB_STATUS_RNC_CARREGA_COMBO();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }

                    function Deleta_TB_CUSTO() {
                        dialog.MensagemDeConfirmacao('Deseja deletar este Status de RNC?', formSTATUS_RNC.getId(), Deleta);

                        function Deleta(btn) {
                            if (btn == 'yes') {

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_STATUS_RNC.asmx/DeletaStatus');
                                _ajax.setJsonData({
                                    ID_STATUS_RNC: TXT_ID_STATUS_RNC.getValue(),
                                    ID_USUARIO: _ID_USUARIO
                                });

                                var _sucess = function(response, options) {
                                    panelCadastroSTATUS.setTitle("Novo Status de RNC");
                                    Ext.getCmp('DESCRICAO_STATUS').focus();
                                    formSTATUS_RNC.getForm().reset();
                                    LBL_EXEMPLO.setText("");

                                    buttonGroup_TB_STATUS_RNC.items.items[32].disable();
                                    formSTATUS_RNC.getForm().items.items[0].enable();

                                    TB_STATUS_CARREGA_GRID();
                                    TB_STATUS_RNC_CARREGA_COMBO();
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }
                        }
                    }

                    TB_STATUS_CARREGA_GRID();

                    return panelCadastroSTATUS;
                }
