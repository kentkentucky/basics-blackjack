// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};


// Function to create a standard deck of 52 poker cards
var createCardDeck = function() {
  var cardDeck = []; // init an array to store the cards
  var suitArray = ['diamonds', 'clubs', 'hearts', 'spades']; // an array for the suit of cards


  for (var suitIndex = 0; suitIndex < suitArray.length; suitIndex++) { // iterating through the suits array
    var currentSuit = suitArray[suitIndex]; // init and save current suit
    for (var rankIndex = 1; rankIndex <= 13; rankIndex++) { // iterating through the number of cards each suit is supposed to consist of.
      var rankName = rankIndex; // save current card index
      var cardValue = rankIndex; // save current card value

      if (rankIndex === 1) {
        rankName = 'ace';
        cardValue = 11;  // Ace is 11 by default, we'll handle its dual value in calculateHandValue
      } else if (rankIndex === 11) {
        rankName = 'jack';
        cardValue = 10;
      } else if (rankIndex === 12) {
        rankName = 'queen';
        cardValue = 10;
      } else if (rankIndex === 13) {
        rankName = 'king';
        cardValue = 10;
      }

      // init an object to store the detail of the card
      var card = {
        rank: rankIndex,
        suit: currentSuit,
        name: rankName,
        value: cardValue
      };
      // push the card object (details of the card) to the card deck array
      cardDeck.push(card);
    }
  }
  return cardDeck; // once the deck has been made, the function will return the whole deck
};

// calculates the total value the users hand has after drawing
var calculateHandValue = function(hand) {
  var total = 0;
  var aceCount = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].name === 'ace') {
      aceCount++;
    }
    total += hand[i].value;
  }
  // Adjust for Aces
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
};

// Display the hand of the player and the user
var displayHand = function(hand, isDealer = false, hideSecond = false) {
  var output = '';
  for (var i = 0; i < hand.length; i++) {
    if (isDealer && hideSecond && i === 1) {
      output += 'Hidden Card, ';
    } else {
      output += `${hand[i].name} of ${hand[i].suit}, `;
    }
  }
  return output.slice(0, -2);  // Remove the last comma and space
};

// Initialise object to keep track of the game states and the cards at hand
var gameState = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  gamePhase: 'start', // 'start', 'playerTurn', 'dealerTurn', 'gameOver'
  playerStand: false
};

// Deals the first set of cards when a new game starts
var dealInitialCards = function() {
  gameState.playerHand = [gameState.deck.pop(), gameState.deck.pop()];
  gameState.dealerHand = [gameState.deck.pop(), gameState.deck.pop()];
  gameState.gamePhase = 'playerTurn';
};

// Checks is the dealer or the user has blackjack
var checkForBlackjack = function() {
  var playerValue = calculateHandValue(gameState.playerHand);
  var dealerValue = calculateHandValue(gameState.dealerHand);
  
  if (playerValue === 21 && dealerValue === 21) {
    return "Both player and dealer have Blackjack! It's a tie!";
  } else if (playerValue === 21) {
    return "Player wins with Blackjack!";
  } else if (dealerValue === 21) {
    return "Dealer wins with Blackjack!";
  }
  return null;
};

// Determine the actions to take based on the users action after the initial cards have been drawn
var playerAction = function(action) {
  if (action === 'hit') {
    gameState.playerHand.push(gameState.deck.pop());
    if (calculateHandValue(gameState.playerHand) > 21) {
      gameState.gamePhase = 'dealerTurn';
    }
  } else if (action === 'stand') {
    gameState.playerStand = true;
    gameState.gamePhase = 'dealerTurn';
  }
};

// Determines the action of the dealer
var dealerAction = function() {
  while (calculateHandValue(gameState.dealerHand) < 17) {
    gameState.dealerHand.push(gameState.deck.pop());
  }
  gameState.gamePhase = 'gameOver';
};

// Check the winning conditions
var determineWinner = function() {
  var playerValue = calculateHandValue(gameState.playerHand);
  var dealerValue = calculateHandValue(gameState.dealerHand);

  if (playerValue > 21 && dealerValue > 21) {
    return "Both player and dealer bust. It's a tie!";
  } else if (playerValue > 21) {
    return "Player busts! Dealer wins.";
  } else if (dealerValue > 21) {
    return "Dealer busts! Player wins.";
  } else if (playerValue > dealerValue) {
    return "Player wins!";
  } else if (dealerValue > playerValue) {
    return "Dealer wins.";
  } else {
    return "It's a tie!";
  }
};

var main = function (input) {
  var output = '';

  if (gameState.gamePhase === 'start') {
    gameState.deck = shuffleCards(createCardDeck());
    dealInitialCards();
    var blackjackResult = checkForBlackjack();
    if (blackjackResult) {
      output = blackjackResult;
      gameState.gamePhase = 'gameOver';
    } else {
      output = "Cards dealt. Your turn.";
    }
  } else if (gameState.gamePhase === 'playerTurn') {
    if (input === 'hit' || input === 'stand') {
      playerAction(input);
      if (gameState.gamePhase === 'dealerTurn') {
        dealerAction();
      }
    } else {
      output = "Invalid input. Please enter 'hit' or 'stand'.";
    }
  }

  // Display current hands
  output += "<br>Your hand: " + displayHand(gameState.playerHand);
  output += "<br>Dealer's hand: " + displayHand(gameState.dealerHand, true, gameState.gamePhase !== 'gameOver');

  if (gameState.gamePhase === 'gameOver') {
    output = determineWinner();

    // Display current hands
    output += "<br>Your hand: " + displayHand(gameState.playerHand);
    output += "<br>Dealer's hand: " + displayHand(gameState.dealerHand, true, gameState.gamePhase !== 'gameOver');
    // Reset game state for next game
    gameState.gamePhase = 'start';
    gameState.playerHand = [];
    gameState.dealerHand = [];
    gameState.playerStand = false;
  }
  
  if (gameState.gamePhase === 'playerTurn') {
    output += "<br>Do you want to 'hit' or 'stand'?";
  }

  return output;
};