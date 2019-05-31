var combo_PLACA_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['PLACA', 'DESCRICAO', 'CAPACIDADE_CARGA', 'CUSTO_COMBUSTIVEL', 'QTDE_KM_POR_UNIDADE']
       )
});

function TB_VEICULO_CARREGA_PLACAS() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/LISTA_PLACAS_VEICULOS');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_PLACA_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function PreRoteiro() {

    TB_VEICULO_CARREGA_PLACAS();

    var combo_PLACA_ROTEIRO = new Ext.form.ComboBox({
        store: combo_PLACA_Store,
        fieldLabel: 'Ve&iacute;culo',
        id: 'PLACA_VEICULO1',
        name: 'PLACA_VEICULO1',
        valueField: 'PLACA',
        displayField: 'DESCRICAO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 500,
        allowBlank: false,
        emptyText: 'Selecione aqui',
        listeners: {
            select: function (combo, record, index) {
                if (index > -1)
                    TB_PRE_ROTEIRO_CARREGA_GRID();
                else
                    TB_PRE_ROTEIRO_Store.removeAll();
            }
        }
    });


    /////////////////////////

    var fsBuscaCliente_ROTEIRO = new Ext.form.FieldSet({
        title: 'Busca de Cliente',
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '95%',
        listeners: {
            expand: function (f) {
                Ext.getCmp('ROTEIRO_TXT_PESQUISA_CLIENTE').focus();
            }
        }
    });

    /////////////////////////////////

    function CarregaDadosCliente(f) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/Busca_Dados_do_Cliente');
        _ajax.setJsonData({ ID_CLIENTE: f.getValue(), ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            LBL_DADOS_CLIENTE_ROTEIRO.setText(result.DadosCliente, false);
            LBL_DESTINO_CLIENTE.setText(result.DestinoCliente, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var ROTEIRO_BUSCA_CLIENTE_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'NOME_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'CNPJ_CLIENTE', 'IE_CLIENTE', 'ENDERECO_FATURA',
                'NUMERO_END_FATURA', 'COMP_END_FATURA', 'CEP_FATURA', 'BAIRRO_FATURA', 'NOME_MUNICIPIO', 'DESCRICAO_UF', 'TELEFONE_FATURA',
                'CODIGO_CFOP_CLIENTE', 'CODIGO_CP_CLIENTE', 'DESCRICAO_CP', 'CODIGO_TRANSP_CLIENTE', 'NOME_TRANSP', 'NOME_FANTASIA_TRANSP',
                'TELEFONE1_TRANSP', 'TELEFONE2_TRANSP', 'CONTATO_TRANSP', 'CODIGO_VENDEDOR_CLIENTE', 'NOME_VENDEDOR']
           )
    });

    var grid_BUSCA_Cliente1 = new Ext.grid.GridPanel({
        id: 'grid_BUSCA_Cliente1',
        store: ROTEIRO_BUSCA_CLIENTE_STORE,
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
        height: 80,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').setValue(record.data.ID_CLIENTE);
                        var f = Ext.getCmp('CODIGO_CLIENTE_ROTEIRO');
                        CarregaDadosCliente(f);

                        fsBuscaCliente_ROTEIRO.collapse();
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').setValue(record.data.ID_CLIENTE);
                var f = Ext.getCmp('CODIGO_CLIENTE_ROTEIRO');
                CarregaDadosCliente(f);

                fsBuscaCliente_ROTEIRO.collapse();
            }
        }
    });

    var ROTEIRO_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    ROTEIRO_CLIENTE_PagingToolbar.setUrl('servicos/TB_PRE_ROTEIRO.asmx/ListaClientes_GridPesquisa');
    ROTEIRO_CLIENTE_PagingToolbar.setStore(ROTEIRO_BUSCA_CLIENTE_STORE);

    function RetornaFiltros_TB_CLIENTE_JsonData() {
        var _pesquisa = Ext.getCmp('ROTEIRO_TXT_PESQUISA_CLIENTE') ?
                            Ext.getCmp('ROTEIRO_TXT_PESQUISA_CLIENTE').getValue() : '';

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: ROTEIRO_CLIENTE_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Cliente() {
        ROTEIRO_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_JsonData());
        ROTEIRO_CLIENTE_PagingToolbar.doRequest();
    }

    var ROTEIRO_TXT_PESQUISA_CLIENTE = new Ext.form.TextField({
        id: 'ROTEIRO_TXT_PESQUISA_CLIENTE',
        name: 'ROTEIRO_TXT_PESQUISA_CLIENTE',
        labelWidth: 120,
        fieldLabel: 'Nome do Cliente',
        labelAlign: 'left',
        layout: 'form',
        width: 300,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Cliente();
                }
            }
        }
    });

    var BTN_PESQUISA_CLIENTE = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Cliente();
        }
    });

    fsBuscaCliente_ROTEIRO.add({
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
                columnWidth: .30,
                items: [ROTEIRO_TXT_PESQUISA_CLIENTE]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [BTN_PESQUISA_CLIENTE]
            }]
        }, grid_BUSCA_Cliente1, ROTEIRO_CLIENTE_PagingToolbar.PagingToolbar()]
    });

    var TXT_CODIGO_CLIENTE_ROTEIRO = new Ext.form.NumberField({
        fieldLabel: 'C&oacute;digo do Cliente',
        name: 'CODIGO_CLIENTE_ROTEIRO',
        id: 'CODIGO_CLIENTE_ROTEIRO',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        msgTarget: 'side',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CarregaDadosCliente(f)
                }
            }
        }
    });

    var LBL_DADOS_CLIENTE_ROTEIRO = new Ext.form.Label({
        name: 'DADOS_CLIENTE_ROTEIRO',
        id: 'DADOS_CLIENTE_ROTEIRO',
        html: '&nbsp;'
    });

    var LBL_DESTINO_CLIENTE = new Ext.form.Label({
        name: 'DESTINO_CLIENTE',
        id: 'DESTINO_CLIENTE',
        html: '&nbsp;'
    });

    var LBL_ORIGEM_CLIENTE = new Ext.form.Label({
        name: 'ORIGEM_CLIENTE',
        id: 'ORIGEM_CLIENTE',
        html: '&nbsp;'
    });

    var TXT_ORDEM_ENTREGA = new Ext.form.NumberField({
        fieldLabel: 'Ordem de Entrega',
        width: 100,
        name: 'ORDEM_ENTREGA',
        id: 'ORDEM_ENTREGA',
        decimalPrecision: 3,
        decimalSeparator: ',',
        minValue: 0,
        value: 0,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    GravaDados();
                }
            }
        }
    });

    var TXT_RESUMO = new Ext.form.TextField({
        id: 'RESUMO',
        name: 'RESUMO',
        fieldLabel: 'Resumo',
        anchor: '90%',
        height: 70,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var TXT_ATENCAO = new Ext.form.TextField({
        id: 'ATENCAO',
        name: 'ATENCAO',
        fieldLabel: 'Aten&ccedil;&atilde;o',
        anchor: '90%',
        height: 70,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    //////////////////////////////

    var formPREROTEIRO = new Ext.FormPanel({
        id: 'formPREROTEIRO',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 270,
        items: [{
            layout: 'form',
            items: [combo_PLACA_ROTEIRO]
        }, {
            items: [fsBuscaCliente_ROTEIRO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.15,
                layout: 'form',
                items: [TXT_CODIGO_CLIENTE_ROTEIRO]
            }, {
                columnWidth: 0.36,
                layout: 'form',
                items: [LBL_DADOS_CLIENTE_ROTEIRO]
            }, {
                layout: 'form',
                columnWidth: .15,
                items: [TXT_ORDEM_ENTREGA]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .50,
                items: [TXT_RESUMO]
            }, {
                layout: 'form',
                columnWidth: .50,
                items: [TXT_ATENCAO]
            }]
        }]
    });

    //////////////////

    var _SUCESSO_MAPS = function SUCESSO(distancia, tempo, txt_distancia, txt_tempo,
                    atencao, resumo) {

        var dados = {
            PLACA_VEICULO: Ext.getCmp('PLACA_VEICULO1').getValue(),
            CODIGO_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').getValue(),
            ORDEM_ENTREGA: Ext.getCmp('ORDEM_ENTREGA').getValue(),
            TEMPO_ENTREGA: tempo,
            DISTANCIA_METROS: distancia,
            TXT_TEMPO_ENTREGA: txt_tempo,
            TXT_DISTANCIA_METROS: txt_distancia,
            ATENCAO: atencao,
            RESUMO: resumo,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = 'servicos/TB_PRE_ROTEIRO.asmx/GravaNovoRoteiro';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            ResetaFormulario();

            if ((Ext.getCmp('FILTRO_MARCA_ROTEIRO').getValue() == '' || Ext.getCmp('FILTRO_MARCA_ROTEIRO').getValue() == undefined)
                                 && (Ext.getCmp('FILTRO_MODELO_ROTEIRO').getValue() == '' || Ext.getCmp('FILTRO_MODELO_ROTEIRO').getValue() == undefined)) {
                TB_PRE_ROTEIRO_CARREGA_GRID();
            }

            Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function GravaDados() {
        if (!formPREROTEIRO.getForm().isValid()) {
            return;
        }

        if (LBL_DESTINO_CLIENTE.html == '&nbsp;') {
            dialog.MensagemDeErro('Cliente n&atilde;o selecionado.', 'BTN_SALVAR_ROTEIRO');
            return;
        }

        util.IniciaSolicitacao();

        if (panel1.title == "Novo Roteiro") {
            var gm = new google_maps();
            gm.ENDERECO_ORIGEM(LBL_ORIGEM_CLIENTE.html);
            gm.ENDERECO_DESTINO(LBL_DESTINO_CLIENTE.html);
            gm.CALCULA_ROTA();

            gm.set_SUCESSO(_SUCESSO_MAPS);
        }
        else {
            var _dados = {
                PLACA_VEICULO: Ext.getCmp('PLACA_VEICULO1').getValue(),
                CODIGO_CLIENTE: Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').getValue(),
                ORDEM_ENTREGA: Ext.getCmp('ORDEM_ENTREGA').getValue(),
                ATENCAO: TXT_ATENCAO.getValue(),
                RESUMO: TXT_RESUMO.getValue(),
                ID_USUARIO: _ID_USUARIO
            };

            var _Url = 'servicos/TB_PRE_ROTEIRO.asmx/AtualizaRoteiro';

            var _ajax = new Th2_Ajax();
            _ajax.setUrl(_Url);
            _ajax.setJsonData({ dados: _dados });

            var _sucess1 = function (response, options) {
                TB_PRE_ROTEIRO_CARREGA_GRID();

                Ext.getCmp('CODIGO_CLIENTE_ROTEIRO').focus();
            };

            _ajax.setSucesso(_sucess1);
            _ajax.Request();
        }
    }

    var buttonGroup_TB_PRE_ROTEIRO = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_SALVAR_ROTEIRO',
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Roteiro',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    ResetaFormulario();
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function () {
                                     Deleta_TB_PRE_ROTEIRO();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Gravar Ordem Autom&aacute;tica',
                                 icon: 'imagens/icones/numeric_field_save_24.gif',
                                 scale: 'medium',
                                 handler: function () {
                                     GravaOrdem();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: 'Tra&ccedil;ar Rota',
                                 icon: 'imagens/icones/relation_24.gif',
                                 scale: 'medium',
                                 handler: function () {
                                     TracarRota();
                                 }
                             }]
    });

    function GravaOrdem() {
        if (combo_PLACA_ROTEIRO.getValue() == '') {
            dialog.MensagemDeErro('Selecione uma placa de ve&iacute;culo para gravar a ordem');
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/GravaOrdem');
        _ajax.setJsonData({ PLACA_VEICULO: combo_PLACA_ROTEIRO.getValue(), ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TB_PRE_ROTEIRO_CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar_TB_PRE_ROTEIRO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_PRE_ROTEIRO]
    });

    function PopulaFormulario_TB_PRE_ROTEIRO(record) {
        buttonGroup_TB_PRE_ROTEIRO.items.items[32].enable();

        TXT_CODIGO_CLIENTE_ROTEIRO.setValue(record.data.CODIGO_CLIENTE);
        TXT_ORDEM_ENTREGA.setValue(record.data.ORDEM_ENTREGA);
        TXT_ATENCAO.setValue(record.data.ATENCAO);
        TXT_RESUMO.setValue(record.data.RESUMO);

        combo_PLACA_ROTEIRO.disable();
        TXT_CODIGO_CLIENTE_ROTEIRO.disable();

        CarregaDadosCliente(TXT_CODIGO_CLIENTE_ROTEIRO);

        panel1.setTitle("Alterar Roteiro");

        TXT_ORDEM_ENTREGA.focus();
    }

    function ResetaFormulario() {
        buttonGroup_TB_PRE_ROTEIRO.items.items[32].disable();

        TXT_CODIGO_CLIENTE_ROTEIRO.reset();
        TXT_ORDEM_ENTREGA.reset();

        combo_PLACA_ROTEIRO.enable();
        TXT_CODIGO_CLIENTE_ROTEIRO.enable();

        LBL_DADOS_CLIENTE_ROTEIRO.setText('&nbsp;', false);
        LBL_DESTINO_CLIENTE.setText('&nbsp;', false);

        panel1.setTitle("Novo Roteiro");

        combo_PLACA_ROTEIRO.focus();

    }

    function TracarRota() {
        var enderDe = LBL_ORIGEM_CLIENTE.html;
        var enderAte = LBL_DESTINO_CLIENTE.html;

        var rota = 'mapa.htm?origem=' + enderDe + '&destino=' + enderAte;

        window.open(rota, '_blank', 'width=1000,height=800');
    }

    ///////////////////////
    var TB_PRE_ROTEIRO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['PLACA_VEICULO', 'CODIGO_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'ORDEM_ENTREGA', 'TEMPO_ENTREGA', 'DISTANCIA_METROS',
                    'ENDERECO_FATURA', 'ENDERECO_ENTREGA', 'CEP_FATURA', 'CEP_ENTREGA', 'MUNICIPIO_FATURA', 'UF_FATURA',
                    'MUNICIPIO_ENTREGA', 'UF_ENTREGA', 'TXT_TEMPO_ENTREGA', 'TXT_DISTANCIA_METROS', 'ATENCAO', 'RESUMO']
                    )
    });

    function Endereco(val, metadata, record) {
        if (val == ", ") {
            return record.data.ENDERECO_FATURA;
        }
        else
            return val;
    }

    function CEP(val, metadata, record) {
        if (val.length == 0) {
            return record.data.CEP_FATURA;
        }
        else
            return val;
    }

    function Cidade(val, metadata, record) {
        if (val.length == 0) {
            return record.data.CIDADE_FATURA;
        }
        else
            return val;
    }

    function UF(val, metadata, record) {
        if (val.length == 0) {
            return record.data.UF_FATURA;
        }
        else
            return val;
    }

    var gridPreRoteiro = new Ext.grid.GridPanel({
        store: TB_PRE_ROTEIRO_Store,
        columns: [

                    { id: 'PLACA_VEICULO', header: "Placa do Ve&iacute;culo", width: 110, sortable: true, dataIndex: 'PLACA_VEICULO' },
                    { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 220, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
                    { id: 'ENDERECO_ENTREGA', header: "Endere&ccedil;o de Entrega", width: 300, sortable: true, dataIndex: 'ENDERECO_ENTREGA', renderer: Endereco },
                    { id: 'CEP_ENTREGA', header: "CEP", width: 85, sortable: true, dataIndex: 'CEP_ENTREGA', renderer: CEP },

                    { id: 'ORDEM_ENTREGA', header: "Ordem de Entrega", width: 120, sortable: true, dataIndex: 'ORDEM_ENTREGA', align: 'center' },
                    { id: 'TXT_TEMPO_ENTREGA', header: "Tempo de Entrega", width: 130, sortable: true, dataIndex: 'TXT_TEMPO_ENTREGA', align: 'center' },
                    { id: 'TXT_DISTANCIA_METROS', header: "Dist&acirc;ncia", width: 130, sortable: true, dataIndex: 'TXT_DISTANCIA_METROS', align: 'center' },
                    { id: 'MUNICIPIO_ENTREGA', header: "Munic&iacute;pio", width: 260, sortable: true, dataIndex: 'MUNICIPIO_ENTREGA', renderer: Cidade },
                    { id: 'UF_ENTREGA', header: "UF", width: 60, sortable: true, dataIndex: 'UF_ENTREGA', renderer: UF },
                    { id: 'RESUMO', header: "Resumo", width: 160, sortable: true, dataIndex: 'RESUMO' },
                    { id: 'ATENCAO', header: "Aten&ccedil;&atilde;o", width: 200, sortable: true, dataIndex: 'ATENCAO' }
                    ],

        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridPreRoteiro.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_PRE_ROTEIRO(record);
    });

    gridPreRoteiro.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridPreRoteiro.getSelectionModel().getSelections().length > 0) {
                var record = gridPreRoteiro.getSelectionModel().getSelected();
                PopulaFormulario_TB_PRE_ROTEIRO(record);
            }
        }
    });

    function Apoio_PopulaGrid_PRE_ROTEIRO(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_PRE_ROTEIRO_CARREGA_GRID();
        }
    }

    var TXT_FILTRO_MARCA = new Ext.form.TextField({
        id: 'FILTRO_MARCA_ROTEIRO',
        name: 'FILTRO_MARCA_ROTEIRO',
        fieldLabel: 'Marca',
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                Apoio_PopulaGrid_PRE_ROTEIRO(f, e);
            }
        }
    });

    var TXT_FILTRO_MODELO = new Ext.form.TextField({
        id: 'FILTRO_MODELO_ROTEIRO',
        name: 'FILTRO_MODELO_ROTEIRO',
        fieldLabel: 'Modelo',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                Apoio_PopulaGrid_PRE_ROTEIRO(f, e);
            }
        }
    });

    var BTN_TB_PRE_ROTEIRO_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_PRE_ROTEIRO_CARREGA_GRID();
        }
    });

    function RetornaVEICULO_JsonData() {
        var placa = combo_PLACA_ROTEIRO.getValue() ? combo_PLACA_ROTEIRO.getValue() : '';
        var marca = TXT_FILTRO_MARCA.getValue() ? TXT_FILTRO_MARCA.getValue() : '';
        var modelo = TXT_FILTRO_MODELO.getValue() ? TXT_FILTRO_MODELO.getValue() : '';

        var VEICULO_JsonData = {
            PLACA_VEICULO: placa,
            MARCA_VEICULO: marca,
            MODELO_VEICULO: modelo,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return VEICULO_JsonData;
    }

    var PRE_ROTEIRO_PagingToolbar = new Th2_PagingToolbar();
    PRE_ROTEIRO_PagingToolbar.setUrl('servicos/TB_PRE_ROTEIRO.asmx/LISTA_TB_PREROTEIRO');
    PRE_ROTEIRO_PagingToolbar.setStore(TB_PRE_ROTEIRO_Store);

    function TB_PRE_ROTEIRO_CARREGA_GRID() {
        PRE_ROTEIRO_PagingToolbar.setParamsJsonData(RetornaVEICULO_JsonData());
        PRE_ROTEIRO_PagingToolbar.doRequest();
    }

    function Deleta_TB_PRE_ROTEIRO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este registro?', 'formPREROTEIRO', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var dados = {
                    PLACA_VEICULO: combo_PLACA_ROTEIRO.getValue(),
                    CODIGO_CLIENTE: TXT_CODIGO_CLIENTE_ROTEIRO.getValue(),
                    ID_USUARIO: _ID_USUARIO
                };

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/DeletaRoteiro');
                _ajax.setJsonData(dados);

                var _sucess = function (response, options) {
                    ResetaFormulario();
                    TB_PRE_ROTEIRO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    ///////////////////////

    var panel1 = new Ext.Panel({
        width: '100%',
        border: true,
        autoHeight: true,
        title: 'Novo Roteiro',
        items: [formPREROTEIRO, toolbar_TB_PRE_ROTEIRO, gridPreRoteiro, PRE_ROTEIRO_PagingToolbar.PagingToolbar()]
    });

    gridPreRoteiro.setHeight(AlturaDoPainelDeConteudo(formPREROTEIRO.height) - 125);

    function BuscaEnderecoOrigem() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PRE_ROTEIRO.asmx/Endereco_ORIGEM');
        _ajax.setJsonData({
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            LBL_ORIGEM_CLIENTE.setText(result, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    BuscaEnderecoOrigem();

    return panel1;
}