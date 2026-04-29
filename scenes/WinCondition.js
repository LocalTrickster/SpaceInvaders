export default class WinCondition extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    init(data) {
       
        this.message = data.message;
        this.score = data.score;
        this.collectedShapes = data.collectedShapes;
    }
    
    preload() {
        this.load.image("fondomenu", "./public/assets/fondomenu.jpg");
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        this.add.image(gameWidth / 2, gameHeight / 2, "fondomenu").setScale(2);
        
        this.add.text(gameWidth / 2, gameHeight * 0.2, "* * * VICTORY * * *", {
            fontSize: "36px",
            fill: "#0f0",
            fontFamily: "Arial",
            fontStyle: "bold",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.35, this.message, {
            fontSize: "28px",
            fill: "#0f0",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.5, `SCORE: ${this.score}`, {
            fontSize: "24px",
            fill: "#0f0",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.6,
            `ENEMIES DESTROYED: ${this.collectedShapes.diamond}`,
            {
                fontSize: "20px",
                fill: "#fff",
                fontFamily: "Arial",
            }
        ).setOrigin(0.5);

        
        this.add.text(gameWidth / 2, gameHeight * 0.75, "Press R to return to menu", {
            fontSize: "22px",
            fill: "#0f0",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        
        this.input.keyboard.on("keydown-R", () => {
            this.scene.start("StartUpMenu"); 
        });
    }
}