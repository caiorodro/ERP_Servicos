function Estatisticas_RNC() {

    var TXT_DATA_INICIAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas();
                }
            }
        }
    });

    var TXT_DATA_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas();
                }
            }
        }
    });

    var dt1 = new Date();

    TXT_DATA_INICIAL.setValue(dt1.getFirstDateOfMonth());
    TXT_DATA_FINAL.setValue(dt1.getLastDateOfMonth());

    var CB_ORDEM = new Ext.form.ComboBox({
        fieldLabel: 'Ordenar por',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 110,
        allowBlank: false,
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[0, 'Fornecedor'], [1, 'Totais']]
        }),
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas();
                }
            }
        }
    });

    var CB_DIRECAO = new Ext.form.ComboBox({
        fieldLabel: 'Dire&ccedil;&atilde;o',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 102,
        allowBlank: false,
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'Opc',
            'Opcao'
        ],
            data: [[0, 'Crescrente'], [1, 'Decrescente']]
        }),
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Estatisticas();
                }
            }
        }
    });

    var BTN_LISTAR = new Ext.Button({
        text: 'Atualizar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function() {
            Calcula_Estatisticas();
        }
    });

    ////////////////////////

    var TB_OCORRENCIA_RNC_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['NUMERO_RNC', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'CODIGO_PRODUTO_PEDIDO',
                     'NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'CODIGO_PRODUTO_COMPRA', 'CODIGO_FORNECEDOR',
                     'NOME_FANTASIA_FORNECEDOR', 'NOME_FORNECEDOR', 'ID_RNC', 'DESCRICAO_RNC', 'DATA_RNC',
                     'DESCRICAO', 'SEPARADOR', 'DATA_SEPARACAO', 'INSPECIONADOR', 'DATA_INSPECAO',
                     'NUMERO_NF_FORNECEDOR', 'NUMERO_ORDEM_RNC', 'PDF', 'ENCERRAMENTO']
                    )
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<br /><b>Descri&ccedil;&atilde;o:</b> {DESCRICAO}")
    });

    var gridOcorrenciaRNC = new Ext.grid.GridPanel({
        store: TB_OCORRENCIA_RNC_Store,
        title: 'Itens de RNC do Fornecedor no Per&iacute;odo',
        collapsible: true,
        columns: [
                        IO_expander,
                    { id: 'PDF', header: "PDF", width: 60, sortable: true, dataIndex: 'PDF', align: 'center' },
                    { id: 'NUMERO_ORDEM_RNC', header: "Ordem de RNC", width: 120, sortable: true, dataIndex: 'NUMERO_ORDEM_RNC', align: 'center' },
                    { id: 'DATA_RNC', header: "Data", width: 120, sortable: true, dataIndex: 'DATA_RNC', renderer: XMLParseDateTime },
                    { id: 'DATA_ENCERRAMENTO', header: "Encerramento", width: 120, sortable: true, dataIndex: 'DATA_ENCERRAMENTO', renderer: Parse_Encerramento_RNC },
                    { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 175, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                    { id: 'DESCRICAO_RNC', header: "Item de RNC", width: 300, sortable: true, dataIndex: 'DESCRICAO_RNC' },
                    { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;d. Produto (Venda)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                    { id: 'NUMERO_PEDIDO_COMPRA', header: "Pedido de Compra", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;d. Produto (Compra)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
                    { id: 'INSPECIONADOR', header: "Inspetor", width: 150, sortable: true, dataIndex: 'INSPECIONADOR' },
                    { id: 'DATA_INSPECAO', header: "Data Inspe&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_INSPECAO', renderer: XMLParseDate },
                    { id: 'SEPARADOR', header: "Separador", width: 150, sortable: true, dataIndex: 'SEPARADOR' },
                    { id: 'DATA_SEPARACAO', header: "Data Separa&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_SEPARACAO', renderer: XMLParseDate },
                    { id: 'NUMERO_NF_FORNECEDOR', header: "N&ordm; NF Fornecedor", width: 120, sortable: true, dataIndex: 'NUMERO_NF_FORNECEDOR', align: 'center' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        plugins: IO_expander,
        listeners: {
            collapse: function(p) {
                panelChart.setHeight(AlturaDoPainelDeConteudo(120));
            },
            expand: function(p) {
                panelChart.setHeight(AlturaDoPainelDeConteudo(68) / 2);
            }
        }
    });

    function RetornaRNC_Fornecedor_JsonData(pNOME_FORNECEDOR) {
        var CLAS_FISCAL_JsonData = {
            NOME_FORNECEDOR: pNOME_FORNECEDOR,
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var OCORRENCIA_RNC_PagingToolbar = new Th2_PagingToolbar();
    OCORRENCIA_RNC_PagingToolbar.setStore(TB_OCORRENCIA_RNC_Store);
    OCORRENCIA_RNC_PagingToolbar.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Carrega_Ocorrencias_por_Fornecedor');

    function TB_RNC_CARREGA_GRID_RNC(pNOME_FORNECEDOR) {
        OCORRENCIA_RNC_PagingToolbar.setParamsJsonData(RetornaRNC_Fornecedor_JsonData(pNOME_FORNECEDOR));
        OCORRENCIA_RNC_PagingToolbar.doRequest();
    }

    ////////////////////

    var panelChart = new Ext.Panel({
        width: '100%',
        height: 200,
        frame: true
    });

    var panelCharts = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                labelWidth: 65,
                items: [TXT_DATA_INICIAL]
            }, {
                columnWidth: .15,
                labelWidth: 60,
                layout: 'form',
                items: [TXT_DATA_FINAL]
            }, {
                columnWidth: .18,
                labelWidth: 80,
                layout: 'form',
                items: [CB_ORDEM]
            }, {
                columnWidth: .15,
                labelWidth: 50,
                layout: 'form',
                items: [CB_DIRECAO]
            }, {
                columnWidth: .12,
                items: [BTN_LISTAR]
}]
            },
        panelChart, gridOcorrenciaRNC, OCORRENCIA_RNC_PagingToolbar.PagingToolbar()]
        });

        function Calcula_Estatisticas() {
            if (!TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid()
                || !CB_ORDEM.isValid() || !CB_DIRECAO.isValid()) {
                return;
            }

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Calcula_Estatistica_Geral_por_Periodo');
            _ajax.setJsonData({
                DATA1: TXT_DATA_INICIAL.getRawValue(),
                DATA2: TXT_DATA_FINAL.getRawValue(),
                ORDEM: CB_ORDEM.getValue(),
                DIRECAO: CB_DIRECAO.getValue(),
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function(response, options) {
                var result = Ext.decode(response.responseText).d;
                CriarGraficoDinamico(result[0], result[1], result[2], result[3]);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        function CriarGraficoDinamico(string_data, items_rnc, items_series, fields1) {
            panelChart.removeAll(true);

            if (fields1.length > 0) {
                var _fields = eval("['fornecedor', " + fields1 + "];");

                var store_Estatisticas_RNC = new Ext.data.JsonStore({
                    fields: _fields
                });

                var string_series = "[";

                for (var i = 0; i < items_rnc.length; i++) {
                    if (string_series.length > 1) {
                        string_series += ",";
                    }

                    string_series += "{ xField: '" + items_series[i] + "', displayName: '" + items_rnc[i] + "', style: { color: " + _cores[i] + " }  }";
                }

                string_series += "]";

                var _series = eval(string_series + ";");

                var chartRNC = new Ext.chart.StackedBarChart({
                    store: store_Estatisticas_RNC,
                    yField: 'fornecedor',
                    xAxis: new Ext.chart.NumericAxis({
                        stackingEnabled: true
                    }),
                    series: _series,
                    listeners: {
                        itemclick: function(o) {
                            TB_RNC_CARREGA_GRID_RNC(o.item.fornecedor);
                        }
                    }
                });

                var _data = eval(string_data);
                store_Estatisticas_RNC.loadData(_data, false);

                panelChart.add(chartRNC);
                panelChart.doLayout();
            }
        }

        Calcula_Estatisticas();

        panelChart.setHeight(AlturaDoPainelDeConteudo(68) / 2);
        gridOcorrenciaRNC.setHeight(AlturaDoPainelDeConteudo(120) / 2);

        return panelCharts;
    }