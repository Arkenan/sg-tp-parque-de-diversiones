module.exports = {
  name: 'fSkyBox',
  loaded: false,
  dependencies: [],
  variables: [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    'varying vec3 vCoords;',
    'uniform samplerCube skybox;'
  ],
  logic:[
    // Directamente el color es el de la textura.
    'gl_FragColor = textureCube(skybox, vCoords);'
    //'gl_FragColor = vec4(vCoords, 1.0);'
  ],
  execute: function(program){
    program.skybox = global.gl.getUniformLocation(program, "skybox");
  }
}
