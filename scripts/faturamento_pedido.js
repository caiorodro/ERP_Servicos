var _STATUS_LIBERADO_FATURAR;
var _STATUS_FATURADO_PARCIAL;

function OBTEM_STATUS_LIBERADO_FATURAR() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/STATUS_LIBERADO_FATURAR');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });
    _ajax.ExibeDivProcessamento(false);

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        _STATUS_LIBERADO_FATURAR = result[0];
        _STATUS_FATURADO_PARCIAL = result[1];
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Faturamento_Pedido() {

    var dados_fatura = new Dados_Faturamento_Pedido();

    var wAna = new JANELA_ANALISE_PEDIDO();
    var fu = new JANELA_FOLLOW_UP_PEDIDO();
    var posicao = new Nova_Posicao_Pedido();
    var notas = new Janela_Notas_Pedido_Venda();

    var _compras = new JANELA_ITENS_COMPRA();

    var _janela_Local_Material_Expedido = new janela_Local_Material_Expedido();

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function (f, e) {
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
    dt1 = dt1.add(Date.DAY, -30);

    var TXT_ENTREGA_PEDIDO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Entrega',
        width: 94,
        value: dt1,
        listeners: {
            specialkey: function (f, e) {
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
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    var CB_LIBERADOS = new Ext.form.CheckboxGroup({
        columns: 1,
        name: 'LIBERADOS',
        id: 'LIBERADOS',
        items: [
        { boxLabel: 'Listar pedidos liberados p/ faturar', name: 'listar1', checked: false },
        { boxLabel: 'Listar itens marcados p/ faturar', name: 'listar2', checked: false }
        ]
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function () {
            Carrega_ITENS_PEDIDO();
        }
    });

    TB_STATUS_PEDIDO_CARREGA_COMBO();

    ////////////////
    var CB_STATUS_PEDIDO_FILTRO = new Ext.form.ComboBox({
        store: combo_TB_STATUS_PEDIDO,
        fieldLabel: 'Posi&ccedil;&atilde;o do Pedido',
        valueField: 'CODIGO_STATUS_PEDIDO',
        displayField: 'DESCRICAO_STATUS_PEDIDO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 240,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO();
                }
            }
        }
    });

    ///// grid
    var ITENS_PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO',
                'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'MARGEM_VENDA_ITEM_PEDIDO', 'MARGEM_CADASTRADA_PRODUTO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO', 'ALIQ_ICMS_ITEM_PEDIDO',
                'VALOR_ICMS_ITEM_PEDIDO', 'VALOR_ICMS_SUBS_ITEM_PEDIDO', 'ALIQ_IPI_ITEM_PEDIDO', 'VALOR_IPI_ITEM_PEDIDO',
                'CODIGO_CFOP_ITEM_PEDIDO', 'CODIGO_CLIENTE_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
                'NUMERO_PEDIDO_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
                'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
                'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
                'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_SUBS', 'TOTAL_PEDIDO', 'VALOR_FRETE',
                'STATUS_ESPECIFICO', 'QTDE_A_FATURAR', 'ITEM_A_FATURAR', 'QTDE_FATURADA',
                'ATRASADA', 'ITEM_A_COMPRAR', 'NUMERO_PEDIDO_COMPRA', 'STATUS_COMPRA', 'COR_STATUS_PEDIDO_COMPRA', 'COR_FONTE_STATUS_PEDIDO_COMPRA',
                'DESCRICAO_STATUS_PEDIDO_COMPRA', 'CERTIFICADO', 'ITEM_REQUER_CERTIFICADO', 'ITENS_COMPRA_ASSOCIADOS', 'ID_USUARIO_ITEM_A_FATURAR',
                'LOCAL_MATERIAL_EXPEDIDO']
           ),
        listeners: {
            load: function (_store, _records, options) {
                for (var i = 0; i < _records.length; i++) {
                    _records[i].beginEdit();

                    _records[i].set('VALOR_TOTAL', FormataValor(_records[i].data.VALOR_TOTAL));
                    _records[i].set('VALOR_IPI', FormataValor(_records[i].data.VALOR_IPI));
                    _records[i].set('VALOR_ICMS', FormataValor(_records[i].data.VALOR_ICMS));
                    _records[i].set('VALOR_ICMS_SUBS', FormataValor(_records[i].data.VALOR_ICMS_SUBS));
                    _records[i].set('TOTAL_PEDIDO', FormataValor(_records[i].data.TOTAL_PEDIDO));
                    _records[i].set('VALOR_FRETE', FormataValor(_records[i].data.VALOR_FRETE));

                    _records[i].commit();
                    _records[i].endEdit();
                }
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
                    "</table></td></tr></table>"
                    )
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
        Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO').enable();
        Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO1').enable();
        Ext.getCmp('BTN_NOTAS_FISCAIS_PEDIDO1').enable();
        Ext.getCmp('BTN_SALVAR_QTDES_FATURAR').enable();
        Ext.getCmp('BTN_MARCAR_FATURAR').enable();

        for (var i = 0; i < s.selections.items.length; i++) {
            if (s.selections.items[i].data.STATUS_ESPECIFICO != 2 &&
                s.selections.items[i].data.STATUS_ESPECIFICO != 5 &&
                s.selections.items[i].data.STATUS_ITEM_PEDIDO != 19) {
                Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO > 2 && s.selections.items[i].data.STATUS_ESPECIFICO < 5)
                Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO1').disable();

            for (var i = 0; i < ITENS_PEDIDO_VENDA_Store.getCount() - 1; i++) {
                var record = ITENS_PEDIDO_VENDA_Store.getAt(i);

                if (record.dirty) {
                    Ext.getCmp('BTN_MARCAR_FATURAR').disable();
                }
            }
        }

        if (_janela_Local_Material_Expedido.shown()) {
            configuraJanelaLocais();
            _janela_Local_Material_Expedido.carregaGrid();
        }
    }

    var TXT_QTDE_A_FATURAR = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0
    });

    var grid_ITENS_PEDIDO_VENDA = new Ext.grid.EditorGridPanel({
        id: 'grid_ITENS_PEDIDO_VENDA',
        store: ITENS_PEDIDO_VENDA_Store,
        tbar: [{
            id: 'BTN_SALVAR_QTDES_FATURAR',
            icon: 'imagens/icones/binary_field_save_16.gif',
            text: 'Salvar quantidades a faturar',
            scale: 'medium',
            handler: function () {
                GravaQtdesAFaturar();
            }
        }, '-', {
            id: 'BTN_MARCAR_FATURAR',
            icon: 'imagens/icones/ok_16.gif',
            text: 'Marcar item(ns) para faturar',
            scale: 'medium',
            handler: function () {
                Marca_Itens_Faturar(1);
            }
        }, '-', {
            icon: 'imagens/icones/delete_16.gif',
            text: 'Desmarcar item(ns) para faturar',
            scale: 'medium',
            handler: function () {
                Marca_Itens_Faturar(0);
            }
        }, '-', {
            id: 'BTN_LIQUIDAR_SALDO_FATURAMENTO',
            text: 'Liquidar saldo de faturamento',
            icon: 'imagens/icones/mssql_delete_16.gif',
            scale: 'medium',
            handler: function () {
                Liquida_saldo_faturamento();
            }
        }, '-', {
            icon: 'imagens/icones/data_transport_16.gif',
            text: 'Local do material expedido',
            scale: 'medium',
            handler: function (btn) {

                if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione pelos 1 item de pedido para consultar o local em que o material foi expedido', btn.getId());
                    return;
                }

                configuraJanelaLocais();

                _janela_Local_Material_Expedido.show(btn);
            }
        }],
        columns: [
                    IO_expander,
                    checkBoxSM_,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido, locked: true },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'CODIGO_CFOP_ITEM_PEDIDO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_PEDIDO' },
            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Compras },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 78, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'right', renderer: FormataQtde },
            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'right', renderer: ITEM_MARCADO_FATURAR,
                editor: TXT_QTDE_A_FATURAR
            },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'LOCAL_MATERIAL_EXPEDIDO', header: "Local do material expedido", width: 200, sortable: true, dataIndex: 'LOCAL_MATERIAL_EXPEDIDO' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right', hidden: true },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center', hidden: true },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'ITEM_REQUER_CERTIFICADO', header: "Requer Certificado", width: 110, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01, align: 'center' },

            { id: 'ALIQ_ICMS_ITEM_PEDIDO', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', header: "Valor ICMS ST", width: 105, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_PEDIDO', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Ordem de Compra", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center', renderer: Consulta_Ordens_Compra },
            { id: 'STATUS_COMPRA', header: "Status Compra", width: 150, sortable: true, dataIndex: 'STATUS_COMPRA', renderer: Status_Ordem_Compra },
            { id: 'NUMERO_ITEM', header: "item", width: 70, sortable: true, dataIndex: 'NUMERO_ITEM', align: 'center' }

        ],
        stripeRows: true,
        height: 400,
        width: '100%',

        clicksToEdit: 1,

        sm: checkBoxSM_,

        plugins: IO_expander,

        listeners: {
            render: function (comp) {
                if (_SUPERVISOR_FATURAMENTO != 1) {
                    Ext.getCmp('BTN_LIQUIDAR_SALDO_FATURAMENTO').disable();
                }
            },
            beforeedit: function (e) {
                if (e.record.data.STATUS_ITEM_PEDIDO != _STATUS_LIBERADO_FATURAR &&
                        e.record.data.STATUS_ITEM_PEDIDO != _STATUS_FATURADO_PARCIAL) {
                    e.cancel = true;
                }
                else {
                    //TXT_QTDE_A_FATURAR.maxValue = e.record.data.QTDE_PRODUTO_ITEM_PEDIDO - e.record.data.QTDE_FATURADA;
                }
            },
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                var record = grid.getStore().getAt(rowIndex);

                if (fieldName == 'NUMERO_PEDIDO_COMPRA' &&
                                    record.data.ITENS_COMPRA_ASSOCIADOS > 0) {

                    _compras.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    _compras.NUMERO_ITEM(record.data.NUMERO_ITEM);
                    _compras.show(grid.getId());
                }
            }
        }
    });

    function configuraJanelaLocais() {
        var arr_PEDIDO = new Array();
        var arr_ITEM = new Array();

        for (var i = 0; i < grid_ITENS_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_ITENS_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            arr_PEDIDO[i] = record.data.NUMERO_PEDIDO;
            arr_ITEM[i] = record.data.NUMERO_ITEM;
        }

        _janela_Local_Material_Expedido.NUMERO_PEDIDO_VENDA(arr_PEDIDO);
        _janela_Local_Material_Expedido.NUMERO_ITEM_VENDA(arr_ITEM);
    }

    var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_a_Faturar');
    ITENS_PEDIDO_PagingToolbar.setStore(ITENS_PEDIDO_VENDA_Store);
    ITENS_PEDIDO_PagingToolbar.setLinhasPorPagina(25);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

        var cb = Ext.getCmp('LIBERADOS').items.items ?
                Ext.getCmp('LIBERADOS').items.items :
                Ext.getCmp('LIBERADOS').items;

        if (_numero_pedido.length == 0)
            _numero_pedido = 0;

        var _status = CB_STATUS_PEDIDO_FILTRO.getValue() == '' ? 0 : CB_STATUS_PEDIDO_FILTRO.getValue();

        var TB_TRANSP_JsonData = {
            DATA_PEDIDO: TXT_ENTREGA_PEDIDO.getRawValue(),
            NUMERO_PEDIDO: _numero_pedido,
            CLIENTE: TXT_CLIENTE.getValue(),
            A_FATURAR: cb[0].checked ? 1 : 0,
            STATUS_PEDIDO: _status,
            ADMIN_USUARIO: _ADMIN_USUARIO,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            SUPERVISOR_VENDAS: _SUPERVISOR,
            ID_USUARIO: _ID_USUARIO,
            ID_VENDEDOR: _ID_VENDEDOR,
            VENDEDOR: _VENDEDOR,
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
            NUMERO_PEDIDO: _numero_pedido,
            ID_USUARIO: _ID_USUARIO,
            VENDEDOR: _VENDEDOR,
            ID_VENDEDOR: _ID_VENDEDOR,
            start: 0,
            limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO() {
        var liberados = Ext.getCmp('LIBERADOS').items.items[1] ?
                Ext.getCmp('LIBERADOS').items.items[1] :
                Ext.getCmp('LIBERADOS').items[1];

        ITENS_PEDIDO_PagingToolbar.setUrl(liberados.checked ?
                'servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Marcados_a_Faturar' :
                'servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_a_Faturar');

        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Carrega_ITENS_POR_NUMERO_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Por_Numero_Pedido');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData1());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Liquida_saldo_faturamento() {
        dialog.MensagemDeConfirmacao('Confirma a liquida&ccedil;&atilde;o do(s) iten(s)selecionados?', 'BTN_LIQUIDAR_SALDO_FATURAMENTO', Liquida);

        function Liquida(btn) {
            if (btn == 'yes') {

                var arr_PEDIDO = new Array();
                var arr_ITEM = new Array();
                var arr_Record = new Array();

                for (var i = 0; i < grid_ITENS_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                    var record = grid_ITENS_PEDIDO_VENDA.getSelectionModel().selections.items[i];

                    arr_PEDIDO[i] = record.data.NUMERO_PEDIDO;
                    arr_ITEM[i] = record.data.NUMERO_ITEM;
                    arr_Record[i] = record;
                }

                if (arr_PEDIDO.length > 0) {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Liquida_saldo_faturamento');

                    _ajax.setJsonData({
                        NUMERO_PEDIDO: arr_PEDIDO,
                        NUMERO_ITEM: arr_ITEM,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        var result = Ext.decode(response.responseText).d;

                        for (var n = 0; n < arr_Record.length; n++) {

                            arr_Record[n].beginEdit();

                            arr_Record[n].set('ID_STATUS_PEDIDO', result.CODIGO_STATUS_PEDIDO);
                            arr_Record[n].set('DESCRICAO_STATUS_PEDIDO', result.DESCRICAO_STATUS_PEDIDO);
                            arr_Record[n].set('COR_FONTE_STATUS', result.COR_FONTE_STATUS);
                            arr_Record[n].set('COR_STATUS', result.COR_STATUS);
                            arr_Record[n].set('QTDE_A_FATURAR', 0);

                            arr_Record[n].endEdit();

                            arr_Record[n].commit();
                        }
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
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
                items: [TXT_ENTREGA_PEDIDO]
            }, {
                columnWidth: .11,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO]
            }, {
                columnWidth: .22,
                layout: 'form',
                items: [TXT_CLIENTE]
            }, {
                columnWidth: .22,
                layout: 'form',
                items: [CB_STATUS_PEDIDO_FILTRO]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [CB_LIBERADOS]
            }, {
                columnWidth: .13,
                items: [BTN_LISTAR_PEDIDOS]
            }]
        }]
    });

    function GravaQtdesAFaturar() {
        var array1 = new Array();
        var arr_Record = new Array();

        grid_ITENS_PEDIDO_VENDA.getStore().each(Salva_Store);

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
        _ajax.setJsonData({ lista: array1, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
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

        for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
            var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i];

            if (record.data.STATUS_ESPECIFICO == 2 || record.data.STATUS_ESPECIFICO == 5 ||
                            record.data.STATUS_ESPECIFICO == 9) {

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

        _ajax.setJsonData({ itens: array1, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            for (var n = 0; n < arr_Record.length; n++) {

                arr_Record[n].beginEdit();
                arr_Record[n].set('ITEM_A_FATURAR', marca_desmarca);
                arr_Record[n].set('ID_USUARIO_ITEM_A_FATURAR', _ID_USUARIO);
                arr_Record[n].endEdit();

                arr_Record[n].commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Verifica_Marcados() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Gera_Nota_Fiscal');
        _ajax.setJsonData({
            GERAR_CONFIRMADO: 0,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO
        });

        _ajax.ocultaProcessamento(false);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (result == "1") {
                _ajax.objetoModal().hide();
                dialog.MensagemDeConfirmacao('No(s) pedido(s) marcado(s) h&aacute; itens n&atilde;o marcado(s).<br /><br />Deseja continuar?', 'BTN_GERAR_NOTA_FISCAL_PEDIDO', Fatura1);

                function Fatura1(btn) {
                    if (btn == 'yes') {
                        Gera_Nota_Fiscal();
                    }
                }
            }
            else {
                Gera_Nota_Fiscal();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Gera_Nota_Fiscal() {
        Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO').disable();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Gera_Nota_Fiscal');
        _ajax.setJsonData({
            GERAR_CONFIRMADO: 1,
            ID_EMPRESA: _ID_EMPRESA,
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var _arr = eval(result + ';');

            for (var i = 0; i < _arr.length; i++) {
                var _index = ITENS_PEDIDO_VENDA_Store.find('NUMERO_ITEM', _arr[i][0].NUMERO_ITEM);

                if (_index > -1) {
                    var _record = ITENS_PEDIDO_VENDA_Store.getAt(_index);
                    _record.beginEdit();

                    _record.set('COR_STATUS', _arr[i][0].COR_STATUS);
                    _record.set('COR_FONTE_STATUS', _arr[i][0].COR_FONTE_STATUS);
                    _record.set('DESCRICAO_STATUS_PEDIDO', _arr[i][0].DESCRICAO_STATUS_PEDIDO);
                    _record.set('STATUS_ITEM_PEDIDO', _arr[i][0].CODIGO_STATUS_PEDIDO);
                    _record.set('QTDE_A_FATURAR', _arr[i][0].QTDE_A_FATURAR);
                    _record.set('QTDE_FATURADA', _arr[i][0].QTDE_FATURADA);
                    _record.set('ITEM_A_FATURAR', 0);

                    _record.endEdit();

                    _record.commit();

                    grid_ITENS_PEDIDO_VENDA.getSelectionModel().deselectRow(_index);
                }
            }

            Ext.getCmp('BTN_GERAR_NOTA_FISCAL_PEDIDO').enable();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////
    var buttonGroup_PEDIDO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar Posi&ccedil;&atilde;o',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            id: 'BTN_NOVA_POSICAO_PEDIDO1',
            handler: function () {
                GravaNovaPosicao('BTN_NOVA_POSICAO_PEDIDO1', false, false);
            }
        },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                {
                    id: 'BTN_FOLLOW_UP_PEDIDO_VENDA1',
                    text: 'Follow UP',
                    icon: 'imagens/icones/book_fav_24.gif',
                    scale: 'large',
                    handler: function () {
                        if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                            dialog.MensagemDeErro('Selecione um pedido para consultar o follow up');
                        }
                        else {
                            var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                            var _pedido = record.data.NUMERO_PEDIDO;

                            for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
                                if (Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                                    dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                                    return;
                                }
                            }

                            fu.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                            var items = new Array();

                            for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
                                items[i] = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                            }

                            fu.ITENS_PEDIDO(items);
                            fu.show('BTN_FOLLOW_UP_PEDIDO_VENDA1');
                        }
                    }
                },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Analisar Pedido',
                id: 'BTN_ANALISE_PEDIDO1',
                icon: 'imagens/icones/system_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um pedido para consultar a sua an&aacute;lise');
                    }
                    else {
                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                        wAna.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        wAna.show('BTN_ANALISE_PEDIDO1');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Custos do Item /<br />Servi&ccedil;os',
                icon: 'imagens/icones/calculator_star_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length > 0) {

                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

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
            {
                id: 'BTN_DADOS_FATURA',
                text: 'Dados de<br />Faturamento',
                icon: 'imagens/icones/date_field_fav_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length > 0) {

                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                        dados_fatura.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        dados_fatura.show('BTN_DADOS_FATURA');
                    }
                    else {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar / alterar os dados de faturamento');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_GERAR_NOTA_FISCAL_PEDIDO',
                text: 'Gerar Nota Fiscal',
                icon: 'imagens/icones/mssql_ok_24.gif',
                scale: 'large',
                handler: function () {
                    Verifica_Marcados();
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_NOTAS_FISCAIS_PEDIDO1',
                text: 'Notas Fiscais',
                icon: 'imagens/icones/preview_write_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar as notas fiscais', 'BTN_NOTAS_FISCAIS_PEDIDO1');
                    }
                    else {
                        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                        notas.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        notas.ITENS_PEDIDO(record.data.NUMERO_ITEM);

                        notas.show('BTN_NOTAS_FISCAIS_PEDIDO1');
                    }
                }
            }]
    });

    var toolbar_TB_PEDIDO1 = new Ext.Toolbar({
        id: 'toolbar_TB_PEDIDO1',
        style: 'text-align: right;',
        items: [buttonGroup_PEDIDO]
    });

    ////////////////////

    TB_STATUS_PEDIDO_USUARIO_CARREGA_COMBO();

    ////////////////
    var CB_STATUS_PEDIDO_USUARIO1 = new Ext.form.ComboBox({
        id: 'CB_STATUS_PEDIDO_USUARIO1',
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
        if (grid_ITENS_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um pedido para gravar a posi&ccedil;&atilde;o');
            return;
        }

        if (!CANCELAR && !LIBERAR_FATURAR) {
            if (CB_STATUS_PEDIDO_USUARIO1.getValue() < 1) {
                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                return;
            }
        }

        var record = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[0];

        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {

            if (!CANCELAR && !LIBERAR_FATURAR) {
                if (CB_STATUS_PEDIDO_USUARIO1.getValue() ==
                                Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                    dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                    return;
                }
            }

            if (Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                return;
            }
        }

        posicao.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
            items[i] = Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        posicao.ITENS_PEDIDO(items);
        posicao.REGISTROS(Ext.getCmp('grid_ITENS_PEDIDO_VENDA').getSelectionModel().selections.items);
        posicao.CANCELAR(CANCELAR);
        posicao.LIBERAR_FATURAR(LIBERAR_FATURAR);

        posicao.storeGrid(ITENS_PEDIDO_VENDA_Store);

        var _index = CB_STATUS_PEDIDO_USUARIO1.getStore().find('CODIGO_STATUS_PEDIDO', CB_STATUS_PEDIDO_USUARIO1.getValue());

        if (LIBERAR_FATURAR || CANCELAR) {
            posicao.SENHA(0);
        }
        else {
            posicao.SENHA(_index > -1 ?
                            CB_STATUS_PEDIDO_USUARIO1.getStore().getAt(_index).data.SENHA :
                            0);
        }

        posicao.COMBO_STATUS('CB_STATUS_PEDIDO_USUARIO1');

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
        items: [formPEDIDO, grid_ITENS_PEDIDO_VENDA, ITENS_PEDIDO_PagingToolbar.PagingToolbar(),
                {
                    layout: 'column',
                    frame: true,
                    border: true,
                    items: [{
                        columnWidth: .35,
                        layout: 'form',
                        labelAlign: 'left',
                        labelWidth: 115,
                        items: [CB_STATUS_PEDIDO_USUARIO1]
                    }]
                },
                    toolbar_TB_PEDIDO1]
    });

    Ext.getCmp('grid_ITENS_PEDIDO_VENDA').setHeight(AlturaDoPainelDeConteudo(280));

    OBTEM_STATUS_LIBERADO_FATURAR();

    return panel1;
}

///////////////////