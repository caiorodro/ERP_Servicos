function Th2_Grid() {
    var _grid;
    var columns;
    var store;
    var height;
    var width;
    var selectionModel;
    var listeners;
    var id;

    var pagingToolbar;
    var sortField;
    var sortDirection;
    var dadosFiltro;
    var _plugIns;
    
    var metodoCargaGrid;

    this.setId = function(pId) {
        id = pId;
    };

    this.setStore = function(pStore) {
        store = pStore;
    };

    this.setColumns = function(pColumns) {
        columns = pColumns;
    };

    this.setHeight = function(pHeight) {
        height = pHeight;
    };

    this.setWidth = function(pWidth) {
        width = pWidth;
    };

    this.setSelectionModel = function(pSelectionModel) {
        selectionModel = pSelectionModel;
    };

    this.setListeners = function(pListeners) {
        listeners = pListeners;
    };

    this.setMetodoCargaGrid = function(pMetodoCarga) {
        metodoCargaGrid = pMetodoCarga;
    };
    
    this.setDadosFiltro = function(pDadosFiltro) {
        dadosFiltro = pDadosFiltro;

        dadosFiltro["sortField"] = sortField;
        dadosFiltro["sortDirection"] = sortDirection;

        return dadosFiltro;
    };
    
    this.setPlugins = function(pi) {
        _plugIns = pi;
    };

    this.grid = function() {
        return _grid;
    };

    this.constroiGrid = function() {
        _grid = new Ext.grid.GridPanel({
            id: id,
            store: store,
            columns: columns,
            stripeRows: true,
            height: height,
            width: width,

            sm: selectionModel,
            plugins: _plugIns,
            listeners: listeners
        });

        _grid.addListener('sortchange', function(grid, sortInfo) {
            sortField = sortInfo.field;
            sortDirection = sortInfo.direction;

            var x = metodoCargaGrid();
        });
    };
}