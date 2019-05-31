Ext.override(Ext.form.FormPanel, {
    enterToTab: true,
    autoFocus: true,
    initEvents: Ext.form.FormPanel.prototype.initEvents.createSequence(function () {
        if (this.autoFocus) {
            this.on('afterrender', function () {
                this.focusFirstEnabledField(true, 500);

            }, this)
        }
    }),
    focusFirstEnabledField: function () {
        var i = this.getFirstEnabledField();
        if (i) {
            i.focus.apply(i, arguments);
        }
        return i;
    },
    getFirstEnabledField: function () {
        var x = null;
        Ext.each(this.form.items.items, function (i) {
            if ((!i.hidden) && (!i.disabled)) {
                x = i;
                return false;
            }
        }, this)
        return x;
    },
    initFields: Ext.form.FormPanel.prototype.initFields.createSequence(function (ct, c) {
        this.form.items.each(function (f) {
            f.form = this.form;
            f.formPanel = this;

            var nf = this.form.items.itemAt(this.form.items.indexOf(f) + 1)
            if (nf) {
                f.nextField = nf
            }
            delete nf;

            var pf = this.form.items.itemAt(this.form.items.indexOf(f) - 1)
            if (pf) {
                f.priorField = pf
            }
            delete pf;

            if (this.enterToTab) {
                f.on('specialkey', function (field, e) {
                    if (e.getKey() == e.RETURN) {
                        var prop = (e.shiftKey ? 'priorField' : 'nextField');
                        if (field[prop]) {
                            field[prop].focus(true);
                        }
                    }
                }, this)
            }
        }, this)
    })
})

//************************Dialog *************************//

Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.QuickTips.init();

Ext.chart.Chart.CHART_URL = 'scripts/resources/charts.swf';

var TituloDaAplicacao = 'Doran ERP Software - M&oacute;dulo Comercial';
var _NOME_EMITENTE;
var _CONTATO_EMITENTE;
var _TELEFONE_EMITENTE;
var _ENDERECO_RESPOSTA_COMPRAS;

var _VENDEDOR;
var _ID_USUARIO;

function Dialog() {
    this.ERRO = false;
    this.ALERT = false;
    this.INFO = false;
    this.CONFIRM = false;

    this.MensagemDeErro = function (strMensagem, ControleBase) {
        Ext.Msg.show({
            title: TituloDaAplicacao,
            msg: strMensagem,
            buttons: { ok: true },
            icon: Ext.MessageBox.ERROR,
            animEl: ControleBase,
            maxWidth: 600
        })
    };

    this.MensagemDeInformacao = function (strMensagem, ControleBase) {
        Ext.Msg.show({
            title: TituloDaAplicacao,
            msg: strMensagem,
            buttons: { ok: true },
            icon: Ext.MessageBox.INFO,
            animEl: ControleBase,
            maxWidth: 600
        })
    };

    this.MensagemDeAlerta = function (strMensagem, ControleBase) {
        Ext.Msg.show({
            title: TituloDaAplicacao,
            msg: strMensagem,
            buttons: { ok: true },
            icon: Ext.MessageBox.WARNING,
            animEl: ControleBase,
            maxWidth: 600
        })
    };

    this.MensagemDeConfirmacao = function (strMensagem, ControleBase, Response) {
        Ext.Msg.show({
            title: TituloDaAplicacao,
            msg: strMensagem,
            buttons: { yes: true, no: true },
            icon: Ext.MessageBox.QUESTION,
            animEl: ControleBase,
            maxWidth: 600,
            fn: Response
        })
    };
}

var dialog = new Dialog();

//********************* Util ************************//

var divProcessamento = document.createElement('div');

divProcessamento.style.zIndex = '100000';
divProcessamento.style.position = 'fixed';
divProcessamento.style.left = '0px';
divProcessamento.style.top = '0px';
divProcessamento.style.width = '100%';
divProcessamento.style.height = '100%';
divProcessamento.style.backgroundColor = '#FFF';
divProcessamento.style.MozOpacity = '0.4';
divProcessamento.style.opacity = '.40';
divProcessamento.style.filter = 'alpha(opacity=40)';
divProcessamento.style.visibility = 'hidden';

var AlturaDaJanela = window.screen.availHeight;
var LarguraDaJanela = window.screen.availWidth;

var left = (LarguraDaJanela - 54) / 2;
var top = (AlturaDaJanela - 55) / 2;

var imgAjaxLoader = document.createElement('img');
imgAjaxLoader.setAttribute('src', 'scripts/resources/images/default/shared/large-loading.gif');
imgAjaxLoader.style.position = "fixed";
imgAjaxLoader.style.zIndex = '100001';
//imgAjaxLoader.style.width = 50 + "px";
//imgAjaxLoader.style.height = 50 + "px";
imgAjaxLoader.style.left = 50 + "%";
imgAjaxLoader.style.top = 50 + "%";
imgAjaxLoader.style.marginLeft = -25 + "px";
imgAjaxLoader.style.marginTop = -25 + "px";
imgAjaxLoader.style.backgroundColor = "transparent";
imgAjaxLoader.style.visibility = "hidden";

document.body.appendChild(divProcessamento);
document.body.appendChild(imgAjaxLoader);

