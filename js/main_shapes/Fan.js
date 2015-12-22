// Grilla de triángulos. Base de todos los dibujos.

module.exports = function (vertices, normales, uvs) {
  this.vertices = vertices;
  this.normales = normales;
  this.uvs = uvs;

  // Recorre las filas de izquierda a derecha y de derecha a izquierda según paridad.
  this.createIndexBuffer = function() {
    this.indices = [];
    for (i = 0; i < this.vertices.length/3; i++) {
      this.indices.push(i);
    }
  }

  // Esta función crea e incializa los buffers dentro del pipeline para luego
  // utlizarlos a la hora de renderizar.
  this.setupBuffers = function(){
    global.gl.useProgram(this.program);
    // 1. Creamos un buffer para las posiciones dentro del pipeline.
    this.webgl_position_buffer = global.gl.createBuffer();
    // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
    // hemos creado.
    global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_position_buffer);
    // 3. Cargamos datos de las posiciones en el buffer.
    global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.vertices), global.gl.STATIC_DRAW);

    if (!this.material.mapaNormales && !this.material.esSkyBox){
      // Carga de normales cuando no hay mapa para eso.
      this.webgl_normal_buffer = global.gl.createBuffer();
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
      global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.normales), global.gl.STATIC_DRAW);
    }

    if (this.material.mapaDifuso || this.material.mapaNormales){
      // Coordenadas uv.
      this.webgl_uv_buffer = global.gl.createBuffer();
      global.gl.bindBuffer(global.gl.ARRAY_BUFFER, this.webgl_uv_buffer);
      global.gl.bufferData(global.gl.ARRAY_BUFFER, new Float32Array(this.uvs), global.gl.STATIC_DRAW);
    }

    // Repetimos los pasos 1. 2. y 3. para la información de los índices
    // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
    // Notar también que se usa un array de enteros en lugar de floats.
    this.webgl_index_buffer = global.gl.createBuffer();
    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    global.gl.bufferData(global.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), global.gl.STATIC_DRAW);

  }

  this.init = function(material){
    this.material = material;
    this.program = material.program;
    this.createIndexBuffer();
    this.setupBuffers();

    return this;
  }

  // Esta función es la que se encarga de configurar todo lo necesario
  // para dibujar el VertexGrid.
  this.draw = function(mv){
    global.gl.useProgram(this.program);

    // Se asignan unidades.
    if (this.material.mapaDifuso){
      global.gl.uniform1i(this.program.uSampler, 0);
    }
    if (this.material.mapaNormales){
      global.gl.uniform1i(this.program.uNormalSampler, 1);
    }
    if (this.material.esSkyBox){
      global.gl.uniform1i(this.program.skybox, 2);
    }
    if (this.material.mapaRefleccion){
      global.gl.uniform1i(this.program.uRefSampler, 3);
    }

    // Cargamos los vértices en el shader.
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
      // Cargamos textura.
      global.gl.activeTexture(global.gl.TEXTURE0);
      global.gl.bindTexture(global.gl.TEXTURE_2D, this.material.texturaDifusa);
    }

    if (this.material.mapaNormales){
      // Cargamos textura de normales.
      global.gl.activeTexture(global.gl.TEXTURE1);
      global.gl.bindTexture(global.gl.TEXTURE_2D, this.material.texturaNormales);
    } else {
      if (this.material.esSkyBox){
        // Cargamos textura del skybox.
        global.gl.activeTexture(global.gl.TEXTURE2);
        global.gl.bindTexture(global.gl.TEXTURE_CUBE_MAP, this.material.skyTex);
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
    }

    // Se usa la matriz de modelado mv.
    var u_model_view_matrix = global.gl.getUniformLocation(this.program, "uMVMatrix");
    global.gl.uniformMatrix4fv(u_model_view_matrix, false, mv);

    // Matriz de transformación de normales mn.
    var mn = mat4.create();
    mat4.invert(mn, mv);
    mat4.transpose(mn,mn);
    var u_normal_matrix = global.gl.getUniformLocation(this.program, "uNMatrix");
    global.gl.uniformMatrix4fv(u_normal_matrix, false, mn);

    global.gl.bindBuffer(global.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    // Dibujamos.
    global.gl.drawElements(global.gl.TRIANGLE_FAN, this.indices.length ,global.gl.UNSIGNED_SHORT, 0);
  }
}
