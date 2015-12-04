module.exports = {
  name: 'fNormal',
  loaded: false,
  dependencies: [],
  variables: [
    'varying vec3 vNormal;',            // Normal para el punto.
  ],
  logic:[
    'vec3 N = normalize(vNormal);',     // La normal viene interpolada.
  ],
  execute: function(program){}
}
