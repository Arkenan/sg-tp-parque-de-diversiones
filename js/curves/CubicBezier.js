module.exports = function(){
  var b1 = function(t){
    return Math.pow(1-t,3);
  }
  var b2 = function(t){
    return t * Math.pow(1-t,2);
  }
  var b3 = function(t){
    return Math.pow(t,2)*(1-t);
  }
  var b4 = function(t){
    return Math.pow(t,3);
  }

  var b1_d1 = function(t){
    return -3 * Math.pow(1-t,2);
  }
  var b2_d1 = function(t){
    return Math.pow(1-t,2) - 2 * t * (1-t);
  }
  var b3_d1 = function(t){
    return 2 * t * (1-t) - Math.pow(t,2);
  }
  var b4_d1 = function(t){
    return 3 * Math.pow(t,2);
  }

  var b1_d2 = function(t){
    return 6 * (1-t);
  }
  var b2_d2 = function(t){
    return 2 * t - 4 * (1-t);
  }
  var b3_d2 = function(t){
    return 2 * (1-t) - 4 * t;
  }
  var b4_d2 = function(t){
    return 6 * t;
  }

  this.init = function (control){
    this.control = control; //[[x1,y1,z1][x2,y2,z2][x3,y3,z3][x4,y4,z4]]
    return this;
  }

  // Generadores como clausuras.
  var generate = function(curva){
      return function(t){
        var x = (curva.control[0][0] * b1(t)) + (3 * curva.control[1][0] * b2(t)) + (3 * curva.control[2][0] * b3(t)) + (curva.control[3][0] * b4(t));
        var y = (curva.control[0][1] * b1(t)) + (3 * curva.control[1][1] * b2(t)) + (3 * curva.control[2][1] * b3(t)) + (curva.control[3][1] * b4(t));
        var z = (curva.control[0][2] * b1(t)) + (3 * curva.control[1][2] * b2(t)) + (3 * curva.control[2][2] * b3(t)) + (curva.control[3][2] * b4(t));
        return [x,y,z];
    }
  }

  var generate_d1 = function(curva){
      return function(t){
        var x = (curva.control[0][0] * b1_d1(t)) + (3 * curva.control[1][0] * b2_d1(t)) + (3 * curva.control[2][0] * b3_d1(t)) + (curva.control[3][0] * b4_d1(t));
        var y = (curva.control[0][1] * b1_d1(t)) + (3 * curva.control[1][1] * b2_d1(t)) + (3 * curva.control[2][1] * b3_d1(t)) + (curva.control[3][1] * b4_d1(t));
        var z = (curva.control[0][2] * b1_d1(t)) + (3 * curva.control[1][2] * b2_d1(t)) + (3 * curva.control[2][2] * b3_d1(t)) + (curva.control[3][2] * b4_d1(t));
        return [x,y,z];
    }
  }

  var generate_d2 = function(curva){
      return function(t){
        var x = (curva.control[0][0] * b1_d2(t)) + (3 * curva.control[1][0] * b2_d2(t)) + (3 * curva.control[2][0] * b3_d2(t)) + (curva.control[3][0] * b4_d2(t));
        var y = (curva.control[0][1] * b1_d2(t)) + (3 * curva.control[1][1] * b2_d2(t)) + (3 * curva.control[2][1] * b3_d2(t)) + (curva.control[3][1] * b4_d2(t));
        var z = (curva.control[0][2] * b1_d2(t)) + (3 * curva.control[1][2] * b2_d2(t)) + (3 * curva.control[2][2] * b3_d2(t)) + (curva.control[3][2] * b4_d2(t));
        return [x,y,z];
    }
  }

  this.generate = generate(this);
  this.generate_d1 = generate_d1(this);
  this.generate_d2 = generate_d2(this);
}
