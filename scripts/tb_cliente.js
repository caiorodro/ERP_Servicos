var SUPERVISOR_VENDEDOR = 0;

function MontaCadastroCLIENTE() {

    var wBusca_Cliente = new BUSCA_TB_CLIENTE();
    var _Pesquisa_Mun = new BUSCA_TB_MUNICIPIO();

    function Busca_Vendedor_Supervisor() {
        if (_VENDEDOR == 1) {
            Ext.getCmp('BTN_NOVO_CLIENTE1').disable();
            Ext.getCmp('BTN_SALVAR_CLIENTE1').disable();
            Ext.getCmp('BTN_DELETAR_TB_CLIENTE').disable();
            Ext.getCmp('NOMEFANTASIA_CLIENTE').disable();
            Ext.getCmp('ID_CLIENTE').disable();
            Ext.getCmp('CNPJ_CLIENTE').disable();
        }
    }


    var TXT_ID_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Cliente',
        id: 'ID_CLIENTE',
        name: 'ID_CLIENTE',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_Busca(this);
                }
            }
        }
    });

    var TXT_NOME_CLIENTE = new Ext.form.TextField({
        id: 'NOME_CLIENTE',
        name: 'NOME_CLIENTE',
        fieldLabel: 'Nome / Raz&atilde;o Social',
        width: 430,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_NOMEFANTASIA_CLIENTE = new Ext.form.TextField({
        id: 'NOMEFANTASIA_CLIENTE',
        name: 'NOMEFANTASIA_CLIENTE',
        fieldLabel: 'Nome Fantasia',
        width: 270,
        maxLength: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_Busca(this);
                }
            }
        }
    });

    TXT_NOMEFANTASIA_CLIENTE.addClass('Th2_FieldPesquisa');

    var CB_PESSOA_CLIENTE = new Ext.form.ComboBox({
        fieldLabel: 'Pessoa',
        id: 'PESSOA',
        name: 'PESSOA',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 110,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Pessoa Jurídica'], [1, 'Pessoa Física']]
        })
    });

    var TXT_CNPJ_CLIENTE = new Th2_FieldMascara({
        fieldLabel: 'CPF / CNPJ',
        id: 'CNPJ_CLIENTE',
        name: 'CNPJ_CLIENTE',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        enableKeyEvents: true,
        Mascara: '99.999.999/9999-99'
    });

    TXT_CNPJ_CLIENTE.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            TB_CLIENTE_Busca(this);
        }
    });

    var TXT_DATA_CADASTRO = new Ext.form.DateField({
        id: 'DATA_CADASTRO',
        name: 'DATA_CADASTRO',
        layout: 'form',
        fieldLabel: 'Data de Cadastro',
        readOnly: true
    });

    var TXT_IE_CLIENTE = new Ext.form.TextField({
        id: 'IE_CLIENTE',
        name: 'IE_CLIENTE',
        fieldLabel: 'Inscri&ccedil;&atilde;o Estadual',
        width: 135,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_IE_SUFRAMA = new Ext.form.TextField({
        id: 'IE_SUFRAMA',
        name: 'IE_SUFRAMA',
        fieldLabel: 'Inscri&ccedil;&atilde;o na Suframa',
        width: 155,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' }
    });

    var TB_CLIENTE_EnderecoFatura = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_FATURA',
        name: 'ENDERECO_FATURA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430
    });

    var TB_CLIENTE_NumeroEnderecoFatura = new Ext.form.TextField({
        fieldLabel: 'Numero',
        id: 'NUMERO_END_FATURA',
        name: 'NUMERO_END_FATURA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TB_CLIENTE_CompEnderecoFatura = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        id: 'COMP_END_FATURA',
        name: 'COMP_END_FATURA',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TB_CLIENTE_CEPFatura = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_FATURA',
        name: 'CEP_FATURA',
        allowBlank: false,
        msgTarget: 'side',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TB_CLIENTE_BAIRROFATURA = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_FATURA',
        name: 'BAIRRO_FATURA',
        allowBlank: false,
        msgTarget: 'side',
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        width: 295
    });

    var _estadoFatura = '';

    function BuscaMunicipio(_id_uf, _id, _descricao, origem) {
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
                _Pesquisa_Mun.ORIGEM(origem);
                _Pesquisa_Mun.show('ESTADO_FATURA');
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var TB_CLIENTE_CIDADEFATURA = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'CIDADE_FATURA',
        name: 'CIDADE_FATURA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        width: 70,
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (Ext.getCmp('ESTADO_FATURA').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ESTADO_FATURA').getValue(), f.getValue(),
                            Ext.getCmp('DESCRICAO_CIDADE_FATURA'),
                            'ESTADO_FATURA');
                    }
                }
            }
        }
    });

    var label_DESCRICAO_CIDADE_FATURA = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_FATURA',
        name: 'DESCRICAO_CIDADE_FATURA',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', disabled: true },
        allowBlank: false
    });

    var combo_TB_CLIENTE_ESTADOFATURA = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ESTADO_FATURA',
        name: 'ESTADO_FATURA',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 150,
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            focus: function (f) {
                _estadoFatura = f.getValue();
            },
            select: function (c, record, index) {
                if (c.getValue() != _estadoFatura) {
                    Ext.getCmp('CIDADE_FATURA').setValue('');
                    Ext.getCmp('DESCRICAO_CIDADE_FATURA').setValue('');
                }
            }
        }
    });

    var TB_CLIENTE_TELEFONEFATURA = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_FATURA',
        name: 'TELEFONE_FATURA',
        allowBlank: true,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var BTN_PESQUISA_MUNICIPIO = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_TB_CLIENTE_ESTADOFATURA.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = Ext.getCmp('ESTADO_FATURA').getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ESTADO_FATURA');
                _Pesquisa_Mun.show(btn.id);
            }
        }
    });

    //////////////////////// Endereço de Faturamento

    var fsEnderecoFatura = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Endere&ccedil;o de Faturamento',
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{ layout: 'column',
            items: [{
                xtype: 'container',
                columnWidth: .51,
                layout: 'form',
                items: [TB_CLIENTE_EnderecoFatura]
            }, {
                xtype: 'container',
                columnWidth: .18,
                layout: 'form',
                items: [TB_CLIENTE_NumeroEnderecoFatura]
            }, {
                xtype: 'container',
                columnWidth: .29,
                layout: 'form',
                labelWidth: 92,
                items: [TB_CLIENTE_CompEnderecoFatura]
            }]
        }, {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .24,
                layout: 'form',
                items: [TB_CLIENTE_CEPFatura]
            }, {
                labelWidth: 35,
                xtype: 'container',
                columnWidth: .50,
                layout: 'form',
                items: [TB_CLIENTE_BAIRROFATURA]
            }]
        }, {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .23,
                layout: 'form',
                items: [combo_TB_CLIENTE_ESTADOFATURA]
            }, {
                xtype: 'container',
                labelWidth: 45,
                columnWidth: .13,
                layout: 'form',
                items: [TB_CLIENTE_CIDADEFATURA]
            }, {
                xtype: 'container',
                columnWidth: .03,
                layout: 'form',
                items: [BTN_PESQUISA_MUNICIPIO]
            }, {
                xtype: 'container',
                columnWidth: .33,
                labelWidth: 1,
                layout: 'form',
                items: [label_DESCRICAO_CIDADE_FATURA]
            }, {
                xtype: 'container',
                columnWidth: .25,
                layout: 'form',
                items: [TB_CLIENTE_TELEFONEFATURA]
            }]
        }]
    });

    ////////////////////// Endereço de Entrega

    var TB_CLIENTE_EnderecoEntrega = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_ENTREGA',
        name: 'ENDERECO_ENTREGA',
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430
    });

    var TB_CLIENTE_NumeroEnderecoEntrega = new Ext.form.TextField({
        fieldLabel: 'Numero',
        id: 'NUMERO_END_ENTREGA',
        name: 'NUMERO_END_ENTREGA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TB_CLIENTE_CompEnderecoEntrega = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        id: 'COMP_END_ENTREGA',
        name: 'COMP_END_ENTREGA',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TB_CLIENTE_CEPENTREGA = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_ENTREGA',
        name: 'CEP_ENTREGA',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TB_CLIENTE_BAIRROENTREGA = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_ENTREGA',
        name: 'BAIRRO_ENTREGA',
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        width: 295
    });

    var TB_CLIENTE_CIDADEENTREGA = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'CIDADE_ENTREGA',
        name: 'CIDADE_ENTREGA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        width: 70,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                if (f.getValue() == '')
                    Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').allowBlank = true;
                else
                    Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').allowBlank = false;

                Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').setValue('');
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (Ext.getCmp('ESTADO_ENTREGA').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ESTADO_ENTREGA').getValue(), f.getValue(),
                            Ext.getCmp('DESCRICAO_CIDADE_ENTREGA'),
                            'ESTADO_ENTREGA');
                    }
                }
            }
        }
    });

    var label_DESCRICAO_CIDADE_ENTREGA = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_ENTREGA',
        name: 'DESCRICAO_CIDADE_ENTREGA',
        width: 300,
        readOnly: true
    });

    var combo_TB_CLIENTE_ESTADOENTREGA = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ESTADO_ENTREGA',
        name: 'ESTADO_ENTREGA',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 150,
        listeners: {
            blur: function (field) {
                if (field.getValue() == '') {
                    Ext.getCmp('CIDADE_ENTREGA').reset();
                    Ext.getCmp('CIDADE_ENTREGA').allowBlank = true;

                    Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').reset();
                    Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').allowBlank = true;
                }
            },
            select: function (f, record, index) {
                Ext.getCmp('CIDADE_ENTREGA').reset();
                Ext.getCmp('CIDADE_ENTREGA').allowBlank = false;

                Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').reset();
                Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').allowBlank = false;
            }
        }
    });

    var TB_CLIENTE_TELEFONEENTREGA = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_ENTREGA',
        name: 'TELEFONE_ENTREGA',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    var BTN_PESQUISA_MUNICIPIO_ENTREGA = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO_ENTREGA',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_TB_CLIENTE_ESTADOENTREGA.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = combo_TB_CLIENTE_ESTADOENTREGA.getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ESTADO_ENTREGA');
                _Pesquisa_Mun.show(btn.id);

            }
        }
    });

    var fsEnderecoEntrega = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Endere&ccedil;o de Entrega',
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{ layout: 'column',
            items: [{
                xtype: 'container',
                columnWidth: .51,
                layout: 'form',
                items: [TB_CLIENTE_EnderecoEntrega]
            }, {
                xtype: 'container',
                columnWidth: .18,
                layout: 'form',
                items: [TB_CLIENTE_NumeroEnderecoEntrega]
            }, {
                xtype: 'container',
                columnWidth: .29,
                layout: 'form',
                labelWidth: 92,
                items: [TB_CLIENTE_CompEnderecoEntrega]
            }]
        }, {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .24,
                layout: 'form',
                items: [TB_CLIENTE_CEPENTREGA]
            }, {
                labelWidth: 35,
                xtype: 'container',
                columnWidth: .50,
                layout: 'form',
                items: [TB_CLIENTE_BAIRROENTREGA]
            }]
        }, {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .23,
                layout: 'form',
                items: [combo_TB_CLIENTE_ESTADOENTREGA]
            }, {
                xtype: 'container',
                labelWidth: 45,
                columnWidth: .13,
                layout: 'form',
                items: [TB_CLIENTE_CIDADEENTREGA]
            }, {
                xtype: 'container',
                columnWidth: .03,
                layout: 'form',
                items: [BTN_PESQUISA_MUNICIPIO_ENTREGA]
            }, {
                xtype: 'container',
                columnWidth: .33,
                labelWidth: 1,
                layout: 'form',
                items: [label_DESCRICAO_CIDADE_ENTREGA]
            }, {
                xtype: 'container',
                columnWidth: .25,
                layout: 'form',
                items: [TB_CLIENTE_TELEFONEENTREGA]
            }]
        }]
    });

    ////////////////////// Endereço de Cobrança

    var TB_CLIENTE_EnderecoCobranca = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        id: 'ENDERECO_COBRANCA',
        name: 'ENDERECO_COBRANCA',
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430
    });

    var TB_CLIENTE_CEPCOBRANCA = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        id: 'CEP_COBRANCA',
        name: 'CEP_COBRANCA',
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TB_CLIENTE_BAIRROCOBRANCA = new Ext.form.TextField({
        fieldLabel: 'Bairro',
        id: 'BAIRRO_COBRANCA',
        name: 'BAIRRO_COBRANCA',
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        width: 295
    });

    var TB_CLIENTE_CIDADECOBRANCA = new Ext.form.NumberField({
        fieldLabel: 'Cidade',
        id: 'CIDADE_COBRANCA',
        name: 'CIDADE_COBRANCA',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        width: 70,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                if (f.getValue() == '')
                    Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').allowBlank = true;
                else
                    Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').allowBlank = false;

                Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').setValue('');
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (Ext.getCmp('ESTADO_COBRANCA').getValue() != '') {
                        BuscaMunicipio(Ext.getCmp('ESTADO_COBRANCA').getValue(), f.getValue(),
                            Ext.getCmp('DESCRICAO_CIDADE_COBRANCA'),
                            'ESTADO_COBRANCA');
                    }
                }
            }
        }
    });

    var label_DESCRICAO_CIDADE_COBRANCA = new Ext.form.TextField({
        id: 'DESCRICAO_CIDADE_COBRANCA',
        name: 'DESCRICAO_CIDADE_COBRANCA',
        width: 300,
        readOnly: true
    });

    var combo_TB_CLIENTE_ESTADOCOBRANCA = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'Estado',
        id: 'ESTADO_COBRANCA',
        name: 'ESTADO_COBRANCA',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 150,
        listeners: {
            blur: function (field) {
                if (field.getValue() == '') {
                    Ext.getCmp('CIDADE_COBRANCA').reset();
                    Ext.getCmp('CIDADE_COBRANCA').allowBlank = true;

                    Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').reset();
                    Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').allowBlank = true;
                }
            },
            select: function (f, record, index) {
                Ext.getCmp('CIDADE_COBRANCA').reset();
                Ext.getCmp('CIDADE_COBRANCA').allowBlank = false;

                Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').reset();
                Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').allowBlank = false;
            }
        }
    });

    var TB_CLIENTE_TELEFONECOBRANCA = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_COBRANCA',
        name: 'TELEFONE_COBRANCA',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    TB_CLIENTE_TABPANEL.setActiveTab(1);
                }
            }
        }
    });

    var BTN_PESQUISA_MUNICIPIO_COBRANCA = new Ext.Button({
        id: 'BTN_PESQUISA_MUNICIPIO_COBRANCA',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        tooltip: 'Pesquisa de Munic&iacute;pios - Preencha o Estado antes de fazer a pesquisa',
        listeners: {
            click: function (btn, e) {
                if (combo_TB_CLIENTE_ESTADOCOBRANCA.getValue() == '') {
                    dialog.MensagemDeErro('Selecione um estado antes.');
                    return;
                }

                var _value = combo_TB_CLIENTE_ESTADOCOBRANCA.getValue();

                _Pesquisa_Mun.UF(_value);
                _Pesquisa_Mun.ORIGEM('ESTADO_COBRANCA');
                _Pesquisa_Mun.show(btn.id);
            }
        }
    });

    var fsEnderecoCobranca = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Endere&ccedil;o de Cobran&ccedil;a',
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [TB_CLIENTE_EnderecoCobranca,
        {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .24,
                layout: 'form',
                items: [TB_CLIENTE_CEPCOBRANCA]
            }, {
                labelWidth: 35,
                xtype: 'container',
                columnWidth: .50,
                layout: 'form',
                items: [TB_CLIENTE_BAIRROCOBRANCA]
            }]
        }, {
            layout: 'column',
            autoEl: {},
            items: [{
                xtype: 'container',
                columnWidth: .23,
                layout: 'form',
                items: [combo_TB_CLIENTE_ESTADOCOBRANCA]
            }, {
                xtype: 'container',
                labelWidth: 45,
                columnWidth: .13,
                layout: 'form',
                items: [TB_CLIENTE_CIDADECOBRANCA]
            }, {
                xtype: 'container',
                columnWidth: .03,
                layout: 'form',
                items: [BTN_PESQUISA_MUNICIPIO_COBRANCA]
            }, {
                xtype: 'container',
                columnWidth: .33,
                labelWidth: 1,
                layout: 'form',
                items: [label_DESCRICAO_CIDADE_COBRANCA]
            }, {
                xtype: 'container',
                columnWidth: .25,
                layout: 'form',
                items: [TB_CLIENTE_TELEFONECOBRANCA]
            }]
        }]
    });

    function GravaDados_TB_CLIENTE() {
        if (!formCLIENTE.getForm().isValid()) {
            TB_CLIENTE_TABPANEL.setActiveTab(0);
            return;
        }

        if (!formCLIENTE_CONFIG_FATURAMENTO.getForm().isValid()) {
            TB_CLIENTE_TABPANEL.setActiveTab(1);
            return;
        }

        var _codigo_cp = Ext.getCmp('CODIGO_CP_CLIENTE').getValue();
        var _codigo_limite = Ext.getCmp('ID_LIMITE_CLIENTE').getValue();

        var dados = {
            ID_CLIENTE: formCLIENTE.getForm().findField('ID_CLIENTE').getValue(),
            NOME_CLIENTE: formCLIENTE.getForm().findField('NOME_CLIENTE').getValue(),
            NOMEFANTASIA_CLIENTE: formCLIENTE.getForm().findField('NOMEFANTASIA_CLIENTE').getValue(),
            CNPJ_CLIENTE: formCLIENTE.getForm().findField('CNPJ_CLIENTE').getValue(),
            IE_CLIENTE: formCLIENTE.getForm().findField('IE_CLIENTE').getValue(),
            IE_SUFRAMA: formCLIENTE.getForm().findField('IE_SUFRAMA').getValue(),

            ENDERECO_FATURA: formCLIENTE.getForm().findField('ENDERECO_FATURA').getValue(),
            NUMERO_END_FATURA: formCLIENTE.getForm().findField('NUMERO_END_FATURA').getValue(),
            COMP_END_FATURA: formCLIENTE.getForm().findField('COMP_END_FATURA').getValue(),

            CEP_FATURA: formCLIENTE.getForm().findField('CEP_FATURA').getValue(),
            BAIRRO_FATURA: formCLIENTE.getForm().findField('BAIRRO_FATURA').getValue(),
            CIDADE_FATURA: formCLIENTE.getForm().findField('CIDADE_FATURA').getValue(),
            ESTADO_FATURA: formCLIENTE.getForm().findField('ESTADO_FATURA').getValue(),
            TELEFONE_FATURA: formCLIENTE.getForm().findField('TELEFONE_FATURA').getValue(),

            ENDERECO_ENTREGA: formCLIENTE.getForm().findField('ENDERECO_ENTREGA').getValue(),
            NUMERO_END_ENTREGA: formCLIENTE.getForm().findField('NUMERO_END_ENTREGA').getValue(),
            COMP_END_ENTREGA: formCLIENTE.getForm().findField('COMP_END_ENTREGA').getValue(),
            CEP_ENTREGA: formCLIENTE.getForm().findField('CEP_ENTREGA').getValue(),
            BAIRRO_ENTREGA: formCLIENTE.getForm().findField('BAIRRO_ENTREGA').getValue(),
            CIDADE_ENTREGA: formCLIENTE.getForm().findField('CIDADE_ENTREGA').getValue(),
            ESTADO_ENTREGA: formCLIENTE.getForm().findField('ESTADO_ENTREGA').getValue(),
            TELEFONE_ENTREGA: formCLIENTE.getForm().findField('TELEFONE_ENTREGA').getValue(),

            ENDERECO_COBRANCA: formCLIENTE.getForm().findField('ENDERECO_COBRANCA').getValue(),
            CEP_COBRANCA: formCLIENTE.getForm().findField('CEP_COBRANCA').getValue(),
            BAIRRO_COBRANCA: formCLIENTE.getForm().findField('BAIRRO_COBRANCA').getValue(),
            CIDADE_COBRANCA: formCLIENTE.getForm().findField('CIDADE_COBRANCA').getValue(),
            ESTADO_COBRANCA: formCLIENTE.getForm().findField('ESTADO_COBRANCA').getValue(),
            TELEFONE_COBRANCA: formCLIENTE.getForm().findField('TELEFONE_COBRANCA').getValue(),

            CODIGO_CP_CLIENTE: _codigo_cp,
            ID_LIMITE_CLIENTE: _codigo_limite,
            CODIGO_VENDEDOR_CLIENTE: Ext.getCmp('CODIGO_VENDEDOR_CLIENTE').getValue(),
            OBS_CLIENTE: Ext.getCmp('OBS_CLIENTE').getValue(),

            EMAIL_CLIENTE: Ext.getCmp('EMAIL_CLIENTE').getValue(),
            ENVIO_NFE_CLIENTE: Ext.getCmp('ENVIO_NFE_CLIENTE').getValue(),
            PESSOA: Ext.getCmp('PESSOA').getValue(),
            CLIENTE_BLOQUEADO: Ext.getCmp('CLIENTE_BLOQUEADO').checked ? 1 : 0,
            FORNECEDOR: Ext.getCmp('_FORNECEDOR').checked ? 1 : 0,

            CODIGO_REGIAO: Ext.getCmp('CODIGO_REGIAO1').getValue(),

            ID_USUARIO: _ID_USUARIO,
            ID_EMPRESA: _ID_EMPRESA
        };

        var Url = panelCadastroCLIENTE.title == "Novo Cliente" ?
                'servicos/TB_CLIENTE.asmx/GravaNovoCliente' :
                'servicos/TB_CLIENTE.asmx/AtualizaCliente';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCLIENTE.title == "Novo Cliente") {
                PreparaNovoCliente();
            }
            else {
                if (panelCadastroCLIENTE.title == "Novo Cliente") {
                    TB_CLIENTE_TABPANEL.setActiveTab(0);
                    formCLIENTE.getForm().findField('NOME_CLIENTE').focus();
                }
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_CLIENTE() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Cliente [' +
                        formCLIENTE.getForm().findField('NOMEFANTASIA_CLIENTE').getValue() + ']?', 'formCLIENTE', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CLIENTE.asmx/DeletaCliente');
                _ajax.setJsonData({
                    ID_CLIENTE: formCLIENTE.getForm().findField('ID_CLIENTE').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    PreparaNovoCliente();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var buttonGroup_TB_CLIENTE = new Ext.ButtonGroup({
        id: 'buttonGroup_TB_CLIENTE',
        items: [{
            id: 'BTN_SALVAR_CLIENTE1',
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_CLIENTE();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        id: 'BTN_NOVO_CLIENTE1',
                        text: 'Novo Cliente',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function () {
                            PreparaNovoCliente();
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                     {
                         id: 'BTN_DELETAR_TB_CLIENTE',
                         text: 'Deletar',
                         icon: 'imagens/icones/database_delete_24.gif',
                         scale: 'medium',
                         disabled: true,
                         handler: function () {
                             Deleta_TB_CLIENTE();
                         }
                     }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Buscar',
                        icon: 'imagens/icones/database_search_24.gif',
                        scale: 'medium',
                        handler: function () {
                            wBusca_Cliente.show('formCLIENTE');
                        }
                    }]
    });

    Busca_Vendedor_Supervisor();

    var toolbar_TB_CLIENTE = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_CLIENTE]
    });

    var formCLIENTE = new Ext.FormPanel({
        id: 'formCLIENTE',
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        width: '100%',
        labelAlign: 'left',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.17,
                layout: 'form',
                items: [TXT_ID_CLIENTE]
            }, {
                columnWidth: 0.46,
                layout: 'form',
                labelWidth: 120,
                items: [TXT_NOME_CLIENTE]
            }, {
                columnWidth: 0.19,
                layout: 'form',
                labelWidth: 105,
                items: [TXT_DATA_CADASTRO]
            }, {
                columnWidth: 0.18,
                labelWidth: 40,
                layout: 'form',
                items: [CB_PESSOA_CLIENTE]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.40,
                layout: 'form',
                items: [TXT_NOMEFANTASIA_CLIENTE]
            }, {
                columnWidth: 0.24,
                layout: 'form',
                labelWidth: 65,
                items: [TXT_CNPJ_CLIENTE]
            }, {
                columnWidth: 0.25,
                layout: 'form',
                items: [TXT_IE_CLIENTE]
            }]
        }, {
            labelWidth: 125,
            layout: 'form',
            items: [TXT_IE_SUFRAMA]
        }]
    });

    formCLIENTE.add(fsEnderecoFatura);
    formCLIENTE.add(fsEnderecoEntrega);
    formCLIENTE.add(fsEnderecoCobranca);

    var pCreditos = new MontaCreditoCliente();
    var pDocumentosCliente = new MontaCadastroDocumentoCliente();

    _documento_cliente = pDocumentosCliente;

    // TabPanels
    var TB_CLIENTE_TABPANEL = new Ext.TabPanel({
        id: 'TB_CLIENTE_TABPANEL',
        deferredRender: false,
        activeTab: 0,
        defaults: { hideMode: 'offsets' },
        items: [{
            title: 'Dados Principais',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_DADOS_GERAIS'
        }, {
            title: 'Configura&ccedil;&otilde;es de Faturamento',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_CONFIG_FATURAMENTO'
        }, {
            title: 'Contatos do Cliente',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_CONTATOS',
            disabled: true
        }, {
            title: 'Informa&ccedil;&otilde;es de Cr&eacute;dito',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_CREDITO',
            disabled: true,
            items: [pCreditos.painelCreditos()]
        }, {
            title: 'Documentos do cliente',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_IMPORTA_XML',
            disabled: true,
            items: [pDocumentosCliente.Panel()]
        }]
    });

    TB_CLIENTE_TABPANEL.items.items[0].add(formCLIENTE);

    var pContatos = new CriaPanelTB_CLIENTE_CONTATO();
    TB_CLIENTE_TABPANEL.items.items[2].add(pContatos.panelCONTATO_CLIENTE());

    TB_CLIENTE_TABPANEL.items.items[2].on('activate', function (p) {
        pContatos.CarregaGridContatos();
    });

    TB_CLIENTE_TABPANEL.items.items[3].on('activate', function (p) {
        var _codigoCli = Ext.getCmp('ID_CLIENTE').getValue() == '' ? 0 : Ext.getCmp('ID_CLIENTE').getValue();

        pCreditos.CalculaTotais(_codigoCli);
    });

    TB_CLIENTE_TABPANEL.items.items[4].on('activate', function (p) {
        pDocumentosCliente.ID_CLIENTE(TXT_ID_CLIENTE.getValue());
        pDocumentosCliente.carregaGrid();
    });

    TB_COND_PAGTO_CARREGA_COMBO();

    var combo_CODIGO_CP_CLIENTE = new Ext.form.ComboBox({
        store: combo_TB_COND_PAGTO_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        name: 'CODIGO_CP_CLIENTE',
        id: 'CODIGO_CP_CLIENTE',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 350,
        allowBlank: false,
        msgTarget: 'side'
    });

    TB_LIMITE_CARREGA_COMBO();

    var combo_ID_LIMITE_CLIENTE = new Ext.form.ComboBox({
        store: combo_TB_LIMITE_STORE,
        fieldLabel: 'Limite de Cr&eacute;dito',
        name: 'ID_LIMITE_CLIENTE',
        id: 'ID_LIMITE_CLIENTE',
        valueField: 'ID_LIMITE',
        displayField: 'VALOR_LIMITE',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 160,
        allowBlank: false,
        msgTarget: 'side'
    });

    TB_USUARIO_CARREGA_VENDEDORES();

    var combo_CODIGO_VENDEDOR_CLIENTE = new Ext.form.ComboBox({
        store: combo_TB_VENDEDORES_Store,
        fieldLabel: 'Vendedor Associado',
        id: 'CODIGO_VENDEDOR_CLIENTE',
        name: 'CODIGO_VENDEDOR_CLIENTE',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione o Vendedor aqui...',
        selectOnFocus: true,
        width: 350,
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_OBS_CLIENTE = new Ext.form.TextField({
        id: 'OBS_CLIENTE',
        name: 'OBS_CLIENTE',
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 45,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    TB_REGIAO_CARREGA_COMBO();

    var CB_CODIGO_REGIAO = new Ext.form.ComboBox({
        store: combo_TB_REGIAO_STORE,
        id: 'CODIGO_REGIAO1',
        name: 'CODIGO_REGIAO1',
        fieldLabel: 'Regi&atilde;o de Vendas',
        valueField: 'CODIGO_REGIAO',
        displayField: 'NOME_REGIAO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 350,
        allowBlank: false
    });

    var CB_CLIENTE_BLOQUEADO = new Ext.form.Checkbox({
        boxLabel: 'Cliente Bloqueado',
        name: 'CLIENTE_BLOQUEADO',
        id: 'CLIENTE_BLOQUEADO'
    });

    var CB_FORNECEDOR = new Ext.form.Checkbox({
        boxLabel: 'Fornecedor',
        name: '_FORNECEDOR',
        id: '_FORNECEDOR'
    });

    var TXT_EMAIL_CLIENTE = new Ext.form.TextField({
        id: 'EMAIL_CLIENTE',
        name: 'EMAIL_CLIENTE',
        fieldLabel: 'e-mail de Envio do XML',
        width: 350,
        maxLength: 55,
        allowBlank: false,
        msgTarget: 'side',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '55' },
        vtype: 'email'
    });

    var CB_ENVIO_NFE_CLIENTE = new Ext.form.ComboBox({
        fieldLabel: 'Forma de Envio da NFE',
        id: 'ENVIO_NFE_CLIENTE',
        name: 'ENVIO_NFE_CLIENTE',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 180,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
                    'Opc',
                    'Opcao'
                ],
            data: [['0', 'Enviar o XML'], ['1', 'Enviar o PDF'], ['2', 'Enviar o XML e o PDF']]
        })
    });

    //////////////////////////////////
    var fsConfigFaturamentoCliente = new Ext.form.FieldSet({
        id: 'fsConfigFaturamentoCliente',
        title: 'Configura&ccedil;&otilde;es de Faturamento',
        checkboxToggle: false,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '98%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.34,
                layout: 'form',
                items: [combo_CODIGO_CP_CLIENTE]
            }, {
                columnWidth: 0.35,
                layout: 'form',
                items: [CB_CODIGO_REGIAO]
            }, {
                columnWidth: 0.21,
                layout: 'form',
                items: [combo_ID_LIMITE_CLIENTE]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .34,
                layout: 'form',
                items: [combo_CODIGO_VENDEDOR_CLIENTE]
            }, {
                columnWidth: .35,
                layout: 'form',
                items: [TXT_EMAIL_CLIENTE]
            }, {
                columnWidth: .21,
                layout: 'form',
                items: [CB_ENVIO_NFE_CLIENTE]
            }]
        }, {
            layout: 'form',
            items: [TXT_OBS_CLIENTE]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [CB_CLIENTE_BLOQUEADO]
            }, {
                columnWidth: .13,
                layout: 'form',
                items: [CB_FORNECEDOR]
            }]
        }]
    });

    var formCLIENTE_CONFIG_FATURAMENTO = new Ext.FormPanel({
        id: 'formCLIENTE_CONFIG_FATURAMENTO',
        bodyStyle: 'padding:0px 0px 0',
        frame: true,
        width: '100%',
        labelAlign: 'top',
        layout: 'form',
        items: [fsConfigFaturamentoCliente]
    });

    TB_CLIENTE_TABPANEL.items.items[1].add(formCLIENTE_CONFIG_FATURAMENTO);

    var panelCadastroCLIENTE = new Ext.Panel({
        id: 'panelCadastroCLIENTE',
        width: '100%',
        border: true,
        height: '100%',
        title: 'Novo Cliente',
        items: [TB_CLIENTE_TABPANEL, toolbar_TB_CLIENTE]
    });

    TH2_CARREGA_UF();

    var TB_CLIENTE_alturaConteudo = AlturaDoPainelDeConteudo(99);

    TB_CLIENTE_TABPANEL.setHeight(TB_CLIENTE_alturaConteudo);
    formCLIENTE.setHeight(TB_CLIENTE_alturaConteudo);
    formCLIENTE_CONFIG_FATURAMENTO.setHeight(TB_CLIENTE_alturaConteudo);

    return panelCadastroCLIENTE;
}

