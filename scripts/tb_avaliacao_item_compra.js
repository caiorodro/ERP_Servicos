function Panel_Avaliacao() {

    var _NUMERO_PEDIDO_COMPRA;
    var _NUMERO_ITEM_COMPRA;
    var _CODIGO_FORNECEDOR;

    this.NUMERO_PEDIDO_COMPRA = function (pValue) {
        _NUMERO_PEDIDO_COMPRA = pValue;
    };

    this.NUMERO_ITEM_COMPRA = function (pValue) {
        _NUMERO_ITEM_COMPRA = pValue;
    };

    this.CODIGO_FORNECEDOR = function (pValue) {
        _CODIGO_FORNECEDOR = pValue;
    };

    var hID_AVALIACAO = new Ext.form.Hidden();

    // Embalagem

    var TXT_AVALIACAO_EMBALAGEM_DESCRICAO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Descri&ccedil;&atilde;o',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_EMBALAGEM_LOTE = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Lote',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_EMBALAGEM_MATERIAL = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Material',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_EMBALAGEM_MEDIDA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Medida',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_EMBALAGEM_PESO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Peso',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_EMBALAGEM_QTDE = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    // Entrega

    var TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Entrega Antecipada (dias)',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Entrega Atrasada (dias)',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    // Qtde
    var TXT_AVALIACAO_QTDE_ESPECIAL_A_MAIOR = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial a maior',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QTDE_ESPECIAL_A_MENOR = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial a menor',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QTDE_ESPECIAL_SOLICITADA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial solicitada',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QTDE_NORMAL_A_MAIOR = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial a maior',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QTDE_NORMAL_A_MENOR = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial a menor',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QTDE_NORMAL_SOLICITADA = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Qtde especial solicitada',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    // Acabamento

    var TXT_AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Acabamento aprovado',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Acabamento aprovado',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Acabamento condicional',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Acabamento condicional',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Acabamento reprovado',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    // Dimensional

    var TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Dimensional aprovado',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Dimensional condicional',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO = new Ext.ux.form.SpinnerField({
        fieldLabel: 'Dimensional condicional',
        width: 90,
        allowBlank: false,
        minValue: 0,
        value: 100
    });

    var TXT_OBSERVACAO_DA_AVALIACAO = new Ext.form.TextField({
        fieldLabel: 'Observa&ccedil;&otilde;es',
        anchor: '100%',
        autoCreate: { tag: 'textarea', autocomplete: 'off' },
        height: 38
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
        width: 380,
        listeners: {
            select: function (combo, record, index) {
                if (record.data.NUMERO_DIAS_ENTREGA_ANTECIPADA > 0) {
                    TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS.setValue(record.data.PONTUACAO_ENTREGA);
                    TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS.setValue(100);
                }

                if (record.data.NUMERO_DIAS_ENTREGA_ATRASADA > 0) {
                    TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS.setValue(record.data.PONTUACAO_ENTREGA);
                    TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS.setValue(100);
                }
            }
        }
    });

    var form1 = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .35,
                layout: 'form',
                items: [CB_ID_RNC]
            }, {
                columnWidth: .65,
                layout: 'form',
                items: [TXT_OBSERVACAO_DA_AVALIACAO]
            }]

        }, {
            layout: 'column',
            items: [{
                columnWidth: .50,
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Embalagem',
                autoHeight: true,
                bodyStyle: 'padding:5px 5px 0',
                width: '97%',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_DESCRICAO]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_LOTE]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_MATERIAL]
                    }]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_MEDIDA]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_PESO]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_EMBALAGEM_QTDE]
                    }]
                }]
            }, {
                columnWidth: .50,
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Qtde',
                autoHeight: true,
                bodyStyle: 'padding:5px 5px 0',
                width: '97%',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_NORMAL_A_MAIOR]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_NORMAL_A_MENOR]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_NORMAL_SOLICITADA]
                    }]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_ESPECIAL_A_MAIOR]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_ESPECIAL_A_MENOR]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QTDE_ESPECIAL_SOLICITADA]
                    }]
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .33,
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Entrega',
                autoHeight: true,
                bodyStyle: 'padding:5px 5px 0',
                width: '97%',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS]
                    }, {
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS]
                    }]
                }]
            }, {
                columnWidth: .33,
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Acabamento',
                autoHeight: true,
                bodyStyle: 'padding: 5px 5px 0',
                width: '97%',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO]
                    }, {
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL]
                    }]
                }, {
                    layout: 'form',
                    items: [TXT_AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO]
                }]
            }, {
                columnWidth: .34,
                xtype: 'fieldset',
                checkboxToggle: false,
                title: 'Dimensional',
                autoHeight: true,
                bodyStyle: 'padding:5px 5px 0',
                width: '97%',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO]
                    }, {
                        columnWidth: .50,
                        layout: 'form',
                        items: [TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL]
                    }]
                }, {
                    layout: 'form',
                    items: [TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO]
                }]
            }]
        }]
    });

    function PopulaFormulario(record) {

        panelCadastro.setTitle('Alterar dados da avalia&ccedil;&atilde;o');

        buttonGroup1.items.items[32].enable();
        form1.getForm().items.items[0].disable();

        hID_AVALIACAO.setValue(record.data.ID_AVALIACAO);
        TXT_AVALIACAO_EMBALAGEM_DESCRICAO.setValue(record.data.AVALIACAO_EMBALAGEM_DESCRICAO);

        TXT_AVALIACAO_EMBALAGEM_LOTE.getValue(record.data.AVALIACAO_EMBALAGEM_LOTE);
        TXT_AVALIACAO_EMBALAGEM_MATERIAL.setValue(record.data.AVALIACAO_EMBALAGEM_MATERIAL);
        TXT_AVALIACAO_EMBALAGEM_MEDIDA.setValue(record.data.AVALIACAO_EMBALAGEM_MEDIDA);
        TXT_AVALIACAO_EMBALAGEM_PESO.setValue(record.data.AVALIACAO_EMBALAGEM_PESO);
        TXT_AVALIACAO_EMBALAGEM_QTDE.setValue(record.data.AVALIACAO_EMBALAGEM_QTDE);
        TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS.setValue(record.data.AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS);
        TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS.setValue(record.data.AVALIACAO_ENTREGA_ATRASADA_X_DIAS);
        TXT_AVALIACAO_QTDE_ESPECIAL_A_MAIOR.setValue(record.data.AVALIACAO_QTDE_ESPECIAL_A_MAIOR);
        TXT_AVALIACAO_QTDE_ESPECIAL_A_MENOR.setValue(record.data.AVALIACAO_QTDE_ESPECIAL_A_MENOR);
        TXT_AVALIACAO_QTDE_ESPECIAL_SOLICITADA.setValue(record.data.AVALIACAO_QTDE_ESPECIAL_SOLICITADA);
        TXT_AVALIACAO_QTDE_NORMAL_A_MAIOR.setValue(record.data.AVALIACAO_QTDE_NORMAL_A_MAIOR);
        TXT_AVALIACAO_QTDE_NORMAL_A_MENOR.setValue(record.data.AVALIACAO_QTDE_NORMAL_A_MENOR);
        TXT_AVALIACAO_QTDE_NORMAL_SOLICITADA.setValue(record.data.AVALIACAO_QTDE_NORMAL_SOLICITADA);
        TXT_AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO.setValue(record.data.AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO);
        TXT_AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL.setValue(record.data.AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL);
        TXT_AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO.setValue(record.data.AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO);
        TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO.setValue(record.data.AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO);
        TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL.setValue(record.data.AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL);
        TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO.setValue(record.data.AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO);
        TXT_OBSERVACAO_DA_AVALIACAO.setValue(record.data.OBSERVACAO_DA_AVALIACAO);
        CB_ID_RNC.setValue(record.data.ID_ITEM_RNC);

        TXT_AVALIACAO_EMBALAGEM_DESCRICAO.focus();
    }

    var Avaliacao_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ID_AVALIACAO', 'AVALIACAO_EMBALAGEM_DESCRICAO', 'AVALIACAO_EMBALAGEM_DESCRICAO', 'AVALIACAO_EMBALAGEM_LOTE',
        'AVALIACAO_EMBALAGEM_MATERIAL', 'AVALIACAO_EMBALAGEM_MEDIDA', 'AVALIACAO_EMBALAGEM_PESO', 'AVALIACAO_EMBALAGEM_QTDE',
        'AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS', 'AVALIACAO_ENTREGA_ATRASADA_X_DIAS', 'AVALIACAO_QTDE_ESPECIAL_A_MAIOR',
        'AVALIACAO_QTDE_ESPECIAL_A_MENOR', 'AVALIACAO_QTDE_ESPECIAL_SOLICITADA', 'AVALIACAO_QTDE_NORMAL_A_MAIOR',
        'AVALIACAO_QTDE_NORMAL_A_MENOR', 'AVALIACAO_QTDE_NORMAL_SOLICITADA', 'AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO',
        'AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL', 'AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO',
        'AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO', 'AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL',
        'AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO', 'CODIGO_FORNECEDOR', 'OBSERVACAO_DA_AVALIACAO', 'NOME_FANTASIA_FORNECEDOR',
        'DATA_AVALIACAO', 'ID_USUARIO_AVALIADOR', 'ID_ITEM_RNC', 'DESCRICAO_RNC', 'LOGIN_USUARIO', 'CODIGO_PRODUTO_COMPRA'])
    });

    var grid1 = new Ext.grid.GridPanel({
        store: Avaliacao_Store,
        columns: [
        { id: 'DATA_AVALIACAO', header: "Data da avalia&ccedil;&atilde;o", width: 150, sortable: true, dataIndex: 'DATA_AVALIACAO',
            renderer: XMLParseDateTime, align: 'center'
        },
        { id: 'LOGIN_USUARIO', header: "Avaliador", width: 130, sortable: true, dataIndex: 'LOGIN_USUARIO' },
        { id: 'CODIGO_PRODUTO_COMPRA', header: "C&oacute;digo do produto", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_COMPRA' },
        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
        { id: 'DESCRICAO_RNC', header: "Tipo da avalia&ccedil;&atilde;o", width: 200, sortable: true, dataIndex: 'DESCRICAO_RNC' }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(494),
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    grid1.on('rowdblclick', function (grid, rowIndex, e) {
        var record = grid.getStore().getAt(rowIndex);
        PopulaFormulario(record);
    });

    grid1.on('keydown', function (e) {
        if (e.getKey() == e.ENTER) {
            if (grid1.getSelectionModel().getSelections().length > 0) {
                var record = grid1.getSelectionModel().getSelected();
                PopulaFormulario(record);
            }
        }
    });

    function Retorna_JsonData() {
        var CLAS_FISCAL_JsonData = {
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM_COMPRA,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return CLAS_FISCAL_JsonData;
    }

    var PagingToolbar1 = new Th2_PagingToolbar();
    PagingToolbar1.setUrl('servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/Carrega_Avaliacoes');
    PagingToolbar1.setParamsJsonData(Retorna_JsonData());
    PagingToolbar1.setStore(Avaliacao_Store);

    function CARREGA_GRID() {
        PagingToolbar1.setParamsJsonData(Retorna_JsonData());
        PagingToolbar1.doRequest();
    }

    ///////////////////////////
    var buttonGroup1 = new Ext.ButtonGroup({
        items: [{
            text: 'Salvar',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function () {
                GravaDados();
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
        {
            text: 'Nova avalia&ccedil;&atilde;o',
            icon: 'imagens/icones/database_fav_24.gif',
            scale: 'medium',
            handler: function () {
                buttonGroup1.items.items[32].disable();

                form1.getForm().items.items[0].enable();

                TXT_AVALIACAO_EMBALAGEM_DESCRICAO.focus();

                form1.getForm().reset();
                panelCadastro.setTitle('Nova avalia&ccedil;&atilde;o');
            }
        }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
            {
                id: 'BTN_DELETAR_AVALIACAO',
                text: 'Deletar',
                icon: 'imagens/icones/database_delete_24.gif',
                scale: 'medium',
                disabled: true,
                handler: function () {
                    Deleta_AVALIACAO();
                }
            }]
    });

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [buttonGroup1]
    });

    var panelCadastro = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Nova avalia&ccedil;&atilde;o',
        items: [form1, toolbar1, grid1, PagingToolbar1.PagingToolbar()]
    });

    function GravaDados() {
        if (!form1.getForm().isValid()) {
            return;
        }

        var dados = {
            ID_AVALIACAO: hID_AVALIACAO.getValue(),
            AVALIACAO_EMBALAGEM_DESCRICAO: TXT_AVALIACAO_EMBALAGEM_DESCRICAO.getValue(),
            AVALIACAO_EMBALAGEM_LOTE: TXT_AVALIACAO_EMBALAGEM_LOTE.getValue(),
            AVALIACAO_EMBALAGEM_MATERIAL: TXT_AVALIACAO_EMBALAGEM_MATERIAL.getValue(),
            AVALIACAO_EMBALAGEM_MEDIDA: TXT_AVALIACAO_EMBALAGEM_MEDIDA.getValue(),
            AVALIACAO_EMBALAGEM_PESO: TXT_AVALIACAO_EMBALAGEM_PESO.getValue(),
            AVALIACAO_EMBALAGEM_QTDE: TXT_AVALIACAO_EMBALAGEM_QTDE.getValue(),
            AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS: TXT_AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS.getValue(),
            AVALIACAO_ENTREGA_ATRASADA_X_DIAS: TXT_AVALIACAO_ENTREGA_ATRASADA_X_DIAS.getValue(),
            AVALIACAO_QTDE_ESPECIAL_A_MAIOR: TXT_AVALIACAO_QTDE_ESPECIAL_A_MAIOR.getValue(),
            AVALIACAO_QTDE_ESPECIAL_A_MENOR: TXT_AVALIACAO_QTDE_ESPECIAL_A_MENOR.getValue(),
            AVALIACAO_QTDE_ESPECIAL_SOLICITADA: TXT_AVALIACAO_QTDE_ESPECIAL_SOLICITADA.getValue(),
            AVALIACAO_QTDE_NORMAL_A_MAIOR: TXT_AVALIACAO_QTDE_NORMAL_A_MAIOR.getValue(),
            AVALIACAO_QTDE_NORMAL_A_MENOR: TXT_AVALIACAO_QTDE_NORMAL_A_MENOR.getValue(),
            AVALIACAO_QTDE_NORMAL_SOLICITADA: TXT_AVALIACAO_QTDE_NORMAL_SOLICITADA.getValue(),
            AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO: TXT_AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO.getValue(),
            AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL: TXT_AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL.getValue(),
            AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO: TXT_AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO.getValue(),
            AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO: TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO.getValue(),
            AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL: TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL.getValue(),
            AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO: TXT_AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO.getValue(),
            NUMERO_PEDIDO_COMPRA: _NUMERO_PEDIDO_COMPRA,
            NUMERO_ITEM_COMPRA: _NUMERO_ITEM_COMPRA,
            CODIGO_FORNECEDOR: _CODIGO_FORNECEDOR,
            OBSERVACAO_DA_AVALIACAO: TXT_OBSERVACAO_DA_AVALIACAO.getValue(),
            ID_ITEM_RNC: CB_ID_RNC.getValue(),
            ID_USUARIO: _ID_USUARIO
        };

        var Url = panelCadastro.title == "Nova avalia&ccedil;&atilde;o" ?
                        'servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/GravaNovaAvaliacao' :
                        'servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/AtualizaAvaliacao';

        var _ajax = new Th2_Ajax();
        _ajax.setUrl(Url);
        _ajax.setJsonData({ dados: dados });

        var _sucess = function (response, options) {
            if (panelCadastro.title == "Nova avalia&ccedil;&atilde;o") {
                form1.getForm().reset();
            }

            TXT_AVALIACAO_EMBALAGEM_DESCRICAO.focus();

            CARREGA_GRID();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Deleta_AVALIACAO() {
        dialog.MensagemDeConfirmacao('Deseja deletar este avalia&ccedil;&atilde;o?', form1.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/DeletaAvaliacao');
                _ajax.setJsonData({
                    ID_AVALIACAO: hID_AVALIACAO.getValue(),
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    panelCadastro.setTitle("Nova avalia&ccedil;&atilde;o");
                    TXT_AVALIACAO_EMBALAGEM_DESCRICAO.focus();

                    form1.getForm().reset();

                    buttonGroup1.items.items[32].disable();
                    form1.getForm().items.items[0].enable();

                    CARREGA_GRID();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    this.carregaGrid = function () {
        CARREGA_GRID();
    };

    this.panel = function () {
        return panelCadastro;
    };
}
