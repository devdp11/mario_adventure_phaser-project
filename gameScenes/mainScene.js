let game;

const gameOptions = {
    playerGravity: 1100,
    playerSpeed: 150,
    playerJump: 350,
    playerShift: 300
};

window.onload = function () {
    const gameConfig = {
        type: Phaser.CANVAS,
        width: 512, //324
        height: 512, //260
        backgroundColor: '6bccef',
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: [PreloadGame, MenuScene, PlayGame, GameOverScene],
    };
    game = new Phaser.Game(gameConfig);
};

class PreloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
    preload() {
        this.load.tilemapTiledJSON("level", "assets/tile/map/level.json");
        this.load.image("tile", "assets/tile/tile.png");

        this.load.image("flag", "assets/img/flag.png");
        this.load.image("flag2", "assets/img/flag2.png");
        this.load.image('over', 'assets/img/platform.png');
        this.load.image('collide','assets/img/collide.png');

        this.load.spritesheet('coin', 'assets/spritesheet/coin.png', { frameWidth: 18.29, frameHeight: 16 });
        this.load.spritesheet('mario', 'assets/spritesheet/mario.png', { frameWidth: 17, frameHeight: 17 });
        this.load.spritesheet('enemy', 'assets/spritesheet/enemy.png', { frameWidth: 40.8, frameHeight: 35 });

        this.load.audio('coinSound', 'assets/audio/sound_coin.wav');
        this.load.audio('jumpSound', 'assets/audio/sound_jump.wav');
        this.load.audio('lvlupSound', 'assets/audio/sound_lvl_up.wav');
        this.load.audio('losseGameSound', 'assets/audio/sound_losse_game.wav');
        this.load.audio('sceneSound', 'assets/audio/sound_scene.mp3');
        this.load.audio('losseLiveSound', 'assets/audio/sound_losse_live.wav');
        this.load.audio('restart', 'assets/audio/sound_restart.mp3');
    }

    create() {
        this.scene.start("menu");
    }
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super("menu")
    }

    start_button = null

    preload() { }

    create() {
        //pagina inicial
        this.start_button = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, "Start Game")
            .setOrigin(0.5)
            .setPadding(30, 10)
            .setStyle({
                backgroundColor: "#fff",
                fill: "#111",
                fontSize: 24,
                fontStyle: "bold"
            })
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("game")
            })
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameover")
    }

    start_button = null
    text = null

    preload() { }

    //pagina Restart
    create() {
        this.start_button = this.add.text(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, "Restart")
            .setOrigin(0.5)
            .setPadding(30, 10)
            .setStyle({
                backgroundColor: "#fff",
                fill: "#111",
                fontSize: 24,
                fontStyle: "bold"
            })
            .setInteractive()
            .on('pointerup', () => {
                const game = this.scene.get("game");
                game.scene.restart();
                this.scene.start("game");
            })
    }
}


class PlayGame extends Phaser.Scene {
    constructor() {
        super("game");
    }

    collide;
    coin;
    enemy;
    scoreText = "";
    scoreTextlive = "";
    score = 0;
    lives = 3;
    flag;
    flag2;
    layer1;
    plataform1;
    plataform2;
    addCollider = true;
    isGameOver = false;
    isInvencible = false;
    isRestart = false;

    create() {
        this.isGameOver = false;
        this.isInvencible = false;
        
        this.score = 0;
        this.startTime = 0;
        this.lives = 3;
        if(this.isRestart){
            this.startTime = this.time.now;
        }

        var coinPositions = [
            { x: 300, y: 100 },
            { x: 397, y: 80 },
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
            { x: 2325, y: 60 },
            { x: 2134, y: 95 },
            { x: 1934, y: 65 },
        ];

        var enemyPositions = [
            { x: 442, y: 258 },
            { x: 90, y: 690 },
            { x: 825, y:  258},
            { x: 820, y:  401},
            { x: 353, y:  145},

            { x: 2024, y:  353},
            { x: 2380, y:  497},
            { x: 1740, y:  689},
            { x: 1975, y:  113},
        ];
        this.platform1 = this.physics.add.staticGroup();
        this.platform1.create(400, 875, 'over').setScale(2).refreshBody();
        this.platform2 = this.physics.add.staticGroup();
        this.platform2.create(2200, 875, 'over').setScale(2).refreshBody();


        this.soundFx = this.sound.add('coinSound');
        this.soundFx = this.sound.add('jumpSound');
        this.soundFx = this.sound.add('lvlupSound');
        this.soundFx = this.sound.add('loseliveSound');
        this.soundFx = this.sound.add('restart');
        this.a = this.sound.add('losseLiveSound');
      

        if (typeof this.playedMusic == 'undefined') {
            this.sound.play('sceneSound', { loop: true , volume: 0.01});
            this.playedMusic = true;
        }
     
        

        this.flag = this.physics.add.sprite(770, 650, "flag");
        this.flag2 = this.physics.add.sprite(1728, 90, "flag2");

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

        this.layer1 = this.map.createStaticLayer("layer01", tile);

        this.mario = this.physics.add.sprite(90, 150, "mario");
        this.mario.body.velocity.x = 0;
        this.mario.body.velocity.y = 0;
        this.mario.body.gravity.y = gameOptions.playerGravity;
        this.mario.setCollideWorldBounds(false);

        this.cameras.main.setBounds(0, 0, 4000, 4000);
        this.cameras.main.startFollow(this.mario);
        
        this.timerText = this.add.text(25, 40, '', { fontFamily: 'Suez One', 
            fontWeight: 'bold', 
            fontWeight: '900', 
            fontSize: '20px', 
            fill: '#000' }).setScrollFactor(0);
            
        this.scoreText = this.add.text(25, 20, `Score: ${this.score}`, { fontFamily: 'Suez One',
            fontWeight: 'bold',
            fontWeight: '900',
            fontSize: '20px',
            fill: '#000' }).setScrollFactor(0);
            
        this.scoreTextlives = this.add.text(25, 60, `Lives: ${this.lives}`, { fontFamily: 'Suez One',
            fontWeight: 'bold',
            fontWeight: '900',
            fontSize: '20px',
            fill: '#000' }).setScrollFactor(0);

        this.physics.add.collider(this.mario, this.layer1);
        this.physics.add.collider(this.mario, this.flag, this.nxtLvl, null, this);
        this.physics.add.collider(this.mario, this.flag2, this.finishGame, null, this);

        this.physics.add.collider(this.mario, this.platform1, this.outGame1, null, this);
        this.physics.add.collider(this.mario, this.platform2, this.outGame2, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'mario', frame: 7 }],
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

