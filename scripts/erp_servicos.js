var _VENDEDOR;
var _ID_VENDEDOR;
var _GERENTE_COMERCIAL;
var _url;
var _ID_USUARIO;
var _GERENTE_COMPRAS;
var _ID_EMPRESA;
var _webMail;
var _ADMIN_USUARIO;
var _record_conta_email;
var _EMAIL_APRESENTACAO;
var _EMITENTE;
var _TRABALHAR_COM_MARGEM_GROS;
var _PASTA_VIRTUAL_DMZ;
var _PASTA_VIRTUAL_EXTERNA_DMZ;
var _PASTA_FISICA_ANEXOS;
var _NOME_EMITENTE;
var _UF_EMITENTE;
var _CNPJ_EMITENTE;
var _LOGIN_USUARIO;
var _SERIE;
var _ENDERECO_EMITENTE;
var _NUMERO_EMITENTE;
var _COMPL_EMITENTE;
var _CEP_EMITENTE;
var _CIDADE_EMITENTE;
var _ESTADO_EMITENTE;

function Mantem_Sessao() {
    var novos_emails = Ext.getCmp('VERIFICAR_NOVOS_EMAILS').getValue();

    if (parseInt(novos_emails) > 0) {
        var t = setTimeout("VerificaNovasMensagens()", ((parseInt(novos_emails) * 60) * 1000)); // 1 minuto    
    }
}

function VerificaNovasMensagens() {
    if (_record_conta_email) {
        if (_acaoRecebeMensagens) {
            _acaoRecebeMensagens();
        }
    }
}

function Encerra_Sessao() {
    var tabs = Ext.getCmp('tabConteudo');

    for (var i = 0; i < tabs.items.length; i++) {
        var tab = tabs.items.items[i];

        if (tab.closable) {
            tabs.remove(tab, true);
            i--;
        }
    }

    tabs.setActiveTab(0);

    _webMail.resetaStoreGrid();
    _webMail.resetaPagingToolbar();
    _webMail.resetaRemetente();

    Ext.getCmp('wLogin').show();
    Ext.getCmp('frmLogin').getForm().reset();
}

function Executa_Logoff() {
    var tabs = Ext.getCmp('tabConteudo');

    for (var i = 0; i < tabs.items.length; i++) {
        var tab = tabs.items.items[i];

        if (tab.closable) {
            tabs.remove(tab, true);
            i--;
        }
    }

    tabs.setActiveTab(0);

    _webMail.resetaStoreGrid();
    _webMail.resetaPagingToolbar();
    _webMail.resetaRemetente();

    Ext.getCmp('wLogin').show();
    Ext.getCmp('frmLogin').getForm().reset();
    Ext.getCmp('frmLogin').getForm().findField('login').setValue(_LOGIN_USUARIO);
}

