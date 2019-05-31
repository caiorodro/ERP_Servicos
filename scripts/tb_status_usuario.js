function MontaCadastroStatusUsuario() {

    var CB_ID_USUARIO_STATUS = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Usu&aacute;rio',
        id: 'ID_USUARIO_STATUS',
        name: 'ID_USUARIO_STATUS',
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

    var STATUS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
            ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO']
            )
    });

    function iconeAcesso(val) {
        if (val.length > 0)
            return "<span><img src='" + val + "'></span>";
    }

    var grid_STATUS = new Ext.grid.GridPanel({
        id: 'grid_STATUS',
        store: STATUS_Store,
        columns: [
                    { id: 'CODIGO_STATUS_PEDIDO', header: "C&oacute;digo", width: 70, sortable: true, dataIndex: 'CODIGO_STATUS_PEDIDO' },
                    { id: 'DESCRICAO_STATUS_PEDIDO', header: "Descri&ccedil;&atilde;o", width: 300, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO' }
                    ],
        stripeRows: true,
        height: 140,
        width: 500,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    /////////////////////////
    var formSTATUS_USUARIO = new Ext.FormPanel({
        id: 'formSTATUS_USUARIO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 250,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Permiss&atilde;o de Fases de Pedido por Usu&aacute;rio',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [CB_ID_USUARIO_STATUS]
            }, {
                layout: 'form',
                items: [grid_STATUS]
            }]
        }]
    });

    var TB_STATUS_PEDIDO_USUARIO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_USUARIO_STATUS', 'LOGIN_USUARIO', 'NOME_USUARIO', 'DESCRICAO_STATUS_PEDIDO', 'CODIGO_STATUS_PEDIDO']
                    )
    });

    var gridSTATUS_PEDIDO_USUARIO = new Ext.grid.GridPanel({
        id: 'gridSTATUS_PEDIDO_USUARIO',
        store: TB_STATUS_PEDIDO_USUARIO,
        columns: [
                    { id: 'ID_USUARIO_STATUS', header: "ID do Usu&aacute;rio", width: 100, sortable: true, dataIndex: 'ID_USUARIO_STATUS', hidden: true },
                    { id: 'LOGIN_USUARIO', header: "Login do Usu&aacute;rio", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                    { id: 'NOME_USUARIO', header: "Nome do Usu&aacute;rio", width: 320, sortable: true, dataIndex: 'NOME_USUARIO' },
                    { id: 'DESCRICAO_STATUS_PEDIDO', header: "Status do Pedido", width: 300, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaACESSO_JsonData() {
        var _id_usuario = Ext.getCmp('ID_USUARIO_STATUS_FILTRO') ?
                    Ext.getCmp('ID_USUARIO_STATUS_FILTRO').getValue() : 0;

        if (_id_usuario == '')
            _id_usuario = 0;

        var ACESSO_JsonData = {
            ID_USUARIO: _id_usuario,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return ACESSO_JsonData;
    }

    var STATUS_PagingToolbar = new Th2_PagingToolbar();
    STATUS_PagingToolbar.setUrl('servicos/TB_STATUS_PEDIDO_USUARIO.asmx/Carrega_STATUS_USUARIO');
    STATUS_PagingToolbar.setParamsJsonData(RetornaACESSO_JsonData());
    STATUS_PagingToolbar.setStore(TB_STATUS_PEDIDO_USUARIO);

    function TB_STATUS_CARREGA_GRID() {
        STATUS_PagingToolbar.setParamsJsonData(RetornaACESSO_JsonData());
        STATUS_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_ACESSO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_STATUS_USUARIO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Status de Pedido X Usu&aacute;rio',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    panelCadastrosSTATUS_PEDIDO_USUARIO.setTitle('Novo Status de Pedido X Usu&aacute;rio');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_STATUS_PEDIDO_USUARIO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 handler: function () {
                                     Deleta_TB_STATUS_PEDIDO_USUARIO();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Permitir todas as fases para este usu&aacute;rio',
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

    var CB_STATUS_PEDIDO_FILTRO = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Usu&aacute;rio',
        id: 'ID_USUARIO_STATUS_FILTRO',
        name: 'ID_USUARIO_STATUS_FILTRO',
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
                    TB_STATUS_CARREGA_GRID();
            }
        }
    });

    var BTN_TB_STATUS_PEDIDO_USUARIO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_STATUS_CARREGA_GRID();
        }
    });

    var panelCadastrosSTATUS_PEDIDO_USUARIO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Status de Pedido X Usu&aacute;rio',
        items: [formSTATUS_USUARIO, toolbar_TB_ACESSO, gridSTATUS_PEDIDO_USUARIO, STATUS_PagingToolbar.PagingToolbar(),
                {
                    layout: 'column',
                    labelAlign: 'left',
                    frame: true,
                    items: [{
                        columnWidth: 0.27,
                        labelWidth: 50,
                        layout: 'form',
                        items: [CB_STATUS_PEDIDO_FILTRO]
                    }, {
                        columnWidth: 0.10,
                        layout: 'form',
                        items: [BTN_TB_STATUS_PEDIDO_USUARIO]
                    }]
                }]
    });

    function PermiteTodosItens() {
        if (!formSTATUS_USUARIO.getForm().isValid()) {
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_STATUS_PEDIDO_USUARIO.asmx/CadastraStatusParaUmUsuario');
        _ajax.setJsonData({ ID_USUARIO: Ext.getCmp('ID_USUARIO_STATUS').getValue() });

        var _sucess = function (response, options) {
            TB_STATUS_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function GravaDados_TB_STATUS_USUARIO() {
        if (!formSTATUS_USUARIO.getForm().isValid()) {
            return;
        }

        if (Ext.getCmp('grid_STATUS').getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione um registro no grid para gravar', 'grid_STATUS');
            return;
        }

        var dados = {
            ID_USUARIO_STATUS: Ext.getCmp('ID_USUARIO_STATUS').getValue(),
            CODIGO_STATUS_PEDIDO: Ext.getCmp('grid_STATUS').getSelectionModel().getSelected().data.CODIGO_STATUS_PEDIDO,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = 'servicos/TB_STATUS_PEDIDO_USUARIO.asmx/GravaNovoStatusUsuario';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            formSTATUS_USUARIO.getForm().findField('ID_USUARIO_STATUS').focus();

            TB_STATUS_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_STATUS_PEDIDO_USUARIO() {

        if (Ext.getCmp('gridSTATUS_PEDIDO_USUARIO').getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione um registro no grid para deletar', 'gridSTATUS_PEDIDO_USUARIO');
            return;
        }

        var record = Ext.getCmp('gridSTATUS_PEDIDO_USUARIO').getSelectionModel().getSelected();

        dialog.MensagemDeConfirmacao('Deseja deletar este Registro?', 'formSTATUS_USUARIO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_STATUS_PEDIDO_USUARIO.asmx/DeletaStatusUsuario');
                _ajax.setJsonData({
                    CODIGO_STATUS_PEDIDO: record.data.CODIGO_STATUS_PEDIDO,
                    ID_USUARIO: record.data.ID_USUARIO_STATUS
                });

                var _sucess = function (response, options) {
                    panelCadastrosSTATUS_PEDIDO_USUARIO.setTitle("Novo Status de Pedido X Usu&aacute;rio");
                    Ext.getCmp('ID_USUARIO_STATUS').focus();

                    TB_STATUS_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridSTATUS_PEDIDO_USUARIO.setHeight(AlturaDoPainelDeConteudo(formSTATUS_USUARIO.height) - 165);

    TH2_CARREGA_USUARIOS();
    TB_STATUS_CARREGA_GRID();

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_STATUS_PEDIDO_USUARIO.asmx/Carrega_Status');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        STATUS_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();

    return panelCadastrosSTATUS_PEDIDO_USUARIO;
}