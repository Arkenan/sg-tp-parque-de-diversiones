var Barrido = require("../../../main_shapes/Barrido");

module.exports = function(){
  this.supB = null;
  // Base. Esto podría extenderse a un objeto "barrido discreto".
  this.vertices = [0,-1/16,0,-1,0.5,0,0,1/16,0,1,0.5,0,0,-1/16,0];

  var fForma = function(vertices){
      return function(t){
          return [vertices[12*t],vertices[12*t+1],0];
      }
  }

  this.fForma = fForma(this.vertices);

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, 5, 2).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.scale(m,mv,[1,1,0.5]);
    mat4.translate(m,m,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
