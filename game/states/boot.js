'use strict';

function Boot() {}

Boot.prototype = {
  init: function() {
    this._initGlobalReferences();
    this._initScaleAndOrientation();
    this._initPlugins();
  },
  preload: function() {
    this.load.image('preloader', 'assets/preloader.png');
    // Removes launch screen on mobile
    if (window.screen.show) {
      window.screen.show();
    }
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.state.start('preload');
  },
  _initGlobalReferences: function() {
    this.game.CONFIG = require('../config.json');
    this.game.GAME_CONFIG = require('../game.config.json');
  },
  _initScaleAndOrientation: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.forceOrientation(true);
  },
  _initPlugins: function() {
    this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
    this.game.stateTransition.configure({
      duration: Phaser.Timer.SECOND * 0.8,
      ease: Phaser.Easing.Exponential.InOut,
      properties: {
        alpha: 0,
        scale: {
          x: 1.4,
          y: 1.4
        }
      }
    });
  }
};

module.exports = Boot;
