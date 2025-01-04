from flask import Flask, render_template
from os import environ

app = Flask(__name__)
app.config['SECRET_KEY'] = environ.get('SECRET_KEY', 'default-secret-key')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/disclaimer')
def disclaimer():
    return render_template('disclaimer.html')

if __name__ == '__main__':
    # Only enable debug mode in development
    debug = environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=int(environ.get('PORT', 5000)), debug=debug)
