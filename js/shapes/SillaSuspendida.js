var Plano = require("./Plano.js");

module.exports = function(){
    this.plano = null;

    this.init = function(gl,program){
        this.plano = new Plano(2,2).init(gl,program);
        return this;
    }

    this.draw = function(mv){
        var mSoga = mat4.create(), m1 = mat4.create() , m2 = mat4.create();
        var mRespaldo = mat4.create(), mAsiento = mat4.create();

        mat4.translate(mSoga,mv,[-0.05,-4,0]);
        mat4.scale(mSoga,mSoga,[0.1,4,1]);
        this.plano.draw(mSoga);

        mat4.translate(m1,mv,[0,-4,0]);
        mat4.rotate(m1,m1,20*Math.PI*2/360,[0,0,1]);
        mat4.translate(m1,m1,[-0.05,-1,0]);
        mat4.scale(m1,m1,[0.1,1,1]);
        this.plano.draw(m1);

        mat4.translate(m2,mv,[0,-4,0]);
        mat4.rotate(m2,m2,-20*Math.PI*2/360,[0,0,1]);
        mat4.translate(m2,m2,[-0.05,-1,0]);
        mat4.scale(m2,m2,[0.1,1,1]);
        this.plano.draw(m2);

        mat4.translate(mRespaldo,mv,[-0.375,-5.3,0.01]);
        mat4.scale(mRespaldo,mRespaldo,[0.75,0.5,1]);
        this.plano.draw(mRespaldo);

        mat4.translate(mAsiento,mv,[-0.375,-5.3,0.01]);
        mat4.rotate(mAsiento,mAsiento,Math.PI/2,[1,0,0]);
        mat4.scale(mAsiento,mAsiento,[0.75,0.5,1]);
        this.plano.draw(mAsiento);
    }

}
