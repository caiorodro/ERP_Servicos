function MontaPanelAuditoria() {

    function Configura_Tabelas(val) {
        if (val == 'TB_ACABAMENTO_SUPERFICIAL')
            return "Acabamento Superficial";

        else if (val == 'TB_ACESSO' || val == 'TB_ACESSO1')
            return "Acessos (FaTh2)";

        else if (val == 'TB_ACESSO_COMERCIAL')
            return "Acessos (Vendas)";

        else if (val == 'TB_ACESSO_CRM')
            return "Acessos (CRM)";

        else if (val == 'TB_ACAO_CORRETIVA_RNC')
            return "Ação corretiva de RNC";

        else if (val == 'TB_ALCADA_APROVACAO_PEDIDO')
            return "Alçada de aprovação de pedido de compra";

        else if (val == 'TB_ANALISE_CUSTO_PEDIDO_VENDA')
            return "Análise de Custo de Vendas";

        else if (val == 'TB_ARVORE_PRODUTO')
            return "Árvore de Produto";

        else if (val == 'TB_ASSOCIACAO_COMPRA_VENDA')
            return "Associação entre Venda e Compra";

        else if (val == 'TB_AVALIACAO_ITEM_COMPRA')
            return "Avaliação de fornecedores";

        else if (val == 'TB_BANCO')
            return "Bancos";

        else if (val == 'TB_BENEFICIAMENTO')
            return "Beneficiamento";

        else if (val == 'TB_CERTIFICADO_PRODUTO')
            return "Certificado de Produtos";

        else if (val == 'TB_CALENDARIO')
            return "Calendário";

        else if (val == 'TB_CICLISTA')
            return "Ciclistas";

        else if (val == 'TB_CFOP')
            return "Naturezas de Operação";

        else if (val == 'TB_CFOP_CLAS_FISCAL')
            return "Naturezas de Operação / Clas. Fiscal";

        else if (val == 'TB_CFOP_SIT_TRIB')
            return "Naturezas de Operação / Sit. Trib.";

        else if (val == 'TB_CLAS_FISCAL')
            return "Classificações Fiscais";

        else if (val == 'TB_CLAS_FISCAL_SIT_TRIB')
            return "Class. Fiscais / Sit. Tributária";
            
        else if (val == 'TB_CLIENTE')
            return "Clientes";

        else if (val == 'TB_CLIENTE_CONTATO')
            return "Contatos de Clientes";

        else if (val == 'TB_CLIENTE_DOCUMENTO')
            return "Documentos de Clientes";

        else if (val == 'TB_CLIENTE_PRODUTO')
            return "Códigos de Produtos para Clientes";

        else if (val == 'TB_COMPLEMENTO_PRODUTO')
            return "Complemento de Produto";

        else if (val == 'TB_COND_PAGTO')
            return "Condição de Pagamento";

        else if (val == 'TB_CONFIG_FATH2')
            return "Configura&ccedil;&otilde;es do Sistema";

        else if (val == 'TB_CONFIG_NFE')
            return "Configura&ccedil;&otilde;es da NF-e";

        else if (val == 'TB_CONFIG_VENDAS')
            return "Configura&ccedil;&otilde;es de Vendas";

        else if (val == 'TB_CONJUNTO_VENDA')
            return "Conjunto de Vendas";

        else if (val == 'TB_CONTA_CORRENTE')
            return "Conta Corrente";

        else if (val == 'TB_COTACAO_CRM')
            return "Cota&ccedil;&atilde;o de Venda (CRM)";

        else if (val == 'TB_CRM')
            return "Abertura de Vendas (CRM)";

        else if (val == 'TB_CUSTO_VENDA')
            return "Custo de Venda";

        else if (val == 'TB_CUSTO_ITEM_ORCAMENTO_VENDA')
            return "Custo de Venda (Itens de Orçamento)";

        else if (val == 'TB_CUSTO_ITEM_PEDIDO_VENDA')
            return "Custo de Venda (Itens de Pedido)";

        else if (val == 'TB_DADOS_FATURAMENTO')
            return "Dados de Faturamento do Pedido";

        else if (val == 'TB_EMAIL')
            return "E-mail";

        else if (val == 'TB_EMAIL_ATTACHMENTS')
            return "Anexo de E-mail";

        else if (val == 'TB_EMAIL_BCC')
            return "C&oacute;pia oculta de destinat&aacute;rios (E-mail)";

        else if (val == 'TB_EMAIL_CC')
            return "C&oacute;pia destinat&aacute;rios (E-mail)";

        else if (val == 'TB_EMAIL_CONTA')
            return "Conta de e-mail";

        else if (val == 'TB_EMAIL_CONTATO')
            return "Contatos de e-mail";

        else if (val == 'TB_EMAIL_PASTA')
            return "Pasta de E-mail";

        else if (val == 'TB_EMAIL_PROGRAMACAO')
            return "Programação de e-mail";

        else if (val == 'TB_EMAIL_TO')
            return "Destinat&aacute;rios (E-mail)";

        else if (val == 'TB_EMITENTE')
            return "Emitente de Nota Fiscal";

        else if (val == 'TB_EMITENTE_NOTA_SAIDA')
            return "Emitente de Nota Fiscal";

        else if (val == 'TB_ESTOQUE')
            return "Estoque";

        else if (val == 'TB_ETIQUETA_VENDA')
            return "Etiqueta de Venda";

        else if (val == 'TB_ESTOQUE_RESERVADO')
            return "Estoque Reservado";

        else if (val == 'TB_FAMILIA_PRODUTO')
            return "Famílias de Produtos";

        else if (val == 'TB_FERIADO')
            return "Feriados";

        else if (val == 'TB_FINANCEIRO')
            return "Financeiro";

        else if (val == 'TB_FOLLOW_UP_CRM')
            return "Follow UP Clientes (CRM)";

        else if (val == 'TB_FOLLOW_UP_ITEM_PEDIDO')
            return "Follow UP de Itens de Pedidos de Venda";

        else if (val == 'TB_FOLLOW_UP_PEDIDO')
            return "Follow UP de Pedidos de Venda";

        else if (val == 'TB_FORNECEDOR')
            return "Fornecedores";

        else if (val == 'TB_FORNECEDOR_DOCUMENTO')
            return "Documentos de Fornecedor";

        else if (val == 'TB_FORNECEDOR_PRODUTO')
            return "Produtos do Fornecedores";

        else if (val == 'TB_FORNECEDOR_CONTATO')
            return "Contato de Fornecedor";

        else if (val == 'TB_HISTORICO_CNAB')
            return "Histórico CNAB";

        else if (val == 'TB_HISTORICO_COMPRA')
            return "Histórico de Compras";

        else if (val == 'TB_IMPRESSORA')
            return "Impressoras";

        else if (val == 'TB_INDICADOR_CRM')
            return "Indicador Contatos (CRM)";

        else if (val == 'TB_ITEM_NOTA_ENTRADA')
            return "Itens de Notas Fiscais de Entrada";

        else if (val == 'TB_ITEM_NOTA_SAIDA')
            return "Itens de Notas Fiscais de Saída";

        else if (val == 'TB_ITEM_ORCAMENTO_VENDA')
            return "Itens de Orçamento de Vendas";

        else if (val == 'TB_LIMITE')
            return "Limites de Créditos";

        else if (val == 'TB_LOCAL')
            return "Local de Produtos";

        else if (val == 'TB_LOCAL_MATERIAL_SEPARACAO')
            return "Local de material em separação";

        else if (val == 'TB_MANUTENCAO_VEICULO')
            return "Manutenção de Veículos";

        else if (val == 'TB_MATERIAL')
            return "Material de Produtos";

        else if (val == 'TB_MOVTO_ESTOQUE')
            return "Tipo de Movimentação de Estoque";

        else if (val == 'TB_MUNICIPIO')
            return "Municípios";

        else if (val == 'TB_NFE_HISTORICO_SAIDA' || val == 'TB_NFE_HISTORICO')
            return "Histórico das NFes";

        else if (val == 'TB_NICHO_MERCADO')
            return "Nichos de Mercado";

        else if (val == 'TB_NOTA_ENTRADA')
            return "Notas Fiscais de Entrada";

        else if (val == 'TB_NOTA_SAIDA')
            return "Notas Fiscais de Saída";

        else if (val == 'TB_NUMERO_NOTA_SAIDA')
            return "Numeros de Notas de Saída";

        else if (val == 'TB_NUMERO_PEDIDO_COMPRA')
            return "Numeros de Pedidos de Compras";

        else if (val == 'TB_OCORRENCIA_BANCARIA_REMESSA')
            return "Ocorrência de Remessa Bancária";

        else if (val == 'TB_OCORRENCIA_BANCARIA_RETORNO')
            return "Ocorrência de Retorno Bancário";

        else if (val == 'TB_ORCAMENTO_VENDA')
            return "Orçamento de Vendas";

        else if (val == 'TB_OCORRENCIA_RNC')
            return "Ocorrência de RNC";

        else if (val == 'TB_ORCAMENTO_VENDA_HISTORICO')
            return "Histórico de Orçamento de Vendas";

        else if (val == 'TB_PAGTO_PARCIAL')
            return "Pagamentos Parciais (Financeiro)";

        else if (val == 'TB_PARAMETRO_CUSTOS')
            return "Parâmetros de Custos";

        else if (val == 'TB_PLANO_CONTAS')
            return "Plano de Contas (Financeiro)";

        else if (val == 'TB_PEDIDO_COMPRA')
            return "Pedidos de Compra";

        else if (val == 'TB_PEDIDO_VENDA')
            return "Pedido de Venda";

        else if (val == 'TB_PRE_ROTEIRO')
            return "Configuração de Roteiros";

        else if (val == 'TB_PROPRIEDADE_MECANICA')
            return "Propriedade de Mecânica";

        else if (val == 'TB_PRODUTO')
            return "Seviços";

        else if (val == 'TB_PRODUTO_DOCUMENTO')
            return "Documentos de Produto";

        else if (val == 'TB_PROGRAMACAO_COMPRA_VENDEDOR')
            return "Programação de compras";

        else if (val == 'TB_CODIGO_BARRAS_PRODUTO')
            return "Código de Barras de Produtos";

        else if (val == 'TB_RECEBIMENTO_PEDIDO_COMPRA')
            return "Recebimento de Compra";

        else if (val == 'TB_REGIAO_VENDA')
            return "Região de Vendas";

        else if (val == 'TB_RNC')
            return "Itens de RNC";

        else if (val == 'TB_ROTEIRO')
            return "Roteiro de Entregas";

        else if (val == 'TB_SERVICO_CICLISTA')
            return "Servi&ccedil;os X Ciclistas";
            
        else if (val == 'TB_SIT_TRIB')
            return "Situação Tributária";

        else if (val == 'TB_SOLICITACAO_ESTOQUE')
            return "Solicitação de Estoque";

        else if (val == 'TB_TABELA_COMISSAO')
            return "Tabela de Comissões";

        else if (val == 'TB_TIPO_COBRANCA')
            return "Tipo de Cobrança";

        else if (val == 'TB_TRANSPORTADORA')
            return "Transportadoras";

        else if (val == 'TB_TRANSPORTADORA_DOCUMENTO')
            return "Documentos de Transportadora";

        else if (val == 'TB_UF')
            return "Unidades Federativas";

        else if (val == 'TB_STATUS_PEDIDO')
            return "Status de Pedido de Venda";

        else if (val == 'TB_STATUS_PEDIDO_COMPRA')
            return "Status de Pedido de Compra";

        else if (val == 'TB_STATUS_PEDIDO_USUARIO')
            return "Status de Pedido de Venda X Usuário";

        else if (val == 'TB_STATUS_RNC')
            return "Status de RNC";

        else if (val == 'TB_UF_CFOP')
            return "Nat. de Operação / Unidade Federativa";

        else if (val == 'TB_USUARIO')
            return "Usuários";

        else if (val == 'TB_VEICULO')
            return "Veículos de Transportadoras";

        else if (val == 'TB_VEICULO_CRM')
            return "Veículos de Comunicação (CRM)";

        else if (val == 'TB_VEICULO_FROTA')
            return "Veículos da Frota";

        else if (val == 'TB_VENDEDORES')
            return "Vendedores";

        else if (val == 'TB_VENDEDOR_COMISSAO')
            return "% de Comissão por Família de Produtos";

        else if (val == 'TB_SEPARADOR')
            return "Separadores";

        else if (val == 'TB_SALDO_CLIENTE_FORNECEDOR')
            return "Saldo de Clientes / Fornecedores";

        else if (val == 'TB_ITEM_MODELO_PROCESSO')
            return "Itens de Modelo de Processo";

        else if (val == 'TB_ITEM_PROCESSO')
            return "Itens de Processo";

        else if (val == 'TB_MODELO_PROCESSO')
            return "Modelo de Processo";

        else if (val == 'TB_PROCESSO')
            return "Processos internos";

        else if (val == 'TB_USUARIO_PROCESSO')
            return "Usuários do processo";

        else if (val == 'TB_USUARIO_RESPOSTA_NECESSIDADE_PROCESSO')
            return "Usuários de respostas as necessidades do processo";

        else if (val == 'TB_CGSN')
            return "CGSN";

    }

    function Auditoria_Trata_Acao(val) {
        if (val == 'I')
            return 'Inclus&atilde;o';
        else if (val == 'U')
            return 'Altera&ccedil;&atilde;o';
        else if (val == 'D')
            return 'Exclus&atilde;o';
    }

    var Auditoria_Grouping_Store = new Ext.data.GroupingStore({
        reader: new Ext.data.XmlReader({
            record: 'Tabela'
        }, ['ID_RASTRO', 'DATA_RASTRO', 'LOGIN_USUARIO', 'TABELA_RASTRO', 'TIPO_RASTRO', 'HISTORICO_RASTRO']
            )
        ,
        groupField: 'LOGIN_USUARIO',
        sortInfo: { field: 'DATA_RASTRO', direction: 'DESC' }
    });

    var Auditoria_expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '{HISTORICO_RASTRO}'
        )
    });

    var Auditoria_GridView = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Ocorr&ecirc;ncias" : "Ocorr&ecirc;ncia"]})',
        groupByText: 'Agrupar por esta coluna',
        showGroupsText: 'Exibir de forma agrupada'
    });

    var gridAuditoria = new Ext.grid.GridPanel({
        store: Auditoria_Grouping_Store,
        columns: [
        Auditoria_expander,
        { id: 'ID_RASTRO', header: "ID", width: 50, sortable: true, dataIndex: 'ID_RASTRO' },
        { id: 'DATA_RASTRO', header: "Data / Hora", width: 150, sortable: true, dataIndex: 'DATA_RASTRO', renderer: XMLParseDateTime },
        { id: 'AUDIT_LOGIN_USUARIO', header: "Respons&aacute;vel", width: 100, sortable: true, dataIndex: 'LOGIN_USUARIO' },
        { id: 'TIPO_RASTRO', header: "Tipo da A&ccedil;&atilde;o", width: 120, sortable: true, dataIndex: 'TIPO_RASTRO', renderer: Auditoria_Trata_Acao },
        { id: 'TABELA_RASTRO', header: "Tabela", width: 200, sortable: true, dataIndex: 'TABELA_RASTRO', renderer: Configura_Tabelas }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(203),
        width: 'auto',
        columnLines: true,
        plugins: Auditoria_expander,

        viewConfig: {
            forceFit: true
        },

        view: Auditoria_GridView
    });

    // Filtros
    var TXT_AUDITORIA_DATA_INICIAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false,
        format: 'd/m/Y',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_AUDITORIA_DATA_FINAL = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false,
        format: 'd/m/Y',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var combo_AUDITORIA_TB_USUARIOS = new Ext.form.ComboBox({
        store: combo_TB_USUARIOS_Store,
        fieldLabel: 'Respons&aacute;vel',
        valueField: 'ID_USUARIO',
        displayField: 'LOGIN_USUARIO',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 120,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var combo_AUDITORIA_TABELAS_FATH2 = new Ext.form.ComboBox({
        store: tabelas_FaTh2_store,
        fieldLabel: 'Tabela do Sistema',
        valueField: 'ID_TABELA',
        displayField: 'DESCRICAO_TABELA',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Selecione aqui...',
        selectOnFocus: true,
        width: 240,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var combo_AUDITORIA_TIPO_ACAO = new Ext.form.ComboBox({
        fieldLabel: 'Tipo da A&ccedil;&atilde;o',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        width: 120,
        emptyText: 'Selecione aqui...',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
            'AUDIT_ID_ACAO',
            'AUDIT_ACAO'
        ],
            data: [['I', 'Inclusão'], ['U', 'Alteração'], ['D', 'Exclusão']]
        }),
        valueField: 'AUDIT_ID_ACAO',
        displayField: 'AUDIT_ACAO',
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_AUDITORIA_NUMERO_NOTA = new Ext.form.NumberField({
        layout: 'form',
        fieldLabel: 'NF de Sa&iacute;da',
        width: 85,
        value: 0,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_AUDITORIA_HISTORICO = new Ext.form.TextField({
        layout: 'form',
        fieldLabel: 'Hist&oacute;rico',
        width: 300,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_AUDITORIA_NUMERO_NOTA_ENTRADA = new Ext.form.NumberField(
    {
        layout: 'form',
        fieldLabel: 'NF de Entrada',
        width: 85,
        value: 0,
        listeners: {
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    AUDITORIA_CARREGA_GRID();
                }
            }
        }
    });

    var TXT_NUMERO_LOTE = new Ext.form.TextField({
        fieldLabel: 'Nr. do Lote',
        width: 184,
        maxLength: 25,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '25' }
    });

    var AUDITORIA_BTN_PESQUISA = new Ext.Button({
        text: 'Filtrar',
        icon: 'imagens/icones/field_reload_24.gif',
        scale: 'large',
        handler: function () {
            AUDITORIA_CARREGA_GRID();
        }
    });

    var formFiltrosAuditoria = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 0',
        width: '100%',
        height: 120,
        frame: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .12,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_AUDITORIA_DATA_INICIAL]
            }, {
                columnWidth: .14,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_AUDITORIA_DATA_FINAL]
            }, {
                columnWidth: .17,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TB_USUARIOS]
            }, {
                columnWidth: .17,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TIPO_ACAO]
            }, {
                columnWidth: .25,
                layout: 'form',
                labelAlign: 'top',
                items: [combo_AUDITORIA_TABELAS_FATH2]
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .13,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_AUDITORIA_NUMERO_NOTA]
            }, {
                columnWidth: .13,
                layout: 'form',
                labelAlign: 'top',
                items: [TXT_AUDITORIA_NUMERO_NOTA_ENTRADA]
            }, {
                layout: 'form',
                columnWidth: .28,
                items: [TXT_AUDITORIA_HISTORICO]
            }, {
                layout: 'form',
                columnWidth: .18,
                items: [TXT_NUMERO_LOTE]
            }, {
                layout: 'form',
                labelAlign: 'top',
                columnWidth: .08,
                items: [AUDITORIA_BTN_PESQUISA]
            }]
        }]
    });

    /////////////////////
    Auditoria_FiltroMensal();

    function RetornaAuditoriaJsonData() {
        var AuditoriaJsonData = {
            DataInicial: TXT_AUDITORIA_DATA_INICIAL.getRawValue(),
            DataFinal: TXT_AUDITORIA_DATA_FINAL.getRawValue(),
            Usuario: combo_AUDITORIA_TB_USUARIOS.getValue(),
            Tabela: combo_AUDITORIA_TABELAS_FATH2.getValue(),
            Acao: combo_AUDITORIA_TIPO_ACAO.getValue(),
            NFSaida: TXT_AUDITORIA_NUMERO_NOTA.getValue(),
            NFEntrada: TXT_AUDITORIA_NUMERO_NOTA_ENTRADA.getValue(),
            HISTORICO: TXT_AUDITORIA_HISTORICO.getValue(),
            NUMERO_LOTE: TXT_NUMERO_LOTE.getValue(),
            ID_USUARIO: _ID_USUARIO,
            start: 0,
            limit: Th2_LimiteDeLinhasPaginacao
        };

        return AuditoriaJsonData;
    }

    var AuditoriaPagingToolbar = new Th2_PagingToolbar();
    AuditoriaPagingToolbar.setUrl('servicos/Auditoria.asmx/CarregaAuditoria');
    AuditoriaPagingToolbar.setStore(Auditoria_Grouping_Store);

    var panelAuditoria = new Ext.Panel({
        width: '100%',
        border: true,
        title: 'Pesquisa / Auditoria',
        items: [formFiltrosAuditoria, gridAuditoria, AuditoriaPagingToolbar.PagingToolbar()]
    });

    function AUDITORIA_CARREGA_GRID() {
        if (!formFiltrosAuditoria.getForm().isValid()) {
            return;
        }

        AuditoriaPagingToolbar.setParamsJsonData(RetornaAuditoriaJsonData());
        AuditoriaPagingToolbar.doRequest();
    }

    function Auditoria_FiltroMensal() {
        var dt1 = new Date();

        TXT_AUDITORIA_DATA_INICIAL.setValue(dt1.getFirstDateOfMonth());
        TXT_AUDITORIA_DATA_FINAL.setValue(dt1.getLastDateOfMonth());
    }

    panelAuditoria.on('render', function () {
        TH2_CARREGA_USUARIOS(); // classes.js
    });

    return panelAuditoria;
}