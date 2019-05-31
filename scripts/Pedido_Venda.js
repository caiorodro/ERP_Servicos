var PEDIDO_VENDEDOR_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_VENDEDOR', 'NOME_VENDEDOR']
       ),

    listeners: {
        load: function (st, records, options) {
            if (_VENDEDOR == 1 && _SUPERVISOR == 0 && _GERENTE_COMERCIAL == 0) {
                if (Ext.getCmp('_CB_VENDEDOR_PEDIDO_VENDA')) {
                    Ext.getCmp('_CB_VENDEDOR_PEDIDO_VENDA').setValue(_ID_VENDEDOR);
                }
            }
        }
    }
});

function CARREGA_VENDEDORES_PEDIDO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/CarregaVendedores');
    _ajax.setJsonData({
        GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
        ID_VENDEDOR: _ID_VENDEDOR,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        PEDIDO_VENDEDOR_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

////////////////////////

var combo_TB_STATUS_PEDIDO_USUARIO = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'SENHA']
       ),
    sortInfo: {
        field: 'DESCRICAO_STATUS_PEDIDO',
        direction: 'ASC'
    }
});

function TB_STATUS_PEDIDO_USUARIO_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Carrega_Status');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_STATUS_PEDIDO_USUARIO.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Monta_Pedido_Venda() {

    var _busca_de_Produto = new Busca_de_Produtos();

    var dados_fatura = new Dados_Faturamento_Pedido();

    var wAna = new JANELA_ANALISE_PEDIDO();
    var fu = new JANELA_FOLLOW_UP_PEDIDO();
    var notas = new Janela_Notas_Pedido_Venda();

    var ben = new BUSCA_BENEFICIAMENTO();

    var _compras = new JANELA_ITENS_COMPRA();

    var _janela_Filtro_Status = new janela_Filtro_Status_Pedido_Venda();
    var posicao = new Nova_Posicao_Pedido();
    var _janela_mudanca_fase_pedido = new janela_mudanca_fase_pedido();

    var _janela_Servico_Ciclista = new janela_Servico_Ciclista();

    var GERENTE_COMERCIAL;

    var lista = new Monta_Custo_Item_Pedido();

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Servi&ccedil;o',
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
        fieldLabel: 'C&oacute;digo do Servi&ccedil;o (F8)',
        width: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        enableKeyEvents: true,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_ITENS_PEDIDO(f);
                }
            },
            keydown: function (f, e) {
                if (e.getKey() == e.F8) {
                    _busca_de_Produto.acaoPopular(function (record) {
                        TXT_CODIGO_PRODUTO.setValue(record.data.CODIGO_PRODUTO);
                    });
                    _busca_de_Produto.show(TXT_CODIGO_PRODUTO.getId());
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

    var CB_CODIGO_VENDEDOR = new Ext.form.ComboBox({
        store: PEDIDO_VENDEDOR_Store,
        id: '_CB_VENDEDOR_PEDIDO_VENDA',
        name: '_CB_VENDEDOR_PEDIDO_VENDA',
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

    var BTN_LISTAR_PEDIDOS = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function (btn) {
            Carrega_ITENS_PEDIDO(btn);
        }
    });

    var BTN_STATUS_PEDIDO = new Ext.Button({
        text: 'Status de Servi&ccedil;o',
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

    TB_STATUS_PEDIDO_CARREGA_COMBO();

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
                columnWidth: .14,
                layout: 'form',
                items: [TXT_NUMERO_NF]
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
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO',
            'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'PRECO_ITEM_PEDIDO', 'VALOR_TOTAL_ITEM_PEDIDO', 'ALIQ_ISS_ITEM_PEDIDO',
            'VALOR_ISS_ITEM_PEDIDO', 'DESCRICAO_PRODUTO', 'NUMERO_PEDIDO_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO',
            'CONTATO_ORCAMENTO', 'TELEFONE_CONTATO', 'DESCRICAO_CP', 'NOME_VENDEDOR', 'NOME_FANTASIA_TRANSP',
            'OBS_ORCAMENTO', 'EMAIL_CONTATO', 'CUSTO_TOTAL_ITEM_PEDIDO', 'FRETE_POR_CONTA',
            'VALOR_TOTAL', 'VALOR_ISS', 'TOTAL_PEDIDO', 'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA',
            'QTDE_A_FATURAR', 'FOLLOW_UP_PEDIDO', 'FOLLOW_UP_ITEM_PEDIDO', 'DATA_FATURAMENTO', 'CICLISTA',
            'CEP_INICIAL_ITEM_ORCAMENTO', 'ENDERECO_INICIAL_ITEM_ORCAMENTO', 'NUMERO_INICIAL_ITEM_ORCAMENTO',
            'COMPL_INICIAL_ITEM_ORCAMENTO', 'CIDADE_INICIAL_ITEM_ORCAMENTO',
            'ESTADO_INICIAL_ITEM_ORCAMENTO', 'CEP_FINAL_ITEM_ORCAMENTO', 'ENDERECO_FINAL_ITEM_ORCAMENTO',
            'NUMERO_FINAL_ITEM_ORCAMENTO', 'COMPL_FINAL_ITEM_ORCAMENTO', 'OBS_ITEM_ORCAMENTO',
            'CIDADE_FINAL_ITEM_ORCAMENTO', 'ESTADO_FINAL_ITEM_ORCAMENTO', 'ID_USUARIO_ITEM_A_FATURAR', 'ITEM_A_FATURAR'
            ]),

        listeners: {
            load: function (_store, _records, options) {
                for (var i = 0; i < _records.length; i++) {
                    _records[i].beginEdit();

                    _records[i].set('VALOR_TOTAL', FormataValor(_records[i].data.VALOR_TOTAL));
                    _records[i].set('VALOR_ISS', FormataValor(_records[i].data.VALOR_ISS));

                    _records[i].commit();
                    _records[i].endEdit();
                }

                for (var i = 0; i < _records.length; i++) {
                    IO_expander.expandRow(i);
                }
            }
        }
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<table><tr><td style='width: 380px;'>" +
                    "<table>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Servi&ccedil;o</b>:</td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_PRODUTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Vendedor(a):</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {NOME_VENDEDOR}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Cond. Pagto:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {DESCRICAO_CP}</td></tr>" +

                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Contato:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {CONTATO_ORCAMENTO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Telefone:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {TELEFONE_CONTATO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>e-mail:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {EMAIL_CONTATO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs.:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_ITEM_PEDIDO}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Obs. Or&ccedil;amento:</b></td><td style='font-family: Tahoma; font-size: 8pt;'> {OBS_ITEM_ORCAMENTO}</td></tr></table>" +
                    "</td><td style='width: 220px;'>" +
                    "<table>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total dos Servi&ccedil;os</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_TOTAL}</td></tr>" +
                    "<tr><td style='font-family: Tahoma; font-size: 8pt;'><b>Total de ISS</b>:</td><td style='text-align: right;font-family: Tahoma; font-size: 8pt;'> {VALOR_ISS}</td></tr>" +
                    "</table></td>" +

                    "<td><table style='border-width: 1px; border-style: solid;'><tr><td><b>Origem</b><br />" +
                    "<b>Endere&ccedil;o:</b> {ENDERECO_INICIAL_ITEM_ORCAMENTO} {NUMERO_INICIAL_ITEM_ORCAMENTO} {COMPL_INICIAL_ITEM_ORCAMENTO}<br />" +
                    "CEP: {CEP_INICIAL_ITEM_ORCAMENTO} - <b>Cidade:</b> {CIDADE_INICIAL_ITEM_ORCAMENTO} - <b>Estado:</b> {ESTADO_INICIAL_ITEM_ORCAMENTO}</td>" +
                    "<td><td><b>Destino</b><br />" +
                    "<b>Endere&ccedil;o:</b> {ENDERECO_FINAL_ITEM_ORCAMENTO} {NUMERO_FINAL_ITEM_ORCAMENTO} {COMPL_FINAL_ITEM_ORCAMENTO}<br />" +
                    "<b>CEP:</b> {CEP_FINAL_ITEM_ORCAMENTO} - <b>Cidade:</b> {CIDADE_FINAL_ITEM_ORCAMENTO} - <b>Estado:</b> {ESTADO_FINAL_ITEM_ORCAMENTO}</td>" +
                    "</tr></table></td>" +

                    "</td></tr></table>"
                    )
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Habilita_Botoes(s);

                if (_janela_Servico_Ciclista.shown()) {
                    _janela_Servico_Ciclista.getRecord()[_janela_Servico_Ciclista.getRecord().length] = record;
                }
            },
            rowdeselect: function (s, Index, record) {
                Habilita_Botoes(s);

                if (_janela_Servico_Ciclista.shown()) {

                    var index;

                    for (var i = 0; i < _janela_Servico_Ciclista.getRecord().length; i++) {
                        if (record == _janela_Servico_Ciclista.getRecord()[i]) {
                            index = _janela_Servico_Ciclista.getRecord().indexOf(record);
                        }
                    }

                    _janela_Servico_Ciclista.getRecord().splice(index, 1);
                }
            }
        }
    });

    function Habilita_Botoes(s) {
        if (_VENDEDOR == 0) {
            Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').enable();
            Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO').enable();
            Ext.getCmp('BTN_SALVAR_DATAS_ENTREGAS').enable();
            CB_STATUS_PEDIDO_USUARIO.enable();

            for (var i = 0; i < s.selections.items.length; i++) {
                if (s.selections.items[i].data.STATUS_ESPECIFICO == 1) { // Pedido em analise
                    Ext.getCmp('BTN_SALVAR_DATAS_ENTREGAS').disable();
                }

                if (s.selections.items[i].data.STATUS_ESPECIFICO == 2) { // Parcialmente Faturado
                    Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').disable();
                    Ext.getCmp('BTN_SALVAR_DATAS_ENTREGAS').disable();
                }

                if (s.selections.items[i].data.STATUS_ESPECIFICO == 3) { // Totalmente faturado
                    Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').disable();
                    Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO').disable();
                }

                if (s.selections.items[i].data.STATUS_ESPECIFICO == 4) { // Pedido cancelado
                    Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').disable();
                    Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO').disable();
                    CB_STATUS_PEDIDO_USUARIO.disable();
                }

                if (s.selections.items[i].data.STATUS_ESPECIFICO == 5) { // Liberado p/ faturar
                    Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').disable();
                }
            }
        }
    }

    var TXT_ENTREGA1 = new Ext.form.DateField({
        width: 90,
        allowBlank: false
    });

    var TXT_QTDE_COMPRAR = new Ext.form.NumberField({
        minValue: 0.000,
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

        grid_PEDIDO_VENDA.getStore().each(Salva_Store);

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

    var TXT_NOVO_PRECO = new Ext.form.NumberField({
        minValue: 0.0000,
        decimalPrecision: 4,
        decimalSeparator: ','
    });

    var TXT_NOVA_QTDE_FATURAR = new Ext.form.NumberField({
        minValue: 0.00,
        decimalPrecision: 2,
        decimalSeparator: ','
    });

    var _alteraDataEntrega = new Altera_Data_Entrega();
    var _Alterar_Origem_Destino_Servico = new Alterar_Origem_Destino_Servico();

    function possuiCiclista(val) {
        return val == 1 ?
            "<img src='imagens/icones/user_ok_16.gif' title='Possui ciclista(s) neste item de servi&ccedil;o' />" :
            "";
    }

    var grid_PEDIDO_VENDA = new Ext.grid.EditorGridPanel({
        id: 'grid_PEDIDO_VENDA',
        store: PEDIDO_VENDA_Store,
        enableColumnHide: _GERENTE_COMERCIAL == 1 ? true : false,
        tbar: [{
            id: 'BTN_SALVAR_DATAS_ENTREGAS',
            text: 'Alterar data de entrega',
            icon: 'imagens/icones/calendar_fav_16.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um ou mais itens de servi&ccedil;o para alterar a data de entrega', 'BTN_SALVAR_DATAS_ENTREGAS');
                    return;
                }

                var arr1 = new Array();

                for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                    arr1[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                }

                _alteraDataEntrega.arr1(arr1);
                _alteraDataEntrega.show('BTN_SALVAR_DATAS_ENTREGAS');
            }
        }, '-', {
            icon: 'imagens/icones/entity_relation_write_16.gif',
            text: 'Mudan&ccedil;a de fases',
            scale: 'large',
            handler: function (btn) {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de servi&ccedil;o para consultar sobre as mudan&ccedil;as de fases', btn.getId());
                    return;
                }

                var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

                _janela_mudanca_fase_pedido.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                _janela_mudanca_fase_pedido.show(btn);
            }
        }, '-', {
            text: 'Dados de faturamento',
            icon: 'imagens/icones/date_field_fav_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length > 0) {

                    var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

                    dados_fatura.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

                    if (TXT_NUMERO_PEDIDO.getValue() > 0) {
                        dados_fatura.acaoCarregaGrid(Carrega_ITENS_POR_NUMERO_PEDIDO);
                    }
                    else {
                        dados_fatura.acaoCarregaGrid(Carrega_ITENS_PEDIDO);
                    }

                    dados_fatura.show(btn.getId());
                }
                else {
                    dialog.MensagemDeErro('Selecione um item de servi&ccedil;o para consultar / alterar os dados de faturamento');
                }
            }
        }, '-', {
            text: 'Alterar roteiro',
            icon: 'imagens/icones/entity_relation_write_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length > 0) {

                    var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

                    _Alterar_Origem_Destino_Servico.set_ENDERECO_ORIGEM(record.data.ENDERECO_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_ENDERECO_DESTINO(record.data.ENDERECO_FINAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_NUMERO_ORIGEM(record.data.NUMERO_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_NUMERO_DESTINO(record.data.NUMERO_FINAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_COMPLEMENTO_ORIGEM(record.data.COMPL_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_COMPLEMENTO_DESTINO(record.data.COMPL_FINAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_CEP_ORIGEM(record.data.CEP_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_CEP_DESTINO(record.data.CEP_FINAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_CIDADE_ORIGEM(record.data.CIDADE_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_CIDADE_DESTINO(record.data.CIDADE_FINAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_ESTADO_ORIGEM(record.data.ESTADO_INICIAL_ITEM_ORCAMENTO);
                    _Alterar_Origem_Destino_Servico.set_ESTADO_DESTINO(record.data.ESTADO_FINAL_ITEM_ORCAMENTO);

                    var _acao = function (distancia, tempo, atencao, resumo, dados) {
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Altera_Roteiro_Item_Venda');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                            NUMERO_ITEM: record.data.NUMERO_ITEM,
                            QTDE: distancia,
                            dados: {
                                ENDERECO_INICIAL_ITEM_ORCAMENTO: dados[0],
                                ENDERECO_FINAL_ITEM_ORCAMENTO: dados[1],
                                NUMERO_INICIAL_ITEM_ORCAMENTO: dados[2],
                                NUMERO_FINAL_ITEM_ORCAMENTO: dados[3],
                                COMPL_INICIAL_ITEM_ORCAMENTO: dados[4],
                                COMPL_FINAL_ITEM_ORCAMENTO: dados[5],
                                CEP_INICIAL_ITEM_ORCAMENTO: dados[6],
                                CEP_FINAL_ITEM_ORCAMENTO: dados[7],
                                CIDADE_INICIAL_ITEM_ORCAMENTO: dados[8],
                                CIDADE_FINAL_ITEM_ORCAMENTO: dados[9],
                                ESTADO_INICIAL_ITEM_ORCAMENTO: dados[10],
                                ESTADO_FINAL_ITEM_ORCAMENTO: dados[11]
                            },
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;
                            ITENS_PEDIDO_PagingToolbar.CarregaPaginaAtual();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    };

                    _Alterar_Origem_Destino_Servico.acaoPreencheDistancia(_acao);

                    _Alterar_Origem_Destino_Servico.show(btn);
                }
                else {
                    dialog.MensagemDeErro('Selecione um item de servi&ccedil;o para consultar / alterar os dados de faturamento');
                }
            }
        }, '-', {
            icon: 'imagens/icones/data_transport_config_24.gif',
            text: 'Definir ciclista(s)',
            scale: 'large',
            handler: function (btn) {

                var arr3 = new Array();

                for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                    arr3[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];
                }

                if (arr3.length == 0) {
                    dialog.MensagemDeErro('Selecione um ou mais itens de servi&ccedil;o para consultar / alterar os ciclistas', btn);
                    return;
                }

                _janela_Servico_Ciclista.record(arr3);
                _janela_Servico_Ciclista.show(btn);
            }
        }, '-', {
            icon: 'imagens/icones/ok_24.gif',
            text: 'Marcar / desmarcar<br />item(s) p/ faturar',
            scale: 'large',
            handler: function (btn) {
                Marca_Itens_Faturar(btn);
            }
        }, '-', {
            text: 'Gerar nota fiscal',
            icon: 'imagens/icones/mssql_ok_24.gif',
            scale: 'large',
            handler: function () {
                Verifica_Marcados();
            }
        }, '-', {
            text: 'Trocar endere&ccedil;os',
            icon: 'imagens/icones/database_reload_24.gif',
            scale: 'large',
            handler: function (btn) {
                trocaEnderecos(btn);
            }
        }],
        columns: [
                    IO_expander,
                    checkBoxSM_,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido, locked: true },

            { id: 'FOLLOW_UP_PEDIDO', header: "Follow Up", width: 110, sortable: true, dataIndex: 'FOLLOW_UP_PEDIDO', renderer: apontamentos_follow_up, align: 'center' },

            { id: 'NUMERO_PEDIDO', header: "Nr. Servi&ccedil;o", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'DATA_FATURAMENTO', header: "Faturamento", width: 80, sortable: true, dataIndex: 'DATA_FATURAMENTO', align: 'center', renderer: XMLParseDate },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Servi&ccedil;o", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO', renderer: Verifca_Beneficiamento },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde,
                editor: TXT_NOVA_QTDE_FATURAR
            },

            { id: 'QTDE_A_FATURAR', header: "Qtde a faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: ITEM_MARCADO_FATURAR,
                editor: TXT_NOVA_QTDE_FATURAR
            },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right',
                editoreditor: TXT_NOVO_PRECO
            },

            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ISS_ITEM_PEDIDO', header: "Al&iacute;q. ISS", width: 60, sortable: true, dataIndex: 'ALIQ_ISS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ISS_ITEM_PEDIDO', header: "Valor ISS", width: 90, sortable: true, dataIndex: 'VALOR_ISS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'QTDE_FATURADA', header: "Qtde Faturada", width: 105, sortable: true, dataIndex: 'QTDE_FATURADA', align: 'center', renderer: FormataQtde },
            { id: 'NUMERO_PEDIDO_ITEM_PEDIDO', header: "Nr. Pedido Cliente", width: 140, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_PEDIDO' },

            { id: 'CICLISTA', header: "Ciclista", width: 60, sortable: true, dataIndex: 'CICLISTA', renderer: possuiCiclista, align: 'center' }

        ],
        stripeRows: true,
        height: 400,
        width: '100%',

        clicksToEdit: 1,
        sm: checkBoxSM_,

        plugins: IO_expander,

        listeners: {
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }
                else {
                    if (e.field == 'PRECO_ITEM_PEDIDO') {
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Altera_Preco_de_Venda');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO: e.record.data.NUMERO_PEDIDO,
                            NUMERO_ITEM: e.record.data.NUMERO_ITEM,
                            PRECO: e.record.data.PRECO_ITEM_PEDIDO,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            ITENS_PEDIDO_PagingToolbar.CarregaPaginaAtual();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                    else if (e.field == 'QTDE_A_FATURAR') {

                        if (e.record.data.QTDE_A_FATURAR < 0.00) {
                            dialog.MensagemDeErro('Informe uma quantidade v&aacute;lida');
                            return;
                        }

                        var arr1 = new Array();
                        arr1[0] = e.record.data;

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Salva_Qtdes_a_Faturar');
                        _ajax.setJsonData({ lista: arr1, ID_USUARIO: _ID_USUARIO });

                        var _sucess = function (response, options) {
                            e.record.commit();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                    else if (e.field == 'QTDE_PRODUTO_ITEM_PEDIDO') {

                        if (e.record.data.QTDE_A_FATURAR < 0.00) {
                            dialog.MensagemDeErro('Informe uma quantidade v&aacute;lida');
                            return;
                        }

                        var arr1 = new Array();
                        arr1[0] = e.record.data;

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Altera_Qtde_Item_Venda');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO: e.record.data.NUMERO_PEDIDO,
                            NUMERO_ITEM: e.record.data.NUMERO_ITEM,
                            QTDE: e.value,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            ITENS_PEDIDO_PagingToolbar.CarregaPaginaAtual();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            },
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                var record = grid.getStore().getAt(rowIndex);
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                Abre_FollowUp(record);
            }
        }
    });

    function trocaEnderecos(btn) {
        
        if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens de servi&ccedil;o para alterar os endere&ccedil;os', btn.getId());
            return;
        }
        
        var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Altera_Enderecos');
        _ajax.setJsonData({
            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
            NUMERO_ITEM: record.data.NUMERO_ITEM,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            Carrega_ITENS_PEDIDO();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();        
    }
    
    var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido');
    ITENS_PEDIDO_PagingToolbar.setStore(PEDIDO_VENDA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var _numero_pedido = TXT_NUMERO_PEDIDO.getValue();

        if (_numero_pedido.length == 0)
            _numero_pedido = 0;

        var _nf = TXT_NUMERO_NF.getValue();

        _nf = _nf == '' ? 0 : _nf;

        var TB_TRANSP_JsonData = {
            DATA_PEDIDO: TXT_DATA_PEDIDO.getRawValue(),
            NUMERO_PEDIDO: _numero_pedido,
            CLIENTE: TXT_CLIENTE.getValue(),
            CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            NUMERO_PEDIDO_ITEM_PEDIDO: TXT_NUMERO_PEDIDO_CLIENTE.getValue(),
            CODIGO_VENDEDOR: CB_CODIGO_VENDEDOR.getValue() == '' ? 0 : CB_CODIGO_VENDEDOR.getValue(),
            ADMIN_USUARIO: _ADMIN_USUARIO,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_USUARIO: _ID_USUARIO,
            ID_VENDEDOR: _ID_VENDEDOR,
            VENDEDOR: _VENDEDOR,
            NUMERO_NF: _nf,
            STATUS: _janela_Filtro_Status.statusSelecionados(),
            start: 0,
            limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina(),
            ID_USUARIO: _ID_USUARIO
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

    function Marca_Itens_Faturar(btn) {
        var array1 = new Array();
        var arr_Record = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            if (record.data.STATUS_ESPECIFICO == 3 || record.data.STATUS_ESPECIFICO == 4) {
                dialog.MensagemDeErro('Um ou mais itens selecionados est&atilde;o cancelados ou j&aacute; foram faturados', btn.getId());
                return;
            }
        }

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            var marca_desmarca = record.data.ITEM_A_FATURAR == 1 ? 0 : 1;

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
                var _index = PEDIDO_VENDA_Store.find('NUMERO_ITEM', _arr[i][0].NUMERO_ITEM);

                if (_index > -1) {
                    var _record = PEDIDO_VENDA_Store.getAt(_index);
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

                    grid_PEDIDO_VENDA.getSelectionModel().deselectRow(_index);
                }
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Carrega_ITENS_PEDIDO(b) {
        if (_janela_Filtro_Status.statusSelecionados().length == 0) {
            dialog.MensagemDeErro('Selecione pelo menos um status de servi&ccedil;o no botão [status de servi&ccedil;o] para listar os itens', b.getId());
            return;
        }

        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Pedido');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Carrega_ITENS_POR_NUMERO_PEDIDO() {
        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Lista_Itens_Por_Numero_Pedido');
        ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData1());
        ITENS_PEDIDO_PagingToolbar.doRequest();
    }

    function Altera_Data_Entrega() {

        var _arr1;

        this.arr1 = function (pValue) {
            _arr1 = pValue;
        };

        var TXT_DATA1 = new Ext.form.DateField({
            layout: 'form',
            fieldLabel: 'Nova data de entrega',
            allowBlank: false
        });

        TXT_DATA1.setValue(new Date());

        var BTN_OK = new Ext.Button({
            text: 'Ok',
            icon: 'imagens/icones/ok_24.gif',
            scale: 'large',
            handler: function () {
                Salva_Data_Entrega();
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
                    columnWidth: 0.70,
                    layout: 'form',
                    items: [TXT_DATA1]
                }, {
                    columnWidth: 0.30,
                    layout: 'form',
                    items: [BTN_OK]
                }]
            }]
        });

        function Salva_Data_Entrega() {
            if (!form1.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Salva_Nova_Data_Entrega');
            _ajax.setJsonData({
                NUMERO_ITEM: _arr1,
                DATA_ENTREGA: TXT_DATA1.getRawValue(),
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                for (var r = 0; r < grid_PEDIDO_VENDA.getSelectionModel().selections.length; r++) {
                    var _record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[r];

                    _record.beginEdit();
                    _record.set('ENTREGA_PEDIDO', result.DATA_ENTREGA);
                    _record.set('ATRASADA', result.ATRASADA);
                    _record.endEdit();
                    _record.commit();
                }

                wLista.hide();

                checkBoxSM_.deselectRange(0, grid_PEDIDO_VENDA.getStore().getCount() - 1);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var wLista = new Ext.Window({
            layout: 'form',
            title: 'Data de entrega do servi&ccedil;o',
            iconCls: 'icone_TB_NOTA_SAIDA',
            width: 275,
            height: 95,
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
            wLista.show(elm);
        };
    }

    TB_STATUS_PEDIDO_USUARIO_CARREGA_COMBO();

    ////////////////
    var CB_STATUS_PEDIDO_USUARIO = new Ext.form.ComboBox({
        id: 'CB_STATUS_PEDIDO_USUARIO',
        store: combo_TB_STATUS_PEDIDO_USUARIO,
        fieldLabel: 'Posi&ccedil;&atilde;o do servi&ccedil;o',
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

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            if (grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo servi&ccedil;o');
                return;
            }
        }

        fu.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
            items[i] = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        fu.ITENS_PEDIDO(items);

        fu.show('BTN_FOLLOW_UP_PEDIDO_VENDA');
    }

    var toolbar_TB_PEDIDO = new Ext.Toolbar({
        id: 'toolbar_PEDIDO',
        style: 'text-align: right;',
        items: [{
            text: 'Salvar Posi&ccedil;&atilde;o',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            id: 'BTN_NOVA_POSICAO_PEDIDO',
            handler: function () {
                GravaNovaPosicao('BTN_NOVA_POSICAO_PEDIDO', false, false);
            }
        }, '-', {
            id: 'BTN_FOLLOW_UP_PEDIDO_VENDA',
            text: 'Follow UP',
            icon: 'imagens/icones/book_fav_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um servi&ccedil;o para consultar o follow up');
                }
                else {
                    var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

                    Abre_FollowUp(record);
                }
            }
        }, '-', {
            text: 'Analisar Servi&ccedil;o',
            id: 'BTN_ANALISE_PEDIDO',
            icon: 'imagens/icones/system_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um servi&ccedil;o para consultar a sua an&aacute;lise');
                }
                else {
                    var record = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                    wAna.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    wAna.show('BTN_ANALISE_PEDIDO');
                }
            }
        }, '-', {
            id: 'BTN_CUSTO_ITEM_PEDIDO',
            text: 'Custos do Item /<br />Servi&ccedil;os',
            icon: 'imagens/icones/calculator_star_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length > 0) {

                    var record = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                    lista.SETA_NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    lista.SETA_NUMERO_ITEM(record.data.NUMERO_ITEM);
                    lista.SETA_TITULO(record.data.CODIGO_PRODUTO_PEDIDO);
                    lista.SETA_RECORD_ITEM_PEDIDO(record);

                    lista.DesabilitaGrid(record.data.STATUS_ESPECIFICO > 1 ? true : false);

                    lista.show('BTN_CUSTO_ITEM_PEDIDO');
                }
                else {
                    dialog.MensagemDeErro('Selecione um item j&aacute; cadastrado neste or&ccedil;amento para lan&ccedil;ar os seus custos');
                }
            }
        }, '-', {
            id: 'BTN_CANCELAR_PEDIDO_VENDA',
            text: 'Cancelar o Servi&ccedil;o<br />Todo',
            icon: 'imagens/icones/document_cancel_24.gif',
            scale: 'large',
            handler: function () {
                GravaNovaPosicao('BTN_CANCELAR_PEDIDO_VENDA', true, false);
            }
        }, '-', {
            id: 'BTN_NOTAS_FISCAIS_PEDIDO',
            text: 'Notas Fiscais',
            icon: 'imagens/icones/preview_write_24.gif',
            scale: 'large',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    notas.NUMERO_PEDIDO(0);
                    notas.ITENS_PEDIDO(0);

                    notas.show('BTN_NOTAS_FISCAIS_PEDIDO');
                }
                else {
                    var record = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[0];

                    notas.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                    notas.ITENS_PEDIDO(record.data.NUMERO_ITEM);

                    notas.show('BTN_NOTAS_FISCAIS_PEDIDO');
                }
            }
        }]
    });

    function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
        if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um servi&ccedil;o para gravar a posi&ccedil;&atilde;o');
            return;
        }

        if (!CANCELAR && !LIBERAR_FATURAR) {
            if (CB_STATUS_PEDIDO_USUARIO.getValue() < 1) {
                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                return;
            }
        }

        var record = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[0];

        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {

            if (!CANCELAR && !LIBERAR_FATURAR) {
                if (CB_STATUS_PEDIDO_USUARIO.getValue() ==
                                Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                    dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) servi&ccedil;o(s) selecionado(s)');
                    return;
                }
            }

            if (Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo servi&ccedil;o');
                return;
            }
        }

        posicao.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.length; i++) {
            items[i] = Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        posicao.ITENS_PEDIDO(items);
        posicao.REGISTROS(Ext.getCmp('grid_PEDIDO_VENDA').getSelectionModel().selections.items);
        posicao.CANCELAR(CANCELAR);
        posicao.LIBERAR_FATURAR(LIBERAR_FATURAR);

        posicao.storeGrid(PEDIDO_VENDA_Store);

        var _index = CB_STATUS_PEDIDO_USUARIO.getStore().find('CODIGO_STATUS_PEDIDO', CB_STATUS_PEDIDO_USUARIO.getValue());

        if (LIBERAR_FATURAR || CANCELAR) {
            posicao.SENHA(0);
        }
        else {
            posicao.SENHA(_index > -1 ?
                            CB_STATUS_PEDIDO_USUARIO.getStore().getAt(_index).data.SENHA :
                            0);
        }

        posicao.COMBO_STATUS('CB_STATUS_PEDIDO_USUARIO');

        posicao.show(elm);
    }

    function Desabilita_Botoes_Vendedor() {
        Ext.getCmp('BTN_CANCELAR_PEDIDO_VENDA').disable();
        Ext.getCmp('BTN_NOVA_POSICAO_PEDIDO').disable();
        Ext.getCmp('BTN_IMPRIMIR_PEDIDO_VENDA').disable();
        Ext.getCmp('BTN_LIBERAR_FATURAR').disable();
        Ext.getCmp('BTN_SALVAR_DATAS_ENTREGAS').disable();
    }

    function Busca_Gerente_Vendas() {
        CARREGA_VENDEDORES_PEDIDO();

        //        if (_VENDEDOR == 1) {
        //            CB_STATUS_PEDIDO_USUARIO.disable();
        //            Desabilita_Botoes_Vendedor();
        //        }
    }

    var panel1 = new Ext.Panel({
        autoHeight: true,
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        title: 'Servi&ccedil;os de venda',
        items: [formPEDIDO, grid_PEDIDO_VENDA, ITENS_PEDIDO_PagingToolbar.PagingToolbar(),
                    {
                        layout: 'column',
                        frame: true,
                        border: true,
                        items: [{
                            columnWidth: .32,
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 115,
                            items: [CB_STATUS_PEDIDO_USUARIO]
                        }]
                    },
                    toolbar_TB_PEDIDO]
    });

    Ext.getCmp('grid_PEDIDO_VENDA').setHeight(AlturaDoPainelDeConteudo(274));

    Busca_Gerente_Vendas();

    if (_VENDEDOR == 1 && _GERENTE_COMERCIAL == 0) {
        CB_CODIGO_VENDEDOR.disable();
    }

    return panel1;
}

