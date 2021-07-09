const http = require("http").createServer();
var clients = {};
var players = {};

const io = require('socket.io')(http, {
    cors: { orgin: "*" }
});

io.on("connection", () => {
    console.log("A user has connected.");
});

http.listen(16666, () => console.log("Listening on port 16666."));