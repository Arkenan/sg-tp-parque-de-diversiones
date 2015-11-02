//------------------------------------------------------------------------------------------------------------------------------
var VertexShader = require('./shaders/VertexShader.js');
var FragmentShader = require('./shaders/FragmentShader.js');
var Program = require('./program/Program.js');
//------------------------------------------------------------------------------------------------------------------------------
//var Grid = require('./shapes/Grid.js');
var Plano = require('./shapes/Plano.js');
var Cilindro = require('./shapes/Cilindro.js')
//------------------------------------------------------------------------------------------------------------------------------
window.onload = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);

  try{
    var gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, scene.width, scene.height);
    console.log(gl);

    var vertex = new VertexShader().init(gl);
    var fragment = new FragmentShader().init(gl);
    var program  = new Program().init(gl,vertex,fragment);

    var cil = new Cilindro(30,4).init(gl);
    var plano = new Plano(2,3).init(gl);

    // Matrices de modelado de las figuras.
    var mvPlano = mat4.create();
    mat4.identity(mvPlano);
    mat4.translate(mvPlano, mvPlano, [0.0, 0.0, -5.0]);

    var mvCilindro = mat4.create();
    mat4.identity(mvCilindro);
    mat4.translate(mvCilindro, mvCilindro, [0.0, 0.0, -5.0]);

    //Matriz de proyección perspectiva.
    var pMatrix = mat4.create();
    var t = 0.0;

    var drawScene = function () {
      // Tiempo.
      t = t + 0.01;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Creamos y aplicamos Matriz de perspectiva.
      mat4.perspective(pMatrix, 45, scene.width/scene.height, 0.1, 100.0);
      var u_proj_matrix = gl.getUniformLocation(program, "uPMatrix");
      gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

      // Rotación del plano.
      mat4.rotate(mvPlano, mvPlano, 0.01, [0.0, 1.0, 0.0]);

      // Rotación del Cilindro.
      mat4.rotate(mvCilindro, mvCilindro, -0.01, [0.0, 1.0, 0.0]);

      cil.draw(gl,program,mvCilindro);
      plano.draw(gl,program, mvPlano);
    }
    setInterval(drawScene, 10);

  }catch(e){
    console.log(e);
  }
}
