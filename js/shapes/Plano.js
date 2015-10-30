var Grid = require('./Grid.js');

module.exports = function(_rows,_cols){
  this.position_buffer = null;
  this.grid = null;
  this.rows = _rows;
  this.cols = _cols;

  this.init = function(gl){
    this.position_buffer = [];

    for (var y = 0.0; y < this.rows; y++){
      for (var x = 0.0; x < this.cols; x++){
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(0);

        //this.color_buffer.push((x%2 + y%2));
        //this.color_buffer.push((x%2 + y%2));
        //this.color_buffer.push((x%2 + y%2));
      }
    }

    this.grid = new Grid(this.position_buffer,this.rows,this.cols).init(gl);
    return this;
  }

  this.draw = function(gl, program){
    this.grid.draw(gl, program);
  }
}
