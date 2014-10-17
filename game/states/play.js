
  'use strict';
  var Bird = require('../prefabs/bird');

  function Play() {}
  Play.prototype = {
    create: function() {
      // Set physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 500;

      this.background = this.game.add.sprite(0,0,'background');

      // Create a new bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.bird);
    },
    update: function() {
    }
  };

  module.exports = Play;
