
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/scoreboard');

  function Play() {}
  Play.prototype = {
    create: function() {
      // Set physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 1200;

      this.background = this.game.add.sprite(0, 0, 'background');

      // Create a new bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.bird);

      // create and add a group to hold our pipeGroup prefabs
      this.pipes = this.game.add.group();

      // create and add a new Ground object
      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);

      // create instructions
      this.instructionGroup = this.game.add.group();
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100, 'getReady'));
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325, 'instructions'));
      this.instructionGroup.setAll('anchor.x', 0.5);
      this.instructionGroup.setAll('anchor.y', 0.5);

      // add mouse/touch controls
      this.input.onDown.addOnce(this.startGame, this);
      this.input.onDown.add(this.bird.flap, this.bird);

      // score
      this.score = 0;
      this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
      this.scoreText.visible = false;
      this.scoreSound = this.game.add.audio('score');
    },
    generatePipes: function() {
      var pipeY = this.game.rnd.integerInRange(-100, 100);
      var pipeGroup = this.pipes.getFirstExists(false);
      if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);
      }
      pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);
    },
    update: function() {
      // enable collisions between the bird and the ground
      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

      // enable collisions between the bird and each group in the pipes group
      this.pipes.forEach(function(pipeGroup) {
        this.checkScore(pipeGroup);
        this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
      }, this);
    },
    startGame: function() {
      this.bird.body.allowGravity = true;
      this.bird.alive = true;

      // add a timer
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      this.pipeGenerator.timer.start();

      this.instructionGroup.destroy();
    },
    checkScore: function(pipeGroup) {
      if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
          pipeGroup.hasScored = true;
          this.score++;
          this.scoreSound.play();
          this.scoreText.setText(this.score.toString());
      }
    },
    deathHandler: function() {
      if (!this.bird.alive) {
        return;
      }
      this.bird.alive = false;
      this.pipes.callAll('stop');
      this.pipeGenerator.timer.stop();
      this.ground.stopScroll();
      this.scoreboard = new Scoreboard(this.game);
      this.game.add.existing(this.scoreboard);
      this.scoreboard.show(this.score);
    },
    shutdown: function() {
      this.bird.destroy();
      this.pipes.destroy();
      this.scoreboard.destroy();
    }
  };

  module.exports = Play;
