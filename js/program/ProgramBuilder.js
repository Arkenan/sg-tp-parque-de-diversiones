module.exports = function(options) {
  this.options = options | null;
  //---------------------------------------------
  //-- * Inicializa los Shaders y el Programa
  //----------------------------------------------
  this.init = function(){
    this.program = global.gl.createProgram();
    this.vshader = global.gl.createShader(global.gl.VERTEX_SHADER);
    this.vshaderCode = ['void main(void) {','}'];
    this.fshader = global.gl.createShader(global.gl.FRAGMENT_SHADER);
    this.fshaderCode = ['void main(void) {','}'];
    this.vModules = [];
    this.fModules = [];
    this.success = false;
    this.needCompile = true;
    return this;
  }

  //---------------------------------------------
  //-- * Espera un modulo GLSL para VertexShader
  //-- * Lo agrega a la lista de vModules
  //-- * Al agregar el vModule pide recompilar
  //----------------------------------------------
  this.addVModule = function(_module){
    this.vModules.push(_module);
    this.needCompile = true;
    return this;
  }

  //---------------------------------------------
  //-- * Espera un modulo GLSL pare FragmentShader
  //-- * Lo agrega a la lista de fModules
  //-- * Al agregar el fModule pide recompilar
  //----------------------------------------------
  this.addFModule = function(_module){
    this.fModules.push(_module);
    this.needCompile = true;
    return this;
  }

  //-------------------------------------------------
  //-- * Espera el nombre de un vModule
  //-- * Busca en vModules, un vModule con ese nombre
  //-- * Remueve dicho vModule
  //-- * Al remover el vModule pide recompilar
  //--------------------------------------------------
  this.removeVModule = function(module_name){
    for (var i = 0; i < this.vModules.length; i++) {
      if(this.vModules[i].name == module_name){
        this.vModules.splice(i,1);
      }
    }
    this.needCompile = true;
    return this;
  }

  //-------------------------------------------------
  //-- * Espera el nombre de un fModule
  //-- * Busca en fModules, un fModule con ese nombre
  //-- * Remueve dicho fModule
  //-- * Al remover el fModule pide recompilar
  //--------------------------------------------------
  this.removeFModule = function(module_name){
    for (var i = 0; i < this.fModules.length; i++) {
      if(this.fModules[i].name == module_name){
        this.fModules.splice(i,1);
      }
    }
    this.needCompile = true;
    return this;
  }

  //---------------------------------------------
  //-- * Lista los modulos de cada Shader
  //----------------------------------------------
  this.listModules = function () {
    for (var i = 0; i < this.vModules.length; i++) {
      console.log('VertexShader vModules --> ' + this.vModules[i].name);
    }
    for (var j = 0; j < this.fModules.length; j++) {
      console.log('FragmentShader fModules --> ' + this.fModules[j].name);
    }
    return this;
  }

  //------------------------------------------------------------------
  //-- * Agrega el codigo GLSL de cada modulo a los Shaders
  //-- * Compila los Shaders
  //-- * Linkea al programa
  //-- * Ejecuta la configuaracion de cada modulo sobre el programa
  //-- * Si algo falla da una alerta y avisa por consola
  //------------------------------------------------------------------
  this.compile = function(){
    try{
          for (var i = 0; i < this.vModules.length; i++) {
            for(var j = this.vModules[i].variables.length - 1; j >= 0; j--){
              this.vshaderCode.splice(0,0,this.vModules[i].variables[j]);
            }
            for(var k = 0; k < this.vModules[i].logic.length; k++){
              this.vshaderCode.splice(this.vshaderCode.length - 1,0,this.vModules[i].logic[k]);
            }
          }

          for (var i = 0; i < this.fModules.length; i++) {
            for(var j = this.fModules[i].variables.length - 1; j >= 0; j--){
              this.fshaderCode.splice(0,0,this.fModules[i].variables[j]);
            }
            for(var k = 0; k < this.fModules[i].logic.length; k++){
              this.fshaderCode.splice(this.fshaderCode.length - 1,0,this.fModules[i].logic[k]);
            }
          }

          global.gl.shaderSource(this.vshader,this.vshaderCode.join('\n'));
          global.gl.compileShader(this.vshader);
          if(!global.gl.getShaderParameter(this.vshader, global.gl.COMPILE_STATUS)){
            throw "Error compiling VertexShader: \n" + global.gl.getShaderInfoLog(this.vshader);
          }
          global.gl.shaderSource(this.fshader,this.fshaderCode.join('\n'));
          global.gl.compileShader(this.fshader);
          if(!global.gl.getShaderParameter(this.fshader, global.gl.COMPILE_STATUS)){
            throw "Error compiling FragmentShader: \n" + global.gl.getShaderInfoLog(this.fshader);
          }

          global.gl.attachShader(this.program,this.vshader);
          global.gl.attachShader(this.program,this.fshader);
          global.gl.linkProgram(this.program);

          if(!global.gl.getProgramParameter(this.program, global.gl.LINK_STATUS)){
            throw "Error linking: \n" + global.gl.getProgramInfoLog(this.program);
          }

          global.gl.useProgram(this.program);

          for(var i = 0; i < this.vModules.length; i++){
            this.vModules[i].execute(this.program);
          }

          for(var j = 0; j < this.fModules.length; j++){
            this.fModules[j].execute(this.program);
          }

          this.success = true;
          this.needCompile = false;

    }catch(error){
      console.error("Program compilation failed --> " + error + ".");
      alert("Program compilation failed --> " + error + ".");
      this.success = false;
      this.needCompile = false;
    }finally{ return this; }
  }


  //------------------------------------------------------
  //-- * Sirve para debuguear los Shaders
  //-- * Imprime por consola el codigo de los Shaders
  //------------------------------------------------------
  this.debug = function() {
    console.log('---------------------');
    console.log('VertexShader Code');
    console.log('---------------------');
    console.log(this.vshaderCode.join('\n'));
    console.log('---------------------');
    console.log('FragmentShader Code');
    console.log('---------------------');
    console.log(this.fshaderCode.join('\n'));
    return this;
  }

  //---------------------------------------------
  //-- * Devuelve el programa
  //-- * Solo si compilo y lo hizo exitosamente
  //----------------------------------------------
  this.getProgram = function() {
    var theProgram = null;
    try{
          if(this.needCompile) throw 'Needs to be compiled';
          if(!this.success) throw 'Compilation failed';
          theProgram = this.program;

    }catch(error){
      console.error("Couldn't get program --> " + error + ".");
      alert("Couldn't get program --> " + error + ".");
    }finally{return theProgram}
  }
}
