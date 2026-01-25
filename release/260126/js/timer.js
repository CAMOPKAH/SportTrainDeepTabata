// ================= ЛОГИКА ТАЙМЕРА =================

function updateTimer() {
    if (getIsPaused()) return;
    
    const currentTime = getCurrentTime();
    const countdownTime = workoutConfig.countdownTime;
    
    if (currentTime <= countdownTime && currentTime > 0) {
        if (!getCountdownActive()) {
            setCountdownActive(true);
        }
        speakCountdown(currentTime);
    } else {
        setCountdownActive(false);
    }
    
    setCurrentTime(currentTime - 1);
    
    if (getCurrentTime() <= 0) {
        handleTimerComplete();
    }
    
    updateDisplay();
}

function handleTimerComplete() {
    setCountdownActive(false);
    
    const phase = getCurrentPhase();
    const exerciseIndex = getCurrentExerciseIndex();
    const circle = getCurrentCircle();
    const totalCircles = getTotalCircles();
    
    switch(phase) {
        case 'work':
            speak("Упражнение завершено");
            
            if (exerciseIndex === exercises.length - 1) {
                if (circle === totalCircles) {
                    completeWorkout();
                    return;
                } else {
                    setCurrentPhase('circleRest');
                    setCurrentTime(workoutConfig.circleRestTime);
                    // Во время отдыха между кругами говорим о следующем круге
                    speak("Отдых между кругами. Следующий круг начинается с " + 
                          exercises[0].name.toLowerCase());
                }
            } else {
                setCurrentPhase('rest');
                setCurrentTime(workoutConfig.restTime);
                // Во время отдыха говорим о следующем упражнении
                const nextEx = exercises[exerciseIndex + 1];
                speak("Отдых. Далее: " + nextEx.name.toLowerCase());
            }
            break;
            
        case 'rest':
            setCurrentExerciseIndex(exerciseIndex + 1);
            setCurrentPhase('work');
            setCurrentTime(workoutConfig.workTime);
            speakExerciseWithTechnique();
            break;
            
        case 'circleRest':
            setCurrentCircle(circle + 1);
            setCurrentExerciseIndex(0);
            setCurrentPhase('work');
            setCurrentTime(workoutConfig.workTime);
            
            if (getCurrentCircle() <= totalCircles) {
                speak(`Начинаем ${getCurrentCircle()} круг`);
                speakExerciseWithTechnique();
            }
            break;
    }
    
    updateDisplay();
}
