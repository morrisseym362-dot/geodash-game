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

    // --- Game Constants & Variables ---
    const INITIAL_SPEED = 5;
    const actualGroundY = canvas.height - 20; 
    const playerWidth = 30;
    const playerHeight = 30;
    const groundY = actualGroundY - playerHeight; 
    
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
    
    // Crucial variable for the fix: holds the timeout ID for the code menu
    let codeMenuTimeoutId = null; 

    // Skin variables
    let activeSkin = 'default'; 
    const mrJonesImage = new Image();
    mrJonesImage.src = 'Mr Jones.png'; 
    let mrJonesLoaded = false;
    
    mrJonesImage.onload = () => { mrJonesLoaded = true; };
    mrJonesImage.onerror = () => { console.error("Failed to load Mr Jones.png. Fallback."); mrJonesLoaded = false; };

    // --- Game Initialization ---
    function init(mode, levelKey = null) {
        cancelAnimationFrame(animationFrameId); 

        isInfiniteMode = (mode === 'infinite');
        
        // Setup game state based on mode/level (logic omitted for brevity)
        if (isInfiniteMode) {
            currentLevelData = [];
            currentLevelName = 'Infinite Mode';
            activeColors = LEVEL_SCHEMES['infiniteMode'];
        } else {
            const levelInfo = ALL_LEVELS[levelKey];
            currentLevelData = levelInfo.data;
            currentLevelName = levelInfo.name;
            levelLength = calculateLevelLength(currentLevelData);
            activeColors = LEVEL_SCHEMES[levelKey]; 
            obstacleIndex = 0; 
            frameDelay = currentLevelData.length > 0 ? currentLevelData[0][0] : 0;
        }
        
        seed = 12345; 
        
        player = { x: 100, y: groundY, width: playerWidth, height: playerHeight, velocityY: 0, isJumping: false };
        gravity = 0.7;
        gameSpeed = INITIAL_SPEED; 
        obstacles = [];
        isGameOver = false;
        isLevelComplete = false; 
        frames = 0;

        // Background objects initialization (omitted for brevity)
        backgroundObjects = [];
        for (let i = 0; i < 10; i++) {
             backgroundObjects.push({ x: seededRandom() * canvas.width, y: seededRandom() * (actualGroundY - 100), width: seededRandom() * 50 + 20, height: (actualGroundY - 20) - (seededRandom() * 200), speed: gameSpeed * 0.3 });
        }

        const screenText = document.getElementById('screenText');
        if (screenText) {
            screenText.remove();
        }
        
        gameLoop();
    }
    
    // --- Core Game Functions (Omitted for brevity) ---
    function gameLoop() {
        if (isGameOver || isLevelComplete) {
            if (isGameOver) showGameOver();
            if (isLevelComplete) showLevelComplete();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawGround();
        updatePlayer();
        drawPlayer();
        updateObstacles(); 
        // Score/Progress updates (omitted for brevity)
        frames++;
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // --- DRAWING FUNCTIONS (FIXED drawPlayer) ---
    function drawBackground() {
        const parallaxSpeed = gameSpeed * 0.3; 
        ctx.fillStyle = activeColors.bgSecondary; 
        for (let obj of backgroundObjects) {
            obj.x -= parallaxSpeed; 
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            if (obj.x + obj.width < 0) {
                obj.x = canvas.width;
            }
        }
        document.body.style.backgroundColor = activeColors.bgPrimary; 
        canvas.style.backgroundColor = activeColors.bgPrimary;
    }

    function drawGround() {
        ctx.fillStyle = activeColors.ground; 
        ctx.fillRect(0, actualGroundY, canvas.width, 20); 
    }

    function drawPlayer() {
        // --- FIX: Use explicit large dimensions for the custom skin ---
        if (activeSkin === 'mrjones' && mrJonesLoaded) {
            const imgWidth = 70; // Larger size for the character image
            const imgHeight = 70;
            // Center the larger image over the player's position
            const drawX = player.x + player.width / 2 - imgWidth / 2;
            const drawY = player.y + player.height - imgHeight; 
            ctx.drawImage(mrJonesImage, drawX, drawY, imgWidth, imgHeight);

        } else {
            // Draw the default player skin (used for default and if image fails to load)
            ctx.fillStyle = activeColors.playerAccent; 
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = activeColors.playerCore; 
            ctx.fillRect(player.x + 4, player.y + 4, player.width - 8, player.height - 8);
            ctx.fillStyle = 'white'; 
            ctx.fillRect(player.x + 10, player.y + 8, 12, 8);
            ctx.fillStyle = 'black'; 
            ctx.fillRect(player.x + 18, player.y + 10, 4, 4);
        }
    }
    
    // --- Other Game/Menu Functions (updateObstacles, checkCollision, showGameOver, showMainMenu, etc. omitted for brevity) ---

    // Function to run when a game mode is selected
    function startGame(mode, levelKey = null) {
        // 1. CRITICAL FIX: Defensively clear any pending menu transitions
        if (codeMenuTimeoutId !== null) {
            clearTimeout(codeMenuTimeoutId);
            codeMenuTimeoutId = null;
        }

        // 2. Set the correct display state
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('levelSelect').style.display = 'none';
        document.getElementById('codeMenu').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block'; 
        document.getElementById('instructions').style.display = 'block';

        // 3. Initialize and start the game
        init(mode, levelKey);
    }
    
    // --- Menu Functions ---
    function showMainMenu() {
        cancelAnimationFrame(animationFrameId); 
        
        // FIX: Clear the code menu timeout if it's pending
        if (codeMenuTimeoutId !== null) {
            clearTimeout(codeMenuTimeoutId);
            codeMenuTimeoutId = null;
        }
        // Display logic for main menu (omitted for brevity)
        document.getElementById('mainMenu').style.display = 'block'; 
        document.getElementById('levelSelect').style.display = 'none';
        document.getElementById('codeMenu').style.display = 'none'; 
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        
        const screenText = document.getElementById('screenText');
        if (screenText) { screenText.remove(); }
    }

    function showCodeMenu() {
        cancelAnimationFrame(animationFrameId);
        
        // FIX: Clear any existing pending timeout when explicitly entering code menu
        if (codeMenuTimeoutId !== null) {
            clearTimeout(codeMenuTimeoutId);
            codeMenuTimeoutId = null;
        }
        // Display logic for code menu (omitted for brevity)
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('levelSelect').style.display = 'none';
        document.getElementById('codeMenu').style.display = 'flex';
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';

        document.getElementById('codeInput').value = '';
        document.getElementById('codeMessage').textContent = '';
    }

    function checkCode() {
        const inputElement = document.getElementById('codeInput');
        const messageElement = document.getElementById('codeMessage');
        const code = inputElement.value.trim();

        if (code === 'Mr Jones') {
            activeSkin = 'mrjones';
            messageElement.style.color = 'green';
            messageElement.textContent = 'Code accepted! Mr Jones skin unlocked! Returning to menu...';
            // Store the timeout ID
            codeMenuTimeoutId = setTimeout(showMainMenu, 1500); 
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Invalid code. Try again.';
            inputElement.value = ''; 
        }
    }
    
    // --- Event Listeners (using the new startGame function) ---
    document.addEventListener('click', (e) => {
        const targetId = e.target.id;
        
        if (targetId === 'levelsButton') {
            // FIX: Clear timeout when moving to level select
            if (codeMenuTimeoutId !== null) {
                clearTimeout(codeMenuTimeoutId);
                codeMenuTimeoutId = null;
            }
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('levelSelect').style.display = 'flex'; 
        } else if (targetId === 'infiniteButton') {
            startGame('infinite');
        } else if (targetId === 'codeButton') { 
            showCodeMenu();
        } else if (targetId === 'codeSubmitButton') { 
            checkCode();
        } else if (targetId === 'codeMenuBackButton') { 
            showMainMenu();
        } else if (e.target.classList.contains('level-button')) {
            const levelKey = targetId;
            if (levelKey && ALL_LEVELS[levelKey]) {
                startGame('level', levelKey);
            }
        } 
        // Click to return to menu from end screen
        else if (isLevelComplete && document.getElementById('screenText')) { 
            showMainMenu();
        }
    });

    // Input listeners (handleInput, etc. omitted for brevity)

    showMainMenu(); 
})();
