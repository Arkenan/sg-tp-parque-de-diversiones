var Barrido = require("../../main_shapes/Barrido.js");
var CubicBezierConcatenator  = require("../../curves/CubicBezierConcatenator.js");
var Puntos = require('../../curves/puntos.js');
var MaterialPhong = require('../../Materiales/MaterialPhong.js');

module.exports = function(){

  var control = new Puntos().puntosPiletaPreparados;
  var forma = new CubicBezierConcatenator().init(control);

  this.fForma = function(t){
      return forma.generate(t);
  }

  this.fBarrido = function(t){
    return [0, t, 0];
  }

  this.materialAgua = new MaterialPhong({
    mapaRefleccion:"texturas/SB/",
    mapaDifuso:"texturas/water.jpg",
    mapaNormales:"texturas/waterNM.png",
    ks:1.5,
    shininess: 300,
    agua:true
    });

  this.init = function(){
    this.supB = new Barrido(this.fForma, this.fBarrido, 200, 40).init(this.materialAgua);
    return this;
  }

  this.draw = function(mv, t){
    // Le paso el tiempo a los shaders.
    global.gl.useProgram(this.materialAgua.program);
    global.gl.uniform1f(this.materialAgua.program.t, t);

    m = mat4.create();
    // Centrado al origen.
    mat4.translate(m,mv,[0,0,-0.5]);
    mat4.scale(m,m,[1,20,1]);

    this.supB.draw(m);
  }
}
