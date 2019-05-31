function Solicitacao_Estoque() {

    var _NUMERO_PEDIDO_VENDA;

    this.NUMERO_PEDIDO_VENDA = function (pNUMERO_PEDIDO_VENDA) {
        _NUMERO_PEDIDO_VENDA = pNUMERO_PEDIDO_VENDA;
    };

    var jfu = new JANELA_FOLLOW_UP_PEDIDO();

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM',
            'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'NOMEFANTASIA_CLIENTE'])
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

    TB_STATUS_PEDIDO_CARREGA_COMBO();

    var _record_posicao;

    ////////////////

    var grid_PEDIDO_VENDA = new Ext.grid.EditorGridPanel({
        store: PEDIDO_VENDA_Store,
        title: 'Itens do Pedido de Venda',
        tbar: [{
            id: 'BTN_ESTOQUE_FOLLOW_UP',
            text: 'Follow UP',
            icon: 'imagens/icones/book_fav_16.gif',
            scale: 'small',
            handler: function () {

                if (grid_PEDIDO_VENDA.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para consultar / registrar o Follow Up', 'BTN_ESTOQUE_FOLLOW_UP');
                    return;
                }

                jfu.NUMERO_PEDIDO(grid_PEDIDO_VENDA.getSelectionModel().selections.items[0].data.NUMERO_PEDIDO);

                var items = new Array();

                for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                    items[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                }

                jfu.ITENS_PEDIDO(items);
                jfu.show('BTN_ESTOQUE_FOLLOW_UP');
            }
        },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'label',
                text: 'Posição do Pedido'
            },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'CB_POSICAO_PEDIDO',
                xtype: 'combo',
                store: combo_TB_STATUS_PEDIDO,
                valueField: 'CODIGO_STATUS_PEDIDO',
                displayField: 'DESCRICAO_STATUS_PEDIDO',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                emptyText: 'Selecione aqui...',
                selectOnFocus: true,
                allowBlank: false,
                listeners: {
                    select: function (combo, record, index) {
                        _record_posicao = record;
                    }
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
             {
                 icon: 'imagens/icones/database_save_16.gif',
                 text: 'Gravar nova posi&ccedil;&atilde;o no(s) item(s) selecionado(s)',
                 handler: function () {
                     if (!Ext.getCmp('CB_POSICAO_PEDIDO').isValid()) {
                         return;
                     }

                     var arr1 = new Array();

                     for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                         arr1[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
                     }

                     if (arr1.length > 0) {
                         var _ajax = new Th2_Ajax();
                         _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Atualiza_Posicao_Pedido');
                         _ajax.setJsonData({
                             NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
                             NUMERO_ITEM_VENDA: arr1,
                             STATUS: _record_posicao.data.CODIGO_STATUS_PEDIDO,
                             ID_USUARIO: _ID_USUARIO
                         });

                         var _sucess = function (response, options) {
                             for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
                                 var _record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

                                 _record.beginEdit();

                                 _record.set('STATUS_ITEM_PEDIDO', _record_posicao.data.CODIGO_STATUS_PEDIDO);
                                 _record.set('DESCRICAO_STATUS_PEDIDO', _record_posicao.data.DESCRICAO_STATUS_PEDIDO);
                                 _record.set('COR_STATUS', _record_posicao.data.COR_STATUS);
                                 _record.set('COR_FONTE_STATUS', _record_posicao.data.COR_FONTE_STATUS);
                                 _record.endEdit();
                                 _record.commit();
                             }
                         };

                         _ajax.setSucesso(_sucess);
                         _ajax.Request();
                     }
                 }
             }],
        columns: [
        checkBoxSM_,
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 220, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido }
        ],
        stripeRows: true,
        height: 168,
        width: '100%',

        sm: checkBoxSM_,
        clicksToEdit: 1
    });

    function Lista_Pedido_Venda() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Lista_Pedido_Venda');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            PEDIDO_VENDA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    /////////////////////// Posição de Estoque

    var POSICAO_ESTOQUE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'DESCRICAO_LOCAL', 'SALDO', 'QTDE_A_SOLICITAR', 'CUSTO_PRODUTO',
            'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'NUMERO_ESTOQUE', 'NUMERO_LOTE', 'OBS_FORNECEDOR', 'FORNECEDOR', 'NUMERO_PECAS_CAIXA_PEQUENA',
            'NUMERO_PECAS_CAIXA_GRANDE', 'ID_LOCAL'
            ])
    });

    var TXT_QTDE_A_SOLICITAR = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0.00
    });

    var CB_ID_LOCAL = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE,
        valueField: 'ID_LOCAL',
        displayField: 'DESCRICAO_LOCAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true
    });

    CARREGA_COMBO_LOCAL();

    var grid_POSICAO_ESTOQUE = new Ext.grid.EditorGridPanel({
        store: POSICAO_ESTOQUE_Store,
        title: 'Posi&ccedil;&atilde;o de Estoque',
        tbar: [{
            text: 'Consultar Estoque<br />dos itens do pedido',
            icon: 'imagens/icones/data_transport_16.gif',
            scale: 'large',
            handler: function () {
                Consulta_Posicao_Estoque();
            }
        }, '-', {
            id: 'BTN_SOLICITAR_MATERIAL',
            text: 'Solicitar Material<br />do Estoque',
            icon: 'imagens/icones/data_transport_config_16.gif',
            scale: 'large',
            handler: function () {
                GravaSolicitacoes();
            }
        }, '-', {
            text: 'Recarregar estoque<br />para o pedido',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'large',
            handler: function () {
                Consulta_Posicao_Estoque();
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, '-', {
            xtype: 'label',
            text: 'Consultar outro produto:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'textfield',
            id: 'TXT_PESQUISA_OUTRO_PRODUTO',
            width: 200,
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER && f.getValue().length > 0) {
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Consulta_Estoque_Outro_Produto');
                        _ajax.setJsonData({
                            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
                            CODIGO_PRODUTO: f.getValue(),
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            var result = Ext.decode(response.responseText).d;
                            POSICAO_ESTOQUE_Store.loadData(criaObjetoXML(result), false);
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }
        }],
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'DESCRICAO_LOCAL', header: "Localiza&ccedil;&atilde;o do Produto", width: 150, sortable: true, dataIndex: 'DESCRICAO_LOCAL',
                editor: CB_ID_LOCAL
            },
            { id: 'SALDO', header: "Estoque Dispon&iacute;vel", width: 110, sortable: true, dataIndex: 'SALDO', align: 'center', renderer: FormataQtde },
            { id: 'QTDE_A_SOLICITAR', header: "Qtde a Solicitar", width: 90, sortable: true, dataIndex: 'QTDE_A_SOLICITAR', align: 'center', renderer: FormataQtde,
                editor: TXT_QTDE_A_SOLICITAR
            },
            { id: 'NUMERO_PECAS_CAIXA_PEQUENA', header: "Embalagem (pequena)", width: 120, sortable: true, dataIndex: 'NUMERO_PECAS_CAIXA_PEQUENA', renderer: FormataQtde, align: 'center' },
            { id: 'NUMERO_PECAS_CAIXA_GRANDE', header: "Embalagem (grande)", width: 120, sortable: true, dataIndex: 'NUMERO_PECAS_CAIXA_GRANDE', renderer: FormataQtde, align: 'center' },
            { id: 'NUMERO_LOTE', header: "Nr. Lote", width: 180, sortable: true, dataIndex: 'NUMERO_LOTE' },
            { id: 'FORNECEDOR', header: "Fornecedor", width: 130, sortable: true, dataIndex: 'FORNECEDOR' },
            { id: 'OBS_FORNECEDOR', header: "Obs. / Fornecedor", width: 180, sortable: true, dataIndex: 'OBS_FORNECEDOR' }
        ],
        stripeRows: true,
        height: 226,
        width: '100%',
        clicksToEdit: 1,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            beforeEdit: function (e) {
                if (e.record.data.ID_LOCAL != 813 && e.field == 'DESCRICAO_LOCAL') { // 5 ANDAR
                    e.cancel = true;
                }
            },
            afterEdit: function (e) {
                if (e.field == 'DESCRICAO_LOCAL') {
                    if (e.value > 0) {

                        e.record.beginEdit();
                        e.record.set('ID_LOCAL', e.value);

                        var _record = combo_TB_LOCAL_STORE.getAt(combo_TB_LOCAL_STORE.find('ID_LOCAL', e.value));
                        e.record.set('DESCRICAO_LOCAL', _record.data.DESCRICAO_LOCAL);
                        e.record.endEdit();

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Atualiza_Local');
                        _ajax.setJsonData({
                            NUMERO_ESTOQUE: e.record.data.NUMERO_ESTOQUE,
                            ID_LOCAL: e.value,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {

                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }
        }
    });

    function Consulta_Posicao_Estoque() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Consulta_Estoque_para_o_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            POSICAO_ESTOQUE_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////// Solicitações do Pedido

    var SOLICITACOES_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['DATA_HORA_SOLICITACAO', 'NUMERO_SOLICITACAO', 'ID_PRODUTO_SOLICITACAO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO',
                'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'CUSTO_ESTOQUE', 'QTDE_SOLICITACAO', 'ID_USUARIO', 'LOGIN_USUARIO',
                'NUMERO_LOTE', 'FORNECEDOR', 'OBS_FORNECEDOR'])
    });

    function Estoque_Fornecedor(val, metadata, record) {
        //if (val.trim().length == 0)
        //    return record.data.OBS_FORNECEDOR;

        return val;
    }

    var cbs = new Ext.grid.CheckboxSelectionModel();

    var grid_SOLICITACAO_ESTOQUE = new Ext.grid.GridPanel({
        store: SOLICITACOES_Store,
        title: 'Itens Solicitados',
        columns: [
            cbs,
            { id: 'NUMERO_SOLICITACAO', header: "Nr.", width: 60, sortable: true, dataIndex: 'NUMERO_SOLICITACAO', align: 'center' },
            { id: 'DATA_HORA_SOLICITACAO', header: "Data / Hora", width: 120, sortable: true, dataIndex: 'DATA_HORA_SOLICITACAO', renderer: XMLParseDateTime },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 300, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'QTDE_SOLICITACAO', header: "Qtde. ", width: 80, sortable: true, dataIndex: 'QTDE_SOLICITACAO', align: 'center', renderer: FormataQtde },
            { id: 'NUMERO_LOTE', header: "N&ordm; Lote", width: 160, sortable: true, dataIndex: 'NUMERO_LOTE' },
            { id: 'FORNECEDOR', header: "Fornecedor", width: 160, sortable: true, dataIndex: 'FORNECEDOR', renderer: Estoque_Fornecedor },
            { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' }
        ],
        stripeRows: true,
        height: 195,
        width: '100%',

        sm: cbs,

        tbar: [{
            xtype: 'label',
            text: 'Nr. Solicitação:'
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            id: 'TXT_NUMERO_SOL1',
            xtype: 'spinnerfield',
            width: 100,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        buscaSolicitacaoInterna();
                    }
                }
            }
        }, '-', {
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function (btn) {
                buscaSolicitacaoInterna();
            }
        }, '-', {
            id: 'BTN_DELETAR_SOLICITACAO_ESTOQUE',
            xtype: 'button',
            text: 'Deletar Solicitação',
            icon: 'imagens/icones/data_transport_delete_16.gif',
            scale: 'small',
            disabled: _GERENTE_COMPRAS == 1 ? false : true,
            handler: function (btn) {

                if (grid_SOLICITACAO_ESTOQUE.getSelectionModel().selections.length == 0) {
                    dialog.MensagemDeErro('Selecione uma solicita&ccedil;&atilde;o abaixo para deletar', btn.getId());
                    return;
                }

                var record = grid_SOLICITACAO_ESTOQUE.getSelectionModel().selections.items[0];

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/DeletaSolicitacao');
                _ajax.setJsonData({
                    NUMERO_SOLICITACAO: record.data.NUMERO_SOLICITACAO,
                    NUMERO_LOTE: record.data.NUMERO_LOTE,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    Solicitacoes_Pedido();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            text: 'Imprimir solicita&ccedil;&atilde;o',
            icon: 'imagens/icones/printer_16.gif',
            scale: 'small',
            handler: function (btn) {
                Imprime_Solicitacao(btn);
            }
        }]
    });

    function buscaSolicitacaoInterna(NUMEROS) {
        var arr1 = new Array();

        if (!NUMEROS) {
            arr1[0] = Ext.getCmp('TXT_NUMERO_SOL1').getValue() == '' ? 0 : Ext.getCmp('TXT_NUMERO_SOL1').getValue();
        }
        else {
            arr1 = NUMEROS;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Carrega_Solicitacoes2');
        _ajax.setJsonData({
            NUMEROS_SOLICITACOES: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            SOLICITACOES_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Imprime_Solicitacao(btn) {
        if (grid_SOLICITACAO_ESTOQUE.getSelectionModel().selections.length == 0) {
            dialog.MensagemDeErro('Selecione uma ou mais solicita&ccedil;&otilde;es para imprimir', btn.getId());
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < grid_SOLICITACAO_ESTOQUE.getSelectionModel().selections.length; i++) {
            arr1[i] = grid_SOLICITACAO_ESTOQUE.getSelectionModel().selections.items[i].data.NUMERO_SOLICITACAO;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Imprime_Solicitacao');
        _ajax.setJsonData({
            NUMEROS_SOLICITACAO: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Solicitacoes_Pedido() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Carrega_Solicitacoes_do_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            SOLICITACOES_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////////

    var panel1 = new Ext.Panel({
        autoHeight: true,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        items: [grid_PEDIDO_VENDA, grid_POSICAO_ESTOQUE, grid_SOLICITACAO_ESTOQUE]
    });

    var wSOLICITACAO = new Ext.Window({
        layout: 'form',
        title: 'Solicita&ccedil;&atilde;o de Estoque',
        iconCls: 'icone_TB_PRE_ROTEIRO',
        width: 1100,
        height: 623,
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [panel1],

        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    wSOLICITACAO.on('render', function () {
        panel1.doLayout();
    });

    /////////////////

    function GravaSolicitacoes() {

        if (_NUMERO_PEDIDO_VENDA > 0) {
            var Arr1 = new Array();

            for (var i = 0; i < POSICAO_ESTOQUE_Store.getCount(); i++) {
                var record = POSICAO_ESTOQUE_Store.getAt(i);

                if (record.dirty && record.data.QTDE_A_SOLICITAR > 0.00) {
                    
                    if (record.data.QTDE_A_SOLICITAR > record.data.SALDO) {
                        dialog.MensagemDeErro("A qtde solicitada &eacute; maior do que o saldo em estoque", "BTN_SOLICITAR_MATERIAL");
                        return;
                    }

                    if (record.data.NUMERO_ITEM_VENDA == 0) {
                        if (grid_PEDIDO_VENDA.getSelectionModel().selections.length == 0) {
                            dialog.MensagemDeErro("Selecione um item de pedido acima para solicitar o produto desejado", "BTN_SOLICITAR_MATERIAL");
                            return;
                        }

                        record.beginEdit();
                        record.set("NUMERO_ITEM_VENDA", grid_PEDIDO_VENDA.getSelectionModel().selections.items[0].data.NUMERO_ITEM);
                        record.endEdit();
                    }
                    Arr1[i] = record.data;
                }
            }

            if (Arr1.length > 0) {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/GravaNovaSolicitacao');
                _ajax.setJsonData({
                    lista: Arr1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < POSICAO_ESTOQUE_Store.getCount(); i++) {
                        var record = POSICAO_ESTOQUE_Store.getAt(i);

                        if (record.dirty && record.data.QTDE_A_SOLICITAR > 0.00) {
                            record.beginEdit();
                            record.set('SALDO', record.data.SALDO - record.data.QTDE_A_SOLICITAR);
                            record.set('QTDE_A_SOLICITAR', 0);
                            record.endEdit();
                            record.commit();
                        }
                    }

                    Solicitacoes_Pedido();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
        else {
            var Arr1 = new Array();
            var Arr2 = new Array();
            var Arr3 = new Array();
            var Arr4 = new Array();

            for (var i = 0; i < POSICAO_ESTOQUE_Store.getCount(); i++) {
                var record = POSICAO_ESTOQUE_Store.getAt(i);

                if (record.dirty && record.data.QTDE_A_SOLICITAR > 0.00) {
                    Arr1[i] = record.data.QTDE_A_SOLICITAR;
                    Arr2[i] = record.data.ID_PRODUTO;
                    Arr3[i] = record.data.NUMERO_ESTOQUE;
                    Arr4[i] = record.data.CUSTO_PRODUTO;
                }
            }

            if (Arr1.length > 0) {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/GravaNovaSolicitacaoInterna');
                _ajax.setJsonData({
                    QTDE_SOLICITACAO: Arr1,
                    ID_PRODUTO: Arr2,
                    NUMERO_ESTOQUE: Arr3,
                    CUSTO_PRODUTO: Arr4,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < POSICAO_ESTOQUE_Store.getCount(); i++) {
                        var record = POSICAO_ESTOQUE_Store.getAt(i);

                        if (record.dirty && record.data.QTDE_A_SOLICITAR > 0.00) {
                            record.beginEdit();
                            record.set('SALDO', record.data.SALDO - record.data.QTDE_A_SOLICITAR);
                            record.set('QTDE_A_SOLICITAR', 0);
                            record.endEdit();
                            record.commit();
                        }
                    }
                    var result = Ext.decode(response.responseText).d;

                    buscaSolicitacaoInterna(result);
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function AlteraSolicitacoes() {
        var Arr1 = new Array();

        for (var i = 0; i < SOLICITACOES_Store.getCount(); i++) {
            var record = SOLICITACOES_Store.getAt(i);

            if (record.dirty && record.data.QTDE_SOLICITACAO > 0.00) {
                Arr1[i] = record.data;
            }
        }

        if (Arr1.length > 0) {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/GravaNovaSolicitacao');
            _ajax.setJsonData({
                lista: Arr1,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                for (var i = 0; i < SOLICITACOES_Store.getCount(); i++) {
                    var record = SOLICITACOES_Store.getAt(i);

                    if (record.dirty) {
                        record.commit();
                    }
                }
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }

    this.show = function (objAnm) {
        wSOLICITACAO.show(objAnm);

        Lista_Pedido_Venda();
        Consulta_Posicao_Estoque();
        Solicitacoes_Pedido();
    };
}

function Consulta_Solicitacoes_de_Estoque() {

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto',
        width: 180,
        maxLegth: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '25' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue().trim().length == 0) {
                        fsPesquisaProduto.expand();
                        TB_PRODUTO_TXT_PESQUISA.focus();
                    }
                    else {
                        carregaGrid();
                    }
                }
            }
        }
    });

    var dt1 = new Date();
    dt1 = dt1.add(Date.DAY, -5);

    var TXT_DATA1 = new Ext.form.DateField({
        fieldLabel: 'Data',
        value: dt1,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    carregaGrid();
                }
            }
        }
    });

    var BTN_CONFIRMAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {
            carregaGrid();
        }
    });

    var TB_PRODUTO_STORE = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PRODUTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO']
           )
    });

    var gridProduto = new Ext.grid.GridPanel({
        store: TB_PRODUTO_STORE,
        columns: [
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],

        stripeRows: true,
        height: 120,
        width: 530,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (this.getSelectionModel().getSelections().length > 0) {
                        var record = this.getSelectionModel().getSelected();
                        PopulaCamposProduto(record);
                    }
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaCamposProduto(record);
            }
        }
    });

    function PopulaCamposProduto(record) {
        TXT_CODIGO_PRODUTO.setValue(record.data.CODIGO_PRODUTO);

        fsPesquisaProduto.collapse();
    }

    var TB_PRODUTO_TXT_PESQUISA = new Ext.form.TextField({
        labelWidth: 120,
        fieldLabel: 'Código do Produto',
        labelAlign: 'left',
        layout: 'form',
        width: 180,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Busca_PRODUTO();
                }
            }
        }
    });

    var TB_PRODUTO_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Busca_PRODUTO();
        }
    });

    var PRODUTO_PagingToolbar = new Th2_PagingToolbar();

    PRODUTO_PagingToolbar.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Lista_TB_PRODUTO');
    PRODUTO_PagingToolbar.setStore(TB_PRODUTO_STORE);

    function RetornaFiltros_PRODUTO_JsonData() {
        var TB_PRODUTO_JsonData = {
            Pesquisa: TB_PRODUTO_TXT_PESQUISA.getValue(),
            start: 0,
            limit: PRODUTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_PRODUTO_JsonData;
    }

    function Carrega_Busca_PRODUTO() {
        PRODUTO_PagingToolbar.setParamsJsonData(RetornaFiltros_PRODUTO_JsonData());
        PRODUTO_PagingToolbar.doRequest();
    }

    var fsPesquisaProduto = new Ext.form.FieldSet({
        checkboxToggle: false,
        collapsible: true,
        collapsed: true,
        title: 'Pesquisa de Produto',
        autoHeight: true,
        bodyStyle: 'padding:2px 2px 2px',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .22,
                xtype: 'label',
                style: 'font-family: tahoma; font-size: 10pt;',
                text: 'Código do Produto:'
            }, {
                columnWidth: .30,
                items: [TB_PRODUTO_TXT_PESQUISA]
            }, {
                columnWidth: .14,
                layout: 'form',
                items: [TB_PRODUTO_BTN_PESQUISA]
            }]
        }, gridProduto, PRODUTO_PagingToolbar.PagingToolbar()],
        listeners: {
            expand: function (f) {
                TB_PRODUTO_TXT_PESQUISA.focus();
            }
        }
    });

    var SOLICITACOES_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['DATA_HORA_SOLICITACAO', 'NUMERO_SOLICITACAO', 'ID_PRODUTO_SOLICITACAO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO',
                'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'CUSTO_ESTOQUE', 'QTDE_SOLICITACAO', 'ID_USUARIO', 'LOGIN_USUARIO',
                'NUMERO_LOTE', 'FORNECEDOR', 'OBS_FORNECEDOR', 'CLIENTE', 'LOCAL', 'UNIDADE'])
    });

    var grid_SOLICITACAO_ESTOQUE = new Ext.grid.GridPanel({
        store: SOLICITACOES_Store,
        title: 'Solicita&ccedil;&otilde;es de estoque',
        columns: [
            { id: 'DATA_HORA_SOLICITACAO', header: "Data / Hora", width: 120, sortable: true, dataIndex: 'DATA_HORA_SOLICITACAO', renderer: XMLParseDateTime },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 250, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' },
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'CLIENTE' },
            { id: 'QTDE_SOLICITACAO', header: "Qtde. ", width: 80, sortable: true, dataIndex: 'QTDE_SOLICITACAO', align: 'center', renderer: FormataQtde },
            { id: 'UNIDADE', header: "Un.", width: 35, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
            { id: 'LOCAL', header: "Local", width: 120, sortable: true, dataIndex: 'LOCAL' },
            { id: 'NUMERO_LOTE', header: "N&ordm; Lote", width: 160, sortable: true, dataIndex: 'NUMERO_LOTE', hidden: true },
            { id: 'LOGIN_USUARIO', header: "Usu&aacute;rio solicitante", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(162),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var PagingToolbar1 = new Th2_PagingToolbar();

    PagingToolbar1.setUrl('servicos/TB_SOLICITACAO_ESTOQUE.asmx/Carrega_Solicitacoes_de_um_Produto');
    PagingToolbar1.setStore(SOLICITACOES_Store);

    function RetornaFiltros_JsonData() {
        var TB_PRODUTO_JsonData = {
            CODIGO_PRODUTO: TXT_CODIGO_PRODUTO.getValue(),
            DT: TXT_DATA1.getRawValue(),
            start: 0,
            limit: PagingToolbar1.getLinhasPorPagina(),
            ID_USUARIO: _ID_USUARIO
        };

        return TB_PRODUTO_JsonData;
    }

    function carregaGrid() {
        PagingToolbar1.setParamsJsonData(RetornaFiltros_JsonData());
        PagingToolbar1.doRequest();
    }

    var panel1 = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        frame: true,
        title: 'Consulta de solicita&ccedil;&otilde;es de estoque',
        items: [{
            layout: 'column',
            labelAlign: 'top',
            items: [{
                labelWidth: 115,
                columnWidth: .25,
                layout: 'form',
                items: [TXT_CODIGO_PRODUTO]
            }, {
                layout: 'form',
                columnWidth: .15,
                labelWidth: 36,
                items: [TXT_DATA1]
            }, {
                columnWidth: .08,
                items: [BTN_CONFIRMAR]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .48,
                items: [fsPesquisaProduto]
            }]
        },
            grid_SOLICITACAO_ESTOQUE, PagingToolbar1.PagingToolbar()]
    });

    return panel1;
}