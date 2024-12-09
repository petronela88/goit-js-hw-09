const startButton = document.querySelector("button[data-start]");
const stopButton = document.querySelector("button[data-stop]");
let timerId = null;

startButton.disabled = false;
stopButton.disabled = true;
startButton.addEventListener("click", () => {
    toggleButtons();
    colorSwitcher();

    timerId = setInterval(() => {
        colorSwitcher();
    }, 1000);
});

stopButton.addEventListener("click", () => {
    toggleButtons();
    clearInterval(timerId);
});

function colorSwitcher() {
    const bgColor = getRandomHexColor();
    document.body.style.backgroundColor = bgColor;
}

function toggleButtons() {
    startButton.disabled = !startButton.disabled;
    stopButton.disabled = !stopButton.disabled;
}

function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
}
