/***************************************************************
 * Initialization & Input Listeners
 ***************************************************************/

var canvas = document.getElementById('game');
var world;

var inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
    mouseX: 0,
    mouseY: 0
};

canvas.addEventListener('mousemove', function(e) {
    console.log('mouse moved', e.offsetX, e.offsetY);
}, false);

canvas.addEventListener('keydown', function (e){
    if (e.keyCode === 87) inputs.up = true;
    if (e.keyCode === 83) inputs.down = true;
    if (e.keyCode === 65) inputs.left = true;
    if (e.keyCode === 68) inputs.right = true;
}, false);

canvas.addEventListener('keyup', function (e){
    if (e.keyCode === 87) inputs.up = false;
    if (e.keyCode === 83) inputs.down = false;
    if (e.keyCode === 65) inputs.left = false;
    if (e.keyCode === 68) inputs.right = false;
}, false);

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
