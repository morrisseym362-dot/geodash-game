(function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas not found! Please ensure index.html is loaded first.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // --- NEW: Game State Variables for Retrying ---
    let currentGameType = 'infinite'; // 'infinite' or 'level'
    let currentLevelId = null; // e.g., 'level1Button'
    let currentScore = 0; // To display on game over screen

    // --- NEW: DOM Element References ---
    const mainMenu = document.getElementById('mainMenu');
    const levelSelectMenu = document.getElementById('levelSelect');
    const instructions = document.getElementById('instructions');
    
    // Game Over/Complete Screen Elements
    const gameOverScreen = document.getElementById('gameOverScreen');
    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const gameOverText = document.getElementById('gameOverText');
    const screenText = document.getElementById('screenText'); // Used for score in game over
    const retryButton = document.getElementById('retryButton');
    const menuButton = document.getElementById('menuButton');
    const completeScoreText = document.getElementById('completeScoreText');
    const nextLevelButton = document.getElementById('nextLevelButton');
    const completeMenuButton = document.getElementById('completeMenuButton');


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
        'level3Button': { /* ... other levels ... */ },
        'level4Button': { /* ... */ },
        'level5Button': { /* ... */ },
        'level6Button': { /* ... */ },
        'level7Button': { /* ... */ },
        'level8Button': { /* ... */ },
        'level9Button': { /* ... */ },
        'level10Button': { /* ... */ },
    };

    // --- GAME STATE VARIABLES (Inferred/Existing) ---
    let player = {};
    let obstacles = [];
    let backgroundObjects = [];
    let gameSpeed = 5;
    let isPlaying = false;
    let isGameOver = false;
    let isLevelComplete = false;
    let groundHeight = 50;
    let canvasWidth, canvasHeight;
    let colors = LEVEL_SCHEMES['level1Button']; // Default

    // --- UTILITIES (Inferred/Existing) ---
    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        groundHeight = canvasHeight * 0.1; 
        if (isPlaying) {
             // Redraw everything on resize
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Placeholder functions (to ensure the script is runnable)
    function generateLevel(levelId) {
        // Placeholder for level generation logic
        obstacles = []; 
        // Example obstacle for testing retry
        if (levelId === 'level1Button') {
            obstacles.push({ x: canvasWidth * 0.7, y: canvasHeight - groundHeight, size: 40 });
        }
        gameSpeed = 5;
    }
    function generateInfiniteObstacles() {
        // Placeholder for infinite generation logic
        // This function would run continuously to add new obstacles
        obstacles = [];
        gameSpeed = 6;
    }
    function update(deltaTime) {
        if (!isPlaying || isGameOver || isLevelComplete) return;

        // Player update (gravity, jump)
        player.y += player.velocityY;
        player.velocityY += 0.5; // Gravity
        
        // Land on ground
        if (player.y + player.size > canvasHeight - groundHeight) {
            player.y = canvasHeight - groundHeight - player.size;
            player.velocityY = 0;
            player.isJumping = false;
        }

        // Obstacle movement and collision
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed * deltaTime * 60; 

            // Collision detection (simplified AABB)
            if (
                player.x < obstacles[i].x + obstacles[i].size &&
                player.x + player.size > obstacles[i].x &&
                player.y + player.size > obstacles[i].y &&
                player.y < obstacles[i].y + obstacles[i].size
            ) {
                // Collision detected!
                isGameOver = true;
                isPlaying = false;
                // NEW: Call the new game over screen function
                showGameOverScreen(); 
            }

            // Remove off-screen obstacles
            if (obstacles[i].x < -obstacles[i].size) {
                obstacles.splice(i, 1);
                currentScore++; // Increase score on passing
            }
        }
        
        // Handle Level Win condition (Placeholder)
        if (currentGameType === 'level' && obstacles.length === 0) {
            isLevelComplete = true;
            isPlaying = false;
            showLevelCompleteScreen();
        }

        // Background object movement
        for (let obj of backgroundObjects) {
             obj.x -= gameSpeed * deltaTime * 1; // slower speed
             if (obj.x < 0) obj.x = canvasWidth;
        }

        // Score update (for infinite mode)
        if(currentGameType === 'infinite') {
            currentScore += (gameSpeed * deltaTime);
        }
    }

    function render() {
        // Clear canvas
        ctx.fillStyle = colors.bgPrimary;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw background objects
        ctx.fillStyle = colors.bgSecondary;
        for (let obj of backgroundObjects) {
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        }

        // Draw ground
        ctx.fillStyle = colors.ground;
        ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight);

        // Draw player
        ctx.fillStyle = colors.playerCore;
        ctx.fillRect(player.x, player.y, player.size, player.size);
        // Draw accent square
        ctx.strokeStyle = colors.playerAccent;
        ctx.lineWidth = 3;
        ctx.strokeRect(player.x + 5, player.y + 5, player.size - 10, player.size - 10);


        // Draw obstacles
        ctx.fillStyle = colors.obsPrimary;
        for (let obs of obstacles) {
            ctx.beginPath();
            // Simple triangle obstacle (spike)
            ctx.moveTo(obs.x, obs.y);
            ctx.lineTo(obs.x + obs.size, obs.y);
            ctx.lineTo(obs.x + obs.size / 2, obs.y - obs.size);
            ctx.closePath();
            ctx.fill();
            
            // Draw accent border
            ctx.strokeStyle = colors.obsAccent;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${Math.floor(currentScore)}`, 10, 30);
        
        // IMPORTANT: The game over text drawing logic has been removed here. 
        // The HTML overlay handles the game over screen now.
    }
    
    // --- GAME LOOP ---
    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = (timestamp - lastTime) / 1000; // Time in seconds
        lastTime = timestamp;

        if (isPlaying) {
            update(deltaTime);
            render();
        } 
        
        requestAnimationFrame(gameLoop);
    }
    
    // --- INITIALIZATION ---
    function init(type, levelId = null) {
        // NEW: Store game context
        currentGameType = type;
        currentLevelId = levelId;
        currentScore = 0;

        isGameOver = false;
        isLevelComplete = false;
        isPlaying = true;
        
        // Hide screens
        mainMenu.style.display = 'none';
        levelSelectMenu.style.display = 'none';
        gameOverScreen.style.display = 'none';
        levelCompleteScreen.style.display = 'none';

        // Show game elements
        canvas.style.display = 'block'; 
        instructions.style.display = 'block'; 
        
        // Set colors based on level or default
        colors = levelId && LEVEL_SCHEMES[levelId] ? LEVEL_SCHEMES[levelId] : LEVEL_SCHEMES['level1Button'];

        // Reset player
        player = {
            x: canvasWidth * 0.1,
            y: canvasHeight - groundHeight - 50,
            size: 50,
            velocityY: 0,
            isJumping: false,
        };

        // Reset/Generate Obstacles
        if (type === 'level') {
            generateLevel(levelId);
        } else {
            generateInfiniteObstacles();
        }
        
        // Reset background objects (simple placeholders)
        backgroundObjects = [];
        for(let i=0; i<30; i++) {
            backgroundObjects.push({
                x: seededRandom() * canvasWidth,
                y: seededRandom() * (canvasHeight - groundHeight),
                w: seededRandom() * 3 + 1,
                h: seededRandom() * 3 + 1,
            });
        }
    }

    function showMainMenu() {
        isPlaying = false;
        isGameOver = false;
        isLevelComplete = false;
        canvas.style.display = 'none';
        instructions.style.display = 'none';
        gameOverScreen.style.display = 'none';
        levelCompleteScreen.style.display = 'none';
        mainMenu.style.display = 'flex';
    }

    // --- NEW: Game Over/Complete Screen Functions ---

    function showGameOverScreen() {
        gameOverScreen.style.display = 'flex';
        canvas.style.display = 'none';
        instructions.style.display = 'none';
        
        // Update score text and button based on game type
        if (currentGameType === 'level') {
            screenText.textContent = `Progress: ${Math.min(100, Math.round(player.x / (canvasWidth * 1.5) * 100))}%`; // Placeholder for progress calculation
            retryButton.textContent = 'Retry Level';
        } else {
            screenText.textContent = `Score: ${Math.floor(currentScore)}`;
            retryButton.textContent = 'Restart Infinite';
        }
    }
    
    function showLevelCompleteScreen() {
        levelCompleteScreen.style.display = 'flex';
        canvas.style.display = 'none';
        instructions.style.display = 'none';
        
        completeScoreText.textContent = `Final Score: ${Math.floor(currentScore)}`;
        // Note: 'nextLevelButton' logic is complex and needs actual level data. 
        // For now, it will return to menu, but is ready for 'Next Level' implementation.
        nextLevelButton.textContent = 'Return to Menu'; // Default action if no next level is implemented
    }

    // --- NEW: Button Handlers ---
    
    function handleRetry() {
        // Retry logic: just re-initialize the game with the current context
        if (currentGameType === 'level' && currentLevelId) {
            init('level', currentLevelId);
        } else if (currentGameType === 'infinite') {
            init('infinite');
        } else {
            // Should not happen, but fall back to main menu
            showMainMenu();
        }
    }

    function handleNextLevel() {
        // Placeholder for real next level logic. For now, just return to menu.
        showMainMenu();
    }
    
    // --- INPUT HANDLERS (Existing/Modified) ---
    
    function handleInput() {
         if (!player.isJumping) {
            player.velocityY = -15; // Jump strength
            player.isJumping = true;
        }
    }

    // --- EVENT LISTENERS (Modified) ---

    // 1. Menu and Level Button Clicks (Existing)
    document.addEventListener('click', (e) => {
        const targetId = e.target.id;

        if (targetId === 'levelsButton') {
            // New "Levels" button action
            mainMenu.style.display = 'none';
            levelSelectMenu.style.display = 'flex'; 
        } else if (targetId === 'infiniteButton') {
            // New "Infinite" button action
            init('infinite');
        } else if (e.target.classList.contains('level-button')) {
            // Level button action
            init('level', targetId);
        }
        // NOTE: Old click handler for 'isGameOver' removed.
    });

    // 2. NEW: Game Over Screen Button Clicks
    retryButton.addEventListener('click', handleRetry);
    menuButton.addEventListener('click', showMainMenu);
    
    // 3. NEW: Level Complete Screen Button Clicks
    nextLevelButton.addEventListener('click', handleNextLevel);
    completeMenuButton.addEventListener('click', showMainMenu);
    
    // 4. Keyboard Input (Modified: space bar only triggers jump when playing)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            // Only allow jump if game screens are not active
            if (gameOverScreen.style.display !== 'flex' && levelCompleteScreen.style.display !== 'flex') {
                handleInput(); 
            }
        }
    });

    document.addEventListener('mousedown', (e) => {
        // Only handle jump if canvas is visible (i.e., playing)
        if (canvas.style.display === 'block') {
             handleInput(); 
        } 
    });

    // Start the game loop on load
    gameLoop(0);

    // Initial view
    showMainMenu();
})();
