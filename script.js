id.setupTree();

let beatCounterElements = id.beatCounterTable.children;
let metronome;
let beatCounter = 0;
let audioElements = document.getElementsByClassName("drone");
let drones = document.getElementsByClassName("droneButton");
let randomGaps;
let droneNumber = 0;
let accent = false;
const min = 60000;

id.savedTempos.innerHTML = localStorage.getItem("temposSaved");

colorPalletes.paint();

changeBeatCounter();

for (let i = 0; i < audioElements.length; i++) {
    audioElements[i].volume = 0.15;
}

for (let i = 0; i < drones.length; i++) {
    drones[i].style.display = "none";
}

drones[droneNumber].style.display = "flex";

function changeBeatCounter() {
    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.display = "none";
    }

    for (let i = 0; i < +id.beats.value; i++) {
        beatCounterElements[i].style.display = "flex";
    }
}

function refreshCounter() {
    id.accentBeat.pause();
    id.accentBeat.currentTime = 0;
    id.normalBeat.pause();
    id.normalBeat.currentTime = 0;

    if (beatCounter === 0 && accent) {
        id.accentBeat.play();
    } else {
        id.normalBeat.play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].id = "";
    }

    beatCounterElements[beatCounter].id = "activeBeat";

    beatCounter++;

    if (beatCounter > +id.beats.value - 1) {
        beatCounter = 0;
    }
}

oninput = function (event) {
    if (id.beats.value !== "" && id.tempo.value !== "") {
        changeBeatCounter();
        if (id.playButton.innerHTML === "⏸") {
            clearInterval(metronome);
            beatCounter = 0;
            refreshCounter();
            metronome = setInterval(function () { refreshCounter(); }, min / id.tempo.value);
        }
    }
}

function playMetronome() {
    if (id.playButton.innerHTML === "⏵") {
        refreshCounter();
        id.playButton.innerHTML = "⏸";
        metronome = setInterval(function () { refreshCounter(); }, min / id.tempo.value);
    } else if (id.playButton.innerHTML === "⏸") {
        clearInterval(metronome);
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].id = "";
        }
        id.playButton.innerHTML = "⏵";
        beatCounter = 0;
    }
}

function playDrone(note) {
    document.getElementById(note).play();
    id.stop.style.display = "flex";
    clearInterval(randomGaps);
}

function stop() {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
    }
    id.stop.style.display = "none";
}

function deleteTempos() {
    id.savedTempos.innerHTML = "";
    localStorage.setItem("temposSaved", id.savedTempos.innerHTML);
}

function saveTempo() {
    let newButton = document.createElement("button");
    newButton.onclick = function () {
        document.getElementById('tempo').value = id.tempo.value;
        document.getElementById('playButton').innerHTML = '⏵';
        clearInterval(metronome);
        beatCounter = 0;
        playMetronome();
    }
    newButton.innerHTML = id.tempo.value;
    id.savedTempos.appendChild(newButton);
    localStorage.setItem("temposSaved", id.savedTempos.innerHTML);
}

onkeydown = function (event) {
    if (event.key === " ") {
        colorPalletes.paint();
    }
}

function toggleChallenge() {
    let droneSounds = document.getElementsByTagName("audio");
    let randomMultiplier = Math.ceil(Math.random() * id.beats.value * 2);
    if (id.challengeButton.innerHTML === "!") {
        id.challengeButton.innerHTML = "Exit";
        randomGaps = setInterval(function () {
            if (dronSounds[0].muted === false && dronSounds[1].muted === false) {
                for (let i = 0; i < 2; i++) {
                    dronSounds[i].muted = true;
                }
            } else {
                for (let i = 0; i < 2; i++) {
                    dronSounds[i].muted = false;
                }
            }
            randomMultiplier = Math.ceil(Math.random() * id.beats.value * 2);
        }, min / id.tempo.value * randomMultiplier);
    } else {
        id.challengeButton.innerHTML = "!";
        for (let i = 0; i < 2; i++) {
            dronSounds[i].muted = false;
        }
        clearInterval(randomGaps);
    }

}

function scrollDrones(right) {
    for (let i = 0; i < drones.length; i++) {
        drones[i].style.display = "none";
    }

    if (right) {
        droneNumber++;
        if (droneNumber > drones.length - 1) {
            droneNumber = 0;
        }

        
    } else {
        droneNumber--;
        if (droneNumber < 0) {
            droneNumber = 11;
        }
    }

    drones[droneNumber].style.display = "flex";
}

function toggleAccent() {
    accent = !accent;
    if (accent) {
        id.enableAccent.innerHTML = `Off`;
    } else {
        id.enableAccent.innerHTML = `>`;
    }
}