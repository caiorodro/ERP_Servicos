function janela_corpo_email() {

    var TXT_CORPO_EMAIL = new Th2_HtmlEditor({
        height: AlturaDaJanela - 132,
        width: LarguraDaJanela - 64
    });

    var wSUGESTAO = new Ext.Window({
        title: 'Corpo da mensagem',
        width: LarguraDaJanela - 50,
        height: AlturaDaJanela - 100,
        closable: false,
        draggable: false,
        resizable: false,
        minimizable: true,
        modal: true,
        iconCls: 'icone_ENVIA_COTACAO',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function(w) {
                w.hide();
            },
            hide: function() {
                _caller.setValue(TXT_CORPO_EMAIL.getValue());
            }
        },
        items: [TXT_CORPO_EMAIL]
    });

    var _caller;

    this.show = function(elm) {
        _caller = elm;
        TXT_CORPO_EMAIL.setValue(elm.getValue());
        wSUGESTAO.show(elm.getId());
    };

}
