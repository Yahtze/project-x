var express = require('express');
var app = express().use(express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

/***************************************************************
 * Util Fns
 ***************************************************************/

function getNowMs() { return new Date().getTime(); }

/***************************************************************
 * Initialization
 ***************************************************************/

var World = {
    height: 1500,
    width: 1500,
    players: [],
    sockets: []
};

var defaultPlayer = {
    x: 10,
    y: 10,
    width: 20,
    height: 40,
    inputs: {
      left: false,
      up: false,
      right: false,
      down: false,
      mouseX: 0,
      mouseY: 0,
      canvasX: 0,
      canvasY: 0
    }
};

/***************************************************************
 * Client/Server comms
 ***************************************************************/

io.on('connection', function (socket){
    console.log('A user connected!');
    var thisPlayer = _.cloneDeep(defaultPlayer);
    thisPlayer.id = socket.id;

    World.players.push(thisPlayer);
    World.sockets.push(socket);

    socket.on('inputs', function (inputs) {
        console.log('Got player inputs', JSON.stringify(inputs, null, 2));
        World.players.forEach(function(player) {
            if (player.id === thisPlayer.id) {
                player.inputs = inputs;
            }
        });
    });

    socket.on('disconnect', function () {
        _.remove(World.players, function(player) {
            return player.id === thisPlayer.id;
        });
    });
});

function broadcastState () {
    if (World.players.length === 0) return;

    var worldToBroadcast = {
        players: World.players
    };

    var initialWorldToBroadcast = {
      players: World.players,
      width: World.height,
      height: World.width
    };

    World.sockets.forEach(function(socket) {
        var messageToEmit = socket.isInitialStateBroadcasted ? 'world' : 'initialWorldState';
        var worldToEmit = socket.isInitialStateBroadcasted ? worldToBroadcast : initialWorldToBroadcast;
        socket.emit(messageToEmit, worldToEmit);
        socket.isInitialStateBroadcasted = true;
    });
}

setInterval(broadcastState, 1000 / 30);

/***************************************************************
 * World updates, physics, etc
 ***************************************************************/

function updatePlayer (player) {
    if (player.inputs.up) player.y -= 5;
    if (player.inputs.down) player.y += 5;
    if (player.inputs.left) player.x -= 5;
    if (player.inputs.right) player.x += 5;
}

function tick () {
    World.players.forEach(updatePlayer);
}

setInterval(tick, 1000 / 30);

/***************************************************************
 * HTTP server startup
 ***************************************************************/

http.listen(3000, 'localhost', function () {
    console.log('Game server started & awaiting connections.');
});
