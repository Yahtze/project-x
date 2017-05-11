// Phaser 2.0.4 camera zoom test (with camera bounds checking)
// Use cursors to move the camera, Q to zoom in, A to zoom out
var preload = function(game){
    game.time.advancedTiming = true;
};

var cameraZoom = 1,
    player = {
        sprite: {},
        lastInputs: {
            up: null,
            left: null,
            right: null,
            down: null
        }
    },
    bgGroup,
    enemyGroup,
    uiGroup,
    viewRect,
    boundsPoint,
    gameRendering,
    gameWorld;

var gameState = {};

var renderRandomBackground = function(){
    var sqr, size;
    for (var i = 0; i < 2500; i++){
        size = game.rnd.integerInRange(5, 20);
        sqr = game.add.graphics(game.rnd.integerInRange(-1000, 1000), game.rnd.integerInRange(-1000, 1000), bgGroup);
        sqr.beginFill(0x666666);
        sqr.drawRect(size * -0.5, size * -0.5, size, size);
        sqr.endFill();
    }
};

var addEnemyToWorld = function(e){}

var addPlayerToWorld = function(){
    player.sprite = game.add.graphics(0, 0, gameWorld);
    player.sprite.beginFill(0x00ff00);
    player.sprite.drawRect(0, 0, 32, 32);
    player.sprite.endFill();
};

var setupWebsocket = function(){
    socket = io(window.location.href);

    socket.on('player-spawn-accepted', function(playerId) {
        console.info('Server accepted spawn request; spawning!');
        player.id = playerId;
        player.isSpawned = true;
    });

    socket.on('game-state', function(newState){
        if (player.spawned && !newState.hasOwnProperty(socket.id)) {
            player.spawned = false;
            window.location.reload();
        }
        gameState = newState;
    });

    socket.on('player-kicked', function(playerId) {
        console.info('Player ' + playerId + ' has been kicked from the game due to inactivity!');
    });
};

var initializeGameWorld = function(){
    boundsPoint = new Phaser.Point(0, 0);
    viewRect = new Phaser.Rectangle(0, 0, game.width, game.height);
    gameWorld = game.add.group();
    gameWorld.position.setTo(game.world.centerX, game.world.centerY);
    bgGroup = game.add.group(gameWorld);
    enemyGroup = game.add.group(gameWorld);
    renderRandomBackground();
    setupWebsocket();
    game.world.setBounds(-1000, -1000, 2000, 2000);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

var create = function(game){
    initializeGameWorld();
};

var renderEntitiesInFrameByGroup = function (entityGroup){
    // TODO: improve with a quadtree or similar batched approach?
    entityGroup.forEachExists(function(entity){
        boundsPoint.setTo(
            ((entity.x - gameWorld.pivot.x) * gameWorld.scale.x) + (game.width * 0.5),
            ((entity.y - gameWorld.pivot.y) * gameWorld.scale.y) + (game.height * 0.5)
        );
        entity.visible = Phaser.Rectangle.containsPoint(viewRect, boundsPoint);
    });
};

$('#play').on('click', function(){
    socket.emit('player-spawn-requested');
    $('#play').hide();
});

var update = function(game){

    // if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    //     gameWorld.pivot.y -= 5;
    //     player.y -= 5;
    // } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
    //     gameWorld.pivot.y += 5;
    //     player.y += 5;
    // }
    // if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    //     gameWorld.pivot.x -= 5;
    //     player.x -= 5;
    // } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
    //     gameWorld.pivot.x += 5;
    //     player.x += 5;
    // }
    //
    // if (game.input.keyboard.isDown(Phaser.Keyboard.Q)){
    //     cameraZoom += 0.05;
    // } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
    //     cameraZoom -= 0.05;
    // }

    cameraZoom = Phaser.Math.clamp(cameraZoom, 0.1, 4);
    gameWorld.scale.set(cameraZoom);
    _.map([bgGroup, enemyGroup], renderEntitiesInFrameByGroup);
};

var render = function(game){
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
};

var game = new Phaser.Game(1024, 576, Phaser.AUTO, 'game-wrapper', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var updatePlayerHeartbeat = function(){
    if (player.isSpawned) {
        console.log('Sending server heartbeat');
        socket.emit('player-heartbeat');
    }
};

var updatePlayerInputs = function(){
    if (player.isSpawned) {
        var newInputs = {
            up: game.input.keyboard.isDown(Phaser.Keyboard.UP),
            down: game.input.keyboard.isDown(Phaser.Keyboard.DOWN),
            left: game.input.keyboard.isDown(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
        };

        if (_.isEqual(player.lastInputs, newInputs)) return;

        player.lastInputs = newInputs;
        socket.emit('player-inputs', newInputs);
    }
};

setInterval(updatePlayerHeartbeat, 1000);
setInterval(updatePlayerInputs, 1000 / 20);
