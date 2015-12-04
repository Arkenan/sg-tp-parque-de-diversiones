// Grilla de triángulos. Base de todos los dibujos.

module.exports = function (vertices, normales, rows, cols) {
  this.cols = cols;
  this.rows = rows;
  this.index_buffer = null;
  this.position_buffer = vertices;
  this.color_buffer = null;
  this.normal_buffer = normales;

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
    //global.gl.useProgram(this.program);
    // 1. Creamos un buffer para las posiciones dentro del pipeline.
    this.webgl_position_buffer = global.gl.createBuffer();
    // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
    // hemos creado.
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_position_buffer);
    // 3. Cargamos datos de las posiciones en el buffer.
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), global.gl.STATIC_DRAW);

    if (!this.material.mapaNormales && !this.material.skyTex){
      // Carga de normales cuando no hay mapa para eso.
      this.webgl_normal_buffer = global.gl.createBuffer();
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
      global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), global.gl.STATIC_DRAW);
    }

    if (this.material.mapaDifuso || this.material.mapaNormales){
      // Coordenadas uv.
      this.webgl_uv_buffer = global.gl.createBuffer();
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_uv_buffer);
      global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.uvs), global.gl.STATIC_DRAW);
    }

    // Repetimos los pasos 1. 2. y 3. para la información de los índices
    // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
    // Notar tambi�n que se usa un array de enteros en lugar de floats.
    this.webgl_index_buffer = global.gl.createBuffer();
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    global.gl.bufferData(global.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), global.gl.STATIC_DRAW);

  }

  this.init = function(material, uvs){
    this.uvs = uvs;
    this.material = material;
    this.program = material.program;
    this.createIndexBuffer();
    this.setupBuffers();

    return this;
  }

  // Esta función es la que se encarga de configurar todo lo necesario
  // para dibujar el VertexGrid.
  this.draw = function(mv){
    // Cargamos los vértices en el shader.
    global.gl.useProgram(this.program);
    var vertexPositionAttribute = global.gl.getAttribLocation(this.program, "aVertexPosition");
    global.gl.enableVertexAttribArray(vertexPositionAttribute);
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_position_buffer);
    global.gl.vertexAttribPointer(vertexPositionAttribute, 3, global.gl.FLOAT, false, 0, 0);

    if (this.material.mapaDifuso || this.material.mapaNormales){
      // Cargamos coordenadas uvs en el shader.
      var textureCoordAttribute = global.gl.getAttribLocation(this.program, "aTextureCoord");
      global.gl.enableVertexAttribArray(textureCoordAttribute);
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_uv_buffer);
      global.gl.vertexAttribPointer(textureCoordAttribute, 2, global.gl.FLOAT, false, 0, 0);
    }

    if (this.material.mapaDifuso){
      // Cargamos textura
      global.gl.activeTexture(global.gl.TEXTURE0);
      global.gl.bindTexture(global.gl.TEXTURE_2D, this.material.texturaDifusa);
      global.gl.uniform1i(this.program.uSampler, 0);
    }

    if (this.material.mapaNormales){
      // Cargamos textura de normales.
      global.gl.activeTexture(global.gl.TEXTURE1);
      global.gl.bindTexture(global.gl.TEXTURE_2D, this.material.texturaNormales);
      global.gl.uniform1i(this.program.uNormalSampler, 1);
    } else {
      if (this.material.skyTex){
        // Cargamos textura del skybox.
        global.gl.activeTexture(global.gl.TEXTURE2);
        global.gl.bindTexture(global.gl.TEXTURE_CUBE_MAP, this.material.skyTex);
        global.gl.uniform1i(this.program.skybox, 2);
      } else {
        // Cargamos las normales en el shader.
        var vertexNormalAttribute = global.gl.getAttribLocation(this.program, "aVertexNormal");
        global.gl.enableVertexAttribArray(vertexNormalAttribute);
        global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        global.gl.vertexAttribPointer(vertexNormalAttribute, 3, global.gl.FLOAT, false, 0, 0);
      }
    }

    if (this.material.mapaRefleccion){
      global.gl.activeTexture(global.gl.TEXTURE3);
      global.gl.bindTexture(global.gl.TEXTURE_CUBE_MAP, this.material.texturaRefleccion);
      global.gl.uniform1i(this.program.skybox, 3);
    }

    // Se usa la matriz de modelado mv.
    var u_model_view_matrix = global.gl.getUniformLocation(this.program, "uMVMatrix");
    global.gl.uniformMatrix4fv(u_model_view_matrix, false, mv);

    // Matriz de transformación de normales mn.
    var mn = mat4.create();
    mat4.invert(mn, mv);
    mat4.transpose(mn,mn);
    var u_normal_matrix = global.gl.getUniformLocation(this.program, "uNMatrix")
    global.gl.uniformMatrix4fv(u_normal_matrix, false, mn);

    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    // Dibujamos.
    global.gl.drawElements(global.gl.TRIANGLE_STRIP, this.index_buffer.length ,global.gl.UNSIGNED_SHORT, 0);
  }
}
