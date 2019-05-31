function Matriz_Pedido_Venda() {

    var TXT_MATRIZ_PRIMEIRA_PAGINA = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: 500,
        allowBlank: false,
        hideLabel: true
    });

    var TXT_MATRIZ_PROXIMA_PAGINA = new Ext.form.HtmlEditor({
        width: '100%',
        anchor: '100%',
        height: 500,
        allowBlank: false,
        hideLabel: true
    });

    var TB_MATRIZ_PEDIDO_TP = new Ext.TabPanel({
        deferredRender: false,
        activeTab: 0,
        items: [{
            title: 'Formato da Primeira P&aacute;gina',
            closable: false,
            autoScroll: false,
            iconCls: 'icone_MATRIZ_ORCAMENTO1',
            layout: 'form',
            items: [TXT_MATRIZ_PRIMEIRA_PAGINA]
        }, {
            title: 'Formato das demais P&aacute;ginas',
            closable: false,
            autoScroll: false,
            layout: 'form',
            iconCls: 'icone_MATRIZ_ORCAMENTO2'
}],
            listeners: {
                tabchange: function(tabPanel, panel) {
                    if (panel.title == 'Formato das demais P&aacute;ginas') {
                        if (panel.items.length == 0) {
                            panel.add(TXT_MATRIZ_PROXIMA_PAGINA);
                            panel.doLayout();
                        }
                    }
                }
            }
        });

        var buttonGroup_MATRIZ = new Ext.ButtonGroup({
            items: [{
                text: 'Salvar',
                icon: 'imagens/icones/database_save_24.gif',
                scale: 'medium',
                handler: function() {
                    var _ajax = new Th2_Ajax();
                    _ajax.setUrl(TB_MATRIZ_PEDIDO_TP.activeTab.title == 'Formato da Primeira P&aacute;gina' ?
                        'servicos/TB_PEDIDO_VENDA.asmx/Salva_Matriz_Primeira_Pagina' :
                        'servicos/TB_PEDIDO_VENDA.asmx/Salva_Matriz_Proximas_Paginas');

                    _ajax.setJsonData({
                        HTML: TB_MATRIZ_PEDIDO_TP.activeTab.title == 'Formato da Primeira P&aacute;gina' ?
                            TXT_MATRIZ_PRIMEIRA_PAGINA.getRawValue() :
                            TXT_MATRIZ_PROXIMA_PAGINA.getRawValue(),
                        ID_USUARIO: _ID_USUARIO
                    });

                    var _sucess = function(response, options) {

                    };

                    _ajax.setSucesso(_sucess);
                    _ajax.Request();
                }
}]
            });

            var toolbar_MATRIZ = new Ext.Toolbar({
                style: 'text-align: right;',
                items: [buttonGroup_MATRIZ]
            });

            var formMatrizPedido = new Ext.form.FormPanel({
                labelAlign: 'top',
                bodyStyle: 'padding:5px 2px 0px 0px',
                frame: true,
                width: '100%',
                autoHeight: true,
                items: [TB_MATRIZ_PEDIDO_TP]
            });

            var panelMatrizPedido = new Ext.Panel({
                width: '100%',
                border: true,
                title: 'Matriz de Impress&atilde;o de Pedido de Venda',
                items: [formMatrizPedido, toolbar_MATRIZ]
            });

            TXT_MATRIZ_PRIMEIRA_PAGINA.setHeight(AlturaDoPainelDeConteudo(156));
            TXT_MATRIZ_PROXIMA_PAGINA.setHeight(AlturaDoPainelDeConteudo(156));

            function Busca_Primeira_Pagina() {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Matriz_Primeira_Pagina');
                _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;

                    TXT_MATRIZ_PRIMEIRA_PAGINA.setValue(result);
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            function Busca_Proximas_Paginas() {
                var _ajax = new Th2_Ajax();
                _ajax.setUrl('servicos/TB_PEDIDO_VENDA.asmx/Matriz_Proximas_Paginas');
                _ajax.setJsonData({ ID_USUARIO: _ID_USUARIO });

                var _sucess = function(response, options) {
                    var result = Ext.decode(response.responseText).d;

                    TXT_MATRIZ_PROXIMA_PAGINA.setValue(result);
                };

                _ajax.setSucesso(_sucess);
                _ajax.Request();
            }

            Ext.onReady(function() {
                Busca_Primeira_Pagina();
                Busca_Proximas_Paginas();
            });

            return panelMatrizPedido;
        }