function JANELA_ANALISE_PEDIDO() {
    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;

        wANALISE_PEDIDO.setTitle('An&aacute;lise do Servi&ccedil;o Nr.' + _NUMERO_PEDIDO);

        Analisa_Cliente();
    };

    ////////////////

    var ANALISE_PEDIDO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CRITERIO', 'MOTIVO'])
    });

    var grid_ANALISE_PEDIDO = new Ext.grid.GridPanel({
        store: ANALISE_PEDIDO_STORE,
        columns: [
            { id: 'CRITERIO', header: "Crit&eacute;rio", width: 200, sortable: true, dataIndex: 'CRITERIO', renderer: Analise },
            { id: 'MOTIVO', header: "Motivo", width: 663, sortable: true, dataIndex: 'MOTIVO'}],
        stripeRows: true,
        height: 400,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function Analisa_Cliente() {
        ANALISE_PEDIDO_STORE.removeAll();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Analise_Pedido_Venda');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            ANALISE_PEDIDO_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wANALISE_PEDIDO = new Ext.Window({
        layout: 'form',
        title: 'An&aacute;lise do servi&ccedil;o',
        iconCls: 'icone_ANALISE_PEDIDO',
        width: 900,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        renderTo: Ext.getBody(),
        modal: true,
        items: [grid_ANALISE_PEDIDO],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        wANALISE_PEDIDO.show(elm);
    };
}

function JANELA_FOLLOW_UP_PEDIDO() {
    var _NUMERO_PEDIDO;
    var _ITENS_PEDIDO = new Array();

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        if (_NUMERO_PEDIDO != pNUMERO_PEDIDO) {
            _NUMERO_PEDIDO = pNUMERO_PEDIDO;

            wFOLLOW_UP.setTitle('Follow UP do Servi&ccedil;o Nr.' + _NUMERO_PEDIDO);

            Busca_JANELA_FOLLOW_UP_PEDIDO();
        }
    };

    this.ITENS_PEDIDO = function (pITENS_PEDIDO) {
        if (_ITENS_PEDIDO != pITENS_PEDIDO) {
            _ITENS_PEDIDO = pITENS_PEDIDO;

            Busca_Follow_UP_ITEM_Pedido();
        }
    };

    ////////////////

    var HDF_NUMERO_FOLLOW_UP = new Ext.form.Hidden({
        name: 'HDF_NUMERO_FOLLOW_UP',
        id: 'HDF_NUMERO_FOLLOW_UP',
        value: 0
    });

    var HDF_NUMERO_FOLLOW_UP2 = new Ext.form.Hidden({
        name: 'HDF_NUMERO_FOLLOW_UP2',
        id: 'HDF_NUMERO_FOLLOW_UP2',
        value: 0
    });

    var _textoModificado = false;

    var TXT_TEXTO_FOLLOW_UP1 = new Ext.form.TextField({
        fieldLabel: 'Coment&aacute;rios (Servi&ccedil;o)',
        width: 600,
        height: 40,
        autoCreate: { tag: 'textarea', autocomplete: 'off' },
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            keydown: function (f, e) {
                _textoModificado = true;
            }
        }
    });

    var btn_gravar_follow_up1 = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            GravaJANELA_FOLLOW_UP_PEDIDO();
        }
    });

    var btn_novo_follow_up1 = new Ext.Button({
        text: 'Novo',
        icon: 'imagens/icones/database_fav_24.gif',
        scale: 'large',
        handler: function () {
            Reseta_FOLLOW_UP();
        }
    });

    var btn_gravar_follow_up2 = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            GravaFollow_UP_Item_Pedido();
        }
    });

    var btn_novo_follow_up2 = new Ext.Button({
        text: 'Novo',
        icon: 'imagens/icones/database_fav_24.gif',
        scale: 'large',
        handler: function () {
            Reseta_FOLLOW_UP2();
        }
    });

    var FOLLOW_UP_PEDIDO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_FOLLOW_UP', 'NUMERO_PEDIDO', 'ID_USUARIO_FOLLOW_UP',
                            'LOGIN_USUARIO', 'DATA_HORA_FOLLOW_UP', 'TEXTO_FOLLOW_UP']),

        listeners: {
            load: function (store, records, options) {
                for (var i = 0; i < store.getCount(); i++) {
                    FU_expander.expandRow(i);
                }
            }
        }
    });

    var FU_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template("<hr width='100%'><span style='font-family: tahoma; font-size: 10pt;'><b>Hist&oacute;rico:</b> {TEXTO_FOLLOW_UP}</span><br />"),
        expandOnEnter: false,
        expandOnDblClick: false
    });

    var _VENDEDOR_Copia_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'EMAIL_VENDEDOR']
       )
    });

    var grid_FOLLOW_UP_PEDIDO = new Ext.grid.GridPanel({
        store: FOLLOW_UP_PEDIDO_STORE,
        columns: [
                        FU_expander,
                    { id: 'NUMERO_PEDIDO', header: "Nr. do Servi&ccedil;o", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO' },
                    { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 110, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                    { id: 'DATA_HORA_FOLLOW_UP', header: "Data / Hora", width: 700, sortable: true, dataIndex: 'DATA_HORA_FOLLOW_UP', renderer: XMLParseDateTime }
                    ],
        stripeRows: true,
        height: 140,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        plugins: FU_expander
    });

    function popula_Follow_UP_Pedido(record) {
        TXT_TEXTO_FOLLOW_UP1.setValue(record.data.TEXTO_FOLLOW_UP);
        HDF_NUMERO_FOLLOW_UP.setValue(record.data.NUMERO_FOLLOW_UP);
    }

    function Busca_JANELA_FOLLOW_UP_PEDIDO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Follow_UP_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            FOLLOW_UP_PEDIDO_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function GravaJANELA_FOLLOW_UP_PEDIDO() {
        if (!TXT_TEXTO_FOLLOW_UP1.isValid())
            return;

        var array_Destinatarios = new Array();

        for (var i = 0; i < _VENDEDOR_Copia_Store1.getCount(); i++) {
            array_Destinatarios[i] = _VENDEDOR_Copia_Store1.getAt(i).data.EMAIL_VENDEDOR;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Ext.getCmp('HDF_NUMERO_FOLLOW_UP').getValue() == 0 ?
                            'servicos/TB_FOLLOW_UP_PEDIDO.asmx/GravaNovo' :
                            'servicos/TB_FOLLOW_UP_PEDIDO.asmx/AtualizaFOLLOW_UP');

        var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

        _ajax.setJsonData({ dados: {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            NUMERO_FOLLOW_UP: Ext.getCmp('HDF_NUMERO_FOLLOW_UP').getValue(),
            TEXTO_FOLLOW_UP: TXT_TEXTO_FOLLOW_UP1.getValue(),
            ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
            FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
            ASSINATURA: _remetente.data.ASSINATURA
        },
            DESTINATARIOS: array_Destinatarios,
            ID_USUARIO: _ID_USUARIO,
            LOGIN_USUARIO: _LOGIN_USUARIO
        });

        var _sucess = function (response, options) {
            Reseta_FOLLOW_UP();
            Busca_JANELA_FOLLOW_UP_PEDIDO();
            _textoModificado = false;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Reseta_FOLLOW_UP() {
        TXT_TEXTO_FOLLOW_UP1.reset();
        Ext.getCmp('HDF_NUMERO_FOLLOW_UP').setValue(0);
    }

    /////// Follow UP dos itens do Pedido

    var _textoModificado1 = false;

    var TXT_TEXTO_FOLLOW_UP2 = new Ext.form.TextField({
        fieldLabel: 'Coment&aacute;rios (Item do servi&ccedil;o)',
        width: 555,
        height: 40,
        autoCreate: { tag: 'textarea', autocomplete: 'off' },
        enableKeyEvents: true,
        listeners: {
            keydown: function (f, e) {
                _textoModificado1 = true;
            }
        }
    });

    var FOLLOW_UP_ITEM_PEDIDO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_FOLLOW_UP', 'NUMERO_PEDIDO', 'NUMERO_ITEM', 'ID_USUARIO_FOLLOW_UP',
                            'LOGIN_USUARIO', 'CODIGO_PRODUTO_PEDIDO', 'DATA_HORA_FOLLOW_UP', 'TEXTO_FOLLOW_UP', 'DESCRICAO_PRODUTO']),

        listeners: {
            load: function (store, records, options) {
                for (var i = 0; i < store.getCount(); i++) {
                    FUI_expander.expandRow(i);
                }
            }
        }
    });

    var FUI_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template("<hr width='100%'><span style='font-family: tahoma; font-size: 10pt;'><b>Hist&oacute;rico:</b> {TEXTO_FOLLOW_UP}</span><br />"),
        expandOnEnter: false,
        expandOnDblClick: false
    });

    var grid_FOLLOW_UP_ITEM_PEDIDO = new Ext.grid.GridPanel({
        store: FOLLOW_UP_ITEM_PEDIDO_STORE,
        columns: [
                        FUI_expander,
                    { id: 'NUMERO_PEDIDO', header: "Nr. do Servi&ccedil;o", width: 100, sortable: true, dataIndex: 'NUMERO_PEDIDO' },
                    { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 110, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                    { id: 'DATA_HORA_FOLLOW_UP', header: "Data / Hora", width: 120, sortable: true, dataIndex: 'DATA_HORA_FOLLOW_UP', renderer: XMLParseDateTime },
                    { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                    { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 400, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
                    ],
        stripeRows: true,
        height: 130,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        plugins: FUI_expander
    });

    function popula_Follow_UP_Item_Pedido(record) {
        TXT_TEXTO_FOLLOW_UP2.setValue(record.data.TEXTO_FOLLOW_UP);
        HDF_NUMERO_FOLLOW_UP2.setValue(record.data.NUMERO_FOLLOW_UP);
    }

    function RetornaVENDA_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            NUMERO_ITEM: _ITENS_PEDIDO[0],
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var FOLLOW_UP_ITEM_PEDIDO_PagingToolbar = new Th2_PagingToolbar();
    FOLLOW_UP_ITEM_PEDIDO_PagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Follow_UP_ITEM_Pedido');
    FOLLOW_UP_ITEM_PEDIDO_PagingToolbar.setStore(FOLLOW_UP_ITEM_PEDIDO_STORE);

    function Busca_Follow_UP_ITEM_Pedido() {
        FOLLOW_UP_ITEM_PEDIDO_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        FOLLOW_UP_ITEM_PEDIDO_PagingToolbar.doRequest();
    }

    function GravaFollow_UP_Item_Pedido() {
        if (!TXT_TEXTO_FOLLOW_UP2.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Ext.getCmp('HDF_NUMERO_FOLLOW_UP2').getValue() == 0 ?
                            'servicos/TB_FOLLOW_UP_ITEM_PEDIDO.asmx/GravaNovo' :
                            'servicos/TB_FOLLOW_UP_ITEM_PEDIDO.asmx/AtualizaFOLLOW_UP');

        var array_Destinatarios = new Array();

        for (var i = 0; i < _VENDEDOR_Copia_Store1.getCount(); i++) {
            array_Destinatarios[i] = _VENDEDOR_Copia_Store1.getAt(i).data.EMAIL_VENDEDOR;
        }

        var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

        _ajax.setJsonData({ dados: {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            NUMERO_FOLLOW_UP: Ext.getCmp('HDF_NUMERO_FOLLOW_UP2').getValue(),
            NUMERO_ITENS: _ITENS_PEDIDO,
            TEXTO_FOLLOW_UP: TXT_TEXTO_FOLLOW_UP2.getValue(),
            ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
            FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
            ASSINATURA: _remetente.data.ASSINATURA
        },
            DESTINATARIOS: array_Destinatarios,
            ID_USUARIO: _ID_USUARIO,
            LOGIN_USUARIO: _LOGIN_USUARIO
        });

        var _sucess = function (response, options) {
            Reseta_FOLLOW_UP2();
            Busca_Follow_UP_ITEM_Pedido();
            _textoModificado1 = false;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Reseta_FOLLOW_UP2() {
        TXT_TEXTO_FOLLOW_UP2.reset();
        Ext.getCmp('HDF_NUMERO_FOLLOW_UP2').setValue(0);
    }

    //////////////////

    var _VENDEDOR_Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'EMAIL_VENDEDOR']
       )
    });

    function CARREGA_VENDEDOR_SUPERVISOR() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Busca_Usuarios_Pedido');
        _ajax.setJsonData({ NUMERO_PEDIDO: _NUMERO_PEDIDO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            _VENDEDOR_Store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var _VENDEDOR_Copia_Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'EMAIL_VENDEDOR']
       )
    });

    function Adiciona_Vendedor_Tarefa1(record) {

        var existe = false;

        for (var i = 0; i < _VENDEDOR_Copia_Store1.getCount(); i++) {
            if (_VENDEDOR_Copia_Store1.getAt(i).data.EMAIL_VENDEDOR == record.data.EMAIL_VENDEDOR) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            var new_record = Ext.data.Record.create([
                                        { name: 'NOME_VENDEDOR' },
                                        { name: 'EMAIL_VENDEDOR' }
                                    ]);

            var novo = new new_record({
                NOME_VENDEDOR: record.data.NOME_VENDEDOR,
                EMAIL_VENDEDOR: record.data.EMAIL_VENDEDOR
            });

            _VENDEDOR_Copia_Store1.insert(_VENDEDOR_Copia_Store1.getCount(), novo);
        }
    }

    var gridVENDEDOR_SUPERVISOR = new Ext.grid.GridPanel({
        title: 'Lista de Usu&aacute;rios',
        tbar: [{
            xtype: 'label',
            text: 'Copiar a mensagem aos seguintes usuários:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'combo',
            store: _VENDEDOR_Store1,
            valueField: 'NOME_VENDEDOR',
            displayField: 'NOME_VENDEDOR',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione aqui...',
            selectOnFocus: true,
            listeners: {
                select: function (combo, record, index) {
                    Adiciona_Vendedor_Tarefa1(record);
                    combo.reset();
                }
            }
        }], store: _VENDEDOR_Copia_Store1,
        columns: [
                    { id: 'NOME_VENDEDOR', header: "Usu&aacute;rio", width: 250, sortable: true, dataIndex: 'NOME_VENDEDOR' },
                    { id: 'EMAIL_VENDEDOR', header: "e-mail", width: 280, sortable: true, dataIndex: 'EMAIL_VENDEDOR' }
                    ],
        stripeRows: true,
        height: 181,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.DELETE) {
                    if (gridVENDEDOR_SUPERVISOR.getSelectionModel().getSelections().length > 0) {
                        var record = gridVENDEDOR_SUPERVISOR.getSelectionModel().getSelected();
                        _VENDEDOR_Copia_Store1.remove(record);
                    }
                }
            }
        }
    });

    //////////////////

    var panel_items = new Ext.Panel({
        autoHeight: true,
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        items: [{
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .78,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 135,
                items: [TXT_TEXTO_FOLLOW_UP1]
            }, {
                columnWidth: .09,
                items: [btn_gravar_follow_up1]
            }, {
                columnWidth: .10,
                items: [btn_novo_follow_up1]

            }]
        },
                            grid_FOLLOW_UP_PEDIDO,
                            {
                                layout: 'column',
                                frame: true,
                                items: [{
                                    columnWidth: .78,
                                    layout: 'form',
                                    labelAlign: 'left',
                                    labelWidth: 178,
                                    items: [TXT_TEXTO_FOLLOW_UP2]
                                }, {
                                    columnWidth: .09,
                                    items: [btn_gravar_follow_up2]
                                }, {
                                    columnWidth: .10,
                                    items: [btn_novo_follow_up2]
                                }]
                            },
                            grid_FOLLOW_UP_ITEM_PEDIDO,
                            FOLLOW_UP_ITEM_PEDIDO_PagingToolbar.PagingToolbar(),
                            gridVENDEDOR_SUPERVISOR
                        ]
    });

    function Ajusta_Controles(_larguraJanela, altura) {
        grid_FOLLOW_UP_PEDIDO.setWidth(_larguraJanela);
        grid_FOLLOW_UP_PEDIDO.setHeight(altura * .2742);

        grid_FOLLOW_UP_ITEM_PEDIDO.setWidth(_larguraJanela);
        grid_FOLLOW_UP_ITEM_PEDIDO.setHeight(altura * .2581);

        gridVENDEDOR_SUPERVISOR.setWidth(_larguraJanela);
        gridVENDEDOR_SUPERVISOR.setHeight(altura * .1887);
    }

    var wFOLLOW_UP = new Ext.Window({
        title: 'Follow UP de servi&ccedil;o de Venda',
        iconCls: 'icone_FOLLOW_UP',
        width: 1000,
        height: 622,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                Verifica_FollowUP_Salvo();
            }
        },
        items: [panel_items]
    });

    this.show = function (elm) {
        CARREGA_VENDEDOR_SUPERVISOR();
        wFOLLOW_UP.show(elm);
    };

    function Verifica_FollowUP_Salvo() {
        function Confirma(btn) {
            if (btn == 'yes') {
                wFOLLOW_UP.hide();
                _VENDEDOR_Copia_Store1.removeAll();
            }
        }

        if (_textoModificado || _textoModificado1) {
            if (_textoModificado) {
                dialog.MensagemDeConfirmacao('O texto digitado acima no follow up do servi&ccedil;o <b>n&atilde;o foi salvo</b>.<br /><br />Deseja minimizar mesmo assim?',
                                                wFOLLOW_UP.getId(), Confirma);
            }

            if (_textoModificado1) {
                dialog.MensagemDeConfirmacao('O texto digitado acima no follow up do item do servi&ccedil;o <b>n&atilde;o foi salvo</b>.<br /><br />Deseja minimizar mesmo assim?',
                                                wFOLLOW_UP.getId(), Confirma);
            }
        }
        else {
            wFOLLOW_UP.hide();
            _VENDEDOR_Copia_Store1.removeAll();
        }
    }
}

