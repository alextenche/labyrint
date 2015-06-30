//set main namespace
goog.provide('labyrint');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('labyrint.Frog');

// constants for directions
var NORTH = 1;
var EAST  = 2;
var SOUTH = 3;
var WEST  = 4;


// entrypoint
labyrint.start = function(){

    this.lime = lime;

	this.director = new this.lime.Director(document.body,1600,780);
    this.director.makeMobileWebAppCapable();
    this.director.setDisplayFPS(false);
    this.gameScene = new this.lime.Scene();
    this.gameScene.setRenderer(this.lime.Renderer.CANVAS);

    //set main game objects
    var gameBackground = new this.lime.Sprite()
                .setSize(1080,780)
                .setPosition(0,0)
                .setFill("#EEEEEE")
                .setAnchorPoint(0,0);
    this.frog = new labyrint.Frog();
    this.walls = [];
    this.badges = [];
    this.createWalls();
    this.createBadges();
    this.positionBadgesAndFrog();
    this.badgesEarned = 0;

    // create game buttons
    var analogStick = new this.lime.Sprite().setSize(350,372).setPosition(1150,400).setFill('img/analogStick.png').setAnchorPoint(0,0);
    var buttonUp = new this.lime.Sprite().setSize(120,120).setPosition(1265,400).setAnchorPoint(0,0);
    var buttonRight = new this.lime.Sprite().setSize(115,114).setPosition(1384,518).setAnchorPoint(0,0);
    var buttonDown = new this.lime.Sprite().setSize(120,120).setPosition(1265,631).setAnchorPoint(0,0);
    var buttonLeft = new this.lime.Sprite().setSize(115,114).setPosition(1151,518).setAnchorPoint(0,0);

    // add events to four buttons
    goog.events.listen(buttonUp,["mousedown","touchstart"],function(e) {
        this.startMovement(NORTH);
    }, null, this.frog);
    goog.events.listen(buttonRight,["mousedown","touchstart"],function(e) {
        this.startMovement(EAST);
    }, null, this.frog);
    goog.events.listen(buttonDown,["mousedown","touchstart"],function(e) {
        this.startMovement(SOUTH);
    }, null, this.frog);
    goog.events.listen(buttonLeft,["mousedown","touchstart"],function(e) {
        this.startMovement(WEST);
    }, null, this.frog);

    // add events for keypressed
    goog.events.listen(goog.global, ['keydown', 'keyup'], function (e) {
        switch (e.keyCode) {
            case 37: //LEFT
                this.startMovement(WEST);
                break;
            case 65: //A
                this.startMovement(WEST);
                break;
            case 38: //NORTH
                this.startMovement(NORTH);
                break;
            case 87: //W
                this.startMovement(NORTH);
                break;          
            case 39: //Right
                this.startMovement(EAST);
                break;
            case 68: //D
                this.startMovement(EAST);
                break;
            case 40: //Down
                this.startMovement(SOUTH);
                break;
            case 83: //S
                this.startMovement(SOUTH);
                break;
        }
    }, null, this.frog);

    // add one task to the schedule manager: check if the frog is moving
    this.lime.scheduleManager.schedule(function(dt) {
        this.checkVictory();
        this.checkMovement(dt);
    }, labyrint);

    // add objects to the main game scene
    this.gameScene.appendChild(gameBackground);
    for (var i=0;i<this.walls.length;i++) {
        this.gameScene.appendChild(this.walls[i]);
    }
    for (i=0;i<this.badges.length;i++) {
        this.gameScene.appendChild(this.badges[i]);
    }
    this.gameScene.appendChild(this.frog);
    this.gameScene.appendChild(analogStick);
    this.gameScene.appendChild(buttonUp);
    this.gameScene.appendChild(buttonRight);
    this.gameScene.appendChild(buttonDown);
    this.gameScene.appendChild(buttonLeft);

    // set the scene
    this.director.replaceScene(this.gameScene);

};

labyrint.positionBadgesAndFrog = function() {
  var badgeCoordinates = [
        [390,390],
        [840,240],
        [990,390],
        [90,90]
  ];
  for (var i=0;i<this.badges.length;i++) {
        this.badges[i].setPosition(badgeCoordinates[i][0],badgeCoordinates[i][1]);
  }
  this.frog.setPosition(90,690);
};

