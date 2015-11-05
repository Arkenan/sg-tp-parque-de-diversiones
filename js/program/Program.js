module.exports = function (vertex,fragment) {
  this.vshader = vertex;
  this.fshader = fragment;
  this.init = function(gl){
    var program = gl.createProgram();
    gl.attachShader(program,this.vshader);
    gl.attachShader(program,this.fshader);
    gl.linkProgram(program);

    console.log(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert("Unable to initialize the Program: " +
            gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);
    return program;
  }
}
