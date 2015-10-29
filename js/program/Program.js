module.exports = function () {
  this.init = function(gl,vertex,fragment){
    var program = gl.createProgram();
    gl.attachShader(program,vertex);
    gl.attachShader(program,fragment);
    gl.linkProgram(program);

    console.log(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " +
            gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);
    return program;
  }
}
