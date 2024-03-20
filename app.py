from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# Initial values for bars
hunger = 50
thirst = 50
social = 50

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/greet', methods=['POST'])
def greet():
    if request.method == 'POST':
        name = request.form['name']
        greeting = f"Hello, {name}! Welcome to the Game of LAIfe"
        return redirect(url_for('game', name=name))

@app.route('/game/<name>')
def game(name):
    global hunger, thirst, social
    return render_template('game.html', player_name=name, hunger=hunger, thirst=thirst, social=social)

@app.route('/update_bars')
def update_bars():
    global hunger, thirst, social
    hunger -= get_random_value()
    thirst -= get_random_value()
    social -= get_random_value()

    # Ensure values are within bounds
    hunger = max(0, hunger)
    thirst = max(0, thirst)
    social = max(0, social)

    return jsonify({
        'hunger': hunger,
        'thirst': thirst,
        'social': social
    })

# New route to handle the actions
@app.route('/perform_action/<action>')
def perform_action(action):
    global hunger, thirst, social

    # Adjust the bar values based on the selected action
    if action == 'eat':
        hunger += 20
    elif action == 'drink':
        thirst += 20
    elif action == 'call':
        social += 20

    # Ensure values are within bounds
    hunger = min(100, hunger)
    thirst = min(100, thirst)
    social = min(100, social)

    return jsonify({
        'hunger': hunger,
        'thirst': thirst,
        'social': social
    })

def get_random_value():
    # Get a random value between 5 and 15
    import random
    return random.randint(5, 15)

if __name__ == '__main__':
    app.run(debug=True)