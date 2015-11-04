var Barrido  = require("./Barrido.js");

//Por ahora es para altura y radio 1, después generalizamos mejor.
module.exports = function(cForma, cBarrido){
  this.supB = null;
  this.cForma = cForma;
  this.cBarrido = cBarrido;
  // Recordar que toma números entre 0 y 1.
  this.fForma = function(t){
    var ang = t*2*Math.PI;
    var x = Math.cos(ang);
    var y = Math.sin(ang);
    return [x, y, 0];
  }

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, this.cForma, this.cBarrido).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    this.supB.draw(mv);
  }

}
