module.exports = function(){
    this.cam = null;
    this.pressed = {};

    //KeyCodes. Ver si se puede usar notación JSON.
    this.W = 87;
    this.A = 65;
    this.S = 83;
    this.D = 62;
    this.C = 67;

    this.isPressed = function(keyCode){
        return this.pressed[keyCode];
    }

    this.press = function(keyCode){
        this.pressed[keyCode] = true;
    }

    this.release = function(keyCode){
        this.pressed[keyCode] = false;
    }

    var handleKeyDown = function(handler){
        return function(e){
            handler.press(e.keyCode);
            console.log(handler.pressed);
            if (e.keyCode === handler.C){
                handler.cam.cambiarModo();
            }
        }
    }

    var handleKeyUp = function(handler){
        return function(e){
            handler.release(e.keyCode);
        }
    }

    document.onkeydown = handleKeyDown(this);
    document.onkeyup = handleKeyUp(this);

    this.init = function(cam){
        this.cam = cam;
    }

}
