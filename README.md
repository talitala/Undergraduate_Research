# Game of LAIfe

A browser-based survival game where you manage three vital stats — **hunger**, **thirst**, and **social** — to stay alive as long as possible. Built with Flask and vanilla JS.

---

## How to Run

**1. Install dependencies**
```bash
pip install flask
```

**2. Start the server**
```bash
python app.py
```

**3. Open your browser**
```
http://127.0.0.1:5000
```

---

## How to Play

1. Enter your name on the welcome screen and click **Initialize Game**
2. Press **Start Game** to begin — your stats will start decaying over time
3. Use the action buttons to keep your stats from hitting zero:
   - 🍔 **Eat something** — restores Hunger
   - 💧 **Drink water** — restores Thirst
   - 📞 **Call a friend** — restores Social
4. If any stat reaches **0%**, it's game over
5. Optionally hit **Run Simulator** to have the game play itself automatically

The longer you survive, the faster your stats decay — so act quickly.

---

## Project Structure

```
project/
├── app.py                  # Flask backend, routes, game state
├── static/
│   ├── style.css           # All styles
│   └── script.js           # All game logic
└── templates/
    ├── index.html          # Welcome / name entry screen
    └── game.html           # Main game screen
```

---

## Stack

- **Backend** — Python / Flask
- **Frontend** — HTML, CSS, Vanilla JS
- **Fonts** — Syne + DM Mono (Google Fonts)

---

## Known Limitations

- Game state is stored in global Python variables, so it is shared across all browser sessions. For a multi-user setup, state would need to move to a database or session storage.
- Refreshing the game page mid-game resets the stat values on the backend but not the frontend timer — just click Play Again to start fresh.
