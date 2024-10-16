const deckService = require('./deckOfCardsService');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleWar = async (player1, player2, extracard1, extracard2) => {
    const pot = []; 
    pot.push(extracard1, extracard2);

    // Check if both players have enough cards for war
    if (player1.length < 3 || player2.length < 3) {
        console.log("A player doesn't have enough cards for war!");
        if (player1.length < 3) {
            console.log('Player 2 wins!');
            player2.push(...pot);
        } else {
            console.log('Player 1 wins!');
            player1.push(...pot);
        }
        return;
    }

    // Draw 2 cards from each player and add to the pot
    const player1WarCards = player1.splice(0, 2);
    const player2WarCards = player2.splice(0, 2);
    pot.push(...player1WarCards, ...player2WarCards);

    const card1 = player1.shift();
    const card2 = player2.shift();
    pot.push(card1, card2);

    const battle = compareCards(card1, card2);

    if (battle === 1) {
        player1.push(...pot);
        console.log("Player 1 wins the round!");
    } else if (battle === -1) {
        player2.push(...pot);
        console.log("Player 2 wins the round!");
    } else {
        console.log("It's a tie! War time...");
        await handleWar(player1, player2, card1, card2);
    }
};

const playWar = async () => {
    try {
        const deck = await deckService.shuffleDeck();
        const deckId = deck.deck_id;
        const { player1, player2 } = await deckService.splitDeckForWar(deckId);

        const nextTurnButton = document.getElementById('next-turn-btn');
        const playAgainButton = document.getElementById('play-again-btn');
        const winnerMessage = document.getElementById('winner-message');
        const playerCardsDisplay = document.getElementById('player-cards');
        const dealerCardsDisplay = document.getElementById('dealer-cards');

        const playTurn = async () => {
            if (player1.length === 0 || player2.length === 0) return;

            await delay(1000);

            const card1 = player1.shift();
            const card2 = player2.shift();

            console.log(`Player 1 plays: ${card1.value} of ${card1.suit}`);
            console.log(`Player 2 plays: ${card2.value} of ${card2.suit}`);

            renderCards(card1, card2);

            const result = compareCards(card1, card2);
            await delay(1000);

            if (result === 1) {
                player1.push(card1, card2);
                console.log("Player 1 wins the round!");
            } else if (result === -1) {
                player2.push(card1, card2);
                console.log("Player 2 wins the round!");
            } else {
                console.log("It's a tie! War time...");
                await handleWar(player1, player2, card1, card2);
            }

            console.log(`Cards left - Player 1: ${player1.length}, Player 2: ${player2.length}`);
            nextTurnButton.style.display = 'block';
        };

        const renderCards = (card1, card2) => {
            playerCardsDisplay.innerHTML = ''; // Clear previous cards
            dealerCardsDisplay.innerHTML = ''; // Clear previous cards

            const cardImage1 = document.createElement('img');
            const cardImage2 = document.createElement('img');

            cardImage1.src = card1.images.svg; 
            cardImage2.src = card2.images.svg;

            cardImage1.alt = `${card1.value} of ${card1.suit}`;
            cardImage2.alt = `${card2.value} of ${card2.suit}`;

            cardImage1.style.width = '100px'; // Width for card image
            cardImage2.style.width = '100px'; // Width for card image

            playerCardsDisplay.appendChild(cardImage1); 
            dealerCardsDisplay.appendChild(cardImage2); 
        };

        const checkGameOver = () => {
            if (player1.length === 0 || player2.length === 0) {
                nextTurnButton.style.display = 'none';
                playerCardsDisplay.innerHTML = ''; // Clear cards
                dealerCardsDisplay.innerHTML = ''; // Clear cards
                playAgainButton.style.display = 'block'; // Show Play Again button

                // Announce the winner
                announceWinner(player1, player2);
            }
        };

        nextTurnButton.addEventListener('click', async () => {
            nextTurnButton.style.display = 'none';
            await playTurn();
            checkGameOver();
        });

        playAgainButton.addEventListener('click', () => {

            playWar(); // Restart the game
            playAgainButton.style.display = 'none'; // Hide Play Again button
            winnerMessage.style.display = 'none'; // Hide winner message
        });

        const announceWinner = (player1, player2) => {
            const message = document.getElementById('winner-message');
            if (player1.length > 0) {
                message.innerHTML = "Player 1 wins the game!";
            } else {
                message.innerHTML = "Player 2 wins the game!";
            }
            message.style.display = 'block'; // Show the message
        };

        // Start the first turn
        await playTurn();

    } catch (error) {
        console.error('Error during game:', error);
    }
};

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

// Start the game
playWar();