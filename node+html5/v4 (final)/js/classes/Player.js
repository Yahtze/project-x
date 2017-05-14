var Player = function (game, player) {
  var self = this;
  self.game = game;

  self.inputs = player.inputs;

  // (x, y) = center of object
  // ATTENTION:
  // it represents the player position on the world(room), not the canvas position
  self.x = player.x;
  self.y = player.y;

  self.inputs.canvasX = self.x;
  self.inputs.canvasY = self.y;

  // render properties
  self.width = player.width;
  self.height = player.height;

  self.draw = function(context, xView, yView){
    self.inputs.canvasX = self.x - xView;
    self.inputs.canvasY = self.y - yView;

    var rads = Math.atan2(
      self.inputs.mouseY - (self.inputs.canvasY + self.height / 2),
      self.inputs.mouseX - (self.inputs.canvasX + self.width / 2)
    );

    // first save the untranslated/unrotated context
    context.save();
    context.beginPath();
    // move the rotation point to the center of the rect
    context.translate(
      self.inputs.canvasX + self.width / 2,
      self.inputs.canvasY + self.height / 2
    );

    // rotate the rect
    context.rotate(rads);
    context.rect(
      -self.width / 2,
      -self.height / 2,
      self.width,
      self.height
    );
    context.fillStyle="gold";
    context.fill();
    // restore the context to its untranslated/unrotated state
    context.restore();

    // Draw a line from the center of the player to the players target
    context.save();
    context.beginPath();
    context.moveTo((self.inputs.canvasX + self.width / 2), (self.inputs.canvasY + self.height / 2));
    context.lineTo(self.inputs.mouseX, self.inputs.mouseY);
    context.stroke();
    context.restore();
  };
};
