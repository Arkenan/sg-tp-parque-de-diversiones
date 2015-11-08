var Grid = require('./Grid.js');

/* Recibe dos funciones, una de forma y otra de barrido, ambas
** toman elementos entre 0 y 1 y devuelven un punto en el espacio.
** además de la cantidad de divisiones de forma y de barrido. */

module.exports = function(fForma, fBarrido, cForma,  cBarrido){
  //Puntos de evaluación para la forma:
  this.pForma = [];
  this.pBarrido = [];
  this.vertices = [];
  this.grid = null;
  this.cForma = cForma;
  this.cBarrido = cBarrido;

  this.fijarPuntosEval = function(){
    for (var i = 0; i < cForma; i ++){
      this.pForma.push(i*this.pasoForma);
    }

    for (var i = 0; i < cBarrido; i++){
      this.pBarrido.push(i*this.pasoBarrido);
    }
  }

  this.obtenerVertices = function(){
    for (var i = 0; i < this.cBarrido; i++){
      for (var j = 0; j < this.cForma; j++){
        var v1 = fBarrido(this.pBarrido[i]);
        var v2 = fForma(this.pForma[j]);
        var v3 = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
        this.vertices = this.vertices.concat( v3 );
      }
    }
  }

  this.agregarTapas = function(){
    // Hago promedio entre los últimos y los primeros de las caras.
    var cantVertices = this.vertices.length / 3;
    var puntoInicial = this.promedio(this.vertices.slice(0,(cForma-1)*3));
    var puntoFinal = this.promedio(this.vertices.slice(cantVertices*3 - (cForma-1)*3 ,cantVertices*3));

    // Agrego cForma veces al inicial y al final (dos filas más de grilla).
    for (i = 0; i < cForma; i++){
        this.vertices = puntoInicial.concat(this.vertices);
        this.vertices = this.vertices.concat(puntoFinal);
    }
  }

  this.promedio = function(vertices){
      var acu = [0,0,0];
      var cantVertices = vertices.length / 3;
      for (i = 0; i < cantVertices; i ++){
          acu[0] += vertices[3*i];
          acu[1] += vertices[3*i+1];
          acu[2] += vertices[3*i+2];
      }
      acu[0] /= cantVertices;
      acu[1] /= cantVertices;
      acu[2] /= cantVertices;
      return acu;
  }

  this.init = function(gl, program){
    // Ojo, cForma, cBarrido > 1.
    this.pasoForma = 1/(this.cForma - 1);
    this.pasoBarrido = 1/(this.cBarrido - 1);
    this.fijarPuntosEval();
    this.obtenerVertices();
    this.agregarTapas();
    //console.log("[Barrido] Vertices -->:" + this.vertices);
    // Sumo 2 filas a la grilla, una por cada tapa.
    this.grid = new Grid(this.vertices,this.cBarrido + 2,this.cForma).init(gl, program);
    return this;
  }

  this.draw = function(mv){
    this.grid.draw(mv);
  }

}
