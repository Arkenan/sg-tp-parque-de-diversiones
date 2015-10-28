function Plano(largo, ancho){
    this.position_buffer = [
        -1,-1,0,
        -1,1,0,
        1,1,0,
        1,-1,0
    ];
    this.normal_buffer = [
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1
    ];
    this.texture_coord_buffer = [
        0,0,
        0,1,
        1,1,
        1,0
    ];
    this.index_buffer = [0,1,2,2,3,0];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;

    this.texture = null;

    var h = handleLoadedTexture(this);
    this.initTexture = function(texture_file){

        this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = h;
        this.texture.image.src = texture_file;
    }

    // Creación e Inicialización de los buffers a nivel de OpenGL
    this.webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
    this.webgl_normal_buffer.itemSize = 3;
    this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

    this.webgl_texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
    this.webgl_texture_coord_buffer.itemSize = 2;
    this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

    this.webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
    this.webgl_position_buffer.itemSize = 3;
    this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

    this.webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
    this.webgl_index_buffer.itemSize = 1;
    this.webgl_index_buffer.numItems = this.index_buffer.length;
}

function drawScene() {

    // Ventana de dibujo del mismo tamaño que el canvas.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se configura la matriz de proyección perspectiva.
    mat4.perspective(30, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    // Se inicializan las variables asociadas con la iluminación
    var lighting = true;
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);
    var lightPosition = [0.0, 10.0, 0.0];
    mat4.multiplyVec3(CameraMatrix, lightPosition);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightPosition);

    /////////////////////////////////////////////////////
    // Definimos la ubicación de la camara
    // Pensamos por el momento sunamente la posición de la cámara, la cual siempre mira al sun.
    var matriz_camara = mat4.create();
    mat4.identity(CameraMatrix);
    mat4.translate(CameraMatrix, [0, 0, -60]);

    setViewProjectionMatrix();

}
