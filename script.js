let timer;
let totalTimer;
let isWorkSession = true;
let workMinutes = 25;
let breakMinutes = 5;
let longBreakMinutes = 40;
let minutes = workMinutes;
let seconds = 0;
let totalMinutes = 0;
let totalSeconds = 0;
let isRunning = false;
let workSessionsCompleted = 0;
let cycleCount = 0;
const cycleDuration = 140; // Duration of one full cycle in minutes

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const totalMinutesDisplay = document.getElementById('totalMinutes');
const totalSecondsDisplay = document.getElementById('totalSeconds');
const cycleCountDisplay = document.getElementById('cycleCount');
const sessionLabel = document.getElementById('sessionLabel');
const beepSound = document.getElementById('beepSound');
const startBeep = document.getElementById('startBeep'); // New beep sound
const cycleBeep = document.getElementById('cycleBeep'); // Beep sound for end of 140 minutes

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
    if (!isRunning) {
        startBeep.play(); // Play start beep sound
        timer = setInterval(countdown, 1000);
        totalTimer = setInterval(updateTotalTime, 1000); // Start total time tracking
        isRunning = true;
        startButton.disabled = true;
    }
}

function countdown() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timer);
            switchSession();
            startTimer(); // Continue the cycle
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }

    updateDisplay();
}

function updateDisplay() {
    minutesDisplay.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
}

function updateTotalTime() {
    totalSeconds++;
    if (totalSeconds === 60) {
        totalMinutes++;
        totalSeconds = 0;
    }

    totalMinutesDisplay.textContent = totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;
    totalSecondsDisplay.textContent = totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds;

    // Check if total time has reached the end of a cycle (140 minutes)
    if (totalMinutes >= cycleDuration) {
        cycleBeep.play(); // Play beep sound for 140 minutes
        cycleCount++; // Increment cycle count
        cycleCountDisplay.textContent = cycleCount; // Update cycle count display
        totalMinutes = 0; // Reset total minutes for the next cycle
    }
}

function switchSession() {
    beepSound.play();
    if (isWorkSession) {
        workSessionsCompleted++;
        if (workSessionsCompleted % 4 === 0) {
            // Long break after every 4 work sessions
            minutes = longBreakMinutes;
            sessionLabel.textContent = "Long Break";
        } else {
            minutes = breakMinutes;
            sessionLabel.textContent = "Short Break";
        }
        isWorkSession = false;
    } else {
        minutes = workMinutes;
        sessionLabel.textContent = "Work Session";
        isWorkSession = true;
    }
}

function resetTimer() {
    clearInterval(timer);
    clearInterval(totalTimer); // Stop total time tracking
    isRunning = false;
    workSessionsCompleted = 0;
    minutes = workMinutes;
    seconds = 0;
    totalMinutes = 0;
    totalSeconds = 0;
    cycleCount = 0; // Reset cycle count
    cycleCountDisplay.textContent = cycleCount; // Update cycle count display
    isWorkSession = true;
    sessionLabel.textContent = "Work Session";
    updateDisplay();
    updateTotalTime(); // Update the display to 00:00
    startButton.disabled = false;
}
