// public/time.js

function updateTime() {
    const dateElement = document.querySelector('.date');
    const timeElement = document.querySelector('.time');
    const dayElement = document.querySelector('.day');
  
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    const day = now.toLocaleDateString(undefined, { weekday: 'long' });
  
    dateElement.textContent = date;
    timeElement.textContent = time;
    dayElement.textContent = day;
  }
  
  setInterval(updateTime, 1000);
  