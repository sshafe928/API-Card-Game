const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let player1Cards = player1;
let player2Cards = player2;

const compareCards = (card1, card2) => {
    const cardValues = {
        'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11,
        '10': 10, '9': 9, '8': 8, '7': 7, '6': 6,
        '5': 5, '4': 4, '3': 3, '2': 2
    };

    const value1 = cardValues[card1.value];
    const value2 = cardValues[card2.value];

    if (value1 > value2) return 1;
    if (value2 > value1) return -1;
    return 0; // Tie
};

const handleWar = (player1, player2, extracard1, extracard2) => {
    const pot = [extracard1, extracard2];

    while (true) {
        if (player1.length < 3 || player2.length < 3) {
            if (player1.length < 3) {
                player2.push(...pot, ...player1);
                player1.length = 0;
            } else {
                player1.push(...pot, ...player2);
                player2.length = 0;
            }
            return;
        }

        const player1WarCards = player1.splice(0, 3);
        const player2WarCards = player2.splice(0, 3);
        pot.push(...player1WarCards, ...player2WarCards);

        const card1 = player1WarCards[2];
        const card2 = player2WarCards[2];

        const battle = compareCards(card1, card2);

        if (battle === 1) {
            player1.push(...pot);
            return;
        } else if (battle === -1) {
            player2.push(...pot);
            return;
        }
        // If it's another tie, the loop continues for another war round
    }
};

const playWar = async () => {
    const nextTurnButton = document.getElementById('next-turn-btn');
    const playAgainButton = document.getElementById('play-again-btn');
    const winnerMessage = document.getElementById('winner-message');
    const playerCardsDisplay = document.getElementById('player-cards');
    const dealerCardsDisplay = document.getElementById('dealer-cards');
    const player1CountDisplay = document.getElementById('player1-count');
    const player2CountDisplay = document.getElementById('player2-count');

    const renderCards = (card1, card2) => {
        playerCardsDisplay.innerHTML = `<img src="${card1.image}" alt="${card1.value} of ${card1.suit}">`;
        dealerCardsDisplay.innerHTML = `<img src="${card2.image}" alt="${card2.value} of ${card2.suit}">`;
    };

    const updateCardCounts = () => {
        player1CountDisplay.textContent = player1Cards.length;
        player2CountDisplay.textContent = player2Cards.length;
    };

    const announceWinner = () => {
        if (player1Cards.length > 0) {
            winnerMessage.innerHTML = "Player 1 wins the game!";
        } else {
            winnerMessage.innerHTML = "Player 2 wins the game!";
        }
        winnerMessage.style.display = 'block';
    };

    const checkGameOver = () => {
        if (player1Cards.length === 0 || player2Cards.length === 0) {
            nextTurnButton.style.display = 'none';
            playerCardsDisplay.innerHTML = '';
            dealerCardsDisplay.innerHTML = '';
            playAgainButton.style.display = 'block';
            announceWinner();
        }
    };

    const playTurn = async () => {
        if (player1Cards.length === 0 || player2Cards.length === 0) return;

        await delay(500);

        let card1 = player1Cards.shift();
        let card2 = player2Cards.shift();

        renderCards(card1, card2);

        let result = compareCards(card1, card2);
        await delay(1000);

        if (result === 1) {
            player1Cards.push(card1, card2);
        } else if (result === -1) {
            player2Cards.push(card1, card2);
        } else {
            // War scenario
            winnerMessage.innerHTML = "WAR!";
            winnerMessage.style.display = 'block';
            await delay(1000);
            handleWar(player1Cards, player2Cards, card1, card2);
            winnerMessage.style.display = 'none';
        }

        updateCardCounts();
        nextTurnButton.style.display = 'block';
        checkGameOver();
    };

    nextTurnButton.addEventListener('click', async () => {
        nextTurnButton.style.display = 'none';
        await playTurn();
    });

    playAgainButton.addEventListener('click', () => {
        location.reload(); // Reload the page to start a new game
    });

    updateCardCounts();
    await playTurn(); // Start the first turn
};

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', playWar);