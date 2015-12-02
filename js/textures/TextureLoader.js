module.exports = function () {

  this.load = function(path) {
    var texture = global.gl.createTexture();
    var image = new Image();
    image.onload = this.handleTexture(image, texture);
    image.src = path;
    image.setAttribute('crossorigin', 'anonymous');
    return texture;
  }

  this.handleTexture = function(image, texture){
    return function(){
      global.gl.bindTexture(global.gl.TEXTURE_2D, texture);
      global.gl.texImage2D(global.gl.TEXTURE_2D, 0, global.gl.RGBA, global.gl.RGBA, global.gl.UNSIGNED_BYTE, image);
      global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_MAG_FILTER, global.gl.LINEAR);
      global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_MIN_FILTER, global.gl.LINEAR_MIPMAP_NEAREST);
      global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_WRAP_S, global.gl.REPEAT);
      global.gl.texParameteri(global.gl.TEXTURE_2D, global.gl.TEXTURE_WRAP_T, global.gl.REPEAT);
      global.gl.generateMipmap(global.gl.TEXTURE_2D);
      global.gl.bindTexture(global.gl.TEXTURE_2D, null);
    }
  }

  return this;
}
