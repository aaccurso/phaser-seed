'use strict';

require('named-args');

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
    this.game.global = {
      CONFIG: require('../config.json')
    };
  },
  _initScaleAndOrientation: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.forceOrientation(true);
  },
  _initPlugins: function() {

  }
};

module.exports = Boot;
