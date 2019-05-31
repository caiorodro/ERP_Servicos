function Monta_Manutencao_Veiculo() {

    var ID_MANUTENCAO = new Ext.form.Hidden({
        id: 'ID_MANUTENCAO',
        name: 'ID_MANUTENCAO'
    });

    var TXT_DESCRICAO_MANUTENCAO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o dos servi&ccedil;os',
        anchor: '70%',
        name: 'DESCRICAO_MANUTENCAO',
        id: 'DESCRICAO_MANUTENCAO',
        height: 70,
        maxLength: 500,
        autoCreate: { tag: 'textarea', autocomplete: 'off', maxlength: '500' },
        allowBlank: false
    });

    var TXT_ULTIMA_MANUTENCAO = new Ext.form.DateField({
        id: 'ULTIMA_MANUTENCAO',
        name: 'ULTIMA_MANUTENCAO',
        fieldLabel: 'Ultima Manuten&ccedil;&atilde;o',
        width: 94,
        allowBlank: false
    });

    var TXT_PERIODO_DIAS_MANUTENCAO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Per&iacute;odo de Manuten&ccedil;&atilde;o (KM)',
        name: 'PERIODO_DIAS_MANUTENCAO',
        id: 'PERIODO_DIAS_MANUTENCAO',
        minValue: 1,
        maxValue: 2000000,
        width: 75
    });

    var TXT_VALOR_MANUTENCAO = new Ext.form.NumberField({
        fieldLabel: 'Custo da Manuten&ccedil;&atilde;o',
        width: 100,
        name: 'VALOR_MANUTENCAO',
        id: 'VALOR_MANUTENCAO',
        allowBlank: false,
        decimalPrecision: 4,
        minValue: 0.0001
    });

    var formManutencao = new Ext.FormPanel({
        id: 'formManutencao',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 180,
        items: [{
            layout: 'form',
            items: [TXT_DESCRICAO_MANUTENCAO]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.18,
                layout: 'form',
                items: [TXT_PERIODO_DIAS_MANUTENCAO]
            }, {
                columnWidth: 0.22,
                layout: 'form',
                items: [TXT_ULTIMA_MANUTENCAO]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [TXT_VALOR_MANUTENCAO]
            }]
        }]
    });

    function resetaFormularioManutencao() {
        Ext.getCmp('DESCRICAO_MANUTENCAO').reset();
        Ext.getCmp('PERIODO_DIAS_MANUTENCAO').reset();

        Ext.getCmp('ULTIMA_MANUTENCAO').reset();
        Ext.getCmp('VALOR_MANUTENCAO').reset();
    }

    function PopulaFormulario_TB_MANUTENCAO_VEICULO(record) {
        formManutencao.getForm().loadRecord(record);

        Ext.getCmp('ID_MANUTENCAO').setValue(record.data.ID_MANUTENCAO);
        Ext.getCmp('ULTIMA_MANUTENCAO').reset();
        Ext.getCmp('ULTIMA_MANUTENCAO').setRawValue(XMLParseDate(record.data.ULTIMA_MANUTENCAO));

        panelCadastroManutencaoVeiculo.setTitle('Alterar dados da Manuten&ccedil;&atilde;o do Ve&iacute;culo');

        buttonGroup_TB_MANUTENCAO_VEICULO.items.items[32].enable();

        formManutencao.getForm().findField('DESCRICAO_MANUTENCAO').focus();
    }

    var TB_MANUTENCAO_VEICULO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                ['PLACA_VEICULO', 'ID_MANUTENCAO', 'DESCRICAO_MANUTENCAO', 'ULTIMA_MANUTENCAO', 'PERIODO_DIAS_MANUTENCAO', 'VALOR_MANUTENCAO']
                )
    });

    var gridManutencaoVeiculo = new Ext.grid.GridPanel({
        id: 'gridManutencaoVeiculo',
        store: TB_MANUTENCAO_VEICULO_Store,
        columns: [
                    { id: 'PLACA_VEICULO', header: "Placa do Ve&iacute;culo", width: 120, sortable: true, dataIndex: 'PLACA_VEICULO' },
                    { id: 'DESCRICAO_MANUTENCAO', header: "Descri&ccedil;&atilde;o dos Servi&ccedil;os", width: 560, sortable: true, dataIndex: 'DESCRICAO_MANUTENCAO' },
                    { id: 'ULTIMA_MANUTENCAO', header: "Ultima Manuten&ccedil;&atilde;o", width: 120, sortable: true, dataIndex: 'ULTIMA_MANUTENCAO', renderer: XMLParseDate, align: 'center' },
                    { id: 'PERIODO_DIAS_MANUTENCAO', header: "Per&iacute;odo de Manuten&ccedil;&atilde;o (KM)", width: 160, sortable: true, dataIndex: 'PERIODO_DIAS_MANUTENCAO', align: 'center' },
                    { id: 'VALOR_MANUTENCAO', header: "Custo da Manuten&ccedil;&atilde;o", width: 135, sortable: true, dataIndex: 'VALOR_MANUTENCAO', renderer: FormataValor_4, align: 'center' }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridManutencaoVeiculo.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_MANUTENCAO_VEICULO(record);
    });

    gridManutencaoVeiculo.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridManutencaoVeiculo.getSelectionModel().getSelections().length > 0) {
                var record = gridManutencaoVeiculo.getSelectionModel().getSelected();
                PopulaFormulario_TB_MANUTENCAO_VEICULO(record);
            }
        }
    });

    function Apoio_PopulaGrid_MANUTENCAO_VEICULO(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_MANUTENCAO_VEICULO_CARREGA_GRID();
        }
    }

    var TXT_FILTRO_MANUTENCAO = new Ext.form.TextField({
        fieldLabel: 'Descri&ccedil;&atilde;o dos servi&ccedil;os',
        name: 'FILTRO_MANUTENCAO',
        id: 'FILTRO_MANUTENCAO',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                Apoio_PopulaGrid_MANUTENCAO_VEICULO(f, e);
            }
        }
    });

    var BTN_TB_VEICULO_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_MANUTENCAO_VEICULO_CARREGA_GRID();
        }
    });

    function RetornaVEICULO_JsonData() {
        var modelo = TXT_FILTRO_MANUTENCAO.getValue() ? TXT_FILTRO_MANUTENCAO.getValue() : '';

        var VEICULO_JsonData = {
            PLACA: Ext.getCmp('PLACA').getValue(),
            MANUTENCAO: modelo,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return VEICULO_JsonData;
    }

    var VEICULO_PagingToolbar = new Th2_PagingToolbar();
    VEICULO_PagingToolbar.setUrl('servicos/TB_MANUTENCAO_VEICULO.asmx/LISTA_TB_MANUTENCAO_VEICULO');
    VEICULO_PagingToolbar.setStore(TB_MANUTENCAO_VEICULO_Store);

    function TB_MANUTENCAO_VEICULO_CARREGA_GRID() {
        VEICULO_PagingToolbar.setParamsJsonData(RetornaVEICULO_JsonData());
        VEICULO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_MANUTENCAO_VEICULO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_MANUTENCAO_VEICULO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    buttonGroup_TB_MANUTENCAO_VEICULO.items.items[32].disable();

                                    formManutencao.getForm().items.items[0].enable();

                                    resetaFormularioManutencao();
                                    panelCadastroManutencaoVeiculo.setTitle('Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo');

                                    formManutencao.getForm().findField('DESCRICAO_MANUTENCAO').focus();
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
                                     Deleta_TB_MANUTENCAO_VEICULO();
                                 }
                             }]
    });

    var toolbar_TB_MANUTENCAO_VEICULO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_MANUTENCAO_VEICULO]
    });

    var panelCadastroManutencaoVeiculo = new Ext.Panel({
        width: '100%',
        border: true,
        autoHeight: true,
        title: 'Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo',
        items: [formManutencao, toolbar_TB_MANUTENCAO_VEICULO, gridManutencaoVeiculo, VEICULO_PagingToolbar.PagingToolbar(),
                            {
                                frame: true,
                                bodyStyle: 'padding:5px 5px 0',
                                width: '100%',
                                items: [{
                                    layout: 'column',
                                    items: [{
                                        columnWidth: 0.36,
                                        layout: 'form',
                                        labelWidth: 135,
                                        items: [TXT_FILTRO_MANUTENCAO]
                                    }, {
                                        columnWidth: 0.09,
                                        items: [BTN_TB_VEICULO_PESQUISA]
                                    }]
                                }]
                            }]
    });

    function GravaDados_TB_MANUTENCAO_VEICULO() {
        if (!formManutencao.getForm().isValid()) {
            return;
        }

        var dados = {
            PLACA_VEICULO: Ext.getCmp('PLACA').getValue(),
            ID_MANUTENCAO: Ext.getCmp('ID_MANUTENCAO').getValue(),
            DESCRICAO_MANUTENCAO: formManutencao.getForm().findField('DESCRICAO_MANUTENCAO').getValue(),
            ULTIMA_MANUTENCAO: Ext.getCmp('ULTIMA_MANUTENCAO').getRawValue(),
            PERIODO_DIAS_MANUTENCAO: Ext.getCmp('PERIODO_DIAS_MANUTENCAO').getValue(),
            VALOR_MANUTENCAO: Ext.getCmp('VALOR_MANUTENCAO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroManutencaoVeiculo.title == "Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo" ?
                        'servicos/TB_MANUTENCAO_VEICULO.asmx/GravaNovaManutencao' :
                        'servicos/TB_MANUTENCAO_VEICULO.asmx/AtualizaManutencao';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroManutencaoVeiculo.title == "Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo") {
                resetaFormularioManutencao();

                if (Ext.getCmp('FILTRO_MANUTENCAO').getValue() == '') {
                    Ext.getCmp('DESCRICAO_MANUTENCAO').focus();
                    TB_MANUTENCAO_VEICULO_CARREGA_GRID();
                }
            }
            else {
                Ext.getCmp('DESCRICAO_MANUTENCAO').focus();
                TB_MANUTENCAO_VEICULO_CARREGA_GRID();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_MANUTENCAO_VEICULO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este registro?', 'formManutencao', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var dados = {
                    PLACA_VEICULO: Ext.getCmp('PLACA').getValue(),
                    ID_MANUTENCAO: Ext.getCmp('ID_MANUTENCAO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                };

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_MANUTENCAO_VEICULO.asmx/DeletaManutencao');
                _ajax.setJsonData(dados);

                var _sucess = function (response, options) {
                    panelCadastroManutencaoVeiculo.setTitle("Nova Manuten&ccedil;&atilde;o de Ve&iacute;culo");
                    Ext.getCmp('DESCRICAO_MANUTENCAO').focus();

                    resetaFormularioManutencao();

                    buttonGroup_TB_MANUTENCAO_VEICULO.items.items[32].disable();
                    formManutencao.getForm().items.items[0].enable();

                    TB_MANUTENCAO_VEICULO_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridManutencaoVeiculo.setHeight(AlturaDoPainelDeConteudo(formManutencao.height) - 197);

    this.CARREGA_MANUTENCAO = function () {
        TB_MANUTENCAO_VEICULO_CARREGA_GRID();
    };

    this.PANEL_MANUTENCAO = function () {
        return panelCadastroManutencaoVeiculo;
    };
}