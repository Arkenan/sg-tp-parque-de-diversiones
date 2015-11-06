var MouseHandler = require("./MouseHandler.js");

module.exports = function(posInicial, dirInicial, upInicial){
    this.pos = posInicial;
    this.dir = dirInicial;
    this.up = upInicial;

    // Coordenadas polares de la posición.
    this.p = vec3.length(posInicial);
    this.beta = Math.acos(posInicial[1]/this.p);
    this.alfa = Math.asin(posInicial[0]/(this.p*Math.sin(this.beta)));

    this.mHandler = new MouseHandler(this);
    this.velocidad = 0.05;

    // Arreglo con 3 funciones. Una para cada modo de cámara.
    this.actualizar = [];
    this.modo = 0;

    this.init = function(){
        return this;
    }

    this.viewM = function(mVista){
        // Antes de ver se fija si hubo cambios para hacer y los hace.
        this.actualizar[this.modo]();

        var center = vec3.create();
        vec3.add(center,this.pos,this.dir);
        mat4.lookAt(mVista,this.pos,center,this.up);
    }

    this.cambiarPos = function(vector){
        vec3.add(this.pos,this.pos,vector);
    }

    var actualizarDomo = function(cam){
        return function(){
            if (cam.mHandler.mouseDown){
                cam.alfa += cam.mHandler.deltaX() * cam.velocidad;
                cam.beta += cam.mHandler.deltaY() * cam.velocidad;
                if (cam.beta<0) cam.beta=0;
        		if (cam.beta>Math.PI) cam.beta=Math.PI;
                vec3.set(cam.pos, cam.p * Math.sin(cam.alfa) * Math.sin(cam.beta), cam.p * Math.cos(cam.beta) ,cam.p * Math.cos(cam.alfa) * Math.sin(cam.beta));
                // se mira siempre al origen de coordenadas.
                vec3.negate(cam.dir,cam.pos);
                // Habría que actualizar up para que no muera cuando está arriba.

            }
        }
    }
    //TODO
    var actualizarFPS = function(cam){
        return function(){

        }
    }
    //TODO
    var actualizarMR = function(){
        return function(){

        }
    }

    this.actualizar = [actualizarDomo(this), actualizarFPS(this), actualizarMR(this)];
    /*document.onkeydown = handleKD(this);
    document.onkeyup = handleKU(this); */

}
