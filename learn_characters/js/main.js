var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create});

function preload() {
    game.load.image('right', 'assets/images/right.png');
    game.load.image('wrong', 'assets/images/wrong.png');
    game.load.audio('characters', ['assets/audio/characters.mp3','assets/audio/characters.ogg'] );
    game.load.audio('correct', ['assets/audio/correct.mp3', 'assets/audio/correct.ogg']);
    game.load.audio('incorrect', ['assets/audio/incorrect.mp3', 'assets/audio/incorrect.ogg']);
    game.load.audio('retry', ['assets/audio/retry.mp3', 'assets/audio/retry.ogg']);
}

var characters;
var correct;
var incorrect;
var retry;
var audio_status = "instruction";

var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var charToGuess = "A";
var guessedChar = null;
var candidates = ["A", "B", "C"];
var charPictures = {};
var rightPicture;
var wrongPicture;

function resetCharPictures() {
    for (var c in charPictures) {
        var picture = charPictures[c];
        picture.x = -200;
        picture.y = -200;
    }
}

function playChar(marker) {
    if (marker == "instruction") {
        characters.play(charToGuess);
    } else if (guessedChar != null && guessedChar != charToGuess) {
        // play retry instruction
        guessedChar = null;
        retry.play();
    }
}

function drawGuessScreen() {
    rightPicture.x = -1000;
    rightPicture.y = -1000;
    wrongPicture.x = -1000;
    wrongPicture.y = -1000;
    for (var i = 0; i < 3; i++) {
        var c = candidates[i];
        var picture = charPictures[c];
        picture.x = i * 200 + 150;
        picture.y = 400;
    }
}

function drawWinScreen() {
    // draw win screen
    rightPicture.x = 0;
    rightPicture.y = 0;
    wrongPicture.x = -1000;
    wrongPicture.y = -1000;
}

function drawFailScreen() {
    // draw fail screen
    rightPicture.x = -1000;
    rightPicture.y = -1000;
    wrongPicture.x = 0;
    wrongPicture.y = 0;
}

function guessChar() {
    // populate 3 candidates
    var c = possibleChars[Math.floor(Math.random() * possibleChars.length)];
    for (var i = 0; i < 3; i++) {
        var candidate;
        while (true) {
            var index = Math.floor(Math.random() * possibleChars.length);
            candidate = possibleChars[index];
            // make sure the candidate is different with the correct character
            if (candidate == c)
                continue;
            var duplicate = false;
            for (var j = 0; j < i; j++) {
                if (candidates[j] == candidate)
                    duplicate = true;
            }
            if (duplicate)
                continue;
            break;
        }
        candidates[i] = candidate;
    }
    var correctIndex = Math.floor(Math.random() * 3);
    candidates[correctIndex] = c;
    charToGuess = c;
    guessedChar = null;
    // draw candidates on screen
    resetCharPictures();
    drawGuessScreen();

    characters.play("instruction");
}

function onGuessCorrect() {
    drawWinScreen();
    correct.play();
}

function onGuessError() {
    drawFailScreen();
    incorrect.play();
}

function onGuess() {

    if (guessedChar == charToGuess) {
        onGuessCorrect();
    } else {
        onGuessError();
    }
}

function onKeyboard() {
    var pressed = game.input.keyboard.event.keyCode;
    var myGuess = -1;

    if (pressed == Phaser.Keyboard.RIGHT) {
        myGuess = 2;
    } else if (pressed == Phaser.Keyboard.LEFT) {
        myGuess = 0;
    } else if (pressed == Phaser.Keyboard.UP || pressed == Phaser.Keyboard.DOWN) {
        myGuess = 1;
    }
    if (myGuess > 0) {
        // am I correct?
        guessedChar = candidates[myGuess];
        onGuess();
    }
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#707070';

    rightPicture = game.add.sprite(-1000, -1000, 'right');
    wrongPicture = game.add.sprite(-1000, -1000, 'wrong');

    characters = game.add.audio('characters');
    correct = game.add.audio('correct');
    incorrect = game.add.audio('incorrect');
    retry = game.add.audio('retry');

    // TODO: add markers for characters
    characters.addMarker("instruction", 0.0, 3.571);
    characters.addMarker("A", 3.61, 1.50);
    characters.addMarker("B", 5.0, 1.50);
    characters.addMarker("C", 6.71, 1.50);
    characters.addMarker("D", 8.2, 1.50);
    characters.addMarker("E", 9.2, 1.50);
    characters.addMarker("F", 11.2, 1.50);
    characters.addMarker("G", 13.1, 1.50);

    characters.addMarker("H", 14.5, 1.50);
    characters.addMarker("I", 16.2, 1.50);
    characters.addMarker("J", 17.7, 1.50);
    characters.addMarker("K", 19.4, 1.50);
    characters.addMarker("L", 21.0, 1.50);
    characters.addMarker("M", 22.1, 1.50);
    characters.addMarker("N", 23.7, 1.50);

    characters.addMarker("O", 25.3, 1.50);
    characters.addMarker("P", 26.7, 1.50);
    characters.addMarker("Q", 28.3, 1.50);
    characters.addMarker("R", 29.9, 1.50);
    characters.addMarker("S", 31.7, 1.50);
    characters.addMarker("T", 33.5, 1.50);

    characters.addMarker("U", 35.3, 1.50);
    characters.addMarker("V", 36.8, 1.50);
    characters.addMarker("W", 38.6, 1.50);
    characters.addMarker("X", 40.3, 1.50);
    characters.addMarker("Y", 41.8, 1.50);
    characters.addMarker("Z", 43.6, 1.50);

    // generate char pictures
    var style = { font: "150px Arial", fill: "#ff8030", align: "center" };

    for (var i in possibleChars) {
        var c = possibleChars[i];
        var text = game.add.text(-200, -200, c, style);

        text.inputEnabled = true;
        text.events.onInputDown.add(function(picture) {
            guessedChar = picture.text;
            onGuess();
        });
        charPictures[c] = text;
    }

    characters.onMarkerComplete.add(playChar);
    correct.onStop.add(guessChar);
    incorrect.onStop.add(function() {
        characters.play(guessedChar);
    });
    retry.onStop.add(function() {
        characters.play(charToGuess);
    });

    guessChar();

    game.input.keyboard.onDownCallback = onKeyboard;
}
