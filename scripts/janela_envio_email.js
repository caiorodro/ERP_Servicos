
function janela_Envio_Email(ID) {

    var _sugestao_contatos = new janela_Sugestao_Contato();
    var _remetenteSaida;
    var _remetenteEntrada;
    var _recordGrid;
    var _modo_impressao = new Modo_Impressao_Email();
    var _ID = ID;
    var _RawBody;

    function Busca_Sugestao_Contatos(elm, digitos) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Sugestao_Contatos');
        _ajax.ExibeDivProcessamento(false);

        if (digitos.lastIndexOf(";") > -1) {
            digitos = digitos.substring(digitos.lastIndexOf(";") + 1);
        }

        _ajax.setJsonData({
            ID_USUARIO: _ID_USUARIO,
            DIGITOS: digitos.trim()
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var _store = _sugestao_contatos.store();
            _store.loadData(criaObjetoXML(result.CONTATOS), false);

            var _store1 = _sugestao_contatos.store1();
            _store1.loadData(criaObjetoXML(result.GRUPOS), false);

            var _acao = function (record) {
                if (!ContatoAdicionado(record.data.EMAIL_CONTATO)) {
                    if (elm.getValue().lastIndexOf(";") == -1) {
                        elm.setValue(record.data.EMAIL_CONTATO + '; ');
                    }
                    else {
                        elm.setValue(elm.getValue().substr(0, elm.getValue().lastIndexOf(";") + 1) + ' ' + record.data.EMAIL_CONTATO + '; ');
                    }
                }
            };

            var _acao1 = function (lista) {

                for (var i = 0; i < lista.length; i++) {
                    if (!ContatoAdicionado(lista[i])) {
                        if (elm.getValue().lastIndexOf(";") == -1) {
                            elm.setValue(lista[i] + '; ');
                        }
                        else {
                            elm.setValue(elm.getValue().substr(0, elm.getValue().lastIndexOf(";") + 1) + ' ' + lista[i] + '; ');
                        }
                    }
                }
            };

            _sugestao_contatos.acao(_acao);
            _sugestao_contatos.acao1(_acao1);
            _sugestao_contatos.show(elm);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function ContatoAdicionado(contato) {
        var _to = TXT_EMAIL_TO.getValue().replace(' ', '').split(';');
        var _cc = TXT_EMAIL_CC.getValue().replace(' ', '').split(';');
        var _bcc = TXT_EMAIL_BCC.getValue().replace(' ', '').split(';');

        if (_to.indexOf(contato) == -1 &&
            _cc.indexOf(contato) == -1 &&
            _bcc.indexOf(contato) == -1) {

            return false;
        }

        return true;
    }

    var TXT_REMETENTE_ENTRADA = new Ext.form.TextField({
        fieldLabel: 'Remetente',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        readOnly: true
        // value: _record_conta_email.data.CONTA_EMAIL
    });

    var TXT_EMAIL_TO = new Ext.form.TextField({
        fieldLabel: 'Destinat&aacute;rios',
        allowBlank: false,
        width: 400,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        enableKeyEvents: true
    });

    TXT_EMAIL_TO.on('keyup', function (f, e) {
        filtraContatos(f, e, true);
    });

    TXT_EMAIL_TO.on('focus', function (f) {
        filtraContatos(f, undefined, false);
    });

    var TXT_EMAIL_CC = new Ext.form.TextField({
        fieldLabel: 'Copiar para',
        width: 400,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        enableKeyEvents: true
    });

    TXT_EMAIL_CC.on('keyup', function (f, e) {
        filtraContatos(f, e, true);
    });

    TXT_EMAIL_CC.on('focus', function (f) {
        filtraContatos(f, undefined, false);
    });

    var TXT_EMAIL_BCC = new Ext.form.TextField({
        fieldLabel: 'C&oacute;pia Oculta',
        width: 400,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        enableKeyEvents: true
    });

    TXT_EMAIL_BCC.on('keyup', function (f, e) {
        filtraContatos(f, e, true);
    });

    TXT_EMAIL_BCC.on('focus', function (f) {
        filtraContatos(f, undefined, false);
    });

    function Busca_Sugestao_Contatos(digitos) {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Sugestao_Contatos');

        if (digitos.lastIndexOf(";") > -1) {
            digitos = digitos.substring(digitos.lastIndexOf(";") + 1);
        }

        _ajax.setJsonData({
            DIGITOS: digitos.trim(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var _TODOS_OS_CONTATOS = new Ext.data.Store({
                reader: new Ext.data.XmlReader({ record: 'Tabela' },
                    ['EMAIL_CONTATO', 'USO']),

                sortInfo: { field: 'USO', direction: 'DESC' }
            });

            _TODOS_OS_CONTATOS.loadData(criaObjetoXML(result.CONTATOS), true);
            _TODOS_OS_CONTATOS.loadData(criaObjetoXML(result.GRUPOS), true);

            var arrRecords = new Array();
            var n = 0;

            for (var i = 0; i < _TODOS_OS_CONTATOS.getCount(); i++) {
                if (TODOS_OS_CONTATOS.find('EMAIL_CONTATO', _TODOS_OS_CONTATOS.getAt(i).data.EMAIL_CONTATO) > -1) {
                    arrRecords[n] = _TODOS_OS_CONTATOS.getAt(i);
                    n++;
                }
            }

            for (i = 0; i < arrRecords.length; i++) {
                _TODOS_OS_CONTATOS.remove(arrRecords[i]);
            }


            TODOS_OS_CONTATOS.insert(TODOS_OS_CONTATOS.getCount(), _TODOS_OS_CONTATOS.getRange());

            _TODOS_OS_CONTATOS.removeAll();
            _TODOS_OS_CONTATOS = undefined;
            delete _TODOS_OS_CONTATOS;
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function filtraContatos(f, e, filtra) {
        if (e) {
            if (e.getKey() == e.DOWN) {
                _sugestao_contatos.grid().getSelectionModel().selectRow(0);
                _sugestao_contatos.grid().getView().focusRow(0);
            }

            if (e.getKey() == e.F8) {
                Busca_Sugestao_Contatos(f.getValue());
            }
        }

        defineAcaoContatos(f);

        if (filtra) {
            var digitos = f.getValue().lastIndexOf(';') == -1 ?
                f.getValue() :
                f.getValue().substr(f.getValue().lastIndexOf(";") + 1).trim();

            TODOS_OS_CONTATOS.filter('EMAIL_CONTATO', digitos, true, false);
        }
    }

    function defineAcaoContatos(f) {
        var elm = f;

        var _acao = function (record) {
            if (_sugestao_contatos.gridGrupos().getStore().getCount() == 0) {
                if (!ContatoAdicionado(record.data.EMAIL_CONTATO)) {
                    if (elm.getValue().lastIndexOf(";") == -1) {
                        elm.setValue(record.data.EMAIL_CONTATO + '; ');
                    }
                    else {
                        elm.setValue(elm.getValue().substr(0, elm.getValue().lastIndexOf(";") + 1) + ' ' + record.data.EMAIL_CONTATO + '; ');
                    }

                    elm.focus();
                }
            }
            else {
                var str1 = '';

                for (var i = 0; i < _sugestao_contatos.gridGrupos().getStore().getCount(); i++) {
                    var record = _sugestao_contatos.gridGrupos().getStore().getAt(i);

                    if (!ContatoAdicionado(record.data.EMAIL_CONTIDO)) {
                        str1 += record.data.EMAIL_CONTIDO + '; ';
                    }
                }

                if (elm.getValue().lastIndexOf(";") == -1) {
                    elm.setValue(str1);
                }
                else {
                    elm.setValue(elm.getValue().substr(0, elm.getValue().lastIndexOf(";") + 1) + ' ' + str1);
                }

                elm.focus();
            }
        };

        _sugestao_contatos.acao(_acao);
    }

    var TXT_ASSUNTO = new Ext.form.TextField({
        fieldLabel: 'Assunto',
        width: 600,
        maxLength: 240,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '240' },
        allowBlank: false
    });

    // Antecipação de pedido

    var htmlCorreria = "<div><center style='width:701px; font-family: Tahoma;'><span><br /></span></center><center style='width:701px; font-family: Tahoma; font-size: 10pt;'><span>Obs.: Este formulário deverá ser enviado para os e-mails";
    htmlCorreria += "<br><b>victor.moreno@indufix.com.br</b> e <b>romeu@indufix.com.br</b> para serem liberados.</span><span><br></span></center><div style='width:687px;border-width:1px;border-style:dotted;font-family:Tahoma;min-height:468px;margin-left:11px'>";
    htmlCorreria += "<br><div style='text-align:center'>Formulário</div><br><center style='min-height:331px'><table style='font-family: Tahoma;'><tbody><tr>";
    htmlCorreria += "<td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* DATA DE ENTREGA</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr><tr><td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* PEDIDO DE VENDA Nº</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr><tr><td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* CLIENTE</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr><tr><td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* FORNECEDOR</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr><tr><td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* OBSERVAÇÕES</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr><tr><td style='border-style:solid;border-width:1px;width:250px;min-height:50px'>* VENDEDOR(A)</td><td style='border-style:solid;border-width:1px;width:250px'>&nbsp;</td>";
    htmlCorreria += "</tr></tbody></table></center><span style='font-family: Tahoma; font-size: 10pt;'>Texto confidencial para uso exclusivo do destinatário. Não o divulgue e apague-o imediatamente se o recebeu por engano.</span></div>";
    htmlCorreria += "</div><br />";

    // ******** End Antecipação de pedido

    var TXT_CORPO_EMAIL = new Th2_HtmlEditor({
        fieldLabel: 'Mensagem',
        width: 1018,
        height: 300,
        allowBlank: false
    });

    TXT_CORPO_EMAIL.on('render', function () {
        var tb1 = TXT_CORPO_EMAIL.tb;

        var BTN_IMPRIMIR1 = new Ext.Button({
            icon: 'imagens/icones/printer_16.gif',
            scale: 'small',
            tooltip: 'Imprimir e-mail',
            listeners: {
                click: function (button, e) {
                    if (hID_MESSAGE.getValue() == 0) {
                        dialog.MensagemDeErro('Salve a mensagem ou selecione uma mensagem existente para imprimir', button.getId());
                        return;
                    }

                    _modo_impressao.show(button.getId());
                }
            }
        });

        var BTN_FORMULARIO_ANTECIPAR_PEDIDO = new Ext.Button({
            icon: 'imagens/icones/data_transport_info_16.gif',
            scale: 'small',
            tooltip: 'Antecipar Pedido',
            listeners: {
                click: function (button, e) {
                    TXT_CORPO_EMAIL.execCmd('insertHTML', htmlCorreria);
                }
            }
        });

        tb1.add('-');
        tb1.addButton(BTN_IMPRIMIR1);

        tb1.add('-');
        tb1.addButton(BTN_FORMULARIO_ANTECIPAR_PEDIDO);

        TXT_CORPO_EMAIL.tb.doLayout(true, true);
    });

    var TXT_CORPO1_EMAIL = new Th2_HtmlEditor({
        fieldLabel: 'Mensagem',
        width: 1018,
        height: 300,
        allowBlank: false
    });

    TXT_CORPO1_EMAIL.on('render', function () {
        var tb2 = TXT_CORPO1_EMAIL.tb;

        var BTN_IMPRIMIR2 = new Ext.Button({
            icon: 'imagens/icones/printer_16.gif',
            scale: 'small',
            tooltip: 'Imprimir e-mail',
            listeners: {
                click: function (button, e) {
                    Imprime_Email(hID_MESSAGE.getValue(), button);
                }
            }
        });

        var BTN_FORMULARIO_ANTECIPAR_PEDIDO2 = new Ext.Button({
            icon: 'imagens/icones/data_transport_info_16.gif',
            scale: 'small',
            tooltip: 'Antecipar Pedido',
            listeners: {
                click: function (button, e) {
                    TXT_CORPO1_EMAIL.execCmd('insertHTML', htmlCorreria);
                }
            }
        });

        tb2.add('-');
        tb2.addButton(BTN_IMPRIMIR2);

        tb2.add('-');
        tb2.addButton(BTN_FORMULARIO_ANTECIPAR_PEDIDO2);

        TXT_CORPO1_EMAIL.tb.doLayout(true, true);
    });

    function Modo_Impressao_Email() {

        var CB_MODO = new Ext.form.ComboBox({
            fieldLabel: 'Formato da impress&atilde;o',
            valueField: 'Opc',
            displayField: 'Opcao',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione',
            selectOnFocus: true,
            width: 140,
            allowBlank: false,
            value: 1,
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['Opc', 'Opcao'],
                data: [[1, 'Retrato'], [2, 'Paisagem']]
            })
        });

        var BTN_IMPRIMIR = new Ext.Button({
            text: 'Imprimir',
            icon: 'imagens/icones/printer_24.gif',
            scale: 'large',
            handler: function () {
                Imprime();
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
                    layout: 'form',
                    columnWidth: .65,
                    items: [CB_MODO]
                }, {
                    columnWidth: .35,
                    items: [BTN_IMPRIMIR]
                }]
            }]
        });

        function Imprime() {
            if (!form1.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_EMAIL.asmx/Imprime_Email');

            _ajax.setJsonData({
                ID_MESSAGE: hID_MESSAGE.getValue(),
                RB: 1,
                MODO: CB_MODO.getValue(),
                NOME_EMITENTE: _NOME_EMITENTE,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;
                window.open(result, '_blank', 'width=1000,height=800');

                Window1.hide();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var Window1 = new Ext.Window({
            layout: 'form',
            title: 'Modo de impress&atilde;o do e-mail',
            iconCls: 'icone_IMPRESSORAS',
            width: 280,
            height: 90,
            closable: false,
            draggable: true,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            },
            items: [form1]
        });

        this.show = function (elm) {
            Window1.show(elm);
        };
    }

    /////

    var layout_corpo_email = false;
    var layout_corpo1_email = false;

    var TAB_PANEL_CORPO_EMAIL = new Ext.TabPanel({
        deferredRender: false,
        height: 329,
        activeTab: 0,
        items: [{
            title: 'HTML',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_COMPLEMENTO'
        }, {
            title: 'Texto',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TEXTO'
        }],
        listeners: {

            tabchange: function (tabPanel, panel) {
                if (tabPanel.activeTab.title == 'HTML') {
                    if (!layout_corpo_email) {
                        panel.add(TXT_CORPO_EMAIL);
                        panel.doLayout();
                        layout_corpo_email = true;
                    }
                }

                if (tabPanel.activeTab.title == 'Texto') {
                    if (!layout_corpo1_email) {
                        panel.add(TXT_CORPO1_EMAIL);
                        panel.doLayout();
                        layout_corpo1_email = true;
                    }
                }
            }
        }
    });

    var CB_PRIORIDADE = new Ext.form.ComboBox({
        fieldLabel: 'Prioridade',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 98,
        allowBlank: false,
        value: 1,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Baixa'], [1, 'Normal'], [2, 'Alta']]
        })
    });

    var hID_MESSAGE = new Ext.form.Hidden({
        value: 0
    });

    // Upload

    var anexoStore = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ARQUIVO'])
    });

    function RemoveAnexo() {

        if (gridAnexos.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione um anexo para remover', gridAnexos.getId());
            return;
        }

        var record = gridAnexos.getSelectionModel().getSelected();

        anexoStore.remove(record);
    }

    var LBL_FRAME1 = new Ext.form.Label();

    var TXT_ANEXO = new Ext.form.TextField({
        fieldLabel: 'Anexo(s)',
        width: 300,
        autoCreate: { tag: 'input', type: 'file' }
    });

    var BTN_ADICIONAR_ANEXO = new Ext.Button({
        icon: 'imagens/icones/attach_add_16.gif',
        scale: 'small',
        text: 'Adicionar anexo',
        handler: function () {
            AdicionaAnexo(TXT_ANEXO.getValue(), _ID);
        }
    });

    var BTN_REMOVER_ANEXO = new Ext.Button({
        icon: 'imagens/icones/attach_remove_16.gif',
        scale: 'small',
        text: 'Remover anexo&nbsp;',
        handler: function () {
            RemoveAnexo();
        }
    });

    var gridAnexos = new Ext.grid.GridPanel({
        id: 'gridAnexos' + _ID,
        store: anexoStore,
        columns: [
        { id: 'ARQUIVO', header: "Anexo(s)", width: 326, sortable: true, dataIndex: 'ARQUIVO' }
        ],
        stripeRows: true,
        height: 85,
        width: '100%',
        columnLines: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
            }
        }
    });

    var panelAnexos = new Ext.Panel({
        width: '100%',
        height: 'auto',
        border: false,
        frame: true,
        items: [BTN_REMOVER_ANEXO]
    });

    var cancelarProcessamento = true;

    var LBL_PROCESSO_RECEBER = new Ext.form.Label();

    var BTN_CANCELAR_PROCESSO = new Ext.Button({
        text: 'Cancelar',
        icon: 'imagens/icones/cancel_16.gif',
        scale: 'small',
        handler: function () {
            cancelarProcessamento = true;
            Atualiza_Status_Processamento("&nbsp;", false);
        }
    });

    var panelResultado = new Ext.Panel({
        width: '100%',
        border: true,
        frame: true,
        height: 43,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.05,
                items: [{
                    xtype: 'box',
                    id: 'gif_processamento_email' + _ID,
                    autoEl: {
                        tag: 'img',
                        src: 'imagens/70.gif'
                    }
                }]
            }, {
                columnWidth: .16,
                items: [BTN_CANCELAR_PROCESSO]
            }, {
                columnWidth: .79,
                items: [LBL_PROCESSO_RECEBER]
            }]
        }]
    });

    Ext.getCmp('gif_processamento_email' + _ID).setVisible(false);
    BTN_CANCELAR_PROCESSO.setVisible(false);

    var LBL_SPACER = new Ext.form.Label();
    LBL_SPACER.setText("&nbsp;", false);

    var LBL_SPACER1 = new Ext.form.Label();
    LBL_SPACER1.setText("&nbsp;", false);

    var LBL_SPACER2 = new Ext.form.Label();
    LBL_SPACER2.setText("&nbsp;", false);

    var LBL_SPACER3 = new Ext.form.Label();
    LBL_SPACER3.setText("&nbsp;", false);

    var formEMAIL = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'left',
        width: '100%',
        items: [{
            layout: 'column',
            items: [{
                items: [{
                    layout: 'form',
                    items: [TXT_REMETENTE_ENTRADA]
                }, {
                    layout: 'form',
                    items: [TXT_EMAIL_TO]
                }, {
                    layout: 'form',
                    items: [TXT_EMAIL_CC]
                }, {
                    layout: 'form',
                    items: [TXT_EMAIL_BCC]
                }]
            }, {
                items: [LBL_SPACER]
            }, {
                items: [_sugestao_contatos.grid()]
            }, {
                items: [LBL_SPACER1]
            }, {
                items: [_sugestao_contatos.gridGrupos()]
            }]
        }, { layout: 'column',
            items: [{
                columnWidth: .70,
                layout: 'form',
                items: [TXT_ASSUNTO]
            }, {
                columnWidth: .20,
                layout: 'form',
                labelWidth: 60,
                items: [CB_PRIORIDADE]
            }]
        }, {
            items: [TAB_PANEL_CORPO_EMAIL]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                items: [LBL_FRAME1]
                //items: [TXT_ANEXO]
            }, { items: [panelAnexos]
            }, {
                items: [gridAnexos]
            }]
        }]
    });

    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            id: 'BTN_SALVAR_EMAIL' + _ID,
            text: 'Salvar',
            scale: 'medium',
            icon: 'imagens/icones/database_save_24.gif',
            handler: function () {
                Salva_Mensagem_Como_Rascunho();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Nova mensagem',
            scale: 'medium',
            icon: 'imagens/icones/mail_star_24.gif',
            handler: function () {
                Reseta_Formulario();
                Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).disable();
                Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).disable();

                TXT_CORPO_EMAIL.setValue('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
                TXT_CORPO1_EMAIL.setValue('<br /><br /><br />' + _record_conta_email.data.ASSINATURA);
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_RESPONDER_EMAIL1' + _ID,
            text: 'Responder',
            scale: 'medium',
            icon: 'imagens/icones/admin_reload_24.gif',
            handler: function () {
                Responder_Mensagem();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_ENCAMINHAR_EMAIL1' + _ID,
            text: 'Encaminhar',
            scale: 'medium',
            icon: 'imagens/icones/attach_next_24.gif',
            handler: function () {
                Encaminhar_Mensagem();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            id: 'BTN_ENVIAR_EMAIL1' + _ID,
            text: 'Enviar',
            scale: 'medium',
            icon: 'imagens/icones/mail_next_24.gif',
            handler: function () {
                Envia_Mensagem();
            }
        }]
    });

    function Responder_Mensagem() {
        var _id_message = hID_MESSAGE.getValue();
        Reseta_Formulario();
        hID_MESSAGE.setValue(_id_message);
        Busca_Mensagem_para_Responder();
        Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).disable();
        Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).disable();
        TXT_CORPO_EMAIL.focus();
    }

    function Encaminhar_Mensagem() {
        var _id_message = hID_MESSAGE.getValue();

        //////
        Reseta_Formulario();
        //////

        //TXT_EMAIL_TO.reset();
        //TXT_EMAIL_CC.reset();
        //TXT_EMAIL_BCC.reset();
        //TXT_ASSUNTO.reset();
        TXT_REMETENTE_ENTRADA.setValue(_record_conta_email.data.CONTA_EMAIL);

        TXT_CORPO_EMAIL.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");
        CB_PRIORIDADE.setValue(1);

        //////
        hID_MESSAGE.setValue(_id_message);
        Busca_Mensagem_para_Encaminhar();
        Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).disable();
        Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).disable();
        Ext.getCmp('BTN_ENVIAR_EMAIL1' + _ID).enable();
        TXT_EMAIL_TO.focus();
    }

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    function Salva_Mensagem_Como_Rascunho(pAcao_Sucesso) {
        if (!formEMAIL.getForm().isValid()) {
            return;
        }

        var _remetente = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL));

        var dados = {
            ID_MESSAGE: hID_MESSAGE.getValue(),
            ID_CONTA_EMAIL: _remetente.data.ID_CONTA_EMAIL,
            FROM_ADDRESS: _remetente.data.CONTA_EMAIL,
            PRIORITY: CB_PRIORIDADE.getValue(),
            SUBJECT: TXT_ASSUNTO.getValue(),
            BODY: TAB_PANEL_CORPO_EMAIL.getActiveTab().title == 'HTML' ? TXT_CORPO_EMAIL.getValue() : TXT_CORPO1_EMAIL.getValue(),
            RAW_BODY: TAB_PANEL_CORPO_EMAIL.getActiveTab().title == 'HTML' ? TXT_CORPO_EMAIL.getValue() : TXT_CORPO1_EMAIL.getValue(),
            NUMERO_CRM: _NUMERO_CRM ? _NUMERO_CRM : 0
        };

        var _To = TXT_EMAIL_TO.getValue().replace(' ', '').split(';');
        var _Cc = TXT_EMAIL_CC.getValue().replace(' ', '').split(';');
        var _Bcc = TXT_EMAIL_BCC.getValue().replace(' ', '').split(';');

        var Attachments = new Array();

        for (var i = 0; i < anexoStore.getCount(); i++) {
            Attachments[i] = anexoStore.getAt(i).data.ARQUIVO;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Salva_Mensagem_como_Rascunho');

        _ajax.setJsonData({
            dados: dados,
            TOs: _To,
            CCs: _Cc,
            BCCs: _Bcc,
            Attachments: Attachments,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            hID_MESSAGE.setValue(result);

            if (_recordGrid) {
                _recordGrid.beginEdit();
                _recordGrid.set('BODY', TAB_PANEL_CORPO_EMAIL.getActiveTab().title == "HTML" ?
                                                            TXT_CORPO_EMAIL.getValue() : TXT_CORPO1_EMAIL.getValue());
                _recordGrid.set('ID_MESSAGE', result);
                _recordGrid.endEdit();
                _recordGrid.commit();
            }

            if (pAcao_Sucesso) {
                util.FinalizaSolicitacao(); // oculta div de processamento
                var ocultaJanelaAposEnvio = true;
                pAcao_Sucesso(result, ocultaJanelaAposEnvio);
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Reseta_Formulario() {

        Ext.getCmp('BTN_SALVAR_EMAIL' + _ID).enable();
        Ext.getCmp('BTN_ENVIAR_EMAIL1' + _ID).enable();
        Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).enable();
        Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).enable();

        hID_MESSAGE.setValue(0);

        TXT_EMAIL_TO.setValue('');
        TXT_EMAIL_CC.setValue('');
        TXT_EMAIL_BCC.setValue();
        TXT_ASSUNTO.setValue('');
        TXT_REMETENTE_ENTRADA.setValue(_record_conta_email.data.CONTA_EMAIL);

        TXT_CORPO_EMAIL.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");
        TXT_CORPO1_EMAIL.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");

        CB_PRIORIDADE.setValue(1);

        while (Ext.getCmp('gridAnexos' + _ID).getStore().getCount() > 0)
            Ext.getCmp('gridAnexos' + _ID).getStore().removeAt(0);

        TXT_EMAIL_TO.focus();
    }

    function Busca_Mensagem() {

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Mensagem');
        _ajax.setJsonData({
            ID_MESSAGE: hID_MESSAGE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            var Tos = "";

            for (var i = 0; i < result.To.length; i++) {
                Tos += result.To[i] + "; ";
            }

            var CCs = "";

            for (var i = 0; i < result.CC.length; i++) {
                CCs += result.CC[i] + "; ";
            }

            TXT_EMAIL_TO.setValue(Tos);
            TXT_EMAIL_CC.setValue(CCs);

            TXT_ASSUNTO.setValue(result.SUBJECT);
            TXT_CORPO_EMAIL.setValue(result.BODY);
            TXT_CORPO1_EMAIL.setValue(result.RAW_BODY);

            CB_PRIORIDADE.setValue(result.PRIORITY);

            anexoStore.loadData(criaObjetoXML(result.Attachments), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Busca_Mensagem_para_Responder() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Mensagem_para_Responder');
        _ajax.setJsonData({
            ID_MESSAGE: hID_MESSAGE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            hID_MESSAGE.setValue(0);

            var result = Ext.decode(response.responseText).d;

            var Tos = result.To;

            TXT_EMAIL_TO.setValue(Tos);

            var stringBody = result.BODY;
            stringBody = stringBody.replace("<br /><br /><hr style='border-width: 1px; border-style: dotted; border-color: #000000;'>",
                                                        "<br /><br />" + _record_conta_email.data.ASSINATURA +
                                                        "<hr style='border-width: 1px; border-style: dotted; border-color: #000000;'><br /><br /><br /><br /><br />");

            TXT_ASSUNTO.setValue(result.SUBJECT);
            TXT_CORPO_EMAIL.setValue(stringBody);
            TXT_CORPO1_EMAIL.setValue(stringBody);

            CB_PRIORIDADE.setValue(result.PRIORITY);

        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Busca_Mensagem_para_Responder_a_Todos() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Mensagem_para_Responder_a_Todos');
        _ajax.setJsonData({
            ID_MESSAGE: hID_MESSAGE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            hID_MESSAGE.setValue(0);

            var result = Ext.decode(response.responseText).d;

            var Tos = result.To;

            TXT_EMAIL_TO.setValue(Tos);
            TXT_EMAIL_CC.setValue(result.CC);

            var stringBody = result.BODY;
            stringBody = stringBody.replace("<br /><br /><hr style='border-width: 1px; border-style: dotted; border-color: #000000;'>",
                                                        "<br /><br />" + _record_conta_email.data.ASSINATURA +
                                                        "<hr style='border-width: 1px; border-style: dotted; border-color: #000000;'><br /><br /><br /><br /><br />");

            TXT_ASSUNTO.setValue(result.SUBJECT);
            TXT_CORPO_EMAIL.setValue(stringBody);
            TXT_CORPO1_EMAIL.setValue(stringBody);

            CB_PRIORIDADE.setValue(result.PRIORITY);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Busca_Mensagem_para_Encaminhar() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Mensagem_para_Encaminhar');
        _ajax.setJsonData({
            ID_MESSAGE: hID_MESSAGE.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            hID_MESSAGE.setValue(0);

            var result = Ext.decode(response.responseText).d;

            var Tos = result.To;

            TXT_EMAIL_TO.setValue(Tos);

            TXT_ASSUNTO.setValue(result.SUBJECT);

            var stringBody = result.BODY;
            stringBody = stringBody.replace("<br /><br /><hr style='border-width: 1px; border-style: dotted; border-color: #000000;'>",
                                                        "<br /><br />" + _record_conta_email.data.ASSINATURA +
                                                        "<hr style='border-width: 1px; border-style: dotted; border-color: #000000;'><br /><br /><br /><br /><br />");

            TXT_CORPO_EMAIL.setValue(stringBody);
            TXT_CORPO1_EMAIL.setValue(stringBody);

            CB_PRIORIDADE.setValue(result.PRIORITY);

            anexoStore.removeAll();

            for (var i = 0; i < result.anexos.length; i++) {
                AdicionaAnexo(result.anexos[i], _ID);
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Atualiza_Status_Processamento(_mensagem, exibe) {
        LBL_PROCESSO_RECEBER.setText(_mensagem, false);

        BTN_CANCELAR_PROCESSO.setVisible(exibe);

        if (!exibe) {
            buttonGroup1.enable();
        }
        else {
            buttonGroup1.disable();
        }

        Ext.getCmp('gif_processamento_email' + _ID).setVisible(exibe);
    }

    function Envia_Mensagem() {

        var _acao = function (ID_MESSAGE) {
            var ID_MESSAGE = hID_MESSAGE.getValue();

            cancelarProcessamento = false;

            processaEnvio(ID_MESSAGE, true);
        };

        Salva_Mensagem_Como_Rascunho(_acao);
    }

    var _NUMERO_DO_REGISTRO = 0;

    function processaEnvio(ID_MESSAGE, ocultaJanelaAposEnvio) {

        var _email = TXT_EMAIL_TO.getValue().length > 20 ?
                                                TXT_EMAIL_TO.getValue().substr(0, 20) :
                                                TXT_EMAIL_TO.getValue();

        Atualiza_Status_Processamento("<div style='font-size: 8pt; color: darkblue; width: 100%; height: " +
                                                (panelResultado.height / 2) + "px; overflow: auto;'><b>Aguarde. Enviando a mensagem para " +
                                                _email + " ...</b>", true);

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Envia_Email_que_estava_gravado_como_rascunho');
        _ajax.ExibeDivProcessamento(false);
        _ajax.setReportaErro(false);

        _ajax.setJsonData({
            ID_MESSAGE: ID_MESSAGE,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Atualiza_Status_Processamento("&nbsp;", false);

            if (ocultaJanelaAposEnvio)
                wENVIO_EMAIL.hide();
        };

        var _falha = function (response, options) {
            var erro = Ext.decode(response.responseText).Message;

            Atualiza_Status_Processamento("<div style='font-size: 8pt; width: 100%; height: " +
                                                    (panelResultado.height / 2) + "px; overflow: auto;'>Erro: <span style='color: darkred;'>" + erro + "</span></div>", false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.setFalha(_falha);
        _ajax.Request();
    }

    var wENVIO_EMAIL = new Ext.Window({
        layout: 'form',
        title: 'Nova Mensagem',
        iconCls: 'icone_ENVIA_COTACAO',
        width: 1050,
        height: 641,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            hide: function (w) {
                if (Ext.getCmp(_id_janela_definicao_tabela_html_editor)) {
                    Ext.getCmp(_id_janela_definicao_tabela_html_editor).hide();
                }
            }
        },
        items: [formEMAIL, {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .48,
                items: [toolbar1]
            }, {
                columnWidth: .52,
                items: [panelResultado]
            }]
        }]
    });

    this.show = function (elm) {
        LBL_FRAME1.setText("<iframe style='width: 553px; height: 85px; border-width: 0px;' src='formUpload.aspx?ID=" + _ID + "&ID_USUARIO=" + _ID_USUARIO + "'></iframe>", false);
        wENVIO_EMAIL.show(elm);
    };

    this.setRemetente = function (pValue) {
        TXT_REMETENTE_ENTRADA.setValue(pValue);
    };

    this.resetaFormulario = function () {
        Reseta_Formulario();
    };

    this.setDestinatario = function (pValue) {
        TXT_EMAIL_TO.setValue(pValue);
    };

    this.setAssunto = function (pValue) {
        TXT_ASSUNTO.setValue(pValue);
    };

    this.setBody = function (pValue) {
        TXT_CORPO_EMAIL.setValue(pValue);
    };

    this.setRawBody = function (pValue) {
        TXT_CORPO1_EMAIL.setValue(pValue);
    };

    this.seta_ID_Message = function (pValue) {
        hID_MESSAGE.setValue(pValue);
    };

    this.BuscaMensagem = function () {
        Busca_Mensagem();
    };

    this.BuscaMensagemParaResponder = function () {
        Busca_Mensagem_para_Responder();
    };

    this.BuscaMensagemparaResponderaTodos = function () {
        Busca_Mensagem_para_Responder_a_Todos();
    };

    this.BuscaMensagemparaEncaminhar = function () {
        Busca_Mensagem_para_Encaminhar();
    };

    this.AdicionaNovoAnexo = function (pValue) {
        AdicionaAnexo(pValue, _ID);
    };

    this.recordGrid = function (pValue) {
        _recordGrid = pValue;
    };

    var _NUMERO_CRM;

    this.NUMERO_CRM = function (pValue) {
        _NUMERO_CRM = pValue;
    };

    this.Botao_Salvar = function (pValue) {
        if (pValue) {
            Ext.getCmp('BTN_SALVAR_EMAIL' + _ID).enable();
        }
        else {
            Ext.getCmp('BTN_SALVAR_EMAIL' + _ID).disable();
        }
    };

    this.Botao_Enviar = function (pValue) {
        if (pValue) {
            Ext.getCmp('BTN_ENVIAR_EMAIL1' + _ID).enable();
        }
        else {
            Ext.getCmp('BTN_ENVIAR_EMAIL1' + _ID).disable();
        }
    };

    this.Botao_Responder = function (pValue) {
        if (pValue) {
            Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).enable();
        }
        else {
            Ext.getCmp('BTN_RESPONDER_EMAIL1' + _ID).disable();
        }
    };

    this.Botao_Encaminhar = function (pValue) {
        if (pValue) {
            Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).enable();
        }
        else {
            Ext.getCmp('BTN_ENCAMINHAR_EMAIL1' + _ID).disable();
        }
    };
}

function AdicionaAnexo(arquivo, ID) {
    if (arquivo.trim().length > 0) {

        var _store = Ext.getCmp('gridAnexos' + ID).getStore();

        arquivo = arquivo.replace(/^.*\\/, '');

        var _pasta = combo_EMAIL_CONTA_Store.getAt(combo_EMAIL_CONTA_Store.find('ID_CONTA_EMAIL', _record_conta_email.data.ID_CONTA_EMAIL)).data.PASTA_ANEXOS;

        if (!_pasta.endsWith('\\')) {
            _pasta += '\\';
        }

        arquivo = _pasta + arquivo;

        var existe = false;

        for (var i = 0; i < _store.getCount(); i++) {
            if (_store.getAt(i).data.ARQUIVO == arquivo) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            var new_record = Ext.data.Record.create([{ name: 'ARQUIVO'}]);

            var novo = new new_record({
                ARQUIVO: arquivo
            });

            _store.insert(_store.getCount(), novo);
            //TXT_ANEXO.reset();
        }
    }
}
