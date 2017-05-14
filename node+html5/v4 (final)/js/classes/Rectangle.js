function Rectangle(left, top, width, height) {
  var self = this;
  self.left = left || 0;
  self.top = top || 0;
  self.width = width || 0;
  self.height = height || 0;
  self.right = self.left + self.width;
  self.bottom = self.top + self.height;

  self.set = function(left, top, width, height) {
    self.left = left;
    self.top = top;
    self.width = width || self.width;
    self.height = height || self.height
    self.right = (self.left + self.width);
    self.bottom = (self.top + self.height);
  };

  self.within = function(r) {
    return (r.left <= self.left &&
            r.right >= self.right &&
            r.top <= self.top &&
            r.bottom >= self.bottom);
  };

  self.overlaps = function(r) {
    return (self.left < r.right &&
            r.left < self.right &&
            self.top < r.bottom &&
            r.top < self.bottom);
  };
}
