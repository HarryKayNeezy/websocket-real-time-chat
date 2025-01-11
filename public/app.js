const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${window.location.host}`);

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const sendButton = document.getElementById('sendButton');
const joinButton = document.getElementById('joinButton');
const leaveButton = document.getElementById('leaveButton');

let username = '';

ws.onopen = () => {
    console.log('Connected to the server');
};

ws.onmessage = (event) => {
    // Parse the received message (assuming it contains JSON)
    const data = JSON.parse(event.data);
    
    // Create a new div to hold the message and username
    const message = document.createElement('div');
    message.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;
    messages.appendChild(message);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from the server');
};

// Join the chat
joinButton.onclick = () => {
    username = usernameInput.value.trim();

    if (!username) {
        alert('Please enter a username to join the chat.');
        return;
    }

    // Notify the server that the user has joined
    ws.send(JSON.stringify({
        username: 'Server',
        message: `${username} joined the chat`
    }));

    // Update UI: show the message input and send/leave buttons, hide join-related elements
    messageInput.style.display = 'block';
    sendButton.style.display = 'block';
    leaveButton.style.display = 'inline-block';
    usernameInput.style.display = 'none';
    joinButton.style.display = 'none';
};

// Send message to the server when the "Send" button is clicked
sendButton.onclick = () => {
    const message = messageInput.value.trim();

    if (!message) return;

    // Send the message along with the username as JSON
    ws.send(JSON.stringify({ username, message }));
    messageInput.value = '';  // Clear the input field
};

// Leave the chat
leaveButton.onclick = () => {
    if (username) {
        // Notify the server that the user has left the chat
        ws.send(JSON.stringify({
            username: 'Server',
            message: `${username} left the chat`
        }));
    }

    // Reset the UI to the initial state
    messageInput.style.display = 'none';
    sendButton.style.display = 'none';
    leaveButton.style.display = 'none';
    usernameInput.style.display = 'block';
    joinButton.style.display = 'inline-block';
    usernameInput.value = '';
    username = '';
};