function jsUtil() {
    this.IniciaSolicitacao = function () {
        divProcessamento.style.visibility = "visible";
        imgAjaxLoader.style.visibility = "visible";
    };

    this.FinalizaSolicitacao = function () {
        divProcessamento.style.visibility = "hidden";
        imgAjaxLoader.style.visibility = "hidden";
    };
}

var util = new jsUtil();

//********************* XML Document ***********************//

function criaObjetoXML(xmlString) {
    var xmlDocument;

    if (Ext.isIE) {
        xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
        xmlDocument.async = "false";
        xmlDocument.loadXML(xmlString);
    }
    else {
        var parser = new DOMParser();
        xmlDocument = parser.parseFromString(xmlString, "text/xml");
    }

    return xmlDocument;
}

function Parse_Encerramento_RNC(xsElement) {
    if (xsElement != undefined) {
        var ano = xsElement.substr(0, 4);
        var mes = xsElement.substr(8, 2);
        var dia = xsElement.substr(5, 2);
        var hora = xsElement.substr(11, 2);
        var minuto = xsElement.substr(14, 2);
        var segundo = xsElement.substr(17, 2);
        mes--;

        var data = new Date(ano, mes, dia, hora, minuto, segundo);

        mes++;
        mes += '';
        mes = mes.padLeft('0', 2);

        if (dia == 01 && mes == 01 && ano == 1901)
            return "";
        else
            return retorno = mes + '/' + dia + '/' + ano + ' ' + hora + ':' + minuto + ':' + segundo;
    }
    else
        return "";
}

function XMLParseDateTime(xsElement) {
    if (xsElement != undefined) {
        var ano = xsElement.substr(0, 4);
        var mes = xsElement.substr(8, 2);
        var dia = xsElement.substr(5, 2);
        var hora = xsElement.substr(11, 2);
        var minuto = xsElement.substr(14, 2);
        var segundo = xsElement.substr(17, 2);
        mes--;

        var data = new Date(ano, mes, dia, hora, minuto, segundo);

        mes++;
        mes += '';
        mes = mes.padLeft('0', 2);

        return retorno = mes + '/' + dia + '/' + ano + ' ' + hora + ':' + minuto + ':' + segundo;
    }
    else
        return "";
}

var combo_TB_USUARIO_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_USUARIO', 'LOGIN_USUARIO', 'NOME_USUARIO', 'EMAIL_USUARIO']),

    listeners: {
        load: function (_store, records, options) {
            if (records.length > 0) {
                if (Ext.getCmp('CB_USUARIO_CONTA')) {
                    Ext.getCmp('CB_USUARIO_CONTA').setValue(_ID_USUARIO);
                }
            }
        }
    }
});

function Carrega_Combo_Usuarios() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Carrega_Usuarios');
    _ajax.setJsonData({
        ADMIN_USUARIO: _ADMIN_USUARIO ? _ADMIN_USUARIO : 0,
        GERENTE_COMERCIAL: _GERENTE_COMERCIAL ? _GERENTE_COMERCIAL : 0,
        ID_USUARIO: _ID_USUARIO ? _ID_USUARIO : 1
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_USUARIO_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_USUARIO_TAREFAS_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_USUARIO', 'LOGIN_USUARIO', 'NOME_USUARIO', 'EMAIL_USUARIO']),

    listeners: {
        load: function (_store, records, options) {
            if (records.length > 0) {
                if (Ext.getCmp('FILTRO_USUARIO_EMAIL')) {
                    if (Ext.getCmp('FILTRO_USUARIO_EMAIL').getValue() == '') {
                        Ext.getCmp('FILTRO_USUARIO_EMAIL').setValue(_ID_USUARIO);
                    }
                }
            }
        }
    }
});

function Carrega_Combo_Usuarios_Tarefas() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Carrega_Usuarios_Tarefa');
    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO ? _ID_USUARIO : 0,
        ADMIN_USUARIO: _ADMIN_USUARIO ? _ADMIN_USUARIO : 0
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_USUARIO_TAREFAS_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function XMLParseDate(xsElement) {
    if (!xsElement)
        return "";

    var tam = xsElement;

    if (tam.length > 10) {
        if (xsElement != undefined) {
            var ano = xsElement.substr(0, 4);
            var mes = xsElement.substr(8, 2);
            var dia = xsElement.substr(5, 2);
            mes--;

            var data = new Date(ano, mes, dia);

            mes++;
            mes += '';
            mes = mes.padLeft('0', 2);

            return retorno = mes + '/' + dia + '/' + ano;
        }
        else
            return "";
    }
    else if (tam.length == 10) {
        var ano = xsElement.substr(6, 4);
        var mes = xsElement.substr(0, 2);
        var dia = xsElement.substr(3, 2);
        mes--;

        var data = new Date(ano, mes, dia);

        mes++;
        mes += '';
        mes = mes.padLeft('0', 2);

        return retorno = mes + '/' + dia + '/' + ano;
    }
    else
        return "";
}

function descricao_pasta_email(val, _metadata, _record) {
    var _nao_lidos = "";

    if (Math.floor(_record.data.NAO_LIDOS) > 0) {
        _nao_lidos = "<b>&nbsp;(" + _record.data.NAO_LIDOS + ")</b>";
    }

    var x = "<span style='background-color: " + _record.data.COR_FUNDO + "; color: " + _record.data.COR_LETRA +
                    "; font-family: tahoma;'>" + _record.data.DESCRICAO_PASTA + "</span>" +
                    _nao_lidos;

    return x;
}

