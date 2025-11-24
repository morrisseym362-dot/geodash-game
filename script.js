(function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas not found! Please ensure index.html is loaded first.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // --- SEEDING FUNCTIONALITY (Now only used for background objects) ---
    let seed = 12345;
    function seededRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    // --- END SEEDING ---

    // --- COLOR SCHEMES ---
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
        'infiniteMode': { // New scheme for Infinite Mode
            bgPrimary: '#000033', bgSecondary: '#000055', ground: '#00CCFF',
            playerCore: '#FFD700', playerAccent: '#CCAA00',
            obsPrimary: '#FF4500', obsAccent: '#CC3700'
        }
    };

    // --- LEVEL DEFINITIONS ---
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
        'level1Button': { data: levelData1, name: 'Level 1', number: 1 }, 
        'level2Button': { data: levelData2, name: 'Level 2', number: 2 },
        'level3Button': { data: levelData3, name: 'Level 3', number: 3 },
        'level4Button': { data: levelData4, name: 'Level 4', number: 4 },
        'level5Button': { data: levelData5, name: 'Level 5', number: 5 },
        'level6Button': { data: levelData6, name: 'Level 6', number: 6 },
        'level7Button': { data: levelData7, name: 'Level 7', number: 7 },
        'level8Button': { data: levelData8, name: 'Level 8', number: 8 },
        'level9Button': { data: levelData9, name: 'Level 9', number: 9 },
        'level10Button': { data: levelData10, name: 'Level 10', number: 10 }
    };

    function calculateLevelLength(data) {
        let length = 0;
        data.forEach(item => {
            length += item[0];
        });
        return length + 50; 
    }
    
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

    // --- SPEED CONSTANTS FOR PROGRESSION ---
    const BASE_SPEED = 5; 
    const LEVEL_SPEED_INCREMENT = 0.3; 
    const INFINITE_SPEED_UP_INTERVAL = 400; 
    const INFINITE_SPEED_UP_AMOUNT = 0.1; 
    
    // --- INFINITE MODE OBSTACLE TIMING CONSTANTS (MODIFIED) ---
    const BASE_MIN_DELAY = 90; // Starting minimum gap (frames)
    const BASE_MAX_DELAY = 180; // Starting maximum gap (frames)
    const MIN_POSSIBLE_DELAY = 45; // Absolute minimum gap limit
    const DELAY_REDUCTION_PER_SCORE = 2; // FRAMES REDUCED PER OBSTACLE PASSED (Increased from 1 to 2)
    
    // Infinite mode specific variables
    let score = 0;
    let infiniteObstacleTimer = 0;
    
    // --- Player/Obstacle Properties (Unchanged) ---
    const playerWidth = 30;
    const playerHeight = 30;
    const jumpStrength = 13;
    const actualGroundY = canvas.height - 20; 
    const groundY = actualGroundY - playerHeight; 
    const obstacleWidth = 20;
    
    // --- Game Initialization (Unchanged) ---
    function init(mode, levelKey = null) {
        cancelAnimationFrame(animationFrameId); 

        isInfiniteMode = (mode === 'infinite');
        
        if (isInfiniteMode) {
            currentLevelData = [];
            currentLevelName = 'Infinite Mode';
            activeColors = LEVEL_SCHEMES['infiniteMode'];
            score = 0;
            infiniteObstacleTimer = 120; // Initial delay
            gameSpeed = BASE_SPEED; 
        } else {
            const levelInfo = ALL_LEVELS[levelKey];
            currentLevelData = levelInfo.data;
            currentLevelName = levelInfo.name;
            levelLength = calculateLevelLength(currentLevelData);
            activeColors = LEVEL_SCHEMES[levelKey]; 
            
            // --- SET SPEED BASED ON LEVEL NUMBER ---
            const levelNumber = levelInfo.number;
            gameSpeed = BASE_SPEED + (levelNumber - 1) * LEVEL_SPEED_INCREMENT;
            // ----------------------------------------
            
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
                speed: gameSpeed * 0.3 
            });
        }

        const screenText = document.getElementById('screenText');
        if (screenText) {
            screenText.remove();
        }
        
        gameLoop();
    }
    
    // --- Game Loop (Unchanged) ---
    function gameLoop() {
        if (isGameOver) {
            showGameOver();
            return;
        }
        if (isLevelComplete) {
            showLevelComplete();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawGround();
        updatePlayer();
        drawPlayer();
        updateObstacles(); 
        if (!isInfiniteMode) {
            checkLevelEnd(); 
            updateProgressScore(); 
        } else {
            updateInfiniteScore();
        }
        frames++;
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // --- Core Game Functions (MODIFIED OBSTACLE GENERATION) ---
    function updateObstacles() {
        if (isInfiniteMode) {
            infiniteObstacleTimer--;

            // --- DYNAMIC OBSTACLE SPACING LOGIC (MODIFIED CONSTANT) ---
            const reduction = score * DELAY_REDUCTION_PER_SCORE;
            
            // Calculate dynamic min and max delays, ensuring they don't fall below the hard limit
            const currentMinDelay = Math.max(BASE_MIN_DELAY - reduction, MIN_POSSIBLE_DELAY);
            // Ensure max delay is always slightly greater than min delay for a range (use a buffer of 10)
            const currentMaxDelay = Math.max(BASE_MAX_DELAY - reduction, currentMinDelay + 10); 
            // -------------------------------------------------------------

            if (infiniteObstacleTimer <= 0) {
                // Randomly generate obstacle
                const height = 40 + Math.floor(Math.random() * 60); 
                const type = Math.random() < 0.7 ? 'spike' : 'block'; 
                
                // Add obstacle
                obstacles.push({
                    x: canvas.width,
                    y: actualGroundY - height,
                    width: obstacleWidth,
                    height: height,
                    type: type
                });

                // Reset timer with a new random delay within the calculated dynamic range
                const delayRange = currentMaxDelay - currentMinDelay;
                infiniteObstacleTimer = currentMinDelay + Math.floor(Math.random() * delayRange);
            }
            
            // Continuous speed increase logic for Infinite Mode (Unchanged)
            if (frames % INFINITE_SPEED_UP_INTERVAL === 0) { 
                 gameSpeed += INFINITE_SPEED_UP_AMOUNT;
            }
        } else {
            // Level Mode Logic (Unchanged)
            if (frameDelay === 0 && obstacleIndex < currentLevelData.length) {
                const [delay, height, type] = currentLevelData[obstacleIndex];
                
                if (type !== 'END') {
                    obstacles.push({
                        x: canvas.width,
                        y: actualGroundY - height,
                        width: obstacleWidth,
                        height: height,
                        type: type
                    });
                }

                obstacleIndex++;
                if (obstacleIndex < currentLevelData.length) {
                    frameDelay = currentLevelData[obstacleIndex][0];
                }

            } else if (obstacleIndex < currentLevelData.length) {
                frameDelay--;
            }
        }

        // Common movement and collision check
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= gameSpeed;
            drawObstacle(obs);
            if (checkCollision(player, obs)) { 
                isGameOver = true;
            }
            if (obs.x + obs.width < 0) {
                if (isInfiniteMode) {
                    score++; // Increment score for passing an obstacle
                }
                obstacles.splice(i, 1);
            }
        }
    }
    
    function checkLevelEnd() {
        if (obstacleIndex >= currentLevelData.length && obstacles.length === 0) {
            isLevelComplete = true;
        }
    }

    function updatePlayer() {
        player.velocityY += gravity;
        player.y += player.velocityY;

        if (player.y >= groundY) {
            player.y = groundY;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }
    
    // --- Score / Progress Functions (Unchanged) ---
    function updateProgressScore() {
        let progress;
        if (isLevelComplete) {
            progress = 100; 
        } else {
            progress = Math.min(99, Math.floor((frames / levelLength) * 100));
        }
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText(`Progress (${currentLevelName}): ` + progress + '%', 20, 30);
        ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}`, canvas.width - 150, 30);
    }

    function updateInfiniteScore() {
        // In Infinite Mode, display the score (obstacles passed)
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 20, 30);
        // Display current speed for user feedback
        ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}`, canvas.width - 150, 30);
    }
    
    // --- Screen Logic (Unchanged) ---
    function showLevelComplete() {
        cancelAnimationFrame(animationFrameId); 
        if (!document.getElementById('screenText')) {
            let screenText = document.createElement('div');
            screenText.id = 'screenText';
            screenText.style.color = activeColors.playerCore; 
            screenText.style.fontSize = '48px';
            screenText.style.textAlign = 'center';
            screenText.style.textShadow = `0 0 20px ${activeColors.playerCore}`; 
            screenText.innerHTML = `${currentLevelName} COMPLETED!<br><span style="font-size: 24px;">Progress: 100% (Final Speed: ${gameSpeed.toFixed(1)})</span><br><span style="font-size: 24px;">Click or Press Space to Return to Menu</span>`;
            document.body.appendChild(screenText);
        }
    }

    function showGameOver() {
        cancelAnimationFrame(animationFrameId); 
        let finalScoreText;
        let finalScoreValue;
        
        if (isInfiniteMode) {
            finalScoreValue = score;
            finalScoreText = `Score: ${finalScoreValue} (Final Speed: ${gameSpeed.toFixed(1)})`;
        } else {
            finalScoreValue = Math.min(100, Math.floor((frames / levelLength) * 100));
            finalScoreText = `${currentLevelName}: ${finalScoreValue}% (Speed: ${gameSpeed.toFixed(1)})`;
        }
        
        if (!document.getElementById('screenText')) {
            let screenText = document.createElement('div');
            screenText.id = 'screenText';
            screenText.style.color = 'white';
            screenText.style.fontSize = '48px';
            screenText.style.textAlign = 'center';
            screenText.innerHTML = `Game Over!<br>${finalScoreText}<br><span style="font-size: 24px;">Click or Press Space to Return to Menu</span>`;
            document.body.appendChild(screenText);
        }
    }
    
    function handleInput() {
        if (!player.isJumping && !isGameOver && !isLevelComplete) {
            player.velocityY = -jumpStrength;
            player.isJumping = true;
        }
    }
    
    // --- DRAWING FUNCTIONS (Unchanged) ---
    function drawBackground() {
        ctx.fillStyle = activeColors.bgSecondary; 
        for (let obj of backgroundObjects) {
            // Update object speed based on current gameSpeed for background movement
            obj.speed = gameSpeed * 0.3; 
            
            obj.x -= obj.speed;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            if (obj.x + obj.width < 0) {
                obj.x = canvas.width;
                obj.y = seededRandom() * (actualGroundY - 100); 
                obj.width = seededRandom() * 50 + 20; 
                obj.height = (actualGroundY - 20) - (seededRandom() * 200);
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
        ctx.fillStyle = activeColors.playerAccent; 
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = activeColors.playerCore; 
        ctx.fillRect(player.x + 4, player.y + 4, player.width - 8, player.height - 8);
        ctx.fillStyle = 'white'; 
        ctx.fillRect(player.x + 10, player.y + 8, 12, 8);
        ctx.fillStyle = 'black'; 
        ctx.fillRect(player.x + 18, player.y + 10, 4, 4);
    }
    
    function drawObstacle(obs) {
        if (obs.type === 'block') {
            ctx.fillStyle = activeColors.obsPrimary; 
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.fillStyle = activeColors.obsAccent; 
            ctx.fillRect(obs.x, obs.y, obs.width / 4, obs.height);
        } else { // 'spike'
            ctx.fillStyle = activeColors.obsAccent;
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + obs.height); 
            ctx.lineTo(obs.x + obs.width / 2, obs.y); 
            ctx.lineTo(obs.x + obs.width, obs.y + obs.height); 
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = activeColors.obsPrimary;
            ctx.beginPath();
            ctx.moveTo(obs.x - 2, obs.y + obs.height); 
            ctx.lineTo(obs.x + obs.width / 2 - 2, obs.y); 
            ctx.lineTo(obs.x + obs.width - 2, obs.y + obs.height); 
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // --- Collision Function (Typo corrected) ---
    function pointInTriangle(px, py, t1x, t1y, t2x, t2y, t3x, t3y) {
        function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
            return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
        }

        const d1 = sign(px, py, t1x, t1y, t2x, t2y);
        const d2 = sign(px, py, t2x, t2y, t3x, t3y);
        // Corrected typo here (was 'sign' instead of 'px')
        const d3 = sign(px, py, t3x, t3y, t1x, t1y); 

        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    function checkCollision(player, obstacle) {
        if (!(
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        )) {
            return false;
        }

        if (obstacle.type === 'block') {
            return true;
        } 
        
        if (obstacle.type === 'spike') {
            const v1x = obstacle.x;
            const v1y = obstacle.y + obstacle.height;
            const v2x = obstacle.x + obstacle.width / 2;
            const v2y = obstacle.y;
            const v3x = obstacle.x + obstacle.width;
            const v3y = obstacle.y + obstacle.height;

            const playerCorners = [
                {x: player.x, y: player.y}, 
                {x: player.x + player.width, y: player.y}, 
                {x: player.x, y: player.y + player.height}, 
                {x: player.x + player.width, y: player.y + player.height} 
            ];

            for (const corner of playerCorners) {
                if (pointInTriangle(corner.x, corner.y, v1x, v1y, v2x, v2y, v3x, v3y)) {
                    return true;
                }
            }
            
            return false;
        }

        return false; 
    }
    
    // --- Menu Logic and Event Listeners (Unchanged) ---
    const mainMenu = document.getElementById('mainMenu');
    const levelSelectMenu = document.getElementById('levelSelect');
    const instructions = document.getElementById('instructions');

    function showMainMenu() {
        cancelAnimationFrame(animationFrameId); 

        mainMenu.style.display = 'block'; 
        levelSelectMenu.style.display = 'none';
        canvas.style.display = 'none';
        instructions.style.display = 'none';
        
        document.body.style.backgroundColor = '#222';

        const screenText = document.getElementById('screenText');
        if (screenText) {
            screenText.remove();
        }
    }

    // *** ATTACH LISTENERS (Unchanged) ***
    
    document.addEventListener('click', (e) => {
        const targetId = e.target.id;
        
        if (targetId === 'levelsButton') {
            // New "Levels" button action
            mainMenu.style.display = 'none';
            levelSelectMenu.style.display = 'flex'; 
        } else if (targetId === 'infiniteButton') {
            // New "Infinite" button action
            init('infinite');
            mainMenu.style.display = 'none';
            canvas.style.display = 'block'; 
            instructions.style.display = 'block'; 
        } else if (e.target.classList.contains('level-button')) {
            // Level button action
            init('level', targetId);
            levelSelectMenu.style.display = 'none';
            canvas.style.display = 'block'; 
            instructions.style.display = 'block'; 
        } 
        else if ((isGameOver || isLevelComplete) && document.getElementById('screenText')) {
            // Game Over/Level Complete screen click to return to menu
            showMainMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (isGameOver || isLevelComplete) {
                showMainMenu(); 
            } else {
                handleInput(); 
            }
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!isGameOver && !isLevelComplete && canvas.style.display === 'block') {
             handleInput(); 
        } 
    });
    
    // Initialize the starting screen
    showMainMenu(); 
})();
