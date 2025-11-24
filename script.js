(function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas not found! Please ensure index.html is loaded first.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // --- SEEDING FUNCTIONALITY (Omitted for brevity) ---
    let seed = 12345;
    function seededRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    // --- END SEEDING ---

    // --- COLOR SCHEMES (Omitted for brevity) ---
    const LEVEL_SCHEMES = {
        'level1Button': { 
            bgPrimary: '#222', bgSecondary: '#555', ground: '#FFFFFF', 
            playerCore: '#00FF00', playerAccent: '#00E000', 
            obsPrimary: '#FF0000', obsAccent: '#B00000'
        },
        'level2Button': { 
            bgPrimary: '#1a1a2e', bgSecondary: '#2b2c45', ground: '#4c4c6a',
            playerCore: '#ff007f', playerAccent: '#e70068',
            obsPrimary: '#00ccff', obsAccent: '#0099cc'
        },
        'level3Button': { 
            bgPrimary: '#967969', bgSecondary: '#b99b6b', ground: '#d8c29b',
            playerCore: '#228b22', playerAccent: '#1e7b1e',
            obsPrimary: '#8b0000', obsAccent: '#660000'
        },
        'level4Button': { 
            bgPrimary: '#000000', bgSecondary: '#111111', ground: '#FF69B4',
            playerCore: '#00FFFF', playerAccent: '#00CCCC',
            obsPrimary: '#FFD700', obsAccent: '#CCAA00'
        },
        'level5Button': { 
            bgPrimary: '#3a7bd5', bgSecondary: '#00d2ff', ground: '#E0FFFF',
            playerCore: '#ff4500', playerAccent: '#cc3700',
            obsPrimary: '#008080', obsAccent: '#005555'
        },
        'level6Button': { 
            bgPrimary: '#440000', bgSecondary: '#660000', ground: '#ff4500',
            playerCore: '#FFA500', playerAccent: '#CC8400',
            obsPrimary: '#FFFFFF', obsAccent: '#CCCCCC'
        },
        'level7Button': { 
            bgPrimary: '#0f3d0f', bgSecondary: '#295c29', ground: '#4a3228',
            playerCore: '#FFD700', playerAccent: '#CCAA00',
            obsPrimary: '#8A2BE2', obsAccent: '#6C22B4'
        },
        'level8Button': { 
            bgPrimary: '#000000', bgSecondary: '#050505', ground: '#333333',
            playerCore: '#7CFC00', playerAccent: '#65D500',
            obsPrimary: '#DC143C', obsAccent: '#A9102E'
        },
        'level9Button': { 
            bgPrimary: '#4B0082', bgSecondary: '#6A5ACD', ground: '#DA70D6',
            playerCore: '#FFC0CB', playerAccent: '#CC99A4',
            obsPrimary: '#00FF7F', obsAccent: '#00CC66'
        },
        'level10Button': { 
            bgPrimary: '#332b1d', bgSecondary: '#665337', ground: '#FFD700',
            playerCore: '#FFFFFF', playerAccent: '#CCCCCC',
            obsPrimary: '#8B4513', obsAccent: '#5C2D0D'
        },
        'infiniteMode': { 
            bgPrimary: '#000033', bgSecondary: '#000055', ground: '#00CCFF',
            playerCore: '#FFD700', playerAccent: '#CCAA00',
            obsPrimary: '#FF4500', obsAccent: '#CC3700'
        }
    };
    
    // --- LEVEL DEFINITIONS (Omitted for brevity) ---
    const levelData1 = [
        [0, 50, 'spike'], [120, 70, 'block'], [150, 40, 'spike'], [100, 100, 'block'], 
        [200, 60, 'spike'], [100, 80, 'block'], [120, 50, 'spike'], [200, 50, 'spike'], 
        [100, 70, 'block'], [150, 40, 'spike'], [100, 100, 'block'], [200, 60, 'spike'], 
        [100, 80, 'block'], [120, 50, 'spike'], [200, 50, 'spike'], [500, 0, 'END']
    ];
    
    const levelData2 = [
        [0, 20, 'block'], [80, 20, 'block'], [80, 20, 'block'], [200, 80, 'spike'], 
        [100, 40, 'spike'], [100, 40, 'spike'], [250, 60, 'block'], [120, 40, 'spike'], 
        [120, 40, 'spike'], [120, 40, 'spike'], [200, 100, 'block'], [80, 50, 'spike'], 
        [80, 50, 'spike'], [300, 0, 'END']
    ];

    const levelData3 = [
        [0, 100, 'block'], [200, 20, 'spike'], [100, 40, 'block'], [200, 60, 'spike'], 
        [100, 80, 'block'], [200, 100, 'spike'], [200, 20, 'block'], [100, 40, 'spike'], 
        [200, 60, 'block'], [100, 80, 'spike'], [200, 100, 'block'], [300, 0, 'END']
    ];

    const levelData4 = [
        [0, 50, 'spike'], [50, 50, 'spike'], [50, 50, 'spike'], [200, 80, 'block'], 
        [120, 40, 'spike'], [120, 40, 'spike'], [120, 40, 'spike'], [300, 90, 'block'], 
        [100, 100, 'block'], [100, 20, 'block'], [250, 50, 'spike'], [500, 0, 'END']
    ];

    const levelData5 = [
        [0, 20, 'spike'], [50, 40, 'spike'], [50, 60, 'spike'], [50, 80, 'spike'], [50, 100, 'spike'], 
        [200, 100, 'block'], [100, 80, 'block'], [100, 60, 'block'], [100, 40, 'block'], [100, 20, 'block'], 
        [300, 50, 'spike'], [500, 0, 'END']
    ];

    const levelData6 = [
        [0, 80, 'block'], [80, 40, 'spike'], [80, 40, 'spike'], [80, 40, 'spike'], [200, 100, 'block'], 
        [100, 20, 'spike'], [100, 20, 'spike'], [100, 20, 'spike'], [250, 60, 'block'], [300, 0, 'END']
    ];

    const levelData7 = [
        [0, 20, 'block'], [40, 40, 'spike'], [60, 60, 'block'], [80, 80, 'spike'], [100, 100, 'block'], 
        [200, 20, 'block'], [80, 80, 'spike'], [60, 60, 'block'], [40, 40, 'spike'], [20, 20, 'block'], 
        [350, 0, 'END']
    ];
    
    const levelData8 = [
        [0, 100, 'spike'], [150, 20, 'block'], [150, 100, 'spike'], [150, 20, 'block'], [150, 100, 'spike'], 
        [150, 20, 'block'], [400, 0, 'END']
    ];

    const levelData9 = [
        [0, 40, 'spike'], [40, 60, 'block'], [40, 80, 'spike'], [40, 100, 'block'], [40, 80, 'spike'], 
        [40, 60, 'block'], [40, 40, 'spike'], [150, 20, 'block'], [150, 20, 'block'], [300, 0, 'END']
    ];

    const levelData10 = [
        [0, 20, 'spike'], [60, 40, 'block'], [60, 60, 'spike'], [60, 80, 'block'], [60, 100, 'spike'], 
        [80, 100, 'block'], [80, 80, 'spike'], [80, 60, 'block'], [80, 40, 'spike'], [80, 20, 'block'],
        [300, 0, 'END']
    ];

    const ALL_LEVELS = {
        'level1Button': { data: levelData1, name: 'Level 1' },
        'level2Button': { data: levelData2, name: 'Level 2' },
        'level3Button': { data: levelData3, name: 'Level 3' },
        'level4Button': { data: levelData4, name: 'Level 4' },
        'level5Button': { data: levelData5, name: 'Level 5' },
        'level6Button': { data: levelData6, name: 'Level 6' },
        'level7Button': { data: levelData7, name: 'Level 7' },
        'level8Button': { data: levelData8, name: 'Level 8' },
        'level9Button': { data: levelData9, name: 'Level 9' },
        'level10Button': { data: levelData10, name: 'Level 10' }
    };

    function calculateLevelLength(data) {
        let length = 0;
        data.forEach(item => {
            length += item[0];
        });
        return length + 50; 
    }

    // --- Game Speed Control / Infinite Mode Control (Omitted for brevity) ---
    const INITIAL_SPEED = 5;
    const MAX_SPEED = 20; 
    const SPEED_ACCELERATION_RATE = 0.001; 
    const INITIAL_MIN_DELAY = 90;
    const INITIAL_MAX_DELAY = 180;
    const ABSOLUTE_MIN_DELAY = 30; 
    const DELAY_DECREASE_RATE = 0.02; 
    
    // --- Global Game Variables ---
    let player, gravity, gameSpeed, obstacles, isGameOver, isLevelComplete, frames;
    let backgroundObjects = [];
    let currentLevelData; 
    let currentLevelName; 
    let levelLength = 0; 
    let obstacleIndex = 0; 
    let frameDelay = 0;
    let activeColors = LEVEL_SCHEMES['level1Button']; 
    let animationFrameId; 
    let isInfiniteMode = false; 

    let lastPlayedMode = 'level'; 
    let lastPlayedLevelKey = 'level1Button'; 
    
    // NEW: Variable to hold the code menu timeout ID
    let codeMenuTimeoutId = null; 

    let activeSkin = 'default'; 
    const mrJonesImage = new Image();
    mrJonesImage.src = 'Mr Jones.png'; 
    
    mrJonesImage.onload = () => {
        console.log("Mr Jones.png loaded successfully.");
    };
    mrJonesImage.onerror = () => {
        console.error("Failed to load Mr Jones.png. Falling back to default skin.");
    };

    let score = 0;
    let infiniteObstacleTimer = 0;
    
    // --- Player/Obstacle Properties (Omitted for brevity) ---
    const playerWidth = 30;
    const playerHeight = 30;
    const jumpStrength = 13;
    const actualGroundY = canvas.height - 20; 
    const groundY = actualGroundY - playerHeight; 
    const obstacleWidth = 20;
    
    // --- Game Initialization (Omitted for brevity) ---
    function init(mode, levelKey = null) {
        console.log("init() called for mode:", mode, "key:", levelKey);
        cancelAnimationFrame(animationFrameId); 

        isInfiniteMode = (mode === 'infinite');
        
        lastPlayedMode = mode;
        lastPlayedLevelKey = levelKey;

        if (isInfiniteMode) {
            currentLevelData = [];
            currentLevelName = 'Infinite Mode';
            activeColors = LEVEL_SCHEMES['infiniteMode'];
            score = 0;
            infiniteObstacleTimer = INITIAL_MAX_DELAY; 
        } else {
            const levelInfo = ALL_LEVELS[levelKey];
            if (!levelInfo) {
                console.error("Invalid level key:", levelKey);
                showMainMenu();
                return; 
            }
            
            currentLevelData = levelInfo.data;
            currentLevelName = levelInfo.name;
            levelLength = calculateLevelLength(currentLevelData);
            activeColors = LEVEL_SCHEMES[levelKey]; 
            
            if (currentLevelData && currentLevelData.length > 0) {
                frameDelay = currentLevelData[0][0]; 
            } else {
                frameDelay = 0; 
            }
            obstacleIndex = 0; 
        }
        
        seed = 12345; 
        
        player = {
            x: 100, y: groundY, width: playerWidth, height: playerHeight,
            velocityY: 0, isJumping: false
        };

        gravity = 0.7;
        gameSpeed = INITIAL_SPEED; 
        obstacles = [];
        isGameOver = false;
        isLevelComplete = false; 
        frames = 0;

        backgroundObjects = [];
        for (let i = 0; i < 10; i++) {
            backgroundObjects.push({
                x: seededRandom() * canvas.width, 
                y: seededRandom() * (actualGroundY - 100), 
                width: seededRandom() * 50 + 20, 
                height: (actualGroundY - 20) - (seededRandom() * 200), 
            });
        }

        const screenText = document.getElementById('screenText');
        if (screenText) {
            screenText.remove();
        }
        
        gameLoop();
    }
    
    function retryGame() { /* Omitted for brevity */ }
    function gameLoop() { /* Omitted for brevity */ }
    function updateGameSpeed() { /* Omitted for brevity */ }
    function updateObstacles() { /* Omitted for brevity */ }
    function checkLevelEnd() { /* Omitted for brevity */ }
    function updatePlayer() { /* Omitted for brevity */ }
    function updateProgressScore() { /* Omitted for brevity */ }
    function updateInfiniteScore() { /* Omitted for brevity */ }
    function showLevelComplete() { /* Omitted for brevity */ }
    function showGameOver() { /* Omitted for brevity */ }
    function handleInput() { /* Omitted for brevity */ }
    function drawBackground() { /* Omitted for brevity */ }
    function drawGround() { /* Omitted for brevity */ }
    function drawPlayer() { /* Omitted for brevity */ }
    function drawObstacle(obs) { /* Omitted for brevity */ }
    function checkCollision(player, obstacle) { /* Omitted for brevity */ }
    
    // --- Menu Logic and Event Listeners ---
    const mainMenu = document.getElementById('mainMenu');
    const levelSelectMenu = document.getElementById('levelSelect');
    const codeMenu = document.getElementById('codeMenu'); 
    const instructions = document.getElementById('instructions');

    function showMainMenu() {
        cancelAnimationFrame(animationFrameId); 
        
        // FIX: Clear the code menu timeout if it's pending
        if (codeMenuTimeoutId !== null) {
            clearTimeout(codeMenuTimeoutId);
            codeMenuTimeoutId = null;
        }

        if (mainMenu) mainMenu.style.display = 'block'; 
        if (levelSelectMenu) levelSelectMenu.style.display = 'none';
        if (codeMenu) codeMenu.style.display = 'none'; 
        if (canvas) canvas.style.display = 'none';
        if (instructions) instructions.style.display = 'none';
        
        document.body.style.backgroundColor = '#222';

        const screenText = document.getElementById('screenText');
        if (screenText) {
            screenText.remove();
        }
        
        const retryBtn = document.getElementById('retryButton');
        const menuBtn = document.getElementById('menuButton');
        if (retryBtn) retryBtn.removeEventListener('click', retryGame);
        if (menuBtn) menuBtn.removeEventListener('click', showMainMenu);
    }

    // --- CODE MENU LOGIC ---
    function showCodeMenu() {
        cancelAnimationFrame(animationFrameId);
        
        // FIX: Clear any existing pending timeout when explicitly entering code menu
        if (codeMenuTimeoutId !== null) {
            clearTimeout(codeMenuTimeoutId);
            codeMenuTimeoutId = null;
        }

        if (mainMenu) mainMenu.style.display = 'none';
        if (levelSelectMenu) levelSelectMenu.style.display = 'none';
        if (canvas) canvas.style.display = 'none';
        if (instructions) instructions.style.display = 'none';

        const screenText = document.getElementById('screenText');
        if (screenText) screenText.remove();

        if (document.getElementById('codeInput')) document.getElementById('codeInput').value = '';
        if (document.getElementById('codeMessage')) document.getElementById('codeMessage').textContent = '';

        if (codeMenu) {
            codeMenu.style.display = 'flex';
        } else {
            console.error("Code menu element not found!");
        }
    }

    function checkCode() {
        const inputElement = document.getElementById('codeInput');
        const messageElement = document.getElementById('codeMessage');
        
        if (!inputElement || !messageElement) return;

        const code = inputElement.value.trim();

        if (code === 'Mr Jones') {
            activeSkin = 'mrjones';
            messageElement.style.color = 'green';
            messageElement.textContent = 'Code accepted! Mr Jones skin unlocked!';
            console.log("Code accepted. Returning to main menu in 1.5 seconds...");
            // FIX: Store the timeout ID
            codeMenuTimeoutId = setTimeout(showMainMenu, 1500); 
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Invalid code. Try again.';
            inputElement.value = ''; 
        }
    }
    // --- END CODE MENU LOGIC ---
    
    document.addEventListener('click', (e) => {
        const targetId = e.target.id;
        
        console.log("Clicked ID:", targetId); 
        
        if (targetId === 'levelsButton') {
            // FIX: Clear pending timeout if moving to level select
            if (codeMenuTimeoutId !== null) {
                clearTimeout(codeMenuTimeoutId);
                codeMenuTimeoutId = null;
            }
            mainMenu.style.display = 'none';
            levelSelectMenu.style.display = 'flex'; 
        } else if (targetId === 'infiniteButton') {
            // FIX: Clear pending timeout if starting infinite mode
            if (codeMenuTimeoutId !== null) {
                clearTimeout(codeMenuTimeoutId);
                codeMenuTimeoutId = null;
            }
            init('infinite');
            mainMenu.style.display = 'none';
            canvas.style.display = 'block'; 
            instructions.style.display = 'block'; 
        } else if (targetId === 'codeButton') { 
            showCodeMenu();
        } else if (targetId === 'codeSubmitButton') { 
            checkCode();
        } else if (targetId === 'codeMenuBackButton') { 
            showMainMenu();
        } else if (e.target.classList.contains('level-button')) {
            // Level Button Click Handler
            console.log("Level Button Identified. ID:", targetId);
            if (targetId && ALL_LEVELS[targetId]) {
                // FIX: Clear pending timeout before starting a level
                if (codeMenuTimeoutId !== null) {
                    clearTimeout(codeMenuTimeoutId);
                    codeMenuTimeoutId = null;
                }

                levelSelectMenu.style.display = 'none';
                canvas.style.display = 'block'; 
                instructions.style.display = 'block'; 
                init('level', targetId);
            } else {
                console.error("Failed to start level. Target ID is invalid or missing level data:", targetId);
            }
        } 
        else if (isLevelComplete && document.getElementById('screenText')) { 
            showMainMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (isLevelComplete) { 
                showMainMenu(); 
            } else if (canvas.style.display === 'block') {
                handleInput(); 
            }
        }
        if (e.code === 'Enter' && codeMenu && codeMenu.style.display === 'flex') {
            checkCode();
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!isGameOver && !isLevelComplete && canvas.style.display === 'block') {
             handleInput(); 
        } 
    });
    
    showMainMenu(); 
})();
