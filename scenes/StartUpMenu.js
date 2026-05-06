import InputSystem, { INPUT_ACTIONS } from './InputSystem.js';

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
    this.load.image("enemyexplosion", "./public/assets/EnemyExplosion.png");
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

    // Initialize InputSystem with mapped keys
    this.inputSystem = new InputSystem(this, {
      [INPUT_ACTIONS.FIRE]:    'SPACE',
      [INPUT_ACTIONS.RESTART]: 'R',
      [INPUT_ACTIONS.PUNCH]:   'C',
      [INPUT_ACTIONS.KICK]:    '1',
      [INPUT_ACTIONS.JUMP]:    '2',
    });

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

    this.add.text(gameWidth / 2, gameHeight * 0.40, "Press SPACE / (CROSS) to Start", {
      fontSize: "18px",
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

    this.add.text(gameWidth / 2, gameHeight * 0.85, "Press C / (SQUARE) for CONTROLS", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.70, "Press 1 / (CROSS) for LEVEL 1", {
      fontSize: "16px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    this.add.text(gameWidth / 2, gameHeight * 0.78, "Press 2 / (TRIANGLE) for LEVEL 2", {
      fontSize: "16px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);

    // --- Audio Unlock Logic ---
    const resumeAudio = () => {
      if (this.sound.context && this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
    };

    // Listen for any interaction to unlock audio
    this.input.on('pointerdown', resumeAudio);
    this.input.keyboard.on('keydown', resumeAudio);

    this.input.keyboard.on("keydown-SPACE", () => { if (this.loadingComplete) { resumeAudio(); this.scene.start("Level1"); } });
    this.input.keyboard.on("keydown-C", () => { if (this.loadingComplete) { resumeAudio(); this.scene.start("ControlsScene"); } });
    this.input.keyboard.on("keydown-1", () => { if (this.loadingComplete) { resumeAudio(); this.scene.start("Level1"); } });
    this.input.keyboard.on("keydown-2", () => { if (this.loadingComplete) { resumeAudio(); this.scene.start("Level2"); } });
  }

  update() {
    // Important: Poll gamepad state
    this.inputSystem.update();

    if (this.loadingComplete) {
      // Check for gamepad actions
      // Only FIRE (Cross) starts the level. RESTART (Options) is reserved for menu navigation.
      if (this.inputSystem.isJustPressed(INPUT_ACTIONS.FIRE)) { 
        if (this.sound.context && this.sound.context.state === 'suspended') this.sound.context.resume();
        this.scene.start("Level1");
      }
      if (this.inputSystem.isJustPressed(INPUT_ACTIONS.PUNCH)) { // Square
        this.scene.start("ControlsScene");
      }
      if (this.inputSystem.isJustPressed(INPUT_ACTIONS.KICK)) { // Triangle
        this.scene.start("Level2");
      }
      if (this.inputSystem.isJustPressed(INPUT_ACTIONS.JUMP)) { // Cross
        this.scene.start("Level1");
      }
    }

    this.inputSystem.lateUpdate();
  }
}
