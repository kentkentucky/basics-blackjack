const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "67380f6fe41b4d34e45525ab";

const loginButton = document.getElementById("login");
const loginForm = document.getElementsByClassName("login-input");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", function(e) 
{
    e.preventDefault();
    const username = loginForm[0][0].value;
    const password = loginForm[0][1].value;
    validateLogin(username, password);
});

async function loadUsers() 
{
    try 
    {
        const response = await axios.get(BASE_JSON_BIN_URL + "/" + BIN_ID + "/latest");
        return response.data.record;    
    } 
    catch (error) 
    {
        console.log(error);
    }
};

async function validateLogin(username, password) 
{
    const users = await loadUsers();
    console.log(users);
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == username && users[i].password == password)
        {
            console.log(users[i]);
            window.location.href = `home.html?coins=${users[i].coins}&userid=${users[i].id}&isAdmin=${users[i].isAdmin}`;
        }
        else
        {
            loginErrorMsg.style.opacity = 1;
        }
    }
};