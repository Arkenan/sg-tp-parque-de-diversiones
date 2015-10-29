module.exports = function() {
  this.init = function(gl) {
    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment,[
      'varying highp vec4 vColor;',
      'void main(void) {',
        'gl_FragColor = vColor;',
      '}'
    ].join('\n'));
    gl.compileShader(fragment);

    console.log(fragment);
    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
        alert("Error compiling FragmentShader: " + gl.getShaderInfoLog(fragment));
        return null;
    }

    return fragment;
  }
}
