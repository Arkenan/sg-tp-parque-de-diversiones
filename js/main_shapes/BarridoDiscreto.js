var Grid = require('./Grid.js');

/* Recibe los puntos de la forma en xy y una función de barrido, que toma un
** parámetro entre 0 y 1. También toma la cantidad de divisiones de barrido. */

module.exports = function(puntosForma, fBarrido, cBarrido){
  // Vértices de la forma.
  this.pForma = puntosForma;
  this.cForma = puntosForma.length/3;
  // Puntos de evaluación para el barrido.
  this.pBarrido = [];
  // Vertices que se pasarán a la grilla para ser dibujados.
  this.vertices = [];
  this.normales = [];
  this.cBarrido = cBarrido;

  this.fijarPuntosEval = function(){
    for (var i = 0; i < cBarrido; i++){
      this.pBarrido.push(i*this.pasoBarrido);
    }
  }

  this.obtenerVertices = function(){
    // antes que nada repito los vértices del perfil (menos el primero y el último).
    for (var i = 3; i < this.pForma.length - 4; i+= 6){
      this.pForma.splice(i+3, 0, this.pForma[i], this.pForma[i+1], this.pForma[i+2]);
    }
    this.cForma = this.pForma.length/3;

    var v1, v2, v3;
    for (var i = 0; i < this.cBarrido; i++){
      v1 = fBarrido(this.pBarrido[i]);
      for (var j = 0; j < this.cForma; j++){
        // Vertices
        v2 = [this.pForma[3*j], this.pForma[3*j + 1], this.pForma[3*j + 2]];
        v3 = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
        this.vertices = this.vertices.concat(v3);
      }
    }
  }
  // Normales a las caras de los costados (no las tapas).
  this.obtenerNormales = function(){
    var v1, v2, v3, v4 = vec3.create(), v5 = vec3.create(), normal = vec3.create();
    for (var i = 0; i < this.cBarrido - 1; i++){
      var off = i*3*(this.cBarrido - 1);
      for (var j = 0; j < this.cForma - 1; j += 2){
        // Esto seguro se puede hacer más prolijo!
        v1 = [this.vertices[3*j + off], this.vertices[3*j + 1 + off], this.vertices[3*j + 2 + off]];
        v2 = [this.vertices[3*(j+1) + off], this.vertices[3*(j+1) + 1 + off], this.vertices[3*(j+1) + 2 + off]];
        v3 = [this.vertices[3*j + off + 3*this.cForma], this.vertices[3*j + 1 + off + 3*this.cForma], this.vertices[3*j + 2 + off+ 3*this.cForma]];

        vec3.subtract(v4, v2, v1);
        vec3.subtract(v5, v3, v1);
        vec3.cross(normal, v4, v5);

        // agrego normal para los 2 puntos de abajo. Al final de la forma repito
        for (var k = 0; k < 2; k++){
          this.normales.push(normal[0]);
          this.normales.push(normal[1]);
          this.normales.push(normal[2]);
        }
      }
    }
    // Terminada la última vuelta, copio la última capa.
    this.normales = this.normales.concat(this.normales.slice(this.normales.length - this.cForma*3, this.normales.length));
  }

  this.agregarTapas = function(){
    // Hago promedio entre los últimos y los primeros de las caras.
    var cantVertices = this.vertices.length / 3;
    var puntoInicial = this.promedio(this.vertices.slice(0,(this.cForma-1)*3));
    var puntoFinal = this.promedio(this.vertices.slice(cantVertices*3 - (this.cForma-1)*3 ,cantVertices*3));

    // Repetimos una vez los bordes para no caer en redondeos. 2 filas más.
    this.vertices = this.vertices.slice(0,3*this.cForma).concat(this.vertices);
    var n = this.vertices.length;
    this.vertices = this.vertices.concat(this.vertices.slice(n-3*this.cForma, n));

    // Agrego cForma veces al inicial y al final (dos filas más de grilla).
    for (var i = 0; i < this.cForma; i++){
        this.vertices = puntoInicial.concat(this.vertices);
        this.vertices = this.vertices.concat(puntoFinal);
    }

    for (var i = 0; i < 2*this.cForma; i++){
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
    this.pasoBarrido = 1/(this.cBarrido - 1);
    this.fijarPuntosEval();
    this.obtenerVertices();
    this.obtenerNormales();
    this.agregarTapas();
    // Sumo 2 filas a la grilla, una por cada tapa.
    this.grid = new Grid(this.vertices, this.normales, this.cBarrido + 4, this.cForma).init(program);
    return this;
  }

  this.draw = function(mv){
    this.grid.draw(mv);
  }

}
