let beatCounterElements = document.getElementById("beatCounterTable").children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");
let inputs = document.getElementsByTagName("input");
let drones = document.getElementsByClassName("droneButton");
let randomGaps;
let droneNumber = 0;

const backgroundSaturation = 50;

document.getElementById("savedTempos").innerHTML = localStorage.getItem("temposSaved");
let buttons = document.getElementsByTagName("button");

randomColor.paint(backgroundSaturation, backgroundSaturation + 10);

let randomBackgroundColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation}%, ${backgroundSaturation}%)`;
let randomElementColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation + 10}%, ${backgroundSaturation + 10}%)`;

refreshHover();
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

    if (beatCounter === 0 && document.getElementById("beatCounterTable").style.display === "flex") {
        document.getElementById("accentBeat").play();
    } else {
        document.getElementById("normalBeat").play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].style.backgroundColor = randomElementColor;
    }

    beatCounterElements[beatCounter].style.backgroundColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation + 40}%, ${backgroundSaturation + 40}%)`;
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
            for (let i = 0; i < beatCounterElements.length; i++) {
                beatCounterElements[i].style.backgroundColor = randomElementColor;
            }
            refreshCounter();

            metronome = setInterval(function () {
                refreshCounter();
            }, 60000 / document.getElementById("tempo").value);
        }
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
            beatCounterElements[i].style.backgroundColor = randomElementColor;
        }

    }
}

function enableAccent() {
    if (document.getElementById("beatCounterTable").style.display === "none") {
        document.getElementById("beatCounterTable").style.display = "flex";
    } else {
        document.getElementById("beatCounterTable").style.display = "none";
    }
    changeBeatCounter();
}

function playDrone(note) {
    document.getElementById(note).play();
    document.getElementById("stop").style.display = "initial";
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

function refreshHover() {
    randomBackgroundColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation}%, ${backgroundSaturation}%)`;
    randomElementColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation + 10}%, ${backgroundSaturation + 10}%)`;
    randomHoverColor = `hsl(${randomColor.randomHue}, ${backgroundSaturation + 20}%, ${backgroundSaturation + 20}%)`;
}

onkeydown = function (event) {
    if (event.key === " ") {
        randomColor.paint(backgroundSaturation, backgroundSaturation + 10);
        refreshHover();
    }
}

function toggleChallenge() {
    let audioElements = document.getElementsByTagName("audio");
    let randomMultiplier = Math.ceil(Math.random() * 8);
    if (document.getElementById("challengeButton").innerHTML === "Challenge") {
        document.getElementById("flashButton").style.display = "none";
        document.getElementById("challengeButton").innerHTML = "Exit";
        randomGaps = setInterval(function () {
            if (audioElements[0].muted === false) {
                for (let i = 0; i < audioElements.length; i++) {
                    audioElements[i].muted = true;
                }
            } else {
                for (let i = 0; i < audioElements.length; i++) {
                    audioElements[i].muted = false;
                }
            }
            randomMultiplier = Math.ceil(Math.random() * 8);
        }, 60000 / document.getElementById("tempo").value * randomMultiplier);
    } else {
        document.getElementById("challengeButton").innerHTML = "Challenge";
        clearInterval(randomGaps);
        document.getElementById("flashButton").style.display = "flex";
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