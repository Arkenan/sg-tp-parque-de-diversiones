module.exports = {
  variables: [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    // Rotación de la vista, para cambiar la dirección de la luz.
    'uniform mat3 uVR;',

    'uniform float uShininess;       // shininess',
    'uniform vec3 uLightDirection;   // light direction',

    'uniform vec4 uLightAmbient;     // light ambient property',
    'uniform vec4 uLightDiffuse;     // light diffuse property',
    'uniform vec4 uLightSpecular;    // light specular property',

    'uniform vec4 uMaterialAmbient;  // object ambient property',
    'uniform vec4 uMaterialDiffuse;  // object diffuse property',
    'uniform vec4 uMaterialSpecular; // object specular property',

    'varying highp vec4 vColor;',

    'varying vec3 vNormal;',
    'varying vec3 vEyeVec;'
  ],
  logic:[
    'vec3 L = normalize(uVR * uLightDirection);',
    'vec3 N = normalize(vNormal);',

    // Lamberts cosine law
    'float lambertTerm = dot(N,L);',

    // Ambient Term
    'vec4 Ia = uLightAmbient * uMaterialAmbient;',

    // Diffuse Term
    'vec4 Id = vec4(0.0,0.0,0.0,1.0);',

    // Specular Term
    'vec4 Is = vec4(0.0,0.0,0.0,1.0);',

    'if(lambertTerm > 0.0){',
      'Id = uLightDiffuse * uMaterialDiffuse * lambertTerm; //add diffuse term',
      'vec3 E = normalize(vEyeVec);',
      'vec3 R = reflect(-L, N);',
      'float specular = pow( max(dot(R, E), 0.0), uShininess);',
      'Is = uLightSpecular * uMaterialSpecular * specular; //add specular term',
    '}',

    // Final color
    'vec4 finalColor = Ia + Id + Is;',
    'finalColor.a = 1.0;',

    'gl_FragColor = finalColor;'
  ],
  execute: function(program){
    program.uMaterialAmbient   = global.gl.getUniformLocation(program, "uMaterialAmbient");
    program.uMaterialDiffuse   = global.gl.getUniformLocation(program, "uMaterialDiffuse");
    program.uMaterialSpecular  = global.gl.getUniformLocation(program, "uMaterialSpecular");
    program.uShininess         = global.gl.getUniformLocation(program, "uShininess");
    program.uLightAmbient      = global.gl.getUniformLocation(program, "uLightAmbient");
    program.uLightDiffuse      = global.gl.getUniformLocation(program, "uLightDiffuse");
    program.uLightSpecular     = global.gl.getUniformLocation(program, "uLightSpecular");
    program.uLightDirection    = global.gl.getUniformLocation(program, "uLightDirection");

    global.gl.uniform3f(program.uLightDirection, 0.0, 1.0, 2.0);
    global.gl.uniform4fv(program.uLightAmbient, [0.01,0.01,0.01,1.0]);
    global.gl.uniform4fv(program.uLightDiffuse,  [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uLightSpecular,  [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uMaterialAmbient, [1.0,1.0,1.0,1.0]);
    global.gl.uniform4fv(program.uMaterialDiffuse, [0.5,0.8,0.1,1.0]);
    global.gl.uniform4fv(program.uMaterialSpecular, [1.0,1.0,1.0,1.0]);
    global.gl.uniform1f(program.uShininess, 230.0);
  }
}
