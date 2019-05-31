function Dados_Faturamento_Pedido() {
    var _NUMERO_PEDIDO;

    this.NUMERO_PEDIDO = function (pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;

        wDADOS_FATURA.setTitle("Dados de Faturamento - Servi&ccedil;o nr." + _NUMERO_PEDIDO);

        TB_CFOP_UF_CARREGA_COMBO1(35);
    };

    var _acaoCarregaGrid;

    this.acaoCarregaGrid = function (pValue) {
        _acaoCarregaGrid = pValue;
    };

    /////////////////
    var combo_TB_CFOP_STORE1 = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['CODIGO_CFOP', 'DESCRICAO_CFOP']
       )
    });

    function TB_CFOP_UF_CARREGA_COMBO1(ID_UF) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_DADOS_FATURAMENTO.asmx/Lista_CFOP_UF');
        _ajax.ExibeDivProcessamento(false);
        _ajax.setJsonData({ ID_UF: ID_UF, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            combo_TB_CFOP_STORE1.loadData(criaObjetoXML(result), false);

            BuscaDadosFatura();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
    /////////////////

    var TXT_PLACA_VEICULO = new Ext.form.TextField({
        fieldLabel: 'Placa do Ve&iacute;culo',
        maxLength: 8,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '8' },
        width: 90
    });

    var TXT_NUMERO_PEDIDO_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Numero do Pedido do Cliente',
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' },
        width: 170
    });

    var TXT_NUMERACAO = new Ext.form.TextField({
        fieldLabel: 'Numera&ccedil;&atilde;o',
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12' },
        width: 110
    });

    var TXT_ESPECIE = new Ext.form.TextField({
        fieldLabel: 'Esp&eacute;cie',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 150
    });

    var TXT_MARCA = new Ext.form.TextField({
        fieldLabel: 'Marca',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 150
    });

    var TXT_QTDE_NF = new Ext.form.NumberField({
        fieldLabel: 'Qtde.',
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '20' },
        width: 150,
        allowBlank: false,
        value: 0,
        minValue: 0
    });

    TB_COND_ATIVA_CARREGA_COMBO();

    var CB_CODIGO_COND_PAGTO = new Ext.form.ComboBox({
        store: combo_TB_COND_ATIVA_STORE,
        fieldLabel: 'Condi&ccedil;&atilde;o de Pagamento',
        valueField: 'CODIGO_CP',
        displayField: 'DESCRICAO_CP',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 300,
        allowBlank: false
    });

    var TXT_OBS_NF = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&otilde;es',
        height: 60,
        width: '95%',
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    ////////////////////

    function BuscaDadosFatura() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_DADOS_FATURAMENTO.asmx/BUSCA_DADOS_FATURAMENTO');
        _ajax.setJsonData({ NUMERO_PEDIDO: _NUMERO_PEDIDO, ID_USUARIO: _ID_USUARIO });
        _ajax.ExibeDivProcessamento(false);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (result.CODIGO_COND_PAGTO) {
                TXT_NUMERACAO.setValue(result.NUMERACAO);
                TXT_ESPECIE.setValue(result.ESPECIE);
                TXT_MARCA.setValue(result.MARCA);
                TXT_QTDE_NF.setValue(result.QTDE_NF);
                TXT_NUMERO_PEDIDO_CLIENTE.setValue(result.NUMERO_PEDIDO_CLIENTE);
                TXT_OBS_NF.setValue(result.OBS_NF);
                CB_CODIGO_COND_PAGTO.setValue(result.CODIGO_COND_PAGTO);
            }
            else {
                formDADOS_FATURAMENTO.getForm().reset();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    ////////////////////
    var fsTransporte = new Ext.form.FieldSet({
        checkboxToggle: false,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '96%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .40,
                layout: 'form',
                items: [CB_CODIGO_COND_PAGTO]
            }]
        }]
    });

    var fsVolumes = new Ext.form.FieldSet({
        checkboxToggle: false,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        width: '96%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                items: [TXT_NUMERACAO]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_ESPECIE]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_MARCA]
            }, {
                columnWidth: .20,
                layout: 'form',
                items: [TXT_QTDE_NF]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .30,
                layout: 'form',
                items: [TXT_NUMERO_PEDIDO_CLIENTE]
            }]
        }, {
            layout: 'form',
            items: [TXT_OBS_NF]
        }]
    });

    var formDADOS_FATURAMENTO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        items: [fsTransporte, fsVolumes]
    });

    function GravaDadosFaturamento() {
        if (!formDADOS_FATURAMENTO.getForm().isValid()) {
            return;
        }

        var dados = {
            NUMERO_PEDIDO: _NUMERO_PEDIDO,
            NUMERACAO: TXT_NUMERACAO.getValue(),
            ESPECIE: TXT_ESPECIE.getValue(),
            MARCA: TXT_MARCA.getValue(),
            QTDE_NF: TXT_QTDE_NF.getValue(),
            NUMERO_PEDIDO_CLIENTE: TXT_NUMERO_PEDIDO_CLIENTE.getValue(),
            OBS_NF: TXT_OBS_NF.getValue(),
            CODIGO_COND_PAGTO: CB_CODIGO_COND_PAGTO.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_DADOS_FATURAMENTO.asmx/Grava_Dados_Faturamento');
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            
            if (_acaoCarregaGrid)
                _acaoCarregaGrid();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var buttonGroup_DADOS_FATURAMENTO = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDadosFaturamento();
            }
        }]
    });

    var toolbar_DADOS_FATURAMENTO = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_DADOS_FATURAMENTO]
    });

    var wDADOS_FATURA = new Ext.Window({
        layout: 'form',
        title: 'Dados de Faturamento',
        iconCls: 'icone_DADOS_FATURA',
        width: 1000,
        height: 394,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        renderTo: Ext.getBody(),
        modal: true,
        items: [formDADOS_FATURAMENTO, toolbar_DADOS_FATURAMENTO],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elm) {
        wDADOS_FATURA.show(elm);
    };
}