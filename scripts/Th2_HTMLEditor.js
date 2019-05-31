var janelaTabelaAberta = false;

function Definir_Tabela_HTML() {
    var TXT_LINHAS = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; de Linhas',
        width: 70,
        maxLength: 10,
        allowBlank: false,
        decimalPrecision: 0,
        minValue: 1,
        value: 1
    });

    var TXT_COLUNAS = new Ext.ux.form.SpinnerField({
        fieldLabel: 'N&ordm; de Colunas',
        width: 70,
        maxLength: 10,
        allowBlank: false,
        decimalPrecision: 0,
        minValue: 1,
        value: 1
    });

    var COR_BORDA = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {

            }
        }
    });

    var _cor_da_borda = "#555555";
    var _cor_fundo_tabela = "whitesmoke";

    var COR_BORDA = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                _cor_da_borda = color;
            }
        }
    });

    var COR_FUNDO_TABELA = new Ext.ColorPalette({
        listeners: {
            select: function (p, color) {
                _cor_fundo_tabela = color;
            }
        }
    });

    var _htmlEditor;

    this.htmlEditor = function (pValue) {
        _htmlEditor = pValue;
    };

    function insereTabela() {
        var _tabela = "<br /><table style='border-width: 1px; border-style: dotted; border-color: #555555; background-color: " + _definir_Tabela_HTML.COR_DE_FUNDO() + "; font-size: 9pt;'>";

        for (var l = 0; l < _definir_Tabela_HTML.LINHAS(); l++) {
            _tabela += "<tr>";

            for (var c = 0; c < _definir_Tabela_HTML.COLUNAS(); c++) {
                _tabela += "<td style='border-top-width: 1px; border-top-style: solid; border-top-color: " + _definir_Tabela_HTML.COR_BORDA() + "; " +
                 "border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: " + _definir_Tabela_HTML.COR_BORDA() + "; " +
                 "border-left-width: 1px; border-left-style: solid; border-left-color: " + _definir_Tabela_HTML.COR_BORDA() + "; " +
                 "border-right-width: 1px; border-right-style: solid; border-right-color: " + _definir_Tabela_HTML.COR_BORDA() + "'>&nbsp;</td>";
            }

            _tabela += "</tr>";
        }

        _tabela += "</table><br />";

        _htmlEditor.execCmd('insertHTML', _tabela);

        wTABELA.hide();
    }

    var formTABELA = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        bbar: [{
            text: 'Ok',
            scale: 'small',
            icon: 'imagens/icones/ok_16.gif',
            handler: function () {
                insereTabela();
            }
        }],
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .50,
                layout: 'form',
                items: [TXT_LINHAS]
            }, {
                columnWidth: .50,
                layout: 'form',
                items: [TXT_COLUNAS]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                xtype: 'label',
                text: 'Cor da borda'
            }, {
                columnWidth: .50,
                xtype: 'label',
                text: 'Cor de fundo'
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                layout: 'form',
                items: [COR_BORDA]
            }, {
                columnWidth: .50,
                layout: 'form',
                items: [COR_FUNDO_TABELA]
            }]
        }]
    });

    var wTABELA = new Ext.Window({
        layout: 'form',
        title: 'Definir tabela',
        width: 350,
        height: 227,
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
            },
            show: function () {
                janelaTabelaAberta = true;
            },
            hide: function () {
                janelaTabelaAberta = false;
            },
            render: function (w) {
                _id_janela_definicao_tabela_html_editor = w.getId();
            }
        },
        items: [formTABELA]
    });

    this.COLUNAS = function () {
        return TXT_COLUNAS.getValue();
    };

    this.LINHAS = function () {
        return TXT_LINHAS.getValue();
    };

    this.COR_BORDA = function () {
        return _cor_da_borda;
    };

    this.COR_DE_FUNDO = function () {
        return _cor_fundo_tabela;
    };

    this.show = function (elm) {
        wTABELA.setPosition((elm.getPosition()[0] + elm.getWidth() - 350), elm.getPosition()[1]);
        wTABELA.toFront();
        wTABELA.show(elm.getId());
    };

    this.hide = function () {
        wTABELA.hide();
    };
}

var _id_janela_definicao_tabela_html_editor;

var _definir_Tabela_HTML = new Definir_Tabela_HTML();

Ext.ns('Ext.ux');

Th2_HtmlEditor = Ext.extend(Ext.form.HtmlEditor, {
    adjustFont: function (btn) {
        var adjust = btn.itemId == "increasefontsize" ? 1 : -1;

        var v = parseInt(this.getDoc().queryCommandValue('FontSize') || 2, 10);

        if ((Ext.isSafari && !Ext.isSafari2) || Ext.isChrome || Ext.isAir) {

            if (btn.itemId == "increasefontsize") {
                v += 1 + adjust;
            }
            else if (btn.itemId == "decreasefontsize") {
                v -= 1; // (v - adjust);
            }

            v = v.constrain(1, 6);

        } else {

            if (Ext.isSafari) { // safari
                adjust *= 2;
            }

            v = Math.max(1, v + adjust) + (Ext.isSafari ? 'px' : 0);
        }

        this.execCmd('FontSize', v);
    },
    fixKeys: function () {
        if (Ext.isIE) {
            return function (e) {
                var k = e.getKey(),
                    doc = this.getDoc(),
                        r;
                if (k == e.TAB) {
                    e.stopEvent();
                    r = doc.selection.createRange();
                    if (r) {
                        r.collapse(true);
                        r.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                        this.deferFocus();
                    }
                } else if (k == e.ENTER) {
                    r = doc.selection.createRange();
                    if (r) {
                        var target = r.parentElement();
                        if (!target || target.tagName.toLowerCase() != 'li') {
                            e.stopEvent();
                            r.pasteHTML('<br />');
                            r.collapse(false);
                            r.select();
                        }
                    }
                }
            };
        } else if (Ext.isOpera) {
            return function (e) {
                var k = e.getKey();
                if (k == e.TAB) {
                    e.stopEvent();
                    this.win.focus();
                    this.execCmd('InsertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.deferFocus();
                }
            };
        } else if (Ext.isWebKit) {
            return function (e) {
                var k = e.getKey();
                if (k == e.TAB) {
                    e.stopEvent();
                    this.execCmd('InsertText', '\t');
                    this.deferFocus();
                } else if (k == e.ENTER) {
                    e.stopEvent();
                    this.execCmd('InsertHtml', '<br /><br />');
                    this.deferFocus();
                }
            };
        }
    },

    listeners: {
        render: function (component) {
            var tb = component.getToolbar();

            var BTN_ADD_TABLE = new Ext.Button({
                icon: 'imagens/icones/table_add_16.gif',
                scale: 'small',
                tooltip: 'Inserir tabela',
                listeners: {
                    click: function (button, e) {
                        _definir_Tabela_HTML.htmlEditor(component);

                        if (janelaTabelaAberta) {
                            _definir_Tabela_HTML.hide();
                        }
                        else {
                            _definir_Tabela_HTML.show(button);
                        }
                    }
                }
            });

            tb.add('-');
            tb.addButton(BTN_ADD_TABLE);

            // component.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");
            component.focus(false);

            component.tb.doLayout(true, true);
        }
    }
});