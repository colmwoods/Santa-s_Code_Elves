// Game 4: Maze Escape
const CELL_SIZE = 40;
const MAZE_SIZE = 15;
let player = { x: 0, y: 0 };
let mazeTimer;
let mazeTimeLeft = 60;
let maze;
let exitPos;
let mazeGameActive = false;

function initPresentStackGame() {
    console.log("Initializing Maze Game...");
    
    // Setup game HTML
    game4Container.innerHTML = `
        <div class="game-content" style="background: linear-gradient(to bottom, #006064, #004d40); padding: 30px; border-radius: 20px; width: 100%; max-height: 100vh; overflow-y: auto; border: 5px solid #ffcc00; position: relative;">
            <button class="close-game-btn" id="closeMazeGame" style="position: absolute; top: 15px; right: 15px; background: #ff4d4d; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">&times;</button>
            
            <div class="game-header">
                <h2 style="color: #ffcc00; font-size: 2.5rem; text-align: center; margin-bottom: 20px;">🎁 Santa's Maze Escape</h2>
                <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: left;">
                    <h3 style="color: #00bcd4; margin-bottom: 10px;">How to Play:</h3>
                    <p style="margin-bottom: 10px">Guide Santa through the maze to find the exit before time runs out!</p>
                    <ul style="padding-left: 20px; margin-bottom: 15px;">
                        <li>Use <strong>arrow keys</strong> or <strong>on-screen buttons</strong> to move Santa</li>
                        <li>Find the red exit square before 60 seconds</li>
                        <li>Avoid hitting walls (Santa can't pass through them)</li>
                        <li>Start at the top-left corner, exit is randomly placed</li>
                        <li>Escape the maze to unlock the final house!</li>
                    </ul>
                </div>
            </div>
            
            <div class="game-stats" style="display: flex; justify-content: space-between; background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px; align-items: center;">
                <div class="stat-box" style="text-align: center;">
                    <h3 style="margin: 0; color: #ffcc00;">Time: <span id="mazeTimer">60</span>s</h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Target: Reach exit in 60s</p>
                </div>
                <div class="stat-box" style="text-align: center;">
                    <h3 style="margin: 0; color: #ffcc00;">Position</h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem;">X: <span id="playerX">0</span>, Y: <span id="playerY">0</span></p>
                </div>
                <button id="startMazeGame" class="btn btn-start" style="background: linear-gradient(to right, #00bcd4, #0097a7); color: white; border: none; padding: 10px 20px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-play"></i> Start Maze
                </button>
            </div>
            
            <div class="maze-game-area" style="position: relative; display: flex; flex-direction: column; align-items: center;">
                <div class="maze-container" id="mazeContainer" style="position: relative; margin-bottom: 20px; background: rgba(0, 0, 0, 0.2); padding: 20px; border-radius: 15px; border: 3px solid #00bcd4; display: flex; justify-content: center;">
                    <div id="maze" style="display: grid; position: relative; background: #e8f5e9; border: 2px solid #388e3c; margin: 0;"></div>
                    <div id="player" style="position: absolute; background: #d32f2f; border-radius: 50%; transition: all 0.2s; z-index: 2; box-shadow: 0 0 10px rgba(211, 47, 47, 0.8);"></div>
                </div>
                
                <div class="mobile-controls" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 300px; margin-top: 20px;">
                    <div style="grid-column: 2; text-align: center;">
                        <button id="upBtn" class="direction-btn" style="background: linear-gradient(to bottom, #4CAF50, #2E7D32); color: white; border: none; width: 70px; height: 70px; border-radius: 10px; font-size: 1.5rem; cursor: pointer;">
                            ↑
                        </button>
                    </div>
                    <div style="grid-column: 1; text-align: center;">
                        <button id="leftBtn" class="direction-btn" style="background: linear-gradient(to right, #2196F3, #0d47a1); color: white; border: none; width: 70px; height: 70px; border-radius: 10px; font-size: 1.5rem; cursor: pointer;">
                            ←
                        </button>
                    </div>
                    <div style="grid-column: 2; text-align: center;">
                        <button id="downBtn" class="direction-btn" style="background: linear-gradient(to top, #4CAF50, #2E7D32); color: white; border: none; width: 70px; height: 70px; border-radius: 10px; font-size: 1.5rem; cursor: pointer;">
                            ↓
                        </button>
                    </div>
                    <div style="grid-column: 3; text-align: center;">
                        <button id="rightBtn" class="direction-btn" style="background: linear-gradient(to left, #2196F3, #0d47a1); color: white; border: none; width: 70px; height: 70px; border-radius: 10px; font-size: 1.5rem; cursor: pointer;">
                            →
                        </button>
                    </div>
                </div>
                
                <div class="controls-info" style="margin-top: 15px; text-align: center; color: #ffcc00; font-size: 1.1rem;">
                    <p>Use <strong>Arrow Keys</strong> to move or tap buttons on mobile</p>
                </div>
            </div>
            
            <div class="maze-result" id="mazeResult" style="display: none; text-align: center; background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 15px; margin-top: 20px; border: 2px solid #ffcc00;">
                <h3 id="mazeResultTitle" style="color: #ffcc00; margin-bottom: 10px;"></h3>
                <p id="mazeResultText" style="margin-bottom: 15px;"></p>
                <button id="restartMazeBtn" class="btn" style="background: linear-gradient(to right, #ff9800, #e65100); margin-right: 10px;">
                    <i class="fas fa-redo"></i> Play Again
                </button>
                <button id="backFromMaze" class="btn btn-success" style="background: linear-gradient(to right, #4CAF50, #2E7D32);">
                    <i class="fas fa-home"></i> Back to Village
                </button>
            </div>
        </div>
    `;
    
    // Add game-specific styles
    const style = document.createElement('style');
    style.id = 'maze-styles';
    style.textContent = `
        #maze {
            display: grid;
            position: relative;
            background: #e8f5e9;
            border: 2px solid #388e3c;
            margin: 0 auto;
        }
        
        .cell {
            position: relative;
            width: ${CELL_SIZE}px;
            height: ${CELL_SIZE}px;
            background: #e8f5e9;
            border: none;
        }
        
        .wall {
            position: absolute;
            background: #388e3c;
            z-index: 1;
        }
        
        .wall.top {
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
        }
        
        .wall.right {
            top: 0;
            right: 0;
            bottom: 0;
            width: 3px;
        }
        
        .wall.bottom {
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
        }
        
        .wall.left {
            top: 0;
            left: 0;
            bottom: 0;
            width: 3px;
        }
        
        .exit {
            background: #ffcdd2 !important;
            position: relative;
        }
        
        .exit::after {
            content: "🏁";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
        }
        
        #player {
            position: absolute;
            background: #d32f2f;
            border-radius: 50%;
            transition: all 0.2s;
            z-index: 2;
            box-shadow: 0 0 10px rgba(211, 47, 47, 0.8);
        }
        
        #player::after {
            content: "🎅";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
        }
        
        .direction-btn {
            transition: all 0.1s;
        }
        
        .direction-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        
        .direction-btn:active {
            transform: scale(0.95);
        }
        
        .hover-effect {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8) !important;
        }
        
        @media (max-width: 768px) {
            .mobile-controls {
                display: grid !important;
            }
            
            .controls-info p {
                display: none;
            }
            
            .cell {
                width: 30px;
                height: 30px;
            }
        }
        
        @media (max-width: 480px) {
            .cell {
                width: 25px;
                height: 25px;
            }
        }
    `;
    
    // Remove existing styles if any
    const existingStyles = document.getElementById('maze-styles');
    if (existingStyles) existingStyles.remove();
    
    document.head.appendChild(style);
    
    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        setupMazeEventListeners();
        resetMazeGame();
        console.log("Maze game initialized successfully");
    }, 100);
}

