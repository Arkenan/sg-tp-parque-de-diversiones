var Revolucion = require("../../../main_shapes/RevolucionDiscreta.js");

module.exports = function(){
    this.vertices = [0,0,0,0,6.2,0,0.7,6.2,0,0.7,3.7,0,0.8,3.5,0,0.8,2.5,0,1,2,0,1,0,0,0,0,0];

    this.init = function(program){
        this.supR = new Revolucion(this.vertices, 30).init(program);
        return this;
    }

    this.draw = function(mv){
        this.supR.draw(mv);
    }
}
