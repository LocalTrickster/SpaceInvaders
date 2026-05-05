import { INPUT_ACTIONS } from '../scenes/InputSystem.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, bulletsGroup, inputSystem) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.inputSystem = inputSystem;
    this.bulletsGroup = bulletsGroup;
    this.setCollideWorldBounds(true);
    if (this.body) {
      this.body.setCollideWorldBounds(true);
      this.body.setAllowGravity(false); // Disable gravity
    }
    this.setBounce(0);
    this.setDrag(0);
    this.speed = 350;
    this.canShoot = true;
    this.shootDelay = 600; // Slower fire rate to prevent spamming
  }

  update() {
    if (!this.active) {
      return;
    }

    if (this.inputSystem.isDown(INPUT_ACTIONS.LEFT)) {
      this.setVelocityX(-this.speed);
    } else if (this.inputSystem.isDown(INPUT_ACTIONS.RIGHT)) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.FIRE)) {
      this.shoot();
    }
  }

  shoot() {
    if (!this.canShoot) {
      return;
    }

    const bullet = this.bulletsGroup.create(this.x, this.y - 20, "projectile");
    bullet.setScale(1);
    bullet.setVelocityY(-300);
    bullet.setCollideWorldBounds(false);

    // Play firing sound
    this.scene.sound.play("shoot");

    this.canShoot = false;
    this.scene.time.addEvent({
      delay: this.shootDelay,
      callback: () => {
        this.canShoot = true;
      },
    });
  }

  setShootDelay(delay) {
    this.shootDelay = delay;
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }
}
