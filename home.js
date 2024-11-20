const urlParams = new URLSearchParams(window.location.search);
const coins = parseInt(urlParams.get('coins'));
const id = urlParams.get('userid');

const coinValue = document.getElementById("coin-value");
const tableFive = document.getElementById("table-five");
const tableTen = document.getElementById("table-ten");
const tableTwenty = document.getElementById("table-twenty");

document.addEventListener('DOMContentLoaded', function()
{
    coinValue.textContent = coins;
});

tableFive.addEventListener('click', function()
{
    window.location.href = `game.html?coins=${coins}&bet=5&userid=${id}`;
});

tableTen.addEventListener('click', function()
{
    window.location.href = `game.html?coins=${coins}&bet=10&userid=${id}`;
});

tableTwenty.addEventListener('click', function()
{
    window.location.href = `game.html?coins=${coins}&bet=20&userid=${id}`;
});