function CriaEConfiguraNovaTab(n, nLeaf, _panel, _closeAble) {
    var _aba = n.attributes ? n.attributes.text : n;
    var _leaf = (n.leaf || nLeaf) ? true : false;

    var novaTab = Ext.getCmp('tabConteudo');
    var tabExistente = false;

    for (var i = 0; i < novaTab.items.length; i++) {
        if (novaTab.items.items[i].title == _aba) {
            tabExistente = true;
            novaTab.setActiveTab(i);
        }
    }

    if (!tabExistente) {
        var tela = "";
        var iconeTab = "";
        var closeAble = _closeAble == true || _closeAble == false ? _closeAble : true;

        if (_aba == "Clientes") {
            tela = MontaCadastroCLIENTE();
            iconeTab = 'icone_TB_CLIENTE';
        }

        if (_aba == "Usu&aacute;rios do Sistema") {
            tela = MontaCadastroUsuarios();
            iconeTab = 'icone_TB_USUARIO';
        }

        if (_aba == "Auditoria de Uso") {
            tela = MontaPanelAuditoria();
            iconeTab = 'icone_AUDITORIA';
        }

        if (_aba == "Log de Erros") {
            tela = MontaPanelErros();
            iconeTab = 'icone_LOGERROS';
        }

        if (_aba == "Condi&ccedil;&atilde;o de Pagamento") {
            tela = MontaCadastroCondPagto();
            iconeTab = 'icone_TB_COND_PAGTO';
        }

        if (_aba == "Custos de Venda") {
            tela = MontaCadastroCusto();
            iconeTab = 'icone_TB_CUSTO_VENDA';
        }

        if (_aba == "Matriz de Or&ccedil;amentos") {
            tela = Matriz_Orcamento();
            iconeTab = 'icone_TB_MATRIZ_ORCAMENTO';
        }

        if (_aba == "Matriz de Servi&ccedil;os") {
            tela = Matriz_Pedido_Venda();
            iconeTab = 'icone_TB_MATRIZ_ORCAMENTO';
        }

        if (_aba == "Ciclistas") {
            tela = MontaCadastroCiclista();
            iconeTab = 'icone_TRANSF_ESTOQUE';
        }

        if (n.attributes.text == "Empresa / Filial") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaCadastroEmpresa();
            iconeTab = 'icone_TB_EMITENTE';
        }

        if (_aba == "Limite de Cr&eacute;dito") {
            tela = MontaCadastroLimite();
            iconeTab = 'icone_TB_LIMITE';
        }

        if (_aba == "Vendedores") {
            tela = MontaCadastroVendedores();
            iconeTab = 'icone_TB_VENDEDOR';
        }

        if (_aba == "Estat&iacute;sticas de Compras") {
            Ext.getCmp('west-panel').collapse();
            tela = Estatisticas_Qualidade_Compras();
            iconeTab = 'icone_ESTATISTICAS_QUALIDADE';
        }

        if (_aba == "Servi&ccedil;os") {
            tela = MontaCadastroServicos();
            iconeTab = 'icone_TB_PRODUTO';
        }

        if (_aba == "Banco") {
            tela = MontaCadastroBanco();
            iconeTab = 'icone_TB_PRODUTO';
        }

        if (n.attributes.text == "Conta Corrente") {
            tela = MontaCadastroContaCorrente();
            iconeTab = 'icone_CONTA_CORRENTE';
        }

        if (_aba == "Notas fiscais") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaTelaNotasFiscaisSaida();
            iconeTab = 'icone_TB_ORCAMENTO2';
        }

        if (_aba == "Direitos por Usu&aacute;rio") {
            tela = MontaCadastroAcessos();
            iconeTab = 'icone_TB_ACESSO';
        }

        if (_aba == "Status de Servi&ccedil;o X Usu&aacute;rio") {
            tela = MontaCadastroStatusUsuario();
            iconeTab = 'icone_TB_STATUS_PEDIDO_USUARIO';
        }

        if (_aba == "Or&ccedil;amento de Venda") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaCadastroItemOrcamento();
            iconeTab = 'icone_TB_ORCAMENTO2';
        }

        if (_aba == "Status de Servi&ccedil;o") {
            tela = MontaCadastroStatus();
            iconeTab = 'icone_TB_STATUS_PEDIDO';
        }

        if (_aba == "Regi&atilde;o de Vendas") {
            tela = MontaCadastroRegiao();
            iconeTab = 'icone_TB_REGIAO';
        }

        if (_aba == "Relat&oacute;rio de Vendas") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaRelatorioVendas();
            iconeTab = 'icone_RELATORIO_VENDAS';
        }

        if (n.attributes.text == "Contas a Pagar / Receber") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaFinanceiro();
            iconeTab = 'icone_TB_FINANCEIRO';
        }

        if (n.attributes.text == "Plano de Contas") {
            tela = RetornaLayoutCadastroPlanoContas();
            iconeTab = 'icone_PLANO_CONTAS';
        }

        if (_aba == "Cota&ccedil;&otilde;es") {
            Ext.getCmp('west-panel').collapse();
            tela = Monta_Cotacao_Fornecedor();
            iconeTab = 'icone_TB_COTACAO';
        }

        if (_aba == "Status de Pedido de Compra") {
            tela = MontaCadastroStatus_Compra();
            iconeTab = 'icone_STATUS_COMPRA';
        }

        if (_aba == "Pedido de Compra") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaCadastroItemCompra();
            iconeTab = 'icone_PEDIDO_COMPRA';
        }

        if (_aba == "Sugest&atilde;o de Compras") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaSugestaoCompra();
            iconeTab = 'icone_TB_CLIENTE_DADOS_GERAIS';
        }

        if (_aba == "Compras atrasadas") {
            Ext.getCmp('west-panel').collapse();
            tela = Compras_Atrasadas();
            iconeTab = 'icone_COMPRAS_ATRASADAS';
        }

        if (_aba == "Ultimas Vendas/Compras") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaUltimasVendas();
            iconeTab = 'icone_ULTIMAS_VENDAS';
        }

        if (_aba == "Estat&iacute;sticas / Qualidade") {
            Ext.getCmp('west-panel').collapse();
            tela = Estatisticas_Qualidade_Vendas();
            iconeTab = 'icone_ESTATISTICAS_QUALIDADE';
        }

        if (_aba == "Posi&ccedil;&otilde;es Financeiras") {
            Ext.getCmp('west-panel').collapse();
            tela = MontaTitulosVencidos();
            iconeTab = 'icone_TITULOSVENCIDOS';
        }

        if (_aba == "Matriz (Pedido de Compra)") {
            Ext.getCmp('west-panel').collapse();
            tela = Matriz_Pedido_Compra();
            iconeTab = 'icone_TB_MATRIZ_ORCAMENTO';
        }

        if (_aba == "Configura&ccedil;&otilde;es de Vendas") {
            tela = MontaTelaConfigVendas();
            iconeTab = 'icone_CONFIG_VENDAS';
        }

        if (_aba == "Auditoria de Servi&ccedil;os") {
            tela = MontaAuditoriaPedidoVenda();
            iconeTab = 'icone_AUDITORIA';
        }

        if (_aba == "Servi&ccedil;os de Vendas") {
            Ext.getCmp('west-panel').collapse();
            tela = Monta_Pedido_Venda();
            iconeTab = 'icone_PEDIDO_VENDA';
        }

        var _aba1 = true;

        if (_aba == "Lista de contas") {
            _aba1 = false;
            tela = new Relatorio_Centro_Custo();
            tela.show('formTh2');
        }

        if (_aba == "Calend&aacute;rio") {
            Ext.getCmp('west-panel').collapse();
            tela = Calendario();
            iconeTab = 'icone_TB_FERIADO';
        }

        if (_leaf && _aba1) {
            novaTab.add({
                title: _aba,
                closable: closeAble,
                autoScroll: true,
                autoDestroy: true,
                items: tela,
                iconCls: iconeTab
            });

            novaTab.setActiveTab(novaTab.items.length - 1);
        }
    }
}

