(function (pm) {
    function initTiles(rowCount, colCount, maxValue) {
        // 计算每种类型棋子的数量
        const totalTiles = rowCount * colCount;
        const tilesPerType = Math.floor(totalTiles / maxValue);
        const remainingTiles = totalTiles % maxValue;

        // 生成棋盘
        const board = [];

        for (let i = 0; i < rowCount; i++) {
            const row = [];
            for (let j = 0; j < colCount; j++) {
                row.push({value: -1, isEmpty: false});
            }
            board.push(row);
        }

        const tileCounts = Array.from({length: maxValue}, () => 0);
        const maxEven = Math.floor(tilesPerType / 2) * 2;

        for (let i = 0; i < tileCounts.length; i++) {
            if (i === maxValue - 1) {
                tileCounts[i] = maxEven + remainingTiles;
            } else {
                tileCounts[i] = maxEven;
            }
        }

        // 随机分配剩余的棋子数量
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const randomValue = getRandomTileValue(tileCounts);
                board[i][j].value = randomValue;
                tileCounts[randomValue]--;
            }
        }

        return board;
    }

    // 获取一个随机棋子的类型
    function getRandomTileValue(tileCounts) {
        const availableTypes = [];
        for (let i = 0; i < tileCounts.length; i++) {
            if (tileCounts[i] > 0) {
                availableTypes.push(i);
            }
        }
        const randomIndex = Math.floor(Math.random() * availableTypes.length);
        return availableTypes[randomIndex];
    }
    pm.initTiles = initTiles;
}).call(null,window.__pm = window.__pm || {});
