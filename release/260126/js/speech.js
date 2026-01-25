// ================= ГОЛОСОВЫЕ ОПОВЕЩЕНИЯ =================

function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = getSpeechVolume();
    
    const voices = speechSynthesis.getVoices();
    const russianVoice = voices.find(voice => 
        voice.lang.includes('ru') || voice.lang.includes('RU'));
    
    if (russianVoice) utterance.voice = russianVoice;
    speechSynthesis.speak(utterance);
}

function speakCountdown(seconds) {
    if (seconds > 0 && seconds <= 5) speak(seconds.toString());
}

function speakExerciseWithTechnique() {
    const exercise = exercises[getCurrentExerciseIndex()];
    let textToSpeak = `Начинаем ${exercise.name}`;
    
    if (getSpeakTechnique()) {
        textToSpeak += `. ${exercise.technique}`;
    }
    
    speak(textToSpeak);
}
