const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/html'));
let requestCount = 0;
// Middleware to log requests and emit socket events
app.use((req, res, next) => {
    requestCount++;
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
    };
    console.log(logEntry);
    io.emit('newRequest', { timestamp: logEntry.timestamp, count: requestCount });
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

server.listen(port, () => console.log(`Server running on port ${port}`));