function WAjuda() {
    var Texto;
    var lTexto = new Ext.form.Label();

    var fsAjuda = new Ext.form.FieldSet({
        checkboxToggle: false,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '97%',
        items: [lTexto]
    });

    var w = new Ext.Window({
        title: 'Ajuda',
        renderTo: Ext.getBody(),
        iconCls: 'icone_HELP',
        width: 600,
        height: 258,
        closable: false,
        minimizable: true,
        modal: true,
        draggable: true,
        resizable: false,
        items: [fsAjuda],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.Altura = function (pAltura) {
        w.setHeight(pAltura);
    };

    this.setText = function (pTexto) {
        lTexto.setText(pTexto, false);
    };

    this.showDialog = function (elm) {
        w.show(elm);
    };

    this.close = function () {
        w.close();
    };
}

function Monta_Cotacao_Fornecedor() {

    var ajuda = new WAjuda();

    var _janelaNovoEmail = new janela_Envio_Email('_cotacao_fornecedor');

    var _envia_cotacao = new Envia_Cotacao();

    var _ultimos_precos = new MontaUltimasCompras();
    _ultimos_precos.Cliente_Fornecedor(1);
    _ultimos_precos.isWindow(true);

    ////////////////

    var wConsulta = new Ext.Window({
        layout: 'form',
        title: 'Ultimas Vendas',
        iconCls: 'icone_ULTIMAS_VENDAS',
        width: 1060,
        height: 600,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        renderTo: Ext.getBody(),
        modal: true,
        items: [_ultimos_precos.painel_Ultimas_Compras()],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    ////////////////

    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.form.NumberField({
        fieldLabel: 'Nr. Cota&ccedil;&atilde;o / Pedido',
        id: 'NUMERO_PEDIDO_COMPRA1',
        name: 'NUMERO_PEDIDO_COMPRA1',
        width: 90,
        maxLength: 20,
        allowBlank: false,
        minValue: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '20', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.isValid()) {
                        ITEM_COTACAO_CARREGA_GRID();
                        COTACAO_FORNECEDOR_CARREGA_GRID();
                    }
                }
            }
        }
    });

    this.NUMERO_PEDIDO_COMPRA = function (pNUMERO_PEDIDO_COMPRA) {
        TXT_NUMERO_PEDIDO_COMPRA.setValue(pNUMERO_PEDIDO_COMPRA);
        ITEM_COTACAO_CARREGA_GRID();
        COTACAO_FORNECEDOR_CARREGA_GRID();
    };

    var CB_SOMENTE_NAO_COTADO = new Ext.form.Checkbox({
        boxLabel: 'Somente itens n&atilde;o cotados',
        checked: true
    });

    var btn_listar_itens = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            if (Ext.getCmp('NUMERO_PEDIDO_COMPRA1').isValid()) {
                ITEM_COTACAO_CARREGA_GRID();
                COTACAO_FORNECEDOR_CARREGA_GRID();
            }
        }
    });

    var btn_ajuda = new Ext.Button({
        id: 'BTN_AJUDA_COTACAO',
        text: 'Ajuda',
        icon: 'imagens/icones/help_16.gif',
        scale: 'small',
        handler: function () {
            var mess = '<P align=left><FONT color=#003366 size=3><STRONG>​Distribuir Cotações<BR><BR></STRONG></P><FONT color=#000000 size=2>'
                        + '1 - No campo à direita acima [Nr. da Cotação / Pedido], digite o numero da cotação e '
                        + 'pressione [ENTER]. Na área ao lado faça a pesquisa para buscar o(s) fornecedores '
                        + 'de sua preferência para responder aos itens listados no lado esquerdo.<BR><BR>2 '
                        + '- Selecione o(s) item(s) de sua preferência, o(s) fornecedor(es) e clique no '
                        + 'botão abaixo [<b>Salvar itens selecionados p/ Cotação</b>]. Você pode repetir '
                        + 'este processo quantas vezes quiser, desde que a combinção entre item de cotação '
                        + 'e fornecedor ainda não esteja feita. <BR><BR>3 - Após distribuir os itens entre '
                        + 'os fornecedores desejados, você deve clicar em [<b>Enviar Cotação</b>] para que '
                        + 'o sistema abra a janela de confirmação de envio das cotações para cada '
                        + 'fornecedor. As cotações serão enviadas para o e-mail cadastrado em cada fornecedor.<BR><br/><br /></FONT></FONT>'
                        + '<div>';

            ajuda.setText(mess);
            ajuda.Altura(300);
            ajuda.showDialog('BTN_AJUDA_COTACAO');
        }
    });

    var COTACAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
                            ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'ID_PRODUTO_COMPRA', 'CODIGO_PRODUTO',
                            'DESCRICAO_PRODUTO', 'QTDE_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA',
                            'CODIGO_COND_PAGTO', 'OBS_ITEM_COMPRA', 'ITEM_JA_COTADO', 'ENTREGA_CLIENTE']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var checkBoxSM_IO = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {

            }
        }
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<hr /><b>Descrição do produto:</b> {DESCRICAO_PRODUTO}")
    });

    function Item_Ja_Cotado(val) {
        if (val > 0)
            return "<span style='width: 100%; background-color: navy; color: #FFFFFF;'>Sim</span>";
        else
            return "N&atilde;o";
    }

    var grid_ITEMS_COTACAO = new Ext.grid.GridPanel({
        id: 'grid_ITEMS_COTACAO',
        store: COTACAO_Store,
        columns: [
                IO_expander,
                checkBoxSM_IO,
                { id: 'NUMERO_PEDIDO_COMPRA', header: "N&ordm; Cota&ccedil;&atilde;o", width: 70, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA' },
                { id: 'ITEM_JA_COTADO', header: "J&aacute; foi Cotado?", width: 90, sortable: true, dataIndex: 'ITEM_JA_COTADO', renderer: Item_Ja_Cotado },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'QTDE_ITEM_COMPRA', header: "Qtde", width: 100, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde, align: 'center' },
                { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA' },
                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 90, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
                { id: 'ENTREGA_CLIENTE', header: "Entrega (Cliente)", width: 115, sortable: true, dataIndex: 'ENTREGA_CLIENTE', renderer: XMLParseDate, align: 'center' },
                { id: 'OBS_ITEM_COMPRA', header: "Obs. Item", width: 600, sortable: true, dataIndex: 'OBS_ITEM_COMPRA' }
                ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: checkBoxSM_IO,
        plugins: IO_expander
    });

    function RetornaITEM_ORC_JsonData() {
        var _orcamento = Ext.getCmp('NUMERO_PEDIDO_COMPRA1').getValue() == '' ? 0
                         : Ext.getCmp('NUMERO_PEDIDO_COMPRA1').getValue();

        _orcamento = _orcamento == undefined ? 0 : _orcamento;

        var CP_JsonData = {
            NUMERO_PEDIDO_COMPRA: _orcamento,
            SOMENTE_NAO_COTADO: CB_SOMENTE_NAO_COTADO.checked ? 1 : 0,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CP_JsonData;
    }

    var ITEM_COTACAO_PagingToolbar = new Th2_PagingToolbar();
    ITEM_COTACAO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Pre_Cotacao');
    ITEM_COTACAO_PagingToolbar.setStore(COTACAO_Store);

    function ITEM_COTACAO_CARREGA_GRID(_utlimaPagina) {
        ITEM_COTACAO_PagingToolbar.setParamsJsonData(RetornaITEM_ORC_JsonData());
        ITEM_COTACAO_PagingToolbar.doRequest();
    }

    var panelItems = new Ext.Panel({
        width: '100%',
        bodyStyle: 'padding:0px 0px 0',
        frame: true,
        border: false,
        title: 'Itens de Cota&ccedil;&atilde;o',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .38,
                labelAlign: 'left',
                layout: 'form',
                labelWidth: 120,
                items: [TXT_NUMERO_PEDIDO_COMPRA]
            }, {
                columnWidth: .28,
                items: [CB_SOMENTE_NAO_COTADO]
            }, {
                columnWidth: .13,
                items: [btn_listar_itens]
            }, {
                columnWidth: .13,
                items: [btn_ajuda]
            }]
        }, grid_ITEMS_COTACAO, ITEM_COTACAO_PagingToolbar.PagingToolbar()]
    });

    // Fornecedores

    var TXT_NOME_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FORNECEDOR_CARREGA_GRID();
                }
            }
        }
    });

    var btn_listar_fornecedores = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            FORNECEDOR_CARREGA_GRID();
        }
    });

    var FORNECEDORES_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
            ['CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR', 'MUNICIPIO', 'UF', 'PRECO_FINAL',
            'TELEFONE1_FORNECEDOR', 'TELEFONE2_FORNECEDOR', 'EMAIL_FORNECEDOR', 'CONTATO_FORNECEDOR']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var checkBoxSM_IO1 = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {

            }
        }
    });

    var grid_FORNECEDORES = new Ext.grid.GridPanel({
        store: FORNECEDORES_Store,
        columns: [
                checkBoxSM_IO1,
                { id: 'CODIGO_FORNECEDOR', header: "C&oacute;digo do Fornecedor", width: 160, sortable: true, dataIndex: 'CODIGO_FORNECEDOR', hidden: true },
                { id: 'PRECO_FINAL', header: "Pre&ccedil;o tabela", width: 95, sortable: true, dataIndex: 'PRECO_FINAL', renderer: FormataValor,
                    align: 'center'
                },
                { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 220, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                { id: 'TELEFONE1_FORNECEDOR', header: "Telefone", width: 130, sortable: true, dataIndex: 'TELEFONE1_FORNECEDOR' },
                { id: 'TELEFONE2_FORNECEDOR', header: "Telefone", width: 130, sortable: true, dataIndex: 'TELEFONE2_FORNECEDOR' },
                { id: 'CONTATO_FORNECEDOR', header: "Contato", width: 200, sortable: true, dataIndex: 'CONTATO_FORNECEDOR' },
                { id: 'EMAIL_FORNECEDOR', header: "e-mail", width: 180, sortable: true, dataIndex: 'EMAIL_FORNECEDOR' },
                { id: 'MUNICIPIO', header: "Munic&iacute;pio", width: 200, sortable: true, dataIndex: 'MUNICIPIO' },
                { id: 'UF', header: "UF", width: 50, sortable: true, dataIndex: 'UF'}],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: checkBoxSM_IO1
    });

    function RetornaFornecedorJsonData() {
        var CP_JsonData = {
            FORNECEDOR: TXT_NOME_FORNECEDOR.getValue(),
            ID_USUARIO: _ID_USUARIO,
            ID_PRODUTO: grid_ITEMS_COTACAO.getSelectionModel().getSelections().length > 0 ?
                grid_ITEMS_COTACAO.getSelectionModel().selections.items[0].data.ID_PRODUTO_COMPRA : 0,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CP_JsonData;
    }

    var FORNECEDOR_PagingToolbar = new Th2_PagingToolbar();
    FORNECEDOR_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Fornecedores_Cotacao');
    FORNECEDOR_PagingToolbar.setParamsJsonData(RetornaFornecedorJsonData());
    FORNECEDOR_PagingToolbar.setStore(FORNECEDORES_Store);

    function FORNECEDOR_CARREGA_GRID() {
        FORNECEDOR_PagingToolbar.setParamsJsonData(RetornaFornecedorJsonData());
        FORNECEDOR_PagingToolbar.doRequest();
    }

    var pFornecedores = new Ext.Panel({
        width: '100%',
        bodyStyle: 'padding:0px 0px 0',
        title: 'Fornecedores',
        frame: true,
        border: false,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .47,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 66,
                items: [TXT_NOME_FORNECEDOR]
            }, {
                columnWidth: .12,
                items: [btn_listar_fornecedores]
            }]
        }, grid_FORNECEDORES, FORNECEDOR_PagingToolbar.PagingToolbar()]
    });

    ///////////////
    var COTACAO_FORNECEDOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
                            ['NUMERO_RESPOSTA', 'NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'CODIGO_FORNECEDOR',
                            'NOME_FANTASIA_FORNECEDOR', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO',
                            'QTDE_FORNECEDOR', 'DESCRICAO_CP', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'CHAVE_COTACAO',
                            'DATA_RESPOSTA', 'COTACAO_ENVIADA', 'COTACAO_RESPONDIDA', 'UNIDADE_ITEM_COMPRA',
                            'DATA_VALIDADE_COTACAO', 'EMAIL_FORNECEDOR', 'PRECO_FINAL_FORNECEDOR', 'CUSTO_VENDEDOR',
                            'QTDE_NA_EMBALAGEM_FORNECEDOR']),
        listeners: {
            load: function (records, options) {

            }
        }
    });

    var TXT_QTDE_NA_EMBALAGEM_FORNECEDOR = new Ext.form.NumberField({
        minValue: 0.00,
        decimalPrecision: 2,
        decimalSeparator: ','
    });

    var grid_COTACAO_FORNECEDOR = new Ext.grid.EditorGridPanel({
        id: 'grid_COTACAO_FORNECEDOR',
        store: COTACAO_FORNECEDOR_Store,
        columns: [
                { id: 'COTACAO_RESPONDIDA', header: "Status", width: 180, sortable: true, dataIndex: 'COTACAO_RESPONDIDA', renderer: Status_Cotacao },
                { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido Compra", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 350, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },
                { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 200, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                { id: 'QTDE_FORNECEDOR', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_FORNECEDOR', align: 'center', renderer: FormataQtde },

                { id: 'QTDE_NA_EMBALAGEM_FORNECEDOR', header: "Qtde. (Emb.)", width: 100, sortable: true, dataIndex: 'QTDE_NA_EMBALAGEM_FORNECEDOR', align: 'center', renderer: FormataQtde,
                    editor: TXT_QTDE_NA_EMBALAGEM_FORNECEDOR
                },

                { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' },

                { id: 'CUSTO_VENDEDOR', header: "Custo Vendedor(a)", width: 120, sortable: true, dataIndex: 'CUSTO_VENDEDOR', align: 'center' },

                { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o Final", width: 95, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: FormataValor_4,
                    align: 'center'
                },

                { id: 'DESCRICAO_CP', header: "Cond. Pagto.", width: 280, sortable: true, dataIndex: 'DESCRICAO_CP' },
                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 90, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate },
                { id: 'DATA_VALIDADE_COTACAO', header: "Validade", width: 100, sortable: true, dataIndex: 'DATA_VALIDADE_COTACAO', renderer: XMLParseDate }
                ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (s, Index, record) {
                    if (record.data.COTACAO_RESPONDIDA > 0) {
                        Ext.getCmp('BTN_DELETAR_COTACAO_FORNECEDOR').disable();
                    }
                },
                rowdeselect: function (s, Index, record) {
                    Ext.getCmp('BTN_DELETAR_COTACAO_FORNECEDOR').enable();
                },
                afterEdit: function (e) {
                    if (e.value == e.originalValue) {
                        e.record.reject();
                    }
                }
            }
        }),

        clicksToEdit: 1,

        listeners: {
            afterEdit: function (e) {
                var _ajax = new Th2_Ajax();

                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Atualiza_Qtde_Embalagem_Fornecedor');
                _ajax.ExibeDivProcessamento(false);

                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: e.record.data.NUMERO_PEDIDO_COMPRA,
                    NUMERO_ITEM_COMPRA: e.record.data.NUMERO_ITEM_COMPRA,
                    QTDE_NA_EMBALAGEM_FORNECEDOR: e.record.data.QTDE_NA_EMBALAGEM_FORNECEDOR,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    e.record.commit();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    });

    function RetornaCotacaoFornecedorJsonData() {
        var CP_JsonData = {
            NUMERO_PEDIDO_COMPRA: TXT_NUMERO_PEDIDO_COMPRA.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CP_JsonData;
    }

    var COTACAO_FORNECEDOR_PagingToolbar = new Th2_PagingToolbar();
    COTACAO_FORNECEDOR_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Cotacao_Fornecedor');
    COTACAO_FORNECEDOR_PagingToolbar.setStore(COTACAO_FORNECEDOR_Store);

    function COTACAO_FORNECEDOR_CARREGA_GRID() {
        COTACAO_FORNECEDOR_PagingToolbar.setParamsJsonData(RetornaCotacaoFornecedorJsonData());
        COTACAO_FORNECEDOR_PagingToolbar.doRequest();
    }

    var panelCotacao_Fornecedor = new Ext.Panel({
        width: '100%',
        border: false,
        frame: true,
        bodyStyle: 'padding:0px 0px 0',
        title: 'Itens marcados p/ Cota&ccedil;&atilde;o',
        items: [grid_COTACAO_FORNECEDOR, COTACAO_FORNECEDOR_PagingToolbar.PagingToolbar()]
    });

    var toolbar_fornecedor_cotacao = new Ext.Toolbar({
        items: ['-', {
            id: 'BTN_SALVAR_COTACAO_FORNECEDOR',
            text: 'Salvar itens selecionados p/ Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            handler: function () {
                SalvarItensCotacao();
            }
        }, '-', {
            id: 'BTN_DELETAR_COTACAO_FORNECEDOR',
            text: 'Deletar item de Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'large',
            handler: function () {
                DeletaItemCotacao();
            }
        }, '-',
                {
                    id: 'BTN_ENVIAR_COTACAO',
                    text: 'Enviar Cota&ccedil;&atilde;o',
                    icon: 'imagens/icones/mail_next_24.gif',
                    scale: 'large',
                    handler: function () {

                        if (grid_COTACAO_FORNECEDOR.getStore().getCount() == 0) {
                            dialog.MensagemDeErro('N&atilde;o h&aacute; nenhuma cota&ccedil;&atilde;o formada para enviar', 'BTN_ENVIAR_COTACAO');
                            return;
                        }

                        if (Ext.getCmp('grid_COTACAO_FORNECEDOR').getSelectionModel().selections.length == 0) {
                            dialog.MensagemDeErro("Selecione uma linha do grid para enviar a cota&ccedil;&atilde;o", 'BTN_ENVIAR_COTACAO');
                            return;
                        }

                        var record = Ext.getCmp('grid_COTACAO_FORNECEDOR').getSelectionModel().selections.items[0];

                        _envia_cotacao.NUMERO_PEDIDO_COMPRA(record.data.NUMERO_PEDIDO_COMPRA);
                        _envia_cotacao.show('BTN_ENVIAR_COTACAO');
                    }
                }, '-', {
                    id: 'BTN_ULTIMAS_COMPRAS_FORNECEDOR',
                    text: 'Ultimas Vendas do Fornecedor',
                    icon: 'imagens/icones/row_zoom_24.gif',
                    scale: 'large',
                    handler: function () {
                        Ultimas_Compras();
                    }
                }, '-', {
                    id: 'BTN_IMPRIMIR_COTACAO_FORNECEDOR',
                    text: 'Imprimir Lista de Cota&ccedil;&atilde;o',
                    icon: 'imagens/icones/printer_24.gif',
                    scale: 'large',
                    handler: function () {
                        if (grid_COTACAO_FORNECEDOR.getStore().getCount() == 0) {
                            dialog.MensagemDeErro('N&atilde;o h&aacute; nenhuma cota&ccedil;&atilde;o formada para imprimir', 'BTN_IMPRIMIR_COTACAO_FORNECEDOR');
                            return;
                        }

                        if (grid_COTACAO_FORNECEDOR.getSelectionModel().selections.length == 0) {
                            dialog.MensagemDeErro("Selecione uma linha do grid para enviar a cota&ccedil;&atilde;o", 'BTN_ENVIAR_COTACAO');
                            return;
                        }

                        var record = grid_COTACAO_FORNECEDOR.getSelectionModel().selections.items[0];

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_de_Cotacao_Fornecedor');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                            CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                            ID_EMPRESA: _ID_EMPRESA,
                            NOME_FANTASIA_EMITENTE: _EMITENTE,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;
                            window.open(result, '_blank', 'width=1000,height=800');
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }, '-', {
                    id: 'BTN_NOVO_EMAIL_COMPRAS',
                    text: 'Escrever e-mail',
                    icon: 'imagens/icones/mail_star_24.gif',
                    scale: 'large',
                    handler: function () {
                        _janelaNovoEmail.resetaFormulario();
                        _janelaNovoEmail.Botao_Salvar(true);
                        _janelaNovoEmail.Botao_Enviar(true);
                        _janelaNovoEmail.Botao_Responder(false);
                        _janelaNovoEmail.Botao_Encaminhar(false);

                        _janelaNovoEmail.setRemetente(_record_conta_email.data.CONTA_EMAIL);
                        _janelaNovoEmail.setBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
                        _janelaNovoEmail.setRawBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
                        _janelaNovoEmail.recordGrid(undefined);
                        _janelaNovoEmail.show('BTN_NOVO_EMAIL_COMPRAS');
                    }
                }]
    });

    function Ultimas_Compras() {
        var _produto;
        var _fornecedor;

        if (grid_ITEMS_COTACAO.getSelectionModel().selections.length > 0) {
            var record = grid_ITEMS_COTACAO.getSelectionModel().selections.items[0];
            _ultimos_precos.setCodigoProduto(record.data.CODIGO_PRODUTO);
            _produto = true;
        }

        if (grid_FORNECEDORES.getSelectionModel().selections.length > 0) {
            var record = grid_FORNECEDORES.getSelectionModel().selections.items[0];
            _ultimos_precos.setClienteFornecedor(record.data.NOME_FANTASIA_FORNECEDOR);
            _fornecedor = true;
        }

        if (_produto && _fornecedor) {
            _ultimos_precos.CarregaGrid();
        }

        wConsulta.show('BTN_ULTIMAS_COMPRAS_FORNECEDOR');
    }

    //////////////////
    function SalvarItensCotacao() {
        if (grid_ITEMS_COTACAO.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos 1 item da cota&ccedil;&atilde;o', 'BTN_SALVAR_COTACAO_FORNECEDOR');
            return;
        }

        if (grid_FORNECEDORES.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos 1 fornecedor para formar a cota&ccedil;&atilde;o', 'BTN_SALVAR_COTACAO_FORNECEDOR');
            return;
        }

        var arrItens = new Array();
        var arrForn = new Array();
        var _NUMERO_PEDIDO_COMPRA;

        for (var i = 0; i < grid_ITEMS_COTACAO.getSelectionModel().selections.getCount(); i++) {
            var record = grid_ITEMS_COTACAO.getSelectionModel().selections.items[i];

            arrItens[i] = record.data.NUMERO_ITEM_COMPRA;
            _NUMERO_PEDIDO_COMPRA = record.data.NUMERO_PEDIDO_COMPRA;
        }

        for (var i = 0; i < grid_FORNECEDORES.getSelectionModel().selections.getCount(); i++) {
            var record = grid_FORNECEDORES.getSelectionModel().selections.items[i];

            arrForn[i] = record.data.CODIGO_FORNECEDOR;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/GravaCotacaoFornecedor');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
            Itens: arrItens,
            FORNECEDORES: arrForn,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            COTACAO_FORNECEDOR_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ///////////////

    function DeletaItemCotacao() {
        if (grid_COTACAO_FORNECEDOR.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos 1 item de cota&ccedil;&atilde;o', 'BTN_DELETAR_COTACAO_FORNECEDOR');
            return;
        }

        dialog.MensagemDeConfirmacao('Deseja deletar este item da Cota&ccedil;&atilde;o?', 'BTN_DELETAR_COTACAO_FORNECEDOR', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var record = grid_COTACAO_FORNECEDOR.getSelectionModel().getSelected();

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/DeletaItemCotacaoFornecedor');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                    NUMERO_ITEM_COMPRA: record.data.NUMERO_ITEM_COMPRA,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    COTACAO_FORNECEDOR_PagingToolbar.CarregaPaginaAtual();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var pCotacao = new Ext.Panel({
        width: '100%',
        border: false,
        //frame: true,
        bodyStyle: 'padding:0px 0px 0',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.50,
                items: [panelItems]
            }, {
                columnWidth: 0.50,
                items: [pFornecedores]
            }]
        }, {
            items: [panelCotacao_Fornecedor]
        }, {
            items: [toolbar_fornecedor_cotacao]
        }]
    });

    var monitor = new Monta_Monitor_Fornecedor();
    var cotacao = new MontaCotacaoCompra();

    var TP_COTACAO_FORNECEDOR = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,

        items: [{
            title: 'Digitar Cota&ccedil;&otilde;es',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_COTACAO1',
            items: [cotacao.PainelCotacao()]
        }, {
            title: 'Distribuir Cota&ccedil;&otilde;es',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_COTACAO_FORNECEDOR'
        }, {
            title: 'Monitorar Cota&ccedil;&otilde;es',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_MONITOR_COTACAO'
        }],
        listeners: {
            tabChange: function (tp, p) {
                if (p.title == 'Distribuir Cota&ccedil;&otilde;es') {
                    if (p.items.length == 0) {
                        p.add(pCotacao);
                        tp.doLayout();
                    }

                    if (Ext.getCmp('NUMERO_PEDIDO_COMPRA').getValue() > 0) {
                        if (TXT_NUMERO_PEDIDO_COMPRA.getValue() == '') {
                            TXT_NUMERO_PEDIDO_COMPRA.setValue(Ext.getCmp('NUMERO_PEDIDO_COMPRA').getValue());
                            COTACAO_Store.removeAll();
                        }
                    }
                }

                if (p.title == 'Monitorar Cota&ccedil;&otilde;es') {
                    if (p.items.length == 0) {
                        p.add(monitor.PainelMonitor());
                        tp.doLayout();
                    }
                }
            }
        }
    });

    grid_ITEMS_COTACAO.setHeight(AlturaDoPainelDeConteudo(252) / 2);
    grid_FORNECEDORES.setHeight(AlturaDoPainelDeConteudo(252) / 2);
    grid_COTACAO_FORNECEDOR.setHeight(AlturaDoPainelDeConteudo(267) / 2);

    return TP_COTACAO_FORNECEDOR;
}

