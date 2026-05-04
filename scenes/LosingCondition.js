export default class LosingCondition extends Phaser.Scene {
    constructor() {
        super("LosingCondition");
    }

    init(data) {
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

        this.add.text(gameWidth / 2, gameHeight * 0.2, "* * * GAME OVER * * *", {
            fontSize: "36px",
            fill: "#f00",
            fontFamily: "SpaceFont",
            fontStyle: "bold",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.35, "The invaders have landed!", {
            fontSize: "24px",
            fill: "#0f0",
            fontFamily: "SpaceFont",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.5, `FINAL SCORE: ${this.score}`, {
            fontSize: "24px",
            fill: "#0f0",
            fontFamily: "SpaceFont",
        }).setOrigin(0.5);

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.6,
            `ENEMIES DESTROYED: ${this.collectedShapes.diamond}`,
            {
                fontSize: "20px",
                fill: "#fff",
                fontFamily: "SpaceFont",
            }
        ).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.75, "Press R to return to menu", {
            fontSize: "22px",
            fill: "#0f0",
            fontFamily: "SpaceFont",
        }).setOrigin(0.5);

      
        this.input.keyboard.on("keydown-R", () => {
            this.scene.start("StartUpMenu");
        });
    }
}