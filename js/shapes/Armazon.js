var Triangulo = require("./Triangulo.js");
var Cilindro = require("./Cilindro.js");

module.exports = function(){
    this.tri = null;
    this.cil = null;
    this.theta = 2*Math.PI/15;

    this.init = function(gl, program){
        this.tri = new Triangulo().init(gl, program);
        this.cil = new Cilindro(5,2).init(gl, program);
        return this;
    }

    this.draw = function(mv){

        var m1 = mat4.create(), m2 = mat4.create(), mpalo = mat4.create();
        mat4.translate(m1,mv,[0,0,1]);
        mat4.translate(m2,mv,[0,0,-1]);

        for (var i = 0; i < 15; i++){
            this.tri.draw(m1);
            this.tri.draw(m2);

            mat4.rotate(m1,m1,this.theta,[0,0,1]);
            mat4.rotate(m2,m2,this.theta,[0,0,1]);
        }

        for (var j = 0; j < 8; j++){
            mat4.rotate(mpalo,mv,(3/2 + 2*j)*this.theta,[0,0,1]);
            mat4.translate(mpalo,mpalo,[0,-5,-1]);
            mat4.scale(mpalo,mpalo,[0.1,0.1,2]);
            this.cil.draw(mpalo);
        }
    }
}
