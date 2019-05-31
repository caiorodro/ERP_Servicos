function MontaRelatorioPontuacaoFornecedor() {

    var TXT_DATAREF = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Inicial',
        allowBlank: false
    });

    var TXT_DATAREF2 = new Ext.form.DateField({
        layout: 'form',
        fieldLabel: 'Data Final',
        allowBlank: false
    });

    var dt1 = new Date();

    TXT_DATAREF.setValue(dt1.getFirstDateOfMonth());
    TXT_DATAREF2.setValue(dt1.getLastDateOfMonth());

    var TXT_FD_CLIENTE_FORNECEDOR = new Ext.form.TextField({
        fieldLabel: 'Fornecedor',
        width: 350,
        maxLength: 50,
        autoCreate: { tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50' }
    });

    var BTN_FD_CONFIRMAR = new Ext.Button({
        text: 'Buscar',
        icon: 'imagens/icones/database_search_24.gif',
        scale: 'large',
        handler: function () {
            Carrega_Grid();
        }
    });

    var BTN_IMPRIMIR = new Ext.Button({
        text: 'Imprimir',
        icon: 'imagens/icones/printer_24.gif',
        scale: 'large',
        handler: function () {
            lista_Relatorio();
        }
    });

    function lista_Relatorio() {
        if (!formFD.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();

        var dados = {
            dataInicial: TXT_DATAREF.getRawValue(),
            dataFinal: TXT_DATAREF2.getRawValue(),
            FORNECEDOR: TXT_FD_CLIENTE_FORNECEDOR.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        _ajax.setUrl('servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/Lista_Relatorio_Pontuacao_Fornecedor');
        _ajax.setJsonData(dados);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            window.open(result, '_blank', 'width=1000,height=800');
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    //////////////

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
        'AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO', 'CODIGO_FORNECEDOR', 'NOME_FANTASIA_FORNECEDOR'])
    });

    function numeroInteiro(val) {
        return parseInt(val);
    }

    var grid1 = new Ext.grid.GridPanel({
        store: Avaliacao_Store,
        columns: [
        { id: 'NOME_FANTASIA_FORNECEDOR', header: "Fornecedor", width: 180, sortable: true, dataIndex: 'NOME_FANTASIA_FORNECEDOR' },
        { id: 'AVALIACAO_EMBALAGEM_DESCRICAO', header: "Descri&ccedil;&atilde;o<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_DESCRICAO', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_EMBALAGEM_LOTE', header: "Lote<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_DESCRICAO', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_EMBALAGEM_MATERIAL', header: "Material<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_MATERIAL', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_EMBALAGEM_MEDIDA', header: "Medida<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_MEDIDA', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_EMBALAGEM_PESO', header: "Peso<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_PESO', align: 'center', renderer: numeroInteiro },

        { id: 'AVALIACAO_EMBALAGEM_QTDE', header: "Qtde<br />(Embalagem)", width: 115, sortable: true, dataIndex: 'AVALIACAO_EMBALAGEM_QTDE', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS', header: "Entrega<br />Antecipada", width: 115, sortable: true, dataIndex: 'AVALIACAO_ENTREGA_ANTECIPADA_X_DIAS', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_ENTREGA_ATRASADA_X_DIAS', header: "Entrega<br />Atrasada", width: 115, sortable: true, dataIndex: 'AVALIACAO_ENTREGA_ATRASADA_X_DIAS', align: 'center', renderer: numeroInteiro },

        { id: 'AVALIACAO_QTDE_ESPECIAL_A_MAIOR', header: "Qtde especial<br />a maior", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_ESPECIAL_A_MAIOR', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QTDE_ESPECIAL_A_MENOR', header: "Qtde especial<br />a menor", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_ESPECIAL_A_MENOR', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QTDE_ESPECIAL_SOLICITADA', header: "Qtde especial<br />solicitada", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_ESPECIAL_SOLICITADA', align: 'center', renderer: numeroInteiro },

        { id: 'AVALIACAO_QTDE_NORMAL_A_MAIOR', header: "Qtde normal<br />a maior", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_NORMAL_A_MAIOR', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QTDE_NORMAL_A_MENOR', header: "Qtde normal<br />a menor", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_NORMAL_A_MENOR', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QTDE_NORMAL_SOLICITADA', header: "Qtde normal<br />solicitada", width: 115, sortable: true, dataIndex: 'AVALIACAO_QTDE_NORMAL_SOLICITADA', align: 'center', renderer: numeroInteiro },

        { id: 'AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO', header: "Acabamento<br />aprovado", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_ACABAMENTO_APROVADO', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL', header: "Acabamento<br />condicional", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_ACABAMENTO_CONDICIONAL', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO', header: "Acabamento<br />reprovado", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_ACABAMENTO_REPROVADO', align: 'center', renderer: numeroInteiro },

        { id: 'AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO', header: "Dimensional<br />aprovado", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_DIMENSIONAL_APROVADO', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL', header: "Dimensional<br />condicional", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_DIMENSIONAL_CONDICIONAL', align: 'center', renderer: numeroInteiro },
        { id: 'AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO', header: "Dimensional<br />reprovado", width: 115, sortable: true, dataIndex: 'AVALIACAO_QUALIDADE_DIMENSIONAL_REPROVADO', align: 'center', renderer: numeroInteiro }
        ],
        stripeRows: true,
        height: AlturaDoPainelDeConteudo(111),
        width: '100%',
        frame: true,

        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    function Carrega_Grid() {
        if (!formFD.getForm().isValid())
            return;

        var _ajax = new Th2_Ajax();

        var dados = {
            dataInicial: TXT_DATAREF.getRawValue(),
            dataFinal: TXT_DATAREF2.getRawValue(),
            FORNECEDOR: TXT_FD_CLIENTE_FORNECEDOR.getValue(),
            ID_EMPRESA: _ID_EMPRESA,
            ID_USUARIO: _ID_USUARIO
        };

        _ajax.setUrl('servicos/TB_AVALIACAO_ITEM_COMPRA.asmx/Lista_Pontuacao_Fornecedor');
        _ajax.setJsonData(dados);

        var _sucess = function (response, options) {
            var result = Ext.decode(response.responseText).d;

            Avaliacao_Store.loadData(criaObjetoXML(result), false);
        };

        _ajax.setSucesso(_sucess);
        _ajax.Request();
    }

    var formFD = new Ext.FormPanel({
        labelAlign: 'top',
        width: '100%',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAREF]
            }, {
                columnWidth: 0.12,
                layout: 'form',
                items: [TXT_DATAREF2]
            }, {
                columnWidth: 0.30,
                layout: 'form',
                items: [TXT_FD_CLIENTE_FORNECEDOR]
            }, {
                columnWidth: 0.08,
                layout: 'form',
                items: [BTN_FD_CONFIRMAR]
            }, {
                columnWidth: 0.08,
                layout: 'form',
                items: [BTN_IMPRIMIR]
            }]
        }, grid1]
    });

    var panelFD = new Ext.Panel({
        width: '100%',
        autoHeight: true,
        frame: true,
        title: 'Relat&oacute;rio de pontua&ccedil;&atilde;o de fornecedores',
        items: [formFD]
    });

    return panelFD;
}