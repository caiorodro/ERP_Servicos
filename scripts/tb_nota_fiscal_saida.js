var _vencimentos = new janela_vencimentos_nota_saida();
var _nota_alterada_cancelada = false;

function MontaTelaNotasFiscaisSaida() {

    var janelaCancelaNF = new Cancela_Nota_Saida();

    var lista_nfs = new Relacao_Notas_Saida();

    var TB_NOTA_SAIDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'

        }, ['MARCA_REMSSA_RPS', 'NUMERO_SEQ', 'NUMERO_NF', 'SERIE_NF', 'CODIGO_CLIENTE_NF', 'NOME_CLIENTE_NF', 'NOME_FANTASIA_CLIENTE_NF',
        'CNPJ_CLIENTE_NF', 'DATA_EMISSAO_NF', 'TOTAL_NF',
        'TOTAL_SERVICOS_NF', 'VALOR_ISS_NF', 'NUMERO_PEDIDO_NF', 'STATUS_NF',
        'EMITIDA_NF', 'CANCELADA_NF', 'TELEFONE_CLIENTE_NF', 'ENDERECO_FATURA_NF', 'NUMERO_END_FATURA_NF',
        'COMP_END_FATURA_NF', 'CEP_FATURA_NF', 'BAIRRO_FATURA_NF', 'MUNICIPIO_NF', 'UF_NF', 'DESCRICAO_CP', 'OBS_CLIENTE',
        'DADOS_ADICIONAIS_NF', 'OBS_NF', 'OBS_INTERNA_NF']
       )
    });

    function status_nf(val) {
        if (val == 1)
            return "<span style='width: 100%; height: 100%; background-color: #000066; color: #FFFFFF;'>NF Cadastrada</span>";
        else if (val == 2)
            return "<span style='width: 100%; height: 100%; background-color: #339966; color: #FFFFFF;'>NF Emitida</span>";
        else if (val == 3)
            return "<span style='width: 100%; height: 100%; background-color: #990000; color: #FFFFFF;'>NF Cancelada</span>";
    }

    function Emitida_nf(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    function Cancelada_nf(val) {
        return val == 0 ? 'N&atilde;o' : 'Sim';
    }

    var checkBoxSM_NFS = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                Ext.getCmp('gridItemNotaSaida').getStore().removeAll();
                NotaItemSaidaPagingToolbar.Desabilita();
                AtualizaBotoes(record);
            }
        }
    });

    var TXT_OBS_INTERNA = new Ext.form.TextField({ maxLength: 30 });

    var CB_STATUS_NF2 = new Ext.form.ComboBox({
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [[3, 'NF Cancelada']]
        })
    });

    function remessa_rps(val) {
        if (val == 1) {
            return "<span style='background-color: #FFFF00; color: #000066; font-family: tahoma;'>Remessa RPS</span>";
        }

        if (val == 2) {
            return "<span style='background-color: #000066; color: #FFFF00; font-family: tahoma;'>RPS Gerado</span>";
        }

        return "";
    }

    function Marca_notas_RPS(btn) {
        if (gridNotaSaida.getSelectionModel().getCount() == 0) {
            dialog.MensagemDeAlerta('Selecione uma ou mais notas para marcar a gera&ccedil;&atilde;o do arquivo RPS', btn.getId());
            return;
        }

        var arr1 = new Array();

        for (var i = 0; i < gridNotaSaida.getSelectionModel().selections.getCount(); i++) {
            var record = gridNotaSaida.getSelectionModel().selections.items[i];
            arr1[i] = record.data.NUMERO_SEQ;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Marca_desmarca_Remessa_RPS');

        _ajax.setJsonData({
            NUMEROS_SEQ: arr1,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            for (var i = 0; i < gridNotaSaida.getSelectionModel().selections.getCount(); i++) {
                var record = gridNotaSaida.getSelectionModel().selections.items[i];

                record.beginEdit();
                record.set('MARCA_REMSSA_RPS', record.data.MARCA_REMSSA_RPS == 1 ? 0 : 1);
                record.endEdit();
                record.commit();
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();        
    }

    function GeraRemessaRPS() {
        dialog.MensagemDeConfirmacao('Confirma a cria&ccedil;&atilde;o do arquivo de RPS?', 'gridNotaSaida', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Gera_RPS_Lote');

                _ajax.setJsonData({
                    ID_EMPRESA: _ID_EMPRESA,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    window.open(result, '_blank', 'width=1000,height=800');

                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var gridNotaSaida = new Ext.grid.EditorGridPanel({
        id: 'gridNotaSaida',
        tbar: [{
            id: 'BTN_MARCAR_RPS',
            icon: 'imagens/icones/ok_16.gif',
            text: 'Marcar / desmarcar nota(s) para RPS',
            scale: 'medium',
            handler: function (btn) {
                Marca_notas_RPS(btn);
            }
        }, '-', {
            id: 'BTN_GERAR_RPS',
            icon: 'imagens/icones/nfe.jpg',
            text: 'Gerar arquivo RPS',
            scale: 'medium',
            handler: function () {
                GeraRemessaRPS();
            }
        }, '-', {
            id: 'BTN_DUPLICATAS',
            text: 'Imprimir Duplicatas',
            icon: 'imagens/icones/windows_info_16.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() == 0) {
                    dialog.MensagemDeAlerta('Selecione uma ou mais notas para imprimir a(s) duplicata(s)', 'BTN_DUPLICATAS');
                    return;
                }

                var arr1 = new Array();

                for (var i = 0; i < Ext.getCmp('gridNotaSaida').getSelectionModel().selections.getCount(); i++) {
                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().selections.items[i];
                    arr1[i] = record.data.NUMERO_SEQ;
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Duplicatas_NF');

                _ajax.setJsonData({
                    NUMERO_SEQ: arr1,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;
                    window.open(result, '_blank', 'width=1000,height=800');
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }, '-', {
            id: 'BTN_REL_EMISSAO_NOTAS_FISCAIS',
            text: 'Rel. de Notas Fiscais no Per&iacute;odo',
            icon: 'imagens/icones/document_ok_16.gif',
            scale: 'medium',
            handler: function () {
                lista_nfs.show('BTN_REL_EMISSAO_NOTAS_FISCAIS');
            }
        }],

        store: TB_NOTA_SAIDA_Store,
        columns: [
        checkBoxSM_NFS,
        { id: 'MARCA_REMSSA_RPS', header: "RPS", width: 100, sortable: true, dataIndex: 'MARCA_REMSSA_RPS', renderer: remessa_rps, align: 'center' },

        { id: 'STATUS_NF', header: "Status", width: 110, sortable: true, dataIndex: 'STATUS_NF', renderer: status_nf,
            editor: CB_STATUS_NF2
        },
        { id: 'OBS_INTERNA_NF', header: "Obs. Interna", width: 150, sortable: true, dataIndex: 'OBS_INTERNA_NF', editor: TXT_OBS_INTERNA, hidden: true },
        { id: 'NUMERO_SEQ', header: "Sequencia", width: 90, sortable: true, dataIndex: 'NUMERO_SEQ' },
        { id: 'NUMERO_NF', header: "Numero NF", width: 90, sortable: true, dataIndex: 'NUMERO_NF' },
        { id: 'SERIE_NF', header: "S&eacute;rie", width: 80, sortable: true, dataIndex: 'SERIE_NF', hidden: true },
        { id: 'DATA_EMISSAO_NF', header: "Data de Emiss&atilde;o", width: 140, sortable: true, dataIndex: 'DATA_EMISSAO_NF', renderer: XMLParseDateTime },
        { id: 'CODIGO_CLIENTE_NF', header: "C&oacute;digo do Cliente", width: 120, sortable: true, dataIndex: 'CODIGO_CLIENTE_NF', hidden: true },
        { id: 'NOME_FANTASIA_CLIENTE_NF', header: "Nome Fantasia", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_CLIENTE_NF' },
        { id: 'NOME_CLIENTE_NF', header: "Raz&atilde;o Social do Cliente", width: 280, sortable: true, dataIndex: 'NOME_CLIENTE_NF', hidden: true },
        { id: 'ENDERECO_FATURA_NF', header: "Endere&ccedil;o", width: 270, sortable: true, dataIndex: 'ENDERECO_FATURA_NF' },
        { id: 'NUMERO_END_FATURA_NF', header: "Nr.", width: 70, sortable: true, dataIndex: 'NUMERO_END_FATURA_NF' },
        { id: 'COMP_END_FATURA_NF', header: "Complemento", width: 100, sortable: true, dataIndex: 'COMP_END_FATURA_NF' },
        { id: 'CEP_FATURA_NF', header: "CEP", width: 90, sortable: true, dataIndex: 'CEP_FATURA_NF' },
        { id: 'MUNICIPIO_NF', header: "Munic&iacute;pio", width: 160, sortable: true, dataIndex: 'MUNICIPIO_NF' },
        { id: 'UF_NF', header: "UF", width: 110, sortable: true, dataIndex: 'UF_NF' },
        { id: 'TELEFONE_CLIENTE_NF', header: "Tel. Cliente", width: 120, sortable: true, dataIndex: 'TELEFONE_CLIENTE_NF' },

        { id: 'DADOS_ADICIONAIS_NF', header: "Dados Adicionais NF", width: 350, sortable: true, dataIndex: 'DADOS_ADICIONAIS_NF' },
        { id: 'OBS_NF', header: "Obs. NF", width: 350, sortable: true, dataIndex: 'OBS_NF' },
        { id: 'OBS_CLIENTE', header: "Obs. Cliente", width: 350, sortable: true, dataIndex: 'OBS_CLIENTE' },

        { id: 'DESCRICAO_CP', header: "Cond. Pagto.", width: 140, sortable: true, dataIndex: 'DESCRICAO_CP' },

        { id: 'TOTAL_SERVICOS_NF', header: "Total dos servi&ccedil;os", width: 130, sortable: true, dataIndex: 'TOTAL_SERVICOS_NF', renderer: FormataValor },

        { id: 'TOTAL_NF', header: "Total da Nota Fiscal", width: 130, sortable: true, dataIndex: 'TOTAL_NF', renderer: FormataValor },
        { id: 'TOTAL_ISS_NF', header: "Total de ISS", width: 130, sortable: true, dataIndex: 'TOTAL_ISS_NF', hidden: true, renderer: FormataValor },
        { id: 'BASE_ISS_NF', header: "Base de ISS", width: 130, sortable: true, dataIndex: 'BASE_ISS_NF', hidden: true, renderer: FormataValor },

        { id: 'NUMERO_PEDIDO_NF', header: "Numero Pedido", width: 90, sortable: true, dataIndex: 'NUMERO_PEDIDO_NF', hidden: true },
        { id: 'EMITIDA_NF', header: "Nota Emitida", width: 90, sortable: true, dataIndex: 'EMITIDA_NF', hidden: true, renderer: Emitida_nf },
        { id: 'CANCELADA_NF', header: "Nota Cancelada", width: 90, sortable: true, dataIndex: 'CANCELADA_NF', hidden: true, renderer: Cancelada_nf }
    ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(458),
        width: '100%',

        sm: checkBoxSM_NFS,

        clicksToEdit: 1,

        listeners: {
            rowdblclick: function (grid, rowIndex, e) {
                var record = grid.getStore().getAt(rowIndex);
                CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record);
            },
            rowclick: function (grid, rowIndex, e) {
                Ext.getCmp('gridItemNotaSaida').getStore().removeAll();
                NotaItemSaidaPagingToolbar.Desabilita();

                var record = grid.getStore().getAt(rowIndex);

                AtualizaBotoes(record);
            },
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    var record = this.getSelectionModel().getSelected();
                    CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record);
                }
            },
            beforeEdit: function (e) {
                if (_SUPERVISOR_FATURAMENTO != 1) {
                    e.cancel = true;
                }
            },
            afteredit: function (e) {
                if (e.value == e.originalValue) {
                    e.record.reject();
                }

                if (e.field == 'STATUS_NF') {
                    if (e.value == 3) {
                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Cancela_Nota_Internamente');
                        _ajax.ExibeDivProcessamento(false);

                        _ajax.setJsonData({
                            NUMERO_SEQ: e.record.data.NUMERO_SEQ,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function (response, options) {
                            CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }

                if (e.field == 'OBS_INTERNA_NF') {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Altera_Obs_Interna_NF');
                    _ajax.ExibeDivProcessamento(false);

                    _ajax.setJsonData({
                        NUMERO_SEQ: e.record.data.NUMERO_SEQ,
                        OBS_INTERNA_NF: e.value,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        e.record.commit();
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
    });

    function Relacao_Notas_Saida() {

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

        var cb_FD_CODIGO_EMITENTE = new Ext.form.ComboBox({
            fieldLabel: 'Empresa / Filial',
            valueField: 'CODIGO_EMITENTE',
            displayField: 'NOME_FANTASIA_EMITENTE',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Selecione',
            selectOnFocus: true,
            width: 230,
            allowBlank: false,
            store: combo_TB_EMITENTE_STORE
        });


        var CB_A_VISTA = new Ext.form.Checkbox({
            boxLabel: 'Listar somente a vista'
        });

        // Lista_Supervisores_Venda
        var BTN_OK_NOTA = new Ext.Button({
            text: 'Ok',
            icon: 'imagens/icones/ok_24.gif',
            scale: 'large',
            handler: function () {
                Lista_Relatorio();
            }
        });

        var formNOTA_SAIDA = new Ext.FormPanel({
            bodyStyle: 'padding:2px 2px 0',
            frame: true,
            labelAlign: 'top',
            width: '100%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.25,
                    layout: 'form',
                    items: [TXT_DATAF1]
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    items: [TXT_DATAF2]
                }, {
                    columnWidth: 0.50,
                    layout: 'form',
                    items: [cb_FD_CODIGO_EMITENTE]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .35,
                    layout: 'form',
                    items: [CB_A_VISTA]

                }, {
                    columnWidth: .20,
                    items: [BTN_OK_NOTA]
                }]
            }]
        });

        function Lista_Relatorio() {
            if (!formNOTA_SAIDA.getForm().isValid())
                return;

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Relacao_Emissao_Notas');
            _ajax.setJsonData({
                dt1: TXT_DATAF1.getRawValue(),
                dt2: TXT_DATAF2.getRawValue(),
                filial: cb_FD_CODIGO_EMITENTE.getValue(),
                A_VISTA: CB_A_VISTA.checked ? 1 : 0,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function (response, options) {
                var result = Ext.decode(response.responseText).d;
                window.open(result, '_blank', 'width=1000,height=800');
                wListaNotas.hide();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        var wListaNotas = new Ext.Window({
            layout: 'form',
            title: 'Listagem de Notas Fiscais',
            iconCls: 'icone_TB_NOTA_SAIDA',
            width: 500,
            height: 138,
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
            items: [formNOTA_SAIDA]
        });

        this.show = function (elm) {
            wListaNotas.show(elm);
        };
    }

    function AtualizaBotoes(record) {
        if (record.data.STATUS_NF == 2) { // Nota Emitida
            Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').disable();
            Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
        }
        else if (record.data.STATUS_NF == 3) { // Nota Cancelada
            Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').disable();
            Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
        }
        else if (record.data.STATUS_NF == 1) { // Nota Cadastrada
            Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').disable();
            Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
        }
        else if (record.data.STATUS_NF == 5) { // XML Gerado
            Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').disable();
            Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
        }
    }

    var TXT_FILTRO_EMISSAO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Emissão da NF',
        allowBlank: false,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                }
            }
        }
    });

    var _dt1 = new Date();
    _dt1.setDate(_dt1.getDate());
    TXT_FILTRO_EMISSAO.setValue(_dt1.dateFormat('d/m/Y'));

    var TXT_FILTRO_NUMERO_NF = new Ext.form.NumberField({
        fieldLabel: 'Numero da NF',
        width: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                }
            }
        }
    });

    var TXT_FILTRO_NUMERO_PEDIDO = new Ext.form.TextField({
        fieldLabel: 'Numero do Pedido',
        width: 100,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                }
            }
        }
    });

    var TXT_FILTRO_CLIENTE = new Ext.form.TextField({
        fieldLabel: 'Nome do Cliente',
        width: 300,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off' },
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                }
            }
        }
    });

    function RetornaNotaSaidaJsonData() {
        var _status = Ext.getCmp('STATUS_NF') ? Ext.getCmp('STATUS_NF').getValue() : '0';

        var _JsonData = {
            DATA_EMISSAO_NF: TXT_FILTRO_EMISSAO.getRawValue(),
            NOME_CLIENTE_NF: TXT_FILTRO_CLIENTE.getValue(),
            NUMERO_NF: TXT_FILTRO_NUMERO_NF.getValue(),
            NUMERO_PEDIDO_NF: TXT_FILTRO_NUMERO_PEDIDO.getValue(),
            STATUS_NF: _status,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaSaidaPagingToolbar = new Th2_PagingToolbar();
    NotaSaidaPagingToolbar.setUrl('servicos/TB_NOTA_SAIDA.asmx/Carrega_NotaSaida');
    NotaSaidaPagingToolbar.setStore(TB_NOTA_SAIDA_Store);

    function CARREGA_GRID_NOTAS_FISCAIS_SAIDA() {
        Ext.getCmp('gridItemNotaSaida').getStore().removeAll();

        NotaSaidaPagingToolbar.setParamsJsonData(RetornaNotaSaidaJsonData());

        var _instrucoes = function () {
            Ext.getCmp('gridItemNotaSaida').getStore().removeAll();
            NotaItemSaidaPagingToolbar.Desabilita();
        };

        NotaSaidaPagingToolbar.onPageChange(_instrucoes);

        NotaSaidaPagingToolbar.doRequest();
    }

    var pNotasFiscais = new Ext.Panel({
        width: '100%',
        items: [gridNotaSaida, NotaSaidaPagingToolbar.PagingToolbar()]
    });

    /////////////////////////// itens de nota fiscal
    var TB_ITEM_NOTA_SAIDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ITEM_NF', 'SEQUENCIA_ITEM_NF', 'CODIGO_PRODUTO_ITEM_NF', 'DESCRICAO_PRODUTO_ITEM_NF',
        'UNIDADE_MEDIDA_ITEM_NF', 'QTDE_ITEM_NF', 'VALOR_UNITARIO_ITEM_NF', 'VALOR_DESCONTO_ITEM_NF',
        'VALOR_TOTAL_ITEM_NF', 'ALIQ_ISS_ITEM_NF', 'BASE_ISS_ITEM_NF', 'VALOR_ISS_ITEM_NF',
        'NUMERO_PEDIDO_ITEM_NF', 'NUMERO_PEDIDO_VENDA']
       )
    });

    var gridItemNotaSaida = new Ext.grid.GridPanel({
        id: 'gridItemNotaSaida',
        title: 'Itens da nota',
        collapsible: true,
        collapsed: true,
        animCollapse: false,
        store: TB_ITEM_NOTA_SAIDA_Store,
        columns: [
        { id: 'NUMERO_ITEM_NF', header: "NF", width: 90, sortable: true, dataIndex: 'NUMERO_ITEM_NF', hidden: true },
        { id: 'SEQUENCIA_ITEM_NF', header: "Item", width: 90, sortable: true, dataIndex: 'SEQUENCIA_ITEM_NF', hidden: true },
        { id: 'CODIGO_PRODUTO_ITEM_NF', header: "C&oacute;digo de Servi&ccedil;o", width: 180, sortable: true, dataIndex: 'CODIGO_PRODUTO_ITEM_NF' },
        { id: 'DESCRICAO_PRODUTO_ITEM_NF', header: "Descri&ccedil;&atilde;o do Produto", width: 330, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_NF', hidden: true },
        { id: 'UNIDADE_MEDIDA_ITEM_NF', header: "Un.", width: 40, sortable: true, dataIndex: 'UNIDADE_MEDIDA_ITEM_NF' },
        { id: 'QTDE_ITEM_NF', header: "Qtde", width: 90, sortable: true, dataIndex: 'QTDE_ITEM_NF', renderer: FormataQtde },
        { id: 'VALOR_UNITARIO_ITEM_NF', header: "Valor Unit&aacute;rio", width: 120, sortable: true, dataIndex: 'VALOR_UNITARIO_ITEM_NF', renderer: FormataValor_4 },
        { id: 'VALOR_DESCONTO_ITEM_NF', header: "Valor Desconto", width: 120, sortable: true, dataIndex: 'VALOR_DESCONTO_ITEM_NF', renderer: FormataValor, hidden: true },
        { id: 'VALOR_TOTAL_ITEM_NF', header: "Total do Item", width: 130, sortable: true, dataIndex: 'VALOR_TOTAL_ITEM_NF', renderer: FormataValor },
        { id: 'ALIQ_ISS_ITEM_NF', header: "Aliq. ISS", width: 60, sortable: true, dataIndex: 'ALIQ_ISS_ITEM_NF', renderer: FormataPercentual },
        { id: 'BASE_ISS_ITEM_NF', header: "Base ISS", width: 120, sortable: true, dataIndex: 'BASE_ISS_ITEM_NF', renderer: FormataValor },
        { id: 'VALOR_ISS_ITEM_NF', header: "Valor ISS", width: 120, sortable: true, dataIndex: 'VALOR_ISS_ITEM_NF', renderer: FormataValor },
        { id: 'NUMERO_PEDIDO_VENDA', header: "Nr. O.S. Interna", width: 120, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA' }

    ],
        stripeRows: true,
        height: 165,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            expand: function () {
                gridNotaSaida.setHeight(AlturaDoPainelDeConteudo(458));
            },
            collapse: function () {
                gridNotaSaida.setHeight(AlturaDoPainelDeConteudo(319));
            }
        }
    });

    function RetornaItemNotaSaidaJsonData(record) {
        var _numero = record ? record.data.NUMERO_SEQ : 0;

        var _JsonData = {
            NUMERO_ITEM_NF: _numero,
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return _JsonData;
    }

    var NotaItemSaidaPagingToolbar = new Th2_PagingToolbar();
    NotaItemSaidaPagingToolbar.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/Carrega_ItensNotaSaida');
    NotaItemSaidaPagingToolbar.setStore(TB_ITEM_NOTA_SAIDA_Store);

    function CARREGA_GRID_ITENS_NOTAS_FISCAIS_SAIDA(record) {
        NotaItemSaidaPagingToolbar.setParamsJsonData(RetornaItemNotaSaidaJsonData(record));
        NotaItemSaidaPagingToolbar.doRequest();
    }

    var pItensNotasFiscais = new Ext.Panel({
        id: 'pItensNotasFiscais',
        width: '100%',
        items: [gridItemNotaSaida, NotaItemSaidaPagingToolbar.PagingToolbar()]
    });

    //////////////////////

    var TB_NOTA_SAIDA_BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
        }
    });

    var CB_STATUS_NF = new Ext.form.ComboBox({
        fieldLabel: 'Status',
        id: 'STATUS_NF',
        name: 'STATUS_NF',
        valueField: 'Opc',
        displayField: 'Opcao',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione',
        selectOnFocus: true,
        width: 115,
        allowBlank: false,
        msgTarget: 'side',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['Opc', 'Opcao'],
            data: [['0', 'Todas'], ['1', 'NF Cadastrada'], ['2', 'NF Emitida'], ['3', 'NF Cancelada']]
        }),

        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    CARREGA_GRID_NOTAS_FISCAIS_SAIDA();
                }
            }
        }
    });

    CB_STATUS_NF.setValue('0');

    var formFiltrosNotaFiscalSaida = new Ext.form.FormPanel({
        id: 'formFiltrosNotaFiscalSaida',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: 103,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_FILTRO_EMISSAO]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_FILTRO_NUMERO_NF]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_FILTRO_NUMERO_PEDIDO]
            }, {
                columnWidth: 0.27,
                layout: 'form',
                items: [TXT_FILTRO_CLIENTE]
            }, {
                columnWidth: 0.13,
                layout: 'form',
                items: [CB_STATUS_NF]
            }, {
                columnWidth: 0.07,
                layout: 'form',
                items: [TB_NOTA_SAIDA_BTN_PESQUISA]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: 0.04,
                items: [{
                    xtype: 'box',
                    id: 'gif_rodando_emitindo_nfs',
                    autoEl: {
                        tag: 'img',
                        src: 'scripts/resources/images/default/shared/large-loading.gif'
                    }
                }]
            }, {
                columnWidth: 0.50,
                items: [{
                    xtype: 'label',
                    id: 'lbl_emitindo_nfs',
                    text: 'Emitindo Notas Fiscais... Aguarde.',
                    cls: 'LBL_EMITINDO_NFS'
                }]
            }]
        }]
    });

    Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(false);
    Ext.getCmp('lbl_emitindo_nfs').setVisible(false);

    var pFiltros = new Ext.Panel({
        width: '100%',
        height: 105,
        items: [formFiltrosNotaFiscalSaida]
    });

    ////////////////////

    function Status_Processo_email(text, visivel) {
        Ext.getCmp('lbl_emitindo_nfs').setText(text, false);
        Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(visivel);
        Ext.getCmp('lbl_emitindo_nfs').setVisible(visivel);

        if (visivel) {
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Cancelar');
            Ext.getCmp('BTN_NOVA_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
            Ext.getCmp('BTN_IMPRIMIR_DANFE').disable();
            Ext.getCmp('BTN_VENCIMENTO_NOTA_SAIDA').disable();
        }
        else {
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Enviar e-mail');
            Ext.getCmp('BTN_NOVA_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').enable();
            Ext.getCmp('BTN_IMPRIMIR_DANFE').enable();
            Ext.getCmp('BTN_VENCIMENTO_NOTA_SAIDA').enable();
        }
    }

    var cancelar_email_nfe = true;

    function Busca_Resultado_email_JeW(record) {
        if (!cancelar_email_nfe) {
            Status_Processo_email("Aguardando resposta do servidor", true);

            var _ajax1 = new Th2_Ajax();
            _ajax1.setUrl('servicos/TB_NOTA_SAIDA.asmx/Busca_Resultado_email_JeW');
            _ajax1.setJsonData({
                NUMERO_SEQ: record.data.NUMERO_SEQ,
                CNPJ_EMITENTE: _CNPJ_EMITENTE,
                SERIE: _SERIE,
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            _ajax1.ExibeDivProcessamento(false);

            var _sucess1 = function (response, options) {
                var result = Ext.decode(response.responseText).d;

                if (result.ARQUIVO == "1") {
                    Status_Processo_email("", false);
                    Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Enviar e-mail');
                    dialog.MensagemDeInformacao(result.MENSAGEM, 'BTN_ENVIAR_EMAIL_NFe');
                }
                else {
                    Busca_Resultado_email_JeW(record);
                }
            }

            var _failure = function (response, options) {
                Status_Processo_email("", false);
                Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Enviar e-mail');
            };

            _ajax1.setFalha(_failure);
            _ajax1.setSucesso(_sucess1);
            _ajax1.Request();
        }
        else {
            Status_Processo_email("", false);
        }
    }

    function Envia_Email_NFe_JeW() {
        var record;

        if (gridNotaSaida.getSelectionModel().getCount() > 0) {
            record = gridNotaSaida.getSelectionModel().getSelected();
        }
        else {
            dialog.MensagemDeAlerta('Selecione uma nota emitida para enviar o e-mail', 'BTN_ENVIAR_EMAIL_NFe');
            return;
        }

        Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Cancelar');

        cancelar_email_nfe = false;

        Status_Processo_email("Enviando o e-mail", false);

        var _ajax1 = new Th2_Ajax();
        _ajax1.setUrl('servicos/TB_NOTA_SAIDA.asmx/Solicita_Envio_Email_JeW');
        _ajax1.setJsonData({
            NUMERO_SEQ: record.data.NUMERO_SEQ,
            CNPJ_EMITENTE: _CNPJ_EMITENTE,
            SERIE: _SERIE,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });
        _ajax1.ExibeDivProcessamento(false);

        var _sucess1 = function (response, options) {
            Busca_Resultado_email_JeW(record);
        }

        var _failure = function (response, options) {
            Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').setText('Enviar e-mail');
            Status_Processo_email("", false);
        };

        _ajax1.setFalha(_failure);
        _ajax1.setSucesso(_sucess1);
        _ajax1.Request();
    }

    var toolbar_TB_NOTA_SAIDA = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [{
            id: 'BTN_NOVA_NOTA_SAIDA',
            text: 'Nova NF',
            icon: 'imagens/icones/document_fav_24.gif',
            scale: 'medium',
            handler: function () {
                Ext.getCmp('tabNotasFiscais').items.items[1].enable();
                Ext.getCmp('tabNotasFiscais').setActiveTab(1);
                PreparaNovaNotaSaida();
            }
        }, '-', {
            id: 'BTN_ALTERAR_NOTA_SAIDA',
            text: 'Alterar NF',
            icon: 'imagens/icones/document_write_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                    if (record.data.EMITIDA_NF == 3) {
                        dialog.MensagemDeAlerta('N&atilde;o &eacute; poss&iacute;vel alterar esta nota. A nota est&aacute; emitida ou cancelada.', this);
                    }
                    else {
                        _nota_alterada_cancelada = (record.data.STATUS_NF == 3 || record.data.STATUS_NF == 4) ?
                                _nota_alterada_cancelada = true :
                                _nota_alterada_cancelada = false;

                        PreparaNotaSaidaAlteracao(record.data.NUMERO_SEQ);
                    }
                }
                else {
                    dialog.MensagemDeAlerta('Selecione uma nota para alterar', this);
                }
            }
        }, '-', {
            id: 'BTN_DELETAR_NOTA_SAIDA',
            text: 'Deletar NF',
            icon: 'imagens/icones/document_delete_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                    if (record.data.EMITIDA_NF == 1 || record.data.CANCELADA_NF == 1) {
                        dialog.MensagemDeAlerta('N&atilde;o &eacute; poss&iacute;vel deletar esta nota. A nota est&aacute; emitida ou cancelada.', this);
                    }
                    else {
                        TB_NOTA_SAIDA_Deleta(record);
                    }
                }
                else {
                    dialog.MensagemDeAlerta('Selecione uma nota para deletar', this);
                }
            }
        }, '-', {
            id: 'BTN_DELETAR_ITEMS_NOTA_SAIDA',
            text: 'Deletar<br />Item de NF',
            icon: 'imagens/icones/document_delete_24.gif',
            scale: 'large',
            handler: function () {
                if (Ext.getCmp('gridItemNotaSaida').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                    if (record.data.EMITIDA_NF == 1 || record.data.EMITIDA_NF == 1) {
                        dialog.MensagemDeAlerta('N&atilde;o &eacute; poss&iacute;vel deletar este item de nota. A nota est&aacute; emitida ou cancelada.', this);
                    }
                    else {
                        TB_ITEM_NOTA_SAIDA_Deleta();
                    }
                }
                else {
                    dialog.MensagemDeAlerta('Selecione um item de nota para deletar', this);
                }
            }
        }, '-', {
            id: 'BTN_CANCELAR_NOTA_SAIDA',
            text: 'Cancelar NF',
            icon: 'imagens/icones/document_cancel_24.gif',
            scale: 'medium',
            handler: function (btn) {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() == 0) {
                    dialog.MensagemDeAlerta('Selecione uma nota para cancelar', btn.getId());
                    return;
                }

                var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                if (record.data.STATUS_NF != 4) {
                    dialog.MensagemDeAlerta('Esta nota n&atilde;o foi emitida ainda. N&atilde;o &eacute; poss&iacute;vel cancelar.', btn.getId());
                    return;
                }

                if (record.data.CANCELADA_NF == 1) {
                    dialog.MensagemDeAlerta('Esta nota j&aacute; foi cancelada', btn.getId());
                    return;
                }

                janelaCancelaNF.record(record);
                janelaCancelaNF.show(btn.getId());
            }
        }, '-', {
            id: 'BTN_EMITIR_NOTA_SAIDA',
            text: 'Emitir NF',
            icon: 'imagens/icones/document_config_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() > 0) {
                    var arrEmissao = new Array();

                    for (var i = 0; i < Ext.getCmp('gridNotaSaida').getSelectionModel().selections.getCount(); i++) {
                        var record = Ext.getCmp('gridNotaSaida').getSelectionModel().selections.items[i];

                        if (record.data.CANCELADA_NF != 1 || record.data.EMITIDA_NF != 1) {
                            arrEmissao[i] = record;
                        }
                    }

                    if (arrEmissao.length > 0)
                        Emite_NOTA_SAIDA(arrEmissao);
                }
                else {
                    dialog.MensagemDeAlerta('Selecione uma nota para cancelar', this);
                }
            }
        }, '-', {
            id: 'BTN_ENVIAR_EMAIL_NFe',
            text: 'Enviar e-mail',
            icon: 'imagens/icones/mail_next_24.gif',
            scale: 'medium',
            handler: function () {
                if (_TIPO_EMISSAO_NFE == 1) {
                    Envia_Email_NFe();
                }
                else if (_TIPO_EMISSAO_NFE == 2) {
                    if (Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').text == 'Enviar e-mail') {
                        Envia_Email_NFe_JeW();
                    }
                    else {
                        cancelar_email_nfe = true;
                        Status_Processo_NFe("", false);
                    }
                }
                else if (_TIPO_EMISSAO_NFE == 3) {
                    Envia_Email_NFe();
                }
            }
        }, '-', {
            id: 'BTN_VENCIMENTO_NOTA_SAIDA',
            text: 'Vencimentos',
            icon: 'imagens/icones/calendar_24.gif',
            scale: 'medium',
            handler: function () {
                if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() > 0) {
                    var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                    _vencimentos.NUMERO_SEQ(record.data.NUMERO_SEQ);
                    _vencimentos.show('BTN_VENCIMENTO_NOTA_SAIDA');
                }
                else {
                    dialog.MensagemDeAlerta('Selecione uma nota para visualizar os seus vencimentos', this);
                }
            }
        }]
    });

    var pAcoes = new Ext.Panel({
        width: '100%',
        items: [toolbar_TB_NOTA_SAIDA]
    });

    function SolicitaDanfe(ArrRecord) {
        var _numero_seq = new Array();

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/SolicitaDANFE');
        _ajax.ExibeDivProcessamento(false);

        for (var i = 0; i < ArrRecord.length; i++) {
            _numero_seq[i] = ArrRecord[i].data.NUMERO_SEQ;
        }

        _ajax.setJsonData({ Arr_NUMERO_SEQ: _numero_seq, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            var arrResult = Ext.decode(response.responseText).d;

            Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(false);
            Ext.getCmp('lbl_emitindo_nfs').setVisible(false);

            for (var i = 0; i < arrResult.length; i++) {
                window.open(arrResult[i], '_blank', 'width=1000,height=800');
            }
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();

        Ext.getCmp('lbl_emitindo_nfs').setText("Gerando o(s) DANFE(s)... Aguarde.", false);
        Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(true);
        Ext.getCmp('lbl_emitindo_nfs').setVisible(true);

    }

    function TB_NOTA_SAIDA_Deleta(record) {
        dialog.MensagemDeConfirmacao('Deseja deletar esta Nota Fiscal?', 'gridNotaSaida', Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/DeletaNotaSaida');
                _ajax.setJsonData({ NUMERO_SEQ: record.data.NUMERO_SEQ, ID_USUARIO: _ID_USUARIO });

                var _sucess = function (response, options) {
                    Ext.getCmp('gridNotaSaida').getStore().remove(record);

                    Ext.getCmp('gridItemNotaSaida').getStore().removeAll();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    function Emite_NOTA_SAIDA(arrRecord) {

        var arrNumeroSeq = new Array();

        for (var i = 0; i < arrRecord.length; i++) {
            arrNumeroSeq[i] = arrRecord[i].data.NUMERO_SEQ;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/EmiteNotaSaida');
        _ajax.setJsonData({
            NUMERO_SEQ: arrNumeroSeq,
            SERIE: _SERIE,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        _ajax.ExibeDivProcessamento(false);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < result.length; i++) {
                arrRecord[i].set('STATUS_NF', 2);
                arrRecord[i].set('EMITIDA_NF', 1);
                arrRecord[i].set('NUMERO_NF', result[i].NUMERO_NF);
                arrRecord[i].set('SERIE_NF', result[i].SERIE_NF);

                arrRecord[i].commit();

                Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').disable();
                Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').disable();
                Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').disable();
                Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
                Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').disable();

                Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(false);
                Ext.getCmp('lbl_emitindo_nfs').setVisible(false);
            }
        };

        var _failure = function (response, options) {
            Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(false);
            Ext.getCmp('lbl_emitindo_nfs').setVisible(false);
        };

        _ajax.setFalha(_failure);
        _ajax.setSucesso(_sucess);
        _ajax.Request();

        Ext.getCmp('lbl_emitindo_nfs').setText("Emitindo Notas Fiscais... Aguarde.", false);
        Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(true);
        Ext.getCmp('lbl_emitindo_nfs').setVisible(true);
    }

    function TB_ITEM_NOTA_SAIDA_Deleta() {
        if (Ext.getCmp('gridItemNotaSaida').getSelectionModel().getCount() > 0) {
            var record = Ext.getCmp('gridItemNotaSaida').getSelectionModel().getSelected();

            dialog.MensagemDeConfirmacao('Deseja deletar este item de Nota Fiscal?', 'gridItemNotaSaida', Deleta);

            function Deleta(btn) {
                if (btn == 'yes') {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl('servicos/TB_ITEM_NOTA_SAIDA.asmx/DeletaItemNotaSaida');
                    _ajax.setJsonData({
                        NUMERO_ITEM_NF: record.data.NUMERO_ITEM_NF,
                        SEQUENCIA_ITEM_NF: record.data.SEQUENCIA_ITEM_NF,
                        Moeda: false,
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function (response, options) {
                        var result = Ext.decode(response.responseText).d;

                        if (Ext.getCmp('gridNotaSaida').getSelectionModel().getCount() > 0) {
                            var record1 = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

                            record1.set('TOTAL_ISS_NF', result.VALOR_ISS_NF.replace(',', '.'));
                            record1.set('TOTAL_SERVICOS_NF', result.TOTAL_SERVICOS_NF.replace(',', '.'));
                            record1.set('TOTAL_NF', result.TOTAL_SERVICOS_NF.replace(',', '.'));

                            record1.commit();
                        }

                        Ext.getCmp('gridItemNotaSaida').getStore().remove(record);
                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
            }
        }
        else {
            dialog.MensagemDeAlerta('Selecione um item de nota para deletar');
        }
    }

    var _itens_NOTA_SAIDA = new Monta_Nota_Saida_Itens();

    var panelNotasFiscais = new Ext.Panel({
        id: 'panelNotasFiscais',
        title: 'Notas Fiscais de Sa&iacute;da',
        width: '100%',
        items: [
            new Ext.TabPanel({
                id: 'tabNotasFiscais',
                activeTab: 0,
                anchor: '100%',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    title: 'Pesquisa',
                    autoScroll: true,
                    iconCls: 'icone_TB_NOTA_SAIDA_PESQUISA',
                    items: [pFiltros, pNotasFiscais, pItensNotasFiscais, pAcoes],
                    listeners: {
                        activate: function (p) {
                            Ext.getCmp('tabNotasFiscais').items.items[1].disable();
                            Ext.getCmp('tabNotasFiscais').items.items[2].disable();
                        }
                    }
                }, {
                    anchor: '100%',
                    title: 'Dados Principais da NF',
                    autoScroll: true,
                    iconCls: 'icone_TB_NOTA_SAIDA1',
                    disabled: true
                }, {
                    anchor: '100%',
                    title: 'Itens da Nota Fiscal',
                    autoScroll: true,
                    disabled: true,
                    iconCls: 'icone_TB_NOTA_SAIDA_ITENS',
                    listeners: {
                        activate: function (p) {
                            _itens_NOTA_SAIDA.PreparaAlteracao_NOTA_SAIDA(Ext.getCmp('NUMERO_SEQ').getValue());
                        }
                    }
                }],

                listeners: {
                    tabchange: function (tabPanel, panel) {

                        if (panel.title == 'Dados Principais da NF') {
                            if (panel.items.length == 0) {
                                panel.add(MontaPanel_NotaSaida1());
                                panel.doLayout();
                            }
                        }

                        if (panel.title == 'Itens da Nota Fiscal') {
                            if (panel.items.length == 0) {
                                panel.add(_itens_NOTA_SAIDA.panel_ITEM_NOTA_SAIDA());
                                panel.doLayout();
                            }
                        }
                    }
                }
            })]
    });

    return panelNotasFiscais;
}

function Canhoto_NF() {

    var _record;

    this.record = function (pRecord) {
        _record = pRecord;
    };

    var TXT_DATA_SAIDA_CANHOTO = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data de Sa&iacute;da',
        allowBlank: false
    });

    var TXT_HORA_SAIDA = new Ext.form.TimeField({
        fieldLabel: 'Hora de Sa&iacute;da'
    });

    var TXT_RESPONSAVEL = new Ext.form.TextField({
        fieldLabel: 'Respons&aacute;vel',
        width: 100,
        maxLength: 20,
        allowBlank: false,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 20 }
    });

    var BTN_GRAVAR_CANHOTO = new Ext.Button({
        text: 'Salvar',
        icon: 'imagens/icones/ok_24.gif',
        scale: 'large',
        handler: function () {
            Salva_Canhoto();
        }
    });

    var formCANHOTO = new Ext.FormPanel({
        bodyStyle: 'padding:2px 2px 0',
        frame: true,
        labelAlign: 'top',
        width: '100%',
        items: [{
            layout: 'form',
            items: [TXT_DATA_SAIDA_CANHOTO]
        }, {
            layout: 'form',
            items: [TXT_HORA_SAIDA]
        }, {
            layout: 'form',
            items: [TXT_RESPONSAVEL]
        }, {
            items: [BTN_GRAVAR_CANHOTO]
        }]
    });

    function Salva_Canhoto() {
        if (!formCANHOTO.getForm().isValid())
            return;

        var arr1 = new Array();

        for (var i = 0; i < _record.length; i++) {
            arr1[i] = _record[i].data.NUMERO_SEQ;
        }

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Salva_Canhoto');
        _ajax.setJsonData({
            NUMERO_SEQ: arr1,
            DATA_SAIDA_CANHOTO: TXT_DATA_SAIDA_CANHOTO.getRawValue(),
            HORA_SAIDA: TXT_HORA_SAIDA.getRawValue(),
            RESPONSAVEL_CANHOTO: TXT_RESPONSAVEL.getValue(),
            SERIE: _SERIE,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            for (var i = 0; i < _record.length; i++) {
                _record[i].beginEdit();
                _record[i].set('DATA_SAIDA_CANHOTO', result);
                _record[i].set('RESPONSAVEL_CANHOTO', TXT_RESPONSAVEL.getValue());
                _record[i].endEdit();
                _record[i].commit();
            }

            wCanhoto.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var wCanhoto = new Ext.Window({
        layout: 'form',
        title: 'Canhoto da Nota Fiscal de Sa&iacute;da',
        iconCls: 'icone_TB_NOTA_SAIDA',
        width: 235,
        height: 231,
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
        items: [formCANHOTO]
    });

    this.show = function (elm) {
        wCanhoto.show(elm);
    };
}

function janela_vencimentos_nota_saida() {
    var _NUMERO_SEQ;

    this.NUMERO_SEQ = function (pNUMERO_SEQ) {
        _NUMERO_SEQ = pNUMERO_SEQ;
    };

    var TB_FINANCEIRO_NF_SAIDA_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['VENCIMENTO', 'DIA', 'VALOR']
       )
    });

    var gridVencimentos_NF_Saida = new Ext.grid.GridPanel({
        id: 'gridVencimentos_NF_Saida',
        store: TB_FINANCEIRO_NF_SAIDA_Store,
        columns: [
        { id: 'VENCIMENTO', header: "Vencimento", width: 100, sortable: true, dataIndex: 'VENCIMENTO', renderer: XMLParseDate },
        { id: 'DIA', header: "Dia da Semana", width: 110, sortable: true, dataIndex: 'DIA' },
        { id: 'VALOR', header: "Valor da Parcela", width: 130, sortable: true, dataIndex: 'VALOR', renderer: FormataValor }
    ],
        stripeRows: true,
        height: 380,
        width: '100%',

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    var wVencimentos = new Ext.Window({
        id: 'janela_vencimentos_nota_saida',
        renderTo: Ext.getBody(),
        title: 'Parcelas da Nota Fiscal',
        iconCls: 'icone_TB_NOTA_SAIDA_VENCIMENTOS',
        width: 350,
        height: 360,
        modal: true,
        closable: false,
        minimizable: true,
        draggable: true,
        resizable: false,
        items: [gridVencimentos_NF_Saida],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elem) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Monta_Vencimentos_NF');
        _ajax.setJsonData({
            NUMERO_SEQ: _NUMERO_SEQ,
            SERIE: _SERIE,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            TB_FINANCEIRO_NF_SAIDA_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();

        wVencimentos.show(elem);
    };
}

function Cancela_Nota_Saida() {
    var _record;

    this.record = function (pRecord) {
        _record = pRecord;
    };

    var TXT_MOTIVO_CANCELAMENTO_NF_SAIDA = new Ext.form.TextField({
        fieldLabel: 'Motivo do Cancelamento',
        width: '98%',
        height: 135,
        allowBlank: false,
        minLength: 15,
        autoCreate: { tag: 'textarea', autocomplete: 'off' }
    });

    var cancelar_processamento1 = false;

    var BTN_MOTIVO_CANCELAR_NOTA_SAIDA = new Ext.Button({
        text: 'Cancelar NF',
        icon: 'imagens/icones/document_cancel_24.gif',
        scale: 'medium',
        handler: function () {
            //if (!Ext.getCmp('formCancelamentoNotaSaida').getForm().isValid())
            //    return;

            //var _ajax = new Th2_Ajax();
            //_ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/CancelaNotaSaida');
            //_ajax.setJsonData({ NUMERO_SEQ: _record.data.NUMERO_SEQ, MOTIVO: TXT_MOTIVO_CANCELAMENTO_NF_SAIDA.getValue() });

            //var _sucess = function(response, options) {
            //    Ext.getCmp('wCancela_Nota_Saida').hide();

            //    _record.set('STATUS_NF', 3);
            //    _record.set('CANCELADA_NF', 1);

            //    _record.commit();

            //    Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
            //};

            //_ajax.setSucesso(_sucess);
            //_ajax.Request();

            var record = Ext.getCmp('gridNotaSaida').getSelectionModel().selections.items[0];

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Solicita_Cancelamento_NFe_JeW');
            _ajax.setJsonData({
                NUMERO_SEQ: _record.data.NUMERO_SEQ,
                JUSTIFICATIVA: TXT_MOTIVO_CANCELAMENTO_NF_SAIDA.getValue(),
                CNPJ_EMITENTE: _CNPJ_EMITENTE,
                SERIE: _SERIE,
                ID_EMPRESA: _ID_EMPRESA,
                ID_USUARIO: _ID_USUARIO
            });

            _ajax.ExibeDivProcessamento(false);

            var _sucess = function (response, options) {
                Busca_Resultado_Cancelamento_JeW(record);
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();

            Status_Processo_NFe1("Solicitando o cancelamento da NF...", true);

            BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(true);

            function Busca_Resultado_Cancelamento_JeW(record) {

                if (!cancelar_processamento1) {
                    var _ajax1 = new Th2_Ajax();
                    _ajax1.setUrl('servicos/TB_NOTA_SAIDA.asmx/Busca_Resultado_Cancelamento_JeW');
                    _ajax1.setJsonData({
                        NUMERO_SEQ: record.data.NUMERO_SEQ,
                        CNPJ_EMITENTE: _CNPJ_EMITENTE,
                        SERIE: _SERIE,
                        ID_EMPRESA: _ID_EMPRESA,
                        ID_USUARIO: _ID_USUARIO
                    });

                    _ajax1.ExibeDivProcessamento(false);

                    var _sucess1 = function (response, options) {
                        var result = Ext.decode(response.responseText).d;

                        if (parseInt(result.ARQUIVO) == 1) {
                            if (parseInt(result.RESULTADO) == 101) {
                                record.beginEdit();
                                record.set('STATUS_NF', 3);
                                record.set('CANCELADA_NF', 1);
                                record.endEdit();
                                record.commit();

                                Ext.getCmp('BTN_ALTERAR_NOTA_SAIDA').disable();
                                Ext.getCmp('BTN_DELETAR_NOTA_SAIDA').disable();
                                Ext.getCmp('BTN_DELETAR_ITEMS_NOTA_SAIDA').disable();
                                Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
                                Ext.getCmp('BTN_EMITIR_NOTA_SAIDA').disable();
                                Ext.getCmp('BTN_IMPRIMIR_DANFE').disable();

                                Status_Processo_NFe1("", false);
                                BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(false);
                                wCancela_Nota_Saida.hide();
                            }
                            else {
                                Status_Processo_NFe1("", false);
                                BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(false);
                                Ext.getCmp('wCancela_Nota_Saida').hide();

                                dialog.MensagemDeErro(result.MENSAGEM);
                            }
                        }
                        else {

                            Status_Processo_NFe1("Aguardando a resposta da SEFAZ", true);
                            Busca_Resultado_Cancelamento_JeW(record);
                        }
                    };
                }
                else {
                    Status_Processo_NFe1("", false);
                    cancelar_processamento1 = false;
                    BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(false);
                }

                var _falha = function (response, options) {
                    Status_Processo_NFe1("", false);
                    BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(false);
                    Ext.getCmp('wCancela_Nota_Saida').hide();
                };

                _ajax1.setFalha(_falha);
                _ajax1.setSucesso(_sucess1);
                _ajax1.Request();
            }

            function Status_Processo_NFe1(text, visivel) {
                Ext.getCmp('lbl_emitindo_nfs').setText(text, false);
                Ext.getCmp('gif_rodando_emitindo_nfs').setVisible(visivel);
                Ext.getCmp('lbl_emitindo_nfs').setVisible(visivel);

                if (visivel) {
                    Ext.getCmp('BTN_NOVA_NOTA_SAIDA').disable();
                    Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').disable();
                    Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').disable();
                    Ext.getCmp('BTN_VENCIMENTO_NOTA_SAIDA').disable();
                }
                else {
                    Ext.getCmp('BTN_NOVA_NOTA_SAIDA').enable();
                    Ext.getCmp('BTN_CANCELAR_NOTA_SAIDA').enable();
                    Ext.getCmp('BTN_ENVIAR_EMAIL_NFe').enable();
                    Ext.getCmp('BTN_VENCIMENTO_NOTA_SAIDA').enable();
                }
            }
        }
    });

    var BTN_CANCELAR_PROCESSO_CANCELAMENTO = new Ext.Button({
        text: 'Cancelar Opera&ccedil;&atilde;o',
        icon: 'imagens/icones/document_cancel_24.gif',
        scale: 'medium',
        handler: function () {
            cancelar_processamento1 = true;
        }
    });

    var formCancelamentoNotaSaida = new Ext.form.FormPanel({
        id: 'formCancelamentoNotaSaida',
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        frame: true,
        width: '100%',
        height: '100%',
        items: [TXT_MOTIVO_CANCELAMENTO_NF_SAIDA, {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .30,
                items: [BTN_MOTIVO_CANCELAR_NOTA_SAIDA]
            }, {
                columnWidth: .45,
                items: [BTN_CANCELAR_PROCESSO_CANCELAMENTO]
            }]
        }]
    });

    var wCancela_Nota_Saida = new Ext.Window({
        id: 'wCancela_Nota_Saida',
        renderTo: Ext.getBody(),
        title: 'Cancelamento de Nota Fiscal',
        iconCls: 'Cancelamento_Nota',
        width: 450,
        height: 245,
        modal: true,
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        items: [formCancelamentoNotaSaida],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    this.show = function (elem) {
        BTN_CANCELAR_PROCESSO_CANCELAMENTO.setVisible(false);

        wCancela_Nota_Saida.show(elem);
        TXT_MOTIVO_CANCELAMENTO_NF_SAIDA.focus();
    }
}

function SELECIONA_CLIENTE_OPERACAO_TRIANGULAR() {
    var TB_CLIENTE_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'NOME_CLIENTE', 'NOMEFANTASIA_CLIENTE', 'CNPJ_CLIENTE', 'IE_CLIENTE',
        'CIDADE_FATURA', 'DESCRICAO_CIDADE_FATURA', 'ESTADO_FATURA', 'DESCRICAO_ESTADO_FATURA', 'TELEFONE_FATURA'])
    });

    var gridTB_CLIENTE = new Ext.grid.GridPanel({
        store: TB_CLIENTE_Store,
        columns: [
        { id: 'ID_CLIENTE', header: 'ID', width: 50, sortable: true, dataIndex: 'ID_CLIENTE' },
        { id: 'NOME_CLIENTE', header: "Nome / Raz&aacute;o Social", width: 300, sortable: true, dataIndex: 'NOME_CLIENTE' },
        { id: 'NOMEFANTASIA_CLIENTE', header: "Nome Fantasia", width: 220, sortable: true, dataIndex: 'NOMEFANTASIA_CLIENTE' },
        { id: 'CNPJ_CLIENTE', header: "CNPJ", width: 150, sortable: true, dataIndex: 'CNPJ_CLIENTE' },
        { id: 'IE_CLIENTE', header: "Inscri&ccedil;&atilde;o Estadual", width: 140, sortable: true, dataIndex: 'IE_CLIENTE', hidden: true },
        { id: 'DESCRICAO_CIDADE_FATURA', header: "Munic&iacute;pio", width: 140, sortable: true, dataIndex: 'DESCRICAO_CIDADE_FATURA' },
        { id: 'DESCRICAO_ESTADO_FATURA', header: "Estado", width: 100, sortable: true, dataIndex: 'DESCRICAO_ESTADO_FATURA' },
        { id: 'TELEFONE_FATURA', header: "Telefone", width: 100, sortable: true, dataIndex: 'TELEFONE_FATURA' }

        ],
        stripeRows: true,
        height: 350,
        width: 1000,
        columnLines: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),

        listeners: {
            specialkey: function (e) {
                if (e.getKey() == e.ENTER) {
                    if (gridTB_CLIENTE.getSelectionModel().getSelections().length > 0) {
                        var record = gridTB_CLIENTE.getSelectionModel().getSelected();
                        OPERACAO_TRIANGULAR(record.data.ID_CLIENTE);
                    }
                }
            }
        }
    });

    gridTB_CLIENTE.on('rowdblclick', function (e) {
        if (gridTB_CLIENTE.getSelectionModel().getSelections().length > 0) {
            var record = gridTB_CLIENTE.getSelectionModel().getSelected();
            OPERACAO_TRIANGULAR(record.data.ID_CLIENTE);
        }
    });

    var TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Nome Fantasia',
        width: 200,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_TXT_NOME_CLIENTE = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Parte da Raz&atilde;o Social',
        width: 250,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    TB_CLIENTE_CARREGA_GRID();
                }
            }
        }
    });

    var TB_CLIENTE_BTN_PESQUISA = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_16.gif',
        scale: 'small',
        handler: function () {
            TB_CLIENTE_CARREGA_GRID();
        }
    });

    var TB_CLIENTE_PagingToolbar = new Th2_PagingToolbar();

    TB_CLIENTE_PagingToolbar.setUrl('servicos/TB_CLIENTE.asmx/ListaClientes_OperacaoTriangular');
    TB_CLIENTE_PagingToolbar.setLinhasPorPagina(12);
    TB_CLIENTE_PagingToolbar.setStore(TB_CLIENTE_Store);

    function RetornaFiltros_TB_CLIENTE_JsonData() {
        var TB_CLIENTE_JsonData = {
            nomeFantasia: TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE.getValue(),
            nome: TB_CLIENTE_TXT_NOME_CLIENTE.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: TB_CLIENTE_PagingToolbar.getLinhasPorPagina()
        };

        return TB_CLIENTE_JsonData;
    }

    var wBUSCA_TB_CLIENTE = new Ext.Window({
        layout: 'form',
        title: 'Selecione o cliente para gerar a nota de Remessa',
        iconCls: 'icone_TB_CLIENTE',
        width: 1010,
        height: 'auto',
        closable: false,
        draggable: true,
        resizable: false,
        minimizable: true,
        modal: true,
        renderTo: Ext.getBody(),
        items: [gridTB_CLIENTE, TB_CLIENTE_PagingToolbar.PagingToolbar(), {
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .31,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 90,
                items: [TB_CLIENTE_TXT_NOMEFANTASIA_CLIENTE]
            }, {
                columnWidth: .39,
                layout: 'form',
                labelAlign: 'left',
                labelWidth: 120,
                items: [TB_CLIENTE_TXT_NOME_CLIENTE]
            }, {
                columnWidth: .20,
                items: [TB_CLIENTE_BTN_PESQUISA]
            }]
        }],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    var CLIENTE_IMPOSTO;

    function OPERACAO_TRIANGULAR(CODIGO_CLIENTE) {

        if (CLIENTE_IMPOSTO == CODIGO_CLIENTE) {
            dialog.MensagemDeErro('N&atilde;o &eacute; poss&iacute;vel gerar a nota de remessa para o mesmo cliente');
            return;
        }

        var record = Ext.getCmp('gridNotaSaida').getSelectionModel().getSelected();

        var NUMERO_SEQ = record.data.NUMERO_SEQ;

        ////////////////////

        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_NOTA_SAIDA.asmx/Operacao_Triangular');

        _ajax.setJsonData({ NUMERO_SEQ: NUMERO_SEQ, CODIGO_CLIENTE: CODIGO_CLIENTE, ID_USUARIO: _ID_USUARIO });

        var _sucess = function (response, options) {
            wBUSCA_TB_CLIENTE.hide();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function TB_CLIENTE_CARREGA_GRID() {
        TB_CLIENTE_PagingToolbar.setParamsJsonData(RetornaFiltros_TB_CLIENTE_JsonData());
        TB_CLIENTE_PagingToolbar.doRequest();
    }

    this.CLIENTE_IMPOSTO_COBRANCA = function (pCLIENTE_IMPOSTO) {
        CLIENTE_IMPOSTO = pCLIENTE_IMPOSTO;
    };

    this.show = function (objAnm) {
        wBUSCA_TB_CLIENTE.show(objAnm);
    };
}