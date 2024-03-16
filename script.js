(function (pm) {
    let tiles;
    let gameBoard;
    let selectedItem;
    let currentItem;

    function getTileState(row, col) {
        let isSelected = false;
        let isMoving = false;
        let remove = false;
        if (selectedItem && selectedItem.row === row && selectedItem.col === col) {
            isSelected = true;
            if (currentItem) {
                isMoving = true;
                remove = true;
            }
        }
        if (currentItem && currentItem.row === row && currentItem.col === col) {
            isSelected = true;
            remove = true;
        }
        return {isSelected, isMoving, remove};
    }

    function getAnimationDuration() {
        let dr = currentItem.row - selectedItem.row;
        let dc = currentItem.col - selectedItem.col;
        return ((Math.abs(dr) + Math.abs(dc)) * 0.05) + 's';
    }

    function update() {
        for (let row = 0; row < pm.BOARD_HEIGHT; row++) {
            for (let col = 0; col < pm.BOARD_WIDTH; col++) {
                const tile = tiles[row][col];
                let {isSelected, isMoving, remove} = getTileState(row, col);

                if (isSelected) {
                    tile.element.classList.add('selected');
                } else {
                    tile.element.classList.remove('selected');
                }
                if (isMoving) {
                    tile.element.classList.add('moving');
                    let dr = currentItem.row - selectedItem.row;
                    let dc = currentItem.col - selectedItem.col;
                    tile.element.style.animationName = pm.getFrame(dr, dc);
                    tile.element.style.animationDuration = getAnimationDuration();
                    tile.element.style.transitionDelay = getAnimationDuration();
                } else {
                    tile.element.classList.remove('moving');
                    tile.element.style.animationName = null;
                }
                if (remove) {
                    tile.element.classList.add('will-remove');
                    tile.element.style.transitionDelay = getAnimationDuration();
                }
                if (tile.isEmpty) {
                    tile.element.classList.add('empty');
                }
            }
        }
    }

    function initMatrix() {
        tiles = pm.initBoard(pm.BOARD_HEIGHT, pm.BOARD_WIDTH, pm.TILE_MAX_TYPE)
        for (let row = 0; row < pm.BOARD_HEIGHT; row++) {
            for (let col = 0; col < pm.BOARD_WIDTH; col++) {
                const tile = tiles[row][col];

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

    function removeTiles(item1, item2) {
        tiles[item1.row][item1.col].isEmpty = true;
        tiles[item2.row][item2.col].isEmpty = true;
    }

    function handleClick(e) {
        const tile = findParentWithClass(e.target, 'tile');
        if (tile && !tile.classList.contains('empty')) {
            if (selectedItem && currentItem) {
                selectedItem = null;
                currentItem = null;
            }

            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const item = {row, col, val: tiles[row][col].value};
            if (selectedItem && selectedItem.col === item.col && selectedItem.row === item.row) {
                selectedItem = null;
                currentItem = null;
            } else {
                if (selectedItem && selectedItem.val === item.val) {
                    currentItem = item;
                    const path = pm.findPath(tiles, selectedItem, currentItem);
                    if (path) {
                        console.log("Path: ", path);
                        removeTiles(selectedItem, currentItem);
                    } else {
                        selectedItem = currentItem;
                        currentItem = null;
                    }
                } else {
                    selectedItem = item;
                    currentItem = null;
                }
            }
            update();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', handleClick);
        initMatrix();
    });
}).call(null,window.__pm = window.__pm || {});
