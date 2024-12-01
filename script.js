// DOM Elements
const userForm = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

// API URL for the backend
const apiUrl = 'http://localhost:3000/users';

// Handle form submission
userForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const name = nameInput.value;
    const email = emailInput.value;

    if (!name || !email) {
        alert("Please fill in all fields.");
        return;
    }

    if (userId) {
        // Update existing user
        updateUser(userId, name, email);
    } else {
        // Create new user
        addUser(name, email);
    }

    // Clear the form after submission
    userForm.reset();
    document.getElementById('userId').value = '';
    submitBtn.textContent = 'Add User';  // Reset button text
});

// Add a new user (both in UI and database)
function addUser(name, email) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    })
    .then(response => response.json())
    .then(data => {
        renderUsers(); // Re-render users after adding
    })
    .catch(error => console.error('Error adding user:', error));
}

// Update an existing user (both in UI and database)
function updateUser(userId, name, email) {
    fetch(`${apiUrl}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User updated successfully!");
            renderUsers(); // Re-render users after editing
        } else {
            alert("Failed to update user.");
        }
    })
    .catch(error => console.error('Error updating user:', error));
}

// Function to trigger when the 'Edit' button is clicked
function editUser(userId) {
    fetch(`${apiUrl}/${userId}`)
    .then(response => response.json())
    .then(user => {
        // Pre-fill the form with user data for editing
        document.getElementById('userId').value = user.id;
        nameInput.value = user.name;
        emailInput.value = user.email;
        submitBtn.textContent = 'Update User'; // Change button text to 'Update'
    })
    .catch(error => console.error('Error fetching user data:', error));
}

// Render the users table (fetches from DB and shows in UI)
function renderUsers() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(users => {
        usersTable.innerHTML = '';  // Clear the table before rendering
        users.forEach(user => {
            const row = usersTable.insertRow();
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
        });
    })
    .catch(error => console.error('Error fetching users:', error));
}



// Delete a user (both from UI and database)
function deleteUser(userId) {
    fetch(`${apiUrl}/${userId}`, {
        method: 'DELETE',
    })
    .then(() => {
        renderUsers(); // Re-render after deletion
    })
    .catch(error => console.error('Error deleting user:', error));
}

// Initial render (fetch users from DB on page load)
renderUsers();











