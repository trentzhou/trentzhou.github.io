class Chord {
    constructor() {
        this.root_note = null;
        this.note3 = null;
        this.note5 = null;
        this.note7 = null;
        this.additions = [];
    }

    toString() {
        return "Chord[" + 
            "root=" + this.root_note +
            ",3rd=" + this.note3 +
            ",5th=" + this.note5 +
            ",7th=" + this.note7 +
            ",additions=" + this.additions +
            "]";
    }

    root(note) {
        this.root_note = note;
        this.maj3();
        return this;
    }

    maj3() {
        this.note3 = "maj3";
        this.note5 = "perfect5";
        this.additions = [];
        return this;
    }

    min3() {
        this.note3 = "min3";
        this.note5 = "perfect5";
        this.additions = [];
        return this;
    }

    aug5() {
        this.note3 = "maj3";
        this.note5 = "aug5";
        this.additions = [];
        return this;
    }

    dim5() {
        this.note3 = "min3";
        this.note5 = "dim5";
        this.additions = [];
        return this;
    }

    maj7() {
        this.note7 = "maj7";
        return this;
    }

    min7() {
        this.min3();
        this.note7 = "min7";
        return this;
    }

    dom7() {
        this.maj3();
        this.note7 = "min7";
        return this;
    }

    dim7() {
        this.note3 = "min3";
        this.note5 = "dim5";
        this.note7 = "dim7";
        return this;
    }

    dom9() {
        this.dom7();
        this.additions.push("maj9");
        return this;
    }

    maj9() {
        this.maj7();
        this.additions.push("maj9");
        return this;
    }

    min9() {
        this.additions.push("min9");
        return this;
    }

    add(number) {
        this.additions.push(number);
        return this;
    }

    sus4() {
        this.note3 = "perfect4";
        return this;
    }

    sus2() {
        this.note3 = "maj2";
        return this;
    }

    apply_string(s) {
        switch (s) {
            case "M":
            case "maj":
                this.maj3();
                break;
            case "m":
            case "min":
                this.min3();
                break;
            case "aug":
                this.aug5();
                break;
            case "dim":
                this.dim5();
                break;
            case "maj7":
            case "M7":
            case "(maj7)":
                this.maj7();
                break;
            case "7":
                this.dom7();
                break;
            case "m7":
            case "min7":
                this.min7();
                break;
            case "+5":
            case "#5":
            case "+":
                this.aug5();
                break;
            case "-5":
            case "b5":
                this.dim5();
                break;
            case "-9":
            case "b9":
                this.min9();
                break;
            case "maj9":
                this.maj9();
                break;
            case "9":
                this.dom9();
                break;
            case "add9":
                this.add("9");
                break;
            case "6":
                this.add("6");
                break;
            case "sus":
            case "sus4":
                this.sus4();
                break;
            case "sus2":
                this.sus2();
                break;
            case "dim7":
                this.dim7();
                break;
        }
        return this;
    }

    get_notes() {
        let result = [];
        result.push(this.root_note);
        if (this.note3 != null) {
            let note3 = NoteResolver.get_note_interval(this.root_note, this.note3);
            result.push(note3);
        }
        if (this.note5 != null) {
            let note5 = NoteResolver.get_note_interval(this.root_note, this.note5);
            result.push(note5);
        }
        if (this.note7 != null) {
            let note7 = NoteResolver.get_note_interval(this.root_note, this.note7);
            result.push(note7);
        }
        this.additions.forEach(x => {
            let note = NoteResolver.get_note_interval(this.root_note, x);
            result.push(note);
        })
        result.sort();
        return result;
    }
}


class NoteResolver {
    static all_note_names = null;

