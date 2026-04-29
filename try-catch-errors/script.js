const errorWords = [
    "undefined", "null", "NaN", "TypeError", "SyntaxError", 
    "ReferenceError", "404_NotFound", "CORS_Policy", "StackOverflow", 
    "MemoryLeak", "SegmentationFault", "InfiniteLoop", "PromiseRejected",
    "ModuleNotFound", "NetworkError", "500_InternalServerError", 
    "UncaughtException", "IndexOutOfBounds", "MergeConflict", "GitPushForce"
];

let gameState = 'START'; // START, PLAYING, GAMEOVER
let score = 0; // Caught errors
let highScore = parseInt(localStorage.getItem('tce_highscore')) || 0;
let integrity = 100;
let activeErrors = [];
let targetError = null;

let spawnRate = 3500;
let fallSpeed = 0.5; // pixels per frame (roughly 60fps)
let lastSpawn = 0;
let animationId;

let diffMultiplier = 1.0;
let initialSpawnRate = 3500;
let initialFallSpeed = 0.5;

const playArea = document.getElementById('play-area');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const integrityEl = document.getElementById('integrity');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

highScoreEl.innerText = highScore;

// Global handleInput function
function handleInput(key) {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
        if (key === 'Enter') {
            startGame();
        }
        return;
    }
    
    if (gameState !== 'PLAYING') return;

    const letter = key;
    
    if (targetError) {
        if (targetError.typeLetter(letter)) {
            if (targetError.isComplete()) {
                targetError.destroy(true);
                activeErrors = activeErrors.filter(e => e !== targetError);
                targetError = null;
            }
        }
    } else {
        const possibleTargets = activeErrors
            .filter(err => err.word[0].toLowerCase() === letter.toLowerCase())
            .sort((a, b) => b.y - a.y);
            
        if (possibleTargets.length > 0) {
            targetError = possibleTargets[0];
            targetError.element.classList.add('targeted');
            targetError.typeLetter(letter);
            
            if (targetError.isComplete()) {
                targetError.destroy(true);
                activeErrors = activeErrors.filter(e => e !== targetError);
                targetError = null;
            }
        }
    }
}

// Mobile Keyboard handling
const mobileKeyboard = document.getElementById('mobile-keyboard');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    mobileKeyboard.classList.remove('hidden');
}

document.querySelectorAll('.key').forEach(keyBtn => {
    keyBtn.addEventListener('click', (e) => {
        const key = e.target.innerText;
        if (key === '↵') {
            handleInput('Enter');
        } else {
            handleInput(key);
        }
    });
});

// Difficulty selection
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const diff = e.target.dataset.diff;
        if(diff === 'easy') { diffMultiplier = 0.7; initialSpawnRate = 4500; initialFallSpeed = 0.3; }
        if(diff === 'normal') { diffMultiplier = 1.0; initialSpawnRate = 3500; initialFallSpeed = 0.5; }
        if(diff === 'hard') { diffMultiplier = 1.5; initialSpawnRate = 2000; initialFallSpeed = 0.9; }
    });
});

class ErrorWord {
    constructor() {
        this.word = errorWords[Math.floor(Math.random() * errorWords.length)];
        this.typedCount = 0;
        
        this.element = document.createElement('div');
        this.element.className = 'error-word';
        this.updateHTML();
        
        // Random horizontal position
        this.x = Math.random() * (playArea.clientWidth - 150) + 20;
        this.y = -30;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        playArea.appendChild(this.element);
    }
    
    updateHTML() {
        const typedPart = this.word.substring(0, this.typedCount);
        const untypedPart = this.word.substring(this.typedCount);
        this.element.innerHTML = `<span class="typed">${typedPart}</span>${untypedPart}`;
    }
    
    typeLetter(letter) {
        if (this.word[this.typedCount].toLowerCase() === letter.toLowerCase()) {
            this.typedCount++;
            this.updateHTML();
            return true;
        }
        return false;
    }
    
    isComplete() {
        return this.typedCount === this.word.length;
    }
    
    destroy(success) {
        if (success) {
            this.element.classList.add('destroyed');
            score += 1; // 1 caught error
            scoreEl.innerText = score;
        } else {
            this.element.remove();
            integrity -= 15;
            if(integrity < 0) integrity = 0;
            integrityEl.innerText = integrity;
            
            // Visual shake for damage
            document.body.style.transform = "translate(5px, 5px)";
            setTimeout(() => document.body.style.transform = "none", 50);
        }
        
        setTimeout(() => {
            if(this.element.parentNode) {
                this.element.remove();
            }
        }, 300);
    }
}

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    integrity = 100;
    spawnRate = initialSpawnRate;
    fallSpeed = initialFallSpeed;
    
    scoreEl.innerText = score;
    integrityEl.innerText = integrity;
    
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    
    // Clear area
    playArea.innerHTML = '';
    activeErrors = [];
    targetError = null;
    lastSpawn = performance.now();
    
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(animationId);
    finalScoreEl.innerText = score;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tce_highscore', highScore);
        highScoreEl.innerText = highScore;
    }
    
    gameOverScreen.classList.add('active');
}

function gameLoop(timestamp) {
    if (gameState !== 'PLAYING') return;
    
    // Spawn new errors
    if (timestamp - lastSpawn > spawnRate) {
        activeErrors.push(new ErrorWord());
        lastSpawn = timestamp;
    }
    
    // Acceleration over time
    if(spawnRate > 800) spawnRate -= 0.5 * diffMultiplier; // Decrease spawn wait time
    if(fallSpeed < 3.5) fallSpeed += 0.0003 * diffMultiplier; // Increase fall speed
    
    // Move errors and check bounds
    const serverHeight = playArea.clientHeight - 60; // Approximate crash line
    
    for (let i = activeErrors.length - 1; i >= 0; i--) {
        let err = activeErrors[i];
        err.y += fallSpeed;
        err.element.style.transform = `translateY(${err.y}px)`;
        
        if (err.y > serverHeight) {
            // Hit the server!
            err.destroy(false);
            activeErrors.splice(i, 1);
            if(err === targetError) targetError = null;
            
            if (integrity <= 0) {
                gameOver();
                return; // Stop processing frame
            }
        }
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
    if(e.key === " ") e.preventDefault();
    
    // Ignore meta keys
    if(e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1 && e.key !== 'Enter') return;
    
    handleInput(e.key);
});