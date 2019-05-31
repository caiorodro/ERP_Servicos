
function Formulario_Agenda() {
    var vID_USUARIO;
    var vDATA_CALENDARIO;
    var vAcao;

    this.ID_USUARIO = function (pID_USUARIO) {
        vID_USUARIO = pID_USUARIO;
    };

    this.DATA_CALENDARIO = function (pDATA) {
        vDATA_CALENDARIO = pDATA;
    };

    this.Acao_Popular = function (pAcao) {
        vAcao = pAcao;
    };

    var TXT_DATA1 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Listar tarefas a partir de',
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Tarefas_no_Periodo();
                }
            }
        }
    });

    var TXT_DATA2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'at&eacute;',
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Tarefas_no_Periodo();
                }
            }
        }
    });

    var combo_FILTRO_USUARIO = new Ext.form.ComboBox({
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
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Tarefas_no_Periodo();
                }
            }
        }
    });

    var buttonListar = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Tarefas_no_Periodo();
        }
    });

    var Store_CALENDARIO = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['NUMERO_AGENDA', 'INICIO', 'FINAL', 'ID_USUARIO', 'LOGIN_USUARIO', 'TITULO', 'DESCRICAO', 'STATUS', 'TAREFA_CONCLUIDA',
         'ATRASADA'])
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        expandOnEnter: false,
        expandOnDblClick: false,

        tpl: new Ext.Template("<hr width='100%'><br /><b>Anota&ccedil;&otilde;es</b><br /><br /> {DESCRICAO}")
    });

    function Situacao_Agenda(val, metadata, record) {
        if (val == 2) {
            return '<span style="background-color:darkblue; color: #ffff99; font-size: 9pt;">Tarefa Conclu&iacute;da</span>';
        }
        else if (val == 0) {
            return '<span style="background-color: #ff6600; color: #ffff99; font-size: 9pt;">Tarefa em Andamento</span>';
        }
        else if (val == 1) {
            return '<span style="background-color: red; color: #ffff99; font-size: 9pt;">Tarefa Atrasada</span>';
        }
    }

    var GRID_CALENDARIO = new Ext.grid.GridPanel({
        store: Store_CALENDARIO,
        columns: [
            IO_expander,
                { id: 'STATUS', header: "Situa&ccedil;&atilde;o da Tarefa", width: 150, sortable: true, dataIndex: 'STATUS', renderer: Situacao_Agenda },
                { id: 'INICIO', header: "Data de In&iacute;cio", width: 120, sortable: true, dataIndex: 'INICIO', renderer: XMLParseDateTime },
                { id: 'FINAL', header: "Data Final", width: 120, sortable: true, dataIndex: 'FINAL', renderer: XMLParseDateTime },
                { id: 'LOGIN_USUARIO', header: "Respons&aacute;vel", width: 130, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                { id: 'TITULO', header: "T&iacute;tulo", width: 320, sortable: true, dataIndex: 'TITULO' }
            ],
        stripeRows: true,
        width: '100%',
        height: AlturaDoPainelDeConteudo(458),
        anchor: '100%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        plugins: IO_expander,

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                PopulaFormulario_Agenda(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (GRID_CALENDARIO.getSelectionModel().getSelections().length > 0) {
                        var record = GRID_CALENDARIO.getSelectionModel().getSelected();
                        PopulaFormulario_Agenda(record);
                    }
                }
            }
        }
    });

    function Carrega_Tarefas_no_Periodo() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Carrega_Tarefas_no_Periodo');
        _ajax.setJsonData({
            ID_USUARIO: combo_FILTRO_USUARIO.getValue(),
            data1: TXT_DATA1.getRawValue(),
            data2: TXT_DATA2.getRawValue(),
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Store_CALENDARIO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Carrega_Tarefas_do_Dia() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Carrega_Tarefas_do_Dia');
        _ajax.setJsonData({
            ID_USUARIO: vID_USUARIO,
            DATA_CALENDARIO: vDATA_CALENDARIO,
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Store_CALENDARIO.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var hNUMERO_AGENDA = new Ext.form.Hidden();

    var dt1 = new Date();

    var TXT_DATA_INICIO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data de In&iacute;cio',
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.TAB) {
                    if (f.getValue() > TXT_DATA_FINAL.getValue()) {
                        TXT_DATA_FINAL.setValue(f.getValue());
                    }
                }
            }
        }
    });

    var TXT_HORA_INICIO = new Ext.form.TimeField({
        width: 80,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        format: 'H:i',
        listeners: {
            specialkey: function (f, e) {

            }
        }
    });

    var TXT_DATA_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        width: 92,
        autoCreate: { tag: 'input', autocomplete: 'off' }
    });

    var TXT_HORA_FINAL = new Ext.form.TimeField({
        width: 80,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        format: 'H:i'
    });

    var combo_USUARIO = new Ext.form.ComboBox({
        store: combo_TB_USUARIO_Store,
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        fieldLabel: 'Agendar tarefa para',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 150,
        allowBlank: false
    });

    var TXT_TITULO = new Ext.form.TextField({
        fieldLabel: 'T&iacute;tulo',
        width: 290,
        maxLegth: 40,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxLength: '40' }
    });

    var TXT_DESCRICAO = new Th2_HtmlEditor({
        width: 300,
        anchor: '100%',
        width: 1058,
        height: 180,
        allowBlank: false
    });

    TXT_DESCRICAO.on('render', function (h) {
        h.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");
        h.focus(false);
    });

    var CB_TAREFA_CONCLUIDA = new Ext.form.Checkbox({
        boxLabel: 'Tarefa Conclu&iacute;da'
    });

    // Cópia da tarefa a outros usuários

    Carrega_Combo_Usuarios_Tarefas();

    var combo_TB_USUARIO_COPIA_TAREFA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['ID_USUARIO', 'LOGIN_USUARIO', 'NOME_USUARIO', 'EMAIL_USUARIO'])
    });

    function Adiciona_Usuario_Tarefa(record) {

        var existe = false;

        for (var i = 0; i < combo_TB_USUARIO_COPIA_TAREFA_Store.getCount(); i++) {
            if (combo_TB_USUARIO_COPIA_TAREFA_Store.getAt(i).data.ID_USUARIO == record.data.ID_USUARIO) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            var new_record = Ext.data.Record.create([
                        { name: 'ID_USUARIO' },
                        { name: 'LOGIN_USUARIO' },
                        { name: 'NOME_USUARIO' },
                        { name: 'EMAIL_USUARIO' }
                    ]);

            var novo = new new_record({
                ID_USUARIO: record.data.ID_USUARIO,
                LOGIN_USUARIO: record.data.LOGIN_USUARIO,
                NOME_USUARIO: record.data.NOME_USUARIO,
                EMAIL_USUARIO: record.data.EMAIL_USUARIO
            });

            combo_TB_USUARIO_COPIA_TAREFA_Store.insert(combo_TB_USUARIO_COPIA_TAREFA_Store.getCount(), novo);
        }
    }

    var GRID_USUARIOS = new Ext.grid.GridPanel({
        title: 'Lista de usu&aacute;rios',
        tbar: [{
            xtype: 'label',
            text: 'Copiar a tarefa aos seguintes usuários:'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'combo',
            store: combo_TB_USUARIO_TAREFAS_Store,
            valueField: 'ID_USUARIO',
            displayField: 'LOGIN_USUARIO',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione aqui...',
            selectOnFocus: true,
            listeners: {
                select: function (combo, record, index) {
                    if (record.data.ID_USUARIO != _ID_USUARIO) {
                        Adiciona_Usuario_Tarefa(record);
                        combo.reset();
                    }
                }
            }
        }],
        store: combo_TB_USUARIO_COPIA_TAREFA_Store,
        columns: [
                { id: 'LOGIN_USUARIO', header: "Login", width: 120, sortable: true, dataIndex: 'LOGIN_USUARIO' },
                { id: 'NOME_USUARIO', header: "Nome Completo", width: 350, sortable: true, dataIndex: 'NOME_USUARIO' },
                { id: 'EMAIL_USUARIO', header: "e-mail", width: 350, sortable: true, dataIndex: 'EMAIL_USUARIO' }
            ],
        stripeRows: true,
        width: '100%',
        height: 206,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            keydown: function (e) {
                if (e.getKey() == e.DELETE) {
                    if (GRID_USUARIOS.getSelectionModel().getSelections().length > 0) {
                        var record = GRID_USUARIOS.getSelectionModel().getSelected();
                        combo_TB_USUARIO_COPIA_TAREFA_Store.remove(record);

                        // criar rotina que avisa o usuário do cancelamento da participação dele na agenda
                    }
                }
            }
        }
    });

    var formAGENDA = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        autoHeight: true,
        bbar: [{
            text: 'Salvar',
            scale: 'medium',
            icon: 'imagens/icones/database_save_24.gif',
            handler: function () {
                GravaDados_TB_CALENDARIO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Nova Tarefa',
                        scale: 'medium',
                        icon: 'imagens/icones/database_fav_24.gif',
                        handler: function () {
                            ResetaFormularioAgenda();
                            Ext.getCmp('BTN_DELETAR_AGENDA').disable();
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                   { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                 {
                     id: 'BTN_DELETAR_AGENDA',
                     text: 'Deletar',
                     scale: 'medium',
                     icon: 'imagens/icones/database_delete_24.gif',
                     disabled: true,
                     handler: function () {
                         Deleta_Abertura_CRM();
                     }
                 }],
        items: [{
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .30,
                items: [TXT_TITULO]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_DATA_INICIO]
            }, {
                columnWidth: 0.10,
                layout: 'form',
                items: [TXT_HORA_INICIO]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [TXT_DATA_FINAL]
            }, {
                columnWidth: .10,
                layout: 'form',
                items: [TXT_HORA_FINAL]
            }, {
                columnWidth: .18,
                layout: 'form',
                items: [combo_USUARIO]
            }, {
                columnWidth: .12,
                layout: 'form',
                items: [CB_TAREFA_CONCLUIDA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                items: [{
                    xtype: 'fieldset',
                    checkboxToggle: false,
                    title: 'Descri&ccedil;&atilde;o das atividades',
                    autoHeight: true,
                    bodyStyle: 'padding: 0px 0px 0',
                    width: '97%',
                    items: [TXT_DESCRICAO]
                }]
            }, {
                columnWidth: .50,
                items: [{
                    xtype: 'fieldset',
                    checkboxToggle: false,
                    title: 'Usu&aacute;rios que receber&atilde;o uma c&oacute;pia da tarefa',
                    autoHeight: true,
                    bodyStyle: 'padding: 0px 0px 0',
                    width: '97%',
                    items: [GRID_USUARIOS]
                }]
            }]
        }]
    });

    function ResetaFormularioAgenda() {
        hNUMERO_AGENDA.setValue(0);

        combo_USUARIO.reset();
        TXT_DATA_INICIO.setValue(new Date());
        TXT_HORA_INICIO.reset();
        TXT_DATA_FINAL.setValue(new Date());
        TXT_HORA_FINAL.reset();
        TXT_TITULO.reset();
        TXT_DESCRICAO.setValue("<div style='font-family: tahoma; font-size: 9pt;'>&nbsp;</div>");
        CB_TAREFA_CONCLUIDA.setValue(false);
        combo_TB_USUARIO_COPIA_TAREFA_Store.removeAll();
    }

    function PopulaFormulario_Agenda(record) {
        hNUMERO_AGENDA.setValue(record.data.NUMERO_AGENDA);

        combo_USUARIO.setValue(record.data.ID_USUARIO);
        TXT_DATA_INICIO.setRawValue(XMLParseDate(record.data.INICIO));
        TXT_HORA_INICIO.setRawValue(XMLParseDateTime(record.data.INICIO).substr(11, 5));
        TXT_DATA_FINAL.setRawValue(XMLParseDate(record.data.FINAL));
        TXT_HORA_FINAL.setRawValue(XMLParseDateTime(record.data.FINAL).substr(11, 5));
        TXT_TITULO.setValue(record.data.TITULO);
        TXT_DESCRICAO.setValue(record.data.DESCRICAO);
        CB_TAREFA_CONCLUIDA.setValue(record.data.TAREFA_CONCLUIDA == 1 ? true : false);

        Ext.getCmp('BTN_DELETAR_AGENDA').enable();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Busca_Usuarios_Associados_na_Tarefa');
        _ajax.setJsonData({
            NUMERO_AGENDA: record.data.NUMERO_AGENDA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < result.length; i++) {
                var _index = combo_TB_USUARIO_TAREFAS_Store.find('ID_USUARIO', result[i]);
                var _record = combo_TB_USUARIO_TAREFAS_Store.getAt(_index);

                Adiciona_Usuario_Tarefa(_record);
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function GravaDados_TB_CALENDARIO() {
        if (!formAGENDA.getForm().isValid()) {
            return;
        }

        var INICIO = TXT_DATA_INICIO.getValue();
        var cINICIO = (INICIO.getMonth() + 1) + '/' + INICIO.getDate() + '/' + INICIO.getFullYear() + ' ' + TXT_HORA_INICIO.getRawValue();

        var FINAL = TXT_DATA_FINAL.getValue();
        var cFINAL = (FINAL.getMonth() + 1) + '/' + FINAL.getDate() + '/' + FINAL.getFullYear() + ' ' + TXT_HORA_FINAL.getRawValue();

        //                    if (Date.parse(cINICIO) < new Date() || Date.parse(cFINAL) < new Date()) {
        //                        dialog.MensagemDeErro('A data de in&iacute;cio ou a data final n&atilde;o pode ser menor que a data / hora atual', formAGENDA.getId());
        //                        return;
        //                    }

        //                    if (Date.parse(cINICIO) == Date.parse(cFINAL)) {
        //                        dialog.MensagemDeErro('A data de in&iacute;cio n&atilde;o pode ser igual à data final', formAGENDA.getId());
        //                        return;
        //                    }

        var _agenda = hNUMERO_AGENDA.getValue();

        if (_agenda == undefined)
            _agenda = 0;

        var _comentarios = TXT_DESCRICAO.getValue();

        var tarefa_Concluida = CB_TAREFA_CONCLUIDA.checked ? 1 : 0;

        // Cópia da tarefas para outros usuários

        var array1 = new Array();

        array1[array1.length] = combo_USUARIO.getValue();

        for (var i = 0; i < combo_TB_USUARIO_COPIA_TAREFA_Store.getCount(); i++) {
            array1[array1.length] = combo_TB_USUARIO_COPIA_TAREFA_Store.getAt(i).data.ID_USUARIO;
        }

        var dados = {
            NUMERO_AGENDA: _agenda,
            INICIO: TXT_DATA_INICIO.getRawValue() + ' ' + TXT_HORA_INICIO.getRawValue(),
            FINAL: TXT_DATA_FINAL.getRawValue() + ' ' + TXT_HORA_FINAL.getRawValue(),
            TITULO: TXT_TITULO.getValue(),
            DESCRICAO: _comentarios,
            TAREFA_CONCLUIDA: tarefa_Concluida,
            ID_USUARIO: _ID_USUARIO,
            ID_USUARIO_ORIGINAL: _ID_USUARIO
        };

        var Url = _agenda == 0 ?
                        'servicos/TB_CALENDARIO.asmx/Grava_Nova_Agenda_para_Varios_Usuarios' :
                        'servicos/TB_CALENDARIO.asmx/Altera_Agenda_para_Varios_Usuarios';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados, usuarios: array1 });

        var _sucess = function (response, options) {
            ResetaFormularioAgenda();
            TXT_TITULO.focus();

            Carrega_Tarefas_no_Periodo();

            if (vAcao) {
                vAcao();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_Abertura_CRM() {
        dialog.MensagemDeConfirmacao('Deseja deletar esta anota&ccedil;&atilde;o de agenda?', 'BTN_DELETAR_AGENDA', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Deleta_Agenda');
                _ajax.setJsonData({
                    NUMERO_AGENDA: hNUMERO_AGENDA.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    ResetaFormularioAgenda();
                    Ext.getCmp('BTN_DELETAR_AGENDA').disable();
                    Carrega_Tarefas_no_Periodo();

                    if (vAcao) {
                        vAcao();
                    }
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var wAGENDA = new Ext.Panel({
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        frame: true,
        title: 'Anota&ccedil;&otilde;es',
        items: [{
            frame: true,
            items: [{
                layout: 'column',
                items: [formAGENDA, GRID_CALENDARIO,
                {
                    columnWidth: .23,
                    labelAlign: 'left',
                    layout: 'form',
                    labelWidth: 137,
                    items: [TXT_DATA1]
                }, {
                    columnWidth: .14,
                    layout: 'form',
                    labelWidth: 26,
                    labelAlign: 'left',
                    items: [TXT_DATA2]
                }, {
                    columnWidth: .22,
                    layout: 'form',
                    labelWidth: 51,
                    labelAlign: 'left',
                    items: [combo_FILTRO_USUARIO]
                }, {
                    columnWidth: .10,
                    items: [buttonListar]
                }]
            }]
        }]
    });

    this.Agenda = function () {
        return wAGENDA;
    };

    // Calendário

    TXT_DATA_INICIO.on('render', function () { TXT_DATA_INICIO.setRawValue(vDATA_CALENDARIO) });
    TXT_DATA_FINAL.on('render', function () { TXT_DATA_FINAL.setRawValue(vDATA_CALENDARIO) });

    TXT_DATA1.on('render', function () { TXT_DATA1.setRawValue(vDATA_CALENDARIO) });
    TXT_DATA2.on('render', function () { TXT_DATA2.setRawValue(vDATA_CALENDARIO) });

    combo_FILTRO_USUARIO.on('render', function () { combo_FILTRO_USUARIO.setValue(vID_USUARIO) });
    combo_USUARIO.on('render', function () { combo_USUARIO.setValue(vID_USUARIO) });

    this.show = function (elm) {

        Ext.getCmp('TAB_PANEL_CALENDARIO').setActiveTab(1);
        Ext.getCmp('TAB_PANEL_CALENDARIO').getActiveTab().setTitle('Agenda de tarefas <b>[' + vDATA_CALENDARIO + ']</b>');

        Store_CALENDARIO.removeAll();
        Carrega_Tarefas_do_Dia();

        if (hNUMERO_AGENDA.getValue() > 0)
            ResetaFormularioAgenda();

        try {
            TXT_DATA_INICIO.setRawValue(vDATA_CALENDARIO);
            TXT_DATA_FINAL.setRawValue(vDATA_CALENDARIO);

            TXT_DATA1.setRawValue(vDATA_CALENDARIO);
            TXT_DATA2.setRawValue(vDATA_CALENDARIO);

            combo_FILTRO_USUARIO.setValue(vID_USUARIO);
            combo_USUARIO.setValue(vID_USUARIO);
        }
        catch (e) {

        }

        combo_TB_USUARIO_COPIA_TAREFA_Store.removeAll();
        TXT_TITULO.focus();
    };
}

var _tarefa = new Formulario_Agenda();
var _AcaoPopularCalendario;

function buscaAgenda(_data, elm) {
    _tarefa.ID_USUARIO(Ext.getCmp('combo_FILTRO_USUARIO_AGENDA').getValue());
    _tarefa.DATA_CALENDARIO(_data);
    _tarefa.Acao_Popular(_AcaoPopularCalendario);
    _tarefa.show('AGENDA_DATA_REF');
}

function Calendario() {

    var dt1 = new Date();

    var TXT_DATA_REFERENCIA = new Ext.form.DateField({
        id: 'AGENDA_DATA_REF',
        width: 92,
        value: dt1,
        autoCreate: { tag: 'input', autocomplete: 'off' },
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Calendario();
                }
            }
        }
    });

    var BTN_PROXIMO_MES = new Ext.Button({
        icon: 'imagens/icones/forward_16.gif',
        scale: 'small',
        tooltip: 'Próximo mês',
        handler: function () {
            var dtRef = TXT_DATA_REFERENCIA.getValue();
            TXT_DATA_REFERENCIA.setValue(dtRef.add(Date.MONTH, 1));
            Carrega_Calendario();
        }
    });

    var BTN_MES_ANTERIOR = new Ext.Button({
        icon: 'imagens/icones/rewind_16.gif',
        scale: 'small',
        tooltip: 'Mês anterior',
        handler: function () {
            var dtRef = TXT_DATA_REFERENCIA.getValue();
            TXT_DATA_REFERENCIA.setValue(dtRef.add(Date.MONTH, -1));
            Carrega_Calendario();
        }
    });

    var combo_FILTRO_USUARIO = new Ext.form.ComboBox({
        store: combo_TB_USUARIO_Store,
        id: 'combo_FILTRO_USUARIO_AGENDA',
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
                    Carrega_Calendario();
                }
            },
            select: function (combo, record, index) {
                if (index > -1)
                    Carrega_Calendario();
            }
        }
    });

    Carrega_Combo_Usuarios();

    combo_TB_USUARIO_Store.on('load', function () {
        combo_FILTRO_USUARIO.setValue(_ID_USUARIO);
    });

    combo_FILTRO_USUARIO.on('render', function () { combo_FILTRO_USUARIO.setValue(_ID_USUARIO) });

    // Módulo
    var combo_MODULO = new Ext.form.ComboBox({
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[0, 'Agenda'], [1, 'Vendas'], [2, 'Compras'], [3, 'Financeiro']]
        }),
        valueField: 'Opc',
        displayField: 'Opcao',
        fieldLabel: 'M&oacute;dulo',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 130,
        allowBlank: false,
        value: 0,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    Carrega_Calendario();
                }
            },
            select: function (combo, record, index) {
                if (index > -1)
                    Carrega_Calendario();
            }
        }
    });

    if (_ADMIN_USUARIO != 1) {
        combo_MODULO.getStore().removeAt(2);
    }

    ////

    var buttonListar = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            Carrega_Calendario();
        }
    });

    var storeCalendario = new Ext.data.Store({
        reader: new Ext.data.XmlReader({ record: 'Tabela' },
         ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'])
    });

    var gridCalendario = new Ext.grid.GridPanel({
        id: 'gridCalendario_Agenda',
        store: storeCalendario,
        columns: [
                { id: 'DOMINGO', header: "DOMINGO", width: 160, sortable: false, dataIndex: 'DOMINGO', align: 'center' },
                { id: 'SEGUNDA', header: "SEGUNDA", width: 160, sortable: false, dataIndex: 'SEGUNDA', align: 'center' },
                { id: 'TERCA', header: "TER&Ccedil;A", width: 160, sortable: false, dataIndex: 'TERCA', align: 'center' },
                { id: 'QUARTA', header: "QUARTA", width: 160, sortable: false, dataIndex: 'QUARTA', align: 'center' },
                { id: 'QUINTA', header: "QUINTA", width: 160, sortable: false, dataIndex: 'QUINTA', align: 'center' },
                { id: 'SEXTA', header: "SEXTA", width: 160, sortable: false, dataIndex: 'SEXTA', align: 'center' },
                { id: 'SABADO', header: "S&Aacute;BADO", width: 160, sortable: false, dataIndex: 'SABADO', align: 'center' }
            ],
        stripeRows: true,
        width: '100%',
        height: AlturaDoPainelDeConteudo(97),
        trackMouseOver: false,
        disableSelection: true
    });

    function Carrega_Calendario() {
        _AcaoPopularCalendario = function () {
            if (!TXT_DATA_REFERENCIA.isValid())
                return;

            var _ajax = new Th2_Ajax();
            if (combo_MODULO.getValue() == 0 || combo_MODULO.getValue() == 3) {
                _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Monta_Calendario');
                _ajax.setJsonData({
                    ID_USUARIO: combo_FILTRO_USUARIO.getValue() == '' ? _ID_USUARIO : combo_FILTRO_USUARIO.getValue(),
                    DATA_REFERENCIA: TXT_DATA_REFERENCIA.getRawValue(),
                    MODULO: combo_MODULO.getValue(),
                    ID_USUARIO_ORIGINAL: _ID_USUARIO
                });
            }

            else if (combo_MODULO.getValue() == 1 || combo_MODULO.getValue() == 2) { // Vendas e Compras
                _ajax.setUrl('servicos/TB_CALENDARIO.asmx/Preenche_Calendario_de_Compras_ou_Vendas');
                _ajax.setJsonData({
                    DATA_REFERENCIA: TXT_DATA_REFERENCIA.getRawValue(),
                    MODO: combo_MODULO.getValue(),
                    SUPERVISOR: _SUPERVISOR,
                    VENDEDOR: _VENDEDOR,
                    ID_VENDEDOR: _ID_VENDEDOR,
                    ID_EMPRESA: _ID_EMPRESA,
                    ID_USUARIO: _ID_USUARIO
                });
            }

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                storeCalendario.loadData(criaObjetoXML(result), false);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        _AcaoPopularCalendario();
    }

    var panel1 = new Ext.Panel({
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        border: true,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .023,
                items: [BTN_MES_ANTERIOR]
            }, {
                columnWidth: .077,
                items: [TXT_DATA_REFERENCIA]
            }, {
                columnWidth: .05,
                items: [BTN_PROXIMO_MES]
            }, {
                columnWidth: .19,
                layout: 'form',
                labelWidth: 51,
                labelAlign: 'left',
                items: [combo_FILTRO_USUARIO]
            }, {
                columnWidth: .19,
                layout: 'form',
                labelWidth: 51,
                labelAlign: 'left',
                items: [combo_MODULO]
            }, {
                columnWidth: .10,
                items: [buttonListar]
            }]
        }, gridCalendario]
    });
    
    _tarefa = new Formulario_Agenda();

    var TAB_PANEL_CALENDARIO = new Ext.TabPanel({
        id: 'TAB_PANEL_CALENDARIO',
        deferredRender: false,
        activeTab: 0,
        items: [{
            title: 'Calend&aacute;rio de atividades',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_TB_FERIADO',
            items: [panel1]
        }, {
            title: 'Agenda de tarefas',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_FOLLOW_UP'
        }],
        listeners: {
            tabchange: function (tabPanel, panel) {
                if (tabPanel.getActiveTab().iconCls == "icone_FOLLOW_UP") {
                    if (panel.items.length == 0) {
                        panel.add(_tarefa.Agenda());
                        panel.doLayout();
                    }
                }
            }
        }
    });

    if (_GERENTE_COMPRAS != 1 || _ADMIN_USUARIO != 1) {
        combo_MODULO.getStore().removeAt(2);
        combo_MODULO.getStore().removeAt(2);
        combo_FILTRO_USUARIO.disable();
    }

    Carrega_Calendario();

    return TAB_PANEL_CALENDARIO;
}