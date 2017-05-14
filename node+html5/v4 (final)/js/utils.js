var l = function (type, args) {
  var msgType = type === 'log' ? 'debug' : type;
  console[type]('['+msgType.toUpperCase()+'] ', args);
};
var debug = function (args) { l('log', args); };
var info = function (args) { l('info', args); };
var warn = function (args) { l('warn', args); };
var error = function (args) { l('error', args); };

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ) {
            window.setTimeout(callback, 1000 / 60);
          };
})();
