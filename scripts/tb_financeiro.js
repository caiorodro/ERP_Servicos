var _codigo_cliente_financeiro;

function MontaFinanceiro() {

    var pp;

    CARREGA_COMBO_BANCO();

    var _gera_Boleto = new gera_Boleto();

    var ff = new FormularioFinanceiro();

    var Financeiro_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_FINANCEIRO', 'DATA_LANCAMENTO', 'DATA_VENCIMENTO', 'DATA_PAGAMENTO', 'NUMERO_NF_SAIDA',
            'NUMERO_NF_ENTRADA', 'VALOR', 'VALOR_DESCONTO', 'VALOR_ACRESCIMO', 'VALOR_TOTAL', 'HISTORICO', 'CREDITO_DEBITO',
            'STATUS', 'VALOR_MULTA', 'PERC_JUROS_DIA', 'CODIGO_CLIENTE', 'CODIGO_FORNECEDOR', 'ID_PLANO', 'DESCRICAO_PLANO',
            'VALOR_APROXIMADO', 'PAGTO_PARCIAL', 'VALOR_PAGO_PARCIAL', 'MARCA_REMESSA', 'NUMERO_BANCO', 'NOME_BANCO', 'INSTRUCAO_REMESSA',
            'REMESSA', 'RETORNO', 'REMESSA_BANCO', 'NOSSO_NUMERO_BANCARIO', 'TITULO_MARCADO_UNIAO', 'ID_USUARIO_MARCA_UNIAO']
            ),
        sortInfo: {
            field: 'DATA_VENCIMENTO',
            direction: 'ASC'
        }
    });

    var Financeiro_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,
        tpl: new Ext.Template(
            '<hr><br />{HISTORICO}<br /><br /><b>Plano de contas: </b>{ID_PLANO} - {DESCRICAO_PLANO}<br /><hr>'
        )
    });

    var checkBoxSM_FIN = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {

            }
        }
    });

    function CreditoDebito(val) {
        if (val == '0')
            return "<span style='background-color: #669999; color: #FFFFFF; font-size: 10pt;'>Cr&eacute;dito</span>";

        if (val == '1')
            return "<span style='background-color: #990000; color: #FFFFFF; font-size: 10pt;'>D&eacute;bito</span>";
    }

    function Remessa(val, _metadata, _record) {
        if (_record.data.MARCA_REMESSA == 1)
            return "<span style='background-color: #336699; color: #FFFFFF; font-size: 10pt;'>Marcado para Remessa</span>"
        else if (_record.data.MARCA_REMESSA == 0 && _record.data.REMESSA == 1 && _record.data.RETORNO == 0)
            return "<span style='background-color: #FFFF00; color: #000066; font-size: 10pt;'>Remessa Gerada</span>";
        else if (_record.data.MARCA_REMESSA == 0 && _record.data.REMESSA == 1 && _record.data.RETORNO == 1)
            return "<span style='background-color: #999966; color: #FFFFFF; font-size: 10pt;'>Retorno do Banco</span>";
        else
            return "";
    }

    function DataEmBranco(val) {
        var val1 = formatDate(val);

        if (val1 == '01/01/1901')
            return '';

        if (val.length == 10)
            return val;
        else
            return val1;
    }

    function Valor_Aproximado(val, _metadata, _record) {
        val = FormataValor2(val);

        if (_record.data.VALOR_APROXIMADO == 1)
            return "<span title='Valor Aproximado' style='background-color: #CC6600; color: #FFFFFF; font-size: 10pt;'>" + val + "</span>";
        else
            return val;
    }

    function Pagto_Parcial(val, _metadata, _record) {
        val = FormataValor2(val);

        if (_record.data.PAGTO_PARCIAL == 1) {
            var pp = _record.data.VALOR_PAGO_PARCIAL;
            pp = pp.replace(",", ".");

            return "<span title='Pago Parcialmente [" + FormataValor2(pp) + "]' style='background-color: #FFFF00; color: ##000066; font-size: 10pt;'>" + val + "</span>";
        }
        else
            return val;
    }

    function tituloMarcado(val, metadata, record) {
        
        if (record.data.TITULO_MARCADO_UNIAO == 1 && record.data.ID_USUARIO_MARCA_UNIAO == _ID_USUARIO) {
            return "<span title='T&iacute;tulo marcado para uni&atilde;o' style='background-color: #FFFF00; color: ##000066; font-size: 10pt;'>" + val + "</span>";
        }

        return val;
    }

    var gridFinanceiro = new Th2_Grid();
    gridFinanceiro.setId('gridFinanceiro');
    gridFinanceiro.setStore(Financeiro_Store);

    gridFinanceiro.setWidth('100%');
    gridFinanceiro.setHeight(AlturaDoPainelDeConteudo(349));

    gridFinanceiro.setSelectionModel(checkBoxSM_FIN);

    var EDIT_VENCIMENTO = new Ext.form.DateField({
        allowBlank: false
    });

    var EDIT_PAGAMENTO = new Ext.form.DateField({
        allowBlank: false
    });

    var EDIT_VALOR = new Ext.form.NumberField({
        decimalPrecision: 2,
        minValue: 0.01,
        decimalSeparator: ','
    });

    var cols = [
        Financeiro_expander,
        checkBoxSM_FIN,
        { id: 'NUMERO_FINANCEIRO', header: "Numero", width: 50, sortable: false, dataIndex: 'NUMERO_FINANCEIRO', renderer: tituloMarcado },

        { id: 'CREDITO_DEBITO', header: "Cr&eacute;dito / D&eacute;bito", width: 100, sortable: false, dataIndex: 'CREDITO_DEBITO', renderer: CreditoDebito },
        { id: 'STATUS', header: "Status", width: 100, sortable: false, dataIndex: 'STATUS' },

        { id: 'DATA_LANCAMENTO', header: "Lan&ccedil;amento", width: 90, sortable: true, dataIndex: 'DATA_LANCAMENTO', renderer: XMLParseDate },
        { id: 'DATA_VENCIMENTO', header: "Vencimento", width: 90, sortable: true, dataIndex: 'DATA_VENCIMENTO', renderer: formatDate,
            editor: EDIT_VENCIMENTO
        },
        { id: 'DATA_PAGAMENTO', header: "Pagamento", width: 80, sortable: false, dataIndex: 'DATA_PAGAMENTO', renderer: DataEmBranco,
            editor: EDIT_PAGAMENTO
        },

        { id: 'NUMERO_NF_SAIDA', header: "NF de Sa&iacute;da", width: 80, sortable: false, dataIndex: 'NUMERO_NF_SAIDA', hidden: true, align: 'center' },
        { id: 'NUMERO_NF_ENTRADA', header: "NF  de Entrada", width: 80, sortable: false, dataIndex: 'NUMERO_NF_ENTRADA', hidden: true, align: 'center' },

        { id: 'VALOR', header: "Valor", width: 100, sortable: false, dataIndex: 'VALOR', renderer: Valor_Aproximado, align: 'right',
            editor: EDIT_VALOR
        },

        { id: 'VALOR_DESCONTO', header: "Desconto", width: 100, sortable: false, dataIndex: 'VALOR_DESCONTO', renderer: FormataValor, align: 'right' },
        { id: 'VALOR_ACRESCIMO', header: "Acr&eacute;scimo", width: 100, sortable: false, dataIndex: 'VALOR_ACRESCIMO', renderer: FormataValor, hidden: true, align: 'right' },
        { id: 'VALOR_MULTA', header: "Multa", width: 100, sortable: false, dataIndex: 'VALOR_MULTA', renderer: FormataValor, hidden: true, align: 'right' },
        { id: 'PERC_JUROS_MULTA', header: "% Juros ao Dia", width: 100, sortable: false, dataIndex: 'PERC_JUROS_MULTA', renderer: FormataValor, hidden: true, align: 'right' },
        { id: 'VALOR_TOTAL', header: "Valor Total", width: 100, sortable: false, dataIndex: 'VALOR_TOTAL', renderer: Pagto_Parcial, align: 'right' },
        { id: 'NOME_BANCO', header: "Banco", width: 200, sortable: false, dataIndex: 'NOME_BANCO' },
        { id: 'NOSSO_NUMERO_BANCARIO', header: "Numero Banc&aacute;rio", width: 170, sortable: false, dataIndex: 'NOSSO_NUMERO_BANCARIO' }

        ];

    gridFinanceiro.setColumns(cols);
    gridFinanceiro.setPlugins(Financeiro_expander);

    var _listeners = {
        keydown: function (e) {
            if (e.getKey() == e.F8) {
                BaixaFinanceiro();
            }
        },

        afterEdit: function (e) {

            if (e.value == e.originalValue) {
                e.record.reject();
                return;
            }

            if (e.field == 'DATA_VENCIMENTO') {
                if (e.value == '') {
                    e.record.reject();
                    return;
                }
            }

            if (e.field == 'VALOR') {
                if (parseFloat(e.value) <= 0.00) {
                    e.record.reject();
                    return;
                }
            }

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/AtualizaCampos');
            _ajax.ExibeDivProcessamento(false);
            _ajax.setJsonData({
                NUMERO_FINANCEIRO: e.record.data.NUMERO_FINANCEIRO,
                CAMPO: e.field,
                VALOR: e.field == "VALOR" ? e.value : DataEmBranco(e.value),
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;
                e.record.commit();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    };

    gridFinanceiro.setListeners(_listeners);

    function RetornaFinanceiroJsonData() {
        var _vencimento = TXT_FILTRO_EMISSAO ? TXT_FILTRO_EMISSAO.getRawValue() : '';
        var _vencimento_final = TXT_FILTRO_EMISSAO_FINAL ? TXT_FILTRO_EMISSAO_FINAL.getRawValue() : '';
        var _nota_saida = Ext.getCmp('FILTRO_NUMERO_NF_SAIDA') ? Ext.getCmp('FILTRO_NUMERO_NF_SAIDA').getValue() : '';
        var _nota_entrada = Ext.getCmp('FILTRO_NUMERO_NF_ENTRADA') ? Ext.getCmp('FILTRO_NUMERO_NF_ENTRADA').getValue() : '';
        var _clientefornecedor = Ext.getCmp('FILTRO_CLIENTE_FORNECEDOR') ? Ext.getCmp('FILTRO_CLIENTE_FORNECEDOR').getValue() : '';
        var _pagar_receber = Ext.getCmp('PAGAR_RECEBER') ? Ext.getCmp('PAGAR_RECEBER').getValue() : 'T';
        var _valor_titulo = Ext.getCmp('TXT_FILTRO_VALOR_TITULO') ? Ext.getCmp('TXT_FILTRO_VALOR_TITULO').getValue() : 0;
        var _opcoes = Ext.getCmp('OPCOES_FILTRO') ? Ext.getCmp('OPCOES_FILTRO').getValue() : 'T';
        var _numero_financeiro = Ext.getCmp('TXT_FILTRO_NUMERO_FINANCEIRO') ? Ext.getCmp('TXT_FILTRO_NUMERO_FINANCEIRO').getValue() : '';
        var _numero_banco = Ext.getCmp('CB_FILTRO_FIN_NUMERO_BANCO') ? Ext.getCmp('CB_FILTRO_FIN_NUMERO_BANCO').getValue() : 0;

        if (_valor_titulo == '')
            _valor_titulo = 0;

        if (!_clientefornecedor)
            _clientefornecedor = '';

        if (_numero_banco == '')
            _numero_banco = 0;

        var linhas = FinanceiroPagingToolbar ? FinanceiroPagingToolbar.getLinhasPorPagina() : Th2_LimiteDeLinhasPaginacao;

        var FinanceiroJsonData = {
            NUMERO_FINANCEIRO: _numero_financeiro,
            EMISSAO: _vencimento,
            EMISSAO_FINAL: _vencimento_final,
            NUMERO_NF_SAIDA: _nota_saida,
            NUMERO_NF_ENTRADA: _nota_entrada,
            CLIENTE_FORNECEDOR: _clientefornecedor,
            PAGAR_RECEBER: _pagar_receber,
            NUMERO_BANCO: _numero_banco,
            VALOR: _valor_titulo,
            OPCOES: _opcoes,
            start: 0,
            limit: linhas
        };

        FinanceiroJsonData = gridFinanceiro.setDadosFiltro(FinanceiroJsonData);

        return FinanceiroJsonData;
    }

    var FinanceiroPagingToolbar = new Th2_PagingToolbar();
    FinanceiroPagingToolbar.setStore(Financeiro_Store);

    function RetornaFinanceiroJsonData_NF_SAIDA() {
        var _nota_saida = Ext.getCmp('FILTRO_NUMERO_NF_SAIDA').getValue() == '' ? 0 : Ext.getCmp('FILTRO_NUMERO_NF_SAIDA').getValue();

        var linhas = FinanceiroPagingToolbar ? FinanceiroPagingToolbar.getLinhasPorPagina() : Th2_LimiteDeLinhasPaginacao;

        var FinanceiroJsonData = {
            NUMERO_NF_SAIDA: _nota_saida,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: linhas
        };

        gridFinanceiro.setDadosFiltro(RetornaFinanceiroJsonData_NF_SAIDA);

        return FinanceiroJsonData;
    }

    function FINANCEIRO_CARREGA_GRID_NF_SAIDA() {
        if (!TXT_FILTRO_NUMERO_NF_SAIDA.isValid()) {
            return;
        }

        FinanceiroPagingToolbar.setUrl('servicos/TB_FINANCEIRO.asmx/Lista_Financeiro_Nota_Saida');
        FinanceiroPagingToolbar.setParamsJsonData(RetornaFinanceiroJsonData_NF_SAIDA());
        FinanceiroPagingToolbar.doRequest();
    }

    //////////////////

    function RetornaFinanceiroJsonData_NF_ENTRADA() {
        var _nota_entrada = Ext.getCmp('FILTRO_NUMERO_NF_ENTRADA').getValue() == '' ? 0 : Ext.getCmp('FILTRO_NUMERO_NF_ENTRADA').getValue();

        var linhas = FinanceiroPagingToolbar ? FinanceiroPagingToolbar.getLinhasPorPagina() : Th2_LimiteDeLinhasPaginacao;

        var FinanceiroJsonData = {
            NUMERO_NF_ENTRADA: _nota_entrada,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: linhas
        };

        gridFinanceiro.setDadosFiltro(RetornaFinanceiroJsonData_NF_ENTRADA);

        return FinanceiroJsonData;
    }

    function FINANCEIRO_CARREGA_GRID_NF_ENTRADA() {
        if (!TXT_FILTRO_NUMERO_NF_SAIDA.isValid()) {
            return;
        }

        FinanceiroPagingToolbar.setUrl('servicos/TB_FINANCEIRO.asmx/Lista_Financeiro_Nota_Entrada');
        FinanceiroPagingToolbar.setParamsJsonData(RetornaFinanceiroJsonData_NF_ENTRADA());
        FinanceiroPagingToolbar.doRequest();
    }

    function FINANCEIRO_CARREGA_GRID() {
        if (!Ext.getCmp('formFiltrosFinanceiro').getForm().isValid()) {
            return;
        }

        FinanceiroPagingToolbar.Habilita();

        FinanceiroPagingToolbar.setUrl('servicos/TB_FINANCEIRO.asmx/Lista_Financeiro');
        FinanceiroPagingToolbar.setParamsJsonData(RetornaFinanceiroJsonData());
        FinanceiroPagingToolbar.doRequest();

        Calcula_Previsao();
    }

    gridFinanceiro.setMetodoCargaGrid(FINANCEIRO_CARREGA_GRID);

    gridFinanceiro.constroiGrid();

    var TXT_FILTRO_EMISSAO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Emiss&atilde;o',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_FILTRO_EMISSAO_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'at&eacute;',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var _dt1 = new Date();
    TXT_FILTRO_EMISSAO.setValue(_dt1.getFirstDateOfMonth());
    TXT_FILTRO_EMISSAO_FINAL.setValue(_dt1.getLastDateOfMonth());

    var TXT_FILTRO_NUMERO_NF_SAIDA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Nr da NF de Sa&iacute;da',
        name: 'FILTRO_NUMERO_NF_SAIDA',
        id: 'FILTRO_NUMERO_NF_SAIDA',
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID_NF_SAIDA();
                }
            }
        }
    });

    var TXT_FILTRO_NUMERO_NF_ENTRADA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Nr da NF de Entrada',
        name: 'FILTRO_NUMERO_NF_ENTRADA',
        id: 'FILTRO_NUMERO_NF_ENTRADA',
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID_NF_ENTRADA();
                }
            }
        }
    });

    var TXT_FILTRO_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Cliente / Fornecedor',
        name: 'FILTRO_CLIENTE_FORNECEDOR',
        id: 'FILTRO_CLIENTE_FORNECEDOR',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var TB_FINANCEIRO_BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            FINANCEIRO_CARREGA_GRID();
        }
    });

    var CB_PAGAR_RECEBER = new Ext.form.ComboBox({
        fieldLabel: 'Cr&eacute;dito / D&eacute;bito',
        id: 'PAGAR_RECEBER',
        name: 'PAGAR_RECEBER',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 130,
        allowBlank: false,
        msgTarget: 'side',
        value: 'T',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['T', 'Todos'], ['R', 'Contas a Receber'], ['P', 'Contas a Pagar']]
        }),
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var CB_OPCOES_FILTRO = new Ext.form.ComboBox({
        fieldLabel: 'Op&ccedil;&otilde;es de Filtro',
        id: 'OPCOES_FILTRO',
        name: 'OPCOES_FILTRO',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 200,
        allowBlank: false,
        msgTarget: 'side',
        value: 'T',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['T', 'Todos'], ['V', 'Títulos Vencidos'], ['A', 'Títulos em Aberto no Período'],
            ['P', 'Títulos Pagos Parcialmente'], ['X', 'Títulos com Valor Aproximado'],
            ['R', 'Títulos Marcados p/ Remessa'], ['G', 'Remessa Gerada'], ['D', 'Retorno do Banco'],
            ['S', 'Títulos a Vista'], ['Z', 'Títulos a Prazo']]
        }),
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_FILTRO_VALOR_TITULO = new Ext.form.NumberField({
        fieldLabel: 'Valor do T&iacute;tulo',
        name: 'TXT_FILTRO_VALOR_TITULO',
        id: 'TXT_FILTRO_VALOR_TITULO',
        width: 100,
        decimalPrecision: 2,
        minValue: 0.01,
        decimalSeparator: ',',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_FILTRO_NUMERO_FINANCEIRO = new Ext.form.NumberField({
        fieldLabel: 'Numero do T&iacute;tulo',
        name: 'TXT_FILTRO_NUMERO_FINANCEIRO',
        id: 'TXT_FILTRO_NUMERO_FINANCEIRO',
        width: 90,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    CARREGA_COMBO_BANCO();

    var CB_FILTRO_FIN_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        id: 'CB_FILTRO_FIN_NUMERO_BANCO',
        name: 'CB_FILTRO_FIN_NUMERO_BANCO',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 220,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    FINANCEIRO_CARREGA_GRID();
                }
            }
        }
    });

    var formFiltrosFinanceiro = new Ext.form.FormPanel({
        id: 'formFiltrosFinanceiro',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_FILTRO_EMISSAO]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_FILTRO_EMISSAO_FINAL]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_FILTRO_NUMERO_NF_SAIDA]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_FILTRO_NUMERO_NF_ENTRADA]
            }, {
                columnWidth: 0.30,
                layout: 'form',
                items: [TXT_FILTRO_CLIENTE_FORNECEDOR]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.13,
                layout: 'form',
                items: [CB_PAGAR_RECEBER]
            }, {
                columnWidth: 0.20,
                layout: 'form',
                items: [CB_OPCOES_FILTRO]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_FILTRO_VALOR_TITULO]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_FILTRO_NUMERO_FINANCEIRO]
            }, {
                columnWidth: 0.21,
                layout: 'form',
                items: [CB_FILTRO_FIN_NUMERO_BANCO]
            }, {
                columnWidth: 0.08,
                layout: 'form',
                items: [TB_FINANCEIRO_BTN_PESQUISA]
            }]
        }]
    });

    function BaixaFinanceiro() {
        if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {

            var arr1 = new Array();

            for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {
                var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

                if (record.data.STATUS != "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>") {
                    arr1[i] = record.data.NUMERO_FINANCEIRO;
                }
            }

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/BaixaFinanceiro');
            _ajax.setJsonData({
                NUMERO_FINANCEIRO: arr1,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {

                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

                    if (record.data.STATUS != "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>") {
                        record.beginEdit();
                        record.set('DATA_PAGAMENTO', result[i].DATA_PAGTO);
                        record.set('VALOR_TOTAL', result[i].VALOR_PAGO);
                        record.set('STATUS', "<span style='background-Color: #669900; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Pago</span>");
                        record.endEdit();
                        record.commit();
                    }
                }

                Calcula_Previsao();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }

    function Deleta_Financeiro(record) {
        dialog.MensagemDeConfirmacao('Deseja deletar este T&iacute;tulo?', 'gridFinanceiro', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/DeletaFinanceiro');
                _ajax.setJsonData({
                    NUMERO_FINANCEIRO: record.data.NUMERO_FINANCEIRO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    Financeiro_Store.remove(record);
                    Calcula_Previsao();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function Marca_Desmarca_Remessa() {
        var arr1 = new Array();

        for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {
            var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

            if (record.data.STATUS == "<span style='background-Color: red; color: #ffffff; font-size: 10pt;'>T&iacute;tulo Vencido</span>") {
                dialog.MensagemDeErro('O t&iacute;tulo ' + record.data.NUMERO_FINANCEIRO + ' est&aacute; vencido.');
                return;
            }

            arr1[i] = record.data.NUMERO_FINANCEIRO;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Marca_Desmarca_Remessa');
        _ajax.setJsonData({
            NUMERO_FINANCEIRO: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var arrRecords = new Array();

            for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {

                var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

                record.beginEdit();
                record.set('MARCA_REMESSA', record.data.MARCA_REMESSA == 0 ? 1 : 0);
                record.endEdit();
                record.commit();

                arrRecords[i] = record;
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function ImprimeDuplicataAvulsa() {
        if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione uma ou mais notas para imprimir a(s) duplicata(s)', 'BTN_IMPRIMIR_DUPLICATAS');
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {
            var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];
            arr1[i] = record.data.NUMERO_FINANCEIRO;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/ImprimeDuplicataAvulsa');

        _ajax.setJsonData({
            NUMEROS_FINANCEIRO: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_TB_FINANCEIRO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [{
            id: 'BTN_NOVO_FINANCEIRO',
            text: 'Novo',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'large',
            handler: function () {
                ff.resetaFormulario();
                tabPanel1.setActiveTab(1);
            }
        }, '-', {
            id: 'BTN_ALTERAR_FINANCEIRO',
            text: 'Alterar',
            icon: 'imagens/icones/database_write_24.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    ff.populaFormulario(record);
                    tabPanel1.setActiveTab(1);
                }
                else {
                    dialog.MensagemDeAlerta('Selecione um t&iacute;tulo para alterar', this);
                }
            }
        }, '-', {
            id: 'BTN_DELETAR_FINANCEIRO',
            text: 'Deletar',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    if (record.data.NUMERO_SEQ_NF_SAIDA > 0 || record.data.NUMERO_SEQ_NF_ENTRADA > 0) {
                        dialog.MensagemDeAlerta('N&atilde;o &eacute; poss&iacute;vel deletar um t&iacute;tulo. de uma nota fiscal j&aacute; emitida.', this);
                    }
                    else {
                        Deleta_Financeiro(record);
                    }
                }
                else {
                    dialog.MensagemDeAlerta('Selecione um t&iacute;tulo para deletar', this);
                }
            }
        }, '-', {
            id: 'BTN_BAIXAR_FINANCEIRO',
            text: 'Baixar T&iacute;tulo (F8)',
            icon: 'imagens/icones/calculator_down_24.gif',
            scale: 'large',
            handler: function () {
                BaixaFinanceiro();
            }
        }, '-', {
            id: 'BTN_IMPRIMIR_DUPLICATAS',
            text: 'Imprimir Duplicata(s)',
            icon: 'imagens/icones/windows_info_24.gif',
            scale: 'large',
            handler: function () {
                ImprimeDuplicataAvulsa();
            }
        }, '-', {
            id: 'BTN_PAGTO_PARCIAL',
            text: 'Pagto. Parcial',
            icon: 'imagens/icones/calculator_write_24.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    if (!pp)
                        pp = new Pagamento_Parcial();

                    pp.show('BTN_PAGTO_PARCIAL', record.data.NUMERO_FINANCEIRO);
                }
                else {
                    dialog.MensagemDeAlerta('Selecione um t&iacute;tulo para acessar os seus pagementos parciais', this);
                }
            }
        }, '-', {
            text: 'Gerar boleto(s)',
            icon: 'imagens/icones/file_write_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() == 0) {
                    dialog.MensagemDeAlerta('Selecione um ou mais t&iacute;tulos para gerar o(s) boleto(s)', btn.getId());
                    return;
                }

                var arr1 = new Array();

                for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

                    arr1[i] = record.data.NUMERO_FINANCEIRO;
                }

                _gera_Boleto.NUMEROS_FINANCEIRO(arr1);
                _gera_Boleto.show(btn);
            }
        }, '-', {
            text: 'Marcar / Desmarcar<br />t&iacute;tulo para unir',
            icon: 'imagens/icones/document_ok1_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() == 0) {
                    dialog.MensagemDeAlerta('Selecione um ou mais t&iacute;tulos para unir em um unico t&iacute;tulo', btn.getId());
                    return;
                }

                var arr1 = new Array();

                for (var i = 0; i < Ext.getCmp('gridFinanceiro').getSelectionModel().selections.getCount(); i++) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().selections.items[i];

                    arr1[i] = record.data.NUMERO_FINANCEIRO;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Marca_desmarca_titulos_para_uniao');
                _ajax.setJsonData({
                    NUMEROS_FINANCEIRO: arr1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    FINANCEIRO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            text: 'Unir T&iacute;tulo(s)<br />marcado(s)',
            icon: 'imagens/icones/entity_relation_write_24.gif',
            scale: 'large',
            handler: function (btn) {

                var _Une_titulos_do_cliente = new Une_titulos_do_cliente();

                _Une_titulos_do_cliente.acao(function (vencimento) {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Reune_Titulos_do_Cliente');
                    _ajax.setJsonData({
                        DATA_VENCIMENTO: vencimento,
                        ID_EMPRESA: _ID_EMPRESA,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {

                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                });

                _Une_titulos_do_cliente.show(btn);
            }
        }]
    });

    var BTN_VENCIDOS_A_PAGAR = new Ext.Button({
        id: 'BTN_VENCIDOS_A_PAGAR',
        text: 'Vencidos a Pagar',
        icon: 'imagens/icones/boolean_field_cancel_24.gif',
        scale: 'medium',
        handler: function () {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Titulos_Pagar_Vencidos');
            _ajax.setJsonData({ FORNECEDOR: '', VENDEDOR: 0, ID_EMPRESA: _ID_EMPRESA, ID_USUARIO: _ID_USUARIO });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var BTN_VENCIDOS_A_RECEBER = new Ext.Button({
        id: 'BTN_VENCIDOS_A_RECEBER',
        text: 'Vencidos a Receber',
        icon: 'imagens/icones/boolean_field_delete_24.gif',
        scale: 'medium',
        handler: function () {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/Titulos_Receber_Vencidos');
            _ajax.setJsonData({ CLIENTE: '', VENDEDOR: 0, ID_EMPRESA: _ID_EMPRESA, ID_USUARIO: _ID_USUARIO });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();

        }
    });

    var TXT_PREVISAO_INCIAL = new Ext.form.DateField({
        id: 'TXT_PREVISAO_INCIAL',
        name: 'TXT_PREVISAO_INCIAL',
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Previsao();
                }
            }
        }
    });

    var TXT_PREVISAO_FINAL = new Ext.form.DateField({
        id: 'TXT_PREVISAO_FINAL',
        name: 'TXT_PREVISAO_FINAL',
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Calcula_Previsao();
                }
            }
        }
    });

    var LBL_PREVISAO = new Ext.form.Label({
        id: 'LBL_PREVISAO'
    });

    var dt1 = new Date();

    Ext.getCmp('TXT_PREVISAO_INCIAL').setValue(dt1.getFirstDateOfMonth());
    Ext.getCmp('TXT_PREVISAO_FINAL').setValue(dt1.getLastDateOfMonth());

    var formTotais = new Ext.form.FormPanel({
        id: 'formTotais',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        labelAlign: 'top',
        height: 80,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.22,
                layout: 'form',
                items: [BTN_VENCIDOS_A_PAGAR]
            }, {
                columnWidth: 0.23,
                layout: 'form',
                items: [BTN_VENCIDOS_A_RECEBER]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_PREVISAO_INCIAL]
            }, {
                columnWidth: 0.18,
                layout: 'form',
                items: [TXT_PREVISAO_FINAL]
            }, {
                columnWidth: 0.25,
                layout: 'form',
                items: [LBL_PREVISAO]
            }]
        }]
    });

    var panelFinanceiro = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Financeiro',
        items: [formFiltrosFinanceiro, gridFinanceiro.grid(), FinanceiroPagingToolbar.PagingToolbar(),
                        toolbar_TB_FINANCEIRO, formTotais]
    });

    function Calcula_Previsao() {
        if (!Ext.getCmp('formTotais').getForm().isValid())
            return;

        var _dados = {
            DATA_INICIAL: Ext.getCmp('TXT_PREVISAO_INCIAL').getRawValue(),
            DATA_FINAL: Ext.getCmp('TXT_PREVISAO_FINAL').getRawValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/BuscaTotais');
        _ajax.setJsonData({ dados: _dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('BTN_VENCIDOS_A_PAGAR').setText("Vencidos a Pagar: " + result.VENCIDOS_A_PAGAR);
            Ext.getCmp('BTN_VENCIDOS_A_RECEBER').setText("Vencidos a Receber: " + result.VENCIDOS_A_RECEBER);

            var _saldoAnterior = result.SALDO_ANTERIOR.indexOf('-') > -1 ?
                    '<span style="color: red;">' + result.SALDO_ANTERIOR + '</span>' :
                    result.SALDO_ANTERIOR;

            var _saldo = result.SALDO_PREVISAO.indexOf('-') > -1 ?
                    '<span style="color: red;">' + result.SALDO_PREVISAO + '</span>' :
                    result.SALDO_PREVISAO;

            var _previsao = "<table><tr><td>Saldo Atual</td><td style='text-align: right;'>" + _saldoAnterior + "</td></tr>";
            _previsao += "<tr><td>A Pagar</td><td style='text-align: right;'>" + result.A_PAGAR + "</td></tr>";
            _previsao += "<tr><td>A Receber</td><td style='text-align: right;'>" + result.A_RECEBER + "</td></tr>";
            _previsao += "<tr><td>Previs&atilde;o de Saldo</td><td style='text-align: right;'>" + _saldo + "</td></tr></table>";

            Ext.getCmp('LBL_PREVISAO').setText(_previsao, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //FINANCEIRO_CARREGA_GRID();

    var tabPanel1 = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,
        defaults: { hideMode: 'offsets' },
        items: [{
            title: 'Financeiro',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_FINANCEIRO',
            items: [panelFinanceiro]
        }, {
            title: 'Dados do t&iacute;tulo',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_CONFIG_FATURAMENTO'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (panel.title == 'Dados do t&iacute;tulo') {
                    if (panel.items.length == 0) {
                        panel.add(ff.Panel());
                        panel.doLayout();
                    }
                }
            }
        }
    });

    return tabPanel1;
}

//////////////////// CRUD

function FormularioFinanceiro() {
    var _dt = new Date();

    var TXT_NUMERO_FINANCEIRO = new Ext.form.TextField({
        layout: 'form',
        width: 80,
        fieldLabel: 'Nr. de Lan&ccedil;amento',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', disabled: true }
    });

    var TXT_DATA_LANCAMENTO = new Ext.form.TextField({
        layout: 'form',
        width: 85,
        value: _dt.format('d/m/Y'),
        fieldLabel: 'Data de Cadastro',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', disabled: true },
        allowBlank: false
    });

    var TXT_DATA_VENCIMENTO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Vencimento',
        allowBlank: false
    });

    var TXT_DATA_PAGAMENTO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Pagamento',
        listeners: {
            change: function (c, novo, antigo) {
                CalculaFinanceiro();
            }
        }
    });

    var LBL_PAGO_PARCIAL = new Ext.form.Label();

    var OLD_ID_PLANO;

    var TXT_ID_PLANO_FINANCEIRO = new Ext.form.TextField({
        id: 'ID_PLANO_FINANCEIRO',
        layout: 'form',
        fieldLabel: 'Plano de Conta',
        allowBlank: false,
        width: 90,
        autoCreate: { tag: 'input', autocomplete: 'off', maxlength: 10, style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            focus: function (field) {
                OLD_ID_PLANO = field.getValue();
            },
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB || e.getKey() == e.ENTER) {
                    if (OLD_ID_PLANO != this.getValue()) {
                        Ext.getCmp('DESCRICAO_PLANO_FINANCEIRO').reset();
                        var vField = String(this.getValue());

                        if (vField.length > 0) {
                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_PLANO_CONTAS.asmx/BuscaPorID');
                            _ajax.setJsonData({
                                ID_PLANO: Ext.getCmp('ID_PLANO_FINANCEIRO').getValue(),
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function (response, options) {
                                var result = Ext.decode(response.responseText).d;

                                Ext.getCmp('DESCRICAO_PLANO_FINANCEIRO').setValue(result.DESCRICAO_PLANO);
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }
            }
        }
    });

    var TXT_DESCRICAO_PLANO_FINANCEIRO = new Ext.form.TextField({
        id: 'DESCRICAO_PLANO_FINANCEIRO',
        layout: 'form',
        readOnly: true,
        width: 350
    });

    var TXT_NUMERO_NF_SAIDA = new Ext.form.NumberField({
        fieldLabel: 'NF de Sa&iacute;da',
        decimalPrecision: 0,
        minValue: 0,
        width: 90
    });

    var TXT_NUMERO_NF_ENTRADA = new Ext.form.NumberField({
        fieldLabel: 'NF de Entrada',
        decimalPrecision: 0,
        minValue: 0,
        width: 90
    });

    var BTN_ABRIR_CONSULTA_CLIENTE = new Ext.Button({
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        tooltip: 'Clique para abrir a consulta de cliente / fornecedor',
        handler: function () {
            Ext.getCmp('fsBuscaFornecedor_FINANCEIRO').expand();
        }
    });

    var LBL_CODIGO_CLIENTE_FORNECEDOR = new Ext.form.Label({
        id: 'LBL_CODIGO_CLIENTE_FORNECEDOR'
    });

    var LBL_NOME_CLIENTE_FORNECEDOR = new Ext.form.Label({
        id: 'LBL_NOME_CLIENTE_FORNECEDOR'
    });

    var TXT_VALOR = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Valor do T&iacute;tulo',
        allowBlank: false,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: 0,
        enableKeyEvents: true,
        width: 90,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaFinanceiro();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        GravaFinanceiro();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaFinanceiro();
            }
        }

    });

    var TXT_VALOR_DESCONTO = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Valor do Desconto',
        allowBlank: false,
        minValue: 0,
        value: 0,
        decimalPrecision: 2,
        decimalSeparator: ',',
        enableKeyEvents: true,
        width: 90,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaFinanceiro();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        GravaFinanceiro();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaFinanceiro();
            }
        }
    });

    var TXT_VALOR_ACRESCIMO = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Valor do Acr&eacute;scimo',
        minValue: 0,
        value: 0,
        allowBlank: false,
        decimalPrecision: 2,
        decimalSeparator: ',',
        enableKeyEvents: true,
        width: 90,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaFinanceiro();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        GravaFinanceiro();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaFinanceiro();
            }
        }
    });

    var TXT_VALOR_MULTA = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Valor de Multa',
        minValue: 0,
        value: 0,
        allowBlank: false,
        decimalPrecision: 2,
        decimalSeparator: ',',
        enableKeyEvents: true,
        width: 90,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaFinanceiro();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        GravaFinanceiro();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaFinanceiro();
            }
        }
    });

    var TXT_PERC_JUROS_DIA = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: '% de Juros di&aacute;rio',
        minValue: 0,
        value: 0,
        allowBlank: false,
        decimalPrecision: 2,
        decimalSeparator: ',',
        enableKeyEvents: true,
        width: 70,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    CalculaFinanceiro();
                }

                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        GravaFinanceiro();
                    }
                }
            },
            keyup: function (f, e) {
                CalculaFinanceiro();
            }
        }
    });

    var TXT_VALOR_TOTAL = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Valor a ser pago',
        decimalPrecision: 2,
        decimalSeparator: ',',
        allowBlank: false,
        width: 105,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', readonly: true }
    });

    function CalculaFinanceiro() {
        var _valor = TXT_VALOR.getValue();
        var _desconto = TXT_VALOR_DESCONTO.getValue();
        var _acrescimo = TXT_VALOR_ACRESCIMO.getValue();

        var _valor_total = _valor - _desconto + _acrescimo;

        if (TXT_DATA_PAGAMENTO.getRawValue().length > 0) {

            _valor_total = TXT_VALOR_MULTA.getValue() > 0 ?
                        _valor_total += TXT_VALOR_MULTA.getValue() :
                        _valor_total;

            var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

            if (record) {
                var _pago_parcial = record.data.VALOR_PAGO_PARCIAL;
                _pago_parcial = _pago_parcial.replace(',', '.');

                _valor_total -= _pago_parcial;
            }

            if (TXT_DATA_VENCIMENTO.isValid(false)) {
                var _dias_de_atraso =
                            Diferenca_Dias_Entre_Datas(TXT_DATA_VENCIMENTO.getValue(),
                            TXT_DATA_PAGAMENTO.getValue());

                var _juros = TXT_PERC_JUROS_DIA.getValue() > 0 ?
                            TXT_PERC_JUROS_DIA.getValue() : 0;

                for (var i = 0; i < _dias_de_atraso; i++) {
                    _valor_total = _valor_total * (1 + (_juros / 100));
                }
            }
        }

        _valor_total = Math.round(_valor_total * 100) / 100;

        TXT_VALOR_TOTAL.setValue(_valor_total);
    }

    var CB_CREDITO_DEBITO = new Ext.form.ComboBox({
        id: 'CB_CREDITO_DEBITO',
        fieldLabel: 'Cr&eacute;dito / D&eacute;bito',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 90,
        allowBlank: false,
        value: '1',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['0', 'Crédito'], ['1', 'Débito']]
        })
    });

    var CB_VALOR_APROXIMADO = new Ext.form.Checkbox({
        boxLabel: 'Valor Aproximado'
    });

    var TXT_HISTORICO = new Ext.form.TextField({
        fieldLabel: 'Hist&oacute;rico',
        anchor: '100%',
        height: 40,
        allowBlank: false,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var HMARCA_REMESSA = new Ext.form.Hidden({
        id: 'HMARCA_REMESSA',
        name: 'HMARCA_REMESSA',
        value: 0
    });

    var combo_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 300
    });

    var TXT_INSTRUCAO_REMESSA = new Ext.form.NumberField({
        id: 'INSTRUCAO_REMESSA',
        name: 'INSTRUCAO_REMESSA',
        layout: 'form',
        fieldLabel: 'Remessa',
        decimalPrecision: 0,
        readOnly: true,
        width: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', readlony: true }
    });

    var TXT_DESCRICAO_INSTRUCAO_REMESSA = new Ext.form.TextField({
        id: 'DESCRICAO_INSTRUCAO_REMESSA',
        name: 'DESCRICAO_INSTRUCAO_REMESSA',
        layout: 'form',
        width: 250,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', readonly: true }
    });

    var TXT_MES_CONTA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'at&eacute; o m&ecirc;s',
        name: 'MES_CONTA',
        id: 'MES_CONTA',
        minValue: 1,
        maxValue: 12,
        width: 50
    });

    var anoAtual = new Date();

    var TXT_ANO_CONTA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'do Ano',
        name: 'ANO_CONTA',
        id: 'ANO_CONTA',
        minValue: anoAtual.getFullYear(),
        maxValue: 2099,
        width: 75
    });

    var BTN_SALVAR_CONTA_AUTOMATICA = new Ext.Button({
        text: 'Cadastrar Contas',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            CadastraContaAutomatica();
        }
    });

    var formFINANCEIRO = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: AlturaDoPainelDeConteudo(120),
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_NUMERO_FINANCEIRO]
            }, {
                columnWidth: 0.20,
                layout: 'form',
                items: [CB_CREDITO_DEBITO]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [TXT_ID_PLANO_FINANCEIRO]
            }, {
                columnWidth: 0.47,
                layout: 'form',
                items: [TXT_DESCRICAO_PLANO_FINANCEIRO]
            }]
        }, {
            items: [HMARCA_REMESSA]
        }, {
            layout: 'form',
            items: [Busca_Plano_Contas()]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_DATA_LANCAMENTO]
            }, {
                columnWidth: 0.20,
                layout: 'form',
                items: [TXT_DATA_VENCIMENTO]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_DATA_PAGAMENTO]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_NUMERO_NF_SAIDA]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_NUMERO_NF_ENTRADA]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [BTN_ABRIR_CONSULTA_CLIENTE]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.05,
                items: [LBL_CODIGO_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.90,
                items: [LBL_NOME_CLIENTE_FORNECEDOR]
            }]
        }, {
            layout: 'form',
            items: [Busca_Cliente_Fornecedor()]
        }, {
            layout: 'form',
            items: [TXT_HISTORICO]
        }, {
            xtype: 'fieldset',
            title: 'Totais',
            checkboxToggle: false,
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '95%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_VALOR]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_VALOR_DESCONTO]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_VALOR_ACRESCIMO]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_VALOR_MULTA]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_PERC_JUROS_DIA]
                }, {
                    columnWidth: 0.13,
                    layout: 'form',
                    items: [TXT_VALOR_TOTAL]
                }, {
                    columnWidth: 0.14,
                    layout: 'form',
                    items: [CB_VALOR_APROXIMADO]
                }, {
                    columnWidth: 0.08,
                    layout: 'form',
                    items: [LBL_PAGO_PARCIAL]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.43,
                    layout: 'form',
                    items: [combo_NUMERO_BANCO]
                }, {
                    columnWidth: 0.09,
                    layout: 'form',
                    items: [TXT_INSTRUCAO_REMESSA]
                }, {
                    columnWidth: 0.40,
                    layout: 'form',
                    items: [TXT_DESCRICAO_INSTRUCAO_REMESSA]
                }]
            }]
        }, {
            id: 'fsContaAutomatica',
            xtype: 'fieldset',
            title: 'Cadastrar esta conta por meses a frente',
            checkboxToggle: false,
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '95%',
            collapsible: true,
            collapsed: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.12,
                    layout: 'form',
                    items: [TXT_MES_CONTA]
                }, {
                    columnWidth: 0.12,
                    layout: 'form',
                    items: [TXT_ANO_CONTA]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [BTN_SALVAR_CONTA_AUTOMATICA]
                }]
            }]
        }]
    });

    var panelCRUD = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Lan&ccedil;amento',
        items: [formFINANCEIRO],
        bbar: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaFinanceiro();
            }
        }, '-', {
            text: 'Novo',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                reseta_Formulario();
                CB_CREDITO_DEBITO.focus();
            }
        }]
    });

    function _PopulaForm(record) {

        TXT_NUMERO_FINANCEIRO.setValue(record.data.NUMERO_FINANCEIRO);
        TXT_DATA_LANCAMENTO.setValue(XMLParseDate(record.data.DATA_LANCAMENTO));
        TXT_DATA_VENCIMENTO.setValue(XMLParseDate(record.data.DATA_VENCIMENTO));
        TXT_NUMERO_NF_SAIDA.setValue(record.data.NUMERO_NF_SAIDA);
        TXT_NUMERO_NF_ENTRADA.setValue(record.data.NUMERO_NF_ENTRADA);

        var _pagamento = XMLParseDate(record.data.DATA_PAGAMENTO) == '01/01/1901' ?
                            '' : XMLParseDate(record.data.DATA_PAGAMENTO);

        TXT_DATA_PAGAMENTO.setValue(_pagamento);
        CB_CREDITO_DEBITO.setValue(record.data.CREDITO_DEBITO);
        CB_CREDITO_DEBITO.disable();

        TXT_ID_PLANO_FINANCEIRO.setValue(record.data.ID_PLANO);
        TXT_DESCRICAO_PLANO_FINANCEIRO.setValue(record.data.DESCRICAO_PLANO);

        var _cli_for;

        if (record.data.CREDITO_DEBITO == 0) {
            LBL_CODIGO_CLIENTE_FORNECEDOR.setText("<span style='font-size: 10pt;'>" + record.data.CODIGO_CLIENTE + "</span>", false);
            _cli_for = record.data.CODIGO_CLIENTE;
            _codigo_cliente_financeiro = record.data.CODIGO_CLIENTE;
        }
        else {
            LBL_CODIGO_CLIENTE_FORNECEDOR.setText("<span style='font-size: 10pt;'>" + record.data.CODIGO_FORNECEDOR + "</span>", false);
            _cli_for = record.data.CODIGO_FORNECEDOR;
            _codigo_cliente_financeiro = record.data.CODIGO_FORNECEDOR;
        }

        if (LBL_CODIGO_CLIENTE_FORNECEDOR.html.length > 0) {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/BuscaDadosClienteFornecedor');
            _ajax.setJsonData({ CODIGO: _cli_for, CREDITO_DEBITO: record.data.CREDITO_DEBITO, ID_USUARIO: _ID_USUARIO });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;
                LBL_NOME_CLIENTE_FORNECEDOR.setText("<span style='font-size: 10pt;'>" + result + "</span>", false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        TXT_HISTORICO.setValue(record.data.HISTORICO);
        TXT_VALOR.setValue(record.data.VALOR);
        TXT_VALOR_DESCONTO.setValue(record.data.VALOR_DESCONTO);
        TXT_VALOR_ACRESCIMO.setValue(record.data.VALOR_ACRESCIMO);
        TXT_VALOR_MULTA.setValue(record.data.VALOR_MULTA);
        TXT_PERC_JUROS_DIA.setValue(record.data.PERC_JUROS_DIA);
        TXT_VALOR_TOTAL.setValue(record.data.VALOR_TOTAL);

        Ext.getCmp('HMARCA_REMESSA').setValue(record.data.MARCA_REMESSA);

        if (record.data.INSTRUCAO_REMESSA > 0)
            TXT_INSTRUCAO_REMESSA.setValue(record.data.INSTRUCAO_REMESSA);

        if (record.data.NUMERO_BANCO > 0)
            combo_NUMERO_BANCO.setValue(record.data.NUMERO_BANCO);

        if (record.data.VALOR_APROXIMADO == 1)
            CB_VALOR_APROXIMADO.setValue(true);
        else
            CB_VALOR_APROXIMADO.setValue(false);

        CB_CREDITO_DEBITO.focus();

        LBL_PAGO_PARCIAL.setText('', false);

        panelCRUD.setTitle('Alterar Lan&ccedil;amento');

        if (record.data.PAGTO_PARCIAL == 1) {
            var pp = record.data.VALOR_PAGO_PARCIAL;
            pp = pp.replace(",", ".");
            LBL_PAGO_PARCIAL.setText("<span style='font-size: 11pt; color: #000066;'>Total Pago Parcialmente: " + FormataValor2(pp) + "</span>", false);
        }
    }

    /////////////////////////////////

    var Atualiza_Total = true;

    function GravaFinanceiro() {
        if (!formFINANCEIRO.getForm().isValid()) {
            return;
        }

        GravaFinanceiro2('N');
    }

    function GravaFinanceiro2(Parcial) {
        var cod_cli_for = _codigo_cliente_financeiro;

        if (TXT_NUMERO_NF_SAIDA.getValue() > 0 && cod_cli_for == 0) {
            dialog.MensagemDeErro('O numero da NF de Sa&iacute;da &eacute; maior que zero.<br />Selecione 1 cliente antes de salvar.');
            return;
        }

        if (TXT_NUMERO_NF_ENTRADA.getValue() > 0 && cod_cli_for == 0) {
            dialog.MensagemDeErro('O numero da NF de Entrada &eacute; maior que zero.<br />Selecione 1 fornecedor antes de salvar.');
            return;
        }

        var cod_cli_for = LBL_CODIGO_CLIENTE_FORNECEDOR.html ? LBL_CODIGO_CLIENTE_FORNECEDOR.html : 0;

        var _valor_aproximado = CB_VALOR_APROXIMADO.checked ? 1 : 0;

        var dados = {
            NUMERO_FINANCEIRO: TXT_NUMERO_FINANCEIRO.getValue(),
            DATA_VENCIMENTO: TXT_DATA_VENCIMENTO.getValue(),
            DATA_PAGAMENTO: TXT_DATA_PAGAMENTO.getValue(),
            CREDITO_DEBITO: CB_CREDITO_DEBITO.getValue(),
            HISTORICO: TXT_HISTORICO.getValue(),
            VALOR: TXT_VALOR.getValue(),
            VALOR_DESCONTO: TXT_VALOR_DESCONTO.getValue(),
            VALOR_ACRESCIMO: TXT_VALOR_ACRESCIMO.getValue(),
            VALOR_MULTA: TXT_VALOR_MULTA.getValue(),
            PERC_JUROS_DIA: TXT_PERC_JUROS_DIA.getValue(),
            VALOR_TOTAL: TXT_VALOR_TOTAL.getValue(),

            NUMERO_NF_SAIDA: TXT_NUMERO_NF_SAIDA.getValue(),
            NUMERO_NF_ENTRADA: TXT_NUMERO_NF_ENTRADA.getValue(),
            CODIGO_CLIENTE_FORNECEDOR: cod_cli_for,
            ID_PLANO_FINANCEIRO: TXT_ID_PLANO_FINANCEIRO.getValue(),
            VALOR_APROXIMADO: _valor_aproximado,
            GERAR_SALDO: Parcial,
            MARCA_REMESSA: Ext.getCmp('HMARCA_REMESSA').getValue(),
            INSTRUCAO_REMESSA: TXT_INSTRUCAO_REMESSA.getValue(),
            NUMERO_BANCO: combo_NUMERO_BANCO.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCRUD.title == "Novo Lan&ccedil;amento" ?
                'servicos/TB_FINANCEIRO.asmx/GravaNovoFinanceiro' :
                'servicos/TB_FINANCEIRO.asmx/AtualizaFinanceiro';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (panelCRUD.title == "Novo Lan&ccedil;amento")
                reseta_Formulario();
            else {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    record.beginEdit();
                    record.set('STATUS', result);
                    record.set('DATA_VENCIMENTO', TXT_DATA_VENCIMENTO.getRawValue());
                    record.set('DATA_PAGAMENTO', TXT_DATA_PAGAMENTO.getRawValue());
                    record.set('CREDITO_DEBITO', CB_CREDITO_DEBITO.getValue());
                    record.set('VALOR_APROXIMADO', _valor_aproximado);
                    record.set('HISTORICO', TXT_HISTORICO.getValue());
                    record.set('VALOR', TXT_VALOR.getValue());
                    record.set('VALOR_DESCONTO', TXT_VALOR_DESCONTO.getValue());
                    record.set('VALOR_ACRESCIMO', TXT_VALOR_ACRESCIMO.getValue());
                    record.set('VALOR_MULTA', TXT_VALOR_MULTA.getValue());
                    record.set('ID_PLANO', TXT_ID_PLANO_FINANCEIRO.getValue());
                    record.set('DESCRICAO_PLANO', TXT_DESCRICAO_PLANO_FINANCEIRO.getValue());
                    record.set('NUMERO_BANCO', combo_NUMERO_BANCO.getValue());
                    record.set('NOME_BANCO', combo_NUMERO_BANCO.getRawValue());

                    if (Atualiza_Total)
                        record.set('VALOR_TOTAL', TXT_VALOR_TOTAL.getValue());
                    else
                        record.set('PAGTO_PARCIAL', 1);

                    record.endEdit();
                    record.commit();
                }
            }
            CB_CREDITO_DEBITO.focus();
        }

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function CadastraContaAutomatica() {
        if (!formFINANCEIRO.getForm().isValid()) {
            return;
        }

        if (!TXT_MES_CONTA.isValid() || !TXT_ANO_CONTA.isValid()) {
            return;
        }

        var cod_cli_for1 = TXT_ID_PLANO_FINANCEIRO.getValue() ?
                                                TXT_ID_PLANO_FINANCEIRO.getValue() : 0;

        var _valor_aproximado = CB_VALOR_APROXIMADO.checked ? 1 : 0;

        var dados = {
            NUMERO_FINANCEIRO: TXT_NUMERO_FINANCEIRO.getValue(),
            DATA_VENCIMENTO: TXT_DATA_VENCIMENTO.getValue(),
            DATA_PAGAMENTO: TXT_DATA_PAGAMENTO.getValue(),
            CREDITO_DEBITO: CB_CREDITO_DEBITO.getValue(),
            HISTORICO: TXT_HISTORICO.getValue(),
            VALOR: TXT_VALOR.getValue(),
            VALOR_DESCONTO: TXT_VALOR_DESCONTO.getValue(),
            VALOR_ACRESCIMO: TXT_VALOR_ACRESCIMO.getValue(),
            VALOR_MULTA: TXT_VALOR_MULTA.getValue(),
            PERC_JUROS_DIA: TXT_PERC_JUROS_DIA.getValue(),
            VALOR_TOTAL: TXT_VALOR_TOTAL.getValue(),

            NUMERO_NF_SAIDA: TXT_NUMERO_NF_SAIDA.getValue(),
            NUMERO_NF_ENTRADA: TXT_NUMERO_NF_ENTRADA.getValue(),
            CODIGO_CLIENTE_FORNECEDOR: cod_cli_for1,
            ID_PLANO_FINANCEIRO: TXT_ID_PLANO_FINANCEIRO.getValue(),
            VALOR_APROXIMADO: _valor_aproximado,
            NUMERO_BANCO: combo_NUMERO_BANCO.getValue() == '' ? 0 : combo_NUMERO_BANCO.getValue(),
            MES: TXT_MES_CONTA.getValue(),
            ANO: TXT_ANO_CONTA.getValue(),
            ID_USUARIO: _ID_USUARIO,
            ID_EMPRESA: _ID_EMPRESA
        };

        var Url = 'servicos/TB_FINANCEIRO.asmx/CadastraContasFuturas';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (panelCRUD.title == "Novo Lan&ccedil;amento")
                formFINANCEIRO.getForm().reset();
            else {
                if (Ext.getCmp('gridFinanceiro').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    record.beginEdit();
                    record.set('STATUS', result);
                    record.set('DATA_VENCIMENTO', TXT_DATA_VENCIMENTO.getRawValue());
                    record.set('DATA_PAGAMENTO', TXT_DATA_PAGAMENTO.getRawValue());
                    record.set('CREDITO_DEBITO', CB_CREDITO_DEBITO.getValue());
                    record.set('VALOR_APROXIMADO', _valor_aproximado);
                    record.set('HISTORICO', TXT_HISTORICO.getValue());
                    record.set('VALOR', TXT_VALOR.getValue());
                    record.set('VALOR_DESCONTO', TXT_VALOR_DESCONTO.getValue());
                    record.set('VALOR_ACRESCIMO', TXT_VALOR_ACRESCIMO.getValue());
                    record.set('VALOR_MULTA', TXT_VALOR_MULTA.getValue());
                    record.set('VALOR_TOTAL', TXT_VALOR_TOTAL.getValue());

                    record.endEdit();
                    record.commit();
                }
            }

            CB_CREDITO_DEBITO.focus();
        }

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.populaFormulario = function (record) {
        _PopulaForm(record);
    };

    this.resetaFormulario = function () {
        reseta_Formulario();
    };

    function reseta_Formulario() {
        _codigo_cliente_financeiro = 0;

        panelCRUD.setTitle('Novo Lan&ccedil;amento');
        Ext.getCmp('LBL_CODIGO_CLIENTE_FORNECEDOR').setText('');
        Ext.getCmp('LBL_NOME_CLIENTE_FORNECEDOR').setText('');

        CB_CREDITO_DEBITO.enable();

        formFINANCEIRO.getForm().reset();

        CB_CREDITO_DEBITO.setValue(1);

        TXT_HISTORICO.setValue('');
        TXT_NUMERO_NF_SAIDA.setValue(0);
        TXT_NUMERO_NF_ENTRADA.setValue(0);

        TXT_VALOR.setValue(0);
        TXT_VALOR_ACRESCIMO.setValue(0);
        TXT_VALOR_DESCONTO.setValue(0);
        TXT_VALOR_MULTA.setValue(0);
        TXT_PERC_JUROS_DIA.setValue(0);
        TXT_VALOR_TOTAL.setValue(0);

        TXT_DATA_LANCAMENTO.setValue(_dt.format('d/m/Y'));
    }

    this.Panel = function () {
        return panelCRUD;
    };
}
//////////////////////////

function Busca_Cliente_Fornecedor() {

    var fsBuscaFornecedor_FINANCEIRO = new Ext.form.FieldSet({
        id: 'fsBuscaFornecedor_FINANCEIRO',
        title: 'Busca de Cliente / Fornecedor',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR').focus();
            }
        }
    });

    var TB_FINANCEIRO_BUSCA_FORNECEDOR_CLIENTE_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO', 'NOME', 'NOME_FANTASIA'])
    });

    var gridFINANCEIRO_Fornecedor_Cliente = new Ext.grid.GridPanel({
        id: 'gridFINANCEIRO_Fornecedor_Cliente',
        store: TB_FINANCEIRO_BUSCA_FORNECEDOR_CLIENTE_STORE,
        columns: [
            { id: 'CODIGO', header: "C&oacute;digo", width: 55, sortable: true, dataIndex: 'CODIGO' },
            { id: 'NOME', header: "Raz&atilde;o Social", width: 240, sortable: true, dataIndex: 'NOME' },
            { id: 'NOME_FANTASIA', header: "Nome Fantasia", width: 195, sortable: true, dataIndex: 'NOME_FANTASIA' }
        ],

        stripeRows: true,
        height: 150,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();

                        Ext.getCmp('LBL_CODIGO_CLIENTE_FORNECEDOR').setText(record.data.CODIGO, false);
                        Ext.getCmp('LBL_NOME_CLIENTE_FORNECEDOR').setText(record.data.NOME + '<br />' + record.data.NOME_FANTASIA, false);

                        fsBuscaFornecedor_FINANCEIRO.collapse();
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                Ext.getCmp('LBL_CODIGO_CLIENTE_FORNECEDOR').setText(record.data.CODIGO, false);
                _codigo_cliente_financeiro = record.data.CODIGO;
                Ext.getCmp('LBL_NOME_CLIENTE_FORNECEDOR').setText(record.data.NOME + '<br />' + record.data.NOME_FANTASIA, false);

                fsBuscaFornecedor_FINANCEIRO.collapse();
            }
        }
    });

    var TB_FINANCEIRO_PagingToolbar = new Th2_PagingToolbar();

    TB_FINANCEIRO_PagingToolbar.setUrl('servicos/TB_FINANCEIRO.asmx/ListaFornecedores_Clientes_GridPesquisa');
    TB_FINANCEIRO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_FINANCEIRO_CF_JsonData());
    TB_FINANCEIRO_PagingToolbar.setStore(TB_FINANCEIRO_BUSCA_FORNECEDOR_CLIENTE_STORE);

    function RetornaFiltros_TB_FINANCEIRO_CF_JsonData() {
        var _pesquisa = Ext.getCmp('TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR') ?
                            Ext.getCmp('TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR').getValue() : '';

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            credito_debito: Ext.getCmp('CB_CREDITO_DEBITO').getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_FINANCEIRO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Fornecedor_TB_FINANCEIRO() {
        TB_FINANCEIRO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_FINANCEIRO_CF_JsonData());
        TB_FINANCEIRO_PagingToolbar.doRequest();
    }

    var TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR = new Ext.form.TextField({
        id: 'TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR',
        name: 'TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR',
        labelWidth: 120,
        fieldLabel: 'Cliente / Fornecedor',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Fornecedor_TB_FINANCEIRO();
                }
            }
        }
    });

    var TB_FINANCEIRO_BTN_PESQUISA_FORNECEDOR = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Fornecedor_TB_FINANCEIRO();
        }
    });

    fsBuscaFornecedor_FINANCEIRO.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .20,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Cliente / Fornecedor:'
            }, {
                columnWidth: .35,
                items: [TB_FINANCEIRO_TXT_PESQUISA_FORNECEDOR]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_FINANCEIRO_BTN_PESQUISA_FORNECEDOR]
            }]
        }, gridFINANCEIRO_Fornecedor_Cliente, TB_FINANCEIRO_PagingToolbar.PagingToolbar()]
    });

    return fsBuscaFornecedor_FINANCEIRO;
}

