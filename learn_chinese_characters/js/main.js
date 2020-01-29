var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// setup date shared between states
game.privateData = {
    activeUnit: "单元 1",
    allUnits: all_units
}

game.state.add('load', loadState);
game.state.add('splash', splashState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('load');