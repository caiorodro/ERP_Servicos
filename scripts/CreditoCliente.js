function MontaCreditoCliente() {
    var _CODIGO_CLIENTE = 0;

    var TXT_CREDITO_DATA_INICIAL = new Ext.form.DateField({
        id: 'TXT_CREDITO_DATA_INICIAL',
        name: 'TXT_CREDITO_DATA_INICIAL',
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Totais();
                    CARREGA_GRAFICO_FATURADO_RECEBIDO();
                }
            }
        }
    });

    var TXT_CREDITO_DATA_FINAL = new Ext.form.DateField({
        id: 'TXT_CREDITO_DATA_FINAL',
        name: 'TXT_CREDITO_DATA_FINAL',
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Totais();
                    CARREGA_GRAFICO_FATURADO_RECEBIDO();
                }
            }
        }
    });

    var dt1 = new Date();

    Ext.getCmp('TXT_CREDITO_DATA_INICIAL').setValue(dt1.getFirstDateOfMonth().add(Date.MONTH, -2));
    Ext.getCmp('TXT_CREDITO_DATA_FINAL').setValue(dt1.getLastDateOfMonth());

    var _label_Totais_Credito = "<table>" +
    "<tr><td align='right' style='font-size: 10pt;'>Faturamento no Per&iacute;odo:</td><td align='right' style='font-size: 10pt;'><div id='div_FatPeriodo'></div></td>" +
    "<td align='right' style='font-size: 10pt; width: 200px;'>Abatimento(s) por Vendas:</td><td align='right' style='font-size: 10pt;'><div id='div_Abatimentos'></div></td></tr>" +

    "<tr><td align='right' style='font-size: 10pt;'>Total Recebido no Per&iacute;odo:</td><td align='right' style='font-size: 10pt;'><div id='div_Recebido'></div></td>" +
    "<td align='right' style='font-size: 10pt;'>Data Ultima Compra:</td><td align='right' style='font-size: 10pt;'><div id='div_dataUltimaCompra'></div></td></tr>" +

    "<tr><td align='right' style='font-size: 10pt;'>Total a Receber (a Vencer):</td><td align='right' style='font-size: 10pt;'><div id='div_aReceber'></div></td>" +
    "<td align='right' style='font-size: 10pt;'>Valor Ultima Compra:</td><td align='right' style='font-size: 10pt;'><div id='div_valorUltimaCompra'></div></td></tr>" +

    "<tr><td align='right' style='font-size: 10pt;'>Total Inadimplente:</td><td align='right' style='font-size: 10pt;'><div id='div_Inadimplente'></div></td>" +
    "<td align='right' style='font-size: 10pt;'>Maior Compra:</td><td align='right' style='font-size: 10pt;'><div id='div_maiorCompra'></div></td></tr>" +

    "<tr><td align='right' style='font-size: 10pt;'>Limite de Cr&eacute;dito Excedido:</td><td align='right' style='font-size: 10pt;'><div id='div_LimiteCredito'></div></td><td></td><td></td></tr>" +

    "</table>";

    var LBL_CREDITOS_TOTAIS = new Ext.form.Label({
        id: 'LBL_CREDITOS_TOTAIS'
    });

    LBL_CREDITOS_TOTAIS.setText(_label_Totais_Credito, false);

    var BTN_CREDITO_CLIENTE = new Ext.Button({
        text: 'Atualizar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            Totais();
            CARREGA_GRAFICO_FATURADO_RECEBIDO();
        }
    });

    //////////////////
    var DS_Faturado_Recebido_Store = new Ext.data.JsonStore({
        fields: ['periodo', 'total_faturado', 'total_recebido']
    });

    var pFaturado_Recebido = new Ext.Panel({
        title: 'Total Faturado no Per&iacute;odo X Total Recebido no Per&iacute;odo',
        frame: true,
        anchor: '100%',
        width: '100%',
        height: 297,
        layout: 'fit',

        items: {
            id: 'Chart_FaturadoRealizado',
            xtype: 'linechart',
            store: DS_Faturado_Recebido_Store,
            anchor: '100%',
            xField: 'periodo',
            yAxis: new Ext.chart.NumericAxis({
                displayName: 'total_faturado',
                labelRenderer: FormataValor2
            }),
            tipRenderer: function (chart, record, index, series) {
                if (series.yField == 'total_faturado') {
                    return 'Total Faturado em ' + record.data.periodo + ' - ' + FormataValor2(record.data.total_faturado);
                } else {
                    return 'Total Recebido em ' + record.data.periodo + ' - ' + FormataValor2(record.data.total_recebido);
                }
            },
            chartStyle: {
                padding: 10,
                animationEnabled: true,
                font: {
                    name: 'Tahoma',
                    color: 0x444444,
                    size: 11
                },
                dataTip: {
                    padding: 5,
                    border: {
                        color: 0x99bbe8,
                        size: 1
                    },
                    background: {
                        color: 0xDAE7F6,
                        alpha: .9
                    },
                    font: {
                        name: 'Tahoma',
                        color: 0x15428B,
                        size: 10,
                        bold: true
                    }
                },
                xAxis: {
                    color: 0x69aBc8,
                    majorTicks: { color: 0x69aBc8, length: 4 },
                    minorTicks: { color: 0x69aBc8, length: 2 },
                    majorGridLines: { size: 1, color: 0xeeeeee }
                },
                yAxis: {
                    color: 0x69aBc8,
                    majorTicks: { color: 0x69aBc8, length: 4 },
                    minorTicks: { color: 0x69aBc8, length: 2 },
                    majorGridLines: { size: 1, color: 0xdfe8f6 }
                }
            },
            series: [{
                type: 'line',
                displayName: 'Total Faturado',
                yField: 'total_faturado',
                style: {
                    color: 0x222C7B
                }
            }, {
                type: 'line',
                displayName: 'Total Recebido',
                yField: 'total_recebido',
                style: {
                    color: 0xEF7518
                }
            }]
        }
    });

    var Creditos_Store = new Ext.data.ArrayStore({
        fields: ['titulo', 'total']
    });

    var pGrafico_Creditos = new Ext.Panel({
        frame: true,
        anchor: '100%',
        width: '100%',
        height: 297,
        layout: 'fit',
        title: 'Totais de Cr&eacute;dito',
        items: {
            id: 'cGrafico_Creditos',
            xtype: 'columnchart',
            store: Creditos_Store,
            yField: 'total',
            xField: 'titulo',
            tipRenderer: function (chart, record, index, series) {
                return FormataValor2(record.data.total);
            },
            series: [{
                type: 'column',
                yField: 'total',
                style: {
                    image: 'bar.gif',
                    mode: 'stretch',
                    color: 0xff3300
                }
            }]
        }
    });

    //////////////////

    var formCREDITO_CLIENTE = new Ext.FormPanel({
        id: 'formCREDITO_CLIENTE',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        width: '100%',
        height: 550,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_CREDITO_DATA_INICIAL]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_CREDITO_DATA_FINAL]
            }, {
                columnWidth: .11,
                layout: 'form',
                items: [BTN_CREDITO_CLIENTE]
            }, {
                columnWidth: .50,
                layout: 'form',
                items: [LBL_CREDITOS_TOTAIS]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [pFaturado_Recebido]
            }, {
                columnWidth: .50,
                items: [pGrafico_Creditos]
            }]
        }]
    });

    this.CalculaTotais = function (CODIGO_CLIENTE) {
        if (CODIGO_CLIENTE > 0) {
            _CODIGO_CLIENTE = CODIGO_CLIENTE;
            Totais();
            CARREGA_GRAFICO_FATURADO_RECEBIDO();
            CARREGA_GRAFICO_CREDITO_CLIENTE();
        }
    };

    this.painelCreditos = function () {
        return formCREDITO_CLIENTE;
    };

    formCREDITO_CLIENTE.setHeight(Ext.getCmp('tabConteudo').getHeight() - 113);
    pFaturado_Recebido.setHeight(Ext.getCmp('tabConteudo').getHeight() - 235);
    pGrafico_Creditos.setHeight(Ext.getCmp('tabConteudo').getHeight() - 235);

    function Totais() {
        var dados = {
            CODIGO_CLIENTE: _CODIGO_CLIENTE,
            DataInicial: Ext.getCmp('TXT_CREDITO_DATA_INICIAL').getRawValue(),
            DataFinal: Ext.getCmp('TXT_CREDITO_DATA_FINAL').getRawValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Creditos_do_Cliente');
        _ajax.setJsonData(dados);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.get('div_FatPeriodo').dom.innerHTML = result.Faturamento;
            Ext.get('div_aReceber').dom.innerHTML = result.aReceber;
            Ext.get('div_Recebido').dom.innerHTML = result.Recebido;
            Ext.get('div_Inadimplente').dom.innerHTML = result.Inadimplente;
            Ext.get('div_LimiteCredito').dom.innerHTML = result.Excedido;
            Ext.get('div_Abatimentos').dom.innerHTML = result.Abatimentos;

            Ext.get('div_dataUltimaCompra').dom.innerHTML = result.data_ultima_compra;
            Ext.get('div_valorUltimaCompra').dom.innerHTML = result.valor_ultima_compra;
            Ext.get('div_maiorCompra').dom.innerHTML = result.maior_compra;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function CARREGA_GRAFICO_FATURADO_RECEBIDO() {
        var dados = {
            CODIGO_CLIENTE: _CODIGO_CLIENTE,
            DataInicial: Ext.getCmp('TXT_CREDITO_DATA_INICIAL').getRawValue(),
            DataFinal: Ext.getCmp('TXT_CREDITO_DATA_FINAL').getRawValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/GraficoFaturadoRecebido');
        _ajax.setJsonData(dados);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            var _data = eval(result);

            DS_Faturado_Recebido_Store.loadData(_data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function CARREGA_GRAFICO_CREDITO_CLIENTE() {
        var dados = {
            CODIGO_CLIENTE: _CODIGO_CLIENTE,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/GraficoCreditoCliente');
        _ajax.setJsonData(dados);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var _data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                _data.push(x);
            }

            Creditos_Store.loadData(_data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
}