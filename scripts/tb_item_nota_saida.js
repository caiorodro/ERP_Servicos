function Monta_Nota_Saida_Itens() {

    var _codigoProdutoAtual = '';

    var TXT_CODIGO_PRODUTO_ITEM_NF = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        name: 'CODIGO_PRODUTO_ITEM_NF',
        id: 'CODIGO_PRODUTO_ITEM_NF',
        width: 170,
        maxLength: 25,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true
    });

    function Busca_Dados_Produto(CODIGO_PRODUTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/Busca_Dados_Produto');

        _ajax.setJsonData({
            CODIGO_PRODUTO: CODIGO_PRODUTO,
            ID_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_NF').getValue(),
            ID_EMITENTE: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            H_ID_PRODUTO.setValue(result.ID_PRODUTO);

            Ext.getCmp('CODIGO_PRODUTO_ITEM_NF').setValue(result.CODIGO_PRODUTO);

            if (result.DESCRICAO_PRODUTO_NF.length > 0)
                Ext.getCmp('DESCRICAO_PRODUTO_ITEM_NF').setValue(result.DESCRICAO_PRODUTO_NF);
            else
                Ext.getCmp('DESCRICAO_PRODUTO_ITEM_NF').setValue(result.DESCRICAO_PRODUTO);

            Ext.getCmp('UNIDADE_MEDIDA_ITEM_NF').setValue(result.UNIDADE_MEDIDA_VENDA);
            Ext.getCmp('VALOR_UNITARIO_ITEM_NF').setValue(result.PRECO_PRODUTO);

            TXT_ALIQ_ISS_ITEM_NF.setValue(result.ALIQ_ISS);

            if (Ext.getCmp('QTDE_ITEM_NF').getValue() > 0)
                CalculaTotalItem();

            if (Ext.getCmp('TXT_UP_CODIGO_PRODUTO'))
                Ext.getCmp('TXT_UP_CODIGO_PRODUTO').setValue(result.CODIGO_PRODUTO);

            Ext.getCmp('QTDE_ITEM_NF').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    TXT_CODIGO_PRODUTO_ITEM_NF.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            Busca_Dados_Produto(f.getValue());
        }
    });

    var TXT_DESCRICAO_PRODUTO_ITEM_NF = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o do Produto',
        name: 'DESCRICAO_PRODUTO_ITEM_NF',
        id: 'DESCRICAO_PRODUTO_ITEM_NF',
        width: 360
    });

    var TXT_SEQUENCIA_ITEM_NF = new Ext.form.Hidden({
        name: 'SEQUENCIA_ITEM_NF',
        id: 'SEQUENCIA_ITEM_NF'
    });

    var H_ID_PRODUTO = new Ext.form.Hidden();

    var TXT_UNIDADE_MEDIDA_ITEM_NF = new Ext.form.TextField({
        fieldLabel: 'Un.',
        id: 'UNIDADE_MEDIDA_ITEM_NF',
        name: 'UNIDADE_MEDIDA_ITEM_NF',
        width: 30,
        allowBlank: false
    });

    var TXT_QTDE_ITEM_NF = new Ext.form.NumberField({
        fieldLabel: 'Qtde',
        width: 90,
        decimalPrecision: 3,
        decimalSeparator: ',',
        minValue: 0.01,
        name: 'QTDE_ITEM_NF',
        id: 'QTDE_ITEM_NF',
        enableKeyEvents: true,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaTotalItem();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0.00) {
                        GravaDados_TB_ITEM_NOTA_SAIDA();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaTotalItem();
            }
        }
    });

    var TXT_VALOR_UNITARIO_ITEM_NF = new Ext.form.NumberField({
        fieldLabel: 'Valor unit&aacute;rio',
        width: 90,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0,
        name: 'VALOR_UNITARIO_ITEM_NF',
        id: 'VALOR_UNITARIO_ITEM_NF',
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaTotalItem();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0.0000 && TXT_QTDE_ITEM_NF.getValue() > 0.00) {
                        GravaDados_TB_ITEM_NOTA_SAIDA();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaTotalItem();
            }
        }
    });

    var TXT_VALOR_TOTAL_ITEM_NF = new Ext.form.NumberField({
        fieldLabel: 'Total do Item',
        id: 'VALOR_TOTAL_ITEM_NF',
        name: 'VALOR_TOTAL_ITEM_NF',
        width: 110,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0
    });

    var TXT_BASE_ISS_ITEM_NF = new Ext.form.NumberField({
        fieldLabel: 'Base de ISS',
        id: 'BASE_ISS_ITEM_NF',
        name: 'BASE_ISS_ITEM_NF',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0
    });

    var TXT_NUMERO_PEDIDO_ITEM_NF = new Ext.form.TextField({
        fieldLabel: 'Nr. do Pedido',
        name: 'NUMERO_PEDIDO_ITEM_NF',
        id: 'NUMERO_PEDIDO_ITEM_NF',
        width: 130,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    function CalculaTotalItem() {
        if (Ext.getCmp('formItem_NOTA_SAIDA').getForm().isValid()) {
            var _qtde = TXT_QTDE_ITEM_NF.getValue();
            var _preco = TXT_VALOR_UNITARIO_ITEM_NF.getValue();

            var _total = Math.round((_qtde * _preco) * 100) / 100;

            TXT_VALOR_TOTAL_ITEM_NF.setValue(_total);
            TXT_BASE_ISS_ITEM_NF.setValue(_total);
        }
    }

    var TXT_ALIQ_ISS_ITEM_NF = new Ext.form.NumberField({
        fieldLabel: 'Al&iacute;q. ICMS',
        id: 'ALIQ_ISS_ITEM_NF',
        name: 'ALIQ_ISS_ITEM_NF',
        width: 60,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0
    });

    var BTN_SALVAR_ITEM_NOTA_SAIDA = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_32.gif',
        scale: 'large',
        handler: function () {
            GravaDados_TB_ITEM_NOTA_SAIDA();
        }
    });

    var BTN_NOVO_ITEM_NOTA_SAIDA = new Ext.Button({
        text: 'Novo Item',
        icon: 'imagens/icones/database_fav_32.gif',
        scale: 'large',
        handler: function () {
            PreparaNovoItem();
        }
    });

    var BTN_DELETAR_ITEM_NOTA_SAIDA = new Ext.Button({
        id: 'BTN_DELETAR_ITEM_NOTA_SAIDA',
        text: 'Deletar',
        icon: 'imagens/icones/database_delete_32.gif',
        scale: 'large',
        disabled: true,
        handler: function () {
            DeletaItemNFSaida()
        }
    });

    var BTN_FINALIZAR_ITEM_NOTA_SAIDA = new Ext.Button({
        text: 'Finalizar NF',
        icon: 'imagens/icones/document_ok_32.gif',
        scale: 'large',
        handler: function () {
            FinalizaNotaSaida();
        }
    });

    var BTN_VENCIMENTOS_ITEM_NOTA_SAIDA = new Ext.Button({
        id: 'BTN_VENCIMENTO_ITEM_NOTA_SAIDA',
        text: 'Vencimentos',
        icon: 'imagens/icones/calendar_32.gif',
        scale: 'large',
        handler: function () {
            _vencimentos.NUMERO_SEQ(Ext.getCmp('NUMERO_SEQ').getValue());
            _vencimentos.show('BTN_VENCIMENTO_NOTA_SAIDA');
        }
    });

    function FinalizaNotaSaida() {
        PreparaNovoItem();
        Ext.getCmp('gridItemNotaSaida1').getStore().removeAll();
        Ext.getCmp('LBL_TOTAIS_NOTA_SAIDA').setText(AtualizaTotaisNota(), false);
        PreparaNovaNotaSaida();
    }

    ///////////////////// Busca de Produtos
    var TB_ITEM_NOTA_SAIDA_BUSCA_PRODUTO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'UNIDADE_MEDIDA_VENDA', 'PRECO_PRODUTO', 'ALIQ_ISS_PRODUTO']
           )
    });

    var gridITEM_NF_SAIDA_Produto = new Ext.grid.GridPanel({
        id: 'gridITEM_NF_SAIDA_Produto',
        store: TB_ITEM_NOTA_SAIDA_BUSCA_PRODUTO_STORE,
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 400, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'UNIDADE_MEDIDA_VENDA', header: "Un", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_VENDA' },
            { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o de Venda", width: 110, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4 },
            { id: 'ALIQ_ISS_PRODUTO', header: "Al&iacute;q. ISS", width: 80, sortable: true, dataIndex: 'ALIQ_ISS_PRODUTO', renderer: FormataPercentual }
        ],

        stripeRows: true,
        height: 150,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaCamposProduto(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposProduto(record);
            }
        }
    });

    function PopulaCamposProduto(record) {
        Busca_Dados_Produto(record.data.CODIGO_PRODUTO);
        fsBuscaProduto_ITEM_NOTA_SAIDA.collapse();
    }

    var TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/ListaProdutos_GridPesquisa');
    TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.setStore(TB_ITEM_NOTA_SAIDA_BUSCA_PRODUTO_STORE);

    function RetornaFiltros_TB_ITEM_NOTA_PRODUTO_JsonData() {
        var _pesquisa = Ext.getCmp('TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO') ?
                            Ext.getCmp('TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO').getValue() : '';

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Produto_TB_ITEM_NOTA_SAIDA() {
        TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_ITEM_NOTA_PRODUTO_JsonData());
        TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.doRequest();
    }

    var TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO = new Ext.form.TextField({
        id: 'TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO',
        name: 'TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO',
        fieldLabel: 'Produto',
        labelAlign: 'left',
        layout: 'form',
        labelWidth: 110,
        width: 260,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Produto_TB_ITEM_NOTA_SAIDA();
                }
            }
        }
    });

    var TB_ITEM_NOTA_SAIDA_BTN_PESQUISA_PRODUTO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Produto_TB_ITEM_NOTA_SAIDA();
        }
    });

    var fsBuscaProduto_ITEM_NOTA_SAIDA = new Ext.form.FieldSet({
        title: 'Busca de Produto',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO').focus();
            }
        }
    });

    fsBuscaProduto_ITEM_NOTA_SAIDA.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .07,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Produto:'
            }, {
                columnWidth: .26,
                items: [TB_ITEM_NOTA_SAIDA_TXT_PESQUISA_PRODUTO]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_ITEM_NOTA_SAIDA_BTN_PESQUISA_PRODUTO]
            }]
        }, gridITEM_NF_SAIDA_Produto, TB_ITEM_NOTA_SAIDA_PRODUTO_PagingToolbar.PagingToolbar()]
    });

    ///////////////////////

    var formItem_NOTA_SAIDA = new Ext.FormPanel({
        id: 'formItem_NOTA_SAIDA',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        labelAlign: 'top',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.18,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO_ITEM_NF]
            }, {
                columnWidth: 0.71,
                layout: 'form',
                items: [TXT_DESCRICAO_PRODUTO_ITEM_NF]
            }]
        }, {
            layout: 'form',
            items: [fsBuscaProduto_ITEM_NOTA_SAIDA]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.05,
                layout: 'form',
                items: [TXT_UNIDADE_MEDIDA_ITEM_NF]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_QTDE_ITEM_NF]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_VALOR_UNITARIO_ITEM_NF]
            }, {
                columnWidth: 0.11,
                layout: 'form',
                items: [TXT_VALOR_TOTAL_ITEM_NF]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_BASE_ISS_ITEM_NF]
            }, {
                columnWidth: 0.07,
                layout: 'form',
                items: [TXT_ALIQ_ISS_ITEM_NF]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.08,
                items: [BTN_SALVAR_ITEM_NOTA_SAIDA]
            }, {
                columnWidth: 0.09,
                items: [BTN_NOVO_ITEM_NOTA_SAIDA]
            }, {
                columnWidth: 0.08,
                items: [BTN_DELETAR_ITEM_NOTA_SAIDA]
            }, {
                columnWidth: 0.10,
                items: [BTN_FINALIZAR_ITEM_NOTA_SAIDA]
            }, {
                columnWidth: 0.11,
                items: [BTN_VENCIMENTOS_ITEM_NOTA_SAIDA]
            }]
        }]
    });

    var TB_ITEM_NOTA_SAIDA_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ITEM_NF', 'SEQUENCIA_ITEM_NF', 'ID_PRODUTO_ITEM_NF', 'CODIGO_PRODUTO_ITEM_NF', 'DESCRICAO_PRODUTO_ITEM_NF',
            'UNIDADE_MEDIDA_ITEM_NF', 'QTDE_ITEM_NF', 'VALOR_UNITARIO_ITEM_NF', 'VALOR_DESCONTO_ITEM_NF',
            'VALOR_TOTAL_ITEM_NF', 'ALIQ_ISS_ITEM_NF', 'BASE_ISS_ITEM_NF', 'VALOR_ISS_ITEM_NF', 'NUMERO_PEDIDO_ITEM_NF'])
    });

    var gridItemNotaSaida1 = new Ext.grid.GridPanel({
        id: 'gridItemNotaSaida1',
        store: TB_ITEM_NOTA_SAIDA_STORE,
        columns: [
        { id: 'NUMERO_ITEM_NF', header: "NF", width: 90, sortable: true, dataIndex: 'NUMERO_ITEM_NF', hidden: true },
        { id: 'SEQUENCIA_ITEM_NF', header: "Item", width: 90, sortable: true, dataIndex: 'SEQUENCIA_ITEM_NF', hidden: true },
        { id: 'CODIGO_PRODUTO_ITEM_NF', header: "C&oacute;digo de Servi&ccedil;o", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_ITEM_NF' },
        { id: 'DESCRICAO_PRODUTO_ITEM_NF', header: "Descri&ccedil;&atilde;o do Servi&ccedil;o", width: 330, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_NF' },
        { id: 'UNIDADE_MEDIDA_ITEM_NF', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_ITEM_NF' },
        { id: 'QTDE_ITEM_NF', header: "Qtde", width: 90, sortable: true, dataIndex: 'QTDE_ITEM_NF', renderer: FormataQtde },
        { id: 'VALOR_UNITARIO_ITEM_NF', header: "Valor Unit&aacute;rio", width: 120, sortable: true, dataIndex: 'VALOR_UNITARIO_ITEM_NF', renderer: FormataValor_4 },
        { id: 'VALOR_DESCONTO_ITEM_NF', header: "Valor Desconto", width: 120, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_NF', renderer: FormataValor, hidden: true },
        { id: 'VALOR_TOTAL_ITEM_NF', header: "Total do Item", width: 120, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_NF', renderer: FormataValor },
        { id: 'ALIQ_ISS_ITEM_NF', header: "Aliq. ISS", width: 60, sortable: true, dataIndex: 'ALIQ_ISS_ITEM_NF', renderer: FormataPercentual },
        { id: 'BASE_ISS_ITEM_NF', header: "Base ISS", width: 120, sortable: true, dataIndex: 'BASE_ISS_ITEM_NF', renderer: FormataValor, hidden: true },
        { id: 'VALOR_ISS_ITEM_NF', header: "Valor ISS", width: 120, sortable: true, dataIndex: 'VALOR_ISS_ITEM_NF', renderer: FormataValor }

        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaItemNF(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaItemNF(record);
            }
        }
    });

    function PopulaItemNF(record) {
        var form1 = Ext.getCmp('formItem_NOTA_SAIDA').getForm();

        Ext.getCmp('panelItemNotaSaida').setTitle("Alterar dados do Item da Nota Fiscal");

        //Busca_Dados_Produto(record.data.CODIGO_PRODUTO_ITEM_NF);

        Ext.getCmp('VALOR_UNITARIO_ITEM_NF').setValue(record.data.VALOR_UNITARIO_ITEM_NF);
        Ext.getCmp('QTDE_ITEM_NF').setValue(record.data.QTDE_ITEM_NF);
        Ext.getCmp('VALOR_TOTAL_ITEM_NF').setValue(record.data.VALOR_TOTAL_ITEM_NF);
        TXT_BASE_ISS_ITEM_NF.setValue(record.data.BASE_ISS_ITEM_NF);
        Ext.getCmp('ALIQ_ISS_ITEM_NF').setValue(record.data.ALIQ_ISS_ITEM_NF);
        Ext.getCmp('SEQUENCIA_ITEM_NF').setValue(record.data.SEQUENCIA_ITEM_NF);
        Ext.getCmp('NUMERO_PEDIDO_ITEM_NF').setValue(record.data.NUMERO_PEDIDO_ITEM_NF);

        TXT_BASE_ISS_ITEM_NF.setValue(record.data.BASE_ISS_ITEM_NF);

        H_ID_PRODUTO.setValue(record.data.ID_PRODUTO_ITEM_NF);

        TXT_CODIGO_PRODUTO_ITEM_NF.setValue(record.data.CODIGO_PRODUTO_ITEM_NF);
        TXT_UNIDADE_MEDIDA_ITEM_NF.setValue(record.data.UNIDADE_MEDIDA_ITEM_NF);
        TXT_DESCRICAO_PRODUTO_ITEM_NF.setValue(record.data.DESCRICAO_PRODUTO_ITEM_NF);

        Ext.getCmp('BTN_DELETAR_ITEM_NOTA_SAIDA').enable();

        if (Ext.getCmp('TXT_UP_CODIGO_PRODUTO'))
            Ext.getCmp('TXT_UP_CODIGO_PRODUTO').setValue(record.data.CODIGO_PRODUTO_ITEM_NF);

        form1.findField('QTDE_ITEM_NF').focus();
    }

    function RetornaItemNotaSaidaJsonData1() {
        var _seq = Ext.getCmp('NUMERO_SEQ') ?
                            Ext.getCmp('NUMERO_SEQ').getValue() : 0;

        var _JsonData = {
            NUMERO_ITEM_NF: _seq,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaItemSaidaPagingToolbar1 = new Th2_PagingToolbar();
    NotaItemSaidaPagingToolbar1.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/Carrega_ItensNotaSaida');
    NotaItemSaidaPagingToolbar1.setStore(TB_ITEM_NOTA_SAIDA_STORE);

    function Carrega_GRID_TB_ITEM_NOTA_SAIDA() {
        NotaItemSaidaPagingToolbar1.setParamsJsonData(RetornaItemNotaSaidaJsonData1());
        NotaItemSaidaPagingToolbar1.doRequest();
    }

    function AtualizaTotaisNota(result) {
        var HTMLTotais = '';

        if (result) {
            HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
                                "<tr style='border-style: solid; border-width: 1px;'>" +
                                    "<td style='color: #333333;'>Base de Calculo do ISS</td>" +

                                    "<td style='color: #333333;'>Valor do ISS</td>" +

                                    "<td style='color: #333333;'>Total da Nota Fiscal</td>" +

                                "</tr>" +
                                "<tr style='border-style: solid; border-width: 1px; height: 33px;'>" +
                                    "<td>" + result.BASE_ISS_NF + "</td>" +

                                    "<td>" + result.VALOR_ISS_NF + "</td>" +

                                    "<td>" + result.TOTAL_NF + "</td>" +
                                "</tr>" +

                                "</table>";
        }
        else {
            HTMLTotais = "<table style='font-family: Tahoma; font-size: 10pt; width: 100%;'>" +
                                "<tr style='border-style: solid; border-width: 1px;'>" +
                                    "<td style='color: #333333;'>Base de Calculo do ISS</td>" +

                                    "<td style='color: #333333;'>Valor do ISS</td>" +

                                    "<td style='color: #333333;'>Total da Nota Fiscal</td>" +

                                "</tr>" +
                                "<tr style='border-style: solid; border-width: 1px; height: 33px;'>" +
                                    "<td>R$ 0,00</td>" +

                                    "<td>R$ 0,00</td>" +

                                    "<td>R$ 0,00</td>" +
                                "</tr>" +

                                "</table>";

            return HTMLTotais;
        }

        if (Ext.getCmp('LBL_TOTAIS_NOTA_SAIDA')) {
            Ext.getCmp('LBL_TOTAIS_NOTA_SAIDA').setText(HTMLTotais, false);
        }
    }

    var panelItemNotaSaida = new Ext.Panel({
        id: 'panelItemNotaSaida',
        title: 'Novo Item',
        width: '100%',
        border: true,
        autoHeight: true,
        items: [formItem_NOTA_SAIDA, gridItemNotaSaida1, NotaItemSaidaPagingToolbar1.PagingToolbar(), {
            id: 'LBL_TOTAIS_NOTA_SAIDA',
            xtype: 'label'
        }]
    });

    Ext.getCmp('LBL_TOTAIS_NOTA_SAIDA').setText(AtualizaTotaisNota(), false);

    function GravaDados_TB_ITEM_NOTA_SAIDA() {
        if (!formItem_NOTA_SAIDA.getForm().isValid())
            return;

        var Url = Ext.getCmp('panelItemNotaSaida').title == "Novo Item" ?
                                'servicos/TB_ITEM_NOTA_SAIDA.asmx/GravaItemNotaSaida' :
                                'servicos/TB_ITEM_NOTA_SAIDA.asmx/AtualizaItemNotaSaida';

        var dados = {
            NUMERO_ITEM_NF: Ext.getCmp('NUMERO_SEQ').getValue(),
            ID_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_NF').getValue(),
            ID_PRODUTO: H_ID_PRODUTO.getValue(),
            CODIGO_PRODUTO_ITEM_NF: Ext.getCmp('CODIGO_PRODUTO_ITEM_NF').getValue(),
            DESCRICAO_PRODUTO_ITEM_NF: Ext.getCmp('DESCRICAO_PRODUTO_ITEM_NF').getValue(),
            UNIDADE_MEDIDA_ITEM_NF: Ext.getCmp('UNIDADE_MEDIDA_ITEM_NF').getValue(),
            QTDE_ITEM_NF: Ext.getCmp('QTDE_ITEM_NF').getValue(),
            VALOR_UNITARIO_ITEM_NF: Ext.getCmp('VALOR_UNITARIO_ITEM_NF').getValue(),
            VALOR_DESCONTO_ITEM_NF: 0,
            VALOR_TOTAL_ITEM_NF: Ext.getCmp('VALOR_TOTAL_ITEM_NF').getValue(),
            BASE_ISS_ITEM_NF: TXT_BASE_ISS_ITEM_NF.getValue(),
            ALIQ_ISS_ITEM_NF: Ext.getCmp('ALIQ_ISS_ITEM_NF').getValue(),
            SEQ: Ext.getCmp('SEQUENCIA_ITEM_NF').getValue(),

            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('DADOS_ADICIONAIS_NF').setValue(result.DADOS_ADICIONAIS_NF);

            Carrega_GRID_TB_ITEM_NOTA_SAIDA();
            AtualizaTotaisNota(result);

            if (Ext.getCmp('panelItemNotaSaida').title == "Novo Item") {
                PreparaNovoItem();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function DeletaItemNFSaida() {
        dialog.MensagemDeConfirmacao('Deseja deletar este item [' +
                                Ext.getCmp('CODIGO_PRODUTO_ITEM_NF').getValue() + ']?', 'formItem_NOTA_SAIDA', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/DeletaItemNotaSaida');
                _ajax.setJsonData({
                    NUMERO_ITEM_NF: Ext.getCmp('NUMERO_SEQ').getValue(),
                    SEQUENCIA_ITEM_NF: Ext.getCmp('SEQUENCIA_ITEM_NF').getValue(),
                    Moeda: true,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    Carrega_GRID_TB_ITEM_NOTA_SAIDA();
                    AtualizaTotaisNota(result);

                    Ext.getCmp('DADOS_ADICIONAIS_NF').setValue(result.DADOS_ADICIONAIS_NF);

                    PreparaNovoItem();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function PreparaNovoItem() {
        Ext.getCmp('panelItemNotaSaida').setTitle("Novo Item");
        Ext.getCmp('BTN_DELETAR_ITEM_NOTA_SAIDA').disable();
        Ext.getCmp('CODIGO_PRODUTO_ITEM_NF').focus();
        H_ID_PRODUTO.reset();
        Ext.getCmp('formItem_NOTA_SAIDA').getForm().reset();
    }

    this.PreparaAlteracao_NOTA_SAIDA = function (NUMERO_SEQ) {
        var _numero_seq = NUMERO_SEQ + '';

        if (_numero_seq.length > 0) {
            var Url = 'servicos/TB_NOTA_SAIDA.asmx/Busca_Totais_NF';

            var _ajax = new Th2_Ajax();
            _ajax.setUrl(Url);
            _ajax.setJsonData({ NUMERO_SEQ: _numero_seq, ID_USUARIO: _ID_USUARIO });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                Carrega_GRID_TB_ITEM_NOTA_SAIDA();
                AtualizaTotaisNota(result);

                PreparaNovoItem();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        if (_nota_alterada_cancelada) {
            BTN_SALVAR_ITEM_NOTA_SAIDA.disable();
            BTN_NOVO_ITEM_NOTA_SAIDA.disable();
            BTN_DELETAR_ITEM_NOTA_SAIDA.disable();
        }
        else {
            BTN_SALVAR_ITEM_NOTA_SAIDA.enable();
            BTN_NOVO_ITEM_NOTA_SAIDA.enable();
            BTN_DELETAR_ITEM_NOTA_SAIDA.enable();
        }
    }

    this.panel_ITEM_NOTA_SAIDA = function () {
        gridItemNotaSaida1.setHeight(AlturaDoPainelDeConteudo(380));
        return panelItemNotaSaida;
    }
}