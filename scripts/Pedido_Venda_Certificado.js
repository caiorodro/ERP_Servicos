
function Monta_Pedido_Venda_Certificado() {

    var fu1 = new JANELA_FOLLOW_UP_PEDIDO();
    var posicao1 = new Nova_Posicao_Pedido();
    var notas1 = new Janela_Notas_Pedido_Venda();

    var _janelaNovoEmail = new janela_Envio_Email('_pedido_certificado');

    var _compras = new JANELA_ITENS_COMPRA();

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Carrega_ITENS_POR_NUMERO_PEDIDO();
                    }
                    else {
                        Carrega_ITENS_PEDIDO();
                    }
                }
            }
        }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    var TXT_DATA_PEDIDO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Emiss&atilde;o',
        width: 94,
        value: dt1,
        allowBlank: false,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Cliente',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_NUMERO_PEDIDO_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Nr. do Pedido do Cliente',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var TXT_NUMERO_NF = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero NF',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Carrega_ITENS_POR_NUMERO_NF();
                    }
                    else {
                        Carrega_ITENS_PEDIDO();
                    }
                }
            }
        }
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function() {
            Carrega_ITENS_PEDIDO();
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
                columnWidth: .12,
                layout: 'form',
                items: [TXT_DATA_PEDIDO]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO]
            }, {
                columnWidth: .25,
                layout: 'form',
                items: [TXT_CLIENTE]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_NUMERO_NF]
            }, {
                columnWidth: .20,
                items: [BTN_LISTAR_PEDIDOS]
}]
}]
            });

            ///// grid
            var PEDIDO_VENDA_Store = new Ext.data.Store({
                reader: new Ext.data.XmlReader({
                    record: 'Tabela'
                }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM',
                    'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'QTDE_A_FATURAR', 'ID_PRODUTO_PEDIDO',
                'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'CODIGO_CLIENTE_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
                'NUMERO_PEDIDO_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
                'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
                'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
                'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_SUBS', 'TOTAL_PEDIDO', 'VALOR_FRETE', 'MARGEM',
                'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA', 'CERTIFICADO', 'ITEM_REQUER_CERTIFICADO', 'NF_CERTIFICADO',
                'ITENS_COMPRA_ASSOCIADOS', 'NUMERO_PEDIDO_COMPRA'])
            });

            var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

            var grid_PEDIDO_VENDA_CERTIFICADO = new Ext.grid.GridPanel({
                id: 'grid_PEDIDO_VENDA_CERTIFICADO',
                store: PEDIDO_VENDA_Store,
                columns: [
                    checkBoxSM_,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Beneficiamento },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },
            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },
            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 120, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' },
            { id: 'ITEM_REQUER_CERTIFICADO', header: "Requer Certificado", width: 110, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01, align: 'center' },
            { id: 'NF_CERTIFICADO', header: "1&ordm; N&ordm Certificado", width: 120, sortable: true, dataIndex: 'NF_CERTIFICADO' },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Ordem de Compra", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center', renderer: Consulta_Ordens_Compra }

        ],
                stripeRows: true,
                height: 400,
                width: '100%',

                sm: checkBoxSM_,

                listeners: {
                    cellclick: function(grid, rowIndex, columnIndex, e) {
                        var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                        var record = grid.getStore().getAt(rowIndex);

                        if (fieldName == 'NUMERO_PEDIDO_COMPRA' &&
                                    (record.data.ITENS_COMPRA_ASSOCIADOS > 0 || record.data.NUMERO_PEDIDO_COMPRA > 0)) {

                            _compras.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                            _compras.NUMERO_ITEM(record.data.NUMERO_ITEM);
                            _compras.show(grid.getId());
                        }
                    }
                }
            });

            var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

            ITENS_PEDIDO_PagingToolbar.setStore(PEDIDO_VENDA_Store);

            function RetornaFiltros_PEDIDOS_JsonData() {
                var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

                if (_numero_pedido.length == 0)
                    _numero_pedido = 0;

                var TB_TRANSP_JsonData = {
                    DATA_PEDIDO: TXT_DATA_PEDIDO.getRawValue(),
                    NUMERO_PEDIDO: _numero_pedido,
                    CLIENTE: TXT_CLIENTE.getValue(),
                    MARCA_PARA_BENEFICIAR: 0,
                    CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
                    ID_USUARIO: _ID_USUARIO,
                    start: 0,
                    limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
                };

                return TB_TRANSP_JsonData;
            }

            function RetornaFiltros_PEDIDOS_JsonData1() {
                var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

                if (_numero_pedido.length == 0)
                    _numero_pedido = 0;

                var TB_TRANSP_JsonData = {
                    BENEFICIAMENTO: 1,
                    NUMERO_PEDIDO: _numero_pedido,
                    MARCA_PARA_BENEFICIAR: 0,
                    ID_USUARIO: _ID_USUARIO,
                    start: 0,
                    limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
                };

                return TB_TRANSP_JsonData;
            }

            function RetornaFiltros_PEDIDOS_JsonData2() {
                var _numero_nf = TXT_NUMERO_NF.getValue();

                if (_numero_nf.length == 0)
                    _numero_nf = 0;

                var TB_TRANSP_JsonData = {
                    NUMERO_NF: _numero_nf,
                    start: 0,
                    ID_USUARIO: _ID_USUARIO,
                    limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
                };

                return TB_TRANSP_JsonData;
            }

            function Carrega_ITENS_PEDIDO() {
                ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido_Beneficiamento');
                ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
                ITENS_PEDIDO_PagingToolbar.doRequest();
            }

            function Carrega_ITENS_POR_NUMERO_PEDIDO() {
                ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Por_Numero_Pedido');
                ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData1());
                ITENS_PEDIDO_PagingToolbar.doRequest();
            }

            function Carrega_ITENS_POR_NUMERO_NF() {
                ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido');
                ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData2());
                ITENS_PEDIDO_PagingToolbar.doRequest();
            }

            /////////////////Botões

            var buttonGroup_PEDIDO = new Ext.ButtonGroup({
                items: [{
                    id: 'BTN_FOLLOW_UP_PEDIDO_VENDA_3',
                    text: 'Follow UP',
                    icon: 'imagens/icones/book_fav_24.gif',
                    scale: 'large',
                    handler: function() {
                        if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione um pedido para consultar o follow up');
                        }
                        else {
                            var record = Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[0];

                            var _pedido = record.data.NUMERO_PEDIDO;

                            for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.length; i++) {
                                if (Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                                    dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                                    return;
                                }
                            }

                            fu1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                            var items = new Array();

                            for (i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.length; i++) {
                                items[i] = Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                            }

                            fu1.ITENS_PEDIDO(items);

                            fu1.show('BTN_FOLLOW_UP_PEDIDO_VENDA_3');
                        }
                    }
                }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_NOTAS_FISCAIS_PEDIDO_CERTIFICADO',
                text: 'Notas Fiscais',
                icon: 'imagens/icones/preview_write_24.gif',
                scale: 'large',
                handler: function() {

                    if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um pedido para consultar o follow up', 'BTN_NOTAS_FISCAIS_PEDIDO_CERTIFICADO');
                        return;
                    }

                    var record = grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().selections.items[0];

                    notas1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    notas1.ITENS_PEDIDO(record.data.NUMERO_ITEM);

                    notas1.show('BTN_NOTAS_FISCAIS_PEDIDO_CERTIFICADO');
                }
            }
          , { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }
        ,{
            id: 'BTN_ENVIA_CERTIFICADO_EMAIL1',
            text: 'Enviar Certificado(s)<br />por e-mail',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'large',
            handler: function() {
                Envia_Certificados_por_email();
            }
        }
]
            });

            var toolbar_TB_PEDIDO = new Ext.Toolbar({
                style: 'text-align: right;',
                items: [buttonGroup_PEDIDO]
            });

            function Envia_Certificados_por_email() {
                if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um ou mais pedidos para enviar por e-mail');
                    return;
                }

                var NUMEROS_PEDIDOS = new Array();

                for (var i = 0; i < grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().selections.length; i++) {
                    var _pedido = grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO;
                    
                    if (!NUMEROS_PEDIDOS.contains(_pedido))
                        NUMEROS_PEDIDOS[i] = _pedido;
                }

                var record = grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().selections.items[0];

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Anexa_Varios_Certificados_de_Varios_Pedidos');
                _ajax.setJsonData({
                    NUMEROS_PEDIDOS: NUMEROS_PEDIDOS,
                    EMAIL_USUARIO: _record_conta_email.data.CONTA_EMAIL,
                    LOGIN_USUARIO: _LOGIN_USUARIO,
                    ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;

                    _janelaNovoEmail.resetaFormulario();

                    _janelaNovoEmail.Botao_Salvar(true);
                    _janelaNovoEmail.Botao_Enviar(true);
                    _janelaNovoEmail.Botao_Responder(false);
                    _janelaNovoEmail.Botao_Encaminhar(false);

                    _janelaNovoEmail.setRemetente(_record_conta_email.data.CONTA_EMAIL);
                    _janelaNovoEmail.setDestinatario(result[1]);

                    _janelaNovoEmail.NUMERO_CRM(0);
                    _janelaNovoEmail.setAssunto('A/C. ' + result[0] + ' - Certificado de Qualidade [' + _EMITENTE + ']');
                    _janelaNovoEmail.setBody('<br />Segue em anexo o certificado de conformidade' + '<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
                    _janelaNovoEmail.setRawBody('<br />Segue em anexo o certificado de conformidade' + '<br /><br /><br />' + _record_conta_email.data.ASSINATURA);

                    for (var i = 4; i < result.length; i++) {
                        if (result[i].indexOf("\\") > -1) {
                            _janelaNovoEmail.AdicionaNovoAnexo(result[i]);
                        }
                    }

                    _janelaNovoEmail.show('BTN_ENVIA_CERTIFICADO_EMAIL1');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
                if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um pedido para gravar a posi&ccedil;&atilde;o');
                    return;
                }

                if (!CANCELAR && !LIBERAR_FATURAR) {
                    if (CB_STATUS_PEDIDO_USUARIO2.getValue() < 1) {
                        dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                        return;
                    }
                }

                var record = Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[0];

                var _pedido = record.data.NUMERO_PEDIDO;

                for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.length; i++) {

                    if (!CANCELAR && !LIBERAR_FATURAR) {
                        if (CB_STATUS_PEDIDO_USUARIO2.getValue() ==
                                Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                            dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                            return;
                        }
                    }

                    if (Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                        dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                        return;
                    }
                }

                posicao1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                var items = new Array();

                for (i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.length; i++) {
                    items[i] = Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                }

                posicao1.ITENS_PEDIDO(items);
                posicao1.REGISTROS(Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').getSelectionModel().selections.items);
                posicao1.CANCELAR(CANCELAR);
                posicao1.LIBERAR_FATURAR(LIBERAR_FATURAR);

                var _index = CB_STATUS_PEDIDO_USUARIO2.getStore().find('CODIGO_STATUS_PEDIDO', CB_STATUS_PEDIDO_USUARIO2.getValue());

                if (LIBERAR_FATURAR || CANCELAR) {
                    posicao1.SENHA(0);
                }
                else {
                    posicao1.SENHA(_index > -1 ?
                            CB_STATUS_PEDIDO_USUARIO2.getStore().getAt(_index).data.SENHA :
                            0);
                }

                posicao1.COMBO_STATUS('CB_STATUS_PEDIDO_USUARIO2');

                posicao1.show(elm);
            }

            var panel1 = new Ext.Panel({
                autoHeight: true,
                border: false,
                bodyStyle: 'padding:0px 0px 0',
                width: '100%',
                anchor: '100%'
            });

            ///////////////// TabPanel

            var panel2 = new MontaCertificado();

            var TABPANEL1 = new Ext.TabPanel({
                deferredRender: false,
                activeTab: 0,
                items: [{
                    title: 'Itens de Venda',
                    closable: false,
                    autoScroll: false,
                    iconCls: 'icone_TB_CLIENTE_DADOS_GERAIS',
                    items: [formPEDIDO, grid_PEDIDO_VENDA_CERTIFICADO, ITENS_PEDIDO_PagingToolbar.PagingToolbar(), toolbar_TB_PEDIDO]
                }, {
                    title: 'Certificado(s) de Produto',
                    closable: false,
                    autoScroll: false,
                    iconCls: 'icone_CERTIFICADO'
}],
                    listeners: {
                        tabchange: function(tabPanel, panel) {

                            if (panel.title == 'Certificado(s) de Produto') {

                                if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length == 0) {
                                    dialog.MensagemDeErro('Selecione um item de pedido para cadastrar / consultar o(s) certificados', panel.getId());
                                    tabPanel.setActiveTab(0);
                                    return;
                                }

                                if (grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().getSelections().length > 0) {
                                    var record = grid_PEDIDO_VENDA_CERTIFICADO.getSelectionModel().selections.items[0];

                                    panel2.NUMERO_PEDIDO_VENDA(record.data.NUMERO_PEDIDO);
                                    panel2.NUMERO_ITEM_VENDA(record.data.NUMERO_ITEM);
                                    panel2.ID_PRODUTO(record.data.ID_PRODUTO_PEDIDO);
                                    panel2.setaCodigoProduto(record.data.CODIGO_PRODUTO_PEDIDO);
                                    panel2.setaDescricaoProduto(record.data.DESCRICAO_PRODUTO);

                                    panel2.setaQtde(Math.abs(record.data.QTDE_A_FATURAR) > 0.00 ? record.data.QTDE_A_FATURAR : record.data.QTDE_PRODUTO_ITEM_PEDIDO);

                                    panel2.Reseta_Certificado();

                                    panel2.Carrega_NFs();
                                    panel2.seta_Numero_Lote(record.data.NUMERO_LOTE_ITEM_PEDIDO);
                                    panel2.carregaGrid();
                                }

                                if (panel.items.length == 0) {
                                    panel.add(panel2.panel());
                                    panel.doLayout();
                                }
                            }
                        }
                    }
                });

                panel1.add(TABPANEL1);

                Ext.getCmp('grid_PEDIDO_VENDA_CERTIFICADO').setHeight(AlturaDoPainelDeConteudo(197));

                /////////////////////

                return panel1;
            }