function setupMazeEventListeners() {
    console.log("Setting up maze event listeners...");
    
    // Close button
    const closeBtn = document.getElementById('closeMazeGame');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            stopMazeGame();
            closeMiniGame();
        });
    }
    
    // Start game button
    const startBtn = document.getElementById('startMazeGame');
    if (startBtn) {
        startBtn.addEventListener('click', startMazeGame);
    }
    
    // Back to village button
    const backBtn = document.getElementById('backFromMaze');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            stopMazeGame();
            returnToMainGame(true);
        });
    }
    
    // Restart button
    const restartBtn = document.getElementById('restartMazeBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', startMazeGame);
    }
    
    // Mobile controls
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    if (upBtn) upBtn.addEventListener('click', () => movePlayer('up'));
    if (downBtn) downBtn.addEventListener('click', () => movePlayer('down'));
    if (leftBtn) leftBtn.addEventListener('click', () => movePlayer('left'));
    if (rightBtn) rightBtn.addEventListener('click', () => movePlayer('right'));
    
    // Show mobile controls on mobile devices
    if (window.innerWidth <= 768) {
        const mobileControls = document.querySelector('.mobile-controls');
        if (mobileControls) {
            mobileControls.style.display = 'grid';
        }
    }
    
    console.log("Event listeners setup complete");
}

