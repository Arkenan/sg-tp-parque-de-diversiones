var Revolucion = require("../../../main_shapes/RevolucionDiscreta.js");

module.exports = function(ubicacion,altura){
  this.ubicacion = ubicacion;
  this.altura = altura;

  this.vertices = [0,0,0,0,6.2,0,0.7,6.2,0,0.7,3.7,0,0.8,3.5,0,0.8,2.5,0,1,2,0,1,0,0,0,0,0];
  
  this.init = function(program){
    this.base = new Revolucion(this.vertices, 30).init(program);
    return this;
  }

  this.draw = function(mv){
    var mColumna = mat4.create();
    var ubicacionXY = [this.ubicacion[0],0,this.ubicacion[2]];
    mat4.translate(mColumna,mv,ubicacionXY);
    mat4.scale(mColumna,mColumna,[1.3,0.164 * this.altura,1.3]);
    this.base.draw(mColumna);
  }
}
