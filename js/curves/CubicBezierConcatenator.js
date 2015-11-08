var CubicBezier  = require("../curves/CubicBezier.js");

module.exports = function(){
  this.curves = [];

  this.init = function(controlPointSet) {
    for (var i = 0; i < controlPointSet.length; i++) {
      var curve = new CubicBezier().init(controlPointSet[i]);
      this.curves.push(curve);
    }
  }

  this.generate = function(curveNumber){
    if(curveNumber <= this.curves.length){
      return function(t) {
        this.curves[curveNumber].generate(t);
      };
    }else{
      console.log('[CubicBezierConcatenator]: t parameter out of range');
    }
  }
}
