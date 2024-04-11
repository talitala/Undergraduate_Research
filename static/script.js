// Initialize variables
let elapsedSeconds = 0;
let playButtonClicked = false;
let hungerClicks = 0;
let thirstClicks = 0;
let socialClicks = 0;
let lastHungerClickTime = 0;
let lastThirstClickTime = 0;
let lastSocialClickTime = 0;

// Update progress bars and check game over condition
function updateBars(data) {
    updateBar("hunger-fill", "hunger-level", data.hunger);
    updateBar("thirst-fill", "thirst-level", data.thirst);
    updateBar("social-fill", "social-level", data.social);

    // Check if any bar reaches 0%
    if (data.hunger === 0 || data.thirst === 0 || data.social === 0) {
        stopGame();
    }
}


// Update individual progress bar and its corresponding level indicator
function updateBar(fillId, levelId, value) {
    const fill = document.getElementById(fillId);
    const level = document.getElementById(levelId);

    const newValue = Math.max(0, Math.min(value, 100));

    fill.style.width = newValue + "%";
    level.textContent = newValue + "%";

    // Change color based on threshold
    updateColorClass(fill, newValue);
}

// Update color class based on threshold
function updateColorClass(fill, value) {
    fill.classList.remove('low');
    fill.classList.remove('normal');
    fill.classList.remove('high');

    if (value <= 30) {
        fill.classList.add('low');
    } else if (value <= 70) {
        fill.classList.add('normal');
    } else {
        fill.classList.add('high');
    }
}

// Start game intervals (timers)
function startIntervals() {
    playButtonClicked = true;

    // Elapsed seconds timer
    setInterval(() => {
        if (playButtonClicked) {
            elapsedSeconds++;
            updateStopwatch();
            checkGameOver();
        }
    }, 1000);

    // Decrease hunger every 6 seconds
    setInterval(() => {
        if (playButtonClicked) {
            performAction('decreaseHunger', 100);
            checkGameOver();
        }
    }, 6000);

    // Decrease thirst every 4 seconds
    setInterval(() => {
        if (playButtonClicked) {
            performAction('decreaseThirst', 100);
            checkGameOver();
        }
    }, 4000);

    // Decrease social every 8 seconds
    setInterval(() => {
        if (playButtonClicked) {
            performAction('decreaseSocial', 100);
            checkGameOver();
        }
    }, 8000);
}

// Update the stopwatch display
function updateStopwatch() {
    const stopwatch = document.getElementById('elapsed-timer');
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const formattedHours = formatTime(hours);
    const formattedMinutes = formatTime(minutes);
    const formattedSeconds = formatTime(seconds);

    stopwatch.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Format time to ensure two-digit display
function formatTime(value) {
    return value < 10 ? `0${value}` : value;
}

function runSim() {
    setInterval(() => {
        const randomAction = Math.floor(Math.random() * 3); // Generate random number from 0 to 2
        switch (randomAction) {
            case 0:
                performAction('increaseHunger', 20);
                hungerClicks++; // Increment hunger clicks
                calculateClickRate('Hunger', lastHungerClickTime);
                lastHungerClickTime = Date.now();
                document.getElementById('hunger-counter').textContent = hungerClicks; // Update displayed counter
                break;
            case 1:
                performAction('increaseThirst', 20);
                thirstClicks++; // Increment thirst clicks
                calculateClickRate('Thirst', lastThirstClickTime);
                lastThirstClickTime = Date.now();
                document.getElementById('thirst-counter').textContent = thirstClicks; // Update displayed counter
                break;
            case 2:
                performAction('increaseSocial', 20);
                socialClicks++; // Increment social clicks
                calculateClickRate('Social', lastSocialClickTime);
                lastSocialClickTime = Date.now();
                document.getElementById('social-counter').textContent = socialClicks; // Update displayed counter
                break;
            default:
                break;
        }
    }, 5000); // Run simulation every 5 seconds
}
// Perform actions (e.g., decrease hunger, thirst, social)
function performAction(action, value) {
    const maxDecrease = 10; // Maximum percentage to decrease

    let newHunger = parseFloat(document.getElementById('hunger-fill').style.width);
    let newThirst = parseFloat(document.getElementById('thirst-fill').style.width);
    let newSocial = parseFloat(document.getElementById('social-fill').style.width);

    const decreaseAmountHunger = Math.min(maxDecrease, Math.floor(elapsedSeconds / 6));
    const decreaseAmountThirst = Math.min(maxDecrease, Math.floor(elapsedSeconds / 4));
    const decreaseAmountSocial = Math.min(maxDecrease, Math.floor(elapsedSeconds / 8));

    if (action === 'decreaseHunger') {
        newHunger = Math.max(0, newHunger - decreaseAmountHunger);
    }

    if (action === 'decreaseThirst') {
        newThirst = Math.max(0, newThirst - decreaseAmountThirst);
    }

    if (action === 'decreaseSocial') {
        newSocial = Math.max(0, newSocial - decreaseAmountSocial);
    }

    if (action === 'increaseHunger') {
        newHunger = Math.min(100, newHunger + value);
    }

    if (action === 'increaseThirst') {
        newThirst = Math.min(100, newThirst + value);
    }

    if (action === 'increaseSocial') {
        newSocial = Math.min(100, newSocial + value);
    }

    updateBars({ hunger: newHunger, thirst: newThirst, social: newSocial });
}

// Stop the game, display "GAME OVER!", and hide the play button
function stopGame() {
    playButtonClicked = false;
    document.getElementById('elapsed-timer').textContent = "GAME OVER!";
    document.getElementById('elapsed-timer').style.color = "red";

    // Remove the play button
    const playButton = document.getElementById('play-button');
    playButton.classList.add('hidden');
    playButton.removeEventListener('click', startIntervals);
}

// Calculate and display click rate
function calculateClickRate(button, lastClickTime) {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastClickTime;
    const clickRate = timeDifference > 0 ? (1000 / timeDifference).toFixed(2) + " clicks/sec" : "N/A";

    const clickRateContainer = document.getElementById('click-rate-container');
    clickRateContainer.textContent = `Click rate (${button}): ${clickRate}`;
}

// Event listeners for the action buttons
document.getElementById('increase-hunger-button').addEventListener('click', () => {
    performAction('increaseHunger', 20);
    hungerCounter++; // Increment hunger counter
    document.getElementById('hunger-counter').textContent = hungerCounter; // Update displayed counter
});

document.getElementById('increase-thirst-button').addEventListener('click', () => {
    performAction('increaseThirst', 20);
    thirstCounter++; // Increment thirst counter
    document.getElementById('thirst-counter').textContent = thirstCounter; // Update displayed counter
});

document.getElementById('increase-social-button').addEventListener('click', () => {
    performAction('increaseSocial', 20);
    socialCounter++; // Increment social counter
    document.getElementById('social-counter').textContent = socialCounter; // Update displayed counter
});

// Event listener for the Simulator button
document.getElementById('simulator-button').addEventListener('click', () => {
    runSim();
});


