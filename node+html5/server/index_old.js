var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SAT = require('sat');
var config = require('./config.json');
var util = require('./util.js');
var quadtree = require('simple-quadtree');
var host = config.host;
var port = config.port;
var _ = require('lodash');
app.use(express.static(__dirname + '/../client'));

function log(type, args) { console.log('['+type.toUpperCase()+']',args); }
function debug(args) { log('debug', args); }
function info(args) { log('info', args); }
function warn(args) { log('warn', args); }
function error(args) { log('error', args); }

var players = {};

io.on('connection', function(socket) {
    info('A user connected!');

    var position = {
        x: 0,
        y: 0
    };

    var currentPlayer = {
        data: {
            id: socket. id,
            x: position. x,
            y: position. y,
            inputs: {
                up: false,
                down: false,
                right: false,
                left: false
            }
        },
        socket: socket
    };

    function processPlayerInputs(inputs) {
        if (inputs.up) currentPlayer.data.y -= 3;
        if (inputs.down) currentPlayer.data.y += 3;
        if (inputs.left) currentPlayer.data.x -= 3;
        if (inputs.right) currentPlayer.data.x += 3;
    }

    socket.on('ready-to-play', function() {
        players[currentPlayer.data.id] = currentPlayer;
        socket.emit('welcome', currentPlayer.data);
    });

    socket.on('welcome-acknowledged', function(player) {
        info('Player \'' + player.name + '\' (\'' + player.id + '\') is ready to play!');
        currentPlayer.data = player;
        players[currentPlayer.data.id] = currentPlayer;
        console.log('----------------------- emitting spawn');
        socket.emit('spawn', currentPlayer.data);
    });

    socket.on('ping-check', function() {
        socket.emit('pong-check');
    });

    socket.on('player-input', function(inputs) {
        console.log('Player inputs:', inputs);
        processPlayerInputs(inputs);
    });
});

function updateBroadcastLoop () {
    var playerArray = _.values(players);
    var playerData = _.map(playerArray, function(p) {
        return p.data;
    });
    for (var i = 0; i < playerArray.length; i++) {
        playerArray[i].socket.emit('game-state', playerData);
    }
}

setInterval(updateBroadcastLoop, 1000 / 40);

var host = config.host;
var port = config.port;
http.listen(port, host, function() {
    info('Game server started & awaiting connections.');
});
