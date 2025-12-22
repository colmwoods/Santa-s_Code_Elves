// Game State - MAIN GAME
const gameState = {
    currentHouse: 0,
    completedHouses: 0,
    totalHouses: 4,
    isPlaying: false,
    santaPosition: 0
};

// DOM Elements
let startBtn, endBtn, howToPlayBtn, elvesBtn, santa, housesContainer, houses;
let progressText, progressFill, completionMessage, snowContainer;
let mainGame, game1Container, game2Container, game3Container, game4Container;


// Create snowflake animation
function createSnowflakes() {
    // Clear any existing snowflakes
    snowContainer.innerHTML = '';
    
    // Create 50 snowflakes
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        
        // Random properties
        const size = Math.random() * 20 + 10;
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 5 + 5;
        const opacity = Math.random() * 0.7 + 0.3;
        const delay = Math.random() * 5;
        
        // Apply styles
        snowflake.style.left = `${startPosition}%`;
        snowflake.style.top = '-20px';
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.opacity = opacity;
        
        // Animation
        snowflake.style.animation = `fall ${animationDuration}s linear ${delay}s infinite`;
        
        snowContainer.appendChild(snowflake);
    }
    
    // Add CSS for falling animation
    if (!document.querySelector('#snow-animation')) {
        const style = document.createElement('style');
        style.id = 'snow-animation';
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
