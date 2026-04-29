import StartUpMenu from "./scenes/StartUpMenu.js";
import Level1 from "./scenes/Level1.js";
import Level2 from "./scenes/Level2.js";
import WinCondition from "./scenes/WinCondition.js";
import LosingCondition from "./scenes/LosingCondition.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: "parent",
    expandParent: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [StartUpMenu, Level1, Level2, WinCondition, LosingCondition],
};

const game = new Phaser.Game(config);
