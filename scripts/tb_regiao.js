var combo_TB_REGIAO_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_REGIAO', 'NOME_REGIAO']
       )
});

function TB_REGIAO_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_REGIAO_VENDAS.asmx/Lista_REGIAO');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_REGIAO_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroRegiao() {

    var TXT_CODIGO_REGIAO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        width: 50,
        name: 'CODIGO_REGIAO',
        id: 'CODIGO_REGIAO',
        maxLength: 5,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 5 }
    });

    var TXT_NOME_REGIAO = new Ext.form.TextField({
        fieldLabel: 'Nome da Regi&atilde;o',
        name: 'NOME_REGIAO',
        id: 'NOME_REGIAO',
        allowBlank: false,
        width: 300,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 50 }
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
            title: 'Regi&atilde;o de Vendas',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_CODIGO_REGIAO]
            }, {
                layout: 'form',
                items: [TXT_NOME_REGIAO]
            }]
        }]
    });

    function PopulaFormulario(record) {
        form1.getForm().loadRecord(record);
        panelCadastro.setTitle('Alterar dados da Regi&atilde;o');

        buttonGroup1.items.items[32].enable();

        TXT_CODIGO_REGIAO.focus();
    }

    var REGIAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['CODIGO_REGIAO', 'NOME_REGIAO']
                    )
    });

    var grid1 = new Ext.grid.GridPanel({
        store: REGIAO_Store,
        columns: [
                    { id: 'CODIGO_REGIAO', header: "C&oacute;digo", width: 100, sortable: true, dataIndex: 'CODIGO_REGIAO' },
                    { id: 'NOME_REGIAO', header: "Nome da Regi&atilde;o", width: 300, sortable: true, dataIndex: 'NOME_REGIAO' }
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

    function RetornaJsonData() {
        var CLAS_FISCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var REGIAO_PagingToolbar = new Th2_PagingToolbar();
    REGIAO_PagingToolbar.setUrl('servicos/TB_REGIAO_VENDAS.asmx/Carrega_Regiao');
    REGIAO_PagingToolbar.setStore(REGIAO_Store);

    function CARREGA_GRID() {
        REGIAO_PagingToolbar.setParamsJsonData(RetornaJsonData());
        REGIAO_PagingToolbar.doRequest();
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
                                text: 'Nova Regi&atilde;o',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup1.items.items[32].disable();

                                    TXT_CODIGO_REGIAO.focus();
                                    form1.getForm().reset();
                                    panelCadastro.setTitle('Nova Regi&atilde;o');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_REGIAO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_REGIAO();
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
        title: 'Nova Regi&atilde;o',
        items: [form1, toolbar1, grid1, REGIAO_PagingToolbar.PagingToolbar()]
    });

    function GravaDados() {
        if (!form1.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_REGIAO: TXT_CODIGO_REGIAO.getValue(),
            NOME_REGIAO: TXT_NOME_REGIAO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastro.title == "Nova Regi&atilde;o" ?
                        'servicos/TB_REGIAO_VENDAS.asmx/GravaNovaRegiao' :
                        'servicos/TB_REGIAO_VENDAS.asmx/AtualizaRegiao';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastro.title == "Nova Regi&atilde;o") {
                form1.getForm().reset();
            }

            TXT_CODIGO_REGIAO.focus();

            CARREGA_GRID();
            TB_REGIAO_CARREGA_COMBO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_REGIAO() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Regi&atilde;o [' +
                        TXT_NOME_REGIAO.getValue() + ']?', form1.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_REGIAO_VENDAS.asmx/DeletaRegiao');
                _ajax.setJsonData({
                    CODIGO_REGIAO: TXT_CODIGO_REGIAO.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastro.setTitle("Nova Regi&atilde;o");
                    TXT_CODIGO_REGIAO.focus();
                    form1.getForm().reset();

                    buttonGroup1.items.items[32].disable();

                    CARREGA_GRID();
                    TB_REGIAO_CARREGA_COMBO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    CARREGA_GRID();

    return panelCadastro;
}
