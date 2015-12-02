/* Este es el módulo que se carga cuando para la componente difusa hay un color */

module.exports = {
  name: 'colorDifuso',
  loaded: false,
  dependencies: [],
  variables: [
    'uniform vec4 uMaterialDiffuse;'
  ],
  logic:[
    'vec4 colorDifuso = uMaterialDiffuse;'
  ],
  execute: function(program){
    program.uMaterialDiffuse   = global.gl.getUniformLocation(program, "uMaterialDiffuse");
  }
}
