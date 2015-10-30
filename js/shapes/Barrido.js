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
      this.pForma.push(i*this.recForma);
    }

    for (var i = 0; i < cBarrido; i++){
      this.pBarrido.push(i*this.recBarrido);
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
    console.log("[Barrido] Vertices -->:" + this.vertices);
  }

  this.init = function(gl){
    // Ojo, cForma, cBarrido > 1.
    this.recForma = 1/(this.cForma - 1);
    this.recBarrido = 1/(this.cBarrido - 1);
    this.fijarPuntosEval();
    this.obtenerVertices();
    this.grid = new Grid(this.vertices,this.cForma,this.cBarrido).init(gl);
    return this;
  }

  this.draw = function(gl, program){
    this.grid.draw(gl, program);
  }

}
