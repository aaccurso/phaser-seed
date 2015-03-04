'use strict';

var game;

if (window.cordova) {
  document.addEventListener('deviceready', onDeviceReady, false);
  document.addEventListener("pause", function () {
    game.paused = true;
  }, false);
  document.addEventListener("resume", function () {
    game.paused = false;
  }, false);
} else {
  window.onload = onDeviceReady;
}

function onDeviceReady() {
  game = new Phaser.Game(<%= gameWidth %>, <%= gameHeight %>, Phaser.<%= renderer %>, '<%= _.slugify(projectName) %>');
  <% _.forEach(gameStates, function(gameState) {  %>
  game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>'));<% }); %>

  game.state.start('boot');
}
