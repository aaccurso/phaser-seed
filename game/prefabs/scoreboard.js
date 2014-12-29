'use strict';

var Scoreboard = function(game) {
  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.set(0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.set(0.5);

  this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);

  this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
  this.add(this.bestScoreText);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.set(0.5);

  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
  var medal, bestScore;

  // Step 1
  this.scoreText.setText(score.toString());

  if (!!localStorage) {
    // Step 2
    bestScore = localStorage.getItem('bestScore');

    // Step 3
    if (!bestScore || bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }
  } else {
    // Fallback. LocalStorage isn't available
    bestScore = 'N/A';
  }

  // Step 4
  this.bestScoreText.setText(bestScore.toString());

  // Step 5 & 6
  if (score >= 10 && score < 20)
  {
    medal = this.game.add.sprite(-65 , 7, 'medals', 1);
    medal.anchor.set(0.5);
    this.scoreboard.addChild(medal);
  } else if (score >= 20) {
    medal = this.game.add.sprite(-65 , 7, 'medals', 0);
    medal.anchor.set(0.5);
    this.scoreboard.addChild(medal);
  }

  // Step 7
  if (medal) {

    var emitter = this.game.add.emitter(medal.x, medal.y, 400);
    this.scoreboard.addChild(emitter);
    emitter.width = medal.width;
    emitter.height = medal.height;

    emitter.makeParticles('particle');

    emitter.setRotation(-100, 100);
    emitter.setXSpeed(0, 0);
    emitter.setYSpeed(0, 0);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 0.5;
    emitter.setAll('body.allowGravity', false);

    emitter.start(false, 1000, 1000);

  }
  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

module.exports = Scoreboard;
