function MontaPanel_NotaSaida1() {

    var TXT_NUMERO_SEQ = new Ext.form.TextField({
        fieldLabel: 'Numero Sequencial',
        name: 'NUMERO_SEQ',
        id: 'NUMERO_SEQ',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12' },
        readOnly: true
    });

    var TXT_NUMERO_NF = new Ext.form.NumberField({
        fieldLabel: 'Numero da NF',
        name: 'NUMERO_NF',
        id: 'NUMERO_NF',
        width: 90,
        maxLength: 12,
        minValue: 0,
        decimalPrecision: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12' }
    });

    var TXT_DATA_EMISSAO_NF = new Ext.form.DateField({
        fieldLabel: 'Data de Emiss&atilde;o',
        name: 'DATA_EMISSAO_NF',
        id: 'DATA_EMISSAO_NF',
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_NUMERO_PEDIDO_NF = new Ext.form.TextField({
        fieldLabel: 'Numero do Pedido',
        name: 'NUMERO_PEDIDO_NF',
        id: 'NUMERO_PEDIDO_NF',
        width: 200,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' }
    });

    var _dt1 = new Date();
    TXT_DATA_EMISSAO_NF.setValue(_dt1.dateFormat('d/m/Y'));

    //////////////////// Cliente / Busca

    var TXT_CODIGO_CLIENTE_NF = new Ext.form.NumberField({
        fieldLabel: 'C&oacute;digo do <br />Cliente',
        name: 'CODIGO_CLIENTE_NF',
        id: 'CODIGO_CLIENTE_NF',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false
    });

    var LBL_DADOS_CLIENTE = new Ext.form.Label({
        name: 'LBL_DADOS_CLIENTE',
        id: 'LBL_DADOS_CLIENTE',
        html: '&nbsp;'
    });

    TXT_CODIGO_CLIENTE_NF.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            CarregaDadosCliente(f);
        }
        else if (e.getKey() == e.TAB) {
            if (f.getValue().length > 0)
                CarregaDadosCliente(f);
        }
    });

    function CarregaDadosCliente(f) {
        if (f.getValue() == '') {
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Busca_Dados_do_Cliente');
        _ajax.setJsonData({ ID_CLIENTE: f.getValue(), ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            LBL_DADOS_CLIENTE.setText(result.DadosCliente, false);

            Ext.getCmp('CODIGO_CP_NF').setValue(result.CODIGO_CP_NF);
            Ext.getCmp('CODIGO_VENDEDOR_NF').setValue(result.CODIGO_VENDEDOR_NF);

            fsBuscaCliente_NOTA_SAIDA.collapse();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
    /////////////////////////

    var fsBuscaCliente_NOTA_SAIDA = new Ext.form.FieldSet({
        id: 'fsBuscaCliente_NOTA_SAIDA',
        title: 'Busca de Cliente',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE').focus();
            }
        }
    });

    //////////////////////////////////
    var TB_NOTA_SAIDA_BUSCA_CLIENTE_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'NOME_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'CNPJ_CLIENTE', 'IE_CLIENTE', 'ENDERECO_FATURA',
                'NUMERO_END_FATURA', 'COMP_END_FATURA', 'CEP_FATURA', 'BAIRRO_FATURA', 'NOME_MUNICIPIO', 'DESCRICAO_UF', 'TELEFONE_FATURA',
                'CODIGO_CP_CLIENTE', 'DESCRICAO_CP', 'CODIGO_VENDEDOR_CLIENTE', 'NOME_VENDEDOR']
           )
    });

    var gridNF_SAIDA_Cliente = new Ext.grid.GridPanel({
        id: 'gridNF_SAIDA_Cliente',
        store: TB_NOTA_SAIDA_BUSCA_CLIENTE_STORE,
        columns: [
            { id: 'ID_CLIENTE', header: "C&oacute;digo", width: 55, sortable: true, dataIndex: 'ID_CLIENTE' },
            { id: 'NOME_CLIENTE', header: "Razão Social", width: 240, sortable: true, dataIndex: 'NOME_CLIENTE' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Nome Fantasia", width: 195, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
            { id: 'CNPJ_CLIENTE', header: "CNPJ", width: 130, sortable: true, dataIndex: 'CNPJ_CLIENTE', hidden: true },
            { id: 'IE_CLIENTE', header: "Inscri&ccedil;&atilde;o Estadual", width: 120, sortable: true, dataIndex: 'IE_CLIENTE', hidden: true },
            { id: 'ENDERECO_FATURA', header: "Endere&ccedil;o de Faturamento", width: 300, sortable: true, dataIndex: 'ENDERECO_FATURA', hidden: true },
            { id: 'NUMERO_END_FATURA', header: "Numero", width: 70, sortable: true, dataIndex: 'NUMERO_END_FATURA', hidden: true },
            { id: 'COMP_END_FATURA', header: "Complemento", width: 100, sortable: true, dataIndex: 'COMP_END_FATURA', hidden: true },
            { id: 'CEP_FATURA', header: "CEP", width: 80, sortable: true, dataIndex: 'CEP_FATURA', hidden: true },
            { id: 'BAIRRO_FATURA', header: "Bairro", width: 170, sortable: true, dataIndex: 'BAIRRO_FATURA', hidden: true },
            { id: 'NOME_MUNICIPIO', header: "Munic&iacute;pio", width: 220, sortable: true, dataIndex: 'NOME_MUNICIPIO', hidden: true },
            { id: 'DESCRICAO_UF', header: "Estado", width: 100, sortable: true, dataIndex: 'DESCRICAO_UF', hidden: true },
            { id: 'TELEFONE_FATURA', header: "Telefone", width: 150, sortable: true, dataIndex: 'TELEFONE_FATURA', hidden: true },
            { id: 'CODIGO_CP_CLIENTE', header: "C&oacute;odigo Cond. Pagto.", width: 120, sortable: true, dataIndex: 'CODIGO_CP_CLIENTE', hidden: true },
            { id: 'DESCRICAO_CP', header: "Cond. de Pagto.", width: 220, sortable: true, dataIndex: 'DESCRICAO_CP', hidden: true },
            { id: 'CODIGO_VENDEDOR_CLIENTE', header: "C&oacute;digo Vendedor", width: 100, sortable: true, dataIndex: 'CODIGO_VENDEDOR_CLIENTE', hidden: true },
            { id: 'NOME_VENDEDOR', header: "Nome do Vendedor", width: 200, sortable: true, dataIndex: 'NOME_VENDEDOR', hidden: true }
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
                        Ext.getCmp('CODIGO_CLIENTE_NF').setValue(record.data.ID_CLIENTE);
                        var f = Ext.getCmp('CODIGO_CLIENTE_NF');
                        CarregaDadosCliente(f);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                Ext.getCmp('CODIGO_CLIENTE_NF').setValue(record.data.ID_CLIENTE);
                var f = Ext.getCmp('CODIGO_CLIENTE_NF');
                CarregaDadosCliente(f);
            }
        }
    });

    var TB_NOTA_SAIDA_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    TB_NOTA_SAIDA_CLIENTE_PagingToolbar.setUrl('servicos/TB_NOTA_SAIDA.asmx/ListaClientes_GridPesquisa');
    TB_NOTA_SAIDA_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_TRANSP_JsonData());
    TB_NOTA_SAIDA_CLIENTE_PagingToolbar.setStore(TB_NOTA_SAIDA_BUSCA_CLIENTE_STORE);

    function RetornaFiltros_TB_CLIENTE_TRANSP_JsonData() {
        var _pesquisa = Ext.getCmp('TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE') ?
                            Ext.getCmp('TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE').getValue() : '';

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_NOTA_SAIDA_CLIENTE_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Cliente_TB_NOTA_SAIDA() {
        TB_NOTA_SAIDA_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_TRANSP_JsonData());
        TB_NOTA_SAIDA_CLIENTE_PagingToolbar.doRequest();
    }

    var TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE = new Ext.form.TextField({
        id: 'TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE',
        name: 'TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE',
        labelWidth: 120,
        fieldLabel: 'Nome do Cliente',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Cliente_TB_NOTA_SAIDA();
                }
            }
        }
    });

    var TB_NOTA_SAIDA_BTN_PESQUISA_CLIENTE = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Cliente_TB_NOTA_SAIDA();
        }
    });

    fsBuscaCliente_NOTA_SAIDA.add({
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
                text: 'Nome do Cliente:'
            }, {
                columnWidth: .35,
                items: [TB_NOTA_SAIDA_TXT_PESQUISA_CLIENTE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_NOTA_SAIDA_BTN_PESQUISA_CLIENTE]
            }]
        }, gridNF_SAIDA_Cliente, TB_NOTA_SAIDA_CLIENTE_PagingToolbar.PagingToolbar()]
    });


    TB_COND_PAGTO_CARREGA_COMBO();

    var combo_CODIGO_CP_NF = new Ext.form.ComboBox({
        store: combo_TB_COND_PAGTO_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        name: 'CODIGO_CP_NF',
        id: 'CODIGO_CP_NF',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 425,
        allowBlank: false
    });

    var TXT_DADOS_ADICIONAIS_NF = new Ext.form.TextField({
        id: 'DADOS_ADICIONAIS_NF',
        name: 'DADOS_ADICIONAIS_NF',
        fieldLabel: 'Dados Adicionais',
        anchor: '90%',
        height: 60,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    TB_USUARIO_CARREGA_VENDEDORES();

    var combo_CODIGO_VENDEDOR_NF = new Ext.form.ComboBox({
        store: combo_TB_VENDEDORES_Store,
        fieldLabel: 'Vendedor(a)',
        id: 'CODIGO_VENDEDOR_NF',
        name: 'CODIGO_VENDEDOR_NF',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione o Vendedor aqui...',
        allowBlank: false,
        selectOnFocus: true,
        width: 220
    });

    var formNotaSaida1 = new Ext.FormPanel({
        id: 'formNotaSaida1',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 600,
        items: [{
            layout: 'form',
            labelAlign: 'top',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.15,
                    layout: 'form',
                    labelWidth: 110,
                    items: [TXT_NUMERO_SEQ]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    labelWidth: 90,
                    items: [TXT_NUMERO_NF]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    items: [TXT_DATA_EMISSAO_NF]
                }, {
                    columnWidth: 0.30,
                    layout: 'form',
                    items: [TXT_NUMERO_PEDIDO_NF]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.10,
                    layout: 'form',
                    items: [TXT_CODIGO_CLIENTE_NF]
                }, {
                    columnWidth: 0.35,
                    layout: 'form',
                    items: [LBL_DADOS_CLIENTE]
                }, {
                    columnWidth: 0.55,
                    items: [fsBuscaCliente_NOTA_SAIDA]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.36,
                    layout: 'form',
                    items: [combo_CODIGO_CP_NF]
                }, {
                    columnWidth: 0.24,
                    layout: 'form',
                    items: [combo_CODIGO_VENDEDOR_NF]
                }]
            }, {
                layout: 'form',
                items: [TXT_DADOS_ADICIONAIS_NF]
            }]
        }]
    });


    var buttonGroup_NOTA_SAIDA1 = new Ext.ButtonGroup({
        id: 'buttonGroup_NOTA_SAIDA1',
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_NOTA_SAIDA();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Nova Nota Fiscal',
                icon: 'imagens/icones/database_fav_24.gif',
                scale: 'medium',
                handler: function () {
                    PreparaNovaNotaSaida();
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
             {
                 id: 'BTN_DELETAR_TB_NOTA_SAIDA',
                 text: 'Deletar',
                 icon: 'imagens/icones/database_delete_24.gif',
                 scale: 'medium',
                 disabled: true,
                 handler: function () {
                     Deleta_TB_NOTA_FISCAL_SAIDA();
                 }
             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
             {
                 id: 'BTN_PARCELAS_TB_NOTA_SAIDA',
                 text: 'Vencimentos',
                 icon: 'imagens/icones/calendar_24.gif',
                 scale: 'medium',
                 disabled: true,
                 handler: function () {
                     _vencimentos.NUMERO_SEQ(Ext.getCmp('NUMERO_SEQ').getValue());
                     _vencimentos.show('BTN_PARCELAS_TB_NOTA_SAIDA');
                 }
             }]
    });

    var toolbar_TB_NOTA_FISCAL_SAIDA = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_NOTA_SAIDA1]
    });

    var panelNotaSaida1 = new Ext.Panel({
        id: 'panelNotaSaida1',
        width: '100%',
        border: true,
        title: 'Nova Nota Fiscal',
        items: [formNotaSaida1, toolbar_TB_NOTA_FISCAL_SAIDA]
    });

    function GravaDados_TB_NOTA_SAIDA() {
        if (!formNotaSaida1.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_SEQ: formNotaSaida1.getForm().findField('NUMERO_SEQ').getValue(),
            NUMERO_NF: TXT_NUMERO_NF.getValue(),
            SERIE_NF: '',

            IE_SUBST_TRIB_NF: '',
            CODIGO_CLIENTE_NF: formNotaSaida1.getForm().findField('CODIGO_CLIENTE_NF').getValue(),

            DATA_EMISSAO_NF: formNotaSaida1.getForm().findField('DATA_EMISSAO_NF').getValue(),

            CODIGO_CP_NF: formNotaSaida1.getForm().findField('CODIGO_CP_NF').getValue(),

            BASE_ISS_NF: 0,
            VALOR_ISS_NF: 0,
            TOTAL_ISS_NF: 0,
            TOTAL_NF: 0,

            DADOS_ADICIONAIS_NF: formNotaSaida1.getForm().findField('DADOS_ADICIONAIS_NF').getValue(),
            CODIGO_VENDEDOR_NF: formNotaSaida1.getForm().findField('CODIGO_VENDEDOR_NF').getValue(),

            NUMERO_PEDIDO_NF: formNotaSaida1.getForm().findField('NUMERO_PEDIDO_NF').getValue(),

            CHAVE_ACESSO_NF: '',
            PROTOCOLO_AUTORIZACAO_NF: '',

            SERIE: _SERIE,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelNotaSaida1.title == "Nova Nota Fiscal" ?
                        'servicos/TB_NOTA_SAIDA.asmx/GravaNovaNotaSaida' :
                        'servicos/TB_NOTA_SAIDA.asmx/AtualizaNotaSaida';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (panelNotaSaida1.title == "Nova Nota Fiscal") {
                formNotaSaida1.getForm().findField('NUMERO_SEQ').setValue(result);

                Ext.getCmp('CODIGO_CLIENTE_NF').disable();

                panelNotaSaida1.setTitle('Alterar dados da Nota Fiscal');

                Ext.getCmp('tabNotasFiscais').items.items[2].enable();
                Ext.getCmp('tabNotasFiscais').setActiveTab(2);

                Ext.getCmp('BTN_DELETAR_TB_NOTA_SAIDA').enable();
                Ext.getCmp('BTN_PARCELAS_TB_NOTA_SAIDA').enable();

                Ext.getCmp('CODIGO_PRODUTO_ITEM_NF').focus();
            }
            else {
                Ext.getCmp('DADOS_ADICIONAIS_NF').setValue(result);
                Ext.getCmp('NUMERO_PEDIDO_NF').focus();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_NOTA_FISCAL_SAIDA() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Nota Fiscal?', 'formNotaSaida1', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/DeletaNotaSaida');
                _ajax.setJsonData({ NUMERO_SEQ: Ext.getCmp('NUMERO_SEQ').getValue(), ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    PreparaNovaNotaSaida();

                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();
                    Ext.getCmp('gridNotaSaida').getStore().remove(record);

                    Ext.getCmp('gridItemNotaSaida').getStore().removeAll();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    panelNotaSaida1.setHeight(AlturaDoPainelDeConteudo(85));
    formNotaSaida1.setHeight(AlturaDoPainelDeConteudo(152));

    return panelNotaSaida1;
}

function PreparaNovaNotaSaida() {
    Ext.getCmp('formNotaSaida1').getForm().reset();

    Ext.getCmp('LBL_DADOS_CLIENTE').setText('&nbsp;', false);

    Ext.getCmp('CODIGO_CLIENTE_NF').enable();
    Ext.getCmp('fsBuscaCliente_NOTA_SAIDA').enable();

    Ext.getCmp('panelNotaSaida1').setTitle('Nova Nota Fiscal');

    Ext.getCmp('tabNotasFiscais').items.items[2].disable()
    Ext.getCmp('tabNotasFiscais').setActiveTab(1);

    Ext.getCmp('BTN_DELETAR_TB_NOTA_SAIDA').disable();
    Ext.getCmp('BTN_PARCELAS_TB_NOTA_SAIDA').disable();

    Ext.getCmp('CODIGO_CLIENTE_NF').focus();

    _nota_alterada_cancelada = false;

    if (_nota_alterada_cancelada)
        Ext.getCmp('buttonGroup_NOTA_SAIDA1').disable();
    else
        Ext.getCmp('buttonGroup_NOTA_SAIDA1').enable();
}

function PreparaNotaSaidaAlteracao(NUMERO_SEQ) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/BuscaPorNumeroSequencial');
    _ajax.setJsonData({ NUMERO_SEQ: NUMERO_SEQ, ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        Ext.getCmp('tabNotasFiscais').setActiveTab(1);
        Ext.getCmp('tabNotasFiscais').items.items[2].enable();

        var result = Ext.decode(response.responseText).d;

        Ext.getCmp('NUMERO_SEQ').setValue(result.NUMERO_SEQ);
        Ext.getCmp('NUMERO_NF').setValue(result.NUMERO_NF);
        Ext.getCmp('DATA_EMISSAO_NF').setValue(result.DATA_EMISSAO_NF);
        Ext.getCmp('NUMERO_PEDIDO_NF').setValue(result.NUMERO_PEDIDO_NF);
        Ext.getCmp('CODIGO_CLIENTE_NF').setValue(result.CODIGO_CLIENTE_NF);

        Ext.getCmp('CODIGO_CLIENTE_NF').disable();
        Ext.getCmp('fsBuscaCliente_NOTA_SAIDA').disable();

        Ext.getCmp('CODIGO_CP_NF').setValue(result.CODIGO_CP_NF);
        Ext.getCmp('CODIGO_VENDEDOR_NF').setValue(result.CODIGO_VENDEDOR_NF);
        Ext.getCmp('DADOS_ADICIONAIS_NF').setValue(result.DADOS_ADICIONAIS_NF);

        Ext.getCmp('LBL_DADOS_CLIENTE').setText(result.DadosCliente, false);

        Ext.getCmp('panelNotaSaida1').setTitle("Alterar dados da Nota Fiscal");
        Ext.getCmp('tabNotasFiscais').items.items[1].enable();
        Ext.getCmp('tabNotasFiscais').items.items[2].enable();

        Ext.getCmp('BTN_DELETAR_TB_NOTA_SAIDA').enable();
        Ext.getCmp('BTN_PARCELAS_TB_NOTA_SAIDA').enable();

        Ext.getCmp('fsBuscaCliente_NOTA_SAIDA').collapse();

        if (_nota_alterada_cancelada)
            Ext.getCmp('buttonGroup_NOTA_SAIDA1').disable();
        else
            Ext.getCmp('buttonGroup_NOTA_SAIDA1').enable();

        Ext.getCmp('NUMERO_PEDIDO_NF').focus();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}
