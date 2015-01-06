'use strict';

if (window.cordova) {
  document.addEventListener('deviceready', onDeviceReady, false);
} else {
  window.onload = onDeviceReady;
}

function onDeviceReady() {
  var game = new Phaser.Game(<%= gameWidth %>, <%= gameHeight %>, Phaser.<%= renderer %>, '<%= _.slugify(projectName) %>');
  <% _.forEach(gameStates, function(gameState) {  %>
  game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>'));<% }); %>

  game.state.start('boot');
}
