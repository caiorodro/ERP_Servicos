function MontaOcorrenciaRNC(_NUMERO_PEDIDO_VENDA, _NUMERO_ITEM_VENDA, _NUMERO_PEDIDO_COMPRA, _NUMERO_ITEM_COMPRA,
    _CODIGO_PRODUTO_VENDA, _CODIGO_PRODUTO_COMPRA, _CODIGO_FORNECEDOR) {

    var editor_rnc1 = new MONTA_EDITOR_RNC();

    var HNUMERO_RNC = new Ext.form.Hidden();

    ////////////

    var dt1 = new Date();

    var TXT_DATA_RNC = new Ext.form.DateField({
        id: 'DATA_RNC',
        name: 'DATA_RNC',
        layout: 'form',
        fieldLabel: 'Data',
        width: 94,
        value: dt1,
        allowBlank: false
    });

    function Busca_Nome_Fornecedor(CODIGO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_BENEFICIAMENTO.asmx/BuscaNomeFornecedor');
        _ajax.setJsonData({ CODIGO_FORNECEDOR: CODIGO, ID_USUARIO: _ID_USUARIO });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;

            LBL_DADOS_FORNECEDOR.setText(result, false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var busca_fornecedor = new BUSCA_FORNECEDOR();

    var TXT_CODIGO_FORNECEDOR = new Ext.form.NumberField({
        id: 'CODIGO_FORNECEDOR_RNC',
        fieldLabel: 'Fornecedor &lt;F8&gt;',
        width: 90,
        maxLength: 12,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '12', style: 'border-style: solid; border-width: 1px; border-color: #cc9900;' },
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    if (f.isValid())
                        Busca_Nome_Fornecedor(f.getValue());
                }
            },
            keydown: function(f, e) {
                if (e.getKey() == e.F8) {

                    busca_fornecedor.ACAO_POPULAR(function(record) {
                        f.setValue(record.data.CODIGO_FORNECEDOR);
                        LBL_DADOS_FORNECEDOR.setText(record.data.NOME_FORNECEDOR + ' - ' + record.data.NOME_FANTASIA_FORNECEDOR);
                        busca_fornecedor.hide();
                    });

                    busca_fornecedor.show(f.getId());
                }
            }
        }
    });

    var LBL_DADOS_FORNECEDOR = new Ext.form.Label({
        id: 'DADOS_FORNECEDOR_RNC',
        html: '&nbsp;'
    });

    var TXT_NUMERO_PEDIDO_VENDA = new Ext.form.NumberField({
        id: 'NUMERO_PEDIDO_VENDA_RNC',
        fieldLabel: 'Nº do Pedido de Venda',
        width: 90,
        readOnly: true
    });

    var TXT_ITEM_PEDIDO_VENDA = new Ext.form.NumberField({
        id: 'ITEM_PEDIDO_VENDA_RNC',
        fieldLabel: 'Nº do item de Venda',
        width: 90,
        readOnly: true
    });

    var TXT_NUMERO_PEDIDO_COMPRA = new Ext.form.NumberField({
        id: 'NUMERO_PEDIDO_COMPRA_RNC',
        fieldLabel: 'Nº do Pedido de Compra',
        width: 90,
        readOnly: true
    });

    var TXT_ITEM_PEDIDO_COMPRA = new Ext.form.NumberField({
        id: 'ITEM_PEDIDO_COMPRA_RNC',
        fieldLabel: 'Nº do item de Compra',
        width: 90,
        readOnly: true
    });

    TB_RNC_CARREGA_COMBO();

    var CB_ID_RNC = new Ext.form.ComboBox({
        store: combo_TB_RNC_STORE,
        fieldLabel: 'Item de RNC',
        valueField: 'ID_RNC',
        displayField: 'DESCRICAO_RNC',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 380
    });

    TB_STATUS_RNC_CARREGA_COMBO();

    var CB_STATUS_RNC = new Ext.form.ComboBox({
        store: combo_TB_STATUS_RNC,
        fieldLabel: 'Fase da RNC',
        valueField: 'ID_STATUS_RNC',
        displayField: 'DESCRICAO_STATUS',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 200,
        allowBlank: false
    });

    var TXT_DESCRICAO_RNC = new Ext.form.TextField({
        id: 'DESCRICAO_RNC1',
        name: 'DESCRICAO_RNC1',
        fieldLabel: 'Descri&ccedil;&atilde;o do RNC',
        width: '90%',
        height: 75,
        allowBlank: false,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var TXT_INSPECIONADOR = new Ext.form.TextField({
        fieldLabel: 'Inspetor',
        width: 150,
        allowBlank: false,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 20 }
    });

    var TXT_DATA_INSPECAO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data da Inspe&ccedil;&atilde;o',
        width: 94,
        value: dt1,
        allowBlank: false
    });

    var TXT_SEPARADOR = new Ext.form.TextField({
        fieldLabel: 'Separador',
        width: 150,
        maxLength: 20,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 20 }
    });

    var TXT_DATA_SEPARACAO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data da Separa&ccedil;&atilde;o',
        width: 94
    });

    var TXT_CODIGO_PRODUTO_VENDA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto (Venda)',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        readOnly: true
    });

    var TXT_CODIGO_PRODUTO_COMPRA = new Ext.form.TextField({
        fieldLabel: 'C&oacute;digo do Produto (Compra)',
        width: 200,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        readOnly: true
    });

    var TXT_NUMERO_NF_FORNECEDOR = new Ext.form.NumberField({
        fieldLabel: 'N&ordm; NF Fornecedor',
        width: 90,
        decimalPrecision: 0,
        minValue: 0,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var TXT_NUMERO_ORDEM_RNC = new Ext.form.NumberField({
        fieldLabel: 'N&ordm; da Ordem de RNC',
        width: 90,
        decimalPrecision: 0,
        minValue: 1,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' }
    });

    var form_OcorrenciaRNC = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 265,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .15,
                layout: 'form',

                items: [TXT_DATA_RNC]
            }, {
                columnWidth: .15,
                layout: 'form',
                items: [TXT_CODIGO_FORNECEDOR]
            }, {
                columnWidth: .70,
                items: [LBL_DADOS_FORNECEDOR]
}]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_NUMERO_PEDIDO_VENDA]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_ITEM_PEDIDO_VENDA]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [TXT_CODIGO_PRODUTO_VENDA]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_NUMERO_PEDIDO_COMPRA]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [TXT_ITEM_PEDIDO_COMPRA]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [TXT_CODIGO_PRODUTO_COMPRA]
}]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .35,
                        items: [{
                            layout: 'form',
                            items: [CB_ID_RNC]
                        }, {
                            layout: 'form',
                            items: [CB_STATUS_RNC]
}]
                        }, {
                            columnWidth: .65,
                            layout: 'form',
                            items: [TXT_DESCRICAO_RNC]
}]
                        }, {
                            layout: 'column',
                            items: [{
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_INSPECIONADOR]
                            }, {
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_DATA_INSPECAO]
                            }, {
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_SEPARADOR]
                            }, {
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_DATA_SEPARACAO]
                            }, {
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_NUMERO_NF_FORNECEDOR]
                            }, {
                                columnWidth: .15,
                                layout: 'form',
                                items: [TXT_NUMERO_ORDEM_RNC]
}]
}]
                            });

                            function EncerraRNC() {
                                if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                    dialog.MensagemDeErro('Selecione um item abaixo para marcar a impress&atilde;o', 'BTN_ENCERRAR_RNC');
                                    return;
                                }

                                var arr1 = new Array();

                                for (var i = 0; i < gridOcorrenciaRNC.getSelectionModel().getSelections().length; i++) {
                                    var record = gridOcorrenciaRNC.getSelectionModel().selections.items[i];

                                    arr1[i] = record.data.NUMERO_RNC;
                                }

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Encerra_RNC');
                                _ajax.setJsonData({ NUMERO_RNC: arr1, ID_USUARIO: _ID_USUARIO });

                                var _sucess = function(response, options) {
                                    var result = Ext.decode(response.responseText).d;

                                    for (var i = 0; i < gridOcorrenciaRNC.getSelectionModel().getSelections().length; i++) {
                                        var record = gridOcorrenciaRNC.getSelectionModel().selections.items[i];

                                        record.beginEdit();
                                        record.set('DATA_ENCERRAMENTO', result[i].DATA_ENCERRAMENTO);
                                        record.set('ID_STATUS_RNC', result[i].ID_STATUS_RNC);
                                        record.set('DESCRICAO_STATUS', result[i].DESCRICAO_STATUS);
                                        record.set('COR_LETRA', result[i].COR_LETRA);
                                        record.set('COR_FUNDO', result[i].COR_FUNDO);

                                        record.endEdit();
                                        record.commit();
                                    }

                                    CB_STATUS_RNC.setValue(result[0].ID_STATUS_RNC);
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }

                            /////////////
                            var buttonGroup_TB_OCORRENCIA_RNC = new Ext.ButtonGroup({
                                items: [{
                                    text: 'Salvar',
                                    icon: 'imagens/icones/database_save_24.gif',
                                    scale: 'medium',
                                    handler: function() {
                                        GravaDados_TB_OCORRENCIA_RNC();
                                    }
                                }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                           { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Registro de RNC',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function() {
                                    buttonGroup_TB_OCORRENCIA_RNC.items.items[32].disable();

                                    TXT_DESCRICAO_RNC.focus();
                                    form_OcorrenciaRNC.getForm().reset();
                                    panelOcorrenciaRNC.setTitle('Novo Registro de RNC');
                                }
                            }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_DELETAR_TB_OCORRENCIA_RNC',
                                 text: 'Deletar',
                                 icon: 'imagens/icones/database_delete_24.gif',
                                 scale: 'medium',
                                 disabled: true,
                                 handler: function() {
                                     Deleta_TB_OCORRENCIA_RNC();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 id: 'BTN_ENCERRAR_RNC',
                                 text: 'Encerrar RNC',
                                 icon: 'imagens/icones/script_ok_24.gif',
                                 scale: 'medium',
                                 handler: function() {
                                     EncerraRNC();
                                 }
                             }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                             {
                                 text: "Enviar e-mail sobre a(s) RNC(s) selecionada(s)",
                                 icon: 'imagens/icones/mail_next_24.gif',
                                 scale: 'medium',
                                 handler: function(btn) {
                                     preparaEmailRNC(btn);
                                 }
}]
                            });

                            function preparaEmailRNC(btn) {
                                if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                    dialog.MensagemDeErro('Selecione um item abaixo para marcar a impress&atilde;o', btn.getId());
                                    return;
                                }

                                util.IniciaSolicitacao();
                                
                                var RNCs = "";

                                var conteudoRNC = new Date().getHours() < 12 ? "Bom dia,<br>" : "Boa tarde,<br>";

                                conteudoRNC += "Segue abaixo refer&ecirc;ncia(s) sobre <b>Relat&oacute;rio de n&atilde;o conformidade</b><br><br>";

                                for (var i = 0; i < gridOcorrenciaRNC.getSelectionModel().getSelections().length; i++) {
                                    var record = gridOcorrenciaRNC.getSelectionModel().selections.items[i];

                                    RNCs += record.data.NUMERO_ORDEM_RNC + " - ";
                                    conteudoRNC += "<b>ID da RNC:</b> " + record.data.NUMERO_RNC + "<br>";
                                    conteudoRNC += "<b>Ordem da RNC:</b> " + record.data.NUMERO_ORDEM_RNC + "<br>";
                                    conteudoRNC += "<b>Fornecedor:</b> " + record.data.NOME_FANTASIA_FORNECEDOR + "<br>";
                                    conteudoRNC += "<b>Pedido de compra:</b> " + record.data.NUMERO_PEDIDO_COMPRA + "<br>";
                                    conteudoRNC += "<b>C&oacute;d. Produto:</b> " + record.data.CODIGO_PRODUTO_COMPRA + "<br>";
                                    conteudoRNC += "<b>Status da RNC:</b> <span style='backgorund-color: " +
                                        record.data.COR_FUNDO + "; color: " + record.data.COR_LETRA + "'>" + record.data.DESCRICAO_STATUS + "</span><br><br>";
                                }

                                RNCs = RNCs.substr(0, RNCs.length - 3);

                                conteudoRNC += "Abra a tela de <b>Consulta de RNC</b> e digite o(s) numero(s) abaixo:<br><br>" + RNCs + "<br><br>";

                                var titulo = "Nova mensagem - RNC [" + RNCs + "]";

                                var tabExistente = false;

                                Ext.getCmp('tabConteudo').setActiveTab(0);

                                for (var i = 0; i < Ext.getCmp('ABAS_WEBMAIL').items.length; i++) {
                                    if (Ext.getCmp('ABAS_WEBMAIL').items.items[i].title == titulo) {
                                        tabExistente = true;
                                        Ext.getCmp('ABAS_WEBMAIL').setActiveTab(i);
                                    }
                                }

                                if (!tabExistente) {
                                    var novaAba = new aba_Envio_Email('_web_mail' + titulo);

                                    novaAba.setID_USUARIO(_ID_USUARIO);

                                    novaAba.resetaFormulario();

                                    novaAba.Botao_Salvar(true);
                                    novaAba.Botao_Enviar(true);
                                    novaAba.Botao_Responder(false);
                                    novaAba.Botao_Encaminhar(false);

                                    novaAba.setRemetente(_record_conta_email.data.CONTA_EMAIL);
                                    novaAba.setAssunto("Doran - RNC " + RNCs);
                                    novaAba.setBody('<div><br>' + conteudoRNC + '</div>' + _record_conta_email.data.ASSINATURA);
                                    novaAba.setRawBody('<div><br>' + conteudoRNC + '</div>' + _record_conta_email.data.ASSINATURA);
                                    novaAba.recordGrid(undefined);

                                    novaAba.tituloAba(titulo);

                                    Ext.getCmp('ABAS_WEBMAIL').add({
                                        title: titulo,
                                        closable: true,
                                        autoScroll: true,
                                        autoDestroy: true,
                                        iconCls: 'icone_ENVIA_COTACAO1',
                                        listeners: {
                                            beforeclose: function(c) {
                                                Ext.getCmp('ABAS_WEBMAIL').setActiveTab(0);
                                            }
                                        },
                                        items: [novaAba.show()]
                                    });

                                    Ext.getCmp('ABAS_WEBMAIL').setActiveTab(Ext.getCmp('ABAS_WEBMAIL').items.length - 1);
                                }

                                util.FinalizaSolicitacao();
                            }

                            var toolbar_TB_OCORRENCIA_RNC = new Ext.Toolbar({
                                style: 'text-align: right;',
                                items: [buttonGroup_TB_OCORRENCIA_RNC]
                            });

                            ///////////////

                            var TB_OCORRENCIA_RNC_Store = new Ext.data.Store({
                                reader: new Ext.data.XmlReader({
                                    record: 'Tabela'
                                },
                    ['NUMERO_RNC', 'NUMERO_PEDIDO_VENDA', 'NUMERO_ITEM_VENDA', 'CODIGO_PRODUTO_PEDIDO',
                     'NUMERO_PEDIDO_COMPRA', 'NUMERO_ITEM_COMPRA', 'CODIGO_PRODUTO_COMPRA', 'CODIGO_FORNECEDOR',
                     'NOME_FANTASIA_FORNECEDOR', 'NOME_FORNECEDOR', 'ID_RNC', 'DESCRICAO_RNC', 'DATA_RNC',
                     'DESCRICAO', 'SEPARADOR', 'DATA_SEPARACAO', 'INSPECIONADOR', 'DATA_INSPECAO',
                     'NUMERO_NF_FORNECEDOR', 'NUMERO_ORDEM_RNC', 'PDF', 'HTML', 'DATA_ENCERRAMENTO', 'ID_STATUS_RNC',
                     'DESCRICAO_STATUS', 'COR_FUNDO', 'COR_LETRA', 'ACOES_CORRETIVAS'])
                            });

                            var IO_expander = new Ext.ux.grid.RowExpander({
                                expandOnEnter: false,
                                expandOnDblClick: false,

                                tpl: new Ext.Template("<br /><b>Descri&ccedil;&atilde;o:</b> {DESCRICAO}")
                            });

                            var checkBoxSM1 = new Ext.grid.CheckboxSelectionModel();

                            var gridOcorrenciaRNC = new Ext.grid.GridPanel({
                                id: 'gridOcorrenciaRNC',
                                store: TB_OCORRENCIA_RNC_Store,
                                enableColumnMove: false,
                                columns: [
                        IO_expander,
                        checkBoxSM1,
                    { id: 'HTML', header: "Matriz", width: 70, sortable: true, dataIndex: 'HTML', align: 'center' },
                    { id: 'PDF', header: "PDF", width: 60, sortable: true, dataIndex: 'PDF', align: 'center' },
                    { id: 'NUMERO_ORDEM_RNC', header: "Ordem de RNC", width: 120, sortable: true, dataIndex: 'NUMERO_ORDEM_RNC', align: 'center' },
                    { id: 'DATA_RNC', header: "Data", width: 120, sortable: true, dataIndex: 'DATA_RNC', renderer: XMLParseDateTime },
                    { id: 'DATA_ENCERRAMENTO', header: "Encerramento", width: 120, sortable: true, dataIndex: 'DATA_ENCERRAMENTO', renderer: Parse_Encerramento_RNC },
                    { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 175, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
                    { id: 'DESCRICAO_RNC', header: "Item de RNC", width: 300, sortable: true, dataIndex: 'DESCRICAO_RNC' },
                    { id: 'DESCRICAO_STATUS', header: "Fase RNC", width: 230, sortable: true, dataIndex: 'DESCRICAO_STATUS', renderer: statusRnc },
                    { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;d. Produto (Venda)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
                    { id: 'NUMERO_PEDIDO_COMPRA', header: "Pedido de Compra", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_COMPRA', align: 'center' },
                    { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;d. Produto (Compra)", width: 170, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
                    { id: 'INSPECIONADOR', header: "Inspetor", width: 150, sortable: true, dataIndex: 'INSPECIONADOR' },
                    { id: 'DATA_INSPECAO', header: "Data Inspe&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_INSPECAO', renderer: XMLParseDate },
                    { id: 'SEPARADOR', header: "Separador", width: 150, sortable: true, dataIndex: 'SEPARADOR' },
                    { id: 'DATA_SEPARACAO', header: "Data Separa&ccedil;&atilde;o", width: 100, sortable: true, dataIndex: 'DATA_SEPARACAO', renderer: XMLParseDate },
                    { id: 'NUMERO_NF_FORNECEDOR', header: "N&ordm; NF Fornecedor", width: 120, sortable: true, dataIndex: 'NUMERO_NF_FORNECEDOR', align: 'center' }
                    ],
                                stripeRows: true,
                                height: AlturaDoPainelDeConteudo(418),
                                width: '100%',

                                sm: checkBoxSM1,

                                plugins: IO_expander,

                                listeners: {
                                    rowdblclick: function(grid, rowIndex, e) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        PopulaFormulario_TB_OCORENCIA_RNC(record);
                                    },
                                    keydown: function(e) {
                                        if (e.getKey() == e.ENTER) {
                                            if (gridOcorrenciaRNC.getSelectionModel().getSelections().length > 0) {
                                                var record = gridOcorrenciaRNC.getSelectionModel().selections.items[0];
                                                PopulaFormulario_TB_OCORENCIA_RNC(record);
                                            }
                                        }
                                    },
                                    cellclick: function(grid, rowIndex, columnIndex, e) {
                                        if (columnIndex == 2) {
                                            var record = grid.getStore().getAt(rowIndex);

                                            if (record.data.HTML.trim().length > 0) {
                                                Edita_Matriz(record.data.NUMERO_RNC, record.data.NUMERO_ORDEM_RNC);
                                            }
                                        }
                                    }
                                }
                            });

                            function RetornaRNC_Pedido_Venda_JsonData() {
                                var CLAS_FISCAL_JsonData = {
                                    NUMERO_PEDIDO_VENDA: TXT_NUMERO_PEDIDO_VENDA.getValue(),
                                    NUMERO_ITEM_VENDA: TXT_ITEM_PEDIDO_VENDA.getValue(),
                                    start: 0,
                                    limit: Th2_LimiteDeLinhasPaginacao
                                };

                                return CLAS_FISCAL_JsonData;
                            }

                            function RetornaRNC_Pedido_Compra_JsonData() {
                                var CLAS_FISCAL_JsonData = {
                                    NUMERO_PEDIDO_COMPRA: TXT_NUMERO_PEDIDO_COMPRA.getValue(),
                                    NUMERO_ITEM_COMPRA: TXT_ITEM_PEDIDO_COMPRA.getValue(),
                                    ID_USUARIO: _ID_USUARIO,
                                    start: 0,
                                    limit: Th2_LimiteDeLinhasPaginacao
                                };

                                return CLAS_FISCAL_JsonData;
                            }

                            var OCORRENCIA_RNC_PagingToolbar = new Th2_PagingToolbar();
                            OCORRENCIA_RNC_PagingToolbar.setStore(TB_OCORRENCIA_RNC_Store);

                            function TB_RNC_CARREGA_GRID_PEDIDO_VENDA() {
                                OCORRENCIA_RNC_PagingToolbar.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Carrega_Ocorrencias_por_Pedido_Venda');
                                OCORRENCIA_RNC_PagingToolbar.setParamsJsonData(RetornaRNC_Pedido_Venda_JsonData());
                                OCORRENCIA_RNC_PagingToolbar.doRequest();
                            }

                            function TB_RNC_CARREGA_GRID_PEDIDO_COMPRA() {
                                OCORRENCIA_RNC_PagingToolbar.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Carrega_Ocorrencias_por_Pedido_Compra');
                                OCORRENCIA_RNC_PagingToolbar.setParamsJsonData(RetornaRNC_Pedido_Compra_JsonData());
                                OCORRENCIA_RNC_PagingToolbar.doRequest();
                            }

                            function PopulaFormulario_TB_OCORENCIA_RNC(record) {
                                HNUMERO_RNC.setValue(record.data.NUMERO_RNC);
                                TXT_DATA_RNC.setRawValue(XMLParseDate(record.data.DATA_RNC));
                                TXT_CODIGO_FORNECEDOR.setValue(record.data.CODIGO_FORNECEDOR);
                                LBL_DADOS_FORNECEDOR.setText(record.data.NOME_FANTASIA_FORNECEDOR);
                                TXT_NUMERO_PEDIDO_VENDA.setValue(record.data.NUMERO_PEDIDO_VENDA);
                                TXT_ITEM_PEDIDO_VENDA.setValue(record.data.NUMERO_ITEM_VENDA);
                                TXT_NUMERO_PEDIDO_COMPRA.setValue(record.data.NUMERO_PEDIDO_COMPRA);
                                TXT_ITEM_PEDIDO_COMPRA.setValue(record.data.NUMERO_ITEM_COMPRA);
                                CB_ID_RNC.setValue(record.data.ID_RNC);
                                TXT_DESCRICAO_RNC.setValue(record.data.DESCRICAO);
                                TXT_INSPECIONADOR.setValue(record.data.INSPECIONADOR);
                                TXT_DATA_INSPECAO.setRawValue(XMLParseDate(record.data.DATA_INSPECAO));
                                TXT_SEPARADOR.setValue(record.data.SEPARADOR);
                                TXT_DATA_SEPARACAO.setRawValue(XMLParseDate(record.data.DATA_SEPARACAO));
                                TXT_NUMERO_NF_FORNECEDOR.setValue(record.data.NUMERO_NF_FORNECEDOR);
                                TXT_NUMERO_ORDEM_RNC.setValue(record.data.NUMERO_ORDEM_RNC);
                                CB_STATUS_RNC.setValue(record.data.ID_STATUS_RNC);

                                panelOcorrenciaRNC.setTitle('Alterar dados do Registro');

                                buttonGroup_TB_OCORRENCIA_RNC.items.items[32].enable();
                                form_OcorrenciaRNC.getForm().items.items[0].disable();

                                CB_ID_RNC.focus();
                            }

                            function Edita_Matriz(NUMERO_RNC, NUMERO_ORDEM_RNC) {
                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/Busca_Conteudo_RNC');
                                _ajax.setJsonData({ NUMERO_RNC: NUMERO_RNC, ID_USUARIO: _ID_USUARIO });

                                var _sucess = function(response, options) {
                                    var result = Ext.decode(response.responseText).d;

                                    editor_rnc1.NUMERO_RNC(NUMERO_RNC);
                                    editor_rnc1.NUMERO_ORDEM_RNC(NUMERO_ORDEM_RNC);

                                    editor_rnc1.setConteudo(result);
                                    editor_rnc1.storeRNC(TB_OCORRENCIA_RNC_Store);
                                    editor_rnc1.acao_Corretiva(_acaoCorretivaRNC);
                                    editor_rnc1.tabPanel(tabPanelRNC);
                                    tabPanelRNC.setActiveTab(1);
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }

                            ////////////

                            function GravaDados_TB_OCORRENCIA_RNC() {
                                if (!form_OcorrenciaRNC.getForm().isValid()) {
                                    return;
                                }

                                var dados = {
                                    NUMERO_RNC: HNUMERO_RNC.getValue(),
                                    DATA_RNC: TXT_DATA_RNC.getRawValue(),
                                    CODIGO_FORNECEDOR: TXT_CODIGO_FORNECEDOR.getValue(),
                                    NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO_VENDA ? TXT_NUMERO_PEDIDO_VENDA.getValue() : 0,
                                    NUMERO_ITEM_VENDA: _NUMERO_ITEM_VENDA ? TXT_ITEM_PEDIDO_VENDA.getValue() : 0,
                                    NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA ? TXT_NUMERO_PEDIDO_COMPRA.getValue() : 0,
                                    NUMERO_ITEM_COMPRA: _NUMERO_ITEM_COMPRA ? TXT_ITEM_PEDIDO_COMPRA.getValue() : 0,
                                    ID_RNC: CB_ID_RNC.getValue(),
                                    DESCRICAO_RNC: TXT_DESCRICAO_RNC.getValue(),
                                    INSPECIONADOR: TXT_INSPECIONADOR.getValue(),
                                    DATA_INSPECAO: TXT_DATA_INSPECAO.getRawValue(),
                                    SEPARADOR: TXT_SEPARADOR.getValue(),
                                    DATA_SEPARACAO: TXT_DATA_SEPARACAO.getRawValue().length == 0 ? '01/01/1901' : TXT_DATA_SEPARACAO.getRawValue(),
                                    NUMERO_NF_FORNECEDOR: TXT_NUMERO_NF_FORNECEDOR.getValue(),
                                    NUMERO_ORDEM_RNC: TXT_NUMERO_ORDEM_RNC.getValue() == '' ? 0 : TXT_NUMERO_ORDEM_RNC.getValue(),
                                    ID_STATUS_RNC: CB_STATUS_RNC.getValue(),
                                    ID_USUARIO: _ID_USUARIO
                                };

                                var Url = panelOcorrenciaRNC.title == "Novo Registro de RNC" ?
                        'servicos/TB_OCORRENCIA_RNC.asmx/GravaNovaOcorrencia' :
                        'servicos/TB_OCORRENCIA_RNC.asmx/AtualizaOcorrencia';

                                var _ajax = new Th2_Ajax();
                                _ajax.setUrl(Url);
                                _ajax.setJsonData({ dados: dados });

                                var _sucess = function(response, options) {
                                    if (panelOcorrenciaRNC.title == "Novo Registro de RNC") {
                                        CB_ID_RNC.reset();
                                        TXT_DESCRICAO_RNC.reset();
                                    }

                                    CB_ID_RNC.focus();

                                    if (_NUMERO_PEDIDO_VENDA) {
                                        TB_RNC_CARREGA_GRID_PEDIDO_VENDA();
                                    }
                                    else {
                                        TB_RNC_CARREGA_GRID_PEDIDO_COMPRA();
                                    }
                                };

                                _ajax.setSucesso(_sucess);
                                _ajax.Request();
                            }

                            function Deleta_TB_OCORRENCIA_RNC() {
                                dialog.MensagemDeConfirmacao('Deseja deletar este registro?', form_OcorrenciaRNC.getId(), Deleta);

                                function Deleta(btn) {
                                    if (btn == 'yes') {

                                        var _ajax = new Th2_Ajax();
                                        _ajax.setUrl('servicos/TB_OCORRENCIA_RNC.asmx/DeletaOcorrencia');
                                        _ajax.setJsonData({ NUMERO_RNC: HNUMERO_RNC.getValue(), ID_USUARIO: _ID_USUARIO });

                                        var _sucess = function(response, options) {
                                            CB_ID_RNC.reset();
                                            TXT_DESCRICAO_RNC.reset();

                                            panelOcorrenciaRNC.setTitle("Novo Registro de RNC");
                                            CB_ID_RNC.focus();

                                            buttonGroup_TB_OCORRENCIA_RNC.items.items[32].disable();

                                            if (_NUMERO_PEDIDO_VENDA)
                                                TB_RNC_CARREGA_GRID_PEDIDO_VENDA();
                                            else
                                                TB_RNC_CARREGA_GRID_PEDIDO_COMPRA();
                                        };

                                        _ajax.setSucesso(_sucess);
                                        _ajax.Request();
                                    }
                                }
                            }

                            ////////////

                            var panelOcorrenciaRNC = new Ext.Panel({
                                width: '100%',
                                border: true,
                                title: 'Novo Registro de RNC',
                                items: [form_OcorrenciaRNC, toolbar_TB_OCORRENCIA_RNC, gridOcorrenciaRNC, OCORRENCIA_RNC_PagingToolbar.PagingToolbar()]
                            });

                            TXT_NUMERO_PEDIDO_VENDA.setValue(_NUMERO_PEDIDO_VENDA);
                            TXT_ITEM_PEDIDO_VENDA.setValue(_NUMERO_ITEM_VENDA);
                            TXT_NUMERO_PEDIDO_COMPRA.setValue(_NUMERO_PEDIDO_COMPRA);
                            TXT_ITEM_PEDIDO_COMPRA.setValue(_NUMERO_ITEM_COMPRA);
                            TXT_CODIGO_PRODUTO_VENDA.setValue(_CODIGO_PRODUTO_VENDA);

                            TXT_CODIGO_PRODUTO_COMPRA.setValue(_CODIGO_PRODUTO_COMPRA);
                            TXT_CODIGO_FORNECEDOR.setValue(_CODIGO_FORNECEDOR);

                            if (_CODIGO_FORNECEDOR > 0)
                                Busca_Nome_Fornecedor(_CODIGO_FORNECEDOR);

                            function ResetaFormulario() {
                                form_OcorrenciaRNC.getForm().reset();
                            }

                            function ResetaFormularioTodosOsCampos() {
                                _NUMERO_PEDIDO_VENDA = undefined;
                                _NUMERO_PEDIDO_COMPRA = undefined;
                                _NUMERO_ITEM_VENDA = undefined;
                                _NUMERO_ITEM_COMPRA = undefined;
                                _CODIGO_PRODUTO_VENDA = undefined;
                                _CODIGO_PRODUTO_COMPRA = undefined;

                                form_OcorrenciaRNC.getForm().reset();

                                TXT_NUMERO_PEDIDO_VENDA.setValue(0);
                                TXT_ITEM_PEDIDO_VENDA.setValue(0);
                                TXT_NUMERO_PEDIDO_COMPRA.setValue(0);
                                TXT_ITEM_PEDIDO_COMPRA.setValue(0);
                                TXT_CODIGO_PRODUTO_COMPRA.setValue('');
                                TXT_CODIGO_PRODUTO_VENDA.setValue('');

                                TB_OCORRENCIA_RNC_Store.removeAll();
                            }

                            function CarregaGridPedidoVenda() {
                                TB_RNC_CARREGA_GRID_PEDIDO_VENDA();
                            }

                            function CarregaGridPedidoCompra() {
                                TB_RNC_CARREGA_GRID_PEDIDO_COMPRA();
                            }

                            if (_NUMERO_PEDIDO_VENDA > 0) {
                                CarregaGridPedidoVenda();
                            }

                            if (_NUMERO_PEDIDO_COMPRA > 0) {
                                CarregaGridPedidoCompra();
                            }

                            var _acaoCorretivaRNC = new MontaCadastro_AcaoCorretivaRNC();

                            var tabPanelRNC = new Ext.TabPanel({
                                deferredRender: false,
                                activeTab: 0,
                                defaults: { hideMode: 'offsets' },
                                items: [{
                                    title: "RNC",
                                    closable: false,
                                    autoScroll: false,
                                    iconCls: 'icone_TB_CLIENTE_DADOS_GERAIS',
                                    items: [panelOcorrenciaRNC]
                                }, {
                                    title: "Formul&aacute;rio da RNC",
                                    closable: false,
                                    autoScroll: false,
                                    iconCls: 'icone_Formulario_RNC',
                                    items: [editor_rnc1.Panel()]
                                }, {
                                    title: "A&ccedil;&atilde;o corretiva",
                                    closable: false,
                                    autoScroll: false,
                                    iconCls: 'icone_ACAO_CORRETIVA',
                                    items: [_acaoCorretivaRNC.Panel()]
}],
                                    listeners: {
                                        tabchange: function(tabPanel, panel) {
                                            if (panel.title == 'Formul&aacute;rio da RNC') {
                                                if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                                    dialog.MensagemDeErro('Selecione uma  ordem de RNC no grid para consultar o formul&aacute;rio da RNC', gridOcorrenciaRNC.getId());
                                                    tabPanel.setActiveTab(0);
                                                }
                                                else {
                                                    var record = gridOcorrenciaRNC.getSelectionModel().selections.items[0];
                                                    Edita_Matriz(record.data.NUMERO_RNC, record.data.NUMERO_ORDEM_RNC);
                                                }
                                            }

                                            if (panel.title == 'A&ccedil;&atilde;o corretiva') {
                                                if (gridOcorrenciaRNC.getSelectionModel().getSelections().length == 0) {
                                                    dialog.MensagemDeErro('Selecione uma  ordem de RNC no grid para consultar a(s) a&ccedil;&otilde;es corretiva(s)', gridOcorrenciaRNC.getId());
                                                    tabPanel.setActiveTab(0);
                                                }
                                                else {
                                                    var record = gridOcorrenciaRNC.getSelectionModel().selections.items[0];

                                                    _acaoCorretivaRNC.NUMERO_RNC(record.data.NUMERO_RNC);
                                                    _acaoCorretivaRNC.carregaGrid();
                                                    _acaoCorretivaRNC.resetaFormulario();
                                                    _acaoCorretivaRNC.carregaFormulario();
                                                }
                                            }
                                        }
                                    }
                                });

                                return tabPanelRNC;
                            }