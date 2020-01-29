var menuState = {
    create: function() {
        this.grassland = game.add.sprite(0, 600, 'grassland');
        game.add.tween(this.grassland).to({'y': 0}, 500, "Quart.easeOut").start();

        var keys = Object.keys(game.privateData.allUnits).sort();
        this.baloons = [];
        var style = { font: "60px Arial", fill: "#414b6f", align: "center" };
        for (var i = 0; i < keys.length; i++) {
            var row = Math.floor(i / 4);
            var col = i % 4;
            var x = 100 + 200 * col;
            var y = 150 + 300 * row;
            var baloon = game.add.sprite(x, -200, 'baloon1');

            baloon.scale.set(0.7);
            baloon.anchor.set(0.5);
            baloon.inputEnabled = true;
            baloon.events.onInputDown.add(function(baloon) {
                game.privateData.activeUnit = baloon.getChildAt(0).text;
                game.state.start('play');
            });
            var txt = game.make.text(0, -20, keys[i], style);
            txt.anchor.set(0.5);
            baloon.addChild(txt)
            this.baloons.push(baloon);
            game.add.tween(baloon).to({'y': y}, 500, "Quart.easeOut").start();
        }
    },
    shutdown: function() {
        this.grassland.destroy();
        for (var i = 0; i < this.baloons.length; i++) {
            this.baloons[i].destroy();
        }
    }
};