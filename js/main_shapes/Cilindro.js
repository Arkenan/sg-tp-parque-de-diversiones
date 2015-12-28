var Barrido  = require("./Barrido.js");

module.exports = function(cForma, cBarrido){
  this.cForma = cForma;
  this.cBarrido = cBarrido;

  this.fForma = function(t){
    var ang = t*2*Math.PI;
    var x = Math.cos(ang);
    var y = Math.sin(ang);
    return [x, y, 0];
  }

  this.init = function(material){
    this.supB = new Barrido(this.fForma, [0, 0, 1], this.cForma, this.cBarrido).init([material]);
    return this;
  }

  this.draw = function(mv){
    this.supB.draw(mv);
  }

}
