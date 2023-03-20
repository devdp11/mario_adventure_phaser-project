let game;

const gameOptions = {
    playerGravity: 1100,
    playerSpeed: 150,
    playerJump: 400
};

window.onload = function() {
    const gameConfig = {
        type: Phaser.CANVAS,
        width: 312,
        height: 312,
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
}
} 