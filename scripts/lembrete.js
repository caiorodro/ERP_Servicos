function MontaLembretes() {

    var TXT_ID_LEMBRETE = new Ext.form.Hidden({
        id: 'ID_LEMBRETE',
        name: 'ID_LEMBRETE'
    });

    var TXT_TEXTO_LEMBRETE = new Ext.form.HtmlEditor({
        fieldLabel: 'Anota&ccedil;&otilde;es',
        width: 100,
        name: 'TEXTO_LEMBRETE',
        id: 'TEXTO_LEMBRETE',
        anchor: '100%',
        height: 180,
        allowBlank: false,
        msgTarget: 'side'
    });

    TXT_TEXTO_LEMBRETE.on('render', function(h) {
        h.setValue('<div></div>');
        h.focus(false);
    });

    var CB_PRIORIDADE_LEMBRETE = new Ext.form.ComboBox({
        fieldLabel: 'Prioridade',
        id: 'PRIORIDADE_LEMBRETE',
        name: 'PRIORIDADE_LEMBRETE',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Prioridade',
        selectOnFocus: true,
        width: 120,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['1', 'Baixa'], ['2', 'Normal'], ['3', 'Alta']]
        })
    });

    var BTN_SALVAR_LEMBRETE = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/database_save_16.gif',
        scale: 'small',
        handler: function() {
            GravaLembrete();
        }
    });

    var BTN_DELETAR_LEMBRETE = new Ext.Button({
        id: 'BTN_DELETAR_LEMBRETE',
        text: 'Deletar',
        icon: 'imagens/icones/database_delete_16.gif',
        scale: 'small',
        disabled: true,
        handler: function() {
            if (gridLEMBRETE.getSelectionModel().getSelections().length > 0) {
                var record = gridLEMBRETE.getSelectionModel().getSelected();
                DeletaLembrete(record);
            }
            else
                dialog.MensagemDeAlerta('Selecione uma anota&ccedil;&atilde;o no grid para deletar');
        }
    });

    var formLembrete = new Ext.FormPanel({
        id: 'formLembrete',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 260,
        items: [TXT_ID_LEMBRETE, TXT_TEXTO_LEMBRETE, {
            layout: 'column',
            items: [{
                columnWidth: 0.14,
                items: [CB_PRIORIDADE_LEMBRETE]
            }, {
                columnWidth: 0.07,
                items: [BTN_SALVAR_LEMBRETE]
            }, {
                columnWidth: 0.10,
                items: [BTN_DELETAR_LEMBRETE]
}]
}]
            });

            function GravaLembrete() {
                if (!formLembrete.getForm().isValid())
                    return;

                var dados = {
                    ID_LEMBRETE: formLembrete.getForm().findField('ID_LEMBRETE').getValue(),
                    TEXTO_LEMBRETE: formLembrete.getForm().findField('TEXTO_LEMBRETE').getValue(),
                    PRIORIDADE_LEMBRETE: formLembrete.getForm().findField('PRIORIDADE_LEMBRETE').getValue()
                };

                var Url = formLembrete.getForm().findField('ID_LEMBRETE').getValue() == '' ?
                        'servicos/LEMBRETES.asmx/GravaNovoLembrete' :
                        'servicos/LEMBRETES.asmx/AtualizaLembrete';

                var _ajax = new Th2_Ajax();
                _ajax.setUrl(Url);
                _ajax.setJsonData({ dados: dados });

                var _sucess = function(response, options) {
                    Ext.getCmp('TEXTO_LEMBRETE').focus();
                    formLembrete.getForm().reset();

                    Ext.getCmp('BTN_DELETAR_LEMBRETE').disable();

                    LEMBRETE_CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            function DeletaLembrete(record) {
                dialog.MensagemDeConfirmacao('Deseja deletar estas Anota&ccedil;&otilde;es?', 'formLembrete', Deleta);

                function Deleta(btn) {
                    if (btn == 'yes') {

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/LEMBRETES.asmx/DeletaLembrete');
                        _ajax.setJsonData({ ID_LEMBRETE: record.data.ID_LEMBRETE });

                        var _sucess = function(response, options) {
                            Ext.getCmp('TEXTO_LEMBRETE').focus();
                            formLembrete.getForm().reset();

                            Ext.getCmp('BTN_DELETAR_LEMBRETE').disable();

                            LEMBRETE_CARREGA_GRID();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }

            ///////////////////

            var LEMBRETE_Store = new Ext.data.Store({
                reader: new Ext.data.XmlReader({
                    record: 'Tabela'
                },
                ['ID_LEMBRETE', 'TEXTO_LEMBRETE', 'PRIORIDADE_LEMBRETE']
                )
            });

            function Prioridade(val) {
                var retorno;

                if (val == 1)
                    retorno = "<span style='background-color: #808080; color: #FFFFFF; font-size: 10pt;'>Baixa</span>";
                else if (val == 2)
                    retorno = "<span style='background-color: #008000; color: #FFFFFF; font-size: 10pt;'>Normal</span>";
                else if (val == 3)
                    retorno = "<span style='background-color: #990000; color: #FFFFFF; font-size: 10pt;'>Alta</span>";

                return retorno;
            }

            var gridLEMBRETE = new Ext.grid.GridPanel({
                id: 'gridLEMBRETE',
                store: LEMBRETE_Store,
                columns: [
                    { id: 'ID_LEMBRETE', header: "ID", width: 60, sortable: true, dataIndex: 'ID_LEMBRETE', hidden: true },
                    { id: 'TEXTO_LEMBRETE', header: "Anota&ccedil;&otilde;es", width: 800, sortable: true, dataIndex: 'TEXTO_LEMBRETE' },
                    { id: 'PRIORIDADE_LEMBRETE', header: "Prioridade", width: 100, sortable: true, dataIndex: 'PRIORIDADE_LEMBRETE', renderer: Prioridade }
                    ],
                stripeRows: true,
                height: 270,
                width: '100%',

                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),

                viewConfig: {
                    enableRowBody: true
                }
            });

            gridLEMBRETE.on('rowdblclick', function(grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormLembrete(record);
            });

            gridLEMBRETE.on('keydown', function(e) {
                if (e.getKey() == e.ENTER) {
                    if (gridLEMBRETE.getSelectionModel().getSelections().length > 0) {
                        var record = gridLEMBRETE.getSelectionModel().getSelected();
                        PopulaFormLembrete(record);
                    }
                }
            });

            function RetornaLEMBRETE_JsonData() {
                var LEMBRETE_JsonData = {
                    start: 0,
                    limit: Th2_LimiteDeLinhasPaginacao
                };

                return LEMBRETE_JsonData;
            }

            var LEMBRETE_PagingToolbar = new Th2_PagingToolbar();
            LEMBRETE_PagingToolbar.setUrl('servicos/LEMBRETES.asmx/Carrega_Lembretes');
            LEMBRETE_PagingToolbar.setParamsJsonData(RetornaLEMBRETE_JsonData());
            LEMBRETE_PagingToolbar.setStore(LEMBRETE_Store);

            function LEMBRETE_CARREGA_GRID() {
                LEMBRETE_PagingToolbar.setParamsJsonData(RetornaLEMBRETE_JsonData());
                LEMBRETE_PagingToolbar.doRequest();
            }

            this.CARREGA_LEMBRETES = function() {
                LEMBRETE_CARREGA_GRID();
            };

            function PopulaFormLembrete(record) {
                formLembrete.getForm().loadRecord(record);

                Ext.getCmp('BTN_DELETAR_LEMBRETE').enable();
                Ext.getCmp('TEXTO_LEMBRETE').focus();
            }
            ////////////////////

            var panelLEMBRETE = new Ext.Panel({
                width: '100%',
                border: true,
                title: 'Lembretes',
                items: [formLembrete, gridLEMBRETE, LEMBRETE_PagingToolbar.PagingToolbar()]
            });

            this.AjustaAlturaGrid = function() {
                gridLEMBRETE.setHeight(AlturaDoPainelDeConteudo(formLembrete.height) - 82);
            };

            this.panelLEMBRETE = function() {
                return panelLEMBRETE;
            };
        }