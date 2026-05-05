export default class WinCondition extends Phaser.Scene {
    constructor() {
        super("WinCondition");
    }

    init(data) {
       
        this.message = data.message;
        this.score = data.score;
        this.collectedShapes = data.collectedShapes;
    }
    
    preload() {
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        this.cameras.main.setBackgroundColor("#000000");
        
        this.add.text(gameWidth / 2, gameHeight * 0.2, "* * * VICTORY * * *", {
            fontSize: "36px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
            fontStyle: "bold",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.35, this.message, {
            fontSize: "28px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.5, `SCORE: ${this.score}`, {
            fontSize: "24px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.6,
            `ENEMIES: ${this.collectedShapes.diamond}`,
            {
                fontSize: "20px",
                fill: "#fff",
                fontFamily: "'Press Start 2P'",
            }
        ).setOrigin(0.5);

        
        this.add.text(gameWidth / 2, gameHeight * 0.75, "Press R to return to menu", {
            fontSize: "22px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        
        this.input.keyboard.on("keydown-R", () => {
            this.scene.start("StartUpMenu"); 
        });
    }
}