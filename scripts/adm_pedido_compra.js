function Adm_Pedido_Compra() {

    function Lista_Ordem_Recebimento() {

        var _hoje = new Date();

        var TXT_DATA_FINAL = new Ext.form.DateField({
            layout: 'form',
            fieldLabel: 'Entregas de clientes at&eacute;',
            width: 94,
            value: _hoje,
            allowBlank: false,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        Imprime();
                    }
                }
            }
        });

        var BTN_IMPRIMIR = new Ext.Button({
            text: 'Listar',
            icon: 'imagens/icones/book_ok_24.gif',
            scale: 'large',
            handler: function () {
                Imprime();
            }
        });

        var form1 = new Ext.FormPanel({
            bodyStyle: 'padding:2px 2px 0',
            frame: true,
            labelAlign: 'top',
            width: '100%',
            items: [{
                layout: 'column',
                items: [{
                    layout: 'form',
                    columnWidth: .65,
                    items: [TXT_DATA_FINAL]
                }, {
                    columnWidth: .35,
                    items: [BTN_IMPRIMIR]
                }]
            }]
        });

        function Imprime() {
            if (!form1.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Doran_Ordem_de_Recebimento');
            _ajax.setJsonData({
                dataFinal: TXT_DATA_FINAL.getRawValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                Window1.hide();

                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');

                delete _ajax;
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var Window1 = new Ext.Window({
            layout: 'form',
            title: 'Ordem de recebimento de mercadorias / Prioridade de entregas de clientes',
            iconCls: 'icone_TB_NOTA_SAIDA',
            width: 320,
            height: 108,
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
            items: [form1]
        });

        this.show = function (elm) {
            Window1.show(elm);
        };
    }

    var lista = new Monta_Recebimento_Mercadoria();
    var nota_entrada;

    var notas = new Janela_Notas_Pedido_Compra();

    var janela_pedidos_venda = new JANELA_PEDIDO_VENDA();

    var _vendas = new JANELA_ITENS_VENDA();

    var _furo_estoque = new Furo_Estoque();

    var trocar_fornecedor = new BUSCA_FORNECEDOR();

    var _janelaNovoEmail = new janela_Envio_Email('_adm_compra');

    var _lista_ordem_recebimento = new Lista_Ordem_Recebimento();

    var _janela_Alcada_Aprovacao = new janela_Alcada_Aprovacao();

    var _janelaAltera_Status_Item_Pedido = new janelaAltera_Status_Item_Pedido();

    var _janela_Filtro_Status_Pedido_Compra = new janela_Filtro_Status_Pedido_Compra();

    var _janela_Programacao_Carteira = new janela_Programacao_Carteira();


    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        width: 90,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Lista_Itens_por_Numero_Pedido();
                    }
                    else {
                        Carrega_ITENS_PEDIDO(f);
                    }
                }
            }
        }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    var TXT_ENTREGA = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Entrega',
        width: 94,
        value: dt1,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var TXT_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 180,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var TXT_NUMERO_NF = new Ext.form.NumberField({
        fieldLabel: 'Numero da NF',
        width: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_VENDA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Nr. Pedido de Venda',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var CB_QTDE_NF = new Ext.form.Checkbox({
        boxLabel: 'Listar somente os itens com quantidades de NFs gravadas'
    });

    var CB_RECEBIDO = new Ext.form.Checkbox({
        boxLabel: 'Listar somente os itens recebidos'
    });

    var BTN_STATUS_PEDIDO = new Ext.Button({
        text: 'Status de Pedido',
        icon: 'imagens/icones/database_level_24.gif',
        scale: 'large',
        listeners: {
            click: function (button, e) {
                if (!showFiltroStatusCompra)
                    _janela_Filtro_Status_Pedido_Compra.show(Ext.getCmp(button.getId()));
                else
                    _janela_Filtro_Status_Pedido_Compra.hide();
            }
        }
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function (btn) {
            Carrega_ITENS_PEDIDO(btn);
        }
    });

    var BTN_CARTEIRA_VENDEDORES = new Ext.Button({
        text: 'Carteira de vendedores',
        icon: 'imagens/icones/calendar_24.gif',
        scale: 'large',
        handler: function (btn) {
            if (Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length == 0) {
                dialog.MensagemDeErro('Selecione 1 item consultar / alterar os vendedores da programa&ccedil;&atilde;o', btn.getId());
                return;
            }

            var Arr1 = new Array();
            var Arr2 = new Array();
            var Arr3 = new Array();

            Arr1[i] = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.NUMERO_PEDIDO_COMPRA;
            Arr2[i] = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.NUMERO_ITEM_COMPRA;
            Arr3[i] = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.ID_PRODUTO_COMPRA;

            _janela_Programacao_Carteira.NUMEROS_PEDIDO_COMPRA(Arr1);
            _janela_Programacao_Carteira.NUMEROS_ITEM_COMPRA(Arr2);
            _janela_Programacao_Carteira.IDS_PRODUTO(Arr3);
            _janela_Programacao_Carteira.CODIGO_PRODUTO(Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.CODIGO_PRODUTO_COMPRA);
            _janela_Programacao_Carteira.record_compra(Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0]);

            _janela_Programacao_Carteira.show(btn);
        }
    });

    var formPEDIDO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                items: [TXT_ENTREGA]
            }, {
                columnWidth: .13,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_FORNECEDOR]
            }, {
                columnWidth: .13,
                layout: 'form',
                items: [TXT_NUMERO_NF]
            }, {
                columnWidth: .13,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO_VENDA]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO]
            }, {
                xtype: 'label',
                html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            }, {
                layout: 'form',
                items: [CB_QTDE_NF]
            }, {
                xtype: 'label',
                html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            }, {
                layout: 'form',
                items: [CB_RECEBIDO]
            }, {
                xtype: 'label',
                html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            }, {
                items: [BTN_CARTEIRA_VENDEDORES]
            }, {
                xtype: 'label',
                html: '&nbsp;&nbsp;'
            }, {
                layout: 'form',
                items: [BTN_STATUS_PEDIDO]
            }, {
                xtype: 'label',
                html: '&nbsp;&nbsp;'
            }, {
                items: [BTN_LISTAR_PEDIDOS]
            }]
        }]
    });

    ///// grid
    var PEDIDO_COMPRA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'STATUS_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
            'COR_FONTE_STATUS_PEDIDO_COMPRA', 'STATUS_ESPECIFICO_ITEM_COMPRA', 'NUMERO_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA',
            'CODIGO_PRODUTO_COMPRA', 'QTDE_ITEM_COMPRA', 'PREVISAO_ENTREGA', 'QTDE_RECEBIDA',
            'DATA_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PRECO_ITEM_COMPRA', 'VALOR_TOTAL_ITEM_COMPRA', 'ALIQ_ICMS_ITEM_COMPRA',
            'VALOR_ICMS_ITEM_COMPRA', 'VALOR_ICMS_ST_ITEM_COMPRA', 'ALIQ_IPI_ITEM_COMPRA', 'VALOR_IPI_ITEM_COMPRA',
            'CODIGO_CFOP_ITEM_COMPRA', 'CODIGO_FORNECEDOR_ITEM_COMPRA', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
            'NUMERO_LOTE_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'OBS_ITEM_COMPRA',
            'CONTATO_COTACAO_FORNECEDOR', 'TELEFONE_COTACAO_FORNECEDOR', 'DESCRICAO_CP', 'ENDERECO_FORNECEDOR',
            'OBS_FORNECEDOR', 'EMAIL_COTACAO_FORNECEDOR', 'FRETE_COTACAO_FORNECEDOR',
            'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_ST', 'TOTAL_PEDIDO', 'VALOR_FRETE',
            'STATUS_ESPECIFICO_ITEM_COMPRA', 'ATRASADA', 'ORDEM_COMPRA_FORNECEDOR',
            'QTDE_NF_ITEM_COMPRA', 'COTACAO_RESPONDIDA', 'COTACAO_ENVIADA', 'COTACAO_VENCEDORA', 'CODIGO_FORNECEDOR',
            'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'ITENS_ASSOCIADOS', 'TELEFONE1_FORNECEDOR', 'TELEFONE2_FORNECEDOR',
            'TIPO_DESCONTO_ITEM_COMPRA', 'VALOR_DESCONTO_ITEM_COMPRA', 'PRECO_FINAL_FORNECEDOR', 'ID_PRODUTO_COMPRA',
            'STATUS_RNC', 'PESO_PRODUTO', 'TOTAL_PRODUTOS', 'AVALIACAO', 'PROGRAMACAO_CHEGADA']
           )
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<table style='width: 70%;'><tr><td>" +
                    "<table>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Produto</b>:</td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_PRODUTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Endere&ccedil;o do Fornecedor:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {ENDERECO_FORNECEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Cond. Pagto:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_CP}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>(0-FOB | 1-CIF):</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {FRETE_COTACAO_FORNECEDOR}</td></tr>" +

                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Contato:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {CONTATO_COTACAO_FORNECEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Telefone:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {TELEFONE_COTACAO_FORNECEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>e-mail:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {EMAIL_COTACAO_FORNECEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs.:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_ITEM_COMPRA}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs. Fornecedor:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_FORNECEDOR}</td></tr></table>" +
                    "</td></tr></table>"
                    )
    });

    function Habilita_Botoes(s, record) {
        Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').enable();
        Ext.getCmp('BTN_IMPRIMIR_PEDIDO_COMPRA').enable();
        Ext.getCmp('BTN_PEDIDO_FORNECEDOR').enable();
        Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').enable();
        Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').enable();
        Ext.getCmp('BTN_RECEBIMENTO_MERCADORIA').enable();
        Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').enable();
        Ext.getCmp('BTN_GERAR_NOTA_ENTRADA').enable();
        Ext.getCmp('BTN_SALVAR_QTDE_NF').enable();
        Ext.getCmp('BTN_RNC1').enable();
        Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').enable();

        Ext.getCmp('BTN_LIBERAR_PEDIDO_COMPRA').enable();
        Ext.getCmp('BTN_SOLICITAR_LIBERACAO_PEDIDO_COMPRA').enable();

        if (record) {
            if ((record.data.TOTAL_PRODUTOS > _VALOR_MAXIMO_APROVACAO) &&
                record.data.STATUS_ESPECIFICO_ITEM_COMPRA == 7) {

                Ext.getCmp('BTN_LIBERAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_IMPRIMIR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_PEDIDO_FORNECEDOR').disable();
                Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').disable();
                Ext.getCmp('BTN_RECEBIMENTO_MERCADORIA').disable();
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
                Ext.getCmp('BTN_GERAR_NOTA_ENTRADA').disable();
                Ext.getCmp('BTN_SALVAR_QTDE_NF').disable();
                Ext.getCmp('BTN_FURO_ESTOQUE').disable();
                Ext.getCmp('BTN_PEDIDOS_VENDA1').disable();
                Ext.getCmp('BTN_ENVIAR_PEDIDO_EMAIL').disable();
                Ext.getCmp('BTN_RNC1').disable();
                Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
            }

            if (record.data.STATUS_ESPECIFICO_ITEM_COMPRA != 7) {
                Ext.getCmp('BTN_LIBERAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_SOLICITAR_LIBERACAO_PEDIDO_COMPRA').disable();
            }

            if (_janela_Programacao_Carteira) {
                if (_janela_Programacao_Carteira.shown()) {
                    var Arr1 = new Array();
                    var Arr2 = new Array();
                    var Arr3 = new Array();

                    Arr1[0] = record.data.NUMERO_PEDIDO_COMPRA;
                    Arr2[0] = record.data.NUMERO_ITEM_COMPRA;
                    Arr3[0] = record.data.ID_PRODUTO_COMPRA;

                    _janela_Programacao_Carteira.NUMEROS_PEDIDO_COMPRA(Arr1);
                    _janela_Programacao_Carteira.NUMEROS_ITEM_COMPRA(Arr2);
                    _janela_Programacao_Carteira.IDS_PRODUTO(Arr3);
                    _janela_Programacao_Carteira.CODIGO_PRODUTO(record.data.CODIGO_PRODUTO_COMPRA);
                    _janela_Programacao_Carteira.record_compra(record);

                    _janela_Programacao_Carteira.carrrega_Grid();
                }
            }
        }

        for (var i = 0; i < s.selections.items.length; i++) {

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 1) {
                Ext.getCmp('BTN_IMPRIMIR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_PEDIDO_FORNECEDOR').disable();
                Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').disable();
                Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_RECEBIMENTO_MERCADORIA').disable();
                Ext.getCmp('BTN_GERAR_NOTA_ENTRADA').disable();
                Ext.getCmp('BTN_SALVAR_QTDE_NF').disable();
                Ext.getCmp('BTN_RNC1').disable();

                if (s.selections.items[i].data.COTACAO_RESPONDIDA == 0) {
                    Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').disable();
                }

                if (s.selections.items[i].data.ORDEM_COMPRA_FORNECEDOR == 1 ||
                                s.selections.items[i].data.COTACAO_VENCEDORA == 0) {
                    Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
                    Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
                }
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 2 ||
                            s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 6) {
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 3) {
                Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').disable();
                if (_USUARIO_ADMIN_COMPRAS != 1) {
                    Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').disable();
                }
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
                Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 4) {
                Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').disable();
                if (_USUARIO_ADMIN_COMPRAS != 1) {
                    Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').disable();
                }
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
                Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 5) {
                Ext.getCmp('BTN_IMPRIMIR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_PEDIDO_FORNECEDOR').disable();
                Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_ALTERAR_PEDIDO_COMPRA').disable();
                Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').disable();
                Ext.getCmp('BTN_TRANSFORMAR_PEDIDO1').disable();
                Ext.getCmp('BTN_GERAR_NOTA_ENTRADA').disable();
                Ext.getCmp('BTN_SALVAR_QTDE_NF').disable();
                Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO_ITEM_COMPRA == 7) {
                Ext.getCmp('BTN_ALTERAR_FASE_PEDIDO').disable();
            }
        }
    }

    var TXT_ENTREGA1 = new Ext.form.DateField({
        width: 90,
        allowBlank: false
    });

    var TXT_QTDE_NF = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0
    });

    function FormataQtdeNF(val) {
        return val > 0.000 ?
                "<span style='width: 100%; color: blue;' title='Qtde a ser gravada na NF'>" + FormataQtde(val) + "</span>" :
                FormataQtde(val);
    }

    var checkBoxSM_PC = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Habilita_Botoes(s, record);
            },
            rowdeselect: function (s, Index, record) {
                Habilita_Botoes(s, record);
            }
        }
    });

    function Avaliacao_Compra(val) {
        return val > 0 ? "<span style='width: 100%; background-color: #99CCFF; color: navy; cursor: pointer;' title='Clique para consultar as avaliações deste item'>&nbsp;" + val + "&nbsp;</span>"
            : val;
    }

    function carteiraFornecedor(val) {
        return val == 1 ? "<span style='width: 100%; background-color: #FFFF99; color: #003300;' title='Clique para consultar / alterar os vendedores desta carteira'>COM RESERVA</span>" :
            "<span style='width: 100%; background-color: #FFFF99; color: #FF0000;' title='Clique para consultar / alterar os vendedores desta carteira'>SEM RESERVA</span>";
    }

    var grid_PEDIDO_COMPRA1 = new Ext.grid.EditorGridPanel({
        id: 'grid_PEDIDO_COMPRA1',
        store: PEDIDO_COMPRA_Store,
        tbar: [{
            text: 'Recebimento de<br />Mercadorias',
            id: 'BTN_RECEBIMENTO_MERCADORIA',
            icon: 'imagens/icones/data_transport_reload_16.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione 1 ou mais itens para visualizar / alterar os recebimentos', 'BTN_RECEBIMENTO_MERCADORIA');
                    return;
                }

                var ArrRecord = new Array();

                for (var i = 0; i < Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length; i++) {
                    ArrRecord[i] = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[i];
                }

                lista.SETA_RECORD_ITEM_COMPRA(ArrRecord);
                lista.CARREGA_GRID();

                lista.show('BTN_RECEBIMENTO_MERCADORIA');
            }
        }, '-', {
            id: 'BTN_SALVAR_QTDE_NF',
            text: 'Salvar quantidades<br />da NF de Entrada',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'large',
            handler: function () {
                var array1 = new Array();
                var array2 = new Array();

                var arr_Record = new Array();

                for (var i = 0; i < grid_PEDIDO_COMPRA1.getStore().getCount(); i++) {

                    var record = grid_PEDIDO_COMPRA1.getStore().getAt(i);

                    if (record.dirty) {
                        array1[i] = record.data.NUMERO_ITEM_COMPRA;
                        array2[i] = record.data.QTDE_NF_ITEM_COMPRA;

                        arr_Record[i] = record;
                    }
                }

                if (arr_Record.length > 0) {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Grava_Qtde_NF');
                    _ajax.setJsonData({
                        NUMEROS_ITEM_COMPRA: array1,
                        QTDE_NF: array2,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        for (var n = 0; n < grid_PEDIDO_COMPRA1.getStore().getCount(); n++) {

                            var record = grid_PEDIDO_COMPRA1.getStore().getAt(n);

                            if (record.dirty) {
                                record.commit();
                            }
                        }
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }, '-', {
            id: 'BTN_GERAR_NOTA_ENTRADA',
            text: 'Gerar Nota<br />de Entrada',
            icon: 'imagens/icones/file_ok_16.gif',
            scale: 'large',
            handler: function () {
                if (!nota_entrada)
                    nota_entrada = new Gera_Nota_Entrada();

                nota_entrada.show('BTN_GERAR_NOTA_ENTRADA');
            }
        }, '-', {
            id: 'BTN_RNC1',
            icon: 'imagens/icones/sql_query_delete_16.gif',
            text: 'Registro de RNC',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para abrir uma RNC', 'BTN_RNC1');
                    return;
                }

                var record = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[0];

                var tabs = Ext.getCmp('tabConteudo');

                for (var i = 0; i < tabs.items.length; i++) {
                    if (tabs.items.items[i].title == "Registro de RNC") {

                        var tab = tabs.items.items[i];

                        tabs.remove(tab, true);
                    }
                }

                // Nova Aba

                var tela1 = MontaOcorrenciaRNC(0,
                                    0, record.data.NUMERO_PEDIDO_COMPRA, record.data.NUMERO_ITEM_COMPRA, '', record.data.CODIGO_PRODUTO_COMPRA,
                                    record.data.CODIGO_FORNECEDOR);

                CriaEConfiguraNovaTab("Registro de RNC", true, tela1);
            }
        }, '-', {
            id: 'BTN_PEDIDOS_VENDA1',
            text: 'Associar Itens<br />de Venda',
            icon: 'imagens/icones/copy_level2_16.gif',
            scale: 'large',
            handler: function () {
                var record;

                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length > 0) {
                    record = grid_PEDIDO_COMPRA1.getSelectionModel().getSelected();
                }

                janela_pedidos_venda.NUMERO_PEDIDO_COMPRA(record ? record.data.NUMERO_PEDIDO_COMPRA : 0);
                janela_pedidos_venda.NUMERO_ITEM_COMPRA(record ? record.data.NUMERO_ITEM_COMPRA : 0);

                if (record)
                    janela_pedidos_venda.record_ITEM_COMPRA(record);

                janela_pedidos_venda.show('BTN_PEDIDOS_VENDA1');
            }
        }, '-', {
            id: 'BTN_FURO_ESTOQUE',
            text: 'Furo de Estoque<br />do Fornecedor',
            icon: 'imagens/icones/data_transport_delete_16.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione 1 ou mais itens para registrar o furo de estoque', 'BTN_FURO_ESTOQUE');
                    return;
                }

                var arrPedido = new Array();
                var arrItem = new Array();
                var arrRecords = new Array();

                for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length; i++) {
                    arrPedido[i] = grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[i].data.NUMERO_PEDIDO_COMPRA;
                    arrItem[i] = grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[i].data.NUMERO_ITEM_COMPRA;
                    arrRecords[i] = grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[i];
                }

                _furo_estoque.NUMEROS_PEDIDOS(arrPedido);
                _furo_estoque.NUMEROS_ITEMS(arrItem);
                _furo_estoque.records(arrRecords);

                _furo_estoque.show('BTN_FURO_ESTOQUE');
            }
        }, '-', {
            text: 'Imprimir',
            scale: 'large',
            icon: 'imagens/icones/printer_16.gif',
            menu: {
                items: [{
                    id: 'BTN_PEDIDO_FORNECEDOR',
                    text: 'Imprimir Pedido do Fornecedor',
                    icon: 'imagens/icones/printer_16.gif',
                    scale: 'large',
                    handler: function () {
                        if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione um pedido para imprimir');
                        }
                        else {
                            var arr2 = new Array();

                            for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                                arr2[i] = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i].data.NUMERO_ITEM_COMPRA;
                            }

                            var record = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[0];

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Imprime_Pedido_Fornecedor');
                            _ajax.setJsonData({
                                NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                                CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                                ITENS: arr2,
                                ID_CONTA_EMAIL: 0,
                                CNPJ_EMITENTE: _CNPJ_EMITENTE,
                                LOGIN_USUARIO: _LOGIN_USUARIO,
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function (response, options) {
                                var result = Ext.decode(response.responseText).d;

                                for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                                    var record = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i];

                                    if (record.data.STATUS_ESPECIFICO_ITEM_COMPRA = 2) {
                                        record.beginEdit();
                                        record.set('CODIGO_STATUS_COMPRA', result[1]);
                                        record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result[2]);
                                        record.set('COR_STATUS_PEDIDO_COMPRA', result[3]);
                                        record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result[4]);
                                        record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result[5]);
                                        record.endEdit();
                                        record.commit();
                                    }
                                }

                                window.open(result[0], '_blank', 'width=1000,height=800');
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }, {
                    id: 'BTN_IMPRIMIR_PEDIDO_COMPRA',
                    text: 'Imprimir Pedido',
                    icon: 'imagens/icones/printer_24.gif',
                    scale: 'large',
                    handler: function () {
                        if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione um pedido para imprimir');
                        }
                        else {
                            var arr2 = new Array();

                            for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                                arr2[i] = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i].data.NUMERO_ITEM_COMPRA;
                            }

                            var record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[0];

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Imprime_Pedido');
                            _ajax.setJsonData({
                                NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                                CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                                ITENS_COMPRA: arr2,
                                LOGIN_USUARIO: _LOGIN_USUARIO,
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function (response, options) {
                                var result = Ext.decode(response.responseText).d;

                                for (var i = 0; i < Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.length; i++) {
                                    var record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[i];

                                    if (record.data.STATUS_ESPECIFICO_ITEM_COMPRA == 2) {
                                        record.beginEdit();
                                        record.set('CODIGO_STATUS_COMPRA', result[1]);
                                        record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result[2]);
                                        record.set('COR_STATUS_PEDIDO_COMPRA', result[3]);
                                        record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result[4]);
                                        record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result[5]);
                                        record.endEdit();
                                        record.commit();
                                    }
                                }

                                window.open(result[0], '_blank', 'width=1000,height=800');
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }, '-', {
                    id: 'BTN_LISTA_PRIORIDADE',
                    text: 'Lista de recebimento / Prioridade de entrega',
                    icon: 'imagens/icones/data_transport_config_16.gif',
                    scale: 'large',
                    handler: function (btn) {
                        _lista_ordem_recebimento.show(btn.getId());
                    }
                }]
            }
        }, '-', {
            text: 'Libera&ccedil;&atilde;o de pedido',
            icon: 'imagens/icones/admin_16.gif',
            scale: 'large',
            menu: {
                items: [{
                    id: 'BTN_SOLICITAR_LIBERACAO_PEDIDO_COMPRA',
                    text: 'Solicitar libera&ccedil;&atilde;o de pedido',
                    icon: 'imagens/icones/user_search_16.gif',
                    scale: 'large',
                    handler: function (btn) {
                        if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione 1 item de pedido para solicitar a libera&ccedil;&atilde;o', btn.getId());
                            return;
                        }

                        _janela_Alcada_Aprovacao.NUMERO_PEDIDO_COMPRA(grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[0].data.NUMERO_PEDIDO_COMPRA);
                        _janela_Alcada_Aprovacao.CODIGO_FORNECEDOR(grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[0].data.CODIGO_FORNECEDOR);
                        _janela_Alcada_Aprovacao.VALOR_PRODUTOS(grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[0].data.TOTAL_PRODUTOS);

                        _janela_Alcada_Aprovacao.show(grid_PEDIDO_COMPRA1);
                    }
                }, '-', {
                    id: 'BTN_LIBERAR_PEDIDO_COMPRA',
                    text: 'Liberar pedido',
                    icon: 'imagens/icones/user_ok_16.gif',
                    scale: 'large',
                    handler: function () {

                        if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione 1 item de pedido para liberar', btn.getId());
                            return;
                        }

                        var record = grid_PEDIDO_COMPRA1.getSelectionModel().getSelections()[0];

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_ALCADA.asmx/Libera_Pedido');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO_COMPRA: record.data.NUMERO_PEDIDO_COMPRA,
                            CODIGO_FORNECEDOR: record.data.CODIGO_FORNECEDOR,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;

                            for (var i = 0; i < grid_PEDIDO_COMPRA1.getStore().getCount(); i++) {
                                var _record = grid_PEDIDO_COMPRA1.getStore().getAt(i);

                                if (_record.data.NUMERO_PEDIDO_COMPRA == record.data.NUMERO_PEDIDO_COMPRA
                                    && _record.data.CODIGO_FORNECEDOR == record.data.CODIGO_FORNECEDOR) {

                                    _record.beginEdit();
                                    _record.set('STATUS_ITEM_COMPRA', result.STATUS_ITEM_COMPRA);
                                    _record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);
                                    _record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                                    _record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                                    _record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result.STATUS_ESPECIFICO_ITEM_COMPRA);
                                    _record.endEdit();
                                    _record.commit();
                                }
                            }

                            checkBoxSM_PC.deselectRange(0, grid_PEDIDO_COMPRA1.getStore().getCount() - 1);
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }]
            }
        }, '-', {
            id: 'BTN_LIQUIDAR_SALDO_RECEBIMENTO',
            text: 'Liquidar saldo<br />de recebimento',
            icon: 'imagens/icones/mssql_delete_16.gif',
            scale: 'large',
            handler: function (btn) {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione pelo menos 1 item de pedido para liquidar o saldo de recebimento', btn.getId());
                    return;
                }

                var NUMEROS_PEDIDO = new Array();
                var NUMEROS_ITEM = new Array();

                for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                    NUMEROS_PEDIDO[i] = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO_COMPRA;
                    NUMEROS_ITEM[i] = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i].data.NUMERO_ITEM_COMPRA;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Liquida_Saldo_Recebimento');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: NUMEROS_PEDIDO,
                    NUMERO_ITEM_COMPRA: NUMEROS_ITEM,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {

                        var _record = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i];

                        _record.beginEdit();
                        _record.set('STATUS_ITEM_COMPRA', result.STATUS_ITEM_COMPRA);
                        _record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);
                        _record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                        _record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                        _record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result.STATUS_ESPECIFICO_ITEM_COMPRA);
                        _record.endEdit();
                        _record.commit();
                    }

                    delete _ajax;
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }],
        columns: [IO_expander,
                    checkBoxSM_PC,
            { id: 'STATUS_ITEM_COMPRA', header: "Posi&ccedil;&atilde;o do Pedido", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_COMPRA', renderer: status_pedido_compra },
            { id: 'PROGRAMACAO_CHEGADA', header: "Carteira fornecedor", width: 115, sortable: true, dataIndex: 'PROGRAMACAO_CHEGADA', renderer: carteiraFornecedor },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
            { id: 'DATA_ITEM_COMPRA', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
            { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 75, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: EntregaAtrasadaCompra, align: 'center' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
            { id: 'TELEFONE1_FORNECEDOR', header: "Telefone 1", width: 110, sortable: true, dataIndex: 'TELEFONE1_FORNECEDOR' },
            { id: 'TELEFONE2_FORNECEDOR', header: "Telefone 2", width: 110, sortable: true, dataIndex: 'TELEFONE2_FORNECEDOR', hidden: true },

            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'DESCRICAO_PRODUTO', header: "Produto", width: 260, sortable: true, dataIndex: 'DESCRICAO_PRODUTO', hidden: true },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', align: 'right', renderer: FormataQtde },
            { id: 'QTDE_RECEBIDA', header: "Qtde. Recebida", width: 100, sortable: true, dataIndex: 'QTDE_RECEBIDA', align: 'center', renderer: QtdeRecebida },
            { id: 'QTDE_NF_ITEM_COMPRA', header: "Qtde. NF", width: 80, sortable: true, dataIndex: 'QTDE_NF_ITEM_COMPRA', align: 'center', renderer: FormataQtdeNF,
                editor: TXT_QTDE_NF
            },
            { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' },

            { id: 'PRECO_ITEM_COMPRA', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_COMPRA', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_DESCONTO_ITEM_COMPRA', header: "Desconto", width: 90, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_COMPRA', renderer: FormataDescontoCompras, align: 'center', align: 'right' },
            { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o Final", width: 100, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: Ajusta_Preco_Cheio, align: 'right' },

            { id: 'AVALIACAO', header: "Avalia&ccedil;&otilde;es", width: 90, sortable: true, dataIndex: 'AVALIACAO', align: 'center', renderer: Avaliacao_Compra },

            { id: 'VALOR_TOTAL_ITEM_COMPRA', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_COMPRA', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_COMPRA', renderer: FormataPercentual, align: 'right' },
            { id: 'VALOR_ICMS_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_ST_ITEM_COMPRA', header: "Valor ICMS ST", width: 105, sortable: true, dataIndex: 'VALOR_ICMS_ST_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_COMPRA', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_COMPRA', renderer: FormataPercentual, align: 'right' },
            { id: 'VALOR_IPI_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_COMPRA', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_COMPRA', align: 'right' },

            { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 115, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'right', renderer: Consulta_Itens_Venda }


        ],
        stripeRows: true,
        height: 400,
        width: '100%',

        clicksToEdit: 1,

        sm: checkBoxSM_PC,

        plugins: IO_expander,

        listeners: {
            beforeedit: function (e) {
                if (e.record.data.STATUS_ESPECIFICO_ITEM_COMPRA == 1 ||
                                    e.record.data.STATUS_ESPECIFICO_ITEM_COMPRA == 5) {
                    e.cancel = true;
                }
            },
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }
            },
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                var record = grid.getStore().getAt(rowIndex);

                if (fieldName == 'NUMERO_PEDIDO_VENDA' &&
                                    record.data.ITENS_ASSOCIADOS > 0) {

                    _vendas.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO_COMPRA);
                    _vendas.NUMERO_ITEM(record.data.NUMERO_ITEM_COMPRA);
                    _vendas.record_ITEM_COMPRA(record);

                    _vendas.show(grid.getId());
                }

                if (fieldName == 'AVALIACAO' &&
                                    record.data.AVALIACAO > 0) {

                    var array_NUMERO_PEDIDO_COMPRA = new Array();
                    var array_NUMERO_ITEM_COMPRA = new Array();
                    var array_CODIGO_FORNECEDOR = new Array();

                    array_NUMERO_PEDIDO_COMPRA[0] = record.data.NUMERO_PEDIDO_COMPRA;
                    array_NUMERO_ITEM_COMPRA[0] = record.data.NUMERO_ITEM_COMPRA;
                    array_CODIGO_FORNECEDOR[0] = record.data.CODIGO_FORNECEDOR;

                    _Panel_Avaliacao.NUMERO_PEDIDO_COMPRA(array_NUMERO_PEDIDO_COMPRA);
                    _Panel_Avaliacao.NUMERO_ITEM_COMPRA(array_NUMERO_ITEM_COMPRA);
                    _Panel_Avaliacao.CODIGO_FORNECEDOR(array_CODIGO_FORNECEDOR);

                    Ext.getCmp('TB_ITEM_COMPRA_TABPANEL').setActiveTab(2);
                }
            }
        }
    });

    var ITENS_PEDIDO_COMPRAPagingToolbar = new Th2_PagingToolbar();

    ITENS_PEDIDO_COMPRAPagingToolbar.setStore(PEDIDO_COMPRA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

        if (_numero_pedido.length == 0)
            _numero_pedido = 0;

        var _nf = TXT_NUMERO_NF.getValue();

        _nf = _nf == '' ? 0 : _nf;

        var _pedido_venda = TXT_NUMERO_PEDIDO_VENDA.getValue();

        _pedido_venda = _pedido_venda == '' ? 0 : _pedido_venda;

        var _status = _janela_Filtro_Status_Pedido_Compra.statusSelecionados();

        var TB_TRANSP_JsonData = {
            PREVISAO_ENTREGA: TXT_ENTREGA.getRawValue(),
            NUMERO_PEDIDO_COMPRA: _numero_pedido,
            FORNECEDOR: TXT_FORNECEDOR.getValue(),
            CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            NUMERO_NF: _nf,
            QTDE_NF: CB_QTDE_NF.checked,
            RECEBIDO: CB_RECEBIDO.checked,
            NUMERO_PEDIDO_VENDA: _pedido_venda,
            STATUS_ITEM_COMPRA: _status,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: ITENS_PEDIDO_COMPRAPagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function RetornaFiltros_PEDIDOS2_JsonData() {
        var TB_TRANSP_JsonData = {
            NUMERO_PEDIDO_COMPRA: TXT_NUMERO_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: ITENS_PEDIDO_COMPRAPagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO(btn) {
        if (_janela_Filtro_Status_Pedido_Compra.statusSelecionados().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos um status de pedido no botão [status de pedido] para listar os itens', btn.getId());
            return;
        }

        ITENS_PEDIDO_COMPRAPagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Itens_Pedido');
        ITENS_PEDIDO_COMPRAPagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_COMPRAPagingToolbar.doRequest();
    }

    function Lista_Itens_por_Numero_Pedido() {
        ITENS_PEDIDO_COMPRAPagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_Itens_por_Numero_Pedido');
        ITENS_PEDIDO_COMPRAPagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS2_JsonData());
        ITENS_PEDIDO_COMPRAPagingToolbar.doRequest();
    }

    if (_GERENTE_COMPRAS != 1) {
        Ext.getCmp('BTN_LISTA_PRIORIDADE').disable();
        Ext.getCmp('BTN_LIQUIDAR_SALDO_RECEBIMENTO').disable();
    }

    /////////////////Botões

    //
    function Altera_Fornecedor_do_Pedido(NUMERO_PEDIDO_COMPRA, CODIGO_FORNECEDOR, CODIGO_FORNCEDOR_ANTIGO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Altera_Fornecedor_do_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO_COMPRA: NUMERO_PEDIDO_COMPRA,
            CODIGO_FORNECEDOR: CODIGO_FORNECEDOR,
            CODIGO_FORNCEDOR_ANTIGO: CODIGO_FORNCEDOR_ANTIGO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            Carrega_ITENS_PEDIDO(BTN_LISTAR_PEDIDOS);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //

    var toolbar_PEDIDO_COMPRA = new Ext.Toolbar({
        id: 'toolbar_PEDIDO_COMPRA',
        style: 'text-align: right;',
        items: [{
            text: 'Novo Pedido',
            icon: 'imagens/icones/document_fav_24.gif',
            scale: 'large',
            id: 'BTN_NOVO_PEDIDO_COMPRA',
            handler: function () {
                Novo_Pedido_Compras();
            }
        }, '-', {
            id: 'BTN_ALTERAR_PEDIDO_COMPRA',
            text: 'Alterar Pedido',
            icon: 'imagens/icones/document_write_24.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um pedido para alterar', 'BTN_ALTERAR_PEDIDO_COMPRA');
                    return;
                }

                var PEDIDO = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.NUMERO_PEDIDO_COMPRA;
                var FORNECEDOR = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.CODIGO_FORNECEDOR;

                Altera_Pedido_Compra(PEDIDO, FORNECEDOR);
            }
        }, '-', {
            id: 'BTN_TRANSFORMAR_PEDIDO1',
            text: 'Transformar Cota&ccedil;&atilde;o<br />em Pedido',
            icon: 'imagens/icones/document_ok1_24.gif',
            scale: 'large',
            handler: function () {

                if (Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione uma cota&ccedil;&atilde;o com fornecedor definido para transformar em pedido', 'BTN_TRANSFORMAR_PEDIDO1');
                    return;
                }

                var PEDIDO = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.NUMERO_PEDIDO_COMPRA;
                var FORNECEDOR = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[0].data.CODIGO_FORNECEDOR;

                Transforma_Cotacao_Pedido(PEDIDO, FORNECEDOR);
            }
        }, '-', {
            id: 'BTN_CANCELAR_PEDIDO_COMPRA',
            text: 'Cancelar Pedido',
            icon: 'imagens/icones/document_cancel_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para cancelar', 'BTN_CANCELAR_PEDIDO_COMPRA');
                    return;
                }

                dialog.MensagemDeConfirmacao('Deseja cancelar este item de pedido?', 'BTN_CANCELAR_PEDIDO_COMPRA', Deleta);

                function Deleta(btn) {
                    if (btn == 'yes') {

                        var record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[0];
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Cancela_Pedido_Compra');
                        _ajax.setJsonData({
                            NUMERO_ITEM_COMPRA: record.data.NUMERO_ITEM_COMPRA,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;

                            record.beginEdit();
                            record.set('CODIGO_STATUS_COMPRA', result.CODIGO_STATUS_COMPRA);
                            record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);
                            record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                            record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                            record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result.STATUS_ESPECIFICO_ITEM_COMPRA);
                            record.endEdit();
                            record.commit();

                            Ext.getCmp('BTN_CANCELAR_PEDIDO_COMPRA').disable();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }
        }, '-', {
            id: 'BTN_NOTAS_FISCAIS_COMPRA',
            text: 'Notas Fiscais',
            icon: 'imagens/icones/preview_write_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para consultar as notas fiscais', 'BTN_NOTAS_FISCAIS_COMPRA');
                }
                else {
                    var record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[0];

                    notas.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO_COMPRA);

                    notas.show('BTN_NOTAS_FISCAIS_COMPRA');
                }
            }
        }, '-', {
            id: 'BTN_ALTERAR_FORNECEDOR',
            text: 'Alterar Fornecedor',
            icon: 'imagens/icones/user_write_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para alterar o fornecedor', 'BTN_ALTERAR_FORNECEDOR');
                }
                else {
                    var _record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[0];

                    trocar_fornecedor.ACAO_POPULAR(function (record) {
                        trocar_fornecedor.hide();
                        Altera_Fornecedor_do_Pedido(_record.data.NUMERO_PEDIDO_COMPRA, record.data.CODIGO_FORNECEDOR, _record.data.CODIGO_FORNECEDOR);
                    });

                    trocar_fornecedor.show('BTN_ALTERAR_FORNECEDOR');
                }
            }
        }, '-', {
            id: 'BTN_ENVIAR_PEDIDO_EMAIL',
            text: 'Enviar Pedido<br />por e-mail',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_COMPRA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para enviar ao fornecedor por e-mail', 'BTN_ENVIAR_PEDIDO_EMAIL');
                    return;
                }

                var _record = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().selections.items[0];

                var arr2 = new Array();

                for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                    arr2[i] = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i].data.NUMERO_ITEM_COMPRA;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Imprime_Pedido_Fornecedor');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: _record.data.NUMERO_PEDIDO_COMPRA,
                    CODIGO_FORNECEDOR: _record.data.CODIGO_FORNECEDOR,
                    ITENS: arr2,
                    ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
                    CNPJ_EMITENTE: _CNPJ_EMITENTE,
                    LOGIN_USUARIO: _LOGIN_USUARIO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    for (var i = 0; i < grid_PEDIDO_COMPRA1.getSelectionModel().selections.length; i++) {
                        var record = grid_PEDIDO_COMPRA1.getSelectionModel().selections.items[i];

                        if (record.data.STATUS_ESPECIFICO_ITEM_COMPRA = 2) {
                            record.beginEdit();
                            record.set('CODIGO_STATUS_COMPRA', result[1]);
                            record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result[2]);
                            record.set('COR_STATUS_PEDIDO_COMPRA', result[3]);
                            record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result[4]);
                            record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result[5]);
                            record.endEdit();
                            record.commit();
                        }
                    }

                    _janelaNovoEmail.resetaFormulario();
                    _janelaNovoEmail.Botao_Salvar(true);
                    _janelaNovoEmail.Botao_Enviar(true);
                    _janelaNovoEmail.Botao_Responder(false);
                    _janelaNovoEmail.Botao_Encaminhar(false);

                    _janelaNovoEmail.setRemetente(_record_conta_email.data.CONTA_EMAIL);
                    _janelaNovoEmail.setDestinatario(_record.data.EMAIL_COTACAO_FORNECEDOR);
                    _janelaNovoEmail.setBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
                    _janelaNovoEmail.setRawBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);

                    _janelaNovoEmail.NUMERO_CRM(0);
                    _janelaNovoEmail.setAssunto('A/C. ' + _record.data.CONTATO_COTACAO_FORNECEDOR + ' - Pedido de compra Nº ' + _record.data.NUMERO_PEDIDO_COMPRA + ' [' + _EMITENTE + ']');

                    _janelaNovoEmail.AdicionaNovoAnexo(result[6]);

                    _janelaNovoEmail.show('BTN_ENVIAR_PEDIDO_EMAIL');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            id: 'BTN_ALTERAR_FASE_PEDIDO',
            text: 'Alterar posi&ccedil;&atilde;o<br />do(s) item(s)',
            icon: 'imagens/icones/database_write_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione 1 ou mais itens para alterar a posi&ccedil;&atilde;o', btn.getId());
                    return;
                }

                var ArrRecord = new Array();

                for (var i = 0; i < Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections().length; i++) {
                    ArrRecord[i] = Ext.getCmp('grid_PEDIDO_COMPRA1').getSelectionModel().getSelections()[i];
                }

                _janelaAltera_Status_Item_Pedido.records(ArrRecord);
                _janelaAltera_Status_Item_Pedido.show(btn.getId());
            }
        }]
    });

    var panel1 = new Ext.Panel({
        autoHeight: true,
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        title: 'Pedidos de Compra',
        items: [formPEDIDO, grid_PEDIDO_COMPRA1, ITENS_PEDIDO_COMPRAPagingToolbar.PagingToolbar(), toolbar_PEDIDO_COMPRA]
    });

    Ext.getCmp('grid_PEDIDO_COMPRA1').setHeight(AlturaDoPainelDeConteudo(289));

    Busca_Valor_Maximo_Aprovacao();

    _Panel_Avaliacao = new Panel_Avaliacao();

    return panel1;
}

