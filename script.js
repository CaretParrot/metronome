setupTree();

let beatCounterElements = document.getElementById("beatCounterTable").children;
let metronome;
let beatCounter = 0;
let savedTempos = [];
let audioElements = document.getElementsByClassName("drone");
let inputs = document.getElementsByTagName("input");
let drones = document.getElementsByClassName("droneButton");
const backgroundSaturation = 50;
const elementSaturation = backgroundSaturation + 10;
const hoverSaturation = elementSaturation + 10;

document.getElementById("savedTempos").innerHTML = localStorage.getItem("temposSaved");
let buttons = document.getElementsByTagName("button");

randomColor.paint(backgroundSaturation, elementSaturation);
refreshHover();
changeBeatCounter();

document.getElementById("stop").style.display = "none";

for (let i = 0; i < audioElements.length; i++) {
    audioElements[i].volume = 0.15;
}

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
        beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
    }

    beatCounterElements[beatCounter].style.backgroundColor = `hsl(${randomColor.randomHue}, ${hoverSaturation}%, ${hoverSaturation}%)`;
    beatCounter++;

    if (beatCounter > document.getElementById("beats").value - 1) {
        beatCounter = 0;
    }
}

onchange = function (event) {
    changeBeatCounter();
    if (document.getElementById("playButton").innerHTML === "Pause") {
        clearInterval(metronome);
        beatCounter = 0;
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
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
            beatCounterElements[i].style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
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
}

function stop() {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
        drones[i].style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
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
    document.getElementById("savedTempos").innerHTML += `<button style="background-color: hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%);" onclick="document.getElementById('tempo').value = ${document.getElementById("tempo").value}; document.getElementById('playButton').innerHTML = 'Play'; clearInterval(metronome); beatCounter = 0; playMetronome();">${document.getElementById("tempo").value}</button>`;
    localStorage.setItem("temposSaved", document.getElementById("savedTempos").innerHTML);
    refreshHover();
}

function refreshHover() {
    buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onmouseover = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, ${hoverSaturation}%, ${hoverSaturation}%)`;
        }

        buttons[i].onmouseout = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onmouseover = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, ${hoverSaturation}%, ${hoverSaturation}%)`;
        }

        inputs[i].onmouseout = function (event) {
            this.style.backgroundColor = `hsl(${randomColor.randomHue}, ${elementSaturation}%, ${elementSaturation}%)`;
        }
    }
}

function toggleFlash() {
    let droneTables = document.getElementsByClassName("droneTable");
    for (let i = 0; i < droneTables.length; i++) {
        droneTables[i].style.display = "none";
    }
    document.getElementById("toolbar").style.display = "none";
    document.getElementById("flash").style.display = "flex";
}