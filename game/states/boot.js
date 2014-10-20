
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    // Scale and orientation
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.setScreenSize();
    this.game.scale.refresh();
    this.game.scale.forcePortrait = true;
    
    this.load.image('preloader', 'preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;