function Gera_Nota_Entrada() {

    var TXT_NUMERO_NOTA = new Ext.form.NumberField({
        fieldLabel: 'Nr. da Nota de Entrada',
        width: 90,
        minValue: 1,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Gera_Nota_Entrada();
                }
            }
        }
    });

    var BTN_OK_NOTA = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Gera_Nota_Entrada();
        }
    });

    var formNOTA_ENTRADA = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.70,
                layout: 'form',
                items: [TXT_NUMERO_NOTA]
            }, {
                columnWidth: .30,
                items: [BTN_OK_NOTA]
            }]
        }]
    });

    function Gera_Nota_Entrada() {
        if (!formNOTA_ENTRADA.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Gera_Nota_Entrada');
        _ajax.setJsonData({
            NUMERO_NFE: TXT_NUMERO_NOTA.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < result.length; i++) {
                var item = result[i].substr(0, result[i].indexOf(' -')).trim();

                var _index = Ext.getCmp('grid_PEDIDO_COMPRA1').getStore().find('NUMERO_ITEM_COMPRA', item);
                var record = Ext.getCmp('grid_PEDIDO_COMPRA1').getStore().getAt(_index);

                if (record) {
                    record.beginEdit();
                    record.set('QTDE_NF_ITEM_COMPRA', 0);
                    record.endEdit();
                    record.commit();

                    Ext.getCmp('BTN_NOTAS_FISCAIS_COMPRA').enable();
                }
            }

            wGeraNota.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wGeraNota = new Ext.Window({
        layout: 'form',
        title: 'Gerar Nota Fiscal de Entrada',
        iconCls: 'icone_TB_FORNECEDOR',
        width: 270,
        height: 97,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            show: function (w) {
                TXT_NUMERO_NOTA.reset();
                TXT_NUMERO_NOTA.focus();
            }
        },
        items: [formNOTA_ENTRADA]
    });

    this.show = function (elm) {
        wGeraNota.show(elm);
    };
}

//// Furo de Estoque
function Furo_Estoque() {

    var _PEDIDOS;
    var _ITEMS;
    var _records;

    this.NUMEROS_PEDIDOS = function (pPEDIDOS) {
        _PEDIDOS = pPEDIDOS;
    };

    this.NUMEROS_ITEMS = function (pITEMS) {
        _ITEMS = pITEMS;
    };

    this.records = function (pRecords) {
        _records = pRecords;
    };

    var CB_VOLTAR_PROCESSO = new Ext.form.Checkbox({
        boxLabel: 'Voltar todo o processo para gerar a ordem de compra novamente'
    });

    var BTN_OK = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Processa_Furo_Estoque();
        }
    });

    var formNOTA_FURO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.80,
                layout: 'form',
                items: [CB_VOLTAR_PROCESSO]
            }, {
                columnWidth: .20,
                items: [BTN_OK]
            }]
        }]
    });

    function Processa_Furo_Estoque() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Furo_Estoque');
        _ajax.setJsonData({
            PEDIDOS: _PEDIDOS,
            ITENS: _ITEMS,
            VOLTAR_PROCESSO: CB_VOLTAR_PROCESSO.checked ? true : false,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var store = Ext.getCmp('grid_PEDIDO_COMPRA1').getStore();

            for (var i = 0; i < _records.length; i++) {
                store.remove(_records[i]);
            }

            wFuro_Estoque.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wFuro_Estoque = new Ext.Window({
        layout: 'form',
        title: 'Reportar Furo de Estoque do Fornecedor',
        iconCls: 'icone_TB_FORNECEDOR',
        width: 520,
        height: 97,
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
        items: [formNOTA_FURO]
    });

    this.show = function (elm) {
        wFuro_Estoque.show(elm);
    };
}

var _VALOR_MAXIMO_APROVACAO;

function Busca_Valor_Maximo_Aprovacao() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ALCADA.asmx/Valor_Maximo_Aprovacao');
    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        _VALOR_MAXIMO_APROVACAO = result;

        delete _ajax;
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function janela_Alcada_Aprovacao() {
    var _NUMERO_PEDIDO_COMPRA;
    var _CODIGO_FORNECEDOR;
    var _VALOR_PRODUTOS;

    this.NUMERO_PEDIDO_COMPRA = function (pValue) {
        _NUMERO_PEDIDO_COMPRA = pValue;
    };

    this.CODIGO_FORNECEDOR = function (pValue) {
        _CODIGO_FORNECEDOR = pValue;
    };

    this.VALOR_PRODUTOS = function (pValue) {
        _VALOR_PRODUTOS = pValue;
    };

    var Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_USUARIO', 'LOGIN_USUARIO', 'NOME_USUARIO'])
    });

    var checkBoxFP_ = new Ext.grid.CheckboxSelectionModel();

    var grid1 = new Ext.grid.GridPanel({
        store: Store1,
        columns: [
        checkBoxFP_,
        { id: 'LOGIN_USUARIO', header: "Login", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' },
        { id: 'NOME_USUARIO', header: "Nome do usu&aacute;rio", width: 250, sortable: true, dataIndex: 'NOME_USUARIO' }
        ],
        stripeRows: true,
        height: 250,
        width: '100%',

        sm: checkBoxFP_
    });

    var toolbar1 = new Ext.Toolbar({
        items: ['-', {
            id: '',
            text: 'Solicitar libera&ccedil;&atilde;o',
            icon: 'imagens/icones/user_search_24.gif',
            scale: 'medium',
            handler: function () {
                if (grid1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione 1 ou mais aprovadores para solicitar a libera&ccedil;o do pedido', grid1.getId());
                    return;
                }

                var arr1 = new Array();

                for (var i = 0; i < grid1.getSelectionModel().getSelections().length; i++) {
                    arr1[i] = grid1.getSelectionModel().getSelections()[i].data.ID_USUARIO;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ALCADA.asmx/Solicita_Liberacao');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
                    CODIGO_FORNECEDOR: _CODIGO_FORNECEDOR,
                    ID_USUARIO: _ID_USUARIO,
                    ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
                    FROM_ADDRESS: _record_conta_email.data.CONTA_EMAIL,
                    IDs_USUARIO: arr1
                });

                var _sucess = function (response, options) {
                    wJANELA.hide();
                    delete _ajax;
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }]
    });

    var wJANELA = new Ext.Window({
        layout: 'form',
        title: 'Selecione o(s) aprovador(es) para solicitar a libera&ccedil;&atilde;o do pedido',
        width: 440,
        height: 'auto',
        closable: false,
        draggable: false,
        resizable: false,
        minimizable: true,
        modal: true,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        items: [grid1, toolbar1],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        carregaGrid();
        wJANELA.show(elm.getId());
    };

    function carregaGrid() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ALCADA.asmx/Lista_Alcada_do_Pedido');
        _ajax.setJsonData({ TOTAL_PRODUTOS: _VALOR_PRODUTOS, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
}

function janelaAltera_Status_Item_Pedido() {

    var _records;

    this.records = function (pValue) {
        _records = pValue;
    };

    TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO_INDEFINIDO();

    var CB_STATUS_PEDIDO = new Ext.form.ComboBox({
        store: combo_TB_STATUS_PEDIDO_COMPRA_INDEFINIDO,
        fieldLabel: 'Nova posi&ccedil;&atilde;o do pedido',
        valueField: 'CODIGO_STATUS_COMPRA',
        displayField: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 240,
        allowBlank: false
    });

    var BTN_SALVAR = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            Altera_Status_Item_Pedido();
        }
    });

    var form1 = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .75,
                items: [CB_STATUS_PEDIDO]
            }, {
                columnWidth: .25,
                items: [BTN_SALVAR]
            }]
        }]
    });

    function Altera_Status_Item_Pedido() {
        if (!form1.getForm().isValid())
            return;

        var arr1 = new Array();

        for (var i = 0; i < _records.length; i++) {
            arr1[i] = _records[i].data.NUMERO_ITEM_COMPRA;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Altera_Status_Item_Pedido');
        _ajax.setJsonData({
            NUMEROS_ITEM: arr1,
            ID_STATUS: CB_STATUS_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            Window1.hide();

            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < _records.length; i++) {
                var record = _records[i];

                record.beginEdit();
                record.set('STATUS_ITEM_COMPRA', result.CODIGO_STATUS_COMPRA);
                record.set('DESCRICAO_STATUS_PEDIDO_COMPRA', result.DESCRICAO_STATUS_PEDIDO_COMPRA);
                record.set('COR_STATUS_PEDIDO_COMPRA', result.COR_STATUS_PEDIDO_COMPRA);
                record.set('COR_FONTE_STATUS_PEDIDO_COMPRA', result.COR_FONTE_STATUS_PEDIDO_COMPRA);
                record.set('STATUS_ESPECIFICO_ITEM_COMPRA', result.STATUS_ESPECIFICO_ITEM_COMPRA);
                record.endEdit();
                record.commit();
            }

            delete _ajax;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var Window1 = new Ext.Window({
        layout: 'form',
        title: 'Alterar posi&ccedil;&atilde;o dos itens selecionados',
        iconCls: 'icone_STATUS_COMPRA',
        width: 400,
        height: 90,
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
        items: [form1]
    });

    this.show = function (elm) {
        Window1.show(elm);
    };
}

function janela_Programacao_Carteira() {

    var _NUMEROS_PEDIDO_COMPRA;
    var _NUMEROS_ITEM_COMPRA;
    var _IDS_PRODUTO;
    var _CODIGO_PRODUTO;
    var _record_compra;

    this.NUMEROS_PEDIDO_COMPRA = function (pValue) {
        _NUMEROS_PEDIDO_COMPRA = pValue;
    };

    this.NUMEROS_ITEM_COMPRA = function (pValue) {
        _NUMEROS_ITEM_COMPRA = pValue;
    };

    this.IDS_PRODUTO = function (pValue) {
        _IDS_PRODUTO = pValue;
    };

    this.CODIGO_PRODUTO = function (pValue) {
        _CODIGO_PRODUTO = pValue;
    };

    this.record_compra = function (pValue) {
        _record_compra = pValue;
    };

    var store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'CARTEIRA', 'ID_VENDEDOR', 'QTDE']
           )
    });

    function possuiCarteira(val) {
        return val == 1 ?
            "<img src='imagens/icones/user_ok_16.gif' />" :
            "";
    }

    var TXT_QTDE = new Ext.form.NumberField({
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00
    });

    var grid1 = new Ext.grid.EditorGridPanel({
        store: store1,
        columns: [
        { id: 'CARTEIRA', header: "Prog.", width: 50, sortable: true, dataIndex: 'CARTEIRA', renderer: possuiCarteira, align: 'center' },
        { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 250, sortable: true, dataIndex: 'NOME_VENDEDOR' },
        { id: 'QTDE', header: "Qtde.", width: 90, sortable: true, dataIndex: 'QTDE', align: 'center', renderer: FormataQtde,
            editor: TXT_QTDE
        }
        ],
        stripeRows: true,
        height: 270,
        width: '100%',

        clicksToEdit: 1,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var toolbar1 = new Ext.Toolbar({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'small',
            handler: function (btn) {
                salvaCarteira(btn);
            }
        }, '-', {
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_16.gif',
            scale: 'small',
            handler: function (btn) {
                deletaCarteira(btn);
            }
        }]
    });

    var wFILTRO = new Ext.Window({
        layout: 'form',
        title: 'Digite a(s) quantidade(s) para cada vendedor sobre o item de compra selecionado [' + _CODIGO_PRODUTO + ']',
        width: 450,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        iconCls: 'icone_TB_VENDEDOR',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                _shown = false;
                w.hide();
            }
        },
        items: [grid1, toolbar1]
    });

    function carregaGrid() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PROGRAMACAO_COMPRA_VENDEDOR.asmx/Carrega_Programacao');
        _ajax.setJsonData({
            NUMEROS_PEDIDO_COMPRA: _NUMEROS_PEDIDO_COMPRA,
            NUMEROS_ITEM_COMPRA: _NUMEROS_ITEM_COMPRA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);

            _record_compra.beginEdit();
            _record_compra.set('PROGRAMACAO_CHEGADA', 0);
            _record_compra.endEdit();
            _record_compra.commit();

            for (var i = 0; i < grid1.getStore().getCount(); i++) {
                if (grid1.getStore().getAt(i).data.QTDE > 0.00) {
                    _record_compra.beginEdit();
                    _record_compra.set('PROGRAMACAO_CHEGADA', 1);
                    _record_compra.endEdit();
                    _record_compra.commit();
                    break;
                }
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function salvaCarteira(btn) {
        var ok = false;

        for (var i = 0; i < grid1.getStore().getCount(); i++) {
            if (grid1.getStore().getAt(i).data.QTDE > 0.00) {
                ok = true;
                break;
            }
        }

        if (!ok) {
            dialog.MensagemDeErro('Digite as quantidades para cada vendedor para gravar a programa&ccedil;&atilde;o', btn.getId());
            return;
        }

        var Arr1 = new Array();
        var Arr2 = new Array();

        for (var i = 0; i < grid1.getStore().getCount(); i++) {
            if (grid1.getStore().getAt(i).data.QTDE > 0.00) {
                Arr1[i] = grid1.getStore().getAt(i).data.ID_VENDEDOR;
                Arr2[i] = grid1.getStore().getAt(i).data.QTDE;
            }
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PROGRAMACAO_COMPRA_VENDEDOR.asmx/GravaNovaProgramacao');
        _ajax.setJsonData({
            NUMEROS_PEDIDO_COMPRA: _NUMEROS_PEDIDO_COMPRA,
            NUMEROS_ITEM_COMPRA: _NUMEROS_ITEM_COMPRA,
            IDS_VENDEDOR: Arr1,
            IDS_PRODUTO: _IDS_PRODUTO,
            QTDEs: Arr2,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            carregaGrid();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function deletaCarteira(btn) {
        if (grid1.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione 1 ou mais vendedores para deletar a programa&ccedil;&atilde;o', btn.getId());
            return;
        }

        var Arr1 = new Array();

        for (var i = 0; i < grid1.getSelectionModel().getSelections().length; i++) {
            Arr1[i] = grid1.getSelectionModel().getSelections()[i].data.ID_VENDEDOR;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PROGRAMACAO_COMPRA_VENDEDOR.asmx/DeletaProgramacao');
        _ajax.setJsonData({
            NUMEROS_PEDIDO_COMPRA: _NUMEROS_PEDIDO_COMPRA,
            NUMEROS_ITEM_COMPRA: _NUMEROS_ITEM_COMPRA,
            IDS_VENDEDOR: Arr1,
            IDS_PRODUTO: _IDS_PRODUTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            carregaGrid();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var _shown = false;

    this.shown = function () {
        return _shown;
    };

    this.carrrega_Grid = function () {
        carregaGrid();
    };

    this.show = function (elm) {
        wFILTRO.setPosition(elm.getPosition()[0] - 100, elm.getPosition()[1] + elm.getHeight());
        wFILTRO.toFront();
        wFILTRO.show(elm.getId());

        wFILTRO.setTitle('Selecione o(s) vendedor(es) para os item de compra selecionado [' + _CODIGO_PRODUTO + ']');
        _shown = true;

        carregaGrid();
    };
}