/***************************************************************
 * Initialization & Input Listeners
 ***************************************************************/

var canvas = document.getElementById('game');
var world;



/***************************************************************
 * Client/Server Communication
 ***************************************************************/

var socket = io(window.location.href);

socket.on('world', function (updatedWorld) {
    world = updatedWorld;
});

var lastBroadcastedInputs;

function sendInputs () {
    if (_.isEqual(inputs, lastBroadcastedInputs)) { return; }
    socket.emit('inputs', inputs);
    lastBroadcastedInputs = _.cloneDeep(inputs);
}

setInterval(sendInputs, 1000 / 30);

/***************************************************************
 * Rendering
 ***************************************************************/

 var draw = canvas.getContext('2d');

 draw.imageSmoothingEnabled = false;
 draw.translate(0.5, 0.5);

function renderPlayer (player) {
    draw.fillStyle = 'rgb(200,0,0)';
    draw.fillRect(player.x, player.y, player.width, player.height);
}

function render () {
    draw.clearRect(0, 0, canvas.width, canvas.height);
    if (world !== undefined) {
        world.players.forEach(renderPlayer);
    }
    window.requestAnimationFrame(render);
}

render ();
