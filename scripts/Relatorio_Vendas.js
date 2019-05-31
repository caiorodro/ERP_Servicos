function MontaRelatorioVendas() {

    var TXT_DATAREF = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var dt1 = new Date();

    TXT_DATAREF.setValue(dt1.getFirstDateOfMonth());

    TB_REGIAO_CARREGA_COMBO();

    var CB_CODIGO_REGIAO = new Ext.form.ComboBox({
        store: combo_TB_REGIAO_STORE,
        fieldLabel: 'Regi&atilde;o de Vendas',
        valueField: 'CODIGO_REGIAO',
        displayField: 'NOME_REGIAO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 280
    });

    TB_USUARIO_CARREGA_VENDEDORES();

    var CB_CODIGO_VENDEDOR = new Ext.form.ComboBox({
        store: combo_TB_VENDEDORES_Store,
        fieldLabel: 'Vendedor(a)',
        valueField: 'ID_VENDEDOR',
        displayField: 'NOME_VENDEDOR',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 280
    });

    TB_UF_CARREGA_COMBO();

    var CB_ID_UF = new Ext.form.ComboBox({
        store: TB_UF_STORE,
        fieldLabel: 'Unidade Federal',
        valueField: 'ID_UF',
        displayField: 'DESCRICAO_UF',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 170,
        listeners: {
            select: function (c, record, index) {
                CB_ID_MUNICIPIO.reset();

                if (record.data.ID_UF > 0)
                    TB_MUNICIPIO_CARREGA_COMBO(record.data.ID_UF);
            }
        }
    });

    var CB_ID_MUNICIPIO = new Ext.form.ComboBox({
        store: TB_MUNICIPIO_STORE,
        fieldLabel: 'Munic&iacute;pio',
        valueField: 'ID_MUNICIPIO',
        displayField: 'NOME_MUNICIPIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 300
    });

    var TXT_FD_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Cliente',
        width: 350,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' }
    });

    var BTN_FD_CONFIRMAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            if (!formFD.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();

            var dados = {
                dataRef: TXT_DATAREF.getRawValue(),
                CODIGO_VENDEDOR: CB_CODIGO_VENDEDOR.getValue() == '' ? 0 : CB_CODIGO_VENDEDOR.getValue(),
                CODIGO_REGIAO: CB_CODIGO_REGIAO.getValue(),
                CLIENTE: TXT_FD_CLIENTE_FORNECEDOR.getValue(),
                ID_UF: CB_ID_UF.getValue() == '' ? 0 : CB_ID_UF.getValue(),
                ID_MUNICIPIO: CB_ID_MUNICIPIO.getValue() == '' ? 0 : CB_ID_MUNICIPIO.getValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            };

            _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Relatorio_Vendas_Semestral');
            _ajax.setJsonData(dados);

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    //////////////

    // Relatório de entregas do cliente

    var TXT_DATA_INI = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data inicial',
        allowBlank: false
    });

    var TXT_DATA_FIM = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data final',
        allowBlank: false
    });

    TXT_DATA_INI.setValue(dt1.getFirstDateOfMonth());
    TXT_DATA_FIM.setValue(dt1.getLastDateOfMonth());

    var TXT_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Cliente',
        width: 350,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' }
    });

    var BTN_LISTAR = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            if (!formFD.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();

            var dados = {
                DATA1: TXT_DATA_INI.getRawValue(),
                DATA2: TXT_DATA_FIM.getRawValue(),
                CLIENTE: TXT_CLIENTE.getValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            };

            _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Relatorio_Entregas');
            _ajax.setJsonData(dados);

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fsFD = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Totais de vendas e faturamento m&ecirc;s a m&ecirc;s (anual)',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAREF]
            }, {
                columnWidth: 0.40,
                layout: 'form',
                items: [TXT_FD_CLIENTE_FORNECEDOR]
            }]
        }, {
            layout: 'form',
            items: [CB_CODIGO_REGIAO]
        }, {
            layout: 'form',
            items: [CB_CODIGO_VENDEDOR]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.18,
                layout: 'form',
                items: [CB_ID_UF]
            }, {
                columnWidth: 0.28,
                layout: 'form',
                items: [CB_ID_MUNICIPIO]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [BTN_FD_CONFIRMAR]
            }]
        }]
    });

    var fs1 = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Relat&oacute;rio de entregas do cliente',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_DATA_INI]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_DATA_FIM]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .32,
                items: [TXT_CLIENTE]
            }, {
                layout: 'form',
                columnWidth: .12,
                items: [BTN_LISTAR]
            }]
        }]
    });

    // Relatorio de desempenho do ciclista

    var TXT_DATA_INID = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data inicial',
        allowBlank: false
    });

    var TXT_DATA_FIMD = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data final',
        allowBlank: false
    });

    TXT_DATA_INID.setValue(dt1.getFirstDateOfMonth());
    TXT_DATA_FIMD.setValue(dt1.getLastDateOfMonth());

    var BTN_LISTARD = new Ext.Button({
        text: 'Listar',
        icon: 'imagens/icones/book_ok_24.gif',
        scale: 'large',
        handler: function () {

            if (!formFD.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();

            var dados = {
                data1: TXT_DATA_INID.getRawValue(),
                data2: TXT_DATA_FIMD.getRawValue(),
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            };

            _ajax.setUrl('servicos/TB_CICLISTA.asmx/Doran_Relatorio_desempenho_ciclista');
            _ajax.setJsonData(dados);

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                window.open(result, '_blank', 'width=1000,height=800');
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    });

    var fs2 = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Relat&oacute;rio de desempenho por ciclista',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                items: [TXT_DATA_INID]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [TXT_DATA_FIMD]
            }, {
                layout: 'form',
                columnWidth: .12,
                items: [BTN_LISTARD]
            }]
        }]
    });

    var formFD = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 500,
        items: [fsFD, fs1, fs2]
    });

    var panelFD = new Ext.Panel({
        width: '100%',
        height: '100%',
        border: true,
        title: 'Relat&oacute;rio de Vendas (Anual) por Cliente / Entregas do Cliente',
        items: [formFD]
    });

    formFD.setHeight(AlturaDoPainelDeConteudo(0) - 56);

    return panelFD;
}