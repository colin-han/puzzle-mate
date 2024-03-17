(function (pm) {
    pm.state = 'init'; // 'init' | 'run' | 'paused' | 'over';
    let selectedItem;
    let currentItem;
    let movePath;

    function removeTiles(item1, item2) {
        pm.tiles[item1.row][item1.col].isEmpty = true;
        pm.tiles[item2.row][item2.col].isEmpty = true;
        pm.onElimination();
        if (checkWin()) {
            pm.pauseTimer();
            pm.state = 'win';
            pm.updateState();
        }
    }

    function checkWin() {
        for (let i = 0; i < pm.tiles.length; i++) {
            const row = pm.tiles[i];
            for (let j = 0; j < row.length; j++) {
                if (!row[j].isEmpty) return false;
            }
        }
        return true;
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
        pm.initView();
        pm.initTimer();
        restartGame();
    }

    function restartGame() {
        pm.state = 'run';
        pm.tiles = pm.initTiles(pm.BOARD_HEIGHT, pm.BOARD_WIDTH, pm.TILE_MAX_TYPE)
        pm.startTimer();
        pm.resetBoard();
        pm.updateState();
    }

    function gameOver() {
        pm.state = 'over';
        pm.updateState();
    }

    function pauseGame() {
        if (pm.state === 'paused') {
            pm.resumeTimer();
            pm.state = 'run';
        } else {
            pm.pauseTimer();
            pm.state = 'paused';
        }
        pm.updateState();
    }

    function help() {
        let highlights;
        const count = pm.BOARD_HEIGHT * pm.BOARD_WIDTH;
        for (let i = 0; i < count; i++) {
            const a = {
                row: Math.floor(i / pm.BOARD_WIDTH),
                col: i % pm.BOARD_WIDTH
            };
            let aTile = pm.tiles[a.row][a.col];
            if (aTile.isEmpty) continue;

            for (let j = i + 1; j < count; j++) {
                const b = {
                    row: Math.floor(j / pm.BOARD_WIDTH),
                    col: j % pm.BOARD_WIDTH
                };
                let bTile = pm.tiles[b.row][b.col];
                if (bTile.isEmpty || bTile.value !== aTile.value) continue;

                const path = pm.findPath(pm.tiles, a, b);
                if (path) {
                    highlights = [a, b];
                }
            }
        }
        pm.updateBoard(selectedItem, null, null, highlights);
    }

    pm.initGame = initGame;
    pm.pauseGame = pauseGame;
    pm.restartGame = restartGame;
    pm.gameOver = gameOver;
    pm.clickTile = clickTile;
    pm.help = help;
}).call(null, window.__pm = window.__pm || {})