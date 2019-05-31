
var Ordem_Placa;

function Faturamento_Placa() {

    var wAna = new JANELA_ANALISE_PEDIDO();
    var fu = new JANELA_FOLLOW_UP_PEDIDO();
    var posicao = new Nova_Posicao_Pedido();
    var notas = new Janela_Notas_Pedido_Venda();

    var dados_fatura1 = new Dados_Faturamento_Pedido();

    var TXT_NUMERO_PEDIDO = new Ext.form.NumberField({
        fieldLabel: 'Numero do Pedido',
        width: 90
    });

    var TXT_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Cliente',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Sugerir Roteiro',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function() {
            if (!formPEDIDO.getForm().isValid())
                return;

            Carrega_ITENS_SUGESTAO();
        }
    });

    var BTN_CARREGAR_PEDIDOS_PLACA = new Ext.Button({
        text: 'Listar pedidos gravados na placa',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function() {
            if (!formPEDIDO.getForm().isValid())
                return;

            Carrega_ROTEIRO();
        }
    });

    var LBL_APROVEITAMENTO = new Ext.form.Label();

    var combo_PLACA1_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['PLACA', 'CAPACIDADE_CARGA', 'CUSTO_COMBUSTIVEL', 'QTDE_KM_POR_UNIDADE']
       )
    });

    function TB_VEICULO_CARREGA_PLACAS1() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/LISTA_PLACAS_VEICULOS');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            combo_PLACA1_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    TB_VEICULO_CARREGA_PLACAS1();

    function Obtem_Aproveitamento_Carga(PLACA) {

        var _PESO_TOTAL = 0;

        for (var i = 0; i < ITENS_PEDIDO_VENDA1_Store.getCount() - 1; i++) {
            _PESO_TOTAL += parseFloat(ITENS_PEDIDO_VENDA1_Store.getAt(i).data.PESO_TOTAL);
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ROTEIRO.asmx/Obtem_Aproveitamento_Carga');
        _ajax.setJsonData({ PLACA: PLACA, PESO_TOTAL: _PESO_TOTAL, ID_USUARIO: _ID_USUARIO });
        _ajax.ExibeDivProcessamento(false);

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            LBL_APROVEITAMENTO.setText(result, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var combo_PLACA_ROTEIRO1 = new Ext.form.ComboBox({
        store: combo_PLACA1_Store,
        fieldLabel: 'Ve&iacute;culo',
        valueField: 'PLACA',
        displayField: 'PLACA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 120,
        allowBlank: false,
        emptyText: 'Selecione aqui',
        listeners: {
            select: function(combo, record, index) {
                if (index > -1) {
                    Obtem_Aproveitamento_Carga(combo.getValue());
                }
            }
        }
    });

    ///// grid

    var ITENS_PEDIDO_VENDA1_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO',
                'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'MARGEM_VENDA_ITEM_PEDIDO', 'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO', 'ALIQ_ICMS_ITEM_PEDIDO',
                'VALOR_ICMS_ITEM_PEDIDO', 'VALOR_ICMS_SUBS_ITEM_PEDIDO', 'ALIQ_IPI_ITEM_PEDIDO', 'VALOR_IPI_ITEM_PEDIDO',
                'CODIGO_CFOP_ITEM_PEDIDO', 'CODIGO_CLIENTE_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
                'NUMERO_PEDIDO_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
                'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
                'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
                'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_SUBS', 'TOTAL_PEDIDO', 'VALOR_FRETE', 'MARGEM',
                'STATUS_ESPECIFICO', 'QTDE_A_FATURAR', 'ITEM_A_FATURAR', 'QTDE_FATURADA', 'NUMEROS_INTERNOS', 'NUMEROS_NF',
                'ATRASADA', 'PLACA', 'ORDEM_ENTREGA', 'DISTANCIA', 'TXT_DISTANCIA', 'SUGESTAO_OU_ROTEIRO', 'PESO_TOTAL'])
           ,
        listeners: {
            load: function() {
                Obtem_Aproveitamento_Carga(combo_PLACA_ROTEIRO1.getValue());
            }
        }
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<table style='width: 70%;'><tr><td>" +
                    "<table>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Produto</b>:</td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_PRODUTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Complemento:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_COMPLEMENTO_PRODUTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Vendedor(a):</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {NOME_VENDEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Cond. Pagto:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_CP}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Transporte:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {NOME_FANTASIA_TRANSP}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>(0-FOB | 1-CIF):</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {FRETE_POR_CONTA}</td></tr>" +

                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Contato:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {CONTATO_ORCAMENTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Telefone:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {TELEFONE_CONTATO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>e-mail:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {EMAIL_CONTATO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs.:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_ITEM_PEDIDO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs. Or&ccedil;amento:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_ORCAMENTO}</td></tr></table>" +
                    "</td><td>" +
                    "<table>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de Produtos</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_TOTAL}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de IPI</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_IPI}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de ICMS</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_ICMS}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de ICMS ST</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_ICMS_SUBS}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de Frete</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_FRETE}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total do Pedido</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {TOTAL_PEDIDO}</td></tr>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Margem M&eacute;dia</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {MARGEM}</td></tr></table></td></tr></table>"
                    )
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function(s, Index, record) {
                Habilita_Botoes(s);
            },
            rowdeselect: function(s, Index, record) {
                Habilita_Botoes(s);
            }
        }
    });

    function Habilita_Botoes(s) {
        Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO2').enable();
        Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO1').enable();
        Ext.getCmp('BTN_NOTAS_FISCAIS_PEDIDO2').enable();
        Ext.getCmp('BTN_SALVAR_ROTEIRO_PADRAO').enable();
        Ext.getCmp('BTN_ALTERAR_PLACA_ORDEM').enable();

        Ext.getCmp('BTN_MARCAR_FATURAR1').enable();

        for (var i = 0; i < s.selections.items.length; i++) {
            if (s.selections.items[i].data.STATUS_ESPECIFICO != 2 &&
                s.selections.items[i].data.STATUS_ESPECIFICO != 5) {
                Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO2').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO > 1 && s.selections.items[i].data.STATUS_ESPECIFICO < 5) {
                Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO1').disable();
            }

            if (s.selections.items[i].data.NUMEROS_INTERNOS.length == 0 &&
                s.selections.items[i].data.NUMEROS_NF.length == 0) {
                Ext.getCmp('BTN_NOTAS_FISCAIS_PEDIDO2').disable();
            }

            if (s.selections.items[i].data.SUGESTAO_OU_ROTEIRO == 0) {
                Ext.getCmp('BTN_ALTERAR_PLACA_ORDEM').disable();
            }

            for (var i = 0; i < ITENS_PEDIDO_VENDA_Store.getCount() - 1; i++) {
                var record = ITENS_PEDIDO_VENDA_Store.getAt(i);

                if (record.dirty) {
                    Ext.getCmp('BTN_MARCAR_FATURAR1').disable();
                }
            }
        }
    }

    var TXT_QTDE_A_FATURAR = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0
    });

    function ITEM_MARCADO_FATURAR(val, _metadata, _record) {
        return _record.data.ITEM_A_FATURAR == 1 ?
                "<span style='background-color: #0000FF; color: #CCFFFF; font-weight: bold;' title='Item marcado para faturar'>" + FormataQtde(val) + "</span>" :
                FormataQtde(val);
    }

    function sugestao_roteiro(val) {
        return val == 0 ?
            "<span style='background-color: #999966; color: #FFFF00; font-family: tahoma;'>Sugest&atilde;o</span>" :
            "<span style='background-color: #0099cc; color: #FFFFFF; font-family: tahoma;'>Roteiro</span>";
    }

    var grid_ITENS_PEDIDO_VENDA1 = new Ext.grid.EditorGridPanel({
        id: 'grid_ITENS_PEDIDO_VENDA1',
        store: ITENS_PEDIDO_VENDA1_Store,
        tbar: [{
            icon: 'imagens/icones/binary_field_save_16.gif',
            text: 'Salvar quantidades a faturar',
            scale: 'medium', 
            handler: function() {
                GravaQtdesAFaturar();
            }
        }, '-', {
            id: 'BTN_MARCAR_FATURAR1',
            icon: 'imagens/icones/ok_16.gif',
            text: 'Marcar item(ns) para faturar',
            scale: 'medium', 
            handler: function() {
                Marca_Itens_Faturar(1);
            }
        }, '-', {
            icon: 'imagens/icones/delete_16.gif',
            text: 'Desmarcar item(ns) para faturar',
            scale: 'medium', 
            handler: function() {
                Marca_Itens_Faturar(0);
            }
        }, '-', {
            id: 'BTN_SALVAR_ROTEIRO_PADRAO',
            icon: 'imagens/icones/data_transport_save_16.gif',
            text: '&nbsp;Salvar roteiro',
            scale: 'medium', 
            handler: function() {
                if (!formPEDIDO.getForm().isValid()) {
                    return;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ROTEIRO.asmx/GravaRoteiroPadrao');
                _ajax.setJsonData({ PLACA: combo_PLACA_ROTEIRO1.getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function(response, options) {
                    Carrega_ROTEIRO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            id: 'BTN_ALTERAR_PLACA_ORDEM',
            icon: 'imagens/icones/calendar_fav_16.gif',
            scale: 'medium', 
            text: '&nbsp;Alterar ordem de entrega / placa',
            handler: function() {
                if (!Ordem_Placa) {
                    Ordem_Placa = new Altera_Ordem_Placa();
                }

                if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um pedido para alterar a placa ou a ordem de entrega', 'BTN_ALTERAR_PLACA_ORDEM');
                    return;
                }

                var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                Ordem_Placa.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                Ordem_Placa.ORDEM_ENTREGA(record.data.ORDEM_ENTREGA);
                Ordem_Placa.PLACA(record.data.PLACA);

                Ordem_Placa.show('BTN_ALTERAR_PLACA_ORDEM');
            }
}],
            columns: [
                    IO_expander,
                    checkBoxSM_,

            { id: 'SUGESTAO_OU_ROTEIRO', header: "Sugest&atilde;o / Roteiro", width: 100, sortable: true, dataIndex: 'SUGESTAO_OU_ROTEIRO', renderer: sugestao_roteiro },
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 135, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },

            { id: 'PLACA', header: "Placa do Ve&iacute;culo", width: 100, sortable: true, dataIndex: 'PLACA' },
            { id: 'ORDEM_ENTREGA', header: "Ordem de Entrega", width: 100, sortable: true, dataIndex: 'ORDEM_ENTREGA' },
            { id: 'TXT_DISTANCIA', header: "Dist&acirc;ncia KM", width: 90, sortable: true, dataIndex: 'TXT_DISTANCIA' },

            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center', hidden: true },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_CFOP_ITEM_PEDIDO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_PEDIDO', hidden: true },
            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Compras },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 78, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },
            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: ITEM_MARCADO_FATURAR,
                editor: TXT_QTDE_A_FATURAR
            },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right', hidden: true },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center', hidden: true },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_PEDIDO', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', header: "Valor ICMS ST", width: 105, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_PEDIDO', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },
            { id: 'NUMEROS_INTERNOS', header: "Numero(s) Internos(s) NF", width: 210, sortable: true, dataIndex: 'NUMEROS_INTERNOS' },
            { id: 'NUMEROS_NF', header: "Numero(s) NF(s)", width: 210, sortable: true, dataIndex: 'NUMEROS_NF' }

        ],
            stripeRows: true,
            height: 400,
            width: '100%',

            sm: checkBoxSM_,

            plugins: IO_expander,

            listeners: {
                beforeedit: function(e) {
                    if (e.record.data.STATUS_ITEM_PEDIDO != _STATUS_LIBERADO_FATURAR &&
                        e.record.data.STATUS_ITEM_PEDIDO != _STATUS_FATURADO_PARCIAL) {
                        e.cancel = true;
                    }
                    else {
                        //TXT_QTDE_A_FATURAR.maxValue = e.record.data.QTDE_PRODUTO_ITEM_PEDIDO - e.record.data.QTDE_FATURADA;
                    }
                }
            }
        });

        var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

        ITENS_PEDIDO_PagingToolbar.setStore(ITENS_PEDIDO_VENDA1_Store);
        ITENS_PEDIDO_PagingToolbar.setLinhasPorPagina(35);

        function RetornaFiltros_PEDIDOS_JsonData() {
            var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

            if (_numero_pedido.length == 0)
                _numero_pedido = 0;

            var TB_TRANSP_JsonData = {
                PLACA: combo_PLACA_ROTEIRO1.getValue(),
                NUMERO_PEDIDO: _numero_pedido,
                CLIENTE: TXT_CLIENTE.getValue(),
                start: 0,
                limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSP_JsonData;
        }

        function RetornaFiltros_ROTEIRO_JsonData() {
            var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

            if (_numero_pedido.length == 0)
                _numero_pedido = 0;

            var TB_TRANSP_JsonData = {
                PLACA: combo_PLACA_ROTEIRO1.getValue(),
                NUMERO_PEDIDO: _numero_pedido,
                CLIENTE: TXT_CLIENTE.getValue(),
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSP_JsonData;
        }

        function Carrega_ITENS_SUGESTAO() {
            ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_ROTEIRO.asmx/Monta_Sugestao_Roteiro');
            ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
            ITENS_PEDIDO_PagingToolbar.doRequest();
        }

        function Carrega_ROTEIRO() {
            ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_ROTEIRO.asmx/Lista_Roteiro');
            ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_ROTEIRO_JsonData());
            ITENS_PEDIDO_PagingToolbar.doRequest();
        }

        var formPEDIDO = new Ext.FormPanel({
            bodyStyle: 'padding:2px 2px 0',
            labelAlign: 'top',
            frame: true,
            width: '100%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .11,
                    layout: 'form',
                    items: [TXT_NUMERO_PEDIDO]
                }, {
                    columnWidth: .23,
                    layout: 'form',
                    items: [TXT_CLIENTE]
                }, {
                    columnWidth: .13,
                    layout: 'form',
                    items: [combo_PLACA_ROTEIRO1]
                }, {
                    columnWidth: .11,
                    items: [BTN_LISTAR_PEDIDOS]
                }, {
                    columnWidth: .20,
                    items: [BTN_CARREGAR_PEDIDOS_PLACA]
                }, {
                    columnWidth: .20,
                    items: [LBL_APROVEITAMENTO]
}]
}]
                });

                function GravaQtdesAFaturar() {
                    var array1 = new Array();
                    var arr_Record = new Array();

                    grid_ITENS_PEDIDO_VENDA1.getStore().each(Salva_Store);

                    function Salva_Store(record) {
                        if (record.dirty) {
                            array1[array1.length] = {
                                NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                                NUMERO_ITEM: record.data.NUMERO_ITEM,
                                QTDE_A_FATURAR: record.data.QTDE_A_FATURAR
                            };

                            arr_Record[arr_Record.length] = record;
                        }
                    }

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Salva_Qtdes_a_Faturar');
                    _ajax.setJsonData({ lista: array1 });

                    var _sucess = function(response, options) {
                        for (var n = 0; n < arr_Record.length; n++) {
                            arr_Record[n].commit();
                        }
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }

                function Marca_Itens_Faturar(marca_desmarca) {
                    var array1 = new Array();
                    var arr_Record = new Array();

                    for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.length; i++) {
                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i];

                        if (record.data.STATUS_ESPECIFICO == 2 || record.data.STATUS_ESPECIFICO == 5) {
                            if (marca_desmarca == 1) {
                                if (record.data.QTDE_A_FATURAR > 0.000) {
                                    array1[array1.length] = {
                                        NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                                        NUMERO_ITEM: record.data.NUMERO_ITEM
                                    };

                                    arr_Record[arr_Record.length] = record;
                                }
                            }
                            else {
                                array1[array1.length] = {
                                    NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                                    NUMERO_ITEM: record.data.NUMERO_ITEM
                                };

                                arr_Record[arr_Record.length] = record;
                            }
                        }
                    }

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl(marca_desmarca == 1 ?
                        'servicos/TB_PEDIDO_VENDA.asmx/Marca_Itens_Faturar' :
                        'servicos/TB_PEDIDO_VENDA.asmx/Desmarca_Itens_Faturar');

                    _ajax.setJsonData({ itens: array1 });

                    var _sucess = function(response, options) {
                        for (var n = 0; n < arr_Record.length; n++) {

                            arr_Record[n].beginEdit();
                            arr_Record[n].set('ITEM_A_FATURAR', marca_desmarca);
                            arr_Record[n].endEdit();

                            arr_Record[n].commit();
                        }
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }

                function Gera_Nota_Fiscal() {
                    dialog.MensagemDeConfirmacao('Confirma o faturamento do(s) iten(s) marcado(s)?', 'BTN_GERAR_NOTA_FISCAL_PEDIDO2', Fatura);

                    function Fatura(btn) {
                        if (btn == 'yes') {

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Gera_Nota_Fiscal');

                            var _sucess = function(response, options) {
                                var result = Ext.decode(response.responseText).d;

                                var _arr = eval(result + ';');

                                for (var i = 0; i < _arr.length; i++) {
                                    var _index = ITENS_PEDIDO_VENDA1_Store.find('NUMERO_ITEM', _arr[i][0].NUMERO_ITEM);

                                    if (_index > -1) {
                                        var _record = ITENS_PEDIDO_VENDA1_Store.getAt(_index);
                                        _record.beginEdit();

                                        _record.set('COR_STATUS', _arr[i][0].COR_STATUS);
                                        _record.set('COR_FONTE_STATUS', _arr[i][0].COR_FONTE_STATUS);
                                        _record.set('DESCRICAO_STATUS_PEDIDO', _arr[i][0].DESCRICAO_STATUS_PEDIDO);
                                        _record.set('STATUS_ITEM_PEDIDO', _arr[i][0].CODIGO_STATUS_PEDIDO);
                                        _record.set('QTDE_A_FATURAR', _arr[i][0].QTDE_A_FATURAR);
                                        _record.set('QTDE_FATURADA', _arr[i][0].QTDE_FATURADA);
                                        _record.set('NUMEROS_INTERNOS', _arr[i][0].NUMEROS_INTERNOS);
                                        _record.set('NUMEROS_NF', _arr[i][0].NUMEROS_NF);
                                        _record.set('ITEM_A_FATURAR', 0);

                                        _record.endEdit();

                                        _record.commit();
                                    }
                                }
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }

                ////////////////////
                var buttonGroup_PEDIDO = new Ext.ButtonGroup({
                    items: [{
                        text: 'Salvar Posi&ccedil;&atilde;o',
                        icon: 'imagens/icones/database_save_24.gif',
                        scale: 'large',
                        id: 'BTN_NOVA_POSICAO_PEDIDO1',
                        handler: function() {
                            GravaNovaPosicao('BTN_NOVA_POSICAO_PEDIDO1', false, false);
                        }
                    },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                {
                    id: 'BTN_FOLLOW_UP_PEDIDO_VENDA2',
                    text: 'Follow UP',
                    icon: 'imagens/icones/book_fav_24.gif',
                    scale: 'large',
                    handler: function() {
                        if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione um pedido para consultar o follow up');
                        }
                        else {
                            var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                            var _pedido = record.data.NUMERO_PEDIDO;

                            for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.length; i++) {
                                if (Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                                    dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                                    return;
                                }
                            }

                            fu.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                            var items = new Array();

                            for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.length; i++) {
                                items[i] = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                            }

                            fu.ITENS_PEDIDO(items);
                            fu.show('BTN_FOLLOW_UP_PEDIDO_VENDA2');
                        }
                    }
                },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Analisar Pedido',
                id: 'BTN_ANALISE_PEDIDO2',
                icon: 'imagens/icones/system_24.gif',
                scale: 'large',
                handler: function() {
                    if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um pedido para consultar a sua an&aacute;lise');
                    }
                    else {
                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                        wAna.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        wAna.show('BTN_ANALISE_PEDIDO2');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Custos do Item / Servi&ccedil;os',
                icon: 'imagens/icones/calculator_star_24.gif',
                scale: 'large',
                handler: function() {
                    if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length > 0) {

                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                        var lista = new Monta_Custo_Item_Pedido();
                        lista.SETA_NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        lista.SETA_NUMERO_ITEM(record.data.NUMERO_ITEM);
                        lista.SETA_TITULO(record.data.CODIGO_PRODUTO_PEDIDO);
                        lista.SETA_RECORD_ITEM_PEDIDO(record);

                        lista.DesabilitaGrid(record.data.STATUS_ESPECIFICO > 1 ? true : false);

                        lista.show(this);
                    }
                    else {
                        dialog.MensagemDeErro('Selecione um item j&aacute; cadastrado neste or&ccedil;amento para lan&ccedil;ar os seus custos');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_DADOS_FATURA2',
                text: 'Dados de Faturamento',
                icon: 'imagens/icones/date_field_fav_24.gif',
                scale: 'large',
                handler: function() {
                    if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length > 0) {

                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                        dados_fatura1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        dados_fatura1.show('BTN_DADOS_FATURA2');
                    }
                    else {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar / alterar os dados de faturamento');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_GERAR_NOTA_FISCAL_PEDIDO2',
                text: 'Gerar Nota Fiscal',
                icon: 'imagens/icones/mssql_ok_24.gif',
                scale: 'large',
                handler: function() {
                    Gera_Nota_Fiscal();
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_NOTAS_FISCAIS_PEDIDO2',
                text: 'Notas Fiscais',
                icon: 'imagens/icones/preview_write_24.gif',
                scale: 'large',
                handler: function() {
                    if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar as notas fiscais', 'BTN_NOTAS_FISCAIS_PEDIDO2');
                    }
                    else {
                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                        notas.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        notas.ITENS_PEDIDO(record.data.NUMERO_ITEM);

                        notas.show('BTN_NOTAS_FISCAIS_PEDIDO2');
                    }
                }
}]
                });

                var toolbar_TB_PEDIDO2 = new Ext.Toolbar({
                    id: 'toolbar_TB_PEDIDO2',
                    style: 'text-align: right;',
                    items: [buttonGroup_PEDIDO]
                });

                ////////////////////

                TB_STATUS_PEDIDO_USUARIO_CARREGA_COMBO();

                ////////////////
                var CB_STATUS_PEDIDO_USUARIO2 = new Ext.form.ComboBox({
                    id: 'CB_STATUS_PEDIDO_USUARIO2',
                    store: combo_TB_STATUS_PEDIDO_USUARIO,
                    fieldLabel: 'Posi&ccedil;&atilde;o do Pedido',
                    valueField: 'CODIGO_STATUS_PEDIDO',
                    displayField: 'DESCRICAO_STATUS_PEDIDO',
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Selecione aqui...',
                    selectOnFocus: true,
                    width: 240
                });

                function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
                    if (grid_ITENS_PEDIDO_VENDA1.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um pedido para gravar a posi&ccedil;&atilde;o');
                        return;
                    }

                    if (!CANCELAR && !LIBERAR_FATURAR) {
                        if (CB_STATUS_PEDIDO_USUARIO2.getValue() < 1) {
                            dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                            return;
                        }
                    }

                    var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[0];

                    var _pedido = record.data.NUMERO_PEDIDO;

                    for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.length; i++) {

                        if (!CANCELAR && !LIBERAR_FATURAR) {
                            if (CB_STATUS_PEDIDO_USUARIO2.getValue() ==
                                Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                                return;
                            }
                        }

                        if (Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                            dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                            return;
                        }
                    }

                    posicao.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                    var items = new Array();

                    for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.length; i++) {
                        items[i] = Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                    }

                    posicao.ITENS_PEDIDO(items);
                    posicao.REGISTROS(Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getSelectionModel().selections.items);
                    posicao.CANCELAR(CANCELAR);
                    posicao.LIBERAR_FATURAR(LIBERAR_FATURAR);

                    posicao.COMBO_STATUS('CB_STATUS_PEDIDO_USUARIO2');

                    posicao.show(elm);
                }

                ///////////////////

                var panel1 = new Ext.Panel({
                    autoHeight: true,
                    border: false,
                    bodyStyle: 'padding:0px 0px 0',
                    width: '100%',
                    anchor: '100%',
                    title: 'Faturamento de Pedidos de Venda',
                    items: [formPEDIDO, grid_ITENS_PEDIDO_VENDA1, ITENS_PEDIDO_PagingToolbar.PagingToolbar(),
                {
                    layout: 'column',
                    frame: true,
                    border: true,
                    items: [{
                        columnWidth: .32,
                        layout: 'form',
                        labelAlign: 'left',
                        labelWidth: 115,
                        items: [CB_STATUS_PEDIDO_USUARIO2]
}]
                    },
                    toolbar_TB_PEDIDO2]
                });

                if (Ext.isIE)
                    Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').setHeight(AlturaDoPainelDeConteudo(236));
                else
                    Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').setHeight(AlturaDoPainelDeConteudo(235));

                OBTEM_STATUS_LIBERADO_FATURAR();

                return panel1;
            }

            function Altera_Ordem_Placa() {

                /////////////////

                var combo_PLACA1_Store = new Ext.data.Store({
                    reader: new Ext.data.XmlReader({
                        record: 'Tabela'
                    }, ['PLACA', 'CAPACIDADE_CARGA', 'CUSTO_COMBUSTIVEL', 'QTDE_KM_POR_UNIDADE']
       )
                });

                function TB_VEICULO_CARREGA_PLACAS1() {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/LISTA_PLACAS_VEICULOS');
                    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

                    var _sucess = function(response, options) {
                        var result = Ext.decode(response.responseText).d;
                        combo_PLACA1_Store.loadData(criaObjetoXML(result), false);
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }

                TB_VEICULO_CARREGA_PLACAS1();

                ////////////////

                var _NUMERO_PEDIDO;
                var _PLACA;
                var _ORDEM_ENTREGA;

                this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
                    _NUMERO_PEDIDO = pNUMERO_PEDIDO;
                };

                this.PLACA = function(pPLACA) {
                    _PLACA = pPLACA;
                };

                this.ORDEM_ENTREGA = function(pORDEM_ENTREGA) {
                    _ORDEM_ENTREGA = pORDEM_ENTREGA;
                };

                var TXT_ORDEM_ENTREGA = new Ext.form.NumberField({
                    fieldLabel: 'Ordem de Entrega',
                    width: 90,
                    minValue: 0,
                    decimalPrecision: 2,
                    decimalSeparator: ',',
                    allowBlank: false
                });

                var combo_NOVA_PLACA = new Ext.form.ComboBox({
                    store: combo_PLACA1_Store,
                    fieldLabel: 'Ve&iacute;culo',
                    valueField: 'PLACA',
                    displayField: 'PLACA',
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    width: 120,
                    allowBlank: false,
                    emptyText: 'Selecione aqui'
                });

                var BTN_OK = new Ext.Button({
                    text: 'Ok',
                    icon: 'imagens/icones/ok_24.gif',
                    scale: 'large',
                    handler: function() {
                        Altera_Entrega();
                    }
                });

                var formALTERA_ORDEM = new Ext.FormPanel({
                    bodyStyle: 'padding:2px 2px 0',
                    frame: true,
                    labelAlign: 'top',
                    width: '100%',
                    items: [{
                        layout: 'column',
                        items: [{
                            columnWidth: .35,
                            layout: 'form',
                            items: [TXT_ORDEM_ENTREGA]
                        }, {
                            columnWidth: .40,
                            layout: 'form',
                            items: [combo_NOVA_PLACA]
                        }, {
                            columnWidth: .25,
                            items: [BTN_OK]
}]
}]
                        });

                        function Altera_Entrega() {
                            if (!formALTERA_ORDEM.getForm().isValid())
                                return;

                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_ROTEIRO.asmx/Grava_Roteiro');
                            _ajax.setJsonData({
                                PLACA: combo_NOVA_PLACA.getValue(),
                                ORDEM_ENTREGA: TXT_ORDEM_ENTREGA.getValue(),
                                NUMERO_PEDIDO: _NUMERO_PEDIDO,
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function(response, options) {
                                var result = Ext.decode(response.responseText).d;

                                Ext.getCmp('grid_ITENS_PEDIDO_VENDA1').getStore().each(Altera_Store);

                                function Altera_Store(record) {
                                    if (record.data.NUMERO_PEDIDO == _NUMERO_PEDIDO) {

                                        record.beginEdit();

                                        record.set('ORDEM_ENTREGA', TXT_ORDEM_ENTREGA.getValue());
                                        record.set('PLACA', combo_NOVA_PLACA.getValue());

                                        record.endEdit();
                                        record.commit();

                                        wAlteraPlaca.hide();
                                    }
                                }
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }

                        var wAlteraPlaca = new Ext.Window({
                            layout: 'form',
                            title: 'Alterar a ordem ou a placa do ve&iacute;culo de entrega',
                            iconCls: 'icone_TB_FORNECEDOR',
                            width: 420,
                            height: 96,
                            closable: false,
                            draggable: true,
                            minimizable: true,
                            resizable: false,
                            modal: true,
                            renderTo: Ext.getBody(),
                            listeners: {
                                minimize: function(w) {
                                    w.hide();
                                },
                                show: function(w) {
                                    TXT_ORDEM_ENTREGA.reset();
                                    combo_NOVA_PLACA.reset();
                                    TXT_ORDEM_ENTREGA.focus();

                                    combo_NOVA_PLACA.setValue(_PLACA);
                                    TXT_ORDEM_ENTREGA.setValue(_ORDEM_ENTREGA);
                                }
                            },
                            items: [formALTERA_ORDEM]
                        });

                        this.show = function(elm) {
                            wAlteraPlaca.show(elm);
                        };
                    }