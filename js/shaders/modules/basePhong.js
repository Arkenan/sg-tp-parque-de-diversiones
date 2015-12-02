module.exports = {
  name: 'basePhong',
  loaded: false,
  dependencies: [],
  variables: [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',
    // Rotación de la vista, para cambiar la dirección de la luz.
    'uniform mat3 uVR;',

    'uniform float uShininess;',        // Shininess: brillo del material.
    'uniform vec3 uLightDirection;',    // Dirección de la luz.

    'uniform vec4 uLightAmbient; ',     // Color de luz ambiente.
    'uniform vec4 uLightDiffuse; ',     // Color de la luz a la comp. difusa.
    'uniform vec4 uLightSpecular; ',    // Color de los reflejos especulares.

    'uniform vec4 uMaterialAmbient;  ', // Color de ambiente del material.
    /* No se le pasa de una componente difusa. Esto depende de si es una
    ** textura o si es un color constante. */
    'uniform vec4 uMaterialSpecular; ', // Color especular del material.

    'varying vec3 vNormal;',            // Normal para el punto.
    'varying vec3 vEyeVec;'             // Dirección de vista.
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
      'Id = uLightDiffuse * colorDifuso * lambertTerm; //add diffuse term',
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
    //program.uMaterialDiffuse   = global.gl.getUniformLocation(program, "uMaterialDiffuse");
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
    //global.gl.uniform4fv(program.uMaterialDiffuse, [0.5,0.8,0.1,1.0]);
    global.gl.uniform4fv(program.uMaterialSpecular, [1.0,1.0,1.0,1.0]);
    global.gl.uniform1f(program.uShininess, 230.0);
  }
}