
var combo_EMAIL_PASTA_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_PASTA', 'ID_USUARIO', 'COR_FUNDO', 'COR_LETRA', 'PASTA_ESPECIFICA', 'DESCRICAO_PASTA', 'NAO_LIDOS', 'PASTA_SUPERIOR']
       ),
    sortInfo: {
        field: 'DESCRICAO_PASTA',
        direction: 'ASC'
    }
});

function CARREGA_EMAIL_PASTA(pID_USUARIO) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Lista_Pasta_Usuario');
    _ajax.setJsonData({
        ID_USUARIO: pID_USUARIO
    });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;

        combo_EMAIL_PASTA_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_EMAIL_PASTA_MOVER_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_PASTA', 'ID_USUARIO', 'COR_FUNDO', 'COR_LETRA', 'PASTA_ESPECIFICA', 'DESCRICAO_PASTA']
       ),
    sortInfo: {
        field: 'DESCRICAO_PASTA',
        direction: 'ASC'
    }
});

function CARREGA_EMAIL_PASTA_MOVER(pID_USUARIO) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Lista_Pasta_Usuario_Mover');
    _ajax.setJsonData({
        ID_USUARIO: pID_USUARIO
    });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;

        combo_EMAIL_PASTA_MOVER_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function janela_Pasta_Email() {

    var TXT_ID_PASTA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_PASTA',
        id: 'ID_PASTA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_PASTA = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_PASTA',
        id: 'DESCRICAO_PASTA',
        allowBlank: false,
        width: 250,
        maxLength: 30,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 30 }
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
        allowBlank: false,
        msgTarget: 'side'
    });

    var COR1 = new Ext.ColorPalette({
        listeners: {
            select: function(p, color) {
                Ext.getCmp('COR_FUNDO').setValue("#" + color);

                var corFonte = Ext.getCmp('COR_LETRA').getValue();

                if (corFonte.length > 0) {
                    var exemplo = "Exemplo: <div style='background-color: #" + color + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_PASTA').getValue() + "</div>";

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
                        Ext.getCmp('DESCRICAO_PASTA').getValue() + "</div>";

                    LBL_EXEMPLO.setText(exemplo, false);
                }
            }
        }
    });

    var PASTA_SUPERIOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PASTA', 'DESCRICAO_PASTA']),
        sortInfo: {
            field: 'DESCRICAO_PASTA',
            direction: 'ASC'
        }
    });

    var CB_PASTA_SUPERIOR = new Ext.form.ComboBox({
        fieldLabel: 'Pasta superior',
        id: 'PASTA_SUPERIOR',
        store: PASTA_SUPERIOR_Store,
        valueField: 'ID_PASTA',
        displayField: 'DESCRICAO_PASTA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione a pasta aqui...',
        selectOnFocus: true,
        width: 190,
        style: 'font-size: 9pt;'
    });

    function Carrega_PASTAS_NIVEL_SUPERIOR() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Carrega_PASTAS_NIVEL_SUPERIOR');
        _ajax.setJsonData({
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            PASTA_SUPERIOR_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var LBL_EXEMPLO = new Ext.form.Label();

    var formEMAIL_PASTA = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 245,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [TXT_ID_PASTA]
            }, {
                columnWidth: .35,
                layout: 'form',
                items: [TXT_DESCRICAO_PASTA]
            }, {
                columnWidth: .30,
                layout: 'form',
                items: [CB_PASTA_SUPERIOR]
}]
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

                    function PopulaFormulario_TB_EMAIL_PASTA(record) {
                        formEMAIL_PASTA.getForm().loadRecord(record);

                        panelCadastroPASTA.setTitle('Alterar dados da pasta');

                        buttonGroup_TB_EMAIL_PASTA.items.items[32].enable();
                        formEMAIL_PASTA.getForm().items.items[0].disable();

                        Ext.getCmp('DESCRICAO_PASTA').focus();

                        var corFundo = record.data.COR_FUNDO;
                        var corFonte = record.data.COR_LETRA;

                        var exemplo = "Exemplo: <div style='background-color: " + corFundo + ";" + "color: " + corFonte + "; font-size: 11pt;'>" +
                        Ext.getCmp('DESCRICAO_PASTA').getValue() + "</div>";

                        LBL_EXEMPLO.setText(exemplo, false);
                    }

                    var PASTA_Store = new Ext.data.Store({
                        reader: new Ext.data.XmlReader({
                            record: 'Tabela'
                        },
                    ['ID_PASTA', 'DESCRICAO_PASTA', 'COR_FUNDO', 'COR_LETRA',
                    'PASTA_ESPECIFICA', 'PASTA_SUPERIOR']
                    )
                    });

                    var gridEMAIL_PASTA = new Ext.grid.GridPanel({
                        store: PASTA_Store,
                        columns: [
                    { id: 'ID_PASTA', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_PASTA' },
                    { id: 'DESCRICAO_PASTA', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_PASTA', renderer: descricao_pasta_email },
                    { id: 'COR_FUNDO', header: "Cor de Fundo", width: 90, sortable: true, dataIndex: 'COR_FUNDO', align: 'center' },
                    { id: 'COR_LETRA', header: "Cor da Fonte", width: 90, sortable: true, dataIndex: 'COR_LETRA', align: 'center' }
                    ],
                        stripeRows: true,
                        height: 160,
                        width: '100%',

                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: true
                        })
                    });

                    gridEMAIL_PASTA.on('rowdblclick', function(grid, rowIndex, e) {
                        var record = grid.getStore().getAt(rowIndex);
                        PopulaFormulario_TB_EMAIL_PASTA(record);
                    });

                    gridEMAIL_PASTA.on('keydown', function(e) {
                        if (e.getKey() == e.ENTER) {
                            if (gridEMAIL_PASTA.getSelectionModel().getSelections().length > 0) {
                                var record = gridEMAIL_PASTA.getSelectionModel().getSelected();
                                PopulaFormulario_TB_EMAIL_PASTA(record);
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

                    var EMAIL_PASTA_PagingToolbar = new Th2_PagingToolbar();
                    EMAIL_PASTA_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Carrega_PASTAS');
                    EMAIL_PASTA_PagingToolbar.setStore(PASTA_Store);

                    function CARREGA_GRID() {
                        EMAIL_PASTA_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
                        EMAIL_PASTA_PagingToolbar.doRequest();
                    }

                    ///////////////////////////
                    var buttonGroup_TB_EMAIL_PASTA = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                GravaDados_TB_EMAIL_PASTA();
                            }
                        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Pasta',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_EMAIL_PASTA.items.items[32].disable();

                                    formEMAIL_PASTA.getForm().items.items[0].enable();

                                    formEMAIL_PASTA.getForm().findField('DESCRICAO_PASTA').focus();
                                    formEMAIL_PASTA.getForm().reset();
                                    panelCadastroPASTA.setTitle('Nova Pasta');

                                    LBL_EXEMPLO.setText("");
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_INDICADOR',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_EMAIL_PASTA();
                                 }
}]
                    });

                    var toolbar_TB_EMAIL_PASTA = new Ext.Toolbar({
                        style: 'text-align: right;',
                        items: [buttonGroup_TB_EMAIL_PASTA]
                    });

                    var panelCadastroPASTA = new Ext.Panel({
                        width: '100%',
                        border: true,
                        title: 'Nova Pasta',
                        items: [formEMAIL_PASTA, toolbar_TB_EMAIL_PASTA, gridEMAIL_PASTA, EMAIL_PASTA_PagingToolbar.PagingToolbar()]
                    });

                    function GravaDados_TB_EMAIL_PASTA() {
                        if (!formEMAIL_PASTA.getForm().isValid()) {
                            return;
                        }

                        var dados = {
                            ID_PASTA: formEMAIL_PASTA.getForm().findField('ID_PASTA').getValue(),
                            DESCRICAO_PASTA: formEMAIL_PASTA.getForm().findField('DESCRICAO_PASTA').getValue(),
                            COR_FUNDO: Ext.getCmp('COR_FUNDO').getValue(),
                            COR_LETRA: Ext.getCmp('COR_LETRA').getValue(),
                            PASTA_SUPERIOR: CB_PASTA_SUPERIOR.getValue() == '' ? 0 : CB_PASTA_SUPERIOR.getValue(),
                            ID_USUARIO: _ID_USUARIO
                        };

                        var Url = panelCadastroPASTA.title == "Nova Pasta" ?
                        'servicos/TB_EMAIL.asmx/Grava_Nova_Pasta' :
                        'servicos/TB_EMAIL.asmx/Altera_Pasta';

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl(Url);
                        _ajax.setJsonData({ dados: dados });

                        var _sucess = function(response, options) {
                            if (panelCadastroPASTA.title == "Nova Pasta") {
                                formEMAIL_PASTA.getForm().reset();
                                LBL_EXEMPLO.setText("");
                            }

                            formEMAIL_PASTA.getForm().findField('DESCRICAO_PASTA').focus();

                            CARREGA_GRID();
                            CARREGA_EMAIL_PASTA(_ID_USUARIO);
                            CARREGA_EMAIL_PASTA_MOVER(_ID_USUARIO);
                            Carrega_PASTAS_NIVEL_SUPERIOR();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }

                    function Deleta_TB_EMAIL_PASTA() {
                        dialog.MensagemDeConfirmacao('Deseja deletar esta pasta?', formEMAIL_PASTA.getId(), Deleta);

                        function Deleta(btn) {
                            if (btn == 'yes') {

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_EMAIL.asmx/Deleta_Pasta');
                                _ajax.setJsonData({ 
                                    ID_PASTA: Ext.getCmp('ID_PASTA').getValue(),
                                    ID_USUARIO: _ID_USUARIO
                                });

                                var _sucess = function(response, options) {
                                    panelCadastroPASTA.setTitle("Nova Pasta");
                                    Ext.getCmp('DESCRICAO_PASTA').focus();
                                    formEMAIL_PASTA.getForm().reset();
                                    LBL_EXEMPLO.setText("");

                                    buttonGroup_TB_EMAIL_PASTA.items.items[32].disable();
                                    formEMAIL_PASTA.getForm().items.items[0].enable();

                                    CARREGA_GRID();
                                    CARREGA_EMAIL_PASTA(_ID_USUARIO);
                                    CARREGA_EMAIL_PASTA_MOVER(_ID_USUARIO);
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }
                        }
                    }

                    var wPasta = new Ext.Window({
                        title: 'Pasta de e-mail',
                        layout: 'form',
                        iconCls: 'icone_PLANO_CONTAS',
                        width: 900,
                        height: 534,
                        closable: false,
                        draggable: true,
                        resizable: false,
                        minimizable: true,
                        modal: true,
                        renderTo: Ext.getBody(),
                        listeners: {
                            minimize: function(w) {
                                w.hide();
                            }
                        },
                        items: [panelCadastroPASTA]
                    });

                    this.show = function(elm) {
                        CARREGA_GRID();
                        Carrega_PASTAS_NIVEL_SUPERIOR();
                        wPasta.show(elm);
                    };
                }