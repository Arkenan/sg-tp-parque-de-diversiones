var Cubo = require("../../../main_shapes/Cubo.js");

// Por ahora solo es un simple cubo. Si hay tiempo, se le darán detalles aquí.
module.exports = function(){

  this.init = function(program){
    this.base = new Cubo().init(program);
    this.col = new Cubo().init(program);
    this.techo = new Cubo().init(program);
    return this;
  }

  this.draw = function(mv){
    var mb = mat4.create(), mc = mat4.create(), mt = mat4.create();
    // Base.
    mat4.translate(mb, mv, [0,-0.5,0]);
    mat4.scale(mb, mb, [1.5,1,1.5]);
    this.base.draw(mb);
    // Techo.
    mat4.translate(mt, mv, [0, 0.96, 0]);
    mat4.scale(mt, mt, [1.5,0.08,1.5]);
    this.techo.draw(mt);
    // cols:
    for (var x = -0.675; x <= 0.675; x += 1.35){
      for (var z = -0.675; z <= 0.675; z += 1.35){
        mat4.translate(mc, mv, [x,0.46,z]);
        mat4.scale(mc, mc, [0.15, 0.92, 0.15]);
        this.col.draw(mc);
      }
    }
  }
}
