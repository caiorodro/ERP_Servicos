var Th2_LimiteDeLinhasPaginacao = 25;

function Th2_PagingToolbar() {
    var Th2_LimiteDeLinhasPaginacao_Interna = Th2_LimiteDeLinhasPaginacao;
    var start = 0;
    var limit = Th2_LimiteDeLinhasPaginacao_Interna;
    var totalDePaginas = 1;
    var totalCount = 0;
    var fieldUrl = "";
    var fieldJsonData;
    var fieldStore;
    var paginaAtual = 0;
    var instrucoes_pageChange = undefined;
    var _exibeProcessamento = true;
    var _ultimaPagina = false;
    var falha;
    var _acaoSucccess;

    this.setLinhasPorPagina = function (pLimit) {
        Th2_LimiteDeLinhasPaginacao_Interna = pLimit;
        fieldTh2_PagingToolbar.items.items[44].setValue(pLimit);
    };

    this.getLinhasPorPagina = function () {
        return Th2_LimiteDeLinhasPaginacao_Interna;
    };

    this.setUrl = function (pUrl) {
        fieldUrl = pUrl;
    };

    this.getUrl = function () {
        return fieldUrl;
    };

    this.setParamsJsonData = function (pJsonData) {
        fieldJsonData = pJsonData;
    };

    this.setStore = function (pStore) {
        fieldStore = pStore;
    };

    this.getStore = function () {
        return fieldStore;
    };

    this.doRequest = function () {
        if (_ultimaPagina) {
            if (totalCount > 0) {
                UltimaPagina();
            }
            else {
                PrimeiraPagina();
            }
        }
        else {
            PrimeiraPagina();
        }
    };

    this.Desabilita = function () {
        fieldTh2_PagingToolbar.disable();
    };

    this.Habilita = function () {
        fieldTh2_PagingToolbar.enable();
    };

    this.onPageChange = function (pInstrucoes_pageChange) {
        instrucoes_pageChange = pInstrucoes_pageChange;
    };

    this.exibeProcessamento = function (pExibe) {
        _exibeProcessamento = pExibe;
    };

    this.carregarSempreUltimaPagina = function (pUltimaPagina) {
        _ultimaPagina = pUltimaPagina;

        fieldTh2_PagingToolbar.items.items[54].checked = _ultimaPagina;
        fieldTh2_PagingToolbar.items.items[54].setVisible(_ultimaPagina);
    };

    this.CarregaPaginaAtual = function () {
        doRequestPaginaAtual(paginaAtual);
    };

    this.setFalha = function (pFalha) {
        falha = pFalha;
    };

    this.acaoSucccess = function (pValue) {
        _acaoSucccess = pValue;
    };

    function doRequestPaginaAtual(paginaDestino) {
        start = (paginaDestino * Th2_LimiteDeLinhasPaginacao_Interna) - Th2_LimiteDeLinhasPaginacao_Interna;
        limit = (paginaDestino * Th2_LimiteDeLinhasPaginacao_Interna);
        paginaAtual = paginaDestino;
        Request();
    }

    function Request() {
        if (_exibeProcessamento) {
            util.IniciaSolicitacao();
        }
        else {
            fieldTh2_PagingToolbar.items.items[42].visible = true;
        }

        fieldTh2_PagingToolbar.enable();

        fieldJsonData["start"] = start;
        fieldJsonData["limit"] = Th2_LimiteDeLinhasPaginacao_Interna;

        Ext.Ajax.request({
            url: fieldUrl,
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            jsonData: { dados: fieldJsonData },
            success: function (response, options) {
                result = Ext.decode(response.responseText).d;

                try {
                    if (!_acaoSucccess) {
                        fieldStore.loadData(criaObjetoXML(result), false);
                        totalCount = Math.floor(criaObjetoXML(result).getElementsByTagName('totalCount')[0].childNodes[0].nodeValue);
                    }
                    else {
                        fieldStore.loadData(criaObjetoXML(result.GRID), false);
                        try {
                            totalCount = Math.floor(criaObjetoXML(result.GRID).getElementsByTagName('totalCount')[0].childNodes[0].nodeValue);
                        }
                        catch (e) {
                            totalCount = result.totalCount;
                        }
                    }
                }
                catch (e) {
                    util.FinalizaSolicitacao();
                }

                totalDePaginas = (totalCount % Th2_LimiteDeLinhasPaginacao_Interna) > 0 ?
                    Math.floor(totalCount / Th2_LimiteDeLinhasPaginacao_Interna) + 1 :
                    totalCount / Th2_LimiteDeLinhasPaginacao_Interna;

                fieldTh2_PagingToolbar.doLayout();

                fieldTh2_PagingToolbar.items.items[6].setValue(paginaAtual);
                fieldTh2_PagingToolbar.items.items[9].setText(' de ' + totalDePaginas);
                fieldTh2_PagingToolbar.items.items[21].setText('Total de registros: ' + totalCount);

                fieldTh2_PagingToolbar.items.items[32].enable();

                Th2_PagingToolbar_ConfiguraNavegacao();

                fieldTh2_PagingToolbar.items.items[fieldTh2_PagingToolbar.items.items.length - 1].enable();

                if (_exibeProcessamento) {
                    util.FinalizaSolicitacao();
                }
                else {
                    fieldTh2_PagingToolbar.items.items[42].visible = false;
                }

                if (_acaoSucccess) {
                    _acaoSucccess(result, fieldStore);
                }
            },
            failure: function (response, options) {
                if (falha)
                    var result = falha(response, options);

                util.FinalizaSolicitacao();

                try {
                    var erro = Ext.decode(response.responseText);
                    dialog.MensagemDeErro(erro.Message);
                }
                catch (e) {
                    dialog.MensagemDeErro(response.statusText);
                }
            }
        });
    }

    function Th2_PagingToolbar_ConfiguraNavegacao() {
        if (paginaAtual == 1) {
            fieldTh2_PagingToolbar.items.items[0].disable();
            fieldTh2_PagingToolbar.items.items[1].disable();

            fieldTh2_PagingToolbar.items.items[0].setIconClass('x-item-disabled x-tbar-page-first');
            fieldTh2_PagingToolbar.items.items[1].setIconClass('x-item-disabled x-tbar-page-prev');
        }

        if (paginaAtual < totalDePaginas && totalCount > 0) {
            fieldTh2_PagingToolbar.items.items[11].enable();
            fieldTh2_PagingToolbar.items.items[12].enable();

            fieldTh2_PagingToolbar.items.items[11].setIconClass('x-tbar-page-next');
            fieldTh2_PagingToolbar.items.items[12].setIconClass('x-tbar-page-last');
        }

        if (paginaAtual < totalDePaginas && paginaAtual > 1) {
            fieldTh2_PagingToolbar.items.items[0].enable();
            fieldTh2_PagingToolbar.items.items[1].enable();

            fieldTh2_PagingToolbar.items.items[11].enable();
            fieldTh2_PagingToolbar.items.items[12].enable();

            fieldTh2_PagingToolbar.items.items[0].setIconClass('x-tbar-page-first');
            fieldTh2_PagingToolbar.items.items[1].setIconClass('x-tbar-page-prev');

            fieldTh2_PagingToolbar.items.items[11].setIconClass('x-tbar-page-next');
            fieldTh2_PagingToolbar.items.items[12].setIconClass('x-tbar-page-last');
        }

        if (paginaAtual == totalDePaginas && totalDePaginas > 1) {
            fieldTh2_PagingToolbar.items.items[0].enable();
            fieldTh2_PagingToolbar.items.items[1].enable();

            fieldTh2_PagingToolbar.items.items[0].setIconClass('x-tbar-page-first');
            fieldTh2_PagingToolbar.items.items[1].setIconClass('x-tbar-page-prev');

            fieldTh2_PagingToolbar.items.items[11].disable();
            fieldTh2_PagingToolbar.items.items[12].disable();

            fieldTh2_PagingToolbar.items.items[11].setIconClass('x-item-disabled x-tbar-page-next');
            fieldTh2_PagingToolbar.items.items[12].setIconClass('x-item-disabled x-tbar-page-last');
        }

        if (paginaAtual == totalDePaginas && totalDePaginas == 1) {
            fieldTh2_PagingToolbar.items.items[0].disable();
            fieldTh2_PagingToolbar.items.items[1].disable();

            fieldTh2_PagingToolbar.items.items[0].setIconClass('x-item-disabled x-tbar-page-first');
            fieldTh2_PagingToolbar.items.items[1].setIconClass('x-item-disabled x-tbar-page-prev');

            fieldTh2_PagingToolbar.items.items[11].disable();
            fieldTh2_PagingToolbar.items.items[12].disable();

            fieldTh2_PagingToolbar.items.items[11].setIconClass('x-item-disabled x-tbar-page-next');
            fieldTh2_PagingToolbar.items.items[12].setIconClass('x-item-disabled x-tbar-page-last');
        }

        if (totalCount == 0) {
            fieldTh2_PagingToolbar.items.items[0].disable();
            fieldTh2_PagingToolbar.items.items[1].disable();

            fieldTh2_PagingToolbar.items.items[0].setIconClass('x-item-disabled x-tbar-page-first');
            fieldTh2_PagingToolbar.items.items[1].setIconClass('x-item-disabled x-tbar-page-prev');

            fieldTh2_PagingToolbar.items.items[11].disable();
            fieldTh2_PagingToolbar.items.items[12].disable();

            fieldTh2_PagingToolbar.items.items[11].setIconClass('x-item-disabled x-tbar-page-next');
            fieldTh2_PagingToolbar.items.items[12].setIconClass('x-item-disabled x-tbar-page-last');
        }
    }

    function PrimeiraPagina() {
        start = 0;
        limit = Th2_LimiteDeLinhasPaginacao_Interna;
        paginaAtual = 1;

        if (instrucoes_pageChange)
            instrucoes_pageChange();

        Request();
    }

    function ProximaPagina() {
        start += Th2_LimiteDeLinhasPaginacao_Interna;
        limit += Th2_LimiteDeLinhasPaginacao_Interna;
        paginaAtual++;

        if (instrucoes_pageChange)
            instrucoes_pageChange();

        Request();
    }

    function PaginaAnterior() {
        start -= Th2_LimiteDeLinhasPaginacao_Interna;
        limit -= Th2_LimiteDeLinhasPaginacao_Interna;
        paginaAtual--;

        if (instrucoes_pageChange)
            instrucoes_pageChange();

        Request();
    }

    function UltimaPagina() {
        start = (totalCount % Th2_LimiteDeLinhasPaginacao_Interna) > 0 ?
            totalCount - (totalCount % Th2_LimiteDeLinhasPaginacao_Interna) :
            (totalCount - Th2_LimiteDeLinhasPaginacao_Interna);

        if (start < 0) start = 0;

        limit = totalCount;
        paginaAtual = totalDePaginas;

        if (instrucoes_pageChange)
            instrucoes_pageChange();

        Request();
    }

    var fieldTh2_PagingToolbar = new Ext.Toolbar({
        width: 'auto',
        height: 'auto',
        anchor: '100%',
        items: [
        {
            icon: 'scripts/resources/images/default/grid/page-first-disabled.gif',
            tooltip: 'Primeira P&aacute;gina',
            disabled: true,
            handler: function () {
                PrimeiraPagina();
            }
        },
        {
            icon: 'scripts/resources/images/default/grid/page-prev-disabled.gif',
            tooltip: 'P&aacute;gina Anterior',
            disabled: true,
            handler: function () {
                PaginaAnterior();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'label',
            text: 'Pagina'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'numberfield',
            decimalPrecision: 0,
            minValue: 1,
            width: 35,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {

                        if (this.getValue() > totalDePaginas) {
                            this.setValue(paginaAtual);
                            dialog.MensagemDeErro('Numero de p&aacute;gina inv&aacute;lido.');
                            return;
                        }

                        doRequestPaginaAtual(this.getValue());
                    }
                }
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'de ' + totalDePaginas
        }, {
            xtype: 'tbseparator'
        }, {
            icon: 'scripts/resources/images/default/grid/page-next-disabled.gif',
            tooltip: 'Pr&oacute;xima P&aacute;gina',
            disabled: true,
            handler: function () {
                ProximaPagina();
            }
        }, {
            icon: 'scripts/resources/images/default/grid/page-last-disabled.gif',
            tooltip: 'Utima P&aacute;gina',
            disabled: true,
            handler: function () {
                UltimaPagina();
            }
        },
        {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'Nao ha dados para exibir'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            icon: 'scripts/resources/images/default/grid/refresh.gif',
            text: 'Atualizar P&aacute;gina',
            disabled: true,
            handler: function () {
                doRequestPaginaAtual(fieldTh2_PagingToolbar.items.items[6].getValue());
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'label',
            text: 'Linhas por Página'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'numberfield',
            decimalPrecision: 0,
            minValue: 1,
            maxValue: 50,
            width: 35,
            value: Th2_LimiteDeLinhasPaginacao_Interna,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        if (this.isValid()) {
                            Th2_LimiteDeLinhasPaginacao_Interna = this.getValue();
                            doRequestPaginaAtual(fieldTh2_PagingToolbar.items.items[6].getValue());
                        }
                    }
                }
            }
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'checkbox',
            boxLabel: 'Ultima P&aacute;gina',
            checked: _ultimaPagina,
            listeners: {
                check: function (field, checked) {
                    _ultimaPagina = checked;
                }
            }
        }]
    });

    this.PagingToolbar = function () {
        return fieldTh2_PagingToolbar;
    }

    fieldTh2_PagingToolbar.items.items[54].setVisible(false);
}