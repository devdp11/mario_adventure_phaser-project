let game;

const gameOptions = {
    playerGravity: 1100,
    playerSpeed: 150,
    playerJump: 350,
    playerShift: 300
};

window.onload = function() {
    const gameConfig = {
        type: Phaser.CANVAS,
        width: 512,
        height: 512,
        backgroundColor: '6bccef',
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }   
        },
        scene: [PreloadGame, PlayGame],
    };
    game = new Phaser.Game(gameConfig);
};

class PreloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
    preload() {
        this.load.image("logo", "assets/superMarioLogo.png")
        this.load.tilemapTiledJSON("level", "assets/level.json");
        this.load.image("tile", "assets/tile.png");
        this.load.image("flag", "assets/flag.png");
        this.load.spritesheet('coin', 'assets/coin.png', { frameWidth:18.25 , frameHeight: 16 });
        this.load.spritesheet('mario', 'assets/mario.png',{ frameWidth: 17, frameHeight: 17});
        this.load.image('finish','assets/finish.png');
        //this.load.image("enemy", "assets/enemy.png");
    }

    create() {
        this.scene.start("PlayGame1");
        this.scene.start("Playgame2");
    }
}

//variaveis
var coin;
let scoreText = ""; 
var score = 0;
var flag;
var layer1;

let addCollider = true;

class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame1");   
    }
    create() {        

        // codigo de implementação das moedas pelo mapa segundo as coordenadas colocadas abaixo
        var coinPositions = [
            { x: 300, y: 100},
            { x: 397, y: 80 },
            { x: 290, y: 260},
            { x: 390, y: 260},
            { x: 135, y: 260},
            { x: 415, y: 310},
            { x: 287, y: 310},
            { x: 278, y: 405},
            { x: 278, y: 405},
            { x: 35, y: 550},
            { x: 50, y: 680},
            { x: 414, y: 680},
            { x: 680, y: 680},
            { x: 280, y: 610},
            { x: 280, y: 610},
            { x: 607, y: 125},
            { x: 767, y: 115},
            { x: 846, y: 100},
            { x: 550, y: 270},
            { x: 600, y: 470},
            { x: 850, y: 400},
          ];

        this.flag = this.physics.add.sprite(770, 650, "flag");
        // codigo de implementação de logo no background do mapa
        var logo = this.add.image(500, 400, "logo");

        // cria um objeto de teclas de seta
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // codigo de implementação do tilemap e tileset no ecrã
        this.map = this.make.tilemap({ key: "level" });
        const tile = this.map.addTilesetImage("tileset01", "tile");
        
        // blocos cujo player colide ao pousar
        this.map.setCollisionBetween(15, 17);
        this.map.setCollisionBetween(21, 22);
        this.map.setCollisionBetween(27, 28);
        this.map.setCollision(40);

        // criação de uma variavel layer que quando é chamada vai para o "layer01" e "layer02" do tilemap "level.json"
        this.layer1 = this.map.createStaticLayer("layer01", tile);
        
        // codigo de implementação do mario (player) e da moeda coletável, juntamente com as suas coordenadas iniciais
        this.coin = this.physics.add.sprite(200, 100, "coin");

        this.mario = this.physics.add.sprite(90, 150, "mario");

        this.mario.body.velocity.x = 0;
        this.mario.body.velocity.y = 0;
        this.mario.body.gravity.y = gameOptions.playerGravity;
        this.mario.setCollideWorldBounds(false);
        
        // codigo para definir a câmera/limites e para seguir o mario
        this.cameras.main.setBounds(0, 0, 960, 720);
        this.cameras.main.startFollow(this.mario);

        this.scoreText = this.add.text(25, 35, `score: ${score}`, { fontSize: '16px', fill: '#000' }).setScrollFactor(0);
        //this.timerText = this.add.text(25, 20, `Timer: ${timerCount}`, { fontSize: '16px', fill: '#000' }).setScrollFactor(0);

        //this.timer = this.time.addEvent({
          //  delay: 1000, // Delay in milliseconds
            //callback: this.updateTimer, // Callback function to call each time the timer updates
            //callbackScope: this, // Scope to use for the callback function (in this case, the current scene)
            //loop: true // Whether the timer should loop or not
          //});

        //  this.timerCount = 0;

        // codigo de implementação para o mario colidir ao tocar no "bloco"
        this.physics.add.collider(this.mario, this.layer1);
        this.physics.add.collider(this.mario, this.coin, getcoin, null, this);
        this.physics.add.collider(this.mario, this.flag, getflag, null, this);

        // codigo de implementação para criar as animações e frames que cada animação deve usar tanto do mario como da coin
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'mario', frame: 7 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('mario', { start: 11, end: 12 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 6 }),
            frameRate: 5,
            repeat: -1
        });

        // codigo de implementação para adicionar moedas pelo mapa, serem coletadas quando o mario colide com elas e para estarem sempre a girar ('spin')
        coinPositions.forEach(function(position) {
            var coin = this.physics.add.sprite(position.x, position.y, 'coin');
            coin.setBounce(1);
            coin.setCollideWorldBounds(false);
            coin.anims.play('spin', true);  
            this.physics.add.collider(this.mario, coin, getcoin, null, this);  
          }, this);
        
        // esta função que chama a animação "spin" é para a primeira moeda do jogo que está colocada fora da function coinPositions -- retirar
        this.coin.anims.play('spin', true);

    }

    update(){
        
        //this.timerCount += this.game.loop.delta;

        // codigo para movimentar o mario | falta as animações
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
            this.mario.body.velocity.x = -gameOptions.playerSpeed;
            this.mario.anims.play('left', true);
        } 
        else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
            this.mario.body.velocity.x = gameOptions.playerSpeed;
            this.mario.anims.play('right', true);
        } 
        else {
            this.mario.body.velocity.x = 0;
            this.mario.anims.play('turn');
        }
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown && this.mario.body.onFloor()){
            this.mario.setVelocityY(-gameOptions.playerJump);
        }
    }
}

// função para a moeda desaparecer quando o mario colidir com ela e o score aumentar
function getcoin(mario, coin){
    coin.disableBody(true, true);
    score += 1;
    this.scoreText.setText('score: ' + score);
}

function getflag(mario,flag){
    this.flag = this.physics.add.sprite(710, 400, "finish");
}