/////////////////////////////////
function Busca_Plano_Contas() {

    var fsBuscaPlanoContas = new Ext.form.FieldSet({
        id: 'fsBuscaPlanoContas',
        title: 'Busca de Plano de Contas',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('TB_PLANOS_TXT_PESQUISA').focus();
            }
        }
    });

    var TB_FINANCEIRO_BUSCA_PLANO_CONTAS_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PLANO', 'DESCRICAO_PLANO', 'PAI_PLANO'])
    });

    var gridFINANCEIRO_Planos = new Ext.grid.GridPanel({
        id: 'gridFINANCEIRO_Planos',
        store: TB_FINANCEIRO_BUSCA_PLANO_CONTAS_STORE,
        columns: [
            { id: 'ID_PLANO', header: "ID", width: 55, sortable: true, dataIndex: 'ID_PLANO' },
            { id: 'DESCRICAO_PLANO', header: "Descri&ccedil;&atilde;o", width: 240, sortable: true, dataIndex: 'DESCRICAO_PLANO' },
            { id: 'PAI_PLANO', header: "Pertence ao Plano", width: 150, sortable: true, dataIndex: 'PAI_PLANO' }
        ],

        stripeRows: true,
        height: 150,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();

                        Ext.getCmp('ID_PLANO_FINANCEIRO').setValue(record.data.ID_PLANO);
                        Ext.getCmp('DESCRICAO_PLANO_FINANCEIRO').setValue(record.data.DESCRICAO_PLANO);

                        fsBuscaPlanoContas.collapse();

                        Ext.getCmp('ID_PLANO_FINANCEIRO').focus();
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);

                Ext.getCmp('ID_PLANO_FINANCEIRO').setValue(record.data.ID_PLANO);
                Ext.getCmp('DESCRICAO_PLANO_FINANCEIRO').setValue(record.data.DESCRICAO_PLANO);

                fsBuscaPlanoContas.collapse();

                Ext.getCmp('ID_PLANO_FINANCEIRO').focus();
            }
        }
    });

    var TB_PLANO_PagingToolbar = new Th2_PagingToolbar();

    TB_PLANO_PagingToolbar.setUrl('servicos/TB_PLANO_CONTAS.asmx/Lista_TB_PLANO_CONTAS');
    TB_PLANO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PLANOS_JsonData());
    TB_PLANO_PagingToolbar.setStore(TB_FINANCEIRO_BUSCA_PLANO_CONTAS_STORE);

    function RetornaFiltros_TB_PLANOS_JsonData() {
        var _pesquisa = Ext.getCmp('TB_PLANOS_TXT_PESQUISA') ?
                            Ext.getCmp('TB_PLANOS_TXT_PESQUISA').getValue() : '';

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_PLANO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Planos() {
        TB_PLANO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PLANOS_JsonData());
        TB_PLANO_PagingToolbar.doRequest();
    }

    var TB_PLANOS_TXT_PESQUISA = new Ext.form.TextField({
        id: 'TB_PLANOS_TXT_PESQUISA',
        name: 'TB_PLANOS_TXT_PESQUISA',
        labelWidth: 100,
        fieldLabel: 'Plano de Contas',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Planos();
                }
            }
        }
    });

    var TB_PLANOS_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Planos();
        }
    });

    fsBuscaPlanoContas.add({
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .18,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Plano de Contas'
            }, {
                columnWidth: .35,
                items: [TB_PLANOS_TXT_PESQUISA]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_PLANOS_BTN_PESQUISA]
            }]
        }, gridFINANCEIRO_Planos, TB_PLANO_PagingToolbar.PagingToolbar()]
    });

    return fsBuscaPlanoContas;
}

