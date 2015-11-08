var BarridoGeneral  = require("./BarridoGeneral.js");
var CubicBezier  = require("../curves/CubicBezier.js");

module.exports = function(cForma, cBarrido){
  this.ejeCentral = null;
  this.curve = null;
  this.cForma = cForma;
  this.cBarrido = cBarrido;
  this.control = [[2,1,3],[1,5,0],[3,6,2],[4,4,4]];

  // Recordar que toma números entre 0 y 1.
  this.fForma = function(t){
    var ang = t*2*Math.PI;
    var x = Math.cos(ang);
    var y = Math.sin(ang);
    return [x, y, 0];
  }

  var fBarrido = function(curve){
      return function(t){
        return curve.generate(t);
    }
  }

  // devuelve en orden: [Tangente, normal, binormal].
  var frenet = function(curve){
      return function(t){
        var normal = vec3.create(), binormal = vec3.create();
        var tg = curve.generate_d1(t);
        vec3.normalize(tg, tg);
        vec3.cross(binormal, tg, curve.generate_d2(t));
        vec3.normalize(binormal, binormal);
        vec3.cross(normal,binormal,tg);
        return [tg, normal, binormal];
    }
  }

  this.init = function(gl, program){
    this.curve = new CubicBezier().init(this.control);
    this.fBarrido = fBarrido(this.curve);
    this.frenet = frenet(this.curve);
    this.ejeCentral = new BarridoGeneral(this.fForma, this.fBarrido,
        this.frenet, this.cForma, this.cBarrido).init(gl,program);
    return this;
  }

  this.draw = function(mv){
    this.ejeCentral.draw(mv);
  }
}
