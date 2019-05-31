function google_maps() {

    var map, geocoder;
    var mapDisplay
    var directionsService;

    var _ENDERECO_ORIGEM;
    var _ENDERECO_DESTINO;

    var _DISTANCIA_METROS;
    var _TEMPO;

    var _TXT_DISTANCIA_METROS;
    var _TXT_TEMPO;

    var _ATENCAO;
    var _RESUMO;

    var _SUCESSO;

    this.ENDERECO_ORIGEM = function(pENDERECO_ORIGEM) {
        _ENDERECO_ORIGEM = pENDERECO_ORIGEM;
    };

    this.ENDERECO_DESTINO = function(pENDERECO_DESTINO) {
        _ENDERECO_DESTINO = pENDERECO_DESTINO;
    };

    this.get_DISTANCIA_METROS = function() {
        return _DISTANCIA_METROS;
    };

    this.get_TEMPO = function() {
        return _TEMPO;
    };

    this.get_TXT_DISTANCIA_METROS = function() {
        return _TXT_DISTANCIA_METROS;
    };

    this.get_TXT_TEMPO = function() {
        return _TXT_TEMPO;
    };

    this.get_ATENCAO = function() {
        return _ATENCAO;
    };

    this.get_RESUMO = function() {
        return _RESUMO;
    };

    this.set_SUCESSO = function(pSUCESSO) {
        _SUCESSO = pSUCESSO;
    };

    this.CALCULA_ROTA = function() {
        if (!google) {
            dialog.MensagemDeErro("N&atilde;o foi poss&iacute;vel acessar o serviço do google.");
            return;
        }

        var myOptions = { zoom: 150, mapTypeId: google.maps.MapTypeId.ROADMAP };

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': _ENDERECO_DESTINO, 'region': 'BR' }, trataLocs);

        directionsService = new google.maps.DirectionsService();

        var request = {
            origin: _ENDERECO_ORIGEM,
            destination: _ENDERECO_DESTINO,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                _DISTANCIA_METROS = response.routes[0].legs[0].distance.value;
                _TEMPO = response.routes[0].legs[0].duration.value;

                _TXT_DISTANCIA_METROS = response.routes[0].legs[0].distance.text;
                _TXT_TEMPO = response.routes[0].legs[0].duration.text;

                _ATENCAO = response.routes[0].warnings.length == 0 ? '' : response.routes[0].warnings.length;
                _RESUMO = response.routes[0].summary;

                var result = _SUCESSO(_DISTANCIA_METROS, _TEMPO, _TXT_DISTANCIA_METROS, _TXT_TEMPO,
                    _ATENCAO, _RESUMO);
            }
        });
    };

    function trataLocs(results, status) {
        var _msg = '';

        if (status == google.maps.GeocoderStatus.OK) {

            if (results.length > 1) {

                var i, txt = '<select style="font-family:Verdana;font-size:8pt;width=550px;" onchange="mostraEnd(this.options[this.selectedIndex].text);">';
                _msg = 'O endereço exato não foi localizado - há ' + results.length.toString() + ' resultados aproximados.<br />';

                for (i = 0; i < results.length; i++) {
                    txt = txt + '<option value="' + i.toString() + '"';
                    
                    if (i == 0)
                        txt = txt + ' selected="selected"';
                        
                    txt = txt + '>' + results[i].formatted_address + '</option>';
                }

                txt += '</select>';
                _msg += txt;

                dialog.MensagemDeInformacao(_msg);
            }
        }
        else {
            dialog.MensagemDeErro('Erro no tratamento do endereço :<br /><b>' + status + '</b>');
        }
    }
}