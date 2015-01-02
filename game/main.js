'use strict';

window.onload = function () {
  var game = new Phaser.Game(1280, 690, Phaser.AUTO, 'game');
  
  game.state.add('boot', require('./states/boot'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));

  game.state.start('boot');
};
