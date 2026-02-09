// ===== Элементы DOM =====
const welcomeScreen = document.getElementById('welcomeScreen');
const messageScreen = document.getElementById('messageScreen');
const fortuneCookie = document.getElementById('fortuneCookie');
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const vinyl = document.getElementById('vinyl');
const visualizer = document.getElementById('visualizer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const replayBtn = document.getElementById('replayBtn');
const heartsContainer = document.getElementById('heartsContainer');
const sparklesContainer = document.getElementById('sparklesContainer');
const petalsContainer = document.getElementById('petalsContainer');

// ===== Состояние =====
let isPlaying = false;
let animationsStarted = false;

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => {
    startBackgroundAnimations();
    setupEventListeners();
});

// ===== Фоновые анимации =====
function startBackgroundAnimations() {
    if (animationsStarted) return;
    animationsStarted = true;

    // Создаём сердечки
    createHearts();
    setInterval(createHearts, 3000);

    // Создаём блёстки
    createSparkles();
    setInterval(createSparkles, 2000);

    // Создаём лепестки
    createPetals();
    setInterval(createPetals, 4000);
}

function createHearts() {
    const colors = ['#FF6B9D', '#FF8CB3', '#C44569', '#FF69B4', '#FFB6C1'];

    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = createHeartSVG(colors[Math.floor(Math.random() * colors.length)]);
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (8 + Math.random() * 7) + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.width = (20 + Math.random() * 30) + 'px';
        heart.style.height = heart.style.width;

        heartsContainer.appendChild(heart);

        // Удаляем после анимации
        setTimeout(() => heart.remove(), 20000);
    }
}

function createHeartSVG(color) {
    return `<svg viewBox="0 0 32 32">
        <path d="M16 28s-10-7.35-10-14c0-4.42 3.58-8 8-8 2.4 0 4.55 1.06 6 2.74 1.45-1.68 3.6-2.74 6-2.74 4.42 0 8 3.58 8 8 0 6.65-10 14-10 14z" fill="${color}"/>
    </svg>`;
}

function createSparkles() {
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (1 + Math.random() * 2) + 's';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.width = (5 + Math.random() * 10) + 'px';
        sparkle.style.height = sparkle.style.width;

        sparklesContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 5000);
    }
}

function createPetals() {
    for (let i = 0; i < 3; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (10 + Math.random() * 10) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.width = (15 + Math.random() * 15) + 'px';
        petal.style.height = petal.style.width;
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;

        petalsContainer.appendChild(petal);

        setTimeout(() => petal.remove(), 25000);
    }
}

// ===== Обработчики событий =====
function setupEventListeners() {
    // Печенье с предсказанием
    fortuneCookie.addEventListener('click', openCookie);

    // Плеер
    playBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', onSongEnd);
    progressBar.addEventListener('click', seek);

    // Replay кнопка
    replayBtn.addEventListener('click', replay);
}

// ===== Печенье =====
function openCookie() {
    if (fortuneCookie.classList.contains('opened')) return;

    fortuneCookie.classList.add('opened');

    // Создаём эффект блёсток при открытии
    createBurstEffect(fortuneCookie);

    // Переходим к экрану с сообщением
    setTimeout(() => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'translateY(-30px)';
        welcomeScreen.style.transition = 'all 0.5s ease-out';

        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            messageScreen.classList.remove('hidden');
            messageScreen.style.opacity = '0';
            messageScreen.style.transform = 'translateY(30px)';

            requestAnimationFrame(() => {
                messageScreen.style.transition = 'all 0.5s ease-out';
                messageScreen.style.opacity = '1';
                messageScreen.style.transform = 'translateY(0)';
            });

            // Автозапуск музыки через небольшую задержку
            setTimeout(() => {
                startMusic();
            }, 2500);
        }, 500);
    }, 1500);
}

function createBurstEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Золотые частицы
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const isGold = Math.random() > 0.5;
        const size = 6 + Math.random() * 12;

        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${isGold ?
                'radial-gradient(circle, #FFD700, #FFA500)' :
                ['#FF6B9D', '#FF69B4', '#FFB6C1', '#FF4081'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 ${isGold ? '15px #FFD700' : '10px rgba(255,107,157,0.5)'};
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 80 + Math.random() * 150;
        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'scale(1) rotate(0deg)', opacity: 1 },
            { transform: 'scale(0) rotate(360deg)', opacity: 0, left: endX + 'px', top: endY + 'px' }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, 0.9, 0.3, 1)'
        }).onfinish = () => particle.remove();
    }

    // Золотые звёзды
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.innerHTML = '✨';
        star.style.cssText = `
            position: fixed;
            font-size: ${16 + Math.random() * 20}px;
            pointer-events: none;
            z-index: 1001;
            left: ${centerX}px;
            top: ${centerY}px;
        `;

        document.body.appendChild(star);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 60 + Math.random() * 100;
        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity - 50;

        star.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1.5)', opacity: 1, offset: 0.3 },
            { transform: 'scale(0)', opacity: 0, left: endX + 'px', top: endY + 'px' }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => star.remove();
    }
}

// ===== Плеер =====
function startMusic() {
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
            vinyl.classList.add('spinning');
            visualizer.classList.add('playing');
        })
        .catch(e => {
            console.log('Autoplay prevented:', e);
            // Музыка не запустилась автоматически, пользователь нажмёт кнопку
        });
}

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updatePlayButton();
}

function updatePlayButton() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        vinyl.classList.add('spinning');
        visualizer.classList.add('playing');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        vinyl.classList.remove('spinning');
        visualizer.classList.remove('playing');
    }
}

function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = progress + '%';
    progressHandle.style.left = progress + '%';
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    durationEl.textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function onSongEnd() {
    isPlaying = false;
    updatePlayButton();
    audioPlayer.currentTime = 0;
}

// ===== Replay =====
function replay() {
    // Сбрасываем состояние
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    updatePlayButton();

    // Убираем класс открытого печенья
    fortuneCookie.classList.remove('opened');

    // Сбрасываем стили
    welcomeScreen.style.opacity = '';
    welcomeScreen.style.transform = '';
    welcomeScreen.style.transition = '';
    messageScreen.style.opacity = '';
    messageScreen.style.transform = '';
    messageScreen.style.transition = '';

    // Скрываем экран сообщения и показываем приветствие
    messageScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');

    // Сбрасываем анимации конверта и письма
    const envelopeFlap = document.querySelector('.envelope-flap');
    const letter = document.querySelector('.letter');
    if (envelopeFlap) {
        envelopeFlap.style.animation = 'none';
        envelopeFlap.offsetHeight; // Trigger reflow
        envelopeFlap.style.animation = '';
    }
    if (letter) {
        letter.style.animation = 'none';
        letter.offsetHeight; // Trigger reflow
        letter.style.animation = '';
    }
}

// ===== Эффекты при движении мыши =====
document.addEventListener('mousemove', (e) => {
    // Параллакс эффект для купидонов
    const cupids = document.querySelectorAll('.cupid');
    cupids.forEach((cupid, index) => {
        const speed = (index + 1) * 0.02;
        const x = (window.innerWidth / 2 - e.clientX) * speed;
        const y = (window.innerHeight / 2 - e.clientY) * speed;
        cupid.style.marginLeft = x + 'px';
        cupid.style.marginTop = y + 'px';
    });
});

// ===== Touch события для мобильных =====
let touchStartX = 0;
progressBar.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

progressBar.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.touches[0].clientX - rect.left) / rect.width;
    const clampedPercent = Math.max(0, Math.min(1, percent));
    audioPlayer.currentTime = clampedPercent * audioPlayer.duration;
});

// ===== Предзагрузка аудио =====
window.addEventListener('load', () => {
    audioPlayer.load();
});
