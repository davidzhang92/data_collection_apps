from flask import Flask
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from prometheus_client import make_wsgi_app

# Create my app
app = Flask(__name__)

# Add prometheus wsgi middleware to route /metrics requests
@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
        '/api/metrics': make_wsgi_app()
    })
    return app.wsgi_app