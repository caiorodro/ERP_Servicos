var combo_TB_EMITENTE_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_EMITENTE', 'NOME_FANTASIA_EMITENTE']
       )
});

function TB_EMITENTE_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMITENTE.asmx/CarregaComboEmitente');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO ? _ID_USUARIO : 1 });

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_EMITENTE_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

TB_EMITENTE_CARREGA_COMBO();

function MontaCadastroEmpresa() {

    var wPesquisa = new TB_EMITENTE_MontaPesquisa();

    var _Pesquisa_Mun = new BUSCA_TB_MUNICIPIO();

    var TXT_CODIGO_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo',
        name: 'CODIGO_EMITENTE',
        id: 'CODIGO_EMITENTE',
        width: 75,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_EMITENTE_Busca(this);
                }
            }
        }
    });

    var TXT_NOME_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Nome / Razão Social',
        name: 'NOME_EMITENTE',
        id: 'NOME_EMITENTE',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_NOME_FANTASIA_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Nome Fantasia',
        name: 'NOME_FANTASIA_EMITENTE',
        id: 'NOME_FANTASIA_EMITENTE',
        width: 260,
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_EMITENTE_Busca(this);
                }
            }
        }
    });

    var TXT_CNPJ_EMITENTE = new Th2_FieldMascara({
        fieldLabel: 'CNPJ',
        id: 'CNPJ_EMITENTE',
        name: 'CNPJ_EMITENTE',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        enableKeyEvents: true,
        Mascara: '99.999.999/9999-99'
    });


    TXT_CNPJ_EMITENTE.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            TB_EMITENTE_Busca(this);
        }
    });

    var TXT_IE_EMITENTE = new Ext.form.TextField({
        id: 'IE_EMITENTE',
        name: 'IE_EMITENTE',
        fieldLabel: 'Inscri&ccedil;&atilde;o Estadual',
        width: 135,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_ENDERECO_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_EMITENTE',
        name: 'ENDERECO_EMITENTE',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 45,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '45' },
        width: 400
    });

    var TXT_NUMERO_END_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Numero',
        id: 'NUMERO_END_EMITENTE',
        name: 'NUMERO_END_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPLEMENTO_END_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        id: 'COMPLEMENTO_END_EMITENTE',
        name: 'COMPLEMENTO_END_EMITENTE',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_EMITENTE = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_EMITENTE',
        name: 'CEP_EMITENTE',
        allowBlank: false,
        msgTarget: 'side',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_BAIRRO_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_EMITENTE',
        name: 'BAIRRO_EMITENTE',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35' },
        width: 295
    });

    var _estadoTransp = '';
    var _cidadeTransp = '';

    function BuscaMunicipio(_id_uf, _id, _descricao) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_MUNICIPIOS.asmx/BuscaPorID');
        _ajax.setJsonData({
            ID_UF: _id_uf,
            ID_MUNICIPIO: _id,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (result.NOME_MUNICIPIO) {

                _descricao.setValue(result.NOME_MUNICIPIO);
            }
            else {
                _Pesquisa_Mun.UF(_id_uf);
                _Pesquisa_Mun.ORIGEM('ID_UF_EMITENTE');
                _Pesquisa_Mun.show('ID_UF_EMITENTE');
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TXT_CIDADE_EMITENTE = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'CODIGO_MUNICIPIO_EMITENTE',
        name: 'CODIGO_MUNICIPIO_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        width: 70,
        enableKeyEvents: true,
        listeners: {
            focus: function (f) {
                _cidadeTransp = f.getValue();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (Ext.getCmp('ID_UF_EMITENTE').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ID_UF_EMITENTE').getValue(), f.getValue(), Ext.getCmp('DESCRICAO_CIDADE_EMITENTE'));
                    }
                }
            }
        }
    });

    TXT_CIDADE_EMITENTE.on('keyup', function (f, e) {
        if (f.getValue() != _cidadeTransp)
            Ext.getCmp('DESCRICAO_CIDADE_EMITENTE').setValue('');
    });

    var label_DESCRICAO_CIDADE_EMITENTE = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_EMITENTE',
        name: 'DESCRICAO_CIDADE_EMITENTE',
        width: 300,
        readOnly: true,
        allowBlank: false
    });

    TH2_CARREGA_UF();

    var combo_ESTADO_EMITENTE = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ID_UF_EMITENTE',
        name: 'ID_UF_EMITENTE',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 170,
        allowBlank: false,
        listeners: {
            focus: function (f) {
                _estadoTransp = f.getValue();
            },
            select: function (c, record, index) {
                if (c.getValue() != _estadoTransp) {
                    Ext.getCmp('CODIGO_MUNICIPIO_EMITENTE').setValue('');
                    Ext.getCmp('DESCRICAO_CIDADE_EMITENTE').setValue('');
                }
            }
        }
    });

    //////////////////////// Endereço de Retirada

    var TXT_ENDERECO_RETIRADA_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_RETIRADA_EMITENTE',
        name: 'ENDERECO_RETIRADA_EMITENTE',
        maxLength: 45,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '45' },
        width: 400
    });

    var TXT_NUMERO_END_RETIRADA_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Numero',
        id: 'NUMERO_END_RETIRADA_EMITENTE',
        name: 'NUMERO_END_RETIRADA_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPL_RETIRADA_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        id: 'COMPL_RETIRADA_EMITENTE',
        name: 'COMPL_RETIRADA_EMITENTE',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_RETIRADA_EMITENTE = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_RETIRADA_EMITENTE',
        name: 'CEP_RETIRADA_EMITENTE',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_BAIRRO_RETIRADA_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_RETIRADA_EMITENTE',
        name: 'BAIRRO_RETIRADA_EMITENTE',
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35' },
        width: 295
    });

    var TXT_COD_MUNICIPIO_RETIRADA_EMITENTE = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'COD_MUNICIPIO_RETIRADA_EMITENTE',
        name: 'COD_MUNICIPIO_RETIRADA_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        width: 70,
        enableKeyEvents: true,
        listeners: {
            focus: function (f) {
                _cidadeTransp = f.getValue();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (Ext.getCmp('ID_UF_RETIRADA_EMITENTE').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ID_UF_RETIRADA_EMITENTE').getValue(), f.getValue(), Ext.getCmp('DESCRICAO_CIDADE_RETIRADA'));
                    }
                }
            }
        }
    });

    TXT_COD_MUNICIPIO_RETIRADA_EMITENTE.on('keyup', function (f, e) {
        if (f.getValue() != _cidadeTransp)
            Ext.getCmp('DESCRICAO_CIDADE_RETIRADA').setValue('');
    });

    var label_DESCRICAO_CIDADE_RETIRADA = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_RETIRADA',
        name: 'DESCRICAO_CIDADE_RETIRADA',
        width: 300,
        readOnly: true
    });

    var combo_ID_UF_RETIRADA_EMITENTE = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ID_UF_RETIRADA_EMITENTE',
        name: 'ID_UF_RETIRADA_EMITENTE',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 170,
        listeners: {
            focus: function (f) {
                _estadoTransp = f.getValue();
            },
            select: function (c, record, index) {
                if (c.getValue() != _estadoTransp) {
                    Ext.getCmp('COD_MUNICIPIO_RETIRADA_EMITENTE').setValue('');
                    Ext.getCmp('DESCRICAO_CIDADE_RETIRADA').setValue('');
                }
            }
        }
    });

    ////////////////////////

    var TXT_TELEFONE_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_EMITENTE',
        name: 'TELEFONE_EMITENTE',
        allowBlank: true,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var TXT_FAX_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Fax',
        id: 'FAX_EMITENTE',
        name: 'FAX_EMITENTE',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var TXT_SITE_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'Site na web',
        name: 'SITE_EMITENTE',
        id: 'SITE_EMITENTE',
        width: 300,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' }
    });

    var TXT_OBS_EMITENTE = new Ext.form.TextField({
        id: 'OBS_EMITENTE',
        name: 'OBS_EMITENTE',
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 55,
        autoCreate: { tag: 'textarea', autocomplete: 'off' },
        msgTarget: 'side'
    });

    var TXT_EMAIL_EMITENTE = new Ext.form.TextField({
        id: 'EMAIL_EMITENTE',
        name: 'EMAIL_EMITENTE',
        fieldLabel: 'e-mail',
        width: 305,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        vtype: 'email'
    });

    var CB_CRT_EMITENTE = new Ext.form.ComboBox({
        fieldLabel: 'C&oacute;digo de Regime Tribut&aacute;rio',
        id: 'CRT_EMITENTE',
        name: 'CRT_EMITENTE',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 360,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[1, '1 - Simples Nacional'], [2, '2 - Simples Nacional (Excesso de sublimite de receita bruta)'], [3, '3 - Regime Normal']]
        })
    });

    var BTN_PESQUISA_MUNICIPIO_EMITENTE = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO_EMITENTE',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_ESTADO_EMITENTE.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = Ext.getCmp('ID_UF_EMITENTE').getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ID_UF_EMITENTE');
                _Pesquisa_Mun.show(btn.id);
            }
        }
    });

    var BTN_PESQUISA_MUNICIPIO_RETIRADA = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO_RETIRADA',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_ID_UF_RETIRADA_EMITENTE.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = Ext.getCmp('ID_UF_RETIRADA_EMITENTE').getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ID_UF_RETIRADA_EMITENTE');
                _Pesquisa_Mun.show(btn.id);
            }
        }
    });

    var TXT_NUMERO_NF_EMITENTE = new Ext.form.NumberField({
        fieldLabel: 'Numera&ccedil;&atilde;o da NF',
        id: 'NUMERO_NF_EMITENTE',
        name: 'NUMERO_NF_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false,
        width: 105,
        minValue: 0
    });

    var TXT_SERIE_NF_EMITENTE = new Ext.form.TextField({
        fieldLabel: 'S&eacute;rie da NF',
        id: 'SERIE_NF_EMITENTE',
        name: 'SERIE_NF_EMITENTE',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        allowBlank: false,
        width: 105
    });

    var formEMITENTE = new Ext.FormPanel({
        id: 'formEMITENTE',
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        width: '100%',
        labelAlign: 'left',
        height: 475,
        width: '100%',
        items: [{
            xtype: 'fieldset',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            title: 'Dados Principais',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.22,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_CODIGO_EMITENTE]
                }, {
                    columnWidth: 0.70,
                    layout: 'form',
                    labelWidth: 120,
                    items: [TXT_NOME_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.41,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_NOME_FANTASIA_EMITENTE]
                }, {
                    columnWidth: 0.21,
                    layout: 'form',
                    labelWidth: 30,
                    items: [TXT_CNPJ_EMITENTE]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    items: [TXT_IE_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.51,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_ENDERECO_EMITENTE]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    labelWidth: 55,
                    items: [TXT_NUMERO_END_EMITENTE]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    labelWidth: 85,
                    items: [TXT_COMPLEMENTO_END_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_CEP_EMITENTE]
                }, {
                    columnWidth: 0.50,
                    layout: 'form',
                    labelWidth: 45,
                    items: [TXT_BAIRRO_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.29,
                    layout: 'form',
                    labelWidth: 95,
                    items: [combo_ESTADO_EMITENTE]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    labelWidth: 50,
                    items: [TXT_CIDADE_EMITENTE]
                }, {
                    columnWidth: 0.03,
                    layout: 'form',
                    labelWidth: 1,
                    items: [BTN_PESQUISA_MUNICIPIO_EMITENTE]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    labelWidth: 1,
                    items: [label_DESCRICAO_CIDADE_EMITENTE]
                }]
            }]
        }, {
            xtype: 'fieldset',
            autoHeight: true,
            title: 'Endere&ccedil;o de Retirada',
            items: [{

                layout: 'column',
                items: [{
                    columnWidth: 0.51,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_ENDERECO_RETIRADA_EMITENTE]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    labelWidth: 55,
                    items: [TXT_NUMERO_END_RETIRADA_EMITENTE]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    labelWidth: 85,
                    items: [TXT_COMPL_RETIRADA_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_CEP_RETIRADA_EMITENTE]
                }, {
                    columnWidth: 0.50,
                    layout: 'form',
                    labelWidth: 45,
                    items: [TXT_BAIRRO_RETIRADA_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.28,
                    layout: 'form',
                    labelWidth: 95,
                    items: [combo_ID_UF_RETIRADA_EMITENTE]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    labelWidth: 50,
                    items: [TXT_COD_MUNICIPIO_RETIRADA_EMITENTE]
                }, {
                    columnWidth: 0.03,
                    layout: 'form',
                    labelWidth: 1,
                    items: [BTN_PESQUISA_MUNICIPIO_RETIRADA]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    labelWidth: 1,
                    items: [label_DESCRICAO_CIDADE_RETIRADA]
                }]
            }]
        }, {
            xtype: 'fieldset',
            autoHeight: true,
            title: 'Contatos',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.23,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_TELEFONE_EMITENTE]
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    labelWidth: 30,
                    items: [TXT_FAX_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.42,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_EMAIL_EMITENTE]
                }, {
                    columnWidth: 0.24,
                    layout: 'form',
                    labelWidth: 105,
                    items: [TXT_NUMERO_NF_EMITENTE]
                }, {
                    columnWidth: 0.30,
                    labelWidth: 70,
                    layout: 'form',
                    items: [TXT_SERIE_NF_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .42,
                    layout: 'form',
                    labelWidth: 95,
                    items: [TXT_SITE_EMITENTE]
                }, {
                    columnWidth: .55,
                    layout: 'form',
                    labelWidth: 160,
                    items: [CB_CRT_EMITENTE]
                }]
            }, { labelAlign: 'top',
                layout: 'form',
                items: [TXT_OBS_EMITENTE]
            }]
        }]
    });

    function TB_EMITENTE_Busca(field) {
        var _ajax = new Th2_Ajax();
        var Url = '';
        var jsData;

        if (field.id == 'CODIGO_EMITENTE') {
            Url = 'servicos/TB_EMITENTE.asmx/BuscaPorID';
            jsData = {
                CODIGO_EMITENTE: field.getValue(),
                ID_USUARIO: _ID_USUARIO
            };
        }
        else if (field.id == 'NOME_FANTASIA_EMITENTE') {
            Url = 'servicos/TB_EMITENTE.asmx/BuscaPorNomeFantasia';
            jsData = {
                NOME_FANTASIA_EMITENTE: field.getValue(),
                ID_USUARIO: _ID_USUARIO
            };
        }
        else if (field.id == 'CNPJ_EMITENTE') {
            Url = 'servicos/TB_EMITENTE.asmx/BuscaPorCNPJ';
            jsData = {
                CNPJ_EMITENTE: field.getValue(),
                ID_USUARIO: _ID_USUARIO
            };
        }

        _ajax.setUrl(Url);
        _ajax.setJsonData(jsData);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var id_mun_retirada = result.COD_MUNICIPIO_RETIRADA_EMITENTE == "0" ?
                                                                    "" : result.COD_MUNICIPIO_RETIRADA_EMITENTE;

            var id_uf_retirada = result.ID_UF_RETIRADA_EMITENTE == "0" ?
                                                                    "" : result.ID_UF_RETIRADA_EMITENTE;

            formEMITENTE.getForm().findField('CODIGO_EMITENTE').setValue(result.CODIGO_EMITENTE);
            formEMITENTE.getForm().findField('NOME_EMITENTE').setValue(result.NOME_EMITENTE);
            formEMITENTE.getForm().findField('NOME_FANTASIA_EMITENTE').setValue(result.NOME_FANTASIA_EMITENTE);
            formEMITENTE.getForm().findField('CNPJ_EMITENTE').setValue(result.CNPJ_EMITENTE);
            formEMITENTE.getForm().findField('IE_EMITENTE').setValue(result.IE_EMITENTE);

            formEMITENTE.getForm().findField('ENDERECO_EMITENTE').setValue(result.ENDERECO_EMITENTE);
            formEMITENTE.getForm().findField('NUMERO_END_EMITENTE').setValue(result.NUMERO_END_EMITENTE);
            formEMITENTE.getForm().findField('COMPLEMENTO_END_EMITENTE').setValue(result.COMPLEMENTO_END_EMITENTE);
            formEMITENTE.getForm().findField('CEP_EMITENTE').setValue(result.CEP_EMITENTE);
            formEMITENTE.getForm().findField('BAIRRO_EMITENTE').setValue(result.BAIRRO_EMITENTE);
            formEMITENTE.getForm().findField('CODIGO_MUNICIPIO_EMITENTE').setValue(result.CODIGO_MUNICIPIO_EMITENTE);
            formEMITENTE.getForm().findField('DESCRICAO_CIDADE_EMITENTE').setValue(result.DESCRICAO_CIDADE_EMITENTE);
            formEMITENTE.getForm().findField('ID_UF_EMITENTE').setValue(result.ID_UF_EMITENTE);

            formEMITENTE.getForm().findField('ENDERECO_RETIRADA_EMITENTE').setValue(result.ENDERECO_RETIRADA_EMITENTE);
            formEMITENTE.getForm().findField('NUMERO_END_RETIRADA_EMITENTE').setValue(result.NUMERO_END_RETIRADA_EMITENTE);
            formEMITENTE.getForm().findField('COMPL_RETIRADA_EMITENTE').setValue(result.COMPL_RETIRADA_EMITENTE);
            formEMITENTE.getForm().findField('CEP_RETIRADA_EMITENTE').setValue(result.CEP_RETIRADA_EMITENTE);
            formEMITENTE.getForm().findField('BAIRRO_RETIRADA_EMITENTE').setValue(result.BAIRRO_RETIRADA_EMITENTE);
            formEMITENTE.getForm().findField('COD_MUNICIPIO_RETIRADA_EMITENTE').setValue(id_mun_retirada);
            formEMITENTE.getForm().findField('DESCRICAO_CIDADE_RETIRADA').setValue(result.DESCRICAO_CIDADE_RETIRADA);
            formEMITENTE.getForm().findField('ID_UF_RETIRADA_EMITENTE').setValue(id_uf_retirada);

            formEMITENTE.getForm().findField('TELEFONE_EMITENTE').setValue(result.TELEFONE_EMITENTE);
            formEMITENTE.getForm().findField('FAX_EMITENTE').setValue(result.FAX_EMITENTE);
            formEMITENTE.getForm().findField('OBS_EMITENTE').setValue(result.OBS_EMITENTE);

            formEMITENTE.getForm().findField('EMAIL_EMITENTE').setValue(result.EMAIL_EMITENTE);

            formEMITENTE.getForm().findField('NUMERO_NF_EMITENTE').setValue(result.NUMERO_NF_EMITENTE);
            formEMITENTE.getForm().findField('SERIE_NF_EMITENTE').setValue(result.SERIE_NF_EMITENTE);

            formEMITENTE.getForm().findField('SITE_EMITENTE').setValue(result.SITE_EMITENTE);
            CB_CRT_EMITENTE.setValue(result.CRT_EMITENTE);

            panelCadastroEmitente.setTitle('Alterar dados do Emitente');

            buttonGroup_TB_EMITENTE.items.items[32].enable();
            formEMITENTE.getForm().items.items[0].disable();

            Ext.getCmp('NOME_EMITENTE').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function PopulaFormulario_TB_EMITENTE(record, _Pesquisa) {
        formEMITENTE.getForm().loadRecord(record);
        panelCadastroEmitente.setTitle('Alterar dados do Emitente');

        buttonGroup_TB_EMITENTE.items.items[32].enable();
        formEMITENTE.getForm().items.items[0].disable();

        Ext.getCmp('NOME_EMITENTE').focus();
        _Pesquisa.hide();
    }

    ///////////////////////// Area do grid /////////////////////////
    function TB_EMITENTE_MontaPesquisa() {
        var TB_EMITENTE_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['CODIGO_EMITENTE', 'NOME_EMITENTE', 'NOME_FANTASIA_EMITENTE', 'CNPJ_EMITENTE', 'IE_EMITENTE', 'ENDERECO_EMITENTE',
                     'NUMERO_END_EMITENTE', 'COMPLEMENTO_END_EMITENTE', 'CEP_EMITENTE', 'BAIRRO_EMITENTE', 'CODIGO_MUNICIPIO_EMITENTE', 'DESCRICAO_CIDADE_EMITENTE',
                     'ID_UF_EMITENTE', 'DESCRICAO_ESTADO_EMITENTE', 'TELEFONE_EMITENTE', 'FAX_EMITENTE', 'OBS_EMITENTE',
                     'EMAIL_EMITENTE', 'NUMERO_NF_EMITENTE', 'SERIE_NF_EMITENTE', 'SITE_EMITENTE', 'ENDERECO_RETIRADA_EMITENTE', 'NUMERO_END_RETIRADA_EMITENTE',
                     'COMPL_RETIRADA_EMITENTE', 'CEP_RETIRADA_EMITENTE', 'BAIRRO_RETIRADA_EMITENTE', 'COD_MUNICIPIO_RETIRADA_EMITENTE',
                     'DESCRICAO_CIDADE_RETIRADA', 'ID_UF_RETIRADA_EMITENTE', 'DESCRICAO_ESTADO_RETIRADA', 'CRT_EMITENTE']
       )
        });

        var gridEmitente = new Ext.grid.GridPanel({
            store: TB_EMITENTE_Store,
            columns: [
        { id: 'CODIGO_EMITENTE', header: "ID", width: 60, sortable: true, dataIndex: 'CODIGO_EMITENTE', hidden: true },
        { id: 'NOME_EMITENTE', header: "Nome / Raz&atilde;o Social", width: 350, sortable: true, dataIndex: 'NOME_EMITENTE' },
        { id: 'NOME_FANTASIA_EMITENTE', header: "Nome Fantasia", width: 210, sortable: true, dataIndex: 'NOME_FANTASIA_EMITENTE' },
        { id: 'CNPJ_EMITENTE', header: "CNPJ", width: 110, sortable: true, dataIndex: 'CNPJ_EMITENTE' },
        { id: 'IE_EMITENTE', header: "Inscri&ccedil;&atilde;o Estadual", width: 100, sortable: true, dataIndex: 'IE_EMITENTE' },
        { id: 'TELEFONE_EMITENTE', header: "Telefone", width: 140, sortable: true, dataIndex: 'TELEFONE_EMITENTE' }

    ],
            stripeRows: true,
            height: 350,
            width: 1000,

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        var TB_EMITENTE_TXT_PESQUISA = new Ext.form.TextField({
            id: 'TB_EMITENTE_TXT_PESQUISA',
            name: 'TB_EMITENTE_TXT_PESQUISA',
            layout: 'form',
            fieldLabel: 'Nome do Emitente',
            width: 290,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        TB_EMITENTE_Executa_Pesquisa(gridEmitente);
                    }
                }
            }
        });

        var TB_EMITENTE_BTN_PESQUISA = new Ext.Button({
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function () {
                TB_EMITENTE_Executa_Pesquisa();
            }
        });

        function RetornaFiltros_TB_EMITENTE_JsonData() {
            var TB_TRANSPORTADORA_JsonData = {
                pesquisa: TB_EMITENTE_TXT_PESQUISA.getValue(),
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: TB_EMITENTE_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSPORTADORA_JsonData;
        }

        var TB_EMITENTE_PagingToolbar = new Th2_PagingToolbar();

        TB_EMITENTE_PagingToolbar.setUrl('servicos/TB_EMITENTE.asmx/Lista_TB_EMITENTE');
        TB_EMITENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_EMITENTE_JsonData());
        TB_EMITENTE_PagingToolbar.setStore(TB_EMITENTE_Store);

        function TB_EMITENTE_Executa_Pesquisa() {
            TB_EMITENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_EMITENTE_JsonData());
            TB_EMITENTE_PagingToolbar.doRequest();
        }

        var wgridEmitente = new Ext.Window({
            id: 'wgridEmitente',
            layout: 'form',
            title: 'Busca',
            iconCls: 'icone_TB_EMITENTE',
            width: 1010,
            height: 'auto',
            closable: false,
            draggable: true,
            collapsible: false,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            items: [gridEmitente, TB_EMITENTE_PagingToolbar.PagingToolbar(), {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .46,
                    layout: 'form',
                    labelAlign: 'left',
                    labelWidth: 150,
                    style: 'vertical-align: bottom;',
                    items: [TB_EMITENTE_TXT_PESQUISA]
                }, {
                    columnWidth: .32,
                    style: 'vertical-align: bottom;',
                    items: [TB_EMITENTE_BTN_PESQUISA]
                }]
            }],
            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            }
        });

        gridEmitente.on('rowdblclick', function (grid, rowIndex, e) {
            var store = grid.getStore();
            var record = store.getAt(rowIndex);

            PopulaFormulario_TB_EMITENTE(record, wgridEmitente);
        });

        gridEmitente.on('keydown', function (e) {
            if (e.getKey() == e.ENTER) {
                if (gridEmitente.getSelectionModel().getSelections().length > 0) {
                    var record = gridEmitente.getSelectionModel().getSelected();
                    PopulaFormulario_TB_EMITENTE(record, wgridEmitente);
                }
            }
        });

        return wgridEmitente;
    }

    var buttonGroup_TB_EMITENTE = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_EMITENTE();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Novo Emitente',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function () {
                            formEMITENTE.getForm().reset();
                            buttonGroup_TB_EMITENTE.items.items[32].disable();
                            formEMITENTE.getForm().findField('CODIGO_EMITENTE').enable();

                            panelCadastroEmitente.setTitle('Novo Emitente');

                            Ext.getCmp('NOME_EMITENTE').focus();
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                     {
                         id: 'BTN_DELETAR_TB_EMITENTE',
                         text: 'Deletar',
                         icon: 'imagens/icones/database_delete_24.gif',
                         scale: 'medium',
                         disabled: true,
                         handler: function () {
                             Deleta_TB_EMITENTE();
                         }
                     }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Buscar',
                        icon: 'imagens/icones/database_search_24.gif',
                        scale: 'medium',
                        handler: function () {
                            wPesquisa.show('formEMITENTE');
                        }
                    }]
    });

    var toolbar_TB_EMITENTE = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_EMITENTE]
    });

    var panelCadastroEmitente = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Emitente',
        items: [formEMITENTE, toolbar_TB_EMITENTE]
    });

    function GravaDados_TB_EMITENTE() {
        if (!formEMITENTE.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_EMITENTE: formEMITENTE.getForm().findField('CODIGO_EMITENTE').getValue(),
            NOME_EMITENTE: formEMITENTE.getForm().findField('NOME_EMITENTE').getValue(),
            NOME_FANTASIA_EMITENTE: formEMITENTE.getForm().findField('NOME_FANTASIA_EMITENTE').getValue(),
            CNPJ_EMITENTE: formEMITENTE.getForm().findField('CNPJ_EMITENTE').getValue(),
            IE_EMITENTE: formEMITENTE.getForm().findField('IE_EMITENTE').getValue(),

            ENDERECO_EMITENTE: formEMITENTE.getForm().findField('ENDERECO_EMITENTE').getValue(),
            NUMERO_END_EMITENTE: formEMITENTE.getForm().findField('NUMERO_END_EMITENTE').getValue(),
            COMPLEMENTO_END_EMITENTE: formEMITENTE.getForm().findField('COMPLEMENTO_END_EMITENTE').getValue(),
            CEP_EMITENTE: formEMITENTE.getForm().findField('CEP_EMITENTE').getValue(),
            BAIRRO_EMITENTE: formEMITENTE.getForm().findField('BAIRRO_EMITENTE').getValue(),
            CODIGO_MUNICIPIO_EMITENTE: formEMITENTE.getForm().findField('CODIGO_MUNICIPIO_EMITENTE').getValue(),
            ID_UF_EMITENTE: formEMITENTE.getForm().findField('ID_UF_EMITENTE').getValue(),

            ///////////////

            ENDERECO_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('ENDERECO_RETIRADA_EMITENTE').getValue(),
            NUMERO_END_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('NUMERO_END_RETIRADA_EMITENTE').getValue(),
            COMPL_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('COMPL_RETIRADA_EMITENTE').getValue(),
            CEP_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('CEP_RETIRADA_EMITENTE').getValue(),
            BAIRRO_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('BAIRRO_RETIRADA_EMITENTE').getValue(),
            COD_MUNICIPIO_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('COD_MUNICIPIO_RETIRADA_EMITENTE').getValue(),
            ID_UF_RETIRADA_EMITENTE: formEMITENTE.getForm().findField('ID_UF_RETIRADA_EMITENTE').getValue(),

            TELEFONE_EMITENTE: formEMITENTE.getForm().findField('TELEFONE_EMITENTE').getValue(),
            FAX_EMITENTE: formEMITENTE.getForm().findField('FAX_EMITENTE').getValue(),
            OBS_EMITENTE: formEMITENTE.getForm().findField('OBS_EMITENTE').getValue(),

            EMAIL_EMITENTE: formEMITENTE.getForm().findField('EMAIL_EMITENTE').getValue(),

            NUMERO_NF_EMITENTE: formEMITENTE.getForm().findField('NUMERO_NF_EMITENTE').getValue(),
            SERIE_NF_EMITENTE: formEMITENTE.getForm().findField('SERIE_NF_EMITENTE').getValue(),

            SITE_EMITENTE: formEMITENTE.getForm().findField('SITE_EMITENTE').getValue(),
            CRT_EMITENTE: CB_CRT_EMITENTE.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroEmitente.title == "Novo Emitente" ?
                'servicos/TB_EMITENTE.asmx/GravaNovoEmitente' :
                'servicos/TB_EMITENTE.asmx/AtualizaEmitente';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroEmitente.title == "Novo Emitente")
                formEMITENTE.getForm().reset();

            Ext.getCmp('NOME_EMITENTE').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_EMITENTE() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Emitente [' +
                formEMITENTE.getForm().findField('NOME_FANTASIA_EMITENTE').getValue() + ']?', 'formEMITENTE', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_EMITENTE.asmx/DeletaEmitente');
                _ajax.setJsonData({
                    CODIGO_EMITENTE: Ext.getCmp('CODIGO_EMITENTE').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    formEMITENTE.getForm().reset();
                    buttonGroup_TB_EMITENTE.items.items[32].disable();
                    buttonGroup_TB_EMITENTE.items.items[0].enable();

                    panelCadastroEmitente.setTitle('Novo Emitente');

                    Ext.getDom('NOME_EMITENTE').focus();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    formEMITENTE.setHeight(Ext.getCmp('tabConteudo').getHeight() - 100);

    return panelCadastroEmitente;
}
