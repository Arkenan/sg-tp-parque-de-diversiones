// Puntos para la Montala rusa.

module.exports = function(){
  // Puntos tomados a mano, en pixels. El primero de cada fila interpola.
  this.puntosRusa = [
    [228, 100, 261], [283, 110, 253], [342, 70, 273],
    [369, 50, 300], [410, 30, 347], [454, 50, 396],
    [478, 80, 415], [499, 110, 437], [546, 150, 477],
    [571, 230, 502], [602, 260, 531], [649, 290, 564],
    [679, 380, 581], [710, 330, 595], [791, 200, 563],
    [820, 120, 528], [841, 110, 497], [882, 70, 448],
    [909, 60, 410], [932, 40, 377], [920, 30, 288],
    [908, 35, 257], [891, 40, 212], [854, 45, 127],
    [828, 50, 128], [791, 120, 126], [741, 100, 154],
    [723, 80, 184], [712, 50, 226], [686, 30, 328],
    [665, 140, 366], [642, 160, 408], [601, 180, 486],
    [567, 200, 600], [530, 160, 589], [423, 130, 595],
    [364, 140, 586], [300, 110, 577], [250, 60, 570],
    [100, 70, 570], [150, 80, 572], [80, 90, 515],
    [-150, 300, 380], [119, 120, 250], [40,  150, 45],
    [66,  100, 130], [104, 80, 309], [177, 50, 277], [228, 100, 261],
  ]

  this.puntosPileta = [
    [3,0,1],[4,0,5],[1,0,3],
    [0,0,3],[-1,0,5],[-3,0,4],
    [-2,0,1],[-3,0,-2],[0,0,-6],
    [1,0,-2],[4,0,-5],[5,0,-6],
    [5,0,-3],[7,0,-4],[5,0,0],[3,0,1]
  ];

  this.alinear = function(a,b,c){
    // Alinear tres vectores wsando el del medio como eje.
    var v1 = vec3.create(), v2 = vec3.create(), prom = vec3.create();
    vec3.subtract(v1,a,b);
    vec3.subtract(v2,c,b);
    vec3.add(prom,v1,v2);
    vec3.scale(prom,prom,0.5);
    vec3.subtract(a,a,prom);
    vec3.subtract(c,c,prom);
  }

  this.prepararBezier = function(puntos){
    // Prepara los puntos para cumplir las condiciones de continuidad de bezier.
    for (var i = 2; i < puntos.length - 2; i+=3 ){
      this.alinear(puntos[i], puntos[i+1], puntos[i+2]);
    }

    this.alinear(puntos[puntos.length-2],puntos[0],puntos[1]);

    var set = [];

    // Convertir los puntos a un set aceptable por el concatenador.
    for (var i = 0; i < puntos.length - 1; i+=3){
      set.push([ puntos[i], puntos[i+1], puntos[i+2], puntos[i+3] ]);
    }
    return set
  }

  this.escalar = function(puntos, n){
    for (i = 0; i < puntos.length; i ++){
      for (j = 0; j < 3; j++){
        puntos[i][j] *= n;
      }
    }
  }

  this.escalar(this.puntosRusa, 0.1);
  this.puntosRusaPreparados = this.prepararBezier(this.puntosRusa);
  this.puntosPiletaPreparados = this.prepararBezier(this.puntosPileta);
  return this;
}
