var CubicBezier  = require("../curves/CubicBezier.js");

module.exports = function(){
  this.curves = [];

  this.init = function(controlPointSet) {
    for (var i = 0; i < controlPointSet.length; i++) {
      var curve = new CubicBezier().init(controlPointSet[i]);
      this.curves.push(curve);
    }
  }

  this.generate = function(t){
    var curveNumber = Math.floor(Math.abs(t));
    var tCurve = t - curveNumber;
    if(curveNumber <= this.curves.length){
      return this.curves[curveNumber];
    }else{
      console.log('[CubicBezierConcatenator]: t parameter out of range');
    }
  }
}
