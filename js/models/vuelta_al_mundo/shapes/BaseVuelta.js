// Placas de base de la Vuelta al Mundo.
var BarridoD = require("../../../main_shapes/BarridoDiscreto.js");
var MaterialPhong = require('../../../Materiales/MaterialPhong.js');

module.exports = function(){
  // Uso datos de los triángulos de la Rueda.
  this.theta = 2*Math.PI/15;
  this.largo_op = 3/2*10*Math.sin(this.theta/2);
  this.d_op = 3/2*5*Math.cos(this.theta/2),0;
  this.vertices = [-this.largo_op/2,0,0,this.largo_op/2,0,0,0.2,this.d_op,0,-0.2,this.d_op,0,-this.largo_op/2,0,0];

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(){
    var material = new MaterialPhong({colorDifuso:[0.6, 0.6, 0.4, 1.0]});
    this.supB = new BarridoD(this.vertices, this.fBarrido, 2).init(material);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
