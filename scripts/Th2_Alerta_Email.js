
function Alerta_Email() {

    var LBL_AVISO = new Ext.form.Label();

    var wALERTA = new Ext.Window({
        layout: 'form',
        width: 280,
        height: 100,
        closable: true,
        draggable: true,
        resizable: false,
        minimizable: false,
        modal: false,
        iconCls: 'icone_ENVIA_COTACAO',
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        title: 'Doran Webmail',
        items: [LBL_AVISO]
    });

    this.show = function(elm, _mensagem) {
        var x = LarguraDaJanela - (wALERTA.getWidth() + 30);
        var y = AlturaDaJanela - (wALERTA.getHeight() + 80);

        wALERTA.setPosition(x, y);
        LBL_AVISO.setText("<div style='font-size: 9pt; text-align: center;'><br />" + _mensagem + "</div>", false);
        wALERTA.toFront();
        wALERTA.show(elm);

        var t = setTimeout("Fecha('" + wALERTA.getId() + "')", 30000); // 30 segundos
    };
}

function Fecha(elm) {
    Ext.getCmp(elm).close();
}
