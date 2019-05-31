
function MontaPanelErros() {

    var Erros_Grouping_Store = new Ext.data.GroupingStore({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_ERRO', 'DATA_ERRO', 'LOGIN_USUARIO', 'DESCRICAO_ERRO', 'TRACE']
            )
        ,
        groupField: 'LOGIN_USUARIO',
        sortInfo: { field: 'DATA_ERRO', direction: 'DESC' }
    });

    var Erros_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            "<b>Mensagem do Erro:</b><br />{DESCRICAO_ERRO}<br /><br /><hr width='100%'><br /><b>Trace:<br /></b>{TRACE}"
        )
    });

    var Erros_GridView = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Ocorr&ecirc;ncias" : "Ocorr&ecirc;ncia"]})',
        groupByText: 'Agrupar por esta coluna',
        showGroupsText: 'Exibir de forma agrupada'
    });

    var gridErros = new Ext.grid.GridPanel({
        store: Erros_Grouping_Store,
        columns: [
        Erros_expander,
        { id: 'ID_ERRO', header: "ID", width: 50, sortable: true, dataIndex: 'ID_ERRO' },
        { id: 'DATA_ERRO', header: "Data / Hora", width: 150, sortable: true, dataIndex: 'DATA_ERRO', renderer: XMLParseDateTime },
        { id: 'ERROS_LOGIN_USUARIO', header: "Respons&aacute;vel", width: 100, sortable: true, dataIndex: 'LOGIN_USUARIO'},
        { id: 'DESCRICAO_ERRO', header: "Descri&ccedil;&atilde;o do Erro", width: 320, sortable: true, dataIndex: 'DESCRICAO_ERRO' }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(148),
        width: 'auto',
        columnLines: true,
        plugins: Erros_expander,

        viewConfig: {
            forceFit: true
        },
       
        view: Erros_GridView
    });

    // Filtros
    var TXT_ERROS_DATA_INICIAL = new Ext.form.DateField(
    {
        id: 'TXT_ERROS_DATA_INICIAL',
        name: 'TXT_ERROS_DATA_INICIAL',
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        format: 'd/m/Y',
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    ERROS_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_ERROS_DATA_FINAL = new Ext.form.DateField(
    {
        id: 'TXT_ERROS_DATA_FINAL',
        name: 'TXT_ERROS_DATA_FINAL',
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        format: 'd/m/Y',
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    ERROS_CARREGA_GRID();
                }
            }
        }
    });

    var combo_Erros_TB_USUARIOS = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Respons&aacute;vel',
        id: 'ERROS_ID_USUARIO',
        name: 'ERROS_ID_USUARIO',
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 120,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    ERROS_CARREGA_GRID();
                }
            }
        }
    });

    var ERROS_BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function() {
            ERROS_CARREGA_GRID();
        }
    });

    var formFiltrosErros = new Ext.FormPanel({
        id: 'formFiltrosErros',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        width: '100%',
        height: 65,
        layout: 'column',
        frame: true,
        items: [{
            columnWidth: .12,
            layout: 'form',
            labelAlign: 'top',
            items: [TXT_ERROS_DATA_INICIAL]
        }, {
            columnWidth: .12,
            layout: 'form',
            labelAlign: 'top',
            items: [TXT_ERROS_DATA_FINAL]
        }, {
            columnWidth: .15,
            layout: 'form',
            labelAlign: 'top',
            items: [combo_Erros_TB_USUARIOS]
        }, {
            layout: 'form',
            labelAlign: 'top',
            columnWidth: .20,
            items: [ERROS_BTN_PESQUISA]
        }]
    });


    /////////////////////

    function RetornaErrosJsonData() {
        var ErrosJsonData = {
            DataInicial: TXT_ERROS_DATA_INICIAL.getRawValue(),
            DataFinal: TXT_ERROS_DATA_FINAL.getRawValue(),
            Usuario: combo_Erros_TB_USUARIOS.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return ErrosJsonData;
    }

    var ErrosPagingToolbar = new Th2_PagingToolbar();
    ErrosPagingToolbar.setUrl('servicos/Erros.asmx/CarregaErros');
    ErrosPagingToolbar.setParamsJsonData(RetornaErrosJsonData());
    ErrosPagingToolbar.setStore(Erros_Grouping_Store);

    var panelErros = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Pesquisa / Erros do Sistema',
        items: [formFiltrosErros, gridErros, ErrosPagingToolbar.PagingToolbar()]
    });

    function ERROS_CARREGA_GRID() {
        if (!formFiltrosErros.getForm().isValid()) {
            return;
        }

        ErrosPagingToolbar.setParamsJsonData(RetornaErrosJsonData());
        ErrosPagingToolbar.doRequest();
    }

    function Erros_FiltroMensal() {
        var dt1 = new Date();

        Ext.getCmp('TXT_ERROS_DATA_INICIAL').setValue(dt1.getFirstDateOfMonth());
        Ext.getCmp('TXT_ERROS_DATA_FINAL').setValue(dt1.getLastDateOfMonth());
    }

    panelErros.on('render', function() {
        TH2_CARREGA_USUARIOS(); // classes.js
        Erros_FiltroMensal();
    });

    return panelErros;
}