function PreparaNovoCliente() {
    var form2 = Ext.getCmp('formCLIENTE_CONFIG_FATURAMENTO');

    Ext.getCmp('CODIGO_CP_CLIENTE').setValue(0);

    Ext.getCmp('CODIGO_VENDEDOR_CLIENTE').setValue(0);
    Ext.getCmp('OBS_CLIENTE').setValue('');

    Ext.getCmp('CLIENTE_BLOQUEADO').setValue(false);
    Ext.getCmp('_FORNECEDOR').setValue(false);

    Ext.getCmp('TB_CLIENTE_TABPANEL').setActiveTab(0);

    Ext.getCmp('formCLIENTE').getForm().reset();

    Ext.getCmp('buttonGroup_TB_CLIENTE').items.items[32].disable();
    Ext.getCmp('formCLIENTE').getForm().items.items[0].enable();
    Ext.getCmp('panelCadastroCLIENTE').setTitle('Novo Cliente');
    Ext.getCmp('NOME_CLIENTE').focus();

    Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[2].disable();
    Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[3].disable();
    Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[4].disable();
}

function TB_CLIENTE_Busca(_elem) {
    var Url = '';
    var dados;

    var form1 = Ext.getCmp('formCLIENTE');
    var form2 = Ext.getCmp('formCLIENTE_CONFIG_FATURAMENTO');

    if (_elem.id == "ID_CLIENTE") {
        Url = 'servicos/TB_CLIENTE.asmx/BuscaPorID';
        dados = {
            ID_CLIENTE: form1.getForm().findField('ID_CLIENTE').getValue(),
            ID_USUARIO: _ID_USUARIO
        };
    }
    else if (_elem.id == "NOMEFANTASIA_CLIENTE") {
        Url = 'servicos/TB_CLIENTE.asmx/BuscaPorNomeFantasia';
        dados = {
            NOMEFANTASIA_CLIENTE: form1.getForm().findField('NOMEFANTASIA_CLIENTE').getValue(),
            ID_USUARIO: _ID_USUARIO
        };
    }
    else if (_elem.id == "CNPJ_CLIENTE") {
        Url = 'servicos/TB_CLIENTE.asmx/BuscaPorCNPJ';
        dados = {
            CNPJ_CLIENTE: form1.getForm().findField('CNPJ_CLIENTE').getValue(),
            ID_USUARIO: _ID_USUARIO
        };
    }

    var _ajax = new Th2_Ajax();
    _ajax.setUrl(Url);
    _ajax.setJsonData(dados);

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        form1.getForm().findField('ID_CLIENTE').setValue(result.ID_CLIENTE);
        form1.getForm().findField('NOME_CLIENTE').setValue(result.NOME_CLIENTE);
        form1.getForm().findField('NOMEFANTASIA_CLIENTE').setValue(result.NOMEFANTASIA_CLIENTE);
        form1.getForm().findField('CNPJ_CLIENTE').setValue(result.CNPJ_CLIENTE);
        form1.getForm().findField('IE_CLIENTE').setValue(result.IE_CLIENTE);
        form1.getForm().findField('IE_SUFRAMA').setValue(result.IE_SUFRAMA);

        form1.getForm().findField('ENDERECO_FATURA').setValue(result.ENDERECO_FATURA);

        form1.getForm().findField('NUMERO_END_FATURA').setValue(result.NUMERO_END_FATURA);
        form1.getForm().findField('COMP_END_FATURA').setValue(result.COMP_END_FATURA);

        form1.getForm().findField('CEP_FATURA').setValue(result.CEP_FATURA);
        form1.getForm().findField('BAIRRO_FATURA').setValue(result.BAIRRO_FATURA);
        form1.getForm().findField('ESTADO_FATURA').setValue(result.ESTADO_FATURA);

        form1.getForm().findField('CIDADE_FATURA').setValue(result.CIDADE_FATURA);
        form1.getForm().findField('DESCRICAO_CIDADE_FATURA').setValue(result.DESCRICAO_CIDADE_FATURA);

        form1.getForm().findField('TELEFONE_FATURA').setValue(result.TELEFONE_FATURA);

        form1.getForm().findField('ENDERECO_ENTREGA').setValue(result.ENDERECO_ENTREGA);
        form1.getForm().findField('NUMERO_END_ENTREGA').setValue(result.NUMERO_END_ENTREGA);
        form1.getForm().findField('COMP_END_ENTREGA').setValue(result.COMP_END_ENTREGA);

        form1.getForm().findField('CEP_ENTREGA').setValue(result.CEP_ENTREGA);
        form1.getForm().findField('BAIRRO_ENTREGA').setValue(result.BAIRRO_ENTREGA);

        form1.getForm().findField('ESTADO_ENTREGA').setValue(result.ESTADO_ENTREGA);

        if (result.CIDADE_ENTREGA == "0") {
            form1.getForm().findField('CIDADE_ENTREGA').setValue("");
            Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').setValue("");
        }
        else {
            form1.getForm().findField('CIDADE_ENTREGA').setValue(result.CIDADE_ENTREGA);
            Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').setValue(result.DESCRICAO_CIDADE_ENTREGA);
        }

        form1.getForm().findField('TELEFONE_ENTREGA').setValue(result.TELEFONE_ENTREGA);

        form1.getForm().findField('ENDERECO_COBRANCA').setValue(result.ENDERECO_COBRANCA);
        form1.getForm().findField('CEP_COBRANCA').setValue(result.CEP_COBRANCA);
        form1.getForm().findField('BAIRRO_COBRANCA').setValue(result.BAIRRO_COBRANCA);

        form1.getForm().findField('ESTADO_COBRANCA').setValue(result.ESTADO_COBRANCA);

        if (result.CIDADE_COBRANCA == "0") {
            form1.getForm().findField('CIDADE_COBRANCA').setValue("");
            Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').setValue("");
        }
        else {
            form1.getForm().findField('CIDADE_COBRANCA').setValue(result.CIDADE_COBRANCA);
            Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').setValue(result.DESCRICAO_CIDADE_COBRANCA);
        }

        form1.getForm().findField('TELEFONE_COBRANCA').setValue(result.TELEFONE_COBRANCA);

        Ext.getCmp('CODIGO_CP_CLIENTE').setValue(result.CODIGO_CP_CLIENTE);
        Ext.getCmp('ID_LIMITE_CLIENTE').setValue(result.ID_LIMITE_CLIENTE);

        Ext.getCmp('CODIGO_VENDEDOR_CLIENTE').setValue(result.CODIGO_VENDEDOR_CLIENTE);
        Ext.getCmp('OBS_CLIENTE').setValue(result.OBS_CLIENTE);

        Ext.getCmp('EMAIL_CLIENTE').setValue(result.EMAIL_CLIENTE);
        Ext.getCmp('ENVIO_NFE_CLIENTE').setValue(result.ENVIO_NFE_CLIENTE);
        Ext.getCmp('PESSOA').setValue(result.PESSOA);

        Ext.getCmp('DATA_CADASTRO').setRawValue(result.DATA_CADASTRO);

        Ext.getCmp('CODIGO_REGIAO1').setValue(result.CODIGO_REGIAO);

        if (result.CLIENTE_BLOQUEADO == 1)
            Ext.getCmp('CLIENTE_BLOQUEADO').setValue(true);
        else
            Ext.getCmp('CLIENTE_BLOQUEADO').setValue(false);

        if (result.FORNECEDOR == 1)
            Ext.getCmp('_FORNECEDOR').setValue(true);
        else
            Ext.getCmp('_FORNECEDOR').setValue(false);

        Ext.getCmp('panelCadastroCLIENTE').setTitle('Alterar dados do Cliente - ' + result.NOMEFANTASIA_CLIENTE);
        form1.getForm().items.items[0].disable();

        if (SUPERVISOR_VENDEDOR == 0)
            Ext.getCmp('buttonGroup_TB_CLIENTE').items.items[32].enable();

        Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[2].enable();
        Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[3].enable();
        Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[4].enable();

        Ext.getDom('NOME_CLIENTE').focus();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}
