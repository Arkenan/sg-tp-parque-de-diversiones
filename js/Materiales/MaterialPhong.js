var Loader = require('../textures/TextureLoader.js');
var vModule = require('../shaders/modules/vModule.js');
var ProgramBuilder = require('../program/ProgramBuilder.js');
var mBasePhong = require('../shaders/modules/basePhong.js');
var mColorDifuso = require('../shaders/modules/colorDifuso.js');
var fTexDifusa = require('../shaders/modules/fTexDifusa.js');
var vTex = require('../shaders/modules/vTex.js');
var fNormal = require('../shaders/modules/fNormal.js');
var fNormalMap = require('../shaders/modules/fNormalMap.js');

module.exports = function(opciones){
  // Constructor del programa de shaders.
  var builder = new ProgramBuilder().init();

  // Por el momento solo cambia la componente difusa.
  this.mapaDifuso = opciones.mapaDifuso;
  this.colorDifuso = opciones.colorDifuso;
  this.mapaNormales = opciones.mapaNormales;
  this.loader = new Loader();

  if (this.mapaDifuso){
    // Carga la textura.
    this.texturaDifusa = this.loader.load(this.mapaDifuso);
    // Cargar módulos con textura difusa.
    builder.addVModule(vTex);
    builder.addVModule(vModule);
    builder.addFModule(fTexDifusa);
  } else {
    if (this.colorDifuso) {
      // Carga módulo de color constante.
      builder.addVModule(vModule);
      builder.addFModule(mColorDifuso);
      // Carga el color en el programa.
    } else{
      console.error("Error, no hay ni color ni textura difusos.");
    }
  }

  // Pasada la parte difusa, entra la parte de las normales.
  if (this.mapaNormales){
    // Cargo la textura.
    this.texturaNormales = this.loader.load(this.mapaNormales);
    // Cargo módulo de normales difusas.
    builder.addFModule(fNormalMap);
  } else {
    builder.addFModule(fNormal);
  }

  // Se carga la base del modelo de Phong, común para todos los casos.
  builder.addFModule(mBasePhong);
  builder.compile().listModules().debug();
  this.program = builder.getProgram();
  // Agrego este programa a la lista global de programas para cosas compartidas.
  global.programas.push(this.program);

  // Acciones extra que requieran de datos locales. Por ahí se puede pasar esto al execute.
  if (this.colorDifuso){
    global.gl.uniform4fv(this.program.uMaterialDiffuse, this.colorDifuso);
  }
}
