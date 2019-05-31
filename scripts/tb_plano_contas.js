var combo_TB_PLANO_CONTAS_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_PLANO', 'DESCRICAO_PLANO']
       )
});

function TB_PLANO_CONTAS_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_PLANO_CONTAS.asmx/CarregaPlanos');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_PLANO_CONTAS_Store.loadData(criaObjetoXML(result), false);
    };
    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

////////////////////////////

function RetornaLayoutCadastroPlanoContas() {
    var formPlanoContas = new Ext.FormPanel({
        id: 'formPlanoContas',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: '100%',
        items: [{
            layout: 'form',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'ID do Plano',
                name: 'ID_PLANO',
                id: 'ID_PLANO',
                width: 100,
                autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
                allowBlank: false,
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            TB_PLANO_CONTAS_BuscaPlano();
                        }
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: 'Descri&ccedil;&atilde;o',
                name: 'DESCRICAO_PLANO',
                id: 'DESCRICAO_PLANO',
                width: 850,
                allowBlank: false,
                msgTarget: 'side',
                maxLength: 120,
                autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '120' }
            }, {
                xtype: 'textfield',
                fieldLabel: 'Pertence ao Plano',
                name: 'PAI_PLANO',
                id: 'PAI_PLANO',
                width: 100,
                autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10' },
                listeners: {
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            GravaDados_TB_PLANO_CONTAS();
                        }
                    }
                }
            }]
        }]
    });

    function TB_PLANO_CONTAS_BuscaPlano() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PLANO_CONTAS.asmx/BuscaPorID');
        _ajax.setJsonData({
            ID_PLANO: formPlanoContas.getForm().findField('ID_PLANO').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            formPlanoContas.getForm().findField('ID_PLANO').setValue(result.ID_PLANO);
            formPlanoContas.getForm().findField('DESCRICAO_PLANO').setValue(result.DESCRICAO_PLANO);
            formPlanoContas.getForm().findField('PAI_PLANO').setValue(result.PAI_PLANO);

            panelCadastroPlanoContas.setTitle('Alterar dados da Fam&iacute;lia de Produtos');
            buttonGroup_TB_PLANO_CONTAS.items.items[32].enable();

            formPlanoContas.getForm().findField('ID_PLANO').disable();
            formPlanoContas.getForm().findField('DESCRICAO_PLANO').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function PopulaFormulario_TB_PLANO_CONTAS(record, wPesquisa) {
        formPlanoContas.getForm().loadRecord(record);
        panelCadastroPlanoContas.setTitle('Alterar dados do Plano de Contas');

        buttonGroup_TB_PLANO_CONTAS.items.items[32].enable();

        formPlanoContas.getForm().findField('ID_PLANO').disable();

        Ext.getDom('DESCRICAO_PLANO').focus();
    }

    ///////////////////////// Area do grid /////////////////////////
    var TB_PLANO_CONTAS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PLANO', 'DESCRICAO_PLANO', 'PAI_PLANO']
       )
    });

    var gridPlano = new Ext.grid.GridPanel({
        store: TB_PLANO_CONTAS_Store,
        columns: [
        { id: 'ID_PLANO', header: "ID", width: 100, sortable: true, dataIndex: 'ID_PLANO' },
        { id: 'DESCRICAO_PLANO', header: "Descri&ccedil;&atilde;o", width: 340, sortable: true, dataIndex: 'DESCRICAO_PLANO' },
        { id: 'PAI_PLANO', header: "Pertencente ao Plano", width: 300, sortable: true, dataIndex: 'PAI_PLANO' }
    ],
        stripeRows: true,
        height: 350,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    ////////////////////
    var TB_PLANO1_PagingToolbar = new Th2_PagingToolbar();

    TB_PLANO1_PagingToolbar.setUrl('servicos/TB_PLANO_CONTAS.asmx/Lista_TB_PLANO_CONTAS');
    TB_PLANO1_PagingToolbar.setStore(TB_PLANO_CONTAS_Store);

    function RetornaFiltros_TB_PLANOS_JsonData() {
        var _pesquisa = Ext.getCmp('TB_PLANO_CONTAS_TXT_PESQUISA') ?
                            Ext.getCmp('TB_PLANO_CONTAS_TXT_PESQUISA').getValue() : '';

        if (_pesquisa == undefined) {
            _pesquisa = '';
        }

        var TB_TRANSP_JsonData = {
            pesquisa: _pesquisa,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_PLANO1_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_Busca_Planos() {
        TB_PLANO1_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_PLANOS_JsonData());
        TB_PLANO1_PagingToolbar.doRequest();
    }

    ////////////////////

    var TB_PLANO_CONTAS_TXT_PESQUISA = new Ext.form.TextField({
        id: 'TB_PLANO_CONTAS_TXT_PESQUISA',
        name: 'TB_PLANO_CONTAS_TXT_PESQUISA',
        layout: 'form',
        fieldLabel: 'Descri&ccedil;&atilde;o do Plano',
        width: 290,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_Planos();
                }
            }
        }
    });

    var TB_PLANO_CONTAS_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_Planos();
        }
    });

    gridPlano.on('rowdblclick', function (grid, rowIndex, e) {
        var store = grid.getStore();
        var record = store.getAt(rowIndex);

        PopulaFormulario_TB_PLANO_CONTAS(record);
    });

    gridPlano.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridPlano.getSelectionModel().getSelections().length > 0) {
                var record = gridPlano.getSelectionModel().getSelected();
                PopulaFormulario_TB_PLANO_CONTAS(record);
            }
        }
    });

    function TB_PLANO_CONTAS_Executa_Pesquisa(grid) {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_PLANO_CONTAS.asmx/Lista_TB_PLANO_CONTAS');
        _ajax.setJsonData({
            Pesquisa: Ext.get('TB_PLANO_CONTAS_TXT_PESQUISA').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            grid.getStore().loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var buttonGroup_TB_PLANO_CONTAS = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_PLANO_CONTAS();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Novo Plano',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function () {
                            formPlanoContas.getForm().reset();

                            buttonGroup_TB_PLANO_CONTAS.items.items[32].disable();
                            formPlanoContas.getForm().findField('ID_PLANO').enable();
                            Ext.getDom('ID_PLANO').focus();
                            panelCadastroPlanoContas.setTitle('Novo Plano');
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                     {
                         id: 'BTN_DELETAR_TB_PLANO_CONTAS',
                         text: 'Deletar',
                         icon: 'imagens/icones/database_delete_24.gif',
                         scale: 'medium',
                         disabled: true,
                         handler: function () {
                             Deleta_TB_PLANO_CONTAS();
                         }
                     }]
    });

    var toolbar_TB_PLANO_CONTAS = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_PLANO_CONTAS]
    });

    function GravaDados_TB_PLANO_CONTAS() {
        if (!formPlanoContas.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_PLANO: formPlanoContas.getForm().findField('ID_PLANO').getValue(),
            DESCRICAO_PLANO: formPlanoContas.getForm().findField('DESCRICAO_PLANO').getValue(),
            PAI_PLANO: formPlanoContas.getForm().findField('PAI_PLANO').getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroPlanoContas.title == "Novo Plano" ?
                    'servicos/TB_PLANO_CONTAS.asmx/GravaNovoPlano' :
                    'servicos/TB_PLANO_CONTAS.asmx/AtualizaPlano';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroPlanoContas.title == "Novo Plano") {
                formPlanoContas.getForm().reset();
                Ext.getDom('ID_PLANO').focus();
            }
            else {
                Ext.getDom('DESCRICAO_PLANO').focus();
            }

            var pai = formPlanoContas.getForm().findField('PAI_PLANO').getValue() == '' ? 0 :
                                formPlanoContas.getForm().findField('PAI_PLANO').getValue();

            Carrega_Busca_Planos();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_PLANO_CONTAS() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Plano [' +
                        formPlanoContas.getForm().findField('DESCRICAO_PLANO').getValue() + ']?', 'formPlanoContas', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PLANO_CONTAS.asmx/DeletaPlano');
                _ajax.setJsonData({
                    ID_PLANO: formPlanoContas.getForm().findField('ID_PLANO').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    formPlanoContas.getForm().reset();
                    buttonGroup_TB_PLANO_CONTAS.items.items[32].disable();

                    formPlanoContas.getForm().findField('ID_PLANO').enable();
                    formPlanoContas.getForm().findField('ID_PLANO').focus();
                    panelCadastroPlanoContas.setTitle('Novo Plano');

                    Carrega_Busca_Planos();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var panelCadastroPlanoContas = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Plano',
        items: [formPlanoContas, toolbar_TB_PLANO_CONTAS, gridPlano, TB_PLANO1_PagingToolbar.PagingToolbar(),
                    {
                        layout: 'column',
                        frame: true,
                        items: [{
                            columnWidth: .34,
                            layout: 'form',
                            labelAlign: 'left',
                            labelWidth: 120,
                            style: 'vertical-align: bottom;',
                            items: [TB_PLANO_CONTAS_TXT_PESQUISA]
                        }, {
                            columnWidth: .10,
                            style: 'vertical-align: bottom;',
                            items: [TB_PLANO_CONTAS_BTN_PESQUISA]
                        }]
                    }]
    });

    var xAlturaConteudo = Ext.getCmp('tabConteudo').getHeight();
    gridPlano.setHeight(xAlturaConteudo - 327);

    Carrega_Busca_Planos();

    return panelCadastroPlanoContas;
}