// Grilla de triángulos. Base de todos los dibujos.

module.exports = function (_vertices,_rows, _cols) {
  this.cols = _cols;
  this.rows = _rows;
  this.index_buffer = null;
  this.position_buffer = _vertices;
  this.color_buffer = null;
  this.normal_buffer = null;

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

  //indices have to be completely defined NO TRIANGLE_STRIP only TRIANGLES
  this.createNormalBuffer = function(vs, ind){
    var x=0,y=1,z=2;
    var ns = [];

    //for each vertex, initialize normal x, normal y, normal z
    for(var i=0;i<vs.length;i++){ ns[i]=0.0; }

    //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
    for(var i=0;i<ind.length;i=i+3){
      var v1 = [];
      var v2 = [];
      var normal = [];
      //p1 - p0
      v1[x] = vs[3*ind[i+1]+x] - vs[3*ind[i]+x];
      v1[y] = vs[3*ind[i+1]+y] - vs[3*ind[i]+y];
      v1[z] = vs[3*ind[i+1]+z] - vs[3*ind[i]+z];
      // p0 - p1
      v2[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
      v2[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
      v2[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];
      //cross product by Sarrus Rule
      normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
      normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
      normal[z] = v1[x]*v2[y] - v1[y]*v2[x];

      for(j=0;j<3;j++){ //update the normals of that triangle: sum of vectors
        ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
        ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
        ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
      }
    }

    //normalize the result
    for(var i=0;i<vs.length;i=i+3){ //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
      var nn=[];
      nn[x] = ns[i+x];
      nn[y] = ns[i+y];
      nn[z] = ns[i+z];

      var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
      if (len == 0) len = 0.00001;

      nn[x] = nn[x]/len;
      nn[y] = nn[y]/len;
      nn[z] = nn[z]/len;

      ns[i+x] = nn[x];
      ns[i+y] = nn[y];
      ns[i+z] = nn[z];
    }
    this.normal_buffer = ns;
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

    this.webgl_normal_buffer = global.gl.createBuffer();
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), global.gl.STATIC_DRAW);

  }

  this.init = function(program){
    this.program = program;
    this.createColorBuffer();
    this.createIndexBuffer();
    this.createNormalBuffer(this.position_buffer,this.index_buffer);
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

    var vertexNormalAttribute = global.gl.getAttribLocation(this.program, "aVertexNormal");
    global.gl.enableVertexAttribArray(vertexNormalAttribute);
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
    global.gl.vertexAttribPointer(vertexNormalAttribute, 3, global.gl.FLOAT, false, 0, 0);

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
