function CarregaDadosCliente(f) {

    var _codigo = !f.isValid() ? 0 : f.getValue();

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Busca_Dados_do_Cliente');

    _ajax.setJsonData({ ID_CLIENTE: _codigo, ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        Ext.getCmp('DADOS_CLIENTE_ORCAMENTO').setText(result.DadosCliente, false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Monta_Orcamento() {
    var TXT_NUMERO_ORCAMENTO = new Ext.form.NumberField({
        fieldLabel: 'Numero do Or&ccedil;amento',
        name: 'NUMERO_ORCAMENTO',
        id: 'NUMERO_ORCAMENTO',
        width: 90,
        readOnly: true
    });

    var fsBuscaCliente_ORCAMENTO = new Ext.form.FieldSet({
        title: 'Busca de Cliente',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('ORCAMENTO_TXT_PESQUISA_CLIENTE').focus();
            }
        }
    });

    /////////////////////////////////

    var ORCAMENTO_BUSCA_CLIENTE_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'NOME_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'CNPJ_CLIENTE', 'IE_CLIENTE', 'ENDERECO_FATURA',
                'NUMERO_END_FATURA', 'COMP_END_FATURA', 'CEP_FATURA', 'BAIRRO_FATURA', 'NOME_MUNICIPIO', 'DESCRICAO_UF', 'TELEFONE_FATURA',
                'CODIGO_CFOP_CLIENTE', 'CODIGO_CP_CLIENTE', 'DESCRICAO_CP', 'CODIGO_TRANSP_CLIENTE', 'NOME_TRANSP', 'NOME_FANTASIA_TRANSP',
                'TELEFONE1_TRANSP', 'TELEFONE2_TRANSP', 'CONTATO_TRANSP', 'CODIGO_VENDEDOR_CLIENTE', 'NOME_VENDEDOR']
           )
    });

    var grid_BUSCA_Cliente = new Ext.grid.GridPanel({
        id: 'grid_BUSCA_Cliente',
        store: ORCAMENTO_BUSCA_CLIENTE_STORE,
        columns: [
            { id: 'ID_CLIENTE', header: "C&oacute;digo", width: 55, sortable: true, dataIndex: 'ID_CLIENTE' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Nome Fantasia", width: 195, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
            { id: 'NOME_CLIENTE', header: "Razão Social", width: 240, sortable: true, dataIndex: 'NOME_CLIENTE' },
            { id: 'CNPJ_CLIENTE', header: "CNPJ", width: 130, sortable: true, dataIndex: 'CNPJ_CLIENTE', hidden: true },
            { id: 'IE_CLIENTE', header: "Inscri&ccedil;&atilde;o Estadual", width: 120, sortable: true, dataIndex: 'IE_CLIENTE', hidden: true },
            { id: 'ENDERECO_FATURA', header: "Endere&ccedil;o de Faturamento", width: 300, sortable: true, dataIndex: 'ENDERECO_FATURA', hidden: true },
            { id: 'NUMERO_END_FATURA', header: "Numero", width: 70, sortable: true, dataIndex: 'NUMERO_END_FATURA', hidden: true },
            { id: 'COMP_END_FATURA', header: "Complemento", width: 100, sortable: true, dataIndex: 'COMP_END_FATURA', hidden: true },
            { id: 'CEP_FATURA', header: "CEP", width: 80, sortable: true, dataIndex: 'CEP_FATURA', hidden: true },
            { id: 'BAIRRO_FATURA', header: "Bairro", width: 170, sortable: true, dataIndex: 'BAIRRO_FATURA', hidden: true },
            { id: 'NOME_MUNICIPIO', header: "Munic&iacute;pio", width: 220, sortable: true, dataIndex: 'NOME_MUNICIPIO' },
            { id: 'DESCRICAO_UF', header: "Estado", width: 100, sortable: true, dataIndex: 'DESCRICAO_UF' },
            { id: 'TELEFONE_FATURA', header: "Telefone", width: 150, sortable: true, dataIndex: 'TELEFONE_FATURA' },
            { id: 'CODIGO_CFOP_CLIENTE', header: "CFOP", width: 70, sortable: true, dataIndex: 'CODIGO_CFOP_CLIENTE', hidden: true },
            { id: 'CODIGO_CP_CLIENTE', header: "C&oacute;odigo Cond. Pagto.", width: 120, sortable: true, dataIndex: 'CODIGO_CP_CLIENTE', hidden: true },
            { id: 'DESCRICAO_CP', header: "Cond. de Pagto.", width: 220, sortable: true, dataIndex: 'DESCRICAO_CP', hidden: true },
            { id: 'CODIGO_TRANSP_CLIENTE', header: "C&oacute;digo Transp.", width: 120, sortable: true, dataIndex: 'CODIGO_TRANSP_CLIENTE', hidden: true },
            { id: 'NOME_TRANSP', header: "Transportadora", width: 250, sortable: true, dataIndex: 'NOME_TRANSP', hidden: true },
            { id: 'NOME_FANTASIA_TRANSP', header: "Nome Fantasia", width: 160, sortable: true, dataIndex: 'NOME_FANTASIA_TRANSP', hidden: true },
            { id: 'TELEFONE1_TRANSP', header: "Telefone 1", width: 140, sortable: true, dataIndex: 'TELEFONE1_TRANSP', hidden: true },
            { id: 'TELEFONE2_TRANSP', header: "Telefone 2", width: 140, sortable: true, dataIndex: 'TELEFONE2_TRANSP', hidden: true },
            { id: 'CONTATO_TRANSP', header: "Contato", width: 180, sortable: true, dataIndex: 'CONTATO_TRANSP', hidden: true },
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
                        Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').setValue(record.data.ID_CLIENTE);
                        var f = Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO');

                        Ext.getCmp('fsBuscaCliente_ORCAMENTO').collapse();

                        CarregaDadosCliente(f);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').setValue(record.data.ID_CLIENTE);
                var f = Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO');

                Ext.getCmp('fsBuscaCliente_ORCAMENTO').collapse();

                CarregaDadosCliente(f);

                Ext.getCmp('CODIGO_TRANSPORTADORA_ORCAMENTO').focus();
            }
        }
    });

    var ORCAMENTO_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    ORCAMENTO_CLIENTE_PagingToolbar.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/ListaClientes_GridPesquisa');
    ORCAMENTO_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_TRANSP_JsonData());
    ORCAMENTO_CLIENTE_PagingToolbar.setStore(ORCAMENTO_BUSCA_CLIENTE_STORE);

    function RetornaFiltros_TB_CLIENTE_TRANSP_JsonData() {
        var _pesquisa = Ext.getCmp('ORCAMENTO_TXT_PESQUISA_CLIENTE') ?
                            Ext.getCmp('ORCAMENTO_TXT_PESQUISA_CLIENTE').getValue() : '';

        var _uf = Ext.getCmp('ID_UF_ORCAMENTO').getValue();

        var TB_TRANSP_JsonData = {
            ID_VENDEDOR: _ID_VENDEDOR,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            uf: _uf,
            pesquisa: _pesquisa,
            start: 0,
            limit: ORCAMENTO_CLIENTE_PagingToolbar.getLinhasPorPagina(),
            ID_USUARIO: _ID_USUARIO
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Cliente_ORCAMENTO() {
        ORCAMENTO_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_TRANSP_JsonData());
        ORCAMENTO_CLIENTE_PagingToolbar.doRequest();
    }

    var ORCAMENTO_TXT_PESQUISA_CLIENTE = new Ext.form.TextField({
        id: 'ORCAMENTO_TXT_PESQUISA_CLIENTE',
        name: 'ORCAMENTO_TXT_PESQUISA_CLIENTE',
        labelWidth: 120,
        fieldLabel: 'Nome do Cliente',
        labelAlign: 'left',
        layout: 'form',
        width: 380,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Cliente_ORCAMENTO();
                }
            }
        }
    });

    var ORCAMENTO_BTN_PESQUISA_CLIENTE = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Cliente_ORCAMENTO();
        }
    });

    fsBuscaCliente_ORCAMENTO.add({
        id: 'fsBuscaCliente_ORCAMENTO',
        xtype: 'panel',
        frame: true,
        border: true,
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .10,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Nome do Cliente:'
            }, {
                columnWidth: .36,
                items: [ORCAMENTO_TXT_PESQUISA_CLIENTE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [ORCAMENTO_BTN_PESQUISA_CLIENTE]
            }]
        }, grid_BUSCA_Cliente, ORCAMENTO_CLIENTE_PagingToolbar.PagingToolbar()]
    });

    var TXT_CODIGO_CLIENTE_ORCAMENTO = new Ext.form.NumberField({
        fieldLabel: 'C&oacute;digo do Cliente',
        name: 'CODIGO_CLIENTE_ORCAMENTO',
        id: 'CODIGO_CLIENTE_ORCAMENTO',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CarregaDadosCliente(f);
                }
            }
        }
    });

    var LBL_DADOS_CLIENTE_ORCAMENTO = new Ext.form.Label({
        name: 'DADOS_CLIENTE_ORCAMENTO',
        id: 'DADOS_CLIENTE_ORCAMENTO',
        html: '&nbsp;'
    });

    //////////////////////////////

    var fsNUMERO_ORCAMENTO = new Ext.form.FieldSet({
        checkboxToggle: false,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        items: [{
            layout: 'form',
            items: [TXT_NUMERO_ORCAMENTO]
        }]
    });


    var TXT_OBS_ORCAMENTO = new Ext.form.TextField({
        id: 'OBS_ORCAMENTO',
        name: 'OBS_ORCAMENTO',
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '95%',
        height: 40,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var TXT_OBS_NF_ORCAMENTO = new Ext.form.TextField({
        id: 'OBS_NF_ORCAMENTO',
        name: 'OBS_NF_ORCAMENTO',
        fieldLabel: 'Dados adicionais NF',
        anchor: '95%',
        height: 40,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var TXT_VALIDADE_ORCAMENTO = new Ext.form.DateField({
        id: 'VALIDADE_ORCAMENTO',
        name: 'VALIDADE_ORCAMENTO',
        layout: 'form',
        fieldLabel: 'Validade da Proposta',
        allowBlank: false,
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Salva_Orcamento();
                }
            }
        }
    });

    function Salva_Orcamento() {
        if (!Ext.getCmp('formORCAMENTO').getForm().isValid()) {
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Salva_Orcamento');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: Ext.getCmp('NUMERO_ORCAMENTO').getValue(),
            CODIGO_CLIENTE_ORCAMENTO: Ext.getCmp('CODIGO_CLIENTE_ORCAMENTO').getValue(),
            OBS_ORCAMENTO: Ext.getCmp('OBS_ORCAMENTO').getValue(),
            VALIDADE_ORCAMENTO: Ext.getCmp('VALIDADE_ORCAMENTO').getRawValue(),
            OBS_NF_ORCAMENTO: Ext.getCmp('OBS_NF_ORCAMENTO').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {

        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var buttonGroup_ORCAMENTO = new Ext.ButtonGroup({
        id: 'buttonGroup_ORCAMENTO',
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                Salva_Orcamento();
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Imprimir Or&ccedil;amento',
                icon: 'imagens/icones/printer_24.gif',
                scale: 'medium',
                handler: function () {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Imprime_Orcamento');
                    _ajax.setJsonData({
                        NUMERO_ORCAMENTO: Ext.getCmp('NUMERO_ORCAMENTO').getValue(),
                        ID_EMPRESA: _ID_EMPRESA,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        var result = Ext.decode(response.responseText).d;
                        window.open(result, '_blank', 'width=1000,height=800');
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
{
    text: 'Novo Or&ccedil;amento',
    icon: 'imagens/icones/document_fav_24.gif',
    scale: 'medium',
    handler: function () {
        Prepara_Novo_Orcamento();
    }
}]
    });

    var toolbar_TB_ORCAMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_ORCAMENTO]
    });

    var formORCAMENTO = new Ext.FormPanel({
        id: 'formORCAMENTO',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        labelAlign: 'top',
        height: 353,
        items: [fsNUMERO_ORCAMENTO, {
            layout: 'form',
            items: [fsBuscaCliente_ORCAMENTO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_CODIGO_CLIENTE_ORCAMENTO]
            }, {
                columnWidth: 0.35,
                layout: 'form',
                items: [LBL_DADOS_CLIENTE_ORCAMENTO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .16,
                layout: 'form',
                items: [TXT_VALIDADE_ORCAMENTO]
            }, {
                columnWidth: .84,
                layout: 'form',
                items: [TXT_OBS_ORCAMENTO]
            }]

        }, {
            layout: 'form',
            items: [TXT_OBS_NF_ORCAMENTO]
        }]
    });

    var panelORCAMENTO = new Ext.Panel({
        width: '100%',
        border: true,
        items: [formORCAMENTO, toolbar_TB_ORCAMENTO]
    });

    formORCAMENTO.setHeight(AlturaDoPainelDeConteudo(130));

    Busca_Prazo_Orcamento();

    return panelORCAMENTO;
}

function Busca_Prazo_Orcamento() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_CONFIG_VENDAS.asmx/Busca_Prazo');
    _ajax.ExibeDivProcessamento(false);
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        var dt1 = new Date();
        dt1 = dt1.add(Date.DAY, result);

        Ext.getCmp('VALIDADE_ORCAMENTO').setValue(dt1);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}