//**********************MODEL***************************
//**********CANVAS*************
canvas = document.querySelector("#mycanvas")
canvass = document.querySelector("#mycanvass")
var c = canvas.getContext("2d")
var c2 = canvass.getContext("2d")
var w = 300;
var h = 500;
var xx = 0;
var dx = 0;
var dy = 0;
var yy = 0;
canvas.width = w
canvas.height = h
canvass.width = w
canvass.height = h
var color;
var trans;
var ih, im, il, lh, lm, ll, mh, mm, ml, dh, dm, dl, ah, am, al, ph, pm, pl, loh, lom, lol, a2;

//Global variables 
var model = [];
var notes = [];
var tonic = 0;
var dif = [];
var dict_tonic = { Do: 12, DoS: 13, Re: 14, ReS: 15, Mi: 16, Fa: 17, FaS: 18, Sol: 19, SolS: 20, La: 21, LaS: 22, Si: 23 };
var velocities = [];
var timeOut;
var call;
var circleArray = [];


//MIDI Access
navigator.requestMIDIAccess().then(access => {
    const devices = access.inputs.values();
    for (let device of devices)
        device.onmidimessage = onMidiMessage;

}).catch(console.error);

for (let i = 0; i < 109; i++) {
    model.push({
        name: "K" + i,
        isPressed: false,
    })
}

//Capturing MIDI messages 
function onMidiMessage(message) {
    let [key, input, value] = message.data;
    if (key == 144)
        buttonPressed(message.data[1])
    if (key == 128)
        buttonReleased(message.data[1])
    store(message);
}

function buttonPressed(input) {
    model[input - 12].isPressed = true;
    xx = 1;
}

function buttonReleased(input) {
    model[input - 12].isPressed = false;
    xx = 0;
}

//Initializer function that gets the tonic note in the 'input' and initialize global variables
function capture() {
    var valor = document.getElementsByName("tonica")[0].value;
    tonic = dict_tonic[valor];
    if (tonic == undefined) {
        alert("Introduce a correct tonic note")
    }
    notes = [];
    velocities = [];
    notes[0] = tonic;
    dif = [];
    call = 0;
}

//Function that store the notes played and call scale in order to identify the scale played
function store(message) {
    chord = [];
    //If the tonic is valid
    if ((tonic != undefined) && (tonic != 0)) {
        //Check all the keyboard notes  
        for (m = 0; m < 109; m++) {
            //If a note (m) is pressed...
            if (model[m].isPressed) {
                chord.push(m);
                //We check the notes pressed
                for (i = 0; i < chord.length; i++) {
                    //If a note is smaller than the tonic we sum 12 to it in order to be above the tonic
                    if (chord[i] < tonic) {
                        chord[i] = chord[i] + 12;
                    }
                    //If a note is bigger than the tonic+12 we substract 12 to it in order to it be in the same octave
                    while (chord[i] >= tonic + 12) {
                        chord[i] = chord[i] - 12;
                    }
                    cont = 0;
                    //Check the notes already in the array 'notes'
                    for (t = 0; t < 7; t++) {
                        //If the note played is not already in the array 'notes'...
                        if (chord[i] == notes[t]) {
                            cont = cont + 1;
                        }
                    }
                    //Include the note and sort the array
                    if (cont == 0 && notes.length < 7) {
                        notes.push(chord[i]);
                        notes.sort(compare);
                    }
                }
            }
        }

        //Push the velocity of the pressed note in the 'velocities' array
        if (message.data[2] != 0) {
            velocities.push(message.data[2]);
        }
        //If notes has already 7 notes call the function 'scale'
        if (notes.length == 7) {
            scale(velocities, chord);
        }
        //If no note is played after 3 seconds call the function clear
        if (chord.length == 0) {
            timeOut = setTimeout(clear, 3000);
        }
        //If a note is played clear the 'timeOut'
        if (chord.length > 0) {
            clearTimeout(timeOut);
        }
    }
    //If the tonic is not valid 
    else if ((tonic == undefined || tonic == 0) && (message.data[0] == 144)) {
        alert("Introduce a tonic note please");
    }
}

