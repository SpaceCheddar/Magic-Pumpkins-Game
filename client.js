const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

fullscreen();

function fullscreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", fullscreen, false);

var player = {"username": "Treelr", "character": "wizard", "position": {"x": 400, "y": 100}, "direction": "right"};
//main menu etc

//game
var serverIP = "localhost";
const socket = new io('ws://'+serverIP+':16666');
var players = [];
var keysPressed = {"w": false, "a": false, "s": false, "d": false};

function animate() {
    requestAnimationFrame(animate);

    var moved = false;
    if(keysPressed.w) {player.position.y -= 5; moved = true;}
    if(keysPressed.s) {player.position.y += 5; moved = true;}
    if(keysPressed.a) {player.position.x -= 5; player.direction = "left"; moved = true;}
    if(keysPressed.d) {player.position.x += 5; player.direction = "right"; moved = true;}

    if(moved) sendPlayerUpdate();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '10px Arial';
    ctx.textAlign = "center";
    ctx.textBaseLine = "top";
    for(var i = 0; i < players.length; i++) {
        ctx.fillStyle = "black";
        ctx.fillText(players[i].username, players[i].updatable.position.x, players[i].updatable.position.y - 20);
        if(players[i].character == "wizard") ctx.fillStyle = "blue";
        ctx.fillRect(players[i].updatable.position.x - 5, players[i].updatable.position.y - 10, 10, 10);
    }
}

document.addEventListener("keydown", (event) => {
    var code = event.code;
    if(code == "KeyW") keysPressed.w = true;
    if(code == "KeyA") keysPressed.a = true;
    if(code == "KeyS") keysPressed.s = true;
    if(code == "KeyD") keysPressed.d = true;
});

document.addEventListener("keyup", (event) => {
    var code = event.code;
    if(code == "KeyW") keysPressed.w = false;
    if(code == "KeyA") keysPressed.a = false;
    if(code == "KeyS") keysPressed.s = false;
    if(code == "KeyD") keysPressed.d = false;
});

//server connection
socket.on("connect", () => {
    console.log("Connected to server.");
    sendConnectionData();
});

socket.on("pcr", (data) => { //player connect respond
    var parsed = JSON.parse(data);
    var newPlayer;
    for(var i = 0; i < parsed.length; i++) {
        var notFound = true;
        for(var j = 0; j < players.length; j++) {
            if(parsed[i].client == players[j].client) {
                notFound = false;
            }
        }
        if(notFound) {
            players.push(parsed[i]);
            console.log(parsed[i].username + " has joined.");
        }
    }
    animate();
});

socket.on("pdc", (data) => { //player disconnected
    var parsed = JSON.parse(data);

    for(var i = 0; i < players.length; i++) {
        if(players[i].client == parsed) {
            console.log(players[i].username + " has left.");
            players.splice(i, 1);
            break;
        }
    }
});

socket.on("pupd", (data) => { //player update
    parsed = JSON.parse(data);
    for(var i = 0; i < players.length; i++) {
        if(players[i].client == parsed.client) {
            players[i].updatable = parsed.updatable;
            break;
        }
    }
});

function sendConnectionData() {
    let data = {
        "username": player.username,
        "character": player.character,
        "updatable": {
            "position": player.position,
            "direction": player.direction
        }
    }
    socket.emit("pcon", JSON.stringify(data)); //player connect
}

function sendPlayerUpdate() {
    let data = {
        "position": player.position,
        "direction": player.direction 
    }
    socket.emit("pupd", JSON.stringify(data)); //player update
  }