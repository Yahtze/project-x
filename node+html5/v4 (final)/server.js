var express = require('express');
var app = express().use(express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

/***************************************************************
 * Util Fns
 ***************************************************************/

function getNowMs() { return new Date().getTime(); }
function log(type, args) { console.log('['+type.toUpperCase()+'] ',args); }
function debug(args) { log('debug', args); }
function info(args) { log('info', args); }
function warn(args) { log('warn', args); }
function error(args) { log('error', args); }

/***************************************************************
 * Initialization
 ***************************************************************/

var world = {
    height: 1000,
    width: 1000,
    players: [],
    sockets: []
};

var defaultPlayer = {
    x: 0,
    y: 0,
    width: 30,
    height: 10,
    inputs: {
        up: false,
        down: false,
        left: false,
        right: false
    }
};

/***************************************************************
 * Client/Server comms
 ***************************************************************/

io.on('connection', function (socket){
    info('A user connected!');
    var thisPlayer = _.cloneDeep(defaultPlayer);
    thisPlayer.id = socket.id;

    world.players.push(thisPlayer);
    world.sockets.push(socket);

    socket.on('inputs', function (inputs) {
        world.players.forEach(function(player) {
            if (player.id === thisPlayer.id) {
                player.inputs = inputs;
            }
        });
    });

    socket.on('disconnect', function () {
        _.remove(world.players, function(player) {
            return player.id === thisPlayer.id;
        });
    });
});

function broadcastState () {
    var worldToBroadcast = {
        players: world.players
    };

    world.sockets.forEach(function(socket) {
        socket.emit('world', worldToBroadcast);
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
    world.players.forEach(updatePlayer);
}

setInterval(tick, 1000 / 30);


/***************************************************************
 * HTTP server startup
 ***************************************************************/

http.listen(3000, 'localhost', function () {
    info('Game server started & awaiting connections.');
});