//Function that selects a scale and a mean velocity (pressure) given two inputs: the velocity of playing and the notes played
function scale(vel, acord) {
    dif = [];
    dif[0] = notes[1] - tonic;
    dif[1] = notes[2] - tonic;
    dif[2] = notes[3] - tonic;
    dif[3] = notes[4] - tonic;
    dif[4] = notes[5] - tonic;
    dif[5] = notes[6] - tonic;

    //If the a note is not included in the current scale we initialize calling to capture()
    for (i = 0; i < acord.length; i++) {
        for (j = 0; j < notes.length; j++) {
            if (mult(acord, notes) == 'false') {
                capture();
            }
        }
    }

    //Mean value of the velocity of the last 5 notes played
    velocity = mean(velocities.slice(velocities.length - 5), velocities.length);

    //Selecting the scale and defining each gradient color
    if (equal(dif, [2, 4, 5, 7, 9, 11]) == 'true' && dif.length != 0) {
        ionian_emotion(velocity);
        //If it is the first time the scale is called, set the gradient
        if (call == 0) {
            gradient([
                [
                    { color: '#A42939', pos: .15 },
                    { color: '#DD4A2B', pos: .35 },
                    { color: '#EF8E40', pos: .65 },
                    { color: '#F5BB44', pos: .85 },
                    { color: '#519DA2', pos: .95 }
                ], [
                    { color: '#FAD427', pos: .2 },
                    { color: '#EDE573', pos: .3 },
                    { color: '#E2F2C8', pos: .5 },
                    { color: '#A0E3B9', pos: .6 },
                    { color: '#67CAA5', pos: .8 }
                ], [
                    { color: '#E9642E', pos: .2 },
                    { color: '#EB7430', pos: .4 },
                    { color: '#EA8D44', pos: .6 },
                    { color: '#F3AC47', pos: .8 },
                    { color: '#FECA48', pos: 1 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [2, 4, 6, 7, 9, 11]) == 'true' && dif.length != 0) {
        lydian_emotion(velocity)
        if (call == 0) {
            gradient([
                [
                    { color: '#FFE544', pos: .4 },
                    { color: '#FFFBAE', pos: .6 },
                    { color: '#006475', pos: .65 },
                    { color: '#BDA45C', pos: .70 },
                    { color: '#FAB928', pos: .9 }
                ], [
                    { color: '#FAD427', pos: .2 },
                    { color: '#EDE573', pos: .3 },
                    { color: '#E2F2C8', pos: .5 },
                    { color: '#A0E3B9', pos: .6 },
                    { color: '#67CAA5', pos: .8 }
                ], [
                    { color: '#85EDDC', pos: .2 },
                    { color: '#F15858', pos: .4 },
                    { color: '#E6B967', pos: .6 },
                    { color: '#EDE16E', pos: .8 },
                    { color: '#FBE4A9', pos: 1 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [2, 4, 5, 7, 9, 10]) == 'true' && dif.length != 0) {
        mixolydian_emotion(velocity)
        if (call == 0) {
            gradient([
                [
                    { color: '#F7CD55', pos: .3 },
                    { color: '#F3AD64', pos: .5 },
                    { color: '#DD6D68', pos: .8 },
                    { color: '#BF4C94', pos: .95 },
                    { color: '#96209E', pos: 1 }
                ], [
                    { color: '#459BAC', pos: .4 },
                    { color: '#E2D5A0', pos: .5 },
                    { color: '#F6C548', pos: .6 },
                    { color: '#E18238', pos: .7 },
                    { color: '#CF3B53', pos: 1 }
                ], [
                    { color: '#991E65', pos: .25 },
                    { color: '#DE334E', pos: .35 },
                    { color: '#EA744E', pos: .45 },
                    { color: '#F1D97B', pos: .60 },
                    { color: '#4E9092', pos: .85 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [2, 3, 5, 7, 9, 10]) == 'true' && dif.length != 0) {
        dorian_emotion(velocity)
        if (call == 0) {
            gradient([
                [
                    { color: '#EC5C57', pos: .25 },
                    { color: '#ED974E', pos: .35 },
                    { color: '#F3D54F', pos: .4 },
                    { color: '#EBE584', pos: .6 },
                    { color: '#E4F5C8', pos: .9 }
                ], [
                    { color: '#87B6B4', pos: .45 },
                    { color: '#B5D3BD', pos: .55 },
                    { color: '#E4F4C9', pos: .65 },
                    { color: '#ECE583', pos: .75 },
                    { color: '#F3D550', pos: .90 }
                ], [
                    { color: '#D6E2BA', pos: .2 },
                    { color: '#C8D9B7', pos: .3 },
                    { color: '#B0CBB3', pos: .45 },
                    { color: '#92BAB1', pos: .70 },
                    { color: '#79B1AE', pos: .95 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [2, 3, 5, 7, 8, 10]) == 'true' && dif.length != 0) {
        aeolian_emotion(velocity)
        if (call == 0) {
            gradient([
                [
                    { color: '#FDFBBF', pos: .20 },
                    { color: '#B8F4B6', pos: .30 },
                    { color: '#79B4AB', pos: .4 },
                    { color: '#627A8B', pos: .7 },
                    { color: '#44284E', pos: .9 }
                ], [
                    { color: '#F0F2D0', pos: .35 },
                    { color: '#B9D4BC', pos: .55 },
                    { color: '#73AAA0', pos: .65 },
                    { color: '#478E8C', pos: .75 },
                    { color: '#5E5162', pos: .90 }
                ], [
                    { color: '#A5A956', pos: .02 },
                    { color: '#E5BA4D', pos: .04 },
                    { color: '#E66540', pos: .06 },
                    { color: '#C8D9B7', pos: .1 },
                    { color: '#439689', pos: .5 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [1, 3, 5, 7, 8, 10]) == 'true' && dif.length != 0) {
        phrygian_emotion(velocity)
        if (call == 0) {
            gradient([
                [
                    { color: '#190412', pos: .55 },
                    { color: '#62100A', pos: .65 },
                    { color: '#951D16', pos: .75 },
                    { color: '#B32E1A', pos: .85 },
                    { color: '#DF4D25', pos: .95 }
                ], [
                    { color: '#131624', pos: .1 },
                    { color: '#2F1B2F', pos: .2 },
                    { color: '#4F1F3A', pos: .4 },
                    { color: '#702547', pos: .6 },
                    { color: '#902C53', pos: .8 }
                ], [
                    { color: '#DF4D25', pos: .05 },
                    { color: '#B32E1A', pos: .10 },
                    { color: '#951D16', pos: .20 },
                    { color: '#62100A', pos: .30 },
                    { color: '#190412', pos: .40 }],], 2000);
            call = 1;
        }
    }
    if (equal(dif, [1, 3, 5, 6, 8, 10]) == 'true' && dif.length != 0) {
        locrian_emotion(velocity);
        if (call == 0) {
            gradient([
                [
                    { color: '#E5E7E2', pos: .40 },
                    { color: '#D8D9D0', pos: .5 },
                    { color: '#BEC3BC', pos: .6 },
                    { color: '#919A9C', pos: .7 },
                    { color: '#667179', pos: .9 }
                ], [
                    { color: '#BCCFDC', pos: .2 },
                    { color: '#A6C1D4', pos: .4 },
                    { color: '#8FB3CD', pos: .6 },
                    { color: '#7DA1BB', pos: .8 },
                    { color: '#7092A8', pos: .95 }
                ], [
                    { color: '#F6F9FE', pos: .35 },
                    { color: '#EDF1F2', pos: .45 },
                    { color: '#DDE8EB', pos: .55 },
                    { color: '#CEDBDE', pos: .60 },
                    { color: '#C1D1D8', pos: .70 }],], 2000);
            call = 1;
        }
    }
}

//SCALE FUNCTIONS
function ionian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Ionian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, ih);
        }

        else if (vel > 50 && vel < 90) {
            console.log("Ionian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, im);
        }

        else if (vel < 50) {
            console.log("Ionian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, il);
        }
    }
}

function lydian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Lydian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, lh);
        }
        else if (vel > 50 && vel < 90) {
            console.log("Lydian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, lm);
        }
        else if (vel < 50) {
            console.log("Lydian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, ll);
        }
    }
}

function mixolydian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Mixolydian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, mf);
        }
        else if (vel > 50 && vel < 90) {
            console.log("Myxolydian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, mm);
        }
        else if (vel < 50) {
            console.log("Mixolydian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, ml);
        }
    }
}

function dorian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Dorian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, dh);
        }
        else if (vel > 50 && vel < 90) {
            console.log("Dorian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, dm);
        }
        else if (vel < 50) {
            console.log("Dorian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, dl);
        }
    }
}

function aeolian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Aeolian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, ah);
        }
        else if (vel > 50 && vel < 90) {
            console.log("Aeolian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, m);
        }
        else if (vel < 50) {
            console.log("Aeolian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, al);
        }
    }
}

function phrygian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Phrygian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, ph);
        }
        else if (vel > 50 && vel < 90) {
            console.log("Phrygian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, pm);
        }
        else if (vel < 50) {
            console.log("Phrygian Slow")
            if (chord.length == 1 || chord.length == 4 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, pl);
        }
    }
}

function locrian_emotion(vel) {
    if (xx == 1) {
        if (vel > 90) {
            console.log("Locrian Fast")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(10, loh);
        }

        else if (vel > 50 && vel < 90) {
            console.log("Locrian Regular")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(5, lom);
        }

        else if (vel < 50) {
            console.log("Locrian Slow")
            if (chord.length == 1 || chord.length == 2 || chord.length == 4) {
                circleArray = [];
            }
            circles(2, lol);
        }
    }
}

//ANIMATION FUNCTIONS

//Function that creates circles
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.trans = trans;


    //Draw circles with updated variables
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = `${this.color}`;
        c.strokeStyle = `rgba(0, 0, 0, 0)`;
        c.globalAlpha = `${this.trans}`;
        c.fill();
        c.stroke();
        c2.beginPath();
        c2.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c2.fillStyle = `${this.color}`;
        c2.strokeStyle = `rgba(0, 0, 0, 0)`;
        c2.globalAlpha = `${this.trans}`;
        c2.fill();
        c2.stroke();
    }
    //Update animation values 
    this.update = function () {
        if (this.x + this.radius > w || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > h || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

//Function that gives the parameters of the circles
function circles(n, colors) {
    for (var i = 0; i < 50; i++) {
        var radius = Math.floor((Math.random() * 20) + 20);
        var x = Math.random() * (w - radius * 2) + radius;
        var y = Math.random() * (h - radius * 2) + radius;
        dx = (Math.random() - 0.5) * n;
        dy = (Math.random() - 0.5) * n;
        trans = Math.random();
        color = colors[Math.floor(Math.random() * colors.length)];
        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

//Function for the circles animation
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, w, h);
    c2.clearRect(0, 0, w, h);
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}
animate();

//Function that represents a color gradient in a given canvas
function gradient(grad, speed) {
    var granimInstance = new Granim({
        element: '#mycanvas2',
        direction: 'left-right',
        opacity: [1, 1],
        isPausedWhenNotInView: true,
        states: {
            "default-state": {
                gradients: grad,
                transitionSpeed: speed
            }
        }
    });
}

//COMPLEMENTARY FUNCTIONS

//Complementary function for 'sort' function
function compare(a, b) {
    return a - b;
}

//Function that tell us if two arrays are equal
function equal(a, b) {
    cont = 0;
    for (i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            cont = cont + 1;
        }
    }
    if (cont === 0) {
        return 'true';
    }
    return 'false'
}

//Function that makes the mean of an array
function mean(vector) {
    total = 0;
    for (i = 0; i < vector.length; i++) {
        total = total + vector[i];
    }
    m = total / vector.length;
    return m;
}

//Function that tell us if the values of two arries are all multiples
function mult(a, b) {
    cont = 0;
    for (i = 0; i < a.length; i++) {
        for (j = 0; j < b.length; j++) {
            if ((a[i] % b[j]) == 0) {
                cont = cont + 1;
            }
        }
    }
    if (cont > 0) {
        return 'true';
    }
    return 'false'
}

//Function that set the animation color to gray
function clear() {
    circleArray = [];
    circles(0.5, ['#808080', '#FFFFFF']);
    gradient([['#FFFFFF', '#808080'],
    ['#808080', '#FFFFFF'],
    ['#FFFFFF', '#808080'],
    ['#808080', '#FFFFFF']], 3000);
    call = 0;
}

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCRcHP4unR5o8dIDFIwSXQeJZc6-2cMZ8E",
    authDomain: "actam-1dcff.firebaseapp.com",
    databaseURL: "https://actam-1dcff.firebaseio.com",
    projectId: "actam-1dcff",
    storageBucket: "actam-1dcff.appspot.com",
    messagingSenderId: "159252628376",
    appId: "1:159252628376:web:3724a8648d4f844fa8a1ed",
    measurementId: "G-EV8846PT7W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

var db = firebase.firestore()

db.collection("ACTAM").doc("COLORS").get().then(
    function (doc) {

        ih = doc.data().ionian_high;
        im = doc.data().ionian_medium;
        il = doc.data().ionian_low;
        lh = doc.data().lydian_high;
        lm = doc.data().lydian_medium;
        ll = doc.data().lydian_low;
        mf = doc.data().myxo_high;
        mm = doc.data().myxo_medium;
        ml = doc.data().myxo_low;
        dh = doc.data().dorian_fast;
        dm = doc.data().dorian_medium;
        dl = doc.data().dorian_low;
        ah = doc.data().aeolian_high;
        am = doc.data().aeolian_medium;
        al = doc.data().aeolian_low;
        ph = doc.data().phrygian_fast;
        pm = doc.data().phrygian_medium;
        pl = doc.data().phrygian_low;
        loh = doc.data().locrian_high;
        lom = doc.data().locrian_medium;
        lol = doc.data().locrian_low;

    });