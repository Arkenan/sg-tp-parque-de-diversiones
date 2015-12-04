// El path es la carpeta del skybox.
module.exports = function(path){

  // direcciones de cada imagen.
  var urls = [
    path + "posx.jpg", path + "negx.jpg",
    path + "posy.jpg", path + "negy.jpg",
    path + "posz.jpg", path + "negz.jpg"
  ];

  // Imágenes del cubo.
  var img = new Array(6);

  // Ya están cargadas las imágenes. Las busco.
  for (var i = 0; i < 6; i++){
    img[i] = global.imgs[urls[i]];
  }

  var textura;

  textura = global.gl.createTexture();
  global.gl.bindTexture(global.gl.TEXTURE_CUBE_MAP, textura);
  var targets = [
    global.gl.TEXTURE_CUBE_MAP_POSITIVE_X, global.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    global.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, global.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    global.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, global.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
  ];
  for (var j = 0; j < 6; j++) {
    global.gl.texImage2D(targets[j], 0, global.gl.RGBA, global.gl.RGBA, global.gl.UNSIGNED_BYTE, img[j]);
    global.gl.texParameteri(global.gl.TEXTURE_CUBE_MAP, global.gl.TEXTURE_WRAP_S, global.gl.CLAMP_TO_EDGE);
    global.gl.texParameteri(global.gl.TEXTURE_CUBE_MAP, global.gl.TEXTURE_WRAP_T, global.gl.CLAMP_TO_EDGE);
  }
  global.gl.generateMipmap(global.gl.TEXTURE_CUBE_MAP);

  return textura;
}