//////////////////////// Grava nova Posição

function Nova_Posicao_Pedido() {
    var _NUMERO_PEDIDO;
    var _ITENS_PEDIDO = new Array();
    var _records = new Array();
    var Cancelar_Pedido = false;
    var Liberar_Faturar = false;
    var combo;
    var Senha = 0;
    var _storeGrid;

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        if (_NUMERO_PEDIDO != pNUMERO_PEDIDO) {
            _NUMERO_PEDIDO = pNUMERO_PEDIDO;

            wPOSICAO_PEDIDO.setTitle('Nova Posi&ccedil;&atilde;o do Servi&ccedil;o Nr.' + _NUMERO_PEDIDO);
        }
    };

    this.ITENS_PEDIDO = function (pITENS_PEDIDO) {
        if (_ITENS_PEDIDO != pITENS_PEDIDO) {
            _ITENS_PEDIDO = pITENS_PEDIDO;
        }
    };

    this.REGISTROS = function (records) {
        _records = records;
    };

    this.COMBO_STATUS = function (_combo) {
        combo = _combo;
    };

    this.SENHA = function (pSenha) {
        Senha = pSenha;
        TXT_SENHA_LIBERACAO.allowBlank = Senha == "0" ? true : false;
        TXT_SENHA_LIBERACAO.reset();

        Senha == 0 ? TXT_SENHA_LIBERACAO.disable() : TXT_SENHA_LIBERACAO.enable();
    };

    this.storeGrid = function (pStoreGrid) {
        _storeGrid = pStoreGrid;
    };

    var TXT_OBS_POSICAO = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        height: 80,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var CB_APLICAR_POSICAO = new Ext.form.ComboBox({
        fieldLabel: 'Aplicar a',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 350,
        allowBlank: false,
        value: 1,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Gravar a posição em todos os itens do servi&ccedil;o'],
                  [1, 'Gravar a posição somente nos itens selecionados']]
        })
    });

    var storeSTATUSCANCELAMENTO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_STATUS_PEDIDO', 'DESCRICAO_STATUS_PEDIDO']
       ),
        sortInfo: {
            field: 'DESCRICAO_STATUS_PEDIDO',
            direction: 'ASC'
        }
    });

    function Carrega_StatusCancelamento() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Carrega_Status_Cancelamento');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            storeSTATUSCANCELAMENTO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var CB_STATUS_PEDIDO_USUARIO2 = new Ext.form.ComboBox({
        store: storeSTATUSCANCELAMENTO,
        fieldLabel: 'Cancelamento',
        valueField: 'CODIGO_STATUS_PEDIDO',
        displayField: 'DESCRICAO_STATUS_PEDIDO',
        typeAhead: true,
        visible: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        allowBlank: false,
        width: 240
    });

    Carrega_StatusCancelamento();

    var TXT_SENHA_LIBERACAO = new Ext.form.TextField({
        fieldLabel: 'Senha',
        name: 'senha',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var BTN_SALVAR_NOVA_POSICAO = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'medium',
        handler: function () {
            Salvar_Nova_Posicao();
        }
    });

    function Salvar_Nova_Posicao() {
        if (!Cancelar_Pedido) {
            if (!formPOSICAO_PEDIDO.getForm().isValid())
                return;
        }
        else {
            if (!CB_STATUS_PEDIDO_USUARIO2.isValid())
                return;
        }

        var _status;

        if (Cancelar_Pedido)
            _status = CB_STATUS_PEDIDO_USUARIO2.getValue();
        else
            _status = Ext.getCmp(combo).getValue() == "" ? 0 :
                                        Ext.getCmp(combo).getValue();

        var array_Destinatarios = new Array();

        for (var i = 0; i < _VENDEDOR_Copia_Store.getCount(); i++) {
            array_Destinatarios[i] = _VENDEDOR_Copia_Store.getAt(i).data.EMAIL_VENDEDOR;
        }

        var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Grava_Posicao_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            ITENS: _ITENS_PEDIDO,
            OBS: TXT_OBS_POSICAO.getValue(),
            STATUS: _status,
            TODOS: CB_APLICAR_POSICAO.getValue(),
            CANCELAR: Cancelar_Pedido,
            LIBERAR_FATURAR: Liberar_Faturar,
            SENHA: Senha,
            SENHA_DIGITADA: TXT_SENHA_LIBERACAO.getValue(),
            DESTINATARIOS: array_Destinatarios,
            ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
            FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
            ASSINATURA: _remetente.data.ASSINATURA,
            ID_USUARIO: _ID_USUARIO,
            LOGIN_USUARIO: _LOGIN_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            var dados = eval(result + ';');

            if (CB_APLICAR_POSICAO.getValue() == 0 || Cancelar_Pedido) {
                var _store = _storeGrid;

                for (var i = 0; i < _store.getCount(); i++) {
                    var record = _store.getAt(i);

                    if (record.data.NUMERO_PEDIDO == _NUMERO_PEDIDO && record.data.STATUS_ESPECIFICO != 4) {
                        record.beginEdit();
                        record.set('STATUS_ITEM_PEDIDO', Ext.getCmp(combo).getValue());
                        record.set('DESCRICAO_STATUS_PEDIDO', dados[0]);
                        record.set('COR_STATUS', dados[1]);
                        record.set('COR_FONTE_STATUS', dados[2]);
                        record.set('STATUS_ESPECIFICO', dados[3]);

                        record.endEdit();
                        record.commit();

                        wPOSICAO_PEDIDO.hide();
                    }
                }
            }
            else {
                for (var i = 0; i < _records.length; i++) {
                    if (_records[i].data.STATUS_ESPECIFICO != 4) {
                        _records[i].beginEdit();

                        _records[i].set('STATUS_ITEM_PEDIDO', Ext.getCmp(combo).getValue());
                        _records[i].set('DESCRICAO_STATUS_PEDIDO', dados[0]);
                        _records[i].set('COR_STATUS', dados[1]);
                        _records[i].set('COR_FONTE_STATUS', dados[2]);
                        _records[i].set('STATUS_ESPECIFICO', dados[3]);

                        _records[i].endEdit();
                        _records[i].commit();

                        TXT_OBS_POSICAO.reset();

                        TXT_SENHA_LIBERACAO.reset();

                        wPOSICAO_PEDIDO.hide();
                    }
                }
            }

            TXT_OBS_POSICAO.reset();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_POSICAO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [BTN_SALVAR_NOVA_POSICAO]
    });

    var _VENDEDOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'EMAIL_VENDEDOR']
       )
    });

    var _VENDEDOR_Copia_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOME_VENDEDOR', 'EMAIL_VENDEDOR']
       )
    });

    function Adiciona_Vendedor_Tarefa(record) {

        var existe = false;

        for (var i = 0; i < _VENDEDOR_Copia_Store.getCount(); i++) {
            if (_VENDEDOR_Copia_Store.getAt(i).data.EMAIL_VENDEDOR == record.data.EMAIL_VENDEDOR) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            var new_record = Ext.data.Record.create([
                                        { name: 'NOME_VENDEDOR' },
                                        { name: 'EMAIL_VENDEDOR' }
                                    ]);

            var novo = new new_record({
                NOME_VENDEDOR: record.data.NOME_VENDEDOR,
                EMAIL_VENDEDOR: record.data.EMAIL_VENDEDOR
            });

            _VENDEDOR_Copia_Store.insert(_VENDEDOR_Copia_Store.getCount(), novo);
        }
    }

    function CARREGA_VENDEDOR_SUPERVISOR() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Busca_Usuarios_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            _VENDEDOR_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var gridVENDEDOR_SUPERVISOR = new Ext.grid.GridPanel({
        title: 'Lista de Usu&aacute;rios',
        tbar: [{
            xtype: 'label',
            text: 'Copiar a mensagem aos seguintes usuários:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'combo',
            store: _VENDEDOR_Store,
            valueField: 'NOME_VENDEDOR',
            displayField: 'NOME_VENDEDOR',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione aqui...',
            selectOnFocus: true,
            listeners: {
                select: function (combo, record, index) {
                    Adiciona_Vendedor_Tarefa(record);
                    combo.reset();
                }
            }
        }],
        store: _VENDEDOR_Copia_Store,
        columns: [
                    { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 250, sortable: true, dataIndex: 'NOME_VENDEDOR' },
                    { id: 'EMAIL_VENDEDOR', header: "e-mail", width: 280, sortable: true, dataIndex: 'EMAIL_VENDEDOR' }
                    ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.DELETE) {
                    if (gridVENDEDOR_SUPERVISOR.getSelectionModel().getSelections().length > 0) {
                        var record = gridVENDEDOR_SUPERVISOR.getSelectionModel().getSelected();
                        _VENDEDOR_Copia_Store.remove(record);
                    }
                }
            }
        }
    });

    var formPOSICAO_PEDIDO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                layout: 'form',
                items: [CB_APLICAR_POSICAO]
            }, {
                columnWidth: .50,
                layout: 'form',
                items: [CB_STATUS_PEDIDO_USUARIO2]
            }]
        }, {
            layout: 'form',
            items: [TXT_SENHA_LIBERACAO]
        }, {
            layout: 'form',
            items: [TXT_OBS_POSICAO]
        }, {
            items: [gridVENDEDOR_SUPERVISOR]
        }, {
            layout: 'form',
            items: [toolbar_POSICAO]
        }]
    });

    var wPOSICAO_PEDIDO = new Ext.Window({
        layout: 'form',
        title: '',
        iconCls: 'icone_TB_STATUS_PEDIDO',
        width: 800,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        height: 480,
        items: [formPOSICAO_PEDIDO],
        listeners: {
            minimize: function (w) {
                w.hide();

                Cancelar_Pedido = false;
                Liberar_Faturar = false;
            }
        }
    });

    this.CANCELAR = function (pCancelar_Pedido) {
        Cancelar_Pedido = pCancelar_Pedido;

        if (Cancelar_Pedido) {
            wPOSICAO_PEDIDO.setTitle('Cancelamento do Servi&ccedil;o Nr.' + _NUMERO_PEDIDO);
            CB_APLICAR_POSICAO.disable();
            CB_STATUS_PEDIDO_USUARIO2.enable();
        }
        else {
            CB_APLICAR_POSICAO.enable();
            CB_STATUS_PEDIDO_USUARIO2.disable();
        }
    };

    this.LIBERAR_FATURAR = function (pLiberar_Faturar) {
        Liberar_Faturar = pLiberar_Faturar;

        if (Liberar_Faturar)
            wPOSICAO_PEDIDO.setTitle('Liberar o Servi&ccedil;o Nr.' + _NUMERO_PEDIDO + ' para faturamento');
    };

    this.show = function (elm) {
        CARREGA_VENDEDOR_SUPERVISOR();

        if (!Cancelar_Pedido && !Liberar_Faturar)
            wPOSICAO_PEDIDO.setTitle('Nova Posi&ccedil;&atilde;o do servi&ccedil;o');

        wPOSICAO_PEDIDO.show(elm);

        _VENDEDOR_Copia_Store.removeAll();
    };
}

