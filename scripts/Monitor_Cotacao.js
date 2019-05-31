function Monta_Monitor_Fornecedor() {

    var _itens_nao_fechados = new JANELA_ITENS_COMPRA_NAO_FECHADOS();

    var _envia_cotacao = new Envia_Cotacao_Fechar_Pedido();

    var _janelaNovoEmail = new janela_Envio_Email('monitor_cotacao');

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    var TXT_DATA_PEDIDO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Previs&atilde;o de Entrega',
        width: 94,
        value: dt1,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        width: 90,
        maxLength: 20,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Carrega_ITENS_PEDIDO_POR_NUMERO_PEDIDO();
                    }
                    else {
                        Carrega_ITENS_PEDIDO();
                    }
                }
            }
        }
    });

    var TXT_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 270,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'Produto',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var CB_MARCADOS = new Ext.form.Checkbox({
        boxLabel: 'Listar itens marcados para fechar pedido'
    });

    var CB_SO_COTACAO = new Ext.form.Checkbox({
        boxLabel: 'Listar somente itens de cota&ccedil;&atilde;o',
        checked: true
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function () {
            Carrega_ITENS_PEDIDO();
        }
    });

    var formMONITOR = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [TXT_DATA_PEDIDO]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO_COMPRA]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [TXT_FORNECEDOR]
            }, {
                columnWidth: .23,
                layout: 'form',
                items: [TXT_PRODUTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .25,
                layout: 'form',
                items: [CB_MARCADOS]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [CB_SO_COTACAO]
            }, {
                columnWidth: .13,
                layout: 'form',
                items: [BTN_LISTAR_PEDIDOS]
            }]
        }]
    });

    var MONITOR_COTACAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'NOME_FORNECEDOR',
            'NOME_MUNICIPIO', 'SIGLA_UF', 'TELEFONE1_FORNECEDOR', 'TELEFONE2_FORNECEDOR', 'CODIGO_PRODUTO', 'EMAIL_FORNECEDOR',
            'DESCRICAO_PRODUTO', 'QTDE_ITEM_COMPRA', 'QTDE_FORNECEDOR', 'PRECO_FINAL_FORNECEDOR', 'UNIDADE_ITEM_COMPRA',
            'PREVISAO_ENTREGA_ITEM_COMPRA', 'ENTREGA_EFETIVA_ITEM_COMPRA', 'CODIGO_COND_PAGTO', 'DESCRICAO_CP',
            'OBS_ITEM_COMPRA', 'OBS_FORNECEDOR', 'COTACAO_ENVIADA', 'COTACAO_RESPONDIDA', 'COTACAO_VENCEDORA', 'DATA_VALIDADE_COTACAO',
            'MARCA_PEDIDO', 'STATUS_ESPECIFICO_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
                    'COR_FONTE_STATUS_PEDIDO_COMPRA', 'CUSTO_VENDEDOR', 'QTDE_NA_EMBALAGEM_FORNECEDOR'])
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<br /><b>Obs. do item:</b> {OBS_ITEM_COMPRA}<br /><br /><b>Obs. do Fornecedor:</b> {OBS_FORNECEDOR}")
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Habilita_Botoes(s);
            },
            rowdeselect: function (s, Index, record) {
                Habilita_Botoes(s);
            }
        }
    });

    function Habilita_Botoes(s) {
        Ext.getCmp('BTN_MARCAR_PEDIDO_COMPRA').enable();
        Ext.getCmp('BTN_COTACAO_PEDIDO').enable();

        for (var i = 0; i < s.selections.items.length; i++) {
            if (s.selections.items[i].data.COTACAO_RESPONDIDA == 0 || s.selections.items[i].data.COTACAO_RESPONDIDA == 2) {
                Ext.getCmp('BTN_MARCAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_COTACAO_PEDIDO').disable();
            }
        }
    }

    function Status_Fornecedor(val, metadata, record) {

        if (record.data.COTACAO_ENVIADA == 1) {
            if (val == 0)
                return "<span style='font-family: tahoma; width: 100%; background-color: #ffff66; color: #710000;'>AGUARDANDO RESPOSTA</span>";
            else if (val == 1)
                return "<span style='font-family: tahoma; width: 100%; background-color: #009933; color: #ffffcc;'>COTA&Ccedil;&Atilde;O RESPONDIDA</span>";
            else if (val == 2)
                return "<span style='font-family: tahoma; width: 100%; background-color: #000051; color: #ffff66;'>SERVI&Ccedil;O FECHADO</span>";
        }
        else {
            return "<span style='font-family: tahoma; width: 100%; color: red;'>N&Atilde;O ENVIADA</span>";
        }
    }

    function Marca_Pedido(val, metadata, record) {
        if (record.data.MARCA_PEDIDO == 1) {
            return "<span style='font-family: tahoma; width: 100%; background-color: #000051; color: #ffff66;' title='Item Marcado para Fechar Pedido'>" + val + "</span>";
        }
        else
            return val;
    }

    var TXT_PRECO_FORNECEDOR = new Ext.form.NumberField({
        minValue: 0.0000,
        decimalPrecision: 4,
        decimalSeparator: ','
    });

    var TXT_QTDE_FORNECEDOR = new Ext.form.NumberField({
        minValue: 0.00,
        decimalPrecision: 2,
        decimalSeparator: ','
    });

    var TXT_QTDE_NA_EMBALAGEM_FORNECEDOR = new Ext.form.NumberField({
        minValue: 0.00,
        decimalPrecision: 2,
        decimalSeparator: ','
    });

    var grid_MONITOR_COTACAO = new Ext.grid.EditorGridPanel({
        id: 'grid_MONITOR_COTACAO',
        store: MONITOR_COTACAO_Store,
        clicksToEdit: 1,
        tbar: ['-', {
            text: 'Salvar pre&ccedil;o final do fornecedor',
            id: 'BTN_PRECO_FORNECEDOR',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'small',
            handler: function () {
                var arr1 = new Array();

                for (var i = 0; i < MONITOR_COTACAO_Store.getCount(); i++) {
                    if (MONITOR_COTACAO_Store.getAt(i).dirty) {
                        arr1[i] = MONITOR_COTACAO_Store.getAt(i).data;
                    }
                }

                if (arr1.length > 0) {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Salva_Preco_Final_Fornecedor');
                    _ajax.setJsonData({ 
                        ITENS: arr1,
                        ADMIN_USUARIO: _ADMIN_USUARIO,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        for (var i = 0; i < MONITOR_COTACAO_Store.getCount(); i++) {
                            if (MONITOR_COTACAO_Store.getAt(i).dirty) {

                                MONITOR_COTACAO_Store.getAt(i).beginEdit();

                                if (MONITOR_COTACAO_Store.getAt(i).data.PRECO_FINAL_FORNECEDOR > 0.00) {
                                    MONITOR_COTACAO_Store.getAt(i).set('COTACAO_ENVIADA', 1);
                                    MONITOR_COTACAO_Store.getAt(i).set('COTACAO_RESPONDIDA', 1);
                                }
                                else {
                                    MONITOR_COTACAO_Store.getAt(i).set('COTACAO_ENVIADA', 0);
                                    MONITOR_COTACAO_Store.getAt(i).set('COTACAO_RESPONDIDA', 0);
                                }

                                MONITOR_COTACAO_Store.getAt(i).endEdit();
                                MONITOR_COTACAO_Store.getAt(i).commit();
                            }
                        }

                        Ext.getCmp('BTN_MARCAR_PEDIDO_COMPRA').enable();
                        Ext.getCmp('BTN_COTACAO_PEDIDO').enable();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }, '-', {
            text: 'Itens de Compra n&atilde;o fechados',
            id: 'BTN_ITENS_NAO_FECHADOS',
            icon: 'imagens/icones/boolean_field_cancel_16.gif',
            scale: 'small',
            handler: function () {
                _itens_nao_fechados.show('BTN_ITENS_NAO_FECHADOS');
            }
        }],
        columns: [
                    IO_expander,
                    checkBoxSM_,
                { id: 'COTACAO_RESPONDIDA', header: "Status", width: 165, sortable: true, dataIndex: 'COTACAO_RESPONDIDA', renderer: Status_Fornecedor },
                { id: 'STATUS_ESPECIFICO_ITEM_COMPRA', header: "Status Pedido", width: 140, sortable: true, dataIndex: 'STATUS_ESPECIFICO_ITEM_COMPRA', renderer: status_pedido_compra },
                { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Cota&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center', renderer: Marca_Pedido },
                { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 200, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                { id: 'NOME_FORNECEDOR', header: "Raz&atilde;o Social", width: 300, sortable: true, dataIndex: 'NOME_FORNECEDOR', hidden: true },
                { id: 'NOME_MUNICIPIO', header: "Munic&iacute;pio", width: 190, sortable: true, dataIndex: 'NOME_MUNICIPIO', hidden: true },
                { id: 'SIGLA_UF', header: "UF", width: 45, sortable: true, dataIndex: 'SIGLA_UF', hidden: true },
                { id: 'TELEFONE1_FORNECEDOR', header: "Telefone 1", width: 110, sortable: true, dataIndex: 'TELEFONE1_FORNECEDOR', hidden: true },
                { id: 'TELEFONE2_FORNECEDOR', header: "Telefone 2", width: 110, sortable: true, dataIndex: 'TELEFONE2_FORNECEDOR', hidden: true },
                { id: 'EMAIL_FORNECEDOR', header: "e-mail", width: 160, sortable: true, dataIndex: 'EMAIL_FORNECEDOR', hidden: true },

                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 280, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },

                { id: 'QTDE_ITEM_COMPRA', header: "Qtde. Pedida", width: 95, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde, align: 'center' },
                { id: 'QTDE_FORNECEDOR', header: "Qtde. Fornecedor", width: 110, sortable: true, dataIndex: 'QTDE_FORNECEDOR', renderer: FormataQtde, align: 'center',
                    editor: TXT_QTDE_FORNECEDOR
                },
                { id: 'QTDE_NA_EMBALAGEM_FORNECEDOR', header: "Qtde. (Emb.)", width: 100, sortable: true, dataIndex: 'QTDE_NA_EMBALAGEM_FORNECEDOR', align: 'center', renderer: FormataQtde,
                    editor: TXT_QTDE_NA_EMBALAGEM_FORNECEDOR
                },

                { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA' },

                { id: 'CUSTO_VENDEDOR', header: "Custo Vendedor(a)", width: 120, sortable: true, dataIndex: 'CUSTO_VENDEDOR', align: 'center' },

                { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o Final Fornecedor", width: 120, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: FormataValor_4,
                    editor: TXT_PRECO_FORNECEDOR, align: 'center'
                },

                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 90, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
                { id: 'ENTREGA_EFETIVA_ITEM_COMPRA', header: "Entrega Fornecedor", width: 115, sortable: true, dataIndex: 'ENTREGA_EFETIVA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
                { id: 'DESCRICAO_CP', header: "Cond. de Pagamento", width: 250, sortable: true, dataIndex: 'DESCRICAO_CP' },
                { id: 'DATA_VALIDADE_COTACAO', header: "Validade", width: 110, sortable: true, dataIndex: 'DATA_VALIDADE_COTACAO', renderer: XMLParseDate }

                ],
        stripeRows: true,
        height: 400,
        width: '100%',

        sm: checkBoxSM_,

        plugins: IO_expander,
        listeners: {
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }
            }
        }

    });

    var MONITOR_COTACAO_PagingToolbar = new Th2_PagingToolbar();

    MONITOR_COTACAO_PagingToolbar.setStore(MONITOR_COTACAO_Store);

    function RetornaFiltros_MONITOR_JsonData() {
        var _numero = TXT_NUMERO_PEDIDO_COMPRA.getValue();

        if (_numero == '')
            _numero = 0;

        var TB_TRANSP_JsonData = {
            PREVISAO_ENTREGA: TXT_DATA_PEDIDO.getRawValue(),
            FORNECEDOR: TXT_FORNECEDOR.getValue(),
            PRODUTO: TXT_PRODUTO.getValue(),
            NUMERO_PEDIDO_COMPRA: _numero,
            MARCA_PEDIDO: CB_MARCADOS.checked,
            SOMENTE_COTACAO: CB_SO_COTACAO.checked,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: MONITOR_COTACAO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO() {
        MONITOR_COTACAO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Cotacoes_Fornecedor');
        MONITOR_COTACAO_PagingToolbar.setParamsJsonData(RetornaFiltros_MONITOR_JsonData());
        MONITOR_COTACAO_PagingToolbar.doRequest();
    }

    function RetornaFiltros_MONITOR_JsonData_Por_Numero_Pedido() {
        var _numero = TXT_NUMERO_PEDIDO_COMPRA.getValue();

        if (_numero == '')
            _numero = 0;

        var TB_TRANSP_JsonData = {
            NUMERO_PEDIDO_COMPRA: _numero,
            SOMENTE_COTACAO: CB_SO_COTACAO.checked,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: MONITOR_COTACAO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO_POR_NUMERO_PEDIDO() {
        MONITOR_COTACAO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Cotacoes_Fornecedor_Por_Numero_Pedido');
        MONITOR_COTACAO_PagingToolbar.setParamsJsonData(RetornaFiltros_MONITOR_JsonData_Por_Numero_Pedido());
        MONITOR_COTACAO_PagingToolbar.doRequest();
    }

    ///////////////////////////

    function Marca_Itens_Fechar_Pedido() {
        if (grid_MONITOR_COTACAO.getSelectionModel().selections.length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos um item para marcar / desmarcar', 'BTN_MARCAR_PEDIDO_COMPRA')
            return;
        }

        var arr1 = new Array();
        var arr_Record = new Array();

        for (var i = 0; i < grid_MONITOR_COTACAO.getSelectionModel().selections.length; i++) {
            var record = grid_MONITOR_COTACAO.getSelectionModel().selections.items[i];

            arr1[i] = record.data.NUMERO_ITEM_COMPRA;
            arr_Record[i] = record;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Marca_Itens_Fechar');
        _ajax.setJsonData({ itens: arr1, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            for (var n = 0; n < arr_Record.length; n++) {

                arr_Record[n].beginEdit();
                arr_Record[n].set('MARCA_PEDIDO', arr_Record[n].data.MARCA_PEDIDO == 0 ? 1 : 0);
                arr_Record[n].endEdit();

                arr_Record[n].commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_MONITOR = new Ext.Toolbar({
        items: ['-', {
            text: 'Marcar / Desmarcar item(ns) para fechar pedido',
            icon: 'imagens/icones/database_ok_24.gif',
            scale: 'large',
            id: 'BTN_MARCAR_PEDIDO_COMPRA',
            handler: function () {
                var qtde_maior = "";

                for (var i = 0; i < grid_MONITOR_COTACAO.getSelectionModel().selections.length; i++) {
                    var record = grid_MONITOR_COTACAO.getSelectionModel().selections.items[i];

                    if (parseFloat(record.data.QTDE_FORNECEDOR) > parseFloat(record.data.QTDE_ITEM_COMPRA)) {
                        qtde_maior += "<br />[" + record.data.CODIGO_PRODUTO + "]";
                    }
                }

                if (qtde_maior.length > 0) {
                    qtde_maior = "O(s) iten(s) " + qtde_maior + " est&atilde;o com as qtdes maiores do que a qtde pedida, deseja continuar?";

                    dialog.MensagemDeConfirmacao(qtde_maior, 'BTN_MARCAR_PEDIDO_COMPRA', Deleta);

                    function Deleta(btn) {
                        if (btn == 'yes') {
                            Marca_Itens_Fechar_Pedido();
                        }
                    }
                }
                else {
                    Marca_Itens_Fechar_Pedido();
                }
            }
        }, '-', {
            text: 'Transformar Cota&ccedil;&atilde;o em Pedido',
            icon: 'imagens/icones/document_ok_24.gif',
            scale: 'large',
            id: 'BTN_COTACAO_PEDIDO',
            handler: function (btn) {
                _envia_cotacao.Grid(grid_MONITOR_COTACAO);
                _envia_cotacao.show(btn.getId());
            }
        }, '-', {
            id: 'BTN_NOVO_EMAIL_COMPRAS1',
            text: 'Escrever e-mail',
            icon: 'imagens/icones/mail_star_24.gif',
            scale: 'medium',
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
                _janelaNovoEmail.show('BTN_NOVO_EMAIL_COMPRAS1');
            }
        }]
    });

    /////////////////////////

    var panel1 = new Ext.Panel({
        autoHeight: true,
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        title: 'Itens de Cota&ccedil;&atilde;o',
        items: [formMONITOR, grid_MONITOR_COTACAO, MONITOR_COTACAO_PagingToolbar.PagingToolbar(), toolbar_MONITOR]
    });

    grid_MONITOR_COTACAO.setHeight(AlturaDoPainelDeConteudo(262));

    this.PainelMonitor = function () {
        return panel1;
    };
}

function Envia_Cotacao_Fechar_Pedido() {
    var _Mensagem;
    var _grid;
    var _ITENS;

    var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

    _Mensagem = "<P><FONT size=3><STRONG>Pedido de Compras<BR><BR></STRONG></FONT><FONT size=2>O pedido nº [<b>#NUMERO_PEDIDO_COMPRA#</b>] foi fechado, solicitamos efetuar a compra de produtos / serviços com a sua empresa. Acessando o link abaixo, insira o seu <b>e-mail:</b> #EMAIL_FORNECEDOR#, seguido da sua <b>senha:</b> #SENHA#</b><BR><BR><A href='http://localhost:50136/Resposta_Cotacao.htm' target='_blank'>Clique aqui para acessar o pedido</A><br /><br />Caso você não consiga acessar este link, vá até o seu browser de internet e digite http://localhost:50136/Resposta_Cotacao.htm<BR><BR>Atenciosamente,</FONT><BR><BR>#ASSINATURA#</P>";

    _Mensagem = _Mensagem.replace("#ASSINATURA#", _remetente.data.ASSINATURA);
    _Mensagem = _Mensagem.replaceAll("http://localhost:50136/Resposta_Cotacao.htm", _ENDERECO_RESPOSTA_COMPRAS);

    this.Grid = function (pGrid) {
        _grid = pGrid;
    };

    var CB_NAO_ENVIAR_EMAIL = new Ext.form.Checkbox({
        checked: true,
        boxLabel: 'N&atilde;o enviar o e-mail para o fornecedor'
    });

    var TXT_TEXTO_COTACAO = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: 340,
        allowBlank: false,
        hideLabel: true,
        value: _Mensagem
    });

    TXT_TEXTO_COTACAO.setValue(_Mensagem);

    var bg_enviar_cotacao = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_SOLICITA_CONFIRMA_PEDIDO',
            text: 'Fechar Pedido',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'medium',
            handler: function () {
                if (TXT_TEXTO_COTACAO.getRawValue().trim().length == 0) {
                    dialog.MensagemDeErro('Digite o texto de apresenta&ccedil;&tilde;o da sua Cota&ccedil;&atilde;o', 'BTN_SOLICITA_CONFIRMA_PEDIDO');
                    return;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Fecha_Pedido');
                _ajax.setJsonData({
                    Mensagem: TXT_TEXTO_COTACAO.getRawValue(),
                    NAO_ENVIAR_EMAIL: CB_NAO_ENVIAR_EMAIL.checked ? true : false,
                    ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
                    FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
                    NOME_FANTASIA_EMITENTE: _EMITENTE,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < _grid.getStore().data.items.length; i++) {
                        var record = _grid.getStore().data.items[i];

                        if (record.data.MARCA_PEDIDO == 1) {
                            record.beginEdit();
                            record.set('MARCA_PEDIDO', 0);
                            record.set('COTACAO_RESPONDIDA', 2);
                            record.set('COTACAO_VENCEDORA', 1);
                            record.endEdit();
                            record.commit();
                        }
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
            items: [CB_NAO_ENVIAR_EMAIL]
        }, {
            layout: 'form',
            items: [TXT_TEXTO_COTACAO]
        }, {
            items: [toolbar_enviar_cotacao]
        }]
    });

    var wENVIAR_COTACAO = new Ext.Window({
        layout: 'form',
        title: 'Confirma&ccedil;&atilde;o de Pedido de Compra',
        iconCls: 'icone_ENVIA_COTACAO',
        width: 800,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        height: 492,
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