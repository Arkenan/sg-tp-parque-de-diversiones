var Revolucion = require("../../../main_shapes/Revolucion.js");
var Silla = require("./SillaSuspendida.js");

module.exports = function(){
    this.supR = null;
    this.silla = null;
    this.vertices = [0,0,0,0,2.3,0,5.3,2,0,5.3,1,0,0.7,0,0,0,0,0];

    var fPerfil = function(vertices){
        return function(t){
            // Redondeo por posibles pequeños errores numéricos.
            return [vertices[Math.round(15*t)],vertices[Math.round(15*t+1)],0];
        }
    }
    this.fPerfil = fPerfil(this.vertices);

    this.init = function(program){
        this.supR = new Revolucion(this.fPerfil,6,30).init(program);
        this.silla = new Silla().init(program);

        return this;
    }

    this.draw = function(mv){
        var ms = mat4.create();

        this.supR.draw(mv);

        // Sillas.
        for (var i = 0; i < 16; i++){
            mat4.rotate(ms,mv,Math.PI/8*i,[0,1,0]);
            mat4.translate(ms,ms,[-4.5,1,0]);
            mat4.rotate(ms,ms,-20*Math.PI/180,[0,0,1]);
            this.silla.draw(ms);
        }
    }
}
