// app.js
const {
    shuffleDeck,
    drawCards,
    reshuffleDeck,
    createBlackjackDeck,
    splitDeckForWar,
  } = require('./deckOfCardsService');
  
  (async () => {
    try {
      // Uncomment to create a big deck for Blackjack
      // const blackjackDeck = await createBlackjackDeck();
      // console.log('Blackjack Deck:', blackjackDeck);
  
      // Uncomment to shuffle a new deck
      // const newDeck = await shuffleDeck(1);
      // console.log('New Deck:', newDeck);
  
      // Uncomment to draw cards from a deck
      // const drawnCards = await drawCards('deck_id_here', 5); // Replace with a valid deck_id
      // console.log('Drawn Cards:', drawnCards);
  
      // Uncomment to reshuffle an existing deck
      // const reshuffledDeck = await reshuffleDeck('deck_id_here'); // Replace with a valid deck_id
      // console.log('Reshuffled Deck:', reshuffledDeck);
  
      // Uncomment to split the deck for two players in War
    //   const blackjackDeck = await createBlackjackDeck();
    //   const warPlayers = await splitDeckForWar(blackjackDeck.deck_id);
    //   console.log('Player 1 Cards:', warPlayers.player1);
    //   console.log('Player 2 Cards:', warPlayers.player2);
  
    } catch (error) {
      console.error('Error in Deck API calls:', error);
    }
  })();