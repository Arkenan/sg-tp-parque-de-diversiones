// Index.js. Archivo principal a ser ejecutado.
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./camaras/Camara.js");
var Parque = require("./Parque.js");
var Puntos = require("./curves/puntos.js");
var Domo = require('./models/domo/Domo.js');
//------------------------------------------------------------------------------------------------------------------------------

var inicio = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);
  global.programas = [];

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
    var mv = mat4.create(), vRot = mat3.create(), vRotInv = mat3.create();
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
      mat3.invert(vRotInv, vRot);

      // Pasamos a todos los shaders la rotación de la vista para ubicar la luz.
      for (var i in global.programas) {
        gl.useProgram(programas[i]);
        var u_view_matrix = global.gl.getUniformLocation(programas[i], "uVR");
        global.gl.uniformMatrix3fv(u_view_matrix, false, vRot);

        var u_view_inv = global.gl.getUniformLocation(programas[i], "uVRInv");
        global.gl.uniformMatrix3fv(u_view_inv, false, vRotInv);
      }

      // Dibujo del parque de diversiones.
        parque.draw(mv,t);
    })();

  } catch(e) {
    console.error(e);
  }
}

window.onload = function(){
  // Carga de imagenes.
  var urls = [
    "js/textures/wood.jpg",   "js/textures/grass.jpg",
    "js/textures/water.jpg",  "js/textures/plastic.jpg",
    "js/textures/cabeza.jpg", "js/textures/grassNM.jpg",
    "js/textures/SB/posx.jpg",    "js/textures/SB/negx.jpg",
    "js/textures/SB/posy.jpg",    "js/textures/SB/negy.jpg",
    "js/textures/SB/posz.jpg",    "js/textures/SB/negz.jpg",
    ];
  // Diccionario con las imagenes según sus paths.
  global.imgs = {};
  global.cargadas = 0;
  for (var i in urls){
    global.imgs[urls[i]] = new Image();
    global.imgs[urls[i]].onload = function(){
      global.cargadas++;
      if (global.cargadas == urls.length){
        console.log(global.cargadas);
        console.log(global.imgs);
        console.log("Las imágenes fueron todas cargadas.");
        inicio();
      }
    }
    global.imgs[urls[i]].src = urls[i];
  }
}
