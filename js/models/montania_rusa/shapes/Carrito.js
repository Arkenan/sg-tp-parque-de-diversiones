var Cubo = require("../../../main_shapes/Cubo.js");
var SillaCarrito = require("../shapes/SillaCarrito.js");
var Plano = require("../../../main_shapes/Plano.js");

module.exports = function(){

  this.init = function(program){
    this.cubo = new Cubo().init(program);
    this.silla = new SillaCarrito().init(program);
    this.plano = new Plano(2,2).init(program);
    return this;
  }

  this.draw = function(mv){
    // Silla de atrás.
    var mSilla = mat4.create();
    mat4.translate(mSilla, mv, [0,0,-2.25]);
    this.silla.draw(mSilla);

    // Silla de adelante.
    var mSilla = mat4.create();
    mat4.translate(mSilla, mv, [0,0,-0.25]);
    this.silla.draw(mSilla);

    // Piso.
    var mPiso = mat4.create();
    mat4.translate(mPiso, mv, [-2.35,-1,-3.5]);
    mat4.rotate(mPiso, mPiso, Math.PI/2, [1,0,0]);
    mat4.scale(mPiso, mPiso, [4.7, 7, 1]);
    this.plano.draw(mPiso);

    // Izquierda.
    var mPared = mat4.create();
    mat4.translate(mPared, mv, [2.35, -1, 3.5]);
    mat4.rotate(mPared, mPared, Math.PI/2, [0,1,0]);
    mat4.scale(mPared, mPared, [7, 2, 1]);
    this.plano.draw(mPared);

    // Derecha.
    mat4.translate(mPared, mv, [-2.35, -1, 3.5]);
    mat4.rotate(mPared, mPared, Math.PI/2, [0,1,0]);
    mat4.scale(mPared, mPared, [7, 2, 1]);
    this.plano.draw(mPared);

    // Atrás
    mat4.translate(mPared, mv, [-2.35, -1, -3.5]);
    mat4.scale(mPared, mPared, [4.7, 2, 1]);
    this.plano.draw(mPared);

    // Adelante
    mat4.translate(mPared, mv, [-2.35, -1, 3.5]);
    mat4.scale(mPared, mPared, [4.7, 2, 1]);
    this.plano.draw(mPared);

    // Tapa
    var mTapa = mat4.create();
    mat4.translate(mTapa, mv, [-2.35,1,1]);
    mat4.rotate(mTapa, mTapa, Math.PI/2, [1,0,0]);
    mat4.scale(mTapa, mTapa, [4.7, 2.5, 1]);
    this.plano.draw(mTapa);
  }
}
