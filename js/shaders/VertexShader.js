module.exports = function () {
  this.init = function() {
    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex,[
      'attribute vec3 aVertexPosition;',
      'attribute vec3 aVertexNormal;',

      'uniform mat4 uMVMatrix;',
      'uniform mat4 uPMatrix;',
      'uniform mat4 uNMatrix;',

      'varying vec3 vNormal;',
      'varying vec3 vEyeVec;',

      'void main(void){',
        //Transformed vertex position
        'vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);',

        //Transformed normal position
        'vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));',

        //Vector Eye
        'vEyeVec = -vec3(vertex.xyz);',
        'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
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
