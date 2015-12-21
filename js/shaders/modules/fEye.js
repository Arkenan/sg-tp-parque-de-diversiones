module.exports = {
  name: 'fEye',
  loaded: false,
  dependencies: [],
  variables: [],
  logic:[
    // Parte del vértice y va hacia la cámara.
    'vec3 E = -normalize(vPos.xyz);',
  ],
  execute: function(program){}
}
