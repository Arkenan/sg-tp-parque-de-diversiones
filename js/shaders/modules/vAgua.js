module.exports = {
  name: 'vModule',
  loaded: false,
  dependencies: [],
  variables: [
    'varying vec2 vZX;',
  ],
  logic:[
    'vZX = vec2(aVertexPosition.z/100.0 + 100.0, aVertexPosition.x/100.0 + 100.0);'
  ],
  execute: function(program){}
}
