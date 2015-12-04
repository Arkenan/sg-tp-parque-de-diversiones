module.exports = {
  name: 'vSkyBox',
  loaded: false,
  dependencies: [],
  variables: [
    'attribute vec3 aVertexPosition;',
    'uniform mat4 uMVMatrix;',
    'uniform mat4 uPMatrix;',
    'varying vec3 vCoords;'
  ],
  logic:[
    // Uso la posición como coordenadas para el cubo trasladadas al origen.
    'vCoords = aVertexPosition - vec3(0.0, 0.0, 0.5);',
    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);'
  ],
  execute: function(program){}
}
