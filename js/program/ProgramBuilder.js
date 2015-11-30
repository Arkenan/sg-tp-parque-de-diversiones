module.exports = function () {

  //---------------------------------------------
  //-- * Inicializa los Shaders y el Programa
  //----------------------------------------------
  this.init = function(){
    this.program = global.gl.createProgram();
    this.vshader = global.gl.createShader(global.gl.VERTEX_SHADER);
    this.vshaderCode = ['void main(void) {','}'];
    this.fshader = global.gl.createShader(global.gl.FRAGMENT_SHADER);
    this.fshaderCode = ['void main(void) {','}'];
    this.success = false;
    this.needCompile = true;
    return this;
  }

  //---------------------------------------------
  //-- * Espera un modulo GLSL pare VertexShader
  //-- * Al agregar el modulo pide recompilar
  //----------------------------------------------
  this.addVModule = function(_module){
    for(var i = _module.variables.length - 1; i >= 0; i--){
    	this.vshaderCode.splice(0,0,_module.variables[i]);
    }
    for(var i = 0; i < _module.logic.length; i++){
      this.vshaderCode.splice(this.vshaderCode.length - 1,0,_module.logic[i]);
    }
    this.needCompile = true;
    return this;
  }

  //---------------------------------------------
  //-- * Espera un modulo GLSL pare FragmentShader
  //-- * Al agregar el modulo pide recompilar
  //----------------------------------------------
  this.addFModule = function(module){
    for(var i = _module.variables.length - 1; i >= 0; i--){
    	this.fshaderCode.splice(0,0,_module.variables[i]);
    }
    for(var i = 0; i < _module.logic.length; i++){
      this.fshaderCode.splice(this.fshaderCode.length - 1,0,_module.logic[i]);
    }
    this.needCompile = true;
    return this;
  }

  //------------------------------------------------------
  //-- * Compila los Shaders
  //-- * Luego los linkea al programa
  //-- * Si algo falla da una alerta y avisa por consola
  //------------------------------------------------------
  this.compile = function(){
    try{
          global.gl.shaderSource(this.vshader,this.vshaderCode.join('\n'));
          global.gl.compileShader(this.vshader);
          if(!global.gl.getShaderParameter(this.vshader, global.gl.COMPILE_STATUS)){
            throw "Error compiling VertexShader: " + global.gl.getShaderInfoLog(this.vshader);
          }
          global.gl.shaderSource(this.fshader,this.fshaderCode.join('\n'));
          global.gl.compileShader(this.fshader);
          if(!global.gl.getShaderParameter(this.fshader, global.gl.COMPILE_STATUS)){
            throw "Error compiling FragmentShader: " + global.gl.getShaderInfoLog(this.fshader);
          }

          global.gl.attachShader(this.program,this.vshader);
          global.gl.attachShader(this.program,this.fshader);
          global.gl.linkProgram(this.program);

          if(!global.gl.getProgramParameter(this.program, global.gl.LINK_STATUS)){
            throw "Error linking: " + global.gl.getProgramInfoLog(this.program);
          }

          global.gl.useProgram(this.program);
          this.success = true;

    }catch(error){
      console.error("Program compilation failed --> " + error + ".");
      alert("Program compilation failed --> " + error + ".");
      this.success = false;
    }finally{ return this; }
  }


  //------------------------------------------------------
  //-- * Sirve para debuguear los Shaders
  //-- * Imprime por consola el codigo de los Shaders
  //------------------------------------------------------
  this.debug = function() {
    console.log('VertexShader Code');
    console.log('---------------------');
    console.log(this.vshaderCode);
    console.log('FragmentShader Code');
    console.log('---------------------');
    console.log(this.fshaderCode);
    return this;
  }

  //---------------------------------------------
  //-- * Devuelve el programa
  //-- * Solo si compilo y lo hizo exitosamente
  //----------------------------------------------
  this.getProgram = function() {
    var theProgram = null;
    try{
          if(needCompile) throw 'Needs to be compiled';
          if(!success) throw 'Never compiled or compilation failed';
          theProgram = this.program;

    }catch(error){
      console.error("Couldn't get program --> " + error + ".");
      alert("Couldn't get program --> " + error + ".");
    }finally{return theProgram}
  }
}
