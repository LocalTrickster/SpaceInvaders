import StartUpMenu from "./scenes/StartUpMenu.js";
import Level1 from "./scenes/Level1.js";
import Level2 from "./scenes/Level2.js";
import WinCondition from "./scenes/WinCondition.js";
import LosingCondition from "./scenes/LosingCondition.js";
import ControlsScene from "./scenes/ControlsScene.js";

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [StartUpMenu, ControlsScene, Level1, Level2, WinCondition, LosingCondition],
};

const game = new Phaser.Game(config);
