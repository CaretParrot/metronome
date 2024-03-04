setupTree();

let beatCounterElements = idTree.beatCounterTable.children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");

idTree.savedTempos.innerHTML = localStorage.getItem("temposSaved");

randomColor.paint();

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
        beatCounterElements[i].style.backgroundColor = "hsl(from color h s l);";
    }

    beatCounterElements[beatCounter].style.backgroundColor = "hsl(from color h (s * 1.1) (l * 1.1));";
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
            beatCounterElements[i].style.backgroundColor = "hsl(from color h s l)";
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
            beatCounterElements[i].style.backgroundColor = "hsl(from color h s l)";
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
    let drones = document.getElementsByClassName("drone");
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
}

onmouseover = function (event) {
    this.style.backgroundColor = pickedColor[2];
}