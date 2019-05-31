var showFiltroStatusCompra = false;

function janela_Filtro_Status_Pedido_Compra() {

    this.statusSelecionados = function () {
        var arr1 = readCookie("status_pedido_compra");

        try { arr1 = arr1.split(','); } catch (e) { }

        return arr1 ? arr1 : new Array();
    };

    var checkBoxFP_ = new Ext.grid.CheckboxSelectionModel();

    TB_STATUS_PEDIDO_COMPRA_CARREGA_COMBO();

    var grid_Filtro_Status = new Ext.grid.GridPanel({
        store: combo_TB_STATUS_PEDIDO_COMPRA,
        columns: [
        checkBoxFP_,
        { id: 'DESCRICAO_STATUS_PEDIDO_COMPRA', header: "Posi&ccedil;&atilde;o do Pedido", width: 270, sortable: true, dataIndex: 'DESCRICAO_STATUS_PEDIDO_COMPRA',
            renderer: status_pedido_compra
        }],
        stripeRows: true,
        height: 307,
        width: '100%',

        sm: checkBoxFP_
    });

    var toolbar1 = new Ext.Toolbar({
        items: [{
            text: 'Ok',
            icon: 'imagens/icones/Ok_16.gif',
            scale: 'small',
            handler: function () {
                wFILTRO_STATUS.hide();
            }
        }]
    });

    var wFILTRO_STATUS = new Ext.Window({
        layout: 'form',
        title: 'Selecione o(s) status que deseja filtrar',
        width: 332,
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
            },
            hide: function () {
                showFiltroStatusCompra = false;

                var arr1 = new Array();

                for (var i = 0; i < grid_Filtro_Status.getSelectionModel().selections.items.length; i++) {
                    arr1[i] = grid_Filtro_Status.getSelectionModel().selections.items[i].data.CODIGO_STATUS_COMPRA;
                }

                eraseCookie("status_pedido_compra");
                createCookie("status_pedido_compra", arr1, 180);
            },
            show: function () {
                showFiltroStatusCompra = true;
            }
        },
        items: [grid_Filtro_Status, toolbar1]
    });

    this.show = function (elm) {

        var arr1 = readCookie("status_pedido_compra");

        if (arr1) {
            arr1 = arr1.split(',');

            checkBoxFP_.deselectRange(0, checkBoxFP_.getCount() - 1);

            var arrIndex = new Array();

            for (var i = 0; i < arr1.length; i++) {
                var index = combo_TB_STATUS_PEDIDO_COMPRA.find('CODIGO_STATUS_COMPRA', arr1[i]);

                if (index > -1)
                    arrIndex[arrIndex.length] = index;
            }

            checkBoxFP_.selectRows(arrIndex);
        }

        wFILTRO_STATUS.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wFILTRO_STATUS.toFront();
        wFILTRO_STATUS.show(elm.getId());
    };

    this.hide = function () {
        wFILTRO_STATUS.hide();
    };
}