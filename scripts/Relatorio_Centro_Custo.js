function Relatorio_Centro_Custo() {

    var combo_PLANO_CONTA = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PLANO', 'DESCRICAO_PLANO']
       ),
        sortInfo: {
            field: 'NOME_PLANO',
            direction: 'ASC'
        }
    });

    function CARREGA_PLANO() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Lista_TB_PLANO_CONTA');
        _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            combo_PLANO_CONTA.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    CARREGA_PLANO();

    var TXT_DATAF1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAF2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var fdt1 = new Date();

    TXT_DATAF1.setValue(fdt1);
    TXT_DATAF2.setValue(fdt1);

    var cb_ID_PLANO = new Ext.form.ComboBox({
        fieldLabel: 'Plano de contas',
        valueField: 'ID_PLANO',
        displayField: 'DESCRICAO_PLANO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 300,
        store: combo_PLANO_CONTA
    });

    var CB_SOMENTETOTAIS = new Ext.form.Checkbox({
        boxLabel: 'Listar somente os totais por plano'
    });

    var BTN_OK = new Ext.Button({
        text: 'Ok',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function() {
            Lista_Relatorio();
        }
    });

    var form1 = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.14,
                layout: 'form',
                items: [TXT_DATAF1]
            }, {
                columnWidth: 0.14,
                layout: 'form',
                items: [TXT_DATAF2]
            }, {
                columnWidth: 0.36,
                layout: 'form',
                items: [cb_ID_PLANO]
            }, {
                columnWidth: 0.26,
                layout: 'form',
                items: [CB_SOMENTETOTAIS]
            }, {
                columnWidth: .08,
                items: [BTN_OK]
}]
}]
            });

            function Lista_Relatorio() {
                if (!form1.getForm().isValid())
                    return;

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CUSTO_VENDA.asmx/Doran_Relatorio_Centro_Custo');
                _ajax.setJsonData({
                    data1: TXT_DATAF1.getRawValue(),
                    data2: TXT_DATAF2.getRawValue(),
                    ID_PLANO: cb_ID_PLANO.getValue(),
                    ID_EMPRESA: _ID_EMPRESA,
                    somenteTotais: CB_SOMENTETOTAIS.checked ? true : false,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;
                    window.open(result, '_blank', 'width=1000,height=800');
                    wCentro.close();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            var wCentro = new Ext.Window({
                layout: 'form',
                title: 'Relat&oacute;rio de contas pagas por plano de contas',
                iconCls: 'icone_FOLLOW_UP',
                width: 920,
                height: 95,
                closable: true,
                draggable: true,
                minimizable: false,
                resizable: false,
                modal: true,
                renderTo: Ext.getBody(),
                items: [form1]
            });

            this.show = function(elm) {
                wCentro.show(elm);
            };
        }
