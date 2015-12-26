// Sillas Voladoras. Dibuja a la cabeza giratoria y a la base.
var Base = require("./shapes/BaseSillas.js");
var Cabeza = require("./shapes/CabezaSillas.js");
var MaterialPhong = require('../../Materiales/MaterialPhong.js');

module.exports = function(){

    this.init = function(){
        var mat = new MaterialPhong({colorDifuso:[0.6,0.6,0.3,1.0],
        mapaDifuso: "texturas/plastic.jpg"});
        this.base = new Base().init(mat);
        this.cabeza = new Cabeza().init();
        return this;
    }

    this.draw = function(mv,t){
        var mc = mat4.create();

        this.base.draw(mv);

        mat4.translate(mc,mv,[0,6.1,0]);
        // Rotación con inclinación.
        mat4.rotate(mc,mc,-(t*1),[0,1,0]);
        // Aprox inclinado 10 grados.
        mat4.rotate(mc,mc,10*2*Math.PI/360,[0,0,1]);
        //Rotación compensada.
        mat4.rotate(mc,mc,2*(t*1),[0,1,0]);
        this.cabeza.draw(mc);

    }
}
