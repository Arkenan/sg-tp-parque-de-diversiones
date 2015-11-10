var Cubo = require("./Cubo.js");

module.exports = function(recorrido){
  this.recorrido = recorrido;
  this.cubo = null;

  this.init = function(gl, program){
    this.cubo = new Cubo().init(gl,program);
    return this;
  }

  this.draw = function(mv,t){
    var step = recorrido.generate((0.05 * t) % 1);
    var orientation = recorrido.generate_d1((0.05 * t) % 1);
    vec3.normalize(orientation, orientation);
    var mCarrito = mat4.create();
    mat4.translate(mCarrito,mv,step);
    mat4.rotate(mCarrito,mCarrito,Math.PI,[0,1,0]);
    mat4.rotate(mCarrito,mCarrito,Math.PI/12,orientation);
    mat4.scale(mCarrito,mCarrito,[3/2,3/2,3/2]);
    this.cubo.draw(mCarrito);
  }
}
