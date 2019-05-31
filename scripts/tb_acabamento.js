var combo_TB_ACABAMENTO = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_ACABAMENTO_SUPERFICIAL', 'DESCRICAO_ACABAMENTO']
       )
});

function TB_ACABAMENTO_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ACABAMENTO_SUPERFICIAL.asmx/Lista_Acabamento');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_ACABAMENTO.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroAcabamento() {

    var TXT_ID_ACABAMENTO_SUPERFICIAL = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_ACABAMENTO_SUPERFICIAL',
        id: 'ID_ACABAMENTO_SUPERFICIAL',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_ACABAMENTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_ACABAMENTO',
        id: 'DESCRICAO_ACABAMENTO',
        width: 295,
        maxlength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' }
    });

    var TXT_NORMA = new Ext.form.TextField({
        fieldLabel: 'Norma',
        name: 'NORMA',
        id: 'NORMA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ASPECTO_VISUAL = new Ext.form.TextField({
        fieldLabel: 'Aspecto Visual',
        name: 'ASPECTO_VISUAL',
        id: 'ASPECTO_VISUAL',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ADERENCIA = new Ext.form.TextField({
        fieldLabel: 'Ader&ecirc;ncia',
        name: 'ADERENCIA',
        id: 'ADERENCIA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_SALT_SPRAY_CB = new Ext.form.TextField({
        fieldLabel: 'Salt Spray / CB',
        name: 'SALT_SPRAY_CB',
        id: 'SALT_SPRAY_CB',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_SALT_SPRAY_CV = new Ext.form.TextField({
        fieldLabel: 'Salt Spray / CV',
        name: 'SALT_SPRAY_CV',
        id: 'SALT_SPRAY_CV',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_DESIDROGENACAO = new Ext.form.TextField({
        fieldLabel: 'Desidrogena&ccedil;&atilde;o',
        name: 'DESIDROGENACAO',
        id: 'DESIDROGENACAO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_TEMPERATURA = new Ext.form.TextField({
        fieldLabel: 'Temperatura',
        name: 'TEMPERATURA',
        id: 'TEMPERATURA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_CAMADA = new Ext.form.TextField({
        fieldLabel: 'Camada',
        name: 'CAMADA',
        id: 'CAMADA',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ENSAIO_PREECE = new Ext.form.TextField({
        fieldLabel: 'Ensaio de Preece (Imersões)',
        name: 'ENSAIO_PREECE',
        id: 'ENSAIO_PREECE',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_PESO_CAMADA_ZINCO = new Ext.form.TextField({
        fieldLabel: 'Peso Camada Zinco',
        name: 'PESO_CAMADA_ZINCO',
        id: 'PESO_CAMADA_ZINCO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });


    var formACABAMENTO = new Ext.FormPanel({
        id: 'formACABAMENTO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 180,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [TXT_ID_ACABAMENTO_SUPERFICIAL]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_DESCRICAO_ACABAMENTO]
}]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .16,
                    layout: 'form',
                    items: [TXT_NORMA]
                }, {
                    columnWidth: .16,
                    layout: 'form',
                    items: [TXT_ASPECTO_VISUAL]
                }, {
                    columnWidth: .16,
                    layout: 'form',
                    items: [TXT_ADERENCIA]
                }, {
                    columnWidth: .16,
                    layout: 'form',
                    items: [TXT_CAMADA]
                }, {
                    columnWidth: .16,
                    layout: 'form',
                    items: [TXT_ENSAIO_PREECE]
}]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .16,
                        layout: 'form',
                        items: [TXT_SALT_SPRAY_CB]
                    }, {
                        columnWidth: .16,
                        layout: 'form',
                        items: [TXT_SALT_SPRAY_CV]
                    }, {
                        columnWidth: .16,
                        layout: 'form',
                        items: [TXT_DESIDROGENACAO]
                    }, {
                        columnWidth: .16,
                        layout: 'form',
                        items: [TXT_TEMPERATURA]
                    }, {
                        columnWidth: .16,
                        layout: 'form',
                        items: [TXT_PESO_CAMADA_ZINCO]
}]
}]
                    });

                    function PopulaFormulario_TB_ACABAMENTO(record) {
                        formACABAMENTO.getForm().loadRecord(record);
                        panelCadastroACABAMENTO.setTitle('Alterar dados do Material');

                        buttonGroup_TB_ACABAMENTO.items.items[32].enable();
                        formACABAMENTO.getForm().items.items[0].disable();

                        formACABAMENTO.getForm().findField('NORMA').focus();
                    }

                    var TB_ACABAMENTO_Store = new Ext.data.Store({
                        reader: new Ext.data.XmlReader({
                            record: 'Tabela'
                        },
                    ['ID_ACABAMENTO_SUPERFICIAL', 'DESCRICAO_ACABAMENTO', 'NORMA', 'ASPECTO_VISUAL', 'ADERENCIA', 'SALT_SPRAY_CB',
                    'SALT_SPRAY_CV', 'DESIDROGENACAO', 'TEMPERATURA', 'CAMADA', 'ENSAIO_PREECE', 'PESO_CAMADA_ZINCO']
                    )
                    });

                    var gridACABAMENTO = new Ext.grid.GridPanel({
                        id: 'gridACABAMENTO',
                        store: TB_ACABAMENTO_Store,
                        columns: [
                    { id: 'ID_ACABAMENTO_SUPERFICIAL', header: "C&oacute;digo", width: 65, sortable: true, dataIndex: 'ID_ACABAMENTO_SUPERFICIAL' },
                    { id: 'DESCRICAO_ACABAMENTO', header: "Descri&ccedil;&atilde;o", width: 295, sortable: true, dataIndex: 'DESCRICAO_ACABAMENTO' },

                    { id: 'NORMA', header: "Norma", width: 100, sortable: true, dataIndex: 'NORMA', align: 'center' },
                    { id: 'ASPECTO_VISUAL', header: "Aspecto Visual", width: 110, sortable: true, dataIndex: 'ASPECTO_VISUAL', align: 'center' },
                    { id: 'ADERENCIA', header: "Ader&ecirc;ncia", width: 110, sortable: true, dataIndex: 'ADERENCIA', align: 'center' },
                    { id: 'SALT_SPRAY_CB', header: "Salt Spray / CB", width: 110, sortable: true, dataIndex: 'SALT_SPRAY_CB', align: 'center' },
                    { id: 'SALT_SPRAY_CV', header: "Salt Spray / CV", width: 110, sortable: true, dataIndex: 'SALT_SPRAY_CV', align: 'center' },
                    { id: 'DESIDROGENACAO', header: "Desidrogena&ccedil;&atilde;o", width: 110, sortable: true, dataIndex: 'DESIDROGENACAO', align: 'center' },
                    { id: 'TEMPERATURA', header: "Temperatura", width: 110, sortable: true, dataIndex: 'TEMPERATURA', align: 'center' },
                    { id: 'CAMADA', header: "Camada", width: 110, sortable: true, dataIndex: 'CAMADA', align: 'center' },
                    { id: 'ENSAIO_PREECE', header: "Ensaio Preece", width: 110, sortable: true, dataIndex: 'ENSAIO_PREECE', align: 'center' },
                    { id: 'PESO_CAMADA_ZINCO', header: "Peso Camada Zinco", width: 110, sortable: true, dataIndex: 'PESO_CAMADA_ZINCO', align: 'center' }

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
                                PopulaFormulario_TB_ACABAMENTO(record);
                            },
                            keydown: function(e) {
                                if (e.getKey() == e.ENTER) {
                                    if (gridACABAMENTO.getSelectionModel().getSelections().length > 0) {
                                        var record = gridACABAMENTO.getSelectionModel().getSelected();
                                        PopulaFormulario_TB_ACABAMENTO(record);
                                    }
                                }
                            }
                        }
                    });

                    function RetornaACABAMENTO_JsonData() {
                        var CLAS_FISCAL_JsonData = {
                            DESCRICAO: TXT_FILTRO.getValue(),
                            ID_USUARIO: _ID_USUARIO,
                            start: 0,
                            limit: Th2_LimiteDeLinhasPaginacao
                        };

                        return CLAS_FISCAL_JsonData;
                    }

                    var ACABAMENTO_PagingToolbar = new Th2_PagingToolbar();
                    ACABAMENTO_PagingToolbar.setUrl('servicos/TB_ACABAMENTO_SUPERFICIAL.asmx/Carrega_Acabamento');
                    ACABAMENTO_PagingToolbar.setStore(TB_ACABAMENTO_Store);

                    function TB_ACABAMENTO_CARREGA_GRID() {
                        ACABAMENTO_PagingToolbar.setParamsJsonData(RetornaACABAMENTO_JsonData());
                        ACABAMENTO_PagingToolbar.doRequest();
                    }

                    ///////////////////////////
                    var buttonGroup_TB_ACABAMENTO = new Ext.ButtonGroup({
                        items: [{
                            text: 'Salvar',
                            icon: 'imagens/icones/database_save_24.gif',
                            scale: 'medium',
                            handler: function() {
                                GravaDados_TB_ACABAMENTO();
                            }
                        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Acabamento',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_ACABAMENTO.items.items[32].disable();

                                    formACABAMENTO.getForm().items.items[0].enable();

                                    formACABAMENTO.getForm().findField('NORMA').focus();
                                    formACABAMENTO.getForm().reset();
                                    panelCadastroACABAMENTO.setTitle('Novo Acabamento');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_ACABAMENTO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_ACABAMENTO();
                                 }
}]
                    });

                    var toolbar_TB_ACABAMENTO = new Ext.Toolbar({
                        style: 'text-align: right;',
                        items: [buttonGroup_TB_ACABAMENTO]
                    });

                    var TXT_FILTRO = new Ext.form.TextField({
                        fieldLabel: 'Descri&ccedil;&atilde;o',
                        width: 250,
                        listeners: {
                            specialkey: function(f, e) {
                                if (e.getKey() == e.ENTER) {
                                    TB_ACABAMENTO_CARREGA_GRID();
                                }
                            }
                        }
                    });

                    var BTN_PESQUISA = new Ext.Button({
                        text: 'Buscar',
                        icon: 'imagens/icones/database_search_16.gif',
                        scale: 'small',
                        handler: function() {
                            TB_ACABAMENTO_CARREGA_GRID();
                        }
                    });

                    var panelCadastroACABAMENTO = new Ext.Panel({
                        width: '100%',
                        border: true,
                        title: 'Novo Acabamento',
                        items: [formACABAMENTO, toolbar_TB_ACABAMENTO, gridACABAMENTO, ACABAMENTO_PagingToolbar.PagingToolbar(), {
                            frame: true,
                            bodyStyle: 'padding:5px 5px 0',
                            width: '100%',
                            items: [{
                                layout: 'column',
                                items: [{
                                    columnWidth: 0.30,
                                    layout: 'form',
                                    labelWidth: 70,
                                    items: [TXT_FILTRO]
                                }, {
                                    columnWidth: 0.16,
                                    items: [BTN_PESQUISA]
}]
}]
}]
                                });

                                function GravaDados_TB_ACABAMENTO() {
                                    if (!formACABAMENTO.getForm().isValid()) {
                                        return;
                                    }

                                    var dados = {
                                        ID_ACABAMENTO_SUPERFICIAL: Ext.getCmp('ID_ACABAMENTO_SUPERFICIAL').getValue(),
                                        DESCRICAO_ACABAMENTO: Ext.getCmp('DESCRICAO_ACABAMENTO').getValue(),
                                        NORMA: Ext.getCmp('NORMA').getValue(),
                                        ASPECTO_VISUAL: Ext.getCmp('ASPECTO_VISUAL').getValue(),
                                        ADERENCIA: Ext.getCmp('ADERENCIA').getValue(),
                                        SALT_SPRAY_CB: Ext.getCmp('SALT_SPRAY_CB').getValue(),
                                        SALT_SPRAY_CV: Ext.getCmp('SALT_SPRAY_CV').getValue(),
                                        DESIDROGENACAO: Ext.getCmp('DESIDROGENACAO').getValue(),
                                        TEMPERATURA: Ext.getCmp('TEMPERATURA').getValue(),
                                        CAMADA: Ext.getCmp('CAMADA').getValue(),
                                        ENSAIO_PREECE: Ext.getCmp('ENSAIO_PREECE').getValue(),
                                        PESO_CAMADA_ZINCO: Ext.getCmp('PESO_CAMADA_ZINCO').getValue(),
                                        ID_USUARIO: _ID_USUARIO
                                    };

                                    var Url = panelCadastroACABAMENTO.title == "Novo Acabamento" ?
                        'servicos/TB_ACABAMENTO_SUPERFICIAL.asmx/GravaNovoAcabamento' :
                        'servicos/TB_ACABAMENTO_SUPERFICIAL.asmx/AtualizaAcabamento';

                                    var _ajax = new Th2_Ajax();
                                    _ajax.setUrl(Url);
                                    _ajax.setJsonData({ dados: dados });

                                    var _sucess = function(response, options) {
                                        if (panelCadastroACABAMENTO.title == "Novo Acabamento") {
                                            formACABAMENTO.getForm().reset();
                                        }

                                        formACABAMENTO.getForm().findField('NORMA').focus();

                                        TB_ACABAMENTO_CARREGA_GRID();
                                        TB_ACABAMENTO_COMBO();
                                    };

                                    _ajax.setSucesso(_sucess);
                                    _ajax.Request();
                                }

                                function Deleta_TB_ACABAMENTO() {
                                    dialog.MensagemDeConfirmacao('Deseja deletar este Registro?', 'formACABAMENTO', Deleta);

                                    function Deleta(btn) {
                                        if (btn == 'yes') {

                                            var _ajax = new Th2_Ajax();
                                            _ajax.setUrl('servicos/TB_ACABAMENTO_SUPERFICIAL.asmx/DeletaAcabamento');
                                            _ajax.setJsonData({ 
                                                ID_ACABAMENTO_SUPERFICIAL: Ext.getCmp('ID_ACABAMENTO_SUPERFICIAL').getValue(),
                                                ID_USUARIO: _ID_USUARIO
                                            });

                                            var _sucess = function(response, options) {
                                                panelCadastroACABAMENTO.setTitle("Novo Acabamento");
                                                Ext.getCmp('NORMA').focus();
                                                formACABAMENTO.getForm().reset();

                                                buttonGroup_TB_ACABAMENTO.items.items[32].disable();
                                                formACABAMENTO.getForm().items.items[0].enable();

                                                TB_ACABAMENTO_CARREGA_GRID();
                                                TB_ACABAMENTO_COMBO();
                                            };

                                            _ajax.setSucesso(_sucess);
                                            _ajax.Request();
                                        }
                                    }
                                }

                                gridACABAMENTO.setHeight(AlturaDoPainelDeConteudo(formACABAMENTO.height) - 169);

                                TB_ACABAMENTO_CARREGA_GRID();

                                return panelCadastroACABAMENTO;
                            }