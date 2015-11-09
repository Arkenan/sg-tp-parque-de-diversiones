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
    mat4.translate(mColumna,mv,this.ubicacion);
    mat4.scale(mColumna,mColumna,[1.3,this.altura,1.3]);
    this.base.draw(mColumna);
  }
}
