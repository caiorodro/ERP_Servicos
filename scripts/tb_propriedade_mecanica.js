var combo_TB_PROPRIEDADE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_PROPRIEDADE_MECANICA', 'CLASSE_RESISTENCIA_GRAU']
       )
});

function TB_PROPRIEDADE_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PROPRIEDADE_MECANICA.asmx/Lista_Propriedade');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_PROPRIEDADE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroPropriedade() {

    var TXT_ID_PROPRIEDADE_MECANICA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_PROPRIEDADE_MECANICA',
        id: 'ID_PROPRIEDADE_MECANICA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_CLASSE_RESISTENCIA_GRAU = new Ext.form.TextField({
        fieldLabel: 'Classe Resist&ecirc;ncia (Grau)',
        name: 'CLASSE_RESISTENCIA_GRAU',
        id: 'CLASSE_RESISTENCIA_GRAU',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_DIF_CLASSE_RESISTENCIA = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        name: 'DIF_CLASSE_RESISTENCIA',
        id: 'DIF_CLASSE_RESISTENCIA',
        width: 152,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_LIMITE_RESISTENCIA_TRACAO = new Ext.form.TextField({
        fieldLabel: 'Limite de Resist&ecirc;ncia (Tra&ccedil;&atilde;o)',
        name: 'LIMITE_RESISTENCIA_TRACAO',
        id: 'LIMITE_RESISTENCIA_TRACAO',
        width: 155,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_LIMITE_ESCOAMENTO = new Ext.form.TextField({
        fieldLabel: 'Limite de Escoamento',
        name: 'LIMITE_ESCOAMENTO',
        id: 'LIMITE_ESCOAMENTO',
        width: 155,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_ALONGAMENTO_2_MINUTOS = new Ext.form.TextField({
        fieldLabel: 'Alongamento (2 min.)',
        name: 'ALONGAMENTO_2_MINUTOS',
        id: 'ALONGAMENTO_2_MINUTOS',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ESTRICCAO = new Ext.form.TextField({
        fieldLabel: 'Estric&ccedil;&atilde;o',
        name: 'ESTRICCAO',
        id: 'ESTRICCAO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_DUREZA = new Ext.form.TextField({
        fieldLabel: 'Dureza',
        name: 'DUREZA',
        id: 'DUREZA',
        width: 155,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_CARGA_PROVA = new Ext.form.TextField({
        fieldLabel: 'Carga (Prova)',
        name: 'CARGA_PROVA',
        id: 'CARGA_PROVA',
        width: 155,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_CARGA_APLICADA = new Ext.form.TextField({
        fieldLabel: 'Carga Aplicada',
        name: 'CARGA_APLICADA',
        id: 'CARGA_APLICADA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_TORQUE = new Ext.form.TextField({
        fieldLabel: 'Torque',
        name: 'TORQUE',
        id: 'TORQUE',
        width: 155,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_CAMADA_CEMENTADA = new Ext.form.TextField({
        fieldLabel: 'Camada Cementada',
        name: 'CAMADA_CEMENTADA',
        id: 'CAMADA_CEMENTADA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var formPROPRIEDADE = new Ext.FormPanel({
        id: 'formPROPRIEDADE',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 180,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .16,
                layout: 'form',
                items: [TXT_ID_PROPRIEDADE_MECANICA]
            }, {
                columnWidth: .16,
                layout: 'form',
                items: [TXT_CLASSE_RESISTENCIA_GRAU]
            }, {
                columnWidth: .16,
                layout: 'form',
                items: [TXT_DIF_CLASSE_RESISTENCIA]
}]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .18,
                    layout: 'form',
                    items: [TXT_LIMITE_RESISTENCIA_TRACAO]
                }, {
                    columnWidth: .18,
                    layout: 'form',
                    items: [TXT_LIMITE_ESCOAMENTO]
                }, {
                    columnWidth: .18,
                    layout: 'form',
                    items: [TXT_ALONGAMENTO_2_MINUTOS]
                }, {
                    columnWidth: .18,
                    layout: 'form',
                    items: [TXT_ESTRICCAO]
}]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .18,
                        layout: 'form',
                        items: [TXT_DUREZA]
                    }, {
                        columnWidth: .18,
                        layout: 'form',
                        items: [TXT_TORQUE]
                    }, {
                        columnWidth: .18,
                        layout: 'form',
                        items: [TXT_CARGA_PROVA]
                    }, {
                        columnWidth: .18,
                        layout: 'form',
                        items: [TXT_CARGA_APLICADA]
                    }, {
                        columnWidth: .18,
                        layout: 'form',
                        items: [TXT_CAMADA_CEMENTADA]
}]
}]
                    });

                    function PopulaFormulario_TB_PROPRIEDADE(record) {
                        formPROPRIEDADE.getForm().loadRecord(record);
                        panelCadastroPROPRIEDADE.setTitle('Alterar dados do Material');

                        buttonGroup_TB_PROPRIEDADE.items.items[32].enable();
                        formPROPRIEDADE.getForm().items.items[0].disable();

                        formPROPRIEDADE.getForm().findField('CLASSE_RESISTENCIA_GRAU').focus();
                    }

                    var TB_PROPRIEDADE_Store = new Ext.data.Store({
                        reader: new Ext.data.XmlReader({
                            record: 'Tabela'
                        },
                    ['ID_PROPRIEDADE_MECANICA', 'CLASSE_RESISTENCIA_GRAU', 'LIMITE_RESISTENCIA_TRACAO', 'LIMITE_ESCOAMENTO', 'ALONGAMENTO_2_MINUTOS',
                    'ESTRICCAO', 'DUREZA', 'CARGA_PROVA', 'CARGA_APLICADA', 'TORQUE', 'DIF_CLASSE_RESISTENCIA', 'CAMADA_CEMENTADA']
                    )
                    });

                    var gridPROPRIEDADE = new Ext.grid.GridPanel({
                        id: 'gridPROPRIEDADE',
                        store: TB_PROPRIEDADE_Store,
                        columns: [
                    { id: 'ID_PROPRIEDADE_MECANICA', header: "C&oacute;digo", width: 65, sortable: true, dataIndex: 'ID_PROPRIEDADE_MECANICA' },

                    { id: 'CLASSE_RESISTENCIA_GRAU', header: "Classe Resist. (Grau)", width: 130, sortable: true, dataIndex: 'CLASSE_RESISTENCIA_GRAU', align: 'center' },
                    { id: 'DIF_CLASSE_RESISTENCIA', header: "Complemento", width: 155, sortable: true, dataIndex: 'DIF_CLASSE_RESISTENCIA', align: 'center' },
                    { id: 'LIMITE_RESISTENCIA_TRACAO', header: "Limite Resist. (Tra&ccedil;&atilde;o)", width: 155, sortable: true, dataIndex: 'LIMITE_RESISTENCIA_TRACAO', align: 'center' },
                    { id: 'LIMITE_ESCOAMENTO', header: "Limite Escoamento", width: 155, sortable: true, dataIndex: 'LIMITE_ESCOAMENTO', align: 'center' },
                    { id: 'ALONGAMENTO_2_MINUTOS', header: "Along. (2min.)", width: 110, sortable: true, dataIndex: 'ALONGAMENTO_2_MINUTOS', align: 'center' },
                    { id: 'ESTRICCAO', header: "Estric&ccedil;&atilde;o", width: 110, sortable: true, dataIndex: 'ESTRICCAO', align: 'center' },
                    { id: 'DUREZA', header: "Dureza", width: 155, sortable: true, dataIndex: 'DUREZA', align: 'center' },
                    { id: 'CARGA_PROVA', header: "Carga (Prova)", width: 155, sortable: true, dataIndex: 'CARGA_PROVA', align: 'center' },
                    { id: 'TORQUE', header: "Torque", width: 155, sortable: true, dataIndex: 'TORQUE', align: 'center' },
                    { id: 'CARGA_APLICADA', header: "Carga Aplicada", width: 110, sortable: true, dataIndex: 'CARGA_APLICADA', align: 'center' },
                    { id: 'CAMADA_CEMENTADA', header: "Camada Cementada", width: 110, sortable: true, dataIndex: 'CAMADA_CEMENTADA', align: 'center' }

                    ],
                        stripeRows: true,
                        height: 221,
                        width: '100%',

                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: true
                        }),
                        listeners: {
                            rowdblclick: function(grid, rowIndex, e) {
                                var record = grid.getStore().getAt(rowIndex);
                                PopulaFormulario_TB_PROPRIEDADE(record);
                            },
                            keydown: function(e) {
                                if (e.getKey() == e.ENTER) {
                                    if (gridPROPRIEDADE.getSelectionModel().getSelections().length > 0) {
                                        var record = gridPROPRIEDADE.getSelectionModel().getSelected();
                                        PopulaFormulario_TB_PROPRIEDADE(record);
                                    }
                                }
                            }
                        }
                    });

                    function RetornaPROPRIEDADE_JsonData() {
                        var CLAS_FISCAL_JsonData = {
                            ID_USUARIO: _ID_USUARIO,
                            start: 0,
                            limit: Th2_LimiteDeLinhasPaginacao
                        };

                        return CLAS_FISCAL_JsonData;
                    }

                    var PROPRIEDADE_PagingToolbar = new Th2_PagingToolbar();
                    PROPRIEDADE_PagingToolbar.setUrl('servicos/TB_PROPRIEDADE_MECANICA.asmx/Carrega_Propriedade');
                    PROPRIEDADE_PagingToolbar.setStore(TB_PROPRIEDADE_Store);

                    function TB_PROPRIEDADE_MECANICA_CARREGA_GRID() {
                        PROPRIEDADE_PagingToolbar.setParamsJsonData(RetornaPROPRIEDADE_JsonData());
                        PROPRIEDADE_PagingToolbar.doRequest();
                    }

                    ///////////////////////////
                    var buttonGroup_TB_PROPRIEDADE = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                GravaDados_TB_PROPRIEDADE();
                            }
                        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Propriedade Mec&acirc;nica',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_PROPRIEDADE.items.items[32].disable();

                                    formPROPRIEDADE.getForm().items.items[0].enable();

                                    formPROPRIEDADE.getForm().findField('CLASSE_RESISTENCIA_GRAU').focus();
                                    formPROPRIEDADE.getForm().reset();
                                    panelCadastroPROPRIEDADE.setTitle('Nova Propriedade Mec&acirc;nica');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_PROPRIEDADE',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_PROPRIEDADE();
                                 }
}]
                    });

                    var toolbar_TB_PROPRIEDADE = new Ext.Toolbar({
                        style: 'text-align: right;',
                        items: [buttonGroup_TB_PROPRIEDADE]
                    });

                    var panelCadastroPROPRIEDADE = new Ext.Panel({
                        width: '100%',
                        border: true,
                        title: 'Nova Propriedade Mec&acirc;nica',
                        items: [formPROPRIEDADE, toolbar_TB_PROPRIEDADE, gridPROPRIEDADE, PROPRIEDADE_PagingToolbar.PagingToolbar()]
                    });

                    function GravaDados_TB_PROPRIEDADE() {
                        if (!formPROPRIEDADE.getForm().isValid()) {
                            return;
                        }

                        var dados = {
                            ID_PROPRIEDADE_MECANICA: Ext.getCmp('ID_PROPRIEDADE_MECANICA').getValue(),
                            CLASSE_RESISTENCIA_GRAU: Ext.getCmp('CLASSE_RESISTENCIA_GRAU').getValue(),
                            DIF_CLASSE_RESISTENCIA: Ext.getCmp('DIF_CLASSE_RESISTENCIA').getValue(),
                            LIMITE_RESISTENCIA_TRACAO: Ext.getCmp('LIMITE_RESISTENCIA_TRACAO').getValue(),
                            LIMITE_ESCOAMENTO: Ext.getCmp('LIMITE_ESCOAMENTO').getValue(),
                            ALONGAMENTO_2_MINUTOS: Ext.getCmp('ALONGAMENTO_2_MINUTOS').getValue(),
                            ESTRICCAO: Ext.getCmp('ESTRICCAO').getValue(),
                            DUREZA: Ext.getCmp('DUREZA').getValue(),
                            CARGA_PROVA: Ext.getCmp('CARGA_PROVA').getValue(),
                            CARGA_APLICADA: Ext.getCmp('CARGA_APLICADA').getValue(),
                            TORQUE: Ext.getCmp('TORQUE').getValue(),
                            CAMADA_CEMENTADA: Ext.getCmp('CAMADA_CEMENTADA').getValue(),
                            ID_USUARIO: _ID_USUARIO
                        };

                        var Url = panelCadastroPROPRIEDADE.title == "Nova Propriedade Mec&acirc;nica" ?
                        'servicos/TB_PROPRIEDADE_MECANICA.asmx/GravaNovaPropriedade' :
                        'servicos/TB_PROPRIEDADE_MECANICA.asmx/AtualizaPropriedade';

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl(Url);
                        _ajax.setJsonData({ dados: dados });

                        var _sucess = function(response, options) {
                            if (panelCadastroPROPRIEDADE.title == "Nova Propriedade Mec&acirc;nica") {
                                formPROPRIEDADE.getForm().reset();
                            }

                            formPROPRIEDADE.getForm().findField('CLASSE_RESISTENCIA_GRAU').focus();

                            TB_PROPRIEDADE_MECANICA_CARREGA_GRID();
                            TB_PROPRIEDADE_COMBO();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }

                    function Deleta_TB_PROPRIEDADE() {
                        dialog.MensagemDeConfirmacao('Deseja deletar este Registro?', 'formPROPRIEDADE', Deleta);

                        function Deleta(btn) {
                            if (btn == 'yes') {

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_PROPRIEDADE_MECANICA.asmx/DeletaPropriedade');
                                _ajax.setJsonData({ 
                                    ID_PROPRIEDADE_MECANICA: Ext.getCmp('ID_PROPRIEDADE_MECANICA').getValue(),
                                    ID_USUARIO: _ID_USUARIO
                                });

                                var _sucess = function(response, options) {
                                    panelCadastroPROPRIEDADE.setTitle("Nova Propriedade Mec&acirc;nica");
                                    Ext.getCmp('CLASSE_RESISTENCIA_GRAU').focus();
                                    formPROPRIEDADE.getForm().reset();

                                    buttonGroup_TB_PROPRIEDADE.items.items[32].disable();
                                    formPROPRIEDADE.getForm().items.items[0].enable();

                                    TB_PROPRIEDADE_MECANICA_CARREGA_GRID();
                                    TB_PROPRIEDADE_COMBO();
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }
                        }
                    }

                    gridPROPRIEDADE.setHeight(AlturaDoPainelDeConteudo(formPROPRIEDADE.height) - 125);

                    TB_PROPRIEDADE_MECANICA_CARREGA_GRID();

                    return panelCadastroPROPRIEDADE;
                }