var _timeOut_FaTh2 = 600000;

function Th2_Ajax() {
    var Url = '';
    var JsonData;
    var Sucesso;
    var Falha;
    var Mensagem = 'Aguarde. Em Processamento';
    var ObjetoProcessamento = Ext.getBody();
    var TrueFalse = true;
    var reportaErro = true;
    var _ocultaProcessamento = true;
    var Th2_Processamento = new ObjetoModal();

    this.setUrl = function(pUrl) {
        Url = pUrl;
    };

    this.setJsonData = function(pJsonData) {
        JsonData = pJsonData;
    };

    this.setSucesso = function(pSucesso) {
        Sucesso = pSucesso;
    };

    this.setFalha = function(pFalha) {
        Falha = pFalha;
    };

    this.setMensagem = function(pMensagem) {
        Mensagem = pMensagem;
    };

    this.setReportaErro = function(pErro) {
        reportaErro = pErro;
    };

    this.setMultiTarefa = function(pObjetoProcessamento) {
        if (pObjetoProcessamento)
            ObjetoProcessamento = pObjetoProcessamento;

    };

    this.ExibeDivProcessamento = function(pTrueFalse) {
        TrueFalse = pTrueFalse;
    };

    this.ocultaProcessamento = function(pOcultaProcessamento) {
        _ocultaProcessamento = pOcultaProcessamento;
    };

    this.objetoModal = function() {
        return Th2_Processamento;
    };
    
    this.Request = function() {
        if (TrueFalse) {
            Th2_Processamento.setObjetoModal(ObjetoProcessamento);
            Th2_Processamento.show();
        }

        Ext.Ajax.request({
            url: Url,
            method: 'POST',
            jsonData: JsonData,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            timeout: _timeOut_FaTh2,
            success: function(response, options) {
                var result = Sucesso(response, options);

                if (TrueFalse && _ocultaProcessamento)
                    Th2_Processamento.hide();
            },
            failure: function(response, options) {
                if (Falha)
                    var result = Falha(response, options);

                if (TrueFalse)
                    Th2_Processamento.hide();

                if (reportaErro) {
                    if (response.status == 0) {
                        dialog.MensagemDeErro('Falha de comunica&ccedil;&atilde;o com o serviço');
                    }
                    else {
                        var erro = Ext.decode(response.responseText);

                        if (!erro) {
                            dialog.MensagemDeErro(response.responseText);
                        }
                        else {
                            dialog.MensagemDeErro(erro.Message);
                        }
                    }
                }
            }
        });
    };
}

function Th2_Ajax_Async() {
    var Url = '';
    var JsonData;
    var Sucesso;
    var Falha;
    var Mensagem = 'Aguarde. Em Processamento';
    var ObjetoProcessamento = Ext.getBody();
    var TrueFalse = true;
    var objRequest;
    var _timeOut = 300000;
    
    this.setUrl = function(pUrl) {
        Url = pUrl;
    };

    this.setJsonData = function(pJsonData) {
        JsonData = pJsonData;
    };

    this.setSucesso = function(pSucesso) {
        Sucesso = pSucesso;
    };

    this.setFalha = function(pFalha) {
        Falha = pFalha;
    };

    this.setMensagem = function(pMensagem) {
        Mensagem = pMensagem;
    };

    this.ExibeDivProcessamento = function(pTrueFalse) {
        TrueFalse = pTrueFalse;
    };

    this.setTimeOut = function(ptimeOut) {
        _timeOut = (ptimeOut * 60) * 1000;
    };

    this.Request = function() {
        if (TrueFalse) {
            var Th2_Processamento = new ObjetoModal();

            Th2_Processamento.setObjetoModal(ObjetoProcessamento);
            Th2_Processamento.show();
        }

        objRequest = Ext.Ajax.request({
            url: Url,
            method: 'POST',
            jsonData: JsonData,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            timeout: _timeOut,
            success: function(response, options) {
                var result = Sucesso(response, options);

                if (TrueFalse)
                    Th2_Processamento.hide();
            },
            failure: function(response, options) {
                if (Falha)
                    var result = Falha(response, options);

                if (TrueFalse)
                    Th2_Processamento.hide();

                if (response.status == 0) {
                    dialog.MensagemDeErro('Falha de comunica&ccedil;&atilde;o com o serviço');
                }
                else {
                    var erro = Ext.decode(response.responseText);
                    dialog.MensagemDeErro(erro.Message);
                }
            }
        });
    };

    this.CancelaRequisicao = function() {
        Ext.Ajax.abort(0);
    };
}

function ObjetoModal() {
    var objModal = Ext.getBody();

    var divObj = document.createElement('div');

    divObj.style.zIndex = '90000';
    divObj.style.position = 'fixed';
    divObj.style.left = '0px';
    divObj.style.top = '0px';
    divObj.style.width = '100%';
    divObj.style.height = '100%';
    divObj.style.backgroundColor = '#FFF';
    divObj.style.MozOpacity = '0.4';
    divObj.style.opacity = '.40';
    divObj.style.filter = 'alpha(opacity=40)';

    var Th2_AlturaDaJanela = window.screen.availHeight;
    var Th2_LarguraDaJanela = window.screen.availWidth;

    var Th2_left = (Th2_LarguraDaJanela - 54) / 2;
    var Th2_top = (Th2_AlturaDaJanela - 55) / 2;

    var imgAjax = document.createElement('img');
    imgAjax.setAttribute('src', 'imagens/ajax-loader.gif');
    imgAjax.style.position = "fixed";
    imgAjax.style.zIndex = '90001';
    imgAjax.style.width = 50 + "px";
    imgAjax.style.height = 50 + "px";
    imgAjax.style.left = 50 + "%";
    imgAjax.style.top = 50 + "%";
    imgAjax.style.marginLeft = -25 + "px";
    imgAjax.style.marginTop = -25 + "px";
    imgAjax.style.backgroundColor = "transparent";

    this.setObjetoModal = function(pObjetoModal) {
        objModal = pObjetoModal;
    };

    this.show = function() {
        var xObjModal = objModal == Ext.getBody() ? Ext.getBody() : Ext.getCmp(objModal);

        divObj.style.width = xObjModal.getWidth() + 'px';
        divObj.style.height = xObjModal.getHeight() + 'px';

        if (objModal == Ext.getBody()) {
            divObj.style.top = objModal.getTop() + 'px';
            divObj.style.left = objModal.getLeft() + 'px';
        }
        else {
            divObj.style.top = xObjModal.getPosition()[1] + 'px';
            divObj.style.left = xObjModal.getPosition()[0] + 'px';
        }

        divProcessamento.style.visibility = 'visible';
        imgAjaxLoader.style.visibility = 'visible';
        
//document.body.appendChild(divObj);
//document.body.appendChild(imgAjax);
    };

    this.hide = function() {
        divProcessamento.style.visibility = 'hidden';
        imgAjaxLoader.style.visibility = 'hidden';

//document.body.removeChild(divObj);
//document.body.removeChild(imgAjax);
    };
}