// Global keyboard event handler
document.addEventListener('keydown', function(e) {
    if (!mazeGameActive || !document.getElementById('mazeContainer')) return;
    
    const directions = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'up',
        'W': 'up',
        's': 'down',
        'S': 'down',
        'a': 'left',
        'A': 'left',
        'd': 'right',
        'D': 'right'
    };
    
    if (directions[e.key]) {
        e.preventDefault();
        movePlayer(directions[e.key]);
        
        // Add visual feedback for key press
        const buttonMap = {
            'up': 'upBtn',
            'down': 'downBtn',
            'left': 'leftBtn',
            'right': 'rightBtn'
        };
        
        const buttonId = buttonMap[directions[e.key]];
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('hover-effect');
            setTimeout(() => button.classList.remove('hover-effect'), 200);
        }
    }
});

function resetMazeGame() {
    console.log("Resetting maze game...");
    player = { x: 0, y: 0 };
    mazeTimeLeft = 60;
    mazeGameActive = false;
    
    // Clear any existing timer
    if (mazeTimer) {
        clearInterval(mazeTimer);
        mazeTimer = null;
    }
    
    // Reset UI
    const timerEl = document.getElementById('mazeTimer');
    const playerXEl = document.getElementById('playerX');
    const playerYEl = document.getElementById('playerY');
    const resultEl = document.getElementById('mazeResult');
    const startBtn = document.getElementById('startMazeGame');
    
    if (timerEl) timerEl.textContent = '60';
    if (playerXEl) playerXEl.textContent = '0';
    if (playerYEl) playerYEl.textContent = '0';
    if (resultEl) resultEl.style.display = 'none';
    if (startBtn) startBtn.style.display = 'inline-block';
}

function startMazeGame() {
    console.log("Starting maze game...");
    resetMazeGame();
    mazeGameActive = true;
    
    // Update UI
    const startBtn = document.getElementById('startMazeGame');
    const resultEl = document.getElementById('mazeResult');
    
    if (startBtn) startBtn.style.display = 'none';
    if (resultEl) resultEl.style.display = 'none';
    
    // Generate and render maze
    generateMaze();
    renderMaze();
    
    // Start timer
    mazeTimer = setInterval(() => {
        mazeTimeLeft--;
        const timerEl = document.getElementById('mazeTimer');
        if (timerEl) timerEl.textContent = mazeTimeLeft;
        
        if (mazeTimeLeft <= 0) {
            endMazeGame(false, "Time's up! You couldn't make it through the maze.");
        }
    }, 1000);
    
    console.log("Maze game started successfully");
}

