//main menu etc
var serverIP = "localhost";

const socket = new io('ws://'+serverIP+':16666');

//scene
var gameScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 1000);
camera.position.set(0, 0, -1);
gameScene.add(camera);
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

var player = new THREE.Object3D();
gameScene.add(player);

function resizeRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //$(".game").css({"width": window.innerWidth, "height": window.innerHeight});
}

resizeRenderer();
window.addEventListener('resize', resizeRenderer, false);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(gameScene, camera);
}

socket.on("connect", () => {
    console.log("Connected to server.");
    sendUpdateToServer();
    animate();
});

function sendUpdateToServer() {
    let packet = {
        "type": "playerupdate",
        "data": {
        "position": "noodles", //[player.position.x, player.position.y],
        "rotation": "toodles"//[player.rotation.z],
        }
    }
    console.log(JSON.stringify(packet));
    socket.emit("message", JSON.stringify(packet));
    //socket.emit("playerupdate", JSON.stringify(data));
  }