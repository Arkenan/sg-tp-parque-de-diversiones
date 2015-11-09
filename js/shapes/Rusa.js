var BarridoGeneral  = require("./BarridoGeneral.js");
var CubicBezierConcatenator  = require("../curves/CubicBezierConcatenator.js");

module.exports = function(puntosMRusa, cForma, cBarrido){
  this.ejeCentral = null;
  this.curve = null;
  this.cForma = cForma;
  this.cBarrido = cBarrido;
  this.control = puntosMRusa;

  // Recordar que toma números entre 0 y 1.
  this.fForma = function(t){
    var ang = t*2*Math.PI;
    var x = Math.cos(ang)/2;
    var y = Math.sin(ang)/2;
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
    this.curve = new CubicBezierConcatenator().init(this.control);
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
