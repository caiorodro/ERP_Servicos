function JANELA_CERTIFICADOS() {
    var _acao;
    var _ID_PRODUTO;
    var _NUMERO_PEDIDO;
    var _NUMERO_ITEM;
    var _QTDE_PRODUTO;

    this.NUMERO_PEDIDO = function(pNUMERO_PEDIDO) {
        _NUMERO_PEDIDO = pNUMERO_PEDIDO;
    };

    this.NUMERO_ITEM = function(pNUMERO_ITEM) {
        _NUMERO_ITEM = pNUMERO_ITEM;
    };

    this.ID_PRODUTO = function(pID_PRODUTO) {
        _ID_PRODUTO = pID_PRODUTO;
    };

    this.QTDE_PRODUTO = function(pQTDE_PRODUTO) {
        _QTDE_PRODUTO = pQTDE_PRODUTO;
    };

    this.acao = function(pAcao) {
        _acao = pAcao;
    };

    var TB_CERTIFICADO_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        },
        ['ID_CERTIFICADO', 'MEDIDA', 'ID_MATERIAL', 'ID_PROPRIEDADE_MECANICA', 'ID_ACABAMENTO_SUPERFICIAL', 'NUMERO_LOTE',
        'NORMA_APLICAVEL', 'NUMERO_DESENHO', 'QTDE_PRODUTO', 'DESCRICAO_MATERIAL', 'DESCRICAO_ACABAMENTO', 'ID_PRODUTO_CERTIFICADO',
        'CLASSE_RESISTENCIA_GRAU', 'NUMERO_CERTIFICADO', 'NUMERO_NF', 'ID_PRODUTO_CERTIFICADO', 'CODIGO_PRODUTO_PEDIDO', 'NUMERO_ITEM_CERTIFICADO',
        'DATA_CERTIFICADO']
        )
    });

    var checkBoxSM = new Ext.grid.CheckboxSelectionModel();

    var gridCERTIFICADO = new Ext.grid.GridPanel({
        tbar: [{
            id: 'BTN_SUGESTAO_CERTIFICADO',
            text: 'Gravar sugest&atilde;o para novo(s) certificado(s)',
            icon: 'imagens/icones/database_save_16.gif',
            scale: 'small',
            handler: function() {
                Grava_Sugestao_Certificados();
            }
}],
            store: TB_CERTIFICADO_Store,
            columns: [
        checkBoxSM,
        { id: 'NUMERO_CERTIFICADO', header: "Nº Certificado", width: 110, sortable: true, dataIndex: 'NUMERO_CERTIFICADO' },
        { id: 'DATA_CERTIFICADO', header: "Emiss&atilde;o", width: 90, sortable: true, dataIndex: 'DATA_CERTIFICADO', renderer: XMLParseDate },
        { id: 'CODIGO_PRODUTO_PEDIDO', header: "C&oacute;d. Produto", width: 150, sortable: true, dataIndex: 'CODIGO_PRODUTO_PEDIDO' },
        { id: 'DESCRICAO_MATERIAL', header: "Material", width: 220, sortable: true, dataIndex: 'DESCRICAO_MATERIAL' },
        { id: 'CLASSE_RESISTENCIA_GRAU', header: "Clas. Resist&ecirc;ncia (Grau)", width: 160, sortable: true, dataIndex: 'CLASSE_RESISTENCIA_GRAU', align: 'center' },
        { id: 'DESCRICAO_ACABAMENTO', header: "Acabamento", width: 150, sortable: true, dataIndex: 'DESCRICAO_ACABAMENTO', align: 'center' },
        { id: 'NUMERO_LOTE', header: "Nº Lote", width: 110, sortable: true, dataIndex: 'NUMERO_LOTE', align: 'center' },
        { id: 'NORMA_APLICAVEL', header: "Norma Aplic&aacute;vel", width: 130, sortable: true, dataIndex: 'NORMA_APLICAVEL' },
        { id: 'NUMERO_DESENHO', header: "Nº Desenho", width: 110, sortable: true, dataIndex: 'NUMERO_DESENHO', align: 'center' },
        { id: 'QTDE_PRODUTO', header: "Qtde. do Produto", width: 110, sortable: true, dataIndex: 'QTDE_PRODUTO', align: 'center', renderer: FormataQtde },
        { id: 'NUMERO_NF', header: "N&ordm; NF", width: 100, sortable: true, dataIndex: 'NUMERO_NF', align: 'center' },
        { id: 'NUMERO_ITEM_CERTIFICADO', header: "N&ordm; Item", width: 100, sortable: true, dataIndex: 'NUMERO_ITEM_CERTIFICADO', align: 'center'}],
            stripeRows: true,
            height: 421,
            width: '100%',

            sm: checkBoxSM
        });

        var ITENS_PEDIDO_PagingToolbar = new Th2_PagingToolbar();

        ITENS_PEDIDO_PagingToolbar.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/Busca_Ultimos_Certificados_do_Produto');
        ITENS_PEDIDO_PagingToolbar.setStore(TB_CERTIFICADO_Store);

        function RetornaFiltros_PEDIDOS_JsonData() {
            var TB_TRANSP_JsonData = {
                ID_PRODUTO: _ID_PRODUTO,
                ID_USUARIO: _ID_USUARIO,
                start: 0,
                limit: ITENS_PEDIDO_PagingToolbar.getLinhasPorPagina()
            };

            return TB_TRANSP_JsonData;
        }

        function Carrega_Ultimos_Certificados() {
            ITENS_PEDIDO_PagingToolbar.setParamsJsonData(RetornaFiltros_PEDIDOS_JsonData());
            ITENS_PEDIDO_PagingToolbar.doRequest();
        }

        var wULTIMOS_CERTIFCADOS = new Ext.Window({
            layout: 'form',
            title: 'Ultimos Certificados do Produto',
            iconCls: 'icone_CERTIFICADO',
            width: 1180,
            height: 'auto',
            closable: false,
            draggable: true,
            collapsible: false,
            minimizable: true,
            resizable: false,
            modal: true,
            renderTo: Ext.getBody(),
            items: [gridCERTIFICADO, ITENS_PEDIDO_PagingToolbar.PagingToolbar()],

            listeners: {
                minimize: function(w) {
                    w.hide();
                }
            }
        });

        function Grava_Sugestao_Certificados() {

            if (gridCERTIFICADO.getSelectionModel().selections.length == 0) {
                dialog.MensagemDeErro('Selecione um ou mais certificados para gravar o(s) novo(s) certificado(s)', 'BTN_SUGESTAO_CERTIFICADO');
                return;
            }

            var arrCertificados = new Array();

            for (var i = 0; i < gridCERTIFICADO.getSelectionModel().selections.length; i++) {
                var record = gridCERTIFICADO.getSelectionModel().selections.items[i];

                arrCertificados[i] = record.data.ID_CERTIFICADO;
            }

            var _ajax = new Th2_Ajax();
            _ajax.setUrl('servicos/TB_CERTIFICADO_PRODUTO.asmx/Grava_Sugestao_Certificados');
            _ajax.setJsonData({
                NUMERO_PEDIDO_VENDA: _NUMERO_PEDIDO,
                NUMERO_ITEM_VENDA: _NUMERO_ITEM,
                QTDE_PRODUTO: _QTDE_PRODUTO,
                IDS_CERTIFICADO: arrCertificados,
                ID_USUARIO: _ID_USUARIO
            });

            var _sucess = function(response, options) {
                if (_acao)
                    _acao();

                wULTIMOS_CERTIFCADOS.hide();
            };

            _ajax.setSucesso(_sucess);
            _ajax.Request();
        }

        this.show = function(objAnm) {
            wULTIMOS_CERTIFCADOS.show(objAnm);
            Carrega_Ultimos_Certificados();
        };
    }