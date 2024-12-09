import { Notify } from "notiflix/build/notiflix-notify-aio";

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const delay = parseInt(form.elements['delay'].value);
    const step = parseInt(form.elements['step'].value);
    const amount = parseInt(form.elements['amount'].value);

    if (isNaN(delay) || isNaN(step) || isNaN(amount)) {
      Notify.failure('Please fill all fields with valid numbers.');
      return;
    }

    for (let i = 1; i <= amount; i++) {
      const position = i;
      const promiseDelay = delay + (i - 1) * step;

      createPromise(position, promiseDelay)
        .then(({ position, delay }) => {
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });
    }
  });
});

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
