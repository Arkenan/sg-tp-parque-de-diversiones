var BarridoGeneral  = require("./BarridoGeneral.js");
var ColumnaRusa  = require("./ColumnaRusa.js");
var Carrito = require("./Carrito.js");
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
    var x = Math.cos(ang)/4;
    var y = Math.sin(ang)/4;
    return [x, y, 0];
  }

  this.fFormaRielD = function(t){
      var ang = t*2*Math.PI;
      var x = 1 + Math.cos(ang)/8;
      var y = 0.5 + Math.sin(ang)/8;
      return [x, y, 0];
  }

  this.fFormaRielI = function(t){
      var ang = t*2*Math.PI;
      var x = - 1 + Math.cos(ang)/8;
      var y = 0.5 + Math.sin(ang)/8;
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
        vec3.cross(binormal, tg, [0,1,0]);
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
    this.rielD = new BarridoGeneral(this.fFormaRielD, this.fBarrido, this.frenet,
        this.cForma, this.cBarrido).init(gl,program);
    this.rielI = new BarridoGeneral(this.fFormaRielI, this.fBarrido, this.frenet,
        this.cForma, this.cBarrido).init(gl,program);

    this.columnas = [];
    var interpolated = this.curve.getInterpolated();
    for (var i = 0; i < interpolated.length; i++) {
      this.columnas.push(new ColumnaRusa(interpolated[i],interpolated[i][1]).init(gl,program));
    }

    this.carrito = new Carrito(this.curve).init(gl,program);

    return this;
  }

  this.draw = function(mv,t){
    this.ejeCentral.draw(mv);
    this.rielD.draw(mv);
    this.rielI.draw(mv);

    for (var i = 0; i < this.columnas.length; i++) {
      this.columnas[i].draw(mv);
    }
    this.carrito.draw(mv,t);
  }
}
