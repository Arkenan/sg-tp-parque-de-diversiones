/* Este es el plano doble. por ahí convenga simplemente hacer un cubo de poco
** grosor para evitar problemas numéricos. Por el momento arregla el tema de las
** normales */

var PlanoS = require('./PlanoSimple.js');

module.exports = function(rows, cols){
  this.rows = rows;
  this.cols = cols;

  this.init = function(material){
    // Crea dos planos simples.
    this.adelante = new PlanoS(rows,cols).init(material);
    this.atras = new PlanoS(rows,cols).init(material);
    return this;
  }

  this.repetir = function(n){
      this.adelante.repetir(n);
      this.atras.repetir(n);
  }

  this.draw = function(mv){
    this.adelante.draw(mv);

    var mAT = mat4.create();
    mat4.translate(mAT, mv, [1,0,-0.01]);
    mat4.rotate(mAT, mAT, Math.PI, [0,1,0]);
    this.atras.draw(mAT);
  }

}
