var splashState = {
    create: function() {
        // show splash
        var background = game.add.sprite(0, 0, 'background');
        var number1 = game.add.sprite(-100, game.world.centerY, 'number1'); number1.anchor.set(0.5);
        var number2 = game.add.sprite(-100, game.world.centerY, 'number2'); number2.anchor.set(0.5);
        var number3 = game.add.sprite(-100, game.world.centerY, 'number3'); number3.anchor.set(0.5);
        var tweenReadyGo = game.add.tween(number1).to( { x: game.world.centerX }, 500, "Quart.easeOut");
        var tween2 = game.add.tween(number1).to( { x: 900 }, 500, "Quart.easeOut");
        var tween3 = game.add.tween(number2).to( { x: game.world.centerX }, 500, "Quart.easeOut");
        var tween4 = game.add.tween(number2).to( { x: 900 }, 500, "Quart.easeOut");
        var tween5 = game.add.tween(number3).to( { x: game.world.centerX }, 500, "Quart.easeOut");
        var tween6 = game.add.tween(number3).to( { x: 900 }, 500, "Quart.easeOut");
        var goButton = game.add.sprite(game.world.centerX, -200, 'go'); goButton.anchor.set(0.5);
        var tween7 = game.add.tween(goButton).to({y: game.world.centerY}, 500, "Quart.easeOut");

        this.background = background;
        this.number1 = number1;
        this.number2 = number2;
        this.number3 = number3;
        this.goButton = goButton;

        tweenReadyGo.chain(tween2);
        tween2.chain(tween3);
        tween3.chain(tween4);
        tween4.chain(tween5);
        tween5.chain(tween6);
        tween6.chain(tween7);

        goButton.inputEnabled = true;
        goButton.events.onInputDown.add(this.gotoMenu, this);

        tweenReadyGo.start();
    },
    gotoMenu: function() {
        game.state.start('menu')
    },
    shutdown: function() {
        // release the sprites
        this.background.destroy();
        this.number1.destroy();
        this.number2.destroy();
        this.number3.destroy();
    }
}