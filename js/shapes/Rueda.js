var Triangulo = require("./Triangulo.js");
var Cilindro = require("./Cilindro.js");

module.exports = function(){
    this.tri = null;
    this.palo = null;
    this.theta = 2*Math.PI/15;

    this.init = function(gl, program){
        this.tri = new Triangulo().init(gl, program);
        // Paralelogramos para las uniones.
        this.palo = new Cilindro(5,2).init(gl, program);
        // Eje
        this.eje = new Cilindro(30,2).init(gl, program);
        return this;
    }

    this.draw = function(mv){

        var m1 = mat4.create(), m2 = mat4.create(), mpalo = mat4.create();
        var mEje = mat4.create();

        // Triangulos.
        mat4.translate(m1,mv,[0,0,1]);
        mat4.translate(m2,mv,[0,0,-1]);

        for (var i = 0; i < 15; i++){
            this.tri.draw(m1);
            this.tri.draw(m2);

            mat4.rotate(m1,m1,this.theta,[0,0,1]);
            mat4.rotate(m2,m2,this.theta,[0,0,1]);
        }

        // Uniones.
        for (var j = 0; j < 8; j++){
            mat4.rotate(mpalo,mv,(3/2 + 2*j)*this.theta,[0,0,1]);
            mat4.translate(mpalo,mpalo,[0,-5,-1]);
            mat4.scale(mpalo,mpalo,[0.1,0.1,2]);
            this.palo.draw(mpalo);
        }

        // Eje Central.
        mat4.translate(mEje,mv,[0,0,-1.5]);
        mat4.scale(mEje,mEje,[0.2,0.2,3]);
        this.eje.draw(mEje);
    }
}
