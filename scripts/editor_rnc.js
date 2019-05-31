function MONTA_EDITOR_RNC() {

    var _NUMERO_RNC = 0;
    var _NUMERO_ORDEM_RNC = 0;
    var _storeRNC;

    this.NUMERO_RNC = function(pNUMERO_RNC) {
        _NUMERO_RNC = pNUMERO_RNC;
    };

    this.NUMERO_ORDEM_RNC = function(pValue){
        _NUMERO_ORDEM_RNC = pValue;
    };

    this.storeRNC = function(pStore) {
        _storeRNC = pStore;
    };

    var TXT_EDITOR_RNC = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: AlturaDoPainelDeConteudo(142),
        allowBlank: false,
        hideLabel: true
    });

    var buttonGroup_RNC = new Ext.ButtonGroup({
        items: [{
            text: 'Imprimir / Gerar PDF',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'medium',
            handler: function(btn) {
                if (_NUMERO_RNC == 0) {
                    dialog.MensagemDeErro('Selecione uma RNC na aba anterior para gerar o PDF', btn.getId());
                    return;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Emite_RNC');
                _ajax.setJsonData({
                    NUMERO_RNC: _NUMERO_RNC,
                    NUMERO_ORDEM_RNC: _NUMERO_ORDEM_RNC,
                    CONTEUDO: TXT_EDITOR_RNC.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;

                    for (var i = 0; i < _storeRNC.getCount(); i++) {
                        var record = _storeRNC.getAt(i);

                        if (record.data.NUMERO_ORDEM_RNC == _NUMERO_RNC) {
                            record.beginEdit();
                            record.set('PDF', result[1]);
                            record.endEdit();
                            record.commit();
                        }
                    }

                    window.open(result[0], '_blank', 'width=1000,height=800');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
}]
        });

        var toolbar_EDITOR_RNC = new Ext.Toolbar({
            style: 'text-align: right;',
            items: [buttonGroup_RNC]
        });

        var formMatrizRNC = new Ext.form.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 2px 0px 0px',
            frame: true,
            width: '100%',
            autoHeight: true,
            items: [TXT_EDITOR_RNC]
        });

        var panel1 = new Ext.Panel({
            width: '100%',
            autoHeight: true,
            frame: true,
            items: [formMatrizRNC, toolbar_EDITOR_RNC]
        });

        this.setConteudo = function(pCONTEUDO) {
            TXT_EDITOR_RNC.setValue(pCONTEUDO);
        };

        this.Panel = function(pValue) {
            return panel1;
        };

        var _tabPanel;

        this.tabPanel = function(pValue) {
            _tabPanel = pValue;
        };

        var _acao;

        this.acao_Corretiva = function(pValue) {
            _acao = pValue;
        };
    }