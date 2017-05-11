var express = require('express');
var app = express().use(express.static(__dirname + '/../client'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');
var host = config.host;
var port = config.port;
var _ = require('lodash');

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}
function getNowMs(){ return new Date().getTime(); }
function log(type, args){ console.log('['+type.toUpperCase()+'] ',args); }
function debug(args){ log('debug', args); }
function info(args){ log('info', args); }
function warn(args){ log('warn', args); }
function error(args){ log('error', args); }

var gameState = {
    world: {
        players: {},
    },
    sockets: []
};

var newlySpawnedPlayer = {
    location: {
        x: 0,
        y: 0
    },
    inputs: {}
};

io.on('connection', function(socket){
    info('A user connected!');
    gameState.sockets.push(socket);

    socket.on('player-spawn-requested', function() {
        var newPlayer = _.cloneDeep(newlySpawnedPlayer);
        newPlayer.id = socket.id;
        newPlayer.lastHeartbeat = getNowMs();
        gameState.world.players[socket.id] = newPlayer;
        socket.emit('player-spawn-accepted', newPlayer.id);
        info('New player spawned!');
    });

    socket.on('player-heartbeat', function() {
        if (gameState.world.players[socket.id]) {
            gameState.world.players[socket.id].lastHeartbeat = getNowMs();
        }
    });

    socket.on('player-inputs', function(inputs){
        info('Got player inputs', inputs);
        info(gameState.world.players[socket.id]);
        gameState.world.players[socket.id].inputs = inputs;
    });
});

function broadcastToAllPlayers(eventName, payload) {
    _.each(gameState.sockets, function(s) {
        s.emit(eventName, payload);
    });
}

function broadcastGameState (){
    broadcastToAllPlayers('game-state', gameState.world.players);
}

function broadcastPlayerKick (pid){
    broadcastToAllPlayers('player-kicked', pid);
}

function tick(){}
function kickAFKPlayers(){
    _.each(gameState.world.players, function(player) {
        var now = getNowMs();
        if ((now - player.lastHeartbeat) > 5000) {
            info('Kicking player ' + player.id + ' for inactivity');
            delete gameState.world.players[player.id];
            broadcastPlayerKick(player.id);
        }
    });
}

setInterval(kickAFKPlayers, 3000);
setInterval(broadcastGameState, 1000 / config.serverTickRate); //  / config.serverTickRate
setInterval(tick, 1000 / config.serverTickRate);

http.listen(port, host, function(){
    info('Game server started & awaiting connections.');
});
