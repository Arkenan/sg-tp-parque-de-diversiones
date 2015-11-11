var Barrido = require("./Barrido");
var CubicBezierConcatenator  = require("../curves/CubicBezierConcatenator.js");

module.exports = function(){
  this.supB = null;

  var fForma = function(){

    var control = [

        [[2,0,2],[3,0,1],[2,0,2],[-3,0,3]],
        [[-3,0,3],[-5,0,-1],[-1,0,5],[-3,0,-4]],
        [[-3,0,-4],[2,0,1],[1,0,-5],[-2,0,5]],
        [[-2,0,5],[2,0,1],[-3,0,5],[-1,0,-3]],
        [[-1,0,-3],[-4,0,-4],[-3,0,-1],[2,0,2]]
    ];

      return function(t){
          var forma = new CubicBezierConcatenator().init(control);
          return forma.generate(t);
      }
  }
  this.fForma = fForma();

  this.fBarrido = function(t){
    return [0, t, 0];
  }

  this.init = function(gl, program){
    this.supB = new Barrido(this.fForma, this.fBarrido, 200, 40).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    this.supB.draw(m);
  }
}
