function BUSCA_TB_MUNICIPIO() {

    var ID_UF, Origem;

    this.UF = function (pUF) {
        ID_UF = pUF;
    };

    this.ORIGEM = function (pORIGEM) {
        Origem = pORIGEM;
    };

    var TB_MUNICIPIO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_MUNICIPIO', 'NOME_MUNICIPIO']
       )
    });

    var gridBUSCA_MUNICIPIO = new Ext.grid.GridPanel({
        store: TB_MUNICIPIO_STORE,
        columns: [
        { id: 'ID_MUNICIPIO', header: 'ID', width: 80, sortable: true, dataIndex: 'ID_MUNICIPIO' },
        { id: 'NOME_MUNICIPIO', header: "Nome do Munic&iacute;pio", width: 300, sortable: true, dataIndex: 'NOME_MUNICIPIO' }
        ],
        stripeRows: true,
        height: 450,
        width: '100%',
        columnLines: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridBUSCA_MUNICIPIO.getSelectionModel().getSelections().length > 0) {
                        var record = gridBUSCA_MUNICIPIO.getSelectionModel().getSelected();
                        PopulaFormulario_TB_CLIENTE_MUNICIPIO(record);
                    }
                }
            }
        }
    });

    gridBUSCA_MUNICIPIO.on('rowdblclick', function (e) {
        var record = gridBUSCA_MUNICIPIO.getSelectionModel().getSelected();
        PopulaFormulario_TB_CLIENTE_MUNICIPIO(record);
    });

    var TB_MUNICIPIO_TXT_NOME_MUNICIPIO = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Nome do Munic&iacute;pio',
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_MUNICIPIO_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_MUNICIPIO_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_MUNICIPIO_CARREGA_GRID();
        }
    });

    var TB_CLIENTE_MUNICIPIO_PagingToolbar = new Th2_PagingToolbar();

    TB_CLIENTE_MUNICIPIO_PagingToolbar.setUrl('servicos/TB_MUNICIPIOS.asmx/Carrega_Municipios');
    TB_CLIENTE_MUNICIPIO_PagingToolbar.setLinhasPorPagina(19);
    TB_CLIENTE_MUNICIPIO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_MUNICIPIO_JsonData());
    TB_CLIENTE_MUNICIPIO_PagingToolbar.setStore(TB_MUNICIPIO_STORE);

    function RetornaFiltros_TB_CLIENTE_MUNICIPIO_JsonData() {
        var municipio = '';

        if (TB_MUNICIPIO_TXT_NOME_MUNICIPIO.getValue())
            municipio = TB_MUNICIPIO_TXT_NOME_MUNICIPIO.getValue();

        var TB_CLIENTE_MUNICIPIO_JsonData = {
            ID_UF: ID_UF,
            NOME_MUNICIPIO: municipio,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_CLIENTE_MUNICIPIO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_MUNICIPIO_JsonData;
    }

    var wBUSCA_TB_MUNICIPIO = new Ext.Window({
        layout: 'form',
        title: 'Busca',
        iconCls: 'icone_TB_CLIENTE',
        width: 600,
        height: 'auto',
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridBUSCA_MUNICIPIO, TB_CLIENTE_MUNICIPIO_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .60,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 120,
                items: [TB_MUNICIPIO_TXT_NOME_MUNICIPIO]
            }, {
                columnWidth: .20,
                items: [TB_CLIENTE_MUNICIPIO_BTN_PESQUISA]
            }]
        }],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function TB_MUNICIPIO_CARREGA_GRID() {
        TB_CLIENTE_MUNICIPIO_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_MUNICIPIO_JsonData());
        TB_CLIENTE_MUNICIPIO_PagingToolbar.doRequest();
    }

    function PopulaFormulario_TB_CLIENTE_MUNICIPIO(record) {
        if (Origem == 'ESTADO_FATURA') {
            Ext.getCmp('CIDADE_FATURA').setValue(record.data.ID_MUNICIPIO);
            Ext.getCmp('DESCRICAO_CIDADE_FATURA').setValue(record.data.NOME_MUNICIPIO);
            Ext.getCmp('TELEFONE_FATURA').focus();
        }
        else if (Origem == 'ESTADO_ENTREGA') {
            Ext.getCmp('CIDADE_ENTREGA').setValue(record.data.ID_MUNICIPIO);
            Ext.getCmp('DESCRICAO_CIDADE_ENTREGA').setValue(record.data.NOME_MUNICIPIO);
            Ext.getCmp('TELEFONE_ENTREGA').focus();
        }
        else if (Origem == 'ESTADO_COBRANCA') {
            Ext.getCmp('CIDADE_COBRANCA').setValue(record.data.ID_MUNICIPIO);
            Ext.getCmp('DESCRICAO_CIDADE_COBRANCA').setValue(record.data.NOME_MUNICIPIO);
            Ext.getCmp('TELEFONE_COBRANCA').focus();
        }
        else if (Origem == 'ID_UF_TRANSP') {
            Ext.getCmp('ID_MUNICIPIO_TRANSP').setValue(record.data.ID_MUNICIPIO);
            Ext.getCmp('DESCRICAO_CIDADE_TRANSP').setValue(record.data.NOME_MUNICIPIO);
            Ext.getCmp('TELEFONE1_TRANSP').focus();
        }
        else if (Origem == 'ID_UF_RETIRADA_EMITENTE') {
            Ext.getCmp('COD_MUNICIPIO_RETIRADA_EMITENTE').setValue(record.data.ID_MUNICIPIO);
            Ext.getCmp('DESCRICAO_CIDADE_RETIRADA').setValue(record.data.NOME_MUNICIPIO);
            Ext.getCmp('TELEFONE_EMITENTE').focus();
        }

        wBUSCA_TB_MUNICIPIO.hide();
    }

    this.show = function (objAnm) {
        wBUSCA_TB_MUNICIPIO.show(objAnm);
        TB_MUNICIPIO_CARREGA_GRID();
    };
}