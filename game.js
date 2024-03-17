(function (pm) {
    pm.state = 'init'; // 'init' | 'run' | 'pause' | 'over';
    let selectedItem;
    let currentItem;
    let movePath;

    function removeTiles(item1, item2) {
        pm.tiles[item1.row][item1.col].isEmpty = true;
        pm.tiles[item2.row][item2.col].isEmpty = true;
        pm.onElimination();
    }

    function clickTile(row, col) {
        if (selectedItem && currentItem) {
            selectedItem = null;
            currentItem = null;
        }
        const item = {row, col, val: pm.tiles[row][col].value};
        if (selectedItem && selectedItem.col === item.col && selectedItem.row === item.row) {
            selectedItem = null;
            currentItem = null;
        } else {
            if (selectedItem && selectedItem.val === item.val) {
                const path = pm.findPath(pm.tiles, selectedItem, item);
                if (path) {
                    currentItem = item;
                    movePath = path;
                    console.log("Path: ", path);
                    removeTiles(selectedItem, currentItem);
                } else {
                    selectedItem = item;
                    currentItem = null;
                }
            } else {
                selectedItem = item;
                currentItem = null;
            }
        }
        pm.updateBoard(selectedItem, currentItem, movePath);
    }

    function initGame() {
        restartGame();
    }

    function restartGame() {
        pm.state = 'run';
        pm.tiles = pm.initTiles(pm.BOARD_HEIGHT, pm.BOARD_WIDTH, pm.TILE_MAX_TYPE)
        pm.startTimer();
        pm.initBoard()
    }

    function gameOver() {
        pm.state = 'over';
    }

    pm.initGame = initGame;
    pm.restartGame = restartGame;
    pm.gameOver = gameOver;
    pm.clickTile = clickTile;
}).call(null, window.__pm = window.__pm || {})