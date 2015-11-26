// Placas de base de la Vuelta al Mundo.
var Barrido = require("../../../main_shapes/Barrido");

module.exports = function(){
  this.supB = null;

  // Uso datos de los triángulos de la Rueda.
  this.theta = 2*Math.PI/15;
  this.largo_op = 3/2*10*Math.sin(this.theta/2);
  this.d_op = 3/2*5*Math.cos(this.theta/2),0;
  this.vertices = [-this.largo_op/2,0,0,this.largo_op/2,0,0,0.2,this.d_op,0,-0.2,this.d_op,0,-this.largo_op/2,0,0];

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