        coinPositions.forEach((position) => {
            var coin = this.physics.add.sprite(position.x, position.y, 'coin');
            coin.setBounce(1);
            coin.setCollideWorldBounds(false);
            coin.anims.play('spin', true);
            this.physics.add.collider(this.mario, coin, this.getcoin, null, this);
        }, this);
        
        enemyPositions.forEach((position) => {
            var enemy = this.physics.add.sprite(position.x, position.y, 'enemy');
            this.physics.add.collider(enemy, this.layer1);
            this.physics.add.collider(this.mario, enemy, this.loselive, null, this);
            enemy.setImmovable(true);
          }, this); 

        this.input.keyboard.on('keydown_M', function (event) {
            this.mario.x = 650;
            this.mario.y = 700;
            this.cameras.main.startFollow(this.mario);
        }, this);

        this.input.keyboard.on('keydown_P', function (event) {
            this.mario.x = 1828;
            this.mario.y = 100;
            this.cameras.main.startFollow(this.mario);
        }, this);

        this.input.keyboard.on('keydown_C', function (event) {
            this.sound.play('coinSound', { volume: 0.025 });
            this.score += 1000;
            this.scoreText.setText('Score: ' + this.score);
        }, this);
          
    }

    update() {
        if (this.isGameOver){
          return;
        }
            this.timeElapsed = ((this.time.now - this.startTime) / 1000).toFixed(2);
            this.timerText.setText(`Time: ${this.timeElapsed}`);
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown ){
                this.mario.setVelocityY(300);
        }  
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
            this.sound.play('jumpSound', {volume: 0.025});
            this.mario.setVelocityY(-gameOptions.playerJump);
        }
        
    }

    getcoin(mario, coin) {
        coin.destroy();
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
        this.sound.play('coinSound', { volume: 0.025 });
    }
    outGame1() {
        this.mario.x = 90;
        this.mario.y = 150;
        this.cameras.main.startFollow(this.mario);
        this.sound.play('losseLiveSound', { volume: 0.025 });
        this.loselive();
    }
    outGame2() {
        this.mario.x = 2380;
        this.mario.y = 690;
        this.cameras.main.startFollow(this.mario);
        this.sound.play('losseLiveSound', { volume: 0.025 });
        this.loselive();
    }
    loselive(){
        if (!this.soundPlayed) {
            this.a.play();
            this.soundPlayed = true;
        }

        if(!this.isInvencible){
            this.lives -= 1;
            this.scoreTextlives.setText('Lives: ' + this.lives);
            this.isInvencible = true;
            this.sound.play('losseLiveSound', { volume: 0.025 });
            setTimeout(()=>{
                this.isInvencible = false;
            }, 1500);

            if(this.lives <= 0){
                this.finishGame();
                
            }
        }
    }
    nxtLvl(mario, flag) {
        this.mario.x = 2380;
        this.mario.y = 690;
        this.cameras.main.startFollow(this.mario);
        this.sound.play('lvlupSound', { volume: 0.025 });
        
        
        this.flag.body.setVelocityX(0);
        
            this.score = 0;
            this.scoreText.setText('Score: ' + this.score);
            this.startTime = this.time.now;
            this.lives = 3;
            this.scoreTextlives.setText('Lives: ' + this.lives);
    }
    finishGame(mario, flag2){ 
        this.scene.start('gameover');
        this.isGameOver = true;
        this.isRestart = true;
        this.playedMusic = false;
    }
}