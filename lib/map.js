(sand.define("Array/map", function() {
  
  //TOMATURE:debug
  var debug = this.debug;
  
  Array.prototype.map = function(fn, scope) { // returns a new array where elements are fn(this[i])
  //scope is here for node's map compatibility
    if (scope) fn = fn.bind(scope);
    var r = this.slice();
    if (typeof(fn) === "function") {
      for (var i = 0, n = r.length; i < n; i++) r[i] = fn(r[i], i);
    }
    else {
      debug.i && console.log('should not happen?');
      fn = fn.substr(2, fn.length);
      for (var i = 0, n = r.length; i < n; i++) r[i] = r[i][fn]();
    }
    return r;
  };
  
  Array.prototype.as = function(fn) {
    debug.w&&console.log("[WARNING]: deprecated, use map instead of as");
    return (Array.prototype.map.call(this, fn));
  };
  
}));
