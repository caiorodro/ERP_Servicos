
function Monta_Pedido_Venda_Beneficiamento() {

    var fu1 = new JANELA_FOLLOW_UP_PEDIDO();
    var posicao1 = new Nova_Posicao_Pedido();
    var notas1 = new Janela_Notas_Pedido_Venda();

    var lista1 = new Monta_Custo_Item_Pedido();

    var dados_fatura = new Dados_Faturamento_Pedido();

    var _compras = new JANELA_ITENS_COMPRA();

    var _solicitacao_estoque = new Solicitacao_Estoque();

    var _janela_Filtro_Status = new janela_Filtro_Status_Pedido_Venda();

    var _janela_mudanca_fase_pedido = new janela_mudanca_fase_pedido();

    var _Lista_de_Beneficiamento = new Lista_de_Beneficiamento();

    var _janela_Local_Material_Separacao = new janela_Local_Material_Separacao();

    var _janela_itens_pedido_agrupado = new janela_itens_pedido_agrupado();

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
                        Carrega_ITENS_PEDIDO(f);
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
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
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

    var TXT_NUMERO_PEDIDO_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Nr. do Pedido do Cliente',
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

    CARREGA_VENDEDORES_PEDIDO();

    var CB_CODIGO_VENDEDOR = new Ext.form.ComboBox({
        store: PEDIDO_VENDEDOR_Store,
        fieldLabel: 'Vendedor(a)',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 280,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    TB_STATUS_PEDIDO_CARREGA_COMBO();

    var BTN_STATUS_PEDIDO = new Ext.Button({
        text: 'Status de Pedido',
        icon: 'imagens/icones/database_level_24.gif',
        scale: 'large',
        listeners: {
            click: function (button, e) {
                if (!showFiltroStatusVenda)
                    _janela_Filtro_Status.show(Ext.getCmp(button.getId()));
                else
                    _janela_Filtro_Status.hide();
            }
        }
    });

    CARREGA_COMBO_SEPARADOR();

    var CB_SEPARADOR = new Ext.form.ComboBox({
        fieldLabel: 'Separador(a)',
        store: SEPARADOR_STORE,
        valueField: 'ID_SEPARADOR',
        displayField: 'NOME_SEPARADOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            }
        }
    });

    var CB_AGRUPADA = new Ext.form.Checkbox({
        boxLabel: 'Exibir de forma agrupada'
    });

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function (btn) {
            Carrega_ITENS_PEDIDO(btn);
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
                columnWidth: .18,
                layout: 'form',
                items: [TXT_DATA_PEDIDO]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO]
            }, {
                columnWidth: .27,
                layout: 'form',
                items: [TXT_CLIENTE]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [CB_SEPARADOR]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [CB_AGRUPADA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO_CLIENTE]
            }, {
                columnWidth: .27,
                layout: 'form',
                items: [CB_CODIGO_VENDEDOR]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [BTN_STATUS_PEDIDO]
            }, {
                columnWidth: .12,
                items: [BTN_LISTAR_PEDIDOS]
            }]
        }]
    });

    ///// grid
    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM',
        'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO',
        'CODIGO_CLIENTE_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO', 'ID_PRODUTO_PEDIDO',
        'NUMERO_PEDIDO_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
        'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
        'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
        'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_SUBS', 'TOTAL_PEDIDO', 'VALOR_FRETE', 'MARGEM',
        'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA', 'ITEM_A_COMPRAR',
        'NUMERO_PEDIDO_COMPRA', 'QTDE_A_FATURAR', 'ITEM_A_BENEFICIAR', 'CERTIFICADO', 'ITEM_REQUER_CERTIFICADO',
        'ITENS_COMPRA_ASSOCIADOS', 'REGISTRO_BENEFICIAMENTO', 'OBS_CUSTO_VENDEDOR', 'FORNECEDOR', 'LOCAL_MATERIAL_SOLICITADO',
        'LOCAL_MATERIAL_BENEFICIAMENTO', 'LOCAL_MATERIAL_EXPEDIDO', 'SEPARADOR_TEMPORARIO', 'MARGEM_MEDIA'])
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
        Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO_2').enable();
        Ext.getCmp('BTN_IMPRIMIR_PEDIDO_SEPARACAO').enable();
        Ext.getCmp('BTN_NOTAS_FISCAIS_PEDIDO_2').enable();
        Ext.getCmp('BTN_LIBERAR_FATURAR_2').enable();
        Ext.getCmp('BTN_RNC').enable();
        Ext.getCmp('BTN_SOLICITAR_ESTOQUE').enable();
        CB_STATUS_PEDIDO_USUARIO2.enable();

        for (var i = 0; i < s.selections.items.length; i++) {
            if (s.selections.items[i].data.STATUS_ESPECIFICO == 1) {
                Ext.getCmp('BTN_RNC').disable();
                Ext.getCmp('BTN_SOLICITAR_ESTOQUE').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO == 3) {
                Ext.getCmp('BTN_LIBERAR_FATURAR_2').disable();
                Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO_2').disable();
                Ext.getCmp('BTN_SOLICITAR_ESTOQUE').disable();
            }

            if (s.selections.items[i].data.STATUS_ESPECIFICO == 4) {
                Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO_2').disable();
                Ext.getCmp('BTN_IMPRIMIR_PEDIDO_SEPARACAO').disable();
                Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO_2').disable();
                Ext.getCmp('BTN_SOLICITAR_ESTOQUE').disable();
                Ext.getCmp('BTN_LIBERAR_FATURAR_2').disable();
                CB_STATUS_PEDIDO_USUARIO2.disable();
            }
        }

        if (_janela_Local_Material_Separacao.shown()) {
            configuraJanelaLocais();
            _janela_Local_Material_Separacao.carregaGrid();
        }
    }

    var TXT_QTDE_COMPRAR = new Ext.form.NumberField({
        minValue: 0.001,
        decimalPrecision: 3,
        decimalSeparator: ','
    });

    var TXT_QTDE_A_FATURAR = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0
    });

    function GravaQtdesAFaturar() {
        var array1 = new Array();
        var arr_Record = new Array();

        grid_PEDIDO_VENDA_BENEFICIAMENTO.getStore().each(Salva_Store);

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

    function Gera_Beneficiamento_a_partir_do_Pedido() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Gera_Beneficiamento_a_partir_do_Pedido');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {

            for (var i = 0; i < PEDIDO_VENDA_Store.getCount(); i++) {
                var record = PEDIDO_VENDA_Store.getAt(i);

                if (record.data.ITEM_A_BENEFICIAR == 1) {
                    record.beginEdit();
                    record.set('ITEM_A_BENEFICIAR', 0);
                    record.set('REGISTRO_BENEFICIAMENTO', 1);
                    record.endEdit();
                    record.commit();
                }
            }

            dialog.MensagemDeInformacao('Beneficiamento Gerado com sucesso');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var grid_PEDIDO_VENDA_BENEFICIAMENTO = new Ext.grid.EditorGridPanel({
        id: 'grid_PEDIDO_VENDA_BENEFICIAMENTO',
        store: PEDIDO_VENDA_Store,

        tbar: [{
            icon: 'imagens/icones/binary_field_save_16.gif',
            text: 'Salvar quantidades<br />a faturar',
            scale: 'large',
            handler: function () {
                GravaQtdesAFaturar();
            }
        }, '-', {
            id: 'BTN_RNC',
            icon: 'imagens/icones/sql_query_delete_16.gif',
            text: 'Registro de RNC',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para abrir uma RNC', 'BTN_RNC');
                    return;
                }

                var tabs = Ext.getCmp('tabConteudo');

                for (var i = 0; i < tabs.items.length; i++) {
                    if (tabs.items.items[i].title == "Registro de RNC") {

                        var tab = tabs.items.items[i];

                        tabs.remove(tab, true);
                    }
                }

                var record = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[0];

                var tela1 = MontaOcorrenciaRNC(record.data.NUMERO_PEDIDO,
                                    record.data.NUMERO_ITEM, 0, 0, record.data.CODIGO_PRODUTO_PEDIDO, '', 0);

                CriaEConfiguraNovaTab("Registro de RNC", true, tela1);
            }
        }, '-', {
            id: 'BTN_SOLICITAR_ESTOQUE',
            icon: 'imagens/icones/data_transport_config_16.gif',
            text: 'Solicitar Estoque',
            scale: 'large',
            handler: function () {

                var record = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[0];

                _solicitacao_estoque.NUMERO_PEDIDO_VENDA(grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length == 0 ?
                    0 : record.data.NUMERO_PEDIDO);

                _solicitacao_estoque.show();
            }
        }, '-', {
            icon: 'imagens/icones/entity_relation_write_16.gif',
            text: 'Mudan&ccedil;a de fases',
            scale: 'large',
            handler: function (btn) {
                if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para consultar sobre as mudan&ccedil;as de fases', btn.getId());
                    return;
                }

                var record = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[0];

                _janela_mudanca_fase_pedido.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                _janela_mudanca_fase_pedido.show(btn);
            }
        }, '-', {
            icon: 'imagens/icones/file_16.gif',
            text: 'Lista de beneficiamento por<br />fornecedor',
            scale: 'large',
            handler: function (btn) {
                _Lista_de_Beneficiamento.show(btn);
            }
        }, '-', {
            icon: 'imagens/icones/data_transport_16.gif',
            text: 'Definir local do<br />material solicitado',
            scale: 'large',
            handler: function (btn) {

                if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione pelos 1 item de pedido para definir / consultar o local pr&eacute;-separa&ccedil;&atilde;o', btn.getId());
                    return;
                }

                configuraJanelaLocais();

                _janela_Local_Material_Separacao.show(btn);
            }
        }],
        columns: [
                    checkBoxSM_,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'SEPARADOR_TEMPORARIO', header: "Separador atual", width: 110, sortable: true, dataIndex: 'SEPARADOR_TEMPORARIO' },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'TOTAL_PEDIDO', header: "Total do pedido", width: 110, sortable: true, dataIndex: 'TOTAL_PEDIDO', renderer: FormataValor, align: 'right',
                hidden: _GERENTE_COMERCIAL == 1 || _VENDEDOR == 1 ? false : true
            },

            { id: 'MARGEM_MEDIA', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_MEDIA', renderer: FormataPercentual, align: 'center',
                hidden: _GERENTE_COMERCIAL == 1 || _VENDEDOR == 1 ? false : true
            },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Beneficiamento },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },

            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde,
                editor: TXT_QTDE_A_FATURAR
            },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },

            { id: 'LOCAL_MATERIAL_SOLICITADO', header: "Local do material solicitado ao estoque", width: 200, sortable: true, dataIndex: 'LOCAL_MATERIAL_SOLICITADO' },
            { id: 'LOCAL_MATERIAL_BENEFICIAMENTO', header: "Local do material beneficiado", width: 200, sortable: true, dataIndex: 'LOCAL_MATERIAL_BENEFICIAMENTO' },
            { id: 'LOCAL_MATERIAL_EXPEDIDO', header: "Local do material expedido", width: 200, sortable: true, dataIndex: 'LOCAL_MATERIAL_EXPEDIDO' },

            { id: 'OBS_CUSTO_VENDEDOR', header: "Obs. Custo Vendedor(a)", width: 130, sortable: true, dataIndex: 'OBS_CUSTO_VENDEDOR' },
            { id: 'FORNECEDOR', header: "Fornecedor", width: 130, sortable: true, dataIndex: 'FORNECEDOR' },

            { id: 'ITEM_REQUER_CERTIFICADO', header: "Requer Certificado", width: 110, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01, align: 'center' },
            { id: 'ITEM_A_COMPRAR', header: "Qtde. a Comprar", width: 120, sortable: true, dataIndex: 'ITEM_A_COMPRAR', renderer: FormataQtde,
                align: 'center', editor: TXT_QTDE_COMPRAR
            },

            { id: 'NUMERO_PEDIDO_COMPRA', header: "Ordem de Compra", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center', renderer: Consulta_Ordens_Compra },

            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 120, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' },
            { id: 'NUMERO_PEDIDO_ITEM_PEDIDO', header: "Nr. Pedido Cliente", width: 140, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_PEDIDO' },
            { id: 'CODIGO_CLIENTE_ITEM_PEDIDO', header: "C&oacute;d. Produto Cliente", width: 140, sortable: true, dataIndex: 'CODIGO_CLIENTE_ITEM_PEDIDO' }

        ],
        stripeRows: true,
        height: 400,
        width: '100%',

        sm: checkBoxSM_,

        clicksToEdit: 1,

        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                var record = grid.getStore().getAt(rowIndex);

                if (fieldName == 'NUMERO_PEDIDO_COMPRA' &&
                                    (record.data.ITENS_COMPRA_ASSOCIADOS > 0 || record.data.NUMERO_PEDIDO_COMPRA > 0)) {

                    _compras.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    _compras.NUMERO_ITEM(record.data.NUMERO_ITEM);
                    _compras.show(grid.getId());
                }

                if (fieldName == 'STATUS_ITEM_PEDIDO') {
                    if (CB_AGRUPADA.checked) {
                        _janela_itens_pedido_agrupado.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        _janela_itens_pedido_agrupado.show(Ext.getCmp('BTN_SOLICITAR_ESTOQUE'));
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                Abre_FollowUp(record);
            }
        }
    });

    function configuraJanelaLocais() {
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[i];

            arr1[i] = record.data.NUMERO_PEDIDO;
            arr2[i] = record.data.NUMERO_ITEM;
            arr3[i] = record.data.CODIGO_PRODUTO_PEDIDO;
        }

        _janela_Local_Material_Separacao.NUMERO_PEDIDOS_VENDA(arr1);
        _janela_Local_Material_Separacao.NUMERO_ITENS_VENDA(arr2);
        _janela_Local_Material_Separacao.CODIGO_PRODUTO(arr3);
    }

    var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_PEDIDO_PagingToolbar.setStore(PEDIDO_VENDA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

        if (_numero_pedido.length == 0)
            _numero_pedido = 0;

        var _codigo_vendedor = CB_CODIGO_VENDEDOR.getValue();

        if (_codigo_vendedor == '')
            _codigo_vendedor = 0;

        var TB_TRANSP_JsonData = {
            DATA_PEDIDO: TXT_DATA_PEDIDO.getRawValue(),
            NUMERO_PEDIDO: _numero_pedido,
            CLIENTE: TXT_CLIENTE.getValue(),
            CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            NUMERO_PEDIDO_ITEM_PEDIDO: TXT_NUMERO_PEDIDO_CLIENTE.getValue(),
            CODIGO_VENDEDOR: _codigo_vendedor,
            STATUS: _janela_Filtro_Status.statusSelecionados(),
            ID_SEPARADOR: CB_SEPARADOR.getValue() == '' ? 0 : CB_SEPARADOR.getValue(),
            EXIBIR_AGRUPADA: CB_AGRUPADA.checked ? 1 : 0,
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
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_PEDIDO(btn) {
        if (_janela_Filtro_Status.statusSelecionados().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos um status de pedido no botão [status de pedido] para listar os itens', btn.getId());
            return;
        }

        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido_Beneficiamento');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Carrega_ITENS_POR_NUMERO_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Por_Numero_Pedido');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData1());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

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

    /////////////////Botões

    function Abre_FollowUp(record) {
        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length; i++) {
            if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                return;
            }
        }

        fu1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.length; i++) {
            items[i] = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        fu1.ITENS_PEDIDO(items);

        fu1.show('BTN_FOLLOW_UP_PEDIDO_VENDA_2');
    }

    var buttonGroup_PEDIDO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar Posi&ccedil;&atilde;o',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            id: 'BTN_NOVA_POSICAO_PEDIDO_2',
            handler: function () {
                GravaNovaPosicao('BTN_NOVA_POSICAO_PEDIDO_2', false, false);
            }
        },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                        {
                            id: 'BTN_FOLLOW_UP_PEDIDO_VENDA_2',
                            text: 'Follow UP',
                            icon: 'imagens/icones/book_fav_24.gif',
                            scale: 'large',
                            handler: function () {
                                if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length == 0) {
                                    dialog.MensagemDeErro('Selecione um pedido para consultar o follow up');
                                }
                                else {
                                    var record = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[0];

                                    Abre_FollowUp(record);
                                }
                            }
                        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_IMPRIMIR_PEDIDO_SEPARACAO',
                text: 'Imprimir Pedido',
                icon: 'imagens/icones/printer_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um pedido para imprimir');
                    }
                    else {
                        var record = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[0];

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Imprime_Pedido_Separacao');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                            LOGIN_USUARIO: _LOGIN_USUARIO,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;
                            window.open(result, '_blank', 'width=1000,height=800');

                            ITENS_PEDIDO_PagingToolbar.CarregaPaginaAtual();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_CUSTO_ITEM_PEDIDO_2',
                text: 'Custos do Item /<br />Servi&ccedil;os',
                icon: 'imagens/icones/calculator_star_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length > 0) {

                        var record = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[0];

                        lista1.SETA_NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        lista1.SETA_NUMERO_ITEM(record.data.NUMERO_ITEM);
                        lista1.SETA_TITULO(record.data.CODIGO_PRODUTO_PEDIDO);
                        lista1.SETA_RECORD_ITEM_PEDIDO(record);

                        lista1.DesabilitaGrid(record.data.STATUS_ESPECIFICO > 1 ? true : false);

                        lista1.show('BTN_CUSTO_ITEM_PEDIDO_2');
                    }
                    else {
                        dialog.MensagemDeErro('Selecione um item j&aacute; cadastrado neste or&ccedil;amento para lan&ccedil;ar os seus custos');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_DADOS_FATURAMENTO_2',
                text: 'Dados de Faturamento',
                icon: 'imagens/icones/date_field_fav_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length > 0) {

                        var record = grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().selections.items[0];

                        dados_fatura.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        dados_fatura.show('BTN_DADOS_FATURAMENTO_2');
                    }
                    else {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar / alterar os dados de faturamento', 'BTN_DADOS_FATURAMENTO_2');
                    }
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_LIBERAR_FATURAR_2',
                text: 'Liberar p/ Faturar',
                icon: 'imagens/icones/mssql_next_24.gif',
                scale: 'large',
                handler: function () {
                    GravaNovaPosicao('BTN_LIBERAR_FATURAR_2', false, true);
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_NOTAS_FISCAIS_PEDIDO_2',
                text: 'Notas Fiscais',
                icon: 'imagens/icones/preview_write_24.gif',
                scale: 'large',
                handler: function () {
                    if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length == 0) {
                        dialog.MensagemDeErro('Selecione um item de pedido para consultar as notas fiscais', 'BTN_NOTAS_FISCAIS_PEDIDO_2');
                    }
                    else {
                        var record = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[0];

                        notas1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                        notas1.ITENS_PEDIDO(record.data.NUMERO_ITEM);

                        notas1.show('BTN_NOTAS_FISCAIS_PEDIDO_2');
                    }
                }
            }]
    });

    var toolbar_TB_PEDIDO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_PEDIDO]
    });

    function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
        if (grid_PEDIDO_VENDA_BENEFICIAMENTO.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um pedido para gravar a posi&ccedil;&atilde;o');
            return;
        }

        if (!CANCELAR && !LIBERAR_FATURAR) {
            if (CB_STATUS_PEDIDO_USUARIO2.getValue() < 1) {
                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                return;
            }
        }

        var record = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[0];

        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.length; i++) {

            if (!CANCELAR && !LIBERAR_FATURAR) {
                if (CB_STATUS_PEDIDO_USUARIO2.getValue() ==
                                Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                    dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                    return;
                }
            }

            if (Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                return;
            }
        }

        posicao1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.length; i++) {
            items[i] = Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        posicao1.ITENS_PEDIDO(items);
        posicao1.REGISTROS(Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').getSelectionModel().selections.items);
        posicao1.CANCELAR(CANCELAR);
        posicao1.LIBERAR_FATURAR(LIBERAR_FATURAR);

        posicao1.storeGrid(PEDIDO_VENDA_Store);

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
        anchor: '100%',
        items: [formPEDIDO, grid_PEDIDO_VENDA_BENEFICIAMENTO, ITENS_PEDIDO_PagingToolbar.PagingToolbar(),
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
                    }, toolbar_TB_PEDIDO]
    });

    Ext.getCmp('grid_PEDIDO_VENDA_BENEFICIAMENTO').setHeight(AlturaDoPainelDeConteudo(257));

    /////////////////////

    return panel1;
}

