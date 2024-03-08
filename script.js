setupTree();

let beatCounterElements = idTree.beatCounterTable.children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");
let buttons = document.getElementsByTagName("button");
let inputs = document.getElementsByTagName("input");
let drones = document.getElementsByClassName("drone");

idTree.savedTempos.innerHTML = localStorage.getItem("temposSaved");

randomColor.paint(50, 60);
refreshHover();

for (let i = 0; i < audioElements.length; i++) {
    audioElements[i].volume = 0.15;
}

function changeBeatCounter() {
    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.display = "none";
    }

    for (let i = 0; i < idTree.beats.value; i++) {
        beatCounterElements[i].style.display = "flex";
    }
}

function refreshCounter() {
    idTree.accentBeat.pause();
    idTree.accentBeat.currentTime = 0;
    idTree.normalBeat.pause();
    idTree.normalBeat.currentTime = 0;

    if (beatCounter === 0 && idTree.beatCounterTable.style.display === "flex") {
        idTree.accentBeat.play();
    } else {
        idTree.normalBeat.play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.backgroundColor = randomColor.pickedColor[60];
    }

    beatCounterElements[beatCounter].style.backgroundColor = randomColor.pickedColor[70];
    beatCounter++;

    if (beatCounter > idTree.beats.value - 1) {
        beatCounter = 0;
    }
}

changeBeatCounter();

onchange = function (event) {
    changeBeatCounter();
    if (idTree.playButton.innerHTML === "Pause") {
        clearInterval(metronome);
        beatCounter = 0;
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].style.backgroundColor = randomColor.pickedColor[60];
        }
        refreshCounter();
        metronome = setInterval(function () {
            refreshCounter();
        }, 60000 / idTree.tempo.value);
    }
}

function playMetronome() {
    if (idTree.playButton.innerHTML === "Play") {
        refreshCounter();
        idTree.playButton.innerHTML = "Pause";

        metronome = setInterval(function () {
            refreshCounter();
        }, 60000 / idTree.tempo.value);

    } else if (idTree.playButton.innerHTML === "Pause") {
        clearInterval(metronome);
        idTree.playButton.innerHTML = "Play";
        beatCounter = 0;
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].style.backgroundColor = randomColor.pickedColor[60];
        }

    }
}

function enableAccent() {
    if (idTree.beatCounterTable.style.display === "none") {
        idTree.beatCounterTable.style.display = "flex";
    } else {
        idTree.beatCounterTable.style.display = "none";
    }
}

function playDrone(note) {
    idTree[note].play();
}

function stop() {
    for (let i = 0; i < drones.length; i++) {
        drones[i].pause();
        drones[i].currentTime = 0;
    }
}

function deleteTempos() {
    savedTempos = [];
    idTree.savedTempos.innerHTML = "";
    localStorage.setItem("temposSaved", idTree.savedTempos.innerHTML);
}

function saveTempo() {
    savedTempos.push(idTree.tempo.value);
    idTree.savedTempos.innerHTML += `<button style="background-color: transparent;" onclick="document.getElementById('tempo').value = ${id("tempo").value}; document.getElementById('playButton').innerHTML = 'Play'; clearInterval(metronome); beatCounter = 0; playMetronome();">${id("tempo").value}</button>`;
    localStorage.setItem("temposSaved", idTree.savedTempos.innerHTML);
    refreshHover();
}

function refreshHover() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onmouseover = function (event) {
            this.style.backgroundColor = randomColor.pickedColor[70];
        }

        buttons[i].onmouseout = function (event) {
            this.style.backgroundColor = randomColor.pickedColor[60];
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onmouseover = function (event) {
            this.style.backgroundColor = randomColor.pickedColor[70];
        }

        inputs[i].onmouseout = function (event) {
            this.style.backgroundColor = randomColor.pickedColor[60];
        }
    }

    for (let i = 0; i < drones.length; i++) {
        drones[i].onclick = function (event) {
            this.style.backgroundColor = randomColor.pickedColor[70];
        }
    }
}