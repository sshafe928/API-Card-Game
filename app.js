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

// Route for the Blackjack page
app.get('/blackjack', async (req, res) => {
try {
   if (!blackjackDeck) {
   blackjackDeck = await createBlackjackDeck();
   }

   playerHand = await drawCards(blackjackDeck.deck_id, 2);  // Draw 2 cards for player
   dealerHand = await drawCards(blackjackDeck.deck_id, 1);  // Draw 1 card for dealer

   const playerScore = calculateHandValue(playerHand);
   const dealerScore = calculateHandValue(dealerHand);

   res.render('blackJack', {
   playerHand,
   dealerHand,
   playerScore,
   dealerScore,
   wins,
   losses
   });
} catch (error) {
   console.error('Error starting Blackjack game:', error);
   res.status(500).send('Error starting game. Please try again later.');
}
});

// Handle form actions for hitting or standing
app.post('/play', async (req, res) => {
const action = req.body.action;

if (action === 'hit') {
   try {
   const newCard = await drawCards(blackjackDeck.deck_id, 1);
   playerHand.push(newCard[0]);
   const playerScore = calculateHandValue(playerHand);
   
   if (playerScore > 21) {
      losses++;
      res.render('blackJack', { playerHand, dealerHand, playerScore, dealerScore: calculateHandValue(dealerHand), wins, losses });
   } else {
      res.render('blackJack', { playerHand, dealerHand, playerScore, dealerScore: calculateHandValue(dealerHand), wins, losses });
   }
   } catch (error) {
   console.error('Error drawing card:', error);
   res.status(500).send('Error drawing card. Please try again later.');
   }
} else if (action === 'stand') {
   const dealerScore = calculateHandValue(dealerHand);
   
   // Simple dealer logic, drawing cards if under 17
   while (dealerScore < 17) {
   const newCard = await drawCards(blackjackDeck.deck_id, 1);
   dealerHand.push(newCard[0]);
   }

   // Determine winner and update wins/losses
   const playerScore = calculateHandValue(playerHand);
   const finalDealerScore = calculateHandValue(dealerHand);

   if (finalDealerScore > 21 || playerScore > finalDealerScore) {
   wins++;
   } else if (finalDealerScore >= playerScore) {
   losses++;
   }

   res.render('blackJack', { playerHand, dealerHand, playerScore, dealerScore: finalDealerScore, wins, losses });
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
