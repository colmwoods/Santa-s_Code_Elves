const cards = document.querySelectorAll(".memory-card");
const restartBtn = document.getElementById("restart");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle() {
    cards.forEach(card => {
        const randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}