export default class StartUpMenu extends Phaser.Scene {
  constructor() {
    super("StartUpMenu");
  }

  preload() {
    // Preload all game assets here to prevent crashes in levels and missing sprites in menu
    this.load.image("octopus1", "./public/assets/Octopus1.png");
    this.load.image("octopus2", "./public/assets/Octopus2.png");
    this.load.image("cover", "./public/assets/Cover.png");
    this.load.image("player", "./public/assets/Player.png");
    this.load.image("playerexplosion", "./public/assets/PlayerExplosion.png");
    this.load.image("enemyexplosion", "./public/assets/Enemyexplosion.png");
    this.load.image("projectile", "./public/assets/Projectile_Player.png");
    this.load.image("crab1", "./public/assets/Crab1.png");
    this.load.image("crab2", "./public/assets/Crab2.png");
    this.load.image("squid1", "./public/assets/Squid1.png");
    this.load.image("squid2", "./public/assets/Squid2.png");
    this.load.image("ufo", "./public/assets/UFO.png");
    this.load.image("shot2", "./public/assets/shot2.png");
    this.load.image("projectilea1", "./public/assets/projectileA1.png");
    this.load.image("projectilea2", "./public/assets/projectileA2.png");
    this.load.image("projectileb1", "./public/assets/projectileB1.png");
    this.load.image("projectileb2", "./public/assets/projectileB2.png");
    this.load.image("projectilec1", "./public/assets/projectileC1.png");
    this.load.image("projectilec2", "./public/assets/projectileC2.png");
    this.load.audio("saucer", "./public/assets/saucer.mp3");
    this.load.audio("shoot", "./public/assets/shoot.mp3");
    this.load.audio("move", "./public/assets/move.mp3");
    this.load.audio("explosion", "./public/assets/explosion.mp3");

    this.loadingComplete = false;
    this.load.on('complete', () => {
      this.loadingComplete = true;
    });
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.cameras.main.setBackgroundColor("#000000");
    
    const highScore = localStorage.getItem("highScore") || "0";

    this.add.text(gameWidth / 2, gameHeight * 0.15, "SPACE INVADERS", {
      fontSize: "38px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
      fontStyle: "bold",
      align: "center",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.22, `Hi- score: ${highScore}`, {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.25, "* * * * *", {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.40, "Press SPACE to Start", {
      fontSize: "22px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    // Point Table
    const tableY = gameHeight * 0.55;
    this.add.text(gameWidth / 2, tableY - 40, "SCORE TABLE", { fontSize: "16px", fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);
    this.add.text(gameWidth / 2, tableY, "= ??? MYSTERY", { fontSize: "14px", fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);
    this.add.text(gameWidth / 2, tableY + 25, "= 30 POINTS", { fontSize: "14px", fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);
    this.add.text(gameWidth / 2, tableY + 50, "= 20 POINTS", { fontSize: "14px", fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);
    this.add.text(gameWidth / 2, tableY + 75, "= 10 POINTS", { fontSize: "14px", fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);

    // Sprites for table
    this.add.image(gameWidth / 2 - 100, tableY, "ufo").setScale(1);
    this.add.image(gameWidth / 2 - 100, tableY + 25, "squid1").setScale(0.8);
    this.add.image(gameWidth / 2 - 100, tableY + 50, "crab1").setScale(0.8);
    this.add.image(gameWidth / 2 - 100, tableY + 75, "octopus1").setScale(0.8);

    this.add.text(gameWidth / 2, gameHeight * 0.50, "Press C for CONTROLS", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5).setY(gameHeight * 0.85);

    this.add.text(gameWidth / 2, gameHeight * 0.92, "1: LEVEL 1 | 2: LEVEL 2", {
      fontSize: "12px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.70, "Press 1 for LEVEL 1", {
      fontSize: "16px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.78, "Press 2 for LEVEL 2", {
      fontSize: "16px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.loadingComplete) return;
      this.scene.start("Level1");
    });

    this.input.keyboard.on("keydown-C", () => {
        if (!this.loadingComplete) return;
        this.scene.start("ControlsScene");
    });

    this.input.keyboard.on("keydown-1", () => {
      if (!this.loadingComplete) return;
      this.scene.start("Level1");
    });

    this.input.keyboard.on("keydown-2", () => {
      if (!this.loadingComplete) return;
      this.scene.start("Level2");
    });
  }
}
