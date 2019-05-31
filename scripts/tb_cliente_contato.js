function CriaPanelTB_CLIENTE_CONTATO() {
    var TXT_ID_CONTATO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Contato',
        id: 'ID_CONTATO',
        name: 'ID_CONTATO',
        width: 85,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CONTATO_Busca(this);
                }
            }
        }
    });

    var TXT_NOME_CONTATO_CLIENTE = new Ext.form.TextField({
        id: 'NOME_CONTATO_CLIENTE',
        name: 'NOME_CONTATO_CLIENTE',
        fieldLabel: 'Nome do Contato',
        width: 390,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CONTATO_Busca(this);
                }
            }
        }
    });

    var TXT_TELEFONE_CONTATO_CLIENTE = new Ext.form.TextField({
        id: 'TELEFONE_CONTATO_CLIENTE',
        name: 'TELEFONE_CONTATO_CLIENTE',
        fieldLabel: 'Telefone',
        width: 180,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_FAX_CONTATO_CLIENTE = new Ext.form.TextField({
        id: 'FAX_CONTATO_CLIENTE',
        name: 'FAX_CONTATO_CLIENTE',
        fieldLabel: 'Fax',
        width: 180,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_EMAIL_CONTATO_CLIENTE = new Ext.form.TextField({
        id: 'EMAIL_CONTATO_CLIENTE',
        name: 'EMAIL_CONTATO_CLIENTE',
        fieldLabel: 'e-mail',
        width: 305,
        maxLength: 55,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '55' },
        vtype: 'email'
    });

    var TXT_OBS_CONTATO_CLIENTE = new Ext.form.TextField({
        id: 'OBS_CONTATO_CLIENTE',
        name: 'OBS_CONTATO_CLIENTE',
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 77,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var CB_RECEBE_COPIA_NOTA_ELETRONICA = new Ext.form.ComboBox({
        fieldLabel: 'Recebe C&oacute;pia de Nota Eletr&ocirc;nica',
        id: 'RECEBE_COPIA_NOTA_ELETRONICA',
        name: 'RECEBE_COPIA_NOTA_ELETRONICA',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 100,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var TXT_SENHA_PORTAL = new Ext.form.TextField({
        id: 'SENHA_PORTAL1',
        name: 'SENHA_PORTAL1',
        fieldLabel: 'Senha do portal',
        inputType: 'password',
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 25 },
        width: 150
    });

    var formCONTATOS = new Ext.FormPanel({
        id: 'formCONTATOS',
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        width: '100%',
        labelAlign: 'left',
        height: 262,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.20,
                layout: 'form',
                labelWidth: 65,
                labelAlign: 'top',
                items: [TXT_ID_CONTATO]
            }, {
                columnWidth: 0.70,
                layout: 'form',
                labelAlign: 'top',
                labelWidth: 45,
                items: [TXT_NOME_CONTATO_CLIENTE]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.20,
                labelAlign: 'top',
                layout: 'form',
                labelWidth: 65,
                items: [TXT_TELEFONE_CONTATO_CLIENTE]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                labelAlign: 'top',
                labelWidth: 45,
                items: [TXT_FAX_CONTATO_CLIENTE]
            }, {
                columnWidth: 0.35,
                labelWidth: 35,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_EMAIL_CONTATO_CLIENTE]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                labelAlign: 'top',
                layout: 'form',
                items: [CB_RECEBE_COPIA_NOTA_ELETRONICA]
            }, {
                columnWidth: .22,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_SENHA_PORTAL]
            }, {
                columnWidth: .45,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_OBS_CONTATO_CLIENTE]
            }]
        }]
    });

    var buttonGroup_TB_CLIENTE_CONTATO = new Ext.ButtonGroup({
        id: 'buttonGroup_TB_CLIENTE_CONTATO',
        items:
        [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_CLIENTE_CONTATO();
            }
        },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Novo Contato',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                PreparaNovoContato();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_DELETAR_TB_CLIENTE',
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'medium',
            disabled: true,
            handler: function () {
                Deleta_TB_CLIENTE_CONTATO();
            }
        }]
    });

    var toolbar_TB_CLIENTE_CONTATO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_CLIENTE_CONTATO]
    });

    function TrataCombo01(val) {
        var retorno = val == "0" ? "N&atilde;o" : "Sim";
        return retorno;
    }

    formCONTATOS.add(toolbar_TB_CLIENTE_CONTATO);

    /////////////////////// Grid
    var TB_CLIENTE_CONTATO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'ID_CONTATO', 'NOME_CONTATO_CLIENTE', 'TELEFONE_CONTATO_CLIENTE', 'FAX_CONTATO_CLIENTE',
                'EMAIL_CONTATO_CLIENTE', 'OBS_CONTATO_CLIENTE', 'RECEBE_COPIA_NOTA_ELETRONICA', 'SENHA_PORTAL'])
    });

    var gridTB_CLIENTE_CONTATO = new Ext.grid.GridPanel({
        store: TB_CLIENTE_CONTATO_Store,
        title: 'Contatos do Cliente',
        columns: [
        { id: 'ID_CLIENTE', header: 'ID Cliente', width: 80, sortable: true, dataIndex: 'ID_CLIENTE', hidden: true },
        { id: 'ID_CONTATO', header: "C&oacute;digo Contato", width: 100, sortable: true, dataIndex: 'ID_CONTATO' },
        { id: 'NOME_CONTATO_CLIENTE', header: "Nome", width: 260, sortable: true, dataIndex: 'NOME_CONTATO_CLIENTE' },
        { id: 'TELEFONE_CONTATO_CLIENTE', header: "Telefone", width: 140, sortable: true, dataIndex: 'TELEFONE_CONTATO_CLIENTE' },
        { id: 'FAX_CONTATO_CLIENTE', header: "Fax", width: 140, sortable: true, dataIndex: 'FAX_CONTATO_CLIENTE' },
        { id: 'EMAIL_CONTATO_CLIENTE', header: "e-mail", width: 260, sortable: true, dataIndex: 'EMAIL_CONTATO_CLIENTE' },
        { id: 'RECEBE_COPIA_NOTA_ELETRONICA', header: "C&oacute;pia da NFe", width: 110, sortable: true, dataIndex: 'RECEBE_COPIA_NOTA_ELETRONICA', renderer: TrataCombo01 }
        ],
        stripeRows: true,
        height: 150,
        width: '100%',
        columnLines: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaFormularioContatos(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                if (this.getSelectionModel().getSelections().length > 0) {
                    var record = this.getSelectionModel().getSelected();
                    PopulaFormularioContatos(record);
                }
            }
        }
    });

    var alturaGridContatos = Ext.getCmp('tabConteudo').getHeight();
    alturaGridContatos -= formCONTATOS.height;

    gridTB_CLIENTE_CONTATO.setHeight(alturaGridContatos - 152);

    var panelCONTATO_CLIENTE = new Ext.Panel({
        id: 'panelCONTATO_CLIENTE',
        width: '100%',
        border: true,
        height: '100%',
        title: 'Novo Contato',
        items: [formCONTATOS, gridTB_CLIENTE_CONTATO]
    });

    function PopulaFormularioContatos(record) {
        formCONTATOS.getForm().loadRecord(record);
        TXT_SENHA_PORTAL.setValue(record.data.SENHA_PORTAL);

        panelCONTATO_CLIENTE.setTitle('Alterar dados do Contato');

        buttonGroup_TB_CLIENTE_CONTATO.items.items[32].enable();
        formCONTATOS.getForm().items.items[0].disable();

        Ext.getDom('NOME_CONTATO_CLIENTE').focus();
    }

    function GravaDados_TB_CLIENTE_CONTATO() {
        if (!formCONTATOS.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_CLIENTE: Ext.getCmp('formCLIENTE').getForm().findField('ID_CLIENTE').getValue(),
            ID_CONTATO: formCONTATOS.getForm().findField('ID_CONTATO').getValue(),
            NOME_CONTATO_CLIENTE: formCONTATOS.getForm().findField('NOME_CONTATO_CLIENTE').getValue(),
            TELEFONE_CONTATO_CLIENTE: formCONTATOS.getForm().findField('TELEFONE_CONTATO_CLIENTE').getValue(),
            FAX_CONTATO_CLIENTE: formCONTATOS.getForm().findField('FAX_CONTATO_CLIENTE').getValue(),
            EMAIL_CONTATO_CLIENTE: formCONTATOS.getForm().findField('EMAIL_CONTATO_CLIENTE').getValue(),
            OBS_CONTATO_CLIENTE: formCONTATOS.getForm().findField('OBS_CONTATO_CLIENTE').getValue(),
            RECEBE_COPIA_NOTA_ELETRONICA: formCONTATOS.getForm().findField('RECEBE_COPIA_NOTA_ELETRONICA').getValue(),
            SENHA_PORTAL: TXT_SENHA_PORTAL.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        util.IniciaSolicitacao();

        var Url = panelCONTATO_CLIENTE.title == "Novo Contato" ?
                        'servicos/TB_CLIENTE_CONTATO.asmx/GravaNovoContato' :
                        'servicos/TB_CLIENTE_CONTATO.asmx/AtualizaContato';

        Ext.Ajax.request({
            url: Url,
            method: 'POST',
            jsonData: { dados: dados },
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            success: function (response, options) {

                CarregaGrid_TB_CLIENTE_CONTATO();

                if (panelCONTATO_CLIENTE.title == "Novo Contato") {
                    PreparaNovoContato();
                }
                else {
                    Ext.getDom('NOME_CONTATO_CLIENTE').focus();
                }
                util.FinalizaSolicitacao();
            },
            failure: function (response, options) {
                util.FinalizaSolicitacao();

                var erro = eval('(' + response.responseText + ')');
                dialog.MensagemDeErro(erro.Message);
            }
        });
    }

    function TB_CLIENTE_CONTATO_Busca(_elem) {
        util.IniciaSolicitacao();

        var Url = '';
        var dados;

        if (_elem.id == "ID_CONTATO") {
            Url = 'servicos/TB_CLIENTE_CONTATO.asmx/BuscaPorID';
            dados = { ID_CONTATO: formCONTATOS.getForm().findField('ID_CONTATO').getValue(), ID_USUARIO: _ID_USUARIO };
        }
        else if (_elem.id == "NOME_CONTATO_CLIENTE") {
            Url = 'servicos/TB_CLIENTE_CONTATO.asmx/BuscaPorNome';
            dados = { 
                NOME: formCONTATOS.getForm().findField('NOME_CONTATO_CLIENTE').getValue(),
                ID_CLIENTE: Ext.getCmp('formCLIENTE').getForm().findField('ID_CLIENTE').getValue(),
                ID_USUARIO: _ID_USUARIO
            };
        }

        Ext.Ajax.request({
            url: Url,
            method: 'POST',
            jsonData: dados,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            success: function (response, options) {
                var result = Ext.decode(response.responseText).d;

                formCONTATOS.getForm().findField('ID_CONTATO').setValue(result.ID_CONTATO);
                formCONTATOS.getForm().findField('NOME_CONTATO_CLIENTE').setValue(result.NOME_CONTATO_CLIENTE);
                formCONTATOS.getForm().findField('TELEFONE_CONTATO_CLIENTE').setValue(result.TELEFONE_CONTATO_CLIENTE);
                formCONTATOS.getForm().findField('FAX_CONTATO_CLIENTE').setValue(result.FAX_CONTATO_CLIENTE);
                formCONTATOS.getForm().findField('OBS_CONTATO_CLIENTE').setValue(result.OBS_CONTATO_CLIENTE);
                formCONTATOS.getForm().findField('EMAIL_CONTATO_CLIENTE').setValue(result.EMAIL_CONTATO_CLIENTE);
                formCONTATOS.getForm().findField('RECEBE_COPIA_NOTA_ELETRONICA').setValue(result.RECEBE_COPIA_NOTA_ELETRONICA);
                TXT_SENHA_PORTAL.setValue(result.SENHA_PORTAL);

                panelCONTATO_CLIENTE.setTitle('Alterar dados do Contato');
                formCONTATOS.getForm().items.items[0].disable();
                buttonGroup_TB_CLIENTE_CONTATO.items.items[32].enable();

                Ext.getDom('NOME_CONTATO_CLIENTE').focus();

                util.FinalizaSolicitacao();
            },
            failure: function (response, options) {
                PreparaNovoContato();

                var erro = eval('(' + response.responseText + ')');
                dialog.MensagemDeErro(erro.Message);
            }
        });
    }

    function Deleta_TB_CLIENTE_CONTATO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Contato [' +
                                formCONTATOS.getForm().findField('NOME_CONTATO_CLIENTE').getValue() + ']?', 'formCONTATOS', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                util.IniciaSolicitacao();

                Ext.Ajax.request({
                    url: 'servicos/TB_CLIENTE_CONTATO.asmx/DeletaContato',
                    method: 'POST',
                    jsonData: { 
                        ID_CONTATO: formCONTATOS.getForm().findField('ID_CONTATO').getValue(),
                        ID_USUARIO: _ID_USUARIO
                    },
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    success: function (response, options) {
                        CarregaGrid_TB_CLIENTE_CONTATO();
                        PreparaNovoContato();
                    },
                    failure: function (response, options) {
                        util.FinalizaSolicitacao();

                        var erro = eval('(' + response.responseText + ')');
                        dialog.MensagemDeErro(erro.Message);
                    }
                });
            }
        }
    }

    function PreparaNovoContato() {
        formCONTATOS.getForm().reset();
        buttonGroup_TB_CLIENTE_CONTATO.items.items[32].disable();
        formCONTATOS.getForm().items.items[0].enable();
        panelCONTATO_CLIENTE.setTitle('Novo Contato');
        Ext.getDom('NOME_CONTATO_CLIENTE').focus();

        util.FinalizaSolicitacao();
    }

    function CarregaGrid_TB_CLIENTE_CONTATO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CLIENTE_CONTATO.asmx/Lista_TB_CLIENTE_CONTATO');
        _ajax.setJsonData({ 
            ID_CLIENTE: Ext.getCmp('formCLIENTE').getForm().findField('ID_CLIENTE').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            gridTB_CLIENTE_CONTATO.getStore().loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.CarregaGridContatos = function () {
        CarregaGrid_TB_CLIENTE_CONTATO();
        PreparaNovoContato();
    };

    this.panelCONTATO_CLIENTE = function () {
        return panelCONTATO_CLIENTE;
    };
}