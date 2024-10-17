Sure! Here’s the detailed README for your card game project in a single text field:

Card Game Project README

Overview

This project is a web-based card game platform built with Node.js, Express, and EJS for rendering views. The primary games implemented are Blackjack and War, using the Deck of Cards API to handle deck creation, shuffling, and card drawing. The project focuses on the backend functionality, while the CSS is a work in progress and may change through iterations.

Table of Contents

	1.	Project Structure
	2.	How It Works
	1.	Game Setup
	2.	Blackjack
	3.	War
	3.	API Integration
	4.	Utility Functions
	5.	Running the Project
	6.	Future Improvements

Project Structure

├── public/
│   └── css/         # (CSS files will go here)
├── views/
│   ├── index.ejs    # Landing page view
│   ├── blackJack.ejs # Blackjack game view
│   ├── war.ejs      # War game view
├── app.js           # Main application file (Express server setup)
├── deckOfCardsService.js # API communication and card handling logic
├── blackJack.js     # Command-line version of Blackjack
├── package.json     # Project dependencies and scripts

How It Works

This project is primarily driven by app.js, which handles routes and renders EJS views for the card games. The backend logic for interacting with the Deck of Cards API is handled by deckOfCardsService.js.

Game Setup

	•	When the server starts, users can navigate to different game routes like /blackjack or /war.
	•	Each game route initializes a new game session using the Deck of Cards API to shuffle and manage card decks.

Blackjack

Route: /blackjack

	•	GET request: Initializes a new Blackjack game, drawing two cards for the player and one card for the dealer. It renders blackJack.ejs with the game state, including player’s hand, dealer’s hand, scores, and game status.
	•	POST request: Handles two actions:
	•	Hit: Draws an additional card for the player and updates their hand and score. If the player’s score exceeds 21, the player loses, and the game ends.
	•	Stand: Finalizes the player’s turn. The dealer then draws cards until their score is 17 or higher. The winner is decided based on the final scores.

Game Logic:

	•	The player must try to get their card total close to or equal to 21 without exceeding it.
	•	The dealer must draw until their total reaches at least 17.
	•	If either the player or the dealer exceeds 21, they lose the game (“bust”).

// Utility function to calculate the hand value
function calculateHandValue(hand) {
  const CARD_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'JACK': 10, 'QUEEN': 10, 'KING': 10, 'ACE': 11
  };

  let total = 0;
  let aceCount = 0;

  hand.forEach(card => {
    total += CARD_VALUES[card.value];
    if (card.value === 'ACE') aceCount++;
  });

  while (aceCount > 0 && total > 21) {
    total -= 10; // Adjust ACE value from 11 to 1 if necessary
    aceCount--;
  }

  return total;
}

War

Route: /war

	•	GET request: Initializes a new game of War by splitting the shuffled deck into two halves, one for each player. These hands are displayed in the war.ejs view.

Game Logic:

	•	The game involves each player drawing a card, and the player with the higher card wins that round. There is no advanced logic for the game rules beyond displaying the split deck.

API Integration

The project uses the Deck of Cards API for managing card decks. The API enables deck shuffling, card drawing, and reshuffling.

Key Functions (in deckOfCardsService.js):

	1.	shuffleDeck(deckCount = 1): Creates and shuffles a new deck (or multiple decks).

const response = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=${deckCount}`);


	2.	drawCards(deckId, count = 1): Draws a specified number of cards from a deck.

const response = await axios.get(`${BASE_URL}/${deckId}/draw/?count=${count}`);


	3.	reshuffleDeck(deckId): Reshuffles an existing deck.

const response = await axios.get(`${BASE_URL}/${deckId}/shuffle/`);


	4.	createBlackjackDeck(): Shuffles a deck with 6 sets of cards, designed specifically for Blackjack.

return await shuffleDeck(6);


	5.	splitDeckForWar(deckId): Splits a shuffled deck into two halves for each player in War.

const player1Cards = await drawCards(deckId, 26); // Player 1's half
const player2Cards = await drawCards(deckId, 26); // Player 2's half



Utility Functions

Calculate Hand Value

The function calculateHandValue calculates the total value of a player’s hand in Blackjack, accounting for the flexible value of aces (1 or 11).

Player Actions in Blackjack

The following flow is handled in app.js:

	•	Hit: Adds a new card to the player’s hand and checks if the player has busted.
	•	Stand: The dealer draws cards and the winner is determined based on final scores.

Running the Project

Prerequisites

	•	Node.js
	•	Express.js
	•	Axios
	•	EJS

Setup

	1.	Clone the repository:

git clone https://github.com/your-repo/card-game.git


	2.	Install dependencies:

cd card-game
npm install


	3.	Start the server:

npm start


	4.	Open your browser and go to http://localhost:3000 to start the game.

Future Improvements

	•	Enhanced War Logic: Currently, War only splits the deck. A full implementation of War gameplay mechanics is planned.
	•	CSS Updates: The UI is expected to change through iterations. This README will continue focusing on backend and game logic.
	•	Mobile Responsiveness: Improvements for a better user experience on mobile devices.
	•	Database Integration: To track game statistics, user accounts, and multiplayer functionality.

This README serves as a guide to understanding the internal workings of the project, especially around the core JavaScript logic. Contributions and iterations are welcome!

