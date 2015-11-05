var MouseHandler = require("./MouseHandler.js");

module.exports = function(posInicial, dirInicial, upInicial){
    this.pos = posInicial;
    this.dir = dirInicial;
    this.up = upInicial;

    this.p = 20;
    this.alfa = 0;
    this.beta = 0;

    this.mHandler = new MouseHandler(this);
    this.velocidad = 0.1;

    this.init = function(){
        return this;
    }

    this.viewM = function(mVista){
        // Antes de ver se fija si hubo cambios para hacer y los hace.
        if (this.mHandler.mouseDown) this.actualizar();

        var center = vec3.create();
        vec3.add(center,this.pos,this.dir);
        mat4.lookAt(mVista,this.pos,center,this.up);
    }

    this.cambiarPos = function(vector){
        vec3.add(this.pos,this.pos,vector);
    }

    this.actualizar = function(){
        this.alfa += this.mHandler.deltaX() * this.velocidad;
        this.beta += this.mHandler.deltaY() * this.velocidad;
        vec3.set(this.pos, this.p * Math.sin(this.alfa) * Math.sin(this.beta), this.p * Math.cos(this.beta) ,this.p * Math.cos(this.alfa) * Math.sin(this.beta));
        //se mira siempre al origen de coordenadas.
        vec3.negate(this.dir,this.pos);
    }
    /*document.onkeydown = handleKD(this);
    document.onkeyup = handleKU(this); */

}
