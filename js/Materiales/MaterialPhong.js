var Loader = require('../textures/TextureLoader.js');
var vModule = require('../shaders/modules/vModule.js');
var fModule = require('../shaders/modules/fModule.js');
var ProgramBuilder = require('../program/ProgramBuilder.js');

module.exports = function(opciones){
  // Por el momento solo cambia la componente difusa.
  this.loader = new Loader();
  this.mapaDifuso = opciones.mapaDifuso;
  this.colorDifuso = opciones.colorDifuso;
  if (this.mapaDifuso){
    // Cargar módulo con textura difusa.
    // Carga la textura.
    this.texturaDifusa = this.loader.load(this.mapaDifuso);

  } else {
    if (this.colorDifuso) {
      // Cargar color con textura difusa.
    } else{
      console.error("Error, no hay ni color ni textura difusos.");
    }
  }

  // Creación del programa con los shaders. Por ahora está hardcodeado.
  var builder = new ProgramBuilder().init();
  builder.addVModule(vModule)
  builder.addFModule(fModule)
  builder.compile().listModules().debug();
  this.program = builder.getProgram();

  // Agrego este programa a la lista global de programas para cosas compartidas.
  global.programas.push(this.program);
}
