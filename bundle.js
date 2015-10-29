/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//------------------------------------------------------------------------------------------------------------------------------
	var VertexShader = __webpack_require__(1);
	var FragmentShader = __webpack_require__(2);
	var Program = __webpack_require__(3);
	//------------------------------------------------------------------------------------------------------------------------------
	var Grid = __webpack_require__(4);
	//------------------------------------------------------------------------------------------------------------------------------
	window.onload = function(){
	  var scene = document.createElement('canvas');
	  scene.width = window.innerWidth;
	  scene.height = window.innerHeight;
	  document.body.appendChild(scene);

	  try{
	    var gl = scene.getContext('webgl') || scene.getContext('experimental-webgl');
	    //set the clear color
	    gl.clearColor(0.1, 0.1, 0.2, 1.0);
	    gl.enable(gl.DEPTH_TEST);
	    gl.depthFunc(gl.LEQUAL);
	    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	    gl.viewport(0, 0, scene.width, scene.height);
	    console.log(gl);

	    var vertex = new VertexShader().init(gl);
	    var fragment = new FragmentShader().init(gl);
	    var program  = new Program().init(gl,vertex,fragment);

	    var grid = new Grid(2,2).init(gl)

	    var mvMatrix = mat4.create();
	    var pMatrix = mat4.create();
	    var t = 0.0;

	    var drawScene = function () {
	      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	      var u_proj_matrix = gl.getUniformLocation(program, "uPMatrix");
	      // Preparamos una matriz de perspectiva.
	      mat4.perspective(pMatrix, 45, 640.0/480.0, 0.1, 100.0);
	      gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

	      var u_model_view_matrix = gl.getUniformLocation(program, "uMVMatrix");
	      // Preparamos una matriz de modelo+vista.
	      mat4.identity(mvMatrix);
	      mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -5.0]);
	      mat4.rotate(mvMatrix, mvMatrix, t, [0.0, 1.0, 0.0]);
	      t = t + 0.01;
	      //console.log(t);
	      gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);

	      grid.draw(gl,program);
	    }
	    setInterval(drawScene, 10);

	  }catch(e){
	    console.log(e);
	  }
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function () {
	  this.init = function(gl) {
	    var vertex = gl.createShader(gl.VERTEX_SHADER);
	    gl.shaderSource(vertex,[
	      'attribute vec3 aVertexPosition;',
	      'attribute vec3 aVertexColor;',
	      'uniform mat4 uMVMatrix;',
	      'uniform mat4 uPMatrix;',
	      'varying highp vec4 vColor;',
	      'void main(void){',
	          'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
	          'vColor = vec4(aVertexColor,1.0);',
	      '}'
	    ].join('\n'));
	    gl.compileShader(vertex);

	    console.log(vertex);
	    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
	        alert("Error compiling VertexShader: " + gl.getShaderInfoLog(vertex));
	        return null;
	    }

	    return vertex;
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function() {
	  this.init = function(gl) {
	    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
	    gl.shaderSource(fragment,[
	      'varying highp vec4 vColor;',
	      'void main(void) {',
	        'gl_FragColor = vColor;',
	      '}'
	    ].join('\n'));
	    gl.compileShader(fragment);

	    console.log(fragment);
	    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
	        alert("Error compiling FragmentShader: " + gl.getShaderInfoLog(fragment));
	        return null;
	    }

	    return fragment;
	  }
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function () {
	  this.init = function(gl,vertex,fragment){
	    var program = gl.createProgram();
	    gl.attachShader(program,vertex);
	    gl.attachShader(program,fragment);
	    gl.linkProgram(program);

	    console.log(program);
	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	      alert("Unable to initialize the shader program: " +
	            gl.getProgramInfoLog(program));
	      return null;
	    }

	    gl.useProgram(program);
	    return program;
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (_rows, _cols) {
	  this.cols = _cols;
	  this.rows = _rows;
	  this.index_buffer = null;
	  this.position_buffer = null;
	  this.color_buffer = null;

	  this.webgl_position_buffer = null;
	  this.webgl_color_buffer = null;
	  this.webgl_index_buffer = null;

	  this.createIndexBuffer = function(){
	    this.index_buffer = [0, 1, 2, 3];
	  }

	  // Esta funci�n inicializa el position_buffer y el color buffer de forma de
	  // crear un plano de color gris que se extiende sobre el plano XY, con Z=0
	  // El plano se genera centrado en el origen.
	  // El prop�sito de esta funci�n es a modo de ejemplo de como inicializar y cargar
	  // los buffers de las posiciones y el color para cada v�rtice.
	  this.createGrid = function(){
	    this.position_buffer = [];
	    this.color_buffer = [];

	    for (var i = 0.0; i < this.rows; i++) {
	      for (var j = 0.0; j < this.cols; j++) {
	        // Para cada v�rtice definimos su posici�n
	        // como coordenada (x, y, z=0)
	        this.position_buffer.push(i-(this.rows-1.0)/2.0);
	        this.position_buffer.push(j-(this.rows-1)/2.0);
	        this.position_buffer.push(0);

	        // Para cada v�rtice definimos su color
	        this.color_buffer.push(1.0/this.rows * i);
	        this.color_buffer.push(0.2);
	        this.color_buffer.push(1.0/this.cols * j);
	      }
	    }
	    console.log('[Grid] PositionBuffer --> ' + this.position_buffer);
	    console.log('[Grid] ColorBuffer --> ' + this.color_buffer)
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
	    gl.drawElements(gl.TRIANGLE_STRIP, 4,gl.UNSIGNED_SHORT, 0);
	  }
	}


/***/ }
/******/ ]);