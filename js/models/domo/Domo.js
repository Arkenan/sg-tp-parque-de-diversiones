var Cubo = require("../../main_shapes/Cubo.js");

module.exports = function(){

    this.init = function(material){
        this.cubo = new Cubo().init(material);
        return this;
    }

    this.draw = function(mv){
        this.cubo.draw(mv);
    }
}
