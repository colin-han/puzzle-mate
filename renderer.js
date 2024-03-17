(function (pm) {
    let gameBoard;

    function getTileState(row, col, selectedItem, targetItem) {
        let isSelected = false;
        let isMoving = false;
        let remove = false;
        if (selectedItem && selectedItem.row === row && selectedItem.col === col) {
            isSelected = true;
            if (targetItem) {
                isMoving = true;
                remove = true;
            }
        }
        if (targetItem && targetItem.row === row && targetItem.col === col) {
            isSelected = true;
            remove = true;
        }
        return {isSelected, isMoving, remove};
    }

    function findParentWithClass(element, className) {
        let parent = element;

        while (parent) {
            if (parent.classList.contains(className)) {
                // 找到包含特定class的父节点
                return parent;
            }
            parent = parent.parentElement;
        }

        // 没有找到包含特定class的父节点
        return null;
    }

    function handleTileClick(e) {
        const tile = findParentWithClass(e.target, 'tile');
        if (tile && !tile.classList.contains('empty')) {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);

            pm.clickTile(row, col);
        }
    }

    function initBoard() {
        gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', handleTileClick);

        for (let row = 0; row < pm.BOARD_HEIGHT; row++) {
            for (let col = 0; col < pm.BOARD_WIDTH; col++) {
                const tile = pm.tiles[row][col];

                const elem = document.createElement('div');
                elem.classList.add('tile');
                elem.dataset.row = row;
                elem.dataset.col = col;
                elem.style.backgroundPosition = `${-Math.floor(tile.value / 10) * pm.TILE_SIZE}px ${-(tile.value % 10) * pm.TILE_SIZE + 1}px`; // 计算背景位置
                elem.style.left = col * (pm.TILE_SIZE + pm.TILE_SPACING) + pm.TILE_SPACING + 'px';
                elem.style.top = row * (pm.TILE_SIZE + pm.TILE_SPACING) + pm.TILE_SPACING + 'px';

                gameBoard.appendChild(elem);
                tile.element = elem;
            }
        }
    }

    function updateBoard(selectItem, targetItem, movePath) {
        for (let row = 0; row < pm.BOARD_HEIGHT; row++) {
            for (let col = 0; col < pm.BOARD_WIDTH; col++) {
                const tile = pm.tiles[row][col];
                let {isSelected, isMoving, remove} = getTileState(row, col, selectItem, targetItem);

                if (isSelected) {
                    tile.element.classList.add('selected');
                } else {
                    tile.element.classList.remove('selected');
                }
                if (isMoving) {
                    tile.element.classList.add('moving');
                    tile.element.style.animationName = pm.getAnimationName(movePath);
                    tile.element.style.animationDuration = pm.getAnimationDuration(movePath);
                    tile.element.style.transitionDelay = pm.getAnimationDuration(movePath);
                } else {
                    tile.element.classList.remove('moving');
                    tile.element.style.animationName = null;
                }
                if (remove) {
                    tile.element.classList.add('will-remove');
                    tile.element.style.transitionDelay = pm.getAnimationDuration(movePath);
                }
                if (tile.isEmpty) {
                    tile.element.classList.add('empty');
                }
            }
        }
    }

    pm.initBoard = initBoard;
    pm.updateBoard = updateBoard;
}).call(null,window.__pm = window.__pm || {});