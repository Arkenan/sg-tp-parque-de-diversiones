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

  this.getInterpolated = function() {
    var pointsInterpolated = [this.control[0],this.control[this.control.length - 1]];
    return pointsInterpolated;
  }

  this.generate = function(t){
    var x = (this.control[0][0] * b1(t)) + (3 * this.control[1][0] * b2(t)) + (3 * this.control[2][0] * b3(t)) + (this.control[3][0] * b4(t));
    var y = (this.control[0][1] * b1(t)) + (3 * this.control[1][1] * b2(t)) + (3 * this.control[2][1] * b3(t)) + (this.control[3][1] * b4(t));
    var z = (this.control[0][2] * b1(t)) + (3 * this.control[1][2] * b2(t)) + (3 * this.control[2][2] * b3(t)) + (this.control[3][2] * b4(t));
    return [x,y,z];
  }

  this.generate_d1 = function(t){
    var x = (this.control[0][0] * b1_d1(t)) + (3 * this.control[1][0] * b2_d1(t)) + (3 * this.control[2][0] * b3_d1(t)) + (this.control[3][0] * b4_d1(t));
    var y = (this.control[0][1] * b1_d1(t)) + (3 * this.control[1][1] * b2_d1(t)) + (3 * this.control[2][1] * b3_d1(t)) + (this.control[3][1] * b4_d1(t));
    var z = (this.control[0][2] * b1_d1(t)) + (3 * this.control[1][2] * b2_d1(t)) + (3 * this.control[2][2] * b3_d1(t)) + (this.control[3][2] * b4_d1(t));
    return [x,y,z];
  }

  this.generate_d2 = function(t){
    var x = (this.control[0][0] * b1_d2(t)) + (3 * this.control[1][0] * b2_d2(t)) + (3 * this.control[2][0] * b3_d2(t)) + (this.control[3][0] * b4_d2(t));
    var y = (this.control[0][1] * b1_d2(t)) + (3 * this.control[1][1] * b2_d2(t)) + (3 * this.control[2][1] * b3_d2(t)) + (this.control[3][1] * b4_d2(t));
    var z = (this.control[0][2] * b1_d2(t)) + (3 * this.control[1][2] * b2_d2(t)) + (3 * this.control[2][2] * b3_d2(t)) + (this.control[3][2] * b4_d2(t));
    return [x,y,z];
  }
}
