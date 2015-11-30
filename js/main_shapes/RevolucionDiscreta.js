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
        for (var i = 0; i < this.cRevol; i++){
            angulo = this.alfa * i;
            for (var j = 0; j < this.cPerfil; j++){
                var v = [this.pPerfil[j*3] , this.pPerfil[j*3 + 1], this.pPerfil[j*3 + 2]];
                // Roto en y.
                var rotado = [v[0]*Math.sin(angulo) + v[2]*Math.cos(angulo),
                    v[1], v[0]*Math.cos(angulo) - v[2]*Math.sin(angulo)];
                this.vertices = this.vertices.concat(rotado);

                var normal = rotado;
                this.normales = this.normales.concat(normal);
            }
        }
        //console.log(this.normales);
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
