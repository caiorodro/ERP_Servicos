function janela_Contatos_Email() {

    var TXT_EMAIL_CONTATO = new Ext.form.TextField({
        fieldLabel: 'e-mail',
        width: 400,
        maxLength: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '100' },
        vtype: 'email',
        allowBlank: false
    });

    var TXT_NOME_CONTATO = new Ext.form.TextField({
        fieldLabel: 'Nome do Contato',
        width: 400,
        maxLength: 60,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '60' }
    });

    var TXT_FILTRO = new Ext.form.TextField({
        fieldLabel: 'Filtro Contato',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER)
                    CARREGA_GRID();
            }
        }
    });

    var BTN_FILTRO = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            CARREGA_GRID();
        }
    });

    var formEMAIL_CONTATO = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 120,
        items: [{
            layout: 'form',
            items: [{
                layout: 'form',
                items: [TXT_EMAIL_CONTATO]
            }, {
                layout: 'form',
                items: [TXT_NOME_CONTATO]
            }]
        }]

    });

    var EMAIL_CONTATO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_USUARIO', 'EMAIL_CONTATO', 'NOME_CONTATO']
                    )
    });

    var gridEMAIL_CONTATO = new Ext.grid.GridPanel({
        store: EMAIL_CONTATO_Store,
        columns: [
                    { id: 'EMAIL_CONTATO', header: "E-mail contato", width: 300, sortable: true, dataIndex: 'EMAIL_CONTATO' },
                    { id: 'NOME_CONTATO', header: "Nome do contato", width: 300, sortable: true, dataIndex: 'NOME_CONTATO' }
                    ],
        stripeRows: true,
        height: 250,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridEMAIL_CONTATO.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario(record);
    });

    gridEMAIL_CONTATO.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridEMAIL_CONTATO.getSelectionModel().getSelections().length > 0) {
                var record = gridEMAIL_CONTATO.getSelectionModel().getSelected();
                PopulaFormulario(record);
            }
        }
    });

    function PopulaFormulario(record) {
        TXT_EMAIL_CONTATO.setValue(record.data.EMAIL_CONTATO);
        TXT_NOME_CONTATO.setValue(record.data.NOME_CONTATO);

        panelCadastroCONTATO.setTitle('Alterar Contato');

        Ext.getCmp('BTN_DELETAR_CONTATO').enable();

        TXT_EMAIL_CONTATO.disable();

        TXT_EMAIL_CONTATO.focus();
    }

    function RetornaVENDA_JsonData() {
        var x = TXT_FILTRO.getValue();

        if (!x)
            x = '';

        var CLAS_FISCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            FILTRO: x,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var CONTATO_PagingToolbar = new Th2_PagingToolbar();
    CONTATO_PagingToolbar.setUrl('servicos/TB_EMAIL_CONTATO.asmx/Carrega_Contato');
    CONTATO_PagingToolbar.setStore(EMAIL_CONTATO_Store);

    function CARREGA_GRID() {
        CONTATO_PagingToolbar.setParamsJsonData(RetornaVENDA_JsonData());
        CONTATO_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_EMAIL_CONTATO();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
               { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                text: 'Novo Contato',
                                icon: 'imagens/icones/database_fav_24.gif',
                                scale: 'medium',
                                handler: function () {
                                    TXT_EMAIL_CONTATO.focus();

                                    Reseta_Formulario();

                                    Ext.getCmp('BTN_DELETAR_CONTATO').disable();
                                    TXT_EMAIL_CONTATO.enable();

                                    panelCadastroCONTATO.setTitle('Novo Contato');
                                }
                            },
                        { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                            {
                                id: 'BTN_DELETAR_CONTATO',
                                text: 'Deletar',
                                icon: 'imagens/icones/database_delete_24.gif',
                                scale: 'medium',
                                disabled: true,
                                listeners: {
                                    click: function (button, e) {
                                        Deleta_TB_EMAIL_CONTATO();
                                    }
                                }
                            }]
    });

    function Reseta_Formulario() {
        TXT_EMAIL_CONTATO.reset();
        TXT_NOME_CONTATO.reset();
    }

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastroCONTATO = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Contato',
        items: [formEMAIL_CONTATO, toolbar1, gridEMAIL_CONTATO, CONTATO_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_EMAIL_CONTATO() {
        if (!formEMAIL_CONTATO.getForm().isValid()) {
            return;
        }

        var Url = panelCadastroCONTATO.title == 'Novo Contato' ?
                'servicos/TB_EMAIL_CONTATO.asmx/Grava_Novo_Contato' :
                'servicos/TB_EMAIL_CONTATO.asmx/Atualiza_Contato';

        var dados = {
            ID_USUARIO: _ID_USUARIO,
            EMAIL_CONTATO: TXT_EMAIL_CONTATO.getValue(),
            NOME_CONTATO: TXT_NOME_CONTATO.getValue()
        };

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroCONTATO.title == 'Novo Contato')
                formEMAIL_CONTATO.getForm().reset();

            TXT_EMAIL_CONTATO.focus();

            CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_EMAIL_CONTATO() {
        dialog.MensagemDeConfirmacao('Deseja delete este contato?', formEMAIL_CONTATO.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_EMAIL_CONTATO.asmx/Deleta_Contato');
                _ajax.setJsonData({
                    ID_USUARIO: _ID_USUARIO,
                    EMAIL_CONTATO: TXT_EMAIL_CONTATO.getValue()
                });

                var _sucess = function (response, options) {

                    Reseta_Formulario();
                    panelCadastroCONTATO.setTitle('Novo Contato');

                    Ext.getCmp('BTN_DELETAR_CONTATO').disable();
                    TXT_EMAIL_CONTATO.enable();

                    CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var wCONTATOS = new Ext.Window({
        title: 'Contatos',
        layout: 'form',
        iconCls: 'icone_TB_USUARIO',
        width: 700,
        height: 534,
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
        items: [panelCadastroCONTATO,
            {
                layout: 'column',
                frame: true,
                items: [{
                    columnWidth: .07,
                    xtype: 'label',
                    style: 'font-family: tahoma; font-size: 10pt;',
                    text: 'Filtro:'
                }, {
                    columnWidth: .46,
                    items: [TXT_FILTRO]
                }, {
                    columnWidth: .12,
                    layout: 'form',
                    items: [BTN_FILTRO]
                }]
            }]
    });

    this.show = function (elm) {
        CARREGA_GRID();
        wCONTATOS.show(elm);
    };
}

var TODOS_OS_CONTATOS = new Ext.data.Store({
    reader: new Ext.data.XmlReader({ record: 'Tabela' },
    ['EMAIL_CONTATO', 'USO']),

    sortInfo: { field: 'USO', direction: 'DESC' }
});

function Carrega_Todos_os_Contatos_do_Usuario() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Carrega_Todos_os_Contatos_do_Usuario');

    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        TODOS_OS_CONTATOS.loadData(criaObjetoXML(result), false);
        Carrega_Todos_os_Emails_de_Grupo();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var TODOS_OS_GRUPOS_DE_CONTATOS = new Ext.data.Store({
    reader: new Ext.data.XmlReader({ record: 'Tabela' },
    ['NOME_GRUPO_EMAIL', 'USO', 'EMAIL_CONTIDO']),

    sortInfo: { field: 'USO', direction: 'DESC' }
});

function Carrega_Todos_os_Grupos_de_email() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Carrega_Todos_os_Grupos_de_email');

    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        TODOS_OS_GRUPOS_DE_CONTATOS.loadData(result, false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function Carrega_Todos_os_Emails_de_Grupo() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/Carrega_Todos_os_Emails_de_Grupo');

    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        TODOS_OS_CONTATOS.loadData(criaObjetoXML(result), true);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function carrega_Emails_Contidos_no_Grupo(grupo) {

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_EMAIL.asmx/carrega_Emails_Contidos_no_Grupo');

    _ajax.setJsonData({
        GRUPO: grupo,
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;

        var _TODOS_OS_CONTATOS = new Ext.data.Store({
            reader: new Ext.data.XmlReader({ record: 'Tabela' },
                ['NOME_GRUPO_EMAIL', 'USO', 'EMAIL_CONTIDO']),

            sortInfo: { field: 'USO', direction: 'DESC' }
        });

        _TODOS_OS_CONTATOS.loadData(criaObjetoXML(result), false);

        var arrRecords = new Array();
        var n = 0;

        for (var i = 0; i < _TODOS_OS_CONTATOS.getCount(); i++) {
            if (TODOS_OS_CONTATOS.find('NOME_GRUPO_EMAIL', _TODOS_OS_CONTATOS.getAt(i).data.NOME_GRUPO_EMAIL) > -1 &&
                TODOS_OS_CONTATOS.find('EMAIL_CONTIDO', _TODOS_OS_CONTATOS.getAt(i).data.EMAIL_CONTIDO) > -1) {
                arrRecords[n] = _TODOS_OS_CONTATOS.getAt(i);
                n++;
            }
        }

        for (i = 0; i < arrRecords.length; i++) {
            _TODOS_OS_CONTATOS.remove(arrRecords[i]);
        }

        TODOS_OS_GRUPOS_DE_CONTATOS.insert(TODOS_OS_GRUPOS_DE_CONTATOS.getCount(), _TODOS_OS_CONTATOS.getRange());

        _TODOS_OS_CONTATOS.removeAll();
        _TODOS_OS_CONTATOS = undefined;
        delete _TODOS_OS_CONTATOS;
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}