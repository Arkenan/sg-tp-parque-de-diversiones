// Index.js. Archivo principal a ser ejecutado.

//------------------------------------------------------------------------------------------------------------------------------
var VertexShader = require('./shaders/VertexShader.js');
var FragmentShader = require('./shaders/FragmentShader.js');
var Program = require('./program/Program.js');
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./camaras/Camara.js");
var Parque = require("./Parque.js");
var obtenerPuntos = require("./curves/puntos.js");
var Cilindro = require("./main_shapes/Cilindro.js");
var Domo = require('./models/domo/Domo.js');
//------------------------------------------------------------------------------------------------------------------------------
window.onload = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);

  try{
    // Setup del contexto gl.
    global.gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
    global.gl.clearColor(0.1, 0.1, 0.2, 1.0);
    global.gl.enable(global.gl.DEPTH_TEST);
    global.gl.depthFunc(global.gl.LEQUAL);
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
    global.gl.viewport(0, 0, scene.width, scene.height);

    // Creación del programa con los shaders.
    var vertex = new VertexShader().init();
    var fragment = new FragmentShader().init();
    var program  = new Program(vertex,fragment).init();

    // Obtengo puntos para la montaña rusa.
    var puntosMRusa = obtenerPuntos();
    var parque = new Parque().init(puntosMRusa, program);
    // Matriz de vista.
    var mv = mat4.create(), vRot = mat3.create();
    // Matriz de transformación de normales.
    var mn = mat4.create();
    // Matriz de proyección perspectiva.
    var pMatrix = mat4.create();

    // Por el momento saco la camara.
    // Creación de cámara. Por ahora le paso un moc de función y su derivada.
    //var cam = new Camara(parque.rusa.fBarrido, parque.rusa.TNB).init();
    // Tiempo.
    var t = 0.0;
    var eye = vec3.fromValues(0,0,5), center = vec3.fromValues(0,0,0),
    up = vec3.fromValues(0,1,0);

    //var cil = new Domo().init(program);

    var drawScene = function (){
      t += 0.01;
      global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);

      // Creamos y aplicamos Matriz de perspectiva.
      mat4.perspective(pMatrix, 45, scene.width/scene.height, 0.1, 100.0);
      var u_proj_matrix = global.gl.getUniformLocation(program, "uPMatrix");
      global.gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

      // Vista
      //cam.viewM(mv, t);

      mat4.lookAt(mv,eye,center,up);

      // Esta es la matriz de vista. Sacamos traslación y la pasamos al shader.
      mat3.fromMat4(vRot, mv);
      var u_view_matrix = global.gl.getUniformLocation(program, "uVR");
      global.gl.uniformMatrix3fv(u_view_matrix, false, vRot);

      mat4.rotate(mv,mv,t/2.0,[0,1,0]);
      mat4.translate(mv,mv,[0,0,-0.5]);
      //mat3.rotate(mn,mn,t,[0,1,0]);
      // Dibujo del parque de diversiones.
      parque.draw(mv,t);
      //cil.draw(mv);

    }
    setInterval(drawScene, 10);
  } catch(e) {
    console.log(e);
  }
}
