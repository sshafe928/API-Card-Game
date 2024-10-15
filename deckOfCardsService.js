const axios = require('axios');

const BASE_URL = 'https://deckofcardsapi.com/api/deck';

// Function to shuffle a new deck
const shuffleDeck = async (deckCount = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=${deckCount}`);
    if (response.data.success) {
      return response.data;  // Return the shuffled deck as JSON
    } else {
      throw new Error('Failed to shuffle the deck.');
    }
  } catch (error) {
    console.error(`Error shuffling deck (${deckCount} decks):`, error.message || error);
    throw error;
  }
};

// Function to draw cards from a specific deck
const drawCards = async (deckId, count = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/${deckId}/draw/?count=${count}`);
    if (response.data.success) {
      return response.data.cards;  // Return the drawn cards as JSON
    } else {
      throw new Error('Failed to draw cards.');
    }
  } catch (error) {
    console.error(`Error drawing ${count} card(s) from deck (${deckId}):`, error.message || error);
    throw error;
  }
};

// Function to reshuffle an existing deck
const reshuffleDeck = async (deckId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${deckId}/shuffle/`);
    if (response.data.success) {
      return response.data;  // Return reshuffle status as JSON
    } else {
      throw new Error('Failed to reshuffle the deck.');
    }
  } catch (error) {
    console.error(`Error reshuffling deck (${deckId}):`, error.message || error);
    throw error;
  }
};

// Function to create a big deck for Blackjack (6 decks)
const createBlackjackDeck = async () => {
  try {
    return await shuffleDeck(6);  // Shuffle 6 decks for Blackjack
  } catch (error) {
    console.error('Error creating a Blackjack deck:', error.message || error);
    throw error;
  }
};

// Function to split the deck for two players in War
const splitDeckForWar = async (deckId) => {
  try {
    const player1Cards = await drawCards(deckId, 26); // Draw 26 cards for Player 1
    const player2Cards = await drawCards(deckId, 26); // Draw 26 cards for Player 2

    return {
      player1: player1Cards,
      player2: player2Cards,
    };
  } catch (error) {
    console.error(`Error splitting deck for War (${deckId}):`, error.message || error);
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
