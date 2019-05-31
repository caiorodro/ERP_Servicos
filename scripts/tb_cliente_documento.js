var _documento_cliente;
var _ID_CLIENTE1;

function Carrega_Grid_Documento_Cliente() {
    _documento_cliente.carregaGrid();
}

function MontaCadastroDocumentoCliente() {

    var _ID_CLIENTE;

    this.ID_CLIENTE = function(pValue) {
        _ID_CLIENTE = pValue;
        _ID_CLIENTE1 = pValue;

        Carrega_Grid();
    };

    var _titulo;

    this.setTitulo = function(pValue) {
        if (pValue.length > 0)
            _titulo = ' [' + pValue + ']';
        else
            _titulo = "";

        resetaFormulario();
    };

    var LBL_FRAME1 = new Ext.form.Label();

    LBL_FRAME1.setText("<iframe style='width: 100%; height: 85px; border-width: 0px;' src='formDocumentoCliente.aspx?ID_USUARIO=" + _ID_USUARIO + "'></iframe>", false);

    //**************************** GRID AREA STARTS HERE ***********************

    var TB_CLIENTE_DOCUMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_CLIENTE', 'ID_DOCUMENTO', 'NOME_DOCUMENTO', 'DATA_DOCUMENTO']),
        sortInfo: {
            field: 'DATA_DOCUMENTO',
            direction: 'DESC'
        }
    });

    function Baixa_Documento(ID_DOCUMENTO) {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_CLIENTE_DOCUMENTO.asmx/Baixa_Documento');

        _ajax.setJsonData({
            ID_CLIENTE: _ID_CLIENTE,
            ID_DOCUMENTO: ID_DOCUMENTO,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function(response, options) {
            var result = Ext.decode(response.responseText).d;
            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function abrir_documento(val) {
        return "<span style='cursor: pointer;'><img src='imagens/icones/file_next_16.gif' title='Clique para baixar o documento' /></span>";
    }

    var TXT_DOCUMENTO = new Ext.form.TextField({
        maxLength: 150,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: 150 }
    });

    var gridClienteDocumento = new Ext.grid.EditorGridPanel({
        store: TB_CLIENTE_DOCUMENTO_Store,
        title: 'Documentos do cliente cadastrados',
        tbar: [{
            text: 'Deletar documento',
            icon: 'imagens/icones/database_delete_16.gif',
            scale: 'small',
            listeners: {
                click: function(b, e) {

                    if (gridClienteDocumento.getSelectionModel().selections.items.length == 0) {
                        dialog.MensagemDeErro('Selecione um documento para deletar', b.getId());
                        return;
                    }

                    var _record = gridClienteDocumento.getSelectionModel().getSelected();

                    Deleta_TB_CLIENTE_DOCUMENTO(_record.data.ID_DOCUMENTO, b.getId());
                }
            }
}],
            columns: [
        { id: 'NOME_DOCUMENTO', header: "Lista de documentos", width: 720, sortable: true, dataIndex: 'NOME_DOCUMENTO',
            editor: TXT_DOCUMENTO
        },
        { id: 'DATA_DOCUMENTO', header: "Data do documento", width: 140, sortable: true, dataIndex: 'DATA_DOCUMENTO', renderer: XMLParseDateTime },
        { id: 'ABRIR', header: "", width: 50, sortable: true, dataIndex: 'ABRIR', renderer: abrir_documento}],
            stripeRows: true,
            height: 450,
            width: '100%',

            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            clicksToEdit: 2,

            listeners: {
                cellclick: function(grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

                    if (fieldName == 'ABRIR') {
                        Baixa_Documento(record.data.ID_DOCUMENTO);
                    }
                },
                afterEdit: function(e) {
                    if (e.value != e.originalValue) {

                        var _ajax = new Th2_Ajax();
                        _ajax.setUrl('servicos/TB_CLIENTE_DOCUMENTO.asmx/Altera_Nome_Documento');
                        _ajax.ExibeDivProcessamento(false);

                        _ajax.setJsonData({
                            ID_DOCUMENTO: e.record.data.ID_DOCUMENTO,
                            NOME_DOCUMENTO: e.value,
                            ID_USUARIO: _ID_USUARIO
                        });

                        var _sucess = function(response, options) {
                            e.record.commit();
                        };

                        _ajax.setSucesso(_sucess);
                        _ajax.Request();
                    }
                }
            }
        });

        var TXT_PESQUISA = new Ext.form.TextField({
            layout: 'form',
            fieldLabel: 'Nome do documento',
            width: 290,
            listeners: {
                specialkey: function(f, e) {
                    if (e.getKey() == e.ENTER) {
                        Carrega_Grid();
                    }
                }
            }
        });

        var BTN_PESQUISA = new Ext.Button({
            text: 'Buscar',
            icon: 'imagens/icones/database_search_16.gif',
            scale: 'small',
            handler: function() {
                Carrega_Grid();
            }
        });

        //**************************** GRID AREA ENDS HERE ***********************

        //**************************** GRID FUNCTIONS ***********************

        function RETORNAFILTROS_JsonData() {

            var _pesquisa = TXT_PESQUISA.getValue();

            if (!_pesquisa) _pesquisa = '';

            var TB_TRANSPORTADORA_JsonData = {
                ID_CLIENTE: _ID_CLIENTE,
                ID_USUARIO: _ID_USUARIO,
                pesquisa: _pesquisa,
                start: 0,
                limit: DOCUMENTO_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSPORTADORA_JsonData;
        }

        var DOCUMENTO_PagingToolbar = new Th2_PagingToolbar();

        DOCUMENTO_PagingToolbar.setUrl('servicos/TB_CLIENTE_DOCUMENTO.asmx/CARREGA_DOCUMENTOS');
        DOCUMENTO_PagingToolbar.setStore(TB_CLIENTE_DOCUMENTO_Store);

        function Carrega_Grid() {
            if (_ID_CLIENTE > 0) {
                DOCUMENTO_PagingToolbar.setParamsJsonData(RETORNAFILTROS_JsonData());
                DOCUMENTO_PagingToolbar.doRequest();
            }
        }

        //**************************** GRID FUNCTIONS END ***********************

        var panelCadastroDocumento = new Ext.Panel({
            width: '100%',
            border: true,
            items: [LBL_FRAME1, gridClienteDocumento, DOCUMENTO_PagingToolbar.PagingToolbar(), {
                layout: 'column',
                frame: true,
                items: [{
                    layout: 'form',
                    labelAlign: 'left',
                    labelWidth: 160,
                    style: 'vertical-align: bottom;',
                    items: [TXT_PESQUISA]
                }, {
                    style: 'vertical-align: bottom;',
                    items: [BTN_PESQUISA]
}]
}]
                });

                function resetaFormulario() {
                    TB_CLIENTE_DOCUMENTO_Store.removeAll();
                }

                function Deleta_TB_CLIENTE_DOCUMENTO(ID_DOCUMENTO, _ctl1) {

                    dialog.MensagemDeConfirmacao('Deseja deletar este documento do cadastro do cliente?', _ctl1, Deleta);

                    function Deleta(btn) {
                        if (btn == 'yes') {
                            var _ajax = new Th2_Ajax();
                            _ajax.setUrl('servicos/TB_CLIENTE_DOCUMENTO.asmx/DeletaDocumento');
                            _ajax.setJsonData({
                                ID_DOCUMENTO: ID_DOCUMENTO,
                                ID_USUARIO: _ID_USUARIO
                            });

                            var _sucess = function(response, options) {
                                Carrega_Grid();
                            };

                            _ajax.setSucesso(_sucess);
                            _ajax.Request();
                        }
                    }
                }

                gridClienteDocumento.setHeight(AlturaDoPainelDeConteudo(276));

                this.Panel = function() {
                    return panelCadastroDocumento;
                };

                this.carregaGrid = function() {
                    Carrega_Grid();
                };
            }
