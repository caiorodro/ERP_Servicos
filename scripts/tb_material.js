var combo_TB_MATERIAL = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_MATERIAL', 'DESCRICAO_MATERIAL']
       )
});

function TB_MATERIAL_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_MATERIAL.asmx/Lista_Material');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_MATERIAL.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroMaterial() {

    var TXT_ID_MATERIAL = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_MATERIAL',
        id: 'ID_MATERIAL',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_DESCRICAO_MATERIAL = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        name: 'DESCRICAO_MATERIAL',
        id: 'DESCRICAO_MATERIAL',
        allowBlank: false,
        width: 180,
        maxlength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TXT_CARBONO = new Ext.form.TextField({
        fieldLabel: 'Carbono',
        name: 'CARBONO',
        id: 'CARBONO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_FOSFORO = new Ext.form.TextField({
        fieldLabel: 'F&oacute;sforo',
        name: 'FOSFORO',
        id: 'FOSFORO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ENXOFRE = new Ext.form.TextField({
        fieldLabel: 'Enxofre',
        name: 'ENXOFRE',
        id: 'ENXOFRE',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_SILICIO = new Ext.form.TextField({
        fieldLabel: 'Sil&iacute;cio',
        name: 'SILICIO',
        id: 'SILICIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_MANGANES = new Ext.form.TextField({
        fieldLabel: 'Mangan&ecirc;s',
        name: 'MANGANES',
        id: 'MANGANES',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_CROMO = new Ext.form.TextField({
        fieldLabel: 'Cromo',
        name: 'CROMO',
        id: 'CROMO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_NIQUEL = new Ext.form.TextField({
        fieldLabel: 'N&iacute;quel',
        name: 'NIQUEL',
        id: 'NIQUEL',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_MOLIBDENIO = new Ext.form.TextField({
        fieldLabel: 'Molibd&ecirc;nio',
        name: 'MOLIBDENIO',
        id: 'MOLIBDENIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ALUMINIO = new Ext.form.TextField({
        fieldLabel: 'Alum&iacute;nio',
        name: 'ALUMINIO',
        id: 'ALUMINIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_COBRE = new Ext.form.TextField({
        fieldLabel: 'Cobre',
        name: 'COBRE',
        id: 'COBRE',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ZINCO = new Ext.form.TextField({
        fieldLabel: 'Zinco',
        name: 'ZINCO',
        id: 'ZINCO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_FERRO = new Ext.form.TextField({
        fieldLabel: 'Ferro',
        name: 'FERRO',
        id: 'FERRO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_CHUMBO = new Ext.form.TextField({
        fieldLabel: 'Chumbo',
        name: 'CHUMBO',
        id: 'CHUMBO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_TITANIO = new Ext.form.TextField({
        fieldLabel: 'Tit&acirc;nio',
        name: 'TITANIO',
        id: 'TITANIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ESTANHO = new Ext.form.TextField({
        fieldLabel: 'Estanho',
        name: 'ESTANHO',
        id: 'ESTANHO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_BISMUTO = new Ext.form.TextField({
        fieldLabel: 'Bismuto',
        name: 'BISMUTO',
        id: 'BISMUTO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_ANTIMONIO = new Ext.form.TextField({
        fieldLabel: 'Antim&ocirc;nio',
        name: 'ANTIMONIO',
        id: 'ANTIMONIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_BORO = new Ext.form.TextField({
        fieldLabel: 'Boro',
        name: 'BORO',
        id: 'BORO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_NITROGENIO = new Ext.form.TextField({
        fieldLabel: 'Nitrog&ecirc;nio',
        name: 'NITROGENIO',
        id: 'NITROGENIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_NITROGENIO = new Ext.form.TextField({
        fieldLabel: 'Nitrog&ecirc;nio',
        name: 'NITROGENIO',
        id: 'NITROGENIO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_CIANETO = new Ext.form.TextField({
        fieldLabel: 'Cianeto',
        name: 'CIANETO',
        id: 'CIANETO',
        width: 100,
        maxlength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var formMATERIAL = new Ext.FormPanel({
        id: 'formMATERIAL',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 220,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [TXT_ID_MATERIAL]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_DESCRICAO_MATERIAL]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .14,
                layout: 'form',
                items: [TXT_CARBONO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_FOSFORO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_ENXOFRE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_SILICIO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_MANGANES]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_CROMO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_NIQUEL]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .14,
                layout: 'form',
                items: [TXT_MOLIBDENIO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_ALUMINIO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_COBRE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_ZINCO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_FERRO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_CHUMBO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_TITANIO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .14,
                layout: 'form',
                items: [TXT_ESTANHO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_BISMUTO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_ANTIMONIO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_BORO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_NITROGENIO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TXT_CIANETO]
            }]
        }]
    });

    function PopulaFormulario_TB_MATERIAL(record) {
        formMATERIAL.getForm().loadRecord(record);
        panelCadastroMATERIAL.setTitle('Alterar dados do Material');

        buttonGroup_TB_MATERIAL.items.items[32].enable();
        formMATERIAL.getForm().items.items[0].disable();

        formMATERIAL.getForm().findField('DESCRICAO_MATERIAL').focus();
    }

    var TB_MATERIAL_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_MATERIAL', 'DESCRICAO_MATERIAL', 'CARBONO', 'FOSFORO', 'ENXOFRE', 'SILICIO', 'MANGANES', 'CROMO', 'NIQUEL',
                    'MOLIBDENIO', 'ALUMINIO', 'COBRE', 'ZINCO', 'FERRO', 'CHUMBO', 'TITANIO', 'ESTANHO', 'BISMUTO', 'ANTIMONIO', 'BORO',
                    'NITROGENIO', 'CIANETO']
                    )
    });

    var gridMATERIAL = new Ext.grid.GridPanel({
        id: 'gridMATERIAL',
        store: TB_MATERIAL_Store,
        columns: [
                    { id: 'ID_MATERIAL', header: "C&oacute;digo", width: 65, sortable: true, dataIndex: 'ID_MATERIAL' },
                    { id: 'DESCRICAO_MATERIAL', header: "Descri&ccedil;&atilde;o", width: 180, sortable: true, dataIndex: 'DESCRICAO_MATERIAL' },

                    { id: 'CARBONO', header: "Carbono", width: 90, sortable: true, dataIndex: 'CARBONO', align: 'center' },
                    { id: 'FOSFORO', header: "F&oacute;sforo", width: 90, sortable: true, dataIndex: 'FOSFORO', align: 'center' },
                    { id: 'ENXOFRE', header: "Enxofre", width: 100, sortable: true, dataIndex: 'ENXOFRE', align: 'center' },
                    { id: 'SILICIO', header: "Sil&iacute;cio", width: 90, sortable: true, dataIndex: 'SILICIO', align: 'center' },
                    { id: 'MANGANES', header: "Mangan&ecirc;s", width: 90, sortable: true, dataIndex: 'MANGANES', align: 'center' },
                    { id: 'CROMO', header: "Cromo", width: 90, sortable: true, dataIndex: 'CROMO', align: 'center' },
                    { id: 'NIQUEL', header: "N&iacute;quel", width: 90, sortable: true, dataIndex: 'NIQUEL', align: 'center' },
                    { id: 'MOLIBDENIO', header: "Molibd&ecirc;nio", width: 90, sortable: true, dataIndex: 'MOLIBDENIO', align: 'center' },
                    { id: 'ALUMINIO', header: "Alum&iacute;nio", width: 90, sortable: true, dataIndex: 'ALUMINIO', align: 'center' },
                    { id: 'COBRE', header: "Cobre", width: 90, sortable: true, dataIndex: 'COBRE', align: 'center' },
                    { id: 'ZINCO', header: "Zinco", width: 90, sortable: true, dataIndex: 'ZINCO', align: 'center' },
                    { id: 'FERRO', header: "Ferro", width: 90, sortable: true, dataIndex: 'FERRO', align: 'center' },
                    { id: 'CHUMBO', header: "Chumbo", width: 90, sortable: true, dataIndex: 'CHUMBO', align: 'center' },
                    { id: 'TITANIO', header: "Tit&acirc;nio", width: 90, sortable: true, dataIndex: 'TITANIO', align: 'center' },
                    { id: 'ESTANHO', header: "Estanho", width: 90, sortable: true, dataIndex: 'ESTANHO', align: 'center' },
                    { id: 'BISMUTO', header: "Bismuto", width: 90, sortable: true, dataIndex: 'BISMUTO', align: 'center' },
                    { id: 'ANTIMONIO', header: "Antim&ocirc;nio", width: 90, sortable: true, dataIndex: 'ANTIMONIO', align: 'center' },
                    { id: 'BORO', header: "Boro", width: 90, sortable: true, dataIndex: 'BORO', align: 'center' },
                    { id: 'NITROGENIO', header: "Nitrog&ecirc;nio", width: 90, sortable: true, dataIndex: 'NITROGENIO', align: 'center' },
                    { id: 'CIANETO', header: "Cianeto", width: 90, sortable: true, dataIndex: 'NITROGENIO', align: 'center' }

                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormulario_TB_MATERIAL(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridMATERIAL.getSelectionModel().getSelections().length > 0) {
                        var record = gridMATERIAL.getSelectionModel().getSelected();
                        PopulaFormulario_TB_MATERIAL(record);
                    }
                }
            }
        }
    });

    function RetornaMATERIAL_JsonData() {
        var CLAS_FISCAL_JsonData = {
            DESCRICAO: TXT_FILTRO.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var MATERIAL_PagingToolbar = new Th2_PagingToolbar();
    MATERIAL_PagingToolbar.setUrl('servicos/TB_MATERIAL.asmx/Carrega_Material');
    MATERIAL_PagingToolbar.setStore(TB_MATERIAL_Store);

    function TB_MATERIAL_CARREGA_GRID() {
        MATERIAL_PagingToolbar.setParamsJsonData(RetornaMATERIAL_JsonData());
        MATERIAL_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_MATERIAL = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_MATERIAL();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Material',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_MATERIAL.items.items[32].disable();

                                    formMATERIAL.getForm().items.items[0].enable();

                                    formMATERIAL.getForm().findField('DESCRICAO_MATERIAL').focus();
                                    formMATERIAL.getForm().reset();
                                    panelCadastroMATERIAL.setTitle('Novo Material');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_MATERIAL',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_MATERIAL();
                                 }
                             }]
    });

    var toolbar_TB_MATERIAL = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_MATERIAL]
    });

    var TXT_FILTRO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_MATERIAL_CARREGA_GRID();
                }
            }
        }
    });

    var BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_MATERIAL_CARREGA_GRID();
        }
    });

    var panelCadastroMATERIAL = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Material',
        items: [formMATERIAL, toolbar_TB_MATERIAL, gridMATERIAL, MATERIAL_PagingToolbar.PagingToolbar(), {
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

    function GravaDados_TB_MATERIAL() {
        if (!formMATERIAL.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_MATERIAL: Ext.getCmp('ID_MATERIAL').getValue(),
            DESCRICAO_MATERIAL: Ext.getCmp('DESCRICAO_MATERIAL').getValue(),
            CARBONO: Ext.getCmp('CARBONO').getValue(),
            FOSFORO: Ext.getCmp('FOSFORO').getValue(),
            ENXOFRE: Ext.getCmp('ENXOFRE').getValue(),
            SILICIO: Ext.getCmp('SILICIO').getValue(),
            MANGANES: Ext.getCmp('MANGANES').getValue(),
            CROMO: Ext.getCmp('CROMO').getValue(),
            NIQUEL: Ext.getCmp('NIQUEL').getValue(),
            MOLIBDENIO: Ext.getCmp('MOLIBDENIO').getValue(),
            ALUMINIO: Ext.getCmp('ALUMINIO').getValue(),
            COBRE: Ext.getCmp('COBRE').getValue(),
            ZINCO: Ext.getCmp('ZINCO').getValue(),
            FERRO: Ext.getCmp('FERRO').getValue(),
            CHUMBO: Ext.getCmp('CHUMBO').getValue(),
            TITANIO: Ext.getCmp('TITANIO').getValue(),
            ESTANHO: Ext.getCmp('ESTANHO').getValue(),
            BISMUTO: Ext.getCmp('BISMUTO').getValue(),
            ANTIMONIO: Ext.getCmp('ANTIMONIO').getValue(),
            BORO: Ext.getCmp('BORO').getValue(),
            NITROGENIO: Ext.getCmp('NITROGENIO').getValue(),
            CIANETO: Ext.getCmp('CIANETO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroMATERIAL.title == "Novo Material" ?
                        'servicos/TB_MATERIAL.asmx/GravaNovoMaterial' :
                        'servicos/TB_MATERIAL.asmx/AtualizaMaterial';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroMATERIAL.title == "Novo Material") {
                formMATERIAL.getForm().reset();
            }

            formMATERIAL.getForm().findField('DESCRICAO_MATERIAL').focus();

            TB_MATERIAL_CARREGA_GRID();
            TB_MATERIAL_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_MATERIAL() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Material [' +
                        formMATERIAL.getForm().findField('DESCRICAO_MATERIAL').getValue() + ']?', 'formMATERIAL', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_MATERIAL.asmx/DeletaMaterial');
                _ajax.setJsonData({ ID_MATERIAL: Ext.getCmp('ID_MATERIAL').getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    panelCadastroMATERIAL.setTitle("Novo Material");
                    Ext.getCmp('DESCRICAO_MATERIAL').focus();
                    formMATERIAL.getForm().reset();

                    buttonGroup_TB_MATERIAL.items.items[32].disable();
                    formMATERIAL.getForm().items.items[0].enable();

                    TB_MATERIAL_CARREGA_GRID();
                    TB_MATERIAL_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridMATERIAL.setHeight(AlturaDoPainelDeConteudo(formMATERIAL.height) - 169);

    TB_MATERIAL_CARREGA_GRID();

    return panelCadastroMATERIAL;
}
