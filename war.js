const deckService = require('./deckOfCardsService');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleWar = (player1, player2) => {
    const pot = []; 

    // Check if both players have enough cards for war
    if (player1.length < 3 || player2.length < 3) {
        console.log("A player doesn't have enough cards for war!");
        if (player1.length < 3) {
            console.log('Player 2 wins!');
            player2.push(...pot); // Add remaining pot to Player 2
        } else {
            console.log('Player 1 wins!');
            player1.push(...pot); // Add remaining pot to Player 1
        }
        return;
    }

    // Draw 2 cards from each player and add to the pot
    const player1WarCards = player1.splice(0, 2); // Draw 2 cards from Player 1
    const player2WarCards = player2.splice(0, 2); // Draw 2 cards from Player 2

    // Add drawn cards to the pot
    pot.push(...player1WarCards, ...player2WarCards);

    console.log(`Player 1 puts in: ${player1WarCards.map(card => `${card.value} of ${card.suit}`).join(', ')}`);
    console.log(`Player 2 puts in: ${player2WarCards.map(card => `${card.value} of ${card.suit}`).join(', ')}`);

    // Now, draw the third card for comparison
    const card1 = player1.shift(); // Draw the next card for Player 1
    const card2 = player2.shift(); // Draw the next card for Player 2

    console.log(`Player 1 draws: ${card1.value} of ${card1.suit}`);
    console.log(`Player 2 draws: ${card2.value} of ${card2.suit}`);

    pot.push(card1, card2);

    const battle = compareCards(card1, card2);

    if (battle === 1) {
        // Player 1 wins the round
        player1.push(...pot); // Spread the pot into Player 1's deck
        console.log("Player 1 wins the round!");
    } else if (battle === -1) {
        // Player 2 wins the round
        player2.push(...pot); // Spread the pot into Player 2's deck
        console.log("Player 2 wins the round!");
    } else {
        // It's a tie again, call handleWar recursively
        console.log("It's a tie! War time...");
        handleWar(player1, player2);
    }
};

const playWar = async () => {
    try {
        // Step 1: Shuffle a new deck
        const deck = await deckService.shuffleDeck();
        const deckId = deck.deck_id;

        // Step 2: Split the deck for two players
        const { player1, player2 } = await deckService.splitDeckForWar(deckId);

        // Step 3: Game loop
        while (player1.length > 0 && player2.length > 0) {
            // Delay for a moment before drawing cards
            await delay(1000); // Wait for 1 second

            const card1 = player1.shift(); // Draw the top card for Player 1
            const card2 = player2.shift(); // Draw the top card for Player 2
            
            console.log(`Player 1 plays: ${card1.value} of ${card1.suit}`);
            console.log(`Player 2 plays: ${card2.value} of ${card2.suit}`);

            // Step 4: Compare Cards
            const result = compareCards(card1, card2);
            await delay(1000); // Wait for 1 second before showing the result

            if (result === 1) {
                player1.push(card1, card2); // Player 1 wins the round
                console.log("Player 1 wins the round!");
            } else if (result === -1) {
                player2.push(card1, card2); // Player 2 wins the round
                console.log("Player 2 wins the round!");
            } else {
                console.log("It's a tie! War time...");
                // War logic 
                handleWar(player1, player2)
            }

            console.log(`Cards left - Player 1: ${player1.length}, Player 2: ${player2.length}`);
            await delay(2000); // Wait for 2 seconds before the next round starts
        }

        // Step 5: Announce the winner
        if (player1.length > 0) {
            console.log("Player 1 wins the game!");
        } else {
            console.log("Player 2 wins the game!");
        }

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