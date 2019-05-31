
function MontaCadastro_AcaoCorretivaRNC() {

    var _NUMERO_RNC;

    this.NUMERO_RNC = function(pValue) {
        _NUMERO_RNC = pValue;
    };

    var _ID_ACAO = 0;

    var TXT_EDITOR_ACAO = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: 347,
        allowBlank: false,
        hideLabel: true
    });

    var formACAO = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        items: [TXT_EDITOR_ACAO]
    });

    function PopulaFormulario(record) {

        _ID_ACAO = record.data.ID_ACAO_CORRETIVA;
        TXT_EDITOR_ACAO.setValue(record.data.ACAO_CORRETIVA);

        panelCadastro.setTitle('Alterar dados da a&ccedil;&atilde;o');

        buttonGroup1.items.items[32].enable();

        TXT_EDITOR_ACAO.focus();
    }

    var ACAO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_RNC', 'ID_ACAO_CORRETIVA', 'ACAO_CORRETIVA', 'ACAO_CORRETIVA2'])
    });

    var gridACAO = new Ext.grid.GridPanel({
        store: ACAO_Store,
        columns: [
            { id: 'NUMERO_RNC', header: "Nº da RNC", width: 100, sortable: true, dataIndex: 'NUMERO_RNC' },
            { id: 'ID_ACAO_CORRETIVA', header: "ID A&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'ID_ACAO_CORRETIVA' }
            ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(530),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridACAO.on('rowdblclick', function(grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario(record);
    });

    gridACAO.on('keydown', function(e) {
        if (e.getKey() == e.ENTER) {
            if (gridACAO.getSelectionModel().getSelections().length > 0) {
                var record = gridACAO.getSelectionModel().getSelected();
                PopulaFormulario(record);
            }
        }
    });

    function RetornaVENDA_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NUMERO_RNC: _NUMERO_RNC,
            ID_USUARIO: _ID_USUARIO
        };

        return CLAS_FISCAL_JsonData;
    }

    var STATUS_PagingToolbar = new Th2_PagingToolbar();
    STATUS_PagingToolbar.setUrl('servicos/TB_ACAO_CORRETIVA_RNC.asmx/Carrega_Acao');
    STATUS_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
    STATUS_PagingToolbar.setStore(ACAO_Store);

    function CARREGA_GRID() {
        STATUS_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        STATUS_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function() {
                GravaDados();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                text: 'Nova A&ccedil;&atilde;o corretiva',
                icon: 'imagens/icones/database_fav_24.gif',
                scale: 'medium',
                handler: function() {
                    buttonGroup1.items.items[32].disable();

                    formACAO.getForm().items.items[0].enable();

                    TXT_EDITOR_ACAO.focus();
                    CARREGA_FORMULARIO();
                    panelCadastro.setTitle('Nova A&ccedil;&atilde;o corretiva');
                }
            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
             {
                 id: 'BTN_DELETAR_ACAO_CORRETIVA',
                 text: 'Deletar',
                 icon: 'imagens/icones/database_delete_24.gif',
                 scale: 'medium',
                 disabled: true,
                 handler: function() {
                     Deleta_ACAO();
                 }
             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                {
                 text: 'Imprimir',
                 icon: 'imagens/icones/printer_24.gif',
                 scale: 'medium',
                 handler: function(btn) {
                     if (_ID_ACAO == 0) {
                         dialog.MensagemDeErro('Selecione uma a&ccedil;&atilde;o corretiva na para gerar o PDF', btn.getId());
                         return;
                     }

                     var _ajax = new Th2_Ajax();
                     _ajax.setUrl('servicos/TB_ACAO_CORRETIVA_RNC.asmx/Imprime_Acao_Corretiva');
                     _ajax.setJsonData({
                         ID_ACAO_CORRETIVA: _ID_ACAO,
                         ACAO_CORRETIVA: TXT_EDITOR_ACAO.getValue(),
                         ID_USUARIO: _ID_USUARIO
                     });

                     var _sucess = function(response, options) {
                         var result = Ext.decode(response.responseText).d;

                         window.open(result, '_blank', 'width=1000,height=800');
                     };

                     _ajax.setSucesso(_sucess);
                     _ajax.Request();
                 }
}]
    });

    var toolbar_TB_STATUS = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastro = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Nova A&ccedil;&atilde;o corretiva',
        items: [formACAO, toolbar_TB_STATUS, gridACAO, STATUS_PagingToolbar.PagingToolbar()]
    });

    function GravaDados() {
        if (!formACAO.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_RNC: _NUMERO_RNC,
            ID_ACAO_CORRETIVA: _ID_ACAO,
            ACAO_CORRETIVA: TXT_EDITOR_ACAO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastro.title == "Nova A&ccedil;&atilde;o corretiva" ?
                                'servicos/TB_ACAO_CORRETIVA_RNC.asmx/GravaNovaAcao' :
                                'servicos/TB_ACAO_CORRETIVA_RNC.asmx/AtualizaAcao';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function(response, options) {
            if (panelCadastro.title == "Nova A&ccedil;&atilde;o corretiva") {
                var result = Ext.decode(response.responseText).d;

                _ID_ACAO = result.ID_ACAO_CORRETIVA;
                TXT_EDITOR_ACAO.setValue(result.ACAO_CORRETIVA);

                panelCadastro.setTitle('Alterar dados da a&ccedil;&atilde;o');

                buttonGroup1.items.items[32].enable();
            }

            TXT_EDITOR_ACAO.focus();

            CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_ACAO() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta A&ccedil;&atilde;o corretiva?', formACAO.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ACAO_CORRETIVA_RNC.asmx/DeletaAcao');
                _ajax.setJsonData({
                    ID_ACAO_CORRETIVA: _ID_ACAO,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function(response, options) {
                    panelCadastro.setTitle("Nova A&ccedil;&atilde;o corretiva");
                    TXT_EDITOR_ACAO.focus();
                    CARREGA_FORMULARIO();
                    buttonGroup1.items.items[32].disable();
                    formACAO.getForm().items.items[0].enable();

                    CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function CARREGA_FORMULARIO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ACAO_CORRETIVA_RNC.asmx/Carrega_Formulario');
        _ajax.setJsonData({
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            TXT_EDITOR_ACAO.setValue(result);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
    
    this.carregaGrid = function() {
        CARREGA_GRID();
    };

    this.carregaFormulario = function() {
        CARREGA_FORMULARIO();
    };

    this.Panel = function() {
        return panelCadastro;
    };

    this.resetaFormulario = function() {
        TXT_EDITOR_ACAO.setValue('');
    };
}
