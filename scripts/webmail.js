var MENSAGENS_BAIXADAS = 0;
var cancelarProcessamento = true;
var _webMailStore;
var _acaoRecebeMensagens;

function janela_Filtro_Pasta() {

    this.pastasSelecionadas = function () {
        var arr1 = readCookie("pasta_email");

        try { arr1 = arr1.split(','); } catch (e) { }

        return arr1 ? arr1 : new Array();
    };

    var checkBoxFP_ = new Ext.grid.CheckboxSelectionModel();

    var grid_Filtro_Pasta = new Ext.grid.GridPanel({
        store: combo_EMAIL_PASTA_Store,
        columns: [
        checkBoxFP_,
        { id: 'DESCRICAO_PASTA2', header: "Descri&ccedil;&atilde;o da Pasta", width: 270, sortable: true, dataIndex: 'DESCRICAO_PASTA2',
            renderer: descricao_pasta_email
        }
        ],
        stripeRows: true,
        height: 273,
        width: '100%',

        sm: checkBoxFP_
    });

    var _recarregar_grid_emails = false;

    var toolbar1 = new Ext.Toolbar({
        items: [{
            text: 'Ok',
            icon: 'imagens/icones/Ok_16.gif',
            scale: 'small',
            handler: function () {
                wFILTRO_PASTA.hide();
                _recarregar_grid_emails = true;
            }
        }]
    });

    var wFILTRO_PASTA = new Ext.Window({
        layout: 'form',
        title: 'Selecione a(s) pasta(s) que deseja filtrar',
        width: 332,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                _recarregar_grid_emails = false;
                w.hide();
            },
            hide: function () {
                showFiltroPastas = false;

                var arr1 = new Array();

                for (var i = 0; i < grid_Filtro_Pasta.getSelectionModel().selections.items.length; i++) {
                    arr1[i] = grid_Filtro_Pasta.getSelectionModel().selections.items[i].data.ID_PASTA;
                }

                eraseCookie("pasta_email");
                createCookie("pasta_email", arr1, 180);

                if (_recarregar_grid_emails)
                    _webMail.TB_EMAIL_CARREGA_GRID();
            },
            show: function () {
                showFiltroPastas = true;
            }
        },
        items: [grid_Filtro_Pasta, toolbar1]
    });

    this.show = function (elm) {
        var arr1 = readCookie("pasta_email");

        if (arr1) {
            arr1 = arr1.split(',');

            checkBoxFP_.deselectRange(0, checkBoxFP_.getCount() - 1);

            var arrIndex = new Array();

            for (var i = 0; i < arr1.length; i++) {
                var index = combo_EMAIL_PASTA_Store.find('ID_PASTA', arr1[i]);
                // usar getRange
                if (index > -1)
                    arrIndex[arrIndex.length] = index;
            }

            checkBoxFP_.selectRows(arrIndex);
        }

        wFILTRO_PASTA.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wFILTRO_PASTA.toFront();
        wFILTRO_PASTA.show(elm.getId());
    };

    this.hide = function () {
        wFILTRO_PASTA.hide();
    };
}

