var Cubo = require("./Cubo.js");

module.exports = function(){
    
  this.init = function(gl, program){
    this.cubo = new Cubo().init(gl,program);
    return this;
  }

  this.draw = function(mv){
    var mCarrito = mat4.create();
    mat4.scale(mCarrito, mv, [1.5,0.75,2.5]);
    this.cubo.draw(mCarrito);
  }
}
