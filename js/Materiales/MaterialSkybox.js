var CubeLoader = require('../textures/CubeLoader.js');
var ProgramBuilder = require('../program/ProgramBuilder.js');
var vSkyBox = require('../shaders/modules/vSkyBox.js');
var fSkyBox = require('../shaders/modules/fSkyBox.js');


module.exports = function(path){
  this.skyTex = CubeLoader(path);
  var builder = new ProgramBuilder().init();
  builder.addVModule(vSkyBox);
  builder.addFModule(fSkyBox);
  //builder.compile().listModules().debug();
  builder.compile();
  this.program = builder.getProgram();
  global.programas.push(this.program);

}
