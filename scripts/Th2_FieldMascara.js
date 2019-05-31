Th2_FieldMascara = Ext.extend(Ext.form.TextField,
{
    Mascara: '',
    maxLength: function(v) {
        this.Mascara = v;
    },

    listeners: {
        render: function(component) {
            component.maxLength = component.Mascara.length;
        },
        blur: function(component) {
            var MascaraAplicada = component.aplicaMascara(component);
            component.setValue(MascaraAplicada);
        }
    },

    aplicaMascara: function(component) {
        var elem = component.getValue();
        var retorno = '';
        var numeros = '1234567890';
        var charMai = 'ABCDEFGHIJKLMNOPQRSTUVXWYZ';
        var charMin = 'abcdefghijklmnopqrstuvxwyz';

        numeros = numeros + charMai + charMin;

        for (var i = 0; i < elem.length; i++) {
            if (numeros.Contains(elem.substring(i, i + 1))) {
                retorno += elem.substring(i, i + 1);
            }
        }

        var separadores = 0;

        for (var i = 0; i < component.Mascara.length; i++) {
            if (!numeros.Contains(component.Mascara.substring(i, i + 1))) {
                separadores++;
            }
        }

        elem = retorno;

        var formato = component.getValue();
        var n = 0;

        if (elem.length > 0 && (elem.length + separadores) == component.Mascara.length) {
            formato = '';
            for (var i = 0; i < component.Mascara.length; i++) {
                if (component.Mascara.substring(i, i + 1) == '9') {
                    formato += elem.substring((i - n), (i - n) + 1);
                }
                else {
                    n++;
                    formato += component.Mascara.substring(i, i + 1);
                }
            }
        }

        return formato;
    }
});

String.prototype.Contains = function(strValue) {
    return this.indexOf(strValue) > -1 ? true : false;
};
