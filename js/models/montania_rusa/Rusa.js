// Montaña Rusa.

var BarridoGeneral  = require.main.require("./main_shapes/BarridoGeneral.js");
var ColumnaRusa  = require("./shapes/ColumnaRusa.js");
var Carrito = require("./shapes/Carrito.js");
var CubicBezierConcatenator  = require.main.require("./curves/CubicBezierConcatenator.js");
var Durmiente = require("./shapes/Durmiente.js");

module.exports = function(puntosMRusa, cForma, cBarrido){
  this.cForma = cForma;
  this.cBarrido = cBarrido;
  this.control = puntosMRusa;

  this.fForma = function(t){
    var ang = t*2*Math.PI;
    var x = Math.cos(ang)/8;
    var y = Math.sin(ang)/8;
    return [x, y, 0];
  }

  this.fFormaRielD = function(t){
      var ang = t*2*Math.PI;
      var x = 1 + Math.cos(ang)/4;
      var y = 0.5 + Math.sin(ang)/4;
      return [x, y, 0];
  }

  this.fFormaRielI = function(t){
      var ang = t*2*Math.PI;
      var x = - 1 + Math.cos(ang)/4;
      var y = 0.5 + Math.sin(ang)/4;
      return [x, y, 0];
  }

  var fBarrido = function(curve){
      return function(t){
        return curve.generate(t);
    }
  }

  // devuelve en orden: [Tangente, normal, binormal].
  var TNB = function(curve){
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
    this.TNB = TNB(this.curve);
    this.ejeCentral = new BarridoGeneral(this.fForma, this.fBarrido,
        this.TNB, this.cForma, this.cBarrido).init(gl,program);
    this.rielD = new BarridoGeneral(this.fFormaRielD, this.fBarrido, this.TNB,
        this.cForma, this.cBarrido).init(gl,program);
    this.rielI = new BarridoGeneral(this.fFormaRielI, this.fBarrido, this.TNB,
        this.cForma, this.cBarrido).init(gl,program);

    this.columnas = [];
    var interpolated = this.curve.getInterpolated();
    for (var i = 0; i < interpolated.length; i++) {
      this.columnas.push(new ColumnaRusa(interpolated[i],interpolated[i][1]).init(gl,program));
    }

    this.carrito = new Carrito().init(gl,program);
    this.durmiente = new Durmiente().init(gl,program);
    return this;
  }


  this.draw = function(mv,t){
    this.ejeCentral.draw(mv);
    this.rielD.draw(mv);
    this.rielI.draw(mv);

    for (var i = 0; i < this.columnas.length; i++) {
      this.columnas[i].draw(mv);
    }

    // z coincidirá con la tangente. -x con la binormal, y con la normal.
    var mCarrito = mat4.create();
    var pos = this.curve.generate((t*0.05)%1);
    var tnb = this.TNB((t*0.05)%1);

    // Matriz de cambio de base (en column major notation):
    M = [
        -tnb[2][0], -tnb[2][1], -tnb[2][2], 0,
        tnb[1][0], tnb[1][1], tnb[1][2], 0,
        tnb[0][0], tnb[0][1], tnb[0][2], 0,
        0, 0, 0, 1
    ]

    // Carrito.
    mat4.translate(mCarrito, mv, pos);
    mat4.multiply(mCarrito, mCarrito, M);
    mat4.translate(mCarrito, mCarrito, [0,1,0]);
    mat4.scale(mCarrito, mCarrito, [1/2, 1/2, 1/2]);
    this.carrito.draw(mCarrito);

    // Durmientes.
    for (var i = 0; i < 100; i++){
        var pos = this.curve.generate(i/100%1);
        var mDurmiente = mat4.create();
        var tnb = this.TNB(i/100%1);

        // Matriz de cambio de base (en column major notation):
        M = [
            -tnb[2][0], -tnb[2][1], -tnb[2][2], 0,
            tnb[1][0], tnb[1][1], tnb[1][2], 0,
            tnb[0][0], tnb[0][1], tnb[0][2], 0,
            0, 0, 0, 1
        ]
        mat4.translate(mDurmiente, mv, pos);
        mat4.multiply(mDurmiente, mDurmiente, M);
        //mat4.scale(mDurmiente, mDurmiente, [,20,20]);
        this.durmiente.draw(mDurmiente);

    }
  }
}
