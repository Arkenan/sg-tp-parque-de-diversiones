module.exports = {
  name: 'vTex',
  loaded: false,
  dependencies: [],
  variables: [
     'attribute vec2 aTextureCoord;',
    'varying highp vec2 vTextureCoord;'
  ],
  logic:[
    'vTextureCoord = aTextureCoord;'
  ],
  execute: function(program){
    // Nada?
  }
}
