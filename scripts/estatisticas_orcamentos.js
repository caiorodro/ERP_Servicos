function Estatisticas_Orcamentos() {

    var Lideres_Store = new Ext.data.ArrayStore({
        fields: ['lider', 'total']
    });

    var TXT_DATA_INICIAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Orcamentos_Fechados()
                    Calcula_Estatisticas_Lider();
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
                    Calcula_Orcamentos_Fechados();
                    Calcula_Estatisticas_Lider();
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
                    Calcula_Orcamentos_Fechados();
                    Calcula_Estatisticas_Lider();
                }
            }
        }
    });

    var dt1 = new Date();

    TXT_DATA_INICIAL.setValue(dt1.getFirstDateOfMonth());
    TXT_DATA_FINAL.setValue(dt1.getLastDateOfMonth());

    function Calcula_Orcamentos_Fechados() {
        if (!TXT_CLIENTE.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Calcula_Orcamentos_Fechados');
        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            CODIGO_CLIENTE: TXT_CLIENTE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var data = [];

            for (var i = 0; i < result.length; i++) {
                var x = eval(result[i] + ";");

                data.push(x);
            }

            Lideres_Store.loadData(data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////////

    var pTotal_Lideres = new Ext.Panel({
        width: '100%',
        height: 300,
        frame: true,
        title: 'Total de Vendas / Or&ccedil;amentos Fechados por L&iacute;der de Equipe',
        tbar: [{
            text: 'Atualizar',
            icon: 'imagens/icones/statistic_reload_16.gif',
            handler: function () {
                Calcula_Orcamentos_Fechados();
            }
        }],
        items: {
            xtype: 'columnchart',
            store: Lideres_Store,
            yField: 'total',
            xField: 'lider',
            xAxis: new Ext.chart.CategoryAxis({
                title: 'Líderes de Equipe'
            }),
            yAxis: new Ext.chart.NumericAxis({
                title: 'Vendas',
                color: 0x69aBc8,
                labelRenderer: Ext.util.Format.brMoney
            }),
            tipRenderer: function (chart, record, index, series) {
                return record.data.lider + ' - Total de Vendas: ' + FormataValor2(record.data.total);
            },
            extraStyle: {
                xAxis: {
                    labelRotation: -45
                }
            },
            series: [{
                type: 'column',
                displayName: 'Total de Vendas',
                yField: 'total',
                style: {
                    image: 'bar.gif',
                    mode: 'stretch',
                    color: 0x99BBE8
                }
            }]
        }
    });

    //////////////////////
    var store_Estatisticas_Lider = new Ext.data.JsonStore({
        fields: ['lider', 'pendentes', 'vencidos', 'pedidos']
    });

    var pChart_Estatisticas = new Ext.Panel({
        width: '100%',
        height: 300,
        frame: true,
        title: 'Estat&iacute;sticas de cada L&iacute;der no Per&iacute;odo',
        tbar: [{
            text: 'Atualizar',
            icon: 'imagens/icones/statistic_reload_16.gif',
            handler: function () {
                Calcula_Estatisticas_Lider();
            }
        }],
        items: {
            xtype: 'stackedbarchart',
            store: store_Estatisticas_Lider,
            yField: 'lider',
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
                displayName: 'Pedido Fechado',
                style: {
                    color: 0x0000FF
                }
            }]
        }
    });

    function Calcula_Estatisticas_Lider() {
        if (!TXT_CLIENTE.isValid() || !TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Calcula_Estatisticas_Orcamentos_Lideres');

        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            CODIGO_CLIENTE: TXT_CLIENTE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            var _data = eval(result);

            store_Estatisticas_Lider.loadData(_data, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //////////////////////

    Calcula_Orcamentos_Fechados();
    Calcula_Estatisticas_Lider();

    var panelCharts = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                labelWidth: 65,
                items: [TXT_DATA_INICIAL]
            }, {
                columnWidth: .20,
                labelWidth: 60,
                layout: 'form',
                items: [TXT_DATA_FINAL]
            }, {
                columnWidth: .20,
                labelWidth: 70,
                layout: 'form',
                items: [TXT_CLIENTE]
            }]
        },
        pTotal_Lideres, pChart_Estatisticas]
    });

    pTotal_Lideres.setHeight(AlturaDoPainelDeConteudo(68) / 2);
    pChart_Estatisticas.setHeight(AlturaDoPainelDeConteudo(68) / 2);

    return panelCharts;
}