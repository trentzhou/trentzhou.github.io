var playState = {
    create: function() {
        // create new background
        grassland = game.add.sprite(0, 600, 'grassland');

        // rabbits
        rabbitPoint = game.add.sprite(-1000, -1000, 'point');
        rabbitPoint.anchor.set(0.5);
        var baloons = [];

        var style = { font: "80px Arial", fill: "#414b6f", align: "center" };
        for (var i = 1; i <= 6; i++) {
            var baloon = game.add.sprite(-300, -300, 'baloon' + i);
            baloon.anchor.set(0.5);
            baloon.scale.set(0.7);
            baloon.inputEnabled = true;
            baloons.push(baloon);
    
            baloon.events.onInputDown.add(this.baloonPoked, this);
            // add text on this baloon
            var txt = game.make.text(0, -20, "xxx", style);
            txt.anchor.set(0.5);
            baloon.addChild(txt)
        }

        correctText = game.add.text(game.world.centerX, 700, '', style);
        correctText.anchor.set(0.5);

        this.grassland = grassland;
        this.rabbitPoint = rabbitPoint;
        this.baloons = baloons;
        this.correctText = correctText;
        this.correctWordIndex = 0;
        this.score = 30;
        scoreStyle = { font: "64px Arial", fill: "#ac6447", align: "center" };
        this.scoreText = game.add.text(50, 500, '' + this.score, scoreStyle);

        this.homeButton = game.add.sprite(700, 500, 'home');
        this.homeButton.inputEnabled = true;
        this.homeButton.events.onInputDown.add(function() {
            game.state.start('menu');
        });

        game.add.tween(grassland).to({y: 0}, 500, "Quart.easeOut").start();

        // audio
        this.whichAudio = game.add.audio('which_baloon');
        this.correctAudio = game.add.audio('correct');
        this.wrongAudio = game.add.audio('wrong');
        this.biuAudio = game.add.audio('biu');
        this.showPuzzle();
    },
    showScore: function() {
        this.scoreText.setText("" + this.score);
    },
    baloonPoked: function(baloon) {
        var correctPinyin = this.getPinyin(game.privateData.allUnits[game.privateData.activeUnit][this.correctWordIndex].split(" ")[1]);
        var selectedText = baloon.getChildAt(0).text;
        baloon.inputEnabled = false;
        if (correctPinyin == selectedText) {
            // correct word!
            var baloonBack = game.add.tween(baloon).to({x: 470, y: 280}, 500, "Quart.easeOut");
            
            // release other baloons
            for (var i = 0; i < candidateBaloons.length; i++) {
                var b = candidateBaloons[i];
                if (b != baloon) {
                    game.add.tween(b).to({y: -200}, 2000, "Quart.easeOut").start();
                }
            }
            var charFlyUp = game.add.tween(this.correctText).to({y: -200}, 1000, "Quart.easeOut");
            var baloonFlyUp = game.add.tween(baloon).to({y: -200}, 500, "Quart.easeOut");
            var rabbitFlyUp = game.add.tween(this.rabbitPoint).to({y: -200}, 500, "Quart.easeOut");
    
            charFlyUp.onComplete.add(this.showPuzzle, this);
            biuAudio = this.biuAudio;
            baloonBack.onComplete.add(function() {
                charFlyUp.start();
                baloonFlyUp.start();
                rabbitFlyUp.start();
                biuAudio.play();
            });
            this.correctAudio.play();
            baloonBack.start();
            this.score += 3;
            if (this.score >= 100) {
                game.state.start('win');
                return;
            }
            this.showScore();
        } else {
            game.add.tween(baloon).to({y: -200}, 2000, "Quart.easeOut").start();
            this.wrongAudio.play();
            this.score -= 5;
            this.showScore();
        }
    },
    showPuzzle: function() {
        this.rabbitPoint.x = 550;
        this.rabbitPoint.y = -200;
        this.correctText.y = 700;
        game.add.tween(this.correctText).to({y: 400}, 500, "Quart.easeOut").start();
        // all baloons are out of screen
        for (var i = 0; i < this.baloons.length; i++) {
            var baloon = this.baloons[i];
            baloon.x = -1000;
            baloon.y = -1000;
        }
        // select 3 baloons
        var candidates = [];
        candidateBaloons = [];
        for (var i = 0; i < 3; i++) {
            var index;
            while (true) {
                index = Math.floor(Math.random() * this.baloons.length);
                if (candidates.indexOf(index) < 0) {
                    candidates.push(index);
                    break;
                }
            }
            var baloon = this.baloons[index];
            candidateBaloons.push(baloon);
            baloon.x = 150 + 250 * i;
            baloon.inputEnabled = true;
            game.add.tween(baloon).to({y: 150}, 500, "Quart.easeOut").start();
        }
        // show the rabbit
        game.add.tween(this.rabbitPoint).to({y: 400}, 500, "Quart.easeOut").start();
    
        var wordList = game.privateData.allUnits[game.privateData.activeUnit];
        this.correctWordIndex = Math.floor(Math.random() * wordList.length);
        correctText.setText(wordList[this.correctWordIndex].split(' ')[0]);
        candidates = [];
        for (var i = 0; i < 3; i++) {
            var index;
            while (true) {
                index = Math.floor(Math.random() * wordList.length);
                if (candidates.indexOf(index) < 0) {
                    candidates.push(index);
                    break;
                }
            }
        }
        if (candidates.indexOf(this.correctWordIndex) < 0) {
            // put the correct index to the candidate list
            var index = Math.floor(Math.random() * 3);
            candidates[index] = this.correctWordIndex;
        }
        // set text to the baloon
        for (var i = 0; i < candidateBaloons.length; i++) {
            var baloon = candidateBaloons[i];
            var pinyin = wordList[candidates[i]].split(" ")[1];
    
            baloon.getChildAt(0).setText(this.getPinyin(pinyin));
        }
        this.whichAudio.play();
        this.showScore();
    },
    shutdown: function() {
        // destroy all sprites
        this.grassland.destroy();
        this.rabbitPoint.destroy();
        this.correctText.destroy();
        for (var i = 0; i < this.baloons.length; i++) {
            this.baloons[i].destroy();
        }
        this.scoreText.destroy();
        this.homeButton.destroy();
        this.correctAudio.destroy();
        this.wrongAudio.destroy();
        this.biuAudio.destroy();
        this.whichAudio.destroy();
    },
    getPinyin: function (input) {
        var variants = {
            'a': ['a', 'ā', 'á', 'ǎ', 'à'],
            'o': ['o', 'ō', 'ó', 'ǒ', 'ò'],
            'e': ['e', 'ē', 'é', 'ě', 'è'],
            'i': ['i', 'ī', 'í', 'ǐ', 'ì'],
            'u': ['u', 'ū', 'ú', 'ǔ', 'ù'],
            'ü': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
            'v': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
        };
        function tone_radix(c) {
            var lookup_table = {
                'a': 1,
                'o': 2,
                'e': 3,
                'i': 10,
                'u': 10,
                'v': 10,
            };
            if (lookup_table.hasOwnProperty(c))
                return lookup_table[c];
            return 100;
        }
    
        var result = [];
        for (var i = 0; i < input.length; i++) {
            var c = input[i];
            if (c >= '1' && c <= '4') {
                var index = c - '0'
                // find position to translate
                var min_pos = 0;
                var min_radix = 100;
                // search the latest word
                for (var j = result.length - 1; j >= 0; j--) {
                    c = result[j];
                    if (c < 'a' || c > 'z')
                        break;
                    var radix = tone_radix(c)
                    if (radix < min_radix) {
                        min_pos = j;
                        min_radix = radix;
                    }
                }
                c = result[min_pos];
                if (variants.hasOwnProperty(c)) {
                    result[min_pos] = variants[c][index];
                }
            } else {
                result.push(c)
            }
        }
        
        return result.join('')
    }
    
}