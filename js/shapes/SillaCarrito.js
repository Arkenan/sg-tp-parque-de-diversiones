var Plano = require("./Plano.js");

module.exports = function(){

    this.init = function(gl,program){
        this.plano = new Plano(2,2).init(gl,program);
        return this;
    }

    this.draw = function(mv){
        var mRespaldo = mat4.create(), mAsiento = mat4.create();

        mat4.translate(mRespaldo, mv, [-2.3,0,0]);
        mat4.rotate(mRespaldo, mRespaldo, -Math.PI/36, [1,0,0]);
        mat4.scale(mRespaldo, mRespaldo,[4.6,2,1]);
        this.plano.draw(mRespaldo);

        mat4.translate(mAsiento,mv, [-2.3,0,0]);
        mat4.rotate(mAsiento, mAsiento, Math.PI/2, [1,0,0]);
        mat4.scale(mAsiento, mAsiento,[4.6,1.5,1]);
        this.plano.draw(mAsiento);
    }

}
