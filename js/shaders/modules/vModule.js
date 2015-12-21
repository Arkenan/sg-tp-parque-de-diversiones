module.exports = {
  name: 'vModule',
  loaded: false,
  dependencies: [],
  variables: [
    'attribute vec3 aVertexPosition;',
    'attribute vec3 aVertexNormal;',

    'uniform mat4 uMVMatrix;',
    'uniform mat4 uPMatrix;',
    'uniform mat4 uNMatrix;',

    'varying vec3 vNormal;',
    'varying vec4 vPos;',
  ],
  logic:[
    // Posición transformada por ModelView, sin perspectiva.
    'vPos = uMVMatrix * vec4(aVertexPosition, 1.0);',

    // Normal transformada.
    'vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));',

    // Posición Final, aplico perspectiva.
    'gl_Position = uPMatrix * vPos;'
  ],
  execute: function(program){}
}
