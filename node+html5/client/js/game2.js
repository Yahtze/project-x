var worldScale = 4;
var player = {};
var lastBroadcastedInputs = {};

var bgGroup, viewRect, boundsPoint, gameWorld, socket, bg;

var preload = function(game){
    game.time.advancedTiming = true;
    game.load.image('game_world','/maps/world/world.png');
};

var create = function(game){
    game.serverState = {
      players: {}
    };

    // create a reusable point for bounds checking later
    boundsPoint = new Phaser.Point(0, 0);
    // create our reusable view rectangle
    // viewRect = new Phaser.Rectangle(0, 0, game.width, game.height);
    viewRect = new Phaser.Rectangle(0, 0, game.width, game.height);

    // create a world group separate from the actual world
    gameWorld = game.add.group();
    gameWorld.position.setTo(game.world.centerX, game.world.centerY);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // create a group for the clippable world objects
    bgGroup = game.add.group(gameWorld);

    bg = game.add.sprite(0,0,'game_world');
    bgGroup.add(bg);

    // // create a crapload of squares in the world to show movement/zooming
    // var sqr, size;
    // for (var i = 0; i < 500; i++){
    //   size = game.rnd.integerInRange(5, 20);
    //   sqr = game.add.graphics(game.rnd.integerInRange(0, 640), game.rnd.integerInRange(0, 640), bgGroup);
    //   sqr.beginFill(0x666666);
    //   sqr.drawRect(size * -0.5, size * -0.5, size, size); // center the square on its position
    //   sqr.endFill();
    // }

    // set our world size to be bigger than the window so we can move the camera
    game.world.setBounds(0, 0, 1000,1000);

    // move our camera half the size of the viewport back so the pivot point is in the center of our view
    // game.camera.x = (game.width * -0.5);
    // game.camera.y = (game.height * -0.5);

    socket = io(window.location.href);

    socket.on('welcome', function(id){
      console.log('Received server welcome');
      player.id = id;
      socket.emit('spawn');
      player.spawned = true;
    });

    socket.on('player-logout', function(playerId) {
      console.log('player logged out:', playerId);
    });

    socket.on('game-state', function(gameState){
      game.serverState = _.merge(game.serverState, gameState);
      var allPlayers = _.values(game.serverState.players);
      _.each(allPlayers, function(p){
        if (!_.has(game.serverState.players[p.id], 'sprite')){
          game.serverState.players[p.id].sprite = game.add.graphics(p.x, p.y, gameWorld);
          game.serverState.players[p.id].sprite.beginFill(0x00ff00);
          game.serverState.players[p.id].sprite.drawCircle(0, 0, 5);
          game.serverState.players[p.id].sprite.endFill();
        }
        if (p.id == player.id){
          player = p;
          // game.camera.follow(p.sprite);
        }
        sprite = game.serverState.players[p.id].sprite;
        sprite.anchor.setTo(0.5, 0.5);
        sprite.x = game.serverState.players[p.id].x;
        sprite.y = game.serverState.players[p.id].y;
        sprite.rotation = game.serverState.players[p.id].rotation;
      });
    });
};

var update = function(game){
  if (player.spawned){
    // if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    //   gameWorld.pivot.y -= 5;
    //   player.y -= 5;
    // }
    // else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
    //   gameWorld.pivot.y += 5;
    //   player.y += 5;
    // }
    // if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    //   gameWorld.pivot.x -= 5;
    //   player.x -= 5;
    // }
    // else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
    //   gameWorld.pivot.x += 5;
    //   player.x += 5;
    // }

    gameWorld.pivot.y = player.y;
    gameWorld.pivot.x = player.x;

    if (!$('#game-wrapper').is(':visible')) {
      setTimeout(function() { $('#game-wrapper').show(); }, 500);
    }

    // set our world scale as needed
    gameWorld.scale.set(worldScale);
  }
};

var showEntitiesInFrame = function(entityGroup){
  // TODO: improve with a quadtree or similar batched approach?
  bgGroup.forEachExists(function(circ){
    boundsPoint.setTo(
      ((circ.x - gameWorld.pivot.x) * gameWorld.scale.x) + (game.width * 0.5),
      ((circ.y - gameWorld.pivot.y) * gameWorld.scale.y) + (game.height * 0.5)
    );
    circ.visible = Phaser.Rectangle.containsPoint(viewRect, boundsPoint);
  });
};

var sendInputUpdates = function(){
  if (player.spawned){
    var inputs = {
      up: game.input.keyboard.isDown(Phaser.Keyboard.UP),
      down: game.input.keyboard.isDown(Phaser.Keyboard.DOWN),
      left: game.input.keyboard.isDown(Phaser.Keyboard.LEFT),
      right: game.input.keyboard.isDown(Phaser.Keyboard.RIGHT),
      mouseX: game.input.activePointer.clientX,
      mouseY: game.input.activePointer.clientY
    };
    if (!_.isEqual(inputs, lastBroadcastedInputs)){
      console.log('New inputs detected! Sending to the server...');
      socket.emit('inputs', inputs);
      lastBroadcastedInputs = inputs;
    }
    // _.each(_.values(state.players), function(player){
    //   player.sprite.bringToTop();
    // });
  }
};

var sendHeartbeats = function(){
  if (player.spawned) {
    socket.emit('heartbeat');
  }
};

setInterval(sendInputUpdates, 1000 / 30);
setInterval(sendHeartbeats, 1000 / 30);

var render = function(game){
  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
};

var game = new Phaser.Game(1280, 800, Phaser.AUTO, 'game-wrapper', { preload: preload, create: create, update: update, render: render }, false, false);