// Mudança de fases

function janela_mudanca_fase_pedido() {

    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function (pValue) {
        _NUMERO_PEDIDO = pValue;
    };

    var store1 = new Ext.data.GroupingStore({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'DATA_MUDANCA', 'ID_USUARIO', 'LOGIN_USUARIO',
            'DESCRICAO_ANTERIOR', 'COR_FUNDO_ANTERIOR', 'COR_LETRA_ANTERIOR', 'DESCRICAO_NOVO', 'COR_FUNDO_NOVO',
            'COR_LETRA_NOVO', 'CODIGO_PRODUTO']),

        groupField: 'DATA_MUDANCA',
        sortInfo: { field: 'DATA_MUDANCA', direction: 'ASC' }
    });

    var _groupView = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Itens de servi&ccedil;o" : "Item de servi&ccedil;o"]})',
        groupByText: 'Agrupar por esta coluna',
        showGroupsText: 'Exibir de forma agrupada'
    });

    function faseAnterior(val, metadata, record) {
        return "<span style='width: 100%; background-color: " + record.data.COR_FUNDO_ANTERIOR + "; color: " + record.data.COR_LETRA_ANTERIOR + ";'>"
            + record.data.DESCRICAO_ANTERIOR + "</span>";
    }

    function novaFase(val, metadata, record) {
        return "<span style='width: 100%; background-color: " + record.data.COR_FUNDO_NOVO + "; color: " + record.data.COR_LETRA_NOVO + ";'>"
            + record.data.DESCRICAO_NOVO + "</span>";
    }

    var grid1 = new Ext.grid.GridPanel({
        store: store1,
        columns: [
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Servi&ccedil;o", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo produto", width: 160, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DATA_MUDANCA', header: "Mudan&ccedil;a em", width: 140, sortable: true, dataIndex: 'DATA_MUDANCA', renderer: XMLParseDateTime, align: 'center' },
            { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO', align: 'center' },
            { id: 'DESCRICAO_ANTERIOR', header: "Fase anterior", width: 160, sortable: true, dataIndex: 'DESCRICAO_ANTERIOR', renderer: faseAnterior },
            { id: 'DESCRICAO_NOVO', header: "Nova fase", width: 160, sortable: true, dataIndex: 'DESCRICAO_NOVO', renderer: novaFase}],

        stripeRows: true,
        height: 350,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        view: _groupView
    });

    function carregaGrid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_MUDANCA_FASE_PEDIDO.asmx/Lista_Mudanca_de_Fases_do_Pedido');

        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO ? _NUMERO_PEDIDO : 0,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wJanela = new Ext.Window({
        layout: 'form',
        title: 'Registro de mudança de fase do servi&ccedil;o',
        width: 760,
        iconCls: 'icone_TB_PEDIDOS_BENEFICIAMENTO',
        height: 382,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
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
        wJanela.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wJanela.toFront();
        wJanela.show(elm.getId());

        carregaGrid();
    };

    this.hide = function () {
        wJanela.hide();
    };
}

// Roteiro

function Alterar_Origem_Destino_Servico() {

    var TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        allowBlank: false,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430
    });

    var TXT_NUMERO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Numero',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPL_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_INICIAL_ITEM_ORCAMENTO = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        allowBlank: false,
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_CIDADE_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Munic&iacute;pio',
        width: 250,
        maxlength: 50,
        autoCreate: { tag: 'input', type: 'text', maxlength: 50 },
        allowBlank: false
    });

    var TXT_ESTADO_INICIAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Estado',
        allowBlank: false,
        maxLength: 2,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 2 },
        width: 50
    });


    var TXT_ENDERECO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Endere&ccedil;o',
        allowBlank: false,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' },
        width: 430
    });

    var TXT_NUMERO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Numero',
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
        width: 85
    });

    var TXT_COMPL_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Complemento',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 160
    });

    var TXT_CEP_FINAL_ITEM_ORCAMENTO = new Th2_FieldMascara({
        fieldLabel: 'CEP',
        allowBlank: false,
        Mascara: '99999-999',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '9' },
        width: 80
    });

    var TXT_CIDADE_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Munic&iacute;pio',
        width: 250,
        maxlength: 50,
        autoCreate: { tag: 'input', type: 'text', maxlength: 50 },
        allowBlank: false
    });

    var TXT_ESTADO_FINAL_ITEM_ORCAMENTO = new Ext.form.TextField({
        fieldLabel: 'Estado',
        allowBlank: false,
        maxLength: 2,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 2 },
        width: 50
    });

    var fs1 = new Ext.form.FieldSet({
        title: 'Endere&ccedil;o de origem',
        checkboxToggle: false,
        collapsible: false,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        items: [{
            layout: 'form',
            items: [TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [TXT_NUMERO_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_COMPL_INICIAL_ITEM_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_CEP_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .60,
                layout: 'form',
                items: [TXT_CIDADE_INICIAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ESTADO_INICIAL_ITEM_ORCAMENTO]
            }]
        }]
    });

    var fs2 = new Ext.form.FieldSet({
        title: 'Endere&ccedil;o de destino',
        checkboxToggle: false,
        collapsible: false,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        items: [{
            layout: 'form',
            items: [TXT_ENDERECO_FINAL_ITEM_ORCAMENTO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [TXT_NUMERO_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .40,
                layout: 'form',
                items: [TXT_COMPL_FINAL_ITEM_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_CEP_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .60,
                layout: 'form',
                items: [TXT_CIDADE_FINAL_ITEM_ORCAMENTO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ESTADO_FINAL_ITEM_ORCAMENTO]
            }]
        }]
    });

    var form1 = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 2px 0px 0px',
        frame: true,
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [fs1]
            }, {
                columnWidth: .50,
                items: [fs2]
            }]
        }],
        bbar: [Spacers(458), {
            text: 'Ok',
            icon: 'imagens/icones/ok_16.gif',
            scale: 'medium',
            handler: function (btn) {
                if (!form1.getForm().isValid()) {
                    dialog.MensagemDeErro('Preencha todos os campos em vermelho', btn.getId());
                    return;
                }

                util.IniciaSolicitacao();

                var enderecoOrigem = TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ' - ' +
                            TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CEP_INICIAL_ITEM_ORCAMENTO.getValue().trim();

                var enderecoDestino = TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_NUMERO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue().trim() + ' - ' +
                            TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue().trim() + ', ' +
                            TXT_CEP_FINAL_ITEM_ORCAMENTO.getValue().trim();

                var dados = new Array();

                dados[0] = TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[1] = TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.getValue();
                dados[2] = TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[3] = TXT_NUMERO_FINAL_ITEM_ORCAMENTO.getValue();
                dados[4] = TXT_COMPL_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[5] = TXT_COMPL_FINAL_ITEM_ORCAMENTO.getValue();
                dados[6] = TXT_CEP_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[7] = TXT_CEP_FINAL_ITEM_ORCAMENTO.getValue();
                dados[8] = TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[9] = TXT_CIDADE_FINAL_ITEM_ORCAMENTO.getValue();
                dados[10] = TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.getValue();
                dados[11] = TXT_ESTADO_FINAL_ITEM_ORCAMENTO.getValue();

                try {
                    var gm = new google_maps();
                    gm.ENDERECO_ORIGEM(enderecoOrigem);
                    gm.ENDERECO_DESTINO(enderecoDestino);

                    var _SUCESSO_MAPS = function SUCESSO(distancia, tempo, txt_distancia, txt_tempo, atencao, resumo) {
                        try {
                            var _distancia = distancia / 1000;

                            _acaoPreencheDistancia(_distancia, tempo, atencao, resumo, dados);
                        }
                        catch (e) {
                            _acaoPreencheDistancia(0, '', '', '', dados);

                            dialog.MensagemDeErro('N&atilde;o foi poss&iacute;vel obter a dist&acirc;ncia entre os 2 endere&ccedil;os pelo <b>google maps</b><br />Altere a quantidade (Km) <b>manualmente</b>', btn.getId());
                        }
                    };

                    gm.set_SUCESSO(_SUCESSO_MAPS);

                    gm.CALCULA_ROTA();
                }
                catch (e) {
                    _acaoPreencheDistancia(0, '', '', '', dados);

                    dialog.MensagemDeErro('N&atilde;o foi poss&iacute;vel obter a dist&acirc;ncia entre os 2 endere&ccedil;os pelo <b>google maps</b><br />Altere a quantidade (Km) <b>manualmente</b>', btn.getId());
                }
                wJanela.hide();
            }
        }]
    });

    var wJanela = new Ext.Window({
        layout: 'form',
        title: 'Alterar o endere&ccedil;o de origem ou destino do servi&ccedil;o',
        width: 1010,
        height: 279,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [form1]
    });

    var _acaoPreencheDistancia;

    this.acaoPreencheDistancia = function (pValue) {
        _acaoPreencheDistancia = pValue;
    };

    this.set_ENDERECO_ORIGEM = function (pValue) {
        TXT_ENDERECO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_NUMERO_ORIGEM = function (pValue) {
        return TXT_NUMERO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_COMPLEMENTO_ORIGEM = function (pValue) {
        return TXT_COMPL_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CEP_ORIGEM = function (pValue) {
        return TXT_CEP_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CIDADE_ORIGEM = function (pValue) {
        return TXT_CIDADE_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_ESTADO_ORIGEM = function (pValue) {
        return TXT_ESTADO_INICIAL_ITEM_ORCAMENTO.setValue(pValue);
    };


    this.set_ENDERECO_DESTINO = function (pValue) {
        TXT_ENDERECO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_NUMERO_DESTINO = function (pValue) {
        return TXT_NUMERO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_COMPLEMENTO_DESTINO = function (pValue) {
        return TXT_COMPL_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CEP_DESTINO = function (pValue) {
        return TXT_CEP_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_CIDADE_DESTINO = function (pValue) {
        return TXT_CIDADE_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    this.set_ESTADO_DESTINO = function (pValue) {
        return TXT_ESTADO_FINAL_ITEM_ORCAMENTO.setValue(pValue);
    };

    ///

    this.show = function (elm) {
        wJanela.show(elm.getId());
    };
}

// Ciclistas

function janela_Servico_Ciclista() {

    var _record = new Array();

    this.record = function (pValue) {
        _record = pValue;
    };

    this.getRecord = function () {
        return _record;
    };

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
        columns: [
        checkBoxSM_,
        { id: 'SERVICO', header: "Servi&ccedil;o", width: 60, sortable: true, dataIndex: 'SERVICO', renderer: possuiServico, align: 'center' },
        { id: 'NOME_CICLISTA', header: "Ciclista", width: 250, sortable: true, dataIndex: 'NOME_CICLISTA' },
        ],
        stripeRows: true,
        height: 270,
        width: '100%',

        sm: checkBoxSM_
    });

    var toolbar1 = new Ext.Toolbar({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'small',
            handler: function (btn) {
                salvaServico(btn);
            }
        }, '-', {
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_16.gif',
            scale: 'small',
            handler: function (btn) {
                deletaServico(btn);
            }
        }]
    });

    var wFILTRO = new Ext.Window({
        layout: 'form',
        title: 'Ciclistas associados no(s) item(s) de servi&ccedil;o(s) selecionado(s)',
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

        var arr1 = new Array();
        var arr2 = new Array();

        for (var i = 0; i < _record.length; i++) {
            arr1[i] = _record[i].data.NUMERO_PEDIDO;
            arr2[i] = _record[i].data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Carrega_Ciclista_Servico');
        _ajax.setJsonData({
            NUMEROS_PEDIDO: arr1,
            NUMEROS_ITEM: arr2,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);

            var ciclistas = false;

            for (var i = 0; i < store1.getCount(); i++) {
                var rec = store1.getAt(i);

                if (rec.data.SERVICO == 1) {
                    ciclistas = true;
                }
            }

            for (var i = 0; i < _record.length; i++) {
                _record[i].beginEdit();
                _record[i].set('CICLISTA', ciclistas ? 1 : 0);
                _record[i].endEdit();
                _record[i].commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function salvaServico(btn) {

        var Arr1 = new Array();

        for (var i = 0; i < grid1.getSelectionModel().selections.length; i++) {
            Arr1[i] = grid1.getSelectionModel().selections.items[i].data.ID_CICLISTA;
        }

        var arr1 = new Array();
        var arr2 = new Array();

        for (var i = 0; i < _record.length; i++) {
            arr1[i] = _record[i].data.NUMERO_PEDIDO;
            arr2[i] = _record[i].data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SERVICO_CICLISTA.asmx/GravaNovoServico');
        _ajax.setJsonData({
            NUMEROS_PEDIDO: arr1,
            NUMEROS_ITEM: arr2,
            IDS_CICLISTAS: Arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            carregaGrid();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function deletaServico(btn) {
        if (grid1.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione 1 ou mais ciclistas para deletar do servi&ccedil;o', btn.getId());
            return;
        }

        var Arr1 = new Array();

        var arr1 = new Array();
        var arr2 = new Array();

        for (var i = 0; i < _record.length; i++) {
            arr1[i] = _record[i].data.NUMERO_PEDIDO;
            arr2[i] = _record[i].data.NUMERO_ITEM;
        }

        for (var i = 0; i < grid1.getSelectionModel().selections.length; i++) {
            Arr1[i] = grid1.getSelectionModel().selections.items[i].data.ID_CICLISTA;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SERVICO_CICLISTA.asmx/DeletaServicoCiclista');
        _ajax.setJsonData({
            NUMEROS_PEDIDO: arr1,
            NUMEROS_ITEM: arr2,
            IDS_CICLISTAS: Arr1,
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

        _shown = true;

        carregaGrid();
    };
}
