// Generador de superficies de revolución.

var Grid = require("./Grid.js");

module.exports = function(fPerfil,cPerfil, cRevol){
    this.vertices = [];
    this.pPerfil = [];
    this.cPerfil = cPerfil;
    this.cRevol = cRevol;
    this.alfa = Math.PI * 2/(cRevol-1);
    this.normales = [];

    this.fijarPuntosEval = function(){
        for (var i = 0; i < cPerfil; i ++){
            this.pPerfil.push(i*this.recPerfil);
        }
    }

    this.obtenerVertices = function(){
        for (var i = 0; i < this.cRevol; i++){
            angulo = this.alfa * i;
            for (var j = 0; j < this.cPerfil; j++){
                var v = fPerfil(this.pPerfil[j]);
                // Roto en y.
                var rotado = [v[0]*Math.sin(angulo) + v[2]*Math.cos(angulo),
                    v[1], v[0]*Math.cos(angulo) - v[2]*Math.sin(angulo)];
                this.vertices = this.vertices.concat(rotado);

                var normal = [-1*rotado[0],-1*rotado[1],-1*rotado[2]];
                this.normales = this.normales.concat(normal);
            }
        }
        //console.log(this.normales);
    }

    // Provisorio. No es la idea que sea así, si no que los de arriba pasen las uv.
    // Esto es para tener las cosas funcionando pronto.
    this.obtenerUVs = function(){
      this.uvs = [];
      for (var i = 0; i < this.cPerfil+4; i++){
        for (var j = 0; j < this.cRevol; j += 2){
          var u = j/this.cRevol;
          var v = i/(this.cPerfil+4);
          this.uvs = this.uvs.concat([u,v,u,v]);
        }
      }
    }

    this.init = function(material){
        this.recPerfil = 1/(cPerfil-1);
        this.fijarPuntosEval();
        this.obtenerVertices();
        this.obtenerUVs();
        this.grid = new Grid(this.vertices, this.normales, this.uvs, cRevol, cPerfil).init(material);
        return this;
    }

    this.draw = function(mv){
        this.grid.draw(mv);
    }
}
