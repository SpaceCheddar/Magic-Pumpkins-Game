const http = require("http").createServer();
var clients = [];
var players = {};

const io = require('socket.io')(http, {
    cors: { orgin: "*" }
});

function sendData(type, data, sender) {
    stringifiedData = JSON.stringify(data);
    sender.emit(type, stringifiedData);
}

io.on("connection", (socket) => {
    clients.push(socket.id);
    console.log("User "+socket.id+" has connected.");

    players[socket.id] = {"client": socket.id, "character": "wizard", "username": undefined, "updatable": {}};

    socket.on("pcon", (data) => { //player connect
        var parsed = JSON.parse(data);
        players[socket.id].username = parsed.username;
        players[socket.id].character = parsed.character;
        players[socket.id].updatable = parsed.updatable;
        var playerList = [];
        for(var player in players) {
            playerList.push(players[player]);
        }
        sendData("pcr", playerList, io); //player connect respond
    })

    socket.on("pupd", (data) => { //player update
        var parsed = JSON.parse(data);
        players[socket.id].updatable = parsed;
        sendData("pupd", players[socket.id], io);
    });

    socket.on("disconnect", () => {
        console.log(socket.id+" has disconnected.");
        clients.splice(clients.indexOf(socket.id));
        delete players[socket.id];
        sendData("pdc", socket.id, io); //player disconnect
    });
});

http.listen(16666, () => console.log("Listening on port 16666."));