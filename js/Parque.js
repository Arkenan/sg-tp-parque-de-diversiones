// Parque de diversiones. Dibuja a las tres atracciones y al suelo.

var Vuelta = require("./models/vuelta_al_mundo/Vuelta.js");
var Sillas = require("./models/sillas_voladoras/Sillas.js");
var Plano = require("./main_shapes/Plano.js");
var Rusa = require("./models/montania_rusa/Rusa.js");
var Pileta = require("./models/pileta/Pileta.js");
var Domo = require("./models/domo/Domo.js");
var MaterialPhong = require('./Materiales/MaterialPhong.js');
var MaterialSkyBox = require('./Materiales/MaterialSkybox.js');

module.exports = function(puntosMRusa){

    this.init = function(puntosMRusa){
        this.vuelta = new Vuelta().init();
        this.sillas = new Sillas().init();
        var material = new MaterialPhong({mapaDifuso:"js/textures/grass.jpg",
          mapaNormales:"js/textures/grassNM.jpg", shininess:1,
           ks:0.2});
        this.plano = new Plano(2,2).init(material);
        this.plano.repetir(100);
        this.rusa = new Rusa(puntosMRusa,20,300).init();
        this.pileta = new Pileta().init();
        var materialDomo = new MaterialSkyBox("js/textures/SB/");
        this.domo = new Domo().init(materialDomo);
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
        mat4.translate(mPileta,mv,[-28,0,5]);
        mat4.rotate(mPileta,mPileta,-Math.PI/4,[0,1,0]);
        mat4.scale(mPileta,mPileta,[5,0.03,3]);
        this.pileta.draw(mPileta, t);

        // Domo
        mat4.scale(mDomo,mv,[300,300,300]);
        this.domo.draw(mDomo);

        // Piso.
        mat4.translate(mp,mv,[-200,0,-200]);
        mat4.scale(mp,mp,[400,1,400]);
        mat4.rotate(mp,mp,Math.PI/2,[1,0,0]);
        this.plano.draw(mp);
    }
}
