var config = {
    width: 800,
    height: 448,
    parent: 'game-wrapper',
    renderer: Phaser.AUTO,
    antialias: false,
    state: {
        create: create,
        render: render,
        update: update
    }
}

var game = new Phaser.Game(config);
var ourPlayerId;
var upKey;
var downKey;
var leftKey;
var worldScale;
var rightKey;
var socket;
var state = {
  players: {}
};
var map;
var groundLayer;
var buildingLayer;
var lastBroadcastedInputs;

var WORLD_SCALE = 4;

function loadStarted(){
  console.log('Load started!');
}

function loadedFile(){
  console.log('A file was loaded!');
}

function loadFailed(){
  console.log('A file failed to load!');
}

function loadCompleted(){
  console.log('Load completed!');
  // game.world.scale.set(WORLD_SCALE);

  map = game.add.tilemap('world_tilemap');

  map.addTilesetImage('world_tilemap','world_tilemap_image');


  game.loaded = true;

  var socketUrl =
    window.location.href == 'http://localhost:3000/' ?
    'http://localhost:3000' : 'http://2d3b725b.ngrok.io';

  socket = io(socketUrl);

  socket.on('welcome', function(id){
    console.log('Received server welcome');
    ourPlayerId = id;
    socket.emit('spawn');
  });

  socket.on('game-state', function(gameState){
    state = _.merge(state, gameState);
    var allPlayers = _.values(state.players);
    _.each(allPlayers, function(player){
      // console.log('player has sprite?',)
      if (!_.has(state.players[player.id], 'sprite')){
        state.players[player.id].sprite = game.add.sprite(player.x,player.y,'player');
      }
      if (player.id == ourPlayerId) {
        game.camera.follow(player.sprite);
      }
      sprite = state.players[player.id].sprite;
      sprite.anchor.setTo(0.5, 0.5);
      sprite.x = state.players[player.id].x;
      sprite.y = state.players[player.id].y;
      sprite.rotation = state.players[player.id].rotation;
    });
  });
}

function create(){
  game.stage.backgroundColor = '#787878';

  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  game.load.onLoadStart.add(loadStarted, this);
  game.load.onFileComplete.add(loadedFile, this);
  game.load.onLoadComplete.add(loadCompleted, this);
  game.load.onFileError.add(loadFailed, this);

  game.load.tilemap(
    'world_tilemap',
    '/maps/world/world_tilemap.json',
    null,
    Phaser.Tilemap.TILED_JSON
  );

  game.load.image(
    'plain_tiles_image',
    '/img/plain_tiles.png'
  );

  game.load.image(
    'world_tilemap_image',
    '/img/world_tilemap.png'
  );

  game.load.image(
    'player',
    '/img/player.png'
  );

  game.load.start();
}

function render(){}

function update(){}

function sendInputUpdates() {
  if (game.loaded && game.input) {
    var inputs = {
      up: upKey.isDown,
      down: downKey.isDown,
      left: leftKey.isDown,
      right: rightKey.isDown,
      mouseX: game.input.activePointer.clientX,
      mouseY: game.input.activePointer.clientY
    };
    if (!_.isEqual(inputs, lastBroadcastedInputs)){
      console.log('New inputs detected! Sending to the server...');
      socket.emit('inputs', inputs);
      lastBroadcastedInputs = inputs;
    }
    _.each(_.values(state.players), function(player){
      player.sprite.bringToTop();
    });
  }
}

setInterval(sendInputUpdates, 1000 / 30);
