// ================= ОБНОВЛЕНИЕ UI ЭЛЕМЕНТОВ =================

function updateDisplay() {
    const timerElement = document.getElementById('timer');
    const phaseElement = document.getElementById('phase');
    
    timerElement.textContent = getCurrentTime();
    phaseElement.textContent = getPhaseText(getCurrentPhase());
    updateCircleInfo();
    updateExerciseDetails();
}

function updateExerciseDetails() {
    const exerciseNameElement = document.getElementById('exerciseName');
    const techniqueElement = document.getElementById('technique');
    const nextExerciseElement = document.getElementById('nextExercise');
    const nextExerciseNameElement = document.getElementById('nextExerciseName');
    
    // Добавляем анимацию при смене упражнения
    exerciseNameElement.classList.add('fade-in-up');
    setTimeout(() => {
        exerciseNameElement.classList.remove('fade-in-up');
    }, 500);
    
    const currentIndex = getCurrentExerciseIndex();
    // Обновляем основное упражнение
    exerciseNameElement.textContent = exercises[currentIndex].name;
    techniqueElement.textContent = exercises[currentIndex].technique;
    
    // Определяем следующее упражнение
    let nextIndex = currentIndex + 1;
    let nextCircle = getCurrentCircle();
    
    if (nextIndex >= exercises.length) {
        nextIndex = 0;
        nextCircle = nextCircle + 1;
    }
    
    // Показываем информацию о следующем упражнении только если это не последний круг
    if (nextCircle <= getTotalCircles()) {
        nextExerciseNameElement.textContent = exercises[nextIndex].name;
    } else {
        nextExerciseNameElement.textContent = "Конец тренировки";
    }
    
    // Показываем/скрываем блок "Следующее" в зависимости от фазы
    const currentPhase = getCurrentPhase();
    if (currentPhase === 'rest' || currentPhase === 'circleRest') {
        nextExerciseElement.classList.add('show');
    } else {
        nextExerciseElement.classList.remove('show');
    }
    
    // Обновляем список упражнений
    updateActiveExercise();
}

function updateExerciseList() {
    const exercisesListElement = document.getElementById('exercisesList');
    exercisesListElement.innerHTML = '';
    
    exercises.forEach((exercise, index) => {
        const div = document.createElement('div');
        div.className = 'exercise-item';
        div.id = `exercise-${index}`;
        
        div.innerHTML = `
            <div class="exercise-number">${index + 1}</div>
            <div class="exercise-name">${exercise.name}</div>
            <div class="exercise-duration">45 сек</div>
        `;
        
        div.addEventListener('click', () => {
            if (!getIsRunning()) {
                setCurrentExerciseIndex(index);
                updateDisplay();
            }
        });
        exercisesListElement.appendChild(div);
    });
}

function updateActiveExercise() {
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.classList.remove('active', 'completed');
    });
    
    const currentIndex = getCurrentExerciseIndex();
    for (let i = 0; i < currentIndex; i++) {
        const item = document.getElementById(`exercise-${i}`);
        if (item) item.classList.add('completed');
    }
    
    const currentItem = document.getElementById(`exercise-${currentIndex}`);
    if (currentItem) currentItem.classList.add('active');
}

function getPhaseText(phase) {
    switch(phase) {
        case 'work': return 'Работа';
        case 'rest': return 'Отдых';
        case 'circleRest': return 'Отдых между кругами';
        default: return '';
    }
}

function updateCircleInfo() {
    const circleInfoElement = document.getElementById('circleInfo');
    circleInfoElement.textContent = `Круг: ${getCurrentCircle()}/${getTotalCircles()}`;
}

function toggleTechniqueVoice() {
    const speakTechnique = getSpeakTechnique();
    setSpeakTechnique(!speakTechnique);
    
    const hintToggleBtn = document.getElementById('hintToggle');
    hintToggleBtn.innerHTML = getSpeakTechnique() ? 
        '<i class="fas fa-bullhorn"></i> Озвучить технику ✓' : 
        '<i class="fas fa-bullhorn"></i> Озвучить технику';
    
    // Сохраняем настройку в localStorage
    localStorage.setItem('speakTechnique', getSpeakTechnique());
}
