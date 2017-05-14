// var initGame = function() {
//     var canvas = document.getElementById("game");
//     var context = canvas.getContext("2d");
//     Game.controls = {};
//     Game.canvas = canvas;
//
//     var FPS = 30;
//     var INTERVAL = 1000/FPS;
//     var STEP = INTERVAL/1000;
//
//     // setup player
//     var player = new Game.Player(50, 50);
//     Game.currentPlayer = player;
//
//     // setup the magic camera !!!
//     var camera = new Game.Camera(0, 0, canvas.width, canvas.height, world.width, world.height);
//     camera.follow(player, canvas.width/2, canvas.height/2);
//
//     // Game update function
//     var update = function(){
//         player.update(STEP, world.width, world.height);
//         camera.update();
//     }
//
//     // Game draw function
//     var draw = function(){
//         // clear the entire canvas
//         context.clearRect(0, 0, canvas.width, canvas.height);
//
//         // redraw all objects
//         world.map.draw(context, camera.xView, camera.yView);
//         player.draw(context, camera.xView, camera.yView);
//     }
//
//
//     var runningId = -1;
//
//     Game.play = function(){
//         if(runningId == -1){
//             runningId = setInterval(function(){
//                 gameLoop();
//             }, INTERVAL);
//             console.log("play");
//         }
//     }
//
//     Game.controls = {
//       left: false,
//       up: false,
//       right: false,
//       down: false,
//       mouseX: 0,
//       mouseY: 0,
//       canvasX: 0,
//       canvasY: 0
//     };
//
// };
// socket.on('world', updateGameState);

// var lastBroadcastedInputs;
//
// function sendInputs () {
//     if (_.isEqual(Game.controls, lastBroadcastedInputs)) { return; }
//     socket.emit('inputs', Game.controls);
//     lastBroadcastedInputs = _.cloneDeep(Game.controls);
// }

// setInterval(sendInputs, 1000 / 30);

window.gameSocket = io(window.location.href);

var setupGame = function (initialWorldState) {
  info('Initial world state received, setting up game!');
  window.game = new Game(initialWorldState, gameSocket);
  game.draw();
};

gameSocket.on('connect', function() {
  info('Connected to the server, waiting for initial game world!');
});

gameSocket.on('initialWorldState', setupGame);
