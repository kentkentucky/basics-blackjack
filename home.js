const urlParams = new URLSearchParams(window.location.search);
const coins = parseInt(urlParams.get('coins'));
const id = urlParams.get('userid');
const isAdmin = urlParams.get('isAdmin');

const coinValue = document.getElementById("coin-value");
const tableFive = document.getElementById("table-five");
const tableTen = document.getElementById("table-ten");
const tableTwenty = document.getElementById("table-twenty");
const logout = document.getElementById("logout-btn");
const adminDiv = document.getElementById("admin-container");

document.addEventListener('DOMContentLoaded', function()
{
    coinValue.textContent = coins;
    if(isAdmin === 'true')
    {
        adminDiv.innerHTML = "<button id='admin-btn'>Admin</button>"
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.addEventListener('click', function() 
        {
            window.location.href = 'admin.html';
        })
    }
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

logout.addEventListener('click', function() 
{
    window.location.href = 'index.html';
});