'use strict';

function Play() {}

Play.prototype = {
  create: function() {
    this.background = this.game.add.sprite(this.world.centerX, this.world.centerY, 'yeoman');
    this.background.anchor.set(0.5);
  },
  update: function() {

  },
  shutdown: function() {

  }
};

module.exports = Play;
