var Grid = require('./Grid.js');

/* Recibe dos funciones, una de forma y otra de barrido, ambas
** toman un parámetro entre 0 y 1 y devuelven un punto en el espacio.
** También toma la cantidad de divisiones de forma y de barrido. */

module.exports = function(fForma, fBarrido, cForma,  cBarrido){
  // Puntos de evaluación para la forma.
  this.pForma = [];
  // Puntos de evaluación para el barrido.
  this.pBarrido = [];
  // Vertices que se pasarán a la grilla para ser dibujados.
  this.vertices = [];
  this.normales = [];
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

        // Vertices
        var v1 = fBarrido(this.pBarrido[i]);
        var v2 = fForma(this.pForma[j]);
        var v3 = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
        this.vertices = this.vertices.concat(v3);

        // Normales. Son siempre los vértices de la forma.
        this.normales = this.normales.concat(v2);
      }
    }
  }

  this.agregarTapas = function(){
    // Hago promedio entre los últimos y los primeros de las caras.
    var cantVertices = this.vertices.length / 3;
    var puntoInicial = this.promedio(this.vertices.slice(0,(cForma-1)*3));
    var puntoFinal = this.promedio(this.vertices.slice(cantVertices*3 - (cForma-1)*3 ,cantVertices*3));

    // Repetimos una vez los bordes para no caer en redondeos. 2 filas más.
    this.vertices = this.vertices.slice(0,3*cForma).concat(this.vertices);
    var n = this.vertices.length;
    this.vertices = this.vertices.concat(this.vertices.slice(n-3*cForma, n));

    // Agrego cForma veces al inicial y al final (dos filas más de grilla).
    for (var i = 0; i < cForma; i++){
        this.vertices = puntoInicial.concat(this.vertices);
        this.vertices = this.vertices.concat(puntoFinal);
    }

    for (var i = 0; i < 2*cForma; i++){
        this.normales = [0,0,-1].concat(this.normales);
        this.normales = this.normales.concat([0,0,1]);
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

  this.init = function(program){
    // Importante: cForma, cBarrido > 1.
    this.pasoForma = 1/(this.cForma - 1);
    this.pasoBarrido = 1/(this.cBarrido - 1);
    this.fijarPuntosEval();
    this.obtenerVertices();
    this.agregarTapas();
    // Sumo 2 filas a la grilla, una por cada tapa.
    this.grid = new Grid(this.vertices, this.normales, this.cBarrido + 4, this.cForma).init(program);
    return this;
  }

  this.draw = function(mv){
    this.grid.draw(mv);
  }

}
