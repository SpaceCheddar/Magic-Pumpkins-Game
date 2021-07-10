const http = require("http").createServer();
var clients = [];
var players = {};

const io = require('socket.io')(http, {
    cors: { orgin: "*" }
});

io.on("connection", (socket) => {
    clients.push(socket.id);
    console.log("User "+socket.id+" has connected.");
    console.log(clients);

    players[socket.id] = {"position": [0, 0], "rotation": 0}

    //io.on("playerupdate", (data) => {
    //    parsed = JSON.parse(data);

    //    players[socket.id] = parsed;
    //    console.log(players[socket.id]);
    //});

    io.on("message", (packet) => {
        parsed = JSON.parse(packet);
        if(packet.type == "playerupdate") {
            players[socket.id] = parsed.data;
            
        }
        console.log(players);
    });
});

http.listen(16666, () => console.log("Listening on port 16666."));