function generateMaze() {
    console.log("Generating maze...");
    // Initialize maze with all walls
    maze = Array(MAZE_SIZE)
        .fill()
        .map(() => 
            Array(MAZE_SIZE)
                .fill()
                .map(() => ({
                    walls: { top: true, right: true, bottom: true, left: true },
                    visited: false,
                }))
        );

    // Depth-first search maze generation
    let stack = [];
    let current = { x: 0, y: 0 };
    maze[0][0].visited = true;

    while (true) {
        // Find unvisited neighbors
        let neighbors = [];
        if (current.x > 0 && !maze[current.y][current.x - 1].visited)
            neighbors.push("left");
        if (current.x < MAZE_SIZE - 1 && !maze[current.y][current.x + 1].visited)
            neighbors.push("right");
        if (current.y > 0 && !maze[current.y - 1][current.x].visited)
            neighbors.push("top");
        if (current.y < MAZE_SIZE - 1 && !maze[current.y + 1][current.x].visited)
            neighbors.push("bottom");

        if (neighbors.length > 0) {
            // Choose random neighbor
            let direction = neighbors[Math.floor(Math.random() * neighbors.length)];
            let next = { x: current.x, y: current.y };

            // Remove walls between current and next cell
            switch (direction) {
                case "left":
                    maze[current.y][current.x].walls.left = false;
                    maze[current.y][current.x - 1].walls.right = false;
                    next.x--;
                    break;
                case "right":
                    maze[current.y][current.x].walls.right = false;
                    maze[current.y][current.x + 1].walls.left = false;
                    next.x++;
                    break;
                case "top":
                    maze[current.y][current.x].walls.top = false;
                    maze[current.y - 1][current.x].walls.bottom = false;
                    next.y--;
                    break;
                case "bottom":
                    maze[current.y][current.x].walls.bottom = false;
                    maze[current.y + 1][current.x].walls.top = false;
                    next.y++;
                    break;
            }
            
            maze[next.y][next.x].visited = true;
            stack.push(current);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }

    // Generate exit position (not at start)
    let side, exitX, exitY;
    do {
        side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: // Top wall
                exitY = 0;
                exitX = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 1: // Right wall
                exitX = MAZE_SIZE - 1;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 2: // Bottom wall
                exitY = MAZE_SIZE - 1;
                exitX = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 3: // Left wall
                exitX = 0;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
        }
    } while (exitX === 0 && exitY === 0); // Ensure exit is not at start

    exitPos = { x: exitX, y: exitY };
    console.log("Exit position:", exitPos);

    // Remove wall to create exit
    switch (side) {
        case 0:
            maze[exitY][exitX].walls.top = false;
            break;
        case 1:
            maze[exitY][exitX].walls.right = false;
            break;
        case 2:
            maze[exitY][exitX].walls.bottom = false;
            break;
        case 3:
            maze[exitY][exitX].walls.left = false;
            break;
    }
    
    console.log("Maze generation complete");
}

function renderMaze() {
    console.log("Rendering maze...");
    const mazeElement = document.getElementById('maze');
    if (!mazeElement) {
        console.error("Maze element not found!");
        return;
    }
    
    // Clear maze
    mazeElement.innerHTML = '';
    
    // Set grid size
    mazeElement.style.gridTemplateColumns = `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`;
    mazeElement.style.gridTemplateRows = `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`;
    mazeElement.style.width = MAZE_SIZE * CELL_SIZE + 'px';
    mazeElement.style.height = MAZE_SIZE * CELL_SIZE + 'px';

    // Create cells
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Mark exit cell
            if (x === exitPos.x && y === exitPos.y) {
                cell.classList.add('exit');
            }
            
            // Add walls
            const walls = maze[y][x].walls;
            if (walls.top) {
                const wall = document.createElement('div');
                wall.className = 'wall top';
                cell.appendChild(wall);
            }
            if (walls.right) {
                const wall = document.createElement('div');
                wall.className = 'wall right';
                cell.appendChild(wall);
            }
            if (walls.bottom) {
                const wall = document.createElement('div');
                wall.className = 'wall bottom';
                cell.appendChild(wall);
            }
            if (walls.left) {
                const wall = document.createElement('div');
                wall.className = 'wall left';
                cell.appendChild(wall);
            }
            
            mazeElement.appendChild(cell);
        }
    }
    
    updatePlayerPosition();
    console.log("Maze rendered successfully");
}

