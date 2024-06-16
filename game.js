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
        } else if (!findPossible()) {
            alert("没有可以消除的水果了，将会重新摆放水果！")
            reorder(0);
        }
    }

    function countTile() {
        let count = 0;
        for (let i = 0; i < pm.BOARD_HEIGHT; i++) {
            for (let j = 0; j < pm.BOARD_WIDTH; j++) {
                if (!pm.tiles[i][j].isEmpty) count++;
            }
        }
        return count;
    }
    function getAllTiles() {
        let all = [];
        for (let i = 0; i < pm.BOARD_HEIGHT; i++) {
            for (let j = 0; j < pm.BOARD_WIDTH; j++) {
                if (!pm.tiles[i][j].isEmpty) all.push(pm.tiles[i][j]);
            }
        }
        return all;
    }
    function reorder(c) {
        if (c > 10) {
            alert("游戏无法进行了！即将重置游戏。")
            pm.restartGame();
            return;
        }
        const allTiles = getAllTiles();
        const count = allTiles.length;
        for (let i = 0; i < count / 2; i++) {
            const a = Math.floor(Math.random() * count);
            const b = Math.floor(Math.random() * count);
            if (a !== b) {
                const t = allTiles[a].value;
                allTiles[a].value = allTiles[b].value;
                allTiles[b].value = t;
            }
        }
        if (!findPossible()) {
            reorder(c + 1);
        } else {
            pm.resetBoard();
            pm.updateBoard(selectedItem, currentItem, movePath);
        }
    }

    function checkWin() {
        return !countTile()
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

    function findPossible() {
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
        return highlights;
    }

    function help() {
        let highlights = findPossible();
        pm.updateBoard(selectedItem, null, null, highlights);
    }

    function nextLevel() {
        pm.LEVEL = (pm.LEVEL + 1) % 3;
        Object.assign(pm, pm.levels[pm.LEVEL]);
        pm.restartGame();
    }

    pm.initGame = initGame;
    pm.pauseGame = pauseGame;
    pm.restartGame = restartGame;
    pm.gameOver = gameOver;
    pm.clickTile = clickTile;
    pm.nextLevel = nextLevel;
    pm.help = help;
}).call(null, window.__pm = window.__pm || {})