function descricao_subpasta_email(_record) {
    var _nao_lidos = "";

    if (Math.floor(_record.NAO_LIDOS) > 0) {
        _nao_lidos = "<b>&nbsp;(" + _record.NAO_LIDOS + ")</b>";
    }

    var x = "<span style='background-color: " + _record.COR_FUNDO + "; color: " + _record.COR_LETRA +
                    "; font-family: tahoma;'>" + _record.DESCRICAO_PASTA + "</span>" +
                    _nao_lidos;

    return x;
}

function Lido(val) {
    if (val == 1) {
        return "<img src='imagens/icones/user_ok_16.gif' style='cursor: pointer;' title='Marcar como n&atilde;o lido' />";
    }
    else {
        return "<span style='cursor: pointer;' title='Marcar como n&atilde;o lido'>&nbsp;&nbsp;</span>";
    }
}

function aberturaAnexos(val, metadata, record) {
    if (record.data.ID_ATTACHMENT > 0) {
        return "<span style='cursor: pointer;'>" + val + "</span>";
    }

    return val;
}

function Ultima_Compra_Cliente(val) {
    var x = XMLParseDate(val);

    return x == "01/01/1901" ? "" : x;
}

function Nome_Separador(val, metadata, record) {
    var index = SEPARADOR_STORE.find('ID_SEPARADOR', val);

    if (index > -1)
        return SEPARADOR_STORE.getAt(index).data.NOME_SEPARADOR;
    else
        return val;
}

function formatDate(value) {
    try {
        return value ? value.dateFormat('d/m/Y') : '';
    }
    catch (e) {
        return XMLParseDate(value);
    }
}

function TrataTipoDesconto(val) {
    if (val == 0)
        return "%";
    else
        return "Valor";
}

function FormataValor(val) {
    val = val + '';
    val = val.replace(',', '.');

    return Ext.util.Format.brMoney(val);
}

function FormataValor2(val) {
    return Ext.util.Format.brMoney(val);
}

function FormataPercentual_2(val) {
    var _valor = Ext.util.Format.number(val, '000.00');
    _valor += '';
    _valor = _valor.replace('.', ',');
    return _valor + '%';
}

function aberturaAnexos(val, metadata, record) {
    if (record.data.ID_ATTACHMENT > 0) {
        return "<span style='cursor: pointer;'>" + val + "</span>";
    }

    return val;
}

function FormataPercentual(val) {
    val = val + '';
    val = val.replace(',', '.');

    var _valor = Ext.util.Format.number(val, '000.00');
    _valor += '';
    _valor = _valor.replace('.', ',');
    return _valor + '%';
}

function FormataValor_4(val) {
    var _valor = Ext.util.Format.number(val, '000,000.0000');
    _valor += '';
    _valor = _valor.replace('.', ',');
    //_valor = _valor.replace(',', '.');
    return 'R$ ' + _valor;
}

function FormataValor_Custo(val) {
    var _valor = Ext.util.Format.number(val, '000,000.0000');
    _valor += '';
    _valor = _valor.replace('.', ',');

    return parseFloat(_valor) > 0.0000 ?
        "<span style='color: darkred;'>R$ " + _valor + "</span>" :
        "R$ " + _valor;
}

function FormataPeso(val) {
    var _valor = Ext.util.Format.number(val, '000,000.000');
    _valor += '';
    _valor = _valor.replace('.', ',');
    _valor = _valor.replace(',', '.');

    return _valor;
}

function FormataDesconto(val, _metadata, _record) {
    if (_record.data.TIPO_DESCONTO == 0)
        return FormataPercentual(val);
    else
        return FormataValor(val);
}

function FormataDescontoCompras(val, _metadata, _record) {
    if (_record.data.TIPO_DESCONTO_ITEM_COMPRA == 0)
        return FormataPercentual(val);
    else
        return FormataValor(val);
}


function Link_Attachment(val) {
    if (val == 1) {
        return "<span style='width: 100%; background-color: green; color: #FFFFFF; cursor: pointer;' title='Clique para baixar o anexo'>&nbsp;" + val + "&nbsp;</span>";
    }
    else if (val > 1) {
        return "<span style='width: 100%; background-color: #99CCFF; color: navy; cursor: pointer;' title='Clique para abrir a lista de anexos'>&nbsp;" + val + "&nbsp;</span>";
    }
    else if (val == 0) {
        return val;
    }
}

function Status_Ordem_Compra(val, metadata, record) {
    if (val == 0) {
        return "";
    }
    else {
        return "<span style='width: 100%; background-color: " + record.data.COR_STATUS_PEDIDO_COMPRA + "; color: " + record.data.COR_FONTE_STATUS_PEDIDO_COMPRA + ";'>" + record.data.DESCRICAO_STATUS_PEDIDO_COMPRA + "</span>";
    }
}

function statusRnc(val, metadata, record) {
    if (val == 0 || val == '') {
        return "";
    }
    else {
        return "<span style='width: 100%; background-color: " + record.data.COR_FUNDO + "; color: " + record.data.COR_LETRA + ";'>" + record.data.DESCRICAO_STATUS + "</span>";
    }
}

