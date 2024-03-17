(function (pm) {
    pm.BOARD_WIDTH = 14; // 游戏面板宽度
    pm.BOARD_HEIGHT = 10; // 游戏面板高度
    pm.TILE_MAX_TYPE = 24;
    pm.TILE_SIZE = 47; // 单元图片大小
    pm.TILE_SPACING = 5;
    pm.MAX_TIME = 90;

    if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        pm.BOARD_HEIGHT = params.get('rows') || pm.BOARD_HEIGHT;
        pm.BOARD_WIDTH = params.get('cols') || pm.BOARD_WIDTH;
        pm.TILE_MAX_TYPE = params.get('types') || pm.TILE_MAX_TYPE;
        pm.MAX_TIME = params.get('time') || pm.MAX_TIME;
    }
}).call(null, window.__pm = window.__pm || {});
