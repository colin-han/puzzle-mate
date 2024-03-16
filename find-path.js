(function (pm) {
    const directions = {
        right: {row: 0, col: 1, step: 1},
        down: {row: 1, col: 0, step: 1},
        left: {row: 0, col: -1, step: -1},
        up: {row: -1, col: 0, step: -1}
    };

    const rounds = {
        left: ['down', 'up'],
        right: ['up', 'down'],
        up: ['left', 'right'],
        down: ['right', 'left']
    }

    function validatePosition(tiles, currPos) {
        if (outOfRange(tiles, currPos)) {
            throw new Error("Position out of range!");
        }
    }

    function isEmpty(tiles, currPos) {
        if (currPos.row < 0 || currPos.col < 0) return true;
        if (currPos.row >= tiles.length) return true;
        if (currPos.col >= tiles[0].length) return true;
        return tiles[currPos.row][currPos.col].isEmpty;
    }

    function areEqual(currPos, targetPos) {
        return currPos.row === targetPos.row && currPos.col === targetPos.col;
    }

    function addPos(pos, direction) {
        const d = directions[direction];
        return {row: pos.row + d.row, col: pos.col + d.col};
    }

    function continueStep(path, direction) {
        const d = directions[direction];
        const newSteps = [...path.steps];
        newSteps[newSteps.length - 1] += d.step;
        return {...path, steps: newSteps};
    }

    function addStep(path, direction) {
        const d = directions[direction];
        const newSteps = [...path.steps];
        newSteps.push(d.step);
        return {...path, direction, steps: newSteps}
    }

    function outOfRange(tiles, pos) {
        const minRow = -1, minCol = -1, maxRow = tiles.length, maxCol = tiles[0].length;
        // 检查边界条件
        return (pos.row < minRow || pos.row > maxRow || pos.col < minCol || pos.col > maxCol);
    }

    function round(tiles, queue, targetPos, currPos, path, direction) {
        const newPos = addPos(currPos, direction);
        const newPath = addStep(path, direction);
        if (areEqual(newPos, targetPos)) {
            return newPath;
        }
        if (!outOfRange(tiles, newPos) && isEmpty(tiles, newPos)) {
            queue.push({pos: newPos, path: newPath});
        }
    }

    function continues(tiles, queue, targetPos, currPos, path, direction) {
        const newPos = addPos(currPos, direction);
        const newPath = continueStep(path, direction);
        if (areEqual(newPos, targetPos)) {
            return newPath;
        }
        if (!outOfRange(tiles, newPos) && isEmpty(tiles, newPos)) {
            queue.push({pos: newPos, path: newPath});
        }
    }

    function findPath2(tiles, currPos, targetPos) {
        const queue = [];
        const left = round(tiles, queue, targetPos, currPos, {initDir: 'left', direction: 'left', steps: []}, 'left');
        if (left) return left;
        const right = round(tiles, queue, targetPos, currPos, {initDir: 'right', direction: 'right', steps: []}, 'right');
        if (right) return right;
        const up = round(tiles, queue, targetPos, currPos, {initDir: 'up', direction: 'up', steps: []}, 'up');
        if (up) return up;
        const down = round(tiles, queue, targetPos, currPos, {initDir: 'down', direction: 'down', steps: []}, 'down');
        if (down) return down;

        while (queue.length) {
            const {pos, path} = queue.shift();
            const newPath = continues(tiles, queue, targetPos, pos, path, path.direction);
            if (newPath) return newPath;

            if (path.steps.length < 3) {
                const leftPath = round(tiles, queue, targetPos, pos, path, rounds[path.direction][0]);
                if (leftPath) return leftPath;
                const rightPath = round(tiles, queue, targetPos, pos, path, rounds[path.direction][1]);
                if (rightPath) return rightPath;
            }
        }
    }

    function findPath(tiles, currPos, targetPos) {
        validatePosition(tiles, currPos);
        validatePosition(tiles, targetPos);

        // 检查当前棋子是否存在
        if (isEmpty(tiles, currPos)) {
            throw new Error("Tile is empty!")
        }

        // 检查目标棋子是否存在
        if (isEmpty(tiles, targetPos)) {
            throw new Error("Tile is empty!")
        }

        // 检查当前位置和目标位置是否相同
        if (areEqual(currPos, targetPos)) {
            return {direction: 'row', steps: []};
        }

        let p = findPath2(tiles, currPos, targetPos);
        return p && {direction: p.initDir, steps: p.steps};
    }

    pm.findPath = findPath;
}).call(null, window.__pm = window.__pm || {});
