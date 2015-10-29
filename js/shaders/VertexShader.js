module.exports = function () {
  this.init = function(gl) {
    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex,[
      'attribute vec3 aVertexPosition;',
      'attribute vec3 aVertexColor;',
      'uniform mat4 uMVMatrix;',
      'uniform mat4 uPMatrix;',
      'varying highp vec4 vColor;',
      'void main(void){',
          'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
          'vColor = vec4(aVertexColor,1.0);',
      '}'
    ].join('\n'));
    gl.compileShader(vertex);

    console.log(vertex);
    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
        alert("Error compiling VertexShader: " + gl.getShaderInfoLog(vertex));
        return null;
    }

    return vertex;
  }
}
