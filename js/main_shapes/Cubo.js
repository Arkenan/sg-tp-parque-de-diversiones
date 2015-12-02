var BarridoD = require("./BarridoDiscreto.js");

module.exports = function(){
  this.vertices = [-0.5,-0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,0.5,0,-0.5,-0.5,0];

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(program){
    this.supB = new BarridoD(this.vertices, this.fBarrido, 2).init(program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
