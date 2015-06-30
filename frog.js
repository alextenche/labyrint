//set main namespace
goog.provide('labyrint.Frog');

//get requirements
goog.require('lime.Sprite');

// entrypoint
labyrint.Frog = function(){

    goog.base(this);

    this.setSize(80, 58).setFill('img/programmer.png');
    this.isMoving = false;
    this.direction = NORTH;
    this.speed = 0.3;
};

goog.inherits(labyrint.Frog, lime.Sprite);

labyrint.Frog.prototype.startMovement = function(direction){
    this.isMoving = true;
    this.direction = direction;
};