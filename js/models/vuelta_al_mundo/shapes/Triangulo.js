// Triángulos que forman la Vuelta al mundo.

var Cilindro = require("../../../main_shapes/Cilindro.js");
var MaterialPhong = require('../../../Materiales/MaterialPhong.js');

module.exports = function(){
    this.theta = 2*Math.PI/15;
    this.largo_op = 10*Math.sin(this.theta/2);
    this.d_op = 5*Math.cos(this.theta/2),0;

    this.init = function(material){
        this.cil = new Cilindro(30,2).init(material);
        return this;
    }

    this.draw = function(mv){
        var mizq = mat4.create(), mder = mat4.create(), mab = mat4.create();
        var mMed = mat4.create();

        // Recordar que se escribe (output, input, ...)
        mat4.rotate(mizq, mv, -this.theta/2, [0,0,1]);
        mat4.rotate(mizq, mizq, Math.PI/2, [1,0,0]);
        mat4.rotate(mizq, mizq, Math.PI/4, [0,0,1]);
        mat4.scale(mizq, mizq, [0.1, 0.1, 5]);
        this.cil.draw(mizq);

        mat4.rotate(mder, mv, this.theta/2, [0,0,1]);
        mat4.rotate(mder, mder, Math.PI/2, [1,0,0]);
        mat4.rotate(mder, mder, Math.PI/4, [0,0,1]);
        mat4.scale(mder, mder, [0.1, 0.1, 5]);
        this.cil.draw(mder);

        mat4.translate(mab, mv,[-this.largo_op/2,-this.d_op,0]);
        mat4.rotate(mab, mab, Math.PI/2, [0,1,0]);
        mat4.rotate(mab, mab, Math.PI/4, [0,0,1]);
        mat4.scale(mab, mab, [0.1, 0.1, this.largo_op]);
        this.cil.draw(mab);

        mat4.translate(mMed, mv,[-this.largo_op/4,-this.d_op/2,0]);
        mat4.rotate(mMed, mMed, Math.PI/2, [0,1,0]);
        mat4.rotate(mMed, mMed, Math.PI/4, [0,0,1]);
        mat4.scale(mMed, mMed, [0.1, 0.1, this.largo_op/2]);
        this.cil.draw(mMed);

    }

}
