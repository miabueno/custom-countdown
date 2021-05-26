// DOM Element Containers to switch with hidden attributes
const inputContainer = document.getElementById('input-container');
const countdownContainer = document.getElementById('countdown');

// Form Element
const countdownForm = document.forms['countdown-form'];

// Time Interval Status
let countdownActive;

// given Date object, returns str format YYYY-MM-DD
const convertDateToStr = (dateObj) => {
    const month = (dateObj.getMonth() + 1) < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    const date = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
    const dateString = `${dateObj.getFullYear()}-${month}-${date}`;
    return dateString;
};

// Set Date Input minimum with Today's Date
const today = new Date();
const todayDateStr = convertDateToStr(today);
const dateElement = document.getElementById('date-picker');
dateElement.setAttribute('min', todayDateStr);

// Helper - Calculate Time Remaining for Countdown
const calculateRemainingTime = (futureDateMsec) => {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const nowMsec = new Date().getTime();
    const timeDiff = futureDateMsec - nowMsec;

    const daysLeft = Math.floor(timeDiff / DAY);
    const hrsLeft = Math.floor((timeDiff % DAY) / HOUR);
    const minLeft = Math.floor((timeDiff % HOUR) / MINUTE);
    const secLeft = Math.floor((timeDiff % MINUTE) / SECOND);

    return {
        days: daysLeft,
        hours: hrsLeft,
        minutes: minLeft,
        seconds: secLeft,
    };
};

// Handle Countdown Values + Update DOM
const populateCountdown = (dateStr) => {
    const futureDate = new Date(dateStr);
    const futureDateMsec = futureDate.getTime();

    countdownActive = setInterval(() => {
        const { days, hours, minutes, seconds } = calculateRemainingTime(futureDateMsec);

        const timeElements = document.getElementsByTagName('span');
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;

        console.log(days, hours, minutes, seconds);
    }, 1000);
};

// Handle Title + Update DOM
const updateTitle = (titleStr) => {
    document.getElementById('countdown-title').textContent = `Time Until ${titleStr}`;
};

// Submit Values from Form Input
const setCountdown = (e) => {
    e.preventDefault();
    const countdownTitle = countdownForm.elements['title-input'].value;
    const countdownDate = countdownForm.elements['date-input'].value;
    
    updateTitle(countdownTitle);
    populateCountdown(countdownDate);
    
    // Hide Form & Show Countdown Clock
    inputContainer.hidden = true;
    countdownContainer.hidden = false;
};

const resetCountdown = (e) => {
    e.preventDefault();

    // Show Form & Hide Countdown Clock
    inputContainer.hidden = false;
    countdownContainer.hidden = true;

    clearInterval(countdownActive);
};

// Event Listeners
const submitBtn = countdownForm.elements['submit-btn'];
submitBtn.addEventListener('click', setCountdown);

const resetBtn = document.getElementById('countdown-button');
resetBtn.addEventListener('click', resetCountdown);
