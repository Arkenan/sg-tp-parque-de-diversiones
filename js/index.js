// Index.js. Archivo principal a ser ejecutado.

//------------------------------------------------------------------------------------------------------------------------------
var MaterialPhong = require('./Materiales/MaterialPhong.js');
//------------------------------------------------------------------------------------------------------------------------------
var Camara = require("./camaras/Camara.js");
var Parque = require("./Parque.js");
var Puntos = require("./curves/puntos.js");
var Cilindro = require("./main_shapes/Cilindro.js");
var Domo = require('./models/domo/Domo.js');
var Cubo = require('./main_shapes/Cubo.js');
//------------------------------------------------------------------------------------------------------------------------------
window.onload = function(){
  var scene = document.createElement('canvas');
  scene.width = window.innerWidth;
  scene.height = window.innerHeight;
  document.body.appendChild(scene);
  global.programas = [];

  try{
    // Setup del contexto gl.
    global.gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
    global.gl.clearColor(0.1, 0.1, 0.2, 1.0);
    global.gl.enable(global.gl.DEPTH_TEST);
    global.gl.depthFunc(global.gl.LEQUAL);
    global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
    global.gl.viewport(0, 0, scene.width, scene.height);

    // Material.
    var material = new MaterialPhong({mapaDifuso:"js/textures/wood.jpg"});
    //var material = new MaterialPhong({colorDifuso:[1.0,1.0,0.5,1.0]});

    // Obtengo puntos para la montaña rusa y creo el parque.
    var puntosMRusa = new Puntos().puntosRusaPreparados;
    //var parque = new Parque().init(puntosMRusa, program);

    // Matriz de vista.
    var mv = mat4.create(), vRot = mat3.create();
    // Matriz de proyección perspectiva.
    var pMatrix = mat4.create();

    // Creamos y pasamos al shader Matriz de perspectiva para todos los programas.
    for (var i in global.programas) {
      mat4.perspective(pMatrix, 45, scene.width/scene.height, 0.1, 100.0);
      var u_proj_matrix = global.gl.getUniformLocation(programas[i], "uPMatrix");
      global.gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);
    }

    // Creación de la cámara.
    //var cam = new Camara(parque.rusa.fBarrido, parque.rusa.TNB).init();
    // Camara dummy.
    var rec = function(t){
      return [Math.cos(t),0,Math.sin(t)];
    }
    var TNB = function(t){
      var tg = [-Math.sin(t), 0, Math.cos(t)];
      var n = [0,1,0];
      var b = [-Math.cos(t), 0, -Math.sin(t)];
      return [tg, n, b];
    }
    var cam = new Camara(rec,TNB).init();
    // Tiempo.
    var t = 0.0;
    var cubo = new Cubo(2,2).init(material);

    (function drawScene() {
      requestAnimationFrame(drawScene);

      t += 0.01;
      global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);

      // Vista
      cam.viewM(mv, t);

      // Pasamos a todos los shaders la rotación de la vista para ubicar la luz.
      for (var i in global.programas) {
        mat3.fromMat4(vRot, mv);
        var u_view_matrix = global.gl.getUniformLocation(programas[i], "uVR");
        global.gl.uniformMatrix3fv(u_view_matrix, false, vRot);
      }

      // Dibujo del parque de diversiones.
      //parque.draw(mv,t);
      mat4.scale(mv,mv,[10,10,10]);
      cubo.draw(mv);
    })();

  } catch(e) {
    console.log(e);
  }
}
