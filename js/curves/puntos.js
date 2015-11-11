// Puntos para la Montala rusa.

module.exports = function(){
    // Puntos tomados a mano, en pixels.
    var puntos =
    [[228, 100, 261]  ,
     [283, 110, 253],
     [342, 70, 273],
     [369, 50, 300],
     [410, 30, 347],
     [454, 50, 396],
     [478, 80, 415],
     [499, 110, 437],
     [546, 150, 477],
     [571, 230, 502],
     [602, 260, 531],
     [649, 290, 564],
     [679, 380, 581],
     [710, 330, 595],
     [791, 200, 563],
     [820, 120, 528],
     [841, 110, 497],
     [882, 70, 448],
     [909, 60, 410],
     [932, 40, 377],
     [920, 30, 288],
     [908, 35, 257],
     [891, 40, 212],
     [854, 45, 127],
     [828, 50, 128],
     [791, 120, 126],
     [741, 100, 154],
     [723, 80, 184],
     [712, 50, 226],
     [686, 30, 328],
     [665, 140, 366],
     [642, 160, 408],
     [601, 180, 486],
     [567, 200, 533],
     [530, 160, 589],
     [423, 130, 595],
     [364, 140, 586],
     [311, 110, 577],
     [290, 120, 570],
     [253, 70, 570],
     [214, 80, 572],
     [139, 90, 515],
     [128, 100, 482],
     [119, 120, 430],
     [85,  150, 89],
     [66,  100, 58],
     [104, 80, 309],
     [177, 50, 277],
     [228, 100, 261],
     ]
    for (i = 0; i < puntos.length; i ++){
        for (j = 0; j < 3; j++){
            puntos[i][j] /= 10;
        }
    }
    puntos.forEach(function(p){p /= 100;});
    // Alinear tres vectores usando el del medio como eje.
    function alinear(a,b,c){
        var v1 = vec3.create(), v2 = vec3.create(), prom = vec3.create();
        vec3.subtract(v1,a,b);
        vec3.subtract(v2,c,b);
        vec3.add(prom,v1,v2);
        vec3.scale(prom,prom,0.5);
        vec3.subtract(a,a,prom);
        vec3.subtract(c,c,prom);
    }

    // Prepara los puntos para cumplir las condiciones de continuidad de bezier.
    for (var i = 2; i < puntos.length - 2; i+=3 ){
        alinear(puntos[i], puntos[i+1], puntos[i+2]);
    }

    alinear(puntos[puntos.length-2],puntos[0],puntos[1]);

    var set = [];

    // Convertir los puntos a un set aceptable por el concatenador.
    for (var i = 0; i < puntos.length - 1; i+=3){
        set.push([ puntos[i], puntos[i+1], puntos[i+2], puntos[i+3] ]);
    }
    return set
}
