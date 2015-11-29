module.exports = function (vertex,fragment) {
  this.vshader = vertex;
  this.fshader = fragment;
  this.init = function(){
    var program = global.gl.createProgram();
    global.gl.attachShader(program,this.vshader);
    global.gl.attachShader(program,this.fshader);
    global.gl.linkProgram(program);

    console.log(program);
    if (!global.gl.getProgramParameter(program, global.gl.LINK_STATUS)) {
      alert("Unable to initialize the Program: " +
            global.gl.getProgramInfoLog(program));
      return null;
    }
    global.gl.useProgram(program);

    program.aVertexPosition    = global.gl.getAttribLocation(program, "aVertexPosition");
    program.aVertexNormal      = global.gl.getAttribLocation(program, "aVertexNormal");
    program.uPMatrix           = global.gl.getUniformLocation(program, "uPMatrix");
    program.uMVMatrix          = global.gl.getUniformLocation(program, "uMVMatrix");
    program.uNMatrix           = global.gl.getUniformLocation(program, "uNMatrix");
    program.uMaterialAmbient   = global.gl.getUniformLocation(program, "uMaterialAmbient");
    program.uMaterialDiffuse   = global.gl.getUniformLocation(program, "uMaterialDiffuse");
    program.uMaterialSpecular  = global.gl.getUniformLocation(program, "uMaterialSpecular");
    program.uShininess         = global.gl.getUniformLocation(program, "uShininess");
    program.uLightAmbient      = global.gl.getUniformLocation(program, "uLightAmbient");
    program.uLightDiffuse      = global.gl.getUniformLocation(program, "uLightDiffuse");
    program.uLightSpecular     = global.gl.getUniformLocation(program, "uLightSpecular");
    program.uLightDirection    = global.gl.getUniformLocation(program, "uLightDirection");

    global.gl.uniform3f(program.uLightDirection, 0.0, 0.0, 1.0);
    global.gl.uniform4fv(program.uLightAmbient, [0.01,0.01,0.01,1.0]);
    global.gl.uniform4fv(program.uLightDiffuse,  [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uLightSpecular,  [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uMaterialDiffuse, [0.5,0.8,0.1,1.0]);
    global.gl.uniform4fv(program.uMaterialSpecular, [1.0,1.0,1.0,1.0]);
    global.gl.uniform1f(program.uShininess, 230.0);

    return program;
  }
}
