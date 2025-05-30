const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of solving problems with code.",
    "Practice makes perfect when learning to type faster.",
    "Technology connects people from all around the world.",
    "Learning new skills opens doors to opportunities."
];

let currentText = '';
let startTime = null;
let timerInterval = null;
let isStarted = false;

const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timerElement = document.getElementById('timer');
const progressElement = document.getElementById('progress');
const resultsElement = document.getElementById('results');
const newTestBtn = document.getElementById('newTest');
const resetBtn = document.getElementById('resetTest');

function initTest() {
    currentText = sentences[Math.floor(Math.random() * sentences.length)];
    displayText();
    resetStats();
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    isStarted = false;
    resultsElement.classList.remove('show');
}

function displayText() {
    textDisplay.innerHTML = currentText
        .split('')
        .map((char, i) => `<span id="char-${i}">${char}</span>`)
        .join('');
}

function resetStats() {
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    timerElement.textContent = '0';
    progressElement.textContent = '0%';

    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function startTest() {
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerElement.textContent = elapsed;
        }, 1000);
    }
}

function updateDisplay(typed) {
    for (let i = 0; i < currentText.length; i++) {
        const charElement = document.getElementById(`char-${i}`);
        charElement.className = '';
        if (i < typed.length) {
            charElement.classList.add(
                typed[i] === currentText[i] ? 'correct' : 'incorrect'
            );
        } else if (i === typed.length) {
            charElement.classList.add('current');
        }
    }
}

function updateStats(typed) {
    const elapsed = (Date.now() - startTime) / 60000; // in minutes
    const words = typed.trim().split(/\s+/).length;
    const wpm = Math.round(words / elapsed) || 0;

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentText[i]) correct++;
    }

    const accuracy = typed.length > 0
        ? Math.round((correct / typed.length) * 100)
        : 100;

    const progress = Math.min(
        Math.round((typed.length / currentText.length) * 100),
        100
    );

    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy + '%';
    progressElement.textContent = progress + '%';
}

function completeTest() {
    clearInterval(timerInterval);
    textInput.disabled = true;
    resultsElement.classList.add('show');

    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    const finalTyped = textInput.value;
    const finalChars = finalTyped.length;
    const words = finalTyped.trim().split(/\s+/).length;
    const finalWPM = Math.round(words / (finalTime / 60)) || 0;

    let correct = 0;
    for (let i = 0; i < finalTyped.length; i++) {
        if (finalTyped[i] === currentText[i]) correct++;
    }

    const finalAccuracy = finalTyped.length > 0
        ? Math.round((correct / finalTyped.length) * 100)
        : 100;

    document.getElementById('finalWPM').textContent = finalWPM;
    document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
    document.getElementById('finalTime').textContent = finalTime + 's';
    document.getElementById('finalChars').textContent = finalChars;
}

// Event Listeners
textInput.addEventListener('input', () => {
    const typed = textInput.value;
    startTest();
    updateDisplay(typed);
    updateStats(typed);

    if (typed === currentText) {
        completeTest();
    }
});

newTestBtn.addEventListener('click', initTest);
resetBtn.addEventListener('click', () => {
    textInput.value = '';
    updateDisplay('');
    resetStats();
    textInput.disabled = false;
    isStarted = false;
    resultsElement.classList.remove('show');
    textInput.focus();
});

// Initialize on page load
window.onload = initTest;