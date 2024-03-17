(function (pm) {
    function initTiles(rowCount, colCount, maxValue) {
        // 计算每种类型棋子的数量
        const totalTiles = rowCount * colCount;
        const tilesPerType = Math.floor(totalTiles / maxValue);
        const maxEven = Math.floor(tilesPerType / 2) * 2;
        const remainingTiles = totalTiles - maxValue * maxEven;

        // 生成棋子队列
        const list = [];
        for (let i = 0; i < maxValue; i++) {
            for (let j = 0; j < maxEven; j++) {
                list.push(i);
            }
        }
        for (let i = 0; i < remainingTiles / 2; i++) {
            list.push(i)
            list.push(i);
        }

        // 生成棋盘
        const board = [];

        for (let i = 0; i < rowCount; i++) {
            const row = [];
            for (let j = 0; j < colCount; j++) {
                const r = Math.floor(Math.random() * list.length);
                row.push({value: list[r], isEmpty: false});
                list.splice(r, 1);
            }
            board.push(row);
        }

        return board;
    }

    pm.initTiles = initTiles;
}).call(null,window.__pm = window.__pm || {});