function precoAbaixo(val, metadata, record) {
    if (record.data.PRECO_VENDA_ABAIXO) {
        return record.data.PRECO_VENDA_ABAIXO == 1 ?
        "<span style='width: 100%; color: red;' title='Pre&ccedil;o abaixo da margem m&iacute;nima'>" + FormataValor_4(val) + "</span>" :
        FormataValor_4(val);
    }
    else {
        return FormataValor_4(val);
    }
}

function status_rnc_item_compra(val, metadata, record) {
    return val;
}

function Status_Cotacao(val, _metadata, record) {
    if (record.data.COTACAO_ENVIADA == 1) {
        if (record.data.COTACAO_VENCEDORA) {
            if (record.data.COTACAO_VENCEDORA == 0) {
                return "<span style='font-family: tahoma; width: 100%; background-color: #ffff66; color: #710000;' " +
                    "title='Somente depois que o fornecedor responder, ser&aacute; poss&iacute;vel alterar e transformar em pedido'>" +
                    "AGUARDANDO RESPOSTA</span>";
            }
        }

        if (val == 0)
            return "<span style='font-family: tahoma; width: 100%; background-color: #ffff66; color: #710000;' " +
            "title='Somente depois que o fornecedor responder, ser&aacute; poss&iacute;vel alterar e transformar em pedido'>AGUARDANDO RESPOSTA</span>";
        else if (val == 1)
            return "<span style='font-family: tahoma; width: 100%; background-color: #009933; color: #ffffcc;'>COTA&Ccedil;&Atilde;O RESPONDIDA</span>";
        else if (val == 2)
            return "<span style='font-family: tahoma; width: 100%; background-color: #000051; color: #ffff66;'>SERVI&ccedil;O FECHADO</span>";
    }
    else {
        return "<span style='font-family: tahoma; width: 100%; color: red;' " +
                    "title='Somente depois que o fornecedor responder, ser&aacute; poss&iacute;vel alterar e transformar em pedido'>" +
                    "N&Atilde;O ENVIADA</span>";
    }
}

function TrataCombo01(val) {
    if (val == 1)
        return "Sim";
    else
        return "N&atilde;o";
}

function TrataCombo_01(val) {
    if (val == 1)
        return "<span style='color: navy;'>Sim</span>";
    else
        return "<span style='color: red;'>N&atilde;o</span>";
}

function EntregaAtrasada(val, _metadata, _record) {
    if (_record.data.ATRASADA == "1" &&
    (_record.data.STATUS_ESPECIFICO != 3 && _record.data.STATUS_ESPECIFICO != 4))
        return "<span style='width: 100%; color: red;' title='Entrega atrasada'>" + formatDate(val) + "</span>";
    else
        return formatDate(val);
}

// webmail

function pastaEmail(val, metadata, record) {
    return "<span style='width: 100%; background-color: " + record.data.COR_FUNDO + "; color: " + record.data.COR_LETRA + ";'>" + record.data.DESCRICAO_PASTA + "</span>";
}

function Prioridade_Email(val) {
    if (val == 0) {
        return "Baixa";
    }
    else if (val == 1) {
        return "<span style='color: darkblue;'>Normal</span>";
    }
    else if (val == 2) {
        return "<span style='color: darkred;'>Alta</span>";
    }
}

function Mensagem_Lida(val, metada, record) {
    if (record.data.MESSAGE_READ == 0)
        return "<span style='font-weight: bold;'>" + val + "</span>";
    else
        return val;
}

function UnidadeBytes(val) {
    var retorno = '';

    if ((val / 1000000000) > 0.99) {
        var x = VALOR / 1000000000;
        retorno = x + ' GB';
    }
    else if ((val / 1000000) > 0.99) {
        var x = Math.round(val / 1000000);
        retorno = x + ' MB';
    }
    else if ((val / 1000) > 0.99) {
        var x = Math.round(val / 1000);
        retorno = x + ' KB';
    }
    else {
        retorno = val > 1 ? val + " Bytes" : val + " Byte";
    }

    return retorno;
}

function Remetente(val, metadata, record) {
    if (val.trim().length == 0)
        return Mensagem_Lida(record.data.FROM_ADDRESS, metadata, record);
    else
        return Mensagem_Lida(val, metadata, record);
}

function Data_Hora_nao_lido(val, metadata, record) {
    if (record.data.MESSAGE_READ == 1) {
        return XMLParseDateTime(val);
    }
    else {
        return "<b>" + XMLParseDateTime(val) + "</b>";
    }
}

function Favorito(val) {
    if (val == 1) {
        return "<img src='imagens/icones/on.png' style='cursor: pointer;' title='Importante' />";
    }
    else {
        return "<img src='imagens/icones/off.png' style='cursor: pointer;' title='Marcar como importante' />";
    }
}

function Spam(val, metadata, record) {
    if (val == 1) {
        return "<img src='imagens/icones/rec_16.gif' style='cursor: pointer;' title='SPAM - Clique para desmarcar' />";
    }
    else {
        if (record.data.INBOX == 1) {
            return "<img src='imagens/icones/off.png' style='cursor: pointer;' title='Marcar como SPAM' />";
        }
        else {
            return "<img src='imagens/icones/off.png'/>";
        }
    }
}
//////////////