function Envia_Cotacao() {
    var _CHAVE;
    var _Mensagem;
    var _EMAIL;
    var _ASSUNTO;
    var _NUMERO_PEDIDO_COMPRA;
    var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

    this.NUMERO_PEDIDO_COMPRA = function (pNUMERO_PEDIDO_COMPRA) {
        _NUMERO_PEDIDO_COMPRA = pNUMERO_PEDIDO_COMPRA;

        _Mensagem = "<P><FONT size=3><STRONG>Cotação de Compras<BR><BR></STRONG></FONT><FONT size=2>Solicitamos a sua participação nessa cotação de produtos / serviços. "
        _Mensagem += "Clique no link abaixo para acessar os portal do fornecedor e consultar os itens do pedido nº [<b>" + _NUMERO_PEDIDO_COMPRA + "</b>]."
        _Mensagem += "Acessando este link, insira o seu <b>e-mail:</b> #EMAIL_FORNECEDOR#, seguido da sua <b>senha:</b> #SENHA#<BR><BR>"
        _Mensagem += "<A href='http://localhost:50136/Resposta_Cotacao.htm' target='_blank'>Clique aqui para acessar a cotação</A><br /><br />Caso você não consiga acessar este link, vá até o seu browser de internet e digite http://localhost:50136/Resposta_Cotacao.htm<BR><BR>Atenciosamente,</FONT><BR><BR>#ASSINATURA#</P>";

        _Mensagem = _Mensagem.replace("#ASSINATURA#", _remetente.data.ASSINATURA);
        _Mensagem = _Mensagem.replaceAll("http://localhost:50136/Resposta_Cotacao.htm", _ENDERECO_RESPOSTA_COMPRAS);

        TXT_TEXTO_COTACAO.setValue(_Mensagem);
    };

    var TXT_TEXTO_COTACAO = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: 340,
        allowBlank: false,
        hideLabel: true,
        value: _Mensagem
    });

    var bg_enviar_cotacao = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_SOLICITA_ENVIO_COTACAO',
            text: 'Enviar Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'medium',
            handler: function () {
                if (TXT_TEXTO_COTACAO.getRawValue().trim().length == 0) {
                    dialog.MensagemDeErro('Digite o texto de apresenta&ccedil;&tilde;o da sua Cota&ccedil;&atilde;o', 'BTN_SOLICITA_ENVIO_COTACAO');
                    return;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Envia_Cotacao_Fornecedor');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
                    Mensagem: TXT_TEXTO_COTACAO.getRawValue(),
                    ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
                    FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
                    NOME_FANTASIA_EMITENTE: _EMITENTE,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    Ext.getCmp('grid_COTACAO_FORNECEDOR').getStore().each(le);

                    function le(record) {
                        record.beginEdit();
                        record.set('COTACAO_ENVIADA', 1);
                        record.endEdit();
                        record.commit();
                    }

                    wENVIAR_COTACAO.hide();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }]
    });

    var toolbar_enviar_cotacao = new Ext.Toolbar({
        style: { width: '100%' },
        items: [bg_enviar_cotacao]
    });

    var formEnviarCotacao = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'form',
            items: [TXT_TEXTO_COTACAO]
        }, {
            items: [toolbar_enviar_cotacao]
        }]
    });

    var wENVIAR_COTACAO = new Ext.Window({
        layout: 'form',
        title: 'Enviar Cota&ccedil;&atilde;o p/ Fornecedor(es)',
        iconCls: 'icone_ENVIA_COTACAO',
        width: 800,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        height: 449,
        items: [formEnviarCotacao],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        wENVIAR_COTACAO.show(elm);
    };
}