var _USUARIO_ORDEM_COMPRA;
var _USUARIO_ADMIN_COMPRAS;
var _GERENTE_COMERCIAL;

Ext.onReady(function () {

    _webMail = new Doran_Web_Mail();

    var formTh2 = new Ext.form.FormPanel({
        id: 'formTh2',
        bodyStyle: 'padding:10px 5px 0; background-color: #000040; border-width: 0px;',
        frame: true,
        width: '100%',
        anchor: '100%',
        height: 65,
        layout: 'column',
        items: [{
            columnWidth: 0.40,
            layout: 'form',
            items: [{
                xtype: 'box',
                autoEl: {
                    tag: 'img',
                    src: 'imagens/logo2.png',
                    height: 28,
                    width: 144
                }
            }]
        }, {
            columnWidth: 0.07,
            layout: 'form',
            items: [{
                xtype: 'box',
                autoEl: {
                    tag: 'img',
                    src: 'imagens/logo_fath2_2.png',
                    height: 33,
                    width: 80
                }
            }]
        }, {
            columnWidth: 0.41,
            layout: 'form',
            items: [{
                id: 'LBL_TITULO',
                xtype: 'label',
                text: 'Módulo de Vendas',
                style: 'font-family: Tahoma; font-size: 10pt; color: #ffffff; vertical-align: bottom;',
                listeners: {
                    afterrender: function (l) {
                        l.setText('<br /> - M&oacute;dulo de Vendas', false);
                    }
                }
            }]
        }, {
            columnWidth: 0.12,
            layout: 'form',
            items: [{
                xtype: 'panel',
                id: 'panelLogoff'
            }]
        }]
    });

    var htmlCabecalhoBoasVindas = "<table width='100%' height='55' border='0' cellpadding='0' cellspacing='0' background='imagens/bg.jpg' bgcolor='000040'>" +
                      "<tr>" +
                        "<td width='127' valign='middle'><img src='imagens/logoDoran2.gif' width='169' height='51'></td>" +
                        "<td width='25' align='center' valign='middle'><img src='imagens/fio.gif' width='1' height='45' /></td>" +
                        "<td width='235' align='left' valign='bottom' background='imagens/tranparencia.gif'><span style='font-family: Tahoma; font-size: 10pt; color: whitesmoke;'>Doran דורן vers&atilde;o 3.5011</span></td>" +
                        "<td align='center' valign='middle' background='imagens/tranparencia.gif'><table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                        "<tr>" +
                            "<td align='right'><div id='divLogoff'></div></td>" +
                            "<td width='10' align='right'>&nbsp;</td>" +
                          "</tr>" +
                        "</table></td>" +
                      "</tr>" +
                    "</table>";

    var viewport = new Ext.Viewport({
        layout: 'border',
        id: 'viewport',
        items: [
                            new Ext.BoxComponent({
                                region: 'north',
                                height: 55,
                                autoEl: { tag: 'div', html: htmlCabecalhoBoasVindas }
                            }), {
                                region: 'west',
                                id: 'west-panel',
                                title: 'M&oacute;dulo de Vendas',
                                split: true,
                                width: 205,
                                minSize: 175,
                                maxSize: 400,
                                collapsible: true,
                                collapsed: true,
                                margins: '0 0 0 5',
                                layout: {
                                    type: 'accordion',
                                    animate: true
                                },
                                items: [{
                                    contentEl: 'west',
                                    collapsed: true,
                                    title: 'Cadastros',
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treeCadastros]
                                }, {
                                    title: 'Or&ccedil;amentos',
                                    collapsed: true,
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treeOrcamentos]
                                }, {
                                    collapsed: true,
                                    title: 'Vendas',
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treePedidos]
                                }, {
                                    collapsed: true,
                                    title: 'Financeiro',
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treeFinanceiro]
                                }, {
                                    collapsed: true,
                                    title: 'Compras',
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treeCompras]
                                }, {
                                    collapsed: true,
                                    title: 'Configura&ccedil;&otilde;es',
                                    border: false,
                                    iconCls: 'navFaTh2',
                                    items: [treeConfig]
                                }, {
                                    collapsed: true,
                                    title: 'Auditoria',
                                    border: true,
                                    iconCls: 'navFaTh2',
                                    items: [treeAuditoria]
                                }]
                            },
            new Ext.TabPanel({
                id: 'tabConteudo',
                region: 'center',
                deferredRender: false,
                enableTabScroll: true,
                activeTab: 0,
                items: [{
                    title: 'Doran Webmail',
                    closable: false,
                    autoScroll: true,
                    iconCls: 'icone_BoasVindas',
                    items: [_webMail.panelEmail()]
                }]
            })]
    });

    Ext.get("hideit").on('click', function () {
        var w = Ext.getCmp('west-panel');
        w.collapsed ? w.expand() : w.collapse();
    });

    var btnLogoff = new Ext.Button({
        id: 'btnLogoff',
        text: 'Logoff',
        icon: 'imagens/icones/user_down_24.gif',
        scale: 'medium',
        renderTo: Ext.get('divLogoff'),
        handler: function () {
            Executa_Logoff();
        }
    });

    var a = document.URL.split("//");
    a = (a[1] ? a[1] : a[0]).split("/");
    _url = a.join("\n");

    wLogin.show();
});