function apontamentos_follow_up(val, _metadata, _record) {

    var _apontamentos = Math.floor(_record.data.FOLLOW_UP_PEDIDO) + Math.floor(_record.data.FOLLOW_UP_ITEM_PEDIDO);

    if (Math.floor(_record.data.FOLLOW_UP_ITEM_PEDIDO) > 0) {
        return "<span style='width: 100%; color: darkred;' title='Pedido [" + _record.data.FOLLOW_UP_PEDIDO + " Apontamento(s)]" +
            "\n" + "Item do pedido [" + _record.data.FOLLOW_UP_ITEM_PEDIDO + " Apontamento(s)]'>" + _apontamentos + " Apontamento(s)</span>";
    }
    else {
        return "<span style='width: 100%; color: darkred;' title='Pedido [" + _record.data.FOLLOW_UP_PEDIDO + " Apontamento(s)]'>" +
            _apontamentos + " Apontamento(s)</span>"; ;
    }
}

function EntregaAtrasadaOrcamento(val, _metadata, _record) {
    if (_record.data.ATRASADA == "1" && _record.data.NUMERO_PEDIDO_VENDA == 0)
        return "<span style='width: 100%; color: red;' title='Entrega atrasada'>" + formatDate(val) + "</span>";
    else
        return formatDate(val);
}

function EntregaAtrasadaCompra(val, _metadata, _record) {
    if (_record.data.ATRASADA == "1" && _record.data.STATUS_ESPECIFICO_ITEM_COMPRA != 4)
        return "<span style='width: 100%; color: red;' title='Entrega atrasada'>" + formatDate(val) + "</span>";
    else
        return formatDate(val);
}

function EntregaAtrasadaCompra1(val, _metadata, _record) {
    var x = formatDate(val);

    return x == '01/01/1901' ? "" : x;
}

function status_pedido(val, _metadata, _record) {
    var x = "<span style='background-color: " + _record.data.COR_STATUS + "; color: " + _record.data.COR_FONTE_STATUS +
                    "; font-family: tahoma;'>" + _record.data.DESCRICAO_STATUS_PEDIDO + "</span>";

    return x;
}

function status_pedido_compra(val, _metadata, _record) {
    var x = "<span style='background-color: " + _record.data.COR_STATUS_PEDIDO_COMPRA + "; color: " + _record.data.COR_FONTE_STATUS_PEDIDO_COMPRA +
                    "; font-family: tahoma;'>" + _record.data.DESCRICAO_STATUS_PEDIDO_COMPRA + "</span>";

    return x;
}

function status_rnc(val, _metadata, _record) {
    var x = "<span style='background-color: " + _record.data.COR_FUNDO + "; color: " + _record.data.COR_LETRA +
                    "; font-family: tahoma;'>" + _record.data.DESCRICAO_STATUS + "</span>";

    return x;
}

function Verifca_Compras(val, metadata, record) {
    if (parseFloat(record.data.ITEM_A_COMPRAR) > 0.00 && record.data.ID_USUARIO_ITEM_A_COMPRAR == _ID_USUARIO) {
        return "<span style='width: 100%; background-color: navy; color: #FFFFFF;' title='Item marcado para comprar'>" + val + "</span>";
    }
    else {
        return val;
    }
}

function possui_Certificado(val, metadata, record) {
    if (record.data.CERTIFICADO > 0) {
        return "<span style='width: 100%; background-color: #FF3300; color: #FFFFFF;' title='Item com Certificado(s)'>" + val + "</span>";
    }
    else {
        return val;
    }
}

function Verifca_Beneficiamento(val, metadata, record) {
    if (parseFloat(record.data.ITEM_A_BENEFICIAR) == 1) {
        return "<span style='width: 100%; background-color: #FFCC00; color: navy;' title='Item marcado para beneficiar'>" + val + "</span>";
    }
    else {
        if (parseFloat(record.data.REGISTRO_BENEFICIAMENTO) == 1) {
            return "<span style='width: 100%; background-color: navy; color: #FFCC00;' title='Item com beneficiamento cadastrado'>" + val + "</span>";
        }
        else {
            return val;
        }
    }
}

function Analise(val) {
    if (val == 'Obs Cadastro')
        return "<span style='width: 100%; height: 100%; background-color: #660066; color: #FFFFFF;'>Obs Cadastro</span>";
    else if (val == 'Cliente Bloqueado')
        return "<span style='width: 100%; height: 100%; background-color: #660066; color: #FFFFFF;'>Cliente Bloqueado</span>";
    else if (val == 'Primeira Compra')
        return "<span style='width: 100%; height: 100%; background-color: #000066; color: #FFFFFF;'>Primeira Compra</span>";
    else if (val == 'Inatividade')
        return "<span style='width: 100%; height: 100%; background-color: #339966; color: #FFFFFF;'>Inatividade</span>";
    else if (val == 'Condicao Pagamento')
        return "<span style='width: 100%; height: 100%; background-color: #990000; color: #FFFFFF;'>Condi&ccedil;&atilde;o de<br />Pagamento</span>";
    else if (val == 'Margem Minima')
        return "<span style='width: 100%; height: 100%; background-color: #FF3300; color: #FFFFFF;'>Margem M&iacute;nima</span>";
    else if (val == 'Limite Excedido')
        return "<span style='width: 100%; height: 100%; background-color: #CCFFFF; color: #000000;'>Limite de Cr&eacute;dito<br />Excedido</span>";
    else if (val == 'Inadimplencia')
        return "<span style='width: 100%; height: 100%; background-color: #993300; color: #FFFFFF;'>Inadimpl&ecirc;ncia</span>";
    else if (val == 'Faturamento Minimo')
        return "<span style='width: 100%; height: 100%; background-color: #669999; color: #FFFFFF;'>Faturamento M&iacute;nimo</span>";
    else if (val == 'Imposto')
        return "<span style='width: 100%; height: 100%; background-color: #333333; color: #FFFFFF;'>Imposto</span>";
    else if (val == 'Analise Estoque')
        return "<span style='width: 100%; height: 100%; background-color: #CC99FF; color: #000000;'>An&aacute;lise de Estoque</span>";
    else if (val == 'Abatimento Futuro')
        return "<span style='width: 100%; height: 100%; background-color: #993366; color: #FFFF00;'>Abatimento(s) Futuro(s) por Devolu&ccedil;&atilde;o</span>";
    else if (val == 'Limite Cadastrado no Cliente')
        return "<span style='width: 100%; height: 100%; background-color: #FFFFFF; color: red;'>Limite de cr&eacute;dito cadastrado no cliente</span>";
}

