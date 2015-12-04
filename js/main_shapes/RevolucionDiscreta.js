/* Generador de superficies de revolución a partir de una cantidad discreta de
** puntos de perfil. */

var Grid = require("./Grid.js");

module.exports = function(puntosPerfil, cRevol){
    this.vertices = [];
    this.pPerfil = puntosPerfil;
    this.cPerfil = puntosPerfil.length/3;
    this.cRevol = cRevol;
    this.alfa = Math.PI * 2/(cRevol-1);
    this.normales = [];

    this.obtenerVertices = function(){
      // antes que nada repito los vértices del perfil (menos el primero y el último).
      for (var i = 3; i < this.pPerfil.length - 4; i+= 6){
        this.pPerfil.splice(i+3, 0, this.pPerfil[i], this.pPerfil[i+1], this.pPerfil[i+2]);
      }
      this.cPerfil = this.pPerfil.length/3;

      var cu,cv;
      this.uvs = [];
      for (var i = 0; i < this.cRevol; i++){
          angulo = this.alfa * i;
          for (var j = 0; j < this.cPerfil; j++){
              var v = [this.pPerfil[j*3] , this.pPerfil[j*3 + 1], this.pPerfil[j*3 + 2]];
              // Roto en y.
              var rotado = [v[2]*Math.sin(angulo) + v[0]*Math.cos(angulo),
                  v[1], v[2]*Math.cos(angulo) - v[0]*Math.sin(angulo)];
              this.vertices = this.vertices.concat(rotado);

              // Teniendo a mano el x (R), el y (altura) y el angulo, aprovecho para las uvs.
              cu = angulo;
              cv = v[1] + v[0];
              this.uvs.push(cu);
              this.uvs.push(cv);
          }
      }
    }
      //console.log(this.normales);
    this.obtenerNormales = function(){
      // Primer for, para los ángulos.
      for (var i = 0; i < this.cRevol; i++){
        angulo = this.alfa * i;
        // Tangente de la dirección de revolución.
        var tg = [-Math.sin(angulo), 0, -Math.cos(angulo)];
        // Offset del índice de vértice para cada ángulo.
        var off = 3*i*this.cPerfil;
        // Segundo for: recorro vértices del perfil de a pares.
        for (var j = 0; j < this.cPerfil; j+=2){
          // Unión entre los vértices contiguos en el perfil.
          var v1 = [this.vertices[3*j + off], this.vertices[3*j+1 + off], this.vertices[3*j+2 + off]];
          var v2 = [this.vertices[3*(j+1) + off], this.vertices[3*(j+1)+1 + off], this.vertices[3*(j+1)+2 + off]];
          var d = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
          // Cálculo de la normal como producto vectorial de los otros.
          // Observación: deben ser pasados en antihorario.
          var normal = vec3.create();
          vec3.cross(normal, d, tg);
          // Push de la normal 2 veces, una para cada vértice de la cara.
          this.normales.push(normal[0]);
          this.normales.push(normal[1]);
          this.normales.push(normal[2]);

          this.normales.push(normal[0]);
          this.normales.push(normal[1]);
          this.normales.push(normal[2]);
        }
      }
    }
/*
    //mock. Cuando le ponga texturas lo implemento.
    this.obtenerUVs = function(){
      this.uvs = [];
      var vertice, indice, r;
      for (var i = 0; i < this.cRevol; i++){
        for (var j = 0; j < this.cPerfil; j++){
          indice = 3*(i * cPerfil + j);
          vertice = [
            this.vertices[indice],
            this.vertices[indice + 1],
            this.vertices[indice + 2]
          ];

          u = 0.5;
          v = 0.5;
          this.uvs = this.uvs.concat([u,v]);
        }
      }
    }
*/
    this.init = function(material){
        this.obtenerVertices();
        this.obtenerNormales();
        //this.obtenerUVs();
        this.grid = new Grid(this.vertices,this.normales, this.cRevol, this.cPerfil).init(material, this.uvs);
        return this;
    }

    this.draw = function(mv){
        this.grid.draw(mv);
    }
}
