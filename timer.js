(function (pm) {
    let timerBar;

    // 更新计时条宽度
    function updateTimerBar() {
        const widthPercentage = (pm.timer / 90) * 100;
        timerBar.style.width = widthPercentage + '%';
    }

    // 开始计时器
    function startTimer() {
        pm.timer = 90; // 初始计时器设置为90秒
        timerBar = document.getElementById('timer-bar');

        updateTimerBar();
        const interval = setInterval(function () {
            pm.timer--;
            updateTimerBar();
            if (pm.timer <= 0) {
                clearInterval(interval);
                // 游戏结束逻辑
                pm.gameOver();
            }
        }, 1000); // 每秒更新一次计时器
    }

    // 模拟消除一堆棋子并增加计时器
    function onElimination() {
        pm.timer += 2; // 每消除一堆棋子，增加2秒计时器
        if (pm.timer > 90) {
            pm.timer = 90; // 限制计时器最大值为90秒
        }
        updateTimerBar();
    }

    pm.startTimer = startTimer;
    pm.onElimination = onElimination;
}).call(null, window.__pm = window.__pm || {});