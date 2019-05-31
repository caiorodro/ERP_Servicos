function MontaCertificado() {

    var hCERTIFICADO = new Ext.form.Hidden();

    var hID_PRODUTO_CERTIFICADO = new Ext.form.Hidden();

    var ultimos_certificados = new JANELA_CERTIFICADOS();

    var _janelaNovoEmail = new janela_Envio_Email('_certificado');

    TB_MATERIAL_COMBO();

    var _ID_PRODUTO;

    var CB_ID_MATERIAL = new Ext.form.ComboBox({
        store: combo_TB_MATERIAL,
        fieldLabel: 'Material',
        id: 'ID_MATERIAL1',
        name: 'ID_MATERIAL1',
        valueField: 'ID_MATERIAL',
        displayField: 'DESCRICAO_MATERIAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 230,
        allowBlank: false
    });

    TB_PROPRIEDADE_COMBO();

    var CB_ID_PROPRIEDADE = new Ext.form.ComboBox({
        store: combo_TB_PROPRIEDADE,
        fieldLabel: 'Propriedade Mec&acirc;nica',
        id: 'ID_PROPRIEDADE_MECANICA1',
        name: 'ID_PROPRIEDADE_MECANICA1',
        valueField: 'ID_PROPRIEDADE_MECANICA',
        displayField: 'CLASSE_RESISTENCIA_GRAU',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 230,
        value: 0,
        allowBlank: false
    });

    TB_ACABAMENTO_COMBO();

    var CB_ID_ACABAMENTO = new Ext.form.ComboBox({
        store: combo_TB_ACABAMENTO,
        fieldLabel: 'Acabamento Superficial',
        id: 'ID_ACABAMENTO1',
        name: 'ID_ACABAMENTO1',
        valueField: 'ID_ACABAMENTO_SUPERFICIAL',
        displayField: 'DESCRICAO_ACABAMENTO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 230,
        value: 0,
        allowBlank: false
    });

    var TB_NOTAS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_NF'])
    });

    function Carrega_Notas() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/NOTAS_DO_ITEM');
        _ajax.setJsonData({
            NUMERO_PEDIDO: TXT_NUMERO_PEDIDO.getValue(),
            NUMERO_ITEM: TXT_ITEM_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TB_NOTAS_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var CB_NOTAS = new Ext.form.ComboBox({
        store: TB_NOTAS_Store,
        fieldLabel: "NFs do Item",
        valueField: 'NUMERO_NF',
        displayField: 'NUMERO_NF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 90,
        value: 0,
        listeners: {
            select: function (combo, record, index) {
                if (record.data.NUMERO_NF > 0) {
                    BuscaQtdeNF(record.data.NUMERO_NF);
                    TXT_NUMERO_CERTIFICADO.setValue(combo.getValue());
                }
            }
        }
    });

    var TXT_NUMERO_LOTE = new Ext.form.TextField({
        fieldLabel: 'Nr. Lote',
        name: 'NUMERO_LOTE',
        id: 'NUMERO_LOTE',
        width: 130,
        maxlength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' }
    });

    var TXT_NORMA_APLICAVEL = new Ext.form.TextField({
        fieldLabel: 'Norma Aplic&aacute;vel',
        name: 'NORMA_APLICAVEL',
        id: 'NORMA_APLICAVEL',
        width: 130,
        maxlength: 15,
        value: 'PADRÃO INDUFIX',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_NUMERO_DESENHO = new Ext.form.TextField({
        fieldLabel: 'Nr. Desenho',
        name: 'NUMERO_DESENHO',
        id: 'NUMERO_DESENHO',
        width: 100,
        maxlength: 15,
        value: 0
    });

    var TXT_NUMERO_CERTIFICADO = new Ext.form.TextField({
        fieldLabel: 'Nr. Certificado',
        name: 'NUMERO_CERTIFICADO',
        id: 'NUMERO_CERTIFICADO',
        width: 100,
        maxlength: 20,
        value: 0
    });

    var TXT_NUMERO_ITEM_CERTIFICADO = new Ext.form.NumberField({
        fieldLabel: 'Nr. Item',
        name: 'NUMERO_ITEM_CERTIFICADO',
        id: 'NUMERO_ITEM_CERTIFICADO',
        width: 100,
        maxlength: 20,
        minValue: 0,
        allowBlank: false,
        value: 0,
        decimalPrecision: 0
    });

    var TXT_COD_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 180,
        readOnly: true
    });

    var TXT_DESCRICAO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do Produto',
        width: 380,
        readOnly: true
    });

    var TXT_NUMERO_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'Numero do Pedido',
        width: 100,
        readOnly: true
    });

    var TXT_ITEM_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'Item do Pedido',
        width: 100,
        readOnly: true
    });

    var TXT_QTDE_PRODUTO = new Ext.form.NumberField({
        fieldLabel: 'Qtde. NF / Pedido',
        width: 100,
        minValue: 0.01,
        decimalPrecision: 2,
        decimalSeparator: ',',
        allowBlank: false
    });


    this.ID_PRODUTO = function (pID_PRODUTO) {
        _ID_PRODUTO = pID_PRODUTO;
    };

    this.setaCodigoProduto = function (pCODIGO) {
        TXT_COD_PRODUTO.setValue(pCODIGO);
    };

    this.setaDescricaoProduto = function (pDESCRICAO) {
        TXT_DESCRICAO_PRODUTO.setValue(pDESCRICAO);
    };

    this.setaQtde = function (pQTDE) {
        TXT_QTDE_PRODUTO.setValue(pQTDE);
    };

    this.NUMERO_PEDIDO_VENDA = function (pNUMERO_PEDIDO) {
        TXT_NUMERO_PEDIDO.setValue(pNUMERO_PEDIDO);
    };

    this.NUMERO_ITEM_VENDA = function (pNUMERO_ITEM) {
        TXT_ITEM_PEDIDO.setValue(pNUMERO_ITEM);
    };

    this.seta_Numero_Lote = function (pNUMERO_LOTE) {
        TXT_NUMERO_LOTE.setValue(pNUMERO_LOTE);
    };

    function Gera_Numero_Desenho() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/GERA_NUMERO_DESENHO');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TXT_NUMERO_DESENHO.setValue(result);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var BTN_GERA_NUMERO_DESENHO = new Ext.Button({
        icon: 'imagens/icones/reload_24.gif',
        scale: 'large',
        tooltip: 'Gera um novo numero de desenho',
        listeners: {
            click: function (btn, e) {
                Gera_Numero_Desenho();
            }
        }
    });

    function BuscaQtdeNF(NUMERO_NF) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/Qtde_Item');
        _ajax.setJsonData({
            NUMERO_PEDIDO: TXT_NUMERO_PEDIDO.getValue(),
            NUMERO_ITEM: TXT_ITEM_PEDIDO.getValue(),
            NUMERO_NF: NUMERO_NF,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TXT_QTDE_PRODUTO.setValue(result);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var formCERTIFICADO = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 200,
        items: [{
            xtype: 'fieldset',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .13,
                    layout: 'form',
                    items: [TXT_NUMERO_PEDIDO]

                }, {
                    columnWidth: .13,
                    layout: 'form',
                    items: [TXT_ITEM_PEDIDO]
                }, {
                    columnWidth: .18,
                    layout: 'form',
                    items: [TXT_COD_PRODUTO]
                }, {
                    columnWidth: .35,
                    layout: 'form',
                    items: [TXT_DESCRICAO_PRODUTO]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_QTDE_PRODUTO]
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.22,
                layout: 'form',
                items: [CB_ID_MATERIAL]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                items: [CB_ID_PROPRIEDADE]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                items: [CB_ID_ACABAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.15,
                layout: 'form',
                items: [CB_NOTAS]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_NUMERO_CERTIFICADO]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_NUMERO_ITEM_CERTIFICADO]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_NUMERO_DESENHO]
            }, {
                columnWidth: 0.07,
                layout: 'form',
                items: [BTN_GERA_NUMERO_DESENHO]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_NUMERO_LOTE]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                items: [TXT_NORMA_APLICAVEL]
            }]
        }]
    });

    function Imprime_Certificado() {
        if (gridCERTIFICADO.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um Certificado gravado para imprimir');
            return;
        }

        var record = gridCERTIFICADO.getSelectionModel().selections.items[0];

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Emite_Certificado');
        _ajax.setJsonData({
            EMAIL_USUARIO: _record_conta_email.data.CONTA_EMAIL,
            LOGIN_USUARIO: _LOGIN_USUARIO,
            ID_CERTIFICADO: record.data.ID_CERTIFICADO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            ResetaFormulario();
            TB_CERTIFICADO_CARREGA_GRID();

            var result = Ext.decode(response.responseText).d;

            window.open(result, 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Envia_Certificado_por_email() {
        if (gridCERTIFICADO.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais certificados gravados para enviar por e-mail');
            return;
        }

        var NUMEROS_CERTIFICADOS = new Array();

        for (var i = 0; i < gridCERTIFICADO.getSelectionModel().selections.length; i++) {
            NUMEROS_CERTIFICADOS[i] = gridCERTIFICADO.getSelectionModel().selections.items[i].data.ID_CERTIFICADO;
        }

        var record = gridCERTIFICADO.getSelectionModel().selections.items[0];

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Anexa_Varios_Certificados');
        _ajax.setJsonData({
            NUMEROS_CERTIFICADOS: NUMEROS_CERTIFICADOS,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
            EMAIL_USUARIO: _record_conta_email.data.CONTA_EMAIL,
            LOGIN_USUARIO: _LOGIN_USUARIO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            ResetaFormulario();

            var result = Ext.decode(response.responseText).d;

            _janelaNovoEmail.resetaFormulario();
            _janelaNovoEmail.Botao_Salvar(true);
            _janelaNovoEmail.Botao_Enviar(true);
            _janelaNovoEmail.Botao_Responder(false);
            _janelaNovoEmail.Botao_Encaminhar(false);

            _janelaNovoEmail.setRemetente(_record_conta_email.data.CONTA_EMAIL);
            _janelaNovoEmail.setDestinatario(result[1]);
            _janelaNovoEmail.setBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
            _janelaNovoEmail.setRawBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);

            _janelaNovoEmail.NUMERO_CRM(0);
            _janelaNovoEmail.setAssunto('A/C. ' + result[0] + ' - Certificado de Qualidade [' + _EMITENTE + '] Pedido: ' + result[2] + ' item: ' + result[3]);

            for (var i = 4; i < result.length; i++) {
                _janelaNovoEmail.AdicionaNovoAnexo(result[i]);
            }

            _janelaNovoEmail.show('BTN_ENVIA_CERTIFICADO_EMAIL');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //////////////////
    var buttonGroup_TB_CERTIFICADO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_CERTIFICADO();
            }
        },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Certificado',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    Ext.getCmp('BTN_DELETAR_CERTIFICADO').disable();

                                    TXT_QTDE_PRODUTO.focus();
                                    ResetaFormulario();
                                    pCERTIFICADO.setTitle('Novo Certificado');
                                }
                            },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_CERTIFICADO',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_CERTIFICADO();
                                 }
                             },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               {
                                   text: 'Imprimir Certificado',
                                   icon: 'imagens/icones/printer_24.gif',
                                   scale: 'medium',
                                   handler: function () {
                                       Imprime_Certificado();
                                   }
                               },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    text: 'Salvar Conjunto',
    icon: 'imagens/icones/database_save_24.gif',
    scale: 'medium',
    handler: function () {
        Salva_Conjunto();
    }
},
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Ultimos Certificados<br />do Produto',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            handler: function () {
                ultimos_certificados.ID_PRODUTO(_ID_PRODUTO);
                ultimos_certificados.NUMERO_PEDIDO(TXT_NUMERO_PEDIDO.getValue());
                ultimos_certificados.NUMERO_ITEM(TXT_ITEM_PEDIDO.getValue());
                ultimos_certificados.QTDE_PRODUTO(TXT_QTDE_PRODUTO.getValue());

                ultimos_certificados.acao(function () { TB_CERTIFICADO_CARREGA_GRID() });

                ultimos_certificados.show('gridCERTIFICADO');
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_ENVIA_CERTIFICADO_EMAIL',
            text: 'Enviar Certificado(s)<br />por e-mail',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'large',
            handler: function () {
                Envia_Certificado_por_email();
            }
        }]
    });

    function Salva_Conjunto() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/Grava_Itens_Conjunto');
        _ajax.setJsonData({
            NUMERO_PEDIDO: TXT_NUMERO_PEDIDO.getValue(),
            NUMERO_ITEM: TXT_ITEM_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            TB_CERTIFICADO_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_CERTIFICADO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_CERTIFICADO]
    });

    function GravaDados_TB_CERTIFICADO() {
        if (!formCERTIFICADO.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_CERTIFICADO: hCERTIFICADO.getValue(),
            NUMERO_CERTIFICADO: TXT_NUMERO_CERTIFICADO.getValue(),
            NUMERO_ITEM_CERTIFICADO: TXT_NUMERO_ITEM_CERTIFICADO.getValue(),
            NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO.getValue(),
            NUMERO_ITEM_VENDA: TXT_ITEM_PEDIDO.getValue(),
            ID_PRODUTO_CERTIFICADO: hID_PRODUTO_CERTIFICADO.getValue(),
            MEDIDA: '',
            ID_MATERIAL: CB_ID_MATERIAL.getValue(),
            ID_PROPRIEDADE_MECANICA: CB_ID_PROPRIEDADE.getValue() == '' ? 0 : CB_ID_PROPRIEDADE.getValue(),
            ID_ACABAMENTO_SUPERFICIAL: CB_ID_ACABAMENTO.getValue() == '' ? 0 : CB_ID_ACABAMENTO.getValue(),
            NUMERO_LOTE: TXT_NUMERO_LOTE.getValue(),
            NORMA_APLICAVEL: TXT_NORMA_APLICAVEL.getValue(),
            NUMERO_DESENHO: TXT_NUMERO_DESENHO.getValue(),
            QTDE_PRODUTO: TXT_QTDE_PRODUTO.getValue(),
            NUMERO_NF: CB_NOTAS.getValue() > 0 ? CB_NOTAS.getValue() : 0,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = pCERTIFICADO.title == "Novo Certificado" ?
                        'servicos/TB_CERTIFICADO_PRODUTO.asmx/GravaNovoCertificado' :
                        'servicos/TB_CERTIFICADO_PRODUTO.asmx/AtualizaCertificado';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (pCERTIFICADO.title == "Novo Certificado") {
                ResetaFormulario();
            }

            TXT_QTDE_PRODUTO.focus();

            TB_CERTIFICADO_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function ResetaFormulario() {
        hCERTIFICADO.reset();
        TXT_NUMERO_CERTIFICADO.setValue(0);
        TXT_NUMERO_DESENHO.setValue('');
        TXT_NUMERO_ITEM_CERTIFICADO.setValue(0);
        TXT_NUMERO_LOTE.reset();
        TXT_NORMA_APLICAVEL.reset();
        CB_NOTAS.setValue(0);
        CB_ID_MATERIAL.reset();
        hID_PRODUTO_CERTIFICADO.setValue(0);

        var _ID_PRODIEDADE;
        var _ID_ACABAMENTO;

        while (true) {
            var _index = combo_TB_ACABAMENTO.find('DESCRICAO_ACABAMENTO', '-');
            var _index1 = combo_TB_PROPRIEDADE.find('CLASSE_RESISTENCIA_GRAU', '-');

            if (_index > -1 && _index1 > -1) {
                _ID_ACABAMENTO = combo_TB_ACABAMENTO.getAt(_index).data.ID_ACABAMENTO_SUPERFICIAL;
                _ID_PRODIEDADE = combo_TB_PROPRIEDADE.getAt(_index1).data.ID_PROPRIEDADE_MECANICA;
                break;
            }
        }

        CB_ID_PROPRIEDADE.setValue(_ID_PRODIEDADE);
        CB_ID_ACABAMENTO.setValue(_ID_ACABAMENTO);

        pCERTIFICADO.setTitle('Novo Certificado');
    }

    //////////////////

    function PopulaFormulario(record) {
        CB_NOTAS.setValue(record.data.NUMERO_NF);
        CB_ID_ACABAMENTO.setValue(record.data.ID_ACABAMENTO_SUPERFICIAL);
        CB_ID_MATERIAL.setValue(record.data.ID_MATERIAL);
        CB_ID_PROPRIEDADE.setValue(record.data.ID_PROPRIEDADE_MECANICA);
        hCERTIFICADO.setValue(record.data.ID_CERTIFICADO);
        hID_PRODUTO_CERTIFICADO.setValue(record.data.ID_PRODUTO_CERTIFICADO);
        TXT_NUMERO_ITEM_CERTIFICADO.setValue(record.data.NUMERO_ITEM_CERTIFICADO);

        formCERTIFICADO.getForm().loadRecord(record);
        pCERTIFICADO.setTitle('Alterar dados do Certificado');

        Ext.getCmp('BTN_DELETAR_CERTIFICADO').enable();

        TXT_QTDE_PRODUTO.focus();
    }

    var TB_CERTIFICADO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_CERTIFICADO', 'MEDIDA', 'ID_MATERIAL', 'ID_PROPRIEDADE_MECANICA', 'ID_ACABAMENTO_SUPERFICIAL', 'NUMERO_LOTE',
                    'NORMA_APLICAVEL', 'NUMERO_DESENHO', 'QTDE_PRODUTO', 'DESCRICAO_MATERIAL', 'DESCRICAO_ACABAMENTO',
                    'CLASSE_RESISTENCIA_GRAU', 'NUMERO_CERTIFICADO', 'NUMERO_NF', 'ID_PRODUTO_CERTIFICADO', 'CODIGO_PRODUTO', 'NUMERO_ITEM_CERTIFICADO',
                    'DESCRICAO_PRODUTO']
                    )
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

    var gridCERTIFICADO = new Ext.grid.GridPanel({
        id: 'gridCERTIFICADO',
        store: TB_CERTIFICADO_Store,
        columns: [
                            checkBoxSM_,
                    { id: 'NUMERO_CERTIFICADO', header: "Nº Certificado", width: 110, sortable: true, dataIndex: 'NUMERO_CERTIFICADO' },
                    { id: 'CODIGO_PRODUTO', header: "C&oacute;d. Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                    { id: 'DESCRICAO_MATERIAL', header: "Material", width: 220, sortable: true, dataIndex: 'DESCRICAO_MATERIAL' },
                    { id: 'CLASSE_RESISTENCIA_GRAU', header: "Clas. Resist&ecirc;ncia (Grau)", width: 160, sortable: true, dataIndex: 'CLASSE_RESISTENCIA_GRAU', align: 'center' },
                    { id: 'DESCRICAO_ACABAMENTO', header: "Acabamento", width: 150, sortable: true, dataIndex: 'DESCRICAO_ACABAMENTO', align: 'center' },
                    { id: 'NUMERO_LOTE', header: "Nº Lote", width: 110, sortable: true, dataIndex: 'NUMERO_LOTE', align: 'center' },
                    { id: 'NORMA_APLICAVEL', header: "Norma Aplic&aacute;vel", width: 130, sortable: true, dataIndex: 'NORMA_APLICAVEL' },
                    { id: 'NUMERO_DESENHO', header: "Nº Desenho", width: 110, sortable: true, dataIndex: 'NUMERO_DESENHO', align: 'center' },
                    { id: 'QTDE_PRODUTO', header: "Qtde. do Produto", width: 110, sortable: true, dataIndex: 'QTDE_PRODUTO', align: 'center', renderer: FormataQtde },
                    { id: 'NUMERO_NF', header: "N&ordm; NF", width: 100, sortable: true, dataIndex: 'NUMERO_NF', align: 'center' },
                    { id: 'NUMERO_ITEM_CERTIFICADO', header: "N&ordm; Item", width: 100, sortable: true, dataIndex: 'NUMERO_ITEM_CERTIFICADO', align: 'center' },
                    { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }

                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: checkBoxSM_,

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormulario(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridCERTIFICADO.getSelectionModel().getSelections().length > 0) {
                        var record = gridCERTIFICADO.getSelectionModel().getSelected();
                        PopulaFormulario(record);
                    }
                }
            }
        }
    });

    function RetornaCERTIFICADO_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO.getValue(),
            NUMERO_ITEM_VENDA: TXT_ITEM_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var CERTIFICADO_PagingToolbar = new Th2_PagingToolbar();
    CERTIFICADO_PagingToolbar.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/Carrega_CERTIFICADO');
    CERTIFICADO_PagingToolbar.setStore(TB_CERTIFICADO_Store);

    function TB_CERTIFICADO_CARREGA_GRID() {
        CERTIFICADO_PagingToolbar.setParamsJsonData(RetornaCERTIFICADO_JsonData());
        CERTIFICADO_PagingToolbar.doRequest();
    }

    function Deleta_TB_CERTIFICADO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Certificado?', formCERTIFICADO.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/DeletaCertificado');
                _ajax.setJsonData({ ID_CERTIFICADO: hCERTIFICADO.getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    pCERTIFICADO.setTitle("Novo Certificado");
                    TXT_QTDE_PRODUTO.focus();
                    ResetaFormulario();

                    Ext.getCmp('BTN_DELETAR_CERTIFICADO').disable();

                    TB_CERTIFICADO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    /////////////////

    var pCERTIFICADO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Certificado',
        items: [formCERTIFICADO, toolbar_CERTIFICADO, gridCERTIFICADO, CERTIFICADO_PagingToolbar.PagingToolbar()]
    });

    gridCERTIFICADO.setHeight(AlturaDoPainelDeConteudo(formCERTIFICADO.height) - 161);

    this.panel = function () {
        return pCERTIFICADO;
    };

    this.Carrega_NFs = function () {
        Carrega_Notas();
    };

    this.carregaGrid = function () {
        TB_CERTIFICADO_CARREGA_GRID();
    };

    this.Reseta_Certificado = function () {
        ResetaFormulario();
    };
}