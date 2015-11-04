module.exports = function(posInicial, dirInicial, upInicial){
    this.pos = posInicial;
    this.dir = dirInicial;
    this.up = upInicial;

    this.init = function(){
        return this;
    }

    this.viewM = function(mVista){
        var center = vec3.create();
        vec3.add(center,this.pos,this.dir);
        mat4.lookAt(mVista,this.pos,center,this.up);
    }
}
