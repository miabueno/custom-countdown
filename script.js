// DOM Element Render to switch with hidden attributes
const inputRender = document.getElementById('input-container');
const countdownRender = document.getElementById('countdown');
const completeRender = document.getElementById('complete');

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
const populateCountdown = (dateStr, timeStr) => {
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    const futureDateTime = new Date(dateTimeStr);
    const futureDateTimeMsec = futureDateTime.getTime();

    countdownActive = setInterval(() => {
        const { days, hours, minutes, seconds } = calculateRemainingTime(futureDateTimeMsec);

        if (days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
            clearInterval(countdownActive);

            countdownRender.hidden = true;
            completeRender.hidden = false;
            
            // Complete Elements
            const completeBtn = document.getElementById('complete-button');
            completeBtn.addEventListener('click', () => {
                completeRender.hidden = true;
                inputRender.hidden = false;
                localStorage.removeItem('countdown');
            });
        }

        const timeElements = document.getElementsByTagName('span');
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = (hours < 10) ? `0${hours}` :`${hours}`;
        timeElements[2].textContent = (minutes < 10) ? `0${minutes}` :`${minutes}`;
        timeElements[3].textContent = (seconds < 10) ? `0${seconds}` : `${seconds}`;

    }, 1000);
};

// Handle Title + Update DOM
const updateTitle = (titleStr) => {
    document.getElementById('countdown-title').textContent = `${titleStr}`;
};

// Submit Values from Form Input
const setCountdown = (e) => {
    e.preventDefault();
    const countdownTitle = countdownForm.elements['title-input'].value;
    const countdownDate = countdownForm.elements['date-input'].value;
    const countdownTime = countdownForm.elements['time-input'].value;
    
    if (!countdownDate) {
        return alert('Please enter a valid date');
    } else if (!countdownTime) {
        return alert('Please enter a valid time');
    } 
    
    const futureDateTimeStr = `${countdownDate}T${countdownTime}:00`;
    const futureDateTimeMsec = new Date(futureDateTimeStr).getTime();
    const { days, hours, minutes, seconds } = calculateRemainingTime(futureDateTimeMsec);

    if (days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
        alert('Please enter a date time in the future');
    } else {

        const savedCountdown = {
            title: countdownTitle,
            date: countdownDate,
            time: countdownTime,
        };
        localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    
        updateTitle(countdownTitle);
        populateCountdown(countdownDate, countdownTime);

        // Hide Form & Show Countdown Clock
        inputRender.hidden = true;
        countdownRender.hidden = false;
    }
};

const resetCountdown = (e) => {
    e.preventDefault();

    // Show Form & Hide Countdown Clock
    inputRender.hidden = false;
    countdownRender.hidden = true;

    clearInterval(countdownActive);
    localStorage.removeItem('countdown');
};

// Event Listeners
const submitBtn = countdownForm.elements['submit-btn'];
submitBtn.addEventListener('click', setCountdown);

const resetBtn = document.getElementById('countdown-button');
resetBtn.addEventListener('click', resetCountdown);

// Check if countdown saved
if (localStorage.getItem('countdown')) {
    // Show Countdown
    inputRender.hidden = true;
    countdownRender.hidden = false;

    // Get saved data
    const {title, date, time} = JSON.parse(localStorage.getItem('countdown'));
    
    // Pre-populate countdown data
    updateTitle(title);
    populateCountdown(date, time);
}
