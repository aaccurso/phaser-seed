'use strict';

function Preload() {}

Preload.prototype = {
  init: function () {

  },
  preload: function() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.preloader = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader');
    this.preloader.anchor.set(0.5);
    this.load.setPreloadSprite(this.preloader);

    this.load.image('yeoman', 'assets/yeoman-logo.png');
  },
  onLoadComplete: function() {
    this.state.start('play');
  }
};

module.exports = Preload;