function FormataPercentualMargem(val, _metadata, _record) {
    var margem_produto = parseFloat(_record.data.MARGEM_CADASTRADA_PRODUTO);
    var margem_pedido = parseFloat(val);

    if (val == "")
        margem_pedido = 0;

    if (margem_pedido < margem_produto)
        return "<span style='color: red;' title='Margem M&iacute;nima: " + FormataPercentual_2(margem_produto) + "'>" + FormataPercentual(val) + "</span>";
    else
        return FormataPercentual(val);
}

function FormataPercentualComissao(val, _metadata, _record) {
    if (val < .01)
        return "<span style='color: red;'>" + FormataPercentual(val) + "</span>";
    else
        return FormataPercentual(val);
}

var TB_UF_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_UF', 'DESCRICAO_UF', 'ALIQ_ICMS_UF', 'ALIQ_INTERNA_ICMS']
       )
});

function TB_UF_CARREGA_COMBO() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_UF.asmx/Carrega_UF_ORCAMENTO');
    _ajax.setJsonData({ ID_UF_EMITENTE: _UF_EMITENTE, ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        TB_UF_STORE.loadData(criaObjetoXML(result.Query), false);

        if (Ext.getCmp('ID_UF_ORCAMENTO')) {

            Ext.getCmp('ID_UF_ORCAMENTO').setValue(result.ID_UF_EMITENTE);
        }

        _ID_UF_EMITENTE = result.ID_UF_EMITENTE;
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var TB_MUNICIPIO_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_UF', 'ID_MUNICIPIO', 'NOME_MUNICIPIO']
       )
});

function TB_MUNICIPIO_CARREGA_COMBO(ID_UF) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_UF.asmx/Carrega_MUNICIPIO');
    _ajax.setJsonData({
        ID_UF: ID_UF,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        TB_MUNICIPIO_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

String.prototype.padLeft = function (character, number) {
    var a = this.split('');

    while (a.length < number) {
        a.unshift(character);
    }

    return a.join('');
}

String.prototype.padRight = function (n, pad) {
    t = this;
    if (n > this.length) {
        for (i = 0; i < n - this.length; i++) {
            t += pad;
        }
    }
    return t;
}

String.prototype.startsWith = function (str) {
    return (this.indexOf(str, 0) == 0) ? true : false;
}

String.prototype.endsWith = function (str) {
    return (this.match(str + "$") == str)
}

String.prototype.replaceAll = function (de, para) {
    var str = this;
    var pos = str.indexOf(de);

    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }

    return (str);
}

//Array.prototype.remove = function (from, to) {
//    var rest = this.slice((to || from) + 1 || this.length);
//    this.length = from < 0 ? this.length + from : from;
//    return this.push.apply(this, rest);
//}

Ext.override(Ext.chart.Chart, {
    onDestroy: function () {
        Ext.chart.Chart.superclass.onDestroy.call(this);
        this.bindStore(null);
        var tip = this.tipFnName;
        if (!Ext.isEmpty(tip)) {
            //delete window[tip];
        }
    }
});

function Spacers(numero) {
    var spacer = '[';
    for (var i = 0; i < numero; i++) {
        spacer += "{ xtype: 'tbspacer' },";
    }

    spacer = spacer.substr(0, spacer.length - 1) + "]";

    var retorno = eval(spacer + ';');
    return retorno;
}

function MontaLinkAnexo(val) {
    var x = "<a href='" + val + "' target='_blank'>" + val + "</a>";
    return x;
}

function Diferenca_Dias_Entre_Datas(data1, data2) {
    try {
        var dia = 1000 * 60 * 60 * 24;

        if (Math.ceil((data2.getElapsed(data1)) / (dia)) > 0)
            return Math.ceil((data2.getElapsed(data1)) / (dia));
        else
            return 0;
    }
    catch (e) {
        return 0;
    }
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    try {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
    }
    catch (e) {
        return undefined;
    }
    return undefined;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
//********************* JSON Data **************************//

var tabelas_FaTh2_store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_TABELA', 'DESCRICAO_TABELA']
       )
});


var _ajax = new Th2_Ajax();
_ajax.setUrl('servicos/WSLogin.asmx/TabelasDoSistema');
_ajax.ExibeDivProcessamento(false);

