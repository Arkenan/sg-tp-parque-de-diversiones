var Barrido = require("./Barrido");

module.exports = function(){
  this.supB = null;

  this.theta = 2*Math.PI/20;
  this.largo_op = 3/2*10*Math.sin(this.theta/2);
  this.d_op = 2*5*Math.cos(this.theta/2),0;
  this.vertices = [-this.largo_op/1.5,0,0,this.largo_op/1.5,1,1,0.2,this.d_op,0,-0.8,this.d_op,0,-this.largo_op/1.5,0,3];

  var fForma = function(vertices){
      return function(t){
          return [vertices[12*t],0,vertices[12*t+1]];
      }
  }

  this.fForma = fForma(this.vertices);

  this.fBarrido = function(t){
    return [0, t, 0];
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, 5, 2).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
