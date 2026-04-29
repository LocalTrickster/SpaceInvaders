export default class StartUpMenu extends Phaser.Scene {
  constructor() {
    super("StartUpMenu");
  }

  preload() {
    this.load.image("sky", "./public/assets/cielo.webp");
    this.load.image("fondomenu", "./public/assets/fondomenu.jpg");
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.add.image(gameWidth / 2, gameHeight / 2, "fondomenu").setScale(2);

    this.add.text(gameWidth / 2, gameHeight * 0.15, "SPACE INVADERS", {
      fontSize: "52px",
      fill: "#0f0",
      fontFamily: "Arial",
      fontStyle: "bold",
      align: "center",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.3, "* * * * *", {
      fontSize: "32px",
      fill: "#0f0",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.45, "Press SPACE to Start", {
      fontSize: "28px",
      fill: "#0f0",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.58, "Or choose your difficulty:", {
      fontSize: "20px",
      fill: "#0f0",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.66, "Press 1 for LEVEL 1 (Normal)", {
      fontSize: "18px",
      fill: "#fff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.74, "Press 2 for LEVEL 2 (Hard)", {
      fontSize: "18px",
      fill: "#fff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("Level1");
    });

    this.input.keyboard.on("keydown-1", () => {
      this.scene.start("Level1");
    });

    this.input.keyboard.on("keydown-2", () => {
      this.scene.start("Level2");
    });
  }
}
