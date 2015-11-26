var Cubo = require("../../../main_shapes/Cubo.js");

// Por ahora solo es un simple cubo. Si hay tiempo, se le darán detalles aquí.
module.exports = function(){
  this.cubo = null;

  this.init = function(program){
    this.cubo = new Cubo().init(program);
    return this;
  }

  this.draw = function(mv){
    this.cubo.draw(mv);
  }
}
