/* Este es el módulo que se carga cuando para la componente difusa hay un color
** además de una componente obtenida de otro modo (ej, textura). */

module.exports = {
  name: 'colorExtra',
  loaded: false,
  dependencies: [],
  variables: [
    'uniform vec4 uMaterialDiffuse;'
  ],
  logic:[
    'colorDifuso *= uMaterialDiffuse;'
  ],
  execute: function(program){
    program.uMaterialDiffuse   = global.gl.getUniformLocation(program, "uMaterialDiffuse");
  }
}
