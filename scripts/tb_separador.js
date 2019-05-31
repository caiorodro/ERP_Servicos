var SEPARADOR_STORE = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
        record: 'Tabela'
    }, ['ID_SEPARADOR', 'NOME_SEPARADOR'])
});

function CARREGA_COMBO_SEPARADOR() {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_SEPARADOR.asmx/Lista_Separadores');
    _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        SEPARADOR_STORE.loadData(criaObjetoXML(result), false);
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function MontaCadastroSeparador() {

    var TXT_ID_SEPARADOR = new Ext.form.NumberField({
        fieldLabel: 'C&oacute;digo',
        width: 100,
        name: 'ID_SEPARADOR',
        id: 'ID_SEPARADOR',
        maxLength: 15,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' }
    });

    var TXT_NOME_SEPARADOR = new Ext.form.TextField({
        fieldLabel: 'Nome',
        name: 'NOME_SEPARADOR',
        id: 'NOME_SEPARADOR',
        width: 260,
        allowBlank: false,
        maxLenght: 35,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '35' }
    });

    var CB_SEPARADOR_ATIVO = new Ext.form.Checkbox({
        boxLabel: 'Separador Ativo',
        name: 'SEPARADOR_ATIVO',
        id: 'SEPARADOR_ATIVO',
        checked: true
    });

    var formSEPARADOR = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 225,
        items: [{
            xtype: 'fieldset',
            checkboxToggle: false,
            title: 'Separadores de Mercadorias',
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
            width: '98%',
            items: [{
                layout: 'form',
                items: [TXT_ID_SEPARADOR]
            }, {
                layout: 'form',
                items: [TXT_NOME_SEPARADOR]
            }, {
                layout: 'form',
                items: [CB_SEPARADOR_ATIVO]
            }]
        }]
    });

    function ResetaFormulario() {
        TXT_ID_SEPARADOR.reset();
        TXT_NOME_SEPARADOR.reset();
        CB_SEPARADOR_ATIVO.reset();
    }

    function PopulaFormulario_TB_SEPARADOR(record) {
        formSEPARADOR.getForm().loadRecord(record);

        Ext.getCmp('ID_SEPARADOR').setValue(record.data.ID_SEPARADOR);
        Ext.getCmp('NOME_SEPARADOR').setValue(record.data.NOME_SEPARADOR);
        CB_SEPARADOR_ATIVO.setValue(record.data.SEPARADOR_ATIVO != 1 ? false : true);

        panelCadastroSEPARADOR.setTitle('Alterar dados do Separador');

        buttonGroup_TB_SEPARADOR.items.items[32].enable();
        formSEPARADOR.getForm().items.items[0].disable();

        formSEPARADOR.getForm().findField('NOME_SEPARADOR').focus();
    }

    var TB_SEPARADOR_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
                    ['ID_SEPARADOR', 'NOME_SEPARADOR', 'SEPARADOR_ATIVO']
                    )
    });

    var gridSEPARADOR = new Ext.grid.GridPanel({
        store: TB_SEPARADOR_Store,
        columns: [
                    { id: 'ID_SEPARADOR', header: "C&oacute;digo", width: 80, sortable: true, dataIndex: 'ID_SEPARADOR' },
                    { id: 'NOME_SEPARADOR', header: "Nome", width: 260, sortable: true, dataIndex: 'NOME_SEPARADOR' },
                    { id: 'SEPARADOR_ATIVO', header: "Ativo", width: 80, sortable: true, dataIndex: 'SEPARADOR_ATIVO', renderer: TrataCombo01 }
                    ],
        stripeRows: true,
        height: 221,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    gridSEPARADOR.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario_TB_SEPARADOR(record);
    });

    gridSEPARADOR.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (gridSEPARADOR.getSelectionModel().getSelections().length > 0) {
                var record = gridSEPARADOR.getSelectionModel().getSelected();
                PopulaFormulario_TB_SEPARADOR(record);
            }
        }
    });

    function Apoio_PopulaGrid_SEPARADOR(f, e) {
        if (e.getKey() == e.ENTER) {
            TB_SEPARADOR_CARREGA_GRID();
        }
    }

    function RetornaSEPARADOR_JsonData() {
        var NOME_SEPARADOR = Ext.getCmp('TXT_FILTRO_NOME_SEPARADOR') ?
                    Ext.getCmp('TXT_FILTRO_NOME_SEPARADOR').getValue() : '';

        if (NOME_SEPARADOR == undefined) NOME_SEPARADOR = '';

        var numero_banco = Ext.getCmp('combo_FILTRO_NUMERO_BANCO_RETORNO') ?
                    Ext.getCmp('combo_FILTRO_NUMERO_BANCO_RETORNO').getValue() : 0;

        if (numero_banco == '') numero_banco = 0;

        var LOCAL_JsonData = {
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return LOCAL_JsonData;
    }

    var SEPARADOR_PagingToolbar = new Th2_PagingToolbar();
    SEPARADOR_PagingToolbar.setUrl('servicos/TB_SEPARADOR.asmx/Carrega_Separador');
    SEPARADOR_PagingToolbar.setStore(TB_SEPARADOR_Store);

    function TB_SEPARADOR_CARREGA_GRID() {
        SEPARADOR_PagingToolbar.setParamsJsonData(RetornaSEPARADOR_JsonData());
        SEPARADOR_PagingToolbar.doRequest();
    }

    ///////////////////////////
    var buttonGroup_TB_SEPARADOR = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados_TB_SEPARADOR();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                    {
                        text: 'Novo Separador',
                        icon: 'imagens/icones/database_fav_24.gif',
                        scale: 'medium',
                        handler: function () {
                            buttonGroup_TB_SEPARADOR.items.items[32].disable();

                            TXT_NOME_SEPARADOR.focus();
                            ResetaFormulario();
                            panelCadastroSEPARADOR.setTitle('Novo Separador');
                        }
                    }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                       { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                     {
                         id: 'BTN_DELETAR_TB_OCORRENCIA_RETORNO',
                         text: 'Deletar',
                         icon: 'imagens/icones/database_delete_24.gif',
                         scale: 'medium',
                         disabled: true,
                         handler: function () {
                             Deleta_TB_SEPARADOR();
                         }
                     }]
    });

    var toolbar_TB_SEPARADOR = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup_TB_SEPARADOR]
    });

    var panelCadastroSEPARADOR = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Novo Separador',
        items: [formSEPARADOR, toolbar_TB_SEPARADOR, gridSEPARADOR, SEPARADOR_PagingToolbar.PagingToolbar()]
    });

    function GravaDados_TB_SEPARADOR() {
        if (!formSEPARADOR.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_SEPARADOR: TXT_ID_SEPARADOR.getValue(),
            NOME_SEPARADOR: TXT_NOME_SEPARADOR.getValue(),
            SEPARADOR_ATIVO: CB_SEPARADOR_ATIVO.checked ? 1 : 0,
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastroSEPARADOR.title == "Novo Separador" ?
                        'servicos/TB_SEPARADOR.asmx/GravaNovoSeparador' :
                        'servicos/TB_SEPARADOR.asmx/AtualizaSeparador';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastroSEPARADOR.title == "Novo Separador") {
                ResetaFormulario();
            }

            TXT_NOME_SEPARADOR.focus();
            TB_SEPARADOR_CARREGA_GRID();
            CARREGA_COMBO_SEPARADOR();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_TB_SEPARADOR() {
        dialog.MensagemDeConfirmacao('Deseja deletar este Separador?', formSEPARADOR.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_SEPARADOR.asmx/DeletaSeparador');
                _ajax.setJsonData({
                    ID_SEPARADOR: TXT_ID_SEPARADOR.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastroSEPARADOR.setTitle("Novo Separador");

                    ResetaFormulario();

                    TXT_NOME_SEPARADOR.focus();

                    buttonGroup_TB_SEPARADOR.items.items[32].disable();

                    TB_SEPARADOR_CARREGA_GRID();
                    CARREGA_COMBO_SEPARADOR();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    gridSEPARADOR.setHeight(AlturaDoPainelDeConteudo(formSEPARADOR.height) - 125);

    TB_SEPARADOR_CARREGA_GRID();

    return panelCadastroSEPARADOR;
}