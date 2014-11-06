'use strict';

window.onload = function () {
  var game = new Phaser.Game(<%= gameWidth %>, <%= gameHeight %>, Phaser.AUTO, '<%= _.slugify(projectName) %>');
  <% _.forEach(gameStates, function(gameState) {  %>
  game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>'));<% }); %>

  game.state.start('boot');
};
