module.exports = {
  name: 'vModule',
  loaded: false,
  dependencies: [],
  variables: [
    'varying highp vec2 vZX;',
  ],
  logic:[
    'colorDifuso = texture2D(uSampler, vZX);'
  ],
  execute: function(program){}
}
