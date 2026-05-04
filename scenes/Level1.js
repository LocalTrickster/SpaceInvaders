import Player from "../classes/Player.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  init() {
    this.score = 0;
    this.waveNumber = 1;
    this.enemiesDestroyed = 0;
    this.totalEnemiesToWin = 24; // Total enemies to destroy for this level
  }

  preload() {
    this.load.image("octopus", "./public/assets/Octopus.png");
    this.load.image("cover", "./public/assets/Cover.png");
    this.load.image("player", "./public/assets/Player.png");
    this.load.image("playerexplosion", "./public/assets/PlayerExplosion.png");
    this.load.image("projectile", "./public/assets/Projectile_Player.png");
    this.load.image("crab", "./public/assets/Crab.png"); // New enemy sprite
    this.load.image("squid", "./public/assets/Squid.png"); // New enemy sprite
    this.load.image("ufo", "./public/assets/UFO.png"); // UFO sprite
    this.load.image("shot2", "./public/assets/shot2.png");
    this.load.audio("saucer", "./public/assets/saucer.mp3"); // UFO sound
  }

  create() {
    // Get game dimensions for responsive layout
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.cameras.main.setBackgroundColor("#000000");
    this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

    // Bullets group
    this.playerBullets = this.physics.add.group();

    // Player ship
    this.player = new Player(this, gameWidth / 2, gameHeight - 50, "player", this.playerBullets);
    this.player.setScale(1.5);
    this.player.setDepth(10);
    this.playerAlive = true;

    // Enemies group
    this.enemies = this.physics.add.group();

    // Enemy bullets
    this.enemyBullets = this.physics.add.group();

    // Shields group (covers)
    this.shields = this.physics.add.staticGroup();

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player.setupControls(this.cursors, this.spaceKey);

    // Game variables
    this.enemySpeed = 50;
    this.enemyFireRate = 1000;
    this.playerLives = 3;
    this.canShoot = true;
    this.shootDelay = 200;
    
    // Filter colors
    this.greenTint = 0x00FF00; // Green color
    this.redTint = 0xFF0000;   // Red color

    // UI text must exist before spawning the first wave
    this.scoreText = this.add.text(16, 16, `SCORE: ${this.score}`, {
      fontSize: "24px",
      fill: "#0f0",
      fontFamily: "SpaceFont",
    });

    this.waveText = this.add.text(16, 50, `WAVE: ${this.waveNumber}`, {
      fontSize: "24px",
      fill: "#0f0",
      fontFamily: "SpaceFont",
    });

    this.healthText = this.add.text(gameWidth - 220, gameHeight - 40, `CREDIT 03`, {
      fontSize: "24px",
      fill: "#0f0",
      fontFamily: "SpaceFont",
    });

    // Player is always in the green zone
    this.player.setTint(this.greenTint);

    // Create shields and spawn wave only after variables are set
    this.createShields();
    this.spawnWave();

    // UFO setup
    this.ufo = null;
    this.ufoSound = this.sound.add("saucer");
    this.time.addEvent({
      delay: Phaser.Math.Between(15000, 30000), // Random delay between 15-30 seconds
      callback: this.spawnUFO,
      callbackScope: this,
      loop: true
    });


    // Collision detection
    this.physics.add.collider(this.playerBullets, this.enemies, this.bulletHitEnemy, null, this);
    this.physics.add.collider(this.playerBullets, this.shields, this.bulletHitShield, null, this);
    this.physics.add.collider(this.enemyBullets, this.player, this.playerHit, null, this);
    this.physics.add.collider(this.enemyBullets, this.shields, this.bulletHitShield, null, this);

  }

  createShields() {
    // Create 4 big cover shields evenly spread across the bottom area
    const gameWidth = this.gameWidth;
    const shieldPositions = [
      gameWidth * 0.12,
      gameWidth * 0.34,
      gameWidth * 0.66,
      gameWidth * 0.88,
    ];

    // Shields are always in the green zone
    shieldPositions.forEach((xPos) => {
      const shield = this.shields.create(xPos, this.gameHeight - 120, "cover");
      shield.setScale(2.8);
      shield.health = 6;
      shield.setTint(this.greenTint); // Apply green tint to shields
      shield.setOrigin(0.5, 0.5);
    });
  }

  spawnWave() {
    this.waveNumber++;
    if (this.waveText) {
      this.waveText.setText(`WAVE: ${this.waveNumber}`);
    }

    // Clear old enemies
    this.enemies.clear(true, true);

    const gameWidth = this.gameWidth;
    const gameHeight = this.gameHeight;
    const cols = 11;
    const rows = 5;
    const horizontalSpacing = gameWidth / (cols + 1);
    const enemySprites = ["octopus", "crab", "squid"]; // Different enemy sprites

    // Spawn enemies in classic Space Invaders formation
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = horizontalSpacing * (col + 1);
        const y = 50 + row * 60;
        // Assign different sprites based on row
        const enemySpriteKey = enemySprites[row % enemySprites.length];
        const enemy = this.enemies.create(x, y, enemySpriteKey);
        enemy.setScale(1.2);
        enemy.setVelocityX(this.enemySpeed);
        enemy.direction = 1;
        enemy.row = row;

        
      }
    }
    // One enemy shoots every 2 seconds
