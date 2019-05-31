function Etiqueta_Separacao() {

    var dados_fatura = new Dados_Faturamento_Pedido();
    var _janelaEtiquetaPequena = new janelaEtiquetaPequena();
    var _janelaEtiquetaSedex = new janelaEtiquetaSedex();

    var posicao1 = new Nova_Posicao_Pedido();

    var TXT_NUMERO_PEDIDO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Numero do Pedido',
        minValue: 1,
        width: 100,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.getValue() > 0) {
                        Carrega_ITENS_PEDIDO();
                    }
                }
            }
        }
    });

    var CB_GALPAO = new Ext.form.ComboBox({
        fieldLabel: 'Andar',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 120,
        allowBlank: false,
        value: readCookie("andar") ? readCookie("andar") : 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[1, '1º andar'], [4, '4º andar'], [5, '5º andar'], [6, '6º andar']]
        }),
        listeners: {
            select: function (combo, record, index) {
                eraseCookie("andar");
                createCookie("andar", record.data.Opc, 180);
            }
        }
    });

    var BTN_BUSCAR = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_ITENS_PEDIDO();
        }
    });

    var CB_SEPARADOR = new Ext.form.ComboBox({
        store: SEPARADOR_STORE,
        valueField: 'ID_SEPARADOR',
        displayField: 'NOME_SEPARADOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true
    });

    var CB_SEPARADOR1 = new Ext.form.ComboBox({
        store: SEPARADOR_STORE,
        valueField: 'ID_SEPARADOR',
        displayField: 'NOME_SEPARADOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true
    });

    CARREGA_COMBO_SEPARADOR();

    var PEDIDO_VENDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_STATUS', 'COR_FONTE_STATUS', 'NUMERO_ITEM', 'ENTREGA_PEDIDO',
            'CODIGO_PRODUTO_PEDIDO', 'QTDE_PRODUTO_ITEM_PEDIDO', 'DATA_PEDIDO', 'UNIDADE_ITEM_PEDIDO', 'NUMERO_LOTE_ITEM_PEDIDO',
            'NOMEFANTASIA_CLIENTE', 'OBS_ITEM_PEDIDO', 'NOME_VENDEDOR', 'STATUS_ESPECIFICO', 'QTDE_A_FATURAR', 'DESCRICAO_PRODUTO',
            'VOLUMES', 'ID_SEPARADOR'])
    });

    var TXT_VOLUMES = new Ext.form.NumberField({
        minValue: 1,
        decimalPrecision: 0
    });

    function Grava_Sugestao_Etiquetas(btn) {
        if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um item de pedido para gravar a sugest&atilde;o das etiquetas', btn.getId());
            return;
        }

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i];

            if (record.data.ID_SEPARADOR == '') {
                dialog.MensagemDeErro('Selecione um separador nos itens selecionados antes de gravar as etiquetas', btn.getId());
                return;
            }
        }

        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            arr1[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
            arr2[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.VOLUMES;
            arr3[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.ID_SEPARADOR;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Grava_Sugestao_Etiquetas');
        _ajax.setJsonData({
            NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
            NUMERO_ITEM_VENDA: arr1,
            NUMERO_DE_VOLUMES: arr2,
            ID_SEPARADOR: arr3,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            ETIQUETA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var checkBox1 = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Lista_Etiquetas_do_Pedido(record);
            },
            rowdeselect: function (s, Index, record) {
                Lista_Etiquetas_do_Pedido(record);
            }
        }
    });

    var grid_PEDIDO_VENDA = new Ext.grid.EditorGridPanel({
        store: PEDIDO_VENDA_Store,
        tbar: [{
            text: 'Gravar Etiquetas',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'small',
            handler: function (btn) {
                Grava_Sugestao_Etiquetas(btn);
            }
        }, '-', {
            id: 'BTN_DADOS_FATURA_ETIQUETA',
            text: 'Dados de Faturamento',
            icon: 'imagens/icones/date_field_fav_16.gif',
            scale: 'small',
            handler: function () {
                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para consultar / alterar os dados de faturamento');
                    return;
                }

                var record = grid_PEDIDO_VENDA.getSelectionModel().getSelected();

                dados_fatura.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);
                dados_fatura.show('BTN_DADOS_FATURA_ETIQUETA');
            }
        }, '-', {
            text: 'Imprimir pedido',
            icon: 'imagens/icones/printer_16.gif',
            scale: 'small',
            handler: function (btn) {

                if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione um item de pedido para consultar / alterar os dados de faturamento');
                    return;
                }

                var record = grid_PEDIDO_VENDA.getSelectionModel().getSelected();

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Imprime_Pedido_Separacao');
                _ajax.setJsonData({
                    NUMERO_PEDIDO: record.data.NUMERO_PEDIDO,
                    LOGIN_USUARIO: _LOGIN_USUARIO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    window.open(result, '_blank', 'width=1000,height=800');

                    Carrega_ITENS_PEDIDO();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            text: 'Liberar p/ Faturar',
            icon: 'imagens/icones/mssql_ok_16.gif',
            scale: 'small',
            handler: function (btn) {
                GravaNovaPosicao(btn.getId(), false, true);
            }
        }],
        clicksToEdit: 1,
        columns: [
            checkBox1,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido, locked: true },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center' },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: XMLParseDate, align: 'center' },

            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },

            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde", width: 80, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 105, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde },

            { id: 'VOLUMES', header: "Volumes", width: 105, sortable: true, dataIndex: 'VOLUMES', align: 'center', editor: TXT_VOLUMES },

            { id: 'ID_SEPARADOR', header: "Separador", width: 130, sortable: true, dataIndex: 'ID_SEPARADOR', editor: CB_SEPARADOR, renderer: Nome_Separador },

            { id: 'NUMERO_LOTE_ITEM_PEDIDO', header: "Lote", width: 155, sortable: true, dataIndex: 'NUMERO_LOTE_ITEM_PEDIDO' },

            { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 130, sortable: true, dataIndex: 'NOME_VENDEDOR' },

            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 410, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],
        stripeRows: true,
        height: 257,
        width: '100%',

        sm: checkBox1,

        listeners: {
            afterEdit: function (e) {
                e.record.commit();

                if (e.field == "ID_SEPARADOR") {
                    for (var i = 0; i < PEDIDO_VENDA_Store.getCount(); i++) {
                        var record = PEDIDO_VENDA_Store.getAt(i);

                        if (record.data.ID_SEPARADOR == '' || record.data.ID_SEPARADOR == 0) {
                            record.beginEdit();
                            record.set('ID_SEPARADOR', e.record.data.ID_SEPARADOR);
                            record.endEdit();
                        }
                    }
                }
            }
        }
    });

    function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
        if (grid_PEDIDO_VENDA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens de pedido para gravar a posi&ccedil;&atilde;o');
            return;
        }

        if (!CANCELAR && !LIBERAR_FATURAR) {
            if (Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getValue() < 1) {
                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                return;
            }
        }

        var record = grid_PEDIDO_VENDA.getSelectionModel().selections.items[0];

        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {

            if (!CANCELAR && !LIBERAR_FATURAR) {
                if (Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getValue() ==
                                grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                    dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                    return;
                }
            }

            if (grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                return;
            }
        }

        posicao1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            items[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        posicao1.ITENS_PEDIDO(items);
        posicao1.REGISTROS(grid_PEDIDO_VENDA.getSelectionModel().selections.items);
        posicao1.CANCELAR(CANCELAR);
        posicao1.LIBERAR_FATURAR(LIBERAR_FATURAR);

        posicao1.storeGrid(grid_PEDIDO_VENDA.getStore());

        var _index = Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getStore().find('CODIGO_STATUS_PEDIDO', Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getValue());

        if (LIBERAR_FATURAR || CANCELAR) {
            posicao1.SENHA(0);
        }
        else {
            posicao1.SENHA(_index > -1 ?
                            Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getStore().getAt(_index).data.SENHA :
                            0);
        }

        posicao1.COMBO_STATUS('CB_STATUS_PEDIDO_EXPEDICAO');

        posicao1.show(elm);
    }

    function Lista_Etiquetas_do_Pedido(record) {

        var arr1 = new Array();

        for (var i = 0; i < grid_PEDIDO_VENDA.getSelectionModel().selections.length; i++) {
            arr1[i] = grid_PEDIDO_VENDA.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        if (arr1.length > 0) {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Lista_Etiquetas_do_Pedido');
            _ajax.setJsonData({
                NUMERO_ITEM_VENDA: arr1,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;
                ETIQUETA_Store.loadData(criaObjetoXML(result), false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
        else {
            ETIQUETA_Store.removeAll();
        }
    }

    function Carrega_ITENS_PEDIDO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Carrega_Itens_Pedido_Etiqueta');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            PEDIDO_VENDA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////


    var ETIQUETA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ETIQUETA', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'QTDE_ETIQUETA', 'PESO_ETIQUETA', 'VOLUMES_ETIQUETA',
            'NUMERO_LOTE_ETIQUETA', 'UNIDADE_ITEM_PEDIDO', 'NOME_VENDEDOR', 'CODIGO_CLIENTE_ITEM_PEDIDO', 'ID_PRODUTO_ETIQUETA',
            'DESCRICAO_PRODUTO_ETIQUETA', 'ID_SEPARADOR', 'CODIGO_PRODUTO_ETIQUETA', 'ID_LOCAL_MATERIAL_SEPARADO', 'LOCAL'])
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel();

    var TXT_QTDE = new Ext.form.NumberField({
        minValue: 0.01,
        decimalPrecision: 2,
        decimalSeparator: ','
    });

    var TXT_PESO = new Ext.form.NumberField({
        minValue: 0.001,
        decimalPrecision: 3,
        decimalSeparator: ','
    });

    var TXT_LOTE = new Ext.form.TextField({
        maxLength: 25
    });

    var TXT_DESCRICAO_PRODUTO = new Ext.form.TextField({
        maxLength: 55
    });

    var TXT_CODIGO_PRODUTO = new Ext.form.TextField({
        maxLength: 25
    });

    function Deleta_Etiqueta() {
        if (grid_ETIQUETA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione uma ou mais etiquetas para deletar', 'BTN_DELETAR_ETIQUETA');
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < grid_ETIQUETA.getSelectionModel().getSelections().length; i++) {
            var record = grid_ETIQUETA.getSelectionModel().selections.items[i];

            arr1[i] = record.data.NUMERO_ETIQUETA;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Deleta_Etiqueta');
        _ajax.setJsonData({
            NUMEROS_ETIQUETA: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var arrRecords = new Array();

            for (i = 0; i < grid_ETIQUETA.getSelectionModel().getSelections().length; i++) {
                var record = grid_ETIQUETA.getSelectionModel().selections.items[i];
                arrRecords[i] = record;
            }

            for (i = 0; i < arrRecords.length; i++) {
                ETIQUETA_Store.remove(arrRecords[i]);
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Imprimir_Etiqueta(btn) {
        if (grid_ETIQUETA.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione uma ou mais etiquetas para imprimir', btn.getId());
            return;
        }

        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();
        var arr4 = new Array();
        var arr5 = new Array();
        var arr6 = new Array();
        var arr7 = new Array();
        var arr8 = new Array();
        var arr9 = new Array();
        var arr10 = new Array();

        for (var i = 0; i < grid_ETIQUETA.getSelectionModel().getSelections().length; i++) {
            var record = grid_ETIQUETA.getSelectionModel().selections.items[i];

            arr1[i] = record.data.NUMERO_ETIQUETA;
            arr2[i] = record.data.QTDE_ETIQUETA;
            arr3[i] = record.data.PESO_ETIQUETA;
            arr4[i] = record.data.VOLUMES_ETIQUETA;
            arr5[i] = record.data.NUMERO_LOTE_ETIQUETA;
            arr6[i] = record.data.ID_SEPARADOR;
            arr7[i] = record.data.CODIGO_PRODUTO_ETIQUETA;
            arr8[i] = record.data.DESCRICAO_PRODUTO_ETIQUETA;
            arr9[i] = record.data.ID_PRODUTO_ETIQUETA;
            arr10[i] = record.data.ID_LOCAL_MATERIAL_SEPARADO;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Imprime_Etiqueta');
        _ajax.setJsonData({
            NUMERO_ETIQUETA: arr1,
            QTDE_ETIQUETA: arr2,
            PESO_ETIQUETA: arr3,
            VOLUMES_ETIQUETA: arr4,
            NUMERO_LOTE_ETIQUETA: arr5,
            ID_SEPARADOR: arr6,
            CODIGO_PRODUTO_ETIQUETA: arr7,
            DESCRICAO_PRODUTO_ETIQUETA: arr8,
            ID_PRODUTO_ETIQUETA: arr9,
            ID_LOCAL_MATERIAL_SEPARADO: arr10,
            GALPAO: CB_GALPAO.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {

        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Imprime_Etiqueta_Pequena() {

    }

    var CB_ID_LOCAL = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE2,
        fieldLabel: 'Local',
        valueField: 'ID_LOCAL',
        displayField: 'DESCRICAO_LOCAL',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true
    });

    //CARREGA_COMBO_LOCAL();
    CARREGA_COMBO_LOCAL_POR_TIPO(2);

    var grid_ETIQUETA = new Ext.grid.EditorGridPanel({
        store: ETIQUETA_Store,
        tbar: [{
            text: 'Imprimir<br />Etiqueta(s)',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'large',
            handler: function (btn) {
                Imprimir_Etiqueta(btn);
            }
        }, '-', {
            text: 'Etiqueta<br />pequena',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'large',
            handler: function (btn) {
                _janelaEtiquetaPequena.show(btn);
            }
        }, '-', {
            text: 'Etiqueta<br />de Sedex',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'large',
            handler: function (btn) {
                if (grid_ETIQUETA.getSelectionModel().getSelections().length == 0) {
                    dialog.MensagemDeErro('Selecione uma etiqueta gravada para emitir as etiquetas de sedex', btn.getId());
                    return;
                }

                var record = grid_ETIQUETA.getSelectionModel().selections.items[0];

                _janelaEtiquetaSedex.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO_VENDA);
                _janelaEtiquetaSedex.show(btn);
            }
        }, '-', {
            id: 'BTN_DELETAR_ETIQUETA',
            text: 'Deletar<br />Etiqueta(s)',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'large',
            handler: function () {
                Deleta_Etiqueta();
            }
        }, '-', {
            xtype: 'label',
            text: 'Qtde:'
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            xtype: "numberfield",
            id: 'QTDE_TODOS_ITENS',
            maxLenght: 12,
            decimalPrecision: 2,
            decimalSeparator: ',',
            minValue: .01,
            width: 70
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                xtype: 'label',
                text: 'Peso:'
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
                xtype: "numberfield",
                id: 'PESO_TODOS_ITENS',
                maxLenght: 12,
                decimalPrecision: 3,
                decimalSeparator: ',',
                minValue: .000,
                width: 80
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                xtype: 'label',
                text: 'Local:'
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
                xtype: "combo",
                id: 'LOCAL_TODOS_ITENS',
                store: combo_TB_LOCAL_STORE2,
                valueField: 'ID_LOCAL',
                displayField: 'DESCRICAO_LOCAL',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                emptyText: 'Selecione',
                selectOnFocus: true,
                allowBlank: false,
                width: 200
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Salvar em todos<br />os itens',
                icon: 'imagens/icones/database_save_24.gif',
                scale: 'large',
                handler: function () {
                    Salva_Qtde_Peso();
                }
            }],
        clicksToEdit: 1,
        columns: [
            checkBoxSM_,
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },

            { id: 'QTDE_ETIQUETA', header: "Qtde.", width: 90, sortable: true, dataIndex: 'QTDE_ETIQUETA', align: 'center', renderer: FormataQtde,
                editor: TXT_QTDE
            },

            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'PESO_ETIQUETA', header: "Peso", width: 90, sortable: true, dataIndex: 'PESO_ETIQUETA', align: 'center',
                editor: TXT_PESO
            },

            { id: 'VOLUMES_ETIQUETA', header: "Volumes", width: 105, sortable: true, dataIndex: 'VOLUMES_ETIQUETA', align: 'center' },

            { id: 'ID_SEPARADOR', header: "Separador", width: 130, sortable: true, dataIndex: 'ID_SEPARADOR', editor: CB_SEPARADOR1, renderer: Nome_Separador },

            { id: 'LOCAL', header: "Local do material separado", width: 270, sortable: true, dataIndex: 'LOCAL',
                editor: CB_ID_LOCAL
            },

            { id: 'NUMERO_LOTE_ETIQUETA', header: "Lote", width: 155, sortable: true, dataIndex: 'NUMERO_LOTE_ETIQUETA',
                editor: TXT_LOTE
            },

            { id: 'CODIGO_CLIENTE_ITEM_PEDIDO', header: "C&oacute;digo Cliente", width: 160, sortable: true, dataIndex: 'CODIGO_CLIENTE_ITEM_PEDIDO',
                editor: TXT_CODIGO_PRODUTO
            },

            { id: 'NOME_VENDEDOR', header: "Vendedor(a)", width: 130, sortable: true, dataIndex: 'NOME_VENDEDOR' },

            { id: 'CODIGO_PRODUTO_ETIQUETA', header: "C&oacute;d. Produto", width: 160, sortable: true,
                dataIndex: 'CODIGO_PRODUTO_ETIQUETA', editor: TXT_CODIGO_PRODUTO
            },

            { id: 'DESCRICAO_PRODUTO_ETIQUETA', header: "Descri&ccedil;&atilde;o do Produto", width: 410, sortable: true,
                dataIndex: 'DESCRICAO_PRODUTO_ETIQUETA', editor: TXT_DESCRICAO_PRODUTO
            }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(375),
        width: '100%',

        sm: checkBoxSM_,
        listeners: {
            afterEdit: function (e) {
                if (e.field == "LOCAL") {
                    e.record.set('ID_LOCAL_MATERIAL_SEPARADO', e.value);
                    var _index = combo_TB_LOCAL_STORE2.find('ID_LOCAL', e.value);
                    e.record.set('LOCAL', combo_TB_LOCAL_STORE2.getAt(_index).data.DESCRICAO_LOCAL);

                    Grava_Local_na_Eiqueta(e.record);
                }
                else {
                    e.record.commit();
                }
            }
        }
    });

    function Grava_Local_na_Eiqueta(record) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Grava_Local_na_Eiqueta');
        _ajax.setJsonData({
            NUMERO_ETIQUETA: record.data.NUMERO_ETIQUETA,
            ID_LOCAL: record.data.ID_LOCAL_MATERIAL_SEPARADO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            record.commit();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Salva_Qtde_Peso() {
        if (!Ext.getCmp('PESO_TODOS_ITENS').isValid() || !Ext.getCmp('QTDE_TODOS_ITENS').isValid()
            || !Ext.getCmp('LOCAL_TODOS_ITENS').isValid()) {
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < ETIQUETA_Store.getCount(); i++) {
            var record = ETIQUETA_Store.getAt(i).data;

            arr1[i] = record;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/GravaQtdePesoEtiqueta');
        _ajax.setJsonData({
            dados: arr1,
            QTDE: Ext.getCmp('QTDE_TODOS_ITENS').getValue(),
            PESO: Ext.getCmp('PESO_TODOS_ITENS').getValue(),
            LOCAL: Ext.getCmp('LOCAL_TODOS_ITENS').getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            for (var i = 0; i < ETIQUETA_Store.getCount(); i++) {
                var record = ETIQUETA_Store.getAt(i);

                record.beginEdit();
                record.set('QTDE_ETIQUETA', Ext.getCmp('QTDE_TODOS_ITENS').getValue());
                record.set('PESO_ETIQUETA', Ext.getCmp('PESO_TODOS_ITENS').getValue());
                record.set('ID_LOCAL', Ext.getCmp('LOCAL_TODOS_ITENS').getValue());
                record.set('LOCAL', Ext.getCmp('LOCAL_TODOS_ITENS').getRawValue());
                record.endEdit();
                record.commit();
            };
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    /////////////////

    var panel1 = new Ext.Panel({
        autoHeight: true,
        border: false,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        anchor: '100%',
        title: 'Impress&atilde;o de Etiquetas de Vendas',
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .22,
                layout: 'form',
                labelWidth: 125,
                items: [TXT_NUMERO_PEDIDO]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [BTN_BUSCAR]
            }, {
                columnWidth: .18,
                layout: 'form',
                labelWidth: 50,
                items: [CB_GALPAO]
            }]
        }, grid_PEDIDO_VENDA, grid_ETIQUETA]
    });

    var _Expedicao_de_Produtos = new Expedicao_de_Produtos();

    var TAB_PANEL1 = new Ext.TabPanel({
        deferredRender: false,
        width: '100%',
        height: 'auto',
        activeTab: 0,
        items: [{
            title: 'Etiquetas de clientes',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ETIQUETA_VENDA',
            items: [panel1]
        }, {
            title: 'Locais de expedi&ccedil;&atilde;o / separadores',
            iconCls: 'icone_TB_TRANSPORTADORA',
            closable: false,
            autoScroll: false
        }],

        listeners: {

            tabchange: function (tabPanel, panel) {
                if (tabPanel.activeTab.title == 'Locais de expedi&ccedil;&atilde;o / separadores') {
                    if (panel.items.items.length == 0) {
                        panel.add(_Expedicao_de_Produtos.panel());
                        panel.doLayout();
                    }
                }
            }
        }
    });

    return TAB_PANEL1;
}

function janelaEtiquetaPequena() {

    var TXT_QTDE = new Ext.form.NumberField({
        fieldLabel: 'Qtde de etiquetas',
        width: 90,
        minValue: 1,
        allowBlank: false,
        value: 1,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Imprime();
                }
            }
        }
    });

    var BTN_OK = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Imprime();
        }
    });

    var CB_ANDAR = new Ext.form.ComboBox({
        fieldLabel: 'Andar',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 120,
        allowBlank: false,
        value: readCookie("andar") ? readCookie("andar") : 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[1, '1º andar'], [4, '4º andar'], [5, '5º andar'], [6, '6º andar']]
        }),
        listeners: {
            select: function (combo, record, index) {
                eraseCookie("andar");
                createCookie("andar", record.data.Opc, 180);
            }
        }
    });

    var form1 = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.40,
                layout: 'form',
                items: [CB_ANDAR]
            }, {
                columnWidth: 0.30,
                layout: 'form',
                items: [TXT_QTDE]
            }, {
                columnWidth: .30,
                items: [BTN_OK]
            }]
        }]
    });

    function Imprime() {
        if (!form1.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Imprime_Etiqueta_Pequena');
        _ajax.setJsonData({
            GALPAO: CB_ANDAR.getValue(),
            QTDE: TXT_QTDE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            wJanela.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wJanela = new Ext.Window({
        layout: 'form',
        title: 'Impress&atilde;o de etiqueta(s) pequena(s)',
        iconCls: 'icone_ETIQUETA_VENDA',
        width: 460,
        height: 97,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            show: function (w) {
                TXT_QTDE.reset();
                TXT_QTDE.focus();
            }
        },
        items: [form1]
    });

    this.show = function (elm) {
        wJanela.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wJanela.toFront();
        wJanela.show(elm.getId());

        TXT_QTDE.focuas();
    };
}

function janelaEtiquetaSedex() {

    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function (pValue) {
        _NUMERO_PEDIDO = pValue;
    };

    var TXT_QTDE = new Ext.form.NumberField({
        fieldLabel: 'Qtde de etiquetas',
        width: 90,
        minValue: 1,
        allowBlank: false,
        value: 1,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Imprime();
                }
            }
        }
    });

    var BTN_OK = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Imprime();
        }
    });

    var CB_ANDAR = new Ext.form.ComboBox({
        fieldLabel: 'Andar',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 120,
        allowBlank: false,
        value: readCookie("andar") ? readCookie("andar") : 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[1, '1º andar'], [4, '4º andar'], [5, '5º andar'], [6, '6º andar']]
        }),
        listeners: {
            select: function (combo, record, index) {
                eraseCookie("andar");
                createCookie("andar", record.data.Opc, 180);
            }
        }
    });

    var form1 = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.40,
                layout: 'form',
                items: [CB_ANDAR]
            }, {
                columnWidth: 0.30,
                layout: 'form',
                items: [TXT_QTDE]
            }, {
                columnWidth: .30,
                items: [BTN_OK]
            }]
        }]
    });

    function Imprime() {
        if (!form1.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ETIQUETA_VENDA.asmx/Imprimir_Etiqueta_Sedex');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            GALPAO: CB_ANDAR.getValue(),
            QTDE: TXT_QTDE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            wJanela.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wJanela = new Ext.Window({
        layout: 'form',
        title: 'Impress&atilde;o de etiqueta(s) de Sedex',
        iconCls: 'icone_ETIQUETA_VENDA',
        width: 460,
        height: 97,
        closable: false,
        draggable: true,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            show: function (w) {
                TXT_QTDE.reset();
                TXT_QTDE.focus();
            }
        },
        items: [form1]
    });

    this.show = function (elm) {
        wJanela.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wJanela.toFront();
        wJanela.show(elm.getId());

        TXT_QTDE.focus();
    };
}