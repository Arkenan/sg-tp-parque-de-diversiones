module.exports = function (_rows, _cols) {
  this.cols = _cols;
  this.rows = _rows;
  this.index_buffer = null;
  this.position_buffer = null;
  this.color_buffer = null;

  this.webgl_position_buffer = null;
  this.webgl_color_buffer = null;
  this.webgl_index_buffer = null;

  // Crea los puntos en orden.
  this.createGrid = function(){
    this.position_buffer = [];
    this.color_buffer = [];

    for (var y = 0.0; y < this.rows; y++){
      for (var x = 0.0; x < this.cols; x++){
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(0);

        this.color_buffer.push((x%2 + y%2)%2);
        this.color_buffer.push((x%2 + y%2)%2);
        this.color_buffer.push((x%2 + y%2)%2);
/*
        this.color_buffer.push(1.0/this.rows * y);
        this.color_buffer.push(0.2);
        this.color_buffer.push(1.0/this.cols * x); */
      }
    }
    console.log('[Grid] PositionBuffer --> ' + this.position_buffer);
    console.log('[Grid] ColorBuffer --> ' + this.color_buffer);
  }

  //Recorre las filas de izquierda a derecha y de derecha a izquierda según paridad.
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
    console.log('[Grid] IndexBuffer --> ' + this.index_buffer);
  }


  // Esta funci�n crea e incializa los buffers dentro del pipeline para luego
  // utlizarlos a la hora de renderizar.
  this.setupBuffers = function(gl){
    // 1. Creamos un buffer para las posicioens dentro del pipeline.
    this.webgl_position_buffer = gl.createBuffer();
    // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
    // hemos creado.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
    // 3. Cargamos datos de las posiciones en el buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

    // Repetimos los pasos 1. 2. y 3. para la informaci�n del color
    this.webgl_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);

    // Repetimos los pasos 1. 2. y 3. para la informaci�n de los �ndices
    // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
    // Notar tambi�n que se usa un array de enteros en lugar de floats.
    this.webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
  }

  this.init = function(gl){
    this.createGrid();
    this.createIndexBuffer();
    this.setupBuffers(gl);
    return this;
  }

  // Esta funci�n es la que se encarga de configurar todo lo necesario
  // para dibujar el VertexGrid.
  // En el caso del ejemplo puede observarse que la �ltima l�nea del m�todo
  // indica dibujar tri�ngulos utilizando los 6 �ndices cargados en el Index_Buffer.
  this.draw = function(gl,program){
    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    var vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    // Dibujamos.
    gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length ,gl.UNSIGNED_SHORT, 0);
  }
}
