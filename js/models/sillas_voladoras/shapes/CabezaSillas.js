var RevolucionD = require("../../../main_shapes/RevolucionDiscreta.js");
var Silla = require("./SillaSuspendida.js");
var MaterialPhong = require('../../../Materiales/MaterialPhong.js');

module.exports = function(){
    this.vertices = [0,0,0,0,2.3,0,5.3,2,0,5.3,1,0,0.7,0,0,0,0,0];

    this.init = function(){
        var matCabeza = new MaterialPhong({colorDifuso: [1.0, 0.5, 0.5, 1.0],
          mapaDifuso: "texturas/cabeza.jpg"});
        this.supR = new RevolucionD(this.vertices, 60).init(matCabeza);
        var matSilla = new MaterialPhong({colorDifuso: [1.0, 1.0, 0.0, 1.0]});
        this.silla = new Silla().init(matSilla);

        return this;
    }

    this.draw = function(mv){
        var ms = mat4.create();

        this.supR.draw(mv);

        // Sillas.
        for (var i = 0; i < 16; i++){
            mat4.rotate(ms,mv,Math.PI/8*i,[0,1,0]);
            mat4.translate(ms,ms,[-4.5,1,0]);
            mat4.rotate(ms,ms,-20*Math.PI/180,[0,0,1]);
            this.silla.draw(ms);
        }
    }
}
