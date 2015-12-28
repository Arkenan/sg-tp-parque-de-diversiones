var Grid = require('./Grid.js');
var Fan = require('./Fan.js');
/* Esta función es una extrusión simple. Para barridos con movimientos más
** complejos, utilizar BarridoGeneral. */

/* Recibe una función de forma, que puede no tener la derivada como un atributo.
** y su dominio es [0,1]. Se hace una extrusión de la forma en [0,1] con la
** dirección pasada por parámetro.*/

module.exports = function(fForma, dirBarrido, cForma, cBarrido){
  // Importante: cForma, cBarrido > 1.

  this.cForma = cForma;
  this.cBarrido = cBarrido;
  this.pasoForma = 1/(cForma - 1);
  this.pasoBarrido = 1/(cBarrido - 1);
  this.dir = vec3.create();
  vec3.normalize(this.dir, dirBarrido);

  // Se evaluan los vértices de la forma
  this.vForma = [];
  for (i = 0; i < cForma; i++){
    this.vForma = this.vForma.concat(fForma(i*this.pasoForma));
  }

  this.calcularNormalesForma = function(){
    this.normalesForma = [];
    // En el caso de que se provea una función tangente se calculan exactamente.
    if (fForma.d){
      var tan, n;
      for (i = 0; i < cForma; i++){
        // Esto presupone recorrido horario (!). TODO: Cambiarlo en la pileta.
        n = vec3.create();
        tan = fForma.d(i*this.pasoForma);
        vec3.cross(n, this.dir, tan);
        vec3.normalize(n, n);
        this.normalesForma.push(n[0]);
        this.normalesForma.push(n[1]);
        this.normalesForma.push(n[2]);
      }
    } else {
      // En otro caso, se aproximan con las de un círculo.
      this.normalesForma = this.vForma.slice();
    }
  }

  // Obtiene vértices, normales y uvs del lado (forma desplazada).
  this.datosLado = function(){
    this.verticesLado = [];
    this.normalesLado = [];
    this.uvsLado = [];
    var v1, v2 = vec3.create(), v3 = vec3.create();

    for (var i = 0; i < this.cBarrido; i++){
      // Para cada vuelta añadimos repetimos las normales.
      this.normalesLado = this.normalesLado.concat(this.normalesForma);
      for (var j = 0; j < this.cForma; j++){

        // Vertices.
        v1 = [this.vForma[3*j], this.vForma[3*j+1], this.vForma[3*j+2]];
        vec3.scale(v2, this.dir, i*this.pasoBarrido);
        vec3.add(v3,v1,v2);
        this.verticesLado.push(v3[0]);
        this.verticesLado.push(v3[1]);
        this.verticesLado.push(v3[2]);

        // UVS. TODO: agregar una normalización dependiente del tamaño.
        // Por ahora le agrego como u la forma y como v el barrido.
        this.uvsLado.push(j);
        this.uvsLado.push(i);
      }
    }
  }

  // Esto por ahí puede ir afuera por si lo necesita algún otro.
  var repetir = function(array, veces){
    var res = [];
    n = array.length;
    for (i = 0; i < n * veces; i++){
      res.push(array[i%n]);
    }
    return res;
  }

  var promedio = function(vertices){
    var acu = [0,0,0];
    var cantVertices = vertices.length / 3;
    for (i = 0; i < cantVertices; i ++){
      acu[0] += vertices[3*i];
      acu[1] += vertices[3*i+1];
      acu[2] += vertices[3*i+2];
    }
    acu[0] /= cantVertices;
    acu[1] /= cantVertices;
    acu[2] /= cantVertices;
    return acu;
  }

  // saca z y x como u y v para cada vértice (para las tapas).
  var extraerUVs = function(vertices){
    var res = [];
    for (var i = 0; i < vertices.length/3; i++){
      var vertice = [
       vertices[3*i],
       vertices[3*i + 1],
       vertices[3*i + 2]
      ];

      var u = vertice[2];
      var v = vertice[0];
      res.push(u);
      res.push(v);
    }
    return res;
  }

  this.agregarTapas = function(){
    // Hago promedio entre los últimos y los primeros de las caras. TODO: agregar opción de centro.
    this.verticesBase = this.vForma.slice();
    var n = this.verticesLado.length;
    this.verticesTapa = this.verticesLado.slice(n-3*cForma, n);

    var puntoInicial = promedio(this.verticesBase);
    var puntoFinal = promedio(this.verticesTapa);

    this.verticesBase = puntoInicial.concat(this.verticesBase);
    this.verticesTapa = puntoFinal.concat(this.verticesTapa);

    // Calculo las normales de fin y de inicio.
    var nFin = vec3.clone(this.dir), nInicio = vec3.create();
    vec3.scale(nInicio, nFin, -1);

    // Repito las normales para todos los puntos de cada tapa.
    this.normalesTapa = repetir([nFin[0], nFin[1], nFin[2]], cForma + 1);
    this.normalesBase = repetir([nInicio[0], nInicio[1], nInicio[2]], cForma + 1);

    // UVs.
    this.uvsBase = extraerUVs(this.verticesBase);
    this.uvsTapa = extraerUVs(this.verticesTapa);
  }

  this.init = function(material){
    this.calcularNormalesForma();
    this.datosLado();
    this.agregarTapas();

    // Material ahora es un array!.
    var m1, m2, m3;
    if (material.length == 1) {
      m1 = m2 = m3 = material[0]
    } else {
      m1 = material[0];
      m2 = material[1];
      m3 = material[2];
    }
    this.lado = new Grid(this.verticesLado, this.normalesLado, this.uvsLado,
      this.cBarrido, this.cForma).init(m1);
    this.tapa = new Fan(this.verticesTapa, this.normalesTapa, this.uvsTapa).init(m2);
    this.base = new Fan(this.verticesBase, this.normalesBase, this.uvsBase).init(m3);

    // TODO: probar hacer dos fans iguales y trasladar uno.
    return this;
  }

  this.draw = function(mv){
    this.lado.draw(mv);
    this.tapa.draw(mv);
    this.base.draw(mv);
  }

}
