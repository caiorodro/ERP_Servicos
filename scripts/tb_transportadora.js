//////////////////////// Area do formulário /////////////////////////

function MontaCadastroTransportadoras() {

    var wPesquisa = TB_TRANSPORTADORA_MontaPesquisa();
    var _Pesquisa_Mun = new BUSCA_TB_MUNICIPIO();

    var TXT_CODIGO_TRANSP = new Ext.form.TextField({
        fieldLabel: 'ID da Transportadora',
        name: 'CODIGO_TRANSP',
        id: 'CODIGO_TRANSP',
        width: 75,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' }
    });

    var TXT_NOME_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Nome / Razão Social',
        name: 'NOME_TRANSP',
        id: 'NOME_TRANSP',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_NOME_FANTASIA_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Nome Fantasia',
        name: 'NOME_FANTASIA_TRANSP',
        id: 'NOME_FANTASIA_TRANSP',
        width: 260,
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_CNPJ_TRANSP = new Th2_FieldMascara({
        fieldLabel: 'CNPJ',
        id: 'CNPJ_TRANSP',
        name: 'CNPJ_TRANSP',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18' },
        allowBlank: false,
        msgTarget: 'side',
        enableKeyEvents: true,
        Mascara: '99.999.999/9999-99'
    });

    var TXT_IE_TRANSP = new Ext.form.TextField({
        id: 'IE_TRANSP',
        name: 'IE_TRANSP',
        fieldLabel: 'Inscri&ccedil;&atilde;o Estadual',
        width: 135,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_ENDERECO_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_TRANSP',
        name: 'ENDERECO_TRANSP',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 400
    });

    var TXT_NUMERO_END_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Numero',
        id: 'NUMERO_END_TRANSP',
        name: 'NUMERO_END_TRANSP',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPLEMENTO_END_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        id: 'COMPLEMENTO_END_TRANSP',
        name: 'COMPLEMENTO_END_TRANSP',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_TRANSP = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_TRANSP',
        name: 'CEP_TRANSP',
        allowBlank: false,
        msgTarget: 'side',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_BAIRRO_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_TRANSP',
        name: 'BAIRRO_TRANSP',
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
        _ajax.setJsonData({ ID_UF: _id_uf, ID_MUNICIPIO: _id, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (result.NOME_MUNICIPIO) {

                _descricao.setValue(result.NOME_MUNICIPIO);
            }
            else {
                _Pesquisa_Mun.UF(_id_uf);
                _Pesquisa_Mun.ORIGEM('ID_UF_TRANSP');
                _Pesquisa_Mun.show('ID_UF_TRANSP');
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TXT_CIDADE_TRANSP = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'ID_MUNICIPIO_TRANSP',
        name: 'ID_MUNICIPIO_TRANSP',
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
                    if (Ext.getCmp('ID_UF_TRANSP').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ID_UF_TRANSP').getValue(), f.getValue(), Ext.getCmp('DESCRICAO_CIDADE_TRANSP'));
                    }
                }
            }
        }
    });

    TXT_CIDADE_TRANSP.on('keyup', function (f, e) {
        if (f.getValue() != _cidadeTransp)
            Ext.getCmp('DESCRICAO_CIDADE_TRANSP').setValue('');
    });

    var label_DESCRICAO_CIDADE_TRANSP = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_TRANSP',
        name: 'DESCRICAO_CIDADE_TRANSP',
        width: 300,
        readOnly: true,
        allowBlank: false
    });

    TH2_CARREGA_UF();

    var combo_ESTADO_TRANSP = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ID_UF_TRANSP',
        name: 'ID_UF_TRANSP',
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
                    Ext.getCmp('ID_MUNICIPIO_TRANSP').setValue('');
                    Ext.getCmp('DESCRICAO_CIDADE_TRANSP').setValue('');
                }
            }
        }
    });

    var TXT_TELEFONE1_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE1_TRANSP',
        name: 'TELEFONE1_TRANSP',
        allowBlank: true,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var TXT_TELEFONE2_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE2_TRANSP',
        name: 'TELEFONE2_TRANSP',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var TXT_FAX_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Fax',
        id: 'FAX_TRANSP',
        name: 'FAX_TRANSP',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var TXT_OBS_TRANSP = new Ext.form.TextField({
        id: 'OBS_TRANSP',
        name: 'OBS_TRANSP',
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 105,
        autoCreate: { tag: 'textarea', autocomplete: 'off' },
        msgTarget: 'side'
    });

    var TXT_CONTATO_TRANSP = new Ext.form.TextField({
        fieldLabel: 'Contato',
        id: 'CONTATO_TRANSP',
        name: 'CONTATO_TRANSP',
        maxLength: 30,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '30' },
        width: 240
    });

    var TXT_EMAIL_TRANSP = new Ext.form.TextField({
        id: 'EMAIL_TRANSP',
        name: 'EMAIL_TRANSP',
        fieldLabel: 'e-mail',
        width: 305,
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        vtype: 'email'
    });

    // TRANSPORTE_CLIENTE_NOVO
    var BTN_PESQUISA_MUNICIPIO_TRANSP = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO_TRANSP',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_ESTADO_TRANSP.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = Ext.getCmp('ID_UF_TRANSP').getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ID_UF_TRANSP');
                _Pesquisa_Mun.show(btn.id);
            }
        }
    });

    var CB_TRANSPORTE_CLIENTE_NOVO = new Ext.form.Checkbox({
        name: 'TRANSPORTE_CLIENTE_NOVO',
        id: 'TRANSPORTE_CLIENTE_NOVO',
        boxLabel: 'Transportadora para cliente novo'
    });

    var CB_TRANSPORTE_PROPRIO = new Ext.form.Checkbox({
        name: 'TRANSPORTE_PROPRIO',
        id: 'TRANSPORTE_PROPRIO',
        boxLabel: 'Transporte Pr&oacute;prio'
    });

    var formTRANSPORTADORAS = new Ext.FormPanel({
        id: 'formTRANSPORTADORAS',
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
                    labelWidth: 120,
                    items: [TXT_CODIGO_TRANSP]
                }, {
                    columnWidth: 0.70,
                    layout: 'form',
                    labelWidth: 120,
                    items: [TXT_NOME_TRANSP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.41,
                    layout: 'form',
                    labelWidth: 120,
                    items: [TXT_NOME_FANTASIA_TRANSP]
                }, {
                    columnWidth: 0.21,
                    layout: 'form',
                    labelWidth: 30,
                    items: [TXT_CNPJ_TRANSP]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    items: [TXT_IE_TRANSP]
                }]
            }]
        }, {
            xtype: 'fieldset',
            autoHeight: true,
            title: 'Endere&ccedil;o',
            items: [{

                layout: 'column',
                items: [{
                    columnWidth: 0.49,
                    layout: 'form',
                    labelWidth: 70,
                    items: [TXT_ENDERECO_TRANSP]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    labelWidth: 55,
                    items: [TXT_NUMERO_END_TRANSP]
                }, {
                    columnWidth: 0.26,
                    layout: 'form',
                    labelWidth: 85,
                    items: [TXT_COMPLEMENTO_END_TRANSP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.18,
                    layout: 'form',
                    labelWidth: 70,
                    items: [TXT_CEP_TRANSP]
                }, {
                    columnWidth: 0.50,
                    layout: 'form',
                    labelWidth: 45,
                    items: [TXT_BAIRRO_TRANSP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.26,
                    layout: 'form',
                    labelWidth: 70,
                    items: [combo_ESTADO_TRANSP]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    labelWidth: 50,
                    items: [TXT_CIDADE_TRANSP]
                }, {
                    columnWidth: 0.03,
                    layout: 'form',
                    labelWidth: 1,
                    items: [BTN_PESQUISA_MUNICIPIO_TRANSP]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    labelWidth: 1,
                    items: [label_DESCRICAO_CIDADE_TRANSP]
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
                    labelWidth: 70,
                    items: [TXT_TELEFONE1_TRANSP]
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    labelWidth: 72,
                    items: [TXT_TELEFONE2_TRANSP]
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    labelWidth: 30,
                    items: [TXT_FAX_TRANSP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.40,
                    layout: 'form',
                    labelWidth: 70,
                    items: [TXT_EMAIL_TRANSP]
                }, {
                    columnWidth: 0.40,
                    layout: 'form',
                    labelWidth: 60,
                    items: [TXT_CONTATO_TRANSP]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .40,
                    labelWidth: 70,
                    layout: 'form',
                    items: [CB_TRANSPORTE_CLIENTE_NOVO]
                }, {
                    columnWidth: .40,
                    labelWidth: 70,
                    layout: 'form',
                    items: [CB_TRANSPORTE_PROPRIO]
                }]
            }, {
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_OBS_TRANSP]
            }]
        }]
    });

    function TB_TRANSPORTADORA_Busca(field) {
        var _ajax = new Th2_Ajax();
        var Url = '';
        var jsData;

        if (field.id == 'CODIGO_TRANSP') {
            Url = 'servicos/TB_TRANSPORTADORAS.asmx/BuscaPorID';
            jsData = {
                CODIGO_TRANSP: field.getValue(),
                ID_USUARIO: _ID_USUARIO
            };
        }
        else if (field.id == 'NOME_FANTASIA_TRANSP') {
            Url = 'servicos/TB_TRANSPORTADORAS.asmx/BuscaPorNomeFantasia';
            jsData = { NOME_FANTASIA_TRANSP: field.getValue(), ID_USUARIO: _ID_USUARIO };
        }
        else if (field.id == 'CNPJ_TRANSP') {
            Url = 'servicos/TB_TRANSPORTADORAS.asmx/BuscaPorCNPJ';
            jsData = { CNPJ_TRANSP: field.getValue(), ID_USUARIO: _ID_USUARIO };
        }

        _ajax.setUrl(Url);
        _ajax.setJsonData(jsData);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            formTRANSPORTADORAS.getForm().findField('CODIGO_TRANSP').setValue(result.CODIGO_TRANSP);
            formTRANSPORTADORAS.getForm().findField('NOME_TRANSP').setValue(result.NOME_TRANSP);
            formTRANSPORTADORAS.getForm().findField('NOME_FANTASIA_TRANSP').setValue(result.NOME_FANTASIA_TRANSP);
            formTRANSPORTADORAS.getForm().findField('CNPJ_TRANSP').setValue(result.CNPJ_TRANSP);
            formTRANSPORTADORAS.getForm().findField('IE_TRANSP').setValue(result.IE_TRANSP);

            formTRANSPORTADORAS.getForm().findField('ENDERECO_TRANSP').setValue(result.ENDERECO_TRANSP);
            formTRANSPORTADORAS.getForm().findField('NUMERO_END_TRANSP').setValue(result.NUMERO_END_TRANSP);
            formTRANSPORTADORAS.getForm().findField('COMPLEMENTO_END_TRANSP').setValue(result.COMPLEMENTO_END_TRANSP);
            formTRANSPORTADORAS.getForm().findField('CEP_TRANSP').setValue(result.CEP_TRANSP);
            formTRANSPORTADORAS.getForm().findField('BAIRRO_TRANSP').setValue(result.BAIRRO_TRANSP);
            formTRANSPORTADORAS.getForm().findField('ID_MUNICIPIO_TRANSP').setValue(result.ID_MUNICIPIO_TRANSP);
            formTRANSPORTADORAS.getForm().findField('DESCRICAO_CIDADE_TRANSP').setValue(result.DESCRICAO_CIDADE_TRANSP);
            formTRANSPORTADORAS.getForm().findField('ID_UF_TRANSP').setValue(result.ID_UF_TRANSP);

            formTRANSPORTADORAS.getForm().findField('TELEFONE1_TRANSP').setValue(result.TELEFONE1_TRANSP);
            formTRANSPORTADORAS.getForm().findField('TELEFONE2_TRANSP').setValue(result.TELEFONE2_TRANSP);
            formTRANSPORTADORAS.getForm().findField('FAX_TRANSP').setValue(result.FAX_TRANSP);
            formTRANSPORTADORAS.getForm().findField('OBS_TRANSP').setValue(result.OBS_TRANSP);

            formTRANSPORTADORAS.getForm().findField('EMAIL_TRANSP').setValue(result.EMAIL_TRANSP);
            formTRANSPORTADORAS.getForm().findField('CONTATO_TRANSP').setValue(result.CONTATO_TRANSP);

            CB_TRANSPORTE_CLIENTE_NOVO.setValue(result.TRANSPORTE_CLIENTE_NOVO == 1 ? true : false);
            CB_TRANSPORTE_PROPRIO.setValue(result.TRANSPORTE_PROPRIO == 1 ? true : false);

            panelCadastroTransp.setTitle('Alterar dados da Transportadora');

            formTRANSPORTADORAS.getForm().items.items[0].disable();

            Ext.getCmp('NOME_TRANSP').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function PopulaFormulario_TB_TRANSPORTADORA(record, _Pesquisa) {
        formTRANSPORTADORAS.getForm().loadRecord(record);
        panelCadastroTransp.setTitle('Alterar dados da Transportadora');

        formTRANSPORTADORAS.getForm().items.items[0].disable();

        Ext.getCmp('NOME_TRANSP').focus();
        _Pesquisa.hide();
    }

    ///////////////////////// Area do grid /////////////////////////
    function TB_TRANSPORTADORA_MontaPesquisa() {
        var TB_TRANSPORTADORA_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['CODIGO_TRANSP', 'NOME_TRANSP', 'NOME_FANTASIA_TRANSP', 'CNPJ_TRANSP', 'IE_TRANSP', 'ENDERECO_TRANSP',
                     'NUMERO_END_TRANSP', 'COMPLEMENTO_END_TRANSP', 'CEP_TRANSP', 'BAIRRO_TRANSP', 'ID_MUNICIPIO_TRANSP', 'DESCRICAO_CIDADE_TRANSP',
                     'ID_UF_TRANSP', 'DESCRICAO_ESTADO_TRANSP', 'TELEFONE1_TRANSP', 'TELEFONE2_TRANSP', 'FAX_TRANSP', 'OBS_TRANSP',
                     'EMAIL_TRANSP', 'CONTATO_TRANSP', 'TRANSPORTE_CLIENTE_NOVO', 'TRANSPORTE_PROPRIO']
       )
        });

        var gridTransportadoras = new Ext.grid.GridPanel({
            store: TB_TRANSPORTADORA_Store,
            columns: [
        { id: 'CODIGO_TRANSP', header: "ID", width: 60, sortable: true, dataIndex: 'CODIGO_TRANSP', hidden: true },
        { id: 'NOME_TRANSP', header: "Nome / Raz&atilde;o Social", width: 350, sortable: true, dataIndex: 'NOME_TRANSP', hidden: true },
        { id: 'NOME_FANTASIA_TRANSP', header: "Nome Fantasia", width: 210, sortable: true, dataIndex: 'NOME_FANTASIA_TRANSP' },
        { id: 'CNPJ_TRANSP', header: "CNPJ", width: 110, sortable: true, dataIndex: 'CNPJ_TRANSP', hidden: true },
        { id: 'IE_TRANSP', header: "Inscri&ccedil;&atilde;o Estadual", width: 100, sortable: true, dataIndex: 'IE_TRANSP', hidden: true },
        { id: 'ENDERECO_TRANSP', header: "Endere&ccedil;o", width: 250, sortable: true, dataIndex: 'ENDERECO_TRANSP', hidden: true },
        { id: 'NUMERO_END_TRANSP', header: "Numero", width: 70, sortable: true, dataIndex: 'NUMERO_END_TRANSP', hidden: true },

        { id: 'COMPLEMENTO_END_TRANSP', header: "Complemento", width: 90, sortable: true, dataIndex: 'COMPLEMENTO_END_TRANSP', hidden: true },
        { id: 'CEP_TRANSP', header: "CEP", width: 90, sortable: true, dataIndex: 'CEP_TRANSP', hidden: true },
        { id: 'BAIRRO_TRANSP', header: "Bairro", width: 150, sortable: true, dataIndex: 'BAIRRO_TRANSP', hidden: true },
        { id: 'ID_MUNICIPIO_TRANSP', header: "Munic&iacute;pio", width: 60, sortable: true, dataIndex: 'ID_MUNICIPIO_TRANSP', hidden: true },
        { id: 'DESCRICAO_CIDADE_TRANSP', header: "Nome do Munic&iacute;pio", width: 170, sortable: true, dataIndex: 'DESCRICAO_CIDADE_TRANSP' },
        { id: 'ID_UF_TRANSP', header: "UF", width: 60, sortable: true, dataIndex: 'ID_UF_TRANSP', hidden: true },
        { id: 'DESCRICAO_ESTADO_TRANSP', header: "Unidade Federativa", width: 140, sortable: true, dataIndex: 'DESCRICAO_ESTADO_TRANSP' },
        { id: 'TELEFONE1_TRANSP', header: "Telefone 1", width: 140, sortable: true, dataIndex: 'TELEFONE1_TRANSP' },
        { id: 'TELEFONE2_TRANSP', header: "Telefone 2", width: 140, sortable: true, dataIndex: 'TELEFONE2_TRANSP' },
        { id: 'FAX_TRANSP', header: "Fax", width: 110, sortable: true, dataIndex: 'FAX_TRANSP', hidden: true },

        { id: 'OBS_TRANSP', header: "Observa&ccedil;&otilde;es", width: 280, sortable: true, dataIndex: 'OBS_TRANSP', hidden: true },
        { id: 'CONTATO_TRANSP', header: "Contato", width: 150, sortable: true, dataIndex: 'CONTATO_TRANSP' },
        { id: 'EMAIL_TRANSP', header: "e-mail", width: 180, sortable: true, dataIndex: 'EMAIL_TRANSP' }

    ],
            stripeRows: true,
            height: 450,
            width: 1000,

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        var TB_TRANSPORTADORA_TXT_PESQUISA = new Ext.form.TextField(
                {
                    id: 'TB_TRANSPORTADORA_TXT_PESQUISA',
                    name: 'TB_TRANSPORTADORA_TXT_PESQUISA',
                    layout: 'form',
                    fieldLabel: 'Nome da Transportadora',
                    width: 290,
                    listeners: {
                        specialkey: function (f, e) {
                            if (e.getKey() == e.ENTER) {
                                TB_TRANSPORTADORA_Executa_Pesquisa(gridTransportadoras);
                            }
                        }
                    }
                });

        var TB_TRANSPORTADORA_BTN_PESQUISA = new Ext.Button({
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function () {
                TB_TRANSPORTADORA_Executa_Pesquisa();
            }
        });

        function RetornaFiltros_TB_TRANSPORTADORA_JsonData() {
            var TB_TRANSPORTADORA_JsonData = {
                pesquisa: TB_TRANSPORTADORA_TXT_PESQUISA.getValue(),
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: TB_TRANSPORTADORA_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSPORTADORA_JsonData;
        }

        var TB_TRANSPORTADORA_PagingToolbar = new Th2_PagingToolbar();

        TB_TRANSPORTADORA_PagingToolbar.setUrl('servicos/TB_TRANSPORTADORAS.asmx/Lista_TB_TRANSPORTADORA');
        TB_TRANSPORTADORA_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_TRANSPORTADORA_JsonData());
        TB_TRANSPORTADORA_PagingToolbar.setStore(TB_TRANSPORTADORA_Store);

        function TB_TRANSPORTADORA_Executa_Pesquisa() {
            TB_TRANSPORTADORA_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_TRANSPORTADORA_JsonData());
            TB_TRANSPORTADORA_PagingToolbar.doRequest();
        }

        var wgridTransportadoras = new Ext.Window({
            id: 'wgridTransportadoras',
            layout: 'form',
            title: 'Busca',
            iconCls: 'icone_TB_TRANSPORTADORA',
            width: 1010,
            height: 'auto',
            closable: false,
            draggable: true,
            collapsible: false,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            items: [gridTransportadoras, TB_TRANSPORTADORA_PagingToolbar.PagingToolbar(),
                    {
                        layout: 'column',
                        frame: true,
                        items: [{
                            columnWidth: .46,
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 150,
                            style: 'vertical-align: bottom;',
                            items: [TB_TRANSPORTADORA_TXT_PESQUISA]
                        }, {
                            columnWidth: .32,
                            style: 'vertical-align: bottom;',
                            items: [TB_TRANSPORTADORA_BTN_PESQUISA]
                        }]
                    }],
            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            }
        });

        gridTransportadoras.on('rowdblclick', function (grid, rowIndex, e) {
            var store = grid.getStore();
            var record = store.getAt(rowIndex);

            PopulaFormulario_TB_TRANSPORTADORA(record, wgridTransportadoras);
        });

        gridTransportadoras.on('keydown', function (e) {
            if (e.getKey() == e.ENTER) {
                if (gridTransportadoras.getSelectionModel().getSelections().length > 0) {
                    var record = gridTransportadoras.getSelectionModel().getSelected();
                    PopulaFormulario_TB_TRANSPORTADORA(record, wgridTransportadoras);
                }
            }
        });

        return wgridTransportadoras;
    }

    var buttonGroup_TB_TRANSPORTADORA = new Ext.ButtonGroup({
        items: [{
            text: 'Buscar',
            icon: 'imagens/icones/database_search_24.gif',
            scale: 'medium',
            handler: function () {
                wPesquisa.show('formTRANSPORTADORAS');
            }
        }]
    });

    var toolbar_TB_TRANSPORTADORA = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_TRANSPORTADORA]
    });

    var panelCadastroTransp = new Ext.Panel({
        width: '100%',
        border: true,
        frame: true,
        title: 'Nova Transportadora',
        items: [formTRANSPORTADORAS, toolbar_TB_TRANSPORTADORA]
    });

    function GravaDados_TB_TRANSPORTADORA() {
        if (!formTRANSPORTADORAS.getForm().isValid()) {
            return;
        }

        var dados = {
            CODIGO_TRANSP: formTRANSPORTADORAS.getForm().findField('CODIGO_TRANSP').getValue(),
            NOME_TRANSP: formTRANSPORTADORAS.getForm().findField('NOME_TRANSP').getValue(),
            NOME_FANTASIA_TRANSP: formTRANSPORTADORAS.getForm().findField('NOME_FANTASIA_TRANSP').getValue(),
            CNPJ_TRANSP: formTRANSPORTADORAS.getForm().findField('CNPJ_TRANSP').getValue(),
            IE_TRANSP: formTRANSPORTADORAS.getForm().findField('IE_TRANSP').getValue(),

            ENDERECO_TRANSP: formTRANSPORTADORAS.getForm().findField('ENDERECO_TRANSP').getValue(),
            NUMERO_END_TRANSP: formTRANSPORTADORAS.getForm().findField('NUMERO_END_TRANSP').getValue(),
            COMPLEMENTO_END_TRANSP: formTRANSPORTADORAS.getForm().findField('COMPLEMENTO_END_TRANSP').getValue(),
            CEP_TRANSP: formTRANSPORTADORAS.getForm().findField('CEP_TRANSP').getValue(),
            BAIRRO_TRANSP: formTRANSPORTADORAS.getForm().findField('BAIRRO_TRANSP').getValue(),
            ID_MUNICIPIO_TRANSP: formTRANSPORTADORAS.getForm().findField('ID_MUNICIPIO_TRANSP').getValue(),
            ID_UF_TRANSP: formTRANSPORTADORAS.getForm().findField('ID_UF_TRANSP').getValue(),

            TELEFONE1_TRANSP: formTRANSPORTADORAS.getForm().findField('TELEFONE1_TRANSP').getValue(),
            TELEFONE2_TRANSP: formTRANSPORTADORAS.getForm().findField('TELEFONE2_TRANSP').getValue(),
            FAX_TRANSP: formTRANSPORTADORAS.getForm().findField('FAX_TRANSP').getValue(),
            OBS_TRANSP: formTRANSPORTADORAS.getForm().findField('OBS_TRANSP').getValue(),

            EMAIL_TRANSP: formTRANSPORTADORAS.getForm().findField('EMAIL_TRANSP').getValue(),
            CONTATO_TRANSP: formTRANSPORTADORAS.getForm().findField('CONTATO_TRANSP').getValue(),
            TRANSPORTE_CLIENTE_NOVO: CB_TRANSPORTE_CLIENTE_NOVO.checked ? 1 : 0,
            TRANSPORTE_PROPRIO: CB_TRANSPORTE_PROPRIO.checked ? 1 : 0,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroTransp.title == "Nova Transportadora" ?
                'servicos/TB_TRANSPORTADORAS.asmx/GravaNovaTransportadora' :
                'servicos/TB_TRANSPORTADORAS.asmx/AtualizaTransportadora';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroTransp.title == "Nova Transportadora")
                formTRANSPORTADORAS.getForm().reset();

            Ext.getCmp('NOME_TRANSP').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_TRANSPORTADORA() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Transportadora [' +
                formTRANSPORTADORAS.getForm().findField('NOME_FANTASIA_TRANSP').getValue() + ']?', 'formTRANSPORTADORAS', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_TRANSPORTADORAS.asmx/DeletaTransportadora');
                _ajax.setJsonData({
                    CODIGO_TRANSP: Ext.getCmp('CODIGO_TRANSP').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    formTRANSPORTADORAS.getForm().reset();

                    panelCadastroTransp.setTitle('Nova Transportadora');

                    Ext.getDom('NOME_TRANSP').focus();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    /////////////////////////

    formTRANSPORTADORAS.setHeight(Ext.getCmp('tabConteudo').getHeight() - 106);

    return panelCadastroTransp;
}