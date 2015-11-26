// Grilla de triángulos. Base de todos los dibujos.

module.exports = function (_vertices,_rows, _cols) {
  this.cols = _cols;
  this.rows = _rows;
  this.index_buffer = null;
  this.position_buffer = _vertices;
  this.color_buffer = null;

  // Asigna colores según la columna. Esto cambiará en el tp2, con las texturas.
  this.createColorBuffer = function(){
    this.color_buffer = [];

    for (var y = 0.0; y < this.rows; y++){
      for (var x = 0.0; x < this.cols; x++){
        this.color_buffer.push(1-y/(this.rows-1));
        this.color_buffer.push(0);
        this.color_buffer.push(y/(this.rows-1));
      }
    }
  }

  // Recorre las filas de izquierda a derecha y de derecha a izquierda según paridad.
  this.createIndexBuffer = function() {
    this.index_buffer = [];
    for (var row = 0; row < this.rows - 1; row++){
      //recorrido según paridad de la fila.
      var sg = (row % 2);

      var inc = 1 - 2*sg;
      var inicio = (this.cols - 1)*(sg);
      var fin = this.cols*(1-sg) - sg;

      for (var col = inicio; col != fin; col += inc){
        this.index_buffer.push(this.cols*row + col);
        this.index_buffer.push(this.cols*(row+1) + col);
      }
    }
  }


  // Esta función crea e incializa los buffers dentro del pipeline para luego
  // utlizarlos a la hora de renderizar.
  this.setupBuffers = function(){
    // 1. Creamos un buffer para las posiciones dentro del pipeline.
    this.webgl_position_buffer = global.gl.createBuffer();
    // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
    // hemos creado.
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_position_buffer);
    // 3. Cargamos datos de las posiciones en el buffer.
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), global.gl.STATIC_DRAW);

    // Repetimos los pasos 1. 2. y 3. para la información del color
    this.webgl_color_buffer = global.gl.createBuffer();
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_color_buffer);
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), global.gl.STATIC_DRAW);

    // Repetimos los pasos 1. 2. y 3. para la información de los índices
    // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
    // Notar tambi�n que se usa un array de enteros en lugar de floats.
    this.webgl_index_buffer = global.gl.createBuffer();
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    global.gl.bufferData(global.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), global.gl.STATIC_DRAW);
  }

  this.init = function(program){
    this.program = program;
    this.createColorBuffer();
    this.createIndexBuffer();
    this.setupBuffers();

    return this;
  }

  // Esta función es la que se encarga de configurar todo lo necesario
  // para dibujar el VertexGrid.
  this.draw = function(mv){
    var vertexPositionAttribute = global.gl.getAttribLocation(this.program, "aVertexPosition");
    global.gl.enableVertexAttribArray(vertexPositionAttribute);
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_position_buffer);
    global.gl.vertexAttribPointer(vertexPositionAttribute, 3, global.gl.FLOAT, false, 0, 0);

    var vertexColorAttribute = global.gl.getAttribLocation(this.program, "aVertexColor");
    global.gl.enableVertexAttribArray(vertexColorAttribute);
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_color_buffer);
    global.gl.vertexAttribPointer(vertexColorAttribute, 3, global.gl.FLOAT, false, 0, 0);

    // Se usa la matriz de modelado mv.
    var u_model_view_matrix = global.gl.getUniformLocation(this.program, "uMVMatrix");
    global.gl.uniformMatrix4fv(u_model_view_matrix, false, mv);

    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    // Dibujamos.
    global.gl.drawElements(global.gl.TRIANGLE_STRIP, this.index_buffer.length ,global.gl.UNSIGNED_SHORT, 0);
  }
}