function updatePlayerPosition() {
    const playerElem = document.getElementById('player');
    if (!playerElem) {
        console.error("Player element not found!");
        return;
    }
    
    // Update position display
    const playerXEl = document.getElementById('playerX');
    const playerYEl = document.getElementById('playerY');
    
    if (playerXEl) playerXEl.textContent = player.x;
    if (playerYEl) playerYEl.textContent = player.y;
    
    // Calculate player position using the actual rendered cell size
    const mazeElement = document.getElementById('maze');
    if (!mazeElement) {
        console.error('Maze element not found for positioning');
        return;
    }

    // Determine actual cell size from rendered DOM (handles responsive overrides)
    const firstCell = mazeElement.querySelector('.cell');
    const actualCellSize = firstCell ? firstCell.clientWidth : CELL_SIZE;

    const playerSize = Math.round(actualCellSize * 0.6);
    const offset = (actualCellSize - playerSize) / 2;

    // Position player relative to the maze element inside its container
    const mazeRect = mazeElement.getBoundingClientRect();
    const containerRect = mazeElement.parentElement.getBoundingClientRect();
    const relativeLeft = mazeRect.left - containerRect.left;
    const relativeTop = mazeRect.top - containerRect.top;

    playerElem.style.width = `${playerSize}px`;
    playerElem.style.height = `${playerSize}px`;
    playerElem.style.left = `${Math.round(relativeLeft + player.x * actualCellSize + offset)}px`;
    playerElem.style.top = `${Math.round(relativeTop + player.y * actualCellSize + offset)}px`;
    
    console.log(`Player position updated: X=${player.x}, Y=${player.y}`);
    
    // Check if player reached exit
    if (player.x === exitPos.x && player.y === exitPos.y) {
        console.log("Player reached exit!");
        endMazeGame(true, "Congratulations! You've helped Santa escape the maze!");
    }
}

function movePlayer(direction) {
    if (!mazeGameActive) {
        console.log("Game not active, ignoring move");
        return;
    }
    
    console.log(`Attempting to move: ${direction}, Current position: X=${player.x}, Y=${player.y}`);
    
    const walls = maze[player.y][player.x].walls;
    let moved = false;
    
    switch (direction) {
        case 'up':
            if (!walls.top && player.y > 0) {
                player.y--;
                moved = true;
            }
            break;
        case 'down':
            if (!walls.bottom && player.y < MAZE_SIZE - 1) {
                player.y++;
                moved = true;
            }
            break;
        case 'left':
            if (!walls.left && player.x > 0) {
                player.x--;
                moved = true;
            }
            break;
        case 'right':
            if (!walls.right && player.x < MAZE_SIZE - 1) {
                player.x++;
                moved = true;
            }
            break;
    }
    
    if (moved) {
        console.log(`Moved to: X=${player.x}, Y=${player.y}`);
        updatePlayerPosition();
    } else {
        console.log(`Cannot move ${direction} - wall blocked`);
    }
}

function endMazeGame(won, message) {
    console.log(`Ending game: won=${won}, message=${message}`);
    
    // Stop timer
    if (mazeTimer) {
        clearInterval(mazeTimer);
        mazeTimer = null;
    }
    
    mazeGameActive = false;
    
    // Show results
    const resultEl = document.getElementById('mazeResult');
    const resultTitle = document.getElementById('mazeResultTitle');
    const resultText = document.getElementById('mazeResultText');
    const backBtn = document.getElementById('backFromMaze');
    const restartBtn = document.getElementById('restartMazeBtn');
    
    if (resultEl) resultEl.style.display = 'block';
    
    if (won) {
        if (resultTitle) resultTitle.textContent = '🎉 Maze Escaped!';
        if (resultText) resultText.textContent = `You found the exit with ${mazeTimeLeft} seconds remaining!`;
        if (backBtn) backBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
    } else {
        if (resultTitle) resultTitle.textContent = '😞 Try Again!';
        if (resultText) resultText.textContent = message || "You couldn't escape the maze in time.";
        if (backBtn) backBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'inline-block';
    }
}

function stopMazeGame() {
    console.log("Stopping maze game...");
    mazeGameActive = false;
    if (mazeTimer) {
        clearInterval(mazeTimer);
        mazeTimer = null;
    }
}