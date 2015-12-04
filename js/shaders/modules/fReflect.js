module.exports = {
  name: 'fReflect',
  loaded: false,
  dependencies: [],
  variables: [
    'uniform samplerCube uRefSampler;',
    'uniform mat3 uVRInv;'
    // Presupone que hay algo de normales cargado previamente.
  ],
  logic:[

    'vec3 dirRef = uVRInv * reflect(-vEyeVec, N);',

    'vec4 colorRef = textureCube(uRefSampler, dirRef);',

    'colorDifuso *= colorRef;'

  ],
  execute: function(program){
    program.uVRInv = global.gl.getUniformLocation(program, "uVRInv");
    program.uRefSampler = global.gl.getUniformLocation(program, "uRefSampler");
  }
}
