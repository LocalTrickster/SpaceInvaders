/**
 * ControlsStatusUI.js
 * Panel de debug que muestra el estado de controles en pantalla.
 * Compatible con el InputSystem reescrito.
 */

import { INPUT_ACTIONS } from './InputSystem.js';

export class ControlsStatusUI {
  /**
   * @param {Phaser.Scene}  scene
   * @param {InputSystem}   inputSystem
   */
  constructor(scene, inputSystem) {
    this.scene       = scene;
    this.inputSystem = inputSystem;

    // Convertir el keyMap a strings limpios para mostrar en la UI
    this.keyMap1Str = this._flattenKeyMap(inputSystem.keyMap1);
    this.keyMap2Str = this._flattenKeyMap(inputSystem.keyMap2);

    /** Todos los elementos raíz para poder ocultar/mostrar el panel. */
    this._rootElements = [];

    this._p1GamepadLight = null;
    this._p2GamepadLight = null;
    this._p1ActionLights = {};
    this._p2ActionLights = {};

    this._ACTION_MAP = [
      { action: INPUT_ACTIONS.PUNCH,     label: 'Golpe'      },
      { action: INPUT_ACTIONS.KICK,      label: 'Patada'     },
      { action: INPUT_ACTIONS.JUMP,      label: 'Salto'      },
      { action: INPUT_ACTIONS.FORM_NEXT, label: 'Sig. Forma' },
      { action: INPUT_ACTIONS.FORM_PREV, label: 'Ant. Forma' },
    ];

    this._build();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Construcción del panel
  // ──────────────────────────────────────────────────────────────────────────

  /** Devuelve solo el primer nombre de tecla por acción (para mostrar en UI). */
  _flattenKeyMap(keyMap) {
    if (!keyMap) return {};
    const result = {};
    for (const [action, keys] of Object.entries(keyMap)) {
      result[action] = Array.isArray(keys) ? keys[0] : keys;
    }
    return result;
  }

  _build() {
    const { width, height } = this.scene.cameras.main;

    const UI_HEIGHT    = 160;
    const UI_TOP       = (height - UI_HEIGHT) / 2;
    const UI_WIDTH     = width - 20;
    const ROW_SPACING  = 14;
    const LIGHT_RADIUS = 4;
    const LIGHT_X_P1   = 20;
    const LIGHT_X_P2   = width / 2 + 10;
    const INACTIVE     = 0x555555;

    const titleStyle = { fontFamily: 'Arial', fontSize: '10px', color: '#FFFFFF', fontStyle: 'bold' };
    const labelStyle = { fontFamily: 'Arial', fontSize: '8px',  color: '#CCCCCC' };

    // Contenedor (fijado a la pantalla)
    const container = this.scene.add.container(0, 0);
    container.setDepth(1000);
    container.setScrollFactor(0);
    this._rootElements.push(container);

    // Fondo
    const gfx = this.scene.add.graphics({ fillStyle: { color: 0x1c2833, alpha: 0.90 } });
    gfx.fillRoundedRect(10, UI_TOP, UI_WIDTH, UI_HEIGHT, 8);
    gfx.lineStyle(2, 0x4a6572, 1);
    gfx.strokeRoundedRect(10, UI_TOP, UI_WIDTH, UI_HEIGHT, 8);
    container.add(gfx);

    // Separador central
    const sep = this.scene.add.line(0, 0, width / 2, UI_TOP, width / 2, UI_TOP + UI_HEIGHT, 0x4a6572).setOrigin(0);
    container.add(sep);

    let y = UI_TOP + 15;

    // ── Encabezados con indicadores de gamepad ──────────────────────────────
    this._p1GamepadLight = this.scene.add.circle(LIGHT_X_P1 + 120, y, LIGHT_RADIUS, INACTIVE);
    this._p2GamepadLight = this.scene.add.circle(LIGHT_X_P2 + 120, y, LIGHT_RADIUS, INACTIVE);

    container.add([
      this.scene.add.text(LIGHT_X_P1, y, 'PLAYER 1', { ...titleStyle, color: '#00aaff' }).setOrigin(0, 0.5),
      this._p1GamepadLight,
      this.scene.add.text(LIGHT_X_P2, y, 'PLAYER 2', { ...titleStyle, color: '#ff5555' }).setOrigin(0, 0.5),
      this._p2GamepadLight,
    ]);

    y += ROW_SPACING + 5;

    // ── Filas de acciones ───────────────────────────────────────────────────
    this._ACTION_MAP.forEach(({ action, label }, i) => {
      const rowY  = y + ROW_SPACING * i;
      const p1Key = this.keyMap1Str[action] ?? '';
      const p2Key = this.keyMap2Str[action] ?? '';

      this._p1ActionLights[action] = this.scene.add.circle(LIGHT_X_P1 + 100, rowY, LIGHT_RADIUS, INACTIVE);
      this._p2ActionLights[action] = this.scene.add.circle(LIGHT_X_P2 + 100, rowY, LIGHT_RADIUS, INACTIVE);

      container.add([
        this.scene.add.text(LIGHT_X_P1, rowY, `${label} [${p1Key}]`, labelStyle).setOrigin(0, 0.5),
        this._p1ActionLights[action],
        this.scene.add.text(LIGHT_X_P2, rowY, `${label} [${p2Key}]`, labelStyle).setOrigin(0, 0.5),
        this._p2ActionLights[action],
      ]);
    });
  }

  update() {
    this._refreshLights();
  }

  setVisible(visible) {
    this._rootElements.forEach(el => el.setVisible(visible));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Internos
  // ──────────────────────────────────────────────────────────────────────────

  _refreshLights() {
    const COLOR_P1   = 0x00aaff;
    const COLOR_P2   = 0xff5555;
    const INACTIVE   = 0x555555;

    const gp1 = this.inputSystem.getGamepadInfo('player1');
    const gp2 = this.inputSystem.getGamepadInfo('player2');

    this._p1GamepadLight.setFillStyle(gp1 ? COLOR_P1 : INACTIVE);
    this._p2GamepadLight.setFillStyle(gp2 ? COLOR_P2 : INACTIVE);

    for (const { action } of this._ACTION_MAP) {
      const p1Down = this.inputSystem.isDown(action, 'player1');
      const p2Down = this.inputSystem.isDown(action, 'player2');
      this._p1ActionLights[action].setFillStyle(p1Down ? COLOR_P1 : INACTIVE);
      this._p2ActionLights[action].setFillStyle(p2Down ? COLOR_P2 : INACTIVE);
    }
  }
}