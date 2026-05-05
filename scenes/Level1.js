import Player from "../classes/Player.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  init() {
    this.score = 0;
    this.enemiesDestroyed = 0;
    this.totalEnemiesToWin = 24; // Total enemies to destroy for this level
    this.currentEnemySpeed = 10;
    try {
      const saved = localStorage.getItem("highScore");
      this.highScore = parseInt(saved) || 0;
    } catch (e) {
      this.highScore = 0;
    }
  }

  preload() {
    // Assets are now preloaded in StartUpMenu
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

    // Create Animations for enemies
    if (!this.anims.exists("octopus_anim")) {
      this.anims.create({
        key: "octopus_anim",
        frames: [{ key: "octopus1" }, { key: "octopus2" }],
        frameRate: 2,
        repeat: -1,
      });
    }
    if (!this.anims.exists("crab_anim")) {
      this.anims.create({
        key: "crab_anim",
        frames: [{ key: "crab1" }, { key: "crab2" }],
        frameRate: 2,
        repeat: -1,
      });
    }
    if (!this.anims.exists("squid_anim")) {
      this.anims.create({
        key: "squid_anim",
        frames: [{ key: "squid1" }, { key: "squid2" }],
        frameRate: 2,
        repeat: -1,
      });
    }

    // Game variables
    this.enemySpeed = 10; 
    this.currentEnemySpeed = 10;
    this.enemyFireRate = 1000;
    this.playerLives = 3;
    this.canShoot = true;
    this.shootDelay = 600;
    this.movementEnabled = true;
    this.enemiesPaused = false;
    
    // Filter colors
    this.greenTint = 0x00FF00; // Green color
    this.redTint = 0xFF0000;   // Red color

    // UI text must exist before spawning the first wave
    this.scoreText = this.add.text(16, 16, `SCORE: ${this.score}`, {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    });

    this.highScoreText = this.add.text(gameWidth / 2, 30, `Hi- score: ${this.highScore}`, {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5, 0);

    this.healthText = this.add.text(gameWidth - 220, gameHeight - 40, `CREDIT 03`, {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    });

    // Player is always in the green zone
    this.player.setTint(this.greenTint);

    // Create shields and spawn wave only after variables are set
    this.createShields();
    this.spawnWave();

    // Centralized shooting logic - moved here from spawnWave to prevent leaks
    this.time.addEvent({
      delay: 2000, 
      callback: () => {
        if (!this.playerAlive || this.enemiesPaused) return;
        const aliveEnemies = this.enemies.getChildren().filter(e => e.active);
        if (aliveEnemies.length === 0) return;

        const shooter = Phaser.Utils.Array.GetRandom(aliveEnemies);
        this.enemyShoot(shooter);
      },
      loop: true,
    });

    // Alien movement sound rhythm
    this.time.addEvent({
      delay: 800, // Standard starting rhythm beat
      callback: () => {
        if (this.enemies.countActive() > 0 && !this.enemiesPaused && this.movementEnabled && this.playerAlive) {
          if (this.cache.audio.exists("move")) {
            this.sound.play("move");
          }
        }
      },
      loop: true,
    });

    // UFO setup
    this.ufoGroup = this.physics.add.group();
    this.ufoSound = this.sound.add("saucer");
    this.scheduleUFO();

    // Stop UFO sound when leaving the scene to prevent it from persisting in the menu
    this.events.on('shutdown', () => {
      this.ufoSound.stop();
    });

    // Collision detection
    this.physics.add.collider(this.playerBullets, this.enemies, this.bulletHitEnemy, null, this);
    this.physics.add.collider(this.playerBullets, this.shields, this.bulletHitShield, null, this);
    this.physics.add.collider(this.enemyBullets, this.player, this.playerHit, null, this);
    this.physics.add.collider(this.enemyBullets, this.shields, this.bulletHitShield, null, this);
    this.physics.add.collider(this.playerBullets, this.ufoGroup, this.bulletHitUFO, null, this);

  }

  scheduleUFO() {
    // Schedule the next UFO at a random interval between 10-20 seconds
    this.time.delayedCall(Phaser.Math.Between(10000, 20000), () => {
      this.spawnUFO();
      this.scheduleUFO();
    });
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

    shieldPositions.forEach((xPos) => {
      // Create a grid of small blocks to form a destructible shield
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 9; col++) {
          // Shape the shield (skip corners and bottom center)
          if ((row === 0 && (col < 2 || col > 6)) || (row > 4 && (col > 2 && col < 6))) continue;

          const part = this.shields.create(xPos - 30 + (col * 7), this.gameHeight - 160 + (row * 7), "cover");
          part.setScale(0.5);
          part.setTint(this.greenTint);
          part.health = 1;
        }
      }
    });
  }

  spawnWave() {
    // Clear old enemies
    this.enemies.clear(true, true);

    const gameWidth = this.gameWidth;
    const gameHeight = this.gameHeight;
    const cols = 11;
    const rows = 5;
    const horizontalSpacing = gameWidth / (cols + 3); // Closer together horizontally

    // Spawn enemies in classic Space Invaders formation
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (gameWidth * 0.15) + (horizontalSpacing * col); // Centered and closer
        const y = 140 + row * 45; // Lowered to avoid score text
        
        // Row logic: Top 2 Squid, Mid 2 Crab, Bottom Octopus
        let enemySpriteKey = "octopus";
        if (row < 2) enemySpriteKey = "squid";
        else if (row < 4) enemySpriteKey = "crab";

        const enemy = this.enemies.create(x, y, enemySpriteKey + "1");
        enemy.play(enemySpriteKey + "_anim");
        enemy.setScale(1.2);
        enemy.setVelocityX(this.enemySpeed);
        enemy.direction = 1;
        enemy.row = row;

        
      }
    }
  }

  enemyShoot(enemy) {
    const bullet = this.enemyBullets.create(enemy.x, enemy.y + 15, "shot2");
    bullet.setScale(1);
    bullet.setVelocityY(140); // Slower enemy firing
  }

  spawnUFO() {
    if (this.ufoGroup.countActive() > 0) return;

    const startX = Phaser.Math.Between(0, 1) === 0 ? -50 : this.gameWidth + 50;
    const y = 90; // Lowered to avoid score text

    const ufo = this.ufoGroup.create(startX, y, "ufo");
    ufo.setScale(1.5);
    ufo.setDepth(5);
    ufo.setVelocityX(startX < 0 ? 100 : -100);
    ufo.setImmovable(true);
    ufo.body.allowGravity = false;

    this.ufoSound.play({ loop: true });

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        if (ufo && ufo.active) { ufo.destroy(); this.ufoSound.stop(); }
      }
    });
  }

  bulletHitUFO(bullet, ufo) {
    const ufoX = ufo.x;
    const ufoY = ufo.y;
    bullet.destroy();
    ufo.destroy();
    this.ufoSound.stop();
    this.sound.play("explosion");

    const explosion = this.add.sprite(ufoX, ufoY, "enemyexplosion");
    explosion.setScale(1.5);
    this.time.delayedCall(100, () => {
      explosion.destroy();
    });

    this.score += 100;
    this.scoreText.setText(`SCORE: ${this.score}`);

    // Show points on screen
    const pointsText = this.add.text(ufoX, ufoY, "100", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "'Press Start 2P'",
    }).setOrigin(0.5);
    this.time.delayedCall(1000, () => pointsText.destroy());
  }

  bulletHitEnemy(bullet, enemy) {
    // Determine score BEFORE destroying the enemy
    let points = 10;
    if (enemy.texture.key.includes("squid")) points = 30;
    else if (enemy.texture.key.includes("crab")) points = 20;

    const ex = enemy.x;
    const ey = enemy.y;

    bullet.destroy();
    enemy.destroy();
    this.sound.play("explosion");

    const explosion = this.add.sprite(ex, ey, "enemyexplosion");
    explosion.setScale(1.2);
    this.time.delayedCall(100, () => {
      explosion.destroy();
    });

    this.score += points;

    this.enemiesDestroyed++;
    this.updateScoreUI();
    
    // Scale speed: gets faster as more are destroyed (up to a max bonus of +40)
    this.currentEnemySpeed = this.enemySpeed + (this.enemiesDestroyed * 0.8);

    // Check if current wave is destroyed
    if (this.enemies.countActive() === 0) {
      if (this.enemiesDestroyed >= this.totalEnemiesToWin) {
        // Win condition met: all required enemies destroyed
        this.scene.start("WinCondition", {
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

  updateScoreUI() {
    this.scoreText.setText(`SCORE: ${this.score}`);
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreText.setText(`Hi- score: ${this.highScore}`);
      try {
        localStorage.setItem("highScore", this.highScore);
      } catch (e) {
        // LocalStorage might be disabled
      }
    }
  }

  bulletHitShield(bullet, shield) {
    bullet.destroy();
    shield.destroy(); // Each piece is destroyed in one hit
  }

  playerHit(player, bullet) {
    if (!this.playerAlive) return;

    bullet.destroy();
    this.playerLives--;
    this.healthText.setText(`CREDIT 0${this.playerLives}`);
    
    // Pause enemies and hide player
    this.enemiesPaused = true;
    this.playerAlive = false;
    this.player.setVisible(false);
    this.player.body.enable = false;
    this.sound.play("explosion");

    // Play explosion
    const explosion = this.add.sprite(this.player.x, this.player.y, "playerexplosion");
    explosion.setScale(1.5);

    this.time.delayedCall(1500, () => {
      explosion.destroy();
      if (this.playerLives <= 0) {
        this.scene.start("LosingCondition", {
          score: this.score,
          collectedShapes: { diamond: this.enemiesDestroyed, triangle: 0, square: 0 },
        });
      } else {
        // Respawn
        this.player.setPosition(this.gameWidth / 2, this.gameHeight - 50);
        this.player.setVelocity(0, 0);
        this.player.setVisible(true);
        this.player.body.enable = true;
        this.playerAlive = true;
        this.enemiesPaused = false;
      }
    });
  }

  playerDeath() {
    if (!this.player || !this.player.active) return;
    this.playerAlive = false;
    this.sound.play("explosion");
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
    if (!this.playerAlive) return;
    // Game over if enemies reach the bottom
    const gameOverY = this.gameHeight - 120;
    const enemies = this.enemies.getChildren();
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.active && enemy.body && enemy.y >= gameOverY) {
        this.playerDeath();
        break; // Stop checking immediately once player is dead to prevent multiple calls
      }
    }
  }

  update() {
    if (!this.playerAlive || !this.player || !this.player.active) return;

    // Define filter zones
    const greenZoneYStart = this.gameHeight * 0.8; // Smaller bottom zone
    const redZoneYEnd = this.gameHeight * 0.15; // Smaller top zone

    // Player movement and shooting through Player class
    this.player.update();

    // Clamp player position within bounds
    const minX = this.player.displayWidth / 2;
    const maxX = this.gameWidth - (this.player.displayWidth / 2);
    if (this.player.x < minX) this.player.x = minX;
    if (this.player.x > maxX) this.player.x = maxX;

    this.player.setTint(this.greenTint);

    if (this.enemiesPaused || !this.movementEnabled) {
      this.enemies.setVelocityX(0);
      return;
    }

    let moveDown = false;
    const edgeMargin = this.gameWidth * 0.05;
    const enemiesArray = this.enemies.getChildren();

    // Consolidated optimization: One loop for movement, edge checking, and tinting
    for (let i = 0; i < enemiesArray.length; i++) {
      const enemy = enemiesArray[i];
      if (!enemy.active || !enemy.body) continue;

      // Restore velocity if it was lost
      if (enemy.body.velocity.x === 0) {
        enemy.setVelocityX(this.currentEnemySpeed * (enemy.direction || 1));
      }

      // Check bounds
      if ((enemy.direction > 0 && enemy.x >= this.gameWidth - edgeMargin) || 
          (enemy.direction < 0 && enemy.x <= edgeMargin)) {
        moveDown = true;
      }

      // Apply tints based on zones
      if (enemy.y > greenZoneYStart) {
        enemy.setTint(this.greenTint);
      } else if (enemy.y < redZoneYEnd) {
        enemy.setTint(this.redTint);
      } else {
        enemy.clearTint();
      }
    }

    if (moveDown) {
      for (let j = 0; j < enemiesArray.length; j++) {
        const e = enemiesArray[j];
        if (e.active && e.body) {
          e.direction *= -1;
          e.setVelocityX(this.currentEnemySpeed * e.direction);
          e.y += 35;
        }
      }
    }
    
    // Safe UFO handling using the group
    this.ufoGroup.getChildren().forEach(ufo => {
      if (ufo.active && ufo.body) {
        if (ufo.y > greenZoneYStart) {
          ufo.setTint(this.greenTint);
        } else if (ufo.y < redZoneYEnd) {
          ufo.setTint(this.redTint);
        } else {
          ufo.clearTint();
        }

        // Destroy UFO if it goes off screen
        if ((ufo.body.velocity.x > 0 && ufo.x > this.gameWidth + 50) ||
            (ufo.body.velocity.x < 0 && ufo.x < -50)) {
            ufo.destroy();
            this.ufoSound.stop();
        }
      }
    });

    // Check for game over condition
    this.checkGameOver();
  }
}
