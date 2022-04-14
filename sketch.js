var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount = 0;
var gameState;
var car1_img, car2_img, track;
var allPlayers, car1, car2;
var cars = [];
var fuelImg, coinImg, obstacle1Image, obstacle2Image, lifeImage, blastImg;
var coins, fuels, obstacles, life;


function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  //37
  car1_img = loadImage("assets/car1.png");
  car2_img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");
  fuelImg = loadImage("assets/fuel.png");
  coinImg = loadImage("assets/goldCoin.png");
  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");
  lifeImage = loadImage("assets/life.png");
  blastImg = loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  //37
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
