//------------------------------------------------------------------------------------------------------------------------------
var VertexShader = require('./shaders/VertexShader.js');
var FragmentShader = require('./shaders/FragmentShader.js');
var Program = require('./program/Program.js');
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./Camara.js");
var Parque = require("./Parque.js");
var obtenerPuntos = require("./curves/puntos.js");
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

    // Obtengo puntos para la montaña rusa.
    var puntosMRusa = obtenerPuntos();
    var parque = new Parque().init(puntosMRusa, gl, program);
    // Matriz de vista.
    var mv = mat4.create();
    // Matriz de proyección perspectiva.
    var pMatrix = mat4.create();
    // Creación de cámara. Por ahora le paso un moc de función y su derivada.
    var cam = new Camara(parque.rusa.fBarrido).init();
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
      cam.viewM(mv, t);
      // Dibujo del parque de diversiones.
      parque.draw(mv,t);

    }
    setInterval(drawScene, 10);
  } catch(e) {
    console.log(e);
  }
}
