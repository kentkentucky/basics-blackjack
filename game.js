const urlParams = new URLSearchParams(window.location.search);
const coins = parseInt(urlParams.get('coins'));
const bet = parseInt(urlParams.get('bet'));
const id = urlParams.get('userid');
let earnings = 0;

let shuffleSound = new Audio('sound effects/mixkit-thin-metal-card-deck-shuffle-3175.wav');
let hitSound = new Audio('sound effects/mixkit-poker-card-flick-2002.wav');
let coinSound = new Audio('sound effects/mixkit-clinking-coins-1993.wav');

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) 
{
  return Math.floor(Math.random() * max);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) 
{
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) 
  {
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
var createCardDeck = function() 
{
  var cardDeck = []; // init an array to store the cards
  var suitArray = ['diamonds', 'clubs', 'hearts', 'spades']; // an array for the suit of cards

  for (var suitIndex = 0; suitIndex < suitArray.length; suitIndex++) 
  { // iterating through the suits array
    var currentSuit = suitArray[suitIndex]; // init and save current suit
    for (var rankIndex = 1; rankIndex <= 13; rankIndex++) 
    { // iterating through the number of cards each suit is supposed to consist of.
      var rankName = rankIndex; // save current card index
      var cardValue = rankIndex; // save current card value

      if (rankIndex === 1) 
      {
        rankName = 'ace';
        cardValue = 11;  // Ace is 11 by default, we'll handle its dual value in calculateHandValue
      } 
      else if (rankIndex === 11) 
      {
        rankName = 'jack';
        cardValue = 10;
      } 
      else if (rankIndex === 12) 
      {
        rankName = 'queen';
        cardValue = 10;
      } 
      else if (rankIndex === 13) 
      {
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

// Deals the first set of cards when a new game starts
var dealInitialCards = function() 
{
    gameState.player1Hand = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.userHand = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.player2Hand = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.dealerHand = [gameState.deck.pop(), gameState.deck.pop()];
};

let displayHand = function(hand, isBot = false, hideRest = false, gameOver = false)
{
  let card = '<div class="hand">';

  for (var i = 0; i < hand.length; i++) 
  {
    if(isBot && hideRest && !gameOver && i >= 1)
    {
      card += '<img src="card-images/back.png" alt="Hidden Card" class="card">';
    } 
    else 
    {
      let cardName = `${hand[i].name}_of_${hand[i].suit}`.toLowerCase();
      card += `<img src="card-images/${cardName}.png" alt="${hand[i].name} of ${hand[i].suit}" class="card">`;
    }
  }

  return card;
};

// calculates the total value the users hand has after drawing
let calculateHandValue = function(hand) 
{
    var total = 0;
    var aceCount = 0;
    for (let i = 0; i < hand.length; i++) 
    {
        if (hand[i].name === 'ace') 
        {
            aceCount++;
        }
        total += hand[i].value;
    }
    // Adjust for Aces
    while (total > 21 && aceCount > 0) 
    {
        total -= 10;
        aceCount--;
    }
    return total;
};

let checkForPocketAce = function(allHands)
{
    if(allHands[1][0].name == 'ace' && allHands[1][1].name == 'ace')
    {
        earnings += bet * 3;
        return "You have won with Pocket Ace!"
    }

    if(allHands[3][0].name == 'ace' && allHands[3][1].name == 'ace')
    {
        earnings -= bet * 3;
        return "Dealer have won with Pocket Ace!"
    }

    return null;
};

let checkForBlackJack = function(allHands)
{
    if(calculateHandValue(allHands[1]) == 21)
    {
        earnings += bet * 2;
        return "You have won with Black Jack!";
    }

    if(calculateHandValue(allHands[3]) == 21)
    {
        earnings -= bet * 2;
        return "Dealer have won with Black Jack!";
    }

    return null;
};

let botAction = function()
{
    if(gameState.gamePhase.isPlayer1Turn)
    {
        while(calculateHandValue(gameState.player1Hand) < 17)
        {
            gameState.player1Hand.push(gameState.deck.pop());
        }
    }

    if(gameState.gamePhase.isPlayer2Turn)
    {
        while(calculateHandValue(gameState.player2Hand) < 17)
        {
            gameState.player2Hand.push(gameState.deck.pop());
        }
    }

    if(gameState.gamePhase.isDealerTurn)
    {
        while(calculateHandValue(gameState.dealerHand) < 17)
        {
            gameState.dealerHand.push(gameState.deck.pop());
        }
    }
};

// Determine the actions to take based on the users action after the initial cards have been drawn
let userAction = function(action) 
{
    if(gameState.gamePhase.isUserTurn)
    {
        if(action === 'hit') 
        {
            gameState.userHand.push(gameState.deck.pop());
            hitSound.play();
            if (calculateHandValue(gameState.userHand) > 21) 
            {
                gameState.gamePhase.isUserTurn = false;
                gameState.gamePhase.isPlayer2Turn = true;
            }
        } 
        if(action === 'stand')
        {
            gameState.gamePhase.isUserTurn = false;
            gameState.gamePhase.isPlayer2Turn = true;
        }
    }
};

let determineWinner = function()
{
    let userValue = calculateHandValue(gameState.userHand);
    let dealerValue = calculateHandValue(gameState.dealerHand);

    // Check for 5 card win
    if(gameState.userHand.length === 5 && userValue <= 21) 
    {
        earnings += bet * 2;
        return "User wins with 5 cards!";
    } 
    else if(gameState.dealerHand.length === 5 && dealerValue <= 21) 
    {  
        earnings -= bet * 2;
        return "Dealer wins with 5 cards!";
    }

    //Normal check
    if(userValue > 21 && dealerValue > 21) 
    {
        return "Both user and dealer bust. It's a tie!";
    } 
    else if(userValue > 21) 
    {
        earnings -= bet;
        return "User busts! Dealer wins.";
    } 
    else if(dealerValue > 21) 
    {
        earnings += bet;
        return "Dealer busts! User wins.";
    } 
    else if(userValue > dealerValue) 
    {
        earnings += bet;
        return "User wins!";
    } 
    else if(dealerValue > userValue) 
    {
        earnings -= bet;
        return "Dealer wins.";
    }
    else
    {
        return "It's a tie!";
    }
};

function resetGameState()
{
    gameState.gamePhase.isGameOver = false;
    gameState.gamePhase.isStart = true;
    gameState.userHand = [];
    gameState.player1Hand = [];
    gameState.player2Hand = [];
    gameState.dealerHand = [];
};
  
// Initialise object to keep track of the game states and the cards at hand
let gameState = {
    deck: [],
    player1Hand: [],
    userHand: [],
    player2Hand: [],
    dealerHand: [],
    gamePhase: {
        isStart: true,
        isPlayer1Turn: false,
        isUserTurn: false,
        isPlayer2Turn: false,
        isDealerTurn: false,
        isGameOver: false,
    },
};

let main = function()
{
    let player1Output = '';
    let userOutput = '';
    let handValue = '';
    let player2Output = '';
    let dealerOutput = '';
    let output = '';
    let earningOutput = '';
    let gameOver = false;

    if(gameState.gamePhase.isStart)
    {
        shuffleSound.play();
        gameState.deck = shuffleCards(createCardDeck());
        dealInitialCards();

        let allHands = [gameState.player1Hand, gameState.userHand, gameState.player2Hand, gameState.dealerHand];
        let pocketAceResult = checkForPocketAce(allHands);
        let blackJackResults = checkForBlackJack(allHands);
        if(pocketAceResult || blackJackResults)
        {
            output = pocketAceResult || blackJackResults;
            coinSound.play();
            gameState.gamePhase.isStart = false;
            gameState.gamePhase.isGameOver = true;
            gameOver = true;
        }
        else 
        {
            gameState.gamePhase.isStart = false;
            gameState.gamePhase.isPlayer1Turn = true;
        }
    }
    if(gameState.gamePhase.isPlayer1Turn)
    {
        output = "Cards dealt. Player 1's turn."
        botAction();
        gameState.gamePhase.isPlayer1Turn = false;
        gameState.gamePhase.isUserTurn = true;
    }
    if(gameState.gamePhase.isUserTurn)
    {
        output = "Your turn! Click 'Hit' or 'Stand'!";
        if (gameState.userHand.length === 5) 
        {
            output = "You've reached 5 cards! Ending your turn.";
            gameState.gamePhase.isUserTurn = false;
            gameState.gamePhase.isGameOver = true;
        }
    }
    if(gameState.gamePhase.isPlayer2Turn)
    {
        output = "Player 2's turn."
        botAction();
        gameState.gamePhase.isPlayer2Turn = false;
        gameState.gamePhase.isDealerTurn = true;
    }
    if(gameState.gamePhase.isDealerTurn)
    {
        output = "Dealer's turn."
        botAction();
        gameState.gamePhase.isDealerTurn = false;
        gameState.gamePhase.isGameOver = true;
    }
    if(gameState.gamePhase.isGameOver)
    {
        coinSound.play();
        output = determineWinner() + "<br>";
        gameOver = true;
    }
    if(gameOver)
    {
        setTimeout(function() {
            resetGameState();
            console.log("Game has been reset.");
        }, 1000);
    }

    // Display current hands
    player1Output += "<div class='bot-hand'>" + displayHand(gameState.player1Hand, true, true, gameState.gamePhase.isGameOver) + "</div>";
    userOutput += "<div class='user-hand'>" + displayHand(gameState.userHand) + "</div>";
    handValue += "<p>Hand Value: " + calculateHandValue(gameState.userHand) + "</p>";
    player2Output += "<div class='bot-hand'>" + displayHand(gameState.player2Hand, true, true, gameState.gamePhase.isGameOver) + "</div>";
    dealerOutput += "<div class='bot-hand'>" + displayHand(gameState.dealerHand, true, true, gameState.gamePhase.isGameOver) + "</div>";
    earningOutput += "<p>Earnings: " + earnings + "</p>";


    return {
        player1: player1Output,
        user: userOutput,
        value: handValue,
        earnings: earningOutput,
        player2: player2Output,
        dealer: dealerOutput,
        output: output,
        gameOver: gameOver,
    };
};