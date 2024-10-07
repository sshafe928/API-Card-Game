// deckOfCardsService.js
const axios = require('axios');

const BASE_URL = 'https://deckofcardsapi.com/api/deck';

// Function to shuffle a new deck
const shuffleDeck = async (deckCount = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=${deckCount}`);
    return response.data;  // Return the shuffled deck as JSON
  } catch (error) {
    console.error('Error shuffling deck:', error);
    throw error;
  }
};

// Function to draw cards from a specific deck
const drawCards = async (deckId, count = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/${deckId}/draw/?count=${count}`);
    return response.data.cards;  // Return the drawn cards as JSON
  } catch (error) {
    console.error('Error drawing cards:', error);
    throw error;
  }
};

// Function to reshuffle an existing deck
const reshuffleDeck = async (deckId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${deckId}/shuffle/`);
    return response.data;  // Return reshuffle status as JSON
  } catch (error) {
    console.error('Error reshuffling deck:', error);
    throw error;
  }
};

// Function to create a big deck for Blackjack
const createBlackjackDeck = async () => {
  return await shuffleDeck(6);  // Shuffle 6 decks for Blackjack
};

// Function to split the deck for two players in War
const splitDeckForWar = async (deckId) => {
  try {
    const response = await drawCards(deckId, 26); // Draw 26 cards for Player 1
    const player1Cards = response; // Cards for Player 1
    const player2Cards = await drawCards(deckId, 26); // Draw 26 cards for Player 2

    return {
      player1: player1Cards,
      player2: player2Cards,
    };
  } catch (error) {
    console.error('Error splitting deck for War:', error);
    throw error;
  }
};

// Export all functions
module.exports = {
  shuffleDeck,
  drawCards,
  reshuffleDeck,
  createBlackjackDeck,
  splitDeckForWar,
};