// Cadastros

var treeCadastros = new Ext.tree.TreePanel({
    id: 'treeCadastros',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Ciclistas',
            leaf: true,
            icon: 'imagens/icones/data_transport_config_16.gif'
        }, {
            text: 'Clientes',
            leaf: true,
            icon: 'imagens/icones/admin_16.gif'
        }, {
            text: 'Condi&ccedil;&atilde;o de Pagamento',
            leaf: true,
            icon: 'imagens/icones/insert_row_16.gif'
        }, {
            text: 'Custos de Venda',
            leaf: true,
            icon: 'imagens/icones/calculator_add_16.gif'
        }, {
            text: 'Empresa / Filial',
            leaf: true,
            icon: 'imagens/icones/oracle_info_16.gif'
        }, {
            text: 'Limite de Cr&eacute;dito',
            leaf: true,
            icon: 'imagens/icones/caution_16.gif'
        }, {
            text: 'Regi&atilde;o de Vendas',
            leaf: true,
            icon: 'imagens/icones/atom_fav_16.gif'
        }, {
            text: 'Servi&ccedil;os',
            leaf: true,
            icon: 'imagens/icones/info_16.gif'
        }, {
            text: 'Status de Servi&ccedil;o',
            leaf: true,
            icon: 'imagens/icones/entity_relation_16.gif'
        }, {
            text: 'Status de Servi&ccedil;o X Usu&aacute;rio',
            leaf: true,
            icon: 'imagens/icones/entity_relation_lock_16.gif'
        }, {
            text: 'Vendedores',
            leaf: true,
            icon: 'imagens/icones/chat_16.gif'
        }, {
            text: 'Calend&aacute;rio',
            leaf: true,
            icon: 'imagens/icones/calendar_fav_16.gif'
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            CriaEConfiguraNovaTab(n);
        }
    }
});

