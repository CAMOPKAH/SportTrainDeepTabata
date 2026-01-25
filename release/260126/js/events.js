// ================= ОБРАБОТЧИКИ СОБЫТИЙ =================

function setupEventListeners() {
    // Обработчики клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && getIsFullscreen()) {
            setTimeout(updateFullscreenButton, 100);
        }
        
        if (e.code === 'Space') {
            e.preventDefault();
            if (getIsRunning()) {
                togglePause();
            } else {
                startWorkout();
            }
        }
        
        if (e.code === 'KeyR' && e.ctrlKey) {
            e.preventDefault();
            resetWorkout();
        }
        
        if (e.code === 'KeyF') {
            e.preventDefault();
            toggleFullscreen();
        }
        
        if (e.code === 'KeyH' && e.ctrlKey) {
            e.preventDefault();
            toggleTechniqueVoice();
        }
    });
    
    // Восстановление Wake Lock при возврате на вкладку
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && getIsRunning() && !getIsPaused()) {
            try {
                await requestWakeLock();
            } catch (err) {
                console.error('Не удалось восстановить активность экрана:', err);
            }
        }
    });
    
    // Очистка при закрытии страницы
    window.addEventListener('beforeunload', () => {
        const wakeLock = getWakeLock();
        if (wakeLock !== null) {
            wakeLock.release();
        }
        const interval = getMouseKeepAliveInterval();
        if (interval) {
            clearInterval(interval);
        }
    });
    
    // Предотвращение случайного закрытия или обновления страницы во время тренировки
    window.addEventListener('beforeunload', (e) => {
        if (getIsRunning()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}
