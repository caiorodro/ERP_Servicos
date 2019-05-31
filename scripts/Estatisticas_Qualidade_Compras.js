function Estatisticas_Qualidade_Compras() {

    var Indicadores_Compras_Store = new Ext.data.ArrayStore({
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

    var TXT_FORNECEDOR = new Ext.form.NumberField({
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
        if (!TXT_FORNECEDOR.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Carrega_Estatisticas_Qualidade');
        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                data.push(x);
            }

            Indicadores_Compras_Store.loadData(data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Calcula_Estatisticas_Qualidade() {
        if (!TXT_FORNECEDOR.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Carrega_Estatisticas_Qualidade');
        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                data.push(x);
            }

            Indicadores_Compras_Store.loadData(data, false);

            var tab = pEstatisticas_Qualidade.activeTab;

            if (tab.title == 'Total de Compras no Per&iacute;odo (Emiss&atilde;o)') {
                Carrega_Curva_ABC();
            }
            else if (tab.title == 'Entrega Atrasada') {
                Carrega_ENTREGA_ATRASADA();
            }
            else if (tab.title == 'Quantidades Menores no Per&iacute;odo (Entrega)') {
                Carrega_Quantidades_Menores();
            }
            else if (tab.title == 'Devolu&ccedil;&otilde;es') {
                CARREGA_GRID_NOTAS_FISCAIS_ENTRADA();
            }
            else if (tab.title == '') {
                CARREGA_GRID_DESCONTO();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////////

    var pTotal_QUALIDADE_COMPRAS = new Ext.Panel({
        width: '100%',
        height: 300,
        frame: true,
        title: 'An&aacute;lise de Qualidade de Compras',
        tbar: [{
            text: 'Atualizar',
            icon: 'imagens/icones/statistic_reload_16.gif',
            handler: function () {
                Calcula_Estatisticas_Qualidade();
            }
        }],
        items: {
            xtype: 'columnchart',
            id: 'chartCompras',
            store: Indicadores_Compras_Store,
            yField: 'total',
            xField: 'quesito',
            listeners: {
                itemclick: function (o) {
                    if (o.item.quesito.indexOf('Compras') > -1) {
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

                    if (o.item.quesito.indexOf('Devoluções') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(4);
                        CARREGA_GRID_NOTAS_FISCAIS_ENTRADA();
                    }

                    if (o.item.quesito.indexOf('Desconto') > -1) {
                        pEstatisticas_Qualidade.setActiveTab(5);
                        CARREGA_GRID_DESCONTO();
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
                    ['NOME_FORNECEDOR', 'TOTAL', 'POSICAO', 'REPRESENTACAO', 'PARTICIPACAO']
                    )
    });

    var gridABC_Fornecedores = new Ext.grid.GridPanel({
        store: CURVA_ABC_Store,
        columns: [
                    { id: 'POSICAO', header: "Posi&ccedil;&atilde;o", width: 80, sortable: true, dataIndex: 'POSICAO' },
                    { id: 'NOME_FORNECEDOR', header: "Fornecedor", width: 400, sortable: true, dataIndex: 'NOME_FORNECEDOR' },
                    { id: 'TOTAL', header: "Total de Compras", width: 130, sortable: true, dataIndex: 'TOTAL', renderer: FormataValor, align: 'right' },
                    { id: 'REPRESENTACAO', header: "% Representa&ccedil;&atilde;o", width: 110, sortable: true, dataIndex: 'REPRESENTACAO', renderer: FormataPercentual, align: 'center' },
                    { id: 'PARTICIPACAO', header: "% Participa&ccedil;&atilde;o", width: 120, sortable: true, dataIndex: 'PARTICIPACAO', renderer: FormataPercentual, align: 'center' }
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

    CURVA_ABC_PagingToolbar.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Calcula_Curva_ABC_Fornecedores');
    CURVA_ABC_PagingToolbar.setParamsJsonData(RetornaFiltros_ABC_JsonData());
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
    var PEDIDO_COMPRA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'STATUS_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
                    'COR_FONTE_STATUS_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_PEDIDO',
                    'CODIGO_PRODUTO_COMPRA', 'QTDE_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'QTDE_RECEBIDA',
                'DATA_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PRECO_ITEM_COMPRA', 'VALOR_TOTAL_ITEM_COMPRA', 'ALIQ_ICMS_ITEM_COMPRA',
                'VALOR_ICMS_ITEM_COMPRA', 'VALOR_ICMS_ST_ITEM_COMPRA', 'ALIQ_IPI_ITEM_COMPRA', 'VALOR_IPI_ITEM_COMPRA',
                'CODIGO_CFOP_ITEM_COMPRA', 'CODIGO_FORNECEDOR_ITEM_COMPRA', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
                'NUMERO_LOTE_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'OBS_ITEM_COMPRA',
                'CONTATO_COTACAO_FORNECEDOR', 'TELEFONE_COTACAO_FORNECEDOR', 'DESCRICAO_CP',
                'OBS_FORNECEDOR', 'EMAIL_COTACAO_FORNECEDOR', 'FRETE_COTACAO_FORNECEDOR',
                'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_ST', 'TOTAL_PEDIDO', 'VALOR_FRETE',
                'STATUS_ESPECIFICO_ITEM_COMPRA', 'QTDE_RECEBIDA', 'NUMEROS_NF', 'ATRASADA', 'ORDEM_COMPRA_FORNECEDOR',
                'QTDE_NF_ITEM_COMPRA'])
    });

    function FormataQtdeNF(val) {
        return val > 0.000 ?
                        "<span style='width: 100%; color: blue;' title='Qtde a ser gravada na NF'>" + FormataQtde(val) + "</span>" :
                        FormataQtde(val);
    }

    var grid_Entrega_Atrasada = new Ext.grid.GridPanel({
        store: PEDIDO_COMPRA_Store,
        columns: [
            { id: 'STATUS_ITEM_COMPRA', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_COMPRA', renderer: status_pedido_compra },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
            { id: 'DATA_ITEM_COMPRA', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
            { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 75, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: EntregaAtrasadaCompra, align: 'center' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },

            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', align: 'right', renderer: FormataQtde },
            { id: 'QTDE_RECEBIDA', header: "Qtde. Recebida", width: 100, sortable: true, dataIndex: 'QTDE_RECEBIDA', align: 'center', renderer: QtdeRecebida },
            { id: 'QTDE_NF_ITEM_COMPRA', header: "Qtde. NF", width: 80, sortable: true, dataIndex: 'QTDE_NF_ITEM_COMPRA', align: 'center', renderer: FormataQtdeNF },
            { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' },

            { id: 'PRECO_ITEM_COMPRA', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_COMPRA', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_COMPRA', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_COMPRA', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_ST_ITEM_COMPRA', header: "Valor ICMS ST", width: 105, sortable: true, dataIndex: 'VALOR_ICMS_ST_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_COMPRA', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_COMPRA', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_COMPRA' },

            { id: 'NUMEROS_NF', header: "Numero(s) NF(s)", width: 210, sortable: true, dataIndex: 'NUMEROS_NF' }
        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var Entrega_Atrasada_PagingToolbar = new Th2_PagingToolbar();

    Entrega_Atrasada_PagingToolbar.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Entregas_Atrasadas_Compras');
    Entrega_Atrasada_PagingToolbar.setStore(PEDIDO_COMPRA_Store);

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

    ///////////////////

    // Quantidades Menores

    var QM_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'STATUS_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
                    'COR_FONTE_STATUS_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_PEDIDO',
                    'CODIGO_PRODUTO_COMPRA', 'QTDE_ITEM_COMPRA', 'PREVISAO_ENTREGA_ITEM_COMPRA', 'QTDE_RECEBIDA',
                'DATA_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PRECO_ITEM_COMPRA', 'VALOR_TOTAL_ITEM_COMPRA', 'ALIQ_ICMS_ITEM_COMPRA',
                'VALOR_ICMS_ITEM_COMPRA', 'VALOR_ICMS_ST_ITEM_COMPRA', 'ALIQ_IPI_ITEM_COMPRA', 'VALOR_IPI_ITEM_COMPRA',
                'CODIGO_CFOP_ITEM_COMPRA', 'CODIGO_FORNECEDOR_ITEM_COMPRA', 'DESCRICAO_PRODUTO', 'DESCRICAO_COMPLEMENTO_PRODUTO',
                'NUMERO_LOTE_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'OBS_ITEM_COMPRA',
                'CONTATO_COTACAO_FORNECEDOR', 'TELEFONE_COTACAO_FORNECEDOR', 'DESCRICAO_CP',
                'OBS_FORNECEDOR', 'EMAIL_COTACAO_FORNECEDOR', 'FRETE_COTACAO_FORNECEDOR',
                'VALOR_TOTAL', 'VALOR_IPI', 'VALOR_ICMS', 'VALOR_ICMS_ST', 'TOTAL_PEDIDO', 'VALOR_FRETE',
                'STATUS_ESPECIFICO_ITEM_COMPRA', 'QTDE_RECEBIDA', 'NUMEROS_NF', 'ATRASADA', 'ORDEM_COMPRA_FORNECEDOR',
                'QTDE_NF_ITEM_COMPRA'])
    });

    var grid_QM = new Ext.grid.GridPanel({
        store: QM_Store,
        columns: [
            { id: 'STATUS_ITEM_COMPRA', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_COMPRA', renderer: status_pedido_compra },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
            { id: 'DATA_ITEM_COMPRA', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
            { id: 'PREVISAO_ENTREGA_ITEM_COMPRA', header: "Entrega", width: 75, sortable: true, dataIndex: 'PREVISAO_ENTREGA_ITEM_COMPRA', renderer: EntregaAtrasadaCompra, align: 'center' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },

            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', align: 'right', renderer: FormataQtde },
            { id: 'QTDE_RECEBIDA', header: "Qtde. Recebida", width: 100, sortable: true, dataIndex: 'QTDE_RECEBIDA', align: 'center', renderer: QtdeRecebida },
            { id: 'QTDE_NF_ITEM_COMPRA', header: "Qtde. NF", width: 80, sortable: true, dataIndex: 'QTDE_NF_ITEM_COMPRA', align: 'center', renderer: FormataQtdeNF },
            { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' },

            { id: 'PRECO_ITEM_COMPRA', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_ITEM_COMPRA', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL_ITEM_COMPRA', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS_ITEM_COMPRA', header: "Al&iacute;q.ICMS", width: 60, sortable: true, dataIndex: 'ALIQ_ICMS_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_ICMS_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_ST_ITEM_COMPRA', header: "Valor ICMS ST", width: 105, sortable: true, dataIndex: 'VALOR_ICMS_ST_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_IPI_ITEM_COMPRA', header: "Al&iacute;q.IPI", width: 60, sortable: true, dataIndex: 'ALIQ_IPI_ITEM_COMPRA', renderer: FormataPercentual, align: 'center' },
            { id: 'VALOR_IPI_ITEM_COMPRA', header: "Valor ICMS", width: 90, sortable: true, dataIndex: 'VALOR_ICMS_ITEM_COMPRA', renderer: FormataValor, align: 'right' },

            { id: 'CODIGO_CFOP_ITEM_COMPRA', header: "CFOP", width: 60, sortable: true, dataIndex: 'CODIGO_CFOP_ITEM_COMPRA' },

            { id: 'NUMEROS_NF', header: "Numero(s) NF(s)", width: 210, sortable: true, dataIndex: 'NUMEROS_NF' }
        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var QM_PagingToolbar = new Th2_PagingToolbar();

    QM_PagingToolbar.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Quantidades_Menores_Compras');
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

    // Devoluções de nota
    //////////////////
    var TB_NOTA_ENTRADA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_SEQ_NFE', 'NUMERO_NFE', 'SERIE_NFE', 'CODIGO_CFOP_NFE', 'CODIGO_FORNECEDOR', 'NOME_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR',
        'CNPJ_FORNECEDOR', 'DATA_EMISSAO_NFE', 'DATA_CHEGADA_NFE', 'TOTAL_NFE', 'BASE_ICMS_NFE', 'VALOR_ICMS_NFE', 'BASE_ICMS_SUBS_NFE', 'VALOR_ICMS_SUBS_NFE',
        'TOTAL_PRODUTOS_NFE', 'VALOR_FRETE_NFE', 'VALOR_SEGURO_NFE', 'OUTRAS_DESP_NFE', 'TOTAL_IPI_NFE', 'CANCELADA_NFE', 'STATUS_NFE']
       )
    });

    function Cancelada_nfe(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    function Status_NFE(val) {
        if (val == 1)
            return "<span style='width: 100%; height: 100%; background-color: #000066; color: #FFFFFF;'>NF Cadastrada</span>";
        else if (val == 2)
            return "<span style='width: 100%; height: 100%; background-color: #339966; color: #FFFFFF;'>NF Confirmada</span>";
        else if (val == 3)
            return "<span style='width: 100%; height: 100%; background-color: #990000; color: #FFFFFF;'>NF Cancelada</span>";
        else if (val == 4)
            return "<span style='width: 100%; height: 100%; background-color: #FF3300; color: #FFFFFF;'>NF Importada</span>";
    }

    var gridNotaEntrada = new Ext.grid.GridPanel({
        id: 'gridNotaEntrada',
        store: TB_NOTA_ENTRADA_Store,
        columns: [
        { id: 'STATUS_NFE', header: "Status", width: 100, sortable: true, dataIndex: 'STATUS_NFE', renderer: Status_NFE },
        { id: 'NUMERO_SEQ_NFE', header: "Sequencia", width: 80, sortable: true, dataIndex: 'NUMERO_SEQ_NFE', hidden: true },
        { id: 'NUMERO_NFE', header: "Numero NF", width: 90, sortable: true, dataIndex: 'NUMERO_NFE' },
        { id: 'SERIE_NFE', header: "S&eacute;rie", width: 70, sortable: true, dataIndex: 'SERIE_NFE' },
        { id: 'CODIGO_CFOP_NFE', header: "Nat. Opera&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'CODIGO_CFOP_NFE' },
        { id: 'DATA_EMISSAO_NFE', header: "Data de Emiss&atilde;o", width: 130, sortable: true, dataIndex: 'DATA_EMISSAO_NFE', renderer: XMLParseDateTime },
        { id: 'DATA_CHEGADA_NFE', header: "Data de Chegada", width: 130, sortable: true, dataIndex: 'DATA_CHEGADA_NFE', renderer: XMLParseDateTime },
        { id: 'CODIGO_FORNECEDOR', header: "C&oacute;digo do Fornecedor", width: 120, sortable: true, dataIndex: 'CODIGO_FORNECEDOR', hidden: true },
        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Nome Fantasia", width: 170, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR', hidden: true },
        { id: 'NOME_FORNECEDOR', header: "Raz&atilde;o Social do Fornecedor", width: 250, sortable: true, dataIndex: 'NOME_FORNECEDOR' },
        { id: 'TOTAL_PRODUTOS_NFE', header: "Total dos Produtos", width: 120, sortable: true, dataIndex: 'TOTAL_PRODUTOS_NFE', renderer: FormataValor },

        { id: 'TOTAL_NFE', header: "Total da Nota Fiscal", width: 130, sortable: true, dataIndex: 'TOTAL_NFE', renderer: FormataValor },
        { id: 'TOTAL_IPI_NFE', header: "Total de IPI", width: 130, sortable: true, dataIndex: 'TOTAL_IPI_NFE', hidden: true, renderer: FormataValor },
        { id: 'BASE_ICMS_NFE', header: "Base de ICMS", width: 130, sortable: true, dataIndex: 'BASE_ICMS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_ICMS_NFE', header: "Total de ICMS", width: 130, sortable: true, dataIndex: 'VALOR_ICMS_NFE', hidden: true, renderer: FormataValor },
        { id: 'BASE_ICMS_SUBS_NFE', header: "Base de ICMS ST", width: 130, sortable: true, dataIndex: 'BASE_ICMS_SUBS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_ICMS_SUBS_NFE', header: "Total de ICMS ST", width: 130, sortable: true, dataIndex: 'VALOR_ICMS_SUBS_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_FRETE_NFE', header: "Valor do Frete", width: 130, sortable: true, dataIndex: 'VALOR_FRETE_NFE', hidden: true, renderer: FormataValor },
        { id: 'VALOR_SEGURO_NFE', header: "Valor do Serguro", width: 130, sortable: true, dataIndex: 'VALOR_SEGURO_NFE', hidden: true, renderer: FormataValor },
        { id: 'OUTRAS_DESP_NFE', header: "Outras Despesas", width: 130, sortable: true, dataIndex: 'OUTRAS_DESP_NFE', hidden: true, renderer: FormataValor },
        { id: 'CANCELADA_NFE', header: "Cancelada", width: 90, sortable: true, dataIndex: 'CANCELADA_NFE', hidden: true, renderer: Cancelada_nfe }
    ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaNotaFornecedorJsonData() {

        var _JsonData = {
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: NotaEntradaPagingToolbar.getLinhasPorPagina()
        };

        return _JsonData;
    }

    var NotaEntradaPagingToolbar = new Th2_PagingToolbar();
    NotaEntradaPagingToolbar.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Notas_Devolucao');
    NotaEntradaPagingToolbar.setStore(TB_NOTA_ENTRADA_Store);

    function CARREGA_GRID_NOTAS_FISCAIS_ENTRADA() {
        NotaEntradaPagingToolbar.setParamsJsonData(RetornaNotaFornecedorJsonData());
        NotaEntradaPagingToolbar.doRequest();
    }

    ///////////////
    // Descontos no período
    ///////////////

    var Desconto_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'NOME_FANTASIA_FORNECEDOR', 'ID_PRODUTO_COMPRA', 'CODIGO_PRODUTO_COMPRA',
                'QTDE_ITEM_COMPRA', 'UNIDADE_ITEM_COMPRA', 'PRECO_FINAL_FORNECEDOR', 'TIPO_DESCONTO_ITEM_COMPRA', 'VALOR_DESCONTO_ITEM_COMPRA',
                'VALOR_TOTAL_ITEM_COMPRA', 'STATUS_ITEM_COMPRA', 'DESCRICAO_STATUS_PEDIDO_COMPRA', 'COR_STATUS_PEDIDO_COMPRA',
                    'COR_FONTE_STATUS_PEDIDO_COMPRA', 'DATA_ITEM_COMPRA']
       )
    });

    var grid_Desconto = new Ext.grid.GridPanel({
        store: Desconto_Store,
        columns: [
            { id: 'STATUS_ITEM_COMPRA', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_COMPRA', renderer: status_pedido_compra },
            { id: 'NUMERO_PEDIDO_COMPRA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
            { id: 'DATA_ITEM_COMPRA', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_ITEM_COMPRA', renderer: XMLParseDate, align: 'center' },
            { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 150, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },

            { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
            { id: 'QTDE_ITEM_COMPRA', header: "Qtde.", width: 80, sortable: true, dataIndex: 'QTDE_ITEM_COMPRA', align: 'right', renderer: FormataQtde },
            { id: 'UNIDADE_ITEM_COMPRA', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_COMPRA', align: 'center' },

            { id: 'PRECO_FINAL_FORNECEDOR', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_FINAL_FORNECEDOR', renderer: FormataValor_4, align: 'right' },
            { id: 'TIPO_DESCONTO_ITEM_COMPRA', header: "Tipo Desconto", width: 95, sortable: true, dataIndex: 'TIPO_DESCONTO_ITEM_COMPRA', renderer: TrataTipoDesconto, align: 'center' },
            { id: 'VALOR_DESCONTO_ITEM_COMPRA', header: "Desconto", width: 90, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_COMPRA', renderer: FormataDescontoCompras, align: 'center' },

            { id: 'VALOR_TOTAL_ITEM_COMPRA', header: "Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_COMPRA', renderer: FormataValor, align: 'right' }
        ],
        stripeRows: true,
        height: 200,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function RetornaDescontoJson() {

        var _JsonData = {
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: DescontoPagingToolbar.getLinhasPorPagina()
        };

        return _JsonData;
    }

    var DescontoPagingToolbar = new Th2_PagingToolbar();
    DescontoPagingToolbar.setUrl('servicos/QUALIDADE_COMPRAS.asmx/Premiacao_Compras');
    DescontoPagingToolbar.setStore(Desconto_Store);

    function CARREGA_GRID_DESCONTO() {
        DescontoPagingToolbar.setParamsJsonData(RetornaDescontoJson());
        DescontoPagingToolbar.doRequest();
    }

    ////////////////

    var pEstatisticas_Qualidade = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,
        defaults: { hideMode: 'offsets' },
        height: 300,
        items: [{
            title: 'Total de Compras no Per&iacute;odo (Emiss&atilde;o)',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [gridABC_Fornecedores, CURVA_ABC_PagingToolbar.PagingToolbar()]
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
            title: 'Devolu&ccedil;&otilde;es',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [gridNotaEntrada, NotaEntradaPagingToolbar.PagingToolbar()]
        }, {
            title: 'Total de Desconto no Per&iacute;odo',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ESTATISTICAS_QUALIDADE',
            items: [grid_Desconto, DescontoPagingToolbar.PagingToolbar()]
        }],
        listeners: {
            tabchange: function (p, tab) {
                if (tab.title == 'Total de Compras no Per&iacute;odo (Emiss&atilde;o)') {
                    Carrega_Curva_ABC();
                }
                else if (tab.title == 'Entrega Atrasada') {
                    Carrega_ENTREGA_ATRASADA();
                }
                else if (tab.title == 'Quantidades Menores no Per&iacute;odo (Entrega)') {
                    Carrega_Quantidades_Menores();
                }
                else if (tab.title == 'Devolu&ccedil;&otilde;es') {
                    CARREGA_GRID_NOTAS_FISCAIS_ENTRADA();
                }
                else if (tab.title == 'Total de Desconto no Per&iacute;odo') {
                    CARREGA_GRID_DESCONTO();
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
        }, pTotal_QUALIDADE_COMPRAS, pEstatisticas_Qualidade]
    });

    pTotal_QUALIDADE_COMPRAS.setHeight(AlturaDoPainelDeConteudo(68) / 2);
    pEstatisticas_Qualidade.setHeight(AlturaDoPainelDeConteudo(67) / 2);

    gridABC_Fornecedores.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_Entrega_Atrasada.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_QM.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    gridNotaEntrada.setHeight(AlturaDoPainelDeConteudo(179) / 2);
    grid_Desconto.setHeight(AlturaDoPainelDeConteudo(179) / 2);

    return panelCharts;
}