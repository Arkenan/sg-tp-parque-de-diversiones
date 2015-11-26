var Revolucion = require.main.require("./main_shapes/Revolucion.js");

module.exports = function(){
    this.supR = null;
    var fPerfil = function(t){
      var radio = 50;
      return [Math.sin(radio*t / 2),Math.cos(radio*t / 2),0];
    }
    this.fPerfil = fPerfil;

    this.init = function(gl, program){
        this.supR = new Revolucion(this.fPerfil,100,100).init(gl,program);
        return this;
    }

    this.draw = function(mv){
        this.supR.draw(mv);
    }
}