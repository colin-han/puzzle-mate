(function (pm) {
    let container;
    let playArea;
    let gameBoard;
    let pauseButton;
    let restartButton;
    let paused;
    let gameOver;
    let win;
    let level;
    let nextLevelButton;

    let boardWidth;
    let boardHeight;

    function getTileState(row, col, selectedItem, targetItem, highlights) {
        let isSelected = false;
        let isMoving = false;
        let remove = false;
        let highlight = false;
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
        if (highlights) {
            for (let i = 0; i < highlights.length; i++) {
                if (highlights[i].row === row && highlights[i].col === col) {
                    highlight = true;
                    break;
                }
            }
        }
        return {isSelected, isMoving, remove, highlight};
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

    function handleNextLevelClick() {
        pm.nextLevel();
        level.innerText = pm.LEVEL + 1;
        updateScale();
    }

    let resizeHandle;
    function onResize() {
        if (resizeHandle) clearTimeout(resizeHandle);
        resizeHandle = setTimeout(() => {
            updateScale();
            resizeHandle = undefined;
        }, 1000);
    }

    function updateScale() {
        boardWidth = pm.BOARD_WIDTH * (pm.TILE_SIZE + pm.TILE_SPACING) + pm.TILE_SPACING;
        boardHeight = pm.BOARD_HEIGHT * (pm.TILE_SIZE + pm.TILE_SPACING) + pm.TILE_SPACING;

        const screenWidth = playArea.offsetWidth - 40 /* padding */;
        const screenHeight = playArea.offsetHeight - 40 /* padding */;
        const ratio = Math.min(screenWidth / boardWidth, screenHeight / boardHeight);
        gameBoard.style.width = boardWidth + "px";
        gameBoard.style.height = boardHeight + 'px';
        gameBoard.style.marginLeft = (screenWidth - boardWidth * ratio) / 2 + 'px';
        gameBoard.style.transform = `scale(${ratio})`
    }

    function initView() {
        container = document.getElementById('container');
        playArea = document.getElementById('play-area');

        level = document.getElementById('level');
        level.innerText = pm.LEVEL + 1;

        nextLevelButton = document.getElementById('next-level');
        nextLevelButton.addEventListener('click', handleNextLevelClick);

        gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', handleTileClick);

        helpButton = document.getElementById("helpButton");
        helpButton.addEventListener('click', pm.help);

        restartButton = document.getElementById("restartButton");
        restartButton.addEventListener('click', pm.restartGame);

        pauseButton = document.getElementById('pauseButton');
        pauseButton.addEventListener('click', pm.pauseGame);

        paused = document.getElementById("paused");
        gameOver = document.getElementById("game-over");
        win = document.getElementById("win");

        updateScale();

        window.addEventListener('resize', onResize);
        window.addEventListener('keypress', (e) => {
            switch (e.key.toLowerCase()) {
                case 'h': pm.help(); break;
                case 'r': pm.restartGame(); break;
                case 'p': pm.pauseGame(); break;
            }
        });
    }

    function updateState() {
        switch (pm.state) {
            case 'init':
            case 'run':
                pauseButton.innerText = '暂停游戏';
                pauseButton.classList.remove('disabled');
                pauseButton.disabled = false;
                paused.style.visibility = 'hidden';
                gameOver.style.visibility = 'hidden';
                win.style.visibility = 'hidden';
                break;
            case 'paused':
                pauseButton.innerText = '继续游戏';
                pauseButton.classList.remove('disabled');
                pauseButton.disabled = false;
                paused.style.visibility = 'visible';
                gameOver.style.visibility = 'hidden';
                win.style.visibility = 'hidden';
                break;
            case 'over':
                pauseButton.innerText = '暂停游戏';
                pauseButton.classList.add('disabled');
                pauseButton.disabled = true;
                paused.style.visibility = 'hidden';
                gameOver.style.visibility = 'visible';
                win.style.visibility = 'hidden';
                break;
            case 'win':
                pauseButton.innerText = '暂停游戏';
                pauseButton.classList.add('disabled');
                pauseButton.disabled = true;
                paused.style.visibility = 'hidden';
                gameOver.style.visibility = 'hidden';
                win.style.visibility = 'visible';
                break;
        }
    }

    function resetBoard() {
        gameBoard.innerHTML = "";

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

    function updateBoard(selectItem, targetItem, movePath, highlights) {
        for (let row = 0; row < pm.BOARD_HEIGHT; row++) {
            for (let col = 0; col < pm.BOARD_WIDTH; col++) {
                const tile = pm.tiles[row][col];
                let {isSelected, isMoving, remove, highlight} = getTileState(row, col, selectItem, targetItem, highlights);

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
                if (highlight) {
                    tile.element.classList.add('highlight');
                } else {
                    tile.element.classList.remove('highlight');
                }
            }
        }
    }

    pm.initView = initView;
    pm.resetBoard = resetBoard;
    pm.updateBoard = updateBoard;
    pm.updateState = updateState;
}).call(null, window.__pm = window.__pm || {});
