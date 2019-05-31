function janela_Local_Material_Separacao() {
    var _NUMERO_PEDIDOS_VENDA;

    this.NUMERO_PEDIDOS_VENDA = function (pValue) {
        _NUMERO_PEDIDOS_VENDA = pValue;
    };

    var _NUMERO_ITENS_VENDA;

    this.NUMERO_ITENS_VENDA = function (pValue) {
        _NUMERO_ITENS_VENDA = pValue;
    };

    var _CODIGO_PRODUTO;

    this.CODIGO_PRODUTO = function (pValue) {
        _CODIGO_PRODUTO = pValue;
    };
    
    var Store_LOCAL_SEPARACAO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO', 'CODIGO_PRODUTO', 'DESCRICAO_LOCAL'])
    });

    function descricao_local(val, metadata, record) {
        return record.data.DESCRICAO_LOCAL;
    }

    var CB_ID_LOCAL = new Ext.form.ComboBox({
        store: combo_TB_LOCAL_STORE,
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

    CARREGA_COMBO_LOCAL_POR_TIPO(2);

    var grid1 = new Ext.grid.EditorGridPanel({
        store: Store_LOCAL_SEPARACAO,
        columns: [
                { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. Pedido", width: 80, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 130, sortable: true, dataIndex: 'CODIGO_PRODUTO' },
                { id: 'ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO', header: "Local do material separado", width: 220, sortable: true, dataIndex: 'ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO',
                    renderer: descricao_local, editor: CB_ID_LOCAL
                }
            ],
        stripeRows: true,
        width: '100%',
        height: 280,
        clicksToEdit: 1,

        listeners: {
            afteredit: function (e) {

                if (e.field == "ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO") {
                    var _index = combo_TB_LOCAL_STORE.find('ID_LOCAL', e.value);
                    e.record.set('DESCRICAO_LOCAL', combo_TB_LOCAL_STORE.getAt(_index).data.DESCRICAO_LOCAL);
                }
            }
        },

        bbar: [{
            text: 'Salvar o local nos itens selecionados',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function (btn) {
                SalvaLocais();
            }
        }, '-', {
            text: 'Deletar local',
            icon: 'imagens/icones/database_delete_24.gif',
            scale: 'medium',
            handler: function (btn) {
                DeletaLocal(btn);
            }
        }]
    });

    function SalvaLocais() {

        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();

        for (var i = 0; i < Store_LOCAL_SEPARACAO.getCount(); i++) {
            var record = Store_LOCAL_SEPARACAO.getAt(i);

            if (record.dirty) {
                arr1[arr1.length] = record.data.NUMERO_PEDIDO_VENDA;
                arr2[arr2.length] = record.data.NUMERO_ITEM_VENDA;
                arr3[arr3.length] = record.data.ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO;
            }
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_LOCAL_MATERIAL_SEPARADO.asmx/SalvaLocais');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: arr1,
            NUMERO_ITEM_VENDA: arr2,
            ID_LOCAL: arr3,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            carrega_Grid();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function DeletaLocal(btn) {
        if (!grid1.getSelectionModel().selection.record) {
            dialog.MensagemDeErro('Selecione um local definido para deletar', btn.getId());
            return;
        }

        var record = grid1.getSelectionModel().selection.record;

        if (record.data.ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO == 0) {
            dialog.MensagemDeErro('Selecione um local definido para deletar', btn.getId());
            return;
        }

        dialog.MensagemDeConfirmacao('Deseja deletar o local selecionado?', btn.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_LOCAL_MATERIAL_SEPARADO.asmx/DeletaLocal');
                _ajax.setJsonData({
                    NUMERO_PEDIDO_VENDA: record.data.NUMERO_PEDIDO_VENDA,
                    NUMERO_ITEM_VENDA: record.data.NUMERO_ITEM_VENDA,
                    ID_LOCAL: record.data.ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    carrega_Grid();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function Adiciona_Registro() {

        if (Store_LOCAL_SEPARACAO.getCount() == 0) {
            for (var i = 0; i < _NUMERO_ITENS_VENDA.length; i++) {
                nova_linha(_NUMERO_PEDIDOS_VENDA[i], _NUMERO_ITENS_VENDA[i], _CODIGO_PRODUTO[i]);
            }
        }
        else {
            var c = Store_LOCAL_SEPARACAO.getCount();

            for (var i = 0; i < c; i++) {
                if (!Store_LOCAL_SEPARACAO.getAt(i).dirty) {
                    nova_linha(Store_LOCAL_SEPARACAO.getAt(i).data.NUMERO_PEDIDO_VENDA, Store_LOCAL_SEPARACAO.getAt(i).data.NUMERO_ITEM_VENDA,
                        Store_LOCAL_SEPARACAO.getAt(i).data.CODIGO_PRODUTO);
                }
            }

            for (var i = 0; i < _NUMERO_ITENS_VENDA.length; i++) {
                if (Store_LOCAL_SEPARACAO.find('NUMERO_ITEM_VENDA', _NUMERO_ITENS_VENDA[i]) == -1)
                    nova_linha(_NUMERO_PEDIDOS_VENDA[i], _NUMERO_ITENS_VENDA[i], _CODIGO_PRODUTO[i]);
            }
        }

        function nova_linha(NUMERO_PEDIDO, NUMERO_ITEM, CODIGO_PRODUTO) {
            var new_record = Ext.data.Record.create([
                        { name: 'NUMERO_PEDIDO_VENDA' },
                        { name: 'NUMERO_ITEM_VENDA' },
                        { name: 'ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO' },
                        { name: 'DESCRICAO_LOCAL' },
                        { name: 'CODIGO_PRODUTO' }
                    ]);

            var novo = new new_record({
                NUMERO_PEDIDO_VENDA: NUMERO_PEDIDO,
                NUMERO_ITEM_VENDA: NUMERO_ITEM,
                ID_LOCAL_MATERIAL_DISPONIVEL_SEPARACAO: 0,
                DESCRICAO_LOCAL: '',
                CODIGO_PRODUTO: CODIGO_PRODUTO
            });

            Store_LOCAL_SEPARACAO.insert(Store_LOCAL_SEPARACAO.getCount(), novo);
        }
    }

    function carrega_Grid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_LOCAL_MATERIAL_SEPARADO.asmx/Carrega_Locais');
        _ajax.setJsonData({
            NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDOS_VENDA,
            NUMERO_ITEM_VENDA: _NUMERO_ITENS_VENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            Store_LOCAL_SEPARACAO.loadData(criaObjetoXML(result), false);

            Adiciona_Registro();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wJANELA = new Ext.Window({
        layout: 'form',
        iconCls: 'icone_TB_TRANSPORTADORA',
        width: 470,
        title: 'Locais do material dispon&iacute;vel para separa&ccedil;&atilde;o',
        height: 'auto',
        closable: false,
        draggable: false,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
                _shown = false;
            }
        },
        items: [grid1]
    });

    this.show = function (elm) {
        wJANELA.setPosition(elm.getPosition()[0] - 70, elm.getPosition()[1] + elm.getHeight());
        wJANELA.toFront();
        wJANELA.show(elm.getId());

        _shown = true;
        carrega_Grid();
    };

    this.carregaGrid = function () {
        carrega_Grid();
    };

    var _shown = false;
    
    this.shown = function () {
        return _shown;
    };
}