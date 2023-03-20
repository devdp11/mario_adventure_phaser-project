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