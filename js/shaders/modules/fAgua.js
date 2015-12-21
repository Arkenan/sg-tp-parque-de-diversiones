module.exports = {
  name: 'fAgua',
  loaded: false,
  dependencies: [],
  variables: [
    'uniform sampler2D uNormalSampler;',
    'uniform mat4 uNMatrix;',
    'uniform float t;',
  ],
  logic:[
    'vec2 uv = vec2(vTextureCoord.s, vTextureCoord.t + t/10.0);',
    'vec2 uv2 = vec2(vTextureCoord.s + t/10.0, vTextureCoord.t);',
    'vec4 Normal1 = texture2D(uNormalSampler, uv);', // uso las mismas coordenadas que la difusa.
    'vec4 Normal2 = texture2D(uNormalSampler, uv2);',

    'vec3 N1 = normalize(Normal1.rgb * 2.0 - 1.0);',
    'vec3 N2 = normalize(Normal2.rgb * 2.0 - 1.0);',
    'vec3 N = normalize(N1 + N2);',
    'N = normalize((uNMatrix * vec4(N, 1.0)).xyz);', // Le aplico la transformación de normales.
  ],
  execute: function(program){
    program.uNormalSampler = global.gl.getUniformLocation(program, "uNormalSampler");
    program.t = global.gl.getUniformLocation(program, "t");
  }
}
