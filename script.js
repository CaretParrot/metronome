let beatCounterElements = document.getElementById("beatCounterTable").children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");
let inputs = document.getElementsByTagName("input");
let drones = document.getElementsByClassName("droneButton");
let randomGaps;
let droneNumber = 0;
let accent = false;

document.getElementById("savedTempos").innerHTML = localStorage.getItem("temposSaved");
let buttons = document.getElementsByTagName("button");

colorPalletes.paint();

changeBeatCounter();

document.getElementById("stop").style.display = "none";

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

    for (let i = 0; i < +document.getElementById("beats").value; i++) {
        beatCounterElements[i].style.display = "flex";
    }
}

function refreshCounter() {
    document.getElementById("accentBeat").pause();
    document.getElementById("accentBeat").currentTime = 0;
    document.getElementById("normalBeat").pause();
    document.getElementById("normalBeat").currentTime = 0;

    if (beatCounter === 0 && accent) {
        document.getElementById("accentBeat").play();
    } else {
        document.getElementById("normalBeat").play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].id = "";
    }

    beatCounterElements[beatCounter].id = "activeBeat";
    document.getElementById("activeBeat").backgroundColor = `hsl(${colorPalletes.savedColor}, 45%, 90%)`;

    beatCounter++;

    if (beatCounter > document.getElementById("beats").value - 1) {
        beatCounter = 0;
    }
}

oninput = function (event) {
    if (document.getElementById("beats").value !== "" && document.getElementById("tempo").value !== "") {
        changeBeatCounter();
        if (document.getElementById("playButton").innerHTML === "Pause") {
            clearInterval(metronome);
            beatCounter = 0;
            refreshCounter();

            metronome = setInterval(function () {refreshCounter();}, 60000 / document.getElementById("tempo").value);
        }
    }
}

function playMetronome() {
    if (document.getElementById("playButton").innerHTML === "Play") {
        refreshCounter();
        document.getElementById("playButton").innerHTML = "Pause";
        metronome = setInterval(function () { refreshCounter(); }, 60000 / document.getElementById("tempo").value);
    } else if (document.getElementById("playButton").innerHTML === "Pause") {
        clearInterval(metronome);
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].id = "";
        }
        document.getElementById("playButton").innerHTML = "Play";
        beatCounter = 0;
    }
}

function playDrone(note) {
    document.getElementById(note).play();
    document.getElementById("stop").style.display = "flex";
    document.getElementById("challengeButton").innerHTML = "Challenge";
    clearInterval(randomGaps);
}

function stop() {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
        drones[i].style.backgroundColor = randomElementColor;
    }
    document.getElementById("stop").style.display = "none";
}

function deleteTempos() {
    savedTempos = [];
    document.getElementById("savedTempos").innerHTML = "";
    localStorage.setItem("temposSaved", document.getElementById("savedTempos").innerHTML);
}

function saveTempo() {
    savedTempos.push(document.getElementById("tempo").value);
    document.getElementById("savedTempos").innerHTML += `<button style="background-color: ${randomElementColor};" onclick="document.getElementById('tempo').value = ${document.getElementById("tempo").value}; document.getElementById('playButton').innerHTML = 'Play'; clearInterval(metronome); beatCounter = 0; playMetronome();">${document.getElementById("tempo").value}</button>`;
    localStorage.setItem("temposSaved", document.getElementById("savedTempos").innerHTML);
    refreshHover();
}

onkeydown = function (event) {
    if (event.key === " ") {
        randomColor.paint(backgroundSaturation, backgroundSaturation + 10);
        refreshHover();
    }
}

function toggleChallenge() {
    let audioElements = document.getElementsByTagName("audio");
    let randomMultiplier = Math.ceil(Math.random() * document.getElementById("beats").value * 2);
    if (document.getElementById("challengeButton").innerHTML === "Challenge") {
        document.getElementById("challengeButton").innerHTML = "Exit";
        randomGaps = setInterval(function () {
            if (audioElements[0].muted === false && audioElements[1].muted === false) {
                for (let i = 0; i < 2; i++) {
                    audioElements[i].muted = true;
                }
            } else {
                for (let i = 0; i < 2; i++) {
                    audioElements[i].muted = false;
                }
            }
            randomMultiplier = Math.ceil(Math.random() * document.getElementById("beats").value * 2);
        }, 60000 / document.getElementById("tempo").value * randomMultiplier);
    } else {
        document.getElementById("challengeButton").innerHTML = "Challenge";
        for (let i = 0; i < 2; i++) {
            audioElements[i].muted = false;
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

        drones[droneNumber].style.display = "flex";
    } else {
        droneNumber--;
        if (droneNumber < 0) {
            droneNumber = 11;
        }

        drones[droneNumber].style.display = "flex";
    }
}

function toggleAccent() {
    accent = !accent;
    if (accent) {
        document.getElementById(`enableAccent`).innerHTML = `Off`;
    } else {
        document.getElementById(`enableAccent`).innerHTML = `>`;
    }

}