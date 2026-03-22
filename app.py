from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# Per-session state (for a single-player demo)
hunger = 100
thirst = 100
social = 100

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/greet', methods=['POST'])
def greet():
    name = request.form.get('name', '').strip()
    if not name:
        return redirect(url_for('index'))
    return redirect(url_for('game', name=name))

@app.route('/game/<name>')
def game(name):
    global hunger, thirst, social
    # Reset state for a fresh game
    hunger = 100
    thirst = 100
    social = 100
    return render_template('game.html', player_name=name, hunger=hunger, thirst=thirst, social=social)

@app.route('/perform_action/<action>')
def perform_action(action):
    global hunger, thirst, social

    if action == 'eat':
        hunger = min(100, hunger + 20)
    elif action == 'drink':
        thirst = min(100, thirst + 20)
    elif action == 'call':
        social = min(100, social + 20)

    return jsonify({'hunger': hunger, 'thirst': thirst, 'social': social})

@app.route('/decrease_bars', methods=['POST'])
def decrease_bars():
    global hunger, thirst, social
    data = request.get_json()
    bar = data.get('bar')
    amount = int(data.get('amount', 5))

    if bar == 'hunger':
        hunger = max(0, hunger - amount)
    elif bar == 'thirst':
        thirst = max(0, thirst - amount)
    elif bar == 'social':
        social = max(0, social - amount)

    return jsonify({'hunger': hunger, 'thirst': thirst, 'social': social})

if __name__ == '__main__':
    app.run(debug=True)