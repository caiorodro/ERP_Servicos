function MontaCotacaoCompra() {
    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Nr. Cota&ccedil;&atilde;o',
        id: 'NUMERO_PEDIDO_COMPRA',
        name: 'NUMERO_PEDIDO_COMPRA',
        width: 90,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.isValid()) {
                        Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA1').setValue(f.getValue());
                        ITEM_COTACAO_CARREGA_GRID();
                    }
                }
            }
        }
    });

    var HDF_NUMERO_PEDIDO_COMPRA = new Ext.form.Hidden({
        id: 'HDF_NUMERO_PEDIDO_COMPRA1',
        name: 'HDF_NUMERO_PEDIDO_COMPRA1',
        value: 0
    });

    var HDF_NUMERO_ITEM_COMPRA = new Ext.form.Hidden({
        id: 'HDF_NUMERO_ITEM_COMPRA1',
        name: 'HDF_NUMERO_ITEM_COMPRA1',
        value: 0
    });

    var ID_PRODUTO = new Ext.form.Hidden({
        id: 'ID_PRODUTO_1',
        value: 0
    });

    var TXT_COD_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 180,
        maxLegth: 25,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (fsBuscaProduto.collapsed && f.getValue().trim().length == 0)
                        fsBuscaProduto.expand();
                }
            }
        }
    });

    var TXT_DESCRICAO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do Produto',
        width: 400,
        maxLegth: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '50' }
    });

    var TXT_UNIDADE_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Un.',
        width: 30,
        maxLength: 2,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '2' }
    });

    var TXT_QTDE_ITEM_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        width: 90,
        maxLength: 20,
        allowBlank: false,
        decimalPrecision: 3,
        decimalSeparator: ',',
        minValue: 0.001,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_COTACAO();
                }
            }
        }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, 1);

    var TXT_PREVISAO_ENTREGA_ITEM_COMPRA = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data de Entrega',
        allowBlank: false,
        value: dt1,
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_COTACAO();
                }
            }
        }
    });

    TB_COND_PAGTO_CARREGA_COMBO();

    var CB_CODIGO_COND_PAGTO = new Ext.form.ComboBox({
        store: combo_TB_COND_PAGTO_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 355,
        allowBlank: false,
        style: { borderStyle: 'solid', borderWidth: '1px', borderColor: '#cc9900' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados_COTACAO();
                }
            }
        }
    });

    var OBS_ITEM_COMPRA = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&atilde;o do Item',
        anchor: '95%',
        height: 70,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    // -------------- BUSCA DE PRODUTOS ----------------------
    var TXT_PESQUISA_DESCRICAO_PRODUTO = new Ext.form.TextField({
        width: 320,
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

    var fsBuscaProduto = new Ext.form.FieldSet({
        title: 'Busca de Produtos',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                TXT_PESQUISA_DESCRICAO_PRODUTO.focus();
                Ext.getCmp('formItemCompra').setHeight(346);
            },
            collapse: function (f) {
                Ext.getCmp('formItemCompra').setHeight(240);
            }
        }
    });

    var Store_PESQUISA_PRODUTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'PRECO_PRODUTO', 'ALIQ_IPI_PRODUTO', 'UNIDADE_MEDIDA_VENDA',
         'MARKUP_PRODUTO', 'MARGEM_MINIMA_PRODUTO', 'CLAS_FISCAL_PRODUTO', 'SIT_TRIB_PRODUTO', 'ICMS_DIF_PRODUTO',
         'SALDO_ESTOQUE'])
    });

    var GRID_PESQUISA_PRODUTO = new Ext.grid.GridPanel({
        store: Store_PESQUISA_PRODUTO,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;ão", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'SALDO_ESTOQUE', header: "Estoque", width: 100, sortable: true, dataIndex: 'SALDO_ESTOQUE' },
                { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o de Venda", width: 100, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4 },
                { id: 'MARKUP_PRODUTO', header: "% Markup", width: 90, sortable: true, dataIndex: 'MARKUP_PRODUTO', renderer: FormataPercentual },
                { id: 'MARGEM_MINIMA_PRODUTO', header: "Margem M&iacute;nima", width: 90, sortable: true, dataIndex: 'MARGEM_MINIMA_PRODUTO', renderer: FormataPercentual },
                { id: 'CLAS_FISCAL_PRODUTO', header: "Clas.Fiscal", width: 90, sortable: true, dataIndex: 'CLAS_FISCAL_PRODUTO' },
                { id: 'SIT_TRIB_PRODUTO', header: "Sit.Trib.", width: 70, sortable: true, dataIndex: 'SIT_TRIB_PRODUTO' },
                { id: 'ICMS_DIF_PRODUTO', header: "% ICMS Dif.", width: 80, sortable: true, dataIndex: 'ICMS_DIF_PRODUTO' },
                { id: 'ALIQ_IPI_PRODUTO', header: "Al&iacute;q. IPI", width: 70, sortable: true, dataIndex: 'ALIQ_IPI_PRODUTO', renderer: FormataPercentual },
                { id: 'UNIDADE_MEDIDA_VENDA', header: "Unidade", width: 60, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' }
            ],
        stripeRows: true,
        width: '100%',
        height: 130,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposProduto(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (GRID_PESQUISA_PRODUTO.getSelectionModel().getSelections().length > 0) {
                        var record = GRID_PESQUISA_PRODUTO.getSelectionModel().getSelected();
                        PopulaCamposProduto(record);
                    }
                }
            }
        }
    });

    function PopulaCamposProduto(record) {
        ID_PRODUTO.setValue(record.data.ID_PRODUTO);
        TXT_COD_PRODUTO.setValue(record.data.CODIGO_PRODUTO);
        TXT_DESCRICAO_PRODUTO.setValue(record.data.DESCRICAO_PRODUTO);
        TXT_UNIDADE_COMPRA.setValue(record.data.UNIDADE_MEDIDA_VENDA);

        fsBuscaProduto.collapse();
        TXT_QTDE_ITEM_COMPRA.focus();
    }

    function RetornaFiltros_TB_PRODUTO_JsonData() {
        var _pesquisa = TXT_PESQUISA_DESCRICAO_PRODUTO ?
                            TXT_PESQUISA_DESCRICAO_PRODUTO.getValue() : '';

        var TB_PRODUTO_JsonData = {
            Pesquisa: _pesquisa,
            start: 0,
            ID_USUARIO: _ID_USUARIO,
            limit: TB_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    var TB_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_PRODUTO_PagingToolbar.setUrl('servicos/TB_PRODUTO.asmx/Lista_TB_PRODUTO');
    TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
    TB_PRODUTO_PagingToolbar.setStore(Store_PESQUISA_PRODUTO);

    function Carrega_Busca_TB_PRODUTO() {
        TB_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PRODUTO_JsonData());
        TB_PRODUTO_PagingToolbar.doRequest();
    }

    fsBuscaProduto.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Descrição do Produto:'
            }, {
                columnWidth: .31,
                items: [TXT_PESQUISA_DESCRICAO_PRODUTO]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [BTN_PESQUISA_PRODUTO]
            }]
        }, GRID_PESQUISA_PRODUTO, TB_PRODUTO_PagingToolbar.PagingToolbar()]
    });
    // -------------- FIM BUSCA DE PRODUTOS ----------------------

    var formItemCompra = new Ext.form.FormPanel({
        id: 'formItemCompra',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        height: 210,
        items: [HDF_NUMERO_ITEM_COMPRA, ID_PRODUTO, {
            layout: 'form',
            items: [TXT_NUMERO_PEDIDO_COMPRA]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: 0.20,
                items: [TXT_COD_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: 0.50,
                items: [TXT_DESCRICAO_PRODUTO]
            }]
        }, {
            layout: 'form',
            items: [fsBuscaProduto]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .10,
                items: [TXT_QTDE_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: .06,
                items: [TXT_UNIDADE_COMPRA]
            }, {
                layout: 'form',
                columnWidth: .12,
                items: [TXT_PREVISAO_ENTREGA_ITEM_COMPRA]
            }, {
                layout: 'form',
                columnWidth: .33,
                items: [CB_CODIGO_COND_PAGTO]
            }, {
                layout: 'form',
                columnWidth: .39,
                items: [OBS_ITEM_COMPRA]

            }]
        }]
    });

    ///////////////////////

    var buttonGroup_ITEM_COTACAO = new Ext.ButtonGroup({
        id: 'buttonGroup_ITEM_COTACAO',
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_COTACAO();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Novo Item de Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                Novo_Item();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_DELETAR_TB_COTACAO',
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'medium',
            disabled: true,
            handler: function () {
                Deleta_ITEM_COTACAO();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Nova Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                Novo_Item(true);
            }
        }
]

    });

    var toolbar_ITEM_COTACAO = new Ext.Toolbar({
        style: 'text-align: right; width: 100%;',
        items: [buttonGroup_ITEM_COTACAO]
    });

    ////////////////////

    var COTACAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
                            ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'ID_PRODUTO_COMPRA', 'CODIGO_PRODUTO',
                            'DESCRICAO_PRODUTO', 'QTDE_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA',
                            'CODIGO_COND_PAGTO', 'OBS_ITEM_COMPRA', 'COTACAO_ENVIADA', 'ENTREGA_CLIENTE']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var grid_COTACAO = new Ext.grid.GridPanel({
        store: COTACAO_Store,
        columns: [
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 380, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
                { id: 'QTDE_ITEM_COMPRA', header: "Qtde", width: 100, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde, align: 'center' },
                { id: 'UNIDADE_ITEM_COMPRA', header: "Un", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA' },
                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 90, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
                { id: 'ENTREGA_CLIENTE', header: "Entrega (Cliente)", width: 115, sortable: true, dataIndex: 'ENTREGA_CLIENTE', renderer: XMLParseDate, align: 'center' },
                { id: 'OBS_ITEM_COMPRA', header: "Obs. Item", width: 600, sortable: true, dataIndex: 'OBS_ITEM_COMPRA' }
                ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormulario_COTACAO(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (grid_COTACAO.getSelectionModel().getSelections().length > 0) {
                        var record = grid_COTACAO.getSelectionModel().getSelected();
                        PopulaFormulario_COTACAO(record);
                    }
                }
            }
        }
    });

    function RetornaITEM_ORC_JsonData() {
        var _orcamento = Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA1').getValue() == '' ? 0
                                        : Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA1').getValue();

        _orcamento = _orcamento == undefined ? 0 : _orcamento;

        var CP_JsonData = {
            NUMERO_PEDIDO_COMPRA: _orcamento,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CP_JsonData;
    }

    var ITEM_COTACAO_PagingToolbar = new Th2_PagingToolbar();
    ITEM_COTACAO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Compra');
    ITEM_COTACAO_PagingToolbar.setStore(COTACAO_Store);
    ITEM_COTACAO_PagingToolbar.carregarSempreUltimaPagina(true);

    var _failure = function (response, options) {
        Ext.getCmp('HDF_NUMERO_PEDIDO_COMPRA1').setValue(0);
    };

    ITEM_COTACAO_PagingToolbar.setFalha(_failure);

    function ITEM_COTACAO_CARREGA_GRID(_utlimaPagina) {
        ITEM_COTACAO_PagingToolbar.setParamsJsonData(RetornaITEM_ORC_JsonData());
        ITEM_COTACAO_PagingToolbar.doRequest();
    }

    function PopulaFormulario_COTACAO(record) {
        if (record.data.COTACAO_ENVIADA == 1) {
            dialog.MensagemDeErro('Este item n&atilde;o pode ser alterado, a cota&ccedil;&atilde;o já foi enviada ao fornecedor', grid_COTACAO.getId());
            return;
        }

        HDF_NUMERO_ITEM_COMPRA.setValue(record.data.NUMERO_ITEM_COMPRA);
        ID_PRODUTO.setValue(record.data.ID_PRODUTO_COMPRA);
        TXT_COD_PRODUTO.setValue(record.data.CODIGO_PRODUTO);
        TXT_DESCRICAO_PRODUTO.setValue(record.data.DESCRICAO_PRODUTO);
        TXT_QTDE_ITEM_COMPRA.setValue(record.data.QTDE_ITEM_COMPRA);
        TXT_UNIDADE_COMPRA.setValue(record.data.UNIDADE_ITEM_COMPRA);
        CB_CODIGO_COND_PAGTO.setValue(record.data.CODIGO_COND_PAGTO);
        TXT_PREVISAO_ENTREGA_ITEM_COMPRA.setRawValue(XMLParseDate(record.data.PREVISAO_ENTREGA_ITEM_COMPRA));
        OBS_ITEM_COMPRA.setValue(record.data.OBS_ITEM_COMPRA);

        pCotacao.setTitle("Alterar Item de Cota&ccedil;&atilde;o");

        if (record.data.COTACAO_ENVIADA == 0)
            Ext.getCmp('BTN_DELETAR_TB_COTACAO').enable();

        TXT_QTDE_ITEM_COMPRA.focus();
    }

    function Novo_Item(novo) {
        ResetaFormulario(novo);
        pCotacao.setTitle("Novo Item de Cota&ccedil;&atilde;o");

        TXT_COD_PRODUTO.enable();
        TXT_DESCRICAO_PRODUTO.enable();
        fsBuscaProduto.enable();

        Ext.getCmp('BTN_DELETAR_TB_COTACAO').disable();

        TXT_COD_PRODUTO.focus();
    }
    ///////////////////

    function GravaDados_COTACAO() {
        if (!formItemCompra.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_PEDIDO_COMPRA: HDF_NUMERO_PEDIDO_COMPRA.getValue() == "" ? 0 : HDF_NUMERO_PEDIDO_COMPRA.getValue(),
            NUMERO_ITEM_COMPRA: HDF_NUMERO_ITEM_COMPRA.getValue() == "" ? 0 : HDF_NUMERO_ITEM_COMPRA.getValue(),
            ID_PRODUTO_COMPRA: ID_PRODUTO.getValue(),
            ID_PRODUTO: ID_PRODUTO.getValue(),
            CODIGO_COMPLEMENTO_PRODUTO_COMPRA: 0,
            CODIGO_COMPLEMENTO_PRODUTO: 0,
            UNIDADE_ITEM_COMPRA: TXT_UNIDADE_COMPRA.getValue(),
            QTDE_ITEM_COMPRA: TXT_QTDE_ITEM_COMPRA.getValue(),
            TIPO_DESCONTO_ITEM_COMPRA: 0,
            VALOR_DESCONTO_ITEM_COMPRA: 0,
            PRECO_ITEM_COMPRA: 0,
            VALOR_TOTAL_ITEM_COMPRA: 0,
            ALIQ_ICMS_ITEM_COMPRA: 0,
            BASE_ICMS_ITEM_COMPRA: 0,
            VALOR_ICMS_ITEM_COMPRA: 0,
            BASE_ICMS_ST_ITEM_COMPRA: 0,
            VALOR_ICMS_ST_ITEM_COMPRA: 0,
            ALIQ_IPI_ITEM_COMPRA: 0,
            VALOR_IPI_ITEM_COMPRA: 0,
            CODIGO_CFOP_ITEM_COMPRA: '',
            CODIGO_FORNECEDOR_ITEM_COMPRA: '',
            NUMERO_LOTE_ITEM_COMPRA: '',
            OBS_ITEM_COMPRA: OBS_ITEM_COMPRA.getValue(),
            PREVISAO_ENTREGA_ITEM_COMPRA: TXT_PREVISAO_ENTREGA_ITEM_COMPRA.getRawValue(),
            ENTREGA_EFETIVA_ITEM_COMPRA: TXT_PREVISAO_ENTREGA_ITEM_COMPRA.getRawValue(),
            CODIGO_COND_PAGTO: CB_CODIGO_COND_PAGTO.getValue(),
            CODIGO_FORNECEDOR: 0,
            CONTATO_COTACAO_FORNECEDOR: '',
            EMAIL_COTACAO_FORNECEDOR: '',
            TELEFONE_COTACAO_FORNECEDOR: '',
            FRETE_COTACAO_FORNECEDOR: 0,
            VALOR_FRETE_COTACAO_FORNECEDOR: 0,
            ID_UF_COTACAO_FORNECEDOR: 0,
            CODIGO_CP_COTACAO_FORNECEDOR: CB_CODIGO_COND_PAGTO.getValue(),
            COTACAO_ENVIADA: 0,
            COTACAO_RESPONDIDA: 0,
            IVA_COTACAO_FORNECEDOR: 0,
            COTACAO_VENCEDORA: 0,
            PRECO_RESERVA: 0,
            ID_USUARIO: _ID_USUARIO
        };

        var url = pCotacao.title == "Novo Item de Cota&ccedil;&atilde;o" ?
                            'servicos/TB_PEDIDO_COMPRA.asmx/GravaNovoItem' :
                            'servicos/TB_PEDIDO_COMPRA.asmx/AtualizaItem';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(url);
        _ajax.setJsonData({ dados: dados });

        var _sucesso = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TXT_COD_PRODUTO.focus();

            if (pCotacao.title == "Novo Item de Cota&ccedil;&atilde;o") {
                ResetaFormulario(false);

                if (result > 0) {
                    HDF_NUMERO_PEDIDO_COMPRA.setValue(result);
                    TXT_NUMERO_PEDIDO_COMPRA.setValue(result);
                }

                ITEM_COTACAO_CARREGA_GRID();
            }
            else {
                ITEM_COTACAO_PagingToolbar.CarregaPaginaAtual();
            }
        };

        _ajax.setSucesso(_sucesso);
        _ajax.Request();
    }

    function ResetaFormulario(novo) {
        if (novo) {
            TXT_NUMERO_PEDIDO_COMPRA.reset();
            HDF_NUMERO_PEDIDO_COMPRA.setValue(0);
            HDF_NUMERO_ITEM_COMPRA.setValue(0);

            grid_COTACAO.getStore().removeAll();
        }

        TXT_COD_PRODUTO.reset();
        TXT_DESCRICAO_PRODUTO.reset();
        TXT_QTDE_ITEM_COMPRA.reset();
        TXT_UNIDADE_COMPRA.reset();
        OBS_ITEM_COMPRA.reset();
    }

    function Deleta_ITEM_COTACAO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este item da Cota&ccedil;&atilde;o?', 'BTN_DELETAR_TB_COTACAO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/DeletaItem');

                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: HDF_NUMERO_PEDIDO_COMPRA.getValue(),
                    NUMERO_ITEM_COMPRA: HDF_NUMERO_ITEM_COMPRA.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    ITEM_COTACAO_PagingToolbar.CarregaPaginaAtual();

                    Novo_Item();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var pCotacao = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Item de Cota&ccedil;&atilde;o',
        items: [formItemCompra, toolbar_ITEM_COTACAO, grid_COTACAO,
                        ITEM_COTACAO_PagingToolbar.PagingToolbar()]
    });

    grid_COTACAO.setHeight(AlturaDoPainelDeConteudo(393));

    this.PainelCotacao = function () {
        return pCotacao;
    }
}