var treeOrcamentos = new Ext.tree.TreePanel({
    id: 'treeOrcamentos',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Or&ccedil;amento de Venda',
            leaf: true,
            icon: 'imagens/icones/write_16.gif'
        }, {
            text: 'Matriz de Or&ccedil;amentos',
            leaf: true,
            icon: 'imagens/icones/notepad_star_16.gif'
        }, {
            text: 'Estat&iacute;sticas',
            leaf: true,
            icon: 'imagens/icones/system_16.gif'
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            CriaEConfiguraNovaTab(n);
        }
    }
});

var treePedidos = new Ext.tree.TreePanel({
    id: 'treePedidos',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Servi&ccedil;os de Vendas',
            leaf: true,
            icon: 'imagens/icones/copy_level_16.gif'
        }, {
            text: 'Estat&iacute;sticas / Qualidade',
            leaf: true,
            icon: 'imagens/icones/statistic_config_16.gif'
        }, {
            text: 'Auditoria de Servi&ccedil;os',
            leaf: true,
            icon: 'imagens/icones/insert_table_save_16.gif'
        }, {
            text: 'Matriz de Servi&ccedil;os',
            leaf: true,
            icon: 'imagens/icones/notepad_star_16.gif'
        }, {
            text: 'Relat&oacute;rio de Vendas',
            leaf: true,
            icon: 'imagens/icones/system_reload_16.gif'
        }, {
            text: 'Notas fiscais',
            leaf: true,
            icon: 'imagens/icones/write_16.gif'
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            CriaEConfiguraNovaTab(n);
        }
    }
});

var treeFinanceiro = new Ext.tree.TreePanel({
    id: 'treeFinanceiro',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Contas a Pagar / Receber',
            leaf: true,
            icon: 'imagens/icones/calculator_ok_16.gif'
        }, {
            text: 'Plano de Contas',
            leaf: true,
            icon: 'imagens/icones/attach_config_16.gif'
        }, {
            text: 'Banco',
            leaf: true,
            icon: 'imagens/icones/e_commerce_16.png'
        }, {
            text: 'Conta Corrente',
            leaf: true,
            icon: 'imagens/icones/mssql_16.gif'
        }, {
            text: 'Relat&oacute;rios',
            icon: 'imagens/icones/file_16.gif',
            expanded: true,
            children: [{
                text: 'Posi&ccedil;&otilde;es Financeiras',
                leaf: true,
                icon: 'imagens/icones/admin_remove_16.gif'
            }]
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            CriaEConfiguraNovaTab(n);
        }
    }
});

var treeCompras = new Ext.tree.TreePanel({
    id: 'treeCompras',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Status de Pedido de Compra',
            leaf: true,
            icon: 'imagens/icones/entity_relation_next_16.gif'
        }, {
            text: 'Cota&ccedil;&otilde;es',
            leaf: true,
            icon: 'imagens/icones/paste_16.gif'
        }, {
            text: 'Pedido de Compra',
            leaf: true,
            icon: 'imagens/icones/copy_reload_16.gif'
        }, {
            text: 'Ultimas Vendas/Compras',
            leaf: true,
            icon: 'imagens/icones/dollar_16.png'
        }, {
            text: 'Estat&iacute;sticas de Compras',
            leaf: true,
            icon: 'imagens/icones/statistic_config_16.gif'
        }, {
            text: 'Matriz (Pedido de Compra)',
            leaf: true,
            icon: 'imagens/icones/notepad_star_16.gif'
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            util.IniciaSolicitacao();
            CriaEConfiguraNovaTab(n);
            util.FinalizaSolicitacao();
        }
    }
});

var treeConfig = new Ext.tree.TreePanel({
    id: 'treeConfig',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Direitos por Usu&aacute;rio',
            leaf: true,
            icon: 'imagens/icones/group_ok_16.gif'
        }, {
            text: 'Configura&ccedil;&otilde;es de Vendas',
            leaf: true,
            icon: 'imagens/icones/tool_config_16.gif'
        }
    ]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            util.IniciaSolicitacao();
            CriaEConfiguraNovaTab(n);
            util.FinalizaSolicitacao();
        }
    }
});

var treeAuditoria = new Ext.tree.TreePanel({
    id: 'treeAuditoria',
    border: false,
    useArrows: true,
    shadow: true,
    width: 'auto',
    autoScroll: true,
    split: true,
    cls: 'Th2Menu',
    loader: new Ext.tree.TreeLoader(),
    root: new Ext.tree.AsyncTreeNode({
        expanded: true,
        children: [{
            text: 'Auditoria de Uso',
            leaf: true,
            icon: 'imagens/icones/insert_table_save_16.gif'
        }, {
            text: 'Log de Erros',
            leaf: true,
            icon: 'imagens/icones/database_delete_16.gif'
        }]
    }),
    rootVisible: false,
    listeners: {
        click: function (n) {
            util.IniciaSolicitacao();
            CriaEConfiguraNovaTab(n);
            util.FinalizaSolicitacao();
        }
    }
});

