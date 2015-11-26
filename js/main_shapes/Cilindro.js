var Barrido  = require("./Barrido.js");

module.exports = function(cForma, cBarrido){
  this.supB = null;
  this.cForma = cForma;
  this.cBarrido = cBarrido;

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
