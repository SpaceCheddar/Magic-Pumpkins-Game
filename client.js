//main menu etc
var serverIP = "localhost";

const socket = new io('ws://'+serverIP+':16666');

socket.on("connect", () => {
    console.log("Connected to server.");
});