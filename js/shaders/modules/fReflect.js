module.exports = {
  name: 'fTexDifusa',
  loaded: false,
  dependencies: [],
  variables: [
    'uniform samplerCube skybox;',
    'uniform mat3 uVRInv;'
    // Presupone que hay algo de normales cargado previamente.
  ],
  logic:[
    'vec3 dirRef = uVRInv * reflect(-vEyeVec, N);',
    'vec4 colorRef = textureCube(skybox, dirRef);',
    'colorDifuso *= colorRef;'
  ],
  execute: function(program){
    program.uVRInv = global.gl.getUniformLocation(program, "uVRInv");
  }
}
