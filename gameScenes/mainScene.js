let game;

const gameOptions = {
    playerGravity: 1100,
    playerSpeed: 150,
    playerJump: 350
};

window.onload = function() {
    const gameConfig = {
        type: Phaser.CANVAS,
        width: 256,
        height: 256,
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
        this.load.image("tile", "assets/tile.png");
        this.load.image("mario", "assets/mario.png");
        this.load.image("logo", "assets/superMarioLogo.png")
    }

    create() {
        this.scene.start("PlayGame");
    }
}

var jumpButton;
var runButton;
var result;
var shiftCooldown = 10;
let addCollider = true;


class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {

        var logo = this.add.image(500, 400, "logo");

        // cria um objeto de teclas de seta
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // cria o tilemap
        this.map = this.make.tilemap({ key: "level" });
        const tile = this.map.addTilesetImage("tileset01", "tile");
        
        this.map.setCollisionBetween(16, 17);
        this.map.setCollisionBetween(27, 28);
        this.map.setCollisionBetween(21, 22);
        this.map.setCollision(40);

        this.layer = this.map.createStaticLayer("layer01", tile);
    
        // cria o sprite do personagem e as coordenadas 
        this.mario = this.physics.add.sprite(90, 150, "mario");
        this.mario.body.velocity.x = 0;
        this.mario.body.velocity.y = 0;
        this.mario.body.gravity.y = gameOptions.playerGravity;
        this.mario.setCollideWorldBounds(false);
        
        // codigo para definir a câmera/limites e para seguir o mario
        this.cameras.main.setBounds(0, 0, 1920, 1440);
        this.cameras.main.startFollow(this.mario);

        this.physics.add.collider(this.mario, this.layer);
    }

    update(){
        
        shiftCooldown -= 1;

        // codigo para movimentar o mario | falta as animações
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
            this.mario.body.velocity.x = -gameOptions.playerSpeed;
        } 
        else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
            this.mario.body.velocity.x = gameOptions.playerSpeed;
        } 
        else {
            this.mario.body.velocity.x = 0;
        }
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown && this.mario.body.onFloor()){
            this.mario.setVelocityY(-gameOptions.playerJump);
        }
        if((this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown)){
            if(shiftCooldown == 0){
                if(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown){
                    this.mario.body.velocity.x = -gameOptions.playerSpeed * 2;
                }
                else{
                    this.mario.body.velocity.x = gameOptions.playerSpeed * 2;
                }
            }
            
        }
        
    }
}