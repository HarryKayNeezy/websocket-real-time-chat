const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = http.createServer(app);

// Create WebSocket server that shares the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WS Connection established');

    // When a message is received from a client
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        console.log(`Received message from ${data.username}: ${data.message}`);
        
        // Broadcast the received message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    username: data.username,
                    message: data.message
                }));
            }
        });
    });

        // Send a welcome message to the client that connected
        ws.send(JSON.stringify({
        username: 'Server',
        message: 'Welcome to the chat. Akwaaba. Bienvenue!'
    }));

});

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
