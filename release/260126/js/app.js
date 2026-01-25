// ================= ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =================

function init() {
    // Инициализация состояния
    initState();
    
    // Загружаем настройку озвучивания техники
    const savedSetting = localStorage.getItem('speakTechnique');
    if (savedSetting !== null) {
        setSpeakTechnique(savedSetting === 'true');
    }
    
    const hintToggleBtn = document.getElementById('hintToggle');
    hintToggleBtn.innerHTML = getSpeakTechnique() ? 
        '<i class="fas fa-bullhorn"></i> Озвучить технику ✓' : 
        '<i class="fas fa-bullhorn"></i> Озвучить технику';
    
    const circlesSelect = document.getElementById('circles');
    setTotalCircles(parseInt(circlesSelect.value));
    updateExerciseList();
    updateDisplay();
    
    // Основные кнопки
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const startBtnMobile = document.getElementById('startBtnMobile');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    const resetBtnMobile = document.getElementById('resetBtnMobile');
    
    startBtn.addEventListener('click', startWorkout);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetWorkout);
    
    // Мобильные кнопки для полноэкранного режима
    startBtnMobile.addEventListener('click', startWorkout);
    pauseBtnMobile.addEventListener('click', togglePause);
    resetBtnMobile.addEventListener('click', resetWorkout);
    
    hintToggleBtn.addEventListener('click', toggleTechniqueVoice);
    
    circlesSelect.addEventListener('change', () => {
        setTotalCircles(parseInt(circlesSelect.value));
        updateCircleInfo();
    });
    
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volumeValue');
    volumeSlider.addEventListener('input', (e) => {
        setSpeechVolume(parseFloat(e.target.value));
        volumeValue.textContent = `${Math.round(getSpeechVolume() * 100)}%`;
    });
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 
                             'mozfullscreenchange', 'MSFullscreenChange'];
    fullscreenEvents.forEach(event => {
        document.addEventListener(event, updateFullscreenButton);
    });
    
    const statusElement = document.getElementById('status');
    if (!('speechSynthesis' in window)) {
        statusElement.textContent = 'Внимание: Ваш браузер не поддерживает голосовые оповещения';
        statusElement.style.color = '#ff416c';
    }
    
    // Инициализация селектора программ
    initProgramSelector();
    
    // Обработчик для кнопки выбора программы
    document.getElementById('selectProgramBtn').addEventListener('click', openProgramSelector);
    
    // Настройка событий
    setupEventListeners();
    
    // Инициализация синтеза речи
    speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {};
    }
}

// Запуск приложения
window.addEventListener('DOMContentLoaded', init);
