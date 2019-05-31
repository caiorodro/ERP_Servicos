function MontaAuditoriaPedidoVenda() {

    var Auditoria_Grouping_Store = new Ext.data.GroupingStore({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_RASTRO', 'DATA_RASTRO', 'LOGIN_USUARIO', 'TABELA_RASTRO', 'TIPO_RASTRO', 'HISTORICO_RASTRO']
            )
        ,
        groupField: 'LOGIN_USUARIO',
        sortInfo: { field: 'DATA_RASTRO', direction: 'DESC' }
    });

    var Auditoria_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '{HISTORICO_RASTRO}'
        )
    });

    var Auditoria_GridView = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Ocorr&ecirc;ncias" : "Ocorr&ecirc;ncia"]})',
        groupByText: 'Agrupar por esta coluna',
        showGroupsText: 'Exibir de forma agrupada'
    });

    function Configura_Tabelas(val) {
        if (val == 'TB_CUSTO_ITEM_PEDIDO_VENDA')
            return "Custo de Venda (Itens de Pedido)";

        else if (val == 'TB_DADOS_FATURAMENTO')
            return "Dados de Faturamento do Pedido";

        else if (val == 'TB_FOLLOW_UP_PEDIDO')
            return "Follow UP de Pedidos de Venda";

        else if (val == 'TB_FOLLOW_UP_ITEM_PEDIDO')
            return "Follow UP de Itens de Pedidos de Venda";

        else if (val == 'TB_PEDIDO_VENDA')
            return "Pedido de Venda";

    }

    function Auditoria_Trata_Acao(val) {
        if (val == 'I')
            return 'Inclus&atilde;o';
        else if (val == 'U')
            return 'Altera&ccedil;&atilde;o';
        else if (val == 'D')
            return 'Exclus&atilde;o';
    }

    var gridAuditoria = new Ext.grid.GridPanel({
        store: Auditoria_Grouping_Store,
        columns: [
        Auditoria_expander,
        { id: 'ID_RASTRO', header: "ID", width: 50, sortable: true, dataIndex: 'ID_RASTRO' },
        { id: 'DATA_RASTRO', header: "Data / Hora", width: 150, sortable: true, dataIndex: 'DATA_RASTRO', renderer: XMLParseDateTime },
        { id: 'AUDIT_LOGIN_USUARIO', header: "Respons&aacute;vel", width: 100, sortable: true, dataIndex: 'LOGIN_USUARIO' },
        { id: 'TIPO_RASTRO', header: "Tipo da A&ccedil;&atilde;o", width: 120, sortable: true, dataIndex: 'TIPO_RASTRO', renderer: Auditoria_Trata_Acao },
        { id: 'TABELA_RASTRO', header: "Tabela", width: 200, sortable: true, dataIndex: 'TABELA_RASTRO', renderer: Configura_Tabelas }
        ],
        stripeRows: true,
        height: 405,
        width: 'auto',
        columnLines: true,
        plugins: Auditoria_expander,

        viewConfig: {
            forceFit: true
        },

        view: Auditoria_GridView
    });

    var combo_AUDITORIA_TB_USUARIOS = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Respons&aacute;vel',
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
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var combo_AUDITORIA_TABELAS_FATH2 = new Ext.form.ComboBox({
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['TB_CUSTO_ITEM_PEDIDO_VENDA', 'Custo de Venda (Itens de Pedido)'],
            ['TB_DADOS_FATURAMENTO', 'Dados de Faturamento do Pedido'],
            ['TB_FOLLOW_UP_PEDIDO', 'Follow UP de Pedidos de Venda'],
            ['TB_FOLLOW_UP_ITEM_PEDIDO', 'Follow UP de Itens de Pedidos de Venda'],
            ['TB_PEDIDO_VENDA', 'Pedido de Venda']]
        }),
        fieldLabel: 'Tabela do Sistema',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 240,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var combo_AUDITORIA_TIPO_ACAO = new Ext.form.ComboBox({
        fieldLabel: 'Tipo da A&ccedil;&atilde;o',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        width: 120,
        emptyText: 'Selecione aqui...',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'AUDIT_ID_ACAO',
            'AUDIT_ACAO'
        ],
            data: [['I', 'Inclusão'], ['U', 'Alteração'], ['D', 'Exclusão']]
        }),
        valueField: 'AUDIT_ID_ACAO',
        displayField: 'AUDIT_ACAO',
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_AUDITORIA_NUMERO_PEDIDO_VENDA = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'Pedido de Venda',
        width: 85,
        value: 0,
        minValue: 1,
        allowBlank: false,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_CAMPO = new Ext.form.TextField({
        fieldLabel: 'Campo',
        width: 260,
        name: 'TXT_CAMPO',
        id: 'TXT_CAMPO',
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var AUDITORIA_BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function() {
            AUDITORIA_CARREGA_GRID();
        }
    });

    var formFiltrosAuditoria = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        width: '100%',
        height: 120,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_AUDITORIA_NUMERO_PEDIDO_VENDA]
            }, {
                columnWidth: .17,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TB_USUARIOS]
            }, {
                columnWidth: .17,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TIPO_ACAO]
            }, {
                columnWidth: .25,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TABELAS_FATH2]
}]
            },
            {
                layout: 'column',
                items: [{
                    layout: 'form',
                    columnWidth: .30,
                    items: [TXT_CAMPO]
                }, {
                    columnWidth: .08,
                    items: [AUDITORIA_BTN_PESQUISA]
}]
}]
                });

            function RetornaAuditoriaJsonData() {
                var AuditoriaJsonData = {
                    Usuario: combo_AUDITORIA_TB_USUARIOS.getValue(),
                    Tabela: combo_AUDITORIA_TABELAS_FATH2.getValue(),
                    Acao: combo_AUDITORIA_TIPO_ACAO.getValue(),
                    NUMERO_PEDIDO: TXT_AUDITORIA_NUMERO_PEDIDO_VENDA.getValue(),
                    CAMPO: TXT_CAMPO.getValue(),
                    ID_USUARIO: _ID_USUARIO,
                    start: 0,
                    limit: Th2_LimiteDeLinhasPaginacao
                };

                return AuditoriaJsonData;
            }

            var AuditoriaPagingToolbar = new Th2_PagingToolbar();
            AuditoriaPagingToolbar.setUrl('servicos/Auditoria.asmx/CarregaAuditoria_Pedido_Venda');
            AuditoriaPagingToolbar.setParamsJsonData(RetornaAuditoriaJsonData());
            AuditoriaPagingToolbar.setStore(Auditoria_Grouping_Store);

            var panelAuditoria = new Ext.Panel({
                width: '100%',
                border: true,
                title: 'Pesquisa / Auditoria de Pedidos de Vendas',
                items: [formFiltrosAuditoria, gridAuditoria, AuditoriaPagingToolbar.PagingToolbar()]
            });

            function AUDITORIA_CARREGA_GRID() {
                if (!formFiltrosAuditoria.getForm().isValid()) {
                    return;
                }

                AuditoriaPagingToolbar.setParamsJsonData(RetornaAuditoriaJsonData());
                AuditoriaPagingToolbar.doRequest();
            }

            panelAuditoria.on('render', function() {
                TH2_CARREGA_USUARIOS();
            });

            gridAuditoria.setHeight(AlturaDoPainelDeConteudo(formFiltrosAuditoria.height) - 82);

            return panelAuditoria;
        }