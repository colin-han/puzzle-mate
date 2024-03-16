(function (pm) {
    const frames = [];
    const styles = {};

    function getAnimationName(path) {
        const name = `move-path-${path.direction}-${path.steps.join('-')}`;
        if (!styles[name]) {
            generateFrameStyle(name, path);
        }
        return name;
    }

    function generateFrameStyle(name, path) {
        const style = document.createElement("style");
        style.type = 'text/css';
        style.innerHTML = generateFrameContent(name, path);
        document.head.appendChild(style);
        styles[name] = style;
    }

    function generateFrameContent(name, path) {
        const length = getLength(path);
        let horizontal = path.direction === 'left' || path.direction === 'right';
        let x = 0, y = 0, step = 0;
        let content = `@keyframes ${name} {\n`;
        content += `  0% { transform: translate(${x}px, ${y}px) }\n`;
        for (let i = 0; i < path.steps.length; i++) {
            const s = path.steps[i];
            step += Math.abs(s);
            if (horizontal) {
                x += s * (pm.TILE_SIZE + pm.TILE_SPACING);
            } else {
                y += s * (pm.TILE_SIZE + pm.TILE_SPACING);
            }
            horizontal = !horizontal;
            const stepPercent = Math.floor(step / length * 100, 2);
            content += `  ${stepPercent}% { transform: translate(${x}px, ${y}px) }\n`;
        }
        content += "}\n";
        return content;
    }

    function getLength(path) {
        return path.steps.reduce((a, b) => a + Math.abs(b), 0);
    }

    function getAnimationDuration(path) {
        return getLength(path) * 0.05 + 's';
    }

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
    pm.getAnimationName = getAnimationName;
    pm.getAnimationDuration = getAnimationDuration;
}).call(null,window.__pm = window.__pm || {});
