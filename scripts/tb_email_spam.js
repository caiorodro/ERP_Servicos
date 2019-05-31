function janela_Email_Spam() {

    var TXT_EMAIL_SPAM = new Ext.form.TextField({
        fieldLabel: 'e-mail (SPAM)',
        width: 400,
        maxLength: 120,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '120' },
        vtype: 'email',
        allowBlank: false
    });

    var TXT_FILTRO = new Ext.form.TextField({
        fieldLabel: 'Filtro e-mail (SPAM)',
        width: 300,
        maxLength: 120,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '120' },
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

    var formEMAIL_SPAM = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 80,
        items: [{
            layout: 'form',
            items: [TXT_EMAIL_SPAM]
}]

        });

        var EMAIL_SPAM_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            },
                    ['ID_USUARIO', 'EMAIL_SPAM']
                    )
        });

        var gridEMAIL_SPAM = new Ext.grid.GridPanel({
            store: EMAIL_SPAM_Store,
            columns: [
                    { id: 'EMAIL_SPAM', header: "Lista de SPAM", width: 400, sortable: true, dataIndex: 'EMAIL_SPAM' }
                    ],
            stripeRows: true,
            height: 290,
            width: '100%',

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        function RetornaVENDA_JsonData() {
            var x = TXT_FILTRO.getValue();

            if (!x)
                x = '';

            var CLAS_FISCAL_JsonData = {
                email: x,
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: Th2_LimiteDeLinhasPaginacao
            };

            return CLAS_FISCAL_JsonData;
        }

        var SPAM_PagingToolbar = new Th2_PagingToolbar();
        SPAM_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_SPAM');
        SPAM_PagingToolbar.setStore(EMAIL_SPAM_Store);

        function CARREGA_GRID() {
            SPAM_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
            SPAM_PagingToolbar.doRequest();
        }

        ///////////////////////////
        var buttonGroup_TB_EMAIL_SPAM = new Ext.ButtonGroup({
            items: [{
                text: 'Salvar',
                icon: 'imagens/icones/database_save_24.gif',
                scale: 'medium',
                handler: function() {
                    GravaDados_TB_EMAIL_SPAM();
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Deletar',
                                icon: 'imagens/icones/database_delete_24.gif',
                                scale: 'medium',
                                listeners: {
                                    click: function(button, e) {
                                        if (gridEMAIL_SPAM.getSelectionModel().selections.items.length == 0) {
                                            dialog.MensagemDeErro('Selecione um contato de SPAM', button.getId());
                                            return;
                                        }

                                        var email = gridEMAIL_SPAM.getSelectionModel().selections.items[0].data.EMAIL_SPAM;
                                        Deleta_TB_EMAIL_SPAM(email);
                                    }
                                }
}]
        });

        var toolbar1 = new Ext.Toolbar({
            style: 'text-align: right;',
            items: [buttonGroup_TB_EMAIL_SPAM]
        });

        var panelCadastroSPAM = new Ext.Panel({
            width: '100%',
            border: true,
            title: 'Definir e-mail como SPAM',
            items: [formEMAIL_SPAM, toolbar1, gridEMAIL_SPAM, SPAM_PagingToolbar.PagingToolbar()]
        });

        function GravaDados_TB_EMAIL_SPAM() {
            if (!formEMAIL_SPAM.getForm().isValid()) {
                return;
            }

            var Url = 'servicos/TB_EMAIL.asmx/Grava_Desmarca_SPAM';

            var _ajax = new Th2_Ajax();
            _ajax.setUrl(Url);
            _ajax.setJsonData({
                EMAIL_SPAM: TXT_EMAIL_SPAM.getValue(),
                SPAM: 1,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function(response, options) {
                formEMAIL_SPAM.getForm().reset();

                TXT_EMAIL_SPAM.focus();

                CARREGA_GRID();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        function Deleta_TB_EMAIL_SPAM(email) {
            dialog.MensagemDeConfirmacao('Deseja desmarcar este contato como SPAM?', formEMAIL_SPAM.getId(), Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_EMAIL.asmx/Grava_Desmarca_SPAM');
                    _ajax.setJsonData({
                        EMAIL_SPAM: email,
                        SPAM: 0,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function(response, options) {
                        formEMAIL_SPAM.getForm().reset();
                        TXT_EMAIL_SPAM.focus();

                        CARREGA_GRID();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }

        var wSPAM = new Ext.Window({
            title: 'Gerenciamento de SPAM',
            layout: 'form',
            iconCls: 'icone_SPAM',
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
            items: [panelCadastroSPAM,
            {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .15,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Filtro (e-mail):'
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
                    wSPAM.show(elm);
                };
            }