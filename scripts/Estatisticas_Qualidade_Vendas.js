function Estatisticas_Qualidade_Vendas() {

    var mapa = new Relacao_Mapa_Trabalho();

    var Indicadores_Store = new Ext.data.ArrayStore({
        fields: ['quesito', 'total']
    });

    var TXT_DATA_INICIAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas_Qualidade()
                }
            }
        }
    });

    var TXT_DATA_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas_Qualidade();
                }
            }
        }
    });

    var TXT_CLIENTE = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'C&oacute;d. Cliente',
        width: 40,
        value: 0,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas_Qualidade();
                }
            }
        }
    });

    var dt1 = new Date();

    TXT_DATA_INICIAL.setValue(dt1.getFirstDateOfMonth());
    TXT_DATA_FINAL.setValue(dt1.getLastDateOfMonth());

    function Calcula_Estatisticas_Qualidade_Primeiro_Load() {
        if (!TXT_CLIENTE.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/QUALIDADE_VENDAS.asmx/Carrega_Estatisticas_Qualidade');
        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                data.push(x);
            }

            Indicadores_Store.loadData(data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Calcula_Estatisticas_Qualidade() {
        if (!TXT_CLIENTE.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/QUALIDADE_VENDAS.asmx/Carrega_Estatisticas_Qualidade');
        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                data.push(x);
            }

            Indicadores_Store.loadData(data, false);

            if (pEstatisticas_Qualidade.activeTab.title == 'Total de Vendas no Per&iacute;odo (Emiss&atilde;o)') {
                Carrega_Curva_ABC();
            }
            else if (pEstatisticas_Qualidade.activeTab.title == 'Quantidades Menores no Per&iacute;odo (Entrega)') {
                Carrega_Quantidades_Menores();
            }
            else if (pEstatisticas_Qualidade.activeTab.title == 'Margem Inferior no Per&iacute;odo (Emiss&atilde;o)') {
                Carrega_Margem_Abaixo();
            }
            else if (pEstatisticas_Qualidade.activeTab.title == 'Inadimpl&ecirc;ncia') {
                Carrega_Inadimplencia();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////////

    var pTotal_Qualidade_Vendas = new Ext.Panel({
        width: '100%',
        height: 300,
        frame: true,
        title: 'An&aacute;lise de Qualidade de Vendas',
        tbar: [{
            text: 'Atualizar',
            icon: 'imagens/icones/statistic_reload_16.gif',
            handler: function () {
                Calcula_Estatisticas_Qualidade();
            }
        }],
        items: {
            xtype: 'columnchart',
            id: 'chartX',
            store: Indicadores_Store,
            yField: 'total',
            xField: 'quesito',
            listeners: {
                itemclick: function (o) {
                    if (o.item.quesito.indexOf('Vendas') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(0);
                        Carrega_Curva_ABC();
                    }

                    if (o.item.quesito.indexOf('Atrasada') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(1);
                        Carrega_ENTREGA_ATRASADA();
                    }

                    if (o.item.quesito.indexOf('Menores') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(2);
                        Carrega_Quantidades_Menores();
                    }

                    if (o.item.quesito.indexOf('Margem') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(3);
                        Carrega_Margem_Abaixo();
                    }

                    if (o.item.quesito.indexOf('Inadimpl') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(4);
                    }
                }
            },
            xAxis: new Ext.chart.CategoryAxis({
                title: ''
            }),
            yAxis: new Ext.chart.NumericAxis({
                color: 0x69aBc8
            }),
            tipRenderer: function (chart, record, index, series) {

            },
            extraStyle: {
                xAxis: {
                    labelRotation: 0
                }
            },
            series: [{
                type: 'column',
                displayName: 'Indicadores de Qualidade',
                yField: 'total',
                style: {
                    image: 'bar.gif',
                    mode: 'stretch',
                    color: 0xca6a0b
                }
            }]
        }
    });

    //// Curva ABC

    var CURVA_ABC_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['NOME_CLIENTE', 'TOTAL', 'POSICAO', 'REPRESENTACAO', 'NOME_VENDEDOR']
                    )
    });

    var gridABC_Clientes = new Ext.grid.GridPanel({
        store: CURVA_ABC_Store,
        columns: [
                    { id: 'POSICAO', header: "Posi&ccedil;&atilde;o", width: 80, sortable: true, dataIndex: 'POSICAO' },
                    { id: 'NOME_CLIENTE', header: "Cliente", width: 400, sortable: true, dataIndex: 'NOME_CLIENTE' },
                    { id: 'TOTAL', header: "Total de Vendas", width: 130, sortable: true, dataIndex: 'TOTAL', renderer: FormataValor, align: 'right' },
                    { id: 'REPRESENTACAO', header: "% Representa&ccedil;&atilde;o", width: 110, sortable: true, dataIndex: 'REPRESENTACAO', renderer: FormataPercentual, align: 'center' },
                    { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 190, sortable: true, dataIndex: 'NOME_VENDEDOR' }
                    ],
        stripeRows: true,
        anchor: '100%',
        width: '100%',
        height: 200,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var CURVA_ABC_PagingToolbar = new Th2_PagingToolbar();

    CURVA_ABC_PagingToolbar.setUrl('servicos/QUALIDADE_VENDAS.asmx/Calcula_Curva_ABC_Clientes');
    CURVA_ABC_PagingToolbar.setStore(CURVA_ABC_Store);

    function RetornaFiltros_ABC_JsonData() {

        var TB_TRANSP_JsonData = {
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: CURVA_ABC_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Curva_ABC() {
        CURVA_ABC_PagingToolbar.setParamsJsonData(RetornaFiltros_ABC_JsonData());
        CURVA_ABC_PagingToolbar.doRequest();
    }

    ///////////////

    // Entregas atrasadas
    var PEDIDO_VENDA_Store = new Ext.data.Store({
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
                'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA'
]
           )
    });

    var grid_Entrega_Atrasada = new Ext.grid.GridPanel({
        store: PEDIDO_VENDA_Store,
        tbar: [{
            text: 'Imprimir Relat&oacute;rio de entregas atrasadas',
            icon: 'imagens/icones/copy_remove_16.gif',
            scale: 'small',
            handler: function () {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/QUALIDADE_VENDAS.asmx/Relatorio_Faturamento_Atrasado');
                _ajax.setJsonData({ ID_EMPRESA: _ID_EMPRESA, ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    window.open(result, '_blank', 'width=1000,height=800');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, {
            text: 'Mapa de trabalho',
            icon: 'imagens/icones/document_write_16.gif',
            scale: 'small',
            listeners: {
                click: function (e) {
                    mapa.show(e.getId());
                }
            }
        }],
        columns: [
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'right', renderer: FormataQtde },
            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_PEDIDO', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', header: "Valor ICMS ST", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_PEDIDO', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_PEDIDO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_PEDIDO' }

        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var Entrega_Atrasada_PagingToolbar = new Th2_PagingToolbar();

    Entrega_Atrasada_PagingToolbar.setUrl('servicos/QUALIDADE_VENDAS.asmx/Entregas_Atrasadas');
    Entrega_Atrasada_PagingToolbar.setStore(PEDIDO_VENDA_Store);

    function RetornaFiltros_PEDIDOS_JsonData() {
        var TB_TRANSP_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Entrega_Atrasada_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ENTREGA_ATRASADA() {
        Entrega_Atrasada_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
        Entrega_Atrasada_PagingToolbar.doRequest();
    }

    function Relacao_Mapa_Trabalho() {

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

        var BTN_OK_NOTA = new Ext.Button({
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
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [TXT_DATAF1]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [TXT_DATAF2]
                }, {
                    columnWidth: .20,
                    items: [BTN_OK_NOTA]
                }]
            }]
        });

        function Lista_Relatorio() {
            if (!form1.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Relatorio_Mapa_Trabalho');
            _ajax.setJsonData({
                data1: TXT_DATAF1.getRawValue(),
                data2: TXT_DATAF2.getRawValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                wLista.hide();

                var result = Ext.decode(response.responseText).d;
                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var wLista = new Ext.Window({
            layout: 'form',
            title: 'Relat&oacute;rio do mapa de trabalho',
            iconCls: 'icone_TB_COTACAO1',
            width: 400,
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

    ///////////////////

    // Quantidades Menores

    var QM_Store = new Ext.data.Store({
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
                'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA'
]
           )
    });

    var grid_QM = new Ext.grid.GridPanel({
        store: QM_Store,
        columns: [
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'right', renderer: FormataQtde },
            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_PEDIDO', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', header: "Valor ICMS ST", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_PEDIDO', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_PEDIDO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_PEDIDO' }

        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var QM_PagingToolbar = new Th2_PagingToolbar();

    QM_PagingToolbar.setUrl('servicos/QUALIDADE_VENDAS.asmx/Quantidades_Menores');
    QM_PagingToolbar.setStore(QM_Store);

    function QM_JsonData() {
        var TB_TRANSP_JsonData = {
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: QM_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Quantidades_Menores() {
        QM_PagingToolbar.setParamsJsonData(QM_JsonData());
        QM_PagingToolbar.doRequest();
    }

    ///////////////////

    // Margem Abaixo
    var MA_Store = new Ext.data.Store({
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
                'STATUS_ESPECIFICO', 'QTDE_FATURADA', 'ATRASADA'
]
           )
    });

    var grid_MA = new Ext.grid.GridPanel({
        store: MA_Store,
        columns: [
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'right', renderer: FormataQtde },
            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'CUSTO_TOTAL_ITEM_PEDIDO', header: "Custo", width: 80, sortable: true, dataIndex: 'CUSTO_TOTAL_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'MARGEM_VENDA_ITEM_PEDIDO', header: "Margem", width: 80, sortable: true, dataIndex: 'MARGEM_VENDA_ITEM_PEDIDO', renderer: FormataPercentualMargem, align: 'center' },
            { id: 'PRECO_ITEM_PEDIDO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_PEDIDO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_PEDIDO', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_PEDIDO', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', header: "Valor ICMS ST", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_PEDIDO', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_PEDIDO', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_PEDIDO', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_PEDIDO', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_PEDIDO', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_PEDIDO' }

        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var MA_PagingToolbar = new Th2_PagingToolbar();

    MA_PagingToolbar.setUrl('servicos/QUALIDADE_VENDAS.asmx/MargemAbaixo');
    MA_PagingToolbar.setStore(MA_Store);

    function MA_JsonData() {
        var TB_TRANSP_JsonData = {
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: QM_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Margem_Abaixo() {
        MA_PagingToolbar.setParamsJsonData(MA_JsonData());
        MA_PagingToolbar.doRequest();
    }

    //////////////////

    // Inadimplência
    var INADIMPLENCIA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NOMEFANTASIA_CLIENTE', 'CIDADE', 'UF', 'TELEFONE', 'VALOR_LIMITE', 'VALOR_EM_ABERTO', 'TOTAL_VENCIDO', 'CONTATOS']
           )
    });

    var DS_LIMITE_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '{CONTATOS}'
        )
    });

    function LimiteExcedido(val, _metadata, _record) {
        var formato = FormataValor(val);

        var _limite = parseFloat(_record.data.VALOR_LIMITE);
        var _emAberto = parseFloat(val);

        if (_limite < _emAberto) {
            var str1 = "<span style='color: red; font-family: Tahoma;' title='Total a Vencer + Pedidos em Andamento'>";

            var str2 = formato.substr(0, formato.indexOf(">") + 1) + str1 +
            formato.substr(formato.indexOf(">") + 1, formato.lastIndexOf("<")) +
            "</span>" + formato.substr(formato.lastIndexOf("<"));

            str2 = str2.replace("</div></span>", "</span>");
            return str2;
        }
        else {
            return formato;
        }
    }

    function haVencidos(val) {
        var formato = FormataValor(val);

        var _vencido = parseFloat(val);

        if (_vencido > 0.00)
            return "<span style='color:red; font-family: Tahoma;'>" + formato + "</span>";
        else
            return formato;
    }

    var grid_INADIMPLENCIA = new Ext.grid.GridPanel({
        store: INADIMPLENCIA_Store,
        columns: [DS_LIMITE_expander,
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 220, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
            { id: 'CIDADE', header: "Cidade", width: 220, sortable: true, dataIndex: 'CIDADE' },
            { id: 'UF', header: "UF", width: 50, sortable: true, dataIndex: 'UF' },
            { id: 'TELEFONE', header: "Telefone", width: 190, sortable: true, dataIndex: 'TELEFONE' },
            { id: 'VALOR_LIMITE', header: "Limite de Cr&eacute;dito", width: 110, sortable: true, dataIndex: 'VALOR_LIMITE', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_EM_ABERTO', header: "Total em Aberto", width: 110, sortable: true, dataIndex: 'VALOR_EM_ABERTO', renderer: LimiteExcedido, align: 'right' },
            { id: 'TOTAL_VENCIDO', header: "Total Vencido", width: 110, sortable: true, dataIndex: 'TOTAL_VENCIDO', renderer: haVencidos, align: 'right' }
            ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        plugins: DS_LIMITE_expander
    });

    var I_PagingToolbar = new Th2_PagingToolbar();

    I_PagingToolbar.setUrl('servicos/QUALIDADE_VENDAS.asmx/Carrega_Inadimplencia');
    I_PagingToolbar.setStore(INADIMPLENCIA_Store);

    function I_JsonData() {
        var TB_TRANSP_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            ID_EMPRESA: _ID_EMPRESA,
            start: 0,
            limit: I_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Inadimplencia() {
        I_PagingToolbar.setParamsJsonData(I_JsonData());
        I_PagingToolbar.doRequest();
    }

    ///////////////

    var pEstatisticas_Qualidade = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,
        defaults: { hideMode: 'offsets' },
        height: 300,
        items: [{
            title: 'Total de Vendas no Per&iacute;odo (Emiss&atilde;o)',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [gridABC_Clientes, CURVA_ABC_PagingToolbar.PagingToolbar()]
        }, {
            title: 'Entrega Atrasada',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [grid_Entrega_Atrasada, Entrega_Atrasada_PagingToolbar.PagingToolbar()]
        }, {
            title: 'Quantidades Menores no Per&iacute;odo (Entrega)',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [grid_QM, QM_PagingToolbar.PagingToolbar()]
        }, {
            title: 'Margem Inferior no Per&iacute;odo (Emiss&atilde;o)',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [grid_MA, MA_PagingToolbar.PagingToolbar()]
        }, {
            title: 'Inadimpl&ecirc;ncia',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [grid_INADIMPLENCIA, I_PagingToolbar.PagingToolbar()]
        }],
        listeners: {
            tabchange: function (p, tab) {
                if (tab.title == 'Total de Vendas no Per&iacute;odo (Emiss&atilde;o)') {
                    Carrega_Curva_ABC();
                }
                else if (tab.title == 'Entrega Atrasada') {
                    Carrega_ENTREGA_ATRASADA();
                }
                else if (tab.title == 'Quantidades Menores no Per&iacute;odo (Entrega)') {
                    Carrega_Quantidades_Menores();
                }
                else if (tab.title == 'Margem Inferior no Per&iacute;odo (Emiss&atilde;o)') {
                    Carrega_Margem_Abaixo();
                }
                else if (tab.title == 'Inadimpl&ecirc;ncia') {
                    Carrega_Inadimplencia();
                }
            }
        }
    });

    Calcula_Estatisticas_Qualidade_Primeiro_Load();

    var panelCharts = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                labelWidth: 65,
                items: [TXT_DATA_INICIAL]
            }, {
                columnWidth: .18,
                labelWidth: 60,
                layout: 'form',
                items: [TXT_DATA_FINAL]
            }]
        }, pTotal_Qualidade_Vendas, pEstatisticas_Qualidade]
    });

    pTotal_Qualidade_Vendas.setHeight(AlturaDoPainelDeConteudo(68) / 2);
    pEstatisticas_Qualidade.setHeight(AlturaDoPainelDeConteudo(67) / 2);

    gridABC_Clientes.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_Entrega_Atrasada.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_QM.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_MA.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_INADIMPLENCIA.setHeight(AlturaDoPainelDeConteudo(179) / 2);

    return panelCharts;
}