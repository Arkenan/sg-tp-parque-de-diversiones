/* Plano simple (de una cara) en base a la grilla. Figura más simple. Este es
** el que antes era el Plano.js. Por una cuestión de normales fue necseario
** crear un plano doble que sea iluminado de ambos lados. */

var Grid = require('./Grid.js');

module.exports = function(_rows,_cols){
  this.rows = _rows;
  this.cols = _cols;

  this.init = function(program){
    this.vertices = [];
    this.normales = [];
    for (var y = 0.0; y < this.rows; y++){
      for (var x = 0.0; x < this.cols; x++){
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(0);

        this.normales.push(0);
        this.normales.push(0);
        this.normales.push(1);
      }
    }

    this.grid = new Grid(this.vertices, this.normales, this.rows, this.cols).init(program);
    return this;
  }

  this.draw = function(mv){
    this.grid.draw(mv);
  }
}