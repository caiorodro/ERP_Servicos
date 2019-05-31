var _novo_orcamento = false;

function Monta_Adm_Orcamentos() {

    var janela_itens = new JANELA_ITENS_ORCAMENTO();
    var _janelaNovoEmail = new janela_Envio_Email('_adm_orcamento');

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    ///// grids
    var ORCAMENTOS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ORCAMENTO', 'DATA_ORCAMENTO', 'NOMEFANTASIA_CLIENTE', 'CONTATO_ORCAMENTO', 'TOTAL_ORCAMENTO',
            'TELEFONE_CONTATO', 'EMAIL_CONTATO', 'VALIDADE_ORCAMENTO', 'CODIGO_CLIENTE_ORCAMENTO', 'STATUS',
            'ID_STATUS', 'NOME_VENDEDOR', 'OBS_NF_ORCAMENTO', 'TOTAL_PENDENTE', 'COND_PAGTO', 'TOTAL_ISS']
           ),
        listeners: {
            load: function (f, records, options) {
                ITENS_ORCAMENTO_Store.removeAll();
                ANALISE_ORCAMENTO_STORE1.removeAll();
            }
        }
    });

    var grid_ORCAMENTOS = new Ext.grid.GridPanel({
        id: 'grid_ORCAMENTOS',
        store: ORCAMENTOS_Store,
        title: 'Or&ccedil;amentos',
        tbar: [{
            xtype: 'label',
            text: 'Emissão'
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'TXT_FILTRO_DATA',
                xtype: 'datefield',
                value: dt1,
                allowBlank: false,
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            Carrega_ORCAMENTOs();
                        }
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                xtype: 'label',
                text: 'Cliente'
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'TXT_FILTRO_CLIENTE_ORCAMENTO',
                xtype: 'textfield',
                width: 155,
                autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            Carrega_ORCAMENTOs();
                        }
                    }
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                xtype: 'label',
                text: 'Orçamento'
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'TXT_FILTRO_NUMERO_ORCAMENTO',
                xtype: 'numberfield',
                width: 80,
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            Carrega_ORCAMENTOs();
                        }
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Buscar',
                icon: 'imagens/icones/database_search_16.gif',
                scale: 'medium',
                handler: function () {
                    Carrega_ORCAMENTOs();
                }
            }],
        columns: [
            { id: 'STATUS', header: "Status", width: 120, sortable: true, dataIndex: 'STATUS' },
            { id: 'NUMERO_ORCAMENTO', header: "Numero", width: 70, sortable: true, dataIndex: 'NUMERO_ORCAMENTO' },
            { id: 'DATA_ORCAMENTO', header: "Data", width: 75, sortable: true, dataIndex: 'DATA_ORCAMENTO', renderer: XMLParseDate },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 160, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
            { id: 'TOTAL_ORCAMENTO', header: "Total do Or&ccedil;amento", width: 120, sortable: true, dataIndex: 'TOTAL_ORCAMENTO', renderer: FormataValor, align: 'center' },
            { id: 'TOTAL_PENDENTE', header: "Total Pendente", width: 120, sortable: true, dataIndex: 'TOTAL_PENDENTE', renderer: FormataValor, align: 'center' },

            { id: 'CONTATO_ORCAMENTO', header: "Contato", width: 260, sortable: true, dataIndex: 'CONTATO_ORCAMENTO' },
            { id: 'TELEFONE_CONTATO', header: "Telefone", width: 110, sortable: true, dataIndex: 'TELEFONE_CONTATO' },
            { id: 'EMAIL_CONTATO', header: "e-mail", width: 250, sortable: true, dataIndex: 'EMAIL_CONTATO' },
            { id: 'VALIDADE_ORCAMENTO', header: "Validade", width: 75, sortable: true, dataIndex: 'VALIDADE_ORCAMENTO', renderer: XMLParseDate },
            { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 150, sortable: true, dataIndex: 'NOME_VENDEDOR' },

            { id: 'COND_PAGTO', header: "Cond. Pagto", width: 160, sortable: true, dataIndex: 'COND_PAGTO' },
            { id: 'OBS_NF_ORCAMENTO', header: "Dados Adicionais NF", width: 350, sortable: true, dataIndex: 'OBS_NF_ORCAMENTO' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(161),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (row, rowIndex, record) {
                    ITENS_ORCAMENTO_Store.removeAll();
                    ANALISE_ORCAMENTO_STORE1.removeAll();
                    AtualizaBotoes(record.data.ID_STATUS);
                }
            }
        }),
        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                Carrega_ITENS_ORCAMENTOs(record.data.NUMERO_ORCAMENTO);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (grid_ORCAMENTOS.getSelectionModel().getSelections().length > 0) {
                        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();
                        Carrega_ITENS_ORCAMENTOs(record.data.NUMERO_ORCAMENTO);
                    }
                }
            }
        }
    });

    var ORCAMENTO_PagingToolbar = new Th2_PagingToolbar();

    ORCAMENTO_PagingToolbar.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Carrega_Orcamentos');
    ORCAMENTO_PagingToolbar.setLinhasPorPagina(12);
    ORCAMENTO_PagingToolbar.setStore(ORCAMENTOS_Store);

    function RetornaFiltros_TB_CLIENTE_TRANSP_JsonData() {
        var empresa = Ext.getCmp('TXT_FILTRO_CLIENTE_ORCAMENTO').getValue() ? Ext.getCmp('TXT_FILTRO_CLIENTE_ORCAMENTO').getValue() : '';
        var data = Ext.getCmp('TXT_FILTRO_DATA').getRawValue() ? Ext.getCmp('TXT_FILTRO_DATA').getRawValue() : '';
        var numero = Ext.getCmp('TXT_FILTRO_NUMERO_ORCAMENTO').getValue() ? Ext.getCmp('TXT_FILTRO_NUMERO_ORCAMENTO').getValue() : 0;

        if (numero == '') numero = 0;

        var TB_TRANSP_JsonData = {
            EMPRESA_CONTATO: empresa,
            EMISSAO: data,
            NUMERO_ORCAMENTO: numero,
            ADMIN_USUARIO: _ADMIN_USUARIO,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_USUARIO: _ID_USUARIO,
            ID_VENDEDOR: _ID_VENDEDOR,
            start: 0,
            limit: ORCAMENTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ORCAMENTOs() {
        if (!Ext.getCmp('TXT_FILTRO_DATA').isValid())
            return;

        ORCAMENTO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_TRANSP_JsonData());
        ORCAMENTO_PagingToolbar.doRequest();
    }

    function AtualizaBotoes(status) {
        if (status == "4") {
            Ext.getCmp('BTN_ALTERAR_ORCAMENTO').disable();
            Ext.getCmp('BTN_DELETAR_ORCAMENTO').disable();
            Ext.getCmp('BTN_GERAR_PEDIDO').disable();
        }
        else if (status == "1") {
            Ext.getCmp('BTN_ALTERAR_ORCAMENTO').enable();
            Ext.getCmp('BTN_DELETAR_ORCAMENTO').enable();
            Ext.getCmp('BTN_GERAR_PEDIDO').disable();
        }
        else {
            Ext.getCmp('BTN_ALTERAR_ORCAMENTO').enable();
            Ext.getCmp('BTN_DELETAR_ORCAMENTO').enable();
            Ext.getCmp('BTN_GERAR_PEDIDO').enable();
        }
    }

    function Deleta_Orcamento() {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um or&ccedil;amento para Deletar');
            return;
        }

        dialog.MensagemDeConfirmacao('Deseja deletar este Or&ccedil;amento?', 'grid_ORCAMENTOS', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Deleta_Orcamento');
                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    grid_ORCAMENTOS.getStore().remove(record);
                    Ext.getCmp('grid_ITENS_ORCAMENTO').getStore().removeAll();
                    Ext.getCmp('grid_ANALISE_ORCAMENTO1').getStore().removeAll();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    ///////////

    var ITENS_ORCAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', 'QTDE_PRODUTO', 'PRECO_PRODUTO',
            'VALOR_TOTAL', 'CODIGO_CLIENTE_ITEM_ORCAMENTO', 'CUSTO_TOTAL_PRODUTO', 'MARGEM_VENDA_PRODUTO', 'VALOR_DESCONTO',
            'NUMERO_PEDIDO_ITEM_ORCAMENTO', 'OBS_ITEM_ORCAMENTO', 'TIPO_DESCONTO',
            'NAO_GERAR_PEDIDO', 'NUMERO_PEDIDO_VENDA', 'PROGRAMACAO_ITEM_ORCAMENTO',
            'DATA_ENTREGA', 'ATRASADA', 'CUSTOS', 'ALIQ_ISS', 'VALOR_ISS',
            'NUMERO_ITEM_PEDIDO_CLIENTE', 'CEP_INICIAL_ITEM_ORCAMENTO', 'ENDERECO_INICIAL_ITEM_ORCAMENTO', 'NUMERO_INICIAL_ITEM_ORCAMENTO',
            'COMPL_INICIAL_ITEM_ORCAMENTO', 'CIDADE_INICIAL_ITEM_ORCAMENTO',
            'ESTADO_INICIAL_ITEM_ORCAMENTO', 'CEP_FINAL_ITEM_ORCAMENTO', 'ENDERECO_FINAL_ITEM_ORCAMENTO',
            'NUMERO_FINAL_ITEM_ORCAMENTO', 'COMPL_FINAL_ITEM_ORCAMENTO',
            'CIDADE_FINAL_ITEM_ORCAMENTO', 'ESTADO_FINAL_ITEM_ORCAMENTO'])
    });

    ITENS_ORCAMENTO_Store.on('load', function (_store, records, options) {
        for (var i = 0; i < records.length; i++) {
            IO_expander.expandRow(i);
        }
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '<br /><table style="border-width: 1px; border-style: solid;"><tr><td><b>Origem</b><br />' +
            '<b>Endere&ccedil;o:</b> {ENDERECO_INICIAL_ITEM_ORCAMENTO} {NUMERO_INICIAL_ITEM_ORCAMENTO} {COMPL_INICIAL_ITEM_ORCAMENTO}<br />' +
            'CEP: {CEP_INICIAL_ITEM_ORCAMENTO} - <b>Cidade:</b> {CIDADE_INICIAL_ITEM_ORCAMENTO} - <b>Estado:</b> {ESTADO_INICIAL_ITEM_ORCAMENTO}</td>' +
            '<td><td><b>Destino</b><br />' +
            '<b>Endere&ccedil;o:</b> {ENDERECO_FINAL_ITEM_ORCAMENTO} {NUMERO_FINAL_ITEM_ORCAMENTO} {COMPL_FINAL_ITEM_ORCAMENTO}<br />' +
            '<b>CEP:</b> {CEP_FINAL_ITEM_ORCAMENTO} - <b>Cidade:</b> {CIDADE_FINAL_ITEM_ORCAMENTO} - <b>Estado:</b> {ESTADO_FINAL_ITEM_ORCAMENTO}</td>' +
            '</tr></table>' +
            '<br /><b>Observa&ccedil;&otilde;es:</b> {OBS_ITEM_ORCAMENTO}<br />{CONJUNTO}{CUSTOS}'
        )
    });

    var checkBoxSM_IO = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                if (record.data.NUMERO_PEDIDO_VENDA > 0) {
                    s.deselectRow(Index);
                }
            }
        }
    });

    function Nao_Gerar_Pedido(val, _metadata, _record) {
        if (val == 0 && _record.data.NUMERO_PEDIDO_VENDA == 0) {
            return "";
        }
        else if (val == 1 && _record.data.NUMERO_PEDIDO_VENDA == 0) {
            return "<span style='background-color: #FFF000; color: navy;'>N&atilde;o vai no pedido</span>";
        }
        else if (val == 0 && _record.data.NUMERO_PEDIDO_VENDA > 0) {
            return "<span style='background-color: #0000FF; color: #FFFFFF;'>Servi&ccedil;o Gerado</span>";
        }
    }

    function Programacao(val, _metadata, _record) {
        return _record.data.PROGRAMACAO_ITEM_ORCAMENTO == 1 ?
            "<span style='background-color: #a6a6db; color: navy;' title='Programa&ccedil;&atilde;o'>" + val + "</span>" :
            val;
    }

    var grid_ITENS_ORCAMENTO = new Ext.grid.GridPanel({
        id: 'grid_ITENS_ORCAMENTO',
        title: 'Itens do or&ccedil;amento',
        store: ITENS_ORCAMENTO_Store,
        enableColumnHide: _GERENTE_COMERCIAL == 1 ? true : false,
        tbar: [{
            id: 'BTN_DESMARCAR_PEDIDO',
            text: 'Desmarcar / Marcar item para Gera&ccedil;&atilde;o do Pedido',
            icon: 'imagens/icones/notepad_cancel_16.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de or&ccedil;amento', 'BTN_DESMARCAR_PEDIDO');
                    return;
                }

                var arr1 = new Array();
                var _NUMERO_ORCAMENTO;
                var records = new Array();

                for (var i = 0; i < Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().selections.getCount(); i++) {
                    var record = Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().selections.items[i];

                    if (!_NUMERO_ORCAMENTO)
                        _NUMERO_ORCAMENTO = record.data.NUMERO_ORCAMENTO;

                    arr1[i] = record.data.NUMERO_ITEM;
                    records[i] = record;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Marca_Sim_Nao_Gerar_Pedido');
                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO,
                    NUMERO_ITEM: arr1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];

                        record.beginEdit();
                        record.set('NAO_GERAR_PEDIDO', record.data.NAO_GERAR_PEDIDO == 0 ? 1 : 0);
                        record.endEdit();
                        record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            id: 'BTN_PROGRAMACAO',
            text: 'Marcar / Desmarcar item como Programa&ccedil;&atilde;o',
            icon: 'imagens/icones/calendar_ok_16.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de or&ccedil;amento', 'BTN_PROGRAMACAO');
                    return;
                }

                var arr1 = new Array();
                var _NUMERO_ORCAMENTO;
                var records = new Array();

                for (var i = 0; i < Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().selections.getCount(); i++) {
                    var record = Ext.getCmp('grid_ITENS_ORCAMENTO').getSelectionModel().selections.items[i];

                    if (!_NUMERO_ORCAMENTO)
                        _NUMERO_ORCAMENTO = record.data.NUMERO_ORCAMENTO;

                    arr1[i] = record.data.NUMERO_ITEM;
                    records[i] = record;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Marca_Desmarca_Programacao');
                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO,
                    NUMERO_ITEM: arr1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];

                        record.beginEdit();
                        record.set('PROGRAMACAO_ITEM_ORCAMENTO', record.data.PROGRAMACAO_ITEM_ORCAMENTO == 0 ? 1 : 0);
                        record.endEdit();
                        record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }],
        columns: [
            IO_expander,
            checkBoxSM_IO,
            { id: 'NAO_GERAR_PEDIDO', header: "Gerar Pedido", width: 105, sortable: true, dataIndex: 'NAO_GERAR_PEDIDO', renderer: Nao_Gerar_Pedido },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO', renderer: Programacao },
            { id: 'QTDE_PRODUTO', header: "Qtde", width: 70, sortable: true, dataIndex: 'QTDE_PRODUTO', renderer: FormataQtde },
            { id: 'VALOR_DESCONTO', header: "Desconto", width: 75, sortable: true, dataIndex: 'VALOR_DESCONTO', renderer: FormataDesconto, align: 'right' },
            { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL', header: "Valor Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ISS', header: "Al&iacute;q ISS", width: 80, sortable: true, dataIndex: 'ALIQ_ISS', renderer: FormataPercentual, align: 'right' },
            { id: 'VALOR_ISS', header: "Valor ISS", width: 80, sortable: true, dataIndex: 'VALOR_ISS', renderer: FormataValor, align: 'right' },

            { id: 'DATA_ENTREGA', header: "Entrega", width: 75, sortable: true, dataIndex: 'DATA_ENTREGA', renderer: EntregaAtrasadaOrcamento },
            { id: 'ITEM_REQUER_CERTIFICADO', header: "Certificado", width: 70, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01 },
            { id: 'NUMERO_PEDIDO_ITEM_ORCAMENTO', header: "Nr. Pedido do Cliente", width: 150, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_ORCAMENTO' },
            { id: 'NUMERO_ITEM_PEDIDO_CLIENTE', header: "Nr. Item Cliente", width: 110, sortable: true, dataIndex: 'NUMERO_ITEM_PEDIDO_CLIENTE' },

            { id: 'NUMERO_PEDIDO_VENDA', header: "N&ordm; do servi&ccedil;o", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', header: "Descri&ccedil;&atilde;o", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(161),
        width: '100%',

        plugins: IO_expander,
        sm: checkBoxSM_IO
    });

    var ITENS_ORCAMENTO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_ORCAMENTO_PagingToolbar.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Carrega_Itens_Orcamento');
    ITENS_ORCAMENTO_PagingToolbar.setStore(ITENS_ORCAMENTO_Store);

    function RetornaFiltros_ORCAMENTOS_JsonData(numero_orcamento) {

        var TB_TRANSP_JsonData = {
            NUMERO_ORCAMENTO: numero_orcamento,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: ITENS_ORCAMENTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_ORCAMENTOs(numero_orcamento) {
        ITENS_ORCAMENTO_PagingToolbar.setParamsJsonData(RetornaFiltros_ORCAMENTOS_JsonData(numero_orcamento));
        ITENS_ORCAMENTO_PagingToolbar.doRequest();
    }

    ///////////

    var ANALISE_ORCAMENTO_STORE1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CRITERIO', 'MOTIVO'])
    });

    var grid_ANALISE_ORCAMENTO1 = new Ext.grid.GridPanel({
        id: 'grid_ANALISE_ORCAMENTO1',
        store: ANALISE_ORCAMENTO_STORE1,
        columns: [
            { id: 'CRITERIO', header: "Crit&eacute;rio", width: 150, sortable: true, dataIndex: 'CRITERIO', renderer: Analise },
            { id: 'MOTIVO', header: "Motivo", width: 600, sortable: true, dataIndex: 'MOTIVO'}],
        stripeRows: true,
        height: 294,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var wAnalise = new Ext.Window({
        layout: 'form',
        title: 'An&aacute;lise do or&ccedil;amento',
        iconCls: 'icone_TB_CLIENTE',
        width: 760,
        height: 325,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        style: 'position: absolute;',
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [grid_ANALISE_ORCAMENTO1]
    });

    ///////////

    function Aplica_Analise() {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro("Selecione um or&ccedil;amento para analisar");
            return;
        }

        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

        var codigo_cliente = record.data.CODIGO_CLIENTE_ORCAMENTO == "" ?
            0 : record.data.CODIGO_CLIENTE_ORCAMENTO;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Aplica_Analise_Orcamento');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
            CODIGO_CLIENTE: codigo_cliente,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            ANALISE_ORCAMENTO_STORE1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Envia_Orcamento_por_Email(record) {
        var _ajax = new Th2_Ajax();

        if (record.data.CODIGO_CLIENTE_ORCAMENTO == 0 || record.data.CODIGO_CLIENTE_ORCAMENTO == '') {
            _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Monta_Anexo_Cliente_Nao_Cadastrado');
        }
        else {
            _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Monta_Anexo_Cliente_Cadastrado');
        }

        _ajax.setJsonData({
            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            _janelaNovoEmail.resetaFormulario();
            _janelaNovoEmail.Botao_Salvar(true);
            _janelaNovoEmail.Botao_Enviar(true);
            _janelaNovoEmail.Botao_Responder(false);
            _janelaNovoEmail.Botao_Encaminhar(false);

            _janelaNovoEmail.setRemetente(_record_conta_email.data.CONTA_EMAIL);
            _janelaNovoEmail.setDestinatario(record.data.EMAIL_CONTATO);
            _janelaNovoEmail.setBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
            _janelaNovoEmail.setRawBody('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);

            _janelaNovoEmail.NUMERO_CRM(0);
            _janelaNovoEmail.setAssunto('A/C. ' + record.data.CONTATO_ORCAMENTO + ' - Orçamento de servi&ccedil;os [' + _EMITENTE + ']');

            _janelaNovoEmail.AdicionaNovoAnexo(result.anexo);

            _janelaNovoEmail.show('BTN_ENVIAR_EMAIL_ORCAMENTO');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ///Estatísticas
    var store_Estatisticas_Orcamentos = new Ext.data.JsonStore({
        fields: ['mes_ano', 'pendentes', 'vencidos', 'pedidos']
    });

    var chart_Estatisticas = new Ext.Panel({
        width: '100%',
        height: 294,
        items: {
            xtype: 'stackedbarchart',
            store: store_Estatisticas_Orcamentos,
            yField: 'mes_ano',
            xAxis: new Ext.chart.NumericAxis({
                stackingEnabled: true,
                labelRenderer: Ext.util.Format.brMoney
            }),
            series: [{
                xField: 'pendentes',
                displayName: 'Orçamentos Pendentes',
                style: {
                    color: 0xFF3300
                }
            }, {
                xField: 'vencidos',
                displayName: 'Orçamentos Vencidos',
                style: {
                    color: 0x990000
                }
            }, {
                xField: 'pedidos',
                displayName: 'Servi&ccedil;o Fechado',
                style: {
                    color: 0x0000FF
                }
            }]
        }
    });

    var wEstatisticas = new Ext.Window({
        layout: 'form',
        title: 'Estat&iacute;sticas gerais de todos os or&ccedil;amentos',
        iconCls: 'icone_Th2_Dash',
        width: 760,
        height: 325,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        style: 'position: absolute;',
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            show: function (w) {
            }
        },
        items: [chart_Estatisticas]
    });

    function Atualizar_Estatisticas() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Calcula_Estatisticas_Orcamentos');
        _ajax.setJsonData({
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            SUPERVISOR_VENDAS: _SUPERVISOR,
            ID_VENDEDOR: _ID_VENDEDOR,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            var _data = eval(result);

            store_Estatisticas_Orcamentos.loadData(_data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var panel5 = new Ext.Panel({
        id: 'pOA5',
        border: true,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [grid_ORCAMENTOS, ORCAMENTO_PagingToolbar.PagingToolbar()]
            }, {
                columnWidth: .50,
                items: [grid_ITENS_ORCAMENTO, ITENS_ORCAMENTO_PagingToolbar.PagingToolbar()]
            }]
        }],

        bbar: [{
            text: 'Novo Or&ccedil;amento',
            icon: 'imagens/icones/document_fav_24.gif',
            scale: 'medium',
            style: 'width: 100%',
            handler: function () {
                Prepara_Novo_Orcamento();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_ALTERAR_ORCAMENTO',
    text: 'Alterar Or&ccedil;amento',
    icon: 'imagens/icones/write_24.gif',
    scale: 'medium',
    handler: function () {
        Altera_Orcamento();
    }
},
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_DELETAR_ORCAMENTO',
    text: 'Deletar Or&ccedil;amento',
    icon: 'imagens/icones/document_delete_24.gif',
    scale: 'medium',
    handler: function () {
        Deleta_Orcamento();
    }
},
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_ANALISAR_ORCAMENTO',
    text: 'Analisar Or&ccedil;amento',
    icon: 'imagens/icones/system_24.gif',
    scale: 'medium',
    handler: function (btn) {
        wAnalise.setPosition(btn.getPosition()[0], btn.getPosition()[1] - wAnalise.getHeight());
        wAnalise.toFront();
        wAnalise.show(btn.getId());

        Aplica_Analise();
    }
},
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    text: 'Imprimir Or&ccedil;amento',
    icon: 'imagens/icones/printer_24.gif',
    scale: 'medium',
    handler: function () {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro("Selecione um or&ccedil;amento para imprimir");
            return;
        }

        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Imprime_Orcamento');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
},
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_GERAR_PEDIDO',
    text: 'Gerar Servi&ccedil;o',
    icon: 'imagens/icones/document_config_24.gif',
    scale: 'medium',
    handler: function (btn) {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro("Selecione um or&ccedil;amento para gerar o servi&ccedil;o");
            return;
        }

        var _geraServicoJaFaturado = new geraServicoJaFaturado();

        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

        _geraServicoJaFaturado.acaoServicoNaoFaturado(function (ciclistas) {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Gera_Pedido');
            _ajax.setJsonData({
                NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
                NOME_FANTASIA_EMITENTE: _EMITENTE,
                ID_EMPRESA: _ID_EMPRESA,
                GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
                JA_FATURAR: 0,
                CICLISTAS: ciclistas,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                record.beginEdit();
                record.set('STATUS', result[0]);
                record.set('ID_STATUS', result[0].indexOf('Parcial') > -1 ? 2 : 4);
                record.set('TOTAL_PENDENTE', result[1]);
                record.endEdit();
                record.commit();

                AtualizaBotoes(result[0].indexOf('Parcial') > -1 ? 2 : 4);

                Carrega_ITENS_ORCAMENTOs(record.data.NUMERO_ORCAMENTO);

                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[0].disable();
                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        });

        _geraServicoJaFaturado.acaoServicoJaFaturado(function (ciclistas) {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Gera_Pedido');
            _ajax.setJsonData({
                NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
                NOME_FANTASIA_EMITENTE: _EMITENTE,
                ID_EMPRESA: _ID_EMPRESA,
                GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
                JA_FATURAR: 1,
                CICLISTAS: ciclistas,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                record.beginEdit();
                record.set('STATUS', result[0]);
                record.set('ID_STATUS', result[0].indexOf('Parcial') > -1 ? 2 : 4);
                record.set('TOTAL_PENDENTE', result[1]);
                record.endEdit();
                record.commit();

                AtualizaBotoes(result[0].indexOf('Parcial') > -1 ? 2 : 4);

                Carrega_ITENS_ORCAMENTOs(record.data.NUMERO_ORCAMENTO);

                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[0].disable();
                Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        });

        _geraServicoJaFaturado.show(btn);
    }
},
{ xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_ESTAT_ORCAMENTOS',
    text: 'Estat&iacute;sticas',
    icon: 'imagens/icones/stadistics_24.gif',
    scale: 'medium',
    handler: function (btn) {
        wEstatisticas.setPosition((btn.getPosition()[0] + btn.getWidth()) - wEstatisticas.getWidth(), btn.getPosition()[1] - wEstatisticas.getHeight());
        wEstatisticas.toFront();
        //wEstatisticas.show(btn.getId());
        wEstatisticas.show();

        Atualizar_Estatisticas();
    }
},
{ xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    id: 'BTN_ENVIAR_EMAIL_ORCAMENTO',
    text: 'Enviar Or&ccedil;amento<br />por e-mail',
    icon: 'imagens/icones/mail_next_24.gif',
    scale: 'large',
    handler: function () {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um or&ccedil;amento para envi&aacute;-lo por e-mail', 'BTN_ENVIAR_EMAIL_ORCAMENTO');
            return;
        }

        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

        Envia_Orcamento_por_Email(record);
    }
}]
    });

    function Altera_Orcamento() {
        if (grid_ORCAMENTOS.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um or&ccedil;amento para alterar');
            return;
        }

        Ext.getCmp('grid_ITENS_ORCAMENTO').getStore().removeAll();
        Ext.getCmp('grid_ANALISE_ORCAMENTO1').getStore().removeAll();

        var record = grid_ORCAMENTOS.getSelectionModel().getSelected();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Busca_Dados_Orcamento');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('NUMERO_ORCAMENTO').setValue(record.data.NUMERO_ORCAMENTO);
            Ext.getCmp('HDF_NUMERO_ORCAMENTO').setValue(record.data.NUMERO_ORCAMENTO);

            Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').setActiveTab(0);

            Ext.getCmp('CONTATO_ORCAMENTO').setValue(result.CONTATO_ORCAMENTO);
            Ext.getCmp('TELEFONE_CONTATO').setValue(result.TELEFONE_CONTATO);
            Ext.getCmp('ID_UF_ORCAMENTO').setValue(result.ID_UF_ORCAMENTO);
            Ext.getCmp('EMAIL_CONTATO').setValue(result.EMAIL_CONTATO);
            Ext.getCmp('CODIGO_COND_PAGTO').setValue(result.CODIGO_COND_PAGTO);
            Ext.getCmp('CODIGO_VENDEDOR').setValue(result.CODIGO_VENDEDOR);

            Ext.getCmp('HDF_NUMERO_ORCAMENTO').setValue(record.data.NUMERO_ORCAMENTO);

            Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').setValue(result.CODIGO_CLIENTE_ORCAMENTO);

            Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').readOnly = result.CODIGO_CLIENTE_ORCAMENTO == 0 ?
                                        false : true;

            Ext.getCmp('OBS_ORCAMENTO').setValue(result.OBS_ORCAMENTO);
            Ext.getCmp('OBS_NF_ORCAMENTO').setValue(result.OBS_NF_ORCAMENTO);
            Ext.getCmp('VALIDADE_ORCAMENTO').setRawValue(result.VALIDADE_ORCAMENTO);

            Ext.getCmp('DADOS_CLIENTE_ORCAMENTO').setText(result.DADOS_CLIENTE_ORCAMENTO, false);

            AtualizaTotais(result.TOTAIS);

            Ext.getCmp('panelCadastroOrcamento').setTitle("Alterar Or&ccedil;amento - Novo Item de Or&ccedil;amento");

            Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();
            Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[0].enable();

            Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').setActiveTab(0);

            Ext.getCmp('NUMERO_PEDIDO_ITEM_ORCAMENTO').setValue('');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    return panel5;
}

function Prepara_Novo_Orcamento() {
    ResetaFormulario_Item();

    Ext.getCmp('CONTATO_ORCAMENTO').reset();
    Ext.getCmp('TELEFONE_CONTATO').reset();
    Ext.getCmp('ID_UF_ORCAMENTO').reset();
    Ext.getCmp('EMAIL_CONTATO').reset();
    Ext.getCmp('CODIGO_COND_PAGTO').reset();

    Ext.getCmp('panelCadastroOrcamento').setTitle("Novo Or&ccedil;amento - Novo Item de Or&ccedil;amento");

    Ext.getCmp('NUMERO_ORCAMENTO').reset();
    Ext.getCmp('HDF_NUMERO_ORCAMENTO').setValue('0');
    Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').setValue(0);

    Ext.getCmp('NUMERO_PEDIDO_ITEM_ORCAMENTO').setValue('');

    Busca_Prazo_Orcamento();

    Ext.getCmp('OBS_ORCAMENTO').reset();

    Ext.getCmp('DADOS_CLIENTE_ORCAMENTO').setText("&nbsp;", false);

    Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').enable();

    AtualizaTotais();

    _novo_orcamento = true;

    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[1].disable();
    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').items.items[0].enable();

    Ext.getCmp('TB_ITEM_ORCAMENTO_TABPANEL').setActiveTab(0);

    Habilita_UF(true);

    Ext.getCmp('grid_ITEM_ORCAMENTO').getStore().removeAll();

    Ext.getCmp('CONTATO_ORCAMENTO').focus();
}

function Atualiza_Orcamento_Selecionado(record) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Busca_Orcamento');
    _ajax.ExibeDivProcessamento(false);
    _ajax.setJsonData({
        NUMERO_ORCAMENTO: record.data.NUMERO_ORCAMENTO,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        record.beginEdit();
        record.set('CONTATO_ORCAMENTO', result.CONTATO_ORCAMENTO);
        record.set('TOTAL_ORCAMENTO', result.TOTAL_ORCAMENTO);

        if (result.TOTAL_PENDENTE)
            record.set('TOTAL_PENDENTE', result.TOTAL_PENDENTE);

        record.set('TELEFONE_CONTATO', result.TELEFONE_CONTATO);
        record.set('EMAIL_CONTATO', result.EMAIL_CONTATO);
        record.set('VALIDADE_ORCAMENTO', result.VALIDADE_ORCAMENTO);
        record.set('MARGEM_MEDIA', result.MARGEM_MEDIA);
        record.set('MARGEM_GROS', result.MARGEM_GROS);
        record.endEdit();
        record.commit();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function geraServicoJaFaturado() {

    var store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CICLISTA', 'NOME_CICLISTA', 'SERVICO']
           )
    });

    function possuiServico(val) {
        return val == 1 ?
            "<img src='imagens/icones/user_ok_16.gif' title='Possui servi&ccedil;o no(s) item(s) selecionado(s)' />" :
            "";
    }

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

    var grid1 = new Ext.grid.GridPanel({
        store: store1,
        title: 'Selecione 1 ou mais ciclistas',
        columns: [
        checkBoxSM_,
        { id: 'NOME_CICLISTA', header: "Ciclista", width: 320, sortable: true, dataIndex: 'NOME_CICLISTA' },
        ],
        stripeRows: true,
        height: 270,
        width: '100%',

        sm: checkBoxSM_
    });

    var _acao;

    this.acaoServicoNaoFaturado = function (pValue) {
        _acao = pValue;
    };

    var _acao1;

    this.acaoServicoJaFaturado = function (pValue) {
        _acao1 = pValue;
    };

    function carregaGrid() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Carrega_Ciclista_Servico2');
        _ajax.setJsonData({
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var BTN_GERAR_SERVICO_NAO_FATURADO = new Ext.Button({
        text: "<span style='font-size: 12pt;'>Gerar servi&ccedil;o <b>n&atilde;o</b> faturado</span>",
        icon: 'imagens/icones/database_reload_24.gif',
        scale: 'large',
        handler: function (btn) {
            var arr1 = new Array();

            for (var i = 0; i < grid1.getSelectionModel().selections.length; i++) {
                arr1[i] = grid1.getSelectionModel().selections.items[i].data.ID_CICLISTA;
            }

            _acao(arr1);
            wAnalise.close();
        }
    });

    var BTN_GERAR_SERVICO_JA_FATURADO = new Ext.Button({
        text: "<span style='font-size: 12pt;'>Gerar servi&ccedil;o <b>j&aacute;</b> faturado</span>",
        icon: 'imagens/icones/database_refresh_24.gif',
        scale: 'large',
        handler: function (btn) {
            var arr1 = new Array();

            for (var i = 0; i < grid1.getSelectionModel().selections.length; i++) {
                arr1[i] = grid1.getSelectionModel().selections.items[i].data.ID_CICLISTA;
            }

            _acao1(arr1);
            wAnalise.close();
        }
    });

    var wAnalise = new Ext.Window({
        layout: 'form',
        title: 'Gerar servi&ccedil;o',
        width: 466,
        height: 344,
        frame: true,
        closable: true,
        draggable: true,
        minimizable: false,
        resizable: false,
        modal: true,
        items: [grid1, {
            layout: 'column',
            items: [{
                items: [BTN_GERAR_SERVICO_NAO_FATURADO]
            }, {
                items: [BTN_GERAR_SERVICO_JA_FATURADO]
            }]
        }]
    });

    this.show = function (elm) {
        wAnalise.show(elm.getId());
        carregaGrid();
    };
}