/////////////////// Login

function BuscaEmpresaUsuario(LOGIN_USUARIO) {
    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/WSLogin.asmx/BuscaEmpresaUsuario');
    _ajax.setJsonData({ LOGIN_USUARIO: LOGIN_USUARIO });
    _ajax.ExibeDivProcessamento(false);

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        Ext.getCmp('ID_EMPRESA_LOGIN').setValue(result.CODIGO_EMITENTE);

        result.ADMIN_USUARIO == 0 ? Ext.getCmp('ID_EMPRESA_LOGIN').disable() : Ext.getCmp('ID_EMPRESA_LOGIN').enable();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

var frmLogin = new Ext.FormPanel({
    id: 'frmLogin',
    labelWidth: 75,
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    width: '100%',

    items: [{
        xtype: 'panel',
        height: 67,
        width: '100%',
        html: "<img src='imagens/logo-doran-transp.gif' />"
    },
    {
        xtype: 'fieldset',
        checkboxToggle: false,
        title: 'Login - Acesso ao Sistema',
        autoHeight: true,
        defaults: { width: 150 },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Login',
            id: 'login',
            name: 'login',
            allowBlank: false,
            blankText: 'Informe o seu login',
            maxLength: 15,
            autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '15' },
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.TAB) {
                        BuscaEmpresaUsuario(f.getValue());
                    }

                    if (e.getKey() == e.ENTER) {
                        BuscaEmpresaUsuario(f.getValue());
                        Ext.getCmp('senha').focus();
                    }
                }
            }
        }, {
            fieldLabel: 'Senha',
            id: 'senha',
            name: 'senha',
            allowBlank: false,
            blankText: 'Informe a sua senha',
            inputType: 'password',
            maxLength: 15,
            autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: '15' },
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        if (!frmLogin.getForm().isValid())
                            dialog.MensagemDeErro('Preencha os campos de Login e Senha');
                        else {
                            fnValidaLogin();
                        }
                    }
                    if (e.getKey() == e.TAB) {
                        BuscaEmpresaUsuario(f.getValue());
                    }
                }
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Empresa',
            id: 'ID_EMPRESA_LOGIN',
            name: 'ID_EMPRESA_LOGIN',
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
            msgTarget: 'side',
            store: combo_TB_EMITENTE_STORE,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        if (!frmLogin.getForm().isValid())
                            dialog.MensagemDeErro('Preencha os campos de Login e Senha. A Empresa deve estar selecionada');
                        else {
                            fnValidaLogin();
                        }
                    }
                }
            }
        }
            ]
    }, {
        xtype: 'fieldset',
        id: 'fsAlterarSenha',
        title: 'Alteração de senha',
        collapsible: true,
        collapsed: true,
        defaultType: 'textfield',
        animCollapse: true,

        items: [{
            fieldLabel: 'Senha Atual',
            name: 'senhaAtual',
            blankText: 'Informe a sua senha atual',
            inputType: 'password',
            autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: '15' }
        }, {
            fieldLabel: 'Nova Senha',
            name: 'novaSenha',
            blankText: 'Informe a nova senha',
            inputType: 'password',
            autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: '15' }
        }, {
            fieldLabel: 'Confirme a Nova Senha',
            name: 'novaSenha2',
            blankText: 'Repita a senha digitada no campo anterior',
            inputType: 'password',
            autoCreate: { tag: 'input', type: 'password', autocomplete: 'off', maxlength: '15' }
        }],
        buttons: [{
            text: 'Alterar Senha',
            cls: 'x-btn-text-icon',
            scale: 'medium',
            iconAlign: 'left',
            icon: '/imagens/icones/administrator_refresh_24.gif',
            handler: function () {
                util.IniciaSolicitacao();

                // Dictionary
                var dados = {
                    vLogin: frmLogin.getForm().findField('login').getValue(),
                    vSenhaAtual: frmLogin.getForm().findField('senhaAtual').getValue(),
                    vNovaSenha: frmLogin.getForm().findField('novaSenha').getValue(),
                    vNovaSenha2: frmLogin.getForm().findField('novaSenha2').getValue()
                };

                Ext.Ajax.request({
                    url: 'servicos/WSLogin.asmx/alteraSenha',
                    method: 'POST',
                    jsonData: { dados: dados },
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    success: function (response, options) {
                        var result = Ext.decode(response.responseText).d;

                        util.FinalizaSolicitacao();

                        if (result) {
                            Ext.getCmp('fsAlterarSenha').collapse();
                            dialog.MensagemDeAlerta('A sua senha foi atualizada com sucesso');
                        }

                        util.FinalizaSolicitacao();
                    },
                    failure: function (response, options) {
                        util.FinalizaSolicitacao();

                        var erro = Ext.decode(response.responseText);
                        dialog.MensagemDeErro(erro.Message);
                    }
                });
            }
        }]
    }],

    buttons: [{
        text: 'Ok',
        cls: 'x-btn-text-icon',
        scale: 'medium',
        iconAlign: 'left',
        icon: '/imagens/icones/administrator_ok_24.gif',

        handler: function () {
            fnValidaLogin();
        }
    }]
});