var _sucess = function (response, options) {
    var result = Ext.decode(response.responseText).d;
    tabelas_FaTh2_store.loadData(criaObjetoXML(result), false);
};

_ajax.setSucesso(_sucess);
_ajax.Request();

function TH2_CARREGA_USUARIOS() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/WSLogin.asmx/CarregaComboUsuarios');

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        combo_TB_USUARIOS_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_USUARIOS_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_USUARIO', 'LOGIN_USUARIO']
       )
});

function TH2_CARREGA_UF() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/WSLogin.asmx/CarregaComboUF');

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        combo_TB_UF_Store.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var combo_TB_UF_Store = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_UF', 'DESCRICAO_UF']
       )
});

////******************* Aproveitamento do conteudo central do Layout em todos os browsers

function AlturaDoPainelDeConteudo(alturaFormulario) {
    var alturaConteudo = Ext.getCmp('tabConteudo') ? Ext.getCmp('tabConteudo').getHeight() : document.body.scrollHeight;

    var alturaApropriada = alturaConteudo - alturaFormulario;

    return alturaApropriada;
}

var casasDecimais_Qtde = 0;

var _ajax = new Th2_Ajax();
_ajax.setUrl('servicos/WSLogin.asmx/CasasDecimaisQtde');
_ajax.ExibeDivProcessamento(false);

var _sucess = function (response, options) {
    var result = Ext.decode(response.responseText).d;
    casasDecimais_Qtde = result;
};

_ajax.setSucesso(_sucess);
_ajax.Request();

function FormataQtde(val) {
    val = val + '';
    val = val.replace(',', '.');

    var qtde = '.' + ''.padRight(casasDecimais_Qtde, '0');

    var formato = casasDecimais_Qtde > 0 ?
         Ext.util.Format.number(val, qtde) :
         Ext.util.Format.number(val, '0');

    formato = formato.replace('.', ',');

    return formato;
}

function Saldo_Estoque_Local(val) {
    if (val > 0.000) {
        return '<span style="color:darkblue;">' + FormataQtde(val) + '</span>';
    } else if (val < 0.000) {
        return '<span style="color:red;">' + FormataQtde(val) + '</span>';
    }
    return val;
}

function Saldo_Estoque(val, metadata, record) {
    var saldo = record.data.ENTRADA_ESTOQUE - record.data.SAIDA_ESTOQUE;

    if (saldo > 0.000)
        return "<span style='width: 100%; color: blue;'>" + FormataQtde(saldo) + "</span>";
    else if (saldo < 0.000)
        return "<span style='width: 100%; color: red;'>" + FormataQtde(saldo) + "</span>";
    else
        return FormataQtde(saldo);
}

function Ajusta_Preco_Cheio(val, metadata, record) {

    var retorno = 0;

    if (record.data.PRECO_FINAL_FORNECEDOR == record.data.PRECO_ITEM_COMPRA
        && record.data.VALOR_DESCONTO_ITEM_COMPRA > 0.00
        && record.data.TIPO_DESCONTO_ITEM_COMPRA == 0) {
        retorno = record.data.PRECO_FINAL_FORNECEDOR * (1 - (record.data.VALOR_DESCONTO_ITEM_COMPRA / 100));
    }
    else if (record.data.PRECO_FINAL_FORNECEDOR == record.data.PRECO_ITEM_COMPRA
        && record.data.VALOR_DESCONTO_ITEM_COMPRA > 0.00
        && record.data.TIPO_DESCONTO_ITEM_COMPRA == 1) {
        retorno = record.data.PRECO_FINAL_FORNECEDOR - record.data.VALOR_DESCONTO_ITEM_COMPRA;
    }
    else {
        retorno = val;
    }

    return FormataValor_4(retorno);
}

function QtdeRecebida(val, metadata, record) {
    if (val > 0) {
        if (parseFloat(val) < parseFloat(record.data.QTDE_ITEM_COMPRA)) {
            var _restante = record.data.QTDE_ITEM_COMPRA - val;
            return "<span style='width: 100%; color: red;' title='Qtde. Faltante: " + _restante + "'>" + FormataQtde(val) + "</span>";
        }
        else
            return "<span style='width: 100%; color: blue;' title='Recebido Total'>" + FormataQtde(val) + "</span>";
    }
    else
        return FormataQtde(val);
}

function Distancia_Metros(val) {
    var km = (val / 1000).toFixed(3);

    km += " KM";
    km = km.replace(".", ",");

    return km;
}

function Consulta_Ordens_Compra(val, metadata, record) {
    if (record.data.ITENS_COMPRA_ASSOCIADOS > 0 || val > 0) {
        var _link = "<span style='font-size: 9pt; cursor: pointer; color: #FF0000;'>Consulte</span>";

        return _link;
    }
    else {
        return 0;
    }
}

function Consulta_Itens_Venda(val, metadata, record) {
    if (record.data.ITENS_ASSOCIADOS > 0) {
        var _link = "<span style='font-size: 9pt; cursor: pointer; color: #FF0000;'>Consulte</span>";

        return _link;
    }
    else {
        return val;
    }
}

function ITEM_MARCADO_FATURAR(val, _metadata, _record) {
    return (_record.data.ITEM_A_FATURAR == 1 && _record.data.ID_USUARIO_ITEM_A_FATURAR == _ID_USUARIO) ?
                "<span style='background-color: #0000FF; color: #CCFFFF; font-weight: bold;' title='Item marcado para faturar'>" + FormataQtde(val) + "</span>" :
                FormataQtde(val);
}

