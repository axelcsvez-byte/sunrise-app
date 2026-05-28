// ===== STATE =====
let settings = JSON.parse(localStorage.getItem('sunriseSettings')) || {
    alarmTime: '07:00',
    duration: 30,
    color: 'warm',
    brightness: 100
};

let alarmActive = false;
let alarmTimeout = null;
let sunriseInterval = null;
let testMode = false;

// ===== COLOR THEMES =====
const colorThemes = {
    warm: {
        stages: [
            { bg: '#000000', sun: 'rgba(139, 0, 0, 0)', glow: '0 0 0px rgba(139, 0, 0, 0)' },
            { bg: '#1a0000', sun: 'rgba(139, 0, 0, 0.3)', glow: '0 0 20px rgba(139, 0, 0, 0.3)' },
            { bg: '#2d0a00', sun: 'rgba(178, 34, 34, 0.5)', glow: '0 0 40px rgba(178, 34, 34, 0.4)' },
            { bg: '#4a1500', sun: 'rgba(255, 69, 0, 0.7)', glow: '0 0 60px rgba(255, 69, 0, 0.5)' },
            { bg: '#6b2000', sun: 'rgba(255, 100, 0, 0.8)', glow: '0 0 80px rgba(255, 100, 0, 0.5)' },
            { bg: '#8b3a00', sun: 'rgba(255, 140, 0, 0.9)', glow: '0 0 100px rgba(255, 140, 0, 0.6)' },
            { bg: '#b35400', sun: 'rgba(255, 165, 0, 0.95)', glow: '0 0 120px rgba(255, 165, 0, 0.6)' },
            { bg: '#cc6600', sun: 'rgba(255, 180, 50, 1)', glow: '0 0 140px rgba(255, 180, 50, 0.7)' },
            { bg: '#e67a00', sun: 'rgba(255, 200, 80, 1)', glow: '0 0 160px rgba(255, 200, 80, 0.7)' },
            { bg: '#ff9933', sun: 'rgba(255, 220, 100, 1)', glow: '0 0 180px rgba(255, 220, 100, 0.8)' },
            { bg: '#ffb347', sun: 'rgba(255, 240, 150, 1)', glow: '0 0 200px rgba(255, 240, 150, 0.9)' }
        ]
    },
    golden: {
        stages: [
            { bg: '#000000', sun: 'rgba(100, 80, 0, 0)', glow: '0 0 0px rgba(100, 80, 0, 0)' },
            { bg: '#0f0d00', sun: 'rgba(120, 100, 0, 0.3)', glow: '0 0 20px rgba(120, 100, 0, 0.3)' },
            { bg: '#1f1a00', sun: 'rgba(150, 120, 0, 0.5)', glow: '0 0 40px rgba(150, 120, 0, 0.4)' },
            { bg: '#332b00', sun: 'rgba(180, 150, 0, 0.6)', glow: '0 0 60px rgba(180, 150, 0, 0.5)' },
            { bg: '#4d4000', sun: 'rgba(200, 170, 0, 0.7)', glow: '0 0 80px rgba(200, 170, 0, 0.5)' },
            { bg: '#665500', sun: 'rgba(220, 190, 20, 0.8)', glow: '0 0 100px rgba(220, 190, 20, 0.6)' },
            { bg: '#806b00', sun: 'rgba(240, 200, 40, 0.85)', glow: '0 0 120px rgba(240, 200, 40, 0.65)' },
            { bg: '#997f00', sun: 'rgba(250, 210, 60, 0.9)', glow: '0 0 140px rgba(250, 210, 60, 0.7)' },
            { bg: '#b39500', sun: 'rgba(255, 220, 80, 0.95)', glow: '0 0 160px rgba(255, 220, 80, 0.75)' },
            { bg: '#ccaa00', sun: 'rgba(255, 235, 100, 1)', glow: '0 0 180px rgba(255, 235, 100, 0.85)' },
            { bg: '#e6c200', sun: 'rgba(255, 250, 150, 1)', glow: '0 0 200px rgba(255, 250, 150, 0.9)' }
        ]
    },
    cool: {
        stages: [
            { bg: '#000000', sun: 'rgba(0, 0, 80, 0)', glow: '0 0 0px rgba(0, 0, 80, 0)' },
            { bg: '#000510', sun: 'rgba(20, 40, 120, 0.3)', glow: '0 0 20px rgba(20, 40, 120, 0.3)' },
            { bg: '#000a1f', sun: 'rgba(40, 70, 150, 0.5)', glow: '0 0 40px rgba(40, 70, 150, 0.4)' },
            { bg: '#001033', sun: 'rgba(59, 100, 180, 0.6)', glow: '0 0 60px rgba(59, 100, 180, 0.5)' },
            { bg: '#00184d', sun: 'rgba(59, 130, 200, 0.7)', glow: '0 0 80px rgba(59, 130, 200, 0.5)' },
            { bg: '#002066', sun: 'rgba(80, 150, 220, 0.8)', glow: '0 0 100px rgba(80, 150, 220, 0.6)' },
            { bg: '#003080', sun: 'rgba(100, 170, 235, 0.85)', glow: '0 0 120px rgba(100, 170, 235, 0.65)' },
            { bg: '#004099', sun: 'rgba(130, 190, 245, 0.9)', glow: '0 0 140px rgba(130, 190, 245, 0.7)' },
            { bg: '#0050b3', sun: 'rgba(147, 197, 253, 0.95)', glow: '0 0 160px rgba(147, 197, 253, 0.75)' },
            { bg: '#1a6fcc', sun: 'rgba(170, 210, 255, 1)', glow: '0 0 180px rgba(170, 210, 255, 0.85)' },
            { bg: '#3d8be6', sun: 'rgba(200, 230, 255, 1)', glow: '0 0 200px rgba(200, 230, 255, 0.9)' }
        ]
    },
    white: {
        stages: [
            { bg: '#000000', sun: 'rgba(50, 50, 50, 0)', glow: '0 0 0px rgba(50, 50, 50, 0)' },
            { bg: '#0a0a0a', sun: 'rgba(80, 80, 80, 0.3)', glow: '0 0 20px rgba(80, 80, 80, 0.3)' },
            { bg: '#1a1a1a', sun: 'rgba(120, 120, 120, 0.5)', glow: '0 0 40px rgba(120, 120, 120, 0.4)' },
            { bg: '#2a2a2a', sun: 'rgba(150, 150, 150, 0.6)', glow: '0 0 60px rgba(150, 150, 150, 0.5)' },
            { bg: '#3d3d3d', sun: 'rgba(180, 180, 180, 0.7)', glow: '0 0 80px rgba(180, 180, 180, 0.5)' },
            { bg: '#555555', sun: 'rgba(200, 200, 200, 0.8)', glow: '0 0 100px rgba(200, 200, 200, 0.6)' },
            { bg: '#707070', sun: 'rgba(220, 220, 220, 0.85)', glow: '0 0 120px rgba(220, 220, 220, 0.65)' },
            { bg: '#8a8a8a', sun: 'rgba(235, 235, 235, 0.9)', glow: '0 0 140px rgba(235, 235, 235, 0.7)' },
            { bg: '#a6a6a6', sun: 'rgba(245, 245, 245, 0.95)', glow: '0 0 160px rgba(245, 245, 245, 0.8)' },
            { bg: '#c4c4c4', sun: 'rgba(250, 250, 250, 1)', glow: '0 0 180px rgba(250, 250, 250, 0.85)' },
            { bg: '#e0e0e0', sun: 'rgba(255, 255, 255, 1)', glow: '0 0 200px rgba(255, 255, 255, 0.9)' }
        ]
    }
};