function Lista_de_Beneficiamento() {

    var TXT_DATAF1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAF2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var fdt1 = new Date();

    TXT_DATAF1.setValue(fdt1);
    TXT_DATAF2.setValue(fdt1);

    var TB_FORNECEDOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'

        }, ['ID_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR']),

        sortInfo: {
            field: 'NOME_FANTASIA_FORNECEDOR',
            direction: 'ASC'
        }
    });

    function Carrega_Fornecedores() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Lista_Fornecedores_Beneficiamento');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            TB_FORNECEDOR_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    Carrega_Fornecedores();

    var CB_FORNECEDORES = new Ext.form.ComboBox({
        fieldLabel: 'Fornecedor',
        valueField: 'ID_FORNECEDOR',
        displayField: 'NOME_FANTASIA_FORNECEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 230,
        store: TB_FORNECEDOR_Store,
        allowBlank: false
    });

    var BTN_OK = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Lista_Relatorio();
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
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_DATAF1]
            }, {
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_DATAF2]
            }, {
                columnWidth: 0.45,
                layout: 'form',
                items: [CB_FORNECEDORES]
            }, {
                columnWidth: .15,
                items: [BTN_OK]
            }]
        }]
    });

    function Lista_Relatorio() {
        if (!form1.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/Lista_Beneficiamento_do_Fornecedor');
        _ajax.setJsonData({
            data1: TXT_DATAF1.getRawValue(),
            data2: TXT_DATAF2.getRawValue(),
            CODIGO_FORNECEDOR: CB_FORNECEDORES.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            wLista1.hide();

            var result = Ext.decode(response.responseText).d;
            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wLista1 = new Ext.Window({
        layout: 'form',
        title: 'Listagem de itens de beneficiamento por fornecedor',
        iconCls: 'icone_TB_NOTA_SAIDA',
        width: 600,
        height: 95,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: false,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [form1]
    });

    this.show = function (elm) {
        wLista1.show(elm);

        wLista1.setPosition(elm.getPosition()[0] - 80, elm.getPosition()[1] + elm.getHeight());
        wLista1.toFront();
        wLista1.show(elm.getId());
    };
}

function janela_itens_pedido_agrupado() {
    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function (pValue) {
        _NUMERO_PEDIDO = pValue;
    };

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM',
        'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO',
        'CODIGO_CLIENTE_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO', 'ID_PRODUTO_PEDIDO',
        'NUMERO_PEDIDO_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
        'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
        'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
        'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_SUBS', 'TOTAL_PEDIDO', 'VALOR_FRETE', 'MARGEM',
        'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA', 'ITEM_A_COMPRAR',
        'NUMERO_PEDIDO_COMPRA', 'QTDE_A_FATURAR', 'ITEM_A_BENEFICIAR', 'CERTIFICADO', 'ITEM_REQUER_CERTIFICADO',
        'ITENS_COMPRA_ASSOCIADOS', 'REGISTRO_BENEFICIAMENTO', 'OBS_CUSTO_VENDEDOR', 'FORNECEDOR', 'LOCAL_MATERIAL_SOLICITADO',
        'LOCAL_MATERIAL_BENEFICIAMENTO', 'LOCAL_MATERIAL_EXPEDIDO', 'SEPARADOR_TEMPORARIO'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: PEDIDO_VENDA_Store,

        columns: [
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'SEPARADOR_TEMPORARIO', header: "Separador atual", width: 110, sortable: true, dataIndex: 'SEPARADOR_TEMPORARIO' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Beneficiamento },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },

            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },
            
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 120, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' },
            { id: 'NUMERO_PEDIDO_ITEM_PEDIDO', header: "Nr. Pedido Cliente", width: 140, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_PEDIDO' },
            { id: 'CODIGO_CLIENTE_ITEM_PEDIDO', header: "C&oacute;d. Produto Cliente", width: 140, sortable: true, dataIndex: 'CODIGO_CLIENTE_ITEM_PEDIDO' }
        ],
        stripeRows: true,
        height: 280,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function carrega_Grid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido_Agrupado');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            PEDIDO_VENDA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();

        // 
    }

    var wJanela1 = new Ext.Window({
        layout: 'form',
        title: 'Itens do pedido',
        width: 710,
        iconCls: 'icone_TB_NOTA_SAIDA',
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [grid1]
    });

    this.show = function (elm) {
        wJanela1.setPosition(elm.getPosition()[0] + 100, elm.getPosition()[1] + elm.getHeight());
        wJanela1.toFront();
        wJanela1.show(elm.getId());

        carrega_Grid();
    };

    this.carregaGrid = function () {
        carrega_Grid();
    };
}