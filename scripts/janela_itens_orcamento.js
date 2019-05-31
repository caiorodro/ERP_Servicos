function JANELA_ITENS_ORCAMENTO() {
    var _NUMERO_ORCAMENTO;

    this.NUMERO_ORCAMENTO = function (pNUMERO_ORCAMENTO) {
        _NUMERO_ORCAMENTO = pNUMERO_ORCAMENTO;
    };

    var _record_orcamento;

    this.record_orcamento = function (pValue) {
        _record_orcamento = pValue;
    };

    var label1 = new Ext.form.Label();

    var _html = "<table border='0' width='100%'>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Cliente:</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Cond. Pagto.:</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Transportadora:</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Vendedor(a):</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Margem M&eacute;dia:</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold;'>Total do Or&ccedil;amento:</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr>";
    _html += "<tr><td style='font-family: tahoma; font-size: 9pt; font-weight: bold; text-align: right;'>Observa&ccedil;&otilde;es: &nbsp;&nbsp;</td>";
    _html += "<td style='font-family: tahoma; font-size: 9pt;'></td></tr></table>";


    label1.setText(_html, false);

    var ITENS_ORCAMENTO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['NUMERO_ORCAMENTO', 'NUMERO_ITEM', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', 'QTDE_PRODUTO', 'PRECO_PRODUTO',
                'VALOR_TOTAL', 'CODIGO_CLIENTE_ITEM_ORCAMENTO', 'CUSTO_TOTAL_PRODUTO', 'MARGEM_VENDA_PRODUTO', 'VALOR_DESCONTO',
                 'NUMERO_PEDIDO_ITEM_ORCAMENTO', 'OBS_ITEM_ORCAMENTO', 'TIPO_DESCONTO',
                'NAO_GERAR_PEDIDO', 'NUMERO_PEDIDO_VENDA', 'MARGEM_CADASTRADA_PRODUTO', 'PROGRAMACAO_ITEM_ORCAMENTO',
                'CONJUNTO', 'ITEM_REQUER_CERTIFICADO', 'DATA_ENTREGA', 'ATRASADA', 'CUSTOS', 'ALIQ_ICMS', 'VALOR_ICMS',
                'ALIQ_IPI', 'VALOR_IPI', 'BASE_ICMS_SUBS', 'VALOR_ICMS_SUBS', 'ITEM_PARA_CONSUMO', 'NUMERO_ITEM_PEDIDO_CLIENTE',
                'PERCENTUAL_COMISSAO']
           )
    });

    var IO_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '<br /><b>Observa&ccedil;&otilde;es:</b> {OBS_ITEM_ORCAMENTO}<br />{CONJUNTO}{CUSTOS}{ADICIONAL_REPRESENTANTE}'
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

    var grid_ITENS_ORCAMENTO1 = new Ext.grid.GridPanel({
        store: ITENS_ORCAMENTO_Store,
        enableColumnHide: _GERENTE_COMERCIAL == 1 ? true : false,
        columns: [
            IO_expander,
            checkBoxSM_IO,
            { id: 'NAO_GERAR_PEDIDO', header: "Gerar Pedido", width: 105, sortable: true, dataIndex: 'NAO_GERAR_PEDIDO', renderer: Nao_Gerar_Pedido },
            { id: 'CODIGO_PRODUTO', header: "C&oacute;digo do Produto", width: 140, sortable: true, dataIndex: 'CODIGO_PRODUTO', renderer: Programacao },
            { id: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO', header: "Descri&ccedil;&atilde;o", width: 310, sortable: true, dataIndex: 'DESCRICAO_PRODUTO_ITEM_ORCAMENTO' },
            { id: 'QTDE_PRODUTO', header: "Qtde", width: 70, sortable: true, dataIndex: 'QTDE_PRODUTO', renderer: FormataQtde },
            { id: 'CUSTO_TOTAL_PRODUTO', header: "Custo", width: 75, sortable: true, dataIndex: 'CUSTO_TOTAL_PRODUTO', renderer: FormataValor_4,
                hidden: _GERENTE_COMERCIAL == 1 ? false : true
            },
            { id: 'MARGEM_VENDA_PRODUTO', header: "Margem", width: 75, sortable: true, dataIndex: 'MARGEM_VENDA_PRODUTO', renderer: FormataPercentualMargem, align: 'center',
                hidden: _GERENTE_COMERCIAL == 1 ? false : true
            },
            { id: 'PERCENTUAL_COMISSAO', header: "% comiss&atilde;o", width: 80, sortable: true, dataIndex: 'PERCENTUAL_COMISSAO', renderer: FormataPercentualComissao, align: 'center' },
            { id: 'VALOR_DESCONTO', header: "Desconto", width: 75, sortable: true, dataIndex: 'VALOR_DESCONTO', renderer: FormataDesconto, align: 'right' },
            { id: 'PRECO_PRODUTO', header: "Pre&ccedil;o", width: 90, sortable: true, dataIndex: 'PRECO_PRODUTO', renderer: FormataValor_4, align: 'right' },
            { id: 'VALOR_TOTAL', header: "Valor Total", width: 110, sortable: true, dataIndex: 'VALOR_TOTAL', renderer: FormataValor, align: 'right' },

            { id: 'ALIQ_ICMS', header: "Al&iacute;q ICMS", width: 80, sortable: true, dataIndex: 'ALIQ_ICMS', renderer: FormataPercentual, align: 'right' },
            { id: 'VALOR_ICMS', header: "Valor ICMS", width: 80, sortable: true, dataIndex: 'VALOR_ICMS', renderer: FormataValor, align: 'right' },
            { id: 'ALIQ_IPI', header: "Al&iacute;q IPI", width: 80, sortable: true, dataIndex: 'ALIQ_IPI', renderer: FormataPercentual, align: 'right' },
            { id: 'VALOR_IPI', header: "Valor IPI", width: 120, sortable: true, dataIndex: 'VALOR_IPI', renderer: FormataValor, align: 'right' },
            { id: 'BASE_ICMS_SUBS', header: "Base ICMS ST", width: 100, sortable: true, dataIndex: 'BASE_ICMS_SUBS', renderer: FormataValor, align: 'right' },
            { id: 'VALOR_ICMS_SUBS', header: "Valor ICMS ST", width: 100, sortable: true, dataIndex: 'VALOR_ICMS_SUBS', renderer: FormataValor, align: 'right' },

            { id: 'DATA_ENTREGA', header: "Entrega", width: 75, sortable: true, dataIndex: 'DATA_ENTREGA', renderer: EntregaAtrasadaOrcamento },
            { id: 'ITEM_REQUER_CERTIFICADO', header: "Certificado", width: 70, sortable: true, dataIndex: 'ITEM_REQUER_CERTIFICADO', renderer: TrataCombo_01 },
            { id: 'CODIGO_CLIENTE_ITEM_ORCAMENTO', header: "C&oacute;d. Cliente", width: 180, sortable: true, dataIndex: 'CODIGO_CLIENTE_ITEM_ORCAMENTO' },
            { id: 'NUMERO_PEDIDO_ITEM_ORCAMENTO', header: "Nr. Pedido do Cliente", width: 150, sortable: true, dataIndex: 'NUMERO_PEDIDO_ITEM_ORCAMENTO' },
            { id: 'NUMERO_ITEM_PEDIDO_CLIENTE', header: "Nr. Item Cliente", width: 110, sortable: true, dataIndex: 'NUMERO_ITEM_PEDIDO_CLIENTE' },
            { id: 'NUMERO_PEDIDO_VENDA', header: "Pedido de Venda", width: 110, sortable: true, dataIndex: 'NUMERO_PEDIDO_VENDA', align: 'center' }
        ],

        stripeRows: true,
        height: 500,
        width: '100%',

        plugins: IO_expander,
        sm: checkBoxSM_IO
    });

    var ITENS_ORCAMENTO_PagingToolbar = new Th2_PagingToolbar();

    ITENS_ORCAMENTO_PagingToolbar.setUrl('servicos/TB_ORCAMENTO_VENDA.asmx/Carrega_Itens_Orcamento');
    ITENS_ORCAMENTO_PagingToolbar.setParamsJsonData(RetornaFiltros_ORCAMENTOS_JsonData());
    ITENS_ORCAMENTO_PagingToolbar.setStore(ITENS_ORCAMENTO_Store);

    function RetornaFiltros_ORCAMENTOS_JsonData(numero_orcamento) {

        var TB_TRANSP_JsonData = {
            NUMERO_ORCAMENTO: numero_orcamento,
            start: 0,
            limit: ITENS_ORCAMENTO_PagingToolbar.getLinhasPorPagina()
        };

        return TB_TRANSP_JsonData;
    }

    function Carrega_ITENS_ORCAMENTOs(numero_orcamento) {
        ITENS_ORCAMENTO_PagingToolbar.setParamsJsonData(RetornaFiltros_ORCAMENTOS_JsonData(numero_orcamento));
        ITENS_ORCAMENTO_PagingToolbar.doRequest();
    }

    var wITENS_ORCAMENTO = new Ext.Window({
        layout: 'form',
        title: 'Itens do Or&ccedil;amento de Venda',
        iconCls: 'icone_PEDIDO_VENDA',
        width: 1050,
        height: 640,
        closable: false,
        draggable: true,
        collapsible: false,
        minimizable: true,
        resizable: false,
        modal: true,
        renderTo: Ext.getBody(),
        items: [label1, grid_ITENS_ORCAMENTO1, ITENS_ORCAMENTO_PagingToolbar.PagingToolbar()],
        listeners: {
            minimize: function (w) {
                w.hide();
            }
        }
    });

    function Carrega_dados_orcamento() {
        if (_TRABALHAR_COM_MARGEM_GROS == 1) {
            var html = "<table border='0'>";
            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Cliente: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt; width: 450px;'>" + _record_orcamento.data.NOMEFANTASIA_CLIENTE + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Margem GROS: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataPercentual(_record_orcamento.data.MARGEM_GROS) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Cond. Pagto.: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.COND_PAGTO + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Margem M&eacute;dia: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataPercentual(_record_orcamento.data.MARGEM_MEDIA) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Transportadora: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.NOME_TRANSP + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Total dos Produtos: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataValor(_record_orcamento.data.TOTAL_ORCAMENTO) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Vendedor(a): &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.NOME_VENDEDOR + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Total do Or&ccedil;amento: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataValor(parseFloat(_record_orcamento.data.TOTAL_ORCAMENTO) + parseFloat(_record_orcamento.data.TOTAL_IPI)) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Observa&ccedil;&otilde;es: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.OBS_NF_ORCAMENTO + "</td><td></td><td></td></tr></table>";
        }
        else {
            var html = "<table border='0'>";
            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Cliente: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt; width: 450px;'>" + _record_orcamento.data.NOMEFANTASIA_CLIENTE + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Margem M&eacute;dia: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataPercentual(_record_orcamento.data.MARGEM_MEDIA) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Cond. Pagto.: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.COND_PAGTO + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Total dos Produtos: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataValor(_record_orcamento.data.TOTAL_ORCAMENTO) + "</td></tr>";

            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Transportadora: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.NOME_TRANSP + "</td>";
            html += "<td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Total do Or&ccedil;amento: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + FormataValor(parseFloat(_record_orcamento.data.TOTAL_ORCAMENTO) + parseFloat(_record_orcamento.data.TOTAL_IPI)) + "</td></tr>";
            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Vendedor(a): &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.NOME_VENDEDOR + "</td><td></td><td></td></tr>";
            html += "<tr><td style='font-family: tahoma; font-size: 8pt; font-weight: bold; text-align: right;'>Observa&ccedil;&otilde;es: &nbsp;&nbsp;</td>";
            html += "<td style='font-family: tahoma; font-size: 9pt;'>" + _record_orcamento.data.OBS_NF_ORCAMENTO + "</td><td></td><td></td></tr></table>";
        }

        label1.setText(html, false);
    }

    this.show = function (objAnm) {
        Carrega_ITENS_ORCAMENTOs(_NUMERO_ORCAMENTO);
        wITENS_ORCAMENTO.show(objAnm);
        Carrega_dados_orcamento();
    };
}
