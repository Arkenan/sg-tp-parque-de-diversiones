var Loader = require('../textures/TextureLoader.js');
var vModule = require('../shaders/modules/vModule.js');
var ProgramBuilder = require('../program/ProgramBuilder.js');
var mBasePhong = require('../shaders/modules/basePhong.js');
var mColorDifuso = require('../shaders/modules/colorDifuso.js');
var fTexDifusa = require('../shaders/modules/fTexDifusa.js');
var vTex = require('../shaders/modules/vTex.js');
var fNormal = require('../shaders/modules/fNormal.js');
var fReflect = require('../shaders/modules/fReflect.js');
var fNormalMap = require('../shaders/modules/fNormalMap.js');
var fColorExtra = require('../shaders/modules/fColorExtra.js');
var vAgua = require('../shaders/modules/vAgua.js');
var fAgua = require('../shaders/modules/fAgua.js');
var fEye = require('../shaders/modules/fEye.js');
var CubeLoader = require('../textures/CubeLoader.js');

module.exports = function(opciones){
  // Constructor del programa de shaders.
  var builder = new ProgramBuilder().init();

  // Por el momento solo cambia la componente difusa.
  this.mapaDifuso = opciones.mapaDifuso;
  this.colorDifuso = opciones.colorDifuso;
  this.mapaNormales = opciones.mapaNormales;
  this.mapaRefleccion = opciones.mapaRefleccion;
  this.shininess = opciones.shininess || 230.0;
  this.ks = opciones.ks || 1.0;
  this.agua = opciones.agua;
  this.loader = new Loader();

  // Para todos los casos se carga el eyeVec.
  builder.addFModule(fEye);
  
  if (this.mapaDifuso && this.colorDifuso){
    // Cargo la textura.
    this.texturaDifusa = this.loader.load(this.mapaDifuso);
    // Cargo módulos.
    builder.addVModule(vTex);
    builder.addVModule(vModule);
    builder.addFModule(fTexDifusa);
    builder.addFModule(fColorExtra);
  } else {
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
  }

  // Pasada la parte difusa, entra la parte de las normales.
  if (this.mapaNormales){
      this.texturaNormales = this.loader.load(this.mapaNormales);
    if (this.agua){
      // Añado el módulo de normales del agua.
      builder.addFModule(fAgua);
    } else {
      // Cargo módulo de normales difusas.
      builder.addFModule(fNormalMap);
    }
  } else {
    builder.addFModule(fNormal);
  }

  // Terminado normales, se pasa a la reflección.
  if (this.mapaRefleccion){
    // Cargo skybox como textura de reflección.
    this.texturaRefleccion = CubeLoader(this.mapaRefleccion);
    builder.addFModule(fReflect);
  }

  // Se carga la base del modelo de Phong, común para todos los casos.
  builder.addFModule(mBasePhong);
  //builder.compile().listModules().debug();
  builder.compile();
  if (this.agua) {
    builder.listModules().debug();
  }
  this.program = builder.getProgram();
  // Agrego este programa a la lista global de programas para cosas compartidas.
  global.programas.push(this.program);

  // Acciones extra que requieran de datos locales. Por ahí se puede pasar esto al execute.
  if (this.colorDifuso){
    global.gl.uniform4fv(this.program.uMaterialDiffuse, this.colorDifuso);
  }
  // Para cualquier caso, configuro shininess.
  global.gl.uniform1f(this.program.uShininess, this.shininess);
  global.gl.uniform1f(this.program.uKs, this.ks);
}
