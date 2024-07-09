let startTime;
let timerInterval;

function startTimer() {
    if (timerInterval) return; // Prevent starting the timer multiple times

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    document.removeEventListener('keyup', startTimer); // Remove the event listener after starting the timer
}

function updateTimer() {
    const now = Date.now();
    const elapsedTime = now - startTime;

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    document.getElementById('timer').textContent = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(unit) {
    return unit < 10 ? '0' + unit : unit;
}
