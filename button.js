let gameButtons = document.querySelector("#ingame-buttons");
let entryButtons = document.getElementById("entry-buttons");
let startButton = document.querySelector("#start-button");
let leaveButton = document.getElementById("leave-button");
let hitButton = document.querySelector("#hit-button");
let standButton = document.querySelector("#stand-button");

let deck = document.getElementById("deck");
let dealer = document.getElementById("dealer");
let user = document.getElementById("player-user");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let output = document.getElementById("output-div");
let handValueDiv = document.getElementById("hand-value");
let earningDiv = document.getElementById("earnings");

const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "67380f6fe41b4d34e45525ab";
const MASTER_KEY = "$2a$10$AYm8SU4EBlXc5tx6yi7F/O5Mi7d3mYlNRdgF.ujT8SA3y6r6b7BxS";

function updateButtonVisibility(gameOver) 
{
    if(gameOver)
    {
        gameButtons.style.display = 'none';
        entryButtons.style.display = 'inline-block';
        startButton.textContent = 'New Game';
    } 
    else 
    {
        gameButtons.style.display = 'block';
        entryButtons.style.display = 'none';
    }
}

startButton.addEventListener("click", function(e) 
{
    e.preventDefault();
    // Display result in output element
    let result = main();
    deck.innerHTML = `<img src="card-images/deck-of-cards.png" class="card-deck"/>`;
    player1.innerHTML = result.player1;
    dealer.innerHTML = result.dealer;
    user.innerHTML = result.user;
    player2.innerHTML = result.player2;
    output.innerHTML = result.output;
    handValueDiv.innerHTML = result.value;
    earningDiv.innerHTML = result.earnings;

    // Show hit and stand button once submit button is pressed
    updateButtonVisibility(result.gameOver);
});

hitButton.addEventListener("click", function(e)
{
    e.preventDefault();
    userAction('hit');
    let result = main();
    deck.innerHTML = `<img src="card-images/deck-of-cards.png" class="card-deck"/>`;
    player1.innerHTML = result.player1;
    dealer.innerHTML = result.dealer;
    user.innerHTML = result.user;
    player2.innerHTML = result.player2;
    output.innerHTML = result.output;
    handValueDiv.innerHTML = result.value;
    earningDiv.innerHTML = result.earnings;

    updateButtonVisibility(result.gameOver);
});
    
standButton.addEventListener("click", function(e) 
{
    e.preventDefault();
    userAction('stand');
    let result = main();
    deck.innerHTML = `<img src="card-images/deck-of-cards.png" class="card-deck"/>`;
    player1.innerHTML = result.player1;
    dealer.innerHTML = result.dealer;
    user.innerHTML = result.user;
    player2.innerHTML = result.player2;
    output.innerHTML = result.output;
    handValueDiv.innerHTML = result.value;
    earningDiv.innerHTML = result.earnings;

    updateButtonVisibility(result.gameOver);
});

leaveButton.addEventListener("click", async function(e)
{
    e.preventDefault();
    let newCoinValue = coins + earnings;
    let users = await loadUsers();
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].id == id)
        {
            users[i].coins = newCoinValue;
            const data = await updateCoins(users);
            if(data)
            {
                window.location.href = `home.html?coins=${newCoinValue}&userid=${id}`;
            }
        }
    }
});

async function loadUsers() 
{
  const response = await axios.get(BASE_JSON_BIN_URL + "/" + BIN_ID + "/latest");
  return response.data.record;
};

async function updateCoins(users)
{
    const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, users, {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": MASTER_KEY
        }
    });
    return response.data.record;
};