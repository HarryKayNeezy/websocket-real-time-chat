const ws = new WebSocket(`ws://${window.location.host}`);
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const sendButton = document.getElementById('sendButton');

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

// Send message to the server when the "Send" button is clicked
sendButton.onclick = () => {
    const message = messageInput.value;
    const username = usernameInput.value;

    // Check if username is provided
    if (!username) {
        alert('Please enter a username before sending a message.');
        return;
    }

    // Check if WebSocket is open before sending the message
    if (ws.readyState === WebSocket.OPEN) {
        // Send the message along with the username as JSON
        ws.send(JSON.stringify({ username, message }));
        messageInput.value = '';  // Clear the input field
    } else {
        console.error('Cannot send message: WebSocket is not open.');
        alert('Connection closed. Please refresh the page to reconnect.');
    }
};
