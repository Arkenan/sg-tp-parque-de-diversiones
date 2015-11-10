var Barrido = require("./Barrido");
var CubicBezierConcatenator  = require("../curves/CubicBezierConcatenator.js");
var PointsPileta  = require("../points/PointsPileta.js");

module.exports = function(){
  this.supB = null;

  var fForma = function(){

    var control = PointsPileta();

      return function(t){
          var forma = new CubicBezierConcatenator().init(control);
          return forma.generate(t);
          //return [vertices[12*t],0,vertices[12*t+1]];
      }
  }
  this.fForma = fForma();

  this.fBarrido = function(t){
    return [0, t, 0];
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, 5, 5).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
