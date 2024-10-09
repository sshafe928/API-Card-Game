const { shuffleDeck, drawCards } = require('./deckOfCardsService');
const readline = require('readline');

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
    'JACK': 10,
    'QUEEN': 10,
    'KING': 10,
    'ACE': 11, // Ace can be 1 or 11
};

function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;

    for (const card of hand) {
        const cardValue = CARD_VALUES[card.value] || 0;
        total += cardValue;
        if (card.value === 'ACE') {
            aceCount++;
        }
    }

    // Adjust Ace values from 11 to 1 as needed to prevent busting
    while (aceCount > 0 && total > 21) {
        total -= 10; // Convert one Ace from 11 to 1
        aceCount--;
    }

    return total;
}

function playBlackjack() {
    // Create a shuffled deck for Blackjack (using 6 decks)
    shuffleDeck(6).then((blackjackDeck) => {
        // Deal two cards to the player and one to the dealer
        drawCards(blackjackDeck.deck_id, 2).then((playerHand) => {
            drawCards(blackjackDeck.deck_id, 1).then((dealerHand) => {
                console.log('Your cards:', playerHand.map(card => `${card.value} of ${card.suit}`));

                let playerScore = calculateHandValue(playerHand);
                let dealerScore = calculateHandValue(dealerHand);

                console.log('Your score:', playerScore);
                console.log('Dealer shows:', `${dealerHand[0].value} of ${dealerHand[0].suit}`); // Only show one dealer card

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                function hit() {
                    drawCards(blackjackDeck.deck_id, 1).then((newCard) => {
                        playerHand.push(newCard[0]); // Add the new card to player's hand
                        playerScore = calculateHandValue(playerHand); // Recalculate player's score
                        console.log('You drew:', `${newCard[0].value} of ${newCard[0].suit}`);
                        console.log('Your cards:', playerHand.map(card => `${card.value} of ${card.suit}`));
                        console.log('Your score:', playerScore);

                        if (playerScore > 21) {
                            console.log('You BUSTED! You lose.');
                            rl.close();
                        } else {
                            promptPlayer();
                        }
                    }).catch(err => {
                        console.error('Error drawing card:', err);
                        rl.close();
                    });
                }

                function stand() {
                    console.log('You chose to stand.');
                    console.log('Dealer reveals their hidden card:', `${dealerHand[0].value} of ${dealerHand[0].suit}`);
                    
                    // Dealer draws until reaching at least 17
                    const dealerTurn = () => {
                        dealerScore = calculateHandValue(dealerHand);
                        console.log('Dealer\'s current score:', dealerScore);
                        
                        if (dealerScore < 17) {
                            drawCards(blackjackDeck.deck_id, 1).then((newCard) => {
                                dealerHand.push(newCard[0]); // Add the new card to dealer's hand
                                console.log('Dealer draws:', `${newCard[0].value} of ${newCard[0].suit}`);
                                dealerScore = calculateHandValue(dealerHand);
                                console.log('Dealer\'s score:', dealerScore);

                                if (dealerScore > 21) {
                                    console.log('Dealer BUSTS! You win!');
                                    rl.close();
                                } else if (dealerScore < 17) {
                                    dealerTurn();
                                } else {
                                    checkWinner();
                                }
                            }).catch(err => {
                                console.error('Error drawing card for dealer:', err);
                                rl.close();
                            });
                        } else {
                            checkWinner();
                        }
                    };

                    dealerTurn();
                }

                function checkWinner() {
                    console.log('\nFinal Scores:');
                    console.log('Your score:', playerScore);
                    console.log('Dealer\'s score:', dealerScore);

                    if (dealerScore > 21) {
                        console.log('Dealer BUSTS! You win!');
                    } else if (playerScore > dealerScore) {
                        console.log('You win!');
                    } else if (playerScore === dealerScore) {
                        console.log('Push (tie).');
                    } else {
                        console.log('You lose.');
                    }

                    rl.close();
                }

                function promptPlayer() {
                    rl.question('Hit (h) or Stand (s)? ', (choice) => {
                        choice = choice.trim().toLowerCase();
                        if (choice === 'h') {
                            hit();
                        } else if (choice === 's') {
                            stand();
                        } else {
                            console.log('Invalid choice. Please enter "h" to Hit or "s" to Stand.');
                            promptPlayer();
                        }
                    });
                }

                // Initial prompt without choosing Ace value manually
                promptPlayer();
            }).catch(err => {
                console.error('Error dealing dealer\'s initial card:', err);
            });
        }).catch(err => {
            console.error('Error dealing player\'s initial cards:', err);
        });
    }).catch(err => {
        console.error('Error shuffling deck:', err);
    });
}

playBlackjack();
