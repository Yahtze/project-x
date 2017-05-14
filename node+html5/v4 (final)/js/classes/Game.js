var Game = function (initialWorldState, socket) {
  var self = this;

  self.socket = socket;
  self.canvas = document.getElementById('game');
  self.context = self.canvas.getContext('2d');

  self.controls = {
    left: false,
    up: false,
    right: false,
    down: false,
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0
  };

  self.currentPlayer = {
    id: socket.id,
    x: 0,
    y: 0
  };

  self.world = {
    height: initialWorldState.height,
    width: initialWorldState.width,
    map: new Map(self, initialWorldState.height, initialWorldState.width, self.context)
  };

  self.world.map.generate();

  self.context.canvas.width = 720;
  self.context.canvas.height = 405;

  self.camera = new Camera(
    self,
    0,
    0,
    self.canvas.width,
    self.canvas.height,
    self.world.width,
    self.world.height
  );

  self.camera.follow(
    self.currentPlayer,
    self.canvas.width / 2,
    self.canvas.height / 2
  );

  self.updateCamera = function() {
    self.camera.update();
  };

  self.canvas.addEventListener('mousemove', function(e) {
    self.controls.mouseX = e.offsetX;
    self.controls.mouseY = e.offsetY;
  }, false);

  window.addEventListener('keydown', function (e){
    if (e.keyCode === 87) self.controls.up = true;
    if (e.keyCode === 83) self.controls.down = true;
    if (e.keyCode === 65) self.controls.left = true;
    if (e.keyCode === 68) self.controls.right = true;
  }, false);

  window.addEventListener('keyup', function (e){
    if (e.keyCode === 87) self.controls.up = false;
    if (e.keyCode === 83) self.controls.down = false;
    if (e.keyCode === 65) self.controls.left = false;
    if (e.keyCode === 68) self.controls.right = false;
  }, false);

  self.players = _.map(initialWorldState.players, function(p) {
    if (p.id === self.currentPlayer.id) {
      self.camera.follow(
        self.currentPlayer,
        self.canvas.width / 2,
        self.canvas.height / 2
      );
    }
    return new Player(self, p);
  });

  self.lastBroadcastedInputs = undefined;

  self.socket.on('world', function(world) {
    var newPlayers = _.map(world.players, function(p) {
      if (p.id === self.currentPlayer.id) {
        self.currentPlayer.x= p.x;
        self.currentPlayer.y = p.y;
      }
      return new Player(self, p);
    });
    self.players = newPlayers;
  });

  self.broadcastInputs = function() {
    if (_.isEqual(self.controls, self.lastBroadcastedInputs)) return;
    self.socket.emit('inputs', self.controls);
    self.lastBroadcastedInputs = _.cloneDeep(self.controls);
  };

  self.draw = function() {
    self.context.clearRect(
      0,
      0,
      self.canvas.width,
      self.canvas.height
    );
    self.world.map.draw(self.context, self.camera.xView, self.camera.yView);
    _.each(self.players, function(p) {
      p.draw(self.context,self.camera.xView,self.camera.yView);
    });
    requestAnimFrame(self.draw);
  };

  self.cameraUpdateInterval = setInterval(self.updateCamera, 1000 / 30);
  self.inputBroadcastInterval = setInterval(self.broadcastInputs, 1000 / 30);
};