function janela_pastas_TreeView() {
    var root1 = new Ext.tree.TreeNode({
        expanded: true,
        text: 'Pastas',
        leaf: false,
        icon: 'imagens/icones/book_16.gif',
        id: '0'
    });

    var treePastas = new Ext.tree.TreePanel({
        border: false,
        shadow: true,
        width: 'auto',
        autoScroll: true,
        collapsible: true,
        useArrows: true,
        split: true,
        cls: 'Th2Menu',
        root: root1,
        height: 270,
        rootVisible: true
    });

    var wFILTRO_PASTA = new Ext.Window({
        layout: 'form',
        title: 'Selecione a pasta que deseja filtrar',
        width: 332,
        height: 'auto',
        closable: false,
        draggable: false,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            hide: function () {
                showFiltroPasta = false;
            },
            show: function () {
                showFiltroPasta = true;
            }
        },
        items: [treePastas]
    });

    this.show = function (elm) {
        wFILTRO_PASTA.setPosition(elm.getPosition()[0], elm.getPosition()[1] + elm.getHeight());
        wFILTRO_PASTA.toFront();
        wFILTRO_PASTA.show(elm.getId());

        Lista_Pastas();
    };

    this.hide = function () {
        wFILTRO_PASTA.hide();
    };

    function Lista_Pastas() {

        var xNode = root1;

        while (xNode.childNodes.length > 0) {
            xNode.removeChild(xNode.firstChild);
        }

        for (var i = 0; i < combo_EMAIL_PASTA_Store.getCount(); i++) {

            if (combo_EMAIL_PASTA_Store.getAt(i).data.PASTA_SUPERIOR == 0 ||
                    combo_EMAIL_PASTA_Store.getAt(i).data.PASTA_SUPERIOR == '') {

                var novoNode = new Ext.tree.TreeNode({
                    text: descricao_pasta_email(combo_EMAIL_PASTA_Store.getAt(i).data.NAO_LIDOS, null, combo_EMAIL_PASTA_Store.getAt(i)),
                    icon: 'imagens/icones/book_16.gif',
                    expandable: true,
                    leaf: false,
                    id: combo_EMAIL_PASTA_Store.getAt(i).data.ID_PASTA,
                    listeners: {
                        click: function (e) {
                            _webMail.TB_EMAIL_CARREGA_GRID_UMA_PASTA(e.attributes.id);
                            wFILTRO_PASTA.hide();
                        },
                        expand: function (n) {
                            Busca_Sub_Pastas(n, n.attributes.id);
                        },
                        collapse: function (n) {
                            while (n.childNodes.length > 0) {
                                n.removeChild(n.firstChild);
                            }
                        }
                    }
                });

                xNode.appendChild([novoNode]);
            }
        }

        xNode.expand();

        function Busca_Sub_Pastas(node, ID_PASTA) {

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Sub_Pastas');

            _ajax.setJsonData({
                ID_PASTA: ID_PASTA,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                for (var i = 0; i < result.length; i++) {
                    var novoNode = new Ext.tree.TreeNode({
                        text: descricao_subpasta_email(result[i]),
                        icon: 'imagens/icones/book_16.gif',
                        expandable: true,
                        leaf: false,
                        id: result[i].ID_PASTA,
                        listeners: {
                            click: function (e) {
                                _webMail.TB_EMAIL_CARREGA_GRID_UMA_PASTA(e.attributes.id);
                                wFILTRO_PASTA.hide();
                            },
                            expand: function (n) {
                                Busca_Sub_Pastas(n, n.attributes.id);
                            },
                            collapse: function (n) {
                                while (n.childNodes.length > 0) {
                                    n.removeChild(n.firstChild);
                                }
                            }
                        }
                    });

                    node.appendChild([novoNode]);
                }
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }
}

function Solicita_Unico_Anexo(ID_MESSAGE, ID_ATTACHMENT) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Baixa_Anexo');

    _ajax.setJsonData({
        ID_MESSAGE: ID_MESSAGE,
        ID_ATTACHMENT: ID_ATTACHMENT,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        window.open(result, '_blank', 'width=1000,height=800');
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function janelaAnexos() {
    var _anexosStore = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ARQUIVO', 'ID_ATTACHMENT', 'MEDIA_TYPE'])
    });

    function anexo(val) {
        return "<span style='width: 100%; cursor: pointer;' title='Clique para editar o nome do anexo'>" + val + "</span>";
    }

    var TXT_NOME_ANEXO1 = new Ext.form.TextField({
        maxLength: 256,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 256 }
    });

    function abrir_anexo(val) {
        return "<span style='cursor: pointer;'><img src='imagens/icones/file_next_16.gif' title='Clique para baixar o anexo' /></span>";
    }

    var _gridAnexos = new Ext.grid.EditorGridPanel({
        store: _anexosStore,
        columns: [
        { id: 'ARQUIVO', header: "Arquivo", width: 376, sortable: true, dataIndex: 'ARQUIVO', editor: TXT_NOME_ANEXO1 },
        { id: 'ABRIR', header: "Abrir", width: 50, sortable: true, dataIndex: 'ABRIR', renderer: abrir_anexo },
        { id: 'MEDIA_TYPE', header: "Media / Type", width: 260, sortable: true, dataIndex: 'MEDIA_TYPE' }
        ],
        stripeRows: true,
        height: 140,
        width: '100%',
        columnLines: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        clicksToEdit: 2,

        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'ABRIR') {
                    Solicita_Unico_Anexo(_ID_MESSAGE, record.data.ID_ATTACHMENT);
                }
            },
            afterEdit: function (e) {
                if (e.value != e.originalValue) {

                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_EMAIL.asmx/Altera_Nome_Anexo');
                    _ajax.ExibeDivProcessamento(false);

                    _ajax.setJsonData({
                        ID_ATTACHMENT: e.record.data.ID_ATTACHMENT,
                        NAME: e.value,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        e.record.commit();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    });

    var wAnexos = new Ext.Window({
        title: 'Anexos do e-mail',
        layout: 'form',
        iconCls: 'icone_PLANO_CONTAS',
        width: 716,
        height: 150,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: false,
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        },
        items: [_gridAnexos]
    });

    var _ID_MESSAGE;

    this.ID_MESSAGE = function (pValue) {
        _ID_MESSAGE = pValue;
    };

    this.show = function (elm, x, y) {
        Busca_Anexos();
        wAnexos.setPosition(x - (_gridAnexos.getWidth() + 31), y);
        wAnexos.toFront();
        wAnexos.show(elm);
    };

    function Busca_Anexos() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Anexos');

        _ajax.setJsonData({
            ID_MESSAGE: _ID_MESSAGE,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            _anexosStore.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }
}

var _record_conta_email;

var showFiltroPastas = false;
var showFiltroPasta = false;

function Doran_Web_Mail() {

    function janela_Mover_Mensagens() {

        var CB_MOVER = new Ext.form.Checkbox({
            checked: true,
            boxLabel: 'Gravar as mensagens novas deste(s) remetente(s) sempre nesta pasta'
        });

        var formMover = new Ext.FormPanel({
            bodyStyle: 'padding:2px 2px 0',
            frame: true,
            width: '100%',
            items: [{
                layout: 'form',
                labelWidth: 5,
                items: [CB_MOVER]
            }],
            bbar: [{
                text: 'Ok',
                icon: 'imagens/icones/Ok_24.gif',
                scale: 'medium',
                handler: function () {
                    Move_Mensagens();
                }
            }]
        });

        var wMoverMensagens = new Ext.Window({
            title: 'Mover mensagen(s) entre pastas',
            layout: 'form',
            iconCls: 'icone_TB_PASTA_EMAIL',
            width: 510,
            height: 103,
            closable: false,
            draggable: true,
            resizable: false,
            minimizable: true,
            modal: true,
            renderTo: Ext.getBody(),
            listeners: {
                minimize: function (w) {
                    w.hide();
                }
            },
            items: [formMover]
        });

        var _ID_MESSAGES;

        this.ID_MESSAGES = function (pValue) {
            _ID_MESSAGES = pValue;
        };

        var _ID_PASTA;

        this.ID_PASTA = function (pValue) {
            _ID_PASTA = pValue;
        };

        var _records;

        this.records = function (pValue) {
            _records = pValue;
        };

        this.show = function (elm) {
            CB_MOVER.setValue(false);
            wMoverMensagens.show(elm);
        };

        function Move_Mensagens() {
            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_EMAIL.asmx/Move_emails_para_outra_pasta');

            _ajax.setJsonData({
                ID_PASTA: _ID_PASTA,
                ID_MESSAGES: _ID_MESSAGES,
                PASTA_DEFINITIVA: CB_MOVER.checked ? 1 : 0,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                for (var i = 0; i < _records.length; i++) {
                    var record = _records[i];

                    record.beginEdit();
                    record.set('ID_PASTA', _record_mover_para.data.ID_PASTA);
                    record.set('DESCRICAO_PASTA', _record_mover_para.data.DESCRICAO_PASTA);
                    record.set('COR_FUNDO', _record_mover_para.data.COR_FUNDO);
                    record.set('COR_LETRA', _record_mover_para.data.COR_LETRA);
                    record.set('PASTA_ESPECIFICA', _record_mover_para.data.PASTA_ESPECIFICA);
                    record.endEdit();
                    record.commit();

                    Habilita_Botoes(record);

                    wMoverMensagens.hide();
                }
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }
    }

    // Identificação

    var _janelaEmailConta = new janelaEmailConta();
    var _janelaAnexos = new janelaAnexos();
    var _janela_Mover_Mensagens = new janela_Mover_Mensagens();
    var _janela_Pasta_Email = new janela_Pasta_Email();
    var _janela_Filtro_Pasta = new janela_Filtro_Pasta();
    var _janela_pastas_TreeView = new janela_pastas_TreeView();
    var _janela_Email_Spam = new janela_Email_Spam();
    var _janela_Contatos_Email = new janela_Contatos_Email();
    var _janela_Grupo_Email = new janela_Grupo_Email();

    var _modo_impressao = new Modo_Impressao_Email();

    var _janela_programacao_email = new janela_programacao_email();

    var CB_USUARIO_CONTA = new Ext.form.ComboBox({
        id: 'CB_USUARIO_CONTA',
        store: combo_TB_USUARIO_Store,
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        fieldLabel: 'Usu&aacute;rio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 150,
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                CB_EMAIL_CONTA.reset();

                if (index > -1) {
                    CARREGA_EMAIL_CONTA(record.data.ID_USUARIO);
                    webMailStore.removeAll();
                }
            }
        }
    });

    var CB_EMAIL_CONTA = new Ext.form.ComboBox({
        id: 'CB_EMAIL_CONTA',
        store: combo_EMAIL_CONTA_Store,
        valueField: 'ID_CONTA_EMAIL',
        displayField: 'CONTA_EMAIL',
        fieldLabel: 'Conta de e-mail',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        listeners: {
            select: function (combo, record, index) {
                if (index > -1) {
                    Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                }
                else {
                    Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').disable();
                }

                _record_conta_email = record;
            }
        }
    });

    var CB_VERIFICAR_NOVOS_EMAILS = new Ext.form.ComboBox({
        fieldLabel: 'Verificar novos e-mails',
        id: 'VERIFICAR_NOVOS_EMAILS',
        name: 'VERIFICAR_NOVOS_EMAILS',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 250,
        allowBlank: false,
        value: readCookie("verificacao_novos_emails") ? readCookie("verificacao_novos_emails") : 0,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Não verificar novos e-mails'], [5, 'Verificar novos e-mails a cada 5 minutos'],
                        [10, 'Verificar novos e-mails a cada 10 minutos'], [15, 'Verificar novos e-mails a cada 15 minutos'],
                        [18, 'Verificar novos e-mails a cada 20 minutos']]
        }),
        listeners: {
            select: function (combo, record, index) {
                eraseCookie("verificacao_novos_emails");
                createCookie("verificacao_novos_emails", record.data.Opc, 180);
            }
        }
    });

    var panelIdentificacao = new Ext.Panel({
        width: '100%',
        height: 60,
        border: true,
        frame: true,
        collapsible: true,
        animCollapse: true,
        title: 'Identifica&ccedil;&atilde;o',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .21,
                layout: 'form',
                labelWidth: 46,
                items: [CB_USUARIO_CONTA]
            }, {
                columnWidth: .35,
                labelWidth: 90,
                layout: 'form',
                items: [CB_EMAIL_CONTA]
            }, {
                columnWidth: .42,
                layout: 'form',
                labelWidth: 135,
                items: [CB_VERIFICAR_NOVOS_EMAILS]
            }]
        }],
        listeners: {
            collapse: function () {
                gridMensagens.setHeight(AlturaDoPainelDeConteudo(270));
            },
            expand: function () {
                gridMensagens.setHeight(AlturaDoPainelDeConteudo(305));
            }
        }
    });

    // Filtros

    var TXT_FILTRO_EMISSAO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data da Mensagem',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    _webMail.TB_EMAIL_CARREGA_GRID();
                }
            }
        }
    });

    var dt1 = new Date();
    TXT_FILTRO_EMISSAO.setValue(dt1);

    var TXT_FILTRO_TEXTO_MENSAGEM = new Ext.form.TextField({
        fieldLabel: 'Conte&uacute;do',
        width: 210,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    _webMail.TB_EMAIL_CARREGA_GRID();
                }
            }
        }
    });

    var CB_BUSCA_CONTEUDO = new Ext.form.ComboBox({
        fieldLabel: 'Pesquisar em',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 185,
        value: 1,
        allowBlank: false,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[1, 'Assunto'], [2, 'e-mail do remetente'], [3, 'nome do remetente'],
                                [4, 'e-mail do destinatário'], [5, 'Nome do destinatário'],
                                [6, 'Cópia do destinatário'], [7, 'Nome cópia destinatário'],
                                [8, 'Cópia oculta do destinatário'], [9, 'Nome cópia oculta destinatário']]
        }),
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    _webMail.TB_EMAIL_CARREGA_GRID();
                }
            }
        }
    });

    var CB_FILTRO_USUARIO = new Ext.form.ComboBox({
        id: 'FILTRO_USUARIO_EMAIL',
        name: 'FILTRO_USUARIO_EMAIL',
        store: combo_TB_USUARIO_TAREFAS_Store,
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        fieldLabel: 'Usu&aacute;rio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 150,
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    _webMail.TB_EMAIL_CARREGA_GRID();
                }
            },
            select: function (combo, record, index) {
                if (index > -1) {
                    CARREGA_EMAIL_PASTA(record.data.ID_USUARIO);
                    CARREGA_EMAIL_PASTA_MOVER(record.data.ID_USUARIO);

                    webMailStore.removeAll();
                }
            }
        }
    });

    var BTN_FILTRO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        listeners: {
            click: function (b, e) {
                if (_janela_Filtro_Pasta.pastasSelecionadas().length == 0) {
                    dialog.MensagemDeErro('Selecione pelo menos uma pasta no botão [Filtrar pastas] para listar os e-mails', b.getId());
                    return;
                }

                _webMail.TB_EMAIL_CARREGA_GRID();
            }
        }
    });

    var panelFiltro = new Ext.Panel({
        width: '100%',
        border: true,
        frame: true,
        title: 'Pesquisa',
        layout: 'form',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .20,
                labelWidth: 115,
                layout: 'form',
                items: [TXT_FILTRO_EMISSAO]
            }, {
                columnWidth: .25,
                labelWidth: 65,
                layout: 'form',
                items: [TXT_FILTRO_TEXTO_MENSAGEM]
            }, {
                columnWidth: .25,
                labelWidth: 80,
                layout: 'form',
                items: [CB_BUSCA_CONTEUDO]
            }, {
                columnWidth: .20,
                labelWidth: 50,
                layout: 'form',
                items: [CB_FILTRO_USUARIO]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [BTN_FILTRO]
            }]
        }]
    });

    /// Mensagens

    function Marca_Mensagem_como_Lida(record) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Marca_email_lido_nao_lido');
        _ajax.ExibeDivProcessamento(false);

        _ajax.setJsonData({
            ID_MESSAGE: record.data.ID_MESSAGE,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            record.beginEdit();
            record.set('MESSAGE_READ', record.data.MESSAGE_READ == 1 ? 0 : 1);
            record.endEdit();
            record.commit();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Nova_Aba_Email(titulo, novaAba) {

        novaAba.tituloAba(titulo);

        ABAS_WEBMAIL.add({
            title: titulo,
            closable: true,
            autoScroll: true,
            autoDestroy: true,
            iconCls: 'icone_ENVIA_COTACAO1',
            listeners: {
                beforeclose: function (c) {
                    Ext.getCmp('ABAS_WEBMAIL').setActiveTab(0);
                }
            },
            items: [novaAba.show()]
        });

        ABAS_WEBMAIL.setActiveTab(ABAS_WEBMAIL.items.length - 1);
    }

    var webMailExpander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,
        enableCaching: false,

        tpl: new Ext.Template('<br /><br />{BODY}'),
        listeners: {
            expand: function (e, record, body, rowIndex) {

                if (record.data.BODY == '') {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_EMAIL.asmx/Busca_Corpo_Mensagem');

                    _ajax.setJsonData({
                        ID_MESSAGE: record.data.ID_MESSAGE,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        var result = Ext.decode(response.responseText).d;
                        record.beginEdit();
                        record.set('BODY', result);
                        record.endEdit();
                        record.commit();

                        webMailExpander.toggleRow(rowIndex);
                        webMailExpander.expandRow(rowIndex);
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();

                }
            }
        }
    });

    var checkBoxSM_ = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (linha, rowIndex, record) {
                Habilita_Botoes(record);
            },
            rowdeselect: function (linha, rowIndex, record) {
                Habilita_Botoes(record);
            }
        }
    });

    var _record_mover_para;

    var webMailStore = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                        ['ID_MESSAGE', 'FROM_ADDRESS', 'FROM_DISPLAY_NAME', 'PRIORITY', 'SUBJECT', 'BODY', 'RAW_BODY'
                        , 'MESSAGE_READ', 'ID_PASTA', 'DESCRICAO_PASTA', 'COR_FUNDO', 'COR_LETRA', 'PASTA_ESPECIFICA',
                        'ID_USUARIO', 'INBOX', 'OUTBOX', 'EMAIL_DATE', 'OUTBOX', 'BYTES_MESSAGE',
                        'Attachments', 'FAVORITE', 'TO_ADDRESS', 'SPAM', 'PROGRAMACAO_EMAIL']
                        )
    });

    function Programacao_Email(val) {
        return val > 0 ? "<img src='imagens/icones/insert_table_clock_16.gif' style='cursor: pointer;' title='Clique para adicionar ou consultar uma programa&ccedil;&atilde;o para este e-mail' />" :
                                        "<img src='imagens/icones/calendar_fav_16.gif' style='cursor: pointer;' title='Clique para adicionar ou consultar uma programa&ccedil;&atilde;o para este e-mail' />";
    }

    _webMailStore = webMailStore;

    var gridMensagens = new Ext.grid.GridPanel({
        store: webMailStore,
        tbar: [{
            id: 'BTN_NOVA_MENSAGEM',
            text: 'Nova mensagem',
            icon: 'imagens/icones/mail_star_16.gif',
            scale: 'medium',
            handler: function () {
                if (CB_EMAIL_CONTA.getRawValue() == '') {
                    dialog.MensagemDeErro('Selecione uma conta de e-mail acima para criar uma nova mensagem', 'BTN_NOVA_MENSAGEM');
                    return;
                }

                var titulo = "Nova mensagem";

                var tabExistente = false;

                for (var i = 0; i < ABAS_WEBMAIL.items.length; i++) {
                    if (ABAS_WEBMAIL.items.items[i].title == titulo) {
                        tabExistente = true;
                        ABAS_WEBMAIL.setActiveTab(i);
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

                    novaAba.setRemetente(CB_EMAIL_CONTA.getRawValue());
                    novaAba.setBody('<div><br></div>' + _record_conta_email.data.ASSINATURA);
                    novaAba.setRawBody('<div><br></div>' + _record_conta_email.data.ASSINATURA);
                    novaAba.recordGrid(undefined);

                    Nova_Aba_Email(titulo, novaAba);
                }
            }
        }, '-', {
            id: 'BTN_FILTRO_PASTA',
            text: 'Filtrar pasta',
            icon: 'imagens/icones/file_config_16.gif',
            scale: 'medium',
            handler: function () {
                if (!showFiltroPasta) {
                    _janela_pastas_TreeView.show(Ext.getCmp('BTN_FILTRO_PASTA'));
                }
                else {
                    _janela_pastas_TreeView.hide();
                }
            }
        }, '-', {
            id: 'BTN_ENVIAR_MENSAGEM',
            text: 'Enviar',
            icon: 'imagens/icones/next_16.gif',
            scale: 'medium',
            handler: function () {
                Envia_Mensagens();
            }
        }, '-', {
            id: 'BTN_RECEBER_NOVA_MENSAGEM',
            text: 'Receber mensagen(s)',
            icon: 'imagens/icones/mail_level_16.gif',
            scale: 'medium',
            disabled: true,
            handler: function () {
                cancelarProcessamento = false;
                MENSAGENS_BAIXADAS = 0;
                webMailStore.sort('EMAIL_DATE', 'DESC');
                Recebe_Mensagens();
            }
        }, '-', {
            id: 'BTN_RESPONDER_MENSAGEM',
            text: 'Responder',
            icon: 'imagens/icones/admin_reload_16.gif',
            scale: 'medium',
            handler: function () {
                if (gridMensagens.getSelectionModel().selections.items.length == 0) {
                    dialog.MensagemDeErro('Selecione uma mensagem para responder', 'BTN_RESPONDER_MENSAGEM');
                    return;
                }

                var _record = gridMensagens.getSelectionModel().selections.items[0];

                Abre_Email_para_Responder(_record);
            }
        }, '-', {
            id: 'BTN_RESPONDER_A_TODOS',
            text: 'Responder a todos',
            icon: 'imagens/icones/group_16.gif',
            scale: 'medium',
            handler: function () {
                if (gridMensagens.getSelectionModel().selections.items.length == 0) {
                    dialog.MensagemDeErro('Selecione uma mensagem para responder', 'BTN_RESPONDER_A_TODOS');
                    return;
                }

                var _record = gridMensagens.getSelectionModel().selections.items[0];

                Abre_Email_para_Responder_a_Todos(_record);
            }
        }, '-',
                {
                    id: 'BTN_ENCAMINHAR_MENSAGEM',
                    text: 'Encaminhar',
                    icon: 'imagens/icones/attach_next_16.gif',
                    scale: 'medium',
                    handler: function () {
                        if (gridMensagens.getSelectionModel().selections.items.length == 0) {
                            dialog.MensagemDeErro('Selecione uma mensagem para encaminhar', 'BTN_ENCAMINHAR_MENSAGEM');
                            return;
                        }

                        var _record = gridMensagens.getSelectionModel().selections.items[0];

                        Abre_Email_para_Encaminhar(_record);
                    }
                }, '-', {
                    id: 'BTN_IMPRIMIR_EMAIL',
                    text: 'Imprimir',
                    icon: 'imagens/icones/printer_16.gif',
                    scale: 'medium',
                    handler: function () {
                        if (gridMensagens.getSelectionModel().selections.items.length == 0) {
                            dialog.MensagemDeErro('Selecione uma mensagem para imprimir', 'BTN_IMPRIMIR_EMAIL');
                            return;
                        }

                        _modo_impressao.record = gridMensagens.getSelectionModel().selections.items[0];
                        _modo_impressao.show('BTN_IMPRIMIR_EMAIL');
                    }
                }, '-', {
                    id: 'BTN_FERRAMENTAS_EMAIL',
                    text: 'Ferramentas',
                    scale: 'medium',
                    icon: 'imagens/icones/connect_config_16.gif',
                    menu: {
                        items: [{
                            id: 'BTN_GERENCIAR_PASTAS',
                            text: 'Gerenciar pastas',
                            icon: 'imagens/icones/file_config_16.gif',
                            handler: function () {
                                _janela_Pasta_Email.show('BTN_FERRAMENTAS_EMAIL');
                            }
                        }, {
                            id: 'BTN_GERENCIAR_CONTATOS',
                            text: 'Gerenciar contatos',
                            icon: 'imagens/icones/user_config_16.gif',
                            handler: function () {
                                _janela_Contatos_Email.show('BTN_FERRAMENTAS_EMAIL');
                            }
                        }, {
                            id: 'BTN_GERENCIAR_GRUPOS',
                            text: 'Gerenciar grupos de e-mail',
                            icon: 'imagens/icones/group_16.gif',
                            handler: function () {
                                _janela_Grupo_Email.show('BTN_FERRAMENTAS_EMAIL');
                            }
                        }, {
                            ID: 'BTN_GERENCIAR_SPAM',
                            text: 'Gerenciar SPAM',
                            icon: 'imagens/icones/rec_16.gif',
                            handler: function () {
                                _janela_Email_Spam.show('BTN_FERRAMENTAS_EMAIL');
                            }
                        }, '-', {
                            id: 'BTN_CONTAS_USUARIO',
                            text: 'Gerenciar contas de usu&aacute;rio',
                            icon: 'imagens/icones/admin_16.gif',
                            handler: function () {
                                _janelaEmailConta.show('BTN_FERRAMENTAS_EMAIL');
                            }
                        }]
                    }
                }, '-', {
                    id: 'BTN_FILTRO_PASTAS',
                    text: 'Filtrar pastas',
                    icon: 'imagens/icones/file_config_16.gif',
                    scale: 'medium',
                    handler: function () {
                        if (!showFiltroPastas) {
                            _janela_Filtro_Pasta.show(Ext.getCmp('BTN_FILTRO_PASTAS'));
                        }
                        else {
                            _janela_Filtro_Pasta.hide();
                        }
                    }
                }],

        bbar: [{

            xtype: 'label',
            text: 'Mover para:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'combo',
            id: 'CB_ID_PASTA_MOVER',
            store: combo_EMAIL_PASTA_MOVER_Store,
            valueField: 'ID_PASTA',
            displayField: 'DESCRICAO_PASTA',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione a pasta aqui...',
            selectOnFocus: true,
            width: 190,
            style: 'font-size: 9pt;',
            allowBlank: false,
            listeners: {
                select: function (combo, record, index) {
                    _record_mover_para = record;
                }
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                        {
                            id: 'BTN_MOVER_PARA_PASTA',
                            text: 'Mover',
                            icon: 'imagens/icones/file_next_16.gif',
                            scale: 'small',
                            handler: function () {
                                Move_emails_para_outra_pasta();
                            }
                        }],
        columns: [
        webMailExpander,
        checkBoxSM_,
        { id: 'MESSAGE_READ', header: "Li", width: 33, sortable: true, dataIndex: 'MESSAGE_READ', renderer: Lido, align: 'center' },
        { id: 'FAVORITE', header: "Fav", width: 33, sortable: true, dataIndex: 'FAVORITE', renderer: Favorito, align: 'center' },
        { id: 'SPAM', header: "Spam", width: 39, sortable: true, dataIndex: 'SPAM', renderer: Spam, align: 'center' },
        { id: 'ID_PASTA', header: "Pasta", width: 125, sortable: true, dataIndex: 'ID_PASTA', renderer: pastaEmail },
        { id: 'EMAIL_DATE', header: "Data / Hora", width: 120, sortable: true, dataIndex: 'EMAIL_DATE', renderer: Data_Hora_nao_lido },
        { id: 'FROM_DISPLAY_NAME', header: "Remetente", width: 180, sortable: true, dataIndex: 'FROM_DISPLAY_NAME', renderer: Remetente },
        { id: 'SUBJECT', header: "Assunto", width: 230, sortable: true, dataIndex: 'SUBJECT', renderer: Mensagem_Lida },
        { id: 'TO_ADDRESS', header: "Destinat&aacute;rio", width: 220, sortable: true, dataIndex: 'TO_ADDRESS', renderer: Mensagem_Lida },
        { id: 'PROGRAMACAO_EMAIL', header: "Programa&ccedil;&atilde;o", width: 90, sortable: true, dataIndex: 'PROGRAMACAO_EMAIL', align: 'center', renderer: Programacao_Email },
        { id: 'PRIORITY', header: "Prioridade", width: 80, sortable: true, dataIndex: 'PRIORITY', renderer: Prioridade_Email, align: 'center' },
        { id: 'Attachments', header: "Anexo(s)", width: 70, sortable: true, dataIndex: 'Attachments', align: 'center', renderer: Link_Attachment },
        { id: 'BYTES_MESSAGE', header: "Tamanho", width: 80, sortable: true, dataIndex: 'BYTES_MESSAGE', renderer: UnidadeBytes, align: 'right' }

        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(360),
        width: '100%',
        columnLines: true,

        plugins: webMailExpander,

        sm: checkBoxSM_,

        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'FAVORITE') {
                    Marca_Desmarca_email_Favorito(record);
                }

                if (fieldName == 'SPAM') {
                    if (record.data.INBOX == 1) {
                        Marca_Desmarca_SPAM(record);
                    }
                }

                if (fieldName == 'Attachments') {
                    _janelaAnexos.ID_MESSAGE(record.data.ID_MESSAGE);
                    _janelaAnexos.show(grid.getId(), e.getPageX(), e.getPageY());
                }

                if (fieldName == 'MESSAGE_READ') {
                    Marca_Mensagem_como_Lida(record);
                }

                if (fieldName == 'PROGRAMACAO_EMAIL') {
                    _janela_programacao_email.ID_MESSAGE(record.data.ID_MESSAGE);
                    _janela_programacao_email.posicaoDinamica(2);

                    _janela_programacao_email.acao(webMail_PagingToolbar.CarregaPaginaAtual);

                    _janela_programacao_email.show(e, gridMensagens);
                }
                else {
                    _janela_programacao_email.hide();
                }
            },
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                Abre_Email(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridMensagens.getSelectionModel().getSelections().length > 0) {
                        var record = gridMensagens.getSelectionModel().getSelected();
                        Abre_Email(record);
                    }
                }

                if (e.getKey() == e.DELETE) {
                    if (gridMensagens.getSelectionModel().getSelections().length > 0) {
                        Muda_Emails_para_Lixeira();
                    }
                }
            }
        }
    });

    function Modo_Impressao_Email() {

        var _record;

        this.record = function (pValue) {
            _record = pValue;
        };

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

            var _record = gridMensagens.getSelectionModel().selections.items[0];

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_EMAIL.asmx/Imprime_Email');

            _ajax.setJsonData({
                ID_MESSAGE: _record.data.ID_MESSAGE,
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

    function Abre_Email(record) {

        var titulo = "E-mail: ";

        titulo += record.data.SUBJECT.length > 20 ?
                                                record.data.SUBJECT.substring(0, 20) + "..." :
                                                record.data.SUBJECT;

        var tabExistente = false;

        for (var i = 0; i < ABAS_WEBMAIL.items.length; i++) {
            if (ABAS_WEBMAIL.items.items[i].title == titulo) {
                tabExistente = true;
                ABAS_WEBMAIL.setActiveTab(i);
            }
        }

        var novaAba = new aba_Envio_Email('_web_mail' + titulo);

        //////////////

        novaAba.resetaFormulario();
        novaAba.setID_USUARIO(_ID_USUARIO);
        novaAba.seta_ID_Message(record.data.ID_MESSAGE);
        novaAba.BuscaMensagem();

        if (record.data.INBOX == 1) {
            novaAba.Botao_Salvar(false);
            novaAba.Botao_Enviar(false);
            novaAba.Botao_Responder(true);
            novaAba.Botao_Encaminhar(true);
        }
        else {
            if (record.data.PASTA_ESPECIFICA == 3 ||
                                                    record.data.PASTA_ESPECIFICA == 4) {
                novaAba.Botao_Salvar(true);
                novaAba.Botao_Enviar(true);
                novaAba.Botao_Responder(false);
                novaAba.Botao_Encaminhar(false);
            }
            else {
                novaAba.Botao_Salvar(false);
                novaAba.Botao_Enviar(false);
                novaAba.Botao_Responder(false);
                novaAba.Botao_Encaminhar(true);
            }
        }

        novaAba.recordGrid(record);

        Nova_Aba_Email(titulo, novaAba);

        if (record.data.MESSAGE_READ == 0) {
            Marca_Mensagem_como_Lida(record);
        }
    }

    function Abre_Email_para_Responder(record) {
        var titulo = "Responder: ";

        titulo += record.data.SUBJECT.length > 20 ?
                                                record.data.SUBJECT.substring(0, 20) + "..." :
                                                record.data.SUBJECT;

        var tabExistente = false;

        for (var i = 0; i < ABAS_WEBMAIL.items.length; i++) {
            if (ABAS_WEBMAIL.items.items[i].title == titulo) {
                tabExistente = true;
                ABAS_WEBMAIL.setActiveTab(i);
            }
        }

        if (!tabExistente) {
            var novaAba = new aba_Envio_Email('_web_mail' + titulo);

            novaAba.setID_USUARIO(_ID_USUARIO);
            novaAba.resetaFormulario();
            novaAba.setRemetente(CB_EMAIL_CONTA.getRawValue());
            novaAba.seta_ID_Message(record.data.ID_MESSAGE);
            novaAba.BuscaMensagemParaResponder();

            Nova_Aba_Email(titulo, novaAba);
        }
    }

    function Abre_Email_para_Responder_a_Todos(record) {
        var titulo = "Responder a todos: ";

        titulo += record.data.SUBJECT.length > 20 ?
                                                record.data.SUBJECT.substring(0, 20) + "..." :
                                                record.data.SUBJECT;

        var tabExistente = false;

        for (var i = 0; i < ABAS_WEBMAIL.items.length; i++) {
            if (ABAS_WEBMAIL.items.items[i].title == titulo) {
                tabExistente = true;
                ABAS_WEBMAIL.setActiveTab(i);
            }
        }

        if (!tabExistente) {

            var novaAba = new aba_Envio_Email('_web_mail' + titulo);

            novaAba.setID_USUARIO(_ID_USUARIO);
            novaAba.resetaFormulario();
            novaAba.setRemetente(CB_EMAIL_CONTA.getRawValue());
            novaAba.seta_ID_Message(record.data.ID_MESSAGE);
            novaAba.BuscaMensagemparaResponderaTodos();

            Nova_Aba_Email(titulo, novaAba);
        }
    }

    function Abre_Email_para_Encaminhar(record) {

        var titulo = "Encaminhar: ";

        titulo += record.data.SUBJECT.length > 20 ?
                                                record.data.SUBJECT.substring(0, 20) + "..." :
                                                record.data.SUBJECT;

        var tabExistente = false;

        for (var i = 0; i < ABAS_WEBMAIL.items.length; i++) {
            if (ABAS_WEBMAIL.items.items[i].title == titulo) {
                tabExistente = true;
                ABAS_WEBMAIL.setActiveTab(i);
            }
        }

        if (!tabExistente) {

            var novaAba = new aba_Envio_Email('_web_mail' + titulo);

            novaAba.setID_USUARIO(_ID_USUARIO);
            novaAba.resetaFormulario();
            novaAba.setRemetente(CB_EMAIL_CONTA.getRawValue());
            novaAba.seta_ID_Message(record.data.ID_MESSAGE);
            novaAba.BuscaMensagemparaEncaminhar();

            Nova_Aba_Email(titulo, novaAba);
        }
    }

    function Muda_Emails_para_Lixeira() {
        dialog.MensagemDeConfirmacao('Deseja deletar a(s) mensagen(s) selecionada(s)?', gridMensagens.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var arr1 = new Array();

                for (var i = 0; i < gridMensagens.getSelectionModel().getSelections().length; i++) {
                    var record = gridMensagens.getSelectionModel().selections.items[i];

                    if (record.data.PASTA_ESPECIFICA != 5) {
                        arr1[i] = record.data.ID_MESSAGE;
                    }
                }

                var record_pasta = combo_EMAIL_PASTA_MOVER_Store.getAt(combo_EMAIL_PASTA_MOVER_Store.find('PASTA_ESPECIFICA', 5));

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_EMAIL.asmx/Move_emails_para_outra_pasta');
                _ajax.setJsonData({
                    ID_PASTA: record_pasta.data.ID_PASTA,
                    ID_MESSAGES: arr1,
                    PASTA_DEFINITIVA: 0,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    for (var i = 0; i < gridMensagens.getSelectionModel().getSelections().length; i++) {
                        var record = gridMensagens.getSelectionModel().selections.items[i];

                        if (record.data.PASTA_ESPECIFICA != 5) {
                            gridMensagens.getStore().remove(record);
                            Habilita_Botoes(record);
                        }
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function Habilita_Botoes(record) {
        if (record.data.PASTA_ESPECIFICA == 1 || record.data.INBOX == 1) { // Caixa de entrada
            Ext.getCmp('BTN_ENVIAR_MENSAGEM').disable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').enable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').enable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').enable();
        }

        if (record.data.PASTA_ESPECIFICA == 2 || record.data.OUTBOX == 1) { // itens enviados
            Ext.getCmp('BTN_ENVIAR_MENSAGEM').disable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').enable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').disable();
        }

        if (record.data.PASTA_ESPECIFICA == 3) { // caixa de saída
            Ext.getCmp('BTN_ENVIAR_MENSAGEM').enable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').disable();
        }

        if (record.data.PASTA_ESPECIFICA == 4) { // rascunho
            Ext.getCmp('BTN_ENVIAR_MENSAGEM').enable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').disable();
        }

        if (record.data.PASTA_ESPECIFICA == 5) { // lixeira
            Ext.getCmp('BTN_ENVIAR_MENSAGEM').disable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').disable();
        }
    }

    function Envia_Mensagens() {
        if (gridMensagens.getSelectionModel().getSelections().length == 0) {
            dialog.MensagemDeErro('Selecione uma ou mais mensagens para enviar', 'BTN_ENVIAR_MENSAGEM');
            return;
        }

        if (!CB_EMAIL_CONTA.isValid()) {
            dialog.MensagemDeErro('Selecione uma conta de e-mail', 'BTN_ENVIAR_MENSAGEM');
            return;
        }

        var ID_MESSAGE = gridMensagens.getSelectionModel().selections.items[0].data.ID_MESSAGE;
        var _record = gridMensagens.getSelectionModel().selections.items[0];

        cancelarProcessamento = false;

        processaEnvio(ID_MESSAGE, _record);
    }

    var _NUMERO_DO_REGISTRO = 0;

    function processaEnvio(ID_MESSAGE, record) {

        Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; width: 100%; height: " +
                                                (panelResultado.height / 2) + "px; overflow: auto;'><b>Aguarde. Enviando a mensagem para " +
                                                record.data.TO_ADDRESS + " ...</b>", true);

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Envia_Email_que_estava_gravado_como_rascunho');
        _ajax.ExibeDivProcessamento(false);
        _ajax.setReportaErro(false);

        _ajax.setJsonData({
            ID_MESSAGE: ID_MESSAGE,
            ID_CONTA_EMAIL: CB_EMAIL_CONTA.getValue(),
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (!cancelarProcessamento) {
                _NUMERO_DO_REGISTRO++;

                if (_NUMERO_DO_REGISTRO < gridMensagens.getSelectionModel().selections.items.length) {
                    var ID_MESSAGE = gridMensagens.getSelectionModel().selections.items[_NUMERO_DO_REGISTRO].data.ID_MESSAGE;
                    var _record = gridMensagens.getSelectionModel().selections.items[_NUMERO_DO_REGISTRO];

                    processaEnvio(ID_MESSAGE, _record);
                }
                else {
                    var _mensagem = gridMensagens.getSelectionModel().getSelections().length == 1 ?
                                                " mensagem enviada com sucesso" :
                                                " mensagens enviadas com sucesso";

                    Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; font-weight: bold; width: 100%; height: " +
                                                        (panelResultado.height / 2) + "px; overflow: auto;'>" + _NUMERO_DO_REGISTRO + _mensagem + "</div>", false);

                }
            }
            else {
                Atualiza_Status_Processamento("&nbsp;", false);
            }

            record.beginEdit();
            record.set('ID_PASTA', result.ID_PASTA);
            record.set('DESCRICAO_PASTA', result.DESCRICAO_PASTA);
            record.set('COR_FUNDO', result.COR_FUNDO);
            record.set('COR_LETRA', result.COR_LETRA);
            record.set('PASTA_ESPECIFICA', result.PASTA_ESPECIFICA);
            record.endEdit();
            record.commit();
        };

        var _falha = function (response, options) {
            var erro = Ext.decode(response.responseText).Message;

            Atualiza_Status_Processamento("<div style='font-size: 9pt; width: 100%; height: " +
                                            (panelResultado.height / 2) + "px; overflow: auto;'>Erro: <span style='color: darkred;'>" + erro + "</span></div>", false);

        };

        _ajax.setSucesso(_sucess);
        _ajax.setFalha(_falha);
        _ajax.Request();
    }

    function Move_emails_para_outra_pasta() {
        if (!Ext.getCmp('CB_ID_PASTA_MOVER').isValid())
            return;

        if (gridMensagens.getSelectionModel().selections.getCount() == 0) {
            dialog.MensagemDeErro('Selecione um ou mais emails para mover para outra pasta', 'CB_ID_PASTA_MOVER');
            return;
        }

        var array1 = new Array();
        var array2 = new Array();

        for (var i = 0; i < gridMensagens.getSelectionModel().selections.getCount(); i++) {
            var record = gridMensagens.getSelectionModel().selections.items[i];
            array1[i] = record.data.ID_MESSAGE;
            array2[i] = record;
        }

        _janela_Mover_Mensagens.ID_MESSAGES(array1);
        _janela_Mover_Mensagens.ID_PASTA(Ext.getCmp('CB_ID_PASTA_MOVER').getValue());
        _janela_Mover_Mensagens.records(array2);
        _janela_Mover_Mensagens.show('CB_ID_PASTA_MOVER');
    }

    function Marca_Desmarca_SPAM(record) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Marca_Desmarca_SPAM');
        _ajax.ExibeDivProcessamento(false);

        _ajax.setJsonData({
            ID_MESSAGE: record.data.ID_MESSAGE,
            EMAIL_SPAM: record.data.FROM_ADDRESS,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            record.beginEdit();
            record.set('SPAM', record.data.SPAM == 1 ? 0 : 1);
            record.endEdit();
            record.commit();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Marca_Desmarca_email_Favorito(record) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Marca_Desmarca_email_Favorito');
        _ajax.ExibeDivProcessamento(false);

        _ajax.setJsonData({
            ID_MESSAGE: record.data.ID_MESSAGE,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            record.beginEdit();
            record.set('FAVORITE', record.data.FAVORITE == 1 ? 0 : 1);
            record.endEdit();
            record.commit();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var webMail_PagingToolbar = new Th2_PagingToolbar();

    webMail_PagingToolbar.setStore(webMailStore);

    function RetornaFiltros_webMail() {
        var TB_CLIENTE_JsonData = {
            ID_USUARIO: CB_FILTRO_USUARIO.getValue(),
            EMAIL_DATE: TXT_FILTRO_EMISSAO.getRawValue(),
            PESQUISA: TXT_FILTRO_TEXTO_MENSAGEM.getValue(),
            PASTAS: _janela_Filtro_Pasta.pastasSelecionadas(),
            BUSCA_CONTEUDO: CB_BUSCA_CONTEUDO.getValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO,
            start: 0,
            limit: webMail_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    this.TB_EMAIL_CARREGA_GRID = function () {
        if (!TXT_FILTRO_EMISSAO.isValid() || !CB_FILTRO_USUARIO.isValid() || !CB_BUSCA_CONTEUDO.isValid()) {
            return;
        }

        if (CB_BUSCA_CONTEUDO.getValue() == 4 || CB_BUSCA_CONTEUDO.getValue() == 5) {
            webMail_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_Emails_por_Destinatarios');
        }
        else if (CB_BUSCA_CONTEUDO.getValue() == 6 || CB_BUSCA_CONTEUDO.getValue() == 7) {
            webMail_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_Emails_por_Destinatarios_Copia');
        }
        else if (CB_BUSCA_CONTEUDO.getValue() == 8 || CB_BUSCA_CONTEUDO.getValue() == 9) {
            webMail_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_Emails_por_Destinatarios_Copia_Oculta');
        }
        else {
            webMail_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_Emails');
        }

        webMail_PagingToolbar.setParamsJsonData(RetornaFiltros_webMail());
        webMail_PagingToolbar.doRequest();

        Atualiza_Status_Processamento("&nbsp;", false);
    }

    // Lista emails de uma pasta

    function RetornaFiltros_webMail_uma_pasta(ID_PASTA) {
        var TB_CLIENTE_JsonData = {
            ID_USUARIO: CB_FILTRO_USUARIO.getValue(),
            EMAIL_DATE: TXT_FILTRO_EMISSAO.getRawValue(),
            PESQUISA: TXT_FILTRO_TEXTO_MENSAGEM.getValue(),
            ID_PASTA: ID_PASTA,
            ID_USUARIO_ORIGINAL: _ID_USUARIO,
            start: 0,
            limit: webMail_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    this.TB_EMAIL_CARREGA_GRID_UMA_PASTA = function (ID_PASTA) {
        if (!TXT_FILTRO_EMISSAO.isValid() || !CB_FILTRO_USUARIO.isValid()) {
            return;
        }

        webMail_PagingToolbar.setUrl('servicos/TB_EMAIL.asmx/Lista_Emails_de_uma_Pasta');
        webMail_PagingToolbar.setParamsJsonData(RetornaFiltros_webMail_uma_pasta(ID_PASTA));
        webMail_PagingToolbar.doRequest();

        Atualiza_Status_Processamento("&nbsp;", false);
    }

    var panelMensagens = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Lista de e-mail',
        items: [gridMensagens, webMail_PagingToolbar.PagingToolbar()]
    });

    // Painel de resultados e processamento

    var LBL_PROCESSO_RECEBER = new Ext.form.Label({
        height: 20
    });

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
        title: 'Processamento e Resultados',
        height: 70,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.03,
                items: [{
                    xtype: 'box',
                    id: 'gif_processamento_emails',
                    autoEl: {
                        tag: 'img',
                        src: 'imagens/70.gif'
                    }
                }]
            }, {
                columnWidth: .10,
                items: [BTN_CANCELAR_PROCESSO]
            }, {
                columnWidth: .80,
                items: [LBL_PROCESSO_RECEBER]
            }]
        }]
    });

    Ext.getCmp('gif_processamento_emails').setVisible(false);
    BTN_CANCELAR_PROCESSO.setVisible(false);

    var panelGeral = new Ext.Panel({
        width: '100%',
        border: true,
        items: [panelIdentificacao, panelFiltro, panelMensagens, panelResultado]
    });

    // tabPanel

    var ABAS_WEBMAIL = new Ext.TabPanel({
        id: 'ABAS_WEBMAIL',
        deferredRender: false,
        enableTabScroll: true,
        activeTab: 0,

        items: [{
            title: 'Mensagens',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_ENVIA_COTACAO',
            items: [panelGeral]
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (panel.title == 'Nova mensagem') {
                    if (panel.items.length == 0) {
                    }

                    tabPanel.doLayout();
                }
            }
        }
    });

    /////////////

    function Atualiza_Status_Processamento(_mensagem, exibe) {
        LBL_PROCESSO_RECEBER.setText(_mensagem, false);

        BTN_CANCELAR_PROCESSO.setVisible(exibe);
        Ext.getCmp('gif_processamento_emails').setVisible(exibe);
    }

    function Habilita_Desabilita_Botoes(hd) {
        if (!hd) {
            Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').disable();
            Ext.getCmp('BTN_NOVA_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').disable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').disable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').disable();

            panelIdentificacao.disable();
            panelFiltro.disable();
            webMail_PagingToolbar.Desabilita();
        }
        else {
            Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
            Ext.getCmp('BTN_NOVA_MENSAGEM').enable();
            Ext.getCmp('BTN_RESPONDER_MENSAGEM').enable();
            Ext.getCmp('BTN_RESPONDER_A_TODOS').enable();
            Ext.getCmp('BTN_ENCAMINHAR_MENSAGEM').enable();

            panelIdentificacao.enable();
            panelFiltro.enable();
            webMail_PagingToolbar.Habilita();
        }
    }

    function Recebe_Mensagens(_NUMERO_MENSAGEM) {

        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').disable();

        if (!_NUMERO_MENSAGEM)
            _NUMERO_MENSAGEM = 1;

        if (_NUMERO_MENSAGEM == 1) {
            Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; width: 100%; height: " +
                                                (panelResultado.height / 2) + "px; overflow: auto;'><b>Aguarde. Verificando novas mensagens em " +
                                                _record_conta_email.data.SERVIDOR_HOST + "</b><span style='font-size: 9pt; color: darkred; font-weight: bold;'>&nbsp;&nbsp;" +
                                                     "</span></div>", true);
        }
        else {
            var numero_da_mensagem = (_NUMERO_MENSAGEM - 1) == 1 ? " mensagem..." : " mensagens...";

            Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; width: 100%; height: " +
                                                (panelResultado.height / 2) + "px; overflow: auto;'><b>Aguarde. Verificando novas mensagens em " +
                                                _record_conta_email.data.SERVIDOR_HOST + "</b><span style='font-size: 9pt; color: darkred; font-weight: bold;'>&nbsp;&nbsp;" +
                                                     (_NUMERO_MENSAGEM - 1) + numero_da_mensagem + "</span></div>", true);
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_EMAIL.asmx/Recebe_Mensagens');
        _ajax.ExibeDivProcessamento(false);
        _ajax.setReportaErro(false);

        _ajax.setJsonData({
            ID_USUARIO: CB_USUARIO_CONTA.getValue(),
            EMAIL: _record_conta_email.data.CONTA_EMAIL,
            SENHA: _record_conta_email.data.SENHA,
            SERVIDOR_POP: _record_conta_email.data.SERVIDOR_HOST,
            PORTA: _record_conta_email.data.PORTA,
            SSL: _record_conta_email.data.SSL,
            NUMERO_MENSAGEM: _NUMERO_MENSAGEM
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            if (result.XML) {
                webMailStore.loadData(criaObjetoXML(result.XML), true);

                for (var i = 0; i < webMailStore.getCount(); i++) {
                    var record = webMailStore.getAt(webMailStore.getCount() - 1);

                    record.beginEdit();
                    record.set('BODY', result.BODY);
                    record.set('RAW_BODY', result.RAW_BODY);
                    record.endEdit();
                    record.commit();
                }

                MENSAGENS_BAIXADAS++;

                webMailStore.sort('ID_MESSAGE', 'DESC');

                if (!cancelarProcessamento) {
                    if (result.NUMERO_PROXIMA_MENSAGEM > 0) {
                        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').disable();
                        Recebe_Mensagens(result.NUMERO_PROXIMA_MENSAGEM);
                    }
                    else {
                        cancelarProcessamento = true;

                        var _mensagem = _NUMERO_MENSAGEM == 1 ? " nova mensagem" : " novas mensagens";

                        Atualiza_Status_Processamento("<div style='font-size: 9pt; font-weight: bold; color: darkblue; width: 100%; height: " +
                                                            (panelResultado.height / 2) + "px; overflow: auto;'>" + _NUMERO_MENSAGEM + _mensagem + "</div>", false);

                        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                    }
                }
                else {

                    var _mensagem = _NUMERO_MENSAGEM == 1 ? " nova mensagem" : " novas mensagens";

                    Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; font-weight: bold; width: 100%; height: " +
                                                        (panelResultado.height / 2) + "px; overflow: auto;'>" + _NUMERO_MENSAGEM + _mensagem + "</div>", false);

                    Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                }
            }
            else {
                cancelarProcessamento = true;

                if (_NUMERO_DO_REGISTRO > 0) {
                    var _mensagem = MENSAGENS_BAIXADAS == 1 ? " nova mensagem" : " novas mensagens";

                    Atualiza_Status_Processamento("<div style='font-size: 9pt; font-weight: bold; color: darkblue; width: 100%; height: " +
                                                            (panelResultado.height / 2) + "px; overflow: auto;'>" + MENSAGENS_BAIXADAS + _mensagem + "</div>", false);

                    Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                }
                else {
                    if (MENSAGENS_BAIXADAS > 0) {
                        var _mensagem = MENSAGENS_BAIXADAS == 1 ? " nova mensagem" : " novas mensagens";

                        Atualiza_Status_Processamento("<div style='font-size: 9pt; color: darkblue; font-weight: bold; width: 100%; height: " +
                                                                (panelResultado.height / 2) + "px; overflow: auto;'>" + MENSAGENS_BAIXADAS + _mensagem + "</div>", false);

                        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                    }
                    else {
                        Atualiza_Status_Processamento("<div style='font-size: 9pt; font-weight: bold; color: darkblue; width: 100%; height: " +
                                                                (panelResultado.height / 2) + "px; overflow: auto;'>N&atilde;o h&aacute; mensagens novas</div>", false);

                        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
                    }
                }
            }
        };

        var _falha = function (response, options) {
            var erro = Ext.decode(response.responseText).Message;

            if (erro == undefined) {
                Atualiza_Status_Processamento("<div style='font-size: 9pt; width: 100%; height: " +
                                                        (panelResultado.height / 2) + "px; overflow: auto;'>Erro: <span style='color: darkred;'>Verifique se o seu computador est&aacute; com acesso de internet</span></div>", false);

                Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
            }
            else {
                Atualiza_Status_Processamento("<div style='font-size: 9pt; width: 100%; height: " +
                                                        (panelResultado.height / 2) + "px; overflow: auto;'>Erro: <span style='color: darkred;'>" + erro + "</span></div>", false);

                Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
            }

            //Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').enable();
        };

        _ajax.setSucesso(_sucess);
        _ajax.setFalha(_falha);
        _ajax.Request();
    }

    _acaoRecebeMensagens = function () {
        Recebe_Mensagens();
    };

    this.panelEmail = function () {
        return ABAS_WEBMAIL;
    };

    this.resetaPagingToolbar = function () {
        webMail_PagingToolbar.Desabilita();
    };

    this.resetaStoreGrid = function () {
        webMailStore.removeAll();
    };

    this.resetaRemetente = function () {
        CB_EMAIL_CONTA.reset();
        CB_USUARIO_CONTA.reset();
        Ext.getCmp('BTN_RECEBER_NOVA_MENSAGEM').disable();
    };
}

function janela_programacao_email() {

    var _ID_MESSAGE;

    this.ID_MESSAGE = function (pValue) {
        _ID_MESSAGE = pValue;
    };

    var _acao;

    this.acao = function (pValue) {
        _acao = pValue;
    };

    var TXT_DATA_INICIAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATA_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var dt1 = new Date();

    TXT_DATA_INICIAL.setValue(dt1.add(Date.DAY, 1));
    TXT_DATA_FINAL.setValue(dt1.add(Date.DAY, 2));

    var opcao = new Ext.form.RadioGroup({
        columns: 2,
        items: [{ boxLabel: 'Todos os dias', name: 'rb-auto1', inputValue: 1, checked: true },
            { boxLabel: 'Todas as semanas', name: 'rb-auto1', inputValue: 2 },
            { boxLabel: 'Todas as quinzenas', name: 'rb-auto1', inputValue: 3 },
            { boxLabel: 'Todos os meses', name: 'rb-auto1', inputValue: 4}]
    });

    var BTN_GRAVAR_PERIODO = new Ext.Button({
        text: 'Programar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            Grava_Periodo_Programacao();
        }
    });

    var fs1 = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Programa&ccedil;&atilde;o de envio para um per&iacute;odo',
        autoHeight: true,
        bodyStyle: 'padding: 0px 0px 0',
        labelWidth: 60,
        width: '97%',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.17,
                layout: 'form',
                items: [TXT_DATA_INICIAL]
            }, {
                columnWidth: 0.17,
                layout: 'form',
                items: [TXT_DATA_FINAL]
            }, {
                columnWidth: 0.41,
                layout: 'form',
                items: [opcao]
            }, {
                columnWidth: 0.15,
                layout: 'form',
                items: [BTN_GRAVAR_PERIODO]
            }]
        }]
    });

    var TXT_DATA_REF = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data &uacute;nica'
    });

    TXT_DATA_REF.setValue(dt1);

    var BTN_GRAVAR_UNICA_DATA = new Ext.Button({
        text: 'Programar',
        icon: 'imagens/icones/database_save_24.gif',
        scale: 'large',
        handler: function () {
            Grava_Programacao_Unica();
        }
    });

    var fs2 = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Programa&ccedil;&atilde;o para uma data futura',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: 355,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.37,
                layout: 'form',
                items: [TXT_DATA_REF]
            }, {
                columnWidth: 0.32,
                layout: 'form',
                items: [BTN_GRAVAR_UNICA_DATA]
            }]
        }]
    });

    // Grid
    var Programacao_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_PROGRAMACAO_EMAIL', 'DATA_PROGRAMACAO_ENVIO', 'ENVIO_PENDENTE', 'DATA_ENVIO'])
    });

    function programacaoEnviada(val) {
        return val == 1 ? "<span style='color: navy;'>Sim</span>" : "<span style='color: darkred;'>N&atilde;o</span>";
    }

    function dataEnvio(val) {
        return val == '' ? '' : XMLParseDateTime(val);
    }

    function Link_Deletar(val, metadata, record) {
        if (record.data.ENVIO_PENDENTE == 0) {
            return "<img src='imagens/icones/database_delete_16.gif' style='cursor: pointer;' title='Clique para deletar a programa&ccedil;&atilde;o de envio' />";
        }
        else {
            return "";
        }
    }

    var Grid1 = new Ext.grid.GridPanel({
        store: Programacao_Store,
        columns: [
        { id: 'DATA_PROGRAMACAO_ENVIO', header: "Programado", width: 90, sortable: true, dataIndex: 'DATA_PROGRAMACAO_ENVIO', renderer: XMLParseDate },
        { id: 'ENVIO_PENDENTE', header: "Enviado", width: 55, sortable: true, dataIndex: 'ENVIO_PENDENTE', align: 'center', renderer: programacaoEnviada },
        { id: 'DATA_ENVIO', header: "Data envio", width: 120, sortable: true, dataIndex: 'DATA_ENVIO', renderer: dataEnvio },
        { id: 'DELETAR', header: "", width: 30, sortable: true, dataIndex: 'DELETAR', align: 'center', renderer: Link_Deletar}],
        stripeRows: true,
        height: 110,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            cellclick: function (grid, rowIndex, columnIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                if (fieldName == 'DELETAR' && record.data.ENVIO_PENDENTE == 0) {
                    Deletar_Programacao(record.data.ID_PROGRAMACAO_EMAIL);
                }
            }
        }
    });

    function RETORNAFILTROS() {
        var TB_TRANSPORTADORA_JsonData = {
            ID_MESSAGE: _ID_MESSAGE,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: PagingToolbar1.getLinhasPorPagina()
        };

        return TB_TRANSPORTADORA_JsonData;
    }

    var PagingToolbar1 = new Th2_PagingToolbar();

    PagingToolbar1.setUrl('servicos/PROGRAMACAO_EMAIL.asmx/Lista_Programacao_da_Mensagem');
    PagingToolbar1.setStore(Programacao_Store);

    function Carrega_Grid() {
        if (!form1.getForm().isValid())
            return;

        PagingToolbar1.setParamsJsonData(RETORNAFILTROS());
        PagingToolbar1.doRequest();
    }

    var fs3 = new Ext.form.FieldSet({
        checkboxToggle: false,
        title: 'Programa&ccedil;&atilde;o cadastrada para este e-mail',
        autoHeight: true,
        bodyStyle: 'padding: 5px 5px 0',
        labelWidth: 60,
        width: 369,
        items: [Grid1, PagingToolbar1.PagingToolbar()]
    });

    var form1 = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:0px 0px 0',
        frame: true,
        width: '100%',
        items: [fs1,
                        {
                            layout: 'column',
                            items: [{
                                columnWidth: .50,
                                items: [fs2]
                            }, {
                                columnWidth: .50,
                                items: [fs3]
                            }]
                        }]
    });

    function Grava_Periodo_Programacao() {
        if (!TXT_DATA_INICIAL.isValid() || !TXT_DATA_FINAL.isValid()) {
            return;
        }

        if (TXT_DATA_INICIAL.getValue() > TXT_DATA_FINAL.getValue()) {
            dialog.MensagemDeErro('Digite um per&iacute;odo v&aacute;lido para gravar a programa&ccedil;&atilde;o<br /><br />A data inicial n&atilde;o pode ser maior que a data final', BTN_GRAVAR_PERIODO.getId());
            return;
        }

        var opcaoPeriodo;

        if (opcao.getValue().boxLabel == "Todos os dias") {
            opcaoPeriodo = 1;
        }
        else if (opcao.getValue().boxLabel == "Todas as semanas") {
            opcaoPeriodo = 2;
        }
        else if (opcao.getValue().boxLabel == "Todos as quinzenas") {
            opcaoPeriodo = 3;
        }
        else if (opcao.getValue().boxLabel == "Todos os meses") {
            opcaoPeriodo = 4;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/PROGRAMACAO_EMAIL.asmx/Grava_Periodo_Programacao');

        _ajax.setJsonData({
            DATA_INICIAL: TXT_DATA_INICIAL.getRawValue(),
            DATA_FINAL: TXT_DATA_FINAL.getRawValue(),
            PERIODO: opcaoPeriodo,
            ID_MESSAGE: _ID_MESSAGE,
            ID_USUARIO: _ID_USUARIO,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL
        });

        var _sucess = function (response, options) {
            Carrega_Grid();

            if (_acao)
                _acao();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Grava_Programacao_Unica() {
        if (!TXT_DATA_REF.isValid()) {
            return;
        }

        if (TXT_DATA_INICIAL.getValue() < new Date()) {
            dialog.MensagemDeErro('Data de programa&ccedil;&atilde;o inv&aacute;lida', BTN_GRAVAR_UNICA_DATA.getId());
            return;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/PROGRAMACAO_EMAIL.asmx/Grava_Programacao_Unica_Data');

        _ajax.setJsonData({
            DATA_UNICA: TXT_DATA_REF.getRawValue(),
            ID_MESSAGE: _ID_MESSAGE,
            ID_USUARIO: _ID_USUARIO,
            ID_CONTA_EMAIL: _record_conta_email.data.ID_CONTA_EMAIL
        });

        var _sucess = function (response, options) {
            Carrega_Grid();

            if (_acao)
                _acao();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deletar_Programacao(_id) {
        dialog.MensagemDeConfirmacao('Deseja <b>deletar</b> esta programa&ccedil;&atilde;o de envio?', Grid1.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/PROGRAMACAO_EMAIL.asmx/Deletar_Programacao');

                _ajax.setJsonData({
                    ID_PROGRAMACAO: _id,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    Carrega_Grid();

                    if (_acao)
                        _acao();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var wSUGESTAO = new Ext.Window({
        layout: 'form',
        title: 'Informe a programa&ccedil;&atilde;o de datas para o envio autom&aacute;tico deste e-mail',
        width: 768,
        height: 362,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        iconCls: 'icone_ENVIA_COTACAO',
        style: 'position: absolute;',
        renderTo: Ext.getBody(),
        listeners: {
            minimize: function (w) {
                w.hide();
            },
            hide: function () {
                _hide = true;
            }
        },
        items: [form1]
    });

    var _hide = true;
    var _posicao;

    this.posicaoDinamica = function (pValue) {
        _posicao = pValue;
    };

    this.show = function (elm, _grid) {
        if (_hide) {
            if (_posicao == 1) {
                wSUGESTAO.setPosition(elm.getPosition()[0] - 368, elm.getPosition()[1] + elm.getHeight());
                wSUGESTAO.show(elm.getId());
            }
            else {
                var xP = elm.getPageX();
                var yP = elm.getPageY();

                wSUGESTAO.setPosition((LarguraDaJanela - wSUGESTAO.getWidth()) / 2, (AlturaDaJanela - wSUGESTAO.getHeight()) / 2);
                wSUGESTAO.show(_grid.getId());
            }

            wSUGESTAO.toFront();
            Carrega_Grid();
            _hide = false;
        }
        else {
            wSUGESTAO.hide();
            _hide = true;
        }
    };

    this.hide = function () {
        wSUGESTAO.hide();
    };
}
