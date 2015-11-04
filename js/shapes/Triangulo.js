var Cilindro = require("./Cilindro.js");

module.exports = function(){
    this.cil = null;
    this.theta = 2*Math.PI/15;
    this.largo_op = 10*Math.sin(this.theta/2);
    this.d_op = 5*Math.cos(this.theta/2),0;

    this.init = function(gl,program){
        this.cil = new Cilindro(5,2).init(gl,program);
        return this;
    }

    this.draw = function(mv){
        var mizq = mat4.create(), mder = mat4.create(), mab = mat4.create();

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

    }

}
