sand.define('Function/bind', function() {
  
  // Really important function
  // binds this to a certain scope, makes it easier to handle closure
  Function.prototype.bind || (Function.prototype.bind = function(scope) {
    var self = this;
    return (function() {
      return (self.apply(scope, arguments));
    });
  });

  
});
