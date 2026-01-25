// ================= УПРАВЛЕНИЕ СОСТОЯНИЕМ ПРИЛОЖЕНИЯ =================

// Состояние таймера
let currentTime = 45; // Инициализируется позже через initState() после загрузки config.js
let timerInterval = null;
let countdownActive = false;

// Состояние тренировки
let isRunning = false;
let isPaused = false;
let currentPhase = 'work'; // 'work', 'rest', 'circleRest'
let currentExerciseIndex = 0;
let currentCircle = 1;
let totalCircles = 5;

// Состояние интерфейса
let isFullscreen = false;
let speechVolume = 1;
let speakTechnique = true;

// Wake Lock состояние
let wakeLock = null;
let mouseKeepAliveInterval = null;
const wakeLockSupported = 'wakeLock' in navigator;

// Геттеры для состояния
function getCurrentTime() { return currentTime; }
function getIsRunning() { return isRunning; }
function getIsPaused() { return isPaused; }
function getCurrentPhase() { return currentPhase; }
function getCurrentExerciseIndex() { return currentExerciseIndex; }
function getCurrentCircle() { return currentCircle; }
function getTotalCircles() { return totalCircles; }
function getIsFullscreen() { return isFullscreen; }
function getSpeechVolume() { return speechVolume; }
function getSpeakTechnique() { return speakTechnique; }
function getTimerInterval() { return timerInterval; }
function getCountdownActive() { return countdownActive; }
function getWakeLock() { return wakeLock; }
function getMouseKeepAliveInterval() { return mouseKeepAliveInterval; }

// Сеттеры для состояния
function setCurrentTime(value) { currentTime = value; }
function setIsRunning(value) { isRunning = value; }
function setIsPaused(value) { isPaused = value; }
function setCurrentPhase(value) { currentPhase = value; }
function setCurrentExerciseIndex(value) { currentExerciseIndex = value; }
function setCurrentCircle(value) { currentCircle = value; }
function setTotalCircles(value) { totalCircles = value; }
function setIsFullscreen(value) { isFullscreen = value; }
function setSpeechVolume(value) { speechVolume = value; }
function setSpeakTechnique(value) { speakTechnique = value; }
function setTimerInterval(value) { timerInterval = value; }
function setCountdownActive(value) { countdownActive = value; }
function setWakeLock(value) { wakeLock = value; }
function setMouseKeepAliveInterval(value) { mouseKeepAliveInterval = value; }

// Инициализация состояния
function initState() {
    currentTime = workoutConfig.workTime;
}

// Сброс состояния к начальным значениям
function resetState() {
    currentTime = workoutConfig.workTime;
    isRunning = false;
    isPaused = false;
    currentPhase = 'work';
    currentExerciseIndex = 0;
    currentCircle = 1;
    countdownActive = false;
    timerInterval = null;
}