var wLogin = new Ext.Window({
    id: 'wLogin',
    title: '&nbsp;&nbsp;Doran ERP Software - M&oacute;dulo de servi&ccedil;os',
    width: 385,
    iconCls: 'icone_Th2',
    autoHeight: true,
    closable: false,
    draggable: true,
    resizable: false,
    items: [frmLogin],
    modal: true,
    renderTo: Ext.getBody()
});

function fnValidaLogin() {
    if (!frmLogin.getForm().isValid()) {
        return;
    }

    // Dictionary
    var dados = {
        vLogin: frmLogin.getForm().findField('login').getValue(),
        vSenha: frmLogin.getForm().findField('senha').getValue(),
        URL: _url,
        ID_EMPRESA: Ext.getCmp('ID_EMPRESA_LOGIN').getValue()
    };

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/WSLogin.asmx/validaLogin');
    _ajax.setJsonData({ dados: dados });

    var _sucess = function (response, options) {
        wLogin.hide();
        Ext.getCmp('btnLogoff').setText('Logoff - ' + dados['vLogin'].toUpperCase());

        var result = Ext.decode(response.responseText).d;

        Th2_LimiteDeLinhasPaginacao = result.NRO_LINHAS_GRID;
        _timeOut_FaTh2 = result.TIMEOUT_AJAX;

        _NOME_EMITENTE = result.NOME_EMITENTE;
        _EMITENTE = result.NOME_FANTASIA_EMITENTE;
        _UF_EMITENTE = result.UF_EMITENTE;
        _CONTATO_EMITENTE = result.CONTATO_EMITENTE;
        _ID_EMPRESA = result.CODIGO_EMITENTE;
        _TELEFONE_EMITENTE = result.TELEFONE_EMITENTE;
        _VENDEDOR = result.VENDEDOR;
        _ID_USUARIO = result.ID_USUARIO;
        _USUARIO_ORDEM_COMPRA = result.ORDEM_COMPRA;
        _USUARIO_ADMIN_COMPRAS = result.ADMIN_COMPRAS;
        _SUPERVISOR_FATURAMENTO = result.SUPERVISOR_FATURAMENTO;
        _GERENTE_COMERCIAL = result.GERENTE_COMERCIAL;
        _ID_VENDEDOR = result.ID_VENDEDOR;
        _ADMIN_USUARIO = result.ADMIN_USUARIO;
        _LOGIN_USUARIO = result.LOGIN_USUARIO;

        _PASTA_ANEXOS = result.PastaVirtualAnexos;

        _PASTA_FISICA_ANEXOS = result.PASTA_FISICA_ANEXOS;

        _GERENTE_COMPRAS = result.ADMIN_COMPRAS;
        _SERIE = result.SERIE;
        _CNPJ_EMITENTE = result.CNPJ_EMITENTE;

        _ENDERECO_EMITENTE = result.ENDERECO_EMITENTE;
        _NUMERO_EMITENTE = result.NUMERO_EMITENTE;
        _COMPL_EMITENTE = result.COMPL_EMITENTE;
        _CEP_EMITENTE = result.CEP_EMITENTE;
        _CIDADE_EMITENTE = result.CIDADE_EMITENTE;
        _ESTADO_EMITENTE = result.ESTADO_EMITENTE;

        DireitosPorUsuario();

        if (_ADMIN_USUARIO != 1) {
            Ext.getCmp('BTN_CONTAS_USUARIO').setVisible(false);
        }
        else {
            Ext.getCmp('BTN_CONTAS_USUARIO').setVisible(true);
        }

        Mantem_Sessao();

        // webMail
        Carrega_Combo_Usuarios();
        Carrega_Combo_Usuarios_Tarefas();
        CARREGA_EMAIL_CONTA(_ID_USUARIO);
        CARREGA_EMAIL_PASTA(_ID_USUARIO);
        CARREGA_EMAIL_PASTA_MOVER(_ID_USUARIO);

        Carrega_Todos_os_Contatos_do_Usuario();
        Carrega_Todos_os_Grupos_de_email();
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();
}

function DireitosPorUsuario() {
    var DIREITOS_Store = new Ext.data.Store({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['MENU']
       )
    });

    var _ajax = new Th2_Ajax();
    _ajax.setUrl('servicos/TB_ACESSO.asmx/Lista_Acessos');
    _ajax.setJsonData({
        ID_USUARIO: _ID_USUARIO
    });

    var _sucess = function (response, options) {
        var result = Ext.decode(response.responseText).d;
        DIREITOS_Store.loadData(criaObjetoXML(result), false);

        for (var i = 0; i < _dataMenu.length; i++) {
            if (DIREITOS_Store.find('MENU', _dataMenu[i][0]) == -1) {
                RemoveItemMenu(_dataMenu[i][0]);
            }
        }
    };

    _ajax.setSucesso(_sucess);
    _ajax.Request();

    function RemoveItemMenu(menu) {

        for (var i = 0; i < treeCadastros.getRootNode().childNodes.length; i++) {
            if (treeCadastros.getRootNode().childNodes[i].text == menu) {
                var _node = treeCadastros.getRootNode().childNodes[i];
                treeCadastros.getRootNode().removeChild(_node, true);
                break;
            }
        }


        for (var i = 0; i < treeOrcamentos.getRootNode().childNodes.length; i++) {
            if (treeOrcamentos.getRootNode().childNodes[i].text == menu) {
                var _node = treeOrcamentos.getRootNode().childNodes[i];
                treeOrcamentos.getRootNode().removeChild(_node, true);
                break;
            }
        }

        for (var i = 0; i < treePedidos.getRootNode().childNodes.length; i++) {
            if (treePedidos.getRootNode().childNodes[i].text == menu) {
                var _node = treePedidos.getRootNode().childNodes[i];
                treePedidos.getRootNode().removeChild(_node, true);
                break;
            }
        }

        for (var i = 0; i < treeCompras.getRootNode().childNodes.length; i++) {
            if (treeCompras.getRootNode().childNodes[i].text == menu) {
                var _node = treeCompras.getRootNode().childNodes[i];
                treeCompras.getRootNode().removeChild(_node, true);
                break;
            }

            for (var n = 0; n < treeCompras.getRootNode().childNodes[i].childNodes.length; n++) {
                if (treeCompras.getRootNode().childNodes[i].childNodes[n].text == menu) {
                    var _node = treeCompras.getRootNode().childNodes[i].childNodes[n];
                    treeCompras.getRootNode().childNodes[i].removeChild(_node, true);
                    break;
                }
            }
        }

        for (var i = 0; i < treeFinanceiro.getRootNode().childNodes.length; i++) {
            if (treeFinanceiro.getRootNode().childNodes[i].text == menu) {
                var _node = treeFinanceiro.getRootNode().childNodes[i];
                treeFinanceiro.getRootNode().removeChild(_node, true);
                break;
            }

            for (var n = 0; n < treeFinanceiro.getRootNode().childNodes[i].childNodes.length; n++) {
                if (treeFinanceiro.getRootNode().childNodes[i].childNodes[n].text == menu) {
                    var _node = treeFinanceiro.getRootNode().childNodes[i].childNodes[n];
                    treeFinanceiro.getRootNode().childNodes[i].removeChild(_node, true);
                    break;
                }
            }
        }

        for (var i = 0; i < treeConfig.getRootNode().childNodes.length; i++) {
            if (treeConfig.getRootNode().childNodes[i].text == menu) {
                var _node = treeConfig.getRootNode().childNodes[i];
                treeConfig.getRootNode().removeChild(_node, true);
                break;
            }
        }

        for (var i = 0; i < treeAuditoria.getRootNode().childNodes.length; i++) {
            if (treeAuditoria.getRootNode().childNodes[i].text == menu) {
                var _node = treeAuditoria.getRootNode().childNodes[i];
                treeAuditoria.getRootNode().removeChild(_node, true);
                break;
            }
        }
    }
}