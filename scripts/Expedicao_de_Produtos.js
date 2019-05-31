function Expedicao_de_Ciclistas() {

    var _lista_Historico_do_Separador = new lista_Historico_do_Separador();
    var _lista_Pedidos_do_Separador = new lista_Pedidos_do_Separador();
    var _lista_Pedidos_do_Local = new lista_Pedidos_do_Local();

    var posicao1 = new Nova_Posicao_Pedido();
    var _janela_mudanca_fase_pedido = new janela_mudanca_fase_pedido();

    TB_STATUS_PEDIDO_USUARIO_CARREGA_COMBO();

    ////////////////

    var ITENS_PEDIDO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'NUMERO_ITEM', 'CODIGO_PRODUTO_PEDIDO', 'DESCRICAO_PRODUTO', 'QTDE_A_FATURAR', 'UNIDADE_ITEM_PEDIDO',
            'STATUS_ITEM_PEDIDO', 'DESCRICAO_STATUS_PEDIDO', 'COR_FONTE_STATUS', 'COR_STATUS', 'NOMEFANTASIA_CLIENTE',
            'SEPARADOR_TEMPORARIO', 'LOCAL_TEMPORARIO', 'SEPARADOR', 'LOCAL', 'DATA_PEDIDO', 'ENTREGA_PEDIDO', 'PESO_ITEM_PEDIDO',
            'QTDE_PRODUTO_ITEM_PEDIDO'])
    });

    var checkBox1 = new Ext.grid.CheckboxSelectionModel();

    var TXT_QTDE_A_FATURAR = new Ext.form.NumberField({
        decimalPrecision: casasDecimais_Qtde,
        decimalSeparator: ',',
        minValue: 0
    });

    var gridItensVenda = new Ext.grid.EditorGridPanel({
        title: 'Itens de venda',
        frame: true,
        store: ITENS_PEDIDO,
        tbar: [{
            xtype: 'label',
            text: 'Nr. do pedido:'
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            id: 'TXT_NUMERO_PEDIDO_EXPEDICAO',
            xtype: 'spinnerfield',
            width: 100,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        lista_Itens_de_Pedido(f);
                    }
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function (btn) {
                lista_Itens_de_Pedido(btn);
            }
        }, '-', {
            text: 'Zerar separador e local do(s) item(s) selecionado(s)',
            icon: 'imagens/icones/database_delete_16.gif',
            scale: 'small',
            handler: function (btn) {
                zera_separador_local(btn);
            }
        }],
        columns: [
            checkBox1,
            { id: 'STATUS_ITEM_PEDIDO', header: "Posi&ccedil;&atilde;o", width: 170, sortable: true, dataIndex: 'STATUS_ITEM_PEDIDO', renderer: status_pedido },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'DATA_PEDIDO', header: "Emiss&atilde;o", width: 75, sortable: true, dataIndex: 'DATA_PEDIDO', renderer: XMLParseDate, align: 'center', hidden: true },
            { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: EntregaAtrasada, align: 'center' },
            { id: 'NOMEFANTASIA_CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE', renderer: possui_Certificado },
            { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
            { id: 'QTDE_PRODUTO_ITEM_PEDIDO', header: "Qtde pedido", width: 100, sortable: true, dataIndex: 'QTDE_PRODUTO_ITEM_PEDIDO', align: 'center', renderer: FormataQtde },
            { id: 'QTDE_A_FATURAR', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde,
                editor: TXT_QTDE_A_FATURAR
            },
            { id: 'UNIDADE_ITEM_PEDIDO', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE_ITEM_PEDIDO', align: 'center' },

            { id: 'PESO_ITEM_PEDIDO', header: "Peso", width: 80, sortable: true, dataIndex: 'PESO_ITEM_PEDIDO', align: 'center', renderer: FormataPeso },

            { id: 'SEPARADOR_TEMPORARIO', header: "Separador atual", width: 110, sortable: true, dataIndex: 'SEPARADOR_TEMPORARIO' },
            { id: 'LOCAL_TEMPORARIO', header: "Local reservado", width: 200, sortable: true, dataIndex: 'LOCAL_TEMPORARIO' },

            { id: 'SEPARADOR', header: "Separador do pedido", width: 110, sortable: true, dataIndex: 'SEPARADOR' },
            { id: 'LOCAL', header: "Local do pedido", width: 200, sortable: true, dataIndex: 'LOCAL' },

            { id: 'DESCRICAO_PRODUTO', header: "Descri&ccedil;&atilde;o do Produto", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(329),
        width: '100%',

        sm: checkBox1,

        clicksToEdit: 1,

        bbar: [{
            text: 'Gravar separador e local<br />no(s) item(s) selecionado(s)',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            handler: function (btn) {
                grava_separador_local_temporario(btn);
            }
        }, '-', {
            xtype: 'label',
            html: 'Posi&ccedil;&atilde;o do pedido:'
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, {
            xtype: 'combo',
            id: 'CB_STATUS_PEDIDO_EXPEDICAO',
            store: combo_TB_STATUS_PEDIDO_USUARIO,
            valueField: 'CODIGO_STATUS_PEDIDO',
            displayField: 'DESCRICAO_STATUS_PEDIDO',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione aqui...',
            selectOnFocus: true,
            width: 240
        }, '-', {
            text: 'Salvar nova posi&ccedil;&atilde;o<br />para o pedido',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'large',
            handler: function (btn) {
                GravaNovaPosicao(btn.getId(), false, false);
            }
        }, '-', {
            text: 'Imprimir pedido',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'large',
            handler: function (btn) {
                var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

                if (field == '' || field == 0) {
                    dialog.MensagemDeErro('Digite um numero de pedido para listar');
                    return;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Imprime_Pedido_Separacao');
                _ajax.setJsonData({
                    NUMERO_PEDIDO: field,
                    LOGIN_USUARIO: _LOGIN_USUARIO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    window.open(result, '_blank', 'width=1000,height=800');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            text: 'Liberar p/ Faturar',
            icon: 'imagens/icones/mssql_ok_24.gif',
            scale: 'large',
            handler: function (btn) {
                GravaNovaPosicao(btn.getId(), false, true);
            }
        }],

        listeners: {
            afterEdit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_SEPARADOR.asmx/altera_Qtde_a_faturar');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_VENDA: e.record.data.NUMERO_PEDIDO,
                    NUMERO_ITEM_VENDA: e.record.data.NUMERO_ITEM,
                    QTDE_A_FATURAR: e.value,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    e.record.beginEdit();
                    e.record.set('PESO_ITEM_PEDIDO', result);
                    e.record.endEdit();
                    e.record.commit();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    });

    function GravaNovaPosicao(elm, CANCELAR, LIBERAR_FATURAR) {
        if (gridItensVenda.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens de pedido para gravar a posi&ccedil;&atilde;o');
            return;
        }

        if (!CANCELAR && !LIBERAR_FATURAR) {
            if (Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getValue() < 1) {
                dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status para gravar a posi&ccedil;&atilde;o');
                return;
            }
        }

        var record = gridItensVenda.getSelectionModel().selections.items[0];

        var _pedido = record.data.NUMERO_PEDIDO;

        for (var i = 0; i < gridItensVenda.getSelectionModel().selections.length; i++) {

            if (!CANCELAR && !LIBERAR_FATURAR) {
                if (Ext.getCmp('CB_STATUS_PEDIDO_EXPEDICAO').getValue() ==
                                gridItensVenda.getSelectionModel().selections.items[i].data.STATUS_ITEM_PEDIDO) {

                    dialog.MensagemDeErro('Selecione uma op&ccedil;&atilde;o de status diferente do(s) pedido(s) selecionado(s)');
                    return;
                }
            }

            if (gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO !=
                                    _pedido) {
                dialog.MensagemDeErro('Selecione itens do mesmo pedido');
                return;
            }
        }

        posicao1.NUMERO_PEDIDO(record.data.NUMERO_PEDIDO);

        var items = new Array();

        for (var i = 0; i < gridItensVenda.getSelectionModel().selections.length; i++) {
            items[i] = gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        posicao1.ITENS_PEDIDO(items);
        posicao1.REGISTROS(gridItensVenda.getSelectionModel().selections.items);
        posicao1.CANCELAR(CANCELAR);
        posicao1.LIBERAR_FATURAR(LIBERAR_FATURAR);

        posicao1.storeGrid(ITENS_PEDIDO);

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

    function lista_Itens_de_Pedido(btn) {

        var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

        if (field == '' || field == 0) {
            dialog.MensagemDeErro('Digite um numero de pedido para listar', btn.getId());
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Itens_de_Pedido');
        _ajax.setJsonData({
            NUMERO_PEDIDO: field,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            ITENS_PEDIDO.loadData(criaObjetoXML(result), false);

            lista_Locais_de_Expedicao();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //
    var SEPARADORES_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_SEPARADOR', 'NOME_SEPARADOR', 'NUMERO_PEDIDO', 'PRODUTO', 'QTDE', 'UNIDADE', 'CLIENTE', 'HISTORICO',
        'PEDIDOS'])
    });

    function formata_celula_Historico_Separador(val) {
        if (val == 1) {
            return "<span style='cursor: pointer;' title='Clique para ver o hist&oacute;rico de separação nos produtos no pedido'><img src='imagens/icones/barcode_161.png' border='0'></span>";
        }
        else {
            return "";
        }
    }

    function formata_celula_Pedidos_Separador(val) {
        if (val == 1) {
            return "<span style='cursor: pointer;' title='Clique para ver o(s) pedido(s) do separador'><img src='imagens/icones/copy_level_16.gif' border='0'></span>";
        }
        else {
            return "";
        }
    }

    var gridSeparadores = new Ext.grid.GridPanel({
        title: 'Separadores',
        frame: true,
        store: SEPARADORES_Store,
        tbar: [{
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function (btn) {
                lista_Separadores();
            }
        }],
        columns: [
            { id: 'HISTORICO', header: "", width: 40, sortable: true, dataIndex: 'HISTORICO', align: 'center', renderer: formata_celula_Historico_Separador },
            { id: 'PEDIDOS', header: "", width: 40, sortable: true, dataIndex: 'PEDIDOS', align: 'center', renderer: formata_celula_Pedidos_Separador },
            { id: 'NOME_SEPARADOR', header: "Separador", width: 110, sortable: true, dataIndex: 'NOME_SEPARADOR' },
            { id: 'NUMERO_PEDIDO', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
            { id: 'PRODUTO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'PRODUTO' },
            { id: 'QTDE', header: "Qtde a Faturar", width: 100, sortable: true, dataIndex: 'QTDE', align: 'center', renderer: FormataQtde },
            { id: 'UNIDADE', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
            { id: 'CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'CLIENTE' }
        ],

        stripeRows: true,
        height: 260,
        width: '100%',

        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'HISTORICO') {
                    var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

                    if (field == '' || field == 0) {
                        dialog.MensagemDeErro('Digite um numero de pedido para consultar o hist&oacute;rico', grid.getId());
                        return;
                    }

                    _lista_Historico_do_Separador.NUMERO_PEDIDO_VENDA(field);
                    _lista_Historico_do_Separador.ID_SEPARADOR(record.data.ID_SEPARADOR);
                    _lista_Historico_do_Separador.show(grid, e.getPageX(), e.getPageY());
                }

                if (fieldName == 'PEDIDOS') {
                    _lista_Pedidos_do_Separador.ID_SEPARADOR(record.data.ID_SEPARADOR);
                    _lista_Pedidos_do_Separador.show(grid, e.getPageX(), e.getPageY());
                }
            }
        }
    });

    function lista_Separadores() {
        var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

        if (field == '' || field == 0) {
            dialog.MensagemDeErro('Digite um numero de pedido para listar');
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Separadores_Historico');
        _ajax.setJsonData({
            NUMERO_PEDIDO: field,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            SEPARADORES_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //

    var LOCAIS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_LOCAL', 'DESCRICAO_LOCAL', 'CAPACIDADE_PESO', 'PESO_DISPONIVEL', 'CLIENTE', 'NUMERO_PEDIDO_VENDA', 'HISTORICO'])
    });

    function formata_celula_Pedidos_Local(val) {
        if (val == 1) {
            return "<span style='cursor: pointer;' title='Clique para ver o(s) pedido(s) do local'><img src='imagens/icones/copy_level_16.gif' border='0'></span>";
        }
        else {
            return "";
        }
    }

    var gridLocais = new Ext.grid.GridPanel({
        title: 'Locais de expedi&ccedil;&atilde;o',
        frame: true,
        store: LOCAIS_Store,
        tbar: [{
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function (btn) {
                lista_Locais_de_Expedicao();
            }
        }, '-'],
        columns: [
            { id: 'HISTORICO', header: "", width: 40, sortable: true, dataIndex: 'HISTORICO', align: 'center', renderer: formata_celula_Pedidos_Local },
            { id: 'DESCRICAO_LOCAL', header: "Local de expedi&ccedil;&atilde;o", width: 180, sortable: true, dataIndex: 'DESCRICAO_LOCAL' },
            { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
            { id: 'CLIENTE', header: "Cliente", width: 150, sortable: true, dataIndex: 'CLIENTE', renderer: possui_Certificado },
            { id: 'CAPACIDADE_PESO', header: "Capacidade de peso", width: 120, sortable: true, dataIndex: 'CAPACIDADE_PESO', align: 'center', renderer: FormataQtde },
            { id: 'PESO_DISPONIVEL', header: "Peso dispon&iacute;vel", width: 120, sortable: true, dataIndex: 'PESO_DISPONIVEL', align: 'center', renderer: FormataQtde }
        ],

        stripeRows: true,
        height: 260,
        width: '100%',

        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'HISTORICO') {
                    var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

                    if (field == '' || field == 0) {
                        dialog.MensagemDeErro('Digite um numero de pedido para consultar o hist&oacute;rico', grid.getId());
                        return;
                    }

                    _lista_Pedidos_do_Local.ID_LOCAL(record.data.ID_LOCAL);
                    _lista_Pedidos_do_Local.show(grid, e.getPageX(), e.getPageY());
                }
            }
        }
    });

    function lista_Locais_de_Expedicao() {
        var field = Ext.getCmp('TXT_NUMERO_PEDIDO_EXPEDICAO').getValue();

        if (field == '' || field == 0) {
            dialog.MensagemDeErro('Digite um numero de pedido para listar', btn.getId());
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Locais_de_Expedicao');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: field,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            LOCAIS_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function grava_separador_local_temporario(btn) {
        if (gridItensVenda.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens de pedido para gravar o separador e o local pr&eacute;-definidos', btn.getId());
            return;
        }

        if (!gridSeparadores.getSelectionModel().getSelected()) {
            dialog.MensagemDeErro('Selecione um separador abaixo', btn.getId());
            return;
        }

        if (!gridLocais.getSelectionModel().getSelected()) {
            dialog.MensagemDeErro('Selecione um local abaixo', btn.getId());
            return;
        }

        var arr1 = new Array();
        var arr2 = new Array();

        for (var i = 0; i < gridItensVenda.getSelectionModel().getSelections().length; i++) {
            if (!arr1.contains(gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO)) {
                arr1[arr1.length] = gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO;
            }

            arr2[i] = gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/grava_separador_local_temporario');
        _ajax.setJsonData({
            NUMEROS_PEDIDO: arr1,
            NUMEROS_ITEM: arr2,
            ID_SEPARADOR: gridSeparadores.getSelectionModel().getSelected().data.ID_SEPARADOR,
            ID_LOCAL: gridLocais.getSelectionModel().getSelected().data.ID_LOCAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            lista_Itens_de_Pedido();
            lista_Separadores();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function zera_separador_local(btn) {
        if (gridItensVenda.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um ou mais itens de pedido para zerar o separador e o local pr&eacute;-definidos', btn.getId());
            return;
        }

        var arr1 = new Array();
        var arr2 = new Array();

        for (var i = 0; i < gridItensVenda.getSelectionModel().getSelections().length; i++) {
            if (!arr1.contains(gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO)) {
                arr1[arr1.length] = gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_PEDIDO;
            }

            arr2[i] = gridItensVenda.getSelectionModel().selections.items[i].data.NUMERO_ITEM;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/zera_separador_local');
        _ajax.setJsonData({
            NUMEROS_PEDIDO: arr1,
            NUMEROS_ITEM: arr2,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            lista_Itens_de_Pedido();
            lista_Separadores();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //

    var panel1 = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        border: true,
        frame: true,
        items: [gridItensVenda,
        {
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [gridSeparadores]
            }, {
                columnWidth: .50,
                items: [gridLocais]
            }]
        }]
    });

    this.panel = function () {
        return panel1;
    };
}

function lista_Historico_do_Separador() {
    var _NUMERO_PEDIDO_VENDA;

    this.NUMERO_PEDIDO_VENDA = function (pValue) {
        _NUMERO_PEDIDO_VENDA = pValue;
    };

    var _ID_SEPARADOR;

    this.ID_SEPARADOR = function (pValue) {
        _ID_SEPARADOR = pValue;
    };

    var store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['DATA_ETIQUETA', 'ID_PRODUTO_ETIQUETA', 'CODIGO_PRODUTO_ETIQUETA', 'QTDE_ETIQUETA', 'UNIDADE',
        'PESO_ETIQUETA'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: store1,
        columns: [
        { id: 'DATA_ETIQUETA', header: "Data", width: 75, sortable: true, dataIndex: 'DATA_ETIQUETA', renderer: XMLParseDate, align: 'center' },
        { id: 'CODIGO_PRODUTO_ETIQUETA', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO_ETIQUETA' },
        { id: 'QTDE_ETIQUETA', header: "Qtde.", width: 100, sortable: true, dataIndex: 'QTDE_ETIQUETA', align: 'center', renderer: FormataQtde },
        { id: 'UNIDADE', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
        { id: 'PESO_ETIQUETA', header: "Peso", width: 100, sortable: true, dataIndex: 'PESO_ETIQUETA', align: 'center', renderer: FormataPeso }
],
        stripeRows: true,
        height: 280,
        width: '100%'
    });

    var wHISTORICO = new Ext.Window({
        layout: 'form',
        title: 'Hist&oacute;rico do separador nos itens do pedido',
        width: 532,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [grid1]
    });

    function lista_Historico_do_Separador() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Historico_do_Separador');
        _ajax.setJsonData({
            NUMERO_PEDIDO: _NUMERO_PEDIDO_VENDA,
            ID_SEPARADOR: _ID_SEPARADOR,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.show = function (elm, x, y) {
        wHISTORICO.setPosition(x + 10, y - (wHISTORICO.getHeight() + 12));
        wHISTORICO.toFront();
        wHISTORICO.show(elm.getId());

        lista_Historico_do_Separador();
    };
}

function lista_Pedidos_do_Separador() {
    var _ID_SEPARADOR;

    this.ID_SEPARADOR = function (pValue) {
        _ID_SEPARADOR = pValue;
    };

    var store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_A_FATURAR', 'PESO_ITEM_PEDIDO', 'UNIDADE'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: store1,
        columns: [
        { id: 'NUMERO_PEDIDO', header: "N&ordm; Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
        { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: XMLParseDate, align: 'center' },
        { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
        { id: 'QTDE_A_FATURAR', header: "Qtde.", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde },
        { id: 'UNIDADE', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
        { id: 'PESO_ITEM_PEDIDO', header: "Peso", width: 100, sortable: true, dataIndex: 'PESO_ITEM_PEDIDO', align: 'center', renderer: FormataPeso }
],
        stripeRows: true,
        height: 280,
        width: '100%'
    });

    var wHISTORICO = new Ext.Window({
        layout: 'form',
        title: 'Pedido(s) do separador',
        width: 532,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [grid1]
    });

    function lista_Pedidos() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Pedidos_do_Separador');
        _ajax.setJsonData({
            ID_SEPARADOR: _ID_SEPARADOR,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.show = function (elm, x, y) {
        wHISTORICO.setPosition(x + 10, y - (wHISTORICO.getHeight() + 12));
        wHISTORICO.toFront();
        wHISTORICO.show(elm.getId());

        lista_Pedidos();
    };
}

function lista_Pedidos_do_Local() {
    var _ID_LOCAL;

    this.ID_LOCAL = function (pValue) {
        _ID_LOCAL = pValue;
    };

    var store1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_PEDIDO', 'ENTREGA_PEDIDO', 'CODIGO_PRODUTO_PEDIDO', 'QTDE_A_FATURAR', 'PESO_ITEM_PEDIDO', 'UNIDADE'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: store1,
        columns: [
        { id: 'NUMERO_PEDIDO', header: "N&ordm; Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO', align: 'center' },
        { id: 'ENTREGA_PEDIDO', header: "Entrega", width: 75, sortable: true, dataIndex: 'ENTREGA_PEDIDO', renderer: XMLParseDate, align: 'center' },
        { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;digo produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
        { id: 'QTDE_A_FATURAR', header: "Qtde.", width: 100, sortable: true, dataIndex: 'QTDE_A_FATURAR', align: 'center', renderer: FormataQtde },
        { id: 'UNIDADE', header: "Un.", width: 50, sortable: true, dataIndex: 'UNIDADE', align: 'center' },
        { id: 'PESO_ITEM_PEDIDO', header: "Peso", width: 100, sortable: true, dataIndex: 'PESO_ITEM_PEDIDO', align: 'center', renderer: FormataPeso }
],
        stripeRows: true,
        height: 280,
        width: '100%'
    });

    var wHISTORICO = new Ext.Window({
        layout: 'form',
        title: 'Pedido(s) do local',
        width: 532,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [grid1]
    });

    function lista_Pedidos() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_SEPARADOR.asmx/lista_Pedidos_do_Local');
        _ajax.setJsonData({
            ID_LOCAL: _ID_LOCAL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            store1.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    this.show = function (elm, x, y) {
        wHISTORICO.setPosition(x + 10, y - (wHISTORICO.getHeight() + 12));
        wHISTORICO.toFront();
        wHISTORICO.show(elm.getId());

        lista_Pedidos();
    };
}