var Loader = require('../textures/TextureLoader.js');
var vModule = require('../shaders/modules/vModule.js');
var fModule = require('../shaders/modules/fModule.js');
var ProgramBuilder = require('../program/ProgramBuilder.js');
var mBasePhong = require('../shaders/modules/basePhong.js');
var mColorDifuso = require('../shaders/modules/colorDifuso.js');
var fTexDifusa = require('../shaders/modules/fTexDifusa.js');
var vTex = require('../shaders/modules/vTex.js')
module.exports = function(opciones){
  // Constructor del programa de shaders.
  var builder = new ProgramBuilder().init();

  // Por el momento solo cambia la componente difusa.
  this.mapaDifuso = opciones.mapaDifuso;
  this.colorDifuso = opciones.colorDifuso;
  if (this.mapaDifuso){
    // Carga la textura.
    this.loader = new Loader();
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

  builder.addFModule(mBasePhong);
  builder.compile().listModules().debug();
  this.program = builder.getProgram();
  // Agrego este programa a la lista global de programas para cosas compartidas.
  global.programas.push(this.program);

  // Acciones extra que requieran de datos locales. Por ahí se puede pasar esto al execute.
  if (this.mapaDifuso){
    /*// Registro 0 de textura. Hay que ver si esto funca para varios shaders... 
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texturaDifusa);
    gl.uniform1i(this.program.uSampler, 0);*/
  } else {
    if (this.colorDifuso){
      global.gl.uniform4fv(this.program.uMaterialDiffuse, this.colorDifuso);
    }
  }
}
