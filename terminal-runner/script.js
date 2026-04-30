const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score-val');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const countdownScreen = document.getElementById('countdown-screen');
const countdownText = document.getElementById('countdown-text');
const finalScoreEl = document.getElementById('final-score');
const statusEl = document.getElementById('status');

let gameState = 'START'; // START, COUNTDOWN, PLAYING, GAMEOVER
let score = 0;
let highScore = parseInt(localStorage.getItem('tr_highscore')) || 0;
let animationId;

// High score init
document.getElementById('high-score-val').innerText = highScore;

// Player physics
let playerY = 0;
let playerVy = 0;
const gravity = -0.45;
const jumpPower = 11.5;
const groundY = 0; // 0 relative to bottom: 32px

// Obstacle management
let obstacles = [];
let gameSpeed = 5;
let obstacleTimer = 0;
let nextObstacleWait = 0;

const obstacleTypes = [
    "[ERROR]", "[FATAL]", "404_NOT_FOUND", "[SEGFAULT]", "UNDEFINED", "NULL_PTR"
];

function startCountdown() {
    gameState = 'COUNTDOWN';
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    countdownScreen.classList.add('active');
    
    let count = 3;
    countdownText.innerText = count;
    countdownText.style.fontSize = "6rem";
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = count;
        } else if (count === 0) {
            countdownText.innerText = "BUILD COMPLETED";
            countdownText.style.fontSize = "3.5rem";
        } else {
            clearInterval(interval);
            countdownScreen.classList.remove('active');
            startGame();
        }
    }, 1000);
}

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    gameSpeed = 5;
    playerY = groundY;
    playerVy = 0;
    
    scoreEl.innerText = score;
    statusEl.innerText = "STATUS: RUNNING";
    statusEl.style.color = "#33ff33";
    
    // Clear obstacles
    obstacles.forEach(obs => obs.element.remove());
    obstacles = [];
    nextObstacleWait = getRandomWait();
    obstacleTimer = 0;
    
    player.style.bottom = (32 + playerY) + 'px';
    
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(animationId);
    
    const finalScore = Math.floor(score);
    finalScoreEl.innerText = finalScore;
    
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('tr_highscore', highScore);
        document.getElementById('high-score-val').innerText = highScore;
    }
    
    statusEl.innerText = window.t ? window.t('tr_status_crashed') : "STATUS: CRASHED";
    statusEl.style.color = "#ff3333";
    gameOverScreen.classList.add('active');
    
    // Visual shake
    document.body.style.transform = "translate(10px, 10px)";
    setTimeout(() => document.body.style.transform = "none", 100);
}

function getRandomWait() {
    // Frames to wait before next obstacle. Decreases as speed increases.
    const baseWait = 80;
    const randWait = Math.random() * 60;
    return Math.max(30, (baseWait + randWait) - (gameSpeed * 2));
}

function spawnObstacle() {
    const text = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const el = document.createElement('div');
    el.className = 'obstacle';
    el.innerText = text;
    gameArea.appendChild(el);
    
    // Starting X position (just outside right edge)
    const x = gameArea.clientWidth;
    el.style.left = x + 'px';
    
    obstacles.push({ element: el, x: x, width: 0 }); // Width calculated later
}

let lastTime = 0;

function gameLoop(time) {
    if (gameState !== 'PLAYING') return;
    
    // Frame delta for smooth scoring
    const dt = time - lastTime;
    lastTime = time;
    
    // Update Score
    score += dt * 0.05; // 50 score per second
    scoreEl.innerText = Math.floor(score);
    
    // Increase speed gradually over time
    gameSpeed += 0.0015;

    // --- Player Physics ---
    playerVy += gravity;
    playerY += playerVy;
    
    if (playerY <= groundY) {
        playerY = groundY;
        playerVy = 0;
    }
    
    player.style.bottom = (32 + playerY) + 'px';
    
    // Calculate player bounding box roughly based on its styling
    const playerRect = {
        left: 50,
        right: 50 + 40, // width 40
        top: 400 - (32 + playerY + 40), // Container height 400 - (bottom offset + height)
        bottom: 400 - (32 + playerY)
    };

    // --- Obstacle Logic ---
    obstacleTimer++;
    if (obstacleTimer >= nextObstacleWait) {
        spawnObstacle();
        obstacleTimer = 0;
        nextObstacleWait = getRandomWait();
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;
        obs.element.style.left = obs.x + 'px';
        
        // Populate width once it's rendered
        if (obs.width === 0) {
            obs.width = obs.element.clientWidth;
        }
        
        // Remove if off screen
        if (obs.x + obs.width < 0) {
            obs.element.remove();
            obstacles.splice(i, 1);
            continue;
        }
        
        // --- Collision Detection ---
        // Obstacle rect
        const obsRect = {
            left: obs.x,
            right: obs.x + obs.width,
            top: 400 - (32 + 28), // Approx height 28px due to increased font
            bottom: 400 - 32
        };
        
        // AABB Collision (Shrunk slightly for generosity)
        const margin = 5;
        if (
            playerRect.left + margin < obsRect.right - margin &&
            playerRect.right - margin > obsRect.left + margin &&
            playerRect.top + margin < obsRect.bottom - margin &&
            playerRect.bottom - margin > obsRect.top + margin
        ) {
            gameOver();
            return;
        }
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

function jump() {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
        startCountdown();
        return;
    }
    
    // Only jump if on the ground (no double jumping)
    if (gameState === 'PLAYING' && playerY === groundY) {
        playerVy = jumpPower;
    }
}

// Global input listener
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
});

function handleInteraction(e) {
    // Ignore if clicking on home button or language toggle
    if (e.target.closest('.home-btn') || e.target.closest('.lang-btn')) return;
    
    // Prevent default to stop scrolling/zooming on jump taps
    if (e.type === 'touchstart') {
        e.preventDefault();
    }
    
    jump();
}

// Touch events for mobile
document.addEventListener('touchstart', handleInteraction, { passive: false });

// Mouse events for desktop (only if touch is not supported to avoid double trigger)
document.addEventListener('mousedown', (e) => {
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        handleInteraction(e);
    }
});