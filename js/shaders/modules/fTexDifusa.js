module.exports = {
  name: 'fTexDifusa',
  loaded: false,
  dependencies: [],
  variables: [
    'varying highp vec2 vTextureCoord;',
    'uniform sampler2D uSampler;'
  ],
  logic:[
    'vec4 colorDifuso = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));'
  ],
  execute: function(program){
    program.uSampler = global.gl.getUniformLocation(program, "uSampler");
  }
}
