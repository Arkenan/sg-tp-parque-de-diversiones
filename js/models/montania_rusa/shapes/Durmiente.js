var BarridoD = require("../../../main_shapes/BarridoDiscreto.js");
var MaterialPhong = require("../../../Materiales/MaterialPhong.js");

module.exports = function(){
  this.vertices = [0,-1/6,0,1,0.5,0,0,1/7,0,-1,0.5,0,0,-1/6,0];

  this.fBarrido = function(t){
    return [0, 0, t];
  }

  this.init = function(){
    var material = new MaterialPhong({colorDifuso: [0.0, 0.4, 1.0, 1.0]});
    this.supB = new BarridoD(this.vertices, this.fBarrido, 2, [0,0,0]).init(material);
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
