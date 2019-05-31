function MontaTelaParametroCusto() {

    var CB_CUSTO_ICMS = new Ext.form.ComboBox({
        fieldLabel: '<b>A</b> - Custo de ICMS',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'ICMS ISENTO'], [1, 'ICMS Tributado (Crédito e Débito)']]
        })
    });

    var CB_CUSTO_IPI = new Ext.form.ComboBox({
        fieldLabel: '<b>B</b> - Custo de IPI',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'IPI ISENTO'], [1, 'IPI Tributado (Crédito e Débito)']]
        })
    });

    var CB_CUSTO_PIS = new Ext.form.ComboBox({
        fieldLabel: '<b>C</b> - Custo de PIS',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'PIS ISENTO'], [1, 'PIS Tributado (Crédito e Débito)']]
        })
    });

    var CB_CUSTO_COFINS = new Ext.form.ComboBox({
        fieldLabel: '<b>D</b> - Custo de COFINS',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'COFINS ISENTO'], [1, 'COFINS Tributado (Crédito e Débito)']]
        })
    });

    var TXT_CUSTO_IRPJ = new Ext.form.NumberField({
        fieldLabel: '<b>E</b> - % IRPJ (Imposto de renda pessoa jur&iacute;dica)',
        width: 70,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0
    });

    var TXT_CUSTO_CSLL = new Ext.form.NumberField({
        fieldLabel: '<b>F</b> - % CSLL (Contribui&ccedil;&atilde;o social sobre lucro l&iacute;quido)',
        width: 70,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0
    });

    var TXT_CUSTO_COMISSAO_VENDAS = new Ext.form.NumberField({
        fieldLabel: '<b>G</b> - % Comiss&atilde;o Vendas',
        width: 70,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0
    });

    var TXT_CUSTO_ENCARGOS = new Ext.form.NumberField({
        fieldLabel: '<b>H</b> - % (13&ordm;, f&eacute;rias, IRPF, INSS, Vale Transporte) sobre o valor da comiss&atilde;o',
        width: 70,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0
    });

    var TXT_PRECO_CUSTO = new Ext.form.NumberField({
        fieldLabel: 'Sugest&atilde;o de pre&ccedil;o de custo',
        width: 60,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0.000,
        allowBlank: false,
        value: 0
    });

    var TXT_PRECO_VENDA = new Ext.form.NumberField({
        fieldLabel: 'Sugest&atilde;o de pre&ccedil;o de venda',
        width: 60,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0.000,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaMargem();
            }
        }
    });

    var TXT_PRECO_CUSTO = new Ext.form.NumberField({
        fieldLabel: 'Sugest&atilde;o de pre&ccedil;o de custo',
        width: 60,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: 0.000,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaSaldoImpostos();
            }
        }
    });

    var TXT_MARGEM = new Ext.form.NumberField({
        fieldLabel: 'Sugest&atilde;o % de Margem de Venda',
        width: 50,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaSugestao();
            }
        }
    });

    var TXT_FATURADO_3_MESES = new Ext.form.NumberField({
        fieldLabel: 'Faturamento ultimos 3 meses',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaSaldoImpostos();
            }
        }
    });

    var TXT_IRPJ_PAGO = new Ext.form.NumberField({
        fieldLabel: 'Ultimo IRPJ pago',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaSaldoImpostos();
            }
        }
    });

    var TXT_CSLL_PAGO = new Ext.form.NumberField({
        fieldLabel: 'Ultimo CSLL pago',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.00,
        allowBlank: false,
        value: 0,
        enableKeyEvents: true,
        listeners: {
            keyup: function (f, e) {
                calculaSaldoImpostos();
            }
        }
    });

    function calculaSugestao() {
        if (TXT_PRECO_CUSTO.isValid() && TXT_MARGEM.isValid()) {
            var x = TXT_PRECO_CUSTO.getValue() * TXT_MARGEM.getValue();
            x = x.toFixed(4);

            TXT_PRECO_VENDA.setValue(x);

            calculaSaldoImpostos();
        }
    }

    function calculaMargem() {
        if (TXT_PRECO_CUSTO.isValid() && TXT_PRECO_VENDA.isValid()) {
            var x = TXT_PRECO_VENDA.getValue() / TXT_PRECO_CUSTO.getValue();
            x = x.toFixed(2);

            TXT_MARGEM.setValue(x);

            calculaSaldoImpostos();
        }
    }

    function calculaSaldoImpostos() {
        var _TOTAL = 0;

        for (var i = 0; i < Store1.getCount(); i++) {
            var record = Store1.getAt(i);

            if (record.data.IMPOSTO.indexOf("TOTAL") == -1) {
                var imposto = (TXT_PRECO_VENDA.getValue() * (record.data.VENDA / 100)) - (TXT_PRECO_CUSTO.getValue() * (record.data.CUSTO / 100));

                record.beginEdit();
                record.set('TOTAL', imposto);
                record.endEdit();
                record.commit();

                _TOTAL += imposto;
            }
            else {
                record.beginEdit();
                record.set('TOTAL', _TOTAL);
                record.endEdit();
                record.commit();
            }
        }

        for (var i = 0; i < Store2.getCount(); i++) {
            var record = Store2.getAt(i);

            if (record.data.IMPOSTO.indexOf("TOTAL") == -1) {

                var imposto = record.data.IMPOSTO.indexOf('13') > -1 ?
                    Store2.getAt(i - 1).data.TOTAL * (record.data.VENDA / 100) :
                    TXT_PRECO_VENDA.getValue() * (record.data.VENDA / 100);

                record.beginEdit();
                record.set('TOTAL', imposto);
                record.endEdit();
                record.commit();

                _TOTAL += imposto;
            }
            else {
                record.beginEdit();
                record.set('TOTAL', _TOTAL);
                record.endEdit();
                record.commit();
            }
        }
    }

    var Store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['IMPOSTO', 'CUSTO', 'VENDA', 'TOTAL'])
    });

    function criaImpostos() {

        var registro = Ext.data.Record.create([{
            name: 'IMPOSTO',
            name: 'CUSTO',
            name: 'VENDA',
            name: 'TOTAL'
        }]);

        var novo = new registro({
            IMPOSTO: 'Alíq. ICMS',
            CUSTO: 18,
            VENDA: 18,
            TOTAL: 0
        });

        Store1.insert(Store1.getCount(), novo);

        var novo1 = new registro({
            IMPOSTO: 'Alíq. IPI',
            CUSTO: 10,
            VENDA: 10,
            TOTAL: 0
        });

        Store1.insert(Store1.getCount(), novo1);

        var novo2 = new registro({
            IMPOSTO: 'Alíq. PIS',
            CUSTO: 1.65,
            VENDA: 1.65,
            TOTAL: 0
        });

        Store1.insert(Store1.getCount(), novo2);

        var novo3 = new registro({
            IMPOSTO: 'Alíq. COFINS',
            CUSTO: 7.6,
            VENDA: 7.6,
            TOTAL: 0
        });

        Store1.insert(Store1.getCount(), novo3);

        var novo5 = new registro({
            IMPOSTO: '<b>TOTAL...:</b>',
            CUSTO: 0,
            VENDA: 0,
            TOTAL: 0
        });

        Store1.insert(Store1.getCount(), novo5);
    }

    var TXT_CUSTO1 = new Ext.form.NumberField({
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.01,
        allowBlank: false,
        value: 0
    });

    var TXT_VENDA1 = new Ext.form.NumberField({
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.01,
        allowBlank: false,
        value: 0
    });

    var gridSugestao = new Ext.grid.EditorGridPanel({
        store: Store1,
        width: '100%',
        height: 138,
        clicksToEdit: 1,
        columns: [
    { id: 'IMPOSTO', header: "Imposto / Custo", width: 130, sortable: true, dataIndex: 'IMPOSTO' },
    { id: 'CUSTO', header: "% Compra", width: 80, sortable: true, dataIndex: 'CUSTO', align: 'center', renderer: FormataPercentual,
        editor: TXT_CUSTO1
    },
    { id: 'VENDA', header: "% Venda", width: 80, sortable: true, dataIndex: 'VENDA', align: 'center', renderer: FormataPercentual,
        editor: TXT_VENDA1
    },
    { id: 'TOTAL', header: "Valor Imposto", width: 110, sortable: true, dataIndex: 'TOTAL', align: 'center', renderer: FormataValor_Custo}],

        listeners: {
            render: function (grid) {
                criaImpostos();
            },
            afterEdit: function (e) {
                if (parseFloat(e.record.data.CUSTO) > 0.00 && parseFloat(e.record.data.VENDA) > 0.00) {
                    calculaSaldoImpostos();
                }
            }
        }
    });

    var fs1 = new Ext.form.FieldSet({
        title: 'Custos de venda - Cr&eacute;dito e D&eacute;bito',
        checkboxToggle: false,
        collapsible: false,
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        width: '95%',
        items: [gridSugestao]
    });

    //  Impostos indiretos

    var Store2 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['IMPOSTO', 'VENDA', 'PERIODO', 'TOTAL'])
    });

    function criaImpostos2() {

        var registro = Ext.data.Record.create([{
            name: 'IMPOSTO',
            name: 'PERIODO',
            name: 'VENDA',
            name: 'TOTAL'
        }]);

        var percentual_irpj_csll = ((TXT_CSLL_PAGO.getValue() + TXT_IRPJ_PAGO.getValue()) / TXT_FATURADO_3_MESES.getValue()) * 100;

        var novo = new registro({
            IMPOSTO: 'IRPF + CSLL',
            PERIODO: 'Trimestral',
            VENDA: percentual_irpj_csll,
            TOTAL: 0
        });

        Store2.insert(Store2.getCount(), novo);

        var novo3 = new registro({
            IMPOSTO: '13º, férias, VT<br />(% sobre a comissão)',
            PERIODO: 'Anual',
            VENDA: 41,
            TOTAL: 0
        });

        var novo4 = new registro({
            IMPOSTO: 'Comiss&atilde;o Vendas',
            PERIODO: 'Mensal',
            VENDA: 3,
            TOTAL: 0
        });

        Store2.insert(Store2.getCount(), novo4);
        Store2.insert(Store2.getCount(), novo3);

        var novo5 = new registro({
            IMPOSTO: '<b>TOTAL geral...:</b>',
            PERIODO: '',
            VENDA: 0,
            TOTAL: 0
        });

        Store2.insert(Store2.getCount(), novo5);
    }

    var TXT_CUSTO2 = new Ext.form.NumberField({
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.01,
        allowBlank: false,
        value: 0
    });

    var TXT_VENDA2 = new Ext.form.NumberField({
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0.01,
        allowBlank: false,
        value: 0
    });

    var gridSugestao2 = new Ext.grid.EditorGridPanel({
        store: Store2,
        width: '100%',
        height: 138,
        clicksToEdit: 1,
        columns: [
    { id: 'IMPOSTO', header: "Imposto / Custo", width: 130, sortable: true, dataIndex: 'IMPOSTO' },
    { id: 'PERIODO', header: "Per&iacute;odo", width: 100, sortable: true, dataIndex: 'PERIODO' },
    { id: 'VENDA', header: "% a Pagar", width: 90, sortable: true, dataIndex: 'VENDA', align: 'center', renderer: FormataPercentual,
        editor: TXT_VENDA2
    },
    { id: 'TOTAL', header: "Valor Custo", width: 110, sortable: true, dataIndex: 'TOTAL', align: 'center', renderer: FormataValor_Custo}],

        listeners: {
            render: function (grid) {

            },
            afterEdit: function (e) {
                if (parseFloat(e.record.data.VENDA) > 0.00) {
                    calculaSaldoImpostos();
                }
            }
        }
    });

    var fs2 = new Ext.form.FieldSet({
        title: 'Outros custos de venda - % com base no pre&ccedil;o de venda',
        checkboxToggle: false,
        collapsible: false,
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        width: '95%',
        items: [gridSugestao2]
    });

    var TXT_FORMULA_MARGEM_CONTRIBUICAO = new Ext.form.TextField({
        fieldLabel: 'F&oacute;rmula da margem de contribui&ccedil;&atilde;o',
        width: 800,
        maxLength: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '150' },
        allowBlank: false
    });

    var TXT_FORMULA_MARGEM_LUCRO = new Ext.form.TextField({
        fieldLabel: 'F&oacute;rmula da margem de lucro',
        width: 800,
        maxLength: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '150' },
        allowBlank: false
    });

    var form1 = new Ext.FormPanel({
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '90%',
        height: 400,
        layout: 'form',
        autoScroll: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .16,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_PRECO_CUSTO]
            }, {
                columnWidth: .17,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_MARGEM]
            }, {
                columnWidth: .17,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_PRECO_VENDA]
            }, {
                columnWidth: .16,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_IRPJ_PAGO]
            }, {
                columnWidth: .17,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_CSLL_PAGO]
            }, {
                columnWidth: .17,
                labelAlign: 'top',
                layout: 'form',
                items: [TXT_FATURADO_3_MESES]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [fs1]
            }, {
                columnWidth: .50,
                items: [fs2]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [CB_CUSTO_ICMS]
            }, {
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [CB_CUSTO_IPI]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [CB_CUSTO_PIS]
            }, {
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [CB_CUSTO_COFINS]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [TXT_CUSTO_IRPJ]
            }, {
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [TXT_CUSTO_CSLL]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [TXT_CUSTO_COMISSAO_VENDAS]
            }, {
                layout: 'form',
                columnWidth: .45,
                labelAlign: 'top',
                items: [TXT_CUSTO_ENCARGOS]
            }]
        }, {
            labelWidth: 210,
            layout: 'form',
            items: [TXT_FORMULA_MARGEM_CONTRIBUICAO]
        }, {
            labelWidth: 210,
            layout: 'form',
            items: [TXT_FORMULA_MARGEM_LUCRO]
        }]
    });

    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar Par&acirc;metros',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                Salvar();
            }
        }]
    });

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastro = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Par&acirc;metros de Custos',
        items: [form1, toolbar1]
    });

    function Salvar() {

        if (!form1.getForm().isValid()) {
            return;
        }

        var dados = {
            CUSTO_ICMS: CB_CUSTO_ICMS.getValue(),
            CUSTO_IPI: CB_CUSTO_IPI.getValue(),
            CUSTO_PIS: CB_CUSTO_PIS.getValue(),
            CUSTO_COFINS: CB_CUSTO_COFINS.getValue(),
            CUSTO_IRPJ: TXT_CUSTO_IRPJ.getValue(),
            CUSTO_CSLL: TXT_CUSTO_CSLL.getValue(),
            CUSTO_COMISSAO_VENDAS: TXT_CUSTO_COMISSAO_VENDAS.getValue(),
            CUSTO_ENCARGOS: TXT_CUSTO_ENCARGOS.getValue(),
            FORMULA_MARGEM_CONTRIBUICAO: TXT_FORMULA_MARGEM_CONTRIBUICAO.getValue(),
            FORMULA_MARGEM_LUCRO: TXT_FORMULA_MARGEM_LUCRO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = 'servicos/TB_PARAMETRO_CUSTO.asmx/Atualiza';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {

        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Busca() {
        var Url = 'servicos/TB_PARAMETRO_CUSTO.asmx/BuscaParametro';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            CB_CUSTO_ICMS.setValue(result.CUSTO_ICMS);
            CB_CUSTO_IPI.setValue(result.CUSTO_IPI);
            CB_CUSTO_PIS.setValue(result.CUSTO_PIS);
            CB_CUSTO_COFINS.setValue(result.CUSTO_COFINS);
            TXT_CUSTO_IRPJ.setValue(result.CUSTO_IRPJ);
            TXT_CUSTO_CSLL.setValue(result.CUSTO_CSLL);
            TXT_CUSTO_ENCARGOS.setValue(result.CUSTO_ENCARGOS);
            TXT_CUSTO_COMISSAO_VENDAS.setValue(result.CUSTO_COMISSAO_VENDAS);
            TXT_FORMULA_MARGEM_CONTRIBUICAO.setValue(result.FORMULA_MARGEM_CONTRIBUICAO);
            TXT_FORMULA_MARGEM_LUCRO.setValue(result.FORMULA_MARGEM_LUCRO);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Busca_Total_Faturado_e_IRPJ_mais_CSLL() {
        var Url = 'servicos/TB_CUSTO_VENDA.asmx/Busca_Total_Faturado_e_IRPJ_mais_CSLL';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TXT_CSLL_PAGO.setValue(result.ULTIMO_DARF_PAGO_CSLL);
            TXT_IRPJ_PAGO.setValue(result.ULTIMO_DARF_PAGO_IRPJ);
            TXT_FATURADO_3_MESES.setValue(result.TOTAL_FATURADO_ULTIMOS_3_MESES);

            criaImpostos2();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    form1.setHeight(AlturaDoPainelDeConteudo(0) - 98);

    Busca();
    Busca_Total_Faturado_e_IRPJ_mais_CSLL();

    return panelCadastro;
}