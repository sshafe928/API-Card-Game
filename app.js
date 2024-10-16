const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // To handle form submissions
const { createBlackjackDeck, drawCards } = require('./deckOfCardsService');

const app = express();

// Middleware for form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the view engine to use EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

let blackjackDeck;
let playerHand = [];
let dealerHand = [];
let wins = 0;
let losses = 0;
let showDealerHand = false; // Used to toggle visibility of dealer's cards

let gameOver = false; // Track if the game is over
let gameResult = "";  // Store result message ("You win!", "Dealer wins!", etc.)

app.set('view engine', 'ejs');

// Define a route to render index.ejs
app.get('/', (req, res) => {
   res.render('index');
});

// Route for the Blackjack page (GET request to start or reset the game)
app.get('/blackjack', async (req, res) => {
try {
   if (!blackjackDeck) {
   blackjackDeck = await createBlackjackDeck();
   }

   // Initial draw: 2 cards for player, 1 for dealer
   playerHand = await drawCards(blackjackDeck.deck_id, 2);
   dealerHand = await drawCards(blackjackDeck.deck_id, 1);

   const playerScore = calculateHandValue(playerHand);
   const dealerScore = calculateHandValue(dealerHand);

   // Reset flags
   showDealerHand = false;
   gameOver = false;
   gameResult = "";

   res.render('blackJack', {
   playerHand,
   dealerHand,
   playerScore,
   dealerScore,
   wins,
   losses,
   showDealerHand,
   gameOver,
   gameResult
   });
} catch (error) {
   console.error('Error starting Blackjack game:', error);
   res.status(500).send('Error starting game. Please try again later.');
}
});

// Handle form actions for hitting or standing
app.post('/blackjack', async (req, res) => {
const action = req.body.action;

// Calculate player and dealer scores
const playerScore = calculateHandValue(playerHand);
let dealerScore = calculateHandValue(dealerHand);

if (gameOver) {
   // If the game is over, don't allow further actions
   return res.redirect('/blackjack');
}

if (action === 'hit') {
   // Player hits (draw a new card)
   try {
   const newCard = await drawCards(blackjackDeck.deck_id, 1);
   playerHand.push(newCard[0]); // Add new card to player's hand

   const updatedPlayerScore = calculateHandValue(playerHand);

   // Check if the player busts (goes over 21)
   if (updatedPlayerScore > 21) {
      losses++;
      gameOver = true;
      showDealerHand = true; // Reveal dealer's hand
      gameResult = "You lost! Dealer wins!";
   }

   res.render('blackJack', {
      playerHand,
      dealerHand,
      playerScore: updatedPlayerScore,
      dealerScore,
      wins,
      losses,
      showDealerHand,
      gameOver,
      gameResult
   });

   } catch (error) {
   console.error('Error drawing card:', error);
   res.status(500).send('Error drawing card. Please try again later.');
   }

} else if (action === 'stand') {
   // Player stands, reveal dealer's cards and finalize game
   showDealerHand = true;

   // Dealer must draw if their score is less than 17
   while (dealerScore < 17) {
   const newCard = await drawCards(blackjackDeck.deck_id, 1);
   dealerHand.push(newCard[0]);
   dealerScore = calculateHandValue(dealerHand);
   }

   // Determine the winner
   if (dealerScore > 21 || playerScore > dealerScore) {
   wins++;
   gameResult = "You win!";
   } else {
   losses++;
   gameResult = "Dealer wins!";
   }

   gameOver = true;

   res.render('blackJack', {
   playerHand,
   dealerHand,
   playerScore,
   dealerScore,
   wins,
   losses,
   showDealerHand,
   gameOver,
   gameResult
   });
}
});

// Reset game route
app.post('/blackjack/reset', async (req, res) => {
try {
   blackjackDeck = await createBlackjackDeck(); // Create a new deck for the new game
   playerHand = [];
   dealerHand = [];
   gameOver = false;
   gameResult = "";

   res.redirect('/blackjack'); // Restart the game
} catch (error) {
   console.error('Error resetting game:', error);
   res.status(500).send('Error resetting game. Please try again later.');
}
});

// Utility function to calculate the hand value
function calculateHandValue(hand) {
const CARD_VALUES = {
   '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
   'JACK': 10, 'QUEEN': 10, 'KING': 10, 'ACE': 11
};

let total = 0;
let aceCount = 0;

hand.forEach(card => {
   const cardValue = CARD_VALUES[card.value] || 0;
   total += cardValue;
   if (card.value === 'ACE') {
   aceCount++;
   }
});

while (aceCount > 0 && total > 21) {
   total -= 10; // Adjust ACE value from 11 to 1 if necessary
   aceCount--;
}

return total;
}




app.get('/war', (req, res) => {
   res.render('war', { gameOver: false, gameResult: '' }); 
});

app.post('/war/reset', (req, res) => {
   // Logic to reset the game state goes here

   res.redirect('/war');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
