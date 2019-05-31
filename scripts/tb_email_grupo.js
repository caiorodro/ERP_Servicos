function janela_Grupo_Email() {

    var hID_GRUPO_EMAIL = new Ext.form.Hidden({
        value: 0
    });

    var TXT_GRUPO_EMAIL = new Ext.form.TextField({
        fieldLabel: 'Nome do Grupo',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false
    });

    var TXT_EMAIL_CONTIDO = new Ext.form.TextField({
        fieldLabel: 'e-mail Contido',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        vtype: 'email',
        allowBlank: false
    });

    var TXT_FILTRO = new Ext.form.TextField({
        fieldLabel: 'Filtro Contato',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER)
                    CARREGA_GRID();
            }
        }
    });

    var BTN_FILTRO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function() {
            CARREGA_GRID();
        }
    });

    var formEMAIL_CONTIDO = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 120,
        items: [{
            layout: 'form',
            items: [TXT_GRUPO_EMAIL]
        }, {
            layout: 'form',
            items: [TXT_EMAIL_CONTIDO]
}]

        });

        var EMAIL_CONTIDO_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['ID_USUARIO', 'EMAIL_CONTIDO', 'NOME_GRUPO_EMAIL', 'ID_GRUPO_EMAIL'])
        });

        var gridEMAIL_CONTIDO = new Ext.grid.GridPanel({
            store: EMAIL_CONTIDO_Store,
            columns: [
                    { id: 'NOME_GRUPO_EMAIL', header: "Grupo", width: 300, sortable: true, dataIndex: 'NOME_GRUPO_EMAIL' },
                    { id: 'EMAIL_CONTIDO', header: "E-mail contido", width: 300, sortable: true, dataIndex: 'EMAIL_CONTIDO' }
                    ],
            stripeRows: true,
            height: 250,
            width: '100%',

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        gridEMAIL_CONTIDO.on('rowdblclick', function(grid, rowIndex, e) {
            var record = grid.getStore().getAt(rowIndex);
            PopulaFormulario(record);
        });

        gridEMAIL_CONTIDO.on('keydown', function(e) {
            if (e.getKey() == e.ENTER) {
                if (gridEMAIL_CONTIDO.getSelectionModel().getSelections().length > 0) {
                    var record = gridEMAIL_CONTIDO.getSelectionModel().getSelected();
                    PopulaFormulario(record);
                }
            }
        });

        function PopulaFormulario(record) {
            hID_GRUPO_EMAIL.setValue(record.data.ID_GRUPO_EMAIL);
            TXT_EMAIL_CONTIDO.setValue(record.data.EMAIL_CONTIDO);
            TXT_GRUPO_EMAIL.setValue(record.data.NOME_GRUPO_EMAIL);

            panelCadastroGRUPO.setTitle('Alterar Grupo');

            Ext.getCmp('BTN_DELETAR_GRUPO').enable();

            TXT_GRUPO_EMAIL.disable();

            TXT_EMAIL_CONTIDO.focus();
        }

        function RetornaVENDA_JsonData() {
            var x = TXT_FILTRO.getValue();

            if (!x)
                x = '';

            var CLAS_FISCAL_JsonData = {
                ID_USUARIO: _ID_USUARIO,
                EMAIL_CONTIDO: x,
                start: 0,
                limit: Th2_LimiteDeLinhasPaginacao
            };

            return CLAS_FISCAL_JsonData;
        }

        var CONTATO_PagingToolbar = new Th2_PagingToolbar();
        CONTATO_PagingToolbar.setUrl('servicos/TB_EMAIL_GRUPO.asmx/Carrega_Grupo');
        CONTATO_PagingToolbar.setStore(EMAIL_CONTIDO_Store);

        function CARREGA_GRID() {
            CONTATO_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
            CONTATO_PagingToolbar.doRequest();
        }

        ///////////////////////////
        var buttonGroup1 = new Ext.ButtonGroup({
            items: [{
                text: 'Salvar',
                icon: 'imagens/icones/database_save_24.gif',
                scale: 'medium',
                handler: function() {
                    GravaDados_TB_EMAIL_CONTIDO();
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Novo Grupo',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function() {
                            TXT_GRUPO_EMAIL.enable();
                            TXT_GRUPO_EMAIL.focus();

                            Reseta_Formulario();

                            Ext.getCmp('BTN_DELETAR_GRUPO').disable();

                            panelCadastroGRUPO.setTitle('Novo Grupo');
                        }
                    },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        id: 'BTN_DELETAR_GRUPO',
                        text: 'Deletar',
                        icon: 'imagens/icones/database_delete_24.gif',
                        scale: 'medium',
                        disabled: true,
                        listeners: {
                            click: function(button, e) {
                                Deleta_TB_EMAIL_CONTIDO();
                            }
                        }
}]
        });

        function Reseta_Formulario() {
            hID_GRUPO_EMAIL.setValue(0);
            TXT_EMAIL_CONTIDO.reset();
        }

        var toolbar1 = new Ext.Toolbar({
            style: 'text-align: right;',
            items: [buttonGroup1]
        });

        var panelCadastroGRUPO = new Ext.Panel({
            width: '100%',
            border: true,
            title: 'Novo Grupo',
            items: [formEMAIL_CONTIDO, toolbar1, gridEMAIL_CONTIDO, CONTATO_PagingToolbar.PagingToolbar()]
        });

        function GravaDados_TB_EMAIL_CONTIDO() {
            if (!formEMAIL_CONTIDO.getForm().isValid()) {
                return;
            }

            var Url = panelCadastroGRUPO.title == 'Novo Grupo' ?
                'servicos/TB_EMAIL_GRUPO.asmx/Grava_Novo_Grupo' :
                'servicos/TB_EMAIL_GRUPO.asmx/Atualiza_Grupo';

            var dados = {
                ID_USUARIO: _ID_USUARIO,
                EMAIL_CONTIDO: TXT_EMAIL_CONTIDO.getValue(),
                NOME_GRUPO_EMAIL: TXT_GRUPO_EMAIL.getValue(),
                ID_GRUPO_EMAIL: hID_GRUPO_EMAIL.getValue()
            };

            var _ajax = new Th2_Ajax();
            _ajax.setUrl(Url);
            _ajax.setJsonData({ dados: dados });

            var _sucess = function(response, options) {
                if (panelCadastroGRUPO.title == 'Novo Grupo')
                    Reseta_Formulario();

                TXT_EMAIL_CONTIDO.focus();

                CARREGA_GRID();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        function Deleta_TB_EMAIL_CONTIDO() {
            dialog.MensagemDeConfirmacao('Deseja deletar este email?', formEMAIL_CONTIDO.getId(), Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_EMAIL_GRUPO.asmx/Deleta_Grupo');
                    _ajax.setJsonData({
                        ID_GRUPO_EMAIL: hID_GRUPO_EMAIL.getValue(),
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function(response, options) {

                        Reseta_Formulario();
                        panelCadastroGRUPO.setTitle('Novo Grupo');

                        Ext.getCmp('BTN_DELETAR_GRUPO').disable();
                        TXT_GRUPO_EMAIL.enable();

                        CARREGA_GRID();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }

        var wCONTATOS = new Ext.Window({
            title: 'Grupos de e-mail',
            layout: 'form',
            iconCls: 'icone_TB_USUARIO',
            width: 700,
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
            items: [panelCadastroGRUPO,
            {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .07,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Filtro:'
                }, {
                    columnWidth: .46,
                    items: [TXT_FILTRO]
                }, {
                    columnWidth: .12,
                    layout: 'form',
                    items: [BTN_FILTRO]
}]
}]
                });

                this.show = function(elm) {
                    CARREGA_GRID();
                    wCONTATOS.show(elm);
                };
            }