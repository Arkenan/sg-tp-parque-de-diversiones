// Index.js. Archivo principal a ser ejecutado.
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./camaras/Camara.js");
var Parque = require("./Parque.js");
var Puntos = require("./curves/puntos.js");
var Domo = require('./models/domo/Domo.js');
//------------------------------------------------------------------------------------------------------------------------------
window.onload = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);
  global.programas = [];
  // Contador de texturas a pedidas y cargadas.
  global.texturas = 0;
  global.cargadas = 0;

  try{
    // Setup del contexto gl.
    global.gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
    global.gl.clearColor(0.2, 0.6, 1.0, 1.0);
    global.gl.enable(global.gl.DEPTH_TEST);
    global.gl.depthFunc(global.gl.LEQUAL);
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
    global.gl.viewport(0, 0, scene.width, scene.height);

    // Obtengo puntos para la montaña rusa y creo el parque.
    var puntosMRusa = new Puntos().puntosRusaPreparados;
    var parque = new Parque().init(puntosMRusa);

    // Matriz de vista y su versión de solo rotación.
    var mv = mat4.create(), vRot = mat3.create();
    // Matriz de proyección perspectiva.
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, scene.width/scene.height, 0.1, 300.0);

    // Pasamos al shader Matriz de perspectiva para todos los programas.
    for (var i in global.programas) {
      gl.useProgram(programas[i]);
      var u_proj_matrix = global.gl.getUniformLocation(programas[i], "uPMatrix");
      global.gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);
    }

    // Creación de la cámara.
    var cam = new Camara(parque.rusa.fBarrido, parque.rusa.TNB).init();

    // Tiempo.
    var t = 0.0;

    (function drawScene() {
      // Loopea el dibujado de la escena.
      requestAnimationFrame(drawScene);

      t += 0.01;
      global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);

      // Vista y su versión solo rotación.
      cam.viewM(mv, t);
      mat3.fromMat4(vRot, mv);

      // Pasamos a todos los shaders la rotación de la vista para ubicar la luz.
      for (var i in global.programas) {
        gl.useProgram(programas[i]);
        var u_view_matrix = global.gl.getUniformLocation(programas[i], "uVR");
        global.gl.uniformMatrix3fv(u_view_matrix, false, vRot);
      }

      // Dibujo del parque de diversiones.
      if (global.texturas == global.cargadas){
        parque.draw(mv,t);
      }
    })();

  } catch(e) {
    console.error(e);
  }
}
