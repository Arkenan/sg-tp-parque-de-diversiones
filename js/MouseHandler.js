module.exports = function(){
    this.cam = null;
    this.x = 0;
    this.y = 0;
    this.xAnt = 0;
    this.yAnt = 0;
    this.mouseDown = false;

    this.init = function(cam){
        this.cam = cam;
    }

    var handleMouseDown = function(handler){
        return function(){
            handler.xAnt = handler.x;
            handler.yAnt = handler.y;
            handler.mouseDown = true;
        }
    }

    var handleMouseUp = function(handler){
        return function(){
            handler.mouseDown = false;
        }
    }

    var handleMouseMove = function(handler){
        return function(e){
            handler.x = e.clientX || e.pageX;
    		handler.y = e.clientY || e.pageY;
        }
    }

    this.deltaX = function(){
        var d = this.x - this.xAnt;
        this.xAnt = this.x;
        return d;
    }

    this.deltaY = function(){
        var d = this.y - this.yAnt;
        this.yAnt = this.y;
        return d;
    }

    document.onmousedown = handleMouseDown(this);
    document.onmouseup = handleMouseUp(this);
    document.onmousemove = handleMouseMove(this);

}
