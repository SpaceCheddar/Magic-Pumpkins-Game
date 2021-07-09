//main menu etc
var serverIP = "localhost";

const socket = new io('ws://'+serverIP+':16666');

//scene
var gameScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 1000);
camera.position.set(0, 0, -1);
gameScene.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

socket.on("connect", () => {
    console.log("Connected to server.");
    renderer.render(gameScene, camera);
});