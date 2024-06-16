(function (pm) {
    const levels = [
        {
            BOARD_WIDTH: 5,  // 游戏面板宽度
            BOARD_HEIGHT: 4,  // 游戏面板高度
            TILE_MAX_TYPE: 10,
            MAX_TIME: 90,
        }, {
            BOARD_WIDTH: 10,  // 游戏面板宽度
            BOARD_HEIGHT: 8,  // 游戏面板高度
            TILE_MAX_TYPE: 14,
            MAX_TIME: 90,
        }, {
            BOARD_WIDTH: 14,  // 游戏面板宽度
            BOARD_HEIGHT: 10,  // 游戏面板高度
            TILE_MAX_TYPE: 24,
            MAX_TIME: 90,
        }, {
            BOARD_WIDTH: 18,  // 游戏面板宽度
            BOARD_HEIGHT: 12,  // 游戏面板高度
            TILE_MAX_TYPE: 24,
            MAX_TIME: 60,
        }, {
            BOARD_WIDTH: 20,  // 游戏面板宽度
            BOARD_HEIGHT: 14,  // 游戏面板高度
            TILE_MAX_TYPE: 24,
            MAX_TIME: 60,
        }, {
            BOARD_WIDTH: 28,  // 游戏面板宽度
            BOARD_HEIGHT: 20,  // 游戏面板高度
            TILE_MAX_TYPE: 24,
            MAX_TIME: 180,
        }
    ]
    const params = new URLSearchParams(window.location.search || '');
    pm.levels = levels;
    pm.TILE_SIZE = 47;
    pm.TILE_SPACING = 5;
    pm.LEVEL = parseInt(params.get('level')) || 0;
    Object.assign(pm, levels[pm.LEVEL]);
    pm.BOARD_HEIGHT = params.get('rows') || pm.BOARD_HEIGHT;
    pm.BOARD_WIDTH = params.get('cols') || pm.BOARD_WIDTH;
    pm.TILE_MAX_TYPE = params.get('types') || pm.TILE_MAX_TYPE;
    pm.MAX_TIME = params.get('time') || pm.MAX_TIME;
}).call(null, window.__pm = window.__pm || {});
