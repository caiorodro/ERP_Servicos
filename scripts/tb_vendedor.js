
var combo_TB_VENDEDORES_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_VENDEDOR', 'NOME_VENDEDOR']
       )
});

function TB_USUARIO_CARREGA_VENDEDORES() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_VENDEDOR.asmx/CarregaVendedores');
    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        combo_TB_VENDEDORES_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroVendedores() {

    var wPesquisa_Vendedor = new TB_VENDEDOR_MontaPesquisa();

    var TXT_ID_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'ID do(a) Vendedor(a)',
        name: 'ID_VENDEDOR',
        id: 'ID_VENDEDOR',
        width: 75,
        maxLength: 10,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '10', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_VENDEDOR_Busca(this);
                }
            }
        }
    });

    var TXT_NOME_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'Nome',
        name: 'NOME_VENDEDOR',
        id: 'NOME_VENDEDOR',
        width: 400,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        allowBlank: false,
        msgTarget: 'side'
    });

    var TXT_CELULAR_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'Telefone Celular',
        name: 'CELULAR_VENDEDOR',
        id: 'CELULAR_VENDEDOR',
        width: 180,
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_EMAIL_VENDEDOR = new Ext.form.TextField({
        id: 'EMAIL_VENDEDOR',
        name: 'EMAIL_VENDEDOR',
        fieldLabel: 'e-mail',
        width: 330,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' },
        vtype: 'email'
    });

    var TXT_SKYPE_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'skype',
        name: 'SKYPE_VENDEDOR',
        id: 'SKYPE_VENDEDOR',
        width: 400,
        maxLength: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '100' }
    });

    var TXT_PERC_COMISSAO_VENDEDOR = new Ext.form.NumberField({
        fieldLabel: '% de Geral de Comiss&atilde;o',
        name: 'PERC_COMISSAO_VENDEDOR',
        id: 'PERC_COMISSAO_VENDEDOR',
        width: 100,
        decimalPrecision: 2,
        decimalSeparator: ',',
        value: 0.00,
        minValue: 0.00
    });

    var combo_CODIGO_EMITENTE_VENDEDOR = new Ext.form.ComboBox({
        fieldLabel: 'Empresa / Filial',
        id: 'CODIGO_EMITENTE_VENDEDOR',
        name: 'CODIGO_EMITENTE_VENDEDOR',
        valueField: 'CODIGO_EMITENTE',
        displayField: 'NOME_FANTASIA_EMITENTE',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        msgTarget: 'side',
        store: combo_TB_EMITENTE_STORE
    });

    var TXT_OBS_VENDEDOR = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&otilde;es',
        width: 100,
        name: 'OBS_VENDEDOR',
        id: 'OBS_VENDEDOR',
        anchor: '98%',
        height: 95,
        maxLength: 150,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    TB_USUARIO_CARREGA_VENDEDORES();

    var combo_SUPERVISOR_LIDER = new Ext.form.ComboBox({
        fieldLabel: 'Supervisor / L&iacute;der',
        id: 'SUPERVISOR_LIDER',
        name: 'SUPERVISOR_LIDER',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        msgTarget: 'side',
        store: combo_TB_VENDEDORES_Store
    });

    var CB_VENDEDOR_ATIVO = new Ext.form.ComboBox({
        fieldLabel: 'Vendedor Ativo',
        id: 'VENDEDOR_ATIVO',
        name: 'VENDEDOR_ATIVO',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 70,
        allowBlank: false,
        msgTarget: 'side',
        value: 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Não'], [1, 'Sim']]
        })
    });

    var formVENDEDOR = new Ext.FormPanel({
        id: 'formVENDEDOR',
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        width: '100%',
        height: AlturaDoPainelDeConteudo(128),
        labelAlign: 'top',
        width: '100%',
        items: [{
            xtype: 'fieldset',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            title: 'Dados do Vendedor',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.15,
                    layout: 'form',
                    items: [TXT_ID_VENDEDOR]
                }, {
                    columnWidth: 0.40,
                    layout: 'form',
                    items: [TXT_NOME_VENDEDOR]
                }, {
                    columnWidth: 0.15,
                    layout: 'form',
                    items: [CB_VENDEDOR_ATIVO]
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    items: [combo_SUPERVISOR_LIDER]
                }]
            }]
        }, {
            xtype: 'fieldset',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            title: 'Contato',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_CELULAR_VENDEDOR]
                }, {
                    columnWidth: 0.35,
                    layout: 'form',
                    items: [TXT_EMAIL_VENDEDOR]
                }, {
                    columnWidth: 0.40,
                    layout: 'form',
                    items: [TXT_SKYPE_VENDEDOR]
                }]
            }]
        }, {
            xtype: 'fieldset',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            title: 'Empresa / Filial',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [TXT_PERC_COMISSAO_VENDEDOR]
                }, {
                    columnWidth: 0.35,
                    layout: 'form',
                    items: [combo_CODIGO_EMITENTE_VENDEDOR]
                }]
            }, {
                layout: 'form',
                items: [TXT_OBS_VENDEDOR]
            }]
        }]
    });


    function TB_VENDEDOR_Busca(field) {
        var _ajax = new Th2_Ajax();
        var Url = '';
        var jsData;

        if (field.id == 'ID_VENDEDOR') {
            Url = 'servicos/TB_VENDEDOR.asmx/BuscaPorID';
            jsData = { ID_VENDEDOR: field.getValue(), ID_USUARIO: _ID_USUARIO };
        }

        _ajax.setUrl(Url);
        _ajax.setJsonData(jsData);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            formVENDEDOR.getForm().findField('ID_VENDEDOR').setValue(result.ID_VENDEDOR);
            formVENDEDOR.getForm().findField('NOME_VENDEDOR').setValue(result.NOME_VENDEDOR);
            formVENDEDOR.getForm().findField('CELULAR_VENDEDOR').setValue(result.CELULAR_VENDEDOR);
            formVENDEDOR.getForm().findField('EMAIL_VENDEDOR').setValue(result.EMAIL_VENDEDOR);
            formVENDEDOR.getForm().findField('SKYPE_VENDEDOR').setValue(result.SKYPE_VENDEDOR);
            formVENDEDOR.getForm().findField('PERC_COMISSAO_VENDEDOR').setValue(result.PERC_COMISSAO_VENDEDOR);
            formVENDEDOR.getForm().findField('CODIGO_EMITENTE_VENDEDOR').setValue(result.CODIGO_EMITENTE_VENDEDOR);
            formVENDEDOR.getForm().findField('OBS_VENDEDOR').setValue(result.OBS_VENDEDOR);
            Ext.getCmp('SUPERVISOR_LIDER').setValue(result.SUPERVISOR_LIDER);
            CB_VENDEDOR_ATIVO.setValue(result.VENDEDOR_ATIVO);

            panelCadastroVENDEDOR.setTitle('Alterar dados do Vendedor');

            buttonGroup_TB_VENDEDOR.items.items[32].enable();
            formVENDEDOR.getForm().items.items[0].disable();

            Ext.getCmp('TB_VENDEDOR_TABPANEL').items.items[1].enable();

            Ext.getCmp('NOME_VENDEDOR').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function PopulaFormulario_TB_VENDEDOR(record, _Pesquisa) {
        formVENDEDOR.getForm().loadRecord(record);
        panelCadastroVENDEDOR.setTitle('Alterar dados do Vendedor');

        buttonGroup_TB_VENDEDOR.items.items[32].enable();
        formVENDEDOR.getForm().items.items[0].disable();

        Ext.getCmp('TB_VENDEDOR_TABPANEL').items.items[1].enable();

        Ext.getCmp('NOME_VENDEDOR').focus();
        _Pesquisa.hide();
    }

    ///////////////////////// Area do grid /////////////////////////
    function TB_VENDEDOR_MontaPesquisa() {
        var TB_VENDEDOR_Store = new Ext.data.Store({
            reader: new Ext.data.XmlReader({
                record: 'Tabela'
            }, ['ID_VENDEDOR', 'NOME_VENDEDOR', 'CELULAR_VENDEDOR', 'EMAIL_VENDEDOR', 'SKYPE_VENDEDOR', 'PERC_COMISSAO_VENDEDOR',
                    'CODIGO_EMITENTE', 'OBS_VENDEDOR', 'SUPERVISOR_LIDER', 'VENDEDOR_ATIVO']
)
        });

        var gridVENDEDOR = new Ext.grid.GridPanel({
            store: TB_VENDEDOR_Store,
            columns: [
{ id: 'ID_VENDEDOR', header: "ID", width: 50, sortable: true, dataIndex: 'ID_VENDEDOR' },
{ id: 'NOME_VENDEDOR', header: "Nome", width: 250, sortable: true, dataIndex: 'NOME_VENDEDOR' },
{ id: 'CELULAR_VENDEDOR', header: "Tel. Celular", width: 180, sortable: true, dataIndex: 'CELULAR_VENDEDOR' },
{ id: 'EMAIL_VENDEDOR', header: "e-mail", width: 180, sortable: true, dataIndex: 'EMAIL_VENDEDOR' },
{ id: 'SKYPE_VENDEDOR', header: "skype", width: 200, sortable: true, dataIndex: 'SKYPE_VENDEDOR' },
{ id: 'PERC_COMISSAO_VENDEDOR', header: "% de Comiss&atilde;o", width: 100, sortable: true, dataIndex: 'PERC_COMISSAO_VENDEDOR' },
{ id: 'CODIGO_EMITENTE', header: "Empresa", width: 80, sortable: true, dataIndex: 'CODIGO_EMITENTE', hidden: true },
{ id: 'OBS_VENDEDOR', header: "Empresa", width: 200, sortable: true, dataIndex: 'OBS_VENDEDOR', hidden: true }
],
            stripeRows: true,
            height: 450,
            width: 1000,

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        var TB_VENDEDOR_TXT_PESQUISA = new Ext.form.TextField({
            layout: 'form',
            fieldLabel: 'Nome do Vendedor',
            width: 290,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        TB_VENDEDOR_Executa_Pesquisa(gridVENDEDOR);
                    }
                }
            }
        });

        var TB_VENDEDOR_BTN_PESQUISA = new Ext.Button({
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function () {
                TB_VENDEDOR_Executa_Pesquisa();
            }
        });

        function RetornaFiltros_TB_VENDEDOR_JsonData() {
            var TB_TRANSPORTADORA_JsonData = {
                pesquisa: TB_VENDEDOR_TXT_PESQUISA.getValue(),
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: TB_VENDEDOR_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSPORTADORA_JsonData;
        }

        var TB_VENDEDOR_PagingToolbar = new Th2_PagingToolbar();

        TB_VENDEDOR_PagingToolbar.setUrl('servicos/TB_VENDEDOR.asmx/Carrega_Vendedores');
        TB_VENDEDOR_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_VENDEDOR_JsonData());
        TB_VENDEDOR_PagingToolbar.setStore(TB_VENDEDOR_Store);

        function TB_VENDEDOR_Executa_Pesquisa() {
            TB_VENDEDOR_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_VENDEDOR_JsonData());
            TB_VENDEDOR_PagingToolbar.doRequest();
        }

        var wgridVENDEDOR = new Ext.Window({
            id: 'wgridVENDEDOR',
            layout: 'form',
            title: 'Busca',
            iconCls: 'icone_TB_VENDEDOR',
            width: 1010,
            height: 'auto',
            closable: false,
            draggable: true,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            },
            items: [gridVENDEDOR, TB_VENDEDOR_PagingToolbar.PagingToolbar(), {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .46,
                    layout: 'form',
                    labelAlign: 'left',
                    labelWidth: 150,
                    style: 'vertical-align: bottom;',
                    items: [TB_VENDEDOR_TXT_PESQUISA]
                }, {
                    columnWidth: .32,
                    style: 'vertical-align: bottom;',
                    items: [TB_VENDEDOR_BTN_PESQUISA]
                }]
            }]
        });

        gridVENDEDOR.on('rowdblclick', function (grid, rowIndex, e) {
            var store = grid.getStore();
            var record = store.getAt(rowIndex);

            PopulaFormulario_TB_VENDEDOR(record, wgridVENDEDOR);
            Ext.getCmp('CODIGO_EMITENTE_VENDEDOR').setValue(record.data.CODIGO_EMITENTE);
        });

        gridVENDEDOR.on('keydown', function (e) {
            if (e.getKey() == e.ENTER) {
                if (gridVENDEDOR.getSelectionModel().getSelections().length > 0) {
                    var record = gridVENDEDOR.getSelectionModel().getSelected();
                    PopulaFormulario_TB_VENDEDOR(record, wgridVENDEDOR);
                    Ext.getCmp('CODIGO_EMITENTE_VENDEDOR').setValue(record.data.CODIGO_EMITENTE);
                }
            }
        });

        this.show = function (elm) {
            wgridVENDEDOR.show(elm);
        };
    }

    var buttonGroup_TB_VENDEDOR = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_VENDEDOR();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    {
        text: 'Novo Vendedor',
        icon: 'imagens/icones/database_fav_24.gif',
        scale: 'medium',
        handler: function () {
            formVENDEDOR.getForm().reset();
            buttonGroup_TB_VENDEDOR.items.items[32].disable();
            formVENDEDOR.getForm().findField('ID_VENDEDOR').enable();

            panelCadastroVENDEDOR.setTitle('Novo Vendedor');
            Ext.getCmp('TB_VENDEDOR_TABPANEL').items.items[1].disable();

            Ext.getCmp('NOME_VENDEDOR').focus();
        }
    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
     {
         id: 'BTN_DELETAR_TB_VENDEDOR',
         text: 'Deletar',
         icon: 'imagens/icones/database_delete_24.gif',
         scale: 'medium',
         disabled: true,
         handler: function () {
             Deleta_TB_VENDEDOR();
         }
     }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    {
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'medium',
        handler: function () {
            wPesquisa_Vendedor.show('formVENDEDOR');
        }
    }]
    });

    var toolbar_TB_VENDEDOR = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_VENDEDOR]
    });

    var panelCadastroVENDEDOR = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Vendedor'
    });

    function GravaDados_TB_VENDEDOR() {
        if (!formVENDEDOR.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_VENDEDOR: formVENDEDOR.getForm().findField('ID_VENDEDOR').getValue(),
            NOME_VENDEDOR: formVENDEDOR.getForm().findField('NOME_VENDEDOR').getValue(),
            CELULAR_VENDEDOR: formVENDEDOR.getForm().findField('CELULAR_VENDEDOR').getValue(),
            EMAIL_VENDEDOR: formVENDEDOR.getForm().findField('EMAIL_VENDEDOR').getValue(),
            SKYPE_VENDEDOR: formVENDEDOR.getForm().findField('SKYPE_VENDEDOR').getValue(),
            PERC_COMISSAO_VENDEDOR: formVENDEDOR.getForm().findField('PERC_COMISSAO_VENDEDOR').getValue(),
            CODIGO_EMITENTE: formVENDEDOR.getForm().findField('CODIGO_EMITENTE_VENDEDOR').getValue(),
            OBS_VENDEDOR: formVENDEDOR.getForm().findField('OBS_VENDEDOR').getValue(),
            SUPERVISOR_LIDER: Ext.getCmp('SUPERVISOR_LIDER').getValue(),
            VENDEDOR_ATIVO: CB_VENDEDOR_ATIVO.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroVENDEDOR.title == "Novo Vendedor" ?
                                'servicos/TB_VENDEDOR.asmx/GravaNovoVendedor' :
                                'servicos/TB_VENDEDOR.asmx/AtualizaVendedor';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroVENDEDOR.title == "Novo Vendedor")
                formVENDEDOR.getForm().reset();

            TB_USUARIO_CARREGA_VENDEDORES();
            Ext.getCmp('NOME_VENDEDOR').focus();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_VENDEDOR() {
        dialog.MensagemDeConfirmacao('Deseja deletar este(a) Vendedor(a) [' +
                            formVENDEDOR.getForm().findField('NOME_VENDEDOR').getValue() + ']?', 'formVENDEDOR', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_VENDEDOR.asmx/DeletaVendedor');
                _ajax.setJsonData({ 
                    ID_VENDEDOR: Ext.getCmp('ID_VENDEDOR').getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    formVENDEDOR.getForm().reset();
                    buttonGroup_TB_VENDEDOR.items.items[32].disable();
                    buttonGroup_TB_VENDEDOR.items.items[0].enable();

                    panelCadastroVENDEDOR.setTitle('Novo Vendedor');

                    TB_USUARIO_CARREGA_VENDEDORES();

                    Ext.getCmp('TB_VENDEDOR_TABPANEL').items.items[1].disable();
                    Ext.getCmp('NOME_VENDEDOR').focus();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    /////////////////////////

    var pComissao = new MontaTabelaComissao();

    var TB_VENDEDOR_TABPANEL = new Ext.TabPanel({
        id: 'TB_VENDEDOR_TABPANEL',
        deferredRender: false,
        activeTab: 0,
        items: [{
            title: 'Dados Principais',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_CLIENTE_DADOS_GERAIS'
        }, {
            title: 'Tabela de Margens',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_VENDEDOR_COMISSAO',
            disabled: true
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (panel.title == 'Tabela de Margens') {
                    if (panel.items.length == 0) {
                        panel.add(pComissao.PanelComissao());
                        panel.doLayout();
                    }
                }
            }
        }
    });

    TB_VENDEDOR_TABPANEL.items.items[0].add(formVENDEDOR);
    TB_VENDEDOR_TABPANEL.items.items[0].add(toolbar_TB_VENDEDOR);

    panelCadastroVENDEDOR.add(TB_VENDEDOR_TABPANEL);

    TB_VENDEDOR_TABPANEL.items.items[1].on('activate', function (p) {
        var _ID_VENDEDOR = formVENDEDOR.getForm().findField('ID_VENDEDOR').getValue();
        var _NOME_VENDEDOR = formVENDEDOR.getForm().findField('NOME_VENDEDOR').getValue();

        Ext.getCmp('MARGEM_INICIAL').reset();
        Ext.getCmp('MARGEM_FINAL').reset();
        Ext.getCmp('PERCENTUAL_COMISSAO').reset();

        pComissao.CARREGA_COMISSOES(_ID_VENDEDOR, _NOME_VENDEDOR);
    });

    return panelCadastroVENDEDOR;
}