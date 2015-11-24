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
    program.aVertexPosition    = gl.getAttribLocation(program, "aVertexPosition");
    program.aVertexNormal      = gl.getAttribLocation(program, "aVertexNormal");
    program.uPMatrix           = gl.getUniformLocation(program, "uPMatrix");
    program.uMVMatrix          = gl.getUniformLocation(program, "uMVMatrix");
    program.uNMatrix           = gl.getUniformLocation(program, "uNMatrix");
    program.uMaterialAmbient   = gl.getUniformLocation(program, "uMaterialAmbient");
    program.uMaterialDiffuse   = gl.getUniformLocation(program, "uMaterialDiffuse");
    program.uMaterialSpecular  = gl.getUniformLocation(program, "uMaterialSpecular");
    program.uShininess         = gl.getUniformLocation(program, "uShininess");
    program.uLightAmbient      = gl.getUniformLocation(program, "uLightAmbient");
    program.uLightDiffuse      = gl.getUniformLocation(program, "uLightDiffuse");
    program.uLightSpecular     = gl.getUniformLocation(program, "uLightSpecular");
    program.uLightDirection    = gl.getUniformLocation(program, "uLightDirection");

    gl.uniform3f(program.uLightDirection, 0.0, -1.0, -1.0);
    gl.uniform4fv(program.uLightAmbient, [0.03,0.03,0.03,1.0]);
    gl.uniform4fv(program.uLightDiffuse,  [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(program.uLightSpecular,  [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(program.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(program.uMaterialDiffuse, [0.5,0.8,0.1,1.0]);
    gl.uniform4fv(program.uMaterialSpecular,[1.0,1.0,1.0,1.0]);
    gl.uniform1f(program.uShininess, 230.0);

    return program;
  }
}