labyrint.createBadges = function() {
    var badges = [];
    var badgeNames = [
        ["html"],
        ["css"],
        ["js"],
        ["php"]
    ];
    var i;
    for (i=0;i<badgeNames.length;i++) {
        var current = badgeNames[i];
        var badge = new this.lime.Sprite().setSize(80,87).setFill('img/badge-' + current[0] + '.png');
        this.badges.push(badge);
    }
};

labyrint.createWalls = function() {
    t = 30;
    var walls = [];
    var wallCoordinates = [
        [0,0,35*t,t],
        [0,0,t,26*t],
        [35*t,0,36*t,26*t],
        [0,25*t,36*t,35*t],
        [0,25*t,36*t,35*t],
        [0,10*t,5*t,11*t],
        [5*t,5*t,16*t,6*t],
        [15*t,5*t,16*t,11*t],
        [15*t,5*t,16*t,11*t],
        [15*t,10*t,21*t,11*t],
        [20*t,10*t,21*t,16*t],
        [5*t,15*t,21*t,16*t],
        [10*t,10*t,11*t,16*t],
        [5*t,20*t,11*t,21*t],
        [5*t,20*t,6*t,26*t],
        [15*t,15*t,16*t,26*t],
        [20*t,0*t,21*t,6*t],
        [25*t,5*t,36*t,6*t],
        [25*t,5*t,26*t,11*t],
        [30*t,10*t,36*t,11*t],
        [30*t,10*t,31*t,16*t],
        [25*t,15*t,30*t,16*t],
        [25*t,15*t,26*t,20*t],
        [20*t,20*t,26*t,21*t],
        [30*t,20*t,31*t,26*t]
    ];
    for (var i=0;i<wallCoordinates.length;i++) {
        var current = wallCoordinates[i];
        var wall = new this.lime.Sprite()
            .setAnchorPoint(0,0)
            .setPosition(current[0],current[1]).setSize(current[2]-current[0],current[3]-current[1])
            .setFill('#222222');
        this.walls.push(wall);
    }
};

labyrint.checkMovement = function(dt) {

    if (this.frog.isMoving) {

        // determine future position
        var futureX = this.frog.getPosition().x;
        var futureY = this.frog.getPosition().y;
        switch (this.frog.direction) {
          case NORTH:
            futureY = futureY - this.frog.speed*dt;
            break;
          case EAST:
            futureX = futureX + this.frog.speed*dt;
            break;
          case SOUTH:
            futureY = futureY + this.frog.speed*dt;
            break;
          case WEST:
            futureX = futureX - this.frog.speed*dt;
            break;
        }

        // check if future position hits an obstacle
        // stop movement and return false if so
        futureTopY = futureY - (this.frog.getSize().height/2);
        futureBottomY = futureTopY + this.frog.getSize().height;
        futureLeftX = futureX - (this.frog.getSize().width/2);
        futureRightX = futureLeftX + this.frog.getSize().width;
        var i;
        for(i in this.walls) {
            wall = this.walls[i];
            wallTopY = wall.getPosition().y;
            wallBottomY = wallTopY+wall.getSize().height;
            wallLeftX = wall.getPosition().x;
            wallRightX = wallLeftX+wall.getSize().width;
            if (futureRightX > wallLeftX && futureLeftX < wallRightX && futureBottomY > wallTopY && futureTopY < wallBottomY) {
                this.frog.isMoving = false;
                return false;
            }
        }

        // if no obstacles are hit, move the frog
        this.frog.setPosition(futureX, futureY);

        // check if new position hits a badge
        for(i in this.badges) {
            badge = this.badges[i];
            badgeTopY = badge.getPosition().y-(badge.getSize().height/2);
            badgeBottomY = badgeTopY+badge.getSize().height;
            badgeLeftX = badge.getPosition().x-(badge.getSize().width/2);
            badgeRightX = badgeLeftX+badge.getSize().width;
            if (futureRightX > badgeLeftX && futureLeftX < badgeRightX && futureBottomY > badgeTopY && futureTopY < badgeBottomY) {
                this.badgesEarned++;
                this.badges[i].setPosition(1200+50*this.badgesEarned,100);
            }
        }
    }
};

labyrint.checkVictory = function() {
  if (this.badgesEarned == this.badges.length) {
    alert('Congrat!');
    this.badgesEarned = 0;
    this.frog.isMoving = false;
    this.positionBadgesAndFrog();
  }
};



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('labyrint.start', labyrint.start);
