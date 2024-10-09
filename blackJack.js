const { shuffleDeck, drawCards } = require('./deckOfCardsService');

// Define constants for card values
const CARD_VALUES = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'A': 11, // Ace can be 1 or 11
};

function calculateHandValue(hand) {
    let total = 0;
    let hasAce = false;
    for (const card of hand) {
        total += CARD_VALUES[card.value];
        if (card.value === 'A') {
            hasAce = true;
        }
    }
    // Adjust Ace value if necessary to avoid bust
    if (hasAce && total > 21) {
        total -= 10;
    }
    return total;
}

async function playBlackjack() {
    try {
        // Create a shuffled deck for Blackjack
        const blackjackDeck = await shuffleDeck(6);

        // Deal two cards to the player and one to the dealer
        const playerHand = await drawCards(blackjackDeck.deck_id, 2);
        const dealerHand = await drawCards(blackjackDeck.deck_id, 1);

        console.log('Your cards:', playerHand);

        let playerScore = calculateHandValue(playerHand);
        let dealerScore = calculateHandValue(dealerHand);

        console.log('Your score:', playerScore);
        console.log('Dealer shows:', dealerHand[0]); // Only show one dealer card

        let isPlaying = true;
        while (isPlaying) {
            // Prompt user for input using inquirer
            const { choice } = await inquirer.prompt({
                type: 'list',
                name: 'choice',
                message: 'Hit (h) or Stand (s)?',
                choices: ['Hit', 'Stand'],
            });

            if (choice === 'Hit') {
                const newCard = await drawCards(blackjackDeck.deck_id, 1);
                playerHand.push(newCard[0]);
                playerScore = calculateHandValue(playerHand);
                console.log('Your cards:', playerHand);
                console.log('Your score:', playerScore);

                if (playerScore > 21) {
                    console.log('You BUSTED!');
                    isPlaying = false;
                }
            } else if (choice === 'Stand') {
                isPlaying = false;

                // Reveal dealer's second card and hit until 17 or bust
                console.log('Dealer reveals:', dealerHand);
                dealerScore = calculateHandValue(dealerHand);
                while (dealerScore < 17) {
                    const newCard = await drawCards(blackjackDeck.deck_id, 1);
                    dealerHand.push(newCard[0]);
                    dealerScore = calculateHandValue(dealerHand);
                    console.log('Dealer hits:', newCard);
                    console.log('Dealer score:', dealerScore);
                    if (dealerScore > 21) {
                        console.log('Dealer BUSTED!');
                    }
                }
            } else {
                console.log('Invalid choice. Please enter h or s.');
            }
        }

        // Determine winner
        if (playerScore > 21) {
            console.log('You lose.');
        } else if (dealerScore > 21) {
            console.log('You win!');
        } else if (playerScore > dealerScore) {
            console.log('You win!');
        } else if (playerScore === dealerScore) {
            console.log('Push (tie).');
        } else {
            console.log('You lose.');
        }

    } catch (error) {
        console.error('Error playing Blackjack:', error);
    }
}

playBlackjack();