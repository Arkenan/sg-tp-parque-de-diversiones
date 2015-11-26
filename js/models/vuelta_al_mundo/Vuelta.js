// Vuelta al mundo. Dibuja a la rueda y a la base.
var Base = require("./shapes/BaseVuelta.js");
var Rueda = require("./shapes/Rueda.js");

module.exports = function(){
    this.rueda = null;
    this.base = null;

    this.init = function(program){
        this.rueda = new Rueda().init(program);
        this.base = new Base().init(program);
        return this;
    }

    this.draw = function(mv,t){
        var mrueda = mat4.create(), mb1 = mat4.create(), mb2 = mat4.create();

        mat4.translate(mrueda,mv,[0,this.base.d_op-0.2,0]);
        this.rueda.draw(mrueda,t);

        mat4.translate(mb1,mv,[0,0,1.5])
        mat4.scale(mb1,mb1,[1,1,0.4]);
        this.base.draw(mb1);

        mat4.translate(mb2,mv,[0,0,-1.5])
        mat4.scale(mb2,mb2,[1,1,0.4]);
        this.base.draw(mb2);

    }
}
