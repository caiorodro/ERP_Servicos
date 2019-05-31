function MontaCadastroAcessos() {

    var CB_ID_USUARIO_ACESSO = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Usu&aacute;rio',
        id: 'ID_USUARIO_ACESSO',
        name: 'ID_USUARIO_ACESSO',
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 200,
        allowBlank: false,
        msgTarget: 'side'
    });

    var MENU_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['MENU', 'ICONE']
                    )
    });

    function iconeAcesso(val) {
        if (val.length > 0)
            return "<span><img src='" + val + "'></span>";
    }

    var checkBoxSM1 = new Ext.grid.CheckboxSelectionModel();

    var gridMENU = new Ext.grid.GridPanel({
        id: 'gridMENU',
        store: MENU_Store,
        columns: [
        checkBoxSM1,
                    { id: 'ICONE', header: "", width: 30, sortable: true, dataIndex: 'ICONE', renderer: iconeAcesso },
                    { id: 'MENU', header: "Op&ccedil;&atilde;o de Menu - Item de Acesso", width: 420, sortable: true, dataIndex: 'MENU' }
                    ],
        stripeRows: true,
        height: 140,
        width: 500,

        sm: checkBoxSM1
    });

    /////////////////////////
    var formACESSO = new Ext.FormPanel({
        id: 'formACESSO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 250,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Controle de Direitos por Usu&aacute;rio',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [CB_ID_USUARIO_ACESSO]
            }, {
                layout: 'form',
                items: [gridMENU]
            }]
        }]
    });

    var TB_ACESSO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_USUARIO', 'LOGIN_USUARIO', 'NOME_USUARIO', 'MENU', 'ICONE']
                    )
    });

    var gridACESSO = new Ext.grid.GridPanel({
        id: 'gridACESSO',
        store: TB_ACESSO_Store,
        columns: [
                    { id: 'ID_USUARIO', header: "ID do Usu&aacute;rio", width: 100, sortable: true, dataIndex: 'ID_USUARIO', hidden: true },
                    { id: 'LOGIN_USUARIO', header: "Login do Usu&aacute;rio", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                    { id: 'NOME_USUARIO', header: "Nome do Usu&aacute;rio", width: 320, sortable: true, dataIndex: 'NOME_USUARIO' },
                    { id: 'ICONE', header: "", width: 40, sortable: true, dataIndex: 'ICONE', renderer: iconeAcesso },
                    { id: 'MENU', header: "Op&ccedil;&atilde;o de Menu - Item de Acesso", width: 420, sortable: true, dataIndex: 'MENU' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaACESSO_JsonData() {
        var _id_usuario = Ext.getCmp('ID_USUARIO_ACESSO_FILTRO') ?
                    Ext.getCmp('ID_USUARIO_ACESSO_FILTRO').getValue() : 0;

        if (_id_usuario == '')
            _id_usuario = 0;

        var ACESSO_JsonData = {
            ID_USUARIO: _id_usuario,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao,
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        };

        return ACESSO_JsonData;
    }

    var ACESSO_PagingToolbar = new Th2_PagingToolbar();
    ACESSO_PagingToolbar.setUrl('servicos/TB_ACESSO.asmx/Carrega_Acessos');
    ACESSO_PagingToolbar.setParamsJsonData(RetornaACESSO_JsonData());
    ACESSO_PagingToolbar.setStore(TB_ACESSO_Store);

    function TB_ACESSO_CARREGA_GRID() {
        ACESSO_PagingToolbar.setParamsJsonData(RetornaACESSO_JsonData());
        ACESSO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_ACESSO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_ACESSO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Acesso',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    panelCadastroACESSO.setTitle('Novo Acesso');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_ACESSO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 handler: function () {
                                     Deleta_TB_ACESSO();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Permitir todos os itens para este usu&aacute;rio',
                                 icon: 'imagens/icones/admin_ok_24.gif',
                                 scale: 'medium',
                                 handler: function () {
                                     PermiteTodosItens();
                                 }
                             }]
    });

    var toolbar_TB_ACESSO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_ACESSO]
    });

    var CB_ID_USUARIO_ACESSO_FILTRO = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Usu&aacute;rio',
        id: 'ID_USUARIO_ACESSO_FILTRO',
        name: 'ID_USUARIO_ACESSO_FILTRO',
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    TB_ACESSO_CARREGA_GRID();
            }
        }
    });

    var BTN_TB_ACESSO_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_ACESSO_CARREGA_GRID();
        }
    });

    var panelCadastroACESSO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Acesso',
        items: [formACESSO, toolbar_TB_ACESSO, gridACESSO, ACESSO_PagingToolbar.PagingToolbar(),
                {
                    layout: 'column',
                    labelAlign: 'left',
                    frame: true,
                    items: [{
                        columnWidth: 0.27,
                        labelWidth: 50,
                        layout: 'form',
                        items: [CB_ID_USUARIO_ACESSO_FILTRO]
                    }, {
                        columnWidth: 0.10,
                        layout: 'form',
                        items: [BTN_TB_ACESSO_PESQUISA]
                    }]
                }]
    });

    function PermiteTodosItens() {
        if (!formACESSO.getForm().isValid()) {
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ACESSO.asmx/CadastraDireitosParaUmUsuario');
        _ajax.setJsonData({
            ID_USUARIO: Ext.getCmp('ID_USUARIO_ACESSO').getValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            TB_ACESSO_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function GravaDados_TB_ACESSO() {
        if (!formACESSO.getForm().isValid()) {
            return;
        }

        if (Ext.getCmp('gridMENU').getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione um registro no grid para gravar', 'gridMENU');
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < gridMENU.getSelectionModel().selections.getCount(); i++) {
            var record = gridMENU.getSelectionModel().selections.items[i];
            arr1[i] = record.data.MENU;
        }

        var dados = {
            ID_USUARIO: formACESSO.getForm().findField('ID_USUARIO_ACESSO').getValue(),
            MENU: arr1,
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        };

        var Url = 'servicos/TB_ACESSO.asmx/GravaNovoAcesso';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            formACESSO.getForm().findField('ID_USUARIO_ACESSO').focus();

            TB_ACESSO_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_ACESSO() {

        if (Ext.getCmp('gridACESSO').getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione um registro no grid para deletar', 'gridACESSO');
            return;
        }

        var record = Ext.getCmp('gridACESSO').getSelectionModel().getSelected();

        dialog.MensagemDeConfirmacao('Deseja deletar este Acesso?', 'formACESSO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ACESSO.asmx/DeletaAcesso');
                _ajax.setJsonData({
                    ID_USUARIO: record.data.ID_USUARIO,
                    MENU: record.data.MENU,
                    ID_USUARIO_ORIGINAL: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroACESSO.setTitle("Novo Acesso");
                    Ext.getCmp('ID_USUARIO_ACESSO').focus();

                    TB_ACESSO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridACESSO.setHeight(AlturaDoPainelDeConteudo(formACESSO.height) - 165);

    TH2_CARREGA_USUARIOS();
    TB_ACESSO_CARREGA_GRID();

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ACESSO.asmx/CarregaItensDeMenu');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        MENU_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();

    return panelCadastroACESSO;
}
