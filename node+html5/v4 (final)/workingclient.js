// // wrapper for our game "classes", "methods" and "objects"
// window.Game = {};
//
// // wrapper for "class" Rectangle
// (function(){
//     function Rectangle(left, top, width, height){
//         this.left = left || 0;
//         this.top = top || 0;
//         this.width = width || 0;
//         this.height = height || 0;
//         this.right = this.left + this.width;
//         this.bottom = this.top + this.height;
//     }
//
//     Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
//         this.left = left;
//         this.top = top;
//         this.width = width || this.width;
//         this.height = height || this.height
//         this.right = (this.left + this.width);
//         this.bottom = (this.top + this.height);
//     }
//
//     Rectangle.prototype.within = function(r) {
//         return (r.left <= this.left &&
//                 r.right >= this.right &&
//                 r.top <= this.top &&
//                 r.bottom >= this.bottom);
//     }
//
//     Rectangle.prototype.overlaps = function(r) {
//         return (this.left < r.right &&
//                 r.left < this.right &&
//                 this.top < r.bottom &&
//                 r.top < this.bottom);
//     }
//
//     // add "class" Rectangle to our Game object
//     Game.Rectangle = Rectangle;
// })();
//
// // wrapper for "class" Camera (avoid global objects)
// (function(){
//
//     // possibles axis to move the camera
//     var AXIS = {
//         NONE: "none",
//         HORIZONTAL: "horizontal",
//         VERTICAL: "vertical",
//         BOTH: "both"
//     };
//
//     // Camera constructor
//     function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
//     {
//         // position of camera (left-top coordinate)
//         this.xView = xView || 0;
//         this.yView = yView || 0;
//
//         // distance from followed object to border before camera starts move
//         this.xDeadZone = 0; // min distance to horizontal borders
//         this.yDeadZone = 0; // min distance to vertical borders
//
//         // viewport dimensions
//         this.wView = canvasWidth;
//         this.hView = canvasHeight;
//
//         // allow camera to move in vertical and horizontal axis
//         this.axis = AXIS.BOTH;
//
//         // object that should be followed
//         this.followed = null;
//
//         // rectangle that represents the viewport
//         this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);
//
//         // rectangle that represents the world's boundary (room's boundary)
//         this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);
//
//     }
//
//     // gameObject needs to have "x" and "y" properties (as world(or room) position)
//     Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone)
//     {
//         this.followed = gameObject;
//         this.xDeadZone = xDeadZone;
//         this.yDeadZone = yDeadZone;
//     }
//
//     Camera.prototype.update = function()
//     {
//         // keep following the player (or other desired object)
//         if(this.followed != null)
//         {
//             if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
//             {
//                 // moves camera on horizontal axis based on followed object position
//                 if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
//                     this.xView = this.followed.x - (this.wView - this.xDeadZone);
//                 else if(this.followed.x  - this.xDeadZone < this.xView)
//                     this.xView = this.followed.x  - this.xDeadZone;
//
//             }
//             if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
//             {
//                 // moves camera on vertical axis based on followed object position
//                 if(this.followed.y - this.yView + this.yDeadZone > this.hView)
//                     this.yView = this.followed.y - (this.hView - this.yDeadZone);
//                 else if(this.followed.y - this.yDeadZone < this.yView)
//                     this.yView = this.followed.y - this.yDeadZone;
//             }
//
//         }
//
//         // update viewportRect
//         this.viewportRect.set(this.xView, this.yView);
//
//         // don't let camera leaves the world's boundary
//         if(!this.viewportRect.within(this.worldRect))
//         {
//             if(this.viewportRect.left < this.worldRect.left)
//                 this.xView = this.worldRect.left;
//             if(this.viewportRect.top < this.worldRect.top)
//                 this.yView = this.worldRect.top;
//             if(this.viewportRect.right > this.worldRect.right)
//                 this.xView = this.worldRect.right - this.wView;
//             if(this.viewportRect.bottom > this.worldRect.bottom)
//                 this.yView = this.worldRect.bottom - this.hView;
//         }
//
//     }
//
//     // add "class" Camera to our Game object
//     Game.Camera = Camera;
//
// })();
//
// // wrapper for "class" Player
// (function(){
//     function Player(x, y){
//         // (x, y) = center of object
//         // ATTENTION:
//         // it represents the player position on the world(room), not the canvas position
//         this.x = x;
//         this.y = y;
//
//         Game.controls.canvasX = x;
//         Game.controls.canvasY = y;
//
//         // move speed in pixels per second
//         this.speed = 200;
//
//         // render properties
//         this.width = 30;
//         this.height = 50;
//     }
//
//     Player.prototype.update = function(step, worldWidth, worldHeight){
//         // parameter step is the time between frames ( in seconds )
//
//         // check controls and move the player accordingly
//         if(Game.controls.left)
//             this.x -= this.speed * step;
//         if(Game.controls.up)
//             this.y -= this.speed * step;
//         if(Game.controls.right)
//             this.x += this.speed * step;
//         if(Game.controls.down)
//             this.y += this.speed * step;
//
//         // // don't let player leaves the world's boundary
//         // if(this.x - this.width/2 < 0){
//         //     this.x = this.width/2;
//         // }
//         // if(this.y - this.height/2 < 0){
//         //     this.y = this.height/2;
//         // }
//         // if(this.x + this.width/2 > worldWidth){
//         //     this.x = worldWidth - this.width/2;
//         // }
//         // if(this.y + this.height/2 > worldHeight){
//         //     this.y = worldHeight - this.height/2;
//         // }
//     }
//
//     Player.prototype.draw = function(context, xView, yView){
//
//         Game.controls.canvasX = this.x - xView;
//         Game.controls.canvasY = this.y - yView;
//
//         var rads = Math.atan2(
//           Game.controls.mouseY - (Game.controls.canvasY + this.height / 2),
//           Game.controls.mouseX - (Game.controls.canvasX + this.width / 2)
//         );
//
//         // first save the untranslated/unrotated context
//         context.save();
//         context.beginPath();
//         // move the rotation point to the center of the rect
//         context.translate(
//           Game.controls.canvasX + this.width / 2,
//           Game.controls.canvasY + this.height / 2
//         );
//         // rotate the rect
//         context.rotate(rads);
//         context.rect(
//           -this.width / 2,
//           -this.height / 2,
//           this.width,
//           this.height
//         );
//         context.fillStyle="gold";
//         context.fill();
//         // restore the context to its untranslated/unrotated state
//         context.restore();
//
//         // Draw a line from the center of the player to the players target
//         context.save();
//         context.beginPath();
//         context.moveTo((Game.controls.canvasX + this.width / 2), (Game.controls.canvasY + this.height / 2));
//         context.lineTo(Game.controls.mouseX, Game.controls.mouseY);
//         context.stroke();
//         context.restore();
//     }
//
//     // add "class" Player to our Game object
//     Game.Player = Player;
//
// })();
//
// // wrapper for "class" Map
// (function(){
//     function Map(width, height){
//         // map dimensions
//         this.width = width;
//         this.height = height;
//
//         // map texture
//         this.image = null;
//     }
//
//     // generate an example of a large map
//     Map.prototype.generate = function(){
//         var ctx = document.createElement("canvas").getContext("2d");
//         ctx.canvas.width = this.width;
//         ctx.canvas.height = this.height;
//
//         var rows = ~~(this.width/44) + 1;
//         var columns = ~~(this.height/44) + 1;
//
//         var color = "red";
//         ctx.save();
//         ctx.fillStyle = "red";
//         for (var x = 0, i = 0; i < rows; x+=44, i++) {
//             ctx.beginPath();
//             for (var y = 0, j=0; j < columns; y+=44, j++) {
//                 ctx.rect (x, y, 40, 40);
//             }
//             color = (color == "red" ? "blue" : "red");
//             ctx.fillStyle = color;
//             ctx.fill();
//             ctx.closePath();
//         }
//         ctx.restore();
//
//         // store the generate map as this image texture
//         this.image = new Image();
//         this.image.src = ctx.canvas.toDataURL("image/png");
//
//         // clear context
//         ctx = null;
//     }
//
//     // draw the map adjusted to camera
//     Map.prototype.draw = function(context, xView, yView){
//         // easiest way: draw the entire map changing only the destination coordinate in canvas
//         // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
//         //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
//
//         // didatic way:
//
//         var sx, sy, dx, dy;
//         var sWidth, sHeight, dWidth, dHeight;
//
//         // offset point to crop the image
//         sx = xView;
//         sy = yView;
//
//         // dimensions of cropped image
//         sWidth =  context.canvas.width;
//         sHeight = context.canvas.height;
//
//         // if cropped image is smaller than canvas we need to change the source dimensions
//         if(this.image.width - sx < sWidth){
//             sWidth = this.image.width - sx;
//         }
//         if(this.image.height - sy < sHeight){
//             sHeight = this.image.height - sy;
//         }
//
//         // location on canvas to draw the croped image
//         dx = 0;
//         dy = 0;
//         // match destination with source to not scale the image
//         dWidth = sWidth;
//         dHeight = sHeight;
//
//         context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
//     }
//
//     // add "class" Map to our Game object
//     Game.Map = Map;
//
// })();
//
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
//     var world = {
//         width: 1000,
//         height: 1000,
//         map: new Game.Map(1000, 1000)
//     };
//
//     // generate a large image texture for the world
//     world.map.generate();
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
//     // Game Loop
//     var gameLoop = function(){
//         update();
//         draw();
//     }
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
//     Game.canvas.addEventListener('mousemove', function(e) {
//       Game.controls.mouseX = e.offsetX;
//       Game.controls.mouseY = e.offsetY;
//     }, false);
//
//     window.addEventListener('keydown', function (e){
//       if (e.keyCode === 87) Game.controls.up = true;
//       if (e.keyCode === 83) Game.controls.down = true;
//       if (e.keyCode === 65) Game.controls.left = true;
//       if (e.keyCode === 68) Game.controls.right = true;
//     }, false);
//
//     window.addEventListener('keyup', function (e){
//       if (e.keyCode === 87) Game.controls.up = false;
//       if (e.keyCode === 83) Game.controls.down = false;
//       if (e.keyCode === 65) Game.controls.left = false;
//       if (e.keyCode === 68) Game.controls.right = false;
//     }, false);
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

var setupGame = function (worldState) {
  info('Initial world state received, setting up game!');
  let canvas = document.getElementById('game');
  let context = canvas.getContext('2d');
};

gameSocket.on('connect', function() {
  info('Connected to the server, waiting for initial game world!');
});

gameSocket.on('initialWorldState', setupGame);
