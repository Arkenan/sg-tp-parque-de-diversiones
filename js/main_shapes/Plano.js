// Plano en base a grilla. Estructura más sencilla.

var Grid = require('./Grid.js');

module.exports = function(_rows,_cols){
  this.rows = _rows;
  this.cols = _cols;

  this.init = function(gl, program){
    this.position_buffer = [];

    for (var y = 0.0; y < this.rows; y++){
      for (var x = 0.0; x < this.cols; x++){
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(0);
      }
    }

    this.grid = new Grid(this.position_buffer,this.rows,this.cols).init(gl, program);
    return this;
  }

  this.draw = function(mv){
    this.grid.draw(mv);
  }
}
