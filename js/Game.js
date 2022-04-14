class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadeboardTitle = createElement("h2"); 
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.PlayerMoving = false;
    this.esquerdinha = false;

  }


  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }

  update(state) {
    database.ref("/").update({
      gameState: state
   });
 }
 addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions=[]){
   for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
     
    if (positions.length > 0) {
      x=positions[i].x;
      y=positions[i].y;
      spriteImage = positions[i].image;
    } else {
      x = random(width/2 + 150, width/2 -150);
      y = random(-height *4.5, height-400);
    }



      var sprite = createSprite(x,y);
      sprite.addImage("sprete",spriteImage )
      sprite.scale = scale;
      spriteGroup.add(sprite)
   }
  }
  start() {
    form = new Form();
    form.display();

    player = new Player();
    playerCount = player.getCount();

    //37
    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    car1.addImage("blast", blastImg);
    car2.addImage("blast", blastImg);

    cars = [car1, car2];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(fuels, 8, fuelImg, 0.02)
    this.addSprites(coins, 20, coinImg, 0.07)
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
  }

  //37
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  //37
  play() {
    this.handleElements();
    this.handleResetButton();
   
    player.getCarsAtEnd();
    Player.getPlayersInfo();



    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
     
     this.showLife();
     this.showFuelBar();
      this.showLeaderboard(); 
      var index = 0 
      for (var plr in allPlayers) {
        index += 1
        var x = allPlayers[plr].positionX
        var y = height-allPlayers[plr].positionY

        //salva o valor de player.life na var currentLife
        var currentlife = allPlayers[plr].life;

        //verifica se a vida atual é < 0, para mudar a animação para blast
        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.3;
        }


        cars[index-1].position.x=x
        cars[index-1].position.y=y

        if (index === player.index) {
          stroke(15);
          fill("red");
          ellipse(x,y,60,60);

          this.handlePowerCoins(index)
          this.handleFuel(index)
          this.handleObstacleCollision(index)

          camera.position.y = cars[index-1].position.y;
        }
      }

      const finishLine = height*6-100;

      if (player.positionY>finishLine) {
        gameState=2
        player.rank+=1
        Player.updateCarsAtEnd(player.rank);  
        player.update();
        this.showRank();
      }

      this.handlePlayerControls()
      
      drawSprites();
    }
  }
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
    handlePlayerControls() {
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10
        this.PlayerMoving = true
        player.update()
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5;
        player.update();
        this.esquerdinha=true
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 5;
        player.update();
        this.esquerdinha=false
      }
      if (keyIsDown(DOWN_ARROW)) {
        player.positionY += -10
        player.update()
      }
      if (keyIsDown(32)) {
        this.PlayerMoving = false
        player.update()
      }
    }
    
    

    handleResetButton(){
      this.resetButton.mousePressed(  ()=>{
        database.ref("/").set({
          carsAtEnd:0,
          playerCount:0,
          gameState:0,
          player: {}


        })
        window.location.reload();
      })

    }

    handleFuel(index) {
      //adicionando combustível
      cars[index - 1].overlap(fuels, function(collector, collected) {
        player.fuel = 185;
        //o sprite é coletado no grupo de colecionáveis que desencadeou
        //o evento
        collected.remove();
      });

      if (player.fuel> 0 && this.PlayerMoving){
        player.fuel -=0.5;
      }

      if (player.fuel<=0) {
        gameState=2
        this.gameOver()
      }

    }
  
    handlePowerCoins(index) {
      cars[index - 1].overlap(coins, function(collector, collected) {
        player.score += 20;
        player.update();
        //o sprite é coletado no grupo de colecionáveis que desencadeou
        //o evento
        collected.remove();
      });
    }

    showRank() {
      swal({
        title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });

    }
    showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
      noStroke();
      pop();
    }
    showFuelBar() {
      push();
      image(fuelImg, width / 2 - 130, height - player.positionY - 325, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 325, 185, 20);
      fill("#ffc400");
      rect(width / 2 - 100, height - player.positionY - 325, player.fuel, 20);
      noStroke();
      pop();
    }

    gameOver() {
      swal({
        title: `Fim de Jogo`,
        text: "Oops você perdeu a corrida!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Obrigado por jogar"
      });
    }

    handleObstacleCollision(index) {
      if(cars[index-1].collide(obstacles)){
        if (this.esquerdinha) {
          player.positionX+=100;
        } else {
          player.positionX-=100;
        }

        if (player.life>0) {
          player.life -= 185/4
        }
      }
       player.update(); 
    }
}

  

