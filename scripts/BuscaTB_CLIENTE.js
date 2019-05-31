function BUSCA_TB_CLIENTE() {
    var TB_CLIENTE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'NOME_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'CNPJ_CLIENTE', 'IE_CLIENTE', 'IE_SUFRAMA',
        'ENDERECO_FATURA', 'CEP_FATURA', 'BAIRRO_FATURA', 'CIDADE_FATURA', 'DESCRICAO_CIDADE_FATURA', 'ESTADO_FATURA', 'DESCRICAO_ESTADO_FATURA', 'TELEFONE_FATURA', 'CONTATOS',
        'ENDERECO_ENTREGA', 'CEP_ENTREGA', 'BAIRRO_ENTREGA', 'CIDADE_ENTREGA', 'DESCRICAO_CIDADE_ENTREGA', 'ESTADO_ENTREGA', 'DESCRICAO_ESTADO_ENTREGA', 'TELEFONE_ENTREGA',
        'ENDERECO_COBRANCA', 'CEP_COBRANCA', 'BAIRRO_COBRANCA', 'CIDADE_COBRANCA', 'DESCRICAO_CIDADE_COBRANCA', 'ESTADO_COBRANCA', 'DESCRICAO_ESTADO_COBRANCA', 'TELEFONE_COBRANCA']
            )
    });

    var TB_CLIENTE_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '{CONTATOS}'
        ),
        expandOnEnter: false,
        expandDblClick: false
    });

    var gridTB_CLIENTE = new Ext.grid.GridPanel({
        store: TB_CLIENTE_Store,
        columns: [
        //TB_CLIENTE_expander,
        {id: 'ID_CLIENTE', header: 'ID', width: 50, sortable: true, dataIndex: 'ID_CLIENTE' },
        { id: 'NOME_CLIENTE', header: "Nome / Raz&atilde;o Social", width: 340, sortable: true, dataIndex: 'NOME_CLIENTE' },
        { id: 'NOMEFANTASIA_CLIENTE', header: "Nome Fantasia", width: 220, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
        { id: 'CNPJ_CLIENTE', header: "CNPJ", width: 150, sortable: true, dataIndex: 'CNPJ_CLIENTE' },
        { id: 'IE_CLIENTE', header: "Inscri&ccedil;&atilde;o Estadual", width: 140, sortable: true, dataIndex: 'IE_CLIENTE' }

        ],
        stripeRows: true,
        height: 350,
        width: 1000,
        columnLines: true,
        //plugins: TB_CLIENTE_expander,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            specialkey: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridTB_CLIENTE.getSelectionModel().getSelections().length > 0) {
                        var record = gridTB_CLIENTE.getSelectionModel().getSelected();
                        PopulaFormulario_TB_CLIENTE(record, wBUSCA_TB_CLIENTE);
                    }
                }
            }
        }
    });

    gridTB_CLIENTE.on('rowdblclick', function (e) {
        if (gridTB_CLIENTE.getSelectionModel().getSelections().length > 0) {
            var record = gridTB_CLIENTE.getSelectionModel().getSelected();
            PopulaFormulario_TB_CLIENTE(record, wBUSCA_TB_CLIENTE);
        }
    });

    var TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Nome Fantasia',
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_TXT_NOME_CLIENTE = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Parte da Razão Social',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_CLIENTE_CARREGA_GRID();
        }
    });

    var TB_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    TB_CLIENTE_PagingToolbar.setUrl('servicos/TB_CLIENTE.asmx/ListaClientes');
    TB_CLIENTE_PagingToolbar.setLinhasPorPagina(12);
    TB_CLIENTE_PagingToolbar.setStore(TB_CLIENTE_Store);

    function RetornaFiltros_TB_CLIENTE_JsonData() {
        var TB_CLIENTE_JsonData = {
            nomeFantasia: TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE.getValue(),
            nome: TB_CLIENTE_TXT_NOME_CLIENTE.getValue(),
            ID_USUARIO: _ID_USUARIO,
            GERENTE_COMERCIAL: _GERENTE_COMERCIAL,
            ID_VENDEDOR: _ID_VENDEDOR,
            VENDEDOR: _VENDEDOR,
            start: 0,
            limit: TB_CLIENTE_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    var wBUSCA_TB_CLIENTE = new Ext.Window({
        layout: 'form',
        title: 'Busca',
        iconCls: 'icone_TB_CLIENTE',
        width: 1010,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridTB_CLIENTE, TB_CLIENTE_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .31,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 90,
                items: [TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE]
            }, {
                columnWidth: .39,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 120,
                items: [TB_CLIENTE_TXT_NOME_CLIENTE]
            }, {
                columnWidth: .20,
                items: [TB_CLIENTE_BTN_PESQUISA]
            }]
        }],

        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function TB_CLIENTE_CARREGA_GRID() {
        TB_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_JsonData());
        TB_CLIENTE_PagingToolbar.doRequest();
    }

    function PopulaFormulario_TB_CLIENTE(record, wPesquisa) {
        Ext.getCmp('TB_CLIENTE_TABPANEL').setActiveTab(0);

        Ext.getCmp('formCLIENTE').getForm().findField('ID_CLIENTE').setValue(record.data.ID_CLIENTE);

        var _id = Ext.getCmp('ID_CLIENTE');
        TB_CLIENTE_Busca(_id);

        Ext.getCmp('panelCadastroCLIENTE').setTitle('Alterar dados do Cliente');

        if (SUPERVISOR_VENDEDOR == 0)
            Ext.getCmp('buttonGroup_TB_CLIENTE').items.items[32].enable();

        Ext.getCmp('formCLIENTE').getForm().items.items[0].disable();

        Ext.getDom('NOME_CLIENTE').focus();
        Ext.getCmp('TB_CLIENTE_TABPANEL').items.items[1].enable();

        var cidade1 = Ext.getCmp('CIDADE_ENTREGA');
        var cidade2 = Ext.getCmp('CIDADE_COBRANCA');

        if (cidade1.getValue() == "0") {
            Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').reset();
            Ext.getCmp('ESTADO_ENTREGA').reset();
            cidade1.reset();
        }

        if (cidade2.getValue() == "0") {
            Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').reset();
            Ext.getCmp('ESTADO_COBRANCA').reset();
            cidade2.reset();
        }

        wPesquisa.hide();
    }

    this.show = function (objAnm) {
        wBUSCA_TB_CLIENTE.show(objAnm);
    };
}