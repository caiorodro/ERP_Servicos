function MontaCadastroVeiculos() {

    var TXT_PLACA_VEICULO = new Th2_FieldMascara({
        fieldLabel: 'Placa do Ve&iacute;culo',
        width: 100,
        name: 'PLACA',
        id: 'PLACA',
        maxLength: 8,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '8', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        Mascara: '999-9999'
    });

    TXT_PLACA_VEICULO.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            BuscaPorPlaca(f.getValue());
        }
    });

    function BuscaPorPlaca(PLACA) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_VEICULO_FROTA.asmx/BuscaPorPLACA');
        _ajax.setJsonData({
            PLACA: PLACA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Ext.getCmp('PLACA').setValue(result.PLACA);
            Ext.getCmp('MARCA_VEICULO').setValue(result.MARCA_VEICULO);
            Ext.getCmp('MODELO_VEICULO').setValue(result.MODELO_VEICULO);
            Ext.getCmp('UF_PLACA_VEICULO').setValue(result.UF_PLACA_VEICULO);

            Ext.getCmp('KM_INICIAL').setValue(result.KM_INICIAL);
            Ext.getCmp('UNIDADE_COMBUSTIVEL').setValue(result.UNIDADE_COMBUSTIVEL);
            Ext.getCmp('CUSTO_COMBUSTIVEL').setValue(result.CUSTO_COMBUSTIVEL);
            Ext.getCmp('QTDE_KM_POR_UNIDADE').setValue(result.QTDE_KM_POR_UNIDADE);
            Ext.getCmp('CAPACIDADE_CARGA').setValue(result.CAPACIDADE_CARGA);

            panelCadastroVeiculo.setTitle('Alterar dados do Ve&iacute;culo');

            buttonGroup_TB_VEICULO.items.items[32].enable();
            formVeiculos.getForm().items.items[0].disable();

            formVeiculos.getForm().findField('MARCA_VEICULO').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    TH2_CARREGA_UF();

    var combo_ESTADO_PLACA = new Ext.form.ComboBox({
        store: combo_TB_UF_Store,
        fieldLabel: 'UF da Placa',
        id: 'UF_PLACA_VEICULO',
        name: 'UF_PLACA_VEICULO',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 130,
        allowBlank: false
    });

    var TXT_MARCA_VEICULO = new Ext.form.TextField({
        fieldLabel: 'Marca',
        width: 220,
        name: 'MARCA_VEICULO',
        id: 'MARCA_VEICULO',
        maxLength: 30,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '30' }
    });

    var TXT_MODELO_VEICULO = new Ext.form.TextField({
        fieldLabel: 'Modelo',
        width: 320,
        name: 'MODELO_VEICULO',
        id: 'MODELO_VEICULO',
        maxLength: 40,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '40' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    GravaDados_TB_VEICULO();
            }
        }
    });

    var TXT_KM_INICIAL = new Ext.form.NumberField({
        fieldLabel: 'KM. Inicial',
        width: 100,
        name: 'KM_INICIAL',
        id: 'KM_INICIAL',
        allowBlank: false,
        decimalPrecision: 0,
        minValue: 0
    });

    var combo_UNIDADE_COMBUSTIVEL = new Ext.form.ComboBox({
        fieldLabel: 'Unidade de Medida (Combust&iacute;vel)',
        id: 'UNIDADE_COMBUSTIVEL',
        name: 'UNIDADE_COMBUSTIVEL',
        valueField: 'UN_ID',
        displayField: 'UNIDADE',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 130,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'UN_ID',
            'UNIDADE'
        ],
            data: [['LT', 'Litro'], ['M3', 'Metro Cúbico M3']]
        })
    });

    var TXT_CUSTO_COMBUSTIVEL = new Ext.form.NumberField({
        fieldLabel: 'Custo do Combust&iacute;vel',
        width: 100,
        name: 'CUSTO_COMBUSTIVEL',
        id: 'CUSTO_COMBUSTIVEL',
        allowBlank: false,
        decimalPrecision: 4,
        decimalSeparator: ',',
        minValue: .0001
    });

    var TXT_QTDE_KM_POR_UNIDADE = new Ext.form.NumberField({
        fieldLabel: 'Qtde. de KM por Unidade de Combust&iacute;vel',
        width: 100,
        name: 'QTDE_KM_POR_UNIDADE',
        id: 'QTDE_KM_POR_UNIDADE',
        decimalSeparator: ',',
        allowBlank: false,
        decimalPrecision: 2,
        minValue: .01
    });

    var TXT_CAPACIDADE_CARGA = new Ext.form.NumberField({
        fieldLabel: 'Capacidade de Carga',
        width: 100,
        name: 'CAPACIDADE_CARGA',
        id: 'CAPACIDADE_CARGA',
        allowBlank: false,
        decimalPrecision: 2,
        decimalSeparator: ',',
        minValue: .01
    });

    var formVeiculos = new Ext.FormPanel({
        id: 'formVeiculos',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 180,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.18,
                layout: 'form',
                items: [TXT_PLACA_VEICULO]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                items: [combo_ESTADO_PLACA]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [TXT_MARCA_VEICULO]
            }, {
                columnWidth: 0.32,
                layout: 'form',
                items: [TXT_MODELO_VEICULO]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .18,
                layout: 'form',
                items: [TXT_KM_INICIAL]
            }, {
                columnWidth: .22,
                layout: 'form',
                items: [combo_UNIDADE_COMBUSTIVEL]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_CUSTO_COMBUSTIVEL]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .40,
                layout: 'form',
                items: [TXT_QTDE_KM_POR_UNIDADE]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_CAPACIDADE_CARGA]
            }]
        }]
    });

    function resetaFormularioVeiculos() {
        Ext.getCmp('PLACA').reset();
        Ext.getCmp('MODELO_VEICULO').reset();

        Ext.getCmp('KM_INICIAL').reset();
        Ext.getCmp('QTDE_KM_POR_UNIDADE').reset();
        Ext.getCmp('CAPACIDADE_CARGA').reset();
    }

    function PopulaFormulario_TB_VEICULO(record) {
        formVeiculos.getForm().loadRecord(record);
        panelCadastroVeiculo.setTitle('Alterar dados do Ve&iacute;culo');

        buttonGroup_TB_VEICULO.items.items[32].enable();
        formVeiculos.getForm().items.items[0].disable();

        formVeiculos.getForm().findField('MARCA_VEICULO').focus();
    }

    var TB_VEICULO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                                    ['PLACA', 'UF_PLACA_VEICULO', 'SIGLA_UF', 'MARCA_VEICULO', 'MODELO_VEICULO',
                                    'KM_INICIAL', 'UNIDADE_COMBUSTIVEL', 'CUSTO_COMBUSTIVEL', 'QTDE_KM_POR_UNIDADE', 'CAPACIDADE_CARGA']
                                    )
    });

    var gridVeiculo = new Ext.grid.GridPanel({
        id: 'gridVeiculo',
        store: TB_VEICULO_Store,
        columns: [
                    { id: 'PLACA', header: "Placa do Ve&iacute;culo", width: 120, sortable: true, dataIndex: 'PLACA' },
                    { id: 'SIGLA_UF', header: "UF da Placa", width: 70, sortable: true, dataIndex: 'SIGLA_UF', align: 'center' },
                    { id: 'MARCA_VEICULO', header: "Marca", width: 180, sortable: true, dataIndex: 'MARCA_VEICULO' },
                    { id: 'MODELO_VEICULO', header: "Modelo", width: 230, sortable: true, dataIndex: 'MODELO_VEICULO' },

                    { id: 'KM_INICIAL', header: "KM. Inicial", width: 100, sortable: true, dataIndex: 'KM_INICIAL', align: 'center' },
                    { id: 'UNIDADE_COMBUSTIVEL', header: "Un. Combust&iacute;vel", width: 110, sortable: true, dataIndex: 'UNIDADE_COMBUSTIVEL', align: 'center' },
                    { id: 'CUSTO_COMBUSTIVEL', header: "Custo Combust&iacute;vel", width: 110, sortable: true, dataIndex: 'CUSTO_COMBUSTIVEL', renderer: FormataValor_4, align: 'center' },
                    { id: 'QTDE_KM_POR_UNIDADE', header: "Qtde. Km / Combust&iacute;vel", width: 130, sortable: true, dataIndex: 'QTDE_KM_POR_UNIDADE', renderer: FormataQtde, align: 'center' },
                    { id: 'CAPACIDADE_CARGA', header: "Capacidade de Carga", width: 120, sortable: true, dataIndex: 'CAPACIDADE_CARGA', renderer: FormataQtde, align: 'center' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridVeiculo.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_VEICULO(record);
    });

    gridVeiculo.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridVeiculo.getSelectionModel().getSelections().length > 0) {
                var record = gridVeiculo.getSelectionModel().getSelected();
                PopulaFormulario_TB_VEICULO(record);
            }
        }
    });

    function Apoio_PopulaGrid_VEICULO(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_VEICULO_CARREGA_GRID();
        }
    }

    var TXT_FILTRO_PLACA_VEICULO = new Th2_FieldMascara({
        fieldLabel: 'Placa do Ve&iacute;culo',
        name: 'FILTRO_PLACA_VEICULO',
        id: 'FILTRO_PLACA_VEICULO',
        width: 90,
        Mascara: '999-9999'
    });

    TXT_FILTRO_PLACA_VEICULO.on('specialkey', function (f, e) {
        Apoio_PopulaGrid_VEICULO(f, e);
    });

    var TXT_FILTRO_MARCA = new Ext.form.TextField({
        fieldLabel: 'Marca',
        name: 'FILTRO_MARCA',
        id: 'FILTRO_MARCA',
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                Apoio_PopulaGrid_VEICULO(f, e);
            }
        }
    });

    var TXT_FILTRO_MODELO = new Ext.form.TextField({
        fieldLabel: 'Modelo',
        name: 'FILTRO_MODELO',
        id: 'FILTRO_MODELO',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                Apoio_PopulaGrid_VEICULO(f, e);
            }
        }
    });

    var BTN_TB_VEICULO_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_VEICULO_CARREGA_GRID();
        }
    });

    function RetornaVEICULO_JsonData() {
        var placa = TXT_FILTRO_PLACA_VEICULO.getValue() ? TXT_FILTRO_PLACA_VEICULO.getValue() : '';
        var marca = TXT_FILTRO_MARCA.getValue() ? TXT_FILTRO_MARCA.getValue() : '';
        var modelo = TXT_FILTRO_MODELO.getValue() ? TXT_FILTRO_MODELO.getValue() : '';

        var VEICULO_JsonData = {
            PLACA: placa,
            MARCA_VEICULO: marca,
            MODELO_VEICULO: modelo,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return VEICULO_JsonData;
    }

    var VEICULO_PagingToolbar = new Th2_PagingToolbar();
    VEICULO_PagingToolbar.setUrl('servicos/TB_VEICULO_FROTA.asmx/LISTA_TB_VEICULO_FROTA');
    VEICULO_PagingToolbar.setStore(TB_VEICULO_Store);

    function TB_VEICULO_CARREGA_GRID() {
        VEICULO_PagingToolbar.setParamsJsonData(RetornaVEICULO_JsonData());
        VEICULO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_VEICULO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_VEICULO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Ve&iacute;culo',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_VEICULO.items.items[32].disable();

                                    formVeiculos.getForm().items.items[0].enable();

                                    resetaFormularioVeiculos();
                                    panelCadastroVeiculo.setTitle('Novo Ve&iacute;culo');

                                    formVeiculos.getForm().findField('PLACA').focus();
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
                                     Deleta_TB_VEICULO();
                                 }
                             }]
    });

    var toolbar_TB_VEICULO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_VEICULO]
    });

    var panelCadastroVeiculo = new Ext.Panel({
        width: '100%',
        border: true,
        autoHeight: true,
        title: 'Novo Ve&iacute;culo',
        items: [formVeiculos, toolbar_TB_VEICULO, gridVeiculo, VEICULO_PagingToolbar.PagingToolbar(),
                            {
                                frame: true,
                                bodyStyle: 'padding:5px 5px 0',
                                width: '100%',
                                items: [{
                                    layout: 'column',
                                    items: [{
                                        columnWidth: 0.22,
                                        layout: 'form',
                                        labelWidth: 100,
                                        items: [TXT_FILTRO_PLACA_VEICULO]
                                    }, {
                                        columnWidth: 0.30,
                                        layout: 'form',
                                        labelWidth: 50,
                                        items: [TXT_FILTRO_MARCA]
                                    }, {
                                        columnWidth: 0.32,
                                        layout: 'form',
                                        labelWidth: 50,
                                        items: [TXT_FILTRO_MODELO]
                                    }, {
                                        columnWidth: 0.09,
                                        items: [BTN_TB_VEICULO_PESQUISA]
                                    }]
                                }]
                            }]
    });

    function GravaDados_TB_VEICULO() {
        if (!formVeiculos.getForm().isValid()) {
            return;
        }

        var dados = {
            PLACA: formVeiculos.getForm().findField('PLACA').getValue(),
            UF_PLACA_VEICULO: formVeiculos.getForm().findField('UF_PLACA_VEICULO').getValue(),
            MARCA_VEICULO: formVeiculos.getForm().findField('MARCA_VEICULO').getValue(),
            MODELO_VEICULO: formVeiculos.getForm().findField('MODELO_VEICULO').getValue(),

            KM_INICIAL: formVeiculos.getForm().findField('KM_INICIAL').getValue(),
            UNIDADE_COMBUSTIVEL: formVeiculos.getForm().findField('UNIDADE_COMBUSTIVEL').getValue(),
            CUSTO_COMBUSTIVEL: formVeiculos.getForm().findField('CUSTO_COMBUSTIVEL').getValue(),
            QTDE_KM_POR_UNIDADE: formVeiculos.getForm().findField('QTDE_KM_POR_UNIDADE').getValue(),
            CAPACIDADE_CARGA: formVeiculos.getForm().findField('CAPACIDADE_CARGA').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroVeiculo.title == "Novo Ve&iacute;culo" ?
                        'servicos/TB_VEICULO_FROTA.asmx/GravaNovoVeiculo' :
                        'servicos/TB_VEICULO_FROTA.asmx/AtualizaVeiculo';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroVeiculo.title == "Novo Ve&iacute;culo") {
                resetaFormularioVeiculos();

                if (Ext.getCmp('FILTRO_PLACA_VEICULO').getValue() == '' &&
                                        Ext.getCmp('FILTRO_MARCA').getValue() == '' &&
                                        Ext.getCmp('FILTRO_MODELO').getValue() == '') {

                    formVeiculos.getForm().findField('PLACA').focus();
                    TB_VEICULO_CARREGA_GRID();
                }
            }
            else {
                TB_VEICULO_CARREGA_GRID();
                formVeiculos.getForm().findField('MARCA_VEICULO').focus();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_VEICULO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Ve&iacute;culo [' +
                        formVeiculos.getForm().findField('PLACA').getValue() + ']?', 'formVeiculos', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var dados = {
                    PLACA: formVeiculos.getForm().findField('PLACA').getValue(),
                    ID_USUARIO: _ID_USUARIO
                };

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_VEICULO_FROTA.asmx/DeletaVeiculo');
                _ajax.setJsonData(dados);

                var _sucess = function (response, options) {
                    panelCadastroVeiculo.setTitle("Novo Ve&iacute;culo");
                    Ext.getCmp('PLACA').focus();

                    resetaFormularioVeiculos();

                    buttonGroup_TB_VEICULO.items.items[32].disable();
                    formVeiculos.getForm().items.items[0].enable();

                    TB_VEICULO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var m = new Monta_Manutencao_Veiculo();

    ///////////////////////
    var TB_VEICULO_FROTA_TABPANEL = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,

        items: [{
            title: 'Ve&iacute;culos da Frota',
            closable: false,
            autoScroll: false,
            items: [panelCadastroVeiculo],
            iconCls: 'icone_VEICULO_FROTA2'
        }, {
            title: 'Manuten&ccedil;&atilde;o do Ve&iacute;culo',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TRANSF_ESTOQUE'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (panel.title == 'Manuten&ccedil;&atilde;o do Ve&iacute;culo') {
                    if (panelCadastroVeiculo.title == 'Novo Ve&iacute;culo') {
                        dialog.MensagemDeErro("Selecione um ve&iacute;culo antes");
                        tabPanel.setActiveTab(0);
                        return;
                    }

                    if (panel.items.length == 0) {
                        panel.add(m.PANEL_MANUTENCAO());
                        panel.doLayout();
                        m.CARREGA_MANUTENCAO();
                    }
                }
            }
        }
    });

    ///////////////////////

    gridVeiculo.setHeight(AlturaDoPainelDeConteudo(formVeiculos.height) - 197);

    TB_VEICULO_CARREGA_GRID();

    return TB_VEICULO_FROTA_TABPANEL;
}