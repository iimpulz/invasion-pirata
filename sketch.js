const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var cannonball;
var boat;

var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];
var boatAnimation = [];
var boatSpriteData, boatSpriteSheet;
var brokenAnimation = [];
var brokenSpriteData, brokenSpriteSheet;
var waterAnimation = [];
var waterSpriteData, waterSpriteSheet;

var cannon_explosion;
var pirate_laugh;
var background_music;

var score = 0;
var isGameOver = false;
var isLaughing = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");
  brokenSpriteData = loadJSON("./assets/boat/brokenBoat.json");
  brokenSpriteSheet = loadImage("./assets/boat/brokenBoat.png");
  waterSpriteData = loadJSON("./assets/waterSplash/waterSplash.json");
  waterSpriteSheet = loadImage("./assets/waterSplash/waterSplash.png");
  cannon_explosion = loadSound("./assets/cannon_explosion.mp3");
  pirate_laugh = loadSound("./assets/pirate_laugh.mp3");
  background_music = loadSound("./assets/background_music.mp3");
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15;

  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  cannon = new Cannon(180,110,130,100,angle);
  
  var boatFrames = boatSpriteData.frames;
  for(var i=0; i<boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenFrames = brokenSpriteData.frames;
  for(var i=0; i<brokenFrames.length; i++){
    var pos = brokenFrames[i].position;
    var img = brokenSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenAnimation.push(img);
  }

  var waterFrames = waterSpriteData.frames;
  for(var i=0; i<waterFrames.length; i++){
    var pos = waterFrames[i].position;
    var img = waterSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    waterAnimation.push(img);
  }
}

function draw() {
  image(backgroundImg,0,0,1200,600)
  Engine.update(engine);
  
  if(!background_music.isPlaying()){
    background_music.setVolume(0.1);
    background_music.play();
  }

  rect(ground.position.x, ground.position.y, width * 2, 1);
  //rect(tower.position.x, tower.position.y,160, 310);

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.show();
  for(var i=0; i<balls.length; i++){
    showCannonballs(balls[i], i);
    destroyBoats(i);
  }
  showBoats();

  textSize(30);
  fill("Black");
  text("Puntuacion: "+ score, width-200, 50);
  textAlign(CENTER, CENTER);
}

function showCannonballs(ball, index){
  if(ball){
    ball.display();
    ball.animate();
    if(ball.body.position.x >= width || ball.body.position.y >= height-50){
      ball.remove(index);
    }
  }
}

function keyPressed(){
  if(keyCode===DOWN_ARROW){
    cannonball = new Cannonball(cannon.x,cannon.y);
    balls.push(cannonball);
    balls[balls.length-1].shoot()
    cannon_explosion.setVolume(0.1);
    cannon_explosion.play();
  }
}

function showBoats(){
  if(boats.length>0){
    if(boats[boats.length-1]===undefined || boats[boats.length-1].body.position.x<width-300){
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      boat = new Boat(width, height-100, 170, 170, position, boatAnimation);
      boats.push(boat);
    }

    for(var i=0; i<boats.length; i++){
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body, {x:-0.8, y:0});
        boats[i].display();
        boats[i].animate();
        var collision = Matter.SAT.collides(this.tower, boats[i].body);
        if(collision.collided && !boats[i].isBroken){
          if(!isLaughing && !pirate_laugh.isPlaying()){
            pirate_laugh.setVolume(0.1);
            pirate_laugh.play();
            boats[i].remove(i);
          }
          isGameOver=true;
          gameOver();
        }
      }
    }
  }

  else{
    boat = new Boat(width-80,height-60,170,170,-80, boatAnimation);
    boats.push(boat);
  }
}

function destroyBoats(index){
  for(var i=0; i<boats.length; i++){
    if(balls[index] !== undefined && boats[i] !== undefined){
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if(collision.collided){
        score += 5;
        boats[i].remove(i);
        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function gameOver(){
  swal({
    title: "Fin Del Juego", 
    text: "Gracias Por Jugar", 
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "150x150",
    confirmButtonText: "Jugar De Nuevo"
  },
  function (isConfirm){
    if(isConfirm){
      location.reload();
    }
  })
}