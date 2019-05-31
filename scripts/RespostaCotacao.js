function Mantem_Sessao1() {
    var t = setTimeout("Envia1()", 600000); // 10 minutos
}

function Envia1() {
    var _ajax = new Th2_Ajax()
    _ajax.setUrl('servicos/WSLogin.asmx/Mantem_Sessao');
    _ajax.ExibeDivProcessamento(false);

    var _sucess = function(response, options) {
        var result = Ext.decode(response.responseText).d;

        if (result == 1) {
            var t = setTimeout("Envia1()", 600000);
        }
    };

    var _falha = function(response, options) {
        Encerra_Sessao1();
    };

    _ajax.setReportaErro(false);

    _ajax.setFalha(_falha);
    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Encerra_Sessao1() {
    var _ajax = new Th2_Ajax()
    _ajax.setUrl('servicos/WSLogin.asmx/Logoff');

    var _sucess = function(response, options) {
        Store_ITEMS_COTACAO.removeAll();
        CHAVE_COTACAO = null;

        TXT_CHAVE.reset();
        TXT_CHAVE.focus();

        wResposta.show();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Monta_Resposta_Cotacao() {
    var CHAVE_COTACAO;
    var record_item_cotacao;
    var desabilitaGrid = false;

    this.SETA_CHAVE = function(pCHAVE) {
        CHAVE_COTACAO = pCHAVE;
    };

    this.SETA_RECORD_ITEM_COTACAO = function(record) {
        record_item_cotacao = record;
    };

    this.DesabilitaGrid = function(pDesabilta) {
        desabilitaGrid = pDesabilta;
    };

    var buttonGroup_ITEMS_COTACAO = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_COTACAO_SALVAR',
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function() {
                var array1 = new Array();
                var arr_Record = new Array();
                var i = 0;

                Store_ITEMS_COTACAO.each(Salva_Store);

                function Salva_Store(record) {
                    if (record.dirty) {

                        var data = record.data.ENTREGA_EFETIVA_ITEM_COMPRA + "";

                        if (record.data.PRECO_FINAL_FORNECEDOR > 0.0000 && data.length > 0 &&
                            record.data.QTDE_FORNECEDOR > 0.00) {

                            var _qtde = record.data.QTDE_FORNECEDOR + "";
                            _qtde = _qtde.replace(".", ",");

                            var _preco = record.data.PRECO_FINAL_FORNECEDOR + "";
                            _preco = _preco.replace(".", ",");

                            array1[i] = {
                                NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                                NUMERO_ITEM_COMPRA: record.data.NUMERO_ITEM_COMPRA,
                                CHAVE_COTACAO: CHAVE_COTACAO,
                                QTDE_FORNECEDOR: _qtde,
                                PRECO_FINAL_FORNECEDOR: _preco,
                                PREVISAO_ENTREGA: formatDate(record.data.ENTREGA_EFETIVA_ITEM_COMPRA),
                                OBS_FORNECEDOR: record.data.OBS_FORNECEDOR
                            };

                            arr_Record[i] = record;
                            i++;
                        }
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Salva_Itens_Fornecedor');
                _ajax.setJsonData({ LINHAS: array1 });

                var _sucess = function(response, options) {
                    for (var n = 0; n < arr_Record.length; n++) {
                        arr_Record[n].commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_COTACAO_RESPONDER',
            text: 'Confirmar e Responder Cota&ccedil;&atilde;o',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'medium',
            handler: function() {
                var array1 = new Array();
                var arr_Record = new Array();

                for (var i = 0; i < GRID_ITEMS_COTACAO.getStore().data.items.length; i++) {
                    var record = GRID_ITEMS_COTACAO.getStore().data.items[i];

                    if (record.dirty) {
                        dialog.MensagemDeErro('Salve as suas altera&ccedil;&otilde;es antes de confirmar a cota&ccedil;&atilde;o', 'BTN_COTACAO_RESPONDER');
                        return;
                    }
                }

                for (var i = 0; i < GRID_ITEMS_COTACAO.getStore().data.items.length; i++) {
                    var record = GRID_ITEMS_COTACAO.getStore().data.items[i];

                    array1[i] = record.data.NUMERO_ITEM_COMPRA;
                    arr_Record[i] = record;
                }

                dialog.MensagemDeConfirmacao('Confirma o envio da cota&ccedil;&atilde;o?<br />Uma vez que voc&ecirc; confirmar esta a&ccedil;&atilde;o, esta cota&ccedil;&atilde;o n&atilde;o poder&aacute; ser alterada novamente', 'BTN_COTACAO_RESPONDER', Deleta);

                function Deleta(btn) {
                    if (btn == 'yes') {
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Responder_Cotacao');
                        _ajax.setJsonData({ LINHAS: array1 });

                        var _sucess = function(response, options) {
                            for (var n = 0; n < arr_Record.length; n++) {
                                arr_Record[n].beginEdit();
                                arr_Record[n].set('COTACAO_RESPONDIDA', 1);
                                arr_Record[n].endEdit();
                                arr_Record[n].commit();
                            }

                            TB_ITEMS_COTACAO.disable();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }
}]
        });

        var TB_ITEMS_COTACAO = new Ext.Toolbar({
            style: 'text-align: right;',
            items: [buttonGroup_ITEMS_COTACAO]
        });

        var Store_ITEMS_COTACAO = new Ext.data.Store({
            reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'QTDE_FORNECEDOR',
         'QTDE_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'ENTREGA_EFETIVA_ITEM_COMPRA',
            'CODIGO_COND_PAGTO', 'DESCRICAO_CP', 'OBS_ITEM_COMPRA', 'PRECO_FINAL_FORNECEDOR', 'OBS_FORNECEDOR', 'COTACAO_RESPONDIDA',
            'DATA_VALIDADE_COTACAO', 'COTACAO_ENVIADA'])
        });

        var TXT_QTDE_FORNECEDOR = new Ext.form.NumberField({
            decimalPrecision: casasDecimais_Qtde,
            minValue: 0.001,
            decimalSeparator: ',',
            value: 0,
            allowBlank: false
        });

        var TXT_PRECO_FINAL_FORNECEDOR = new Ext.form.NumberField({
            decimalPrecision: 4,
            minValue: 0.0001,
            decimalSeparator: ',',
            value: 0,
            allowBlank: false
        });

        var TXT_PREVISAO_ENTREGA = new Ext.form.DateField({
            allowBlank: false,
            width: 92
        });

        var TXT_OBS_FORNECEDOR = new Ext.form.TextField({
            height: 40,
            autoCreate: { tag: 'textarea', autocomplete: 'off' }
        });

        var IO_expander = new Ext.ux.grid.RowExpander({
            expandOnEnter: false,
            expandOnDblClick: false,

            tpl: new Ext.Template("<hr /><b>Descrição do produto:</b> {DESCRICAO_PRODUTO}<br /><b>Obs. do Item:</b> {OBS_ITEM_COMPRA}")
        });

        function FormataQtde1(val) {
            return "<span style='width: 100%; background-color: #d6d6d6; color: #2b2c55;' title='Celula protegida'>" + FormataQtde(val) + "</span>";
        }

        function CelulaProtegida(val) {
            return "<span style='width: 100%; background-color: #d6d6d6; color: #2b2c55;' title='Celula protegida'>" + val + "</span>";
        }

        function formatDate1(val) {
            return "<span style='width: 100%; background-color: #d6d6d6; color: #2b2c55;' title='Celula protegida'>" + XMLParseDate(val) + "</span>";
        }

        function Status_Cotacao_Fornecedor(val) {
            if (val == 0)
                return "<span style='font-family: tahoma; width: 100%; background-color: #ffff66; color: #710000;'>AGUARDANDO SUA RESPOSTA</span>";
            else if (val == 1)
                return "<span style='font-family: tahoma; width: 100%; background-color: #009933; color: #ffffcc;'>COTA&Ccedil;&Atilde;O RESPONDIDA</span>";
            else if (val == 2)
                return "<span style='font-family: tahoma; width: 100%; background-color: #000051; color: #ffff66;'>SERVI&Ccedil;O FECHADO</span>";
        }

        var GRID_ITEMS_COTACAO = new Ext.grid.EditorGridPanel({
            id: 'GRID_ITEMS_COTACAO',
            store: Store_ITEMS_COTACAO,
            enableColumnHide: false,
            clicksToEdit: 1,
            columns: [
                IO_expander,
                { id: 'COTACAO_RESPONDIDA', header: "Status", width: 165, sortable: true, dataIndex: 'COTACAO_RESPONDIDA', renderer: Status_Cotacao_Fornecedor },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO', renderer: CelulaProtegida },
                { id: 'QTDE_ITEM_COMPRA', header: "Qtde. Pedida", width: 95, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', renderer: FormataQtde1, align: 'center' },
                { id: 'QTDE_FORNECEDOR', header: "Consigo Atender", width: 110, sortable: true, dataIndex: 'QTDE_FORNECEDOR', renderer: FormataQtde, align: 'center',
                    editor: TXT_QTDE_FORNECEDOR
                },
                { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', renderer: CelulaProtegida },
                { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o Final", width: 95, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: FormataValor_4,
                    editor: TXT_PRECO_FINAL_FORNECEDOR, align: 'right'
                },

                { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 90, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: formatDate1, align: 'center' },
                { id: 'ENTREGA_EFETIVA_ITEM_COMPRA', header: "Entrega Efetiva", width: 100, sortable: true, dataIndex: 'ENTREGA_EFETIVA_ITEM_COMPRA', renderer: formatDate, align: 'center',
                    editor: TXT_PREVISAO_ENTREGA
                },
                { id: 'DESCRICAO_CP', header: "Cond. de Pagamento", width: 250, sortable: true, dataIndex: 'DESCRICAO_CP', renderer: CelulaProtegida },
                { id: 'OBS_FORNECEDOR', header: "Observa&ccedil;&otilde;es", width: 600, sortable: true, dataIndex: 'OBS_FORNECEDOR',
                    editor: TXT_OBS_FORNECEDOR
                },
                { id: 'DATA_VALIDADE_COTACAO', header: "Validade", width: 100, sortable: true, dataIndex: 'DATA_VALIDADE_COTACAO', renderer: formatDate }
                ],
            stripeRows: true,
            height: 500,
            width: '100%',

            plugins: IO_expander,

            stripeRows: true,
            width: '100%',
            height: 300,
            listeners: {
                beforeedit: function(e) {
                    if (e.record.data.COTACAO_RESPONDIDA >= 1) {
                        e.cancel = true;
                    }
                }
            }
        });

        function Retorna_JsonData() {
            var CP_JsonData = {
                CHAVE_COTACAO: CHAVE_COTACAO,
                start: 0,
                limit: Th2_LimiteDeLinhasPaginacao
            };

            return CP_JsonData;
        }

        var ITEMS_COTACAO_PagingToolbar = new Th2_PagingToolbar();
        ITEMS_COTACAO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Carrega_Itens_Cotacao_Chave');
        ITEMS_COTACAO_PagingToolbar.setStore(Store_ITEMS_COTACAO);

        function ITEMS_COTACAO_CARREGA_GRID(_utlimaPagina) {
            ITEMS_COTACAO_PagingToolbar.setParamsJsonData(Retorna_JsonData());
            ITEMS_COTACAO_PagingToolbar.doRequest();
        }

        function Adiciona_Registro() {
            if (Store_CUSTO_ITEM_PEDIDO.getCount() > 0) {
                var record = Store_CUSTO_ITEM_PEDIDO.getAt(Store_CUSTO_ITEM_PEDIDO.getCount() - 1);

                if (record.data.NUMERO_CUSTO_VENDA.length > 0) {
                    nova_linha();
                }
            }
            else {
                nova_linha();
            }

            function nova_linha() {
                var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_PEDIDO' },
                        { name: 'NUMERO_ITEM' },
                        { name: 'NUMERO_CUSTO_VENDA' },
                        { name: 'CUSTO_ITEM_PEDIDO' },
                        { name: 'PREVISAO_ENTREGA1' }
                    ]);

                var novo = new new_record({
                    NUMERO_PEDIDO: NUMERO_PEDIDO,
                    NUMERO_ITEM: NUMERO_ITEM,
                    NUMERO_CUSTO_VENDA: '',
                    CUSTO_ITEM_PEDIDO: 0.0000,
                    PREVISAO_ENTREGA1: ''
                });

                Store_CUSTO_ITEM_PEDIDO.insert(Store_CUSTO_ITEM_PEDIDO.getCount(), novo);
            }
        }

        var pCotacao = new Ext.Panel({
            width: '100%',
            border: true,
            title: 'Responder Cota&ccedil;&atilde;o',
            renderTo: 'gridCotacao',
            items: [GRID_ITEMS_COTACAO, ITEMS_COTACAO_PagingToolbar.PagingToolbar(), TB_ITEMS_COTACAO]
        });

        GRID_ITEMS_COTACAO.setHeight(AlturaDoPainelDeConteudo(365));

        var CNPJ_FORNECEDOR = new Th2_FieldMascara({
            fieldLabel: 'CNPJ',
            width: 150,
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '18' },
            allowBlank: false,
            enableKeyEvents: true,
            Mascara: '99.999.999/9999-99'
        });

        var TXT_CHAVE = new Ext.form.NumberField({
            fieldLabel: 'Chave da Cota&ccedil;&atilde;o',
            allowBlank: false,
            maxLength: 15,
            minValue: 1,
            listeners: {
                specialkey: function(f, e) {
                    if (e.getKey() == e.ENTER) {
                        validaChave();
                    }
                }
            }
        });

        var btnLoginCotacao = new Ext.Button({
            text: 'Ok',
            icon: 'imagens/icones/administrator_ok_24.gif',
            scale: 'medium',
            handler: function() {
                validaChave();
            }
        });

        var btnLogoff = new Ext.Button({
            id: 'btnLogoff',
            text: 'Logoff',
            icon: 'imagens/icones/user_down_24.gif',
            scale: 'medium',
            renderTo: Ext.get('btn_Logoff'),
            handler: function() {
                var _ajax = new Th2_Ajax()
                _ajax.setUrl('servicos/WSLogin.asmx/Logoff');

                var _sucess = function(response, options) {
                    Store_ITEMS_COTACAO.removeAll();
                    CHAVE_COTACAO = null;

                    TXT_CHAVE.reset();
                    TXT_CHAVE.focus();

                    wResposta.show();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        });

        function validaChave() {
            if (!TXT_CHAVE.isValid() || !CNPJ_FORNECEDOR.isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/WSLogin.asmx/validaChave');
            _ajax.setJsonData({ dados: { CNPJ_FORNECEDOR: CNPJ_FORNECEDOR.getValue(), CHAVE_COTACAO: TXT_CHAVE.getValue()} });

            var _sucesso = function(response, options) {
                var result = Ext.decode(response.responseText).d;

                CHAVE_COTACAO = TXT_CHAVE.getValue();
                ITEMS_COTACAO_CARREGA_GRID();

                wResposta.hide();

                var x = Ext.get('div_Instrucoes').dom.innerHTML;

                x = x.replace('#Th2#', result.NOME_EMITENTE);

                Ext.get('div_Instrucoes').dom.innerHTML = x;

                if (result.COTACAO_RESPONDIDA == 1) {
                    TB_ITEMS_COTACAO.disable();
                }
                else {
                    TB_ITEMS_COTACAO.enable();
                }

                Mantem_Sessao1();
            };

            _ajax.setSucesso(_sucesso);
            _ajax.Request();
        }

        var formLoginCotacao = new Ext.FormPanel({
            labelWidth: 120,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '100%',
            items: [{
                xtype: 'panel',
                height: 67,
                width: '100%',
                html: "<img src='imagens/logo_vendas.png' style='width: 160px; height: 67px;' />"
            }, {
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Chave de Acesso à Cota&ccedil;&atilde;o',
                autoHeight: true,
                items: [{
                    layout: 'form',
                    items: [CNPJ_FORNECEDOR]
                }, {
                    layout: 'form',
                    items: [TXT_CHAVE]
                }, {
                    items: [btnLoginCotacao]
}]
}]
                });

                var wResposta = new Ext.Window({
                    title: '&nbsp;&nbsp;Cota&ccedil;&atilde;o de Compras',
                    width: 385,
                    iconCls: 'icone_Th2',
                    autoHeight: true,
                    closable: false,
                    draggable: true,
                    resizable: false,
                    modal: true,
                    renderTo: Ext.getBody(),
                    items: [formLoginCotacao]
                });

                this.inicia = function() {
                    GRID_ITEMS_COTACAO.setHeight(AlturaDoPainelDeConteudo(203));
                    wResposta.show();
                };
            }