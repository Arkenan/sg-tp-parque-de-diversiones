//------------------------------------------------------------------------------------------------------------------------------
var VertexShader = require('./shaders/VertexShader.js');
var FragmentShader = require('./shaders/FragmentShader.js');
var Program = require('./program/Program.js');
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./Camara.js");
var Parque = require("./Parque.js");
//------------------------------------------------------------------------------------------------------------------------------
window.onload = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);

  try{
    // Setup del contexto gl.
    var gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, scene.width, scene.height);

    // Creación del programa con los shaders.
    var vertex = new VertexShader().init(gl);
    var fragment = new FragmentShader().init(gl);
    var program  = new Program(vertex,fragment).init(gl);

    // Creación de cámara.
    var pos = vec3.fromValues(0,0,40);
    var dir = vec3.fromValues(0,0,-1);
    var up = vec3.fromValues(0,1,0);
    var cam = new Camara(pos,dir,up).init();

    var parque = new Parque().init(gl, program);
    // Matriz de vista.
    var mv = mat4.create();
    // Matriz de proyección perspectiva.
    var pMatrix = mat4.create();
    // Tiempo.
    var t = 0.0;

    var drawScene = function (){
      t += 0.01;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Creamos y aplicamos Matriz de perspectiva.
      mat4.perspective(pMatrix, 45, scene.width/scene.height, 0.1, 100.0);
      var u_proj_matrix = gl.getUniformLocation(program, "uPMatrix");
      gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

      // Vista
      cam.viewM(mv);
      // Dibujo del parque de diversiones.
      parque.draw(mv,t);

    }
    setInterval(drawScene, 10);
  } catch(e) {
    console.log(e);
  }
}
