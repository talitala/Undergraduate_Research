// Game state — initial values injected from Flask via data attributes on <body>
let elapsedSeconds = 0;
let running = false;
let simRunning = false;

let hunger = parseInt(document.body.dataset.hunger);
let thirst = parseInt(document.body.dataset.thirst);
let social = parseInt(document.body.dataset.social);

let hungerClicks = 0, thirstClicks = 0, socialClicks = 0;

const actionBtns = ['eat-btn', 'drink-btn', 'call-btn'];

// ── UTILITIES ──

function formatTime(v) { return v < 10 ? `0${v}` : `${v}`; }

function currentTimestamp() {
    return formatTime(Math.floor(elapsedSeconds / 3600)) + ':' +
           formatTime(Math.floor((elapsedSeconds % 3600) / 60)) + ':' +
           formatTime(elapsedSeconds % 60);
}

function log(msg) {
    const el = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="ts">[${currentTimestamp()}]</span>${msg}`;
    el.prepend(entry);
}

function updateTimerDisplay() {
    const h = formatTime(Math.floor(elapsedSeconds / 3600));
    const m = formatTime(Math.floor((elapsedSeconds % 3600) / 60));
    const s = formatTime(elapsedSeconds % 60);
    document.getElementById('timer-display').textContent = `${h}:${m}:${s}`;
}

// ── BAR UPDATES ──

function updateBars(data) {
    hunger = data.hunger;
    thirst = data.thirst;
    social = data.social;
    setBar('hunger', hunger);
    setBar('thirst', thirst);
    setBar('social', social);
    if (hunger === 0 || thirst === 0 || social === 0) endGame();
}

function setBar(name, value) {
    document.getElementById(`${name}-fill`).style.width = value + '%';
    document.getElementById(`${name}-value`).textContent = value + '%';

    const card   = document.getElementById(`${name}-card`);
    const status = document.getElementById(`${name}-status`);

    card.classList.toggle('critical', value <= 20);

    if (value <= 20)      status.textContent = '⚠ critical';
    else if (value <= 50) status.textContent = 'low';
    else                  status.textContent = 'nominal';
}

// ── GAME FLOW ──

function startGame() {
    if (running) return;
    running = true;
    document.getElementById('play-btn').disabled = true;
    document.getElementById('sim-btn').disabled  = false;
    actionBtns.forEach(id => document.getElementById(id).disabled = false);
    log('game started');

    // Stopwatch
    setInterval(() => {
        if (running) { elapsedSeconds++; updateTimerDisplay(); }
    }, 1000);

    // Hunger decays every 6s
    setInterval(() => {
        if (!running) return;
        const amt = Math.min(10, Math.max(1, Math.floor(elapsedSeconds / 6)));
        hunger = Math.max(0, hunger - amt);
        syncBar('hunger', amt);
        setBar('hunger', hunger);
        if (hunger === 0) endGame();
    }, 6000);

    // Thirst decays every 4s
    setInterval(() => {
        if (!running) return;
        const amt = Math.min(10, Math.max(1, Math.floor(elapsedSeconds / 4)));
        thirst = Math.max(0, thirst - amt);
        syncBar('thirst', amt);
        setBar('thirst', thirst);
        if (thirst === 0) endGame();
    }, 4000);

    // Social decays every 8s
    setInterval(() => {
        if (!running) return;
        const amt = Math.min(10, Math.max(1, Math.floor(elapsedSeconds / 8)));
        social = Math.max(0, social - amt);
        syncBar('social', amt);
        setBar('social', social);
        if (social === 0) endGame();
    }, 8000);
}

// Keep backend in sync
function syncBar(bar, amount) {
    fetch('/decrease_bars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bar, amount })
    });
}

function doAction(action, stat) {
    if (!running) return;
    fetch(`/perform_action/${action}`)
        .then(r => r.json())
        .then(data => {
            updateBars(data);
            if (stat === 'hunger') {
                hungerClicks++;
                document.getElementById('hunger-clicks').textContent = hungerClicks;
                log('ate food (+20 hunger)');
            } else if (stat === 'thirst') {
                thirstClicks++;
                document.getElementById('thirst-clicks').textContent = thirstClicks;
                log('drank water (+20 thirst)');
            } else if (stat === 'social') {
                socialClicks++;
                document.getElementById('social-clicks').textContent = socialClicks;
                log('called a friend (+20 social)');
            }
        });
}

function startSim() {
    if (simRunning || !running) return;
    simRunning = true;
    document.getElementById('sim-btn').disabled = true;
    log('⚡ simulator activated');

    const actions = [
        { action: 'eat',   stat: 'hunger' },
        { action: 'drink', stat: 'thirst' },
        { action: 'call',  stat: 'social' }
    ];

    setInterval(() => {
        if (!running) return;
        const pick = actions[Math.floor(Math.random() * 3)];
        doAction(pick.action, pick.stat);
    }, 5000);
}

function endGame() {
    if (!running) return;
    running = false;

    const timerEl = document.getElementById('timer-display');
    timerEl.classList.add('game-over');
    timerEl.textContent = 'GAME OVER';

    actionBtns.forEach(id => document.getElementById(id).disabled = true);
    document.getElementById('sim-btn').disabled = true;

    document.getElementById('final-time').textContent = currentTimestamp();

    setTimeout(() => {
        document.getElementById('game-over-overlay').classList.add('show');
    }, 800);
}