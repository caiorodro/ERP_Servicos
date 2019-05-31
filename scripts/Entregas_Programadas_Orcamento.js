
function Entregas_Programadas_Orcamento() {
    var _NUMERO_ORCAMENTO;

    this.NUMERO_ORCAMENTO = function (pValue) {
        _NUMERO_ORCAMENTO = pValue;
    };

    var _NOME_CLIENTE;

    this.NOME_CLIENTE = function (pValue) {
        _NOME_CLIENTE = pValue;

        LBL1.setText('<br /><table><tr><td style="text-align: right; font-size: 9pt;"><b>N&ordm; do or&ccedil;amento:</b></td><td>&nbsp;&nbsp;' + _NUMERO_ORCAMENTO + '</td></tr><tr><td style="text-align: right; font-size: 9pt;"><b>Cliente:</b></td><td>&nbsp;&nbsp;' + _NOME_CLIENTE + '</td></tr></table><br />&nbsp;', false);
    };

    var LBL1 = new Ext.form.Label({
        html: '<br /><table><tr><td style="text-align: right; font-size: 9pt;"><b>N&ordm; do or&ccedil;amento:</b></td><td>&nbsp;&nbsp;' + _NUMERO_ORCAMENTO + '</td></tr><tr><td style="text-align: right; font-size: 9pt;"><b>Cliente:</b></td><td>&nbsp;&nbsp;' + _NOME_CLIENTE + '</td></tr></table><br />&nbsp;'
    });

    var LBL_DEMANDA_ATUAL = new Ext.form.Label();

    var ITENS_ORCAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', 'QTDE_PRODUTO', 'DATA_ENTREGA',
            'ATRASADA', 'NUMERO_PEDIDO_VENDA', 'PROGRAMACAO', 'NAO_GERAR_PEDIDO', 'UNIDADE_PRODUTO', 'DATA_CALCULADA']
           )
    });

    var checkBoxSM_IO = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (s, Index, record) {
                if (record.data.NUMERO_PEDIDO_VENDA > 0) {
                    s.deselectRow(Index);
                }
            }
        }
    });

    function Nao_Gerar_Pedido(val, _metadata, _record) {
        if (val == 0 && _record.data.NUMERO_PEDIDO_VENDA == 0) {
            return "";
        }
        else if (val == 1 && _record.data.NUMERO_PEDIDO_VENDA == 0) {
            return "<span style='background-color: #FFF000; color: navy;'>N&atilde;o vai no pedido</span>";
        }
        else if (val == 0 && _record.data.NUMERO_PEDIDO_VENDA > 0) {
            return "<span style='background-color: #0000FF; color: #FFFFFF;'>Servi&ccedil;o Gerado</span>";
        }
    }

    function Programacao(val, _metadata, _record) {
        return _record.data.PROGRAMACAO_ITEM_ORCAMENTO == 1 ?
            "<span style='background-color: #a6a6db; color: navy;' title='Programa&ccedil;&atilde;o'>" + val + "</span>" :
            val;
    }


    var TXT_DATA_ENTREGA = new Ext.form.DateField();

    var grid_ITENS_ORCAMENTO = new Ext.grid.EditorGridPanel({
        title: 'Itens do or&ccedil;amento',
        store: ITENS_ORCAMENTO_Store,
        columns: [
            checkBoxSM_IO,
            { id: 'NAO_GERAR_PEDIDO', header: "", width: 105, sortable: true, dataIndex: 'NAO_GERAR_PEDIDO', renderer: Nao_Gerar_Pedido, hidden: true },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO', renderer: Programacao },
            { id: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', header: "Descri&ccedil;&atilde;o", width: 320, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', hidden: true },
            { id: 'QTDE_PRODUTO', header: "Qtde", width: 70, sortable: true, dataIndex: 'QTDE_PRODUTO', renderer: FormataQtde, align: 'center' },
            { id: 'UNIDADE_PRODUTO', header: "Unid", width: 40, sortable: true, dataIndex: 'UNIDADE_PRODUTO', align: 'center' },
            { id: 'DATA_ENTREGA', header: "Entrega", width: 75, sortable: true, dataIndex: 'DATA_ENTREGA', renderer: EntregaAtrasadaOrcamento, align: 'center' },
            { id: 'DATA_CALCULADA', header: "Sugest&atilde;o<br />de entrega", width: 80, sortable: true, dataIndex: 'DATA_CALCULADA', renderer: formatDate, align: 'center',
                editor: TXT_DATA_ENTREGA
            },
            { id: 'PROGRAMACAO', header: "Processo calculado", width: 780, sortable: true, dataIndex: 'PROGRAMACAO' }
        ],

        stripeRows: true,
        height: AlturaDoPainelDeConteudo(204),
        width: '100%',

        sm: checkBoxSM_IO,

        clicksToEdit: 1,

        listeners: {
            beforeEdit: function (e) {
                if (e.record.data.NUMERO_PEDIDO_VENDA > 0)
                    e.cancel = true;
            },
            afterEdit: function (e) {
                if (e.value == '') {
                    e.record.reject();
                }
                else if (e.value == e.originalValue) {
                    e.record.reject();
                }
                else {
                    for (var i = 0; i < ITENS_ORCAMENTO_Store.getCount(); i++) {
                        var record = ITENS_ORCAMENTO_Store.getAt(i);

                        if (record.data.NUMERO_PEDIDO_VENDA == 0 && e.value != '') {
                            if (!record.dirty) {
                                record.beginEdit();
                                record.set('DATA_CALCULADA', e.value);
                                record.endEdit();
                            }
                        }
                    }
                }
            }
        }
    });

    function Carrega_Grid() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Calcula_Entregas_do_Orcamento');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO,
            CODIGO_EMITENTE: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;
            ITENS_ORCAMENTO_Store.loadData(criaObjetoXML(result), false);

            Carrega_Demanda_Atual();
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    function Carrega_Demanda_Atual() {
        var _ajax = new Th2_Ajax();
        _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Busca_Tempo_Demanda_do_dia');
        _ajax.setJsonData({
            NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO,
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        });

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            LBL_DEMANDA_ATUAL.setText("<br /><table><tr><td style='font-family: tahoma; font-size: 9pt; text-align: right;'><b>Previs&atilde;o de t&eacute;rmino da demanda atual:</b>&nbsp;&nbsp;&nbsp;</td><td>" + result[0] + "</td></tr>" +
                "<tr><td style='font-family: tahoma; font-size: 9pt; text-align: right;'><b>Previs&atilde;o de t&eacute;rmino da demanda na data do or&ccedil;amento:</b>&nbsp;&nbsp;&nbsp;</td><td>" + result[1] + "</td></tr></table>", false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var toolbar1 = new Ext.Toolbar({
        style: 'text-align: right;',
        items: [{
            text: 'Salvar datas de entregas calculadas no or&ccedil;amento',
            icon: 'imagens/icones/database_save_24.gif',
            scale: 'medium',
            handler: function (btn) {
                Grava_Nova_Data_de_Entrega_Itens_Orcamento(btn);
            }
        }, '-']
    });

    function Grava_Nova_Data_de_Entrega_Itens_Orcamento(btn) {

        dialog.MensagemDeConfirmacao('Confirma a grava&ccedil;&atilde;o da nova data de entrega nos itens marcados?', btn.getId(), Deleta);

        function Deleta(btn) {
            if (btn == 'yes') {

                var arr1 = new Array();
                var arr2 = new Array();

                for (var i = 0; i < ITENS_ORCAMENTO_Store.getCount(); i++) {
                    if (ITENS_ORCAMENTO_Store.getAt(i).dirty) {
                        arr1[arr1.length] = ITENS_ORCAMENTO_Store.getAt(i).data.NUMERO_ITEM;
                        arr2[arr2.length] = formatDate(ITENS_ORCAMENTO_Store.getAt(i).data.DATA_CALCULADA);
                    }
                }

                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_ITEM_ORCAMENTO_VENDAS.asmx/Grava_Nova_Data_de_Entrega_Itens_Orcamento');
                _ajax.setJsonData({
                    NUMERO_ORCAMENTO: _NUMERO_ORCAMENTO,
                    NUMEROS_ITEM_ORCAMENTO: arr1,
                    DATAS_ENTREGAS: arr2,
                    ID_USUARIO: _ID_USUARIO
                });

                var _sucess = function (response, options) {
                    var result = Ext.decode(response.responseText).d;

                    Carrega_Grid();
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }
        }
    }

    var panel1 = new Ext.Panel({
        border: true,
        frame: true,
        bodyStyle: 'padding:0px 0px 0',
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                layout: 'form',
                columnWidth: .30,
                items: [LBL1]
            }, {
                layout: 'form',
                columnWidth: .70,
                items: [LBL_DEMANDA_ATUAL]
            }]
        },
        grid_ITENS_ORCAMENTO, toolbar1]
    });

    this.carregaGrid = function () {
        Carrega_Grid();
    };

    this.panel = function () {
        return panel1;
    };
}