export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, bulletsGroup) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
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
    this.shootDelay = 200;
  }

  setupControls(cursors, shootKey) {
    this.cursors = cursors;
    this.shootKey = shootKey;
  }

  update() {
    if (!this.active) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.shoot();
    }
  }

  shoot() {
    if (!this.canShoot) {
      return;
    }

    const bullet = this.bulletsGroup.create(this.x, this.y - 20, "projectile");
    bullet.setScale(1);
    bullet.setVelocityY(-400);
    bullet.setCollideWorldBounds(false);

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
