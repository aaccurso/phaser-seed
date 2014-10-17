
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');

  function Play() {}
  Play.prototype = {
    create: function() {
      // Set physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 1200;

      this.background = this.game.add.sprite(0,0,'background');

      // Create a new bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.bird);

      // create and add a new Ground object
      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);

      // add mouse/touch controls
      this.input.onDown.add(this.bird.flap, this.bird);
    },
    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground);
    }
  };

  module.exports = Play;
