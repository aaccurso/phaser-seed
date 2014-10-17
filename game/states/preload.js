
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    // Scale and orientation
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.setScreenSize();
    this.game.scale.refresh();
    this.game.scale.forcePortrait = true;

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    this.load.image('background', 'background.png');
    this.load.image('ground', 'ground.png');
    this.load.image('title', 'title.png');
    this.load.image('startButton', 'start-button.png');
    this.load.image('instructions', 'instructions.png');
    this.load.image('getReady', 'get-ready.png');
    this.load.image('scoreboard', 'scoreboard.png');
    this.load.image('gameover', 'gameover.png');
    this.load.image('particle', 'particle.png');

    this.load.spritesheet('medals', 'medals.png', 44, 46, 2);
    this.load.spritesheet('bird', 'bird.png', 34, 24, 3);
    this.load.spritesheet('pipe', 'pipes.png', 54, 320, 2);

    this.load.bitmapFont('flappyfont', 'flappyfont.png', 'flappyfont.fnt');

    this.load.audio('score', 'score.wav');
    this.load.audio('flap', 'flap.wav');
    this.load.audio('pipeHit', 'pipe-hit.wav');
    this.load.audio('groundHit', 'ground-hit.wav');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
