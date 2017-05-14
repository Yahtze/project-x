function Map(game, width, height, context) {
  var self = this;
  self.game = game;

  // map dimensions
  self.width = width;
  self.height = height;

  // map texture
  self.image = null;

  self.generate = function() {
    // var context = document.getElementById('game-background').getContext('2d');
    context.canvas.width = this.width;
    context.canvas.height = this.height;
    var rows = ~~(this.width / 44) + 1;
    var columns = ~~(this.height / 44) + 1;
    var color = "red";
    context.save();
    context.fillStyle = "red";
    for (var x = 0, i = 0; i < rows; x += 44, i++) {
      context.beginPath();
      for (var y = 0, j=0; j < columns; y += 44, j++) {
        context.rect(x, y, 40, 40);
      }
      color = (color == "red" ? "blue" : "red");
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }
    context.restore();

    // store the generate map as this image texture
    this.image = new Image();
    this.image.src = context.canvas.toDataURL("image/png");

    // clear context ???
    context = null;
  };

  self.draw = function(context, xView, yView) {
    // easiest way: draw the entire map changing only the destination coordinate in canvas
    // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
    //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);

    // didatic way:

    var sx, sy, dx, dy;
    var sWidth, sHeight, dWidth, dHeight;

    xView = self.game.camera.xView;
    yView = self.game.camera.yView;

    // offset point to crop the image
    sx = xView;
    sy = yView;

    // dimensions of cropped image
    sWidth =  context.canvas.width;
    sHeight = context.canvas.height;

    // if cropped image is smaller than canvas we need to change the source dimensions
    if(this.image.width - sx < sWidth) {
      sWidth = this.image.width - sx;
    }
    if(this.image.height - sy < sHeight) {
      sHeight = this.image.height - sy;
    }

    // location on canvas to draw the croped image
    dx = 0;
    dy = 0;
    // match destination with source to not scale the image
    dWidth = sWidth;
    dHeight = sHeight;

    context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  };
}
