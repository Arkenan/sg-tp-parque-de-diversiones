var Barrido = require("./Barrido");

module.exports = function(){
  this.supB = null;
  // Base. Esto podría extenderse a un objeto "barrido discreto".
  this.vertices = [-0.5,-0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,0.5,0,-0.5,-0.5,0];

  var fForma = function(vertices){
      return function(t){
          return [vertices[12*t],vertices[12*t+1],0];
      }
  }

  this.fForma = fForma(this.vertices);

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(program){
    this.supB = new Barrido(this.fForma, this.fBarrido, 5, 2).init(program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
