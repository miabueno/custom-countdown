const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateElement = document.getElementById('date-picker');

const setAttributes = (element, attributesObj) => {
    for (const key in attributesObj) {
        element.setAttribute(key, attributesObj[key]);
    }
};

// Set Date Input Min with Today's Date
const today = new Date();

const month = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

const dateString = `${today.getFullYear()}-${month}-${date}`

dateElement.setAttribute('min', dateString);