this.time.addEvent({
  delay: 2000, // 2-second interval between shots
  callback: () => {
    const aliveEnemies = this.enemies.getChildren().filter(e => e.active);
    if (aliveEnemies.length === 0) return;

    // Pick ONE random enemy
    const shooter = Phaser.Utils.Array.GetRandom(aliveEnemies);

    // Shoot only that enemy
    this.enemyShoot(shooter);
  },
  loop: true,
});
  }

  enemyShoot(enemy) {
    const bullet = this.enemyBullets.create(enemy.x, enemy.y + 15, "shot2");
    bullet.setScale(1);
    bullet.setVelocityY(180);
  }

  playerShoot() {
    if (!this.playerAlive || !this.canShoot) return;

    const bullet = this.playerBullets.create(this.player.x, this.player.y - 20, "projectile");
    bullet.setScale(1);
    bullet.setVelocityY(-400);

    this.canShoot = false;
    this.time.addEvent({
      delay: this.shootDelay,
      callback: () => {
        this.canShoot = true;
      },
    });
  }

  bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();

    this.score += 10;
    this.enemiesDestroyed++;
    this.scoreText.setText(`SCORE: ${this.score}`);

    // Check if current wave is destroyed
    if (this.enemies.children.entries.length === 0) {
      if (this.enemiesDestroyed >= this.totalEnemiesToWin) {
        // Win condition met: all required enemies destroyed
        this.scene.start("WinScene", {
          message: "Level 1 Complete!",
          score: this.score,
          collectedShapes: { diamond: this.enemiesDestroyed, triangle: 0, square: 0 },
        });
      } else {
        // Not enough enemies destroyed yet, spawn next wave
        this.spawnWave();
      }
    }

  }

  bulletHitShield(bullet, shield) {
    bullet.destroy();
    shield.health--;

    if (shield.health <= 0) {
      shield.destroy();
    } else {
      shield.setAlpha(1 - (1 - shield.health / 5) * 0.6);
    }
  }

  playerHit(player, bullet) {
    if (!this.playerAlive) return;

    bullet.destroy();
    this.playerLives--;
    this.healthText.setText(`CREDIT 0${this.playerLives}`);

    if (this.playerLives <= 0) {
      this.playerDeath();
    } else {
      
      // Respawn player
      this.player.setPosition(this.gameWidth / 2, this.gameHeight - 50);
      this.player.setVelocity(0, 0);
      this.player.body.enable = true;
      this.playerAlive = true;
    }
  }

  playerDeath() {
    this.playerAlive = false;
    const explosion = this.add.sprite(this.player.x, this.player.y, "playerexplosion");
    explosion.setScale(1.5);
    this.player.destroy();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.start("LosingCondition", {
          score: this.score,
          collectedShapes: { diamond: this.enemiesDestroyed, triangle: 0, square: 0 },
        });
      },
    });
  }

  checkGameOver() {
    // Game over if enemies reach the bottom
    const gameOverY = this.gameHeight - 120;
    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.y >= gameOverY) {
        this.playerDeath();
      }
    });
  }

  update() {
    if (!this.playerAlive) return;

    // Define filter zones
    const greenZoneYStart = this.gameHeight * 0.5; // Bottom half
    const redZoneYEnd = this.gameHeight * 0.2; // Top 20%

    // Player movement with proper boundary checking
    const playerSpeed = 350;
    const minX = this.player.displayWidth / 2;
    const maxX = this.gameWidth - (this.player.displayWidth / 2);

    // Player movement and shooting through Player class
    this.player.update();

    // Clamp player position within bounds
    if (this.player.x < minX) this.player.x = minX;
    if (this.player.x > maxX) this.player.x = maxX;

    // Player is always in the green zone
    this.player.setTint(this.greenTint);

    // Enemy movement - move down when reaching edges
    let moveDown = false;
    const edgeMargin = this.gameWidth * 0.05;

    this.enemies.children.entries.forEach((enemy) => {
      if ((enemy.direction > 0 && enemy.x >= this.gameWidth - edgeMargin) || 
          (enemy.direction < 0 && enemy.x <= edgeMargin)) {
        moveDown = true;
      }
    });

    if (moveDown) {
      this.enemies.children.entries.forEach((enemy) => {
        enemy.direction *= -1;
        enemy.setVelocityX(this.enemySpeed * enemy.direction);
        enemy.y += 40;
      });
    }
    
    // Apply tints to enemies based on zones
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        if (enemy.y > greenZoneYStart) {
          enemy.setTint(this.greenTint);
        } else if (enemy.y < redZoneYEnd) {
          enemy.setTint(this.redTint);
        } else {
          enemy.clearTint(); // Clear tint if in middle zone
        }
      }
    });

    // UFO tinting (if it exists)
    if (this.ufo && this.ufo.active) {
      if (this.ufo.y > greenZoneYStart) {
        this.ufo.setTint(this.greenTint);
      } else if (this.ufo.y < redZoneYEnd) {
        this.ufo.setTint(this.redTint);
      } else {
        this.ufo.clearTint();
      }
      // Destroy UFO if it goes off screen
      if ((this.ufo.body.velocity.x > 0 && this.ufo.x > this.gameWidth + 50) ||
          (this.ufo.body.velocity.x < 0 && this.ufo.x < -50)) {
          this.ufo.destroy();
          this.ufoSound.stop();
      }
    }

    // Check for game over condition
    this.checkGameOver();
  }
}