    static gen_note_name_map() {
        let names = [""];
        ["A", "A#/Bb", "B"].forEach((x) => {names.push(x)})
        let note_names = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
        let select_root_note = document.getElementById("root-note");
        select_root_note.innerHTML = "";
        note_names.forEach((x) => {
            let s = document.createElement("option");
            s.innerHTML = x;
            select_root_note.appendChild(s);
        })
        for (let i = 0; i < 7; i++) {
            note_names.forEach((x) => {
                names.push(x);
            })
        }
        names.push("C");
        NoteResolver.all_note_names = names;
    }

    /**
     * Get name of a note.
     * 
     * @param {int} index - the index of note, number between 1 and 88
     * @returns {string} - name of the note
     */
    static get_note_name(index) {
        if (NoteResolver.all_note_names == null) {
            NoteResolver.gen_note_name_map();
        }
        return NoteResolver.all_note_names[index];
    }

    /**
     * Get root note of a chord.
     * 
     * @param {string} name - the name of the note, like "C" or "C#"
     * @param {int} range - the range of the note, number 1 to 6
     * 
     * @return {int} the index of note, a number between 1 and 88
     */
    static get_note(name, range) {
        let start = 15 + 12 * (parseInt(range)-1);
        for (let i = start; i <= 88; i++) {
            let note_name = NoteResolver.get_note_name(i);
            if (note_name.split("/").includes(name)) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Get note plus interval.
     * 
     * @param {int} start - start note, a number between 1 and 88
     * @param {string} interval - string like "maj3", "maj7"
     */
    static get_note_interval(start, interval) {
        let halftone_intervals = {
            "min2": 1,
            "maj2": 2,
            "min3": 3,
            "maj3": 4,
            "perfect4": 5,
            "aug4": 6,
            "dim5": 6,
            "tritone": 6,
            "perfect5": 7,
            "aug5": 8,
            "min6": 8,
            "maj6": 9,
            "dim7": 9,
            "min7": 10,
            "maj7": 11,
            "octave": 12,
            "min9": 13,
            "maj9": 14,
            "min10": 15,
            "maj10": 16,
            "perfect11": 17,
            "aug11": 18,
            "dim12": 18,
            "perfect12": 19,
            "min13": 20,
            "maj13": 21,
            "min14": 22,
            "maj14": 23,
            "2": 2,
            "3": 4,
            "4": 5,
            "5": 7,
            "6": 9,
            "7": 11,
            "8": 12,
            "9": 14,
            "10": 16,
            "11": 17,
            "12": 19,
            "13": 21,
            "14": 23,
            "15": 24
        }

        if (halftone_intervals.hasOwnProperty(interval)) {
            return start + halftone_intervals[interval];
        }
        throw "Invalid interval " + interval;
    }
}

/**
 * Build a chord from string
 * @param {string} name - name of the chord
 * @param {int} range - octave range
 */
function build_chord(name, range) {
    var input = name;

    function read_root_note() {
        let choices = [
            "C#", "D#", "E#", "F#", "G#", "A#", "B#",
            "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb",
            "C", "D", "E", "F", "G", "A", "B"
        ]
        for (let i = 0; i < choices.length; i++) {
            let x = choices[i];
            if (input.startsWith(x)) {
                input = input.substring(x.length);
                return x;
            }
        }
        throw "Root note not found";
    }

    function read_addition() {
        let choices = [
            "(maj7)", "maj7", "min7", "maj9", "M7", "m7", 
            "M", "maj", "min", "m", "aug", "dim7", "dim", "7",
             "+5", "#5", "-5", "b5", "-9", "b9", "9",
            "add9", "6", "sus4", "sus2", "sus", 
            "+"
        ];
        for (let i = 0; i < choices.length; i++) {
            let x = choices[i];
            if (input.startsWith(x)) {
                input = input.substring(x.length);
                return x;
            }
        }
        return null;
    }
    
    let c = new Chord();
    
    let root = read_root_note();
    if (root != null) {
        let index = NoteResolver.get_note(root, range);
        c.root(index);

        while (true) {
            let addition = read_addition();
            if (addition == null)
                break;
            c.apply_string(addition);
        }
        return c;
    }
    return null;
}