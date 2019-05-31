function Compras_Atrasadas() {

    var TXT_FD_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 350,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' }
    });

    var BTN_CONFIRMAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            var _ajax = new Th2_Ajax();

            _ajax.setUrl('servicos/TB_PEDIDO_COMPRA.asmx/Th2_Itens_Compra_Atrasados');
            _ajax.setJsonData({
                FORNECEDOR: TXT_FD_CLIENTE_FORNECEDOR.getValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsVD = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Item com data de entrega atrasada / entregas parciais',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.35,
                layout: 'form',
                items: [TXT_FD_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [BTN_CONFIRMAR]
}]
}]
            });

            //////////////

            var formFD = new Ext.FormPanel({
                labelAlign: 'top',
                bodyStyle: 'padding:5px 5px 0',
                frame: true,
                width: '100%',
                height: 500,
                items: [fsVD]
            });

            var panelFD = new Ext.Panel({
                width: '100%',
                height: '100%',
                border: true,
                title: 'Compras com data de entrega atrasadas',
                items: [formFD]
            });

            formFD.setHeight(AlturaDoPainelDeConteudo(0) - 55);

            return panelFD;
        }