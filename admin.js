const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "67380f6fe41b4d34e45525ab";
const MASTER_KEY = "$2a$10$AYm8SU4EBlXc5tx6yi7F/O5Mi7d3mYlNRdgF.ujT8SA3y6r6b7BxS";

const logout = document.getElementById("logout-btn");

document.addEventListener('DOMContentLoaded', async function() {
    let users = await loadUsers();
    renderUsers(users);
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

async function deleteUser(userId)
{
    let users = await loadUsers();
    users = users.filter(user => user.id != userId);
    let data = await updateUsers(users);
    if(data)
    {
        location.reload();
    }
};

async function updateUsers(users) 
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
};

logout.addEventListener('click', function() 
{
    window.location.href = 'index.html';
});

function renderUsers(users)
{
    const tableBody = document.getElementById('user-table-body');
    for(let i = 0; i < users.length; i++)
    {
        let row = document.createElement('tr');

        row.innerHTML =
        `
            <td>${users[i].id}</td>
            <td>${users[i].username}</td>
            <td>${users[i].coins}</td>
            <td><button class="delete-btn" data-id="${users[i].id}">Delete</button></td>
        `;

        tableBody.appendChild(row);
    }

    document.querySelectorAll('.delete-btn').forEach(button => 
    {
        button.addEventListener('click', function() 
        {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}