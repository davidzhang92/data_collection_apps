from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pyodbc
import jwt
from functools import wraps

app = Flask(__name__)



dsn = 'DataCollection'

# Establish the connection
conn = pyodbc.connect('DSN=DataCollection;UID=sa;PWD=Cannon45!')
SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = None

        
        if 'Authorization' in request.headers:
            access_token = request.headers['Authorization']


        if 'x-access-token' in request.headers:
            access_token = request.headers['x-access-token']

        if not access_token:
            return jsonify({'error': 'invalid token'}), 401

        try:
            data = jwt.decode(access_token, SECRET_KEY, algorithms=['HS256'])
            access_level = data.get('access_level')

            # if access_level not in ['read-only', 'operator', 'admin']:
            if access_level not in ['read-only', 'operator', 'admin']:
                return jsonify({'message': 'Error: You don\'t have sufficient privilege to perform this action.'}), 403
            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated


@app.route('/api/get-token-authentication', methods=['GET'])
@token_required
def get_token_authentication():
    access_token = request.headers['Authorization']
    if access_token is not None:
        try:
            jwt.decode(access_token, SECRET_KEY, algorithms=['HS256'])
            response = make_response(jsonify({'message': 'access token is valid'}), 200)
            return response
        
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError as jwt_error:
            return jsonify({str(jwt_error)}), 401
                

        except Exception as e:
            return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'No token provided.'}), 400


if __name__ == '__main__':
    app.run()
    
