// Columnas de la montaña rusa. Reutilización de la base de las sillas voladoras.

var BaseSillas = require("./BaseSillas.js");

module.exports = function(ubicacion,altura){
  this.ubicacion = ubicacion;
  this.altura = altura;

  this.init = function(gl,program){
    this.base = new BaseSillas().init(gl,program);
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
