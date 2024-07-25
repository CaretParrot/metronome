setupTree();

let beatCounterElements = document.getElementById("beatCounterTable").children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");
let inputs = document.getElementsByTagName("input");
let drones = document.getElementsByClassName("droneButton");

document.getElementById("savedTempos").innerHTML = localStorage.getItem("temposSaved");
let buttons = document.getElementsByTagName("button");

randomColor.paint(50, 60);
refreshHover();

for (let i = 0; i < audioElements.length; i++) {
    audioElements[i].volume = 0.15;
}

function changeBeatCounter() {
    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.display = "none";
    }

    for (let i = 0; i < document.getElementById("beats").value; i++) {
        beatCounterElements[i].style.display = "flex";
    }
}

function refreshCounter() {
    document.getElementById("accentBeat").pause();
    document.getElementById("accentBeat").currentTime = 0;
    document.getElementById("normalBeat").pause();
    document.getElementById("normalBeat").currentTime = 0;

    if (beatCounter === 0 && document.getElementById("beatCounterTable").style.display === "flex") {
        document.getElementById("accentBeat").play();
    } else {
        document.getElementById("normalBeat").play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
    }

    beatCounterElements[beatCounter].style.backgroundColor = `hsl(${randomColor.randomHue}, 70%, 70%)`;
    beatCounter++;

    if (beatCounter > document.getElementById("beats").value - 1) {
        beatCounter = 0;
    }
}

changeBeatCounter();

onchange = function (event) {
    changeBeatCounter();
    if (document.getElementById("playButton").innerHTML === "Pause") {
        clearInterval(metronome);
        beatCounter = 0;
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
        }
        refreshCounter();
        metronome = setInterval(function () {
            refreshCounter();
        }, 60000 / document.getElementById("tempo").value);
    }
}

function playMetronome() {
    if (document.getElementById("playButton").innerHTML === "Play") {
        refreshCounter();
        document.getElementById("playButton").innerHTML = "Pause";

        metronome = setInterval(function () {
            refreshCounter();
        }, 60000 / document.getElementById("tempo").value);

    } else if (document.getElementById("playButton").innerHTML === "Pause") {
        clearInterval(metronome);
        document.getElementById("playButton").innerHTML = "Play";
        beatCounter = 0;
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
        }

    }
}

function enableAccent() {
    if (document.getElementById("beatCounterTable").style.display === "none") {
        document.getElementById("beatCounterTable").style.display = "flex";
    } else {
        document.getElementById("beatCounterTable").style.display = "none";
    }
}

function playDrone(note) {
    document.getElementById(note).play();
}

function stop() {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
        drones[i].style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
    }
}

function deleteTempos() {
    savedTempos = [];
    document.getElementById("savedTempos").innerHTML = "";
    localStorage.setItem("temposSaved", document.getElementById("savedTempos").innerHTML);
}

function saveTempo() {
    savedTempos.push(document.getElementById("tempo").value);
    document.getElementById("savedTempos").innerHTML += `<button style="background-color: transparent;" onclick="document.getElementById('tempo').value = ${document.getElementById("tempo").value}; document.getElementById('playButton').innerHTML = 'Play'; clearInterval(metronome); beatCounter = 0; playMetronome();">${document.getElementById("tempo").value}</button>`;
    localStorage.setItem("temposSaved", document.getElementById("savedTempos").innerHTML);
    refreshHover();
}

function refreshHover() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onmouseover = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, 70%, 70%)`;
        }

        buttons[i].onmouseout = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onmouseover = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, 70%, 70%)`;
        }

        inputs[i].onmouseout = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, 60%, 60%)`;
        }
    }
}