var combo_TB_CICLISTA_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_CICLISTA', 'NOME_CICLISTA']
       )
});

function TB_CICLISTA_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_CICLISTA.asmx/Lista_Ciclistas');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_CICLISTA_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroCiclista() {

    var TXT_ID_CICLISTA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 80,
        name: 'ID_CICLISTA',
        id: 'ID_CICLISTA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', disabled: true }
    });

    var TXT_NOME_CICLISTA = new Ext.form.TextField({
        fieldLabel: 'Nome do ciclista',
        name: 'NOME_CICLISTA',
        id: 'NOME_CICLISTA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 60,
        width: 350,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 60 }
    });

    var CB_CICLISTA_ATIVO = new Ext.form.ComboBox({
        fieldLabel: 'Ciclista ativo',
        id: 'CICLISTA_ATIVO',
        name: 'CICLISTA_ATIVO',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 70,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var form1 = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 170,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Cadastro de ciclistas',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_ID_CICLISTA]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .30,
                    layout: 'form',
                    items: [TXT_NOME_CICLISTA]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [CB_CICLISTA_ATIVO]
                }]
            }]
        }]
    });

    function PopulaFormulario_TB_LIMITE(record) {
        form1.getForm().loadRecord(record);
        panelCadastroCILISTA.setTitle('Alterar dados do Ciclista');

        buttonGroup1.items.items[32].enable();
        form1.getForm().items.items[0].disable();

        form1.getForm().findField('NOME_CICLISTA').focus();
    }

    var TB_CICLISTA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_CICLISTA', 'NOME_CICLISTA', 'CICLISTA_ATIVO']
                    )
    });

    var grid1 = new Ext.grid.GridPanel({
        store: TB_CICLISTA_Store,
        columns: [
                    { id: 'ID_CICLISTA', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'ID_CICLISTA' },
                    { id: 'NOME_CICLISTA', header: "Nome do ciclista", width: 400, sortable: true, dataIndex: 'NOME_CICLISTA' },
                    { id: 'CICLISTA_ATIVO', header: "Ciclista ativo", width: 100, sortable: true, dataIndex: 'CICLISTA_ATIVO', align: 'center',
                        renderer: TrataCombo01
                    }                    
                    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(296),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    grid1.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_LIMITE(record);
    });

    grid1.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (grid1.getSelectionModel().getSelections().length > 0) {
                var record = grid1.getSelectionModel().getSelected();
                PopulaFormulario_TB_LIMITE(record);
            }
        }
    });

    function RetornaLIMITE_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NOME_CICLISTA: '',
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var LIMITE_PagingToolbar = new Th2_PagingToolbar();
    LIMITE_PagingToolbar.setUrl('servicos/TB_CICLISTA.asmx/Carrega_Ciclistas');
    LIMITE_PagingToolbar.setParamsJsonData(RetornaLIMITE_JsonData());
    LIMITE_PagingToolbar.setStore(TB_CICLISTA_Store);

    function CARREGA_GRID() {
        LIMITE_PagingToolbar.setParamsJsonData(RetornaLIMITE_JsonData());
        LIMITE_PagingToolbar.doRequest();
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
                                text: 'Novo ciclista',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup1.items.items[32].disable();

                                    form1.getForm().items.items[0].enable();

                                    form1.getForm().findField('NOME_CICLISTA').focus();
                                    form1.getForm().reset();
                                    panelCadastroCILISTA.setTitle('Novo ciclista');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function (btn) {
                                     Deleta_Ciclista(btn);
                                 }
                             }]
    });

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastroCILISTA = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo ciclista',
        items: [form1, toolbar1, grid1, LIMITE_PagingToolbar.PagingToolbar()]
    });

    function GravaDados() {
        if (!form1.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_CICLISTA: form1.getForm().findField('ID_CICLISTA').getValue(),
            NOME_CICLISTA: form1.getForm().findField('NOME_CICLISTA').getValue(),
            CICLISTA_ATIVO: CB_CICLISTA_ATIVO.getValue() == '' ? 0 : CB_CICLISTA_ATIVO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroCILISTA.title == "Novo ciclista" ?
                        'servicos/TB_CICLISTA.asmx/GravaNovoCiclista' :
                        'servicos/TB_CICLISTA.asmx/AtualizaCiclista';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCILISTA.title == "Novo ciclista") {
                form1.getForm().reset();
            }

            form1.getForm().findField('NOME_CICLISTA').focus();

            CARREGA_GRID();
            TB_LIMITE_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_Ciclista() {
        dialog.MensagemDeConfirmacao('Deseja deletar este ciclista [' +
                        form1.getForm().findField('ID_CICLISTA').getValue() + ']?', form1.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CICLISTA.asmx/DeletaCiclista');
                _ajax.setJsonData({
                    ID_CICLISTA: TXT_ID_CICLISTA.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroCILISTA.setTitle("Novo ciclista");
                    Ext.getCmp('NOME_CICLISTA').focus();
                    form1.getForm().reset();

                    buttonGroup1.items.items[32].disable();
                    form1.getForm().items.items[0].enable();

                    CARREGA_GRID();
                    TB_CICLISTA_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    CARREGA_GRID();

    return panelCadastroCILISTA;
}