import InputSystem, { INPUT_ACTIONS } from './InputSystem.js';

export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        this.add.text(gameWidth / 2, gameHeight * 0.2, "CONTROLS", {
            fontSize: "42px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.4, "ARROWS / D-PAD / L-STICK", {
            fontSize: "20px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.48, "to Move Ship", {
            fontSize: "16px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.6, "SPACE BAR / CROSS BUTTON", {
            fontSize: "20px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.68, "to Fire Lasers", {
            fontSize: "16px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.add.text(gameWidth / 2, gameHeight * 0.85, "Press R / OPTIONS to Return", {
            fontSize: "18px",
            fill: "#fff",
            fontFamily: "'Press Start 2P'",
        }).setOrigin(0.5);

        this.inputSystem = new InputSystem(this, {
            [INPUT_ACTIONS.RESTART]: 'R',
            [INPUT_ACTIONS.FIRE]: 'SPACE'
        });
    }

    update() {
        this.inputSystem.update();
        // Return to menu on RESTART (Options) or FIRE (Cross)
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.RESTART) || this.inputSystem.isJustPressed(INPUT_ACTIONS.FIRE)) {
            this.scene.start("StartUpMenu");
        }
        this.inputSystem.lateUpdate();
    }
}