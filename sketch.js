//ESTADOS DE JOGO
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//PERSONAGEM
var capivara, capivara_correndo, capivara_morta;

//CHÃO
var chao, chaoInvisivel, imagemChao;

//GRUPOS E IMAGENS
var grupoNuvem, imagemNuvem;
var grupoObstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

//PONTUAÇÃO
var score=0;

//SONS
var jumpSound, collidedSound;

//PERDER
var gameOver, restart;


function preload(){
  //SONS 
  jumpSound = loadSound("jump.mp3")
  collidedSound = loadSound("die.mp3")
  
  //ANIMAÇÃO CAPIVARA
  capivara_correndo = loadAnimation("animacao1.png", "animacao2.png", "animacao3.png", "animacao4.png"); 
  capivara_morta = loadAnimation("animacao_morta.png");
  
  //CARREGAR ANIMAÇÃO DO CHÃO
  imagemChao = loadImage("chao.png");
  
  // CARREGAR ANIMAÇÃO DA NUVEM
  imagemNuvem = loadImage("nuvem.png");
  
  //CARREGAR ANIMAÇÃO DOS OBSTÁCULOS
  obstaculo1 = loadImage("obstaculo.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");

  //CARREGAR ANIMAÇÃO DE DERROTA
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  //PROPORÇÕES DA TELA
  createCanvas(windowWidth, windowHeight);
  
  //CRIANDO A CAPIVARA
  capivara = createSprite(50,height-70,20,50);
  
  //ANIMANDO A CAPIVARA
  capivara.addAnimation("correndo", capivara_correndo);
  capivara.addAnimation("morta", capivara_morta);
  capivara.setCollider('circle',0,0,30)
  capivara.scale = 1;
  //capivara.debug=true
  
  //CRIANDO O CHÃO INVISÍVEL
  chaoInvisivel = createSprite(width/2,height-10,width,125);  
  chaoInvisivel.shapeColor = "#f4cbaa";
  
  //CRIANDO O CHÃO
  chao = createSprite(width/-40,height-40);
  chao.scale = 1.35;
  chao.addImage("asfalto",imagemChao);
  chao.x = width/2
  chao.velocityX = -(6 + 3*score/100);
  
 

  //CRIANDO GAME OVER
  gameOver = createSprite(width/2,height/3.50- 50);
  gameOver.addImage(gameOverImg);
  
  //CRIANDO RESTART
  restart = createSprite(width/2,height/1.70);
  restart.addImage(restartImg);
  
  //ESCALAS GAME OVER E RESTART
  gameOver.scale = 0.75;
  restart.scale = 1;

  //VER OU NÃO GAME OVER E RESTART
  gameOver.visible = false;
  restart.visible = false;
  
  //VER OU NÃO CHÃO INVISÍVEL
  chaoInvisivel.visible =false

  //CRIANDO GRUPO DE NUVENS E OBSTACULOS
  grupoNuvem = new Group();
  grupoObstaculos = new Group();
  
 
  
}

function draw() {
  //capivara.debug = true;

  //ESTADO DE JOGO = PLAY
  if (gameState===PLAY){

    //PONTUAÇÃO
    score = score + Math.round(getFrameRate()/60);
    chao.velocityX = -(6 + 3*score/100);
    
    //PONTUAÇÃO = 0
    score = 0;

    //APARECER PONTUAÇÃO
    textSize(20);
    fill("black")
    text("Pontuação: "+ score,30,50);

    //COMANDO DE PULO
    if((touches.length > 0 || keyDown("SPACE")) && capivara.y  >= height-120) {
      jumpSound.play( )
      capivara.velocityY = -15;
       touches = [];
    }
    
    //GRAVIDADE DA CAPIVARA
    capivara.velocityY = capivara.velocityY + 0.8
  
    //PROFUNDIDADE DO CHÃO EM RELAÇÃO A CAPIVARA
    chao.depth = capivara.depth;
    capivara.depth +=1;

    //CHÃO EM MOVIMENTO
    if (chao.x < 0){
      chao.x = chao.width/2; 
    }

    //CAPIVARA NÃO VOAR
    capivara.collide(chaoInvisivel);

    //CHAMAR FUNÇÕES
    criarNuvens();
    criarObstáculos();
  
    //FAZER VOCÊ PERDER (:<
    if(grupoObstaculos.isTouching(capivara)){
        collidedSound.play()
        gameState = END;
    }
  }//GAMESTATE = END
  else if (gameState === END) {
    //VER GAMEOVER E RESTART
    gameOver.visible = true;
    restart.visible = true;

    //A CAPIVARA FAZER COM SEUS PODERES FAZER A TUDO PARAR DE GIRAR
    chao.velocityX = 0;
    capivara.velocityY = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvem.setVelocityXEach(0);
    
    //CAPIVARA IR DE F ): 
    capivara.changeAnimation("morta",capivara_morta);
    
    //"VIDA ETERNA AS NUVENS E AOS OBSTACULOS"CAPIVARA,(-4,000,000,000-PARA SEMPRE O:)
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvem.setLifetimeEach(-1);
    
    //VOLTAR A VIDA (DEPOIS QUEREM DIZER QUE A CAPIVARA NÃO É IMORTAL KKKK)
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  //FUNDO AZUL  (PELO MENOS ALGUMA COISA NORMAL NESSE JOGO KKKK)
  background("lightblue");

  //DESENHAR SPRITES
  drawSprites();
}

function criarNuvens() {
  
    //NUVENS ALEATÓRIAS
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(width+20,height-300,40,10);
    nuvem.y = Math.round(random(100,220));
    nuvem.addImage(imagemNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    nuvem.lifetime = 1500;
    
    //PROFUNDIDADE ÁS NUVENS
    nuvem.depth = capivara.depth;
    capivara.depth = capivara.depth+1;
    
    //nuvem foi adicionada ao grupo
    grupoNuvem.add(nuvem);
  }
  
}

function criarObstáculos() {
  // CRIAR OBSTÁCULOS (EU ACHO)
  if(frameCount % 60 === 0) {
    var obstaculo = createSprite(1500,height-95,20,30);
    obstaculo.setCollider("circle",0,0,40)
    //obstaculo.debug = true

    chao.depth = obstaculo.depth;
    obstaculo.depth += 1;

    //VELOCIDADE OBSTÁCULOS
    obstaculo.velocityX = -(6 + 3*score/100);
    
    //OBSTACULOS ALEATÓRIOS 
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;        
      default: break;
    }
    
    obstaculo.scale = 0.75;

    obstaculo.lifetime = 300;
    
    obstaculo.depth = capivara.depth;
    capivara.depth +=1;
  
    
    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  grupoObstaculos.destroyEach();
  grupoNuvem.destroyEach();
  
  capivara.changeAnimation("correndo",capivara_correndo);
  
  score = 0;
  
}
