var Barrido  = require("./Barrido.js");
var CubicBezier  = require("../curves/CubicBezier.js");

module.exports = function(cForma, cBarrido){
  this.supB = null;
  this.curva = null;
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
    var curve = new CubicBezier().init([[2,1,3],[1,5,0],[3,6,2],[4,4,4]]).generate(t);
    return curve;
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, this.cForma, this.cBarrido).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    this.supB.draw(mv);
  }
}
