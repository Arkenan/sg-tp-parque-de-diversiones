var Cilindro = require("./Cilindro.js");

module.exports = function(){
    this.izq = null;
    this.der = null;
    this.ab = null;

    this.init = function(gl){
        this.izq = new Cilindro(5,2).init(gl);
        this.der = new Cilindro(5,2).init(gl);
        this.ab = new Cilindro(5,2).init(gl);
        return this;
    }

    this.draw = function(gl, program, mv){
        var mizq = mat4.create(), mder = mat4.create(), mab = mat4.create();
        var theta = 2*Math.PI/15;

        // Recordar que se escribe (output, input, ...)
        mat4.rotate(mizq, mv, -theta/2, [0,0,1]);
        mat4.rotate(mizq, mizq, Math.PI/2, [1,0,0]);
        mat4.rotate(mizq, mizq, Math.PI/4, [0,0,1]);
        mat4.scale(mizq, mizq, [0.1, 0.1, 5]);
        this.izq.draw(gl,program,mizq);

        mat4.rotate(mder, mv, theta/2, [0,0,1]);
        mat4.rotate(mder, mder, Math.PI/2, [1,0,0]);
        mat4.rotate(mder, mder, Math.PI/4, [0,0,1]);
        mat4.scale(mder, mder, [0.1, 0.1, 5]);
        this.der.draw(gl,program,mder);

        mat4.translate(mab, mv,[-5*Math.sin(theta/2),-5*Math.cos(theta/2),0]);
        mat4.rotate(mab, mab, Math.PI/2, [0,1,0]);
        mat4.rotate(mab, mab, Math.PI/4, [0,0,1]);
        mat4.scale(mab, mab, [0.1, 0.1, 10*Math.sin(theta/2)]);
        this.ab.draw(gl,program,mab);

    }

}
