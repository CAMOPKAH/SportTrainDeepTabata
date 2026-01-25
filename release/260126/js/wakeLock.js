// ================= WAKE LOCK И KEEP ALIVE =================

function startMouseMoveKeepAlive() {
    if (getMouseKeepAliveInterval()) return;
    
    const interval = setInterval(() => {
        const x = Math.floor(Math.random() * 3);
        const y = Math.floor(Math.random() * 3);
        
        window.dispatchEvent(new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        }));
    }, 10000);
    
    setMouseKeepAliveInterval(interval);
    
    const keepAliveInfo = document.getElementById('keepAliveInfo');
    keepAliveInfo.innerHTML = '<i class="fas fa-bolt"></i> Экран активен <span class="pulse"></span>';
    keepAliveInfo.classList.remove('wakelock');
    keepAliveInfo.classList.add('active');
}

function stopMouseMoveKeepAlive() {
    const interval = getMouseKeepAliveInterval();
    if (interval) {
        clearInterval(interval);
        setMouseKeepAliveInterval(null);
        const keepAliveInfo = document.getElementById('keepAliveInfo');
        keepAliveInfo.classList.remove('active');
    }
}

async function requestWakeLock() {
    const isSecureContext = window.isSecureContext || 
                           window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';
    
    if (wakeLockSupported && isSecureContext) {
        try {
            if (getWakeLock() !== null) return;
            
            const wakeLock = await navigator.wakeLock.request('screen');
            setWakeLock(wakeLock);
            
            const keepAliveInfo = document.getElementById('keepAliveInfo');
            keepAliveInfo.innerHTML = '<i class="fas fa-bolt"></i> Экран активен <span class="pulse success"></span>';
            keepAliveInfo.classList.add('active', 'wakelock');
            
            wakeLock.addEventListener('release', () => {
                const keepAliveInfo = document.getElementById('keepAliveInfo');
                keepAliveInfo.classList.remove('active');
                setWakeLock(null);
                
                if (getIsRunning() && !getIsPaused()) {
                    startMouseMoveKeepAlive();
                }
            });
            
            return;
            
        } catch (err) {
            console.error('Ошибка Wake Lock:', err);
        }
    }
    
    startMouseMoveKeepAlive();
}

async function releaseKeepAlive() {
    stopMouseMoveKeepAlive();
    
    const wakeLock = getWakeLock();
    if (wakeLock !== null) {
        try {
            await wakeLock.release();
            setWakeLock(null);
        } catch (err) {
            console.error('Ошибка при освобождении Wake Lock:', err);
        }
    }
    
    const keepAliveInfo = document.getElementById('keepAliveInfo');
    keepAliveInfo.classList.remove('active');
}