function Pagamento_Parcial() {
    var _NUMERO_FINANCEIRO;

    var TXT_DATA_PAGAMENTO_PARCIAL = new Ext.form.DateField({
        id: 'DATA_PAGTO',
        name: 'DATA_PAGTO',
        layout: 'form',
        fieldLabel: 'Data de Pagamento',
        readOnly: true
    });

    var _dataPagto = new Date();
    TXT_DATA_PAGAMENTO_PARCIAL.setValue(_dataPagto);

    var TXT_VALOR_PAGO = new Ext.form.NumberField({
        fieldLabel: 'Valor',
        name: 'VALOR_PAGTO',
        id: 'VALOR_PAGTO',
        width: 100,
        decimalSeparator: ',',
        decimalPrecision: 2,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {

                }
            }
        }
    });

    var BTN_SALVAR_PAGAMENTO_PARCIAL = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'medium',
        handler: function () {
            GravaPagtoParcial();
        }
    });

    var BTN_DELETAR_PAGAMENTO_PARCIAL = new Ext.Button({
        text: 'Deletar',
        icon: 'imagens/icones/database_delete_24.gif',
        scale: 'medium',
        handler: function () {
            if (Ext.getCmp('gridPG').getSelectionModel().getCount() > 0) {
                var record = Ext.getCmp('gridPG').getSelectionModel().getSelected();

                DeletaPagtoParcial(record);
            }
            else {
                dialog.MensagemDeAlerta('Selecione um item para deletar');
            }
        }
    });

    var BTN_CANCELAR_PAGAMENTO_PARCIAL = new Ext.Button({
        id: 'BTN_CANCELAR_PAGAMENTO_PARCIAL',
        text: 'Cancelar',
        icon: 'imagens/icones/database_cancel_24.gif',
        scale: 'medium',
        disabled: true,
        handler: function () {
            Ext.getCmp('formPagamentoParcial').getForm().reset();
            Ext.getCmp('wPagamentoParcial').setTitle('Novo Pagamento Parcial');
            Ext.getCmp('VALOR_PAGTO').focus();
            BTN_CANCELAR_PAGAMENTO_PARCIAL.disable();
        }
    });

    var LBL_VALOR_TOTAL = new Ext.form.Label({
        id: 'LBL_VALOR_TOTAL'
    });

    var record2 = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

    LBL_VALOR_TOTAL.setText("<span style='font-size: 11pt; color: #000066;'>Valor Total do T&iacute;tulo: " + FormataValor2(record2.data.VALOR) + "</span>", false);

    var formPagamentoParcial = new Ext.form.FormPanel({
        id: 'formPagamentoParcial',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.26,
                layout: 'form',
                items: [TXT_DATA_PAGAMENTO_PARCIAL]
            }, {
                columnWidth: 0.25,
                layout: 'form',
                items: [TXT_VALOR_PAGO]
            }, {
                columnWidth: 0.45,
                items: [LBL_VALOR_TOTAL]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.16,
                items: [BTN_SALVAR_PAGAMENTO_PARCIAL]
            }, {
                columnWidth: 0.16,
                items: [BTN_DELETAR_PAGAMENTO_PARCIAL]
            }, {
                columnWidth: 0.16,
                items: [BTN_CANCELAR_PAGAMENTO_PARCIAL]
            }]
        }]
    });

    var TB_PG_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                ['NUMERO_FINANCEIRO', 'DATA_PAGTO', 'VALOR_PAGTO']
                )
    });

    var gridPG = new Ext.grid.GridPanel({
        id: 'gridPG',
        store: TB_PG_Store,
        columns: [
                    { id: 'NUMERO_FINANCEIRO', header: "Numero", width: 100, sortable: true, dataIndex: 'NUMERO_FINANCEIRO', hidden: true },
                    { id: 'DATA_PAGTO', header: "Data do Pagamento", width: 160, sortable: true, dataIndex: 'DATA_PAGTO', renderer: XMLParseDateTime },
                    { id: 'VALOR_PAGTO', header: "Valor do Pagamento", width: 180, sortable: true, dataIndex: 'VALOR_PAGTO', renderer: FormataValor }
                    ],
        stripeRows: true,
        height: 264,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridPG.getSelectionModel().getSelections().length > 0) {
                        var record = gridPG.getSelectionModel().getSelected();
                        PopulaFormPagto(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormPagto(record);
            }
        }
    });

    function PopulaFormPagto(record) {
        formPagamentoParcial.getForm().loadRecord(record);
        Ext.getCmp('wPagamentoParcial').setTitle("Alterar Pagamento Parcial");
        Ext.getCmp('DATA_PAGTO').setRawValue(XMLParseDate(record.data.DATA_PAGTO));
        Ext.getCmp('VALOR_PAGTO').focus();

        BTN_CANCELAR_PAGAMENTO_PARCIAL.enable();
    }

    function RetornaPG_JsonData() {
        var CP_JsonData = {
            NUMERO_FINANCEIRO: _NUMERO_FINANCEIRO,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CP_JsonData;
    }

    var PG_PagingToolbar = new Th2_PagingToolbar();
    PG_PagingToolbar.setUrl('servicos/TB_PAGTO_PARCIAL.asmx/Carrega_PAGTOS');
    PG_PagingToolbar.setParamsJsonData(RetornaPG_JsonData());
    PG_PagingToolbar.setStore(TB_PG_Store);

    function TB_PAGTO_PARCIAL_CARREGA_GRID() {
        PG_PagingToolbar.setParamsJsonData(RetornaPG_JsonData());
        PG_PagingToolbar.doRequest();
    }

    var wPagamentoParcial = new Ext.Window({
        id: 'wPagamentoParcial',
        renderTo: Ext.getBody(),
        title: 'Novo Pagamento Parcial',
        width: 590,
        height: 420,
        iconCls: 'Pagamento_Parcial',
        modal: true,
        closable: false,
        minimizable: true,
        draggable: true,
        resizable: false,
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [formPagamentoParcial, gridPG, PG_PagingToolbar.PagingToolbar()]
    });

    this.show = function (elem, pNUMERO) {
        _NUMERO_FINANCEIRO = pNUMERO;

        wPagamentoParcial.show(elem);
        TB_PAGTO_PARCIAL_CARREGA_GRID();
    }

    function GravaPagtoParcial() {
        if (!formPagamentoParcial.getForm().isValid())
            return;

        var _data;

        if (wPagamentoParcial.title == "Novo Pagamento Parcial") {
            _data = '';
        }
        else {
            var record = gridPG.getSelectionModel().getSelected();
            _data = XMLParseDateTime(record.data.DATA_PAGTO);
        }

        var dados = {
            NUMERO_FINANCEIRO: _NUMERO_FINANCEIRO,
            DATA_PAGTO: _data,
            VALOR_PAGTO: Ext.getCmp('VALOR_PAGTO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = wPagamentoParcial.title == "Novo Pagamento Parcial" ?
                        'servicos/TB_PAGTO_PARCIAL.asmx/GravaNovoPAGTO' :
                        'servicos/TB_PAGTO_PARCIAL.asmx/AtualizaPAGTO';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('DATA_PAGTO').focus();
            formPagamentoParcial.getForm().reset();

            Ext.getCmp('wPagamentoParcial').setTitle("Novo Pagamento Parcial");
            BTN_CANCELAR_PAGAMENTO_PARCIAL.disable();

            var record1 = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

            record1.beginEdit();
            record1.set('PAGTO_PARCIAL', 1);
            record1.set('VALOR_PAGO_PARCIAL', result);
            record1.endEdit();
            record1.commit();

            TB_PAGTO_PARCIAL_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function DeletaPagtoParcial(record) {
        dialog.MensagemDeConfirmacao('Deseja deletar este registro?', '', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PAGTO_PARCIAL.asmx/DeletaPAGTO');
                _ajax.setJsonData({
                    NUMERO_FINANCEIRO: _NUMERO_FINANCEIRO,
                    DATA_PAGTO: XMLParseDateTime(record.data.DATA_PAGTO),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    var record1 = Ext.getCmp('gridFinanceiro').getSelectionModel().getSelected();

                    record1.beginEdit();
                    record1.set('PAGTO_PARCIAL', result.PAGTO_PARCIAL);
                    record1.set('VALOR_PAGO_PARCIAL', result.VALOR_PAGO_PARCIAL);
                    record1.endEdit();
                    record1.commit();

                    TB_PAGTO_PARCIAL_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }
}

function gera_Boleto() {

    var _NUMEROS_FINANCEIRO;

    this.NUMEROS_FINANCEIRO = function (pValue) {
        _NUMEROS_FINANCEIRO = pValue;
    };


    CARREGA_COMBO_BANCO();

    var AGENCIA_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_BANCO', 'NUMERO_AGENCIA', 'NUMERO_CONTA', 'AGENCIA_CONTA'])
    });

    function Carrega_Agencia(NUMERO_BANCO) {
        var _ajax = new Th2_Ajax();
        _ajax.setJsonData({
            NUMERO_BANCO: NUMERO_BANCO,
            ID_USUARIO: _ID_USUARIO
        });

        _ajax.setUrl('servicos/TB_CONTA_CORRENTE.asmx/Lista_Agencia');

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            AGENCIA_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var combo_TIPO_COBRANCA_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['COD_TIPO_COBRANCA', 'DESCRICAO_TIPO_COBRANCA'])
    });

    function CARREGA_COMBO_TIPO_COBRANCA(NUMERO_BANCO) {
        var _ajax = new Th2_Ajax();

        _ajax.setUrl('servicos/TB_TIPO_COBRANCA.asmx/Carrega_Tipos');
        _ajax.setJsonData({
            NUMERO_BANCO: NUMERO_BANCO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            combo_TIPO_COBRANCA_STORE.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var combo_NUMERO_BANCO = new Ext.form.ComboBox({
        store: combo_TB_BANCO_STORE,
        fieldLabel: 'Banco',
        valueField: 'NUMERO_BANCO',
        displayField: 'NOME_BANCO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                Carrega_Agencia(record.data.NUMERO_BANCO);
                CARREGA_COMBO_TIPO_COBRANCA(record.data.NUMERO_BANCO);
            }
        }
    });

    var combo_AGENCIA = new Ext.form.ComboBox({
        store: AGENCIA_STORE,
        fieldLabel: 'Ag&ecirc;ncia - Conta Corrente',
        valueField: 'NUMERO_AGENCIA',
        displayField: 'AGENCIA_CONTA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false
    });

    var combo_TIPO_COBRANCA = new Ext.form.ComboBox({
        store: combo_TIPO_COBRANCA_STORE,
        fieldLabel: 'Tipo de Cobran&ccedil;a',
        valueField: 'COD_TIPO_COBRANCA',
        displayField: 'DESCRICAO_TIPO_COBRANCA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        allowBlank: false,
        width: 250
    });

    var BTN_GERAR = new Ext.Button({
        text: 'Gerar boleto(s)',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function (btn) {
            Envia(btn);
        }
    });

    var TXT_DATA1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Per&iacute;odo de',
        allowBlank: false
    });

    var TXT_DATA2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'at&eacute;',
        allowBlank: false
    });

    var form1 = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: '100%',
        items: [{
            xtype: 'fieldset',
            title: 'Dados banc&aacute;rios',
            checkboxToggle: false,
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '95%',
            items: [{
                layout: 'form',
                items: [combo_NUMERO_BANCO]
            }, {
                layout: 'form',
                items: [combo_AGENCIA]
            }, {
                layout: 'form',
                items: [combo_TIPO_COBRANCA]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Relat&oacute;rio de servi&ccedil;os',
            checkboxToggle: false,
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '95%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .40,
                    layout: 'form',
                    items: [TXT_DATA1]
                }, {
                    columnWidth: .40,
                    layout: 'form',
                    items: [TXT_DATA2]
                }]
            }]
        }, {
            items: [BTN_GERAR]
        }]
    });

    var wJanela = new Ext.Window({
        renderTo: Ext.getBody(),
        title: 'Gerar boleto banc&aacute;rio',
        iconCls: 'Cancelamento_Nota',
        width: 350,
        height: 381,
        modal: true,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        items: [form1],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Envia(btn) {
        if (!form1.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_FINANCEIRO.asmx/geraBoleto_Itau');

        var agencia = combo_AGENCIA.getRawValue() + "";

        _ajax.setJsonData({
            NUMEROS_FINANCEIRO: _NUMEROS_FINANCEIRO,
            ID_EMPRESA: _ID_EMPRESA,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
            NUMERO_BANCO: combo_NUMERO_BANCO.getValue(),
            AGENCIA: agencia.substr(0, agencia.indexOf(" - ")),
            CONTA_CORRENTE: agencia.substring(agencia.indexOf(" - ") + 3, agencia.length),
            CARTEIRA: combo_TIPO_COBRANCA.getValue(),
            DATA1: TXT_DATA1.getRawValue(),
            DATA2: TXT_DATA2.getRawValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            dialog.MensagemDeAlerta('O(s) boleto(s) foram gerado(s) com sucesso.<br /> Consulte os rascunhos do seu e-mail', btn.getId());

            wJanela.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.show = function (elm) {
        wJanela.show(elm.getId());
    };
}

function Une_titulos_do_cliente() {

    var _acao;

    this.acao = function (pValue) {
        _acao = pValue;
    };

    var TXT_VENCIMENTO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Vencimento',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.isValid()) {
                        _acao(f.getRawValue());
                        wAnalise.close();
                    }
                }
            }
        }
    });

    var BTN_OK = new Ext.Button({
        text: 'Confirmar',
        icon: 'imagens/icones/database_ok_24.gif',
        scale: 'large',
        handler: function () {
            if (TXT_VENCIMENTO.isValid()) {
                _acao(TXT_VENCIMENTO.getRawValue());
                wAnalise.close();
            }
        }
    });

    var form1 = new Ext.form.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            collapsible: false,
            autoHeight: true,
            width: '98%',
            items: [{
                layout: 'column',
                items: [{
                    layout: 'form',
                    labelWidth: 70,
                    columnWidth: .60,
                    items: [TXT_VENCIMENTO]
                }, {
                    columnWidth: .40,
                    items: [BTN_OK]
                }]
            }]
        }]
    });

    var wAnalise = new Ext.Window({
        layout: 'form',
        title: 'Unir t&iacute;tulos do mesmo cliente',
        width: 295,
        height: 130,
        closable: true,
        draggable: true,
        minimizable: false,
        resizable: false,
        modal: true,
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [form1]
    });

    this.show = function (elm) {
        wAnalise.show(elm.getId());
    };
}