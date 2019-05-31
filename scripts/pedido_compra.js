
function MontaCadastroItemCompra() {

    var busca = new Selecionar_CONTATO_FORNECEDOR();

    var janela_pedidos_venda = new JANELA_PEDIDO_VENDA();

    var HDF_NUMERO_PEDIDO_COMPRA = new Ext.form.Hidden({
        name: 'HDF_NUMERO_PEDIDO_COMPRA',
        id: 'HDF_NUMERO_PEDIDO_COMPRA',
        value: 0
    });

    var HDF_NUMERO_ITEM_COMPRA = new Ext.form.Hidden({
        name: 'NUMERO_ITEM_COMPRA',
        id: 'NUMERO_ITEM_COMPRA',
        value: 0
    });

    var ID_PRODUTO_COMPRA = new Ext.form.Hidden({
        name: 'ID_PRODUTO_COMPRA',
        id: 'ID_PRODUTO_COMPRA',
        value: 0
    });

    //*

    var HDF_CODIGO_FORNECEDOR = new Ext.form.Hidden({
        name: 'HDF_CODIGO_FORNECEDOR',
        id: 'HDF_CODIGO_FORNECEDOR',
        value: 0
    });

    var HDF_COTACAO_ORDEM_COMPRA = new Ext.form.Hidden({
        name: 'HDF_COTACAO_ORDEM_COMPRA',
        id: 'HDF_COTACAO_ORDEM_COMPRA',
        value: 0
    });

    var HDF_ORDEM_COMPRA_FORNECEDOR = new Ext.form.Hidden({
        name: 'HDF_ORDEM_COMPRA_FORNECEDOR',
        id: 'HDF_ORDEM_COMPRA_FORNECEDOR',
        value: 0
    });

    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.form.NumberField({
        id: 'NUMERO_PEDIDO_COMPRA_',
        fieldLabel: 'Nr. do Pedido',
        width: 80,
        decimalPrecision: 0,
        readOnly: true
    });

    var TXT_CONTATO_COTACAO_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor / Contato - &lt;F8&gt; Busca',
        width: 300,
        name: 'CONTATO_COTACAO_FORNECEDOR',
        id: 'CONTATO_COTACAO_FORNECEDOR',
        maxLegth: 40,
        allowBlank: false,
        msgTarget: 'side',
        enableKeyEvents: true,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '40' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    if (Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue() == '')
                        Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').setValue(35);
                }
            },
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {
                    if (Ext.getCmp('HDF_ORDEM_COMPRA_FORNECEDOR').getValue() == 1 ||
                        Ext.getCmp('HDF_ORDEM_COMPRA_FORNECEDOR').getValue() == undefined) {
                        Busca_Fornecedor();
                    }
                    else if (Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue() == 0) {
                        Busca_Fornecedor();
                    }
                    else if (Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue() == undefined) {
                        Busca_Fornecedor();
                    }
                    else {
                        dialog.MensagemDeErro('N&atilde;o &eacute; poss&iacute;vel alterar o fornecedor para um pedido existente', this);
                    }

                    function Busca_Fornecedor() {
                        busca.show('CONTATO_COTACAO_FORNECEDOR');
                    }
                }
            }
        }
    });

    //*

    var TXT_TELEFONE_COTACAO_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_COTACAO_FORNECEDOR',
        name: 'TELEFONE_COTACAO_FORNECEDOR',
        allowBlank: true,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    TB_UF_CARREGA_COMBO();

    var CB_ID_UF_COTACAO_FORNECEDOR = new Ext.form.ComboBox({
        store: TB_UF_STORE,
        fieldLabel: 'Unidade Federativa',
        id: 'ID_UF_COTACAO_FORNECEDOR',
        name: 'ID_UF_COTACAO_FORNECEDOR',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 145,
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {

            }
        }
    });

    var IVA_COTACAO_FORNECEDOR = new Ext.form.Checkbox({
        boxLabel: 'Fornecedor fatura com substitui&ccedil;&atilde;o tribut&aacute;ria',
        name: 'IVA_COTACAO_FORNECEDOR',
        id: 'IVA_COTACAO_FORNECEDOR',
        label: 'Opera&ccedil;&atilde;o de IVA',
        checked: true,
        listeners: {
            check: function (field, checked) {
                Recalcula_Totais_do_Pedido(checked);
            }
        }
    });

    //*

    var TXT_EMAIL_COTACAO_FORNECEDOR = new Ext.form.TextField({
        id: 'EMAIL_COTACAO_FORNECEDOR',
        name: 'EMAIL_COTACAO_FORNECEDOR',
        fieldLabel: 'e-mail',
        width: 300,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        vtype: 'email'
    });

    var CB_FRETE_COTACAO_FORNECEDOR = new Ext.form.ComboBox({
        fieldLabel: 'Frete por Conta',
        id: 'FRETE_COTACAO_FORNECEDOR',
        name: 'FRETE_COTACAO_FORNECEDOR',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        msgTarget: 'side',
        value: 1,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['0', '0 - Frete por conta do Emitente'], ['1', '1 - Frete por conta do Destinatário']]
        })
    });

    var TXT_VALOR_FRETE_COTACAO_FORNECEDOR = new Ext.form.NumberField({
        fieldLabel: 'Valor do Frete',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0,
        value: 0.00,
        allowBlank: false,
        name: 'VALOR_FRETE_COTACAO_FORNECEDOR',
        id: 'VALOR_FRETE_COTACAO_FORNECEDOR'
    });

    TB_COND_PAGTO_CARREGA_COMBO();

    var CB_CODIGO_CP_COTACAO_FORNECEDOR = new Ext.form.ComboBox({
        store: combo_TB_COND_PAGTO_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        name: 'CODIGO_CP_COTACAO_FORNECEDOR',
        id: 'CODIGO_CP_COTACAO_FORNECEDOR',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 320,
        allowBlank: false
    });

    var TXT_COD_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 180,
        name: 'CODIGO_PRODUTO_COMPRA',
        id: 'CODIGO_PRODUTO_COMPRA',
        maxLegth: 25,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TXT_PESQUISA_DESCRICAO_PRODUTO1.setValue(f.getValue());
                    // wBUSCA_PRODUTO.show(f.getId());
                    wBUSCA_PRODUTO.show();
                }
            }
        }
    });

    var TXT_DESCRICAO_PRODUTO1 = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do Produto',
        width: 400,
        name: 'DESCRICAO_PRODUTO1',
        id: 'DESCRICAO_PRODUTO1',
        maxLegth: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '50' }
    });

    function CalculaTotalItem() {
        var _qtde = TXT_QTDE_ITEM_COMPRA1.getValue();
        var _preco = TXT_PRECO_ITEM_COMPRA1.getValue();
        var _desconto = TXT_VALOR_DESCONTO_ITEM_COMPRA.getValue();
        var _totalItem = undefined;

        if (_qtde == "" || _qtde == undefined) {
            if (Ext.getCmp('TIPO_DESCONTO_ITEM_COMPRA').getValue() == 1)
                _totalItem = _preco - _desconto;
            else
                _totalItem = _preco * (1 - (_desconto / 100));
        }
        else {
            var _subTotal;

            if (Ext.getCmp('TIPO_DESCONTO_ITEM_COMPRA').getValue() == 1)
                _subTotal = _preco - _desconto;
            else
                _subTotal = _preco * (1 - (_desconto / 100));

            _totalItem = _subTotal * _qtde;
        }

        TXT_VALOR_TOTAL_ITEM_COMPRA.setValue(_totalItem.toFixed(2));
    }

    function CalculaTotalICMS() {
        var _totalItem = parseFloat(TXT_VALOR_TOTAL_ITEM_COMPRA.getValue());
        var _icms = TXT_ALIQ_ICMS_ITEM_COMPRA.getValue();

        var _totalICMS = Math.round((_totalItem * (_icms / 100)) * 100) / 100;

        TXT_VALOR_ICMS_ITEM_COMPRA.setValue(_totalICMS.toFixed(2));
    }

    function CalculaTotalIPI() {
        var _totalItem = parseFloat(TXT_VALOR_TOTAL_ITEM_COMPRA.getValue());
        var _ipi = TXT_ALIQ_IPI_ITEM_COMPRA.getValue();

        var _totalIPI = Math.round((_totalItem * (_ipi / 100)) * 100) / 100;

        TXT_VALOR_IPI_ITEM_COMPRA.setValue(_totalIPI.toFixed(2));
    }

    function CalculaValores() {
        CalculaTotalItem();
        CalculaTotalICMS();
        CalculaTotalIPI();
    }

    function Recalcula_Totais_do_Pedido(ch) {
        if (Ext.getCmp('grid_ITEM_COMPRA').getStore().getCount() > 0
            || Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue() > 0) {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Recalcula_Totais_Pedido');
            _ajax.setJsonData({
                NUMERO_PEDIDO_COMPRA: Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue(),
                CALCULO_IVA: ch,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                TB_ITEM_COMPRA_CARREGA_GRID();
                AtualizaTotaisPedido(response);

                if (panel_PedidoCompra.title == "Nova Compra - Novo Item de Compra"
                    || panel_PedidoCompra.title == "Alterar Pedido de Compra - Novo Item de Compra")
                    ResetaFormulario_Item_Pedido_Compra();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }

    TB_USUARIO_CARREGA_VENDEDORES();

    var TXT_PRECO_ITEM_COMPRA1 = new Ext.form.NumberField({
        fieldLabel: 'Pre&ccedil;o Unit&aacute;rio',
        width: 80,
        name: 'PRECO_ITEM_COMPRA1',
        id: 'PRECO_ITEM_COMPRA1',
        maxLength: 14,
        allowBlank: false,
        decimalPrecision: 4,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '14', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaValores();
                }

                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var CB_CODIGO_CFOP_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'CFOP',
        name: 'CODIGO_CFOP_ITEM_COMPRA',
        id: 'CODIGO_CFOP_ITEM_COMPRA',
        width: 80,
        allowBlank: false,
        width: 70
    });

    var TXT_UNIDADE_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Un.',
        width: 30,
        name: 'UNIDADE_ITEM_COMPRA',
        id: 'UNIDADE_ITEM_COMPRA',
        maxLength: 2,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '2' }
    });

    var TXT_VALOR_DESCONTO_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Desconto',
        width: 70,
        name: 'VALOR_DESCONTO_ITEM_COMPRA',
        id: 'VALOR_DESCONTO_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 4,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaValores();
                }

                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var CB_TIPO_DESCONTO_ITEM_COMPRA = new Ext.form.ComboBox({
        fieldLabel: 'F.Desconto',
        valueField: 'Opc',
        displayField: 'Opcao',
        id: 'TIPO_DESCONTO_ITEM_COMPRA',
        name: 'TIPO_DESCONTO_ITEM_COMPRA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 60,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, '%'], [1, 'Valor']]
        }),
        listeners: {
            select: function (combo, record, index) {
                CalculaTotalItem();
            }
        }
    });

    var TXT_QTDE_ITEM_COMPRA1 = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        width: 70,
        name: 'QTDE_ITEM_COMPRA1',
        id: 'QTDE_ITEM_COMPRA1',
        maxLength: 20,
        allowBlank: false,
        decimalPrecision: 3,
        decimalSeparator: ',',
        minValue: 0.001,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaValores();
                }

                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var TXT_VALOR_TOTAL_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Valor Total',
        width: 100,
        name: 'VALOR_TOTAL_ITEM_COMPRA',
        id: 'VALOR_TOTAL_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', readOnly: true }
    });

    var TXT_ALIQ_ICMS_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Al&iacute;q. ICMS',
        width: 60,
        name: 'ALIQ_ICMS_ITEM_COMPRA',
        id: 'ALIQ_ICMS_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        minValue: 0.00,
        allowBlank: false,
        listeners: {
            keyup: function (f, e) {
                CalculaValores();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaValores();
                }

                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            }
        }
    });

    var TXT_VALOR_ICMS_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Valor ICMS',
        width: 85,
        name: 'VALOR_ICMS_ITEM_COMPRA',
        id: 'VALOR_ICMS_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', readOnly: true }
    });

    var TXT_ALIQ_IPI_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Al&iacute;q. IPI',
        width: 50,
        name: 'ALIQ_IPI_ITEM_COMPRA',
        id: 'ALIQ_IPI_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        minValue: 0.00,
        allowBlank: false,
        listeners: {
            keyup: function (f, e) {
                CalculaValores();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            }
        }
    });

    var TXT_VALOR_IPI_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Valor IPI',
        width: 85,
        name: 'VALOR_IPI_ITEM_COMPRA',
        id: 'VALOR_IPI_ITEM_COMPRA',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', readOnly: true }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, 1);

    var TXT_PREVISAO_ENTREGA_ITEM_COMPRA1 = new Ext.form.DateField({
        id: 'PREVISAO_ENTREGA_ITEM_COMPRA1',
        name: 'PREVISAO_ENTREGA_ITEM_COMPRA1',
        layout: 'form',
        fieldLabel: 'Data de Entrega',
        allowBlank: false,
        value: dt1,
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            }
        }
    });

    var TXT_NUMERO_LOTE_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Nr. do Lote',
        name: 'NUMERO_LOTE_ITEM_COMPRA',
        id: 'NUMERO_LOTE_ITEM_COMPRA',
        width: 184,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            }
        }
    });

    var TXT_CODIGO_FORNECEDOR_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Fornecedor',
        name: 'CODIGO_FORNECEDOR_ITEM_COMPRA',
        id: 'CODIGO_FORNECEDOR_ITEM_COMPRA',
        width: 150,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_COMPRA();
                }
            }
        }
    });

    var TXT_OBS_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&atilde;o do Item',
        anchor: '100%',
        height: 33,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var CB_PRECO_RESERVA = new Ext.form.ComboBox({
        fieldLabel: 'Reserva',
        id: 'PRECO_RESERVA',
        name: 'PRECO_RESERVA',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 70,
        allowBlank: false,
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[1, 'Sim'], [0, 'Não']]
        })
    });

    // -------------- BUSCA DE PRODUTOS ----------------------

    var TXT_PESQUISA_DESCRICAO_PRODUTO1 = new Ext.form.TextField({
        width: 320,
        name: 'TXT_PESQUISA_DESCRICAO_PRODUTO1',
        id: 'TXT_PESQUISA_DESCRICAO_PRODUTO1',
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '50', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialKey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_TB_PRODUTO();
                }
            }
        }
    });

    var BTN_PESQUISA_PRODUTO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () { Carrega_Busca_TB_PRODUTO(); }
    });

    var Store_PESQUISA_PRODUTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'CUSTO_PRODUTO', 'ALIQ_IPI_PRODUTO', 'UNIDADE_MEDIDA_COMPRA',
         'CLAS_FISCAL_PRODUTO', 'SIT_TRIB_PRODUTO', 'ICMS_DIF_PRODUTO', 'SALDO_ESTOQUE'])
    });

    var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
        store: Store_PESQUISA_PRODUTO,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;ão", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'SALDO_ESTOQUE', header: "Estoque", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE', renderer: FormataQtde, align: 'center' },
                { id: 'CUSTO_PRODUTO', header: "Pre&ccedil;o de Custo", width: 100, sortable: true, dataIndex: 'CUSTO_PRODUTO', renderer: FormataValor_4 },
                { id: 'CLAS_FISCAL_PRODUTO', header: "Clas.Fiscal", width: 90, sortable: true, dataIndex: 'CLAS_FISCAL_PRODUTO' },
                { id: 'SIT_TRIB_PRODUTO', header: "Sit.Trib.", width: 70, sortable: true, dataIndex: 'SIT_TRIB_PRODUTO' },
                { id: 'ALIQ_IPI_PRODUTO', header: "Al&iacute;q. IPI", width: 70, sortable: true, dataIndex: 'ALIQ_IPI_PRODUTO', renderer: FormataPercentual },
                { id: 'UNIDADE_MEDIDA_COMPRA', header: "Unidade", width: 60, sortable: true, dataIndex: 'UNIDADE_MEDIDA_COMPRA' }
            ],
        stripeRows: true,
        width: '100%',
        height: 350,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function PopulaCamposProduto(record) {
        var _linha = Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getStore().find('ID_UF', Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue());

        if (_linha == -1) {
            dialog.MensagemDeErro('Selecione um fornecedor antes de inserir o(s) produtos');
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Busca_CFOP_PRODUTO_UF');
        _ajax.setJsonData({
            ID_UF: _ID_UF_EMITENTE,
            ID_PRODUTO: record.data.ID_PRODUTO,
            ID_UF_EMITENTE: _UF_EMITENTE,
            CODIGO_FORNECEDOR: Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var ALIQ_ICMS_PRODUTOS_IMPORTADOS = 0;

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (Ext.getCmp('IVA_COTACAO_FORNECEDOR').checked) {
                if (result[0].length > 0) {
                    Ext.getCmp('CODIGO_CFOP_ITEM_COMPRA').setValue(result[0]);
                }
            }

            if (result.length > 1) {
                ALIQ_ICMS_PRODUTOS_IMPORTADOS = result[1];
                Ext.getCmp("ALIQ_ICMS_ITEM_COMPRA").setValue(ALIQ_ICMS_PRODUTOS_IMPORTADOS);
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();

        Ext.getCmp('ID_PRODUTO_COMPRA').setValue(record.data.ID_PRODUTO);
        Ext.getCmp("CODIGO_PRODUTO_COMPRA").setValue(record.data.CODIGO_PRODUTO);
        Ext.getCmp("DESCRICAO_PRODUTO1").setValue(record.data.DESCRICAO_PRODUTO);
        Ext.getCmp("PRECO_ITEM_COMPRA1").setValue(record.data.CUSTO_PRODUTO);
        Ext.getCmp("ALIQ_IPI_ITEM_COMPRA").setValue(record.data.ALIQ_IPI_PRODUTO);
        Ext.getCmp('VALOR_IPI_ITEM_COMPRA').setValue(record.data.VALOR_IPI_PRODUTO);
        Ext.getCmp("UNIDADE_ITEM_COMPRA").setValue(record.data.UNIDADE_MEDIDA_COMPRA);

        var _store = Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getStore();

        var linha = _store.find('ID_UF', Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue());
        var _record = _store.getAt(linha);

        if (ALIQ_ICMS_PRODUTOS_IMPORTADOS > 0.00) {
            Ext.getCmp("ALIQ_ICMS_ITEM_COMPRA").setValue(ALIQ_ICMS_PRODUTOS_IMPORTADOS);
        }
        else {
            Ext.getCmp("ALIQ_ICMS_ITEM_COMPRA").setValue(_record.data.ALIQ_ICMS_UF);
        }

        wBUSCA_PRODUTO.hide();

        Ext.getCmp("QTDE_ITEM_COMPRA1").focus();
        CalculaValores();
    }

    GRID_PESQUISA_PRODUTO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaCamposProduto(record);
    });

    GRID_PESQUISA_PRODUTO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (GRID_PESQUISA_PRODUTO.getSelectionModel().getSelections().length > 0) {
                var record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();
                PopulaCamposProduto(record);
            }
        }
    });

    function RetornaFiltros_TB_PRODUTO_JsonData() {
        var _pesquisa = Ext.getCmp('TXT_PESQUISA_DESCRICAO_PRODUTO1') ?
                            Ext.getCmp('TXT_PESQUISA_DESCRICAO_PRODUTO1').getValue() : '';

        var TB_PRODUTO_JsonData = {
            Pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_PRODUTO.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO);

    function Carrega_Busca_TB_PRODUTO() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    var wBUSCA_PRODUTO = new Ext.Window({
        layout: 'form',
        title: 'Busca de Produto(s)',
        iconCls: 'icone_TB_PRODUTO',
        width: 1000,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            show: function (w) {
                if (TXT_PESQUISA_DESCRICAO_PRODUTO1.getValue().length > 0) {
                    Carrega_Busca_TB_PRODUTO();
                }
            }
        },
        items: [GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar(),
            {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .20,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Código / Descrição do Produto:'
                }, {
                    columnWidth: .30,
                    items: [TXT_PESQUISA_DESCRICAO_PRODUTO1]
                }, {
                    columnWidth: .12,
                    layout: 'form',
                    items: [BTN_PESQUISA_PRODUTO]
                }]
            }]
    });
    // -------------- FIM BUSCA DE PRODUTOS ----------------------

    var BTN_BUSCA_PRODUTO = new Ext.Button({
        icon: 'imagens/icones/database_search_24.gif',
        tooltip: 'Buscar Produto',
        scale: 'large',
        handler: function () {
            // wBUSCA_PRODUTO.show(TXT_COD_PRODUTO.getId());
            wBUSCA_PRODUTO.show(TXT_COD_PRODUTO.getId());
        }
    });

    //------------ FORM PANEL DADOS -----------------
    var formItemCompra1 = new Ext.form.FormPanel({
        id: 'formItemCompra1',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        height: 265,
        items: [HDF_NUMERO_ITEM_COMPRA, ID_PRODUTO_COMPRA, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.31,
                items: [TXT_CONTATO_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.17,
                items: [CB_ID_UF_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.12,
                items: [TXT_TELEFONE_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.30,
                items: [TXT_EMAIL_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.10,
                items: [TXT_NUMERO_PEDIDO_COMPRA]

            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.32,
                items: [CB_CODIGO_CP_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.25,
                items: [CB_FRETE_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.12,
                items: [TXT_VALOR_FRETE_COTACAO_FORNECEDOR]
            }, {
                layout: 'form',
                columnWidth: 0.25,
                items: [IVA_COTACAO_FORNECEDOR]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.18,
                items: [TXT_COD_PRODUTO]
            }, {
                columnWidth: 0.08,
                items: [BTN_BUSCA_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.37,
                items: [TXT_DESCRICAO_PRODUTO1]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.06,
                items: [TXT_UNIDADE_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.09,
                items: [CB_CODIGO_CFOP_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.08,
                items: [TXT_QTDE_ITEM_COMPRA1]
            }, {
                layout: 'form',
                columnWidth: 0.10,
                items: [TXT_PRECO_ITEM_COMPRA1]
            }, {
                layout: 'form',
                columnWidth: 0.08,
                items: [CB_TIPO_DESCONTO_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.09,
                items: [TXT_VALOR_DESCONTO_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.10,
                items: [TXT_VALOR_TOTAL_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.07,
                items: [TXT_ALIQ_ICMS_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.09,
                items: [TXT_VALOR_ICMS_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.06,
                items: [TXT_ALIQ_IPI_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: 0.08,
                items: [TXT_VALOR_IPI_ITEM_COMPRA]

            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .12,
                items: [TXT_PREVISAO_ENTREGA_ITEM_COMPRA1]
            }, {
                layout: 'form',
                columnWidth: .15,
                items: [TXT_CODIGO_FORNECEDOR_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: .17,
                items: [TXT_NUMERO_LOTE_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: .10,
                items: [CB_PRECO_RESERVA]
            }, {
                layout: 'form',
                columnWidth: .34,
                items: [TXT_OBS_ITEM_COMPRA]
            }]
        }]
    });

    function ResetaFormulario_Item_Pedido_Compra() {
        var dt1 = new Date();
        dt1 = dt1.add(Date.DAY, 1);

        Ext.getCmp('NUMERO_ITEM_COMPRA').reset();
        Ext.getCmp('CODIGO_PRODUTO_COMPRA').reset();
        Ext.getCmp('DESCRICAO_PRODUTO1').reset();
        Ext.getCmp('QTDE_ITEM_COMPRA1').reset();
        Ext.getCmp('PRECO_ITEM_COMPRA1').reset();
        Ext.getCmp('UNIDADE_ITEM_COMPRA').reset();
        Ext.getCmp('VALOR_TOTAL_ITEM_COMPRA').reset();
        Ext.getCmp('VALOR_DESCONTO_ITEM_COMPRA').getValue() == "" ? 0 : Ext.getCmp('VALOR_DESCONTO_ITEM_COMPRA').reset();
        Ext.getCmp('TIPO_DESCONTO_ITEM_COMPRA').reset();
        Ext.getCmp('ALIQ_ICMS_ITEM_COMPRA').reset();
        Ext.getCmp('VALOR_TOTAL_ITEM_COMPRA').reset();
        Ext.getCmp('VALOR_ICMS_ITEM_COMPRA').reset();
        Ext.getCmp('ALIQ_IPI_ITEM_COMPRA').reset();
        Ext.getCmp('VALOR_IPI_ITEM_COMPRA').reset();
        Ext.getCmp('CODIGO_FORNECEDOR_ITEM_COMPRA').reset();
        Ext.getCmp('NUMERO_LOTE_ITEM_COMPRA').reset();
        TXT_OBS_ITEM_COMPRA.reset();
        Ext.getCmp('PREVISAO_ENTREGA_ITEM_COMPRA1').setValue(dt1);
    }

    function PopulaFormulario_TB_ITEM_COMPRA(record) {
        Ext.getCmp('ID_PRODUTO_COMPRA').setValue(record.data.ID_PRODUTO_COMPRA);

        formItemCompra1.getForm().loadRecord(record);
        Ext.getCmp('PREVISAO_ENTREGA_ITEM_COMPRA1').setValue(XMLParseDate(record.data.PREVISAO_ENTREGA_ITEM_COMPRA));
        Ext.getCmp('QTDE_ITEM_COMPRA1').setValue(record.data.QTDE_ITEM_COMPRA);
        Ext.getCmp('PRECO_ITEM_COMPRA1').setValue(record.data.PRECO_ITEM_COMPRA);
        TXT_DESCRICAO_PRODUTO1.setValue(record.data.DESCRICAO_PRODUTO);
        TXT_OBS_ITEM_COMPRA.setValue(record.data.OBS_ITEM_COMPRA);

        panel_PedidoCompra.setTitle('Alterar Pedido de Compra - Alterar Item de Compra');
        buttonGroup_PEDIDO_COMPRA2.items.items[32].enable();

        formItemCompra1.getForm().findField('QTDE_ITEM_COMPRA1').focus();
    }

    //------------FIM FORM PANEL DADOS -----------------
    // -------------- BOTOES -------------------------
    var buttonGroup_PEDIDO_COMPRA2 = new Ext.ButtonGroup({
        id: 'buttonGroup_PEDIDO_COMPRA2',
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue() == 0) {
                    GravaDados_TB_ITEM_COMPRA();
                }
                else {
                    if (formItemCompra1.getForm().isValid()) {
                        GravaDados_TB_ITEM_COMPRA();
                    }
                    else {
                        Grava_Dados_Compra();
                    }
                }
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Novo Item de Compra',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                ResetaFormulario_Item_Pedido_Compra();
                buttonGroup_PEDIDO_COMPRA2.items.items[32].disable();
                panel_PedidoCompra.setTitle('Nova Compra - Novo Item de Compra');
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_DELETAR_TB_ITEM_COMPRA',
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'medium',
            disabled: true,
            handler: function () { Deleta_ITEM_COMPRA(); }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_PEDIDOS_VENDA',
            text: 'Associar / Consultar Itens de Venda',
            icon: 'imagens/icones/copy_level_24.gif',
            scale: 'medium',
            handler: function () {
                var record;

                if (grid_ITEM_COMPRA.getSelectionModel().getSelections().length > 0) {
                    record = grid_ITEM_COMPRA.getSelectionModel().getSelected();
                }

                janela_pedidos_venda.NUMERO_PEDIDO_COMPRA(record ? record.data.NUMERO_PEDIDO_COMPRA : 0);
                janela_pedidos_venda.NUMERO_ITEM_COMPRA(record ? record.data.NUMERO_ITEM_COMPRA : 0);

                if (record)
                    janela_pedidos_venda.record_ITEM_COMPRA(record);

                janela_pedidos_venda.show('BTN_PEDIDOS_VENDA');
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_RELOAD_GRID',
                text: 'Recarregar Itens',
                icon: 'imagens/icones/database_reload_24.gif',
                scale: 'medium',
                handler: function () { TB_ITEM_COMPRA_CARREGA_GRID(); }
            }]
    });

    var toolbar_TB_ITEM_ORCAMENTO = new Ext.Toolbar({
        style: 'text-align: right; width: 100%;',
        items: [buttonGroup_PEDIDO_COMPRA2]
    });
    // --------------FIM BOTOES -------------------------

    // -------------- EVENTOS BOTOES ----------------------

    function Grava_Dados_Compra() {
        if (!Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').isValid() ||
                                        !Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').isValid() ||
                                        !Ext.getCmp('FRETE_COTACAO_FORNECEDOR').isValid() ||
                                        !Ext.getCmp('VALOR_FRETE_COTACAO_FORNECEDOR').isValid() ||
                                        !Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').isValid()) {
            return;
        }

        var dados = {
            NUMERO_PEDIDO_COMPRA: Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue(),
            CODIGO_FORNECEDOR: Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue(),
            CODIGO_CP_COTACAO_FORNECEDOR: Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').getValue(),
            CONTATO_COTACAO_FORNECEDOR: Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').getValue(),
            EMAIL_COTACAO_FORNECEDOR: Ext.getCmp('EMAIL_COTACAO_FORNECEDOR').getValue(),
            TELEFONE_COTACAO_FORNECEDOR: Ext.getCmp('TELEFONE_COTACAO_FORNECEDOR').getValue(),
            ID_UF_COTACAO_FORNECEDOR: Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue(),
            FRETE_COTACAO_FORNECEDOR: Ext.getCmp('FRETE_COTACAO_FORNECEDOR').getValue(),
            VALOR_FRETE_COTACAO_FORNECEDOR: Ext.getCmp('VALOR_FRETE_COTACAO_FORNECEDOR').getValue(),
            IVA_COTACAO_FORNECEDOR: Ext.getCmp('IVA_COTACAO_FORNECEDOR').checked ? true : false,
            ID_USUARIO: _ID_USUARIO
        };

        var url = 'servicos/TB_PEDIDO_COMPRA.asmx/Grava_Dados_Compra';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(url);
        _ajax.setJsonData({ dados: dados });

        var _sucesso = function (response, options) {

            if (Ext.getCmp('formItemCompra1').getForm().isValid()) {
                Ext.getCmp('CODIGO_PRODUTO_COMPRA').reset();
                Ext.getCmp('UNIDADE_ITEM_COMPRA').reset();
                Ext.getCmp('QTDE_ITEM_COMPRA1').reset();
                Ext.getCmp('PRECO_ITEM_COMPRA1').reset();
                Ext.getCmp('VALOR_IPI_ITEM_COMPRA').reset();

                AtualizaTotaisPedido(response);
            }
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    function GravaDados_TB_ITEM_COMPRA() {
        if (!Ext.getCmp('formItemCompra1').getForm().isValid()) {
            return;
        }

        var _store = Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getStore();
        var linha = _store.find('ID_UF', Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue());
        var record = _store.getAt(linha);

        var _ALIQ_INTERNA_ICMS = record.data.ALIQ_INTERNA_ICMS;
        _ALIQ_INTERNA_ICMS = _ALIQ_INTERNA_ICMS.replace('.00', '');

        var dados = {
            NUMERO_PEDIDO_COMPRA: Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue() == "" ? 0 : Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue(),
            NUMERO_ITEM_COMPRA: Ext.getCmp('NUMERO_ITEM_COMPRA').getValue() == "" ? 0 : Ext.getCmp('NUMERO_ITEM_COMPRA').getValue(),
            ID_PRODUTO: Ext.getCmp('ID_PRODUTO_COMPRA').getValue(),
            CODIGO_PRODUTO_COMPRA: Ext.getCmp('CODIGO_PRODUTO_COMPRA').getValue(),
            QTDE_ITEM_COMPRA: Ext.getCmp('QTDE_ITEM_COMPRA1').getValue(),
            QTDE_FORNECEDOR: Ext.getCmp('QTDE_ITEM_COMPRA1').getValue(),
            PRECO_ITEM_COMPRA: Ext.getCmp('PRECO_ITEM_COMPRA1').getValue(),
            UNIDADE_ITEM_COMPRA: Ext.getCmp('UNIDADE_ITEM_COMPRA').getValue(),
            VALOR_TOTAL_ITEM_COMPRA: Ext.getCmp('VALOR_TOTAL_ITEM_COMPRA').getValue(),
            VALOR_DESCONTO_ITEM_COMPRA: Ext.getCmp('VALOR_DESCONTO_ITEM_COMPRA').getValue() == "" ? 0 : Ext.getCmp('VALOR_DESCONTO_ITEM_COMPRA').getValue(),
            TIPO_DESCONTO_ITEM_COMPRA: Ext.getCmp('TIPO_DESCONTO_ITEM_COMPRA').getValue(),
            ALIQ_ICMS_ITEM_COMPRA: Ext.getCmp('ALIQ_ICMS_ITEM_COMPRA').getValue() == "" ? 0 : Ext.getCmp('ALIQ_ICMS_ITEM_COMPRA').getValue(),
            BASE_ICMS_ITEM_COMPRA: Ext.getCmp('VALOR_TOTAL_ITEM_COMPRA').getValue(),
            VALOR_ICMS_ITEM_COMPRA: Ext.getCmp('VALOR_ICMS_ITEM_COMPRA').getValue(),
            BASE_ICMS_ST_ITEM_COMPRA: 0,
            VALOR_ICMS_ST_ITEM_COMPRA: 0,
            ALIQ_IPI_ITEM_COMPRA: Ext.getCmp('ALIQ_IPI_ITEM_COMPRA').getValue() == "" ? 0 : Ext.getCmp('ALIQ_IPI_ITEM_COMPRA').getValue(),
            VALOR_IPI_ITEM_COMPRA: Ext.getCmp('VALOR_IPI_ITEM_COMPRA').getValue(),

            CODIGO_FORNECEDOR: Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue(),
            CONTATO_COTACAO_FORNECEDOR: Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').getValue(),
            TELEFONE_COTACAO_FORNECEDOR: Ext.getCmp('TELEFONE_COTACAO_FORNECEDOR').getValue(),
            EMAIL_COTACAO_FORNECEDOR: Ext.getCmp('EMAIL_COTACAO_FORNECEDOR').getValue(),
            ID_UF_COTACAO_FORNECEDOR: Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').getValue(),
            FRETE_COTACAO_FORNECEDOR: Ext.getCmp('FRETE_COTACAO_FORNECEDOR').getValue(),
            VALOR_FRETE_COTACAO_FORNECEDOR: Ext.getCmp('VALOR_FRETE_COTACAO_FORNECEDOR').getValue(),

            CODIGO_CFOP_ITEM_COMPRA: Ext.getCmp('CODIGO_CFOP_ITEM_COMPRA').getValue(),
            ALIQ_INTERNA_ICMS: _ALIQ_INTERNA_ICMS,
            ALIQ_ICMS: record.data.ALIQ_ICMS,
            IVA_COTACAO_FORNECEDOR: Ext.getCmp('IVA_COTACAO_FORNECEDOR').checked ? 1 : 0,
            CODIGO_COND_PAGTO: Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').getValue(),
            CODIGO_CP_COTACAO_FORNECEDOR: Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').getValue(),
            PREVISAO_ENTREGA_ITEM_COMPRA: Ext.getCmp('PREVISAO_ENTREGA_ITEM_COMPRA1').getRawValue(),
            ENTREGA_EFETIVA_ITEM_COMPRA: Ext.getCmp('PREVISAO_ENTREGA_ITEM_COMPRA1').getRawValue(),
            PREVISAO_ENTREGA: Ext.getCmp('PREVISAO_ENTREGA_ITEM_COMPRA1').getRawValue(),
            CODIGO_FORNECEDOR_ITEM_COMPRA: Ext.getCmp('CODIGO_FORNECEDOR_ITEM_COMPRA').getValue(),
            NUMERO_LOTE_ITEM_COMPRA: Ext.getCmp('NUMERO_LOTE_ITEM_COMPRA').getValue(),
            OBS_ITEM_COMPRA: TXT_OBS_ITEM_COMPRA.getValue(),
            CODIGO_COMPLEMENTO_PRODUTO_COMPRA: 0,
            CHAVE_COTACAO: 0,
            COTACAO_RESPONDIDA: 2,
            COTACAO_VENCEDORA: 1,
            PRECO_RESERVA: Ext.getCmp('PRECO_RESERVA').getValue() == '' ? 0 : Ext.getCmp('PRECO_RESERVA').getValue(),
            ID_USUARIO: _ID_USUARIO,
            ID_UF_EMITENTE: _UF_EMITENTE
        };

        var url = panel_PedidoCompra.title == "Nova Compra - Novo Item de Compra"
                                    || panel_PedidoCompra.title == "Alterar Pedido de Compra - Novo Item de Compra" ?
                                        'servicos/TB_PEDIDO_COMPRA.asmx/Grava_Pedido_Compra' :
                                        'servicos/TB_PEDIDO_COMPRA.asmx/Atualiza_Pedido_Compra';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(url);
        _ajax.setJsonData({ dados: dados });

        var _sucesso = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('CODIGO_PRODUTO_COMPRA').focus();

            HDF_NUMERO_PEDIDO_COMPRA.setValue(result.NUMERO_PEDIDO);
            TXT_NUMERO_PEDIDO_COMPRA.setValue(result.NUMERO_PEDIDO);

            AtualizaTotaisPedido(response);

            if (panel_PedidoCompra.title == "Nova Compra - Novo Item de Compra"
                                            || panel_PedidoCompra.title == "Alterar Pedido de Compra - Novo Item de Compra") {
                ResetaFormulario_Item_Pedido_Compra();
                TB_ITEM_COMPRA_CARREGA_GRID(true);
            }
            else {
                TB_ITEM_COMPRA_CARREGA_GRID();
            }
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    function Deleta_ITEM_COMPRA() {
        dialog.MensagemDeConfirmacao('Deseja deletar este item do Pedido [' +
                        formItemCompra1.getForm().findField('CODIGO_PRODUTO_COMPRA').getValue() + ']?', 'formItemCompra1', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Deleta_Item_Pedido_Compra');

                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue(),
                    NUMERO_ITEM_COMPRA: Ext.getCmp('NUMERO_ITEM_COMPRA').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    HDF_NUMERO_PEDIDO_COMPRA.setValue(result.NUMERO_PEDIDO_COMPRA);
                    Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').setValue(result.NUMERO_PEDIDO);
                    TB_ITEM_COMPRA_CARREGA_GRID();
                    AtualizaTotaisPedido(response);
                    Ext.getCmp('CODIGO_PRODUTO_COMPRA').focus();
                    buttonGroup_PEDIDO_COMPRA2.items.items[32].disable();
                    panel_PedidoCompra.setTitle('Nova Compra - Novo Item de Compra');
                    ResetaFormulario_Item_Pedido_Compra();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }
    // --------------FIM EVENTOS BOTOES ----------------------

    // -------------- GRID ORCAMENTO----------------------

    function TrataTipoDesconto(val) {
        if (val == 0)
            return "%";
        else
            return "Valor";
    }

    var grid_ITEM_COMPRA = new Ext.grid.GridPanel({
        id: 'grid_ITEM_COMPRA',
        store: TB_ITEM_COMPRA_Store,
        columns: [
                { id: 'NUMERO_ITEM_COMPRA', header: "Item", width: 70, sortable: true, dataIndex: 'NUMERO_ITEM_COMPRA', hidden: true },
                { id: 'CODIGO_CFOP_ITEM_COMPRA', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_COMPRA' },
                { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },
                { id: 'UNIDADE_ITEM_COMPRA', header: "Un", width: 30, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA' },
                { id: 'QTDE_ITEM_COMPRA', header: "Qtde", width: 75, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde, align: 'center' },
                { id: 'PRECO_ITEM_COMPRA', header: "Pre&ccedil;o", width: 100, sortable: true, dataIndex: 'PRECO_ITEM_COMPRA', renderer: Ajusta_Preco_Cheio, align: 'center' },
                { id: 'TIPO_DESCONTO_ITEM_COMPRA', header: "Tipo Desconto", width: 50, sortable: true, dataIndex: 'TIPO_DESCONTO_ITEM_COMPRA', renderer: TrataTipoDesconto, hidden: true },
                { id: 'VALOR_DESCONTO_ITEM_COMPRA', header: "Desconto", width: 90, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_COMPRA', renderer: FormataDescontoCompras, align: 'center' },
                { id: 'VALOR_TOTAL_ITEM_COMPRA', header: "Valor Total", width: 100, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 80, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
                { id: 'NUMERO_LOTE_ITEM_COMPRA', header: "Nr. Lote", width: 160, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_COMPRA', hidden: true },
                { id: 'ALIQ_ICMS_ITEM_COMPRA', header: "Al&iacute;q ICMS", width: 80, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
                { id: 'VALOR_ICMS_ITEM_COMPRA', header: "Valor ICMS", width: 80, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
                { id: 'ALIQ_IPI_ITEM_COMPRA', header: "Al&iacute;q IPI", width: 80, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
                { id: 'VALOR_IPI_ITEM_COMPRA', header: "Valor IPI", width: 100, sortable: true, dataIndex: 'VALOR_IPI_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
                { id: 'BASE_ICMS_ST_ITEM_COMPRA', header: "Base ICMS ST", width: 100, sortable: true, dataIndex: 'BASE_ICMS_ST_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
                { id: 'VALOR_ICMS_ST_ITEM_COMPRA', header: "Valor ICMS ST", width: 100, sortable: true, dataIndex: 'VALOR_ICMS_ST_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
                { id: 'PRECO_RESERVA', header: "Reserva", width: 90, sortable: true, dataIndex: 'PRECO_RESERVA', renderer: TrataCombo01, align: 'center' },
                { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                { id: 'NUMERO_ITEM_VENDA', header: "Item de Venda", width: 100, sortable: true, dataIndex: 'NUMERO_ITEM_VENDA', align: 'center' }
                ],
        stripeRows: true,
        height: 80,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            rowselect: function (s, Index, record) {
            }
        })
        ,
        listeners: {
            rowclick: function (grid, rowIndex, e) {

            }
        }
    });

    grid_ITEM_COMPRA.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_ITEM_COMPRA(record);
    });

    grid_ITEM_COMPRA.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (grid_ITEM_COMPRA.getSelectionModel().getSelections().length > 0) {
                var record = grid_ITEM_COMPRA.getSelectionModel().getSelected();
                PopulaFormulario_TB_ITEM_COMPRA(record);
            }
        }
    });

    grid_ITEM_COMPRA.setHeight(AlturaDoPainelDeConteudo(429));

    // --------------FIM GRID ITEM COMPRA ----------

    // --------------PANELS ----------------------
    var panel_PedidoCompra = new Ext.Panel({
        id: 'panel_PedidoCompra',
        width: '100%',
        border: true,
        title: 'Nova Compra - Novo Item de Compra'
    });

    // TABS PANEL
    var TB_ITEM_COMPRA_TABPANEL = new Ext.TabPanel({
        id: 'TB_ITEM_COMPRA_TABPANEL',
        deferredRender: false,
        activeTab: 1,

        items: [{
            title: 'Itens do Pedido de Compra',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_ITEM_ORCAMENTO'
        }, {
            title: 'Administra&ccedil;&atilde;o de Pedidos',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_ORCAMENTO1'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (panel.title == 'Itens do Pedido de Compra') {
                    if (panel.items.length == 0) {
                        panel.add(formItemCompra1);
                        panel.add(toolbar_TB_ITEM_ORCAMENTO);
                        panel.add(grid_ITEM_COMPRA);
                        panel.add(TOTAIS);

                        panel.doLayout();
                    }
                }
            }
        }
    });

    var TOTAIS = new Ext.form.Label({ id: 'totaisCompra', height: 36, html: AtualizaTotaisPedido() });

    TB_ITEM_COMPRA_TABPANEL.items.items[1].add(Adm_Pedido_Compra());

    panel_PedidoCompra.add(TB_ITEM_COMPRA_TABPANEL);

    return panel_PedidoCompra;
}

function AtualizaTotaisPedido(response) {
    var HTMLTotais = "";
    var _totais = "";

    if (response) {
        var result = response.responseText ?
                                            Ext.decode(response.responseText).d :
                                            response;

        HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
                                            "<tr style='height: 15px;'>" +
                                                "<td align='right' style='color: #333333;'>Total dos Produtos</td>" +
                                                "<td align='right' style='color: #333333;'>Valor de Frete</td>" +
                                                "<td align='right' style='color: #333333;'>Total de ICMS</td>" +
                                                "<td align='right' style='color: #333333;'>Total de ICMS ST</td>" +
                                                "<td align='right' style='color: #333333;'>Total de IPI</td>" +
                                                "<td align='right' style='color: #333333;'>Total do Pedido&nbsp;&nbsp;</td>" +
                                            "</tr>" +
                                            "<tr style='border:1px solid; height: 15px;'>" +
                                                "<td align='right'>" + result.VALOR_TOTAL + "</td>" +
                                                "<td align='right'>" + result.VALOR_FRETE + "</td>" +
                                                "<td align='right'>" + result.VALOR_ICMS + "</td>" +
                                                "<td align='right'>" + result.VALOR_ICMS_SUBS + "</td>" +
                                                "<td align='right'>" + result.VALOR_IPI + "</td>" +
                                                "<td align='right'>" + result.TOTAL_PEDIDO + "&nbsp;&nbsp;</td>" +
                                            "</table>";
    }
    else {
        HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
                                            "<tr style='height: 15px;'>" +
                                                "<td align='right' style='color: #333333;'>Total dos Produtos</td>" +
                                                "<td align='right' style='color: #333333;'>Valor de Frete</td>" +
                                                "<td align='right' style='color: #333333;'>Total de ICMS</td>" +
                                                "<td align='right' style='color: #333333;'>Total de ICMS ST</td>" +
                                                "<td align='right' style='color: #333333;'>Total de IPI</td>" +
                                                "<td align='right' style='color: #333333;'>Total do Pedido&nbsp;&nbsp;</td>" +
                                            "</tr>" +
                                            "<tr style='border:1px solid; height: 15px;'>" +
                                                "<td align='right'>" + "R$ 0,00" + "</td>" +
                                                "<td align='right'>" + "R$ 0,00" + "</td>" +
                                                "<td align='right'>" + "R$ 0,00" + "</td>" +
                                                "<td align='right'>" + "R$ 0,00" + "</td>" +
                                                "<td align='right'>" + "R$ 0,00" + "</td>" +
                                                "<td align='right'>" + "R$ 0,00" + "&nbsp;&nbsp;</td>" +
                                            "</table>";
    }

    if (!Ext.getCmp("totaisCompra")) {
        return HTMLTotais;
    }
    else {
        Ext.getCmp('totaisCompra').setText(HTMLTotais, false);
    }
}

// ---------FIM LABELS DE TOTAIS ----------

function Novo_Pedido_Compras() {
    Ext.getCmp('buttonGroup_PEDIDO_COMPRA2').items.items[32].disable();
    Ext.getCmp('panel_PedidoCompra').setTitle('Nova Compra - Novo Item de Compra');
    Ext.getCmp('TB_ITEM_COMPRA_TABPANEL').setActiveTab(0);
    Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').enable();
    Ext.getCmp('grid_ITEM_COMPRA').getStore().removeAll();
    Ext.getCmp('HDF_CODIGO_FORNECEDOR').setValue(0);
    Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').setValue(0);
    Ext.getCmp('NUMERO_ITEM_COMPRA').setValue(0);
    Ext.getCmp('ID_PRODUTO_COMPRA').setValue(0);
    Ext.getCmp('HDF_ORDEM_COMPRA_FORNECEDOR').setValue(0);

    Ext.getCmp('formItemCompra1').getForm().reset();

    Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').focus();

    AtualizaTotaisPedido();
}

function Selecionar_CONTATO_FORNECEDOR() {

    /////////////////////// Grid
    var TB_FORNECEDOR_CONTATO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_FORNECEDOR', 'CONTATO_FORNECEDOR', 'TELEFONE1_FORNECEDOR', 'TELEFONE2_FORNECEDOR',
            'EMAIL_FORNECEDOR', 'ID_UF_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR',
            'CODIGO_CP_FORNECEDOR', 'CODIGO_CFOP_FORNECEDOR', 'CALCULO_IVA_FORNECEDOR',
            'CONTATO_COTACAO_FORNECEDOR'])
    });

    function Popula_Contato(record) {
        Ext.getCmp('HDF_CODIGO_FORNECEDOR').setValue(record.data.CODIGO_FORNECEDOR);

        Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').setValue(record.data.CONTATO_FORNECEDOR.trim() + ' - ' +
                                            record.data.NOME_FANTASIA_FORNECEDOR.trim());

        Ext.getCmp('TELEFONE_COTACAO_FORNECEDOR').setValue(record.data.TELEFONE1_FORNECEDOR.trim());
        Ext.getCmp('EMAIL_COTACAO_FORNECEDOR').setValue(record.data.EMAIL_FORNECEDOR.trim());
        Ext.getCmp('FRETE_COTACAO_FORNECEDOR').setValue(0);
        Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').setValue(_ID_UF_EMITENTE);

        Ext.getCmp('IVA_COTACAO_FORNECEDOR').setValue(0);

        Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').setValue(record.data.CODIGO_CP_FORNECEDOR);
        Ext.getCmp('CODIGO_CFOP_ITEM_COMPRA').setValue(record.data.CODIGO_CFOP_FORNECEDOR);
        Ext.getCmp('IVA_COTACAO_FORNECEDOR').setValue(record.data.CALCULO_IVA_FORNECEDOR);
        Ext.getCmp('HDF_ORDEM_COMPRA_FORNECEDOR').setValue(record.data.ORDEM_COMPRA_FORNECEDOR);

        wBUSCA_TB_FORNECEDOR.hide();
        Ext.getCmp('CODIGO_PRODUTO_COMPRA').focus();
    }

    var gridTB_FORNECEDOR = new Ext.grid.GridPanel({
        store: TB_FORNECEDOR_CONTATO_Store,
        title: 'Fornecedores',
        columns: [
            { id: 'CODIGO_FORNECEDOR', header: 'ID Fornecedor', width: 80, sortable: true, dataIndex: 'CODIGO_FORNECEDOR', hidden: true },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: 'Fornecedor', width: 200, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'CONTATO_FORNECEDOR', header: "Contato", width: 200, sortable: true, dataIndex: 'CONTATO_FORNECEDOR' },
            { id: 'TELEFONE1_FORNECEDOR', header: "Telefone 1", width: 140, sortable: true, dataIndex: 'TELEFONE1_FORNECEDOR' },
            { id: 'TELEFONE2_FORNECEDOR', header: "Telefone 2", width: 140, sortable: true, dataIndex: 'TELEFONE2_FORNECEDOR' },
            { id: 'EMAIL_FORNECEDOR', header: "e-mail", width: 250, sortable: true, dataIndex: 'EMAIL_FORNECEDOR' }
        ],
        stripeRows: true,
        height: 230,
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
                        Popula_Contato(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                if (this.getSelectionModel().getSelections().length > 0) {
                    var record = this.getSelectionModel().getSelected();
                    Popula_Contato(record);
                }
            }
        }
    });

    var TB_FORNECEDOR_TXT_NOMEFANTASIA = new Ext.form.TextField({
        fieldLabel: 'Nome do Contato / Fornecedor',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FORNECEDOR_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            FORNECEDOR_CARREGA_GRID();
        }
    });

    var TB_FORNECEDOR_PagingToolbar = new Th2_PagingToolbar();

    TB_FORNECEDOR_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Busca_Fornecedor');
    TB_FORNECEDOR_PagingToolbar.setLinhasPorPagina(12);
    TB_FORNECEDOR_PagingToolbar.setStore(TB_FORNECEDOR_CONTATO_Store);

    function RetornaFiltros_TB_CLIENTE_JsonData() {
        var TB_CLIENTE_JsonData = {
            pesquisa: TB_FORNECEDOR_TXT_NOMEFANTASIA.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_FORNECEDOR_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    function FORNECEDOR_CARREGA_GRID() {
        TB_FORNECEDOR_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_JsonData());
        TB_FORNECEDOR_PagingToolbar.doRequest();
    }

    var wBUSCA_TB_FORNECEDOR = new Ext.Window({
        layout: 'form',
        title: 'Busca',
        iconCls: 'icone_TB_FORNECEDOR',
        width: 900,
        height: 'auto',
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [gridTB_FORNECEDOR, TB_FORNECEDOR_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .55,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 180,
                items: [TB_FORNECEDOR_TXT_NOMEFANTASIA]
            }, {
                columnWidth: .20,
                items: [TB_CLIENTE_BTN_PESQUISA]
            }]
        }]
    });

    this.show = function (elm) {
        wBUSCA_TB_FORNECEDOR.show(elm);
    };

    Ext.onReady(function () {
        TB_FORNECEDOR_TXT_NOMEFANTASIA.focus();
    });
}

function Altera_Pedido_Compra(NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR) {
    Ext.getCmp('formItemCompra1').getForm().reset();

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Busca_Dados_Pedido');
    _ajax.setJsonData({
        NUMERO_PEDIDO_COMPRA: NUMERO_PEDIDO_COMPRA,
        CODIGO_FORNECEDOR: CODIGO_FORNECEDOR,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        Ext.getCmp('TB_ITEM_COMPRA_TABPANEL').setActiveTab(0);

        Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').setValue(NUMERO_PEDIDO_COMPRA);
        Ext.getCmp('NUMERO_PEDIDO_COMPRA_').setValue(NUMERO_PEDIDO_COMPRA);
        Ext.getCmp('buttonGroup_PEDIDO_COMPRA2').items.items[32].disable();

        var result = Ext.decode(response.responseText).d;

        Ext.getCmp('HDF_CODIGO_FORNECEDOR').setValue(result.CODIGO_FORNECEDOR);
        Ext.getCmp('CONTATO_COTACAO_FORNECEDOR').setValue(result.CONTATO_COTACAO_FORNECEDOR);
        Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').setValue(result.ID_UF_COTACAO_FORNECEDOR);
        Ext.getCmp('TELEFONE_COTACAO_FORNECEDOR').setValue(result.TELEFONE_COTACAO_FORNECEDOR);
        Ext.getCmp('EMAIL_COTACAO_FORNECEDOR').setValue(result.EMAIL_COTACAO_FORNECEDOR);

        Ext.getCmp('IVA_COTACAO_FORNECEDOR').suspendEvents(false);
        Ext.getCmp('IVA_COTACAO_FORNECEDOR').checked = result.IVA_COTACAO_FORNECEDOR == 1 ?
                                                    true : false;
        Ext.getCmp('IVA_COTACAO_FORNECEDOR').resumeEvents();

        Ext.getCmp('FRETE_COTACAO_FORNECEDOR').setValue(result.FRETE_COTACAO_FORNECEDOR);
        Ext.getCmp('VALOR_FRETE_COTACAO_FORNECEDOR').setValue(result.VALOR_FRETE_COTACAO_FORNECEDOR);
        Ext.getCmp('CODIGO_CP_COTACAO_FORNECEDOR').setValue(result.CODIGO_CP_COTACAO_FORNECEDOR);
        Ext.getCmp('HDF_ORDEM_COMPRA_FORNECEDOR').setValue(result.ORDEM_COMPRA_FORNECEDOR);
        Ext.getCmp('CODIGO_CFOP_ITEM_COMPRA').setValue(result.CODIGO_CFOP_FORNECEDOR);

        TB_ITEM_COMPRA_CARREGA_GRID();

        AtualizaTotaisPedido(response);

        panel_PedidoCompra.setTitle = "Alterar Pedido de Compra - Novo Item de Compra";

        Ext.getCmp('CODIGO_PRODUTO_COMPRA').focus();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Habilita_UF_Pedido(h) {
    if (Ext.getCmp('ID_UF_COTACAO_FORNECEDOR')) {
        if (h)
            Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').enable();
        else
            Ext.getCmp('ID_UF_COTACAO_FORNECEDOR').disable();
    }
}

var TB_ITEM_COMPRA_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({ record: 'Tabela' },
        ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'ID_PRODUTO_COMPRA', 'CODIGO_PRODUTO_COMPRA', 'PRECO_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA',
        'QTDE_ITEM_COMPRA', 'VALOR_DESCONTO_ITEM_COMPRA', 'VALOR_TOTAL_ITEM_COMPRA', 'ALIQ_ICMS_ITEM_COMPRA', 'BASE_ICMS_ITEM_COMPRA', 'BASE_ICMS_ST_ITEM_COMPRA',
        'VALOR_ICMS_ITEM_COMPRA', 'ALIQ_IPI_ITEM_COMPRA', 'VALOR_IPI_ITEM_COMPRA', 'VALOR_ICMS_ST_ITEM_COMPRA', 'TIPO_DESCONTO_ITEM_COMPRA', 'CODIGO_CFOP_ITEM_COMPRA',
        'CUSTO_TOTAL_PRODUTO', 'MARGEM_VENDA_PRODUTO', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'CODIGO_FORNECEDOR_ITEM_COMPRA',
        'NUMERO_LOTE_ITEM_COMPRA', 'OBS_ITEM_COMPRA', 'CODIGO_COMPLEMENTO_PRODUTO_COMPRA', 'DESCRICAO_PRODUTO', 'PRECO_RESERVA',
        'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA'
        ]),
    listeners: {
        load: function (records, options) {
            if (TB_ITEM_COMPRA_Store.getCount() > 0)
                Habilita_UF_Pedido(false);
            else
                Habilita_UF_Pedido(true);

        }
    }
});

//TOOLBAR GRID ORCAMENTO
function RetornaITEM_COMPRA_JsonData() {
    var _orcamento = Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue() == '' ? 0
                                                : Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue();

    _orcamento = _orcamento == undefined ? 0 : _orcamento;

    var CP_JsonData = {
        NUMERO_PEDIDO_COMPRA: _orcamento,
        CODIGO_FORNECEDOR: Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue(),
        start: 0,
        limit: Th2_LimiteDeLinhasPaginacao
    };

    return CP_JsonData;
}

function TB_ITEM_COMPRA_CARREGA_GRID(_utlimaPagina) {

    var _orcamento = Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue() == '' ? 0
                                                : Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA').getValue();

    var _dados = {
        NUMERO_PEDIDO_COMPRA: _orcamento,
        CODIGO_FORNECEDOR: Ext.getCmp('HDF_CODIGO_FORNECEDOR').getValue(),
        ID_USUARIO: _ID_USUARIO
    };

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Pedido_Compra');
    _ajax.setJsonData({ dados: _dados });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        TB_ITEM_COMPRA_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Transforma_Cotacao_Pedido(NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR) {
    dialog.MensagemDeConfirmacao('Confirma a passagem da cota&ccedil;&atilde;o para pedido?', 'BTN_TRANSFORMAR_PEDIDO1', Conf);

    function Conf(btn) {
        if (btn == 'yes') {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Transforma_Cotacao_Pedido');
            _ajax.setJsonData({
                NUMERO_PEDIDO_COMPRA: NUMERO_PEDIDO_COMPRA,
                CODIGO_FORNECEDOR: CODIGO_FORNECEDOR,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').enable();
                Ext.getCmp('BTN_IMPRIMIR_PEDIDO_COMPRA').enable();
                Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').disable();
                Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').enable();
                Ext.getCmp('BTN_RECEBIMENTO_MERCADORIA').enable();
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();

                var result = Ext.decode(response.responseText).d;

                Ext.getCmp('grid_PEDIDO_COMPRA1').getStore().each(Atualiza);

                function Atualiza(record) {
                    if (record.data.NUMERO_PEDIDO_COMPRA == NUMERO_PEDIDO_COMPRA) {
                        record.beginEdit();
                        record.set('CODIGO_STATUS_COMPRA', result.CODIGO_STATUS_COMPRA);
                        record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);
                        record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                        record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                        record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result.STATUS_ESPECIFICO_ITEM_COMPRA);
                        record.endEdit();
                        record.commit();
                    }
                }
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }
}