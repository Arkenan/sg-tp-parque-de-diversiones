var Vuelta = require("./shapes/Vuelta.js");
var Sillas = require("./shapes/Sillas.js");
var Plano = require("./shapes/Plano.js");
var Rusa = require("./shapes/Rusa.js");
var Pileta = require("./shapes/Pileta.js");

module.exports = function(puntosMRusa){
    // Objetos a dibujar.
    this.vuelta = null;
    this.sillas = null;
    this.plano = null;
    this.rusa = null;

    this.init = function(puntosMRusa,gl,program){
        this.vuelta = new Vuelta().init(gl,program);
        this.sillas = new Sillas().init(gl,program);
        this.plano = new Plano(2,2).init(gl,program);
        this.rusa = new Rusa(puntosMRusa,20,300).init(gl,program);
        this.pileta = new Pileta().init(gl,program);
        return this;
    }

    this.draw = function(mv,t){
        var mVuelta = mat4.create(), mp = mat4.create(), mSillas = mat4.create(),
        mrusa = mat4.create(), mPileta = mat4.create();

        mat4.translate(mVuelta,mv,[-6,0,-18]);
        mat4.rotate(mVuelta,mVuelta,-20*Math.PI/180,[0,1,0])
        this.vuelta.draw(mVuelta,t);

        mat4.translate(mSillas,mv,[15.6,0,8]);
        mat4.scale(mSillas,mSillas,[1.25,1.25,1.25])
        this.sillas.draw(mSillas,t);

        mat4.translate(mrusa,mv,[-40,0,0]);
        mat4.scale(mrusa,mrusa,[0.4,0.4,0.4]);
        this.rusa.draw(mrusa,t);

        mat4.translate(mPileta,mv,[-30,0,0]);
        mat4.rotate(mPileta,mPileta,Math.PI/2,[0,1,0]);
        mat4.scale(mPileta,mPileta,[5,0.3,3]);
        this.pileta.draw(mPileta);

        // Piso.
        mat4.translate(mp,mv,[-100,0,-100]);
        mat4.scale(mp,mp,[200,1,200]);
        mat4.rotate(mp,mp,Math.PI/2,[1,0,0]);
        this.plano.draw(mp);
    }
}
