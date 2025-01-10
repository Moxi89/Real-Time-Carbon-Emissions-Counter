from flask import Flask
from app import app as flask_app

app = flask_app

def handle_request(request):
    """Handle incoming requests."""
    return app(request)
