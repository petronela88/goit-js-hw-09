
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { Notify } from "notiflix/build/notiflix-notify-aio";

Notify.init({
    fontSize: "1rem",
    width: "500px",
    cssAnimationStyle: "from-bottom",
});

const startButton = document.querySelector("button[data-start]");
const resetButton = document.querySelector("button[data-reset]");
startButton.disabled = true;
resetButton.disabled = true;

const countdown = {
    endDate: null,
    intervalId: null,
    selectedDate: null,
};

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates.length > 0) {
            countdown.selectedDate = selectedDates[0];

            if (countdown.selectedDate > new Date()) {
                startButton.disabled = false;
                resetButton.disabled = false;

                const formattedDate = new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                }).format(countdown.selectedDate);

                Notify.info(`Selected Date: ${formattedDate}`);
            } else {
                startButton.disabled = true;
                resetButton.disabled = true;
                Notify.failure("Please choose a date in the future");
            }
        }
    }
};

flatpickr("#datetime-picker", options);

document.querySelector("#datetime-picker").value = "Enter a future date to begin the countdown";

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function updateCountdown() {
    if (!countdown.endDate) {
        clearInterval(countdown.intervalId);
        return;
    }

    const currentDate = new Date().getTime();
    const timeDifference = countdown.endDate - currentDate;

    if (timeDifference <= 0) {
        clearInterval(countdown.intervalId);
        startButton.disabled = true;
        resetButton.disabled = true;

        Notify.success("Timer has ended!");

        countdown.endDate = null;

        return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    document.querySelector("[data-days]").textContent = addLeadingZero(days);
    document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
    document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
    document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}

function startTimer() {
    countdown.endDate = countdown.selectedDate.getTime();
    countdown.intervalId = setInterval(updateCountdown, 1000);

    startButton.disabled = true;
    resetButton.disabled = false;
}

function resetTimer() {
    clearInterval(countdown.intervalId);
    startButton.disabled = true;
    resetButton.disabled = true;

    document.querySelector("#datetime-picker").value = "Enter a future date to begin the countdown";

    document.querySelector("[data-days]").textContent = "00";
    document.querySelector("[data-hours]").textContent = "00";
    document.querySelector("[data-minutes]").textContent = "00";
    document.querySelector("[data-seconds]").textContent = "00";

    countdown.endDate = null;
}

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);