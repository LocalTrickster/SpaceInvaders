import Player from "../classes/Player.js";

export default class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
  }

  init() {
    this.score = 0;
    this.waveNumber = 1;
    this.enemiesDestroyed = 0;
    this.totalEnemiesToWin = 36; // Total enemies to destroy for this level
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

    // Shields group (covers) - fewer shields in Level2
    this.shields = this.physics.add.staticGroup();

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player.setupControls(this.cursors, this.spaceKey);

    // Level2 harder settings
    this.enemySpeed = 75; // Faster than Level1
    this.enemyFireRate = 700; // Much faster fire rate
    this.playerLives = 2; // Only 2 lives
    this.canShoot = true;
    this.shootDelay = 150; // Faster shooting needed
    
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

    this.healthText = this.add.text(gameWidth - 220, gameHeight - 40, `CREDIT 02`, {
      fontSize: "24px",
      fill: "#0f0",
      fontFamily: "SpaceFont",
    });

    // Player is always in the green zone
    this.player.setTint(this.greenTint);

    // Create shields and spawn wave after settings are set
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
      shield.setScale(1.8);
      shield.health = 2; // Weaker shields in Level2
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

    // More enemies and closer to player in Level2
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = horizontalSpacing * (col + 1);
        const y = 30 + row * 50; // Starts closer to player
        // Assign different sprites based on row
        const enemySpriteKey = enemySprites[row % enemySprites.length];
        const enemy = this.enemies.create(x, y, enemySpriteKey);
        enemy.setScale(1.2);

        // Wave speed increases per wave
        const waveSpeedMultiplier = 1 + this.waveNumber * 0.4;
        enemy.setVelocityX(this.enemySpeed * waveSpeedMultiplier);
        enemy.direction = 1;
        enemy.row = row;

        // Enemy shoots faster and more frequently
        const fireRate = this.enemyFireRate * (1 / (1 + this.waveNumber * 0.2));
        this.time.addEvent({
          delay: fireRate + Phaser.Math.Between(-200, 200),
          callback: () => {
            if (enemy.active) {
              this.enemyShoot(enemy);
            }
          },
          loop: true,
        });
      }
    }
  }

  spawnUFO() {
    if (this.ufo && this.ufo.active) return; // Only one UFO at a time

    const startX = Phaser.Math.Between(0, 1) === 0 ? -50 : this.gameWidth + 50; // Start from left or right
    const y = Phaser.Math.Between(50, 100); // Top part of the screen

    this.ufo = this.physics.add.sprite(startX, y, "ufo");
    this.ufo.setScale(1.5);
    this.ufo.setDepth(5); // Above enemies, below player
    this.ufo.setVelocityX(startX < 0 ? 100 : -100); // Move across
    this.ufo.setImmovable(true); // So it doesn't react to collisions physically
    this.ufo.body.allowGravity = false;

    this.ufoSound.play();

    // Add collision for player bullets and UFO
    this.physics.add.collider(this.playerBullets, this.ufo, this.bulletHitUFO, null, this);

    this.time.addEvent({
      delay: 10000, // UFO disappears after 10 seconds if not hit
      callback: () => {
        if (this.ufo && this.ufo.active) {
          this.ufo.destroy();
          this.ufoSound.stop();
        }
      },
      callbackScope: this
    });
  }

  bulletHitUFO(bullet, ufo) {
    const ufoX = ufo.x;
    const ufoY = ufo.y;
    bullet.destroy();
    ufo.destroy();
    this.ufoSound.stop();
    this.score += 100;
    this.scoreText.setText(`SCORE: ${this.score}`);

    // Show points on screen
    const pointsText = this.add.text(ufoX, ufoY, "100", {
      fontSize: "20px",
      fill: "#f00",
      fontFamily: "SpaceFont",
    }).setOrigin(0.5);
    this.time.delayedCall(1000, () => pointsText.destroy());
  }

  enemyShoot(enemy) {
    const bullet = this.enemyBullets.create(enemy.x, enemy.y + 15, "shot2");
    bullet.setScale(1);
    bullet.setVelocityY(250); // Faster bullets in Level2
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

    this.score += 20; // More points in Level2
    this.enemiesDestroyed++;
    this.scoreText.setText(`SCORE: ${this.score}`);

    // Check if current wave is destroyed
    if (this.enemies.children.entries.length === 0) {
      if (this.enemiesDestroyed >= this.totalEnemiesToWin) {
        // Win condition met: all required enemies destroyed
        this.scene.start("WinScene", {
          message: "Level 2 Complete! You are a master!",
          score: this.score,
          collectedShapes: { diamond: this.enemiesDestroyed, triangle: 0, square: 0 },
        });
      } else {
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
      shield.setAlpha(1 - (1 - shield.health / 2) * 0.6);
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
        const waveSpeedMultiplier = 1 + this.waveNumber * 0.4;
        enemy.setVelocityX(this.enemySpeed * waveSpeedMultiplier * enemy.direction);
        enemy.y += 50; // Move down faster in Level2
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
