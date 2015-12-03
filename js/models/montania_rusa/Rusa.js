// Montaña Rusa.

var BarridoGeneral  = require("../../main_shapes/BarridoGeneral.js");
var ColumnaRusa  = require("./shapes/ColumnaRusa.js");
var Carrito = require("./shapes/Carrito.js");
var CubicBezierConcatenator  = require("../../curves/CubicBezierConcatenator.js");
var Durmiente = require("./shapes/Durmiente.js");
var MaterialPhong = require("../../Materiales/MaterialPhong.js");

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
      var x = Math.cos(ang)/4;
      var y = Math.sin(ang)/4;
      return [x, y, 0];
  }

  this.fFormaRielI = function(t){
      var ang = t*2*Math.PI;
      var x = Math.cos(ang)/4;
      var y = Math.sin(ang)/4;
      return [x, y, 0];
  }

  // toma una curva y la desplaza según un deltaXY intrínseco.
  var recorridoDesplazado = function(curva, deltaXY){
    return function(t){
      var gen = curva.generate(t);
      var tnb = curva.TNB(t);

      // Vectores normal y binormal.
      var N = tnb[1];
      var B = tnb[2];

      return [
        gen[0] + B[0]*deltaXY[0] + N[0]*deltaXY[1],
        gen[1] + B[1]*deltaXY[0] + N[1]*deltaXY[1],
        gen[2] + B[2]*deltaXY[0] + N[2]*deltaXY[1]
      ]
    }
  }

  var fBarrido = function(curve){
      return function(t){
        return curve.generate(t);
    }
  }

  // devuelve en orden: [Tangente, normal, binormal].
  var TNB = function(curve){
      return function(t){
        return curve.TNB(t);
    }
  }

  this.init = function(){
    this.curve = new CubicBezierConcatenator().init(this.control);
    this.fBarrido = fBarrido(this.curve);
    this.TNB = TNB(this.curve);
    var materialRieles = new MaterialPhong({colorDifuso: [0.5, 0.5, 0.5, 1.0]});
    this.ejeCentral = new BarridoGeneral(this.fForma, this.fBarrido,
        this.TNB, this.cForma, this.cBarrido).init(materialRieles);
    var barridoD = recorridoDesplazado(this.curve, [1, 0.5]);
    this.rielD = new BarridoGeneral(this.fFormaRielD, barridoD, this.TNB,
        this.cForma, this.cBarrido).init(materialRieles);
    var barridoI = recorridoDesplazado(this.curve, [-1, 0.5]);
    this.rielI = new BarridoGeneral(this.fFormaRielI, barridoI, this.TNB,
        this.cForma, this.cBarrido).init(materialRieles);

    this.columnas = [];
    var interpolated = this.curve.getInterpolated();
    var materialColumnas = new  MaterialPhong({colorDifuso:[0.2, 0.2, 0.2, 1.0]});
    for (var i = 0; i < interpolated.length; i++) {
      this.columnas.push(new ColumnaRusa(interpolated[i],interpolated[i][1]).init(materialColumnas));
    }

    this.carrito = new Carrito().init();
    this.durmiente = new Durmiente().init();
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
    var pos = this.curve.generate((t*0.1)%1);
    var tnb = this.TNB((t*0.1)%1);

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