// ===== INIT =====
function init() {
    loadSettings();
    checkActiveAlarm();
    setupListeners();
    registerServiceWorker();
}

function loadSettings() {
    document.getElementById('alarm-time').value = settings.alarmTime;
    document.getElementById('duration-display').textContent = settings.duration;
    document.getElementById('brightness-slider').value = settings.brightness;
    document.getElementById('brightness-value').textContent = settings.brightness + '%';
    selectColor(settings.color);
}

function setupListeners() {
    document.getElementById('alarm-time').addEventListener('change', (e) => {
        settings.alarmTime = e.target.value;
        saveSettings();
    });

    document.getElementById('brightness-slider').addEventListener('input', (e) => {
        settings.brightness = parseInt(e.target.value);
        document.getElementById('brightness-value').textContent = settings.brightness + '%';
        saveSettings();
    });
}

function saveSettings() {
    localStorage.setItem('sunriseSettings', JSON.stringify(settings));
}

// ===== DURATION =====
function adjustDuration(amount) {
    settings.duration = Math.max(5, Math.min(120, settings.duration + amount));
    document.getElementById('duration-display').textContent = settings.duration;
    saveSettings();
}

// ===== COLOR SELECTION =====
function selectColor(color) {
    settings.color = color;
    saveSettings();

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

// ===== ALARM =====
function startAlarm() {
    const alarmTime = settings.alarmTime;
    if (!alarmTime) {
        alert('Please set an alarm time.');
        return;
    }

    const now = new Date();
    const [hours, minutes] = alarmTime.split(':').map(Number);

    let alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0, 0);

    // If alarm time is in the past, set it for tomorrow
    if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    // Calculate sunrise start time
    const sunriseStartTime = new Date(alarmDate.getTime() - (settings.duration * 60 * 1000));

    // Save alarm info
    const alarmInfo = {
        alarmTime: alarmDate.getTime(),
        sunriseStart: sunriseStartTime.getTime(),
        active: true
    };
    localStorage.setItem('activeAlarm', JSON.stringify(alarmInfo));

    alarmActive = true;

    // Show active alarm indicator
    showActiveAlarm(alarmDate, sunriseStartTime);

    // Calculate time until sunrise starts
    const timeUntilSunrise = sunriseStartTime.getTime() - now.getTime();

    if (timeUntilSunrise <= 0) {
        // Sunrise should already be in progress
        beginSunrise();
    } else {
        // Wait until sunrise start time
        alarmTimeout = setTimeout(() => {
            beginSunrise();
        }, timeUntilSunrise);
    }

    // Request wake lock to keep screen on
    requestWakeLock();
}

