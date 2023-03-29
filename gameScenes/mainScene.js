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
        width: 512, //324
        height: 256, //260
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
        this.load.tilemapTiledJSON("level", "assets/level.json");
        this.load.tilemapTiledJSON("level2", "assets/level2.json");

        this.load.image("tile", "assets/tile.png");
        this.load.image("flag", "assets/flag.png");
        this.load.image('finish','assets/finish.png');

        this.load.spritesheet('coin', 'assets/coin.png', { frameWidth:18.25 , frameHeight: 16 });
        this.load.spritesheet('mario', 'assets/mario.png',{ frameWidth: 17, frameHeight: 17});
    }

    create() {
        this.scene.start("PlayGame");
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
        super("PlayGame");   
    }
    create() {        
        // codigo de implementação da localização das moedas pelos niveis
        var coinPositions = [
            // coordenadas primeiro nivel
            { x: 300, y: 100 },
            { x: 397, y: 80  },
            { x: 290, y: 260 },
            { x: 390, y: 260 },
            { x: 135, y: 260 },
            { x: 415, y: 310 },
            { x: 287, y: 310 },
            { x: 278, y: 405 },
            { x: 278, y: 405 },
            { x: 35, y: 550 },
            { x: 50, y: 680 },
            { x: 414, y: 680 },
            { x: 680, y: 680 },
            { x: 280, y: 610 },
            { x: 280, y: 610 },
            { x: 607, y: 125 },
            { x: 767, y: 115 },
            { x: 846, y: 100 },
            { x: 550, y: 270 },
            { x: 600, y: 470 },
            { x: 850, y: 400 },
            // coordenadas segundo nivel
            { x: 2300, y: 690 },
            { x: 2118, y: 600 },
            { x: 1870, y: 630 },
            { x: 1650, y: 690 },
            { x: 1700, y: 550 },
            { x: 1900, y: 545 },
            { x: 1900, y: 350 },
            { x: 1675, y: 330 },
            { x: 1675, y: 290 },
            { x: 1675, y: 250 },
            { x: 1910, y: 185 },
            { x: 2000, y: 185 },
            { x: 2075, y: 460 },
            { x: 2133, y: 220 },
            { x: 2170, y: 445 },
            { x: 2272, y: 440 },
            { x: 2223, y: 290 },
            { x: 2510, y: 430 },
            { x: 2525, y: 145 },
            { x: 2325, y: 60  },
            { x: 2134, y: 95  },
            { x: 1934, y: 65  },
          ];

        this.flag = this.physics.add.sprite(770, 650, "flag");
        // codigo de implementação de logo no background do mapa

        // cria um objeto de teclas de seta
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // codigo de implementação do tilemap e tileset no ecrã
        this.map = this.make.tilemap({ key: "level" });
        const tile = this.map.addTilesetImage("tileset01", "tile");
        
        // blocos cujo player colide ao pousar
        this.map.setCollisionBetween(16, 17);
        this.map.setCollisionBetween(21, 22);
        this.map.setCollisionBetween(27, 28);
        this.map.setCollision(40);

        // criação de uma variavel layer que quando é chamada vai para o "layer01" e "layer02" do tilemap "level.json"
        this.layer1 = this.map.createStaticLayer("layer01", tile);
        
        // codigo de implementação do mario (player) e da moeda coletável, juntamente com as suas coordenadas iniciais
        this.coin = this.physics.add.sprite("coin");
        this.mario = this.physics.add.sprite(90, 150, "mario");

        this.mario.body.velocity.x = 0;
        this.mario.body.velocity.y = 0;
        this.mario.body.gravity.y = gameOptions.playerGravity;
        this.mario.setCollideWorldBounds(false);
        
        // codigo para definir a câmera/limites e para seguir o mario
        this.cameras.main.setBounds(0, 0, 4000, 4000);
        this.cameras.main.startFollow(this.mario);
        
        this.startTime = 0;
        this.timeElapsed = 0;
        this.timerText = this.add.text(25, 40, '', { fontFamily: 'Suez One', fontWeight: 'bold',fontWeight: '900', fontSize: '20px', fill: '#000' }).setScrollFactor(0);
        this.scoreText = this.add.text(25, 20, `Score: ${score}`, { fontFamily: 'Suez One', fontWeight: 'bold', fontWeight: '900', fontSize: '20px', fill: '#000' }).setScrollFactor(0);
    
        // codigo de implementação para o mario colidir ao tocar no "bloco"
        this.physics.add.collider(this.mario, this.layer1);
        this.physics.add.collider(this.mario, this.coin, getcoin, null, this);
        this.physics.add.collider(this.mario, this.flag, nxtLvl, null, this);

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
    }

    update(){
        if (this.physics.overlap(this.mario, this.flag)) {
            this.physics.pause(); 
            nxtLvl.call(this);
        }else{
            this.timeElapsed = ((this.time.now - this.startTime) / 1000).toFixed(2);
            this.timerText.setText(`Time: ${this.timeElapsed}`);
        }

        
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

// cheat code "tp next lvl"
        this.input.keyboard.on('keydown_M', function(event) {
            this.mario.x = 2380;
            this.mario.y = 690;
            this.cameras.main.startFollow(this.mario);
        }, this);
        
        this.input.keyboard.on('keydown_C', function(event){
            this.mario.score = 100;
        }, this);


    }
}
// função para a moeda desaparecer quando o mario colidir com ela e o score aumentar
function getcoin(mario, coin){
    coin.disableBody(true, true);
    score += 1;
    this.scoreText.setText('Score: ' + score);
}

// função para quando o mario tocar na bandeira, o mario vai para o segundo nivel
function nxtLvl(mario, flag){
    this.mario.x = 2380;
    this.mario.y = 690;
    this.cameras.main.startFollow(this.mario);
    this.flag.destroy();
    //this.flag = this.physics.add.image(710, 400, "finish");
    //this.timerText = this.add.text(800, 500, '', { fontFamily: 'Suez One', fontWeight: 'bold',fontWeight: '900', fontSize: '50px', fill: '#000' });
}
