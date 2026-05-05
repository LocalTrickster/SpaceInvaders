export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        this.add.text(gameWidth / 2, gameHeight * 0.2, "CONTROLS", {
            fontSize: "42px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.4, "LEFT / RIGHT ARROWS", {
            fontSize: "20px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.48, "to Move Ship", {
            fontSize: "16px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.6, "SPACE BAR", {
            fontSize: "20px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.68, "to Fire Lasers", {
            fontSize: "16px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.85, "Press R to Return", {
            fontSize: "18px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.input.keyboard.on("keydown-R", () => {
            this.scene.start("StartUpMenu");
        });
    }
}