function showActiveAlarm(alarmDate, sunriseStartTime) {
    const activeAlarmDiv = document.getElementById('active-alarm');
    activeAlarmDiv.classList.remove('hidden');

    document.getElementById('active-alarm-time').textContent = formatTimeDisplay(alarmDate);
    document.getElementById('sunrise-start-time').textContent = formatTimeDisplay(sunriseStartTime);
}

function formatTimeDisplay(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function checkActiveAlarm() {
    const alarmInfo = JSON.parse(localStorage.getItem('activeAlarm'));
    if (!alarmInfo || !alarmInfo.active) return;

    const now = Date.now();

    // If alarm time has passed, clear it
    if (now > alarmInfo.alarmTime + 60000) {
        localStorage.removeItem('activeAlarm');
        return;
    }

    alarmActive = true;

    const alarmDate = new Date(alarmInfo.alarmTime);
    const sunriseStartTime = new Date(alarmInfo.sunriseStart);

    showActiveAlarm(alarmDate, sunriseStartTime);

    const timeUntilSunrise = alarmInfo.sunriseStart - now;

    if (timeUntilSunrise <= 0) {
        beginSunrise();
    } else {
        alarmTimeout = setTimeout(() => {
            beginSunrise();
        }, timeUntilSunrise);
    }
}

function cancelAlarm() {
    alarmActive = false;
    testMode = false;

    if (alarmTimeout) clearTimeout(alarmTimeout);
    if (sunriseInterval) clearInterval(sunriseInterval);

    localStorage.removeItem('activeAlarm');

    document.getElementById('active-alarm').classList.add('hidden');
    document.getElementById('sunrise-screen').classList.add('hidden');
    document.getElementById('dismiss-btn').classList.add('hidden');

    releaseWakeLock();
}

function dismissAlarm() {
    cancelAlarm();
}

// ===== SUNRISE ANIMATION =====
function beginSunrise() {
    const screen = document.getElementById('sunrise-screen');
    screen.classList.remove('hidden');

    const alarmInfo = JSON.parse(localStorage.getItem('activeAlarm'));
    let totalDuration;
    let alarmEndTime;

    if (testMode) {
        totalDuration = 10 * 1000; // 10 seconds for test
        alarmEndTime = Date.now() + totalDuration;
    } else if (alarmInfo) {
        alarmEndTime = alarmInfo.alarmTime;
        totalDuration = settings.duration * 60 * 1000;
    } else {
        return;
    }

    const stages = colorThemes[settings.color].stages;
    const maxBrightness = settings.brightness / 100;

    requestWakeLock();

    sunriseInterval = setInterval(() => {
        const now = Date.now();
        const startTime = alarmEndTime - totalDuration;
        const elapsed = now - startTime;
        let progress = Math.min(elapsed / totalDuration, 1);

        // Apply progress to stages
        const stageIndex = Math.min(Math.floor(progress * (stages.length - 1)), stages.length - 1);
        const stageProgress = (progress * (stages.length - 1)) - stageIndex;
        const currentStage = stages[stageIndex];
        const nextStage = stages[Math.min(stageIndex + 1, stages.length - 1)];

        // Apply colors
        const sunEl = document.getElementById('sun');
        const screenEl = document.getElementById('sunrise-screen');

        screenEl.style.background = currentStage.bg;
        sunEl.style.background = currentStage.sun;
        sunEl.style.boxShadow = currentStage.glow;

        // Scale sun size based on progress
        const sunSize = 80 + (progress * 60);
        sunEl.style.width = sunSize + 'px';
        sunEl.style.height = sunSize + 'px';

        // Apply max brightness as opacity filter
        screenEl.style.opacity = maxBrightness;

        // Update info
        const timeDisplay = document.getElementById('sunrise-time-display');
        const progressText = document.getElementById('sunrise-progress-text');

        const currentTime = new Date();
        timeDisplay.textContent = currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        progressText.textContent = Math.round(progress * 100) + '% brightness';

        // When complete
        if (progress >= 1) {
            clearInterval(sunriseInterval);
            document.getElementById('dismiss-btn').classList.remove('hidden');

            // Vibrate to alert
            if (navigator.vibrate) {
                navigator.vibrate([300, 200, 300, 200, 300]);
            }
        }
    }, 500);
}

// ===== TEST SUNRISE =====
function testSunrise() {
    testMode = true;

    const alarmInfo = {
        alarmTime: Date.now() + (10 * 1000),
        sunriseStart: Date.now(),
        active: true
    };
    localStorage.setItem('activeAlarm', JSON.stringify(alarmInfo));

    beginSunrise();
}

// ===== WAKE LOCK =====
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });
        }
    } catch (err) {
        console.log('Wake Lock error:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
    }
}

// Re-acquire wake lock if page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && alarmActive) {
        requestWakeLock();
    }
});

// ===== SERVICE WORKER =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('SW registered'))
            .catch(err => console.log('SW failed:', err));
    }
}

// ===== INIT ON LOAD =====
init();
