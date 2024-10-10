const express = require('express');
const path = require('path');
const app = express();
const {
  shuffleDeck,
  drawCards,
  reshuffleDeck,
  createBlackjackDeck,
  splitDeckForWar,
} = require('./deckOfCardsService');



// Set up the view engine to use EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Set views folder

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for Blackjack page
app.get('/blackjack', (req, res) => {
   res.render('blackJack');  // Renders blackJack.ejs
});

// Route for War page
app.get('/war', (req, res) => {
   res.render('war');  // Renders war.ejs
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});