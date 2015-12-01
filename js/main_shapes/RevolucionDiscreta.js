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

      for (var i = 0; i < this.cRevol; i++){
          angulo = this.alfa * i;
          for (var j = 0; j < this.cPerfil; j++){
              var v = [this.pPerfil[j*3] , this.pPerfil[j*3 + 1], this.pPerfil[j*3 + 2]];
              // Roto en y.
              var rotado = [v[2]*Math.sin(angulo) + v[0]*Math.cos(angulo),
                  v[1], v[2]*Math.cos(angulo) - v[0]*Math.sin(angulo)];
              this.vertices = this.vertices.concat(rotado);
          }
      }
      //console.log(this.normales);

      // Primer for, para los ángulos.
      for (var i = 0; i < this.cRevol; i++){
        angulo = this.alfa * i;
        // Segundo for: recorro vértices del perfil de a pares.
        for (var j = 0; j < this.cPerfil; j+=2){
          // Tangente de la dirección de revolución.
          var tg = [-Math.sin(angulo), 0, -Math.cos(angulo)];
          // Unión entre los vértices contiguos en el perfil.
          var v1 = [this.pPerfil[3*j], this.pPerfil[3*j+1], this.pPerfil[3*j+2]];
          var v2 = [this.pPerfil[3*(j+1)], this.pPerfil[3*(j+1)+1], this.pPerfil[3*(j+1)+2]];
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

    this.init = function(program){
        this.obtenerVertices();
        this.grid = new Grid(this.vertices,this.normales, this.cRevol, this.cPerfil).init(program);
        return this;
    }

    this.draw = function(mv){
        this.grid.draw(mv);
    }
}
