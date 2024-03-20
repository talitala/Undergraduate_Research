// Initialize variables
let elapsedSeconds = 0;
let playButtonClicked = false;

// Update progress bars and check game over condition
// Update progress bars and check game over condition
function updateBars(data) {
    updateBar("hunger-fill", "hunger-level", data.hunger);
    updateBar("thirst-fill", "thirst-level", data.thirst);
    updateBar("social-fill", "social-level", data.social);

    // Check if either hunger or thirst is at 0%
    if (data.hunger === 0 || data.thirst === 0) {
        stopGame();
    } else {
        // Check if all bars are at 0%
        if (data.hunger === 0 && data.thirst === 0 && data.social === 0) {
            stopGame();
        }
    }

    // Update color classes based on fill percentages
    updateColorClass("hunger-fill", data.hunger);
    updateColorClass("thirst-fill", data.thirst);
    updateColorClass("social-fill", data.social);
}

// Update individual progress bar and its corresponding level indicator
function updateBar(fillId, levelId, value) {
    const fill = document.getElementById(fillId);
    const level = document.getElementById(levelId);

    // Preserve the current percentage of the other bars
    const currentWidth = parseFloat(fill.style.width) || 0;
    const newValue = Math.max(0, Math.min(value, 100));

    // If the new value is less than the current width, use the new value; otherwise, use the current width
    const newWidth = newValue < currentWidth ? newValue : currentWidth;

    fill.style.width = newWidth + "%";
    level.textContent = newWidth + "%";
}

// Update color classes based on fill percentage
function updateColorClass(barId, fillPercentage) {
    const bar = document.getElementById(barId);

    bar.classList.remove("low", "very-low"); // Remove existing classes

    if (fillPercentage < 50 && fillPercentage >= 20) {
        bar.classList.add("low"); // Add low class for yellow color
    } else if (fillPercentage < 20) {
        bar.classList.add("very-low"); // Add very-low class for red color
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
            const needs = assessNeeds();
            aiDecision(needs); // Call the AI decision function
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

// Assess AI character's needs based on hunger, thirst, and social levels
function assessNeeds() {
    const hunger = parseFloat(document.getElementById('hunger-fill').style.width);
    const thirst = parseFloat(document.getElementById('thirst-fill').style.width);
    const social = parseFloat(document.getElementById('social-fill').style.width);

    return { hunger, thirst, social };
}

// AI Decision-Making
function aiDecision(needs) {
    const hungerThreshold = 30;
    const thirstThreshold = 30;
    const socialThreshold = 30;

    const isHungerLow = needs.hunger < hungerThreshold || document.getElementById('hunger-fill').classList.contains('low');
    const isThirstLow = needs.thirst < thirstThreshold || document.getElementById('thirst-fill').classList.contains('low');
    const isSocialLow = needs.social < socialThreshold || document.getElementById('social-fill').classList.contains('low');

    if (isHungerLow) {
        performActionAndDisplayMessage('eat', 'The AI has eaten');
    } else if (isThirstLow) {
        performActionAndDisplayMessage('drink', 'The AI has drunk');
    } else if (isSocialLow) {
        performActionAndDisplayMessage('call', 'The AI has socialized');
    } else {
        // If all needs are relatively satisfied, perform a default action or no action
        // performDefaultAction();
    }
}

// Perform actions and display messages
function performActionAndDisplayMessage(action, message) {
    performAction(action);
    displayMessage(message);
}

// Display message on the screen
function displayMessage(message) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;

    // Clear the message after a few seconds
    setTimeout(() => {
        messageContainer.textContent = '';
    }, 3000);
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

// Perform actions (e.g., decrease hunger, thirst, social)
// Perform actions (e.g., decrease hunger, thirst, social)
function performAction(action) {
    const maxDecrease = 10; // Maximum percentage to decrease
    const maxIncrease = 20; // Maximum percentage to increase

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

    // Increase the corresponding bar by 20%
    if (action === 'eat') {
        newHunger = Math.min(100, newHunger + maxIncrease);
    }

    if (action === 'drink') {
        newThirst = Math.min(100, newThirst + maxIncrease);
    }

    if (action === 'call') {
        newSocial = Math.min(100, newSocial + maxIncrease);
    }

    updateBars({ hunger: newHunger, thirst: newThirst, social: newSocial });
}


// Event listener for the play button
document.getElementById('play-button').addEventListener('click', () => {
    startIntervals();
    document.getElementById('play-button').classList.add('hidden');
});

// Event listener for the stop button
document.getElementById('stop-button').addEventListener('click', () => {
    playButtonClicked = false;
    document.getElementById('play-button').classList.remove('hidden');
});
