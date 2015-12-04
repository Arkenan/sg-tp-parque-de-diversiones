// Rueda de la Vuelta al mundo. Dibuja los triángulos y las cabinas.
var Triangulo = require("./Triangulo.js");
var Cilindro = require("../../../main_shapes/Cilindro.js");
var Cabina = require("./Cabina.js");
var MaterialPhong = require('../../../Materiales/MaterialPhong.js');
module.exports = function(){
    this.theta = 2*Math.PI/15;

    this.init = function(){
        var matMetal = new MaterialPhong({colorDifuso:[0.8, 0.8, 0.8, 1.0],
        mapaRefleccion:"js/textures/SB/"});
        this.tri = new Triangulo().init(matMetal);
        // Paralelogramos para las uniones.
        this.palo = new Cilindro(30,2).init(matMetal);
        // Eje
        this.eje = new Cilindro(30,2).init(matMetal);
        // Cabinas.
        var matCabina = new MaterialPhong({colorDifuso:[0.0, 0.0, 0.6, 1.0]});
        this.cabina = new Cabina().init(matCabina);
        return this;
    }

    // A la rueda se le pasa el tiempo para que rote.
    this.draw = function(mv,t){
        var rot = t*0.1;
        var m1 = mat4.create(), m2 = mat4.create(), mpalo = mat4.create();
        var mEje = mat4.create(), mCab = mat4.create();

        for (var i = 0; i < 15; i++){
            // Triangulos.
            mat4.translate(m1,mv,[0,0,1]);
            mat4.translate(m2,mv,[0,0,-1]);
            mat4.rotate(m1,m1,i*this.theta + rot,[0,0,1]);
            mat4.rotate(m2,m2,i*this.theta + rot,[0,0,1]);
            this.tri.draw(m1);
            this.tri.draw(m2);
        }

        // Uniones.
        for (var j = 0; j < 8; j++){
            mat4.rotate(mpalo,mv,(3/2 + 2*j)*this.theta + rot,[0,0,1]);
            mat4.translate(mpalo,mpalo,[0,-5,-1]);
            mat4.scale(mpalo,mpalo,[0.1,0.1,2]);
            this.palo.draw(mpalo);
        }

        // Cabinas
        for (var j = 0; j < 7; j++){
            angulo = (3/2 + 2*j)*this.theta + rot;
            mat4.translate(mCab,mv,[0,-1,0]);
            mat4.rotate(mCab,mCab,angulo,[0,0,1]);
            mat4.translate(mCab,mCab,[0,-5,0]);
            //compenso.
            mat4.rotate(mCab,mCab,-angulo,[0,0,1]);
            this.cabina.draw(mCab);
        }

        // Eje Central.
        mat4.translate(mEje,mv,[0,0,-2]);
        mat4.scale(mEje,mEje,[0.2,0.2,4]);
        this.eje.draw(mEje);
    }
}
