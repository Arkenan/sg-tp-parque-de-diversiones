var MouseHandler = require("./MouseHandler.js");
var KeyboardHandler = require("./KeyboardHandler.js");

module.exports = function(fMov){
    // Función de movimiento para la tercera cámara.
    this.fMov = fMov;

    // Coordenadas polares de la posición o la dirección.
    this.setearPolares = function(vec){
        this.p = vec3.length(vec);
        this.beta = Math.acos(vec[1]/this.p);
        this.alfa = Math.atan2(vec[0],vec[2]);
    }

    this.mHandler = new MouseHandler(this);
    this.kHandler = new KeyboardHandler().init(this);
    this.velocidadRot = 0.01;
    this.velocidadTras = 0.1;

    // Arreglo con 3 funciones. Una para cada modo de cámara.
    this.actualizar = [];
    this.modo = 0;

    this.init = function(){
        this.pos = vec3.fromValues(0,0.5,40);
        this.dir = vec3.fromValues(0,0,-1);
        this.up = vec3.fromValues(0,1,0);
        this.setearPolares(this.pos);
        return this;
    }

    this.viewM = function(mVista, t){
        // Antes de ver se fija si hubo cambios para hacer y los hace.
        this.actualizar[this.modo](t);

        var center = vec3.create();
        vec3.add(center,this.pos,this.dir);
        mat4.lookAt(mVista,this.pos,center,this.up);
    }

    this.cambiarPos = function(vector){
        vec3.add(this.pos,this.pos,vector);
    }

    var actualizarDomo = function(cam){
        return function(t){
            if (cam.mHandler.mouseDown){
                cam.alfa += cam.mHandler.deltaX() * cam.velocidadRot;
                cam.beta += cam.mHandler.deltaY() * cam.velocidadRot;
                // Impido acceder a beta = 0 para no necesitar cambiar el up.
                if (cam.beta <= 0) cam.beta = 0.0001;
        		if (cam.beta >= Math.PI/2) cam.beta = Math.PI/2 - 0.0001;
                vec3.set(cam.pos, cam.p * Math.sin(cam.alfa) * Math.sin(cam.beta), cam.p * Math.cos(cam.beta) ,cam.p * Math.cos(cam.alfa) * Math.sin(cam.beta));
                // Se mira siempre al origen de coordenadas.
                vec3.negate(cam.dir,cam.pos);
            }
        }
    }

    var actualizarFPS = function(cam){
        return function(t){
            // TECLADO
            if (cam.kHandler.isPressed(cam.kHandler.W)){
                var mov = vec3.fromValues(cam.dir[0],0,cam.dir[2]);
                vec3.normalize(mov,mov);
                vec3.scaleAndAdd(cam.pos,cam.pos,mov,cam.velocidadTras);
            }
            if (cam.kHandler.isPressed(cam.kHandler.S)){
                var mov = vec3.fromValues(-cam.dir[0],0,-cam.dir[2]);
                vec3.normalize(mov,mov);
                vec3.scaleAndAdd(cam.pos,cam.pos,mov,cam.velocidadTras);
            }
            if (cam.kHandler.isPressed(cam.kHandler.A)){
                var mov = vec3.create();
                vec3.cross(mov,cam.up,cam.dir);
                vec3.normalize(mov,mov);
                vec3.scaleAndAdd(cam.pos,cam.pos,mov,cam.velocidadTras);
            }
            if (cam.kHandler.isPressed(cam.kHandler.D)){
                var mov = vec3.create();
                vec3.cross(mov,cam.dir,cam.up);
                vec3.normalize(mov,mov);
                vec3.scaleAndAdd(cam.pos,cam.pos,mov,cam.velocidadTras);
            }
            // MOUSE
            if (cam.mHandler.mouseDown){
                cam.alfa -= cam.mHandler.deltaX() * cam.velocidadRot;
                cam.beta -= cam.mHandler.deltaY() * cam.velocidadRot;
                // Trampa para no actualizar el up.
                if (cam.beta <= 0) cam.beta = 0.0001;
        		if (cam.beta >= Math.PI) cam.beta = Math.PI -0.0001;
                vec3.set(cam.dir, Math.sin(cam.alfa) * Math.sin(cam.beta), -Math.cos(cam.beta), Math.cos(cam.alfa) * Math.sin(cam.beta));
            }
        }
    }

    //TODO
    var actualizarMR = function(cam){
        return function(t){

            vec3.copy(cam.pos, cam.fMov((t*0.05)%1));
            vec3.scale(cam.pos,cam.pos,0.4);
            vec3.add(cam.pos,cam.pos,[-40,1,0]);
            //mat4.scale(mrusa,mrusa,[0.4,0.4,0.4]);
            if (cam.mHandler.mouseDown){
                cam.alfa -= cam.mHandler.deltaX() * cam.velocidadRot;
                cam.beta -= cam.mHandler.deltaY() * cam.velocidadRot;
                // Trampa para no actualizar el up.
                if (cam.beta <= 0) cam.beta = 0.0001;
        		if (cam.beta > Math.PI) cam.beta = Math.PI;
                vec3.set(cam.dir, Math.sin(cam.alfa) * Math.sin(cam.beta), -Math.cos(cam.beta), Math.cos(cam.alfa) * Math.sin(cam.beta));
            }
        }
    }

    this.actualizar = [actualizarDomo(this), actualizarFPS(this), actualizarMR(this)];

    this.cambiarModo = function(){
        this.modo = (this.modo + 1) % 3;
        switch (this.modo){
            case 0:
                vec3.set(this.pos, 0,0.5,40);
                vec3.set(this.dir, 0,0,-1);
                vec3.set(this.up, 0,1,0);
                this.setearPolares(this.pos);
                break;
            case 1:
                vec3.set(this.pos, 0,0.5,20);
                vec3.set(this.dir, 0,0,-1);
                vec3.set(this.up, 0,1,0);
                this.setearPolares(this.dir);
                break;
            case 2:

                break;
        }
    }
}
