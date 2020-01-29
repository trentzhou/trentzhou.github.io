var loadState = {
    preload: function() {
        game.load.image('background', 'assets/background1.jpeg');
        game.load.image('number1', 'assets/1.png');
        game.load.image('number2', 'assets/2.png');
        game.load.image('number3', 'assets/3.png');
        game.load.image('point', 'assets/rabbit_point.png');
        game.load.image('success', 'assets/rabbit_success.png');
        game.load.image('fail', 'assets/rabbit_fail.png');
        game.load.image('go', 'assets/go.png');
        game.load.image('grassland', 'assets/grassland.jpeg');
        game.load.image('home', 'assets/home.png');
        for (var i = 1; i <= 6; i++) {
            game.load.image('baloon' + i, 'assets/baloon' + i + '.png');
        }
        // load audio
        game.load.audio('biu', 'assets/biu.mp3');
        game.load.audio('which_baloon', 'assets/which_baloon.mp3');
        game.load.audio('correct', 'assets/correct.mp3');
        game.load.audio('wrong', 'assets/wrong.mp3');
    },
    create: function() {
        game.state.start('splash');
    }
}