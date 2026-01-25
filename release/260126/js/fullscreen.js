// ================= ПОЛНОЭКРАННЫЙ РЕЖИМ =================

function toggleFullscreen() {
    if (!getIsFullscreen()) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

function updateFullscreenButton() {
    const fullscreenElement = document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement;
    setIsFullscreen(!!fullscreenElement);
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (getIsFullscreen()) {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        fullscreenBtn.title = 'Выйти из полноэкранного режима';
        document.body.classList.add('fullscreen');
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = 'Полноэкранный режим';
        document.body.classList.remove('fullscreen');
    }
}
