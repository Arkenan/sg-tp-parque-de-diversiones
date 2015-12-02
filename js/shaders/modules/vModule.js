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
    'varying vec3 vEyeVec;',

  ],
  logic:[
    //Transformed vertex position
    'vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);',

    //Transformed normal position
    'vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));',

    //Vector Eye
    'vEyeVec = -vec3(vertex.xyz);',
    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
  ],
  execute: function(program){}
}
