const min = 60000;
const playIcon = `<span class="material-symbols-outlined">play_arrow</span>`;
const stopIcon = `<span class="material-symbols-outlined">stop</span>`;
const swordsIcon = `<span class="material-symbols-outlined">swords</span>`;
const cancelIcon = `<span class="material-symbols-outlined">cancel</span>`;
const audio = new AudioContext();
const gainNode = audio.createGain();
const osc = audio.createOscillator();

let beatCounter = 0;

let beatCounterElements = /** @type {HTMLParagraphElement}*/ (document.getElementById("beatCounterTable")).children;
let audioElements = /** @type {HTMLCollectionOf<HTMLAudioElement>}*/ (document.getElementsByClassName("drone"));
let beatsInput = /** @type {HTMLInputElement} */ (document.getElementById("beats"));
let tempoInput = /** @type {HTMLInputElement} */ (document.getElementById("tempo"));
let drones = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("droneButton"));
let savedTempos = /** @type {HTMLElement} */ (document.getElementById("savedTempos"));
let normalBeat = /** @type {HTMLAudioElement} */ (document.getElementById("normal"));
let accentBeat = /** @type {HTMLAudioElement} */ (document.getElementById("accent"));
let playButton = /** @type {HTMLButtonElement} */ (document.getElementById("play"));
let stopButton = /** @type {HTMLButtonElement} */ (document.getElementById("stop"));
let challengeButton = /** @type {HTMLButtonElement} */ (document.getElementById("challenge"));
let enableAccentButton = /** @type {HTMLButtonElement} */ (document.getElementById("enableAccent"));

/**
 * @type {setInterval | number}
 */
let randomGaps;
/**
 * @type {setInterval | number}
 */
let metronome;
let droneNumber = 0;
let accent = false;
let oscillatorOn = false;

window.onload = async function () {
    osc.start();
    savedTempos.innerHTML = localStorage.getItem("temposSaved") || "";
    changeBeatCounter();

    let wakeLock = null;

    try {
        wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
        console.log(err);
    }

    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].volume = 0.15;
    }

    for (let i = 0; i < drones.length; i++) {
        drones[i].style.display = "none";
    }

    drones[droneNumber].style.display = "flex";

    onclick = function (event) {
        audio.resume();
    }
}

function changeBeatCounter() {
    for (let i = 0; i < beatCounterElements.length; i++) {
        /** @type {HTMLParagraphElement} */ (beatCounterElements[i]).style.display = "none";
    }

    for (let i = 0; i < +beatsInput.value; i++) {
        /** @type {HTMLParagraphElement} */ (beatCounterElements[i]).style.display = "flex";
    }
}

function refreshCounter() {
    accentBeat.pause();
    accentBeat.currentTime = 0;
    normalBeat.pause();
    normalBeat.currentTime = 0;

    if (beatCounter === 0 && accent) {
        accentBeat.play();
    } else {
        normalBeat.play();
    }

    for (let i = 0; i < beatCounterElements.length; i++) {
        beatCounterElements[i].id = "";
    }

    beatCounterElements[beatCounter].id = "activeBeat";

    beatCounter++;

    if (beatCounter > +beatsInput.value - 1) {
        beatCounter = 0;
    }
}

oninput = function (event) {
    if (beatsInput.value !== "" && tempoInput.value !== "") {
        changeBeatCounter();
        if (playButton.innerHTML === stopIcon) {
            clearInterval( /** @type {number} */ (metronome));
            beatCounter = 0;
            refreshCounter();
            metronome = setInterval(function () { refreshCounter(); }, min / +tempoInput.value);
        }
    }
}

function playMetronome() {
    if (playButton.innerHTML === playIcon && beatsInput.value !== "" && tempoInput.value !== "") {
        refreshCounter();
        playButton.innerHTML = stopIcon;
        metronome = setInterval(function () { refreshCounter(); }, min / +tempoInput.value);
    } else if (playButton.innerHTML === stopIcon) {
        clearInterval( /** @type {number} */ (metronome));
        for (let i = 0; i < beatCounterElements.length; i++) {
            beatCounterElements[i].id = "";
        }
        playButton.innerHTML = playIcon;
        beatCounter = 0;
    }
}

/**
 * @param {string} note 
 */
function playDrone(note) {
    let noteElement = /** @type {HTMLAudioElement} */ (document.getElementById(note));
    noteElement.play();
    stopButton.style.display = "flex";
    clearInterval( /** @type {number} */ (randomGaps));
}

function stop() {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
    }
    osc.disconnect();
    stopButton.style.display = "none";
}

function deleteTempos() {
    savedTempos.innerHTML = "";
    localStorage.setItem("temposSaved", savedTempos.innerHTML);
}

function saveTempo() {
    let newButton = document.createElement("button");
    newButton.onclick = function () {
        tempoInput.value = newButton.innerHTML;
        playButton.innerHTML = playIcon;
        clearInterval(/** @type {number} */(metronome));
        beatCounter = 0;
        playMetronome();
    }
    newButton.innerHTML = tempoInput.value;
    savedTempos.appendChild(newButton);
    localStorage.setItem("temposSaved", savedTempos.innerHTML);
}

function toggleChallenge() {
    let droneSounds = document.getElementsByTagName("audio");
    let randomMultiplier = Math.ceil(Math.random() * +beatsInput.value * 2);
    if (challengeButton.innerHTML === swordsIcon) {
        challengeButton.innerHTML = cancelIcon;
        randomGaps = setInterval(function () {
            if (droneSounds[0].muted === false && droneSounds[1].muted === false) {
                for (let i = 0; i < 2; i++) {
                    droneSounds[i].muted = true;
                }
            } else {
                for (let i = 0; i < 2; i++) {
                    droneSounds[i].muted = false;
                }
            }
            randomMultiplier = Math.ceil(Math.random() * +beatsInput.value * 2);
        }, min / +tempoInput.value * randomMultiplier);
    } else {
        challengeButton.innerHTML = swordsIcon;
        clearInterval(/** @type {number} */(randomGaps));
        for (let i = 0; i < 2; i++) {
            droneSounds[i].muted = false;
        }
    }
}

/**
 * 
 * @param {boolean} right 
 */
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
        enableAccentButton.innerHTML = cancelIcon;
    } else {
        enableAccentButton.innerHTML = `>`;
    }
}

/**
 * @param {number} frequency 
 */
function tuner(frequency) {
    osc.connect(gainNode);
    stopButton.style.display = "flex";

    osc.frequency.value = frequency;
    gainNode.gain.value = 0.1;
    gainNode.connect(audio.destination);
}