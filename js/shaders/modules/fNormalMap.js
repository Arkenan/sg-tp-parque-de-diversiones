module.exports = {
  name: 'fTexDifusa',
  loaded: false,
  dependencies: [],
  variables: [
    //'varying highp vec2 vTextureCoord;', // habría que ver si agregarla por si no está.
    'uniform sampler2D uNormalSampler;',
    'uniform mat4 uNMatrix;',
  ],
  logic:[
    'vec4 NormalMap = texture2D(uNormalSampler, vTextureCoord);', // uso las mismas coordenadas que la difusa.
    'vec3 N = normalize(NormalMap.rgb * 2.0 - 1.0);',
    'N = (uNMatrix * vec4(N, 1.0)).xyz;' // Le aplico la transformación de normales.
    //'float a = N.x; N.x = N.y; N.y = N.z; N.z = a;'
  ],
  execute: function(program){
    program.uNormalSampler = global.gl.getUniformLocation(program, "uNormalSampler");
  }
}
