function MontaTelaQuery() {

    var TXT_QUERY = new Ext.form.TextField({
        id: 'QUERY',
        name: 'QUERY',
        width: '99%',
        height: 271,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var CB_TIPO_QUERY = new Ext.form.ComboBox({
        fieldLabel: 'Tipo do Comando',
        id: 'TIPO_QUERY',
        name: 'TIPO_QUERY',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 150,
        allowBlank: false,
        msgTarget: 'side',
        value: 'Q',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['Q', 'Query'], ['P', 'Store Procedure']]
        })
    });

    var Export_PagingToolbar = new Ext.Toolbar({
        width: 'auto',
        height: 'auto',
        anchor: '100%',
        items: [{
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'Tipo do Comando:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        },
        CB_TIPO_QUERY, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        },
        {
            icon: 'imagens/icones/run_24.gif',
            tooltip: 'Executa a query e popula as primeiras 25 linhas como resultado',
            text: 'Executar Query',
            scale: 'medium',
            handler: function() {
                ExecutaQuery();
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            icon: 'imagens/icones/export_db_24.gif',
            text: 'Exportar',
            tooltip: 'Exportar para formato Excel (XLSX)',
            scale: 'medium',
            handler: function() {
                ExportaParaCSV();
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'box',
            id: 'gif_rodando',
            autoEl: {
                tag: 'img',
                src: 'scripts/resources/images/default/grid/wait.gif'
            }
        }, {
            id: 'btn_Cancelar_Query',
            text: 'Cancelar',
            tooltip: 'Cancela Processamento',
            scale: 'medium',
            handler: function() {
                _ajax.CancelaRequisicao();
                Ext.getCmp('btn_Cancelar_Query').setVisible(false);
                Ext.getCmp('gif_rodando').setVisible(false);
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'Timeout'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'numberfield',
            id: 'TXT_TIMEOUT',
            fieldLabel: 'Timeout',
            width: 30,
            allowBlank: false,
            msgTarget: 'side',
            decimalPrecision: 0,
            maxLength: 5,
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '5', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
            value: 5
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'minutos'
        }]
    });

        Export_PagingToolbar.doLayout();

        Ext.getCmp('btn_Cancelar_Query').setVisible(false);
        Ext.getCmp('gif_rodando').setVisible(false);

        /////////////////////// TreeView
        var rootTabelas = new Ext.tree.TreeNode({
            expanded: true,
            text: 'Tabelas do Sistema',
            leaf: false,
            icon: 'imagens/icones/connect_to_db_16.gif',
            id: '0'
        });

        var treeTabelas = new Ext.tree.TreePanel({
            id: 'treeTabelas',
            border: false,
            shadow: true,
            width: 'auto',
            autoScroll: true,
            useArrows: true,
            cls: 'Th2Menu',
            root: rootTabelas,
            height: 271,
            rootVisible: true,
            cls: 'ED_CSS',
            listeners: {
                click: function(n) {
                    PreencheTreeTabelas(n.attributes.id, n);
                }
            }
        });

        function PreencheTreeTabelas(id, n) {
            var pai = id ? id : "";

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/Export_CSV.asmx/Tabelas');
            _ajax.setJsonData({ TABELA: pai });

            var xNode = !n ? rootTabelas : n;

            var _sucess = function(response, options) {

                while (xNode.childNodes.length > 0) {
                    var node = xNode.childNodes[xNode.childNodes.length - 1];
                    xNode.childNodes[xNode.childNodes.length - 1].remove(node);
                }

                var result = Ext.decode(response.responseText).d;
                var i = 0;

                var _icone = n ? 'imagens/icones/column_16.gif' : 'imagens/icones/window_add_16.gif';

                while (true) {
                    if (result[i]) {
                        var novoNode = new Ext.tree.TreeNode({
                            text: result[i].NAME,
                            icon: _icone,
                            expandable: true,
                            leaf: false,
                            id: result[i].NAME
                        });

                        novoNode.on('expand', function() {
                            if (this.childNodes.length == 0) {
                                PreencheTreeTabelas(this.attributes.id, this);
                            }
                        });

                        if (novoNode.text.length > 0)
                            xNode.appendChild([novoNode]);

                        i++;
                    }
                    else {
                        break;
                    }
                }

                xNode.expand();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        PreencheTreeTabelas("", 0);

        ///////////////////////

        var formQuery = new Ext.FormPanel({
            id: 'formQuery',
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            frame: true,
            width: '100%',
            height: 325,
            items: [Export_PagingToolbar,
        {
            layout: 'column',
            items: [{
                columnWidth: 0.30,
                items: [treeTabelas]
            }, {
                columnWidth: 0.70,
                items: [TXT_QUERY]
}]
}]
        });

        var panelGrid = new Ext.Panel({
            id: 'panelGrid',
            width: '100%',
            height: 220,
            title: 'Resultado da query',
            border: true
        });

        var panelQuery = new Ext.Panel({
            width: '100%',
            height: '100%',
            border: true,
            title: 'Queries / Exporta&ccedil;&atilde;o de Dados para formato XLSX',
            items: [formQuery, panelGrid]
        });

        var _ajax = new Th2_Ajax_Async();

        function ExecutaQuery() {
            _ajax.setUrl('servicos/Export_CSV.asmx/ExecutaQuery');
            _ajax.setJsonData({ query: Ext.getCmp('QUERY').getValue(), TipoComando: Ext.getCmp('TIPO_QUERY').getValue() });
            _ajax.ExibeDivProcessamento(false);

            var _sucess = function(response, options) {
                var result = Ext.decode(response.responseText).d;

                _store = eval(result.store);
                _colunas = eval(result.colunas);

                var Store1 = new Ext.data.Store({
                    reader: new Ext.data.XmlReader({
                        record: 'Tabela'
                    }, _store)
                });

                var _grid1 = new Ext.grid.GridPanel({
                    store: Store1,
                    columns: _colunas,
                    stripeRows: true,
                    height: panelGrid.height - 26,
                    width: '100%',
                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    })
                });

                if (panelGrid.items)
                    panelGrid.remove(panelGrid.items.items[0]);

                Ext.getCmp('btn_Cancelar_Query').setVisible(false);
                Ext.getCmp('gif_rodando').setVisible(false);

                panelGrid.add(_grid1);
                panelGrid.doLayout();

                Store1.loadData(criaObjetoXML(result.dados), false);
            };

            Ext.getCmp('btn_Cancelar_Query').setVisible(true);
            Ext.getCmp('gif_rodando').setVisible(true);

            var _failure = function(response, options) {
                Ext.getCmp('btn_Cancelar_Query').setVisible(false);
                Ext.getCmp('gif_rodando').setVisible(false);
            };

            _ajax.setFalha(_failure);
            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        function ExportaParaCSV() {
            if (!Ext.getCmp('TXT_TIMEOUT').isValid())
                return;

            _ajax.setTimeOut(Ext.getCmp('TXT_TIMEOUT').getValue());

            _ajax.setUrl('servicos/Export_CSV.asmx/ExportaParaCSV');
            _ajax.setJsonData({ query: Ext.getCmp('QUERY').getValue() });
            _ajax.ExibeDivProcessamento(false);

            var _sucess = function(response, options) {
                Ext.getCmp('btn_Cancelar_Query').setVisible(false);
                Ext.getCmp('gif_rodando').setVisible(false);

                var result = Ext.decode(response.responseText).d;
                window.open(result, '_blank', 'width=1000,height=800');
            };

            Ext.getCmp('btn_Cancelar_Query').setVisible(true);
            Ext.getCmp('gif_rodando').setVisible(true);

            var _failure = function(response, options) {
                Ext.getCmp('btn_Cancelar_Query').setVisible(false);
                Ext.getCmp('gif_rodando').setVisible(false);
            };

            _ajax.setFalha(_failure);
            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        panelGrid.setHeight(AlturaDoPainelDeConteudo(formQuery.height) - 55);

        return panelQuery;
    }