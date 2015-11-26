var Revolucion = require("../../../main_shapes/Revolucion.js");

module.exports = function(){
    this.supR = null;
    this.vertices = [0,0,0,0,6.2,0,0.7,6.2,0,0.7,3.7,0,0.8,3.5,0,0.8,2.5,0,1,2,0,1,0,0,0,0,0];
    var fPerfil = function(vertices){
        return function(t){
            // Redondeo por posibles pequeños errores numéricos (los hubo).
            return [vertices[Math.round(24*t)],vertices[Math.round(24*t+1)],0];
        }
    }
    this.fPerfil = fPerfil(this.vertices);

    this.init = function(gl, program){
        this.supR = new Revolucion(this.fPerfil,9,30).init(gl,program);
        return this;
    }

    this.draw = function(mv){
        this.supR.draw(mv);
    }
}
