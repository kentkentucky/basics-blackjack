const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "67380f6fe41b4d34e45525ab";
const MASTER_KEY = "$2a$10$AYm8SU4EBlXc5tx6yi7F/O5Mi7d3mYlNRdgF.ujT8SA3y6r6b7BxS";

const signupButton = document.getElementById("signup");
const signupForm = document.getElementsByClassName("signup-input");
const signupMsg = document.getElementById("signup-msg");

signupButton.addEventListener("click", async function(e) 
{
    e.preventDefault();
    let users = await loadUsers();
    const username = signupForm[0][0].value;
    const password = signupForm[0][1].value;
    const user = {
        "id": users.length,
        "username": username,
        "password": password,
        "coins": 100
    }
    users = [...users, user];
    data = await addUsers(users);
    if(data)
    {
        signupMsg.style.opacity = 1;
    }
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
}

async function addUsers(users) 
{
    try 
    {
        const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, users, {
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key": MASTER_KEY
            }
        });
        return response.data.record;
    } 
    catch (error) 
    {
        console.log(error);
    }
}