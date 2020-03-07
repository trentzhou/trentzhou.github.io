var CHARS_ON_SCREEN = 1
var CHAR_SPEED = 4

// Use requestAnimationFrame to maintain smooth animation loops.
// Fall back on setTimeout() if browser support isn't available.
window.requestAnimFrame = (() => {
	return 	window.requestAnimationFrame ||
		   	window.webkitRequestAnimationFrame ||
		   	window.mozRequestAnimationFrame ||
		   	function(callback) {
		   		window.setTimeout(callback, 1000 / 40);
			};
})();

// Get a random number within the specified range.
function random(min, max) {
	return Math.random() * (max - min) + min;
}

function boom() {
    let a = new Audio("explode.mp3")
    a.onended = function(e) {
        delete(a)
    }
    a.play()
}

class RunningChar {
    constructor(c, hue, x, y, speed) {
        this.c = c
        this.charCode = c.charCodeAt(0)
        this.hue = hue
        this.x = x
        this.y = y
        this.speed = speed
        this.font = '3em serif'
    }

    update() {
        this.y -= this.speed
        if (this.y < 0) {
            return false
        }
        return true
    }

    draw(context) {
        context.fillStyle = `hsl(${this.hue}, 100%, 80%)`
        context.font = this.font;
        context.fillText(this.c, this.x, this.y)
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x
        this.y = y
        this.lastX = x
        this.lastY = y
        this.hue = hue

        this.direction = random(0, Math.PI * 2)
        this.hue = random(hue - 20, hue + 20)
        this.brightness = random(50, 80)
        this.transparency = 1
        this.decay = random(0.01, 0.02)
        this.speed = random(1, 10)
        this.gravity = 0.7
        this.friction = 0.97
    }

    update() {
        this.speed *= this.friction
        this.lastX = this.x
        this.lastY = this.y
        this.x += Math.cos(this.direction) * this.speed
        this.y += Math.sin(this.direction) * this.speed + this.gravity
        this.transparency -= this.decay
        if (this.transparency <= this.decay)
            return false
        return true
    }

    draw(context) {
        context.beginPath()
        context.moveTo(this.lastX, this.lastY)
        context.lineTo(this.x, this.y)
        context.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.transparency})`
        context.stroke()
    }
}

class TypePractice {
    constructor(charCanvas, fireworksCanvas) {
        this.charCanvas = charCanvas
        this.charContext = this.charCanvas.getContext('2d')

        this.fireworksCanvas = fireworksCanvas
        this.fireworksContext = this.fireworksCanvas.getContext('2d')

        this.runningChars = []
        this.particles = []
        this.hue = 120;
    }

    setSize(width, height) {
        this.width = width
        this.height = height
        this.charCanvas.width = width
        this.fireworksCanvas.width = width
        this.charCanvas.height = height
        this.fireworksCanvas.height = height

        this.fillChars()
    }

    fillChars() {
        while (this.runningChars.length < CHARS_ON_SCREEN) {
            let x = random(50, this.width-50)
            let y = random(this.height - 50, this.height)
            let hue = random(0, 255)
            let speed = random(2, CHAR_SPEED)
            let c = random('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
            c = String.fromCharCode(c)

            let runningChar = new RunningChar(c, hue, x, y, speed)
            this.runningChars.push(runningChar)
        }
    }

    // @param RunningChar runningChar
    drawRunningChar(runningChar) {
        runningChar.draw(this.charContext)
    }

    cleanCanvas() {
        let context = this.fireworksContext

        // Set 'destination-out' composite mode, so additional fill doesn't remove non-overlapping content.
        context.globalCompositeOperation = 'destination-out';
        // Set alpha level of content to remove.
        // Lower value means trails remain on screen longer.
        context.fillStyle = `rgba(0, 0, 0, 0.15)`;
        // Fill entire canvas.
        context.fillRect(0, 0, this.width, this.height);
        // Reset composite mode to 'lighter', so overlapping particles brighten each other.
        context.globalCompositeOperation = 'lighter';

        context = this.charContext
        context.clearRect(0, 0, this.width, this.height)
    }

    update() {
        // update all existing chars
        let newList = []
        for (const runningChar of this.runningChars) {
            let ok = runningChar.update()
            if (ok)
                newList.push(runningChar)
        }
        delete(this.runningChars)
        this.runningChars = newList
        this.fillChars()
        // update particles
        let newParticles = []
        for (const p of this.particles) {
            let ok = p.update()
            if (ok)
                newParticles.push(p)
        }
        delete(this.particles)
        this.particles = newParticles
    }

    fireAt(runningChar) {
        for (let i = 0; i < 100; i++) {
            let p = new Particle(runningChar.x, runningChar.y, runningChar.hue)
            this.particles.push(p)
        }
        boom()
        runningChar.y = -40
    }

    handleKeyDown(key) {
        let boom = false;
        
        if (key == 38) {
            //up
            CHAR_SPEED++;
            boom = true
        } else if (key == 40) {
            // down
            if (CHAR_SPEED > 2)
                CHAR_SPEED--;
            boom = true
        } else if (key == 39) {
            // right
            CHARS_ON_SCREEN++;
            boom = true
        } else if (key == 37) {
            // left
            if (CHARS_ON_SCREEN > 1)
                CHARS_ON_SCREEN--;
            boom = true
        } else if (key == 32) {
            // space
            boom = true
        }
        for (const runningChar of this.runningChars) {
            // 空格键放大招
            if (runningChar.y > 0 && (runningChar.charCode == key || boom)) {
                this.fireAt(runningChar)
            }
        }
    }

    handleClick(x, y) {
        for (const c of this.runningChars) {
            if (x >= c.x-30 && x <= c.x+70 &&
                y >= c.y-30 && y <= c.y+70) {
                this.fireAt(c)
            }
        }
    }

    draw() {
        for (const runningChar of this.runningChars) {
            runningChar.draw(this.charContext)
        }
        for (const p of this.particles) {
            p.draw(this.fireworksContext)
        }
    }
}

let charCanvas = document.getElementById('char-canvas');
let fireworksCanvas = document.getElementById('fireworks-canvas')

let typePractice = new TypePractice(charCanvas, fireworksCanvas)
typePractice.setSize(window.innerWidth, window.innerHeight)

function loop() {
    let frameInterval = 30    
    setTimeout(function() {
        requestAnimFrame(loop);
      }, frameInterval);
    //requestAnimFrame(loop);
    typePractice.cleanCanvas()

    typePractice.update()
    typePractice.draw()
}

window.onload = loop
window.onkeydown = function(e) {
    typePractice.handleKeyDown(e.which)
}
window.onresize = function(e) {
    typePractice.setSize(window.innerWidth, window.innerHeight)
}
window.onmousedown = function(e) {
    typePractice.handleClick(e.pageX, e.pageY)
}
window.ontouchstart = function(e) {
    typePractice.handleClick(e.pageX, e.pageY)
}