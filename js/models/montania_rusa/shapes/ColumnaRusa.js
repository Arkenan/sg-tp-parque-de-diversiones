var Revolucion = require("../../../main_shapes/Revolucion.js");

module.exports = function(ubicacion,altura){
  this.ubicacion = ubicacion;
  this.altura = altura;

  this.vertices = [0,0,0,0,6.2,0,0.7,6.2,0,0.7,3.7,0,0.8,3.5,0,0.8,2.5,0,1,2,0,1,0,0,0,0,0];
  var fPerfil = function(vertices){
      return function(t){
          // Redondeo por posibles pequeños errores numéricos (los hubo).
          return [vertices[Math.round(24*t)],vertices[Math.round(24*t+1)],0];
      }
  }
  this.fPerfil = fPerfil(this.vertices);

  this.init = function(program){
    this.base = new Revolucion(this.fPerfil,9,30).init(program);
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
