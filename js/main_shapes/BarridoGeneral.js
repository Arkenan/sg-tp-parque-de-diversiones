var Grid = require('./Grid.js');
var MaterialPhong = require('../Materiales/MaterialPhong.js')

module.exports = function(fForma, fBarrido, fTNB, cForma, cBarrido){
    // Todas las funciones van entre 0 y 1.
    this.fForma = fForma;
    this.fBarrido = fBarrido;
    this.fTNB = fTNB; // devuelve tres vectores, tg, normal y binormal.
    this.cForma = cForma;
    this.cBarrido = cBarrido;

    this.pasoForma = 1/(this.cForma - 1);
    this.pasoBarrido = 1/(this.cBarrido - 1);

    this.pForma = [];
    this.pBarrido = [];
    this.vertices = [];
    this.normales = [];

    this.fijarPuntosEval = function(){
      for (var i = 0; i < cForma; i ++){
        this.pForma.push(i*this.pasoForma);
      }

      for (var i = 0; i < cBarrido; i++){
        this.pBarrido.push(i*this.pasoBarrido);
      }
    }

    // Esto es lo que cambia respecto del barrido particular (extrusión simple).
    this.obtenerVertices = function(){
      // Se toma como referencia al sistema formado por el binormal.
      for (var i = 0; i < this.cBarrido; i++){
        // Para la forma, nuestro x ahora es B; nuestro y es N.
        var o = this.fBarrido(this.pBarrido[i]);
        var tnb = this.fTNB(this.pBarrido[i])
        var B = tnb[2];
        var N = tnb[1];

        var n, p; // normal y punto.

        for (var j = 0; j < this.cForma; j++){
          // Punto en coordenadas de la forma.
          var xyz = fForma(this.pForma[j]);
          // Punto en coordenadas intrínsecas a la superficie.
          var n = [
            xyz[0]*B[0] + xyz[1]*N[0],
            xyz[0]*B[1] + xyz[1]*N[1],
            xyz[0]*B[2] + xyz[1]*N[2]
          ];

          var p = [
            o[0] + n[0],
            o[1] + n[1],
            o[2] + n[2]
          ];

          this.vertices = this.vertices.concat(p);
          this.normales = this.normales.concat(n);
        }
      }
    }

    this.agregarTapas = function(){
      // Hago promedio entre los últimos y los primeros de las caras.
      var cantVertices = this.vertices.length / 3;
      var puntoInicial = this.promedio(this.vertices.slice(0,(cForma-1)*3));
      var puntoFinal = this.promedio(this.vertices.slice(cantVertices*3 - (cForma-1)*3 ,cantVertices*3));

      // Agrego cForma veces al inicial y al final (dos filas más de grilla).
      for (i = 0; i < cForma; i++){
          this.vertices = puntoInicial.concat(this.vertices);
          this.normales = puntoInicial.concat(this.normales);

          this.vertices = this.vertices.concat(puntoFinal);
          this.normales = this.normales.concat(puntoFinal);
      }
    }
    this.promedio = function(vertices){
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

    this.obtenerUVs = function(){
      this.uvs = [];
      for (var i = 0; i < this.cBarrido + 2; i++){
        for (var j = 0; j < this.cForma; j++){
          var u = 0.5;
          var v = 0.5;
          this.uvs = this.uvs.concat([u,v]);
        }
      }
    }

    this.init = function (material){
        // TODO filas y columnas.
        this.fijarPuntosEval();
        this.obtenerVertices();
        this.agregarTapas();

        this.grid = new Grid(this.vertices, this.normales, this.uvs, this.cBarrido + 2, this.cForma).init(material);
        return this;
    }

    this.draw = function(mv){
      this.grid.draw(mv);
    }

}
