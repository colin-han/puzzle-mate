(function (pm) {
    const frames = [];

    function getFrame(row, col) {
        if (!frames[row]) {
            frames[row] = [];
        }
        const r = frames[row];
        if (!r[col]) {
            r[col] = generateFrame(row, col);
        }
        return `move-path-${row}-${col}`;
    }

    function offset(col) {
        return col * (pm.TILE_SIZE + pm.TILE_SPACING);
    }

    function generateFrame(row, col) {
        const style = document.createElement("style");
        style.type = 'text/css';
        let name = `move-path-${row}-${col}`;
        if (row === 0) {
            style.innerHTML = `@keyframes ${name} {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(${(offset(col))}px); }
                }`;
        } else if (col === 0) {
            style.innerHTML = `@keyframes ${name} {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(${offset(row)}px); }
                }`;
        } else {
            style.innerHTML = `@keyframes ${name} {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(${(offset(col))}px, 0); }
                    100% { transform: translate(${(offset(col))}px, ${offset(row)}px); }
                }`;
        }
        document.head.appendChild(style);
        return name;
    }

    pm.getFrame = getFrame;
}).call(null,window.__pm = window.__pm || {});