function Tempo_Entrega(val) {
    var retorno;
    var minutos;
    var horas;
    var dias;

    var x = Math.floor(val / 60);

    if (x < 60) {
        if (val % 60 > 0) {
            x++;
        }
        retorno = "00:" + (x + "").padLeft('0', 2) + " Min(s)";
    }

    if (x >= 60) {
        horas = Math.floor(val / 60);
        minutos = val % 60;

        if (horas > 24) {
            dias = Math.floor(horas / 24);
            horas = horas % 24;
        }

        if (dias) {
            retorno = (dias + "").padLeft('0', 2) + " dia(s) " + (horas + "").padLeft('0', 2) + ":" + (minutos + "").padLeft('0', 2) + " Hora(s)";
        }
        else {
            retorno = (horas + "").padLeft('0', 2) + ":" + (minutos + "").padLeft('0', 2) + " Hora(s)";
        }
    }

    return retorno;
}

Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }

    return false;
}

Date.prototype.diaUtil = function () {
    var diasUteis = [1, 2, 3, 4, 5];

    var retorno = this;

    var diaSemana = this.getDay();

    while (!diasUteis.contains(diaSemana)) {
        retorno = retorno.add(Date.DAY, 1);
        diaSemana = retorno.getDay();
    }

    return retorno;
};

var _dataMenu = [['Ciclistas', 'Cadastros - Ciclistas'], 
                ['Clientes', 'Cadastros - Clientes'],
                ['Condi&ccedil;&atilde;o de Pagamento', 'Cadastros - Condição de Pagamento'],
                ['Custos de Venda', 'Cadastro - Custos de Venda'],
                ['Empresa / Filial', 'Cadastro - Empresa / Filial'],
                ['Limite de Cr&eacute;dito', 'Cadastros - Limite de Crédito'],
                ['Regi&atilde;o de Vendas', 'Cadastros - Região de Vendas'],
                ['Servi&ccedil;os', 'Cadastros - Serviços'],
                ['Status de Servi&ccedil;o', 'Cadastros - Status de Serviço'],
                ['Status de Servi&ccedil;o X Usu&aacute;rio', 'Cadastros - Status de Serviço X Usuário'],
                ['Vendedores', 'Cadastros - Vendedores'],
                ['Calend&aacute;rio', 'Cadastros - Calend&aacute;rio'],

                ['Or&ccedil;amento de Vendas', 'Orçamentos - Orçamento de Vendas'],
                ['Matriz de Or&ccedil;amentos', 'Orçamentos - Matriz de Orçamentos'],
                ['Estat&iacute;sticas', 'Orçamentos - Estatísticas'],

                ['Servi&ccedil;os de Vendas', 'Pedidos - Serviço de Vendas'],
                ['Estat&iacute;sticas / Qualidade', 'Pedidos - Estatísticas / Qualidade'],
                ['Auditoria de Servi&ccedil;o', 'Pedidos - Auditoria de Serviço'],
                ['Matriz de Servi&ccedil;o', 'Pedidos - Matriz de Serviço'],
                ['Posi&ccedil;&atilde;o de Estoque', 'Pedidos - Posição de Estoque'],
                ['Relat&oacute;rio de Vendas', 'Pedidos - Relatório de Vendas'],
                ['Notas fiscais', 'Pedidos - Notas fiscais'],

                ['Contas a Pagar / Receber', 'Financeiro - Contas a Pagar / Receber'],
                ['Plano de Contas', 'Financeiro - Plano de Contas'],
                ['Banco', 'Financeiro - Banco'],
                ['Conta Corrente', 'Financeiro - Conta Corrente'],

                ['Status de Pedido de Compra', 'Compras - Status de Pedido de Compra'],
                ['Cota&ccedil;&otilde;es', 'Compras - Cotações'],
                ['Pedido de Compra', 'Compras - Pedido de Compra'],
                ['Ultimas Vendas/Compras', 'Compras - Ultimas Vendas/Compras'],
                ['Estat&iacute;sticas de Compras', 'Compras - Estatísticas de Compras'],
                ['Matriz (Pedido de Compra)', 'Compras - Matriz (Pedido de Compra)'],

                ['Direitos por Usu&aacute;rio', 'Configurações - Direitos por Usuário'],
                ['Configura&ccedil;&otilde;es de Vendas', 'Configurações - Configurações de Vendas'],

                ['Auditoria de Uso', 'Auditoria - Auditoria de Uso'],
                ['Log de Erros', 'Auditoria - Log de Erros']];

var _cores = new Array();

_cores[0] = "0xFF0000";
_cores[1] = "0x6666FF";
_cores[2] = "0x009933";
_cores[3] = "0x990099";
_cores[4] = "0x0033CC";
_cores[5] = "0xFFCC00";
_cores[6] = "0x800000";
_cores[7] = "0x66FFFF";
_cores[8] = "0x669999";
_cores[9] = "0x009900";
_cores[10] = "0x663300";
_cores[11] = "0xFF0066";
_cores[12] = "0x00FFFF";
_cores[13] = "0xFF9900";
_cores[14] = "0x006600";
_cores[15] = "0xFFCC66";
_cores[16] = "0x66FF66";
_cores[17] = "0x00CCFF";
