function MontaUltimasVendas() {
    var _ultimos_vendas = new MontaUltimasCompras();

    _ultimos_vendas.Cliente_Fornecedor(1);
    _ultimos_vendas.isWindow(false);

    return _ultimos_vendas.painel_Ultimas_Compras();
}