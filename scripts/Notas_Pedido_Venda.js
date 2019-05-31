function Janela_Notas_Pedido_Venda() {

    var _NUMERO_PEDIDO;
    var _ITENS_PEDIDO;

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.ITENS_PEDIDO = function (pITENS_PEDIDO) {
        _ITENS_PEDIDO = pITENS_PEDIDO;
    };

    ///////////////////////

    var TB_NOTA_SAIDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'

        }, ['NUMERO_SEQ', 'NUMERO_NF', 'SERIE_NF', 'CODIGO_CLIENTE_NF', 'NOME_CLIENTE_NF', 'NOME_FANTASIA_CLIENTE_NF',
        'CNPJ_CLIENTE_NF', 'DATA_EMISSAO_NF', 'TOTAL_NF', 'BASE_ISS_NF', 'VALOR_ISS_NF',
        'TOTAL_SERVICOS_NF', 'NUMERO_PEDIDO_NF', 'STATUS_NF',
        'EMITIDA_NF', 'CANCELADA_NF', 'TELEFONE_CLIENTE_NF', 'COND_PAGTO']
       )
    });

    function status_nf(val) {
        if (val == 1)
            return "<span style='width: 100%; height: 100%; background-color: #000066; color: #FFFFFF;'>NF Cadastrada</span>";
        else if (val == 2)
            return "<span style='width: 100%; height: 100%; background-color: #339966; color: #FFFFFF;'>NF Emitida</span>";
        else if (val == 3)
            return "<span style='width: 100%; height: 100%; background-color: #990000; color: #FFFFFF;'>NF Cancelada</span>";
        else if (val == 4)
            return "<span style='width: 100%; height: 100%; background-color: #FF3300; color: #FFFFFF;'>Nota Eletr&ocirc;nica</span>";
    }

    function Emitida_nf(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    function Cancelada_nf(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    var gridNotaSaida = new Ext.grid.GridPanel({
        store: TB_NOTA_SAIDA_Store,
        columns: [
        { id: 'STATUS_NF', header: "Status", width: 110, sortable: true, dataIndex: 'STATUS_NF', renderer: status_nf },
        { id: 'NUMERO_SEQ', header: "Sequencia", width: 90, sortable: true, dataIndex: 'NUMERO_SEQ', hidden: true },
        { id: 'NUMERO_NF', header: "Numero NF", width: 90, sortable: true, dataIndex: 'NUMERO_NF' },
        { id: 'SERIE_NF', header: "S&eacute;rie", width: 80, sortable: true, dataIndex: 'SERIE_NF', hidden: true },
        { id: 'DATA_EMISSAO_NF', header: "Data de Emiss&atilde;o", width: 140, sortable: true, dataIndex: 'DATA_EMISSAO_NF', renderer: XMLParseDateTime },
        { id: 'CODIGO_CLIENTE_NF', header: "C&oacute;digo do Cliente", width: 120, sortable: true, dataIndex: 'CODIGO_CLIENTE_NF', hidden: true },
        { id: 'NOME_FANTASIA_CLIENTE_NF', header: "Nome Fantasia", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_CLIENTE_NF', hidden: true },
        { id: 'NOME_CLIENTE_NF', header: "Raz&atilde;o Social do Cliente", width: 280, sortable: true, dataIndex: 'NOME_CLIENTE_NF' },
        { id: 'TELEFONE_CLIENTE_NF', header: "Telefone", width: 120, sortable: true, dataIndex: 'TELEFONE_CLIENTE_NF', hidden: true },

        { id: 'TOTAL_SERVICOS_NF', header: "Total dos Servi&ccedil;os", width: 130, sortable: true, dataIndex: 'TOTAL_SERVICOS_NF', renderer: FormataValor, align: 'right' },

        { id: 'TOTAL_NF', header: "Total da Nota Fiscal", width: 130, sortable: true, dataIndex: 'TOTAL_NF', renderer: FormataValor, align: 'right' },
        { id: 'VALOR_ISS_NF', header: "Total de ISS", width: 130, sortable: true, dataIndex: 'VALOR_ISS_NF', renderer: FormataValor, align: 'right' },
        { id: 'COND_PAGTO', header: "Cond. Pagto.", width: 150, sortable: true, dataIndex: 'COND_PAGTO' },
        { id: 'NUMERO_PEDIDO_NF', header: "Numero Pedido", width: 90, sortable: true, dataIndex: 'NUMERO_PEDIDO_NF', hidden: true },
        { id: 'EMITIDA_NF', header: "Nota Emitida", width: 90, sortable: true, dataIndex: 'EMITIDA_NF', hidden: true, renderer: Emitida_nf },
        { id: 'CANCELADA_NF', header: "Nota Cancelada", width: 90, sortable: true, dataIndex: 'CANCELADA_NF', hidden: true, renderer: Cancelada_nf }
    ],
        stripeRows: true,
        height: 230,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (s, Index, record) {
                    gridItemNotaSaida.getStore().removeAll();
                    NotaItemSaidaPagingToolbar.Desabilita();
                }
            }
        }),

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record);
            },
            rowclick: function (grid, rowIndex, e) {
                gridItemNotaSaida.getStore().removeAll();
                NotaItemSaidaPagingToolbar.Desabilita();
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    var record = this.getSelectionModel().getSelected();
                    CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record);
                }
            }
        }
    });

    function RetornaNotaSaidaJsonData() {
        var _JsonData = {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            NUMERO_ITEM: _ITENS_PEDIDO,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    function RetornaNotaSaida2JsonData() {
        var _JsonData = {
            EMISSAO1: TXT_EMISSAO1.getRawValue(),
            EMISSAO2: TXT_EMISSAO2.getRawValue(),
            CLIENTE: TXT_CLIENTE.getValue(),
            ID_VENDEDOR: _ID_VENDEDOR,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaSaidaPagingToolbar = new Th2_PagingToolbar();
    NotaSaidaPagingToolbar.setStore(TB_NOTA_SAIDA_Store);

    function CARREGA_GRID_NOTAS_FISCAIS_SAIDA() {
        gridItemNotaSaida.getStore().removeAll();

        NotaSaidaPagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Notas_do_Pedido');
        NotaSaidaPagingToolbar.setParamsJsonData(RetornaNotaSaidaJsonData());

        var _instrucoes = function () {
            gridItemNotaSaida.getStore().removeAll();
            NotaItemSaidaPagingToolbar.Desabilita();
        };

        NotaSaidaPagingToolbar.onPageChange(_instrucoes);

        NotaSaidaPagingToolbar.doRequest();
    }

    function CARREGA_GRID_NOTAS_FISCAIS_VENDEDOR() {
        gridItemNotaSaida.getStore().removeAll();

        NotaSaidaPagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Notas_do_Vendedor');
        NotaSaidaPagingToolbar.setParamsJsonData(RetornaNotaSaida2JsonData());

        var _instrucoes = function () {
            gridItemNotaSaida.getStore().removeAll();
            NotaItemSaidaPagingToolbar.Desabilita();
        };

        NotaSaidaPagingToolbar.onPageChange(_instrucoes);

        NotaSaidaPagingToolbar.doRequest();
    }

    var pNotasFiscais = new Ext.Panel({
        title: 'Notas Fiscais',
        width: '100%',
        autoScroll: true,
        items: [gridNotaSaida, NotaSaidaPagingToolbar.PagingToolbar()]
    });

    /////////////////////////////////
    var TB_ITEM_NOTA_SAIDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ITEM_NF', 'SEQUENCIA_ITEM_NF', 'CODIGO_PRODUTO_ITEM_NF', 'DESCRICAO_PRODUTO_ITEM_NF', 
        'UNIDADE_MEDIDA_ITEM_NF', 'QTDE_ITEM_NF', 'VALOR_UNITARIO_ITEM_NF', 'VALOR_DESCONTO_ITEM_NF',
        'VALOR_TOTAL_ITEM_NF', 'ALIQ_ISS_ITEM_NF', 'BASE_ISS_ITEM_NF', 'VALOR_ISS_ITEM_NF', 'CODIGO_ITEM_CLIENTE',
        'NUMERO_PEDIDO_ITEM_NF', 'NUMERO_PEDIDO_VENDA']
       )
    });

    var gridItemNotaSaida = new Ext.grid.GridPanel({
        store: TB_ITEM_NOTA_SAIDA_Store,
        columns: [
        { id: 'NUMERO_ITEM_NF', header: "NF", width: 90, sortable: true, dataIndex: 'NUMERO_ITEM_NF', hidden: true },
        { id: 'SEQUENCIA_ITEM_NF', header: "Item", width: 90, sortable: true, dataIndex: 'SEQUENCIA_ITEM_NF', hidden: true },
        { id: 'CODIGO_PRODUTO_ITEM_NF', header: "C&oacute;digo de Produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_ITEM_NF' },
        { id: 'DESCRICAO_PRODUTO_ITEM_NF', header: "Descri&ccedil;&atilde;o do Produto", width: 330, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_NF', hidden: true },
        { id: 'UNIDADE_MEDIDA_ITEM_NF', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_ITEM_NF', align: 'center' },
        { id: 'QTDE_ITEM_NF', header: "Qtde", width: 90, sortable: true, dataIndex: 'QTDE_ITEM_NF', renderer: FormataQtde, align: 'center' },
        { id: 'VALOR_UNITARIO_ITEM_NF', header: "Valor Unit&aacute;rio", width: 120, sortable: true, dataIndex: 'VALOR_UNITARIO_ITEM_NF', renderer: FormataValor_4, align: 'right' },
        { id: 'VALOR_DESCONTO_ITEM_NF', header: "Valor Desconto", width: 120, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_NF', renderer: FormataValor, hidden: true },
        { id: 'VALOR_TOTAL_ITEM_NF', header: "Total do Item", width: 130, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_NF', renderer: FormataValor, align: 'right' },
        { id: 'ALIQ_ISS_ITEM_NF', header: "Aliq. ISS", width: 60, sortable: true, dataIndex: 'ALIQ_ISS_ITEM_NF', renderer: FormataPercentual, align: 'center' },
        { id: 'BASE_ISS_ITEM_NF', header: "Base ISS", width: 120, sortable: true, dataIndex: 'BASE_ISS_ITEM_NF', renderer: FormataValor, hidden: true, align: 'right' },
        { id: 'VALOR_ISS_ITEM_NF', header: "Valor ISS", width: 120, sortable: true, dataIndex: 'VALOR_ISS_ITEM_NF', renderer: FormataValor, align: 'right' },
        { id: 'NUMERO_PEDIDO_ITEM_NF', header: "Nr. do Pedido", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_NF' },
        { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. O.S. Interna", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA' }

    ],
        stripeRows: true,
        height: 196,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaItemNotaSaidaJsonData(record) {
        var _numero = record ? record.data.NUMERO_SEQ : 0;

        var _JsonData = {
            NUMERO_ITEM_NF: _numero,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaItemSaidaPagingToolbar = new Th2_PagingToolbar();
    NotaItemSaidaPagingToolbar.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Carrega_ItensNotaSaida');
    NotaItemSaidaPagingToolbar.setStore(TB_ITEM_NOTA_SAIDA_Store);

    function CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record) {
        NotaItemSaidaPagingToolbar.setParamsJsonData(RetornaItemNotaSaidaJsonData(record));
        NotaItemSaidaPagingToolbar.doRequest();
    }

    var pItensNotasFiscais = new Ext.Panel({
        title: 'Itens de Notas Fiscais',
        width: '100%',
        layout: 'anchor',
        autoScroll: true,
        items: [gridItemNotaSaida, NotaItemSaidaPagingToolbar.PagingToolbar()]
    });

    //////////////////

    var dt1 = new Date();

    var TXT_EMISSAO1 = new Ext.form.DateField({
        width: 94,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_VENDEDOR();
                }
            }
        }
    });

    var TXT_EMISSAO2 = new Ext.form.DateField({
        width: 94,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_VENDEDOR();
                }
            }
        }
    });

    TXT_EMISSAO1.setValue(dt1.getFirstDateOfMonth());
    TXT_EMISSAO2.setValue(dt1.getLastDateOfMonth());

    var TXT_CLIENTE = new Ext.form.TextField({
        width: 220,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_VENDEDOR();
                }
            }
        }
    });

    var BTN_BUSCAR1 = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            CARREGA_GRID_NOTAS_FISCAIS_VENDEDOR();
        }
    });

    var wNOTAS_PEDIDO = new Ext.Window({
        layout: 'form',
        title: 'Notas Fiscais',
        iconCls: 'icone_TB_NOTA_SAIDA',
        width: 1100,
        height: 600,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        renderTo: Ext.getBody(),
        modal: true,
        items: [{
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .08,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Emissão de:'
            }, {
                columnWidth: .11,
                items: [TXT_EMISSAO1]
            }, {
                columnWidth: .03,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'até:'
            }, {
                columnWidth: .12,
                items: [TXT_EMISSAO2]
            }, {
                columnWidth: .06,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Cliente:'
            }, {
                columnWidth: .25,
                items: [TXT_CLIENTE]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [BTN_BUSCAR1]
            }]
        }, pNotasFiscais, pItensNotasFiscais],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        if (_NUMERO_PEDIDO > 0) {
            CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
            TB_ITEM_NOTA_SAIDA_Store.removeAll();
        }

        wNOTAS_PEDIDO.show(elm);
    };
}