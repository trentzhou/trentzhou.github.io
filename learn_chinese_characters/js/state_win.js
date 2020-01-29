var winState = {
    create: function() {
        this.grassland = game.add.sprite(0, 0, 'grassland');
        this.rabbits = [];
        this.tweens = [];
        for (var i = 0; i < 4; i++) {
            var x = 100 + 200 * i;
            var y = 600;
            var rabbit = game.add.sprite(x, y, 'success');
            this.rabbits.push(rabbit);
            rabbit.anchor.set(0.5);
            var tween = game.add.tween(rabbit)
                .to( { y: 350 }, 1000, "Linear", true)
                .to( { y: 600 }, 1000, "Linear", true).loop();
            this.tweens.push(tween);
        }
        this.homeButton = game.add.sprite(700, 50, 'home');
        this.homeButton.inputEnabled = true;
        this.homeButton.events.onInputDown.add(function() {
            game.state.start('menu');
        });
    },
    shutdown: function() {
        // destroy the tweens
        game.tweens.removeAll();
        // destroy the rabbits
        for (var i = 0; i < this.rabbits.length; i++) {
            this.rabbits[i].destroy();
        }
        this.grassland.destroy();
    }
}