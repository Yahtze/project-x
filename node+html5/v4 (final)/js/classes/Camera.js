// possibles axis to move the camera
var AXIS = {
    NONE: "none",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    BOTH: "both"
};

// Camera constructor
function Camera(game, xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
  var self = this;
  self.game = game;
  // position of camera (left-top coordinate)
  self.xView = xView || 0;
  self.yView = yView || 0;

  // distance from followed object to border before camera starts move
  self.xDeadZone = 0; // min distance to horizontal borders
  self.yDeadZone = 0; // min distance to vertical borders

  // viewport dimensions
  self.wView = canvasWidth;
  self.hView = canvasHeight;

  // allow camera to move in vertical and horizontal axis
  self.axis = AXIS.BOTH;

  // object that should be followed
  self.followed = null;

  // rectangle that represents the viewport
  self.viewportRect = new Rectangle(self.xView, self.yView, self.wView, self.hView);

  // rectangle that represents the world's boundary (room's boundary)
  self.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);

  self.follow = function(gameObject, xDeadZone, yDeadZone) {
    self.followed = gameObject;
    self.xDeadZone = xDeadZone;
    self.yDeadZone = yDeadZone;
  };

  self.update = function() {
    // keep following the player (or other desired object)
    if(self.followed != null) {
      console.log(self.followed);
      if(self.axis == AXIS.HORIZONTAL || self.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if(self.followed.x - self.xView  + self.xDeadZone > self.wView)
          self.xView = self.followed.x - (self.wView - self.xDeadZone);
        else if(self.followed.x  - self.xDeadZone < self.xView)
          self.xView = self.followed.x  - self.xDeadZone;

      }
      if(self.axis == AXIS.VERTICAL || self.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if(self.followed.y - self.yView + self.yDeadZone > self.hView)
          self.yView = self.followed.y - (self.hView - self.yDeadZone);
        else if(self.followed.y - self.yDeadZone < self.yView)
          self.yView = self.followed.y - self.yDeadZone;
      }
    }

    // update viewportRect
    self.viewportRect.set(self.xView, self.yView);

    // don't let camera leaves the world's boundary
    if(!self.viewportRect.within(self.worldRect)) {
      if(self.viewportRect.left < self.worldRect.left)
        self.xView = self.worldRect.left;
      if(self.viewportRect.top < self.worldRect.top)
        self.yView = self.worldRect.top;
      if(self.viewportRect.right > self.worldRect.right)
        self.xView = self.worldRect.right - self.wView;
      if(self.viewportRect.bottom > self.worldRect.bottom)
        self.yView = self.worldRect.bottom - self.hView;
    }
  }
}
