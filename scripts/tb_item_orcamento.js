var _ID_UF_EMITENTE;

/////////////////

var _Origem_Destino_Servico = new Origem_Destino_Servico();

function MontaCadastroItemOrcamento() {

    var wBusca_Produto;

    var lista = new Monta_Custo_Item_Orcamento();

    var _parcelas = new wParcelasOrcamento();

    var busca_Contato = new Selecionar_Contato();

    var HDF_NUMERO_ORCAMENTO = new Ext.form.Hidden({
        name: 'HDF_NUMERO_ORCAMENTO',
        id: 'HDF_NUMERO_ORCAMENTO',
        value: 0
    });

    var HDF_NUMERO_ITEM = new Ext.form.Hidden({
        name: 'NUMERO_ITEM',
        id: 'NUMERO_ITEM',
        value: 0
    });

    var ID_PRODUTO_ITEM_ORCAMENTO = new Ext.form.Hidden({
        name: 'ID_PRODUTO_ITEM_ORCAMENTO',
        id: 'ID_PRODUTO_ITEM_ORCAMENTO',
        value: 0
    });

    var TXT_CONTATO_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Empresa / Contato - &lt;F8&gt; Busca',
        width: 300,
        name: 'CONTATO_ORCAMENTO',
        id: 'CONTATO_ORCAMENTO',
        maxLegth: 60,
        allowBlank: false,
        msgTarget: 'side',
        enableKeyEvents: true,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '60' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    if (Ext.getCmp('ID_UF_ORCAMENTO').getValue() == '')
                        Ext.getCmp('ID_UF_ORCAMENTO').setValue(35);
                }
            },
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {
                    busca_Contato.show('CONTATO_ORCAMENTO');
                }
            }
        }
    });

    var TXT_TELEFONE_CONTATO = new Ext.form.TextField({
        fieldLabel: 'Telefone',
        id: 'TELEFONE_CONTATO',
        name: 'TELEFONE_CONTATO',
        allowBlank: true,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
        width: 120
    });

    TB_UF_CARREGA_COMBO();

    var CB_ID_UF_ORCAMENTO = new Ext.form.ComboBox({
        store: TB_UF_STORE,
        fieldLabel: 'Unidade Federativa',
        id: 'ID_UF_ORCAMENTO',
        name: 'ID_UF_ORCAMENTO',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 170,
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                if (index > -1) {
                    _ID_UF_EMITENTE = record.data.ID_UF;
                }
            }
        }
    });

    var TXT_EMAIL_CONTATO = new Ext.form.TextField({
        id: 'EMAIL_CONTATO',
        name: 'EMAIL_CONTATO',
        fieldLabel: 'e-mail',
        width: 300,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        vtype: 'email'
    });

    TB_COND_ATIVA_CARREGA_COMBO();

    var CB_CODIGO_COND_PAGTO = new Ext.form.ComboBox({
        store: combo_TB_COND_ATIVA_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        name: 'CODIGO_COND_PAGTO',
        id: 'CODIGO_COND_PAGTO',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 300,
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_COD_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Servi&ccedil;o',
        width: 180,
        name: 'CODIGO_PRODUTO',
        id: 'CODIGO_PRODUTO',
        maxLegth: 25,
        allowBlank: false,
        msgTarget: 'side',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue().trim().length == 0) {

                        if (!wBusca_Produto)
                            wBusca_Produto = new Busca_Produto_para_Orcamento();

                        wBusca_Produto.CODIGO_PESQUISA("");
                        wBusca_Produto.show('CODIGO_PRODUTO');
                    }

                    if (f.getValue().trim().length > 0) {
                        PopulaCamposProduto_PorCodigo(f.getValue());
                    }
                }
                if (e.getKey() == e.TAB) {
                    if (f.getValue().trim().length > 0)
                        PopulaCamposProduto_PorCodigo(f.getValue());
                }
            }
        }
    });

    var TXT_DESCRICAO_PRODUTO_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do servi&ccedil;o',
        width: 380,
        name: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO',
        id: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO',
        maxLegth: 55,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '55' }
    });

    function PopulaCamposProduto_PorCodigo(CODIGO_PRODUTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Busca_Produto_por_Codigo');
        _ajax.setJsonData({
            CODIGO_PRODUTO: CODIGO_PRODUTO,
            ID_UF: Ext.getCmp('ID_UF_ORCAMENTO').getValue(),
            CODIGO_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').getValue() == '' ?
                            0 : Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').getValue(),
            ID_EMITENTE: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (!result.ID_PRODUTO_ITEM_ORCAMENTO) {

                if (!wBusca_Produto)
                    wBusca_Produto = new Busca_Produto_para_Orcamento();

                wBusca_Produto.CODIGO_PESQUISA(TXT_COD_PRODUTO.getValue());
                wBusca_Produto.show('ID_PRODUTO_ITEM_ORCAMENTO');
            }
            else {
                Ext.getCmp('ID_PRODUTO_ITEM_ORCAMENTO').setValue(result.ID_PRODUTO_ITEM_ORCAMENTO);
                Ext.getCmp("CODIGO_PRODUTO").setValue(result.CODIGO_PRODUTO);
                Ext.getCmp("DESCRICAO_PRODUTO_ITEM_ORCAMENTO").setValue(result.DESCRICAO_PRODUTO_ITEM_ORCAMENTO);
                Ext.getCmp("PRECO_PRODUTO").setValue(result.PRECO_PRODUTO);
                Ext.getCmp("ALIQ_ISS").setValue(result.ALIQ_ISS);
                Ext.getCmp("UNIDADE_PRODUTO").setValue(result.UNIDADE_PRODUTO);

                Ext.getCmp("CODIGO_PRODUTO").disable();

                Ext.getCmp("QTDE_PRODUTO").focus();

                CalculaValores();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function CalculaTotalItem() {
        var _qtde = TXT_QTDE_PRODUTO.getValue();
        var _preco = TXT_PRECO_PRODUTO.getValue();
        var _desconto = TXT_VALOR_DESCONTO.getValue();
        var _totalItem = undefined;

        if (_qtde == "" || _qtde == undefined) {
            if (Ext.getCmp('TIPO_DESCONTO').getValue() == 1)
                _totalItem = _preco - _desconto;
            else
                _totalItem = _preco * (1 - (_desconto / 100));
        }
        else {
            var _subTotal;

            if (Ext.getCmp('TIPO_DESCONTO').getValue() == 1)
                _subTotal = _preco - _desconto;
            else
                _subTotal = _preco * (1 - (_desconto / 100));

            _totalItem = _subTotal * _qtde;
        }

        TXT_VALOR_ISS.setValue(_totalItem * (TXT_ALIQ_ISS.getValue() / 100).toFixed(2));
        TXT_VALOR_TOTAL.setValue(_totalItem);
    }

    function CalculaValores() {
        CalculaTotalItem();
    }

    function Recalcula_Totais_do_Orcamento(ch) {
        if (Ext.getCmp('grid_ITEM_ORCAMENTO').getStore().getCount() > 0) {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Recalcula_Items_Orcamento');
            _ajax.setJsonData({
                NUMERO_ORCAMENTO: Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue(),
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                TB_ITEM_ORCAMENTO_CARREGA_GRID();
                AtualizaTotais(response);

                if (panelCadastroOrcamento.title == "Novo Or&ccedil;amento - Novo Item de Or&ccedil;amento"
                    || panelCadastroOrcamento.title == "Alterar Or&ccedil;amento - Novo Item de Or&ccedil;amento")
                    ResetaFormulario_Item();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }

    TB_USUARIO_CARREGA_VENDEDORES();

    var CB_CODIGO_VENDEDOR = new Ext.form.ComboBox({
        store: combo_TB_VENDEDORES_Store,
        id: 'CODIGO_VENDEDOR',
        name: 'CODIGO_VENDEDOR',
        fieldLabel: 'Vendedor(a)',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 170,
        allowBlank: false
    });

    var TXT_PRECO_PRODUTO = new Ext.form.NumberField({
        fieldLabel: 'Pre&ccedil;o Unit&aacute;rio',
        width: 80,
        name: 'PRECO_PRODUTO',
        id: 'PRECO_PRODUTO',
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
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var TXT_UNIDADE_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Un.',
        width: 30,
        name: 'UNIDADE_PRODUTO',
        id: 'UNIDADE_PRODUTO',
        maxLength: 2,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '2' }
    });

    var TXT_VALOR_DESCONTO = new Ext.form.NumberField({
        fieldLabel: 'Desconto',
        width: 70,
        name: 'VALOR_DESCONTO',
        id: 'VALOR_DESCONTO',
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
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var CB_TIPO_DESCONTO = new Ext.form.ComboBox({
        fieldLabel: 'F.Desconto',
        valueField: 'Opc',
        displayField: 'Opcao',
        id: 'TIPO_DESCONTO',
        name: 'TIPO_DESCONTO',
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

    var TXT_QTDE_PRODUTO = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        width: 70,
        name: 'QTDE_PRODUTO',
        id: 'QTDE_PRODUTO',
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
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            },
            keyup: function (f, e) {
                CalculaValores();
            }
        }
    });

    var TXT_VALOR_TOTAL = new Ext.form.NumberField({
        fieldLabel: 'Valor Total',
        width: 100,
        name: 'VALOR_TOTAL',
        id: 'VALOR_TOTAL',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        readOnly: true,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', readOnly: true }
    });

    var TXT_ALIQ_ISS = new Ext.form.NumberField({
        fieldLabel: 'Al&iacute;q. ISS',
        width: 50,
        name: 'ALIQ_ISS',
        id: 'ALIQ_ISS',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                CalculaValores();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaValores();
                }

                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            }
        }
    });

    var TXT_VALOR_ISS = new Ext.form.NumberField({
        fieldLabel: 'Valor ISS',
        width: 85,
        name: 'VALOR_ISS',
        id: 'VALOR_ISS',
        maxLength: 18,
        decimalPrecision: 2,
        decimalSeparator: ',',
        readOnly: true,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '18', readOnly: true }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, 1);

    dt1 = dt1.diaUtil();

    var TXT_DATA_ENTREGA = new Ext.form.DateField({
        id: 'DATA_ENTREGA',
        name: 'DATA_ENTREGA',
        layout: 'form',
        fieldLabel: 'Data de Entrega',
        allowBlank: false,
        value: dt1,
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Nr. Pedido Cliente',
        name: 'NUMERO_PEDIDO_ITEM_ORCAMENTO',
        id: 'NUMERO_PEDIDO_ITEM_ORCAMENTO',
        width: 120,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            }
        }
    });

    var TXT_NUMERO_ITEM_PEDIDO_CLIENTE = new Ext.form.NumberField({
        fieldLabel: 'Item',
        name: 'NUMERO_ITEM_PEDIDO_CLIENTE',
        id: 'NUMERO_ITEM_PEDIDO_CLIENTE',
        decimalPrecision: 0,
        width: 50,
        maxLength: 5,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 5, style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            }
        }
    });

    var TXT_OBS_ITEM_ORCAMENTO = new Ext.form.TextField({
        id: 'OBS_ITEM_ORCAMENTO',
        name: 'OBS_ITEM_ORCAMENTO',
        fieldLabel: 'Observa&ccedil;&atilde;o do Item',
        anchor: '90%',
        height: 28,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    // -------------- BUSCA DE PRODUTOS ----------------------
    function Busca_Produto_para_Orcamento() {

        var _CODIGO_PESQUISA = "";

        this.CODIGO_PESQUISA = function (pValue) {
            _CODIGO_PESQUISA = pValue;
            TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO.setValue('');
        };

        var TXT_COD_PRODUTO_FILTRO = new Ext.form.TextField({
            fieldLabel: 'C&oacute;digo',
            width: 180,
            maxLegth: 25,
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        Carrega_Busca_TB_PRODUTO();
                    }
                }
            }
        });

        TXT_COD_PRODUTO_FILTRO.on('render', function (f) { f.focus() });

        var TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO = new Ext.form.TextField({
            width: 250,
            name: 'TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO',
            id: 'TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO',
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
             ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'PRECO_PRODUTO', 'ALIQ_ISS', 'UNIDADE_MEDIDA_VENDA',
             'ULTIMO_PRECO', 'ULTIMA_COMPRA'])
        });

        var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
            store: Store_PESQUISA_PRODUTO,
            title: 'Servi&ccedil;os',
            enableColumnHide: _GERENTE_COMERCIAL == 1 ? true : false,
            columns: [
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 310, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'UNIDADE_MEDIDA_VENDA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA', align: 'center' },
                { id: 'ULTIMO_PRECO', header: "Ult. Pr&ccedil; / Pr&ccedil; Venda", width: 100, sortable: true, dataIndex: 'ULTIMO_PRECO', renderer: precoAbaixo, align: 'center' },
                { id: 'ULTIMA_COMPRA', header: "Ultima Compra", width: 115, sortable: true, dataIndex: 'ULTIMA_COMPRA', renderer: Ultima_Compra_Cliente },
                { id: 'ALIQ_ISS', header: "% ISS", width: 80, sortable: true, dataIndex: 'ALIQ_ISS', renderer: FormataPercentual, align: 'center' }
            ],
            stripeRows: true,
            width: '100%',
            height: 350,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        GRID_PESQUISA_PRODUTO.on('rowdblclick', function (grid, rowIndex, e) {
            var record = grid.getStore().getAt(rowIndex);
            PopulaCamposProduto_PorCodigo(record.data.CODIGO_PRODUTO);
            wBUSCA_PRODUTO.hide();
        });

        GRID_PESQUISA_PRODUTO.on('keydown', function (e) {
            if (e.getKey() == e.ENTER) {
                if (GRID_PESQUISA_PRODUTO.getSelectionModel().getSelections().length > 0) {
                    var record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();
                    PopulaCamposProduto_PorCodigo(record.data.CODIGO_PRODUTO);
                    wBUSCA_PRODUTO.hide();
                }
            }
        });

        function RetornaFiltros_TB_PRODUTO_JsonData() {
            var _pesquisa = Ext.getCmp('TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO') ?
                            Ext.getCmp('TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO').getValue() : '';

            var TB_PRODUTO_JsonData = {
                Pesquisa: _pesquisa,
                CODIGO_PRODUTO: TXT_COD_PRODUTO_FILTRO.getValue(),
                start: 0,
                limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina(),
                ID_USUARIO: _ID_USUARIO
            };

            return TB_PRODUTO_JsonData;
        }

        var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

        TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_TB_PRODUTO');
        TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO);

        function Carrega_Busca_TB_PRODUTO() {
            TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
            TB_PRODUTO_PagingToolbar.doRequest();

            Ext.getCmp('BTN_LISTA_CUSTO_ITEM').disable();
        }

        var wBUSCA_PRODUTO = new Ext.Window({
            layout: 'form',
            title: 'Busca de Servi&ccedil;o(s)',
            iconCls: 'icone_TB_PRODUTO',
            width: 900,
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
                }
            },
            items: [GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar(), {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .06,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Código:'
                }, {
                    columnWidth: .24,
                    items: [TXT_COD_PRODUTO_FILTRO]
                }, {
                    columnWidth: .15,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Descrição do serviço:'
                }, {
                    columnWidth: .30,
                    items: [TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO]
                }, {
                    columnWidth: .14,
                    layout: 'form',
                    items: [BTN_PESQUISA_PRODUTO]
                }]
            }]
        });

        this.show = function (elm) {
            TXT_COD_PRODUTO_FILTRO.setValue('');

            if (_CODIGO_PESQUISA.length > 0) {
                TXT_COD_PRODUTO_FILTRO.setValue(_CODIGO_PESQUISA);
                TXT_PESQUISA_DESCRICAO_PRODUTO_ITEM_ORCAMENTO.setValue('');
                Carrega_Busca_TB_PRODUTO();
            }

            wBUSCA_PRODUTO.show(elm);
            TXT_COD_PRODUTO.focus();
        };
    }

    var fsBuscaProduto = new Ext.form.FieldSet({
        id: 'fsBuscaProduto5',
        title: 'Busca de Servi&ccedil;os',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                f.collapse();

                if (!wBusca_Produto)
                    wBusca_Produto = new Busca_Produto_para_Orcamento();

                wBusca_Produto.show(f.getId());
            }
        }
    });

    // -------------- FIM BUSCA DE PRODUTOS ----------------------

    var BTN_BUSCA_PRODUTO = new Ext.Button({
        icon: 'imagens/icones/database_search_24.gif',
        tooltip: 'Buscar servi&ccedil;o',
        scale: 'large',
        handler: function () {
            if (!wBusca_Produto)
                wBusca_Produto = new Busca_Produto_para_Orcamento();

            wBusca_Produto.cod
            wBusca_Produto.show(TXT_COD_PRODUTO.getId());
        }
    });

    var LBL1 = new Ext.form.Label({
        html: '<br />&nbsp;'
    });

    var BTN_ORIGEM_DESTINO = new Ext.Button({
        id: 'BTN_ORIGEM_DESTINO',
        text: 'Endere&ccedil;o de origem e destino <b>(VAZIO)</b>',
        icon: 'imagens/icones/entity_relation_delete_24.gif',
        scale: 'large',
        handler: function (btn) {

            _Origem_Destino_Servico.acaoPreencheDistancia(function (_distancia, _tempo, _atencao, _resumo) {
                TXT_QTDE_PRODUTO.setValue(1);

                TXT_OBS_ITEM_ORCAMENTO.setValue(_atencao.trim().length > 0 ?
                    'Atenção: ' + _atencao + ' - ' + (_distancia / 1000).toFixed() + " Km" : ''
                    + 'Resumo: ' + _resumo + ' - ' + (_distancia / 1000).toFixed() + " Km");

                var calculo_Co2 = (_distancia / 1000).toFixed() * 113;

                TXT_OBS_ITEM_ORCAMENTO.setValue(TXT_OBS_ITEM_ORCAMENTO.getValue() + ' - ECONOMIZE ' + calculo_Co2 + ' grams de Co2');

                TXT_DISTANCIA_EM_METROS.setValue(_distancia);

                TXT_COD_PRODUTO.focus();
            });

            _Origem_Destino_Servico.button(btn);
            _Origem_Destino_Servico.show(btn);
        }
    });


    var TXT_DISTANCIA_EM_METROS = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Dist&acirc;ncia em metros',
        minValue: 1,
        width: 100
    });

    //------------ FORM PANEL DADOS -----------------
    var formItemOrcamento = new Ext.form.FormPanel({
        id: 'formItemOrcamento',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        height: 260,
        items: [HDF_NUMERO_ITEM, ID_PRODUTO_ITEM_ORCAMENTO, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.32,
                items: [TXT_CONTATO_ORCAMENTO]
            }, {
                layout: 'form',
                columnWidth: 0.18,
                items: [CB_ID_UF_ORCAMENTO]
            }, {
                layout: 'form',
                columnWidth: 0.13,
                items: [TXT_TELEFONE_CONTATO]
            }, {
                layout: 'form',
                columnWidth: 0.30,
                items: [TXT_EMAIL_CONTATO]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.32,
                items: [CB_CODIGO_COND_PAGTO]
            }, {
                layout: 'form',
                columnWidth: 0.18,
                items: [CB_CODIGO_VENDEDOR]
            }, {
                columnWidth: .28,
                items: [BTN_ORIGEM_DESTINO]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.17,
                items: [TXT_COD_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: .06,
                items: [BTN_BUSCA_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.37,
                items: [TXT_DESCRICAO_PRODUTO_ITEM_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.06,
                items: [TXT_UNIDADE_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.08,
                items: [TXT_QTDE_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.10,
                items: [TXT_PRECO_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.08,
                items: [CB_TIPO_DESCONTO]
            }, {
                layout: 'form',
                columnWidth: 0.09,
                items: [TXT_VALOR_DESCONTO]
            }, {
                layout: 'form',
                columnWidth: 0.10,
                items: [TXT_VALOR_TOTAL]
            }, {
                layout: 'form',
                columnWidth: 0.07,
                items: [TXT_ALIQ_ISS]
            }, {
                layout: 'form',
                columnWidth: 0.09,
                items: [TXT_VALOR_ISS]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .12,
                items: [TXT_DATA_ENTREGA]
            }, {
                layout: 'form',
                columnWidth: .12,
                items: [TXT_NUMERO_PEDIDO_ITEM_ORCAMENTO]
            }, {
                layout: 'form',
                columnWidth: .07,
                items: [TXT_NUMERO_ITEM_PEDIDO_CLIENTE]
            }, {
                layout: 'form',
                columnWidth: .48,
                items: [TXT_OBS_ITEM_ORCAMENTO]
            }, {
                layout: 'form',
                columnWidth: .10,
                items: [TXT_DISTANCIA_EM_METROS]
            }]
        }]
    });

    function PopulaFormulario_TB_ITEM_ORCAMENTO(record) {
        Ext.getCmp('ID_PRODUTO_ITEM_ORCAMENTO').setValue(record.data.ID_PRODUTO);
        Ext.getCmp('CODIGO_PRODUTO').disable();

        // fsBuscaProduto.disable();

        formItemOrcamento.getForm().loadRecord(record);
        Ext.getCmp('DATA_ENTREGA').setValue(XMLParseDate(record.data.DATA_ENTREGA));

        _Origem_Destino_Servico.set_CEP_ORIGEM(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_ENDERECO_ORIGEM(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_NUMERO_ORIGEM(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_COMPLEMENTO_ORIGEM(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_CIDADE_ORIGEM(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_ESTADO_ORIGEM(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);

        _Origem_Destino_Servico.set_CEP_DESTINO(record.data.CEP_FINAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_ENDERECO_DESTINO(record.data.ENDERECO_FINAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_NUMERO_DESTINO(record.data.NUMERO_FINAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_COMPLEMENTO_DESTINO(record.data.COMPL_FINAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_CIDADE_DESTINO(record.data.CIDADE_FINAL_ITEM_ORCAMENTO);
        _Origem_Destino_Servico.set_ESTADO_DESTINO(record.data.ESTADO_FINAL_ITEM_ORCAMENTO);

        BTN_ORIGEM_DESTINO.setText('Endere&ccedil;o de origem e destino <b>(PREENCHIDO)</b>');
        BTN_ORIGEM_DESTINO.setIcon('imagens/icones/entity_relation_Ok_24.gif');

        Ext.getCmp('BTN_DELETAR_TB_ITEM_ORCAMENTO').enable();

        Ext.getCmp("DESCRICAO_PRODUTO_ITEM_ORCAMENTO").readOnly = record.data.PRODUTO_ESPECIAL == 1 ? true : false;

        panelCadastroOrcamento.setTitle('Alterar item de or&ccedil;amento');
        Ext.getCmp('BTN_DELETAR_TB_ITEM_ORCAMENTO').enable();

        TXT_DISTANCIA_EM_METROS.setValue(record.data.DISTANCIA_EM_METROS);

        formItemOrcamento.getForm().findField('PRECO_PRODUTO').focus();
    }

    //------------FIM FORM PANEL DADOS -----------------

    // -------------- BOTOES -------------------------
    var buttonGroup_TB_CLIENTE = new Ext.ButtonGroup({
        id: 'buttonGroup_TB_ITEM_ORCAMENTO',
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue() > 0) {
                    if (Ext.getCmp('formItemOrcamento').getForm().isValid()) {
                        GravaDados_TB_ITEM_ORCAMENTO();
                    }

                    Grava_Contato_Orcamento();
                }
                else {
                    GravaDados_TB_ITEM_ORCAMENTO();
                }
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Novo Item de Or&ccedil;amento',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                ResetaFormulario_Item();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_DELETAR_TB_ITEM_ORCAMENTO',
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'medium',
            disabled: true,
            handler: function () { Deleta_ITEM_ORCAMENTO(); }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Lista de Custos do Item',
            id: 'BTN_LISTA_CUSTO_ITEM',
            icon: 'imagens/icones/calculator_star_24.gif',
            scale: 'medium',
            disabled: true,
            handler: function () {
                if (grid_ITEM_ORCAMENTO.getSelectionModel().getSelections().length > 0) {

                    var record = grid_ITEM_ORCAMENTO.getSelectionModel().getSelected();

                    lista.SETA_NUMERO_ORCAMENTO(record.data.NUMERO_ORCAMENTO);
                    lista.SETA_NUMERO_ITEM_ORCAMENTO(record.data.NUMERO_ITEM);
                    lista.SETA_TITULO(record.data.CODIGO_PRODUTO);
                    lista.SETA_RECORD_ITEM_ORCAMENTO(record);
                    lista.SETA_ID_PRODUTO(record.data.ID_PRODUTO);
                    lista.show('BTN_LISTA_CUSTO_ITEM');
                }
                else {
                    dialog.MensagemDeErro('Selecione um item j&aacute; cadastrado neste or&ccedil;amento para lan&ccedil;ar os seus custos', 'BTN_LISTA_CUSTO_ITEM');
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_SEQUENCIA_ORCAMENTO',
            text: 'Prosseguir com o Or&ccedil;amento',
            icon: 'imagens/icones/database_next_24.gif',
            scale: 'medium',
            handler: function () {
                if (!Ext.getCmp('NUMERO_ORCAMENTO').isValid() || TB_ITEM_ORCAMENTO_Store.getCount() == 0) {
                    dialog.MensagemDeErro('N&atilde;o h&aacute; itens cadastrados neste or&ccedil;amento');
                    return;
                }

                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].enable();
                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').setActiveTab(1);

                Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').focus();

                CarregaDadosCliente(Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO'));
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_SIMULAR_PARCELAS',
            text: 'Calculo de Parcelas',
            icon: 'imagens/icones/calendar_24.gif',
            scale: 'medium',
            handler: function () {
                if (HDF_NUMERO_ORCAMENTO.getValue() == '' || TB_ITEM_ORCAMENTO_Store.getCount() == 0) {
                    dialog.MensagemDeErro('Grave o or&ccedil;amento antes de simular as parcelas', 'BTN_SIMULAR_PARCELAS');
                    return;
                }

                _parcelas.NUMERO_ORCAMENTO(HDF_NUMERO_ORCAMENTO.getValue());
                _parcelas.show('BTN_SIMULAR_PARCELAS');
            }
        }]
    });

    var toolbar_TB_ITEM_ORCAMENTO = new Ext.Toolbar({
        style: 'text-align: right; width: 100%;',
        items: [buttonGroup_TB_CLIENTE]
    });

    // --------------FIM BOTOES -------------------------

    // -------------- EVENTOS BOTOES ----------------------

    function Grava_Contato_Orcamento() {
        if (!Ext.getCmp('CODIGO_COND_PAGTO').isValid() ||
                                        !Ext.getCmp('ID_UF_ORCAMENTO').isValid() ||
                                        !Ext.getCmp('CONTATO_ORCAMENTO').isValid()) {
            return;
        }

        var dados = {
            NUMERO_ORCAMENTO: Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue(),
            CODIGO_COND_PAGTO: Ext.getCmp('CODIGO_COND_PAGTO').getValue(),
            CONTATO_ORCAMENTO: Ext.getCmp('CONTATO_ORCAMENTO').getValue(),
            EMAIL_CONTATO: Ext.getCmp('EMAIL_CONTATO').getValue(),
            TELEFONE_CONTATO: Ext.getCmp('TELEFONE_CONTATO').getValue(),
            ID_UF_ORCAMENTO: Ext.getCmp('ID_UF_ORCAMENTO').getValue(),
            CODIGO_VENDEDOR: Ext.getCmp('CODIGO_VENDEDOR').getValue(),
            CODIGO_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var url = 'servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Grava_Contato_Orcamento';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(url);
        _ajax.setJsonData({ dados: dados });

        var _sucesso = function (response, options) {
            Ext.getCmp('CODIGO_PRODUTO').reset();
            Ext.getCmp('UNIDADE_PRODUTO').reset();
            Ext.getCmp('QTDE_PRODUTO').reset();
            Ext.getCmp('PRECO_PRODUTO').reset();

            AtualizaTotais(response);
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    function GravaDados_TB_ITEM_ORCAMENTO() {
        if (!formItemOrcamento.getForm().isValid()) {
            return;
        }

        if (!_Origem_Destino_Servico.formEnderecos().getForm().isValid()) {
            dialog.MensagemDeErro('Preencha todos os campos dos endere&ccedil;os de origem e destino clicando no bot&atilde;o [<b>Definir endere&ccedil;o de origem e destino</b>] antes de salvar', BTN_ORIGEM_DESTINO.getId());
            return;
        }

        var _store = Ext.getCmp('ID_UF_ORCAMENTO').getStore();
        var linha = _store.find('ID_UF', Ext.getCmp('ID_UF_ORCAMENTO').getValue());
        var record = _store.getAt(linha);

        var dados = {
            NUMERO_ORCAMENTO: Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue() == "" ? 0 : Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue(),
            NUMERO_ITEM: Ext.getCmp('NUMERO_ITEM').getValue() == "" ? 0 : Ext.getCmp('NUMERO_ITEM').getValue(),
            CODIGO_VENDEDOR: Ext.getCmp('CODIGO_VENDEDOR').getValue(),
            ID_PRODUTO: Ext.getCmp('ID_PRODUTO_ITEM_ORCAMENTO').getValue(),
            CODIGO_PRODUTO: Ext.getCmp('CODIGO_PRODUTO').getValue(),
            QTDE_PRODUTO: Ext.getCmp('QTDE_PRODUTO').getValue(),
            PRECO_PRODUTO: Ext.getCmp('PRECO_PRODUTO').getValue(),
            UNIDADE_PRODUTO: Ext.getCmp('UNIDADE_PRODUTO').getValue(),
            VALOR_TOTAL: Ext.getCmp('VALOR_TOTAL').getValue(),
            VALOR_DESCONTO: Ext.getCmp('VALOR_DESCONTO').getValue() == "" ? 0 : Ext.getCmp('VALOR_DESCONTO').getValue(),
            TIPO_DESCONTO: Ext.getCmp('TIPO_DESCONTO').getValue(),
            ALIQ_ISS: Ext.getCmp('ALIQ_ISS').getValue(),
            VALOR_ISS: Ext.getCmp('ALIQ_ISS').getValue() == 0 ? 0 : Ext.getCmp('VALOR_ISS').getValue(),
            CONTATO_ORCAMENTO: Ext.getCmp('CONTATO_ORCAMENTO').getValue(),
            TELEFONE_CONTATO: Ext.getCmp('TELEFONE_CONTATO').getValue(),
            EMAIL_CONTATO: Ext.getCmp('EMAIL_CONTATO').getValue(),
            ID_UF_ORCAMENTO: Ext.getCmp('ID_UF_ORCAMENTO').getValue(),
            VALIDADE_ORCAMENTO: Ext.getCmp('VALIDADE_ORCAMENTO').getRawValue(),
            CODIGO_COND_PAGTO: Ext.getCmp('CODIGO_COND_PAGTO').getValue(),
            DATA_ENTREGA: Ext.getCmp('DATA_ENTREGA').getRawValue(),
            NUMERO_PEDIDO_ITEM_ORCAMENTO: Ext.getCmp('NUMERO_PEDIDO_ITEM_ORCAMENTO').getValue(),
            NUMERO_ITEM_PEDIDO_CLIENTE: Ext.getCmp('NUMERO_ITEM_PEDIDO_CLIENTE').getValue() == '' ? 0 : Ext.getCmp('NUMERO_ITEM_PEDIDO_CLIENTE').getValue(),
            OBS_ITEM_ORCAMENTO: Ext.getCmp('OBS_ITEM_ORCAMENTO').getValue(),
            DESCRICAO_PRODUTO_ITEM_ORCAMENTO: Ext.getCmp('DESCRICAO_PRODUTO_ITEM_ORCAMENTO').getValue(),
            CODIGO_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').getValue(),

            ENDERECO_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_ENDERECO_ORIGEM(),
            NUMERO_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_NUMERO_ORIGEM(),
            COMPL_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_COMPLEMENTO_ORIGEM(),
            CEP_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_CEP_ORIGEM(),
            CIDADE_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_CIDADE_ORIGEM(),
            ESTADO_INICIAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_ESTADO_ORIGEM(),

            ENDERECO_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_ENDERECO_DESTINO(),
            NUMERO_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_NUMERO_DESTINO(),
            COMPL_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_COMPLEMENTO_DESTINO(),
            CEP_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_CEP_DESTINO(),
            CIDADE_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_CIDADE_DESTINO(),
            ESTADO_FINAL_ITEM_ORCAMENTO: _Origem_Destino_Servico.get_ESTADO_DESTINO(),

            DISTANCIA_EM_METROS: TXT_DISTANCIA_EM_METROS.getValue() == '' || TXT_DISTANCIA_EM_METROS.getValue() == 0 ?
                1 : TXT_DISTANCIA_EM_METROS.getValue(),

            UF_EMITENTE: _UF_EMITENTE,
            ID_USUARIO: _ID_USUARIO
        };

        var url = panelCadastroOrcamento.title == "Novo Or&ccedil;amento - Novo Item de Or&ccedil;amento"
                                    || panelCadastroOrcamento.title == "Alterar Or&ccedil;amento - Novo Item de Or&ccedil;amento" ?
            'servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Grava_Novo_Item_Orcamento' :
            'servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Atualiza_Orcamento';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(url);
        _ajax.setJsonData({ dados: dados });

        var _sucesso = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('CODIGO_PRODUTO').focus();

            HDF_NUMERO_ORCAMENTO.setValue(result.NUMERO_ORCAMENTO);
            Ext.getCmp('NUMERO_ORCAMENTO').setValue(result.NUMERO_ORCAMENTO);

            AtualizaTotais(response);

            ResetaFormulario_Item();
            TB_ITEM_ORCAMENTO_CARREGA_GRID(true);

            Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[2].enable();
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    function Deleta_ITEM_ORCAMENTO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este item de Or&ccedil;amento [' +
                        formItemOrcamento.getForm().findField('CODIGO_PRODUTO').getValue() + ']?', 'formItemOrcamento', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Deleta_Orcamento');

                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue(),
                    NUMERO_ITEM: Ext.getCmp('NUMERO_ITEM').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    HDF_NUMERO_ORCAMENTO.setValue(result.NUMERO_ORCAMENTO);
                    Ext.getCmp('NUMERO_ORCAMENTO').setValue(result.NUMERO_ORCAMENTO);
                    TB_ITEM_ORCAMENTO_CARREGA_GRID();
                    AtualizaTotais(response);
                    Ext.getCmp('CODIGO_PRODUTO').focus();
                    ResetaFormulario_Item();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }
    // --------------FIM EVENTOS BOTOES ----------------------

    // -------------- GRID ORCAMENTO----------------------
    var TB_ITEM_ORCAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
            ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'ID_PRODUTO', 'CODIGO_PRODUTO', 'PRECO_PRODUTO', 'UNIDADE_PRODUTO',
            'QTDE_PRODUTO', 'VALOR_DESCONTO', 'VALOR_TOTAL', 'ALIQ_ISS', 'BASE_ISS', 'VALOR_ISS', 'TIPO_DESCONTO',
            'DATA_ENTREGA', 'NUMERO_PEDIDO_ITEM_ORCAMENTO', 'OBS_ITEM_ORCAMENTO', 'NUMERO_ITEM_PEDIDO_CLIENTE',
            'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', 'CEP_INICIAL_ITEM_ORCAMENTO', 'ENDERECO_INICIAL_ITEM_ORCAMENTO',
            'NUMERO_INICIAL_ITEM_ORCAMENTO', 'COMPL_INICIAL_ITEM_ORCAMENTO', 'CIDADE_INICIAL_ITEM_ORCAMENTO',
            'ESTADO_INICIAL_ITEM_ORCAMENTO', 'CEP_FINAL_ITEM_ORCAMENTO', 'ENDERECO_FINAL_ITEM_ORCAMENTO',
            'NUMERO_FINAL_ITEM_ORCAMENTO', 'COMPL_FINAL_ITEM_ORCAMENTO',
            'CIDADE_FINAL_ITEM_ORCAMENTO', 'ESTADO_FINAL_ITEM_ORCAMENTO', 'DISTANCIA_EM_METROS']),
        listeners: {
            load: function (records, options) {
                Ext.getCmp('BTN_LISTA_CUSTO_ITEM').disable();

                if (TB_ITEM_ORCAMENTO_Store.getCount() > 0)
                    Habilita_UF(false);
                else
                    Habilita_UF(true);
            }
        }
    });

    function TrataTipoDesconto(val) {
        if (val == 0)
            return "%";
        else
            return "Valor";
    }

    var TXT_NOVA_DATA_ENTREGA = new Ext.form.DateField({
        allowBlank: false,
        value: dt1
    });

    var TXT_NOVO_PEDIDO_CLIENTE = new Ext.form.TextField({
        allowBlank: false,
        value: ''
    });

    function Altera_Data_Entrega_Todos_os_Itens(newValue) {
        dialog.MensagemDeConfirmacao('Confirma a altera&ccedil;&atilde;o da data de entrega para todos os itens?', 'grid_ITEM_ORCAMENTO', _altera);

        function _altera(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Altera_Data_Entrega_Todos_os_Itens');

                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: HDF_NUMERO_ORCAMENTO.getValue(),
                    DATA_ENTREGA: formatDate(newValue),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < TB_ITEM_ORCAMENTO_Store.getCount(); i++) {
                        var _record = TB_ITEM_ORCAMENTO_Store.getAt(i);

                        _record.beginEdit();
                        _record.set('DATA_ENTREGA', newValue);
                        _record.endEdit();
                        _record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function Altera_Pedido_Cliente_Todos_os_Itens(newValue) {
        dialog.MensagemDeConfirmacao('Confirma a altera&ccedil;&atilde;o do numero do pedido do cliente para todos os itens?', 'grid_ITEM_ORCAMENTO', _altera);

        function _altera(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Altera_Pedido_Cliente_Todos_os_Itens');

                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: HDF_NUMERO_ORCAMENTO.getValue(),
                    NUMERO_PEDIDO_ITEM_ORCAMENTO: newValue,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < TB_ITEM_ORCAMENTO_Store.getCount(); i++) {
                        var _record = TB_ITEM_ORCAMENTO_Store.getAt(i);

                        _record.beginEdit();
                        _record.set('NUMERO_PEDIDO_ITEM_ORCAMENTO', newValue);
                        _record.endEdit();
                        _record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var grid_ITEM_ORCAMENTO = new Ext.grid.EditorGridPanel({
        id: 'grid_ITEM_ORCAMENTO',
        store: TB_ITEM_ORCAMENTO_Store,
        enableColumnHide: _GERENTE_COMERCIAL == 1 ? true : false,
        columns: [
                { id: 'NUMERO_ITEM', header: "Item", width: 60, sortable: true, dataIndex: 'NUMERO_ITEM' },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', header: "Descri&ccedil;&atilde;o do Produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', hidden: true },
                { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4 },

                { id: 'UNIDADE_PRODUTO', header: "Un", width: 30, sortable: true, dataIndex: 'UNIDADE_PRODUTO' },
                { id: 'QTDE_PRODUTO', header: "Qtde", width: 50, sortable: true, dataIndex: 'QTDE_PRODUTO', renderer: FormataQtde },
                { id: 'TIPO_DESCONTO', header: "Tipo Desconto", width: 50, sortable: true, dataIndex: 'TIPO_DESCONTO', renderer: TrataTipoDesconto },
                { id: 'VALOR_DESCONTO', header: "Desconto", width: 90, sortable: true, dataIndex: 'VALOR_DESCONTO', renderer: FormataDesconto },
                { id: 'VALOR_TOTAL', header: "Valor Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL', renderer: FormataValor },
                { id: 'ALIQ_ISS', header: "Al&iacute;q ISS", width: 80, sortable: true, dataIndex: 'ALIQ_ISS', renderer: FormataPercentual },
                { id: 'VALOR_ISS', header: "Valor ISS", width: 80, sortable: true, dataIndex: 'VALOR_ISS', renderer: FormataValor },

                { id: 'DATA_ENTREGA', header: "Entrega", width: 90, sortable: true, dataIndex: 'DATA_ENTREGA', renderer: formatDate,
                    editor: TXT_NOVA_DATA_ENTREGA
                },
                { id: 'NUMERO_PEDIDO_ITEM_ORCAMENTO', header: "Nr. Pedido", width: 130, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_ORCAMENTO',
                    editor: TXT_NOVO_PEDIDO_CLIENTE
                },

                { id: 'NUMERO_ITEM_PEDIDO_CLIENTE', header: "Nr. Item Cliente", width: 110, sortable: true, dataIndex: 'NUMERO_ITEM_PEDIDO_CLIENTE' }

                ],
        stripeRows: true,
        height: 80,
        width: '100%',
        clicksToEdit: 1,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            rowselect: function (s, Index, record) {
                Ext.getCmp('BTN_LISTA_CUSTO_ITEM').enable();
            }
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                Ext.getCmp('BTN_LISTA_CUSTO_ITEM').enable();

                var record = grid_ITEM_ORCAMENTO.getStore().getAt(rowIndex);

                if (record.data.NUMERO_ITEM != HDF_NUMERO_ITEM.getValue())
                    ResetaFormulario_Item();
            },
            afterEdit: function (e) {
                if (e.field == 'DATA_ENTREGA')
                    Altera_Data_Entrega_Todos_os_Itens(e.value);

                if (e.field == 'NUMERO_PEDIDO_ITEM_ORCAMENTO')
                    Altera_Pedido_Cliente_Todos_os_Itens(e.value);
            }
        }
    });

    grid_ITEM_ORCAMENTO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_ITEM_ORCAMENTO(record);
    });

    grid_ITEM_ORCAMENTO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (grid_ITEM_ORCAMENTO.getSelectionModel().getSelections().length > 0) {
                var record = grid_ITEM_ORCAMENTO.getSelectionModel().getSelected();
                PopulaFormulario_TB_ITEM_ORCAMENTO(record);
            }
        }
    });

    //TOOBAR GRID ORCAMENTO
    function RetornaITEM_ORC_JsonData() {
        var _orcamento = Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue() == '' ? 0
                                        : Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue();

        _orcamento = _orcamento == undefined ? 0 : _orcamento;

        var CP_JsonData = {
            NUMERO_ORCAMENTO: _orcamento,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao,
            ID_USUARIO: _ID_USUARIO
        };

        return CP_JsonData;
    }

    function TB_ITEM_ORCAMENTO_CARREGA_GRID(_utlimaPagina) {

        var _orcamento = Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue() == '' ? 0
                                        : Ext.getCmp('HDF_NUMERO_ORCAMENTO').getValue();

        _orcamento = _orcamento == undefined ? 0 : _orcamento;

        var _dados = {
            NUMERO_ORCAMENTO: _orcamento,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Lista_TB_ITEM_ORCAMENTO_VENDA');
        _ajax.setJsonData({ dados: _dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TB_ITEM_ORCAMENTO_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    // --------------FIM GRID ORCAMENTO ----------

    // --------------PANELS ----------------------
    var panelCadastroOrcamento = new Ext.Panel({
        id: 'panelCadastroOrcamento',
        width: '100%',
        border: true,
        title: 'Novo Or&ccedil;amento - Novo Item de Or&ccedil;amento'
    });

    // TABS PANEL
    var TB_ITEM_ORCAMENTO_TABPANEL = new Ext.TabPanel({
        id: 'TB_ITEM_ORCAMENTO_TABPANEL',
        deferredRender: false,
        activeTab: 0,

        items: [{
            title: 'Itens do Or&ccedil;amento',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_ITEM_ORCAMENTO'
        }, {
            title: 'Dados do Cliente / Or&ccedil;amento',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_ORCAMENTO'
        }, {
            title: 'Administra&ccedil;&atilde;o de Or&ccedil;amentos',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_ORCAMENTO1'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {

                if (panel.title == 'Administra&ccedil;&atilde;o de Or&ccedil;amentos') {

                    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();
                    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[0].disable();

                    if (panel.items.length == 0) {
                        panel.add(Monta_Adm_Orcamentos());
                        panel.doLayout();
                    }

                    if (Ext.getCmp('grid_ORCAMENTOS').getSelectionModel().getSelections().length > 0) {
                        var record = Ext.getCmp('grid_ORCAMENTOS').getSelectionModel().getSelected();

                        Atualiza_Orcamento_Selecionado(record);
                    }
                }
                else if (panel.title == 'Dados do Cliente / Or&ccedil;amento') {
                    if (panel.items.length == 0) {
                        panel.add(orcamento);
                        panel.doLayout();
                    }
                }
                else if (panel.title == 'Itens do Or&ccedil;amento') {
                    if (Ext.getCmp('NUMERO_ORCAMENTO').getValue() > 0) {
                        TB_ITEM_ORCAMENTO_CARREGA_GRID();
                        ResetaFormulario_Item();
                    }

                    if (_novo_orcamento) {
                        TB_ITEM_ORCAMENTO_CARREGA_GRID();

                        _novo_orcamento = false;
                    }
                }
            }
        }
    });

    function Busca_Configuracao_Gerente() {
        Ext.getCmp('CODIGO_VENDEDOR').setValue(_ID_VENDEDOR);
        Ext.getCmp('CODIGO_VENDEDOR').disable();

        if (_ADMIN_USUARIO == 1 || _GERENTE_COMERCIAL == 1) {
            Ext.getCmp('CODIGO_VENDEDOR').enable();
        }
    }

    var TOTAIS = new Ext.form.Label({ id: 'totais', height: 36, html: AtualizaTotais() });

    TB_ITEM_ORCAMENTO_TABPANEL.items.items[0].add(formItemOrcamento);
    TB_ITEM_ORCAMENTO_TABPANEL.items.items[0].add(toolbar_TB_ITEM_ORCAMENTO);
    TB_ITEM_ORCAMENTO_TABPANEL.items.items[0].add(grid_ITEM_ORCAMENTO);
    TB_ITEM_ORCAMENTO_TABPANEL.items.items[0].add(TOTAIS);

    var orcamento = Monta_Orcamento();

    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();

    panelCadastroOrcamento.add(TB_ITEM_ORCAMENTO_TABPANEL);
    grid_ITEM_ORCAMENTO.setHeight(AlturaDoPainelDeConteudo(426));

    Busca_Configuracao_Gerente();

    return panelCadastroOrcamento;
}

function ResetaFormulario_Item() {
    var dt1 = new Date();

    dt1 = dt1.diaUtil();

    Ext.getCmp('ID_PRODUTO_ITEM_ORCAMENTO').setValue(0);
    Ext.getCmp('CODIGO_PRODUTO').reset();
    Ext.getCmp('DESCRICAO_PRODUTO_ITEM_ORCAMENTO').reset();
    Ext.getCmp('QTDE_PRODUTO').reset();
    Ext.getCmp('PRECO_PRODUTO').reset();
    Ext.getCmp('UNIDADE_PRODUTO').reset();
    Ext.getCmp('VALOR_TOTAL').reset();
    Ext.getCmp('VALOR_DESCONTO').getValue() == "" ? 0 : Ext.getCmp('VALOR_DESCONTO').reset();
    Ext.getCmp('TIPO_DESCONTO').reset();
    Ext.getCmp('ALIQ_ISS').reset();
    Ext.getCmp('VALOR_TOTAL').reset();
    Ext.getCmp('VALOR_ISS').reset();
    Ext.getCmp('OBS_ITEM_ORCAMENTO').reset();

    Ext.getCmp('DATA_ENTREGA').setValue(dt1);

    Ext.getCmp('BTN_DELETAR_TB_ITEM_ORCAMENTO').disable();

    Ext.getCmp('panelCadastroOrcamento').setTitle('Novo Or&ccedil;amento - Novo Item de Or&ccedil;amento');

    Ext.getCmp('CODIGO_PRODUTO').enable();

    Ext.getCmp('CODIGO_PRODUTO').focus();

    Ext.getCmp('BTN_ORIGEM_DESTINO').setText('Endere&ccedil;o de origem e destino <b>(VAZIO)</b>');
    Ext.getCmp('BTN_ORIGEM_DESTINO').setIcon('imagens/icones/entity_relation_delete_24.gif');

    _Origem_Destino_Servico.set_CEP_ORIGEM(_Origem_Destino_Servico.get_CEP_DESTINO());
    _Origem_Destino_Servico.set_CIDADE_ORIGEM(_Origem_Destino_Servico.get_CIDADE_DESTINO());
    _Origem_Destino_Servico.set_COMPLEMENTO_ORIGEM(_Origem_Destino_Servico.get_COMPLEMENTO_DESTINO());
    _Origem_Destino_Servico.set_ENDERECO_ORIGEM(_Origem_Destino_Servico.get_ENDERECO_DESTINO());
    _Origem_Destino_Servico.set_ESTADO_ORIGEM(_Origem_Destino_Servico.get_ESTADO_DESTINO());
    _Origem_Destino_Servico.set_NUMERO_ORIGEM(_Origem_Destino_Servico.get_NUMERO_DESTINO());

    _Origem_Destino_Servico.set_CEP_DESTINO('');
    _Origem_Destino_Servico.set_CIDADE_DESTINO('');
    _Origem_Destino_Servico.set_COMPLEMENTO_DESTINO('');
    _Origem_Destino_Servico.set_ENDERECO_DESTINO('');
    _Origem_Destino_Servico.set_ESTADO_DESTINO('');
    _Origem_Destino_Servico.set_NUMERO_DESTINO('');
}

function AtualizaTotais(response) {
    var HTMLTotais = "";
    var _totais = "";

    if (response) {
        var result = response.responseText ?
                                            Ext.decode(response.responseText).d :
                                            response;

        HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
            "<tr style='height: 15px;'>" +
                "<td align='right' style='color: #333333;'>Total dos Servi&ccedil;os</td>" +
                "<td align='right' style='color: #333333;'>Total de ISS</td>" +
                "<td align='right' style='color: #333333;'>Total do Or&ccedil;amento&nbsp;&nbsp;</td>" +
            "</tr>" +
            "<tr style='border:1px solid; height: 15px;'>" +
                "<td align='right'>" + result.VALOR_TOTAL + "</td>" +
                "<td align='right'>" + result.VALOR_ISS + "</td>" +
                "<td align='right'>" + result.TOTAL_ORCAMENTO + "&nbsp;&nbsp;</td>" +
            "</table>";
    }
    else {
        HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
            "<tr style='height: 15px;'>" +
                "<td align='right' style='color: #333333;'>Total dos Servi&ccedil;os</td>" +
                "<td align='right' style='color: #333333;'>Total de ISS</td>" +
                "<td align='right' style='color: #333333;'>Total do Or&ccedil;amento&nbsp;&nbsp;</td>" +
            "</tr>" +
            "<tr style='border:1px solid; height: 15px;'>" +
                "<td align='right'>" + "R$ 0,00" + "</td>" +
                "<td align='right'>" + "R$ 0,00" + "</td>" +
                "<td align='right'>" + "R$ 0,00" + "&nbsp;&nbsp;</td>" +
            "</table>";
    }

    // Se a div onde ficará totais ainda não tiver sido criada, retorno a tabela com valores zero, caso contrario atualizo os totais
    if (!Ext.getCmp("totais")) {
        return HTMLTotais;
    }
    else {
        return Ext.getCmp("totais").setText(HTMLTotais, false);
    }
}

// ---------FIM LABELS DE TOTAIS ----------

function Selecionar_Contato() {

    /////////////////////// Grid
    var TB_CLIENTE_CONTATO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'ID_CONTATO', 'NOME_CONTATO_CLIENTE', 'TELEFONE_CONTATO_CLIENTE', 'NOMEFANTASIA_CLIENTE',
            'EMAIL_CONTATO_CLIENTE', 'FRETE_CLIENTE', 'CODIGO_CP_CLIENTE', 'ESTADO', 'NOME_CLIENTE',
            'CNPJ_CLIENTE', 'ENDERECO', 'NUMERO', 'COMPLEMENTO', 'CEP', 'CIDADE', 'ESTADO_FATURA', 'OBS_CLIENTE', 'CODIGO_VENDEDOR_CLIENTE'])
    });

    function Popula_Contato(record) {
        Ext.getCmp('CONTATO_ORCAMENTO').setValue(record.data.NOME_CONTATO_CLIENTE.trim() + ' - ' +
                            record.data.NOMEFANTASIA_CLIENTE.trim());

        Ext.getCmp('TELEFONE_CONTATO').setValue(record.data.TELEFONE_CONTATO_CLIENTE.trim());
        Ext.getCmp('EMAIL_CONTATO').setValue(record.data.EMAIL_CONTATO_CLIENTE.trim());
        Ext.getCmp('CODIGO_COND_PAGTO').setValue(record.data.CODIGO_CP_CLIENTE);
        Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').setValue(record.data.ID_CLIENTE);

        Ext.getCmp('CODIGO_VENDEDOR').setValue(record.data.CODIGO_VENDEDOR_CLIENTE);
        Ext.getCmp('ID_UF_ORCAMENTO').setValue(record.data.ESTADO_FATURA);

        wBUSCA_TB_CLIENTE.hide();
        BTN_ORIGEM_DESTINO.focus();

        _Origem_Destino_Servico.formEnderecos().getForm().reset();

        _Origem_Destino_Servico.set_CEP_ORIGEM(record.data.CEP);
        _Origem_Destino_Servico.set_ENDERECO_ORIGEM(record.data.ENDERECO);
        _Origem_Destino_Servico.set_NUMERO_ORIGEM(record.data.NUMERO);
        _Origem_Destino_Servico.set_COMPLEMENTO_ORIGEM(record.data.COMPLEMENTO);
        _Origem_Destino_Servico.set_CIDADE_ORIGEM(record.data.CIDADE);
        _Origem_Destino_Servico.set_ESTADO_ORIGEM(record.data.ESTADO);
    }

    var gridTB_CLIENTE_CONTATO = new Ext.grid.GridPanel({
        store: TB_CLIENTE_CONTATO_Store,
        title: 'Contatos do Cliente',
        columns: [
            { id: 'ID_CLIENTE', header: 'ID Cliente', width: 80, sortable: true, dataIndex: 'ID_CLIENTE', hidden: true },
            { id: 'ID_CONTATO', header: "C&oacute;digo Contato", width: 100, sortable: true, dataIndex: 'ID_CONTATO', hidden: true },
            { id: 'NOMEFANTASIA_CLIENTE', header: 'Cliente', width: 170, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
            { id: 'NOME_CLIENTE', header: 'Raz&atilde;o Social', width: 350, sortable: true, dataIndex: 'NOME_CLIENTE' },
            { id: 'NOME_CONTATO_CLIENTE', header: "Nome", width: 170, sortable: true, dataIndex: 'NOME_CONTATO_CLIENTE' },
            { id: 'TELEFONE_CONTATO_CLIENTE', header: "Telefone", width: 110, sortable: true, dataIndex: 'TELEFONE_CONTATO_CLIENTE' },
            { id: 'CNPJ_CLIENTE', header: "CNPJ", width: 120, sortable: true, dataIndex: 'CNPJ_CLIENTE' },
            { id: 'ESTADO', header: "UF", width: 60, sortable: true, dataIndex: 'ESTADO' },
            { id: 'CIDADE', header: "Munic&iacute;pio", width: 170, sortable: true, dataIndex: 'CIDADE' },
            { id: 'EMAIL_CONTATO_CLIENTE', header: "e-mail", width: 210, sortable: true, dataIndex: 'EMAIL_CONTATO_CLIENTE' },
            { id: 'OBS_CLIENTE', header: "Obs. do Cliente", width: 450, sortable: true, dataIndex: 'OBS_CLIENTE' }
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

    var TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Nome do Contato / Cliente',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_CLIENTE_CARREGA_GRID();
        }
    });

    var TB_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    TB_CLIENTE_PagingToolbar.setUrl('servicos/TB_CLIENTE.asmx/ListaContatos_Vendas');
    TB_CLIENTE_PagingToolbar.setLinhasPorPagina(12);
    TB_CLIENTE_PagingToolbar.setStore(TB_CLIENTE_CONTATO_Store);

    function RetornaFiltros_TB_CLIENTE_JsonData() {
        var TB_CLIENTE_JsonData = {
            pesquisa: TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE.getValue(),
            ADMIN_USUARIO: _ADMIN_USUARIO,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_USUARIO: _ID_USUARIO,
            ID_VENDEDOR: _ID_VENDEDOR,
            start: 0,
            limit: TB_CLIENTE_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    function TB_CLIENTE_CARREGA_GRID() {
        TB_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_JsonData());
        TB_CLIENTE_PagingToolbar.doRequest();
    }

    var wBUSCA_TB_CLIENTE = new Ext.Window({
        layout: 'form',
        title: 'Busca',
        iconCls: 'icone_TB_CLIENTE',
        width: 950,
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
            }
        },
        items: [gridTB_CLIENTE_CONTATO, TB_CLIENTE_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .50,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 160,
                items: [TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE]
            }, {
                columnWidth: .20,
                items: [TB_CLIENTE_BTN_PESQUISA]
            }]
        }]
    });

    this.show = function (elm) {
        wBUSCA_TB_CLIENTE.show(elm);
    };

    Ext.onReady(function () {
        TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE.focus();
    });
}

function Habilita_UF(h) {
    if (h)
        Ext.getCmp('ID_UF_ORCAMENTO').enable();
    else
        Ext.getCmp('ID_UF_ORCAMENTO').disable();
}

function wParcelasOrcamento() {
    var _NUMERO_ORCAMENTO;

    this.NUMERO_ORCAMENTO = function (pNUMERO_ORCAMENTO) {
        _NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;
    };

    var PARCELAS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['VENCIMENTO', 'DIA', 'VALOR']
       )
    });

    var gridPARCELAS = new Ext.grid.GridPanel({
        store: PARCELAS_Store,
        columns: [
        { id: 'VENCIMENTO', header: "Vencimento", width: 100, sortable: true, dataIndex: 'VENCIMENTO', renderer: XMLParseDate },
        { id: 'DIA', header: "Dia da Semana", width: 110, sortable: true, dataIndex: 'DIA' },
        { id: 'VALOR', header: "Valor da Parcela", width: 130, sortable: true, dataIndex: 'VALOR', renderer: FormataValor }
    ],
        stripeRows: true,
        height: 380,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var wParcelas = new Ext.Window({
        renderTo: Ext.getBody(),
        title: 'Parcelas Or&ccedil;amento',
        iconCls: 'icone_TB_NOTA_SAIDA_VENCIMENTOS',
        width: 350,
        height: 360,
        modal: true,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        items: [gridPARCELAS],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elem) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Monta_Vencimentos_ORCAMENTO');
        _ajax.setJsonData({ NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            PARCELAS_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();

        wParcelas.show(elem);
    };
}

function Origem_Destino_Servico() {

    var TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o (F8)',
        allowBlank: false,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430,
        enableKeyEvents: true,
        listeners: {
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {
                    pesquisaEndereco(1, f.getValue());
                }

                if (e.getKey() == e.DOWN) {
                    GRID_ENDERECOS.getSelectionModel().selectRow(0);
                    GRID_ENDERECOS.getView().focusRow(0);
                }
            }
        }
    });

    var TXT_NUMERO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Numero',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPL_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_INICIAL_ITEM_ORCAMENTO = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        allowBlank: false,
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_CIDADE_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Munic&iacute;pio',
        width: 250,
        maxlength: 50,
        autoCreate: { tag: 'input', type: 'text', maxlength: 50 },
        allowBlank: false,
        value: 'SAO PAULO'
    });

    var TXT_ESTADO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Estado',
        allowBlank: false,
        maxLength: 2,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 2 },
        width: 50,
        value: 'SP'
    });

    var TXT_ENDERECO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o (F8)',
        allowBlank: false,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430,
        enableKeyEvents: true,
        listeners: {
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {
                    pesquisaEndereco(2, f.getValue());
                }

                if (e.getKey() == e.DOWN) {
                    GRID_ENDERECOS.getSelectionModel().selectRow(0);
                    GRID_ENDERECOS.getView().focusRow(0);
                }
            }
        }
    });

    var TXT_NUMERO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Numero',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPL_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_FINAL_ITEM_ORCAMENTO = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        allowBlank: false,
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_CIDADE_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Munic&iacute;pio',
        width: 250,
        maxlength: 50,
        autoCreate: { tag: 'input', type: 'text', maxlength: 50 },
        allowBlank: false,
        value: 'SAO PAULO'
    });

    var TXT_ESTADO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Estado',
        allowBlank: false,
        maxLength: 2,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 2 },
        width: 50,
        value: 'SP'
    });

    var fs1 = new Ext.form.FieldSet({
        title: 'Endere&ccedil;o de origem',
        checkboxToggle: false,
        collapsible: false,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        items: [{
            layout: 'form',
            items: [TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [TXT_NUMERO_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_COMPL_INICIAL_ITEM_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_CEP_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .60,
                layout: 'form',
                items: [TXT_CIDADE_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ESTADO_INICIAL_ITEM_ORCAMENTO]
            }]
        }]
    });

    var fs2 = new Ext.form.FieldSet({
        title: 'Endere&ccedil;o de destino',
        checkboxToggle: false,
        collapsible: false,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        items: [{
            layout: 'form',
            items: [TXT_ENDERECO_FINAL_ITEM_ORCAMENTO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [TXT_NUMERO_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_COMPL_FINAL_ITEM_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_CEP_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .60,
                layout: 'form',
                items: [TXT_CIDADE_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ESTADO_FINAL_ITEM_ORCAMENTO]
            }]
        }]
    });

    var form1 = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [fs1]
            }, {
                columnWidth: .50,
                items: [fs2]
            }]
        }],
        bbar: [{
            text: 'Inverter endere&ccedil;os',
            icon: 'imagens/icones/merge_cells_16.gif',
            scale: 'medium',
            handler: function (btn) {
                var cepInicial = TXT_CEP_INICIAL_ITEM_ORCAMENTO.getValue();
                var enderecoInicial = TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.getValue();
                var numeroInicial = TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.getValue();
                var complInicial = TXT_COMPL_INICIAL_ITEM_ORCAMENTO.getValue();
                var cidadeInicial = TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue();
                var estadoInicial = TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue();

                TXT_CEP_INICIAL_ITEM_ORCAMENTO.setValue(TXT_CEP_FINAL_ITEM_ORCAMENTO.getValue());
                TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.setValue(TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.getValue());
                TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.setValue(TXT_NUMERO_FINAL_ITEM_ORCAMENTO.getValue());
                TXT_COMPL_INICIAL_ITEM_ORCAMENTO.setValue(TXT_COMPL_FINAL_ITEM_ORCAMENTO.getValue());
                TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.setValue(TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue());
                TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.setValue(TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue());

                TXT_CEP_FINAL_ITEM_ORCAMENTO.setValue(cepInicial);
                TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.setValue(enderecoInicial);
                TXT_NUMERO_FINAL_ITEM_ORCAMENTO.setValue(numeroInicial);
                TXT_COMPL_FINAL_ITEM_ORCAMENTO.setValue(complInicial);
                TXT_CIDADE_FINAL_ITEM_ORCAMENTO.setValue(cidadeInicial);
                TXT_ESTADO_FINAL_ITEM_ORCAMENTO.setValue(estadoInicial);
            }
        }, Spacers(398), {
            text: 'Ok',
            icon: 'imagens/icones/ok_16.gif',
            scale: 'medium',
            handler: function (btn) {
                if (!form1.getForm().isValid()) {
                    dialog.MensagemDeErro('Preencha todos os campos em vermelho', btn.getId());
                    return;
                }

                // RUA LISBOA, 69, Sao Paulo - SP, 05413-000
                var enderecoOrigem = TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ' - ' +
                            TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CEP_INICIAL_ITEM_ORCAMENTO.getValue().trim();

                var enderecoDestino = TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_NUMERO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue().trim() + ' - ' +
                            TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CEP_FINAL_ITEM_ORCAMENTO.getValue().trim();

                var gm = new google_maps();
                gm.ENDERECO_ORIGEM(enderecoOrigem);
                gm.ENDERECO_DESTINO(enderecoDestino);

                var _SUCESSO_MAPS = function SUCESSO(distancia, tempo, txt_distancia, txt_tempo, atencao, resumo) {
                    try {
                        _acaoPreencheDistancia(distancia, tempo, atencao, resumo);
                    }
                    catch (e) {
                        dialog.MensagemDeErro('N&atilde;o foi poss&iacute;vel obter a dist&acirc;ncia entre os 2 endere&ccedil;os pelo <b>google maps</b>', btn.getId());
                    }
                };

                gm.set_SUCESSO(_SUCESSO_MAPS);

                gm.CALCULA_ROTA();

                _button.setText('Endere&ccedil;o de origem e destino <b>(PREENCHIDO)</b>');
                _button.setIcon('imagens/icones/entity_relation_Ok_24.gif');

                wJanela.hide();
            }
        }]
    });

    var Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
             ['ENDERECO_INICIAL_ITEM_ORCAMENTO', 'NUMERO_INICIAL_ITEM_ORCAMENTO', 'COMPL_INICIAL_ITEM_ORCAMENTO', 'CIDADE_INICIAL_ITEM_ORCAMENTO',
              'CEP_INICIAL_ITEM_ORCAMENTO', 'ESTADO_INICIAL_ITEM_ORCAMENTO'])
    });

    var opcaoBusca = 1;

    var GRID_ENDERECOS = new Ext.grid.GridPanel({
        store: Store1,
        title: 'Sugest&atilde;o de endere&ccedil;os',
        columns: [
                { id: 'ENDERECO_INICIAL_ITEM_ORCAMENTO', header: "Endere&ccedil;o", width: 350, sortable: true, dataIndex: 'ENDERECO_INICIAL_ITEM_ORCAMENTO' },
                { id: 'NUMERO_INICIAL_ITEM_ORCAMENTO', header: "N&ordm;", width: 80, sortable: true, dataIndex: 'NUMERO_INICIAL_ITEM_ORCAMENTO' },
                { id: 'COMPL_INICIAL_ITEM_ORCAMENTO', header: "Compl.", width: 110, sortable: true, dataIndex: 'COMPL_INICIAL_ITEM_ORCAMENTO' },
                { id: 'CEP_INICIAL_ITEM_ORCAMENTO', header: "CEP", width: 80, sortable: true, dataIndex: 'CEP_INICIAL_ITEM_ORCAMENTO' },
                { id: 'CIDADE_INICIAL_ITEM_ORCAMENTO', header: "Munic&iacute;pio", width: 200, sortable: true, dataIndex: 'CIDADE_INICIAL_ITEM_ORCAMENTO' },
                { id: 'ESTADO_INICIAL_ITEM_ORCAMENTO', header: "UF", width: 50, sortable: true, dataIndex: 'ESTADO_INICIAL_ITEM_ORCAMENTO', align: 'center' }
            ],
        stripeRows: true,
        width: '100%',
        height: 200,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                if (opcaoBusca == 1) {
                    TXT_CEP_INICIAL_ITEM_ORCAMENTO.setValue(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
                    TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
                    TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
                    TXT_COMPL_INICIAL_ITEM_ORCAMENTO.setValue(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);

                    if (TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue().length == 0)
                        TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.setValue(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);

                    if (TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue().length == 0)
                        TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);

                    TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.focus();
                }
                else {
                    TXT_CEP_FINAL_ITEM_ORCAMENTO.setValue(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
                    TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.setValue(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
                    TXT_NUMERO_FINAL_ITEM_ORCAMENTO.setValue(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
                    TXT_COMPL_FINAL_ITEM_ORCAMENTO.setValue(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);

                    if (TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue().length == 0)
                        TXT_CIDADE_FINAL_ITEM_ORCAMENTO.setValue(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);

                    if (TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue().length == 0)
                        TXT_ESTADO_FINAL_ITEM_ORCAMENTO.setValue(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);

                    TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.focus();
                }
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (GRID_ENDERECOS.getSelectionModel().getSelections().length > 0) {
                        var record = GRID_ENDERECOS.getSelectionModel().getSelected();
                        if (opcaoBusca == 1) {
                            TXT_CEP_INICIAL_ITEM_ORCAMENTO.setValue(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
                            TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
                            TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
                            TXT_COMPL_INICIAL_ITEM_ORCAMENTO.setValue(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);

                            if (TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue().length == 0)
                                TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.setValue(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);

                            if (TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue().length == 0)
                                TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.setValue(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);

                            TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.focus();
                        }
                        else {
                            TXT_CEP_FINAL_ITEM_ORCAMENTO.setValue(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
                            TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.setValue(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
                            TXT_NUMERO_FINAL_ITEM_ORCAMENTO.setValue(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
                            TXT_COMPL_FINAL_ITEM_ORCAMENTO.setValue(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);

                            if (TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue().length == 0)
                                TXT_CIDADE_FINAL_ITEM_ORCAMENTO.setValue(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);

                            if (TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue().length == 0)
                                TXT_ESTADO_FINAL_ITEM_ORCAMENTO.setValue(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);

                            TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.focus();
                        }
                    }
                }
            }
        }
    });

    var wJanela = new Ext.Window({
        layout: 'form',
        title: 'Informe o endere&ccedil;o de origem e destino do servi&ccedil;o',
        width: 1010,
        height: 479,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [form1, GRID_ENDERECOS]
    });

    function pesquisaEndereco(InicialFinal, digitos) {
        opcaoBusca = InicialFinal;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(InicialFinal == 1 ? 'servicos/TB_ORCAMENTO_VENDA.asmx/listaEnderecoInicial' : 'servicos/TB_ORCAMENTO_VENDA.asmx/listaEnderecoFinal');

        _ajax.setJsonData({
            RUA: digitos,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    };

    this.grid = function () {
        return GRID_ENDERECOS;
    };

    var _acaoPreencheDistancia;

    this.acaoPreencheDistancia = function (pValue) {
        _acaoPreencheDistancia = pValue;
    };

    this.get_ENDERECO_ORIGEM = function () {
        return TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_NUMERO_ORIGEM = function () {
        return TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_COMPLEMENTO_ORIGEM = function () {
        return TXT_COMPL_INICIAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_CEP_ORIGEM = function () {
        return TXT_CEP_INICIAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_CIDADE_ORIGEM = function () {
        return TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_ESTADO_ORIGEM = function () {
        return TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue();
    };


    this.get_ENDERECO_DESTINO = function () {
        return TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_NUMERO_DESTINO = function () {
        return TXT_NUMERO_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_COMPLEMENTO_DESTINO = function () {
        return TXT_COMPL_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_CEP_DESTINO = function () {
        return TXT_CEP_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_CIDADE_DESTINO = function () {
        return TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.get_ESTADO_DESTINO = function () {
        return TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue();
    };

    this.formEnderecos = function () {
        return form1;
    };

    ///

    this.set_ENDERECO_ORIGEM = function (pValue) {
        TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_NUMERO_ORIGEM = function (pValue) {
        return TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_COMPLEMENTO_ORIGEM = function (pValue) {
        return TXT_COMPL_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CEP_ORIGEM = function (pValue) {
        return TXT_CEP_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CIDADE_ORIGEM = function (pValue) {
        return TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_ESTADO_ORIGEM = function (pValue) {
        return TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };


    this.set_ENDERECO_DESTINO = function (pValue) {
        TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_NUMERO_DESTINO = function (pValue) {
        return TXT_NUMERO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_COMPLEMENTO_DESTINO = function (pValue) {
        return TXT_COMPL_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CEP_DESTINO = function (pValue) {
        return TXT_CEP_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CIDADE_DESTINO = function (pValue) {
        return TXT_CIDADE_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_ESTADO_DESTINO = function (pValue) {
        return TXT_ESTADO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    var _button;

    this.button = function (pValue) {
        _button = pValue;
    };

    this.show = function (elm) {
        wJanela.show(elm.getId());
    };
}