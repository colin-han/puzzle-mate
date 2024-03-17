(function (pm) {
    let timerBar;
    let interval;
    let paused = false;

    // 更新计时条宽度
    function updateTimerBar() {
        const widthPercentage = (pm.timer / 90) * 100;
        timerBar.style.width = widthPercentage + '%';
    }

    function initTimer() {
        timerBar = document.getElementById('timer-bar');
    }

    // 开始计时器
    function startTimer() {
        pm.timer = 90; // 初始计时器设置为90秒
        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        updateTimerBar();
        interval = setInterval(function () {
            if (paused) return;

            pm.timer--;
            updateTimerBar();
            if (pm.timer <= 0) {
                clearInterval(interval);
                interval = null;
                // 游戏结束逻辑
                pm.gameOver();
            }
        }, 1000); // 每秒更新一次计时器
    }

    function pause() {
        paused = true;
    }

    function resume() {
        paused = false;
    }

    // 模拟消除一堆棋子并增加计时器
    function onElimination() {
        pm.timer += 2; // 每消除一堆棋子，增加2秒计时器
        if (pm.timer > 90) {
            pm.timer = 90; // 限制计时器最大值为90秒
        }
        updateTimerBar();
    }

    pm.initTimer = initTimer;
    pm.startTimer = startTimer;
    pm.pauseTimer = pause;
    pm.resumeTimer = resume;
    pm.onElimination = onElimination;
}).call(null, window.__pm = window.__pm || {});
