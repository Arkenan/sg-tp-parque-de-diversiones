// Parque de diversiones. Dibuja a las tres atracciones y al suelo.

var Vuelta = require("./models/vuelta_al_mundo/Vuelta.js");
var Sillas = require("./models/sillas_voladoras/Sillas.js");
var Plano = require("./main_shapes/Plano.js");
var Rusa = require("./models/montania_rusa/Rusa.js");
var Pileta = require("./models/pileta/Pileta.js");
var Domo = require("./models/domo/Domo.js");

module.exports = function(puntosMRusa){

    this.init = function(puntosMRusa,program){
        this.vuelta = new Vuelta().init(program);
        this.sillas = new Sillas().init(program);
        this.plano = new Plano(2,2).init(program);
        this.rusa = new Rusa(puntosMRusa,20,300).init(program);
        this.pileta = new Pileta().init(program);
        this.domo = new Domo().init(program);
        return this;
    }

    this.draw = function(mv,t){
        var mVuelta = mat4.create(), mp = mat4.create(), mSillas = mat4.create(),
        mrusa = mat4.create(), mPileta = mat4.create(), mDomo = mat4.create();

        // Vuelta al mundo.
        mat4.translate(mVuelta,mv,[-6,0,-18]);
        mat4.rotate(mVuelta,mVuelta,-20*Math.PI/180,[0,1,0])
        this.vuelta.draw(mVuelta,t);

        // Sillas Voladoras.
        mat4.translate(mSillas,mv,[15.6,0,8]);
        mat4.scale(mSillas,mSillas,[1.25,1.25,1.25])
        this.sillas.draw(mSillas,t);

        // Montaña Rusa.
        mat4.translate(mrusa,mv,[-40,0,0]);
        mat4.scale(mrusa,mrusa,[0.4,0.4,0.4]);
        this.rusa.draw(mrusa,t);

        // Pileta.
        mat4.translate(mPileta,mv,[-28,0,0]);
        mat4.rotate(mPileta,mPileta,Math.PI/2,[0,1,0]);
        mat4.scale(mPileta,mPileta,[5,0.03,3]);
        this.pileta.draw(mPileta);

        // Domo
        mat4.scale(mDomo,mv,[80,80,80]);
        //this.domo.draw(mDomo);

        // Piso.
        mat4.translate(mp,mv,[-100,0,-100]);
        mat4.scale(mp,mp,[300,1,300]);
        mat4.rotate(mp,mp,Math.PI/2,[1,0,0]);
        this.plano.draw(mp);
    }
}
