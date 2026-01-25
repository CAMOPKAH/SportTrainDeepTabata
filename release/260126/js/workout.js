// ================= УПРАВЛЕНИЕ ТРЕНИРОВКОЙ =================

async function startWorkout() {
    if (getIsRunning()) return;
    
    setIsRunning(true);
    setIsPaused(false);
    
    // Обновление кнопок
    const startBtn = document.getElementById('startBtn');
    const startBtnMobile = document.getElementById('startBtnMobile');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    const statusElement = document.getElementById('status');
    
    startBtn.disabled = true;
    startBtnMobile.disabled = true;
    pauseBtn.disabled = false;
    pauseBtnMobile.disabled = false;
    statusElement.textContent = 'Тренировка началась!';
    statusElement.style.color = '#72efdd';
    
    // Добавляем анимацию для кнопки старта
    startBtn.classList.add('pulse-animation');
    setTimeout(() => {
        startBtn.classList.remove('pulse-animation');
    }, 1500);
    
    await requestWakeLock();
    speakExerciseWithTechnique();
    setTimerInterval(setInterval(updateTimer, 1000));
}

async function togglePause() {
    if (!getIsRunning()) return;
    
    const isPaused = getIsPaused();
    setIsPaused(!isPaused);
    
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    const statusElement = document.getElementById('status');
    
    if (!isPaused) {
        clearInterval(getTimerInterval());
        setTimerInterval(null);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Продолжить';
        pauseBtnMobile.innerHTML = '<i class="fas fa-play"></i> Продолжить';
        statusElement.textContent = 'Пауза';
        statusElement.style.color = '#f9c74f';
        speak("Пауза");
        
        await releaseKeepAlive();
    } else {
        setTimerInterval(setInterval(updateTimer, 1000));
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
        pauseBtnMobile.innerHTML = '<i class="fas fa-pause"></i> Пауза';
        statusElement.textContent = 'Продолжаем тренировку';
        statusElement.style.color = '#72efdd';
        speak("Продолжаем");
        
        await requestWakeLock();
    }
}

async function resetWorkout() {
    clearInterval(getTimerInterval());
    setTimerInterval(null);
    
    resetState();
    
    const startBtn = document.getElementById('startBtn');
    const startBtnMobile = document.getElementById('startBtnMobile');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    const statusElement = document.getElementById('status');
    
    startBtn.disabled = false;
    startBtnMobile.disabled = false;
    pauseBtn.disabled = true;
    pauseBtnMobile.disabled = true;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
    pauseBtnMobile.innerHTML = '<i class="fas fa-pause"></i> Пауза';
    
    statusElement.textContent = 'Готов к началу тренировки';
    statusElement.style.color = '#f9c74f';
    
    await releaseKeepAlive();
    
    updateDisplay();
    speak("Тренировка сброшена");
}

async function completeWorkout() {
    clearInterval(getTimerInterval());
    setTimerInterval(null);
    setIsRunning(false);
    
    const statusElement = document.getElementById('status');
    const startBtn = document.getElementById('startBtn');
    const startBtnMobile = document.getElementById('startBtnMobile');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    
    statusElement.textContent = '🎉 Тренировка завершена! Отличная работа!';
    statusElement.style.color = '#f9c74f';
    startBtn.disabled = false;
    startBtnMobile.disabled = false;
    pauseBtn.disabled = true;
    pauseBtnMobile.disabled = true;
    
    await releaseKeepAlive();
    
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.classList.add('completed');
    });
    
    speak("Тренировка завершена! Отличная работа! Вы проделали огромный труд!");
}
