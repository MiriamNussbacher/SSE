const express = require('express');
const app = express();

let viewers = 0;
let clients = [];

app.get('/viewers', (req, res) => {
    // Increase viewer count when a new client connects
    viewers++;

    // Set the necessary headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the new client to the clients array
    clients.push(res);

    // Send the updated number of viewers to all clients
    broadcast(viewers);

    // Remove the client from the list when the connection is closed
    req.on('close', () => {
        viewers--;
        clients = clients.filter(client => client !== res);
        broadcast(viewers);
    });
});

// Function to broadcast data to all connected clients
function broadcast(viewersCount) {
    clients.forEach(client => {
        client.write(`data: ${viewersCount} viewers are connected\n\n`);
    });
}

app.listen(3000, () => {
    console.log("SSE server running on http://localhost:3000");
});
